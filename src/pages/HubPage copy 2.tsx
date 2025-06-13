import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Grid,
  Card,
  Link,
  Alert,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import PsychologyIcon from "@mui/icons-material/Psychology";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import BookIcon from "@mui/icons-material/Book";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import EditNoteIcon from "@mui/icons-material/EditNote";
import HearingIcon from "@mui/icons-material/Hearing";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import EmojiEventsTrophyIcon from "@mui/icons-material/EmojiEvents";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import { blue, purple, green } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";

// --- NEW: Local Student Form (no submit button) ---
function StudentBasicForm({ value, onChange }) {
  const [form, setForm] = useState(value || {
    name: "",
    classLevel: "",
    parentMobile: "",
    city: "",
    school: "",
  });

  // Only local state for dirty tracking
  const handleChange = (e) => {
    const next = { ...form, [e.target.name]: e.target.value };
    setForm(next);
    onChange && onChange(next);
  };

  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Student Name"
            required
            style={{
              width: "100%",
              padding: "16px",
              fontSize: "18px",
              borderRadius: "16px",
              border: "1px solid #d3d3d3",
              marginBottom: "6px",
              background: "#fcfcfa",
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <select
            name="classLevel"
            value={form.classLevel}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "16px",
              fontSize: "18px",
              borderRadius: "16px",
              border: "1px solid #d3d3d3",
              color: form.classLevel ? "#222" : "#888",
              marginBottom: "6px",
              background: "#fcfcfa",
            }}
          >
            <option value="">Select Class</option>
            {["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"].map((cl) => (
              <option key={cl} value={cl}>{cl}</option>
            ))}
          </select>
        </Grid>
        <Grid item xs={12} sm={4}>
          <input
            name="parentMobile"
            value={form.parentMobile}
            onChange={handleChange}
            placeholder="Parent's Mobile #"
            required
            maxLength={10}
            style={{
              width: "100%",
              padding: "16px",
              fontSize: "18px",
              borderRadius: "16px",
              border: "1px solid #d3d3d3",
              marginBottom: "6px",
              background: "#fcfcfa",
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="City"
            required
            style={{
              width: "100%",
              padding: "16px",
              fontSize: "18px",
              borderRadius: "16px",
              border: "1px solid #d3d3d3",
              marginBottom: "6px",
              background: "#fcfcfa",
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <input
            name="school"
            value={form.school}
            onChange={handleChange}
            placeholder="School"
            required
            style={{
              width: "100%",
              padding: "16px",
              fontSize: "18px",
              borderRadius: "16px",
              border: "1px solid #d3d3d3",
              marginBottom: "6px",
              background: "#fcfcfa",
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

// Class Groups
const classGroups = [
  {
    value: "I-II",
    title: "Class I-II",
    desc: "Basic vocabulary and simple language concepts",
    icon: <SpellcheckIcon sx={{ fontSize: 42, color: purple[200] }} />,
  },
  {
    value: "III-V",
    title: "Class III-V",
    desc: "Intermediate vocabulary and language skills",
    icon: <BookIcon sx={{ fontSize: 42, color: blue[300] }} />,
  },
  {
    value: "VI-X",
    title: "Class VI-X",
    desc: "Advanced vocabulary and complex language concepts",
    icon: <MenuBookIcon sx={{ fontSize: 42, color: green[300] }} />,
  },
];

// Modules
const modules = [
  {
    key: "spelling",
    title: "Spelling",
    desc: "Test your spelling accuracy and word recognition.",
    icon: <SpellcheckIcon sx={{ fontSize: 38, color: "#e27de7" }} />,
    color: "#e27de7",
  },
  {
    key: "reading",
    title: "Reading",
    desc: "Analyze your reading comprehension and fluency.",
    icon: <ImportContactsIcon sx={{ fontSize: 38, color: "#22bdf3" }} />,
    color: "#22bdf3",
  },
  {
    key: "pronunciation",
    title: "Pronunciation",
    desc: "Evaluate your pronunciation and clarity.",
    icon: <VolumeUpIcon sx={{ fontSize: 38, color: "#ffe492" }} />,
    color: "#ffe492",
  },
  {
    key: "grammar",
    title: "Grammar",
    desc: "Challenge your grammar and usage knowledge.",
    icon: <MenuBookIcon sx={{ fontSize: 38, color: "#7be7b9" }} />,
    color: "#7be7b9",
  },
  {
    key: "writing",
    title: "Writing",
    desc: "Assess your writing skills and expression.",
    icon: <EditNoteIcon sx={{ fontSize: 38, color: "#ff90b5" }} />,
    color: "#ff90b5",
  },
  {
    key: "listening",
    title: "Listening",
    desc: "Test your listening comprehension.",
    icon: <HearingIcon sx={{ fontSize: 38, color: "#e5f27e" }} />,
    color: "#e5f27e",
  },
  {
    key: "vocabulary",
    title: "Vocabulary",
    desc: "Measure your vocabulary and word usage.",
    icon: <AutoStoriesIcon sx={{ fontSize: 38, color: "#bb97ed" }} />,
    color: "#bb97ed",
  },
  {
    key: "sharp",
    title: "S.H.A.R.P",
    desc: "Synonyms, Homonyms, Antonyms, Rhyming, Plurals.",
    icon: <GroupWorkIcon sx={{ fontSize: 38, color: "#46e2e4" }} />,
    color: "#46e2e4",
  },
  {
    key: "8-in-1",
    title: "8-In-1",
    desc: "All 8 modules in a single assessment.",
    icon: <EmojiEventsTrophyIcon sx={{ fontSize: 38, color: "#ffbc5d" }} />,
    color: "#ffbc5d",
  },
];

// Learn/Practice/Test options
const activityOptions = [
  {
    key: "learn",
    label: "LEARN",
    icon: <SchoolIcon sx={{ fontSize: 40, color: "#2196f3" }} />,
    color: "#2196f3",
    border: "#2196f3",
  },
  {
    key: "practice",
    label: "PRACTICE",
    icon: <PsychologyIcon sx={{ fontSize: 40, color: "#d5008f" }} />,
    color: "#d5008f",
    border: "#d5008f",
  },
  {
    key: "test",
    label: "TEST",
    icon: <EmojiEventsIcon sx={{ fontSize: 40, color: "#ff9800" }} />,
    color: "#ff9800",
    border: "#ff9800",
  },
];

export default function HubPage() {
  const [student, setStudent] = useState({
    name: "",
    classLevel: "",
    parentMobile: "",
    city: "",
    school: "",
  });
  const [activity, setActivity] = useState("test");
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const navigate = useNavigate();

  // Form validation for enabling Start button
  const hasStudent =
    student.name.trim() &&
    student.classLevel &&
    student.parentMobile.trim() &&
    student.city.trim() &&
    student.school.trim();

  const handleModuleStart = () => {
    if (
      activity === "test" &&
      selectedModule != null &&
      selectedClass != null &&
      hasStudent
    ) {
      if (modules[selectedModule].key === "spelling") {
        navigate("/test-spelling-skills", {
          state: {
            student: student,
            classGroup: classGroups[selectedClass].value,
          },
        });
      } else {
        alert("This module is coming soon!");
      }
    } else {
      alert("Learn and Practice coming soon!");
    }
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
      <Box sx={{ maxWidth: 1100, mx: "auto", px: { xs: 1, sm: 2 } }}>
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
          {/* --- TOP: Blue info bar and login/signup links as per IMAGE 5 --- */}
          <Alert
            icon={false}
            sx={{
              bgcolor: "#d8f7fb",
              color: "#0071a6",
              fontSize: 20,
              fontWeight: 700,
              py: 2,
              borderRadius: 2,
              mb: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span role="img" aria-label="info" style={{ fontSize: 28, marginRight: 16 }}>🛈</span>
            Sign in / Log in to save your progress & summary.
          </Alert>
          <Typography textAlign="center" sx={{ fontSize: 21, fontWeight: 400, mb: 2 }}>
            Already have an account?{" "}
            <Link href="/login" fontWeight={700} sx={{ color: "#0084d6" }}>
              Sign in
            </Link>
            {" "} | {" "}
            Don’t have one?{" "}
            <Link href="/signup" fontWeight={700} sx={{ color: "#0084d6" }}>
              Sign up!
            </Link>
          </Typography>

          {/* --- LOCAL STUDENT FORM (no button) --- */}
          <Box sx={{ mb: 4, mt: 2 }}>
            <StudentBasicForm value={student} onChange={setStudent} />
          </Box>

          {/* --- Title: What would you like to do today --- */}
          <Typography
            variant="h4"
            fontWeight={900}
            textAlign="center"
            color="#0084d6"
            mb={3}
            letterSpacing={1}
            sx={{ textShadow: "0 1px 0 #fff" }}
          >
            What would you like to do today?
          </Typography>

          {/* --- LEARN / PRACTICE / TEST options --- */}
          <Stack direction="row" spacing={4} justifyContent="center" alignItems="center" mb={4}>
            {activityOptions.map((opt) => (
              <Paper
                key={opt.key}
                elevation={activity === opt.key ? 6 : 1}
                sx={{
                  borderRadius: 3,
                  border: `2.5px solid ${opt.border}`,
                  minWidth: 120,
                  py: 2,
                  px: 4,
                  boxShadow: activity === opt.key ? 4 : 0,
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "0.18s",
                  bgcolor: activity === opt.key ? "#f6fafe" : "#fff",
                }}
                onClick={() => setActivity(opt.key)}
              >
                {opt.icon}
                <Typography
                  fontWeight={800}
                  fontSize={22}
                  color={opt.color}
                  mt={1}
                  letterSpacing={1}
                  sx={{ textShadow: "0 1px 0 #fff" }}
                >
                  {opt.label}
                </Typography>
              </Paper>
            ))}
          </Stack>

          {/* --- Select Class Group --- */}
          <Typography
            align="center"
            sx={{
              mb: 2,
              fontWeight: 900,
              fontSize: 32,
              color: "#0084d6",
              letterSpacing: 1,
              textShadow: "0 1px 0 #fff",
            }}
          >
            Select Your Class Group
          </Typography>
          <Grid container spacing={5} justifyContent="center" alignItems="center" mb={5}>
            <Grid item xs={12} md={5}>
              <Card
                elevation={selectedClass === 0 ? 8 : 2}
                sx={{
                  borderRadius: 5,
                  border: selectedClass === 0 ? "2.5px solid #e27de7" : "1px solid #e0e0e0",
                  bgcolor: "#f8fcfe",
                  cursor: "pointer",
                  mb: { xs: 3, md: 0 },
                  boxShadow: selectedClass === 0 ? 4 : 0,
                  transition: "0.18s",
                  minHeight: 180,
                }}
                onClick={() => setSelectedClass(0)}
              >
                <Stack alignItems="center" justifyContent="center" spacing={1} sx={{ py: 3 }}>
                  {classGroups[0].icon}
                  <Typography fontWeight={900} fontSize={26} color="#252525" mt={0.5}>
                    {classGroups[0].title}
                  </Typography>
                  <Typography fontSize={17} color="#444" textAlign="center" mt={1}>
                    {classGroups[0].desc}
                  </Typography>
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card
                elevation={selectedClass === 1 ? 8 : 2}
                sx={{
                  borderRadius: 5,
                  border: selectedClass === 1 ? "2.5px solid #22bdf3" : "1px solid #e0e0e0",
                  bgcolor: "#f8fcfe",
                  cursor: "pointer",
                  mb: { xs: 3, md: 0 },
                  boxShadow: selectedClass === 1 ? 4 : 0,
                  transition: "0.18s",
                  minHeight: 180,
                }}
                onClick={() => setSelectedClass(1)}
              >
                <Stack alignItems="center" justifyContent="center" spacing={1} sx={{ py: 3 }}>
                  {classGroups[1].icon}
                  <Typography fontWeight={900} fontSize={26} color="#252525" mt={0.5}>
                    {classGroups[1].title}
                  </Typography>
                  <Typography fontSize={17} color="#444" textAlign="center" mt={1}>
                    {classGroups[1].desc}
                  </Typography>
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={12} md={10} sx={{ mx: "auto" }}>
              <Card
                elevation={selectedClass === 2 ? 8 : 2}
                sx={{
                  borderRadius: 5,
                  border: selectedClass === 2 ? "2.5px solid #7be7b9" : "1px solid #e0e0e0",
                  bgcolor: "#f8fcfe",
                  cursor: "pointer",
                  boxShadow: selectedClass === 2 ? 4 : 0,
                  transition: "0.18s",
                  minHeight: 180,
                }}
                onClick={() => setSelectedClass(2)}
              >
                <Stack alignItems="center" justifyContent="center" spacing={1} sx={{ py: 3 }}>
                  {classGroups[2].icon}
                  <Typography fontWeight={900} fontSize={26} color="#252525" mt={0.5}>
                    {classGroups[2].title}
                  </Typography>
                  <Typography fontSize={17} color="#444" textAlign="center" mt={1}>
                    {classGroups[2].desc}
                  </Typography>
                </Stack>
              </Card>
            </Grid>
          </Grid>

          {/* --- MODULES --- */}
          <Typography
            align="center"
            sx={{
              mb: 3,
              fontWeight: 900,
              fontSize: 30,
              color: "#0084d6",
              letterSpacing: 1,
              textShadow: "0 1px 0 #fff",
            }}
          >
            Select a Module to Assess
          </Typography>
          <Grid container spacing={4} justifyContent="center" alignItems="center" mb={2}>
            {modules.map((mod, i) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={mod.key}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Card
                  elevation={selectedModule === i ? 8 : 1}
                  sx={{
                    borderRadius: 4,
                    border:
                      selectedModule === i
                        ? `2.5px solid ${mod.color}`
                        : "1px solid #e0e0e0",
                    bgcolor: "#f8fcfe",
                    minWidth: 260,
                    minHeight: 140,
                    cursor: "pointer",
                    boxShadow: selectedModule === i ? 8 : 0,
                    transition: "0.18s",
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={() => setSelectedModule(i)}
                >
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    spacing={1}
                    sx={{ width: "100%", py: 2 }}
                  >
                    {mod.icon}
                    <Typography
                      fontWeight={900}
                      fontSize={21}
                      color="#252525"
                      mb={0.2}
                      mt={1}
                      letterSpacing={0.5}
                    >
                      {mod.title}
                    </Typography>
                    <Typography fontSize={15} color="#666" textAlign="center">
                      {mod.desc}
                    </Typography>
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Stack alignItems="center" mt={4}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              disabled={
                selectedModule == null ||
                selectedClass == null ||
                !hasStudent
              }
              sx={{
                borderRadius: 3,
                px: 5,
                fontWeight: 900,
                fontSize: 20,
                letterSpacing: 1,
                boxShadow: 2,
              }}
              onClick={handleModuleStart}
            >
              {activity === "test"
                ? selectedModule != null
                  ? `Start ${modules[selectedModule].title} Test`
                  : "Start Test"
                : activity === "learn"
                ? selectedModule != null
                  ? `Start ${modules[selectedModule].title} Lesson`
                  : "Start Learning"
                : selectedModule != null
                ? `Start ${modules[selectedModule].title} Practice`
                : "Start Practice"}
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}