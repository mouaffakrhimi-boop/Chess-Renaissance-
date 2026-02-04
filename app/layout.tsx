import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chess Renaissance | The Magister Awaits",
  description: "Experience chess as a conversation with the ultimate AI opponent.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
