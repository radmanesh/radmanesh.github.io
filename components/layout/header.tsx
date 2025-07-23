"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import NAVIGATION_ITEMS from "@/content/navigation";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// --------- COMPONENT LAYOUT ---------
export function Header() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <header className="sticky z-50 mb-8 top-0 backdrop-blur-md bg-zinc-50/75 dark:bg-zinc-900/75">
      <div className="px-6 md:px-4">
        <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between border-b border-border">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                {open ? (
                  <X className="h-4 w-4 text-zinc-500" />
                ) : (
                  <Menu className="h-4 w-4 text-zinc-500" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent
              side={isMobile ? "bottom" : "top"}
              className={`
                bg-zinc-100 dark:bg-zinc-900 border-zinc-800 dark:border-zinc-800 backdrop-blur-md
                ${
                  isMobile
                    ? "h-fit rounded-t-3xl pb-8"
                    : "h-fit mt-16 rounded-3xl pb-8"
                }
                ${isMobile ? "" : "max-w-3xl mx-auto left-0 right-0"}
              `}
            >
              <SheetTitle className="hidden"></SheetTitle>
              <nav className="flex flex-col mt-6">
                {NAVIGATION_ITEMS.map((item, index) => (
                  <div key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block py-3 text-lg hover:opacity-80"
                    >
                      {item.name}
                    </Link>
                    {index !== NAVIGATION_ITEMS.length - 1 && (
                      <div className="h-[1px] bg-zinc-200 dark:bg-zinc-800" />
                    )}
                  </div>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <Link
            href="/"
            aria-label="Home"
            className="absolute left-1/2 -translate-x-1/2"
          >
            <h1 className="font-logo hover:opacity-50 font-bold">Arman Radmanesh</h1>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
