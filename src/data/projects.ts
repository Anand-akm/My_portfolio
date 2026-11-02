import type { Project } from "@/types";

export const projects: Project[] = [
  {
    title: "Stock Market Real-Time Data Pipeline",
    description:
      "End-to-end streaming pipeline processing stock market data with Kafka, AWS Glue, and Athena for real-time analytics and market insights.",
    tech: ["Python", "Kafka", "AWS S3", "AWS Glue", "Athena", "SQL"],
    github:
      "https://github.com/Anand-akm/stock-market-kafka-data-engineering-project",
    demo: "",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
    category: "Data Engineering",
    highlights: ["Real-time streaming", "Cloud-native ETL", "Market analytics"],
  },
  {
    title: "Netflix Analytics with DBT",
    description:
      "Cloud analytics pipeline using DBT, Snowflake, and AWS S3 for content trend analysis and scalable data warehousing.",
    tech: ["DBT", "Snowflake", "AWS S3", "SQL", "Python", "Power BI"],
    github: "https://github.com/Anand-akm/netflix-analytics",
    demo: "",
    image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800",
    category: "Analytics",
    highlights: ["Data modeling", "Cloud warehouse", "Trend analysis"],
  },
  {
    title: "IPL Data Analysis Dashboard",
    description:
      "Interactive Power BI dashboard with 17 seasons of IPL data, advanced DAX KPIs, drill-through pages, and player insights.",
    tech: ["Power BI", "DAX", "Power Query", "SQL"],
    github: "https://github.com/Anand-akm/IPL-Analytics-Studio",
    demo: "",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
    category: "Analytics",
    highlights: [
      "Advanced visualizations",
      "KPI dashboards",
      "Sports analytics",
    ],
  },
  {
    title: "Churn Analysis & ML Dashboard",
    description:
      "ETL pipeline with machine learning-powered churn prediction and Power BI dashboards for customer retention strategies.",
    tech: ["Python", "SQL Server", "Power BI", "Machine Learning"],
    github: "",
    demo: "",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
    category: "ML/Analytics",
    highlights: ["Churn prediction", "ML models", "Business intelligence"],
  },
  {
    title: "MarketPulse Retail Analytics",
    description:
      "Retail analytics platform for data-driven insights and inventory management using modern data stack.",
    tech: ["JavaScript", "SQL", "Python", "AWS"],
    github: "https://github.com/Anand-akm/marketpulse-retail",
    demo: "",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
    category: "Analytics",
    highlights: ["Retail analytics", "Inventory insights", "Data pipeline"],
  },
];
