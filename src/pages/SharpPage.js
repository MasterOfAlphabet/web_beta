import React, { useState } from "react";
import {
  Box, Typography, Tabs, Tab, Paper, Button, Stack, Avatar, Chip, LinearProgress, Card
} from "@mui/material";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import StarIcon from "@mui/icons-material/Star";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import { useNavigate } from "react-router-dom";

const classGroups = [
  { label: "Class I-II", value: "I-II" },
  { label: "Class III-V", value: "III-V" },
  { label: "Class VI-X", value: "VI-X" },
];

const sharpSets = {
  "I-II": [
    { type: "Synonym", word: "big", match: "large", image: "/images/big.png" },
    { type: "Antonym", word: "hot", match: "cold", image: "/images/hot.png" },
    { type: "Plural", word: "cat", match: "cats", image: "/images/cat.png" },
  ],
  "III-V": [
    { type: "Homonym", word: "bat", match: "bat", image: "/images/bat.png" },
    { type: "Antonym", word: "happy", match: "sad", image: "/images/happy.png" },
    { type: "Rhyming", word: "blue", match: "true", image: "/images/blue.png" },
  ],
  "VI-X": [
    { type: "Synonym", word: "rapid", match: "swift", image: "/images/rapid.png" },
    { type: "Homonym", word: "lead", match: "lead", image: "/images/lead.png" },
    { type: "Plural", word: "analysis", match: "analyses", image: "/images/analysis.png" },
  ],
};

export default function SharpPage() {
  const [group, setGroup] = useState("I-II");
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f6fafd", py: 4 }}>
      {/* Hero Section */}
      <Paper elevation={4} sx={{
        maxWidth: 900, mx: "auto", p: { xs: 2, md: 4 }, borderRadius: 6,
        mb: 4, display: "flex", alignItems: "center", gap: 3, bgcolor: "#ede7f6"
      }}>
        <Avatar sx={{ bgcolor: "#7b1fa2", width: 80, height: 80 }}>
          <WorkspacePremiumIcon sx={{ fontSize: 50 }} />
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight={900} color="secondary.dark">S.H.A.R.P. Skills</Typography>
          <Typography fontSize={19} color="text.secondary" mt={1}>
            Strengthen your Synonyms, Homonyms, Antonyms, Rhyming, and Plural skills with games and challenges!
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
          <LinearProgress variant="determinate" value={group === "I-II" ? 52 : group === "III-V" ? 75 : 93} sx={{ flex: 1, height: 12, borderRadius: 5 }} />
          <Chip icon={<TrendingUpIcon />} label="Level Up!" color="secondary" sx={{ fontWeight: 700 }} />
        </Paper>
      </Box>
      {/* S.H.A.R.P. Cards */}
      <Box sx={{ maxWidth: 900, mx: "auto", mb: 4 }}>
        <Typography variant="h6" fontWeight={800} mb={2} color="secondary.dark">
          Today's S.H.A.R.P. Set
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3} justifyContent="center">
          {sharpSets[group].map((item, i) => (
            <Card key={item.word + item.type} sx={{
              minWidth: 220, px: 2, py: 3, boxShadow: 3, borderRadius: 4,
              display: "flex", flexDirection: "column", alignItems: "center", bgcolor: "#fff",
              transition: "transform 0.2s", "&:hover": { transform: "scale(1.04)" }
            }}>
              <Avatar src={item.image} sx={{ width: 70, height: 70, mb: 1, bgcolor: "#d1c4e9" }} />
              <Typography fontWeight={700} fontSize={21} color="secondary.dark">{item.type}</Typography>
              <Typography fontSize={16} color="primary.dark" mt={0.5}>
                {item.word} ➔ {item.match}
              </Typography>
              <Button variant="outlined" size="small" sx={{ mt: 2 }} onClick={() => navigate(`/sharp/practice?type=${item.type}&word=${item.word}`)}>
                Practice
              </Button>
            </Card>
          ))}
        </Stack>
      </Box>
      {/* Quick S.H.A.R.P. Tip */}
      <Box sx={{ maxWidth: 700, mx: "auto", mb: 4 }}>
        <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "#fffde7" }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <EmojiObjectsIcon color="secondary" />
            <Typography fontWeight={700} color="secondary.dark">S.H.A.R.P. Tip</Typography>
          </Stack>
          <Typography fontSize={16}>
            <b>Tip:</b> Look for patterns in words to guess their meaning!
          </Typography>
        </Paper>
      </Box>
      {/* Leaderboard */}
      <Box sx={{ maxWidth: 700, mx: "auto", mb: 4 }}>
        <Typography variant="h6" fontWeight={700} color="secondary.dark" mb={1}>S.H.A.R.P. Stars</Typography>
        <Stack direction="row" spacing={2}>
          <Chip avatar={<Avatar><StarIcon /></Avatar>} label="Aanya" color="success" />
          <Chip avatar={<Avatar><StarIcon /></Avatar>} label="Veer" color="info" />
          <Chip avatar={<Avatar><StarIcon /></Avatar>} label="Riya" color="secondary" />
        </Stack>
      </Box>
      {/* Smart Recommendations */}
      <Box sx={{ maxWidth: 700, mx: "auto" }}>
        <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "#ede7f6" }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <TrendingUpIcon color="secondary" />
            <Typography fontWeight={700} color="secondary.dark">Recommended Next</Typography>
          </Stack>
          <Typography fontSize={15} mt={1}>
            Try <b>Homonyms Quiz</b> or <b>Plural Challenge</b>!
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}