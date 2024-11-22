"use client";

import Link from "next/link";
import { ThemeToggle } from "../shared/theme-toggle";

// --------- COMPONENT ---------
export function Header() {
  return (
    <header>
      <div className="px-4 sm:px-6">
        <div className="mx-auto mb-16 flex h-[72px] w-full max-w-3xl items-center justify-between border-b border-border/70">
          <Link href="/" aria-label="Home">
            <h1 className="font-mono hover:opacity-50 font-bold">Som3aware</h1>
          </Link>
          <nav>
            <ul className="flex items-center gap-4">
              <li>
                <ThemeToggle />
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
