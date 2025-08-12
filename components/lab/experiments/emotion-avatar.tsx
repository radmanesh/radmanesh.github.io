"use client";

import { useEffect, useState, useRef } from "react";
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
type Gesture = "none" | "nod" | "eyeroll" | "shake" | "tiltBack" | "eyesWide" | "leanIn" | "tiltSide";
type Msg = { role: "user" | "agent"; text: string };

// Shared lexical lists for heuristic emotion + confidence estimation
const WORD_LISTS = {
  POS: ["love", "great", "awesome", "amazing", "nice", "good", "cool", "yay", "thanks", "sweet"],
  NEG: ["bad", "hate", "terrible", "worst", "awful", "sucks", "nope"],
  ANNOY: ["annoy", "ugh", "meh", "eye roll", "eyeroll"],
  SAD: ["sad", "down", "depressed", "unhappy", "cry", "upset"],
  ANGRY: ["angry", "furious", "mad", "rage", "pissed"],
  BORED: ["bored", "boring", "tired", "meh", "whatever", "idc", "idk"],
  FEAR: ["scared", "afraid", "nervous", "anxious", "anxiety", "worried", "fear"],
  SURP: ["wow", "omg", "whoa", "no way", "unbelievable", "wait what"],
  CONF: ["what", "why", "how", "huh", "confused"],
  CALM: ["calm", "relax", "chill", "fine", "okay", "ok", "alright"],
} as const;

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

