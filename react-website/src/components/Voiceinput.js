import { useState } from "react";

const useVoiceInput = (onResult, selectedLanguage) => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const [listening, setListening] = useState(false);

  if (!SpeechRecognition) {
    return {
      listening: false,
      startListening: () => alert("Your browser does not support speech recognition."),
    };
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;


  
  recognition.interimResults = false;

  recognition.onstart = () => setListening(true);
  recognition.onend = () => setListening(false);

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  const startListening = () => {
    recognition.lang = selectedLanguage; 
    recognition.start();
  };

  return { listening, startListening };
};

export default useVoiceInput;

