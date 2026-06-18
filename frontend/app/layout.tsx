import type { Metadata } from "next";
import { DM_Sans, Geist } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

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
      className={cn(
        "antialiased",
        "h-full",
        dmSans.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
