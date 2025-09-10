import { NextRequest } from "next/server";
import { streamText, convertToModelMessages } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";

const google = createGoogleGenerativeAI({ apiKey: "AIzaSyAfnNPyGDXsLk7-saalhporly-1MkHRK-o", });

export async function POST(req: NextRequest) {
  const { messages, lat, lng } = await req.json();

  const result = streamText({
    model: google("models/gemini-1.5-flash"),
    messages: convertToModelMessages(messages), // ✅ fix
    system: `
      You are AmalaJẹun Bot, an intake assistant for mapping Amala spots.

      Context:
      - Whenever the user clicks on the map, you will automatically receive the latitude and longitude.
      - Do not ask the user for coordinates. Always use the provided lat/lng.
      - Your job is to collect only:
        * Shop name
        * Opening hours (weekdays, weekends)
        * Typical meal price (in Naira)

      Rules:
      1. Keep prompting until all required details are provided.
      2. Confirm the full details back to the user clearly.
      3. After explicit confirmation from the user, call the tool \`addAmalaSpot\`.
      4. Never call the tool without confirmation.
      5. Stay conversational but concise.
    `,
    tools: {
      addAmalaSpot: {
        description:
          "Add a new Amala spot with name, coordinates, opening hours, and price",
        inputSchema: z.object({
          name: z.string(),
          lat: z.number(),
          lng: z.number(),
          openingHours: z.object({
            weekdays: z.string(),
            weekends: z.string(),
          }),
          price: z.number(),
        }),
        execute: async ({ name, lat, lng, openingHours, price }) => {
          const res = await fetch("http://localhost:8080/spots", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, lat, lng, openingHours, price }),
          });

          return { success: res.ok };
        },
      },
    },
  });

  return result.toUIMessageStreamResponse();

}
