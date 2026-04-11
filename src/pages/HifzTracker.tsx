import { useState } from "react";
import { BookOpen, Plus, Trash2, Check } from "lucide-react";
import { useHifzData } from "@/hooks/useHifzData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AppreciationToast from "@/components/AppreciationToast";
import { getAppreciation } from "@/lib/feedback";
import { TOTAL_PAGES } from "@/lib/quran-data";

export default function HifzTracker() {
  const { data, completeTask, addPages, removePage } = useHifzData();
  const [pageInput, setPageInput] = useState("");
  const [toast, setToast] = useState({ show: false, message: "" });

  const handleAddPages = () => {
    const parts = pageInput.split(",").map((s) => parseInt(s.trim())).filter((n) => !isNaN(n) && n >= 1 && n <= TOTAL_PAGES);
    if (parts.length === 0) return;
    addPages(parts);
    setPageInput("");
    setToast({ show: true, message: getAppreciation() });
  };

  const handleComplete = async () => {
    await completeTask("hifz");
    setToast({ show: true, message: getAppreciation() });
  };

  const progressPercent = ((data.totalPagesMemorized / TOTAL_PAGES) * 100).toFixed(1);

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 max-w-md mx-auto relative">
      <div className="absolute top-10 right-0 w-[250px] h-[250px] rounded-full bg-[hsla(252,60%,58%,0.06)] blur-[80px] pointer-events-none" />

      <AppreciationToast
        message={toast.message}
        show={toast.show}
        onHide={() => setToast({ show: false, message: "" })}
      />

      <h1 className="text-xl font-bold text-gradient mb-1 animate-fade-in">Hifz Tracker</h1>
      <p className="text-sm text-muted-foreground mb-6 animate-fade-in">Track your memorization progress</p>

      {/* Progress Bar */}
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

      {/* Add Pages */}
      <div className="glass-card rounded-2xl p-5 mb-4 animate-fade-in" style={{ animationDelay: "200ms" }}>
        <h2 className="font-semibold text-foreground mb-3">Add Memorized Pages</h2>
        <p className="text-xs text-muted-foreground mb-3">Enter page numbers separated by commas (e.g. 1, 2, 3)</p>
        <div className="flex gap-2">
          <Input
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            placeholder="e.g. 5, 6, 7"
            className="rounded-xl h-11 bg-secondary/50 border-border/50 focus:border-primary/50 flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleAddPages()}
          />
          <Button
            onClick={handleAddPages}
            className="rounded-xl h-11 gradient-purple-blue text-primary-foreground glow-ring hover:opacity-90"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Mark Today Complete */}
      <div className="glass-card rounded-2xl p-5 mb-4 animate-fade-in" style={{ animationDelay: "300ms" }}>
        <Button
          onClick={handleComplete}
          disabled={data.completedToday.hifz}
          className="w-full rounded-xl h-12 gradient-purple-blue text-primary-foreground font-semibold glow-ring hover:opacity-90 transition-opacity"
        >
          {data.completedToday.hifz ? (
            <span className="flex items-center gap-2"><Check className="w-4 h-4" /> Completed Today</span>
          ) : (
            "Mark Today's Hifz Complete"
          )}
        </Button>
      </div>

      {/* Memorized Pages List */}
      {data.memorizedPages.length > 0 && (
        <div className="glass-card rounded-2xl p-5 animate-fade-in" style={{ animationDelay: "400ms" }}>
          <h2 className="font-semibold text-foreground mb-3">Memorized Pages ({data.memorizedPages.length})</h2>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {data.memorizedPages
              .sort((a, b) => a.page - b.page)
              .map((mp) => (
                <div key={mp.page} className="flex items-center justify-between bg-secondary/40 rounded-xl px-3 py-2">
                  <div>
                    <span className="text-sm font-medium text-foreground">Page {mp.page}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {mp.strength === "weak" ? "⚠️ Weak" : mp.strength === "strong" ? "✅ Strong" : "🆕 New"}
                    </span>
                  </div>
                  <button
                    onClick={() => removePage(mp.page)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
