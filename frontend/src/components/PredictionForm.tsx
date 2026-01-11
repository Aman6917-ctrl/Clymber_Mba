import { useState } from "react";
import { FileText, User, GraduationCap, Briefcase, Award, Building, Star } from "lucide-react";
import FormSection from "./FormSection";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import ToggleButton from "./ToggleButton";
import ResultCard from "./ResultCard";

interface FormData {
  varcMarks: string;
  dilrMarks: string;
  qaMarks: string;
  overallMarks: string;
  varcPercentile: string;
  dilrPercentile: string;
  qaPercentile: string;
  overallPercentile: string;
  category: string;
  pwdStatus: string;
  gender: string;
  class10Board: string;
  class10Percentage: string;
  class10MathMarks: string;
  class12Board: string;
  class12Stream: string;
  class12Percentage: string;
  academicCategory: string;
  gradStream: string;
  gradPercentage: string;
  cgpa: string;
  workExpJuly: string;
  workExpDec: string;
  workExpJan: string;
  hasProfQualification: string;
  nirfRank: string;
  isIITNITBITS: string;
  isNationalImportance: string;
  isAgriField: boolean;
  isCommerceField: boolean;
  iimCalcuttaCategory: string;
  extracurricularRating: string;
}

interface Result {
  iim: string;
  eligible: boolean;
  bucket: "SAFE" | "BORDERLINE" | "DREAM" | "NOT_ELIGIBLE";
  compositeScore: number;
  profileScore: number;
  finalScore: number;
  probability: string;
  chance: "high" | "medium" | "low" | "very_low"; // For backward compatibility
  reason: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const PredictionForm = () => {
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [formData, setFormData] = useState<FormData>({
    varcMarks: "0.00",
    dilrMarks: "0.00",
    qaMarks: "0.00",
    overallMarks: "0.00",
    varcPercentile: "99.99",
    dilrPercentile: "99.99",
    qaPercentile: "99.99",
    overallPercentile: "99.99",
    category: "general",
    pwdStatus: "no",
    gender: "male",
    class10Board: "cbse",
    class10Percentage: "",
    class10MathMarks: "",
    class12Board: "cbse",
    class12Stream: "science",
    class12Percentage: "",
    academicCategory: "ac1",
    gradStream: "",
    gradPercentage: "",
    cgpa: "",
    workExpJuly: "",
    workExpDec: "",
    workExpJan: "",
    hasProfQualification: "no",
    nirfRank: "",
    isIITNITBITS: "no",
    isNationalImportance: "no",
    isAgriField: false,
    isCommerceField: false,
    iimCalcuttaCategory: "",
    extracurricularRating: "",
  });

  const updateField = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setShowResults(false);

    try {
      // Map frontend form data to backend API format
      const payload = {
        category: formData.category === "nc-obc" ? "OBC" : 
                   formData.category === "general" ? "GEN" : 
                   formData.category.toUpperCase(),
        VARC: parseFloat(formData.varcPercentile) || 0,
        DILR: parseFloat(formData.dilrPercentile) || 0,
        QA: parseFloat(formData.qaPercentile) || 0,
        OVERALL: parseFloat(formData.overallPercentile) || 0,
        // Marks (if needed)
        varcMarks: parseFloat(formData.varcMarks) || 0,
        dilrMarks: parseFloat(formData.dilrMarks) || 0,
        qaMarks: parseFloat(formData.qaMarks) || 0,
        overallMarks: parseFloat(formData.overallMarks) || 0,
        // Personal details
        pwdStatus: formData.pwdStatus === "yes" ? "yes" : "no",
        gender: formData.gender === "male" ? "MALE" : 
                formData.gender === "female" ? "FEMALE" : 
                formData.gender === "other" ? "TG" : "MALE",
        // Academic details
        class10: parseFloat(formData.class10Percentage) || 0,
        class10MathMarks: parseFloat(formData.class10MathMarks) || 0,
        class10Board: formData.class10Board,
        class12: parseFloat(formData.class12Percentage) || 0,
        class12Stream: formData.class12Stream.toUpperCase(),
        class12Board: formData.class12Board,
        graduation: parseFloat(formData.gradPercentage) || parseFloat(formData.cgpa) * 10 || 0,
        cgpa: parseFloat(formData.cgpa) || 0,
        academicCategory: formData.academicCategory,
        gradStream: formData.gradStream,
        // Work experience (using July value as default)
        workex_months: parseFloat(formData.workExpJuly) || 0,
        workExpDec: parseFloat(formData.workExpDec) || 0,
        workExpJan: parseFloat(formData.workExpJan) || 0,
        // Professional qualifications
        hasProfQualification: formData.hasProfQualification === "yes",
        // Institute details
        nirfRank: formData.nirfRank ? parseInt(formData.nirfRank) : null,
        isIITNITBITS: formData.isIITNITBITS === "yes",
        isNationalImportance: formData.isNationalImportance === "yes",
        // Diversity
        isAgriField: formData.isAgriField,
        isCommerceField: formData.isCommerceField,
        iimCalcuttaCategory: formData.iimCalcuttaCategory || null,
        extracurricularRating: parseFloat(formData.extracurricularRating) || 0,
        // Academic stream mapping
        academic_stream: formData.academicCategory === "ac1" ? "ENGINEERING" : 
                        formData.class12Stream === "commerce" ? "COMMERCE" :
                        formData.class12Stream === "arts" ? "ARTS" : "SCIENCE"
      };

      console.log("Sending request to:", `${API_URL}/api/predict`);
      console.log("Payload:", payload);

      const res = await fetch(`${API_URL}/api/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error response:", errorText);
        throw new Error(`Server error: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      console.log("Response data:", data);
      
      // Map backend response to frontend format
      if (data.success && data.results) {
        const mappedResults: Result[] = data.results.map((r: any) => ({
          iim: r.iim,
          eligible: r.eligible !== false,
          bucket: r.bucket || "NOT_ELIGIBLE",
          compositeScore: r.compositeScore || 0,
          profileScore: r.profileScore || 0,
          finalScore: r.finalScore || 0,
          probability: r.probability || "Very Low",
          chance: r.chance || (r.probability === "Very High" || r.probability === "High" ? "high" : 
                               r.probability === "Medium" ? "medium" : 
                               r.probability === "Low" ? "low" : "very_low"),
          reason: r.reason || "Evaluation based on composite score and profile"
        }));
        setResults(mappedResults);
      } else {
        setResults([]);
      }
      
      setShowResults(true);
    } catch (err: any) {
      console.error("Prediction error:", err);
      const errorMessage = err.message || "Unknown error";
      
      // More specific error messages
      if (errorMessage.includes("Failed to fetch") || errorMessage.includes("NetworkError")) {
        alert("Cannot connect to backend server. Please make sure:\n1. Backend server is running on port 3000\n2. MongoDB is connected\n3. Check browser console for details");
      } else if (errorMessage.includes("Server error")) {
        alert(`Backend error: ${errorMessage}\n\nCheck backend console for more details.`);
      } else {
        alert(`Prediction failed: ${errorMessage}\n\nPlease check your connection and try again.`);
      }
      setShowResults(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[720px] w-full mx-auto px-4 pb-12 -mt-6 relative z-10">
      <form onSubmit={handleSubmit} className="bg-card rounded-[20px] shadow-xl p-5 sm:p-7 md:p-9 space-y-8 animate-slide-up">
        
        {/* CAT Performance */}
        <FormSection icon={<FileText className="w-[18px] h-[18px]" />} title="CAT Performance">
          <div className="space-y-5">
            <div>
              <h4 className="text-[13px] font-medium text-card-foreground mb-3">Scaled Marks</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <FormInput label="VARC" value={formData.varcMarks} onChange={(v) => updateField("varcMarks", v)} />
                <FormInput label="DILR" value={formData.dilrMarks} onChange={(v) => updateField("dilrMarks", v)} />
                <FormInput label="QA" value={formData.qaMarks} onChange={(v) => updateField("qaMarks", v)} />
                <FormInput label="Overall" value={formData.overallMarks} onChange={(v) => updateField("overallMarks", v)} />
              </div>
            </div>
            <div>
              <h4 className="text-[13px] font-medium text-card-foreground mb-3">Percentiles</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <FormInput label="VARC %" value={formData.varcPercentile} onChange={(v) => updateField("varcPercentile", v)} />
                <FormInput label="DILR %" value={formData.dilrPercentile} onChange={(v) => updateField("dilrPercentile", v)} />
                <FormInput label="QA %" value={formData.qaPercentile} onChange={(v) => updateField("qaPercentile", v)} />
                <FormInput label="Overall %" value={formData.overallPercentile} onChange={(v) => updateField("overallPercentile", v)} />
              </div>
            </div>
          </div>
        </FormSection>

        {/* Personal Details */}
        <FormSection icon={<User className="w-[18px] h-[18px]" />} title="Personal Details">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
            <FormSelect
              label="Category"
              value={formData.category}
              onChange={(v) => updateField("category", v)}
              options={[
                { value: "general", label: "General" },
                { value: "ews", label: "EWS" },
                { value: "nc-obc", label: "NC-OBC" },
                { value: "sc", label: "SC" },
                { value: "st", label: "ST" },
              ]}
            />
            <ToggleButton
              label="PwD Status"
              value={formData.pwdStatus}
              onChange={(v) => updateField("pwdStatus", v)}
              options={[
                { value: "no", label: "No" },
                { value: "yes", label: "Yes" },
              ]}
            />
            <ToggleButton
              label="Gender"
              value={formData.gender}
              onChange={(v) => updateField("gender", v)}
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
              ]}
            />
          </div>
        </FormSection>

        {/* Academic Profile */}
        <FormSection icon={<GraduationCap className="w-[18px] h-[18px]" />} title="Academic Profile">
          <div className="space-y-6">
            {/* Class 10 */}
            <div>
              <h4 className="text-[13px] font-medium text-card-foreground mb-3">Class 10</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <FormSelect
                  label="Board"
                  value={formData.class10Board}
                  onChange={(v) => updateField("class10Board", v)}
                  options={[
                    { value: "cbse", label: "CBSE" },
                    { value: "icse", label: "ICSE" },
                    { value: "state", label: "State Board" },
                    { value: "other", label: "Other" },
                  ]}
                />
                <FormInput label="Percentage" value={formData.class10Percentage} onChange={(v) => updateField("class10Percentage", v)} />
                <FormInput label="Math Marks (out of 100)" value={formData.class10MathMarks} onChange={(v) => updateField("class10MathMarks", v)} />
              </div>
            </div>

            {/* Class 12 */}
            <div>
              <h4 className="text-[13px] font-medium text-card-foreground mb-3">Class 12</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <FormSelect
                  label="Board"
                  value={formData.class12Board}
                  onChange={(v) => updateField("class12Board", v)}
                  options={[
                    { value: "cbse", label: "CBSE" },
                    { value: "icse", label: "ICSE" },
                    { value: "state", label: "State Board" },
                    { value: "other", label: "Other" },
                  ]}
                />
                <FormSelect
                  label="Stream"
                  value={formData.class12Stream}
                  onChange={(v) => updateField("class12Stream", v)}
                  options={[
                    { value: "science", label: "Science" },
                    { value: "commerce", label: "Commerce" },
                    { value: "arts", label: "Arts/Humanities" },
                  ]}
                />
                <FormInput label="Percentage" value={formData.class12Percentage} onChange={(v) => updateField("class12Percentage", v)} />
              </div>
            </div>

            {/* Graduation */}
            <div>
              <h4 className="text-[13px] font-medium text-card-foreground mb-3">Graduation</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <FormSelect
                  label="Academic Category"
                  value={formData.academicCategory}
                  onChange={(v) => updateField("academicCategory", v)}
                  options={[
                    { value: "ac1", label: "AC-1 (Engineering)" },
                    { value: "ac2", label: "AC-2" },
                    { value: "ac3", label: "AC-3" },
                    { value: "ac4", label: "AC-4 (Medical)" },
                    { value: "ac5", label: "AC-5" },
                  ]}
                />
                <FormInput label="Stream" value={formData.gradStream} onChange={(v) => updateField("gradStream", v)} />
                <FormInput label="Percentage" value={formData.gradPercentage} onChange={(v) => updateField("gradPercentage", v)} />
                <FormInput label="CGPA (if applicable)" value={formData.cgpa} onChange={(v) => updateField("cgpa", v)} />
              </div>
            </div>
          </div>
        </FormSection>

        {/* Work Experience */}
        <FormSection icon={<Briefcase className="w-[18px] h-[18px]" />} title="Work Experience (Months)">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <FormInput label="As on July 30, 2025" value={formData.workExpJuly} onChange={(v) => updateField("workExpJuly", v)} />
            <FormInput label="As on Dec 31, 2025" value={formData.workExpDec} onChange={(v) => updateField("workExpDec", v)} />
            <FormInput label="As on Jan 31, 2026" value={formData.workExpJan} onChange={(v) => updateField("workExpJan", v)} />
          </div>
        </FormSection>

        {/* Professional Qualifications */}
        <FormSection icon={<Award className="w-[18px] h-[18px]" />} title="Professional Qualifications">
          <ToggleButton
            label="Do you have a Professional Qualification? (CA/CS/CMA/CFA)"
            value={formData.hasProfQualification}
            onChange={(v) => updateField("hasProfQualification", v)}
            options={[
              { value: "no", label: "No" },
              { value: "yes", label: "Yes" },
            ]}
          />
        </FormSection>

        {/* Institute Details */}
        <FormSection icon={<Building className="w-[18px] h-[18px]" />} title="Institute Details">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
            <FormInput label="UG NIRF Rank" value={formData.nirfRank} onChange={(v) => updateField("nirfRank", v)} />
            <ToggleButton
              label="IIT / NIT / BITS"
              value={formData.isIITNITBITS}
              onChange={(v) => updateField("isIITNITBITS", v)}
              options={[
                { value: "no", label: "No" },
                { value: "yes", label: "Yes" },
              ]}
            />
            <ToggleButton
              label="Institute of National Importance"
              value={formData.isNationalImportance}
              onChange={(v) => updateField("isNationalImportance", v)}
              options={[
                { value: "no", label: "No" },
                { value: "yes", label: "Yes" },
              ]}
            />
          </div>
        </FormSection>

        {/* Diversity & Extras */}
        <FormSection icon={<Star className="w-[18px] h-[18px]" />} title="Diversity & Extras">
          <div className="space-y-5">
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.isAgriField}
                  onChange={(e) => updateField("isAgriField", e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-input-border text-primary focus:ring-primary/30 cursor-pointer"
                />
                <div>
                  <span className="text-[14px] text-card-foreground group-hover:text-primary transition-colors">Agri / Bio / Vet / Food Tech</span>
                  <span className="text-[12px] text-muted-foreground ml-2">Undergraduate degree in specialized fields</span>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.isCommerceField}
                  onChange={(e) => updateField("isCommerceField", e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-input-border text-primary focus:ring-primary/30 cursor-pointer"
                />
                <div>
                  <span className="text-[14px] text-card-foreground group-hover:text-primary transition-colors">B.Com(H) / Eco / BBA / BMS</span>
                  <span className="text-[12px] text-muted-foreground ml-2">Commerce and Management related degrees</span>
                </div>
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormSelect
                label="IIM Calcutta Academic Category"
                value={formData.iimCalcuttaCategory}
                onChange={(v) => updateField("iimCalcuttaCategory", v)}
                options={[
                  { value: "", label: "Select Category..." },
                  { value: "1", label: "Category 1" },
                  { value: "2", label: "Category 2" },
                  { value: "3", label: "Category 3" },
                ]}
              />
              <FormInput
                label="Extracurricular Rating (0-5)"
                value={formData.extracurricularRating}
                onChange={(v) => updateField("extracurricularRating", v)}
              />
            </div>
          </div>
        </FormSection>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl font-semibold text-[15px] text-white transition-all duration-200 shadow-lg hover:shadow-xl hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #8B7CF6 0%, #7C6BF6 100%)' }}
        >
          {loading ? "Predicting..." : "Predict My IIM Calls"}
        </button>

        {/* Results Section */}
        {showResults && (
          <div className="space-y-5 pt-6 border-t border-input-border animate-fade-in">
            <h2 className="text-xl font-bold text-card-foreground">Predicted Call Chances</h2>
            {results.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No predictions available. Please check your inputs and try again.
              </p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {results.map((result) => (
                    <ResultCard
                      key={result.iim}
                      iimName={result.iim}
                      chance={result.chance}
                      bucket={result.bucket}
                      compositeScore={result.compositeScore}
                      profileScore={result.profileScore}
                      finalScore={result.finalScore}
                      probability={result.probability}
                      eligible={result.eligible}
                      reason={result.reason}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  className="w-full bg-white border border-input-border text-card-foreground py-3.5 rounded-xl font-semibold text-[15px] hover:bg-muted/30 transition-all duration-200"
                >
                  Get Marks Needed to Convert Each Call
                </button>
              </>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default PredictionForm;
