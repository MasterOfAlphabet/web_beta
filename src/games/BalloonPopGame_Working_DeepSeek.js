import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const wordsByDifficulty = {
  easy: ["CAT", "DOG", "SUN", "CAR", "BAT", "HAT", "BIG", "RED", "BLUE", "FUN"],
  medium: ["APPLE", "GRAPE", "LEMON", "PEACH", "MANGO", "TIGER", "HORSE", "EAGLE", "OCEAN", "PLANE"],
  hard: ["ELEPHANT", "BUTTERFLY", "KANGAROO", "CROCODILE", "RHINOCEROS", "AEROPLANE", "UNIVERSE", "MOUNTAIN", "HOSPITAL", "BASKETBALL"]
};

const skillLevels = [
  { name: "Rookie", timeMultiplier: 1.5, scoreMultiplier: 1, color: "bg-blue-100 text-blue-800" },
  { name: "Racer", timeMultiplier: 1.3, scoreMultiplier: 1.2, color: "bg-green-100 text-green-800" },
  { name: "Master", timeMultiplier: 1.0, scoreMultiplier: 1.5, color: "bg-yellow-100 text-yellow-800" },
  { name: "Prodigy", timeMultiplier: 0.8, scoreMultiplier: 2, color: "bg-orange-100 text-orange-800" },
  { name: "Wizard", timeMultiplier: 0.6, scoreMultiplier: 3, color: "bg-red-100 text-red-800" }
];

