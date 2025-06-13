import React, { useState } from "react";
import {
  Box, Typography, Tabs, Tab, Paper, Button, Stack, Avatar, Chip, LinearProgress, Card
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import StarIcon from "@mui/icons-material/Star";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import { useNavigate } from "react-router-dom";

const classGroups = [
  { label: "Class I-II", value: "I-II" },
  { label: "Class III-V", value: "III-V" },
  { label: "Class VI-X", value: "VI-X" },
];

const grammarTopics = {
  "I-II": [
    { topic: "Nouns", desc: "Names of people, places, or things.", image: "/images/noun.png" },
    { topic: "Verbs", desc: "Action words.", image: "/images/verb.png" },
    { topic: "Adjectives", desc: "Words that describe nouns.", image: "/images/adjective.png" },
  ],
  "III-V": [
    { topic: "Tenses", desc: "Past, present, and future actions.", image: "/images/tenses.png" },
    { topic: "Pronouns", desc: "Words used in place of nouns.", image: "/images/pronoun.png" },
    { topic: "Prepositions", desc: "Show relation between nouns.", image: "/images/preposition.png" },
  ],
  "VI-X": [
    { topic: "Clauses", desc: "Groups of words with a subject and verb.", image: "/images/clause.png" },
    { topic: "Voice", desc: "Active and passive constructions.", image: "/images/voice.png" },
    { topic: "Direct & Indirect Speech", desc: "Reporting what someone said.", image: "/images/speech.png" },
  ],
};

export default function GrammarPage() {
  const [group, setGroup] = useState("I-II");
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f6fafd", py: 4 }}>
      {/* Hero Section */}
      <Paper elevation={4} sx={{
        maxWidth: 900, mx: "auto", p: { xs: 2, md: 4 }, borderRadius: 6,
        mb: 4, display: "flex", alignItems: "center", gap: 3, bgcolor: "#e8f5e9"
      }}>
        <Avatar sx={{ bgcolor: "#388e3c", width: 80, height: 80 }}>
          <EditNoteIcon sx={{ fontSize: 50 }} />
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight={900} color="success.dark">Grammar Genius</Typography>
          <Typography fontSize={19} color="text.secondary" mt={1}>
            Master the rules of English! Practice parts of speech, tenses, and more with interactive lessons and quizzes.
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
          <LinearProgress variant="determinate" value={group === "I-II" ? 40 : group === "III-V" ? 60 : 80} sx={{ flex: 1, height: 12, borderRadius: 5 }} />
          <Chip icon={<TrendingUpIcon />} label="Level Up!" color="success" sx={{ fontWeight: 700 }} />
        </Paper>
      </Box>
      {/* Grammar Topics */}
      <Box sx={{ maxWidth: 900, mx: "auto", mb: 4 }}>
        <Typography variant="h6" fontWeight={800} mb={2} color="success.dark">
          Today's Grammar Focus
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3} justifyContent="center">
          {grammarTopics[group].map((item, i) => (
            <Card key={item.topic} sx={{
              minWidth: 220, px: 2, py: 3, boxShadow: 3, borderRadius: 4,
              display: "flex", flexDirection: "column", alignItems: "center", bgcolor: "#fff",
              transition: "transform 0.2s", "&:hover": { transform: "scale(1.04)" }
            }}>
              <Avatar src={item.image} sx={{ width: 70, height: 70, mb: 1, bgcolor: "#c8e6c9" }} />
              <Typography fontWeight={700} fontSize={21} color="success.dark">{item.topic}</Typography>
              <Typography fontSize={15} color="text.secondary" align="center" mt={0.5}>{item.desc}</Typography>
              <Button variant="outlined" size="small" sx={{ mt: 2 }} onClick={() => navigate(`/grammar/lesson?topic=${encodeURIComponent(item.topic)}`)}>
                Learn More
              </Button>
            </Card>
          ))}
        </Stack>
      </Box>
      {/* Quick Grammar Quiz */}
      <Box sx={{ maxWidth: 700, mx: "auto", mb: 4 }}>
        <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "#fffde7" }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <EmojiObjectsIcon color="success" />
            <Typography fontWeight={700} color="success.dark">Quick Quiz</Typography>
          </Stack>
          <Typography fontSize={16}>
            <b>Question:</b> What is the plural of "child"?
          </Typography>
          <Button sx={{ mt: 1 }} variant="contained" color="success" size="small">Reveal Answer</Button>
        </Paper>
      </Box>
      {/* Leaderboard */}
      <Box sx={{ maxWidth: 700, mx: "auto", mb: 4 }}>
        <Typography variant="h6" fontWeight={700} color="success.dark" mb={1}>Grammar Stars</Typography>
        <Stack direction="row" spacing={2}>
          <Chip avatar={<Avatar><StarIcon /></Avatar>} label="Aanya (97%)" color="success" />
          <Chip avatar={<Avatar><StarIcon /></Avatar>} label="Veer (96%)" color="info" />
          <Chip avatar={<Avatar><StarIcon /></Avatar>} label="Riya (95%)" color="secondary" />
        </Stack>
      </Box>
      {/* Smart Recommendations */}
      <Box sx={{ maxWidth: 700, mx: "auto" }}>
        <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "#e8f5e9" }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <TrendingUpIcon color="success" />
            <Typography fontWeight={700} color="success.dark">Recommended Next</Typography>
          </Stack>
          <Typography fontSize={15} mt={1}>
            Try the <b>Tenses Challenge</b> or explore <b>Parts of Speech Quiz</b>!
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}