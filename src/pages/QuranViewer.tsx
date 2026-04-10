import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Play, Pause, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchPage, type Ayah } from "@/lib/quran-api";
import { getAyahAudioUrl, parseVerseKey } from "@/lib/audio-api";
import { TOTAL_PAGES } from "@/lib/quran-data";

export default function QuranViewer() {
  const [pageNum, setPageNum] = useState(1);
  const [verses, setVerses] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchPage(pageNum).then((data) => {
      setVerses(data);
      setLoading(false);
    });
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayingKey(null);
    }
  }, [pageNum]);

  const playAyah = (verseKey: string) => {
    const { surah, ayah } = parseVerseKey(verseKey);
    const url = getAyahAudioUrl(surah, ayah);

    if (playingKey === verseKey) {
      audioRef.current?.pause();
      setPlayingKey(null);
      return;
    }

    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(url);
    audioRef.current = audio;
    setPlayingKey(verseKey);
    audio.play();
    audio.onended = () => setPlayingKey(null);
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 max-w-md mx-auto relative">
      <div className="absolute top-10 right-0 w-[200px] h-[200px] rounded-full bg-[hsla(210,80%,50%,0.05)] blur-[80px] pointer-events-none" />

      <h1 className="text-xl font-bold text-gradient mb-1 animate-fade-in">Qur'an Reader</h1>
      <p className="text-sm text-muted-foreground mb-4 animate-fade-in">Focus mode reading</p>

      {/* Page Navigation */}
      <div className="flex items-center justify-between glass-card-glow rounded-2xl px-4 py-3 mb-4 animate-fade-in">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setPageNum(Math.max(1, pageNum - 1))}
          disabled={pageNum <= 1}
          className="hover:bg-secondary/50"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">
            Page {pageNum} / {TOTAL_PAGES}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setPageNum(Math.min(TOTAL_PAGES, pageNum + 1))}
          disabled={pageNum >= TOTAL_PAGES}
          className="hover:bg-secondary/50"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Verses */}
      <div className="glass-card rounded-2xl p-5 animate-fade-in" style={{ animationDelay: "100ms" }}>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : verses.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Could not load page data.</p>
        ) : (
          <div className="space-y-4">
            {verses.map((verse) => (
              <div key={verse.verse_key} className="group">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => playAyah(verse.verse_key)}
                    className="mt-1 w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0 hover:bg-primary/25 transition-colors border border-primary/20"
                  >
                    {playingKey === verse.verse_key ? (
                      <Pause className="w-3.5 h-3.5 text-primary" />
                    ) : (
                      <Play className="w-3.5 h-3.5 text-primary ml-0.5" />
                    )}
                  </button>
                  <div className="flex-1">
                    <p className="font-arabic text-xl leading-loose text-foreground text-right" dir="rtl">
                      {verse.text_uthmani}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {verse.verse_key}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick page jump */}
      <div className="mt-4 flex items-center gap-2 animate-fade-in" style={{ animationDelay: "200ms" }}>
        <input
          type="number"
          min={1}
          max={TOTAL_PAGES}
          value={pageNum}
          onChange={(e) => {
            const v = parseInt(e.target.value);
            if (v >= 1 && v <= TOTAL_PAGES) setPageNum(v);
          }}
          className="flex-1 h-10 rounded-xl border border-border/50 bg-secondary/30 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="Go to page..."
        />
        <Button
          onClick={() => {}}
          className="rounded-xl gradient-purple-blue text-primary-foreground glow-ring hover:opacity-90"
        >
          Go
        </Button>
      </div>
    </div>
  );
}
