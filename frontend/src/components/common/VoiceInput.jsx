/**
 * @fileoverview Voice Input Component for AgriSahayak Frontend
 * 
 * Provides a microphone button that uses the Web Speech API
 * (SpeechRecognition) to convert spoken numbers into input values.
 * Used alongside quantity and price fields in CropForm to enable
 * hands-free data entry for farmers.
 * 
 * Flow: Click mic → speak number → text parsed → number extracted → callback
 * 
 * Visual states:
 * - Idle: Green mic icon on emerald background
 * - Listening: Red mic-off icon with pulse animation
 * 
 * @component VoiceInput
 * @param {Object} props
 * @param {Function} props.onResult - Callback invoked with the parsed number
 * 
 * @see Epic 6, Story 6.5 - Voice Input for Numbers
 * @see CropForm.jsx - Parent component that uses VoiceInput
 */
import { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

export default function VoiceInput({ onResult }) {
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Browser does not support speech recognition.");

    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      // Task 2: Logic to convert spoken word to number [cite: 276]
      const number = parseFloat(transcript.replace(/[^0-9.]/g, ''));
      if (!isNaN(number)) onResult(number);
    };

    recognition.start();
  };

  return (
    <button
      type="button"
      onClick={startListening}
      className={`p-2 rounded-full transition-colors ${isListening ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-emerald-100 text-emerald-600'}`}
    >
      {isListening ? <MicOff size={18} /> : <Mic size={18} />}
    </button>
  );
}