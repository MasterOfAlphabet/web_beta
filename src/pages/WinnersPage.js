import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Stack,
  Divider,
  Tooltip,
  Button,
  Fade,
  useTheme,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import StarsIcon from "@mui/icons-material/Stars";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import CelebrationIcon from "@mui/icons-material/Celebration";
import StarIcon from "@mui/icons-material/Star";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { blue, amber, deepPurple, orange, green } from "@mui/material/colors";

// Mock Winners Data (Replace with API/DB)
const WINNERS_DATA = {
  Daily: [
    {
      name: "Aanya Sharma",
      avatar: "",
      classGroup: "Class III to V",
      challenge: "Spelling Blitz",
      date: "2025-06-05",
      position: 1,
      prize: "Amazon Gift Card",
    },
    {
      name: "Krishna Rao",
      avatar: "",
      classGroup: "Class VI to X",
      challenge: "Vocab Sprint",
      date: "2025-06-05",
      position: 2,
      prize: "Certificate",
    },
    {
      name: "Mehul Patel",
      avatar: "",
      classGroup: "Class I/II",
      challenge: "Word Builders",
      date: "2025-06-05",
      position: 3,
      prize: "Goodie Bag",
    },
  ],
  Weekly: [
    {
      name: "Simran Kaur",
      avatar: "",
      classGroup: "Class VI to X",
      challenge: "Grammar Gladiator",
      date: "2025-06-02",
      position: 1,
      prize: "Wireless Earbuds",
    },
    {
      name: "Arjun Verma",
      avatar: "",
      classGroup: "Class III to V",
      challenge: "Reading Marathon",
      date: "2025-06-02",
      position: 2,
      prize: "Amazon Gift Card",
    },
    {
      name: "Shreya Sen",
      avatar: "",
      classGroup: "Class I/II",
      challenge: "Phonics Fun",
      date: "2025-06-02",
      position: 3,
      prize: "Certificate",
    },
  ],
  Monthly: [
    {
      name: "Rahul Singh",
      avatar: "",
      classGroup: "Class VI to X",
      challenge: "Spelling Bee",
      date: "2025-06-01",
      position: 1,
      prize: "Tablet",
    },
    {
      name: "Pooja Menon",
      avatar: "",
      classGroup: "Class III to V",
      challenge: "Word Wizard",
      date: "2025-06-01",
      position: 2,
      prize: "Bluetooth Speaker",
    },
    {
      name: "Devika Pillai",
      avatar: "",
      classGroup: "Class I/II",
      challenge: "Story Time",
      date: "2025-06-01",
      position: 3,
      prize: "Story Book Set",
    },
  ],
  Special: [
    {
      name: "Manav Gupta",
      avatar: "",
      classGroup: "Class VI to X",
      challenge: "Olympiad Finale",
      date: "2025-05-30",
      position: 1,
      prize: "Laptop",
    },
    {
      name: "Ananya Joshi",
      avatar: "",
      classGroup: "Class III to V",
      challenge: "Mega Quiz",
      date: "2025-05-30",
      position: 2,
      prize: "Smartwatch",
    },
    {
      name: "Tanya Roy",
      avatar: "",
      classGroup: "Class I/II",
      challenge: "Spelling Star",
      date: "2025-05-30",
      position: 3,
      prize: "Gift Hamper",
    },
  ],
};

const TAB_INFO = [
  {
    label: "Daily",
    icon: <LocalFireDepartmentIcon sx={{ color: orange[600] }} />,
    color: orange[50],
    chipColor: orange[600],
    iconBg: orange[100],
  },
  {
    label: "Weekly",
    icon: <CalendarTodayIcon sx={{ color: blue[700] }} />,
    color: blue[50],
    chipColor: blue[700],
    iconBg: blue[100],
  },
  {
    label: "Monthly",
    icon: <StarsIcon sx={{ color: amber[800] }} />,
    color: amber[50],
    chipColor: amber[800],
    iconBg: amber[100],
  },
  {
    label: "Special",
    icon: <CelebrationIcon sx={{ color: deepPurple[700] }} />,
    color: deepPurple[50],
    chipColor: deepPurple[700],
    iconBg: deepPurple[100],
  },
];

