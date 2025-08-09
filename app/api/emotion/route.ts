import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  console.log("🚀 Emotion API called at:", new Date().toISOString());

  try {
    const { message } = await request.json();
    console.log("📥 Received message:", message);
    console.log("🔑 API Key present:", !!process.env.OPENAI_API_KEY);
    console.log("🔑 API Key length:", process.env.OPENAI_API_KEY?.length || 0);

    console.log("🤖 Calling OpenAI API...");
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an emotion analyzer. Return a JSON object with:
          - emotion: one of ["neutral", "happy", "puzzled", "excited", "annoyed", "sad", "surprised", "angry", "bored", "calm", "fearful"]
          - response: a brief empathetic response (max 50 chars)
          - confidence: number 0-1

          Example: {"emotion": "excited", "response": "That's amazing!", "confidence": 0.9}`
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 100,
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
