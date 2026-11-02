export interface SuggestedQuestion {
  id: string;
  question: string;
  knowledgeIds: string[];
  category: "overview" | "skills" | "experience" | "projects" | "certifications" | "education";
}

export const suggestedQuestions: SuggestedQuestion[] = [
  {
    id: "about",
    question: "Tell me about Anand.",
    knowledgeIds: ["profile-summary", "profile-location"],
    category: "overview",
  },
  {
    id: "genai",
    question: "What GenAI technologies has Anand worked with?",
    knowledgeIds: ["genai-skills", "genai-experience"],
    category: "skills",
  },
  {
    id: "rag",
    question: "What RAG systems has Anand built?",
    knowledgeIds: ["project-pgknowledgebase", "genai-skills", "genai-experience"],
    category: "projects",
  },
  {
    id: "backend",
    question: "What backend technologies does Anand use?",
    knowledgeIds: ["backend-skills"],
    category: "skills",
  },
  {
    id: "arogyaai",
    question: "Tell me about ArogyaAI.",
    knowledgeIds: ["project-arogyaai"],
    category: "projects",
  },
  {
    id: "citizenforge",
    question: "Tell me about CitizenForge.",
    knowledgeIds: ["project-citizenforge"],
    category: "projects",
  },
  {
    id: "experience",
    question: "What was Anand's experience at Euron?",
    knowledgeIds: ["experience-euron-ase", "experience-euron-intern", "career-overview"],
    category: "experience",
  },
  {
    id: "education",
    question: "What is Anand's educational background?",
    knowledgeIds: ["education-btech"],
    category: "education",
  },
  {
    id: "certifications",
    question: "What certifications does Anand hold?",
    knowledgeIds: [
      "cert-aws-dea", "cert-euron-devops", "cert-euron-ai",
      "cert-docker-k8s", "cert-snowflake",
    ],
    category: "certifications",
  },
  {
    id: "ai-coding",
    question: "How does Anand use AI tools in his development workflow?",
    knowledgeIds: ["ai-tools-coding", "production-experience"],
    category: "skills",
  },
];
