import React, { useState, useEffect } from "react";
import {
  Award,
  CheckCircle,
  User,
  Phone,
  Mail,
  Sparkles,
  Shield,
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
  ArrowRight,
  Download,
  ChevronDown,
  MessageCircle,
  Lock,
  Users,
  BarChart3,
  Zap,
  GraduationCap,
  Trophy,
  Target,
  Check,
  AlertCircle,
} from "lucide-react";

// ══════════════════════════════════════════════════════════════════════════════
// CONSTANTS & DATA - Using Your Exact Color Palette
// ══════════════════════════════════════════════════════════════════════════════

const modules = [
  { 
    id: 1, 
    label: "Spelling", 
    icon: PenTool, 
    iconColor: "#8b5cf6",
    bgColor: "#f3f0ff",
    borderColor: "#e9d5ff",
    example: "Can spell 'accommodation'?" 
  },
  { 
    id: 2, 
    label: "Reading", 
    icon: Eye, 
    iconColor: "#f97316",
    bgColor: "#fff7ed",
    borderColor: "#fed7aa",
    example: "Comprehends grade-level passages?" 
  },
  { 
    id: 3, 
    label: "Pronunciation", 
    icon: Mic, 
    iconColor: "#ec4899",
    bgColor: "#fdf2f8",
    borderColor: "#fbcfe8",
    example: "Speaks clearly & confidently?" 
  },
  { 
    id: 4, 
    label: "Grammar", 
    icon: BookOpen, 
    iconColor: "#10b981",
    bgColor: "#f0fdf4",
    borderColor: "#bbf7d0",
    example: "Uses correct tenses?" 
  },
  { 
    id: 5, 
    label: "Writing", 
    icon: FileText, 
    iconColor: "#ef4444",
    bgColor: "#fef2f2",
    borderColor: "#fecaca",
    example: "Writes coherent essays?" 
  },
  { 
    id: 6, 
    label: "Listening", 
    icon: Headphones, 
    iconColor: "#3b82f6",
    bgColor: "#eff6ff",
    borderColor: "#bfdbfe",
    example: "Follows oral instructions?" 
  },
  { 
    id: 7, 
    label: "Vocabulary", 
    icon: Lightbulb, 
    iconColor: "#f59e0b",
    bgColor: "#fffbeb",
    borderColor: "#fde68a",
    example: "Uses diverse words?" 
  },
  { 
    id: 8, 
    label: "S.H.A.R.P", 
    icon: MessageSquare, 
    iconColor: "#a855f7",
    bgColor: "#faf5ff",
    borderColor: "#e9d5ff",
    example: "Recognizes word patterns?" 
  },
];

const grades = Array.from({ length: 10 }, (_, i) => ({
  value: i + 1,
  label: `Grade ${i + 1}`,
}));

const trustBadges = [
  { icon: Shield, text: "256-bit Encrypted", color: "#10b981" },
  { icon: Lock, text: "GDPR Compliant", color: "#3b82f6" },
  { icon: Users, text: "15,000+ Parents", color: "#8b5cf6" },
  { icon: BarChart3, text: "86% Discover Strengths", color: "#f59e0b" },
];

