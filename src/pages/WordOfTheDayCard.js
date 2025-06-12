import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Button,
  TextField,
  Rating,
  Box,
  Tooltip,
  Stack,
  Chip,
  Avatar,
  Divider,
} from "@mui/material";
import { ArrowBack, ArrowForward, VolumeUp, FavoriteBorder, Favorite, Share, Comment as CommentIcon, BookmarkBorder, Bookmark } from "@mui/icons-material";
import SchoolIcon from "@mui/icons-material/School";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import PsychologyIcon from "@mui/icons-material/Psychology";
import StarIcon from "@mui/icons-material/Star";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import VoiceSelector from "../components/VoiceSelector";
import wordData from "./WordOfTheDayData";

import TodayIcon from "@mui/icons-material/Today";
// ...other imports

const fieldIconMap = {
  word: <EmojiObjectsIcon sx={{ color: "#1976d2" }} />,
  partOfSpeech: <PsychologyIcon sx={{ color: "#7b1fa2" }} />,
  meaning: <AutoAwesomeIcon sx={{ color: "#388e3c" }} />,
  sentence: <LightbulbIcon sx={{ color: "#fbc02d" }} />,
  synonyms: <StarIcon sx={{ color: "#0288d1" }} />,
  homonyms: <RecordVoiceOverIcon sx={{ color: "#d32f2f" }} />,
  antonyms: <PsychologyIcon sx={{ color: "#f44336" }} />,
  rhyming: <VolumeUp sx={{ color: "#00897b" }} />,
  plural: <SchoolIcon sx={{ color: "#ffb300" }} />,
};

const reviewOptions = ["Easy", "Just Right", "Challenging", "Fun", "Loved it!"];
const cardBgColors = [
  "#e3f2fd", // Light blue
  "#f1f8e9", // Light green
  "#fff8e1", // Light yellow
  "#fce4ec", // Pink
  "#ede7f6", // Lavender
];

const fieldsToRead = [
  { label: "Word", key: "word" },
  { label: "Part of Speech", key: "partOfSpeech" },
  { label: "Meaning", key: "meaning" },
  { label: "Original Sentence", key: "sentence" },
  { label: "Synonyms", key: "synonyms" },
  { label: "Homonyms", key: "homonyms" },
  { label: "Antonyms", key: "antonyms" },
  { label: "Rhyming", key: "rhyming" },
  { label: "Plural", key: "plural" },
];

const DEFAULT_PAUSE_MS = 900;

const getSpeechVoices = () =>
  new Promise((resolve) => {
    let voices = window.speechSynthesis.getVoices();
    if (voices.length) {
      resolve(voices);
      return;
    }
    window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices();
      resolve(voices);
    };
  });

