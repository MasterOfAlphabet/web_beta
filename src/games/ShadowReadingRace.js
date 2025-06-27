import React, { useState, useRef, useEffect } from "react";
import { FaMicrophone, FaMicrophoneSlash, FaRedo, FaPlay, FaStar, FaVolumeUp, FaCheckCircle } from "react-icons/fa";

const DIFFICULTIES = [
  { value: "very_easy", label: "Very Easy", time: 30, stars: 1 },
  { value: "easy", label: "Easy", time: 40, stars: 2 },
  { value: "medium", label: "Medium", time: 50, stars: 3 },
  { value: "hard", label: "Hard", time: 60, stars: 4 },
  { value: "expert", label: "Expert", time: 70, stars: 5 },
];
const PASSAGES = {
  very_easy: "The cat sat on the mat.",
  easy: "The quick brown fox jumps over the lazy dog.",
  medium: "She sells seashells by the seashore, and the shells she sells are surely seashells.",
  hard: "Peter Piper picked a peck of pickled peppers. How many pickled peppers did Peter Piper pick?",
  expert: "If you want to shine like a sun, first burn like a sun. Perseverance and practice pave the path to perfection.",
};

function mockAIScore(userText, passage, duration, allowed) {
  const a = passage.toLowerCase().split(/\s+/);
  const b = userText.toLowerCase().split(/\s+/);
  let pron = 0;
  a.forEach((word, i) => {
    if (b[i] && b[i].replace(/[.,!?]/g, "") === word.replace(/[.,!?]/g, "")) pron++;
  });
  const sync = Math.max(0, 100 - Math.abs(duration - allowed) * 2);
  const intonation = 80 + Math.round(Math.random() * 20);
  const overall = Math.round((pron / a.length) * 40 + sync * 0.3 + intonation * 0.3);
  return {
    pronunciation: Math.round((pron / a.length) * 100),
    sync,
    intonation,
    overall: Math.min(100, overall)
  };
}

function useSpeechRecognition({ onResult, onEnd }) {
  const recognitionRef = useRef(null);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.continuous = false;
    rec.onresult = (e) => {
      onResult && onResult(e.results[0][0].transcript);
    };
    rec.onend = () => {
      setRecording(false);
      onEnd && onEnd();
    };
    recognitionRef.current = rec;
    // cleanup
    return () => { rec.abort(); };
    // eslint-disable-next-line
  }, []);
  const start = () => {
    setRecording(true);
    recognitionRef.current && recognitionRef.current.start();
  };
  const stop = () => {
    recognitionRef.current && recognitionRef.current.stop();
    setRecording(false);
  };
  return { start, stop, recording };
}

