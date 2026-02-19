import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Building2,
  MapPin,
  Map,
  Globe2,
  Users,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Trophy,
  TrendingUp,
  Award,
  ChevronDown,
} from "lucide-react";

export default function ParentRankingFieldsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get assessment results from navigation state
  const assessmentResults = location.state?.assessmentResults || {};
  const studentData = location.state?.studentData || {};

  const [form, setForm] = useState({
    schoolName: "",
    gender: "",
    district: "",
    city: "",
    state: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm(f => ({ ...f, [field]: value }));
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleBlur = (field) => () => {
    // Only mark as touched, don't validate until submit
    setTouched(t => ({ ...t, [field]: true }));
  };

  const validateField = (field, value) => {
    const newErrors = { ...errors };
    
    if (["schoolName", "district", "city", "state"].includes(field)) {
      if (!value.trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      } else {
        delete newErrors[field];
      }
    }
    
    if (field === "gender") {
      if (!value) {
        newErrors.gender = "Please select gender";
      } else {
        delete newErrors.gender;
      }
    }
    
    setErrors(newErrors);
  };

  const validate = () => {
    const newErrors = {};
    
    if (!form.schoolName.trim()) newErrors.schoolName = "School name is required";
    if (!form.gender) newErrors.gender = "Please select gender";
    if (!form.district.trim()) newErrors.district = "District is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.state.trim()) newErrors.state = "State is required";
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      setTouched({ schoolName: true, gender: true, district: true, city: true, state: true });
      return;
    }
    
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setSubmitting(false);
    
    // Navigate to share results page with all data
    navigate("/results/share", {
      state: {
        assessmentResults,
        studentData,
        rankingData: form
      }
    });
  };

  const handleSkip = () => {
    // Show confirmation modal first
    setShowSkipModal(true);
  };

  const confirmSkip = () => {
    // Navigate to share results without ranking data
    navigate("/results/share", {
      state: {
        assessmentResults,
        studentData,
        rankingData: null
      }
    });
  };

  const isFieldValid = (field) => touched[field] && !errors[field] && form[field];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full shadow-2xl shadow-purple-500/50 mb-4">
            <Trophy size={48} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-2">
            Unlock Your Child's Ranking! 🏆
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Add optional details to see how <strong>{studentData.fullName}</strong> ranks at school, district, city, and state levels
          </p>
        </div>

        {/* Benefits Card */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
          <p className="font-black text-blue-900 mb-4 text-lg flex items-center gap-2">
            <TrendingUp size={24} className="text-blue-600" />
            Why Add These Details?
          </p>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" strokeWidth={3} />
              <span>See your child's <strong>rank at 4 levels</strong>: School, District, City, State</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" strokeWidth={3} />
              <span>Compare with <strong>peers in same category</strong> (age + gender)</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" strokeWidth={3} />
              <span>Track <strong>progress over time</strong> in your region</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" strokeWidth={3} />
              <span><strong>100% optional</strong> - You can skip and view results anytime</span>
            </li>
          </ul>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-purple-100 p-6 sm:p-10 mb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 text-center">
            Optional Ranking Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* School Name */}
            <div>
              <label className="flex items-center justify-between text-base font-bold text-gray-900 mb-3">
                <span>School Name</span>
                {isFieldValid("schoolName") && <CheckCircle size={16} className="text-green-600" />}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500">
                  <Building2 size={20} strokeWidth={2.5} />
                </div>
                <input
                  type="text"
                  placeholder="e.g., Delhi Public School"
                  value={form.schoolName}
                  onChange={handleChange("schoolName")}
                  onBlur={handleBlur("schoolName")}
                  className={`w-full pl-12 pr-4 py-3.5 text-base border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${
                    errors.schoolName && touched.schoolName
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                      : isFieldValid("schoolName")
                      ? 'border-green-300 focus:border-green-500 focus:ring-green-100'
                      : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100'
                  }`}
                />
                {isFieldValid("schoolName") && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <CheckCircle size={20} className="text-green-500" />
                  </div>
                )}
              </div>
              {errors.schoolName && touched.schoolName && (
                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm font-semibold">
                  <AlertCircle size={14} />
                  {errors.schoolName}
                </div>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="flex items-center justify-between text-base font-bold text-gray-900 mb-3">
                <span>Gender</span>
                {isFieldValid("gender") && <CheckCircle size={16} className="text-green-600" />}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500">
                  <Users size={20} strokeWidth={2.5} />
                </div>
                <select
                  value={form.gender}
                  onChange={handleChange("gender")}
                  onBlur={handleBlur("gender")}
                  className={`w-full pl-12 pr-10 py-3.5 text-base border-2 rounded-xl focus:outline-none focus:ring-4 transition-all appearance-none cursor-pointer ${
                    errors.gender && touched.gender
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                      : isFieldValid("gender")
                      ? 'border-green-300 focus:border-green-500 focus:ring-green-100'
                      : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100'
                  }`}
                >
                  <option value="">Select Gender</option>
                  <option value="boy">Boy</option>
                  <option value="girl">Girl</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  {isFieldValid("gender") ? (
                    <CheckCircle size={20} className="text-green-500" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-400" />
                  )}
                </div>
              </div>
              {errors.gender && touched.gender && (
                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm font-semibold">
                  <AlertCircle size={14} />
                  {errors.gender}
                </div>
              )}
            </div>

            {/* District */}
            <div>
              <label className="flex items-center justify-between text-base font-bold text-gray-900 mb-3">
                <span>District</span>
                {isFieldValid("district") && <CheckCircle size={16} className="text-green-600" />}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500">
                  <Map size={20} strokeWidth={2.5} />
                </div>
                <input
                  type="text"
                  placeholder="e.g., South Delhi"
                  value={form.district}
                  onChange={handleChange("district")}
                  onBlur={handleBlur("district")}
                  className={`w-full pl-12 pr-4 py-3.5 text-base border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${
                    errors.district && touched.district
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                      : isFieldValid("district")
                      ? 'border-green-300 focus:border-green-500 focus:ring-green-100'
                      : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100'
                  }`}
                />
                {isFieldValid("district") && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <CheckCircle size={20} className="text-green-500" />
                  </div>
                )}
              </div>
              {errors.district && touched.district && (
                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm font-semibold">
                  <AlertCircle size={14} />
                  {errors.district}
                </div>
              )}
            </div>

            {/* City & State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* City */}
              <div>
                <label className="flex items-center justify-between text-base font-bold text-gray-900 mb-3">
                  <span>City</span>
                  {isFieldValid("city") && <CheckCircle size={16} className="text-green-600" />}
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500">
                    <MapPin size={20} strokeWidth={2.5} />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g., New Delhi"
                    value={form.city}
                    onChange={handleChange("city")}
                    onBlur={handleBlur("city")}
                    className={`w-full pl-12 pr-4 py-3.5 text-base border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${
                      errors.city && touched.city
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                        : isFieldValid("city")
                        ? 'border-green-300 focus:border-green-500 focus:ring-green-100'
                        : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100'
                    }`}
                  />
                  {isFieldValid("city") && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <CheckCircle size={20} className="text-green-500" />
                    </div>
                  )}
                </div>
                {errors.city && touched.city && (
                  <div className="mt-2 flex items-center gap-2 text-red-600 text-sm font-semibold">
                    <AlertCircle size={14} />
                    {errors.city}
                  </div>
                )}
              </div>

              {/* State */}
              <div>
                <label className="flex items-center justify-between text-base font-bold text-gray-900 mb-3">
                  <span>State</span>
                  {isFieldValid("state") && <CheckCircle size={16} className="text-green-600" />}
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500">
                    <Globe2 size={20} strokeWidth={2.5} />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g., Delhi"
                    value={form.state}
                    onChange={handleChange("state")}
                    onBlur={handleBlur("state")}
                    className={`w-full pl-12 pr-4 py-3.5 text-base border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${
                      errors.state && touched.state
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                        : isFieldValid("state")
                        ? 'border-green-300 focus:border-green-500 focus:ring-green-100'
                        : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100'
                    }`}
                  />
                  {isFieldValid("state") && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <CheckCircle size={20} className="text-green-500" />
                    </div>
                  )}
                </div>
                {errors.state && touched.state && (
                  <div className="mt-2 flex items-center gap-2 text-red-600 text-sm font-semibold">
                    <AlertCircle size={14} />
                    {errors.state}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={handleSkip}
                className="flex-1 bg-gray-100 text-gray-900 font-bold text-lg px-8 py-4 rounded-2xl hover:bg-gray-200 hover:scale-105 transition-all duration-300 border-2 border-gray-200"
              >
                Skip for Now
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-lg px-8 py-4 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Award size={24} strokeWidth={2.5} />
                    <span>Show My Results</span>
                    <ArrowRight size={24} strokeWidth={2.5} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Skip Confirmation Modal */}
        {showSkipModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl">
              <div className="text-center">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">
                  One-Time Opportunity!
                </h3>
                <p className="text-gray-700 mb-4 text-base leading-relaxed">
                  This is your only chance to unlock ranking insights at <strong>School, District, City, and State levels</strong>.
                </p>
                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-6">
                  <p className="text-amber-900 text-sm font-semibold">
                    ⚠️ Once you skip, you cannot add ranking details later for this assessment.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowSkipModal(false)}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-xl hover:scale-105 transition-all shadow-lg"
                  >
                    Go Back & Add Details
                  </button>
                  <button
                    onClick={confirmSkip}
                    className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-200 transition-all"
                  >
                    Proceed Without Rankings
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Note */}
        <div className="text-center text-sm text-gray-600">
          <p className="flex items-center justify-center gap-2">
            <CheckCircle size={14} className="text-green-600" />
            Your data is encrypted and never shared with third parties
          </p>
        </div>
      </div>
    </div>
  );
}
