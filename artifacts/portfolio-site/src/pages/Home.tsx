import { Link } from "wouter";
import { ArrowRight, Sparkles, Layers, Palette } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useEffect } from "react";

const projects = [
  {
    id: "paint-swirl",
    title: "Paint Swirl Generator",
    description: "Interactive physics-based paint swirl art. Drag, drop, and watch colors collide.",
    href: "/paint-swirl",
    tags: ["Interactive", "Physics", "Canvas"],
    gradient: "from-purple-500 via-pink-500 to-rose-500",
    accent: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    emoji: "🌀",
    svgPattern: "swirl",
  },
  {
    id: "projects",
    title: "Project Gallery",
    description: "A curated collection of creative and technical work, organized by theme.",
    href: "/projects",
    tags: ["Gallery", "Portfolio", "Design"],
    gradient: "from-blue-500 via-cyan-500 to-teal-500",
    accent: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    emoji: "🎨",
    svgPattern: "grid",
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
    svgPattern: "dots",
  },
  {
    id: "motion",
    title: "Motion & Animation",
    description: "Fluid, physics-driven animations. Springs, collisions, and organic movement.",
    href: "/projects?filter=motion",
    tags: ["Animation", "Motion", "Physics"],
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    accent: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    emoji: "🎬",
    svgPattern: "waves",
  },
  {
    id: "tools",
    title: "Developer Tools",
    description: "Utilities, helpers, and widgets built for day-to-day creative development.",
    href: "/projects?filter=tools",
    tags: ["Tools", "Dev", "Utilities"],
    gradient: "from-slate-500 via-gray-500 to-zinc-500",
    accent: "bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300",
    emoji: "🔧",
    svgPattern: "circuit",
  },
  {
    id: "type",
    title: "Typography & Color",
    description: "Explorations in type systems, color theory, and the intersection of both.",
    href: "/projects?filter=type",
    tags: ["Typography", "Color", "Design"],
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    accent: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
    emoji: "🔤",
    svgPattern: "text",
  },
];

function SwirlPattern() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
      <path d="M100,100 Q80,40 130,20 Q180,0 160,60 Q140,120 100,100" fill="none" stroke="white" strokeWidth="3"/>
      <path d="M100,100 Q60,120 40,70 Q20,20 80,40 Q140,60 100,100" fill="none" stroke="white" strokeWidth="2"/>
      <circle cx="100" cy="100" r="5" fill="white"/>
    </svg>
  );
}

function GridPattern() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
      {[0,1,2,3].map(r => [0,1,2,3].map(c => (
        <rect key={`${r}-${c}`} x={20 + c * 45} y={20 + r * 45} width="35" height="35" rx="6" fill="white"/>
      )))}
    </svg>
  );
}

function DotsPattern() {
  const dots = Array.from({length: 24}, (_, i) => ({
    cx: 20 + (i % 6) * 32,
    cy: 20 + Math.floor(i / 6) * 45,
    r: 4 + (i % 4) * 2,
  }));
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
      {dots.map((d, i) => <circle key={i} {...d} fill="white"/>)}
    </svg>
  );
}

function WavesPattern() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
      {[0,1,2,3,4].map(i => (
        <path key={i} d={`M0,${40 + i * 30} Q50,${25 + i * 30} 100,${40 + i * 30} Q150,${55 + i * 30} 200,${40 + i * 30}`} fill="none" stroke="white" strokeWidth="2"/>
      ))}
    </svg>
  );
}

function CircuitPattern() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
      <path d="M20,100 H80 V40 H140 M140,40 H160 M80,100 V160 H140 M140,160 H160" fill="none" stroke="white" strokeWidth="2"/>
      <circle cx="80" cy="100" r="5" fill="white"/>
      <circle cx="140" cy="40" r="5" fill="white"/>
      <circle cx="140" cy="160" r="5" fill="white"/>
      <rect x="155" y="35" width="10" height="10" fill="white" opacity="0.6"/>
      <rect x="155" y="155" width="10" height="10" fill="white" opacity="0.6"/>
    </svg>
  );
}

