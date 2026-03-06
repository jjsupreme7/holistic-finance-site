import { NextResponse } from "next/server";
import { getResend } from "@/lib/email/resend";
import {
  contactNotificationEmail,
  contactConfirmationEmail,
} from "@/lib/email/templates";
import { EMAIL_CONFIG, CONTACT } from "@/lib/constants";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, service, message } = body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "First name, last name, and email are required." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const formData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || undefined,
      service: service || undefined,
      message: message?.trim() || undefined,
    };

    const resend = getResend();

    // Send notification to Anna + confirmation to submitter in parallel
    const notification = contactNotificationEmail(formData);
    const confirmation = contactConfirmationEmail(formData);

    await Promise.all([
      resend.emails.send({
        from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.fromEmail}>`,
        replyTo: formData.email,
        to: CONTACT.email,
        subject: notification.subject,
        html: notification.html,
      }),
      resend.emails.send({
        from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.fromEmail}>`,
        replyTo: EMAIL_CONFIG.replyTo,
        to: formData.email,
        subject: confirmation.subject,
        html: confirmation.html,
      }),
    ]);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
