import React, { useState, useEffect } from "react";
import {
  Star,
  BookOpen,
  Trophy,
  Zap,
  Globe,
  ChevronRight,
  ChevronLeft,
  FileText,
  Clock,
  Target,
  Brain,
  Award,
  Home,
  Settings,
  User,
  Play,
  RotateCcw,
  ArrowRight,
  Check,
  X,
  Lightbulb,
  SkipForward,
  RefreshCw,
  TrendingUp,
  Heart,
  Flame,
  Timer,
  CheckCircle,
  XCircle,
  GraduationCap,
  BarChart2,
  Users as UsersIcon,
  HelpCircle,
} from "lucide-react";

// -------- SHARED SAMPLE DATA --------
const sampleQuestions = [
  {
    id: 1,
    type: "multiple-choice",
    question: "Which of the following is a proper noun?",
    options: ["city", "London", "building", "street"],
    correct: 1,
    explanation:
      "London is a proper noun because it names a specific city. Proper nouns are always capitalized.",
    hint: "Look for the word that names a specific place, person, or thing.",
  },
  {
    id: 2,
    type: "classification",
    question: "Classify the following words as Common (C) or Proper (P) nouns:",
    words: ["dog", "Rover", "teacher", "Mrs. Smith"],
    correct: ["C", "P", "C", "P"],
    explanation:
      "Common nouns are general names (dog, teacher), while proper nouns name specific things (Rover, Mrs. Smith).",
    hint: "Proper nouns are usually capitalized and name specific people, places, or things.",
  },
  {
    id: 3,
    type: "fill-blank",
    question: "Complete the sentence with the correct type of noun:",
    sentence: "My favorite _____ is chocolate, but I also love _____.",
    blanks: ["food", "Pizza Hut"],
    types: ["common", "proper"],
    explanation:
      "Food is a common noun (general category), while Pizza Hut is a proper noun (specific restaurant name).",
    hint: "The first blank needs a general category, the second needs a specific name.",
  },
  {
    id: 4,
    type: "true-false",
    question: "True or False: All proper nouns must be capitalized.",
    correct: true,
    explanation:
      "True! Proper nouns are always capitalized because they name specific people, places, or things.",
    hint: "Think about how names of people and places are written.",
  },
  {
    id: 5,
    type: "multiple-choice",
    question: "Which sentence uses proper nouns correctly?",
    options: [
      "I live in new york city.",
      "I live in New York city.",
      "I live in New York City.",
      "i live in New York City.",
    ],
    correct: 2,
    explanation:
      'All parts of a proper noun should be capitalized. "New York City" is the complete proper noun.',
    hint: "Check the capitalization of each word in the place name.",
  },
];

