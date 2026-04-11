import { useState } from "react";
import { RefreshCw, Check, ChevronLeft, ChevronRight, Shield, AlertTriangle } from "lucide-react";
import { useHifzData } from "@/hooks/useHifzData";
import { Button } from "@/components/ui/button";
import AppreciationToast from "@/components/AppreciationToast";
import { getAppreciation } from "@/lib/feedback";
import { cn } from "@/lib/utils";

export default function MurajaaTracker() {
  const { data, completeTask, setPageStrength } = useHifzData();
  const [toast, setToast] = useState({ show: false, message: "" });
  const [sectionIndex, setSectionIndex] = useState(0);

  const PAGES_PER_SECTION = 5;
  const pages = data.memorizedPages.sort((a, b) => a.page - b.page);
  const totalSections = Math.max(1, Math.ceil(pages.length / PAGES_PER_SECTION));
  const sectionPages = pages.slice(
    sectionIndex * PAGES_PER_SECTION,
    (sectionIndex + 1) * PAGES_PER_SECTION
  );

  const handleComplete = async () => {
    await completeTask("muraja");
    setToast({ show: true, message: getAppreciation() });
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 max-w-md mx-auto relative">
      <div className="absolute top-20 left-0 w-[300px] h-[200px] rounded-full bg-[hsla(210,80%,55%,0.06)] blur-[80px] pointer-events-none" />

      <AppreciationToast
        message={toast.message}
        show={toast.show}
        onHide={() => setToast({ show: false, message: "" })}
      />

      <h1 className="text-xl font-bold text-gradient mb-1 animate-fade-in">Muraja'a</h1>
      <p className="text-sm text-muted-foreground mb-6 animate-fade-in">Revise and protect your memorization</p>

      {/* Juz Info */}
      <div className="glass-card-glow rounded-2xl p-5 mb-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl gradient-blue-cyan flex items-center justify-center shadow-lg">
            <RefreshCw className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Juz {data.currentMurajaJuz}</p>
            <p className="text-xs text-muted-foreground">Current revision target</p>
          </div>
        </div>

        <Button
          onClick={handleComplete}
          disabled={data.completedToday.muraja}
          className="w-full rounded-xl h-12 gradient-blue-cyan text-primary-foreground font-semibold glow-ring hover:opacity-90 transition-opacity"
        >
          {data.completedToday.muraja ? (
            <span className="flex items-center gap-2"><Check className="w-4 h-4" /> Completed</span>
          ) : (
            "Mark Review Complete"
          )}
        </Button>
      </div>

      {/* Section Navigator */}
      {pages.length > 0 ? (
        <div className="glass-card rounded-2xl p-5 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Review Pages</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSectionIndex(Math.max(0, sectionIndex - 1))}
                disabled={sectionIndex === 0}
                className="w-8 h-8 rounded-full border border-border/50 flex items-center justify-center hover:bg-secondary/50 transition-colors disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-muted-foreground font-medium">
                {sectionIndex + 1} / {totalSections}
              </span>
              <button
                onClick={() => setSectionIndex(Math.min(totalSections - 1, sectionIndex + 1))}
                disabled={sectionIndex >= totalSections - 1}
                className="w-8 h-8 rounded-full border border-border/50 flex items-center justify-center hover:bg-secondary/50 transition-colors disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {sectionPages.map((mp) => (
              <div key={mp.page} className="flex items-center justify-between bg-secondary/40 rounded-xl px-4 py-3">
                <div>
                  <span className="text-sm font-medium text-foreground">Page {mp.page}</span>
                  <span className={cn(
                    "text-xs ml-2 px-2 py-0.5 rounded-full",
                    mp.strength === "strong" && "bg-[hsla(160,55%,42%,0.15)] text-[hsl(160,55%,35%)]",
                    mp.strength === "weak" && "bg-[hsla(35,85%,55%,0.15)] text-[hsl(35,85%,40%)]",
                    mp.strength === "new" && "bg-primary/10 text-primary"
                  )}>
                    {mp.strength}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPageStrength(mp.page, "strong")}
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                      mp.strength === "strong"
                        ? "bg-[hsla(160,55%,42%,0.2)] text-[hsl(160,55%,35%)]"
                        : "hover:bg-secondary text-muted-foreground"
                    )}
                    title="Mark as strong"
                  >
                    <Shield className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPageStrength(mp.page, "weak")}
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                      mp.strength === "weak"
                        ? "bg-[hsla(35,85%,55%,0.2)] text-[hsl(35,85%,40%)]"
                        : "hover:bg-secondary text-muted-foreground"
                    )}
                    title="Mark as weak"
                  >
                    <AlertTriangle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Weak pages summary */}
          {data.weakPages.length > 0 && (
            <div className="mt-4 bg-[hsla(35,85%,55%,0.08)] rounded-xl p-3 border border-[hsla(35,85%,55%,0.15)]">
              <p className="text-xs font-medium text-foreground mb-1">⚠️ Weak Pages ({data.weakPages.length})</p>
              <div className="flex flex-wrap gap-1.5">
                {data.weakPages.map((p) => (
                  <span key={p} className="text-xs bg-[hsla(35,85%,55%,0.15)] text-[hsl(35,85%,40%)] px-2 py-0.5 rounded-lg font-medium">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-8 text-center animate-fade-in" style={{ animationDelay: "200ms" }}>
          <p className="text-muted-foreground text-sm">No memorized pages yet. Add pages in the Hifz tab first.</p>
        </div>
      )}
    </div>
  );
}
