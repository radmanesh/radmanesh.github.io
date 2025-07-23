import Link from "next/link";
import { ComponentProps } from "react";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

// --------- COMPONENTS ---------
function Timeline({ children, className, ...props }: ComponentProps<"ol">) {
  return (
    <ol
      {...props}
      className={cn(
        "relative space-y-6 border-s-2 border-zinc-300 dark:border-zinc-800",
        className
      )}
    >
      {children}
    </ol>
  );
}

function TimelineItem({ children, className, ...props }: ComponentProps<"li">) {
  return (
    <li {...props} className={cn("ms-5 mt-1", className)}>
      {children}
    </li>
  );
}

function TimelineConnector({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn(
        "absolute -start-[7px] mt-2 h-3 w-3 rounded-full border border-zinc-400 bg-zinc-200 dark:border-zinc-600 dark:bg-zinc-800",
        className
      )}
    ></div>
  );
}

function TimelineTime({
  children,
  className,
  ...props
}: ComponentProps<"time">) {
  return (
    <time
      {...props}
      className={cn(
        "mb-2 font-mono text-xs font-normal leading-none text-zinc-600 dark:text-zinc-400",
        className
      )}
    >
      {children}
    </time>
  );
}

function TimelineContent({
  children,
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div {...props} className={cn("mt-2 flex flex-col space-y-0.5", className)}>
      {children}
    </div>
  );
}

function TimelineTitle({
  children,
  className,
  ...props
}: ComponentProps<"h3">) {
  return (
    <h3
      {...props}
      className={cn(
        "text-lg font-semibold tracking-tight text-foreground",
        className
      )}
    >
      {children}
    </h3>
  );
}

function TimelineLink({
  href,
  children,
  className,
  ...props
}: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      href={href}
      className={cn(
        "group flex w-max items-center text-pretty text-sm md:text-base text-zinc-600 transition-colors duration-150 hover:text-black dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-white"
      )}
    >
      <span>{children}</span>
      <ArrowUpRight
        size={12}
        strokeWidth={1.5}
        className="ml-1 duration-150 group-hover:translate-x-[1.5px]"
      />
    </Link>
  );
}

function TimelineDescription({
  children,
  className,
  ...props
}: ComponentProps<"p">) {
  return (
    <p
      {...props}
      className={cn(
        "mt-3 text-pretty font-sans text-sm md:text-base text-muted-foreground",
        className
      )}
    >
      {children}
    </p>
  );
}

// --------- EXPORTS ---------
export {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineTime,
  TimelineContent,
  TimelineTitle,
  TimelineLink,
  TimelineDescription,
};
