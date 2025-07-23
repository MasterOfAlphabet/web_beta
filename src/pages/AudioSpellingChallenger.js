import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Volume2, Mic, Star, Wand2, ChevronLeft, ChevronRight, Target, Trophy, Brain, Zap } from "lucide-react";

// --- Phonetic Progression Mapping ---
const PHONETIC_MAP = {
  "I-II": {
    Rookie: ["cat", "dog", "run", "big", "sun"],
    Racer: ["stop", "frog", "plant", "trap", "clip"],
    Master: ["cake", "kite", "tune", "boat", "team"],
    Prodigy: ["sunshine", "rainbow", "bedroom", "starfish"],
    Wizard: ["lamb", "knee", "write", "gnome"],
  },
  "III-V": {
    Rookie: ["said", "does", "come", "give"],
    Racer: ["happiness", "running", "letter", "bottle"],
    Master: ["unhappy", "happiness", "runner", "careful"],
    Prodigy: ["their", "there", "they're", "bare", "bear"],
    Wizard: ["phone", "rough", "cough", "enough", "physics"],
  },
  "VI-X": {
    Rookie: ["biology", "fraction", "hypothesis", "energy"],
    Racer: ["chronology", "microphone", "telegraph"],
    Master: ["photosynthesis", "algorithm", "isotope", "phenomenon"],
    Prodigy: ["schedule", "garage", "route", "advertisement"],
    Wizard: ["onomatopoeia", "pharmaceutical", "psychology"],
  },
};

const DIFFICULTIES = [
  { name: "Rookie", icon: Target, color: "from-green-400 to-emerald-500" },
  { name: "Racer", icon: Zap, color: "from-blue-400 to-cyan-500" },
  { name: "Master", icon: Brain, color: "from-purple-400 to-violet-500" },
  { name: "Prodigy", icon: Star, color: "from-yellow-400 to-orange-500" },
  { name: "Wizard", icon: Trophy, color: "from-pink-400 to-rose-500" },
];

const CLASSES = [
  { name: "I-II", label: "Elementary", gradient: "from-cyan-400 to-blue-500" },
  { name: "III-V", label: "Intermediate", gradient: "from-violet-400 to-purple-500" },
  { name: "VI-X", label: "Advanced", gradient: "from-rose-400 to-pink-500" }
];

// --- Enhanced 3D Soundwave Visualization ---
const SoundWave = ({ active, intensity = 1 }) => (
  <div className="flex gap-1 items-end h-16 mb-4 relative">
    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl"></div>
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className={`relative z-10 rounded-full transition-all duration-500 ease-out ${
          active
            ? `animate-wave-${i % 5} bg-gradient-to-t from-cyan-400 via-violet-400 to-pink-400 shadow-2xl shadow-purple-500/50`
            : "bg-gradient-to-t from-gray-300 to-gray-400"
        }`}
        style={{
          height: active
            ? `${20 + Math.sin((i * 0.5) + (Date.now() * 0.001)) * 20 * intensity}px`
            : `${8 + (i % 6) * 3}px`,
          width: "4px",
          opacity: active ? 0.9 : 0.4,
          marginRight: "1px",
          filter: active ? `drop-shadow(0 0 8px rgb(168 85 247 / 0.6))` : "none",
          animationDelay: `${i * 50}ms`,
          transform: active ? `scaleY(${1 + Math.sin(i * 0.2) * 0.3})` : "scaleY(1)"
        }}
      ></div>
    ))}
  </div>
);

// --- Pronunciation Scoring ---
function scorePronunciation(word, spoken, accentTolerance = true) {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  spoken = spoken.toLowerCase().replace(/[^a-z]/g, "");
  if (word === spoken) return 1;
  if (
    accentTolerance &&
    word.replace("ph", "f") === spoken.replace("ph", "f")
  )
    return 0.9;
  if (
    accentTolerance &&
    word.replace("gh", "f") === spoken.replace("gh", "f")
  )
    return 0.85;
  if (
    accentTolerance &&
    word.replace("wr", "r") === spoken.replace("wr", "r")
  )
    return 0.85;
  return 0;
}

// --- Error Pattern Analysis ---
function analyzeErrors(history) {
  const errorStats = {};
  history.forEach(({ word, spoken }) => {
    if (scorePronunciation(word, spoken) < 1) {
      word.split("").forEach((char, i) => {
        if (spoken[i] !== char) {
          errorStats[char] = (errorStats[char] || 0) + 1;
        }
      });
    }
  });
  const sorted = Object.entries(errorStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);
  return sorted.map(([char, count]) => ({
    char,
    count,
    tip: `Practice words with "${char}"`,
  }));
}

