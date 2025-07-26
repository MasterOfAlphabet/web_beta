import React, { useState, useEffect } from "react";
import {
  Star,
  Trophy,
  Award,
  Target,
  Zap,
  BookOpen,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw,
  Home,
  ArrowRight,
  ArrowLeft,
  SkipForward,
  Square,
} from "lucide-react";

import gameData from "../data/Games/SHARPStylishStar/SHARPQuizData_Canva.json";

const SHARPStylishStarGame = () => {
  const [currentScreen, setCurrentScreen] = useState("home");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [stars, setStars] = useState(0);
  const [level, setLevel] = useState(1);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswer, setLastAnswer] = useState("");
  const [allInOneQuestions, setAllInOneQuestions] = useState(null);
  const [questionsLimit, setQuestionsLimit] = useState(10);
  const [categoryScores, setCategoryScores] = useState({});
  const [gameMode, setGameMode] = useState("practice"); // 'practice', 'test', 'quiz'

  const categories = {
    S: { name: "Synonyms", icon: "🔗", color: "from-purple-400 to-pink-400" },
    H: { name: "Homonyms", icon: "🔊", color: "from-blue-400 to-cyan-400" },
    A: { name: "Antonyms", icon: "⚡", color: "from-orange-400 to-red-400" },
    R: { name: "Rhymes", icon: "🎵", color: "from-green-400 to-emerald-400" },
    P: { name: "Plurals", icon: "📚", color: "from-indigo-400 to-purple-400" },
    SHARP: {
      name: "All-In-One",
      icon: "✨",
      color: "from-yellow-400 to-orange-400",
    },
  };

  const classGroups = ["I-II", "III-V", "VI-X"];

  const getAllQuestions = () => {
    if (!selectedClass || !gameData[selectedClass]) return [];

    const allCategories = [
      "Synonyms",
      "Homonyms",
      "Antonyms",
      "Rhymes",
      "Plurals",
    ];
    const questionsPerCategory = Math.floor(questionsLimit / 5);
    const remainder = questionsLimit % 5;
    let allQuestions = [];

    allCategories.forEach((category, index) => {
      if (gameData[selectedClass][category]) {
        // Add extra question to first few categories if there's a remainder
        const questionsToTake =
          questionsPerCategory + (index < remainder ? 1 : 0);
        const categoryQuestions = gameData[selectedClass][category]
          .sort(() => Math.random() - 0.5) // Shuffle questions in category
          .slice(0, questionsToTake)
          .map((q) => ({
            ...q,
            category: category,
            options: [...q.options].sort(() => Math.random() - 0.5), // Shuffle answer options
          }));
        allQuestions = [...allQuestions, ...categoryQuestions];
      }
    });

    return allQuestions.length > 0
      ? allQuestions.sort(() => Math.random() - 0.5) // Final shuffle of all questions
      : [];
  };

  const getCategoryWiseScores = () => {
    if (selectedCategory !== "SHARP" || !allInOneQuestions) return null;

    const scores = {};

    // Initialize scores for all categories
    ["Synonyms", "Homonyms", "Antonyms", "Rhymes", "Plurals"].forEach((cat) => {
      scores[cat] = { correct: 0, total: 0 };
    });

    // Count questions per category from allInOneQuestions
    allInOneQuestions.forEach((question, index) => {
      const category = question.category || "Synonyms";
      if (scores[category]) {
        scores[category].total++;
      }
    });

    // Count correct answers
    answers.forEach((answer) => {
      if (answer.question < allInOneQuestions.length) {
        const question = allInOneQuestions[answer.question];
        const category = question.category || "Synonyms";

        if (scores[category] && answer.correct) {
          scores[category].correct++;
        }
      }
    });

    // Filter out categories with no questions
    const filteredScores = {};
    Object.entries(scores).forEach(([category, score]) => {
      if (score.total > 0) {
        filteredScores[category] = score;
      }
    });

    return filteredScores;
  };

  useEffect(() => {
    if (
      gameStarted &&
      gameMode === "quiz" &&
      timeLeft > 0 &&
      currentScreen === "game"
    ) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameStarted && gameMode === "quiz") {
      handleAnswer("");
    }
  }, [timeLeft, gameStarted, currentScreen, gameMode]);

  const startGame = () => {
    if (!selectedClass || !selectedCategory) return;

    if (selectedCategory === "SHARP") {
      setCurrentScreen("game");
      setGameStarted(false);
      const questions = getAllQuestions();
      setAllInOneQuestions(questions);

      setTimeout(() => {
        setCurrentQuestion(0);
        setScore(0);
        setAnswers([]);
        setStreak(0);
        if (gameMode === "quiz") {
          setTimeLeft(30);
        }
        setShowFeedback(false);
        setGameStarted(true);
      }, 50);
    } else {
      // Shuffle options for individual category questions too
      const categoryQuestions = gameData[selectedClass][
        categories[selectedCategory].name
      ].map((q) => ({
        ...q,
        options: [...q.options].sort(() => Math.random() - 0.5),
      }));

      setCurrentScreen("game");
      setGameStarted(true);
      setCurrentQuestion(0);
      setScore(0);
      setAnswers([]);
      setStreak(0);
      if (gameMode === "quiz") {
        setTimeLeft(30);
      }
      setShowFeedback(false);
    }
  };

  const handleAnswer = (answer) => {
    const currentData =
      selectedCategory === "SHARP"
        ? allInOneQuestions
        : gameData[selectedClass][categories[selectedCategory].name];

    if (
      !currentData ||
      currentQuestion >= Math.min(questionsLimit, currentData.length)
    )
      return;

    const correct = currentData[currentQuestion].answer;
    const isCorrect = answer === correct;

    // Only show feedback in practice mode
    if (gameMode === "practice") {
      setLastAnswer(isCorrect ? "correct" : "incorrect");
      setShowFeedback(true);
    }

    const newAnswers = [
      ...answers,
      { question: currentQuestion, answer, correct: isCorrect },
    ];
    setAnswers(newAnswers);

    if (isCorrect) {
      const points =
        gameMode === "quiz"
          ? timeLeft > 20
            ? 100
            : timeLeft > 10
            ? 75
            : 50
          : 100;
      setScore(score + points);
      setStreak(streak + 1);
      setMaxStreak(Math.max(maxStreak, streak + 1));
      setStars(stars + 1);
    } else {
      setStreak(0);
    }

    // Check if this is the last question - if so, end game after feedback
    const totalQuestions = Math.min(questionsLimit, currentData.length);
    const isLastQuestion = currentQuestion >= totalQuestions - 1;

    const feedbackDelay = gameMode === "practice" ? 2000 : 500; // Shorter delay for test/quiz modes

    setTimeout(() => {
      setShowFeedback(false);
      if (isLastQuestion) {
        endGame();
      } else {
        setCurrentQuestion(currentQuestion + 1);
        if (gameMode === "quiz") {
          setTimeLeft(30);
        }
      }
    }, feedbackDelay);
  };

  const handleNavigation = (direction) => {
    const currentData =
      selectedCategory === "SHARP"
        ? allInOneQuestions
        : gameData[selectedClass][categories[selectedCategory].name];

    const totalQuestions = Math.min(questionsLimit, currentData.length);

    if (direction === "prev") {
      if (currentQuestion > 0) {
        setCurrentQuestion(currentQuestion - 1);
        if (gameMode === "quiz") {
          setTimeLeft(30);
        }
        setShowFeedback(false);
      }
    } else if (direction === "skip") {
      // Skip current question - record it as skipped (different from incorrect)
      const newAnswers = [
        ...answers,
        {
          question: currentQuestion,
          answer: "",
          correct: false,
          skipped: true,
        },
      ];
      setAnswers(newAnswers);
      setStreak(0);

      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(currentQuestion + 1);
        if (gameMode === "quiz") {
          setTimeLeft(30);
        }
        setShowFeedback(false);
      } else {
        // Auto-submit when skipping the last question
        endGame();
      }
    }
  };

  const endGame = () => {
    setGameStarted(false);
    setCurrentScreen("summary");
    const actualAnswers = answers.length;
    const expectedQuestions =
      selectedCategory === "SHARP"
        ? Math.min(
            questionsLimit,
            allInOneQuestions ? allInOneQuestions.length : 0
          )
        : Math.min(
            questionsLimit,
            gameData[selectedClass] &&
              gameData[selectedClass][categories[selectedCategory].name]
              ? gameData[selectedClass][categories[selectedCategory].name]
                  .length
              : 0
          );

    console.log(
      `Game ended: ${actualAnswers} answers out of ${expectedQuestions} expected questions`
    );

    const correctAnswers = answers.filter((a) => a.correct).length;
    const percentage =
      actualAnswers > 0
        ? Math.round((correctAnswers / actualAnswers) * 100)
        : 0;

    if (percentage >= 80) setLevel(Math.min(level + 1, 10));
  };

  const resetGame = () => {
    setCurrentScreen("home");
    setSelectedClass("");
    setSelectedCategory("");
    setCurrentQuestion(0);
    setScore(0);
    setAnswers([]);
    setTimeLeft(30);
    setGameStarted(false);
    setStreak(0);
    setShowFeedback(false);
    setAllInOneQuestions(null);
    setGameMode("practice");
  };

  const LoadingScreen = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
      <div className="text-white text-xl animate-pulse">
        <Star className="inline mr-2 animate-spin" /> Loading questions...
      </div>
    </div>
  );

  const ErrorScreen = ({ message }) => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 to-pink-900">
      <div className="text-center">
        <div className="text-white text-xl mb-4">
          <XCircle className="inline mr-2" /> {message}
        </div>
        <button
          onClick={resetGame}
          className="bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg transition-all duration-300"
        >
          Return to Menu
        </button>
      </div>
    </div>
  );

  const HomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            <Star
              className="text-white opacity-20"
              size={Math.random() * 20 + 10}
            />
          </div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        <div className="text-center mb-12">
          <h1 className="text-7xl font-bold bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-4 animate-pulse">
            SHARP
          </h1>
          <div className="text-4xl font-light text-white mb-2">
            Stylish Star
          </div>
          <div className="text-lg text-purple-200">
            Educational Word Game Challenge
          </div>
        </div>

        <div className="flex gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center border border-white/20">
            <Trophy className="mx-auto mb-2 text-yellow-400" size={32} />
            <div className="text-2xl font-bold text-white">{score}</div>
            <div className="text-purple-200 text-sm">Total Score</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center border border-white/20">
            <Star className="mx-auto mb-2 text-yellow-400" size={32} />
            <div className="text-2xl font-bold text-white">{stars}</div>
            <div className="text-purple-200 text-sm">Stars Earned</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center border border-white/20">
            <Target className="mx-auto mb-2 text-green-400" size={32} />
            <div className="text-2xl font-bold text-white">{level}</div>
            <div className="text-purple-200 text-sm">Current Level</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center border border-white/20">
            <Zap className="mx-auto mb-2 text-orange-400" size={32} />
            <div className="text-2xl font-bold text-white">{maxStreak}</div>
            <div className="text-purple-200 text-sm">Best Streak</div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Select Your Class Group
          </h2>
          <div className="flex gap-4">
            {classGroups.map((classGroup) => (
              <button
                key={classGroup}
                onClick={() => setSelectedClass(classGroup)}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                  selectedClass === classGroup
                    ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-black shadow-lg shadow-yellow-400/50"
                    : "bg-white/10 backdrop-blur-lg text-white border border-white/20 hover:bg-white/20"
                }`}
              >
                <Users className="inline mr-2" size={20} />
                Class {classGroup}
              </button>
            ))}
          </div>
        </div>

        {selectedClass && (
          <div className="mb-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Choose SHARP Category
            </h2>
            <div className="flex gap-4 flex-wrap justify-center">
              {Object.entries(categories).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === key
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                      : "bg-white/10 backdrop-blur-lg text-white border border-white/20 hover:bg-white/20"
                  }`}
                >
                  <span className="text-2xl mr-2">{category.icon}</span>
                  <div>
                    <div className="font-bold">{key}</div>
                    <div className="text-sm opacity-80">{category.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedClass && selectedCategory && (
          <div className="mb-8 animate-fadeIn">
            <h3 className="text-xl font-bold text-white mb-4 text-center">
              Select Game Mode
            </h3>
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={() => setGameMode("practice")}
                className={`px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                  gameMode === "practice"
                    ? "bg-gradient-to-r from-green-400 to-emerald-400 text-white shadow-lg"
                    : "bg-white/10 backdrop-blur-lg text-white border border-white/20 hover:bg-white/20"
                }`}
              >
                <BookOpen className="inline mr-2" size={20} />
                <div>
                  <div className="font-bold">Practice</div>
                  <div className="text-sm opacity-80">
                    No Timer • Show Answers
                  </div>
                </div>
              </button>

              <button
                onClick={() => setGameMode("test")}
                className={`px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                  gameMode === "test"
                    ? "bg-gradient-to-r from-blue-400 to-cyan-400 text-white shadow-lg"
                    : "bg-white/10 backdrop-blur-lg text-white border border-white/20 hover:bg-white/20"
                }`}
              >
                <Award className="inline mr-2" size={20} />
                <div>
                  <div className="font-bold">Test</div>
                  <div className="text-sm opacity-80">
                    No Timer • No Feedback
                  </div>
                </div>
              </button>

              <button
                onClick={() => setGameMode("quiz")}
                className={`px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                  gameMode === "quiz"
                    ? "bg-gradient-to-r from-orange-400 to-red-400 text-white shadow-lg"
                    : "bg-white/10 backdrop-blur-lg text-white border border-white/20 hover:bg-white/20"
                }`}
              >
                <Clock className="inline mr-2" size={20} />
                <div>
                  <div className="font-bold">Quiz</div>
                  <div className="text-sm opacity-80">Timed • No Feedback</div>
                </div>
              </button>
            </div>

            <h3 className="text-xl font-bold text-white mb-4 text-center">
              Select Number of Questions
            </h3>
            <div className="flex justify-center">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <select
                  value={questionsLimit}
                  onChange={(e) => setQuestionsLimit(parseInt(e.target.value))}
                  className="bg-white/20 backdrop-blur-lg text-white rounded-xl px-6 py-3 text-lg font-bold border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  {selectedCategory === "SHARP" ? (
                    <>
                      <option value={10}>10 Questions</option>
                      <option value={25}>25 Questions</option>
                      <option value={50}>50 Questions</option>
                    </>
                  ) : (
                    <>
                      <option value={5}>5 Questions</option>
                      <option value={10}>10 Questions</option>
                      <option value={15}>15 Questions</option>
                      <option value={25}>25 Questions</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          </div>
        )}

        {selectedClass && selectedCategory && (
          <button
            onClick={startGame}
            className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold py-4 px-12 rounded-xl text-2xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-400/50 animate-bounce"
          >
            <Zap className="inline mr-2" size={24} />
            Start {gameMode.charAt(0).toUpperCase() + gameMode.slice(1)}!
            <ArrowRight className="inline ml-2" size={24} />
          </button>
        )}
      </div>
    </div>
  );

  const GameScreen = () => {
    const currentData =
      selectedCategory === "SHARP"
        ? allInOneQuestions
        : gameData[selectedClass][categories[selectedCategory].name];

    if (selectedCategory === "SHARP") {
      if (allInOneQuestions === null) {
        return <LoadingScreen />;
      }
      if (allInOneQuestions.length === 0) {
        return <ErrorScreen message="No questions available" />;
      }
    }

    if (
      !currentData ||
      currentQuestion >= Math.min(questionsLimit, currentData.length)
    ) {
      return <ErrorScreen message="Question not found" />;
    }

    const question = currentData[currentQuestion];
    const totalQuestions = Math.min(questionsLimit, currentData.length);

    // Get timer color based on time left (for quiz mode)
    const getTimerColor = () => {
      if (gameMode !== "quiz") return "bg-gray-400";
      if (timeLeft <= 5) return "bg-red-500";
      if (timeLeft <= 10) return "bg-yellow-400";
      if (timeLeft <= 15) return "bg-orange-400";
      return "bg-green-400";
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
        <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 p-6 shadow-2xl">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center gap-6">
              <button
                onClick={resetGame}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/20"
              >
                <Home className="text-white" size={24} />
              </button>
              <div className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl px-4 py-2">
                <div className="text-white font-bold text-lg">
                  Class {selectedClass}
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl px-4 py-2">
                <div className="text-white font-bold text-lg">
                  {selectedCategory === "SHARP"
                    ? "All-In-One Challenge"
                    : categories[selectedCategory].name}
                </div>
              </div>
              <div
                className={`rounded-xl px-4 py-2 ${
                  gameMode === "practice"
                    ? "bg-gradient-to-r from-green-400 to-emerald-400"
                    : gameMode === "test"
                    ? "bg-gradient-to-r from-blue-400 to-cyan-400"
                    : "bg-gradient-to-r from-orange-400 to-red-400"
                }`}
              >
                <div className="text-white font-bold text-lg">
                  {gameMode.charAt(0).toUpperCase() + gameMode.slice(1)} Mode
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {gameMode === "quiz" && (
                <div className="bg-white/10 backdrop-blur-lg rounded-xl px-4 py-2 border border-white/20">
                  <Clock
                    className={`inline mr-2 ${
                      timeLeft <= 5 ? "text-red-400" : "text-yellow-400"
                    }`}
                    size={20}
                  />
                  <span
                    className={`font-bold text-lg ${
                      timeLeft <= 5 ? "text-red-400" : "text-white"
                    }`}
                  >
                    {timeLeft}s
                  </span>
                </div>
              )}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl px-4 py-2 border border-white/20">
                <Target className="inline mr-2 text-green-400" size={20} />
                <span className="text-white font-bold">
                  {currentQuestion + 1}/{totalQuestions}
                </span>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl px-4 py-2 border border-white/20">
                <Trophy className="inline mr-2 text-yellow-400" size={20} />
                <span className="text-white font-bold">{score}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl px-4 py-2 border border-white/20">
                <Zap className="inline mr-2 text-orange-400" size={20} />
                <span className="text-white font-bold">Streak: {streak}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] p-8">
          <div className="w-full max-w-2xl mb-8">
            <div className="bg-white/10 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-400 to-emerald-500 h-full transition-all duration-500"
                style={{
                  width: `${((currentQuestion + 1) / totalQuestions) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-2xl w-full border border-white/20 shadow-2xl">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">
                {selectedCategory === "SHARP"
                  ? "✨"
                  : categories[selectedCategory].icon}
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {question.question}
              </h2>
              <div className="text-purple-200 mb-2">
                Choose the correct answer
              </div>
              <div className="text-lg font-semibold text-yellow-300">
                Question {currentQuestion + 1} of {totalQuestions}
              </div>
              {selectedCategory === "SHARP" && question.category && (
                <div className="text-md font-medium text-cyan-300 mt-2">
                  Category: {question.category}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={showFeedback}
                  className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 border border-white/20 text-white font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 text-lg">{option}</div>
                </button>
              ))}
            </div>

            {gameMode === "quiz" && (
              <div className="mb-6">
                <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${getTimerColor()}`}
                    style={{ width: `${(timeLeft / 30) * 100}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-center gap-6">
              <button
                onClick={() => handleNavigation("prev")}
                disabled={currentQuestion === 0 || showFeedback}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <ArrowLeft size={20} />
                Previous
              </button>

              <button
                onClick={() => handleNavigation("skip")}
                disabled={showFeedback}
                className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <SkipForward size={20} />
                Skip
              </button>

              <button
                onClick={endGame}
                disabled={showFeedback}
                className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <Square size={20} />
                Submit
              </button>
            </div>
          </div>

          {showFeedback && gameMode === "practice" && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div
                className={`bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl transform transition-all duration-500 ${
                  lastAnswer === "correct"
                    ? "border-green-400"
                    : "border-red-400"
                }`}
              >
                <div className="text-center">
                  {lastAnswer === "correct" ? (
                    <>
                      <CheckCircle
                        className="mx-auto mb-4 text-green-400"
                        size={64}
                      />
                      <h3 className="text-2xl font-bold text-green-400 mb-2">
                        Correct!
                      </h3>
                      <p className="text-white">Great job! Keep it up!</p>
                    </>
                  ) : (
                    <>
                      <XCircle
                        className="mx-auto mb-4 text-red-400"
                        size={64}
                      />
                      <h3 className="text-2xl font-bold text-red-400 mb-2">
                        Incorrect!
                      </h3>
                      <p className="text-white">
                        The correct answer was:{" "}
                        <span className="font-bold text-green-400">
                          {currentData[currentQuestion].answer}
                        </span>
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const SummaryScreen = () => {
    const currentData =
      selectedCategory === "SHARP"
        ? allInOneQuestions
        : gameData[selectedClass][categories[selectedCategory].name];

    if (!currentData || currentData.length === 0) {
      return <ErrorScreen message="No questions available" />;
    }

    const correctAnswers = answers.filter((a) => a.correct).length;
    const totalQuestions = answers.length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);

    const getGrade = () => {
      if (percentage >= 90)
        return {
          grade: "Wizard",
          color: "text-purple-400",
          message:
            "You have reached the Ultimate Level! 🎉 Maximum mastery achieved!",
          icon: "🧙‍♂️",
        };
      if (percentage >= 76)
        return {
          grade: "Prodigy",
          color: "text-green-400",
          message: "Skill Level 4! Only 1 more level to become a Wizard! 🔥",
          icon: "🌟",
        };
      if (percentage >= 51)
        return {
          grade: "Master",
          color: "text-blue-400",
          message: "Skill Level 3! 2 more levels to go (Prodigy → Wizard) 🚀",
          icon: "👑",
        };
      if (percentage >= 26)
        return {
          grade: "Racer",
          color: "text-yellow-400",
          message:
            "Skill Level 2! 3 more levels to reach Wizard (Master → Prodigy → Wizard) ⚡",
          icon: "🏃‍♂️",
        };
      return {
        grade: "Rookie",
        color: "text-red-400",
        message:
          "Skill Level 1! 4 levels to unlock (Racer → Master → Prodigy → Wizard) 💪",
        icon: "🌱",
      };
    };

    const gradeInfo = getGrade();

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <Star
                className="text-yellow-400 opacity-60"
                size={Math.random() * 15 + 10}
              />
            </div>
          ))}
        </div>

        <div className="relative z-10 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-4">
                Game Complete!
              </h1>
              <div className="text-xl text-purple-200">
                Class {selectedClass} •{" "}
                {selectedCategory === "SHARP"
                  ? "All-In-One Challenge"
                  : categories[selectedCategory].name}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg rounded-3xl p-8 text-center border border-white/30 shadow-2xl">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full p-4 inline-block mb-4">
                  <Trophy className="text-black" size={48} />
                </div>
                <div className="text-4xl font-bold text-white mb-2">
                  {score}
                </div>
                <div className="text-purple-200 text-lg">Final Score</div>
              </div>

              <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg rounded-3xl p-6 text-center border border-white/30 shadow-2xl">
                {/* Icon in circle like the side boxes */}

                {/* Icon in circle with consistent sizing */}
                <div
                  className={`bg-gradient-to-r ${
                    gradeInfo.color === "text-purple-400"
                      ? "from-purple-400 to-purple-500"
                      : gradeInfo.color === "text-green-400"
                      ? "from-green-400 to-green-500"
                      : gradeInfo.color === "text-blue-400"
                      ? "from-blue-400 to-blue-500"
                      : gradeInfo.color === "text-yellow-400"
                      ? "from-yellow-400 to-yellow-500"
                      : "from-red-400 to-red-500"
                  } rounded-full p-4 inline-block mb-4`}
                >
                  <span className="text-black" style={{ fontSize: "48px" }}>
                    {gradeInfo.icon}
                  </span>
                </div>

                <div className={`text-3xl font-bold mb-2 ${gradeInfo.color}`}>
                  {gradeInfo.grade} ({percentage}%)
                </div>

                <div className="text-white/80 text-sm bg-black/20 rounded-full px-3 py-1 inline-block">
                  {(() => {
                    const skillLevel =
                      percentage >= 90
                        ? 5
                        : percentage >= 76
                        ? 4
                        : percentage >= 51
                        ? 3
                        : percentage >= 26
                        ? 2
                        : 1;
                    const remaining = 5 - skillLevel;

                    if (skillLevel === 5) {
                      return "Ultimate Level Reached! 🎉";
                    } else {
                      return `Skill Level ${skillLevel} • ${remaining} level${
                        remaining > 1 ? "s" : ""
                      } to go`;
                    }
                  })()}
                </div>
              </div>

              <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg rounded-3xl p-8 text-center border border-white/30 shadow-2xl">
                <div className="bg-gradient-to-r from-orange-400 to-red-400 rounded-full p-4 inline-block mb-4">
                  <Zap className="text-white" size={48} />
                </div>
                <div className="text-4xl font-bold text-white mb-2">
                  {maxStreak}
                </div>
                <div className="text-purple-200 text-lg">Best Streak</div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 text-center border border-white/10">
                <CheckCircle
                  className="mx-auto mb-2 text-green-400"
                  size={24}
                />
                <div className="text-xl font-bold text-white">
                  {correctAnswers}
                </div>
                <div className="text-purple-200 text-sm">Correct</div>
              </div>

              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 text-center border border-white/10">
                <XCircle className="mx-auto mb-2 text-red-400" size={24} />
                <div className="text-xl font-bold text-white">
                  {answers.filter((a) => !a.correct && !a.skipped).length}
                </div>
                <div className="text-purple-200 text-sm">Incorrect</div>
              </div>

              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 text-center border border-white/10">
                <SkipForward
                  className="mx-auto mb-2 text-yellow-400"
                  size={24}
                />
                <div className="text-xl font-bold text-white">
                  {answers.filter((a) => a.skipped).length}
                </div>
                <div className="text-purple-200 text-sm">Skipped</div>
              </div>

              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 text-center border border-white/10">
                <Star className="mx-auto mb-2 text-yellow-400" size={24} />
                <div className="text-xl font-bold text-white">
                  {correctAnswers}
                </div>
                <div className="text-purple-200 text-sm">Stars Earned</div>
              </div>
            </div>

            {selectedCategory === "SHARP" &&
              getCategoryWiseScores() &&
              Object.keys(getCategoryWiseScores()).length > 0 && (
                <div className="mb-8">
                  <h3 className="text-3xl font-bold text-white mb-6 text-center">
                    Category Performance
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.entries(getCategoryWiseScores()).map(
                      ([category, score]) => {
                        const categoryInfo = Object.entries(categories).find(
                          ([key, cat]) => cat.name === category
                        );
                        const categoryKey = categoryInfo
                          ? categoryInfo[0]
                          : "S";
                        const categoryData =
                          categories[categoryKey] || categories["S"];
                        const percentage =
                          score.total > 0
                            ? Math.round((score.correct / score.total) * 100)
                            : 0;

                        // Calculate category-specific stats
                        const categoryAnswers = answers.filter((answer) => {
                          const question = allInOneQuestions[answer.question];
                          return question && question.category === category;
                        });

                        const categoryCorrect = categoryAnswers.filter(
                          (a) => a.correct
                        ).length;
                        const categoryIncorrect = categoryAnswers.filter(
                          (a) => !a.correct && !a.skipped
                        ).length;
                        const categorySkipped = categoryAnswers.filter(
                          (a) => a.skipped
                        ).length;

                        // Get grade for category
                        const getCategoryGrade = (percent) => {
                          if (percent >= 90)
                            return {
                              grade: "Wizard",
                              color: "text-purple-300",
                              bg: "bg-purple-500/20",
                              icon: "🧙‍♂️",
                              message: "Ultimate Level! 🎉",
                            };
                          if (percent >= 76)
                            return {
                              grade: "Prodigy",
                              color: "text-green-300",
                              bg: "bg-green-500/20",
                              icon: "🌟",
                              message: "Level 4! Almost Wizard! 🔥",
                            };
                          if (percent >= 51)
                            return {
                              grade: "Master",
                              color: "text-blue-300",
                              bg: "bg-blue-500/20",
                              icon: "👑",
                              message: "Level 3! 2 more to go! 🚀",
                            };
                          if (percent >= 26)
                            return {
                              grade: "Racer",
                              color: "text-yellow-300",
                              bg: "bg-yellow-500/20",
                              icon: "🏃‍♂️",
                              message: "Level 2! Keep racing! ⚡",
                            };
                          return {
                            grade: "Rookie",
                            color: "text-red-300",
                            bg: "bg-red-500/20",
                            icon: "🌱",
                            message: "Level 1! Start climbing! 💪",
                          };
                        };

                        const categoryGrade = getCategoryGrade(percentage);

                        return (
                          <div
                            key={category}
                            className={`bg-gradient-to-br ${categoryData.color} rounded-2xl p-6 text-center shadow-xl transform hover:scale-105 transition-all duration-300 border border-white/20`}
                          >
                            <div className="text-4xl mb-3">
                              {categoryData.icon}
                            </div>
                            <div className="text-white font-bold text-xl mb-2">
                              {categoryKey} ( {category} )
                            </div>
                            <div className="text-white text-3xl font-bold mb-1">
                              {score.correct}/{score.total}
                            </div>
                            <div className="text-white/90 text-lg font-semibold mb-3">
                              {percentage}%
                            </div>

                            {/* Grade Badge with background */}
                            {/* Grade Badge with icon */}
                            <div
                              className={`${categoryGrade.color} text-xl font-bold mb-2 ${categoryGrade.bg} rounded-full px-3 py-1 inline-block border border-white/20`}
                            >
                              <span className="text-lg mr-1">
                                {categoryGrade.icon}
                              </span>
                              {categoryGrade.grade}
                            </div>

                            {/* Category message */}
                            <div className="text-white/80 text-xs mb-3 bg-black/20 rounded px-2 py-1">
                              {categoryGrade.message}
                            </div>

                            {/* Stats Row */}
                            {/* Stats Row with Tooltips */}
                            <div className="flex justify-center gap-2 text-xs text-white/80">
                              <div className="relative group bg-black/20 rounded-full px-2 py-1 cursor-help">
                                <CheckCircle className="inline w-3 h-3 mr-1" />
                                {categoryCorrect}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                                  Correct Answers
                                </div>
                              </div>
                              <div className="relative group bg-black/20 rounded-full px-2 py-1 cursor-help">
                                <XCircle className="inline w-3 h-3 mr-1" />
                                {categoryIncorrect}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                                  Incorrect Answers
                                </div>
                              </div>
                              <div className="relative group bg-black/20 rounded-full px-2 py-1 cursor-help">
                                <SkipForward className="inline w-3 h-3 mr-1" />
                                {categorySkipped}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                                  Skipped Questions
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
              <h3 className="text-2xl font-bold text-white mb-4 text-center">
                Question Review
              </h3>
              <div className="text-center mb-4">
                <span className="text-purple-200">
                  Showing {answers.length} of{" "}
                  {Math.min(questionsLimit, currentData.length)} questions
                  attempted
                </span>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {/* Show all questions up to the number attempted, not just answered ones */}
                {Array.from(
                  {
                    length: Math.min(
                      answers.length,
                      Math.min(questionsLimit, currentData.length)
                    ),
                  },
                  (_, index) => {
                    const answer = answers.find((a) => a.question === index);
                    const question = currentData[index];
                    const wasAnswered = answer !== undefined;
                    const wasCorrect = answer && answer.correct;
                    const wasSkipped = answer && answer.skipped;

                    return (
                      <div
                        key={index}
                        className={`p-3 rounded-lg ${
                          wasCorrect
                            ? "bg-green-500/20"
                            : wasSkipped
                            ? "bg-yellow-500/20"
                            : wasAnswered
                            ? "bg-red-500/20"
                            : "bg-gray-500/20"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium">
                            Q{index + 1}: {question.question}
                          </span>
                          {wasCorrect ? (
                            <CheckCircle className="text-green-400" size={20} />
                          ) : wasSkipped ? (
                            <SkipForward
                              className="text-yellow-400"
                              size={20}
                            />
                          ) : wasAnswered ? (
                            <XCircle className="text-red-400" size={20} />
                          ) : (
                            <div className="text-gray-400 text-sm">
                              Not Attempted
                            </div>
                          )}
                        </div>
                        {wasSkipped && (
                          <div className="text-yellow-200 text-sm mt-1">
                            Question was skipped | Correct: {question.answer}
                          </div>
                        )}
                        {wasAnswered && !wasCorrect && !wasSkipped && (
                          <div className="text-purple-200 text-sm mt-1">
                            Your answer: {answer.answer || "No answer"} |
                            Correct: {question.answer}
                          </div>
                        )}
                        {!wasAnswered && (
                          <div className="text-gray-300 text-sm mt-1">
                            Correct answer: {question.answer}
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => {
                  setCurrentScreen("home");
                  setSelectedCategory("");
                }}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <RotateCcw className="inline mr-2" size={20} />
                Try Another Category
              </button>

              <button
                onClick={startGame}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Zap className="inline mr-2" size={20} />
                Play Again
              </button>

              <button
                onClick={resetGame}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Home className="inline mr-2" size={20} />
                Main Menu
              </button>
            </div>

            {percentage >= 80 && (
              <div className="mt-8 text-center">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold py-2 px-6 rounded-full inline-flex items-center animate-pulse">
                  <Award className="mr-2" size={20} />
                  Achievement Unlocked:{" "}
                  {percentage >= 95
                    ? "Perfect Master"
                    : percentage >= 90
                    ? "Excellence Award"
                    : "Great Performer"}
                  !
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const customStyles = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-fadeIn {
      animation: fadeIn 0.5s ease-out;
    }
    
    .glassmorphism {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
  `;

  // Main render logic
  if (currentScreen === "home") {
    return <HomeScreen />;
  } else if (currentScreen === "game") {
    return <GameScreen />;
  } else if (currentScreen === "summary") {
    return <SummaryScreen />;
  }

  return <HomeScreen />;
};

export default SHARPStylishStarGame;
