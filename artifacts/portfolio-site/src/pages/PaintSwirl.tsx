import { useRef, useEffect, useState, useCallback } from "react";
import { Trash2, Download, Shuffle, Settings2, ChevronDown, ChevronUp, Keyboard, Send, Share2, User, Image, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCreator } from "@/contexts/CreatorContext";
import { SeoHead } from "@/components/SeoHead";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  angle: number;
  speed: number;
  mode?: string;
}

interface SwirlSource {
  x: number;
  y: number;
  color: string;
  strength: number;
  active: boolean;
  id: number;
}

type DrawMode = "swirl" | "inkdrop" | "marbling";

const PALETTES = [
  { name: "Aurora", colors: ["#a855f7", "#ec4899", "#f97316", "#eab308", "#22c55e", "#06b6d4"] },
  { name: "Ocean",  colors: ["#0ea5e9", "#38bdf8", "#67e8f9", "#06b6d4", "#0891b2", "#0e7490"] },
  { name: "Fire",   colors: ["#ef4444", "#f97316", "#eab308", "#dc2626", "#b45309", "#fbbf24"] },
  { name: "Forest", colors: ["#22c55e", "#16a34a", "#4ade80", "#86efac", "#15803d", "#84cc16"] },
  { name: "Candy",  colors: ["#f472b6", "#e879f9", "#c084fc", "#818cf8", "#60a5fa", "#34d399"] },
  { name: "Midnight", colors: ["#6d28d9", "#7c3aed", "#8b5cf6", "#4f46e5", "#4338ca", "#a78bfa"] },
];

function randomBetween(a: number, b: number) { return a + Math.random() * (b - a); }
function pickRandom<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

const MODE_INFO: Record<DrawMode, { label: string; hint: string }> = {
  swirl: { label: "Swirl", hint: "Particles orbit attractors in spiral paths" },
  inkdrop: { label: "Ink Drop", hint: "Dense blobs spread outward like ink in water" },
  marbling: { label: "Marble", hint: "Sinuous silk-like ribbons flow between sources" },
};

