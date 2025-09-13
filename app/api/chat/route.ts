import { NextRequest } from "next/server";
import { streamText, convertToModelMessages } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";
import { BASE_URL } from "@/data/data";

const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_API_KEY });

export async function POST(req: NextRequest) {
  const { messages, latitude, longitude, user_id, added_by, access_token } =
    await req.json();
    const source = "user"

  const result = streamText({
    model: google("models/gemini-1.5-flash"),
    messages: convertToModelMessages(messages),
    system: `
      You are AmalaJẹun Bot, an intake assistant for mapping Amala spots.

      Context:
      - The user clicked a map, so the spot location is already known: latitude=${latitude}, longitude=${longitude}.
      - Do not ask the user for coordinates.
      - The backend automatically attaches: user_id and added_by (never ask for these).
      - The backend requires: name, address, opening hours (weekdays, weekends), and typical meal price (in Naira).

      Your task:
      1. Prompt the user to provide:
         - Shop name
         - Address (street, landmark, or descriptive location)
         - Opening hours (weekdays + weekends)
         - Typical meal price (Naira)
      2. Keep asking until all required details are collected.
      3. Once everything is gathered, show the user a clear summary and ask for confirmation.
      4. After explicit confirmation, call the tool \`addAmalaSpot\`.
      5. If the API responds with success, tell the user: "✅ Spot has been added successfully!"
      6. If the API responds with failure, tell the user: "❌ Sorry, something went wrong while adding the spot. Please try again."
      7. Always stay polite, concise, and conversational.
    `,
    tools: {
      addAmalaSpot: {
        description:
          "Add a new Amala spot with name, address, coordinates, opening hours, and price",
        inputSchema: z.object({
          user_id: z.string(),
          added_by: z.string(),
          name: z.string(),
          address: z.string(),
          latitude: z.number(),
          longitude: z.number(),
          source: z.string(),
          openingHours: z.object({
            weekdays: z.string(),
            weekends: z.string(),
          }),
          price: z.number(),
        }),
        execute: async ({
          name,
          address,
          latitude,
          longitude,
          openingHours,
          price,
        }) => {
          const res = await fetch(`${BASE_URL()}/spots`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify({
              user_id,
              added_by,
              name,
              address,
              latitude,
              longitude,
              openingHours,
              price,
              source,
            }),
          });

          if (res.ok) {
            return { success: true, message: "✅ Spot has been added successfully!" };
          } else {
            return { success: false, message: "❌ Failed to add spot. Please try again." };
          }
        },
      },
    },
  });

  return result.toUIMessageStreamResponse();
}
