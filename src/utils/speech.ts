// Web Speech API wrapper for multilingual Read Aloud functionality (English, Tamil, Hindi)

export const speakText = (text: string, lang: 'en' | 'ta' | 'hi' = 'en') => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  const langMap: Record<'en' | 'ta' | 'hi', string> = {
    en: 'en-IN',
    ta: 'ta-IN',
    hi: 'hi-IN'
  };

  utterance.lang = langMap[lang] || 'en-IN';
  utterance.rate = 0.95; // Slightly measured pace for emergency clarity
  utterance.pitch = 1.0;

  // Try matching preferred voice if available
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(v => v.lang.startsWith(langMap[lang]) || v.lang.startsWith(lang));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  window.speechSynthesis.speak(utterance);
};

export const stopSpeech = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

