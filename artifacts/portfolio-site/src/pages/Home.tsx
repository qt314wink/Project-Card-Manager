import { Link } from "wouter";
import { ArrowRight, Sparkles, Layers, Palette } from "lucide-react";

const projects = [
  {
    id: "paint-swirl",
    title: "Paint Swirl Generator",
    description: "Interactive physics-based paint swirl art. Drag, drop, and watch colors collide.",
    href: "/paint-swirl",
    tags: ["Interactive", "Physics", "Canvas"],
    gradient: "from-purple-500 via-pink-500 to-rose-500",
    accent: "bg-purple-100 text-purple-700",
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
    accent: "bg-blue-100 text-blue-700",
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
    accent: "bg-amber-100 text-amber-700",
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
    accent: "bg-green-100 text-green-700",
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
    accent: "bg-slate-100 text-slate-700",
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
    accent: "bg-violet-100 text-violet-700",
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

function ProjectCard({ project }: { project: typeof projects[0] }) {
  const Pattern = patternComponents[project.svgPattern];
  return (
    <Link href={project.href}>
      <div className="group relative bg-card border border-card-border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30">
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
            <ArrowRight className="w-4 h-4 text-muted-foreground mt-0.5 transition-transform group-hover:translate-x-0.5 shrink-0" />
          </div>

          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            {project.description}
          </p>

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
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-20">
        <div className="mb-16 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Creative Studio</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
            Where code meets creativity
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A collection of interactive experiments, generative art, and creative tools built at the intersection of design and engineering.
          </p>

          <div className="flex items-center gap-3 mt-8">
            <Link href="/paint-swirl">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:opacity-90 transition-opacity">
                <Palette className="w-4 h-4" />
                Try Paint Swirl
              </button>
            </Link>
            <Link href="/projects">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-secondary text-secondary-foreground rounded-xl font-medium text-sm hover:bg-secondary/80 transition-colors border border-border">
                <Layers className="w-4 h-4" />
                View All Projects
              </button>
            </Link>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground">Featured Projects</h2>
          <p className="text-muted-foreground text-sm mt-1">Click any card to explore</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
