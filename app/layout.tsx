import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";

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
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
