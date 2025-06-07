import React, { useState } from "react";
import { Box, Typography, Paper, Stack, Divider, Alert } from "@mui/material";
import StudentDataForm from "../components/StudentDataForm";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import BookIcon from "@mui/icons-material/Book";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import EditNoteIcon from "@mui/icons-material/EditNote";
import HearingIcon from "@mui/icons-material/Hearing";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import QuizIcon from "@mui/icons-material/Quiz";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import PlagiarismIcon from "@mui/icons-material/Plagiarism";
import { blue, purple, orange, green, pink, lime, deepPurple, teal, cyan } from "@mui/material/colors";

// Section configurations per module
const MODULES = [
  {
    key: "spelling",
    title: "Spelling Skills Assessment",
    subtitle: "Test your spelling accuracy and word recognition.",
    icon: <SpellcheckIcon sx={{ fontSize: 44, color: purple[400] }} />,
    color: purple[100],
    sections: [
      {
        icon: <SpellcheckIcon sx={{ fontSize: 38, color: purple[400] }} />,
        title: "Class I-II",
        desc: "Simple words and basic spelling rules.",
      },
      {
        icon: <SpellcheckIcon sx={{ fontSize: 38, color: purple[600] }} />,
        title: "Class III-V",
        desc: "Tricky words and spelling patterns.",
      },
      {
        icon: <SpellcheckIcon sx={{ fontSize: 38, color: purple[900] }} />,
        title: "Class VI-X",
        desc: "Advanced spelling and etymology.",
      },
    ],
  },
  {
    key: "reading",
    title: "Reading Skills Assessment",
    subtitle: "Analyze your reading comprehension and fluency.",
    icon: <BookIcon sx={{ fontSize: 44, color: blue[400] }} />,
    color: blue[100],
    sections: [
      {
        icon: <BookIcon sx={{ fontSize: 38, color: blue[300] }} />,
        title: "Class I-II",
        desc: "Short sentences and stories.",
      },
      {
        icon: <BookIcon sx={{ fontSize: 38, color: blue[500] }} />,
        title: "Class III-V",
        desc: "Comprehension passages and summaries.",
      },
      {
        icon: <BookIcon sx={{ fontSize: 38, color: blue[900] }} />,
        title: "Class VI-X",
        desc: "Critical reading and inference.",
      },
    ],
  },
  {
    key: "pronunciation",
    title: "Pronunciation Skills Assessment",
    subtitle: "Evaluate your pronunciation and clarity.",
    icon: <VolumeUpIcon sx={{ fontSize: 44, color: orange[400] }} />,
    color: orange[100],
    sections: [
      {
        icon: <VolumeUpIcon sx={{ fontSize: 38, color: orange[300] }} />,
        title: "Class I-II",
        desc: "Phonics and basic sounds.",
      },
      {
        icon: <VolumeUpIcon sx={{ fontSize: 38, color: orange[600] }} />,
        title: "Class III-V",
        desc: "Pronouncing multisyllabic words.",
      },
      {
        icon: <VolumeUpIcon sx={{ fontSize: 38, color: orange[800] }} />,
        title: "Class VI-X",
        desc: "Accent, stress, and intonation.",
      },
    ],
  },
  {
    key: "grammar",
    title: "Grammar Skills Assessment",
    subtitle: "Challenge your grammar and usage knowledge.",
    icon: <MenuBookIcon sx={{ fontSize: 44, color: green[400] }} />,
    color: green[100],
    sections: [
      {
        icon: <MenuBookIcon sx={{ fontSize: 38, color: green[300] }} />,
        title: "Class I-II",
        desc: "Nouns, verbs, and simple sentences.",
      },
      {
        icon: <MenuBookIcon sx={{ fontSize: 38, color: green[600] }} />,
        title: "Class III-V",
        desc: "Tenses, adjectives, and prepositions.",
      },
      {
        icon: <MenuBookIcon sx={{ fontSize: 38, color: green[900] }} />,
        title: "Class VI-X",
        desc: "Complex sentences and clauses.",
      },
    ],
  },
  {
    key: "writing",
    title: "Writing Skills Assessment",
    subtitle: "Assess your writing skills and expression.",
    icon: <EditNoteIcon sx={{ fontSize: 44, color: pink[400] }} />,
    color: pink[100],
    sections: [
      {
        icon: <EditNoteIcon sx={{ fontSize: 38, color: pink[300] }} />,
        title: "Class I-II",
        desc: "Short sentences and picture description.",
      },
      {
        icon: <EditNoteIcon sx={{ fontSize: 38, color: pink[600] }} />,
        title: "Class III-V",
        desc: "Paragraph writing and sequencing.",
      },
      {
        icon: <EditNoteIcon sx={{ fontSize: 38, color: pink[900] }} />,
        title: "Class VI-X",
        desc: "Essays, stories, and reports.",
      },
    ],
  },
  {
    key: "listening",
    title: "Listening Skills Assessment",
    subtitle: "Test your listening comprehension.",
    icon: <HearingIcon sx={{ fontSize: 44, color: lime[600] }} />,
    color: lime[100],
    sections: [
      {
        icon: <HearingIcon sx={{ fontSize: 38, color: lime[300] }} />,
        title: "Class I-II",
        desc: "Listening to short stories.",
      },
      {
        icon: <HearingIcon sx={{ fontSize: 38, color: lime[600] }} />,
        title: "Class III-V",
        desc: "Following instructions and details.",
      },
      {
        icon: <HearingIcon sx={{ fontSize: 38, color: lime[900] }} />,
        title: "Class VI-X",
        desc: "Understanding spoken English in depth.",
      },
    ],
  },
  {
    key: "vocabulary",
    title: "Vocabulary Skills Assessment",
    subtitle: "Measure your vocabulary and word usage.",
    icon: <AutoStoriesIcon sx={{ fontSize: 44, color: deepPurple[400] }} />,
    color: deepPurple[50],
    sections: [
      {
        icon: <AutoStoriesIcon sx={{ fontSize: 38, color: deepPurple[200] }} />,
        title: "Class I-II",
        desc: "Common words and picture vocabulary.",
      },
      {
        icon: <AutoStoriesIcon sx={{ fontSize: 38, color: deepPurple[500] }} />,
        title: "Class III-V",
        desc: "Synonyms, antonyms, and meanings.",
      },
      {
        icon: <AutoStoriesIcon sx={{ fontSize: 38, color: deepPurple[900] }} />,
        title: "Class VI-X",
        desc: "Advanced vocabulary and idioms.",
      },
    ],
  },
  {
    key: "sharp",
    title: "S.H.A.R.P Assessment",
    subtitle: "Test your skills across Synonyms, Homonyms, Antonyms, Rhyming, Plurals.",
    icon: <GroupWorkIcon sx={{ fontSize: 44, color: cyan[500] }} />,
    color: cyan[50],
    sections: [
      {
        icon: <SwapHorizIcon sx={{ fontSize: 38, color: cyan[400] }} />,
        title: "Synonyms",
        desc: "Words with similar meanings. Identify and match synonyms.",
      },
      {
        icon: <LibraryBooksIcon sx={{ fontSize: 38, color: cyan[700] }} />,
        title: "Homonyms",
        desc: "Words that sound alike or are spelled the same but have different meanings.",
      },
      {
        icon: <PlagiarismIcon sx={{ fontSize: 38, color: cyan[900] }} />,
        title: "Antonyms, Rhyming, Plurals",
        desc: "Opposites, words that rhyme, and correct plural forms.",
      },
    ],
  },
  {
    key: "8-in-1",
    title: "8-In-1 Skills Assessment",
    subtitle: "Try all 8 modules in a single test for a complete language profile.",
    icon: <EmojiEventsIcon sx={{ fontSize: 44, color: orange[400] }} />,
    color: orange[50],
    sections: [
      {
        icon: <EmojiEventsIcon sx={{ fontSize: 38, color: orange[300] }} />,
        title: "Class I-II",
        desc: "Basic sampler from all modules.",
      },
      {
        icon: <EmojiEventsIcon sx={{ fontSize: 38, color: orange[600] }} />,
        title: "Class III-V",
        desc: "Intermediate 8-in-1 challenge.",
      },
      {
        icon: <EmojiEventsIcon sx={{ fontSize: 38, color: orange[900] }} />,
        title: "Class VI-X",
        desc: "Advanced integrated assessment.",
      },
    ],
  },
];

