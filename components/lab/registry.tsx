import PrimePatterns from "@/components/lab/experiments/prime-patterns";
import EmotionAvatar from "@/components/lab/experiments/emotion-avatar";
import ConwaysGameOfLife from "@/components/lab/experiments/conways-game-of-life";

export const LAB_REGISTRY: Record<string, { title: string; Component: React.ComponentType }> = {
  "prime-patterns": { title: "Prime Patterns Explorer", Component: PrimePatterns },
  "emotion-avatar": { title: "Emotion-Reactive Avatar", Component: EmotionAvatar },
  "conways-game-of-life": { title: "Conway's Game of Life", Component: ConwaysGameOfLife },
};
