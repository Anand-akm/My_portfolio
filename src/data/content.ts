export const siteConfig = {
  name: "anandcodes.tech",
  title: "Anand Kumar Mishra - AI Engineer & Software Developer",
  description: "AI Engineer, Data Engineer, and Software Developer passionate about building intelligent systems, scalable cloud-native applications, and AI-powered solutions.",
  url: "https://anandcodes.tech",
  keywords: ["AI Engineer", "Software Engineer", "Data Engineer", "AWS", "Kafka", "Python", "Snowflake", "DevOps", "Cloud Engineering", "LLM"],
  author: "Anand Kumar Mishra",
  social: {
    github: "https://github.com/Anand-akm",
    linkedin: "https://linkedin.com/in/anandmishra79",
    twitter: "https://twitter.com/anandmishra",
    email: "mianand275@gmail.com",
  },
  location: "Pune, India",
};

export const navItems = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Certifications", href: "#certifications" },
  { name: "GitHub", href: "#github" },
  { name: "Contact", href: "#contact" },
];

export const skills = {
  programming: ["Python", "SQL", "JavaScript", "DBT"],
  dataEngineering: ["Apache Kafka", "Apache Spark", "Pandas", "NumPy", "Airflow", "ETL/ELT"],
  cloud: ["AWS", "Azure", "Snowflake", "Docker", "Kubernetes"],
  databases: ["PostgreSQL", "MySQL", "AWS RDS", "AWS Athena", "MongoDB", "Redis"],
  visualization: ["Power BI", "Tableau", "Excel", "DAX", "Power Query"],
  devops: ["Git", "Linux", "CI/CD", "Docker", "Kubernetes", "Terraform"],
  aiTools: ["Claude", "ChatGPT", "GitHub Copilot", "Gemini", "Cursor AI", "Hugging Face", "LangChain", "OpenAI API", "Vercel AI SDK", "Perplexity AI"],
};

export const projects = [
  {
    title: "Stock Market Real-Time Data Pipeline",
    description: "End-to-end streaming pipeline processing stock market data with Kafka, AWS Glue, and Athena for real-time analytics and market insights.",
    tech: ["Python", "Kafka", "AWS S3", "AWS Glue", "Athena", "SQL"],
    github: "https://github.com/Anand-akm/stock-market-kafka-data-engineering-project",
    demo: "",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
    category: "Data Engineering",
    highlights: ["Real-time streaming", "Cloud-native ETL", "Market analytics"],
  },
  {
    title: "Netflix Analytics with DBT",
    description: "Cloud analytics pipeline using DBT, Snowflake, and AWS S3 for content trend analysis and scalable data warehousing.",
    tech: ["DBT", "Snowflake", "AWS S3", "SQL", "Python", "Power BI"],
    github: "https://github.com/Anand-akm/netflix-analytics",
    demo: "",
    image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800",
    category: "Analytics",
    highlights: ["Data modeling", "Cloud warehouse", "Trend analysis"],
  },
  {
    title: "IPL Data Analysis Dashboard",
    description: "Interactive Power BI dashboard with 17 seasons of IPL data, advanced DAX KPIs, drill-through pages, and player insights.",
    tech: ["Power BI", "DAX", "Power Query", "SQL"],
    github: "https://github.com/Anand-akm/IPL-Analytics-Studio",
    demo: "",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
    category: "Analytics",
    highlights: ["Advanced visualizations", "KPI dashboards", "Sports analytics"],
  },
  {
    title: "Churn Analysis & ML Dashboard",
    description: "ETL pipeline with machine learning-powered churn prediction and Power BI dashboards for customer retention strategies.",
    tech: ["Python", "SQL Server", "Power BI", "Machine Learning"],
    github: "",
    demo: "",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
    category: "ML/Analytics",
    highlights: ["Churn prediction", "ML models", "Business intelligence"],
  },
  {
    title: "MarketPulse Retail Analytics",
    description: "Retail analytics platform for data-driven insights and inventory management using modern data stack.",
    tech: ["JavaScript", "SQL", "Python", "AWS"],
    github: "https://github.com/Anand-akm/marketpulse-retail",
    demo: "",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
    category: "Analytics",
    highlights: ["Retail analytics", "Inventory insights", "Data pipeline"],
  },
];

export const experience = [
  {
    id: 1,
    company: "EURON",
    title: "Associate Software Engineer",
    type: "Full-time",
    period: "Feb 2026 – Present",
    location: "Remote",
    isCurrent: true,
    description: "Working on AI-driven systems, data analytics platforms, cloud-based applications, and scalable backend solutions. Building modern analytics workflows and deployment-ready systems using cloud and AI technologies.",
    skills: ["Python", "SQL", "Data Engineering", "AWS", "GenAI", "Cloud Deployment"],
    logo: "E",
  },
  {
    id: 2,
    company: "EURON",
    title: "Data Analyst Intern",
    type: "Internship",
    period: "Nov 2025 – Feb 2026",
    location: "Noida, Uttar Pradesh, India",
    isCurrent: false,
    description: "Worked on analytics dashboards, business intelligence reporting, data cleaning pipelines, and visualization systems. Assisted in creating scalable data workflows and reporting automation.",
    skills: ["Python", "Power BI", "Excel", "Data Analytics", "PostgreSQL"],
    logo: "E",
  },
];

export const certifications = [
  {
    title: "AWS Certified Data Engineer - Associate",
    issuer: "Amazon Web Services",
    date: "2025",
    credentialId: "AWS-DEA-2025",
    badge: "AWS",
    gradient: "from-orange-500 to-yellow-500",
  },
  {
    title: "Microsoft Azure Security Engineer Associate",
    issuer: "Microsoft",
    date: "2025",
    credentialId: "AZ-SEC-2025",
    badge: "Azure",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Snowflake - The Complete Masterclass",
    issuer: "Snowflake",
    date: "2025",
    credentialId: "SNOW-MC-2025",
    badge: "Snow",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    title: "Ultimate AWS Solutions Architect Associate",
    issuer: "Amazon Web Services",
    date: "2025",
    credentialId: "AWS-SAA-2025",
    badge: "AWS",
    gradient: "from-orange-500 to-red-500",
  },
  {
    title: "Containers with Docker & Kubernetes",
    issuer: "Docker & CNCF",
    date: "2024",
    credentialId: "DOCKER-K8S-2024",
    badge: "K8s",
    gradient: "from-blue-500 to-purple-500",
  },
];

export const githubStats = {
  username: "Anand-akm",
  repos: 7,
  followers: 1,
  following: 1,
  avatar: "https://avatars.githubusercontent.com/u/118425701?v=4",
  reposUrl: "https://github.com/Anand-akm?tab=repositories",
  languages: ["Python", "Jupyter Notebook", "JavaScript", "SQL", "HTML"],
};

export const testimonials = [
  {
    name: "Data Engineering Community",
    role: "Tech Network",
    content: "Anand brings strong data engineering skills with expertise in building scalable pipelines and cloud-native solutions.",
    avatar: "AM",
  },
];

export const taglines = [
  "Building scalable cloud-native data systems.",
  "Transforming raw data into AI-ready insights.",
  "Engineering modern analytics and streaming platforms.",
  "Designing scalable ETL and cloud data architectures.",
  "Data Engineer",
  "AI Specialist",
  "Cloud Engineer",
  "Analytics Developer",
];

export const heroStats = [
  { label: "Data Pipelines", value: "10+" },
  { label: "Dashboards", value: "15+" },
  { label: "Certifications", value: "5" },
  { label: "Technologies", value: "20+" },
];