const BalloonPopGame = () => {
  const [difficulty, setDifficulty] = useState("medium");
  const [skillLevel, setSkillLevel] = useState(2);
  const [selectedWord, setSelectedWord] = useState("");
  const [scrambledLetters, setScrambledLetters] = useState([]);
  const [poppedIndices, setPoppedIndices] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [totalWords, setTotalWords] = useState(5);
  const [balloonColors, setBalloonColors] = useState([]);
  const [timePerWord, setTimePerWord] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [totalGameTime, setTotalGameTime] = useState(0);
  
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const gameContainerRef = useRef(null);

  const colorPalettes = [
    ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500"],
    ["bg-pink-500", "bg-indigo-500", "bg-orange-500", "bg-teal-500", "bg-amber-500"],
    ["bg-rose-500", "bg-violet-500", "bg-emerald-500", "bg-cyan-500", "bg-fuchsia-500"],
    ["bg-lime-500", "bg-sky-500", "bg-amber-500", "bg-pink-500", "bg-indigo-500"],
    ["bg-cyan-500", "bg-purple-500", "bg-yellow-500", "bg-red-500", "bg-green-500"]
  ];

  const startNewGame = () => {
    const words = wordsByDifficulty[difficulty];
    const selectedWords = [...words].sort(() => 0.5 - Math.random()).slice(0, totalWords);
    setSelectedWord(selectedWords[0]);

    const lettersWithIndices = selectedWords[0].split("").map((letter, index) => ({
      letter,
      originalIndex: index
    }));

    const scrambled = [...lettersWithIndices].sort(() => Math.random() - 0.5);
    setScrambledLetters(scrambled);

    const palette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
    setBalloonColors(palette);

    setPoppedIndices([]);
    setGameOver(false);
    setGameStarted(true);
    setLives(3);
    setScore(0);
    setCurrentWordIndex(0);
    setTimePerWord([]);
    setTotalGameTime(0);
    setStartTime(Date.now());

    const baseTime = { easy: 90, medium: 60, hard: 45 }[difficulty];
    const time = Math.floor(baseTime * skillLevels[skillLevel].timeMultiplier);
    setTimeLeft(time);

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const loadNextWord = () => {
    const currentTime = Date.now();
    const wordTime = Math.floor((currentTime - startTime) / 1000);
    setTimePerWord(prev => [...prev, { word: selectedWord, time: wordTime }]);
    setTotalGameTime(prev => prev + wordTime);

    const words = wordsByDifficulty[difficulty];
    const nextIndex = currentWordIndex + 1;

    if (nextIndex >= totalWords) {
      clearInterval(timerRef.current);
      setGameOver(true);
      
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("balloonPopHighScore", score);
      }
      return;
    }

    setCurrentWordIndex(nextIndex);
    const nextWord = words[nextIndex];
    setSelectedWord(nextWord);
    setStartTime(Date.now());

    const lettersWithIndices = nextWord.split("").map((letter, index) => ({
      letter,
      originalIndex: index
    }));

    const scrambled = [...lettersWithIndices].sort(() => Math.random() - 0.5);
    setScrambledLetters(scrambled);
    setPoppedIndices([]);

    const palette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
    setBalloonColors(palette);

    const baseTime = { easy: 90, medium: 60, hard: 45 }[difficulty];
    const time = Math.floor(baseTime * skillLevels[skillLevel].timeMultiplier);
    setTimeLeft(time);

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handlePop = (originalIndex, scrambledIndex) => {
    if (poppedIndices.includes(scrambledIndex)) return;

    const nextExpectedLetter = selectedWord[poppedIndices.length];
    const expectedCountSoFar = selectedWord
      .slice(0, poppedIndices.length + 1)
      .split("")
      .filter(l => l === nextExpectedLetter).length;

    const poppedThisLetter = poppedIndices
      .map(idx => scrambledLetters[idx].letter)
      .filter(l => l === nextExpectedLetter).length;

    if (
      scrambledLetters[scrambledIndex].letter === nextExpectedLetter &&
      poppedThisLetter < expectedCountSoFar
    ) {
      const newPoppedIndices = [...poppedIndices, scrambledIndex];
      setPoppedIndices(newPoppedIndices);

      const basePoints = 10 * (difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3);
      const multipliedPoints = Math.floor(basePoints * skillLevels[skillLevel].scoreMultiplier);
      setScore(prev => prev + multipliedPoints);

      if (newPoppedIndices.length === selectedWord.length) {
        const timeBonus = Math.floor(timeLeft * 5 * skillLevels[skillLevel].scoreMultiplier);
        setScore(prev => prev + timeBonus);
        setTimeout(loadNextWord, 1000);
      }
    } else {
      setLives(prev => {
        if (prev <= 1) {
          setGameOver(true);
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });

      const balloon = gameContainerRef.current.querySelector(`[data-index="${scrambledIndex}"]`);
      if (balloon) {
        balloon.classList.add("animate-wiggle");
        setTimeout(() => {
          balloon.classList.remove("animate-wiggle");
        }, 500);
      }
    }
  };

  useEffect(() => {
    const savedHighScore = localStorage.getItem("balloonPopHighScore");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const currentProgress = () => {
    return selectedWord.slice(0, poppedIndices.length);
  };

  const progressPercentage = () => {
    return (currentWordIndex / totalWords) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center py-8 px-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Balloon Pop Challenge</h1>
        <p className="text-lg text-gray-600">Pop the balloons in the correct order!</p>
        <div className="mt-2 text-sm text-gray-500">
          Skill: <span className={`px-2 py-1 rounded-full ${skillLevels[skillLevel].color}`}>
            {skillLevels[skillLevel].name}
          </span>
        </div>
      </header>

      {!gameStarted ? (
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Game Settings</h2>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-3 font-medium">Difficulty Level</label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(wordsByDifficulty).map(level => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`px-4 py-2 rounded-lg capitalize transition-all ${
                    difficulty === level 
                      ? "bg-blue-600 text-white shadow-md" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-3 font-medium">Skill Level</label>
            <div className="space-y-2">
              {skillLevels.map((level, index) => (
                <button
                  key={level.name}
                  onClick={() => setSkillLevel(index)}
                  className={`w-full px-4 py-2 rounded-lg text-left transition-all flex justify-between items-center ${
                    skillLevel === index 
                      ? `${level.color} font-bold shadow-inner` 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span>{level.name}</span>
                  <span className="text-sm opacity-80">
                    Time: {level.timeMultiplier}x | Score: {level.scoreMultiplier}x
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <label className="block text-gray-700 mb-3 font-medium">
              Number of Words: <span className="font-bold">{totalWords}</span>
            </label>
            <input
              type="range"
              min="3"
              max="10"
              value={totalWords}
              onChange={e => setTotalWords(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>3</span>
              <span>5</span>
              <span>7</span>
              <span>10</span>
            </div>
          </div>
          
          <button
            onClick={startNewGame}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02]"
          >
            Start Game
          </button>
        </div>
      ) : gameOver ? (
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="mb-6">
            {currentWordIndex >= totalWords ? (
              <div className="text-green-600">
                <div className="text-5xl mb-4">🏆</div>
                <h2 className="text-3xl font-bold mb-2">Great Job!</h2>
              </div>
            ) : (
              <div className="text-red-600">
                <div className="text-5xl mb-4">⏱️</div>
                <h2 className="text-3xl font-bold mb-2">Time's Up!</h2>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg mb-4 text-left">
              <h3 className="font-bold mb-2">Word Breakdown:</h3>
              {timePerWord.map((item, index) => (
                <div key={index} className="flex justify-between py-1 border-b border-gray-200">
                  <span>{item.word}</span>
                  <span>{item.time}s</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 font-bold">
                <span>Total Time:</span>
                <span>{totalGameTime}s</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-blue-600">Score</div>
                <div className="text-2xl font-bold">{score}</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-sm text-green-600">High Score</div>
                <div className="text-2xl font-bold">{highScore}</div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={startNewGame}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              Play Again
            </button>
            <button
              onClick={() => setGameStarted(false)}
              className="px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg shadow-lg hover:bg-gray-300 transition-all"
            >
              Change Settings
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl">
          <div className="mb-6 flex items-center w-full">
            <div className="w-[75%] pr-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Word {currentWordIndex + 1} of {totalWords}
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {Math.round(progressPercentage())}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage()}%` }}
                ></div>
              </div>
            </div>

            <div className="w-[25%]">
              <button
                className="w-full py-2 px-2 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-lg shadow-lg hover:from-red-600 hover:to-pink-700 transition-all text-sm sm:text-base"
                onClick={() => navigate("/english-skills-building-games")}
              >
                End Game
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl shadow-sm text-center">
              <div className="text-sm text-gray-500 mb-1">Score</div>
              <div className="text-2xl font-bold text-gray-800">{score}</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm text-center">
              <div className="text-sm text-gray-500 mb-1">Lives</div>
              <div className="flex justify-center space-x-1">
                {[...Array(3)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-2xl ${
                      i < lives ? "text-red-500" : "text-gray-300"
                    }`}
                  >
                    ♥
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex justify-between items-center">
            <div className="flex space-x-2">
              {[...Array(Math.floor(timeLeft/10))].map((_, i) => (
                <div key={i} className="w-2 h-6 bg-green-500 rounded-sm"></div>
              ))}
            </div>
            
            <div className="text-center">
              <h2 className="text-sm font-semibold text-gray-500 mb-1">
                POP THE LETTERS IN ORDER
              </h2>
              <div className="text-3xl font-bold text-gray-800 font-mono tracking-wider">
                <span className="text-green-600">{currentProgress()}</span>
                <span className="text-gray-400">
                  {selectedWord.slice(poppedIndices.length)}
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-500">Time Left</div>
              <div className={`text-2xl font-bold ${
                timeLeft <= 10 ? "text-red-600 animate-pulse" : "text-gray-800"
              }`}>
                {timeLeft}s
              </div>
            </div>
          </div>

          <div
            ref={gameContainerRef}
            className="flex flex-wrap justify-center gap-4 md:gap-6 min-h-[300px] items-center"
          >
            {scrambledLetters.map(({ letter, originalIndex }, scrambledIndex) => (
              <button
                key={scrambledIndex}
                data-index={scrambledIndex}
                onClick={() => handlePop(originalIndex, scrambledIndex)}
                disabled={poppedIndices.includes(scrambledIndex)}
                className={`relative transition-all duration-300 ease-in-out ${
                  poppedIndices.includes(scrambledIndex)
                    ? "scale-0 opacity-0"
                    : "hover:scale-110 hover:shadow-xl"
                } ${balloonColors[scrambledIndex % balloonColors.length]} 
                text-white font-bold w-14 h-16 md:w-16 md:h-20 rounded-full flex items-center justify-center 
                shadow-lg balloon`}
              >
                {letter}
                <div className="absolute bottom-0 w-1 h-6 md:h-8 bg-gray-300 -mb-4 md:-mb-6"></div>
              </button>
            ))}
          </div>

          <div className="mt-6 bg-white p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Progress:
              </span>
              <span className="text-sm font-medium text-gray-700">
                {poppedIndices.length}/{selectedWord.length} letters
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{
                  width: `${(poppedIndices.length / selectedWord.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>Click the balloons in the correct order of the target word</p>
      </footer>
    </div>
  );
};

export default BalloonPopGame;