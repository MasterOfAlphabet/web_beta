import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Rating, Button, Paper, Stack, Chip } from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../services/firebase";

export default function ThankYouPage() {
  const { state } = useLocation();
  const { student, challenge } = state || {};
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const navigate = useNavigate();

  const reviewOptions = ["Easy", "Just Right", "Challenging", "Fun", "Loved it!"];

  const handleReviewSelect = (option) => {
    setReview(option);
  };

  const handleFeedbackSubmit = async () => {
    const submissionRef = doc(
      firestore,
      `challenge_submissions/${challenge.challengeType}_20250610/submissions/${student.studentId}`
    );
    await updateDoc(submissionRef, {
      challengeRating: rating,
      challengeReview: review
    });
    navigate("/"); // Back to homepage
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f0f4f8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2
      }}
    >
      <Paper
        elevation={4}
        sx={{
          maxWidth: 500,
          width: "100%",
          p: 4,
          borderRadius: 4,
          bgcolor: "#fff",
          textAlign: "center"
        }}
      >
        <Typography variant="h4" fontWeight={800} gutterBottom>
          🎉 Thank you, {student?.studentName || "Student"}!
        </Typography>
        <Typography fontSize={16} color="text.secondary" mb={3}>
          Your answer for the <strong>{challenge?.category}</strong> challenge ({challenge?.classGroup}) has been submitted.
          <br />
          Winners will be announced soon.
          <br />
          <strong>Invite your friends to compete and win!</strong>
        </Typography>

        {/* Rating and Review block */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: "#f9fafc",
            mb: 2
          }}
        >
          <Typography variant="h6" fontWeight={700} gutterBottom color="primary.main">
            ⭐ Rating and Review
          </Typography>

          <Stack alignItems="center" mb={2}>
            <Rating
              value={rating}
              onChange={(e, newValue) => setRating(newValue)}
              size="large"
              sx={{ fontSize: 40 }}
            />
          </Stack>

          <Typography fontSize={14} color="text.secondary" mb={1}>
            How did you find this challenge?
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1} justifyContent="center">
            {reviewOptions.map((opt) => (
              <Chip
                key={opt}
                label={opt}
                clickable
                color={review === opt ? "primary" : "default"}
                onClick={() => handleReviewSelect(opt)}
              />
            ))}
          </Stack>
        </Paper>

        <Button
          variant="contained"
          color="success"
          sx={{ mt: 2, borderRadius: 3, fontWeight: 700 }}
          disabled={rating === 0 || review === ""}
          onClick={handleFeedbackSubmit}
        >
          Submit Feedback
        </Button>
      </Paper>
    </Box>
  );
}