const faqs = [
  {
    q: "Is this assessment really 100% free?",
    a: "Yes! Completely free, forever. No credit card, no hidden fees, no trial period. We believe every child deserves access to quality assessment.",
  },
  {
    q: "How long does the assessment take?",
    a: "Typically 10-15 minutes to complete all 8 modules. Your child can take breaks and resume anytime within 24 hours.",
  },
  {
    q: "What happens after registration?",
    a: "You'll receive an instant assessment link via SMS. Your child completes the test, and you get a detailed PDF report with strengths, weaknesses, and personalized improvement tips.",
  },
  {
    q: "Is my child's data safe?",
    a: "Absolutely. All data is encrypted, never shared with third parties, and automatically deleted after 90 days. We're GDPR compliant and take privacy seriously.",
  },
  {
    q: "Which competitions is this aligned with?",
    a: "Our assessment is designed for National Spell Bee, English Olympiad, CBSE/ICSE curriculum standards, and international competitions like Oxford Spelling Bee.",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai, Maharashtra",
    grade: "Grade 7 Parent",
    text: "Discovered my daughter excels in vocabulary but needs pronunciation practice. The report was so detailed! She's now preparing for the National Spell Bee.",
    rating: 5,
    avatar: "PS",
  },
  {
    name: "Rajesh Kumar",
    location: "Bangalore, Karnataka",
    grade: "Grade 4 Parent",
    text: "Free, fast, and incredibly insightful. My son improved 40% in just 2 months following the personalized tips. Highly recommend!",
    rating: 5,
    avatar: "RK",
  },
  {
    name: "Anita Desai",
    location: "Delhi NCR",
    grade: "Grade 9 Parent",
    text: "Best assessment tool I've used. The instant feedback helped us focus on grammar and writing—areas we didn't even know needed work.",
    rating: 5,
    avatar: "AD",
  },
];

const statsData = [
  { value: "15,000+", label: "Parents Trust Us" },
  { value: "8 Modules", label: "Comprehensive Test" },
  { value: "86%", label: "Find Hidden Strengths" },
  { value: "100% Free", label: "Always Free" },
];

// ══════════════════════════════════════════════════════════════════════════════
// UTILITY COMPONENTS
// ══════════════════════════════════════════════════════════════════════════════

