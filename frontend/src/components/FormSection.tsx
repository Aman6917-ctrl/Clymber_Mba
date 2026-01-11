import { ReactNode } from "react";

interface FormSectionProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}

const FormSection = ({ icon, title, children }: FormSectionProps) => {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-section-icon-bg flex items-center justify-center">
          <span className="text-section-icon">{icon}</span>
        </div>
        <h3 className="text-[17px] font-semibold text-card-foreground">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default FormSection;