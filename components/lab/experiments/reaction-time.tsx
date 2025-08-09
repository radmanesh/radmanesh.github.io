"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export default function ReactionTime() {
  const [state, setState] = useState<"idle" | "waiting" | "go" | "tooSoon">("idle");
  const [message, setMessage] = useState("Click to start. Wait for green, then click!");
  const [rt, setRt] = useState<number | null>(null);
  const [best, setBest] = useState<number | null>(null);
  const startRef = useRef<number>(0);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("lab-reaction-time-best");
    if (saved) setBest(Number(saved));
  }, []);

  const resetTimer = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const start = useCallback(() => {
    resetTimer();
    setRt(null);
    setState("waiting");
    setMessage("Wait for green...");
    const delay = 800 + Math.floor(Math.random() * 1800);
    timeoutRef.current = window.setTimeout(() => {
      setState("go");
      setMessage("GO!");
      startRef.current = performance.now();
    }, delay);
  }, []);

  const clickArea = useCallback(() => {
    if (state === "idle") {
      start();
    } else if (state === "waiting") {
      resetTimer();
      setState("tooSoon");
      setMessage("Too soon! Click to try again.");
    } else if (state === "go") {
      const t = performance.now() - startRef.current;
      const ms = Math.round(t);
      setRt(ms);
      setMessage("Click to try again.");
      setState("idle");
      if (best == null || ms < best) {
        setBest(ms);
        localStorage.setItem("lab-reaction-time-best", String(ms));
      }
    } else if (state === "tooSoon") {
      setState("idle");
      setMessage("Click to start. Wait for green, then click!");
    }
  }, [best, state, start]);

  useEffect(() => () => resetTimer(), []);

  return (
    <div className="space-y-4">
      <div
        role="button"
        onClick={clickArea}
        className={[
          "h-40 md:h-56 rounded-lg flex items-center justify-center cursor-pointer select-none border transition-colors",
          state === "go"
            ? "bg-emerald-500 text-white border-emerald-600"
            : state === "waiting"
            ? "bg-amber-500 text-white border-amber-600"
            : state === "tooSoon"
            ? "bg-rose-500 text-white border-rose-600"
            : "bg-zinc-100 dark:bg-zinc-800 text-foreground border-zinc-200 dark:border-zinc-700",
        ].join(" ")}
      >
        <span className="font-semibold">{message}</span>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-3">
          <p className="uppercase">Last</p>
          <p className="text-foreground font-semibold">{rt != null ? `${rt} ms` : "-"}</p>
        </div>
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-3">
          <p className="uppercase">Best</p>
          <p className="text-foreground font-semibold">{best != null ? `${best} ms` : "-"}</p>
        </div>
      </div>
    </div>
  );
}
