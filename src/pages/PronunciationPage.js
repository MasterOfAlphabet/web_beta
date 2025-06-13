import React, { useState } from "react";
import {
  Box, Typography, Tabs, Tab, Paper, Button, Stack, Avatar, Chip, LinearProgress, Card
} from "@mui/material";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import StarIcon from "@mui/icons-material/Star";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import HearingIcon from "@mui/icons-material/Hearing";
import { useNavigate } from "react-router-dom";

const classGroups = [
  { label: "Class I-II", value: "I-II" },
  { label: "Class III-V", value: "III-V" },
  { label: "Class VI-X", value: "VI-X" },
];

const pronunciationList = {
  "I-II": [
    { word: "cat", pronunciation: "/kæt/", audio: "/audio/cat.mp3", image: "/images/cat.png" },
    { word: "dog", pronunciation: "/dɔːg/", audio: "/audio/dog.mp3", image: "/images/dog.png" },
    { word: "sun", pronunciation: "/sʌn/", audio: "/audio/sun.mp3", image: "/images/sun.png" },
  ],
  "III-V": [
    { word: "giraffe", pronunciation: "/dʒəˈræf/", audio: "/audio/giraffe.mp3", image: "/images/giraffe.png" },
    { word: "science", pronunciation: "/ˈsaɪəns/", audio: "/audio/science.mp3", image: "/images/science.png" },
    { word: "future", pronunciation: "/ˈfjuːtʃər/", audio: "/audio/future.mp3", image: "/images/future.png" },
  ],
  "VI-X": [
    { word: "acquaintance", pronunciation: "/əˈkweɪn.təns/", audio: "/audio/acquaintance.mp3", image: "/images/acquaintance.png" },
    { word: "camouflage", pronunciation: "/ˈkæm.ə.flɑːʒ/", audio: "/audio/camouflage.mp3", image: "/images/camouflage.png" },
    { word: "conscience", pronunciation: "/ˈkɒn.ʃəns/", audio: "/audio/conscience.mp3", image: "/images/conscience.png" },
  ],
};

export default function PronunciationPage() {
  const [group, setGroup] = useState("I-II");
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f6fafd", py: 4 }}>
      {/* Hero Section */}
      <Paper elevation={4} sx={{
        maxWidth: 900, mx: "auto", p: { xs: 2, md: 4 },
        borderRadius: 6, mb: 4, display: "flex", alignItems: "center", gap: 3, bgcolor: "#f3e5f5"
      }}>
        <Avatar sx={{ bgcolor: "#ab47bc", width: 80, height: 80 }}>
          <RecordVoiceOverIcon sx={{ fontSize: 50 }} />
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight={900} color="secondary.dark">Pronunciation Lab</Typography>
          <Typography fontSize={19} color="text.secondary" mt={1}>
            Listen and practice pronunciation. Master tricky sounds and record your voice!
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
          <LinearProgress variant="determinate" value={group === "I-II" ? 38 : group === "III-V" ? 54 : 77} sx={{ flex: 1, height: 12, borderRadius: 5 }} />
          <Chip icon={<TrendingUpIcon />} label="Level Up!" color="secondary" sx={{ fontWeight: 700 }} />
        </Paper>
      </Box>
      {/* Featured Pronunciation Cards */}
      <Box sx={{ maxWidth: 900, mx: "auto", mb: 4 }}>
        <Typography variant="h6" fontWeight={800} mb={2} color="secondary.dark">
          Listen & Repeat
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3} justifyContent="center">
          {pronunciationList[group].map((item, i) => (
            <Card key={item.word} sx={{
              minWidth: 220, px: 2, py: 3, boxShadow: 3, borderRadius: 4,
              display: "flex", flexDirection: "column", alignItems: "center", bgcolor: "#fff",
              transition: "transform 0.2s", "&:hover": { transform: "scale(1.04)" }
            }}>
              <Avatar src={item.image} sx={{ width: 70, height: 70, mb: 1, bgcolor: "#ede7f6" }} />
              <Typography fontWeight={700} fontSize={22} color="secondary">{item.word}</Typography>
              <Typography fontSize={16} color="text.secondary" align="center" mt={0.5}>
                {item.pronunciation}
              </Typography>
              <audio controls src={item.audio} style={{ marginTop: 10, marginBottom: 10, width: "80%" }} preload="none">
                Your browser does not support the audio element.
              </audio>
              <Button variant="outlined" size="small"
                startIcon={<HearingIcon />} sx={{ mt: 1 }}
                onClick={() => { /* recording logic here */ }}
              >
                Practice Speaking
              </Button>
            </Card>
          ))}
        </Stack>
      </Box>
      {/* Quick Pronunciation Practice */}
      <Box sx={{ maxWidth: 700, mx: "auto", mb: 4 }}>
        <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "#fffde7" }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <EmojiObjectsIcon color="warning" />
            <Typography fontWeight={700} color="secondary.dark">Quick Practice</Typography>
          </Stack>
          <Typography fontSize={16}>
            <b>Tip:</b> Focus on the sound of "a" in "cat" – /æ/
          </Typography>
          <Button sx={{ mt: 1 }} variant="contained" color="secondary" size="small">Try Now</Button>
        </Paper>
      </Box>
      {/* Leaderboard */}
      <Box sx={{ maxWidth: 700, mx: "auto", mb: 4 }}>
        <Typography variant="h6" fontWeight={700} color="secondary" mb={1}>Top Speakers</Typography>
        <Stack direction="row" spacing={2}>
          <Chip avatar={<Avatar><StarIcon /></Avatar>} label="Aanya (99%)" color="success" />
          <Chip avatar={<Avatar><StarIcon /></Avatar>} label="Veer (98%)" color="info" />
          <Chip avatar={<Avatar><StarIcon /></Avatar>} label="Riya (98%)" color="secondary" />
        </Stack>
      </Box>
      {/* Smart Recommendations */}
      <Box sx={{ maxWidth: 700, mx: "auto" }}>
        <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "#f3e5f5" }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <TrendingUpIcon color="secondary" />
            <Typography fontWeight={700} color="secondary.dark">Recommended Next</Typography>
          </Stack>
          <Typography fontSize={15} mt={1}>
            Try the <b>Tongue Twister Challenge</b> or <b>Record Your Voice</b>!
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}