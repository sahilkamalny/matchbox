import type { Metadata } from "next"; 
import "./globals.css";
import "../../public/matchbox.jpeg"

export const metadata: Metadata = {
  title: "MatchBox",
  description: "Match the hints to guess the player!"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className="relative min-h-screen"> {/* Ensures body is at least the full height of the screen. */}
        {children}

        {/* Displays logo at the bottom */}
        <img
          src={"../../public/matchbox.jpeg"} // Updated path to match image in the public directory
          alt="MatchBox"
          className="fixed bottom-12 left-1/2 transform -translate-x-1/2 mb-4" // Fixed positioning at the bottom
          style={{ width: '100px' }} // Adjust the size as needed
        />
      </body>
    </html>
  );
}
