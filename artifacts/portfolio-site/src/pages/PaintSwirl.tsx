import { useRef, useEffect, useState, useCallback } from "react";
import { Trash2, Download, Shuffle, Settings2, ChevronDown, ChevronUp } from "lucide-react";

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
}

interface SwirlSource {
  x: number;
  y: number;
  color: string;
  strength: number;
  active: boolean;
  id: number;
}

const PALETTES = [
  {
    name: "Aurora",
    colors: ["#a855f7", "#ec4899", "#f97316", "#eab308", "#22c55e", "#06b6d4"],
  },
  {
    name: "Ocean",
    colors: ["#0ea5e9", "#38bdf8", "#67e8f9", "#06b6d4", "#0891b2", "#0e7490"],
  },
  {
    name: "Fire",
    colors: ["#ef4444", "#f97316", "#eab308", "#dc2626", "#b45309", "#fbbf24"],
  },
  {
    name: "Forest",
    colors: ["#22c55e", "#16a34a", "#4ade80", "#86efac", "#15803d", "#84cc16"],
  },
  {
    name: "Candy",
    colors: ["#f472b6", "#e879f9", "#c084fc", "#818cf8", "#60a5fa", "#34d399"],
  },
  {
    name: "Midnight",
    colors: ["#6d28d9", "#7c3aed", "#8b5cf6", "#4f46e5", "#4338ca", "#1e1b4b"],
  },
];

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function PaintSwirl() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const sourcesRef = useRef<SwirlSource[]>([]);
  const animFrameRef = useRef<number>(0);
  const frameRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragIdRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [paletteIdx, setPaletteIdx] = useState(0);
  const [particleCount, setParticleCount] = useState(60);
  const [swirlStrength, setSwirlStrength] = useState(0.12);
  const [trailLength, setTrailLength] = useState(0.06);
  const [showSettings, setShowSettings] = useState(false);
  const paletteRef = useRef(PALETTES[0]);

  useEffect(() => {
    paletteRef.current = PALETTES[paletteIdx];
  }, [paletteIdx]);

  const getCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return { w: 800, h: 600 };
    return { w: canvas.width, h: canvas.height };
  }, []);

  const spawnParticle = useCallback((source: SwirlSource): Particle => {
    const angle = Math.random() * Math.PI * 2;
    const speed = randomBetween(0.5, 2.5);
    return {
      x: source.x + randomBetween(-10, 10),
      y: source.y + randomBetween(-10, 10),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0,
      maxLife: randomBetween(60, 180),
      size: randomBetween(2, 8),
      color: source.color,
      angle,
      speed,
    };
  }, []);

  const addSource = useCallback((x: number, y: number) => {
    const palette = paletteRef.current;
    const id = Date.now();
    const source: SwirlSource = {
      x,
      y,
      color: pickRandom(palette.colors),
      strength: swirlStrength,
      active: true,
      id,
    };
    sourcesRef.current.push(source);
    for (let i = 0; i < 20; i++) {
      particlesRef.current.push(spawnParticle(source));
    }
    return id;
  }, [swirlStrength, spawnParticle]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width = rect.width;
      canvas.height = rect.height;
      ctx.putImageData(imageData, 0, 0);
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

    const initialSources = [
      { x: w * 0.3, y: h * 0.4 },
      { x: w * 0.7, y: h * 0.6 },
      { x: w * 0.5, y: h * 0.3 },
    ];

    initialSources.forEach(({ x, y }) => {
      const source: SwirlSource = {
        x,
        y,
        color: pickRandom(palette.colors),
        strength: swirlStrength,
        active: true,
        id: Math.random(),
      };
      sourcesRef.current.push(source);
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
      frameRef.current++;

      ctx.fillStyle = `rgba(10, 10, 15, ${trailLength})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const sources = sourcesRef.current;
      const particles = particlesRef.current;

      sources.forEach((source) => {
        if (source.active) {
          const toSpawn = Math.floor(particleCount / 30);
          for (let i = 0; i < toSpawn; i++) {
            if (particles.length < particleCount * 10) {
              particles.push(spawnParticle(source));
            }
          }
        }
      });

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        if (p.life > p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        sources.forEach((source) => {
          const dx = source.x - p.x;
          const dy = source.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy) + 0.001;
          const gravity = (source.strength * 200) / (dist * dist + 1);
          p.vx += (dx / dist) * gravity;
          p.vy += (dy / dist) * gravity;

          const perpX = -dy / dist;
          const perpY = dx / dist;
          const curl = source.strength * 3;
          p.vx += perpX * curl;
          p.vy += perpY * curl;
        });

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 6) {
          p.vx = (p.vx / speed) * 6;
          p.vy = (p.vy / speed) * 6;
        }

        p.x += p.vx;
        p.y += p.vy;

        const { w, h } = getCanvasSize();
        if (p.x < 0) { p.x = w; }
        if (p.x > w) { p.x = 0; }
        if (p.y < 0) { p.y = h; }
        if (p.y > h) { p.y = 0; }

        const lifeRatio = p.life / p.maxLife;
        const alpha = Math.sin(lifeRatio * Math.PI);
        const radius = p.size * (1 - lifeRatio * 0.5);

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, radius), 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(alpha * 200).toString(16).padStart(2, "0");
        ctx.fill();
      }

      sources.forEach((source) => {
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
    return () => {
      running = false;
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [trailLength, particleCount, spawnParticle, getCanvasSize]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    const pos = getPos(e);
    const sources = sourcesRef.current;
    let hitSource: SwirlSource | null = null;
    for (const s of sources) {
      const dx = s.x - pos.x;
      const dy = s.y - pos.y;
      if (Math.sqrt(dx * dx + dy * dy) < 20) {
        hitSource = s;
        break;
      }
    }

    if (hitSource) {
      isDraggingRef.current = true;
      dragIdRef.current = hitSource.id;
    } else {
      const id = addSource(pos.x, pos.y);
      isDraggingRef.current = true;
      dragIdRef.current = id;
    }
    mouseRef.current = pos;
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDraggingRef.current || dragIdRef.current === null) return;
    const pos = getPos(e);
    const source = sourcesRef.current.find(s => s.id === dragIdRef.current);
    if (source) {
      source.x = pos.x;
      source.y = pos.y;
    }
    mouseRef.current = pos;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    dragIdRef.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    particlesRef.current = [];
    sourcesRef.current = [];
  };

  const randomizePalette = () => {
    setPaletteIdx(Math.floor(Math.random() * PALETTES.length));
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "paint-swirl.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col pt-14">
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/10">
        <div>
          <h1 className="text-white font-semibold text-sm">Paint Swirl Generator</h1>
          <p className="text-white/40 text-xs">Click or drag to add swirl sources</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(s => !s)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white/70 hover:text-white text-xs font-medium transition-colors"
          >
            <Settings2 className="w-3.5 h-3.5" />
            Settings
            {showSettings ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>}
          </button>
          <button
            onClick={randomizePalette}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white/70 hover:text-white text-xs font-medium transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5" />
            Shuffle Colors
          </button>
          <button
            onClick={clearCanvas}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white/70 hover:text-white text-xs font-medium transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
          <button
            onClick={downloadCanvas}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Save
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="px-6 py-4 border-b border-white/10 bg-black/30 flex flex-wrap gap-8">
          <div className="flex flex-col gap-2 min-w-48">
            <label className="text-white/60 text-xs font-medium">Color Palette: {PALETTES[paletteIdx].name}</label>
            <div className="flex gap-2 flex-wrap">
              {PALETTES.map((p, i) => (
                <button
                  key={p.name}
                  onClick={() => setPaletteIdx(i)}
                  className={`flex gap-0.5 rounded-lg overflow-hidden border-2 transition-colors ${i === paletteIdx ? "border-white" : "border-transparent"}`}
                >
                  {p.colors.slice(0, 4).map(c => (
                    <div key={c} className="w-4 h-6" style={{ backgroundColor: c }} />
                  ))}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 min-w-40">
            <label className="text-white/60 text-xs font-medium">Particles: {particleCount}</label>
            <input
              type="range"
              min={20}
              max={150}
              value={particleCount}
              onChange={e => setParticleCount(Number(e.target.value))}
              className="accent-purple-500"
            />
          </div>

          <div className="flex flex-col gap-2 min-w-40">
            <label className="text-white/60 text-xs font-medium">Swirl Strength: {swirlStrength.toFixed(2)}</label>
            <input
              type="range"
              min={0.02}
              max={0.3}
              step={0.01}
              value={swirlStrength}
              onChange={e => setSwirlStrength(Number(e.target.value))}
              className="accent-purple-500"
            />
          </div>

          <div className="flex flex-col gap-2 min-w-40">
            <label className="text-white/60 text-xs font-medium">Trail Fade: {trailLength.toFixed(2)}</label>
            <input
              type="range"
              min={0.01}
              max={0.2}
              step={0.01}
              value={trailLength}
              onChange={e => setTrailLength(Number(e.target.value))}
              className="accent-purple-500"
            />
          </div>
        </div>
      )}

      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
        />

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none">
          {sourcesRef.current.map((s) => (
            <div key={s.id} className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
          ))}
        </div>
      </div>
    </div>
  );
}
