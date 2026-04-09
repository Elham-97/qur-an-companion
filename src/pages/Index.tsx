import { useAuth } from "@/contexts/AuthContext";
import Auth from "./Auth";
import Dashboard from "./Dashboard";
import BottomNav from "@/components/BottomNav";

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Auth />;

  return (
    <>
      <Dashboard />
      <BottomNav />
    </>
  );
}
