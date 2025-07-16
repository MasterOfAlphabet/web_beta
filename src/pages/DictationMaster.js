import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  XCircle,
  BookOpen,
  Users,
  GraduationCap,
  Clock,
  Timer,
  BarChart3,
} from "lucide-react";
import { usToUk } from "../data/US2UKWords.js";

const useTimeTracking = () => {
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [totalSessionTime, setTotalSessionTime] = useState(0);
  const [currentQuestionStartTime, setCurrentQuestionStartTime] =
    useState(null);
  const [questionTimes, setQuestionTimes] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  const startSession = () => {
    const now = Date.now();
    setSessionStartTime(now);
    setIsActive(true);
    setIsPaused(false);
  };

  const endSession = () => {
    setIsActive(false);
    setIsPaused(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const startQuestionTimer = (questionIndex) => {
    setCurrentQuestionStartTime(Date.now());
  };

  const endQuestionTimer = (questionIndex, isCorrect) => {
    if (currentQuestionStartTime) {
      const questionTime = Date.now() - currentQuestionStartTime;
      setQuestionTimes((prev) => [
        ...prev,
        {
          questionIndex,
          time: questionTime,
          isCorrect,
          timestamp: new Date().toISOString(),
        },
      ]);
      setCurrentQuestionStartTime(null);
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const resetTracking = () => {
    setSessionStartTime(null);
    setTotalSessionTime(0);
    setCurrentQuestionStartTime(null);
    setQuestionTimes([]);
    setIsActive(false);
    setIsPaused(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (isActive && !isPaused && sessionStartTime) {
      intervalRef.current = setInterval(() => {
        setTotalSessionTime(Date.now() - sessionStartTime);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, isPaused, sessionStartTime]);

  const getStats = () => {
    if (questionTimes.length === 0)
      return {
        averageTimePerQuestion: 0,
        fastestQuestion: 0,
        slowestQuestion: 0,
        accuracyRate: 0,
        totalQuestions: 0,
      };

    const times = questionTimes.map((q) => q.time);
    const correctAnswers = questionTimes.filter((q) => q.isCorrect).length;
    return {
      averageTimePerQuestion: times.reduce((a, b) => a + b, 0) / times.length,
      fastestQuestion: Math.min(...times),
      slowestQuestion: Math.max(...times),
      accuracyRate: (correctAnswers / questionTimes.length) * 100,
      totalQuestions: questionTimes.length,
    };
  };

  return {
    sessionStartTime,
    totalSessionTime,
    currentQuestionStartTime,
    questionTimes,
    isActive,
    isPaused,
    startSession,
    endSession,
    startQuestionTimer,
    endQuestionTimer,
    togglePause,
    resetTracking,
    getStats,
  };
};

const TimeDisplay = ({ time, label, className = "" }) => {
  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}:${(minutes % 60).toString().padStart(2, "0")}:${(
        seconds % 60
      )
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${(seconds % 60).toString().padStart(2, "0")}`;
  };

  return (
    <div className={`text-center ${className}`}>
      <div className="text-2xl font-bold text-white">{formatTime(time)}</div>
      <div className="text-sm text-white/70">{label}</div>
    </div>
  );
};

const TimeTrackingWidget = ({
  totalSessionTime,
  isActive,
  isPaused,
  togglePause,
  stats,
  currentQuestionTime,
}) => {
  return (
    <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <Clock className="w-6 h-6" /> Session Timer
        </h3>
        {isActive && (
          <button
            onClick={togglePause}
            className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
              isPaused
                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30"
                : "bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg shadow-yellow-500/30"
            }`}
          >
            {isPaused ? (
              <Play className="w-4 h-4" />
            ) : (
              <Pause className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <TimeDisplay time={totalSessionTime} label="Total Session" />
        <TimeDisplay time={currentQuestionTime} label="Current Question" />
      </div>
      {stats.totalQuestions > 0 && (
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <div className="text-lg font-semibold text-cyan-400">
              {Math.round(stats.averageTimePerQuestion / 1000)}s
            </div>
            <div className="text-white/70">Avg per Q</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-400">
              {Math.round(stats.accuracyRate)}%
            </div>
            <div className="text-white/70">Accuracy</div>
          </div>
        </div>
      )}
      {isPaused && (
        <div className="text-center mt-4">
          <span className="text-yellow-400 font-semibold animate-pulse">
            ⏸️ Paused
          </span>
        </div>
      )}
    </div>
  );
};

const StatisticsPanel = ({ stats, questionTimes }) => {
  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    return minutes > 0 ? `${minutes}m ${seconds % 60}s` : `${seconds}s`;
  };

  return (
    <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl mb-6">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <BarChart3 className="w-6 h-6" /> Session Statistics
      </h3>
      {stats.totalQuestions > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400">
              {stats.totalQuestions}
            </div>
            <div className="text-sm text-white/70">Questions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {Math.round(stats.accuracyRate)}%
            </div>
            <div className="text-sm text-white/70">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {formatTime(stats.fastestQuestion)}
            </div>
            <div className="text-sm text-white/70">Fastest</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {formatTime(stats.slowestQuestion)}
            </div>
            <div className="text-sm text-white/70">Slowest</div>
          </div>
        </div>
      ) : (
        <div className="text-center text-white/60">
          <Timer className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Start practicing to see your statistics!</p>
        </div>
      )}
    </div>
  );
};

const ukToUs = Object.fromEntries(
  Object.entries(usToUk).map(([us, uk]) => [uk, us])
);

function areWordsEquivalent(a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();
  if (a === b) return true;
  if (usToUk[a] === b) return true;
  if (ukToUs[a] === b) return true;
  return false;
}

function highlightAnswer(expected, actual) {
  const norm = (str) =>
    str
      .trim()
      .toLowerCase()
      .replace(/[^\w\s]/g, "");
  const expectedWords = expected.split(/\s+/);
  const actualWords = actual.split(/\s+/);
  const maxLen = Math.max(expectedWords.length, actualWords.length);

  return Array.from({ length: maxLen }).map((_, i) => {
    const exp = expectedWords[i] || "";
    const act = actualWords[i] || "";
    let colorClass = "";

    if (!act) {
      colorClass = "bg-yellow-100 text-yellow-600 font-bold";
    } else if (areWordsEquivalent(norm(exp), norm(act))) {
      colorClass = "bg-green-100 text-green-700 font-bold";
    } else {
      colorClass = "bg-red-100 text-red-700 font-bold";
    }

    return (
      <span
        key={i}
        className={`inline-block px-2 py-1 mx-1 my-1 rounded-xl transition-colors ${colorClass}`}
      >
        {act || <span className="opacity-40">{exp}</span>}
      </span>
    );
  });
}

const DictationApp = () => {
  const [selectedClass, setSelectedClass] = useState("I-II");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswerBox, setShowAnswerBox] = useState(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState(0);
  const [showHighlight, setShowHighlight] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isFinal, setIsFinal] = useState(false);

  const timeTracking = useTimeTracking();
  const [currentQuestionTime, setCurrentQuestionTime] = useState(0);
  const speechSynthesis = useRef(window.speechSynthesis);
  const recognition = useRef(null);
  const utterance = useRef(null);
  const silenceTimer = useRef(null);

  const questions = {
    "I-II": [
      { text: "The cat sat on the mat.", difficulty: "Easy" },
      { text: "I like to play with my toys.", difficulty: "Easy" },
      { text: "The sun is bright and warm.", difficulty: "Easy" },
      { text: "Birds fly high in the sky.", difficulty: "Easy" },
      { text: "My dog runs fast in the park.", difficulty: "Easy" },
    ],
    "III-V": [
      {
        text: "The beautiful butterfly landed on the colourful flower.",
        difficulty: "Medium",
      },
      {
        text: "Children enjoyed playing games during their summer holiday.",
        difficulty: "Medium",
      },
      {
        text: "The library has many interesting books to read.",
        difficulty: "Medium",
      },
      {
        text: "Scientists study different animals in the jungle.",
        difficulty: "Medium",
      },
      {
        text: "The teacher explained the lesson very clearly to the pupils.",
        difficulty: "Medium",
      },
    ],
    "VI-X": [
      {
        text: "The magnificent architecture of ancient civilisations continues to inspire modern builders.",
        difficulty: "Hard",
      },
      {
        text: "Environmental conservation requires collective responsibility from every individual in society.",
        difficulty: "Hard",
      },
      {
        text: "Technological advancement has revolutionised communication methods across the globe.",
        difficulty: "Hard",
      },
      {
        text: "Scientific research contributes significantly to improving human health and wellbeing.",
        difficulty: "Hard",
      },
      {
        text: "Critical thinking skills are essential for solving complex problems in academia.",
        difficulty: "Hard",
      },
    ],
  };

  // Replace the problematic useEffect with this:
  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      recognition.current = new window.webkitSpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = true;
      recognition.current.lang = "en-GB";

      recognition.current.onresult = (event) => {
        console.log("Got speech event:", event);

        let finalTranscript = "";
        let interim = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interim += transcript + " ";
          }
        }

        if (finalTranscript.trim()) {
          setUserAnswer((prev) => prev + finalTranscript.trim() + " ");
          setInterimTranscript("");
          setIsFinal(true);
        } else {
          setInterimTranscript(interim.trim());
          setIsFinal(false);
        }

        resetSilenceTimer();
      };

      recognition.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        clearTimeout(silenceTimer.current);
      };

      recognition.current.onsoundstart = () => {
        resetSilenceTimer();
      };

      recognition.current.onsoundend = () => {
        clearTimeout(silenceTimer.current);
        silenceTimer.current = setTimeout(() => {
          if (isListening) {
            stopListening();
          }
        }, 1500);
      };
    }

    if (!timeTracking.isActive) {
      timeTracking.startSession();
    }

    return () => {
      if (recognition.current) recognition.current.stop();
      clearTimeout(silenceTimer.current);
      if (speechSynthesis.current) {
        speechSynthesis.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    let interval;
    if (
      timeTracking.currentQuestionStartTime &&
      timeTracking.isActive &&
      !timeTracking.isPaused
    ) {
      interval = setInterval(() => {
        setCurrentQuestionTime(
          Date.now() - timeTracking.currentQuestionStartTime
        );
      }, 1000);
    } else {
      setCurrentQuestionTime(0);
    }
    return () => clearInterval(interval);
  }, [
    timeTracking.currentQuestionStartTime,
    timeTracking.isActive,
    timeTracking.isPaused,
  ]);

  // Update the resetSilenceTimer function to:
  const resetSilenceTimer = () => {
    clearTimeout(silenceTimer.current);
    silenceTimer.current = setTimeout(() => {
      if (isListening) {
        stopListening();
      }
    }, 1500);
  };

  const playDictation = () => {
    if (speechSynthesis.current) {
      if (isPlaying) {
        speechSynthesis.current.cancel();
        setIsPlaying(false);
      } else {
        try {
          utterance.current = new SpeechSynthesisUtterance(
            questions[selectedClass][currentQuestion].text
          );
          utterance.current.rate =
            selectedClass === "I-II"
              ? 0.7
              : selectedClass === "III-V"
              ? 0.8
              : 0.9;
          utterance.current.pitch = 1;
          utterance.current.volume = 1;
          utterance.current.lang = "en-GB";

          utterance.current.onstart = () => setIsPlaying(true);
          utterance.current.onend = () => {
            setIsPlaying(false);
            setHasPlayedOnce(true);
            setShowAnswerBox(true);
            timeTracking.startQuestionTimer(currentQuestion);
          };
          utterance.current.onerror = (event) => {
            console.error("Speech synthesis error", event);
            setIsPlaying(false);
          };

          speechSynthesis.current.speak(utterance.current);
        } catch (e) {
          console.error("Speech synthesis failed:", e);
          setIsPlaying(false);
        }
      }
    }
  };

  const startListening = () => {
    setUserAnswer(""); // If you want a fresh start
    setInterimTranscript(""); // Always reset

    if (recognition.current && !isListening) {
      setInterimTranscript("");
      setIsFinal(false);
      setIsListening(true);
      try {
        recognition.current.start();
      } catch (e) {
        console.warn("Already started, ignoring...");
      }
    }
  };

  const stopListening = () => {
    if (recognition.current && isListening) {
      try {
        recognition.current.stop();
      } catch (e) {
        console.warn("Recognition stop failed:", e);
      }
      setIsListening(false);
      clearTimeout(silenceTimer.current);

      if (interimTranscript.trim()) {
        setUserAnswer((prev) => prev + interimTranscript.trim() + " ");
        setInterimTranscript("");
      }
    }
  };

  const checkAnswer = () => {
    const norm = (str) =>
      str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s]/g, "");
    const expected = norm(questions[selectedClass][currentQuestion].text);
    const actual = norm(userAnswer);
    let correct = false;
    const expectedWords =
      questions[selectedClass][currentQuestion].text.split(/\s+/);
    const actualWords = userAnswer.split(/\s+/);

    if (expectedWords.length === actualWords.length) {
      correct = expectedWords.every((w, idx) => {
        w = w.toLowerCase().replace(/[^\w\s]/g, "");
        let a = actualWords[idx]
          ? actualWords[idx].toLowerCase().replace(/[^\w\s]/g, "")
          : "";
        if (w === a) return true;
        if (usToUk[w] === a) return true;
        if (ukToUs[w] === a) return true;
        return false;
      });
    }

    if (correct) setScore(score + 1);

    timeTracking.endQuestionTimer(currentQuestion, correct);
    setShowResult(true);
    setCompletedQuestions(completedQuestions + 1);
    setShowHighlight(true);
  };

  const nextQuestion = () => {
    setShowHighlight(false);
    if (currentQuestion < questions[selectedClass].length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setUserAnswer("");
      setShowAnswerBox(false);
      setHasPlayedOnce(false);
      setShowResult(false);
    } else {
      alert(
        `Quiz Complete! Your score: ${
          score + (userAnswer && showResult ? 1 : 0)
        }/${questions[selectedClass].length}`
      );
      resetQuiz();
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setUserAnswer("");
    setShowAnswerBox(false);
    setHasPlayedOnce(false);
    setShowResult(false);
    setScore(0);
    setCompletedQuestions(0);
    setShowHighlight(false);
    timeTracking.resetTracking();
    if (recognition.current) recognition.current.abort();
    speechSynthesis.current.cancel();
    setTimeout(() => timeTracking.startSession(), 200);
  };

  const resetCurrentQuestion = () => {
    setUserAnswer("");
    setShowAnswerBox(false);
    setHasPlayedOnce(false);
    setShowResult(false);
    speechSynthesis.current.cancel();
    setIsPlaying(false);
    setShowHighlight(false);
    timeTracking.startQuestionTimer(currentQuestion);
  };

  const getClassIcon = (classLevel) => {
    switch (classLevel) {
      case "I-II":
        return <BookOpen className="w-5 h-5" />;
      case "III-V":
        return <Users className="w-5 h-5" />;
      case "VI-X":
        return <GraduationCap className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "from-green-400 to-emerald-600";
      case "Medium":
        return "from-yellow-400 to-orange-600";
      case "Hard":
        return "from-red-400 to-pink-600";
      default:
        return "from-blue-400 to-purple-600";
    }
  };

  const expectedText = questions[selectedClass][currentQuestion].text;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-red-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <TimeTrackingWidget
            totalSessionTime={timeTracking.totalSessionTime}
            isActive={timeTracking.isActive}
            isPaused={timeTracking.isPaused}
            togglePause={timeTracking.togglePause}
            stats={timeTracking.getStats()}
            currentQuestionTime={currentQuestionTime}
          />
          <StatisticsPanel
            stats={timeTracking.getStats()}
            questionTimes={timeTracking.questionTimes}
          />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-2xl">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
              Dictation Master
            </span>
          </h1>
          <p className="text-xl text-white/80 drop-shadow-lg">
            Perfect Your Listening & Writing Skills
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4 text-center">
            Select Your Class Level
          </h2>
          <div className="flex justify-center gap-4 flex-wrap">
            {Object.keys(questions).map((classLevel) => (
              <button
                key={classLevel}
                onClick={() => {
                  setSelectedClass(classLevel);
                  resetQuiz();
                }}
                className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-lg border flex items-center gap-2 ${
                  selectedClass === classLevel
                    ? "bg-white/20 border-white/40 text-white shadow-2xl shadow-white/20"
                    : "bg-white/10 border-white/20 text-white/80 hover:bg-white/15"
                }`}
              >
                {getClassIcon(classLevel)}
                Class {classLevel}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white font-semibold">Progress</span>
              <span className="text-white/80">
                {currentQuestion + 1} / {questions[selectedClass].length}
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-cyan-400 to-blue-600 h-3 rounded-full transition-all duration-500 shadow-lg"
                style={{
                  width: `${
                    ((currentQuestion + 1) / questions[selectedClass].length) *
                    100
                  }%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between mt-4">
              <span className="text-white/80">Score: {score}</span>
              <span className="text-white/80">
                Completed: {completedQuestions}
              </span>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-lg bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl mb-8">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-4 mb-4">
              <div
                className={`px-4 py-2 rounded-full bg-gradient-to-r ${getDifficultyColor(
                  questions[selectedClass][currentQuestion].difficulty
                )} text-white font-semibold shadow-lg`}
              >
                {questions[selectedClass][currentQuestion].difficulty}
              </div>
              <div className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg">
                Question {currentQuestion + 1}
              </div>
            </div>
            <p className="text-white/80 text-lg">
              Listen carefully and write what you hear
            </p>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={playDictation}
              className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-3 ${
                isPlaying
                  ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-2xl shadow-red-500/30"
                  : "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-2xl shadow-green-500/30"
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-6 h-6" />
                  Stop Audio
                </>
              ) : (
                <>
                  <Play className="w-6 h-6" />
                  Play Dictation
                </>
              )}
            </button>

            <button
              onClick={resetCurrentQuestion}
              className="px-6 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-2xl shadow-gray-500/30 flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
          </div>

          {showAnswerBox && (
            <div className="space-y-6 animate-fade-in">
              <div className="relative">
                <label className="block text-white font-semibold mb-3 text-lg">
                  Your Answer:
                </label>
                <div className="relative">
                  <textarea
                    value={userAnswer + (isListening ? interimTranscript : "")}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-lg resize-none shadow-inner"
                    placeholder="Type what you heard or use the microphone..."
                    rows="3"
                  />
                  <div className="absolute right-4 top-4">
                    <button
                      onClick={isListening ? stopListening : startListening}
                      className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                        isListening
                          ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-2xl shadow-red-500/30 animate-pulse"
                          : "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-2xl shadow-blue-500/30"
                      }`}
                    >
                      {isListening ? (
                        <MicOff className="w-6 h-6" />
                      ) : (
                        <Mic className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                </div>
                {isListening && (
                  <div className="text-center mt-3">
                    {interimTranscript ? (
                      <p className="text-cyan-400 font-semibold animate-pulse flex items-center justify-center gap-2">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                        </span>
                        Listening...
                      </p>
                    ) : !userAnswer ? (
                      <p className="text-cyan-400 font-semibold animate-pulse flex items-center justify-center gap-2">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                        </span>
                        Waiting for speech...
                      </p>
                    ) : null}

                    {interimTranscript && (
                      <p className="mt-2 text-lg text-cyan-200">
                        {interimTranscript}
                      </p>
                    )}
                    {userAnswer && (
                      <p className="mt-2 text-green-400 font-bold">
                        {userAnswer}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {!showResult && (
                <div className="text-center">
                  <button
                    onClick={checkAnswer}
                    disabled={!userAnswer.trim()}
                    className="px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-2xl shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    Check Answer
                  </button>
                </div>
              )}

              {showResult && (
                <div className="text-center space-y-4 animate-fade-in">
                  <div
                    className={`p-6 rounded-2xl backdrop-blur-lg border ${
                      userAnswer &&
                      highlightAnswer(expectedText, userAnswer).every((el) =>
                        el.props.className.includes("text-green-700")
                      )
                        ? "bg-green-500/20 border-green-400/40 text-green-100"
                        : "bg-red-500/20 border-red-400/40 text-red-100"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-3 mb-4">
                      {userAnswer &&
                      highlightAnswer(expectedText, userAnswer).every((el) =>
                        el.props.className.includes("text-green-700")
                      ) ? (
                        <CheckCircle className="w-8 h-8 text-green-400" />
                      ) : (
                        <XCircle className="w-8 h-8 text-red-400" />
                      )}
                      <span className="text-2xl font-bold">
                        {userAnswer &&
                        highlightAnswer(expectedText, userAnswer).every((el) =>
                          el.props.className.includes("text-green-700")
                        )
                          ? "Correct!"
                          : "Incorrect"}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p>
                        <strong>Correct Answer:</strong>
                        <div className="mt-2 whitespace-pre-line text-base text-green-200 bg-white/10 px-3 py-2 rounded-xl font-mono shadow-inner">
                          {expectedText}
                        </div>
                      </p>
                      <p>
                        <strong>Your Answer:</strong>
                        <div className="mt-2 whitespace-pre-line text-base text-blue-100 bg-white/10 px-3 py-2 rounded-xl font-mono shadow-inner">
                          {userAnswer}
                        </div>
                      </p>
                      {showHighlight && (
                        <div className="mt-4 text-left">
                          <p className="font-semibold text-white mb-1">
                            Word-by-word Comparison:
                          </p>
                          <div className="flex flex-wrap gap-y-2">
                            {highlightAnswer(expectedText, userAnswer)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={nextQuestion}
                    className="px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-2xl shadow-purple-500/30"
                  >
                    {currentQuestion < questions[selectedClass].length - 1
                      ? "Next Question"
                      : "Finish Quiz"}
                  </button>
                </div>
              )}
            </div>
          )}

          {!hasPlayedOnce && (
            <div className="text-center">
              <p className="text-white/60 text-lg">
                Click "Play Dictation" to start
              </p>
            </div>
          )}
        </div>

        <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Volume2 className="w-6 h-6" />
            How to Use
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-white/80">
            <div>
              <p className="mb-2">• Click "Play Dictation" to hear the text</p>
              <p className="mb-2">• Listen carefully and write what you hear</p>
              <p>• Use the microphone button for voice input</p>
            </div>
            <div>
              <p className="mb-2">• Click "Check Answer" to see results</p>
              <p className="mb-2">
                • Practise with different difficulty levels
              </p>
              <p>• Track your progress and improve your score</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DictationApp;
