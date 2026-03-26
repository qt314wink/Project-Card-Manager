import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Clock, Tag, ArrowLeft, ChevronRight } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SeoHead } from "@/components/SeoHead";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  readTime: number;
  date: string;
  fractalType: "sierpinski" | "julia" | "barnsley" | "mandelbrot" | "lissajous" | "dragon";
  gradient: string;
}

const ARTICLES: Article[] = [
  {
    id: "physics-ui",
    title: "Physics-Driven UI: When Interfaces Behave Like Matter",
    excerpt: "What happens when you stop fighting physics and start using it as a design material? Springs, damping, and inertia belong in your design toolkit.",
    content: `Physics simulation in user interfaces isn't just a visual trick — it's a fundamentally different way of thinking about interaction. Instead of defining where something ends up, you define how it *behaves*, and let the math decide the result.

## Why Springs, Not Tweens

A traditional animation says: "move from A to B in 300ms with an ease-out curve." A spring animation says: "apply a restoring force toward B, with this stiffness and this damping coefficient." The difference sounds academic, but it changes everything about how motion *feels*.

With tweens, interrupting an animation mid-flight creates a jarring discontinuity. With springs, interruption is seamless — the spring simply redirects from wherever it currently is. This is why native mobile apps feel physically satisfying in ways that most web interfaces don't.

## Framer Motion's Spring Model

Framer Motion exposes three parameters: **stiffness** (how strongly the spring pulls toward target), **damping** (how much it resists motion — overdamped springs don't oscillate), and **mass** (how heavy the object feels). The magic is in their ratios.

- \`stiffness: 400, damping: 30\` — snappy, playful, slightly bouncy
- \`stiffness: 100, damping: 20\` — soft, organic, like a cloth
- \`stiffness: 800, damping: 80\` — precise, confident, app-like

## Building Magnetic Buttons

The "magnetic" hover effect that drags an element toward the cursor is a direct application of this. You measure mouse distance from the element center, then apply a spring toward a computed offset — but only when the cursor is within a threshold radius. When it leaves, the spring snaps back. The result is a button that feels like it *wants* to be clicked.

\`\`\`typescript
const handleMouseMove = (e: MouseEvent) => {
  const rect = el.getBoundingClientRect();
  const dx = e.clientX - (rect.left + rect.width / 2);
  const dy = e.clientY - (rect.top + rect.height / 2);
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < THRESHOLD) {
    x.set(dx * 0.35);
    y.set(dy * 0.35);
  }
};
\`\`\`

## The Gravity of Attention

Physics metaphors work because users have spent their entire lives experiencing physics. When something accelerates like a falling object, it *feels* fast even at modest pixel velocities. When it springs back, it feels *alive*. When it resists and overcomes inertia, it feels *heavy* and substantial.

This isn't decoration. Physics simulation is a communication tool. The challenge is choosing the right physical metaphor for each interaction's meaning.`,
    tags: ["Physics", "Animation", "UX", "Framer Motion"],
    readTime: 6,
    date: "2026-03-15",
    fractalType: "lissajous",
    gradient: "from-violet-600 via-purple-700 to-indigo-800",
  },
  {
    id: "generative-canvas",
    title: "Making Art With Math: A Canvas API Deep Dive",
    excerpt: "The Canvas 2D API is a surprisingly deep tool for generative art. Particle systems, flow fields, and color blending from scratch — no frameworks needed.",
    content: `The HTML Canvas element is often underestimated. Web developers reach for SVG for illustrations, WebGL for 3D, and frameworks for everything else. But Canvas 2D sits in a sweet spot: it's fast enough for thousands of moving elements, expressive enough for complex blending, and approachable enough to build with pure mathematics and zero abstractions.

## The Render Loop

Every generative Canvas piece starts with the same fundamental pattern: an \`requestAnimationFrame\` loop that clears, updates physics, and redraws. The key decision is *how* you clear the canvas. Full clear (\`clearRect\`) gives you crisp, framelike rendering. Partial clear — painting a semi-transparent black rectangle over the previous frame — creates motion blur and trails.

\`\`\`javascript
const draw = () => {
  ctx.fillStyle = "rgba(0,0,0,0.05)";
  ctx.fillRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(ctx); });
  requestAnimationFrame(draw);
};
\`\`\`

The 0.05 alpha means each frame decays by 5%. A particle's trail persists for roughly 20 frames before fading to black. Adjust this one number and the entire character of the piece changes.

## Curl Noise and Flow Fields

The most beautiful particle systems use curl noise — a vector field derived from Perlin noise that has zero divergence. This means particles don't cluster (which divergent fields cause) but instead flow in smooth, continuous ribbons.

The implementation takes the gradient of a scalar noise field and rotates it 90 degrees: \`velocity = rotate90(gradient(noise(x, y, t)))\`. The result is streaming patterns that look organic and self-organizing — like ink in water.

## Alpha Blending Tricks

Canvas compositing modes are where things get interesting. \`globalCompositeOperation = "screen"\` brightens colors where they overlap, creating luminous glowing effects without explicit glow shaders. \`"multiply"\` darkens, creating the look of physical paint mixing. \`"lighter"\` (additive blending) is how you fake HDR light emission.

The painter working in Canvas 2D has an advantage over the WebGL programmer: these blending modes are single property assignments, not shader code.

## Practical Performance

For 2,000 particles at 60fps you need each particle to cost under 8 microseconds of computation. Key optimizations: avoid object allocation in the hot path, use typed arrays for particle data, batch same-color draws with a single \`beginPath\`, and cache \`Math.sin\`/\`Math.cos\` lookups in a lookup table.`,
    tags: ["Canvas", "Generative Art", "JavaScript", "Math"],
    readTime: 8,
    date: "2026-03-08",
    fractalType: "barnsley",
    gradient: "from-fuchsia-600 via-pink-700 to-rose-800",
  },
  {
    id: "fractals",
    title: "The Infinite Edge: Fractals, Self-Similarity, and Code",
    excerpt: "Fractals are where mathematics becomes art. From the Mandelbrot set to the Barnsley fern, these recursive structures reveal a universe of complexity hiding in simple rules.",
    content: `A fractal is a shape with infinite detail at every scale — zoom in anywhere and you find the same structural patterns repeating. This isn't a visual trick; it's a mathematical property called self-similarity, and it appears throughout nature in ways that make fractals genuinely useful for modeling the world.

## The Mandelbrot Set

The Mandelbrot set is defined by a disarmingly simple rule: for each complex number c, repeatedly apply \`z = z² + c\` starting from z=0. If this sequence stays bounded, c is in the set. If it escapes to infinity, it isn't.

What makes this remarkable is that the boundary between "escapes" and "doesn't escape" has infinite complexity. Every zoom reveals new structures — spirals, filaments, baby Mandelbrots — that are neither repeating patterns nor random noise. The set is deterministic, infinite, and irreducibly complex.

For rendering, you assign colors based on how many iterations it took to escape. Smooth coloring uses the fractional iteration count: \`smooth = iter - log(log(|z|)) / log(2)\`, which eliminates the banding artifacts of integer iteration coloring.

## The Barnsley Fern

The fern is generated by a completely different mechanism: an Iterated Function System (IFS). Four affine transformations are applied randomly (with weighted probability) to a point, over and over. After 100,000 iterations, the accumulated points form the shape of a fern leaf.

The four transformations correspond to the stem, the large leaflets, the small leftward leaflets, and the small rightward leaflets. Change any coefficient slightly and the fern becomes something else — a different plant, a spiral, chaos.

## Fractal Dimension

Classical geometry measures dimension as an integer: a line is 1D, a plane is 2D, a cube is 3D. Fractals have *fractional* dimension. The coastline of Britain, measured at finer and finer scales, grows without bound — it has a fractal dimension of approximately 1.25. The Sierpinski triangle has dimension log(3)/log(2) ≈ 1.585.

This non-integer dimension is a precise measure of how much space a fractal fills. It's one reason fractal geometry is useful for modeling natural textures: terrain, clouds, bark, and turbulence all have characteristic fractal dimensions.

## Building Fractals in the Browser

Julia sets render beautifully in Canvas 2D at modest resolutions. The key optimization is computing only the screen-space pixels, not a full complex plane discretization. Web Workers let you compute heavy fractal passes off the main thread, then transfer the resulting ImageData buffer to the canvas.

For interactive fractals with zoom, you store the current viewport in complex plane coordinates and recompute on change. A simple Mandelbrot renderer that fits in 80 lines of code can zoom 10¹² deep before floating-point precision gives out — at which point you'd switch to arbitrary-precision arithmetic.`,
    tags: ["Fractals", "Math", "Canvas", "Algorithms"],
    readTime: 10,
    date: "2026-02-22",
    fractalType: "mandelbrot",
    gradient: "from-cyan-600 via-teal-700 to-emerald-800",
  },
  {
    id: "web-audio",
    title: "Building a Synthesizer in the Browser: Web Audio API",
    excerpt: "The Web Audio API is a professional-grade audio engine built into every modern browser. Here's how to build an oscillator, sequencer, and effects chain from scratch.",
    content: `The Web Audio API gives you a complete audio processing graph inside the browser — oscillators, filters, effects chains, compressors, and a sample-accurate timing system. It's not a toy. Professional DAWs have been built on it.

## The AudioContext Graph

Everything in Web Audio is a node connected to other nodes, terminating at \`AudioContext.destination\` (your speakers). A minimal synthesizer:

\`\`\`javascript
const ctx = new AudioContext();
const osc = ctx.createOscillator();
const gain = ctx.createGain();
osc.frequency.value = 440; // A4
gain.gain.value = 0.5;
osc.connect(gain);
gain.connect(ctx.destination);
osc.start();
\`\`\`

This plays a 440Hz sine wave. Add a \`BiquadFilterNode\` and you have a synthesizer. Connect a \`DelayNode\` and a \`GainNode\` in a feedback loop and you have an echo effect.

## Precise Note Scheduling

The critical insight for building a sequencer is that \`AudioContext.currentTime\` is a high-precision clock that advances even when JavaScript is paused by garbage collection or event handling. You should *never* use \`setTimeout\` or \`setInterval\` for note timing — they're imprecise. Instead, schedule notes ahead of time using the audio graph's own clock.

The standard pattern is a "lookahead" scheduler: a \`setInterval\` running at 25ms checks whether the next note falls within the next 100ms window. If so, it schedules it using \`OscillatorNode.start(time)\` — AudioContext time, not wall clock time. This gives sample-accurate timing despite JavaScript's single-threaded nature.

## Envelope: ADSR

A raw oscillator sounds harsh because it clicks on and off instantly. An ADSR envelope (Attack, Decay, Sustain, Release) shapes the amplitude over time:

- **Attack**: ramp from 0 to peak volume
- **Decay**: ramp from peak to sustain level
- **Sustain**: hold at sustain level while key is held
- **Release**: ramp from sustain to 0 when key is released

In Web Audio, this uses \`AudioParam\` automation: \`gain.gain.linearRampToValueAtTime(peak, ctx.currentTime + attack)\`. Crucially, multiple calls chain together, giving you precise control over the entire envelope without timers.

## The Additive Synthesis Trick

Sine waves alone sound thin. But add the second, third, and fourth harmonics (2x, 3x, 4x the fundamental frequency) with decreasing amplitudes, and you build up rich timbres. This is additive synthesis — how pipe organs work. A sawtooth wave is literally the sum of all harmonics with amplitude 1/n. A square wave is the sum of odd harmonics. Web Audio's built-in waveform types are computed shortcuts for these infinite sums.

For truly custom timbres, \`OscillatorNode.setPeriodicWave\` lets you define the harmonic series explicitly using Fourier coefficients — you are, in effect, drawing the sound's spectrum.`,
    tags: ["Web Audio", "Music", "JavaScript", "Synthesis"],
    readTime: 9,
    date: "2026-02-10",
    fractalType: "julia",
    gradient: "from-amber-500 via-orange-600 to-red-700",
  },
  {
    id: "creative-coding",
    title: "Creative Coding as a Discipline: Notes From the Studio",
    excerpt: "Creative coding sits between art and engineering, borrowing the rigor of one and the expressive freedom of the other. Here's what a year of daily practice taught me.",
    content: `Creative coding is often described as using code as an artistic medium, which is true but incomplete. It's more accurate to say it treats algorithms as compositional tools — the way a musician treats harmony and rhythm, or a painter treats brush and texture.

## The Daily Practice

The most important habit in creative coding is shipping small things. Not polished — small. A generative sketch that runs for ten minutes. A new noise function applied to an old system. An unexpected emergent behavior that you stumbled on by typo. The practice is accumulative; the breakthroughs are almost always accidents that you recognize because you've built up enough context to understand what you're seeing.

Processing (the Java environment) pioneered this with its "sketch" paradigm. Everything is a sketch; everything is provisional; everything can be thrown away. This is the correct epistemic stance for exploratory coding.

## Randomness Is Not Chaos

Novice generative artists over-randomize. Everything jiggles, everything varies — the result looks like visual noise, which literally is noise. Expert practitioners use randomness sparingly and precisely: a single random seed that determines everything about a composition, reproducible across runs. Or a narrow window of random variation around a carefully chosen deterministic structure.

The question to ask about any random parameter: "If this were fixed at its average value, would I lose anything meaningful?" If no, remove the randomness. The best generative systems feel surprising but *inevitable*.

## On Sharing Work

The generative art community has settled on a healthy norm: share source code. Not because code is more valuable than output, but because the ideas are more valuable than either. A technique that took you three days to develop might give another artist a new direction they'd never have reached in three years.

This studio runs on that principle. Every algorithm here started as an idea borrowed from someone else — a paper, a forum post, a half-explained tweet — and was rebuilt from scratch to fully understand it.

## Tools vs. Materials

There's a recurring debate about which tools to use: Processing, p5.js, OpenFrameworks, Touchdesigner, plain JavaScript, GLSL. My answer: use whatever lets you *think* most fluently. The medium matters less than the ideas. But learn the lower-level tools too — understanding what p5.js wraps helps you understand what p5.js can't do. At some point every creative coder hits the ceiling of their abstraction layer and needs to go deeper.

The ceiling of the browser is roughly: 2D canvas for 10,000 elements, WebGL for 10,000,000. Between those poles lies an enormous amount of creative space.`,
    tags: ["Creative Coding", "Practice", "Philosophy", "Art"],
    readTime: 7,
    date: "2026-01-28",
    fractalType: "sierpinski",
    gradient: "from-slate-600 via-zinc-700 to-neutral-800",
  },
  {
    id: "noise-fields",
    title: "Perlin Noise, Simplex, and the Art of Organic Randomness",
    excerpt: "Not all randomness is created equal. The noise functions that make generative art look organic have a fascinating mathematical history — and they're not hard to use.",
    content: `In 1983, Ken Perlin was working on the visual effects for the film Tron. He needed a way to make surfaces look like natural materials — stone, water, smoke — rather than the mathematical perfection of computer graphics. The noise function he invented won an Academy Award and became one of the most influential algorithms in computer graphics.

## What Makes Noise "Coherent"

Pure random noise (\`Math.random()\` at every pixel) produces static — every pixel is independent of its neighbors. Natural textures have the opposite property: nearby points are similar, far points are uncorrelated. Perlin noise achieves this by interpolating between randomly-chosen gradients at integer grid points.

The result has a characteristic scale: at a given "frequency", the noise varies smoothly over a certain distance. By layering noise at multiple frequencies and amplitudes (each octave doubling the frequency and halving the amplitude), you build *fractal Brownian motion* — the noise pattern used for clouds, terrain, and water.

## Simplex vs. Perlin

Simplex noise (also by Perlin, introduced in 2001) fixes several problems with the original algorithm. Perlin noise has visible grid artifacts at 45-degree angles because its grid is axis-aligned. Simplex noise uses a triangular (simplex) grid, which has no preferred orientation. It's also faster in higher dimensions and has a smaller footprint.

For 2D creative coding, both work well. For 3D animated noise (where one dimension is time), simplex's better isotropy matters.

## Curl Noise: The Most Beautiful Derivative

The most useful thing you can do with a noise field in generative art is compute its *curl*. For a 2D scalar noise field N(x,y), the curl is the 2D vector: \`(∂N/∂y, -∂N/∂x)\`. In plain English: you take the gradient of the noise and rotate it 90 degrees.

Why is this useful? Curl fields are *divergence-free* — they have no sources or sinks. Particles flowing through a curl noise field don't cluster together or spread apart; they maintain their density. This gives you the organic, streaming patterns that characterize the best generative particle systems.

Computing the curl numerically requires only two noise lookups per particle per frame: \`noise(x, y+eps)\` and \`noise(x+eps, y)\`. The difference gives you the gradient; rotate and you have the curl velocity.

## Time as the Third Dimension

Animated noise fields use 3D noise: \`N(x, y, t)\` where t is time. Advancing t slowly through the noise field creates smooth, continuous evolution that looks like a living texture. Different values of dt create different moods: slow drift reads as "weather"; fast jitter reads as "static". 

A beautiful trick: offset different particles or layers by different amounts in the noise domain. Two particles at the same screen position sample different points in noise space, so they diverge — simulating turbulence without explicitly computing fluid dynamics.`,
    tags: ["Math", "Noise", "Algorithms", "Creative Coding"],
    readTime: 8,
    date: "2026-01-12",
    fractalType: "dragon",
    gradient: "from-green-600 via-emerald-700 to-teal-800",
  },
];

