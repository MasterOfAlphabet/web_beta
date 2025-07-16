import React, { useState } from "react";
import { 
  Mic, 
  Volume2, 
  Star, 
  TrendingUp, 
  Lightbulb, 
  Headphones,
  Play,
  Award,
  Sparkles,
  Heart
} from "lucide-react";

const classGroups = [
  { label: "Class I-II", value: "I-II", emoji: "🌟" },
  { label: "Class III-V", value: "III-V", emoji: "🚀" },
  { label: "Class VI-X", value: "VI-X", emoji: "🎯" },
];

const pronunciationList = {
  "I-II": [
    { word: "cat", pronunciation: "/kæt/", audio: "/audio/cat.mp3", image: "🐱", color: "from-pink-400 to-purple-500" },
    { word: "dog", pronunciation: "/dɔːg/", audio: "/audio/dog.mp3", image: "🐕", color: "from-blue-400 to-cyan-500" },
    { word: "sun", pronunciation: "/sʌn/", audio: "/audio/sun.mp3", image: "☀️", color: "from-yellow-400 to-orange-500" },
  ],
  "III-V": [
    { word: "giraffe", pronunciation: "/dʒəˈræf/", audio: "/audio/giraffe.mp3", image: "🦒", color: "from-green-400 to-emerald-500" },
    { word: "science", pronunciation: "/ˈsaɪəns/", audio: "/audio/science.mp3", image: "🔬", color: "from-purple-400 to-indigo-500" },
    { word: "future", pronunciation: "/ˈfjuːtʃər/", audio: "/audio/future.mp3", image: "🚀", color: "from-cyan-400 to-blue-500" },
  ],
  "VI-X": [
    { word: "acquaintance", pronunciation: "/əˈkweɪn.təns/", audio: "/audio/acquaintance.mp3", image: "🤝", color: "from-rose-400 to-pink-500" },
    { word: "camouflage", pronunciation: "/ˈkæm.ə.flɑːʒ/", audio: "/audio/camouflage.mp3", image: "🎭", color: "from-teal-400 to-green-500" },
    { word: "conscience", pronunciation: "/ˈkɒn.ʃəns/", audio: "/audio/conscience.mp3", image: "💭", color: "from-violet-400 to-purple-500" },
  ],
};

const topSpeakers = [
  { name: "Aanya", score: 99, avatar: "👑", rank: 1 },
  { name: "Veer", score: 98, avatar: "🌟", rank: 2 },
  { name: "Riya", score: 98, avatar: "💎", rank: 3 },
];

export default function PronunciationPage() {
  const [selectedGroup, setSelectedGroup] = useState("I-II");
  const [playingAudio, setPlayingAudio] = useState(null);

  const handlePlayAudio = (word) => {
    setPlayingAudio(word);
    // Simulate audio playing
    setTimeout(() => setPlayingAudio(null), 2000);
  };

  const getProgressValue = () => {
    return selectedGroup === "I-II" ? 38 : selectedGroup === "III-V" ? 54 : 77;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-yellow-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 p-6 space-y-8">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl transform rotate-3 hover:rotate-6 transition-transform duration-300">
                  <Mic className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-5xl font-black text-white mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Pronunciation Lab
                </h1>
                <p className="text-xl text-white/80 leading-relaxed">
                  Listen and practice pronunciation. Master tricky sounds and record your voice! 🎯
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Class Group Tabs */}
        <div className="max-w-4xl mx-auto">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-2 shadow-xl">
            <div className="flex space-x-2">
              {classGroups.map((group) => (
                <button
                  key={group.value}
                  onClick={() => setSelectedGroup(group.value)}
                  className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                    selectedGroup === group.value
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <span className="mr-2">{group.emoji}</span>
                  {group.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="max-w-4xl mx-auto">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-full rounded-full transition-all duration-1000 ease-out relative"
                    style={{ width: `${getProgressValue()}%` }}
                  >
                    <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                  </div>
                </div>
                <div className="absolute -top-8 text-white/80 font-semibold">
                  Progress: {getProgressValue()}%
                </div>
              </div>
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold shadow-lg transform hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-5 h-5 inline mr-2" />
                Level Up!
              </div>
            </div>
          </div>
        </div>

        {/* Pronunciation Cards */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            <Headphones className="inline mr-3" />
            Listen & Repeat
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pronunciationList[selectedGroup].map((item, index) => (
              <div
                key={item.word}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl transform hover:scale-105 hover:rotate-1 transition-all duration-300 group"
              >
                <div className="text-center space-y-4">
                  <div className={`w-20 h-20 mx-auto bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center text-4xl shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    {item.image}
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{item.word}</h3>
                    <p className="text-white/70 text-lg font-mono bg-white/10 rounded-lg py-2 px-3">
                      {item.pronunciation}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => handlePlayAudio(item.word)}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {playingAudio === item.word ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Playing...
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5" />
                          Listen
                        </>
                      )}
                    </button>
                    
                    <button className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                      <Mic className="w-5 h-5" />
                      Practice Speaking
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Practice Tip */}
        <div className="max-w-4xl mx-auto">
          <div className="backdrop-blur-xl bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-400/30 rounded-2xl p-6 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Quick Practice Tip</h3>
                <p className="text-white/90 mb-4">
                  <strong>Focus on the sound of "a" in "cat" – /æ/</strong>
                </p>
                <button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  Try Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            <Award className="inline mr-3" />
            Top Speakers
          </h2>
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-wrap gap-4 justify-center">
              {topSpeakers.map((speaker, index) => (
                <div
                  key={speaker.name}
                  className={`backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-lg transform hover:scale-105 transition-all duration-300 ${
                    index === 0 ? 'ring-2 ring-yellow-400 bg-gradient-to-r from-yellow-400/20 to-orange-400/20' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{speaker.avatar}</div>
                    <div>
                      <div className="font-bold text-white">{speaker.name}</div>
                      <div className="text-white/70">{speaker.score}% accuracy</div>
                    </div>
                    {index === 0 && (
                      <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                        <Star className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="max-w-4xl mx-auto">
          <div className="backdrop-blur-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-2xl p-6 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Recommended Next</h3>
                <p className="text-white/90 mb-4">
                  Try the <strong>Tongue Twister Challenge</strong> or <strong>Record Your Voice</strong>!
                </p>
                <div className="flex gap-3">
                  <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    Challenge Mode
                  </button>
                  <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    Voice Recording
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-white/60 py-8">
          <p className="flex items-center justify-center gap-2">
            Made with <Heart className="w-4 h-4 text-red-400" /> for language learners
          </p>
        </div>
      </div>
    </div>
  );
}