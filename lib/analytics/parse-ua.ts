export function isBot(ua: string): boolean {
  return /bot|crawl|spider|slurp|facebookexternalhit|mediapartners/i.test(ua);
}

export function parseDevice(ua: string): "mobile" | "tablet" | "desktop" {
  if (
    /iPad|Tablet|PlayBook/i.test(ua) ||
    (/Android/i.test(ua) && !/Mobile/i.test(ua))
  )
    return "tablet";
  if (/Mobile|iPhone|Android.*Mobile|webOS|iPod/i.test(ua)) return "mobile";
  return "desktop";
}

export function parseBrowser(ua: string): string {
  if (/Edg\//i.test(ua)) return "Edge";
  if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) return "Chrome";
  if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) return "Safari";
  if (/Firefox\//i.test(ua)) return "Firefox";
  return "Other";
}
