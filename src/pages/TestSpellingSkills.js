import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Grid,
  Button,
  LinearProgress,
  Avatar,
  Divider,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  Collapse,
  IconButton,
} from "@mui/material";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { purple, orange } from "@mui/material/colors";
import { useLocation, useNavigate } from "react-router-dom";

// DATA: I-II, plus "Review questions" as last category
const spellingSkillsAssessmentData_I_II = {
  classGroup: "I-II",
  categories: [
    {
      name: "Dictation",
      description: "Listen to the word and type it correctly.",
      questions: [
        { id: 1, word: "apple", answer: "apple" },
        { id: 2, word: "pen", answer: "pen" },
        { id: 3, word: "cake", answer: "cake" },
        { id: 4, word: "fish", answer: "fish" },
      ],
    },
    {
      name: "Find the Correct Spelling (MCQ)",
      description: "Choose the correctly spelled word from four options.",
      questions: [
        {
          id: 5,
          question: "Which is the correct spelling?",
          options: ["hous", "hose", "house", "huse"],
          answer: "house",
        },
        {
          id: 6,
          question: "Which is the correct spelling?",
          options: ["flor", "flower", "floer", "flowr"],
          answer: "flower",
        },
        {
          id: 7,
          question: "Which is the correct spelling?",
          options: ["elefant", "elephant", "elephent", "elephint"],
          answer: "elephant",
        },
        {
          id: 8,
          question: "Which is the correct spelling?",
          options: ["snak", "snake", "snaek", "snayk"],
          answer: "snake",
        },
      ],
    },
    {
      name: "Find the Missing Letter",
      description: "Fill in the missing letter to complete the word.",
      questions: [
        {
          id: 9,
          word: "c _ t",
          hint: "A pet that says meow.",
          answer: "cat",
        },
        {
          id: 10,
          word: "b _ _ l",
          hint: "You play with this.",
          answer: "ball",
        },
        {
          id: 11,
          word: "s _ _ p",
          hint: "You use this to wash your hands.",
          answer: "soap",
        },
        {
          id: 12,
          word: "h _ _ s e",
          hint: "You live in this.",
          answer: "house",
        },
      ],
    },
    {
      name: "Unscramble",
      description: "Rearrange the scrambled letters to form the correct word.",
      questions: [
        {
          id: 13,
          scrambled: "atc",
          hint: "A small animal that meows.",
          answer: "cat",
        },
        {
          id: 14,
          scrambled: "ogd",
          hint: "A pet that barks.",
          answer: "dog",
        },
        {
          id: 15,
          scrambled: "oclkc",
          hint: "Tells time on the wall.",
          answer: "clock",
        },
        {
          id: 16,
          scrambled: "nus",
          hint: "It shines in the sky during the day.",
          answer: "sun",
        },
      ],
    },
    {
      name: "Spell the Pic",
      description: "Type the word that matches the picture shown.",
      questions: [
        { id: 17, image: "apple.jpg", answer: "apple" },
        { id: 18, image: "dog.jpg", answer: "dog" },
        { id: 19, image: "star.jpg", answer: "star" },
        { id: 20, image: "fish.jpg", answer: "fish" },
      ],
    },
    
  ],
};
// Unsplash images for "Spell the Pic" and review
const picImages = {
  "apple.jpg": "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80",
  "dog.jpg": "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80",
  "star.jpg": "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
  "fish.jpg": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
  "leaf.jpg": "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=400&q=80",
};

