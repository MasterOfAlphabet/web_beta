import React from "react";
import { Paper, Box, Typography, Avatar, Chip, Stack } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const levelColors = {
  Rookie: "#bdbdbd",
  Racer: "#90caf9",
  Master: "#ffd600",
  Prodigy: "#7e57c2",
  Wizard: "#43a047",
};

export const ResultShareCard = React.forwardRef(
  ({ name, score, total, module, badge, level, classLevel, city, school }, ref) => (
    <Paper
      ref={ref}
      elevation={8}
      sx={{
        width: 390,
        height: 540,
        p: 4,
        borderRadius: 5,
        bgcolor: "#f5faff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 18px 42px 0 rgba(80,130,250,.12)",
        textAlign: "center",
        position: "relative",
      }}
    >
      <Box mb={2}>
        <Avatar
          sx={{
            width: 92,
            height: 92,
            bgcolor: levelColors[level] || "#fff59d",
            boxShadow: 3,
            mb: 1,
            mx: "auto",
          }}
        >
          <EmojiEventsIcon sx={{ fontSize: 72, color: "#ffd600" }} />
        </Avatar>
        <Typography fontWeight={900} fontSize={28} color="#0084d6" mt={1}>
          {badge || "Well Done!"}
        </Typography>
      </Box>
      <Typography fontWeight={700} fontSize={22} color="#444" mb={0.5}>
        {name}
      </Typography>
      <Typography fontSize={17} color="#888" mb={1}>
        completed the <b>{module}</b> assessment!
      </Typography>
      <Chip
        label={`${score} / ${total}`}
        color="success"
        sx={{
          fontSize: 25,
          minWidth: 110,
          height: 48,
          fontWeight: 800,
          mb: 2,
          bgcolor: "#aee571",
        }}
      />
      <Typography fontWeight={600} color="#0084d6" fontSize={19} mb={1}>
        Skill Level: {level}
      </Typography>
      {(classLevel || city || school) && (
        <Stack spacing={0.2} alignItems="center" mb={0.5}>
          {classLevel && (
            <Typography fontSize={15} color="#333">
              Class: <b>{classLevel}</b>
            </Typography>
          )}
          {city && (
            <Typography fontSize={15} color="#333">
              City: <b>{city}</b>
            </Typography>
          )}
          {school && (
            <Typography fontSize={15} color="#333">
              School: <b>{school}</b>
            </Typography>
          )}
        </Stack>
      )}
      <Typography fontSize={16} color="#888" mt={3}>
        MasterOfAlphabet.com
      </Typography>
    </Paper>
  )
);