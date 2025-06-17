import React, { useState } from "react";

// Mock user data for demonstration
const mockUser = {
  name: "Alex",
  subscriptionStatus: "trial", // "active", "trial", or null
  progress: {
    spelling: 85,
    grammar: 0,
    pronunciation: 0,
    listening: 60,
    reading: 0,
    writing: 0,
    vocabulary: 40,
    visuals: 0
  },
  achievements: ["first_assessment", "spelling_master"],
  streak: 5
};

// Simple SVG icon components
const PencilIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z"/>
  </svg>
);

const BookIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z"/>
  </svg>
);

const SpeakerIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0 11.249 11.249 0 010 15.788.75.75 0 11-1.06-1.06 9.749 9.749 0 000-13.668.75.75 0 010-1.06z"/>
    <path d="M15.932 7.757a.75.75 0 011.061 0 6.5 6.5 0 010 9.185.75.75 0 01-1.06-1.06 5 5 0 000-7.07.75.75 0 010-1.055z"/>
  </svg>
);

const MicrophoneIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8.25 4.5a3.75 3.75 0 117.5 0v4.5a3.75 3.75 0 11-7.5 0V4.5z"/>
    <path d="M6 10.5a.75.75 0 01.75.75 4.5 4.5 0 009 0 .75.75 0 011.5 0 6.001 6.001 0 01-5.25 5.945v2.555h2.25a.75.75 0 010 1.5H9.75a.75.75 0 010-1.5h2.25v-2.555A6.001 6.001 0 016.75 11.25.75.75 0 016 10.5z"/>
  </svg>
);

const LightBulbIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75 0 1.565.372 3.04 1.031 4.349.94 1.869 2.7 3.651 4.719 3.651h8c2.019 0 3.779-1.782 4.719-3.651A9.697 9.697 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75zM8.25 21.75A1.5 1.5 0 019.75 23.25h4.5a1.5 1.5 0 001.5-1.5v-.75h-7.5v.75z"/>
  </svg>
);

const MegaphoneIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M18.97 3.659a2.25 2.25 0 00-3.182.22l-1.94 1.939a.75.75 0 01-.439.269L8.5 6.5H3.75a.75.75 0 00-.75.75v9a.75.75 0 00.75.75H8.5l4.909.413a.75.75 0 00.439-.269l1.94-1.939a2.25 2.25 0 003.182.22 15.8 15.8 0 000-11.487zm-2.744 2.877a.75.75 0 00-1.06-1.06L12.44 8.2a.75.75 0 101.06 1.06l2.726-2.724z" clipRule="evenodd"/>
  </svg>
);

const RocketIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-4.131A15.838 15.838 0 016.382 15H2.25a.75.75 0 01-.75-.75 6.75 6.75 0 017.815-6.666zM15 6.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" clipRule="evenodd"/>
    <path d="M5.26 17.242a.75.75 0 10-.897-1.203 5.243 5.243 0 00-2.05 5.022.75.75 0 00.625.627 5.243 5.243 0 005.022-2.051.75.75 0 10-1.202-.897 3.744 3.744 0 01-3.008 1.51c0-1.23.592-2.323 1.51-3.008z"/>
  </svg>
);

const EyeDropperIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M16.098 2.598a3.75 3.75 0 113.184 6.302L6.75 21.75a1.5 1.5 0 01-2.122 0l-.5-.5a1.5 1.5 0 010-2.122L16.098 2.598zm3.184 4.302a2.25 2.25 0 00-3.184-3.184l-1.298 1.298a.75.75 0 101.06 1.06l1.298-1.298a.75.75 0 011.06 0 .75.75 0 010 1.06l-1.298 1.299a.75.75 0 101.06 1.06l1.298-1.298z" clipRule="evenodd"/>
  </svg>
);

const StarIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd"/>
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd"/>
  </svg>
);

const TrophyIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 1C8.268 1 6.85 2.418 6.85 4.15v.65H5.25A2.25 2.25 0 003 7.05v1.4C3 10.244 4.756 12 6.55 12h.65v2.35c0 1.732 1.418 3.15 3.15 3.15h.3c1.732 0 3.15-1.418 3.15-3.15V12h.65c1.794 0 3.25-1.756 3.25-3.55v-1.4A2.25 2.25 0 0015.45 4.8h-1.6v-.65C13.85 2.418 12.432 1 10.7 1h-.7z" clipRule="evenodd"/>
  </svg>
);

const UserGroupIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 18a9.953 9.953 0 01-5.385-1.572zM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16z"/>
  </svg>
);

const SparklesIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0V6H3a1 1 0 110-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 8.134a1 1 0 010 1.732L14.146 10.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 10.8 6.5 9.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd"/>
  </svg>
);

const PlayCircleIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm6.39-2.908a.75.75 0 01.766.027l3.5 2.25a.75.75 0 010 1.262l-3.5 2.25A.75.75 0 018 12.25v-4.5a.75.75 0 01.39-.658z" clipRule="evenodd"/>
  </svg>
);

const HeartIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
  </svg>
);

const AcademicCapIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"/>
  </svg>
);

const modules = [
  {
    key: "spelling",
    title: "Spelling Mastery",
    desc: "Perfect your spelling accuracy with adaptive challenges",
    detailedDesc: "Interactive spelling tests that adapt to your skill level, focusing on commonly misspelled words and personal weak spots.",
    color: "from-emerald-400 to-teal-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    borderColor: "border-emerald-200 dark:border-emerald-700",
    icon: PencilIcon,
    duration: "10-15 min",
    level: "All levels",
    popular: true,
    free: true
  },
  {
    key: "grammar",
    title: "Grammar Guardian",
    desc: "Master English grammar rules with practical exercises",
    detailedDesc: "Comprehensive grammar assessment covering tenses, sentence structure, and common grammatical errors.",
    color: "from-blue-400 to-indigo-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-700",
    icon: BookIcon,
    duration: "15-20 min",
    level: "Beginner to Advanced"
  },
  {
    key: "pronunciation",
    title: "Pronunciation Pro",
    desc: "Improve your spoken English with AI-powered feedback",
    detailedDesc: "Voice recognition technology analyzes your pronunciation and provides personalized feedback for improvement.",
    color: "from-pink-400 to-rose-500",
    bgColor: "bg-pink-50 dark:bg-pink-900/20",
    borderColor: "border-pink-200 dark:border-pink-700",
    icon: SpeakerIcon,
    duration: "12-18 min",
    level: "Intermediate+",
    featured: true
  },
  {
    key: "listening",
    title: "Listening Lab",
    desc: "Enhance comprehension with diverse audio challenges",
    detailedDesc: "Audio-based exercises featuring various accents, speeds, and contexts to improve your listening skills.",
    color: "from-amber-400 to-orange-500",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    borderColor: "border-amber-200 dark:border-amber-700",
    icon: MicrophoneIcon,
    duration: "20-25 min",
    level: "All levels"
  },
  {
    key: "reading",
    title: "Reading Rocket",
    desc: "Boost reading speed and comprehension",
    detailedDesc: "Timed reading exercises with comprehension questions to improve both speed and understanding.",
    color: "from-purple-400 to-violet-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-700",
    icon: LightBulbIcon,
    duration: "15-20 min",
    level: "All levels"
  },
  {
    key: "writing",
    title: "Writing Workshop",
    desc: "Craft compelling content with structured guidance",
    detailedDesc: "Writing prompts and exercises that help you develop clarity, style, and effective communication.",
    color: "from-red-400 to-pink-500",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-700",
    icon: MegaphoneIcon,
    duration: "25-30 min",
    level: "Intermediate+"
  },
  {
    key: "vocabulary",
    title: "Vocabulary Vault",
    desc: "Expand your word power with contextual learning",
    detailedDesc: "Learn new words through context, synonyms, and real-world usage examples tailored to your level.",
    color: "from-indigo-400 to-blue-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    borderColor: "border-indigo-200 dark:border-indigo-700",
    icon: RocketIcon,
    duration: "10-15 min",
    level: "All levels"
  },
  {
    key: "visuals",
    title: "Visual Vocabulary",
    desc: "Interpret images and enhance visual literacy",
    detailedDesc: "Describe images, understand visual context, and improve your ability to communicate about what you see.",
    color: "from-cyan-400 to-teal-500",
    bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
    borderColor: "border-cyan-200 dark:border-cyan-700",
    icon: EyeDropperIcon,
    duration: "12-18 min",
    level: "All levels",
    new: true
  }
];

