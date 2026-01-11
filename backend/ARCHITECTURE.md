# MBA IIM Call Predictor - Backend Architecture

## Overview
This backend implements a realistic MBA IIM call prediction system using Phase-2 (Composite Score + Bucket) and Phase-3 (Profile Score) logic.

## Architecture Components

### 1. Core Controller
**File**: `backend/controllers/predictController.js`

Main prediction endpoint that:
- Receives CAT percentiles and profile data from frontend
- Processes each IIM in the database
- Calculates Phase-2 composite score and Phase-3 profile score
- Determines eligibility, bucket classification, and probability
- Returns structured response with all prediction metrics

### 2. Phase-2: Composite Score Calculation
**File**: `backend/utils/compositeScore.js`

Formula:
```
compositeScore = (OVERALL * 0.6) + (((VARC + DILR + QA) / 3) * 0.4)
```

This score represents CAT performance and is used for:
- Bucket classification
- Final score calculation

### 3. Phase-2: Bucket Classification
**File**: `backend/utils/bucketCalculator.js`

Classification rules:
- **SAFE**: `compositeScore >= cutoff.OVERALL + 8`
- **BORDERLINE**: `cutoff.OVERALL <= compositeScore < cutoff.OVERALL + 8`
- **DREAM**: `compositeScore < cutoff.OVERALL` (but still eligible)
- **NOT_ELIGIBLE**: If eligibility rules fail

### 4. Phase-3: Profile Score Calculation
**File**: `backend/utils/profileScore.js`

Simplified scoring system (max 30 points):

**Class 10 Percentage:**
- >= 90 → 8 points
- 80-89 → 6 points
- 70-79 → 4 points
- else → 0 points

**Class 12 Percentage:**
- >= 90 → 8 points
- 80-89 → 6 points
- 70-79 → 4 points
- else → 0 points

**Graduation Percentage:**
- >= 85 → 8 points
- 75-84 → 6 points
- 65-74 → 4 points
- else → 0 points

**Work Experience (months):**
- 24-36 → 6 points
- 12-23 → 4 points
- 0-11 → 0 points

Total capped at 30 points.

### 5. Final Score Calculation
**Formula:**
```
finalScore = compositeScore + (profileScore * 0.3)
```

This combines CAT performance (60%) with profile strength (30% of profile score).

### 6. Probability Mapping
**File**: `backend/utils/probabilityMapper.js`

Maps final score to probability bands:
- >= 85 → "Very High"
- 75-84 → "High"
- 65-74 → "Medium"
- 55-64 → "Low"
- < 55 → "Very Low"

### 7. Reason Generation
**File**: `backend/utils/reasonGenerator.js`

Generates human-readable explanations for predictions based on:
- Eligibility status
- Bucket classification
- Score breakdown
- Cutoff comparisons

## Eligibility Rules (Phase-1)

For each IIM, candidate must clear:
- VARC percentile >= VARC cutoff (if cutoff exists)
- DILR percentile >= DILR cutoff (if cutoff exists)
- QA percentile >= QA cutoff (if cutoff exists)
- Overall percentile >= Overall cutoff (if cutoff exists)

If ANY cutoff is not cleared → `eligible = false` → `bucket = "NOT_ELIGIBLE"`

## API Response Format

For each IIM:

```json
{
  "iim": "IIM Ahmedabad",
  "eligible": true,
  "bucket": "SAFE",
  "compositeScore": 87.5,
  "profileScore": 24.0,
  "finalScore": 94.7,
  "probability": "Very High",
  "chance": "high",
  "reason": "Excellent overall profile with strong CAT performance"
}
```

## Data Flow

1. **Frontend** → Sends CAT percentiles + profile data
2. **Controller** → Validates input, normalizes data
3. **Composite Score** → Calculates Phase-2 score (once per request)
4. **Profile Score** → Calculates Phase-3 score (once per request)
5. **For each IIM:**
   - Find matching cutoff (by category + gender if applicable)
   - Check eligibility
   - Determine bucket
   - Calculate final score
   - Map to probability
   - Generate reason
6. **Sort results** by finalScore (descending)
7. **Return** structured response

## Key Design Decisions

1. **Single calculation**: Composite and profile scores calculated once, reused for all IIMs
2. **Null-safe**: Handles missing cutoffs gracefully (some IIMs have only overall cutoff)
3. **Gender-aware**: Supports gender-specific cutoffs (e.g., IIM Jammu)
4. **Backward compatible**: Includes `chance` field for frontend compatibility
5. **Modular**: Each utility function is independent and testable

## Testing

Test with:
- Various CAT percentile combinations
- Different profile strengths
- All category types (GEN, OBC, SC, ST, EWS, PWD)
- Edge cases (null cutoffs, missing data)

## Future Enhancements

- IIM-specific scoring weights (currently generic)
- Work experience curves (currently linear)
- Academic board normalization
- Professional qualification bonuses
