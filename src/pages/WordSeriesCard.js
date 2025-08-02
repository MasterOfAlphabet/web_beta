import React, { useState } from "react";
import {
  BookOpen,
  Trophy,
  Star,
  TrendingUp,
  Lightbulb,
  Target,
  Zap,
  Award,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Headphones,
  Mic,
  Heart,
  Users,
  Sparkles,
  FileText,
  Equal,
  X,
  Music,
  Layers,
  ArrowLeft,
  Copy,
  Check,
  Wand2,
  Brain,
  Eye,
  MessageSquare,
  Hash,
  RefreshCw,
  GraduationCap,
  Rocket,
  Crown,
} from "lucide-react";

const classGroups = [
  {
    label: "Class I-II",
    value: "I-II",
    color: "from-pink-400 to-rose-400",
    icon: Heart,
  },
  {
    label: "Class III-V",
    value: "III-V",
    color: "from-blue-400 to-indigo-400",
    icon: Star,
  },
  {
    label: "Class VI-X",
    value: "VI-X",
    color: "from-purple-400 to-violet-400",
    icon: Crown,
  },
];

const wordSeriesData = {
  "I-II": [
    {
      word: "big",
      spelling: "B-I-G",
      meaning: "Large in size or amount",
      emoji: "🏠",
      level: "Beginner",
      phonetic: "bɪɡ",
      pronunciation: "big",
      example: "The elephant is very big and strong.",
      synonyms: ["large", "huge", "giant"],
      homonyms: ["bag", "bug", "beg"],
      antonyms: ["small", "tiny", "little"],
      rhymes: ["pig", "dig", "fig"],
      plural: "bigs",
      category: "Size & Measurement",
    },
    {
      word: "happy",
      spelling: "H-A-P-P-Y",
      meaning: "Feeling joy or pleasure",
      emoji: "😊",
      level: "Beginner",
      phonetic: "ˈhæpi",
      pronunciation: "HAP-ee",
      example: "She is happy to see her best friend.",
      synonyms: ["joyful", "glad", "cheerful"],
      homonyms: ["hippy", "hoppy"],
      antonyms: ["sad", "unhappy", "gloomy"],
      rhymes: ["snappy", "sappy", "nappy"],
      plural: "happies",
      category: "Emotions",
    },
    {
      word: "run",
      spelling: "R-U-N",
      meaning: "To move quickly on foot",
      emoji: "🏃",
      level: "Beginner",
      phonetic: "rʌn",
      pronunciation: "run",
      example: "I run to school every morning with my bag.",
      synonyms: ["jog", "sprint", "dash"],
      homonyms: ["ran", "rune", "sun"],
      antonyms: ["walk", "stop", "rest"],
      rhymes: ["fun", "sun", "done"],
      plural: "runs",
      category: "Action & Movement",
    },
  ],
  "III-V": [
    {
      word: "adventure",
      spelling: "A-D-V-E-N-T-U-R-E",
      meaning: "An exciting or unusual experience",
      emoji: "🗺️",
      level: "Intermediate",
      phonetic: "ədˈventʃər",
      pronunciation: "ad-VEN-chur",
      example: "We went on an amazing adventure in the mysterious forest.",
      synonyms: ["journey", "expedition", "quest"],
      homonyms: ["adventurer", "adventure's"],
      antonyms: ["routine", "boredom", "safety"],
      rhymes: ["venture", "denture", "indenture"],
      plural: "adventures",
      category: "Experience & Travel",
    },
    {
      word: "brilliant",
      spelling: "B-R-I-L-L-I-A-N-T",
      meaning: "Very bright or extremely clever",
      emoji: "✨",
      level: "Intermediate",
      phonetic: "ˈbrɪljənt",
      pronunciation: "BRIL-yunt",
      example: "The brilliant student solved the difficult puzzle in minutes.",
      synonyms: ["bright", "smart", "clever"],
      homonyms: ["brilliance", "brilliantly"],
      antonyms: ["dull", "dim", "stupid"],
      rhymes: ["resilient", "excellent"],
      plural: "brilliants",
      category: "Intelligence & Light",
    },
    {
      word: "curious",
      spelling: "C-U-R-I-O-U-S",
      meaning: "Eager to know or learn something",
      emoji: "🤔",
      level: "Intermediate",
      phonetic: "ˈkjʊriəs",
      pronunciation: "CURE-ee-us",
      example: "The curious cat explored every corner of the garden.",
      synonyms: ["interested", "inquisitive", "wondering"],
      homonyms: ["curiously", "curios"],
      antonyms: ["uninterested", "indifferent", "bored"],
      rhymes: ["furious", "serious", "mysterious"],
      plural: "curious",
      category: "Learning & Discovery",
    },
  ],
  "VI-X": [
    {
      word: "magnificent",
      spelling: "M-A-G-N-I-F-I-C-E-N-T",
      meaning: "Extremely beautiful or impressive",
      emoji: "🏰",
      level: "Advanced",
      phonetic: "mæɡˈnɪfɪsənt",
      pronunciation: "mag-NIF-ih-sunt",
      example: "The magnificent castle stood proudly on the ancient hill.",
      synonyms: ["splendid", "spectacular", "grand"],
      homonyms: ["magnificence", "magnificently"],
      antonyms: ["ordinary", "plain", "modest"],
      rhymes: ["significant", "different", "sufficient"],
      plural: "magnificents",
      category: "Beauty & Grandeur",
    },
    {
      word: "perseverance",
      spelling: "P-E-R-S-E-V-E-R-A-N-C-E",
      meaning: "Persistence in doing something despite difficulty",
      emoji: "💪",
      level: "Advanced",
      phonetic: "ˌpɜːrsəˈvɪrəns",
      pronunciation: "pur-suh-VEER-uns",
      example:
        "Her unwavering perseverance helped her achieve impossible goals.",
      synonyms: ["persistence", "determination", "tenacity"],
      homonyms: ["persevere", "perseverant"],
      antonyms: ["giving up", "quitting", "surrender"],
      rhymes: ["severance", "reverence", "deliverance"],
      plural: "perseverances",
      category: "Character & Virtue",
    },
    {
      word: "extraordinary",
      spelling: "E-X-T-R-A-O-R-D-I-N-A-R-Y",
      meaning: "Very unusual or remarkable",
      emoji: "🌟",
      level: "Advanced",
      phonetic: "ɪkˈstrɔːrdəneri",
      pronunciation: "ik-STROR-dih-nair-ee",
      example: "She possesses extraordinary talent that amazes everyone.",
      synonyms: ["exceptional", "remarkable", "outstanding"],
      homonyms: ["extraordinarily", "extraordinaire"],
      antonyms: ["ordinary", "common", "typical"],
      rhymes: ["visionary", "missionary", "ionary"],
      plural: "extraordinaries",
      category: "Excellence & Uniqueness",
    },
  ],
};

