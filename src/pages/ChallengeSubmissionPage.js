import React, { useState } from "react";
import {
  Box, Card, CardContent, Typography, Button, TextField, Chip, Stack, Fade, CircularProgress
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import CelebrationIcon from "@mui/icons-material/Celebration";
import { useParams } from "react-router-dom";

const challengePromptsByGroup = [
  {
    prompt: "Spell the word for: To provide with something desired or needed.",
    label: "Your Answer",
  },
  {
    prompt: "Spell the word for: A person who starts a business and is willing to risk loss in order to make money.",
    label: "Your Answer",
  },
  {
    prompt: "Spell the word for: Wishing to do what is right, especially to do one's work well and thoroughly.",
    label: "Your Answer",
  },
];

export default function ChallengeSubmissionPage() {
  const { groupId } = useParams();
  const groupIdx = Number(groupId) - 1;
  const challengeMeta = challengePromptsByGroup[groupIdx] || challengePromptsByGroup[0];

  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const timeTillResults = "18h 22m"; // Replace with real countdown

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    // TODO: Send to backend
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setAnswer("");
    }, 1200);
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", py: 6 }}>
      <Card sx={{ maxWidth: 510, mx: "auto", boxShadow: 10, borderRadius: 5 }}>
        <CardContent>
          {!submitted ? (
            <form onSubmit={handleSubmit} autoComplete="off">
              <Stack spacing={3}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <EmojiEventsIcon color="primary" />
                  <Typography variant="h5" fontWeight={800}>
                    Weekly Challenge Submission
                  </Typography>
                  <Chip label="Weekly" color="primary" size="small" sx={{ ml: 1 }} />
                </Stack>
                <Typography variant="body1" fontWeight={500} color="text.secondary">
                  {challengeMeta.prompt}
                </Typography>
                <TextField
                  label={challengeMeta.label}
                  fullWidth
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  disabled={submitting}
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={submitting || !answer.trim()}
                  endIcon={submitting ? <CircularProgress size={22} /> : <EmojiEventsIcon />}
                  sx={{ fontWeight: 700, fontSize: 18, px: 5, borderRadius: 3 }}
                >
                  {submitting ? "Submitting..." : "Submit"}
                </Button>
                <Typography variant="caption" color="text.secondary" align="center">
                  (You can only submit once per challenge. Answers are locked until results.)
                </Typography>
              </Stack>
            </form>
          ) : (
            <Fade in timeout={500}>
              <Stack spacing={3} alignItems="center" py={2}>
                <CelebrationIcon color="success" sx={{ fontSize: 60 }} />
                <Typography variant="h5" fontWeight={800} color="success.main">
                  Thank you for your submission!
                </Typography>
                <Typography variant="body1" align="center" color="text.secondary">
                  Winners will be announced in <b>{timeTillResults}</b>.<br />
                  Please check back soon to see if you’re a winner!
                </Typography>
                <HourglassBottomIcon color="warning" sx={{ fontSize: 40 }} />
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  sx={{ mt: 2, fontWeight: 700, px: 5, borderRadius: 3 }}
                  href="/challenges"
                >
                  Back to Challenges
                </Button>
              </Stack>
            </Fade>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}