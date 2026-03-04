import { NextResponse } from "next/server";
import { getResend } from "@/lib/email/resend";
import { campaignEmail } from "@/lib/email/templates";
import { EMAIL_CONFIG, CONTACT } from "@/lib/constants";

export async function POST(req: Request) {
  try {
    const { subject, bodyHtml, to } = await req.json();

    if (!subject || !bodyHtml) {
      return NextResponse.json(
        { error: "Subject and body are required." },
        { status: 400 }
      );
    }

    const recipientEmail = to || CONTACT.email;
    const html = campaignEmail(bodyHtml, "#preview-unsubscribe-link");

    await getResend().emails.send({
      from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.fromEmail}>`,
      replyTo: EMAIL_CONFIG.replyTo,
      to: recipientEmail,
      subject: `[TEST] ${subject}`,
      html,
    });

    return NextResponse.json({
      message: `Test email sent to ${recipientEmail}.`,
    });
  } catch (error) {
    console.error("Preview email error:", error);
    return NextResponse.json(
      { error: "Failed to send test email." },
      { status: 500 }
    );
  }
}
