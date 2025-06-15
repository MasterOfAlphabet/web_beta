import React, { useState, useEffect, useMemo } from 'react';
import {
  Gavel, CheckCircle, XCircle, RotateCcw, Lightbulb, ScrollText, ChevronRight, GraduationCap
} from "lucide-react";

// --- Mock Data: Punctuation Cases for Class III-V ---
const casesData = [
  {
    id: 'c1',
    sentence: ["The quick brown fox", "[PUNCTUATION_SLOT]", "jumped over the lazy dog", "[PUNCTUATION_SLOT]"],
    correctSequence: [".", "."], // Corresponds to the slots in `sentence`
    hint: "Think about the end of a simple statement. There's also one missing in the middle!",
    explanation: "A period ('.') is used to mark the end of a declarative sentence. In this case, the first slot actually needs a period because it ends a complete thought, and then the next part starts a new thought, which also needs a period at the end.",
    fullSentence: "The quick brown fox. Jumped over the lazy dog." // The "correct" full sentence for reference
  },
  {
    id: 'c2',
    sentence: ["Hello", "[PUNCTUATION_SLOT]", "how are you", "[PUNCTUATION_SLOT]"],
    correctSequence: [",", "?"],
    hint: "What do you put after a greeting? And what mark ends a question?",
    explanation: "Use a comma (',') after a greeting like 'Hello'. A question mark ('?') is used at the end of an interrogative sentence (a question).",
    fullSentence: "Hello, how are you?"
  },
  {
    id: 'c3',
    sentence: ["She bought apples", "[PUNCTUATION_SLOT]", "bananas", "[PUNCTUATION_SLOT]", "and oranges", "[PUNCTUATION_SLOT]"],
    correctSequence: [",", ",", "."],
    hint: "When listing items, what separates them? What goes at the very end?",
    explanation: "Use commas (',') to separate items in a list. The last item in a simple list with 'and' or 'or' usually does not have a comma before the 'and' (Oxford comma is optional but typically taught later). A period ('.') ends the sentence.",
    fullSentence: "She bought apples, apples, and oranges."
  },
  {
    id: 'c4',
    sentence: ["What a beautiful day", "[PUNCTUATION_SLOT]"],
    correctSequence: ["!"],
    hint: "This sentence expresses strong feeling or excitement.",
    explanation: "An exclamation mark ('!') is used at the end of an exclamatory sentence to show strong emotion.",
    fullSentence: "What a beautiful day!"
  },
  {
    id: 'c5',
    sentence: ["He asked", "[PUNCTUATION_SLOT]", "Are you coming", "[PUNCTUATION_SLOT]"],
    correctSequence: [",", "?"],
    hint: "This involves direct speech. What separates the speaker from the quote? What ends the question?",
    explanation: "Use a comma (',') before introducing direct speech. The punctuation for the quoted part (here, a question mark '?') goes inside the closing quotation mark.",
    fullSentence: "He asked, 'Are you coming?'"
  },
  {
    id: 'c6',
    sentence: ["The dog", "[PUNCTUATION_SLOT]", "a golden retriever", "[PUNCTUATION_SLOT]", "loves to play fetch", "[PUNCTUATION_SLOT]"],
    correctSequence: [",", ",", "."],
    hint: "Two commas can set off extra, non-essential information in the middle of a sentence.",
    explanation: "Commas (',') are used to set off a non-essential clause or phrase (like 'a golden retriever' here) that provides extra information but could be removed without changing the sentence's core meaning. A period ('.') ends the sentence.",
    fullSentence: "The dog, a golden retriever, loves to play fetch."
  },
  {
    id: 'c7',
    sentence: ["Lets go to the park", "[PUNCTUATION_SLOT]", "she said", "[PUNCTUATION_SLOT]"],
    correctSequence: ["!", "."],
    hint: "This is a command or strong suggestion. What goes inside the quote?",
    explanation: "An exclamation mark ('!') can be used inside quotation marks to show strong emotion or a command within direct speech. A period ('.') ends the sentence after the reporting clause.",
    fullSentence: "Let's go to the park!', she said."
  },
  {
    id: 'c8',
    sentence: ["The cat sat on the mat", "[PUNCTUATION_SLOT]", "and then it purred", "[PUNCTUATION_SLOT]"],
    correctSequence: [",", "."],
    hint: "What separates two independent clauses joined by 'and'?",
    explanation: "Use a comma (',') before a coordinating conjunction (like 'and', 'but', 'or') that joins two independent clauses (complete thoughts). A period ('.') ends the sentence.",
    fullSentence: "The cat sat on the mat, and then it purred."
  },
  {
    id: 'c9',
    sentence: ["Is that your book", "[PUNCTUATION_SLOT]"],
    correctSequence: ["?"],
    hint: "This sentence is asking for information.",
    explanation: "A question mark ('?') is used at the end of a direct question.",
    fullSentence: "Is that your book?"
  },
  {
    id: 'c10',
    sentence: ["Wow", "[PUNCTUATION_SLOT]", "that was amazing", "[PUNCTUATION_SLOT]"],
    correctSequence: ["!", "!"],
    hint: "Show strong emotion at the beginning and end!",
    explanation: "An exclamation mark ('!') can follow an interjection (like 'Wow') to show strong emotion. Another exclamation mark ends the exclamatory sentence.",
    fullSentence: "Wow! That was amazing!"
  }
];


