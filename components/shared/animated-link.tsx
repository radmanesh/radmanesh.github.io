import Link from "next/link";
import { ComponentProps } from "react";
import { ArrowRightIcon, ArrowUpRightIcon } from "lucide-react";

// --------- COMPONENT ---------
export function AnimatedLink({
  href,
  children,
  ...props
}: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      href={href}
      className="group text-foreground flex items-center relative w-fit font-medium after:absolute after:bottom-0 after:right-0 after:h-[1px] after:w-0 after:bg-current hover:after:w-full after:transition-all after:duration-300 hover:after:left-0 hover:after:right-auto"
    >
      {children}
      <span className="relative ml-2 w-4 h-4 overflow-hidden">
        <ArrowUpRightIcon className="absolute h-4 w-4 transform transition-all duration-300 ease-in-out rotate-0 opacity-100 group-hover:rotate-90 group-hover:opacity-0" />
        <ArrowRightIcon className="absolute h-4 w-4 transform transition-all duration-300 ease-in-out -rotate-90 opacity-0 group-hover:rotate-0 group-hover:opacity-100" />
      </span>
    </Link>
  );
}
