import React from "react";
import { Grid, Card, CardActionArea, Typography, Box, Avatar } from "@mui/material";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import GrammarIcon from "@mui/icons-material/LibraryBooks";
import CreateIcon from "@mui/icons-material/Create";
import HearingIcon from "@mui/icons-material/Hearing";
import LanguageIcon from "@mui/icons-material/Language";
import StarIcon from "@mui/icons-material/Star";

const modules = [
  { name: "Spelling", key: "spelling", icon: <SpellcheckIcon />, color: "#EC407A" },
  { name: "Reading", key: "reading", icon: <MenuBookIcon />, color: "#42A5F5" },
  { name: "Pronunciation", key: "pronunciation", icon: <RecordVoiceOverIcon />, color: "#AB47BC" },
  { name: "Grammar", key: "grammar", icon: <GrammarIcon />, color: "#66BB6A" },
  { name: "Writing", key: "writing", icon: <CreateIcon />, color: "#FF7043" },
  { name: "Listening", key: "listening", icon: <HearingIcon />, color: "#FFA726" },
  { name: "Vocabulary", key: "vocabulary", icon: <LanguageIcon />, color: "#26C6DA" },
  { name: "SHARP", key: "sharp", icon: <StarIcon />, color: "#7E57C2" }
];

export default function ModuleGrid({
  onModuleSelect = () => {},
  selectedModuleKey = "",
  showTitles = true
}) {
  return (
    <Grid container spacing={3} justifyContent="center">
      {modules.map((mod) => (
        <Grid item xs={6} sm={4} md={3} key={mod.key}>
          <Card
            elevation={selectedModuleKey === mod.key ? 8 : 2}
            sx={{
              backgroundColor: selectedModuleKey === mod.key ? `${mod.color}20` : "#fff",
              border: selectedModuleKey === mod.key ? `2px solid ${mod.color}` : "1px solid #eee",
              borderRadius: 3,
              transition: "0.3s",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: 6
              }
            }}
          >
            <CardActionArea
              onClick={() => onModuleSelect(mod.key)}
              sx={{ py: 4, display: "flex", flexDirection: "column", alignItems: "center" }}
            >
              <Avatar sx={{ bgcolor: mod.color, width: 56, height: 56, mb: 1 }}>
                {mod.icon}
              </Avatar>
              {showTitles && (
                <Typography variant="subtitle1" fontWeight="medium">
                  {mod.name}
                </Typography>
              )}
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
