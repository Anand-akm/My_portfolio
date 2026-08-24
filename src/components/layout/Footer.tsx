"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, Heart, Zap, Database } from "lucide-react";
import { siteConfig } from "@/data/content";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/10 bg-muted/5 overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-5" />
      
      <div className="container mx-auto px-6 py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.h3
              className="text-2xl font-bold text-gradient mb-4"
              whileHover={{ scale: 1.05 }}
            >
              {siteConfig.name}
            </motion.h3>
            <p className="text-muted-foreground text-sm">
              AWS Certified Data Engineer building scalable data pipelines, 
              ETL workflows, and AI-ready analytics infrastructure.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {["About", "Skills", "Projects", "Certifications", "GitHub", "Contact"].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="text-muted-foreground text-sm hover:text-primary transition-colors inline-flex items-center gap-2"
                >
                  <Zap className="w-3 h-3" />
                  {link}
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-4">
              <SocialLink href={siteConfig.social.github} icon={<Github className="w-5 h-5" />} label="GitHub" />
              <SocialLink href={siteConfig.social.linkedin} icon={<Linkedin className="w-5 h-5" />} label="LinkedIn" />
              <SocialLink href={siteConfig.social.twitter} icon={<Twitter className="w-5 h-5" />} label="Twitter" />
              <SocialLink href={`mailto:${siteConfig.social.email}`} icon={<Mail className="w-5 h-5" />} label="Email" />
            </div>
            
            <div className="mt-6 p-4 glass rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Currently focused on</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Real-time data pipelines, cloud data architecture, and ML integration
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            Built with <Heart className="w-4 h-4 inline text-red-500 animate-pulse" /> by Anand Kumar Mishra
          </p>
          <p className="text-sm text-muted-foreground">
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/10 transition-all"
      whileHover={{ y: -4, scale: 1.1 }}
      aria-label={label}
    >
      {icon}
    </motion.a>
  );
}