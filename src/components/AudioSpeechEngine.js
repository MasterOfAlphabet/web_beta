import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Mic, MicOff, Volume2, VolumeX, Play, Pause, RotateCcw, AlertCircle, CheckCircle2,
} from 'lucide-react';

// ==================== Constants & Config ====================
const SPEECH_CONFIG = {
  RECOGNITION: {
    language: 'en-US',
    continuous: false,
    interimResults: true,
    maxAlternatives: 3,
    timeout: 10000, // 10 seconds timeout
    retryDelay: 1500, // 1.5s between retries
  },
  SYNTHESIS: {
    'I-II': { rate: 0.8, pitch: 1.2, volume: 1.0 },
    'III-V': { rate: 0.9, pitch: 1.0, volume: 1.0 },
    'VI-X': { rate: 1.0, pitch: 1.0, volume: 1.0 },
  },
  AUDIO: {
    fftSize: 256,
    smoothingTimeConstant: 0.8,
    minUpdateInterval: 100, // Reduced from 50ms to 100ms for performance
  },
  THRESHOLDS: {
    'I-II': { minAccuracy: 0.5, scoreMultiplier: 1.2 },
    'III-V': { minAccuracy: 0.65, scoreMultiplier: 1.0 },
    'VI-X': { minAccuracy: 0.75, scoreMultiplier: 0.9 },
  },
  SCORING_WEIGHTS: {
    similarity: 0.5,
    confidence: 0.3,
    stressMatch: 0.2,
  },
  MAX_TEXT_LENGTH: 48,
  MAX_RETRIES: 3,
};

const FEEDBACK_MESSAGES = {
  'I-II': {
    excellent: ['🌟 Perfect! You\'re a star!', '🎉 Amazing job!', '🏆 You did it!'],
    good: ['😊 Good try! Almost there!', '👍 Nice work!', '🌈 Keep going!'],
    poor: ['💪 Try again! You can do it!', '🎯 Listen and repeat!', '🌟 Practice makes perfect!'],
  },
  'III-V': {
    excellent: ['🌟 Excellent pronunciation!', '🎯 Spot on! Well done!', '🏆 Perfect accuracy!'],
    good: ['👍 Good effort! Getting closer!', '😊 Nice try! Keep practicing!', '🎵 Almost perfect!'],
    poor: ['🎯 Focus on the sounds!', '📚 Listen carefully and try again!', '💡 Break it into syllables!'],
  },
  'VI-X': {
    excellent: ['🌟 Outstanding pronunciation mastery!', '🎯 Flawless execution!', '🏆 Exceptional accuracy!'],
    good: ['👍 Solid pronunciation skills!', '😊 Good accuracy, minor adjustments needed!', '📈 Showing improvement!'],
    poor: ['🎯 Focus on phonetic accuracy!', '📚 Analyze the sound patterns!', '💡 Consider stress and intonation!'],
  },
};

const STRESS_PATTERNS = {
  'I-II': /([A-Za-z]{2,})/gi,
  'III-V': /([A-Za-z]{3,})/gi,
  'VI-X': /([A-Za-z]{4,})/gi,
};

const BROWSER_GUIDANCE = {
  recognition: {
    title: "Speech Recognition Not Supported",
    message: "Your browser doesn't support the Speech Recognition API required for recording and analyzing your pronunciation. Please use a modern browser such as Chrome or Edge, and ensure microphone permissions are enabled.",
    links: [
      { label: "Chrome Download", url: "https://www.google.com/chrome/" },
      { label: "Edge Download", url: "https://www.microsoft.com/edge" },
    ]
  },
  synthesis: {
    title: "Speech Synthesis Not Supported",
    message: "Your browser doesn't support the Speech Synthesis API required for text-to-speech playback. Please use a modern browser.",
    links: [
      { label: "Chrome Download", url: "https://www.google.com/chrome/" },
      { label: "Edge Download", url: "https://www.microsoft.com/edge" },
    ]
  },
  mic: {
    title: "Microphone Not Detected",
    message: "Microphone access is required for pronunciation analysis. Please connect a microphone and allow website access.",
    links: [
      { label: "Microphone Privacy Settings (Windows)", url: "ms-settings:privacy-microphone" },
      { label: "Microphone Settings (Mac)", url: "x-apple.systempreferences:com.apple.preference.security?Privacy_Microphone" },
    ]
  },
  audiocontext: {
    title: "Audio Context Not Supported",
    message: "Your browser does not support low-level audio features required for audio visualization. Please use Chrome or a Chromium-based browser.",
    links: [
      { label: "Chrome Download", url: "https://www.google.com/chrome/" }
    ]
  }
};

