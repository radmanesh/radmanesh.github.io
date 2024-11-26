import Image from "next/image";
import type { MDXComponents } from "mdx/types";

export const mdxComponents: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="font-bold text-xl tracking-tight leading-relaxed md:leading-normal">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="font-semibold text-base tracking-tight leading-relaxed md:leading-normal">
      {children}
    </h2>
  ),
  p: ({ children }) => (
    <p className="text-sm text-muted-foreground tracking-tight font-light">
      {children}
    </p>
  ),
  img: ({ alt, src }) => (
    <Image
      width={640}
      height={320}
      src={src!.toString()}
      alt={alt!.toString()}
    />
  ),
};
