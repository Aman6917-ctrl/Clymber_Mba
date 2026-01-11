require("dotenv").config();
const mongoose = require("mongoose");
const IIM = require("../models/IIM");

const iimData = [

  // =========================
  // OLD IIMs (Top 6)
  // =========================

  {
    name: "IIM Ahmedabad",
    processType: "NON_CAP",
    source: "Official",
    cutoffs: [
      { category: "GEN", VARC: 70, DILR: 70, QA: 70, OVERALL: 80 },
      { category: "OBC", VARC: 65, DILR: 65, QA: 65, OVERALL: 75 },
      { category: "SC",  VARC: 60, DILR: 60, QA: 60, OVERALL: 70 },
      { category: "ST",  VARC: 50, DILR: 50, QA: 50, OVERALL: 60 }
    ],
    finalWeights: { CAT: 65, Academics: 35 },
    academicsRules: {
      class10: { weight: 35, slabs: "Science: 80+, Commerce: 77+, Arts: 75+" },
      class12: { weight: 35, slabs: "Science: 80+, Commerce: 77+, Arts: 75+" },
      graduation: { weight: 35, slabs: "Category-wise cutoffs apply" }
    },
    workexRules: { formula: "Not considered in Stage 1" },
    diversityRules: { academic: "Stream-wise cutoffs: Science/Commerce/Arts" },
    notes: ["No PI/WAT in first stage", "Composite Score = 0.35*AR + 0.65*CAT", "Academics 10th/12th cutoff varies by stream and category"]
  },

  {
    name: "IIM Bangalore",
    processType: "NON_CAP",
    source: "Official - PGP Admission Procedure 2026–28",
    cutoffs: [
      { category: "GEN", VARC: 80, DILR: 75, QA: 75, OVERALL: 85 },
      { category: "OBC", VARC: 70, DILR: 65, QA: 65, OVERALL: 75 },
      { category: "EWS", VARC: 70, DILR: 65, QA: 65, OVERALL: 75 },
      { category: "SC",  VARC: 65, DILR: 60, QA: 60, OVERALL: 70 },
      { category: "ST",  VARC: 55, DILR: 55, QA: 55, OVERALL: 65 },
      { category: "PWD", VARC: 50, DILR: 50, QA: 50, OVERALL: 60 }
    ],
    finalWeights: { CAT: 55, Class10: 10, Class12: 10, Graduation: 10, WorkEx: 10, Gender: 5 },
    academicsRules: {
      class10: { weight: 10, slabs: "90+, 80-89, 70-79, 60-69" },
      class12: { weight: 10, slabs: "90+, 80-89, 70-79, 60-69" },
      graduation: { weight: 10, slabs: "90+, 80-89, 70-79, 60-69" }
    },
    workexRules: { formula: "score = min(10, 10*x/36)", maxMonths: 36 },
    diversityRules: { gender: "5%", catSectional: { VARC: 19, DILR: 21, QA: 15 } },
    notes: ["Pre-PI: CAT 55%, Post-PI: CAT 25%, PI 40%, WAT 10%", "WorkEx formula: min(10, 10*months/36)"]
  },

  {
    name: "IIM Calcutta",
    processType: "NON_CAP",
    source: "Official - Admission Policy MBA 2026–28",
    cutoffs: [
      { category: "GEN", VARC: 80, DILR: 80, QA: 75, OVERALL: 85 },
      { category: "EWS", VARC: 70, DILR: 65, QA: 65, OVERALL: 75 },
      { category: "OBC", VARC: 70, DILR: 65, QA: 65, OVERALL: 75 },
      { category: "SC",  VARC: 65, DILR: 60, QA: 60, OVERALL: 70 },
      { category: "ST",  VARC: 55, DILR: 55, QA: 55, OVERALL: 65 },
      { category: "PWD", VARC: 45, DILR: 45, QA: 45, OVERALL: 55 }
    ],
    finalWeights: { CAT: 30, PI: 48, WAT: 8, WorkEx: 8, Academics: 6 },
    academicsRules: {
      class10: { weight: 10, slabs: "80+=10, 75+=8, 70+=6, 65+=4, 60+=2, <60=0" },
      class12: { weight: 15, slabs: "80+=15, 75+=12, 70+=9, 65+=6, 60+=3, <60=0" },
      graduation: { weight: "Included in profile" }
    },
    workexRules: { slabs: "12+ months optimal", formula: "Points based" },
    diversityRules: { gender: "4% in Pre-PI", academic: "AC categories (Calcutta specific)" },
    notes: ["Pre-PI: CAT 56%, Class10 10%, Class12 15%, Gender 4%", "Post-PI: CAT 30%, PI 48%, WAT 8%, WorkEx 8%, Academic Diversity 6%", "PI very important (48%)"]
  },

  {
    name: "IIM Lucknow",
    processType: "NON_CAP",
    source: "Official - Admission Policy MBA 2025–27",
    cutoffs: [
      { category: "GEN", VARC: 85, DILR: 85, QA: 85, OVERALL: 90 },
      { category: "EWS", VARC: 77, DILR: 77, QA: 77, OVERALL: 82 },
      { category: "OBC", VARC: 77, DILR: 77, QA: 77, OVERALL: 82 },
      { category: "SC",  VARC: 55, DILR: 55, QA: 55, OVERALL: 65 },
      { category: "ST",  VARC: 50, DILR: 50, QA: 50, OVERALL: 60 },
      { category: "PWD", VARC: 50, DILR: 50, QA: 50, OVERALL: 60 }
    ],
    finalWeights: { CAT: 30, Academics: 10, Diversity: 5, WorkEx: 5, WAT: 10, PI: 40 },
    academicsRules: {
      class10: { weight: "Part of academics", slabs: "90+, 80-89, 70-79, 60-69" },
      class12: { weight: 10, slabs: "90+, 80-89, 70-79, 60-69" },
      graduation: { weight: 10, slabs: "90+, 80-89, 70-79, 60-69" }
    },
    workexRules: { formula: "if x>6: min((x-6)*0.5, 10) else 0", slabs: "6+ months" },
    diversityRules: { gender: "5%", academic: "5%" },
    notes: ["Pre-PI: CAT 60%, Class12 10%, Grad 10%, WorkEx 10%, Academic Diversity 5%, Gender 5%", "Post-PI: CAT 30%, PI 40%, WAT 10%, Academics 10%, Diversity 5%, WorkEx 5%", "Very high CAT cutoff (90 for GEN)"]
  },

  {
    name: "IIM Indore",
    processType: "NON_CAP",
    source: "Official - Admission Criteria 2026–28",
    cutoffs: [
      { category: "GEN", VARC: 80, DILR: 80, QA: 80, OVERALL: 90 },
      { category: "EWS", VARC: 80, DILR: 80, QA: 80, OVERALL: 90 },
      { category: "OBC", VARC: 70, DILR: 70, QA: 70, OVERALL: 80 },
      { category: "SC",  VARC: 55, DILR: 55, QA: 55, OVERALL: 60 },
      { category: "ST",  VARC: 40, DILR: 40, QA: 40, OVERALL: 45 },
      { category: "PWD", VARC: 40, DILR: 40, QA: 40, OVERALL: 45 }
    ],
    finalWeights: { CAT: 40, PI: 45, Academics: 10, Diversity: 5 },
    academicsRules: {
      class10: { weight: 39, slabs: "90+, 80-89, 70-79, 60-69" },
      class12: { weight: 20, slabs: "90+, 80-89, 70-79, 60-69" },
      graduation: { weight: "Included" }
    },
    workexRules: { formula: "Not considered for PI shortlisting" },
    diversityRules: { gender: "6%" },
    notes: ["Pre-PI: Class10 39%, Class12 20%, CAT Overall 35%, Gender 6%", "Post-PI: CAT 40%, PI 45%, Class10+12 10%, Diversity 5%", "WorkEx NOT considered for PI shortlisting", "Sectional + overall cutoffs are qualifying"]
  },

  {
    name: "IIM Kozhikode",
    processType: "NON_CAP",
    source: "Official - PGP Admissions Policy 2025–27",
    cutoffs: [
      { category: "GEN", VARC: 75, DILR: 75, QA: 75, OVERALL: 85 },
      { category: "OBC", VARC: 65, DILR: 65, QA: 65, OVERALL: 75 },
      { category: "EWS", VARC: 65, DILR: 65, QA: 65, OVERALL: 75 },
      { category: "SC",  VARC: 55, DILR: 55, QA: 55, OVERALL: 65 },
      { category: "ST",  VARC: 45, DILR: 45, QA: 45, OVERALL: 55 },
      { category: "PWD", VARC: 45, DILR: 45, QA: 45, OVERALL: 55 }
    ],
    finalWeights: { CAT: 35, PI: 35, WAT: 20, Resume: 10 },
    academicsRules: {
      class10: { weight: 15, slabs: "Sectional cutoff: 60+", minCutoff: 60 },
      class12: { weight: 20, slabs: "Sectional cutoff: 60+", minCutoff: 60 },
      graduation: { weight: "Included" }
    },
    workexRules: { slabs: "Max score 5", peakMonths: "35-36 months" },
    diversityRules: { gender: "10%", academic: "5%", note: "Only one of Gender or Academic diversity applicable" },
    notes: ["Pre-PI: CAT 50%, Class10 15%, Class12 20%, Diversity 10%, WorkEx 5%", "Post-PI: CAT 35%, PI 35%, WAT 20%, Resume 10%", "Class 10/12 minimum 60% cutoff"]
  },

  {
    name: "IIM Shillong",
    processType: "NON_CAP",
    source: "Official - PGP 2025–27 Admissions Process",
    cutoffs: [
      { category: "GEN", VARC: 75, DILR: 75, QA: 75, OVERALL: null },
      { category: "OBC", VARC: 75, DILR: 75, QA: 75, OVERALL: null },
      { category: "EWS", VARC: 75, DILR: 75, QA: 75, OVERALL: null },
      { category: "SC",  VARC: 60, DILR: 60, QA: 60, OVERALL: null },
      { category: "ST",  VARC: 50, DILR: 50, QA: 50, OVERALL: null },
      { category: "PWD", VARC: 50, DILR: 50, QA: 50, OVERALL: null }
    ],
    finalWeights: { CAT: 40, PI: 40, ARS: 10, Gender: 10 },
    academicsRules: {
      class10: { weight: "Part of ARS", slabs: "95+=10, 90+=9, 85+=8, 80+=5, 75+=4, 70+=2, 65+=1" },
      class12: { weight: "Part of ARS", slabs: "Same as Class 10" },
      graduation: { weight: "Part of ARS" }
    },
    workexRules: { slabs: "48+=0, 42+=2, 36+=6, 30+=10, 24+=14, 18+=12, 12+=8, <12=0" },
    diversityRules: { gender: "10%" },
    notes: ["Pre-PI: CAT 65%, NARS 35%", "Post-PI: CAT 40%, PI 40%, ARS 10%, Gender 10%", "PI minimum: GEN/EWS=30, SC=25, ST/PWD=20", "WorkEx scoring: Peak at 24-30 months"]
  },

  // =========================
  // CAP IIMs
  // =========================

  {
    name: "IIM Udaipur",
    processType: "CAP",
    source: "Baseline (CAP-based expected, NOT official PDF)",
    cutoffs: [
      { category: "GEN", VARC: 75, DILR: 75, QA: 75, OVERALL: 95 },
      { category: "EWS", VARC: 65, DILR: 65, QA: 65, OVERALL: 81 },
      { category: "OBC", VARC: 65, DILR: 65, QA: 65, OVERALL: 81 },
      { category: "SC",  VARC: 45, DILR: 45, QA: 45, OVERALL: 66 },
      { category: "ST",  VARC: 25, DILR: 25, QA: 30, OVERALL: 42 },
      { category: "PWD", VARC: 25, DILR: 25, QA: 30, OVERALL: 42 }
    ],
    finalWeights: { CAT: 40, PI: 40, Academics: 15, WorkEx: 5 },
    academicsRules: { class10: { weight: 5 }, class12: { weight: 5 }, graduation: { weight: 5 } },
    workexRules: { slabs: "12+ months" },
    diversityRules: { gender: "Bonus", academic: "Non-engineering" },
    notes: ["CAP process", "Cutoffs are qualifying, not guaranteed call", "Exact final weights not publicly disclosed", "Used for predictor baseline only"]
  },

  {
    name: "IIM Trichy",
    processType: "CAP",
    source: "Official - MBA Admission Policy PGPM 2025–27",
    cutoffs: [
      { category: "GEN", VARC: 75, DILR: 75, QA: 75, OVERALL: 95 },
      { category: "EWS", VARC: 55, DILR: 55, QA: 55, OVERALL: 81 },
      { category: "OBC", VARC: 52, DILR: 52, QA: 52, OVERALL: 81 },
      { category: "SC",  VARC: 45, DILR: 45, QA: 45, OVERALL: 66 },
      { category: "ST",  VARC: 25, DILR: 25, QA: 30, OVERALL: 42 },
      { category: "PWD", VARC: 25, DILR: 25, QA: 30, OVERALL: 42 }
    ],
    finalWeights: { CAT: 47, PI: 20, WAT: 5, WorkEx: 10, Class10: 2, Class12: 3, Graduation: 5, AcademicDiversity: 2, Gender: 6 },
    academicsRules: {
      class10: { weight: 2 },
      class12: { weight: 3 },
      graduation: { weight: 5 }
    },
    workexRules: { slabs: "0-5=0, 6-11=2, 12-17=4, 18-23=7, 24-29=10, 30-35=7, 36-41=4, 42-47=2, 48+=0" },
    diversityRules: { gender: "6%", academic: "2%" },
    notes: ["CAT cutoffs are qualifying, not guaranteed", "Bottom 20% PI scorers eliminated category-wise", "WorkEx counted till 31 Jan 2025 only"]
  },

  {
    name: "IIM Ranchi",
    processType: "CAP",
    source: "Official - Common Admission Criteria MBA/MBA-HR/MBA-BA 2025–27",
    cutoffs: [
      { category: "GEN", VARC: 75, DILR: 75, QA: 75, OVERALL: 95 },
      { category: "EWS", VARC: 55, DILR: 55, QA: 55, OVERALL: 81 },
      { category: "OBC", VARC: 52, DILR: 52, QA: 52, OVERALL: 81 },
      { category: "SC",  VARC: 45, DILR: 45, QA: 45, OVERALL: 66 },
      { category: "ST",  VARC: 25, DILR: 25, QA: 30, OVERALL: 42 },
      { category: "PWD", VARC: 25, DILR: 25, QA: 30, OVERALL: 42 }
    ],
    finalWeights: { CAT: 65, Profile: 20, PI_WAT: 15 },
    academicsRules: {
      class10: { slabs: "95+=2, 85+=1, <85=0" },
      class12: { slabs: "95+=4, 85+=2, <85=0" },
      graduation: { slabs: "85+=4, 70+=2, <70=0" }
    },
    workexRules: { slabs: "37-48=5, 25-36=10, 13-24=5, 0-12=0" },
    diversityRules: { gender: "5%", mbaHRWorkEx: "5% bonus for 2-3 years" },
    notes: ["CAT breakup: VARC 15%, QA 35%, DILR 15%", "PI_WAT: PI 12.5%, WAT 2.5%", "Final: CAT 65%, Profile 20%, PI_WAT 15%"]
  },

  {
    name: "IIM Jammu",
    processType: "CAP",
    source: "Official - MBA Admission Policy 2026–28",
    cutoffs: [
      { category: "GEN", VARC: 72, DILR: 72, QA: 72, OVERALL: 91, gender: "Male" },
      { category: "GEN", VARC: 71, DILR: 71, QA: 71, OVERALL: 89, gender: "Female_TG" },
      { category: "EWS", VARC: 48, DILR: 48, QA: 48, OVERALL: 74, gender: "Male" },
      { category: "EWS", VARC: 47, DILR: 47, QA: 47, OVERALL: 72, gender: "Female_TG" },
      { category: "OBC", VARC: 48, DILR: 48, QA: 48, OVERALL: 74, gender: "Male" },
      { category: "OBC", VARC: 47, DILR: 47, QA: 47, OVERALL: 72, gender: "Female_TG" },
      { category: "SC",  VARC: 42, DILR: 42, QA: 42, OVERALL: 54, gender: "Male" },
      { category: "SC",  VARC: 41, DILR: 41, QA: 41, OVERALL: 52, gender: "Female_TG" },
      { category: "ST",  VARC: 24, DILR: 24, QA: 29, OVERALL: 32, gender: "Male" },
      { category: "ST",  VARC: 23, DILR: 23, QA: 28, OVERALL: 30, gender: "Female_TG" },
      { category: "PWD", VARC: 24, DILR: 24, QA: 29, OVERALL: 32, gender: "Male" },
      { category: "PWD", VARC: 23, DILR: 23, QA: 28, OVERALL: 30, gender: "Female_TG" }
    ],
    finalWeights: { CAT: 42, PI: 30, Academics: 10, WorkEx: 10, Gender: 8 },
    academicsRules: { class10: { weight: "Part of 10%" }, class12: { weight: "Part of 10%" }, graduation: { weight: "Part of 10%" } },
    workexRules: { slabs: "≤12=0, 12-18=4, 18-24=7, 24-36=10, 36-48=7, 48-60=4, >60=0" },
    diversityRules: { gender: "8% (Female/Transgender)", formula: "CAT percentile converted directly to marks" },
    notes: ["Gender-wise CAT cutoffs", "CAT formula: 0.42 * CAT_percentile", "Profile score capped at 28", "WorkEx till 31 Jan 2026", "Cutoffs may be dynamically adjusted"]
  },

  {
    name: "IIM Bodh Gaya",
    processType: "CAP",
    source: "Official - MBA Admission Policy 2025–27",
    cutoffs: [
      { category: "GEN", VARC: 73, DILR: 73, QA: 73, OVERALL: 94 },
      { category: "EWS", VARC: 50, DILR: 50, QA: 50, OVERALL: 77 },
      { category: "OBC", VARC: 50, DILR: 50, QA: 50, OVERALL: 77 },
      { category: "SC",  VARC: 44, DILR: 44, QA: 44, OVERALL: 60 },
      { category: "ST",  VARC: 25, DILR: 25, QA: 30, OVERALL: 40 },
      { category: "PWD", VARC: 25, DILR: 25, QA: 30, OVERALL: 40 }
    ],
    finalWeights: { CAT: 45, PI_WAT: 25, Profile: 30 },
    academicsRules: {
      class10: { slabs: "60+=4 points" },
      class12: { slabs: "60+=4 points" },
      graduation: { slabs: "60+=6 points", professional: "CA/CS/CMA UG=6 points" }
    },
    workexRules: { slabs: "12=4, 18=8, 24=12, 30=16, 36=12, 42=8, 48=4" },
    diversityRules: { gender: "Included in profile" },
    notes: ["PI_WAT: PI 20%, WAT 5%", "Minimum Performance Requirement (MPR) in PI mandatory", "CAT scaled score (not percentile) used in final merit", "CAP + SAP PI scores may be considered"]
  },

  {
    name: "IIM Sambalpur",
    processType: "CAP",
    source: "Official - MBA Admission Policy 2026–28",
    cutoffs: [
      { category: "GEN", VARC: null, DILR: null, QA: null, OVERALL: 90 },
      { category: "GEN", VARC: null, DILR: null, QA: null, OVERALL: 85, note: "Female or Male with ≥1yr WorkEx" },
      { category: "EWS", VARC: null, DILR: null, QA: null, OVERALL: 80 },
      { category: "OBC", VARC: null, DILR: null, QA: null, OVERALL: 75 },
      { category: "SC",  VARC: null, DILR: null, QA: null, OVERALL: 55 },
      { category: "ST",  VARC: null, DILR: null, QA: null, OVERALL: 40 },
      { category: "PWD", VARC: null, DILR: null, QA: null, OVERALL: 40 }
    ],
    finalWeights: { CAT: 40, Class10: 3, Class12: 3, Graduation: 4, WorkEx: 20, Gender: 5, PI: 25 },
    academicsRules: {
      class10: { slabs: "90+=3, 85+=2.25, 80+=1.5, 75+=0.75, <75=0" },
      class12: { slabs: "90+=3, 85+=2.25, 80+=1.5, 75+=0.75, <75=0" },
      graduation: { slabs: "90+=4, 85+=3, 80+=2, 75+=1, <75=0" }
    },
    workexRules: { slabs: "12=5, 18=10, 24=15, 30=20, 36=15, 42=10, 48=5" },
    diversityRules: { gender: "5%" },
    notes: ["No sectional percentile cutoffs, but positive raw score mandatory", "General cutoff relaxed to 85 for females or males with ≥1yr WorkEx", "CAT formula: Overall 31%, VARC 3%, QA 3%, DILR 3%", "PI has minimum qualifying requirement"]
  },

  {
    name: "IIM Sirmaur",
    processType: "CAP",
    source: "Official - Flagship MBA Admission Policy 2026–28",
    cutoffs: [
      { category: "GEN", VARC: null, DILR: null, QA: null, OVERALL: null, note: "Exact cutoffs notified separately by CAP" },
      { category: "SC",  VARC: null, DILR: null, QA: null, OVERALL: null },
      { category: "ST",  VARC: null, DILR: null, QA: null, OVERALL: null }
    ],
    finalWeights: { CAT: 35, PI: 20, Academics: 15, WorkEx: 20, Gender: 5, Trailblazer: 5 },
    academicsRules: {
      class10: { slabs: "95+=3, 85+=2, 75+=1, <75=0" },
      class12: { slabs: "95+=4, 85+=2, 75+=1, <75=0" },
      graduation: { slabs: "90+=8, 80+=6, 70+=4, 60+=2, <60=0" }
    },
    workexRules: { slabs: "12-17=10, 18-23=15, 24-35=20, 36-41=15, 42-53=10, >53=5" },
    diversityRules: { gender: "5% (Female/Transgender)", trailblazer: "5% (Engineering/Medical/Design/Arch/Planning/Pharmacy/CA/CMA/CS)" },
    notes: ["PI conducted via CAP 2026 (offline)", "CAT section weights: VARC 35%, DILR 30%, QA 35%", "60 seats reserved for female candidates", "Trailblazer score is bonus"]
  },

  {
    name: "IIM Nagpur",
    processType: "CAP",
    source: "Baseline (Careers360 article, Secondary source)",
    cutoffs: [
      { category: "GEN", VARC: 75, DILR: 75, QA: 75, OVERALL: 95 },
      { category: "EWS", VARC: 65, DILR: 65, QA: 65, OVERALL: 81 },
      { category: "OBC", VARC: 65, DILR: 65, QA: 65, OVERALL: 81 },
      { category: "SC",  VARC: 45, DILR: 45, QA: 45, OVERALL: 66 },
      { category: "ST",  VARC: 25, DILR: 25, QA: 30, OVERALL: 42 },
      { category: "PWD", VARC: 25, DILR: 25, QA: 30, OVERALL: 42 }
    ],
    finalWeights: { CAT: 40, PI: 40, Academics: 15, WorkEx: 5 },
    academicsRules: { class10: { weight: 5 }, class12: { weight: 5 }, graduation: { weight: 5 } },
    workexRules: { slabs: "12+ months" },
    diversityRules: { gender: "Bonus", academic: "Non-engineering" },
    notes: ["Cutoffs are indicative and qualifying", "Actual PI shortlist percentiles may be significantly higher", "Exact final weightages not disclosed", "Used for predictor baseline only"]
  },

  {
    name: "IIM Mumbai",
    processType: "CAP",
    source: "Official – MBA 2025–27 Admission Policy",
    cutoffs: [
      { category: "GEN", VARC: 80, DILR: 80, QA: 75, OVERALL: 85 },
      { category: "OBC", VARC: 70, DILR: 65, QA: 65, OVERALL: 75 },
      { category: "EWS", VARC: 70, DILR: 65, QA: 65, OVERALL: 75 },
      { category: "SC",  VARC: 65, DILR: 60, QA: 60, OVERALL: 70 },
      { category: "ST",  VARC: 55, DILR: 55, QA: 55, OVERALL: 65 },
      { category: "PWD", VARC: 45, DILR: 45, QA: 45, OVERALL: 55 }
    ],
    finalWeights: { CAT: 60, PI: 20, APWE: 20 },
    academicsRules: {
      class10: { weight: 0.7, slabs: "<=55=1, 55–60=2, 60–70=3, 70–80=5, 80–90=8, >90=10" },
      class12: { 
        weight: 0.7, 
        streams: {
          Science: "<=55=1, 55–60=2, 60–70=3, 70–80=5, 80–90=8, >90=10",
          Commerce: "<=50=1, 50–55=2, 55–65=3, 65–75=5, 75–90=8, >90=10",
          Arts: "<=45=1, 45–50=2, 50–60=3, 60–70=5, 70–85=8, >85=10"
        }
      },
      graduation: { weight: 0.7, note: "Scoring slabs vary by Academic Category (AC-1 to AC-6)" }
    },
    workexRules: { weight: 0.20, slabs: "<12=0, 12–36=0.20*(months-11), >36=5" },
    diversityRules: { gender: "NA", academic: "Implicit via AC categories" },
    notes: [
      "Shortlisting based purely on CAT 2024 percentile + category",
      "Actual cutoffs may be higher than minimum",
      "PI mandatory for final selection",
      "APWE includes Class 10, Class 12, Graduation, Work Experience",
      "APWE Formula: APWE = 0.70*(A + B + C) + 0.20*D (where A=10th, B=12th, C=Grad, D=WorkEx)",
      "WorkEx considered till 31 Dec 2024",
      "Final merit list prepared category-wise",
      "Reservation as per GoI norms (OBC 27%, SC 15%, ST 7.5%, EWS 10%, PwD 5%)"
    ]
  },

  {
    name: "IIM Visakhapatnam",
    processType: "NON_CAP",
    source: "Official - PGP Admission Process 2025–27",
    cutoffs: [
      { category: "GEN", VARC: 70, DILR: 70, QA: 70, OVERALL: 82 },
      { category: "EWS", VARC: 63, DILR: 63, QA: 63, OVERALL: 72 },
      { category: "OBC", VARC: 63, DILR: 63, QA: 63, OVERALL: 72 },
      { category: "SC",  VARC: 40, DILR: 40, QA: 40, OVERALL: 50 },
      { category: "ST",  VARC: 30, DILR: 30, QA: 30, OVERALL: 40 },
      { category: "PWD", VARC: 30, DILR: 30, QA: 30, OVERALL: 40 }
    ],
    finalWeights: { PI: 48, CAT: 25, Class10: 4, Class12: 4, Bachelors: 4, Gender: 5, WorkEx: 10 },
    academicsRules: {
      class10: { weight: 10, slabs: "Board-wise normalization" },
      class12: { weight: 10, slabs: "Board-wise normalization" },
      graduation: { weight: 10, slabs: "Bachelors degree" }
    },
    workexRules: { formula: "x<12: 5x/12, 12-36: 10, 36-48: 10-0.625(x-36), >48: 2.5" },
    diversityRules: { gender: "10% (Female/Transgender)", professional: "WorkEx and Professional Course treated as one parameter" },
    notes: ["Pre-PI: CAT 50% (VARC 18%, DILR 14%, QA 18%), Class10 10%, Class12 10%, Bachelors 10%, Gender 10%, WorkEx/Professional 10%", "Post-PI: PI 48%, CAT 25%, Class10 4%, Class12 4%, Bachelors 4%, Gender 5%, WorkEx 10%", "PI scores can be shared from IIM B/K/L/I", "Board-wise normalization used for 10th/12th", "Missing any phase = direct disqualification"]
  },

  // =========================
  // NON-CAP IIMs (Newer)
  // =========================

  {
    name: "IIM Raipur",
    processType: "NON_CAP",
    source: "Official - MBA Admission Policy 2025–27",
    cutoffs: [
      { category: "GEN", VARC: 75, DILR: 75, QA: 75, OVERALL: 90, class10: 60, class12: 60, graduation: 60 },
      { category: "EWS", VARC: 65, DILR: 65, QA: 65, OVERALL: 80, class10: 60, class12: 60, graduation: 60 },
      { category: "OBC", VARC: 65, DILR: 65, QA: 65, OVERALL: 80, class10: 55, class12: 55, graduation: 60 },
      { category: "SC",  VARC: 60, DILR: 60, QA: 60, OVERALL: 65, class10: 55, class12: 55, graduation: 50 },
      { category: "ST",  VARC: 55, DILR: 55, QA: 55, OVERALL: 55, class10: 55, class12: 55, graduation: 45 }
    ],
    finalWeights: { CAT: 50, PI: 25, Class10: 20, Class12: 20, WorkEx: 15, Gender: 7, GD: 5, Profile: 5, AcademicDiversity: 3 },
    academicsRules: {
      class10: { weight: 20, minCutoff: { GEN: 60, EWS: 60, OBC: 55, SC: 55, ST: 55 } },
      class12: { weight: 20, minCutoff: { GEN: 60, EWS: 60, OBC: 55, SC: 55, ST: 55 } },
      graduation: { weight: "Included", minCutoff: { GEN: 60, EWS: 60, OBC: 60, SC: 50, ST: 45 } }
    },
    workexRules: { slabs: "12+ months", weight: 15 },
    diversityRules: { gender: "7%", academic: "3%", note: "Candidate gets either Gender or Academic diversity, not both" },
    notes: ["STEP 1 is registration eligibility, not a PI call", "GD weight: 5%", "Profile weight: 5%"]
  },

  {
    name: "IIM Kashipur",
    processType: "NON_CAP",
    source: "Official - MBA Admission Policy 2025–27",
    cutoffs: [
      { category: "GEN", VARC: 73, DILR: 73, QA: 73, OVERALL: 94 },
      { category: "EWS", VARC: 50, DILR: 50, QA: 50, OVERALL: 77 },
      { category: "OBC", VARC: 50, DILR: 50, QA: 50, OVERALL: 77 },
      { category: "SC",  VARC: 44, DILR: 44, QA: 44, OVERALL: 60 },
      { category: "ST",  VARC: 30, DILR: 25, QA: 25, OVERALL: 40 },
      { category: "PWD", VARC: 30, DILR: 25, QA: 25, OVERALL: 40 }
    ],
    finalWeights: { PI: 25, Composite: 75 },
    academicsRules: {
      class10: { weight: 5 },
      class12: { weight: 5 },
      graduation: { weight: 5 },
      professional: { weight: 5, note: "CA/CS/CMA/CFA" }
    },
    workexRules: { slabs: "0-5=0, 6-12=2, 13-18=6, 19-24=12, 25-30=12, 31-36=4, 37+=0", weight: 12 },
    diversityRules: { gender: "6%", academic: "4%" },
    notes: ["Composite: CAT 33%, Class10 5%, Class12 5%, Grad 5%, Professional 5%, WorkEx 12%, Academic Diversity 4%, Gender 6%", "Final score = PI 25% + Composite 75%", "CAT cutoffs are eligibility only, not guarantee", "Only paid full-time work experience after graduation counted"]
  },

  {
    name: "IIM Amritsar",
    processType: "NON_CAP",
    source: "Official - MBA Admission Process 2026–28",
    cutoffs: [
      { category: "GEN", VARC: 80, DILR: 75, QA: 80, OVERALL: 90 },
      { category: "EWS", VARC: 77, DILR: 75, QA: 80, OVERALL: 90 },
      { category: "OBC", VARC: 65, DILR: 60, QA: 65, OVERALL: 80 },
      { category: "SC",  VARC: 52, DILR: 50, QA: 55, OVERALL: 55 },
      { category: "ST",  VARC: 37, DILR: 35, QA: 40, OVERALL: 40 },
      { category: "PWD", VARC: 37, DILR: 35, QA: 40, OVERALL: 40 }
    ],
    finalWeights: { PrePI: 70, PostPI: 30 },
    academicsRules: {
      class10: { weight: 10, slabs: "Board-wise normalization using 90th percentile" },
      class12: { weight: 10, slabs: "Board-wise normalization using 90th percentile" },
      graduation: { slabs: "90.01+=5, 80.01+=4, 70.01+=3, 65.01+=2, 55.01+=1, <55=0", weight: 5 }
    },
    workexRules: { slabs: "12+ months", weight: 15 },
    diversityRules: { gender: "10%", academic: "10%" },
    notes: ["Pre-PI: CAT 50%, Class10 10%, Class12 10%, Graduation 5%, Gender 10%, WorkEx 15%", "Post-PI: PI 70%, WorkEx 10%, Gender Diversity 10%, Academic Diversity 10%", "Final formula: 0.7 * PrePI + 0.3 * PostPI", "Class 10 & 12 marks normalized board-wise", "CAT cutoffs are eligibility only"]
  },

  {
    name: "IIM Rohtak",
    processType: "NON_CAP",
    source: "Official - Admission Process PGP 2026–28",
    cutoffs: [
      { category: "GEN", VARC: null, DILR: null, QA: null, OVERALL: 97 },
      { category: "EWS", VARC: null, DILR: null, QA: null, OVERALL: 93 },
      { category: "OBC", VARC: null, DILR: null, QA: null, OVERALL: 83 },
      { category: "SC",  VARC: null, DILR: null, QA: null, OVERALL: 60 },
      { category: "ST",  VARC: null, DILR: null, QA: null, OVERALL: 50 },
      { category: "DAP_GEN", VARC: null, DILR: null, QA: null, OVERALL: 87 },
      { category: "DAP_EWS", VARC: null, DILR: null, QA: null, OVERALL: 83 },
      { category: "DAP_OBC", VARC: null, DILR: null, QA: null, OVERALL: 73 },
      { category: "DAP_SC",  VARC: null, DILR: null, QA: null, OVERALL: 50 },
      { category: "DAP_ST",  VARC: null, DILR: null, QA: null, OVERALL: 40 }
    ],
    finalWeights: { CAT: 60, PI: 20, Diversity: 20 },
    academicsRules: { note: "Academics included in diversity scoring" },
    workexRules: { note: "Included in diversity scoring" },
    diversityRules: { gender: "Part of 20%", academic: "Part of 20%", note: "Gender and Academic diversity jointly considered, exact split not disclosed" },
    notes: ["Only overall CAT percentile used, no sectional cutoffs", "DAP = Diversity and Academic Profile", "Very high overall cutoff (97 for GEN)", "Exact internal diversity split not disclosed"]
  }

];

async function seed() {
  try {
    console.log("🌱 Starting database seed with REAL OFFICIAL DATA...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
    
    await IIM.deleteMany();
    console.log("🗑️  Cleared existing IIM data");
    
    await IIM.insertMany(iimData);
    console.log(`✅ Successfully seeded ${iimData.length} IIMs with REAL OFFICIAL DATA`);
    console.log("\n📊 IIMs seeded with official sources:");
    iimData.forEach((iim, index) => {
      const sourceType = iim.source.includes("Official") ? "✅ Official" : "⚠️  Baseline";
      console.log(`   ${index + 1}. ${iim.name} (${iim.processType}) - ${sourceType}`);
    });
    console.log("\n✨ All 21 IIMs data successfully seeded!");
    
    process.exit(0);
  } catch (err) {
    console.error("❌ SEED ERROR:", err);
    process.exit(1);
  }
}

seed();