// ==================== Utility Functions ====================
const getRecognitionErrorMessage = (error) => {
  const errorMessages = {
    'no-speech': 'No speech was detected. Please try again.',
    'audio-capture': 'Audio capture failed. Please check your microphone and permissions.',
    'not-allowed': 'Microphone access denied. Please enable microphone permissions and refresh the page.',
    'network': 'Network error occurred. Please check your connection.',
    'service-not-allowed': 'Speech recognition service is not available.',
    'bad-grammar': 'Grammar error in speech recognition.',
    'language-not-supported': 'Language not supported.',
    'aborted': 'Speech recognition was aborted.',
  };
  return errorMessages[error] || `Speech recognition error: ${error}`;
};

const clampText = (str) =>
  str.length > SPEECH_CONFIG.MAX_TEXT_LENGTH
    ? str.slice(0, SPEECH_CONFIG.MAX_TEXT_LENGTH)
    : str;

const levenshteinDistance = (str1, str2) => {
  str1 = clampText(str1);
  str2 = clampText(str2);
  const m = str1.length;
  const n = str2.length;
  if (m === 0) return n;
  if (n === 0) return m;
  let prev = Array(n + 1).fill(0);
  let curr = Array(n + 1).fill(0);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        curr[j - 1] + 1,
        prev[j] + 1,
        prev[j - 1] + cost,
      );
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
};

const calculateSimilarity = (str1, str2) => {
  if (!str1 || !str2) return 0;
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  if (longer.length === 0) return 1.0;
  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
};

const detectStressPatterns = (text, classGroup) => {
  if (!text) return [];
  const pattern = STRESS_PATTERNS[classGroup];
  const matches = text.match(pattern) || [];
  return matches.map(word => ({
    word,
    stressed: word.length > 3 ? word.slice(0, 3) : word // Simple stress detection
  }));
};

const compareStressPatterns = (spoken, target, classGroup) => {
  const spokenStress = detectStressPatterns(spoken, classGroup);
  const targetStress = detectStressPatterns(target, classGroup);
  
  if (spokenStress.length === 0 || targetStress.length === 0) return 0;
  
  let matches = 0;
  spokenStress.forEach((sWord, i) => {
    const tWord = targetStress[i];
    if (tWord && sWord.stressed === tWord.stressed) {
      matches++;
    }
  });
  
  return matches / Math.max(spokenStress.length, targetStress.length);
};

const generateFeedback = (score, classGroup, phoneticAnalysis) => {
  const level = score >= 0.8 ? 'excellent' : score >= 0.6 ? 'good' : 'poor';
  const messages = FEEDBACK_MESSAGES[classGroup][level];
  let feedback = messages[Math.floor(Math.random() * messages.length)];
  
  if (phoneticAnalysis) {
    if (phoneticAnalysis.vowelAccuracy < 0.7) {
      feedback += ' Pay attention to your vowel sounds.';
    }
    if (phoneticAnalysis.consonantAccuracy < 0.7) {
      feedback += ' Work on your consonant clarity.';
    }
  }
  
  return feedback;
};

