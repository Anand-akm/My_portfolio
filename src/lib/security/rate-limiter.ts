export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfterMs: number;
}

interface Bucket {
  count: number;
  resetAt: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 20,
  windowMs: 60 * 60 * 1000, // 1 hour
};

/**
 * In-memory rate limiter.
 *
 * This is a development-safe implementation sufficient for single-instance
 * deployment (e.g., Vercel serverless functions).
 *
 * For multi-instance / distributed production:
 * - Replace with Redis-backed sliding window (e.g., ioredis + sliding window)
 * - Or use Vercel Edge Config / Upstash Redis
 * - Interface remains the same: checkLimit(key) → RateLimitResult
 *
 * This implementation is NOT safe for:
 * - Multiple server instances sharing traffic
 * - Horizontal scaling without shared state
 */
export class RateLimiter {
  private buckets: Map<string, Bucket> = new Map();
  private config: RateLimitConfig;
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  constructor(config?: Partial<RateLimitConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };

    // Periodic cleanup of expired buckets (every 5 minutes)
    if (typeof setInterval !== "undefined") {
      this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
    }
  }

  /**
   * Check rate limit for a given key (typically an IP address).
   * Returns whether the request is allowed.
   */
  checkLimit(key: string): RateLimitResult {
    const now = Date.now();
    const bucket = this.buckets.get(key);

    // No bucket or expired — create fresh bucket
    if (!bucket || now >= bucket.resetAt) {
      const resetAt = now + this.config.windowMs;
      this.buckets.set(key, { count: 1, resetAt });
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetAt,
        retryAfterMs: 0,
      };
    }

    // Within window
    if (bucket.count < this.config.maxRequests) {
      bucket.count++;
      return {
        allowed: true,
        remaining: this.config.maxRequests - bucket.count,
        resetAt: bucket.resetAt,
        retryAfterMs: 0,
      };
    }

    // Rate limited
    const retryAfterMs = bucket.resetAt - now;
    return {
      allowed: false,
      remaining: 0,
      resetAt: bucket.resetAt,
      retryAfterMs,
    };
  }

  /**
   * Get current status for a key without incrementing the counter.
   */
  getStatus(key: string): RateLimitResult {
    const now = Date.now();
    const bucket = this.buckets.get(key);

    if (!bucket || now >= bucket.resetAt) {
      return {
        allowed: true,
        remaining: this.config.maxRequests,
        resetAt: now + this.config.windowMs,
        retryAfterMs: 0,
      };
    }

    const remaining = Math.max(0, this.config.maxRequests - bucket.count);
    return {
      allowed: remaining > 0,
      remaining,
      resetAt: bucket.resetAt,
      retryAfterMs: remaining > 0 ? 0 : bucket.resetAt - now,
    };
  }

  /**
   * Get the number of active buckets (for monitoring).
   */
  getActiveKeyCount(): number {
    return this.buckets.size;
  }

  /**
   * Clear all buckets (for testing).
   */
  reset(): void {
    this.buckets.clear();
  }

  /**
   * Clean up expired buckets.
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, bucket] of this.buckets.entries()) {
      if (now >= bucket.resetAt) {
        this.buckets.delete(key);
      }
    }
  }

  /**
   * Destroy the rate limiter (clear intervals).
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.buckets.clear();
  }
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const ONE_HOUR_MS = 60 * 60 * 1000;

function getConfigFromEnv(variableName: string, fallback: number): RateLimitConfig {
  return {
    maxRequests: parsePositiveInt(process.env[variableName], fallback),
    windowMs: ONE_HOUR_MS,
  };
}

// Singleton instances for app-wide use. Chat and voice have separate budgets
// because a voice turn includes paid STT, LLM, and TTS work.
let globalLimiter: RateLimiter | null = null;
let globalVoiceLimiter: RateLimiter | null = null;
let globalContactLimiter: RateLimiter | null = null;

export function getRateLimiter(
  config?: Partial<RateLimitConfig>
): RateLimiter {
  if (!globalLimiter) {
    globalLimiter = new RateLimiter(
      config ?? getConfigFromEnv("RATE_LIMIT_CHAT", DEFAULT_CONFIG.maxRequests)
    );
  }
  return globalLimiter;
}

export function getVoiceRateLimiter(
  config?: Partial<RateLimitConfig>
): RateLimiter {
  if (!globalVoiceLimiter) {
    globalVoiceLimiter = new RateLimiter(
      config ?? getConfigFromEnv("RATE_LIMIT_VOICE", 10)
    );
  }
  return globalVoiceLimiter;
}

export function getContactRateLimiter(
  config?: Partial<RateLimitConfig>
): RateLimiter {
  if (!globalContactLimiter) {
    globalContactLimiter = new RateLimiter(
      config ?? getConfigFromEnv("RATE_LIMIT_CONTACT", 5)
    );
  }
  return globalContactLimiter;
}

export function resetGlobalRateLimiter(): void {
  if (globalLimiter) {
    globalLimiter.destroy();
    globalLimiter = null;
  }
  if (globalVoiceLimiter) {
    globalVoiceLimiter.destroy();
    globalVoiceLimiter = null;
  }
  if (globalContactLimiter) {
    globalContactLimiter.destroy();
    globalContactLimiter = null;
  }
}

export function retryAfterSeconds(retryAfterMs: number): number {
  return Math.max(1, Math.ceil(retryAfterMs / 1000));
}
