import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { getSupabase } from "@/lib/supabase/server";
import { isMissingRelationError } from "@/lib/supabase/errors";

export async function GET(req: NextRequest) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const range = req.nextUrl.searchParams.get("range") || "7";
    const days = Math.min(parseInt(range, 10) || 7, 90);
    const since = new Date();
    since.setDate(since.getDate() - days);

    const supabase = getSupabase();
    const missingTables: string[] = [];

    const { data: views, error } = await supabase
      .from("page_views")
      .select("path, referrer, created_at")
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: true });

    if (error && !isMissingRelationError(error)) {
      throw error;
    }

    if (error && isMissingRelationError(error)) {
      missingTables.push("page_views");
    }

    const rows = error ? [] : views || [];
    const totalViews = rows.length;

    const { data: conversions, error: conversionError } = await supabase
      .from("conversion_events")
      .select("path, created_at")
      .eq("event_type", "booking_click")
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: true });

    if (conversionError && !isMissingRelationError(conversionError)) {
      throw conversionError;
    }

    if (conversionError && isMissingRelationError(conversionError)) {
      missingTables.push("conversion_events");
    }

    const bookingRows = conversionError ? [] : conversions || [];

    // Views per day
    const viewsByDay: Record<string, number> = {};
    const bookingClicksByDay: Record<string, number> = {};
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (days - 1 - i));
      const key = d.toISOString().split("T")[0];
      viewsByDay[key] = 0;
      bookingClicksByDay[key] = 0;
    }
    for (const v of rows) {
      const day = v.created_at.split("T")[0];
      if (viewsByDay[day] !== undefined) viewsByDay[day]++;
    }
    for (const booking of bookingRows) {
      const day = booking.created_at.split("T")[0];
      if (bookingClicksByDay[day] !== undefined) bookingClicksByDay[day]++;
    }

    // Top pages
    const pageCounts: Record<string, number> = {};
    for (const v of rows) {
      pageCounts[v.path] = (pageCounts[v.path] || 0) + 1;
    }
    const topPages = Object.entries(pageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([path, count]) => ({ path, count }));

    // Top referrers
    const refCounts: Record<string, number> = {};
    for (const v of rows) {
      if (v.referrer) {
        try {
          const host = new URL(v.referrer).hostname;
          refCounts[host] = (refCounts[host] || 0) + 1;
        } catch {
          refCounts[v.referrer] = (refCounts[v.referrer] || 0) + 1;
        }
      }
    }
    const topReferrers = Object.entries(refCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([source, count]) => ({ source, count }));

    const bookingSourceCounts: Record<string, number> = {};
    for (const booking of bookingRows) {
      bookingSourceCounts[booking.path] = (bookingSourceCounts[booking.path] || 0) + 1;
    }
    const topBookingSources = Object.entries(bookingSourceCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([path, count]) => ({ path, count }));

    return NextResponse.json({
      trackingConfigured: missingTables.length === 0,
      missingTables,
      totalViews,
      viewsByDay,
      bookingClicksTotal: bookingRows.length,
      bookingClicksByDay,
      topPages,
      topReferrers,
      topBookingSources,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
  }
}
