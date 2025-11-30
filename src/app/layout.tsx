import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TGA Watch Party Planner",
  description: "Coordinate snacks, rides, and vibes for The Game Awards night.",
  icons: {
    icon: "/TGA_VERTICAL_LOGOTYPE.png"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
