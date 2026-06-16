import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BiteBox | Restaurant Dashboard",
  description: "Good Food, Happy Mood",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} font-sans antialiased h-full`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
