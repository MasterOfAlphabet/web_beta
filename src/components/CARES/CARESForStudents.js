import React, { useState, useEffect } from "react";

/**
 * CARESForStudents
 * Universal, config-driven assessment engine.
 * Accepts config, studentInfo, timer, and custom UI overrides (from CARESCustomUI.js)
 */
export default function CARESForStudents({
  config,
  studentInfo,
  timer = { seconds: 3600, show: true },
  AssessmentHeader,
  AssessmentProgress,
  AssessmentQuestionRenderer,
  AssessmentNav,
  AssessmentEncouragement,
}) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(timer.seconds);
  const [submitted, setSubmitted] = useState(false);

  // Flatten all questions with category info
  const allQuestions = config.categories.flatMap((cat) =>
    cat.questions.map((q) => ({
      ...q,
      category: cat.name,
      categoryDescription: cat.description,
    }))
  );

  // Timer effect
  useEffect(() => {
    if (!timer.show || submitted) return;
    if (timeLeft <= 0) {
      setSubmitted(true);
      return;
    }
    const t = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [timer.show, timeLeft, submitted]);

  // Scoring
  const score = allQuestions.reduce(
    (acc, q) =>
      answers[q.id]?.trim().toLowerCase() === q.answer.toLowerCase()
        ? acc + 1
        : acc,
    0
  );

  // Category scores
  const categoryScores = config.categories.map((cat) => ({
    name: cat.name,
    score: cat.questions.reduce(
      (acc, q) =>
        answers[q.id]?.trim().toLowerCase() === q.answer.toLowerCase()
          ? acc + 1
          : acc,
      0
    ),
    total: cat.questions.length,
  }));

  // Navigation handlers
  const handleAnswer = (qid, val) =>
    setAnswers((prev) => ({ ...prev, [qid]: val }));
  const handleNext = () =>
    setCurrentQ((q) => Math.min(q + 1, allQuestions.length - 1));
  const handlePrev = () =>
    setCurrentQ((q) => Math.max(q - 1, 0));
  const handleSubmit = () => setSubmitted(true);

  const progress = ((currentQ + 1) / allQuestions.length) * 100;
  const currentQuestion = allQuestions[currentQ];
  const currentCategory = config.categories.find((cat) =>
    cat.questions.some((q) => q.id === currentQuestion?.id)
  );

  // Simple results view (can be expanded)
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Results Header */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Assessment Complete!</h1>
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-2xl font-bold text-gray-800">
                Score: {score} / {allQuestions.length}
              </span>
            </div>
            {/* Category Scores */}
            <h2 className="text-xl font-bold text-gray-800 mb-4">Section Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {categoryScores.map((cat, idx) => (
                <div key={cat.name} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">{cat.name}</h3>
                  <div className="flex items-center justify-center gap-2">
                    <div className="text-2xl font-bold text-blue-600">
                      {cat.score}
                    </div>
                    <div className="text-gray-500">/</div>
                    <div className="text-lg text-gray-600">
                      {cat.total}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${(cat.score / cat.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            {/* Student Info */}
            {studentInfo && (
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Student Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  {Object.entries(studentInfo).map(([k, v]) => (
                    <div key={k}>
                      <span className="font-semibold">{k.replace(/([A-Z])/g, ' $1')}: </span>
                      {v}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button
              className="mt-8 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-2xl"
              onClick={() => window.location.reload()}
            >
              Restart
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main assessment UI
  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-10 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
      {/* Header */}
      <div className="w-full max-w-4xl">
        {AssessmentHeader && (
          <AssessmentHeader
            category={currentCategory}
            qIndex={currentQ}
            total={allQuestions.length}
            timer={timeLeft}
            timerShow={timer.show}
          />
        )}
      </div>
      {/* Progress Bar */}
      <div className="w-full max-w-4xl">
        {AssessmentProgress && (
          <AssessmentProgress
            progress={progress}
            qIndex={currentQ}
            total={allQuestions.length}
          />
        )}
      </div>
      {/* Description */}
      <div className="w-full max-w-xl flex flex-col items-center my-10">
        <div className="mb-8 w-full flex justify-center">
          <div className="text-lg md:text-xl font-medium text-gray-700 bg-[#f7fafc] px-8 py-5 rounded-2xl text-center shadow-sm">
            {currentCategory?.description}
          </div>
        </div>
        {/* Question */}
        {AssessmentQuestionRenderer && (
          <AssessmentQuestionRenderer
            question={currentQuestion}
            value={answers[currentQuestion.id] || ""}
            onChange={(val) => handleAnswer(currentQuestion.id, val)}
            disabled={false}
          />
        )}
      </div>
      {/* Navigation */}
      <div className="w-full max-w-4xl">
        {AssessmentNav && (
          <AssessmentNav
            onPrev={handlePrev}
            onNext={handleNext}
            onSubmit={handleSubmit}
            canPrev={currentQ > 0}
            canNext={currentQ < allQuestions.length - 1}
            canSubmit={currentQ === allQuestions.length - 1}
          />
        )}
      </div>
      {/* Encouragement */}
      <div className="w-full max-w-4xl flex justify-center mt-10">
        {AssessmentEncouragement && <AssessmentEncouragement />}
      </div>
    </div>
  );
}