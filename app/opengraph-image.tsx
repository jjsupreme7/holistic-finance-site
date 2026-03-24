import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export const runtime = "edge";
export const alt = `${SITE_NAME} social preview`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background:
            "linear-gradient(135deg, #f4f7f1 0%, #f7f1e5 52%, #e1efe6 100%)",
          color: "#17352d",
          fontFamily: "sans-serif",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -140,
            right: -80,
            width: 420,
            height: 420,
            borderRadius: 9999,
            background: "rgba(78, 117, 89, 0.14)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -150,
            left: -120,
            width: 360,
            height: 360,
            borderRadius: 9999,
            background: "rgba(203, 171, 95, 0.12)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            padding: "68px 72px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              maxWidth: 840,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 22,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "#6d7d72",
              }}
            >
              University Place, WA
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 64,
                lineHeight: 1.05,
                fontWeight: 600,
              }}
            >
              {SITE_NAME}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 30,
                lineHeight: 1.3,
                color: "#3a5647",
                maxWidth: 900,
              }}
            >
              {SITE_TAGLINE}. Personalized financial planning, insurance, tax preparation, and
              retirement guidance.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                fontSize: 24,
                color: "#3a5647",
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 9999,
                  background: "#9cb39d",
                }}
              />
              myholisticfinance.com
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 22,
                color: "#6d7d72",
                textAlign: "right",
                maxWidth: 420,
              }}
            >
              Book consultations, read articles, and explore courses and events.
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
