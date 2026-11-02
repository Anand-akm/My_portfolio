"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Mail, Database, Cloud, BarChart3, Terminal, Cpu, Mic } from "lucide-react";
import { Github, Linkedin, Twitter } from "@/components/ui/brand-icons";
import { Button } from "@/components/ui/button";
import { siteConfig, heroStats, taglines } from "@/data/content";
import { Mascot } from "@/components/ui/Mascot";

export function Hero() {
  const [typedText, setTypedText] = useState("");
  const [taglineIndex, setTaglineIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const currentTagline = taglines[taglineIndex];
    let index = 0;
    const interval = setInterval(() => {
      if (index < currentTagline.length) {
        setTypedText(currentTagline.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 40);
    
    return () => clearInterval(interval);
  }, [taglineIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % taglines.length);
      setTypedText("");
    }, 5000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <section ref={containerRef} id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <AnimatedBackground />
      
      <motion.div style={{ y, opacity }} className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-black mb-4 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Hi, I&apos;m
              </motion.span>
              <motion.span
                className="block text-gradient glow-text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                Anand Kumar Mishra
              </motion.span>
            </motion.h1>

            <motion.div
              className="h-10 md:h-14 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <p className="text-xl md:text-2xl lg:text-3xl font-semibold">
                <span className="text-gradient">{typedText}</span>
                <span className="inline-block w-0.5 h-6 md:h-8 ml-1 bg-primary animate-typing-cursor" />
              </p>
            </motion.div>

            <motion.p
              className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              AWS Certified Data Engineer specializing in building scalable data pipelines, 
              real-time streaming systems, and AI-ready analytics infrastructure.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                <Button asChild size="xl" className="group gap-2 ripple">
                  <Link href="/ai">
                    <Mic className="w-5 h-5" />
                    Talk to Anand AI
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                <Button asChild size="xl" variant="outline" className="gap-2 ripple">
                  <a href="#projects">
                    View Projects
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="flex items-center justify-center lg:justify-start gap-4 mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <SocialButton href={siteConfig.social.github} icon={<Github className="w-5 h-5" />} label="GitHub" />
              <SocialButton href={siteConfig.social.linkedin} icon={<Linkedin className="w-5 h-5" />} label="LinkedIn" />
              <SocialButton href={siteConfig.social.twitter} icon={<Twitter className="w-5 h-5" />} label="Twitter" />
              <SocialButton href={`mailto:${siteConfig.social.email}`} icon={<Mail className="w-5 h-5" />} label="Email" />
            </motion.div>

            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              {heroStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="relative text-center glass p-4 rounded-xl hover-glow overflow-hidden"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className="text-2xl md:text-3xl font-bold text-gradient">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex items-center justify-center order-first lg:order-last"
          >
            <FloatingElements>
              <Mascot />
            </FloatingElements>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="w-8 h-14 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-3 animate-pulse-slow">
            <div className="w-1.5 h-3 bg-gradient-to-b from-primary to-accent rounded-full animate-bounce-slow" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function AnimatedBackground() {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div 
        className="absolute inset-0 grid-bg-animated opacity-40 gpu-accelerated"
        style={{ scale }}
      />
      
      <div className="absolute inset-0 radial-glow" />
      
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/15 rounded-full blur-[80px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/15 rounded-full blur-[80px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '4s' }} />
      
      <DataStreamBackground />
      <FloatingDataIcons />
      <ScanlineEffect />
      <GlowingGridLines />
    </div>
  );
}

function ScanlineEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-10">
      <div
        className="absolute inset-0"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(59, 130, 246, 0.03) 2px, rgba(59, 130, 246, 0.03) 4px)',
        }}
      />
    </div>
  );
}

function GlowingGridLines() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
      <defs>
        <linearGradient id="glowLineX" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
          <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[20, 40, 60, 80].map((pos, i) => (
        <line
          key={`h-${i}`}
          x1="0"
          y1={`${pos}%`}
          x2="100%"
          y2={`${pos}%`}
          stroke="url(#glowLineX)"
          strokeWidth="1"
          opacity="0.2"
        />
      ))}
      {[20, 40, 60, 80].map((pos, i) => (
        <line
          key={`v-${i}`}
          x1={`${pos}%`}
          y1="0"
          x2={`${pos}%`}
          y2="100%"
          stroke="url(#glowLineX)"
          strokeWidth="1"
          opacity="0.2"
        />
      ))}
    </svg>
  );
}

