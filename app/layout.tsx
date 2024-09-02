import { ClerkProvider } from "@clerk/nextjs";
import { NextUIProvider } from "@nextui-org/react";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { NavBar } from "@/components/navbar";

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
        <body>
          <NextUIProvider>
            <ThemeProvider attribute="class" defaultTheme="dark">
              <NavBar />
              {children}
            </ThemeProvider>
          </NextUIProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
