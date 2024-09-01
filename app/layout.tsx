import {
  ClerkLoaded,
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";
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
        <body>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" style={{ flexGrow: 1 }}>
                AI Flashcards
              </Typography>
              <ClerkLoaded>
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button color="inherit">Login</Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button color="inherit">Sign Up</Button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </ClerkLoaded>
            </Toolbar>
          </AppBar>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
