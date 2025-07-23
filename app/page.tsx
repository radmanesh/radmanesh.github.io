import { About } from "@/components/sections/about";
import { Socials } from "@/components/sections/socials";
import { Headline } from "@/components/sections/headline";
import { BlogPosts } from "@/components/sections/blog-posts";
import { FeaturedProjects } from "@/components/sections/featured-projects";

// --------- PAGE ---------
export default function HomePage() {
  return (
    <div className="space-y-16">
      <Headline />
      <About />
      <FeaturedProjects />
      <BlogPosts />
      <Socials />
    </div>
  );
}
