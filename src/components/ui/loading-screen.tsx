"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="text-4xl font-bold text-gradient mb-2">anandcodes.tech</div>
          <div className="text-sm text-muted-foreground">Loading your experience...</div>
        </motion.div>

        <div className="w-64 h-1 bg-muted rounded-full overflow-hidden mx-auto">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent"
            style={{ width: `${Math.min(progress, 100)}%` }}
            initial={{ width: "0%" }}
          />
        </div>

        <motion.div
          className="mt-4 flex items-center justify-center gap-2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm text-muted-foreground">{Math.round(Math.min(progress, 100))}%</span>
        </motion.div>
      </div>
    </motion.div>
  );
}