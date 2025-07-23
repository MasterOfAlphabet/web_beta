import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Play, Pause, RotateCcw, ChevronRight, Volume2, ArrowLeft, ArrowRight, Home, Award, Clock, Star } from 'lucide-react';

const CLASS_GROUPS = [
  { label: "Grades 1-2", value: "I-II", color: "bg-gradient-to-r from-pink-400 to-purple-500" },
  { label: "Grades 3-5", value: "III-V", color: "bg-gradient-to-r from-blue-400 to-cyan-500" },
  { label: "Grades 6-10", value: "VI-X", color: "bg-gradient-to-r from-green-400 to-teal-500" },
];

// Enhanced passage data with more educational metadata
const PASSAGE_DATA = {
  "I-II": [
    {
      id: 1,
      title: "The Friendly Cat",
      content: "The cat sat on the mat. It was a fluffy orange cat with green eyes. The cat enjoyed sleeping in sunny spots and purring loudly when petted gently.",
      difficulty: "Beginner",
      duration: 2,
      vocabulary: 12,
      icon: "🐱",
      theme: "from-pink-400 to-rose-500",
      questions: [
        { question: "Where did the cat like to sit?", options: ["On the mat", "On the chair", "Under the table"], answer: "On the mat" },
        { question: "How did the cat show happiness?", options: ["Purring", "Barking", "Chirping"], answer: "Purring" }
      ],
      objectives: ["Identify main character", "Recognize descriptive words"]
    },
    {
      id: 2,
      title: "Sunny Day Fun",
      content: "The bright sun made the playground warm. Children laughed as they swung high on the swings. Nearby, a small brown dog chased butterflies through the green grass.",
      difficulty: "Beginner",
      duration: 2,
      vocabulary: 15,
      icon: "☀️",
      theme: "from-amber-400 to-orange-500",
      questions: [
        { question: "What was the weather like?", options: ["Sunny", "Rainy", "Snowy"], answer: "Sunny" },
        { question: "What was the dog chasing?", options: ["Butterflies", "A ball", "Its tail"], answer: "Butterflies" }
      ],
      objectives: ["Understand setting", "Follow simple sequence"]
    }
  ],
  "III-V": [
    {
      id: 3,
      title: "Jungle Explorers",
      content: "The dense Amazon jungle teemed with life. Howler monkeys shouted from the canopy while brilliant macaws flew between trees. A hidden jaguar watched silently as a river wound through the emerald greenery.",
      difficulty: "Intermediate",
      duration: 3,
      vocabulary: 18,
      icon: "🌿",
      theme: "from-emerald-500 to-teal-600",
      questions: [
        { question: "Where were the howler monkeys?", options: ["In the canopy", "On the ground", "In the river"], answer: "In the canopy" },
        { question: "Which animal was hiding?", options: ["Jaguar", "Monkey", "Macaw"], answer: "Jaguar" }
      ],
      objectives: ["Identify habitat details", "Recognize descriptive language"]
    }
  ],
  "VI-X": [
    {
      id: 4,
      title: "Solar System Wonders",
      content: "Our solar system's eight planets follow elliptical orbits around the Sun. Mercury, the smallest, completes its orbit in just 88 Earth days, while distant Neptune takes 165 Earth years. Earth remains uniquely suited for life due to its perfect distance from the Sun and protective atmosphere.",
      difficulty: "Advanced",
      duration: 4,
      vocabulary: 22,
      icon: "🪐",
      theme: "from-indigo-500 to-blue-600",
      questions: [
        { question: "How many planets orbit our Sun?", options: ["8", "9", "10"], answer: "8" },
        { question: "What makes Earth unique?", options: ["Supports life", "Closest to Sun", "Largest planet"], answer: "Supports life" }
      ],
      objectives: ["Understand planetary characteristics", "Compare celestial bodies"]
    }
  ]
};

