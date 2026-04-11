import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useHifzData } from "@/hooks/useHifzData";
import { TOTAL_PAGES } from "@/lib/quran-data";

export default function Profile() {
  const { user, logout } = useAuth();
  const { data } = useHifzData();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 max-w-md mx-auto relative">
      <div className="absolute top-10 left-1/3 w-[250px] h-[200px] rounded-full bg-[hsla(252,60%,58%,0.06)] blur-[80px] pointer-events-none" />

      <h1 className="text-xl font-bold text-gradient mb-6 animate-fade-in">Profile</h1>

      <div className="glass-card-glow rounded-2xl p-5 flex items-center gap-4 mb-4 animate-fade-in">
        <div className="w-14 h-14 rounded-full gradient-purple-blue flex items-center justify-center shadow-lg">
          <User className="w-7 h-7 text-primary-foreground" />
        </div>
        <div>
          <p className="font-semibold text-foreground">{user?.email || "Student"}</p>
          <p className="text-xs text-muted-foreground">Student of the Qur'an</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-5 mb-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <h2 className="font-semibold text-foreground mb-3">Summary</h2>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Pages memorized</span>
            <span className="font-medium text-foreground">{data.totalPagesMemorized}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Completion</span>
            <span className="font-medium text-foreground">{((data.totalPagesMemorized / TOTAL_PAGES) * 100).toFixed(1)}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Streak</span>
            <span className="font-medium text-foreground">{data.streakDays} days</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Weak pages</span>
            <span className="font-medium text-foreground">{data.weakPages.length}</span>
          </div>
        </div>
      </div>

      <Button
        onClick={handleLogout}
        variant="outline"
        className="w-full rounded-xl h-11 border-destructive/30 text-destructive hover:bg-destructive/10"
      >
        <LogOut className="w-4 h-4 mr-2" /> Sign Out
      </Button>
    </div>
  );
}