export default function ShadowReadingRace() {
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[0]);
  const [gameStage, setGameStage] = useState("select"); // select | listen | record | result
  const [timer, setTimer] = useState(0);
  const [userTranscript, setUserTranscript] = useState("");
  const [aiScore, setAiScore] = useState(null);
  const [error, setError] = useState("");
  const timerRef = useRef();
  const passage = PASSAGES[difficulty.value];

  // Speech recognition
  const { start, stop, recording } = useSpeechRecognition({
    onResult: (txt) => {
      setUserTranscript(txt);
    },
    onEnd: () => {
      setGameStage("result");
    }
  });

  // Timer logic (only runs while recording)
  useEffect(() => {
    if (gameStage !== "record" || !recording) {
      clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t + 1 >= difficulty.time) {
          clearInterval(timerRef.current);
          stop();
          setTimeout(() => setGameStage("result"), 400);
        }
        return t + 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line
  }, [recording, gameStage, difficulty.time]);

  // Score when entering result stage
  useEffect(() => {
    if (gameStage === "result") {
      setAiScore(
        mockAIScore(userTranscript, passage, timer, difficulty.time)
      );
    }
    // eslint-disable-next-line
  }, [gameStage]);

  // Play passage with browser TTS
  function playPassage() {
    if (!("speechSynthesis" in window)) {
      setError("SpeechSynthesis not supported in your browser.");
      return;
    }
    setError("");
    const utter = new window.SpeechSynthesisUtterance(passage);
    utter.rate = 1.0;
    window.speechSynthesis.speak(utter);
  }

  function handleStartGame() {
    setGameStage("listen");
    setTimeout(() => playPassage(), 400);
  }
  function handleAfterListen() {
    setGameStage("record");
    setTimer(0);
    setUserTranscript("");
    setError("");
  }
  function handleRestart() {
    setGameStage("select");
    setAiScore(null);
    setUserTranscript("");
    setTimer(0);
    setError("");
  }

  // UI
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-100 to-indigo-100 font-sans">
      <div className="w-full max-w-2xl mx-auto p-6 bg-white/80 rounded-3xl shadow-xl border border-blue-100">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <FaPlay className="text-yellow-400 text-3xl" />
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
            Shadow Reading Race
          </h1>
        </div>

        {/* Error */}
        {error && <div className="bg-red-100 border-l-4 border-red-600 text-red-700 p-3 mb-4 rounded">{error}</div>}

        {/* Difficulty Selection */}
        {gameStage === "select" && (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Choose Difficulty</h2>
              <div className="flex gap-2 flex-wrap">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d.value}
                    className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 border-2 transition-all
                      ${difficulty.value === d.value
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-500 scale-105"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-blue-100"
                      }`}
                    onClick={() => setDifficulty(d)}
                  >
                    {Array.from({ length: d.stars }).map((_, i) => (
                      <FaStar key={i} className="text-yellow-400" />
                    ))}
                    {d.label}
                  </button>
                ))}
              </div>
              <div className="mt-3 text-gray-600 text-sm flex items-center gap-2">
                <FaPlay /> <b>{difficulty.time}s</b> to read the passage.
              </div>
            </div>
            <div className="mb-4">
              <h3 className="font-bold text-gray-800 mb-1">Passage:</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-lg font-mono text-blue-800">{passage}</div>
            </div>
            <button
              onClick={handleStartGame}
              className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xl font-bold shadow hover:from-blue-600 hover:to-purple-600 flex items-center justify-center gap-2"
            >
              <FaVolumeUp /> Listen & Start
            </button>
          </>
        )}

        {/* Listen Stage */}
        {gameStage === "listen" && (
          <div className="animate-fadein">
            <h2 className="text-lg font-semibold text-blue-700 mb-2 flex items-center gap-2">
              <FaVolumeUp /> Listen Carefully
            </h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-lg font-mono text-blue-800 mb-6">{passage}</div>
            <button
              onClick={playPassage}
              className={`w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xl font-bold shadow flex items-center justify-center gap-2 hover:from-blue-600 hover:to-purple-600`}
            >
              <FaVolumeUp /> Replay Passage
            </button>
            <button
              onClick={handleAfterListen}
              className="w-full mt-5 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-xl flex items-center justify-center gap-2"
            >
              <FaMicrophone /> Shadow Read Now
            </button>
          </div>
        )}

        {/* Record Stage */}
        {gameStage === "record" && (
          <div className="animate-fadein">
            <h2 className="text-lg font-semibold text-purple-700 mb-1 flex items-center gap-2">
              <FaMicrophone /> Shadow Read Out Loud!
            </h2>
            <div className="mb-2 text-gray-600 text-sm">
              Try to match the intonation, rhythm, and read as clearly as you can.<br />
              <b>Press the mic to start/stop recording.</b>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-3">
              <b>Passage:</b><br />
              <span className="font-mono text-blue-900">{passage}</span>
            </div>
            <div className="flex items-center gap-3 mt-3 mb-2">
              <button
                onClick={() => {
                  if (!recording) {
                    setUserTranscript("");
                    setTimer(0);
                    setError("");
                    start();
                  } else {
                    stop();
                  }
                }}
                className={`rounded-full w-16 h-16 flex items-center justify-center text-white transition-all text-3xl border-4
                  ${recording ? "bg-red-500 border-red-700 animate-pulse" : "bg-green-500 border-green-700"}`}
                aria-label={recording ? "Stop Recording" : "Start Recording"}
              >
                {recording ? <FaMicrophoneSlash /> : <FaMicrophone />}
              </button>
              <span className="text-lg font-mono text-blue-800">
                <FaPlay className="inline mr-1" /> {timer}s / {difficulty.time}s
              </span>
            </div>
            <textarea
              className="w-full border border-blue-300 rounded-lg p-3 text-lg font-mono focus:ring-2 focus:ring-blue-400 mt-3"
              rows={3}
              placeholder="Your spoken text appears here..."
              value={userTranscript}
              readOnly
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleRestart}
                className="flex-1 py-2 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300 flex items-center justify-center gap-2 text-lg"
              >
                <FaRedo /> Restart
              </button>
              {(!recording && userTranscript) && (
                <button
                  onClick={() => setGameStage("result")}
                  className="flex-1 py-2 rounded-lg bg-green-500 text-white font-bold flex items-center gap-2 hover:bg-green-600 text-lg"
                >
                  <FaCheckCircle /> Finish
                </button>
              )}
            </div>
          </div>
        )}

        {/* Result Stage */}
        {gameStage === "result" && aiScore && (
          <div className="animate-fadein">
            <h2 className="text-2xl font-bold text-green-700 mb-2 flex items-center gap-2">
              <FaCheckCircle /> Results!
            </h2>
            <div className="mb-5">
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-green-100 px-3 py-2 text-lg font-mono text-green-800 font-bold">Your Score:</span>
                <span className="text-3xl font-extrabold text-green-700">{aiScore.overall}/100</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                <div className="p-3 rounded-lg bg-blue-50 border-l-4 border-blue-400">
                  <div className="text-blue-700 font-bold flex items-center gap-2"><FaMicrophone /> Pronunciation</div>
                  <div className="text-2xl font-mono">{aiScore.pronunciation}/100</div>
                </div>
                <div className="p-3 rounded-lg bg-yellow-50 border-l-4 border-yellow-400">
                  <div className="text-yellow-700 font-bold flex items-center gap-2"><FaPlay /> Sync</div>
                  <div className="text-2xl font-mono">{aiScore.sync}/100</div>
                </div>
                <div className="p-3 rounded-lg bg-purple-50 border-l-4 border-purple-400">
                  <div className="text-purple-700 font-bold flex items-center gap-2"><FaStar /> Intonation</div>
                  <div className="text-2xl font-mono">{aiScore.intonation}/100</div>
                </div>
              </div>
            </div>
            <div className="mb-5">
              <h4 className="font-bold text-gray-800 mb-1">Your Shadow Reading:</h4>
              <div className="bg-gray-50 rounded-lg border p-4 font-mono text-blue-800">{userTranscript}</div>
            </div>
            <button
              onClick={handleRestart}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xl font-bold shadow hover:from-blue-600 hover:to-purple-600 flex items-center justify-center gap-2"
            >
              <FaRedo /> Try Again
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-7 pt-4 border-t text-xs text-gray-400 text-center">
          Master of Alphabet: Shadow Reading Race &copy; 2025
        </div>
      </div>
    </div>
  );
}