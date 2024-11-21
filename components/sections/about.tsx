import Link from "next/link";

import { ReactBadge } from "../badges/react";
import { AnimatedLink } from "../animated-link";

// --------- LAYOUT ---------
export function About() {
  return (
    <div className="space-y-8 tracking-tight font-light">
      <h2 className="font-bold text-xl md:text-2xl underline decoration-wavy underline-offset-8">
        Meet me
      </h2>
      <div className="grid grid-cols-1 gap-4 leading-relaxed md:leading-normal tracking-tight">
        <p className="font-semibold">Hey, Ahmed Ismail here!</p>
        <p>
          An ambitious frontend software engineer from Egypt with 5 years of
          experience in building single page apps with <ReactBadge />. With a
          keen eye for the little details, I aim to create beautiful and
          functional software that is both intuitive and enjoyable for users. I
          am passionate about the intersection between design and programming
          aspiring to become a design engineer.
        </p>
        <Link
          href="/about"
          className="group flex items-center relative w-fit font-semibold after:absolute after:bottom-0 after:right-0 after:h-[1px] after:w-0 after:bg-current hover:after:w-full after:transition-all after:duration-300 hover:after:left-0 hover:after:right-auto"
        >
          <AnimatedLink href="/about">Find out more</AnimatedLink>
        </Link>
      </div>
    </div>
  );
}
