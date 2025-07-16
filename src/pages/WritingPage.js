import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Mock navigation function for artifact environment
const mockNavigate = (path) => {
  console.log(`Navigating to: ${path}`);
  alert(`Would navigate to: ${path}`);
};

const classGroups = [
  { label: "Class I-II", value: "I-II" },
  { label: "Class III-V", value: "III-V" },
  { label: "Class VI-X", value: "VI-X" },
];

const writingPrompts = {
  "I-II": [
    {
      prompt: "My Pet",
      desc: "Write 2-3 lines about your favorite pet.",
      emoji: "🐕",
      color: "from-pink-400 to-purple-400",
    },
    {
      prompt: "A Rainy Day",
      desc: "Describe what you see on a rainy day.",
      emoji: "🌧️",
      color: "from-blue-400 to-cyan-400",
    },
    {
      prompt: "My Family",
      desc: "Write about your family.",
      emoji: "👨‍👩‍👧‍👦",
      color: "from-green-400 to-emerald-400",
    },
  ],
  "III-V": [
    {
      prompt: "My Best Friend",
      desc: "Describe your best friend.",
      emoji: "👫",
      color: "from-yellow-400 to-orange-400",
    },
    {
      prompt: "A Visit to the Zoo",
      desc: "Narrate your experience at the zoo.",
      emoji: "🦁",
      color: "from-red-400 to-pink-400",
    },
    {
      prompt: "Favorite Festival",
      desc: "Write about your favorite festival.",
      emoji: "🎉",
      color: "from-purple-400 to-violet-400",
    },
  ],
  "VI-X": [
    {
      prompt: "Importance of Trees",
      desc: "Write a short essay on why trees are important.",
      emoji: "🌳",
      color: "from-green-400 to-teal-400",
    },
    {
      prompt: "A Memorable Journey",
      desc: "Narrate a memorable journey you took.",
      emoji: "🚂",
      color: "from-blue-400 to-indigo-400",
    },
    {
      prompt: "Online Learning",
      desc: "Discuss the pros and cons of online learning.",
      emoji: "💻",
      color: "from-indigo-400 to-purple-400",
    },
  ],
};

const topWriters = [
  { name: "Aanya", color: "from-yellow-400 to-orange-400", position: 1 },
  { name: "Veer", color: "from-blue-400 to-cyan-400", position: 2 },
  { name: "Riya", color: "from-purple-400 to-pink-400", position: 3 },
];

export default function WritingStudioModern() {
  const navigate = useNavigate();
  const [group, setGroup] = useState("I-II");

  const getProgressValue = () => {
    switch (group) {
      case "I-II":
        return 25;
      case "III-V":
        return 53;
      case "VI-X":
        return 74;
      default:
        return 25;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 py-8 px-4">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="backdrop-blur-lg bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-6 transition-transform duration-300">
                  <span className="text-4xl">📝</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full animate-bounce"></div>
              </div>
              <div className="flex-1">
                <h1 className="text-5xl font-black text-white mb-2 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent animate-pulse">
                  Writing Studio
                </h1>
                <p className="text-xl text-white/80 leading-relaxed">
                  Express yourself! Practice creative and academic writing with
                  prompts, feedback, and peer comparisons.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Class Group Tabs */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-2 shadow-xl border border-white/20">
            <div className="flex space-x-2">
              {classGroups.map((cg) => (
                <button
                  key={cg.value}
                  onClick={() => setGroup(cg.value)}
                  className={`flex-1 py-3 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                    group === cg.value
                      ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {cg.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="bg-white/20 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-1000 ease-out shadow-lg"
                    style={{ width: `${getProgressValue()}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full px-4 py-2 shadow-lg transform hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold flex items-center gap-2">
                  <span className="text-lg">📈</span>
                  Level Up!
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Writing Prompts */}
        <div className="max-w-6xl mx-auto mb-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Today's Writing Prompts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {writingPrompts[group].map((item, i) => (
              <div
                key={item.prompt}
                className="group backdrop-blur-lg bg-white/10 rounded-3xl p-6 shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2"
              >
                <div className="text-center">
                  <div
                    className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:rotate-12 transition-transform duration-300`}
                  >
                    <span className="text-3xl">{item.emoji}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {item.prompt}
                  </h3>
                  <p className="text-white/70 mb-4 leading-relaxed">
                    {item.desc}
                  </p>
                  <button
                    onClick={() =>
                      navigate(
                        `/writing/practice?prompt=${encodeURIComponent(
                          item.prompt
                        )}`
                      )
                    }
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
                  >
                    Start Writing ✨
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Writing Tip */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="backdrop-blur-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl p-6 shadow-xl border border-cyan-300/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Writing Tip</h3>
            </div>
            <p className="text-white/90 text-lg">
              <span className="font-bold text-yellow-400">Tip:</span> Start with
              a strong opening sentence to grab attention!
            </p>
          </div>
        </div>

        {/* Top Writers Leaderboard */}
        <div className="max-w-3xl mx-auto mb-8">
          <h3 className="text-2xl font-bold text-white mb-4 text-center bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            🏆 Top Writers
          </h3>
          <div className="flex justify-center gap-4 flex-wrap">
            {topWriters.map((writer, index) => (
              <div
                key={writer.name}
                className={`backdrop-blur-lg bg-white/10 rounded-2xl px-6 py-3 shadow-xl border border-white/20 transform hover:scale-110 transition-all duration-300 ${
                  index === 0 ? "hover:-translate-y-2" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 bg-gradient-to-br ${writer.color} rounded-full flex items-center justify-center shadow-lg`}
                  >
                    <span className="text-white font-bold">
                      {index === 0 ? "👑" : index === 1 ? "🥈" : "🥉"}
                    </span>
                  </div>
                  <span className="text-white font-bold text-lg">
                    {writer.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Recommendations */}
        <div className="max-w-3xl mx-auto">
          <div className="backdrop-blur-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 shadow-xl border border-purple-300/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-2xl font-bold text-white">
                Recommended Next
              </h3>
            </div>
            <p className="text-white/90 text-lg">
              Try{" "}
              <span className="font-bold text-yellow-400">Story Writing</span>{" "}
              or review{" "}
              <span className="font-bold text-cyan-400">Letter Formats</span>!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
