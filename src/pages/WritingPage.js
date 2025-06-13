import React, { useState } from "react";
import {
  Box, Typography, Tabs, Tab, Paper, Button, Stack, Avatar, Chip, LinearProgress, Card
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import StarIcon from "@mui/icons-material/Star";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import { useNavigate } from "react-router-dom";

const classGroups = [
  { label: "Class I-II", value: "I-II" },
  { label: "Class III-V", value: "III-V" },
  { label: "Class VI-X", value: "VI-X" },
];

const writingPrompts = {
  "I-II": [
    { prompt: "My Pet", desc: "Write 2-3 lines about your favorite pet.", image: "/images/pet.png" },
    { prompt: "A Rainy Day", desc: "Describe what you see on a rainy day.", image: "/images/rain.png" },
    { prompt: "My Family", desc: "Write about your family.", image: "/images/family.png" },
  ],
  "III-V": [
    { prompt: "My Best Friend", desc: "Describe your best friend.", image: "/images/friend.png" },
    { prompt: "A Visit to the Zoo", desc: "Narrate your experience at the zoo.", image: "/images/zoo.png" },
    { prompt: "Favorite Festival", desc: "Write about your favorite festival.", image: "/images/festival.png" },
  ],
  "VI-X": [
    { prompt: "Importance of Trees", desc: "Write a short essay on why trees are important.", image: "/images/trees.png" },
    { prompt: "A Memorable Journey", desc: "Narrate a memorable journey you took.", image: "/images/journey.png" },
    { prompt: "Online Learning", desc: "Discuss the pros and cons of online learning.", image: "/images/online-learning.png" },
  ],
};

export default function WritingPage() {
  const [group, setGroup] = useState("I-II");
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fffaf6", py: 4 }}>
      {/* Hero Section */}
      <Paper elevation={4} sx={{
        maxWidth: 900, mx: "auto", p: { xs: 2, md: 4 }, borderRadius: 6,
        mb: 4, display: "flex", alignItems: "center", gap: 3, bgcolor: "#fffde7"
      }}>
        <Avatar sx={{ bgcolor: "#ffb300", width: 80, height: 80 }}>
          <SchoolIcon sx={{ fontSize: 50 }} />
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight={900} color="warning.dark">Writing Studio</Typography>
          <Typography fontSize={19} color="text.secondary" mt={1}>
            Express yourself! Practice creative and academic writing with prompts, feedback, and peer comparisons.
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
          <LinearProgress variant="determinate" value={group === "I-II" ? 25 : group === "III-V" ? 53 : 74} sx={{ flex: 1, height: 12, borderRadius: 5 }} />
          <Chip icon={<TrendingUpIcon />} label="Level Up!" color="warning" sx={{ fontWeight: 700 }} />
        </Paper>
      </Box>
      {/* Writing Prompts */}
      <Box sx={{ maxWidth: 900, mx: "auto", mb: 4 }}>
        <Typography variant="h6" fontWeight={800} mb={2} color="warning.dark">
          Today's Writing Prompt
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3} justifyContent="center">
          {writingPrompts[group].map((item, i) => (
            <Card key={item.prompt} sx={{
              minWidth: 220, px: 2, py: 3, boxShadow: 3, borderRadius: 4,
              display: "flex", flexDirection: "column", alignItems: "center", bgcolor: "#fff",
              transition: "transform 0.2s", "&:hover": { transform: "scale(1.04)" }
            }}>
              <Avatar src={item.image} sx={{ width: 70, height: 70, mb: 1, bgcolor: "#fff9c4" }} />
              <Typography fontWeight={700} fontSize={21} color="warning.dark">{item.prompt}</Typography>
              <Typography fontSize={15} color="text.secondary" align="center" mt={0.5}>{item.desc}</Typography>
              <Button variant="outlined" size="small" sx={{ mt: 2 }} onClick={() => navigate(`/writing/practice?prompt=${encodeURIComponent(item.prompt)}`)}>
                Start Writing
              </Button>
            </Card>
          ))}
        </Stack>
      </Box>
      {/* Quick Writing Tip */}
      <Box sx={{ maxWidth: 700, mx: "auto", mb: 4 }}>
        <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "#e3f2fd" }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <EmojiObjectsIcon color="info" />
            <Typography fontWeight={700} color="info.dark">Writing Tip</Typography>
          </Stack>
          <Typography fontSize={16}>
            <b>Tip:</b> Start with a strong opening sentence to grab attention!
          </Typography>
        </Paper>
      </Box>
      {/* Leaderboard */}
      <Box sx={{ maxWidth: 700, mx: "auto", mb: 4 }}>
        <Typography variant="h6" fontWeight={700} color="warning.dark" mb={1}>Top Writers</Typography>
        <Stack direction="row" spacing={2}>
          <Chip avatar={<Avatar><StarIcon /></Avatar>} label="Aanya" color="success" />
          <Chip avatar={<Avatar><StarIcon /></Avatar>} label="Veer" color="info" />
          <Chip avatar={<Avatar><StarIcon /></Avatar>} label="Riya" color="secondary" />
        </Stack>
      </Box>
      {/* Smart Recommendations */}
      <Box sx={{ maxWidth: 700, mx: "auto" }}>
        <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "#fffde7" }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <TrendingUpIcon color="warning" />
            <Typography fontWeight={700} color="warning.dark">Recommended Next</Typography>
          </Stack>
          <Typography fontSize={15} mt={1}>
            Try <b>Story Writing</b> or review <b>Letter Formats</b>!
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}