// -------- SHARED QUESTION UI --------
function ClassificationQuestion({
  question,
  onAnswer,
  showFeedback,
  selectedAnswer,
  disabled,
}) {
  const [answers, setAnswers] = useState(Array(question.words.length).fill(""));
  useEffect(() => {
    setAnswers(Array(question.words.length).fill(""));
  }, [question]);
  const handleAnswerChange = (idx, value) => {
    const newAnswers = [...answers];
    newAnswers[idx] = value;
    setAnswers(newAnswers);
    if (newAnswers.every((a) => a !== "")) onAnswer(newAnswers);
  };
  return (
    <div className="space-y-4">
      {question.words.map((word, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 bg-white/5 rounded-xl"
        >
          <span className="text-lg text-white font-semibold w-24">{word}</span>
          <div className="flex gap-2">
            {["C", "P"].map((option) => (
              <button
                key={option}
                onClick={() => handleAnswerChange(i, option)}
                disabled={showFeedback || disabled}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  answers[i] === option
                    ? showFeedback
                      ? selectedAnswer &&
                        selectedAnswer[i] === question.correct[i]
                        ? "bg-green-400/20 text-green-300 border-2 border-green-400"
                        : "bg-red-400/20 text-red-300 border-2 border-red-400"
                      : "bg-yellow-400/20 text-yellow-300 border-2 border-yellow-400"
                    : showFeedback && option === question.correct[i]
                    ? "bg-green-400/20 text-green-300 border-2 border-green-400"
                    : "bg-white/10 text-white border-2 border-white/20 hover:border-cyan-400"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function FillBlankQuestion({
  question,
  onAnswer,
  showFeedback,
  selectedAnswer,
  disabled,
}) {
  const [answers, setAnswers] = useState(
    Array(question.blanks.length).fill("")
  );
  useEffect(() => {
    setAnswers(Array(question.blanks.length).fill(""));
  }, [question]);
  const handleAnswerChange = (idx, value) => {
    const newAnswers = [...answers];
    newAnswers[idx] = value;
    setAnswers(newAnswers);
    if (newAnswers.every((a) => a.trim() !== "")) onAnswer(newAnswers);
  };
  return (
    <div className="space-y-6">
      <div className="text-lg text-white/90 leading-relaxed text-center">
        {question.sentence.split("_____").map((part, idx) => (
          <span key={idx}>
            {part}
            {idx < question.blanks.length && (
              <input
                type="text"
                value={answers[idx]}
                onChange={(e) => handleAnswerChange(idx, e.target.value)}
                disabled={showFeedback || disabled}
                className={`mx-2 px-3 py-1 bg-white/10 border-2 rounded-lg text-white font-semibold min-w-[120px] text-center ${
                  showFeedback
                    ? selectedAnswer &&
                      selectedAnswer[idx]?.toLowerCase().trim() ===
                        question.blanks[idx].toLowerCase().trim()
                      ? "border-green-400 bg-green-400/20"
                      : "border-red-400 bg-red-400/20"
                    : "border-white/30 focus:border-cyan-400 focus:outline-none"
                }`}
                placeholder={`${question.types[idx]} noun`}
              />
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

// -------- PRACTICE MODE --------
function PracticeMode({ onBack, onSummary }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showHint, setShowHint] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [xpGained, setXpGained] = useState(0);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    total: 0,
    hintsUsed: 0,
    timeSpent: 0,
  });
  const [showCompletion, setShowCompletion] = useState(false);

  const question = sampleQuestions[currentQuestion];
  const isLastQuestion = currentQuestion === sampleQuestions.length - 1;

  useEffect(() => {
    setShowHint(false);
    setShowFeedback(false);
    setSelectedAnswer(null);
  }, [currentQuestion]);
  const checkAnswer = (answer) => {
    switch (question.type) {
      case "multiple-choice":
        return answer === question.correct;
      case "true-false":
        return answer === question.correct;
      case "classification":
        return JSON.stringify(answer) === JSON.stringify(question.correct);
      case "fill-blank":
        return answer.every(
          (ans, idx) =>
            ans.toLowerCase().trim() ===
            question.blanks[idx].toLowerCase().trim()
        );
      default:
        return false;
    }
  };
  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);
    const isCorrect = checkAnswer(answer);
    const newStats = { ...sessionStats, total: sessionStats.total + 1 };
    if (isCorrect) {
      newStats.correct += 1;
      setScore(score + (streak >= 3 ? 20 : 10));
      setStreak(streak + 1);
      setXpGained(xpGained + (streak >= 3 ? 20 : 10));
    } else {
      setStreak(0);
      setHearts(Math.max(0, hearts - 1));
    }
    setSessionStats(newStats);
    setUserAnswers({ ...userAnswers, [currentQuestion]: answer });
  };
  const handleNext = () => {
    setShowFeedback(false);
    setShowHint(false);
    setSelectedAnswer(null);
    if (isLastQuestion) setShowCompletion(true);
    else setCurrentQuestion(currentQuestion + 1);
  };
  const handleRestart = () => {
    setCurrentQuestion(0);
    setUserAnswers({});
    setShowHint(false);
    setShowFeedback(false);
    setSelectedAnswer(null);
    setScore(0);
    setStreak(0);
    setHearts(3);
    setXpGained(0);
    setSessionStats({ correct: 0, total: 0, hintsUsed: 0, timeSpent: 0 });
    setShowCompletion(false);
  };
  const useHint = () => {
    setShowHint(true);
    setSessionStats({ ...sessionStats, hintsUsed: sessionStats.hintsUsed + 1 });
  };
  const renderQuestion = () => {
    switch (question.type) {
      case "multiple-choice":
        return (
          <div className="space-y-4">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={showFeedback}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-300 ${
                  selectedAnswer === idx
                    ? showFeedback
                      ? checkAnswer(idx)
                        ? "border-green-400 bg-green-400/20 text-green-300"
                        : "border-red-400 bg-red-400/20 text-red-300"
                      : "border-yellow-400 bg-yellow-400/20 text-yellow-300"
                    : showFeedback && idx === question.correct
                    ? "border-green-400 bg-green-400/20 text-green-300"
                    : "border-white/20 bg-white/10 text-white hover:border-cyan-400 hover:bg-cyan-400/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{option}</span>
                  {showFeedback &&
                    (selectedAnswer === idx ? (
                      checkAnswer(idx) ? (
                        <Check className="w-6 h-6 text-green-400" />
                      ) : (
                        <X className="w-6 h-6 text-red-400" />
                      )
                    ) : idx === question.correct ? (
                      <Check className="w-6 h-6 text-green-400" />
                    ) : null)}
                </div>
              </button>
            ))}
          </div>
        );
      case "true-false":
        return (
          <div className="flex gap-6 justify-center">
            {[true, false].map((option) => (
              <button
                key={option.toString()}
                onClick={() => handleAnswer(option)}
                disabled={showFeedback}
                className={`px-12 py-6 text-xl font-bold rounded-2xl border-2 transition-all duration-300 ${
                  selectedAnswer === option
                    ? showFeedback
                      ? checkAnswer(option)
                        ? "border-green-400 bg-green-400/20 text-green-300"
                        : "border-red-400 bg-red-400/20 text-red-300"
                      : "border-yellow-400 bg-yellow-400/20 text-yellow-300"
                    : showFeedback && option === question.correct
                    ? "border-green-400 bg-green-400/20 text-green-300"
                    : "border-white/20 bg-white/10 text-white hover:border-cyan-400 hover:bg-cyan-400/20"
                }`}
              >
                {option ? "TRUE" : "FALSE"}
              </button>
            ))}
          </div>
        );
      case "classification":
        return (
          <ClassificationQuestion
            question={question}
            onAnswer={handleAnswer}
            showFeedback={showFeedback}
            selectedAnswer={selectedAnswer}
            disabled={showFeedback}
          />
        );
      case "fill-blank":
        return (
          <FillBlankQuestion
            question={question}
            onAnswer={handleAnswer}
            showFeedback={showFeedback}
            selectedAnswer={selectedAnswer}
            disabled={showFeedback}
          />
        );
      default:
        return null;
    }
  };

  if (showCompletion) {
    return (
      <SummaryPage
        mode="Practice"
        stats={sessionStats}
        score={score}
        xpGained={xpGained}
        onRestart={handleRestart}
        onBackToMenu={onBack}
        onShowSummary={() => {
          // Pass current results to parent
          onSummary({
            stats: sessionStats,
            score,
            xpGained,
            answers: userAnswers,
          });
          // Then navigate back
          onBack();
        }}
        answers={userAnswers}
        userAnswers={userAnswers}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-pink-400 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-cyan-400 rounded-full opacity-20 animate-pulse"></div>
      </div>
      <div className="relative z-10 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                onClick={onBack}
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-cyan-400" />
                  Practice Mode
                </h1>
                <p className="text-sm text-white/70">Common & Proper Nouns</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="hidden md:block">
                <div className="text-sm text-white/70 mb-1">
                  Question {currentQuestion + 1} of {sampleQuestions.length}
                </div>
                <div className="w-32 bg-white/20 rounded-full h-2">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        ((currentQuestion + 1) / sampleQuestions.length) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="text-white font-bold">{streak}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-bold">{score}</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(3)].map((_, i) => (
                    <Heart
                      key={i}
                      className={`w-5 h-5 ${
                        i < hearts
                          ? "text-red-400 fill-current"
                          : "text-white/30"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 mb-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-cyan-500/20 px-4 py-2 rounded-full mb-4">
                <Target className="w-5 h-5 text-cyan-400" />
                <span className="text-cyan-300 font-semibold">
                  Question {currentQuestion + 1}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {question.question}
              </h2>
            </div>
            {renderQuestion()}
            {showHint && (
              <div className="mt-6 p-4 bg-yellow-400/20 border border-yellow-400/30 rounded-xl">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-yellow-300 font-semibold mb-1">
                      Hint:
                    </h4>
                    <p className="text-white/90">{question.hint}</p>
                  </div>
                </div>
              </div>
            )}
            {showFeedback && (
              <div
                className={`mt-6 p-4 rounded-xl border ${
                  checkAnswer(selectedAnswer)
                    ? "bg-green-400/20 border-green-400/30"
                    : "bg-red-400/20 border-red-400/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  {checkAnswer(selectedAnswer) ? (
                    <Check className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  ) : (
                    <X className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                  )}
                  <div>
                    <h4
                      className={`font-semibold mb-1 ${
                        checkAnswer(selectedAnswer)
                          ? "text-green-300"
                          : "text-red-300"
                      }`}
                    >
                      {checkAnswer(selectedAnswer)
                        ? "Correct!"
                        : "Not quite right"}
                    </h4>
                    <p className="text-white/90">{question.explanation}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!showFeedback ? (
              <button
                onClick={useHint}
                disabled={showHint}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  showHint
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-yellow-500/20 border border-yellow-400/30 text-yellow-300 hover:bg-yellow-500/30"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  {showHint ? "Hint Used" : "Use Hint"}
                </div>
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-lg rounded-2xl shadow-2xl hover:scale-105 transform transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  {isLastQuestion ? (
                    <>
                      <Trophy className="w-6 h-6" />
                      Complete Practice
                    </>
                  ) : (
                    <>
                      Next Question
                      <ArrowRight className="w-6 h-6" />
                    </>
                  )}
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// -------- TEST MODE --------
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function TestMode({ onBack, onSummary }) {
  const [questions] = useState(shuffleArray(sampleQuestions));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);

  const [startTime] = useState(Date.now());
  const [endTime, setEndTime] = useState(null);

  const question = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const timeSpent = endTime
    ? Math.round((endTime - startTime) / 1000)
    : Math.round((Date.now() - startTime) / 1000);

  const checkAnswer = (answer) => {
    switch (question.type) {
      case "multiple-choice":
        return answer === question.correct;
      case "true-false":
        return answer === question.correct;
      case "classification":
        return JSON.stringify(answer) === JSON.stringify(question.correct);
      case "fill-blank":
        return answer.every(
          (ans, idx) =>
            ans.toLowerCase().trim() ===
            question.blanks[idx].toLowerCase().trim()
        );
      default:
        return false;
    }
  };

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);
    setUserAnswers({ ...userAnswers, [currentQuestion]: answer });
    if (checkAnswer(answer)) setScore(score + 10);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    if (isLastQuestion) {
      setEndTime(Date.now());
      setShowCompletion(true);
    } else setCurrentQuestion(currentQuestion + 1);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setUserAnswers({});
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setEndTime(null);
    setShowCompletion(false);
    setHintsUsed(0);
  };

  const renderQuestion = () => {
    switch (question.type) {
      case "multiple-choice":
        return (
          <div className="space-y-4">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={showFeedback}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-300 ${
                  selectedAnswer === idx
                    ? "border-yellow-400 bg-yellow-400/20 text-yellow-300"
                    : "border-white/20 bg-white/10 text-white hover:border-cyan-400 hover:bg-cyan-400/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{option}</span>
                </div>
              </button>
            ))}
          </div>
        );
      case "true-false":
        return (
          <div className="flex gap-6 justify-center">
            {[true, false].map((option) => (
              <button
                key={option.toString()}
                onClick={() => handleAnswer(option)}
                disabled={showFeedback}
                className={`px-12 py-6 text-xl font-bold rounded-2xl border-2 transition-all duration-300 ${
                  selectedAnswer === option
                    ? "border-yellow-400 bg-yellow-400/20 text-yellow-300"
                    : "border-white/20 bg-white/10 text-white hover:border-cyan-400 hover:bg-cyan-400/20"
                }`}
              >
                {option ? "TRUE" : "FALSE"}
              </button>
            ))}
          </div>
        );
      case "classification":
        return (
          <ClassificationQuestion
            question={question}
            onAnswer={handleAnswer}
            showFeedback={false}
            selectedAnswer={null}
            disabled={false}
          />
        );
      case "fill-blank":
        return (
          <FillBlankQuestion
            question={question}
            onAnswer={handleAnswer}
            showFeedback={false}
            selectedAnswer={null}
            disabled={false}
          />
        );
      default:
        return null;
    }
  };

  if (showCompletion) {
    const correct = Object.keys(userAnswers).filter((i) => {
      const idx = parseInt(i, 10);
      return checkAnswer(userAnswers[idx]);
    }).length;
    return (
      <SummaryPage
        mode="Test"
        stats={{ correct, total: questions.length, hintsUsed, timeSpent }}
        score={score}
        xpGained={score}
        onRestart={handleRestart}
        onBackToMenu={onBack}
        onShowSummary={onSummary}
        answers={userAnswers}
        userAnswers={userAnswers}
        questions={questions}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-yellow-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-red-400 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
      </div>
      <div className="relative z-10 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                onClick={onBack}
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-6 h-6 text-orange-400" />
                  Test Mode
                </h1>
                <p className="text-sm text-white/70">Common & Proper Nouns</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="hidden md:block">
                <div className="text-sm text-white/70 mb-1">
                  Question {currentQuestion + 1} of {questions.length}
                </div>
                <div className="w-32 bg-white/20 rounded-full h-2">
                  <div
                    className="h-full bg-gradient-to-r from-orange-400 to-red-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        ((currentQuestion + 1) / questions.length) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-bold">{score}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-bold">{timeSpent}s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 mb-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-orange-500/20 px-4 py-2 rounded-full mb-4">
                <Target className="w-5 h-5 text-orange-400" />
                <span className="text-orange-300 font-semibold">
                  Question {currentQuestion + 1}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {question.question}
              </h2>
            </div>
            {renderQuestion()}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {showFeedback && (
              <button
                onClick={handleNext}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg rounded-2xl shadow-2xl hover:scale-105 transform transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  {isLastQuestion ? (
                    <>
                      <Trophy className="w-6 h-6" />
                      Complete Test
                    </>
                  ) : (
                    <>
                      Next Question
                      <ArrowRight className="w-6 h-6" />
                    </>
                  )}
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// -------- QUIZ MODE --------
function QuizMode({ onBack, onSummary }) {
  const [questions] = useState(shuffleArray(sampleQuestions));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  const [timer, setTimer] = useState(15);
  const [intervalId, setIntervalId] = useState(null);
  const [times, setTimes] = useState([]);

  useEffect(() => {
    if (showCompletion) return;
    setTimer(15);
    if (intervalId) clearInterval(intervalId);
    const id = setInterval(() => setTimer((t) => (t > 0 ? t - 1 : 0)), 1000);
    setIntervalId(id);
    return () => clearInterval(id);
  }, [currentQuestion, showCompletion]);

  useEffect(() => {
    if (timer === 0 && !showFeedback && !showCompletion) {
      handleAnswer(null, true);
    }
  }, [timer]);

  const question = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;

  const checkAnswer = (answer) => {
    switch (question.type) {
      case "multiple-choice":
        return answer === question.correct;
      case "true-false":
        return answer === question.correct;
      case "classification":
        return JSON.stringify(answer) === JSON.stringify(question.correct);
      case "fill-blank":
        return (
          answer &&
          answer.every(
            (ans, idx) =>
              ans.toLowerCase().trim() ===
              question.blanks[idx].toLowerCase().trim()
          )
        );
      default:
        return false;
    }
  };

  const handleAnswer = (answer, isTimeout = false) => {
    if (intervalId) clearInterval(intervalId);
    setSelectedAnswer(answer);
    setShowFeedback(true);
    setUserAnswers({ ...userAnswers, [currentQuestion]: answer });
    let qScore = 0;
    if (!isTimeout && checkAnswer(answer)) {
      qScore = 5 + Math.max(1, Math.round((timer / 15) * 5));
      setScore((s) => s + qScore);
    }
    setTimes([...times, 15 - timer]);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    if (isLastQuestion) {
      setShowCompletion(true);
      if (intervalId) clearInterval(intervalId);
    } else setCurrentQuestion(currentQuestion + 1);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setUserAnswers({});
    setSelectedAnswer(null);
    setScore(0);
    setShowFeedback(false);
    setShowCompletion(false);
    setTimer(15);
    setTimes([]);
    if (intervalId) clearInterval(intervalId);
  };

  const renderQuestion = () => {
    switch (question.type) {
      case "multiple-choice":
        return (
          <div className="space-y-4">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={showFeedback}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-300 ${
                  selectedAnswer === idx
                    ? "border-yellow-400 bg-yellow-400/20 text-yellow-300"
                    : "border-white/20 bg-white/10 text-white hover:border-cyan-400 hover:bg-cyan-400/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{option}</span>
                </div>
              </button>
            ))}
          </div>
        );
      case "true-false":
        return (
          <div className="flex gap-6 justify-center">
            {[true, false].map((option) => (
              <button
                key={option.toString()}
                onClick={() => handleAnswer(option)}
                disabled={showFeedback}
                className={`px-12 py-6 text-xl font-bold rounded-2xl border-2 transition-all duration-300 ${
                  selectedAnswer === option
                    ? "border-yellow-400 bg-yellow-400/20 text-yellow-300"
                    : "border-white/20 bg-white/10 text-white hover:border-cyan-400 hover:bg-cyan-400/20"
                }`}
              >
                {option ? "TRUE" : "FALSE"}
              </button>
            ))}
          </div>
        );
      case "classification":
        return (
          <ClassificationQuestion
            question={question}
            onAnswer={handleAnswer}
            showFeedback={false}
            selectedAnswer={null}
            disabled={false}
          />
        );
      case "fill-blank":
        return (
          <FillBlankQuestion
            question={question}
            onAnswer={handleAnswer}
            showFeedback={false}
            selectedAnswer={null}
            disabled={false}
          />
        );
      default:
        return null;
    }
  };

  // In the QuizMode component, modify the showCompletion condition to properly check answers:
  if (showCompletion) {
    const correct = Object.keys(userAnswers).filter((i) => {
      const idx = parseInt(i, 10);
      const q = questions[idx];
      const ua = userAnswers[idx];

      switch (q.type) {
        case "multiple-choice":
          return ua === q.correct;
        case "true-false":
          return ua === q.correct;
        case "classification":
          return ua && JSON.stringify(ua) === JSON.stringify(q.correct);
        case "fill-blank":
          return (
            ua &&
            ua.every(
              (ans, i) =>
                ans.toLowerCase().trim() === q.blanks[i].toLowerCase().trim()
            )
          );
        default:
          return false;
      }
    }).length;

    return (
      <SummaryPage
        mode="Quiz"
        stats={{
          correct,
          total: questions.length,
          hintsUsed: 0,
          timeSpent: times.reduce((a, b) => a + b, 0),
          avgTime:
            times.length > 0
              ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
              : 0,
        }}
        score={score}
        xpGained={score}
        onRestart={handleRestart}
        onBackToMenu={onBack}
        onShowSummary={onSummary}
        answers={userAnswers}
        userAnswers={userAnswers}
        questions={questions}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-cyan-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-pink-400 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-cyan-400 rounded-full opacity-20 animate-pulse"></div>
      </div>
      <div className="relative z-10 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                onClick={onBack}
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Zap className="w-6 h-6 text-pink-400" />
                  Quiz Challenge
                </h1>
                <p className="text-sm text-white/70">Common & Proper Nouns</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="hidden md:block">
                <div className="text-sm text-white/70 mb-1">
                  Question {currentQuestion + 1} of {questions.length}
                </div>
                <div className="w-32 bg-white/20 rounded-full h-2">
                  <div
                    className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        ((currentQuestion + 1) / questions.length) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-bold">{score}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg">
                  <Timer className="w-4 h-4 text-cyan-400" />
                  <span className="text-white font-bold">{timer}s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 mb-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-pink-500/20 px-4 py-2 rounded-full mb-4">
                <Target className="w-5 h-5 text-pink-400" />
                <span className="text-pink-300 font-semibold">
                  Question {currentQuestion + 1}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {question.question}
              </h2>
            </div>
            {renderQuestion()}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {showFeedback && (
              <button
                onClick={handleNext}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg rounded-2xl shadow-2xl hover:scale-105 transform transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  {isLastQuestion ? (
                    <>
                      <Trophy className="w-6 h-6" />
                      Complete Quiz
                    </>
                  ) : (
                    <>
                      Next Question
                      <ArrowRight className="w-6 h-6" />
                    </>
                  )}
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// -------- SUMMARY PAGE --------
function SummaryPage({
  mode,
  stats,
  score,
  xpGained,
  onRestart,
  onBackToMenu,
  answers,
  userAnswers,
  questions,
  sessionResults,
  onShowSessionSummary,
}) {
  const accuracy =
    stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
  const grade =
    accuracy >= 90
      ? "🌟 Excellent!"
      : accuracy >= 70
      ? "🎉 Good Job!"
      : "👍 Keep Practicing!";
  const timeStr = stats.timeSpent !== undefined ? `${stats.timeSpent}s` : "--";
  const avgTime =
    stats.avgTime !== undefined
      ? stats.avgTime
      : stats.timeSpent && stats.total
      ? Math.round(stats.timeSpent / stats.total)
      : 0;

  // Calculate session totals if available
  const sessionTotal = sessionResults
    ? Object.values(sessionResults).reduce(
        (sum, result) => sum + (result?.xpGained || 0),
        0
      )
    : 0;
  const sessionCorrect = sessionResults
    ? Object.values(sessionResults).reduce(
        (sum, result) => sum + (result?.stats.correct || 0),
        0
      )
    : 0;
  const sessionTotalQuestions = sessionResults
    ? Object.values(sessionResults).reduce(
        (sum, result) => sum + (result?.stats.total || 0),
        0
      )
    : 0;
  const sessionAccuracy =
    sessionTotalQuestions > 0
      ? Math.round((sessionCorrect / sessionTotalQuestions) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 text-center shadow-2xl">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4 shadow-xl">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-2 tracking-wide">
            {mode} Summary
          </h2>
          <p className="text-2xl font-bold text-white/90 mb-2">{grade}</p>
          <p className="text-lg text-cyan-200">
            {stats.correct} out of {stats.total} correct • {accuracy}% accuracy
          </p>
        </div>

        {/* Session Summary Button if multiple modes completed */}
        {sessionResults && Object.keys(sessionResults).length > 1 && (
          <div className="mb-6">
            <button
              onClick={onShowSessionSummary}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300"
            >
              View Full Session Summary
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-green-400">
              {stats.correct}
            </div>
            <div className="text-sm text-white/70">Correct</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-blue-400">{accuracy}%</div>
            <div className="text-sm text-white/70">Accuracy</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-yellow-400">{score}</div>
            <div className="text-sm text-white/70">Score</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-purple-400">
              +{xpGained}
            </div>
            <div className="text-sm text-white/70">XP Gained</div>
          </div>
        </div>

        {/* Rest of the summary content remains the same */}
        {/* ... */}

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <button
            onClick={onRestart}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-2xl hover:scale-105 transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <RefreshCw className="w-6 h-6" />
              Try Again
            </div>
          </button>
          <button
            onClick={onBackToMenu}
            className="px-8 py-4 bg-white/10 text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <Home className="w-6 h-6" />
              Back to Menu
            </div>
          </button>
        </div>

        {/* Answer review section */}
        <div className="text-lg font-bold text-white/80 mb-2">
          Review Your Answers
        </div>
        <div className="max-h-80 overflow-y-auto rounded-lg border border-white/10 bg-black/20 mb-2">
          {(questions && questions.length ? questions : sampleQuestions).map(
            (q, idx) => {
              const ua = userAnswers && userAnswers[idx];
              const isCorrect = (() => {
                switch (q.type) {
                  case "multiple-choice":
                    return ua === q.correct;
                  case "true-false":
                    return ua === q.correct;
                  case "classification":
                    return (
                      ua && JSON.stringify(ua) === JSON.stringify(q.correct)
                    );
                  case "fill-blank":
                    return (
                      ua &&
                      ua.every(
                        (ans, i) =>
                          ans.toLowerCase().trim() ===
                          q.blanks[i].toLowerCase().trim()
                      )
                    );
                  default:
                    return false;
                }
              })();
              return (
                <div
                  key={idx}
                  className={`flex flex-col md:flex-row md:items-center text-left px-3 py-2 border-b border-white/10`}
                >
                  <span className="md:w-2/3 text-white/90">{q.question}</span>
                  <span
                    className={`md:w-1/3 flex gap-2 items-center justify-end`}
                  >
                    {isCorrect ? (
                      <span className="flex items-center text-green-400 font-semibold">
                        <CheckCircle className="w-4 h-4 mr-1" /> Correct
                      </span>
                    ) : (
                      <span className="flex items-center text-red-400 font-semibold">
                        <XCircle className="w-4 h-4 mr-1" /> Incorrect
                      </span>
                    )}
                  </span>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}

// -------- SESSION SUMMARY PAGE --------
function SessionSummaryPage({ sessionResults, onBackToMenu }) {
  const modes = {
    practice: {
      name: "Practice",
      color: "from-blue-500 to-cyan-500",
      icon: <BookOpen className="w-6 h-6" />,
    },
    test: {
      name: "Test",
      color: "from-orange-500 to-red-500",
      icon: <FileText className="w-6 h-6" />,
    },
    quiz: {
      name: "Quiz",
      color: "from-purple-500 to-pink-500",
      icon: <Zap className="w-6 h-6" />,
    },
  };

  // Calculate totals
  const totalXP = Object.values(sessionResults).reduce(
    (sum, result) => sum + (result?.xpGained || 0),
    0
  );
  const totalCorrect = Object.values(sessionResults).reduce(
    (sum, result) => sum + (result?.stats.correct || 0),
    0
  );
  const totalQuestions = Object.values(sessionResults).reduce(
    (sum, result) => sum + (result?.stats.total || 0),
    0
  );
  const totalAccuracy =
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4 shadow-xl mx-auto">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-2">
            Session Summary
          </h2>
          <p className="text-xl text-white/80">
            Your overall performance across all modes
          </p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-green-400">
              {totalCorrect}
            </div>
            <div className="text-sm text-white/70">Total Correct</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-blue-400">
              {totalAccuracy}%
            </div>
            <div className="text-sm text-white/70">Overall Accuracy</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-yellow-400">
              {totalQuestions}
            </div>
            <div className="text-sm text-white/70">Total Questions</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-purple-400">+{totalXP}</div>
            <div className="text-sm text-white/70">Total XP Earned</div>
          </div>
        </div>

        {/* Mode Breakdown */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BarChart2 className="w-5 h-5" />
            Mode Breakdown
          </h3>
          <div className="space-y-4">
            {Object.entries(sessionResults).map(([mode, result]) => (
              <div
                key={mode}
                className={`bg-gradient-to-r ${
                  modes[mode].color
                }/20 backdrop-blur-sm border-l-4 ${
                  modes[mode].color.split(" ")[0]
                }/50 rounded-xl p-4`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-r ${modes[mode].color}`}
                    >
                      {modes[mode].icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">
                        {modes[mode].name}
                      </h4>
                      <p className="text-sm text-white/80">
                        {result.stats.correct}/{result.stats.total} correct
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-white">
                      +{result.xpGained} XP
                    </div>
                    <div className="text-sm text-white/80">
                      {Math.round(
                        (result.stats.correct / result.stats.total) * 100
                      )}
                      %
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Chart (simplified) */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Performance Overview
          </h3>
          <div className="bg-white/5 rounded-xl p-4 h-48 flex items-end gap-2">
            {Object.entries(sessionResults).map(([mode, result]) => (
              <div key={mode} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-full rounded-t-sm ${
                    modes[mode].color.split(" ")[0]
                  }`}
                  style={{
                    height: `${Math.round(
                      (result.stats.correct / result.stats.total) * 100
                    )}%`,
                  }}
                ></div>
                <span className="text-xs text-white/80 mt-1">
                  {modes[mode].name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={onBackToMenu}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-2xl hover:scale-105 transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <Home className="w-6 h-6" />
              Return to Main Menu
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

// -------- MAIN GAME COMPONENT --------
const classGroups = [
  {
    id: "I-II",
    label: "Class I-II",
    color: "from-pink-400 to-purple-500",
    icon: "🌟",
  },
  {
    id: "III-V",
    label: "Class III-V",
    color: "from-blue-400 to-cyan-500",
    icon: "🚀",
  },
  {
    id: "VI-X",
    label: "Class VI-X",
    color: "from-green-400 to-emerald-500",
    icon: "🏆",
  },
];

const grammarCategories = [
  {
    id: "common-proper-nouns",
    label: "Common & Proper Nouns",
    description: "Master the difference between common and proper nouns",
    icon: "📝",
    difficulty: "Beginner",
  },
];

const gameModes = {
  practice: {
    icon: BookOpen,
    title: "Practice Mode",
    subtitle: "Learn at your own pace",
    description:
      "Explore grammar concepts with instant feedback and hints. Perfect for building confidence!",
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-900/50 to-cyan-900/50",
    features: [
      "✨ Instant feedback",
      "💡 Helpful hints",
      "🔄 Unlimited attempts",
      "📈 Progress tracking",
    ],
    buttonText: "Start Practicing",
    stats: { questions: "∞", time: "Unlimited", difficulty: "Adaptive" },
  },
  test: {
    icon: FileText,
    title: "Test Mode",
    subtitle: "Assess your knowledge",
    description:
      "Take structured assessments to evaluate your understanding and identify areas for improvement.",
    color: "from-orange-500 to-red-500",
    bgColor: "from-orange-900/50 to-red-900/50",
    features: [
      "📝 Structured questions",
      "📊 Detailed results",
      "🎯 Performance analysis",
      "📋 Progress reports",
    ],
    buttonText: "Take Test",
    stats: { questions: "20", time: "30 min", difficulty: "Standard" },
  },
  quiz: {
    icon: Zap,
    title: "Quiz Challenge",
    subtitle: "Race against time",
    description:
      "Fast-paced quizzes with time limits. Challenge yourself and compete for high scores!",
    color: "from-purple-500 to-pink-500",
    bgColor: "from-purple-900/50 to-pink-900/50",
    features: [
      "⚡ Time pressure",
      "🏆 Leaderboards",
      "🔥 Streak bonuses",
      "💎 Bonus points",
    ],
    buttonText: "Start Challenge",
    stats: { questions: "15", time: "2 min/Q", difficulty: "Expert" },
  },
};

const initialUserStats = {
  level: 3,
  xp: 1250,
  totalXP: 2000,
  streak: 7,
  badges: 12,
};

const achievements = (userStats) => [
  { icon: "🔥", label: "Hot Streak", value: userStats.streak },
  { icon: "⭐", label: "Level", value: userStats.level },
  { icon: "🏅", label: "Badges", value: userStats.badges },
  { icon: "💎", label: "XP", value: userStats.xp },
];

const GrammarGlobalStarGame = () => {
  const [selectedClassGroup, setSelectedClassGroup] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showSelections, setShowSelections] = useState(false);
  const [showModes, setShowModes] = useState(false);
  const [activeTab, setActiveTab] = useState("practice");
  const [userStats, setUserStats] = useState(initialUserStats);
  const [activeMode, setActiveMode] = useState(null);
  const [sessionResults, setSessionResults] = useState({});
  const [showSessionSummary, setShowSessionSummary] = useState(false);

  const handleStart = () => {
    if (selectedClassGroup && selectedCategory) setShowSelections(true);
  };

  const handleContinueToModes = () => setShowModes(true);

  const handleBackToSelections = () => {
    setShowModes(false);
    setShowSelections(false);
    setActiveMode(null);
    setShowSessionSummary(false);
  };

  const handleStartMode = (mode) => setActiveMode(mode);

  const handleBackToModes = () => setActiveMode(null);

  const handleModeCompletion = (mode, results) => {
    setSessionResults((prev) => ({
      ...prev,
      [mode]: results,
    }));
    setUserStats((prev) => ({
      ...prev,
      xp: prev.xp + results.xpGained,
      totalXP: prev.totalXP,
      level: prev.level + (results.xpGained >= 100 ? 1 : 0),
    }));

    // Check if all modes are completed to show session summary
    const completedModes = Object.keys(sessionResults).length + 1;
    if (completedModes >= 3) {
      // or whatever your threshold is
      setShowSessionSummary(true);
    } else {
      setActiveMode(null); // Just go back to modes selection
    }
  };

  const handleShowSessionSummary = () => {
    setShowSessionSummary(true);
  };

  const selectedClassLabel = classGroups.find(
    (g) => g.id === selectedClassGroup
  )?.label;
  const selectedCategoryLabel = grammarCategories.find(
    (c) => c.id === selectedCategory
  )?.label;
  const currentMode = gameModes[activeTab];
  const IconComponent = currentMode.icon;

  if (showSessionSummary) {
    return (
      <SessionSummaryPage
        sessionResults={sessionResults}
        onBackToMenu={handleBackToSelections}
      />
    );
  }

  if (activeMode === "practice") {
    return (
      <PracticeMode
        onBack={handleBackToModes}
        onSummary={(results) => {
          handleModeCompletion("practice", results);
          handleBackToSelections();
        }}
      />
    );
  }
  if (activeMode === "test") {
    return (
      <TestMode
        onBack={handleBackToModes}
        onSummary={(results) => {
          handleModeCompletion("test", results);
          handleBackToSelections();
        }}
      />
    );
  }
  if (activeMode === "quiz") {
    return (
      <QuizMode
        onBack={handleBackToModes}
        onSummary={(results) => {
          handleModeCompletion("quiz", results);
          handleBackToSelections();
        }}
      />
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-pink-400 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-cyan-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-green-400 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-10 left-20 w-32 h-32 bg-yellow-400/20 rounded-full animate-pulse"></div>
        <div
          className="absolute top-32 right-16 w-24 h-24 bg-pink-400/20 rounded-full animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-40 left-1/4 w-20 h-20 bg-cyan-400/20 rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 right-1/3 w-28 h-28 bg-green-400/20 rounded-full animate-bounce"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>
      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-6">
            <div className="relative">
              <Globe
                className="w-16 h-16 text-yellow-400 animate-spin"
                style={{ animationDuration: "8s" }}
              />
              <Star className="absolute -top-2 -right-2 w-8 h-8 text-pink-400 animate-pulse" />
            </div>
          </div>
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 mb-4 animate-pulse">
            Grammar Global Star
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Embark on an exciting journey to master grammar concepts through
            interactive games and challenges!
          </p>
        </div>
        {!showSelections && !showModes && (
          <>
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white text-center mb-8 flex items-center justify-center gap-3">
                <BookOpen className="w-8 h-8 text-cyan-400" />
                Choose Your Class Level
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {classGroups.map((group) => (
                  <div
                    key={group.id}
                    onClick={() => setSelectedClassGroup(group.id)}
                    className={`relative group cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                      selectedClassGroup === group.id ? "scale-105" : ""
                    }`}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${group.color} rounded-2xl blur opacity-60 group-hover:opacity-80 transition-opacity`}
                    ></div>
                    <div
                      className={`relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-center ${
                        selectedClassGroup === group.id
                          ? "ring-4 ring-yellow-400/50"
                          : ""
                      }`}
                    >
                      <div className="text-4xl mb-4">{group.icon}</div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {group.label}
                      </h3>
                      <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${
                            group.color
                          } transform transition-all duration-500 ${
                            selectedClassGroup === group.id ? "w-full" : "w-0"
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white text-center mb-8 flex items-center justify-center gap-3">
                <Zap className="w-8 h-8 text-yellow-400" />
                Select Grammar Topic
              </h2>
              <div className="max-w-2xl mx-auto">
                {grammarCategories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`relative group cursor-pointer transform transition-all duration-300 hover:scale-102 mb-4 ${
                      selectedCategory === category.id ? "scale-102" : ""
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-60 group-hover:opacity-80 transition-opacity"></div>
                    <div
                      className={`relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 ${
                        selectedCategory === category.id
                          ? "ring-4 ring-yellow-400/50"
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-3xl">{category.icon}</div>
                          <div>
                            <h3 className="text-xl font-bold text-white">
                              {category.label}
                            </h3>
                            <p className="text-white/70 text-sm">
                              {category.description}
                            </p>
                            <span className="inline-block mt-2 px-3 py-1 bg-yellow-400/20 text-yellow-400 text-xs rounded-full">
                              {category.difficulty}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-6 h-6 text-white/60" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <button
                onClick={handleStart}
                disabled={!selectedClassGroup || !selectedCategory}
                className={`relative group px-12 py-4 text-xl font-bold rounded-2xl transition-all duration-300 transform ${
                  selectedClassGroup && selectedCategory
                    ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:scale-105 shadow-2xl hover:shadow-yellow-500/25"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl blur opacity-60 group-hover:opacity-80 transition-opacity"></div>
                <span className="relative flex items-center gap-3">
                  <Trophy className="w-6 h-6" />
                  Start Your Grammar Adventure
                  <Star className="w-6 h-6" />
                </span>
              </button>
            </div>
          </>
        )}
        {showSelections && !showModes && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 mb-8">
              <h2 className="text-3xl font-bold text-white mb-6">
                Ready to Start!
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 px-6 bg-white/10 rounded-xl">
                  <span className="text-white/80">Class Level:</span>
                  <span className="text-yellow-400 font-bold">
                    {selectedClassLabel}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 px-6 bg-white/10 rounded-xl">
                  <span className="text-white/80">Topic:</span>
                  <span className="text-cyan-400 font-bold">
                    {selectedCategoryLabel}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-xl text-white/90 mb-8">
              🎯 Get ready to explore three exciting modes:
            </div>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-500/20 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl mb-2">📚</div>
                <div className="text-white font-semibold">Practice</div>
              </div>
              <div className="bg-orange-500/20 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl mb-2">📝</div>
                <div className="text-white font-semibold">Test</div>
              </div>
              <div className="bg-purple-500/20 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl mb-2">⚡</div>
                <div className="text-white font-semibold">Quiz</div>
              </div>
            </div>
            <button
              onClick={handleContinueToModes}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300"
            >
              Continue to Game Modes
            </button>
          </div>
        )}
        {showModes && (
          <div>
            <div className="bg-black/20 backdrop-blur-lg border-b border-white/10 mb-8">
              <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      onClick={handleBackToSelections}
                    >
                      <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                    <div>
                      <h1 className="text-2xl font-bold text-white">
                        Grammar Global Star
                      </h1>
                      <p className="text-sm text-white/70">
                        {selectedClassLabel} • {selectedCategoryLabel}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-4">
                      {achievements(userStats).map((achievement, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg"
                        >
                          <span className="text-sm">{achievement.icon}</span>
                          <div className="text-white">
                            <div className="text-xs text-white/70">
                              {achievement.label}
                            </div>
                            <div className="font-bold text-sm">
                              {achievement.value}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <Settings className="w-5 h-5 text-white" />
                      </button>
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <User className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-white/70 mb-2">
                    <span>Level {userStats.level}</span>
                    <span>
                      {userStats.xp}/{userStats.totalXP} XP
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-1000 ease-out"
                      style={{
                        width: `${(userStats.xp / userStats.totalXP) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="container mx-auto px-6 py-6">
              <div className="flex justify-center mb-8">
                <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-2 border border-white/10">
                  <div className="flex gap-2">
                    {Object.entries(gameModes).map(([key, mode]) => {
                      const TabIcon = mode.icon;
                      return (
                        <button
                          key={key}
                          onClick={() => setActiveTab(key)}
                          className={`relative flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                            activeTab === key
                              ? "bg-white/20 text-white shadow-lg scale-105"
                              : "text-white/70 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <TabIcon className="w-5 h-5" />
                          <span className="hidden sm:block">
                            {mode.title.split(" ")[0]}
                          </span>
                          {activeTab === key && (
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-xl"></div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="max-w-4xl mx-auto">
                <div
                  className={`relative bg-gradient-to-br ${currentMode.bgColor} backdrop-blur-lg border border-white/20 rounded-3xl p-8 mb-8`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-pink-400/10 rounded-3xl"></div>
                  <div className="relative z-10">
                    <div className="text-center mb-8">
                      <div
                        className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${currentMode.color} rounded-2xl mb-4 shadow-2xl`}
                      >
                        <IconComponent className="w-10 h-10 text-white" />
                      </div>
                      <h2 className="text-4xl font-bold text-white mb-2">
                        {currentMode.title}
                      </h2>
                      <p className="text-xl text-white/80 mb-4">
                        {currentMode.subtitle}
                      </p>
                      <p className="text-white/70 max-w-2xl mx-auto leading-relaxed">
                        {currentMode.description}
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                        <Target className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">
                          {currentMode.stats.questions}
                        </div>
                        <div className="text-sm text-white/70">Questions</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                        <Clock className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">
                          {currentMode.stats.time}
                        </div>
                        <div className="text-sm text-white/70">Time Limit</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                        <Brain className="w-6 h-6 text-pink-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">
                          {currentMode.stats.difficulty}
                        </div>
                        <div className="text-sm text-white/70">Difficulty</div>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mb-8">
                      {currentMode.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 bg-white/5 rounded-lg p-3"
                        >
                          <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
                          <span className="text-white/90">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        className={`group relative px-8 py-4 bg-gradient-to-r ${currentMode.color} text-white font-bold text-lg rounded-2xl shadow-2xl hover:scale-105 transform transition-all duration-300`}
                        onClick={() => handleStartMode(activeTab)}
                      >
                        <div
                          className={`absolute inset-0 bg-gradient-to-r ${currentMode.color} rounded-2xl blur opacity-60 group-hover:opacity-80 transition-opacity`}
                        ></div>
                        <span className="relative flex items-center justify-center gap-3">
                          <Play className="w-6 h-6" />
                          {currentMode.buttonText}
                          <Star className="w-6 h-6" />
                        </span>
                      </button>
                      {activeTab !== "practice" && (
                        <button className="px-6 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center gap-2">
                          <RotateCcw className="w-5 h-5" />
                          Quick Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Award className="w-6 h-6 text-yellow-400" />
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <Trophy className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-medium">
                            Practice Session Completed
                          </div>
                          <div className="text-white/60 text-sm">
                            Common Nouns • 15/15 correct
                          </div>
                        </div>
                      </div>
                      <div className="text-green-400 font-bold">+50 XP</div>
                    </div>
                    <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <Star className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-medium">
                            New Badge Earned
                          </div>
                          <div className="text-white/60 text-sm">
                            Grammar Novice
                          </div>
                        </div>
                      </div>
                      <div className="text-yellow-400">🏅</div>
                    </div>
                    <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                          <Zap className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-medium">
                            Quiz Challenge
                          </div>
                          <div className="text-white/60 text-sm">
                            Proper Nouns • 85% score
                          </div>
                        </div>
                      </div>
                      <div className="text-purple-400 font-bold">+75 XP</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/60 text-sm">
        Grammar Global Star © 2025 - Master Grammar with Fun!
      </div>
    </div>
  );
};

export default GrammarGlobalStarGame;
