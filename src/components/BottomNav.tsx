import { Home, BookOpen, RefreshCw, BookText, Brain, BarChart3 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/hifz", icon: BookOpen, label: "Hifz" },
  { path: "/muraja", icon: RefreshCw, label: "Muraja'a" },
  { path: "/quran", icon: BookText, label: "Qur'an" },
  { path: "/mutashabih", icon: Brain, label: "Train" },
  { path: "/progress", icon: BarChart3, label: "Stats" },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user || location.pathname === "/auth") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 px-1 pb-safe"
         style={{
           background: 'hsla(0, 0%, 100%, 0.85)',
           backdropFilter: 'blur(20px)',
           WebkitBackdropFilter: 'blur(20px)',
         }}>
      <div className="flex justify-around items-center h-14 max-w-md mx-auto">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200",
                active
                  ? "text-primary scale-105"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn(
                "w-[18px] h-[18px]",
                active && "stroke-[2.5] drop-shadow-[0_0_6px_hsla(252,60%,58%,0.5)]"
              )} />
              <span className="text-[9px] font-medium leading-tight">{item.label}</span>
              {active && (
                <div className="w-1 h-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
