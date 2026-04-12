import { useState, useCallback } from "react";
import { BookOpen, RefreshCw, Wrench, BookMarked, Flame, Sparkles, Plus, Trash2, X } from "lucide-react";
import { useHifzData } from "@/hooks/useHifzData";
import { useTodos } from "@/hooks/useTodos";
import TaskCard from "@/components/TaskCard";
import ProgressRing from "@/components/ProgressRing";
import AppreciationToast from "@/components/AppreciationToast";
import { getTodaysTajwid } from "@/lib/quran-data";
import { getAppreciation, analyzeBehavior } from "@/lib/feedback";
import { useAuth } from "@/contexts/AuthContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { data, completeTask, completionRate } = useHifzData();
  const { todayTodos, completedTodos, streak, addTodo, toggleTodo, deleteTodo } = useTodos();
  const [toast, setToast] = useState({ show: false, message: "" });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState("");
  const tajwid = getTodaysTajwid();

  const handleComplete = useCallback(
    async (task: "hifz" | "muraja" | "fixing" | "tajwid") => {
      await completeTask(task);
      setToast({ show: true, message: getAppreciation() });
    },
    [completeTask]
  );

  const handleAddTask = () => {
    if (newTask.trim()) {
      addTodo(newTask);
      setNewTask("");
      setShowAddModal(false);
      setToast({ show: true, message: "Task added! Keep going 💪" });
    }
  };

  const handleToggle = (id: string, completed: boolean) => {
    toggleTodo(id);
    if (!completed) {
      setToast({ show: true, message: "Great job! ✅ Task completed" });
    }
  };

  const suggestion = analyzeBehavior({
    streakDays: data.streakDays,
    completionRate: completionRate(),
    weakPages: data.weakPages.length,
    hifzDone: data.completedToday.hifz,
    murajaDone: data.completedToday.muraja,
  });

  const { user } = useAuth();
  const firstName = user?.email?.split("@")[0] || "Student";

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 max-w-md mx-auto relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] h-[250px] rounded-full bg-[hsla(252,60%,58%,0.08)] blur-[80px] pointer-events-none" />

      <AppreciationToast
        message={toast.message}
        show={toast.show}
        onHide={() => setToast({ show: false, message: "" })}
      />

      {/* Header */}
      <div className="mb-6 animate-fade-in relative z-10">
        <h1 className="text-xl font-bold text-gradient">
          Assalamu Alaikum, {firstName} 🌿
        </h1>
        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-primary" />{suggestion}
        </p>
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-4 mb-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <ProgressRing progress={completionRate()} label="Today" />
        <div className="glass-card-glow rounded-2xl px-5 py-4 flex-1 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-purple-blue flex items-center justify-center">
            <Flame className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{streak.count > 0 ? streak.count : data.streakDays}</p>
            <p className="text-xs text-muted-foreground">🔥 Day streak</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6 animate-fade-in" style={{ animationDelay: "150ms" }}>
        <div className="glass-card rounded-2xl p-4">
          <p className="text-2xl font-bold text-foreground">{data.totalPagesMemorized}</p>
          <p className="text-xs text-muted-foreground">Pages memorized</p>
        </div>
        <div className="glass-card rounded-2xl p-4">
          <p className="text-2xl font-bold text-foreground">{data.weakPages.length}</p>
          <p className="text-xs text-muted-foreground">Weak pages</p>
        </div>
      </div>

      {/* Hifz Task Cards */}
      <div className="space-y-3 mb-6">
        <TaskCard icon={BookOpen} title="New Hifz" subtitle={`Pages ${data.currentHifzPages[0]}-${data.currentHifzPages[1]}`} detail="Memorize 2 new pages" completed={data.completedToday.hifz} onComplete={() => handleComplete("hifz")} colorClass="gradient-purple-blue" delay={200} />
        <TaskCard icon={RefreshCw} title="Muraja'a" subtitle={`Juz ${data.currentMurajaJuz}`} detail="Revise 1 juz today" completed={data.completedToday.muraja} onComplete={() => handleComplete("muraja")} colorClass="gradient-blue-cyan" delay={300} />
        <TaskCard icon={Wrench} title="Fix Weak Pages" subtitle={data.weakPages.length > 0 ? `Pages ${data.weakPages.slice(0, 2).join(", ")}` : "No weak pages"} detail="Strengthen weak pages" completed={data.completedToday.fixing} onComplete={() => handleComplete("fixing")} colorClass="gradient-fixing" delay={400} />
        <TaskCard icon={BookMarked} title="Tajwīd Focus" subtitle={tajwid.name} detail={tajwid.description} completed={data.completedToday.tajwid} onComplete={() => handleComplete("tajwid")} colorClass="gradient-pink-purple" delay={500} />
      </div>

      {/* Today's Tasks */}
      <div className="animate-fade-in" style={{ animationDelay: "550ms" }}>
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          📋 Today's Tasks
          <span className="text-xs text-muted-foreground font-normal">({todayTodos.length})</span>
        </h2>
        {todayTodos.length === 0 ? (
          <div className="glass-card rounded-2xl p-4 text-center">
            <p className="text-sm text-muted-foreground">No tasks yet. Tap + to add one!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {todayTodos.map((todo) => (
              <div key={todo.id} className="glass-card rounded-2xl px-4 py-3 flex items-center gap-3 animate-fade-in">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => handleToggle(todo.id, todo.completed)}
                  className="border-primary data-[state=checked]:bg-primary"
                />
                <span className="flex-1 text-sm text-foreground">{todo.text}</span>
                <button onClick={() => deleteTodo(todo.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Tasks */}
      {completedTodos.length > 0 && (
        <div className="mt-6 animate-fade-in" style={{ animationDelay: "600ms" }}>
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            ✅ Completed
            <span className="text-xs text-muted-foreground font-normal">({completedTodos.length})</span>
          </h2>
          <div className="space-y-2">
            {completedTodos.slice(0, 5).map((todo) => (
              <div key={todo.id} className="glass-card rounded-2xl px-4 py-3 flex items-center gap-3 opacity-50">
                <Checkbox
                  checked={true}
                  onCheckedChange={() => handleToggle(todo.id, todo.completed)}
                  className="border-primary data-[state=checked]:bg-primary"
                />
                <span className="flex-1 text-sm text-foreground line-through">{todo.text}</span>
                <button onClick={() => deleteTodo(todo.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full gradient-purple-blue flex items-center justify-center shadow-xl glow-ring transition-transform duration-200 hover:scale-110 active:scale-95 z-40"
      >
        <Plus className="w-6 h-6 text-primary-foreground" />
      </button>

      {/* Add Task Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="glass-card-glow max-w-sm mx-auto border-border/40">
          <DialogHeader>
            <DialogTitle className="text-gradient text-lg">Add New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Input
              placeholder="e.g. Review Surah Al-Baqarah page 5"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
              className="bg-background/50 border-border/50"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => { setNewTask(""); setShowAddModal(false); }}>
                Cancel
              </Button>
              <Button onClick={handleAddTask} disabled={!newTask.trim()} className="gradient-purple-blue text-primary-foreground">
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
