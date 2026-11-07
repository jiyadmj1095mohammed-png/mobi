import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "MOBI — Campus Ecosystem | MEA Engineering College",
  description: "A student-powered digital campus ecosystem for MEA Engineering College uniting 3D navigation, waste care, event discounts, and student communication.",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#B8C4B8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#B8C4B8] text-[#121417] min-h-screen font-sans antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
