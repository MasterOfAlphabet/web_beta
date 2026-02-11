import React, { useState } from "react";
import {
  Award,
  CheckCircle,
  ChevronRight,
  User,
  Phone,
  Mail,
  Sparkles,
  Target,
  TrendingUp,
  BookOpen,
  Mic,
  Headphones,
  PenTool,
  Eye,
  MessageSquare,
  FileText,
  Lightbulb,
  Star,
  Zap,
  ArrowRight,
  PartyPopper,
} from "lucide-react";

// ══════════════════════════════════════════════════════════════════════════════
// Data & Config
// ══════════════════════════════════════════════════════════════════════════════

const modules = [
  { 
    label: "Spelling", 
    icon: PenTool, 
    color: "from-violet-500 to-purple-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
    text: "text-violet-700"
  },
  { 
    label: "Reading", 
    icon: Eye, 
    color: "from-orange-500 to-red-500",
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700"
  },
  { 
    label: "Pronunciation", 
    icon: Mic, 
    color: "from-pink-500 to-rose-600",
    bg: "bg-pink-50",
    border: "border-pink-200",
    text: "text-pink-700"
  },
  { 
    label: "Grammar", 
    icon: BookOpen, 
    color: "from-green-500 to-emerald-600",
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700"
  },
  { 
    label: "Writing", 
    icon: FileText, 
    color: "from-red-500 to-pink-600",
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700"
  },
  { 
    label: "Listening", 
    icon: Headphones, 
    color: "from-blue-500 to-cyan-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700"
  },
  { 
    label: "Vocabulary", 
    icon: Lightbulb, 
    color: "from-yellow-500 to-orange-500",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-700"
  },
  { 
    label: "S.H.A.R.P", 
    icon: MessageSquare, 
    color: "from-fuchsia-500 to-purple-600",
    bg: "bg-fuchsia-50",
    border: "border-fuchsia-200",
    text: "text-fuchsia-700"
  },
];

// ══════════════════════════════════════════════════════════════════════════════
// Hero Section - Mobile First
// ══════════════════════════════════════════════════════════════════════════════

