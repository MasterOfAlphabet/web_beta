import React, { useState, useEffect } from 'react';
import { 
  Clock, Volume2, CheckCircle, ChevronDown, ChevronUp, ArrowLeft, ArrowRight, 
  Trophy, Star, Sparkles, BookOpen, Headphones, Mic, Edit3, PenTool, 
  Library, Zap, Grid3X3, Play, FileText, Target, Award, Timer,
  RotateCcw, Eye, EyeOff, Lightbulb, Heart, Coffee
} from 'lucide-react';

// Module configurations with icons and colors
const moduleConfigs = {
  "Spelling": { icon: BookOpen, color: "#f44336", bgGradient: "from-red-500 to-red-600" },
  "Reading": { icon: FileText, color: "#e91e63", bgGradient: "from-pink-500 to-pink-600" },
  "Pronunciation": { icon: Mic, color: "#9c27b0", bgGradient: "from-purple-500 to-purple-600" },
  "Grammar": { icon: Edit3, color: "#673ab7", bgGradient: "from-indigo-500 to-indigo-600" },
  "Writing": { icon: PenTool, color: "#3f51b5", bgGradient: "from-blue-500 to-blue-600" },
  "Listening": { icon: Headphones, color: "#2196f3", bgGradient: "from-sky-500 to-sky-600" },
  "Vocabulary": { icon: Library, color: "#4caf50", bgGradient: "from-green-500 to-green-600" },
  "S.H.A.R.P": { icon: Zap, color: "#ff9800", bgGradient: "from-orange-500 to-orange-600" },
  "8-In-1": { icon: Grid3X3, color: "#607d8b", bgGradient: "from-slate-500 to-slate-600" }
};

// Sample data structure
const sampleData = {
  classGroup: "I-II",
  categories: [
    {
      name: "Dictation",
      description: "Listen to the word and type it correctly.",
      questions: [
        { id: 1, word: "apple", answer: "apple" },
        { id: 2, word: "pen", answer: "pen" },
        { id: 3, word: "cake", answer: "cake" },
        { id: 4, word: "fish", answer: "fish" },
      ],
    },
    {
      name: "Find the Correct Spelling (MCQ)",
      description: "Choose the correctly spelled word from the options.",
      questions: [
        {
          id: 5,
          question: "Which is the correct spelling?",
          options: ["hous", "hose", "house", "huse"],
          answer: "house",
        },
        {
          id: 6,
          question: "Which is the correct spelling?",
          options: ["flor", "flower", "floer", "flowr"],
          answer: "flower",
        },
      ],
    },
    {
      name: "Find the Missing Letter",
      description: "Fill in the missing letter to complete the word.",
      questions: [
        {
          id: 7,
          word: "c _ t",
          hint: "A pet that says meow.",
          answer: "cat",
        },
        {
          id: 8,
          word: "b _ _ l",
          hint: "You play with this.",
          answer: "ball",
        },
      ],
    },
  ],
};

const picImages = {
  "apple.jpg": "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80",
  "dog.jpg": "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80",
};

function getLearningLevel(score, total) {
  const percentage = (score / total) * 100;
  if (percentage <= 20) return { level: "Rookie", color: "text-amber-600", bg: "bg-amber-100", icon: "🌱", gradient: "from-amber-400 to-amber-500" };
  if (percentage <= 40) return { level: "Racer", color: "text-blue-600", bg: "bg-blue-100", icon: "🏃", gradient: "from-blue-400 to-blue-500" };
  if (percentage <= 60) return { level: "Master", color: "text-purple-600", bg: "bg-purple-100", icon: "🎯", gradient: "from-purple-400 to-purple-500" };
  if (percentage <= 80) return { level: "Prodigy", color: "text-green-600", bg: "bg-green-100", icon: "🧠", gradient: "from-green-400 to-green-500" };
  return { level: "Wizard", color: "text-pink-600", bg: "bg-pink-100", icon: "🧙‍♂️", gradient: "from-pink-400 to-pink-500" };
}

function speak(text) {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.rate = 0.8;
    window.speechSynthesis.speak(utter);
  }
}

