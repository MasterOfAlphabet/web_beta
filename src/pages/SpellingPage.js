import React, { useState } from "react";
import { BookOpen, Trophy, Star, TrendingUp, Lightbulb, Target, Zap, Award } from "lucide-react";

const classGroups = [
  { label: "Class I-II", value: "I-II", color: "from-pink-400 to-rose-400" },
  { label: "Class III-V", value: "III-V", color: "from-blue-400 to-indigo-400" },
  { label: "Class VI-X", value: "VI-X", color: "from-purple-400 to-violet-400" },
];

const dailyWords = {
  "I-II": [
    { word: "cat", meaning: "A small domesticated animal.", emoji: "🐱", level: "Beginner" },
    { word: "bat", meaning: "A flying mammal.", emoji: "🦇", level: "Beginner" },
    { word: "mat", meaning: "A piece of fabric for wiping feet.", emoji: "🧘", level: "Beginner" },
  ],
  "III-V": [
    { word: "puzzle", meaning: "A game or problem to solve.", emoji: "🧩", level: "Intermediate" },
    { word: "science", meaning: "The study of the natural world.", emoji: "🔬", level: "Intermediate" },
    { word: "future", meaning: "The time yet to come.", emoji: "🚀", level: "Intermediate" },
  ],
  "VI-X": [
    { word: "conscience", meaning: "A sense of right and wrong.", emoji: "💭", level: "Advanced" },
    { word: "acquaintance", meaning: "A person you know slightly.", emoji: "👋", level: "Advanced" },
    { word: "camouflage", meaning: "Disguise to blend with surroundings.", emoji: "🎭", level: "Advanced" },
  ],
};

export default function SpellingPage() {
  const [group, setGroup] = useState("I-II");
  const [hoveredWord, setHoveredWord] = useState(null);

  const getProgressValue = (group) => {
    return group === "I-II" ? 30 : group === "III-V" ? 60 : 85;
  };

  const getProgressColor = (progress) => {
    if (progress < 40) return "from-red-400 to-orange-400";
    if (progress < 70) return "from-yellow-400 to-orange-400";
    return "from-green-400 to-emerald-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 mb-8 shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-75 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-2xl shadow-xl">
                <BookOpen className="w-12 h-12 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2">
                Spelling Mastery
              </h1>
              <p className="text-xl text-white/80 leading-relaxed">
                Build strong spelling skills with fun games, daily words, and interactive practice. Track your progress and challenge yourself!
              </p>
            </div>
          </div>
        </div>

        {/* Class Group Tabs */}
        <div className="flex justify-center mb-8">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-2 shadow-xl">
            <div className="flex space-x-2">
              {classGroups.map((cg) => (
                <button
                  key={cg.value}
                  onClick={() => setGroup(cg.value)}
                  className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                    group === cg.value
                      ? `bg-gradient-to-r ${cg.color} text-white shadow-lg`
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {cg.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Progress & Actions */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80 font-medium">Progress</span>
                  <span className="text-white font-bold">{getProgressValue(group)}%</span>
                </div>
                <div className="relative h-4 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${getProgressColor(getProgressValue(group))} rounded-full transition-all duration-1000 ease-out shadow-lg`}
                    style={{ width: `${getProgressValue(group)}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-emerald-400 px-4 py-2 rounded-xl text-white font-bold shadow-lg">
                <TrendingUp className="w-5 h-5" />
                Level Up!
              </div>
            </div>
          </div>
        </div>

        {/* Daily Words Carousel */}
        <div className="max-w-5xl mx-auto mb-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Today's Words
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dailyWords[group].map((w, i) => (
              <div
                key={w.word}
                onMouseEnter={() => setHoveredWord(i)}
                onMouseLeave={() => setHoveredWord(null)}
                className={`backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl transition-all duration-300 transform hover:scale-105 hover:rotate-1 ${
                  hoveredWord === i ? "bg-white/20 border-white/40" : ""
                }`}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4 transform hover:scale-110 transition-transform duration-300">
                    {w.emoji}
                  </div>
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-xs font-bold px-2 py-1 rounded-full text-black mb-2 inline-block">
                    {w.level}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{w.word}</h3>
                  <p className="text-white/70 text-sm mb-4">{w.meaning}</p>
                  <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 px-6 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Practice
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Practice / Challenge */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="backdrop-blur-xl bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-400/30 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-2 rounded-xl">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Quick Challenge</h3>
            </div>
            <div className="mb-4">
              <p className="text-white/90 text-lg mb-2">
                <span className="font-bold">Spell the word:</span>
              </p>
              <div className="text-3xl font-bold text-white tracking-widest">
                c _ t
              </div>
            </div>
            <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 px-8 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Reveal Answer
            </button>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="max-w-4xl mx-auto mb-8">
          <h3 className="text-2xl font-bold text-white mb-4 text-center">Top Spellers</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: "Aanya", score: "98%", position: 1, color: "from-yellow-400 to-orange-400" },
              { name: "Veer", score: "96%", position: 2, color: "from-gray-300 to-gray-400" },
              { name: "Riya", score: "95%", position: 3, color: "from-amber-600 to-orange-600" },
            ].map((player, i) => (
              <div key={player.name} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className={`bg-gradient-to-r ${player.color} p-2 rounded-xl shadow-lg`}>
                    {player.position === 1 ? <Trophy className="w-6 h-6 text-white" /> : <Award className="w-6 h-6 text-white" />}
                  </div>
                  <div>
                    <div className="font-bold text-white">{player.name}</div>
                    <div className="text-white/70 text-sm">{player.score}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Recommendations */}
        <div className="max-w-4xl mx-auto">
          <div className="backdrop-blur-xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 border border-blue-400/30 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-xl">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Recommended Next</h3>
            </div>
            <p className="text-white/90 text-lg">
              Try the <span className="font-bold text-yellow-400">Homophones Quiz</span> or review <span className="font-bold text-green-400">Commonly Misspelled Words</span>!
            </p>
            <div className="flex gap-4 mt-4">
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                <Zap className="w-4 h-4 inline mr-2" />
                Quick Quiz
              </button>
              <button className="bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold py-2 px-6 rounded-xl hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                <Star className="w-4 h-4 inline mr-2" />
                Review Words
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}