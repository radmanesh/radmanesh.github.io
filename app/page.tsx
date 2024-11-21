import { HeadlineCopy } from "@/components/headline-copy";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <main>
      <div className="px-4 sm:px-6">
        <div className="mx-auto w-full max-w-3xl space-y-16">
          <HeadlineCopy />
          <div className="space-y-4">
            <h2 className="font-semibold text-lg">About me</h2>
            <div className="grid grid-cols-1 gap-3 leading-relaxed md:leading-normal tracking-tight">
              <p>Hey, Ahmed here!</p>
              <p>
                I'm a full-stack software engineer based in Tanta, Egypt, with a
                strong focus on front-end development using{" "}
                <Badge
                  variant="outline"
                  className="rounded-full border border-[#61DAFB] bg-[#61DAFB]/10 text-[#61DAFB]"
                >
                  React
                </Badge>
                . I'm passionate about creating software that's not only
                functional but also intuitive and enjoyable for users.
              </p>
              <p>
                I currently work as a founding engineer at{" "}
                <a
                  target="_blank noreferrer"
                  href="https://www.reconciled.io/"
                  className="font-semibold underline decoration-dotted"
                >
                  Reconciled
                </a>
                , where we're building a reverse invoice reconciliation app
                using Next.js, TailwindCSS, and ShadCN.
              </p>
              <p>
                Beyond coding, I love reading, exploring new technologies, and
                experimenting with innovative ideas. Recently, I've been diving
                into{" "}
                <Badge
                  variant="outline"
                  className="rounded-full border border-[#000000] bg-[#000000]/10 text-[#000000] dark:border-[#ffffff] dark:bg-[#ffffff]/10 dark:text-[#ffffff]"
                >
                  Next.js
                </Badge>
                ,{" "}
                <Badge
                  variant="outline"
                  className="rounded-full border border-[#3178C6] bg-[#3178C6]/10 text-[#3178C6]"
                >
                  TypeScript
                </Badge>
                , and{" "}
                <Badge
                  variant="outline"
                  className="rounded-full border border-[#06B6D4] bg-[#06B6D4]/10 text-[#06B6D4]"
                >
                  Tailwind CSS
                </Badge>{" "}
                as I work toward my goal of becoming a product engineer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
