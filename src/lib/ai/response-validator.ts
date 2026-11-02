import type { KnowledgeEntry } from "@/types/ai";
import { knowledgeBase } from "@/data/ai-knowledge";

export interface ValidationResult {
  isValid: boolean;
  issues: ValidationIssue[];
  supportedClaims: string[];
  unsupportedClaims: string[];
}

export interface ValidationIssue {
  type: IssueType;
  detail: string;
  severity: "error" | "warning";
}

export type IssueType =
  | "fabricated_company"
  | "fabricated_project"
  | "fabricated_technology"
  | "fabricated_date"
  | "fabricated_metric"
  | "unsupported_claim"
  | "prompt_leakage"
  | "personal_info_leak";

function extractAllKnownTerms(): {
  companies: Set<string>;
  projects: Set<string>;
  technologies: Set<string>;
  certifications: Set<string>;
} {
  const companies = new Set<string>();
  const projects = new Set<string>();
  const technologies = new Set<string>();
  const certifications = new Set<string>();

  for (const entry of knowledgeBase.entries) {
    // Extract companies from experience entries
    if (entry.category === "experience") {
      for (const kw of entry.keywords) {
        if (
          kw === "euron" ||
          kw === "engagesphere"
        ) {
          companies.add(kw);
        }
      }
      for (const alias of entry.aliases) {
        companies.add(alias.toLowerCase());
      }
    }

    // Extract project names
    if (entry.category === "projects") {
      for (const alias of entry.aliases) {
        projects.add(alias.toLowerCase());
      }
      for (const kw of entry.keywords) {
        if (kw.includes("project") || kw.includes("pipeline") || kw.includes("dashboard") || kw.includes("platform")) {
          // Skip generic terms
          if (kw.length > 4) projects.add(kw);
        }
      }
    }

    // Extract technologies from skills entries
    if (entry.category === "skills") {
      for (const kw of entry.keywords) {
        technologies.add(kw.toLowerCase());
      }
      for (const alias of entry.aliases) {
        technologies.add(alias.toLowerCase());
      }
    }

    // Extract certification names
    if (entry.category === "certifications") {
      for (const kw of entry.keywords) {
        certifications.add(kw.toLowerCase());
      }
    }
  }

  return { companies, projects, technologies, certifications };
}

const KNOWN_TERMS = extractAllKnownTerms();

const DANGEROUS_TERNS = [
  /system\s*prompt/i,
  /api\s*key/i,
  /secret/i,
  /password/i,
  /token/i,
  /instructions?\s+above/i,
  /ignore\s+(previous|above|all)/i,
  /you\s+are\s+now/i,
  /pretend\s+you/i,
  /act\s+as\s+if/i,
  /forget\s+(your|all|previous)/i,
];

const PERSONAL_PATTERNS = [
  /salary/i,
  /annual\s+income/i,
  /bank\s+account/i,
  /credit\s+card/i,
  /social\s+security/i,
  /date\s+of\s+birth/i,
  /home\s+address/i,
];

function containsTerm(text: string, terms: Set<string>): string[] {
  const textLower = text.toLowerCase();
  const found: string[] = [];
  for (const term of terms) {
    if (term.length >= 3 && textLower.includes(term)) {
      found.push(term);
    }
  }
  return found;
}

function normalizeEntity(text: string): string {
  return text
    .replace(/[.,;:!?)]+$/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function allTermsAppearInContext(
  phrase: string,
  contextEntries: KnowledgeEntry[]
): boolean {
  const contextText = contextEntries
    .map((entry) => `${entry.topic} ${entry.content} ${entry.aliases.join(" ")}`)
    .join(" ")
    .toLowerCase();

  const terms = normalizeEntity(phrase)
    .split(/\s+/)
    .filter((term) => term.length > 2);

  return terms.length > 0 && terms.every((term) => contextText.includes(term));
}

function detectUnverifiedEmployers(
  response: string,
  contextEntries: KnowledgeEntry[]
): string[] {
  const patterns = [
    /\b(?:works?|worked|working|employed)\s+(?:at|for)\s+([A-Z][\w&.'-]*(?:\s+[A-Z][\w&.'-]*)*)/g,
    /\b(?:joined|joins|joining)\s+([A-Z][\w&.'-]*(?:\s+[A-Z][\w&.'-]*)*)/g,
  ];

  const unknown = new Set<string>();
  for (const pattern of patterns) {
    for (const match of response.matchAll(pattern)) {
      const employer = normalizeEntity(match[1]);
      if (
        employer.length > 2 &&
        !allTermsAppearInContext(employer, contextEntries) &&
        !allTermsAppearInContext(employer, knowledgeBase.entries)
      ) {
        unknown.add(employer);
      }
    }
  }

  return [...unknown];
}

