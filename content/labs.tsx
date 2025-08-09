import { Timer, Keyboard, Crosshair } from "lucide-react";
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
  }
] satisfies Experiment[];

export default LABS;
