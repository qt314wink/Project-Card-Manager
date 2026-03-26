import { Link, useLocation } from "wouter";
import { Palette, Home, Layers } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/paint-swirl", label: "Paint Swirl", icon: Palette },
  { href: "/projects", label: "Projects", icon: Layers },
];

export default function Nav() {
  const [location] = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight hover:opacity-80 transition-opacity">
          <span className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <Palette className="w-4 h-4 text-primary-foreground" />
          </span>
          <span>Studio</span>
        </Link>

        <div className="flex items-center gap-1">
          {navLinks.map(({ href, label }) => {
            const isActive = href === "/" ? location === "/" : location.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