const generatePhoneticAnalysis = (spoken, target, classGroup) => {
  if (!spoken || !target) return null;
  
  const vowels = 'aeiouAEIOU';
  const consonants = 'bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ';
  
  const spokenVowels = spoken.split('').filter(char => vowels.includes(char));
  const targetVowels = target.split('').filter(char => vowels.includes(char));
  const spokenConsonants = spoken.split('').filter(char => consonants.includes(char));
  const targetConsonants = target.split('').filter(char => consonants.includes(char));
  
  const vowelAccuracy = calculateSimilarity(spokenVowels.join(''), targetVowels.join(''));
  const consonantAccuracy = calculateSimilarity(spokenConsonants.join(''), targetConsonants.join(''));
  const stressAccuracy = compareStressPatterns(spoken, target, classGroup);
  
  return {
    vowelAccuracy,
    consonantAccuracy,
    stressAccuracy,
    suggestions: [
      ...(vowelAccuracy < 0.7 ? ['Focus on vowel clarity'] : []),
      ...(consonantAccuracy < 0.7 ? ['Work on consonant precision'] : []),
      ...(stressAccuracy < 0.7 ? ['Pay attention to word stress'] : []),
    ],
  };
};

const analyzePronunciation = (spoken, target, confidence, classGroup) => {
  if (!spoken || !target) {
    return {
      transcript: spoken || '',
      target: target || '',
      confidence: 0,
      similarity: 0,
      score: 0,
      accuracy: 0,
      passed: false,
      feedback: 'No speech detected',
      phonetics: null,
    };
  }

  const similarity = calculateSimilarity(spoken.toLowerCase(), target.toLowerCase());
  const phoneticAnalysis = generatePhoneticAnalysis(spoken, target, classGroup);
  const stressMatch = phoneticAnalysis?.stressAccuracy || 0;
  
  const { minAccuracy, scoreMultiplier } = SPEECH_CONFIG.THRESHOLDS[classGroup];
  const { similarity: simWeight, confidence: confWeight, stressMatch: stressWeight } = SPEECH_CONFIG.SCORING_WEIGHTS;
  
  const baseScore = (
    similarity * simWeight +
    confidence * confWeight +
    stressMatch * stressWeight
  ) * scoreMultiplier;
  
  const finalScore = Math.max(0, Math.min(1, baseScore));
  const accuracy = finalScore * 100;
  const passed = finalScore >= minAccuracy;
  
  return {
    transcript: spoken,
    target: target,
    confidence: confidence,
    similarity: similarity,
    score: finalScore,
    accuracy: accuracy,
    passed: passed,
    feedback: generateFeedback(finalScore, classGroup, phoneticAnalysis),
    phonetics: phoneticAnalysis,
  };
};

// ==================== Custom Hooks ====================
const useAudioSupport = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState(null);
  const [featureCheck, setFeatureCheck] = useState({
    recognition: false,
    synthesis: false,
    mic: false,
    audiocontext: false,
  });

  useEffect(() => {
    try {
      const hasSpeechRecognition = (() => {
        try {
          const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
          if (!SR) return false;
          try { 
            const testRecognition = new SR();
            testRecognition.abort();
            return true; 
          } catch { 
            return false; 
          }
        } catch { 
          return false; 
        }
      })();
      
      const hasSpeechSynthesis = !!window.speechSynthesis && typeof window.speechSynthesis.speak === 'function';
      const hasMediaDevices = !!navigator.mediaDevices?.getUserMedia;
      const hasAudioContext = (() => {
        try {
          const AC = window.AudioContext || window.webkitAudioContext;
          if (!AC) return false;
          const ctx = new AC();
          ctx.close();
          return true;
        } catch { 
          return false; 
        }
      })();

      setFeatureCheck({
        recognition: hasSpeechRecognition,
        synthesis: hasSpeechSynthesis,
        mic: hasMediaDevices,
        audiocontext: hasAudioContext,
      });

      if (!hasSpeechRecognition) { setError('recognition'); return; }
      if (!hasSpeechSynthesis) { setError('synthesis'); return; }
      if (!hasMediaDevices) { setError('mic'); return; }
      if (!hasAudioContext) { setError('audiocontext'); return; }
      setIsSupported(true);
    } catch (e) {
      setError('unknown');
    }
  }, []);

  return { isSupported, error, featureCheck };
};

