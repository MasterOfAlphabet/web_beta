import React from "react";
import { Typography, Box } from "@mui/material";

export default function HomePage() {
  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Home Page
      </Typography>
      <Typography>
        Welcome to the Master of Alphabet web app!
      </Typography>
    </Box>
  );
}