"use client";

import { useEffect, useState } from "react";
import { useEmotionAPI } from "@/lib/hooks/use-emotion-api";

type Emotion =
  | "neutral"
  | "happy"
  | "puzzled"
  | "excited"
  | "annoyed"
  | "sad"
  | "surprised"
  | "angry"
  | "bored"
  | "calm"
  | "fearful";
type Msg = { role: "user" | "agent"; text: string };

export default function EmotionAvatar() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "agent", text: "Hi! Tell me something and I’ll react with my face." },
  ]);
  const [input, setInput] = useState("");
  const [emotion, setEmotion] = useState<Emotion>("neutral");
  const [speaking, setSpeaking] = useState(false);
  const [gesture, setGesture] = useState<"none" | "nod" | "eyeroll" | "shake" | "tiltBack">("none");
  const [useAI, setUseAI] = useState(false);

  const { analyzeEmotion, loading, error } = useEmotionAPI();

  // Heuristic sentiment/arousal/intent classifier (fallback when AI is disabled/fails)
  const analyzeHeuristic = (orig: string): Emotion => {
    const t = orig.toLowerCase();
    const exclam = (orig.match(/!/g) || []).length;
    const qmarks = (orig.match(/\?/g) || []).length;
    const hasEllipsis = t.includes("...") || t.includes("…");

    const POS = ["love", "great", "awesome", "amazing", "nice", "good", "cool", "yay", "thanks", "sweet"];
    const NEG = ["bad", "hate", "terrible", "worst", "awful", "sucks", "nope"];
    const ANNOY = ["annoy", "ugh", "meh", "eye roll", "eyeroll"];
    const SAD = ["sad", "down", "depressed", "unhappy", "cry", "upset"];
    const ANGRY = ["angry", "furious", "mad", "rage", "pissed"];
    const BORED = ["bored", "boring", "tired", "meh", "whatever", "idc", "idk"];
    const FEAR = ["scared", "afraid", "nervous", "anxious", "anxiety", "worried", "fear"];
    const SURP = ["wow", "omg", "whoa", "no way", "unbelievable", "wait what"];
    const CONF = ["what", "why", "how", "huh", "confused"];
    const CALM = ["calm", "relax", "chill", "fine", "okay", "ok", "alright"];

    const count = (arr: string[]) => arr.reduce((s, w) => (t.includes(w) ? s + 1 : s), 0);
    const pos = count(POS);
    const neg = count(NEG);
    const annoyed = count(ANNOY);
    const sad = count(SAD);
    const angry = count(ANGRY);
    const bored = count(BORED) + (hasEllipsis ? 1 : 0);
    const fear = count(FEAR);
    const surp = count(SURP) + exclam;
    const conf = qmarks + count(CONF);
    const calm = count(CALM);

    // Strong intent overrides
    if (fear > 0) return "fearful";
    if (surp >= 2) return "surprised";
    if (bored >= 2) return "bored";
    if (conf >= 2) return "puzzled";

    // Valence/Arousal grid
    const valence = pos - (neg + annoyed + angry + sad);
    const arousal = exclam >= 1 || surp >= 1 ? 1 : 0; // 1=high, 0=low

    if (angry > 0 && arousal) return "angry";
    if ((annoyed > 0 || neg > 0) && !arousal) return "annoyed";
    if (sad > 0 && !arousal) return "sad";
    if (calm > 0 && !arousal && valence >= 0) return "calm";
    if (valence >= 2 && arousal) return "excited";
    if (valence >= 1 && !arousal) return "happy";

    if (conf >= 1) return "puzzled";
    if (surp >= 1) return "surprised";
    if (bored >= 1) return "bored";

    return "neutral";
  };

  const replyFor = (emo: Emotion) => {
    switch (emo) {
      case "excited":
        return "Wow, that’s exciting!";
      case "happy":
        return "That sounds nice!";
      case "puzzled":
        return "Hmm, let me think...";
      case "annoyed":
        return "I see, that’s frustrating.";
      case "sad":
        return "Sorry you’re feeling down.";
      case "surprised":
        return "That’s surprising!";
      case "angry":
        return "I hear your anger.";
      case "bored":
        return "Want to switch it up?";
      case "calm":
        return "Chill vibes.";
      case "fearful":
        return "That sounds scary—I'm here.";
      default:
        return "Got it.";
    }
  };

  const speak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");

    let emo: Emotion;
    let botResponse: string;

    if (useAI) {
      const result = await analyzeEmotion(text);
      if (result) {
        emo = result.emotion;
        botResponse = result.response;
      } else {
        // Fallback to heuristic if API fails
        emo = analyzeHeuristic(text);
        botResponse = replyFor(emo);
      }
    } else {
      emo = analyzeHeuristic(text);
      botResponse = replyFor(emo);
    }

    setEmotion(emo);

    // Trigger a short contextual gesture
    setGesture(
      emo === "annoyed"
        ? "eyeroll"
        : emo === "angry"
        ? "shake"
        : emo === "happy" || emo === "excited"
        ? "nod"
        : emo === "surprised" || emo === "fearful"
        ? "tiltBack"
        : "none"
    );
    setTimeout(() => setGesture("none"), 900);

    setTimeout(() => {
      setMessages((m) => [...m, { role: "agent", text: botResponse }]);
      speak(botResponse);
    }, 240);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") send();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <p className="text-sm text-muted-foreground flex-1">
          Type something with a tone. The avatar reacts and speaks.
        </p>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={useAI}
            onChange={(e) => setUseAI(e.target.checked)}
            className="rounded"
          />
          Use AI Analysis
        </label>
      </div>

      {error && (
        <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded border">
          AI Error: {error} (using fallback)
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
          <SvgAvatar emotion={emotion} speaking={speaking} gesture={gesture} />
        </div>

        <div className="flex-1 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 flex flex-col">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={loading}
              className="flex-1 rounded-md border border-zinc-200 dark:border-zinc-700 bg-background px-3 py-2 outline-none disabled:opacity-50"
              placeholder="Say something like: 'Awesome!!' or 'Wait, what?'"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="px-3 py-2 rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50"
            >
              {loading ? "..." : "Send"}
            </button>
          </div>

          <div className="mt-4 space-y-2 overflow-auto max-h-64">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                <span
                  className={[
                    "inline-block px-3 py-2 rounded-lg text-sm",
                    m.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-zinc-100 dark:bg-zinc-800 text-foreground",
                  ].join(" ")}
                >
                  {m.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        {useAI ? "Using OpenAI for emotion analysis" : "Using heuristic analysis"} •
        Speech synthesis {typeof window !== "undefined" && "speechSynthesis" in window ? "enabled" : "not supported"}
      </div>
    </div>
  );
}

function SvgAvatar({
  emotion,
  speaking,
  gesture,
}: {
  emotion: Emotion;
  speaking: boolean;
  gesture: "none" | "nod" | "eyeroll" | "shake" | "tiltBack";
}) {
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    let alive = true;
    let timer: number;
    const schedule = () => {
      if (!alive) return;
      setBlink(true);
      setTimeout(() => setBlink(false), 140);
      timer = window.setTimeout(schedule, 3000 + Math.random() * 3000);
    };
    timer = window.setTimeout(schedule, 1800 + Math.random() * 1800);
    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, []);

  // Head transform
  const headRotate =
    gesture === "nod" ? 8 : gesture === "tiltBack" ? -6 : gesture === "shake" ? -5 : 0;
  const headDy = gesture === "nod" ? 3 : 0;

  // Brow tilt by emotion (approximation)
  const browTilt =
    emotion === "puzzled"
      ? 10
      : emotion === "annoyed"
      ? -8
      : emotion === "angry"
      ? -12
      : emotion === "excited"
      ? 6
      : emotion === "surprised"
      ? 12
      : emotion === "sad"
      ? -4
      : emotion === "bored"
      ? -2
      : 0;

  // Pupil offsets by emotion/gesture
  let pupilDx = 0;
  let pupilDy = 0;
  if (gesture === "eyeroll") {
    pupilDx = 6;
    pupilDy = -2;
  } else {
    if (emotion === "bored") {
      pupilDx = -2;
      pupilDy = -1;
    } else if (emotion === "sad") {
      pupilDy = 2;
    } else if (emotion === "fearful") {
      pupilDy = -3;
    }
  }

  // Eye openness (blink overrides)
  const baseEyeOpen =
    emotion === "surprised" || emotion === "fearful"
      ? 7
      : emotion === "excited"
      ? 6
      : emotion === "bored"
      ? 2
      : emotion === "annoyed" || emotion === "angry"
      ? 3
      : emotion === "sad"
      ? 3
      : emotion === "puzzled"
      ? 4
      : 5; // neutral/happy/calm
  const eyeOpen = blink ? 0.5 : baseEyeOpen;

  // Mouth
  const mouthOpen = speaking
    ? 10
    : emotion === "surprised" || emotion === "fearful"
    ? 10
    : emotion === "happy" || emotion === "excited"
    ? 6
    : emotion === "annoyed" || emotion === "angry" || emotion === "sad"
    ? 2
    : 4;

  // Note: arcPath uses cy = midY - curvature; positive curvature bends upward (frown), negative bends downward (smile)
  const smile =
    emotion === "excited"
      ? -7
      : emotion === "happy"
      ? -6
      : emotion === "calm"
      ? -2
      : emotion === "annoyed"
      ? 3
      : emotion === "angry"
      ? 5
      : emotion === "sad"
      ? 6
      : emotion === "puzzled"
      ? 1
      : emotion === "bored"
      ? 0
      : 1; // neutral/surprised/fearful slightly flat/neutral

  return (
    <svg viewBox="0 0 200 200" className="w-full h-auto">
      <g
        transform={`translate(100,100) rotate(${headRotate}) translate(0,${headDy})`}
        style={{ transition: "transform 250ms ease" }}
      >
        <circle cx="0" cy="0" r="60" fill="#f3e7dc" stroke="#d6c6b8" />

        {(() => {
          const isAnnoyed = emotion === "annoyed";
          const leftBrow = isAnnoyed ? "M-35,-24 Q-20,-16 -5,-10" : "M-35,-20 Q-20,-28 -5,-22";
          const rightBrow = isAnnoyed ? "M5,-10 Q20,-16 35,-24" : "M5,-22 Q20,-28 35,-20";
          return (
            <g
              stroke="#333"
              strokeWidth="3"
              strokeLinecap="round"
              transform={`rotate(${isAnnoyed ? 0 : browTilt})`}
              style={{ transition: "transform 200ms ease" }}
            >
              <path d={leftBrow} />
              <path d={rightBrow} />
            </g>
          );
        })()}

        <g fill="#000">
          <ellipse cx="-20" cy="-5" rx="12" ry={eyeOpen} fill="#fff" stroke="#ccc" />
          <ellipse cx="20" cy="-5" rx="12" ry={eyeOpen} fill="#fff" stroke="#ccc" />
          <circle cx={-20 + pupilDx} cy={-5 + pupilDy} r={eyeOpen > 0.6 ? 4 : 0.8} />
          <circle cx={20 + pupilDx} cy={-5 + pupilDy} r={eyeOpen > 0.6 ? 4 : 0.8} />
        </g>

        <path d={arcPath(-22, 18, 22, 18, smile)} fill="none" stroke="#333" strokeWidth="4" strokeLinecap="round" />
        <rect
          x={-4}
          y={20}
          width={8}
          height={mouthOpen}
          rx="3"
          fill="#d16c6c"
          style={{ transition: "height 120ms ease" }}
        />

        <path d="M-30,60 Q0,40 30,60" fill="#7c9ae7" stroke="#5a77c6" />
      </g>

      <text x="100" y="185" textAnchor="middle" fill="#6b7280" fontSize="10">
        Emotion: {emotion} {speaking ? "(speaking)" : ""}
      </text>
    </svg>
  );
}

function arcPath(x1: number, y1: number, x2: number, y2: number, curvature: number) {
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2 - curvature;
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}
