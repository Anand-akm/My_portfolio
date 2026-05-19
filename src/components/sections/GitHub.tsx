"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink, Star, GitFork, Code2, Zap, Database } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { githubStats } from "@/data/content";
import Image from "next/image";

const featuredRepos = [
  {
    name: "stock-market-kafka-data-engineering-project",
    description: "Real-time stock market data pipeline with Kafka, AWS Glue, S3, and Athena for scalable streaming analytics.",
    language: "Jupyter Notebook",
    stars: 0,
    forks: 0,
    url: "https://github.com/Anand-akm/stock-market-kafka-data-engineering-project",
    tech: ["Python", "Kafka", "AWS", "SQL"],
  },
  {
    name: "netflix-analytics",
    description: "Cloud analytics pipeline using DBT, Snowflake, and AWS S3 for content trend analysis.",
    language: "HTML",
    stars: 0,
    forks: 0,
    url: "https://github.com/Anand-akm/netflix-analytics",
    tech: ["DBT", "Snowflake", "AWS", "Power BI"],
  },
  {
    name: "IPL-Analytics-Studio",
    description: "Interactive Power BI dashboard with 17 seasons of IPL data and advanced DAX KPIs.",
    language: "Multiple",
    stars: 0,
    forks: 0,
    url: "https://github.com/Anand-akm/IPL-Analytics-Studio",
    tech: ["Power BI", "DAX", "SQL"],
  },
  {
    name: "marketpulse-retail",
    description: "Retail analytics platform for data-driven insights and inventory management.",
    language: "JavaScript",
    stars: 0,
    forks: 0,
    url: "https://github.com/Anand-akm/marketpulse-retail",
    tech: ["JavaScript", "SQL", "AWS"],
  },
];

const languageColors: Record<string, string> = {
  "Python": "from-yellow-400 to-orange-500",
  "Jupyter Notebook": "from-orange-400 to-yellow-500",
  "JavaScript": "from-yellow-300 to-yellow-500",
  "HTML": "from-orange-400 to-red-500",
  "SQL": "from-blue-400 to-cyan-500",
  "Multiple": "from-purple-400 to-pink-500",
};

export function GitHubSection() {
  return (
    <section id="github" className="py-24 relative">
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
            Open <span className="text-gradient">Source</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Building in public. Check out my data engineering projects and contributions.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <Card className="p-8 glass-hover">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <motion.div
                  className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-primary/20"
                  whileHover={{ scale: 1.05, rotate: 2 }}
                >
                  <Image
                    src={githubStats.avatar}
                    alt={githubStats.username}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <div>
                  <h3 className="text-2xl font-bold">@{githubStats.username}</h3>
                  <p className="text-muted-foreground">Data Engineer & Analyst</p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gradient">{githubStats.repos}</div>
                  <div className="text-sm text-muted-foreground">Repositories</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gradient">{githubStats.followers}</div>
                  <div className="text-sm text-muted-foreground">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gradient">{githubStats.following}</div>
                  <div className="text-sm text-muted-foreground">Following</div>
                </div>
              </div>

              <Button asChild className="gap-2">
                <a href={githubStats.reposUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="w-5 h-5" />
                  View Profile
                </a>
              </Button>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {featuredRepos.map((repo, i) => (
            <motion.div
              key={repo.name}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="p-6 glass-hover group h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center"
                      whileHover={{ rotate: 10 }}
                    >
                      <Code2 className="w-5 h-5 text-primary" />
                    </motion.div>
                    <div>
                      <h4 className="font-bold group-hover:text-primary transition-colors">
                        {repo.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${languageColors[repo.language] || "from-primary to-accent"}`} />
                        <span className="text-xs text-muted-foreground">{repo.language}</span>
                      </div>
                    </div>
                  </div>
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>

                <p className="text-sm text-muted-foreground mb-4">{repo.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {repo.tech.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    {repo.stars}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="w-4 h-4" />
                    {repo.forks}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <p className="text-muted-foreground mb-4">Primary technologies I work with</p>
          <div className="flex flex-wrap justify-center gap-3">
            {githubStats.languages.map((lang) => (
              <motion.div
                key={lang}
                className="px-4 py-2 glass rounded-full text-sm font-medium"
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${languageColors[lang] || "from-primary to-accent"} mr-2`} />
                {lang}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}