const useSpeechRecognition = (targetWord, classGroup, onResult, onError) => {
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const activeRecognition = useRef(false);
  const retryCount = useRef(0);
  const retryTimeout = useRef(null);

  const clearRetry = useCallback(() => {
    if (retryTimeout.current) {
      clearTimeout(retryTimeout.current);
      retryTimeout.current = null;
    }
    retryCount.current = 0;
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || activeRecognition.current) return;
    
    clearRetry();
    setTranscript('');
    setInterimTranscript('');
    setConfidence(0);
    
    try {
      recognitionRef.current.start();
      activeRecognition.current = true;
    } catch (error) {
      if (error.message.includes('aborted') || error.message.includes('started')) {
        // Try again after a short delay if recognition was aborted
        if (retryCount.current < SPEECH_CONFIG.MAX_RETRIES) {
          retryCount.current++;
          retryTimeout.current = setTimeout(() => {
            startListening();
          }, SPEECH_CONFIG.RECOGNITION.retryDelay);
        } else {
          onError?.(`Failed to start recognition after ${SPEECH_CONFIG.MAX_RETRIES} attempts`);
          activeRecognition.current = false;
          clearRetry();
        }
      } else {
        onError?.(`Failed to start recognition: ${error.message}`);
        activeRecognition.current = false;
        clearRetry();
      }
    }
  }, [onError, clearRetry]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !activeRecognition.current) return;
    clearRetry();
    try {
      recognitionRef.current.stop();
      activeRecognition.current = false;
    } catch (error) {
      onError?.(`Failed to stop recognition: ${error.message}`);
      activeRecognition.current = false;
    }
  }, [onError, clearRetry]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    // Cleanup previous recognition if exists
    if (recognitionRef.current) {
      try { 
        recognitionRef.current.abort(); 
        recognitionRef.current = null;
      } catch {}
    }

    const recognition = new SpeechRecognition();
    Object.assign(recognition, SPEECH_CONFIG.RECOGNITION);

    recognition.onstart = () => {
      setIsListening(true);
      activeRecognition.current = true;
    };

    recognition.onend = () => {
      setIsListening(false);
      activeRecognition.current = false;
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
      let highestConfidence = 0;

      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        const isFinal = event.results[i].isFinal;
        const confidence = event.results[i][0].confidence || 0;

        if (isFinal) {
          finalTranscript += transcript + ' ';
          if (confidence > highestConfidence) {
            highestConfidence = confidence;
          }
        } else {
          interimTranscript += transcript + ' ';
        }
      }

      setInterimTranscript(interimTranscript.trim());
      
      if (finalTranscript) {
        const finalText = finalTranscript.trim().toLowerCase();
        setTranscript(finalText);
        setInterimTranscript('');
        setConfidence(highestConfidence);
        onResult?.(analyzePronunciation(finalText, targetWord, highestConfidence, classGroup));
      }
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      activeRecognition.current = false;
      clearRetry();
      
      if (event.error === 'no-speech' || event.error === 'audio-capture') {
        // Auto-retry for these recoverable errors
        if (retryCount.current < SPEECH_CONFIG.MAX_RETRIES) {
          retryCount.current++;
          retryTimeout.current = setTimeout(() => {
            startListening();
          }, SPEECH_CONFIG.RECOGNITION.retryDelay);
          return;
        }
      }
      
      onError?.(getRecognitionErrorMessage(event.error));
    };

    recognitionRef.current = recognition;

    return () => {
      clearRetry();
      try { 
        if (recognitionRef.current) {
          recognitionRef.current.abort();
        }
      } catch {}
      activeRecognition.current = false;
    };
  }, [targetWord, classGroup, onResult, onError, startListening, clearRetry]);

  return { 
    isListening, 
    transcript, 
    interimTranscript,
    confidence, 
    startListening, 
    stopListening 
  };
};

