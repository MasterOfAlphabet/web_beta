import React, { useState } from "react";
import {
  Award,
  CheckCircle,
  User,
  Mail,
  Building2,
  GraduationCap,
  ChevronDown,
  Check,
  AlertCircle,
  ArrowRight,
  BarChart3,
  Star,
  Hash,
  Users,
} from "lucide-react";

const grades = Array.from({ length: 10 }, (_, i) => ({
  value: i + 1,
  label: `Grade ${i + 1}`,
}));

export default function SchoolRegistrationPage() {
  const [form, setForm] = useState({ 
    fullName: "", 
    grade: "", 
    section: "",
    rollNumber: "",
    schoolName: "", 
    email: ""
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm(f => ({ ...f, [field]: value }));
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleBlur = (field) => () => {
    setTouched(t => ({ ...t, [field]: true }));
    validateField(field, form[field]);
  };

  const validateField = (field, value) => {
    const newErrors = { ...errors };
    
    if (field === "fullName") {
      if (!value.trim()) {
        newErrors.fullName = "Student's name is required";
      } else if (value.trim().split(" ").length < 2) {
        newErrors.fullName = "Please enter first and last name";
      } else {
        delete newErrors.fullName;
      }
    }
    
    if (field === "grade") {
      if (!value) {
        newErrors.grade = "Please select grade";
      } else {
        delete newErrors.grade;
      }
    }
    
    if (field === "section") {
      if (!value.trim()) {
        newErrors.section = "Section is required";
      } else {
        delete newErrors.section;
      }
    }
    
    if (field === "schoolName") {
      if (!value.trim()) {
        newErrors.schoolName = "School name is required";
      } else {
        delete newErrors.schoolName;
      }
    }
    
    if (field === "email" && value) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors.email = "Enter valid email address";
      } else {
        delete newErrors.email;
      }
    }
    
    setErrors(newErrors);
  };

  const validate = () => {
    const newErrors = {};
    
    if (!form.fullName.trim()) {
      newErrors.fullName = "Student's name is required";
    } else if (form.fullName.trim().split(" ").length < 2) {
      newErrors.fullName = "Please enter first and last name";
    }
    
    if (!form.grade) {
      newErrors.grade = "Please select grade";
    }
    
    if (!form.section.trim()) {
      newErrors.section = "Section is required";
    }
    
    if (!form.schoolName.trim()) {
      newErrors.schoolName = "School name is required";
    }
    
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter valid email address";
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      setTouched({ fullName: true, grade: true, section: true, schoolName: true, email: true });
      return;
    }
    
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1800));
    setSubmitting(false);
    setSubmitted(true);
  };

  const isFieldValid = (field) => touched[field] && !errors[field] && form[field];

  // Success Screen
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl border-4 border-green-300 p-8 sm:p-12 text-center">
            <div className="relative inline-block mb-8">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-full w-28 h-28 flex items-center justify-center mx-auto shadow-2xl shadow-green-500/50 animate-bounce">
                <CheckCircle size={64} className="text-white" strokeWidth={3} />
              </div>
              <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full w-12 h-12 flex items-center justify-center shadow-lg animate-pulse">
                <Award size={24} className="text-yellow-800" strokeWidth={3} />
              </div>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Registration Successful! 🎉
            </h2>
            
            <p className="text-xl sm:text-2xl text-gray-800 mb-3">
              <strong className="text-green-700">{form.fullName}</strong> is all set!
            </p>
            
            <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Student from <strong>{form.schoolName}</strong> (Grade {form.grade}-{form.section}) 
              will complete the <strong>8-module diagnostic</strong>. Good luck! 💪✨
            </p>

            <div className="bg-white border-2 border-green-200 rounded-2xl p-6 mb-8 max-w-xl mx-auto">
              <p className="text-sm font-bold text-gray-700 mb-4">📋 Student Details:</p>
              <div className="space-y-2 text-left">
                <div className="bg-gray-50 rounded-xl p-3">
                  <span className="text-sm text-gray-600">Name:</span>
                  <div className="font-bold text-gray-900">{form.fullName}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <span className="text-sm text-gray-600">School:</span>
                  <div className="font-bold text-gray-900">{form.schoolName}</div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-gray-50 rounded-xl p-3">
                    <span className="text-sm text-gray-600">Grade:</span>
                    <div className="font-bold text-gray-900">{form.grade}</div>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-xl p-3">
                    <span className="text-sm text-gray-600">Section:</span>
                    <div className="font-bold text-gray-900">{form.section}</div>
                  </div>
                  {form.rollNumber && (
                    <div className="flex-1 bg-gray-50 rounded-xl p-3">
                      <span className="text-sm text-gray-600">Roll #:</span>
                      <div className="font-bold text-gray-900">{form.rollNumber}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-200 rounded-2xl p-6 mb-8">
              <p className="font-black text-purple-900 mb-3 text-lg">🎓 What's Next?</p>
              <p className="text-gray-700 text-sm leading-relaxed">
                Your school coordinator will receive the assessment link. 
                Complete the test at school or at home within 24 hours. 
                Results will be shared with your school for reporting.
              </p>
            </div>

            <button 
              onClick={() => window.location.href = '/assessment/start'}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-lg sm:text-xl px-10 py-5 rounded-2xl shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 mb-4"
            >
              <BarChart3 size={28} strokeWidth={2.5} />
              Start Assessment Now
              <ArrowRight size={28} strokeWidth={2.5} />
            </button>

            <p className="text-sm text-gray-500">⏱️ Takes 10-15 minutes • Can pause anytime</p>
          </div>
        </div>
      </div>
    );
  }

  // Registration Form
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full px-5 py-2 text-sm font-semibold text-blue-700 mb-6 shadow-lg">
            <Building2 size={16} />
            <span>SCHOOL ASSESSMENT PROGRAM</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-4 leading-tight">
            Student Registration
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            8-module English skill diagnostic for school-wide benchmarking
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-purple-100 p-6 sm:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-2xl shadow-blue-500/50 mb-4">
              <GraduationCap size={40} className="text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
              School Assessment Registration
            </h2>
            <p className="text-gray-600 text-base">
              5 fields • Takes 60 seconds ⚡
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Name + Grade */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center justify-between text-base font-bold text-gray-900 mb-3">
                  <span>Student's Full Name <span className="text-red-500">*</span></span>
                  {isFieldValid("fullName") && <span className="flex items-center gap-1 text-green-600 text-sm font-semibold"><CheckCircle size={16} /></span>}
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"><User size={20} strokeWidth={2.5} /></div>
                  <input type="text" placeholder="e.g., Aarav Kumar" value={form.fullName} onChange={handleChange("fullName")} onBlur={handleBlur("fullName")} className={`w-full pl-12 pr-4 py-3.5 text-base border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${errors.fullName && touched.fullName ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : isFieldValid("fullName") ? 'border-green-300 focus:border-green-500 focus:ring-green-100' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'}`} />
                  {isFieldValid("fullName") && <div className="absolute right-4 top-1/2 -translate-y-1/2"><CheckCircle size={20} className="text-green-500" /></div>}
                </div>
                {errors.fullName && touched.fullName && <div className="mt-2 flex items-center gap-2 text-red-600 text-sm font-semibold"><AlertCircle size={14} />{errors.fullName}</div>}
              </div>

              <div>
                <label className="flex items-center justify-between text-base font-bold text-gray-900 mb-3">
                  <span>Grade <span className="text-red-500">*</span></span>
                  {isFieldValid("grade") && <span className="flex items-center gap-1 text-green-600 text-sm font-semibold"><CheckCircle size={16} /></span>}
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"><GraduationCap size={20} strokeWidth={2.5} /></div>
                  <select value={form.grade} onChange={handleChange("grade")} onBlur={handleBlur("grade")} className={`w-full pl-12 pr-10 py-3.5 text-base border-2 rounded-xl focus:outline-none focus:ring-4 transition-all appearance-none cursor-pointer ${errors.grade && touched.grade ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : isFieldValid("grade") ? 'border-green-300 focus:border-green-500 focus:ring-green-100' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'}`}>
                    <option value="">Select Grade</option>
                    {grades.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">{isFieldValid("grade") ? <CheckCircle size={20} className="text-green-500" /> : <ChevronDown size={20} className="text-gray-400" />}</div>
                </div>
                {errors.grade && touched.grade && <div className="mt-2 flex items-center gap-2 text-red-600 text-sm font-semibold"><AlertCircle size={14} />{errors.grade}</div>}
              </div>
            </div>

            {/* Row 2: Section + Roll Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center justify-between text-base font-bold text-gray-900 mb-3">
                  <span>Section <span className="text-red-500">*</span></span>
                  {isFieldValid("section") && <span className="flex items-center gap-1 text-green-600 text-sm font-semibold"><CheckCircle size={16} /></span>}
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"><Users size={20} strokeWidth={2.5} /></div>
                  <input type="text" placeholder="e.g., A, B, or Alpha" value={form.section} onChange={handleChange("section")} onBlur={handleBlur("section")} className={`w-full pl-12 pr-4 py-3.5 text-base border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${errors.section && touched.section ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : isFieldValid("section") ? 'border-green-300 focus:border-green-500 focus:ring-green-100' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'}`} />
                  {isFieldValid("section") && <div className="absolute right-4 top-1/2 -translate-y-1/2"><CheckCircle size={20} className="text-green-500" /></div>}
                </div>
                {errors.section && touched.section && <div className="mt-2 flex items-center gap-2 text-red-600 text-sm font-semibold"><AlertCircle size={14} />{errors.section}</div>}
              </div>

              <div>
                <label className="flex items-center justify-between text-base font-bold text-gray-900 mb-3">
                  <span className="flex items-center gap-2">Roll Number <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Optional</span></span>
                  {isFieldValid("rollNumber") && <span className="flex items-center gap-1 text-green-600 text-sm font-semibold"><CheckCircle size={16} /></span>}
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"><Hash size={20} strokeWidth={2.5} /></div>
                  <input type="text" placeholder="e.g., 15 or 2024-A-15" value={form.rollNumber} onChange={handleChange("rollNumber")} onBlur={handleBlur("rollNumber")} className="w-full pl-12 pr-4 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all" />
                </div>
              </div>
            </div>

            {/* Row 3: School Name */}
            <div>
              <label className="flex items-center justify-between text-base font-bold text-gray-900 mb-3">
                <span>School Name <span className="text-red-500">*</span></span>
                {isFieldValid("schoolName") && <span className="flex items-center gap-1 text-green-600 text-sm font-semibold"><CheckCircle size={16} /></span>}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"><Building2 size={20} strokeWidth={2.5} /></div>
                <input type="text" placeholder="e.g., Delhi Public School, R.K. Puram" value={form.schoolName} onChange={handleChange("schoolName")} onBlur={handleBlur("schoolName")} className={`w-full pl-12 pr-4 py-3.5 text-base border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${errors.schoolName && touched.schoolName ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : isFieldValid("schoolName") ? 'border-green-300 focus:border-green-500 focus:ring-green-100' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'}`} />
                {isFieldValid("schoolName") && <div className="absolute right-4 top-1/2 -translate-y-1/2"><CheckCircle size={20} className="text-green-500" /></div>}
              </div>
              {errors.schoolName && touched.schoolName && <div className="mt-2 flex items-center gap-2 text-red-600 text-sm font-semibold"><AlertCircle size={14} />{errors.schoolName}</div>}
            </div>

            {/* Row 4: Email (Optional) */}
            <div>
              <label className="flex items-center justify-between text-base font-bold text-gray-900 mb-3">
                <span className="flex items-center gap-2">Student/Parent Email <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Optional</span></span>
                {isFieldValid("email") && <span className="flex items-center gap-1 text-green-600 text-sm font-semibold"><CheckCircle size={16} /></span>}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"><Mail size={20} strokeWidth={2.5} /></div>
                <input type="email" placeholder="e.g., student@email.com (optional)" value={form.email} onChange={handleChange("email")} onBlur={handleBlur("email")} className={`w-full pl-12 pr-4 py-3.5 text-base border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${errors.email && touched.email ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : isFieldValid("email") ? 'border-green-300 focus:border-green-500 focus:ring-green-100' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'}`} />
                {isFieldValid("email") && <div className="absolute right-4 top-1/2 -translate-y-1/2"><CheckCircle size={20} className="text-green-500" /></div>}
              </div>
              {errors.email && touched.email && <div className="mt-2 flex items-center gap-2 text-red-600 text-sm font-semibold"><AlertCircle size={14} />{errors.email}</div>}
            </div>

            {/* Info Box */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-5">
              <div className="flex gap-4">
                <BarChart3 size={24} className="text-blue-600 flex-shrink-0 mt-1" strokeWidth={2.5} />
                <div className="text-sm text-gray-800 leading-relaxed">
                  <p className="font-black text-blue-900 mb-3">🏫 School Assessment Process:</p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2"><Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" strokeWidth={3} /><span>Complete <strong>8-module diagnostic</strong> (10-15 mins)</span></li>
                    <li className="flex items-start gap-2"><Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" strokeWidth={3} /><span>Results sent to <strong>school coordinator</strong></span></li>
                    <li className="flex items-start gap-2"><Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" strokeWidth={3} /><span>Included in <strong>school-wide analytics</strong></span></li>
                    <li className="flex items-start gap-2"><Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" strokeWidth={3} /><span>Personal report with <strong>improvement recommendations</strong></span></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={submitting} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black text-lg px-8 py-5 rounded-2xl shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3">
              {submitting ? <><div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" /><span>Registering...</span></> : <><Award size={24} strokeWidth={2.5} /><span>Register & Start Assessment</span><ArrowRight size={24} strokeWidth={2.5} /></>}
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2">
              <Building2 size={14} className="text-blue-600" />
              <span>Results shared with school for benchmarking</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
