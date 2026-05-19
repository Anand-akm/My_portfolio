"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, Download, Github, Linkedin, Twitter, Mail, Play, Sparkles, Database, Cloud, BarChart3, Terminal, Cpu, GitBranch, Box, Activity, Zap, Server, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig, heroStats, taglines } from "@/data/content";
import { Mascot } from "@/components/ui/Mascot";

const terminalCommands = [
  "> deploying pipeline...",
  "> training ai model...",
  "> kubernetes cluster active...",
  "> syncing snowflake data...",
  "> kafka stream connected...",
  "> building etl workflow...",
];

export function Hero() {
  const [mounted, setMounted] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
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
  }, [mounted, taglineIndex]);

  useEffect(() => {
    if (!mounted) return;
    
    const timer = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % taglines.length);
      setTypedText("");
    }, 5000);
    
    return () => clearInterval(timer);
  }, [mounted]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <section ref={containerRef} id="hero-container" className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
                <motion.span
                  className="inline-block w-0.5 h-6 md:h-8 ml-1 bg-primary"
                  animate={{ opacity: showCursor ? 1 : 0 }}
                />
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
              <MagneticButton>
                <Button size="xl" className="group gap-2 ripple">
                  View Projects
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.div>
                </Button>
              </MagneticButton>
              <MagneticButton>
                <Button size="xl" variant="outline" className="gap-2 ripple">
                  <Download className="w-5 h-5" />
                  Resume
                </Button>
              </MagneticButton>
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
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                  />
                  <div className="absolute inset-0 rounded-xl animate-border" style={{
                    background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)',
                    backgroundSize: '200% 100%',
                  }} />
                  <motion.div
                    className="text-2xl md:text-3xl font-bold text-gradient"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 + i * 0.1 }}
                  >
                    {stat.value}
                  </motion.div>
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
          <motion.div
            className="w-8 h-14 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-3"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1.5 h-3 bg-gradient-to-b from-primary to-accent rounded-full"
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
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
        className="absolute inset-0 grid-bg-animated opacity-40"
        style={{ scale }}
      />
      
      <div className="absolute inset-0 radial-glow" />
      
      <motion.div
        className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[128px]"
        animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/20 rounded-full blur-[128px]"
        animate={{ x: [0, -50, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[180px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      
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
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(59, 130, 246, 0.03) 2px, rgba(59, 130, 246, 0.03) 4px)',
        }}
        animate={{ backgroundPositionY: ["0px", "4px"] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"
        animate={{ y: ["-100%", "100%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

function GlowingGridLines() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      <defs>
        <linearGradient id="glowLineX" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
          <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[20, 40, 60, 80].map((pos, i) => (
        <motion.line
          key={`h-${i}`}
          x1="0"
          y1={`${pos}%`}
          x2="100%"
          y2={`${pos}%`}
          stroke="url(#glowLineX)"
          strokeWidth="1"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}
      {[20, 40, 60, 80].map((pos, i) => (
        <motion.line
          key={`v-${i}`}
          x1={`${pos}%`}
          y1="0"
          x2={`${pos}%`}
          y2="100%"
          stroke="url(#glowLineX)"
          strokeWidth="1"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 + 0.5 }}
        />
      ))}
    </svg>
  );
}

function DataStreamBackground() {
  const streams = Array.from({ length: 8 }).map((_, i) => ({
    delay: i * 0.5,
    x: 10 + i * 12,
    duration: 4 + i * 0.5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      {streams.map((stream, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 h-full bg-gradient-to-b from-transparent via-primary to-transparent"
          style={{ left: `${stream.x}%` }}
          animate={{
            opacity: [0, 0.5, 0],
            y: ["0%", "100%"],
          }}
          transition={{
            duration: stream.duration,
            repeat: Infinity,
            delay: stream.delay,
            ease: "linear",
          }}
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
        <motion.div
          key={i}
          className="absolute hidden md:flex items-center gap-2 glass px-4 py-2 rounded-lg"
          style={{ left: icon.x, top: icon.y }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 3, -3, 0],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: i,
          }}
        >
          <icon.Icon className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-primary">{icon.label}</span>
        </motion.div>
      ))}
    </>
  );
}

function FloatingElements({ children }: { children: React.ReactNode }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 300 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = document.getElementById('hero-container');
      if (rect) {
        const bounds = rect.getBoundingClientRect();
        mouseX.set(e.clientX - bounds.left - bounds.width / 2);
        mouseY.set(e.clientY - bounds.top - bounds.height / 2);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="relative">
      <motion.div
        className="absolute -inset-20 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-full blur-3xl"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ x: springX, y: springY }}
      />
      <motion.div
        className="relative"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ x: springX, y: springY }}
      >
        {children}
      </motion.div>
      
      <FloatingLaptops />
      <HoloTerminal />
      <TechParticles />
      <NetworkLines />
      <DashboardCards />
      <DroneBot />
      <FloatingLabels />
    </div>
  );
}

