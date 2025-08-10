import { Grid3X3, Smile } from "lucide-react";
import type { Experiment } from "portfolioManager";

const LABS = [
  {
    id: "1",
    slug: "prime-patterns",
    title: "Prime Patterns Explorer",
    logo: <Grid3X3 className="project-logo" />,
    mode: "page",
    description:
      "Interactive Ulam spiral visualization with zoom, pan, and prime pattern coloring modes.",
  },
  {
    id: "2",
    slug: "emotion-avatar",
    title: "Emotion-Reactive Avatar",
    logo: <Smile className="project-logo" />,
    mode: "page",
    description:
      "AI-powered emotional avatar that reacts to your messages with facial expressions and speech.",
  },
] satisfies Experiment[];

export default LABS;
