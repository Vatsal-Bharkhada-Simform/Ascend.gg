// Lightweight synthetic audio engine using Web Audio API
// No external assets required!

let audioCtx: AudioContext | null = null;
let isMuted = false;

// Initialize on first user interaction to comply with browser autoplay policies
export const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

export const setMuted = (muted: boolean) => {
  isMuted = muted;
};

// Play a short low-frequency ramp for thrusting
export const playThrust = () => {
  if (isMuted || !audioCtx) return;
  const t = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(150, t);
  osc.frequency.exponentialRampToValueAtTime(80, t + 0.1);

  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.1, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start(t);
  osc.stop(t + 0.1);
};

// Play a rising chime that gets higher pitched as multiplier increases
export const playScore = (multiplier: number) => {
  if (isMuted || !audioCtx) return;
  const t = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  // Base frequency is 600Hz, goes up by a musical third roughly per multiplier
  const baseFreq = 600 * Math.pow(1.25, Math.min(multiplier - 1, 5));
  osc.frequency.setValueAtTime(baseFreq, t);
  osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, t + 0.1);

  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.2, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start(t);
  osc.stop(t + 0.25);
};

// A harsh descending noise for death
export const playDeath = () => {
  if (isMuted || !audioCtx) return;
  const t = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(200, t);
  osc.frequency.exponentialRampToValueAtTime(40, t + 0.4);

  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.3, t + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start(t);
  osc.stop(t + 0.4);
};

// Very short subtle blip for UI clicks
export const playClick = () => {
  if (isMuted || !audioCtx) return;
  const t = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, t);
  osc.frequency.exponentialRampToValueAtTime(1200, t + 0.05);

  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.1, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start(t);
  osc.stop(t + 0.05);
};
