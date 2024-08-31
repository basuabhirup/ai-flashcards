import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Flashcards",
  description:
    " 🌟 An AI-powered flashcard application to elevate learning with smart, efficient study tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
