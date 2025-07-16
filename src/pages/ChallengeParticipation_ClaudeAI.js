import React, { useState } from "react";
import {
  Check,
  X,
  ArrowRight,
  ArrowLeft,
  Star,
  Sparkles,
  Brain,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ChallengeSubmissionPagePerQuestionType = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  const [questionTimes, setQuestionTimes] = useState([]);
  const [currentQuestionTime, setCurrentQuestionTime] = useState(0);
  const [challengeTime, setChallengeTime] = useState(0);
  const [challengeStartTime, setChallengeStartTime] = useState(Date.now());

  const [showExitModal, setShowExitModal] = useState(false);

  const navigate = useNavigate();

  const [skippedQuestions, setSkippedQuestions] = useState([]);

  // Timer effects
  React.useEffect(() => {
    if (!showResults) {
      const interval = setInterval(() => {
        const now = Date.now();
        setCurrentQuestionTime(Math.floor((now - questionStartTime) / 1000));
        setChallengeTime(Math.floor((now - challengeStartTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [questionStartTime, challengeStartTime, showResults]);

  // Challenge configuration
  const challengeInfo = {
    type: "Daily Challenge",
    title: "Science Explorer",
    date: new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    difficulty: "Intermediate",
    category: "Science & Nature",
  };

  // Question types configuration
  const questionTypes = [
    {
      type: "MCQ",
      bg: "bg-gradient-to-br from-cyan-600/25 to-blue-600/25",
      borderColor: "border-cyan-400/40",
      accentColor: "from-cyan-500 to-blue-500",
      shadowColor: "shadow-cyan-500/30",
      textColor: "text-cyan-50",
    },
    {
      type: "Fill In the Blank",
      bg: "bg-gradient-to-br from-emerald-600/25 to-teal-600/25",
      borderColor: "border-emerald-400/40",
      accentColor: "from-emerald-500 to-teal-500",
      shadowColor: "shadow-emerald-500/30",
      textColor: "text-emerald-50",
    },
    {
      type: "True/False",
      bg: "bg-gradient-to-br from-amber-600/25 to-yellow-600/25",
      borderColor: "border-amber-400/40",
      accentColor: "from-amber-500 to-yellow-500",
      shadowColor: "shadow-amber-500/30",
      textColor: "text-amber-50",
    },
    {
      type: "Short Answer",
      bg: "bg-gradient-to-br from-violet-600/25 to-purple-600/25",
      borderColor: "border-violet-400/40",
      accentColor: "from-violet-500 to-purple-500",
      shadowColor: "shadow-violet-500/30",
      textColor: "text-violet-50",
    },
  ];

  // Sample questions data
  const questions = [
    {
      id: 1,
      type: "MCQ",
      question: "What is the most abundant gas in Earth's atmosphere?",
      options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"],
      correct: 2,
      explanation: "Nitrogen makes up about 78% of Earth's atmosphere.",
    },
    {
      id: 2,
      type: "Fill In the Blank",
      question:
        "The process by which plants make their own food is called _______.",
      correct: "photosynthesis",
      explanation:
        "Photosynthesis is the process where plants convert light energy into chemical energy.",
    },
    {
      id: 3,
      type: "True/False",
      question:
        "The Great Wall of China is visible from space with the naked eye.",
      correct: false,
      explanation:
        "This is a common myth. The Great Wall is not visible from space with the naked eye.",
    },
    {
      id: 4,
      type: "MCQ",
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correct: 1,
      explanation:
        "Mars is called the Red Planet due to iron oxide (rust) on its surface.",
    },
  ];

  const handleAnswer = (answer) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: answer,
    }));
  };

  const handleSkip = () => {
    setSkippedQuestions((prev) => [...prev, currentQuestion]);
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: "SKIPPED",
    }));
    nextQuestion();
  };

  const nextQuestion = () => {
    // Record time for current question
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    setQuestionTimes((prev) => [...prev, timeSpent]);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setQuestionStartTime(Date.now());
    } else {
      setShowResults(true);
    }
  };

  const resetChallenge = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    const now = Date.now();
    setQuestionStartTime(now);
    setChallengeStartTime(now); // Reset challenge start time
    setQuestionTimes([]);
    setCurrentQuestionTime(0);
    setChallengeTime(0); // Reset challenge time to 0
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const renderQuestion = (question) => {
    const userAnswer = answers[currentQuestion];

    switch (question.type) {
      case "MCQ":
        return (
          <div className="space-y-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`w-full p-4 rounded-2xl text-left transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                  userAnswer === index
                    ? "bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-2 border-purple-400 shadow-lg shadow-purple-500/25"
                    : "bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20"
                } group`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      userAnswer === index
                        ? "border-purple-400 bg-purple-500"
                        : "border-white/40 group-hover:border-white/60"
                    }`}
                  >
                    {userAnswer === index && (
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className="text-white font-medium">{option}</span>
                </div>
              </button>
            ))}
          </div>
        );

      case "Fill In the Blank":
        return (
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <input
                type="text"
                placeholder="Type your answer here..."
                value={userAnswer || ""}
                onChange={(e) => handleAnswer(e.target.value)}
                className="w-full bg-transparent text-white placeholder-white/60 text-lg font-medium outline-none border-b-2 border-white/30 focus:border-purple-400 pb-2 transition-colors"
              />
            </div>
          </div>
        );

      case "True/False":
        return (
          <div className="flex space-x-4">
            {[true, false].map((option) => (
              <button
                key={option.toString()}
                onClick={() => handleAnswer(option)}
                className={`flex-1 p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                  userAnswer === option
                    ? "bg-gradient-to-r from-green-500/30 to-blue-500/30 border-2 border-green-400 shadow-lg shadow-green-500/25"
                    : "bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20"
                } group`}
              >
                <div className="flex items-center justify-center space-x-3">
                  {option ? (
                    <Check className="w-8 h-8 text-green-400" />
                  ) : (
                    <X className="w-8 h-8 text-red-400" />
                  )}
                  <span className="text-white font-bold text-xl">
                    {option ? "True" : "False"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (showResults) {
    const totalQuestionTime = questionTimes.reduce(
      (sum, time) => sum + time,
      0
    );
    const avgTimePerQuestion = Math.round(totalQuestionTime / questions.length);

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl">
                    <Check className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
                  </div>
                </div>
              </div>

              <h2 className="text-4xl font-bold text-white mb-2">Thank You!</h2>
              <p className="text-xl text-white/80 mb-6">
                Challenge completed successfully
              </p>
              <p className="text-lg text-white/70 mb-6">
                We will evaluate these questions and announce the winners later.
              </p>

              {/* Challenge Info */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-left">
                <h3 className="text-2xl font-bold text-white mb-4">
                  {challengeInfo.title}
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-white/60">Challenge Type:</span>
                    <div className="text-white font-medium">
                      {challengeInfo.type}
                    </div>
                  </div>
                  <div>
                    <span className="text-white/60">Date:</span>
                    <div className="text-white font-medium">
                      {challengeInfo.date}
                    </div>
                  </div>
                  <div>
                    <span className="text-white/60">Category:</span>
                    <div className="text-white font-medium">
                      {challengeInfo.category}
                    </div>
                  </div>
                  <div>
                    <span className="text-white/60">Difficulty:</span>
                    <div className="text-white font-medium">
                      {challengeInfo.difficulty}
                    </div>
                  </div>
                </div>
              </div>

              {/* Question Performance Details */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-left">
                <h3 className="text-xl font-bold text-white mb-6">
                  Question Performance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {questions.map((question, index) => {
                    const questionType =
                      questionTypes.find((t) => t.type === question.type) ||
                      questionTypes[0];
                    const userAnswer = answers[index];
                    let isCorrect = false;

                    if (question.type === "MCQ") {
                      isCorrect = userAnswer === question.correct;
                    } else if (question.type === "Fill In the Blank") {
                      isCorrect =
                        userAnswer?.toLowerCase().trim() ===
                        question.correct.toLowerCase();
                    } else if (question.type === "True/False") {
                      isCorrect = userAnswer === question.correct;
                    }

                    return (
                      <div
                        key={index}
                        className={`${questionType.bg} backdrop-blur-md border ${questionType.borderColor} rounded-xl p-4 ${questionType.shadowColor}`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`bg-gradient-to-r ${questionType.accentColor} text-white px-3 py-1 rounded-lg text-sm font-medium`}
                            >
                              Q{index + 1}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-lg text-xs font-medium ${
                                isCorrect
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {isCorrect ? "✓" : "✗"}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-bold text-lg">
                              {formatTime(questionTimes[index] || 0)}
                            </div>
                            <div className="text-white/60 text-xs">
                              Time Taken
                            </div>
                          </div>
                        </div>
                        <div className="text-white/90 text-sm leading-relaxed">
                          {question.question.length > 60
                            ? `${question.question.substring(0, 60)}...`
                            : question.question}
                        </div>
                        <div className="mt-2 text-xs text-white/70">
                          {question.type}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 pt-4 border-t border-white/20 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl p-4 text-center">
                    <div className="text-green-400 text-2xl font-bold">
                      Will be revealed later
                    </div>
                    <div className="text-white/80 text-sm">Score</div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-xl p-4 text-center">
                    <div className="text-blue-400 text-2xl font-bold">
                      {formatTime(totalQuestionTime)}
                    </div>
                    <div className="text-white/80 text-sm">Total Time</div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-xl p-4 text-center">
                    <div className="text-purple-400 text-2xl font-bold">
                      {formatTime(avgTimePerQuestion)}
                    </div>
                    <div className="text-white/80 text-sm">Avg/Question</div>
                  </div>
                </div>
              </div>

              <button
                 onClick={() => {
                    navigate("/challenges");
                  }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg shadow-purple-500/25"
              >
                Try Another Challenge
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentType =
    questionTypes.find((t) => t.type === question.type) || questionTypes[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 mb-6 shadow-2xl">
          {/* Top row with back button */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setShowExitModal(true)}
              className="text-white/70 hover:text-white text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back to Challenges</span>
            </button>

            <div className="text-right">
              <div className="text-white/80 text-sm">
                Question {currentQuestion + 1} / {questions.length}
              </div>
            </div>
          </div>

          {/* Main header content */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {challengeInfo.title}
                </h1>
                <p className="text-white/80">{challengeInfo.type}</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-white text-3xl font-bold">
                {formatTime(challengeTime)}
              </div>
              <div className="text-white/60 text-sm">Total Time</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white/10 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-400 to-blue-500 h-full transition-all duration-500 ease-out rounded-full shadow-lg"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-amber-500/10 backdrop-blur-md border border-amber-400/30 rounded-2xl p-4 mb-6 shadow-lg">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-amber-400 text-sm font-bold">!</span>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-amber-100 font-medium">
                ⚠️ You can't go back to previous questions - answer carefully or
                skip if needed
              </p>
              <p className="text-amber-100/80">
                🏆 Fastest completion time + accuracy = Higher leaderboard
                position
              </p>
              <p className="text-amber-100/80">
                ⏱️ Each question time matters - Quick thinking is rewarded!
              </p>
              <p className="text-amber-100/80">
                🎯 Skipped questions won't count towards your score
              </p>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div
          className={`${currentType.bg} backdrop-blur-xl border ${currentType.borderColor} rounded-3xl p-8 shadow-2xl mb-6 ${currentType.shadowColor}`}
        >
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span
                  className={`bg-gradient-to-r ${currentType.accentColor} text-white px-4 py-2 rounded-xl font-medium shadow-lg`}
                >
                  {question.type}
                </span>
              </div>
              {/* Question timer moved here */}
              <div className="text-right">
                <div className="text-white text-xl font-bold">
                  ⏱️ {formatTime(currentQuestionTime)}
                </div>
                <div className="text-white/60 text-sm">Question Time</div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white leading-relaxed">
              {question.question}
            </h2>
          </div>

          {renderQuestion(question)}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSkip}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl font-medium text-white/70 hover:text-white bg-white/10 hover:bg-white/20 transition-all duration-300 border border-white/20"
            >
              <span>Skip Question</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={nextQuestion}
            disabled={answers[currentQuestion] === undefined}
            className={`flex items-center space-x-2 px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg ${
              answers[currentQuestion] !== undefined
                ? "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white hover:shadow-2xl shadow-green-500/25"
                : "bg-white/10 text-white/50 cursor-not-allowed"
            }`}
          >
            <span>
              {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
            </span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-purple-900/95 to-blue-900/95 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <Star className="w-8 h-8 text-white" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white">
                Don't Miss the Fun!
              </h3>

              <div className="space-y-3 text-white/80">
                <p>🎉 You have a chance to win amazing prizes!</p>
                <p>🏆 Your name could be on the leaderboard!</p>
                <p>⭐ Complete challenges to unlock rewards!</p>
              </div>

              <p className="text-white/70 text-sm">
                Are you sure you want to leave this challenge?
              </p>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowExitModal(false)}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Stay & Continue
                </button>
                <button
                  onClick={() => {
                    navigate("/challenges");
                  }}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 border border-white/20"
                >
                  Leave
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeSubmissionPagePerQuestionType;
