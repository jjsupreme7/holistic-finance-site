import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { isMissingRelationError } from "@/lib/supabase/errors";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const eventType = body.eventType === "booking_click" ? "booking_click" : null;
    const path = typeof body.path === "string" ? body.path : "";
    const referrer = typeof body.referrer === "string" ? body.referrer : null;
    const label = typeof body.label === "string" ? body.label : null;
    const metadata =
      body.metadata && typeof body.metadata === "object" ? body.metadata : null;

    if (!eventType || !path || path.startsWith("/admin") || path.startsWith("/api")) {
      return NextResponse.json({ ok: true });
    }

    try {
      await getSupabase().from("conversion_events").insert({
        event_type: eventType,
        path,
        referrer,
        label,
        metadata,
        user_agent: req.headers.get("user-agent") || null,
      });
    } catch (error) {
      if (!isMissingRelationError(error)) {
        console.error("Conversion tracking insert failed:", error);
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
