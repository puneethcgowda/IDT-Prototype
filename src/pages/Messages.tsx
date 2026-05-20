import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { Send, MessageCircle, Search } from "lucide-react";

export default function Messages() {
  const { user } = useAuth();
  const { messages, users, sendMessage, markThreadRead, getUserById } = useData();
  const [params, setParams] = useSearchParams();
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const targetId = params.get("to");

  // Build threads grouped by other user
  const threads = useMemo(() => {
    if (!user) return [];
    const map = new Map<string, { otherId: string; lastAt: string; lastText: string; unread: number }>();
    messages.forEach((m) => {
      if (m.fromUserId !== user.id && m.toUserId !== user.id) return;
      const otherId = m.fromUserId === user.id ? m.toUserId : m.fromUserId;
      const cur = map.get(otherId);
      if (!cur || +new Date(m.createdAt) > +new Date(cur.lastAt)) {
        map.set(otherId, {
          otherId,
          lastAt: m.createdAt,
          lastText: m.text,
          unread: 0,
        });
      }
    });
    // count unread
    map.forEach((v, k) => {
      v.unread = messages.filter(
        (m) => m.fromUserId === k && m.toUserId === user.id && !m.read
      ).length;
    });
    return Array.from(map.values()).sort((a, b) => +new Date(b.lastAt) - +new Date(a.lastAt));
  }, [messages, user]);

  // If a target user was passed but no thread exists yet, ensure they appear
  useEffect(() => {
    if (targetId && user) {
      // Mark messages from this user as read when opening
      markThreadRead(targetId, user.id);
    }
  }, [targetId, user, markThreadRead]);

  // auto-scroll on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, targetId]);

  if (!user) return null;

  const conversation = useMemo(() => {
    if (!targetId) return [];
    return messages
      .filter(
        (m) =>
          (m.fromUserId === user.id && m.toUserId === targetId) ||
          (m.fromUserId === targetId && m.toUserId === user.id)
      )
      .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
  }, [messages, user.id, targetId]);

  const other = targetId ? getUserById(targetId) : undefined;

  // For starting a new conversation: list of all other users
  const contactPool = users
    .filter((u) => u.id !== user.id)
    .filter((u) =>
      search.trim()
        ? u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.location.toLowerCase().includes(search.toLowerCase())
        : true
    );

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetId || !text.trim()) return;
    sendMessage(user.id, targetId, text.trim());
    setText("");
  };

  return (
    <div id="page-messages" className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <MessageCircle className="w-6 h-6 text-brand-600" />
        Messages
      </h1>

      <div className="card overflow-hidden grid md:grid-cols-[300px_1fr] min-h-[60vh]">
        {/* Sidebar */}
        <aside className="border-r border-gray-200 flex flex-col">
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                className="input pl-9"
                placeholder="Find a person or thread"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {threads.length > 0 && (
              <>
                <div className="px-3 pt-3 text-[11px] font-semibold uppercase text-gray-500">Conversations</div>
                <ul>
                  {threads
                    .filter((t) => {
                      if (!search.trim()) return true;
                      const u = getUserById(t.otherId);
                      return u?.name.toLowerCase().includes(search.toLowerCase());
                    })
                    .map((t) => {
                      const u = getUserById(t.otherId);
                      if (!u) return null;
                      const active = targetId === t.otherId;
                      return (
                        <li key={t.otherId}>
                          <button
                            onClick={() => setParams({ to: t.otherId })}
                            className={`w-full text-left px-3 py-2.5 flex items-center gap-3 hover:bg-gray-50 ${
                              active ? "bg-brand-50" : ""
                            }`}
                          >
                            <span
                              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                              style={{ background: u.avatarColor }}
                            >
                              {u.name.charAt(0)}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-medium truncate">{u.name}</span>
                                <span className="text-[10px] text-gray-500 flex-shrink-0">
                                  {new Date(t.lastAt).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 truncate">{t.lastText}</div>
                            </div>
                            {t.unread > 0 && (
                              <span className="badge bg-red-500 text-white text-[10px]">{t.unread}</span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                </ul>
              </>
            )}

            <div className="px-3 pt-4 text-[11px] font-semibold uppercase text-gray-500">Start new chat</div>
            <ul>
              {contactPool.map((u) => (
                <li key={u.id}>
                  <button
                    onClick={() => setParams({ to: u.id })}
                    className={`w-full text-left px-3 py-2.5 flex items-center gap-3 hover:bg-gray-50 ${
                      targetId === u.id ? "bg-brand-50" : ""
                    }`}
                  >
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs"
                      style={{ background: u.avatarColor }}
                    >
                      {u.name.charAt(0)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{u.name}</div>
                      <div className="text-xs text-gray-500 capitalize">
                        {u.role} · {u.location}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Conversation pane */}
        <section className="flex flex-col min-h-[60vh]">
          {!targetId || !other ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-500">
              <MessageCircle className="w-10 h-10 text-gray-300 mb-3" />
              <p className="font-medium">Pick a conversation, or start a new chat.</p>
              <p className="text-xs mt-1">All messages stay within AgriConnect.</p>
            </div>
          ) : (
            <>
              <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                <Link to={`/profile/${other.id}`} className="flex items-center gap-3 hover:opacity-80">
                  <span
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                    style={{ background: other.avatarColor }}
                  >
                    {other.name.charAt(0)}
                  </span>
                  <div>
                    <div className="font-semibold">{other.name}</div>
                    <div className="text-xs text-gray-500 capitalize">
                      {other.role} · {other.location}
                    </div>
                  </div>
                </Link>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
                {conversation.length === 0 && (
                  <p className="text-center text-xs text-gray-500 mt-10">
                    Say hi to {other.name}! 👋
                  </p>
                )}
                {conversation.map((m) => {
                  const mine = m.fromUserId === user.id;
                  return (
                    <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[70%] px-3 py-2 rounded-2xl text-sm ${
                          mine
                            ? "bg-brand-600 text-white rounded-br-sm"
                            : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
                        }`}
                      >
                        <div>{m.text}</div>
                        <div className={`text-[10px] mt-1 ${mine ? "text-brand-100" : "text-gray-400"}`}>
                          {new Date(m.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={send} className="p-3 border-t border-gray-100 flex items-center gap-2">
                <input
                  className="input"
                  placeholder={`Message ${other.name}…`}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <button type="submit" disabled={!text.trim()} className="btn-primary">
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
