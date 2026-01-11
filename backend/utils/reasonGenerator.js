// utils/reasonGenerator.js
// Generate human-readable reason for prediction

/**
 * Generate reason string based on eligibility, scores, and bucket
 * 
 * @param {Object} params
 * @param {boolean} params.eligible - Eligibility status
 * @param {string} params.bucket - Bucket classification
 * @param {number} params.compositeScore - Composite score
 * @param {number} params.profileScore - Profile score
 * @param {number} params.finalScore - Final score
 * @param {Object} params.cutoff - Cutoff values
 * @param {Object} params.userPercentiles - User's CAT percentiles
 * @returns {string} Reason message
 */
exports.generateReason = ({ 
  eligible, 
  bucket, 
  compositeScore, 
  profileScore, 
  finalScore,
  cutoff,
  userPercentiles 
}) => {
  if (!eligible) {
    // Check which cutoff failed
    const reasons = [];
    if (cutoff.VARC && userPercentiles.varc < cutoff.VARC) {
      reasons.push(`VARC cutoff (${cutoff.VARC}%) not cleared`);
    }
    if (cutoff.DILR && userPercentiles.dilr < cutoff.DILR) {
      reasons.push(`DILR cutoff (${cutoff.DILR}%) not cleared`);
    }
    if (cutoff.QA && userPercentiles.qa < cutoff.QA) {
      reasons.push(`QA cutoff (${cutoff.QA}%) not cleared`);
    }
    if (cutoff.OVERALL && userPercentiles.overall < cutoff.OVERALL) {
      reasons.push(`Overall cutoff (${cutoff.OVERALL}%) not cleared`);
    }
    
    if (reasons.length > 0) {
      return reasons.join("; ");
    }
    return "Eligibility criteria not met";
  }

  if (bucket === "SAFE") {
    if (finalScore >= 85) {
      return "Excellent overall profile with strong CAT performance";
    }
    return "Strong CAT score well above cutoff with good profile";
  }

  if (bucket === "BORDERLINE") {
    if (profileScore < 15) {
      return "CAT score meets cutoff but profile needs strengthening";
    }
    return "Decent chance - borderline on cutoffs with moderate profile";
  }

  if (bucket === "DREAM") {
    if (profileScore >= 20) {
      return "Profile is strong but CAT score is just above cutoff";
    }
    return "CAT score barely clears cutoff - profile can be improved";
  }

  return "Evaluation based on composite score and profile";
};
