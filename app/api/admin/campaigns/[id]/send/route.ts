import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { getSupabase } from "@/lib/supabase/server";
import { getResend } from "@/lib/email/resend";
import { campaignEmail } from "@/lib/email/templates";
import { EMAIL_CONFIG } from "@/lib/constants";

async function restoreCampaignStatus(id: string, status: string) {
  const { data, error } = await getSupabase()
    .from("campaigns")
    .update({ status })
    .eq("id", id)
    .eq("status", "sending")
    .select("id")
    .maybeSingle();

  if (error) {
    console.error(`Failed to restore campaign ${id} to ${status}:`, error);
    return false;
  }

  return Boolean(data);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const { id } = await params;

    const { data: campaign, error: campaignError } = await getSupabase()
      .from("campaigns")
      .select("*")
      .eq("id", id)
      .single();

    if (campaignError || !campaign) {
      return NextResponse.json({ error: "Campaign not found." }, { status: 404 });
    }

    if (campaign.status === "sent") {
      return NextResponse.json({ error: "Campaign already sent." }, { status: 400 });
    }

    if (campaign.status === "sending") {
      return NextResponse.json({ error: "Campaign is already sending." }, { status: 409 });
    }

    const previousStatus = campaign.status;
    const deliveredCount = Number(campaign.recipient_count || 0);

    if (campaign.status === "failed" && deliveredCount > 0) {
      return NextResponse.json(
        {
          error:
            "This campaign was partially delivered already. Further sending is blocked to avoid duplicate emails.",
        },
        { status: 409 }
      );
    }

    const { data: lockedCampaign, error: lockError } = await getSupabase()
      .from("campaigns")
      .update({ status: "sending" })
      .eq("id", id)
      .eq("status", previousStatus)
      .select("id")
      .maybeSingle();

    if (lockError) {
      throw lockError;
    }

    if (!lockedCampaign) {
      return NextResponse.json(
        {
          error:
            "Campaign state changed before sending started. Refresh the page and verify its status before trying again.",
        },
        { status: 409 }
      );
    }

    const { data: subscribers, error: subscribersError } = await getSupabase()
      .from("subscribers")
      .select("email, unsubscribe_token")
      .eq("status", "active");

    if (subscribersError) {
      await restoreCampaignStatus(id, previousStatus);
      throw subscribersError;
    }

    if (!subscribers?.length) {
      const restored = await restoreCampaignStatus(id, previousStatus);
      if (!restored) {
        return NextResponse.json(
          {
            error:
              "Campaign could not be restored after finding an empty audience. Review its status before trying again.",
          },
          { status: 500 }
        );
      }

      return NextResponse.json({ error: "No active subscribers found." }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://myholisticfinance.com";
    let sentCount = 0;
    const errors: string[] = [];

    for (const subscriber of subscribers) {
      const unsubscribeUrl = `${siteUrl}/unsubscribe?token=${subscriber.unsubscribe_token}`;
      const html = campaignEmail(campaign.body_html, unsubscribeUrl);

      try {
        await getResend().emails.send({
          from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.fromEmail}>`,
          replyTo: EMAIL_CONFIG.replyTo,
          to: subscriber.email,
          subject: campaign.subject,
          html,
        });
        sentCount++;
      } catch (error) {
        errors.push(subscriber.email);
        console.error(`Failed to send to ${subscriber.email}:`, error);
      }
    }

    const finalStatus = sentCount === subscribers.length ? "sent" : "failed";
    const { data: finalizedCampaign, error: finalizeError } = await getSupabase()
      .from("campaigns")
      .update({
        status: finalStatus,
        sent_at: sentCount > 0 ? new Date().toISOString() : null,
        recipient_count: sentCount,
      })
      .eq("id", id)
      .eq("status", "sending")
      .select("id")
      .maybeSingle();

    if (finalizeError) {
      throw finalizeError;
    }

    if (!finalizedCampaign) {
      return NextResponse.json(
        {
          error:
            "Campaign emails were sent, but the campaign record could not be finalized. Do not retry until the campaign status is reviewed.",
        },
        { status: 500 }
      );
    }

    const message =
      sentCount === subscribers.length
        ? `Campaign sent to ${sentCount} subscribers.`
        : sentCount === 0
          ? "Campaign failed before any emails were delivered."
          : `Campaign partially sent: ${sentCount} of ${subscribers.length} subscribers received it. The campaign is now locked to avoid duplicate sends.`;

    return NextResponse.json({
      message,
      sentCount,
      totalSubscribers: subscribers.length,
      finalStatus,
      partial: sentCount > 0 && sentCount < subscribers.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Send campaign error:", error);
    return NextResponse.json({ error: "Failed to send campaign." }, { status: 500 });
  }
}
