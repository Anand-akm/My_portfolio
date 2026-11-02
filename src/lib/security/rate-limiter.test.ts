import { describe, it, expect, afterEach } from "vitest";
import { RateLimiter } from "@/lib/security/rate-limiter";

describe("rate-limiter", () => {
  let limiter: RateLimiter;

  afterEach(() => {
    if (limiter) limiter.destroy();
  });

  describe("checkLimit", () => {
    it("allows first request", () => {
      limiter = new RateLimiter({ maxRequests: 5, windowMs: 60000 });
      const result = limiter.checkLimit("ip-1");
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(4);
    });

    it("tracks request count", () => {
      limiter = new RateLimiter({ maxRequests: 3, windowMs: 60000 });
      limiter.checkLimit("ip-1");
      limiter.checkLimit("ip-1");
      const result = limiter.checkLimit("ip-1");
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(0);
    });

    it("blocks when limit exceeded", () => {
      limiter = new RateLimiter({ maxRequests: 2, windowMs: 60000 });
      limiter.checkLimit("ip-1");
      limiter.checkLimit("ip-1");
      const result = limiter.checkLimit("ip-1");
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
      expect(result.retryAfterMs).toBeGreaterThan(0);
    });

    it("tracks different keys independently", () => {
      limiter = new RateLimiter({ maxRequests: 2, windowMs: 60000 });
      limiter.checkLimit("ip-1");
      limiter.checkLimit("ip-1");
      // ip-1 is now at limit
      const blocked = limiter.checkLimit("ip-1");
      expect(blocked.allowed).toBe(false);
      // ip-2 should still be allowed
      const allowed = limiter.checkLimit("ip-2");
      expect(allowed.allowed).toBe(true);
      expect(allowed.remaining).toBe(1);
    });

    it("resets after window expires", () => {
      limiter = new RateLimiter({ maxRequests: 1, windowMs: 50 }); // 50ms window
      limiter.checkLimit("ip-1");
      const blocked = limiter.checkLimit("ip-1");
      expect(blocked.allowed).toBe(false);

      // Wait for window to expire
      return new Promise((resolve) => setTimeout(resolve, 80)).then(() => {
        const allowed = limiter.checkLimit("ip-1");
        expect(allowed.allowed).toBe(true);
        expect(allowed.remaining).toBe(0);
      });
    });
  });

  describe("getStatus", () => {
    it("returns current status without incrementing", () => {
      limiter = new RateLimiter({ maxRequests: 5, windowMs: 60000 });
      limiter.checkLimit("ip-1");
      const status = limiter.getStatus("ip-1");
      expect(status.remaining).toBe(4);
      // Status check shouldn't increment
      const status2 = limiter.getStatus("ip-1");
      expect(status2.remaining).toBe(4);
    });

    it("returns full quota for unknown key", () => {
      limiter = new RateLimiter({ maxRequests: 5, windowMs: 60000 });
      const status = limiter.getStatus("unknown-key");
      expect(status.remaining).toBe(5);
      expect(status.allowed).toBe(true);
    });
  });

  describe("getActiveKeyCount", () => {
    it("returns number of active keys", () => {
      limiter = new RateLimiter({ maxRequests: 5, windowMs: 60000 });
      limiter.checkLimit("ip-1");
      limiter.checkLimit("ip-2");
      expect(limiter.getActiveKeyCount()).toBe(2);
    });
  });

  describe("reset", () => {
    it("clears all buckets", () => {
      limiter = new RateLimiter({ maxRequests: 5, windowMs: 60000 });
      limiter.checkLimit("ip-1");
      limiter.checkLimit("ip-2");
      limiter.reset();
      expect(limiter.getActiveKeyCount()).toBe(0);
    });
  });

  describe("destroy", () => {
    it("cleans up resources", () => {
      limiter = new RateLimiter({ maxRequests: 5, windowMs: 60000 });
      limiter.checkLimit("ip-1");
      limiter.destroy();
      expect(limiter.getActiveKeyCount()).toBe(0);
    });
  });

  describe("default config", () => {
    it("uses 20 requests per hour by default", () => {
      limiter = new RateLimiter();
      for (let i = 0; i < 20; i++) {
        const result = limiter.checkLimit("ip-default");
        expect(result.allowed).toBe(true);
      }
      const blocked = limiter.checkLimit("ip-default");
      expect(blocked.allowed).toBe(false);
    });
  });
});
