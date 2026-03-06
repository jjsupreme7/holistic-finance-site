import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { getResend } from "@/lib/email/resend";
import { welcomeEmail } from "@/lib/email/templates";
import { EMAIL_CONFIG } from "@/lib/constants";

export async function POST(req: Request) {
  try {
    const { email, firstName } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const { data: existing } = await getSupabase()
      .from("subscribers")
      .select("id, status, unsubscribe_token, first_name")
      .eq("email", email.toLowerCase())
      .single();

    if (existing && existing.status === "active") {
      return NextResponse.json(
        { message: "You're already subscribed! Check your inbox for our latest updates." },
        { status: 200 }
      );
    }

    let unsubscribeToken: string;

    if (existing && existing.status === "unsubscribed") {
      // Re-subscribe
      const { data, error } = await getSupabase()
        .from("subscribers")
        .update({
          status: "active",
          first_name: firstName || existing.first_name,
          unsubscribed_at: null,
          subscribed_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select("unsubscribe_token")
        .single();

      if (error) throw error;
      unsubscribeToken = data.unsubscribe_token;
    } else {
      // New subscriber
      const { data, error } = await getSupabase()
        .from("subscribers")
        .insert({
          email: email.toLowerCase(),
          first_name: firstName || null,
        })
        .select("unsubscribe_token")
        .single();

      if (error) throw error;
      unsubscribeToken = data.unsubscribe_token;
    }

    // Send welcome email
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://myholisticfinance.com";
    const unsubscribeUrl = `${siteUrl}/unsubscribe?token=${unsubscribeToken}`;
    const welcome = welcomeEmail(unsubscribeUrl);

    await getResend().emails.send({
      from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.fromEmail}>`,
      replyTo: EMAIL_CONFIG.replyTo,
      to: email.toLowerCase(),
      subject: welcome.subject,
      html: welcome.html,
    });

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
