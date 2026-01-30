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