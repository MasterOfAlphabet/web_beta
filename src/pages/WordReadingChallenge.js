import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Mic,
  MicOff,
  Eye,
  Scroll,
  Grid3X3,
  Clock,
  Award,
  Target,
  Zap,
  BookOpen,
  Volume2,
} from "lucide-react";

const WordReadingChallenge = () => {
  // Core state
  const [phase, setPhase] = useState("setup"); // setup, challenge, results
  const [classGroup, setClassGroup] = useState("III-V");
  const [wordCount, setWordCount] = useState(25);
  const [displayMode, setDisplayMode] = useState("flow"); // flow, pages, grid
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [recognizedWords, setRecognizedWords] = useState([]);
  const [isListening, setIsListening] = useState(false);

  // Advanced word lists with better variety
  const wordCollections = {
    "I-II": {
      words: [
        "cat",
        "dog",
        "run",
        "jump",
        "big",
        "red",
        "sun",
        "moon",
        "car",
        "book",
        "play",
        "happy",
        "blue",
        "bird",
        "fish",
        "tree",
        "ball",
        "cake",
        "milk",
        "home",
        "love",
        "kind",
        "warm",
        "soft",
        "fast",
        "slow",
        "up",
        "down",
        "yes",
        "fun",
        "new",
        "old",
        "hot",
        "cold",
        "good",
        "nice",
        "bear",
        "duck",
        "frog",
        "star",
        "door",
        "window",
        "chair",
        "table",
        "green",
        "yellow",
        "pink",
        "black",
        "white",
        "small",
      ],
      theme: "Simple everyday words",
      emoji: "🌟",
    },
    "III-V": {
      words: [
        "adventure",
        "butterfly",
        "chocolate",
        "elephant",
        "fantastic",
        "gigantic",
        "happiness",
        "important",
        "jellyfish",
        "kangaroo",
        "lightning",
        "mountain",
        "beautiful",
        "wonderful",
        "dangerous",
        "excellent",
        "incredible",
        "mysterious",
        "playground",
        "rainbow",
        "sandwich",
        "telephone",
        "umbrella",
        "vacation",
        "waterfall",
        "basketball",
        "computer",
        "dinosaur",
        "friendly",
        "hospital",
        "bicycle",
        "magazine",
        "submarine",
        "telescope",
        "helicopter",
        "strawberry",
        "neighborhood",
        "celebration",
        "comfortable",
        "delicious",
      ],
      theme: "Intermediate vocabulary",
      emoji: "🚀",
    },
    "VI-X": {
      words: [
        "extraordinary",
        "magnificent",
        "revolutionary",
        "sophisticated",
        "unprecedented",
        "comprehension",
        "investigation",
        "responsibility",
        "achievement",
        "environment",
        "pronunciation",
        "encyclopedia",
        "mathematics",
        "psychology",
        "archaeology",
        "constellation",
        "photosynthesis",
        "biodiversity",
        "architecture",
        "philosophy",
        "technological",
        "entrepreneurship",
        "humanitarian",
        "controversial",
        "simultaneous",
        "Mediterranean",
        "catastrophic",
        "infrastructure",
        "bureaucratic",
        "metamorphosis",
        "autobiography",
        "civilization",
        "phenomenon",
        "observatory",
        "geographical",
        "pharmaceutical",
        "astronomical",
        "constitutional",
        "atmospheric",
        "archaeological",
      ],
      theme: "Advanced vocabulary",
      emoji: "🧠",
    },
  };

  const handleManualComplete = () => {
    // Stop any ongoing recognition
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setIsRecording(false);
    }
    // Set final time
    if (startTimeRef.current) {
      setTimeElapsed((Date.now() - startTimeRef.current) / 1000);
    }
    // Go to results
    setPhase("results");
  };

  // Smart timing based on complexity
  const getTimePerWord = () => {
    const baseTimes = { "I-II": 4, "III-V": 2.5, "VI-X": 1.8 };
    return baseTimes[classGroup];
  };

  // Get current word collection
  const currentCollection = wordCollections[classGroup];
  const currentWords = currentCollection.words.slice(0, wordCount);

  // Refs
  const timerRef = useRef(null);
  const recognitionRef = useRef(null);
  const startTimeRef = useRef(null);

  // Speech recognition setup
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join(" ")
          .toLowerCase()
          .trim();

        if (transcript) {
          const words = transcript.split(" ").filter((word) => word.length > 0);
          setRecognizedWords((prev) => {
            const newWords = [...prev];
            words.forEach((word) => {
              const cleanWord = word.replace(/[^\w]/g, ""); // Remove punctuation
              // Only validate against words that should have been read so far
              const wordsToValidateAgainst = currentWords.slice(
                0,
                Math.max(currentWordIndex + 1, 1)
              );
              const targetWords = wordsToValidateAgainst.map((w) =>
                w.toLowerCase()
              );

              if (
                !newWords.some((w) => w.word === cleanWord) &&
                targetWords.includes(cleanWord)
              ) {
                newWords.push({
                  word: cleanWord,
                  timestamp: Date.now(),
                  correctPosition: targetWords.indexOf(cleanWord),
                });
              }
            });
            return newWords;
          });
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [currentWords]);

  // Auto-advance timer for flow mode
  useEffect(() => {
    if (
      phase === "challenge" &&
      !isPaused &&
      displayMode === "flow" &&
      currentWordIndex < currentWords.length
    ) {
      timerRef.current = setTimeout(() => {
        setCurrentWordIndex((prev) => prev + 1);
      }, getTimePerWord() * 1000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [
    phase,
    isPaused,
    currentWordIndex,
    currentWords.length,
    displayMode,
    classGroup,
  ]);

  // Time elapsed counter
  useEffect(() => {
    let interval;
    if (
      phase === "challenge" &&
      !isPaused &&
      currentWordIndex < currentWords.length
    ) {
      if (!startTimeRef.current) startTimeRef.current = Date.now();
      interval = setInterval(() => {
        setTimeElapsed((Date.now() - startTimeRef.current) / 1000);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [phase, isPaused, currentWordIndex, currentWords.length]);

  // Check for completion
  useEffect(() => {
    if (currentWordIndex >= currentWords.length && phase === "challenge") {
      setTimeout(() => setPhase("results"), 1000);
      if (isListening) {
        recognitionRef.current?.stop();
      }
    }
  }, [currentWordIndex, currentWords.length, phase, isListening]);

  const handleStart = () => {
    setPhase("challenge");
    setCurrentWordIndex(0);
    setTimeElapsed(0);
    setRecognizedWords([]);
    setIsPaused(false);
    startTimeRef.current = null;
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    if (isListening) {
      if (isPaused) {
        recognitionRef.current?.start();
      } else {
        recognitionRef.current?.stop();
      }
    }
  };

  const handleReset = () => {
    setPhase("setup");
    setCurrentWordIndex(0);
    setTimeElapsed(0);
    setRecognizedWords([]);
    setIsPaused(false);
    setIsListening(false);
    setIsRecording(false);
    startTimeRef.current = null;
    if (timerRef.current) clearTimeout(timerRef.current);
    if (recognitionRef.current) recognitionRef.current.stop();
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      setIsRecording(true);
    }
  };

  const nextWord = () => {
    if (currentWordIndex < currentWords.length - 1) {
      setCurrentWordIndex((prev) => prev + 1);
    }
  };

  const prevWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex((prev) => prev - 1);
    }
  };

  // Styling helpers
  const getFontClass = () => {
    const sizes = {
      "I-II": "text-5xl md:text-7xl lg:text-8xl",
      "III-V": "text-4xl md:text-6xl lg:text-7xl",
      "VI-X": "text-3xl md:text-5xl lg:text-6xl",
    };
    return sizes[classGroup];
  };

  const getAccuracy = () => {
    if (recognizedWords.length === 0) return 0;
    const correctWords = recognizedWords.filter((word) =>
      currentWords
        .slice(0, currentWordIndex + 1)
        .map((w) => w.toLowerCase())
        .includes(word)
    ).length;
    return Math.round(
      (correctWords / Math.min(recognizedWords.length, currentWordIndex + 1)) *
        100
    );
  };

  const getWPM = () => {
    if (timeElapsed === 0) return 0;
    return Math.round((recognizedWords.length / timeElapsed) * 60);
  };

  // SETUP PHASE
  if (phase === "setup") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-900 via-blue-900 to-indigo-900 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-pink-500 to-violet-500 rounded-3xl mb-6 shadow-2xl">
              <BookOpen className="text-white" size={48} />
            </div>
            <h1 className="text-6xl font-black bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent mb-4">
              Word Reading Challenge
            </h1>
            <p className="text-xl text-gray-300 font-medium">
              Master your reading speed with intelligent adaptation
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Class Selection */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Target className="text-pink-400" size={28} />
                Class Level
              </h3>
              <div className="space-y-4">
                {Object.entries(wordCollections).map(([key, data]) => (
                  <button
                    key={key}
                    onClick={() => setClassGroup(key)}
                    className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 ${
                      classGroup === key
                        ? "border-pink-400 bg-pink-400/20 shadow-lg shadow-pink-400/25"
                        : "border-white/20 bg-white/5 hover:border-pink-300 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{data.emoji}</span>
                      <div className="text-left">
                        <div className="text-xl font-bold text-white">
                          Class {key}
                        </div>
                        <div className="text-sm text-gray-300">
                          {data.theme}
                        </div>
                        <div className="text-xs text-pink-300">
                          {getTimePerWord()}s per word
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Word Count & Display Mode */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Zap className="text-violet-400" size={28} />
                Challenge Setup
              </h3>

              <div className="mb-8">
                <label className="block text-lg font-semibold text-white mb-4">
                  Word Count
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[5, 10, 25].map((count) => (
                    <button
                      key={count}
                      onClick={() => setWordCount(count)}
                      className={`p-4 rounded-xl font-bold transition-all ${
                        wordCount === count
                          ? "bg-violet-500 text-white shadow-lg"
                          : "bg-white/10 text-gray-300 hover:bg-white/20"
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {[50, 100].map((count) => (
                    <button
                      key={count}
                      onClick={() => setWordCount(count)}
                      className={`p-4 rounded-xl font-bold transition-all ${
                        wordCount === count
                          ? "bg-violet-500 text-white shadow-lg"
                          : "bg-white/10 text-gray-300 hover:bg-white/20"
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-lg font-semibold text-white mb-4">
                  Display Mode
                </label>
                <div className="space-y-3">
                  {[
                    {
                      key: "flow",
                      icon: Scroll,
                      label: "Auto Flow",
                      desc: "Words advance automatically",
                    },
                    {
                      key: "pages",
                      icon: Eye,
                      label: "Manual Pages",
                      desc: "Control your own pace",
                    },
                    {
                      key: "grid",
                      icon: Grid3X3,
                      label: "All Words",
                      desc: "See everything at once",
                    },
                  ].map(({ key, icon: Icon, label, desc }) => (
                    <button
                      key={key}
                      onClick={() => setDisplayMode(key)}
                      className={`w-full p-4 rounded-xl border-2 transition-all ${
                        displayMode === key
                          ? "border-violet-400 bg-violet-400/20"
                          : "border-white/20 bg-white/5 hover:border-violet-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="text-violet-400" size={24} />
                        <div className="text-left">
                          <div className="font-bold text-white">{label}</div>
                          <div className="text-sm text-gray-300">{desc}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary & Start */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Award className="text-emerald-400" size={28} />
                Ready to Start
              </h3>

              <div className="space-y-4 mb-8">
                <div className="bg-white/5 rounded-2xl p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400">Level</div>
                      <div className="font-bold text-white">
                        Class {classGroup}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400">Words</div>
                      <div className="font-bold text-white">{wordCount}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Est. Time</div>
                      <div className="font-bold text-white">
                        {Math.round(wordCount * getTimePerWord())}s
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400">Mode</div>
                      <div className="font-bold text-white capitalize">
                        {displayMode}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl p-4 border border-emerald-400/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Mic className="text-emerald-400" size={20} />
                    <span className="font-semibold text-white">
                      Voice Recognition
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">
                    Use the microphone to track your reading progress and get
                    detailed analytics!
                  </p>
                </div>
              </div>

              <button
                onClick={handleStart}
                className="w-full bg-gradient-to-r from-pink-500 to-violet-600 text-white py-6 rounded-2xl font-black text-xl hover:from-pink-600 hover:to-violet-700 transition-all shadow-2xl hover:shadow-pink-500/25 flex items-center justify-center gap-3 group"
              >
                <Play
                  className="group-hover:scale-110 transition-transform"
                  size={28}
                />
                Start Challenge
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CHALLENGE PHASE
  if (phase === "challenge") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
        {/* Control Header */}
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
            <div className="flex items-center justify-between flex-wrap gap-4">
              {/* Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePause}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg"
                >
                  {isPaused ? <Play size={24} /> : <Pause size={24} />}
                </button>
                <button
                  onClick={handleReset}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 text-white p-3 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all shadow-lg"
                >
                  <RotateCcw size={24} />
                </button>
                <button
                  onClick={toggleRecording}
                  className={`p-3 rounded-xl transition-all shadow-lg ${
                    isRecording
                      ? "bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse"
                      : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600"
                  }`}
                >
                  {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
                </button>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-white">
                <div className="flex items-center gap-2">
                  <BookOpen size={20} className="text-blue-400" />
                  <span className="font-bold">
                    {Math.min(currentWordIndex + 1, currentWords.length)} /{" "}
                    {wordCount}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={20} className="text-green-400" />
                  <span className="font-bold">{timeElapsed.toFixed(1)}s</span>
                </div>
                {isRecording && (
                  <div className="flex items-center gap-2">
                    <Volume2 size={20} className="text-red-400" />
                    <span className="font-bold">
                      {recognizedWords.length} recognized
                    </span>
                  </div>
                )}
              </div>

              {/* Manual controls for pages mode */}
              {displayMode === "pages" && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevWord}
                    disabled={currentWordIndex === 0}
                    className="px-4 py-2 bg-white/20 text-white rounded-lg disabled:opacity-50 hover:bg-white/30 transition-all"
                  >
                    Previous
                  </button>
                  <button
                    onClick={nextWord}
                    disabled={currentWordIndex >= currentWords.length - 1}
                    className="px-4 py-2 bg-white/20 text-white rounded-lg disabled:opacity-50 hover:bg-white/30 transition-all"
                  >
                    Next
                  </button>
                  {/* Add Submit button when on last word */}
                  {currentWordIndex >= currentWords.length - 1 && (
                    <button
                      onClick={() => setPhase("results")}
                      className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all font-bold ml-2"
                    >
                      Submit
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="bg-white/10 rounded-full h-4 backdrop-blur-sm border border-white/20 overflow-hidden">
            <div
              className="bg-gradient-to-r from-pink-500 to-violet-500 h-full transition-all duration-500 ease-out shadow-lg"
              style={{
                width: `${
                  (Math.min(currentWordIndex + 1, currentWords.length) /
                    currentWords.length) *
                  100
                }%`,
              }}
            />
          </div>
        </div>

        {/* Word Display */}
        <div className="max-w-7xl mx-auto">
          {displayMode === "flow" && (
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-12 min-h-[600px] flex items-center justify-center">
              {currentWordIndex < currentWords.length && (
                <div
                  className={`${getFontClass()} font-black text-center transition-all duration-300`}
                >
                  <div className="bg-gradient-to-r from-pink-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                    {currentWords[currentWordIndex]}
                  </div>
                </div>
              )}
            </div>
          )}

          {displayMode === "pages" && (
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-12 min-h-[600px] flex items-center justify-center">
              {currentWordIndex < currentWords.length && (
                <div className={`${getFontClass()} font-black text-center`}>
                  <div className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {currentWords[currentWordIndex]}
                  </div>
                </div>
              )}
            </div>
          )}

          {displayMode === "grid" && (
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-8 min-h-[600px]">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {currentWords.map((word, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 text-center ${
                      index === currentWordIndex
                        ? "border-pink-400 bg-pink-400/20 scale-105 shadow-lg shadow-pink-400/25"
                        : index < currentWordIndex
                        ? "border-green-400/50 bg-green-400/10 text-green-300"
                        : "border-white/20 bg-white/5 text-white"
                    }`}
                  >
                    <div
                      className={`font-bold ${
                        classGroup === "I-II"
                          ? "text-2xl"
                          : classGroup === "III-V"
                          ? "text-xl"
                          : "text-lg"
                      }`}
                    >
                      {word}
                    </div>
                    {recognizedWords.some(
                      (rw) => rw.word === word.toLowerCase()
                    ) && (
                      <div className="text-xs text-green-400 mt-2">
                        ✓ Recognized
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/* Add Submit button for grid mode */}
              <div className="mt-8 text-center">
                <button
                  onClick={() => setPhase("results")}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-2xl font-bold text-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-2xl flex items-center gap-3 mx-auto"
                >
                  <Award size={24} />
                  Complete Challenge
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pause Overlay */}
        {isPaused && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 text-center border border-white/20 max-w-md">
              <Pause className="mx-auto text-blue-400 mb-6" size={64} />
              <h3 className="text-3xl font-bold text-white mb-4">
                Challenge Paused
              </h3>
              <p className="text-gray-300 mb-8 text-lg">
                Take your time, then continue when ready
              </p>
              <button
                onClick={handlePause}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center gap-3 mx-auto shadow-2xl"
              >
                <Play size={24} />
                Resume Challenge
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // RESULTS PHASE
  if (phase === "results") {
    const accuracy = getAccuracy();
    const wpm = getWPM();
    const completionRate = Math.round(
      (Math.min(currentWordIndex, currentWords.length) / currentWords.length) *
        100
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="text-8xl mb-6">🎉</div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              Challenge Complete!
            </h1>
            <p className="text-xl text-gray-300">
              Here's your detailed performance analysis
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Performance Metrics */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Award className="text-emerald-400" size={28} />
                Performance Metrics
              </h3>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl p-6 border border-emerald-400/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-emerald-300 font-semibold">
                      Completion Rate
                    </span>
                    <span className="text-3xl font-black text-white">
                      {completionRate}%
                    </span>
                  </div>
                  <div className="bg-white/10 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-emerald-400 to-teal-400 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 border border-blue-400/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-300 font-semibold">
                      Reading Speed
                    </span>
                    <span className="text-3xl font-black text-white">
                      {wpm} WPM
                    </span>
                  </div>
                  <div className="text-sm text-gray-300">
                    {wpm > 200
                      ? "Excellent!"
                      : wpm > 150
                      ? "Great!"
                      : wpm > 100
                      ? "Good!"
                      : "Keep practicing!"}
                  </div>
                </div>
                {recognizedWords.length > 0 && (
                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-400/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-purple-300 font-semibold">
                        Voice Accuracy
                      </span>
                      <span className="text-3xl font-black text-white">
                        {accuracy}%
                      </span>
                    </div>
                    <div className="text-sm text-gray-300">
                      {recognizedWords.length} words recognized
                    </div>
                  </div>
                )}
                )}
                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border border-yellow-400/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-yellow-300 font-semibold">
                      Total Time
                    </span>
                    <span className="text-3xl font-black text-white">
                      {timeElapsed.toFixed(1)}s
                    </span>
                  </div>
                  <div className="text-sm text-gray-300">
                    Average:{" "}
                    {(timeElapsed / Math.max(currentWordIndex, 1)).toFixed(1)}s
                    per word
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Analysis */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Target className="text-cyan-400" size={28} />
                Detailed Analysis
              </h3>

              <div className="space-y-6">
                <div className="bg-white/5 rounded-2xl p-6">
                  <h4 className="font-bold text-white mb-4">
                    Challenge Summary
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400">Level</div>
                      <div className="font-bold text-white">
                        Class {classGroup}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400">Words Read</div>
                      <div className="font-bold text-white">
                        {Math.min(currentWordIndex, currentWords.length)} /{" "}
                        {wordCount}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400">Display Mode</div>
                      <div className="font-bold text-white capitalize">
                        {displayMode}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400">Voice Used</div>
                      <div className="font-bold text-white">
                        {recognizedWords.length > 0 ? "Yes" : "No"}
                      </div>
                    </div>
                  </div>
                </div>

                {recognizedWords.length > 0 && (
                  <div className="bg-white/5 rounded-2xl p-6">
                    <h4 className="font-bold text-white mb-4">
                      Voice Recognition Details
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Words Recognized:</span>
                        <span className="font-bold text-white">
                          {recognizedWords.length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Recognition Rate:</span>
                        <span className="font-bold text-white">
                          {Math.round(
                            (recognizedWords.length /
                              Math.max(currentWordIndex, 1)) *
                              100
                          )}
                          %
                        </span>
                      </div>
                      <div className="text-sm text-gray-400 mt-4">
                        <div className="mb-2">Recognized words:</div>
                        <div className="flex flex-wrap gap-2">
                          {recognizedWords.slice(0, 10).map((word, index) => (
                            <span
                              key={index}
                              className="bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded text-xs"
                            >
                              {word}
                            </span>
                          ))}
                          {recognizedWords.length > 10 && (
                            <span className="text-gray-400 text-xs">
                              +{recognizedWords.length - 10} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl p-6 border border-indigo-400/30">
                  <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Award className="text-indigo-400" size={20} />
                    Performance Rating
                  </h4>
                  <div className="text-center">
                    <div className="text-6xl mb-4">
                      {completionRate === 100 && wpm > 150
                        ? "🏆"
                        : completionRate === 100 && wpm > 100
                        ? "🥇"
                        : completionRate >= 80
                        ? "🥈"
                        : completionRate >= 60
                        ? "🥉"
                        : "⭐"}
                    </div>
                    <div className="text-2xl font-bold text-white mb-2">
                      {completionRate === 100 && wpm > 150
                        ? "Outstanding!"
                        : completionRate === 100 && wpm > 100
                        ? "Excellent!"
                        : completionRate >= 80
                        ? "Great Job!"
                        : completionRate >= 60
                        ? "Good Effort!"
                        : "Keep Practicing!"}
                    </div>
                    <div className="text-sm text-gray-300">
                      {completionRate === 100 && wpm > 150
                        ? "You're a reading superstar!"
                        : completionRate === 100 && wpm > 100
                        ? "Fantastic reading speed and accuracy!"
                        : completionRate >= 80
                        ? "You're making excellent progress!"
                        : completionRate >= 60
                        ? "Good work, keep improving!"
                        : "Practice makes perfect!"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <button
              onClick={handleReset}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-6 rounded-2xl font-bold text-xl hover:from-blue-600 hover:to-cyan-600 transition-all shadow-2xl flex items-center justify-center gap-3 group"
            >
              <RotateCcw
                className="group-hover:rotate-180 transition-transform duration-500"
                size={28}
              />
              Try Again
            </button>
            <button
              onClick={() => {
                setPhase("setup");
                setCurrentWordIndex(0);
                setTimeElapsed(0);
                setRecognizedWords([]);
                setIsPaused(false);
                setIsListening(false);
                setIsRecording(false);
                startTimeRef.current = null;
              }}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-6 rounded-2xl font-bold text-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-2xl flex items-center justify-center gap-3 group"
            >
              <Target
                className="group-hover:scale-110 transition-transform"
                size={28}
              />
              New Challenge
            </button>
          </div>

          {/* Tips for Improvement */}
          <div className="mt-12 bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              💡 Tips for Improvement
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-4">👀</div>
                <h4 className="font-bold text-white mb-2">Focus Your Eyes</h4>
                <p className="text-sm text-gray-300">
                  Keep your eyes centered on each word. Avoid moving your head.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🧘</div>
                <h4 className="font-bold text-white mb-2">Stay Relaxed</h4>
                <p className="text-sm text-gray-300">
                  Take deep breaths and maintain a comfortable reading pace.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🔄</div>
                <h4 className="font-bold text-white mb-2">Practice Daily</h4>
                <p className="text-sm text-gray-300">
                  Regular practice will improve your reading speed and
                  comprehension.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default WordReadingChallenge;