const categoryOrder = [
  {
    key: "word",
    label: "Word",
    icon: Wand2,
    color: "from-indigo-500 to-purple-500",
    symbol: "📝",
  },
  {
    key: "spelling",
    label: "Spelling",
    icon: Hash,
    color: "from-emerald-500 to-teal-500",
    symbol: "🔤",
  },
  {
    key: "phonetic",
    label: "Phonics/Pronunciation",
    icon: Volume2,
    color: "from-orange-500 to-red-500",
    symbol: "🗣️",
  },
  {
    key: "meaning",
    label: "Meaning",
    icon: Brain,
    color: "from-violet-500 to-purple-500",
    symbol: "🧠",
  },
  {
    key: "example",
    label: "Example",
    icon: FileText,
    color: "from-green-500 to-emerald-500",
    symbol: "📖",
  },
  {
    key: "synonyms",
    label: "Synonyms",
    icon: Equal,
    color: "from-blue-500 to-indigo-500",
    symbol: "=",
  },
  {
    key: "homonyms",
    label: "Homonyms",
    icon: Users,
    color: "from-purple-500 to-violet-500",
    symbol: "🔄",
  },
  {
    key: "antonyms",
    label: "Antonyms",
    icon: X,
    color: "from-red-500 to-pink-500",
    symbol: "✕",
  },
  {
    key: "rhymes",
    label: "Rhymes",
    icon: Music,
    color: "from-yellow-500 to-orange-500",
    symbol: "🎵",
  },
  {
    key: "plural",
    label: "Plural",
    icon: Layers,
    color: "from-teal-500 to-cyan-500",
    symbol: "📚",
  },
];

