import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Alert,
  Button,
  Link,
  Divider,
  Grid,
  Card,
  CardActionArea,
} from "@mui/material";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import BookIcon from "@mui/icons-material/Book";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import EditNoteIcon from "@mui/icons-material/EditNote";
import HearingIcon from "@mui/icons-material/Hearing";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useNavigate } from "react-router-dom";
import { blue, purple, orange, green, pink, lime, deepPurple, teal, cyan } from "@mui/material/colors";

// Reusable Student Data Form
function StudentDataForm({ onSubmit, submitting }) {
  const [form, setForm] = useState({
    name: "",
    classLevel: "",
    parentMobile: "",
    city: "",
    school: "",
  });
  const [touched, setTouched] = useState({});
  const [error, setError] = useState({});

  const classOptions = [
  { value: "I", label: "I" },
  { value: "II", label: "II" },
  { value: "III", label: "III" },
  { value: "IV", label: "IV" },
  { value: "V", label: "V" },
  { value: "VI", label: "VI" },
  { value: "VII", label: "VII" },
  { value: "VIII", label: "VIII" },
  { value: "IX", label: "IX" },
  { value: "X", label: "X" },
];

  const validate = () => {
    let err = {};
    if (!form.name) err.name = "Name is required";
    if (!form.classLevel) err.classLevel = "Class is required";
    if (!form.parentMobile || !/^\d{10}$/.test(form.parentMobile))
      err.parentMobile = "Valid 10-digit mobile # required";
    if (!form.city) err.city = "City is required";
    if (!form.school) err.school = "School is required";
    setError(err);
    return Object.keys(err).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
    validate();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} mt={2} mb={2}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <input
            style={{ display: "none" }}
            tabIndex={-1}
            autoComplete="off"
          /> {/* Prevent browser autofill */}
          <input
            style={{ display: "none" }}
            tabIndex={-1}
            autoComplete="off"
          />
          <input
            style={{ display: "none" }}
            tabIndex={-1}
            autoComplete="off"
          />
          <input
            style={{ display: "none" }}
            tabIndex={-1}
            autoComplete="off"
          />
          <input
            style={{ display: "none" }}
            tabIndex={-1}
            autoComplete="off"
          />
          <input
            style={{ display: "none" }}
            tabIndex={-1}
            autoComplete="off"
          />
          {/* above is a hack for Chrome autofill */}
          <Box>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Student Name"
              required
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "16px",
                borderRadius: "8px",
                border: error.name && touched.name ? "2px solid #f44336" : "1px solid #d3d3d3",
                marginBottom: "6px",
              }}
            />
            {touched.name && error.name && (
              <Typography fontSize={12} color="error">{error.name}</Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box>
            <select
              name="classLevel"
              value={form.classLevel}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "16px",
                borderRadius: "8px",
                border: error.classLevel && touched.classLevel ? "2px solid #f44336" : "1px solid #d3d3d3",
                color: form.classLevel ? "#222" : "#888",
                marginBottom: "6px",
              }}
            >
              <option value="">Select Class</option>
              {classOptions.map((op) => (
                <option key={op.value} value={op.value}>
                  {op.label}
                </option>
              ))}
            </select>
            {touched.classLevel && error.classLevel && (
              <Typography fontSize={12} color="error">{error.classLevel}</Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box>
            <input
              name="parentMobile"
              value={form.parentMobile}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Parent's Mobile #"
              required
              maxLength={10}
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "16px",
                borderRadius: "8px",
                border: error.parentMobile && touched.parentMobile ? "2px solid #f44336" : "1px solid #d3d3d3",
                marginBottom: "6px",
              }}
            />
            {touched.parentMobile && error.parentMobile && (
              <Typography fontSize={12} color="error">{error.parentMobile}</Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="City"
              required
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "16px",
                borderRadius: "8px",
                border: error.city && touched.city ? "2px solid #f44336" : "1px solid #d3d3d3",
                marginBottom: "6px",
              }}
            />
            {touched.city && error.city && (
              <Typography fontSize={12} color="error">{error.city}</Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box>
            <input
              name="school"
              value={form.school}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="School"
              required
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "16px",
                borderRadius: "8px",
                border: error.school && touched.school ? "2px solid #f44336" : "1px solid #d3d3d3",
                marginBottom: "6px",
              }}
            />
            {touched.school && error.school && (
              <Typography fontSize={12} color="error">{error.school}</Typography>
            )}
          </Box>
        </Grid>
      </Grid>
      <Stack direction="row" justifyContent="center" mt={3}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={submitting}
          sx={{ borderRadius: 2, px: 5, fontWeight: "bold" }}
        >
          {submitting ? "Submitting..." : "Go to Module Selection"}
        </Button>
      </Stack>
    </Box>
  );
}

