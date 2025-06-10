import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Button, Paper, RadioGroup, FormControlLabel, Radio } from "@mui/material";

export default function ChallengeSubmissionPage() {
  const { type } = useParams();
  const { state } = useLocation();
  const student = state?.student;
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load sample questions for testing
  useEffect(() => {
    const loadQuestions = () => {
      if (type === "daily") {
        setQuestions([
          { id: "q1", text: "Spell the fruit 🍎", options: ["apple", "aple", "appel"], correct: "apple" },
          { id: "q2", text: "Spell the animal 🐯", options: ["tiger", "tigar", "tigger"], correct: "tiger" }
        ]);
      } else if (type === "weekly") {
        setQuestions([
          { id: "q1", text: "Weekly Challenge: Color of sky?", options: ["blue", "red", "green"], correct: "blue" }
        ]);
      }
      // Add more types as needed...
      setLoading(false);
    };
    loadQuestions();
  }, [type]);

  const handleAnswer = (qId, ans) => {
    setAnswers(prev => ({ ...prev, [qId]: ans }));
  };

  const handleSubmit = () => {
    console.log("Student:", student);
    console.log("Answers:", answers);

    // In real usage: save to Firestore here
    // For testing, just navigate to Thank You page
    navigate("/challenge/thank-you", { state: { student, score: 100 } });
  };

  if (loading) return <Typography>Loading...</Typography>;

  if (questions.length === 0) {
    return <Typography>Challenge not found.</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Challenge: {type.toUpperCase()}
      </Typography>
      {questions.map(q => (
        <Paper key={q.id} sx={{ p: 2, my: 2 }}>
          <Typography variant="subtitle1">{q.text}</Typography>
          <RadioGroup
            value={answers[q.id] || ""}
            onChange={(e) => handleAnswer(q.id, e.target.value)}
          >
            {q.options.map(opt => (
              <FormControlLabel key={opt} value={opt} control={<Radio />} label={opt} />
            ))}
          </RadioGroup>
        </Paper>
      ))}
      <Button variant="contained" onClick={handleSubmit}>Submit Answers</Button>
    </Box>
  );
}
