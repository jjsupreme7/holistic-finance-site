import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { getResend } from "@/lib/email/resend";
import { campaignEmail } from "@/lib/email/templates";
import { EMAIL_CONFIG } from "@/lib/constants";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get campaign
    const { data: campaign, error: campError } = await getSupabase()
      .from("campaigns")
      .select("*")
      .eq("id", id)
      .single();

    if (campError || !campaign) {
      return NextResponse.json(
        { error: "Campaign not found." },
        { status: 404 }
      );
    }

    if (campaign.status === "sent") {
      return NextResponse.json(
        { error: "Campaign already sent." },
        { status: 400 }
      );
    }

    // Mark as sending
    await getSupabase()
      .from("campaigns")
      .update({ status: "sending" })
      .eq("id", id);

    // Get active subscribers
    const { data: subscribers, error: subError } = await getSupabase()
      .from("subscribers")
      .select("email, unsubscribe_token")
      .eq("status", "active");

    if (subError || !subscribers?.length) {
      await getSupabase()
        .from("campaigns")
        .update({ status: "draft" })
        .eq("id", id);

      return NextResponse.json(
        { error: "No active subscribers found." },
        { status: 400 }
      );
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://myholisticfinance.com";

    let sentCount = 0;
    const errors: string[] = [];

    // Send to each subscriber individually (unique unsubscribe links)
    for (const sub of subscribers) {
      const unsubscribeUrl = `${siteUrl}/unsubscribe?token=${sub.unsubscribe_token}`;
      const html = campaignEmail(campaign.body_html, unsubscribeUrl);

      try {
        await getResend().emails.send({
          from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.fromEmail}>`,
          replyTo: EMAIL_CONFIG.replyTo,
          to: sub.email,
          subject: campaign.subject,
          html,
        });
        sentCount++;
      } catch (err) {
        errors.push(sub.email);
        console.error(`Failed to send to ${sub.email}:`, err);
      }
    }

    // Update campaign status
    const finalStatus = sentCount > 0 ? "sent" : "failed";
    await getSupabase()
      .from("campaigns")
      .update({
        status: finalStatus,
        sent_at: new Date().toISOString(),
        recipient_count: sentCount,
      })
      .eq("id", id);

    return NextResponse.json({
      message: `Campaign sent to ${sentCount} of ${subscribers.length} subscribers.`,
      sentCount,
      totalSubscribers: subscribers.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Send campaign error:", error);
    return NextResponse.json(
      { error: "Failed to send campaign." },
      { status: 500 }
    );
  }
}
