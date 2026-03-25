import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { getSupabase } from "@/lib/supabase/server";
import { isMissingRelationError } from "@/lib/supabase/errors";
import { isBot, parseDevice, parseBrowser } from "@/lib/analytics/parse-ua";

function buildDayBuckets(days: number): Record<string, number> {
  const buckets: Record<string, number> = {};
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    buckets[d.toISOString().split("T")[0]] = 0;
  }
  return buckets;
}

function incrementDay(buckets: Record<string, number>, timestamp: string) {
  const day = timestamp.split("T")[0];
  if (buckets[day] !== undefined) buckets[day]++;
}

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

    // --- Page views ---
    const { data: views, error } = await supabase
      .from("page_views")
      .select("path, referrer, user_agent, visitor_id, created_at")
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: true });

    if (error && !isMissingRelationError(error)) throw error;
    if (error && isMissingRelationError(error)) missingTables.push("page_views");

    const rows = error ? [] : views || [];

    // Filter out bots
    const humanRows = rows.filter(
      (r) => !r.user_agent || !isBot(r.user_agent),
    );
    const totalViews = humanRows.length;

    // Unique visitors
    const visitorIds = new Set(
      humanRows.filter((r) => r.visitor_id).map((r) => r.visitor_id),
    );
    const uniqueVisitors = visitorIds.size;

    // Views per day + unique visitors per day
    const viewsByDay = buildDayBuckets(days);
    const uniqueVisitorsByDay = buildDayBuckets(days);
    const visitorsByDaySet: Record<string, Set<string>> = {};
    for (const key of Object.keys(viewsByDay)) {
      visitorsByDaySet[key] = new Set();
    }

    for (const v of humanRows) {
      incrementDay(viewsByDay, v.created_at);
      const day = v.created_at.split("T")[0];
      if (v.visitor_id && visitorsByDaySet[day]) {
        visitorsByDaySet[day].add(v.visitor_id);
      }
    }
    for (const [day, set] of Object.entries(visitorsByDaySet)) {
      uniqueVisitorsByDay[day] = set.size;
    }

    // Device + browser breakdown
    const deviceBreakdown: Record<string, number> = {
      desktop: 0,
      mobile: 0,
      tablet: 0,
    };
    const browserBreakdown: Record<string, number> = {};
    for (const v of humanRows) {
      if (v.user_agent) {
        deviceBreakdown[parseDevice(v.user_agent)]++;
        const browser = parseBrowser(v.user_agent);
        browserBreakdown[browser] = (browserBreakdown[browser] || 0) + 1;
      }
    }

    // Top pages
    const pageCounts: Record<string, number> = {};
    for (const v of humanRows) {
      pageCounts[v.path] = (pageCounts[v.path] || 0) + 1;
    }
    const topPages = Object.entries(pageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([path, count]) => ({ path, count }));

    // Top referrers
    const refCounts: Record<string, number> = {};
    for (const v of humanRows) {
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

    // --- Booking clicks ---
    const { data: conversions, error: conversionError } = await supabase
      .from("conversion_events")
      .select("path, created_at")
      .eq("event_type", "booking_click")
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: true });

    if (conversionError && !isMissingRelationError(conversionError))
      throw conversionError;
    if (conversionError && isMissingRelationError(conversionError))
      missingTables.push("conversion_events");

    const bookingRows = conversionError ? [] : conversions || [];
    const bookingClicksByDay = buildDayBuckets(days);
    for (const b of bookingRows) {
      incrementDay(bookingClicksByDay, b.created_at);
    }

    const bookingSourceCounts: Record<string, number> = {};
    for (const b of bookingRows) {
      bookingSourceCounts[b.path] = (bookingSourceCounts[b.path] || 0) + 1;
    }
    const topBookingSources = Object.entries(bookingSourceCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([path, count]) => ({ path, count }));

    // --- Subscribers ---
    let totalSubscribers = 0;
    let newSubscribers = 0;
    const subscribersByDay = buildDayBuckets(days);

    const { count: subCount, error: subCountError } = await supabase
      .from("subscribers")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");

    if (subCountError && !isMissingRelationError(subCountError))
      throw subCountError;
    if (subCountError && isMissingRelationError(subCountError))
      missingTables.push("subscribers");

    if (!subCountError) {
      totalSubscribers = subCount || 0;

      const { data: subs, error: subsError } = await supabase
        .from("subscribers")
        .select("subscribed_at")
        .gte("subscribed_at", since.toISOString())
        .order("subscribed_at", { ascending: true });

      if (subsError && !isMissingRelationError(subsError)) throw subsError;
      const subRows = subsError ? [] : subs || [];
      newSubscribers = subRows.length;
      for (const s of subRows) {
        incrementDay(subscribersByDay, s.subscribed_at);
      }
    }

    // --- Contact submissions ---
    let totalSubmissions = 0;
    let newSubmissions = 0;
    const submissionsByDay = buildDayBuckets(days);

    const { count: submissionCount, error: submissionCountError } =
      await supabase
        .from("contact_submissions")
        .select("*", { count: "exact", head: true });

    if (submissionCountError && !isMissingRelationError(submissionCountError))
      throw submissionCountError;
    if (submissionCountError && isMissingRelationError(submissionCountError))
      missingTables.push("contact_submissions");

    if (!submissionCountError) {
      totalSubmissions = submissionCount || 0;

      const { data: submissions, error: submsError } = await supabase
        .from("contact_submissions")
        .select("created_at")
        .gte("created_at", since.toISOString())
        .order("created_at", { ascending: true });

      if (submsError && !isMissingRelationError(submsError)) throw submsError;
      const submissionRows = submsError ? [] : submissions || [];
      newSubmissions = submissionRows.length;
      for (const s of submissionRows) {
        incrementDay(submissionsByDay, s.created_at);
      }
    }

    // Contact conversion rate
    const contactPageViews = humanRows.filter(
      (r) => r.path === "/contact",
    ).length;
    const contactConversionRate =
      contactPageViews > 0
        ? Math.round((newSubmissions / contactPageViews) * 1000) / 10
        : 0;

    return NextResponse.json({
      trackingConfigured: missingTables.length === 0,
      missingTables,
      totalViews,
      uniqueVisitors,
      viewsByDay,
      uniqueVisitorsByDay,
      deviceBreakdown,
      browserBreakdown,
      bookingClicksTotal: bookingRows.length,
      bookingClicksByDay,
      topPages,
      topReferrers,
      topBookingSources,
      totalSubscribers,
      newSubscribers,
      subscribersByDay,
      totalSubmissions,
      newSubmissions,
      submissionsByDay,
      contactConversionRate,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Failed to load analytics" },
      { status: 500 },
    );
  }
}