const testimonials = [
  { name: "Sarah M.", text: "The pronunciation module helped me gain confidence in speaking!", rating: 5 },
  { name: "David L.", text: "Grammar exercises are practical and engaging. Highly recommend!", rating: 5 },
  { name: "Maria R.", text: "Love the personalized feedback. My spelling has improved dramatically.", rating: 5 }
];

export default function EnhancedSkillsHubPage() {
  const [user] = useState(mockUser); // In real app, this would come from useAuth()
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);

  const isModuleLocked = (key) => {
    if (key === "spelling") return false;
    if (!user) return true;
    return user.subscriptionStatus !== "active";
  };

  const getProgressPercentage = (key) => {
    return user?.progress?.[key] || 0;
  };

  const handleModuleClick = (mod) => {
    if (mod.key === "spelling" && !user) {
      setShowOverlay(true);
    } else if (!isModuleLocked(mod.key)) {
      // Navigate to skill assessment
      console.log(`Navigating to ${mod.key} assessment`);
    }
  };

  const handleQuickPreview = (mod, e) => {
    e.stopPropagation();
    setSelectedModule(mod);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 text-gray-800 dark:text-white">
      {/* Overlay for sign-in */}
      {showOverlay && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <SparklesIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Start Your Journey!</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Sign in to track your progress and unlock personalized feedback.
              </p>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                  Sign In
                </button>
                <button className="w-full border border-gray-300 dark:border-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                  Create Account
                </button>
              </div>
            </div>
            <button 
              onClick={() => setShowOverlay(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Module Preview Modal */}
      {selectedModule && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${selectedModule.color} flex items-center justify-center`}>
                <selectedModule.icon className="w-6 h-6 text-white" />
              </div>
              <button 
                onClick={() => setSelectedModule(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            <h3 className="text-xl font-bold mb-2">{selectedModule.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedModule.detailedDesc}</p>
            <div className="flex items-center gap-4 mb-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <ClockIcon className="w-4 h-4" />
                {selectedModule.duration}
              </div>
              <div className="flex items-center gap-1">
                <AcademicCapIcon className="w-4 h-4" />
                {selectedModule.level}
              </div>
            </div>
            <button 
              onClick={() => handleModuleClick(selectedModule)}
              className={`w-full py-3 rounded-xl font-semibold transition-all ${
                isModuleLocked(selectedModule.key)
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg'
              }`}
              disabled={isModuleLocked(selectedModule.key)}
            >
              {isModuleLocked(selectedModule.key) ? 'Upgrade to Access' : 'Start Assessment'}
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <SparklesIcon className="w-4 h-4" />
            Skills Assessment Platform
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
              Master Your English Skills
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            Personalized assessments that adapt to your level, track your progress, and help you achieve fluency faster.
          </p>
          
          {/* User Stats */}
          {user && (
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <TrophyIcon className="w-5 h-5 text-yellow-500" />
                <span>{user.achievements.length} Achievements</span>
              </div>
              <div className="flex items-center gap-2">
                <StarIcon className="w-5 h-5 text-orange-500" />
                <span>{user.streak} Day Streak</span>
              </div>
              <div className="flex items-center gap-2">
                <UserGroupIcon className="w-5 h-5 text-blue-500" />
                <span>12.5k+ Learners</span>
              </div>
            </div>
          )}
        </div>

        {/* Status Banner */}
        <div className="mb-8">
          {user ? (
            user.subscriptionStatus !== "active" && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <SparklesIcon className="w-6 h-6 text-amber-600" />
                  <span className="font-bold text-amber-800 dark:text-amber-200">Trial Mode Active</span>
                </div>
                <p className="text-amber-700 dark:text-amber-300 mb-4">
                  You're currently exploring our <strong>Spelling Module</strong>. Upgrade to unlock all 8 comprehensive skill assessments and personalized learning paths.
                </p>
                <button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all">
                  Upgrade Now - 50% Off
                </button>
              </div>
            )
          ) : (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700 rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <HeartIcon className="w-6 h-6 text-blue-600" />
                <span className="font-bold text-blue-800 dark:text-blue-200">Welcome to Skills Hub!</span>
              </div>
              <p className="text-blue-700 dark:text-blue-300 mb-4">
                Try our <strong>Spelling Assessment</strong> for free, then create an account to track progress and access personalized feedback.
              </p>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all">
                Get Started Free
              </button>
            </div>
          )}
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {modules.map((mod) => {
            const Icon = mod.icon;
            const locked = isModuleLocked(mod.key);
            const progress = getProgressPercentage(mod.key);

            return (
              <div
                key={mod.key}
                onClick={() => handleModuleClick(mod)}
                className={`group relative bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 transition-all duration-300 ${
                  locked 
                    ? "opacity-60 cursor-not-allowed border-gray-200 dark:border-gray-700" 
                    : `cursor-pointer hover:shadow-xl hover:-translate-y-1 ${mod.borderColor} hover:shadow-blue-100 dark:hover:shadow-blue-900/20`
                }`}
              >
                {/* Badges */}
                <div className="absolute top-3 right-3 flex flex-col gap-1">
                  {mod.free && (
                    <span className="text-xs bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200 px-2 py-1 rounded-full font-medium">
                      Free
                    </span>
                  )}
                  {mod.popular && (
                    <span className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-800 dark:text-orange-200 px-2 py-1 rounded-full font-medium">
                      Popular
                    </span>
                  )}
                  {mod.new && (
                    <span className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-800 dark:text-purple-200 px-2 py-1 rounded-full font-medium">
                      New
                    </span>
                  )}
                  {mod.featured && (
                    <span className="text-xs bg-gradient-to-r from-pink-500 to-rose-500 text-white px-2 py-1 rounded-full font-medium">
                      Featured
                    </span>
                  )}
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${mod.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {mod.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {mod.desc}
                </p>

                {/* Progress Bar */}
                {progress > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-500 dark:text-gray-400">Progress</span>
                      <span className="font-medium text-green-600 dark:text-green-400">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <ClockIcon className="w-3 h-3" />
                    {mod.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <AcademicCapIcon className="w-3 h-3" />
                    {mod.level}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button 
                    className={`flex-1 py-2 rounded-xl font-medium transition-all ${
                      locked
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-md'
                    }`}
                    disabled={locked}
                  >
                    {locked ? 'Upgrade' : progress > 0 ? 'Continue' : 'Start'}
                  </button>
                  <button 
                    onClick={(e) => handleQuickPreview(mod, e)}
                    className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                  >
                    <PlayCircleIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Lock Overlay */}
                {locked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-xl">🔒</span>
                      </div>
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Premium Feature</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Testimonials */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-center mb-8">What Our Learners Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-3 italic">"{testimonial.text}"</p>
                <p className="font-semibold">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Transform Your English Skills?</h2>
          <p className="mb-6 opacity-90">Join thousands of learners who've improved their English with our personalized assessments.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
              Start Free Assessment
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all">
              View All Features
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}