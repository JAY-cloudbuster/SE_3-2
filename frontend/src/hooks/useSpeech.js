import { useState } from 'react';

export default function useSpeech(onResult) {
  const [isListening, setIsListening] = useState(false);

  const listen = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const number = parseFloat(transcript.replace(/[^0-9.]/g, '')); // Story 6.5 logic [cite: 276]
      onResult(number);
    };
    recognition.start();
  };

  return { listen, isListening };
}