import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
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
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Trophy,
  BarChart3,
} from "lucide-react";

// Consolidated game state
const createInitialState = () => ({
  phase: "setup",
  classGroup: "III-V", // Default to intermediate level
  wordCount: 25, // Default word count
  displayMode: "grid", // Default to grid mode
  currentWordIndex: 0,
  timeElapsed: 0,
  isPaused: false,
  isCompleted: false,
  recognizedWords: [],
});

// Speech recognition state
const createSpeechState = () => ({
  isRecording: false,
  isListening: false,
  recognizedWords: [],
  error: null,
  isSupported: false,
});

// Word collections (moved to separate object for better organization)
const WORD_COLLECTIONS = {
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
    timePerWord: 4,
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
    timePerWord: 2.5,
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
    timePerWord: 1.8,
  },
};

// Custom hook for speech recognition
const useSpeechRecognition = (isEnabled, onResult, onError) => {
  const [speechState, setSpeechState] = useState(createSpeechState);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechState((prev) => ({
        ...prev,
        isSupported: false,
        error: "Speech recognition not supported",
      }));
      return;
    }

    setSpeechState((prev) => ({ ...prev, isSupported: true }));

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ")
        .toLowerCase()
        .trim();

      if (transcript && onResult) {
        onResult(transcript);
      }
    };

    recognition.onerror = (event) => {
      const errorMessage = `Speech recognition error: ${event.error}`;
      setSpeechState((prev) => ({
        ...prev,
        error: errorMessage,
        isListening: false,
        isRecording: false,
      }));
      if (onError) onError(errorMessage);
    };

    recognition.onend = () => {
      setSpeechState((prev) => ({ ...prev, isListening: false }));
    };

    recognition.onstart = () => {
      setSpeechState((prev) => ({ ...prev, isListening: true, error: null }));
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, [onResult, onError]);

  const startRecognition = useCallback(() => {
    if (!speechState.isSupported || !recognitionRef.current || !isEnabled)
      return;

    try {
      recognitionRef.current.start();
      setSpeechState((prev) => ({ ...prev, isRecording: true, error: null }));
    } catch (error) {
      setSpeechState((prev) => ({ ...prev, error: error.message }));
    }
  }, [speechState.isSupported, isEnabled]);

  const stopRecognition = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setSpeechState((prev) => ({
        ...prev,
        isRecording: false,
        isListening: false,
      }));
    }
  }, []);

  const toggleRecognition = useCallback(() => {
    if (speechState.isRecording) {
      stopRecognition();
    } else {
      startRecognition();
    }
  }, [speechState.isRecording, startRecognition, stopRecognition]);

  return {
    ...speechState,
    startRecognition,
    stopRecognition,
    toggleRecognition,
  };
};

