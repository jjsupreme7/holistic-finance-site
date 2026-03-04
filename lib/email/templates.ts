import { SITE_NAME, CONTACT } from "@/lib/constants";

const BRAND_COLOR = "#2c5aa0";
const GOLD_COLOR = "#e8a838";
const LOGO_URL =
  "https://i0.wp.com/myholisticfinance.com/wp-content/uploads/2025/12/logo.png?fit=1536%2C1024&ssl=1";

function baseLayout(content: string, unsubscribeUrl: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8faff;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;">
    <!-- Header -->
    <div style="background:${BRAND_COLOR};padding:24px 32px;text-align:center;">
      <img src="${LOGO_URL}" alt="${SITE_NAME}" style="height:60px;width:auto;" />
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
      <a href="https://holistichealthandfinance.com/contact" style="color:${BRAND_COLOR};font-weight:600;">book a consultation</a>.
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