function FloatingLaptops() {
  const [isOpen, setIsOpen] = useState(true);
  
  useEffect(() => {
    const interval = setInterval(() => setIsOpen(prev => !prev), 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <motion.div
        className="absolute -top-20 -left-20 md:-left-32 w-20 h-14 md:w-28 md:h-20 glass rounded-lg border border-primary/30"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
          x: [0, 10, 0],
        }}
        transition={{ duration: 5, repeat: Infinity, delay: 0 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="w-full h-full bg-black/60 rounded-lg overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <CodeSnippet />
          </div>
        </div>
        <motion.div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      <motion.div
        className="absolute top-10 -right-16 md:-right-28 w-24 h-16 md:w-32 md:h-22 glass rounded-lg border border-secondary/30"
        animate={{
          y: [0, 15, 0],
          rotate: [0, -8, 0],
          x: [0, -8, 0],
        }}
        transition={{ duration: 6, repeat: Infinity, delay: 1 }}
      >
        <motion.div
          className="w-full h-full bg-black/60 rounded-lg overflow-hidden"
          animate={{ rotateX: isOpen ? 0 : 60 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          style={{ transformOrigin: 'bottom' }}
        >
          <div className="absolute inset-0 p-2">
            <div className="text-[6px] md:text-[8px] font-mono text-green-400">
              <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                SELECT * FROM
              </motion.div>
              <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}>
                analytics.pipeline
              </motion.div>
              <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}>
                WHERE status = &apos;active&apos;;
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute -bottom-16 -right-8 md:right-0 w-16 h-12 md:w-20 md:h-14 glass rounded-lg border border-accent/30"
        animate={{
          y: [0, -12, 0],
          rotate: [0, 10, 0],
        }}
        transition={{ duration: 4, repeat: Infinity, delay: 2 }}
      >
        <div className="w-full h-full bg-black/60 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <Database className="w-6 h-6 md:w-8 md:h-8 text-cyan-400" />
          </div>
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </>
  );
}

function CodeSnippet() {
  const snippets = ['def process():', '  return data', '{ "ai": true }'];
  const [idx, setIdx] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => setIdx(prev => (prev + 1) % snippets.length), 2000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <motion.span
      key={idx}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-[8px] md:text-[10px] font-mono text-primary"
    >
      {snippets[idx]}
    </motion.span>
  );
}

function HoloTerminal() {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  
  useEffect(() => {
    const typeInterval = setInterval(() => {
      const currentCmd = terminalCommands[lineIndex % terminalCommands.length];
      
      if (charIndex < currentCmd.length) {
        setCurrentLine(currentCmd.slice(0, charIndex + 1));
        setCharIndex(prev => prev + 1);
      } else {
        setLines(prev => [...prev, currentCmd]);
        setCurrentLine("");
        setCharIndex(0);
        setLineIndex(prev => (prev + 1) % terminalCommands.length);
      }
    }, 50);
    
    return () => clearInterval(typeInterval);
  }, [charIndex, lineIndex]);

  return (
    <motion.div
      className="absolute -bottom-28 -left-4 md:left-8 w-40 md:w-52 glass rounded-lg border border-green-500/30 overflow-hidden"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1 }}
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
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-green-400/80"
          >
            {line}
          </motion.div>
        ))}
        {currentLine && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-400"
          >
            {currentLine}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="inline-block w-2 h-3 bg-green-400 ml-0.5"
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function TechParticles() {
  const particlePositions = [
    { x: 10, y: 20 }, { x: 25, y: 45 }, { x: 40, y: 15 }, { x: 55, y: 60 },
    { x: 70, y: 30 }, { x: 85, y: 75 }, { x: 15, y: 80 }, { x: 30, y: 55 },
    { x: 50, y: 40 }, { x: 65, y: 85 }, { x: 80, y: 20 }, { x: 95, y: 50 },
    { x: 20, y: 70 }, { x: 45, y: 25 }, { x: 60, y: 90 }, { x: 75, y: 45 },
    { x: 5, y: 35 }, { x: 35, y: 65 }, { x: 90, y: 10 }, { x: 12, y: 55 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particlePositions.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary rounded-full"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, (i % 2 === 0 ? 25 : -25), 0],
            opacity: [0, 1, 0],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: 3 + (i % 3) * 0.5,
            repeat: Infinity,
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
}

function NetworkLines() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
          <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d="M 50 100 Q 150 150 250 100"
        stroke="url(#lineGradient)"
        strokeWidth="1"
        fill="none"
        animate={{
          strokeDashoffset: [0, 100],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.path
        d="M 30 200 Q 150 250 270 200"
        stroke="url(#lineGradient)"
        strokeWidth="1"
        fill="none"
        animate={{
          strokeDashoffset: [100, 0],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.path
        d="M 80 300 Q 150 280 220 300"
        stroke="url(#lineGradient)"
        strokeWidth="1"
        fill="none"
        animate={{
          strokeDashoffset: [0, 100],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
      />
    </svg>
  );
}

function DashboardCards() {
  return (
    <>
      <motion.div
        className="absolute top-0 -right-4 md:right-4 w-16 h-12 md:w-20 md:h-14 glass rounded-lg border border-cyan-500/20"
        animate={{
          y: [0, -8, 0],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <div className="p-2 h-full flex flex-col justify-between">
          <div className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-cyan-400" />
            <span className="text-[8px] text-cyan-400">CPU</span>
          </div>
          <div className="flex items-end gap-0.5 h-6">
            {[60, 80, 45, 90, 70, 55, 85].map((h, i) => (
              <motion.div
                key={i}
                className="w-1.5 bg-gradient-to-t from-cyan-500 to-cyan-300 rounded-sm"
                animate={{ height: [`${h/2}%`, `${h}%`, `${h/2}%`] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute top-16 -left-12 md:left-0 w-14 h-10 md:w-16 md:h-12 glass rounded-lg border border-purple-500/20"
        animate={{
          y: [0, 6, 0],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
      >
        <div className="p-1.5 h-full flex flex-col justify-center">
          <div className="text-[8px] text-purple-400 mb-1">DATA</div>
          <div className="flex gap-1">
            <motion.div
              className="h-1 flex-1 bg-gradient-to-r from-purple-500 to-purple-300 rounded-full"
              animate={{ width: ["20%", "80%", "20%"] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <div className="flex gap-1 mt-1">
            <motion.div
              className="h-1 flex-1 bg-gradient-to-r from-purple-500 to-purple-300 rounded-full"
              animate={{ width: ["60%", "30%", "60%"] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
          </div>
        </div>
      </motion.div>
    </>
  );
}

function DroneBot() {
  return (
    <motion.div
      className="absolute -top-8 right-8 md:right-16 w-8 h-8"
      animate={{
        x: [0, 20, 0],
        y: [0, -10, 0],
        rotate: [0, 10, -10, 0],
      }}
      transition={{ duration: 6, repeat: Infinity }}
    >
      <div className="relative w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full opacity-80 blur-sm" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Cpu className="w-4 h-4 text-white" />
        </div>
        <motion.div
          className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full"
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          style={{ boxShadow: '0 0 10px #22d3ee' }}
        />
        <motion.div
          className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full"
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
          style={{ boxShadow: '0 0 10px #22d3ee' }}
        />
        <motion.div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-1 bg-green-400 rounded-full"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
}

function FloatingLabels() {
  const labels = [
    { text: "AI Systems", icon: Cpu, x: "10%", y: "20%", delay: 0 },
    { text: "Data Engineering", icon: Database, x: "75%", y: "15%", delay: 1 },
    { text: "Cloud", icon: Cloud, x: "5%", y: "70%", delay: 0.5 },
    { text: "Analytics", icon: BarChart3, x: "80%", y: "60%", delay: 1.5 },
    { text: "Real-time", icon: Zap, x: "50%", y: "85%", delay: 2 },
  ];

  return (
    <>
      {labels.map((label, i) => (
        <motion.div
          key={i}
          className="absolute hidden md:flex items-center gap-2 glass px-3 py-1.5 rounded-full text-xs font-medium"
          style={{ left: label.x, top: label.y }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: label.delay + 0.5 }}
        >
          <label.icon className="w-3.5 h-3.5 text-primary" />
          <span className="text-primary/80">{label.text}</span>
        </motion.div>
      ))}
    </>
  );
}

function MagneticButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
      setPosition({ x, y });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className="relative"
        whileHover={{
          boxShadow: "0 0 30px rgba(59, 130, 246, 0.5), 0 0 60px rgba(139, 92, 246, 0.3)",
        }}
      >
        {children}
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s infinite',
          }}
        />
      </motion.div>
    </motion.div>
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
      <motion.div
        className="absolute inset-0 rounded-xl"
        whileHover={{
          boxShadow: "0 0 20px rgba(59, 130, 246, 0.4), inset 0 0 20px rgba(59, 130, 246, 0.1)",
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.span
        className="text-muted-foreground group-hover:text-primary transition-colors relative z-10"
        whileHover={{ scale: 1.2 }}
      >
        {icon}
      </motion.span>
      <motion.div
        className="absolute inset-0 rounded-xl border border-primary/30 opacity-0 group-hover:opacity-100"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.a>
  );
}