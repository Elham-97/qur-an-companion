import { useState, useCallback } from "react";
import { BookOpen, RefreshCw, Wrench, BookMarked, Flame } from "lucide-react";

import { useHifzData } from "@/hooks/useHifzData";
import TaskCard from "@/components/TaskCard";
import ProgressRing from "@/components/ProgressRing";
import AppreciationToast from "@/components/AppreciationToast";
import { getTodaysTajwid } from "@/lib/quran-data";
import { getAppreciation, analyzeBehavior } from "@/lib/feedback";

export default function Dashboard() {
  
  const { data, completeTask, completionRate } = useHifzData();
  const [toast, setToast] = useState({ show: false, message: "" });
  const tajwid = getTodaysTajwid();

  const handleComplete = useCallback(
    async (task: "hifz" | "muraja" | "fixing" | "tajwid") => {
      await completeTask(task);
      setToast({ show: true, message: getAppreciation() });
    },
    [completeTask]
  );

  const suggestion = analyzeBehavior({
    streakDays: data.streakDays,
    completionRate: completionRate(),
    weakPages: data.weakPages.length,
    hifzDone: data.completedToday.hifz,
    murajaDone: data.completedToday.muraja,
  });

  const firstName = "Student";

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 max-w-md mx-auto">
      <AppreciationToast
        message={toast.message}
        show={toast.show}
        onHide={() => setToast({ show: false, message: "" })}
      />

      {/* Header */}
      <div className="mb-6 animate-fade-in">
        <h1 className="text-xl font-bold text-foreground">
          Assalamu Alaikum, {firstName} 🌿
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{suggestion}</p>
      </div>

      {/* Progress + Streak Row */}
      <div className="flex items-center gap-4 mb-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <ProgressRing progress={completionRate()} label="Today" />
        <div className="glass-card rounded-2xl px-5 py-4 flex-1 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-streak flex items-center justify-center">
            <Flame className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{data.streakDays}</p>
            <p className="text-xs text-muted-foreground">Day streak</p>
          </div>
        </div>
      </div>

      {/* Task Cards */}
      <div className="space-y-3">
        <TaskCard
          icon={BookOpen}
          title="New Hifz"
          subtitle={`Pages ${data.currentHifzPages[0]}-${data.currentHifzPages[1]}`}
          detail="Memorize 2 new pages"
          completed={data.completedToday.hifz}
          onComplete={() => handleComplete("hifz")}
          colorClass="gradient-primary"
          delay={200}
        />
        <TaskCard
          icon={RefreshCw}
          title="Muraja'a"
          subtitle={`Juz ${data.currentMurajaJuz}`}
          detail="Revise 1 juz today"
          completed={data.completedToday.muraja}
          onComplete={() => handleComplete("muraja")}
          colorClass="bg-muraja"
          delay={300}
        />
        <TaskCard
          icon={Wrench}
          title="Fixing Pages"
          subtitle={`Pages ${data.weakPages.slice(0, 2).join(", ")}`}
          detail="Strengthen 2 weak pages"
          completed={data.completedToday.fixing}
          onComplete={() => handleComplete("fixing")}
          colorClass="bg-fixing"
          delay={400}
        />
        <TaskCard
          icon={BookMarked}
          title="Tajwīd Focus"
          subtitle={tajwid.name}
          detail={tajwid.description}
          completed={data.completedToday.tajwid}
          onComplete={() => handleComplete("tajwid")}
          colorClass="bg-tajwid"
          delay={500}
        />
      </div>
    </div>
  );
}
