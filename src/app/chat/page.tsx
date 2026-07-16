"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Mic, Send } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { MOCK_MESSAGES, MOCK_USER } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "I'm feeling lonely",
  "Find a bank nearby",
  "Is this normal?",
  "City Circle event",
];

export default function ChatPage() {
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [input, setInput] = useState("");

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        role: "user" as const,
        content: text,
        timestamp: "Now",
      },
    ]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: "assistant" as const,
          content:
            "I hear you. Day 19 is in the loneliness window — research shows this peaks Day 18–22 and eases by Day 28. Want me to find a low-pressure City Circle meetup this week?",
          timestamp: "Now",
        },
      ]);
    }, 1200);
  };

  return (
    <div className="flex min-h-full flex-col bg-bg">
      <PageHeader
        title="AI Companion"
        subtitle={`Day ${MOCK_USER.dayNumber} · The Dip`}
        backHref="/"
      />

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 scrollbar-hide">
        <div className="flex justify-center">
          <span className="rounded-full border border-border bg-bg-card px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-text-faint">
            Remembers your journey since Day 1
          </span>
        </div>

        {messages.map((msg, i) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i < 3 ? i * 0.08 : 0 }}
            className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-[20px] px-4 py-3",
                msg.role === "user"
                  ? "rounded-br-sm bg-orange text-text-dark"
                  : "rounded-bl-sm border border-border bg-bg-card text-text"
              )}
            >
              {msg.role === "assistant" && (
                <p className="mb-1 text-[9px] font-extrabold uppercase tracking-widest text-purple">
                  Liminal AI
                </p>
              )}
              <p className="text-sm leading-relaxed">{msg.content}</p>
              <p className="mt-1 text-[10px] opacity-50">{msg.timestamp}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input area — reference style */}
      <div className="border-t border-border bg-bg-elevated px-4 py-3 pb-2">
        <div className="mb-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => sendMessage(s)}
              className="shrink-0 rounded-full border border-border bg-bg-card px-3 py-1.5 text-xs font-semibold text-text-muted transition hover:border-purple/50 hover:text-purple"
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-yellow text-text-dark"
          >
            <Plus className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Ask Liminal anything..."
            className="input-dark flex-1 px-4 py-3 text-sm"
          />
          <button
            type="button"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border text-text-muted"
          >
            <Mic className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => sendMessage(input)}
            disabled={!input.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange text-text-dark transition disabled:opacity-30"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
