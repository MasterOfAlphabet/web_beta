import React, { useState } from "react";
import {
  Box, Typography, Paper, Stack, Avatar, LinearProgress, Chip, Button, Tabs, Tab, Grid
} from "@mui/material";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import EditNoteIcon from "@mui/icons-material/EditNote";
import SchoolIcon from "@mui/icons-material/School";
import BoltIcon from "@mui/icons-material/Bolt";
import QuizIcon from "@mui/icons-material/Quiz";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const modules = [
  { name: "Spelling", icon: <SpellcheckIcon />, color: "#1976d2" },
  { name: "Reading", icon: <MenuBookIcon />, color: "#ffb300" },
  { name: "Pronunciation", icon: <RecordVoiceOverIcon />, color: "#ab47bc" },
  { name: "Grammar", icon: <EditNoteIcon />, color: "#388e3c" },
  { name: "Writing", icon: <SchoolIcon />, color: "#ffb300" },
  { name: "Listening", icon: <BoltIcon />, color: "#0288d1" },
  { name: "Vocabulary", icon: <QuizIcon />, color: "#d81b60" },
  { name: "S.H.A.R.P", icon: <WorkspacePremiumIcon />, color: "#7b1fa2" },
];

const classGroups = [
  { label: "Class I-II", value: "I-II" },
  { label: "Class III-V", value: "III-V" },
  { label: "Class VI-X", value: "VI-X" },
];

export default function EightInOnePage() {
  const [group, setGroup] = useState("I-II");

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f6fafd", py: 4 }}>
      {/* Hero Section */}
      <Paper elevation={4} sx={{
        maxWidth: 1000, mx: "auto", p: { xs: 2, md: 4 }, borderRadius: 6,
        mb: 4, display: "flex", alignItems: "center", gap: 3, bgcolor: "#e3f2fd"
      }}>
        <Avatar sx={{ bgcolor: "#7b1fa2", width: 80, height: 80 }}>
          <EmojiEventsIcon sx={{ fontSize: 50 }} />
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight={900} color="primary">
            8-In-1 English Hub
          </Typography>
          <Typography fontSize={19} color="text.secondary" mt={1}>
            Access all modules in one place! Monitor your progress, take challenges, and become a Master of Alphabet!
          </Typography>
        </Box>
      </Paper>

      {/* Class Group Tabs */}
      <Tabs
        value={group}
        variant="fullWidth"
        onChange={(_, val) => setGroup(val)}
        sx={{ maxWidth: 600, mx: "auto", mb: 3, bgcolor: "#fff", borderRadius: 3, boxShadow: 1 }}
      >
        {classGroups.map(cg => (
          <Tab
            key={cg.value}
            value={cg.value}
            label={cg.label}
            sx={{ fontWeight: 700, fontSize: 18 }}
          />
        ))}
      </Tabs>

      {/* Progress Overview */}
      <Paper sx={{ maxWidth: 1000, mx: "auto", p: 3, borderRadius: 3, mb: 4 }}>
        <Typography variant="h6" fontWeight={800} mb={2} color="primary">
          My Progress Overview
        </Typography>
        <Grid container spacing={3}>
          {modules.map((mod, i) => (
            <Grid key={mod.name} item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, borderRadius: 3, display: "flex", flexDirection: "column", alignItems: "center", bgcolor: "#fff" }}>
                <Avatar sx={{ bgcolor: mod.color, width: 52, height: 52, mb: 1 }}>
                  {mod.icon}
                </Avatar>
                <Typography fontWeight={700}>{mod.name}</Typography>
                <LinearProgress value={40 + i * 8} variant="determinate" sx={{ width: "100%", borderRadius: 3, mt: 1 }} />
                <Chip label="Level Up!" size="small" icon={<TrendingUpIcon />} color="primary" sx={{ fontWeight: 600, mt: 1 }} />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Quick Challenge */}
      <Box sx={{ maxWidth: 1000, mx: "auto", mb: 4 }}>
        <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "#fffde7" }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <TrendingUpIcon color="warning" />
            <Typography fontWeight={700} color="warning.dark">8-in-1 Challenge</Typography>
          </Stack>
          <Typography fontSize={16}>
            Try a mix of spelling, grammar, and vocabulary questions! <Button variant="contained" color="primary" size="small" sx={{ ml: 2 }}>Start Now</Button>
          </Typography>
        </Paper>
      </Box>

      {/* Leaderboard */}
      <Box sx={{ maxWidth: 1000, mx: "auto", mb: 4 }}>
        <Typography variant="h6" fontWeight={700} color="secondary" mb={1}>All-Rounders</Typography>
        <Stack direction="row" spacing={2}>
          <Chip avatar={<Avatar>A</Avatar>} label="Aanya (99%)" color="success" />
          <Chip avatar={<Avatar>V</Avatar>} label="Veer (97%)" color="info" />
          <Chip avatar={<Avatar>R</Avatar>} label="Riya (95%)" color="secondary" />
        </Stack>
      </Box>
    </Box>
  );
}