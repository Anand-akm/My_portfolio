"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, Terminal } from "lucide-react";

const commands = [
  { id: "about", label: "About", description: "Learn about Anand", icon: "👤" },
  { id: "skills", label: "Skills", description: "View technical skills", icon: "💻" },
  { id: "projects", label: "Projects", description: "See featured projects", icon: "🚀" },
  { id: "experience", label: "Experience", description: "Work history", icon: "💼" },
  { id: "certifications", label: "Certifications", description: "Professional certs", icon: "🏆" },
  { id: "contact", label: "Contact", description: "Get in touch", icon: "📧" },
];

export function CommandMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        handleSelect(filteredCommands[selectedIndex].id);
      }
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 glass px-4 py-3 rounded-full flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group"
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">Command Menu</span>
        <kbd className="hidden sm:inline text-xs bg-muted px-2 py-1 rounded group-hover:bg-primary/20">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4"
            onClick={() => setIsOpen(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-xl bg-card border rounded-xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 px-4 py-4 border-b">
                <Search className="w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search commands..."
                  className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                  autoFocus
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto p-2">
                {filteredCommands.map((cmd, i) => (
                  <button
                    key={cmd.id}
                    onClick={() => handleSelect(cmd.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      selectedIndex === i
                        ? "bg-primary/20 text-primary"
                        : "hover:bg-muted"
                    }`}
                    onMouseEnter={() => setSelectedIndex(i)}
                  >
                    <span className="text-xl">{cmd.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium">{cmd.label}</div>
                      <div className="text-sm text-muted-foreground">{cmd.description}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                ))}

                {filteredCommands.length === 0 && (
                  <div className="px-4 py-8 text-center text-muted-foreground">
                    No commands found
                  </div>
                )}
              </div>

              <div className="px-4 py-3 border-t bg-muted/50 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span>↑↓ Navigate</span>
                  <span>↵ Select</span>
                  <span>Esc Close</span>
                </div>
                <div className="flex items-center gap-2">
                  <Terminal className="w-3 h-3" />
                  <span>Try: ` + click to open terminal mode</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}