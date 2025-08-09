import { useState, useCallback } from "react";

type Emotion = "neutral" | "happy" | "puzzled" | "excited" | "annoyed" | "sad" | "surprised" | "angry" | "bored" | "calm" | "fearful";

interface EmotionResponse {
  emotion: Emotion;
  response: string;
  confidence: number;
}

export function useEmotionAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeEmotion = useCallback(async (message: string): Promise<EmotionResponse | null> => {
    if (!message.trim()) return null;

    console.log("🎯 Hook: Starting emotion analysis for:", message);
    setLoading(true);
    setError(null);

    try {
      console.log("📡 Hook: Making fetch request to /api/emotion");
      const response = await fetch("/api/emotion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      console.log("📊 Hook: Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Hook: Received data:", data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to analyze emotion";
      console.error("❌ Hook: Error:", err);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
      console.log("🏁 Hook: Analysis complete");
    }
  }, []);

  return { analyzeEmotion, loading, error };
}
