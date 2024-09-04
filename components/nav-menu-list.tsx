"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { Link } from "@nextui-org/react";
import { usePathname } from "next/navigation";

export const NavMenuList = ({ ...menuProps }: { [key: string]: any }) => {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();
  const { openSignIn } = useClerk();

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Generate", href: "/generate" },
    { label: "My Flashcards", href: "/flashcards" },
  ];

  return (
    <>
      {menuItems.map((item, index) => (
        <>
          <Link
            key={index}
            color={item.href === pathname ? "secondary" : "foreground"}
            href={isSignedIn ? item.href : "#"}
            isDisabled={!isLoaded}
            {...menuProps}
            {...(!isSignedIn &&
              item.href !== "/" && { onClick: () => openSignIn() })}
          >
            {item.label}
          </Link>
        </>
      ))}
    </>
  );
};