function DataStreamBackground() {
  const streams = [
    { delay: 0, x: 15, duration: 8 },
    { delay: 2, x: 37, duration: 10 },
    { delay: 4, x: 59, duration: 7 },
    { delay: 1, x: 81, duration: 9 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden opacity-15">
      {streams.map((stream, i) => (
        <div
          key={i}
          className="absolute w-0.5 h-full bg-gradient-to-b from-transparent via-primary to-transparent animate-data-stream"
          style={{
            left: `${stream.x}%`,
            '--stream-duration': `${stream.duration}s`,
            '--stream-delay': `${stream.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

function FloatingDataIcons() {
  const icons = [
    { Icon: Database, label: "Data", x: "15%", y: "25%" },
    { Icon: Cloud, label: "Cloud", x: "80%", y: "20%" },
    { Icon: BarChart3, label: "Analytics", x: "5%", y: "70%" },
  ];

  return (
    <>
      {icons.map((icon, i) => (
        <div
          key={i}
          className="absolute hidden md:flex items-center gap-2 glass px-4 py-2 rounded-lg will-change-transform"
          style={{
            left: icon.x,
            top: icon.y,
            animation: `float ${5 + i}s ease-in-out infinite ${i}s`,
          }}
        >
          <icon.Icon className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-primary">{icon.label}</span>
        </div>
      ))}
    </>
  );
}

function FloatingElements({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="absolute -inset-20 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-full blur-3xl animate-spin-slow" />
      <div
        className="relative will-change-transform"
        style={{ animation: 'float 4s ease-in-out infinite' }}
      >
        {children}
      </div>
      
      <FloatingLaptops />
      <HoloTerminal />
      <TechParticles />
      <DashboardCards />
    </div>
  );
}

function FloatingLaptops() {
  return (
    <>
      <div
        className="absolute -top-20 -left-20 md:-left-32 w-20 h-14 md:w-28 md:h-20 glass rounded-lg border border-primary/30 will-change-transform"
        style={{ animation: 'float 5s ease-in-out infinite' }}
      >
        <div className="w-full h-full bg-black/60 rounded-lg overflow-hidden relative flex items-center justify-center">
          <span className="text-[8px] md:text-[10px] font-mono text-primary">def process():</span>
        </div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-primary to-secondary rounded-full opacity-50" />
      </div>

      <div
        className="absolute top-10 -right-16 md:-right-28 w-24 h-16 md:w-32 md:h-22 glass rounded-lg border border-secondary/30 will-change-transform"
        style={{ animation: 'float 6s ease-in-out infinite 1s' }}
      >
        <div className="w-full h-full bg-black/60 rounded-lg overflow-hidden p-2">
          <div className="text-[6px] md:text-[8px] font-mono text-green-400 space-y-0.5">
            <div>SELECT * FROM</div>
            <div>analytics.pipeline</div>
            <div>WHERE status=&apos;active&apos;;</div>
          </div>
        </div>
      </div>

      <div
        className="absolute -bottom-16 -right-8 md:right-0 w-16 h-12 md:w-20 md:h-14 glass rounded-lg border border-accent/30 will-change-transform"
        style={{ animation: 'float 4s ease-in-out infinite 2s' }}
      >
        <div className="w-full h-full bg-black/60 rounded-lg overflow-hidden flex items-center justify-center">
          <Database className="w-6 h-6 md:w-8 md:h-8 text-cyan-400" />
        </div>
      </div>
    </>
  );
}

function HoloTerminal() {
  const [lines, setLines] = useState<string[]>([]);
  const lineIndexRef = useRef(0);
  const charIndexRef = useRef(0);

  useEffect(() => {
    const terminalCommands = [
      "> deploying pipeline...",
      "> training ai model...",
      "> kubernetes cluster active...",
      "> syncing snowflake data...",
      "> kafka stream connected...",
      "> building etl workflow...",
    ];

    const typeInterval = setInterval(() => {
      const currentCmd = terminalCommands[lineIndexRef.current % terminalCommands.length];
      
      if (charIndexRef.current < currentCmd.length) {
        charIndexRef.current++;
        setLines(prev => {
          const newLines = [...prev];
          if (newLines.length > 0) {
            newLines[newLines.length - 1] = currentCmd.slice(0, charIndexRef.current);
          }
          return [...newLines];
        });
      } else {
        setLines(prev => [...prev.slice(-4), currentCmd]);
        charIndexRef.current = 0;
        lineIndexRef.current = (lineIndexRef.current + 1) % terminalCommands.length;
      }
    }, 80);
    
    return () => clearInterval(typeInterval);
  }, []);

  return (
    <div
      className="absolute -bottom-28 -left-4 md:left-8 w-40 md:w-52 glass rounded-lg border border-green-500/30 overflow-hidden"
    >
      <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 border-b border-green-500/20">
        <div className="w-2 h-2 rounded-full bg-red-500" />
        <div className="w-2 h-2 rounded-full bg-yellow-500" />
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="ml-1 text-[8px] md:text-[10px] text-green-400 font-mono flex items-center gap-1">
          <Terminal className="w-3 h-3" />
          terminal
        </span>
      </div>
      <div className="p-2 h-20 md:h-24 overflow-hidden font-mono text-[8px] md:text-[10px]">
        {lines.map((line, i) => (
          <div key={i} className="text-green-400/80">
            {line}
          </div>
        ))}
        <div className="text-green-400">
          <span className="inline-block w-2 h-3 bg-green-400 ml-0.5 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function TechParticles() {
  const particlePositions = [
    { x: 10, y: 20 }, { x: 50, y: 15 }, { x: 70, y: 60 },
    { x: 85, y: 30 }, { x: 45, y: 55 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particlePositions.map((pos, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-primary rounded-full will-change-transform"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            animation: `float ${4 + i * 0.5}s ease-in-out infinite ${i * 0.3}s`,
          }}
        />
      ))}
    </div>
  );
}

function DashboardCards() {
  return (
    <>
      <div
        className="absolute top-0 -right-4 md:right-4 w-16 h-12 md:w-20 md:h-14 glass rounded-lg border border-cyan-500/20 will-change-transform"
        style={{ animation: 'float 3s ease-in-out infinite' }}
      >
        <div className="p-2 h-full flex flex-col justify-between">
          <div className="flex items-center gap-1">
            <Cpu className="w-3 h-3 text-cyan-400" />
            <span className="text-[8px] text-cyan-400">CPU</span>
          </div>
          <div className="flex items-end gap-0.5 h-6">
            {[60, 80, 45, 90, 70, 55, 85].map((h, i) => (
              <div
                key={i}
                className="w-1.5 bg-gradient-to-t from-cyan-500 to-cyan-300 rounded-sm"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      <div
        className="absolute top-16 -left-12 md:left-0 w-14 h-10 md:w-16 md:h-12 glass rounded-lg border border-purple-500/20 will-change-transform"
        style={{ animation: 'float 4s ease-in-out infinite 0.5s' }}
      >
        <div className="p-1.5 h-full flex flex-col justify-center">
          <div className="text-[8px] text-purple-400 mb-1">DATA</div>
          <div className="flex gap-1">
            <div className="h-1 flex-1 bg-gradient-to-r from-purple-500 to-purple-300 rounded-full" style={{ width: "50%" }} />
          </div>
          <div className="flex gap-1 mt-1">
            <div className="h-1 flex-1 bg-gradient-to-r from-purple-500 to-purple-300 rounded-full" style={{ width: "40%" }} />
          </div>
        </div>
      </div>
    </>
  );
}

function SocialButton({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative w-12 h-12 flex items-center justify-center rounded-xl glass group hover:bg-primary/20 transition-all"
      whileHover={{ y: -6, scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={label}
    >
      <span className="text-muted-foreground group-hover:text-primary transition-colors relative z-10">
        {icon}
      </span>
    </motion.a>
  );
}
