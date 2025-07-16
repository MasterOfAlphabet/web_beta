import React, { useState } from "react";
import { BookOpen, Trophy, Star, TrendingUp, Lightbulb, Zap, Target, Award, Users, ChevronRight, PlayCircle, Brain, Sparkles } from "lucide-react";

const classGroups = [
  { label: "Class I-II", value: "I-II", color: "from-pink-400 to-purple-500" },
  { label: "Class III-V", value: "III-V", color: "from-blue-400 to-cyan-500" },
  { label: "Class VI-X", value: "VI-X", color: "from-green-400 to-teal-500" },
];

const passages = {
  "I-II": [
    { 
      title: "The Cat", 
      passage: "The cat sat on the mat.", 
      difficulty: "Easy",
      readTime: "1 min",
      icon: "🐱",
      gradient: "from-pink-500 to-rose-400"
    },
    { 
      title: "A Sunny Day", 
      passage: "The sun is bright and yellow.", 
      difficulty: "Easy",
      readTime: "1 min",
      icon: "☀️",
      gradient: "from-yellow-400 to-orange-400"
    },
    { 
      title: "My Ball", 
      passage: "I like to play with my ball.", 
      difficulty: "Easy",
      readTime: "1 min",
      icon: "⚽",
      gradient: "from-blue-400 to-purple-400"
    },
  ],
  "III-V": [
    { 
      title: "The Jungle", 
      passage: "Animals live in the jungle. They hunt and play among the trees.", 
      difficulty: "Medium",
      readTime: "2 min",
      icon: "🌳",
      gradient: "from-green-500 to-emerald-400"
    },
    { 
      title: "Science Fair", 
      passage: "The science fair was fun. We made a volcano that erupted!", 
      difficulty: "Medium",
      readTime: "2 min",
      icon: "🌋",
      gradient: "from-red-500 to-orange-400"
    },
    { 
      title: "The Library", 
      passage: "I visit the library every week to find new books to read.", 
      difficulty: "Medium",
      readTime: "2 min",
      icon: "📚",
      gradient: "from-indigo-500 to-purple-400"
    },
  ],
  "VI-X": [
    { 
      title: "The Solar System", 
      passage: "Our solar system consists of the sun and eight planets. Each planet is unique.", 
      difficulty: "Hard",
      readTime: "3 min",
      icon: "🌌",
      gradient: "from-purple-600 to-blue-500"
    },
    { 
      title: "Ancient Civilizations", 
      passage: "Civilizations like Egypt and Mesopotamia made great advances in writing and science.", 
      difficulty: "Hard",
      readTime: "4 min",
      icon: "🏛️",
      gradient: "from-amber-500 to-yellow-400"
    },
    { 
      title: "Environmental Change", 
      passage: "Climate change affects life on Earth. We must act to protect our environment.", 
      difficulty: "Hard",
      readTime: "3 min",
      icon: "🌍",
      gradient: "from-teal-500 to-green-400"
    },
  ],
};

const leaderboardData = [
  { name: "Aanya", score: 100, avatar: "🏆", rank: 1 },
  { name: "Veer", score: 99, avatar: "🥈", rank: 2 },
  { name: "Riya", score: 98, avatar: "🥉", rank: 3 },
];

