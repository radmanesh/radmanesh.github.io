"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export default function Header() {
  return (
    <header>
      <div className="px-4 sm:px-6">
        <div className="mx-auto mb-8 flex h-[72px] w-full max-w-3xl items-center justify-between border-b border-border/70">
          <Link href="/" aria-label="Home">
            <h1 className="font-mono hover:opacity-50 font-semibold">
              Som3aware
            </h1>
            <p className="font-mono text-xs opacity-60 hover:opacity-30">
              Software Engineer
            </p>
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