const useAudioLevelMonitoring = (isListening, onError) => {
  const [audioLevel, setAudioLevel] = useState(0);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);
  const streamRef = useRef(null);
  const lastUpdateRef = useRef(Date.now());
  const dataArrayRef = useRef(null);

  const cleanupAudio = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (analyserRef.current && audioContextRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(e => {
        onError?.(`AudioContext close error: ${e.message}`);
      });
      audioContextRef.current = null;
    }
    
    setAudioLevel(0);
  }, [onError]);

  const resumeContext = useCallback(async () => {
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      try {
        await audioContextRef.current.resume();
      } catch (err) {
        onError?.('AudioContext resume failed: ' + err.message);
      }
    }
  }, [onError]);

  const startMonitoring = useCallback(async () => {
    cleanupAudio();
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();
      await resumeContext();
      
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = SPEECH_CONFIG.AUDIO.fftSize;
      analyserRef.current.smoothingTimeConstant = SPEECH_CONFIG.AUDIO.smoothingTimeConstant;
      
      const microphone = audioContextRef.current.createMediaStreamSource(stream);
      microphone.connect(analyserRef.current);
      
      dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
      streamRef.current = stream;
      
      const updateAudioLevel = () => {
        if (!analyserRef.current || !isListening) return;
        
        const now = Date.now();
        if (now - lastUpdateRef.current >= SPEECH_CONFIG.AUDIO.minUpdateInterval) {
          analyserRef.current.getByteFrequencyData(dataArrayRef.current);
          const sum = dataArrayRef.current.reduce((a, b) => a + b, 0);
          const average = sum / dataArrayRef.current.length;
          setAudioLevel(average);
          lastUpdateRef.current = now;
        }
        
        animationRef.current = requestAnimationFrame(updateAudioLevel);
      };
      
      updateAudioLevel();
    } catch (error) {
      cleanupAudio();
      onError?.(`Failed to access microphone: ${error.message}`);
    }
  }, [isListening, onError, cleanupAudio, resumeContext]);

  useEffect(() => {
    if (isListening) {
      startMonitoring();
      // Some browsers require user interaction to start audio
      window.addEventListener('click', resumeContext, { once: true, capture: true });
    } else {
      cleanupAudio();
    }
    
    return () => {
      cleanupAudio();
      window.removeEventListener('click', resumeContext, { capture: true });
    };
  }, [isListening, startMonitoring, cleanupAudio, resumeContext]);

  return { audioLevel };
};

const useSpeechSynthesis = (classGroup) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [voice, setVoice] = useState(null);

  useEffect(() => {
    const updateVoices = () => {
      if (window.speechSynthesis) {
        const voices = window.speechSynthesis.getVoices();
        let preferred = voices.find(v => v.lang === 'en-US' && v.name.toLowerCase().includes('female'));
        if (!preferred) preferred = voices.find(v => v.lang.startsWith('en'));
        setVoice(preferred || null);
      }
    };
    
    updateVoices();
    window.speechSynthesis?.addEventListener('voiceschanged', updateVoices);
    return () => {
      window.speechSynthesis?.removeEventListener('voiceschanged', updateVoices);
    };
  }, []);

  const speak = useCallback((text) => {
    if (!window.speechSynthesis || isMuted) return;
    
    window.speechSynthesis.cancel();
    const utterance = new window.SpeechSynthesisUtterance(text);
    const config = SPEECH_CONFIG.SYNTHESIS[classGroup];
    Object.assign(utterance, config);
    
    if (voice) utterance.voice = voice;
    
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    
    window.speechSynthesis.speak(utterance);
  }, [classGroup, isMuted, voice]);

  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
    if (isPlaying) stop();
  }, [isPlaying, stop]);

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return { isPlaying, isMuted, speak, stop, toggleMute, voice };
};