// Main Component
export default function QuestionDisplayCard({
  module = "Spelling",
  mode = "Practice", // Practice or Test
  data = sampleData,
  student = {
    name: "Alex Johnson",
    classLevel: "Class II",
    parentMobile: "+1-555-0123",
    city: "New York",
    school: "Sunshine Elementary"
  },
  onComplete = () => {},
  timeLimit = 60 * 60, // in seconds
  showHints = true,
  allowRetry = true,
  autoSubmit = true
}) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timer, setTimer] = useState(timeLimit);
  const [submitted, setSubmitted] = useState(false);
  const [catOpen, setCatOpen] = useState({});
  const [showInstructions, setShowInstructions] = useState(true);
  const [hintsUsed, setHintsUsed] = useState({});
  const [retryCount, setRetryCount] = useState({});
  const [confidenceLevel, setConfidenceLevel] = useState({});
  const [bookmarked, setBookmarked] = useState({});

  const moduleConfig = moduleConfigs[module] || moduleConfigs["Spelling"];
  const ModuleIcon = moduleConfig.icon;

  // Timer effect
  useEffect(() => {
    if (submitted || mode === "Practice") return;
    if (timer <= 0) {
      if (autoSubmit) setSubmitted(true);
      return;
    }
    const t = setInterval(() => setTimer((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [timer, submitted, mode, autoSubmit]);

  const allQuestions = data.categories.flatMap((cat) =>
    cat.questions.map((q) => ({
      ...q,
      category: cat.name,
    }))
  );

  const score = allQuestions.reduce(
    (acc, q) =>
      (answers[q.id]?.trim().toLowerCase() === q.answer.toLowerCase()
        ? acc + 1
        : acc),
    0
  );

  const learningLevelData = getLearningLevel(score, allQuestions.length);
  
  const categoryScores = data.categories.map(cat => ({
    name: cat.name,
    score: cat.questions.reduce((acc, q) =>
      answers[q.id]?.trim().toLowerCase() === q.answer.toLowerCase() ? acc + 1 : acc, 0
    ),
    total: cat.questions.length,
  }));

  const handleAnswer = (qid, val) => {
    setAnswers((prev) => ({ ...prev, [qid]: val }));
    if (mode === "Practice") {
      // In practice mode, provide immediate feedback
      const question = allQuestions.find(q => q.id === qid);
      if (question && val.trim().toLowerCase() === question.answer.toLowerCase()) {
        // Correct answer animation or sound could be added here
      }
    }
  };

  const handleConfidence = (qid, level) => {
    setConfidenceLevel(prev => ({ ...prev, [qid]: level }));
  };

  const handleBookmark = (qid) => {
    setBookmarked(prev => ({ ...prev, [qid]: !prev[qid] }));
  };

  const handleHint = (qid) => {
    setHintsUsed(prev => ({ ...prev, [qid]: (prev[qid] || 0) + 1 }));
  };

  const handleRetry = (qid) => {
    setRetryCount(prev => ({ ...prev, [qid]: (prev[qid] || 0) + 1 }));
    setAnswers(prev => ({ ...prev, [qid]: "" }));
  };

  const handleNext = () => setCurrentQ((q) => Math.min(q + 1, allQuestions.length - 1));
  const handlePrev = () => setCurrentQ((q) => Math.max(q - 1, 0));
  const handleSubmit = () => {
    setSubmitted(true);
    onComplete({
      score,
      total: allQuestions.length,
      answers,
      hintsUsed,
      retryCount,
      confidenceLevel,
      bookmarked,
      timeSpent: timeLimit - timer
    });
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const getTimerColor = () => {
    if (timer > timeLimit * 0.5) return "text-green-600 bg-green-100";
    if (timer > timeLimit * 0.25) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const currentQuestion = allQuestions[currentQ];
  const currentCategory = data.categories.find(cat => 
    cat.questions.some(q => q.id === currentQuestion?.id)
  );

  // Instructions for each module
  const getInstructions = () => {
    const baseInstructions = [
      "Read each question carefully before answering",
      "Take your time to think through each answer",
      mode === "Test" ? "You cannot change answers once submitted" : "You can retry questions in practice mode",
    ];

    const moduleSpecific = {
      "Spelling": ["Listen carefully to audio prompts", "Type words exactly as you hear them"],
      "Reading": ["Read the passage thoroughly", "Answer based on the text provided"],
      "Pronunciation": ["Click the speaker icon to hear the word", "Practice saying it aloud"],
      "Grammar": ["Pay attention to sentence structure", "Choose the grammatically correct option"],
      "Writing": ["Express your thoughts clearly", "Check spelling and punctuation"],
      "Listening": ["Use headphones if available", "Listen to the audio multiple times if needed"],
      "Vocabulary": ["Think about word meanings", "Consider context clues"],
      "S.H.A.R.P": ["Apply problem-solving strategies", "Think step by step"]
    };

    return [...baseInstructions, ...(moduleSpecific[module] || [])];
  };

  // Question renderers with enhanced UI
  const renderQuestion = (q, cat) => {
    const isCorrect = answers[q.id]?.trim().toLowerCase() === q.answer.toLowerCase();
    const hasAnswered = answers[q.id]?.trim().length > 0;

    if (cat.name === "Dictation") {
      return (
        <div className="space-y-8">
          <div className="flex items-center justify-center">
            <button
              onClick={() => speak(q.word)}
              className={`group relative inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r ${moduleConfig.bgGradient} text-white font-bold rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300`}
            >
              <Volume2 className="w-8 h-8 group-hover:animate-pulse" />
              <span className="text-xl">🎧 Listen & Type</span>
            </button>
          </div>
          <div className="flex justify-center">
            <div className="relative">
              <input
                type="text"
                value={answers[q.id] || ""}
                onChange={(e) => handleAnswer(q.id, e.target.value)}
                disabled={submitted}
                className={`w-full max-w-lg px-8 py-6 text-2xl font-bold text-center border-4 rounded-3xl transition-all duration-300 ${
                  hasAnswered 
                    ? isCorrect && mode === "Practice"
                      ? "border-green-400 bg-green-50 focus:border-green-500"
                      : "border-blue-400 bg-blue-50 focus:border-blue-500"
                    : "border-gray-300 bg-white focus:border-purple-500"
                } focus:ring-8 focus:ring-opacity-20 shadow-lg`}
                placeholder="Type what you hear..."
                style={{ fontFamily: 'Comic Sans MS, cursive' }}
              />
              {mode === "Practice" && hasAnswered && (
                <div className="absolute -top-3 -right-3">
                  {isCorrect ? (
                    <div className="bg-green-500 text-white rounded-full p-2">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                  ) : (
                    <button
                      onClick={() => handleRetry(q.id)}
                      className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-2 transition-colors"
                    >
                      <RotateCcw className="w-6 h-6" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (cat.name === "Find the Correct Spelling (MCQ)") {
      return (
        <div className="space-y-8">
          <h3 className="text-3xl font-bold text-gray-800 text-center" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
            {q.question}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {q.options.map((option, idx) => {
              const optionLabels = ['A', 'B', 'C', 'D'];
              const isSelected = answers[q.id] === option;
              const isCorrectOption = option === q.answer;
              
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(q.id, option)}
                  disabled={submitted}
                  className={`relative p-6 rounded-3xl border-4 font-bold text-xl transition-all duration-300 transform hover:scale-105 ${
                    isSelected
                      ? `bg-gradient-to-r ${moduleConfig.bgGradient} text-white border-transparent shadow-2xl`
                      : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 hover:border-gray-400 hover:shadow-lg text-gray-700'
                  }`}
                  style={{ fontFamily: 'Comic Sans MS, cursive' }}
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {optionLabels[idx]}
                    </div>
                    <span className="flex-1 ml-4">{option}</span>
                  </div>
                  {mode === "Practice" && isSelected && (
                    <div className="absolute -top-2 -right-2">
                      {isCorrectOption ? (
                        <div className="bg-green-500 text-white rounded-full p-1">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                      ) : (
                        <div className="bg-red-500 text-white rounded-full p-1">
                          <span className="text-sm">✗</span>
                        </div>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (cat.name === "Find the Missing Letter") {
      return (
        <div className="space-y-8">
          <div className="text-center">
            <div className="text-6xl font-black text-gray-800 mb-4 tracking-wider" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
              {q.word}
            </div>
            {showHints && (
              <div className="relative inline-block">
                <p className="text-gray-600 italic text-lg bg-yellow-100 rounded-2xl px-6 py-3">
                  💡 Hint: {q.hint}
                </p>
                {mode === "Practice" && (
                  <button
                    onClick={() => handleHint(q.id)}
                    className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full p-1 hover:bg-yellow-600 transition-colors"
                  >
                    <Lightbulb className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="flex justify-center">
            <input
              type="text"
              value={answers[q.id] || ""}
              onChange={(e) => handleAnswer(q.id, e.target.value)}
              disabled={submitted}
              className={`w-full max-w-lg px-8 py-6 text-2xl font-bold text-center border-4 rounded-3xl transition-all duration-300 ${
                hasAnswered 
                  ? isCorrect && mode === "Practice"
                    ? "border-green-400 bg-green-50"
                    : "border-purple-400 bg-purple-50"
                  : "border-gray-300 bg-white"
              } focus:ring-8 focus:ring-opacity-20 shadow-lg`}
              placeholder="Complete the word..."
              style={{ fontFamily: 'Comic Sans MS, cursive' }}
            />
          </div>
        </div>
      );
    }

    return null;
  };

  // Instructions Modal
  if (showInstructions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 border-4" style={{ borderColor: moduleConfig.color }}>
          <div className="text-center mb-8">
            <div className={`inline-flex items-center gap-4 px-8 py-4 rounded-3xl bg-gradient-to-r ${moduleConfig.bgGradient} text-white mb-6`}>
              <ModuleIcon className="w-8 h-8" />
              <h1 className="text-3xl font-black" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                {module} {mode}
              </h1>
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl ${
              mode === "Practice" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
            }`}>
              {mode === "Practice" ? <Play className="w-5 h-5" /> : <Target className="w-5 h-5" />}
              <span className="font-bold">Mode: {mode}</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Instructions
            </h2>
            <div className="space-y-3">
              {getInstructions().map((instruction, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-2xl">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {idx + 1}
                  </div>
                  <span className="text-gray-700">{instruction}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => setShowInstructions(false)}
              className={`px-12 py-4 bg-gradient-to-r ${moduleConfig.bgGradient} text-white font-bold text-xl rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300`}
              style={{ fontFamily: 'Comic Sans MS, cursive' }}
            >
              🚀 Start {mode}!
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results Page
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 text-center relative overflow-hidden border-4" style={{ borderColor: moduleConfig.color }}>
            <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${moduleConfig.bgGradient}`}></div>
            
            <div className="flex justify-center mb-6">
              <div className={`inline-flex items-center gap-4 px-8 py-4 rounded-3xl bg-gradient-to-r ${learningLevelData.gradient} text-white`}>
                <span className="text-4xl">{learningLevelData.icon}</span>
                <h1 className="text-4xl font-black" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                  {learningLevelData.level}
                </h1>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-4 mb-8">
              <Trophy className="w-12 h-12 text-yellow-500" />
              <span className="text-4xl font-black text-gray-800" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                {score} / {allQuestions.length}
              </span>
              <div className="text-2xl text-gray-600">
                ({Math.round((score / allQuestions.length) * 100)}%)
              </div>
            </div>

            {mode === "Practice" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-50 rounded-2xl p-4">
                  <Eye className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-lg font-bold text-blue-600">Hints Used</div>
                  <div className="text-2xl font-black text-blue-800">
                    {Object.values(hintsUsed).reduce((a, b) => a + b, 0)}
                  </div>
                </div>
                <div className="bg-orange-50 rounded-2xl p-4">
                  <RotateCcw className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-lg font-bold text-orange-600">Retries</div>
                  <div className="text-2xl font-black text-orange-800">
                    {Object.values(retryCount).reduce((a, b) => a + b, 0)}
                  </div>
                </div>
                <div className="bg-pink-50 rounded-2xl p-4">
                  <Heart className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                  <div className="text-lg font-bold text-pink-600">Bookmarked</div>
                  <div className="text-2xl font-black text-pink-800">
                    {Object.values(bookmarked).filter(Boolean).length}
                  </div>
                </div>
              </div>
            )}

            {/* Category Performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {categoryScores.map((cat, idx) => (
                <div key={cat.name} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-6 border-2 border-gray-200">
                  <h3 className="font-bold text-gray-800 mb-3 text-lg">{cat.name}</h3>
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="text-3xl font-black text-blue-600">
                      {cat.score}
                    </div>
                    <div className="text-gray-500 text-xl">/</div>
                    <div className="text-2xl text-gray-600">
                      {cat.total}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${moduleConfig.bgGradient} rounded-full transition-all duration-1000`}
                      style={{ width: `${(cat.score / cat.total) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-center mt-2 font-bold text-gray-600">
                    {Math.round((cat.score / cat.total) * 100)}%
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <RotateCcw className="w-5 h-5 inline mr-2" />
                Try Again
              </button>
              {mode === "Practice" && (
                <button
                  onClick={() => {
                    setShowInstructions(true);
                    setSubmitted(false);
                    setCurrentQ(0);
                    setAnswers({});
                    setTimer(timeLimit);
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <Target className="w-5 h-5 inline mr-2" />
                  Switch to Test
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Assessment Interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 mb-8 border-4" style={{ borderColor: moduleConfig.color }}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r ${moduleConfig.bgGradient} text-white`}>
                <ModuleIcon className="w-6 h-6" />
                <span className="font-bold text-lg" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                  {module}
                </span>
              </div>
              <div className={`px-4 py-2 rounded-2xl ${
                mode === "Practice" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
              }`}>
                <span className="font-bold">Mode: {mode}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-gray-600 font-medium">
                Question <span className="font-bold text-2xl">{currentQ + 1}</span> of {allQuestions.length}
              </div>
              
              {mode === "Test" && (
                <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl ${getTimerColor()}`}>
                  <Timer className="w-5 h-5" />
                  <span className="font-bold">Time Left: {formatTime(timer)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4" style={{ borderColor: moduleConfig.color }}>
          {/* Category Header */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center gap-3 px-8 py-4 rounded-3xl bg-gradient-to-r ${moduleConfig.bgGradient} text-white mb-4`}>
              <span className="text-2xl">📚</span>
              <h2 className="text-2xl font-bold" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                {currentCategory?.name}
              </h2>
            </div>
            <p className="text-gray-600 text-lg bg-gray-50 rounded-2xl px-6 py-3 inline-block max-w-2xl">
              {currentCategory?.description}
            </p>
          </div>

          {/* Question Content */}
          <div className="mb-12">
            {renderQuestion(currentQuestion, currentCategory)}
          </div>

          {/* Practice Mode Features */}
          {mode === "Practice" && (
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button
                onClick={() => handleBookmark(currentQuestion.id)}
                className={`px-4 py-2 rounded-2xl font-medium transition-all duration-300 ${
                  bookmarked[currentQuestion.id]
                    ? 'bg-yellow-500 text-white shadow-lg'
                    : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                }`}
              >
                <Star className={`w-5 h-5 inline mr-2 ${bookmarked[currentQuestion.id] ? 'fill-current' : ''}`} />
                {bookmarked[currentQuestion.id] ? 'Bookmarked' : 'Bookmark'}
              </button>
              
              {showHints && currentQuestion.hint && (
                <button
                  onClick={() => handleHint(currentQuestion.id)}
                  className="px-4 py-2 bg-blue-100 text-blue-800 rounded-2xl font-medium hover:bg-blue-200 transition-colors"
                >
                  <Lightbulb className="w-5 h-5 inline mr-2" />
                  Hint ({(hintsUsed[currentQuestion.id] || 0)} used)
                </button>
              )}
              
              {allowRetry && answers[currentQuestion.id] && (
                <button
                  onClick={() => handleRetry(currentQuestion.id)}
                  className="px-4 py-2 bg-orange-100 text-orange-800 rounded-2xl font-medium hover:bg-orange-200 transition-colors"
                >
                  <RotateCcw className="w-5 h-5 inline mr-2" />
                  Retry ({(retryCount[currentQuestion.id] || 0)} times)
                </button>
              )}
            </div>
          )}

          {/* Confidence Level (Practice Mode) */}
          {mode === "Practice" && answers[currentQuestion.id] && (
            <div className="text-center mb-8">
              <p className="text-gray-600 mb-4 font-medium">How confident are you with this answer?</p>
              <div className="flex justify-center gap-4">
                {[
                  { level: 'low', emoji: '😰', label: 'Not Sure', color: 'bg-red-100 text-red-800' },
                  { level: 'medium', emoji: '😐', label: 'Okay', color: 'bg-yellow-100 text-yellow-800' },
                  { level: 'high', emoji: '😎', label: 'Confident', color: 'bg-green-100 text-green-800' }
                ].map(({ level, emoji, label, color }) => (
                  <button
                    key={level}
                    onClick={() => handleConfidence(currentQuestion.id, level)}
                    className={`px-4 py-2 rounded-2xl font-medium transition-all duration-300 ${
                      confidenceLevel[currentQuestion.id] === level
                        ? color.replace('100', '500').replace('800', 'white') + ' shadow-lg transform scale-105'
                        : color + ' hover:shadow-md'
                    }`}
                  >
                    <span className="text-xl mr-2">{emoji}</span>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrev}
              disabled={currentQ === 0}
              className={`group flex items-center gap-3 px-8 py-4 rounded-3xl font-bold text-lg transition-all duration-300 ${
                currentQ === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:shadow-xl transform hover:scale-105 hover:-translate-x-1'
              }`}
              style={{ fontFamily: 'Comic Sans MS, cursive' }}
            >
              <ArrowLeft className="w-6 h-6 group-hover:animate-pulse" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-4">
              {/* Question Navigation Dots */}
              <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
                {allQuestions.slice(0, 10).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentQ(idx)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      idx === currentQ
                        ? `bg-gradient-to-r ${moduleConfig.bgGradient} shadow-lg scale-125`
                        : answers[allQuestions[idx].id]
                        ? 'bg-green-400'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
                {allQuestions.length > 10 && (
                  <span className="text-gray-500 text-sm ml-2">+{allQuestions.length - 10}</span>
                )}
              </div>
            </div>

            {currentQ < allQuestions.length - 1 ? (
              <button
                onClick={handleNext}
                className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-3xl hover:shadow-xl transform hover:scale-105 hover:translate-x-1 transition-all duration-300"
                style={{ fontFamily: 'Comic Sans MS, cursive' }}
              >
                <span>Next</span>
                <ArrowRight className="w-6 h-6 group-hover:animate-pulse" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="group flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg rounded-3xl hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                style={{ fontFamily: 'Comic Sans MS, cursive' }}
              >
                <Trophy className="w-6 h-6 group-hover:animate-bounce" />
                <span>Submit {mode}</span>
              </button>
            )}
          </div>
        </div>

        {/* Floating Encouragement */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-sm px-8 py-4 rounded-3xl shadow-lg">
            <span className="text-3xl animate-bounce">🌟</span>
            <span className="text-gray-700 font-bold text-lg" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
              {mode === "Practice" ? "Practice makes perfect!" : "You're doing amazing!"}
            </span>
            <span className="text-3xl animate-bounce" style={{animationDelay: '0.5s'}}>🎯</span>
          </div>
        </div>

        {/* Progress Indicators (for Test mode) */}
        {mode === "Test" && (
          <div className="fixed bottom-4 right-4 bg-white rounded-2xl shadow-xl p-4 border-2" style={{ borderColor: moduleConfig.color }}>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">Progress</div>
              <div className="text-2xl font-bold text-gray-800">
                {Math.round(((currentQ + 1) / allQuestions.length) * 100)}%
              </div>
              <div className="text-sm text-gray-500">
                {Object.keys(answers).length} answered
              </div>
            </div>
          </div>
        )}

        {/* Floating Action Button for Break (Test mode) */}
        {mode === "Test" && timer < timeLimit * 0.5 && (
          <div className="fixed bottom-4 left-4">
            <button
              onClick={() => {
                if (window.confirm("Take a 5-minute break? Timer will pause.")) {
                  setTimer(timer + 300); // Add 5 minutes
                }
              }}
              className="bg-gradient-to-r from-orange-400 to-orange-500 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300"
            >
              <Coffee className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}