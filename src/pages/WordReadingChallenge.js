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

// Word equivalence system for US/UK spellings and common mistakes
import { usToUk } from "../data/US2UKWords.js";

const ukToUs = Object.fromEntries(
  Object.entries(usToUk).map(([us, uk]) => [uk, us])
);

function areWordsEquivalent(a, b) {
  a = a.toLowerCase().trim();
  b = b.toLowerCase().trim();

  if (a === b) return true;
  if (usToUk[a] === b) return true;
  if (ukToUs[a] === b) return true;

  // Handle common transcription errors
  const commonMistakes = {
    gray: "grey",
    grey: "gray",
  };

  if (commonMistakes[a] === b || commonMistakes[b] === a) return true;

  return false;
}

// Enhanced word cleaning function
function cleanWord(word) {
  return word
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // Remove punctuation
    .replace(/\s+/g, " ") // Normalize spaces
    .trim();
}

// Consolidated game state
const createInitialState = () => ({
  phase: "setup",
  classGroup: "III-V",
  wordCount: 25,
  displayMode: "grid",
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

// FIXED: More robust useSpeechRecognition hook to prevent rapid beeps
const useSpeechRecognition = (isEnabled, onResult, onError) => {
  const [state, setState] = useState({
    isSupported: true,
    isRecording: false,
    error: null,
    interimTranscript: "",
    finalTranscript: "",
    confidence: 0,
    isFinal: false,
  });

  const recognitionRef = useRef(null);
  const isMountedRef = useRef(true);
  const isEnabledRef = useRef(isEnabled);
  const restartTimeoutRef = useRef(null);
  const isManuallyStoppedRef = useRef(false);

  // Update the ref when isEnabled changes
  useEffect(() => {
    isEnabledRef.current = isEnabled;
    // If disabled, mark as manually stopped to prevent restart
    if (!isEnabled) {
      isManuallyStoppedRef.current = true;
    }
  }, [isEnabled]);

  const startRecognition = useCallback(() => {
    if (!recognitionRef.current) return;

    // Clear any pending restart
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }

    // Don't start if already recording or if disabled
    if (state.isRecording || !isEnabledRef.current) return;

    try {
      // Check the readyState before starting
      if (recognitionRef.current.readyState === "started") {
        console.log("⚠️ Recognition already started, skipping...");
        return;
      }

      console.log("🎤 Starting recognition...");
      isManuallyStoppedRef.current = false;

      setState((prev) => ({
        ...prev,
        isRecording: true,
        error: null,
        interimTranscript: "",
        finalTranscript: "",
        confidence: 0,
        isFinal: false,
      }));

      recognitionRef.current.start();
    } catch (err) {
      console.error("❌ Start recognition error:", err);
      // Only show critical errors, not "already started" errors
      if (!err.message.includes("already started")) {
        setState((prev) => ({
          ...prev,
          error: err.message,
          isRecording: false,
        }));
      }
    }
  }, [state.isRecording]);

  const stopRecognition = useCallback(() => {
    if (recognitionRef.current) {
      try {
        console.log("⏹️ Manually stopping recognition...");
        isManuallyStoppedRef.current = true;

        // Clear any pending restart
        if (restartTimeoutRef.current) {
          clearTimeout(restartTimeoutRef.current);
          restartTimeoutRef.current = null;
        }

        recognitionRef.current.stop();
      } catch (e) {
        console.warn("Stop recognition error:", e);
      }
    }
  }, []);

  // Initialize recognition only once
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setState((prev) => ({
        ...prev,
        isSupported: false,
        error: "Speech recognition not supported",
      }));
      return;
    }

    // Create recognition instance only once
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-GB";
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      if (!isMountedRef.current) return;
      console.log("✅ Recognition started successfully");
      setState((prev) => ({ ...prev, isRecording: true, error: null }));
    };

    recognition.onresult = (event) => {
      if (!isMountedRef.current) return;

      let finalTranscript = "";
      let interim = "";
      let maxConfidence = 0;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        const confidence = event.results[i][0].confidence || 0.8;
        maxConfidence = Math.max(maxConfidence, confidence);

        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interim += transcript + " ";
        }
      }

      // Update state immediately
      setState((prev) => ({
        ...prev,
        interimTranscript: interim.trim(),
        confidence: maxConfidence,
        isFinal: false,
      }));

      // Handle final result
      if (finalTranscript.trim()) {
        const final = finalTranscript.trim();
        console.log(
          "🎯 Final transcript:",
          final,
          "Confidence:",
          maxConfidence
        );

        setState((prev) => ({
          ...prev,
          finalTranscript: final,
          interimTranscript: "",
          confidence: maxConfidence,
          isFinal: true,
        }));

        onResult?.(final, maxConfidence);
      }
    };

    recognition.onend = () => {
      if (!isMountedRef.current) return;
      console.log("⏹️ Recognition ended");

      setState((prev) => ({ ...prev, isRecording: false }));

      // Only restart if:
      // 1. Still enabled
      // 2. Not manually stopped
      // 3. Component is mounted
      // 4. No pending restart already
      if (
        isEnabledRef.current &&
        !isManuallyStoppedRef.current &&
        isMountedRef.current &&
        !restartTimeoutRef.current
      ) {
        console.log("🔄 Scheduling restart in 1.5 seconds...");
        restartTimeoutRef.current = setTimeout(() => {
          restartTimeoutRef.current = null;
          if (
            isEnabledRef.current &&
            !isManuallyStoppedRef.current &&
            isMountedRef.current
          ) {
            startRecognition();
          }
        }, 1500); // 1.5 second delay to prevent rapid restart
      }
    };

    recognition.onerror = (event) => {
      console.error("❌ Speech recognition error:", event.error);

      setState((prev) => ({
        ...prev,
        error: `Error: ${event.error}`,
        isRecording: false,
      }));

      // Don't restart on certain critical errors
      const noRestartErrors = [
        "aborted",
        "not-allowed",
        "service-not-allowed",
        "network",
      ];
      if (noRestartErrors.includes(event.error)) {
        isManuallyStoppedRef.current = true;
      }

      onError?.(event.error);
    };

    recognitionRef.current = recognition;

    // Cleanup function
    return () => {
      console.log("🧹 Cleaning up recognition");
      isMountedRef.current = false;
      isManuallyStoppedRef.current = true;

      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = null;
      }

      if (recognition) {
        try {
          recognition.stop();
        } catch (e) {
          console.warn("Cleanup error:", e);
        }
      }
    };
  }, []); // Empty dependency array - create only once

  // Handle enable/disable - SIMPLIFIED
  useEffect(() => {
    if (isEnabled && !state.isRecording && !isManuallyStoppedRef.current) {
      // Small delay before starting to avoid conflicts
      const startTimeout = setTimeout(() => {
        if (isEnabled && !state.isRecording) {
          startRecognition();
        }
      }, 500);

      return () => clearTimeout(startTimeout);
    } else if (!isEnabled && state.isRecording) {
      stopRecognition();
    }
  }, [isEnabled, state.isRecording, startRecognition, stopRecognition]);

  return {
    ...state,
    startRecognition,
    stopRecognition,
  };
};

