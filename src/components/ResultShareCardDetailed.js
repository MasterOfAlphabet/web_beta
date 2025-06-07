import React from "react";
import { Paper, Box, Typography, Avatar, Chip, Stack, Divider, Table, TableBody, TableCell, TableRow, TableContainer } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const levelColors = {
  Rookie: "#bdbdbd",
  Racer: "#90caf9",
  Master: "#ffd600",
  Prodigy: "#7e57c2",
  Wizard: "#43a047",
};

export const ResultShareCardDetailed = React.forwardRef(
  ({ name, score, total, module, badge, level, classLevel, city, school, categoryScores }, ref) => (
    <Paper
      ref={ref}
      elevation={8}
      sx={{
        width: 480,
        height: 640,
        p: 3,
        borderRadius: 5,
        bgcolor: "#eaf6fa",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "0 18px 42px 0 rgba(80,130,250,.10)",
        textAlign: "center",
        position: "relative",
      }}
    >
      <Box mb={1.5}>
        <Avatar
          sx={{
            width: 88,
            height: 88,
            bgcolor: levelColors[level] || "#fff59d",
            boxShadow: 3,
            mb: 1,
            mx: "auto",
          }}
        >
          <EmojiEventsIcon sx={{ fontSize: 64, color: "#ffd600" }} />
        </Avatar>
        <Typography fontWeight={900} fontSize={25} color="#0084d6" mt={1}>
          {badge || "Achievement!"}
        </Typography>
      </Box>
      <Typography fontWeight={700} fontSize={21} color="#444" mb={0.5}>
        {name}
      </Typography>
      <Typography fontSize={16.5} color="#888" mb={1}>
        completed the <b>{module}</b> assessment!
      </Typography>
      <Chip
        label={`${score} / ${total}`}
        color="success"
        sx={{
          fontSize: 23,
          minWidth: 100,
          height: 44,
          fontWeight: 800,
          mb: 1,
          bgcolor: "#aee571",
        }}
      />
      <Typography fontWeight={600} color="#0084d6" fontSize={18} mb={0.6}>
        Skill Level: {level}
      </Typography>
      <Divider sx={{ my: 1.1, width: "85%" }} />
      <Stack spacing={0.2} alignItems="center" mb={1.2}>
        {classLevel && (
          <Typography fontSize={15.5} color="#333">
            Class: <b>{classLevel}</b>
          </Typography>
        )}
        {city && (
          <Typography fontSize={15.5} color="#333">
            City: <b>{city}</b>
          </Typography>
        )}
        {school && (
          <Typography fontSize={15.5} color="#333">
            School: <b>{school}</b>
          </Typography>
        )}
      </Stack>
      {categoryScores && categoryScores.length > 0 && (
        <>
          <Divider sx={{ my: 1.5, width: "85%" }} />
          <Typography fontSize={16.2} fontWeight={700} color="#1976d2" mb={0.5}>
            Category-wise Score
          </Typography>
          <TableContainer sx={{ maxWidth: 360, mx: "auto", mt: 0, mb: 1.7, bgcolor: "transparent", boxShadow: 0 }}>
            <Table size="small">
              <TableBody>
                {categoryScores.map((cat, idx) => (
                  <TableRow key={cat.name} sx={{ "&:last-child td": { borderBottom: 0 } }}>
                    <TableCell sx={{ fontSize: 15, color: "#555" }}>{cat.name}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, fontSize: 15 }}>
                      {cat.score} / {cat.total}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
      <Divider sx={{ my: 1, width: "85%" }} />
      <Typography fontSize={15} color="#888" mt={2}>
        MasterOfAlphabet.com
      </Typography>
    </Paper>
  )
);