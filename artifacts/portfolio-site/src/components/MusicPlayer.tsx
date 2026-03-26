import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, SkipForward, Volume2, VolumeX, Mic, Download,
  Music, ChevronUp, ChevronDown, Trash2, Send, Share2, X,
} from "lucide-react";
import { useMusic, type SongRecord } from "@/contexts/MusicContext";

export function MusicPlayer() {
  const {
    isPlaying, currentStyle, songs, volume, setVolume,
    play, pause, nextStyle, submitSong, deleteSong,
    startRecording, stopAndDownload, isRecording, analyserNode,
  } = useMusic();

  const [expanded, setExpanded] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [songTitle, setSongTitle] = useState("");
  const [creator, setCreator] = useState(
    () => localStorage.getItem("studio_creator") || "",
  );
  const [muted, setMuted] = useState(false);
  const [prevVol, setPrevVol] = useState(0.5);
  const [recSeconds, setRecSeconds] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const timerRef = useRef<number>(0);

  const drawWave = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserNode) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const buf = new Uint8Array(analyserNode.frequencyBinCount);
    analyserNode.getByteTimeDomainData(buf);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(167,139,250,0.8)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const sliceW = canvas.width / buf.length;
    let x = 0;
    buf.forEach((v, i) => {
      const y = (v / 128) * (canvas.height / 2);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      x += sliceW;
    });
    ctx.stroke();
    rafRef.current = requestAnimationFrame(drawWave);
  }, [analyserNode]);

  useEffect(() => {
    if (isPlaying) { rafRef.current = requestAnimationFrame(drawWave); }
    else { cancelAnimationFrame(rafRef.current); }
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, drawWave]);

  useEffect(() => {
    if (isRecording) {
      setRecSeconds(0);
      timerRef.current = window.setInterval(() => setRecSeconds(s => s + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  const toggleMute = () => {
    if (muted) { setVolume(prevVol); setMuted(false); }
    else { setPrevVol(volume); setVolume(0); setMuted(true); }
  };

  const handleSubmit = () => {
    if (!creator.trim()) { alert("Enter a creator nickname first!"); return; }
    localStorage.setItem("studio_creator", creator);
    submitSong(songTitle, creator);
    setSongTitle("");
    setShowSubmit(false);
    setExpanded(true);
  };

  const handleDownload = () => {
    if (isRecording) { stopAndDownload(songTitle || currentStyle); }
    else { startRecording(); }
  };

  const handleShare = async (song: SongRecord) => {
    const text = `🎵 "${song.title}" by ${song.creator} — made with Halcyon Minx Studio`;
    if (navigator.share) {
      try { await navigator.share({ title: song.title, text, url: window.location.href }); return; } catch {}
    }
    await navigator.clipboard.writeText(text + " " + window.location.href);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-[--color-surface] border-t border-[--color-border] overflow-hidden"
          >
            <div className="max-w-4xl mx-auto px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-[--color-fg]">Song History</span>
                <button onClick={() => setExpanded(false)}><X size={14} className="text-[--color-fg-muted]" /></button>
              </div>
              {songs.length === 0 ? (
                <p className="text-xs text-[--color-fg-muted] pb-2">No songs saved yet — press Submit to save one.</p>
              ) : (
                <div className="space-y-1 max-h-48 overflow-y-auto pb-1">
                  {songs.map(song => (
                    <div key={song.id} className="flex items-center gap-2 rounded-lg px-3 py-2 bg-[--color-bg] text-sm">
                      <Music size={12} className="text-[--color-primary] shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-[--color-fg] truncate block">{song.title}</span>
                        <span className="text-xs text-[--color-fg-muted]">by {song.creator} · {song.style} · {song.bpm}bpm</span>
                      </div>
                      <button onClick={() => handleShare(song)} title="Share" className="p-1 hover:text-[--color-primary] text-[--color-fg-muted]">
                        <Share2 size={12} />
                      </button>
                      <button onClick={() => deleteSong(song.id)} title="Delete" className="p-1 hover:text-red-400 text-[--color-fg-muted]">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSubmit && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-[--color-surface] border-t border-[--color-border] overflow-hidden"
          >
            <div className="max-w-lg mx-auto px-4 py-3 flex gap-2 items-center">
              <input
                value={creator}
                onChange={e => setCreator(e.target.value)}
                placeholder="Creator nickname"
                className="flex-1 text-sm px-3 py-1.5 rounded-lg bg-[--color-bg] border border-[--color-border] text-[--color-fg] focus:outline-none focus:border-[--color-primary]"
              />
              <input
                value={songTitle}
                onChange={e => setSongTitle(e.target.value)}
                placeholder="Song title (optional)"
                className="flex-1 text-sm px-3 py-1.5 rounded-lg bg-[--color-bg] border border-[--color-border] text-[--color-fg] focus:outline-none focus:border-[--color-primary]"
              />
              <button onClick={handleSubmit} className="px-3 py-1.5 rounded-lg bg-[--color-primary] text-white text-sm font-medium hover:opacity-90">
                Save
              </button>
              <button onClick={() => setShowSubmit(false)}><X size={14} className="text-[--color-fg-muted]" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-[--color-surface]/95 backdrop-blur-md border-t border-[--color-border] shadow-2xl">
        <div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => isPlaying ? pause() : play()}
              className="w-8 h-8 rounded-full bg-[--color-primary] text-white flex items-center justify-center hover:opacity-90 transition-opacity shrink-0"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <button onClick={nextStyle} title="Next style" className="w-7 h-7 flex items-center justify-center text-[--color-fg-muted] hover:text-[--color-fg]">
              <SkipForward size={13} />
            </button>
          </div>

          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex items-center gap-2">
              <Music size={11} className="text-[--color-primary] shrink-0" />
              <span className="text-xs font-semibold text-[--color-fg] truncate">{currentStyle}</span>
              {isRecording && (
                <span className="text-xs text-red-400 animate-pulse">● REC {recSeconds}s</span>
              )}
            </div>
            <canvas
              ref={canvasRef}
              width={200}
              height={20}
              className="w-full h-5"
            />
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button onClick={toggleMute} className="p-1 text-[--color-fg-muted] hover:text-[--color-fg]">
              {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
            </button>
            <input
              type="range" min={0} max={1} step={0.01} value={muted ? 0 : volume}
              onChange={e => { setMuted(false); setVolume(parseFloat(e.target.value)); }}
              className="w-16 accent-[--color-primary] h-1"
            />
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleDownload}
              title={isRecording ? "Stop & download" : "Record 30s clip"}
              className={`p-1.5 rounded-md text-xs flex items-center gap-1 ${isRecording ? "text-red-400 bg-red-400/10" : "text-[--color-fg-muted] hover:text-[--color-fg]"}`}
            >
              {isRecording ? <><Mic size={12} /> Stop</> : <Download size={13} />}
            </button>
            <button
              onClick={() => { setShowSubmit(s => !s); setExpanded(false); }}
              title="Submit song"
              className="p-1.5 rounded-md text-[--color-fg-muted] hover:text-[--color-primary] flex items-center gap-1 text-xs"
            >
              <Send size={12} />
            </button>
            <button
              onClick={() => { setExpanded(e => !e); setShowSubmit(false); }}
              className="p-1.5 rounded-md text-[--color-fg-muted] hover:text-[--color-fg]"
            >
              {expanded ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
