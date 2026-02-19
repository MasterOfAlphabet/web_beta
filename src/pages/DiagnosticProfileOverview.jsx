import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Trophy,
  Award,
  Target,
  TrendingUp,
  Clock,
  Star,
  Zap,
  ArrowRight,
  CheckCircle,
  Lock,
  ChevronRight,
  Sparkles,
  Brain,
  Activity
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';
import { motion } from 'framer-motion';

// ============================================================================
// MOCK DATA - Replace with Firebase fetch
// ============================================================================
const MOCK_DIAGNOSTIC_DATA = {
  studentData: {
    fullName: "Ananya Sharma",
    grade: "5",
    assessmentId: "AS-5-43210XK",
    avatar: "AS"
  },
  
  overallScore: 82, // Weighted average across completed modules
  overallSkillLevel: {
    name: "Prodigy",
    icon: "💎",
    color: "#3b82f6"
  },
  
  completedModules: 3,
  totalModules: 8,
  
  modules: [
    {
      id: "spelling",
      name: "Spelling",
      icon: "✏️",
      completed: true,
      score: 85,
      percentage: 85,
      questionsCorrect: 26,
      questionsTotal: 30,
      skillLevel: { name: "Prodigy", icon: "💎", color: "#8b5cf6" },
      achievementUnlocked: true,
      achievementName: "Word Fluency Star",
      completionTime: 45,
      gradient: "from-purple-500 to-pink-600",
      strength: "strong" // strong | moderate | weak
    },
    {
      id: "reading",
      name: "Reading",
      icon: "👁️",
      completed: true,
      score: 92,
      percentage: 92,
      questionsCorrect: 28,
      questionsTotal: 30,
      skillLevel: { name: "Wizard", icon: "🧙‍♂️", color: "#8b5cf6" },
      achievementUnlocked: true,
      achievementName: "Reading Rockstar",
      completionTime: 38,
      gradient: "from-blue-500 to-cyan-600",
      strength: "strong"
    },
    {
      id: "pronunciation",
      name: "Pronunciation",
      icon: "🎤",
      completed: true,
      score: 68,
      percentage: 68,
      questionsCorrect: 17,
      questionsTotal: 25,
      skillLevel: { name: "Explorer", icon: "🗺️", color: "#f59e0b" },
      achievementUnlocked: false,
      completionTime: 52,
      gradient: "from-rose-500 to-orange-600",
      strength: "moderate"
    },
    {
      id: "grammar",
      name: "Grammar",
      icon: "📖",
      completed: false,
      gradient: "from-green-500 to-teal-600",
    },
    {
      id: "writing",
      name: "Writing",
      icon: "✍️",
      completed: false,
      gradient: "from-indigo-500 to-blue-600",
    },
    {
      id: "listening",
      name: "Listening",
      icon: "🎧",
      completed: false,
      gradient: "from-amber-500 to-orange-600",
    },
    {
      id: "vocabulary",
      name: "Vocabulary",
      icon: "💡",
      completed: false,
      gradient: "from-fuchsia-500 to-purple-600",
    },
    {
      id: "sharp",
      name: "S.H.A.R.P",
      icon: "🎯",
      completed: false,
      gradient: "from-cyan-500 to-blue-700",
    }
  ],
  
  achievements: [
    { name: "Word Fluency Star", unlocked: true, module: "Spelling", icon: "⭐" },
    { name: "Reading Rockstar", unlocked: true, module: "Reading", icon: "🎸" },
    { name: "Speed Demon", unlocked: false, module: "Pronunciation", icon: "⚡" },
    { name: "Grammar Guru", unlocked: false, module: "Grammar", icon: "📚" },
    { name: "Master Writer", unlocked: false, module: "Writing", icon: "🖋️" },
    { name: "Active Listener", unlocked: false, module: "Listening", icon: "👂" },
    { name: "Word Wizard", unlocked: false, module: "Vocabulary", icon: "🧠" },
    { name: "SHARP Shooter", unlocked: false, module: "S.H.A.R.P", icon: "🎯" }
  ],
  
  aiInsight: "Ananya shows exceptional reading comprehension and strong spelling skills. Pronunciation needs focused practice, particularly with consonant blends. Consider 15-minute daily pronunciation drills.",
  
  nextRecommendation: "Grammar",
  
  trend: {
    currentScore: 82,
    previousScore: 76,
    improvement: 6
  }
};

