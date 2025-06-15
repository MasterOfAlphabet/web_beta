import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Button,
  Box,
  Tooltip,
  Stack,
  Skeleton
} from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
  VolumeUp,
  FavoriteBorder,
  Favorite,
  Share,
  BookmarkBorder,
  Bookmark
} from "@mui/icons-material";
import SchoolIcon from "@mui/icons-material/School";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import PsychologyIcon from "@mui/icons-material/Psychology";
import StarIcon from "@mui/icons-material/Star";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import TodayIcon from "@mui/icons-material/Today";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import CircularProgress from '@mui/material/CircularProgress';
import VoiceSelector from "../components/VoiceSelector";
import wordData from "./WordOfTheDayData";
import ReviewRatingFeedbackSection from "../components/ReviewRatingFeedbackSection";

// Updated to use component references instead of JSX elements
const FIELD_ICON_MAP = {
  word: AutoAwesomeIcon,
  partOfSpeech: PsychologyIcon,
  pronunciation: VolumeUp,
  meaning: LightbulbIcon,
  sentence: FormatQuoteIcon,
  synonyms: StarIcon,
  homonyms: RecordVoiceOverIcon,
  antonyms: PsychologyIcon,
  rhyming: VolumeUp,
  plural: SchoolIcon,
};

const CARD_BG_COLORS = [
  "#e3f2fd",
  "#f1f8e9",
  "#fff8e1",
  "#fce4ec",
  "#ede7f6",
];

const FIELDS_TO_READ = [
  { label: "Word", key: "word", icon: FIELD_ICON_MAP.word, color: "#FFD700" },
  { label: "Part of Speech", key: "partOfSpeech", icon: FIELD_ICON_MAP.partOfSpeech, color: "#7B1FA2" },
  { label: "Pronunciation", key: "pronunciation", icon: FIELD_ICON_MAP.pronunciation, color: "#1E88E5" },
  { label: "Meaning", key: "meaning", icon: FIELD_ICON_MAP.meaning, color: "#388E3C" },
  { label: "Example Sentence", key: "sentence", icon: FIELD_ICON_MAP.sentence, color: "#F57C00" },
  { label: "Synonyms", key: "synonyms", icon: FIELD_ICON_MAP.synonyms, color: "#0288D1" },
  { label: "Homonyms", key: "homonyms", icon: FIELD_ICON_MAP.homonyms, color: "#D32F2F" },
  { label: "Antonyms", key: "antonyms", icon: FIELD_ICON_MAP.antonyms, color: "#F44336" },
  { label: "Rhyming Words", key: "rhyming", icon: FIELD_ICON_MAP.rhyming, color: "#00897B" },
  { label: "Plural Form", key: "plural", icon: FIELD_ICON_MAP.plural, color: "#FFB300" },
];