function FractalImage({ type, gradient }: { type: Article["fractalType"]; gradient: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;

    const drawFractal = () => {
      ctx.clearRect(0, 0, W, H);

      if (type === "lissajous") {
        ctx.strokeStyle = "rgba(255,255,255,0.6)";
        ctx.lineWidth = 1.5;
        for (let a = 3; a <= 5; a++) {
          for (let b = 2; b <= 4; b++) {
            ctx.beginPath();
            for (let t = 0; t <= Math.PI * 2; t += 0.02) {
              const x = W / 2 + (W * 0.35) * Math.sin(a * t + Math.PI / 4);
              const y = H / 2 + (H * 0.35) * Math.sin(b * t);
              t === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }
            ctx.globalAlpha = 0.3;
            ctx.stroke();
          }
        }
        ctx.globalAlpha = 1;
      }

      else if (type === "sierpinski") {
        const drawTri = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, depth: number) => {
          if (depth === 0) {
            ctx.fillStyle = "rgba(255,255,255,0.7)";
            ctx.beginPath();
            ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3);
            ctx.closePath(); ctx.fill();
            return;
          }
          const mx12 = (x1 + x2) / 2, my12 = (y1 + y2) / 2;
          const mx23 = (x2 + x3) / 2, my23 = (y2 + y3) / 2;
          const mx13 = (x1 + x3) / 2, my13 = (y1 + y3) / 2;
          drawTri(x1, y1, mx12, my12, mx13, my13, depth - 1);
          drawTri(mx12, my12, x2, y2, mx23, my23, depth - 1);
          drawTri(mx13, my13, mx23, my23, x3, y3, depth - 1);
        };
        drawTri(W * 0.5, H * 0.08, W * 0.05, H * 0.92, W * 0.95, H * 0.92, 5);
      }

      else if (type === "barnsley") {
        let x = 0, y = 0;
        ctx.fillStyle = "rgba(150,255,150,0.8)";
        for (let i = 0; i < 15000; i++) {
          const r = Math.random();
          let nx, ny;
          if (r < 0.01) { nx = 0; ny = 0.16 * y; }
          else if (r < 0.86) { nx = 0.85 * x + 0.04 * y; ny = -0.04 * x + 0.85 * y + 1.6; }
          else if (r < 0.93) { nx = 0.2 * x - 0.26 * y; ny = 0.23 * x + 0.22 * y + 1.6; }
          else { nx = -0.15 * x + 0.28 * y; ny = 0.26 * x + 0.24 * y + 0.44; }
          x = nx; y = ny;
          const px = Math.floor(W / 2 + x * W * 0.08);
          const py = Math.floor(H - y * H * 0.1 - 2);
          ctx.fillRect(px, py, 1, 1);
        }
      }

      else if (type === "mandelbrot") {
        const imageData = ctx.createImageData(W, H);
        const d = imageData.data;
        for (let px = 0; px < W; px++) {
          for (let py = 0; py < H; py++) {
            const x0 = (px / W) * 3.5 - 2.5;
            const y0 = (py / H) * 2 - 1;
            let x = 0, y = 0, iter = 0;
            const maxIter = 80;
            while (x * x + y * y <= 4 && iter < maxIter) {
              const xt = x * x - y * y + x0;
              y = 2 * x * y + y0;
              x = xt;
              iter++;
            }
            const idx = (py * W + px) * 4;
            if (iter < maxIter) {
              const t = iter / maxIter;
              d[idx] = Math.floor(9 * (1 - t) * t * t * t * 255);
              d[idx + 1] = Math.floor(15 * (1 - t) * (1 - t) * t * t * 255);
              d[idx + 2] = Math.floor(8.5 * (1 - t) * (1 - t) * (1 - t) * t * 255);
            }
            d[idx + 3] = 255;
          }
        }
        ctx.putImageData(imageData, 0, 0);
      }

      else if (type === "julia") {
        const imageData = ctx.createImageData(W, H);
        const d = imageData.data;
        const cr = -0.7, ci = 0.27;
        for (let px = 0; px < W; px++) {
          for (let py = 0; py < H; py++) {
            let x = (px / W) * 3.5 - 1.75;
            let y = (py / H) * 3.5 - 1.75;
            let iter = 0;
            const maxIter = 80;
            while (x * x + y * y <= 4 && iter < maxIter) {
              const xt = x * x - y * y + cr;
              y = 2 * x * y + ci;
              x = xt;
              iter++;
            }
            const idx = (py * W + px) * 4;
            if (iter < maxIter) {
              const t = iter / maxIter;
              d[idx] = Math.floor(t * t * 255);
              d[idx + 1] = Math.floor(Math.sin(t * Math.PI) * 150);
              d[idx + 2] = Math.floor((1 - t) * 255);
            }
            d[idx + 3] = 255;
          }
        }
        ctx.putImageData(imageData, 0, 0);
      }

      else if (type === "dragon") {
        const steps = 14;
        let seq = [true];
        for (let i = 1; i < steps; i++) {
          const newSeq = [...seq, true, ...seq.map(b => !b).reverse()];
          seq = newSeq;
        }
        let x = W / 2, y = H / 2, angle = 0;
        const step = 3;
        ctx.strokeStyle = "rgba(255,255,255,0.7)";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(x, y);
        seq.forEach(turnRight => {
          angle += turnRight ? -Math.PI / 2 : Math.PI / 2;
          x += Math.cos(angle) * step;
          y += Math.sin(angle) * step;
          ctx.lineTo(x, y);
        });
        ctx.stroke();
      }
    };

    drawFractal();
  }, [type]);

  return (
    <div className={`relative w-full h-full bg-gradient-to-br ${gradient} rounded-xl overflow-hidden`}>
      <canvas ref={canvasRef} width={160} height={120} className="absolute inset-0 w-full h-full opacity-70 mix-blend-screen" />
    </div>
  );
}

