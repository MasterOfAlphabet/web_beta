import React, { useEffect, useState } from "react";
import { FormControl, InputLabel, Select, MenuItem, Box, Typography } from "@mui/material";

/**
 * VoiceSelector - Dropdown for selecting Web Speech Synthesis voice.
 *
 * Props:
 *   value - the current selected voice URI (string)
 *   onChange - function(voiceURI: string) called when user selects a voice
 *   filterLang - optional lang prefix (default: "en")
 */
export default function VoiceSelector({ value, onChange, filterLang = "en" }) {
  const [voices, setVoices] = useState([]);

  // Load voices
  useEffect(() => {
    function loadVoices() {
      let vs = window.speechSynthesis.getVoices();
      if (filterLang) {
        vs = vs.filter(v => v.lang && v.lang.startsWith(filterLang));
      }
      setVoices(vs);
    }
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    } else {
      loadVoices();
    }
  }, [filterLang]);

  // Find readable label
  function getVoiceLabel(v) {
    return `${v.name} (${v.lang})${v.default ? " [default]" : ""}`;
  }

  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel id="voice-select-label">Voice</InputLabel>
        <Select
          labelId="voice-select-label"
          value={value || ""}
          label="Voice"
          onChange={e => onChange && onChange(e.target.value)}
        >
          {voices.map((v) => (
            <MenuItem value={v.voiceURI} key={v.voiceURI}>
              {getVoiceLabel(v)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {voices.length === 0 && (
        <Typography variant="caption" color="text.secondary">
          No voices found. Try refreshing the page.
        </Typography>
      )}
    </Box>
  );
}