// Enhanced Timer Hook
const useEnhancedGameTimer = (isActive, onTick) => {
  const [timeData, setTimeData] = useState({
    totalTime: 0,
    wordTimes: [], // Track time per word
    averageWordTime: 0,
    fastestWord: null,
    slowestWord: null,
  });

  const startTimeRef = useRef(null);
  const wordStartTimeRef = useRef(null);
  const intervalRef = useRef(null);
  const currentWordIndexRef = useRef(0);

  // Start timing for a new word
  const startWordTimer = useCallback((wordIndex) => {
    wordStartTimeRef.current = Date.now();
    currentWordIndexRef.current = wordIndex;
  }, []);

  // End timing for current word
  const endWordTimer = useCallback((word, wasCorrect = true) => {
    if (wordStartTimeRef.current) {
      const wordTime = (Date.now() - wordStartTimeRef.current) / 1000;

      setTimeData((prev) => {
        const newWordTimes = [
          ...prev.wordTimes,
          {
            word,
            time: wordTime,
            index: currentWordIndexRef.current,
            correct: wasCorrect,
            timestamp: Date.now(),
          },
        ];

        const correctWords = newWordTimes.filter((w) => w.correct);
        const averageTime =
          correctWords.length > 0
            ? correctWords.reduce((sum, w) => sum + w.time, 0) /
              correctWords.length
            : 0;

        const fastest = correctWords.reduce(
          (min, w) => (!min || w.time < min.time ? w : min),
          null
        );
        const slowest = correctWords.reduce(
          (max, w) => (!max || w.time > max.time ? w : max),
          null
        );

        return {
          ...prev,
          wordTimes: newWordTimes,
          averageWordTime: averageTime,
          fastestWord: fastest,
          slowestWord: slowest,
        };
      });

      wordStartTimeRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
      }

      intervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        setTimeData((prev) => ({ ...prev, totalTime: elapsed }));
        onTick?.(elapsed);
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
    wordStartTimeRef.current = null;
    currentWordIndexRef.current = 0;
    setTimeData({
      totalTime: 0,
      wordTimes: [],
      averageWordTime: 0,
      fastestWord: null,
      slowestWord: null,
    });
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  return {
    ...timeData,
    resetTimer,
    startWordTimer,
    endWordTimer,
  };
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

// Speech Feedback Component
const SpeechFeedback = ({ speechState, currentWord, lastRecognized }) => {
  // Always render the container to prevent layout shifts
  return (
    <div className="space-y-4 min-h-[120px]">
      {/* LIVE TRANSCRIPT DISPLAY - Shows while speaking */}
      {speechState.interimTranscript && (
        <div className="bg-gradient-to-r from-yellow-500/30 to-orange-500/30 border-2 border-yellow-400/50 px-6 py-4 rounded-2xl shadow-lg animate-pulse">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-2 text-yellow-300">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
              </span>
              <span className="text-sm font-semibold">You're saying:</span>
            </div>
            {speechState.confidence > 0 && (
              <div className="text-xs text-yellow-300 bg-yellow-500/20 px-2 py-1 rounded">
                {Math.round(speechState.confidence * 100)}% confident
              </div>
            )}
          </div>
          <div className="text-white text-2xl font-bold">
            "{speechState.interimTranscript}"
          </div>
        </div>
      )}

      {/* LAST RECOGNIZED WORD - Shows when word is recognized */}
      {lastRecognized && (
        <div className="bg-gradient-to-r from-green-500/30 to-emerald-500/30 border-2 border-green-400/50 px-6 py-4 rounded-2xl shadow-lg animate-bounce">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="text-green-400" size={20} />
            <span className="text-sm font-semibold text-green-300">
              Word Recognized!
            </span>
            <div className="text-xs text-green-300 bg-green-500/20 px-2 py-1 rounded">
              {Math.round((lastRecognized.confidence || 0) * 100)}% match
            </div>
          </div>
          <div className="text-white text-2xl font-bold">
            "{lastRecognized.word}"
          </div>
        </div>
      )}

      {/* LISTENING STATUS - Shows when waiting for speech */}
      {speechState.isRecording &&
        !speechState.interimTranscript &&
        !lastRecognized && (
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-2 border-blue-400/40 px-6 py-3 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-blue-400">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </span>
                <Mic className="animate-pulse" size={16} />
                <span className="text-sm font-semibold">
                  Listening for: "{currentWord}"
                </span>
              </div>
            </div>
          </div>
        )}

      {/* ERROR MESSAGES - Separate area at bottom (only for critical errors) */}
      {speechState.error && !speechState.error.includes("already started") && (
        <div className="bg-red-500/20 border-2 border-red-400/50 px-4 py-3 rounded-xl">
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle size={16} />
            <span>Speech Error: {speechState.error}</span>
          </div>
        </div>
      )}

      {/* CONFIDENCE BAR - Only when we have confidence data and not showing other feedback */}
      {speechState.confidence > 0 &&
        !speechState.interimTranscript &&
        !lastRecognized && (
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-xs text-gray-400 mb-2">
              Last Speech Confidence: {Math.round(speechState.confidence * 100)}
              %
            </div>
            <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  speechState.confidence > 0.7
                    ? "bg-green-500"
                    : speechState.confidence > 0.5
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${speechState.confidence * 100}%` }}
              />
            </div>
          </div>
        )}

      {/* SPEECH NOT SUPPORTED WARNING */}
      {!speechState.isSupported && (
        <div className="bg-orange-500/20 border-2 border-orange-400/50 px-4 py-3 rounded-xl">
          <div className="flex items-center gap-2 text-orange-400 text-sm">
            <AlertCircle size={16} />
            <span>Speech recognition is not supported in this browser</span>
          </div>
        </div>
      )}
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
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl">{data.emoji}</span>
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

// Enhanced Game Controls Component
const GameControls = ({ isPaused, speechState, onPause, onReset, stats }) => (
  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onPause}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg"
        >
          {isPaused ? <Play size={24} /> : <Pause size={24} />}
        </button>

        <button
          onClick={onReset}
          className="bg-gradient-to-r from-gray-500 to-gray-600 text-white p-3 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all shadow-lg"
        >
          <RotateCcw size={24} />
        </button>

        {/* ENHANCED SPEECH STATUS */}
        <div className="flex items-center gap-3">
          <div
            className={`px-4 py-3 rounded-xl transition-all duration-300 shadow-lg flex items-center gap-3 ${
              speechState.isRecording
                ? "bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse ring-4 ring-red-300"
                : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
            }`}
          >
            {speechState.isRecording ? (
              <>
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <Mic size={20} />
                <span className="text-sm font-semibold">Listening...</span>
              </>
            ) : (
              <>
                <MicOff size={20} />
                <span className="text-sm font-semibold">Ready</span>
              </>
            )}
          </div>

          {/* LIVE TRANSCRIPT DISPLAY - Enhanced */}
          {speechState.interimTranscript && (
            <div className="bg-yellow-500/30 border-2 border-yellow-400/50 px-6 py-3 rounded-xl shadow-lg animate-pulse">
              <div className="text-yellow-300 text-xs font-semibold mb-1">
                You're saying:
              </div>
              <div className="text-white text-lg font-bold">
                "{speechState.interimTranscript}"
              </div>
            </div>
          )}

          {speechState.error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 px-3 py-2 rounded-xl border border-red-400/30">
              <AlertCircle size={16} />
              <span>{speechState.error}</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4 text-white text-sm flex-wrap">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-blue-400" />
          <span className="font-bold">{stats.progress}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-green-400" />
          <span className="font-bold">{stats.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-yellow-400" />
          <span className="font-bold">{stats.avgWordTime}/word</span>
        </div>
        <div className="flex items-center gap-2">
          <Target size={16} className="text-orange-400" />
          <span className="font-bold">{stats.accuracy}% accuracy</span>
        </div>
        <div className="flex items-center gap-2">
          <BarChart3 size={16} className="text-purple-400" />
          <span className="font-bold">
            {stats.consistencyScore}% consistent
          </span>
        </div>
      </div>
    </div>
  </div>
);

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

  const timer = useEnhancedGameTimer(
    gameState.phase === "challenge" &&
      !gameState.isPaused &&
      !gameState.isCompleted,
    useCallback((elapsed) => {
      setGameState((prev) => ({ ...prev, timeElapsed: elapsed }));
    }, [])
  );

  const handleSpeechResult = useCallback(
    (transcript, confidence = 0) => {
      console.log(
        "Received transcript:",
        transcript,
        "Confidence:",
        confidence
      );

      if (gameState.phase !== "challenge" || gameState.isPaused) return;
      if (gameState.currentWordIndex >= currentWords.length) {
        handleComplete();
        return;
      }

      const currentWord = currentWords[gameState.currentWordIndex];
      const spokenWords = transcript.toLowerCase().trim().split(/\s+/);

      // Use enhanced word matching
      const hasExactMatch = spokenWords.some((spokenWord) => {
        const cleanSpoken = cleanWord(spokenWord);
        const cleanCurrent = cleanWord(currentWord);
        return areWordsEquivalent(cleanSpoken, cleanCurrent);
      });

      // Only accept high-confidence matches for difficult words
      const minConfidence = currentCollection.theme.includes("Advanced")
        ? 0.7
        : 0.5;
      const isConfidentMatch = confidence >= minConfidence;

      if (hasExactMatch && isConfidentMatch) {
        // End timing for this word
        timer.endWordTimer(currentWord, true);

        setLastRecognized({
          word: currentWord,
          position: gameState.currentWordIndex,
          timestamp: Date.now(),
          confidence: confidence,
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
              confidence: confidence,
              transcript: transcript, // Store what was actually said
            });
          }
          return newWords;
        });

        setTimeout(() => {
          setGameState((prev) => {
            const newIndex = prev.currentWordIndex + 1;
            if (newIndex < currentWords.length) {
              // Start timing for next word
              timer.startWordTimer(newIndex);
              return { ...prev, currentWordIndex: newIndex };
            } else {
              return { ...prev, isCompleted: true };
            }
          });
        }, 300);
      } else if (hasExactMatch && !isConfidentMatch) {
        // Log low confidence matches for debugging
        console.log(`Low confidence match: ${transcript} (${confidence})`);
      }
    },
    [currentWords, gameState, handleComplete, currentCollection, timer]
  );

  const handleSpeechError = useCallback((error) => {
    console.error("Speech recognition error:", error);
  }, []);

  const speech = useSpeechRecognition(
    gameState.phase === "challenge" && !gameState.isPaused,
    handleSpeechResult,
    handleSpeechError
  );

  const handlePause = useCallback(() => {
    setGameState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const handleReset = useCallback(() => {
    setGameState(createInitialState());
    setRecognizedWords([]);
    timer.resetTimer();
  }, [timer]);

  // Clear animation after it plays
  useEffect(() => {
    if (lastRecognized) {
      const timer = setTimeout(() => setLastRecognized(null), 500);
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
  // STEP 7: REPLACE your stats calculation with this enhanced version:

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

    // Enhanced stats using timer data
    const avgWordTime =
      timer.averageWordTime > 0
        ? `${timer.averageWordTime.toFixed(1)}s`
        : "N/A";
    const fastestWord = timer.fastestWord
      ? `${timer.fastestWord.word} (${timer.fastestWord.time.toFixed(1)}s)`
      : "N/A";
    const consistencyScore =
      timer.wordTimes.length > 0
        ? Math.max(
            0,
            100 -
              (Math.round(
                ((timer.slowestWord?.time || 0) -
                  (timer.fastestWord?.time || 0)) *
                  10
              ) || 0)
          )
        : 100;

    return {
      progress,
      time,
      recognized: recognizedCount,
      wpm,
      accuracy,
      avgWordTime,
      fastestWord,
      consistencyScore,
    };
  }, [gameState, currentWords, recognizedWords, timer]);

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
            speechState={speech}
            onPause={handlePause}
            onReset={handleReset}
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
            />
          </div>
        </div>

        {/* Word Display */}
        <div className="max-w-7xl mx-auto">
          {gameState.displayMode === "flow" && (
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-12 min-h-[600px] flex flex-col items-center justify-center">
              {gameState.currentWordIndex < currentWords.length && (
                <>
                  <div
                    className={`${getFontClass()} font-black text-center transition-all duration-300 mb-8`}
                  >
                    <div className="bg-gradient-to-r from-pink-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                      {currentWords[gameState.currentWordIndex]}
                    </div>
                  </div>
                </>
              )}
              <div className="flex items-center justify-center gap-4 w-full mt-8">
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
              <div className="flex flex-col items-center justify-center min-h-[400px]">
                {gameState.currentWordIndex < currentWords.length && (
                  <>
                    <div
                      className={`${getFontClass()} font-black text-center mb-8`}
                    >
                      <div className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                        {currentWords[gameState.currentWordIndex]}
                      </div>
                    </div>
                  </>
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
      // NEW: Enhanced analytics from timer
      averageWordTime: timer.averageWordTime,
      fastestWordTime: timer.fastestWord?.time || 0,
      slowestWordTime: timer.slowestWord?.time || 0,
      consistencyScore: stats.consistencyScore,
      wordTimeBreakdown: timer.wordTimes,
      // Confidence analytics
      averageConfidence:
        recognizedWords.length > 0
          ? Math.round(
              (recognizedWords.reduce(
                (sum, w) => sum + (w.confidence || 0),
                0
              ) /
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

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Performance Metrics */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <BarChart3 className="text-emerald-400" size={24} />
                Performance
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                  <span className="text-gray-300 text-sm">Total Time</span>
                  <span className="text-lg font-bold text-white">
                    {finalStats.totalTime.toFixed(1)}s
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                  <span className="text-gray-300 text-sm">Words/Min</span>
                  <span className="text-lg font-bold text-emerald-400">
                    {finalStats.wordsPerMinute}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                  <span className="text-gray-300 text-sm">Avg/Word</span>
                  <span className="text-lg font-bold text-cyan-400">
                    {finalStats.averageWordTime.toFixed(1)}s
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                  <span className="text-gray-300 text-sm">Consistency</span>
                  <span className="text-lg font-bold text-teal-400">
                    {finalStats.consistencyScore}%
                  </span>
                </div>
              </div>
            </div>

            {/* Voice Recognition Stats */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <Mic className="text-purple-400" size={24} />
                Voice Analysis
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                  <span className="text-gray-300 text-sm">Recognized</span>
                  <span className="text-lg font-bold text-white">
                    {finalStats.recognizedCount}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                  <span className="text-gray-300 text-sm">Accuracy</span>
                  <span className="text-lg font-bold text-purple-400">
                    {finalStats.recognitionAccuracy}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                  <span className="text-gray-300 text-sm">Confidence</span>
                  <span className="text-lg font-bold text-pink-400">
                    {finalStats.averageConfidence}%
                  </span>
                </div>
                <div className="text-center mt-4">
                  <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-1000"
                      style={{ width: `${finalStats.recognitionAccuracy}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Speed Analysis */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <Zap className="text-yellow-400" size={24} />
                Speed Analysis
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                  <span className="text-gray-300 text-sm">Fastest</span>
                  <span className="text-lg font-bold text-green-400">
                    {finalStats.fastestWordTime.toFixed(1)}s
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                  <span className="text-gray-300 text-sm">Slowest</span>
                  <span className="text-lg font-bold text-orange-400">
                    {finalStats.slowestWordTime.toFixed(1)}s
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                  <span className="text-gray-300 text-sm">Range</span>
                  <span className="text-lg font-bold text-blue-400">
                    {(
                      finalStats.slowestWordTime - finalStats.fastestWordTime
                    ).toFixed(1)}
                    s
                  </span>
                </div>
                {timer.fastestWord && (
                  <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                    <div className="text-xs text-green-400 mb-1">
                      Fastest Word
                    </div>
                    <div className="text-white font-bold">
                      {timer.fastestWord.word}
                    </div>
                  </div>
                )}
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
