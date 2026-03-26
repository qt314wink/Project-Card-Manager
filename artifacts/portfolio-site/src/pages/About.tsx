import { motion } from "framer-motion";
import { ExternalLink, Mail, Instagram, Facebook, Linkedin, Sparkles, MessageCircle } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SeoHead } from "@/components/SeoHead";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show:  { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function About() {
  return (
    <div className="min-h-screen bg-[--color-bg] pb-28">
      <SeoHead
        title="About"
        description="Meet Jennipher Troup — the designer and creative technologist behind Halcyon Minx Studio. Generative art, interactive tools, and custom digital experiences."
        path="/about"
        keywords="Jennipher Troup, creative developer, generative art, interactive design, halcyonminx"
      />

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-900/40 via-fuchsia-900/30 to-[--color-bg] border-b border-[--color-border]">
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full opacity-20 blur-3xl"
              style={{
                width: 200 + i * 80,
                height: 200 + i * 80,
                left: `${(i * 17) % 90}%`,
                top: `${(i * 23) % 70}%`,
                background: i % 2 === 0
                  ? "radial-gradient(circle, #7c3aed, transparent)"
                  : "radial-gradient(circle, #d946ef, transparent)",
              }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
              transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.6 }}
            />
          ))}
        </div>
        <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-16">
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.div variants={item} className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-[--color-accent]" />
              <span className="text-sm font-medium text-[--color-accent] uppercase tracking-widest">The Studio</span>
            </motion.div>
            <motion.h1 variants={item} className="text-5xl sm:text-6xl font-black text-[--color-fg] mb-3 leading-tight">
              Jennipher<br />
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Troup</span>
            </motion.h1>
            <motion.p variants={item} className="text-lg text-[--color-fg-muted] max-w-xl leading-relaxed">
              Creative technologist, generative artist, and interactive designer — building digital experiences at the intersection of code, sound, and visual art.
            </motion.p>
            <motion.div variants={item} className="flex flex-wrap gap-3 mt-8">
              <a
                href="https://instagram.com/halcyonminx"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-fuchsia-500/30 transition-all duration-200 hover:-translate-y-0.5"
              >
                <Instagram size={15} /> @halcyonminx
              </a>
              <a
                href="https://facebook.com/halcyonminx"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1877F2] text-white text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 hover:-translate-y-0.5"
              >
                <Facebook size={15} /> Facebook
              </a>
              <a
                href="https://linkedin.com/in/jennipher-troup"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0A66C2] text-white text-sm font-semibold hover:shadow-lg hover:shadow-sky-500/30 transition-all duration-200 hover:-translate-y-0.5"
              >
                <Linkedin size={15} /> LinkedIn
              </a>
              <a
                href="mailto:girlwithstarryeyes@outlook.com"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[--color-border] text-[--color-fg] text-sm font-semibold hover:border-[--color-primary] hover:text-[--color-primary] transition-all duration-200 hover:-translate-y-0.5"
              >
                <Mail size={15} /> Email Me
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-20">

        {/* Studio story */}
        <ScrollReveal>
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-2xl font-bold text-[--color-fg] mb-4">The Studio</h2>
              <p className="text-[--color-fg-muted] leading-relaxed mb-4">
                Halcyon Minx Studio is a creative lab for generative art, interactive tools, and digital experiments. Every piece is built from scratch — no templates, no shortcuts — just code, math, and a deep love for the unexpected.
              </p>
              <p className="text-[--color-fg-muted] leading-relaxed">
                The name "Halcyon Minx" is a nod to calm wonder and playful mischief — the feeling of watching something beautiful and chaotic unfold in real time.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { label: "Specialty", value: "Generative art & interactive tools" },
                { label: "Stack",     value: "React, Web Audio API, Canvas 2D, Framer Motion" },
                { label: "Style",     value: "Dark, vibrant, physics-driven" },
                { label: "Based in",  value: "United States" },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-3">
                  <span className="text-xs font-semibold text-[--color-primary] uppercase tracking-widest w-20 shrink-0 pt-0.5">{label}</span>
                  <span className="text-sm text-[--color-fg-muted]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* What I do */}
        <ScrollReveal delay={100}>
          <h2 className="text-2xl font-bold text-[--color-fg] mb-8">What I Build</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              {
                icon: "🌀",
                title: "Generative Art",
                desc: "Physics simulations, particle systems, and noise-driven visuals that behave like living things.",
              },
              {
                icon: "🎵",
                title: "Sonic Experiments",
                desc: "Web Audio API synthesizers, generative music systems, and interactive sound installations.",
              },
              {
                icon: "⚡",
                title: "Interactive Tools",
                desc: "Creative apps with real-time feedback — painterly, musical, surprising, and shareable.",
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="p-6 rounded-2xl bg-[--color-surface] border border-[--color-border] hover:border-[--color-primary]/40 transition-colors">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-semibold text-[--color-fg] mb-2">{title}</h3>
                <p className="text-sm text-[--color-fg-muted] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Custom services CTA */}
        <ScrollReveal delay={150}>
          <div className="rounded-3xl bg-gradient-to-br from-violet-900/50 via-fuchsia-900/30 to-transparent border border-violet-500/20 p-10 text-center">
            <div className="text-4xl mb-4">✦</div>
            <h2 className="text-2xl font-bold text-[--color-fg] mb-3">Need Something Custom?</h2>
            <p className="text-[--color-fg-muted] mb-8 max-w-md mx-auto leading-relaxed">
              I design and build custom interactive websites, React components, and embeddable creative modules for brands, artists, and developers who want to stand out.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="mailto:girlwithstarryeyes@outlook.com?subject=Custom Interactive Website Inquiry"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold hover:shadow-xl hover:shadow-fuchsia-500/30 transition-all duration-200 hover:-translate-y-0.5"
              >
                <MessageCircle size={16} /> Inquire About Services
              </a>
              <a
                href="mailto:girlwithstarryeyes@outlook.com"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-[--color-border] text-[--color-fg] font-semibold hover:border-[--color-primary] transition-all duration-200 hover:-translate-y-0.5"
              >
                <Mail size={16} /> girlwithstarryeyes@outlook.com
              </a>
            </div>
            <p className="text-xs text-[--color-fg-muted] mt-6 opacity-60">
              Custom interactive website · Component library · Creative module · Brand experience
            </p>
          </div>
        </ScrollReveal>

        {/* Newsletter */}
        <ScrollReveal delay={100}>
          <div className="rounded-2xl bg-[--color-surface] border border-[--color-border] p-8">
            <h2 className="text-xl font-bold text-[--color-fg] mb-2">Stay in the Loop</h2>
            <p className="text-sm text-[--color-fg-muted] mb-5">New experiments, tools, and articles — delivered occasionally, never spammy.</p>
            <NewsletterForm />
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "done" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}api/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      const subs = JSON.parse(localStorage.getItem("studio_subscribers") || "[]");
      subs.push({ email, ts: Date.now() });
      localStorage.setItem("studio_subscribers", JSON.stringify(subs));
      setStatus("done");
    }
    if (status !== "done") setEmail("");
  };

  if (status === "done") {
    return <p className="text-sm text-green-400 font-medium">✓ You're subscribed! Thanks for joining.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
      <input
        type="email" value={email} onChange={e => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 min-w-[200px] text-sm px-4 py-2.5 rounded-xl bg-[--color-bg] border border-[--color-border] text-[--color-fg] placeholder:text-[--color-fg-muted] focus:outline-none focus:border-[--color-primary]"
        required
      />
      <button
        type="submit"
        className="px-5 py-2.5 rounded-xl bg-[--color-primary] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
      >
        Subscribe
      </button>
    </form>
  );
}

import { useState } from "react";
