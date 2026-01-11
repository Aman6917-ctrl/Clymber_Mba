import { ChevronDown } from "lucide-react";

interface FormSelectProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

const FormSelect = ({ label, options, value, onChange }: FormSelectProps) => {
  return (
    <div className="min-w-0 space-y-1.5">
      <label className="text-[13px] text-muted-foreground">{label}</label>
      <div className="relative min-w-0">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 w-full px-4 py-2.5 rounded-lg border border-input-border bg-white text-card-foreground text-[14px] appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all cursor-pointer pr-10"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
};

export default FormSelect;