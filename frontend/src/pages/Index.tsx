import { useRef } from "react";
import HeroSection from "@/components/HeroSection";
import PredictionForm from "@/components/PredictionForm";

const Index = () => {
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection onStartPrediction={scrollToForm} />

      {/* 🔥 FIX */}
      <div ref={formRef} className="scroll-mt-24">
        <PredictionForm />
      </div>
    </div>
  );
};

export default Index;