// Class Groups
const classGroups = [
  {
    value: "I-II",
    title: "Class I-II",
    desc: "Basic vocabulary and simple language concepts",
    icon: <SpellcheckIcon sx={{ fontSize: 36, color: purple[200] }} />,
  },
  {
    value: "III-V",
    title: "Class III-V",
    desc: "Intermediate vocabulary and language skills",
    icon: <BookIcon sx={{ fontSize: 36, color: blue[300] }} />,
  },
  {
    value: "VI-X",
    title: "Class VI-X",
    desc: "Advanced vocabulary and complex language concepts",
    icon: <MenuBookIcon sx={{ fontSize: 36, color: green[300] }} />,
  },
];

// Modules
const modules = [
  {
    key: "spelling",
    title: "Spelling",
    desc: "Test your spelling accuracy and word recognition.",
    icon: <SpellcheckIcon sx={{ fontSize: 38, color: purple[400] }} />,
    color: purple[200],
  },
  {
    key: "reading",
    title: "Reading",
    desc: "Analyze your reading comprehension and fluency.",
    icon: <BookIcon sx={{ fontSize: 38, color: blue[400] }} />,
    color: blue[200],
  },
  {
    key: "pronunciation",
    title: "Pronunciation",
    desc: "Evaluate your pronunciation and clarity.",
    icon: <VolumeUpIcon sx={{ fontSize: 38, color: orange[400] }} />,
    color: orange[200],
  },
  {
    key: "grammar",
    title: "Grammar",
    desc: "Challenge your grammar and usage knowledge.",
    icon: <MenuBookIcon sx={{ fontSize: 38, color: green[400] }} />,
    color: green[200],
  },
  {
    key: "writing",
    title: "Writing",
    desc: "Assess your writing skills and expression.",
    icon: <EditNoteIcon sx={{ fontSize: 38, color: pink[400] }} />,
    color: pink[200],
  },
  {
    key: "listening",
    title: "Listening",
    desc: "Test your listening comprehension.",
    icon: <HearingIcon sx={{ fontSize: 38, color: lime[600] }} />,
    color: lime[200],
  },
  {
    key: "vocabulary",
    title: "Vocabulary",
    desc: "Measure your vocabulary and word usage.",
    icon: <AutoStoriesIcon sx={{ fontSize: 38, color: deepPurple[400] }} />,
    color: deepPurple[200],
  },
  {
    key: "sharp",
    title: "S.H.A.R.P",
    desc: "Synonyms, Homonyms, Antonyms, Rhyming, Plurals.",
    icon: <GroupWorkIcon sx={{ fontSize: 38, color: cyan[400] }} />,
    color: cyan[200],
  },
  {
    key: "8-in-1",
    title: "8-In-1",
    desc: "All 8 modules in a single assessment.",
    icon: <EmojiEventsIcon sx={{ fontSize: 38, color: orange[400] }} />,
    color: orange[300],
  },
];

