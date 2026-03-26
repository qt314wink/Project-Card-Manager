import { useState } from "react";
import { Link, useSearch } from "wouter";
import { ArrowRight, Filter, X } from "lucide-react";

const ALL_PROJECTS = [
  {
    id: 1,
    title: "Paint Swirl Generator",
    description: "Interactive physics-based paint swirl art generator with multiple color palettes and real-time particle simulation.",
    tags: ["Interactive", "Physics", "Canvas", "Generative"],
    category: "experiments",
    href: "/project/paint-swirl",
    emoji: "🌀",
    gradient: "from-purple-500 via-pink-500 to-rose-500",
    year: 2026,
  },
  {
    id: 2,
    title: "Particle Gravity Field",
    description: "Thousands of particles responding to gravitational fields you control. Draw attractors and watch chaos emerge.",
    tags: ["Physics", "Particles", "Simulation"],
    category: "experiments",
    href: "/project/particle-gravity",
    emoji: "⚛️",
    gradient: "from-blue-600 via-indigo-500 to-violet-500",
    year: 2025,
  },
  {
    id: 3,
    title: "Wave Interference Visualizer",
    description: "See wave interference patterns come alive. Adjust frequency, amplitude, and phase to create standing waves.",
    tags: ["Physics", "Motion", "Interactive"],
    category: "motion",
    href: "#",
    emoji: "〜",
    gradient: "from-cyan-500 via-teal-500 to-emerald-500",
    year: 2025,
  },
  {
    id: 4,
    title: "Liquid Color Morph",
    description: "Organic liquid simulations with real-time color morphing. Built on WebGL fragment shaders.",
    tags: ["WebGL", "Motion", "Generative"],
    category: "motion",
    href: "#",
    emoji: "💧",
    gradient: "from-amber-400 via-orange-500 to-red-500",
    year: 2025,
  },
  {
    id: 5,
    title: "Color Harmony Explorer",
    description: "Generate and explore color harmonies interactively. Export palettes to CSS, Figma, or SVG.",
    tags: ["Color", "Design", "Tools"],
    category: "type",
    href: "#",
    emoji: "🎨",
    gradient: "from-violet-500 via-purple-500 to-fuchsia-600",
    year: 2025,
  },
  {
    id: 6,
    title: "Typography Scale Generator",
    description: "Build fluid type scales with modular ratio math. Preview in real-time, export as CSS custom properties.",
    tags: ["Typography", "Tools", "CSS"],
    category: "type",
    href: "#",
    emoji: "🔤",
    gradient: "from-slate-500 via-gray-600 to-zinc-700",
    year: 2024,
  },
  {
    id: 7,
    title: "CSS Property Inspector",
    description: "Paste any element HTML and inspect all computed CSS values side by side across browser engines.",
    tags: ["Dev", "Tools", "CSS"],
    category: "tools",
    href: "#",
    emoji: "🔍",
    gradient: "from-green-500 via-emerald-500 to-teal-600",
    year: 2024,
  },
  {
    id: 8,
    title: "Spring Physics Playground",
    description: "Tune spring constants, damping, and mass. See animation curves update live as you adjust parameters.",
    tags: ["Animation", "Motion", "Physics"],
    category: "motion",
    href: "#",
    emoji: "🎢",
    gradient: "from-rose-500 via-pink-500 to-fuchsia-500",
    year: 2024,
  },
  {
    id: 9,
    title: "Icon Grid Builder",
    description: "Arrange, resize, and export icon grids. Supports Lucide, Heroicons, and custom SVGs.",
    tags: ["Design", "Tools", "Icons"],
    category: "tools",
    href: "#",
    emoji: "🧩",
    gradient: "from-sky-500 via-blue-500 to-indigo-500",
    year: 2024,
  },
];

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "experiments", label: "Experiments" },
  { id: "motion", label: "Motion" },
  { id: "type", label: "Type & Color" },
  { id: "tools", label: "Tools" },
];

function ProjectCard({ project }: { project: typeof ALL_PROJECTS[0] }) {
  return (
    <Link href={project.href}>
      <div className="group bg-card border border-card-border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/30">
        <div className={`h-32 bg-gradient-to-br ${project.gradient} flex items-center justify-center relative overflow-hidden`}>
          <span className="text-5xl">{project.emoji}</span>
          <div className="absolute inset-0 bg-black/10" />
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{project.title}</h3>
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5 transition-transform group-hover:translate-x-0.5" />
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">{project.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {project.tags.slice(0, 2).map(t => (
                <span key={t} className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">{t}</span>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">{project.year}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Projects() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const initialFilter = params.get("filter") || "all";
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = ALL_PROJECTS.filter(p => {
    const matchCat = activeFilter === "all" || p.category === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-20">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Projects</h1>
          <p className="text-muted-foreground">A full archive of creative and technical work.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === cat.id
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative flex-1 min-w-48 max-w-72">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-8 py-2 text-sm bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <span className="text-sm text-muted-foreground ml-auto">{filtered.length} project{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-muted-foreground">No projects match your search.</p>
            <button onClick={() => { setSearchQuery(""); setActiveFilter("all"); }} className="mt-4 text-primary text-sm hover:underline">Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(p => <ProjectCard key={p.id} project={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
