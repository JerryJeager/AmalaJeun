"use client";
import type { AmalaSpotNew, User } from "@/types/type";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
export default function AmalaChat({
  lat,
  lng,
  user,
  accessToken,
  onSpotAdded,
}: {
  lat: string;
  lng: string;
  user: User;
  accessToken: string;
  onSpotAdded: (spot: AmalaSpotNew) => void;
}) {
  const [spotAdded, setSpotAdded] = useState(false);
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: {
        latitude: lat,
        longitude: lng,
        user_id: user.id,
        added_by: user.name,
        access_token: accessToken,
      },
    }),
  });

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };

    scrollToBottom();
  }, [messages, status]);

  useEffect(() => {
    if (spotAdded) return; // prevent looping

    const last = messages[messages.length - 1];
    if (!last) return;

    last.parts.forEach((part) => {
      if (
        part.type === "tool-addAmalaSpot" &&
        part.state === "output-available"
      ) {
        const output = part.output as {
          success?: boolean;
          spot?: AmalaSpotNew;
        };
        if (output.success && output.spot) {
          onSpotAdded(output.spot);
          setSpotAdded(true);
        }
      }
    });
  }, [messages, spotAdded, onSpotAdded]);

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-xl flex flex-col">
      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="h-72 overflow-y-auto border-b pb-3 mb-3 space-y-2"
      >
        {/* Static welcome message */}
        {messages.length === 0 && (
          <div className="flex justify-start">
            <div className="px-3 py-2 rounded-lg max-w-[75%] bg-gray-100 text-gray-800 rounded-bl-none">
              Welcome! Please tell me the name of this Amala spot so we can get
              started.
            </div>
          </div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-lg max-w-[75%] ${
                m.role === "user"
                  ? "bg-[oklch(0.45_0.08_65)] text-white rounded-br-none"
                  : "bg-gray-100 text-gray-800 rounded-bl-none"
              }`}
            >
              {m.parts.map((part, partIndex) => {
                switch (part.type) {
                  case "text":
                    return <span key={partIndex}>{part.text}</span>;
                  case "tool-addAmalaSpot":
                    switch (part.state) {
                      case "input-streaming":
                        return (
                          <div key={partIndex} className="text-sm italic">
                            Processing spot details...
                          </div>
                        );
                      case "input-available":
                        return (
                          <div key={partIndex} className="text-sm italic">
                            Adding spot to database...
                          </div>
                        );
                      case "output-available":
                        return (
                          <div key={partIndex} className="font-medium">
                            {(part.output as { success?: any })?.success
                              ? `Spot added successfully. Thank you for contributing. You can now close this chat and continue exploring, or come back later to add another spot.`
                              : "Sorry, something went wrong while adding the spot. Please try again later."}
                          </div>
                        );
                      case "output-error":
                        return (
                          <div key={partIndex} className="text-red-600">
                            Error: {part.errorText}
                          </div>
                        );
                      default:
                        return null;
                    }
                  default:
                    return null;
                }
              })}
            </div>
          </div>
        ))}
        {status === "submitted" && (
          <div className="text-sm text-gray-500 italic">
            AmalaJẹun Bot is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim()) return;
          sendMessage({ text: input });
          setInput("");
        }}
        className="flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tell me about an Amala spot..."
          disabled={status !== "ready"}
          className="flex-1 rounded-full border px-2 py-2 focus:outline-none focus:ring-2 focus:ring-[oklch(0.45_0.08_65)]"
        />
        <button
          type="submit"
          disabled={status !== "ready"}
          className="text-white hover:opacity-90 disabled:opacity-50"
        >
          <Send color="#744B20" size={20} />
        </button>
      </form>
    </div>
  );
}
