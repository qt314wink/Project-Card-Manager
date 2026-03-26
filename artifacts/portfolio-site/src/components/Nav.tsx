import { Link, useLocation } from "wouter";
import { Palette, Home, Layers, Moon, Sun, Menu, X, BookOpen, User, Music2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useMusic } from "@/contexts/MusicContext";

const navLinks = [
  { href: "/",           label: "Home",        icon: Home    },
  { href: "/paint-swirl",label: "Paint Swirl", icon: Palette },
  { href: "/projects",   label: "Projects",    icon: Layers  },
  { href: "/blog",       label: "Blog",        icon: BookOpen},
  { href: "/about",      label: "About",       icon: User    },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-8 h-8" />;
  const isDark = theme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

function MusicToggle() {
  const { isPlaying, play, pause } = useMusic();
  return (
    <button
      onClick={() => isPlaying ? pause() : play()}
      title={isPlaying ? "Pause music" : "Play music"}
      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${isPlaying ? "text-[--color-primary] bg-[--color-primary]/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
      aria-label="Toggle music"
    >
      <Music2 className={`w-4 h-4 ${isPlaying ? "animate-pulse" : ""}`} />
    </button>
  );
}

export default function Nav() {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [location]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight hover:opacity-80 transition-opacity shrink-0">
          <span className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <Palette className="w-4 h-4 text-primary-foreground" />
          </span>
          <span>Studio</span>
        </Link>

        <div className="hidden md:flex items-center gap-0.5">
          {navLinks.map(({ href, label }) => {
            const isActive = href === "/" ? location === "/" : location.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <div className="ml-2 pl-2 border-l border-border flex items-center gap-1">
            <MusicToggle />
            <ThemeToggle />
          </div>
        </div>

        <div className="flex md:hidden items-center gap-1">
          <MusicToggle />
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-3 flex flex-col gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = href === "/" ? location === "/" : location.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
