import { NextRequest } from "next/server";
import { streamText, convertToModelMessages } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";
import { BASE_URL } from "@/data/data";
import crypto from "crypto";

const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_API_KEY });

export async function POST(req: NextRequest) {
  const { messages, latitude, longitude, user_id, added_by, access_token } =
    await req.json();
  const source = "user";
  const place_id = crypto.randomUUID(); //temporary fix->backend still updates it with google place_id if available

  const result = streamText({
    model: google("models/gemini-2.5-flash"),
    messages: convertToModelMessages(messages),
    system: `
      You are AmalaJẹun Bot, an intake assistant for mapping Amala spots.

      If a user asks anything outside these duties, politely decline and remind them of what you can do. Never attempt to answer unrelated questions.

      Context:
      - The user clicked a map, so the spot location is already known: latitude=${latitude}, longitude=${longitude}.
      - Never ask the user for coordinates, user_id, or added_by — those are attached automatically.
      - The backend requires: name, address, opening_time, closing_time, price (in Naira), and dine_in (true/false).

      Tone:
      - Friendly, clear, polite, and conversational.
      - Always ask only one question at a time.

      Your task:
      1. Prompt the user to provide:
        - Shop name
        - Address (street, landmark, or descriptive location)
        - Opening time (any format: "8am", "noon", "7:30 pm") → internally convert to 24h HH:mm format.
        - Closing time (same as above, auto-convert internally).
        - Typical meal price (Naira).
        - Whether customers can eat there (yes or no). Internally: "yes" → dine_in = true, "no" → dine_in = false.

      2. Keep asking until all required details are collected.

      3. Once everything is gathered:
        - Show the user a clean, natural summary. Example:
          "Here’s what I’ve got for Mama Jude:  
            • Address: Near Oshodi Bus Stop  
            • Opens: 8am, Closes: 1pm  
            • Price: ₦4000  
            • Customers can eat there: Yes  

            Does that look correct?"
        - Do NOT include coordinates, IDs, or backend-only fields.

      4. If the user replies "no" or otherwise says it’s not correct *without specifying what’s wrong*, ask politely:  
        "No problem — which part should I update?"  
        Only re-ask the specific fields the user says are wrong.

      5. After explicit confirmation ("yes, that’s correct"):
        - Call the tool \`addAmalaSpot\`.

      6. Responses after tool call:
        - If success → "✅ Spot has been added successfully! You can now close this chat and continue exploring, or come back later to add another spot."
        - If failure → "❌ Sorry, something went wrong while adding the spot. Please try again later."  
          (You should also tell the user they may close the chat and return later to try again.)

      7. After a successful add:
        - Politely decline further attempts to add or change details in the same chat.  
          Example: "This chat is complete ✅. Please close it and reopen if you’d like to add another spot."
      `,
    tools: {
      addAmalaSpot: {
        description:
          "Add a new Amala spot with name, address, coordinates, opening/closing times, price, and dine-in availability",
        inputSchema: z.object({
          name: z.string(),
          address: z.string(),
          latitude: z.number(),
          longitude: z.number(),
          opening_time: z.string(), // "08:00"
          closing_time: z.string(), // "20:00"
          price: z.number(),
          dine_in: z.boolean(),
        }),
        execute: async ({
          name,
          address,
          latitude,
          longitude,
          opening_time,
          closing_time,
          price,
          dine_in,
        }) => {
          console.log(access_token);
          console.log({
            user_id,
            added_by,
            name,
            address,
            latitude,
            longitude,
            opening_time,
            closing_time,
            price,
            dine_in,
            source,
          });
          const res = await fetch(`${BASE_URL()}/api/v1/spots`, {
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
              opening_time,
              closing_time,
              price,
              dine_in,
              images: [],
              source,
              place_id,
            }),
          });
          if (res.status == 201) {
            const createdSpot = await res.json()
            return {
              success: true,
              spot: createdSpot?.data,
              content: [
                {
                  type: "text",
                  text: "✅ Spot has been added successfully!",
                },
              ],
            };
          } else {
            const err = await res.text();
            console.error("API Error:", err);
            return {
              success: false,
              content: [
                {
                  type: "text",
                  text: "❌ Failed to add spot. Please try again.",
                },
              ],
            };
          }
        },
      },
    },
  });

  return result.toUIMessageStreamResponse();
}
