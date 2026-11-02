import type { NavItem, HeroStat } from "@/types";

export const navItems: NavItem[] = [
  { name: "Home", href: "#hero" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Education", href: "#education" },
  { name: "Certifications", href: "#certifications" },
  { name: "GitHub", href: "#github" },
  { name: "Contact", href: "#contact" },
];

export const taglines: string[] = [
  "Building scalable cloud-native data systems.",
  "Transforming raw data into AI-ready insights.",
  "Engineering modern analytics and streaming platforms.",
  "Designing scalable ETL and cloud data architectures.",
  "Data Engineer",
  "AI Specialist",
  "Cloud Engineer",
  "Analytics Developer",
];

export const heroStats: HeroStat[] = [
  { label: "Data Pipelines", value: "10+" },
  { label: "Dashboards", value: "15+" },
  { label: "Certifications", value: "5" },
  { label: "Technologies", value: "20+" },
];
