interface FormInputProps {
  label: string;
  placeholder?: string;
  type?: "text" | "number";
  value: string | number;
  onChange: (value: string) => void;
}

const FormInput = ({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: FormInputProps) => {
  return (
    <div className="min-w-0 space-y-1.5">
      <label className="text-[13px] text-muted-foreground">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        min={type === "number" ? 0 : undefined}
        max={type === "number" ? 100 : undefined}
        step={type === "number" ? "0.01" : undefined}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 w-full px-4 py-2.5 rounded-lg border border-input-border bg-white text-card-foreground text-[14px] placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
      />
    </div>
  );
};

export default FormInput;
