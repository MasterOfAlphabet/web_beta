import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen, Trophy, Star, TrendingUp, Lightbulb, Zap, Target, Award, Users,
  ChevronRight, PlayCircle, Brain, Sparkles, Volume2, Pause, RotateCcw, Eye,
  Turtle
} from "lucide-react";

const classGroups = [
  { label: "Class I-II", value: "I-II", color: "from-pink-400 to-purple-500" },
  { label: "Class III-V", value: "III-V", color: "from-blue-400 to-cyan-500" },
  { label: "Class VI-X", value: "VI-X", color: "from-green-400 to-teal-500" },
];

const passages = {
  "I-II": [
    {
      title: "The Cat",
      passage: "The cat sat on the mat. It was a fluffy orange cat. The cat liked to sleep in the sun.",
      difficulty: "Easy",
      readTime: "1 min",
      icon: "🐱",
      gradient: "from-pink-500 to-rose-400",
      questions: [
        { question: "Where did the cat sit?", answer: "on the mat", options: ["on the mat", "on the chair", "on the bed"] },
        { question: "What color was the cat?", answer: "orange", options: ["orange", "black", "white"] }
      ]
    },
    {
      title: "A Sunny Day",
      passage: "The sun is bright and yellow. Birds fly in the blue sky. Children play outside happily.",
      difficulty: "Easy",
      readTime: "1 min",
      icon: "☀️",
      gradient: "from-yellow-400 to-orange-400",
      questions: [
        { question: "What color is the sun?", answer: "yellow", options: ["yellow", "red", "blue"] },
        { question: "Where do birds fly?", answer: "in the sky", options: ["in the sky", "on the ground", "in the water"] }
      ]
    }
  ],
  "III-V": [
    {
      title: "The Jungle",
      passage: "Animals live in the jungle. They hunt and play among the trees. Monkeys swing from branch to branch while colorful birds sing beautiful songs.",
      difficulty: "Medium",
      readTime: "2 min",
      icon: "🌳",
      gradient: "from-green-500 to-emerald-400",
      questions: [
        { question: "Where do animals live?", answer: "in the jungle", options: ["in the jungle", "in the city", "in the ocean"] },
        { question: "How do monkeys move?", answer: "swing from branch to branch", options: ["swing from branch to branch", "run on the ground", "swim in water"] }
      ]
    }
  ],
  "VI-X": [
    {
      title: "The Solar System",
      passage: "Our solar system consists of the sun and eight planets. Each planet is unique with different characteristics, temperatures, and atmospheric conditions that make them fascinating to study.",
      difficulty: "Hard",
      readTime: "3 min",
      icon: "🌌",
      gradient: "from-purple-600 to-blue-500",
      questions: [
        { question: "How many planets are in our solar system?", answer: "eight", options: ["eight", "nine", "seven"] },
        { question: "What makes planets fascinating to study?", answer: "different characteristics", options: ["different characteristics", "same size", "same color"] }
      ]
    }
  ]
};

const leaderboardData = [
  { name: "Aanya", score: 100, avatar: "🏆", rank: 1 },
  { name: "Veer", score: 99, avatar: "🥈", rank: 2 },
  { name: "Riya", score: 98, avatar: "🥉", rank: 3 },
];