// --- 3D Floating Letter Component ---
const FloatingLetter = ({ letter, index, isActive, word }) => (
  <div
    className={`relative group transform transition-all duration-700 hover:scale-110 ${
      isActive ? 'animate-float' : ''
    }`}
    style={{
      animationDelay: `${index * 100}ms`,
      transform: `perspective(1000px) rotateX(${isActive ? Math.sin(Date.now() * 0.001 + index) * 5 : 0}deg) rotateY(${isActive ? Math.cos(Date.now() * 0.001 + index) * 5 : 0}deg)`
    }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl blur-lg opacity-30 scale-105"></div>
    <div className="relative bg-gradient-to-br from-white/90 via-blue-50/80 to-purple-100/90 backdrop-blur-xl border border-white/50 rounded-2xl px-4 py-3 shadow-2xl">
      <div className="text-5xl font-black bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">
        {letter.toUpperCase()}
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
      <div className="absolute -top-1 -left-1 w-3 h-3 bg-gradient-to-br from-white to-cyan-200 rounded-full opacity-60"></div>
    </div>
  </div>
);

// --- Enhanced Glassy Word Card ---
const GlassWordCard = ({ word, index, total, classLevel, difficulty }) => {
  const [isAnimating, setIsAnimating] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 2000);
    return () => clearTimeout(timer);
  }, [word]);

  const difficultyConfig = DIFFICULTIES.find(d => d.name === difficulty);
  const classConfig = CLASSES.find(c => c.name === classLevel);

  return (
    <div className="relative group">
      {/* Background glow effect */}
      <div className="absolute -inset-8 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-[3rem] blur-3xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
      
      <div className="relative rounded-[2.5rem] p-12 bg-gradient-to-br from-white/20 via-blue-50/30 to-purple-100/20 backdrop-blur-2xl border-2 border-white/30 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.25)] overflow-hidden">
        {/* Top gradient overlay */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/30 to-transparent rounded-t-[2.5rem]"></div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full opacity-30 animate-float-slow"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            ></div>
          ))}
        </div>

        {/* Header badges */}
        <div className="relative z-10 flex justify-center items-center gap-4 mb-8">
          <div className={`px-6 py-3 bg-gradient-to-r ${classConfig.gradient} rounded-2xl shadow-xl border border-white/20`}>
            <span className="text-white font-bold text-lg drop-shadow-lg">
              {classConfig.label}
            </span>
          </div>
          <div className={`px-6 py-3 bg-gradient-to-r ${difficultyConfig.color} rounded-2xl shadow-xl border border-white/20 flex items-center gap-2`}>
            <difficultyConfig.icon className="w-5 h-5 text-white drop-shadow" />
            <span className="text-white font-bold text-lg drop-shadow-lg">
              {difficulty}
            </span>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="relative z-10 mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-lg border border-white/20">
              <span className="text-white font-bold drop-shadow">
                {index + 1} of {total}
              </span>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden backdrop-blur-sm border border-white/30">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 shadow-lg"
              style={{ width: `${((index + 1) / total) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Word display */}
        <div className="relative z-10 flex flex-wrap gap-4 justify-center mb-8">
          {word.split("").map((letter, idx) => (
            <FloatingLetter
              key={`${word}-${idx}`}
              letter={letter}
              index={idx}
              isActive={isAnimating}
              word={word}
            />
          ))}
        </div>

        {/* Instructions */}
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl border border-white/30 shadow-xl">
            <Wand2 className="w-6 h-6 text-purple-400 animate-pulse" />
            <span className="text-purple-700 font-bold text-lg drop-shadow">
              Listen carefully and spell aloud!
            </span>
            <Sparkles className="w-6 h-6 text-pink-400 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
export default function AudioSpellingChallenger() {
  const [selectedClass, setSelectedClass] = useState("I-II");
  const [selectedLevel, setSelectedLevel] = useState("Rookie");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [adaptiveSpeed, setAdaptiveSpeed] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [spokenWord, setSpokenWord] = useState("");
  const [score, setScore] = useState(null);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [lastFeedback, setLastFeedback] = useState("");
  const recognitionRef = useRef(null);

  const wordList = PHONETIC_MAP[selectedClass][selectedLevel];

  // --- Audio Player ---
  const playWordAudio = () => {
    setIsSpeaking(true);
    setIsListening(false);
    setLastFeedback("");
    setSpokenWord("");
    const word = wordList[currentWordIndex];
    const utter = new window.SpeechSynthesisUtterance(word);
    utter.rate = adaptiveSpeed;
    utter.lang = "en-US";
    utter.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  // --- Speech Recognition ---
  const startListening = () => {
    setIsListening(true);
    setIsSpeaking(false);
    setLastFeedback("");
    setSpokenWord("");
    if ("webkitSpeechRecognition" in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.interimResults = false;
      recognitionRef.current.onresult = (event) => {
        const result = event.results[0][0].transcript;
        setSpokenWord(result);
        const word = wordList[currentWordIndex];
        const pronScore = scorePronunciation(word, result, true);
        setScore(pronScore);
        setSessionHistory((prev) => [
          ...prev,
          { word, spoken: result, score: pronScore },
        ]);
        if (pronScore === 1) {
          setLastFeedback("🎉 Perfect! Spelling and pronunciation matched.");
        } else if (pronScore >= 0.85) {
          setLastFeedback("✨ Almost! Phonetic match but check spelling/accent.");
        } else {
          setLastFeedback("❌ Try again. Pronunciation or spelling did not match.");
        }
        setIsListening(false);
      };
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.start();
    }
  };

  useEffect(() => {
    if (sessionHistory.length > 2) {
      const lastFew = sessionHistory.slice(-3);
      const avg = lastFew.reduce((a, b) => a + b.score, 0) / lastFew.length;
      setAdaptiveSpeed(avg < 0.8 ? 0.7 : 1);
    }
  }, [sessionHistory]);

  const handleNext = () => {
    setCurrentWordIndex((prev) =>
      prev < wordList.length - 1 ? prev + 1 : prev
    );
    setScore(null);
    setSpokenWord("");
    setLastFeedback("");
  };

  const handlePrev = () => {
    setCurrentWordIndex((prev) => (prev > 0 ? prev - 1 : prev));
    setScore(null);
    setSpokenWord("");
    setLastFeedback("");
  };

  const errorPatterns = analyzeErrors(sessionHistory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-violet-500 to-purple-600 rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 py-12 px-4 flex flex-col items-center">
        {/* Main container */}
        <div className="max-w-5xl w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 drop-shadow-2xl">
              Audio Spelling Challenge
            </h1>
            <p className="text-xl text-purple-200 font-medium">
              Master pronunciation and spelling with AI-powered feedback
            </p>
          </div>

          {/* Control Panel */}
          <div className="mb-12">
            <div className="bg-gradient-to-r from-white/10 via-blue-50/10 to-purple-100/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] p-8 shadow-2xl">
              <div className="flex flex-wrap gap-8 justify-between items-center">
                {/* Class selector */}
                <div className="flex flex-col gap-2">
                  <label className="text-purple-200 font-bold text-lg">Class Level</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => {
                      setSelectedClass(e.target.value);
                      setCurrentWordIndex(0);
                    }}
                    className="bg-gradient-to-r from-white/20 to-blue-50/20 backdrop-blur-xl border border-white/30 rounded-xl px-4 py-3 text-purple-700 font-bold text-lg shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-500/50"
                  >
                    {CLASSES.map((c) => (
                      <option key={c.name} value={c.name} className="bg-white text-purple-700">
                        {c.name} - {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty selector */}
                <div className="flex flex-col gap-2">
                  <label className="text-purple-200 font-bold text-lg">Difficulty</label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => {
                      setSelectedLevel(e.target.value);
                      setCurrentWordIndex(0);
                    }}
                    className="bg-gradient-to-r from-white/20 to-purple-50/20 backdrop-blur-xl border border-white/30 rounded-xl px-4 py-3 text-purple-700 font-bold text-lg shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-500/50"
                  >
                    {DIFFICULTIES.map((d) => (
                      <option key={d.name} value={d.name} className="bg-white text-purple-700">
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Soundwave visualization */}
                <div className="flex flex-col items-center gap-4">
                  <SoundWave active={isSpeaking || isListening} intensity={isSpeaking ? 1.2 : 1} />
                  <div className={`text-5xl transition-all duration-500 ${isSpeaking || isListening ? 'animate-bounce scale-110' : ''}`}>
                    {isSpeaking ? '🔊' : isListening ? '🎤' : '🎧'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Word Card */}
          <div className="mb-12">
            <GlassWordCard
              word={wordList[currentWordIndex]}
              index={currentWordIndex}
              total={wordList.length}
              classLevel={selectedClass}
              difficulty={selectedLevel}
            />
          </div>

          {/* Control Buttons */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <button
              className={`group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl font-bold text-white text-lg shadow-2xl border border-white/20 transform transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/25 ${
                isSpeaking ? "opacity-70 scale-95" : "hover:shadow-2xl"
              }`}
              onClick={playWordAudio}
              disabled={isSpeaking || isListening}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <Volume2 className="w-6 h-6" />
                <span>Listen</span>
              </div>
            </button>

            <button
              className={`group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl font-bold text-white text-lg shadow-2xl border border-white/20 transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/25 ${
                isListening ? "opacity-70 scale-95 animate-pulse" : "hover:shadow-2xl"
              }`}
              onClick={startListening}
              disabled={isSpeaking || isListening}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <Mic className="w-6 h-6" />
                <span>Speak & Spell</span>
              </div>
            </button>

            <button
              className="group relative px-6 py-4 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl font-bold text-white shadow-2xl border border-white/20 transform transition-all duration-300 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={handlePrev}
              disabled={currentWordIndex === 0}
              title="Previous Word"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <ChevronLeft className="relative w-6 h-6" />
            </button>

            <button
              className="group relative px-6 py-4 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl font-bold text-white shadow-2xl border border-white/20 transform transition-all duration-300 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={handleNext}
              disabled={currentWordIndex === wordList.length - 1}
              title="Next Word"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <ChevronRight className="relative w-6 h-6" />
            </button>
          </div>

          {/* Feedback Section */}
          {(score !== null || spokenWord || errorPatterns.length > 0) && (
            <div className="bg-gradient-to-r from-white/10 via-blue-50/10 to-purple-100/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] p-8 shadow-2xl">
              {/* Score feedback */}
              {score !== null && (
                <div className="text-center mb-6">
                  <div
                    className={`inline-block px-8 py-4 rounded-2xl text-xl font-bold border border-white/20 shadow-2xl transform transition-all duration-500 scale-105 ${
                      score === 1
                        ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-emerald-500/25"
                        : score >= 0.85
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-yellow-500/25"
                        : "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-red-500/25"
                    }`}
                  >
                    {lastFeedback}
                  </div>
                </div>
              )}

              {/* Spoken word display */}
              {spokenWord && (
                <div className="text-center mb-6">
                  <div className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/30 rounded-xl">
                    <span className="text-purple-200 font-bold text-lg">Your answer: </span>
                    <span className="text-white font-mono text-lg">{spokenWord}</span>
                  </div>
                </div>
              )}

              {/* Error patterns */}
              {errorPatterns.length > 0 && (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Wand2 className="w-5 h-5 text-pink-400" />
                    <span className="text-purple-200 font-bold text-lg">Common Error Patterns</span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    {errorPatterns.map((err, idx) => (
                      <div
                        key={idx}
                        className="px-4 py-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-xl border border-red-300/30 rounded-xl group cursor-help"
                        title={err.tip}
                      >
                        <span className="text-red-300 font-mono font-bold text-lg">{err.char}</span>
                        <span className="text-red-200 ml-2">({err.count})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Speed indicator */}
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-xl border border-white/20 rounded-xl">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
              <span className="text-cyan-200 font-bold">
                Audio Speed: {adaptiveSpeed === 1 ? "Normal" : "Slower for practice"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          33% { 
            transform: translateY(-10px) rotate(2deg); 
          }
          66% { 
            transform: translateY(-5px) rotate(-1deg); 
          }
        }
        
        @keyframes float-slow {
          0%, 100% { 
            transform: translateY(0px) translateX(0px); 
          }
          33% { 
            transform: translateY(-20px) translateX(10px); 
          }
          66% { 
            transform: translateY(-10px) translateX(-10px); 
          }
        }

        @keyframes wave-0 {
          0%, 100% { height: 16px; opacity: 0.6; }
          50% { height: 48px; opacity: 1; }
        }
        
        @keyframes wave-1 {
          0%, 100% { height: 20px; opacity: 0.7; }
          50% { height: 52px; opacity: 1; }
        }
        
        @keyframes wave-2 {
          0%, 100% { height: 18px; opacity: 0.65; }
          50% { height: 56px; opacity: 1; }
        }
      `}</style>
    </div>
  );
}