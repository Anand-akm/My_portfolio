import type { KnowledgeBase } from "@/types/ai";

export const knowledgeBase: KnowledgeBase = {
  version: "2.1.0",
  lastUpdated: "2026-10-28",
  entries: [
    // ─── PROFILE ──────────────────────────────────────────────
    {
      id: "profile-summary",
      category: "profile",
      topic: "Anand Kumar Mishra — Professional Overview",
      content:
        "Anand Kumar Mishra is an AI Engineer, Data Engineer, and Software Developer based in Pune, India. He specializes in Generative AI, RAG systems, agentic workflows, and cloud-native data solutions. He has built production software delivered to clients, using AI-assisted development workflows. He currently works as an Associate Software Engineer at EngageSphere Technology Private Limited (Euron).",
      evidence: "src/data/profile.ts, src/data/experience.ts, user-verified resume",
      confidence: "self-described",
      keywords: [
        "anand", "anand kumar mishra", "about", "overview", "introduction",
        "who is anand", "who are you", "tell me about yourself", "bio", "background",
      ],
      aliases: ["anand", "akm", "mishra"],
      relatedIds: ["experience-euron-ase", "education-btech", "genai-skills"],
    },
    {
      id: "profile-location",
      category: "profile",
      topic: "Location",
      content: "Anand is based in Pune, India.",
      evidence: "src/data/profile.ts",
      confidence: "self-described",
      keywords: ["location", "where", "based", "city", "pune", "india", "live"],
      aliases: ["pune", "india"],
      relatedIds: ["profile-summary"],
    },
    {
      id: "profile-social",
      category: "profile",
      topic: "Social Links & Contact",
      content:
        "Anand's GitHub profile is github.com/Anand-akm. His LinkedIn is linkedin.com/in/anandmishra79. His email is mianand275@gmail.com. His portfolio website is anandcodes.tech.",
      evidence: "src/data/profile.ts",
      confidence: "self-described",
      keywords: [
        "github", "linkedin", "email", "contact", "social", "profile", "connect",
        "website", "portfolio",
      ],
      aliases: ["contact", "reach"],
      relatedIds: ["profile-summary"],
    },

    // ─── EDUCATION ────────────────────────────────────────────
    {
      id: "education-btech",
      category: "education",
      topic: "B.Tech in Computer Science and Engineering",
      content:
        "Anand holds a Bachelor of Technology (B.Tech) in Computer Science and Engineering from Lovely Professional University, Punjab, India. He studied from October 2021 to July 2025.",
      evidence: "src/data/education.ts, user-verified resume",
      confidence: "demonstrated",
      keywords: [
        "education", "educational", "educational background", "degree",
        "bachelor", "btech", "b.tech", "computer science", "engineering",
        "university", "lovely professional university", "lpu", "college",
        "graduation", "study",
      ],
      aliases: ["btech", "b.tech", "lpu", "lovely professional", "educational background"],
      relatedIds: ["profile-summary"],
    },

    // ─── EXPERIENCE ───────────────────────────────────────────
    {
      id: "experience-euron-ase",
      category: "experience",
      topic: "Associate Software Engineer at EngageSphere (Euron)",
      content:
        "Anand works as an Associate Software Engineer (Full-time, Remote) at EngageSphere Technology Private Limited, commonly known as Euron, from February 2026 to August 2026. His responsibilities include working on AI-driven systems, data analytics platforms, cloud-based applications, and scalable backend solutions. He builds modern analytics workflows and deployment-ready systems using cloud and AI technologies.",
      evidence: "src/data/experience.ts, user-verified resume",
      confidence: "self-described",
      keywords: [
        "euron", "engagesphere", "software engineer", "associate", "current",
        "role", "job", "work", "position", "ai", "data", "cloud",
      ],
      aliases: ["euron", "engagesphere", "engage sphere"],
      relatedIds: ["experience-euron-intern", "profile-summary", "genai-skills"],
    },
    {
      id: "experience-euron-intern",
      category: "experience",
      topic: "Data Analyst Intern at EngageSphere (Euron)",
      content:
        "Anand worked as a Data Analyst Intern (Internship) at EngageSphere Technology Private Limited (Euron) in Noida, Uttar Pradesh, India, from November 2025 to February 2026. He worked on analytics dashboards, business intelligence reporting, data cleaning pipelines, and visualization systems. He assisted in creating scalable data workflows and reporting automation.",
      evidence: "src/data/experience.ts, user-verified resume",
      confidence: "self-described",
      keywords: [
        "euron", "engagesphere", "intern", "internship", "data analyst",
        "previous", "analytics", "power bi", "excel", "reporting",
      ],
      aliases: ["euron intern", "engagesphere intern", "data analyst intern"],
      relatedIds: ["experience-euron-ase"],
    },
    {
      id: "career-overview",
      category: "experience",
      topic: "Career Journey",
      content:
        "Anand's professional career began as a Data Analyst Intern at EngageSphere Technology Private Limited (Euron) in November 2025, where he worked on analytics dashboards, BI reporting, and data visualization. He then transitioned to Associate Software Engineer at the same company in February 2026, where he works on AI-driven systems, data analytics platforms, cloud-based applications, and scalable backend solutions.",
      evidence: "src/data/experience.ts, user-verified resume",
      confidence: "self-described",
      keywords: ["career", "journey", "growth", "timeline", "history", "path"],
      aliases: ["career path", "work history"],
      relatedIds: ["experience-euron-ase", "experience-euron-intern"],
    },

    // ─── GENAI SKILLS ─────────────────────────────────────────
    {
      id: "genai-skills",
      category: "skills",
      topic: "Generative AI Skills",
      content:
        "Anand has hands-on experience with Generative AI technologies including RAG (Retrieval-Augmented Generation), LLM applications, LangGraph, LangChain, prompt engineering, embeddings, vector search, and grounded generation. He has built production RAG systems and agentic AI workflows.",
      evidence: "src/data/skills.ts, user-verified resume",
      confidence: "self-described",
      keywords: [
        "genai", "generative ai", "rag", "retrieval augmented generation",
        "llm", "large language model", "langgraph", "langchain", "prompt engineering",
        "embeddings", "vector search", "grounded generation", "ai",
      ],
      aliases: ["rag", "llm", "langgraph", "langchain"],
      relatedIds: ["ai-voice-skills", "project-arogyaai", "project-citizenforge", "project-pgknowledgebase"],
    },
    {
      id: "ai-voice-skills",
      category: "skills",
      topic: "AI & Voice Technologies",
      content:
        "Anand has experience with AI and voice technologies including Claude, GPT-4o, Llama 3, Sarvam AI (ASR/TTS), AI APIs, and agentic workflows. He has integrated multiple LLM providers and voice AI services into applications.",
      evidence: "src/data/skills.ts, user-verified resume",
      confidence: "self-described",
      keywords: [
        "ai", "voice", "claude", "gpt-4o", "gpt4", "llama", "llama 3",
        "sarvam", "asr", "tts", "speech", "agentic", "workflows", "agents",
      ],
      aliases: ["claude", "gpt4o", "llama", "sarvam"],
      relatedIds: ["genai-skills", "ai-tools-coding"],
    },
    {
      id: "backend-skills",
      category: "skills",
      topic: "Backend Development Skills",
      content:
        "Anand's backend development skills include Python, FastAPI, Node.js, SQLAlchemy, PostgreSQL, and Redis. He builds server-side applications, APIs, and data services.",
      evidence: "src/data/skills.ts, user-verified resume",
      confidence: "self-described",
      keywords: [
        "backend", "server", "api", "python", "fastapi", "node.js", "nodejs",
        "sqlalchemy", "postgresql", "redis", "rest", "endpoint",
      ],
      aliases: ["fastapi", "nodejs", "node.js"],
      relatedIds: ["data-skills", "infrastructure-skills"],
    },
    {
      id: "data-skills",
      category: "skills",
      topic: "Data Engineering & Database Skills",
      content:
        "Anand's data engineering and database skills include SQL, DBT, Snowflake, ETL/ELT, pgvector, and BM25. He works with PostgreSQL and Redis for application data, and pgvector for vector search in AI applications.",
      evidence: "src/data/skills.ts, user-verified resume",
      confidence: "self-described",
      keywords: [
        "data", "data engineering", "sql", "dbt", "snowflake", "etl", "elt",
        "pgvector", "bm25", "vector", "database", "postgresql", "redis",
      ],
      aliases: ["dbt", "pgvector", "bm25", "snowflake"],
      relatedIds: ["backend-skills", "infrastructure-skills", "project-pgknowledgebase"],
    },
    {
      id: "infrastructure-skills",
      category: "skills",
      topic: "Infrastructure & DevOps Skills",
      content:
        "Anand's infrastructure and DevOps skills include Docker, Kubernetes/EKS, AWS, Terraform, Ansible, GitHub Actions, CI/CD, Git, and Linux. He builds and deploys cloud-native infrastructure.",
      evidence: "src/data/skills.ts, user-verified resume",
      confidence: "self-described",
      keywords: [
        "infrastructure", "devops", "docker", "kubernetes", "k8s", "eks",
        "aws", "terraform", "ansible", "github actions", "ci/cd", "git", "linux",
        "cloud", "deployment",
      ],
      aliases: ["k8s", "eks", "cicd", "iac"],
      relatedIds: ["data-skills", "cert-aws-dea"],
    },
    {
      id: "visualization-skills",
      category: "skills",
      topic: "Visualization & BI Skills",
      content:
        "Anand's visualization and BI skills include Power BI, Excel, DAX, and Power Query. He has built analytics dashboards and business intelligence reporting systems.",
      evidence: "src/data/skills.ts, user-verified resume",
      confidence: "self-described",
      keywords: [
        "visualization", "bi", "business intelligence", "power bi", "excel",
        "dax", "power query", "dashboard", "charts", "reporting",
      ],
      aliases: ["powerbi", "dax"],
      relatedIds: ["experience-euron-intern"],
    },
    {
      id: "ai-tools-coding",
      category: "skills",
      topic: "AI-Assisted Development Tools",
      content:
        "Anand uses AI-assisted development tools including Claude, Cursor, and Codex for software development. He has used these tools to build production software that was successfully delivered to clients. This represents his engineering workflow experience with AI coding assistants.",
      evidence: "user-verified information",
      confidence: "self-described",
      keywords: [
        "ai coding", "ai tools", "cursor", "codex", "claude", "copilot",
        "ai assisted", "development workflow", "ai development", "productivity",
      ],
      aliases: ["cursor", "codex", "ai coding"],
      relatedIds: ["genai-skills", "ai-voice-skills"],
    },

    // ─── PROJECTS ─────────────────────────────────────────────
    {
      id: "project-arogyaai",
      category: "projects",
      topic: "ArogyaAI — Agentic Healthcare AI Platform",
      content:
        "Anand built ArogyaAI, an agentic healthcare AI platform. This project demonstrates his ability to build production-grade agentic AI systems applied to the healthcare domain.",
      evidence: "user-verified resume",
      confidence: "self-described",
      keywords: [
        "arogyaai", "arogya", "healthcare", "agentic", "ai platform",
        "medical", "health", "project",
      ],
      aliases: ["arogyaai", "arogya ai", "arogya"],
      relatedIds: ["genai-skills", "ai-voice-skills", "backend-skills"],
    },
    {
      id: "project-citizenforge",
      category: "projects",
      topic: "CitizenForge — AI Powered Campaign Operations Platform",
      content:
        "Anand built CitizenForge, an AI-powered campaign operations platform. This project demonstrates his ability to build AI-integrated operational platforms.",
      evidence: "user-verified resume",
      confidence: "self-described",
      keywords: [
        "citizenforge", "citizen forge", "campaign", "operations", "ai platform",
        "political", "civic", "project",
      ],
      aliases: ["citizenforge", "citizen forge"],
      relatedIds: ["genai-skills", "backend-skills"],
    },
    {
      id: "project-pgknowledgebase",
      category: "projects",
      topic: "PostgreSQL Knowledge Base — RAG Platform",
      content:
        "Anand built a PostgreSQL Knowledge Base, a RAG (Retrieval-Augmented Generation) platform. This project demonstrates his expertise in building vector-based knowledge retrieval systems using PostgreSQL with pgvector.",
      evidence: "user-verified resume",
      confidence: "self-described",
      keywords: [
        "postgresql", "knowledge base", "rag", "retrieval", "augmented",
        "generation", "vector", "pgvector", "search", "project",
      ],
      aliases: ["pg kb", "pgknowledgebase", "knowledge base"],
      relatedIds: ["genai-skills", "data-skills", "project-schemaintelligence"],
    },
    {
      id: "project-schemaintelligence",
      category: "projects",
      topic: "Schema Intelligence — AI Database Assistant",
      content:
        "Anand built Schema Intelligence, an AI-powered database assistant. This project demonstrates his ability to build AI tools that understand and work with database schemas.",
      evidence: "user-verified resume",
      confidence: "self-described",
      keywords: [
        "schema intelligence", "database assistant", "ai", "schema", "database",
        "sql", "assistant", "project",
      ],
      aliases: ["schema intelligence", "schema-intelligence"],
      relatedIds: ["data-skills", "backend-skills", "project-pgknowledgebase"],
    },
    {
      id: "project-stock-market",
      category: "projects",
      topic: "Stock Market Real-Time Data Pipeline",
      content:
        "Anand built a Stock Market Real-Time Data Pipeline — an end-to-end streaming pipeline processing stock market data with Kafka, AWS Glue, and Athena for real-time analytics and market insights. Technologies used: Python, Kafka, AWS S3, AWS Glue, Athena, SQL.",
      evidence: "src/data/projects.ts",
      confidence: "self-described",
      keywords: [
        "stock market", "pipeline", "kafka", "real-time", "streaming",
        "glue", "athena", "s3", "data engineering", "project",
      ],
      aliases: ["stock pipeline", "kafka pipeline"],
      relatedIds: ["data-skills", "infrastructure-skills"],
    },
    {
      id: "project-netflix",
      category: "projects",
      topic: "Netflix Analytics with DBT",
      content:
        "Anand built a Netflix Analytics pipeline using DBT, Snowflake, and AWS S3 for content trend analysis and scalable data warehousing. Technologies used: DBT, Snowflake, AWS S3, SQL, Python, Power BI.",
      evidence: "src/data/projects.ts",
      confidence: "self-described",
      keywords: [
        "netflix", "analytics", "dbt", "snowflake", "data warehouse",
        "trend analysis", "project",
      ],
      aliases: ["netflix dbt", "netflix analytics"],
      relatedIds: ["data-skills", "visualization-skills"],
    },
    {
      id: "project-ipl-dashboard",
      category: "projects",
      topic: "IPL Data Analysis Dashboard",
      content:
        "Anand created an interactive Power BI dashboard with 17 seasons of IPL data, featuring advanced DAX KPIs, drill-through pages, and player insights. Technologies used: Power BI, DAX, Power Query, SQL.",
      evidence: "src/data/projects.ts",
      confidence: "self-described",
      keywords: [
        "ipl", "dashboard", "power bi", "dax", "analytics", "cricket",
        "sports", "visualization", "project",
      ],
      aliases: ["ipl dashboard", "ipl analytics"],
      relatedIds: ["visualization-skills"],
    },
    {
      id: "project-churn",
      category: "projects",
      topic: "Churn Analysis & ML Dashboard",
      content:
        "Anand built an ETL pipeline with machine learning-powered churn prediction and Power BI dashboards for customer retention strategies. Technologies used: Python, SQL Server, Power BI, Machine Learning.",
      evidence: "src/data/projects.ts",
      confidence: "self-described",
      keywords: [
        "churn", "machine learning", "ml", "prediction", "etl",
        "customer", "retention", "project",
      ],
      aliases: ["churn analysis", "churn prediction"],
      relatedIds: ["backend-skills", "visualization-skills"],
    },
    {
      id: "project-marketpulse",
      category: "projects",
      topic: "MarketPulse Retail Analytics",
      content:
        "Anand built a retail analytics platform for data-driven insights and inventory management using a modern data stack. Technologies used: JavaScript, SQL, Python, AWS.",
      evidence: "src/data/projects.ts",
      confidence: "self-described",
      keywords: [
        "marketpulse", "retail", "analytics", "inventory", "insights", "project",
      ],
      aliases: ["marketpulse", "market pulse"],
      relatedIds: ["data-skills", "infrastructure-skills"],
    },

    // ─── CERTIFICATIONS ───────────────────────────────────────
    {
      id: "cert-aws-dea",
      category: "certifications",
      topic: "AWS Certified Data Engineer - Associate (DEA-C01)",
      content:
        "Anand holds the AWS Certified Data Engineer - Associate certification (DEA-C01), issued by Amazon Web Services in 2025.",
      evidence: "src/data/certifications.ts, user-verified resume",
      confidence: "demonstrated",
      keywords: [
        "aws", "certification", "data engineer", "associate", "certified", "dea-c01",
      ],
      aliases: ["aws dea", "dea-c01", "aws data engineer"],
      relatedIds: ["infrastructure-skills", "data-skills"],
    },
    {
      id: "cert-euron-devops",
      category: "certifications",
      topic: "DevOps, MLOps & LLMOps Engineering 1.0",
      content:
        "Anand completed the DevOps, MLOps & LLMOps Engineering 1.0 certification from Euron in 2025.",
      evidence: "src/data/certifications.ts, user-verified resume",
      confidence: "demonstrated",
      keywords: [
        "devops", "mlops", "llmops", "engineering", "euron", "certification",
      ],
      aliases: ["mlops", "llmops", "euron devops"],
      relatedIds: ["infrastructure-skills", "genai-skills"],
    },
    {
      id: "cert-euron-ai",
      category: "certifications",
      topic: "The AI Generalist 1.0",
      content:
        "Anand completed The AI Generalist 1.0 certification from Euron in 2025.",
      evidence: "src/data/certifications.ts, user-verified resume",
      confidence: "demonstrated",
      keywords: [
        "ai", "generalist", "euron", "certification", "artificial intelligence",
      ],
      aliases: ["ai generalist", "euron ai"],
      relatedIds: ["genai-skills", "cert-euron-devops"],
    },
    {
      id: "cert-docker-k8s",
      category: "certifications",
      topic: "Containers with Docker & Kubernetes",
      content:
        "Anand completed the Containers with Docker & Kubernetes certification from Coursera in 2024.",
      evidence: "src/data/certifications.ts, user-verified resume",
      confidence: "demonstrated",
      keywords: [
        "docker", "kubernetes", "containers", "k8s", "certification", "coursera",
      ],
      aliases: ["docker cert", "k8s cert"],
      relatedIds: ["infrastructure-skills"],
    },
    {
      id: "cert-snowflake",
      category: "certifications",
      topic: "Snowflake - The Complete Masterclass",
      content:
        "Anand completed the Snowflake - The Complete Masterclass certification from Udemy in 2025.",
      evidence: "src/data/certifications.ts, user-verified resume",
      confidence: "demonstrated",
      keywords: ["snowflake", "certification", "masterclass", "udemy"],
      aliases: ["snowflake cert"],
      relatedIds: ["data-skills"],
    },

    // ─── COMPOSITE / STRATEGIC ENTRIES ────────────────────────
    {
      id: "genai-experience",
      category: "skills",
      topic: "GenAI & RAG Experience",
      content:
        "Anand has hands-on experience building Generative AI applications including RAG systems, LLM-powered applications, and agentic workflows. He has worked with technologies like LangGraph, LangChain, embeddings, vector search, and multiple LLM providers (Claude, GPT-4o, Llama 3). His projects include ArogyaAI (agentic healthcare AI), CitizenForge (AI campaign operations), and a PostgreSQL Knowledge Base RAG platform.",
      evidence: "src/data/skills.ts, user-verified resume",
      confidence: "self-described",
      keywords: [
        "genai", "generative ai", "rag", "llm", "ai projects", "langchain",
        "langgraph", "embeddings", "vector", "agentic", "experience",
      ],
      aliases: ["rag experience", "llm experience", "genai projects"],
      relatedIds: [
        "genai-skills", "ai-voice-skills", "project-arogyaai",
        "project-citizenforge", "project-pgknowledgebase",
      ],
    },
    {
      id: "strongest-area",
      category: "skills",
      topic: "Strongest Technical Area",
      content:
        "Anand's strongest technical areas are Generative AI / RAG systems and backend data engineering. He has built production RAG platforms, agentic AI workflows, and cloud-native data pipelines. His certifications in AWS Data Engineering and DevOps/MLOps/LLMOps validate his infrastructure expertise.",
      evidence: "src/data/skills.ts, src/data/certifications.ts, user-verified resume",
      confidence: "self-described",
      keywords: [
        "strongest", "best", "expertise", "specialty", "strength", "area",
      ],
      aliases: ["expertise", "strength"],
      relatedIds: [
        "genai-skills", "backend-skills", "infrastructure-skills",
        "cert-aws-dea", "cert-euron-devops",
      ],
    },
    {
      id: "production-experience",
      category: "experience",
      topic: "Production Software Delivery",
      content:
        "Anand has built and delivered production software to clients. He has used AI-assisted development tools (Claude, Cursor, Codex) as part of his engineering workflow to build and ship production-grade applications.",
      evidence: "user-verified information",
      confidence: "self-described",
      keywords: [
        "production", "shipped", "delivered", "clients", "real software",
        "engineering", "workflow", "built",
      ],
      aliases: ["production work", "client delivery"],
      relatedIds: ["ai-tools-coding", "experience-euron-ase"],
    },
    {
      id: "why-ai-engineer",
      category: "profile",
      topic: "Why Anand Would Be a Good Fit for AI Engineer",
      content:
        "Anand would be a strong fit for an AI Engineer role because: (1) He has hands-on experience building RAG systems, agentic workflows, and LLM applications using LangGraph, LangChain, embeddings, and vector search. (2) He has worked with multiple LLM providers including Claude, GPT-4o, and Llama 3, as well as voice AI services like Sarvam AI. (3) He builds backend services with Python, FastAPI, Node.js, and PostgreSQL. (4) He deploys infrastructure with Docker, Kubernetes/EKS, AWS, and Terraform. (5) He has delivered production software to clients using AI-assisted development workflows.",
      evidence: "src/data/skills.ts, src/data/certifications.ts, user-verified resume",
      confidence: "self-described",
      keywords: [
        "ai engineer", "good fit", "hire", "recruit", "qualification", "match",
      ],
      aliases: ["hire", "fit", "qualification"],
      relatedIds: [
        "genai-skills", "ai-voice-skills", "backend-skills",
        "infrastructure-skills", "production-experience",
      ],
    },
    {
      id: "unknown-achievements",
      category: "achievements",
      topic: "Awards & Achievements",
      content:
        "No independently verified awards or hackathon achievements have been provided for Anand at this time. This information may be updated in the future if verified details become available.",
      evidence: "not-provided",
      confidence: "partial",
      keywords: [
        "awards", "achievements", "hackathon", "prizes", "recognition", "medals",
      ],
      aliases: ["awards", "prizes"],
      relatedIds: [],
    },

    // ─── SKILL DETAILS ────────────────────────────────────────
    {
      id: "skills-programming-languages",
      category: "skills",
      topic: "Programming Languages & Transformation Skills",
      content:
        "Anand's listed programming and transformation skills are Python, SQL, JavaScript, and DBT.",
      evidence: "src/data/skills.ts",
      confidence: "self-described",
      keywords: [
        "programming", "programming languages", "python", "sql", "javascript",
        "dbt", "coding", "language",
      ],
      aliases: ["python", "sql", "javascript", "dbt"],
      relatedIds: ["backend-skills", "data-skills"],
    },
    {
      id: "skills-cloud-platforms",
      category: "skills",
      topic: "Cloud Platform & Infrastructure Tools",
      content:
        "Anand's listed cloud platform is AWS. His cloud infrastructure toolset includes Docker, Kubernetes/EKS, Terraform, Ansible, and GitHub Actions.",
      evidence: "src/data/skills.ts",
      confidence: "self-described",
      keywords: [
        "cloud platform", "aws", "docker", "kubernetes", "eks", "terraform",
        "ansible", "github actions", "cloud tools",
      ],
      aliases: ["aws", "eks", "terraform", "ansible"],
      relatedIds: ["infrastructure-skills", "cert-aws-dea"],
    },
    {
      id: "skills-devops-practices",
      category: "skills",
      topic: "DevOps Practices & Tooling",
      content:
        "Anand's listed DevOps practices and tools include CI/CD, Git, Linux, Docker, Kubernetes/EKS, Terraform, Ansible, and GitHub Actions.",
      evidence: "src/data/skills.ts",
      confidence: "self-described",
      keywords: [
        "devops", "ci/cd", "cicd", "git", "linux", "deployment", "automation",
        "docker", "kubernetes", "terraform", "ansible",
      ],
      aliases: ["ci/cd", "continuous deployment", "git", "linux"],
      relatedIds: ["infrastructure-skills", "cert-euron-devops"],
    },
    {
      id: "skills-application-data-stores",
      category: "skills",
      topic: "Application Data Stores",
      content:
        "Anand works with PostgreSQL and Redis as application data stores, and uses pgvector for vector search in AI applications.",
      evidence: "src/data/skills.ts",
      confidence: "self-described",
      keywords: [
        "postgresql", "redis", "pgvector", "database", "data store", "vector",
        "vector search", "caching",
      ],
      aliases: ["postgres", "redis", "pgvector"],
      relatedIds: ["data-skills", "backend-skills", "project-pgknowledgebase"],
    },
    {
      id: "skills-ai-toolchain",
      category: "skills",
      topic: "AI Toolchain",
      content:
        "Anand's listed AI toolchain includes Claude, Cursor, Codex, GitHub Copilot, Hugging Face, OpenAI API, LangChain, LangGraph, and Sarvam AI.",
      evidence: "src/data/skills.ts",
      confidence: "self-described",
      keywords: [
        "ai toolchain", "claude", "cursor", "codex", "github copilot",
        "hugging face", "openai api", "langchain", "langgraph", "sarvam ai",
      ],
      aliases: ["copilot", "hugging face", "openai", "sarvam"],
      relatedIds: ["ai-tools-coding", "ai-voice-skills", "genai-skills"],
    },

    // ─── PROJECT DETAILS ──────────────────────────────────────
    {
      id: "projects-overview",
      category: "projects",
      topic: "Project Portfolio Overview",
      content:
        "Anand's documented projects are ArogyaAI, CitizenForge, a PostgreSQL Knowledge Base RAG platform, Schema Intelligence, a Stock Market Real-Time Data Pipeline, Netflix Analytics with DBT, an IPL Data Analysis Dashboard, Churn Analysis & ML Dashboard, and MarketPulse Retail Analytics.",
      evidence: "src/data/projects.ts, user-verified resume",
      confidence: "self-described",
      keywords: [
        "projects", "portfolio", "list of projects", "what projects",
        "built", "ai projects", "data projects",
      ],
      aliases: ["project list", "portfolio projects"],
      relatedIds: [
        "projects-ai-and-agentic", "projects-data-engineering",
        "projects-analytics-bi",
      ],
    },
    {
      id: "projects-ai-and-agentic",
      category: "projects",
      topic: "AI & Agentic Projects",
      content:
        "Anand's AI-focused projects are ArogyaAI (an agentic healthcare AI platform), CitizenForge (an AI-powered campaign operations platform), a PostgreSQL Knowledge Base RAG platform using pgvector, and Schema Intelligence (an AI-powered database assistant).",
      evidence: "user-verified resume, src/data/skills.ts",
      confidence: "self-described",
      keywords: [
        "ai projects", "agentic projects", "rag project", "healthcare ai",
        "campaign operations", "knowledge base", "database assistant",
        "arogyaai", "citizenforge", "schema intelligence",
      ],
      aliases: ["ai projects", "rag projects", "agentic ai"],
      relatedIds: [
        "project-arogyaai", "project-citizenforge",
        "project-pgknowledgebase", "project-schemaintelligence", "genai-skills",
      ],
    },
    {
      id: "projects-data-engineering",
      category: "projects",
      topic: "Data Engineering Projects",
      content:
        "Anand's data engineering projects include a Stock Market Real-Time Data Pipeline using Kafka, AWS S3, AWS Glue, and Athena; Netflix Analytics with DBT, Snowflake, and AWS S3; and MarketPulse Retail Analytics using JavaScript, SQL, Python, and AWS.",
      evidence: "src/data/projects.ts",
      confidence: "self-described",
      keywords: [
        "data engineering projects", "data pipelines", "etl projects",
        "kafka project", "dbt project", "snowflake project",
        "stock market", "netflix", "marketpulse",
      ],
      aliases: ["data engineering projects", "pipeline projects"],
      relatedIds: [
        "project-stock-market", "project-netflix", "project-marketpulse",
        "data-skills",
      ],
    },
    {
      id: "projects-analytics-bi",
      category: "projects",
      topic: "Analytics & BI Projects",
      content:
        "Anand's analytics and business intelligence projects include Netflix Analytics with DBT and Power BI, an IPL Data Analysis Dashboard with 17 seasons of data, a Churn Analysis & ML Dashboard, and MarketPulse Retail Analytics.",
      evidence: "src/data/projects.ts",
      confidence: "self-described",
      keywords: [
        "analytics projects", "bi projects", "dashboard projects",
        "power bi projects", "ipl", "churn", "netflix analytics",
        "retail analytics",
      ],
      aliases: ["analytics projects", "dashboard projects", "power bi"],
      relatedIds: [
        "project-netflix", "project-ipl-dashboard", "project-churn",
        "project-marketpulse", "visualization-skills",
      ],
    },
    {
      id: "project-stock-market-github",
      category: "projects",
      topic: "Stock Market Pipeline Repository",
      content:
        "The Stock Market Real-Time Data Pipeline project is available at github.com/Anand-akm/stock-market-kafka-data-engineering-project. Its stack is Python, Kafka, AWS S3, AWS Glue, Athena, and SQL.",
      evidence: "src/data/projects.ts",
      confidence: "demonstrated",
      keywords: [
        "stock market github", "kafka repository", "stock pipeline link",
        "stock market project",
      ],
      aliases: ["stock market github", "kafka pipeline github"],
      relatedIds: ["project-stock-market", "projects-data-engineering"],
    },
    {
      id: "project-netflix-github",
      category: "projects",
      topic: "Netflix Analytics Repository",
      content:
        "The Netflix Analytics with DBT project is available at github.com/Anand-akm/netflix-analytics. Its stack is DBT, Snowflake, AWS S3, SQL, Python, and Power BI.",
      evidence: "src/data/projects.ts",
      confidence: "demonstrated",
      keywords: [
        "netflix github", "netflix repository", "netflix analytics link",
      ],
      aliases: ["netflix github", "netflix analytics github"],
      relatedIds: ["project-netflix", "projects-data-engineering"],
    },
    {
      id: "project-ipl-github",
      category: "projects",
      topic: "IPL Analytics Repository",
      content:
        "The IPL Data Analysis Dashboard project is available at github.com/Anand-akm/IPL-Analytics-Studio. Its stack is Power BI, DAX, Power Query, and SQL.",
      evidence: "src/data/projects.ts",
      confidence: "demonstrated",
      keywords: [
        "ipl github", "ipl repository", "ipl dashboard link",
      ],
      aliases: ["ipl github", "ipl analytics github"],
      relatedIds: ["project-ipl-dashboard", "projects-analytics-bi"],
    },
    {
      id: "project-marketpulse-github",
      category: "projects",
      topic: "MarketPulse Repository",
      content:
        "The MarketPulse Retail Analytics project is available at github.com/Anand-akm/marketpulse-retail. Its stack is JavaScript, SQL, Python, and AWS.",
      evidence: "src/data/projects.ts",
      confidence: "demonstrated",
      keywords: [
        "marketpulse github", "retail repository", "marketpulse link",
      ],
      aliases: ["marketpulse github", "retail analytics github"],
      relatedIds: ["project-marketpulse", "projects-data-engineering"],
    },

    // ─── CERTIFICATION DETAILS ────────────────────────────────
    {
      id: "certifications-overview",
      category: "certifications",
      topic: "Certifications Overview",
      content:
        "Anand holds five listed certifications: AWS Certified Data Engineer - Associate, DevOps, MLOps & LLMOps Engineering 1.0, The AI Generalist 1.0, Containers with Docker & Kubernetes, and Snowflake - The Complete Masterclass.",
      evidence: "src/data/certifications.ts",
      confidence: "demonstrated",
      keywords: [
        "certifications", "certificates", "credentials", "all certifications",
        "what certifications",
      ],
      aliases: ["certs", "certificates", "credentials"],
      relatedIds: [
        "cert-aws-dea", "cert-euron-devops", "cert-euron-ai",
        "cert-docker-k8s", "cert-snowflake",
      ],
    },
    {
      id: "certification-credential-ids",
      category: "certifications",
      topic: "Certification Credential IDs",
      content:
        "The credential IDs listed for Anand's certifications are DEA-C01 for AWS Certified Data Engineer - Associate, EURON-DMLO-1.0 for DevOps, MLOps & LLMOps Engineering 1.0, EURON-AIG-1.0 for The AI Generalist 1.0, COURSERA-DOCKER-K8S for Containers with Docker & Kubernetes, and UDEMY-SNOW-MC for Snowflake - The Complete Masterclass.",
      evidence: "src/data/certifications.ts",
      confidence: "demonstrated",
      keywords: [
        "credential id", "certificate id", "dea-c01", "verification id",
        "credential number",
      ],
      aliases: ["credential id", "certificate id", "dea-c01"],
      relatedIds: ["certifications-overview", "cert-aws-dea"],
    },
    {
      id: "certification-issuers",
      category: "certifications",
      topic: "Certification Issuers",
      content:
        "Anand's listed certification issuers are Amazon Web Services, Euron, Coursera, and Udemy. The AWS certification is from Amazon Web Services; two Euron certifications are from Euron; the Docker and Kubernetes certification is from Coursera; and the Snowflake masterclass is from Udemy.",
      evidence: "src/data/certifications.ts",
      confidence: "demonstrated",
      keywords: [
        "certification issuer", "who issued", "aws certification",
        "euron certification", "coursera", "udemy", "issuer",
      ],
      aliases: ["certification issuer", "issued by", "coursera", "udemy"],
      relatedIds: ["certifications-overview", "cert-aws-dea"],
    },

    // ─── ROLE DETAILS ─────────────────────────────────────────
    {
      id: "current-role-tech-stack",
      category: "experience",
      topic: "Current Role Technology Stack",
      content:
        "In his Associate Software Engineer role at EngageSphere (Euron), Anand's listed skills are Python, SQL, Data Engineering, AWS, GenAI, and Cloud Deployment.",
      evidence: "src/data/experience.ts",
      confidence: "self-described",
      keywords: [
        "current role skills", "euron stack", "current tech stack",
        "associate software engineer skills", "cloud deployment",
      ],
      aliases: ["current role stack", "euron skills"],
      relatedIds: ["experience-euron-ase", "genai-skills", "infrastructure-skills"],
    },
    {
      id: "internship-tech-stack",
      category: "experience",
      topic: "Data Analyst Internship Technology Stack",
      content:
        "In his Data Analyst Internship at EngageSphere (Euron), Anand's listed skills were Python, Power BI, Excel, Data Analytics, and PostgreSQL.",
      evidence: "src/data/experience.ts",
      confidence: "self-described",
      keywords: [
        "internship skills", "data analyst stack", "power bi", "excel",
        "postgresql", "data analytics internship",
      ],
      aliases: ["internship stack", "data analyst skills"],
      relatedIds: ["experience-euron-intern", "visualization-skills"],
    },
    {
      id: "work-location-history",
      category: "experience",
      topic: "Work Locations & Work Mode",
      content:
        "Anand is based in Pune, India. His Associate Software Engineer role at EngageSphere (Euron) is listed as Full-time and Remote from February 2026 to August 2026. His Data Analyst Internship at the same company was based in Noida, Uttar Pradesh, India from November 2025 to February 2026.",
      evidence: "src/data/profile.ts, src/data/experience.ts",
      confidence: "self-described",
      keywords: [
        "work location", "remote", "onsite", "noida", "pune", "work mode",
        "where does anand work",
      ],
      aliases: ["remote", "noida", "work mode"],
      relatedIds: [
        "profile-location", "experience-euron-ase", "experience-euron-intern",
      ],
    },
    {
      id: "role-fit-data-engineer",
      category: "profile",
      topic: "Data Engineer Role Fit",
      content:
        "Anand's background supports data engineering roles through Python, SQL, DBT, Snowflake, ETL/ELT, PostgreSQL, pgvector, BM25, AWS, Kafka, Glue, Athena, and Power BI. His projects include a stock market streaming pipeline, Netflix DBT analytics, a churn ETL and ML dashboard, and retail analytics. He also holds the AWS Certified Data Engineer - Associate certification.",
      evidence: "src/data/skills.ts, src/data/projects.ts, src/data/certifications.ts",
      confidence: "self-described",
      keywords: [
        "data engineer role", "data engineering fit", "data engineer position",
        "etl", "data warehouse", "kafka", "snowflake", "dbt",
      ],
      aliases: ["data engineer fit", "data engineering roles"],
      relatedIds: [
        "data-skills", "cert-aws-dea", "projects-data-engineering",
        "projects-analytics-bi",
      ],
    },
    {
      id: "role-fit-software-engineer",
      category: "profile",
      topic: "Software Engineer Role Fit",
      content:
        "Anand's background supports software engineering roles through Python, FastAPI, Node.js, SQLAlchemy, PostgreSQL, and Redis for backend development, plus Docker, Kubernetes/EKS, AWS, Terraform, GitHub Actions, CI/CD, Git, and Linux for deployment. He currently works as an Associate Software Engineer at EngageSphere (Euron) and has delivered production software to clients.",
      evidence: "src/data/skills.ts, src/data/experience.ts, user-verified information",
      confidence: "self-described",
      keywords: [
        "software engineer role", "backend engineer", "software engineering fit",
        "backend", "fastapi", "node.js", "deployment",
      ],
      aliases: ["software engineer fit", "backend role"],
      relatedIds: [
        "backend-skills", "infrastructure-skills", "experience-euron-ase",
        "production-experience",
      ],
    },
  ],
};