function detectUnverifiedCertifications(
  response: string,
  contextEntries: KnowledgeEntry[]
): string[] {
  const pattern =
    /\b(?:holds?|earned|completed|received|has)\s+(?:the\s+|a\s+|an\s+)?(.{3,100}?)\s+certification\b/gi;
  const unknown = new Set<string>();

  for (const match of response.matchAll(pattern)) {
    const certification = normalizeEntity(match[1]);
    if (
      certification.length > 2 &&
      !allTermsAppearInContext(certification, contextEntries)
    ) {
      unknown.add(certification);
    }
  }

  return [...unknown];
}

/**
 * Detect capitalized proper nouns that are NOT in any verified knowledge entry.
 * These could be fabricated names (companies, projects, technologies).
 * Builds a "known" set from all entry keywords, aliases, topics, and content.
 */
function detectUnknownProperNouns(
  text: string,
  allEntries: KnowledgeEntry[]
): string[] {
  const allKnown = new Set<string>();
  for (const entry of allEntries) {
    for (const kw of entry.keywords) allKnown.add(kw.toLowerCase());
    for (const alias of entry.aliases) allKnown.add(alias.toLowerCase());
    if (entry.topic) {
      // Split topic on whitespace to catch individual words like "Anand"
      for (const word of entry.topic.split(/\s+/)) {
        const clean = word.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
        if (clean.length >= 3) allKnown.add(clean);
      }
    }
    // Also check content words (split on whitespace, min 3 chars)
    for (const word of entry.content.split(/\s+/)) {
      const clean = word.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
      if (clean.length >= 3) allKnown.add(clean);
    }
  }

  // Match capitalized words (potential proper nouns) — at least 3 chars
  const properNounPattern = /\b([A-Z][a-zA-Z]{2,})\b/g;
  const matches = text.match(properNounPattern) || [];
  const unknown: string[] = [];
  const seen = new Set<string>();

  for (const match of matches) {
    const lower = match.toLowerCase();
    // Skip all-caps words (acronyms like RAG, LLM, API)
    if (match === match.toUpperCase()) continue;
    if (!seen.has(lower) && !allKnown.has(lower)) {
      seen.add(lower);
      unknown.push(match);
    }
  }

  return unknown;
}

