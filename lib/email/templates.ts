import { BOOKING_URL, SITE_NAME, CONTACT } from "@/lib/constants";

const BRAND_COLOR = "#2c5aa0";
const GOLD_COLOR = "#e8a838";
const BOOKING_LINK = BOOKING_URL.replace(/&/g, "&amp;");

function baseLayout(content: string, unsubscribeUrl: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8faff;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;">
    <!-- Header -->
    <div style="background:${BRAND_COLOR};padding:24px 32px;text-align:center;">
      <p style="margin:0 0 6px;color:${GOLD_COLOR};font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">HHF</p>
      <p style="margin:0;color:#ffffff;font-size:20px;font-weight:600;line-height:1.4;">${SITE_NAME}</p>
    </div>

    <!-- Content -->
    <div style="padding:32px;">
      ${content}
    </div>

    <!-- Footer -->
    <div style="background:#f0f4ff;padding:24px 32px;text-align:center;font-size:12px;color:#64748b;border-top:1px solid #e8eeff;">
      <p style="margin:0 0 8px;">
        <strong>${SITE_NAME}</strong><br/>
        ${CONTACT.address}
      </p>
      <p style="margin:0 0 8px;">
        ${CONTACT.phone} &bull; <a href="mailto:${CONTACT.email}" style="color:${BRAND_COLOR};">${CONTACT.email}</a>
      </p>
      <p style="margin:0;">
        <a href="${unsubscribeUrl}" style="color:${BRAND_COLOR};">Unsubscribe</a> from future emails
      </p>
    </div>
  </div>
</body>
</html>`;
}

function transactionalLayout(content: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8faff;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;">
    <div style="background:${BRAND_COLOR};padding:24px 32px;text-align:center;">
      <p style="margin:0 0 6px;color:${GOLD_COLOR};font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">HHF</p>
      <p style="margin:0;color:#ffffff;font-size:20px;font-weight:600;line-height:1.4;">${SITE_NAME}</p>
    </div>
    <div style="padding:32px;">
      ${content}
    </div>
    <div style="background:#f0f4ff;padding:24px 32px;text-align:center;font-size:12px;color:#64748b;border-top:1px solid #e8eeff;">
      <p style="margin:0 0 8px;">
        <strong>${SITE_NAME}</strong><br/>
        ${CONTACT.address}
      </p>
      <p style="margin:0;">
        ${CONTACT.phone} &bull; <a href="mailto:${CONTACT.email}" style="color:${BRAND_COLOR};">${CONTACT.email}</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

export function welcomeEmail(unsubscribeUrl: string) {
  const content = `
    <h1 style="color:${BRAND_COLOR};font-size:24px;margin:0 0 16px;">Welcome to the Family!</h1>
    <div style="width:48px;height:3px;background:linear-gradient(to right,${BRAND_COLOR},${GOLD_COLOR});border-radius:2px;margin-bottom:20px;"></div>
    <p style="color:#334155;line-height:1.7;font-size:15px;">
      Thank you for subscribing to the <strong>${SITE_NAME}</strong> newsletter.
    </p>
    <p style="color:#334155;line-height:1.7;font-size:15px;">
      You&rsquo;ll receive expert financial insights, market updates, and actionable strategies
      to help your family build lasting wealth. We send emails occasionally &mdash; no spam, ever.
    </p>
    <p style="color:#334155;line-height:1.7;font-size:15px;">
      In the meantime, if you have any questions, feel free to reply to this email or
      <a href="${BOOKING_LINK}" style="color:${BRAND_COLOR};font-weight:600;">book a consultation</a>.
    </p>
    <p style="color:#334155;line-height:1.7;font-size:15px;">
      Warm regards,<br/>
      <strong>Anna &amp; the HHF Team</strong>
    </p>
  `;
  return {
    subject: `Welcome to ${SITE_NAME}!`,
    html: baseLayout(content, unsubscribeUrl),
  };
}

export function campaignEmail(
  bodyHtml: string,
  unsubscribeUrl: string
) {
  return baseLayout(bodyHtml, unsubscribeUrl);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  service?: string;
  message?: string;
}

export function contactNotificationEmail(data: ContactFormData) {
  const rows = [
    ["Name", `${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}`],
    ["Email", `<a href="mailto:${encodeURI(data.email)}" style="color:${BRAND_COLOR};">${escapeHtml(data.email)}</a>`],
    ...(data.phone ? [["Phone", escapeHtml(data.phone)]] : []),
    ...(data.service ? [["Service", escapeHtml(data.service)]] : []),
  ];

  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;font-weight:600;color:#334155;white-space:nowrap;vertical-align:top;">${label}</td><td style="padding:8px 12px;color:#475569;">${value}</td></tr>`
    )
    .join("");

  const content = `
    <h1 style="color:${BRAND_COLOR};font-size:22px;margin:0 0 16px;">New Contact Form Submission</h1>
    <div style="width:48px;height:3px;background:linear-gradient(to right,${BRAND_COLOR},${GOLD_COLOR});border-radius:2px;margin-bottom:20px;"></div>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;background:#f8faff;border-radius:8px;">
      ${tableRows}
    </table>
    ${data.message ? `<div style="background:#f8faff;border-left:3px solid ${BRAND_COLOR};padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:20px;"><p style="margin:0 0 4px;font-weight:600;color:#334155;font-size:13px;">Message</p><p style="margin:0;color:#475569;line-height:1.7;white-space:pre-wrap;">${escapeHtml(data.message)}</p></div>` : ""}
    <p style="color:#94a3b8;font-size:13px;margin:0;">Reply directly to this email to respond to ${escapeHtml(data.firstName)}.</p>
  `;

  return {
    subject: `New inquiry from ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}`,
    html: transactionalLayout(content),
  };
}

export function contactConfirmationEmail(data: ContactFormData) {
  const content = `
    <h1 style="color:${BRAND_COLOR};font-size:24px;margin:0 0 16px;">Thank You, ${escapeHtml(data.firstName)}!</h1>
    <div style="width:48px;height:3px;background:linear-gradient(to right,${BRAND_COLOR},${GOLD_COLOR});border-radius:2px;margin-bottom:20px;"></div>
    <p style="color:#334155;line-height:1.7;font-size:15px;">
      We&rsquo;ve received your message and will be in touch within one business day.
    </p>
    ${data.service ? `<p style="color:#334155;line-height:1.7;font-size:15px;">You expressed interest in <strong>${escapeHtml(data.service)}</strong> &mdash; we look forward to helping you!</p>` : ""}
    <p style="color:#334155;line-height:1.7;font-size:15px;">
      In the meantime, feel free to call us at <strong>${CONTACT.phone}</strong> or
      <a href="${BOOKING_LINK}" style="color:${BRAND_COLOR};font-weight:600;">book an appointment online</a>.
    </p>
    <p style="color:#334155;line-height:1.7;font-size:15px;">
      Warm regards,<br/>
      <strong>Anna &amp; the HHF Team</strong>
    </p>
  `;

  return {
    subject: `We received your message, ${escapeHtml(data.firstName)}!`,
    html: transactionalLayout(content),
  };
}
