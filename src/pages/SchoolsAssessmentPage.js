import React, { useState } from "react";
import {
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
  Mail,
  Phone,
  Building2,
  GraduationCap,
  ArrowRight,
  Download,
  Shield,
} from "lucide-react";

// ══════════════════════════════════════════════════════════════════════════════
// DATA
// ══════════════════════════════════════════════════════════════════════════════

const modules = [
  { 
    id: 1, 
    label: "Spelling", 
    icon: PenTool, 
    iconColor: "#8b5cf6",
    bgColor: "#f3f0ff",
    borderColor: "#e9d5ff",
    description: "Age-appropriate word mastery" 
  },
  { 
    id: 2, 
    label: "Reading", 
    icon: Eye, 
    iconColor: "#f97316",
    bgColor: "#fff7ed",
    borderColor: "#fed7aa",
    description: "Comprehension & fluency" 
  },
  { 
    id: 3, 
    label: "Pronunciation", 
    icon: Mic, 
    iconColor: "#ec4899",
    bgColor: "#fdf2f8",
    borderColor: "#fbcfe8",
    description: "Clarity & articulation" 
  },
  { 
    id: 4, 
    label: "Grammar", 
    icon: BookOpen, 
    iconColor: "#10b981",
    bgColor: "#f0fdf4",
    borderColor: "#bbf7d0",
    description: "Structural accuracy" 
  },
  { 
    id: 5, 
    label: "Writing", 
    icon: FileText, 
    iconColor: "#ef4444",
    bgColor: "#fef2f2",
    borderColor: "#fecaca",
    description: "Composition & coherence" 
  },
  { 
    id: 6, 
    label: "Listening", 
    icon: Headphones, 
    iconColor: "#3b82f6",
    bgColor: "#eff6ff",
    borderColor: "#bfdbfe",
    description: "Auditory processing" 
  },
  { 
    id: 7, 
    label: "Vocabulary", 
    icon: Lightbulb, 
    iconColor: "#f59e0b",
    bgColor: "#fffbeb",
    borderColor: "#fde68a",
    description: "Lexical range & usage" 
  },
  { 
    id: 8, 
    label: "S.H.A.R.P", 
    icon: MessageSquare, 
    iconColor: "#a855f7",
    bgColor: "#faf5ff",
    borderColor: "#e9d5ff",
    description: "Pattern recognition" 
  },
];

const schoolBenefits = [
  { icon: BarChart3, title: "Grade-wise Heatmap", description: "Visual breakdown of competency levels across all grades" },
  { icon: FileText, title: "Module-wise Competency Report", description: "Detailed analytics for each of the 8 skill modules" },
  { icon: Users, title: "Parent Dashboard Access", description: "Secure portal for parents to track their child's progress" },
  { icon: TrendingUp, title: "Competition Benchmark Comparison", description: "Compare your students against national/global standards" },
  { icon: Target, title: "Curriculum Mapping", description: "Alignment with CBSE, ICSE, Cambridge frameworks" },
  { icon: Award, title: "Intervention Recommendations", description: "Data-driven suggestions for targeted skill improvement" },
];

// ══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════

