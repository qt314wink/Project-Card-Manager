import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface ArtworkRecord {
  id: string;
  dataUrl: string;
  creator: string;
  palette: string;
  mode: string;
  timestamp: number;
  title: string;
}

const LS_KEY_USER = "studio_creator";
const LS_KEY_ART  = "studio_artworks";

function loadArt(): ArtworkRecord[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY_ART) || "[]"); } catch { return []; }
}
function saveArt(art: ArtworkRecord[]) {
  const trimmed = art.slice(0, 20);
  try { localStorage.setItem(LS_KEY_ART, JSON.stringify(trimmed)); } catch {}
}

interface CreatorContextValue {
  username: string;
  setUsername: (name: string) => void;
  artworks: ArtworkRecord[];
  submitArtwork: (dataUrl: string, palette: string, mode: string, title?: string) => ArtworkRecord;
  deleteArtwork: (id: string) => void;
  shareItem: (url: string, title: string, text?: string) => Promise<void>;
}

const CreatorContext = createContext<CreatorContextValue | null>(null);

export function CreatorProvider({ children }: { children: ReactNode }) {
  const [username, setUsernameState] = useState(
    () => localStorage.getItem(LS_KEY_USER) || ""
  );
  const [artworks, setArtworks] = useState<ArtworkRecord[]>(loadArt);

  const setUsername = useCallback((name: string) => {
    setUsernameState(name);
    localStorage.setItem(LS_KEY_USER, name);
  }, []);

  const submitArtwork = useCallback((
    dataUrl: string, palette: string, mode: string, title?: string,
  ): ArtworkRecord => {
    const record: ArtworkRecord = {
      id: Date.now().toString(),
      dataUrl,
      creator: username || "Anonymous",
      palette,
      mode,
      timestamp: Date.now(),
      title: title || `${mode} — ${new Date().toLocaleDateString()}`,
    };
    const updated = [record, ...artworks];
    setArtworks(updated);
    saveArt(updated);
    return record;
  }, [username, artworks]);

  const deleteArtwork = useCallback((id: string) => {
    const updated = artworks.filter(a => a.id !== id);
    setArtworks(updated);
    saveArt(updated);
  }, [artworks]);

  const shareItem = useCallback(async (url: string, title: string, text?: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: text || title, url });
        return;
      } catch {}
    }
    await navigator.clipboard.writeText(url);
  }, []);

  return (
    <CreatorContext.Provider value={{
      username, setUsername, artworks, submitArtwork, deleteArtwork, shareItem,
    }}>
      {children}
    </CreatorContext.Provider>
  );
}

export function useCreator() {
  const ctx = useContext(CreatorContext);
  if (!ctx) throw new Error("useCreator must be used within CreatorProvider");
  return ctx;
}
