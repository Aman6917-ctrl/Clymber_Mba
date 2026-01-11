import { BarChart3 } from "lucide-react";

interface HeroSectionProps {
  onStartPrediction: () => void;
}

const HeroSection = ({ onStartPrediction }: HeroSectionProps) => {
  return (
    <div
      className="relative"
      style={{
        background:
          "linear-gradient(135deg, #8B7CF6 0%, #7C6BF6 50%, #6B5DE6 100%)",
      }}
    >
      <div className="max-w-[1000px] mx-auto px-8 py-14 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left */}
          <div className="space-y-5 animate-fade-in">
            <h1 className="text-[42px] md:text-[48px] font-bold text-white leading-[1.1]">
              MBA Call Predictor
            </h1>
            <p className="text-[17px] text-white/80 max-w-[420px]">
              Predict your IIM interview calls and conversion chances with a
              profile-based analysis.
            </p>

            <button
              onClick={onStartPrediction}
              className="bg-white text-[#313131] px-8 py-3.5 rounded-lg font-medium hover:bg-white/95 shadow-lg"
            >
              Start Prediction
            </button>

            <p className="text-[13px] text-white/60">
              Based on past trends and admission criteria
            </p>
          </div>

          {/* Right */}
          <div className="hidden md:flex justify-end animate-slide-up">
            <div className="relative rounded-2xl overflow-hidden w-[320px] h-[220px]">
              <img
                src="https://app.banani.co/avatar1.jpeg"
                alt="Student"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#7C6BF6]/50" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <div className="bg-white/20 rounded-full p-3 mb-2">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <span className="text-[15px] font-medium">
                  Accuracy Matters
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
