import { useCallback } from "react";

/**
 * useSpeechSynthesis - Returns a speak(text) function using the selected voice.
 * @param selectedVoiceURI
 * @returns { speak }
 */
export default function useSpeechSynthesis(selectedVoiceURI) {
  // Speak using the selected voice URI
  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new window.SpeechSynthesisUtterance(text);

    // Select voice by URI
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.voiceURI === selectedVoiceURI);
    if (voice) {
      utter.voice = voice;
      utter.lang = voice.lang;
    }
    window.speechSynthesis.speak(utter);
  }, [selectedVoiceURI]);

  return { speak };
}