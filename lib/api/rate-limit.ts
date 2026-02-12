/**
 * Simple in-memory rate limiter for API routes.
 * In production, replace with Redis or Cloud Memorystore.
 */

interface RateEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateEntry>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}, 60_000);

interface RateLimitConfig {
  /** Max requests per window */
  limit: number;
  /** Window duration in seconds */
  windowSeconds: number;
}

const DEFAULTS: Record<string, RateLimitConfig> = {
  api: { limit: 100, windowSeconds: 60 },
  auth: { limit: 10, windowSeconds: 60 },
  mcp: { limit: 200, windowSeconds: 60 },
  webhook: { limit: 50, windowSeconds: 60 },
};

export function rateLimit(
  key: string,
  config?: Partial<RateLimitConfig>
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const { limit, windowSeconds } = { ...DEFAULTS.api, ...config };

  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowSeconds * 1000;
    store.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  entry.count++;
  store.set(key, entry);

  if (entry.count > limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

/**
 * Get rate limit config by route type
 */
export function getRateLimitConfig(pathname: string): RateLimitConfig {
  if (pathname.startsWith('/api/auth')) return DEFAULTS.auth;
  if (pathname.startsWith('/api/mcp')) return DEFAULTS.mcp;
  if (pathname.startsWith('/api/webhooks')) return DEFAULTS.webhook;
  return DEFAULTS.api;
}

/**
 * Extract client identifier for rate limiting
 */
export function getClientId(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
  const apiKey = req.headers.get('authorization')?.slice(7) || '';
  return apiKey ? `key:${apiKey.slice(0, 16)}` : `ip:${ip}`;
}
