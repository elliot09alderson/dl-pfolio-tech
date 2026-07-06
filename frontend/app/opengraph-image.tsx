import { ImageResponse } from "next/og";

export const alt = "VidGrab - Free Social Media Video Downloader";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #06060b 0%, #0d0d14 50%, #06060b 100%)",
          position: "relative",
        }}
      >
        {/* Accent glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,224,208,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Download icon */}
        <svg
          width="80"
          height="80"
          viewBox="0 0 64 64"
          fill="none"
          style={{ marginBottom: "24px" }}
        >
          <rect width="64" height="64" rx="14" fill="#0d0d14" stroke="#00e0d0" strokeWidth="2" />
          <path d="M32 16L32 40" stroke="#00e0d0" strokeWidth="4" strokeLinecap="round" />
          <path d="M22 32L32 42L42 32" stroke="#00e0d0" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18 48H46" stroke="#00e0d0" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
        </svg>

        {/* Title */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: 800,
            color: "#00e0d0",
            letterSpacing: "-2px",
            marginBottom: "16px",
          }}
        >
          VidGrab
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "28px",
            color: "#8a889a",
            letterSpacing: "3px",
            textTransform: "uppercase" as const,
            marginBottom: "40px",
          }}
        >
          Social Media Video Downloader
        </div>

        {/* Platform badges */}
        <div style={{ display: "flex", gap: "16px" }}>
          {["YouTube", "Instagram", "TikTok", "Facebook", "Twitter/X"].map(
            (p) => (
              <div
                key={p}
                style={{
                  padding: "10px 24px",
                  borderRadius: "100px",
                  background: "#1a1a28",
                  border: "1px solid #2a2a44",
                  color: "#e8e6f0",
                  fontSize: "18px",
                  fontWeight: 500,
                }}
              >
                {p}
              </div>
            )
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
