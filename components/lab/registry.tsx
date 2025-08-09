import ReactionTime from "@/components/lab/experiments/reaction-time";
import TypingSpeed from "@/components/lab/experiments/typing-speed";

export const LAB_REGISTRY: Record<string, { title: string; Component: React.ComponentType }> = {
  "reaction-time": { title: "Reaction Time", Component: ReactionTime },
  "typing-speed": { title: "Typing Speed Mini", Component: TypingSpeed },
};