export default function ReadingPage() {
  const [group, setGroup] = useState("I-II");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedPassage, setSelectedPassage] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [highlightedWord, setHighlightedWord] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [slowMode, setSlowMode] = useState(false);
  
  const wordTimers = useRef([]);
  const synthRef = useRef(null);

  function tokenize(text) {
    return text.match(/\b[\w'-]+\b|[.,!?;]|\s+/g) || [];
  }

  const tokens = selectedPassage ? tokenize(selectedPassage.passage) : [];
  const words = tokens.filter(token => /\w/.test(token));
  const progressPercent = highlightedWord === null ? 0 : Math.round(((highlightedWord + 1) / words.length) * 100);

 function getWordDelay(word, base = 1000, perChar = 70) {
  // Adjust base and perChar to taste.
  let delay = base + word.length * perChar * word.length;
  if (/[.,!?;:]$/.test(word)) {
    delay += 200; // extra pause for punctuation
  }
  return delay;
}

const readSlowly = () => {
  if (!selectedPassage) return;
  setIsSpeaking(true);
  setHighlightedWord(-1);
  window.speechSynthesis.cancel();

  wordTimers.current.forEach(timer => clearTimeout(timer));
  wordTimers.current = [];

  let totalDelay = 0;
  words.forEach((word, index) => {
    let wordDelay = getWordDelay(word);
    if (index === 0) {
      wordDelay = wordDelay*2;
    }
    const timer = setTimeout(() => {
      setHighlightedWord(index);

      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8;
      utterance.onend = () => {
        if (index === words.length - 1) {
          setIsSpeaking(false);
        }
      };
      window.speechSynthesis.speak(utterance);
    }, totalDelay);
    wordTimers.current.push(timer);
    totalDelay += wordDelay;
  });
};

  const readPassage = () => {
    if (slowMode) {
      readSlowly();
      return;
    }
    
    if (!selectedPassage || isSpeaking) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(true);
    setHighlightedWord(-1);

    const utter = new SpeechSynthesisUtterance(selectedPassage.passage);
    utter.rate = 0.9;
    utter.lang = "en-US";
    
    let charIndex = 0;
    const wordIndices = tokens.reduce((acc, token) => {
      if (/\w/.test(token)) {
        acc.push(charIndex);
      }
      charIndex += token.length;
      return acc;
    }, []);

    utter.onboundary = (event) => {
      if (event.name === "word") {
        const wordIndex = wordIndices.findIndex(start => start >= event.charIndex);
        if (wordIndex >= 0) {
          setHighlightedWord(wordIndex);
        }
      }
    };

    utter.onend = () => {
      setIsSpeaking(false);
      setHighlightedWord(wordIndices.length - 1);
    };

    synthRef.current = utter;
    window.speechSynthesis.speak(utter);
  };

  const handlePauseReading = () => {
    setIsSpeaking(false);
    window.speechSynthesis.cancel();
    wordTimers.current.forEach(timer => clearTimeout(timer));
    wordTimers.current = [];
  };

  const handleResetReading = () => {
    handlePauseReading();
    setHighlightedWord(null);
  };

  useEffect(() => {
    return () => {
      handlePauseReading();
    };
  }, []);

  const handlePassageSelect = (passage) => {
    setSelectedPassage(passage);
    setShowQuiz(false);
    setQuizComplete(false);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setScore(0);
    setHighlightedWord(null);
    setIsSpeaking(false);
    window.speechSynthesis.cancel();
  };

  const handleStartQuiz = () => {
    if (!selectedPassage || !selectedPassage.questions) return;
    setShowQuiz(true);
    setCurrentQuestion(0);
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setHighlightedWord(null);
  };

  const handleAnswerSelect = (answer) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answer;
    setUserAnswers(newAnswers);

    if (currentQuestion < selectedPassage.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      const correctAnswers = selectedPassage.questions.filter((q, index) =>
        q.answer === newAnswers[index]
      ).length;
      const finalScore = Math.round((correctAnswers / selectedPassage.questions.length) * 100);
      setScore(finalScore);
      setQuizComplete(true);
    }
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setHighlightedWord(null);
  };

  const renderHighlightedText = () => (
  <div className="flex flex-wrap justify-center gap-1">
    {tokens.map((token, index) => {
      const isWord = /\w/.test(token);
      const wordIndex = tokens.slice(0, index).filter(t => /\w/.test(t)).length - 1;
      const isHighlighted = isWord && highlightedWord === wordIndex;
      
      return (
        <span
          key={index}
          className={`inline-block mx-1 py-2 px-3 rounded-lg transition-all duration-300 text-lg font-medium ${
            isHighlighted
              ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white scale-110 shadow-lg"
              : "text-white/80"
          }`}
        >
          {token}
        </span>
      );
    })}
  </div>
);

  const renderReadingControls = () => (
    <div className="flex items-center gap-4 flex-wrap">
      <button
        onClick={readPassage}
        disabled={isSpeaking}
        className="relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 px-6 rounded-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 group"
      >
        <div className="relative flex items-center gap-2">
          <PlayCircle className="w-5 h-5" />
          <span>{isSpeaking ? "Reading..." : "Start Reading"}</span>
        </div>
      </button>
      <button
        onClick={handlePauseReading}
        disabled={!isSpeaking}
        className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-3 px-6 rounded-xl transform hover:scale-105 transition-all duration-300 group"
      >
        <div className="relative flex items-center gap-2">
          <Pause className="w-5 h-5" />
          <span>Pause</span>
        </div>
      </button>
      <button
        onClick={handleResetReading}
        className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 px-6 rounded-xl transform hover:scale-105 transition-all duration-300 group"
      >
        <div className="relative flex items-center gap-2">
          <RotateCcw className="w-5 h-5" />
          <span>Reset</span>
        </div>
      </button>
      <button
        onClick={() => setSlowMode(!slowMode)}
        className={`relative overflow-hidden ${
          slowMode 
            ? "bg-gradient-to-r from-purple-500 to-pink-500" 
            : "bg-gradient-to-r from-gray-500 to-gray-600"
        } text-white font-bold py-3 px-6 rounded-xl transform hover:scale-105 transition-all duration-300 group`}
      >
        <div className="relative flex items-center gap-2">
          <Turtle className="w-5 h-5" />
          <span>Slow Mode: {slowMode ? "ON" : "OFF"}</span>
        </div>
      </button>
    </div>
  );

  if (selectedPassage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-red-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-gradient-to-r from-green-400/25 to-teal-400/25 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        <div className="relative z-10 py-8 px-4">
          {!showQuiz ? (
            <>
              <div className="max-w-6xl mx-auto mb-8">
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setSelectedPassage(null)}
                        className="bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold py-2 px-4 rounded-xl hover:scale-105 transition-transform duration-300"
                      >
                        ← Back
                      </button>
                      <div className={`relative bg-gradient-to-r ${selectedPassage.gradient} rounded-2xl p-4`}>
                        <div className="text-4xl">{selectedPassage.icon}</div>
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold text-white">{selectedPassage.title}</h1>
                        <div className="flex items-center gap-4 mt-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            selectedPassage.difficulty === 'Easy' ? 'bg-green-500/20 text-green-300' :
                            selectedPassage.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-red-500/20 text-red-300'
                          }`}>
                            {selectedPassage.difficulty}
                          </span>
                          <span className="text-white/70">{selectedPassage.readTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-white/80 font-bold text-xl">
                      {words.length} words
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="max-w-6xl mx-auto mb-8">
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl">
                  {renderReadingControls()}
                  
                  <div className="mt-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Eye className="text-blue-400 w-5 h-5" />
                      <span className="text-white/80 font-medium">Reading Progress</span>
                    </div>
                    <div className="relative">
                      <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 ease-out relative"
                          style={{ width: `${progressPercent}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
                        </div>
                      </div>
                      <div className="absolute right-0 top-0 transform translate-y-6">
                        <span className="text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-purple-500 px-3 py-1 rounded-full">
                          {progressPercent}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="max-w-6xl mx-auto mb-8">
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
                  <div className="text-center leading-relaxed">
                    {renderHighlightedText()}
                  </div>
                </div>
              </div>
              
              <div className="max-w-6xl mx-auto">
                <div className="text-center">
                  <button
                    onClick={handleStartQuiz}
                    className="relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-2xl transform hover:scale-105 transition-all duration-300 group"
                  >
                    <div className="relative flex items-center gap-3">
                      <Brain className="w-6 h-6" />
                      <span className="text-xl">Take Comprehension Quiz</span>
                      <ChevronRight className="w-6 h-6" />
                    </div>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="max-w-4xl mx-auto">
              {!quizComplete ? (
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-white">Comprehension Quiz</h2>
                      <span className="text-white/80">
                        Question {currentQuestion + 1} of {selectedPassage.questions.length}
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestion + 1) / selectedPassage.questions.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-6">
                      {selectedPassage.questions[currentQuestion].question}
                    </h3>
                    <div className="space-y-3">
                      {selectedPassage.questions[currentQuestion].options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(option)}
                          className="w-full text-left bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl p-4 text-white font-medium transition-all duration-300 hover:scale-105"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl text-center">
                  <div className="mb-6">
                    <div className="text-6xl mb-4">
                      {score >= 80 ? '🏆' : score >= 60 ? '⭐' : '📚'}
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h2>
                    <div className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                      {score}%
                    </div>
                  </div>
                  <div className="space-y-4 mb-8">
                    {selectedPassage.questions.map((question, index) => (
                      <div key={index} className="bg-white/10 border border-white/20 rounded-xl p-4 text-left">
                        <p className="text-white font-medium mb-2">{question.question}</p>
                        <div className="flex gap-4">
                          <span className="text-green-300">✓ Correct: {question.answer}</span>
                          {userAnswers[index] !== question.answer && (
                            <span className="text-red-300">✗ Your answer: {userAnswers[index]}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => setSelectedPassage(null)}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-6 rounded-xl hover:scale-105 transition-transform duration-300"
                    >
                      Choose Another Passage
                    </button>
                    <button
                      onClick={() => {
                        setShowQuiz(false);
                        setQuizComplete(false);
                        setCurrentQuestion(0);
                        setUserAnswers([]);
                      }}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 px-6 rounded-xl hover:scale-105 transition-transform duration-300"
                    >
                      Read Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Landing page UI remains the same as in your original code
   return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-red-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-gradient-to-r from-green-400/25 to-teal-400/25 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
      <div className="relative z-10 py-8 px-4">
        <div className="max-w-6xl mx-auto mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl blur-lg opacity-75 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-6 transform hover:scale-110 transition-transform duration-300">
                    <BookOpen className="text-white w-12 h-12" />
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="text-5xl font-black bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-3">
                    Interactive Reading Room
                  </h1>
                  <p className="text-xl text-white/80 leading-relaxed">
                    Natural word-by-word highlighting and narration. Follow along as each word lights up and is spoken aloud.
                  </p>
                </div>
                <div className="hidden lg:block">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-lg opacity-50 animate-spin-slow"></div>
                    <div className="relative bg-gradient-to-r from-pink-500 to-purple-500 rounded-full p-4">
                      <Sparkles className="text-white w-8 h-8" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto mb-8">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-2 shadow-2xl">
            <div className="flex gap-2">
              {classGroups.map((cg) => (
                <button
                  key={cg.value}
                  onClick={() => setGroup(cg.value)}
                  className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 relative overflow-hidden group ${
                    group === cg.value
                      ? `bg-gradient-to-r ${cg.color} text-white shadow-lg scale-105`
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">{cg.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto mb-8">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="text-blue-400 w-5 h-5" />
                  <span className="text-white/80 font-medium">Reading Progress</span>
                  <span className="text-white font-bold">{progressPercent}%</span>
                </div>
                <div className="relative">
                  <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out relative"
                      style={{ width: `${progressPercent}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 px-6 rounded-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 group">
                  <Target className="w-5 h-5" />
                  <span>Goals</span>
                </button>
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 group">
                  <Award className="w-5 h-5" />
                  <span>Achievements</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-3">
                  <BookOpen className="text-white w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  Choose a Passage
                </h2>
              </div>
              <div className="grid gap-4">
                {passages[group].map((passage, index) => (
                  <div
                    key={index}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => handlePassageSelect(passage)}
                    className="group relative overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    <div
                      className={`relative bg-gradient-to-r ${passage.gradient} rounded-xl p-1`}
                    >
                      <div className="bg-black/30 backdrop-blur-sm rounded-lg p-5">
                        <div className="flex items-center gap-4">
                          <div className="text-4xl">{passage.icon}</div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-2">
                              {passage.title}
                            </h3>
                            <p className="text-white/80 mb-3 line-clamp-2">
                              {passage.passage}
                            </p>
                            <div className="flex items-center gap-3">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  passage.difficulty === "Easy"
                                    ? "bg-green-500/20 text-green-300"
                                    : passage.difficulty === "Medium"
                                    ? "bg-yellow-500/20 text-yellow-300"
                                    : "bg-red-500/20 text-red-300"
                                }`}
                              >
                                {passage.difficulty}
                              </span>
                              <span className="text-white/70 text-sm">
                                {passage.readTime}
                              </span>
                            </div>
                          </div>
                          <ChevronRight
                            className={`w-6 h-6 text-white transition-transform duration-300 ${
                              hoveredCard === index ? "translate-x-2" : ""
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-3">
                  <Trophy className="text-white w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white">Leaderboard</h2>
              </div>
              <div className="space-y-3">
                {leaderboardData.map((user, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="text-2xl">{user.avatar}</div>
                    <div className="flex-1">
                      <p className="font-bold text-white">{user.name}</p>
                      <p className="text-white/70 text-sm">Rank #{user.rank}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">{user.score}</p>
                      <p className="text-white/70 text-sm">points</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-xl p-3">
                  <Star className="text-white w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white">Your Stats</h2>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Stories Read</span>
                  <span className="font-bold text-white">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Reading Speed</span>
                  <span className="font-bold text-green-400">150 WPM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Accuracy</span>
                  <span className="font-bold text-blue-400">95%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Streak</span>
                  <span className="font-bold text-orange-400">7 days</span>
                </div>
              </div>
            </div>
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl p-3">
                  <Lightbulb className="text-white w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white">Reading Tip</h2>
              </div>
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-300/20 rounded-xl p-4">
                <p className="text-white/90 text-sm leading-relaxed">
                  💡 <strong>Focus Mode:</strong> Try following the highlighted word with your eyes without looking ahead. This helps improve concentration and reading flow!
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full p-4 w-16 h-16 mx-auto mb-4 group-hover:animate-bounce">
                <Volume2 className="text-white w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Audio Active</h3>
              <p className="text-white/70 text-sm">
                Voice narration is enabled - words will be spoken as they highlight!
              </p>
            </div>
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-4 w-16 h-16 mx-auto mb-4 group-hover:animate-bounce delay-100">
                <Zap className="text-white w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Speed Training</h3>
              <p className="text-white/70 text-sm">Gradually increase your reading speed with adjustable pacing</p>
            </div>
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-4 w-16 h-16 mx-auto mb-4 group-hover:animate-bounce delay-200">
                <Users className="text-white w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Compete & Share</h3>
              <p className="text-white/70 text-sm">Challenge friends and share your reading achievements</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}