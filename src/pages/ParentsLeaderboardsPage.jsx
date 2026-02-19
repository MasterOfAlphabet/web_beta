import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  Filter,
  MapPin,
  Globe2,
  Building2,
  ChevronDown,
  Search,
  Star,
  Sparkles,
  Target,
  Eye,
  Mic,
  Headphones,
  PenTool,
  Lightbulb,
  MessageSquare,
  FileText,
  BookOpen,
  Download,
  Share2,
  Crown,
  Zap,
  BarChart3
} from "lucide-react";

// ============================================================================
// Mock Data - Replace with actual API data
// ============================================================================
const MOCK_LEADERBOARD_DATA = {
  filters: {
    modules: ["Spelling", "Reading", "Pronunciation", "Grammar", "Writing", "Listening", "Vocabulary", "S.H.A.R.P"],
    districts: ["South Delhi", "North Delhi", "Central Delhi", "East Delhi", "West Delhi"],
    cities: ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune"],
    states: ["Delhi NCR", "Maharashtra", "Karnataka", "Tamil Nadu", "West Bengal", "Telangana"]
  },
  
  rankings: {
    topPerformers: [
      {
        rank: 1,
        name: "Ananya Sharma",
        grade: "5",
        school: "Delhi Public School",
        city: "Delhi",
        state: "Delhi NCR",
        module: "Spelling",
        rawScore: 28,
        totalQuestions: 30,
        weightedIndex: 94,
        skillLevel: "Wizard",
        levelIcon: "🧙‍♂️",
        levelColor: "#8b5cf6",
        clusters: {
          recognition: { score: 95, icon: "👁️" },
          phoneme: { score: 92, icon: "🎵" },
          structuring: { score: 94, icon: "🏗️" }
        }
      },
      {
        rank: 2,
        name: "Vihaan Kumar",
        grade: "5",
        school: "The Shri Ram School",
        city: "Gurgaon",
        state: "Haryana",
        module: "Spelling",
        rawScore: 27,
        totalQuestions: 30,
        weightedIndex: 91,
        skillLevel: "Prodigy",
        levelIcon: "💎",
        levelColor: "#3b82f6",
        clusters: {
          recognition: { score: 93, icon: "👁️" },
          phoneme: { score: 88, icon: "🎵" },
          structuring: { score: 91, icon: "🏗️" }
        }
      },
      {
        rank: 3,
        name: "Aadhya Iyer",
        grade: "4",
        school: "National Public School",
        city: "Bangalore",
        state: "Karnataka",
        module: "Spelling",
        rawScore: 26,
        totalQuestions: 30,
        weightedIndex: 88,
        skillLevel: "Prodigy",
        levelIcon: "💎",
        levelColor: "#3b82f6",
        clusters: {
          recognition: { score: 90, icon: "👁️" },
          phoneme: { score: 85, icon: "🎵" },
          structuring: { score: 89, icon: "🏗️" }
        }
      },
      {
        rank: 4,
        name: "Arjun Reddy",
        grade: "5",
        school: "Chirec International",
        city: "Hyderabad",
        state: "Telangana",
        module: "Spelling",
        rawScore: 25,
        totalQuestions: 30,
        weightedIndex: 85,
        skillLevel: "Master",
        levelIcon: "🌟",
        levelColor: "#22c55e",
        clusters: {
          recognition: { score: 88, icon: "👁️" },
          phoneme: { score: 82, icon: "🎵" },
          structuring: { score: 84, icon: "🏗️" }
        }
      },
      {
        rank: 5,
        name: "Kavya Patel",
        grade: "4",
        school: "Udgam School",
        city: "Ahmedabad",
        state: "Gujarat",
        module: "Spelling",
        rawScore: 24,
        totalQuestions: 30,
        weightedIndex: 82,
        skillLevel: "Master",
        levelIcon: "🌟",
        levelColor: "#22c55e",
        clusters: {
          recognition: { score: 85, icon: "👁️" },
          phoneme: { score: 80, icon: "🎵" },
          structuring: { score: 81, icon: "🏗️" }
        }
      }
    ],
    
    districtRankings: [
      { rank: 1, name: "Ananya Sharma", district: "South Delhi", score: 94 },
      { rank: 2, name: "Rohan Mehta", district: "South Delhi", score: 89 },
      { rank: 3, name: "Priya Singh", district: "South Delhi", score: 87 },
    ],
    
    cityRankings: [
      { rank: 1, name: "Ananya Sharma", city: "Delhi", score: 94 },
      { rank: 2, name: "Arjun Kumar", city: "Delhi", score: 92 },
      { rank: 3, name: "Ishita Gupta", city: "Delhi", score: 90 },
    ],
    
    stateRankings: [
      { rank: 1, name: "Ananya Sharma", state: "Delhi NCR", score: 94 },
      { rank: 2, name: "Rohan Mehta", state: "Delhi NCR", score: 92 },
      { rank: 3, name: "Vihaan Kumar", state: "Haryana", score: 91 },
    ]
  }
};

