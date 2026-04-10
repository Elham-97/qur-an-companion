import { BookOpen, Flame, Target, TrendingUp } from "lucide-react";
import { useHifzData } from "@/hooks/useHifzData";
import ProgressRing from "@/components/ProgressRing";
import { TOTAL_PAGES, TOTAL_JUZ } from "@/lib/quran-data";

export default function Progress() {
  const { data, completionRate } = useHifzData();
  const juzCompleted = Math.floor(data.totalPagesMemorized / 20);
  const progressPercent = ((data.totalPagesMemorized / TOTAL_PAGES) * 100).toFixed(1);

  const stats = [
    { icon: BookOpen, label: "Pages Memorized", value: data.totalPagesMemorized, color: "gradient-purple-blue" },
    { icon: Target, label: "Juz Completed", value: `${juzCompleted}/${TOTAL_JUZ}`, color: "gradient-blue-cyan" },
    { icon: Flame, label: "Day Streak", value: data.streakDays, color: "gradient-streak" },
    { icon: TrendingUp, label: "Weak Pages", value: data.weakPages.length, color: "gradient-pink-purple" },
  ];

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 max-w-md mx-auto relative">
      <div className="absolute top-10 left-1/4 w-[300px] h-[200px] rounded-full bg-[hsla(260,60%,50%,0.05)] blur-[80px] pointer-events-none" />

      <h1 className="text-xl font-bold text-gradient mb-1 animate-fade-in">Progress</h1>
      <p className="text-sm text-muted-foreground mb-6 animate-fade-in">Your Qur'an journey overview</p>

      {/* Main Progress */}
      <div className="glass-card-glow rounded-2xl p-6 flex flex-col items-center mb-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <ProgressRing progress={data.totalPagesMemorized / TOTAL_PAGES} size={120} strokeWidth={8} />
        <p className="text-3xl font-bold text-gradient mt-3">{progressPercent}%</p>
        <p className="text-sm text-muted-foreground">of the Qur'an memorized</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="glass-card rounded-2xl p-4 animate-fade-in"
            style={{ animationDelay: `${(i + 2) * 100}ms` }}
          >
            <div className={`w-9 h-9 rounded-xl ${stat.color} flex items-center justify-center mb-3 shadow-lg`}>
              <stat.icon className="w-4 h-4 text-primary-foreground" />
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Today's Completion */}
      <div className="glass-card rounded-2xl p-5 mt-4 animate-fade-in" style={{ animationDelay: "600ms" }}>
        <h2 className="font-semibold text-foreground mb-3">Today's Completion</h2>
        <div className="space-y-2">
          {Object.entries(data.completedToday).map(([key, done]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-foreground capitalize">{key === "muraja" ? "Muraja'a" : key === "tajwid" ? "Tajwīd" : key}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${done ? "bg-primary/15 text-primary border border-primary/20" : "bg-muted text-muted-foreground"}`}>
                {done ? "Done" : "Pending"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
