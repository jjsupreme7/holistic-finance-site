import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { assertSupabaseRecord } from "@/lib/supabase/results";
import { getResend } from "@/lib/email/resend";
import { welcomeEmail } from "@/lib/email/templates";
import { EMAIL_CONFIG } from "@/lib/constants";
import { guardPublicPostRoute } from "@/lib/public-route";

export async function POST(req: Request) {
  try {
    const blocked = guardPublicPostRoute(req, {
      key: "newsletter-subscribe",
      limit: 10,
      windowMs: 10 * 60_000,
      message: "Too many subscription attempts. Please wait a few minutes and try again.",
    });
    if (blocked) {
      return blocked;
    }

    const { email, firstName, website } = await req.json();
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const normalizedFirstName =
      typeof firstName === "string" && firstName.trim() ? firstName.trim() : null;

    // Honeypot spam check
    if (website) {
      return NextResponse.json(
        { message: "Welcome! Check your inbox for a confirmation email." },
        { status: 201 }
      );
    }

    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const { data: existing, error: existingError } = await getSupabase()
      .from("subscribers")
      .select("id, status, unsubscribe_token, first_name")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    if (existing && existing.status === "active") {
      return NextResponse.json(
        { message: "You're already subscribed! Check your inbox for our latest updates." },
        { status: 200 }
      );
    }

    let unsubscribeToken: string;

    if (existing && existing.status === "unsubscribed") {
      // Re-subscribe
      unsubscribeToken = assertSupabaseRecord(
        await getSupabase()
          .from("subscribers")
          .update({
            status: "active",
            first_name: normalizedFirstName || existing.first_name,
            unsubscribed_at: null,
            subscribed_at: new Date().toISOString(),
          })
          .eq("id", existing.id)
          .select("unsubscribe_token")
          .single(),
        "Expected an unsubscribe token after re-subscribing."
      ).unsubscribe_token;
    } else {
      // New subscriber
      unsubscribeToken = assertSupabaseRecord(
        await getSupabase()
          .from("subscribers")
          .insert({
            email: normalizedEmail,
            first_name: normalizedFirstName,
          })
          .select("unsubscribe_token")
          .single(),
        "Expected an unsubscribe token after creating a subscriber."
      ).unsubscribe_token;
    }

    // Send welcome email
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://myholisticfinance.com";
    const unsubscribeUrl = `${siteUrl}/unsubscribe?token=${unsubscribeToken}`;
    const welcome = welcomeEmail(unsubscribeUrl);

    try {
      await getResend().emails.send({
        from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.fromEmail}>`,
        replyTo: EMAIL_CONFIG.replyTo,
        to: normalizedEmail,
        subject: welcome.subject,
        html: welcome.html,
      });
    } catch (emailError) {
      console.error("Welcome email error:", emailError);
      return NextResponse.json(
        {
          message:
            "You’re subscribed. We could not send the welcome email just now, but you are on the list.",
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { message: "Welcome! Check your inbox for a confirmation email." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
