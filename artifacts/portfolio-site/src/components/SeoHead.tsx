import { useEffect } from "react";

interface SeoProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  keywords?: string;
}

const SITE = "Halcyon Minx Studio";
const BASE_URL = "https://halcyonminx.replit.app";
const DEFAULT_IMAGE = `${BASE_URL}/og-default.jpg`;

export function SeoHead({ title, description, path = "/", image, keywords }: SeoProps) {
  const fullTitle = `${title} | ${SITE}`;
  const url = `${BASE_URL}${path}`;
  const og = image || DEFAULT_IMAGE;

  useEffect(() => {
    document.title = fullTitle;
    const setMeta = (name: string, content: string, attr = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    setMeta("description", description);
    if (keywords) setMeta("keywords", keywords);
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", description, "property");
    setMeta("og:url", url, "property");
    setMeta("og:image", og, "property");
    setMeta("og:type", "website", "property");
    setMeta("og:site_name", SITE, "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image", og);
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [fullTitle, description, url, og, keywords]);

  return null;
}
