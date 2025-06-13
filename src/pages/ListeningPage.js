import React, { useState } from "react";
import {
  Box, Typography, Tabs, Tab, Paper, Button, Stack, Avatar, Chip, LinearProgress, Card
} from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
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

const listeningTasks = {
  "I-II": [
    { title: "Animal Sounds", desc: "Listen to the sound and guess the animal.", audio: "/audio/animal.mp3", image: "/images/animal.png" },
    { title: "Who is Speaking?", desc: "Listen to the voice and choose the correct character.", audio: "/audio/child.mp3", image: "/images/child.png" },
    { title: "What’s the Weather?", desc: "Is it raining or sunny?", audio: "/audio/weather.mp3", image: "/images/weather.png" },
  ],
  "III-V": [
    { title: "Short Story", desc: "Listen to the story and answer a question.", audio: "/audio/story.mp3", image: "/images/story.png" },
    { title: "Directions", desc: "Listen and follow the directions.", audio: "/audio/directions.mp3", image: "/images/directions.png" },
    { title: "Conversation", desc: "Who is talking to whom?", audio: "/audio/conversation.mp3", image: "/images/conversation.png" },
  ],
  "VI-X": [
    { title: "News Clip", desc: "Listen to a news clip and summarize.", audio: "/audio/news.mp3", image: "/images/news.png" },
    { title: "Lecture", desc: "Listen to a short lecture and take notes.", audio: "/audio/lecture.mp3", image: "/images/lecture.png" },
    { title: "Interview", desc: "Listen to an interview and answer questions.", audio: "/audio/interview.mp3", image: "/images/interview.png" },
  ],
};

export default function ListeningPage() {
  const [group, setGroup] = useState("I-II");
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f6fafd", py: 4 }}>
      {/* Hero Section */}
      <Paper elevation={4} sx={{
        maxWidth: 900, mx: "auto", p: { xs: 2, md: 4 }, borderRadius: 6,
        mb: 4, display: "flex", alignItems: "center", gap: 3, bgcolor: "#e1f5fe"
      }}>
        <Avatar sx={{ bgcolor: "#0288d1", width: 80, height: 80 }}>
          <BoltIcon sx={{ fontSize: 50 }} />
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight={900} color="info.dark">Listening Lounge</Typography>
          <Typography fontSize={19} color="text.secondary" mt={1}>
            Sharpen your listening skills with audio stories, tasks, and comprehension challenges!
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
          <LinearProgress variant="determinate" value={group === "I-II" ? 45 : group === "III-V" ? 60 : 78} sx={{ flex: 1, height: 12, borderRadius: 5 }} />
          <Chip icon={<TrendingUpIcon />} label="Level Up!" color="info" sx={{ fontWeight: 700 }} />
        </Paper>
      </Box>
      {/* Listening Tasks */}
      <Box sx={{ maxWidth: 900, mx: "auto", mb: 4 }}>
        <Typography variant="h6" fontWeight={800} mb={2} color="info.dark">
          Today's Listening Task
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3} justifyContent="center">
          {listeningTasks[group].map((item, i) => (
            <Card key={item.title} sx={{
              minWidth: 220, px: 2, py: 3, boxShadow: 3, borderRadius: 4,
              display: "flex", flexDirection: "column", alignItems: "center", bgcolor: "#fff",
              transition: "transform 0.2s", "&:hover": { transform: "scale(1.04)" }
            }}>
              <Avatar src={item.image} sx={{ width: 70, height: 70, mb: 1, bgcolor: "#b3e5fc" }} />
              <Typography fontWeight={700} fontSize={21} color="info.dark">{item.title}</Typography>
              <Typography fontSize={15} color="text.secondary" align="center" mt={0.5}>{item.desc}</Typography>
              <audio controls src={item.audio} style={{ marginTop: 10, marginBottom: 10, width: "80%" }} preload="none">
                Your browser does not support the audio element.
              </audio>
              <Button variant="outlined" size="small" sx={{ mt: 2 }} onClick={() => navigate(`/listening/task?title=${encodeURIComponent(item.title)}`)}>
                Practice
              </Button>
            </Card>
          ))}
        </Stack>
      </Box>
      {/* Quick Listening Tip */}
      <Box sx={{ maxWidth: 700, mx: "auto", mb: 4 }}>
        <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "#fffde7" }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <EmojiObjectsIcon color="info" />
            <Typography fontWeight={700} color="info.dark">Listening Tip</Typography>
          </Stack>
          <Typography fontSize={16}>
            <b>Tip:</b> Listen for keywords to catch the main idea!
          </Typography>
        </Paper>
      </Box>
      {/* Leaderboard */}
      <Box sx={{ maxWidth: 700, mx: "auto", mb: 4 }}>
        <Typography variant="h6" fontWeight={700} color="info.dark" mb={1}>Top Listeners</Typography>
        <Stack direction="row" spacing={2}>
          <Chip avatar={<Avatar><StarIcon /></Avatar>} label="Aanya" color="success" />
          <Chip avatar={<Avatar><StarIcon /></Avatar>} label="Veer" color="info" />
          <Chip avatar={<Avatar><StarIcon /></Avatar>} label="Riya" color="secondary" />
        </Stack>
      </Box>
      {/* Smart Recommendations */}
      <Box sx={{ maxWidth: 700, mx: "auto" }}>
        <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "#e1f5fe" }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <TrendingUpIcon color="info" />
            <Typography fontWeight={700} color="info.dark">Recommended Next</Typography>
          </Stack>
          <Typography fontSize={15} mt={1}>
            Try the <b>Listening Quiz</b> or <b>Story Challenge</b>!
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}