const PunctuationPerfectionGame = () => {
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [userPunctuation, setUserPunctuation] = useState([]); // Array to hold user's chosen punctuation for each slot
  const [feedback, setFeedback] = useState(null); // 'correct', 'incorrect', 'game-complete'
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const currentCase = casesData[currentCaseIndex];
  const punctuationBank = useMemo(() => [".", ",", "?", "!", "'", '"'], []); // Fixed set of common punctuation

  // Initialize/reset game on component mount or case change
  useEffect(() => {
    if (currentCase) {
      // Initialize userPunctuation with empty strings for each slot
      const initialPunctuation = currentCase.sentence.filter(part => part === "[PUNCTUATION_SLOT]").map(() => '');
      setUserPunctuation(initialPunctuation);
      setFeedback(null);
      setShowExplanation(false);
    }
  }, [currentCaseIndex, currentCase]);

  // Handle placing punctuation into a slot
  const handlePunctuationPlacement = (slotIndex, punctuationMark) => {
    if (feedback === 'correct' || feedback === 'game-complete') return; // Prevent changes after correct or game over

    setUserPunctuation(prev => {
      const newState = [...prev];
      newState[slotIndex] = punctuationMark;
      return newState;
    });
    setFeedback(null); // Clear feedback on any interaction
  };

  // Handle removing punctuation from a slot
  const handleRemovePunctuation = (slotIndex) => {
    if (feedback === 'correct' || feedback === 'game-complete') return; // Prevent changes after correct or game over

    setUserPunctuation(prev => {
      const newState = [...prev];
      newState[slotIndex] = '';
      return newState;
    });
    setFeedback(null);
  };


  // Check the user's punctuation against the correct sequence
  const checkCase = () => {
    let allCorrect = true;
    for (let i = 0; i < currentCase.correctSequence.length; i++) {
      if (userPunctuation[i] !== currentCase.correctSequence[i]) {
        allCorrect = false;
        break;
      }
    }

    if (allCorrect) {
      setFeedback('correct');
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      setFeedback('incorrect');
      setStreak(0); // Break streak on incorrect
    }
  };

  // Move to the next case
  const handleNextCase = () => {
    if (currentCaseIndex < casesData.length - 1) {
      setCurrentCaseIndex(prev => prev + 1);
    } else {
      setFeedback('game-complete'); // All cases completed
    }
  };

  // Reset the current case
  const resetCase = () => {
    const initialPunctuation = currentCase.sentence.filter(part => part === "[PUNCTUATION_SLOT]").map(() => '');
    setUserPunctuation(initialPunctuation);
    setFeedback(null);
    setShowExplanation(false);
  };

  const isGameComplete = feedback === 'game-complete';

  // Render the sentence with interactive slots
  const renderSentence = () => {
    let slotCount = -1; // Use -1 to correctly index into userPunctuation array
    return currentCase.sentence.map((part, index) => {
      if (part === "[PUNCTUATION_SLOT]") {
        slotCount++;
        const currentPunctuation = userPunctuation[slotCount];
        const isCorrectSlot = feedback === 'correct' || (feedback === 'incorrect' && currentPunctuation === currentCase.correctSequence[slotCount]);
        const isIncorrectSlot = feedback === 'incorrect' && currentPunctuation !== currentCase.correctSequence[slotCount];

        return (
          <span key={`slot-${index}`} className="relative group">
            <button
              onClick={() => handleRemovePunctuation(slotCount)}
              className={`min-w-[40px] h-12 border-2 rounded-lg text-xl font-bold flex items-center justify-center
                transition-all duration-200 ease-in-out px-1
                ${isCorrectSlot ? 'border-green-500 bg-green-100 text-green-800' :
                  isIncorrectSlot ? 'border-red-500 bg-red-100 text-red-800' :
                  'border-gray-400 bg-gray-100 hover:border-blue-500 hover:bg-blue-50 text-gray-700'
                }
                ${feedback === 'correct' || feedback === 'game-complete' ? 'cursor-not-allowed' : ''}
              `}
              disabled={feedback === 'correct' || feedback === 'game-complete'}
            >
              {currentPunctuation || <span className="text-gray-500 text-sm">_</span>}
            </button>
            {isIncorrectSlot && (
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-red-600 font-semibold whitespace-nowrap">
                Needs: {currentCase.correctSequence[slotCount]}
              </span>
            )}
          </span>
        );
      } else {
        return (
          <span key={`text-${index}`} className="text-2xl">
            {part}
          </span>
        );
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 p-6 flex flex-col items-center justify-center font-inter text-gray-100">
      <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-3xl shadow-2xl p-8 max-w-4xl w-full border border-gray-600">
        <h1 className="text-4xl font-extrabold text-center text-yellow-300 mb-6 flex items-center justify-center">
          <Gavel className="w-10 h-10 text-yellow-400 mr-3 animate-pulse-slow" /> Punctuation Detective
        </h1>

        <div className="flex justify-between items-center mb-6 text-gray-300 font-semibold text-lg">
          <span>Case: {currentCaseIndex + 1} / {casesData.length}</span>
          <span>Score: {score}</span>
          <span>Streak: {streak} 🔥</span>
        </div>

        {isGameComplete ? (
          <div className="text-center p-8 bg-green-800 rounded-xl border border-green-600 shadow-md">
            <h2 className="text-3xl font-bold text-green-300 mb-4 animate-bounce-subtle">
              🎉 Mission Accomplished! You are a Punctuation Master! 🎉
            </h2>
            <p className="text-xl font-medium text-gray-200 mb-6">
              You've successfully solved all the cases!
            </p>
            <button
              onClick={() => {
                setCurrentCaseIndex(0);
                setScore(0);
                setStreak(0);
                setFeedback(null);
              }}
              className="mt-8 px-8 py-3 bg-purple-600 text-white font-bold rounded-full shadow-lg hover:bg-purple-700 transition-transform transform hover:scale-105 active:scale-95"
            >
              Start New Investigation
            </button>
          </div>
        ) : (
          <>
            {/* Case / Sentence Area */}
            <div className="min-h-[160px] bg-gray-900 p-6 rounded-xl border-2 border-yellow-500 border-dashed flex flex-wrap gap-2 items-center justify-center mb-6 shadow-inner relative">
              <p className="text-yellow-300 text-lg absolute top-3 left-4 font-mono">CASE FILE:</p>
              <div className="flex flex-wrap gap-1 items-center justify-center w-full mt-6">
                {renderSentence()}
              </div>
            </div>

            {/* Punctuation Bank */}
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-600 shadow-md mb-6">
              <h4 className="text-xl font-semibold text-gray-200 mb-3 flex items-center">
                <ScrollText className="w-6 h-6 text-gray-400 mr-2" /> Punctuation Arsenal:
              </h4>
              <div className="flex flex-wrap gap-3 items-center justify-center min-h-[80px]">
                {punctuationBank.map((mark, idx) => (
                  <button
                    key={`p-mark-${idx}`}
                    onClick={() => {
                      // Find first empty slot and place the punctuation
                      const firstEmptySlotIndex = userPunctuation.findIndex(p => p === '');
                      if (firstEmptySlotIndex !== -1) {
                        handlePunctuationPlacement(firstEmptySlotIndex, mark);
                      }
                    }}
                    className={`w-14 h-14 rounded-full text-3xl font-extrabold shadow-lg
                      transition-all duration-200 ease-in-out transform hover:scale-110 active:scale-90
                      ${feedback === 'correct' || feedback === 'game-complete' ? 'opacity-50 cursor-not-allowed' : ''}
                      ${mark === '.' ? 'bg-blue-600 hover:bg-blue-700' :
                        mark === ',' ? 'bg-green-600 hover:bg-green-700' :
                        mark === '?' ? 'bg-yellow-600 hover:bg-yellow-700' :
                        mark === '!' ? 'bg-red-600 hover:bg-red-700' :
                        'bg-gray-500 hover:bg-gray-600'} text-white
                    `}
                    disabled={feedback === 'correct' || feedback === 'game-complete'}
                  >
                    {mark}
                  </button>
                ))}
              </div>
            </div>

            {/* Controls and Feedback */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
              <button
                onClick={checkCase}
                disabled={userPunctuation.includes('') || feedback === 'correct'} // Disable if not all slots filled or already correct
                className={`px-6 py-3 font-bold rounded-full shadow-md transition-transform transform hover:scale-105 active:scale-95
                  ${userPunctuation.includes('') || feedback === 'correct'
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
              >
                <CheckCircle className="inline-block w-5 h-5 mr-2" /> Check Solution
              </button>
              <button
                onClick={resetCase}
                disabled={userPunctuation.every(p => p === '') || feedback === 'correct'}
                className={`px-6 py-3 font-bold rounded-full shadow-md transition-transform transform hover:scale-105 active:scale-95
                  ${userPunctuation.every(p => p === '') || feedback === 'correct'
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-yellow-600 text-gray-900 hover:bg-yellow-700'
                  }`}
              >
                <RotateCcw className="inline-block w-5 h-5 mr-2" /> Reset Case
              </button>
            </div>

            <div className="text-center mb-6 min-h-[60px]">
              {feedback === 'correct' && (
                <div className="text-green-400 text-xl font-bold flex flex-col items-center justify-center animate-fade-in p-4 bg-green-900 rounded-lg shadow-lg border border-green-700">
                  <CheckCircle className="w-8 h-8 mr-2 text-green-300" />
                  <p className="mt-2">Excellent Work, Detective!</p>
                  <button
                    onClick={handleNextCase}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full text-base font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Next Case <ChevronRight className="inline-block w-4 h-4 ml-1" />
                  </button>
                </div>
              )}
              {feedback === 'incorrect' && (
                <div className="text-red-400 text-xl font-bold flex flex-col items-center justify-center animate-shake p-4 bg-red-900 rounded-lg shadow-lg border border-red-700">
                  <XCircle className="w-8 h-8 mr-2 text-red-300" />
                  <p className="mt-2">Investigation Required! Review the clues.</p>
                  <button
                    onClick={() => setShowExplanation(true)}
                    className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-full text-base font-semibold hover:bg-purple-700 transition-colors"
                  >
                    <GraduationCap className="inline-block w-5 h-5 mr-2" /> Show Rule
                  </button>
                </div>
              )}
            </div>

            {/* Hint and Explanation Area */}
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-600 shadow-sm text-center">
              <button
                onClick={() => setShowExplanation(prev => !prev)}
                className="text-blue-400 font-semibold hover:underline flex items-center justify-center mx-auto"
              >
                <Lightbulb className="w-5 h-5 mr-2 text-blue-300" /> {showExplanation ? 'Hide Explanation' : 'Reveal Explanation'}
              </button>
              {showExplanation && (
                <div className="mt-4 text-gray-200 text-base italic animate-fade-in-down text-left p-3 bg-gray-700 rounded-lg border border-gray-600">
                  <p><span className="font-bold text-yellow-300">Hint:</span> {currentCase.hint}</p>
                  <p className="mt-2"><span className="font-bold text-yellow-300">Rule:</span> {currentCase.explanation}</p>
                  <p className="mt-2"><span className="font-bold text-yellow-300">Correct Sentence:</span> <span className="text-green-300">{currentCase.fullSentence}</span></p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        .animate-fade-in-down { animation: fade-in-down 0.5s ease-out forwards; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .animate-bounce-subtle { animation: bounce-subtle 1s infinite alternate; }
        .animate-pulse-slow { animation: pulse-slow 2s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default PunctuationPerfectionGame;
