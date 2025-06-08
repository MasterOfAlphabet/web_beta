import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Divider,
  Stack,
  Fade,
  useTheme,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useParams, useNavigate } from "react-router-dom";

// Dummy challenge meta for demonstration (replace with real data/fetch logic)
const challengeMetaByGroup = [
  {
    type: "Weekly",
    title: "Weekly Challenge",
    description:
      "Test your spelling superpowers! Complete this week's challenge and compete for top ranks and exciting prizes.",
    numQuestions: 10,
    timeLimit: "10 min",
    points: 100,
    badge: "Weekly Winner",
    streak: 3,
    leaderboardTop: [
      { name: "Anika", points: 97 },
      { name: "Rohan", points: 93 },
      { name: "Fatima", points: 91 },
    ],
  },
  {
    type: "Weekly",
    title: "Weekly Challenge",
    description:
      "Spell your way to glory! Take on your group, climb the leaderboard, and win rewards.",
    numQuestions: 12,
    timeLimit: "12 min",
    points: 120,
    badge: "Weekly Winner",
    streak: 1,
    leaderboardTop: [
      { name: "Ishaan", points: 110 },
      { name: "Kavya", points: 104 },
      { name: "Mira", points: 102 },
    ],
  },
  {
    type: "Weekly",
    title: "Weekly Challenge",
    description:
      "Are you the best speller in your group? Accept the challenge and prove it!",
    numQuestions: 15,
    timeLimit: "15 min",
    points: 150,
    badge: "Weekly Winner",
    streak: 4,
    leaderboardTop: [
      { name: "Aarav", points: 145 },
      { name: "Zara", points: 139 },
      { name: "Sahil", points: 137 },
    ],
  },
];

function ChallengeIntroCard({
  type = "Daily",
  title,
  description,
  numQuestions,
  timeLimit,
  points,
  badge,
  streak,
  leaderboardTop,
  onStart,
}) {
  const theme = useTheme();
  const typeDetails = {
    Daily: { color: "success", icon: <CalendarTodayIcon /> },
    Weekly: { color: "primary", icon: <EmojiEventsIcon /> },
    Monthly: { color: "warning", icon: <StarOutlineIcon /> },
  };
  const { color, icon } = typeDetails[type] || typeDetails.Daily;

  return (
    <Fade in timeout={600}>
      <Card
        sx={{
          maxWidth: 500,
          mx: "auto",
          mt: { xs: 3, sm: 7 },
          boxShadow: 12,
          borderRadius: 5,
          p: { xs: 1.5, sm: 2.5 },
          position: "relative",
        }}
      >
        <CardContent>
          <Stack direction="row" alignItems="center" gap={1} mb={1}>
            {icon}
            <Typography
              variant="h5"
              color={`${color}.main`}
              sx={{ fontWeight: 800, letterSpacing: -1, flexGrow: 1 }}
            >
              {title || `${type} Challenge`}
            </Typography>
            <Chip
              label={type}
              color={color}
              size="small"
              sx={{ fontWeight: 700, letterSpacing: 1 }}
            />
          </Stack>
          <Typography variant="body1" sx={{ mb: 1.5, fontSize: 17 }}>
            {description}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Chip
              icon={<HourglassTopIcon />}
              label={`Time: ${timeLimit}`}
              color="info"
              variant="outlined"
              sx={{ fontWeight: 700, fontSize: 14 }}
            />
            <Chip
              icon={<TrendingUpIcon />}
              label={`Questions: ${numQuestions}`}
              color="secondary"
              variant="outlined"
              sx={{ fontWeight: 700, fontSize: 14 }}
            />
            <Chip
              icon={<EmojiEventsIcon />}
              label={`+${points} pts`}
              color={color}
              sx={{ fontWeight: 700, fontSize: 14 }}
            />
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <Chip
              icon={<StarOutlineIcon />}
              label={`Earn: ${badge}`}
              color="warning"
              variant="outlined"
              sx={{ fontWeight: 700, fontSize: 14 }}
            />
            <Chip
              label={`Streak: ${streak}🔥`}
              color="success"
              variant="outlined"
              sx={{ fontWeight: 700, fontSize: 14 }}
            />
          </Stack>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.secondary", mb: 1 }}>
              🏆 Top This Week:
            </Typography>
            <Stack direction="row" spacing={2}>
              {leaderboardTop.map((entry, idx) => (
                <Chip
                  key={entry.name}
                  label={`${idx + 1}. ${entry.name} (${entry.points})`}
                  color={["gold", "silver", "bronze"][idx] || "default"}
                  sx={{
                    bgcolor:
                      idx === 0
                        ? "#fffde7"
                        : idx === 1
                        ? "#eceff1"
                        : idx === 2
                        ? "#ffe0b2"
                        : undefined,
                    color: "#222",
                    fontWeight: 700,
                  }}
                />
              ))}
            </Stack>
          </Box>
          <Button
            variant="contained"
            color={color}
            size="large"
            fullWidth
            endIcon={<ArrowForwardIosIcon />}
            sx={{
              fontWeight: 800,
              fontSize: 18,
              py: 1.5,
              mt: 2,
              letterSpacing: 1,
              borderRadius: 3,
            }}
            onClick={onStart}
            data-testid="start-challenge-btn"
          >
            Start Challenge
          </Button>
        </CardContent>
      </Card>
    </Fade>
  );
}

export default function ChallengeAttemptPage() {
  const { groupId } = useParams(); // 1-based index from route: /challenge/:groupId
  const navigate = useNavigate();
  const groupIdx = Number(groupId) - 1;

  // Fallback to first group if invalid
  const challengeMeta = challengeMetaByGroup[groupIdx] || challengeMetaByGroup[0];

  const [started, setStarted] = useState(false);

  function handleStart() {
    setStarted(true);
    // Navigate to the actual challenge/submit page for this group
    // You might want to replace this with your submit route, e.g.:
    // navigate(`/challenge/${groupId}/submit`);
    setTimeout(() => {
      navigate(`/challenge/${groupId}/submit`);
    }, 600);
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f6f8fc", pb: 8 }}>
      {!started ? (
        <ChallengeIntroCard
          {...challengeMeta}
          onStart={handleStart}
        />
      ) : (
        <Fade in timeout={600}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "60vh",
              flexDirection: "column",
              mt: 8,
            }}
          >
            <Typography variant="h3" color="primary" fontWeight={800} mb={2}>
              Good Luck! 🍀
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Your challenge is starting...
            </Typography>
          </Box>
        </Fade>
      )}
    </Box>
  );
}