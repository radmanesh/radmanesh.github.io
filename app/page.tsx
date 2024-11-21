import { About } from "@/components/sections/about";
import { Headline } from "@/components/sections/headline";

// --------- PAGE ---------
export default function HomePage() {
  return (
    <main>
      <div className="px-6 md:px-6">
        <div className="mx-auto w-full max-w-3xl space-y-16">
          <Headline />
          <About />
        </div>
      </div>
    </main>
  );
}
