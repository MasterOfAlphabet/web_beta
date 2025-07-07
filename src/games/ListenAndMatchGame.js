import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Volume2,
  Star,
  Trophy,
  RotateCcw,
  Award,
} from "lucide-react";

const ListenMatchGame = () => {
  const [selectedCategory, setSelectedCategory] = useState("emotions");
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds] = useState(5);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [gameState, setGameState] = useState("playing"); // 'playing', 'correct', 'incorrect', 'completed'
  const [selectedImage, setSelectedImage] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [streak, setStreak] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const audioRef = useRef(null);

  const categories = [
    {
      id: "emotions",
      name: "Emotions",
      icon: "😊",
      color: "bg-pink-100 border-pink-300",
    },
    {
      id: "sounds",
      name: "Sounds",
      icon: "🔊",
      color: "bg-blue-100 border-blue-300",
    },
    {
      id: "actions",
      name: "Actions",
      icon: "🏃",
      color: "bg-green-100 border-green-300",
    },
    {
      id: "professions",
      name: "Professions",
      icon: "👩‍⚕️",
      color: "bg-purple-100 border-purple-300",
    },
    {
      id: "fruits",
      name: "Fruits",
      icon: "🍎",
      color: "bg-red-100 border-red-300",
    },
    {
      id: "colors",
      name: "Colors",
      icon: "🎨",
      color: "bg-yellow-100 border-yellow-300",
    },
    {
      id: "animals",
      name: "Animals",
      icon: "🦁",
      color: "bg-orange-100 border-orange-300",
    },
    {
      id: "vegetables",
      name: "Vegetables",
      icon: "🥕",
      color: "bg-green-100 border-green-400",
    },
    {
      id: "flowers",
      name: "Flowers",
      icon: "🌸",
      color: "bg-pink-100 border-pink-400",
    },
    {
      id: "tech",
      name: "Tech & Gadgets",
      icon: "📱",
      color: "bg-indigo-100 border-indigo-300",
    },
  ];

  const gameData = {
    emotions: [
      { id: 1, name: "Happy", emoji: "😊", audioText: "Happy" },
      { id: 2, name: "Sad", emoji: "😢", audioText: "Sad" },
      { id: 3, name: "Angry", emoji: "😠", audioText: "Angry" },
      { id: 4, name: "Excited", emoji: "🤩", audioText: "Excited" },
      { id: 5, name: "Sleepy", emoji: "😴", audioText: "Sleepy" },
      { id: 6, name: "Surprised", emoji: "😲", audioText: "Surprised" },
    ],
    sounds: [
      { id: 1, name: "Bell", emoji: "🔔", audioText: "Bell" },
      { id: 2, name: "Horn", emoji: "📯", audioText: "Horn" },
      { id: 3, name: "Whistle", emoji: "🎵", audioText: "Whistle" },
      { id: 4, name: "Clap", emoji: "👏", audioText: "Clap" },
    ],
    actions: [
      { id: 1, name: "Running", emoji: "🏃", audioText: "Running" },
      { id: 2, name: "Jumping", emoji: "🤸", audioText: "Jumping" },
      { id: 3, name: "Swimming", emoji: "🏊", audioText: "Swimming" },
      { id: 4, name: "Dancing", emoji: "💃", audioText: "Dancing" },
    ],
    animals: [
      { id: 1, name: "Dog", emoji: "🐶", audioText: "Dog" },
      { id: 2, name: "Cat", emoji: "🐱", audioText: "Cat" },
      { id: 3, name: "Bird", emoji: "🐦", audioText: "Bird" },
      { id: 4, name: "Fish", emoji: "🐠", audioText: "Fish" },
    ],
  };

  const getCurrentItems = () => gameData[selectedCategory] || [];
  const currentItems = getCurrentItems();
  const currentAudio = currentItems[currentAudioIndex];

  // Game logic functions
  const playAudio = () => {
    if (currentAudio) {
      // In a real app, this would play actual audio files
      // For now, we'll use speech synthesis as a demo
      const utterance = new SpeechSynthesisUtterance(currentAudio.audioText);
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      speechSynthesis.speak(utterance);
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 1500);
    }
  };

  const handleImageClick = (clickedImage) => {
    if (gameState !== "playing") return;

    setSelectedImage(clickedImage.id);

    if (clickedImage.id === currentAudio.id) {
      // Correct answer
      setScore((prev) => prev + 10 + streak * 2);
      setStreak((prev) => prev + 1);
      setGameState("correct");
      setFeedback("🎉 Correct! Great job!");
      setShowCelebration(true);

      setTimeout(() => {
        setShowCelebration(false);
        if (currentRound < totalRounds) {
          nextRound();
        } else {
          setGameState("completed");
        }
      }, 2000);
    } else {
      // Wrong answer
      setStreak(0);
      setGameState("incorrect");
      setFeedback("😅 Try again! Listen carefully.");

      setTimeout(() => {
        setGameState("playing");
        setSelectedImage(null);
        setFeedback("");
      }, 1500);
    }
  };

  const nextRound = () => {
    setCurrentRound((prev) => prev + 1);
    setCurrentAudioIndex(Math.floor(Math.random() * currentItems.length));
    setSelectedImage(null);
    setGameState("playing");
    setFeedback("");
  };

  const resetGame = () => {
    setScore(0);
    setCurrentRound(1);
    setStreak(0);
    setCurrentAudioIndex(Math.floor(Math.random() * currentItems.length));
    setSelectedImage(null);
    setGameState("playing");
    setFeedback("");
    setShowCelebration(false);
  };

  // Initialize game when category changes
  useEffect(() => {
    const items = getCurrentItems();
    if (items.length > 0) {
      setCurrentAudioIndex(Math.floor(Math.random() * items.length));
      resetGame();
    }
  }, [selectedCategory]);

  const handlePlayAudio = () => {
    playAudio();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Celebration confetti */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 animate-pulse">
            🎵 Listen & Match Game 🎵
          </h1>
          <div className="flex justify-center items-center gap-6 text-white flex-wrap">
            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <span className="font-bold text-xl">{score}</span>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
              <Star className="w-6 h-6 text-orange-400" />
              <span className="font-bold">Streak: {streak}</span>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
              <Award className="w-6 h-6 text-green-400" />
              <span className="font-bold">
                Round {currentRound}/{totalRounds}
              </span>
            </div>
          </div>
        </div>

        {gameState === "completed" ? (
          /* Game Complete Screen */
          <div className="text-center">
            <div className="bg-gradient-to-br from-green-400/20 to-blue-500/20 backdrop-blur-xl rounded-3xl p-12 border border-white/20 mb-8">
              <div className="text-8xl mb-6 animate-bounce">🎉</div>
              <h2 className="text-4xl font-bold text-white mb-4">
                Game Complete!
              </h2>
              <p className="text-2xl text-white/80 mb-6">
                Final Score: {score}
              </p>
              <p className="text-lg text-white/60 mb-8">
                {score >= 80
                  ? "🌟 Amazing! You're a superstar!"
                  : score >= 60
                  ? "🎯 Great job! Well done!"
                  : "💪 Good effort! Try again to improve!"}
              </p>
              <button
                onClick={resetGame}
                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center gap-3 mx-auto"
              >
                <RotateCcw className="w-6 h-6" />
                Play Again
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Category Selector */}

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 text-center">
                Choose a Category:
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`${category.color} ${
                      selectedCategory === category.id
                        ? "ring-4 ring-white ring-opacity-60 scale-105"
                        : "hover:scale-105"
                    } rounded-xl p-4 border-2 transition-all duration-200 shadow-lg`}
                  >
                    <div className="text-3xl mb-2">{category.icon}</div>
                    <div className="font-bold text-gray-700 text-sm">
                      {category.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Audio Player Section */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 mb-8 shadow-2xl border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Volume2 className="w-8 h-8 text-blue-400" />
                Listen to the audio
              </h3>
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={handlePlayAudio}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-8 rounded-full shadow-xl transition-all duration-300 hover:scale-110 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    {isPlaying ? (
                      <Pause className="w-10 h-10 animate-pulse" />
                    ) : (
                      <Play className="w-10 h-10 ml-1" />
                    )}
                  </div>
                </button>
                <p className="text-white/80 text-lg">
                  {currentAudio
                    ? `Find: ${currentAudio.name}`
                    : "Select a category to start"}
                </p>
              </div>
            </div>

            {/* Image Grid */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Star className="w-8 h-8 text-yellow-400" />
                Click the matching image
              </h3>

              {/* Feedback message */}
              {feedback && (
                <div
                  className={`text-center mb-6 p-4 rounded-2xl border-2 ${
                    gameState === "correct"
                      ? "bg-green-500/20 border-green-400 text-green-200"
                      : "bg-red-500/20 border-red-400 text-red-200"
                  }`}
                >
                  <p className="text-xl font-bold">{feedback}</p>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {currentItems.map((image) => (
                  <button
                    key={image.id}
                    onClick={() => handleImageClick(image)}
                    disabled={gameState !== "playing"}
                    className={`group relative p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 shadow-xl ${
                      selectedImage === image.id
                        ? gameState === "correct"
                          ? "border-green-400 bg-green-500/20 shadow-green-400/50"
                          : "border-red-400 bg-red-500/20 shadow-red-400/50"
                        : "border-white/20 bg-gradient-to-br from-white/10 to-white/5 hover:border-white/40 hover:shadow-2xl"
                    }`}
                  >
                    <div className="text-5xl mb-4 group-hover:animate-bounce">
                      {image.emoji}
                    </div>
                    <div className="font-bold text-white text-lg">
                      {image.name}
                    </div>

                    {selectedImage === image.id && gameState === "correct" && (
                      <div className="absolute inset-0 bg-green-400/20 rounded-2xl animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-8 text-center">
              <p className="text-white/80 text-lg bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm px-8 py-4 rounded-full inline-block border border-white/20">
                🎯 Click the play button, then click the matching image!
              </p>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes confetti {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-confetti {
          animation: confetti 3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ListenMatchGame;