function AssessmentHero({ onStartClick }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 pb-16 pt-12 px-4 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Floating decorative stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-twinkle"
            style={{
              top: `${(i * 23) % 100}%`,
              left: `${(i * 37) % 100}%`,
              animationDelay: `${i * 0.3}s`,
            }}
          >
            <Star 
              size={i % 3 === 0 ? 16 : 12} 
              className="text-yellow-300" 
              fill={i % 2 === 0 ? "currentColor" : "none"}
            />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-twinkle { animation: twinkle 3s ease-in-out infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 3s linear infinite; }
      `}</style>

      <div className="relative max-w-5xl mx-auto">
        {/* Badge */}
        <div className="flex justify-center mb-6 animate-float">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white/90 font-bold text-xs sm:text-sm tracking-wider">
            <Sparkles size={16} className="text-yellow-300" />
            SKILLS ASSESSMENT
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-center mb-4 leading-tight">
          <span className="text-white">Discover Your</span>
          <br />
          <span 
            className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent animate-shimmer"
            style={{ backgroundSize: '200% auto' }}
          >
            English Superpowers! 🚀
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-white/80 text-center max-w-2xl mx-auto mb-8 px-4 leading-relaxed">
          Take our fun assessment across all <strong className="text-white">8 language skills</strong> and find out if you're ready to shine in the competition! ✨
        </p>

        {/* 8 Module Pills - Mobile Responsive Grid */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 px-2">
          {modules.map((mod, i) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.label}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-2 text-white/90 text-xs sm:text-sm font-semibold hover:bg-white/20 transition-all duration-300 cursor-default animate-float"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <Icon size={14} className="flex-shrink-0" />
                <span className="whitespace-nowrap">{mod.label}</span>
              </div>
            );
          })}
        </div>

        {/* How it Works - Mobile Friendly */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6 mb-10 max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-white/90">
            <div className="flex items-center gap-2 text-sm sm:text-base font-medium">
              <div className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-full p-2">
                <Target size={16} />
              </div>
              <span>Assess 8 Skills</span>
            </div>
            
            <ChevronRight size={20} className="text-white/40 hidden sm:block" />
            <div className="w-px h-4 bg-white/20 sm:hidden" />
            
            <div className="flex items-center gap-2 text-sm sm:text-base font-medium">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full p-2">
                <TrendingUp size={16} />
              </div>
              <span>Get Your Score</span>
            </div>
            
            <ChevronRight size={20} className="text-white/40 hidden sm:block" />
            <div className="w-px h-4 bg-white/20 sm:hidden" />
            
            <div className="flex items-center gap-2 text-sm sm:text-base font-medium">
              <div className="bg-gradient-to-br from-green-400 to-emerald-400 rounded-full p-2">
                <Award size={16} />
              </div>
              <span>Join Competition!</span>
            </div>
          </div>
        </div>

        {/* CTA Button - Touch Friendly */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={onStartClick}
            className="group relative bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-white font-black text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-5 rounded-2xl shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto max-w-md"
          >
            <span className="flex items-center justify-center gap-3">
              <PartyPopper size={24} className="group-hover:animate-bounce" />
              I'm Ready — Let's Start!
              <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          
          <p className="text-white/60 text-xs sm:text-sm font-medium">
            🎉 Free · No Login · Takes 10 Minutes
          </p>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Module Cards - Mobile Optimized Grid
// ══════════════════════════════════════════════════════════════════════════════

function ModuleCards() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-3">
          Your Assessment Journey 🎯
        </h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Complete all 8 modules one by one and unlock your full potential!
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {modules.map((mod, i) => {
          const Icon = mod.icon;
          return (
            <div
              key={mod.label}
              className={`${mod.bg} ${mod.border} border-2 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col items-center justify-center gap-3 hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer group`}
            >
              <div className={`bg-gradient-to-br ${mod.color} rounded-2xl p-3 sm:p-4 group-hover:rotate-6 transition-transform duration-300`}>
                <Icon size={28} className="text-white" strokeWidth={2.5} />
              </div>
              <div className="text-center">
                <h3 className={`font-bold text-sm sm:text-base ${mod.text} mb-1`}>
                  {mod.label}
                </h3>
                <div className="text-xs font-semibold text-gray-500 bg-white rounded-full px-2 py-1 inline-block">
                  Module {i + 1}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Registration Form - Mobile First with Steps
// ══════════════════════════════════════════════════════════════════════════════

function RegistrationForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ fullName: "", mobile: "", email: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setErrors(er => ({ ...er, [field]: "" }));
  };

  const validateStep0 = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Please enter student's name";
    else if (form.fullName.trim().split(" ").length < 2) e.fullName = "Please enter first and last name";
    return e;
  };

  const validateStep1 = () => {
    const e = {};
    const ph = form.mobile.replace(/\D/g, "");
    if (!ph) e.mobile = "Mobile number is required";
    else if (ph.length < 10) e.mobile = "Enter valid 10-digit number";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter valid email";
    return e;
  };

  const handleNext = () => {
    const e = step === 0 ? validateStep0() : validateStep1();
    if (Object.keys(e).length) { setErrors(e); return; }
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
  };

  // Success Screen
  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 sm:px-6 pb-12">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl p-6 sm:p-10 text-center">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-full w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/50 animate-bounce">
            <CheckCircle size={48} className="text-white" strokeWidth={3} />
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">
            You're All Set! 🎉
          </h2>
          
          <p className="text-base sm:text-lg text-gray-700 mb-2">
            <strong className="text-green-700">{form.fullName}</strong>, your assessment is ready!
          </p>
          
          <p className="text-sm sm:text-base text-gray-600 mb-8">
            Good luck across all 8 modules. You've got this! 💪✨
          </p>

          <div className="border-t-2 border-green-200 pt-6 mb-6">
            <p className="text-xs sm:text-sm text-gray-500 mb-1">
              Confirmation sent to:
            </p>
            <p className="text-sm sm:text-base font-bold text-gray-800">
              {form.email || `📱 ${form.mobile}`}
            </p>
          </div>

          <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-base sm:text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
            <Award size={24} />
            Start My Assessment Now!
            <ArrowRight size={24} />
          </button>
        </div>
      </div>
    );
  }

  // Step Progress Indicator
  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[0, 1, 2].map((s) => (
        <div key={s} className="flex items-center">
          <div className={`
            w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-base transition-all duration-300
            ${s <= step 
              ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg' 
              : 'bg-gray-200 text-gray-400'
            }
          `}>
            {s < step ? <CheckCircle size={20} /> : s + 1}
          </div>
          {s < 2 && (
            <div className={`w-8 sm:w-12 h-1 mx-1 rounded-full transition-all duration-300 ${s < step ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-12">
      <div className="bg-white border-2 border-purple-100 rounded-3xl shadow-2xl p-6 sm:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-purple-500/50">
            <Award size={36} className="text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
            Register for Assessment
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Quick sign-up · Less than 1 minute ⚡
          </p>
        </div>

        <StepIndicator />

        {/* Step 0 - Student Name */}
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm sm:text-base font-bold text-gray-900 mb-2">
                Student's Full Name <span className="text-red-500">*</span>
              </label>
              <p className="text-xs sm:text-sm text-gray-500 mb-3">
                Enter first and last name of the student
              </p>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Aanya Sharma"
                  value={form.fullName}
                  onChange={handleChange("fullName")}
                  className={`w-full pl-12 pr-4 py-4 text-base sm:text-lg border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all ${
                    errors.fullName 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                      : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100'
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="mt-2 text-sm text-red-600 font-medium">⚠️ {errors.fullName}</p>
              )}
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
              <div className="flex gap-3">
                <Sparkles size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-900 leading-relaxed">
                  You'll assess <strong>all 8 English modules</strong> one at a time and get instant feedback on your readiness!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 1 - Contact Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm sm:text-base font-bold text-gray-900 mb-2">
                Parent's Mobile Number <span className="text-red-500">*</span>
              </label>
              <p className="text-xs sm:text-sm text-gray-500 mb-3">
                Results and updates will be sent here
              </p>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500">
                  <Phone size={20} />
                </div>
                <input
                  type="tel"
                  placeholder="e.g. 98765 43210"
                  value={form.mobile}
                  onChange={handleChange("mobile")}
                  maxLength={15}
                  className={`w-full pl-12 pr-4 py-4 text-base sm:text-lg border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all ${
                    errors.mobile 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                      : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100'
                  }`}
                />
              </div>
              {errors.mobile && (
                <p className="mt-2 text-sm text-red-600 font-medium">⚠️ {errors.mobile}</p>
              )}
            </div>

            <div>
              <label className="block text-sm sm:text-base font-bold text-gray-900 mb-2">
                Parent's Email{" "}
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Optional</span>
              </label>
              <p className="text-xs sm:text-sm text-gray-500 mb-3">
                We'll email detailed results and improvement tips
              </p>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  placeholder="e.g. parent@email.com"
                  value={form.email}
                  onChange={handleChange("email")}
                  className={`w-full pl-12 pr-4 py-4 text-base sm:text-lg border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all ${
                    errors.email 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                      : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 font-medium">⚠️ {errors.email}</p>
              )}
            </div>
          </div>
        )}

        {/* Step 2 - Confirm */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-5 sm:p-6">
              <h3 className="font-black text-lg sm:text-xl text-purple-900 mb-4 flex items-center gap-2">
                <Zap size={24} className="text-purple-600" />
                Confirm Your Details
              </h3>
              <div className="space-y-3">
                {[
                  { icon: User, label: "Student Name", value: form.fullName },
                  { icon: Phone, label: "Parent's Mobile", value: form.mobile },
                  { icon: Mail, label: "Parent's Email", value: form.email || "Not provided" },
                ].map((row) => {
                  const Icon = row.icon;
                  return (
                    <div key={row.label} className="flex items-start gap-3 bg-white rounded-xl p-3">
                      <div className="bg-purple-100 rounded-lg p-2">
                        <Icon size={18} className="text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-500 mb-0.5">{row.label}</p>
                        <p className="text-sm sm:text-base font-bold text-gray-900 truncate">{row.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 sm:p-5">
              <div className="flex gap-3">
                <Award size={24} className="text-green-600 flex-shrink-0" />
                <div className="text-sm sm:text-base text-green-900 leading-relaxed">
                  After completing all <strong>8 modules</strong>, you'll know if you're{" "}
                  <strong className="text-green-700">Competition Ready ✅</strong> or need more{" "}
                  <strong className="text-orange-700">Practice 💪</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons - Touch Friendly */}
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex-1 sm:flex-none bg-gray-100 text-gray-700 font-bold text-base px-6 sm:px-8 py-4 rounded-2xl hover:bg-gray-200 transition-all duration-300 active:scale-95"
            >
              ← Back
            </button>
          )}
          
          {step < 2 ? (
            <button
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-base sm:text-lg px-6 sm:px-8 py-4 rounded-2xl shadow-lg hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRight size={20} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-black text-base sm:text-lg px-6 sm:px-8 py-4 rounded-2xl shadow-lg hover:shadow-green-500/50 hover:scale-105 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <Award size={20} />
                  Start Assessment!
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Main Page Component
// ══════════════════════════════════════════════════════════════════════════════

export default function SkillAssessmentPage() {
  const [showForm, setShowForm] = useState(false);

  const scrollToForm = () => {
    setShowForm(true);
    setTimeout(() => {
      document.getElementById("registration-form")?.scrollIntoView({ 
        behavior: "smooth", 
        block: "start" 
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      {/* Hero Section */}
      <AssessmentHero onStartClick={scrollToForm} />

      {/* Module Cards */}
      <ModuleCards />

      {/* Registration Form */}
      <div id="registration-form" className="scroll-mt-24">
        {!showForm ? (
          <div className="text-center py-12 sm:py-16 px-4">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4">
              Ready to Discover Your Level? 🎯
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Register now and start your journey to English mastery!
            </p>
            <button
              onClick={scrollToForm}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-5 rounded-2xl shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 active:scale-95 inline-flex items-center gap-3"
            >
              <Award size={24} />
              Register & Start Assessment
              <ArrowRight size={24} />
            </button>
          </div>
        ) : (
          <RegistrationForm />
        )}
      </div>

      {/* Footer spacing */}
      <div className="h-12 sm:h-20" />
    </div>
  );
}
