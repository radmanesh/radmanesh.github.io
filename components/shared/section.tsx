import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

// --------- SECTION COMPONENT ---------
interface SectionProps extends ComponentProps<"section"> {}

function Section({ children, ...props }: SectionProps) {
  return (
    <section {...props} className="space-y-8 tracking-tight font-light">
      {children}
    </section>
  );
}

// --------- SECTION TITLE COMPONENT ---------
interface SectionTitleProps extends ComponentProps<"h2"> {
  text: string;
}

function SectionTitle({ text, className, ...props }: SectionTitleProps) {
  return (
    <h2
      {...props}
      className={cn(
        "font-bold text-xl md:text-2xl underline decoration-1 decoration-wavy underline-offset-8",
        className
      )}
    >
      {text}
    </h2>
  );
}

// --------- SECTION SUBTITLE COMPONENT ---------
interface SectionSubtitleProps extends ComponentProps<"p"> {
  text: string;
}

function SectionSubtitle({ text, className, ...props }: SectionSubtitleProps) {
  return (
    <p
      {...props}
      className={cn(
        "text-lg md:text-xl font-medium",
        className
      )}
    >
      {text}
    </p>
  );
}

// --------- EXPORTS ---------
export { Section, SectionTitle, SectionSubtitle };
