import React, { useState, useRef, useEffect } from "react";
import { BookOpen, Trophy, Star, TrendingUp, Lightbulb, Target, Zap, Award, Volume2, Play, Pause, RotateCcw, ChevronRight, Headphones, Mic } from "lucide-react";

const classGroups = [
  { label: "Class I-II", value: "I-II", color: "from-pink-400 to-rose-400" },
  { label: "Class III-V", value: "III-V", color: "from-blue-400 to-indigo-400" },
  { label: "Class VI-X", value: "VI-X", color: "from-purple-400 to-violet-400" },
];

const dailyWords = {
  "I-II": [
    { word: "cat", meaning: "A small domesticated animal.", emoji: "🐱", level: "Beginner", phonetic: "kæt" },
    { word: "bat", meaning: "A flying mammal.", emoji: "🦇", level: "Beginner", phonetic: "bæt" },
    { word: "mat", meaning: "A piece of fabric for wiping feet.", emoji: "🧘", level: "Beginner", phonetic: "mæt" },
  ],
  "III-V": [
    { word: "puzzle", meaning: "A game or problem to solve.", emoji: "🧩", level: "Intermediate", phonetic: "ˈpʌzəl" },
    { word: "science", meaning: "The study of the natural world.", emoji: "🔬", level: "Intermediate", phonetic: "ˈsaɪəns" },
    { word: "future", meaning: "The time yet to come.", emoji: "🚀", level: "Intermediate", phonetic: "ˈfjuːtʃər" },
  ],
  "VI-X": [
    { word: "conscience", meaning: "A sense of right and wrong.", emoji: "💭", level: "Advanced", phonetic: "ˈkɒnʃəns" },
    { word: "acquaintance", meaning: "A person you know slightly.", emoji: "👋", level: "Advanced", phonetic: "əˈkweɪntəns" },
    { word: "camouflage", meaning: "Disguise to blend with surroundings.", emoji: "🎭", level: "Advanced", phonetic: "ˈkæməflɑːʒ" },
  ],
};

