import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  Button,
  Grid,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  EmojiEvents,
  AccessTime,
  CardGiftcard,
  Groups,
  HourglassEmpty,
  Edit,
  Visibility,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

// Helper for countdown
function useCountdown(targetTime) {
  const getTime = () => {
    const now = new Date();
    const diff = Math.max(0, targetTime - now);
    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { hours, minutes, seconds, isOver: diff === 0 };
  };
  const [time, setTime] = useState(getTime());
  useEffect(() => {
    if (time.isOver) return;
    const timer = setInterval(() => setTime(getTime()), 1000);
    return () => clearInterval(timer);
  }, [targetTime, time.isOver]);
  return time;
}

// Example data for all three groups
const challenges = [
  {
    classGroup: "Class I/II",
    miniCompetition: "Spelling",
    type: "Weekly",
    timeLeft: new Date(Date.now() + 3 * 60 * 60 * 1000 + 8 * 60 * 1000 + 7 * 1000),
    prize: "Top 3 get Goodies!",
    submissions: 42,
    winnersAnnounced: false,
  },
  {
    classGroup: "Class III to V",
    miniCompetition: "Spelling",
    type: "Weekly",
    timeLeft: new Date(Date.now() + 23 * 60 * 60 * 1000 + 13 * 60 * 1000 + 7 * 1000),
    prize: "Top 3 get Amazon vouchers and a Certificate!",
    submissions: 128,
    winnersAnnounced: false,
  },
  {
    classGroup: "Class VI to X",
    miniCompetition: "Spelling",
    type: "Weekly",
    timeLeft: new Date(Date.now() + 7 * 60 * 60 * 1000 + 40 * 60 * 1000 + 5 * 1000),
    prize: "Top 3 get Gift Cards!",
    submissions: 61,
    winnersAnnounced: true,
  },
];

const classGroupsMeta = [
  {
    label: "Class I/II",
    value: 0,
    chipColor: "info",
  },
  {
    label: "Class III to V",
    value: 1,
    chipColor: "primary",
  },
  {
    label: "Class VI to X",
    value: 2,
    chipColor: "success",
  },
];

const typeColor = {
  Daily: "success",
  Weekly: "primary",
  Monthly: "warning",
  Special: "error",
};

function CountdownCell({ targetTime }) {
  const time = useCountdown(targetTime);
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <AccessTime color="action" fontSize="small" />
      <Typography fontFamily="monospace" fontWeight={700}>
        {`${time.hours.toString().padStart(2, "0")}:${time.minutes
          .toString()
          .padStart(2, "0")}:${time.seconds.toString().padStart(2, "0")}`}
      </Typography>
    </Stack>
  );
}

export default function ChallengesPage() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedGroup, setSelectedGroup] = useState(0);

  const challenge = challenges[selectedGroup];

  return (
    <Box maxWidth="md" mx="auto" mt={5} px={2}>
      <Typography variant="h4" fontWeight={700} mb={2} textAlign="center">
        🔥 DWMS Spelling Challenge
        <Chip label="Weekly" color="primary" sx={{ ml: 2 }} />
      </Typography>
      <Typography color="text.secondary" mb={3} textAlign="center">
        Participate in your class group and win amazing prizes!
      </Typography>

      {/* Class Group Selection */}
      <Stack direction="row" justifyContent="center" spacing={3} mb={4}>
        {classGroupsMeta.map((group, idx) => (
          <Chip
            key={group.label}
            icon={<Groups />}
            label={group.label}
            color={selectedGroup === idx ? group.chipColor : "default"}
            variant={selectedGroup === idx ? "filled" : "outlined"}
            onClick={() => setSelectedGroup(idx)}
            sx={{
              fontSize: 17,
              fontWeight: 800,
              px: 2.5,
              py: 2,
              minWidth: 120,
              minHeight: 48,
              boxShadow: selectedGroup === idx ? 2 : 0,
              cursor: "pointer",
              bgcolor: selectedGroup === idx ? undefined : "#f6faff",
              transition: "0.18s",
            }}
          />
        ))}
      </Stack>

      {/* The selected Challenge Card */}
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8}>
          <Paper
            elevation={5}
            sx={{
              borderRadius: 5,
              p: 3,
              mb: 2,
              bgcolor: "#fafcfd",
              border: "2px solid #e3eefa",
              minHeight: 260,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
              <Chip
                icon={<Groups />}
                label={challenge.classGroup}
                color="info"
                sx={{ fontWeight: 700, fontSize: isSm ? 12 : 15 }}
              />
              <Chip
                icon={<Edit />}
                label={challenge.miniCompetition}
                color="secondary"
                sx={{ fontWeight: 700, fontSize: isSm ? 12 : 15 }}
              />
              <Chip
                icon={<EmojiEvents />}
                label={challenge.type}
                color={typeColor[challenge.type] || "default"}
                sx={{ fontWeight: 700, fontSize: isSm ? 12 : 15 }}
              />
            </Stack>
            <Divider sx={{ mb: 2 }} />
            <Stack direction="row" spacing={4} flexWrap="wrap" mb={2}>
              <Stack spacing={1} direction="row" alignItems="center">
                <Typography fontWeight={600} color="primary">
                  Time Left:
                </Typography>
                <CountdownCell targetTime={challenge.timeLeft} />
              </Stack>
              <Stack spacing={1} direction="row" alignItems="center">
                <Typography fontWeight={600} color="success.dark">
                  Submissions:
                </Typography>
                <Chip
                  icon={<HourglassEmpty />}
                  label={challenge.submissions}
                  color="primary"
                  sx={{ fontWeight: 700, fontSize: isSm ? 12 : 15 }}
                />
              </Stack>
            </Stack>
            <Stack direction="row" spacing={2} flexWrap="wrap" mb={2}>
              <Chip
                icon={<CardGiftcard />}
                label={challenge.prize}
                color="success"
                sx={{
                  bgcolor: "#fffde7",
                  color: "#ff9800",
                  fontWeight: 700,
                  fontSize: isSm ? 12 : 15,
                }}
              />
              {challenge.winnersAnnounced ? (
                <Button
                  variant="outlined"
                  color="success"
                  size="small"
                  startIcon={<Visibility />}
                  component={RouterLink}
                  to="/winners"
                  sx={{ fontWeight: 700, letterSpacing: 1 }}
                >
                  View Winners
                </Button>
              ) : (
                <Chip
                  icon={<HourglassEmpty />}
                  label="Not Announced"
                  color="warning"
                  variant="outlined"
                  sx={{ fontWeight: 700, fontSize: isSm ? 12 : 15 }}
                />
              )}
            </Stack>
            <Stack direction="row" justifyContent="flex-end">
              <Button
                variant="contained"
                color="info"
                size="large"
                startIcon={<Edit />}
                component={RouterLink}
                to={`/challenge/${selectedGroup + 1}`}
                sx={{
                  borderRadius: 3,
                  fontWeight: 700,
                  px: 4,
                }}
              >
                Answer Challenge
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}