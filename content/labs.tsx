import { Grid3X3, Smile, Grid2X2 } from "lucide-react";
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
  {
    id: "3",
    slug: "conways-game-of-life",
    title: "Conway's Game of Life",
    logo: <Grid2X2 className="project-logo" />,
    mode: "page",
    description:
      "Interactive cellular automaton with design and simulation modes. Create patterns and watch them evolve.",
  },
] satisfies Experiment[];

export default LABS;
