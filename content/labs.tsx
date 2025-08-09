import { Timer, Keyboard, Crosshair, Brain } from "lucide-react";
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
] satisfies Experiment[];

export default LABS;
