import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ModuleGrid from "../components/ModuleGrid";
import StudentWelcomeSection from "../components/StudentWelcomeSection";

import UltimateAssessmentCard from "../components/UltimateAssessmentCard";

export default function SkillAssessmentPage() {
  const navigate = useNavigate();
  const [selectedModuleKey, setSelectedModuleKey] = useState("");
  const [studentInfo, setStudentInfo] = useState(null);

  useEffect(() => {
    const cached = localStorage.getItem("studentInfo");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setStudentInfo(parsed);
      } catch (e) {
        console.error("Failed to parse student info from localStorage", e);
      }
    }
  }, []);

  return (
    <>
      <Box sx={{ width: "100%", bgcolor: "#f0f4ff", py: 2 }}>
        <StudentWelcomeSection />
      </Box>

      <UltimateAssessmentCard />

      <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
        <Paper elevation={6} sx={{ p: 4, mb: 4, textAlign: "center" }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            🎯 Select a Module to Start Assessment
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Practice your English skills and get instant feedback on where you
            shine and where to improve!
          </Typography>
        </Paper>

        <ModuleGrid
          selectedModuleKey={selectedModuleKey}
          onModuleSelect={setSelectedModuleKey}
          showTitles
        />

        <Box sx={{ mt: 6, textAlign: "center" }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            disabled={!selectedModuleKey}
            onClick={() => navigate(`/skill-assessment/${selectedModuleKey}`)}
            sx={{ px: 6, py: 2, fontWeight: "bold" }}
          >
            Start Assessment
          </Button>
        </Box>
      </Box>
    </>
  );
}
