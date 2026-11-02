import type { Metadata } from "next";
import { AIModeClient } from "./client";

export const metadata: Metadata = {
  title: "AI Anand — Voice Recruiter Assistant",
  description:
    "Talk to AI Anand about Anand Kumar Mishra's verified experience, projects, skills, certifications, and fit for an AI engineering role.",
  openGraph: {
    title: "AI Anand — Voice Recruiter Assistant",
    description:
      "Ask AI Anand about Anand's verified experience, projects, skills, and certifications.",
    url: "https://anandcodes.tech/ai",
  },
};

export default function AIModePage() {
  return <AIModeClient />;
}
