import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Elemen 2 — Cohort Weight Tracker",
    short_name: "Elemen 2",
    description: "Close group weight and biometric tracking app for Elemen 2.",
    start_url: "/",
    display: "standalone",
    background_color: "#07090E",
    theme_color: "#07090E",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
