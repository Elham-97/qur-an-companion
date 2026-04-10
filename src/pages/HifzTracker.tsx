import { useState } from "react";
import { BookOpen, Plus, Minus, Check } from "lucide-react";
import { useHifzData } from "@/hooks/useHifzData";
import { Button } from "@/components/ui/button";
import AppreciationToast from "@/components/AppreciationToast";
import { getAppreciation } from "@/lib/feedback";
import { TOTAL_PAGES } from "@/lib/quran-data";

export default function HifzTracker() {
  const { data, completeTask } = useHifzData();
  const [pages, setPages] = useState(2);
  const [toast, setToast] = useState({ show: false, message: "" });

  const handleComplete = async () => {
    await completeTask("hifz");
    setToast({ show: true, message: getAppreciation() });
  };

  const progressPercent = ((data.totalPagesMemorized / TOTAL_PAGES) * 100).toFixed(1);

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 max-w-md mx-auto relative">
      <div className="absolute top-10 right-0 w-[250px] h-[250px] rounded-full bg-[hsla(260,60%,50%,0.05)] blur-[80px] pointer-events-none" />

      <AppreciationToast
        message={toast.message}
        show={toast.show}
        onHide={() => setToast({ show: false, message: "" })}
      />

      <h1 className="text-xl font-bold text-gradient mb-1 animate-fade-in">Hifz Tracker</h1>
      <p className="text-sm text-muted-foreground mb-6 animate-fade-in">Track your memorization progress</p>

      {/* Current Progress Card */}
      <div className="glass-card-glow rounded-2xl p-5 mb-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl gradient-purple-blue flex items-center justify-center shadow-lg">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Total Memorized</p>
            <p className="text-xs text-muted-foreground">{data.totalPagesMemorized} of {TOTAL_PAGES} pages</p>
          </div>
        </div>
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <div
            className="gradient-purple-blue h-3 rounded-full transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-right">{progressPercent}%</p>
      </div>

      {/* Today's Hifz */}
      <div className="glass-card rounded-2xl p-5 animate-fade-in" style={{ animationDelay: "200ms" }}>
        <h2 className="font-semibold text-foreground mb-1">Today's Memorization</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Pages {data.currentHifzPages[0]} – {data.currentHifzPages[1]}
        </p>

        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={() => setPages(Math.max(1, pages - 1))}
            className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center hover:bg-secondary/50 transition-colors"
          >
            <Minus className="w-4 h-4 text-foreground" />
          </button>
          <div className="text-center">
            <p className="text-4xl font-bold text-gradient">{pages}</p>
            <p className="text-xs text-muted-foreground">pages</p>
          </div>
          <button
            onClick={() => setPages(Math.min(10, pages + 1))}
            className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center hover:bg-secondary/50 transition-colors"
          >
            <Plus className="w-4 h-4 text-foreground" />
          </button>
        </div>

        <Button
          onClick={handleComplete}
          disabled={data.completedToday.hifz}
          className="w-full rounded-xl h-12 gradient-purple-blue text-primary-foreground font-semibold glow-ring hover:opacity-90 transition-opacity"
        >
          {data.completedToday.hifz ? (
            <span className="flex items-center gap-2"><Check className="w-4 h-4" /> Completed</span>
          ) : (
            "Mark as Complete"
          )}
        </Button>
      </div>
    </div>
  );
}
