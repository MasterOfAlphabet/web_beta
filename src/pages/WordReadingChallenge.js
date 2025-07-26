import { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
  CheckCircle,
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
});

// Word collections
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
    timePerWord: 5,
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

// Custom hook for speech recognition with continuous listening
const useSpeechRecognition = (isEnabled, onResult, onError) => {
  const [state, setState] = useState({
    isSupported: true,
    isRecording: false,
    error: null,
    isProcessing: false,
  });

  const recognitionRef = useRef(null);
  const isMountedRef = useRef(true);
  const isStartingRef = useRef(false);
  const isStoppingRef = useRef(false);

  const stopRecognition = useCallback(() => {
    if (!recognitionRef.current || !state.isRecording || isStoppingRef.current)
      return;

    isStoppingRef.current = true;
    setState((prev) => ({ ...prev, isProcessing: true }));

    return new Promise((resolve) => {
      try {
        recognitionRef.current.stop();

        const timeout = setTimeout(() => {
          setState((prev) => ({
            ...prev,
            isRecording: false,
            isProcessing: false,
          }));
          isStoppingRef.current = false;
          resolve();
        }, 500);
      } catch (e) {
        console.warn("Error stopping recognition:", e);
        setState((prev) => ({
          ...prev,
          isRecording: false,
          isProcessing: false,
        }));
        isStoppingRef.current = false;
        resolve();
      }
    });
  }, [state.isRecording]);

  const startRecognition = useCallback(() => {
    if (!recognitionRef.current) return;

    if (state.isRecording) {
      console.log("Already recording — skip start.");
      return;
    }

    if (isStartingRef.current) {
      console.log("Already starting — skip start.");
      return;
    }

    isStartingRef.current = true;
    setState((prev) => ({ ...prev, isProcessing: true }));

    try {
      recognitionRef.current.start();
      // onstart event will handle setting isRecording true
    } catch (error) {
      console.error("Failed to start recognition:", error);
      setState((prev) => ({
        ...prev,
        error: error.message,
        isRecording: false,
        isProcessing: false,
      }));
      isStartingRef.current = false;
    }
  }, [state.isRecording]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setState((prev) => ({
        ...prev,
        isSupported: false,
        error: "Speech recognition not supported",
      }));
      return; // ✅ this returns from useEffect's body, NOT the cleanup
    }

    if (!recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";
      recognition.maxAlternatives = 1;

recognition.onresult = (event) => {
  if (!isMountedRef.current) return;

  const result = event.results[event.results.length - 1];
  if (result.isFinal) {
    const transcript = result[0].transcript.toLowerCase().trim();

    // ✅ ALERT for Android debugging
    alert(`🎤 Speech captured:\n"${transcript}"`);

    console.log("Speech result:", transcript);

    if (transcript && onResult) {
      onResult(transcript); // Calls handleSpeechResult
    }

    recognition.stop(); // ✅ Force flush (especially for Android)
  }
};

recognition.onend = () => {
  
    alert("onend fired");

  if (!isMountedRef.current) return;
  console.log("🎙️ Recognition ended");

  setState((prev) => ({
    ...prev,
    isRecording: false,
  }));

  // ✅ RESTART only if enabled
  if (isEnabled && !isStoppingRef.current) {
    console.log("🔁 Restarting recognition...");
    setTimeout(() => {
      if (isMountedRef.current && !isStoppingRef.current) {
        startRecognition();
      }
    }, 300); // slight delay before restart
  }
};
      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        if (event.error !== "aborted") {
          setState((prev) => ({
            ...prev,
            error: `Error: ${event.error}`,
          }));
          if (onError) onError(event.error);
        }
      };

      recognitionRef.current = recognition;
    }

    if (isEnabled) {
      startRecognition();
    }

    // ✅ This cleanup must be INSIDE useEffect, not outside
    return () => {
      isMountedRef.current = false;
      if (recognitionRef.current && state.isRecording) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.warn("Cleanup stop error:", e);
        }
      }
    };
  }, [
    isEnabled,
    onResult,
    onError,
    startRecognition,
    stopRecognition,
    state.isRecording, // include if used inside effect
  ]);

  return {
    ...state,
    startRecognition,
    stopRecognition,
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

// Helper function to get word status
const getWordStatus = (wordIndex, currentWordIndex, recognizedWords) => {
  if (wordIndex === currentWordIndex) {
    return "current";
  } else if (recognizedWords.some((w) => w.position === wordIndex)) {
    return "recognized";
  } else if (wordIndex < currentWordIndex) {
    return "skipped";
  } else {
    return "pending";
  }
};

// Word Display Component
const WordDisplay = ({ word, index, status, isLastRecognized }) => {
  const getWordClasses = () => {
    const baseClasses =
      "p-4 rounded-xl font-bold text-lg transition-all duration-300 border-2";

    switch (status) {
      case "current":
        return `${baseClasses} bg-blue-500 text-white border-blue-300 ring-4 ring-blue-300 animate-pulse shadow-lg`;
      case "recognized":
        return `${baseClasses} bg-green-500 text-white border-green-400 shadow-lg`;
      case "skipped":
        return `${baseClasses} bg-gray-400 text-gray-700 border-gray-500`;
      default:
        return `${baseClasses} bg-white/10 text-gray-300 border-white/20`;
    }
  };

  return (
    <div
      className={`${getWordClasses()} ${
        isLastRecognized ? "animate-bounce" : ""
      }`}
    >
      <div className="text-center">
        {word}
        {status === "current" && (
          <div className="flex items-center justify-center mt-2">
            <Mic className="text-white animate-pulse" size={16} />
          </div>
        )}
        {status === "recognized" && (
          <div className="flex items-center justify-center mt-2">
            <CheckCircle className="text-white" size={16} />
          </div>
        )}
      </div>
    </div>
  );
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
  speechState,
  onPause,
  onReset,
  onToggleRecording,
  stats,
  isMicActive,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleMicClick = useCallback(async () => {
    if (speechState.isProcessing) return;

    setIsAnimating(true);
    try {
      await onToggleRecording();
    } catch (error) {
      console.error("Mic toggle error:", error);
    } finally {
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [onToggleRecording, speechState.isProcessing]);

  return (
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
            disabled
            className={`p-3 rounded-xl transition-all duration-300 shadow-lg cursor-default ${
              speechState.isRecording
                ? "bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse ring-4 ring-red-300"
                : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
            }`}
            aria-label={
              speechState.isRecording ? "Listening..." : "Not listening"
            }
          >
            {speechState.isRecording ? (
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <Mic size={24} />
              </div>
            ) : (
              <MicOff size={24} />
            )}
          </button>

          {speechState.error && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle size={16} />
              <span>{speechState.error}</span>
            </div>
          )}

          {!speechState.isSupported && (
            <div className="flex items-center gap-2 text-yellow-400 text-sm">
              <AlertCircle size={16} />
              <span>Mic not supported</span>
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
          <div className="flex items-center gap-2">
            <CheckCircle size={20} className="text-purple-400" />
            <span className="font-bold">{stats.recognized} recognized</span>
          </div>
          <div className="flex items-center gap-2">
            <Target size={20} className="text-orange-400" />
            <span className="font-bold">{stats.accuracy}% accuracy</span>
          </div>
          {speechState.isRecording && (
            <div className="flex items-center gap-2">
              <Volume2 size={20} className="text-red-400 animate-pulse" />
              <span className="font-bold">Listening...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main component
const WordReadingChallenge = () => {
  const [gameState, setGameState] = useState(createInitialState);
  const [recognizedWords, setRecognizedWords] = useState([]);
  const [lastRecognized, setLastRecognized] = useState(null);

  const currentCollection =
    WORD_COLLECTIONS[gameState.classGroup] || WORD_COLLECTIONS["III-V"];
  const currentWords = useMemo(
    () => currentCollection.words.slice(0, gameState.wordCount),
    [currentCollection.words, gameState.wordCount]
  );

  const handleComplete = useCallback(() => {
    setGameState((prev) => ({ ...prev, phase: "results", isCompleted: true }));
  }, []);

 const handleSpeechResult = useCallback(
  (transcript) => {
    // 1️⃣ Alert: Received transcript
    alert(`📤 Speech transcript received:\n"${transcript}"`);
    console.log("🎤 Received transcript:", transcript);

    if (gameState.phase !== "challenge" || gameState.isPaused) {
      console.log("❌ Game not in challenge phase or paused");
      alert("⏸️ Game is paused or not in challenge phase.");
      return;
    }

    if (gameState.currentWordIndex >= currentWords.length) {
      console.log("✅ All words completed");
      alert("✅ All words completed. Finishing game.");
      handleComplete();
      return;
    }

    const currentWord = currentWords[gameState.currentWordIndex]
      ?.toLowerCase()
      .trim();
    const spokenWords = transcript.toLowerCase().trim().split(/\s+/);

    // 2️⃣ Alert: Word index & target word
    alert(
      `🎯 Current Word Index: ${gameState.currentWordIndex}\n` +
      `🔡 Target Word: "${currentWord}"`
    );

    // 3️⃣ Alert: Spoken words array
    alert(`🗣️ Spoken Words:\n${spokenWords.join(", ")}`);

    const hasExactMatch = spokenWords.some((spokenWord) => {
      const cleanSpoken = spokenWord.replace(/[^\w]/g, "").trim();
      const cleanCurrent = currentWord.replace(/[^\w]/g, "").trim();
      const isMatch = cleanSpoken === cleanCurrent;

      if (isMatch) {
        console.log(`✅ Match found: "${cleanSpoken}" === "${cleanCurrent}"`);
      }

      return isMatch;
    });

    // 4️⃣ Final Alert: Match Result
    alert(
      `🔍 Match Result:\n` +
      `👉 Target: "${currentWord}"\n` +
      `👉 Heard: ${spokenWords.join(", ")}\n\n` +
      `${hasExactMatch ? "✅ MATCH CONFIRMED!" : "❌ NO MATCH"}`
    );

    if (hasExactMatch) {
      console.log("🎉 MATCH CONFIRMED! Advancing...");

      setLastRecognized({
        word: currentWord,
        position: gameState.currentWordIndex,
        timestamp: Date.now(),
      });

      setRecognizedWords((prev) => {
        const newWords = [...prev];
        if (
          !newWords.some((w) => w.position === gameState.currentWordIndex)
        ) {
          newWords.push({
            word: currentWord,
            position: gameState.currentWordIndex,
            isCorrect: true,
            timestamp: Date.now(),
          });
        }
        return newWords;
      });

      setTimeout(() => {
        setGameState((prev) => {
          if (prev.currentWordIndex < currentWords.length - 1) {
            return {
              ...prev,
              currentWordIndex: prev.currentWordIndex + 1,
            };
          } else {
            return {
              ...prev,
              isCompleted: true,
            };
          }
        });
      }, 300);
    } else {
      console.log("❌ No match for:", currentWord);
    }
  },
  [currentWords, gameState, handleComplete]
);


  const testExactWordMatch = (spokenWord, targetWord) => {
    const spoken = spokenWord.toLowerCase().replace(/[^\w]/g, "");
    const target = targetWord.toLowerCase().replace(/[^\w]/g, "");
    return spoken === target;
  };

  const handleSpeechError = useCallback((error) => {
    console.error("Speech recognition error:", error);
  }, []);

  // 7. Update the speech recognition enabled condition

  const speech = useSpeechRecognition(
    gameState.phase === "challenge" && !gameState.isPaused,
    handleSpeechResult,
    handleSpeechError
  );

  const timer = useGameTimer(
    gameState.phase === "challenge" &&
      !gameState.isPaused &&
      !gameState.isCompleted,
    useCallback((elapsed) => {
      setGameState((prev) => ({ ...prev, timeElapsed: elapsed }));
    }, [])
  );

  // 4. Fix the pause handler to properly manage mic state
  const handlePause = useCallback(() => {
    setGameState((prev) => ({ ...prev, isPaused: !prev.isPaused }));

    // Don't toggle mic when pausing, let the useEffect handle it based on the enabled condition
  }, []);

  const handleReset = useCallback(() => {
    setGameState(createInitialState());
    setRecognizedWords([]);
    timer.resetTimer();
  }, [timer]);

  // Clear animation after it plays
  useEffect(() => {
    if (lastRecognized) {
      const timer = setTimeout(() => {
        setLastRecognized(null);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [lastRecognized]);

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

    return {
      progress,
      time,
      recognized: recognizedCount,
      wpm,
      accuracy,
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

  const DebugInfo = ({ gameState, currentWords, speechState }) => {
    if (process.env.NODE_ENV !== "development") return null;

    return (
      <div className="fixed bottom-4 left-4 bg-black/80 text-white p-4 rounded-lg text-sm max-w-md">
        <div>Phase: {gameState.phase}</div>
        <div>Paused: {gameState.isPaused.toString()}</div>
        <div>Current Word Index: {gameState.currentWordIndex}</div>
        <div>
          Current Word: {currentWords[gameState.currentWordIndex] || "N/A"}
        </div>

        <div>Speech Recording: {speechState.isRecording.toString()}</div>
        <div>Speech Supported: {speechState.isSupported.toString()}</div>
        {speechState.error && (
          <div className="text-red-400">Error: {speechState.error}</div>
        )}
      </div>
    );
  };

  window.testWordMatch = (spokenWord, targetWord) => {
    const spoken = spokenWord.toLowerCase().replace(/[^\w]/g, "");
    const target = targetWord.toLowerCase().replace(/[^\w]/g, "");

    console.log(`Testing: "${spoken}" vs "${target}"`);

    if (spoken === target) {
      console.log("✅ EXACT MATCH");
      return true;
    } else {
      console.log("❌ NO MATCH");
      return false;
    }
  };

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
            speechState={speech}
            onPause={handlePause}
            onReset={handleReset}
            stats={stats}
          />

          {/* Debug info for development */}
          <DebugInfo
            gameState={gameState}
            currentWords={currentWords}
            speechState={speech}
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
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-12 min-h-[600px] flex flex-col items-center justify-center">
              {gameState.currentWordIndex < currentWords.length && (
                <div
                  className={`${getFontClass()} font-black text-center transition-all duration-300 mb-12`}
                >
                  <div className="bg-gradient-to-r from-pink-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                    {currentWords[gameState.currentWordIndex]}
                  </div>
                </div>
              )}
              <div className="flex items-center justify-center gap-4 w-full">
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
                  const status = getWordStatus(
                    index,
                    gameState.currentWordIndex,
                    recognizedWords
                  );
                  const isLastRecognized = lastRecognized?.position === index;

                  return (
                    <WordDisplay
                      key={index}
                      word={word}
                      index={index}
                      status={status}
                      isLastRecognized={isLastRecognized}
                    />
                  );
                })}
              </div>
              <div className="mt-8 flex items-center justify-center gap-4">
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
              onClick={() => {
                handleStart();
                setRecognizedWords([]);
              }}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg flex items-center gap-3"
            >
              <RotateCcw size={24} />
              Try Again
            </button>
            <button
              onClick={() => {
                setGameState(createInitialState());
                setRecognizedWords([]);
              }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg flex items-center gap-3"
            >
              <Target size={24} />
              New Challenge
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default WordReadingChallenge;
