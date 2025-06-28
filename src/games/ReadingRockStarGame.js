import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  SkipForward,
  Volume2,
  Star,
  Clock,
  AlertCircle,
} from "lucide-react";
import readingData from "../data/Games/ReadingRockStar/WordsSentencesParagraphs.js";

const normalize = (str) =>
  str.trim().toLowerCase().replace(/[^\w\s]/g, "");

const levenshtein = (a, b) => {
  const matrix = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) matrix[i][j] = matrix[i - 1][j - 1];
      else
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
    }
  }
  return matrix[a.length][b.length];
};

const getWordDiff = (prompt, spoken) => {
  const pw = normalize(prompt).split(/\s+/);
  const sw = normalize(spoken).split(/\s+/);
  return pw.map((w, i) => ({
    word: w,
    match: sw[i] === w,
  }));
};

export default function ReadingRockStarGame() {
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState("Sentences");
  const [difficulty, setDifficulty] = useState("rookie");
  const [group, setGroup] = useState("III-V");

  const [currentText, setCurrentText] = useState("");
  const [spokenText, setSpokenText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const [correct, setCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const recognitionRef = useRef(null);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const getPrompts = () => {
    const type = category.toLowerCase();
    try {
      return readingData[group][type][difficulty];
    } catch {
      return [
        "Reading is fun.",
        "Books are great.",
        "Practice makes perfect.",
      ];
    }
  };

  useEffect(() => {
    setCurrentText(getPrompts()[step]);
  }, [step]);

  const startListening = () => {
    if (!SpeechRecognition) {
      setFeedback("Speech recognition not supported.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    setSpokenText("");
    setCorrect(null);
    setFeedback("");
    setIsListening(true);

    let final = "";

    recognition.onresult = (e) => {
      const text = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join(" ");
      setSpokenText(text);

      if (e.results[e.resultIndex].isFinal) {
        final = text.trim();
        const confidence = e.results[0][0].confidence;
        const normPrompt = normalize(currentText);
        const normTranscript = normalize(final);

        let ok = false;
        if (category === "Words") {
          ok = normPrompt === normTranscript;
        } else {
          ok = levenshtein(normPrompt, normTranscript) <= Math.ceil(normPrompt.length * 0.2);
        }

        setTotalAttempts((a) => a + 1);
        setCorrect(ok);
        setFeedback(
          ok
            ? `✅ Great! Confidence: ${(confidence * 100).toFixed(0)}%`
            : `❌ Try again: "${currentText}"`
        );
        setFeedbackType(ok ? "success" : "error");

        if (ok) {
          const pts = category === "Words" ? 10 : 20;
          const boost = confidence > 0.85 ? 1 : 0.7;
          setScore((s) => s + Math.round(pts * boost));
          setCorrectCount((c) => c + 1);
        }
        setIsListening(false);
      }
    };

    recognition.onerror = (e) => {
      console.warn("Speech error:", e.error);
      if (e.error === "no-speech") recognition.start();
    };

    recognition.onend = () => {
      if (!final) recognition.start();
    };

    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsListening(false);
  };

  const speakPrompt = () => {
    if ("speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(currentText);
      u.rate = 0.7;
      u.lang = "en-US";
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    }
  };

  const nextPrompt = () => {
    if (step + 1 < getPrompts().length) {
      setStep((s) => s + 1);
      setSpokenText("");
      setFeedback("");
      setCorrect(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 p-6">
      <h1 className="text-5xl text-center mb-4 text-white font-bold">
        🚀 Reading Rock Star 🚀
      </h1>
      <div className="bg-white/10 p-6 rounded-xl text-white">
        <div className="text-xl mb-2">{currentText}</div>

        {spokenText && (
          <div className="bg-white/10 p-4 rounded mt-4">
            <p className="mb-2">You said:</p>
            <div className="font-bold mb-2">{spokenText}</div>
            <div className="flex flex-wrap gap-2">
              {getWordDiff(currentText, spokenText).map((w, i) => (
                <span
                  key={i}
                  className={`px-2 py-1 rounded ${
                    w.match ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {w.word}
                </span>
              ))}
            </div>
          </div>
        )}

        {feedback && (
          <div
            className={`p-3 rounded mt-4 ${
              feedbackType === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {feedback}
          </div>
        )}

        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`p-4 rounded-full text-white ${
              isListening ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {isListening ? <MicOff /> : <Mic />}
          </button>
          <button
            onClick={speakPrompt}
            className="bg-blue-500 px-4 py-2 rounded"
          >
            <Volume2 className="inline mr-1" /> Listen
          </button>
          <button
            onClick={nextPrompt}
            className="bg-orange-500 px-4 py-2 rounded"
          >
            <SkipForward className="inline mr-1" /> Next
          </button>
        </div>

        {isListening && (
          <div className="mt-4 h-2 bg-green-500 animate-pulse rounded"></div>
        )}

        <div className="mt-6 flex gap-6">
          <span>Score: {score}</span>
          <span>Correct: {correctCount}</span>
          <span>Attempts: {totalAttempts}</span>
        </div>
      </div>
    </div>
  );
}
