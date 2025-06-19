import React, { useState, useEffect } from "react";

const sampleQuestions = {
  Words: [
    {
      audioText: "apple",
      options: ["apple", "orange", "banana", "grape"],
      answer: "apple"
    },
    {
      audioText: "sun",
      options: ["moon", "sun", "star", "sky"],
      answer: "sun"
    },
    {
      audioText: "water",
      options: ["fire", "earth", "water", "air"],
      answer: "water"
    },
    {
      audioText: "book",
      options: ["pen", "paper", "book", "pencil"],
      answer: "book"
    },
    {
      audioText: "happy",
      options: ["sad", "angry", "happy", "tired"],
      answer: "happy"
    }
  ],
  Sentences: [
    {
      audioText: "The cat is sleeping on the mat.",
      options: [
        "The dog is barking loudly.",
        "The cat is sleeping on the mat.",
        "Birds are flying in the sky.",
        "The mat is under the table."
      ],
      answer: "The cat is sleeping on the mat."
    },
    {
      audioText: "I like to eat ice cream.",
      options: [
        "I like to play games.",
        "I like to eat ice cream.",
        "I like to watch movies.",
        "I like to read books."
      ],
      answer: "I like to eat ice cream."
    },
    {
      audioText: "The bird flies high in the sky.",
      options: [
        "The fish swims in the water.",
        "The bird flies high in the sky.",
        "The car drives on the road.",
        "The train moves on tracks."
      ],
      answer: "The bird flies high in the sky."
    }
  ],
  Paragraphs: [
    {
      audioText: "In the morning, Ravi woke up and brushed his teeth. Then he had his breakfast and got ready for school.",
      options: [
        "Ravi played in the evening with his friends.",
        "Ravi got ready for school in the morning.",
        "Ravi went to the zoo with his family.",
        "Ravi went shopping for clothes."
      ],
      answer: "Ravi got ready for school in the morning."
    },
    {
      audioText: "Sara loves to paint pictures of flowers and trees. She uses bright colors like red, yellow, and blue to make her artwork beautiful.",
      options: [
        "Sara enjoys cooking delicious meals.",
        "Sara likes to dance and sing songs.",
        "Sara loves to paint colorful pictures.",
        "Sara enjoys playing outdoor games."
      ],
      answer: "Sara loves to paint colorful pictures."
    }
  ]
};

const levels = ["Level 1", "Level 2", "Level 3", "Level 4", "Level 5"];
const difficulties = ["Easy", "Medium", "Hard"];
const modes = ["Words", "Sentences", "Paragraphs"];

