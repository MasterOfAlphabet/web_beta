import React, { useState, useEffect, useContext, } from "react";
import { AuthContext } from "../App";

// --- MOCK DATA ---

const user = {
  name: "Aanya Sharma",
  avatar: "",
  class: "IV",
  city: "Bangalore",
  state: "Karnataka",
};

const achievements = [
  { id: 1, title: "1st Place: Spelling Blitz", badge: "🥇", date: "2025-06-05" },
  { id: 2, title: "Grammar Guru Badge", badge: "📘", date: "2025-06-03" },
];

const gamifiedRewards = [
  { id: 1, title: "Daily Streak - 5 Days", emoji: "🔥" },
  { id: 2, title: "Word Wizard", emoji: "🪄" },
];

const dailyDose = [
  { id: 1, type: "Skill Spotlight", title: "Pronunciation", desc: "Improve your word clarity", icon: "🎯" },
  { id: 2, type: "Challenge", title: "Vocab Sprint", desc: "Complete today's new set", icon: "⚡" },
  { id: 3, type: "Word of the Day", title: "Quixotic", desc: "Meaning: exceedingly idealistic", icon: "💎" },
];

const skillsAssessment = [
  { name: "Spelling", value: 88, history: [70, 80, 85, 88], color: "from-purple-400 to-pink-400" },
  { name: "Reading", value: 82, history: [75, 78, 80, 82], color: "from-blue-400 to-cyan-400" },
  { name: "Pronunciation", value: 91, history: [80, 85, 90, 91], color: "from-green-400 to-emerald-400" },
  { name: "Grammar", value: 84, history: [70, 80, 82, 84], color: "from-yellow-400 to-orange-400" },
  { name: "Writing", value: 79, history: [60, 72, 75, 79], color: "from-red-400 to-pink-400" },
  { name: "Listening", value: 86, history: [73, 80, 84, 86], color: "from-indigo-400 to-purple-400" },
  { name: "Vocabulary", value: 90, history: [82, 87, 89, 90], color: "from-teal-400 to-cyan-400" },
  { name: "S.H.A.R.P", value: 76, history: [50, 60, 68, 76], color: "from-amber-400 to-yellow-400" },
  { name: "8-in-1", value: 83, history: [70, 74, 80, 83], color: "from-rose-400 to-pink-400" },
];

const progressSummary = [
  { type: "Learn", value: 88, history: [60, 75, 80, 88], icon: "📚", color: "from-blue-500 to-purple-600" },
  { type: "Practice", value: 92, history: [70, 80, 85, 92], icon: "🎯", color: "from-green-500 to-emerald-600" },
  { type: "Test", value: 85, history: [60, 70, 75, 85], icon: "📝", color: "from-orange-500 to-red-600" },
  { type: "Quiz", value: 85, history: [60, 70, 75, 85], icon: "📝", color: "from-orange-500 to-red-600" },
  { type: "Battles", value: 80, history: [40, 60, 70, 80], icon: "⚔️", color: "from-purple-500 to-pink-600" },
  { type: "Challenges", value: 90, history: [70, 75, 85, 90], icon: "🏆", color: "from-yellow-500 to-orange-600" },
  { type: "Competitions", value: 73, history: [40, 65, 70, 73], icon: "🎪", color: "from-indigo-500 to-blue-600" },
];

const suggestions = [
  { id: 1, text: "Practice your spelling skills", type: "Practice", priority: "high" },
  { id: 2, text: "Take today's Pronunciation Challenge", type: "Challenge", priority: "medium" },
  { id: 3, text: "Revise new vocabulary words", type: "Vocab", priority: "low" },
];

// --- ENHANCED COMPONENTS ---
function AnimatedCounter({ value, suffix = "%" }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (count < value) {
        setCount(prev => Math.min(prev + 2, value));
      }
    }, 30);
    return () => clearTimeout(timer);
  }, [count, value]);

  return <span>{count}{suffix}</span>;
}