export default function SpellingPage() {
  const [group, setGroup] = useState("I-II");
  const [hoveredWord, setHoveredWord] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [audioStates, setAudioStates] = useState({});
  const [spellingStates, setSpellingStates] = useState({});
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

  const speak = (text, rate = 1, pause = 0) => {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = 1.2;
      utterance.volume = 0.9;
      
      const voices = speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.name.includes('Female') || 
        voice.name.includes('Samantha') ||
        voice.name.includes('Karen') ||
        voice.gender === 'female'
      );
      if (femaleVoice) utterance.voice = femaleVoice;

      utterance.onend = () => {
        setTimeout(resolve, pause);
      };
      
      speechSynthesis.speak(utterance);
    });
  };

  const handleLearnWord = async (wordObj, index) => {
    const wordKey = `${group}-${index}`;
    
    if (currentlyPlaying === wordKey) {
      speechSynthesis.cancel();
      setCurrentlyPlaying(null);
      setSpellingStates(prev => ({...prev, [wordKey]: { step: 0, isActive: false, currentLetterIndex: -1 }}));
      return;
    }

    setCurrentlyPlaying(wordKey);
    setSpellingStates(prev => ({...prev, [wordKey]: { step: 0, isActive: true, currentLetterIndex: -1 }}));

    try {
      // Step 1: Individual letters with highlighting
      setSpellingStates(prev => ({...prev, [wordKey]: { step: 1, isActive: true, currentLetterIndex: -1 }}));
      const letters = wordObj.word.split('');
      for (let i = 0; i < letters.length; i++) {
        setSpellingStates(prev => ({...prev, [wordKey]: { step: 1, isActive: true, currentLetterIndex: i }}));
        await speak(letters[i].toUpperCase(), 0.8, 400);
      }

      // Step 2: Complete word
      setSpellingStates(prev => ({...prev, [wordKey]: { step: 2, isActive: true, currentLetterIndex: -1 }}));
      await speak(wordObj.word.toUpperCase(), 0.9, 500);

      // Step 3: Meaning
      setSpellingStates(prev => ({...prev, [wordKey]: { step: 3, isActive: true, currentLetterIndex: -1 }}));
      await speak(wordObj.meaning, 1.0, 0);

      // Reset
      setSpellingStates(prev => ({...prev, [wordKey]: { step: 0, isActive: false, currentLetterIndex: -1 }}));
      setCurrentlyPlaying(null);
    } catch (error) {
      setSpellingStates(prev => ({...prev, [wordKey]: { step: 0, isActive: false, currentLetterIndex: -1 }}));
      setCurrentlyPlaying(null);
    }
  };

  const getProgressValue = (group) => {
    return group === "I-II" ? 30 : group === "III-V" ? 60 : 85;
  };

  const getProgressColor = (progress) => {
    if (progress < 40) return "from-red-400 to-orange-400";
    if (progress < 70) return "from-yellow-400 to-orange-400";
    return "from-green-400 to-emerald-400";
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "Beginner": return "from-green-400 to-emerald-400";
      case "Intermediate": return "from-yellow-400 to-orange-400";
      case "Advanced": return "from-red-400 to-pink-400";
      default: return "from-gray-400 to-gray-500";
    }
  };

  const getSpellingAnimation = (wordKey) => {
    const state = spellingStates[wordKey];
    if (!state?.isActive) return "";
    
    switch (state.step) {
      case 1: return "animate-bounce";
      case 2: return "animate-pulse scale-110";
      case 3: return "animate-pulse";
      default: return "";
    }
  };

  const getAudioButtonContent = (wordKey) => {
    const isPlaying = currentlyPlaying === wordKey;
    const state = spellingStates[wordKey];
    
    if (!isPlaying) {
      return (
        <>
          <Play className="w-5 h-5 mr-2" />
          Learn
        </>
      );
    }

    if (state?.step === 1) {
      return (
        <>
          <div className="w-5 h-5 mr-2 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
          </div>
          Spelling
        </>
      );
    } else if (state?.step === 2) {
      return (
        <>
          <Volume2 className="w-5 h-5 mr-2 animate-pulse" />
          Word
        </>
      );
    } else if (state?.step === 3) {
      return (
        <>
          <Headphones className="w-5 h-5 mr-2 animate-bounce" />
          Meaning
        </>
      );
    }

    return (
      <>
        <Pause className="w-5 h-5 mr-2" />
        Stop
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-3000"></div>
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
                Build strong spelling skills with interactive audio learning, daily words, and smart practice. Listen, learn, and master!
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
                  onClick={() => {
                    setGroup(cg.value);
                    speechSynthesis.cancel();
                    setCurrentlyPlaying(null);
                    setSpellingStates({});
                  }}
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
                  <span className="text-white/80 font-medium">Learning Progress</span>
                  <span className="text-white font-bold">{getProgressValue(group)}%</span>
                </div>
                <div className="relative h-4 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${getProgressColor(getProgressValue(group))} rounded-full transition-all duration-1000 ease-out shadow-lg`}
                    style={{ width: `${getProgressValue(group)}%` }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-emerald-400 px-4 py-2 rounded-xl text-white font-bold shadow-lg">
                <TrendingUp className="w-5 h-5" />
                Level Up!
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Daily Words */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-2 rounded-xl">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">Today's Audio Learning</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dailyWords[group].map((w, i) => {
              const wordKey = `${group}-${i}`;
              const isPlaying = currentlyPlaying === wordKey;
              const spellingState = spellingStates[wordKey];
              
              return (
                <div
                  key={w.word}
                  onMouseEnter={() => setHoveredWord(i)}
                  onMouseLeave={() => setHoveredWord(null)}
                  className={`backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl transition-all duration-500 transform hover:scale-105 hover:-rotate-1 ${
                    hoveredWord === i ? "bg-white/20 border-white/40 shadow-2xl" : ""
                  } ${expandedCard === i ? "md:col-span-3 scale-105" : ""}`}
                >
                  <div className="text-center">
                    {/* Emoji with enhanced animations */}
                    <div className={`text-6xl mb-4 transition-all duration-300 ${getSpellingAnimation(wordKey)}`}>
                      {w.emoji}
                    </div>

                    {/* Level Badge */}
                    <div className={`bg-gradient-to-r ${getLevelColor(w.level)} text-xs font-bold px-3 py-1 rounded-full text-white mb-3 inline-block shadow-lg`}>
                      {w.level}
                    </div>

                    {/* Word Display with Letter-by-Letter Highlighting */}
                    <div className="mb-4">
                      <h3 className={`text-3xl font-black text-white mb-2 transition-all duration-300 ${
                        spellingState?.step === 2 ? "text-4xl text-yellow-300 animate-pulse" : ""
                      }`}>
                        {spellingState?.step === 1 ? 
                          w.word.split('').map((letter, idx) => (
                            <span 
                              key={idx} 
                              className={`inline-block transition-all duration-300 ${
                                spellingState.currentLetterIndex === idx 
                                  ? "text-yellow-300 scale-125 animate-bounce bg-yellow-400/30 px-1 rounded-md shadow-lg" 
                                  : spellingState.currentLetterIndex > idx
                                  ? "text-green-300"
                                  : "text-white/50"
                              }`}
                            >
                              {letter.toUpperCase()}
                            </span>
                          )) : 
                          w.word
                        }
                      </h3>

                      {/* Phonetic Pronunciation */}
                      <div className="text-blue-300 text-sm font-mono mb-2">
                        /{w.phonetic}/
                      </div>
                    </div>

                    {/* Meaning with Animation */}
                    <p className={`text-white/80 text-sm mb-6 transition-all duration-300 ${
                      spellingState?.step === 3 ? "text-green-300 font-semibold animate-pulse" : ""
                    }`}>
                      {w.meaning}
                    </p>

                    {/* Interactive Learn Button */}
                    <div className="space-y-3">
                      <button
                        onClick={() => handleLearnWord(w, i)}
                        disabled={currentlyPlaying !== null && currentlyPlaying !== wordKey}
                        className={`w-full font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                          isPlaying
                            ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                            : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                        } text-white`}
                      >
                        {getAudioButtonContent(wordKey)}
                      </button>

                      {/* Learning Progress Indicator */}
                      {spellingState?.isActive && (
                        <div className="bg-white/20 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-green-400 to-blue-500 h-full transition-all duration-1000 ease-out"
                            style={{ width: `${(spellingState.step / 3) * 100}%` }}
                          ></div>
                        </div>
                      )}

                      {/* Status Text */}
                      {isPlaying && (
                        <div className="text-xs text-white/70 animate-pulse">
                          {spellingState?.step === 1 && `🔤 Spelling: ${w.word.charAt(spellingState.currentLetterIndex)?.toUpperCase() || 'Starting...'}`}
                          {spellingState?.step === 2 && "🗣️ Pronouncing word..."}
                          {spellingState?.step === 3 && "📖 Reading meaning..."}
                        </div>
                      )}
                    </div>

                    {/* Expand Button for More Details */}
                    <button
                      onClick={() => setExpandedCard(expandedCard === i ? null : i)}
                      className="mt-4 text-white/60 hover:text-white transition-colors duration-200"
                    >
                      <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${expandedCard === i ? "rotate-90" : ""}`} />
                    </button>

                    {/* Expanded Content */}
                    {expandedCard === i && (
                      <div className="mt-4 pt-4 border-t border-white/20 text-left space-y-2 animate-fadeIn">
                        <div className="text-sm text-white/70">
                          <strong>Word Length:</strong> {w.word.length} letters
                        </div>
                        <div className="text-sm text-white/70">
                          <strong>Difficulty:</strong> {w.level}
                        </div>
                        <div className="text-sm text-white/70">
                          <strong>Category:</strong> {group === "I-II" ? "Basic Words" : group === "III-V" ? "Intermediate Vocabulary" : "Advanced Terms"}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Practice / Challenge */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="backdrop-blur-xl bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-400/30 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-2 rounded-xl">
                <Lightbulb className="w-6 h-6 text-white animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-white">Quick Spelling Challenge</h3>
            </div>
            <div className="mb-4">
              <p className="text-white/90 text-lg mb-2">
                <span className="font-bold">Complete the word:</span>
              </p>
              <div className="text-4xl font-black text-white tracking-[0.5em] mb-4">
                c_t
              </div>
              <div className="text-sm text-white/60">
                💡 Hint: It's a furry pet that says "meow"
              </div>
            </div>
            <div className="flex gap-3">
              <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 px-6 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                <Volume2 className="w-4 h-4 inline mr-2" />
                Reveal Answer
              </button>
              <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                <RotateCcw className="w-4 h-4 inline mr-2" />
                New Challenge
              </button>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="max-w-4xl mx-auto mb-8">
          <h3 className="text-2xl font-bold text-white mb-4 text-center">🏆 Top Spellers Today</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: "Aanya", score: "98%", position: 1, color: "from-yellow-400 to-orange-400", streak: "7 days" },
              { name: "Veer", score: "96%", position: 2, color: "from-gray-300 to-gray-400", streak: "5 days" },
              { name: "Riya", score: "95%", position: 3, color: "from-amber-600 to-orange-600", streak: "3 days" },
            ].map((player) => (
              <div key={player.name} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-xl transform hover:scale-105 transition-all duration-300 hover:bg-white/15">
                <div className="flex items-center gap-3">
                  <div className={`bg-gradient-to-r ${player.color} p-3 rounded-xl shadow-lg relative`}>
                    {player.position === 1 ? <Trophy className="w-6 h-6 text-white" /> : <Award className="w-6 h-6 text-white" />}
                    {player.position === 1 && <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>}
                  </div>
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      {player.name}
                      {player.position === 1 && <span className="text-yellow-300 text-xs">👑</span>}
                    </div>
                    <div className="text-white/70 text-sm">{player.score}</div>
                    <div className="text-white/50 text-xs">🔥 {player.streak}</div>
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
                <Target className="w-6 h-6 text-white animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-white">🎯 Smart Recommendations</h3>
            </div>
            <p className="text-white/90 text-lg mb-4">
              Based on your progress, try the <span className="font-bold text-yellow-400">Homophones Audio Quiz</span> or review <span className="font-bold text-green-400">Commonly Misspelled Words</span> with audio pronunciation!
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                <Zap className="w-4 h-4 inline mr-2" />
                Audio Quiz
              </button>
              <button className="bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold py-2 px-6 rounded-xl hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                <Star className="w-4 h-4 inline mr-2" />
                Review Words
              </button>
              <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-2 px-6 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                <Headphones className="w-4 h-4 inline mr-2" />
                Listen & Learn
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}