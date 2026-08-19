import { ImageResponse } from "next/og";

export const alt = "MagicBridge · the invisible remote control for a computer you own";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded dark OG card. System fonts only (no external fetch), so it builds offline.
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#050507",
        backgroundImage:
          "radial-gradient(1000px 700px at 78% 12%, rgba(18,198,230,0.18), transparent 60%)",
        padding: "72px 80px",
        fontFamily: "sans-serif",
        color: "#eef1f6",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            width: 44,
            height: 30,
            borderRadius: 8,
            border: "3px solid #12c6e6",
            display: "flex",
          }}
        />
        <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: -0.5 }}>MagicBridge</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: 20,
            letterSpacing: 8,
            color: "#12c6e6",
            fontWeight: 600,
            marginBottom: 24,
          }}
        >
          FOR HARDWARE YOU OWN
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 74,
            fontWeight: 800,
            lineHeight: 1.04,
            letterSpacing: -2,
          }}
        >
          <div style={{ display: "flex" }}>Full control of your machine.</div>
          <div style={{ display: "flex" }}>
            <span style={{ color: "#9aa3b2" }}>From anywhere.&nbsp;</span>
            <span style={{ color: "#12c6e6" }}>Invisible.</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#050507",
            background: "#12c6e6",
            padding: "12px 28px",
            borderRadius: 999,
            letterSpacing: 2,
          }}
        >
          $549 · ONCE
        </div>
        <div style={{ fontSize: 20, color: "#565f70", letterSpacing: 4 }}>
          THE INVISIBLE REMOTE CONTROL
        </div>
      </div>
    </div>,
    { ...size },
  );
}
