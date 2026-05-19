"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Sparkles, Cpu, Cloud, Database, Zap, GitBranch, Terminal, Rocket, Brain, Server, Boxes } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { certifications } from "@/data/content";

export function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  const highlights = [
    { icon: Brain, title: "AI Engineering", desc: "LLM integration, AI workflows with Claude & ChatGPT", color: "from-violet-500 to-purple-500" },
    { icon: Rocket, title: "End-to-End Deployment", desc: "Production-ready systems, CI/CD, cloud deployment", color: "from-orange-500 to-red-500" },
    { icon: Terminal, title: "Backend & APIs", desc: "FastAPI, REST APIs, scalable server architectures", color: "from-cyan-500 to-blue-500" },
    { icon: Database, title: "Real-time Pipelines", desc: "Kafka streaming, ETL/ELT, data orchestration", color: "from-emerald-500 to-green-500" },
    { icon: Cloud, title: "Cloud & DevOps", desc: "AWS, Kubernetes, Docker, infrastructure as code", color: "from-blue-500 to-indigo-500" },
    { icon: Boxes, title: "Scalable Architecture", desc: "Distributed systems, microservices, high-load systems", color: "from-pink-500 to-rose-500" },
  ];

  const techStack = [
    "Python", "SQL", "AWS", "Kafka", "Docker", "Kubernetes", "Snowflake", "DBT", "Power BI", "FastAPI", "Next.js", "PostgreSQL", "Redis", "Git", "Terraform", "Airflow"
  ];

  return (
    <section id="about" ref={containerRef} className="py-32 relative overflow-hidden">
      <BackgroundEffects />
      
      <motion.div style={{ y }} className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">AI Engineer & Developer</span>
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6">
            About <span className="text-gradient glow-text">Me</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            An AI Engineer, Data Engineer, and Software Developer passionate about building intelligent systems, 
            scalable cloud-native applications, and AI-powered solutions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <Card className="p-8 md:p-10 glass-hover h-full relative overflow-hidden">
              <motion.div
                className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-3xl"
                animate={{ rotate: [0, -360] }}
                transition={{ duration: 25, repeat: Infinity }}
              />
              
              <div className="relative z-10">
                <motion.h3
                  className="text-3xl font-bold mb-6 flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">A</span>
                  <span className="text-gradient">The Journey</span>
                </motion.h3>

                <div className="space-y-6 text-muted-foreground leading-relaxed">
                  <AnimatedText delay={0.1}>
                    <p>
                      I&apos;m an <span className="text-primary font-semibold">AI Engineer & Software Developer</span> building 
                      intelligent systems, scalable cloud-native applications, and production-ready AI solutions from scratch.
                    </p>
                  </AnimatedText>
                  
                  <AnimatedText delay={0.2}>
                    <p>
                      With hands-on experience in <span className="text-secondary font-semibold">end-to-end deployment</span>, 
                      I engineer robust backend systems, real-time data pipelines, and deploy AI-powered applications to production.
                    </p>
                  </AnimatedText>
                  
                  <AnimatedText delay={0.3}>
                    <p>
                      I leverage <span className="text-accent font-semibold">AI-assisted development workflows</span> using 
                      Claude, ChatGPT, and LLM tools to accelerate development, automate testing, and build intelligent features.
                    </p>
                  </AnimatedText>
                  
                  <AnimatedText delay={0.4}>
                    <p>
                      Expert in <span className="text-primary font-semibold">cloud-native development</span> (AWS), 
                      <span className="text-secondary font-semibold"> DevOps automation</span> (Docker, Kubernetes), 
                      and modern data stacks (Snowflake, DBT, Kafka).
                    </p>
                  </AnimatedText>

                  <AnimatedText delay={0.5}>
                    <p className="text-sm text-muted-foreground/70">
                      Based in Pune, India. Always building. Always learning.
                    </p>
                  </AnimatedText>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-sm font-medium mb-4 text-foreground">Tech Stack</p>
                  <div className="flex flex-wrap gap-2">
                    {techStack.map((tech, i) => (
                      <motion.div
                        key={tech}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.03 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        <Badge 
                          variant="outline" 
                          className="text-xs hover:bg-primary/20 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 transition-all cursor-default"
                        >
                          {tech}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {highlights.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <HighlightCard item={item} index={i} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-10 text-center">
            Professional <span className="text-gradient">Certifications</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {certifications.map((cert, i) => (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <Card className="p-5 glass-hover group relative overflow-hidden h-full">
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${cert.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}
                  />
                  
                  <div className="relative z-10 text-center">
                    <motion.div
                      className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-br ${cert.gradient} flex items-center justify-center shadow-lg mb-4`}
                      whileHover={{ rotate: 5, scale: 1.1 }}
                    >
                      <span className="text-2xl font-bold text-white">{cert.badge}</span>
                    </motion.div>
                    <h4 className="font-bold text-sm group-hover:text-primary transition-colors line-clamp-2">{cert.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{cert.issuer}</p>
                    <p className="text-xs text-muted-foreground/60 mt-2">{cert.date}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: "10+", label: "Projects Deployed", icon: "🚀" },
            { value: "15+", label: "AI Solutions", icon: "🤖" },
            { value: "5+", label: "Certifications", icon: "🏆" },
            { value: "20+", label: "Technologies", icon: "⚡" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center p-6 glass rounded-2xl hover-glow group relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <motion.div
                className="text-4xl mb-3"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              >
                {stat.icon}
              </motion.div>
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

function BackgroundEffects() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]"
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <div className="absolute inset-0 grid-bg opacity-10" />
      
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 bg-primary rounded-full opacity-30"
          style={{
            left: `${5 + i * 8}%`,
            top: `${10 + (i % 4) * 25}%`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 4 + i * 0.3,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
      
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
        <defs>
          <linearGradient id="neuralLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d="M 100 100 Q 300 200 500 150"
          stroke="url(#neuralLine)"
          strokeWidth="1"
          fill="none"
          animate={{ strokeDashoffset: [0, 50], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.path
          d="M 150 300 Q 400 250 600 350"
          stroke="url(#neuralLine)"
          strokeWidth="1"
          fill="none"
          animate={{ strokeDashoffset: [50, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </svg>
    </div>
  );
}

function HighlightCard({ item, index }: { item: any; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className="group flex items-center gap-4 p-5 glass rounded-2xl hover-glow cursor-pointer relative overflow-hidden"
      initial={{ opacity: 0, x: 40 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity`}
      />
      <motion.div
        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow relative z-10`}
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        <item.icon className="w-7 h-7 text-white" />
      </motion.div>
      
      <div className="flex-1 relative z-10">
        <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{item.title}</h4>
        <p className="text-sm text-muted-foreground">{item.desc}</p>
      </div>
      
      <motion.div
        className="opacity-0 group-hover:opacity-100 transition-opacity"
        initial={{ x: -10 }}
        whileHover={{ x: 0 }}
      >
        <Zap className="w-5 h-5 text-primary" />
      </motion.div>
    </motion.div>
  );
}

function AnimatedText({ children, delay }: { children: React.ReactNode; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}