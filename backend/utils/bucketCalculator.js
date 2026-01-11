// utils/bucketCalculator.js
// Phase-2: Bucket Classification based on Composite Score

/**
 * Determine bucket classification based on composite score vs cutoff
 * 
 * @param {Object} params
 * @param {number} params.compositeScore - Phase-2 composite score
 * @param {number} params.overallCutoff - Overall cutoff percentile
 * @param {boolean} params.eligible - Whether candidate is eligible
 * @returns {string} Bucket classification
 */
exports.getBucket = ({ compositeScore, overallCutoff, eligible }) => {
  // If not eligible, return NOT_ELIGIBLE
  if (!eligible) {
    return "NOT_ELIGIBLE";
  }

  // Handle null/undefined cutoff
  if (!overallCutoff || overallCutoff === 0) {
    return "DREAM"; // Conservative if cutoff unknown
  }

  // SAFE: compositeScore >= cutoff + 8
  if (compositeScore >= overallCutoff + 8) {
    return "SAFE";
  }

  // BORDERLINE: compositeScore between cutoff and cutoff + 7
  if (compositeScore >= overallCutoff && compositeScore < overallCutoff + 8) {
    return "BORDERLINE";
  }

  // DREAM: compositeScore < cutoff (but still eligible)
  return "DREAM";
};
