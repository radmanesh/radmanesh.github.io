"use client";

import { useEffect, useMemo, useState } from "react";

const SAMPLE = "The quick brown fox jumps over the lazy dog.";

export default function TypingSpeed() {
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!startedAt && input.length > 0) setStartedAt(performance.now());
    if (input === SAMPLE) setFinished(true);
  }, [input, startedAt]);

  const { wpm, accuracy } = useMemo(() => {
    const elapsedMin = startedAt ? (performance.now() - startedAt) / 1000 / 60 : 0;
    const words = input.length / 5;
    const wpm = elapsedMin > 0 ? Math.max(0, Math.round(words / elapsedMin)) : 0;

    let correct = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === SAMPLE[i]) correct++;
    }
    const acc = input.length > 0 ? Math.round((correct / input.length) * 100) : 100;

    return { wpm, accuracy: acc };
  }, [input, startedAt]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Type the text below. WPM is calculated as characters/5 per minute.
      </p>
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
        <p className="font-mono text-sm md:text-base">
          {SAMPLE.split("").map((ch, i) => {
            let cls = "";
            if (i < input.length) {
              cls = input[i] === ch ? "text-emerald-600" : "text-rose-600";
            }
            return (
              <span key={i} className={cls}>
                {ch}
              </span>
            );
          })}
        </p>
      </div>
      <textarea
        rows={3}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 p-3 outline-none"
        placeholder="Start typing here..."
        disabled={finished}
      />
      <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-3">
          <p className="uppercase">WPM</p>
          <p className="text-foreground font-semibold">{wpm}</p>
        </div>
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-3">
          <p className="uppercase">Accuracy</p>
          <p className="text-foreground font-semibold">{accuracy}%</p>
        </div>
      </div>
    </div>
  );
}