// Custom hook for game timer
const useGameTimer = (isActive, onTick) => {
  const startTimeRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
      }

      intervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        if (onTick) onTick(elapsed);
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, onTick]);

  const resetTimer = useCallback(() => {
    startTimeRef.current = null;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  return { resetTimer };
};

// Component for class selection
const ClassSelector = ({ classGroup, onClassChange }) => (
  <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
      <Target className="text-pink-400" size={28} />
      Class Level
    </h3>
    <div className="space-y-4">
      {Object.entries(WORD_COLLECTIONS).map(([key, data]) => (
        <button
          key={key}
          onClick={() => onClassChange(key)}
          className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 ${
            classGroup === key
              ? "border-pink-400 bg-pink-400/20 shadow-lg shadow-pink-400/25"
              : "border-white/20 bg-white/5 hover:border-pink-300 hover:bg-white/10"
          }`}
          aria-pressed={classGroup === key}
        >
          <div className="flex items-center gap-4">
            <span
              className="text-3xl"
              role="img"
              aria-label={`${data.theme} emoji`}
            >
              {data.emoji}
            </span>
            <div className="text-left">
              <div className="text-xl font-bold text-white">Class {key}</div>
              <div className="text-sm text-gray-300">{data.theme}</div>
              <div className="text-xs text-pink-300">
                {data.timePerWord}s per word
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  </div>
);

// Component for challenge setup
const ChallengeSetup = ({
  wordCount,
  displayMode,
  onWordCountChange,
  onDisplayModeChange,
}) => (
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
            onClick={() => onWordCountChange(count)}
            className={`p-4 rounded-xl font-bold transition-all ${
              wordCount === count
                ? "bg-violet-500 text-white shadow-lg"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
            aria-pressed={wordCount === count}
          >
            {count}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 mt-3">
        {[50, 100].map((count) => (
          <button
            key={count}
            onClick={() => onWordCountChange(count)}
            className={`p-4 rounded-xl font-bold transition-all ${
              wordCount === count
                ? "bg-violet-500 text-white shadow-lg"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
            aria-pressed={wordCount === count}
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
            onClick={() => onDisplayModeChange(key)}
            className={`w-full p-4 rounded-xl border-2 transition-all ${
              displayMode === key
                ? "border-violet-400 bg-violet-400/20"
                : "border-white/20 bg-white/5 hover:border-violet-300"
            }`}
            aria-pressed={displayMode === key}
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
);

// Component for game controls
const GameControls = ({
  isPaused,
  isRecording,
  speechError,
  onPause,
  onReset,
  onToggleRecording,
  stats,
}) => (
  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onPause}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg"
          aria-label={isPaused ? "Resume challenge" : "Pause challenge"}
        >
          {isPaused ? <Play size={24} /> : <Pause size={24} />}
        </button>
        <button
          onClick={onReset}
          className="bg-gradient-to-r from-gray-500 to-gray-600 text-white p-3 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all shadow-lg"
          aria-label="Reset challenge"
        >
          <RotateCcw size={24} />
        </button>
        <button
          onClick={onToggleRecording}
          className={`p-3 rounded-xl transition-all shadow-lg ${
            isRecording
              ? "bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse"
              : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600"
          }`}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
          {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
        </button>
        {speechError && (
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle size={16} />
            <span>Mic error</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6 text-white">
        <div className="flex items-center gap-2">
          <BookOpen size={20} className="text-blue-400" />
          <span className="font-bold">{stats.progress}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={20} className="text-green-400" />
          <span className="font-bold">{stats.time}</span>
        </div>
        {isRecording && (
          <div className="flex items-center gap-2">
            <Volume2 size={20} className="text-red-400" />
            <span className="font-bold">{stats.recognized} recognized</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

// Main component
const WordReadingChallenge = () => {
  const [gameState, setGameState] = useState(createInitialState);
  const [recognizedWords, setRecognizedWords] = useState([]);

  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [permissionError, setPermissionError] = useState(null);

  const micStatusLabel = isListening ? "🎤 Listening..." : "🛑 Not listening";

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("❌ SpeechRecognition not supported in this browser.");
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        alert("🎙️ Mic started");
      };

      recognitionRef.current.onresult = (event) => {
        const result = event.results[event.results.length - 1];
        if (result.isFinal) {
          const transcript = result[0].transcript.toLowerCase().trim();
          alert(`🎤 Final transcript:\n"${transcript}"`);
          handleSpeechResult(transcript); // ✅ Your existing matching logic
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech error:", event.error);
        alert(`⚠️ Speech error: ${event.error}`);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        alert("🔕 Mic stopped (onend)");
        // Restart for continuous recognition
        if (gameState.phase === "challenge" && !gameState.isPaused) {
          setTimeout(() => {
            startListening(); // ✅ Auto-restart
          }, 600);
        }
      };
    }

    try {
      recognitionRef.current.start();
    } catch (e) {
      console.error("Mic start error:", e);
      alert("❌ Could not start mic");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  useEffect(() => {
    if (gameState.phase === "challenge" && !gameState.isPaused) {
      startListening();
    } else {
      stopListening();
    }
  }, [gameState.phase, gameState.isPaused]);

  // Get current word data
  const currentCollection = WORD_COLLECTIONS[gameState.classGroup];
  const currentWords = useMemo(
    () => currentCollection.words.slice(0, gameState.wordCount),
    [currentCollection.words, gameState.wordCount]
  );

  // Speech recognition handlers
  const handleSpeechResult = useCallback(
    (transcript) => {
      const spokenWord = transcript.toLowerCase().trim();
      const currentWord =
        currentWords[gameState.currentWordIndex]?.toLowerCase();

      if (spokenWord === currentWord) {
        setRecognizedWords((prev) => [
          ...prev,
          {
            word: currentWord,
            position: gameState.currentWordIndex,
            isCorrect: true,
            timestamp: Date.now(),
          },
        ]);

        // Auto-advance to next word
        setTimeout(() => {
          setGameState((prev) => ({
            ...prev,
            currentWordIndex: Math.min(
              prev.currentWordIndex + 1,
              currentWords.length - 1
            ),
          }));
        }, 500);
      }
    },
    [currentWords, gameState.currentWordIndex]
  );

  const handleSpeechError = useCallback((error) => {
    console.error("Speech recognition error:", error);
  }, []);

  // Speech recognition hook
  const speech = useSpeechRecognition(
    gameState.phase === "challenge" && !gameState.isPaused,
    handleSpeechResult,
    handleSpeechError
  );

  // Timer handlers
  const handleTimerTick = useCallback((elapsed) => {
    setGameState((prev) => ({ ...prev, timeElapsed: elapsed }));
  }, []);

  const timer = useGameTimer(
    gameState.phase === "challenge" &&
      !gameState.isPaused &&
      !gameState.isCompleted,
    handleTimerTick
  );

  // Auto-advance for flow mode
  // Modified auto-advance for flow mode - should pause if word is recognized
  useEffect(() => {
    if (
      gameState.phase === "challenge" &&
      !gameState.isPaused &&
      gameState.displayMode === "flow" &&
      gameState.currentWordIndex < currentWords.length &&
      !gameState.isCompleted
    ) {
      // Check if current word is already recognized
      const currentWordRecognized = recognizedWords.some(
        (rw) => rw.position === gameState.currentWordIndex && rw.isCorrect
      );

      if (!currentWordRecognized) {
        const timeout = setTimeout(() => {
          setGameState((prev) => ({
            ...prev,
            currentWordIndex: prev.currentWordIndex + 1,
          }));
        }, currentCollection.timePerWord * 1000);

        return () => clearTimeout(timeout);
      }
    }
  }, [
    gameState.phase,
    gameState.isPaused,
    gameState.currentWordIndex,
    gameState.displayMode,
    gameState.isCompleted,
    currentWords.length,
    currentCollection.timePerWord,
    recognizedWords, // Add this dependency
  ]);

  // Check for completion
  useEffect(() => {
    if (
      gameState.currentWordIndex >= currentWords.length &&
      gameState.phase === "challenge"
    ) {
      setGameState((prev) => ({ ...prev, isCompleted: true }));
      speech.stopRecognition();
      setTimeout(() => {
        setGameState((prev) => ({ ...prev, phase: "results" }));
      }, 1000);
    }
  }, [
    gameState.currentWordIndex,
    currentWords.length,
    gameState.phase,
    speech,
  ]);

  // Game action handlers
  const handleStart = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      phase: "challenge",
      currentWordIndex: 0,
      timeElapsed: 0,
      isPaused: false,
      isCompleted: false,
    }));
    setRecognizedWords([]);
    timer.resetTimer();
  }, [timer]);

  const handlePause = useCallback(() => {
    setGameState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
    if (speech.isRecording) {
      if (gameState.isPaused) {
        speech.startRecognition();
      } else {
        speech.stopRecognition();
      }
    }
  }, [gameState.isPaused, speech]);

  const handleReset = useCallback(() => {
    setGameState(createInitialState());
    setRecognizedWords([]);
    speech.stopRecognition();
    timer.resetTimer();
  }, [speech, timer]);

  const handleComplete = useCallback(() => {
    setGameState((prev) => ({ ...prev, phase: "results", isCompleted: true }));
    speech.stopRecognition();
  }, [speech]);

  // Navigation handlers for manual mode
  const handleNext = useCallback(() => {
    if (gameState.currentWordIndex < currentWords.length - 1) {
      setGameState((prev) => ({
        ...prev,
        currentWordIndex: prev.currentWordIndex + 1,
      }));
    }
  }, [gameState.currentWordIndex, currentWords.length]);

  const handlePrevious = useCallback(() => {
    if (gameState.currentWordIndex > 0) {
      setGameState((prev) => ({
        ...prev,
        currentWordIndex: prev.currentWordIndex - 1,
      }));
    }
  }, [gameState.currentWordIndex]);

  // Stats calculations
  // Update the initial recognition state to include position tracking

  // And update stats calculation to use position-based checking
  const stats = useMemo(() => {
    const progress = `${Math.min(
      gameState.currentWordIndex + 1,
      currentWords.length
    )} / ${gameState.wordCount}`;
    const time = `${gameState.timeElapsed.toFixed(1)}s`;
    const recognizedCount = recognizedWords.filter((rw) => rw.isCorrect).length;
    const wpm =
      gameState.timeElapsed > 0
        ? Math.round((recognizedCount / gameState.timeElapsed) * 60)
        : 0;
    const accuracy =
      gameState.currentWordIndex > 0
        ? Math.round(
            (recognizedWords.filter(
              (rw) => rw.position < gameState.currentWordIndex && rw.isCorrect
            ).length /
              gameState.currentWordIndex) *
              100
          )
        : 100;
    const completionRate = Math.round(
      (Math.min(gameState.currentWordIndex, currentWords.length) /
        currentWords.length) *
        100
    );

    return {
      progress,
      time,
      recognized: recognizedCount,
      wpm,
      accuracy,
      completionRate,
    };
  }, [gameState, currentWords, recognizedWords]);

  // Font size helper
  const getFontClass = useCallback(() => {
    const sizes = {
      "I-II": "text-5xl md:text-7xl lg:text-8xl",
      "III-V": "text-4xl md:text-6xl lg:text-7xl",
      "VI-X": "text-3xl md:text-5xl lg:text-6xl",
    };
    return sizes[gameState.classGroup];
  }, [gameState.classGroup]);

  // SETUP PHASE
  if (gameState.phase === "setup") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-900 via-blue-900 to-indigo-900 p-6">
        <div className="max-w-4xl mx-auto">
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
            <ClassSelector
              classGroup={gameState.classGroup}
              onClassChange={(classGroup) =>
                setGameState((prev) => ({ ...prev, classGroup }))
              }
            />

            <ChallengeSetup
              wordCount={gameState.wordCount}
              displayMode={gameState.displayMode}
              onWordCountChange={(wordCount) =>
                setGameState((prev) => ({ ...prev, wordCount }))
              }
              onDisplayModeChange={(displayMode) =>
                setGameState((prev) => ({ ...prev, displayMode }))
              }
            />

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
                        Class {gameState.classGroup}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400">Words</div>
                      <div className="font-bold text-white">
                        {gameState.wordCount}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400">Est. Time</div>
                      <div className="font-bold text-white">
                        {Math.round(
                          gameState.wordCount * currentCollection.timePerWord
                        )}
                        s
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400">Mode</div>
                      <div className="font-bold text-white capitalize">
                        {gameState.displayMode}
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
                    {speech.isSupported
                      ? "Use the microphone to track your reading progress and get detailed analytics!"
                      : "Speech recognition is not supported in this browser."}
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
  if (gameState.phase === "challenge") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
        <div className="max-w-7xl mx-auto mb-6">
          <GameControls
            isPaused={gameState.isPaused}
            isRecording={speech.isRecording}
            speechError={speech.error}
            onPause={handlePause}
            onReset={handleReset}
            onToggleRecording={speech.toggleRecognition}
            stats={stats}
          />
        </div>

        {/* Progress Bar */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="bg-white/10 rounded-full h-4 backdrop-blur-sm border border-white/20 overflow-hidden">
            <div
              className="bg-gradient-to-r from-pink-500 to-violet-500 h-full transition-all duration-500 ease-out shadow-lg"
              style={{
                width: `${
                  (Math.min(
                    gameState.currentWordIndex + 1,
                    currentWords.length
                  ) /
                    currentWords.length) *
                  100
                }%`,
              }}
              role="progressbar"
              aria-valuenow={Math.min(
                gameState.currentWordIndex + 1,
                currentWords.length
              )}
              aria-valuemax={currentWords.length}
            />
          </div>
        </div>

        {/* Word Display */}
        <div className="max-w-7xl mx-auto">
          {gameState.displayMode === "flow" && (
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-12 min-h-[600px] flex items-center justify-center">
              {gameState.currentWordIndex < currentWords.length && (
                <div
                  className={`${getFontClass()} font-black text-center transition-all duration-300`}
                >
                  <div className="bg-gradient-to-r from-pink-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                    {currentWords[gameState.currentWordIndex]}
                  </div>
                </div>
              )}
            </div>
          )}

          {gameState.displayMode === "pages" && (
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-12 min-h-[600px]">
              <div className="flex items-center justify-center min-h-[400px]">
                {gameState.currentWordIndex < currentWords.length && (
                  <div className={`${getFontClass()} font-black text-center`}>
                    <div className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {currentWords[gameState.currentWordIndex]}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handlePrevious}
                  disabled={gameState.currentWordIndex === 0}
                  className="px-6 py-3 bg-white/20 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30 transition-all flex items-center gap-2"
                >
                  <ChevronLeft size={20} />
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={
                    gameState.currentWordIndex >= currentWords.length - 1
                  }
                  className="px-6 py-3 bg-white/20 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30 transition-all flex items-center gap-2"
                >
                  Next
                  <ChevronRight size={20} />
                </button>
                <button
                  onClick={handleComplete}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center gap-2"
                >
                  <Trophy size={20} />
                  Complete
                </button>
              </div>
            </div>
          )}

          {gameState.displayMode === "grid" && (
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {currentWords.map((word, index) => {
                  const isRecognized = recognizedWords.some(
                    (rw) => rw.position === index && rw.isCorrect
                  );
                  const isCurrent = index === gameState.currentWordIndex;

                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-xl text-center font-bold transition-all duration-300 ${
                        isRecognized
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                          : isCurrent
                          ? "bg-gradient-to-r from-pink-500 to-violet-500 text-white scale-105 shadow-lg ring-4 ring-white/50"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      <div className="text-lg md:text-xl">{word}</div>
                      {isRecognized && (
                        <div className="text-xs mt-1 text-emerald-200">
                          ✓ Recognized
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 text-center">
                <button
                  onClick={handleComplete}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all font-bold text-lg flex items-center gap-3 mx-auto"
                >
                  <Trophy size={24} />
                  Complete Challenge
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pause Overlay */}
        {gameState.isPaused && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20 text-center">
              <Pause className="mx-auto mb-6 text-blue-400" size={64} />
              <h2 className="text-4xl font-bold text-white mb-4">Paused</h2>
              <p className="text-xl text-gray-300 mb-8">
                Press play to continue your challenge
              </p>
              <button
                onClick={handlePause}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg flex items-center gap-3 mx-auto"
              >
                <Play size={24} />
                Resume
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // RESULTS PHASE
  if (gameState.phase === "results") {
    const finalStats = {
      ...stats,
      totalTime: gameState.timeElapsed,
      wordsPerMinute:
        gameState.timeElapsed > 0
          ? Math.round((currentWords.length / gameState.timeElapsed) * 60)
          : 0,
      recognizedCount: recognizedWords.length,
      totalWords: currentWords.length,
      recognitionAccuracy:
        recognizedWords.length > 0
          ? Math.round(
              (recognizedWords.filter((word) =>
                currentWords.map((w) => w.toLowerCase()).includes(word.word)
              ).length /
                recognizedWords.length) *
                100
            )
          : 0,
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mb-8 shadow-2xl">
              <Trophy className="text-white" size={64} />
            </div>
            <h1 className="text-6xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-4">
              Challenge Complete!
            </h1>
            <p className="text-2xl text-gray-300 font-medium">
              Excellent work on your reading challenge
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Performance Metrics */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <BarChart3 className="text-emerald-400" size={28} />
                Performance Metrics
              </h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                  <span className="text-gray-300">Total Time</span>
                  <span className="text-2xl font-bold text-white">
                    {finalStats.totalTime.toFixed(1)}s
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                  <span className="text-gray-300">Words Per Minute</span>
                  <span className="text-2xl font-bold text-emerald-400">
                    {finalStats.wordsPerMinute}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                  <span className="text-gray-300">Words Read</span>
                  <span className="text-2xl font-bold text-white">
                    {finalStats.totalWords}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                  <span className="text-gray-300">Completion Rate</span>
                  <span className="text-2xl font-bold text-teal-400">100%</span>
                </div>
              </div>
            </div>

            {/* Voice Recognition Stats */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Mic className="text-purple-400" size={28} />
                Voice Recognition
              </h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                  <span className="text-gray-300">Words Recognized</span>
                  <span className="text-2xl font-bold text-white">
                    {finalStats.recognizedCount}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                  <span className="text-gray-300">Recognition Accuracy</span>
                  <span className="text-2xl font-bold text-purple-400">
                    {finalStats.recognitionAccuracy}%
                  </span>
                </div>
                <div className="text-center mt-6">
                  <div className="text-sm text-gray-400 mb-2">
                    Recognition Performance
                  </div>
                  <div className="bg-gray-700 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-1000"
                      style={{ width: `${finalStats.recognitionAccuracy}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Level */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Performance Level
            </h3>
            <div className="text-center">
              {finalStats.wordsPerMinute >= 200 && (
                <div className="text-6xl mb-4">🏆</div>
              )}
              {finalStats.wordsPerMinute >= 150 &&
                finalStats.wordsPerMinute < 200 && (
                  <div className="text-6xl mb-4">🥇</div>
                )}
              {finalStats.wordsPerMinute >= 100 &&
                finalStats.wordsPerMinute < 150 && (
                  <div className="text-6xl mb-4">🥈</div>
                )}
              {finalStats.wordsPerMinute < 100 && (
                <div className="text-6xl mb-4">🥉</div>
              )}

              <div className="text-3xl font-bold text-white mb-2">
                {finalStats.wordsPerMinute >= 200 && "Reading Master!"}
                {finalStats.wordsPerMinute >= 150 &&
                  finalStats.wordsPerMinute < 200 &&
                  "Excellent Reader!"}
                {finalStats.wordsPerMinute >= 100 &&
                  finalStats.wordsPerMinute < 150 &&
                  "Good Reader!"}
                {finalStats.wordsPerMinute < 100 && "Keep Practicing!"}
              </div>
              <p className="text-gray-300">
                {finalStats.wordsPerMinute >= 200 &&
                  "Outstanding speed and comprehension!"}
                {finalStats.wordsPerMinute >= 150 &&
                  finalStats.wordsPerMinute < 200 &&
                  "Great reading speed with good accuracy!"}
                {finalStats.wordsPerMinute >= 100 &&
                  finalStats.wordsPerMinute < 150 &&
                  "Solid reading performance!"}
                {finalStats.wordsPerMinute < 100 &&
                  "Practice makes perfect - try again!"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleReset}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg flex items-center gap-3"
            >
              <RotateCcw size={24} />
              Try Again
            </button>
            <button
              onClick={() => setGameState(createInitialState())}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg flex items-center gap-3"
            >
              <Target size={24} />
              New Challenge
            </button>
          </div>
        </div>
        <style jsx>{`
          .current-word-focus {
            transform: scale(1.05);
            box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.5);
          }
        `}</style>
      </div>
    );
  }

  return null;
};

export default WordReadingChallenge;
