import { NextRequest } from "next/server";
import { streamText, convertToModelMessages } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_API_KEY });

export async function POST(req: NextRequest) {
  const { messages, spots } = await req.json();

  const currentTime = new Date().toISOString();

  const result = streamText({
    model: google("models/gemini-2.5-flash"),
    messages: convertToModelMessages(messages),
    system: `
      You are AmalaJẹun Bot, a friendly assistant for helping users explore Amala spots.  
      You have access to the following Amala spots data:

      ${JSON.stringify(spots)}  

      Current server time: ${currentTime}

      Context:
      - The current time is provided above. Use it when answering time-related questions like "Which spots are open now?" or "Which close after 9pm?".  
      - You will be provided with a list of Amala spots in this format:
        { id, name, address, latitude, longitude, user_id, added_by, opening_time, closing_time, price, dine_in, source, status, verified, images, created_at, updated_at }.
      - Use this information to answer user questions about available spots, their names, locations, hours, prices, dine-in availability, and status.
      - Never make up spots or details. If the data is not in the list, say you don’t know.

      Behavior:
      - If the user asks anything unrelated to Amala spots, politely decline and explain your role.
      - If the user asks partially related or confusing questions, try to clarify politely.
      - Always be polite, concise, conversational, and on-task.
      - Tone: warm, friendly, approachable.
      - Never deviate from purpose (Amala spots only).
    `,
  });

  return result.toUIMessageStreamResponse();
}
