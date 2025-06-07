import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import BookIcon from "@mui/icons-material/Book";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import EditNoteIcon from "@mui/icons-material/EditNote";
import HearingIcon from "@mui/icons-material/Hearing";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { blue, purple, orange, green, pink, lime, deepPurple, teal, cyan } from "@mui/material/colors";

export const classGroups = [
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

export const modules = [
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