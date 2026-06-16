import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="th" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
