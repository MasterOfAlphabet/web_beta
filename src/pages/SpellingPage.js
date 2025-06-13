import React, { useState } from "react";
import {
  Box, Typography, Tabs, Tab, Paper, Button, Stack, Avatar, Chip, LinearProgress, Card, CardContent
} from "@mui/material";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import StarIcon from "@mui/icons-material/Star";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import { useNavigate } from "react-router-dom";

const classGroups = [
  { label: "Class I-II", value: "I-II" },
  { label: "Class III-V", value: "III-V" },
  { label: "Class VI-X", value: "VI-X" },
];

const dailyWords = {
  "I-II": [
    { word: "cat", meaning: "A small domesticated animal.", image: "/images/cat.png" },
    { word: "bat", meaning: "A flying mammal.", image: "/images/bat.png" },
    { word: "mat", meaning: "A piece of fabric for wiping feet.", image: "/images/mat.png" },
  ],
  "III-V": [
    { word: "puzzle", meaning: "A game or problem to solve.", image: "/images/puzzle.png" },
    { word: "science", meaning: "The study of the natural world.", image: "/images/science.png" },
    { word: "future", meaning: "The time yet to come.", image: "/images/future.png" },
  ],
  "VI-X": [
    { word: "conscience", meaning: "A sense of right and wrong.", image: "/images/conscience.png" },
    { word: "acquaintance", meaning: "A person you know slightly.", image: "/images/acquaintance.png" },
    { word: "camouflage", meaning: "Disguise to blend with surroundings.", image: "/images/camouflage.png" },
  ],
};

export default function SpellingPage() {
  const [group, setGroup] = useState("I-II");
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f6fafd", py: 4 }}>
      {/* Hero Section */}
      <Paper elevation={4} sx={{
        maxWidth: 900, mx: "auto", p: { xs: 2, md: 4 }, borderRadius: 6,
        mb: 4, display: "flex", alignItems: "center", gap: 3, bgcolor: "#e3f2fd"
      }}>
        <Avatar sx={{ bgcolor: "#1976d2", width: 80, height: 80 }}>
          <SpellcheckIcon sx={{ fontSize: 50 }} />
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight={900} color="primary">Spelling Mastery</Typography>
          <Typography fontSize={19} color="text.secondary" mt={1}>
            Build strong spelling skills with fun games, daily words, and interactive practice. Track your progress and challenge yourself!
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

      {/* Progress & Actions */}
      <Box sx={{ maxWidth: 700, mx: "auto", mb: 3 }}>
        <Paper sx={{ p: 3, borderRadius: 3, display: "flex", alignItems: "center", gap: 2 }}>
          <LinearProgress variant="determinate" value={group === "I-II" ? 30 : group === "III-V" ? 60 : 85} sx={{ flex: 1, height: 12, borderRadius: 5 }} />
          <Chip icon={<TrendingUpIcon />} label="Level Up!" color="primary" sx={{ fontWeight: 700 }} />
        </Paper>
      </Box>

      {/* Daily Words Carousel */}
      <Box sx={{ maxWidth: 900, mx: "auto", mb: 4 }}>
        <Typography variant="h6" fontWeight={800} mb={2} color="primary.dark">
          Today's Words
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3} justifyContent="center">
          {dailyWords[group].map((w, i) => (
            <Card key={w.word} sx={{
              minWidth: 220, px: 2, py: 3, boxShadow: 3, borderRadius: 4,
              display: "flex", flexDirection: "column", alignItems: "center", bgcolor: "#fff",
              transition: "transform 0.2s", "&:hover": { transform: "scale(1.04)" }
            }}>
              <Avatar src={w.image} sx={{ width: 70, height: 70, mb: 1, bgcolor: "#f1f8e9" }} />
              <Typography fontWeight={700} fontSize={24} color="primary">{w.word}</Typography>
              <Typography fontSize={15} color="text.secondary" align="center" mt={0.5}>{w.meaning}</Typography>
              <Button variant="outlined" size="small" sx={{ mt: 2 }} onClick={() => navigate(`/spelling/practice?word=${w.word}`)}>Practice</Button>
            </Card>
          ))}
        </Stack>
      </Box>

      {/* Quick Practice / Challenge */}
      <Box sx={{ maxWidth: 700, mx: "auto", mb: 4 }}>
        <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "#fffde7" }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <EmojiObjectsIcon color="warning" />
            <Typography fontWeight={700} color="warning.dark">Quick Challenge</Typography>
          </Stack>
          <Typography fontSize={16}>
            <b>Spell the word:</b> <span style={{ letterSpacing: "0.18em", fontWeight: 700 }}>c _ t</span>
          </Typography>
          <Button sx={{ mt: 1 }} variant="contained" color="primary" size="small">Reveal Answer</Button>
        </Paper>
      </Box>

      {/* Leaderboard */}
      <Box sx={{ maxWidth: 700, mx: "auto", mb: 4 }}>
        <Typography variant="h6" fontWeight={700} color="secondary" mb={1}>Top Spellers</Typography>
        <Stack direction="row" spacing={2}>
          <Chip avatar={<Avatar><StarIcon /></Avatar>} label="Aanya (98%)" color="success" />
          <Chip avatar={<Avatar><StarIcon /></Avatar>} label="Veer (96%)" color="info" />
          <Chip avatar={<Avatar><StarIcon /></Avatar>} label="Riya (95%)" color="secondary" />
        </Stack>
      </Box>

      {/* Smart Recommendations */}
      <Box sx={{ maxWidth: 700, mx: "auto" }}>
        <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "#e3f2fd" }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <TrendingUpIcon color="primary" />
            <Typography fontWeight={700} color="primary.dark">Recommended Next</Typography>
          </Stack>
          <Typography fontSize={15} mt={1}>
            Try the <b>Homophones Quiz</b> or review <b>Commonly Misspelled Words</b>!
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}