interface ToggleButtonProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}

const ToggleButton = ({ options, value, onChange, label }: ToggleButtonProps) => {
  return (
    <div className="space-y-1.5">
      <label className="text-[13px] text-muted-foreground block">{label}</label>
      <div className="flex rounded-lg border border-input-border overflow-hidden bg-toggle-inactive">
        {options.map((option, index) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex-1 px-2 py-2.5 text-[13px] font-medium transition-colors whitespace-nowrap text-center ${
              value === option.value
                ? "bg-toggle-active text-white"
                : "bg-toggle-inactive text-card-foreground hover:bg-muted/50"
            } ${index !== options.length - 1 ? "border-r border-input-border" : ""}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ToggleButton;