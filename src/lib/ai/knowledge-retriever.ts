import type {
  KnowledgeBase,
  KnowledgeEntry,
  KnowledgeCategory,
} from "@/types/ai";
import { knowledgeBase } from "@/data/ai-knowledge";

export interface RetrievalResult {
  entries: ScoredEntry[];
  queryTokens: string[];
  hasMatches: boolean;
}

export interface ScoredEntry {
  entry: KnowledgeEntry;
  score: number;
  matchedKeywords: string[];
  matchedAliases: string[];
}

const STOP_WORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "shall", "can", "need", "dare", "ought",
  "used", "to", "of", "in", "for", "on", "with", "at", "by", "from",
  "as", "into", "through", "during", "before", "after", "above", "below",
  "between", "out", "off", "over", "under", "again", "further", "then",
  "once", "here", "there", "when", "where", "why", "how", "all", "both",
  "each", "few", "more", "most", "other", "some", "such", "no", "nor",
  "not", "only", "own", "same", "so", "than", "too", "very", "just",
  "don", "now", "and", "but", "or", "if", "while", "that", "this",
  "these", "those", "what", "which", "who", "whom", "whose", "me",
  "my", "we", "our", "you", "your", "he", "him", "his", "she", "her",
  "it", "its", "they", "them", "their", "about", "tell", "know",
  "much", "many", "also", "any", "up", "get", "got", "like", "best",
]);

const DEFAULT_MIN_SCORE = 2;

/**
 * Normalize a token enough to make "project" match "projects",
 * "certification" match "certifications", and "technology" match
 * "technologies" without introducing broad substring matching.
 */
function stem(token: string): string {
  if (token.length > 4 && token.endsWith("ies")) {
    return `${token.slice(0, -3)}y`;
  }
  if (token.length > 4 && token.endsWith("ing")) {
    return token.slice(0, -3);
  }
  if (token.length > 3 && token.endsWith("s") && !token.endsWith("ss")) {
    return token.slice(0, -1);
  }
  return token;
}

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s.\/-]/g, " ")
    .split(/\s+/)
    .map((token) => token.replace(/^[.\/-]+|[.\/-]+$/g, ""))
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

function normalizePhrase(text: string): string[] {
  return tokenize(text).map(stem);
}

function phraseMatches(queryTokens: Set<string>, phrase: string): boolean {
  const phraseTokens = normalizePhrase(phrase);
  if (phraseTokens.length === 0) return false;
  return phraseTokens.every((token) => queryTokens.has(token));
}

export function retrieveRelevant(
  query: string,
  options?: {
    category?: KnowledgeCategory;
    maxResults?: number;
    minScore?: number;
  }
): RetrievalResult {
  const queryTokens = tokenize(query);
  const queryTokenSet = new Set(queryTokens.map(stem));
  const maxResults = options?.maxResults ?? 10;
  const minScore = options?.minScore ?? DEFAULT_MIN_SCORE;

  const entries = options?.category
    ? knowledgeBase.entries.filter((e) => e.category === options.category)
    : knowledgeBase.entries;

  const scored: ScoredEntry[] = entries.map((entry) => {
    const matchedKeywords: string[] = [];
    const matchedAliases: string[] = [];
    let primaryScore = 0;

    // Aliases are the strongest signal. Each matching alias phrase is
    // counted once, even if it contains multiple query tokens.
    for (const alias of entry.aliases) {
      if (phraseMatches(queryTokenSet, alias)) {
        matchedAliases.push(alias);
        primaryScore += 3;
      }
    }

    // Keywords are the next strongest signal.
    for (const keyword of entry.keywords) {
      if (phraseMatches(queryTokenSet, keyword)) {
        matchedKeywords.push(keyword);
        primaryScore += 2;
      }
    }

    // A topic can provide a signal when at least two meaningful query
    // tokens appear in it. A single common word is not enough.
    const topicTokens = new Set(normalizePhrase(entry.topic));
    const topicOverlap = [...queryTokenSet].filter((t) =>
      topicTokens.has(t)
    ).length;
    if (topicOverlap >= 2) {
      primaryScore += 2;
    }

    // Content can only strengthen an entry that already has a real
    // keyword, alias, or topic signal. It can never create a match alone.
    let contentBonus = 0;
    if (primaryScore > 0) {
      const contentLower = entry.content.toLowerCase();
      for (const token of new Set(queryTokens)) {
        if (token.length >= 3 && contentLower.includes(token)) {
          contentBonus += 1;
        }
      }
    }

    // Confidence is metadata, not a relevance signal.
    return {
      entry,
      score: primaryScore + contentBonus,
      matchedKeywords,
      matchedAliases,
    };
  });

  const filtered = scored
    .filter((s) => s.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);

  // Related entries only get a small tie-break boost when both entries
  // were already considered relevant.
  const matchedIds = new Set(filtered.map((f) => f.entry.id));
  for (const item of filtered) {
    for (const relatedId of item.entry.relatedIds) {
      if (matchedIds.has(relatedId)) {
        item.score += 1;
      }
    }
  }

  filtered.sort((a, b) => b.score - a.score);

  return {
    entries: filtered,
    queryTokens,
    hasMatches: filtered.length > 0,
  };
}

export function getEntryById(id: string): KnowledgeEntry | undefined {
  return knowledgeBase.entries.find((e) => e.id === id);
}

export function getEntriesByCategory(
  category: KnowledgeCategory
): KnowledgeEntry[] {
  return knowledgeBase.entries.filter((e) => e.category === category);
}

export function getRelatedEntries(entryId: string): KnowledgeEntry[] {
  const entry = getEntryById(entryId);
  if (!entry) return [];
  return entry.relatedIds
    .map((id) => getEntryById(id))
    .filter((e): e is KnowledgeEntry => e !== undefined);
}

export function getKnowledgeBase(): KnowledgeBase {
  return knowledgeBase;
}

export { DEFAULT_MIN_SCORE };
