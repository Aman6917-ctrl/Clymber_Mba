// utils/compositeScore.js
// Phase-2: Composite Score Calculation

/**
 * Calculate Phase-2 Composite Score
 * Formula: (OVERALL * 0.6) + (((VARC + DILR + QA) / 3) * 0.4)
 * 
 * @param {Object} percentiles - CAT percentiles
 * @param {number} percentiles.overall - Overall percentile
 * @param {number} percentiles.varc - VARC percentile
 * @param {number} percentiles.dilr - DILR percentile
 * @param {number} percentiles.qa - QA percentile
 * @returns {number} Composite score
 */
exports.calculateCompositeScore = ({ overall, varc, dilr, qa }) => {
  const overallComponent = (overall || 0) * 0.6;
  const avgSectional = ((varc || 0) + (dilr || 0) + (qa || 0)) / 3;
  const sectionalComponent = avgSectional * 0.4;
  
  return overallComponent + sectionalComponent;
};
