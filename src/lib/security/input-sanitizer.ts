export interface SanitizeResult {
  clean: string;
  original: string;
  wasModified: boolean;
  issues: SanitizeIssue[];
}

export interface SanitizeIssue {
  type: "html_stripped" | "length_truncated" | "injection_detected" | "whitespace_normalized" | "empty_input";
  detail: string;
}

const MAX_INPUT_LENGTH = 1000;
const MIN_INPUT_LENGTH = 1;

const HTML_TAG_PATTERN = /<[^>]*>/g;
const MULTIPLE_WHITESPACE_PATTERN = /\s{3,}/g;
const CONTROL_CHAR_PATTERN = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

const INJECTION_PATTERNS = [
  { pattern: /ignore\s+(all\s+)?(previous|above|prior)\s+(instructions?|rules?|context)/i, type: "injection_detected" as const },
  { pattern: /ignore\s+(your|the|all)\s+(rules?|instructions?|guidelines?)/i, type: "injection_detected" as const },
  { pattern: /you\s+are\s+now\s+(a|an|the)\s+/i, type: "injection_detected" as const },
  { pattern: /pretend\s+(you\s+are|to\s+be|you're)\s+/i, type: "injection_detected" as const },
  { pattern: /act\s+as\s+(if|though)\s+/i, type: "injection_detected" as const },
  { pattern: /disregard\s+(all|any|your|the)\s+(previous|above|prior|initial)/i, type: "injection_detected" as const },
  { pattern: /forget\s+(everything|all|your)\s+(you|were|have)/i, type: "injection_detected" as const },
  { pattern: /reveal\s+(your|the)\s+(system\s*prompt|instructions?|rules?)/i, type: "injection_detected" as const },
  { pattern: /what\s+(are|is)\s+your\s+(system\s*prompt|instructions?|rules?)/i, type: "injection_detected" as const },
  { pattern: /repeat\s+(everything|all|your)\s+(above|before|previously)/i, type: "injection_detected" as const },
  { pattern: /translate\s+(your|the)\s+(system\s*prompt|instructions?)/i, type: "injection_detected" as const },
];

/**
 * Sanitize user input for the AI chat system.
 *
 * Performs:
 * 1. Empty/whitespace check
 * 2. HTML tag stripping
 * 3. Control character removal
 * 4. Whitespace normalization
 * 5. Length truncation
 * 6. Prompt injection detection (flagged, not blocked — allows legitimate tech questions)
 *
 * NOTE: Injection detection flags but does NOT strip or block the input.
 * The prompt builder's system instructions override user injection attempts.
 * Flagged inputs are reported for logging/monitoring purposes.
 */
export function sanitizeInput(input: string): SanitizeResult {
  const original = input;
  const issues: SanitizeIssue[] = [];
  let clean = input;

  // 1. Empty input
  if (!clean || clean.trim().length === 0) {
    return {
      clean: "",
      original,
      wasModified: true,
      issues: [{ type: "empty_input", detail: "Input is empty or whitespace only" }],
    };
  }

  // 2. Strip HTML tags
  if (HTML_TAG_PATTERN.test(clean)) {
    clean = clean.replace(HTML_TAG_PATTERN, "");
    issues.push({
      type: "html_stripped",
      detail: "HTML tags removed from input",
    });
  }

  // 3. Remove control characters (keep newlines and tabs)
  if (CONTROL_CHAR_PATTERN.test(clean)) {
    clean = clean.replace(CONTROL_CHAR_PATTERN, "");
  }

  // 4. Normalize whitespace
  if (MULTIPLE_WHITESPACE_PATTERN.test(clean)) {
    clean = clean.replace(MULTIPLE_WHITESPACE_PATTERN, " ");
    issues.push({
      type: "whitespace_normalized",
      detail: "Multiple consecutive spaces collapsed",
    });
  }

  // 5. Trim
  clean = clean.trim();

  // A string made only of markup is effectively empty after sanitization.
  if (clean.length === 0) {
    return {
      clean: "",
      original,
      wasModified: true,
      issues: [
        ...issues,
        { type: "empty_input", detail: "Input contains no usable text" },
      ],
    };
  }

  // 6. Length truncation
  if (clean.length > MAX_INPUT_LENGTH) {
    clean = clean.slice(0, MAX_INPUT_LENGTH);
    issues.push({
      type: "length_truncated",
      detail: `Input truncated to ${MAX_INPUT_LENGTH} characters`,
    });
  }

  // 7. Prompt injection detection (flag but don't block)
  for (const { pattern, type } of INJECTION_PATTERNS) {
    if (pattern.test(clean)) {
      issues.push({
        type,
        detail: `Potential prompt injection detected: ${pattern.source}`,
      });
      break; // One detection is enough
    }
  }

  return {
    clean,
    original,
    wasModified: clean !== original,
    issues,
  };
}

export function isInputSafe(result: SanitizeResult): boolean {
  return !result.issues.some((i) => i.type === "injection_detected");
}

export function hasInjectionAttempt(result: SanitizeResult): boolean {
  return result.issues.some((i) => i.type === "injection_detected");
}

export { MAX_INPUT_LENGTH, MIN_INPUT_LENGTH };
