import PrimePatterns from "@/components/lab/experiments/prime-patterns";
import EmotionAvatar from "@/components/lab/experiments/emotion-avatar";

export const LAB_REGISTRY: Record<string, { title: string; Component: React.ComponentType }> = {
  "prime-patterns": { title: "Prime Patterns Explorer", Component: PrimePatterns },
  "emotion-avatar": { title: "Emotion-Reactive Avatar", Component: EmotionAvatar },
};