const StarField = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(25)].map((_, i) => (
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
);

const AnimatedBlobs = () => (
  <div className="absolute inset-0 opacity-30">
    <div className="absolute top-0 -left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
    <div className="absolute top-0 -right-10 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
    <div className="absolute -bottom-10 left-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// HERO SECTION - Improved Copy
// ══════════════════════════════════════════════════════════════════════════════

const HeroSection = ({ onStartClick, liveCount }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-950 pt-16 pb-20 px-4 sm:px-6 lg:px-8">
      <AnimatedBlobs />
      <StarField />

      {/* Global Animations */}
      <style>{`
        @keyframes blob { 0%, 100% { transform: translate(0, 0) scale(1); } 33% { transform: translate(40px, -60px) scale(1.1); } 66% { transform: translate(-30px, 30px) scale(0.9); } }
        @keyframes twinkle { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 1; transform: scale(1.3); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 30px rgba(139, 92, 246, 0.5); } 50% { box-shadow: 0 0 60px rgba(139, 92, 246, 0.8); } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes countUp { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
        .animate-blob { animation: blob 8s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-twinkle { animation: twinkle 4s ease-in-out infinite; }
        .animate-glow { animation: glow 3s ease-in-out infinite; }
        .animate-slideInUp { animation: slideInUp 0.6s ease-out; }
        .animate-countUp { animation: countUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); }
      `}</style>

      <div className="relative max-w-6xl mx-auto">
        {/* Top Badge */}
        <div className="flex justify-center mb-8 animate-slideInUp">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md border border-purple-300/30 rounded-full px-5 py-2.5 text-purple-100 shadow-lg">
            <GraduationCap size={18} className="text-yellow-400" />
            <span className="font-bold text-sm tracking-wide">FOR STUDENTS GRADE 1-10 ACROSS INDIA</span>
          </div>
        </div>

        {/* Main Heading - New Summer-focused Copy */}
        <div className="text-center mb-8 animate-slideInUp" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6">
            <span className="text-white block mb-2">Dear Parents,</span>
            <span className="text-purple-100 block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Your child's summer break is around the corner
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-purple-100 max-w-5xl mx-auto leading-relaxed">
            It's time to do an English Language Skills Assessment to find their{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-black px-4 py-2 rounded-xl shadow-lg">
                National/Global Competitions Readiness
              </span>
            </span>
            {" "}and/or{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black px-4 py-2 rounded-xl shadow-lg">
                Exponentially Improve Their English Skills
              </span>
            </span>
          </p>
        </div>

        {/* 8 Modules Grid - Using Your Exact Colors */}
        <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 backdrop-blur-md border border-purple-300/30 rounded-3xl p-6 sm:p-8 mb-10 max-w-5xl mx-auto shadow-2xl animate-slideInUp" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-3 shadow-lg flex-shrink-0">
              <Target size={28} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-white font-black text-xl sm:text-2xl mb-2">
                Comprehensive 8-Module Assessment
              </h3>
              <p className="text-purple-200 text-sm sm:text-base">
                Aligned with CBSE, ICSE & International Competition Standards
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {modules.map((mod, i) => {
              const Icon = mod.icon;
              return (
                <div 
                  key={mod.id} 
                  className="group relative cursor-pointer"
                  style={{
                    animation: `float 3s ease-in-out infinite`,
                    animationDelay: `${i * 0.15}s`,
                  }}
                >
                  <div 
                    className="rounded-2xl p-4 transition-all duration-300 border-2 hover:scale-105 hover:shadow-xl"
                    style={{
                      backgroundColor: mod.bgColor,
                      borderColor: mod.borderColor,
                    }}
                  >
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg"
                      style={{ backgroundColor: mod.iconColor }}
                    >
                      <Icon size={28} className="text-white" strokeWidth={2.5} />
                    </div>
                    <div 
                      className="font-bold text-sm sm:text-base text-center mb-1"
                      style={{ color: mod.iconColor }}
                    >
                      {mod.label}
                    </div>
                    <div className="text-xs text-center font-semibold text-gray-600">
                      Module {i + 1}
                    </div>
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl w-48 z-50">
                    <div className="font-semibold mb-1">{mod.label}</div>
                    <div className="text-gray-300">{mod.example}</div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trust Bar - Redesigned */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-10 max-w-5xl mx-auto shadow-2xl animate-glow animate-slideInUp" style={{ animationDelay: '0.3s' }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-white text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="bg-white/20 backdrop-blur rounded-full p-3">
                <Sparkles size={28} strokeWidth={2.5} />
              </div>
              <div>
                <div className="font-black text-2xl sm:text-3xl">100% FREE</div>
                <div className="text-emerald-100 text-sm font-medium">Forever. No Hidden Costs.</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="bg-white/20 backdrop-blur rounded-full p-3">
                <Zap size={28} strokeWidth={2.5} />
              </div>
              <div>
                <div className="font-black text-2xl sm:text-3xl">1 MINUTE</div>
                <div className="text-emerald-100 text-sm font-medium">To Register. No Login.</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="bg-white/20 backdrop-blur rounded-full p-3">
                <Download size={28} strokeWidth={2.5} />
              </div>
              <div>
                <div className="font-black text-2xl sm:text-3xl">INSTANT PDF</div>
                <div className="text-emerald-100 text-sm font-medium">Detailed Report + Tips</div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Counter */}
        <div className="text-center mb-8 animate-slideInUp" style={{ animationDelay: '0.4s' }}>
          <div className="inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm border border-orange-300/30 rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-orange-100 text-sm font-semibold">
              <span className="font-black text-orange-300 animate-countUp">{liveCount}</span> parents registered today
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center animate-slideInUp" style={{ animationDelay: '0.5s' }}>
          <button
            onClick={onStartClick}
            className="group relative bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500 text-white font-black text-lg sm:text-xl px-12 sm:px-16 py-5 sm:py-6 rounded-2xl shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto max-w-2xl"
          >
            <span className="flex items-center justify-center gap-3">
              <Trophy size={28} className="group-hover:animate-bounce" strokeWidth={2.5} />
              Assess My Child Now — FREE!
              <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" strokeWidth={2.5} />
            </span>
          </button>
        </div>

        {/* Subtext */}
        <p className="text-center text-purple-300 text-sm sm:text-base mt-4 font-medium animate-slideInUp" style={{ animationDelay: '0.6s' }}>
          ✨ Join 15,000+ parents • Get instant results in 10-15 minutes
        </p>

        {/* Trust Badges Row */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-10 animate-slideInUp" style={{ animationDelay: '0.7s' }}>
          {trustBadges.map((badge, i) => {
            const Icon = badge.icon;
            return (
              <div key={i} className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
                <Icon size={16} style={{ color: badge.color }} />
                <span className="text-purple-100 text-xs sm:text-sm font-semibold">{badge.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// SOCIAL PROOF SECTION
// ══════════════════════════════════════════════════════════════════════════════

const SocialProofSection = () => {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {statsData.map((stat, i) => (
            <div key={i} className="text-center bg-white rounded-2xl p-6 shadow-lg border border-purple-100 hover:scale-105 transition-transform duration-300">
              <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 font-semibold text-sm sm:text-base">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Trusted by Parents Across India 🇮🇳
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Real stories from parents who discovered their child's strengths
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-xl border border-purple-100 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-black text-lg shadow-lg">
                  {testimonial.avatar}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.location}</div>
                  <div className="text-xs text-purple-600 font-semibold">{testimonial.grade}</div>
                </div>
              </div>
              
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              
              <p className="text-gray-700 leading-relaxed text-sm">"{testimonial.text}"</p>
            </div>
          ))}
        </div>

        {/* Press Mentions */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 font-semibold mb-6 text-sm uppercase tracking-wide">As Featured In</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-40">
            <div className="font-black text-2xl text-gray-800">Times of India</div>
            <div className="font-black text-2xl text-gray-800">The Hindu</div>
            <div className="font-black text-2xl text-gray-800">Education Today</div>
            <div className="font-black text-2xl text-gray-800">India TV</div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// REGISTRATION FORM - 2 Fields Per Row, Responsive
// ══════════════════════════════════════════════════════════════════════════════

const RegistrationForm = ({ onSubmit }) => {
  const [form, setForm] = useState({ fullName: "", grade: "", mobile: "", email: "", whatsapp: false });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    const value = field === "whatsapp" ? e.target.checked : e.target.value;
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
    
    if (field === "mobile") {
      const ph = value.replace(/\D/g, "");
      if (!ph) {
        newErrors.mobile = "Mobile number is required";
      } else if (ph.length !== 10) {
        newErrors.mobile = "Enter valid 10-digit number";
      } else {
        delete newErrors.mobile;
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
    
    const ph = form.mobile.replace(/\D/g, "");
    if (!ph) {
      newErrors.mobile = "Mobile number is required";
    } else if (ph.length !== 10) {
      newErrors.mobile = "Enter valid 10-digit number";
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
      setTouched({ fullName: true, grade: true, mobile: true, email: true });
      return;
    }
    
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1800));
    setSubmitting(false);
    onSubmit(form);
  };

  const isFieldValid = (field) => touched[field] && !errors[field] && form[field];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
      <div className="bg-white rounded-3xl shadow-2xl border-2 border-purple-100 p-6 sm:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-2xl shadow-purple-500/50 mb-4">
            <Award size={40} className="text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">
            Quick Registration
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            4 simple fields • Takes 60 seconds ⚡
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Name + Grade */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student Name */}
            <div>
              <label className="flex items-center justify-between text-base font-bold text-gray-900 mb-3">
                <span>
                  Student's Name <span className="text-red-500">*</span>
                </span>
                {isFieldValid("fullName") && (
                  <span className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                    <CheckCircle size={16} />
                  </span>
                )}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500">
                  <User size={20} strokeWidth={2.5} />
                </div>
                <input
                  type="text"
                  placeholder="e.g., Aarav Sharma"
                  value={form.fullName}
                  onChange={handleChange("fullName")}
                  onBlur={handleBlur("fullName")}
                  className={`w-full pl-12 pr-4 py-3.5 text-base border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${
                    errors.fullName && touched.fullName
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                      : isFieldValid("fullName")
                      ? 'border-green-300 focus:border-green-500 focus:ring-green-100'
                      : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100'
                  }`}
                />
                {isFieldValid("fullName") && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <CheckCircle size={20} className="text-green-500" />
                  </div>
                )}
              </div>
              {errors.fullName && touched.fullName && (
                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm font-semibold">
                  <AlertCircle size={14} />
                  {errors.fullName}
                </div>
              )}
            </div>

            {/* Student Grade */}
            <div>
              <label className="flex items-center justify-between text-base font-bold text-gray-900 mb-3">
                <span>
                  Student's Grade <span className="text-red-500">*</span>
                </span>
                {isFieldValid("grade") && (
                  <span className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                    <CheckCircle size={16} />
                  </span>
                )}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500">
                  <GraduationCap size={20} strokeWidth={2.5} />
                </div>
                <select
                  value={form.grade}
                  onChange={handleChange("grade")}
                  onBlur={handleBlur("grade")}
                  className={`w-full pl-12 pr-10 py-3.5 text-base border-2 rounded-xl focus:outline-none focus:ring-4 transition-all appearance-none cursor-pointer ${
                    errors.grade && touched.grade
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                      : isFieldValid("grade")
                      ? 'border-green-300 focus:border-green-500 focus:ring-green-100'
                      : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100'
                  }`}
                >
                  <option value="">Select Grade</option>
                  {grades.map(g => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  {isFieldValid("grade") ? (
                    <CheckCircle size={20} className="text-green-500" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-400" />
                  )}
                </div>
              </div>
              {errors.grade && touched.grade && (
                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm font-semibold">
                  <AlertCircle size={14} />
                  {errors.grade}
                </div>
              )}
            </div>
          </div>

          {/* Row 2: Mobile + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Parent Mobile */}
            <div>
              <label className="flex items-center justify-between text-base font-bold text-gray-900 mb-3">
                <span>
                  Parent's Mobile <span className="text-red-500">*</span>
                </span>
                {isFieldValid("mobile") && (
                  <span className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                    <CheckCircle size={16} />
                  </span>
                )}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500">
                  <Phone size={20} strokeWidth={2.5} />
                </div>
                <input
                  type="tel"
                  placeholder="e.g., 98765 43210"
                  value={form.mobile}
                  onChange={handleChange("mobile")}
                  onBlur={handleBlur("mobile")}
                  maxLength={15}
                  className={`w-full pl-12 pr-4 py-3.5 text-base border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${
                    errors.mobile && touched.mobile
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                      : isFieldValid("mobile")
                      ? 'border-green-300 focus:border-green-500 focus:ring-green-100'
                      : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100'
                  }`}
                />
                {isFieldValid("mobile") && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <CheckCircle size={20} className="text-green-500" />
                  </div>
                )}
              </div>
              {errors.mobile && touched.mobile && (
                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm font-semibold">
                  <AlertCircle size={14} />
                  {errors.mobile}
                </div>
              )}
              
              {/* WhatsApp Checkbox */}
              <label className="flex items-center gap-3 mt-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={form.whatsapp}
                  onChange={handleChange("whatsapp")}
                  className="w-4 h-4 text-green-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-green-500 cursor-pointer"
                />
                <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900">
                  <MessageCircle size={14} className="inline mr-1 text-green-600" />
                  Send results on WhatsApp
                </span>
              </label>
            </div>

            {/* Parent Email */}
            <div>
              <label className="flex items-center justify-between text-base font-bold text-gray-900 mb-3">
                <span className="flex items-center gap-2">
                  Parent's Email
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Optional</span>
                </span>
                {isFieldValid("email") && (
                  <span className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                    <CheckCircle size={16} />
                  </span>
                )}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500">
                  <Mail size={20} strokeWidth={2.5} />
                </div>
                <input
                  type="email"
                  placeholder="e.g., parent@email.com"
                  value={form.email}
                  onChange={handleChange("email")}
                  onBlur={handleBlur("email")}
                  className={`w-full pl-12 pr-4 py-3.5 text-base border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${
                    errors.email && touched.email
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                      : isFieldValid("email")
                      ? 'border-green-300 focus:border-green-500 focus:ring-green-100'
                      : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100'
                  }`}
                />
                {isFieldValid("email") && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <CheckCircle size={20} className="text-green-500" />
                  </div>
                )}
              </div>
              {errors.email && touched.email && (
                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm font-semibold">
                  <AlertCircle size={14} />
                  {errors.email}
                </div>
              )}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-5">
            <div className="flex gap-4">
              <Sparkles size={24} className="text-blue-600 flex-shrink-0 mt-1" strokeWidth={2.5} />
              <div className="text-sm text-gray-800 leading-relaxed">
                <p className="font-black text-blue-900 mb-3">📋 What Happens Next:</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" strokeWidth={3} />
                    <span>Your child completes <strong>8-module assessment</strong> (10-15 mins)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" strokeWidth={3} />
                    <span><strong>Instant feedback</strong> after each module</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" strokeWidth={3} />
                    <span>Receive <strong>detailed PDF report</strong> with strengths & improvement areas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" strokeWidth={3} />
                    <span><strong>Competition Readiness Score</strong> + personalized tips</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-lg px-8 py-5 rounded-2xl shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {submitting ? (
              <>
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                <span>Reserving Your Spot...</span>
              </>
            ) : (
              <>
                <Trophy size={24} strokeWidth={2.5} />
                <span>Register & Start Free Assessment</span>
                <ArrowRight size={24} strokeWidth={2.5} />
              </>
            )}
          </button>

          {/* Security Notice */}
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-500 pt-2">
            <Lock size={14} className="text-green-600" />
            <span>256-bit encrypted • Your data is safe & never shared</span>
          </div>
        </form>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// SUCCESS SCREEN
// ══════════════════════════════════════════════════════════════════════════════

const SuccessScreen = ({ form }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
      <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-4 border-green-300 rounded-3xl p-8 sm:p-12 text-center shadow-2xl">
        <div className="relative inline-block mb-8">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-full w-28 h-28 flex items-center justify-center mx-auto shadow-2xl shadow-green-500/50 animate-bounce">
            <CheckCircle size={64} className="text-white" strokeWidth={3} />
          </div>
          <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full w-12 h-12 flex items-center justify-center shadow-lg animate-pulse">
            <Trophy size={24} className="text-yellow-800" strokeWidth={3} />
          </div>
        </div>
        
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
          Registration Successful! 🎉
        </h2>
        
        <p className="text-xl sm:text-2xl text-gray-800 mb-3">
          <strong className="text-green-700">{form.fullName}</strong> (Grade {form.grade}) is all set!
        </p>
        
        <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Your child will be assessed across <strong>all 8 English modules</strong>. 
          The results will reveal strengths and areas for improvement. Good luck! 💪✨
        </p>

        <div className="bg-white border-2 border-green-200 rounded-2xl p-6 mb-8 max-w-xl mx-auto">
          <p className="text-sm font-bold text-gray-700 mb-4 flex items-center justify-center gap-2">
            <MessageCircle size={20} className="text-green-600" />
            Assessment Link & Results Will Be Sent To:
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3 text-base font-bold text-gray-900 bg-green-50 rounded-xl p-3">
              <Phone size={20} className="text-green-600" />
              <span>{form.mobile}</span>
              {form.whatsapp && (
                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                  + WhatsApp
                </span>
              )}
            </div>
            {form.email && (
              <div className="flex items-center justify-center gap-3 text-base font-bold text-gray-900 bg-blue-50 rounded-xl p-3">
                <Mail size={20} className="text-blue-600" />
                <span className="truncate">{form.email}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-200 rounded-2xl p-6 mb-8">
          <p className="font-black text-purple-900 mb-3 text-lg">📱 Check Your Phone Now!</p>
          <p className="text-gray-700 text-sm leading-relaxed">
            We've sent the assessment link via SMS{form.whatsapp && " & WhatsApp"}. 
            Your child can start immediately or take it anytime within the next 24 hours.
          </p>
        </div>

        <button 
          onClick={() => window.location.href = '/assessment/start'}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-lg sm:text-xl px-10 py-5 rounded-2xl shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 mb-4"
        >
          <GraduationCap size={28} strokeWidth={2.5} />
          Start Assessment Now
          <ArrowRight size={28} strokeWidth={2.5} />
        </button>

        <p className="text-sm text-gray-500">
          ⏱️ Takes 10-15 minutes • Can pause and resume anytime
        </p>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// FAQ SECTION
// ══════════════════════════════════════════════════════════════════════════════

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about the assessment
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-100 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-white/50 transition-colors"
              >
                <span className="font-bold text-gray-900 text-base sm:text-lg pr-4">{faq.q}</span>
                <ChevronDown 
                  size={24} 
                  className={`flex-shrink-0 text-purple-600 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`}
                  strokeWidth={2.5}
                />
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-96' : 'max-h-0'}`}>
                <div className="px-6 pb-5 text-gray-700 leading-relaxed">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6">
          <p className="text-gray-800 font-semibold mb-3">
            Still have questions? We're here to help!
          </p>
          <p className="text-gray-600 text-sm">
            Email us at <a href="mailto:support@masterofalphabet.com" className="text-purple-600 font-bold hover:underline">support@masterofalphabet.com</a>
            {" "}or call <a href="tel:+918800123456" className="text-purple-600 font-bold hover:underline">+91 88001 23456</a>
          </p>
        </div>
      </div>
    </section>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ══════════════════════════════════════════════════════════════════════════════

export default function SkillAssessmentPage() {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [liveCount, setLiveCount] = useState(127);

  // Simulate live counter
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => prev + Math.floor(Math.random() * 3));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const scrollToForm = () => {
    setShowForm(true);
    setTimeout(() => {
      document.getElementById("registration-form")?.scrollIntoView({ 
        behavior: "smooth", 
        block: "start" 
      });
    }, 100);
  };

  const handleSubmit = (formData) => {
    setSubmittedData(formData);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submitted && submittedData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <SuccessScreen form={submittedData} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      {/* Hero Section */}
      <HeroSection onStartClick={scrollToForm} liveCount={liveCount} />

      {/* Social Proof */}
      <SocialProofSection />

      {/* Registration Form or CTA */}
      <section id="registration-form" className="scroll-mt-24 py-16">
        {!showForm ? (
          <div className="text-center px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Ready to Assess Your Child? 🎯
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join 15,000+ parents who discovered their child's English proficiency across all 8 modules!
            </p>
            <button
              onClick={scrollToForm}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-lg sm:text-xl px-12 py-5 rounded-2xl shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 active:scale-95 inline-flex items-center gap-3"
            >
              <Award size={28} strokeWidth={2.5} />
              Register & Start Assessment
              <ArrowRight size={28} strokeWidth={2.5} />
            </button>
          </div>
        ) : (
          <RegistrationForm onSubmit={handleSubmit} />
        )}
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-900 to-pink-900 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm opacity-90">
            © 2025 Master of Alphabet. All rights reserved. • Made with ❤️ for Indian Parents
          </p>
          <p className="text-xs opacity-75 mt-2">
            Privacy Policy • Terms of Service • Contact Us
          </p>
        </div>
      </footer>
    </div>
  );
}
