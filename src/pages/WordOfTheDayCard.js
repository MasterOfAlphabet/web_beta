import React, { useState, useRef, useEffect, useMemo } from "react";
import { CircularProgress } from "@mui/material";
import VoiceSelector from "../components/VoiceSelector";
import wordData from "./WordOfTheDayData";
import ReviewRatingFeedbackSection from "../components/ReviewRatingFeedbackSection";
import {
  Heart,
  Bookmark as LucideBookmark,
  Share2,
  Volume2,
  Star,
  Book,
  Lightbulb,
  Brain,
  Quote,
  Mic,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar,
  GraduationCap,
} from "lucide-react";

const LUCIDE_FIELDS = [
  {
    key: "word",
    label: "Word",
    icon: Sparkles,
    bgColor: "bg-gradient-to-br from-yellow-400 to-orange-500",
    textColor: "text-white",
  },
  {
    key: "partOfSpeech",
    label: "Part of Speech",
    icon: Brain,
    bgColor: "bg-gradient-to-br from-purple-500 to-pink-600",
    textColor: "text-white",
  },
  {
    key: "pronunciation",
    label: "Pronunciation",
    icon: Volume2,
    bgColor: "bg-gradient-to-br from-blue-500 to-cyan-500",
    textColor: "text-white",
  },
  {
    key: "spelling",
    label: "Spelling",
    icon: Book,
    bgColor: "bg-gradient-to-br from-amber-500 to-yellow-600",
    textColor: "text-white",
  }, // NEW FIELD
  {
    key: "meaning",
    label: "Meaning",
    icon: Lightbulb,
    bgColor: "bg-gradient-to-br from-green-500 to-emerald-600",
    textColor: "text-white",
  },
  {
    key: "sentence",
    label: "Example Sentence",
    icon: Quote,
    bgColor: "bg-gradient-to-br from-orange-500 to-red-500",
    textColor: "text-white",
  },
  {
    key: "synonyms",
    label: "Synonyms",
    icon: Star,
    bgColor: "bg-gradient-to-br from-cyan-500 to-blue-600",
    textColor: "text-white",
  },
  {
    key: "homonyms",
    label: "Homonyms",
    icon: Mic,
    bgColor: "bg-gradient-to-br from-red-500 to-pink-600",
    textColor: "text-white",
  },
  {
    key: "antonyms",
    label: "Antonyms",
    icon: Brain,
    bgColor: "bg-gradient-to-br from-pink-500 to-rose-600",
    textColor: "text-white",
  },
  {
    key: "rhyming",
    label: "Rhyming Words",
    icon: Volume2,
    bgColor: "bg-gradient-to-br from-teal-500 to-green-600",
    textColor: "text-white",
  },
  {
    key: "plural",
    label: "Plural Form",
    icon: Book,
    bgColor: "bg-gradient-to-br from-amber-500 to-yellow-600",
    textColor: "text-white",
  },
];
const DEFAULT_PAUSE_MS = 1000;

const getSpeechVoices = () =>
  new Promise((resolve) => {
    let voices = window.speechSynthesis.getVoices();
    if (voices.length) {
      resolve(voices);
      return;
    }
    window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices();
      resolve(voices);
    };
  });

// Helper to spell word letter-by-letter
const getSpellingText = (word) => {
  if (!word) return "";
  // Add space between each letter for spelling out
  return word.split("").join(" ");
};

