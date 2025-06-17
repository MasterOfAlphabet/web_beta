import React from "react";
import { Volume2, ArrowLeft, ArrowRight } from "lucide-react";

// Header
export function AssessmentHeader({ category, qIndex, total, timer, timerShow }) {
  const formatTime = (secs) =>
    `${Math.floor(secs / 60)
      .toString()
      .padStart(2, "0")}:${(secs % 60).toString().padStart(2, "0")}`;
  return (
    <div className="flex items-center justify-between mb-4 px-4">
      <div className="flex items-center gap-4">
        <div
          className="px-5 py-2 rounded-full font-bold text-white text-lg shadow"
          style={{
            background: "linear-gradient(90deg,#ff2da9 0%,#ff5f6d 60%,#6e6dff 100%)",
            boxShadow: "0 2px 10px 0 #ff2da933",
          }}
        >
          {category?.name}
        </div>
        <span className="font-semibold text-gray-700 text-lg">
          Question {qIndex + 1} of {total}
        </span>
      </div>
      {timerShow && (
        <div
          className="flex items-center text-orange-700 font-bold text-lg px-5 py-2 rounded-full"
          style={{
            background: "rgba(255, 181, 74, 0.15)",
            color: "#e76a1c",
            fontWeight: 700,
          }}
        >
          <span>
            <svg width={22} height={22} style={{ verticalAlign: "middle", marginRight: 4 }} fill="none" stroke="#e76a1c" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="9" /><polyline points="11 6 11 11 14 14" /></svg>
          </span>
          <span>{formatTime(timer)}</span>
        </div>
      )}
    </div>
  );
}

// Progress Bar
export function AssessmentProgress({ progress }) {
  return (
    <div className="mb-2 px-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-gray-500">Start</span>
        <span className="text-gray-700 font-medium">{Math.round(progress)}% Complete</span>
        <span className="text-gray-500">Finish</span>
      </div>
      <div className="w-full h-3 rounded-full" style={{ background: "#e5e7eb" }}>
        <div
          className="h-3 rounded-full transition-all duration-500"
          style={{
            width: `${progress}%`,
            background:
              "linear-gradient(90deg,#06beb6 0%,#3b82f6 50%,#a259ff 100%)",
            boxShadow: "0 1px 6px 0 #3b82f644",
          }}
        />
      </div>
    </div>
  );
}

// Question Renderer (supports Dictation, MCQ, Fill, Image)
export function AssessmentQuestionRenderer({
  question,
  value,
  onChange,
  disabled,
}) {
  // Dictation (listen & type)
  if (question.type === "dictation" || question.word) {
    const speak = (text) => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utter = new window.SpeechSynthesisUtterance(text);
        utter.lang = "en-US";
        window.speechSynthesis.speak(utter);
      }
    };
    return (
      <>
        <button
          className="flex items-center gap-3 px-9 py-4 mb-8 rounded-2xl font-semibold text-white text-lg shadow-lg"
          style={{
            background: "linear-gradient(90deg,#109dff 0%,#a259ff 100%)",
            boxShadow: "0 2px 12px 0 #109dff44",
          }}
          onClick={() => speak(question.word)}
          disabled={disabled}
        >
          <Volume2 className="w-7 h-7" />
          Listen & Type
        </button>
        <input
          type="text"
          className="w-full px-8 py-5 rounded-2xl border-2 text-center text-xl font-medium text-gray-600 placeholder-gray-400 shadow focus:outline-none focus:border-blue-400 bg-white"
          placeholder="Type what you hear..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
      </>
    );
  }
  // MCQ
  if (question.options) {
    return (
      <div className="space-y-6 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => onChange(option)}
              disabled={disabled}
              className={`p-4 rounded-2xl border-2 font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                value === option
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white border-green-500 shadow-lg'
                  : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-md text-gray-700'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  }
  // Fill in the blank
  if (question.type === "fill" || question.word) {
    return (
      <input
        type="text"
        className="w-full px-8 py-5 rounded-2xl border-2 text-center text-xl font-medium text-gray-600 placeholder-gray-400 shadow focus:outline-none focus:border-blue-400 bg-white"
        placeholder={question.placeholder || "Your answer"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    );
  }
  // Image-based
  if (question.imageUrl || question.image) {
    return (
      <div className="space-y-4">
        <img
          src={question.imageUrl || question.image}
          alt="Question visual"
          className="w-48 h-48 object-cover rounded-3xl shadow-lg mx-auto"
        />
        <input
          type="text"
          className="w-full px-8 py-5 rounded-2xl border-2 text-center text-xl font-medium text-gray-600 placeholder-gray-400 shadow focus:outline-none focus:border-blue-400 bg-white"
          placeholder="What do you see?"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
      </div>
    );
  }
  // Default fallback
  return <div>Unsupported question type</div>;
}

// Navigation Buttons
export function AssessmentNav({ onPrev, onNext, onSubmit, canPrev, canNext, canSubmit }) {
  return (
    <div className="flex justify-between items-center px-4 mt-8">
      <button
        className="flex items-center gap-2 text-gray-500 font-semibold px-8 py-4 rounded-xl bg-[#f7fafc] shadow disabled:opacity-60 disabled:cursor-not-allowed text-lg"
        disabled={!canPrev}
        onClick={onPrev}
      >
        <ArrowLeft className="w-5 h-5" />
        Previous
      </button>
      {canNext ? (
        <button
          className="flex items-center gap-2 text-white font-semibold px-10 py-4 rounded-xl shadow-lg text-lg"
          style={{
            background: "linear-gradient(90deg,#109dff 0%,#a259ff 100%)",
            boxShadow: "0 2px 12px 0 #109dff44",
          }}
          onClick={onNext}
        >
          Next
          <ArrowRight className="w-5 h-5" />
        </button>
      ) : (
        <button
          className="flex items-center gap-2 text-white font-semibold px-10 py-4 rounded-xl shadow-lg text-lg"
          style={{
            background: "linear-gradient(90deg,#10b981 0%,#36d399 100%)",
            boxShadow: "0 2px 12px 0 #10b98133",
          }}
          onClick={onSubmit}
        >
          Submit
        </button>
      )}
    </div>
  );
}

// Encouragement Bar
export function AssessmentEncouragement() {
  return (
    <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-2xl">
      <span className="text-2xl animate-bounce">🌟</span>
      <span className="text-gray-700 font-medium">You're doing great! Keep going!</span>
      <span className="text-2xl animate-bounce" style={{ animationDelay: "0.5s" }}>🎯</span>
    </div>
  );
}

// Export all as a single object for easy import
const CARESCustomUI = {
  AssessmentHeader,
  AssessmentProgress,
  AssessmentQuestionRenderer,
  AssessmentNav,
  AssessmentEncouragement,
};
export default CARESCustomUI;