export default function Blog() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Article | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    ARTICLES.forEach(a => a.tags.forEach(t => set.add(t)));
    return [...set];
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return ARTICLES.filter(a => {
      const matchSearch = !q || a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q) || a.tags.some(t => t.toLowerCase().includes(q));
      const matchTag = !activeTag || a.tags.includes(activeTag);
      return matchSearch && matchTag;
    });
  }, [search, activeTag]);

  return (
    <div className="min-h-screen bg-[--color-bg] pb-28">
      <SeoHead
        title="Blog"
        description="Articles on creative coding, generative art, physics-based UI, Web Audio synthesis, fractals, and the practice of making interactive art with code."
        path="/blog"
        keywords="creative coding, generative art, canvas API, web audio, fractals, interactive design"
      />

      <AnimatePresence mode="wait">
        {selected ? (
          <ArticleView key="article" article={selected} onBack={() => setSelected(null)} />
        ) : (
          <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

            {/* Header */}
            <div className="border-b border-[--color-border] bg-gradient-to-b from-[--color-surface] to-transparent">
              <div className="max-w-5xl mx-auto px-6 pt-16 pb-10">
                <ScrollReveal>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[--color-accent] text-sm font-medium uppercase tracking-widest">Studio Blog</span>
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-black text-[--color-fg] mb-4">From the Lab</h1>
                  <p className="text-[--color-fg-muted] max-w-xl">
                    Articles on creative coding, generative art, physics, sound, and the practice of making things with math and code.
                  </p>
                </ScrollReveal>

                <ScrollReveal delay={100} className="mt-8">
                  <div className="relative max-w-md">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[--color-fg-muted]" />
                    <input
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search articles..."
                      className="w-full pl-10 pr-10 py-3 rounded-xl bg-[--color-surface] border border-[--color-border] text-[--color-fg] placeholder:text-[--color-fg-muted] text-sm focus:outline-none focus:border-[--color-primary] transition-colors"
                    />
                    {search && (
                      <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[--color-fg-muted] hover:text-[--color-fg]">
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={150} className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveTag(null)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${!activeTag ? "bg-[--color-primary] text-white border-[--color-primary]" : "border-[--color-border] text-[--color-fg-muted] hover:border-[--color-primary]"}`}
                  >
                    All
                  </button>
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${activeTag === tag ? "bg-[--color-primary] text-white border-[--color-primary]" : "border-[--color-border] text-[--color-fg-muted] hover:border-[--color-primary]"}`}
                    >
                      {tag}
                    </button>
                  ))}
                </ScrollReveal>
              </div>
            </div>

            {/* Article grid */}
            <div className="max-w-5xl mx-auto px-6 py-12">
              {filtered.length === 0 ? (
                <p className="text-[--color-fg-muted] text-center py-20">No articles match your search.</p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((article, i) => (
                    <ScrollReveal key={article.id} delay={i * 60}>
                      <motion.button
                        whileHover={{ y: -4, scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setSelected(article)}
                        className="w-full text-left rounded-2xl bg-[--color-surface] border border-[--color-border] hover:border-[--color-primary]/50 overflow-hidden transition-colors group"
                      >
                        <div className="h-36 relative">
                          <FractalImage type={article.fractalType} gradient={article.gradient} />
                          <div className="absolute top-3 right-3 flex gap-1 flex-wrap justify-end">
                            {article.tags.slice(0, 2).map(t => (
                              <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-black/40 text-white/80 backdrop-blur-sm">{t}</span>
                            ))}
                          </div>
                        </div>
                        <div className="p-5">
                          <div className="flex items-center gap-2 text-xs text-[--color-fg-muted] mb-2">
                            <Clock size={11} />
                            <span>{article.readTime} min read</span>
                            <span>·</span>
                            <span>{new Date(article.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                          </div>
                          <h3 className="font-bold text-[--color-fg] leading-snug mb-2 group-hover:text-[--color-primary] transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-xs text-[--color-fg-muted] leading-relaxed line-clamp-3">
                            {article.excerpt}
                          </p>
                          <div className="mt-4 flex items-center gap-1 text-[--color-primary] text-xs font-semibold">
                            Read article <ChevronRight size={12} />
                          </div>
                        </div>
                      </motion.button>
                    </ScrollReveal>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ArticleView({ article, onBack }: { article: Article; onBack: () => void }) {
  const paragraphs = article.content.split("\n\n");

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      {/* Hero */}
      <div className={`relative bg-gradient-to-br ${article.gradient} overflow-hidden`}>
        <div className="relative max-w-4xl mx-auto px-6 pt-10 pb-14">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/70 hover:text-white mb-8 text-sm transition-colors"
          >
            <ArrowLeft size={15} /> All Articles
          </button>
          <div className="flex items-center gap-2 mb-4">
            {article.tags.map(t => (
              <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-white/20 text-white">{t}</span>
            ))}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">{article.title}</h1>
          <div className="flex items-center gap-3 text-white/70 text-sm">
            <Clock size={13} />
            <span>{article.readTime} min read</span>
            <span>·</span>
            <span>{new Date(article.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <p className="text-lg text-[--color-fg-muted] leading-relaxed mb-10 border-l-2 border-[--color-primary] pl-5 italic">
          {article.excerpt}
        </p>
        <div className="prose-style space-y-6">
          {paragraphs.map((para, i) => {
            if (para.startsWith("## ")) {
              return (
                <ScrollReveal key={i} delay={i * 30}>
                  <h2 className="text-xl font-bold text-[--color-fg] mt-10 mb-2">{para.replace("## ", "")}</h2>
                </ScrollReveal>
              );
            }
            if (para.startsWith("```")) {
              const code = para.replace(/^```\w*\n?/, "").replace(/```$/, "");
              return (
                <ScrollReveal key={i} delay={i * 30}>
                  <pre className="bg-[--color-surface] border border-[--color-border] rounded-xl p-4 text-xs text-[--color-fg-muted] overflow-x-auto leading-relaxed font-mono">
                    {code}
                  </pre>
                </ScrollReveal>
              );
            }
            return (
              <ScrollReveal key={i} delay={i * 20}>
                <p className="text-[--color-fg-muted] leading-relaxed">{para}</p>
              </ScrollReveal>
            );
          })}
        </div>
        <div className="mt-12 pt-8 border-t border-[--color-border]">
          <button onClick={onBack} className="flex items-center gap-2 text-[--color-primary] hover:opacity-80 text-sm font-semibold transition-opacity">
            <ArrowLeft size={15} /> Back to all articles
          </button>
        </div>
      </div>
    </motion.div>
  );
}