// Dummy data for III-V, VI-X (should be replaced with your actual sets)
const spellingSkillsAssessmentData_III_V = {
  classGroup: "III-V",
  categories: [
    {
      name: "Dictation",
      description: "Listen to the word and type it correctly.",
      questions: [
        { id: 1, word: "bicycle", answer: "bicycle" },
        { id: 2, word: "library", answer: "library" },
        { id: 3, word: "elephant", answer: "elephant" },
        { id: 4, word: "beautiful", answer: "beautiful" },
      ],
    },
    {
      name: "Find the Correct Spelling (MCQ)",
      description: "Choose the correctly spelled word from four options.",
      questions: [
        {
          id: 5,
          question: "Which is the correct spelling?",
          options: ["umbrella", "umberella", "umbrellla", "umbrela"],
          answer: "umbrella",
        },
        {
          id: 6,
          question: "Which is the correct spelling?",
          options: ["mountain", "mountin", "moutain", "mounten"],
          answer: "mountain",
        },
        {
          id: 7,
          question: "Which is the correct spelling?",
          options: ["chocolate", "choclate", "chocolatte", "chocklate"],
          answer: "chocolate",
        },
        {
          id: 8,
          question: "Which is the correct spelling?",
          options: ["vegetable", "vegitable", "vegetabel", "vegeteble"],
          answer: "vegetable",
        },
      ],
    },
    {
      name: "Find the Missing Letter",
      description: "Fill in the missing letter to complete the word.",
      questions: [
        {
          id: 9,
          word: "c _ mputer",
          hint: "A machine used for calculations and the internet.",
          answer: "computer",
        },
        {
          id: 10,
          word: "th _ ught",
          hint: "An idea or opinion.",
          answer: "thought",
        },
        {
          id: 11,
          word: "ex _ rcise",
          hint: "Physical activity for health.",
          answer: "exercise",
        },
        {
          id: 12,
          word: "scho _ l",
          hint: "A place where you learn.",
          answer: "school",
        },
      ],
    },
    {
      name: "Unscramble",
      description: "Rearrange the scrambled letters to form the correct word.",
      questions: [
        {
          id: 13,
          scrambled: "environemnt",
          hint: "The surroundings where we live.",
          answer: "environment",
        },
        {
          id: 14,
          scrambled: "yadihol",
          hint: "No school on this day.",
          answer: "holiday",
        },
        {
          id: 15,
          scrambled: "rfiehdnsip",
          hint: "A bond between friends.",
          answer: "friendship",
        },
        {
          id: 16,
          scrambled: "gniar",
          hint: "Falls from clouds.",
          answer: "rain",
        },
      ],
    },
    {
      name: "Spell the Pic",
      description: "Type the word that matches the picture shown.",
      questions: [
        { id: 17, image: "giraffe.jpg", answer: "giraffe" },
        { id: 18, image: "pyramid.jpg", answer: "pyramid" },
        { id: 19, image: "helicopter.jpg", answer: "helicopter" },
        { id: 20, image: "volcano.jpg", answer: "volcano" },
      ],
    },
  ],
};
const spellingSkillsAssessmentData_VI_X = {
  classGroup: "VI-X",
  categories: [
    {
      name: "Dictation",
      description: "Listen to the word and type it correctly.",
      questions: [
        { id: 1, word: "acquaintance", answer: "acquaintance" },
        { id: 2, word: "simultaneous", answer: "simultaneous" },
        { id: 3, word: "phenomenon", answer: "phenomenon" },
        { id: 4, word: "psychology", answer: "psychology" },
      ],
    },
    {
      name: "Find the Correct Spelling (MCQ)",
      description: "Choose the correctly spelled word from four options.",
      questions: [
        {
          id: 5,
          question: "Which is the correct spelling?",
          options: ["entrepreneur", "enterpreneur", "entreprenuer", "entrepeneur"],
          answer: "entrepreneur",
        },
        {
          id: 6,
          question: "Which is the correct spelling?",
          options: ["conscientious", "consciencious", "conscientous", "conscienscious"],
          answer: "conscientious",
        },
        {
          id: 7,
          question: "Which is the correct spelling?",
          options: ["bureaucracy", "bureacracy", "bureaucrazy", "bereaucracy"],
          answer: "bureaucracy",
        },
        {
          id: 8,
          question: "Which is the correct spelling?",
          options: ["miscellaneous", "miscellanous", "miscelleneous", "miscellanious"],
          answer: "miscellaneous",
        },
      ],
    },
    {
      name: "Find the Missing Letter",
      description: "Fill in the missing letter to complete the word.",
      questions: [
        {
          id: 9,
          word: "eq _ ivalent",
          hint: "Equal in value or amount.",
          answer: "equivalent",
        },
        {
          id: 10,
          word: "nece _ sary",
          hint: "Required or needed.",
          answer: "necessary",
        },
        {
          id: 11,
          word: "occ _ rrence",
          hint: "An incident or event.",
          answer: "occurrence",
        },
        {
          id: 12,
          word: "rh _ thm",
          hint: "A strong, regular repeated pattern of movement or sound.",
          answer: "rhythm",
        },
      ],
    },
    {
      name: "Unscramble",
      description: "Rearrange the scrambled letters to form the correct word.",
      questions: [
        {
          id: 13,
          scrambled: "exaggeration",
          hint: "Making something seem bigger than it is.",
          answer: "exaggeration",
        },
        {
          id: 14,
          scrambled: "subtle",
          hint: "Not obvious; delicate.",
          answer: "subtle",
        },
        {
          id: 15,
          scrambled: "spontaneous",
          hint: "Happening without planning.",
          answer: "spontaneous",
        },
        {
          id: 16,
          scrambled: "accommodate",
          hint: "To provide room or space for someone.",
          answer: "accommodate",
        },
      ],
    },
    {
      name: "Spell the Pic",
      description: "Type the word that matches the picture shown.",
      questions: [
        { id: 17, image: "microscope.jpg", answer: "microscope" },
        { id: 18, image: "parliament.jpg", answer: "parliament" },
        { id: 19, image: "chameleon.jpg", answer: "chameleon" },
        { id: 20, image: "hieroglyphics.jpg", answer: "hieroglyphics" },
      ],
    },
    {
      name: "Review Questions",
      description: "General spelling review for Class VI-X.",
      questions: [
        {
          id: 21,
          question: "Which is the correct spelling?",
          options: ["parliament", "parliment", "parlament", "parlimant"],
          answer: "parliament",
        },
        {
          id: 22,
          scrambled: "yratnemelp",
          hint: "The highest legislature.",
          answer: "parliament",
        },
        {
          id: 23,
          word: "kn _ wledge",
          hint: "Information and skills acquired.",
          answer: "knowledge",
        },
        {
          id: 24,
          image: "parliament.jpg",
          answer: "parliament",
        },
      ],
    },
  ],
};

