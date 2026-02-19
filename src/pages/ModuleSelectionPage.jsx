import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  PenTool,
  Eye,
  Mic,
  BookOpen,
  FileText,
  Headphones,
  Lightbulb,
  MessageSquare,
  Trophy,
  Star,
  Clock,
  Target,
  Sparkles,
  ArrowRight,
  Lock,
  CheckCircle,
  Zap,
  Crown,
  Award,
  TrendingUp,
  Compass,
  Flame,
  Rocket,
  Brain,
  Shield,
  Gem
} from "lucide-react";
import { updateModuleStarted } from "../services/assessmentService";

// ============================================================================
// MODULE CONFIGURATION - Enhanced with richer metadata
// ============================================================================
const MODULES = [
  {
    id: "spelling",
    name: "Spelling",
    icon: PenTool,
    enabled: true,
    route: "/assessment/spelling",
    description: "Master spelling patterns and word structure",
    longDescription: "Unlock the code of written language. From phonics foundations to advanced word construction.",
    questions: 30,
    timeRange: "60-90 min",
    color: "from-violet-600 to-fuchsia-600",
    bgLight: "bg-violet-50",
    borderLight: "border-violet-200",
    skills: ["Word Recognition", "Phoneme Awareness", "Pattern Mastery"],
    difficulty: "Foundational",
    iconBg: "bg-gradient-to-br from-violet-500 to-fuchsia-500",
    shadowColor: "shadow-violet-500/30"
  },
  {
    id: "reading",
    name: "Reading",
    icon: Eye,
    enabled: false,
    route: "/assessment/reading",
    description: "Comprehension and fluency mastery",
    longDescription: "Transform words into meaning. Develop speed, understanding, and critical analysis.",
    questions: 30,
    timeRange: "45-75 min",
    color: "from-blue-600 to-cyan-600",
    bgLight: "bg-blue-50",
    borderLight: "border-blue-200",
    skills: ["Comprehension", "Fluency", "Inference"],
    difficulty: "Intermediate",
    iconBg: "bg-gradient-to-br from-blue-500 to-cyan-500",
    shadowColor: "shadow-blue-500/30"
  },
  {
    id: "pronunciation",
    name: "Pronunciation",
    icon: Mic,
    enabled: false,
    route: "/assessment/pronunciation",
    description: "Perfect your spoken English clarity",
    longDescription: "Speak with confidence. Master sounds, stress patterns, and natural intonation.",
    questions: 25,
    timeRange: "30-60 min",
    color: "from-rose-600 to-orange-600",
    bgLight: "bg-rose-50",
    borderLight: "border-rose-200",
    skills: ["Phonetics", "Accent", "Clarity"],
    difficulty: "Intermediate",
    iconBg: "bg-gradient-to-br from-rose-500 to-orange-500",
    shadowColor: "shadow-rose-500/30"
  },
  {
    id: "grammar",
    name: "Grammar",
    icon: BookOpen,
    enabled: false,
    route: "/assessment/grammar",
    description: "Build strong grammatical foundations",
    longDescription: "The architecture of language. Understand how words work together to create meaning.",
    questions: 30,
    timeRange: "50-75 min",
    color: "from-emerald-600 to-teal-600",
    bgLight: "bg-emerald-50",
    borderLight: "border-emerald-200",
    skills: ["Syntax", "Tenses", "Agreement"],
    difficulty: "Foundational",
    iconBg: "bg-gradient-to-br from-emerald-500 to-teal-500",
    shadowColor: "shadow-emerald-500/30"
  },
  {
    id: "writing",
    name: "Writing",
    icon: FileText,
    enabled: false,
    route: "/assessment/writing",
    description: "Express ideas clearly and creatively",
    longDescription: "Find your voice. Learn to organize thoughts and communicate with impact.",
    questions: 20,
    timeRange: "60-90 min",
    color: "from-indigo-600 to-blue-600",
    bgLight: "bg-indigo-50",
    borderLight: "border-indigo-200",
    skills: ["Composition", "Style", "Structure"],
    difficulty: "Advanced",
    iconBg: "bg-gradient-to-br from-indigo-500 to-blue-500",
    shadowColor: "shadow-indigo-500/30"
  },
  {
    id: "listening",
    name: "Listening",
    icon: Headphones,
    enabled: false,
    route: "/assessment/listening",
    description: "Understand spoken English with confidence",
    longDescription: "Train your ear. Catch nuances, follow conversations, and comprehend naturally.",
    questions: 25,
    timeRange: "40-60 min",
    color: "from-amber-600 to-orange-600",
    bgLight: "bg-amber-50",
    borderLight: "border-amber-200",
    skills: ["Comprehension", "Focus", "Retention"],
    difficulty: "Foundational",
    iconBg: "bg-gradient-to-br from-amber-500 to-orange-500",
    shadowColor: "shadow-amber-500/30"
  },
  {
    id: "vocabulary",
    name: "Vocabulary",
    icon: Lightbulb,
    enabled: false,
    route: "/assessment/vocabulary",
    description: "Expand your word power and usage",
    longDescription: "Build your lexicon. Learn words, their nuances, and how to use them precisely.",
    questions: 30,
    timeRange: "45-70 min",
    color: "from-fuchsia-600 to-purple-600",
    bgLight: "bg-fuchsia-50",
    borderLight: "border-fuchsia-200",
    skills: ["Word Meanings", "Context", "Synonyms"],
    difficulty: "Intermediate",
    iconBg: "bg-gradient-to-br from-fuchsia-500 to-purple-500",
    shadowColor: "shadow-fuchsia-500/30"
  },
  {
    id: "sharp",
    name: "S.H.A.R.P",
    icon: MessageSquare,
    enabled: false,
    route: "/assessment/sharp",
    description: "Holistic language proficiency check",
    longDescription: "The complete picture. Assess how all language skills work together in harmony.",
    questions: 35,
    timeRange: "60-90 min",
    color: "from-cyan-600 to-blue-700",
    bgLight: "bg-cyan-50",
    borderLight: "border-cyan-200",
    skills: ["Speaking", "Hearing", "Analysis", "Reading", "Presentation"],
    difficulty: "Advanced",
    iconBg: "bg-gradient-to-br from-cyan-500 to-blue-600",
    shadowColor: "shadow-cyan-500/30"
  }
];

