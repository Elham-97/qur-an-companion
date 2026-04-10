import { useState, useEffect } from "react";
import { RefreshCw, Turtle, Zap, Check, Star } from "lucide-react";
import { useHifzData } from "@/hooks/useHifzData";
import { Button } from "@/components/ui/button";
import AppreciationToast from "@/components/AppreciationToast";
import { getAppreciation } from "@/lib/feedback";
import { createCard, reviewCard, getDueCards, type ReviewCard, type Rating } from "@/lib/fsrs";
import { cn } from "@/lib/utils";

type ReviewMode = "fixing" | "flow";

export default function MurajaaTracker() {
  const { data, completeTask } = useHifzData();
  const [mode, setMode] = useState<ReviewMode>("flow");
  const [toast, setToast] = useState({ show: false, message: "" });
  const [reviewCards, setReviewCards] = useState<ReviewCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  useEffect(() => {
    const cards: ReviewCard[] = [];
    data.weakPages.forEach((p) => {
      const card = createCard(p);
      card.easeFactor = 1.5;
      cards.push(card);
    });
    for (let i = 1; i <= Math.min(data.totalPagesMemorized, 10); i++) {
      if (!data.weakPages.includes(i)) {
        cards.push(createCard(i));
      }
    }
    setReviewCards(cards);
  }, [data.weakPages, data.totalPagesMemorized]);

  const dueCards = getDueCards(reviewCards);

  const handleRate = (rating: Rating) => {
    if (dueCards.length === 0) return;
    const card = dueCards[currentCardIndex];
    const updated = reviewCard(card, rating);
    setReviewCards((prev) =>
      prev.map((c) => (c.page === card.page ? updated : c))
    );
    if (currentCardIndex < dueCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handleComplete = async () => {
    await completeTask("muraja");
    setToast({ show: true, message: getAppreciation() });
  };

  const currentCard = dueCards[currentCardIndex];

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 max-w-md mx-auto relative">
      <div className="absolute top-20 left-0 w-[300px] h-[200px] rounded-full bg-[hsla(210,80%,50%,0.05)] blur-[80px] pointer-events-none" />

      <AppreciationToast
        message={toast.message}
        show={toast.show}
        onHide={() => setToast({ show: false, message: "" })}
      />

      <h1 className="text-xl font-bold text-gradient mb-1 animate-fade-in">Muraja'a</h1>
      <p className="text-sm text-muted-foreground mb-6 animate-fade-in">Revise and protect your memorization</p>

      {/* Mode Selector */}
      <div className="flex gap-3 mb-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <button
          onClick={() => setMode("fixing")}
          className={cn(
            "flex-1 glass-card rounded-2xl p-4 flex flex-col items-center gap-2 transition-all",
            mode === "fixing" && "ring-2 ring-primary glow-ring"
          )}
        >
          <Turtle className="w-6 h-6 text-accent" />
          <span className="text-sm font-semibold text-foreground">Fixing</span>
          <span className="text-[10px] text-muted-foreground">Slow & detailed</span>
        </button>
        <button
          onClick={() => setMode("flow")}
          className={cn(
            "flex-1 glass-card rounded-2xl p-4 flex flex-col items-center gap-2 transition-all",
            mode === "flow" && "ring-2 ring-primary glow-ring"
          )}
        >
          <Zap className="w-6 h-6 text-primary" />
          <span className="text-sm font-semibold text-foreground">Flow</span>
          <span className="text-[10px] text-muted-foreground">Continuous review</span>
        </button>
      </div>

      {/* Today's Review */}
      <div className="glass-card-glow rounded-2xl p-5 mb-4 animate-fade-in" style={{ animationDelay: "200ms" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl gradient-blue-cyan flex items-center justify-center shadow-lg">
            <RefreshCw className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Juz {data.currentMurajaJuz}</p>
            <p className="text-xs text-muted-foreground">
              {mode === "fixing" ? "Read slowly, focus on weak spots" : "Read at normal pace, maintain flow"}
            </p>
          </div>
        </div>

        {mode === "fixing" && data.weakPages.length > 0 && (
          <div className="bg-secondary/50 rounded-xl p-3 mb-4 border border-border/30">
            <p className="text-xs font-medium text-foreground mb-1">Weak Pages to Focus On:</p>
            <div className="flex flex-wrap gap-2">
              {data.weakPages.slice(0, 4).map((p) => (
                <span key={p} className="text-xs bg-accent/15 text-accent px-2 py-1 rounded-lg font-medium border border-accent/20">
                  Page {p}
                </span>
              ))}
            </div>
          </div>
        )}

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

      {/* Spaced Repetition Cards */}
      {dueCards.length > 0 && currentCard && (
        <div className="glass-card rounded-2xl p-5 animate-fade-in" style={{ animationDelay: "300ms" }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Star className="w-4 h-4 text-streak" />
              Spaced Review
            </h2>
            <span className="text-xs text-muted-foreground">
              {currentCardIndex + 1} / {dueCards.length}
            </span>
          </div>

          <div className="bg-secondary/50 rounded-xl p-4 text-center mb-4 border border-border/30">
            <p className="text-3xl font-bold text-gradient mb-1">Page {currentCard.page}</p>
            <p className="text-xs text-muted-foreground">
              Interval: {currentCard.interval}d · Reviews: {currentCard.repetitions}
            </p>
          </div>

          <p className="text-xs text-muted-foreground text-center mb-3">How well did you recall this page?</p>
          <div className="grid grid-cols-4 gap-2">
            {(["again", "hard", "good", "easy"] as Rating[]).map((rating) => (
              <button
                key={rating}
                onClick={() => handleRate(rating)}
                className={cn(
                  "py-2 rounded-xl text-xs font-medium capitalize transition-all border",
                  rating === "again" && "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20",
                  rating === "hard" && "bg-streak/10 text-streak border-streak/20 hover:bg-streak/20",
                  rating === "good" && "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20",
                  rating === "easy" && "bg-success/15 text-success border-success/20 hover:bg-success/25"
                )}
              >
                {rating}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