const ReadingSession = ({ passage, onExit }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSegment, setCurrentSegment] = useState(0);
  const [showObjectives, setShowObjectives] = useState(true);
  const synthRef = useRef(null);

  // Enhanced segmentation that keeps phrases together
  const segments = passage.content.split(/(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?|\!)\s+/g);
  
  const speak = (text) => {
    if (synthRef.current) window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92; // Optimal reading speed
    utterance.onboundary = (e) => {
      if (e.name === 'word') {
        // Visual feedback could be added here
      }
    };
    utterance.onend = () => setIsPlaying(false);
    synthRef.current = utterance;
    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const navigateSegment = (direction) => {
    stop();
    if (direction === 'next' && currentSegment < segments.length - 1) {
      setCurrentSegment(currentSegment + 1);
    } else if (direction === 'prev' && currentSegment > 0) {
      setCurrentSegment(currentSegment - 1);
    }
  };

  useEffect(() => {
    return () => stop();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Session Header */}
      <header className="sticky top-0 z-20 bg-white shadow-sm py-3 px-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button 
            onClick={onExit}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <Home size={20} />
            <span className="font-medium hidden sm:inline">Passage Library</span>
          </button>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
              <Clock size={16} />
              <span>{passage.duration} min read</span>
            </div>
            <div className="flex items-center gap-1">
              {segments.map((_, i) => (
                <div 
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentSegment ? 'w-4 bg-blue-500' : 'w-2 bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 py-6 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg">
          {/* Passage Header */}
          <div className={`bg-gradient-to-r ${passage.theme} p-6 text-white`}>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{passage.icon}</span>
                <div>
                  <h1 className="text-2xl font-bold">{passage.title}</h1>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm bg-white/20 px-2 py-0.5 rounded-full">
                      {passage.difficulty}
                    </span>
                    <span className="text-sm flex items-center gap-1">
                      <Star size={14} className="fill-white/80" />
                      {passage.vocabulary} key words
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowObjectives(!showObjectives)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <Award size={20} />
              </button>
            </div>
            
            {showObjectives && (
              <div className="mt-4 pt-3 border-t border-white/20">
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-1">Learning Objectives</h3>
                <ul className="text-sm space-y-1">
                  {passage.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-2">•</span> {obj}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* Current Segment */}
          <div className="p-6 sm:p-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-800 leading-relaxed text-lg">
                {segments[currentSegment]}
              </p>
            </div>
            
            {/* Interactive Words */}
            <div className="mt-6 flex flex-wrap gap-2">
              {segments[currentSegment].match(/\b(\w[\w'-]*)\b/g)?.map((word, i) => (
                <button
                  key={i}
                  onClick={() => speak(word)}
                  className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium flex items-center"
                >
                  {word}
                  <Volume2 size={14} className="ml-1 opacity-70" />
                </button>
              ))}
            </div>
          </div>
          
          {/* Controls */}
          <div className="border-t border-gray-100 p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigateSegment('prev')}
                disabled={currentSegment === 0}
                className="px-4 py-2 rounded-lg bg-white shadow-sm hover:bg-gray-50 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                <ArrowLeft size={18} className="text-gray-700" />
                <span className="hidden sm:inline">Previous</span>
              </button>
              
              <button
                onClick={isPlaying ? stop : () => speak(segments[currentSegment])}
                className={`px-5 py-2.5 rounded-lg shadow-sm flex items-center gap-2 ${
                  isPlaying 
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                } transition-colors`}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                <span>{isPlaying ? 'Pause' : 'Read Segment'}</span>
              </button>
              
              <button
                onClick={() => navigateSegment('next')}
                disabled={currentSegment === segments.length - 1}
                className="px-4 py-2 rounded-lg bg-white shadow-sm hover:bg-gray-50 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                <span className="hidden sm:inline">Next</span>
                <ArrowRight size={18} className="text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const PassageLibrary = ({ onSelectPassage }) => {
  const [activeGroup, setActiveGroup] = useState("I-II");
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Reading Comprehension Hub</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select leveled passages with audio support and built-in comprehension checks
          </p>
        </div>
        
        {/* Grade Level Selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 px-4">
          {Object.entries(CLASS_GROUPS).map(([value, group]) => (
            <button
              key={value}
              onClick={() => setActiveGroup(value)}
              className={`px-5 py-2.5 rounded-full font-medium transition-all ${
                activeGroup === value
                  ? `${group.color} text-white shadow-md`
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
              }`}
            >
              {group.label}
            </button>
          ))}
        </div>
        
        {/* Passages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PASSAGE_DATA[activeGroup].map(passage => (
            <div 
              key={passage.id}
              onClick={() => onSelectPassage(passage)}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer group border border-gray-100 hover:border-blue-100"
            >
              <div className={`h-2 bg-gradient-to-r ${passage.theme}`}></div>
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${passage.theme} text-white text-2xl`}>
                    {passage.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                      {passage.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        passage.difficulty === "Beginner" ? "bg-green-100 text-green-800" :
                        passage.difficulty === "Intermediate" ? "bg-amber-100 text-amber-800" :
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {passage.difficulty}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={12} /> {passage.duration} min
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <BookOpen size={12} /> {passage.vocabulary} words
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 mb-6 line-clamp-3 text-sm">{passage.content}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {passage.questions.length} comprehension questions
                  </span>
                  <button className="text-sm font-medium text-blue-600 group-hover:text-blue-700 flex items-center gap-1 transition-colors">
                    Begin <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function ReadingComprehensionApp() {
  const [currentPassage, setCurrentPassage] = useState(null);
  
  return (
    <>
      {currentPassage ? (
        <ReadingSession 
          passage={currentPassage} 
          onExit={() => setCurrentPassage(null)} 
        />
      ) : (
        <PassageLibrary onSelectPassage={setCurrentPassage} />
      )}
    </>
  );
}