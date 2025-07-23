import Image from "next/image";
import { ComponentProps } from "react";
import type { MDXComponents } from "mdx/types";

import { CodeBlock } from "@/components/shared/code-block";

// --------- CUSTOM MDX COMPONENTS ---------
function NextImage({ alt, ...props }: ComponentProps<typeof Image>) {
  return (
    <Image
      alt={alt}
      placeholder="blur"
      blurDataURL={props.src.toString()}
      className="rounded-lg w-full"
      {...props}
    />
  );
}

function TOC({ children }: { children: any }) {
  return (
    <details id="toc" className="hover:cursor-pointer">
      <summary className="uppercase text-lg">On this Page</summary>
      {children}
    </details>
  );
}

// --------- EXPORTED MDX COMPONENTS ---------
export const mdxComponents: MDXComponents = {
  h2: ({ children }) => (
    <h2 className="font-semibold text-xl tracking-tight leading-relaxed md:leading-normal">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-medium text-foreground/80 tracking-tight leading-relaxed md:leading-normal">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-base text-justify text-muted-foreground tracking-tight font-normal">
      {children}
    </p>
  ),
  a: ({ children, href }) => (
    <a
      href={href!.toString()}
      className="underline decoration-dotted decoration-1 underline-offset-4 text-muted-foreground/90"
    >
      {children}
    </a>
  ),
  TOC,
  NextImage,
  CodeBlock,
};
