"use client";

import { Button, Link } from "@nextui-org/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      as={Link}
      isIconOnly
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="ml-auto"
    >
      <Sun className="h-[1.5rem] w-[1.3rem] dark:hidden" />
      <Moon className="hidden h-5 w-5 dark:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
