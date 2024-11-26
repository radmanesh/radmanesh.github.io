// app/posts/[slug]/page.tsx
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { allPosts } from "contentlayer/generated";
import { getMDXComponent } from "next-contentlayer2/hooks";

import { calculateReadingTime } from "@/lib/content";
import { mdxComponents } from "@/components/shared/mdx-components";

// --------- PAGE PROPS ---------
type PostPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post._raw.flattenedPath,
  }));
}

export async function generateMetadata({ params }: PostPageProps) {
  const slug = (await params).slug;
  const post = allPosts.find((post) => post._raw.flattenedPath === slug);
  if (!post) throw new Error(`Post not found for slug: ${slug}`);
  return { title: post.title, description: post.summary };
}

// --------- PAGE LAYOUT ---------
export default async function PostPage({ params }: PostPageProps) {
  const slug = (await params).slug;
  const post = allPosts.find((post) => post._raw.flattenedPath === slug);

  if (!post) throw new Error(`Post not found for slug: ${slug}`);

  const MDXContent = getMDXComponent(post.body.code);
  return (
    <article className="space-y-8">
      <div className="flex flex-col justify-center items-center gap-4">
        <Image
          width={640}
          height={320}
          src={post.cover}
          className="rounded-lg w-full"
          alt={`${post.title}'s cover image`}
        />
        <div className="space-y-1 text-center tracking-tight">
          <h1 className="font-bold text-2xl md:text-3xl">{post.title}</h1>
          <h2 className="text-muted-foreground text-base md:text-lg">
            {post.summary}
          </h2>
          <div className="flex items-center justify-center gap-2 text-xs text-foreground/50 md:text-sm">
            <time dateTime={post.publishedAt}>
              {format(post.publishedAt, "LLL dd, yyyy")}
            </time>
            <span>&#x2022;</span>
            <span>
              {calculateReadingTime(post.body.raw)}{" "}
              {calculateReadingTime(post.body.raw) === 1 ? "min" : "mins"} read
            </span>
          </div>
        </div>
      </div>
      <hr/>
      <div className="text-left">
        <MDXContent components={mdxComponents} />
      </div>
    </article>
  );
}
