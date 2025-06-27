import React, { useState, useEffect, useRef } from "react";
import {
  Star,
  Trophy,
  Users,
  BookOpen,
  Volume2,
  RotateCcw,
  Gift,
  Zap,
  Heart,
  Crown,
  Medal,
  Target,
} from "lucide-react";

import { Clock } from "lucide-react";

const TongueTwisterShowdown = () => {
  // Game states
  const [gameState, setGameState] = useState("ageSelection"); // ageSelection, menu, playing, results, achievements
  const [ageGroup, setAgeGroup] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [currentTwister, setCurrentTwister] = useState("");
  const [currentTwisterData, setCurrentTwisterData] = useState(null);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [recording, setRecording] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [achievements, setAchievements] = useState([]);
  const [unlockedLevels, setUnlockedLevels] = useState(["beginner"]);
  const [streak, setStreak] = useState(0);
  const [totalGamesPlayed, setTotalGamesPlayed] = useState(0);
  const [showSyllables, setShowSyllables] = useState(false);
  const [mascotMessage, setMascotMessage] = useState("");
  const [celebration, setCelebration] = useState(false);

  const timerRef = useRef(null);
  const audioRef = useRef(null);

  // Age-appropriate tongue twisters with educational content
  const tongueTwisters = {
    // Ages 6-8 (Classes I-II)
    young: {
      beginner: [
        {
          text: "Big blue ball",
          syllables: ["Big", "blue", "ball"],
          sound: "B sound - lips together!",
          tip: "Press your lips together for 'B' sounds",
          funFact: "The 'B' sound is one of the first sounds babies learn!",
        },
        {
          text: "Red red rose",
          syllables: ["Red", "red", "rose"],
          sound: "R sound - tongue up!",
          tip: "Curl your tongue up for 'R' sounds",
          funFact: "Rolling your R's exercises your tongue muscles!",
        },
        {
          text: "Silly snake slips",
          syllables: ["Sil-ly", "snake", "slips"],
          sound: "S sound - hissing like a snake!",
          tip: "Make a hissing sound like a snake",
          funFact:
            "Snakes can't actually make the 'S' sound - only humans can!",
        },
      ],
      easy: [
        {
          text: "Three free fleas",
          syllables: ["Three", "free", "fleas"],
          sound: "TH and F sounds",
          tip: "Put your tongue between your teeth for 'TH'",
          funFact: "The 'TH' sound exists in only a few languages!",
        },
        {
          text: "Six sick seals",
          syllables: ["Six", "sick", "seals"],
          sound: "S sound practice",
          tip: "Keep your tongue behind your teeth",
          funFact: "Seals are great swimmers but terrible tongue twisters!",
        },
      ],
    },
    // Ages 9-11 (Classes III-V)
    middle: {
      beginner: [
        {
          text: "She sells seashells by the seashore",
          syllables: ["She", "sells", "sea-shells", "by", "the", "sea-shore"],
          sound: "SH and S sounds",
          tip: "Notice the difference between 'S' and 'SH' sounds",
          funFact:
            "This tongue twister was inspired by Mary Anning, a famous fossil collector!",
        },
        {
          text: "How can a clam cram in a clean cream can?",
          syllables: [
            "How",
            "can",
            "a",
            "clam",
            "cram",
            "in",
            "a",
            "clean",
            "cream",
            "can?",
          ],
          sound: "CL and CR sounds",
          tip: "These are called consonant clusters - two consonants together",
          funFact: "Clams can live for over 500 years!",
        },
      ],
      intermediate: [
        {
          text: "Peter Piper picked a peck of pickled peppers",
          syllables: [
            "Pe-ter",
            "Pi-per",
            "picked",
            "a",
            "peck",
            "of",
            "pick-led",
            "pep-pers",
          ],
          sound: "P sound explosion",
          tip: "Feel the puff of air when you say 'P'",
          funFact:
            "A 'peck' is actually a unit of measurement - about 2 gallons!",
        },
      ],
    },
    // Ages 12-15 (Classes VI-X)
    older: {
      intermediate: [
        {
          text: "The sixth sick sheikh's sixth sheep's sick",
          syllables: [
            "The",
            "sixth",
            "sick",
            "sheikh's",
            "sixth",
            "sheep's",
            "sick",
          ],
          sound: "Voiceless fricatives",
          tip: "This combines multiple difficult consonant sounds",
          funFact:
            "This is considered one of the most difficult tongue twisters in English!",
        },
        {
          text: "Imagine an imaginary menagerie manager managing an imaginary menagerie",
          syllables: [
            "I-ma-gine",
            "an",
            "i-ma-gi-na-ry",
            "me-na-ge-rie",
            "ma-na-ger",
            "ma-na-ging",
            "an",
            "i-ma-gi-na-ry",
            "me-na-ge-rie",
          ],
          sound: "Nasal consonants and rhythm",
          tip: "Focus on the rhythm and stress patterns",
          funFact:
            "A menagerie is a collection of wild animals - like a private zoo!",
        },
      ],
      advanced: [
        {
          text: "Pad kid poured curd pulled cod",
          syllables: ["Pad", "kid", "poured", "curd", "pulled", "cod"],
          sound: "Consonant clusters",
          tip: "This was scientifically proven to be extremely difficult!",
          funFact:
            "MIT researchers found this creates maximum tongue confusion!",
        },
      ],
    },
  };

  // Age-appropriate time limits
  const timeLimits = {
    young: { beginner: 45, easy: 40 },
    middle: { beginner: 35, intermediate: 30 },
    older: { intermediate: 25, advanced: 20 },
  };

  // Mascot messages for different age groups
  const mascotMessages = {
    young: {
      start:
        "Hi there! I'm Twisty the Tongue Tiger! Let's have fun with sounds! 🐯",
      good: "Wow! You're doing great! Keep going! ⭐",
      perfect: "AMAZING! You're a tongue twister champion! 🏆",
      encourage: "Don't worry, practice makes perfect! You can do it! 💪",
    },
    middle: {
      start:
        "Welcome, word warrior! Ready to master the art of tongue twisters?",
      good: "Excellent pronunciation! Your speech skills are improving!",
      perfect: "Outstanding! You've mastered that tongue twister!",
      encourage: "Every expert was once a beginner. Keep practicing!",
    },
    older: {
      start: "Greetings! Prepare to challenge your articulatory precision!",
      good: "Impressive linguistic dexterity! Your phonetic control is developing well.",
      perfect: "Exceptional performance! Your speech clarity is remarkable!",
      encourage:
        "Mastery requires persistence. Analyze the phonetic patterns and try again.",
    },
  };

  // Achievement definitions
  const achievementsList = [
    {
      id: "first_star",
      name: "First Star",
      desc: "Earn your first star!",
      icon: "⭐",
      minAge: "young",
    },
    {
      id: "perfect_round",
      name: "Perfect Round",
      desc: "Get 100% accuracy!",
      icon: "🎯",
      minAge: "young",
    },
    {
      id: "speed_demon",
      name: "Speed Demon",
      desc: "Complete 5 twisters quickly!",
      icon: "⚡",
      minAge: "middle",
    },
    {
      id: "streak_master",
      name: "Streak Master",
      desc: "Get 3 perfect scores in a row!",
      icon: "🔥",
      minAge: "middle",
    },
    {
      id: "tongue_twister_expert",
      name: "Expert",
      desc: "Master all difficulty levels!",
      icon: "👑",
      minAge: "older",
    },
    {
      id: "speech_scientist",
      name: "Speech Scientist",
      desc: "Learn 10 fun facts!",
      icon: "🔬",
      minAge: "older",
    },
  ];

  // Initialize game based on age selection
  const selectAgeGroup = (group) => {
    setAgeGroup(group);
    setGameState("menu");
    setMascotMessage(mascotMessages[group].start);

    // Set age-appropriate defaults
    if (group === "young") {
      setShowSyllables(true);
    }
  };

  // Start game with selected difficulty
  const startGame = (level) => {
    setDifficulty(level);
    setGameState("playing");
    setScore(0);
    setStars(0);
    setAttempts(3);
    setTimeLeft(timeLimits[ageGroup][level]);
    setTotalGamesPlayed((prev) => prev + 1);
    selectRandomTwister(level);

    // Start countdown timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Select a random tongue twister
  const selectRandomTwister = (level) => {
    const twisters = tongueTwisters[ageGroup][level];
    const randomIndex = Math.floor(Math.random() * twisters.length);
    const twisterData = twisters[randomIndex];
    setCurrentTwister(twisterData.text);
    setCurrentTwisterData(twisterData);
    setFeedback("");
    setShowHint(false);
    setMascotMessage("");
  };

  // Play audio pronunciation (simulated)
  const playAudio = () => {
    if (ageGroup === "young") {
      setMascotMessage("🔊 Listen carefully and repeat after me!");
      // In a real app, you would use Web Speech API or audio files
      setTimeout(
        () => setMascotMessage("Now you try! Click the microphone!"),
        2000
      );
    }
  };

  // Simulate speech recognition for demo
  const simulateRecording = () => {
    setRecording(true);
    setFeedback("Listening...");

    setTimeout(() => {
      const accuracy = Math.random() * 0.4 + 0.6; // 60-100% accuracy
      evaluateAttempt(accuracy);
    }, 2000);
  };

  // Evaluate the attempt
  const evaluateAttempt = (accuracy) => {
    setRecording(false);

    const speedBonus = Math.floor(Math.random() * 20);
    const attemptScore = Math.floor(accuracy * 100) + speedBonus;
    const starsEarned = accuracy >= 0.9 ? 3 : accuracy >= 0.7 ? 2 : 1;

    setScore((prev) => prev + attemptScore);
    setStars((prev) => prev + starsEarned);
    setAttempts((prev) => prev - 1);

    // Age-appropriate feedback
    let feedbackMsg = "";
    let mascotMsg = "";

    if (accuracy >= 0.9) {
      feedbackMsg = `Perfect! ${Math.floor(accuracy * 100)}% accuracy`;
      mascotMsg = mascotMessages[ageGroup].perfect;
      setStreak((prev) => prev + 1);
      setCelebration(true);
      setTimeout(() => setCelebration(false), 2000);
      checkAchievements("perfect_round");
    } else if (accuracy >= 0.7) {
      feedbackMsg = `Good job! ${Math.floor(accuracy * 100)}% accuracy`;
      mascotMsg = mascotMessages[ageGroup].good;
    } else {
      feedbackMsg = `Keep trying! ${Math.floor(accuracy * 100)}% accuracy`;
      mascotMsg = mascotMessages[ageGroup].encourage;
      setStreak(0);
    }

    setFeedback(feedbackMsg);
    setMascotMessage(mascotMsg);

    // Check for achievements
    if (stars === 1) checkAchievements("first_star");
    if (streak >= 3) checkAchievements("streak_master");

    // Get new twister if attempts remain
    if (attempts > 1) {
      setTimeout(() => selectRandomTwister(difficulty), 3000);
    } else {
      setTimeout(endGame, 3000);
    }
  };

  // Check and award achievements
  const checkAchievements = (achievementId) => {
    const achievement = achievementsList.find((a) => a.id === achievementId);
    if (achievement && !achievements.includes(achievementId)) {
      setAchievements((prev) => [...prev, achievementId]);
      setTimeout(() => {
        alert(
          `🎉 Achievement Unlocked: ${achievement.name}! ${achievement.desc}`
        );
      }, 1000);
    }
  };

  // End game and show results
  const endGame = () => {
    clearInterval(timerRef.current);
    setGameState("results");
  };

  // Age-appropriate UI themes
  const getThemeClasses = () => {
    switch (ageGroup) {
      case "young":
        return {
          background:
            "bg-gradient-to-b from-yellow-100 via-pink-100 to-purple-100",
          primary: "bg-pink-500 hover:bg-pink-600",
          secondary: "bg-blue-400 hover:bg-blue-500",
          card: "bg-white border-4 border-yellow-300 shadow-2xl",
          text: "text-purple-800",
        };
      case "middle":
        return {
          background:
            "bg-gradient-to-b from-blue-100 via-green-100 to-teal-100",
          primary: "bg-green-600 hover:bg-green-700",
          secondary: "bg-blue-500 hover:bg-blue-600",
          card: "bg-white border-2 border-green-200 shadow-xl",
          text: "text-green-800",
        };
      case "older":
        return {
          background:
            "bg-gradient-to-b from-gray-100 via-blue-100 to-indigo-100",
          primary: "bg-indigo-600 hover:bg-indigo-700",
          secondary: "bg-gray-600 hover:bg-gray-700",
          card: "bg-white border border-indigo-200 shadow-lg",
          text: "text-indigo-800",
        };
      default:
        return {
          background: "bg-gradient-to-b from-blue-50 to-purple-100",
          primary: "bg-purple-600 hover:bg-purple-700",
          secondary: "bg-blue-500 hover:bg-blue-600",
          card: "bg-white shadow-lg",
          text: "text-purple-800",
        };
    }
  };

  const theme = getThemeClasses();

  return (
    <div
      className={`min-h-screen ${theme.background} flex flex-col items-center justify-center p-4`}
    >
      {/* Age Selection Screen */}
      {gameState === "ageSelection" && (
        <div className="w-full max-w-4xl text-center">
          <h1 className="text-6xl font-bold text-purple-800 mb-4 animate-bounce">
            🌟 Tongue Twister Academy 🌟
          </h1>
          <p className="text-2xl text-gray-700 mb-12">
            Choose your learning level!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              onClick={() => selectAgeGroup("young")}
              className="cursor-pointer transform hover:scale-105 transition-all duration-300"
            >
              <div className="bg-gradient-to-b from-yellow-200 to-pink-200 rounded-3xl p-8 border-4 border-yellow-400 shadow-2xl">
                <div className="text-6xl mb-4">🐯</div>
                <h3 className="text-2xl font-bold text-purple-800 mb-2">
                  Little Learners
                </h3>
                <p className="text-lg text-purple-600">
                  Classes I-II (Ages 6-8)
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Fun sounds and simple words!
                </p>
              </div>
            </div>

            <div
              onClick={() => selectAgeGroup("middle")}
              className="cursor-pointer transform hover:scale-105 transition-all duration-300"
            >
              <div className="bg-gradient-to-b from-green-200 to-blue-200 rounded-3xl p-8 border-4 border-green-400 shadow-2xl">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-green-800 mb-2">
                  Word Warriors
                </h3>
                <p className="text-lg text-green-600">
                  Classes III-V (Ages 9-11)
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Challenge yourself with tricky phrases!
                </p>
              </div>
            </div>

            <div
              onClick={() => selectAgeGroup("older")}
              className="cursor-pointer transform hover:scale-105 transition-all duration-300"
            >
              <div className="bg-gradient-to-b from-indigo-200 to-purple-200 rounded-3xl p-8 border-4 border-indigo-400 shadow-2xl">
                <div className="text-6xl mb-4">👑</div>
                <h3 className="text-2xl font-bold text-indigo-800 mb-2">
                  Speech Masters
                </h3>
                <p className="text-lg text-indigo-600">
                  Classes VI-X (Ages 12-15)
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Master the most challenging twisters!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Game Header */}
      {gameState !== "ageSelection" && (
        <header className="w-full max-w-4xl mb-8 text-center">
          <h1 className={`text-4xl font-bold ${theme.text} mb-2`}>
            {ageGroup === "young" && "🎭 Twisty's Tongue Twister Fun!"}
            {ageGroup === "middle" && "🎯 Tongue Twister Challenge Arena"}
            {ageGroup === "older" && "👑 Advanced Speech Mastery Lab"}
          </h1>
          {mascotMessage && (
            <div className="bg-yellow-100 border-2 border-yellow-400 rounded-xl p-3 mt-4 animate-pulse">
              <p className="text-lg font-semibold text-yellow-800">
                {mascotMessage}
              </p>
            </div>
          )}
        </header>
      )}

      {/* Main Game Container */}
      {gameState !== "ageSelection" && (
        <div
          className={`w-full max-w-4xl ${theme.card} rounded-xl overflow-hidden`}
        >
          {/* Menu Screen */}
          {gameState === "menu" && (
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <Star className="text-yellow-500" size={24} />
                  <span className="text-xl font-bold">Stars: {stars}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Trophy className="text-orange-500" size={24} />
                  <span className="text-xl font-bold">Score: {score}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Medal className="text-purple-500" size={24} />
                  <span className="text-xl font-bold">
                    Achievements: {achievements.length}
                  </span>
                </div>
              </div>

              <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">
                {ageGroup === "young" && "Choose Your Adventure!"}
                {ageGroup === "middle" && "Select Challenge Level"}
                {ageGroup === "older" && "Choose Difficulty Mode"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {Object.keys(tongueTwisters[ageGroup]).map((level) => (
                  <button
                    key={level}
                    onClick={() => startGame(level)}
                    className={`py-6 px-8 rounded-xl text-white font-bold text-xl transition-all transform hover:scale-105 ${theme.primary}`}
                    disabled={!unlockedLevels.includes(level)}
                  >
                    <div className="flex items-center justify-center gap-3 mb-2">
                      {level === "beginner" && <Star size={24} />}
                      {level === "easy" && <Target size={24} />}
                      {level === "intermediate" && <Zap size={24} />}
                      {level === "advanced" && <Crown size={24} />}

                      {ageGroup === "young" &&
                        level === "beginner" &&
                        "Beginner Fun"}
                      {ageGroup === "young" && level === "easy" && "Easy Peasy"}
                      {ageGroup === "middle" &&
                        level === "beginner" &&
                        "Beginner"}
                      {ageGroup === "middle" &&
                        level === "intermediate" &&
                        "Intermediate"}
                      {ageGroup === "older" &&
                        level === "intermediate" &&
                        "Intermediate"}
                      {ageGroup === "older" &&
                        level === "advanced" &&
                        "Advanced"}
                    </div>
                    <div className="text-sm font-normal">
                      {timeLimits[ageGroup][level]} seconds •{" "}
                      {tongueTwisters[ageGroup][level].length} twisters
                    </div>
                  </button>
                ))}
              </div>

              {/* Age-specific features */}
              {ageGroup === "young" && (
                <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-6 mb-6">
                  <h3 className="text-xl font-bold text-purple-800 mb-3 flex items-center gap-2">
                    <Gift size={20} />
                    Fun Features for You!
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Volume2 size={16} />
                      <span>Listen to pronunciation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} />
                      <span>See syllable breakdowns</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart size={16} />
                      <span>Friendly mascot helper</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star size={16} />
                      <span>Collect colorful stars</span>
                    </div>
                  </div>
                </div>
              )}

              {ageGroup === "middle" && (
                <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-6 mb-6">
                  <h3 className="text-xl font-bold text-green-800 mb-3 flex items-center gap-2">
                    <Users size={20} />
                    Challenge Features
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>🏆 Achievement System</div>
                    <div>📊 Progress Tracking</div>
                    <div>🔬 Learn Fun Facts</div>
                    <div>⚡ Speed Challenges</div>
                  </div>
                </div>
              )}

              {ageGroup === "older" && (
                <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-6 mb-6">
                  <h3 className="text-xl font-bold text-indigo-800 mb-3 flex items-center gap-2">
                    <BookOpen size={20} />
                    Advanced Features
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>🔬 Phonetic Analysis</div>
                    <div>📈 Performance Analytics</div>
                    <div>🌍 Linguistic Education</div>
                    <div>🏅 Competitive Modes</div>
                  </div>
                </div>
              )}

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setGameState("achievements")}
                  className={`py-3 px-6 ${theme.secondary} text-white rounded-lg font-bold flex items-center gap-2`}
                >
                  <Trophy size={20} />
                  View Achievements
                </button>
                <button
                  onClick={() => setGameState("ageSelection")}
                  className="py-3 px-6 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-bold"
                >
                  Change Age Group
                </button>
              </div>
            </div>
          )}

          {/* Playing Screen */}
          {gameState === "playing" && (
            <div className="p-6">
              {/* Game Stats */}
              <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="text-blue-500" size={20} />
                  <span className="text-lg font-semibold">
                    Time: {timeLeft}s
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-500" size={20} />
                  <span className="text-lg font-semibold">Stars: {stars}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="text-orange-500" size={20} />
                  <span className="text-lg font-semibold">Score: {score}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="text-green-500" size={20} />
                  <span className="text-lg font-semibold">
                    Attempts: {attempts}
                  </span>
                </div>
              </div>

              {/* Current Tongue Twister */}
              <div className="bg-gradient-to-r from-yellow-50 to-pink-50 rounded-xl p-8 mb-6 min-h-32 flex flex-col items-center justify-center border-2 border-yellow-200">
                <p className="text-3xl font-bold text-center text-gray-800 mb-4">
                  {currentTwister}
                </p>

                {/* Syllable breakdown for younger kids */}
                {ageGroup === "young" &&
                  showSyllables &&
                  currentTwisterData && (
                    <div className="mt-4 p-4 bg-white rounded-lg border-2 border-pink-200">
                      <p className="text-sm font-semibold text-pink-800 mb-2">
                        Break it down:
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {currentTwisterData.syllables.map((syllable, index) => (
                          <span
                            key={index}
                            className="bg-pink-100 px-3 py-1 rounded-full text-lg font-medium"
                          >
                            {syllable}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Sound tip */}
                {currentTwisterData && (
                  <div className="mt-4 text-center">
                    <p className="text-lg font-semibold text-purple-700">
                      🎯 Focus on: {currentTwisterData.sound}
                    </p>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex flex-col items-center gap-4">
                <div className="flex gap-4 flex-wrap justify-center">
                  {ageGroup === "young" && (
                    <button
                      onClick={playAudio}
                      className="py-3 px-6 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-bold flex items-center gap-2"
                    >
                      <Volume2 size={20} />
                      Listen First
                    </button>
                  )}

                  <button
                    onClick={simulateRecording}
                    disabled={recording}
                    className={`py-4 px-8 rounded-full text-white font-bold text-xl transition-all transform hover:scale-105 ${
                      recording ? "bg-red-500 animate-pulse" : theme.primary
                    }`}
                  >
                    {recording ? (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                        Stop Recording
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        🎤 Start Speaking
                      </div>
                    )}
                  </button>

                  <button
                    onClick={() => setShowHint(!showHint)}
                    className={`py-3 px-6 ${theme.secondary} text-white rounded-lg font-bold flex items-center gap-2`}
                  >
                    <BookOpen size={20} />
                    {showHint ? "Hide Tips" : "Show Tips"}
                  </button>
                </div>

                {/* Skip option for older students */}
                {ageGroup !== "young" && (
                  <button
                    onClick={() => selectRandomTwister(difficulty)}
                    className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium"
                  >
                    <RotateCcw size={16} className="inline mr-2" />
                    Skip This Twister
                  </button>
                )}

                {/* Hints and Tips */}
                {showHint && currentTwisterData && (
                  <div className="mt-6 p-6 bg-blue-50 rounded-xl border-2 border-blue-200 max-w-2xl">
                    <h4 className="text-lg font-bold text-blue-800 mb-3">
                      💡 Helpful Tips
                    </h4>
                    <div className="space-y-3">
                      <p className="text-blue-700">
                        <strong>Technique:</strong> {currentTwisterData.tip}
                      </p>
                      {ageGroup !== "young" && (
                        <p className="text-blue-700">
                          <strong>Fun Fact:</strong>{" "}
                          {currentTwisterData.funFact}
                        </p>
                      )}
                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <strong>Practice Strategy:</strong>
                          {ageGroup === "young" &&
                            " Say it slowly first, then speed up gradually!"}
                          {ageGroup === "middle" &&
                            " Break it into parts, master each section, then combine them."}
                          {ageGroup === "older" &&
                            " Focus on the articulatory movements and phonetic transitions between sounds."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Feedback */}
                {feedback && (
                  <div
                    className={`mt-4 p-4 rounded-xl border-2 text-center ${
                      feedback.includes("Perfect")
                        ? "bg-green-50 border-green-200 text-green-800"
                        : feedback.includes("Good")
                        ? "bg-blue-50 border-blue-200 text-blue-800"
                        : "bg-orange-50 border-orange-200 text-orange-800"
                    }`}
                  >
                    <p className="text-lg font-semibold">{feedback}</p>
                  </div>
                )}

                {/* Attempts indicator */}
                <div className="mt-4 text-center">
                  <p className="text-lg text-gray-600 mb-2">
                    Attempts remaining:
                  </p>
                  <div className="flex justify-center gap-1">
                    {Array(attempts)
                      .fill(0)
                      .map((_, i) => (
                        <Heart key={i} className="text-red-500" size={24} />
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results Screen */}
          {gameState === "results" && (
            <div className="p-8 text-center">
              {celebration && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="text-6xl animate-bounce">🎉</div>
                </div>
              )}

              <h2 className="text-4xl font-bold mb-6 text-purple-700">
                {ageGroup === "young" && "🌟 Great Job, Little Star!"}
                {ageGroup === "middle" && "🏆 Challenge Complete!"}
                {ageGroup === "older" && "👑 Performance Analysis"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-yellow-100 rounded-xl p-6 border-2 border-yellow-300">
                  <Star className="text-yellow-500 mx-auto mb-2" size={48} />
                  <div className="text-4xl font-bold text-yellow-700">
                    {stars}
                  </div>
                  <p className="text-yellow-800 font-semibold">Stars Earned</p>
                </div>
                <div className="bg-blue-100 rounded-xl p-6 border-2 border-blue-300">
                  <Trophy className="text-blue-500 mx-auto mb-2" size={48} />
                  <div className="text-4xl font-bold text-blue-700">
                    {score}
                  </div>
                  <p className="text-blue-800 font-semibold">Total Points</p>
                </div>
                <div className="bg-green-100 rounded-xl p-6 border-2 border-green-300">
                  <Target className="text-green-500 mx-auto mb-2" size={48} />
                  <div className="text-4xl font-bold text-green-700">
                    {streak}
                  </div>
                  <p className="text-green-800 font-semibold">Best Streak</p>
                </div>
              </div>

              {/* Age-specific results content */}
              {ageGroup === "young" && (
                <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-6 mb-6">
                  <h3 className="text-2xl font-bold text-purple-800 mb-3">
                    🎈 You're Amazing!
                  </h3>
                  <p className="text-lg text-purple-700">
                    You practiced {tongueTwisters[ageGroup][difficulty].length}{" "}
                    tongue twisters and earned {stars} stars! Keep practicing to
                    become a tongue twister champion!
                  </p>
                </div>
              )}

              {ageGroup === "middle" && (
                <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-6 mb-6">
                  <h3 className="text-2xl font-bold text-green-800 mb-3">
                    📊 Your Progress
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div>
                      <p className="font-semibold">Games Played:</p>
                      <p className="text-2xl">{totalGamesPlayed}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Achievements:</p>
                      <p className="text-2xl">{achievements.length}</p>
                    </div>
                  </div>
                </div>
              )}

              {ageGroup === "older" && (
                <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-6 mb-6">
                  <h3 className="text-2xl font-bold text-indigo-800 mb-3">
                    📈 Performance Metrics
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div>
                      <p className="font-semibold">Accuracy Rate:</p>
                      <p className="text-2xl">
                        {Math.round(
                          (score /
                            (tongueTwisters[ageGroup][difficulty].length *
                              120)) *
                            100
                        )}
                        %
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">Consistency:</p>
                      <p className="text-2xl">
                        {streak > 2
                          ? "Excellent"
                          : streak > 0
                          ? "Good"
                          : "Needs Work"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Name input for leaderboard */}
              <div className="mb-6">
                <label
                  htmlFor="playerName"
                  className="block mb-3 text-lg font-semibold text-gray-700"
                >
                  {ageGroup === "young"
                    ? "What's your name, superstar?"
                    : "Enter your name:"}
                </label>
                <input
                  type="text"
                  id="playerName"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-center text-lg"
                  placeholder={
                    ageGroup === "young" ? "Your awesome name!" : "Your name"
                  }
                  maxLength="20"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    if (playerName.trim()) {
                      // In a real app, save to leaderboard
                      alert(
                        `Great job, ${playerName}! Your score has been saved.`
                      );
                    }
                    setGameState("menu");
                  }}
                  className={`py-4 px-8 ${theme.primary} text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2`}
                >
                  <Trophy size={20} />
                  {ageGroup === "young" ? "Save My Stars!" : "Save Score"}
                </button>

                <button
                  onClick={() => startGame(difficulty)}
                  className={`py-4 px-8 ${theme.secondary} text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2`}
                >
                  <RotateCcw size={20} />
                  Play Again
                </button>

                <button
                  onClick={() => setGameState("menu")}
                  className="py-4 px-8 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-bold text-lg"
                >
                  Main Menu
                </button>
              </div>
            </div>
          )}

          {/* Achievements Screen */}
          {gameState === "achievements" && (
            <div className="p-8">
              <h2 className="text-3xl font-bold text-center mb-8 text-purple-700">
                🏆 Your Achievements
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievementsList
                  .filter((a) => a.minAge === ageGroup || a.minAge === "young")
                  .map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-6 rounded-xl border-2 text-center transition-all ${
                        achievements.includes(achievement.id)
                          ? "bg-gradient-to-b from-yellow-100 to-orange-100 border-yellow-400 shadow-lg"
                          : "bg-gray-100 border-gray-300 opacity-60"
                      }`}
                    >
                      <div className="text-4xl mb-3">{achievement.icon}</div>
                      <h3 className="text-xl font-bold mb-2">
                        {achievement.name}
                      </h3>
                      <p className="text-gray-700">{achievement.desc}</p>
                      {achievements.includes(achievement.id) && (
                        <div className="mt-3 bg-yellow-200 rounded-full px-3 py-1 text-sm font-semibold">
                          ✅ Unlocked!
                        </div>
                      )}
                    </div>
                  ))}
              </div>

              <div className="text-center mt-8">
                <button
                  onClick={() => setGameState("menu")}
                  className={`py-3 px-8 ${theme.primary} text-white rounded-lg font-bold`}
                >
                  Back to Menu
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Educational Footer */}
      <footer className="mt-8 text-center text-gray-600 text-sm max-w-4xl">
        <div className="bg-white rounded-lg p-4 shadow-lg">
          <h4 className="font-bold text-lg mb-2 text-gray-800">
            🧠 Why Tongue Twisters Are Great for Learning!
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div>
              <strong>🗣️ Speech Development:</strong> Improves pronunciation and
              articulation skills
            </div>
            <div>
              <strong>🧠 Brain Training:</strong> Enhances cognitive flexibility
              and memory
            </div>
            <div>
              <strong>🎯 Focus Building:</strong> Develops concentration and
              attention to detail
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TongueTwisterShowdown;
