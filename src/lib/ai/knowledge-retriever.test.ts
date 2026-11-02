import { describe, it, expect } from "vitest";
import {
  tokenize,
  retrieveRelevant,
  getEntryById,
  getEntriesByCategory,
  getRelatedEntries,
  getKnowledgeBase,
} from "@/lib/ai/knowledge-retriever";
import { knowledgeBase } from "@/data/ai-knowledge";
import { suggestedQuestions } from "@/data/suggested-questions";

describe("knowledge-retriever", () => {
  describe("tokenize", () => {
    it("tokenizes lowercase text", () => {
      const tokens = tokenize("What GenAI technologies does Anand use?");
      expect(tokens).toContain("genai");
      expect(tokens).toContain("technologies");
      expect(tokens).toContain("anand");
    });

    it("removes stop words", () => {
      const tokens = tokenize("What is the best technology?");
      expect(tokens).not.toContain("what");
      expect(tokens).not.toContain("is");
      expect(tokens).not.toContain("the");
      expect(tokens).not.toContain("best");
    });

    it("handles empty input", () => {
      const tokens = tokenize("");
      expect(tokens).toEqual([]);
    });

    it("handles special characters", () => {
      const tokens = tokenize("RAG & LLM applications!");
      expect(tokens).toContain("rag");
      expect(tokens).toContain("llm");
      expect(tokens).toContain("applications");
    });

    it("strips trailing sentence punctuation", () => {
      expect(tokenize("Tell me about Anand.")).toEqual(["anand"]);
      expect(tokenize("Node.js?")).toEqual(["node.js"]);
    });
  });

  describe("retrieveRelevant", () => {
    it("returns relevant entries for a GenAI query", () => {
      const result = retrieveRelevant("What GenAI technologies does Anand use?");
      expect(result.hasMatches).toBe(true);
      expect(result.entries.length).toBeGreaterThan(0);
      // genai-skills should be near the top
      const ids = result.entries.map((e) => e.entry.id);
      expect(ids).toContain("genai-skills");
    });

    it("returns relevant entries for a RAG query", () => {
      const result = retrieveRelevant("What RAG systems has Anand built?");
      expect(result.hasMatches).toBe(true);
      const ids = result.entries.map((e) => e.entry.id);
      expect(ids).toContain("project-pgknowledgebase");
    });

    it("returns relevant entries for a project query", () => {
      const result = retrieveRelevant("Tell me about ArogyaAI");
      expect(result.hasMatches).toBe(true);
      const ids = result.entries.map((e) => e.entry.id);
      expect(ids).toContain("project-arogyaai");
    });

    it("retrieves the profile overview for a punctuated suggestion", () => {
      const result = retrieveRelevant("Tell me about Anand.");
      expect(result.hasMatches).toBe(true);
      const ids = result.entries.map((e) => e.entry.id);
      expect(ids).toContain("profile-summary");
    });

    it("retrieves the intended knowledge for every suggested question", () => {
      for (const suggestion of suggestedQuestions) {
        const result = retrieveRelevant(suggestion.question);
        const ids = result.entries.map((entry) => entry.entry.id);
        const expected = suggestion.knowledgeIds.some((id) =>
          ids.includes(id)
        );
        expect(
          expected,
          `${suggestion.question} should retrieve one of ${suggestion.knowledgeIds.join(", ")}; got ${ids.join(", ")}`
        ).toBe(true);
      }
    });

    it("returns relevant entries for an education query", () => {
      const result = retrieveRelevant("What is Anand's education?");
      expect(result.hasMatches).toBe(true);
      const ids = result.entries.map((e) => e.entry.id);
      expect(ids).toContain("education-btech");
    });

    it("returns relevant entries for a certification query", () => {
      const result = retrieveRelevant("What certifications does Anand hold?");
      expect(result.hasMatches).toBe(true);
      const certIds = result.entries
        .filter((e) => e.entry.category === "certifications")
        .map((e) => e.entry.id);
      expect(certIds.length).toBeGreaterThan(0);
    });

    it("returns relevant entries for an experience query", () => {
      const result = retrieveRelevant("Tell me about Anand's experience at Euron");
      expect(result.hasMatches).toBe(true);
      const ids = result.entries.map((e) => e.entry.id);
      expect(ids).toContain("experience-euron-ase");
    });

    it("retrieves by alias", () => {
      const result = retrieveRelevant("Tell me about LPU");
      expect(result.hasMatches).toBe(true);
      const ids = result.entries.map((e) => e.entry.id);
      expect(ids).toContain("education-btech");
    });

    it("returns no matches for completely unrelated query", () => {
      const result = retrieveRelevant("What is the weather in Tokyo?");
      // Should return some results due to broad keyword matching on "what"
      // but scores should be low and specific entries shouldn't match
      const specificIds = result.entries
        .filter((e) => e.score > 4)
        .map((e) => e.entry.id);
      expect(specificIds).not.toContain("project-arogyaai");
      expect(specificIds).not.toContain("education-btech");
    });

    it("respects category filter", () => {
      const result = retrieveRelevant("stock market pipeline", {
        category: "projects",
      });
      expect(result.hasMatches).toBe(true);
      for (const entry of result.entries) {
        expect(entry.entry.category).toBe("projects");
      }
    });

    it("respects maxResults", () => {
      const result = retrieveRelevant("Anand", { maxResults: 3 });
      expect(result.entries.length).toBeLessThanOrEqual(3);
    });

    it("returns scored entries with matchedKeywords", () => {
      const result = retrieveRelevant("What RAG systems has Anand built?");
      expect(result.entries.length).toBeGreaterThan(0);
      const top = result.entries[0];
      expect(top.score).toBeGreaterThan(0);
      expect(top.matchedKeywords.length).toBeGreaterThan(0);
    });

    it("boosts related entries that are also matched", () => {
      const result = retrieveRelevant(
        "What GenAI technologies does Anand work with? Tell me about his projects."
      );
      expect(result.hasMatches).toBe(true);
      // Multiple categories should be represented
      const categories = new Set(result.entries.map((e) => e.entry.category));
      expect(categories.size).toBeGreaterThan(1);
    });
  });

  describe("getEntryById", () => {
    it("returns an entry by id", () => {
      const entry = getEntryById("profile-summary");
      expect(entry).toBeDefined();
      expect(entry!.topic).toContain("Anand Kumar Mishra");
    });

    it("returns undefined for unknown id", () => {
      const entry = getEntryById("nonexistent-id");
      expect(entry).toBeUndefined();
    });
  });

  describe("getEntriesByCategory", () => {
    it("returns entries for a category", () => {
      const entries = getEntriesByCategory("projects");
      expect(entries.length).toBeGreaterThan(0);
      for (const entry of entries) {
        expect(entry.category).toBe("projects");
      }
    });

    it("returns empty array for unused category", () => {
      // achievements has one entry (unknown-achievements)
      const entries = getEntriesByCategory("achievements");
      expect(entries.length).toBe(1);
    });
  });

  describe("getRelatedEntries", () => {
    it("returns related entries", () => {
      const related = getRelatedEntries("genai-skills");
      expect(related.length).toBeGreaterThan(0);
      const ids = related.map((e) => e.id);
      expect(ids).toContain("ai-voice-skills");
    });

    it("returns empty array for unknown entry", () => {
      const related = getRelatedEntries("nonexistent");
      expect(related).toEqual([]);
    });
  });

  describe("getKnowledgeBase", () => {
    it("returns the knowledge base", () => {
      const kb = getKnowledgeBase();
      expect(kb.version).toBe(knowledgeBase.version);
      expect(kb.entries.length).toBe(knowledgeBase.entries.length);
    });

    it("all entries have required fields", () => {
      for (const entry of knowledgeBase.entries) {
        expect(entry.id).toBeTruthy();
        expect(entry.topic).toBeTruthy();
        expect(entry.content).toBeTruthy();
        expect(entry.evidence).toBeTruthy();
        expect(entry.keywords.length).toBeGreaterThan(0);
        expect(entry.aliases.length).toBeGreaterThan(0);
      }
    });

    it("contains between 50 and 100 unique verified entries", () => {
      const ids = knowledgeBase.entries.map((entry) => entry.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(ids.length).toBeGreaterThanOrEqual(50);
      expect(ids.length).toBeLessThanOrEqual(100);
    });

    it("all relatedIds reference valid entries", () => {
      const validIds = new Set(knowledgeBase.entries.map((e) => e.id));
      for (const entry of knowledgeBase.entries) {
        for (const relatedId of entry.relatedIds) {
          expect(validIds.has(relatedId)).toBe(true);
        }
      }
    });

    it("all categories are valid", () => {
      const validCategories = [
        "profile", "experience", "skills", "projects",
        "certifications", "education", "achievements",
      ];
      for (const entry of knowledgeBase.entries) {
        expect(validCategories).toContain(entry.category);
      }
    });

    it("unknown-achievements has evidence 'not-provided'", () => {
      const entry = getEntryById("unknown-achievements");
      expect(entry).toBeDefined();
      expect(entry!.evidence).toBe("not-provided");
      expect(entry!.confidence).toBe("partial");
    });
  });
});
