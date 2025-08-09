import { Timer, Keyboard, Crosshair, Brain, Grid3X3 } from "lucide-react";
import type { Experiment } from "portfolioManager";

const LABS = [
  {
    id: "1",
    slug: "reaction-time",
    title: "Reaction Time",
    logo: <Timer className="project-logo" />,
    mode: "page",
    description:
      "Click as fast as you can when the screen turns green. Tracks last/avg/best times.",
  },
  {
    id: "2",
    slug: "typing-speed",
    title: "Typing Speed Mini",
    logo: <Keyboard className="project-logo" />,
    mode: "page",
    description:
      "Type a short prompt. Measures WPM and accuracy with live feedback.",
  },
  {
    id: "3",
    slug: "ht-5gram",
    title: "H/T 5-gram Predictor",
    logo: <Brain className="project-logo" />,
    mode: "page",
    description:
      "Predicts your next H/T after 5 inputs. Just mathemathics nothing else! I couldn't beat 60%,",
  },
  {
    id: "4",
    slug: "prime-patterns",
    title: "Prime Patterns Explorer",
    logo: <Grid3X3 className="project-logo" />,
    mode: "page",
    description:
      "Interactive Ulam spiral visualization with zoom, pan, and prime pattern coloring modes.",
  },
  {
    id: "5",
    slug: "emotion-avatar",
    title: "Emotion-Reactive Avatar",
    logo: <Crosshair className="project-logo" />,
    mode: "page",
    description:
      "Chat with an avatar that smiles, puzzles, nods, eye-rolls, and speaks based on your tone.",
  },
] satisfies Experiment[];

export default LABS;