// Utility to get module config from key
function getModuleConfig(moduleKey) {
  return (
    MODULES.find((mod) => mod.key === moduleKey) ||
    MODULES.find((mod) => mod.key === "spelling")
  );
}

// Main Page
export default function SkillAssessmentPage({ moduleKey = "spelling" }) {
  const [submitted, setSubmitted] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const module = getModuleConfig(moduleKey);

  const handleSubmit = (data) => {
    setStudentData(data);
    setSubmitted(true);
  };

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
          maxWidth: 780,
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
          {/* Sign In Notice */}
          <Alert
            severity="info"
            sx={{
              mb: 3,
              bgcolor: "#f2f6ff",
              borderRadius: 2,
              fontWeight: "bold",
              fontSize: 17,
              alignItems: "center",
            }}
          >
            <span>
              <b>Sign in / Login</b> to save your results and view your full summary later!
            </span>
          </Alert>

          {/* Module Title & Subtitle */}
          <Stack
            alignItems="center"
            mb={4}
            sx={{
              background: `linear-gradient(90deg, ${module.color} 0%, #fff 100%)`,
              borderRadius: 4,
              p: 2,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              {module.icon}
              <Box>
                <Typography
                  variant="h4"
                  fontWeight={900}
                  color="primary"
                  sx={{ letterSpacing: 1 }}
                  textAlign="center"
                >
                  {module.title}
                </Typography>
                <Typography
                  color="text.secondary"
                  fontWeight={500}
                  fontSize={17}
                  textAlign="center"
                >
                  {module.subtitle}
                </Typography>
              </Box>
            </Stack>
          </Stack>

          {/* Sections (like the image) */}
          <Typography fontWeight={700} fontSize={22} textAlign="center" mb={2} mt={3}>
            {module.key === "sharp"
              ? "SHARP Skills (Synonyms, Homonyms, Antonyms, Rhyming, Plurals)"
              : "Select Your Class Level"}
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            justifyContent="center"
            alignItems="stretch"
            mb={2}
          >
            {module.sections.map((section, i) => (
              <Paper
                key={section.title}
                elevation={2}
                sx={{
                  flex: 1,
                  p: 3,
                  borderRadius: 4,
                  bgcolor: "#fcfcfc",
                  textAlign: "center",
                  minWidth: 160,
                  mb: { xs: 2, sm: 0 },
                  mx: { sm: i === 1 ? 1 : 0 },
                  border: "1.5px solid #e3e6f3",
                }}
              >
                {section.icon}
                <Typography fontWeight={800} fontSize={19} mt={1} mb={0.5}>
                  {section.title}
                </Typography>
                <Typography fontSize={14} color="text.secondary">
                  {section.desc}
                </Typography>
              </Paper>
            ))}
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* Student Data Form or Coming Soon */}
          {!submitted ? (
            <StudentDataForm onSubmit={handleSubmit} />
          ) : (
            <Stack alignItems="center" py={5} spacing={3}>
              <EmojiEventsIcon sx={{ fontSize: 64, color: "primary.main" }} />
              <Typography variant="h5" fontWeight={800} color="primary">
                Coming Soon... Stay Tuned!
              </Typography>
              <Typography fontSize={16} color="text.secondary">
                Thank you, <b>{studentData.name}</b>! <br />
                You'll be able to take the <b>{module.title}</b> soon.
              </Typography>
            </Stack>
          )}
        </Paper>
      </Box>
    </Box>
  );
}