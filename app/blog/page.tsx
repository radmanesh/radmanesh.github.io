import { compareDesc } from "date-fns";

import { PostCard } from "@/components/shared/post-card";
import { allPosts, type Post } from "contentlayer/generated";
import { Section, SectionTitle } from "@/components/shared/section";

// --------- PAGE LAYOUT ---------
export default function BlogPage() {
  const posts: Post[] = allPosts.sort((a, b) =>
    compareDesc(new Date(a.publishedAt), new Date(b.publishedAt))
  );
  return (
    <Section>
      <SectionTitle text="Blog posts" />
      <div className="grid grid-cols-1 gap-4">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </Section>
  );
}
