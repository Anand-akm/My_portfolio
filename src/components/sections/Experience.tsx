"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { experience } from "@/data/content";

export function Experience() {
  return (
    <section id="experience" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-secondary/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 grid-bg opacity-5" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Work <span className="text-gradient glow-text">Experience</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            My professional journey in AI, Data Engineering & Analytics
          </p>
        </motion.div>

        <div className="relative max-w-3xl mx-auto space-y-6">
          {experience.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex items-start gap-4 p-5 rounded-2xl glass border border-white/10 hover:border-primary/30 transition-all group">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                    {exp.logo}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-foreground">
                    {exp.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-semibold text-primary">{exp.company}</span>
                    {exp.isCurrent && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        Current
                      </span>
                    )}
                  </div>
                </div>

                <div className={`absolute left-6 w-2 h-2 rounded-full ${exp.isCurrent ? 'bg-green-500' : 'bg-primary'}`} 
                     style={{ boxShadow: exp.isCurrent ? '0 0 10px rgba(34, 197, 94, 0.6)' : '0 0 10px rgba(59, 130, 246, 0.5)' }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}