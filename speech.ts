/**
 * Web Speech API helper for Spanish pronunciation
 */

let voicesLoaded = false;
let spanishVoice: SpeechSynthesisVoice | null = null;

function loadVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const voices = window.speechSynthesis.getVoices();
  spanishVoice = voices.find(v => v.lang.startsWith('es-ES')) ||
                 voices.find(v => v.lang.startsWith('es')) ||
                 null;
  voicesLoaded = true;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = loadVoices;
  loadVoices();
}

export function speakSpanish(text: string, rate: number = 0.9): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve();
      return;
    }

    window.speechSynthesis.cancel();

    if (!voicesLoaded) {
      loadVoices();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }
    utterance.rate = rate;
    utterance.pitch = 1.0;

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
