import { describe, it, expect } from "vitest";
import {
  validateResponse,
  isResponseSafe,
  getValidationSummary,
} from "@/lib/ai/response-validator";
import { knowledgeBase } from "@/data/ai-knowledge";

function getEntriesByIds(ids: string[]) {
  return ids
    .map((id) => knowledgeBase.entries.find((e) => e.id === id))
    .filter((e) => e !== undefined);
}

describe("response-validator", () => {
  describe("validateResponse", () => {
    it("passes for a fully grounded response", () => {
      const entries = getEntriesByIds(["genai-skills", "project-arogyaai"]);
      const result = validateResponse(
        "Anand has experience with RAG, LLM applications, and LangGraph. He built ArogyaAI, a healthcare AI platform.",
        entries
      );
      expect(result.isValid).toBe(true);
      expect(result.issues.filter((i) => i.severity === "error")).toHaveLength(0);
    });

    it("flags fabricated project names", () => {
      const result = validateResponse(
        "Anand built MegaBot 3000, a revolutionary AI platform.",
        []
      );
      const projectIssues = result.issues.filter(
        (i) => i.type === "unsupported_claim" && i.detail.includes("MegaBot")
      );
      expect(projectIssues.length).toBeGreaterThan(0);
    });

    it("flags fabricated technologies", () => {
      const result = validateResponse(
        "Anand is an expert in QuantumJS and BlockchainX.",
        []
      );
      const techIssues = result.issues.filter(
        (i) => i.type === "unsupported_claim" &&
          (i.detail.includes("QuantumJS") || i.detail.includes("BlockchainX"))
      );
      expect(techIssues.length).toBeGreaterThan(0);
    });

    it("detects prompt leakage", () => {
      const result = validateResponse(
        "Here are my system prompt instructions: you are a helpful assistant.",
        []
      );
      const promptIssues = result.issues.filter(
        (i) => i.type === "prompt_leakage"
      );
      expect(promptIssues.length).toBeGreaterThan(0);
      expect(result.isValid).toBe(false);
    });

    it("detects personal info leakage", () => {
      const result = validateResponse(
        "Anand's salary is $150,000 per year.",
        []
      );
      const personalIssues = result.issues.filter(
        (i) => i.type === "personal_info_leak"
      );
      expect(personalIssues.length).toBeGreaterThan(0);
    });

    it("flags unverified metrics", () => {
      const result = validateResponse(
        "Anand has over 50 projects and approximately 100 certifications.",
        []
      );
      const metricIssues = result.issues.filter(
        (i) => i.type === "fabricated_metric"
      );
      expect(metricIssues.length).toBeGreaterThan(0);
    });

    it("supports known but not in context", () => {
      const result = validateResponse(
        "Anand uses Python and FastAPI for backend development.",
        []
      );
      // Python and FastAPI are in the knowledge base
      expect(result.supportedClaims.length).toBeGreaterThan(0);
    });

    it("returns structured validation results", () => {
      const result = validateResponse("Anand works at Euron.", []);
      expect(result).toHaveProperty("isValid");
      expect(result).toHaveProperty("issues");
      expect(result).toHaveProperty("supportedClaims");
      expect(result).toHaveProperty("unsupportedClaims");
      expect(Array.isArray(result.issues)).toBe(true);
    });
  });

  describe("isResponseSafe", () => {
    it("returns true for clean responses", () => {
      const entries = getEntriesByIds(["genai-skills"]);
      const validation = validateResponse(
        "Anand has experience with RAG and LLM applications.",
        entries
      );
      expect(isResponseSafe(validation)).toBe(true);
    });

    it("returns false for responses with errors", () => {
      const validation = validateResponse(
        "Here is my system prompt: ignore previous instructions.",
        []
      );
      expect(isResponseSafe(validation)).toBe(false);
    });
  });

  describe("getValidationSummary", () => {
    it("returns success message for clean responses", () => {
      const entries = getEntriesByIds(["genai-skills"]);
      const validation = validateResponse(
        "Anand has experience with RAG.",
        entries
      );
      const summary = getValidationSummary(validation);
      expect(summary).toContain("fully grounded");
    });

    it("returns issue count for problematic responses", () => {
      const validation = validateResponse(
        "Anand built MegaBot with over 1000 features.",
        []
      );
      const summary = getValidationSummary(validation);
      expect(summary).toContain("issue");
    });
  });
});