export default function PaintSwirl() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const sourcesRef = useRef<SwirlSource[]>([]);
  const animFrameRef = useRef<number>(0);
  const isDraggingRef = useRef(false);
  const dragIdRef = useRef<number | null>(null);
  const [paletteIdx, setPaletteIdx] = useState(0);
  const [particleCount, setParticleCount] = useState(60);
  const [swirlStrength, setSwirlStrength] = useState(0.12);
  const [trailLength, setTrailLength] = useState(0.06);
  const [showSettings, setShowSettings] = useState(false);
  const [showKeys, setShowKeys] = useState(false);
  const [mode, setMode] = useState<DrawMode>("swirl");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [showGallery, setShowGallery] = useState(false);
  const [showSubmitPanel, setShowSubmitPanel] = useState(false);
  const { username, setUsername, artworks, submitArtwork, deleteArtwork, shareItem } = useCreator();
  const paletteRef = useRef(PALETTES[0]);
  const modeRef = useRef<DrawMode>("swirl");
  const particleCountRef = useRef(particleCount);
  const swirlStrengthRef = useRef(swirlStrength);
  const trailLengthRef = useRef(trailLength);

  useEffect(() => { paletteRef.current = PALETTES[paletteIdx]; }, [paletteIdx]);
  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { particleCountRef.current = particleCount; }, [particleCount]);
  useEffect(() => { swirlStrengthRef.current = swirlStrength; }, [swirlStrength]);
  useEffect(() => { trailLengthRef.current = trailLength; }, [trailLength]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 1800);
  };

  const getCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return { w: 800, h: 600 };
    return { w: canvas.width, h: canvas.height };
  }, []);

  const spawnParticle = useCallback((source: SwirlSource, currentMode?: DrawMode): Particle => {
    const m = currentMode ?? modeRef.current;
    const angle = Math.random() * Math.PI * 2;
    let speed = randomBetween(0.5, 2.5);
    let size = randomBetween(2, 8);
    let maxLife = randomBetween(60, 180);

    if (m === "inkdrop") {
      speed = randomBetween(1.5, 5);
      size = randomBetween(3, 14);
      maxLife = randomBetween(30, 90);
    } else if (m === "marbling") {
      speed = randomBetween(0.3, 1.2);
      size = randomBetween(1.5, 4);
      maxLife = randomBetween(150, 300);
    }

    return {
      x: source.x + randomBetween(-8, 8),
      y: source.y + randomBetween(-8, 8),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0,
      maxLife,
      size,
      color: source.color,
      angle,
      speed,
      mode: m,
    };
  }, []);

  const addSource = useCallback((x: number, y: number) => {
    const palette = paletteRef.current;
    const id = Date.now() + Math.random();
    const source: SwirlSource = {
      x, y,
      color: pickRandom(palette.colors),
      strength: swirlStrengthRef.current,
      active: true,
      id,
    };
    sourcesRef.current.push(source);
    for (let i = 0; i < 30; i++) {
      particlesRef.current.push(spawnParticle(source));
    }
    return id;
  }, [spawnParticle]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: false });
    if (!ctx) return;
    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    sourcesRef.current = [];
    particlesRef.current = [];
    const palette = PALETTES[paletteIdx];
    const { w, h } = { w: canvas.width, h: canvas.height };
    [{ x: w * 0.3, y: h * 0.4 }, { x: w * 0.7, y: h * 0.6 }, { x: w * 0.5, y: h * 0.3 }]
      .forEach(({ x, y }) => {
        const src: SwirlSource = { x, y, color: pickRandom(palette.colors), strength: swirlStrength, active: true, id: Math.random() };
        sourcesRef.current.push(src);
      });
  }, [paletteIdx, swirlStrength]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: false });
    if (!ctx) return;
    let running = true;

    const animate = () => {
      if (!running) return;
      const trail = trailLengthRef.current;
      const maxParts = particleCountRef.current * 10;
      const currentMode = modeRef.current;
      const sources = sourcesRef.current;
      const particles = particlesRef.current;
      const { w, h } = getCanvasSize();

      ctx.fillStyle = `rgba(10, 10, 15, ${trail})`;
      ctx.fillRect(0, 0, w, h);

      sources.forEach(source => {
        if (source.active && particles.length < maxParts) {
          const toSpawn = Math.max(1, Math.floor(particleCountRef.current / 25));
          for (let i = 0; i < toSpawn; i++) {
            particles.push(spawnParticle(source, currentMode));
          }
        }
      });

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        if (p.life > p.maxLife) { particles.splice(i, 1); continue; }

        const m = p.mode || currentMode;

        sources.forEach(source => {
          const dx = source.x - p.x;
          const dy = source.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy) + 0.001;
          const gravity = (source.strength * 200) / (dist * dist + 1);
          p.vx += (dx / dist) * gravity;
          p.vy += (dy / dist) * gravity;

          if (m === "swirl") {
            const perpX = -dy / dist;
            const perpY = dx / dist;
            p.vx += perpX * source.strength * 3;
            p.vy += perpY * source.strength * 3;
          } else if (m === "inkdrop") {
            p.vx -= (dx / dist) * gravity * 0.7;
            p.vy -= (dy / dist) * gravity * 0.7;
            p.vx *= 0.97;
            p.vy *= 0.97;
          } else if (m === "marbling") {
            const perpX = -dy / dist;
            const perpY = dx / dist;
            p.vx += perpX * source.strength * 1.5;
            p.vy += perpY * source.strength * 1.5;
            const noise = Math.sin(p.x * 0.03 + p.life * 0.04) * 0.15;
            p.vx += noise;
            p.vy += Math.cos(p.y * 0.03 + p.life * 0.04) * 0.15;
          }
        });

        const maxSpeed = m === "inkdrop" ? 9 : m === "marbling" ? 3 : 6;
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > maxSpeed) { p.vx = (p.vx / speed) * maxSpeed; p.vy = (p.vy / speed) * maxSpeed; }

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const lifeRatio = p.life / p.maxLife;
        const alpha = m === "inkdrop"
          ? Math.pow(1 - lifeRatio, 2)
          : Math.sin(lifeRatio * Math.PI);
        const radius = m === "marbling"
          ? p.size
          : p.size * (1 - lifeRatio * 0.5);

        if (m === "marbling") {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 4, p.y - p.vy * 4);
          ctx.strokeStyle = p.color + Math.floor(alpha * 180).toString(16).padStart(2, "0");
          ctx.lineWidth = radius;
          ctx.lineCap = "round";
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.5, radius), 0, Math.PI * 2);
          ctx.fillStyle = p.color + Math.floor(alpha * 200).toString(16).padStart(2, "0");
          ctx.fill();
        }
      }

      sources.forEach(source => {
        ctx.beginPath();
        ctx.arc(source.x, source.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = source.color;
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.4)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => { running = false; cancelAnimationFrame(animFrameRef.current); };
  }, [spawnParticle, getCanvasSize]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      switch (e.key) {
        case "Escape": clearCanvas(); showToast("Canvas cleared"); break;
        case " ": e.preventDefault(); randomizePalette(); showToast("Palette shuffled"); break;
        case "s": case "S": downloadCanvas(); showToast("Saved!"); break;
        case "1": setMode("swirl"); showToast("Mode: Swirl"); break;
        case "2": setMode("inkdrop"); showToast("Mode: Ink Drop"); break;
        case "3": setMode("marbling"); showToast("Mode: Marble"); break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top };
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    const pos = getPos(e);
    const sources = sourcesRef.current;
    let hitSource: SwirlSource | null = null;
    for (const s of sources) {
      const dx = s.x - pos.x; const dy = s.y - pos.y;
      if (Math.sqrt(dx * dx + dy * dy) < 22) { hitSource = s; break; }
    }
    if (hitSource) { isDraggingRef.current = true; dragIdRef.current = hitSource.id; }
    else { const id = addSource(pos.x, pos.y); isDraggingRef.current = true; dragIdRef.current = id; }
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDraggingRef.current || dragIdRef.current === null) return;
    const pos = getPos(e);
    const source = sourcesRef.current.find(s => s.id === dragIdRef.current);
    if (source) { source.x = pos.x; source.y = pos.y; }
  };

  const handlePointerUp = () => { isDraggingRef.current = false; dragIdRef.current = null; };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: false });
    if (!ctx) return;
    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    particlesRef.current = [];
    sourcesRef.current = [];
  };

  const randomizePalette = () => setPaletteIdx(Math.floor(Math.random() * PALETTES.length));

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `paint-swirl-${mode}-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleSubmitArtwork = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!username.trim()) { setShowSubmitPanel(true); return; }
    const dataUrl = canvas.toDataURL("image/png");
    const record = submitArtwork(dataUrl, PALETTES[paletteIdx].name, mode);
    showToast(`Saved as "${record.title}" by ${username}`);
    setShowGallery(true);
  };

  const handleShareCanvas = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        if (navigator.share && navigator.canShare?.({ files: [new File([blob], "studio-art.png", { type: "image/png" })] })) {
          await navigator.share({
            title: `Paint Swirl — ${mode}`,
            text: "Made with Halcyon Minx Studio 🌀",
            files: [new File([blob], "studio-art.png", { type: "image/png" })],
          });
        } else {
          await shareItem(window.location.href, "Paint Swirl Studio", "Made with Halcyon Minx Studio");
          showToast("Link copied!");
        }
      }, "image/png");
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col pt-14 pb-20">
      <SeoHead
        title="Paint Swirl Generator"
        description="Interactive physics-based generative art — create swirling, ink drop, and marble patterns in your browser. Save, share, or submit your creations."
        path="/paint-swirl"
        keywords="paint swirl, generative art, canvas physics, interactive art, particle system"
      />
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 flex-wrap gap-2">
        <div>
          <h1 className="text-white font-semibold text-sm">Paint Swirl Generator</h1>
          <p className="text-white/40 text-xs">Click canvas to add sources · Drag to move them</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex gap-1 bg-white/5 rounded-lg p-1">
            {(["swirl", "inkdrop", "marbling"] as DrawMode[]).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); showToast(`Mode: ${MODE_INFO[m].label}`); }}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  mode === m ? "bg-purple-600 text-white" : "text-white/50 hover:text-white"
                }`}
              >
                {MODE_INFO[m].label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowSettings(s => !s)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white/70 hover:text-white text-xs font-medium transition-colors"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Settings</span>
            {showSettings ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>}
          </button>
          <button
            onClick={() => setShowKeys(s => !s)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white/70 hover:text-white text-xs font-medium transition-colors"
          >
            <Keyboard className="w-3.5 h-3.5" />
          </button>
          <button onClick={randomizePalette} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white/70 hover:text-white text-xs font-medium transition-colors">
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Shuffle</span>
          </button>
          <button onClick={clearCanvas} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white/70 hover:text-white text-xs font-medium transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
          <button onClick={downloadCanvas} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-colors">
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showKeys && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-white/10 bg-black/40"
          >
            <div className="px-6 py-3 flex flex-wrap gap-x-8 gap-y-1 text-xs text-white/50">
              {[
                ["Esc", "Clear canvas"],
                ["Space", "Shuffle palette"],
                ["S", "Save image"],
                ["1", "Swirl mode"],
                ["2", "Ink Drop mode"],
                ["3", "Marble mode"],
              ].map(([key, desc]) => (
                <span key={key}>
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/70 font-mono">{key}</kbd>
                  <span className="ml-2">{desc}</span>
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-white/10 bg-black/30"
          >
            <div className="px-6 py-4 flex flex-wrap gap-8">
              <div className="flex flex-col gap-2 min-w-48">
                <label className="text-white/60 text-xs font-medium">
                  Color Palette — <span className="text-white/80">{PALETTES[paletteIdx].name}</span>
                </label>
                <div className="flex gap-2 flex-wrap">
                  {PALETTES.map((p, i) => (
                    <button
                      key={p.name}
                      onClick={() => setPaletteIdx(i)}
                      className={`flex gap-0.5 rounded-lg overflow-hidden border-2 transition-colors ${i === paletteIdx ? "border-white" : "border-transparent opacity-60 hover:opacity-100"}`}
                    >
                      {p.colors.slice(0, 4).map(c => <div key={c} className="w-4 h-6" style={{ backgroundColor: c }} />)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 min-w-40">
                <label className="text-white/60 text-xs font-medium">Particles: {particleCount}</label>
                <input type="range" min={10} max={200} value={particleCount}
                  onChange={e => setParticleCount(Number(e.target.value))}
                  className="accent-purple-500" />
              </div>

              <div className="flex flex-col gap-2 min-w-40">
                <label className="text-white/60 text-xs font-medium">Swirl Strength: {swirlStrength.toFixed(2)}</label>
                <input type="range" min={0.02} max={0.35} step={0.01} value={swirlStrength}
                  onChange={e => setSwirlStrength(Number(e.target.value))}
                  className="accent-purple-500" />
              </div>

              <div className="flex flex-col gap-2 min-w-40">
                <label className="text-white/60 text-xs font-medium">Trail Fade: {trailLength.toFixed(2)}</label>
                <input type="range" min={0.01} max={0.25} step={0.01} value={trailLength}
                  onChange={e => setTrailLength(Number(e.target.value))}
                  className="accent-purple-500" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-white/60 text-xs font-medium">Current Mode</label>
                <p className="text-white/50 text-xs max-w-48">{MODE_INFO[mode].hint}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        />

        <AnimatePresence>
          {toastMsg && (
            <motion.div
              key={toastMsg + Date.now()}
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-xs font-medium border border-white/20 pointer-events-none"
            >
              {toastMsg}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
