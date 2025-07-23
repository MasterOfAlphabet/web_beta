import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GrammarPatternDetective = () => {
  // Grammar database with exact class/level structure
  const grammarDatabase = {
    "CLASS I-II": {
      Rookie: {
        title: "Noun vs Verb Identification",
        examples: ["cat (noun) vs jump (verb)", "ball (noun) vs run (verb)"],
        pattern: "Person/Thing vs Action words"
      },
      Racer: {
        title: "Simple Sentence Completion",
        examples: ["I ___ happy", "She ___ reading"],
        pattern: "Subject + _ + Complement"
      },
      Master: {
        title: "Plural Formation",
        examples: ["cat → cats", "box → boxes"],
        pattern: "Add -s/-es"
      },
      Prodigy: {
        title: "Basic Question Formation",
        examples: ["What is this?", "Where is ___?"],
        pattern: "Question word + verb"
      },
      Wizard: {
        title: "Regular Past Tense",
        examples: ["walk → walked", "play → played"],
        pattern: "Add -ed"
      }
    },
    "CLASS III-V": {
      Rookie: {
        title: "Subject-Verb Agreement",
        examples: ["He ___, They ___", "She ___, We ___"],
        pattern: "Singular vs Plural"
      },
      Racer: {
        title: "Adjective Order",
        examples: ["___ small red car", "___ beautiful old painting"],
        pattern: "Opinion > Size > Age > Color"
      },
      Master: {
        title: "Irregular Past Tense",
        examples: ["go → went", "see → saw"],
        pattern: "No -ed ending"
      },
      Prodigy: {
        title: "Conjunction Usage",
        examples: ["and for addition", "but for contrast"],
        pattern: "Connecting words"
      },
      Wizard: {
        title: "Conditional Sentences",
        examples: ["If ___, then ___", "When ___, ___"],
        pattern: "If-then structure"
      }
    },
    "CLASS VI-X": {
      Rookie: {
        title: "Tense Consistency",
        examples: ["Yesterday I ___", "Tomorrow she will ___"],
        pattern: "Time markers"
      },
      Racer: {
        title: "Active/Passive Voice",
        examples: ["The cat chased the mouse → The mouse was chased by the cat"],
        pattern: "Subject/object flip"
      },
      Master: {
        title: "Verbals (Gerunds/Participles)",
        examples: ["Swimming is fun", "The broken window"],
        pattern: "-ing forms"
      },
      Prodigy: {
        title: "Register Switching",
        examples: ["I would appreciate... vs Can you..."],
        pattern: "Formal vs Informal"
      },
      Wizard: {
        title: "Rhetorical Structures",
        examples: ["Not only...but also...", "The more...the more..."],
        pattern: "Advanced patterns"
      }
    }
  };

  // State management
  const [currentClass, setCurrentClass] = useState("CLASS I-II");
  const [currentLevel, setCurrentLevel] = useState("Rookie");
  const [sentenceParts, setSentenceParts] = useState([]);
  const [userAnswer, setUserAnswer] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const constraintsRef = useRef(null);

  // Initialize challenge
  useEffect(() => {
    resetChallenge();
  }, [currentClass, currentLevel]);

  const resetChallenge = () => {
    setIsAnimating(true);
    setTimeout(() => {
      const currentExample = grammarDatabase[currentClass][currentLevel].examples[0];
      if (currentExample.includes("→")) {
        setSentenceParts(currentExample.split("→").map(part => part.trim()));
        setUserAnswer(["", ""]);
      } else {
        setSentenceParts(shuffleArray(currentExample.split(" ").filter(part => part !== "___")));
        setUserAnswer(Array(currentExample.split(" ").length).fill("___"));
      }
      setFeedback(null);
      setIsAnimating(false);
    }, 300);
  };

  // Game logic functions
  const handleDrop = (word, index) => {
    const newAnswer = [...userAnswer];
    newAnswer[index] = word;
    setUserAnswer(newAnswer);
    setSentenceParts(sentenceParts.filter(w => w !== word));
  };

  const handleRemove = (word, index) => {
    const currentExample = grammarDatabase[currentClass][currentLevel].examples[0];
    const newAnswer = [...userAnswer];
    newAnswer[index] = currentExample.includes("→") ? "" : "___";
    setUserAnswer(newAnswer);
    setSentenceParts([...sentenceParts, word]);
  };

  const checkAnswer = () => {
    const currentExample = grammarDatabase[currentClass][currentLevel].examples[0];
    let isCorrect = false;
    
    if (currentExample.includes("→")) {
      isCorrect = userAnswer.join(" → ") === currentExample;
    } else {
      isCorrect = userAnswer.join(" ") === currentExample;
    }
    
    setFeedback({
      isCorrect,
      message: isCorrect ? "Perfect pattern match!" : "Pattern mismatch!",
      correctAnswer: currentExample
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        
        body {
          margin: 0;
          padding: 0;
          font-family: 'Space Grotesk', sans-serif;
        }
        
        .animated-bg {
          background: linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c, #4facfe, #00f2fe);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -2;
        }
        
        .floating-orbs {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: -1;
          overflow: hidden;
        }
        
        .orb {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(45deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05));
          backdrop-filter: blur(20px);
          animation: float 20s infinite linear;
        }
        
        .orb:nth-child(1) { width: 80px; height: 80px; top: 20%; left: 10%; animation-delay: 0s; }
        .orb:nth-child(2) { width: 60px; height: 60px; top: 60%; left: 85%; animation-delay: -5s; }
        .orb:nth-child(3) { width: 100px; height: 100px; top: 80%; left: 20%; animation-delay: -10s; }
        .orb:nth-child(4) { width: 40px; height: 40px; top: 30%; left: 70%; animation-delay: -15s; }
        .orb:nth-child(5) { width: 120px; height: 120px; top: 10%; left: 50%; animation-delay: -7s; }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
          0% { transform: translateY(100vh) rotate(0deg); }
          100% { transform: translateY(-100px) rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }
        
        .glass-container {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 15px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        
        .glass-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        
        .neon-text {
          font-family: 'Orbitron', monospace;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.5),
                       0 0 20px rgba(255, 255, 255, 0.3),
                       0 0 30px rgba(255, 255, 255, 0.2);
        }
        
        .word-card {
          background: linear-gradient(145deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05));
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .word-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
        }
        
        .word-card:hover::before {
          left: 100%;
        }
        
        .word-card:hover {
          transform: translateY(-3px) rotateX(5deg);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }
        
        .slot-card {
          background: rgba(255, 255, 255, 0.05);
          border: 2px dashed rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .slot-card.filled {
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.5);
          animation: pulse 2s infinite;
        }
        
        .level-badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .level-badge.active {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          transform: scale(1.05);
          box-shadow: 0 5px 20px rgba(245, 87, 108, 0.4);
        }
        
        .class-badge {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .class-badge.active {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
          transform: scale(1.05);
          box-shadow: 0 5px 20px rgba(67, 233, 123, 0.4);
        }
        
        .check-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          font-weight: 600;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
        
        .check-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
        }
        
        .check-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
        }
        
        .check-button:hover::before {
          left: 100%;
        }
        
        .feedback-correct {
          background: linear-gradient(135deg, rgba(67, 233, 123, 0.2), rgba(56, 249, 215, 0.2));
          border: 2px solid rgba(67, 233, 123, 0.5);
          backdrop-filter: blur(15px);
          animation: pulse 2s infinite;
        }
        
        .feedback-incorrect {
          background: linear-gradient(135deg, rgba(245, 87, 108, 0.2), rgba(240, 147, 251, 0.2));
          border: 2px solid rgba(245, 87, 108, 0.5);
          backdrop-filter: blur(15px);
        }
        
        .pattern-display {
          background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 15px;
        }
      `}</style>
      
      {/* Animated Background */}
      <div className="animated-bg"></div>
      
      {/* Floating Orbs */}
      <div className="floating-orbs">
        <div className="orb"></div>
        <div className="orb"></div>
        <div className="orb"></div>
        <div className="orb"></div>
        <div className="orb"></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold text-white neon-text mb-4 font-orbitron">
            Grammar Pattern Detective
          </h1>
          <p className="text-xl text-white/80 font-light">
            Master the art of language patterns with style
          </p>
        </motion.div>
        
        {/* Class Selector */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-container p-6 mb-8"
        >
          <h3 className="text-2xl font-semibold text-white mb-4 neon-text">Choose Your Grade</h3>
          <div className="flex gap-4 flex-wrap">
            {Object.keys(grammarDatabase).map((classGroup, index) => (
              <motion.button
                key={classGroup}
                className={`class-badge px-6 py-3 rounded-full ${currentClass === classGroup ? 'active' : ''}`}
                onClick={() => setCurrentClass(classGroup)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {classGroup}
              </motion.button>
            ))}
          </div>
        </motion.div>
        
        {/* Level Selector */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass-container p-6 mb-8"
        >
          <h3 className="text-2xl font-semibold text-white mb-4 neon-text">Select Difficulty</h3>
          <div className="flex gap-3 flex-wrap">
            {Object.keys(grammarDatabase[currentClass]).map((level, index) => (
              <motion.button
                key={level}
                className={`level-badge px-5 py-2 rounded-full ${currentLevel === level ? 'active' : ''}`}
                onClick={() => setCurrentLevel(level)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {level}
              </motion.button>
            ))}
          </div>
        </motion.div>
        
        {/* Game Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="glass-container p-8"
        >
          {/* Pattern Info */}
          <div className="pattern-display p-6 mb-8">
            <motion.h2
              key={`${currentClass}-${currentLevel}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-white mb-3 neon-text"
            >
              {grammarDatabase[currentClass][currentLevel].title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-white/90 font-medium"
            >
              <span className="text-blue-300">Pattern:</span> {grammarDatabase[currentClass][currentLevel].pattern}
            </motion.p>
          </div>
          
          <AnimatePresence mode="wait">
            {!isAnimating && (
              <motion.div
                key={`${currentClass}-${currentLevel}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {/* Answer Slots */}
                <div className="mb-8">
                  <h4 className="text-xl text-white/90 font-semibold mb-4">Build Your Answer:</h4>
                  <div className="flex gap-4 flex-wrap justify-center">
                    {userAnswer.map((word, index) => (
                      <motion.div
                        key={index}
                        className={`slot-card ${word && word !== "___" ? 'filled' : ''} min-w-[120px] h-16 flex items-center justify-center cursor-pointer`}
                        onClick={() => word && word !== "___" && handleRemove(word, index)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        layout
                      >
                        <span className="text-white font-semibold text-lg">
                          {word && word !== "___" ? word : "Drop here"}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Word Pool */}
                <div className="mb-8">
                  <h4 className="text-xl text-white/90 font-semibold mb-4">Available Words:</h4>
                  <div ref={constraintsRef} className="flex gap-3 flex-wrap justify-center min-h-[80px] p-4 glass-card">
                    <AnimatePresence>
                      {sentenceParts.map((word, index) => (
                        <motion.div
                          key={`${word}-${index}`}
                          className="word-card px-6 py-3 cursor-grab active:cursor-grabbing"
                          drag
                          dragConstraints={constraintsRef}
                          dragElastic={0.2}
                          onDragEnd={(e, info) => {
                            const slotIndex = grammarDatabase[currentClass][currentLevel].examples[0].includes("→") ? 
                              (info.point.x > window.innerWidth / 2 ? 1 : 0) :
                              Math.max(0, Math.min(userAnswer.length - 1, Math.floor((info.point.x - 200) / 140)));
                            handleDrop(word, slotIndex);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileDrag={{ scale: 1.1, zIndex: 100 }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.3 }}
                          layout
                        >
                          <span className="text-white font-semibold text-lg relative z-10">
                            {word}
                          </span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
                
                {/* Check Button */}
                <div className="text-center">
                  <motion.button
                    onClick={checkAnswer}
                    className="check-button px-12 py-4 rounded-full text-xl font-bold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={userAnswer.some(slot => !slot || slot === "___")}
                  >
                    Analyze Pattern
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Feedback */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                className={`mt-8 p-6 rounded-xl ${feedback.isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`}
              >
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-2xl font-bold text-white mb-3 neon-text"
                >
                  {feedback.message}
                </motion.h3>
                {!feedback.isCorrect && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg text-white/90"
                  >
                    <span className="font-semibold">Correct Pattern:</span> {feedback.correctAnswer}
                  </motion.p>
                )}
                <motion.button
                  onClick={resetChallenge}
                  className="mt-4 px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full font-semibold transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Try New Pattern
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

// Helper function
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default GrammarPatternDetective;