export default function ReadingPage() {
  const [group, setGroup] = useState("I-II");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const progressValue = group === "I-II" ? 35 : group === "III-V" ? 55 : 80;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-red-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-gradient-to-r from-green-400/25 to-teal-400/25 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 py-8 px-4">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl blur-lg opacity-75 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-6 transform hover:scale-110 transition-transform duration-300">
                    <BookOpen className="text-white w-12 h-12" />
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="text-5xl font-black bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-3">
                    Reading Room
                  </h1>
                  <p className="text-xl text-white/80 leading-relaxed">
                    Dive into stories and passages. Improve your reading skills with fun quizzes and comprehension practice!
                  </p>
                </div>
                <div className="hidden lg:block">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-lg opacity-50 animate-spin-slow"></div>
                    <div className="relative bg-gradient-to-r from-pink-500 to-purple-500 rounded-full p-4">
                      <Sparkles className="text-white w-8 h-8" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Class Group Tabs */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-2 shadow-2xl">
            <div className="flex gap-2">
              {classGroups.map((cg) => (
                <button
                  key={cg.value}
                  onClick={() => setGroup(cg.value)}
                  className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 relative overflow-hidden group ${
                    group === cg.value 
                      ? `bg-gradient-to-r ${cg.color} text-white shadow-lg scale-105` 
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">{cg.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Progress & Actions */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="text-blue-400 w-5 h-5" />
                  <span className="text-white/80 font-medium">Reading Progress</span>
                </div>
                <div className="relative">
                  <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out relative"
                      style={{ width: `${progressValue}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
                    </div>
                  </div>
                  <div className="absolute right-0 top-0 transform translate-y-6">
                    <span className="text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-purple-500 px-3 py-1 rounded-full">
                      {progressValue}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl px-6 py-3 transform hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center gap-2">
                    <Zap className="text-white w-5 h-5" />
                    <span className="text-white font-bold">Level Up!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Passages */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Target className="text-amber-400 w-6 h-6" />
            <h2 className="text-2xl font-bold text-white">Today's Passages</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {passages[group].map((passage, index) => (
              <div 
                key={passage.title}
                className="relative group"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className={`relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl transform transition-all duration-300 ${
                  hoveredCard === index ? 'scale-105 -translate-y-2' : 'hover:scale-102'
                }`}>
                  <div className="relative">
                    <div className={`absolute inset-0 bg-gradient-to-r ${passage.gradient} rounded-2xl blur-lg opacity-50 animate-pulse`}></div>
                    <div className={`relative bg-gradient-to-r ${passage.gradient} rounded-2xl p-4 mb-4`}>
                      <div className="text-4xl text-center">{passage.icon}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white">{passage.title}</h3>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          passage.difficulty === 'Easy' ? 'bg-green-500/20 text-green-300' :
                          passage.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-red-500/20 text-red-300'
                        }`}>
                          {passage.difficulty}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-white/80 text-sm leading-relaxed">{passage.passage}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <Brain className="w-4 h-4" />
                        <span>{passage.readTime}</span>
                      </div>
                      <button className="group/btn relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 px-4 rounded-xl transform hover:scale-105 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center gap-2">
                          <PlayCircle className="w-4 h-4" />
                          <span>Take Quiz</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Comprehension */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/30 to-yellow-500/30 rounded-2xl blur-xl opacity-75"></div>
            <div className="relative backdrop-blur-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-300/30 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-lg blur-lg opacity-75 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-amber-400 to-yellow-400 rounded-lg p-2">
                    <Lightbulb className="text-white w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white">Quick Comprehension</h3>
              </div>
              <div className="space-y-4">
                <p className="text-white/90 text-lg">
                  <span className="font-bold">Question:</span> What color is the sun?
                </p>
                <button 
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="relative overflow-hidden bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold py-3 px-6 rounded-xl transform hover:scale-105 transition-all duration-300 group/reveal"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/reveal:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center gap-2">
                    <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${showAnswer ? 'rotate-90' : ''}`} />
                    {showAnswer ? 'Hide Answer' : 'Reveal Answer'}
                  </span>
                </button>
                {showAnswer && (
                  <div className="bg-white/10 border border-white/20 rounded-xl p-4 animate-fade-in">
                    <p className="text-white/90 font-medium">The sun is bright and yellow! ☀️</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="text-yellow-400 w-6 h-6" />
            <h3 className="text-2xl font-bold text-white">Top Readers</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {leaderboardData.map((reader, index) => (
              <div key={reader.name} className="relative group">
                <div className={`absolute inset-0 ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-400/30 to-amber-500/30' :
                  index === 1 ? 'bg-gradient-to-r from-gray-400/30 to-slate-500/30' :
                  'bg-gradient-to-r from-amber-600/30 to-orange-600/30'
                } rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300`}></div>
                <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{reader.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{reader.name}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          index === 0 ? 'bg-yellow-500/20 text-yellow-300' :
                          index === 1 ? 'bg-gray-500/20 text-gray-300' :
                          'bg-orange-500/20 text-orange-300'
                        }`}>
                          #{reader.rank}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="text-yellow-400 w-4 h-4 fill-current" />
                        <span className="text-white/80 font-medium">{reader.score}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Recommendations */}
        <div className="max-w-4xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative backdrop-blur-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-300/30 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg blur-lg opacity-75 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg p-2">
                    <TrendingUp className="text-white w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white">Recommended Next</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/10 border border-white/20 rounded-xl p-4 hover:bg-white/20 transition-colors duration-300 cursor-pointer group/card">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-2">
                      <Target className="text-white w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white group-hover/card:text-purple-300 transition-colors">Passage Challenge</h4>
                      <p className="text-white/70 text-sm">Test your skills!</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 border border-white/20 rounded-xl p-4 hover:bg-white/20 transition-colors duration-300 cursor-pointer group/card">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-lg p-2">
                      <BookOpen className="text-white w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white group-hover/card:text-green-300 transition-colors">Story of the Week</h4>
                      <p className="text-white/70 text-sm">Discover new tales!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}