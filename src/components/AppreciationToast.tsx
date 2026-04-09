import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface AppreciationToastProps {
  message: string;
  show: boolean;
  onHide: () => void;
}

export default function AppreciationToast({ message, show, onHide }: AppreciationToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onHide, 3500);
      return () => clearTimeout(timer);
    }
  }, [show, onHide]);

  if (!show) return null;

  return (
    <div className="fixed top-6 left-4 right-4 z-50 flex justify-center animate-fade-in">
      <div className="glass-card rounded-2xl px-5 py-3 flex items-center gap-3 shadow-lg max-w-sm">
        <Sparkles className="w-5 h-5 text-accent shrink-0" />
        <p className="text-sm font-medium text-foreground">{message}</p>
      </div>
    </div>
  );
}
