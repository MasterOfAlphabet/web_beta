import React from "react";
import CARESForStudents from "../CARESForStudents";
import CARESCustomUI from "../CARESCustomUI";

// Example config (replace with your real questions/config!)
const spellingSkillsAssessmentData_I_II = {
  classGroup: "I-II",
  categories: [
    {
      name: "Dictation",
      description: "Listen to the word and type it correctly.",
      questions: [
        { id: 1, word: "apple", answer: "apple" },
        { id: 2, word: "pen", answer: "pen" },
        { id: 3, word: "cake", answer: "cake" },
        { id: 4, word: "fish", answer: "fish" },
      ],
    },
    {
      name: "Find the Correct Spelling (MCQ)",
      description: "Choose the correctly spelled word from four options.",
      questions: [
        {
          id: 5,
          question: "Which is the correct spelling?",
          options: ["hous", "hose", "house", "huse"],
          answer: "house",
        },
        {
          id: 6,
          question: "Which is the correct spelling?",
          options: ["flor", "flower", "floer", "flowr"],
          answer: "flower",
        },
      ],
    },
    {
      name: "Find the Missing Letter",
      description: "Fill in the missing letter to complete the word.",
      questions: [
        {
          id: 7,
          word: "c _ t",
          hint: "A pet that says meow.",
          answer: "cat",
        },
        {
          id: 8,
          word: "b _ _ l",
          hint: "You play with this.",
          answer: "ball",
        },
      ],
    },
    {
      name: "Spell the Pic",
      description: "Type the word that matches the picture shown.",
      questions: [
        { id: 9, image: "apple.jpg", answer: "apple" },
        { id: 10, image: "dog.jpg", answer: "dog" },
      ],
    },
  ],
};


export default function TestAssessment() {
  return (
    <CARESForStudents
      config={spellingSkillsAssessmentData_I_II}
      studentInfo={{
        name: "Alex Johnson",
        classLevel: "Class II",
        parentMobile: "+1-555-0123",
        city: "New York",
        school: "Sunshine Elementary",
      }}
      timer={{ seconds: 60 * 60, show: true }}
      AssessmentHeader={CARESCustomUI.AssessmentHeader}
      AssessmentProgress={CARESCustomUI.AssessmentProgress}
      AssessmentQuestionRenderer={CARESCustomUI.AssessmentQuestionRenderer}
      AssessmentNav={CARESCustomUI.AssessmentNav}
      AssessmentEncouragement={CARESCustomUI.AssessmentEncouragement}
    />
  );
}