import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  console.log("🚀 Emotion API called at:", new Date().toISOString());

  try {
    const { message, conversationHistory = [] } = await request.json();
    console.log("📥 Received message:", message);
    console.log("📝 Conversation history length:", conversationHistory.length);
    console.log("🔑 API Key present:", !!process.env.OPENAI_API_KEY);
    console.log("🔑 API Key length:", process.env.OPENAI_API_KEY?.length || 0);

    console.log("🤖 Calling OpenAI API...");

    // Build conversation context - include last few messages for better context
    const contextMessages = [];

    // Add system prompt (expanded gestures + refined guidance)
    contextMessages.push({
      role: "system" as const,
      content: `You are an EMOTION & GESTURE inference engine for a reactive avatar.
Return ONLY a single compact JSON object (no backticks, no prose) with keys:
  emotion: one of ["neutral","happy","puzzled","excited","annoyed","sad","surprised","angry","bored","calm","fearful"]
  response: empathetic, context-aware reply (max 180 chars, no emojis)
  confidence: number 0-1 (higher = clearer emotional signal)
  gesture: one of ["none","nod","eyeroll","shake","tiltBack","eyesWide","leanIn","tiltSide"]

Gesture semantics (choose the MOST natural & least repetitive):
  nod: affirmation, agreement, positive reinforcement, excited acknowledgment
  eyeroll: mild frustration, dismissiveness, "really?"
  shake: strong disagreement, rejection, emphatic "no"
  tiltBack: taken aback, mild surprise, brief confusion, slight shock
  eyesWide: strong surprise / awe / sudden revelation / big "whoa"
  leanIn: curiosity, interest, engagement, encouraging the user, attentive listening
  tiltSide: puzzlement, reflective thinking, seeking clarification, mild uncertainty
  none: neutral / calm / low-salience emotion

Selection guidance:
  - Prefer none if ambiguous.
  - eyesWide vs tiltBack: eyesWide for bigger / more intense surprise.
  - leanIn for calm but engaged / curious follow ups.
  - tiltSide for lighter confusion; heavier confusion may pair with puzzled emotion + tiltSide or tiltBack.
  - Avoid overusing nod; vary with leanIn / tiltSide when appropriate.

Emotion guidance:
  - excited vs surprised: excited implies positive arousal; surprised can be neutral/mixed.
  - puzzled vs annoyed: puzzled seeks understanding; annoyed shows mild negative frustration.
  - angry reserved for stronger hostility – don't escalate from annoyed too easily.

Output format example:
{"emotion":"excited","response":"That's fantastic progress—nice work!","confidence":0.88,"gesture":"nod"}

STRICT RULES:
  - Output MUST be valid JSON (single object)
  - No trailing commas, no commentary, no markdown.
  - confidence realistic (avoid 1.0 unless unequivocal).`
    });

    // Add recent conversation history (last 10 messages for richer context)
    const recentHistory = conversationHistory.slice(-10);
    recentHistory.forEach((msg: any) => {
      contextMessages.push({
        role: msg.role === "agent" ? "assistant" : "user",
        content: msg.text
      });
    });

    // Add current message
    contextMessages.push({
      role: "user" as const,
      content: message
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: contextMessages,
      max_tokens: 180,
      temperature: 0.35,
    });

    const result = completion.choices[0]?.message?.content;
    console.log("✅ OpenAI response:", result);

    if (!result) {
      throw new Error("No response from OpenAI");
    }

    const parsed = JSON.parse(result);
    console.log("📤 Sending parsed response:", parsed);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("❌ OpenAI API error:", error);
    return NextResponse.json(
      { error: "Failed to analyze emotion" },
      { status: 500 }
    );
  }
}
