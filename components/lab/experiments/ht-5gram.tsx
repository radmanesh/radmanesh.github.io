"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// Contract
// - Input: Keystrokes or button clicks for 'H' and 'T' only.
// - After >= 5 inputs, predict next symbol using last 5-gram history.
// - Do not display the prediction; only track and show % correct so far.
// - Show the sequence entered and a separate line with running correctness %.

export default function HTFiveGram() {
  const [seq, setSeq] = useState<string>("");
  const [totalPreds, setTotalPreds] = useState(0);
  const [correctPreds, setCorrectPreds] = useState(0);
  const lastPredRef = useRef<"H" | "T" | null>(null);

  // Build a simple 5-gram frequency model from the sequence so far and find the most used context.
  const model = useMemo(() => {
    const map = new Map<string, { H: number; T: number; total: number }>();
    let topCtx: string | null = null;
    let topTotal = 0;
    // for each position i, the 5-gram context is seq[i..i+4], next is seq[i+5]
    for (let i = 0; i + 5 < seq.length; i++) {
      const ctx = seq.slice(i, i + 5);
      const next = seq[i + 5] as "H" | "T";
      const entry = map.get(ctx) ?? { H: 0, T: 0, total: 0 };
      entry[next]++;
      entry.total++;
      map.set(ctx, entry);
      if (entry.total > topTotal) {
        topTotal = entry.total;
        topCtx = ctx;
      }
    }
    return { map, topCtx };
  }, [seq]);

  // Given the last 5 of the current sequence, predict next symbol.
  function predictNext(): "H" | "T" | null {
    // Use the most used 5-gram over the entire history, not the immediate last one.
    if (seq.length < 5) return null;
    const { map, topCtx } = model;
    if (!topCtx) return null;
    const entry = map.get(topCtx)!;
    if (entry.H === entry.T) return Math.random() < 0.5 ? "H" : "T";
    return entry.H > entry.T ? "H" : "T";
  }

  // When user enters a new symbol, check previous prediction correctness.
  function register(symbol: "H" | "T") {
    // Evaluate previous prediction vs current symbol
    if (lastPredRef.current !== null) {
      setTotalPreds((x) => x + 1);
      if (lastPredRef.current === symbol) setCorrectPreds((x) => x + 1);
    }

    setSeq((s) => s + symbol);
  }

  // After sequence updates, compute and store next prediction for the future press
  useEffect(() => {
    const p = predictNext();
    lastPredRef.current = p;
  }, [seq]);

  // Keyboard support: accept 'H' and 'T' keys (case-insensitive)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "h") {
        e.preventDefault();
        register("H");
      } else if (k === "t") {
        e.preventDefault();
        register("T");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const accuracy = totalPreds > 0 ? Math.round((correctPreds / totalPreds) * 100) : 0;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Press H or T (keyboard or buttons). After your first 5 inputs, the model predicts
        your next input using the most frequent 5-gram observed so far. Only the correctness
        percentage is shown, not the prediction.
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => register("H")}
          className="px-4 py-2 rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          aria-label="Press H"
        >
          H
        </button>
        <button
          onClick={() => register("T")}
          className="px-4 py-2 rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          aria-label="Press T"
        >
          T
        </button>
      </div>

      <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-3 text-sm">
        <div className="font-semibold text-foreground mb-1">Your inputs</div>
        <div className="font-mono break-words">{seq || "-"}</div>
      </div>

      <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-3 text-sm grid grid-cols-2 gap-3">
        <div>
          <p className="uppercase text-muted-foreground">Predictions</p>
          <p className="text-foreground font-semibold">{totalPreds}</p>
        </div>
        <div>
          <p className="uppercase text-muted-foreground">Correct %</p>
          <p className="text-foreground font-semibold">{accuracy}%</p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Note: The model updates after each input. The first 5 inputs have no prediction.
      </p>
    </div>
  );
}
