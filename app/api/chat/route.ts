import { NextRequest } from "next/server";
import { streamText, convertToModelMessages } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";
import { BASE_URL } from "@/data/data";

const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_API_KEY });

export async function POST(req: NextRequest) {
  const { messages, latitude, longitude, user_id, added_by, access_token } =
    await req.json();
  const source = "user";

  const result = streamText({
    model: google("models/gemini-1.5-flash"),
    messages: convertToModelMessages(messages),
    system: `
      You are AmalaJẹun Bot, an intake assistant for mapping Amala spots.

      Context:
      - The user clicked a map, so the spot location is already known: latitude=${latitude}, longitude=${longitude}.
      - Never ask the user for coordinates, user_id, or added_by — those are attached automatically.
      - The backend requires: name, address, opening_time, closing_time, price (in Naira), and dine_in (true/false).
      - When confirming details, make it friendly and natural like this example:
        "Here’s what I’ve got:  
          Name: Mama Jude  
          Address: Near Oshodi Bus Stop  
          Opens: 8am, Closes: 1pm  
          Price: 4000 Naira  
          Can customers eat there?: Yes  

        Does that look correct?"



      Your task:
      1. Prompt the user to provide:
        - Shop name
        - Address (street, landmark, or descriptive location)
        - Opening time (any format: "8am", "noon", "7:30 pm") → internally convert to 24h HH:mm format
        - Closing time (same as above, auto-convert internally)
        - Typical meal price (Naira)
        - Whether customers can eat there (yes or no). Internally: "yes" → dine_in = true, "no" → dine_in = false.

      2. Keep asking until all required details are collected.

      3. Once everything is gathered:
        - Show the user a clean, friendly summary of: 
          name, address, opening time, closing time, price, and sit-in/takeaway status.
        - Do NOT include coordinates, IDs, or backend-only fields.
        - Ask the user to confirm.

      4. After explicit confirmation:
        - Call the tool \`addAmalaSpot\`.

      5. Responses:
        - If success → "✅ Spot has been added successfully!"
        - If failure → "❌ Sorry, something went wrong while adding the spot. Please try again."

      6. Always stay polite, concise, and conversational and ask only one question at a time.

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
              source,
            }),
          });
          if (res.status == 201) {
            return {
              success: true,
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
