import { compareDesc } from "date-fns";

import { allPosts } from "contentlayer/generated";
import { PostCard } from "@/components/shared/post-card";
import { AnimatedLink } from "@/components/shared/animated-link";
import { Section, SectionTitle } from "@/components/shared/section";

export function BlogPosts() {
  return (
    <Section>
      <SectionTitle text="Blog posts" />
      <div className="grid grid-cols-1 gap-4">
        {allPosts
          .sort((a, b) =>
            compareDesc(new Date(a.publishedAt), new Date(b.publishedAt))
          )
          .map((post) => (
            <PostCard post={post} key={post._id} />
          )).slice(0, 5)}
      </div>
      <div className="flex justify-end">
        <AnimatedLink href="/blog">View all posts</AnimatedLink>
      </div>
    </Section>
  );
}
