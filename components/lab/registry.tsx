import ReactionTime from "@/components/lab/experiments/reaction-time";
import TypingSpeed from "@/components/lab/experiments/typing-speed";
import HTFiveGram from "@/components/lab/experiments/ht-5gram";
import PrimePatterns from "@/components/lab/experiments/prime-patterns";

export const LAB_REGISTRY: Record<string, { title: string; Component: React.ComponentType }> = {
  "reaction-time": { title: "Reaction Time", Component: ReactionTime },
  "typing-speed": { title: "Typing Speed Mini", Component: TypingSpeed },
  "ht-5gram": { title: "H/T 5-gram Predictor", Component: HTFiveGram },
  "prime-patterns": { title: "Prime Patterns Explorer", Component: PrimePatterns },
};
