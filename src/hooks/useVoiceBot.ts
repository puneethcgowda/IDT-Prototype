import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => any;
    SpeechRecognition?: new () => any;
  }
}

type SpeechRecognitionEvent = Event & {
  results: SpeechRecognitionResultList;
  isFinal: boolean;
};

interface UseVoiceBotOptions {
  language?: string;
  onTranscript?: (text: string) => void;
  onError?: (error: string) => void;
}

export function useVoiceBot(options: UseVoiceBotOptions = {}) {
  const { i18n } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const recognitionRef = useRef<any>(null);

  const lang = options.language || i18n.language;

  useEffect(() => {
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;

    // Map language codes
    const langMap: Record<string, string> = {
      en: "en-US",
      hi: "hi-IN",
      kn: "kn-IN",
    };
    recognition.lang = langMap[lang] || "en-US";

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      for (let i = event.results.length - 1; i >= 0; --i) {
        if (event.results[i].isFinal) {
          const finalTranscript = event.results[i][0].transcript;
          setTranscript(finalTranscript);
          options.onTranscript?.(finalTranscript);
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      if (interim) setTranscript(interim);
    };

    recognition.onerror = (event: any) => {
      const errorMsg = event.error || "Unknown error";
      setError(errorMsg);
      options.onError?.(errorMsg);
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [lang, options]);

  const startListening = () => {
    setError("");
    setTranscript("");
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const speak = (text: string) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    const langMap: Record<string, string> = {
      en: "en-US",
      hi: "hi-IN",
      kn: "kn-IN",
    };
    utterance.lang = langMap[lang] || "en-US";
    utterance.rate = 0.95;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return {
    isListening,
    isSpeaking,
    transcript,
    error,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  };
}