export default function SkillsAssessmentPage() {
  const [step, setStep] = useState(0); // 0: registration, 1: selection, 2: coming soon
  const [student, setStudent] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const navigate = useNavigate();

  // Dynamic button text
  const buttonText =
    selectedModule != null
      ? `Start ${modules[selectedModule].title} Skills Assessment`
      : "Start Assessment";

  // New: Get value of selected class group for navigation
  const selectedClassValue = selectedClass != null ? classGroups[selectedClass].value : null;

  // New: On button click, navigate to spelling assessment page and pass state
  const handleStart = () => {
    const modKey = modules[selectedModule].key;
    if (modKey === "spelling") {
      navigate("/skill-assessment/spelling", {
        state: {
          student: student,
          classGroup: selectedClassValue,
        },
      });
    } else {
      setStep(2);
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
      <Box sx={{ maxWidth: 900, mx: "auto", px: { xs: 1, sm: 2 } }}>
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
          {/* Title & Subtitle always at top */}
          <Typography variant="h4" fontWeight={900} textAlign="center" color="primary" mb={1}>
            English Language Skills Assessment
          </Typography>
          <Typography fontSize={18} color="text.secondary" textAlign="center" mb={3}>
            8-In-1 or One Module at a Time, towards the Mastery.
          </Typography>

          {/* Step 0: Registration */}
          {step === 0 && (
            <>
              <Alert severity="info" sx={{ mb: 1.5, fontWeight: 600 }}>
                Sign in / Log in to save your progress & summary.
              </Alert>
              <Typography textAlign="center" mb={3}>
                Already have an account?{" "}
                <Link href="/login" fontWeight={700}>
                  Sign in
                </Link>
                {"  "} | {"  "}
                Don’t have one?{" "}
                <Link href="/signup" fontWeight={700}>
                  Sign up!
                </Link>
              </Typography>
              <StudentDataForm
                onSubmit={(data) => {
                  setStudent(data);
                  setStep(1);
                }}
                submitting={false}
              />
            </>
          )}

          {/* Step 1: Selection */}
          {step === 1 && (
            <>
              <Alert severity="success" sx={{ mb: 2, fontWeight: 600 }}>
                Welcome, {student?.name}! Please select your Class Group and Assessment Module.
              </Alert>
              <Typography
                variant="h5"
                fontWeight={900}
                textAlign="center"
                color="primary"
                mb={2}
              >
                Select Your Class Group
              </Typography>
              <Grid container spacing={3} justifyContent="center" mb={4}>
                {classGroups.map((cg, i) => (
                  <Grid item xs={12} sm={4} key={cg.title}>
                    <Card
                      elevation={selectedClass === i ? 6 : 2}
                      sx={{
                        borderRadius: 4,
                        border:
                          selectedClass === i
                            ? "2.5px solid #1976d2"
                            : "1px solid #e0e0e0",
                        bgcolor:
                          selectedClass === i ? "#e3f2fd" : "#f7fafc",
                        transition: "all 0.15s",
                      }}
                    >
                      <CardActionArea onClick={() => setSelectedClass(i)}>
                        <Stack
                          alignItems="center"
                          spacing={1}
                          sx={{ minHeight: 120, p: 2 }}
                        >
                          {cg.icon}
                          <Typography
                            fontWeight={700}
                            fontSize={18}
                            mt={0.5}
                            color={selectedClass === i ? "primary" : "text.primary"}
                          >
                            {cg.title}
                          </Typography>
                          <Typography fontSize={13} color="text.secondary" textAlign="center">
                            {cg.desc}
                          </Typography>
                        </Stack>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography
                variant="h5"
                fontWeight={900}
                textAlign="center"
                color="primary"
                mb={2}
              >
                Select a Module to Assess
              </Typography>
              <Grid container spacing={3} justifyContent="center" mb={3}>
                {modules.map((mod, i) => (
                  <Grid item xs={12} sm={4} md={4} lg={3} key={mod.key}>
                    <Card
                      elevation={selectedModule === i ? 6 : 2}
                      sx={{
                        borderRadius: 4,
                        border:
                          selectedModule === i
                            ? `2.5px solid ${mod.color}`
                            : "1px solid #e0e0e0",
                        bgcolor:
                          selectedModule === i
                            ? mod.color + "22"
                            : "#fcfcfc",
                        transition: "all 0.15s",
                      }}
                    >
                      <CardActionArea
                        onClick={() => setSelectedModule(i)}
                        disabled={selectedClass == null}
                      >
                        <Stack
                          alignItems="center"
                          spacing={1}
                          sx={{
                            minHeight: 120,
                            p: 2,
                            opacity: selectedClass == null ? 0.5 : 1,
                          }}
                        >
                          {mod.icon}
                          <Typography
                            fontWeight={700}
                            fontSize={17}
                            color={
                              selectedModule === i ? "primary" : "text.primary"
                            }
                            textAlign="center"
                          >
                            {mod.title}
                          </Typography>
                          <Typography fontSize={13} color="text.secondary" textAlign="center">
                            {mod.desc}
                          </Typography>
                        </Stack>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              <Stack alignItems="center" mt={4}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={selectedModule == null || selectedClass == null}
                  sx={{ borderRadius: 3, px: 4, fontWeight: 700 }}
                  onClick={handleStart}
                >
                  {buttonText}
                </Button>
              </Stack>
            </>
          )}

          {/* Step 2: Coming Soon */}
          {step === 2 && (
            <Stack alignItems="center" py={5} spacing={3}>
              <EmojiEventsIcon sx={{ fontSize: 64, color: "primary.main" }} />
              <Typography variant="h5" fontWeight={800} color="primary">
                Coming Soon... Stay Tuned!
              </Typography>
              <Typography fontSize={16} color="text.secondary" textAlign="center">
                Thank you, <b>{student?.name}</b>! <br />
                You'll be able to take the <b>{selectedModule != null ? modules[selectedModule].title : ""} Skills Assessment</b> soon.
              </Typography>
            </Stack>
          )}
        </Paper>
      </Box>
    </Box>
  );
}