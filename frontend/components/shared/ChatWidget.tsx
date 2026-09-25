"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2, Bot, User, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useAppStore } from "@/stores/appStore";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "What are my skill gaps?",
  "Recommend a course for me",
  "How does this platform work?",
  "What are my strengths?",
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm the SkillIntel Assistant. I can help you understand your skill gaps, recommended courses, or how to use this platform. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const analysis = useAppStore((s) => s.analysis);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const history = messages.slice(1); // skip greeting
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const result = await api.chatWithBot(trimmed, history, analysis || undefined);
      const reply = result.error
        ? `⚠️ ${result.error}`
        : result.reply || "I couldn't generate a response. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Could not reach the assistant. Is the backend running?" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Chat reset! What would you like to know?",
      },
    ]);
  };

  const showSuggestions = messages.length === 1;

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-purple-600 shadow-2xl flex items-center justify-center text-white hover:shadow-primary/50 transition-shadow"
        aria-label="Open chat"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[400px] max-w-[calc(100vw-2rem)] h-[560px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-primary/30"
            style={{ background: "rgba(15, 23, 42, 0.98)", backdropFilter: "blur(20px)" }}
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-primary to-purple-600 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">SkillIntel Assistant</p>
                <p className="text-white/70 text-xs">
                  {analysis ? `Analyzing: ${analysis.employee.name}` : "Powered by Mistral"}
                </p>
              </div>
              <button
                onClick={resetChat}
                className="w-7 h-7 rounded-full hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                title="Reset chat"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
                      m.role === "user"
                        ? "bg-gradient-to-br from-primary to-purple-600 text-white rounded-br-sm"
                        : "bg-slate-800 text-slate-100 rounded-bl-sm"
                    }`}
                  >
                    {m.content}
                  </div>
                  {m.role === "user" && (
                    <div className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5 text-purple-300" />
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-sm">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                          className="w-2 h-2 rounded-full bg-primary"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions — only show at start */}
            {showSuggestions && (
              <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-xs px-2.5 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-border/50">
              <div className="flex gap-2 items-end">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask me anything..."
                  rows={1}
                  className="flex-1 resize-none bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary max-h-24"
                />
                <Button
                  size="icon"
                  onClick={() => sendMessage(input)}
                  disabled={loading || !input.trim()}
                  className="flex-shrink-0"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
                AI responses may be inaccurate. Verify important info.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}