export default function WordOfTheDayCard() {
  const [index, setIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentFieldIndex, setCurrentFieldIndex] = useState(null);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  // UI state
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  // --- STOP SPEAKING REFS ---
  const isCancelledRef = useRef(false);
  const speechRef = useRef({ cancel: () => {} });

  const wordObj = useMemo(() => wordData[index], [index]);

  useEffect(() => {
    getSpeechVoices().then(setVoices);
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const seriesNumber = index + 1;
  const classGroup = "Class I-II";
  const dateStr = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const cancelSpeech = () => {
    isCancelledRef.current = true;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setCurrentFieldIndex(null);
  };

  const speakField = async (fieldIdx, cb) => {
    if (isSpeaking) return;

    isCancelledRef.current = false;
    setCurrentFieldIndex(fieldIdx);
    setIsSpeaking(true);

    let field = LUCIDE_FIELDS[fieldIdx];
    let text = "";

    // If "spelling" field, spell word
    if (field.key === "spelling") {
      text = `Spelling: ${getSpellingText(wordObj.word)}`;
    } else {
      text = wordObj[field.key] ? `${field.label}: ${wordObj[field.key]}` : "";
    }

    if (!text) {
      setIsSpeaking(false);
      setCurrentFieldIndex(null);
      if (cb) cb();
      return;
    }

    const utterance = new window.SpeechSynthesisUtterance(text);
    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.onend = () => {
      if (isCancelledRef.current) {
        setCurrentFieldIndex(null);
        setIsSpeaking(false);
        return;
      }
      setTimeout(() => {
        setCurrentFieldIndex(null);
        setIsSpeaking(false);
        if (cb) cb();
      }, DEFAULT_PAUSE_MS);
    };

    utterance.onerror = () => {
      setCurrentFieldIndex(null);
      setIsSpeaking(false);
      if (cb) cb();
    };

    window.speechSynthesis.speak(utterance);
    speechRef.current.cancel = cancelSpeech;
  };

  // Speak all fields in the order: Word, PartOfSpeech, Pronunciation, Spelling
  const speakAllFieldsSequentially = async () => {
    if (isSpeaking) return;

    isCancelledRef.current = false;
    setIsSpeaking(true);

    // Only the first four boxes (Word, PartOfSpeech, Pronunciation, Spelling)
    let idx = 0;
    const speakNext = () => {
      if (isCancelledRef.current || idx >= 4) {
        setIsSpeaking(false);
        setCurrentFieldIndex(null);
        return;
      }
      speakField(idx, () => {
        if (!isCancelledRef.current) {
          idx += 1;
          speakNext();
        }
      });
    };
    speakNext();
  };

  const handleNext = () => {
    cancelSpeech();
    setIndex((prev) => (prev + 1) % wordData.length);
    resetCardState();
  };

  const handlePrev = () => {
    cancelSpeech();
    setIndex((prev) => (prev - 1 + wordData.length) % wordData.length);
    resetCardState();
  };

  const resetCardState = () => {
    setLiked(false);
    setSaved(false);
    setImageLoaded(false);
  };

  const handleVoiceChange = (voiceURI) => {
    const voice = voices.find((v) => v.voiceURI === voiceURI);
    setSelectedVoice(voice || null);
  };

  const handleLike = () => setLiked((prev) => !prev);
  const handleSaveWord = () => setSaved((prev) => !prev);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white rounded-3xl p-8 md:p-10 text-center shadow-2xl relative overflow-hidden backdrop-blur-sm border border-white/20">
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-white/5"></div>
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-purple-300/20 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-black tracking-wider mb-4 drop-shadow-2xl bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
            Word Of The Day Series!
          </h1>
          <p className="text-lg md:text-xl opacity-95 font-semibold drop-shadow-lg">
            Unleash your vocabulary, one day at a time. Practice, listen, and
            master new words!
          </p>
        </div>
      </div>

      {/* Info Bar */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/30 flex flex-wrap justify-between items-center gap-6">
        <div className="flex items-center gap-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-600 text-white px-6 py-3 rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
          <Sparkles size={22} className="drop-shadow-lg" />
          <span className="font-bold text-lg">Series: {seriesNumber}</span>
        </div>
        <div className="flex items-center gap-4 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-600 text-white px-6 py-3 rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
          <GraduationCap size={22} className="drop-shadow-lg" />
          <span className="font-bold text-lg">{classGroup}</span>
        </div>
        <div className="flex items-center gap-4 bg-gradient-to-r from-pink-500 via-red-500 to-orange-600 text-white px-6 py-3 rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
          <Calendar size={22} className="drop-shadow-lg" />
          <span className="font-bold text-lg">{dateStr}</span>
        </div>
      </div>

      {/* Instruction Cards */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-sm border border-white/20">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full -translate-y-12 translate-x-12 blur-xl"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-cyan-300/30 rounded-full blur-lg"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 drop-shadow-lg">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Lightbulb size={26} />
              </div>
              💡 Listening Tip
            </h3>
            <p className="opacity-95 leading-relaxed text-lg font-medium">
              Click on any colorful box below to listen to that specific part.
              Use the "Read All" button for complete pronunciation practice with
              your chosen voice.
            </p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-600 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-sm border border-white/20">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full -translate-y-12 translate-x-12 blur-xl"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-pink-300/30 rounded-full blur-lg"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 drop-shadow-lg">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Star size={26} />
              </div>
              🌟 Don't Forget
            </h3>
            <p className="opacity-95 leading-relaxed text-lg font-medium">
              Your feedback helps us improve! Please rate the word difficulty
              and leave comments at the bottom of the card.
            </p>
          </div>
        </div>
      </div>

      {/* Main Word Card */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-2xl"></div>

        {/* Header - split halves */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 text-white rounded-3xl mb-10 shadow-2xl relative overflow-hidden backdrop-blur-sm border border-white/20 flex flex-col md:flex-row items-stretch">
          {/* Left half */}
          <div className="flex-1 flex items-center justify-start px-10 py-10 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
            <div className="relative z-10">
              <h2 className="text-5xl md:text-6xl font-black tracking-wider mb-3 drop-shadow-2xl bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text">
                {wordObj.word}
              </h2>
              <p className="text-lg md:text-xl opacity-95 font-semibold drop-shadow-lg">
                Today's Word of the Day
              </p>
            </div>
          </div>
          {/* Right half */}
          <div className="flex-1 flex flex-col items-center justify-center px-10 py-10 relative">
            <div className="absolute inset-0 bg-gradient-to-bl from-white/5 to-transparent"></div>
            <div className="flex flex-col items-center justify-center relative z-10">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br from-blue-400/90 to-purple-500/90 text-white shadow-2xl backdrop-blur-sm border border-white/20 hover:scale-110 transition-transform duration-300">
                <Book size={44} className="drop-shadow-lg" />
              </div>
              <div className="text-center">
                <div className="font-bold text-xl text-gray-100 drop-shadow-lg mb-1">
                  Visual representation
                </div>
                <div className="text-base text-gray-200 drop-shadow-md">
                  of "{wordObj.word}"
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6 mb-12">
          <button
            onClick={handleLike}
            className={`p-5 rounded-2xl transition-all duration-300 shadow-2xl backdrop-blur-sm border border-white/20 relative overflow-hidden ${
              liked
                ? "bg-gradient-to-br from-red-500/90 to-pink-600/90 text-white scale-110 shadow-red-500/25"
                : "bg-white/80 hover:bg-gradient-to-br hover:from-red-100/80 hover:to-pink-100/80 hover:scale-110"
            }`}
            type="button"
          >
            <Heart
              size={26}
              fill={liked ? "white" : "none"}
              className={liked ? "drop-shadow-lg" : ""}
            />
          </button>
          <button
            onClick={handleSaveWord}
            className={`p-5 rounded-2xl transition-all duration-300 shadow-2xl backdrop-blur-sm border border-white/20 relative overflow-hidden ${
              saved
                ? "bg-gradient-to-br from-blue-500/90 to-indigo-600/90 text-white scale-110 shadow-blue-500/25"
                : "bg-white/80 hover:bg-gradient-to-br hover:from-blue-100/80 hover:to-indigo-100/80 hover:scale-110"
            }`}
            type="button"
          >
            <LucideBookmark
              size={26}
              fill={saved ? "white" : "none"}
              className={saved ? "drop-shadow-lg" : ""}
            />
          </button>
          <button
            className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/90 to-green-600/90 text-white hover:scale-110 transition-all duration-300 shadow-2xl backdrop-blur-sm border border-white/20 shadow-emerald-500/25"
            type="button"
          >
            <Share2 size={26} className="drop-shadow-lg" />
          </button>
          <button
            className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/90 to-pink-600/90 text-white hover:scale-110 transition-all duration-300 shadow-2xl backdrop-blur-sm border border-white/20 shadow-purple-500/25"
            onClick={() => speakField(0)}
            type="button"
          >
            <Mic size={26} className="drop-shadow-lg" />
          </button>
        </div>

        {/* Word Details - Top Row (now 4 boxes) */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          {/* Word Box */}
          <div
            onClick={() => !isSpeaking && speakField(0)}
            tabIndex={0}
            className={`bg-gradient-to-br from-orange-500/90 to-amber-600/90 text-white p-8 rounded-3xl cursor-pointer transition-all duration-300 shadow-2xl flex flex-col items-center justify-center text-center backdrop-blur-sm border border-white/20 relative overflow-hidden ${
              currentFieldIndex === 0
                ? "scale-110 shadow-3xl ring-4 ring-white/50 animate-pulse"
                : "hover:scale-105 hover:shadow-3xl"
            }`}
            style={{ minWidth: 0 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="relative z-10">
              <div className="bg-white/25 p-3 rounded-2xl backdrop-blur-sm shadow-xl mb-4 inline-flex">
                <Sparkles
                  size={24}
                  className={`drop-shadow-lg ${
                    currentFieldIndex === 0 ? "animate-bounce" : ""
                  }`}
                />
              </div>
              <p className="text-sm font-bold opacity-90 mb-2 drop-shadow-sm uppercase tracking-wide">
                WORD
              </p>
              <p className="text-2xl font-bold drop-shadow-lg">
                {wordObj.word}
              </p>
            </div>
          </div>

          {/* Spelling Box */}
          <div
            onClick={() => !isSpeaking && speakField(1)}
            tabIndex={0}
            className={`bg-gradient-to-br from-amber-500/90 to-orange-600/90 text-white p-8 rounded-3xl cursor-pointer transition-all duration-300 shadow-2xl flex flex-col items-center justify-center text-center backdrop-blur-sm border border-white/20 relative overflow-hidden ${
              currentFieldIndex === 1
                ? "scale-110 shadow-3xl ring-4 ring-white/50 animate-pulse"
                : "hover:scale-105 hover:shadow-3xl"
            }`}
            style={{ minWidth: 0 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="relative z-10">
              <div className="bg-white/25 p-3 rounded-2xl backdrop-blur-sm shadow-xl mb-4 inline-flex">
                <LucideBookmark
                  size={24}
                  className={`drop-shadow-lg ${
                    currentFieldIndex === 1 ? "animate-bounce" : ""
                  }`}
                />
              </div>
              <p className="text-sm font-bold opacity-90 mb-2 drop-shadow-sm uppercase tracking-wide">
                SPELLING
              </p>
              <p className="text-xl font-bold drop-shadow-lg font-mono">
                {getSpellingText(wordObj.word)
                  .split(" ")
                  .map((char, idx) => (
                    <span key={idx} className="inline-block px-0.5">
                      {char}
                    </span>
                  ))}
              </p>
            </div>
          </div>

          {/* Pronunciation Box */}
          <div
            onClick={() => !isSpeaking && speakField(2)}
            tabIndex={0}
            className={`bg-gradient-to-br from-blue-500/90 to-indigo-600/90 text-white p-8 rounded-3xl cursor-pointer transition-all duration-300 shadow-2xl flex flex-col items-center justify-center text-center backdrop-blur-sm border border-white/20 relative overflow-hidden ${
              currentFieldIndex === 2
                ? "scale-110 shadow-3xl ring-4 ring-white/50 animate-pulse"
                : "hover:scale-105 hover:shadow-3xl"
            }`}
            style={{ minWidth: 0 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="relative z-10">
              <div className="bg-white/25 p-3 rounded-2xl backdrop-blur-sm shadow-xl mb-4 inline-flex">
                <Volume2
                  size={24}
                  className={`drop-shadow-lg ${
                    currentFieldIndex === 2 ? "animate-bounce" : ""
                  }`}
                />
              </div>
              <p className="text-sm font-bold opacity-90 mb-2 drop-shadow-sm uppercase tracking-wide">
                PRONUNCIATION
              </p>
              <p className="text-xl font-bold drop-shadow-lg">
                /{wordObj.pronunciation}/
              </p>
            </div>
          </div>

          {/* Part of Speech Box */}
          <div
            onClick={() => !isSpeaking && speakField(3)}
            tabIndex={0}
            className={`bg-gradient-to-br from-purple-500/90 to-pink-600/90 text-white p-8 rounded-3xl cursor-pointer transition-all duration-300 shadow-2xl flex flex-col items-center justify-center text-center backdrop-blur-sm border border-white/20 relative overflow-hidden ${
              currentFieldIndex === 3
                ? "scale-110 shadow-3xl ring-4 ring-white/50 animate-pulse"
                : "hover:scale-105 hover:shadow-3xl"
            }`}
            style={{ minWidth: 0 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="relative z-10">
              <div className="bg-white/25 p-3 rounded-2xl backdrop-blur-sm shadow-xl mb-4 inline-flex">
                <Brain
                  size={24}
                  className={`drop-shadow-lg ${
                    currentFieldIndex === 3 ? "animate-bounce" : ""
                  }`}
                />
              </div>
              <p className="text-sm font-bold opacity-90 mb-2 drop-shadow-sm uppercase tracking-wide">
                PART OF SPEECH
              </p>
              <p className="text-xl font-bold drop-shadow-lg">
                {wordObj.partOfSpeech}
              </p>
            </div>
          </div>
        </div>
        {/* Meaning and Sentence Row - equal width */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div
            onClick={() => !isSpeaking && speakField(4)}
            tabIndex={0}
            className={`${LUCIDE_FIELDS[4].bgColor} ${
              LUCIDE_FIELDS[4].textColor
            } p-8 rounded-3xl cursor-pointer transition-all duration-300 shadow-2xl flex flex-col justify-center backdrop-blur-sm border border-white/20 relative overflow-hidden ${
              currentFieldIndex === 4
                ? "scale-105 shadow-3xl ring-4 ring-white/50 animate-pulse"
                : "hover:scale-102 hover:shadow-3xl"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="flex items-start gap-5 relative z-10">
              <div className="bg-white/25 p-4 rounded-2xl backdrop-blur-sm shadow-xl">
                <Lightbulb
                  size={32}
                  className={`drop-shadow-lg ${
                    currentFieldIndex === 4 ? "animate-bounce" : ""
                  }`}
                />
              </div>
              <div>
                <p className="text-sm font-bold opacity-90 mb-3 drop-shadow-sm uppercase tracking-wide">
                  Detailed Meaning
                </p>
                <p className="leading-relaxed font-semibold text-lg drop-shadow-sm">
                  {wordObj.meaning}
                </p>
              </div>
            </div>
          </div>
          <div
            onClick={() => !isSpeaking && speakField(5)}
            tabIndex={0}
            className={`${LUCIDE_FIELDS[5].bgColor} ${
              LUCIDE_FIELDS[5].textColor
            } p-8 rounded-3xl cursor-pointer transition-all duration-300 shadow-2xl flex flex-col justify-center backdrop-blur-sm border border-white/20 relative overflow-hidden ${
              currentFieldIndex === 5
                ? "scale-105 shadow-3xl ring-4 ring-white/50 animate-pulse"
                : "hover:scale-102 hover:shadow-3xl"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="flex items-start gap-5 relative z-10">
              <div className="bg-white/25 p-4 rounded-2xl backdrop-blur-sm shadow-xl">
                <Quote
                  size={32}
                  className={`drop-shadow-lg ${
                    currentFieldIndex === 5 ? "animate-bounce" : ""
                  }`}
                />
              </div>
              <div>
                <p className="text-sm font-bold opacity-90 mb-3 drop-shadow-sm uppercase tracking-wide">
                  Example Sentence
                </p>
                <p className="italic leading-relaxed font-semibold text-lg drop-shadow-sm">
                  "{wordObj.sentence}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Word Info */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
          {LUCIDE_FIELDS.slice(6).map((field, idx) => {
            const Icon = field.icon;
            const actualIndex = idx + 6;
            const isActive = currentFieldIndex === actualIndex;
            return (
              <div
                key={field.key}
                onClick={() => !isSpeaking && speakField(actualIndex)}
                tabIndex={0}
                className={`${field.bgColor} ${
                  field.textColor
                } p-6 rounded-3xl cursor-pointer transition-all duration-300 shadow-2xl flex flex-col justify-center backdrop-blur-sm border border-white/20 relative overflow-hidden ${
                  isActive
                    ? "scale-110 shadow-3xl ring-4 ring-white/50 animate-pulse"
                    : "hover:scale-105 hover:shadow-3xl"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                <div className="text-center relative z-10">
                  <div className="bg-white/25 p-3 rounded-2xl inline-flex mb-4 backdrop-blur-sm shadow-xl">
                    <Icon
                      size={24}
                      className={`drop-shadow-lg ${
                        isActive ? "animate-bounce" : ""
                      }`}
                    />
                  </div>
                  <p className="text-xs font-bold opacity-90 mb-2 drop-shadow-sm uppercase tracking-wide">
                    {field.label}
                  </p>
                  <p className="text-base font-bold drop-shadow-sm">
                    {wordObj[field.key] || "—"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="bg-gradient-to-r from-gray-100/80 via-white/60 to-gray-100/80 p-8 rounded-3xl shadow-2xl backdrop-blur-xl border border-white/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
          <div className="flex items-center justify-center gap-8 flex-wrap relative z-10">
            <button
              className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/90 to-indigo-600/90 text-white hover:scale-110 transition-all duration-300 shadow-2xl backdrop-blur-sm border border-white/20 shadow-blue-500/25"
              onClick={handlePrev}
              disabled={isSpeaking}
              type="button"
              aria-label="Previous Word"
            >
              <ChevronLeft size={26} className="drop-shadow-lg" />
            </button>

            <div className="min-w-52">
              <VoiceSelector
                onVoiceChange={handleVoiceChange}
                selectedVoice={selectedVoice?.voiceURI || ""}
                voices={voices}
                disabled={isSpeaking}
                sx={{ minWidth: 200 }}
              />
            </div>

            <button
              className="px-10 py-5 bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white rounded-2xl font-bold hover:from-blue-700/90 hover:to-purple-700/90 transition-all duration-300 shadow-2xl hover:scale-110 flex items-center gap-4 backdrop-blur-sm border border-white/20 shadow-blue-600/25"
              onClick={speakAllFieldsSequentially}
              disabled={isSpeaking}
              type="button"
              aria-label="Read All"
            >
              <Volume2 size={26} className="drop-shadow-lg" />
              <span className="text-lg font-black tracking-wide drop-shadow-sm">
                {isSpeaking ? (
                  <CircularProgress size={22} color="inherit" />
                ) : (
                  "READ ALL"
                )}
              </span>
            </button>

            {isSpeaking && (
              <button
                className="px-8 py-4 bg-gradient-to-r from-red-500/90 to-pink-600/90 text-white rounded-2xl font-bold transition-all duration-200 shadow-2xl hover:from-red-600/90 hover:to-pink-700/90 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-red-300/50 backdrop-blur-sm border border-white/20 shadow-red-500/25"
                onClick={cancelSpeech}
                aria-label="Stop Reading"
                type="button"
              >
                <span className="text-lg font-black tracking-wide drop-shadow-sm">
                  🛑 Stop Reading
                </span>
              </button>
            )}

            <button
              className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/90 to-indigo-600/90 text-white hover:scale-110 transition-all duration-300 shadow-2xl backdrop-blur-sm border border-white/20 shadow-blue-500/25"
              onClick={handleNext}
              disabled={isSpeaking}
              type="button"
              aria-label="Next Word"
            >
              <ChevronRight size={26} className="drop-shadow-lg" />
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <ReviewRatingFeedbackSection
        onSubmit={(data) => {
          setSaving(true);
          console.log("User feedback:", data);
          setTimeout(() => setSaving(false), 1000);
        }}
        isSubmitting={saving}
        isSpeaking={isSpeaking}
      />
    </div>
  );
}
