interface ResultCardProps {
  iimName: string;
  chance?: "high" | "medium" | "low" | "very_low" | "VERY_LOW";
  bucket?: "SAFE" | "BORDERLINE" | "DREAM" | "NOT_ELIGIBLE";
  compositeScore?: number;
  profileScore?: number;
  finalScore?: number;
  probability?: string;
  eligible?: boolean;
  reason?: string;
}

const ResultCard = ({ 
  iimName, 
  chance, 
  bucket, 
  compositeScore, 
  profileScore,
  finalScore,
  probability,
  eligible, 
  reason 
}: ResultCardProps) => {
  // Priority: probability > chance > bucket
  const getConfig = () => {
    // Use probability if available (new format)
    if (probability) {
      const probLower = probability.toLowerCase();
      if (probLower.includes("very high")) {
        return {
          label: "Very High",
          bgClass: "bg-emerald-50",
          textClass: "text-emerald-700",
          borderClass: "border-emerald-300",
        };
      } else if (probLower.includes("high")) {
        return {
          label: "High",
          bgClass: "bg-emerald-50",
          textClass: "text-emerald-700",
          borderClass: "border-emerald-300",
        };
      } else if (probLower.includes("medium")) {
        return {
          label: "Medium",
          bgClass: "bg-amber-50",
          textClass: "text-amber-700",
          borderClass: "border-amber-300",
        };
      } else if (probLower.includes("low")) {
        return {
          label: "Low",
          bgClass: "bg-orange-50",
          textClass: "text-orange-700",
          borderClass: "border-orange-300",
        };
      } else {
        return {
          label: "Very Low",
          bgClass: "bg-red-50",
          textClass: "text-red-600",
          borderClass: "border-red-300",
        };
      }
    }

    // Fallback to chance (backward compatibility)
    if (chance) {
      const normalizedChance = chance.toLowerCase();
      const chanceConfig: Record<string, { label: string; bgClass: string; textClass: string; borderClass: string }> = {
        high: {
          label: "High",
          bgClass: "bg-emerald-50",
          textClass: "text-emerald-700",
          borderClass: "border-emerald-300",
        },
        medium: {
          label: "Medium",
          bgClass: "bg-amber-50",
          textClass: "text-amber-700",
          borderClass: "border-amber-300",
        },
        low: {
          label: "Low",
          bgClass: "bg-orange-50",
          textClass: "text-orange-700",
          borderClass: "border-orange-300",
        },
        very_low: {
          label: "Very Low",
          bgClass: "bg-red-50",
          textClass: "text-red-600",
          borderClass: "border-red-300",
        },
      };
      return chanceConfig[normalizedChance] || chanceConfig.low;
    }

    // Fallback to bucket
    if (bucket) {
      const bucketConfig: Record<string, { label: string; bgClass: string; textClass: string; borderClass: string }> = {
        SAFE: {
          label: "Safe",
          bgClass: "bg-emerald-50",
          textClass: "text-emerald-600",
          borderClass: "border-emerald-200",
        },
        BORDERLINE: {
          label: "Borderline",
          bgClass: "bg-amber-50",
          textClass: "text-amber-600",
          borderClass: "border-amber-200",
        },
        DREAM: {
          label: "Dream",
          bgClass: "bg-orange-50",
          textClass: "text-orange-600",
          borderClass: "border-orange-200",
        },
        NOT_ELIGIBLE: {
          label: "Not Eligible",
          bgClass: "bg-red-50",
          textClass: "text-red-600",
          borderClass: "border-red-300",
        },
      };
      return bucketConfig[bucket] || bucketConfig.NOT_ELIGIBLE;
    }

    // Default
    return {
      label: "Unknown",
      bgClass: "bg-gray-50",
      textClass: "text-gray-600",
      borderClass: "border-gray-200",
    };
  };

  const config = getConfig();
  const isEligible = eligible !== false;

  return (
    <div
      className={`px-5 py-4 rounded-xl border ${config.borderClass} ${config.bgClass} ${!isEligible || bucket === "NOT_ELIGIBLE" ? 'opacity-70' : ''}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-[15px] text-card-foreground">
          {iimName}
        </span>
        <span className={`text-[13px] font-bold ${config.textClass}`}>
          {config.label}
        </span>
      </div>
      
      {(finalScore !== undefined || compositeScore !== undefined) && (
        <div className={`mt-2 pt-2 border-t ${config.borderClass}`}>
          {finalScore !== undefined && (
            <div className="flex items-center justify-between text-[12px] mb-1">
              <span className="text-muted-foreground">Final Score:</span>
              <span className={`font-medium ${config.textClass}`}>
                {finalScore.toFixed(1)}
              </span>
            </div>
          )}
          {compositeScore !== undefined && (
            <div className="flex items-center justify-between text-[12px] mb-1">
              <span className="text-muted-foreground">Composite:</span>
              <span className="font-medium text-card-foreground">
                {compositeScore.toFixed(1)}
              </span>
            </div>
          )}
          {profileScore !== undefined && (
            <div className="flex items-center justify-between text-[12px] mb-1">
              <span className="text-muted-foreground">Profile:</span>
              <span className="font-medium text-card-foreground">
                {profileScore.toFixed(1)}/30
              </span>
            </div>
          )}
          {bucket && (
            <div className="mt-2 text-[11px] text-muted-foreground">
              Bucket: <span className="font-medium">{bucket}</span>
            </div>
          )}
          {!isEligible || bucket === "NOT_ELIGIBLE" ? (
            <div className="mt-1 text-[11px] text-red-600 font-medium">
              Not Eligible
            </div>
          ) : null}
          {reason && (
            <div className="mt-2 text-[11px] text-muted-foreground italic">
              {reason}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultCard;