export default function EmotionAvatar() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "agent", text: "Hi! Tell me something and I’ll react with my face." },
  ]);
  const [input, setInput] = useState("");
  const [emotion, setEmotion] = useState<Emotion>("neutral");
  const [speaking, setSpeaking] = useState(false);
  const [gesture, setGesture] = useState<Gesture>("none");
  const [useAI, setUseAI] = useState(true);
  const [confidence, setConfidence] = useState<number>(0.6);
  const [voiceMode, setVoiceMode] = useState(false);
  const [listening, setListening] = useState(false);
  const [speechInitialized, setSpeechInitialized] = useState(false);
  const recognitionRef = useRef<any | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize speech synthesis on first user interaction (required for mobile)
  const initializeSpeech = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window) || speechInitialized) return;

    // Create a silent utterance to initialize the speech API
    const testUtterance = new SpeechSynthesisUtterance("");
    testUtterance.volume = 0;
    window.speechSynthesis.speak(testUtterance);
    setSpeechInitialized(true);
  };

  // Heuristic confidence estimator used when AI is off or fails
  function computeHeuristicConfidence(orig: string, target: Emotion): number {
    const t = orig.toLowerCase();
    const exclam = (orig.match(/!/g) || []).length;
    const qmarks = (orig.match(/\?/g) || []).length;
    const hasEllipsis = t.includes("...") || t.includes("…");
    const { POS, NEG, ANNOY, SAD, ANGRY, BORED, FEAR, SURP, CONF, CALM } = WORD_LISTS;
    const count = (arr: readonly string[]) => arr.reduce((s, w) => (t.includes(w) ? s + 1 : s), 0);

    const categories: Record<Emotion, number> = {
      excited: count(POS) + exclam,
      happy: count(POS),
      puzzled: count(CONF) + qmarks,
      annoyed: count(ANNOY) + Math.max(0, count(NEG) - 0),
      sad: count(SAD),
      surprised: count(SURP) + exclam,
      angry: count(ANGRY),
      bored: count(BORED) + (hasEllipsis ? 1 : 0),
      calm: count(CALM),
      fearful: count(FEAR),
      neutral: 0,
    };

    const total = Object.values(categories).reduce((a, b) => a + b, 0);
    const match = categories[target] || 0;
    if (total === 0) return 0.5;
    const ratio = match / total; // how dominant target is
    const score = 0.25 + ratio * 0.75; // keep some base confidence
    return Math.max(0, Math.min(1, score));
  }

  // Heuristic gesture assignment for fallback mode
  function getHeuristicGesture(emo: Emotion): Gesture {
    switch (emo) {
      case "surprised":
        return "eyesWide"; // stronger visual surprise
      case "puzzled":
        return "tiltSide"; // inquisitive tilt
      case "calm":
        return "leanIn"; // attentive listening
      case "fearful":
        return "tiltBack";
      case "annoyed":
        return "eyeroll";
      case "angry":
        return "shake";
      case "excited":
      case "happy":
        return "nod";
      default:
        return "none";
    }
  }

  const { analyzeEmotion, loading, error } = useEmotionAPI();

  // Heuristic sentiment/arousal/intent classifier (fallback when AI is disabled/fails)
  const analyzeHeuristic = (orig: string): Emotion => {
    const t = orig.toLowerCase();
    const exclam = (orig.match(/!/g) || []).length;
    const qmarks = (orig.match(/\?/g) || []).length;
    const hasEllipsis = t.includes("...") || t.includes("…");
    const { POS, NEG, ANNOY, SAD, ANGRY, BORED, FEAR, SURP, CONF, CALM } = WORD_LISTS;
    const count = (arr: readonly string[]) => arr.reduce((s, w) => (t.includes(w) ? s + 1 : s), 0);
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
    u.rate = 0.9;
    u.pitch = 1.0;
    u.volume = 1.0;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);

    window.speechSynthesis.cancel();

    // Small delay to ensure cancellation is processed
    setTimeout(() => {
      window.speechSynthesis.speak(u);
    }, 100);
  };

  const processText = async (text: string) => {
    const clean = text.trim();
    if (!clean || loading) return;

    setMessages((m) => [...m, { role: "user", text: clean }]);
    setInput("");

    let emo: Emotion;
    let conf: number = 0.6;
    let gest: Gesture = "none";
    let botResponse: string;

    if (useAI) {
      const result = await analyzeEmotion(clean, messages);
      if (result) {
        emo = result.emotion;
        botResponse = result.response;
        conf = Math.max(0, Math.min(1, Number(result.confidence ?? 0.6)));
        gest = result.gesture || "none";
      } else {
        // Fallback to heuristic if API fails
        emo = analyzeHeuristic(text);
        botResponse = replyFor(emo);
        conf = computeHeuristicConfidence(text, emo);
        gest = getHeuristicGesture(emo);
      }
    } else {
      emo = analyzeHeuristic(clean);
      botResponse = replyFor(emo);
      conf = computeHeuristicConfidence(clean, emo);
      gest = getHeuristicGesture(emo);
    }

    setEmotion(emo);
    setConfidence(conf);

  // Apply LLM-controlled gesture (debounce identical rapid repeats)
  setGesture((prev) => (prev === gest ? prev : gest));
  const gestureDuration = gest === "leanIn" ? 1400 : 1000; // leanIn feels nicer a tad longer
  setTimeout(() => setGesture("none"), gestureDuration);

    setTimeout(() => {
      setMessages((m) => [...m, { role: "agent", text: botResponse }]);
      speak(botResponse);
    }, 240);
  };

  const send = async () => {
    initializeSpeech(); // Initialize speech on user interaction
    await processText(input);
  };

  // Speech recognition helpers
  const startListening = () => {
    if (typeof window === "undefined") return;
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    // If currently speaking, don't start yet
    if (speaking) return;

    if (!recognitionRef.current) {
      const rec = new SR();
      rec.continuous = false; // turn-taking, not dictation
      rec.interimResults = true;
      rec.lang = "en-US";
      rec.onstart = () => setListening(true);
      rec.onerror = () => setListening(false);
      rec.onend = () => setListening(false);
      rec.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        // Show interim transcript in the input
        setInput(transcript);
        const isFinal = event.results[event.results.length - 1].isFinal;
        if (isFinal) {
          // Stop mic before processing
          try {
            rec.stop();
          } catch {}
          setListening(false);
          processText(transcript);
        }
      };
      recognitionRef.current = rec;
    }

    try {
      recognitionRef.current.start();
    } catch {
      // may throw if already started
    }
  };

  const stopListening = () => {
    const rec = recognitionRef.current;
    if (rec) {
      try {
        rec.stop();
      } catch {}
    }
    setListening(false);
  };

  const toggleVoiceMode = () => {
    initializeSpeech(); // Initialize speech on user interaction
    const next = !voiceMode;
    setVoiceMode(next);
    if (next) {
      startListening();
    } else {
      stopListening();
    }
  };

  // Pause listening while TTS is speaking; resume afterward if voice mode is on
  useEffect(() => {
    if (speaking) {
      stopListening();
    } else if (voiceMode) {
      // small delay to avoid picking up the tail of TTS
      const t = setTimeout(() => startListening(), 250);
      return () => clearTimeout(t);
    }
  }, [speaking, voiceMode]);

  // Auto-start listening when voice mode is on and we're not speaking or already listening
  useEffect(() => {
    if (voiceMode && !speaking && !listening) {
      const t = setTimeout(() => startListening(), 150);
      return () => clearTimeout(t);
    }
  }, [voiceMode, speaking, listening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
      recognitionRef.current = null;
    };
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") send();
  };

  // Keep recent conversation visible by auto-scrolling to the bottom on new messages
  useEffect(() => {
    if (!chatEndRef.current) return;
    // Respect reduced motion if set
    const prefersReduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    chatEndRef.current.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "end" });
  }, [messages]);

  // Derive palette for status box color and contrast text
  const pal = getEmotionPalette(emotion);
  const textColor = getContrastingTextColor(pal.accent);
  const displayPercent = Math.round(confidence * 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <p className="text-sm text-muted-foreground flex-1">
          Type something with a tone. The avatar reacts and speaks with AI-controlled gestures based on conversation context.
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
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={loading}
              className="flex-1 rounded-md border border-zinc-200 dark:border-zinc-700 bg-background px-3 py-2 outline-none disabled:opacity-50"
              placeholder="Say something like: 'Awesome!!' or 'Wait, what?'"
            />
            <div className="flex gap-2">
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="px-3 py-2 rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50 flex-shrink-0"
              >
                {loading ? "..." : "Send"}
              </button>
              <button
                onClick={toggleVoiceMode}
                disabled={loading || (typeof window !== "undefined" && !("SpeechRecognition" in window || ("webkitSpeechRecognition" in (window as any))))}
                className={[
                  "px-3 py-2 rounded-md border flex-shrink-0 text-sm",
                  voiceMode
                    ? "border-red-300 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20"
                    : "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800",
                ].join(" ")}
                title={voiceMode ? "Stop voice conversation" : "Start voice conversation"}
              >
                {voiceMode ? (listening ? "🎤 Stop" : "⏸️ Stop") : "🎤 Voice"}
              </button>
            </div>
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
            <div ref={chatEndRef} />
          </div>
        </div>
      </div>

      {/* Status box below prompt and avatar */}
      <div
        className="relative rounded-lg border overflow-hidden"
        style={{ backgroundColor: "transparent", color: textColor, borderColor: pal.accent }}
      >
        {/* Accent overlay with confidence-controlled opacity and smooth color changes */}
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{ backgroundColor: pal.accent, opacity: confidence, transition: "background-color 240ms ease, opacity 200ms ease" }}
        />

        <div className="relative px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-base">{emotionEmoji(emotion)}</span>
            <span className="font-medium">Avatar state</span>
            <span className="opacity-80 hidden sm:inline">•</span>
            <span className="opacity-90">
              Emotion: <b>{emotion}</b>
            </span>
            <span className="opacity-80 hidden sm:inline">•</span>
            <span className="opacity-90">
              Gesture: <b>{gesture}</b>
            </span>
            <span className="opacity-80 hidden sm:inline">•</span>
            <span className="opacity-90">
              Speaking: <b>{speaking ? "yes" : "no"}</b>
            </span>
            <span className="opacity-80 hidden sm:inline">•</span>
            <span className="opacity-90">
              Confidence: <b>{displayPercent}%</b>
            </span>
          </div>

          {speaking && (
            <span
              className="text-xs font-medium px-2 py-1 rounded-md"
              style={{
                backgroundColor: textColor === "#000000" ? "#00000022" : "#ffffff22",
                border: `1px solid ${textColor === "#000000" ? "#00000033" : "#ffffff33"}`,
              }}
            >
              speaking
            </span>
          )}
        </div>
      </div>

      <div className="text-xs text-muted-foreground flex flex-wrap gap-1">
        <span>{useAI ? "Using OpenAI with conversation context for emotion analysis and gesture control" : "Using heuristic analysis"}</span>
        <span>•</span>
        <span>Speech synthesis {typeof window !== "undefined" && "speechSynthesis" in window ? "enabled" : "not supported"}</span>
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
  gesture: Gesture;
}) {
  const [blink, setBlink] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = () => setReducedMotion(mq.matches);
    try {
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    } catch {
      // Safari fallback
      mq.addListener(handler);
      return () => mq.removeListener(handler);
    }
  }, []);

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
    gesture === "nod"
      ? 6
      : gesture === "tiltBack"
      ? -4
      : gesture === "tiltSide"
      ? -6
      : gesture === "shake"
      ? -4
      : 0;
  const headDy = gesture === "nod" ? 2 : gesture === "leanIn" ? 4 : 0;
  const headScale = gesture === "leanIn" ? 1.02 : 1;

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

  // Visual palette per emotion
  const pal = getEmotionPalette(emotion);

  // Cheek intensity by emotion
  const blushOpacity =
    emotion === "happy" ? 0.35 : emotion === "excited" ? 0.45 : emotion === "angry" ? 0.4 : 0.15;

  // Speaking pulse for background ring
  const ringScale = speaking ? 1.06 : 1;
  const ringOpacity = speaking ? 0.18 : 0.12;

  const gestureClass = reducedMotion ? "gesture-none" : `gesture-${gesture}`;
  const svgStyle = { ["--avatar-accent" as any]: pal.accent } as React.CSSProperties;
  return (
    <svg viewBox="0 0 200 200" className={`w-full h-auto ${gestureClass} emotion-${emotion}`} style={svgStyle}>
      <defs>
        <radialGradient id="skinShading" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor={pal.skinLight} style={{ transition: "stop-color 240ms ease" }} />
          <stop offset="70%" stopColor={pal.skinBase} style={{ transition: "stop-color 240ms ease" }} />
          <stop offset="100%" stopColor={pal.skinShadow} style={{ transition: "stop-color 240ms ease" }} />
        </radialGradient>

        <radialGradient id="bgRingGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--avatar-accent)" stopOpacity="0.35" style={{ transition: "stop-color 220ms ease" }} />
          <stop offset="100%" stopColor="var(--avatar-accent)" stopOpacity="0" style={{ transition: "stop-color 220ms ease" }} />
        </radialGradient>

        <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.15" />
        </filter>

        <filter id="innerMouth" x="-50%" y="-50%" width="200%" height="200%">
          <feOffset dx="0" dy="-0.5" />
          <feGaussianBlur stdDeviation="0.8" result="blur" />
          <feComposite operator="arithmetic" k2="-1" k3="1" in="SourceGraphic" in2="blur" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.9 0" />
        </filter>

        <filter id="grain" x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="noise" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0 0.04 0" />
          </feComponentTransfer>
          <feBlend in="SourceGraphic" in2="noise" mode="overlay" />
        </filter>
      </defs>

      {/* Emotion background ring */}
      <g transform={`translate(100,100) scale(${ringScale})`} style={{ transition: "transform 220ms ease" }}>
        <circle r="78" fill="url(#bgRingGrad)" opacity={ringOpacity} style={{ transition: "opacity 220ms ease" }} />
        <circle r="72" fill="none" stroke="var(--avatar-accent)" strokeOpacity="0.25" strokeWidth="2" style={{ transition: "stroke 220ms ease, opacity 220ms ease" }} />
      </g>

      {/* Head wrapper: outer centers at (100,100), middle animates via CSS, inner applies base pose */}
      <g transform={`translate(100,100)`}>
        <g className="avatar-head-anim">
          <g
            transform={`rotate(${headRotate}) translate(0,${headDy}) scale(${headScale})`}
            style={{ transition: "transform 250ms ease" }}
            filter="url(#softShadow)"
          >
        {/* Hair tuft */}
        <path
          d="M-28,-62 C-20,-78 10,-78 18,-62 C8,-66 -6,-62 -20,-58"
          fill={pal.hair}
          stroke={pal.hairStroke}
          strokeWidth="2"
          strokeLinecap="round"
          style={{ transition: "fill 240ms ease, stroke 240ms ease" }}
        />

        {/* Ears */}
        <g fill="url(#skinShading)" stroke={pal.stroke} strokeWidth="1.2" opacity="0.95" style={{ transition: "stroke 240ms ease" }}>
          <ellipse cx="-62" cy="-2" rx="8" ry="12" />
          <ellipse cx="62" cy="-2" rx="8" ry="12" />
        </g>

        {/* Head */}
        <circle cx="0" cy="0" r="60" fill="url(#skinShading)" stroke={pal.stroke} strokeWidth="1.2" filter="url(#grain)" style={{ transition: "stroke 240ms ease" }} />

        {/* Face highlight */}
        <ellipse cx="-18" cy="-28" rx="24" ry="12" fill="#fff" opacity="0.14" />

        {/* Brows */}
        {(() => {
          const isAnnoyed = emotion === "annoyed";
          const leftBrow = isAnnoyed ? "M-35,-24 Q-20,-16 -5,-10" : "M-35,-20 Q-20,-28 -5,-22";
          const rightBrow = isAnnoyed ? "M5,-10 Q20,-16 35,-24" : "M5,-22 Q20,-28 35,-20";
          return (
            <g
              stroke={pal.brow}
              strokeWidth="3.2"
              strokeLinecap="round"
              transform={`rotate(${isAnnoyed ? 0 : browTilt})`}
              style={{ transition: "transform 200ms ease, stroke 240ms ease" }}
            >
              <path d={leftBrow} />
              <path d={rightBrow} />
            </g>
          );
        })()}

          {/* Eyes */}
          <g className="eyes-group">
          {(() => {
            const widen = gesture === "eyesWide" ? 1.25 : 1;
            const rx = 12 * widen;
            const ry = eyeOpen * widen;
            return (
              <>
                <ellipse cx="-20" cy="-5" rx={rx} ry={ry} fill={pal.eyeWhite} stroke="#d0d0d0" />
                <ellipse cx="20" cy="-5" rx={rx} ry={ry} fill={pal.eyeWhite} stroke="#d0d0d0" />
                <circle className="avatar-pupil" cx={-20 + pupilDx} cy={-5 + pupilDy} r={ry > 0.6 ? 4 : 0.8} fill="#111" />
                <circle className="avatar-pupil" cx={20 + pupilDx} cy={-5 + pupilDy} r={ry > 0.6 ? 4 : 0.8} fill="#111" />
                <circle cx={-22 + pupilDx} cy={-7 + pupilDy} r="1.2" fill="#fff" opacity="0.9" />
                <circle cx={18 + pupilDx} cy={-7 + pupilDy} r="1.2" fill="#fff" opacity="0.9" />
              </>
            );
          })()}
        </g>

        {/* Nose */}
        <path d="M0,-2 q-2,8 -4,10 q4,1 8,0" fill="none" stroke={pal.stroke} strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />

        {/* Cheeks */}
        <g opacity={emotion === "happy" || emotion === "excited" || emotion === "angry" ? blushOpacity : 0.08}>
          <circle cx="-34" cy="8" r="8" fill={pal.blush} style={{ transition: "fill 240ms ease, opacity 240ms ease" }} />
          <circle cx="34" cy="8" r="8" fill={pal.blush} style={{ transition: "fill 240ms ease, opacity 240ms ease" }} />
        </g>

        {/* Mouth (curved path + inner) */}
        <g transform="translate(0,18)">
          <path
            d={mouthPath(-24, 0, 24, 0, smile, Math.max(2, mouthOpen))}
            fill={mouthOpen >= 6 ? pal.innerMouth : "none"}
            stroke={pal.stroke}
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#innerMouth)"
          />
          {/* Tongue when open */}
          {mouthOpen >= 6 && (
            <path d="M-10,4 Q0,9 10,4" fill="none" stroke={pal.tongue} strokeWidth="3" strokeLinecap="round" />
          )}
        </g>

        {/* Chin shadow */}
        <path d="M-18,42 Q0,48 18,42" stroke="#000" strokeOpacity="0.08" strokeWidth="4" />

        {/* Shirt */}
        <path d="M-30,60 Q0,40 30,60" fill={pal.shirt} stroke={pal.shirtStroke} style={{ transition: "fill 240ms ease, stroke 240ms ease" }} />
          </g>
        </g>
      </g>

      <text x="100" y="185" textAnchor="middle" fill="#6b7280" fontSize="10">
        Emotion: {emotion} {speaking ? "(speaking)" : ""}
      </text>
    </svg>
  );
}