export function validateResponse(
  response: string,
  contextEntries: KnowledgeEntry[] = []
): ValidationResult {
  const issues: ValidationIssue[] = [];
  const supportedClaims: string[] = [];
  const unsupportedClaims: string[] = [];

  // 1. Check for prompt leakage
  for (const pattern of DANGEROUS_TERNS) {
    if (pattern.test(response)) {
      issues.push({
        type: "prompt_leakage",
        detail: `Response may contain prompt injection or system prompt leakage: ${pattern.source}`,
        severity: "error",
      });
    }
  }

  // 2. Check for personal info leakage
  for (const pattern of PERSONAL_PATTERNS) {
    if (pattern.test(response)) {
      issues.push({
        type: "personal_info_leak",
        detail: `Response may contain private personal information: ${pattern.source}`,
        severity: "error",
      });
    }
  }

  // 3. Build a set of terms that appear in the retrieved context
  const contextTerms = new Set<string>();
  for (const entry of contextEntries) {
    for (const kw of entry.keywords) {
      contextTerms.add(kw.toLowerCase());
    }
    for (const alias of entry.aliases) {
      contextTerms.add(alias.toLowerCase());
    }
  }

  // 4. Check companies — only flag if mentioned but NOT in context or knowledge base
  const mentionedCompanies = containsTerm(response, KNOWN_TERMS.companies);
  for (const company of mentionedCompanies) {
    if (contextTerms.has(company)) {
      supportedClaims.push(`Company mentioned: ${company}`);
    } else if (KNOWN_TERMS.companies.has(company)) {
      supportedClaims.push(`Company known but not in context: ${company}`);
    } else {
      unsupportedClaims.push(`Potential unverified company: ${company}`);
    }
  }

  // 5. Check employer claims (e.g. "worked at Google")
  for (const employer of detectUnverifiedEmployers(response, contextEntries)) {
    issues.push({
      type: "fabricated_company",
      detail: `Response claims an unverified employer: "${employer}"`,
      severity: "error",
    });
    unsupportedClaims.push(`Unverified employer: ${employer}`);
  }

  // 6. Check certification claims
  for (const certification of detectUnverifiedCertifications(
    response,
    contextEntries
  )) {
    issues.push({
      type: "unsupported_claim",
      detail: `Response claims an unverified certification: "${certification}"`,
      severity: "error",
    });
    unsupportedClaims.push(`Unverified certification: ${certification}`);
  }

  // 7. Check projects
  const mentionedProjects = containsTerm(response, KNOWN_TERMS.projects);
  for (const project of mentionedProjects) {
    if (contextTerms.has(project)) {
      supportedClaims.push(`Project mentioned: ${project}`);
    } else if (KNOWN_TERMS.projects.has(project)) {
      supportedClaims.push(`Project known but not in context: ${project}`);
    } else {
      issues.push({
        type: "fabricated_project",
        detail: `Response mentions project "${project}" that is not in verified knowledge`,
        severity: "warning",
      });
      unsupportedClaims.push(`Potential unverified project: ${project}`);
    }
  }

  // 6. Check technologies
  const mentionedTechs = containsTerm(response, KNOWN_TERMS.technologies);
  for (const tech of mentionedTechs) {
    if (contextTerms.has(tech)) {
      supportedClaims.push(`Technology mentioned: ${tech}`);
    } else if (KNOWN_TERMS.technologies.has(tech)) {
      supportedClaims.push(`Technology known but not in context: ${tech}`);
    } else {
      issues.push({
        type: "fabricated_technology",
        detail: `Response mentions technology "${tech}" that is not in verified knowledge`,
        severity: "warning",
      });
      unsupportedClaims.push(`Potential unverified technology: ${tech}`);
    }
  }

  // 8. Check for unverified dates
  const datePattern = /\b(20[0-2]\d|19\d{2})\b/g;
  const dates = response.match(datePattern) || [];
  for (const date of dates) {
    const year = parseInt(date, 10);
    if (year < 2020 || year > 2027) {
      issues.push({
        type: "fabricated_date",
        detail: `Response contains unusual date: ${date}`,
        severity: "error",
      });
      unsupportedClaims.push(`Potential unverified date: ${date}`);
    }
  }

  // 9. Check for fabricated metrics (patterns like "X+", "over X", "more than X")
  const metricPattern = /\b(?:over|more than|approximately|about|around|nearly)\s+(\d+)/gi;
  const metricMatches = response.matchAll(metricPattern);
  for (const match of metricMatches) {
    issues.push({
      type: "fabricated_metric",
      detail: `Response contains unverified metric: "${match[0]}"`,
      severity: "error",
    });
    unsupportedClaims.push(`Potential unverified metric: ${match[0]}`);
  }

  // 9. Detect unknown proper nouns (capitalized words not in any known set)
  const unknownNouns = detectUnknownProperNouns(response, knowledgeBase.entries);
  for (const noun of unknownNouns) {
    issues.push({
      type: "unsupported_claim",
      detail: `Response contains unrecognized proper noun "${noun}" — not found in verified knowledge`,
      severity: "warning",
    });
    unsupportedClaims.push(`Unrecognized entity: ${noun}`);
  }

  const hasErrors = issues.some((i) => i.severity === "error");

  return {
    isValid: !hasErrors,
    issues,
    supportedClaims,
    unsupportedClaims,
  };
}

export function isResponseSafe(validation: ValidationResult): boolean {
  return validation.isValid;
}

export function getValidationSummary(validation: ValidationResult): string {
  if (validation.isValid && validation.issues.length === 0) {
    return "Response is fully grounded in verified knowledge.";
  }

  const errorCount = validation.issues.filter(
    (i) => i.severity === "error"
  ).length;
  const warningCount = validation.issues.filter(
    (i) => i.severity === "warning"
  ).length;

  const parts: string[] = [];
  if (errorCount > 0) parts.push(`${errorCount} error(s)`);
  if (warningCount > 0) parts.push(`${warningCount} warning(s)`);

  return `Validation issues found: ${parts.join(", ")}. ${validation.unsupportedClaims.length} potentially unsupported claim(s).`;
}
