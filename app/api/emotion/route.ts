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

    // Add system prompt
    contextMessages.push({
      role: "system" as const,
      content: `You are an emotion analyzer for an avatar that reacts to conversation. Analyze the current message in context of the conversation history and return a JSON object with:
      - emotion: one of ["neutral", "happy", "puzzled", "excited", "annoyed", "sad", "surprised", "angry", "bored", "calm", "fearful"]
      - response: a brief empathetic response (max 200 chars)
      - confidence: number 0-1
      - gesture: one of ["none", "nod", "eyeroll", "shake", "tiltBack"]

      Gesture guidelines:
      - "nod": for agreement, happiness, excitement, understanding
      - "eyeroll": for annoyance, mild frustration, "really?"
      - "shake": for disagreement, anger, disapproval, "no way"
      - "tiltBack": for surprise, confusion, being taken aback
      - "none": for neutral, calm, or subtle emotions

      Consider the conversation flow - emotions and gestures should feel natural in context.
      Example: {"emotion": "excited", "response": "That's amazing!", "confidence": 0.9, "gesture": "nod"}`
    });

    // Add recent conversation history (last 4 messages max to keep context relevant)
    const recentHistory = conversationHistory.slice(-4);
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
      max_tokens: 150,
      temperature: 0.3,
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
