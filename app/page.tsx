import { About } from "@/components/sections/about";
import { Headline } from "@/components/sections/headline";

// --------- PAGE ---------
export default function HomePage() {
  return (
   
        <div className="space-y-16">
          <Headline />
          <About />
        </div>

  );
}
