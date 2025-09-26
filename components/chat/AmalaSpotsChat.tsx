"use client";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { AmalaSpotNew } from "@/types/type";

export default function AmalaSpotsChat({
  spots,
}: {
  spots: AmalaSpotNew[];
}) {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat/spots",
      body: {
        spots, 
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

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-xl flex flex-col">
      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="h-80 overflow-y-auto border-b pb-3 mb-3 space-y-2"
      >
        {/* Static welcome message */}
        {messages.length === 0 && (
          <div className="flex justify-start">
            <div className="px-3 py-2 rounded-lg max-w-[75%] bg-gray-100 text-gray-800 rounded-bl-none">
              👋 Hi! I’m your AmalaJẹun guide.  
              You can ask me things like:  
              • "Where’s the closest Amala spot?"  
              • "Which spots open before 10am?"  
              • "Show me spots with dine-in."
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
                if (part.type === "text") {
                  return <span key={partIndex}>{part.text}</span>;
                }
                return null;
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
          placeholder="Ask me about Amala spots..."
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
