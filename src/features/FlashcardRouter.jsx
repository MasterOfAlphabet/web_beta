import React from 'react';
import { useParams } from 'react-router-dom';
import FlashcardSpacedRepetition from './FlashcardSpacedRepetition';

const moduleData = {
  vocabulary: [
    {
      id: 1,
      word: "ephemeral",
      partOfSpeech: "adjective",
      pronunciation: "ih-FEM-er-uhl",
      meaning: "lasting for a very short time",
      sentence: "The beauty of cherry blossoms is ephemeral.",
      synonyms: "temporary, fleeting, brief",
      difficulty: 1,
      easeFactor: 2.5,
      interval: 1,
      correctCount: 0,
      incorrectCount: 0,
      lastReviewed: null,
      nextReview: null,
    },
    {
      id: 2,
      word: "ubiquitous",
      partOfSpeech: "adjective",
      pronunciation: "yoo-BIK-wi-tuhs",
      meaning: "present or existing everywhere",
      sentence: "Smartphones are now ubiquitous.",
      synonyms: "pervasive, universal, omnipresent",
      difficulty: 2,
      easeFactor: 2.5,
      interval: 1,
      correctCount: 0,
      incorrectCount: 0,
      lastReviewed: null,
      nextReview: null,
    },
    // Add more...
  ],

  grammar: [
    {
      id: 101,
      word: "subject-verb agreement",
      partOfSpeech: "rule",
      pronunciation: "n/a",
      meaning: "Ensuring the subject and verb agree in number",
      sentence: "He runs, not he run.",
      synonyms: "grammar rule",
      difficulty: 1,
      easeFactor: 2.5,
      interval: 1,
      correctCount: 0,
      incorrectCount: 0,
      lastReviewed: null,
      nextReview: null,
    },
    // Add more...
  ],

  pronunciation: [
    {
      id: 201,
      word: "schedule",
      partOfSpeech: "noun/verb",
      pronunciation: "sked-jool (US), shed-yool (UK)",
      meaning: "A plan of things to be done",
      sentence: "I checked my schedule before accepting the meeting.",
      synonyms: "timetable, agenda",
      difficulty: 2,
      easeFactor: 2.5,
      interval: 1,
      correctCount: 0,
      incorrectCount: 0,
      lastReviewed: null,
      nextReview: null,
    },
    // Add more...
  ]
};

export default function FlashcardRouter() {
  const { moduleId } = useParams();
  const words = moduleData[moduleId];

  if (!words) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">❌ Module Not Found</h1>
        <p className="text-gray-600">We couldn't find the module <strong>{moduleId}</strong>.</p>
        <a href="/dashboard" className="mt-6 inline-block text-blue-600 underline hover:text-blue-800">
          ← Back to Dashboard
        </a>
      </div>
    );
  }

  return <FlashcardSpacedRepetition words={words} />;
}