// Helper: curved mouth path with open height and smile curvature
function mouthPath(x1: number, y1: number, x2: number, y2: number, curvature: number, open: number) {
  // width from x1..x2, center between, curvature positive = frown
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2 - curvature;
  const o = Math.max(0, open);
  // Outer stroke path (closed shape when open > 0)
  return `M ${x1} ${y1}
          Q ${cx} ${cy} ${x2} ${y2}
          Q ${cx} ${cy + o} ${x1} ${y1}`;
}

// Emotion color palette
function getEmotionPalette(emotion: Emotion) {
  const base = {
    stroke: "#2d2d2d",
    brow: "#2b2b2b",
    eyeWhite: "#ffffff",
    hair: "#2f2f2f",
    hairStroke: "#262626",
    innerMouth: "#c24646",
    tongue: "#e07b7b",
    shirtStroke: "#5a77c6",
  };
  switch (emotion) {
    case "excited":
      return {
        ...base,
        accent: "#ff7a59",
        skinBase: "#f2dfd0",
        skinLight: "#fff5ec",
        skinShadow: "#e3cab6",
        blush: "#ff9aa2",
        shirt: "#7c9ae7",
      } as const;
    case "happy":
      return {
        ...base,
        accent: "#5ec27f",
        skinBase: "#f3e3d5",
        skinLight: "#fff7ef",
        skinShadow: "#e2cfbf",
        blush: "#ffadb3",
        shirt: "#79d2a6",
      } as const;
    case "puzzled":
      return {
        ...base,
        accent: "#7c9ae7",
        skinBase: "#f1e2d6",
        skinLight: "#fff6ee",
        skinShadow: "#ddcbbd",
        blush: "#ffb9c1",
        shirt: "#7c9ae7",
      } as const;
    case "annoyed":
      return {
        ...base,
        accent: "#f0a35e",
        skinBase: "#edd9c9",
        skinLight: "#fff3e9",
        skinShadow: "#d9c2af",
        blush: "#f5a1a6",
        shirt: "#c7a56a",
      } as const;
    case "sad":
      return {
        ...base,
        accent: "#6aa3ff",
        skinBase: "#ecd8c8",
        skinLight: "#fff1e6",
        skinShadow: "#d7c2b2",
        blush: "#d6aab0",
        shirt: "#6aa3ff",
      } as const;
    case "surprised":
      return {
        ...base,
        accent: "#f5c84c",
        skinBase: "#f2dfcf",
        skinLight: "#fff5ea",
        skinShadow: "#e1c9b6",
        blush: "#ffb4bc",
        shirt: "#f0d275",
      } as const;
    case "angry":
      return {
        ...base,
        accent: "#ff5a5a",
        skinBase: "#edd3c3",
        skinLight: "#ffece3",
        skinShadow: "#d8bcae",
        blush: "#ff8d94",
        shirt: "#c96a6a",
      } as const;
    case "bored":
      return {
        ...base,
        accent: "#9aa0a6",
        skinBase: "#ead6c7",
        skinLight: "#ffefe4",
        skinShadow: "#d4bfb0",
        blush: "#e7b6bb",
        shirt: "#a2a7ad",
      } as const;
    case "calm":
      return {
        ...base,
        accent: "#69c7c1",
        skinBase: "#f1dfcf",
        skinLight: "#fff4e9",
        skinShadow: "#decab8",
        blush: "#ffb3ba",
        shirt: "#78d0c9",
      } as const;
    case "fearful":
      return {
        ...base,
        accent: "#ae7df1",
        skinBase: "#eed8c8",
        skinLight: "#ffeede",
        skinShadow: "#d8c0af",
        blush: "#e9aab2",
        shirt: "#9e8ad8",
      } as const;
    default: // neutral
      return {
        ...base,
        accent: "#8aa8ff",
        skinBase: "#f3e7dc",
        skinLight: "#fff6ee",
        skinShadow: "#e2d1c4",
        blush: "#ffc0c6",
        shirt: "#7c9ae7",
      } as const;
  }
}

function arcPath(x1: number, y1: number, x2: number, y2: number, curvature: number) {
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2 - curvature;
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}

// Choose black or white text based on background accent color for readability
function getContrastingTextColor(hex: string): "#000000" | "#ffffff" {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  // YIQ contrast
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 150 ? "#000000" : "#ffffff";
}

function emotionEmoji(e: Emotion): string {
  switch (e) {
    case "happy":
      return "😊";
    case "excited":
      return "🤩";
    case "puzzled":
      return "🤔";
    case "annoyed":
      return "😒";
    case "sad":
      return "😢";
    case "surprised":
      return "😮";
    case "angry":
      return "😠";
    case "bored":
      return "😑";
    case "calm":
      return "😌";
    case "fearful":
      return "😨";
    default:
      return "😐";
  }
}
