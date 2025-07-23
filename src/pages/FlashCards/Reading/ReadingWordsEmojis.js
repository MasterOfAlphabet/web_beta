import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';

const FlashcardReader = () => {
  const [currentGroup, setCurrentGroup] = useState(0);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [readingSpeed, setReadingSpeed] = useState(1);
  const [showCompanion, setShowCompanion] = useState(-1);
  
  const readingTimeoutRef = useRef(null);
  const utteranceRef = useRef(null);

  // Flashcard data for different class groups
  const flashcardGroups = [
    {
      title: "Class I-II",
      category: "Basic Learning",
      gradient: "from-pink-400 via-purple-400 to-indigo-500",
      accentColor: "pink",
      cards: [
        {
          category: "Animals",
          front: ["🐱", "🐶", "🐸", "🦆"],
          back: ["cat", "dog", "frog", "duck"]
        },
        {
          category: "Fruits",
          front: ["🍎", "🍌", "🍊", "🍇"],
          back: ["apple", "banana", "orange", "grapes"]
        },
        {
          category: "Colors",
          front: ["🔴", "🟡", "🔵", "🟢"],
          back: ["red", "yellow", "blue", "green"]
        }
      ]
    },
    {
      title: "Class III-V",
      category: "Elementary",
      gradient: "from-emerald-400 via-teal-400 to-cyan-500",
      accentColor: "emerald",
      cards: [
        {
          category: "Vehicles",
          front: ["🚗", "✈️", "🚂", "🚢"],
          back: ["car", "airplane", "train", "ship"]
        },
        {
          category: "Body Parts",
          front: ["👁️", "👂", "👃", "👄"],
          back: ["eye", "ear", "nose", "mouth"]
        },
        {
          category: "Objects",
          front: ["📚", "✏️", "⚽", "🎈"],
          back: ["book", "pencil", "ball", "balloon"]
        }
      ]
    },
    {
      title: "Class VI-X",
      category: "Advanced",
      gradient: "from-orange-400 via-red-400 to-pink-500",
      accentColor: "orange",
      cards: [
        {
          category: "Science",
          front: ["🔬", "🧪", "⚛️", "🌡️"],
          back: ["microscope", "flask", "atom", "thermometer"]
        },
        {
          category: "Geography",
          front: ["🏔️", "🏖️", "🌋", "🏜️"],
          back: ["mountain", "beach", "volcano", "desert"]
        },
        {
          category: "Technology",
          front: ["💻", "📱", "🖥️", "⌨️"],
          back: ["laptop", "phone", "monitor", "keyboard"]
        }
      ]
    }
  ];

  const currentGroupData = flashcardGroups[currentGroup];
  const currentCardData = currentGroupData.cards[currentCard];

  // Speech synthesis function
  const speak = (text, index = -1) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      if (index >= 0) {
        setHighlightedIndex(index);
        setShowCompanion(index);
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = readingSpeed;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      
      utterance.onend = () => {
        setHighlightedIndex(-1);
        setTimeout(() => setShowCompanion(-1), 500);
        if (index >= 0) {
          // Individual word clicked
          return;
        }
      };
      
      utteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
    }
  };

  // Auto-read function
  const startAutoReading = () => {
    if (isReading) {
      stopReading();
      return;
    }

    setIsReading(true);
    const items = isFlipped ? currentCardData.back : currentCardData.front;
    let currentIndex = 0;

    const readNext = () => {
      if (currentIndex < items.length) {
        setHighlightedIndex(currentIndex);
        speak(items[currentIndex]);
        
        readingTimeoutRef.current = setTimeout(() => {
          currentIndex++;
          readNext();
        }, 2000 / readingSpeed);
      } else {
        setIsReading(false);
        setHighlightedIndex(-1);
      }
    };

    readNext();
  };

  const stopReading = () => {
    setIsReading(false);
    setHighlightedIndex(-1);
    setShowCompanion(-1);
    if (readingTimeoutRef.current) {
      clearTimeout(readingTimeoutRef.current);
    }
    speechSynthesis.cancel();
  };

  const handleItemClick = (item, index) => {
    stopReading();
    speak(item, index);
    setTimeout(() => {
      setHighlightedIndex(-1);
      setShowCompanion(-1);
    }, 2000);
  };

  const flipCard = () => {
    stopReading();
    setIsFlipped(!isFlipped);
  };

  const nextCard = () => {
    stopReading();
    setCurrentCard((prev) => (prev + 1) % currentGroupData.cards.length);
    setIsFlipped(false);
  };

  const prevCard = () => {
    stopReading();
    setCurrentCard((prev) => (prev - 1 + currentGroupData.cards.length) % currentGroupData.cards.length);
    setIsFlipped(false);
  };

  const changeGroup = (groupIndex) => {
    stopReading();
    setCurrentGroup(groupIndex);
    setCurrentCard(0);
    setIsFlipped(false);
  };

  useEffect(() => {
    return () => {
      stopReading();
    };
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentGroupData.gradient} p-4 sm:p-6 lg:p-8`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            📚 Interactive Flashcards
          </h1>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {flashcardGroups.map((group, index) => (
              <button
                key={index}
                onClick={() => changeGroup(index)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  currentGroup === index
                    ? 'bg-white text-gray-800 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {group.title}
              </button>
            ))}
          </div>
        </div>

        {/* Main Flashcard Container */}
        <div className="relative mx-auto max-w-lg">
          {/* Card Navigation */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={prevCard}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-all duration-300 transform hover:scale-110"
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className="text-white font-medium">
              Card {currentCard + 1} of {currentGroupData.cards.length}
            </div>
            
            <button
              onClick={nextCard}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-all duration-300 transform hover:scale-110"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Flashcard */}
          <div className="relative perspective-1000 mb-8">
            <div 
              className={`relative w-full h-96 transition-transform duration-700 transform-style-3d cursor-pointer ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
              onClick={flipCard}
            >
              {/* Front Side */}
              <div className={`absolute inset-0 w-full h-full backface-hidden ${
                isFlipped ? 'rotate-y-180' : ''
              }`}>
                <div className="w-full h-full bg-gradient-to-br from-white via-gray-50 to-white rounded-3xl shadow-2xl border-4 border-white/50 flex flex-col relative overflow-hidden">
                  {/* Beautiful Header with Glass Effect */}
                  <div className="relative bg-gradient-to-r from-white/80 via-white/60 to-white/80 backdrop-blur-sm border-b border-gray-100 p-4 rounded-t-3xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                    <div className="relative text-center">
                      <div className={`text-xs font-bold text-${currentGroupData.accentColor}-500 mb-1 tracking-wider uppercase`}>
                        {currentGroupData.title} • {currentGroupData.category}
                      </div>
                      <div className={`text-lg font-black text-${currentGroupData.accentColor}-700 tracking-wide`}>
                        {currentCardData.category}
                      </div>
                    </div>
                  </div>
                  
                  {/* Content Area - Evenly Distributed */}
                  <div className="flex-1 grid grid-cols-2 gap-8 p-8 place-items-center">
                    {currentCardData.front.map((item, index) => (
                      <div key={index} className="flex flex-col items-center gap-3 relative">
                        <div
                          className={`text-6xl sm:text-7xl transition-all duration-500 transform cursor-pointer hover:scale-125 relative ${
                            highlightedIndex === index
                              ? `scale-150 animate-pulse filter drop-shadow-2xl`
                              : 'hover:rotate-12 filter drop-shadow-lg'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleItemClick(item, index);
                          }}
                        >
                          {item}
                          {/* Glow Effect */}
                          {highlightedIndex === index && (
                            <div className={`absolute inset-0 bg-${currentGroupData.accentColor}-400 rounded-full blur-xl opacity-30 -z-10 animate-ping`}></div>
                          )}
                        </div>
                        
                        {/* Show companion text when reading */}
                        {showCompanion === index && (
                          <div className={`absolute -bottom-8 px-4 py-2 bg-${currentGroupData.accentColor}-500 text-white rounded-full font-bold text-sm shadow-lg animate-bounce transform scale-110`}>
                            {currentCardData.back[index]}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-${currentGroupData.accentColor}-200/30 to-transparent rounded-bl-full`}></div>
                  <div className={`absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-${currentGroupData.accentColor}-200/30 to-transparent rounded-tr-full`}></div>
                </div>
              </div>

              {/* Back Side */}
              <div className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 ${
                isFlipped ? '' : 'rotate-y-180'
              }`}>
                <div className="w-full h-full bg-white rounded-3xl shadow-2xl border-4 border-white/50 flex flex-col p-6">
                  {/* Header */}
                  <div className="text-center mb-4">
                    <div className="text-xs text-gray-400 font-medium mb-1">{currentGroupData.title}</div>
                    <div className="text-sm font-bold text-gray-600">{currentCardData.category}</div>
                  </div>
                  
                  {/* Content Area */}
                  <div className="flex-1 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-6 w-full">
                      {currentCardData.back.map((word, index) => (
                        <div key={index} className="flex flex-col items-center gap-2">
                          <div
                            className={`text-xl sm:text-2xl font-bold text-gray-800 transition-all duration-300 transform cursor-pointer hover:scale-105 px-4 py-2 rounded-xl text-center ${
                              highlightedIndex === index
                                ? `scale-110 bg-${currentGroupData.accentColor}-100 text-${currentGroupData.accentColor}-600 shadow-lg animate-pulse`
                                : 'hover:bg-gray-100'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleItemClick(word, index);
                            }}
                          >
                            {word}
                          </div>
                          {/* Show companion emoji when reading */}
                          {showCompanion === index && (
                            <div className="text-4xl animate-bounce">
                              {currentCardData.front[index]}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Read Me Button */}
              <button
                onClick={startAutoReading}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  isReading
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : `bg-${currentGroupData.accentColor}-500 hover:bg-${currentGroupData.accentColor}-600 text-white`
                }`}
              >
                {isReading ? <Pause size={24} /> : <Play size={24} />}
                {isReading ? 'Stop Reading' : 'Read Me'}
                <Volume2 size={20} className={isReading ? 'animate-bounce' : ''} />
              </button>

              {/* Speed Control */}
              <div className="flex items-center gap-3">
                <span className="text-gray-700 font-medium">Speed:</span>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={readingSpeed}
                  onChange={(e) => setReadingSpeed(parseFloat(e.target.value))}
                  className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-gray-700 font-medium">{readingSpeed}x</span>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  stopReading();
                  setIsFlipped(false);
                }}
                className="p-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <RotateCcw size={20} />
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 text-center">
            <p className="text-white/80 text-sm">
              💡 Click the card to flip • Click any emoji/word to hear it • Use "Read Me" for auto-play
            </p>
          </div>
        </div>
      </div>

      {/* Custom Styles for 3D flip effect */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default FlashcardReader;