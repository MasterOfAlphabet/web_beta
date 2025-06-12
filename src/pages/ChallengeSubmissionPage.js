import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Paper, RadioGroup, FormControlLabel, Radio, Button, CircularProgress } from "@mui/material";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "../services/firebase";

const generateStudentId = () => {
  // Generate a unique ID using Firestore's built-in ID generator
  const tempDocRef = doc(firestore, "temp", "placeholder");
  return tempDocRef.id;
};

export default function ChallengeSubmissionPage() {
  const { type } = useParams();
  const { state } = useLocation();
  const student = state?.student;
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadQuestions = () => {
      if (type === "daily") {
        setQuestions([
          { id: "q1", text: "Spell the fruit 🍎", options: ["apple", "aple", "appel"] },
          { id: "q2", text: "Spell the animal 🐯", options: ["tiger", "tigar", "tigger"] }
        ]);
      }
      // Extend for other challenge types...
      setLoading(false);
    };
    loadQuestions();
  }, [type]);

  const handleAnswer = (qId, ans) => {
    setAnswers((prev) => ({ ...prev, [qId]: ans }));
  };

  const handleSubmit = async () => {
    const startTime = student.startTime || new Date().toISOString();
    const endTime = new Date().toISOString();
    const timeSpent = Math.floor((new Date(endTime) - new Date(startTime)) / 1000);

    const processedAnswers = questions.map((q) => ({
      questionId: q.id,
      selectedAnswer: answers[q.id] || ""
    }));

    const tempStudentId = generateStudentId();

    const submission = {

      studentId: student?.studentId || tempStudentId,
      answers: processedAnswers,
      score: 0,
      timestamp: serverTimestamp(),
      startTime,
      endTime,
      timeSpent,
      rank: 0,
      challengeRating: 0,
      challengeReview: "",
      submissionDevice: "web"
    };

    try {
      const submissionRef = doc(
        firestore,
        `challenge_submissions/${type}_20250610/submissions/${tempStudentId}`
      );
      await setDoc(submissionRef, submission);
      navigate("/challenge/thank-you", {
        state: {
          student,
          challenge: {
            challengeType: type,
            classGroup: student.classGroup,
            category: "Spelling"
          }
        }
      });
    } catch (error) {
      console.error("Error saving submission:", error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (questions.length === 0) {
    return <Typography>Challenge not found.</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Challenge: {type.toUpperCase()}
      </Typography>
      {questions.map((q) => (
        <Paper key={q.id} sx={{ p: 2, my: 2 }}>
          <Typography variant="subtitle1">{q.text}</Typography>
          <RadioGroup
            value={answers[q.id] || ""}
            onChange={(e) => handleAnswer(q.id, e.target.value)}
          >
            {q.options.map((opt) => (
              <FormControlLabel key={opt} value={opt} control={<Radio />} label={opt} />
            ))}
          </RadioGroup>
        </Paper>
      ))}
      <Button variant="contained" onClick={handleSubmit}>Submit Answers</Button>
    </Box>
  );
}
