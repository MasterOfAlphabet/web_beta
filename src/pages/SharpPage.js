import React, { useState } from "react";
import { Star, TrendingUp, Lightbulb, Award, Sparkles, BookOpen } from "lucide-react";
/**

{
  name: "S.H.A.R.P",
  icon: <Award className="w-6 h-6" />,
  color: "from-pink-500 to-rose-500",
  tagline: "Synonyms, Homonyms, Antonyms, Rhyming & Plurals — all mastered together",
  description:
    "S.H.A.R.P is the ultimate language mastery arena where students conquer Synonyms, Homonyms, Antonyms, Rhyming, and Plurals in one cohesive program. Designed for deep understanding and rapid retention, it fuses multiple English skills into one powerful practice cycle.",
  masterSkills: [
    "Cross-Category Skill Mastery",
    "Fast-Track Language Fluency",
    "Deep Vocabulary Connections",
    "Integrated Learning Framework"
  ],
  realWorldImpact:
    "Learners build strong word relationships and context fluency, boosting performance in reading, writing, and speaking tasks with ease.",
  funFact:
    "Students using S.H.A.R.P accelerate their vocabulary growth by 3× compared to traditional single-skill drills!"
}

 */
const classGroups = [
  { label: "Class I-II", value: "I-II", gradient: "from-pink-400 to-purple-500" },
  { label: "Class III-V", value: "III-V", gradient: "from-blue-400 to-cyan-500" },
  { label: "Class VI-X", value: "VI-X", gradient: "from-green-400 to-emerald-500" },
];

const sharpSets = {
  "I-II": [
    { type: "Synonym", word: "big", match: "large", emoji: "🔍", color: "from-pink-400 to-rose-500" },
    { type: "Antonym", word: "hot", match: "cold", emoji: "🔥", color: "from-orange-400 to-red-500" },
    { type: "Plural", word: "cat", match: "cats", emoji: "🐱", color: "from-purple-400 to-indigo-500" },
  ],
  "III-V": [
    { type: "Homonym", word: "bat", match: "bat", emoji: "🦇", color: "from-blue-400 to-indigo-500" },
    { type: "Antonym", word: "happy", match: "sad", emoji: "😊", color: "from-yellow-400 to-orange-500" },
    { type: "Rhyming", word: "blue", match: "true", emoji: "🎵", color: "from-cyan-400 to-blue-500" },
  ],
  "VI-X": [
    { type: "Synonym", word: "rapid", match: "swift", emoji: "⚡", color: "from-green-400 to-teal-500" },
    { type: "Homonym", word: "lead", match: "lead", emoji: "🎯", color: "from-indigo-400 to-purple-500" },
    { type: "Plural", word: "analysis", match: "analyses", emoji: "📊", color: "from-emerald-400 to-green-500" },
  ],
};

const leaderboard = [
  { name: "Aanya", score: 2840, avatar: "🌟", rank: 1 },
  { name: "Veer", score: 2720, avatar: "🚀", rank: 2 },
  { name: "Riya", score: 2650, avatar: "✨", rank: 3 },
];

export default function SharpPage() {
  const [group, setGroup] = useState("I-II");
  const [hoveredCard, setHoveredCard] = useState(null);

  const getProgressValue = (group) => {
    switch (group) {
      case "I-II": return 52;
      case "III-V": return 75;
      case "VI-X": return 93;
      default: return 0;
    }
  };

  const currentGradient = classGroups.find(g => g.value === group)?.gradient || "from-pink-400 to-purple-500";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02]">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-6 hover:rotate-12 transition-transform duration-300">
                  <Award className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-5xl md:text-6xl font-black text-white mb-2 tracking-tight">
                  S.H.A.R.P. Skills
                </h1>
                <p className="text-xl text-white/80 leading-relaxed">
                  Strengthen your <span className="text-pink-300 font-bold">Synonyms</span>, <span className="text-blue-300 font-bold">Homonyms</span>, <span className="text-green-300 font-bold">Antonyms</span>, <span className="text-yellow-300 font-bold">Rhyming</span>, and <span className="text-purple-300 font-bold">Plural</span> skills with games and challenges!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Class Group Tabs */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-2 border border-white/20 shadow-xl">
            <div className="grid grid-cols-3 gap-2">
              {classGroups.map((cg) => (
                <button
                  key={cg.value}
                  onClick={() => setGroup(cg.value)}
                  className={`relative py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                    group === cg.value
                      ? `bg-gradient-to-r ${cg.gradient} text-white shadow-lg`
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {cg.label}
                  {group === cg.value && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/80 font-medium">Progress</span>
                  <span className="text-white font-bold">{getProgressValue(group)}%</span>
                </div>
                <div className="h-4 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${currentGradient} rounded-full transition-all duration-1000 ease-out shadow-lg`}
                    style={{ width: `${getProgressValue(group)}%` }}
                  >
                    <div className="h-full bg-gradient-to-r from-white/30 to-transparent animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Level Up!
              </div>
            </div>
          </div>
        </div>

        {/* S.H.A.R.P. Cards */}
        <div className="max-w-6xl mx-auto mb-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Today's S.H.A.R.P. Set
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sharpSets[group].map((item, i) => (
              <div
                key={item.word + item.type}
                className={`backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer ${
                  hoveredCard === i ? 'rotate-1' : ''
                }`}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="text-center">
                  <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center text-3xl shadow-lg transform transition-transform duration-300 ${
                    hoveredCard === i ? 'scale-110 rotate-12' : ''
                  }`}>
                    {item.emoji}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.type}</h3>
                  <p className="text-white/80 text-lg mb-4">
                    <span className="font-semibold">{item.word}</span> ➔ <span className="font-semibold">{item.match}</span>
                  </p>
                  <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                    Practice Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tip */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="backdrop-blur-xl bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-2xl p-6 border border-yellow-400/30 shadow-xl">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">S.H.A.R.P. Tip</h3>
            </div>
            <p className="text-white/90 text-lg">
              <span className="font-bold">Pro Tip:</span> Look for patterns in words to guess their meaning! Context clues are your best friends in language learning.
            </p>
          </div>
        </div>

        {/* Leaderboard & Recommendations */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Leaderboard */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">S.H.A.R.P. Stars</h3>
            </div>
            <div className="space-y-4">
              {leaderboard.map((user, i) => (
                <div key={user.name} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300">
                  <div className="text-2xl">{user.avatar}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white">{user.name}</span>
                      <span className="text-white/70">{user.score} pts</span>
                    </div>
                    <div className="text-sm text-white/60">Rank #{user.rank}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Recommended Next</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 cursor-pointer">
                <h4 className="font-bold text-white mb-1">Homonyms Quiz</h4>
                <p className="text-white/70 text-sm">Test your knowledge of words that sound alike!</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-300 cursor-pointer">
                <h4 className="font-bold text-white mb-1">Plural Challenge</h4>
                <p className="text-white/70 text-sm">Master the art of singular to plural transformations!</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-300 cursor-pointer">
                <h4 className="font-bold text-white mb-1">Synonym Safari</h4>
                <p className="text-white/70 text-sm">Explore the world of similar meanings!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}