const ListenMatchGame = () => {
  const [mode, setMode] = useState("Words");
  const [level, setLevel] = useState("Level 1");
  const [difficulty, setDifficulty] = useState("Easy");

  const [questions, setQuestions] = useState(sampleQuestions["Words"]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showScoreBreakdown, setShowScoreBreakdown] = useState(false);

  useEffect(() => {
    setQuestions(sampleQuestions[mode]);
    setCurrentIndex(0);
    setScore(0);
    setCompleted(false);
    setShowOptions(false);
    setPlayCount(0);
    setSelectedAnswer("");
    setCorrectAnswers(0);
    setShowScoreBreakdown(false);
  }, [mode, level, difficulty]);

  const currentQuestion = questions[currentIndex];

  const speak = (text) => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
    setShowOptions(true);
    setPlayCount(prev => prev + 1);
  };

  const handleAnswer = (choice) => {
    let point = 100;

    if (difficulty === "Medium") {
      point = Math.max(0, 100 - (playCount - 1) * 10);
    } else if (difficulty === "Hard" && playCount > 1) {
      point = 0;
    }

    const isCorrect = choice === currentQuestion.answer;
    if (isCorrect) {
      setScore(prev => prev + point);
      setCorrectAnswers(prev => prev + 1);
    }

    setSelectedAnswer(choice);

    // Next question after delay
    setTimeout(() => {
      const nextIndex = currentIndex + 1;
      if (nextIndex < questions.length) {
        setCurrentIndex(nextIndex);
        setShowOptions(false);
        setSelectedAnswer("");
        setPlayCount(0);
      } else {
        setCompleted(true);
        setShowScoreBreakdown(true);
        // Confetti effect
        if (typeof window !== 'undefined' && window.confetti) {
          window.confetti({ particleCount: 150, spread: 100 });
        }
      }
    }, 1500);
  };

  const getScoreGrade = () => {
    const percentage = (score / (questions.length * 100)) * 100;
    if (percentage >= 90) return { grade: "A+", color: "text-green-600", emoji: "🏆" };
    if (percentage >= 80) return { grade: "A", color: "text-green-500", emoji: "⭐" };
    if (percentage >= 70) return { grade: "B+", color: "text-blue-500", emoji: "👍" };
    if (percentage >= 60) return { grade: "B", color: "text-blue-400", emoji: "👌" };
    if (percentage >= 50) return { grade: "C", color: "text-yellow-500", emoji: "😊" };
    return { grade: "D", color: "text-red-500", emoji: "💪" };
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setCompleted(false);
    setPlayCount(0);
    setShowOptions(false);
    setSelectedAnswer("");
    setCorrectAnswers(0);
    setShowScoreBreakdown(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
            🎧 Listen & Match Game
          </h1>
          <p className="text-gray-600">Test your listening skills and match what you hear!</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mode</label>
              <select 
                value={mode} 
                onChange={e => setMode(e.target.value)} 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {modes.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
              <select 
                value={level} 
                onChange={e => setLevel(e.target.value)} 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {levels.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select 
                value={difficulty} 
                onChange={e => setDifficulty(e.target.value)} 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* Difficulty Info */}
          <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
            <strong>Difficulty Rules:</strong>
            {difficulty === "Easy" && " Unlimited replays, full points each time"}
            {difficulty === "Medium" && " Each replay reduces points by 10"}
            {difficulty === "Hard" && " One listen only, no replays allowed"}
          </div>
        </div>

        {/* Progress Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg font-semibold text-gray-700">
              Question {currentIndex + 1} of {questions.length}
            </div>
            <div className="text-lg font-semibold text-blue-600">
              Score: {score}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
              style={{ width: `${((currentIndex + (completed ? 1 : 0)) / questions.length) * 100}%` }}
            >
              <span className="text-white text-xs font-bold">
                {Math.round(((currentIndex + (completed ? 1 : 0)) / questions.length) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Game Content */}
        {!completed ? (
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Listen Button */}
            <div className="text-center mb-8">
              <button
                onClick={() => speak(currentQuestion.audioText)}
                disabled={difficulty === "Hard" && playCount >= 1}
                className={`px-8 py-4 rounded-full text-white font-bold text-xl transition-all duration-300 transform hover:scale-105 ${
                  playCount === 0 || difficulty === "Easy" || (difficulty === "Medium")
                    ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg"
                    : "bg-gray-400 cursor-not-allowed opacity-50"
                }`}
              >
                🔊 Listen {playCount > 0 && difficulty === "Medium" ? `(${Math.max(0, 100 - (playCount - 1) * 10)} pts)` : ""}
              </button>
              
              {playCount > 0 && (
                <div className="mt-3 text-sm text-gray-600">
                  Played {playCount} time{playCount > 1 ? 's' : ''}
                  {difficulty === "Hard" && playCount >= 1 && (
                    <div className="text-orange-600 font-medium">No more replays allowed!</div>
                  )}
                </div>
              )}
            </div>

            {/* Options */}
            {showOptions && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentQuestion.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(opt)}
                    disabled={selectedAnswer !== ""}
                    className={`border-2 px-6 py-4 rounded-xl text-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                      selectedAnswer === opt
                        ? opt === currentQuestion.answer
                          ? "bg-green-100 border-green-400 text-green-700 shadow-lg"
                          : "bg-red-100 border-red-400 text-red-700 shadow-lg"
                        : selectedAnswer === ""
                        ? "border-gray-300 hover:bg-blue-50 hover:border-blue-300"
                        : opt === currentQuestion.answer
                        ? "bg-green-100 border-green-400 text-green-700"
                        : "border-gray-300 opacity-50"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Score Display */
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Game Complete!</h2>
              <p className="text-gray-600">Well done on completing the challenge!</p>
            </div>

            {/* Beautiful Score Display */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Score */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{score}</div>
                  <div className="text-gray-600 font-medium">Total Score</div>
                  <div className="text-sm text-gray-500">out of {questions.length * 100}</div>
                </div>

                {/* Grade */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className={`text-4xl font-bold mb-2 ${getScoreGrade().color}`}>
                    {getScoreGrade().grade}
                  </div>
                  <div className="text-gray-600 font-medium">Grade</div>
                  <div className="text-2xl">{getScoreGrade().emoji}</div>
                </div>

                {/* Accuracy */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {Math.round((correctAnswers / questions.length) * 100)}%
                  </div>
                  <div className="text-gray-600 font-medium">Accuracy</div>
                  <div className="text-sm text-gray-500">{correctAnswers}/{questions.length} correct</div>
                </div>
              </div>

              {/* Performance Message */}
              <div className="mt-6 p-4 bg-white rounded-xl">
                <div className="text-lg font-semibold text-gray-700 mb-2">
                  {getScoreGrade().grade === "A+" ? "Outstanding Performance! 🌟" :
                   getScoreGrade().grade === "A" ? "Excellent Work! 👏" :
                   getScoreGrade().grade.startsWith("B") ? "Good Job! Keep it up! 💪" :
                   "Nice Try! Practice makes perfect! 🚀"}
                </div>
                <div className="text-gray-600">
                  Mode: <span className="font-medium">{mode}</span> • 
                  Level: <span className="font-medium">{level}</span> • 
                  Difficulty: <span className="font-medium">{difficulty}</span>
                </div>
              </div>
            </div>

            {/* Play Again Button */}
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-bold text-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
            >
              🔁 Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListenMatchGame;