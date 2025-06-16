import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  CircularProgress
} from "@mui/material";
import VoiceSelector from "../components/VoiceSelector";
import wordData from "./WordOfTheDayData";
import ReviewRatingFeedbackSection from "../components/ReviewRatingFeedbackSection";

// Lucide icons for visual style
import { Heart, Bookmark as LucideBookmark, Share2, Volume2, Star, Book, Lightbulb, Brain, Quote, Mic, ChevronLeft, ChevronRight, Sparkles, Calendar, GraduationCap } from 'lucide-react';

const LUCIDE_FIELDS = [
  { key: 'word', label: 'Word', icon: Sparkles, bgColor: 'bg-gradient-to-br from-yellow-400 to-orange-500', textColor: 'text-white' },
  { key: 'partOfSpeech', label: 'Part of Speech', icon: Brain, bgColor: 'bg-gradient-to-br from-purple-500 to-pink-600', textColor: 'text-white' },
  { key: 'pronunciation', label: 'Pronunciation', icon: Volume2, bgColor: 'bg-gradient-to-br from-blue-500 to-cyan-500', textColor: 'text-white' },
  { key: 'meaning', label: 'Meaning', icon: Lightbulb, bgColor: 'bg-gradient-to-br from-green-500 to-emerald-600', textColor: 'text-white' },
  { key: 'sentence', label: 'Example Sentence', icon: Quote, bgColor: 'bg-gradient-to-br from-orange-500 to-red-500', textColor: 'text-white' },
  { key: 'synonyms', label: 'Synonyms', icon: Star, bgColor: 'bg-gradient-to-br from-cyan-500 to-blue-600', textColor: 'text-white' },
  { key: 'homonyms', label: 'Homonyms', icon: Mic, bgColor: 'bg-gradient-to-br from-red-500 to-pink-600', textColor: 'text-white' },
  { key: 'antonyms', label: 'Antonyms', icon: Brain, bgColor: 'bg-gradient-to-br from-pink-500 to-rose-600', textColor: 'text-white' },
  { key: 'rhyming', label: 'Rhyming Words', icon: Volume2, bgColor: 'bg-gradient-to-br from-teal-500 to-green-600', textColor: 'text-white' },
  { key: 'plural', label: 'Plural Form', icon: Book, bgColor: 'bg-gradient-to-br from-amber-500 to-yellow-600', textColor: 'text-white' }
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

    const field = LUCIDE_FIELDS[fieldIdx];
    const text = wordObj[field.key] ? `${field.label}: ${wordObj[field.key]}` : "";
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

  const speakAllFieldsSequentially = async () => {
    if (isSpeaking) return;

    isCancelledRef.current = false;
    setIsSpeaking(true);

    let idx = 0;
    const speakNext = () => {
      if (isCancelledRef.current || idx >= LUCIDE_FIELDS.length) {
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
    <div className="max-w-5xl mx-auto p-4 space-y-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-3xl p-6 md:p-8 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-black tracking-wider mb-3 drop-shadow-lg">
            Word Of The Day Series!
          </h1>
          <p className="text-base md:text-lg opacity-95 font-medium">
            Unleash your vocabulary, one day at a time. Practice, listen, and master new words!
          </p>
        </div>
      </div>

      {/* Info Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-xl border border-gray-100 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full">
          <Sparkles size={20} />
          <span className="font-bold">Series: {seriesNumber}</span>
        </div>
        <div className="flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full">
          <GraduationCap size={20} />
          <span className="font-bold">{classGroup}</span>
        </div>
        <div className="flex items-center gap-3 bg-gradient-to-r from-pink-500 to-red-500 text-white px-4 py-2 rounded-full">
          <Calendar size={20} />
          <span className="font-bold">{dateStr}</span>
        </div>
      </div>

      {/* Instruction Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Lightbulb size={24} />
              💡 Listening Tip
            </h3>
            <p className="opacity-95 leading-relaxed">
              Click on any colorful box below to listen to that specific part. Use the "Read All" button for complete pronunciation practice with your chosen voice.
            </p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Star size={24} />
              🌟 Don't Forget
            </h3>
            <p className="opacity-95 leading-relaxed">
              Your feedback helps us improve! Please rate the word difficulty and leave comments at the bottom of the card.
            </p>
          </div>
        </div>
      </div>

      {/* Main Word Card */}
      <div className="bg-white rounded-3xl p-6 shadow-2xl border border-gray-100">
        {/* Image Placeholder */}
        <div className="relative h-56 rounded-2xl overflow-hidden mb-6 shadow-lg bg-gradient-to-br from-gray-200 to-gray-300">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Book className="text-white" size={32} />
                </div>
                <p className="text-gray-600 font-semibold text-lg">Visual representation</p>
                <p className="text-gray-500">of "{wordObj.word}"</p>
              </div>
            </div>
          )}
          <img
            src={`https://source.unsplash.com/random/800x400/?${wordObj.word}`}
            alt={`Visual representation of ${wordObj.word}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: imageLoaded ? "block" : "none",
            }}
            onLoad={() => setImageLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <h2 className="text-4xl font-black drop-shadow-lg">{wordObj.word}</h2>
            <p className="text-lg opacity-90 font-medium">Master your vocabulary</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button 
            onClick={handleLike}
            className={`p-4 rounded-2xl transition-all duration-300 shadow-lg ${
              liked 
                ? 'bg-gradient-to-br from-red-500 to-pink-600 text-white scale-110' 
                : 'bg-gradient-to-br from-gray-100 to-gray-200 hover:from-red-100 hover:to-pink-100 hover:scale-105'
            }`}
            type="button"
          >
            <Heart size={24} fill={liked ? 'white' : 'none'} />
          </button>
          <button 
            onClick={handleSaveWord}
            className={`p-4 rounded-2xl transition-all duration-300 shadow-lg ${
              saved 
                ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white scale-110' 
                : 'bg-gradient-to-br from-gray-100 to-gray-200 hover:from-blue-100 hover:to-indigo-100 hover:scale-105'
            }`}
            type="button"
          >
            <LucideBookmark size={24} fill={saved ? 'white' : 'none'} />
          </button>
          <button className="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white hover:scale-105 transition-all duration-300 shadow-lg" type="button">
            <Share2 size={24} />
          </button>
          <button className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white hover:scale-105 transition-all duration-300 shadow-lg" onClick={() => speakField(0)} type="button">
            <Mic size={24} />
          </button>
        </div>

        {/* Word Details - Top Row */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {LUCIDE_FIELDS.slice(0, 3).map((field, index) => {
            const Icon = field.icon;
            const isActive = currentFieldIndex === index;
            return (
              <div
                key={field.key}
                onClick={() => !isSpeaking && speakField(index)}
                tabIndex={0}
                className={`${field.bgColor} ${field.textColor} p-6 rounded-2xl cursor-pointer transition-all duration-300 shadow-lg ${
                  isActive 
                    ? 'scale-105 shadow-2xl ring-4 ring-white ring-opacity-50' 
                    : 'hover:scale-102 hover:shadow-xl'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Icon size={28} className={isActive ? 'animate-pulse' : ''} />
                  </div>
                  <div>
                    <p className="text-sm font-bold opacity-90 mb-1">{field.label}</p>
                    <p className={`text-xl ${index === 0 ? 'font-black' : 'font-bold'}`}>
                      {index === 2 ? `/${wordObj[field.key]}/` : wordObj[field.key]}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Meaning and Sentence Row */}
        <div className="grid md:grid-cols-5 gap-4 mb-6">
          <div
            onClick={() => !isSpeaking && speakField(3)}
            tabIndex={0}
            className={`md:col-span-3 ${LUCIDE_FIELDS[3].bgColor} ${LUCIDE_FIELDS[3].textColor} p-6 rounded-2xl cursor-pointer transition-all duration-300 shadow-lg ${
              currentFieldIndex === 3
                ? 'scale-105 shadow-2xl ring-4 ring-white ring-opacity-50'
                : 'hover:scale-102 hover:shadow-xl'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <Lightbulb size={28} className={currentFieldIndex === 3 ? 'animate-pulse' : ''} />
              </div>
              <div>
                <p className="text-sm font-bold opacity-90 mb-2">Detailed Meaning</p>
                <p className="leading-relaxed font-medium">{wordObj.meaning}</p>
              </div>
            </div>
          </div>
          <div
            onClick={() => !isSpeaking && speakField(4)}
            tabIndex={0}
            className={`md:col-span-2 ${LUCIDE_FIELDS[4].bgColor} ${LUCIDE_FIELDS[4].textColor} p-6 rounded-2xl cursor-pointer transition-all duration-300 shadow-lg ${
              currentFieldIndex === 4
                ? 'scale-105 shadow-2xl ring-4 ring-white ring-opacity-50'
                : 'hover:scale-102 hover:shadow-xl'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <Quote size={28} className={currentFieldIndex === 4 ? 'animate-pulse' : ''} />
              </div>
              <div>
                <p className="text-sm font-bold opacity-90 mb-2">Example Sentence</p>
                <p className="italic leading-relaxed font-medium">"{wordObj.sentence}"</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Word Info */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {LUCIDE_FIELDS.slice(5).map((field, idx) => {
            const Icon = field.icon;
            const actualIndex = idx + 5;
            const isActive = currentFieldIndex === actualIndex;
            return (
              <div
                key={field.key}
                onClick={() => !isSpeaking && speakField(actualIndex)}
                tabIndex={0}
                className={`${field.bgColor} ${field.textColor} p-4 rounded-2xl cursor-pointer transition-all duration-300 shadow-lg ${
                  isActive
                    ? 'scale-105 shadow-2xl ring-4 ring-white ring-opacity-50'
                    : 'hover:scale-102 hover:shadow-xl'
                }`}
              >
                <div className="text-center">
                  <div className="bg-white/20 p-2 rounded-lg inline-flex mb-3">
                    <Icon size={20} className={isActive ? 'animate-pulse' : ''} />
                  </div>
                  <p className="text-xs font-bold opacity-90 mb-1">{field.label}</p>
                  <p className="text-sm font-semibold">{wordObj[field.key] || '—'}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl shadow-inner">
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <button
              className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:scale-105 transition-all duration-300 shadow-lg"
              onClick={handlePrev}
              disabled={isSpeaking}
              type="button"
              aria-label="Previous Word"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="min-w-48">
              <VoiceSelector
                onVoiceChange={handleVoiceChange}
                selectedVoice={selectedVoice?.voiceURI || ""}
                voices={voices}
                disabled={isSpeaking}
                sx={{ minWidth: 180 }}
              />
            </div>

            <button
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:scale-105 flex items-center gap-3"
              onClick={speakAllFieldsSequentially}
              disabled={isSpeaking}
              type="button"
              aria-label="Read All"
            >
              <Volume2 size={24} />
              {isSpeaking ? <CircularProgress size={20} color="inherit" /> : "READ ALL"}
            </button>

            {isSpeaking && (
              <button
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-bold transition-all duration-200 shadow-lg hover:from-red-600 hover:to-pink-700 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300"
                onClick={cancelSpeech}
                aria-label="Stop Reading"
                type="button"
              >
                🛑 Stop Reading
              </button>
            )}

            <button
              className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:scale-105 transition-all duration-300 shadow-lg"
              onClick={handleNext}
              disabled={isSpeaking}
              type="button"
              aria-label="Next Word"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <ReviewRatingFeedbackSection
        onSubmit={(data) => {
          setSaving(true);
          console.log('User feedback:', data);
          setTimeout(() => setSaving(false), 1000);
        }}
        isSubmitting={saving}
        isSpeaking={isSpeaking}
      />
    </div>
  );
}