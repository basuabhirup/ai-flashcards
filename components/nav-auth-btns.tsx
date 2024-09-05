"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Button, Link, NavbarItem, Spinner } from "@nextui-org/react";

export const NavAuthButtons = () => {
  return (
    <>
      <ClerkLoading>
        <Spinner color="secondary" size="sm" />
      </ClerkLoading>
      <ClerkLoaded>
        <SignedOut>
          <NavbarItem>
            <SignInButton mode="modal">
              <Button as={Link} color="secondary" variant="flat">
                Sign In
              </Button>
            </SignInButton>
          </NavbarItem>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </ClerkLoaded>
    </>
  );
};
