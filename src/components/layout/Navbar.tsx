"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Terminal, Home, User, Code2, FolderKanban, Award, Mail, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navItems, siteConfig } from "@/data/content";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTerminalMode, setIsTerminalMode] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const sections = ["hero", ...navItems.map(item => item.href.replace("#", ""))];
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element && window.scrollY >= element.offsetTop - 200) {
          setActiveSection(section);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "`" && e.metaKey) {
        e.preventDefault();
        setIsTerminalMode(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? "glass py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <motion.a
            href="#hero"
            className="text-xl md:text-2xl font-bold relative group"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-gradient">{siteConfig.name}</span>
            <motion.span
              className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent"
              whileHover={{ width: "100%" }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="absolute -inset-1 bg-primary/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity -z-10"
            />
          </motion.a>
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 ml-3 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-medium"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Available for opportunities
          </motion.span>

          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item, i) => (
              <motion.a
                key={item.name}
                href={item.href}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeSection === item.href.replace("#", "")
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -2, scale: 1.05 }}
              >
                {item.name}
                {activeSection === item.href.replace("#", "") && (
                  <motion.span
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                    layoutId="nav-dot"
                  />
                )}
              </motion.a>
            ))}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsTerminalMode(true)}
                className="gap-2 ml-4"
              >
                <Terminal className="w-4 h-4" />
                <span className="hidden md:inline">Terminal</span>
                <kbd className="hidden md:inline text-xs bg-muted px-1.5 py-0.5 rounded ml-1">⌘`</kbd>
              </Button>
            </motion.div>
          </div>

          <motion.button
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg glass"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </motion.button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-y-0 right-0 w-80 glass z-50 lg:hidden"
          >
            <div className="flex flex-col h-full p-6">
              <button
                className="self-end mb-8 p-2 rounded-lg hover:bg-white/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X />
              </button>
              <div className="flex flex-col gap-2">
                {navItems.map((item, i) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    className={`px-4 py-3 rounded-xl text-lg font-medium transition-all ${
                      activeSection === item.href.replace("#", "")
                        ? "bg-primary/20 text-primary"
                        : "hover:bg-white/5"
                    }`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </motion.a>
                ))}
              </div>
              <div className="mt-auto">
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => {
                    setIsTerminalMode(true);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Terminal className="w-4 h-4" />
                  Terminal Mode
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <FloatingDock />
      
      <AnimatePresence>
        {isTerminalMode && <TerminalModal onClose={() => setIsTerminalMode(false)} />}
      </AnimatePresence>
    </>
  );
}

const dockItems = [
  { icon: Home, label: "Home", href: "#hero" },
  { icon: User, label: "About", href: "#about" },
  { icon: Code2, label: "Skills", href: "#skills" },
  { icon: FolderKanban, label: "Projects", href: "#projects" },
  { icon: Award, label: "Certifications", href: "#certifications" },
  { icon: Mail, label: "Contact", href: "#contact" },
];

function FloatingDock() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 hidden md:block"
        >
          <motion.div
            className="flex items-center gap-2 px-4 py-3 rounded-2xl glass border border-white/10"
            whileHover={{ scale: 1.05 }}
          >
            {dockItems.map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                className="relative w-10 h-10 flex items-center justify-center rounded-xl transition-all"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                whileHover={{ y: -8 }}
                whileTap={{ scale: 0.9 }}
              >
                <item.icon className={`w-5 h-5 transition-colors ${
                  hoveredIndex === i ? "text-primary" : "text-muted-foreground"
                }`} />
                {hoveredIndex === i && (
                  <motion.span
                    className="absolute -top-10 px-3 py-1.5 rounded-lg glass text-xs font-medium whitespace-nowrap"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TerminalModal({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState([
    { type: "system", text: "┌──────────────────────────────────────────────┐" },
    { type: "system", text: "│  🚀 ANAND'S DATA TERMINAL v1.0               │" },
    { type: "system", text: "│  Type 'help' for available commands          │" },
    { type: "system", text: "└──────────────────────────────────────────────┘" },
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const handleCommand = (cmd: string) => {
    const command = cmd.toLowerCase();
    let response: { type: string; text: string }[] = [];

    switch (command) {
      case "help":
        response = [
          { type: "info", text: "Available commands:" },
          { type: "info", text: "  help       - Show this help message" },
          { type: "info", text: "  about      - Learn about Anand" },
          { type: "info", text: "  skills     - View technical skills" },
          { type: "info", text: "  projects   - See featured projects" },
          { type: "info", text: "  certs      - View certifications" },
          { type: "info", text: "  github     - Open GitHub profile" },
          { type: "info", text: "  linkedin   - Open LinkedIn profile" },
          { type: "info", text: "  whoami     - Display user info" },
          { type: "info", text: "  clear      - Clear terminal" },
        ];
        break;
      case "about":
        response = [
          { type: "success", text: "┌──────────────────────────────────────────────┐" },
          { type: "success", text: "│  👤 Anand Kumar Mishra                        │" },
          { type: "success", text: "│  💼 Data Engineer & Analyst                   │" },
          { type: "success", text: "│  ☁️  AWS Certified Data Engineer Associate     │" },
          { type: "success", text: "│  🛠️  ETL, Kafka, Snowflake, Power BI           │" },
          { type: "success", text: "└──────────────────────────────────────────────┘" },
        ];
        break;
      case "skills":
        response = [
          { type: "info", text: "┌──────────────────────────────────────────────┐" },
          { type: "info", text: "│  PROGRAMMING:   Python, SQL, JavaScript       │" },
          { type: "info", text: "│  DATA ENG:      Kafka, Spark, Pandas, Airflow │" },
          { type: "info", text: "│  CLOUD:         AWS, Azure, Snowflake         │" },
          { type: "info", text: "│  VISUALIZATION: Power BI, Tableau, DAX        │" },
          { type: "info", text: "│  DEVOPS:        Docker, K8s, Git, CI/CD      │" },
          { type: "info", text: "└──────────────────────────────────────────────┘" },
        ];
        break;
      case "projects":
        response = [
          { type: "info", text: "┌──────────────────────────────────────────────┐" },
          { type: "info", text: "│  1. Stock Market Kafka Pipeline - Data Eng   │" },
          { type: "info", text: "│  2. Netflix Analytics - DBT/Snowflake        │" },
          { type: "info", text: "│  3. IPL Dashboard - Power BI/DAX              │" },
          { type: "info", text: "│  4. Churn Analysis - ML + BI                 │" },
          { type: "info", text: "└──────────────────────────────────────────────┘" },
        ];
        break;
      case "certs":
        response = [
          { type: "info", text: "┌──────────────────────────────────────────────┐" },
          { type: "info", text: "│  🟠 AWS Certified Data Engineer - Associate  │" },
          { type: "info", text: "│  🔵 Microsoft Azure Security Engineer        │" },
          { type: "info", text: "│  ❄️  Snowflake - The Complete Masterclass    │" },
          { type: "info", text: "│  🟠 AWS Solutions Architect Associate        │" },
          { type: "info", text: "│  🟣 Docker & Kubernetes                      │" },
          { type: "info", text: "└──────────────────────────────────────────────┘" },
        ];
        break;
      case "whoami":
        response = [
          { type: "info", text: "anand@ai-engineer" },
          { type: "info", text: "AI Engineer | Python | AWS | Cloud Deployment" },
        ];
        break;
      case "github":
        window.open("https://github.com/Anand-akm", "_blank");
        response = [{ type: "success", text: "Opening GitHub profile..." }];
        break;
      case "linkedin":
        window.open("https://linkedin.com/in/anandmishra79", "_blank");
        response = [{ type: "success", text: "Opening LinkedIn profile..." }];
        break;
      case "clear":
        setOutput([]);
        return;
      default:
        response = [{ type: "error", text: `Command not found: ${cmd}. Type 'help' for available commands.` }];
    }

    setOutput((prev) => [...prev, { type: "input", text: `anand@data:~$ ${cmd}` }, ...response]);
    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (input.trim()) {
        handleCommand(input);
        setInput("");
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        setHistoryIndex((prev) => prev + 1);
        setInput(commandHistory[commandHistory.length - 1 - historyIndex - 1]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        setHistoryIndex((prev) => prev - 1);
        setInput(commandHistory[commandHistory.length - 1 - historyIndex + 1]);
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-3xl bg-card border rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-sm font-mono text-muted-foreground flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              anand@data:~$
            </span>
          </div>
          <motion.button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>
        
        <div className="h-[28rem] overflow-y-auto p-4 font-mono text-sm bg-black/50">
          {output.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-1 ${
                line.type === "error"
                  ? "text-red-500"
                  : line.type === "success"
                  ? "text-green-500"
                  : line.type === "input"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {line.text}
            </motion.div>
          ))}
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); if (input.trim()) handleCommand(input); setInput(""); }} className="flex items-center gap-2 p-4 border-t bg-muted/50">
          <motion.span
            className="text-primary font-mono animate-pulse"
            animate={{ opacity: [1, 0.5, 1] }}
          >
            $
          </motion.span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none font-mono text-foreground placeholder:text-muted-foreground"
            placeholder="Type a command... (try 'help' or 'whoami')"
            autoFocus
          />
        </form>
      </motion.div>
    </motion.div>
  );
}