// ==================== Components ====================
const GuidanceMessage = ({ type }) => {
  if (!type || !BROWSER_GUIDANCE[type]) return null;
  const { title, message, links } = BROWSER_GUIDANCE[type];
  return (
    <div className="mb-4 p-4 bg-yellow-800/30 border border-yellow-600/30 rounded-xl backdrop-blur-sm" role="alert">
      <h4 className="text-yellow-300 font-bold mb-2 flex items-center gap-2">
        <AlertCircle size={18} className="inline" /> {title}
      </h4>
      <p className="text-yellow-100 mb-2">{message}</p>
      {links && links.length > 0 && (
        <ul className="text-yellow-200 text-sm space-y-1">
          {links.map(link => (
            <li key={link.url}>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-200">{link.label}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const ErrorMessage = ({ message, onDismiss }) => (
  <div
    className="mb-4 p-4 bg-red-500/20 border border-red-400/50 rounded-xl backdrop-blur-sm"
    role="alert"
    aria-live="assertive"
    tabIndex={0}
  >
    <div className="flex items-center gap-2">
      <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
      <p className="text-red-100 flex-1">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-300 transition-colors focus:outline focus:ring-2 focus:ring-red-400"
          aria-label="Dismiss error"
          tabIndex={0}
        >
          ×
        </button>
      )}
    </div>
  </div>
);

const AudioWaveform = ({ level }) => {
  const bars = 5;
  const normalizedLevel = Math.min(1, level / 255);
  
  return (
    <div className="flex items-end gap-1 h-8">
      {Array.from({ length: bars }).map((_, i) => {
        const height = Math.max(2, (normalizedLevel * 0.8) * (i + 1) * 10);
        return (
          <div
            key={i}
            className="w-1.5 bg-blue-400 rounded-full transition-all duration-100"
            style={{ height: `${height}px` }}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
};

const AudioControls = React.memo(({ isPlaying, isMuted, onPlay, onStop, onToggleMute, onReset, disabled }) => (
  <div className="flex justify-center gap-4 mb-6" role="group" aria-label="Audio playback controls">
    <button
      onClick={isPlaying ? onStop : onPlay}
      disabled={disabled}
      className="flex items-center gap-2 px-6 py-3 bg-blue-500/20 backdrop-blur-sm border border-blue-300/30 rounded-xl text-white hover:bg-blue-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline focus:ring-2 focus:ring-blue-400"
      aria-label={isPlaying ? 'Stop playback' : 'Play target word'}
      tabIndex={0}
      onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && !disabled) (isPlaying ? onStop() : onPlay()); }}
    >
      {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      <span className="hidden sm:inline">{isPlaying ? 'Stop' : 'Play'}</span>
    </button>
    <button
      onClick={onToggleMute}
      className="flex items-center gap-2 px-4 py-3 bg-gray-500/20 backdrop-blur-sm border border-gray-300/30 rounded-xl text-white hover:bg-gray-500/30 transition-all duration-300 focus:outline focus:ring-2 focus:ring-gray-400"
      aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
      tabIndex={0}
      onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && !disabled) onToggleMute(); }}
    >
      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
    </button>
    <button
      onClick={onReset}
      className="flex items-center gap-2 px-4 py-3 bg-orange-500/20 backdrop-blur-sm border border-orange-300/30 rounded-xl text-white hover:bg-orange-500/30 transition-all duration-300 focus:outline focus:ring-2 focus:ring-orange-400"
      aria-label="Reset session"
      tabIndex={0}
      onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && !disabled) onReset(); }}
    >
      <RotateCcw size={20} />
    </button>
  </div>
));

const RecordingButton = React.memo(({ isListening, audioLevel, onStart, onStop, disabled }) => (
  <div className="text-center mb-6">
    <button
      onClick={isListening ? onStop : onStart}
      disabled={disabled}
      className={`relative flex items-center justify-center w-20 h-20 rounded-full border-4 transition-all duration-300 focus:outline focus:ring-4 ${
        isListening
          ? 'bg-red-500/30 border-red-400 animate-pulse focus:ring-red-400'
          : 'bg-green-500/20 border-green-400 hover:bg-green-500/30 focus:ring-green-400'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      aria-label={isListening ? 'Stop recording' : 'Start recording'}
      aria-pressed={isListening}
      tabIndex={0}
      onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && !disabled) (isListening ? onStop() : onStart()); }}
    >
      {isListening ? <MicOff size={32} className="text-white" /> : <Mic size={32} className="text-white" />}
      {isListening && audioLevel > 0 && (
        <div
          className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping"
          style={{
            transform: `scale(${1 + (audioLevel / 255) * 0.5})`,
            opacity: audioLevel / 255,
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        />
      )}
    </button>
    <div className="flex justify-center mt-2 h-8">
      {isListening ? (
        <>
          <AudioWaveform level={audioLevel} />
          <p className="text-white/80 ml-2">🎤 Listening...</p>
        </>
      ) : (
        <p className="text-white/80">👆 Click or press Enter/Space to start recording</p>
      )}
    </div>
  </div>
));

const ResultsDisplay = React.memo(({ transcript, interimTranscript, analysisResult, classGroup }) => {
  if (!transcript && !analysisResult && !interimTranscript) return null;
  
  return (
    <div className="space-y-4" aria-live="polite">
      {(transcript || interimTranscript) && (
        <div className="p-4 bg-white/10 rounded-xl border border-white/20">
          <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
            {interimTranscript ? '✍️ Live transcription:' : '📝 What you said:'}
          </h3>
          <p className={`text-lg ${interimTranscript ? 'text-yellow-200 italic' : 'text-blue-200'}`}>
            {interimTranscript || transcript}
          </p>
        </div>
      )}
      
      {analysisResult && (
        <>
          <div className="p-4 bg-white/10 rounded-xl border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-semibold flex items-center gap-2">
                📊 Score
                {analysisResult.passed && <CheckCircle2 size={16} className="text-green-400" />}
              </h3>
              <span className={`text-2xl font-bold ${
                analysisResult.passed ? 'text-green-400' : 'text-yellow-400'
              }`}>
                {Math.round(analysisResult.accuracy)}%
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 mb-3" aria-label="Score progress bar">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  analysisResult.passed ? 'bg-green-400' : 'bg-yellow-400'
                }`}
                style={{ width: `${Math.min(100, analysisResult.accuracy)}%` }}
                aria-valuenow={Math.round(analysisResult.accuracy)}
                aria-valuemax={100}
                aria-valuemin={0}
                tabIndex={0}
              />
            </div>
            <p className="text-white/90 text-center">{analysisResult.feedback}</p>
          </div>
          
          {(classGroup === 'VI-X' || classGroup === 'III-V') && analysisResult.phonetics && (
            <div className="p-4 bg-white/10 rounded-xl border border-white/20">
              <h3 className="text-white font-semibold mb-3">🔍 Pronunciation Analysis</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Vowel Accuracy:</span>
                  <span className="text-blue-200 font-medium">
                    {Math.round(analysisResult.phonetics.vowelAccuracy * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Consonant Accuracy:</span>
                  <span className="text-blue-200 font-medium">
                    {Math.round(analysisResult.phonetics.consonantAccuracy * 100)}%
                  </span>
                </div>
                {classGroup === 'VI-X' && (
                  <div className="flex justify-between">
                    <span className="text-white/70">Stress Accuracy:</span>
                    <span className="text-blue-200 font-medium">
                      {Math.round(analysisResult.phonetics.stressAccuracy * 100)}%
                    </span>
                  </div>
                )}
              </div>
              
              {analysisResult.phonetics.suggestions?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/20">
                  <p className="text-white/70 text-sm">Suggestions:</p>
                  <ul className="text-blue-200 text-sm mt-1">
                    {analysisResult.phonetics.suggestions.map((suggestion, index) => (
                      <li key={index}>• {suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
});

// ==================== Main Component ====================
const AudioSpeechEngine = ({
  targetWord,
  onResult,
  onError,
  classGroup = 'I-II',
  difficulty = 'easy',
  className = '',
  maxRetries = 3,
  autoRetry = false,
}) => {
  const [errorMsg, setErrorMsg] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const { isSupported, error: supportError, featureCheck } = useAudioSupport();

  const handleResult = useCallback((result) => {
    setAnalysisResult(result);
    onResult?.(result);
    if (autoRetry && !result.passed && retryCount < maxRetries) {
      setTimeout(() => { setRetryCount(prev => prev + 1); }, 2000);
    }
  }, [onResult, autoRetry, retryCount, maxRetries]);

  const handleError = useCallback((error) => {
    setErrorMsg(error);
    onError?.(error);
  }, [onError]);

  const {
    isListening,
    transcript,
    interimTranscript,
    confidence,
    startListening,
    stopListening,
  } = useSpeechRecognition(targetWord, classGroup, handleResult, handleError);

  const { audioLevel } = useAudioLevelMonitoring(isListening, handleError);

  const {
    isPlaying,
    isMuted,
    speak,
    stop: stopSpeaking,
    toggleMute,
    voice,
  } = useSpeechSynthesis(classGroup);

  const handlePlay = useCallback(() => { speak(targetWord); }, [speak, targetWord]);
  
  const handleReset = useCallback(() => {
    stopListening();
    stopSpeaking();
    setAnalysisResult(null);
    setErrorMsg('');
    setRetryCount(0);
  }, [stopListening, stopSpeaking]);

  const dismissError = useCallback(() => { setErrorMsg(''); }, []);

  const mainContent = useMemo(() => {
    if (!isSupported) {
      return <GuidanceMessage type={supportError} />;
    }
    
    return (
      <>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">🎤 Pronunciation Engine</h2>
          <p className="text-white/80">
            Target Word: <span className="font-semibold text-blue-200">{targetWord}</span>
          </p>
          <p className="text-white/60 text-sm mt-1">
            Level: {classGroup} • Difficulty: {difficulty}
          </p>
          {voice && (
            <p className="text-white/40 text-xs mt-1">
              Using voice: <b>{voice.name}</b> ({voice.lang})
            </p>
          )}
        </div>
        
        <AudioControls
          isPlaying={isPlaying}
          isMuted={isMuted}
          onPlay={handlePlay}
          onStop={stopSpeaking}
          onToggleMute={toggleMute}
          onReset={handleReset}
          disabled={isListening || !isSupported}
        />
        
        <RecordingButton
          isListening={isListening}
          audioLevel={audioLevel}
          onStart={featureCheck.recognition && featureCheck.mic ? startListening : undefined}
          onStop={featureCheck.recognition && featureCheck.mic ? stopListening : undefined}
          disabled={!isSupported || !featureCheck.recognition || !featureCheck.mic}
        />
        
        {errorMsg && <ErrorMessage message={errorMsg} onDismiss={dismissError} />}
        
        <ResultsDisplay 
          transcript={transcript}
          interimTranscript={interimTranscript}
          analysisResult={analysisResult}
          classGroup={classGroup}
        />
        
        {retryCount > 0 && (
          <div className="mt-4 text-center">
            <p className="text-white/60 text-sm" aria-live="polite">
              Attempt {retryCount + 1} of {maxRetries + 1}
            </p>
          </div>
        )}
      </>
    );
  }, [
    isSupported,
    supportError,
    targetWord,
    classGroup,
    difficulty,
    isPlaying,
    isMuted,
    handlePlay,
    stopSpeaking,
    toggleMute,
    handleReset,
    isListening,
    audioLevel,
    startListening,
    stopListening,
    errorMsg,
    dismissError,
    transcript,
    interimTranscript,
    analysisResult,
    retryCount,
    maxRetries,
    voice,
    featureCheck,
  ]);

  return (
    <div
      className={`w-full max-w-2xl mx-auto p-6 bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl ${className}`}
      role="region"
      aria-label="Pronunciation Engine"
    >
      {mainContent}
    </div>
  );
};

AudioSpeechEngine.propTypes = {
  targetWord: PropTypes.string.isRequired,
  onResult: PropTypes.func,
  onError: PropTypes.func,
  classGroup: PropTypes.oneOf(['I-II', 'III-V', 'VI-X']),
  difficulty: PropTypes.string,
  className: PropTypes.string,
  maxRetries: PropTypes.number,
  autoRetry: PropTypes.bool,
};

export default AudioSpeechEngine;