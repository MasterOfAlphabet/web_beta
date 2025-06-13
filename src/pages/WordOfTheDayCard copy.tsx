import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft, ArrowRight, Volume2, Heart, HeartOff, Share2, MessageCircle, Bookmark,
  Lightbulb, Brain, Quote, Target, Star, Smile, Meh, Frown
} from "lucide-react";

// Mock VoiceSelector component (replace with your actual implementation)
interface VoiceSelectorProps {
  onSelectVoice: (voice: SpeechSynthesisVoice) => void;
  selectedVoice: SpeechSynthesisVoice | null;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = ({ onSelectVoice, selectedVoice }) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const populateVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (!selectedVoice && availableVoices.length > 0) {
        // Try to select a default English voice
        const defaultVoice = availableVoices.find(voice => voice.lang.startsWith('en')) || availableVoices[0];
        onSelectVoice(defaultVoice);
      }
    };

    populateVoices(); // Populate initially
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = populateVoices; // Update if voices change
    }
  }, [onSelectVoice, selectedVoice]);

  return (
    <select
      className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
      onChange={(e) => {
        const selected = voices.find(voice => voice.name === e.target.value);
        if (selected) onSelectVoice(selected);
      }}
      value={selectedVoice?.name || ''}
      disabled={voices.length === 0}
    >
      <option value="">Select Voice</option>
      {voices.map((voice) => (
        <option key={voice.name} value={voice.name}>
          {voice.name} ({voice.lang})
        </option>
      ))}
    </select>
  );
};


// Word Data Structure (Enhanced)
interface WordEntry {
  id: number;
  word: string;
  pronunciation: string;
  partOfSpeech: string;
  meaning: string;
  examples: string[];
  synonyms: string[];
  antonyms: string[];
  idiom?: { text: string; meaning: string; };
  phrase?: { text: string; meaning: string; };
  proverb?: { text: string; meaning: string; };
  relatedWords: string[];
  tips: string[];
  memoryAid: string;
  dailyQuote?: string;
  origin?: string;
  funFact?: string;
}

// Dummy Word Data (Extensive for demonstration)
const wordData: WordEntry[] = [
  {
    id: 1,
    word: "Ephemeral",
    pronunciation: "/ɪˈfɛmərəl/",
    partOfSpeech: "adjective",
    meaning: "Lasting for a very short time.",
    examples: [
      "The beauty of the cherry blossoms is ephemeral.",
      "His fame was ephemeral, lasting only a few years.",
    ],
    synonyms: ["transient", "fleeting", "short-lived", "momentary"],
    antonyms: ["permanent", "eternal", "long-lasting"],
    idiom: { text: "flash in the pan", meaning: "a temporary success that is not repeated." },
    relatedWords: ["fugacious", "transitory", "evanescent"],
    tips: [
      "Remember 'E-FEM-er-al' for pronunciation.",
      "Think of 'e' for 'ending' quickly.",
    ],
    memoryAid: "EPH-EM-ERAL sounds like 'a femoral' artery – blood flow is fast, so things are short-lived.",
    dailyQuote: "Life is what happens while you are busy making other plans. - John Lennon",
    origin: "Greek: ephemeros 'lasting only for a day'",
    funFact: "Butterflies have an ephemeral lifespan.",
  },
  {
    id: 2,
    word: "Serendipity",
    pronunciation: "/ˌsɛrənˈdɪpəti/",
    partOfSpeech: "noun",
    meaning: "The occurrence and development of events by chance in a happy or beneficial way.",
    examples: [
      "Meeting my old friend in a foreign country was pure serendipity.",
      "The discovery of penicillin was a result of serendipity.",
    ],
    synonyms: ["chance", "luck", "fortune", "fluke"],
    antonyms: ["misfortune", "bad luck", "predetermination"],
    proverb: { text: "A rolling stone gathers no moss.", meaning: "Someone who keeps moving from place to place or job to job is unlikely to acquire wealth, status, or commitments." },
    relatedWords: ["fortuitous", "happenstance", "kismet"],
    tips: [
      "Pay attention to 'ren' and 'dip' in the middle.",
      "Associate with happy accidents.",
    ],
    memoryAid: "Siren-DIP-ity: A siren (like a fire engine) dips and turns, and you might accidentally find something good on the way.",
    dailyQuote: "The journey of a thousand miles begins with a single step. - Lao Tzu",
    origin: "Coined by Horace Walpole in 1754, from 'The Three Princes of Serendip'",
    funFact: "Many scientific breakthroughs occurred due to serendipity.",
  },
  {
    id: 3,
    word: "Ubiquitous",
    pronunciation: "/juːˈbɪkwɪtəs/",
    partOfSpeech: "adjective",
    meaning: "Present, appearing, or found everywhere.",
    examples: [
      "Smartphones have become ubiquitous in modern society.",
      "The company's logo is ubiquitous, seen on every street.",
    ],
    synonyms: ["omnipresent", "pervasive", "everywhere"],
    antonyms: ["rare", "scarce", "uncommon"],
    phrase: { text: "at every turn", meaning: "everywhere; in all places; constantly." },
    relatedWords: ["universal", "common", "widespread"],
    tips: [
      "Focus on the 'bik-wit' sound.",
      "Think of 'U' like 'universal'.",
    ],
    memoryAid: "U-BIQ-UIT-OUS: 'You' biked everywhere, so you're ubiquitous!",
    dailyQuote: "The only way to do great work is to love what you do. - Steve Jobs",
    origin: "Latin: ubīque 'everywhere'",
    funFact: "Air pollution is an example of something that can be ubiquitous.",
  },
];

