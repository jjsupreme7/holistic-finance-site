import { NextResponse } from "next/server";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitDecision = {
  allowed: boolean;
  retryAfterSeconds: number;
};

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

type PublicRouteGuardOptions = RateLimitOptions & {
  message?: string;
};

const globalRateLimitStore = globalThis as typeof globalThis & {
  __publicRouteRateLimitStore?: Map<string, RateLimitEntry>;
};

const rateLimitStore =
  globalRateLimitStore.__publicRouteRateLimitStore ??
  new Map<string, RateLimitEntry>();

if (!globalRateLimitStore.__publicRouteRateLimitStore) {
  globalRateLimitStore.__publicRouteRateLimitStore = rateLimitStore;
}

function cleanupExpiredEntries(store: Map<string, RateLimitEntry>, now: number) {
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }
}

export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

export function isAllowedRequestOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) {
    return true;
  }

  try {
    return new URL(origin).origin === new URL(req.url).origin;
  } catch {
    return false;
  }
}

export function consumeRateLimitSlot(
  store: Map<string, RateLimitEntry>,
  options: RateLimitOptions,
  now = Date.now()
): RateLimitDecision {
  cleanupExpiredEntries(store, now);

  const existing = store.get(options.key);
  if (!existing || existing.resetAt <= now) {
    store.set(options.key, {
      count: 1,
      resetAt: now + options.windowMs,
    });

    return {
      allowed: true,
      retryAfterSeconds: 0,
    };
  }

  if (existing.count >= options.limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  store.set(options.key, existing);

  return {
    allowed: true,
    retryAfterSeconds: 0,
  };
}

export function guardPublicPostRoute(
  req: Request,
  options: PublicRouteGuardOptions
) {
  if (!isAllowedRequestOrigin(req)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const clientIp = getClientIp(req);
  const decision = consumeRateLimitSlot(rateLimitStore, {
    key: `${options.key}:${clientIp}`,
    limit: options.limit,
    windowMs: options.windowMs,
  });

  if (decision.allowed) {
    return null;
  }

  return NextResponse.json(
    {
      error: options.message || "Too many requests. Please try again shortly.",
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(decision.retryAfterSeconds),
      },
    }
  );
}
