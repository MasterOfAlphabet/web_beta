import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  BarChart3,
  Users,
  FileText,
  TrendingUp,
  Target,
  Award,
  BookOpen,
  Mic,
  Headphones,
  PenTool,
  Eye,
  MessageSquare,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  Download,
  Shield,
  Zap,
  GraduationCap,
  Layers,
  GitBranch,
  Recycle,
  Puzzle,
  Compass,
  Mail,
  Phone,
  Star,
  Clock,
  ArrowDown
} from "lucide-react";

export default function SchoolsHomePage() {
  const navigate = useNavigate();

  // Data from your original
  const whatMakesUsDifferent = [
    { 
      icon: Layers, 
      title: "Developmental Weightage by Grade",
      desc: "Questions weighted by cognitive readiness, not just difficulty",
      color: "from-cyan-500 to-blue-500"
    },
    { 
      icon: GitBranch, 
      title: "Skill Cluster Mapping",
      desc: "Each module broken into underlying skill clusters",
      color: "from-orange-500 to-red-500"
    },
    { 
      icon: BarChart3, 
      title: "Developmental Building Block Analysis",
      desc: "See which foundational skills are strong or missing",
      color: "from-green-500 to-emerald-500"
    },
    { 
      icon: Recycle, 
      title: "Controlled Re-Diagnosis Cycle",
      desc: "Structured retesting after maturity period, not repeated testing",
      color: "from-purple-500 to-pink-500"
    },
    { 
      icon: Puzzle, 
      title: "Multi-Module English Skill Assessment",
      desc: "8 independent modules across all language skills",
      color: "from-yellow-500 to-orange-500"
    },
    { 
      icon: Compass, 
      title: "Independent Evaluation",
      desc: "Curriculum-agnostic - measures skill, not syllabus coverage",
      color: "from-indigo-500 to-purple-500"
    },
  ];

  const whySchools = [
    { icon: Target, title: "Identify Hidden Skill Gaps", desc: "Discover which students are struggling with foundational blocks despite good marks" },
    { icon: TrendingUp, title: "Monitor Progression at Grade Stage", desc: "Track cohort-level development across grades and identify focus areas" },
    { icon: Zap, title: "Provide Targeted, Skill-Based Intervention", desc: "Get actionable data on which micro-skills to target for maximum impact" },
    { icon: Award, title: "Offer Structured Recognition Events", desc: "Celebrate genuine skill mastery with optional competitions and milestones" },
  ];

  const implementation = [
    { icon: FileText, title: "Student Diagnostic", desc: "One-time assessment per grade stage. No ongoing testing burden." },
    { icon: BarChart3, title: "School Dashboard Access", desc: "Real-time access to aggregated data and grade-level trends." },
    { icon: TrendingUp, title: "Growth Tracking", desc: "Longitudinal data showing skill development over academic years." },
    { icon: Award, title: "Optional Skill Competitions", desc: "Structured recognition events celebrating skill mastery." },
  ];

  return (
    <div className="min-h-screen bg-white">
      

{/* ===== HERO SECTION - REFINED ===== */}
<section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
  {/* Abstract pattern overlay */}
  <div className="absolute inset-0 opacity-30">
    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl" />
    <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl" />
  </div>
  
  <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28">
    {/* Two column layout */}
    <div className="grid lg:grid-cols-2 gap-16 items-center">
      
      {/* LEFT COLUMN - Text */}
      <div>
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 text-sm font-semibold mb-6">
          <Building2 size={18} />
          <span>FOR SCHOOLS • CBSE • ICSE • STATE BOARDS • INTERNATIONAL</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
            WE DON'T REPLACE YOUR ENGLISH PROGRAM.
          </span>
          <br />
          <span className="text-white">
            WE MEASURE ITS IMPACT.
          </span>
        </h1>
        
        {/* STATS MOVED UP - before CTA */}
        <div className="flex gap-6 mb-8">
          {[
            { number: "8", label: "Skill Modules" },
            { number: "5", label: "Mastery Levels" },
            { number: "100%", label: "Independent" }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-black text-purple-400">{stat.number}</div>
              <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => navigate("/schools/register")}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-lg px-8 py-4 rounded-xl hover:scale-105 transition-transform duration-300 shadow-2xl inline-flex items-center gap-3"
          >
            <GraduationCap size={24} />
            Register Students
            <ArrowRight size={24} />
          </button>
          
          <button className="bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white font-black text-lg px-8 py-4 rounded-xl hover:bg-white/20 transition-all inline-flex items-center gap-3">
            <Download size={24} />
            Download Brochure
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN - Dashboard Mockup (unchanged) */}
      <div className="relative hidden lg:block">
        <div className="bg-white rounded-2xl shadow-2xl p-6 transform perspective-1000 rotateY-5 hover:rotateY-0 transition-transform duration-500">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-xl mb-4 font-mono text-sm">
            English Skill Overview - Grade IV
          </div>
          
          <div className="space-y-4">
            {[
              { label: "Reading Comprehension", percent: 85, color: "bg-green-500" },
              { label: "Spelling Architecture", percent: 60, color: "bg-orange-500" },
              { label: "Vocabulary Strength", percent: 78, color: "bg-blue-500" },
              { label: "Writing Development", percent: 72, color: "bg-purple-500" }
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span className="font-semibold">{item.label}</span>
                  <span className="font-bold">{item.percent}%</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust badge */}
        <div className="absolute -bottom-5 -left-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-sm text-white">
          ⚡ 500+ Schools Trust Us
        </div>
      </div>
    </div>
  </div>
</section>

{/* ===== FRAMEWORK STATEMENT - SEQUENTIAL FLOW ===== */}
<section className="py-20 px-4 bg-white">
  <div className="max-w-5xl mx-auto">
    
    {/* STEP 1: The Framework Title */}
    <div className="text-center mb-8">
      <div className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-6 py-2 text-sm font-bold text-purple-700 mb-6 shadow-sm">
        📊 THE FRAMEWORK
      </div>
      
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
        Independent English Skill Level<br />Evaluation Framework
      </h2>
    </div>

    {/* STEP 2: The Contrast (What others do vs What we do) */}
    <div className="relative max-w-3xl mx-auto mb-16">
      {/* "Most assessments" - faded */}
      <div className="text-center mb-2">
        <p className="text-xl text-gray-400 mb-1">
          Most assessments measure <span className="line-through decoration-2 decoration-red-300/50">syllabus coverage</span>.
        </p>
      </div>
      
      {/* "We measure" - bold & prominent with arrow pointing down */}
      <div className="text-center relative">
        <p className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
          We measure Skill Level Progression.
        </p>
        
        {/* Animated arrow pointing to pillars */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-purple-400 animate-bounce">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </div>
    </div>

    {/* STEP 3: The "How" - Three Pillars */}
    <div className="mt-24">
      {/* Section divider with label */}
      <div className="flex items-center justify-center gap-4 mb-12">
        <div className="w-12 h-px bg-gradient-to-r from-transparent to-purple-300"></div>
        <p className="text-sm uppercase tracking-[0.2em] font-semibold text-gray-400">
          THREE PILLARS OF OUR APPROACH
        </p>
        <div className="w-12 h-px bg-gradient-to-l from-transparent to-pink-300"></div>
      </div>
      
      {/* Three pillars grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { 
            icon: Layers, 
            title: "Grade-Based Weighted Evaluation",
            desc: "Questions weighted by cognitive readiness, not just difficulty",
            color: "from-purple-500 to-purple-600",
            lightColor: "bg-purple-50",
            borderColor: "border-purple-200"
          },
          { 
            icon: GitBranch, 
            title: "Developmental Building Block Analysis",
            desc: "Each skill broken into foundational micro-skills",
            color: "from-pink-500 to-pink-600",
            lightColor: "bg-pink-50",
            borderColor: "border-pink-200"
          },
          { 
            icon: Puzzle, 
            title: "Multi-Module English Skill Assessment",
            desc: "8 independent modules across all language skills",
            color: "from-orange-500 to-orange-600",
            lightColor: "bg-orange-50",
            borderColor: "border-orange-200"
          }
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div 
              key={i} 
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
            >
              {/* Number badge */}
              <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 text-white flex items-center justify-center font-black text-sm shadow-xl">
                {i + 1}
              </div>
              
              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                <Icon size={32} className="text-white" strokeWidth={1.5} />
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-black text-gray-900 mb-3">
                {item.title}
              </h3>
              
              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {item.desc}
              </p>
              
              {/* Decorative corner */}
              <div className={`absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl ${item.color} opacity-5 rounded-tl-3xl`}></div>
            </div>
          );
        })}
      </div>
      
      {/* Footer note */}
      <p className="text-center text-sm text-gray-400 mt-12 italic">
        — A curriculum-agnostic framework trusted by 500+ schools —
      </p>
    </div>
  </div>
