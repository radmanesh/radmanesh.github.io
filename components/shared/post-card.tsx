import {
  Book,
  BriefcaseBusiness,
  Calendar,
  Code,
  SquareDashedBottomCode,
} from "lucide-react";

import { ComponentProps } from "react";
import type { Post } from "contentlayer/generated";
import { format } from "date-fns";

// --------- COMPONENT PROPS ---------
interface PostCardProps extends ComponentProps<"a"> {
  post: Post;
}

// --------- COMPONENT LAYOUT ---------
export function PostCard({ post, ...props }: Readonly<PostCardProps>) {
  function getTagIcon(tag: string) {
    if (tag === "technical") {
      return <Code className="project-logo" />;
    } else if (tag === "tips") {
      return <SquareDashedBottomCode className="project-logo" />;
    } else if (tag === "career") {
      return <BriefcaseBusiness className="project-logo" />;
    } else if (tag === "events") {
      return <Calendar className="project-logo" />;
    } else {
      return <Book className="project-logo" />;
    }
  }
  return (
    <a href={post.url} {...props}>
      <div className="rounded-lg border text-card-foreground relative overflow-hidden transition-all duration-300 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:border-zinc-500 dark:hover:border-zinc-400">
        <div className="flex items-center p-4">
          <div className="shrink-0 mr-4">{getTagIcon(post.tag)}</div>
          <div className="grow min-w-0 tracking-tight font-normal">
            <p className="text-xs text-muted-foreground/80 uppercase">{`${format(
              post.publishedAt,
              "LLL dd, yyyy"
            )} • ${post.readingTime} ${
              post.readingTime === 1 ? "min" : "mins"
            } read`}</p>
            <h2 className="font-bold truncate leading-relaxed">{post.title}</h2>
            <p className="text-sm text-muted-foreground">{post.summary}</p>
          </div>
        </div>
      </div>
    </a>
  );
}
