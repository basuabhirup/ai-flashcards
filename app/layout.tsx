import { ClerkProvider } from "@clerk/nextjs";
import { NextUIProvider } from "@nextui-org/react";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { NavBar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "sonner";

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
      <html className="scroll-smooth" lang="en">
        <body>
          <NextUIProvider>
            <ThemeProvider attribute="class" defaultTheme="dark">
              <NavBar />
              <main className="flex flex-col min-h-[85vh]">{children}</main>
              <Footer />
            </ThemeProvider>
          </NextUIProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