</section>

      {/* ===== WHAT MAKES US DIFFERENT - YOUR ORIGINAL + CLAUDE'S COLORED BORDERS ===== */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-4">
              What Makes Us Different
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A curriculum-agnostic framework that measures actual skill development
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whatMakesUsDifferent.map((item, i) => {
              const Icon = item.icon;
              const borderColors = [
                'border-cyan-500',
                'border-orange-500',
                'border-green-500',
                'border-purple-500',
                'border-yellow-500',
                'border-indigo-500'
              ];
              
              return (
                <div 
                  key={i}
                  className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border-t-4 ${borderColors[i]}`}
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-5 shadow-lg`}>
                    <Icon size={32} className="text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== WHAT WE MEASURE - YOUR ORIGINAL ===== */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-4">
              What We Measure Independently
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              8 developmental modules, 24+ skill clusters
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Headphones, label: "Listening Maturity", color: "#3b82f6", bg: "#eff6ff" },
              { icon: Mic, label: "Pronunciation Stability", color: "#ec4899", bg: "#fdf2f8" },
              { icon: Eye, label: "Reading Comprehension Depth", color: "#f97316", bg: "#fff7ed" },
              { icon: Lightbulb, label: "Vocabulary Strength", color: "#f59e0b", bg: "#fffbeb" },
              { icon: PenTool, label: "Spelling Architecture", color: "#8b5cf6", bg: "#f3f0ff" },
              { icon: FileText, label: "Writing Development", color: "#ef4444", bg: "#fef2f2" },
              { icon: BookOpen, label: "Grammar Accuracy", color: "#10b981", bg: "#f0fdf4" },
              { icon: MessageSquare, label: "S.H.A.R.P Pattern Recognition", color: "#a855f7", bg: "#faf5ff" }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div 
                  key={i}
                  className="rounded-2xl p-6 transition-all duration-300 border-2 hover:scale-105 hover:shadow-xl"
                  style={{ backgroundColor: item.bg, borderColor: item.color }}
                >
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                    style={{ backgroundColor: item.color }}
                  >
                    <Icon size={28} className="text-white" strokeWidth={2} />
                  </div>
                  <h3 className="font-black text-lg mb-2" style={{ color: item.color }}>
                    {item.label}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== WHY SCHOOLS CHOOSE US + IMPLEMENTATION - MERGED WITH CLAUDE ===== */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Why Schools Choose Us */}
          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-8">
                Why Schools Choose Us
              </h2>
              
              <div className="space-y-6">
                {whySchools.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Icon size={24} className="text-white" strokeWidth={2} />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-gray-600">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Visual - from Claude */}
            <div className="bg-gradient-to-br from-cyan-100 to-blue-100 rounded-3xl p-12 flex items-center justify-center relative overflow-hidden h-96">
              <div className="text-9xl">📊</div>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 animate-pulse"></div>
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                <p className="text-sm font-bold text-gray-800">Grade-wise heatmap</p>
              </div>
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                <p className="text-sm font-bold text-gray-800">Cohort trends</p>
              </div>
            </div>
          </div>

          {/* Implementation - Claude's 2x2 grid */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-black text-center mb-4 text-cyan-300">
              Implementation
            </h2>
            <p className="text-center text-lg text-blue-200 mb-12 max-w-2xl mx-auto">
              Simple integration with your existing program
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              {implementation.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={i}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all hover:scale-105"
                  >
                    <div className="w-16 h-16 bg-cyan-400 rounded-2xl flex items-center justify-center mb-5 shadow-xl">
                      <Icon size={32} className="text-slate-900" strokeWidth={2} />
                    </div>
                    <h3 className="text-2xl font-black mb-3 text-cyan-300">{item.title}</h3>
                    <p className="text-blue-100 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FRAMEWORK STATEMENT - FROM PAMPHLET ===== */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-100 to-pink-100">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 italic">
            "An Independent English Skill Level & Personalized Improvement Framework"
          </h3>
          <p className="text-lg text-gray-700">
            Helping Schools Move from Syllabus Coverage to Skill Enhancement.
          </p>
        </div>
      </section>

      {/* ===== CTA SECTION - FROM CLAUDE ===== */}
      <section className="py-20 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
            Ready to Measure Your Program's Impact?
          </h2>
          <p className="text-xl text-cyan-100 mb-10 max-w-2xl mx-auto">
            Get your school dashboard access and start benchmarking today
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/schools/register")}
              className="bg-white text-cyan-600 font-black text-lg px-10 py-4 rounded-full hover:scale-105 transition-transform duration-300 shadow-2xl inline-flex items-center gap-3"
            >
              <GraduationCap size={24} />
              Schedule a Demo
              <ArrowRight size={24} />
            </button>
            
            <button className="bg-transparent border-2 border-white text-white font-black text-lg px-10 py-4 rounded-full hover:bg-white hover:text-cyan-600 transition-all inline-flex items-center gap-3">
              <Download size={24} />
              Download Brochure
            </button>
          </div>
        </div>
      </section>

      {/* ===== FOOTER TAGLINE - FROM CLAUDE ===== */}
      <section className="py-12 px-4 bg-slate-900 text-white text-center">
        <p className="text-xl md:text-2xl font-bold max-w-3xl mx-auto leading-relaxed">
          Most assessments measure <span className="text-cyan-400">syllabus coverage.</span>
          <br />
          We measure <span className="text-cyan-400">Skill Level Progression.</span>
        </p>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm opacity-90">
            © 2025 Master of Alphabet - School Solutions. All rights reserved.
          </p>
          <p className="text-xs opacity-75 mt-2">
            <a href="#" className="hover:underline">Privacy Policy</a> • <a href="#" className="hover:underline">Terms of Service</a> • <a href="mailto:schools@masterofalphabet.com" className="hover:underline">Contact Us</a>
          </p>
        </div>
      </footer>
    </div>
  );
}