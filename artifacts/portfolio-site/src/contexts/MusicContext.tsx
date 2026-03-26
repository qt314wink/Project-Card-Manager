import {
  createContext, useContext, useRef, useState, useCallback, useEffect, type ReactNode,
} from "react";

export interface SongRecord {
  id: string;
  title: string;
  creator: string;
  style: string;
  bpm: number;
  key: string;
  timestamp: number;
}

type StyleName = "Ambient Drift" | "Pulse Wave" | "Cosmic Haze" | "Glass Bells" | "Deep Current";

const STYLES: Record<StyleName, { waveform: OscillatorType; bpm: number; scale: number[]; pads: boolean }> = {
  "Ambient Drift":  { waveform: "sine",     bpm: 60,  scale: [261, 294, 329, 392, 440, 523], pads: true  },
  "Pulse Wave":     { waveform: "sawtooth", bpm: 120, scale: [220, 247, 261, 294, 330, 349], pads: false },
  "Cosmic Haze":    { waveform: "sine",     bpm: 45,  scale: [174, 196, 220, 261, 293, 329], pads: true  },
  "Glass Bells":    { waveform: "triangle", bpm: 90,  scale: [329, 392, 440, 494, 523, 587], pads: true  },
  "Deep Current":   { waveform: "square",   bpm: 80,  scale: [131, 147, 165, 196, 220, 261], pads: false },
};

const STYLE_NAMES = Object.keys(STYLES) as StyleName[];
const LS_KEY = "studio_songs";

function loadSongs(): SongRecord[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch { return []; }
}
function saveSongs(songs: SongRecord[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(songs.slice(0, 50)));
}

interface MusicContextValue {
  isPlaying: boolean;
  currentStyle: StyleName;
  currentSong: SongRecord | null;
  songs: SongRecord[];
  volume: number;
  setVolume: (v: number) => void;
  play: (style?: StyleName) => void;
  pause: () => void;
  nextStyle: () => void;
  submitSong: (title: string, creator: string) => SongRecord;
  deleteSong: (id: string) => void;
  startRecording: () => void;
  stopAndDownload: (title: string) => void;
  isRecording: boolean;
  analyserNode: AnalyserNode | null;
}