export default function SchoolsAssessmentPage() {
  const [contactForm, setContactForm] = useState({
    schoolName: "",
    contactPerson: "",
    email: "",
    phone: "",
    studentCount: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle school contact form submission
    console.log("School inquiry:", contactForm);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20 px-4 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 text-sm font-semibold mb-6">
            <Building2 size={18} />
            <span>FOR EDUCATIONAL INSTITUTIONS</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight">
            English Skill Benchmarking Framework
            <br />
            <span className="text-purple-400">(Grades 1–10)</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Measure grade-level competency and identify skill gaps across all 8 modules using data-driven diagnostics.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#contact"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-lg px-10 py-4 rounded-xl hover:scale-105 transition-transform duration-300 shadow-xl inline-flex items-center justify-center gap-2"
            >
              <Mail size={24} />
              Request Demo
            </a>
            <a 
              href="#framework"
              className="bg-white text-gray-900 font-black text-lg px-10 py-4 rounded-xl hover:scale-105 transition-transform duration-300 shadow-xl inline-flex items-center justify-center gap-2"
            >
              <Download size={24} />
              Download Brochure
            </a>
          </div>
        </div>
      </section>

      {/* 8-Module Framework */}
      <section id="framework" className="py-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
              8-Module Diagnostic Framework
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive assessment across all critical English language skills
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((mod, i) => {
              const Icon = mod.icon;
              return (
                <div 
                  key={mod.id} 
                  className="group rounded-2xl p-6 transition-all duration-300 border-2 hover:scale-105 hover:shadow-2xl cursor-pointer"
                  style={{
                    backgroundColor: mod.bgColor,
                    borderColor: mod.borderColor,
                  }}
                >
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: mod.iconColor }}
                  >
                    <Icon size={32} className="text-white" strokeWidth={2.5} />
                  </div>
                  <h3 
                    className="font-black text-xl mb-2"
                    style={{ color: mod.iconColor }}
                  >
                    {mod.label}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {mod.description}
                  </p>
                  <div className="mt-3 text-xs font-semibold text-gray-500">
                    Module {i + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What Schools Receive */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
              What Schools Receive
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive analytics and reporting tools
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {schoolBenefits.map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <div key={i} className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100 rounded-2xl p-6 hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl w-14 h-14 flex items-center justify-center mb-4 shadow-lg">
                    <Icon size={28} className="text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="font-black text-xl text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-6">
                Data-Driven Decision Making
              </h2>
              <div className="space-y-4">
                {[
                  "Identify school-wide skill gaps instantly",
                  "Track grade-level progression year-over-year",
                  "Compare performance against national benchmarks",
                  "Generate intervention plans automatically",
                  "Export reports in multiple formats (PDF, Excel, CSV)",
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                      <CheckCircle size={16} className="text-white" strokeWidth={3} />
                    </div>
                    <p className="text-lg text-gray-700 leading-relaxed">{feature}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-2xl border-2 border-purple-100">
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 mb-6">
                <h3 className="text-white font-black text-2xl mb-2">Sample Report</h3>
                <p className="text-purple-100 text-sm">Grade 5 • Section A • 32 Students</p>
              </div>
              
              <div className="space-y-4">
                {modules.slice(0, 4).map((mod, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gray-900">{mod.label}</span>
                      <span className="font-black text-lg" style={{ color: mod.iconColor }}>
                        {75 + Math.floor(Math.random() * 20)}%
                      </span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          backgroundColor: mod.iconColor,
                          width: `${75 + Math.floor(Math.random() * 20)}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-20 px-4 bg-gradient-to-br from-purple-900 to-pink-900 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
              Partner With Us
            </h2>
            <p className="text-lg sm:text-xl text-purple-100">
              Request a demo and see how we can transform your English curriculum
            </p>
          </div>

          {submitted ? (
            <div className="bg-white text-gray-900 rounded-3xl p-10 text-center">
              <div className="bg-green-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={48} className="text-white" strokeWidth={3} />
              </div>
              <h3 className="text-3xl font-black mb-4">Thank You!</h3>
              <p className="text-lg text-gray-600">
                We've received your inquiry. Our team will contact you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white text-gray-900 rounded-3xl p-8 sm:p-10 shadow-2xl">
              <div className="grid sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    School Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500" />
                    <input
                      type="text"
                      required
                      value={contactForm.schoolName}
                      onChange={(e) => setContactForm({...contactForm, schoolName: e.target.value})}
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
                      placeholder="e.g., Delhi Public School"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Contact Person <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <GraduationCap size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500" />
                    <input
                      type="text"
                      required
                      value={contactForm.contactPerson}
                      onChange={(e) => setContactForm({...contactForm, contactPerson: e.target.value})}
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
                      placeholder="e.g., Principal / Coordinator Name"
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500" />
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
                      placeholder="school@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500" />
                    <input
                      type="tel"
                      required
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Approximate Student Count (Grades 1-10)
                </label>
                <div className="relative">
                  <Users size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500" />
                  <input
                    type="number"
                    value={contactForm.studentCount}
                    onChange={(e) => setContactForm({...contactForm, studentCount: e.target.value})}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
                    placeholder="e.g., 500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-lg px-8 py-5 rounded-2xl hover:scale-105 transition-transform duration-300 shadow-xl flex items-center justify-center gap-3"
              >
                <Mail size={24} strokeWidth={2.5} />
                Request Demo & Pricing
                <ArrowRight size={24} strokeWidth={2.5} />
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                <Shield size={14} className="text-green-600" />
                <span>Your information is confidential and secure</span>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm opacity-90">
            © 2025 Master of Alphabet - School Solutions. All rights reserved.
          </p>
          <p className="text-xs opacity-75 mt-2">
            Privacy Policy • Terms of Service • Contact Us
          </p>
        </div>
      </footer>
    </div>
  );
}