// Learning level function
function getLearningLevel(score) {
  if (score <= 5) return "Rookie";
  if (score <= 10) return "Racer";
  if (score <= 15) return "Master";
  if (score <= 18) return "Prodigy";
  return "Wizard";
}
function speak(text) {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    window.speechSynthesis.speak(utter);
  }
}

export default function TestSpellingSkills() {
  const location = useLocation();
  const navigate = useNavigate();
  const { student, classGroup } = location.state || {};

  // Select data set by class group
  let data;
  if (classGroup === "I-II") data = spellingSkillsAssessmentData_I_II;
  else if (classGroup === "III-V") data = spellingSkillsAssessmentData_III_V;
  else if (classGroup === "VI-X") data = spellingSkillsAssessmentData_VI_X;
  else data = spellingSkillsAssessmentData_I_II;

  // Timer setup (same as before)
  const classGroupMeta = [
    { value: "I-II", label: "Class I-II", time: 60 },
    { value: "III-V", label: "Class III-V", time: 45 },
    { value: "VI-X", label: "Class VI-X", time: 30 },
  ];
  const classMeta =
    classGroupMeta.find((g) => g.value === classGroup) || classGroupMeta[0];

  // State
  const [currentQ, setCurrentQ] = useState(0); // for I-II
  const [currentCat, setCurrentCat] = useState(0); // for III-V
  const [answers, setAnswers] = useState({});
  const [timer, setTimer] = useState(classMeta.time * 60);
  const [submitted, setSubmitted] = useState(false);
  // Collapse state for per-category review
  const [catOpen, setCatOpen] = useState({});

  // Timer effect
  useEffect(() => {
    if (submitted) return;
    if (timer <= 0) {
      handleSubmit();
      return;
    }
    const t = setInterval(() => setTimer((s) => s - 1), 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line
  }, [timer, submitted]);

  // Flatten for scoring
  const allQuestions = data.categories.flatMap((cat) =>
    cat.questions.map((q) => ({
      ...q,
      category: cat.name,
      type: cat.question ? "mcq"
        : q.word ? "missing"
        : q.scrambled ? "unscramble"
        : q.image ? "pic"
        : q.word ? "dictation"
        : "other",
    }))
  );
  const score = allQuestions.reduce(
    (acc, q) =>
      (answers[q.id]?.trim().toLowerCase() === q.answer.toLowerCase()
        ? acc + 1
        : acc),
    0
  );
  const learningLevel = getLearningLevel(score);

  // Score per category
  const categoryScores = data.categories.map(cat => ({
    name: cat.name,
    score: cat.questions.reduce((acc, q) =>
      answers[q.id]?.trim().toLowerCase() === q.answer.toLowerCase() ? acc + 1 : acc, 0
    ),
    total: cat.questions.length,
  }));

  // Handlers
  const handleAnswer = (qid, val) => setAnswers((prev) => ({ ...prev, [qid]: val }));
  const handleOption = (qid, opt) => setAnswers((a) => ({ ...a, [qid]: opt }));
  const handleNext = () => setCurrentQ((q) => q + 1);
  const handlePrev = () => setCurrentQ((q) => q - 1);
  const handleNextCat = () => setCurrentCat((i) => i + 1);
  const handlePrevCat = () => setCurrentCat((i) => i - 1);
  const handleSubmit = () => setSubmitted(true);
  const handleToggleCat = (catName) => setCatOpen(open => ({ ...open, [catName]: !open[catName] }));

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Early return for missing data
  if (!student || !classGroup) {
    return (
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="error" mb={2}>
            Missing student or class group data.<br />
            Please start the assessment again.
          </Typography>
          <Button variant="contained" color="primary" onClick={() => navigate("/")}>
            Go to Home
          </Button>
        </Paper>
      </Box>
    );
  }

  // Question renderers
  function renderDictation(q) {
    return (
      <Stack direction="row" alignItems="center" spacing={2} mb={2} key={q.id}>
        <Button variant="outlined" onClick={() => speak(q.word)}>
          Dictate
        </Button>
        <TextField
          label="Your Answer"
          value={answers[q.id] || ""}
          onChange={e => handleAnswer(q.id, e.target.value)}
          disabled={submitted}
        />
      </Stack>
    );
  }
  function renderMCQ(q) {
    return (
      <Box key={q.id} mb={2}>
        <Typography mb={1} fontWeight={600}>{q.question}</Typography>
        <RadioGroup
          value={answers[q.id] || ""}
          onChange={e => handleOption(q.id, e.target.value)}
        >
          {q.options.map((op, idx) => (
            <FormControlLabel
              key={idx}
              value={op}
              control={<Radio disabled={submitted} />}
              label={op}
            />
          ))}
        </RadioGroup>
      </Box>
    );
  }
  function renderMissing(q) {
    return (
      <Box key={q.id} mb={2}>
        <Typography fontWeight={600}>
          {q.word}
          <span style={{ color: "#888", fontWeight: 400, marginLeft: 8 }}>
            ({q.hint})
          </span>
        </Typography>
        <TextField
          label="Your Answer"
          value={answers[q.id] || ""}
          onChange={e => handleAnswer(q.id, e.target.value)}
          disabled={submitted}
          sx={{ mt: 1 }}
        />
      </Box>
    );
  }
  function renderUnscramble(q) {
    return (
      <Box key={q.id} mb={2}>
        <Typography fontWeight={600}>
          {q.scrambled}
          <span style={{ color: "#888", fontWeight: 400, marginLeft: 8 }}>
            ({q.hint})
          </span>
        </Typography>
        <TextField
          label="Your Answer"
          value={answers[q.id] || ""}
          onChange={e => handleAnswer(q.id, e.target.value)}
          disabled={submitted}
          sx={{ mt: 1 }}
        />
      </Box>
    );
  }
  function renderPic(q) {
    return (
      <Box key={q.id} mb={2}>
        <img
          src={picImages[q.image]}
          alt={q.answer}
          style={{
            width: 120,
            height: 120,
            objectFit: "cover",
            borderRadius: 12,
            border: "2px solid #e3e6ed",
            marginBottom: 8,
          }}
        />
        <TextField
          label="What is this?"
          value={answers[q.id] || ""}
          onChange={e => handleAnswer(q.id, e.target.value)}
          disabled={submitted}
          sx={{ mt: 1 }}
        />
      </Box>
    );
  }

  // Results view
  if (submitted) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f6f8fc",
          pb: 6,
          pt: { xs: 2, sm: 5 },
        }}
      >
        <Box sx={{ maxWidth: 680, mx: "auto", px: { xs: 1, sm: 2 } }}>
          <Paper
            elevation={5}
            sx={{
              borderRadius: 5,
              p: { xs: 2, sm: 4 },
              mb: 4,
              bgcolor: "#fff",
              boxShadow: "0 10px 36px 0 rgba(80,130,250,.13)",
              textAlign: "center",
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 48, color: "success.main", mb: 2 }} />
            <Typography variant="h4" fontWeight={800} color="primary" mb={1}>
              Your Learning Level: {learningLevel}
            </Typography>
            <Typography fontSize={20} color="success.main" mb={2}>
              Score: {score} / {allQuestions.length}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" fontWeight={700} color="primary" mb={1}>
              Section-wise Results
            </Typography>
            <Grid container spacing={2} mb={2} justifyContent="center">
              {categoryScores.map(cat => (
                <Grid item xs={12} sm={6} md={4} key={cat.name}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      bgcolor: "#f7fafd",
                      textAlign: "center",
                    }}
                  >
                    <Typography fontWeight={700} color="primary">
                      {cat.name}
                    </Typography>
                    <Typography fontSize={17}>
                      {cat.score} / {cat.total}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" fontWeight={700} color="primary" mb={1}>
              Your Registration Info
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: "#f7fafd",
                maxWidth: 380,
                mx: "auto",
                mb: 2,
              }}
            >
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <b>Name:</b> {student.name}
                </Grid>
                <Grid item xs={12}>
                  <b>Class:</b> {student.classLevel}
                </Grid>
                <Grid item xs={12}>
                  <b>Parent's Mobile #:</b> {student.parentMobile}
                </Grid>
                <Grid item xs={12}>
                  <b>City:</b> {student.city}
                </Grid>
                <Grid item xs={12}>
                  <b>School:</b> {student.school}
                </Grid>
              </Grid>
            </Paper>
            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight={700} color="primary" mb={1}>
              Review Answers by Category
            </Typography>
            {data.categories.map((cat, idx) => (
              <Box key={cat.name} mb={2}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  onClick={() => handleToggleCat(cat.name)}
                  sx={{
                    bgcolor: "#f5f5f5",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    cursor: "pointer",
                    mb: 1,
                  }}
                >
                  <Typography fontWeight={700} color="primary">
                    {idx + 1}. {cat.name}
                  </Typography>
                  <IconButton size="small">
                    {catOpen[cat.name] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Stack>
                <Collapse in={!!catOpen[cat.name]} timeout="auto" unmountOnExit>
                  <Box sx={{ pl: 2 }}>
                    {cat.questions.map((q, qidx) => {
                      // Type logic for review
                      let qTitle = "";
                      if (q.question) qTitle = q.question;
                      else if (q.word && !q.hint) qTitle = q.word;
                      else if (q.word && q.hint) qTitle = `${q.word} (${q.hint})`;
                      else if (q.scrambled) qTitle = `${q.scrambled} (${q.hint})`;
                      else if (q.image) qTitle = "Picture";
                      else qTitle = "";
                      const userAnswer = answers[q.id] || "";
                      const isCorrect = userAnswer.trim().toLowerCase() === q.answer.toLowerCase();
                      return (
                        <Paper
                          key={q.id}
                          sx={{
                            p: 2,
                            mb: 1.5,
                            bgcolor: isCorrect ? "#e8f5e9" : "#fff3e0",
                            borderLeft: `5px solid ${isCorrect ? "#388e3c" : "#f57c00"}`,
                            boxShadow: 0,
                          }}
                        >
                          <Typography fontWeight={600}>
                            Q{qidx + 1}: {qTitle}
                          </Typography>
                          {q.image && (
                            <img
                              src={picImages[q.image]}
                              alt={q.answer}
                              style={{
                                width: 80,
                                height: 80,
                                objectFit: "cover",
                                borderRadius: 8,
                                margin: "8px 0",
                              }}
                            />
                          )}
                          <Typography fontSize={15}>
                            <span style={{ color: "#333" }}>
                              Your Answer:{" "}
                              <b>{userAnswer ? userAnswer : <i>No answer</i>}</b>
                            </span>
                            <br />
                            <span style={{ color: "#666" }}>
                              Correct Answer: <b>{q.answer}</b>
                            </span>
                            {isCorrect ? (
                              <span style={{ color: "#43a047", fontWeight: 700, marginLeft: 8 }}>
                                ✓
                              </span>
                            ) : (
                              <span style={{ color: "#f57c00", fontWeight: 700, marginLeft: 8 }}>
                                ✗
                              </span>
                            )}
                          </Typography>
                        </Paper>
                      );
                    })}
                  </Box>
                </Collapse>
              </Box>
            ))}

            <Button
              variant="outlined"
              color="primary"
              sx={{ borderRadius: 2, mt: 2 }}
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
          </Paper>
        </Box>
      </Box>
    );
  }

  // Progressive display logic
  let displayContent, progressValue, progressText;
  if (classGroup === "I-II") {
    // One question at a time
    const allQs = data.categories.flatMap(cat =>
      cat.questions.map(q => ({ ...q, cat }))
    );
    const q = allQs[currentQ];
    progressValue = ((currentQ + 1) / allQs.length) * 100;
    progressText = `${currentQ + 1} / ${allQs.length}`;
    let qContent;
    switch (q.cat.name) {
      case "Dictation":
        qContent = renderDictation(q);
        break;
      case "Find the Correct Spelling (MCQ)":
        qContent = renderMCQ(q);
        break;
      case "Find the Missing Letter":
        qContent = renderMissing(q);
        break;
      case "Unscramble":
        qContent = renderUnscramble(q);
        break;
      case "Spell the Pic":
        qContent = renderPic(q);
        break;
      case "Review Questions":
        qContent = q.question
          ? renderMCQ(q)
          : q.word
          ? renderMissing(q)
          : q.scrambled
          ? renderUnscramble(q)
          : q.image
          ? renderPic(q)
          : null;
        break;
      default:
        qContent = null;
    }
    displayContent = (
      <>
        <Typography fontWeight={700} fontSize={18} color="primary.main" mb={2}>
          {q.cat.name}
        </Typography>
        <Typography color="text.secondary" mb={2}>
          {q.cat.description}
        </Typography>
        {qContent}
        <Stack direction="row" justifyContent="space-between" mt={3}>
          <Button
            variant="outlined"
            color="primary"
            disabled={currentQ === 0}
            onClick={handlePrev}
            sx={{ borderRadius: 2, px: 4, fontWeight: 700 }}
          >
            Previous
          </Button>
          {currentQ < allQs.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              sx={{ borderRadius: 2, px: 4, fontWeight: 700 }}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              onClick={handleSubmit}
              sx={{ borderRadius: 2, px: 4, fontWeight: 700 }}
            >
              Submit
            </Button>
          )}
        </Stack>
      </>
    );
  } else if (classGroup === "III-V") {
    // One category at a time
    const cat = data.categories[currentCat];
    progressValue = ((currentCat + 1) / data.categories.length) * 100;
    progressText = `${currentCat + 1} / ${data.categories.length}`;
    let catContent;
    switch (cat.name) {
      case "Dictation":
        catContent = cat.questions.map(renderDictation);
        break;
      case "Find the Correct Spelling (MCQ)":
        catContent = cat.questions.map(renderMCQ);
        break;
      case "Find the Missing Letter":
        catContent = cat.questions.map(renderMissing);
        break;
      case "Unscramble":
        catContent = cat.questions.map(renderUnscramble);
        break;
      case "Spell the Pic":
        catContent = cat.questions.map(renderPic);
        break;
      case "Review Questions":
        catContent = cat.questions.map(q =>
          q.question
            ? renderMCQ(q)
            : q.word
            ? renderMissing(q)
            : q.scrambled
            ? renderUnscramble(q)
            : q.image
            ? renderPic(q)
            : null
        );
        break;
      default:
        catContent = null;
    }
    displayContent = (
      <>
        <Typography fontWeight={700} fontSize={18} color="primary.main" mb={2}>
          {cat.name}
        </Typography>
        <Typography color="text.secondary" mb={2}>
          {cat.description}
        </Typography>
        {catContent}
        <Stack direction="row" justifyContent="space-between" mt={3}>
          <Button
            variant="outlined"
            color="primary"
            disabled={currentCat === 0}
            onClick={handlePrevCat}
            sx={{ borderRadius: 2, px: 4, fontWeight: 700 }}
          >
            Previous
          </Button>
          {currentCat < data.categories.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNextCat}
              sx={{ borderRadius: 2, px: 4, fontWeight: 700 }}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              onClick={handleSubmit}
              sx={{ borderRadius: 2, px: 4, fontWeight: 700 }}
            >
              Submit
            </Button>
          )}
        </Stack>
      </>
    );
  } else {
    // VI-X: All questions at once
    progressValue = 100;
    progressText = "All";
    displayContent = (
      <>
        {data.categories.map((cat, idx) => (
          <Box key={cat.name} mb={4}>
            <Typography fontWeight={700} fontSize={18} color="primary.main" mb={2}>
              {cat.name}
            </Typography>
            <Typography color="text.secondary" mb={2}>
              {cat.description}
            </Typography>
            {cat.name === "Dictation" && cat.questions.map(renderDictation)}
            {cat.name === "Find the Correct Spelling (MCQ)" && cat.questions.map(renderMCQ)}
            {cat.name === "Find the Missing Letter" && cat.questions.map(renderMissing)}
            {cat.name === "Unscramble" && cat.questions.map(renderUnscramble)}
            {cat.name === "Spell the Pic" && cat.questions.map(renderPic)}
            {cat.name === "Review Questions" && cat.questions.map(q =>
              q.question
                ? renderMCQ(q)
                : q.word
                ? renderMissing(q)
                : q.scrambled
                ? renderUnscramble(q)
                : q.image
                ? renderPic(q)
                : null
            )}
          </Box>
        ))}
        <Button
          variant="contained"
          color="success"
          onClick={handleSubmit}
          sx={{ borderRadius: 2, px: 4, fontWeight: 700, mt: 2 }}
        >
          Submit
        </Button>
      </>
    );
  }

  // Main assessment view
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f6f8fc",
        pb: 6,
        pt: { xs: 2, sm: 5 },
      }}
    >
      <Box sx={{ maxWidth: 720, mx: "auto", px: { xs: 1, sm: 2 } }}>
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
          {/* Title */}
          <Typography variant="h4" fontWeight={900} textAlign="center" color="primary" mb={3}>
            English Language Skills Test
          </Typography>

          {/* Module & Class Group */}
          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} sm={6}>
              <Paper
                elevation={0}
                sx={{
                  bgcolor: purple[100],
                  borderRadius: 3,
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <SpellcheckIcon sx={{ color: purple[400] }} />
                  <Typography fontWeight={700}>Spelling</Typography>
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper
                elevation={0}
                sx={{
                  bgcolor: orange[100],
                  borderRadius: 3,
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <Avatar sx={{ bgcolor: orange[400], width: 30, height: 30, fontSize: 18 }}>
                  {classMeta.label.charAt(6)}
                </Avatar>
                <Typography fontWeight={700}>{classMeta.label}</Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Progress Bar, Question Number, Timer */}
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <Box sx={{ flex: 1 }}>
              <LinearProgress
                variant="determinate"
                value={progressValue}
                sx={{
                  height: 10,
                  borderRadius: 5,
                }}
              />
            </Box>
            <Typography fontWeight={700} minWidth={60} textAlign="right">
              {progressText}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1} minWidth={80}>
              <AccessTimeIcon sx={{ color: orange[700] }} />
              <Typography fontWeight={700}>{formatTime(timer)}</Typography>
            </Stack>
          </Stack>
          {displayContent}
        </Paper>
      </Box>
    </Box>
  );
}