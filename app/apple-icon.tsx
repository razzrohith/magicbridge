import { ImageResponse } from "next/og";

// Required by output: "export": these image routes are Route Handlers, so
// Next needs to be told they are prerenderable rather than server-rendered.
export const dynamic = "force-static";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#050507",
      }}
    >
      <div
        style={{
          width: 116,
          height: 50,
          borderRadius: 14,
          border: "7px solid #12c6e6",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingRight: 14,
        }}
      >
        <div style={{ width: 12, height: 12, borderRadius: 12, background: "#12c6e6" }} />
      </div>
    </div>,
    { ...size },
  );
}
