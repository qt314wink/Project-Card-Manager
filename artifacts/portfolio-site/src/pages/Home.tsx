import { Link } from "wouter";
import { ArrowRight, Sparkles, Layers, Palette, Music, BookOpen, User } from "lucide-react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";
import { SeoHead } from "@/components/SeoHead";
import { ScrollReveal } from "@/components/ScrollReveal";

const projects = [
  {
    id: "paint-swirl",
    title: "Paint Swirl Generator",
    description: "Interactive physics-based paint swirl art. Drop attractors and watch color systems collide in real time.",
    href: "/paint-swirl",
    tags: ["Interactive", "Physics", "Canvas"],
    gradient: "from-purple-500 via-pink-500 to-rose-500",
    accent: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    emoji: "🌀",
    animType: "swirl",
    cta: "Open Playground →",
  },
  {
    id: "projects",
    title: "Project Gallery",
    description: "A curated collection of creative and technical work, organized by theme and medium.",
    href: "/projects",
    tags: ["Gallery", "Portfolio", "Design"],
    gradient: "from-blue-500 via-cyan-500 to-teal-500",
    accent: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    emoji: "🎨",
    animType: "grid",
    cta: "Browse Work →",
  },
  {
    id: "experiments",
    title: "Creative Experiments",
    description: "Generative art, interactive demos, and visual explorations at the boundary of code and design.",
    href: "/projects?filter=experiments",
    tags: ["Generative", "Art", "Code"],
    gradient: "from-amber-500 via-orange-500 to-red-500",
    accent: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    emoji: "✨",
    animType: "particles",
    cta: "Explore Experiments →",
  },
  {
    id: "motion",
    title: "Motion & Animation",
    description: "Fluid, physics-driven animations. Springs, collisions, and organic movement at every scale.",
    href: "/projects?filter=motion",
    tags: ["Animation", "Motion", "Physics"],
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    accent: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    emoji: "🎬",
    animType: "waves",
    cta: "See Animations →",
  },
  {
    id: "blog",
    title: "From the Lab",
    description: "Articles on creative coding, fractals, Web Audio synthesis, and the math behind generative art.",
    href: "/blog",
    tags: ["Writing", "Tutorials", "Math"],
    gradient: "from-fuchsia-500 via-violet-500 to-purple-600",
    accent: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300",
    emoji: "📖",
    animType: "text",
    cta: "Read Articles →",
  },
  {
    id: "about",
    title: "Meet the Studio",
    description: "Jennipher Troup — creative technologist, generative artist, and interactive designer.",
    href: "/about",
    tags: ["About", "Services", "Contact"],
    gradient: "from-rose-500 via-pink-500 to-fuchsia-500",
    accent: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    emoji: "✦",
    animType: "orbit",
    cta: "Learn More →",
  },
];

