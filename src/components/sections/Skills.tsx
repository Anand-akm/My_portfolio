"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Code, Server, Cloud, Database, Palette, Terminal, GitBranch, Box, Sparkles, Brain, Bot, Cpu, Wand2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { skills } from "@/data/content";

const categories = [
  { id: "programming", label: "Programming", icon: Code, color: "from-blue-500 to-cyan-500" },
  { id: "dataEngineering", label: "Data Engineering", icon: Server, color: "from-purple-500 to-pink-500" },
  { id: "cloud", label: "Cloud & Data", icon: Cloud, color: "from-orange-500 to-yellow-500" },
  { id: "visualization", label: "Visualization", icon: Palette, color: "from-green-500 to-emerald-500" },
  { id: "databases", label: "Databases", icon: Database, color: "from-red-500 to-rose-500" },
  { id: "devops", label: "DevOps", icon: Box, color: "from-cyan-500 to-blue-500" },
  { id: "aiTools", label: "AI Tools", icon: Sparkles, color: "from-violet-500 to-purple-500", isAI: true },
];

const skillEmojis: Record<string, string> = {
  Python: "🐍",
  SQL: "📊",
  JavaScript: "🟨",
  DBT: "🔧",
  "Apache Kafka": "📨",
  "Apache Spark": "⚡",
  Pandas: "🐼",
  NumPy: "🔢",
  Airflow: "💨",
  "ETL/ELT": "🔄",
  AWS: "☁️",
  Azure: "⛅",
  Snowflake: "❄️",
  Docker: "🐳",
  Kubernetes: "☸️",
  PostgreSQL: "🐘",
  MySQL: "🐬",
  "AWS RDS": "🗄️",
  "AWS Athena": "🔍",
  MongoDB: "🍃",
  Redis: "🔴",
  "Power BI": "📈",
  Tableau: "📉",
  Excel: "📋",
  DAX: "🧮",
  "Power Query": "⚙️",
  Git: "📦",
  Linux: "🐧",
  "CI/CD": "🔁",
  Terraform: "🏗️",
  Claude: "🤖",
  ChatGPT: "💬",
  "GitHub Copilot": "⚡",
  Gemini: "🌟",
  "Cursor AI": "🎯",
  "Hugging Face": "🤗",
  LangChain: "🔗",
  "OpenAI API": "🧠",
  "Vercel AI SDK": "▲",
  "Perplexity AI": "🔎",
};

export function Skills() {
  const [activeCategory, setActiveCategory] = useState("programming");
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const activeCat = categories.find(c => c.id === activeCategory) || categories[0];
  const categorySkills = skills[activeCategory as keyof typeof skills] || [];

  return (
    <section id="skills" className="py-24 relative">
      <div className="absolute inset-0 dot-grid opacity-10" />
      
      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Tech <span className="text-gradient">Arsenal</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A comprehensive toolkit for building modern data engineering solutions.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-3 rounded-full font-medium text-sm transition-all flex items-center gap-2 relative ${
                activeCategory === cat.id
                  ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                  : "glass hover:bg-white/10"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {(cat as any).isAI && (
                <motion.span
                  className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
              <cat.icon className={`w-4 h-4 ${(cat as any).isAI ? 'text-purple-300' : ''}`} />
              {cat.label}
              {(cat as any).isAI && (
                <motion.span
                  className="ml-1 px-1.5 py-0.5 text-[10px] bg-purple-500/30 rounded-full"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  AI
                </motion.span>
              )}
            </motion.button>
          ))}
        </div>

<motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
              layout
            >
              {categorySkills.map((skill, i) => {
                const isAI = activeCategory === "aiTools";
                return (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    layout
                    onHoverStart={() => setHoveredSkill(skill)}
                    onHoverEnd={() => setHoveredSkill(null)}
                  >
                    <Card className={`p-5 glass-hover group cursor-pointer relative overflow-hidden h-full ${isAI ? 'ai-skill-card' : ''}`}>
                      {isAI && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                          animate={{
                            background: ["linear-gradient(90deg, rgba(139,92,246,0.1) 0%, transparent 50%, rgba(139,92,246,0.1) 100%)", 
                                         "linear-gradient(270deg, rgba(139,92,246,0.1) 0%, transparent 50%, rgba(139,92,246,0.1) 100%)"] 
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                      
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-br ${isAI ? 'from-violet-500/20 to-purple-500/20' : activeCat.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                      />

                      {isAI && (
                        <motion.div
                          className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-purple-400"
                          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                        />
                      )}
                      
                      <div className="relative z-10 text-center">
                        <motion.div
                          className="text-3xl mb-3"
                          animate={hoveredSkill === skill ? { scale: 1.2, rotate: [0, 5, -5, 0] } : {}}
                          transition={{ duration: 0.3 }}
                        >
                          {skillEmojis[skill] || "💻"}
                        </motion.div>
                        <p className="font-medium text-sm">{skill}</p>
                        <Badge
                          variant="outline"
                          className={`mt-3 text-xs opacity-0 group-hover:opacity-100 transition-opacity ${isAI ? 'border-purple-500/50 text-purple-300' : ''}`}
                        >
                          {activeCat.label}
                        </Badge>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {[
              { value: "20+", label: "Technologies", color: "from-blue-500 to-cyan-500" },
              { value: "10+", label: "Data Tools", color: "from-purple-500 to-pink-500" },
              { value: "10+", label: "AI Tools", color: "from-violet-500 to-purple-500" },
              { value: "5", label: "Certifications", color: "from-orange-500 to-yellow-500" },
              { value: "∞", label: "Learning", color: "from-green-500 to-emerald-500" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className={`p-5 glass rounded-2xl ${stat.label === 'AI Tools' ? 'ai-stats-card' : ''}`}
                whileHover={{ scale: 1.05 }}
              >
                <div className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}