const MusicContext = createContext<MusicContextValue | null>(null);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStyleIdx, setCurrentStyleIdx] = useState(0);
  const [currentSong, setCurrentSong] = useState<SongRecord | null>(null);
  const [songs, setSongs] = useState<SongRecord[]>(loadSongs);
  const [volume, setVolumeState] = useState(0.5);
  const [isRecording, setIsRecording] = useState(false);

  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const oscRefs = useRef<OscillatorNode[]>([]);
  const schedulerRef = useRef<number>(0);
  const stepRef = useRef(0);
  const nextNoteRef = useRef(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const currentStyle = STYLE_NAMES[currentStyleIdx];

  const getCtx = () => {
    if (!ctxRef.current || ctxRef.current.state === "closed") {
      const ctx = new AudioContext();
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      gain.connect(analyser);
      analyser.connect(ctx.destination);
      ctxRef.current = ctx;
      gainRef.current = gain;
      analyserRef.current = analyser;
    }
    return ctxRef.current;
  };

  const scheduleNote = useCallback((freq: number, time: number, style: StyleName) => {
    const ctx = ctxRef.current;
    const gain = gainRef.current;
    if (!ctx || !gain) return;
    const { waveform, pads } = STYLES[style];
    const osc = ctx.createOscillator();
    const envGain = ctx.createGain();
    osc.type = waveform;
    osc.frequency.setValueAtTime(freq, time);
    const attack = pads ? 0.3 : 0.02;
    const release = pads ? 1.2 : 0.15;
    const beatDur = 60 / STYLES[style].bpm;
    envGain.gain.setValueAtTime(0, time);
    envGain.gain.linearRampToValueAtTime(0.18, time + attack);
    envGain.gain.setValueAtTime(0.18, time + beatDur - release);
    envGain.gain.linearRampToValueAtTime(0, time + beatDur + release);
    osc.connect(envGain);
    envGain.connect(gain);
    osc.start(time);
    osc.stop(time + beatDur + release + 0.05);
  }, []);

  const stopScheduler = useCallback(() => {
    clearInterval(schedulerRef.current);
    oscRefs.current.forEach(o => { try { o.stop(); } catch {} });
    oscRefs.current = [];
  }, []);

  const startScheduler = useCallback((style: StyleName) => {
    const ctx = getCtx();
    if (ctx.state === "suspended") ctx.resume();
    stepRef.current = 0;
    nextNoteRef.current = ctx.currentTime + 0.1;
    const { scale, bpm } = STYLES[style];
    const beatDur = 60 / bpm;

    const tick = () => {
      while (nextNoteRef.current < ctx.currentTime + 0.2) {
        const idx = stepRef.current % scale.length;
        const melody = scale[idx];
        const bass = scale[(idx + 3) % scale.length] / 2;
        scheduleNote(melody, nextNoteRef.current, style);
        if (stepRef.current % 2 === 0) scheduleNote(bass, nextNoteRef.current, style);
        nextNoteRef.current += beatDur;
        stepRef.current++;
      }
    };
    schedulerRef.current = window.setInterval(tick, 25);
  }, [scheduleNote]);

  const play = useCallback((style?: StyleName) => {
    const s = style ?? currentStyle;
    stopScheduler();
    startScheduler(s);
    setIsPlaying(true);
  }, [currentStyle, startScheduler, stopScheduler]);

  const pause = useCallback(() => {
    stopScheduler();
    ctxRef.current?.suspend();
    setIsPlaying(false);
  }, [stopScheduler]);

  const nextStyle = useCallback(() => {
    const next = (currentStyleIdx + 1) % STYLE_NAMES.length;
    setCurrentStyleIdx(next);
    if (isPlaying) { stopScheduler(); startScheduler(STYLE_NAMES[next]); }
  }, [currentStyleIdx, isPlaying, startScheduler, stopScheduler]);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (gainRef.current && ctxRef.current) {
      gainRef.current.gain.setValueAtTime(v, ctxRef.current.currentTime);
    }
  }, []);

  const submitSong = useCallback((title: string, creator: string): SongRecord => {
    const song: SongRecord = {
      id: Date.now().toString(),
      title: title || `${currentStyle} #${songs.length + 1}`,
      creator: creator || "Anonymous",
      style: currentStyle,
      bpm: STYLES[currentStyle].bpm,
      key: "C",
      timestamp: Date.now(),
    };
    const updated = [song, ...songs];
    setSongs(updated);
    saveSongs(updated);
    setCurrentSong(song);
    return song;
  }, [currentStyle, songs]);

  const deleteSong = useCallback((id: string) => {
    const updated = songs.filter(s => s.id !== id);
    setSongs(updated);
    saveSongs(updated);
    if (currentSong?.id === id) setCurrentSong(null);
  }, [songs, currentSong]);

  const startRecording = useCallback(() => {
    const ctx = getCtx();
    const dest = ctx.createMediaStreamDestination();
    gainRef.current?.connect(dest);
    const mr = new MediaRecorder(dest.stream);
    chunksRef.current = [];
    mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    mr.start(100);
    mediaRecorderRef.current = mr;
    setIsRecording(true);
    if (!isPlaying) play();
  }, [isPlaying, play]);

  const stopAndDownload = useCallback((title: string) => {
    const mr = mediaRecorderRef.current;
    if (!mr) return;
    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title || "studio-track"}.webm`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    };
    mr.stop();
    setIsRecording(false);
  }, []);

  useEffect(() => () => { stopScheduler(); ctxRef.current?.close(); }, [stopScheduler]);

  return (
    <MusicContext.Provider value={{
      isPlaying, currentStyle, currentSong, songs, volume, setVolume,
      play, pause, nextStyle, submitSong, deleteSong,
      startRecording, stopAndDownload, isRecording,
      analyserNode: analyserRef.current,
    }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used within MusicProvider");
  return ctx;
}