// Radar chart data
const getRadarData = (modules) => {
  return modules
    .filter(m => m.completed)
    .map(m => ({
      module: m.name,
      score: m.score,
      fullMark: 100
    }));
};

// ============================================================================
// ANIMATED CIRCULAR PROGRESS
// ============================================================================
const CircularProgress = ({ percentage, size = 200, strokeWidth = 12, children }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setProgress(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  
  const getColor = (pct) => {
    if (pct >= 85) return "#10b981"; // green
    if (pct >= 70) return "#3b82f6"; // blue
    if (pct >= 60) return "#f59e0b"; // amber
    return "#ef4444"; // red
  };
  
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor(percentage)}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

// ============================================================================
// MODULE CARD
// ============================================================================
const ModuleCard = ({ module, onClick }) => {
  const [hovered, setHovered] = useState(false);
  
  if (!module.completed) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative bg-gray-50 rounded-2xl p-6 border-2 border-gray-200 opacity-60"
      >
        <div className="flex flex-col items-center text-center">
          <div className="text-5xl mb-3">{module.icon}</div>
          <h3 className="font-bold text-gray-500 mb-2">{module.name}</h3>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Lock size={14} />
            <span>Not Started</span>
          </div>
        </div>
      </motion.div>
    );
  }
  
  const getScoreColor = (score) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };
  
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative bg-gradient-to-br ${module.gradient} rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden group`}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>
      </div>
      
      {/* Content */}
      <div className="relative flex flex-col items-center text-center">
        <div className="text-5xl mb-3">{module.icon}</div>
        <h3 className="font-black text-lg mb-2">{module.name}</h3>
        
        {/* Score */}
        <div className="flex items-center gap-2 mb-2">
          <div className="text-3xl font-black">{module.score}%</div>
          {module.achievementUnlocked && (
            <Star size={20} className="text-yellow-300 fill-yellow-300" />
          )}
        </div>
        
        {/* Details */}
        <div className="text-xs opacity-90">
          {module.questionsCorrect}/{module.questionsTotal} correct • {module.completionTime} min
        </div>
        
        {/* Hover overlay */}
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center rounded-2xl"
          >
            <div className="flex items-center gap-2 text-white font-bold">
              <span>View Details</span>
              <ChevronRight size={20} />
            </div>
          </motion.div>
        )}
      </div>
    </motion.button>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function DiagnosticProfileOverview() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  
  // TODO: Replace with Firebase fetch
  const data = MOCK_DIAGNOSTIC_DATA;
  
  const radarData = getRadarData(data.modules);
  const completedModules = data.modules.filter(m => m.completed);
  
  const handleModuleClick = (moduleId) => {
    navigate(`/diagnostic-profile/${assessmentId}/module/${moduleId}`);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-purple-100 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-2.5 shadow-lg">
                <Brain size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                  Skills Diagnostic Profile
                </h1>
                <p className="text-sm text-gray-500">Complete Assessment Report</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <p className="font-bold text-gray-900">{data.studentData.fullName}</p>
                <p className="text-sm text-gray-500">Grade {data.studentData.grade} • ID: {data.studentData.assessmentId}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {data.studentData.avatar}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Hero Section - Overall Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-purple-100">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left - Circular Progress */}
              <div className="flex flex-col items-center justify-center">
                <CircularProgress percentage={data.overallScore} size={220} strokeWidth={16}>
                  <div className="text-center">
                    <div className="text-6xl mb-2">{data.overallSkillLevel.icon}</div>
                    <div className="text-5xl font-black text-gray-900">{data.overallScore}%</div>
                    <div className="text-sm font-bold text-gray-500 mt-1">Overall Score</div>
                  </div>
                </CircularProgress>
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full">
                    <Trophy size={18} className="text-purple-600" />
                    <span className="font-bold text-purple-900">{data.overallSkillLevel.name} Level</span>
                  </div>
                </div>
              </div>
              
              {/* Middle - Stats */}
              <div className="flex flex-col justify-center space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 border-2 border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500 rounded-lg p-2">
                      <CheckCircle size={24} className="text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-gray-900">{data.completedModules}/{data.totalModules}</div>
                      <div className="text-sm text-gray-600">Modules Completed</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-5 border-2 border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500 rounded-lg p-2">
                      <Award size={24} className="text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-gray-900">
                        {data.achievements.filter(a => a.unlocked).length}/{data.achievements.length}
                      </div>
                      <div className="text-sm text-gray-600">Achievements Unlocked</div>
                    </div>
                  </div>
                </div>
                
                {data.trend && (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border-2 border-amber-200">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-500 rounded-lg p-2">
                        <TrendingUp size={24} className="text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-black text-green-600">+{data.trend.improvement}%</div>
                        <div className="text-sm text-gray-600">Improvement</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Right - AI Insight */}
              <div className="flex flex-col justify-center">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain size={24} className="text-white" />
                    <h3 className="font-black text-lg">AI Insight</h3>
                  </div>
                  <p className="text-sm leading-relaxed opacity-95">
                    {data.aiInsight}
                  </p>
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold opacity-75">Recommended Next:</span>
                      <span className="text-sm font-black">{data.nextRecommendation}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Module Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <Target size={32} className="text-purple-600" />
              Module Performance
            </h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.modules.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                onClick={() => module.completed && handleModuleClick(module.id)}
              />
            ))}
          </div>
        </motion.div>

        {/* Comparative Analysis */}
        {completedModules.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
          >
            {/* Radar Chart */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-purple-100">
              <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <Activity size={28} className="text-purple-600" />
                Skill Comparison
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="module" tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
              <p className="text-sm text-gray-600 text-center mt-4">
                Instantly see comparative strengths across all completed modules
              </p>
            </div>

            {/* Achievement Gallery */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-purple-100">
              <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <Sparkles size={28} className="text-purple-600" />
                Achievement Gallery
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {data.achievements.map((achievement, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`
                      relative rounded-2xl p-4 text-center transition-all cursor-pointer
                      ${achievement.unlocked
                        ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg hover:scale-110'
                        : 'bg-gray-100 opacity-50'
                      }
                    `}
                  >
                    <div className="text-4xl mb-2">{achievement.icon}</div>
                    {achievement.unlocked && (
                      <div className="absolute -top-2 -right-2">
                        <CheckCircle size={20} className="text-green-500 fill-green-500" />
                      </div>
                    )}
                    {!achievement.unlocked && (
                      <Lock size={16} className="absolute top-2 right-2 text-gray-400" />
                    )}
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  <span className="font-bold text-purple-600">
                    {data.achievements.filter(a => a.unlocked).length}
                  </span>
                  {' '}of{' '}
                  <span className="font-bold">
                    {data.achievements.length}
                  </span>
                  {' '}achievements unlocked
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-3xl p-8 text-white shadow-2xl"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
                <Zap size={28} />
                Keep The Momentum Going!
              </h3>
              <p className="text-blue-100">
                You've completed {data.completedModules} modules. Continue to {data.nextRecommendation} to unlock more achievements!
              </p>
            </div>
            <button
              onClick={() => navigate('/module-selection')}
              className="bg-white text-blue-600 font-black px-8 py-4 rounded-xl hover:scale-105 transition-all shadow-lg flex items-center gap-2"
            >
              <span>Continue Learning</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </motion.div>

      </main>
    </div>
  );
}
