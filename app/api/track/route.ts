import { NextRequest, NextResponse } from "next/server";
import { guardPublicPostRoute } from "@/lib/public-route";
import { getSupabase } from "@/lib/supabase/server";
import { isMissingRelationError } from "@/lib/supabase/errors";

export async function POST(req: NextRequest) {
  try {
    const blocked = guardPublicPostRoute(req, {
      key: "page-track",
      limit: 240,
      windowMs: 5 * 60_000,
    });
    if (blocked) {
      return blocked;
    }

    const { path, referrer } = await req.json();
    if (!path || typeof path !== "string" || !path.startsWith("/")) {
      return NextResponse.json({ error: "Missing path" }, { status: 400 });
    }

    // Skip admin and API paths
    if (path.startsWith("/admin") || path.startsWith("/api")) {
      return NextResponse.json({ ok: true });
    }

    const userAgent = req.headers.get("user-agent") || null;

    try {
      const { error } = await getSupabase().from("page_views").insert({
        path,
        referrer: referrer || null,
        user_agent: userAgent,
      });

      if (error && !isMissingRelationError(error)) {
        console.error("Page tracking insert failed:", error);
      }
    } catch (error) {
      if (!isMissingRelationError(error)) {
        console.error("Page tracking insert failed:", error);
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
