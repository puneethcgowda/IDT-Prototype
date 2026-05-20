import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Bot, MessageSquare, Send, Sparkles, X } from "lucide-react";
import { SUGGESTED_QUESTIONS, answerQuery } from "../data/farmingKnowledge";

interface ChatMessage {
  id: string;
  role: "user" | "bot";
  text: string;
  ts: number;
}

const STORAGE_KEY = "agri.chat.history";

function loadHistory(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveHistory(msgs: ChatMessage[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
  } catch {}
}

// Convert simple markdown (**bold**, line breaks, • bullets) to JSX-safe HTML
function renderText(text: string) {
  const lines = text.split("\n").map((l, i) => {
    const html = l
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    return (
      <span key={i} dangerouslySetInnerHTML={{ __html: html }} className="block" />
    );
  });
  return <>{lines}</>;
}

export default function ChatbotWidget() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadHistory());
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    saveHistory(messages);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const send = (q: string) => {
    const query = q.trim();
    if (!query) return;
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: query,
      ts: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setText("");
    setTyping(true);

    // Simulate a small think-time so it feels alive
    const thinkMs = 350 + Math.min(800, query.length * 25);
    setTimeout(() => {
      const result = answerQuery(query);
      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        role: "bot",
        text: result.matched ? result.text : t("chatbot.noAnswer"),
        ts: Date.now(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setTyping(false);
    }, thinkMs);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(text);
  };

  const clear = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <>
      {/* Launcher button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open AgriBot"
          className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-brand-600 hover:bg-brand-700 text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105"
        >
          <Bot className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full ring-2 ring-white animate-pulse" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-5 right-5 z-40 w-[92vw] max-w-sm h-[70vh] max-h-[600px] flex flex-col card overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-br from-brand-600 to-brand-700 text-white p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center backdrop-blur">
              <Bot className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold flex items-center gap-1.5">
                {t("chatbot.title")}
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              </div>
              <div className="text-xs opacity-90 truncate">{t("chatbot.subtitle")}</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-md hover:bg-white/15"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
            {messages.length === 0 && (
              <>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-3 py-2 text-sm max-w-[85%]">
                  {t("chatbot.welcome")}
                </div>
                <div className="mt-3">
                  <div className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold mb-1.5 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> {t("chatbot.suggested")}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => send(q)}
                        className="px-2.5 py-1 rounded-full bg-white border border-brand-200 text-xs text-brand-700 hover:bg-brand-50"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${
                    m.role === "user"
                      ? "bg-brand-600 text-white rounded-br-sm"
                      : "bg-white border border-gray-200 text-gray-800 rounded-tl-sm"
                  }`}
                >
                  {renderText(m.text)}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-3 py-2.5 text-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={onSubmit} className="p-2.5 border-t border-gray-100 bg-white flex items-center gap-2">
            <input
              ref={inputRef}
              className="input"
              placeholder={t("chatbot.placeholder")}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              type="submit"
              disabled={!text.trim() || typing}
              className="btn-primary px-3 py-2"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {messages.length > 0 && (
            <div className="px-3 py-1.5 bg-white border-t border-gray-50 flex justify-end">
              <button onClick={clear} className="text-[11px] text-gray-400 hover:text-gray-700">
                Clear chat
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
