"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 200 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const scaleRef = useRef(1);
  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isHovering = false;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const hovering = Boolean(
        target.tagName === "A" ||
          target.tagName === "BUTTON" ||
          target.closest("a") ||
          target.closest("button") ||
          target.classList.contains("cursor-pointer")
      );
      
      if (hovering !== isHovering) {
        isHovering = hovering;
        const newScale = isHovering ? 1.5 : 1;
        if (innerRef.current) innerRef.current.style.transform = `scale(${newScale})`;
        if (outerRef.current) outerRef.current.style.transform = `scale(${isHovering ? 2 : 1})`;
        if (outerRef.current) outerRef.current.style.opacity = isHovering ? '0.5' : '0.3';
      }
    };

    window.addEventListener("mousemove", moveCursor, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div
        ref={innerRef}
        className="fixed top-0 left-0 w-4 h-4 bg-primary rounded-full pointer-events-none z-[9999] mix-blend-difference will-change-transform"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          transition: 'transform 0.15s ease',
        }}
      />
      <motion.div
        ref={outerRef}
        className="fixed top-0 left-0 w-10 h-10 border border-primary/50 rounded-full pointer-events-none z-[9998] will-change-transform"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          opacity: 0.3,
          transition: 'transform 0.15s ease, opacity 0.15s ease',
        }}
      />
    </>
  );
}
