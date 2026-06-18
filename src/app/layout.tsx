import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const headingFont = IBM_Plex_Sans_Thai({
  weight: "600",
  subsets: ["thai", "latin"],
  display: "swap",
  variable: "--font-heading",
});

const bodyFont = Noto_Sans_Thai({
  weight: "400",
  subsets: ["thai", "latin"],
  display: "swap",
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "CCTVStat",
  description: "ระบบบันทึกสถิติการขอดูภาพจากกล้องวงจรปิด",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${headingFont.variable} ${bodyFont.variable} h-full`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
