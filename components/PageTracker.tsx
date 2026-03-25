"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

function getVisitorId(): string | null {
  try {
    let id = localStorage.getItem("hf_visitor_id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("hf_visitor_id", id);
    }
    return id;
  } catch {
    return null;
  }
}

export default function PageTracker() {
  const pathname = usePathname();
  const lastPath = useRef("");

  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;

    // Skip admin/api paths
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return;

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        referrer: document.referrer || null,
        visitorId: getVisitorId(),
      }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
