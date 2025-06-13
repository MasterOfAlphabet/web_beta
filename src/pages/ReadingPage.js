import React, { useState } from "react";
import {
  Box, Typography, Tabs, Tab, Paper, Button, Stack, Avatar, Chip, LinearProgress, Card
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
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

const passages = {
  "I-II": [
    { title: "The Cat", passage: "The cat sat on the mat.", image: "/images/cat-reading.png" },
    { title: "A Sunny Day", passage: "The sun is bright and yellow.", image: "/images/sun.png" },
    { title: "My Ball", passage: "I like to play with my ball.", image: "/images/ball.png" },
  ],
  "III-V": [
    { title: "The Jungle", passage: "Animals live in the jungle. They hunt and play among the trees.", image: "/images/jungle.png" },
    { title: "Science Fair", passage: "The science fair was fun. We made a volcano that erupted!", image: "/images/volcano.png" },
    { title: "The Library", passage: "I visit the library every week to find new books to read.", image: "/images/library.png" },
  ],
  "VI-X": [
    { title: "The Solar System", passage: "Our solar system consists of the sun and eight planets. Each planet is unique.", image: "/images/solar-system.png" },
    { title: "Ancient Civilizations", passage: "Civilizations like Egypt and Mesopotamia made great advances in writing and science.", image: "/images/pyramids.png" },
    { title: "Environmental Change", passage: "Climate change affects life on Earth. We must act to protect our environment.", image: "/images/environment.png" },
  ],
};

export default function ReadingPage() {
  const [group, setGroup] = useState("I-II");
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fffaf6", py: 4 }}>
      {/* Hero Section */}
      <Paper elevation={4} sx={{
        maxWidth: 900, mx: "auto", p: { xs: 2, md: 4 },
        borderRadius: 6, mb: 4, display: "flex", alignItems: "center", gap: 3, bgcolor: "#e3f2fd"
      }}>
        <Avatar sx={{ bgcolor: "#ffb300", width: 80, height: 80 }}>
          <MenuBookIcon sx={{ fontSize: 50 }} />
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight={900} color="warning.dark">Reading Room</Typography>
          <Typography fontSize={19} color="text.secondary" mt={1}>
            Dive into stories and passages. Improve your reading skills with fun quizzes and comprehension practice!
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
          <LinearProgress variant="determinate" value={group === "I-II" ? 35 : group === "III-V" ? 55 : 80} sx={{ flex: 1, height: 12, borderRadius: 5 }} />
          <Chip icon={<TrendingUpIcon />} label="Level Up!" color="warning" sx={{ fontWeight: 700 }} />
        </Paper>
      </Box>
      {/* Featured Passages */}
      <Box sx={{ maxWidth: 900, mx: "auto", mb: 4 }}>
        <Typography variant="h6" fontWeight={800} mb={2} color="warning.dark">
          Today's Passage
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3} justifyContent="center">
          {passages[group].map((p, i) => (
            <Card key={p.title} sx={{
              minWidth: 220, px: 2, py: 3, boxShadow: 3, borderRadius: 4,
              display: "flex", flexDirection: "column", alignItems: "center", bgcolor: "#fff",
              transition: "transform 0.2s", "&:hover": { transform: "scale(1.04)" }
            }}>
              <Avatar src={p.image} sx={{ width: 70, height: 70, mb: 1, bgcolor: "#f1f8e9" }} />
              <Typography fontWeight={700} fontSize={21} color="warning">{p.title}</Typography>
              <Typography fontSize={15} color="text.secondary" align="center" mt={0.5}>{p.passage}</Typography>
              <Button variant="outlined" size="small" sx={{ mt: 2 }} onClick={() => navigate(`/reading/quiz?title=${encodeURIComponent(p.title)}`)}>
                Take Quiz
              </Button>
            </Card>
          ))}
        </Stack>
      </Box>
      {/* Quick Comprehension */}
      <Box sx={{ maxWidth: 700, mx: "auto", mb: 4 }}>
        <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "#fffde7" }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <EmojiObjectsIcon color="warning" />
            <Typography fontWeight={700} color="warning.dark">Quick Comprehension</Typography>
          </Stack>
          <Typography fontSize={16}>
            <b>Question:</b> What color is the sun?
          </Typography>
          <Button sx={{ mt: 1 }} variant="contained" color="warning" size="small">Reveal Answer</Button>
        </Paper>
      </Box>
      {/* Leaderboard */}
      <Box sx={{ maxWidth: 700, mx: "auto", mb: 4 }}>
        <Typography variant="h6" fontWeight={700} color="info.main" mb={1}>Top Readers</Typography>
        <Stack direction="row" spacing={2}>
          <Chip avatar={<Avatar><StarIcon /></Avatar>} label="Aanya (100%)" color="success" />
          <Chip avatar={<Avatar><StarIcon /></Avatar>} label="Veer (99%)" color="info" />
          <Chip avatar={<Avatar><StarIcon /></Avatar>} label="Riya (98%)" color="secondary" />
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
            Try the <b>Passage Challenge</b> or explore <b>Story of the Week</b>!
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}