import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog } from "@headlessui/react";
import { InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function UltimateAssessmentCard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Main Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto mt-16 bg-gradient-to-br from-purple-50 via-indigo-50 to-white border-2 border-indigo-500/30 rounded-3xl shadow-lg p-6 md:p-10 relative"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-indigo-700">
            🌟 8-In-1 Ultimate English Skills Assessment
          </h2>
          <button onClick={() => setIsOpen(true)} className="text-indigo-500 hover:text-indigo-700">
            <InformationCircleIcon className="w-6 h-6" />
          </button>
        </div>

        <p className="text-gray-700 text-md md:text-lg mb-6">
          A single, powerful test combining <strong>all 8 modules</strong>: Spelling, Reading,
          Pronunciation, Grammar, Writing, Listening, Vocabulary & SHARP. Evaluate your complete
          English proficiency in one go!
        </p>

        <div className="flex justify-center">
          <button
            onClick={() => window.location.href = "/skill-assessment/8-in-1"}
            className="relative inline-flex items-center px-8 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-xl shadow-xl transition-transform transform hover:scale-105 hover:bg-indigo-700"
          >
            🚀 Take the Ultimate Assessment
          </button>
        </div>
      </motion.div>

      {/* Modal Popup */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white max-w-md mx-auto rounded-2xl shadow-2xl p-6 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            <Dialog.Title className="text-2xl font-bold text-indigo-700 mb-4">
              📘 What’s Inside the 8-in-1?
            </Dialog.Title>

            <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
              <li>Spelling Challenge (Dictation, Unscramble, Missing Letters)</li>
              <li>Reading Fluency & Comprehension</li>
              <li>Pronunciation Accuracy & Fluency</li>
              <li>Grammar MCQs (Tenses, Articles, Sentence Formation)</li>
              <li>Writing Skills (Picture Prompts, Story Continuation)</li>
              <li>Listening Tasks (Dictation, Audio Matching)</li>
              <li>Vocabulary Games (Synonyms, Antonyms, Fillers)</li>
              <li>SHARP – Synonyms, Homonyms, Antonyms, Rhyming & Plurals</li>
            </ul>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
              >
                Got it!
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
