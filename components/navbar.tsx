import {
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
import { ThemeSwitcher } from "./theme-switcher";
import { NavMenuList } from "./nav-menu-list";
import { NavAuthButtons } from "./nav-auth-btns";

export const NavBar = () => {
  return (
    <Navbar isBordered>
      <NavbarContent>
        <NavbarMenuToggle aria-label={"Toggle menu"} className="sm:hidden" />
        <NavbarBrand>
          <Link href="/" className="text-foreground">
            <Sparkles className="mr-2" />
            <p className="font-bold text-inherit">AI Flashcards</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <NavMenuList className="mx-2" />
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden sm:flex">
          <ThemeSwitcher />
        </NavbarItem>
        <NavAuthButtons />
      </NavbarContent>
      <NavbarMenu>
        <NavbarMenuItem>
          <ThemeSwitcher />
        </NavbarMenuItem>
        <NavMenuList className="w-full" size="lg" />
      </NavbarMenu>
    </Navbar>
  );
};
