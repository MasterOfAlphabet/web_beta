import React, { useState } from "react";
import { BookOpen, Trophy, TrendingUp, Lightbulb, Star, Play, Brain } from "lucide-react";

const classGroups = [
  { label: "Class I-II", value: "I-II", color: "from-pink-400 to-rose-400" },
  { label: "Class III-V", value: "III-V", color: "from-purple-400 to-indigo-400" },
  { label: "Class VI-X", value: "VI-X", color: "from-blue-400 to-cyan-400" },
];

const vocabList = {
  "I-II": [
    { word: "apple", meaning: "A red or green fruit.", emoji: "🍎", difficulty: "Easy" },
    { word: "dog", meaning: "A pet animal.", emoji: "🐕", difficulty: "Easy" },
    { word: "boat", meaning: "A vehicle that floats on water.", emoji: "🚤", difficulty: "Easy" },
  ],
  "III-V": [
    { word: "courage", meaning: "Being brave.", emoji: "🦸", difficulty: "Medium" },
    { word: "explore", meaning: "To search or travel for discovery.", emoji: "🔍", difficulty: "Medium" },
    { word: "observe", meaning: "To watch carefully.", emoji: "👀", difficulty: "Medium" },
  ],
  "VI-X": [
    { word: "ambiguous", meaning: "Having more than one meaning.", emoji: "🤔", difficulty: "Hard" },
    { word: "benevolent", meaning: "Well-meaning and kindly.", emoji: "💝", difficulty: "Hard" },
    { word: "meticulous", meaning: "Showing attention to detail.", emoji: "🔬", difficulty: "Hard" },
  ],
};

export default function VocabularyPage() {
  const [group, setGroup] = useState("I-II");
  const [hoveredCard, setHoveredCard] = useState(null);

  const getProgressValue = (group) => {
    switch(group) {
      case "I-II": return 22;
      case "III-V": return 51;
      case "VI-X": return 76;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="mb-8 backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 transform perspective-1000 hover:scale-105 transition-all duration-500">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl transform rotate-6 hover:rotate-12 transition-transform duration-300">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce"></div>
            </div>
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2 transform hover:scale-110 transition-transform duration-300">
                Vocabulary Vault
              </h1>
              <p className="text-xl text-white/80 font-medium">
                Expand your vocabulary with daily words, quizzes, and fun games! ✨
              </p>
            </div>
          </div>
        </div>

        {/* Class Group Tabs */}
        <div className="mb-8 flex justify-center">
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-xl p-2 flex gap-2">
            {classGroups.map((cg, index) => (
              <button
                key={cg.value}
                onClick={() => setGroup(cg.value)}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                  group === cg.value
                    ? `bg-gradient-to-r ${cg.color} text-white shadow-lg scale-105`
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
                style={{
                  transformStyle: "preserve-3d",
                  transform: group === cg.value ? "translateZ(10px)" : "translateZ(0px)"
                }}
              >
                {cg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-8 max-w-4xl mx-auto">
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <Brain className="w-8 h-8 text-purple-400" />
              <h3 className="text-xl font-bold text-white">Learning Progress</h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-white/20 rounded-full h-4 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 rounded-full transition-all duration-1000 ease-out shadow-glow"
                  style={{ width: `${getProgressValue(group)}%` }}
                ></div>
              </div>
              <div className="backdrop-blur-sm bg-gradient-to-r from-pink-400 to-purple-400 rounded-full px-4 py-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-white" />
                <span className="text-white font-bold text-sm">Level Up!</span>
              </div>
            </div>
            <div className="mt-2 text-right">
              <span className="text-white/80 font-medium">{getProgressValue(group)}% Complete</span>
            </div>
          </div>
        </div>

        {/* Today's Vocabulary Header */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-black bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Today's Vocabulary
          </h2>
          <p className="text-white/70 text-lg">Master these words and level up your language skills!</p>
        </div>

        {/* Vocabulary Cards */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {vocabList[group].map((item, index) => (
            <div
              key={item.word}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`group backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer ${
                hoveredCard === index ? "bg-white/20 border-white/30" : ""
              }`}
              style={{
                transformStyle: "preserve-3d",
                transform: hoveredCard === index ? "rotateY(5deg) rotateX(5deg)" : "rotateY(0deg) rotateX(0deg)"
              }}
            >
              <div className="text-center">
                <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {item.emoji}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-pink-300 transition-colors">
                  {item.word}
                </h3>
                <p className="text-white/80 mb-4 leading-relaxed">
                  {item.meaning}
                </p>
                <div className="flex justify-between items-center mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    item.difficulty === "Easy" ? "bg-green-400/20 text-green-300" :
                    item.difficulty === "Medium" ? "bg-yellow-400/20 text-yellow-300" :
                    "bg-red-400/20 text-red-300"
                  }`}>
                    {item.difficulty}
                  </span>
                </div>
                <button className="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold py-3 px-6 rounded-xl hover:from-pink-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" />
                  Practice
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Vocabulary Tip */}
        <div className="mb-8 max-w-4xl mx-auto">
          <div className="backdrop-blur-xl bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-2xl border border-yellow-400/30 shadow-xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-yellow-400/20 rounded-xl">
                <Lightbulb className="w-6 h-6 text-yellow-300" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">💡 Vocabulary Tip</h3>
                <p className="text-white/90 text-lg">
                  <span className="font-semibold">Pro Tip:</span> Use new words in your own sentences to remember them better! 
                  Try creating a story with today's words. 📚
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Leaderboard */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <h3 className="text-xl font-bold text-white">Vocabulary Stars</h3>
            </div>
            <div className="space-y-3">
              {["Aanya", "Veer", "Riya"].map((name, index) => (
                <div key={name} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index === 0 ? "bg-yellow-400" : index === 1 ? "bg-gray-400" : "bg-orange-400"
                  }`}>
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white font-medium">{name}</span>
                  <div className="ml-auto flex items-center gap-1">
                    <span className="text-sm text-white/70">{100 - index * 15} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Recommendations */}
          <div className="backdrop-blur-xl bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-2xl border border-pink-400/30 shadow-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-pink-400" />
              <h3 className="text-xl font-bold text-white">Recommended Next</h3>
            </div>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer transform hover:scale-105">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">🧩</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Synonyms Quiz</h4>
                    <p className="text-white/70 text-sm">Test your word knowledge</p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer transform hover:scale-105">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-teal-400 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">🎯</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Word Match Game</h4>
                    <p className="text-white/70 text-sm">Fun matching challenge</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .shadow-glow {
          box-shadow: 0 0 20px rgba(236, 72, 153, 0.5);
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}