function ProgressBar({ value, className = "" }) {
  return (
    <div className={`w-full h-2 bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <div 
        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transform transition-all duration-1000 ease-out"
        style={{ width: `${value}%`, transform: `translateX(-${100 - value}%)` }}
      />
    </div>
  );
}

function BoxTitle({ children, className = "" }) {
  return (
    <div className={`text-xl font-bold text-gray-800 mb-4 flex items-center gap-3 ${className}`}>
      {children}
    </div>
  );
}

function FloatingCard({ children, className = "", delay = 0 }) {
  return (
    <div 
      className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function AchievementSummary({ achievements, gamifiedRewards }) {
  const [showAll, setShowAll] = useState(false);
  
  return (
    <FloatingCard className="p-6 mb-6" delay={200}>
      <BoxTitle>
        <span className="text-2xl">🏆</span>
        <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
          Achievements & Rewards
        </span>
        <button
          onClick={() => setShowAll(s => !s)}
          className="ml-auto px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          {showAll ? "Hide" : "View All"}
        </button>
      </BoxTitle>
      
      <div className="flex flex-wrap gap-4">
        {[...achievements, ...gamifiedRewards].slice(0, showAll ? undefined : 3).map((a, idx) => (
          <div 
            key={a.id || a.title} 
            className="group flex items-center px-4 py-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-100 hover:from-blue-100 hover:to-indigo-200 border border-blue-200/50 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <span className="text-3xl mr-3 transform group-hover:scale-110 transition-transform duration-300">
              {a.badge || a.emoji}
            </span>
            <div className="flex flex-col">
              <span className="text-blue-900 font-bold">{a.title}</span>
              {a.date && <span className="text-xs text-blue-600 opacity-70">{a.date}</span>}
            </div>
          </div>
        ))}
      </div>
    </FloatingCard>
  );
}

function DailyDose({ dailyDose }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {dailyDose.map((item, idx) => (
        <FloatingCard 
          key={item.id} 
          className="p-6 bg-gradient-to-br from-white/90 to-blue-50/90 hover:from-white hover:to-blue-100/90 group cursor-pointer"
          delay={idx * 150}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl transform group-hover:scale-110 transition-transform duration-300">
              {item.icon}
            </span>
            <div className="font-semibold text-indigo-700 text-sm uppercase tracking-wide">
              {item.type}
            </div>
          </div>
          <div className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-800 transition-colors">
            {item.title}
          </div>
          <div className="text-sm text-gray-600 leading-relaxed">{item.desc}</div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button className="text-indigo-600 font-semibold text-sm hover:text-indigo-800 transition-colors">
              Start Now →
            </button>
          </div>
        </FloatingCard>
      ))}
    </div>
  );
}

function SkillsAssessment({ skillsAssessment }) {
  return (
    <FloatingCard className="p-6 mb-8" delay={300}>
      <BoxTitle>
        <span className="text-2xl">📊</span>
        <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Skills Assessment Status
        </span>
      </BoxTitle>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {skillsAssessment.map((skill, idx) => (
          <div 
            key={skill.name} 
            className="group flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${skill.color} flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
              <span className="text-white font-bold text-lg">
                <AnimatedCounter value={skill.value} />
              </span>
            </div>
            
            <span className="font-bold text-gray-800 text-center mb-2 group-hover:text-indigo-800 transition-colors">
              {skill.name}
            </span>
            
            <ProgressBar value={skill.value} className="mb-2" />
            
            <div className="flex gap-1">
              {skill.history.slice(-4).map((h, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    h >= 85 ? "bg-green-400 shadow-green-400/50" : 
                    h >= 75 ? "bg-yellow-400 shadow-yellow-400/50" : 
                    "bg-red-400 shadow-red-400/50"
                  } shadow-md`}
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </FloatingCard>
  );
}

