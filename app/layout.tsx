import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Phone Monitor Dashboard",
  description: "Monitor your phone remotely",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
