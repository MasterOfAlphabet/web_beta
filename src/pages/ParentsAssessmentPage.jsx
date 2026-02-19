import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Shield,
  Lock,
  Users,
  BarChart3,
  TrendingUp,
  GraduationCap,
  Target,
  Check,
  ChevronDown,
  Star,
  ArrowRight,
  BookOpen,
  Mic,
  Headphones,
  PenTool,
  Eye,
  MessageSquare,
  FileText,
  Lightbulb,
  Sparkles,
  Clock,
  Download,
  Mail,
  Phone,
  Calendar,
  Award,
  Layers,
  GitBranch,
  Recycle,
  Zap,
  Trophy
} from "lucide-react";

export default function ParentsHomePage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [liveCount, setLiveCount] = useState(2847);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => prev + Math.floor(Math.random() * 3));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Modules data for the 8-module grid
  const modules = [
    { id: 1, label: "Spelling", icon: PenTool, color: "#8b5cf6", bg: "#f3f0ff", border: "#e9d5ff", example: "Can spell age-appropriate words?" },
    { id: 2, label: "Reading", icon: Eye, color: "#f97316", bg: "#fff7ed", border: "#fed7aa", example: "Comprehends grade-level texts?" },
    { id: 3, label: "Pronunciation", icon: Mic, color: "#ec4899", bg: "#fdf2f8", border: "#fbcfe8", example: "Speaks clearly & confidently?" },
    { id: 4, label: "Grammar", icon: BookOpen, color: "#10b981", bg: "#f0fdf4", border: "#bbf7d0", example: "Uses correct grammar structures?" },
    { id: 5, label: "Writing", icon: FileText, color: "#ef4444", bg: "#fef2f2", border: "#fecaca", example: "Writes coherent paragraphs?" },
    { id: 6, label: "Listening", icon: Headphones, color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe", example: "Follows oral instructions?" },
    { id: 7, label: "Vocabulary", icon: Lightbulb, color: "#f59e0b", bg: "#fffbeb", border: "#fde68a", example: "Uses diverse vocabulary?" },
    { id: 8, label: "S.H.A.R.P", icon: MessageSquare, color: "#a855f7", bg: "#faf5ff", border: "#e9d5ff", example: "Recognizes word patterns?" },
  ];

  return (
    <div className="min-h-screen bg-white">
      
      {/* ===== HERO SECTION - YOUR ORIGINAL + IMAGES ===== */}
     {/* ===== HERO SECTION - CLEAN & FOCUSED ===== */}
<section className="relative bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 text-white overflow-hidden">
  {/* Abstract background */}
  <div className="absolute inset-0 opacity-20">
    <div className="absolute top-20 left-10 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl" />
    <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl" />
  </div>

  <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-20">
    
    {/* TWO COLUMN LAYOUT */}
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      
      {/* LEFT COLUMN -精简文本 */}
      <div>
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 text-sm font-semibold mb-6">
          <Heart size={16} className="text-pink-300" />
          <span>FOR PARENTS • GRADE 1-10</span>
        </div>

        {/* Main headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight">
          <span className="text-white">
            IS YOUR CHILD'S ENGLISH SKILL LEVEL
          </span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
            TRULY GRADE-READY?
          </span>
        </h1>

        {/* Key differentiation */}
        <p className="text-xl text-purple-100 mb-8">
          School marks show performance. <span className="font-bold text-white">We show development.</span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={() => navigate("/register")}
            className="bg-gradient-to-r from-orange-500 to-pink-500 text-white font-black text-lg px-8 py-4 rounded-xl hover:scale-105 transition-transform duration-300 shadow-2xl inline-flex items-center gap-3"
          >
            <Heart size={24} />
            Start Free Health Check
            <ArrowRight size={24} />
          </button>
          
          <button className="bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white font-black text-lg px-8 py-4 rounded-xl hover:bg-white/20 transition-all inline-flex items-center gap-3">
            <Download size={24} />
            Parent Guide
          </button>
        </div>

        {/* Live counter - social proof only */}
        <div className="flex items-center gap-2 text-sm text-purple-200">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span><span className="font-black text-white">2,847+</span> families discovered their child's profile this month</span>
        </div>
      </div>

      {/* RIGHT COLUMN - Images (keep your existing image collage) */}
{/* RIGHT COLUMN - Images */}
<div className="relative hidden lg:block h-[500px]">
  
  {/* REAL PARENT BADGE - Add this exactly where you placed it */}
  <div className="absolute -bottom-3 -right-3 z-40 bg-yellow-400 text-purple-900 text-xs font-black px-3 py-1 rounded-full shadow-xl transform rotate-3">
    ⭐ REAL PARENT
  </div>

  {/* Your 3 images - unchanged */}
  <div className="absolute top-0 right-0 w-80 h-96 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/30 transform rotate-3 hover:rotate-0 transition-transform duration-500 z-20">
    <img 
      src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
      alt="Mother helping daughter study"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 to-transparent p-4 flex items-end">
      <div>
        <p className="text-white font-bold">Priya & Aanya</p>
        <p className="text-purple-200 text-xs">Mumbai</p>
      </div>
    </div>
  </div>

  {/* Rest of your images... */}
  <div className="absolute bottom-0 left-0 w-64 h-72 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/30 transform -rotate-6 hover:rotate-0 transition-transform duration-500 z-10">
    <img 
      src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
      alt="Child with certificate"
      className="w-full h-full object-cover"
    />
  </div>

  <div className="absolute top-20 left-10 w-48 h-48 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/30 transform -rotate-12 hover:rotate-0 transition-transform duration-500 z-30">
    <img 
      src="https://images.unsplash.com/photo-1472162072942-cd5147eb3902?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
      alt="Child reading"
      className="w-full h-full object-cover"
    />
  </div>
</div>
    </div>

    {/* Mobile images */}
    <div className="lg:hidden mt-10 grid grid-cols-2 gap-4">
      <img src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" className="rounded-xl" />
      <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" className="rounded-xl" />
    </div>
  </div>
</section>

{/* ===== THE 85% TRUTH - WITH ICONS & POLISH ===== */}
<section className="py-20 px-4 bg-white relative overflow-hidden">
  {/* Background decoration - subtle */}
  <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
  <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
  
  <div className="max-w-6xl mx-auto relative z-10">
    <div className="text-center mb-12">
      <div className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-6 py-2 text-sm font-bold text-purple-700 mb-6">
        🔍 THE REALITY CHECK
      </div>
      
      <p className="text-2xl md:text-3xl text-gray-700 mb-2">
        Your child may be scoring <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 text-4xl md:text-5xl">85%</span> or even <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 text-4xl md:text-5xl">90%.</span>
      </p>
      <p className="text-xl text-green-600 italic font-semibold mb-6">That's wonderful.</p>
      
      <div className="relative inline-block">
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 relative z-10 px-8 py-4">
          But does that score show:
        </h2>
        {/* Decorative underline */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
      </div>
    </div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
      {[
        { icon: Headphones, label: "Listening Maturity?", color: "#3b82f6", bg: "#eff6ff", light: "#dbeafe" },
        { icon: Lightbulb, label: "Vocabulary Depth?", color: "#f59e0b", bg: "#fffbeb", light: "#fef3c7" },
        { icon: PenTool, label: "Spelling Building Blocks?", color: "#8b5cf6", bg: "#f3f0ff", light: "#ede9fe" },
        { icon: Eye, label: "Reading Confidence?", color: "#f97316", bg: "#fff7ed", light: "#ffedd5" },
        { icon: FileText, label: "Writing Development?", color: "#ef4444", bg: "#fef2f2", light: "#fee2e2" },
        { icon: Mic, label: "Pronunciation Stability?", color: "#ec4899", bg: "#fdf2f8", light: "#fce7f3" }
      ].map((item, i) => {
        const Icon = item.icon;
        return (
          <div 
            key={i} 
            className="group flex items-center gap-4 p-5 rounded-2xl border-2 hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
            style={{ 
              backgroundColor: item.bg, 
              borderColor: item.color,
              boxShadow: `0 4px 14px 0 ${item.color}20`
            }}
          >
            {/* Glow effect on hover */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
              style={{ backgroundColor: item.color }}
            ></div>
            
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform relative z-10"
              style={{ backgroundColor: item.color }}
            >
              <Icon size={24} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-gray-800 text-base relative z-10">{item.label}</span>
            
            {/* Small decorative dot */}
            <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full opacity-50" style={{ backgroundColor: item.color }}></div>
          </div>
        );
      })}
    </div>
    
    {/* Subtle footnote */}
    <p className="text-center text-gray-400 text-sm mt-8 italic">
      These are the skills marks alone cannot measure
    </p>
  </div>
</section>

{/* ===== WHAT WE PROVIDE - 4 CARD GRID WITH POLISH ===== */}
<section className="py-20 px-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
  {/* Decorative elements */}
  <div className="absolute top-0 left-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
  <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
  
  <div className="max-w-6xl mx-auto relative z-10">
    <div className="text-center mb-12">
      <div className="inline-block bg-white/80 backdrop-blur-sm border border-purple-200 rounded-full px-6 py-2 text-sm font-bold text-purple-700 mb-4 shadow-sm">
        ✨ OUR PROMISE TO YOU
      </div>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
        What We Provide
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Independent evaluation beyond school marks
      </p>
    </div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { 
          icon: BarChart3, 
          title: "Independent Skill Mapping", 
          desc: "Unbiased evaluation of where your child truly stands",
          gradient: "from-purple-500 to-purple-600",
          light: "purple-50"
        },
        { 
          icon: Target, 
          title: "Personalised Direction", 
          desc: "Clear guidance on which skills need attention",
          gradient: "from-pink-500 to-pink-600",
          light: "pink-50"
        },
        { 
          icon: Layers, 
          title: "Clear Growth Areas", 
          desc: "Specific developmental blocks identified",
          gradient: "from-orange-500 to-orange-600",
          light: "orange-50"
        },
        { 
          icon: TrendingUp, 
          title: "Measurable Progress", 
          desc: "Track real skill development over time",
          gradient: "from-green-500 to-green-600",
          light: "green-50"
        }
      ].map((item, i) => {
        const Icon = item.icon;
        return (
          <div 
            key={i} 
            className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 relative overflow-hidden"
          >
            {/* Background accent on hover */}
            <div 
              className={`absolute inset-0 bg-${item.light} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            ></div>
            
            <div className={`relative z-10 w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
              <Icon size={32} className="text-white" strokeWidth={2} />
            </div>
            
            <h3 className="relative z-10 font-black text-xl text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 transition-all">
              {item.title}
            </h3>
            
            <p className="relative z-10 text-gray-600 leading-relaxed text-sm">
              {item.desc}
            </p>
            
            {/* Decorative corner accent */}
            <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 rounded-bl-full transition-opacity`}></div>
          </div>
        );
      })}
    </div>

    {/* Quote card with visual interest */}
    <div className="mt-16 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-pink-200 rounded-3xl blur-xl opacity-30"></div>
      <div className="relative bg-white/80 backdrop-blur-sm border border-purple-100 rounded-3xl p-8 text-center shadow-xl">
        <div className="text-6xl text-purple-300 absolute top-0 left-8 opacity-30">"</div>
        <p className="text-xl text-gray-700 italic max-w-3xl mx-auto relative z-10 font-medium">
          "We don't replace school learning. We help you understand how well it's working."
        </p>
        <div className="text-6xl text-pink-300 absolute bottom-0 right-8 opacity-30">"</div>
        
        {/* Decorative dots */}
        <div className="flex justify-center gap-2 mt-4">
          <div className="w-2 h-2 rounded-full bg-purple-400"></div>
          <div className="w-2 h-2 rounded-full bg-pink-400"></div>
          <div className="w-2 h-2 rounded-full bg-purple-400"></div>
        </div>
      </div>
    </div>
  </div>
</section>


      {/* ===== 8-MODULE GRID - YOUR ORIGINAL ===== */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="text-center mb-12">
  <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-black px-6 py-2 rounded-full mb-4 shadow-lg">
    🎯 COMPREHENSIVE
  </div>
  <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
    8-Module Diagnostic Framework
  </h2>
  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
    Every skill that matters, measured independently
  </p>
</div>
        <div className="max-w-7xl mx-auto">

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((mod, i) => {
              const Icon = mod.icon;
              return (
                <div 
                  key={mod.id} 
                  className="group relative rounded-2xl p-6 transition-all duration-300 border-2 hover:scale-105 hover:shadow-2xl cursor-pointer"
                  style={{
                    backgroundColor: mod.bg,
                    borderColor: mod.border,
                  }}
                >
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: mod.color }}
                  >
                    <Icon size={32} className="text-white" strokeWidth={2.5} />
                  </div>
                  <h3 
                    className="font-black text-xl mb-2"
                    style={{ color: mod.color }}
                  >
                    {mod.label}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {mod.example}
                  </p>
                  <div className="mt-3 text-xs font-semibold text-gray-500">
                    Module {i + 1}
                  </div>

                  {/* Hover tooltip */}
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
      </section>

      {/* ===== HOW IT WORKS - YOUR ORIGINAL ===== */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Structured growth. Not repeated testing.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-4 mb-8 relative">
            {[
              { step: "1", title: "Diagnose", desc: "15-minute skill health check" },
              { step: "2", title: "Receive", desc: "Detailed skill profile" },
              { step: "3", title: "Focus", desc: "Key improvement area" },
              { step: "4", title: "Practice & Track", desc: "Structured activities" },
              { step: "5", title: "Re-Diagnose", desc: "After maturity period" }
            ].map((item, i) => (
              <div key={i} className="text-center relative">
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-4 shadow-xl">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
                {i < 4 && (
                  <ArrowRight size={20} className="hidden md:block absolute text-purple-400 -right-2 top-8" />
                )}
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500 italic">
            *Maturity period: 8-12 weeks for skill consolidation before re-diagnosis
          </p>
        </div>
      </section>

      {/* ===== WHAT YOUR CHILD RECEIVES - YOUR ORIGINAL ===== */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
              What Your Child Receives
            </h2>
            <p className="text-lg text-gray-600">
              Complete skill transparency, not just a score
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: BarChart3, title: "Overall English Skill Level", desc: "Clear developmental stage (Rookie to Wizard)" },
              { icon: Target, title: "Personalised Focus Recommendation", desc: "One key area to work on first" },
              { icon: Layers, title: "Module-wise Breakdown", desc: "Performance across all 8 skill modules" },
              { icon: Clock, title: "Estimated Re-check Timeline", desc: "When to test again for best results" },
              { icon: GitBranch, title: "Building Block Analysis", desc: "Which foundational skills need attention" },
              { icon: Award, title: "Optional Skill Challenges", desc: "Recognition events for qualified students" }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-xl border-2 border-purple-100 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl w-14 h-14 flex items-center justify-center mb-4 shadow-lg">
                    <Icon size={28} className="text-white" strokeWidth={2} />
                  </div>
                  <h3 className="font-black text-xl text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== FRAMEWORK DIFFERENTIATORS - YOUR ORIGINAL ===== */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
              A Different Kind of Assessment
            </h2>
            <p className="text-lg text-gray-600">
              Built on developmental science, not just syllabus
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Layers,
                title: "Developmental Weightage by Grade",
                desc: "Questions match your child's cognitive stage, not just class level"
              },
              {
                icon: GitBranch,
                title: "Skill Cluster Mapping",
                desc: "Each module broken into underlying skills - see the building blocks"
              },
              {
                icon: Recycle,
                title: "Controlled Re-Diagnosis Cycle",
                desc: "Test again only after skills have time to mature (8-12 weeks)"
              }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-xl border-2 border-purple-100 text-center hover:shadow-2xl transition-shadow">
                  <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Icon size={36} className="text-white" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-black text-xl text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== SUBSCRIPTION OPTIONS - YOUR ORIGINAL (with cleaner cards) ===== */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-900 to-pink-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4">
              Subscription Options
            </h2>
            <p className="text-lg text-purple-200">
              Start with a free diagnostic, then choose your path
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                term: "1 MONTH",
                desc: "Short-Term Evaluation",
                price: "FREE",
                features: ["Complete skill profile", "One-time assessment", "Basic recommendations"],
                icon: "🔍"
              },
              {
                term: "3 MONTHS",
                desc: "Focused Improvement",
                price: "₹499",
                features: ["All 1-month features", "Progress tracking", "Practice activities", "Mid-term check-in"],
                icon: "🎯",
                popular: true
              },
              {
                term: "12 MONTHS",
                desc: "Full Growth Cycle",
                price: "₹1499",
                features: ["All 3-month features", "Two re-diagnoses", "Skill Milestone eligibility", "Recognition events"],
                icon: "🌟"
              }
            ].map((plan, i) => (
              <div 
                key={i} 
                className={`bg-white/10 backdrop-blur-md border-2 rounded-2xl p-6 hover:scale-105 transition-transform duration-300 ${
                  plan.popular ? 'border-yellow-400 ring-4 ring-yellow-400/20' : 'border-white/20'
                }`}
              >
                {plan.popular && (
                  <div className="bg-yellow-400 text-purple-900 text-xs font-black px-3 py-1 rounded-full inline-block mb-4">
                    MOST POPULAR
                  </div>
                )}
                <div className="text-4xl mb-2">{plan.icon}</div>
                <h3 className="text-2xl font-black mb-1">{plan.term}</h3>
                <p className="text-sm text-purple-200 mb-4">{plan.desc}</p>
                <p className="text-3xl font-black mb-6">{plan.price}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <Check size={16} className="text-green-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-xl font-black transition-colors ${
                  plan.popular 
                    ? 'bg-yellow-400 text-purple-900 hover:bg-yellow-300' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}>
                  Choose Plan
                </button>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-purple-300 mt-8">
            ✨ All annual subscribers eligible for optional Recognition Events
          </p>
        </div>
      </section>

      {/* ===== TESTIMONIALS - YOUR ORIGINAL ===== */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
              What Parents Discovered 🇮🇳
            </h2>
            <p className="text-lg text-gray-600">
              Real insights from families across India
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                location: "Mumbai, Maharashtra",
                grade: "Grade 7 Parent",
                text: "The health check revealed my daughter's vocabulary was excellent but pronunciation needed work. We focused on that area, and she improved 40% in 2 months!",
                avatar: "PS"
              },
              {
                name: "Rajesh Kumar",
                location: "Bangalore, Karnataka",
                grade: "Grade 4 Parent",
                text: "I thought my son was weak in English overall. The assessment showed he's actually strong in 6 modules—only grammar and writing need attention. Such clarity!",
                avatar: "RK"
              },
              {
                name: "Anita Desai",
                location: "Delhi NCR",
                grade: "Grade 9 Parent",
                text: "Before enrolling in expensive coaching, this free check helped us identify exactly what my daughter needs. Saved us months and money!",
                avatar: "AD"
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-xl border-2 border-purple-100 hover:shadow-2xl transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-black text-lg shadow-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.location}</div>
                    <div className="text-xs text-purple-600 font-semibold">{testimonial.grade}</div>
                  </div>
                </div>
                
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                
                <p className="text-gray-700 leading-relaxed text-sm">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION - YOUR ORIGINAL ===== */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                q: "Is this really free?",
                a: "Yes! The initial diagnostic health check is completely free. You get a complete skill profile with personalized recommendations at no cost."
              },
              {
                q: "How is this different from school exams?",
                a: "School exams measure syllabus coverage. We measure developmental skill levels - listening maturity, spelling architecture, vocabulary depth, etc."
              },
              {
                q: "What do we receive after the assessment?",
                a: "A detailed skill profile showing your child's level across all 8 modules, their strongest and weakest areas, and a personalized focus recommendation."
              },
              {
                q: "How long does it take?",
                a: "The complete diagnostic takes 10-15 minutes. Your child can take breaks and resume anytime within 24 hours."
              },
              {
                q: "When should we test again?",
                a: "We recommend a maturity period of 8-12 weeks before re-diagnosis to allow skills to consolidate."
              }
            ].map((faq, i) => (
              <div key={i} className="border-2 border-purple-100 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 hover:bg-purple-50 transition-colors"
                >
                  <span className="font-bold text-gray-900">{faq.q}</span>
                  <ChevronDown size={20} className={`text-purple-600 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-96' : 'max-h-0'}`}>
                  <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA - YOUR ORIGINAL ===== */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Discover Your Child's True Skill Level
          </h2>
          <p className="text-lg text-purple-100 mb-8">
            15-minute diagnostic • Free forever • No credit card required
          </p>
          
          <button
            onClick={() => navigate("/register")}
            className="bg-white text-purple-700 font-black text-lg px-12 py-5 rounded-xl hover:scale-105 transition-transform duration-300 shadow-2xl inline-flex items-center gap-3"
          >
            <Heart size={24} />
            Start Free Health Check
            <ArrowRight size={24} />
          </button>
        </div>
      </section>

      {/* ===== FOOTER - YOUR ORIGINAL ===== */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="text-xl font-black mb-2">Master of Alphabet</h4>
              <p className="text-gray-400 text-sm">
                Independent English Skill Level & Personalized Improvement Framework
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Helping children move from marks to meaningful skills.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 sm:justify-end">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-purple-400" />
                <span className="text-sm">support@masterofalphabet.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-purple-400" />
                <span className="text-sm">+91 88001 23456</span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
            © 2025 Master of Alphabet. Made with ❤️ for Indian Families
          </div>
        </div>
      </footer>
    </div>
  );
}