// Responsive (and consistent height) Winner Card
function WinnerCard({ winner, idx, tabIdx }) {
  const trophyColors = [amber[500], "#bdbdbd", "#c47f17"];
  const positions = ["Winner", "Runner Up", "2nd Runner Up"];
  const icons = [
    <EmojiEventsIcon sx={{ color: trophyColors[0], fontSize: 38 }} />,
    <EmojiEventsIcon sx={{ color: trophyColors[1], fontSize: 32 }} />,
    <EmojiEventsIcon sx={{ color: trophyColors[2], fontSize: 28 }} />,
  ];

  return (
    <Fade in timeout={600 + idx * 200}>
      <Card
        elevation={idx === 0 ? 6 : 3}
        sx={{
          borderRadius: 4,
          mb: 2,
          bgcolor: idx === 0 ? "#fffde7" : "#f5f5f5",
          minHeight: { xs: 145, sm: 160 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "stretch",
          position: "relative",
          overflow: "visible",
          border: idx === 0 ? `2.5px solid ${amber[400]}` : undefined,
          ":hover": {
            boxShadow: 8,
            transform: "translateY(-4px) scale(1.03)",
            transition: "all 0.2s",
          },
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            height: "100%",
            pb: "16px!important",
            pt: "16px!important",
            px: { xs: 1, sm: 2.5 },
            gap: 2,
          }}
        >
          <Box
            sx={{
              minWidth: 64,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              src={winner.avatar}
              sx={{
                width: idx === 0 ? 56 : 46,
                height: idx === 0 ? 56 : 46,
                bgcolor: [amber[100], blue[100], deepPurple[100]][tabIdx],
                fontSize: 24,
                border: idx === 0 ? `2px solid ${amber[500]}` : undefined,
              }}
            >
              {winner.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
            </Avatar>
            <Box mt={-2}>{icons[idx]}</Box>
          </Box>
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 0.5,
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ flexWrap: "wrap", width: "100%" }}
            >
              <Typography
                fontWeight={700}
                fontSize={idx === 0 ? 21 : 18}
                color={idx === 0 ? "text.primary" : "text.secondary"}
                sx={{ flexShrink: 1, minWidth: 0, overflowWrap: "anywhere", wordBreak: "break-word" }}
              >
                {winner.name}
              </Typography>
              <Tooltip title={winner.classGroup}>
                <Chip
                  label={winner.classGroup}
                  size="small"
                  color="info"
                  sx={{
                    fontWeight: "bold",
                    fontSize: 13,
                    bgcolor: blue[50],
                    maxWidth: { xs: 120, sm: 160 },
                    overflow: "hidden",
                  }}
                />
              </Tooltip>
            </Stack>
            <Typography
              fontSize={15}
              color="text.secondary"
              mt={0.3}
              sx={{
                whiteSpace: "pre-line",
                wordBreak: "break-word",
                overflowWrap: "anywhere",
                maxWidth: { xs: "98vw", sm: "100%" },
              }}
            >
              {winner.challenge}
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              mt={1}
              sx={{
                flexWrap: "wrap",
                rowGap: 0.5,
                columnGap: 1,
                width: "100%",
                overflow: "hidden",
                wordBreak: "break-word",
                overflowWrap: "anywhere",
              }}
            >
              <Chip
                icon={<StarIcon sx={{ color: amber[500] }} />}
                label={positions[idx]}
                size="small"
                sx={{
                  bgcolor: idx === 0 ? amber[50] : "#f0f0f0",
                  color: idx === 0 ? amber[800] : "#555",
                  fontWeight: 600,
                  maxWidth: { xs: 110, sm: 140 },
                  overflow: "hidden",
                }}
              />
              <Chip
                label={winner.prize}
                size="small"
                color="success"
                icon={<EmojiEmotionsIcon sx={{ color: green[700] }} />}
                sx={{ bgcolor: green[50], color: green[800], fontWeight: 500, maxWidth: { xs: 120, sm: 160 }, overflow: "hidden" }}
              />
              <Chip
                label={new Date(winner.date).toLocaleDateString()}
                size="small"
                color="default"
                sx={{ bgcolor: "#e3e3e3", color: "#666", maxWidth: { xs: 90, sm: 120 }, overflow: "hidden" }}
              />
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
}

export default function WinnersPage() {
  const [tab, setTab] = useState(0);
  const theme = useTheme();

  const tabMeta = TAB_INFO[tab];
  const winners = WINNERS_DATA[tabMeta.label];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f6f8fc",
        pb: 6,
        pt: { xs: 2, sm: 5 },
      }}
    >
      <Box
        sx={{
          maxWidth: 720,
          mx: "auto",
          px: { xs: 1, sm: 2 },
        }}
      >
        <Paper
          elevation={5}
          sx={{
            borderRadius: 5,
            p: { xs: 2, sm: 5 },
            mb: 4,
            bgcolor: "#fff",
            boxShadow: "0 10px 36px 0 rgba(80,130,250,.13)",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" mb={2}>
            <EmojiEventsIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />
            <Typography variant="h4" fontWeight={800} color="primary" sx={{ letterSpacing: 1 }}>
              Winners Wall
            </Typography>
          </Stack>
          <Typography textAlign="center" color="text.secondary" fontWeight={500} mb={2} fontSize={16}>
            Celebrate the champions of our Daily, Weekly, Monthly and Special Challenges!
          </Typography>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            centered
            variant="fullWidth"
            sx={{
              mb: 3,
              ".MuiTabs-indicator": { background: tabMeta.chipColor, height: 4, borderRadius: 2 },
            }}
          >
            {TAB_INFO.map((t, idx) => (
              <Tab
                key={t.label}
                icon={t.icon}
                iconPosition="start"
                label={
                  <Typography fontWeight={700} color={tab === idx ? t.chipColor : "#888"}>
                    {t.label}
                  </Typography>
                }
                sx={{
                  minHeight: 44,
                  px: 2.5,
                  mx: 0.5,
                  bgcolor: tab === idx ? t.iconBg : undefined,
                  borderRadius: 2,
                  fontWeight: 700,
                  transition: "all .15s",
                }}
              />
            ))}
          </Tabs>
          <Divider sx={{ mb: 3 }} />
          <Box
            sx={{
              minHeight: 320,
              bgcolor: tabMeta.color,
              borderRadius: 4,
              p: { xs: 1, sm: 2 },
              boxShadow: "0 2px 12px 0 rgba(80,130,250,.06)",
            }}
          >
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {winners.map((winner, idx) => (
                <Grid item xs={12} key={winner.name}>
                  <WinnerCard winner={winner} idx={idx} tabIdx={tab} />
                </Grid>
              ))}
            </Grid>
          </Box>
          <Stack alignItems="center" mt={4} spacing={1}>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              startIcon={<StarsIcon />}
              sx={{ borderRadius: 8, fontWeight: 700, boxShadow: 1, px: 3 }}
              href="/leaderboards"
            >
              View Leaderboards
            </Button>
            <Typography variant="body2" color="text.secondary">
              Think you can be here? Join the next challenge!
            </Typography>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}