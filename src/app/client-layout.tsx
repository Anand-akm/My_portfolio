"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { ScrollProgress, MouseFollowGlow } from "@/components/ui/scroll-progress";
import { CommandMenu } from "@/components/ui/command-menu";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const isAIPage = pathname?.startsWith("/ai");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>

      {!isAIPage && isLoading && <LoadingScreen />}

      {!isAIPage && (
        <>
          <ScrollProgress />
          <MouseFollowGlow />
          <Navbar />
        </>
      )}

      <main id="main-content" className="relative">
        {children}
      </main>

      {!isAIPage && (
        <>
          <Footer />
          <CommandMenu />
        </>
      )}
    </>
  );
}