function ProgressSummary({ progressSummary }) {
  return (
    <FloatingCard className="p-6 mb-8" delay={400}>
      <BoxTitle>
        <span className="text-2xl">📈</span>
        <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Progress Summary
        </span>
      </BoxTitle>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {progressSummary.map((prog, idx) => (
          <div 
            key={prog.type} 
            className="group p-5 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl transform group-hover:scale-110 transition-transform duration-300">
                {prog.icon}
              </span>
              <div className={`px-3 py-1 rounded-full text-white text-sm font-bold bg-gradient-to-r ${prog.color} shadow-lg`}>
                <AnimatedCounter value={prog.value} />
              </div>
            </div>
            
            <div className="font-bold text-gray-800 text-lg mb-2 group-hover:text-indigo-800 transition-colors">
              {prog.type}
            </div>
            
            <ProgressBar value={prog.value} className="mb-3" />
            
            <div className="flex justify-between items-center">
              <div className="flex gap-1">
                {prog.history.slice(-3).map((h, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      h >= 85 ? "bg-green-400" : h >= 75 ? "bg-yellow-400" : "bg-red-400"
                    } shadow-md`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 hover:text-indigo-600 cursor-pointer transition-colors">
                View Details
              </span>
            </div>
          </div>
        ))}
      </div>
    </FloatingCard>
  );
}

function Suggestions({ suggestions }) {
  return (
    <FloatingCard className="p-6 mb-8" delay={500}>
      <BoxTitle>
        <span className="text-2xl">🌱</span>
        <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Personalized Learning Journey
        </span>
      </BoxTitle>
      
      <div className="space-y-4">
        <div className="font-semibold text-gray-700 mb-4 text-lg">Suggestions For You</div>
        {suggestions.map((s, idx) => (
          <div 
            key={s.id} 
            className={`group flex items-center gap-4 p-4 rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer border-l-4 ${
              s.priority === 'high' ? 'bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 border-red-400' :
              s.priority === 'medium' ? 'bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100 border-yellow-400' :
              'bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-400'
            } shadow-lg hover:shadow-xl`}
            style={{ animationDelay: `${idx * 150}ms` }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl transform group-hover:scale-110 transition-transform duration-300">
                {s.type === "Practice" ? "📝" : s.type === "Challenge" ? "🏁" : "🧠"}
              </span>
              <span className="font-semibold text-gray-800 group-hover:text-indigo-800 transition-colors">
                {s.text}
              </span>
            </div>
            <div className="ml-auto">
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                s.priority === 'high' ? 'bg-red-100 text-red-800' :
                s.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {s.priority.toUpperCase()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </FloatingCard>
  );
}

// --- ENHANCED MAIN DASHBOARD ---
export default function DashboardPage() {

  const { loggedInUser } = useContext(AuthContext) || {};

  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4 md:p-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10">
        {/* Enhanced Profile Section */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Student Info Box */}
    <FloatingCard className="flex-1 p-6 ...">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full ...">
{loggedInUser?.avatar ? (
  <img src={loggedInUser.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
) : (
  // fallback, e.g. initials
  (loggedInUser?.name || "?").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
)}
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white shadow-md"></div>
        </div>
        <div className="flex flex-col gap-2 text-center md:text-left">
          <div className="text-3xl font-extrabold text-gray-900">
            {loggedInUser?.name || "Student"}
          </div>
          <div className="flex flex-wrap gap-4 text-lg mt-2">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-600">Class:</span>
              <span className="px-3 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold text-base">
                {loggedInUser?.class || "-"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-600">City:</span>
              <span className="px-3 py-0.5 rounded-full bg-green-100 text-green-700 font-extrabold text-base">
                {loggedInUser?.city || "-"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-600">State:</span>
              <span className="px-3 py-0.5 rounded-full bg-purple-100 text-purple-700 font-extrabold text-base">
                {loggedInUser?.state || "-"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </FloatingCard>
          
          {/* Achievements */}
          <div className="flex-1 min-w-[320px]">
            <AchievementSummary achievements={achievements} gamifiedRewards={gamifiedRewards} />
          </div>
        </div>

        {/* Daily Dose */}
        <DailyDose dailyDose={dailyDose} />
        
        {/* Skills Assessment */}
        <SkillsAssessment skillsAssessment={skillsAssessment} />
        
        {/* Progress Summary */}
        <ProgressSummary progressSummary={progressSummary} />
        
        {/* Suggestions */}
        <Suggestions suggestions={suggestions} />
      </div>
    </div>
  );
}