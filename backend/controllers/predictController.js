const IIM = require("../models/IIM");
const { calculateCompositeScore } = require("../utils/compositeScore");
const { calculateProfileScore } = require("../utils/profileScore");
const { getBucket } = require("../utils/bucketCalculator");
const { mapProbability } = require("../utils/probabilityMapper");
const { generateReason } = require("../utils/reasonGenerator");

/**
 * Main prediction controller
 * Implements Phase-2 (Composite Score + Bucket) and Phase-3 (Profile Score) logic
 */
exports.predict = async (req, res) => {
  try {
    console.log("Received prediction request:", req.body);
    
  const {
    category,
    VARC,
    DILR,
    QA,
    OVERALL,
      // Academic details
      class10,
      class10Percentage,
      class12,
      class12Percentage,
      graduation,
      gradPercentage,
      cgpa,
      // Work experience
      workex_months,
      workExpJuly,
      workExpDec,
      workExpJan,
      // Personal details (for eligibility, not scoring)
      gender,
      pwdStatus
    } = req.body;

    // Normalize category
    let normalizedCategory = category?.toUpperCase() || "GEN";
    if (normalizedCategory === "NC-OBC" || normalizedCategory === "OBC") {
      normalizedCategory = "OBC";
    } else if (normalizedCategory === "GENERAL") {
      normalizedCategory = "GEN";
    }

    // Extract CAT percentiles (ensure numbers)
    const percentileVARC = parseFloat(VARC) || 0;
    const percentileDILR = parseFloat(DILR) || 0;
    const percentileQA = parseFloat(QA) || 0;
    const percentileOVERALL = parseFloat(OVERALL) || 0;

    // Normalize academic percentages
    const class10Percent = parseFloat(class10 || class10Percentage || 0);
    const class12Percent = parseFloat(class12 || class12Percentage || 0);
    const gradPercent = parseFloat(graduation || gradPercentage || (cgpa ? parseFloat(cgpa) * 10 : 0));

    // Normalize work experience (use July if available, otherwise workex_months)
    const workExp = parseFloat(workex_months || workExpJuly || 0);

    // Debug logging for profile data
    console.log("Profile Input Data:", {
      class10: class10Percent,
      class12: class12Percent,
      graduation: gradPercent,
      workex: workExp,
      raw: { graduation, gradPercentage, cgpa, workex_months, workExpJuly }
    });

    // Normalize gender for cutoff matching
    let normalizedGender = gender?.toUpperCase() || "MALE";
    if (normalizedGender === "OTHER") {
      normalizedGender = "TG";
    }

    // Check MongoDB connection
    const mongoose = require("mongoose");
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        error: "Database connection error",
        message: "MongoDB is not connected. Please check your database connection and try again."
      });
    }

    const iims = await IIM.find();
    console.log(`Found ${iims.length} IIMs in database`);
    
    if (iims.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No IIM data found in database. Please seed the database first.",
        results: []
      });
    }
    
    const results = [];

    // Calculate Phase-2 Composite Score (once, used for all IIMs)
    const compositeScore = calculateCompositeScore({
      overall: percentileOVERALL,
      varc: percentileVARC,
      dilr: percentileDILR,
      qa: percentileQA
    });

    // Calculate Phase-3 Profile Score (once, used for all IIMs)
    const profileScore = calculateProfileScore({
      class10: class10Percent,
      class12: class12Percent,
      graduation: gradPercent,
      workex_months: workExp
    });
    
    console.log("Calculated Profile Score:", profileScore);

    // Process each IIM
    for (let iim of iims) {
      // Find matching cutoff by category (with gender consideration if applicable)
      let cutoff = null;
      
      // Try to find cutoff matching category and gender
      if (normalizedGender === "FEMALE" || normalizedGender === "TG") {
        cutoff = iim.cutoffs.find(c => 
          c.category === normalizedCategory && 
          (c.gender === "Female_TG" || c.gender === "FEMALE" || !c.gender)
        );
      }
      
      // If not found, try without gender filter
      if (!cutoff) {
        cutoff = iim.cutoffs.find(c => 
          c.category === normalizedCategory && 
          (!c.gender || c.gender === "Male" || c.gender === "MALE")
        );
      }
      
      // Fallback to GEN if category not found
      if (!cutoff) {
        cutoff = iim.cutoffs.find(c => c.category === "GEN" && !c.gender);
      }
      
      if (!cutoff) {
        console.log(`No cutoff found for ${iim.name}, category: ${normalizedCategory}`);
        continue;
      }

      // Extract cutoff values (handle null)
      const varcCutoff = cutoff.VARC !== null && cutoff.VARC !== undefined ? cutoff.VARC : null;
      const dilrCutoff = cutoff.DILR !== null && cutoff.DILR !== undefined ? cutoff.DILR : null;
      const qaCutoff = cutoff.QA !== null && cutoff.QA !== undefined ? cutoff.QA : null;
      const overallCutoff = cutoff.OVERALL !== null && cutoff.OVERALL !== undefined ? cutoff.OVERALL : null;

      // ✅ Phase-1 Eligibility Check
      // If ANY sectional percentile < sectional cutoff → eligible = false
      // If overall < overall cutoff → eligible = false
      let eligible = true;
      const eligibilityReasons = [];

      if (varcCutoff !== null && percentileVARC < varcCutoff) {
        eligible = false;
        eligibilityReasons.push(`VARC`);
      }
      if (dilrCutoff !== null && percentileDILR < dilrCutoff) {
        eligible = false;
        eligibilityReasons.push(`DILR`);
      }
      if (qaCutoff !== null && percentileQA < qaCutoff) {
        eligible = false;
        eligibilityReasons.push(`QA`);
      }
      if (overallCutoff !== null && percentileOVERALL < overallCutoff) {
        eligible = false;
        eligibilityReasons.push(`OVERALL`);
      }

      // ✅ Phase-2: Bucket Classification
      const bucket = getBucket({
        compositeScore,
        overallCutoff: overallCutoff || 0,
        eligible
      });

      // ✅ Final Score Calculation
      // finalScore = compositeScore + (profileScore * 0.3)
      const finalScore = compositeScore + (profileScore * 0.3);

      // ✅ Probability Mapping
      const probability = mapProbability(finalScore);

      // ✅ Generate Reason
      const reason = generateReason({
        eligible,
        bucket,
        compositeScore,
        profileScore,
        finalScore,
        cutoff: {
          VARC: varcCutoff,
          DILR: dilrCutoff,
          QA: qaCutoff,
          OVERALL: overallCutoff
        },
        userPercentiles: {
          varc: percentileVARC,
          dilr: percentileDILR,
          qa: percentileQA,
          overall: percentileOVERALL
        }
      });

      // Map probability to chance for frontend compatibility
      let chance = "low";
      if (probability === "Very High") chance = "high";
      else if (probability === "High") chance = "high";
      else if (probability === "Medium") chance = "medium";
      else if (probability === "Low") chance = "low";
      else chance = "very_low";

    results.push({
      iim: iim.name,
      eligible,
      bucket,
        compositeScore: Math.round(compositeScore * 10) / 10,
        profileScore: Math.round(profileScore * 10) / 10,
        finalScore: Math.round(finalScore * 10) / 10,
        probability,
        chance, // For frontend compatibility
        reason
      });
    }

    // Sort results by finalScore (highest first)
    results.sort((a, b) => b.finalScore - a.finalScore);

    console.log(`Generated ${results.length} predictions`);
    console.log(`Sample: ${results[0]?.iim} - ${results[0]?.probability} (Final Score: ${results[0]?.finalScore})`);

  res.json({
    success: true,
    results
  });
  } catch (error) {
    console.error("Prediction error:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
};
