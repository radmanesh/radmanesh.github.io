"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import NAVIGATION_ITEMS from "@/content/navigation";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// --------- COMPONENT ---------
export function Header() {
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <header>
      <div className="px-4 sm:px-6">
        <div className="mx-auto mb-16 flex h-16 w-full max-w-3xl items-center justify-between border-b border-border/70">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                {open ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent
              side={isMobile ? "bottom" : "top"}
              className={`
                bg-zinc-100 dark:bg-zinc-900 border-zinc-800 dark:border-zinc-800
                ${
                  isMobile
                    ? "h-fit rounded-t-[20px] pb-8"
                    : "h-fit mt-16 rounded-b-[20px] pb-8"
                }
                ${isMobile ? "" : "max-w-3xl mx-auto left-0 right-0"}
              `}
            >
              <nav className="flex flex-col gap-2 mt-6">
                {NAVIGATION_ITEMS.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="text-lg hover:opacity-80"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <Link
            href="/"
            aria-label="Home"
            className="absolute left-1/2 -translate-x-1/2"
          >
            <h1 className="font-mono hover:opacity-50 font-bold">Som3aware</h1>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
