import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Grid,
  Button,
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CampaignIcon from "@mui/icons-material/Campaign";
import ChecklistIcon from "@mui/icons-material/Checklist";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import BoltIcon from "@mui/icons-material/Bolt";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import SchoolIcon from "@mui/icons-material/School";
import TodayIcon from "@mui/icons-material/Today";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";

const skillTips = [
  {
    module: "Spelling",
    tip: "Break long words into smaller parts to spell them easily.",
    icon: <EmojiObjectsIcon color="primary" />,
  },
  {
    module: "Reading",
    tip: "Underline unfamiliar words and look them up after reading.",
    icon: <TodayIcon color="success" />,
  },
  {
    module: "Pronunciation",
    tip: "Practice tongue twisters to improve your pronunciation.",
    icon: <BoltIcon color="secondary" />,
  },
  {
    module: "Grammar",
    tip: "Remember: 'a' before consonant sounds, 'an' before vowel sounds.",
    icon: <EmojiObjectsIcon color="secondary" />,
  },
  {
    module: "Writing",
    tip: "Start your essay with a strong opening sentence.",
    icon: <SchoolIcon color="primary" />,
  },
  {
    module: "Listening",
    tip: "Listen for key words to understand the main idea.",
    icon: <BoltIcon color="warning" />,
  },
  {
    module: "Vocabulary",
    tip: "Use new words in sentences to remember them better.",
    icon: <EmojiObjectsIcon color="success" />,
  },
  {
    module: "S.H.A.R.P",
    tip: "Homonyms are words that sound alike but have different meanings.",
    icon: <BoltIcon color="info" />,
  },
];

const tasks = [
  { text: "Take a Spelling Test", done: false },
  { text: "Practice Reading Skills", done: false },
  { text: "Complete today's Word of the Day", done: true },
];

const announcements = [
  {
    title: "June Challenge Winners!",
    text: "Congratulations to Aanya, Veer, and Riya for topping our June Spelling Challenge!",
    icon: <EmojiEventsIcon color="warning" />,
    date: "2025-06-05",
  },
  {
    title: "S.H.A.R.P. Challenge Announced!",
    text: "Participate now to win exciting prizes!",
    icon: <CampaignIcon color="primary" />,
    date: "2025-06-07",
  },
];

const updates = [
  {
    text: "10 new Grammar Test questions added for Class VI-X.",
    date: "2025-06-06",
  },
  {
    text: "Word of the Day: 'Serendipity' - the occurrence of happy events by chance.",
    date: "2025-06-07",
  },
  {
    text: "New Listening Practice set for Class III-V.",
    date: "2025-06-04",
  },
];

export default function HomePage() {
  const [tipIndex, setTipIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const now = new Date();
    setTipIndex(now.getDate() % skillTips.length);
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f6f8fc",
        py: { xs: 2, md: 5 },
        px: { xs: 1, md: 3 },
      }}
    >
      <Box sx={{ maxWidth: 1100, mx: "auto" }}>
        {/* Hero Section */}
        <Box
          sx={{
            mb: 4,
            p: { xs: 3, md: 6 },
            borderRadius: 4,
            textAlign: "center",
            bgcolor: "linear-gradient(135deg, #1976d2 0%, #2196f3 100%)",
            color: "#fff",
          }}
        >
          <Typography variant="h3" fontWeight={800} gutterBottom sx={{ textShadow: "1px 1px 3px rgba(0,0,0,0.3)" }}>
            Welcome to the Master of Alphabet Competition
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: 700, mx: "auto", opacity: 0.9 }}>
            Hone your English skills across spelling, grammar, pronunciation and more—every day is a new opportunity to shine!
          </Typography>
          <Button
            variant="contained"
            size="large"
            color="warning"
            sx={{ mt: 3, borderRadius: 3, fontWeight: 700, px: 5 }}
            onClick={() => navigate("/daily-challenge")}
          >
            Join Today’s Challenge
          </Button>
        </Box>

        <Grid container spacing={4}>
          {/* Skill Spotlight */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={4}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 4,
                bgcolor: "#f2f7ff",
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              <TipsAndUpdatesIcon sx={{ fontSize: 48, color: "#ffb300" }} />
              <Box>
                <Typography variant="h5" fontWeight={800} color="primary" mb={0.5}>
                  Skill Spotlight
                </Typography>
                <Typography fontSize={17} color="text.secondary">
                  <b>{skillTips[tipIndex].module}:</b> {skillTips[tipIndex].tip}
                </Typography>
              </Box>
            </Paper>

            {/* Skills Assessment CTA */}
            <Paper
              elevation={3}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 4,
                bgcolor: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="h6" fontWeight={900} color="primary">
                  Skills Assessment
                </Typography>
                <Typography color="text.secondary" fontSize={15}>
                  Track your progress and unlock new levels—start your assessment now!
                </Typography>
              </Box>
              <Button
                size="large"
                variant="contained"
                color="primary"
                sx={{ borderRadius: 3, fontWeight: 700, px: 5 }}
                onClick={() => navigate("/skill-assessment/hub")}
              >
                Start Assessment
              </Button>
            </Paper>

            {/* Tasks */}
            <Paper
              elevation={3}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 4,
                bgcolor: "#fffde7",
                minHeight: 130,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <ChecklistIcon color="warning" />
                <Typography variant="h6" fontWeight={800} color="warning.dark">
                  Things to Do
                </Typography>
              </Stack>
              <Stack spacing={1}>
                {tasks.map((task, i) => (
                  <Stack direction="row" alignItems="center" key={i} spacing={1}>
                    <Chip
                      size="small"
                      color={task.done ? "success" : "default"}
                      icon={task.done ? <StarIcon /> : null}
                      label={task.done ? "Done" : ""}
                    />
                    <Typography
                      sx={{
                        textDecoration: task.done ? "line-through" : "none",
                        color: task.done ? "#aaa" : "#222",
                        fontWeight: 600,
                      }}
                    >
                      {task.text}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* Announcements and Updates */}
          <Grid item xs={12} md={4}>
            {/* Announcements */}
            <Paper
              elevation={3}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 4,
                bgcolor: "#e3f2fd",
                minHeight: 170,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <CampaignIcon color="primary" />
                <Typography variant="h6" fontWeight={800} color="primary">
                  Announcements
                </Typography>
              </Stack>
              {announcements.map((a, idx) => (
                <Card
                  elevation={0}
                  key={idx}
                  sx={{
                    mb: 1,
                    bgcolor: "#f8fbff",
                    borderRadius: 3,
                  }}
                >
                  <CardContent sx={{ py: 1.5 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      {a.icon}
                      <Typography fontWeight={700}>{a.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {a.date}
                      </Typography>
                    </Stack>
                    <Typography fontSize={15} color="text.secondary" mt={0.4}>
                      {a.text}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Paper>

            {/* Updates */}
            <Paper
              elevation={3}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 4,
                bgcolor: "#f1f8e9",
                minHeight: 170,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <BoltIcon color="success" />
                <Typography variant="h6" fontWeight={800} color="success.dark">
                  Updates
                </Typography>
              </Stack>
              {updates.map((u, i) => (
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  key={i}
                  mb={1}
                >
                  <Avatar sx={{ width: 28, height: 28, fontSize: 17, bgcolor: "#fff" }}>
                    <TodayIcon color="success" fontSize="small" />
                  </Avatar>
                  <Box>
                    <Typography fontSize={15} color="success.dark">
                      {u.text}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {u.date}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
