import { useParams, Link } from "wouter";
import { ArrowLeft, ExternalLink, Tag, Calendar, Layers } from "lucide-react";
import { motion } from "framer-motion";

const PROJECT_DATA: Record<string, {
  title: string;
  tagline: string;
  description: string;
  year: number;
  tags: string[];
  gradient: string;
  emoji: string;
  href?: string;
  sections: { heading: string; body: string }[];
  stats: { label: string; value: string }[];
}> = {
  "paint-swirl": {
    title: "Paint Swirl Generator",
    tagline: "Physics-based generative art in your browser",
    description: "An interactive canvas simulation where particle systems respond to user-placed gravity+curl attractors, creating organic swirling and marbling patterns in real time.",
    year: 2026,
    tags: ["Canvas 2D", "Physics", "Particles", "Interactive"],
    gradient: "from-purple-600 via-pink-500 to-rose-500",
    emoji: "🌀",
    href: "/paint-swirl",
    sections: [
      {
        heading: "How it works",
        body: "Each attractor exerts two forces on nearby particles: a gravity component pulling particles toward it, and a perpendicular curl component that rotates the direction of pull. The combination creates the characteristic spiral path. Particles have finite lifetimes and fade using alpha blending, while the canvas background is repainted each frame with a low-opacity fill to create the trailing effect.",
      },
      {
        heading: "Three draw modes",
        body: "Swirl mode uses equal gravity and curl forces for tight spirals. Ink Drop mode inverts the gravity component so particles burst outward, simulating ink dispersing in water — particle lifetime is shorter and size is larger. Marbling mode reduces the curl strength and adds sinusoidal noise to the velocity field, producing the silky ribbon patterns seen in paper marbling.",
      },
      {
        heading: "Technical choices",
        body: "HTML Canvas 2D was chosen over WebGL for simplicity — the scene requires no z-depth, no shaders, and stays well under Canvas's practical limit of ~50k simultaneous particles. Toroidal edge wrapping prevents particles from draining off-screen. Each frame processes thousands of particles in a single tight JS loop, which runs at 60fps on mid-range hardware.",
      },
    ],
    stats: [
      { label: "Render", value: "Canvas 2D" },
      { label: "Particles", value: "Up to 2,000" },
      { label: "Draw modes", value: "3" },
      { label: "Palettes", value: "6" },
    ],
  },
  "particle-gravity": {
    title: "Particle Gravity Field",
    tagline: "Draw attractors, watch chaos emerge",
    description: "Place gravitational attractors anywhere on screen and watch thousands of particles respond in real time. Inspired by n-body simulations.",
    year: 2025,
    tags: ["Physics", "Particles", "Simulation", "Canvas"],
    gradient: "from-blue-600 via-indigo-500 to-violet-500",
    emoji: "⚛️",
    sections: [
      { heading: "N-body simulation", body: "Each particle is affected by every attractor simultaneously, with force inversely proportional to the square of the distance. This creates rich emergent behavior." },
      { heading: "Performance", body: "Using typed Float32Arrays for particle state and batching draw calls into a single ImageData write keeps the simulation running at 60fps even with 10,000+ particles." },
    ],
    stats: [{ label: "Particles", value: "10,000+" }, { label: "Algorithm", value: "N-body" }, { label: "Renderer", value: "ImageData" }, { label: "FPS target", value: "60" }],
  },
};

export default function ProjectDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const project = PROJECT_DATA[slug];

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-14">
        <div className="text-center">
          <p className="text-6xl mb-4">🔍</p>
          <h1 className="text-2xl font-bold mb-2">Project not found</h1>
          <p className="text-muted-foreground mb-6">We don't have a detail page for this one yet.</p>
          <Link href="/projects">
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium mx-auto">
              <ArrowLeft className="w-4 h-4" /> Back to projects
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-14">
      <div className={`h-72 bg-gradient-to-br ${project.gradient} relative overflow-hidden flex items-end`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <span className="text-[200px] leading-none">{project.emoji}</span>
        </div>
        <div className="relative max-w-5xl mx-auto w-full px-6 pb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Link href="/projects">
              <button className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-5 transition-colors">
                <ArrowLeft className="w-4 h-4" /> All Projects
              </button>
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{project.title}</h1>
            <p className="text-white/70 text-lg">{project.tagline}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <p className="text-muted-foreground leading-relaxed text-base">{project.description}</p>
            </motion.div>

            {project.sections.map((section, i) => (
              <motion.div
                key={section.heading}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.07 }}
              >
                <h2 className="text-lg font-semibold text-foreground mb-3">{section.heading}</h2>
                <p className="text-muted-foreground leading-relaxed">{section.body}</p>
              </motion.div>
            ))}

            {project.href && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <Link href={project.href}>
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:opacity-90 transition-opacity">
                    <ExternalLink className="w-4 h-4" />
                    Open {project.title}
                  </button>
                </Link>
              </motion.div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-5"
          >
            <div className="bg-card border border-card-border rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" /> Stats
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {project.stats.map(stat => (
                  <div key={stat.label} className="bg-muted rounded-xl p-3">
                    <div className="text-lg font-bold text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-card-border rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary" /> Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span key={tag} className="text-xs px-2.5 py-1 bg-primary/10 text-primary rounded-full font-medium">{tag}</span>
                ))}
              </div>
            </div>

            <div className="bg-card border border-card-border rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" /> Year
              </h3>
              <p className="text-2xl font-bold text-foreground">{project.year}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
