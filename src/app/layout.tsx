import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MatchBox",
  description: "Match the hints to guess the person!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
