import assert from "node:assert/strict";
import test from "node:test";
import {
  consumeRateLimitSlot,
  getClientIp,
  isAllowedRequestOrigin,
} from "../lib/public-route";

test("consumeRateLimitSlot blocks once the limit is exceeded inside the window", () => {
  const store = new Map();
  const options = {
    key: "contact:127.0.0.1",
    limit: 2,
    windowMs: 1000,
  };

  assert.equal(consumeRateLimitSlot(store, options, 1000).allowed, true);
  assert.equal(consumeRateLimitSlot(store, options, 1500).allowed, true);

  const blocked = consumeRateLimitSlot(store, options, 1600);
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.retryAfterSeconds, 1);

  assert.equal(consumeRateLimitSlot(store, options, 2501).allowed, true);
});

test("getClientIp prefers forwarded headers", () => {
  const req = new Request("https://myholisticfinance.com/api/contact/submit", {
    headers: {
      "x-forwarded-for": "203.0.113.42, 10.0.0.1",
      "x-real-ip": "198.51.100.17",
    },
  });

  assert.equal(getClientIp(req), "203.0.113.42");
});

test("isAllowedRequestOrigin only accepts same-origin requests", () => {
  const allowedReq = new Request("https://myholisticfinance.com/api/contact/submit", {
    headers: {
      origin: "https://myholisticfinance.com",
    },
  });
  const blockedReq = new Request("https://myholisticfinance.com/api/contact/submit", {
    headers: {
      origin: "https://evil.example",
    },
  });

  assert.equal(isAllowedRequestOrigin(allowedReq), true);
  assert.equal(isAllowedRequestOrigin(blockedReq), false);
});
