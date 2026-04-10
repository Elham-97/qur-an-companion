import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface TaskCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  detail: string;
  completed: boolean;
  onComplete: () => void;
  colorClass: string;
  delay?: number;
}

export default function TaskCard({
  icon: Icon,
  title,
  subtitle,
  detail,
  completed,
  onComplete,
  colorClass,
  delay = 0,
}: TaskCardProps) {
  return (
    <div
      className={cn(
        "glass-card rounded-2xl p-4 animate-fade-in transition-all duration-300",
        completed && "opacity-50"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg",
              colorClass
            )}
          >
            <Icon className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
            <p className="text-xs text-muted-foreground/70 mt-1">{detail}</p>
          </div>
        </div>
        <button
          onClick={onComplete}
          disabled={completed}
          className={cn(
            "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 shrink-0",
            completed
              ? "bg-primary border-primary glow-ring"
              : "border-border/60 hover:border-primary hover:bg-primary/10"
          )}
        >
          {completed && <Check className="w-4 h-4 text-primary-foreground" />}
        </button>
      </div>
    </div>
  );
}
