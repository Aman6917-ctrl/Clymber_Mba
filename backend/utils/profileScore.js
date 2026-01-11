// utils/profileScore.js
// Phase-3: Simplified Profile Score Calculation (out of 30)

const scoreClass10 = (percent) => {
  if (percent >= 90) return 8;
  if (percent >= 80) return 6;
  if (percent >= 70) return 4;
  return 0;
};

const scoreClass12 = (percent) => {
  if (percent >= 90) return 8;
  if (percent >= 80) return 6;
  if (percent >= 70) return 4;
  return 0;
};

const scoreGraduation = (percent) => {
  if (percent >= 85) return 8;
  if (percent >= 75) return 6;
  if (percent >= 65) return 4;
  return 0;
};

const scoreWorkEx = (months) => {
  if (months >= 24 && months <= 36) return 6;
  if (months >= 12 && months <= 23) return 4;
  return 0;
};

/**
 * Calculate Phase-3 Profile Score (max 30)
 * @param {Object} params
 * @param {number} params.class10 - Class 10 percentage
 * @param {number} params.class12 - Class 12 percentage
 * @param {number} params.graduation - Graduation percentage
 * @param {number} params.workex_months - Work experience in months
 * @returns {number} Profile score (0-30)
 */
exports.calculateProfileScore = ({
  class10 = 0,
  class12 = 0,
  graduation = 0,
  workex_months = 0
}) => {
  const class10Score = scoreClass10(class10);
  const class12Score = scoreClass12(class12);
  const gradScore = scoreGraduation(graduation);
  const workexScore = scoreWorkEx(workex_months);

  const total = class10Score + class12Score + gradScore + workexScore;
  
  // Cap to max 30
  return Math.min(30, total);
};
