"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] bg-background flex items-center justify-center animate-[fadeOut_0.5s_ease-in-out_2s_forwards]"
      style={{
        animation: 'fadeIn 0.3s ease-out, fadeOut 0.5s ease-in-out 2s forwards',
      }}
    >
      <div className="text-center">
        <div
          className="mb-8"
          style={{ animation: 'scaleIn 0.5s ease-out' }}
        >
          <div className="text-4xl font-bold text-gradient mb-2">anandcodes.tech</div>
          <div className="text-sm text-muted-foreground">Loading your experience...</div>
        </div>

        <div className="w-64 h-1 bg-muted rounded-full overflow-hidden mx-auto">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-[width] duration-100"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 animate-pulse-slow">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm text-muted-foreground">{Math.round(Math.min(progress, 100))}%</span>
        </div>
      </div>
    </div>
  );
}