const FULL_DIAGNOSTIC = {
  id: "full-diagnostic",
  name: "Complete Language Profile",
  icon: Brain,
  enabled: false,
  route: "/assessment/full-diagnostic",
  description: "A comprehensive 360° evaluation of your English proficiency",
  longDescription: "Not just a test—a complete map of your language abilities. Across all 8 modules, we analyze your strengths, uncover hidden gaps, and chart your path to mastery.",
  questions: 220,
  timeRange: "3-4 hours",
  color: "from-amber-500 to-orange-600",
  bgLight: "bg-amber-50",
  borderLight: "border-amber-200",
  features: [
    "Personalized skill profile",
    "Cross-module analysis",
    "Learning path recommendation",
    "Benchmark against grade level",
    "Comprehensive PDF report"
  ],
  iconBg: "bg-gradient-to-br from-amber-500 to-orange-600",
  shadowColor: "shadow-amber-500/30",
  special: true
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function ModuleSelectionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const studentData = location.state?.studentData || 
    JSON.parse(localStorage.getItem("studentInfo") || "{}");
  const userType = location.state?.userType;
  
  const [selectedModule, setSelectedModule] = useState(null);
  const [hoveredModule, setHoveredModule] = useState(null);
  const [hoveredDisabled, setHoveredDisabled] = useState(null); // NEW: For disabled module tooltips
  const [saving, setSaving] = useState(false);

  const handleModuleClick = async (module) => {
    if (!module.enabled) return; // Disabled modules don't trigger navigation
    if (saving) return;
    
    setSelectedModule(module.id);
    setSaving(true);
    
    try {
      if (studentData.assessmentId) {
        // await updateModuleStarted(studentData.assessmentId, module.name);
      }
      
      navigate(module.route, {
        state: {
          studentData,
          userType,
          module: module.name
        }
      });
    } catch (error) {
      console.error('Error:', error);
      navigate(module.route, {
        state: {
          studentData,
          userType,
          module: module.name
        }
      });
    } finally {
      setSaving(false);
    }
  };

  const studentName = studentData.fullName || "Explorer";
  const grade = studentData.grade || "---";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-rose-50">
      
      {/* ===== DECORATIVE BACKGROUND ELEMENTS ===== */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-2000" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-4000" />
      </div>

      {/* ===== HEADER with Glassmorphism ===== */}
      <header className="relative backdrop-blur-md bg-white/70 border-b border-white/20 shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo with 3D effect */}
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-2.5 shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Trophy size={28} className="text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">
                  Master of Alphabet
                </h1>
                <p className="text-sm text-gray-600">Skill Assessment Platform</p>
              </div>
            </div>
            
            {/* Student Info with Neubrutalism accent */}
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="font-black text-gray-900">{studentName}</p>
                <p className="text-sm text-gray-600">Grade {grade}</p>
              </div>
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-70" />
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-black text-xl border-2 border-white">
                  {studentName.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 z-10">
        
        {/* ===== HERO SECTION ===== */}
        <div className="text-center mb-16">
          {/* 3D Floating Icon */}
          <div className="relative inline-block mb-8 group">
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity animate-pulse" />
            <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-5 shadow-2xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
              <Compass size={64} className="text-white" strokeWidth={1.5} />
            </div>
          </div>

          {/* Rewritten Headline */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">
              Chart Your Course
            </span>
            <br />
            <span className="text-gray-900">to English Mastery</span>
          </h2>
          
          <p className="text-xl sm:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Every journey begins with a single step. Choose your starting point, 
            and let's discover the unique landscape of your language skills.
          </p>

          {/* Personalized Touch */}
          <div className="mt-6 inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-full px-6 py-3 shadow-lg">
            <Sparkles size={20} className="text-purple-600" />
            <p className="text-gray-800">
              <span className="font-black text-purple-700">{studentName}</span>, you're 
              <span className="font-bold text-gray-900"> {8 - MODULES.filter(m => m.enabled).length} modules away</span> from complete mastery
            </p>
          </div>
        </div>

        {/* ===== MODULE GRID ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-20">
          {MODULES.map((module) => {
            const Icon = module.icon;
            const isHovered = hoveredModule === module.id;
            const isSelected = selectedModule === module.id && saving;
            
            return (
              <div
                key={module.id}
                className="relative group perspective-1000"
                onMouseEnter={() => {
                  setHoveredModule(module.id);
                  if (!module.enabled) {
                    setHoveredDisabled(module); // NEW: Show tooltip for disabled
                  }
                }}
                onMouseLeave={() => {
                  setHoveredModule(null);
                  setHoveredDisabled(null); // NEW: Hide tooltip
                }}
              >
                {/* 3D Card Container - REMOVED disabled attribute, now all cards are clickable/hoverable */}
                <button
                  onClick={() => handleModuleClick(module)}
                  className={`
                    relative w-full text-left transform-gpu transition-all duration-500
                    hover:scale-105 hover:-translate-y-2 cursor-pointer
                    ${isSelected ? 'scale-95 opacity-50' : ''}
                    preserve-3d
                  `}
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: isHovered && module.enabled ? 'rotateX(2deg) rotateY(-2deg)' : 'rotateX(0) rotateY(0)'
                  }}
                >
                  {/* Background Shadow - 3D effect */}
                  <div className={`
                    absolute inset-0 rounded-2xl transition-all duration-500
                    ${module.enabled ? module.shadowColor : 'shadow-gray-300/30'}
                    shadow-2xl blur-sm
                  `} />

                  {/* Main Card */}
                  <div className={`
                    relative rounded-2xl border-2 transition-all duration-500 overflow-hidden
                    ${module.enabled 
                      ? 'bg-white hover:border-transparent' 
                      : 'bg-gray-50 border-gray-200 hover:border-purple-200 hover:bg-white' // CHANGED: Better hover for disabled
                    }
                  `}>
                    {/* Gradient Overlay on Hover */}
                    {module.enabled && (
                      <div className={`
                        absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 
                        group-hover:opacity-5 transition-opacity duration-500
                      `} />
                    )}

                    {/* Card Content - CHANGED: Removed opacity reduction for disabled */}
                    <div className="relative p-6">
                      {/* Status Badge - CHANGED: Coming Soon badge is more visible */}
                      <div className="absolute top-4 right-4">
                        {module.enabled ? (
                          <div className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
                            <CheckCircle size={14} />
                            <span>Ready</span>
                          </div>
                        ) : (
                          <div className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm animate-pulse">
                            <Sparkles size={14} />
                            <span>Coming Soon</span>
                          </div>
                        )}
                      </div>

                      {/* Icon with 3D effect */}
                      <div className="relative mb-6">
                        <div className={`
                          absolute -inset-2 rounded-xl blur-lg opacity-50
                          ${module.enabled ? module.shadowColor : ''}
                        `} />
                        <div className={`
                          relative w-16 h-16 rounded-xl flex items-center justify-center
                          ${module.enabled ? module.iconBg : 'bg-gradient-to-br from-gray-400 to-gray-500'}
                          shadow-xl transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300
                        `}>
                          <Icon size={32} className="text-white" strokeWidth={2} />
                        </div>
                      </div>

                      {/* Module Name */}
                      <h3 className={`text-xl font-black mb-2 ${module.enabled ? 'text-gray-900' : 'text-gray-700'}`}>
                        {module.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm mb-4 leading-relaxed text-gray-600">
                        {module.description}
                      </p>

                      {/* Metadata Grid */}
                      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Target size={14} className="text-gray-500" />
                          <span>{module.questions} questions</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Clock size={14} className="text-gray-500" />
                          <span>{module.timeRange}</span>
                        </div>
                      </div>

                      {/* Difficulty Badge - Only for enabled */}
                      {module.enabled && (
                        <div className="mt-4 flex items-center gap-2">
                          <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div className={`h-full bg-gradient-to-r ${module.color}`} style={{
                              width: module.difficulty === 'Foundational' ? '33%' : 
                                     module.difficulty === 'Intermediate' ? '66%' : '100%'
                            }} />
                          </div>
                          <span className="text-xs font-bold text-gray-600">{module.difficulty}</span>
                        </div>
                      )}
                    </div>

                    {/* Hover Overlay with Skills - Only for enabled modules */}
                    {module.enabled && isHovered && !isSelected && (
                      <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-200 shadow-2xl transition-all duration-300">
                        <p className="text-xs font-black text-purple-600 mb-3 uppercase tracking-wider">
                          What You'll Discover:
                        </p>
                        <ul className="space-y-2 mb-4">
                          {module.skills.map((skill, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-gray-800">
                              <Gem size={14} className="text-purple-500 flex-shrink-0" />
                              <span className="font-medium">{skill}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="absolute bottom-4 right-4 flex items-center gap-2 text-purple-600 font-black">
                          <span>Begin Journey</span>
                          <ArrowRight size={18} />
                        </div>
                      </div>
                    )}

                    {/* Loading State */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-white/90 rounded-2xl flex items-center justify-center">
                        <div className="text-center">
                          <div className="relative w-12 h-12 mx-auto mb-2">
                            <div className="absolute inset-0 border-4 border-purple-200 rounded-full" />
                            <div className="absolute inset-0 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
                          </div>
                          <p className="text-sm font-black text-purple-600">Preparing...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </button>

                {/* ===== NEW: Hover Tooltip for Disabled Modules ===== */}
                {!module.enabled && hoveredDisabled?.id === module.id && (
                  <div 
                    className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 w-80"
                    style={{ pointerEvents: 'none' }}
                  >
                    {/* Main card - matching your diagnostic style */}
                    <div className="bg-white rounded-xl shadow-2xl border-2 border-purple-200 overflow-hidden">
                      
                      {/* Header with gradient - like your diagnostic */}
                      <div className={`bg-gradient-to-r ${module.color} px-4 py-2`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon size={16} className="text-white" />
                            <span className="font-bold text-white text-sm">{module.name}</span>
                          </div>
                          <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-xs font-bold backdrop-blur-sm">
                            Coming Soon
                          </span>
                        </div>
                      </div>

                      {/* Content - matching your diagnostic layout */}
                      <div className="p-4">
                        {/* Description - like your "Not just a test..." */}
                        <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                          {module.longDescription}
                        </p>

                        {/* Features in two columns - like your bullet points */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3">
                          {module.skills.slice(0, 4).map((skill, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                              <div className="w-1 h-1 bg-purple-400 rounded-full" />
                              <span className="text-xs text-gray-700">{skill}</span>
                            </div>
                          ))}
                        </div>

                        {/* Stats row - like your "220 questions · 3-4 hours" */}
                        <div className="flex items-center justify-between text-xs border-t border-gray-100 pt-2">
                          <span className="font-medium text-gray-900">{module.questions} questions</span>
                          <span className="text-gray-500">·</span>
                          <span className="font-medium text-gray-900">{module.timeRange}</span>
                        </div>
                      </div>
                    </div>

                    {/* Arrow pointing to card */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-white border-r-2 border-b-2 border-purple-200"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ===== COMPLETE LANGUAGE PROFILE SECTION ===== */}
        <div className="relative max-w-5xl mx-auto">
          {/* Background Decoration */}
          <div className="absolute -inset-4 bg-gradient-to-r from-amber-200 to-orange-200 rounded-3xl blur-2xl opacity-30" />
          
          <button
            onClick={() => handleModuleClick(FULL_DIAGNOSTIC)}
            disabled={!FULL_DIAGNOSTIC.enabled || saving}
            className={`
              relative w-full group text-left overflow-hidden
              ${FULL_DIAGNOSTIC.enabled 
                ? 'cursor-pointer' 
                : 'cursor-not-allowed opacity-60'
              }
            `}
          >
            {/* Main Card with 3D effect */}
            <div className={`
              relative rounded-3xl border-4 transition-all duration-500
              ${FULL_DIAGNOSTIC.enabled
                ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-2'
                : 'bg-gray-100 border-gray-300'
              }
            `}>
              {/* Decorative Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-400 rounded-full blur-3xl" />
              </div>

              <div className="relative p-8 md:p-10">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  
                  {/* 3D Icon */}
                  <div className="relative flex-shrink-0">
                    <div className="absolute -inset-3 bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />
                    <div className={`
                      relative w-28 h-28 rounded-2xl flex items-center justify-center
                      ${FULL_DIAGNOSTIC.iconBg}
                      shadow-2xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300
                    `}>
                      <Brain size={56} className="text-white" strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-center md:text-left">
                    {/* Title with enhanced styling */}
                    <div className="flex items-center gap-3 mb-3 justify-center md:justify-start">
                      <h3 className={`text-3xl md:text-4xl font-black ${FULL_DIAGNOSTIC.enabled ? 'text-gray-900' : 'text-gray-500'}`}>
                        {FULL_DIAGNOSTIC.name}
                      </h3>
                      {!FULL_DIAGNOSTIC.enabled && (
                        <div className="bg-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                          <Lock size={16} />
                          <span>Coming Soon</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Enhanced Description */}
                    <p className={`text-lg mb-6 leading-relaxed max-w-2xl ${FULL_DIAGNOSTIC.enabled ? 'text-gray-700' : 'text-gray-400'}`}>
                      {FULL_DIAGNOSTIC.longDescription}
                    </p>

                    {/* Feature Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {FULL_DIAGNOSTIC.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-amber-400 rounded-full" />
                          <span className={`text-sm ${FULL_DIAGNOSTIC.enabled ? 'text-gray-700' : 'text-gray-400'}`}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Stats Row */}
                    <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                      <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2">
                        <Target size={18} className="text-amber-600" />
                        <span className="font-bold text-gray-900">{FULL_DIAGNOSTIC.questions} questions</span>
                      </div>
                      <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2">
                        <Clock size={18} className="text-amber-600" />
                        <span className="font-bold text-gray-900">{FULL_DIAGNOSTIC.timeRange}</span>
                      </div>
                      <div className="flex items-center gap-3 bg-gradient-to-r from-amber-400 to-orange-400 rounded-xl px-4 py-2 text-white">
                        <Rocket size={18} />
                        <span className="font-bold">8 modules · Complete picture</span>
                      </div>
                    </div>
                  </div>

                  {/* Arrow with animation */}
                  {FULL_DIAGNOSTIC.enabled && (
                    <div className="flex-shrink-0 hidden lg:block">
                      <div className="bg-white rounded-full p-4 shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                        <ArrowRight size={40} className="text-amber-600" strokeWidth={2.5} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* ===== PROGRESS INDICATOR ===== */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-2xl px-8 py-4 shadow-xl">
            <div className="flex items-center gap-2">
              <Flame size={24} className="text-purple-600" />
              <span className="text-gray-800">
                <span className="font-black text-purple-700">{MODULES.filter(m => m.enabled).length}</span> of 
                <span className="font-black text-gray-900"> 8</span> modules available
              </span>
            </div>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                style={{ width: `${(MODULES.filter(m => m.enabled).length / 8) * 100}%` }}
              />
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}