// Margdarshak AI - Web Audio & Speech Processing Utilities
// Zero-dependency sound effects, text-to-speech reading, and microphone voice transcription

class AudioAssistant {
  constructor() {
    this.audioCtx = null;
    this.isMuted = false;
    this.isSpeaking = false;
    this.isRecording = false;
    this.recognition = null;
    this.onSpeechResultCallback = null;
    this.initAudioContext();
    this.initSpeechRecognition();
  }

  initAudioContext() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    } catch (e) {
      console.warn("Web Audio API not supported in this browser environment", e);
    }
  }

  ensureContext() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Synthesize sound effects cleanly via Web Audio oscillators
  playTone(freq = 440, duration = 0.15, type = 'sine', gainVal = 0.1) {
    if (this.isMuted || !this.audioCtx) return;
    try {
      this.ensureContext();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      // ignore
    }
  }

  // UI Sound effect: Button click
  playClick() {
    this.playTone(600, 0.08, 'triangle', 0.08);
  }

  // UI Sound effect: Next question / Advance
  playNextChime() {
    if (this.isMuted || !this.audioCtx) return;
    this.playTone(523.25, 0.1, 'sine', 0.08); // C5
    setTimeout(() => this.playTone(659.25, 0.15, 'sine', 0.08), 90); // E5
  }

  // UI Sound effect: Success / Celebration chord
  playCelebration() {
    if (this.isMuted || !this.audioCtx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      setTimeout(() => {
        this.playTone(freq, 0.25, 'sine', 0.1);
      }, index * 90);
    });
  }

  // UI Sound effect: Mic beep
  playMicBeep(active) {
    if (this.isMuted || !this.audioCtx) return;
    if (active) {
      this.playTone(880, 0.12, 'sine', 0.12);
    } else {
      this.playTone(440, 0.12, 'sine', 0.12);
    }
  }

  // Speech Synthesis: Read Question Aloud
  speak(text, onEndCallback = null) {
    if (this.isMuted || !('speechSynthesis' in window)) {
      if (onEndCallback) onEndCallback();
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Prefer Indian English or natural voice if available
      const voices = window.speechSynthesis.getVoices();
      const indianVoice = voices.find(v => v.lang === 'en-IN' || v.name.includes('India'));
      if (indianVoice) {
        utterance.voice = indianVoice;
      }

      this.isSpeaking = true;
      utterance.onend = () => {
        this.isSpeaking = false;
        if (onEndCallback) onEndCallback();
      };
      utterance.onerror = () => {
        this.isSpeaking = false;
        if (onEndCallback) onEndCallback();
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error", e);
      this.isSpeaking = false;
      if (onEndCallback) onEndCallback();
    }
  }

  stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
  }

  // Speech Recognition (Voice Input to Text)
  initSpeechRecognition() {
    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionClass) {
      this.recognition = new SpeechRecognitionClass();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-IN'; // Default to Indian English speech model

      this.recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        if (this.onSpeechResultCallback) {
          this.onSpeechResultCallback(transcript, event.results[event.results.length - 1].isFinal);
        }
      };

      this.recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        this.isRecording = false;
      };

      this.recognition.onend = () => {
        this.isRecording = false;
      };
    }
  }

  startListening(callback) {
    this.onSpeechResultCallback = callback;
    if (this.recognition) {
      try {
        this.playMicBeep(true);
        this.recognition.start();
        this.isRecording = true;
        return true;
      } catch (e) {
        console.warn("Could not start speech recognition", e);
        return false;
      }
    }
    return false;
  }

  stopListening() {
    if (this.recognition && this.isRecording) {
      try {
        this.playMicBeep(false);
        this.recognition.stop();
        this.isRecording = false;
      } catch (e) {
        // ignore
      }
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopSpeaking();
    }
    return this.isMuted;
  }
}

// Instantiate global audio assistant
window.audioAssistant = new AudioAssistant();