function AnimatedCardBg({ type }: { type: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: false });
    if (!ctx) return;
    let running = true;
    let frame = 0;
    const W = canvas.width;
    const H = canvas.height;

    if (type === "swirl") {
      const particles: { x: number; y: number; angle: number; speed: number; color: string; r: number }[] = [];
      const colors = ["#a855f7", "#ec4899", "#f97316", "#06b6d4"];
      const cx = W / 2, cy = H / 2;
      for (let i = 0; i < 80; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 20 + Math.random() * 50;
        particles.push({ x: cx + Math.cos(angle) * dist, y: cy + Math.sin(angle) * dist, angle: angle + Math.PI / 2, speed: 0.4 + Math.random() * 0.4, color: colors[i % colors.length], r: 1.5 + Math.random() * 2 });
      }
      const draw = () => {
        if (!running) return;
        ctx.fillStyle = "rgba(0,0,0,0.08)";
        ctx.fillRect(0, 0, W, H);
        particles.forEach(p => {
          const dx = cx - p.x, dy = cy - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          p.angle += 0.06 * (50 / (dist + 1));
          p.x += Math.cos(p.angle) * p.speed;
          p.y += Math.sin(p.angle) * p.speed;
          if (dist < 3 || dist > 90) { const a = Math.random() * Math.PI * 2; const d = 30 + Math.random() * 40; p.x = cx + Math.cos(a) * d; p.y = cy + Math.sin(a) * d; }
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = p.color + "cc"; ctx.fill();
        });
        requestAnimationFrame(draw);
      };
      draw();
    }

    else if (type === "grid") {
      const cells: { x: number; y: number; phase: number; color: string }[] = [];
      const colors = ["#3b82f6", "#06b6d4", "#22d3ee", "#0ea5e9"];
      for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) {
        cells.push({ x: 14 + c * 28, y: 14 + r * 28, phase: Math.random() * Math.PI * 2, color: colors[(r + c) % colors.length] });
      }
      const draw = () => {
        if (!running) return;
        frame++;
        ctx.clearRect(0, 0, W, H);
        cells.forEach(cell => {
          const scale = 0.7 + 0.3 * Math.sin(frame * 0.04 + cell.phase);
          const s = 18 * scale;
          ctx.fillStyle = cell.color + "55";
          ctx.strokeStyle = cell.color + "99";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(cell.x - s / 2, cell.y - s / 2, s, s, 4);
          ctx.fill(); ctx.stroke();
        });
        requestAnimationFrame(draw);
      };
      draw();
    }

    else if (type === "particles") {
      const pts: { x: number; y: number; vx: number; vy: number; r: number; color: string; life: number }[] = [];
      const colors = ["#f59e0b", "#f97316", "#ef4444", "#fbbf24"];
      const spawn = () => {
        const angle = Math.random() * Math.PI * 2;
        pts.push({ x: W / 2, y: H / 2, vx: Math.cos(angle) * (1 + Math.random() * 2), vy: Math.sin(angle) * (1 + Math.random() * 2), r: 2 + Math.random() * 3, color: colors[Math.floor(Math.random() * colors.length)], life: 1 });
      };
      const draw = () => {
        if (!running) return;
        frame++;
        ctx.fillStyle = "rgba(0,0,0,0.12)";
        ctx.fillRect(0, 0, W, H);
        if (frame % 3 === 0) spawn();
        for (let i = pts.length - 1; i >= 0; i--) {
          const p = pts[i];
          p.x += p.vx; p.y += p.vy; p.vy += 0.04; p.life -= 0.015;
          if (p.life <= 0) { pts.splice(i, 1); continue; }
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
          ctx.fillStyle = p.color + Math.floor(p.life * 200).toString(16).padStart(2, "0");
          ctx.fill();
        }
        requestAnimationFrame(draw);
      };
      draw();
    }

    else if (type === "waves") {
      const draw = () => {
        if (!running) return;
        frame++;
        ctx.clearRect(0, 0, W, H);
        const colors = ["#22c55e", "#16a34a", "#4ade80", "#86efac", "#15803d"];
        for (let w = 0; w < 5; w++) {
          ctx.beginPath();
          ctx.strokeStyle = colors[w] + "88";
          ctx.lineWidth = 2;
          for (let x = 0; x <= W; x += 2) {
            const y = H / 2 + Math.sin((x / W) * Math.PI * 3 + frame * 0.05 + w * 0.6) * (15 - w * 2) + w * 12;
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        requestAnimationFrame(draw);
      };
      draw();
    }

    else if (type === "text") {
      const letters = "ABCΔEFG∞HI√JKLMN∑OP".split("");
      const positions: { x: number; y: number; letter: string; phase: number; color: string }[] = [];
      const colors = ["#c084fc", "#a855f7", "#7c3aed", "#e879f9", "#d946ef"];
      for (let i = 0; i < 16; i++) {
        positions.push({ x: 10 + Math.random() * (W - 20), y: 15 + Math.random() * (H - 20), letter: letters[i % letters.length], phase: Math.random() * Math.PI * 2, color: colors[i % colors.length] });
      }
      const draw = () => {
        if (!running) return;
        frame++;
        ctx.clearRect(0, 0, W, H);
        positions.forEach(p => {
          const alpha = 0.3 + 0.5 * Math.abs(Math.sin(frame * 0.03 + p.phase));
          ctx.fillStyle = p.color + Math.floor(alpha * 255).toString(16).padStart(2, "0");
          ctx.font = `bold ${16 + 8 * Math.abs(Math.sin(frame * 0.02 + p.phase))}px monospace`;
          ctx.fillText(p.letter, p.x, p.y);
        });
        requestAnimationFrame(draw);
      };
      draw();
    }

    else if (type === "orbit") {
      const orbs: { angle: number; speed: number; dist: number; color: string; r: number }[] = [];
      const colors = ["#f43f5e", "#ec4899", "#d946ef", "#a855f7", "#8b5cf6"];
      for (let i = 0; i < 5; i++) {
        orbs.push({ angle: (i / 5) * Math.PI * 2, speed: 0.02 + i * 0.005, dist: 20 + i * 12, color: colors[i], r: 4 - i * 0.4 });
      }
      const cx = W / 2, cy = H / 2;
      const draw = () => {
        if (!running) return;
        ctx.fillStyle = "rgba(0,0,0,0.15)";
        ctx.fillRect(0, 0, W, H);
        ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#f43f5e88"; ctx.fill();
        orbs.forEach(orb => {
          orb.angle += orb.speed;
          const x = cx + Math.cos(orb.angle) * orb.dist;
          const y = cy + Math.sin(orb.angle) * orb.dist;
          ctx.beginPath(); ctx.arc(x, y, orb.r, 0, Math.PI * 2);
          ctx.fillStyle = orb.color + "cc"; ctx.fill();
        });
        requestAnimationFrame(draw);
      };
      draw();
    }

    return () => { running = false; };
  }, [type]);

  return <canvas ref={canvasRef} width={200} height={176} className="absolute inset-0 w-full h-full" />;
}

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 200, damping: 25 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 200, damping: 25 });
  const scale = useSpring(1, { stiffness: 300, damping: 30 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rotateX.set(((e.clientY - cy) / (rect.height / 2)) * -8);
    rotateY.set(((e.clientX - cx) / (rect.width / 2)) * 8);
  }, [rotateX, rotateY]);

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0); rotateY.set(0); scale.set(1);
  }, [rotateX, rotateY, scale]);

  const handleMouseEnter = useCallback(() => { scale.set(1.02); }, [scale]);

  return (
    <motion.div
      custom={index}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: index * 0.07, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } }}
      style={{ perspective: 600, transformStyle: "preserve-3d" }}
    >
      <motion.div
        ref={cardRef}
        style={{ rotateX, rotateY, scale }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        className="will-change-transform"
      >
        <Link href={project.href}>
          <div className="group relative bg-card border border-card-border rounded-2xl overflow-hidden cursor-pointer transition-shadow duration-300 hover:shadow-2xl hover:shadow-black/20 hover:border-primary/30">
            <div className={`relative h-44 bg-gradient-to-br ${project.gradient} overflow-hidden`}>
              <AnimatedCardBg type={project.animType} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="text-4xl drop-shadow-lg">{project.emoji}</span>
              </div>
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                <span className="text-xs px-2.5 py-1 rounded-full bg-black/40 text-white/90 backdrop-blur-sm font-medium">
                  {project.cta}
                </span>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <ArrowRight className="w-4 h-4 text-muted-foreground mt-0.5 transition-transform group-hover:translate-x-1 shrink-0" />
              </div>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{project.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map(tag => (
                  <span key={tag} className={`text-xs px-2 py-0.5 rounded-full font-medium ${project.accent}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}

function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: false });
    if (!ctx) return;
    const orbs: { x: number; y: number; vx: number; vy: number; r: number; color: string; phase: number }[] = [];
    const colors = ["#a855f7", "#ec4899", "#06b6d4", "#22c55e", "#f97316", "#8b5cf6"];
    let running = true;
    let frame = 0;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 6; i++) {
      orbs.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, r: 80 + Math.random() * 120, color: colors[i], phase: Math.random() * Math.PI * 2 });
    }
    const animate = () => {
      if (!running) return;
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      orbs.forEach((orb, i) => {
        orb.x += orb.vx + Math.sin(frame * 0.008 + orb.phase) * 0.35;
        orb.y += orb.vy + Math.cos(frame * 0.007 + orb.phase + i) * 0.35;
        if (orb.x < -orb.r) orb.x = canvas.width + orb.r;
        if (orb.x > canvas.width + orb.r) orb.x = -orb.r;
        if (orb.y < -orb.r) orb.y = canvas.height + orb.r;
        if (orb.y > canvas.height + orb.r) orb.y = -orb.r;
        const g = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
        g.addColorStop(0, orb.color + "30");
        g.addColorStop(0.5, orb.color + "10");
        g.addColorStop(1, orb.color + "00");
        ctx.beginPath(); ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
      });
      requestAnimationFrame(animate);
    };
    animate();
    return () => { running = false; window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

function MagneticButton({ children, href, primary }: { children: React.ReactNode; href: string; primary?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 400, damping: 30 });
  const y = useSpring(0, { stiffness: 400, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 80) { x.set(dx * 0.3); y.set(dy * 0.3); }
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div ref={ref} style={{ x, y }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <Link href={href}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-md ${
            primary
              ? "bg-primary text-primary-foreground hover:opacity-90 hover:shadow-primary/30 hover:shadow-lg"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
          }`}
        >
          {children}
        </motion.button>
      </Link>
    </motion.div>
  );
}

function NewsletterWidget() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "done" | "err">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}api/newsletter`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "done" : "err");
    } catch {
      const subs = JSON.parse(localStorage.getItem("studio_subscribers") || "[]");
      subs.push({ email, ts: Date.now() });
      localStorage.setItem("studio_subscribers", JSON.stringify(subs));
      setStatus("done");
    }
  };

  return (
    <ScrollReveal>
      <div className="mt-20 pt-12 border-t border-border">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-1">Stay in the loop</h2>
            <p className="text-muted-foreground text-sm">New experiments, tools, and articles — delivered occasionally.</p>
          </div>
          <div>
            {status === "done" ? (
              <p className="text-sm text-green-400 font-medium">✓ You're in! Check your inbox soon.</p>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 text-sm px-4 py-2.5 rounded-xl bg-card border border-card-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  required
                />
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Subscribe
                </motion.button>
              </form>
            )}
          </div>
        </div>
        <div className="mt-10 flex items-center justify-between text-xs text-muted-foreground">
          <span>Built with React · Framer Motion · Canvas API · Web Audio</span>
          <div className="flex gap-4">
            <Link href="/blog" className="hover:text-foreground transition-colors flex items-center gap-1"><BookOpen size={11} /> Blog</Link>
            <Link href="/about" className="hover:text-foreground transition-colors flex items-center gap-1"><User size={11} /> About</Link>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative">
      <SeoHead
        title="Halcyon Minx Studio"
        description="Creative studio by Jennipher Troup — generative art, physics-based interactive tools, Web Audio synthesis, and creative coding experiments."
        path="/"
        keywords="generative art, creative coding, canvas physics, paint swirl, interactive art, halcyon minx, jennipher troup"
      />
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-8 relative z-10">
        {/* Hero */}
        <div className="relative mb-16 max-w-2xl">
          <div className="absolute -inset-40 -z-10 overflow-hidden rounded-3xl">
            <HeroCanvas />
          </div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Halcyon Minx Studio</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }} className="text-4xl sm:text-6xl font-black tracking-tight text-foreground mb-4 leading-tight">
            Where code<br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">meets creativity</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="text-lg text-muted-foreground leading-relaxed">
            Interactive experiments, generative art, and creative tools — built at the intersection of physics, sound, and design.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }} className="flex flex-wrap items-center gap-3 mt-8">
            <MagneticButton href="/paint-swirl" primary><Palette className="w-4 h-4" /> Open Paint Swirl</MagneticButton>
            <MagneticButton href="/blog"><BookOpen className="w-4 h-4" /> Read the Blog</MagneticButton>
            <MagneticButton href="/about"><Music className="w-4 h-4" /> About the Studio</MagneticButton>
          </motion.div>
        </div>

        {/* Cards */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="mb-8">
          <h2 className="text-xl font-semibold text-foreground">Explore the Studio</h2>
          <p className="text-muted-foreground text-sm mt-1">Each card is alive — hover to interact</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        <NewsletterWidget />
      </div>
    </div>
  );
}