// ============================================================================
// Skill Level Badge Component
// ============================================================================
const SkillLevelBadge = ({ level, icon, color }) => {
  const levelColors = {
    "Rookie": { bg: "#fee2e2", text: "#b91c1c" },
    "Racer": { bg: "#fef3c7", text: "#b45309" },
    "Master": { bg: "#dcfce7", text: "#166534" },
    "Prodigy": { bg: "#dbeafe", text: "#1e40af" },
    "Wizard": { bg: "#f3e8ff", text: "#6b21a8" }
  };
  
  const colors = levelColors[level] || levelColors["Master"];
  
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-lg">{icon}</span>
      <span 
        className="px-2 py-1 rounded-full text-xs font-bold"
        style={{ backgroundColor: colors.bg, color: colors.text }}
      >
        {level}
      </span>
    </div>
  );
};

// ============================================================================
// Cluster Mini Chart Component
// ============================================================================
const ClusterMiniChart = ({ clusters }) => {
  return (
    <div className="flex items-center gap-3">
      {Object.entries(clusters).map(([key, data]) => (
        <div key={key} className="flex items-center gap-1">
          <span className="text-sm">{data.icon}</span>
          <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full"
              style={{ 
                width: `${data.score}%`,
                backgroundColor: 
                  data.score >= 90 ? "#10b981" :
                  data.score >= 75 ? "#3b82f6" :
                  data.score >= 60 ? "#eab308" : "#ef4444"
              }}
            />
          </div>
          <span className="text-xs font-medium text-gray-600">{data.score}%</span>
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// Main Leaderboard Component
// ============================================================================
export default function LeaderboardPage() {
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState("Spelling");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedState, setSelectedState] = useState("All States");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const data = MOCK_LEADERBOARD_DATA;
  
  // Filter handlers
  const handleModuleChange = (module) => setSelectedModule(module);
  const handleDistrictChange = (district) => setSelectedDistrict(district);
  const handleCityChange = (city) => setSelectedCity(city);
  const handleStateChange = (state) => setSelectedState(state);
  
  // Get rank badge based on position
  const getRankBadge = (rank) => {
    if (rank === 1) return { icon: "🥇", color: "#FFD700", label: "Gold" };
    if (rank === 2) return { icon: "🥈", color: "#C0C0C0", label: "Silver" };
    if (rank === 3) return { icon: "🥉", color: "#CD7F32", label: "Bronze" };
    return { icon: `${rank}`, color: "#6b7280", label: `${rank}th` };
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      
      {/* Header */}
      <div className="bg-white border-b border-purple-100 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-2.5 shadow-lg">
                <Trophy size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                  Student Leaderboard
                </h1>
                <p className="text-sm text-gray-500">
                  Top performers across India
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-xl hover:bg-purple-100 transition-colors"
            >
              <Filter size={18} />
              <span className="hidden sm:inline">Filters</span>
              <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          {/* Filter Bar - Collapsible */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Module Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Module</label>
                  <select 
                    value={selectedModule}
                    onChange={(e) => handleModuleChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {data.filters.modules.map(module => (
                      <option key={module} value={module}>{module}</option>
                    ))}
                  </select>
                </div>
                
                {/* District Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">District</label>
                  <select 
                    value={selectedDistrict}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option>All Districts</option>
                    {data.filters.districts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
                
                {/* City Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">City</label>
                  <select 
                    value={selectedCity}
                    onChange={(e) => handleCityChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option>All Cities</option>
                    {data.filters.cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                
                {/* State Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">State</label>
                  <select 
                    value={selectedState}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option>All States</option>
                    {data.filters.states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Search Bar */}
              <div className="mt-4 relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by student name, school..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-purple-100">
            <p className="text-xs text-gray-500 mb-1">Total Students</p>
            <p className="text-2xl font-bold text-gray-900">24,856</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-purple-100">
            <p className="text-xs text-gray-500 mb-1">Schools</p>
            <p className="text-2xl font-bold text-gray-900">523</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-purple-100">
            <p className="text-xs text-gray-500 mb-1">Cities</p>
            <p className="text-2xl font-bold text-gray-900">48</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-purple-100">
            <p className="text-xs text-gray-500 mb-1">States</p>
            <p className="text-2xl font-bold text-gray-900">12</p>
          </div>
        </div>
        
        {/* Top 3 Podium */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Crown size={20} className="text-yellow-500" />
            Top Performers
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.rankings.topPerformers.slice(0, 3).map((student, index) => {
              const rank = index + 1;
              const rankBadge = getRankBadge(rank);
              
              return (
                <div 
                  key={student.rank}
                  className={`
                    relative bg-white rounded-2xl p-6 shadow-lg border-2 
                    ${rank === 1 ? 'border-yellow-400' : rank === 2 ? 'border-gray-300' : 'border-amber-600'}
                    transform hover:scale-105 transition-all duration-300
                  `}
                >
                  {/* Rank Badge */}
                  <div 
                    className="absolute -top-3 -right-3 w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg"
                    style={{ backgroundColor: rankBadge.color }}
                  >
                    {rankBadge.icon}
                  </div>
                  
                  {/* Student Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-2xl">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-500">Grade {student.grade}</p>
                      <p className="text-xs text-gray-400">{student.school}</p>
                    </div>
                  </div>
                  
                  {/* Score & Level */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Weighted Index</p>
                      <p className="text-2xl font-bold text-purple-700">{student.weightedIndex}%</p>
                    </div>
                    <SkillLevelBadge 
                      level={student.skillLevel}
                      icon={student.levelIcon}
                      color={student.levelColor}
                    />
                  </div>
                  
                  {/* Cluster Mini Chart */}
                  <div className="border-t border-gray-100 pt-3">
                    <p className="text-xs text-gray-500 mb-2">Skill Clusters</p>
                    <ClusterMiniChart clusters={student.clusters} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Full Leaderboard Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-100 to-pink-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Rank</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Student</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">School</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Raw Score</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Weighted Index</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Level</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Clusters</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.rankings.topPerformers.map((student) => {
                  const rankBadge = getRankBadge(student.rank);
                  
                  return (
                    <tr 
                      key={student.rank} 
                      className="hover:bg-purple-50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/student/${student.name}`)}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {student.rank <= 3 ? (
                            <span className="text-xl">{rankBadge.icon}</span>
                          ) : (
                            <span className="font-bold text-gray-500">#{student.rank}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div>
                          <p className="font-bold text-gray-900">{student.name}</p>
                          <p className="text-xs text-gray-500">Grade {student.grade}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {student.school}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin size={14} className="text-gray-400" />
                          {student.city}, {student.state}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-medium text-gray-900">
                          {student.rawScore}/{student.totalQuestions}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-bold text-purple-700">
                          {student.weightedIndex}%
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <SkillLevelBadge 
                          level={student.skillLevel}
                          icon={student.levelIcon}
                          color={student.levelColor}
                        />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <ClusterMiniChart clusters={student.clusters} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* District/City/State Tabs */}
        <div className="mt-8">
          <div className="border-b border-gray-200">
            <nav className="flex gap-4">
              {["District", "City", "State"].map((tab) => (
                <button
                  key={tab}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-purple-700 border-b-2 border-transparent hover:border-purple-700 transition-colors"
                >
                  {tab} Rankings
                </button>
              ))}
            </nav>
          </div>
          
          {/* Sample District Rankings */}
          <div className="mt-4 bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Building2 size={16} className="text-purple-600" />
              Top in South Delhi
            </h3>
            <div className="space-y-2">
              {data.rankings.districtRankings.map((item) => (
                <div key={item.rank} className="flex items-center justify-between p-2 hover:bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-400 w-6">#{item.rank}</span>
                    <span className="font-medium text-gray-900">{item.name}</span>
                  </div>
                  <span className="font-bold text-purple-700">{item.score}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Export Button */}
        <div className="mt-8 flex justify-end">
          <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:scale-105 transition-all shadow-lg">
            <Download size={18} />
            Export Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}