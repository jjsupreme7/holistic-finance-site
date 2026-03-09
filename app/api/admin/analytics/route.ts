import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const range = req.nextUrl.searchParams.get("range") || "7";
    const days = Math.min(parseInt(range, 10) || 7, 90);
    const since = new Date();
    since.setDate(since.getDate() - days);

    const supabase = getSupabase();

    // Get all views in range
    const { data: views, error } = await supabase
      .from("page_views")
      .select("path, referrer, created_at")
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: true });

    if (error) throw error;

    const rows = views || [];
    const totalViews = rows.length;

    // Views per day
    const viewsByDay: Record<string, number> = {};
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (days - 1 - i));
      viewsByDay[d.toISOString().split("T")[0]] = 0;
    }
    for (const v of rows) {
      const day = v.created_at.split("T")[0];
      if (viewsByDay[day] !== undefined) viewsByDay[day]++;
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

    return NextResponse.json({
      totalViews,
      viewsByDay,
      topPages,
      topReferrers,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
  }
}
