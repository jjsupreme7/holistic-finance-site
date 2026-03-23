import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { assertNoSupabaseError } from "@/lib/supabase/results";
import { getResend } from "@/lib/email/resend";
import {
  contactNotificationEmail,
  contactConfirmationEmail,
} from "@/lib/email/templates";
import { EMAIL_CONFIG, CONTACT } from "@/lib/constants";
import { guardPublicPostRoute } from "@/lib/public-route";

export async function POST(req: Request) {
  try {
    const blocked = guardPublicPostRoute(req, {
      key: "contact-submit",
      limit: 5,
      windowMs: 10 * 60_000,
      message: "Too many contact form attempts. Please wait a few minutes and try again.",
    });
    if (blocked) {
      return blocked;
    }

    const body = await req.json();
    const { firstName, lastName, email, phone, service, message, website } = body;
    const normalizedFirstName = typeof firstName === "string" ? firstName.trim() : "";
    const normalizedLastName = typeof lastName === "string" ? lastName.trim() : "";
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const normalizedPhone = typeof phone === "string" ? phone.trim() : "";
    const normalizedService = typeof service === "string" ? service.trim() : "";
    const normalizedMessage = typeof message === "string" ? message.trim() : "";

    // Honeypot spam check
    if (website) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Validate required fields
    if (!normalizedFirstName || !normalizedLastName || !normalizedEmail) {
      return NextResponse.json(
        { error: "First name, last name, and email are required." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const formData = {
      firstName: normalizedFirstName,
      lastName: normalizedLastName,
      email: normalizedEmail,
      phone: normalizedPhone || undefined,
      service: normalizedService || undefined,
      message: normalizedMessage || undefined,
    };

    // Save to database
    assertNoSupabaseError(
      await getSupabase().from("contact_submissions").insert({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone || null,
        service: formData.service || null,
        message: formData.message || null,
      })
    );

    try {
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
    } catch (emailError) {
      console.error("Contact form email error:", emailError);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
