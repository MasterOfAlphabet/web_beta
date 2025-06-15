import React, { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemText,
  CircularProgress,
  Box,
  Typography
} from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

const VoiceSelector = ({
  selectedVoice,
  onVoiceChange,
  disabled = false,
  showPreview = false,
  sx = {}
}) => {
  const [voices, setVoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewing, setPreviewing] = useState(null);

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        setLoading(false);
        
        // Auto-select default voice if none selected
        if (!selectedVoice && availableVoices.length) {
          const defaultVoice = availableVoices.find(v => v.default) || availableVoices[0];
          onVoiceChange(defaultVoice.voiceURI);
        }
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [selectedVoice, onVoiceChange]);

  // Preview voice sample
  const previewVoice = (voiceURI) => {
    if (!showPreview) return;
    
    const voice = voices.find(v => v.voiceURI === voiceURI);
    if (!voice) return;

    setPreviewing(voiceURI);
    const utterance = new SpeechSynthesisUtterance("Listen to my voice sample");
    utterance.voice = voice;
    utterance.onend = () => setPreviewing(null);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <FormControl fullWidth sx={sx} disabled={disabled || loading}>
      <InputLabel>Voice</InputLabel>
      <Select
        value={selectedVoice || ''}
        onChange={(e) => onVoiceChange(e.target.value)}
        label="Voice"
        renderValue={(selected) => {
          const voice = voices.find(v => v.voiceURI === selected);
          return voice ? `${voice.name} (${voice.lang})` : 'Select voice';
        }}
      >
        {loading ? (
          <MenuItem disabled>
            <CircularProgress size={24} />
            <Typography sx={{ ml: 2 }}>Loading voices...</Typography>
          </MenuItem>
        ) : (
          voices.map((voice) => (
            <MenuItem
              key={voice.voiceURI}
              value={voice.voiceURI}
              onMouseEnter={() => previewVoice(voice.voiceURI)}
            >
              <ListItemText
                primary={voice.name}
                secondary={`${voice.lang} ${voice.default ? '• Default' : ''}`}
              />
              {showPreview && (
                <Box sx={{ ml: 2 }}>
                  {previewing === voice.voiceURI ? (
                    <CircularProgress size={20} />
                  ) : (
                    <VolumeUpIcon fontSize="small" />
                  )}
                </Box>
              )}
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
};

export default VoiceSelector;