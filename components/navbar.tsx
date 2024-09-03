"use client";

import {
  Button,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeSwitcher } from "./theme-switcher";
import { ClerkLoaded } from "@clerk/nextjs";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { usePathname } from "next/navigation";

export const NavBar = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Generate", href: "/generate" },
    { label: "My Flashcards", href: "/flashcards" },
  ];
  if (!mounted) return null;

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} isBordered>
      <ClerkLoaded>
        <NavbarContent>
          <SignedIn>
            <NavbarMenuToggle
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="sm:hidden"
            />
          </SignedIn>
          <NavbarBrand>
            <Link href="/" className="text-foreground">
              <Sparkles className="mr-2" />
              <p className="font-bold text-inherit">AI Flashcards</p>
            </Link>
          </NavbarBrand>
        </NavbarContent>
      </ClerkLoaded>
      <ClerkLoaded>
        <SignedIn>
          <NavbarContent className="hidden sm:flex gap-4" justify="center">
            <NavbarItem>
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  color={item.href === pathname ? "secondary" : "foreground"}
                  href={item.href}
                  className="mx-2"
                >
                  {item.label}
                </Link>
              ))}
            </NavbarItem>
          </NavbarContent>
        </SignedIn>
        <NavbarContent justify="end">
          <NavbarItem className="hidden sm:flex">
            <ThemeSwitcher />
          </NavbarItem>
          <SignedOut>
            <NavbarItem className="flex sm:hidden">
              <ThemeSwitcher />
            </NavbarItem>
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
        </NavbarContent>
        <SignedIn>
          <NavbarMenu>
            <NavbarMenuItem>
              <ThemeSwitcher />
            </NavbarMenuItem>
            {menuItems.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                  key={index}
                  color={item.href === pathname ? "secondary" : "foreground"}
                  className="w-full"
                  href={item.href}
                  size="lg"
                >
                  {item.label}
                </Link>
              </NavbarMenuItem>
            ))}
          </NavbarMenu>
        </SignedIn>
      </ClerkLoaded>
    </Navbar>
  );
};
