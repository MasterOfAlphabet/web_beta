import React, { useState } from "react";
import {
  Box, Typography, Tabs, Tab, Paper, Button, Stack, Avatar, Chip, LinearProgress, Card
} from "@mui/material";
import QuizIcon from "@mui/icons-material/Quiz";
import StarIcon from "@mui/icons-material/Star";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import { useNavigate } from "react-router-dom";

const classGroups = [
  { label: "Class I-II", value: "I-II" },
  { label: "Class III-V", value: "III-V" },
  { label: "Class VI-X", value: "VI-X" },
];

const vocabList = {
  "I-II": [
    { word: "apple", meaning: "A red or green fruit.", image: "/images/apple.png" },
    { word: "dog", meaning: "A pet animal.", image: "/images/dog.png" },
    { word: "boat", meaning: "A vehicle that floats on water.", image: "/images/boat.png" },
  ],
  "III-V": [
    { word: "courage", meaning: "Being brave.", image: "/images/courage.png" },
    { word: "explore", meaning: "To search or travel for discovery.", image: "/images/explore.png" },
    { word: "observe", meaning: "To watch carefully.", image: "/images/observe.png" },
  ],
  "VI-X": [
    { word: "ambiguous", meaning: "Having more than one meaning.", image: "/images/ambiguous.png" },
    { word: "benevolent", meaning: "Well-meaning and kindly.", image: "/images/benevolent.png" },
    { word: "meticulous", meaning: "Showing attention to detail.", image: "/images/meticulous.png" },
  ],
};

export default function VocabularyPage() {
  const [group, setGroup] = useState("I-II");
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f6fafd", py: 4 }}>
      {/* Hero Section */}
      <Paper elevation={4} sx={{
        maxWidth: 900, mx: "auto", p: { xs: 2, md: 4 }, borderRadius: 6,
        mb: 4, display: "flex", alignItems: "center", gap: 3, bgcolor: "#fce4ec"
      }}>
        <Avatar sx={{ bgcolor: "#d81b60", width: 80, height: 80 }}>
          <QuizIcon sx={{ fontSize: 50 }} />
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight={900} color="error.dark">Vocabulary Vault</Typography>
          <Typography fontSize={19} color="text.secondary" mt={1}>
            Expand your vocabulary with daily words, quizzes, and fun games!
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
      {/* Progress Bar */}
      <Box sx={{ maxWidth: 700, mx: "auto", mb: 3 }}>
        <Paper sx={{ p: 3, borderRadius: 3, display: "flex", alignItems: "center", gap: 2 }}>
          <LinearProgress variant="determinate" value={group === "I-II" ? 22 : group === "III-V" ? 51 : 76} sx={{ flex: 1, height: 12, borderRadius: 5 }} />
          <Chip icon={<TrendingUpIcon />} label="Level Up!" color="error" sx={{ fontWeight: 700 }} />
        </Paper>
      </Box>
      {/* Vocabulary Cards */}
      <Box sx={{ maxWidth: 900, mx: "auto", mb: 4 }}>
        <Typography variant="h6" fontWeight={800} mb={2} color="error.dark">
          Today's Vocabulary
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3} justifyContent="center">
          {vocabList[group].map((item, i) => (
            <Card key={item.word} sx={{
              minWidth: 220, px: 2, py: 3, boxShadow: 3, borderRadius: 4,
              display: "flex", flexDirection: "column", alignItems: "center", bgcolor: "#fff",
              transition: "transform 0.2s", "&:hover": { transform: "scale(1.04)" }
            }}>
              <Avatar src={item.image} sx={{ width: 70, height: 70, mb: 1, bgcolor: "#f8bbd0" }} />
              <Typography fontWeight={700} fontSize={22} color="error.dark">{item.word}</Typography>
              <Typography fontSize={15} color="text.secondary" align="center" mt={0.5}>{item.meaning}</Typography>
              <Button variant="outlined" size="small" sx={{ mt: 2 }} onClick={() => navigate(`/vocabulary/practice?word=${item.word}`)}>
                Practice
              </Button>
            </Card>
          ))}
        </Stack>
      </Box>
      {/* Quick Vocabulary Tip */}
      <Box sx={{ maxWidth: 700, mx: "auto", mb: 4 }}>
        <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "#fffde7" }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <EmojiObjectsIcon color="error" />
            <Typography fontWeight={700} color="error.dark">Vocabulary Tip</Typography>
          </Stack>
          <Typography fontSize={16}>
            <b>Tip:</b> Use new words in your own sentences to remember them!
          </Typography>
        </Paper>
      </Box>
      {/* Leaderboard */}
      <Box sx={{ maxWidth: 700, mx: "auto", mb: 4 }}>
        <Typography variant="h6" fontWeight={700} color="error.dark" mb={1}>Vocabulary Stars</Typography>
        <Stack direction="row" spacing={2}>
          <Chip avatar={<Avatar><StarIcon /></Avatar>} label="Aanya" color="success" />
          <Chip avatar={<Avatar><StarIcon /></Avatar>} label="Veer" color="info" />
          <Chip avatar={<Avatar><StarIcon /></Avatar>} label="Riya" color="secondary" />
        </Stack>
      </Box>
      {/* Smart Recommendations */}
      <Box sx={{ maxWidth: 700, mx: "auto" }}>
        <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "#fce4ec" }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <TrendingUpIcon color="error" />
            <Typography fontWeight={700} color="error.dark">Recommended Next</Typography>
          </Stack>
          <Typography fontSize={15} mt={1}>
            Try <b>Synonyms Quiz</b> or <b>Word Match Game</b>!
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}