function TextPattern() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
      <text x="20" y="70" fontSize="60" fontWeight="bold" fill="white">Aa</text>
      <line x1="20" y1="100" x2="180" y2="100" stroke="white" strokeWidth="2"/>
      <text x="20" y="140" fontSize="24" fill="white">Typeface</text>
      <text x="20" y="170" fontSize="14" fill="white" opacity="0.7">& Color System</text>
    </svg>
  );
}

const patternComponents: Record<string, React.ComponentType> = {
  swirl: SwirlPattern,
  grid: GridPattern,
  dots: DotsPattern,
  waves: WavesPattern,
  circuit: CircuitPattern,
  text: TextPattern,
};

function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: false });
    if (!ctx) return;

    const orbs: { x: number; y: number; vx: number; vy: number; r: number; color: string; phase: number }[] = [];
    const colors = ["#a855f7", "#ec4899", "#06b6d4", "#22c55e", "#f97316", "#8b5cf6"];
    for (let i = 0; i < 6; i++) {
      orbs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: 80 + Math.random() * 100,
        color: colors[i],
        phase: Math.random() * Math.PI * 2,
      });
    }

    let frame = 0;
    let running = true;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      if (!running) return;
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      orbs.forEach((orb, i) => {
        orb.x += orb.vx + Math.sin(frame * 0.008 + orb.phase) * 0.3;
        orb.y += orb.vy + Math.cos(frame * 0.007 + orb.phase + i) * 0.3;
        if (orb.x < -orb.r) orb.x = canvas.width + orb.r;
        if (orb.x > canvas.width + orb.r) orb.x = -orb.r;
        if (orb.y < -orb.r) orb.y = canvas.height + orb.r;
        if (orb.y > canvas.height + orb.r) orb.y = -orb.r;

        const g = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
        g.addColorStop(0, orb.color + "28");
        g.addColorStop(0.5, orb.color + "10");
        g.addColorStop(1, orb.color + "00");
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      running = false;
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.07, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const Pattern = patternComponents[project.svgPattern];
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Link href={project.href}>
        <div className="group relative bg-card border border-card-border rounded-2xl overflow-hidden cursor-pointer transition-shadow duration-300 hover:shadow-xl hover:border-primary/30">
          <div className={`relative h-44 bg-gradient-to-br ${project.gradient} overflow-hidden`}>
            <div className="absolute inset-0">
              <Pattern />
            </div>
            <div className="absolute bottom-4 left-4">
              <span className="text-4xl">{project.emoji}</span>
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
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative">
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-20 relative z-10">
        <div className="relative mb-16 max-w-2xl">
          <div className="absolute -inset-40 -z-10 overflow-hidden rounded-3xl">
            <HeroCanvas />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 mb-4"
          >
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Creative Studio</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4"
          >
            Where code meets creativity
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            A collection of interactive experiments, generative art, and creative tools built at the intersection of design and engineering.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="flex items-center gap-3 mt-8"
          >
            <Link href="/paint-swirl">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:opacity-90 transition-opacity shadow-md"
              >
                <Palette className="w-4 h-4" />
                Try Paint Swirl
              </motion.button>
            </Link>
            <Link href="/projects">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-2.5 bg-secondary text-secondary-foreground rounded-xl font-medium text-sm hover:bg-secondary/80 transition-colors border border-border"
              >
                <Layers className="w-4 h-4" />
                View All Projects
              </motion.button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-foreground">Featured Projects</h2>
          <p className="text-muted-foreground text-sm mt-1">Click any card to explore</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-20 pt-12 border-t border-border flex items-center justify-between text-sm text-muted-foreground"
        >
          <span>Built with React · Framer Motion · Canvas API</span>
          <div className="flex gap-4">
            <span>9 projects</span>
            <span>3 pages</span>
            <span>∞ particles</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