export default function WordOfTheDayCard() {
  const [index, setIndex] = useState(0);
  const [rating, setRating] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [review, setReview] = useState("");
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentFieldIndex, setCurrentFieldIndex] = useState(null);

  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);

  const speechRef = useRef({ cancel: () => {} });

  useEffect(() => {
    getSpeechVoices().then(setVoices);
  }, []);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const wordObj = wordData[index];

  const seriesNumber = index + 1;
  const classGroup = "Class I-II"; // Change as needed for your system
  const dateStr = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Speech logic
  const cancelSpeech = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setCurrentFieldIndex(null);
  };

  const speakField = async (fieldIdx, cb) => {
    cancelSpeech();
    setCurrentFieldIndex(fieldIdx);
    setIsSpeaking(true);

    const field = fieldsToRead[fieldIdx];
    const txt = `${field.label}: ${wordObj[field.key]}`;
    const utter = new window.SpeechSynthesisUtterance(txt);
    if (selectedVoice) utter.voice = selectedVoice;

    utter.onend = () => {
      setTimeout(() => {
        setCurrentFieldIndex(null);
        setIsSpeaking(false);
        if (cb) cb();
      }, DEFAULT_PAUSE_MS);
    };
    utter.onerror = () => {
      setCurrentFieldIndex(null);
      setIsSpeaking(false);
      if (cb) cb();
    };

    window.speechSynthesis.speak(utter);
    speechRef.current.cancel = () => {
      window.speechSynthesis.cancel();
      setCurrentFieldIndex(null);
      setIsSpeaking(false);
    };
  };

  const speakAllFieldsSequentially = async () => {
    cancelSpeech();
    setIsSpeaking(true);
    let idx = 0;
    const speakNext = () => {
      if (idx >= fieldsToRead.length) {
        setIsSpeaking(false);
        setCurrentFieldIndex(null);
        return;
      }
      speakField(idx, () => {
        idx += 1;
        speakNext();
      });
    };
    speakNext();
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 800);
  };

  const handleNext = () => {
    cancelSpeech();
    setIndex((prev) => (prev + 1) % wordData.length);
    setRating(null);
    setFeedback("");
    setReview("");
    setComment("");
    setLiked(false);
    setSaved(false);
  };
  const handlePrev = () => {
    cancelSpeech();
    setIndex((prev) => (prev - 1 + wordData.length) % wordData.length);
    setRating(null);
    setFeedback("");
    setReview("");
    setComment("");
    setLiked(false);
    setSaved(false);
  };

  const handleVoiceChange = (voiceURI) => {
    const v = voices.find((v) => v.voiceURI === voiceURI);
    setSelectedVoice(v || null);
  };

  const getBoxStyle = (fieldIdx) => ({
    bgcolor: currentFieldIndex === fieldIdx ? "#b3e5fc" : "white",
    border: currentFieldIndex === fieldIdx ? "2px solid #1976d2" : "1px solid #e0e0e0",
    boxShadow: currentFieldIndex === fieldIdx ? "0 0 10px #1976d2448" : "none",
    cursor: isSpeaking ? "not-allowed" : "pointer",
    transition: "all 0.2s",
    minHeight: 56,
    p: 1.2,
    borderRadius: 2,
    mb: { xs: 1, sm: 0 },
    outline: "none",
    "&:active, &:focus": {
      outline: "2px solid #1976d2",
    },
    display: "flex",
    alignItems: "center",
    gap: 1.3,
  });

  // BG color by card
  const cardBg = cardBgColors[index % cardBgColors.length];

  const handleReviewSelect = (opt) => setReview(opt);

  // Social features
  const handleLike = () => setLiked((prev) => !prev);
  const handleSaveWord = () => setSaved((prev) => !prev);
  const handleShowCommentBox = () => setShowCommentBox((v) => !v);

  return (
       <Box sx={{ maxWidth: 850, mx: "auto", mt: 3, px: { xs: 1, md: 0 } }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "#1565c0",
          color: "#fff",
          borderRadius: 4,
          py: 4,
          px: { xs: 2, md: 6 },
          mb: 3,
          textAlign: "center",
          boxShadow: 3,
        }}
      >
        <Typography variant="h3" fontWeight={900} letterSpacing={2} gutterBottom>
          Word Of The Day Series!
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.93 }}>
          Unleash your vocabulary, one day at a time. Practice, listen, and master new words!
        </Typography>
      </Box>

      {/* NEW: Series Info Row */}
      <Box
        sx={{
          bgcolor: "linear-gradient(90deg,#fbc2eb 0%,#a6c1ee 100%)",
          borderRadius: 3,
          py: 2,
          px: { xs: 2, md: 6 },
          mb: 2,
          fontSize: 18,
          boxShadow: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box
          sx={{
            fontWeight: 700,
            fontSize: 19,
            color: "#6a1b9a",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <AutoAwesomeIcon sx={{ color: "#fbc02d", mr: 1 }} />
          Series @&nbsp;:&nbsp;{seriesNumber}
        </Box>
        <Box
          sx={{
            fontWeight: 700,
            fontSize: 17,
            color: "#1976d2",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <SchoolIcon sx={{ color: "#66bb6a", mr: 1 }} />
          {classGroup}
        </Box>
        <Box
          sx={{
            fontWeight: 700,
            fontSize: 17,
            color: "#d32f2f",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
    <TodayIcon sx={{ color: "#d32f2f", mr: 1 }} />
          Date&nbsp;:&nbsp;{dateStr}
        </Box>
      </Box>

      {/* Instructions block */}
      <Box
        sx={{
          bgcolor: "#e3f2fd",
          borderRadius: 3,
          py: 2,
          px: { xs: 2, md: 6 },
          mb: 2,
          fontSize: 16,
          boxShadow: 1,
        }}
      >
        <Typography sx={{ mb: 0.5 }}>
          <b>Tip:</b> Click on a box below to listen only to that part or practice your pronunciation. To hear the entire Word of the Day card, use the <b>Read Me!</b> button (choose your preferred voice!).
        </Typography>
        <Typography>
          <b>Don't forget:</b> Submit your rating, review, and feedback/comment at the bottom!
        </Typography>
      </Box>

      <Card
        sx={{
          bgcolor: cardBg,
          p: { xs: 1, sm: 2 },
          borderRadius: 4,
          boxShadow: 4,
          mb: 2,
          position: "relative",
        }}
      >
        <CardContent>
          {/* Controls */}
          <Stack direction="row" alignItems="center" spacing={1} mb={2} justifyContent="flex-end">
            <Tooltip title={liked ? "Unlike" : "Like"}>
              <IconButton onClick={handleLike} color={liked ? "error" : "default"}>
                {liked ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
            </Tooltip>
            <Tooltip title={saved ? "Unsave" : "Save"}>
              <IconButton onClick={handleSaveWord} color={saved ? "primary" : "default"}>
                {saved ? <Bookmark /> : <BookmarkBorder />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Share">
              <IconButton>
                <Share />
              </IconButton>
            </Tooltip>
            <Tooltip title="Comment">
              <IconButton onClick={handleShowCommentBox}>
                <CommentIcon />
              </IconButton>
            </Tooltip>
          </Stack>

          {/* Top row: Word & POS */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <Box
                tabIndex={0}
                sx={getBoxStyle(0)}
                onClick={() => !isSpeaking && speakField(0)}
                aria-label="Word"
              >
                {fieldIconMap.word}
                <Box>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Word:
                  </Typography>
                  <Typography variant="h6">{wordObj.word}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box
                tabIndex={0}
                sx={getBoxStyle(1)}
                onClick={() => !isSpeaking && speakField(1)}
                aria-label="Part of Speech"
              >
                {fieldIconMap.partOfSpeech}
                <Box>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Part of Speech:
                  </Typography>
                  <Typography variant="h6">{wordObj.partOfSpeech}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Meaning & Sentence */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <Box
                tabIndex={0}
                sx={{ ...getBoxStyle(2), minHeight: 72 }}
                onClick={() => !isSpeaking && speakField(2)}
                aria-label="Meaning"
              >
                {fieldIconMap.meaning}
                <Box>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Meaning:
                  </Typography>
                  <Typography>{wordObj.meaning}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box
                tabIndex={0}
                sx={{ ...getBoxStyle(3), minHeight: 72 }}
                onClick={() => !isSpeaking && speakField(3)}
                aria-label="Original Sentence"
              >
                {fieldIconMap.sentence}
                <Box>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Original Sentence:
                  </Typography>
                  <Typography>{wordObj.sentence}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Other fields */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {fieldsToRead.slice(4).map((f, idx) => (
              <Grid item xs={6} sm={2.4} key={f.key}>
                <Box
                  tabIndex={0}
                  sx={getBoxStyle(idx + 4)}
                  onClick={() => !isSpeaking && speakField(idx + 4)}
                  aria-label={f.label}
                >
                  {fieldIconMap[f.key]}
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {f.label}:
                    </Typography>
                    <Typography>{wordObj[f.key]}</Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Prev / Next & Read Me! */}
          <Stack direction="row" alignItems="center" spacing={2} mb={2} justifyContent="center">
            <Tooltip title="Previous Word">
              <span>
                <IconButton onClick={handlePrev} disabled={isSpeaking}>
                  <ArrowBack fontSize="large" />
                </IconButton>
              </span>
            </Tooltip>
            {/* Voice dropdown left of Read Me! */}
            <VoiceSelector
              onVoiceChange={handleVoiceChange}
              selectedVoice={selectedVoice ? selectedVoice.voiceURI : ""}
              voices={voices}
              sx={{ minWidth: 160 }}
            />
            <Tooltip title="Read entire card aloud">
              <span>
                <Button
                  onClick={speakAllFieldsSequentially}
                  variant="contained"
                  color="primary"
                  startIcon={<VolumeUp />}
                  disabled={isSpeaking}
                  sx={{ fontWeight: 700, ml: 1, mr: 1 }}
                >
                  {isSpeaking ? "Reading..." : "Read Me!"}
                </Button>
              </span>
            </Tooltip>
            <Tooltip title="Next Word">
              <span>
                <IconButton onClick={handleNext} disabled={isSpeaking}>
                  <ArrowForward fontSize="large" />
                </IconButton>
              </span>
            </Tooltip>
            {isSpeaking && (
              <Button
                variant="outlined"
                color="error"
                onClick={cancelSpeech}
                sx={{ ml: 2 }}
              >
                Stop Reading
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Feedback / Review / Rating / Comment */}
      <Box
        sx={{
          bgcolor: "#f1f8e9",
          borderRadius: 3,
          p: { xs: 2, md: 4 },
          mt: 2,
          mb: 3,
          boxShadow: 2,
        }}
      >
        <Typography fontWeight={700} fontSize={18} mb={1}>
          Share your thoughts!
        </Typography>
        <Typography fontSize={14} color="text.secondary" mb={1}>
          How did you find this word?
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={1} justifyContent="center" mb={2}>
          {reviewOptions.map((opt) => (
            <Chip
              key={opt}
              label={opt}
              clickable
              color={review === opt ? "primary" : "default"}
              onClick={() => handleReviewSelect(opt)}
              sx={{ fontWeight: 600, fontSize: 15 }}
            />
          ))}
        </Stack>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Typography mr={1} fontSize={16}>
            Rate this word:
          </Typography>
          <Rating
            name="word-rating"
            value={rating}
            onChange={(_, newValue) => setRating(newValue)}
            sx={{ mr: 2 }}
            disabled={isSpeaking}
          />
        </Box>
        <TextField
          label="Comment / Feedback"
          multiline
          size="small"
          fullWidth
          value={comment}
          onChange={e => setComment(e.target.value)}
          variant="outlined"
          sx={{ bgcolor: "white", my: 1 }}
          disabled={isSpeaking}
        />
        <Button
          variant="contained"
          color="success"
          onClick={handleSave}
          disabled={saving || isSpeaking}
          sx={{ mt: 1, fontWeight: 700, px: 4 }}
        >
          {saving ? "Saving..." : "Submit"}
        </Button>
      </Box>
    </Box>
  );
}