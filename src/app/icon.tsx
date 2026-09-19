import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 192,
  height: 192,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 84,
          background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#07090E",
          fontWeight: 900,
          borderRadius: "44px",
          border: "4px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        E2
      </div>
    ),
    {
      ...size,
    }
  );
}
