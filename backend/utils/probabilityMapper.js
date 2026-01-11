// utils/probabilityMapper.js
// Probability Mapping based on Final Score

/**
 * Map final score to probability band
 * 
 * @param {number} finalScore - Final composite score (compositeScore + profileScore * 0.3)
 * @returns {string} Probability band
 */
exports.mapProbability = (finalScore) => {
  if (finalScore >= 85) return "Very High";
  if (finalScore >= 75) return "High";
  if (finalScore >= 65) return "Medium";
  if (finalScore >= 55) return "Low";
  return "Very Low";
};