export default function WordSeriesCard() {
  const [group, setGroup] = useState("III-V");
  const [selectedWord, setSelectedWord] = useState(0);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [learningStates, setLearningStates] = useState({});
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [completedCategories, setCompletedCategories] = useState({});
  const [individualPlaying, setIndividualPlaying] = useState(null);

  const speak = (text, rate = 1, pause = 0) => {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = 1.1;
      utterance.volume = 0.9;

      const voices = speechSynthesis.getVoices();
      const femaleVoice = voices.find(
        (voice) =>
          voice.name.includes("Female") ||
          voice.name.includes("Samantha") ||
          voice.name.includes("Karen") ||
          voice.gender === "female"
      );
      if (femaleVoice) utterance.voice = femaleVoice;

      utterance.onend = () => {
        setTimeout(resolve, pause);
      };

      speechSynthesis.speak(utterance);
    });
  };

  const handleLearnWord = async (wordObj) => {
    const wordKey = `${group}-${selectedWord}`;

    if (currentlyPlaying === wordKey) {
      speechSynthesis.cancel();
      setCurrentlyPlaying(null);
      setLearningStates((prev) => ({
        ...prev,
        [wordKey]: { step: 0, isActive: false, currentCategory: null },
      }));
      return;
    }

    setCurrentlyPlaying(wordKey);
    setLearningStates((prev) => ({
      ...prev,
      [wordKey]: { step: 0, isActive: true, currentCategory: null },
    }));

    // Clear previous completed categories for this word
    setCompletedCategories((prev) => ({
      ...prev,
      [wordKey]: {},
    }));

    try {
      // Step 1: Word
      setLearningStates((prev) => ({
        ...prev,
        [wordKey]: { step: 1, isActive: true, currentCategory: "word" },
      }));
      await speak(`Word: ${wordObj.word}`, 1.0, 600);
      setCompletedCategories((prev) => ({
        ...prev,
        [wordKey]: { ...prev[wordKey], word: true },
      }));

      // Step 2: Spelling
      // Step 2: Spelling - with letter highlighting
      setLearningStates((prev) => ({
        ...prev,
        [wordKey]: { step: 2, isActive: true, currentCategory: "spelling" },
      }));

      const letters = wordObj.spelling.split("-");
      await speak(`Spelling:`, 1.0, 300);

      // Highlight each letter individually
      for (let i = 0; i < letters.length; i++) {
        setLearningStates((prev) => ({
          ...prev,
          [wordKey]: {
            step: 2,
            isActive: true,
            currentCategory: "spelling",
            currentLetterIndex: i,
          },
        }));
        await speak(letters[i], 0.8, 400);
      }

      setCompletedCategories((prev) => ({
        ...prev,
        [wordKey]: { ...prev[wordKey], spelling: true },
      }));

      // Step 3: Phonics
      // Step 3: Phonics - read the actual word
      setLearningStates((prev) => ({
        ...prev,
        [wordKey]: { step: 3, isActive: true, currentCategory: "phonetic" },
      }));
      await speak(`Pronunciation:`, 1.0, 300);
      await speak(wordObj.word, 0.9, 600); // Read the actual word, not the phonetic notation
      setCompletedCategories((prev) => ({
        ...prev,
        [wordKey]: { ...prev[wordKey], phonetic: true },
      }));

      // Step 4: Meaning
      setLearningStates((prev) => ({
        ...prev,
        [wordKey]: { step: 4, isActive: true, currentCategory: "meaning" },
      }));
      await speak(`Meaning: ${wordObj.meaning}`, 1.0, 600);
      setCompletedCategories((prev) => ({
        ...prev,
        [wordKey]: { ...prev[wordKey], meaning: true },
      }));

      // Step 5: Example
      setLearningStates((prev) => ({
        ...prev,
        [wordKey]: { step: 5, isActive: true, currentCategory: "example" },
      }));
      await speak(`Example: ${wordObj.example}`, 1.0, 600);
      setCompletedCategories((prev) => ({
        ...prev,
        [wordKey]: { ...prev[wordKey], example: true },
      }));

      // Step 6: Synonyms
      setLearningStates((prev) => ({
        ...prev,
        [wordKey]: { step: 6, isActive: true, currentCategory: "synonyms" },
      }));
      const synonymsText = wordObj.synonyms.join(", ");
      await speak(`Synonyms: ${synonymsText}`, 1.0, 600);
      setCompletedCategories((prev) => ({
        ...prev,
        [wordKey]: { ...prev[wordKey], synonyms: true },
      }));

      // Step 7: Homonyms
      setLearningStates((prev) => ({
        ...prev,
        [wordKey]: { step: 7, isActive: true, currentCategory: "homonyms" },
      }));
      const homonymsText = wordObj.homonyms.join(", ");
      await speak(`Similar sounding words: ${homonymsText}`, 1.0, 600);
      setCompletedCategories((prev) => ({
        ...prev,
        [wordKey]: { ...prev[wordKey], homonyms: true },
      }));

      // Step 8: Antonyms
      setLearningStates((prev) => ({
        ...prev,
        [wordKey]: { step: 8, isActive: true, currentCategory: "antonyms" },
      }));
      const antonymsText = wordObj.antonyms.join(", ");
      await speak(`Antonyms: ${antonymsText}`, 1.0, 600);
      setCompletedCategories((prev) => ({
        ...prev,
        [wordKey]: { ...prev[wordKey], antonyms: true },
      }));

      // Step 9: Rhymes
      setLearningStates((prev) => ({
        ...prev,
        [wordKey]: { step: 9, isActive: true, currentCategory: "rhymes" },
      }));
      const rhymesText = wordObj.rhymes.join(", ");
      await speak(`Rhyming words: ${rhymesText}`, 1.0, 600);
      setCompletedCategories((prev) => ({
        ...prev,
        [wordKey]: { ...prev[wordKey], rhymes: true },
      }));

      // Step 10: Plural
      setLearningStates((prev) => ({
        ...prev,
        [wordKey]: { step: 10, isActive: true, currentCategory: "plural" },
      }));
      await speak(`Plural form: ${wordObj.plural}`, 1.0, 500);
      setCompletedCategories((prev) => ({
        ...prev,
        [wordKey]: { ...prev[wordKey], plural: true },
      }));

      // Reset
      setLearningStates((prev) => ({
        ...prev,
        [wordKey]: { step: 0, isActive: false, currentCategory: null },
      }));
      setCurrentlyPlaying(null);
    } catch (error) {
      setLearningStates((prev) => ({
        ...prev,
        [wordKey]: { step: 0, isActive: false, currentCategory: null },
      }));
      setCurrentlyPlaying(null);
    }
  };

  const handleIndividualCategorySpeak = async (categoryKey, wordObj) => {
    const wordKey = `${group}-${selectedWord}`;
    const speakKey = `${wordKey}-${categoryKey}`;

    if (individualPlaying === speakKey) {
      speechSynthesis.cancel();
      setIndividualPlaying(null);
      return;
    }

    setIndividualPlaying(speakKey);

    try {
      let textToSpeak = "";

      switch (categoryKey) {
        case "word":
          textToSpeak = `Word: ${wordObj.word}`;
          break;
        case "spelling":
          const letters = wordObj.spelling.split("-").join(" ");
          textToSpeak = `Spelling: ${letters}`;
          break;
        case "phonetic":
          textToSpeak = `Pronunciation: ${wordObj.word}`; // Changed from wordObj.pronunciation
          break;
        case "meaning":
          textToSpeak = `Meaning: ${wordObj.meaning}`;
          break;
        case "example":
          textToSpeak = `Example: ${wordObj.example}`;
          break;
        case "synonyms":
          textToSpeak = `Synonyms: ${wordObj.synonyms.join(", ")}`;
          break;
        case "homonyms":
          textToSpeak = `Similar sounding words: ${wordObj.homonyms.join(
            ", "
          )}`;
          break;
        case "antonyms":
          textToSpeak = `Antonyms: ${wordObj.antonyms.join(", ")}`;
          break;
        case "rhymes":
          textToSpeak = `Rhyming words: ${wordObj.rhymes.join(", ")}`;
          break;
        case "plural":
          textToSpeak = `Plural form: ${wordObj.plural}`;
          break;
      }

      await speak(textToSpeak, 1.0);
      setIndividualPlaying(null);
    } catch (error) {
      setIndividualPlaying(null);
    }
  };

  const navigateWord = (direction) => {
    const currentIndex = selectedWord;
    const maxIndex = wordSeriesData[group].length - 1;

    if (direction === "next" && currentIndex < maxIndex) {
      setSelectedWord(currentIndex + 1);
    } else if (direction === "prev" && currentIndex > 0) {
      setSelectedWord(currentIndex - 1);
    }

    // Stop any current audio
    speechSynthesis.cancel();
    setCurrentlyPlaying(null);
    setIndividualPlaying(null);
    setLearningStates({});
    setCompletedCategories({});
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "Beginner":
        return "from-green-400 to-emerald-400";
      case "Intermediate":
        return "from-yellow-400 to-orange-400";
      case "Advanced":
        return "from-red-400 to-pink-400";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  const currentWord = wordSeriesData[group][selectedWord];
  const wordKey = `${group}-${selectedWord}`;
  const isPlaying = currentlyPlaying === wordKey;
  const state = learningStates[wordKey];
  const completed = completedCategories[wordKey] || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-pink-500/10 to-red-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse delay-3000"></div>
      </div>

      <div className="relative z-10 p-6 max-w-6xl mx-auto">
        {/* Hero Header Section */}
        <div className="backdrop-blur-2xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-white/20 rounded-3xl p-8 mb-8 shadow-2xl relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="flex justify-center items-center gap-4 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur opacity-75 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-2xl shadow-xl">
                    <GraduationCap className="w-12 h-12 text-white" />
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl blur opacity-75 animate-pulse delay-300"></div>
                  <div className="relative bg-gradient-to-r from-blue-500 to-indigo-500 p-4 rounded-2xl shadow-xl">
                    <BookOpen className="w-12 h-12 text-white" />
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl blur opacity-75 animate-pulse delay-500"></div>
                  <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-2xl shadow-xl">
                    <Rocket className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>

              <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-4">
                Word Learning Series
              </h1>

              <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                Master vocabulary through interactive learning with
                pronunciation, meanings, examples, and more!
              </p>

              <div className="flex justify-center items-center gap-2 mt-6">
                <Sparkles className="w-6 h-6 text-yellow-400 animate-spin" />
                <span className="text-white/90 font-medium">
                  Comprehensive Learning Experience
                </span>
                <Sparkles className="w-6 h-6 text-yellow-400 animate-spin" />
              </div>
            </div>
          </div>
        </div>

        {/* Class Group Selection */}
        <div className="backdrop-blur-2xl bg-gradient-to-r from-slate-800/20 to-gray-800/20 border border-white/10 rounded-3xl p-6 mb-8 shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              Choose Your Learning Level
            </h2>
            <p className="text-white/60">
              Select the appropriate class group to start your vocabulary
              journey
            </p>
          </div>

          <div className="flex justify-center items-center gap-4 flex-wrap">
            {classGroups.map((cg) => {
              const IconComponent = cg.icon;
              return (
                <button
                  key={cg.value}
                  onClick={() => {
                    setGroup(cg.value);
                    setSelectedWord(0);
                    speechSynthesis.cancel();
                    setCurrentlyPlaying(null);
                    setIndividualPlaying(null);
                    setLearningStates({});
                    setCompletedCategories({});
                  }}
                  className={`relative group px-6 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                    group === cg.value
                      ? `bg-gradient-to-r ${cg.color} text-white shadow-2xl scale-105 ring-4 ring-white/20`
                      : "bg-white/10 text-white/70 hover:text-white hover:bg-white/20 border border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className="w-6 h-6" />
                    <span>{cg.label}</span>
                  </div>

                  {group === cg.value && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-2xl animate-pulse"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Word Navigation */}
        <div className="backdrop-blur-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-white/10 rounded-3xl p-6 mb-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl blur opacity-75 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 p-3 rounded-xl shadow-xl">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">
                  Word Navigation
                </h3>
                <p className="text-white/60 text-sm">
                  Word {selectedWord + 1} of {wordSeriesData[group].length} •{" "}
                  {currentWord.level} Level
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-white/80">
                <span className="text-sm font-medium">
                  Progress: {selectedWord + 1}/{wordSeriesData[group].length}
                </span>
              </div>

              <button
                onClick={() => navigateWord("prev")}
                disabled={selectedWord === 0}
                className="p-3 rounded-xl bg-white/10 border border-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1 px-3">
                {wordSeriesData[group].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedWord(index);
                      speechSynthesis.cancel();
                      setCurrentlyPlaying(null);
                      setIndividualPlaying(null);
                      setLearningStates({});
                      setCompletedCategories({});
                    }}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === selectedWord
                        ? "bg-gradient-to-r from-blue-400 to-purple-400 scale-125 shadow-lg"
                        : "bg-white/20 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => navigateWord("next")}
                disabled={selectedWord === wordSeriesData[group].length - 1}
                className="p-3 rounded-xl bg-white/10 border border-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Word Display */}
        <div className="backdrop-blur-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/10 rounded-3xl p-8 mb-8 shadow-2xl">
          <div className="flex items-center justify-center gap-8 mb-8">
            <div
              className={`text-8xl transition-all duration-700 transform ${
                state?.currentCategory === "word"
                  ? "animate-bounce scale-125"
                  : "hover:scale-110"
              }`}
            >
              {currentWord.emoji}
            </div>

            <div className="text-center">
              <div
                className={`bg-gradient-to-r ${getLevelColor(
                  currentWord.level
                )} text-sm font-bold px-4 py-2 rounded-full text-white mb-4 inline-block shadow-lg transform transition-all duration-300 ${
                  state?.currentCategory === "word"
                    ? "scale-110 animate-pulse"
                    : ""
                }`}
              >
                {currentWord.level} • {currentWord.category}
              </div>

              <h2
                className={`text-6xl font-black text-white mb-4 transition-all duration-700 ${
                  state?.currentCategory === "word"
                    ? "text-yellow-300 animate-pulse scale-110 drop-shadow-2xl"
                    : ""
                }`}
              >
                {currentWord.word}
              </h2>
            </div>
          </div>

          {/* Current Category Display Box */}
          {state?.isActive && state?.currentCategory && (
            <div className="mb-8">
              {(() => {
                const currentCategoryData = categoryOrder.find(
                  (c) => c.key === state.currentCategory
                );
                return (
                  <div
                    className={`backdrop-blur-md bg-gradient-to-r ${currentCategoryData.color}/20 border-2 border-white/30 rounded-2xl p-6 shadow-2xl animate-pulse`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`p-2 bg-gradient-to-r ${currentCategoryData.color} rounded-lg`}
                      >
                        <Volume2 className="w-5 h-5 text-white animate-bounce" />
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        {currentCategoryData.label}
                      </h3>
                    </div>

                    <div className="text-lg text-white/90 font-medium">
                      {state.currentCategory === "word" && currentWord.word}
                      {state.currentCategory === "spelling" && (
                        <div className="flex justify-center gap-2">
                          {currentWord.spelling
                            .split("-")
                            .map((letter, idx) => (
                              <span
                                key={idx}
                                className={`px-3 py-2 rounded-lg font-bold transition-all duration-300 ${
                                  state.currentLetterIndex === idx
                                    ? "bg-yellow-400 text-black scale-125 animate-bounce shadow-lg"
                                    : "bg-white/20 text-white"
                                }`}
                              >
                                {letter}
                              </span>
                            ))}
                        </div>
                      )}
                      {state.currentCategory === "phonetic" &&
                        `/${currentWord.phonetic}/ (${currentWord.pronunciation})`}
                      {state.currentCategory === "meaning" &&
                        currentWord.meaning}
                      {state.currentCategory === "example" &&
                        currentWord.example}
                      {state.currentCategory === "synonyms" &&
                        currentWord.synonyms.join(", ")}
                      {state.currentCategory === "homonyms" &&
                        currentWord.homonyms.join(", ")}
                      {state.currentCategory === "antonyms" &&
                        currentWord.antonyms.join(", ")}
                      {state.currentCategory === "rhymes" &&
                        currentWord.rhymes.join(", ")}
                      {state.currentCategory === "plural" && currentWord.plural}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
          {/* Audio Control */}
          <div className="text-center">
            <button
              onClick={() => handleLearnWord(currentWord)}
              disabled={
                currentlyPlaying !== null && currentlyPlaying !== wordKey
              }
              className={`relative overflow-hidden font-bold py-4 px-8 rounded-2xl transition-all duration-500 transform hover:scale-105 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed text-xl ${
                isPlaying
                  ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 animate-pulse"
                  : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              } text-white`}
            >
              <div className="flex items-center justify-center gap-3">
                {isPlaying ? (
                  <>
                    <Volume2 className="w-6 h-6 animate-pulse" />
                    <span>
                      {state?.step === 1 && "Speaking Word..."}
                      {state?.step === 2 && "Spelling Letters..."}
                      {state?.step === 3 && "Pronunciation..."}
                      {state?.step === 4 && "Explaining Meaning..."}
                      {state?.step === 5 && "Reading Example..."}
                      {state?.step === 6 && "Teaching Synonyms..."}
                      {state?.step === 7 && "Learning Homonyms..."}
                      {state?.step === 8 && "Exploring Antonyms..."}
                      {state?.step === 9 && "Finding Rhymes..."}
                      {state?.step === 10 && "Plural Form..."}
                      {!state?.step && "Stop Learning"}
                    </span>
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6" />
                    <span>Start Learning Journey</span>
                  </>
                )}
              </div>

              {/* Animated background effect */}
              {isPlaying && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              )}
            </button>

            {/* Progress indicator */}
            {state?.isActive && (
              <div className="mt-6">
                <div className="flex justify-center items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-yellow-400 animate-spin" />
                  <span className="text-white/80 font-medium">
                    Step {state.step} of 10
                  </span>
                  <Sparkles className="w-5 h-5 text-yellow-400 animate-spin" />
                </div>
                <div className="w-full max-w-md mx-auto bg-white/10 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-1000 ease-out"
                    style={{ width: `${(state.step / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Completed Categories Display */}
        {/* Completed Categories Display */}
        {Object.keys(completed).length > 0 && (
          <div className="space-y-4 mb-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                Learned Categories
              </h3>
              <p className="text-white/60">
                Click the speaker icon to hear any category again
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categoryOrder.map((category) => {
                if (!completed[category.key]) return null;

                const Icon = category.icon;
                const isCurrentlyPlaying =
                  individualPlaying === `${wordKey}-${category.key}`;

                let content = "";
                let displayContent = [];

                switch (category.key) {
                  case "word":
                    content = currentWord.word;
                    displayContent = [currentWord.word];
                    break;
                  case "spelling":
                    content = currentWord.spelling;
                    displayContent = currentWord.spelling
                      .split("-")
                      .map((letter, idx) => (
                        <span
                          key={idx}
                          className="inline-block px-2 py-1 mx-1 bg-white/20 text-white rounded-lg"
                        >
                          {letter}
                        </span>
                      ));
                    break;
                  case "phonetic":
                    content = `/${currentWord.phonetic}/ (${currentWord.pronunciation})`;
                    displayContent = [content];
                    break;
                  case "meaning":
                    content = currentWord.meaning;
                    displayContent = [content];
                    break;
                  case "example":
                    content = currentWord.example;
                    displayContent = [content];
                    break;
                  case "synonyms":
                    content = currentWord.synonyms.join(", ");
                    displayContent = [content];
                    break;
                  case "homonyms":
                    content = currentWord.homonyms.join(", ");
                    displayContent = [content];
                    break;
                  case "antonyms":
                    content = currentWord.antonyms.join(", ");
                    displayContent = [content];
                    break;
                  case "rhymes":
                    content = currentWord.rhymes.join(", ");
                    displayContent = [content];
                    break;
                  case "plural":
                    content = currentWord.plural;
                    displayContent = [content];
                    break;
                }

                return (
                  <div
                    key={category.key}
                    className={`relative backdrop-blur-md border rounded-2xl p-6 transition-all duration-700 transform hover:scale-[1.02] cursor-pointer ${
                      isCurrentlyPlaying
                        ? `bg-gradient-to-br ${category.color}/30 border-white/60 shadow-2xl scale-105 animate-pulse`
                        : `bg-gradient-to-br ${category.color}/10 border-white/20 hover:bg-gradient-to-br hover:${category.color}/20 hover:border-white/30`
                    }`}
                    onClick={() =>
                      handleIndividualCategorySpeak(category.key, currentWord)
                    }
                  >
                    {/* Glowing effect when playing */}
                    {isCurrentlyPlaying && (
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${category.color}/20 rounded-2xl blur-xl animate-pulse`}
                      ></div>
                    )}

                    <div className="relative z-10">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`relative p-3 rounded-xl bg-gradient-to-br ${
                              category.color
                            } shadow-lg ${
                              isCurrentlyPlaying
                                ? "animate-bounce scale-110"
                                : ""
                            }`}
                          >
                            <Icon className="w-6 h-6 text-white" />
                            {isCurrentlyPlaying && (
                              <div className="absolute inset-0 bg-white/30 rounded-xl animate-ping"></div>
                            )}
                          </div>
                          <div>
                            <h4
                              className={`font-bold text-lg transition-all duration-300 ${
                                isCurrentlyPlaying
                                  ? "text-white scale-110"
                                  : "text-white/90"
                              }`}
                            >
                              {category.symbol} {category.label}
                            </h4>
                            {category.key === "word" && (
                              <div
                                className={`text-sm transition-all duration-300 ${
                                  isCurrentlyPlaying
                                    ? "text-white/90"
                                    : "text-white/60"
                                }`}
                              >
                                {currentWord.category}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Speaker button */}
                        <button
                          className={`p-3 rounded-lg transition-all duration-300 ${
                            isCurrentlyPlaying
                              ? "bg-red-500/20 text-red-300 animate-pulse"
                              : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
                          }`}
                        >
                          {isCurrentlyPlaying ? (
                            <Volume2 className="w-5 h-5 animate-pulse" />
                          ) : (
                            <Volume2 className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      {/* Content */}
                      <div
                        className={`transition-all duration-500 ${
                          isCurrentlyPlaying ? "transform scale-105" : ""
                        }`}
                      >
                        {category.key === "spelling" ? (
                          <div className="flex flex-wrap justify-center gap-1">
                            {displayContent}
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {displayContent.map((item, idx) => (
                              <div
                                key={idx}
                                className={`p-4 rounded-xl transition-all duration-500 ${
                                  isCurrentlyPlaying
                                    ? "bg-white/20 text-white font-semibold shadow-lg animate-pulse border border-white/30"
                                    : "bg-white/5 text-white/90 hover:bg-white/10 border border-white/5"
                                }`}
                              >
                                {typeof item === "string" ? item : item}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="backdrop-blur-2xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-white/10 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-purple-400 rounded-xl blur opacity-75 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-violet-500 to-purple-500 p-3 rounded-xl shadow-xl">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">Quick Practice</h3>
                <p className="text-white/60 text-sm">
                  Practice specific aspects of this word
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Repeat Word */}
              <button
                onClick={() => speak(currentWord.word, 1.0)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Repeat Word</span>
              </button>

              {/* Spell Out */}
              <button
                onClick={() =>
                  speak(currentWord.spelling.split("-").join(" "), 0.8)
                }
                className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                <Hash className="w-4 h-4" />
                <span className="hidden sm:inline">Spell Out</span>
              </button>

              {/* Example Sentence */}
              <button
                onClick={() => speak(currentWord.example, 1.0)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Example</span>
              </button>

              {/* Pronunciation */}
              <button
                onClick={() => speak(currentWord.pronunciation, 1.0)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                <Volume2 className="w-4 h-4" />
                <span className="hidden sm:inline">Pronunciation</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