// Custom Rating component using Lucide icons
interface CustomRatingProps {
  value: number | null;
  onChange: (newValue: number | null) => void;
  disabled?: boolean;
}

const CustomRating: React.FC<CustomRatingProps> = ({ value, onChange, disabled }) => {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((starValue) => (
        <Star
          key={starValue}
          className={`w-6 h-6 cursor-pointer transition-colors duration-200
            ${starValue <= (hover || value || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          onClick={() => !disabled && onChange(starValue)}
          onMouseEnter={() => !disabled && setHover(starValue)}
          onMouseLeave={() => !disabled && setHover(null)}
        />
      ))}
    </div>
  );
};


export default function WordOfTheDayCard() {
  const [wordIndex, setWordIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [review, setReview] = useState<string | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");

  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    synthesisRef.current = window.speechSynthesis;
    // Cleanup on unmount
    return () => {
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
    };
  }, []);

  const currentWord = wordData[wordIndex];
  const totalWords = wordData.length;

  const handleSpeakerClick = () => {
    if (!synthesisRef.current || !currentWord) return;

    if (isSpeaking) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(currentWord.word + ". " + currentWord.meaning);
    utterance.voice = selectedVoice;
    utterance.pitch = 1;
    utterance.rate = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setIsSpeaking(false);
    };

    synthesisRef.current.speak(utterance);
  };

  const handleNav = (direction: "prev" | "next") => {
    setReview(null); // Reset review/rating/comment on navigation
    setRating(null);
    setComment("");
    setIsFavorite(false);
    setIsBookmarked(false);
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }
    if (direction === "prev") {
      setWordIndex((prevIndex) => (prevIndex === 0 ? totalWords - 1 : prevIndex - 1));
    } else {
      setWordIndex((prevIndex) => (prevIndex === totalWords - 1 ? 0 : prevIndex + 1));
    }
  };

  const reviewOptions = ["New", "Familiar", "Mastered"];

  const handleReviewSelect = (option: string) => {
    setReview(option);
    // Logic to save review to backend could go here
  };

  const handleSave = () => {
    console.log("Saving feedback:", {
      word: currentWord.word,
      review,
      rating,
      comment,
      isFavorite,
      isBookmarked,
    });
    alert("Feedback saved!");
    // You would typically send this data to a backend API
  };

  const FieldRow: React.FC<{ icon: React.ReactNode; label: string; value: string | React.ReactNode }> = ({ icon, label, value }) => (
    <div className="flex items-start text-gray-700 py-1">
      <div className="flex-shrink-0 mt-0.5 text-blue-500 mr-2">{icon}</div>
      <div>
        <span className="font-semibold">{label}:</span> {value}
      </div>
    </div>
  );

  return (
    <div className="relative w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
      {/* Header and Navigation */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <button
          onClick={() => handleNav("prev")}
          className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
          aria-label="Previous Word"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-bold">Word of the Day</h2>
          <span className="text-sm opacity-80">
            {currentWord.id} / {totalWords}
          </span>
        </div>
        <button
          onClick={() => handleNav("next")}
          className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
          aria-label="Next Word"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>

      {/* Main Word Section */}
      <div className="p-8 text-center bg-blue-50 border-b border-blue-200">
        <h1 className="text-6xl font-extrabold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent mb-2 animate-slide-up">
          {currentWord.word}
        </h1>
        <p className="text-2xl text-gray-700 font-medium mb-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {currentWord.pronunciation} <span className="font-bold text-blue-600">[{currentWord.partOfSpeech}]</span>
        </p>

        {/* Pronunciation & Voice Selector */}
        <div className="flex items-center justify-center space-x-4 mb-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <button
            onClick={handleSpeakerClick}
            className={`p-3 rounded-full shadow-md transition-all duration-300
              ${isSpeaking ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-500 text-white hover:bg-blue-600'}
            `}
            aria-label={isSpeaking ? "Stop Speaking" : "Listen to Word"}
          >
            <Volume2 className="w-6 h-6" />
          </button>
          <VoiceSelector selectedVoice={selectedVoice} onSelectVoice={setSelectedVoice} />
        </div>
        <p className="text-xl text-gray-800 leading-relaxed font-semibold animate-slide-up" style={{ animationDelay: '0.3s' }}>
          "{currentWord.meaning}"
        </p>
      </div>

      {/* Core Word Details */}
      <div className="p-8 space-y-6">
        {/* Examples */}
        <div className="bg-purple-50 p-5 rounded-xl border border-purple-200 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-lg font-bold text-purple-700 mb-3 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2" /> Examples
          </h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            {currentWord.examples.map((ex, idx) => (
              <li key={idx}>{ex}</li>
            ))}
          </ul>
        </div>

        {/* Synonyms & Antonyms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 p-5 rounded-xl border border-green-200 animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <h3 className="text-lg font-bold text-green-700 mb-3 flex items-center">
              <Brain className="w-5 h-5 mr-2" /> Synonyms
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentWord.synonyms.map((syn, idx) => (
                <span key={idx} className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-medium">
                  {syn}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-red-50 p-5 rounded-xl border border-red-200 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <h3 className="text-lg font-bold text-red-700 mb-3 flex items-center">
              <Target className="w-5 h-5 mr-2" /> Antonyms
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentWord.antonyms.map((ant, idx) => (
                <span key={idx} className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-sm font-medium">
                  {ant}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Idiom/Phrase/Proverb */}
        {(currentWord.idiom || currentWord.phrase || currentWord.proverb) && (
          <div className="bg-blue-50 p-5 rounded-xl border border-blue-200 animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <h3 className="text-lg font-bold text-blue-700 mb-3 flex items-center">
              <Quote className="w-5 h-5 mr-2" /> Expressions
            </h3>
            {currentWord.idiom && (
              <p className="mb-2">
                <span className="font-semibold italic">Idiom:</span> "{currentWord.idiom.text}" - {currentWord.idiom.meaning}
              </p>
            )}
            {currentWord.phrase && (
              <p className="mb-2">
                <span className="font-semibold italic">Phrase:</span> "{currentWord.phrase.text}" - {currentWord.phrase.meaning}
              </p>
            )}
            {currentWord.proverb && (
              <p className="mb-2">
                <span className="font-semibold italic">Proverb:</span> "{currentWord.proverb.text}" - {currentWord.proverb.meaning}
              </p>
            )}
          </div>
        )}

        {/* Related Words */}
        {currentWord.relatedWords && currentWord.relatedWords.length > 0 && (
          <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-200 animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <h3 className="text-lg font-bold text-yellow-700 mb-3 flex items-center">
              <Brain className="w-5 h-5 mr-2" /> Related Words
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentWord.relatedWords.map((rel, idx) => (
                <span key={idx} className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm font-medium">
                  {rel}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tips & Memory Aid */}
        {(currentWord.tips || currentWord.memoryAid) && (
          <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-200 animate-slide-up" style={{ animationDelay: '0.9s' }}>
            <h3 className="text-lg font-bold text-indigo-700 mb-3 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2" /> Learning Aids
            </h3>
            {currentWord.tips && currentWord.tips.length > 0 && (
              <div className="mb-3">
                <p className="font-semibold text-gray-700 mb-1">Tips:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {currentWord.tips.map((tip, idx) => <li key={idx}>{tip}</li>)}
                </ul>
              </div>
            )}
            {currentWord.memoryAid && (
              <div>
                <p className="font-semibold text-gray-700 mb-1">Memory Aid:</p>
                <p className="italic text-gray-600">"{currentWord.memoryAid}"</p>
              </div>
            )}
          </div>
        )}

        {/* Origin & Fun Fact */}
        {(currentWord.origin || currentWord.funFact) && (
          <div className="bg-red-50 p-5 rounded-xl border border-red-200 animate-slide-up" style={{ animationDelay: '1.0s' }}>
            <h3 className="text-lg font-bold text-red-700 mb-3 flex items-center">
              <Star className="w-5 h-5 mr-2" /> Extra Insights
            </h3>
            {currentWord.origin && (
              <p className="mb-2">
                <span className="font-semibold">Origin:</span> {currentWord.origin}
              </p>
            )}
            {currentWord.funFact && (
              <p>
                <span className="font-semibold">Fun Fact:</span> {currentWord.funFact}
              </p>
            )}
          </div>
        )}

        {/* Daily Quote */}
        {currentWord.dailyQuote && (
          <div className="bg-gray-100 p-5 rounded-xl border border-gray-200 animate-slide-up" style={{ animationDelay: '1.1s' }}>
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
              <Quote className="w-5 h-5 mr-2" /> Daily Inspiration
            </h3>
            <p className="italic text-gray-700">"{currentWord.dailyQuote}"</p>
          </div>
        )}
      </div>


      {/* User Interaction & Feedback */}
      <div className="p-8 bg-blue-50 border-t border-blue-200 space-y-6">
        {/* Favorite, Bookmark, Share */}
        <div className="flex justify-center space-x-6 mb-4 animate-pop-in">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
            aria-label={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          >
            {isFavorite ? (
              <Heart className="w-7 h-7 text-red-500 fill-red-500" />
            ) : (
              <HeartOff className="w-7 h-7 text-gray-500 hover:text-red-400" />
            )}
          </button>
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
            aria-label={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
          >
            {isBookmarked ? (
              <Bookmark className="w-7 h-7 text-blue-500 fill-blue-500" />
            ) : (
              <Bookmark className="w-7 h-7 text-gray-500 hover:text-blue-400" />
            )}
          </button>
          <button
            onClick={() => alert("Share functionality coming soon!")}
            className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
            aria-label="Share Word"
          >
            <Share2 className="w-7 h-7 text-gray-500 hover:text-green-500" />
          </button>
        </div>

        {/* Review Options */}
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 animate-slide-up" style={{ animationDelay: '1.2s' }}>
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" /> How familiar are you with this word?
          </h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {reviewOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => handleReviewSelect(opt)}
                className={`
                  px-5 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105
                  ${review === opt
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }
                `}
                disabled={isSpeaking}
              >
                {opt}
              </button>
            ))}
          </div>
          <div className="flex justify-center mt-4 space-x-2">
            <Smile className={`w-8 h-8 ${review === 'Mastered' ? 'text-green-500' : 'text-gray-400'}`} />
            <Meh className={`w-8 h-8 ${review === 'Familiar' ? 'text-yellow-500' : 'text-gray-400'}`} />
            <Frown className={`w-8 h-8 ${review === 'New' ? 'text-red-500' : 'text-gray-400'}`} />
          </div>
        </div>

        {/* Rating and Comment */}
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 animate-slide-up" style={{ animationDelay: '1.3s' }}>
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
            <Star className="w-5 h-5 mr-2" /> Rate & Comment
          </h3>
          <div className="flex items-center mb-4">
            <span className="font-medium text-gray-700 mr-3">Rate this word:</span>
            <CustomRating value={rating} onChange={setRating} disabled={isSpeaking} />
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add your notes or feedback here..."
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out text-gray-700 resize-y"
            disabled={isSpeaking}
          ></textarea>
          <button
            onClick={handleSave}
            className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.01] transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isSpeaking}
          >
            Save Feedback
          </button>
        </div>
      </div>
    </div>
  );
}