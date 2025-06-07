import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Chip,
  Button,
  Stack,
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

  return (
    <Box maxWidth="md" mx="auto" mt={5} px={2}>
      <Typography variant="h4" fontWeight={700} mb={2} textAlign="center">
        🔥 DWMS Spelling Challenge <Chip label="Weekly" color="primary" sx={{ ml: 2 }} />
      </Typography>
      <Typography color="text.secondary" mb={4} textAlign="center">
        Participate in your class group and win amazing prizes!
      </Typography>
      <TableContainer
        component={Paper}
        elevation={3}
        sx={{
          borderRadius: 3,
          overflowX: "auto",
          width: "100%",
          // Responsive fix: always allow horizontal scroll only if needed
        }}
      >
        <Table
          sx={{
            minWidth: 700,
            tableLayout: "auto",
            "& td, & th": { whiteSpace: "nowrap", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis" },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell align="center">Class Group</TableCell>
              <TableCell align="center">Mini Competition</TableCell>
              <TableCell align="center">Type</TableCell>
              <TableCell align="center">Time Left</TableCell>
              <TableCell align="center">Prize</TableCell>
              <TableCell align="center">Submissions</TableCell>
              <TableCell align="center">Winners</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {challenges.map((ch, idx) => (
              <TableRow key={idx}>
                <TableCell align="center">
                  <Chip
                    icon={<Groups />}
                    label={ch.classGroup}
                    color="info"
                    sx={{ fontWeight: 700, fontSize: isSm ? 12 : 14 }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    icon={<Edit />}
                    label={ch.miniCompetition}
                    color="secondary"
                    sx={{ fontWeight: 700, fontSize: isSm ? 12 : 14 }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    icon={<EmojiEvents />}
                    label={ch.type}
                    color={typeColor[ch.type] || "default"}
                    sx={{ fontWeight: 700, fontSize: isSm ? 12 : 14 }}
                  />
                </TableCell>
                <TableCell align="center">
                  <CountdownCell targetTime={ch.timeLeft} />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    icon={<CardGiftcard />}
                    label={ch.prize}
                    color="success"
                    sx={{
                      bgcolor: "#fffde7",
                      color: "#ff9800",
                      fontWeight: 700,
                      fontSize: isSm ? 12 : 14,
                      maxWidth: 140,
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    icon={<HourglassEmpty />}
                    label={ch.submissions}
                    color="primary"
                    sx={{ fontWeight: 700, fontSize: isSm ? 12 : 14 }}
                  />
                </TableCell>
                <TableCell align="center">
                  {ch.winnersAnnounced ? (
                    <Button
                      variant="outlined"
                      color="success"
                      size="small"
                      startIcon={<Visibility />}
                      component={RouterLink}
                      to="/winners"
                    >
                      View Winners
                    </Button>
                  ) : (
                    <Chip
                      icon={<HourglassEmpty />}
                      label="Not Announced"
                      color="warning"
                      variant="outlined"
                      sx={{ fontWeight: 700, fontSize: isSm ? 12 : 14 }}
                    />
                  )}
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    startIcon={<Edit />}
                    component={RouterLink}
                    to={`/challenge/${idx + 1}`}
                  >
                    Answer Challenge
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}