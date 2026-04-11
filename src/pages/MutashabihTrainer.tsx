import { useState, useMemo } from "react";
import { Brain, CheckCircle2, XCircle, RotateCcw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  mutashabihQuestions,
  recordMistake,
  getWeakQuestions,
  type MutashabihQuestion,
} from "@/lib/mutashabihat";
import { cn } from "@/lib/utils";

export default function MutashabihTrainer() {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [mode, setMode] = useState<"all" | "weak">("all");

  const questions = useMemo(() => {
    if (mode === "weak") {
      const weak = getWeakQuestions();
      return weak.length > 0 ? weak : mutashabihQuestions;
    }
    return mutashabihQuestions;
  }, [mode]);

  const question: MutashabihQuestion | undefined = questions[qIndex];
  const isFinished = qIndex >= questions.length;

  const handleSelect = (optionIdx: number) => {
    if (showResult) return;
    setSelected(optionIdx);
    setShowResult(true);
    const isCorrect = question.options[optionIdx].correct;
    if (isCorrect) {
      setScore((s) => ({ ...s, correct: s.correct + 1 }));
    } else {
      setScore((s) => ({ ...s, wrong: s.wrong + 1 }));
      recordMistake(question.id);
    }
  };

  const handleNext = () => {
    setSelected(null);
    setShowResult(false);
    setQIndex((i) => i + 1);
  };

  const handleRestart = () => {
    setQIndex(0);
    setSelected(null);
    setShowResult(false);
    setScore({ correct: 0, wrong: 0 });
  };

  const weakCount = getWeakQuestions().length;

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 max-w-md mx-auto relative">
      <div className="absolute top-10 right-0 w-[200px] h-[200px] rounded-full bg-[hsla(252,60%,58%,0.06)] blur-[80px] pointer-events-none" />

      <h1 className="text-xl font-bold text-gradient mb-1 animate-fade-in">Mutashābihāt</h1>
      <p className="text-sm text-muted-foreground mb-4 animate-fade-in">Train your memory on similar ayahs</p>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-4 animate-fade-in">
        <button
          onClick={() => { setMode("all"); handleRestart(); }}
          className={cn(
            "flex-1 py-2 rounded-xl text-sm font-medium transition-all",
            mode === "all" ? "gradient-purple-blue text-primary-foreground shadow-lg" : "bg-secondary/50 text-muted-foreground"
          )}
        >
          All Questions
        </button>
        <button
          onClick={() => { setMode("weak"); handleRestart(); }}
          className={cn(
            "flex-1 py-2 rounded-xl text-sm font-medium transition-all",
            mode === "weak" ? "gradient-purple-blue text-primary-foreground shadow-lg" : "bg-secondary/50 text-muted-foreground"
          )}
        >
          Weak Ayahs {weakCount > 0 && `(${weakCount})`}
        </button>
      </div>

      {isFinished ? (
        <div className="glass-card-glow rounded-2xl p-6 text-center animate-fade-in">
          <Brain className="w-12 h-12 mx-auto text-primary mb-3" />
          <h2 className="text-lg font-bold text-foreground mb-2">Session Complete!</h2>
          <div className="flex justify-center gap-6 mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-success">{score.correct}</p>
              <p className="text-xs text-muted-foreground">Correct</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-destructive">{score.wrong}</p>
              <p className="text-xs text-muted-foreground">Wrong</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            {score.wrong === 0 ? "Mashaallah! Perfect score!" : "Keep practising — consistency is key."}
          </p>
          <Button onClick={handleRestart} className="rounded-xl gradient-purple-blue text-primary-foreground glow-ring">
            <RotateCcw className="w-4 h-4 mr-2" /> Try Again
          </Button>
        </div>
      ) : question ? (
        <>
          {/* Progress */}
          <div className="flex items-center gap-3 mb-4 animate-fade-in">
            <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="gradient-purple-blue h-2 rounded-full transition-all duration-500"
                style={{ width: `${((qIndex) / questions.length) * 100}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground font-medium">{qIndex + 1}/{questions.length}</span>
          </div>

          {/* Question */}
          <div className="glass-card-glow rounded-2xl p-5 mb-4 animate-fade-in">
            <p className="font-arabic text-lg leading-relaxed text-foreground text-right mb-3" dir="rtl">
              {question.promptArabic}
            </p>
            <p className="text-sm text-muted-foreground">{question.prompt}</p>
          </div>

          {/* Options */}
          <div className="space-y-2 mb-4">
            {question.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrectOption = opt.correct;
              let optClass = "glass-card";
              if (showResult && isCorrectOption) optClass = "border-success bg-success/10";
              else if (showResult && isSelected && !isCorrectOption) optClass = "border-destructive bg-destructive/10";

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={showResult}
                  className={cn(
                    "w-full text-left rounded-2xl p-4 border transition-all",
                    optClass,
                    !showResult && "hover:border-primary/50 cursor-pointer"
                  )}
                >
                  <p className="font-arabic text-base text-foreground text-right mb-1" dir="rtl">{opt.arabic}</p>
                  <p className="text-xs text-muted-foreground">{opt.text}</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">{opt.surah}</p>
                  {showResult && isCorrectOption && (
                    <CheckCircle2 className="w-4 h-4 text-success mt-1" />
                  )}
                  {showResult && isSelected && !isCorrectOption && (
                    <XCircle className="w-4 h-4 text-destructive mt-1" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showResult && (
            <div className={cn(
              "rounded-2xl p-4 mb-4 animate-fade-in border",
              selected !== null && question.options[selected].correct
                ? "bg-success/5 border-success/20"
                : "bg-destructive/5 border-destructive/20"
            )}>
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-sm text-foreground">{question.explanation}</p>
              </div>
            </div>
          )}

          {showResult && (
            <Button
              onClick={handleNext}
              className="w-full rounded-xl h-11 gradient-purple-blue text-primary-foreground glow-ring animate-fade-in"
            >
              {qIndex + 1 >= questions.length ? "See Results" : "Next Question"}
            </Button>
          )}
        </>
      ) : null}
    </div>
  );
}
