"use client";

import { motion } from "framer-motion";
import { Calendar, GraduationCap, MapPin, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { education } from "@/data/content";

export function Education() {
  return (
    <section id="education" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-10" />
      <div className="absolute top-1/3 -right-32 w-64 h-64 bg-secondary/10 rounded-full blur-[110px] pointer-events-none" />

      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Academic Background</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            My <span className="text-gradient">Education</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The foundation behind my engineering journey and continuous learning.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-6">
          {education.map((item, index) => (
            <motion.div
              key={`${item.institution}-${item.degree}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="p-6 md:p-8 glass-hover group relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-primary/15 to-secondary/15 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-start gap-5">
                  <motion.div
                    className="w-14 h-14 flex-shrink-0 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.08, rotate: 4 }}
                  >
                    <GraduationCap className="w-7 h-7 text-white" />
                  </motion.div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold group-hover:text-primary transition-colors">
                          {item.degree}
                        </h3>
                        <p className="text-sm md:text-base font-medium text-primary">
                          {item.field}
                        </p>
                      </div>

                      <Badge variant="outline" className="gap-1.5 whitespace-nowrap">
                        <Calendar className="w-3.5 h-3.5" />
                        {item.startYear} – {item.endYear}
                      </Badge>
                    </div>

                    <p className="text-foreground font-semibold mt-3">{item.institution}</p>

                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-2">
                      <MapPin className="w-4 h-4 text-accent" />
                      {item.location}
                    </div>

                    {item.highlights && item.highlights.length > 0 && (
                      <ul className="mt-5 space-y-1.5 text-sm text-muted-foreground">
                        {item.highlights.map((highlight) => (
                          <li key={highlight} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
