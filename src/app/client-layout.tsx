"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { ScrollProgress, MouseFollowGlow } from "@/components/ui/scroll-progress";
import { CommandMenu } from "@/components/ui/command-menu";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>{isLoading && <LoadingScreen />}</AnimatePresence>
      
      {mounted && <CustomCursor />}
      
      <MouseFollowGlow />
      <ScrollProgress />
      
      <Navbar />
      
      <main className="relative">
        {children}
      </main>
      
      <Footer />
      
      <CommandMenu />
    </>
  );
}