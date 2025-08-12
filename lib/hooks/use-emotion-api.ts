import { useState, useCallback } from "react";

type Emotion = "neutral" | "happy" | "puzzled" | "excited" | "annoyed" | "sad" | "surprised" | "angry" | "bored" | "calm" | "fearful";
type Gesture = "none" | "nod" | "eyeroll" | "shake" | "tiltBack" | "eyesWide" | "leanIn" | "tiltSide";

interface EmotionResponse {
  emotion: Emotion;
  response: string;
  confidence: number;
  gesture: Gesture;
}

export function useEmotionAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeEmotion = useCallback(async (
    message: string,
    conversationHistory: Array<{role: "user" | "agent"; text: string}> = []
  ): Promise<EmotionResponse | null> => {
    if (!message.trim()) return null;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/emotion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          conversationHistory
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to analyze emotion";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { analyzeEmotion, loading, error };
}
