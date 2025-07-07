import React, { useState, useEffect, useRef } from "react";

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

const levels = ["Rookie", "Racer", "Master", "Prodigy", "Wizard"];
const difficulties = ["Easy", "Medium", "Hard"];
const modes = ["Words", "Sentences", "Paragraphs"];

const ListenAndMatchGame = () => {
  const [mode, setMode] = useState("Words");
  const [level, setLevel] = useState("Rookie");
  const [difficulty, setDifficulty] = useState("Easy");

  const [questions, setQuestions] = useState(sampleQuestions["Words"]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [playCounts, setPlayCounts] = useState({});
  const [completed, setCompleted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showScoreBreakdown, setShowScoreBreakdown] = useState(false);

  // Track listen counts per question, never reset
  const [listenCounts, setListenCounts] = useState({});
  // Track if audio is playing
  const [isSpeaking, setIsSpeaking] = useState(false);
  // Track answered questions
  const [answeredQuestions, setAnsweredQuestions] = useState({});
  // Track skipped questions (those left unanswered)
  const [skippedAtSubmit, setSkippedAtSubmit] = useState([]);
  // Track total Prev/Next navigation clicks (never reset)
  const [navClicks, setNavClicks] = useState(0);

  // For speechSynthesis cancellation
  const synthRef = useRef(null);

  useEffect(() => {
    setQuestions(sampleQuestions[mode]);
    setCurrentIndex(0);
    setScore(0);
    setCompleted(false);
    setShowOptions(false);
    setPlayCounts({});
    setSelectedAnswers({});
    setCorrectAnswers(0);
    setShowScoreBreakdown(false);
    setListenCounts({});
    setIsSpeaking(false);
    setAnsweredQuestions({});
    setSkippedAtSubmit([]);
    setNavClicks(0);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }, [mode, level, difficulty]);

  const currentQuestion = questions[currentIndex];

  // Helper to update listenCounts per question
  const incrementListenCount = (qIdx) => {
    setListenCounts((prev) => ({
      ...prev,
      [qIdx]: (prev[qIdx] || 0) + 1,
    }));
    setPlayCounts((prev) => ({
      ...prev,
      [qIdx]: (prev[qIdx] || 0) + 1,
    }));
  };

  // Play audio and show choices only when finished
  const speak = (text) => {
    if (!text) return;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeaking(true);

    // For cross-browser, always create new utterance
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    synthRef.current = utterance;

    utterance.onend = () => {
      setShowOptions(true);
      setIsSpeaking(false);
    };
    utterance.onerror = () => {
      setShowOptions(true);
      setIsSpeaking(false);
    };

    incrementListenCount(currentIndex);
    window.speechSynthesis.speak(utterance);
  };

  // Grade logic is now per answer, not per round, so update this helper
  const calcScoreAndCorrect = (answersObj) => {
    let s = 0, correct = 0;
    questions.forEach((q, idx) => {
      const userAns = answersObj[idx];
      if (userAns === q.answer) {
        let p = 100;
        const plays = playCounts[idx] || 1;
        if (difficulty === "Medium") {
          p = Math.max(0, 100 - (plays - 1) * 10);
        } else if (difficulty === "Hard" && plays > 1) {
          p = 0;
        }
        s += p;
        correct++;
      }
    });
    return { s, correct };
  };

  const handleAnswer = (choice) => {
    // Record answer
    setSelectedAnswers((prev) => {
      const updated = { ...prev, [currentIndex]: choice };
      // Recalculate score and correct answers live
      const { s, correct } = calcScoreAndCorrect(updated);
      setScore(s);
      setCorrectAnswers(correct);
      return updated;
    });
    setAnsweredQuestions((prev) => ({ ...prev, [currentIndex]: true }));
    // Next question after delay if not last (or do nothing if free navigation)
    // setTimeout removed for free navigation
  };

  const getScoreGrade = () => {
    const percentage = (score / (questions.length * 100)) * 100;
    if (percentage >= 90)
      return { grade: "A+", color: "text-green-600", emoji: "🏆" };
    if (percentage >= 80)
      return { grade: "A", color: "text-green-500", emoji: "⭐" };
    if (percentage >= 70)
      return { grade: "B+", color: "text-blue-500", emoji: "👍" };
    if (percentage >= 60)
      return { grade: "B", color: "text-blue-400", emoji: "👌" };
    if (percentage >= 50)
      return { grade: "C", color: "text-yellow-500", emoji: "😊" };
    return { grade: "D", color: "text-red-500", emoji: "💪" };
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setCompleted(false);
    setPlayCounts({});
    setShowOptions(false);
    setSelectedAnswers({});
    setCorrectAnswers(0);
    setShowScoreBreakdown(false);
    setListenCounts({});
    setIsSpeaking(false);
    setAnsweredQuestions({});
    setSkippedAtSubmit([]);
    setNavClicks(0);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  };

  // Helper for summary: listening effort
  const listeningTag = (count) => {
    if (!count || count === 1)
      return (
        <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
          Answered Right Away
        </span>
      );
    if (count === 2 || count === 3)
      return (
        <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold">
          Listened {count} times
        </span>
      );
    return (
      <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
        Listened more than 3 times
      </span>
    );
  };

  // Navigation handlers
  const handlePrev = () => {
    setNavClicks((n) => n + 1);
    setShowOptions(!!playCounts[currentIndex - 1]);
    setCurrentIndex((idx) => Math.max(0, idx - 1));
    setIsSpeaking(false);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  };
  const handleNext = () => {
    setNavClicks((n) => n + 1);
    setShowOptions(!!playCounts[currentIndex + 1]);
    setCurrentIndex((idx) => Math.min(questions.length - 1, idx + 1));
    setIsSpeaking(false);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  };

  // Submit: mark completed, calculate skipped questions
  const handleSubmit = () => {
    setCompleted(true);
    setShowScoreBreakdown(true);
    if (typeof window !== "undefined" && window.confetti) {
      window.confetti({ particleCount: 150, spread: 100 });
    }
    // Skipped = not answered
    const skipped = questions
      .map((q, idx) => ({ idx, answered: !!selectedAnswers[idx] }))
      .filter((q) => !q.answered)
      .map((q) => q.idx);
    setSkippedAtSubmit(skipped);
  };

  // On mode/level/difficulty change, reset navClicks, etc. (handled in useEffect above)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
            🎧 Listen & Match Game
          </h1>
          <p className="text-gray-600">
            Test your listening skills and match what you hear!
          </p>
        </div>
        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mode
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {modes.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {levels.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {difficulties.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
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
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            >
              <span className="text-white text-xs font-bold">
                {Math.round(
                  ((currentIndex + 1) / questions.length) * 100
                )}
                %
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
                disabled={
                  isSpeaking ||
                  (difficulty === "Hard" && (playCounts[currentIndex] || 0) >= 1)
                }
                className={`px-8 py-4 rounded-full text-white font-bold text-xl transition-all duration-300 transform hover:scale-105 ${
                  isSpeaking ||
                  (difficulty === "Hard" && (playCounts[currentIndex] || 0) >= 1)
                    ? "bg-gray-400 cursor-not-allowed opacity-50"
                    : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg"
                }`}
              >
                {isSpeaking ? "🔊 Playing..." : "🔊 Listen"}
                {(playCounts[currentIndex] || 0) > 0 &&
                difficulty === "Medium"
                  ? ` (${Math.max(
                      0,
                      100 - ((playCounts[currentIndex] || 1) - 1) * 10
                    )} pts)`
                  : ""}
              </button>
              {(playCounts[currentIndex] || 0) > 0 && (
                <div className="mt-3 text-sm text-gray-600">
                  Played {(playCounts[currentIndex] || 0)} time
                  {(playCounts[currentIndex] || 0) > 1 ? "s" : ""}
                  {difficulty === "Hard" &&
                    (playCounts[currentIndex] || 0) >= 1 && (
                      <div className="text-orange-600 font-medium">
                        No more replays allowed!
                      </div>
                    )}
                </div>
              )}
            </div>
            {/* Options - shown only after sound stops */}
            {showOptions && !isSpeaking && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentQuestion.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(opt)}
                    disabled={selectedAnswers[currentIndex] !== undefined}
                    className={`border-2 px-6 py-4 rounded-xl text-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                      selectedAnswers[currentIndex] === opt
                        ? opt === currentQuestion.answer
                          ? "bg-green-100 border-green-400 text-green-700 shadow-lg"
                          : "bg-red-100 border-red-400 text-red-700 shadow-lg"
                        : selectedAnswers[currentIndex] === undefined
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
            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-10">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-8 py-3 rounded-full font-bold text-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                Prev
              </button>
              {currentIndex === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="px-8 py-3 rounded-full font-bold text-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition"
                >
                  Submit
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={currentIndex === questions.length - 1}
                  className="px-8 py-3 rounded-full font-bold text-lg bg-blue-200 text-blue-700 hover:bg-blue-300 transition"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Score Display */
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Game Complete!
              </h2>
              <p className="text-gray-600">
                Well done on completing the challenge!
              </p>
            </div>
            {/* Beautiful Score Display */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Score */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {score}
                  </div>
                  <div className="text-gray-600 font-medium">
                    Total Score
                  </div>
                  <div className="text-sm text-gray-500">
                    out of {questions.length * 100}
                  </div>
                </div>
                {/* Grade */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div
                    className={`text-4xl font-bold mb-2 ${
                      getScoreGrade().color
                    }`}
                  >
                    {getScoreGrade().grade}
                  </div>
                  <div className="text-gray-600 font-medium">Grade</div>
                  <div className="text-2xl">{getScoreGrade().emoji}</div>
                </div>
                {/* Accuracy */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {Math.round(
                      (correctAnswers / questions.length) * 100
                    )}
                    %
                  </div>
                  <div className="text-gray-600 font-medium">
                    Accuracy
                  </div>
                  <div className="text-sm text-gray-500">
                    {
                      Object.values(selectedAnswers).filter(
                        (ans, idx) =>
                          ans === questions[idx].answer
                      ).length
                    }
                    /{questions.length} correct
                  </div>
                </div>
              </div>
              {/* Performance Message */}
              <div className="mt-6 p-4 bg-white rounded-xl">
                <div className="text-lg font-semibold text-gray-700 mb-2">
                  {getScoreGrade().grade === "A+"
                    ? "Outstanding Performance! 🌟"
                    : getScoreGrade().grade === "A"
                    ? "Excellent Work! 👏"
                    : getScoreGrade().grade.startsWith("B")
                    ? "Good Job! Keep it up! 💪"
                    : "Nice Try! Practice makes perfect! 🚀"}
                </div>
                <div className="text-gray-600">
                  Mode: <span className="font-medium">{mode}</span> • Level:{" "}
                  <span className="font-medium">{level}</span> • Difficulty:{" "}
                  <span className="font-medium">{difficulty}</span>
                </div>
              </div>
            </div>
            {/* Listen Count Summary */}
            <div className="bg-white rounded-xl p-6 mt-6 shadow">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Listening Effort Summary
              </h3>
             <div className="space-y-3">
  {questions.map((q, idx) => (
    <div
      key={idx}
      className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 border-b pb-2 last:border-b-0"
    >
      <span className="flex-1 text-left text-gray-700">
        <span className="font-semibold">Q{idx + 1}:</span>{" "}
        <span className="italic">
          {q.audioText.length > 50
            ? q.audioText.slice(0, 47) + "..."
            : q.audioText}
        </span>
      </span>
      {selectedAnswers[idx] !== undefined ? (
        listeningTag(listenCounts[idx])
      ) : (
        <span className="inline-block px-3 py-1 rounded-full bg-gray-200 text-gray-500 text-xs font-bold">
          Skipped
        </span>
      )}
    </div>
  ))}
</div>
            </div>
            {/* Questions Skipped Summary */}
            <div className="bg-white rounded-xl p-6 mt-6 shadow">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Questions Skipped
              </h3>
              <div className="text-gray-700 mb-2">
                {skippedAtSubmit.length === 0
                  ? "None! You attempted every question."
                  : `${skippedAtSubmit.length} of ${questions.length} questions skipped`}
              </div>
              {skippedAtSubmit.length > 0 && (
                <ul className="list-disc list-inside text-left text-sm text-red-700">
                  {skippedAtSubmit.map((idx) => (
                    <li key={idx}>
                      Q{idx + 1}:{" "}
                      {questions[idx].audioText.length > 60
                        ? questions[idx].audioText.slice(0, 57) + "..."
                        : questions[idx].audioText}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Navigation Statistics */}
            <div className="bg-white rounded-xl p-6 mt-6 shadow">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Navigation Stats
              </h3>
              <div className="text-gray-700">
                Prev/Next Clicks (Total):{" "}
                <span className="font-bold">{navClicks}</span>
              </div>
            </div>
            {/* Play Again Button */}
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-bold text-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform mt-8"
            >
              🔁 Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListenAndMatchGame;