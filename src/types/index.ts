export interface SocialLinks {
  github: string;
  linkedin: string;
  twitter: string;
  email: string;
}

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  keywords: string[];
  author: string;
  social: SocialLinks;
  location: string;
}

export interface NavItem {
  name: string;
  href: string;
}

export interface SkillCategory {
  programming: string[];
  genai: string[];
  aiVoice: string[];
  backend: string[];
  dataEngineering: string[];
  cloud: string[];
  databases: string[];
  visualization: string[];
  devops: string[];
  aiTools: string[];
}

export interface Project {
  title: string;
  description: string;
  tech: string[];
  github: string;
  demo: string;
  image: string;
  category: string;
  highlights: string[];
}

export interface Experience {
  id: number;
  company: string;
  title: string;
  type: "Full-time" | "Internship" | "Contract";
  period: string;
  location: string;
  isCurrent: boolean;
  description: string;
  skills: string[];
  logo: string;
}

export interface Certification {
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
  badge: string;
  gradient: string;
}

export interface GithubStats {
  username: string;
  repos: number;
  followers: number;
  following: number;
  avatar: string;
  reposUrl: string;
  languages: string[];
}

export interface Testimonial {
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export interface HeroStat {
  label: string;
  value: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  location: string;
  highlights?: string[];
}
