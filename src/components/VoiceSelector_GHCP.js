import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemText,
  CircularProgress,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Chip
} from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';

const DEFAULT_SAMPLE_TEXT = "Hello! This is a voice sample.";

const getFlagEmoji = (lang = '') => {
  // Lang is like 'en-US' or 'fr-FR'
  const country = lang.split('-')[1];
  if (!country) return '';
  // Unicode Regional Indicator Symbols
  return country.replace(/./g, char =>
    String.fromCodePoint(0x1f1a5 + char.toUpperCase().charCodeAt(0))
  );
};

const groupVoicesByLanguage = (voices) => {
  // Returns { 'en-US': [voice1, voice2], ... }
  return voices.reduce((acc, voice) => {
    if (!acc[voice.lang]) acc[voice.lang] = [];
    acc[voice.lang].push(voice);
    return acc;
  }, {});
};

/**
 * VoiceSelector component
 * @param {string} selectedVoice - voiceURI of selected voice
 * @param {function} onVoiceChange - callback with voiceURI
 * @param {boolean} disabled
 * @param {boolean} showPreview
 * @param {any} sx
 * @param {string} sampleText - text to play for preview
 * @param {boolean} showSearch - show search/filter input
 * @param {boolean} showGrouped - group voices by language
 * @param {array} voiceList - provide custom voices, otherwise uses system
 */
const VoiceSelector = ({
  selectedVoice,
  onVoiceChange,
  disabled = false,
  showPreview = true,
  sx = {},
  sampleText = DEFAULT_SAMPLE_TEXT,
  showSearch = true,
  showGrouped = true,
  voiceList = null, // optional: override browser voice list
}) => {
  const [voices, setVoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewing, setPreviewing] = useState(null);
  const [search, setSearch] = useState('');

  // Load voices from browser or props
  useEffect(() => {
    let cancelled = false;
    const loadVoices = () => {
      let availableVoices = voiceList || window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        // Sort by language, then by default, then by name
        availableVoices = [...availableVoices].sort((a, b) => {
          if (a.lang < b.lang) return -1;
          if (a.lang > b.lang) return 1;
          if (b.default - a.default) return b.default - a.default;
          return a.name.localeCompare(b.name);
        });
        if (!cancelled) {
          setVoices(availableVoices);
          setLoading(false);

          // Auto-select default voice if none selected
          if (!selectedVoice && availableVoices.length) {
            const defaultVoice = availableVoices.find(v => v.default) || availableVoices[0];
            onVoiceChange && onVoiceChange(defaultVoice.voiceURI);
          }
        }
      }
    };

    if (voiceList && voiceList.length) {
      setLoading(false);
      setVoices(voiceList);
    } else {
      // Try loading voices, and listen for changes
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      cancelled = true;
      window.speechSynthesis.onvoiceschanged = null;
    };
    // eslint-disable-next-line
  }, [selectedVoice, voiceList, onVoiceChange]);

  // Filtered voice list
  const filteredVoices = useMemo(() => {
    if (!search) return voices;
    return voices.filter(v =>
      (v.name + v.lang + (v.gender || '')).toLowerCase().includes(search.toLowerCase())
    );
  }, [voices, search]);

  // Grouped by language
  const groupedVoices = useMemo(() => {
    if (!showGrouped) return { All: filteredVoices };
    return groupVoicesByLanguage(filteredVoices);
  }, [filteredVoices, showGrouped]);

  // Preview voice sample
  const previewVoice = useCallback((voice) => {
    if (!showPreview || !voice) return;
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    setPreviewing(voice.voiceURI);
    const utterance = new SpeechSynthesisUtterance(sampleText);
    utterance.voice = voice;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onend = () => setPreviewing(null);
    utterance.onerror = () => setPreviewing(null);
    window.speechSynthesis.speak(utterance);
  }, [showPreview, sampleText]);

  // Voice display
  const renderVoiceOption = (voice) => (
    <MenuItem
      key={voice.voiceURI}
      value={voice.voiceURI}
      selected={selectedVoice === voice.voiceURI}
      disabled={disabled}
      dense
      sx={{ alignItems: 'center' }}
    >
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getFlagEmoji(voice.lang)}
            {voice.name}
            {voice.default && (
              <Chip
                label="Default"
                color="primary"
                size="small"
                sx={{ ml: 1, fontSize: 10 }}
                icon={<CheckCircleIcon fontSize="small" />}
              />
            )}
          </Box>
        }
        secondary={
          <Typography component="span" variant="caption" color="text.secondary">
            {voice.lang} {voice.gender ? `• ${voice.gender}` : ''}
          </Typography>
        }
      />
      {showPreview && (
        <Tooltip title={`Play sample (${voice.name})`}>
          <span>
            <IconButton
              size="small"
              sx={{ ml: 2 }}
              onClick={e => {
                e.stopPropagation();
                previewVoice(voice);
              }}
              disabled={previewing === voice.voiceURI || disabled}
            >
              {previewing === voice.voiceURI ? (
                <CircularProgress size={20} />
              ) : (
                <VolumeUpIcon fontSize="small" />
              )}
            </IconButton>
          </span>
        </Tooltip>
      )}
    </MenuItem>
  );

  return (
    <Box sx={{ width: 1, ...sx }}>
      <FormControl fullWidth disabled={disabled || loading} variant="outlined">
        <InputLabel id="voice-select-label">Voice</InputLabel>
        <Select
          labelId="voice-select-label"
          value={selectedVoice || ''}
          onChange={(e) => onVoiceChange && onVoiceChange(e.target.value)}
          label="Voice"
          renderValue={(selected) => {
            const voice = voices.find(v => v.voiceURI === selected);
            return voice
              ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getFlagEmoji(voice.lang)}
                  <span>{voice.name}</span>
                  <Typography variant="caption" sx={{ ml: 1 }} color="text.secondary">
                    {voice.lang}
                  </Typography>
                  {voice.default && (
                    <Chip
                      label="Default"
                      color="primary"
                      size="small"
                      sx={{ ml: 1, fontSize: 10 }}
                      icon={<CheckCircleIcon fontSize="small" />}
                    />
                  )}
                </Box>
              )
              : <span>Select voice</span>;
          }}
          MenuProps={{
            PaperProps: { style: { maxHeight: 350 } }
          }}
        >
          {loading ? (
            <MenuItem disabled>
              <CircularProgress size={24} />
              <Typography sx={{ ml: 2 }}>Loading voices...</Typography>
            </MenuItem>
          ) : (
            Object.keys(groupedVoices).length === 0 ? (
              <MenuItem disabled>
                <Typography>No voices found</Typography>
              </MenuItem>
            ) : (
              Object.entries(groupedVoices).map(([lang, voiceGroup]) => (
                <Box key={lang} sx={{ px: 1 }}>
                  {showGrouped && (
                    <Typography variant="caption" color="text.secondary" sx={{ pl: 2 }}>
                      {lang} {getFlagEmoji(lang)}
                    </Typography>
                  )}
                  {voiceGroup.map(renderVoiceOption)}
                </Box>
              ))
            )
          )}
        </Select>
      </FormControl>
      {/* Search/filter input */}
      {showSearch && !loading && voices.length > 6 && (
        <Box mt={2}>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            label="Search voices"
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: search && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearch('')}
                    aria-label="Clear"
                  >
                    ×
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Box>
      )}
      {/* Accessibility/UX tip */}
      {!loading && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {voices.length === 0 && "No voices available on this device/browser."}
          {voices.length > 0 && "Tip: You can try different voices and hear a sample before selecting."}
        </Typography>
      )}
    </Box>
  );
};

export default VoiceSelector;