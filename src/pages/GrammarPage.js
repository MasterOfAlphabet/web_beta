import React, { useState } from "react";
import { ChevronRight, Star, TrendingUp, Lightbulb, Edit3 } from 'lucide-react';

const classGroups = [
  { label: "Class I-II", value: "I-II", gradient: "from-pink-400 to-purple-400" },
  { label: "Class III-V", value: "III-V", gradient: "from-blue-400 to-cyan-400" },
  { label: "Class VI-X", value: "VI-X", gradient: "from-green-400 to-emerald-400" },
];

const grammarTopics = {
  "I-II": [
    { 
      topic: "Nouns", 
      desc: "Names of people, places, or things.", 
      icon: "👥",
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50"
    },
    { 
      topic: "Verbs", 
      desc: "Action words.", 
      icon: "🏃‍♂️",
      color: "from-purple-500 to-indigo-500",
      bgColor: "bg-purple-50"
    },
    { 
      topic: "Adjectives", 
      desc: "Words that describe nouns.", 
      icon: "🌈",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50"
    },
  ],
  "III-V": [
    { 
      topic: "Tenses", 
      desc: "Past, present, and future actions.", 
      icon: "⏰",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50"
    },
    { 
      topic: "Pronouns", 
      desc: "Words used in place of nouns.", 
      icon: "🔄",
      color: "from-teal-500 to-green-500",
      bgColor: "bg-teal-50"
    },
    { 
      topic: "Prepositions", 
      desc: "Show relation between nouns.", 
      icon: "🔗",
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-50"
    },
  ],
  "VI-X": [
    { 
      topic: "Clauses", 
      desc: "Groups of words with a subject and verb.", 
      icon: "📝",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50"
    },
    { 
      topic: "Voice", 
      desc: "Active and passive constructions.", 
      icon: "🎭",
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50"
    },
    { 
      topic: "Direct & Indirect Speech", 
      desc: "Reporting what someone said.", 
      icon: "💬",
      color: "from-cyan-500 to-blue-500",
      bgColor: "bg-cyan-50"
    },
  ],
};

const leaderboardData = [
  { name: "Aanya", score: 97, color: "from-yellow-400 to-orange-500" },
  { name: "Veer", score: 96, color: "from-silver-400 to-gray-500" },
  { name: "Riya", score: 95, color: "from-orange-400 to-red-500" },
];

export default function GrammarPage() {
  const [group, setGroup] = useState("I-II");
  const [showAnswer, setShowAnswer] = useState(false);

  const getProgressValue = () => {
    switch(group) {
      case "I-II": return 40;
      case "III-V": return 60;
      case "VI-X": return 80;
      default: return 40;
    }
  };

  const handleLearnMore = (topic) => {
    // Navigate to lesson page
    console.log(`Navigating to lesson: ${topic}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-cyan-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 py-8 px-4">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-6 hover:rotate-12 transition-transform duration-300">
                <Edit3 className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-black bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent mb-2">
                  Grammar Genius
                </h1>
                <p className="text-xl text-white/80 font-medium">
                  Master the rules of English! Practice parts of speech, tenses, and more with interactive lessons and quizzes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Class Group Tabs */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-2 shadow-xl">
            <div className="flex space-x-2">
              {classGroups.map((cg) => (
                <button
                  key={cg.value}
                  onClick={() => setGroup(cg.value)}
                  className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                    group === cg.value
                      ? `bg-gradient-to-r ${cg.gradient} text-white shadow-lg shadow-black/30`
                      : 'text-white/70 hover:text-white hover:bg-white/10'
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
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="h-4 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full transition-all duration-1000 ease-out shadow-lg"
                    style={{ width: `${getProgressValue()}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-emerald-400 to-cyan-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg">
                <TrendingUp className="w-5 h-5" />
                Level Up!
              </div>
            </div>
          </div>
        </div>

        {/* Grammar Topics */}
        <div className="max-w-6xl mx-auto mb-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Today's Grammar Focus
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {grammarTopics[group].map((item, i) => (
              <div
                key={item.topic}
                className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-2 transition-all duration-300"
              >
                <div className="text-center">
                  <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center text-4xl shadow-2xl transform group-hover:rotate-12 transition-transform duration-300 ${item.bgColor}`}>
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{item.topic}</h3>
                  <p className="text-white/70 mb-4 text-sm">{item.desc}</p>
                  <button
                    onClick={() => handleLearnMore(item.topic)}
                    className={`bg-gradient-to-r ${item.color} text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto`}
                  >
                    Learn More
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Grammar Quiz */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="backdrop-blur-xl bg-gradient-to-br from-yellow-400/20 to-orange-400/20 border border-white/20 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Quick Quiz</h3>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 mb-4">
              <p className="text-white text-lg mb-2">
                <span className="font-bold">Question:</span> What is the plural of "child"?
              </p>
              {showAnswer && (
                <div className="bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-xl p-3 border border-green-400/30">
                  <p className="text-white font-semibold">Answer: Children</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowAnswer(!showAnswer)}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              {showAnswer ? 'Hide Answer' : 'Reveal Answer'}
            </button>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="max-w-3xl mx-auto mb-8">
          <h3 className="text-2xl font-bold text-white mb-4 text-center">Grammar Stars</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {leaderboardData.map((leader, index) => (
              <div
                key={leader.name}
                className={`backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-6 py-4 shadow-xl transform hover:scale-105 transition-all duration-300 ${
                  index === 0 ? 'ring-2 ring-yellow-400' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-gradient-to-r ${leader.color} rounded-full flex items-center justify-center shadow-lg`}>
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold">{leader.name}</p>
                    <p className="text-white/70 text-sm">{leader.score}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Recommendations */}
        <div className="max-w-3xl mx-auto">
          <div className="backdrop-blur-xl bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 border border-white/20 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Recommended Next</h3>
            </div>
            <div className="bg-white/10 rounded-2xl p-4">
              <p className="text-white text-lg">
                Try the <span className="font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Tenses Challenge</span> or explore <span className="font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">Parts of Speech Quiz</span>!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}