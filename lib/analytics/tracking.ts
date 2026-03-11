"use client";

interface ConversionPayload {
  eventType: "booking_click";
  label?: string;
  metadata?: Record<string, string | number | boolean | null>;
}

function sendTrackingRequest(payload: ConversionPayload) {
  const body = JSON.stringify({
    eventType: payload.eventType,
    label: payload.label,
    metadata: payload.metadata || null,
    path: window.location.pathname,
    referrer: document.referrer || null,
  });

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon("/api/track/conversion", blob);
    return;
  }

  fetch("/api/track/conversion", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}

export function trackBookingClick(label?: string) {
  if (typeof window === "undefined") return;

  sendTrackingRequest({
    eventType: "booking_click",
    label,
  });
}