const DEFAULT_PAUSE_MS = 1000;

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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentFieldIndex, setCurrentFieldIndex] = useState(null);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const speechRef = useRef({ cancel: () => {} });

  const wordObj = useMemo(() => wordData[index], [index]);

  useEffect(() => {
    getSpeechVoices().then(setVoices);
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const seriesNumber = index + 1;
  const classGroup = "Class I-II";
  const dateStr = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const cancelSpeech = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setCurrentFieldIndex(null);
  };

  const speakField = async (fieldIdx, cb) => {
    if (isSpeaking) return;
    
    cancelSpeech();
    setCurrentFieldIndex(fieldIdx);
    setIsSpeaking(true);

    const field = FIELDS_TO_READ[fieldIdx];
    const text = wordObj[field.key] ? `${field.label}: ${wordObj[field.key]}` : "";
    if (!text) {
      setIsSpeaking(false);
      setCurrentFieldIndex(null);
      if (cb) cb();
      return;
    }

    const utterance = new window.SpeechSynthesisUtterance(text);
    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.onend = () => {
      setTimeout(() => {
        setCurrentFieldIndex(null);
        setIsSpeaking(false);
        if (cb) cb();
      }, DEFAULT_PAUSE_MS);
    };

    utterance.onerror = () => {
      setCurrentFieldIndex(null);
      setIsSpeaking(false);
      if (cb) cb();
    };

    window.speechSynthesis.speak(utterance);
    speechRef.current.cancel = cancelSpeech;
  };

  const speakAllFieldsSequentially = async () => {
    if (isSpeaking) return;
    
    cancelSpeech();
    setIsSpeaking(true);
    
    let idx = 0;
    const speakNext = () => {
      if (idx >= FIELDS_TO_READ.length) {
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

  const handleNext = () => {
    cancelSpeech();
    setIndex((prev) => (prev + 1) % wordData.length);
    resetCardState();
  };

  const handlePrev = () => {
    cancelSpeech();
    setIndex((prev) => (prev - 1 + wordData.length) % wordData.length);
    resetCardState();
  };

  const resetCardState = () => {
    setLiked(false);
    setSaved(false);
    setImageLoaded(false);
  };

  const handleVoiceChange = (voiceURI) => {
    const voice = voices.find((v) => v.voiceURI === voiceURI);
    setSelectedVoice(voice || null);
  };

  const handleLike = () => setLiked((prev) => !prev);
  const handleSaveWord = () => setSaved((prev) => !prev);

  const getBoxStyle = (fieldIdx) => ({
    bgcolor: currentFieldIndex === fieldIdx ? "#b3e5fc" : "background.paper",
    border: currentFieldIndex === fieldIdx ? "2px solid #1976d2" : "1px solid #e0e0e0",
    boxShadow: currentFieldIndex === fieldIdx ? "0 0 10px rgba(25, 118, 210, 0.3)" : "none",
    cursor: isSpeaking ? "not-allowed" : "pointer",
    transition: "all 0.2s ease",
    minHeight: 56,
    p: 2,
    borderRadius: 2,
    mb: { xs: 1, sm: 0 },
    "&:hover": !isSpeaking && {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
    },
    display: "flex",
    alignItems: "center",
    gap: 2,
  });

  const cardBg = CARD_BG_COLORS[index % CARD_BG_COLORS.length];

  return (
    <Box sx={{ maxWidth: 850, mx: "auto", mt: 3, px: { xs: 1, md: 0 } }}>
      {/* Header Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
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

      {/* Info Row */}
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: 3,
          py: 2,
          px: { xs: 2, md: 4 },
          mb: 3,
          boxShadow: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AutoAwesomeIcon color="primary" />
          <Typography variant="body1" fontWeight={700}>
            Series: {seriesNumber}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <SchoolIcon color="secondary" />
          <Typography variant="body1" fontWeight={700}>
            {classGroup}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TodayIcon color="error" />
          <Typography variant="body1" fontWeight={700}>
            {dateStr}
          </Typography>
        </Box>
      </Box>

      {/* Instruction Cards */}
<Grid container spacing={3} sx={{ mb: 3, display: 'flex', flexWrap: 'nowrap' }}>
  {/* Box 1 */}
  <Grid item xs={6} sx={{ minWidth: 0 }}>  
    <Box sx={{ height: '100%',
              bgcolor: "info.light",
              borderRadius: 3,
              p: 3,
              height: "100%",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Typography variant="h6" fontWeight={700} gutterBottom>
              💡 Listening Tip
            </Typography>
            <Typography variant="body1">
              Click on any box below to listen to that specific part. Use the "Read All" button for 
              complete pronunciation practice with your chosen voice.
            </Typography>
          </Box>
        </Grid>
    <Grid item xs={6} sx={{ minWidth: 0 }}>
    <Box sx={{ height: '100%',
              bgcolor: "secondary.light",
              borderRadius: 3,
              p: 3,
              height: "100%",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Typography variant="h6" fontWeight={700} gutterBottom>
              🌟 Don't Forget
            </Typography>
            <Typography variant="body1">
              Your feedback helps us improve! Please rate the word difficulty and leave comments 
              at the bottom of the card.
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Main Card */}
      <Card
        sx={{
          bgcolor: cardBg,
          p: { xs: 1, sm: 2 },
          borderRadius: 4,
          boxShadow: 4,
          mb: 3,
          position: "relative",
        }}
      >
        <CardContent>
          {/* Word Image */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 3,
              position: "relative",
              height: 180,
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: 3,
            }}
          >
            {!imageLoaded && (
              <Skeleton variant="rectangular" width="100%" height="100%" />
            )}
            <img
              src={`https://source.unsplash.com/random/800x400/?${wordObj.word}`}
              alt={`Visual representation of ${wordObj.word}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: imageLoaded ? "block" : "none",
              }}
              onLoad={() => setImageLoaded(true)}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                p: 2,
                background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                color: "white",
                textAlign: "center",
              }}
            >
              <Typography variant="h5" fontWeight={700}>
                {wordObj.word}
              </Typography>
              <Typography variant="body2">Master your vocabulary</Typography>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Stack direction="row" spacing={1} justifyContent="center" mb={3}>
            <Tooltip title={liked ? "Unlike" : "Like"}>
              <IconButton
                onClick={handleLike}
                color={liked ? "error" : "default"}
              >
                {liked ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
            </Tooltip>
            <Tooltip title={saved ? "Unsave" : "Save"}>
              <IconButton
                onClick={handleSaveWord}
                color={saved ? "primary" : "default"}
              >
                {saved ? <Bookmark /> : <BookmarkBorder />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Share">
              <IconButton>
                <Share />
              </IconButton>
            </Tooltip>
            <Tooltip title="Practice Pronunciation">
              <IconButton onClick={() => speakField(0)}>
                <RecordVoiceOverIcon />
              </IconButton>
            </Tooltip>
          </Stack>

          {/* Word Details */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {/* Word, POS, Pronunciation */}
            {FIELDS_TO_READ.slice(0, 3).map((field, idx) => {
              const IconComponent = field.icon;
              return (
                <Grid item xs={12} sm={4} key={field.key}>
                  <Box
                    tabIndex={0}
                    sx={getBoxStyle(idx)}
                    onClick={() => !isSpeaking && speakField(idx)}
                    aria-label={`${field.label}: ${wordObj[field.key] || "Not available"}`}
                  >
                    <IconComponent sx={{ color: field.color, fontSize: 28 }} />
                    <Box>
                      <Typography variant="subtitle2" fontWeight={700} color="text.secondary">
                        {field.label}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: idx === 0 ? 800 : 600 }}>
                        {idx === 2 ? `/${wordObj[field.key] || 'none'}/` : wordObj[field.key]}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>

          {/* Meaning and Sentence */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={7}>
              <Box
                tabIndex={0}
                sx={{
                  ...getBoxStyle(3),
                  minHeight: 120,
                  p: 2.5,
                }}
                onClick={() => !isSpeaking && speakField(3)}
                aria-label={`Meaning: ${wordObj.meaning}`}
              >
                <FIELD_ICON_MAP.meaning sx={{ color: "#388E3C", fontSize: 28, mb: 1 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight={700} color="text.secondary" gutterBottom>
                    Detailed Meaning
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    {wordObj.meaning}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                tabIndex={0}
                sx={{
                  ...getBoxStyle(4),
                  minHeight: 120,
                  p: 2.5,
                }}
                onClick={() => !isSpeaking && speakField(4)}
                aria-label={`Example Sentence: ${wordObj.sentence}`}
              >
                <FIELD_ICON_MAP.sentence sx={{ color: "#F57C00", fontSize: 28, mb: 1 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight={700} color="text.secondary" gutterBottom>
                    Example Sentence
                  </Typography>
                  <Typography variant="body1" sx={{ fontStyle: "italic", lineHeight: 1.6 }}>
                    "{wordObj.sentence}"
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Additional Word Info */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {FIELDS_TO_READ.slice(5).map((field, idx) => {
              const IconComponent = field.icon;
              return (
                <Grid item xs={6} sm={4} md={3} key={field.key}>
                  <Box
                    tabIndex={0}
                    sx={getBoxStyle(idx + 5)}
                    onClick={() => !isSpeaking && speakField(idx + 5)}
                    aria-label={`${field.label}: ${wordObj[field.key] || "Not available"}`}
                  >
                    <IconComponent sx={{ color: field.color, fontSize: 24 }} />
                    <Box>
                      <Typography variant="caption" fontWeight={700} display="block" color="text.secondary">
                        {field.label}
                      </Typography>
                      <Typography variant="body2">
                        {wordObj[field.key] || "—"}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>

          {/* Controls */}
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              bgcolor: "action.hover",
              mt: 2,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2} justifyContent="center">
              <Tooltip title="Previous Word">
                <IconButton
                  onClick={handlePrev}
                  disabled={isSpeaking}
                  size="large"
                >
                  <ArrowBack />
                </IconButton>
              </Tooltip>

              <VoiceSelector
                onVoiceChange={handleVoiceChange}
                selectedVoice={selectedVoice?.voiceURI || ""}
                voices={voices}
                disabled={isSpeaking}
                sx={{ minWidth: 180 }}
              />

              <Button
                onClick={speakAllFieldsSequentially}
                variant="contained"
                color="primary"
                startIcon={<VolumeUp />}
                disabled={isSpeaking}
                sx={{ fontWeight: 700, px: 3 }}
              >
                {isSpeaking ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Read All"
                )}
              </Button>

              <Tooltip title="Next Word">
                <IconButton
                  onClick={handleNext}
                  disabled={isSpeaking}
                  size="large"
                >
                  <ArrowForward />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {/* Feedback Section */}
      <ReviewRatingFeedbackSection
        onSubmit={(data) => {
          setSaving(true);
          console.log('User feedback:', data);
          setTimeout(() => setSaving(false), 1000);
        }}
        isSubmitting={saving}
        isSpeaking={isSpeaking}
      />
    </Box>
  );
}