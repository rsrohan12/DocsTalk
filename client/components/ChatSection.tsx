"use client"

import { useClerkToken } from "@/hooks/useClerkToken";
import { API_BASE_URL } from "@/lib/config";
import { IMessage } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import { ChatSkeleton } from "./ui/chatSkeleton";
import { UserButton } from "@clerk/nextjs";
import { Loader2, Send, Sparkles } from "lucide-react";
import { SourceDocument } from "./SourceDocument";

export const ChatSection = ({ pdfId, initializing }: { pdfId?: string; initializing?: boolean }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const { getAuthToken } = useClerkToken();

  useEffect(() => {
    if (!pdfId || initializing) {
      setMessages([]);
      return;
    }

    const loadHistory = async () => {
        const token = await getAuthToken();
      try {
        const res = await fetch(`${API_BASE_URL}/chat/history?pdfId=${pdfId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setMessages(data.messages || []);
      } catch (err) {
        console.error("Failed to load chat history", err);
      }
    };

    loadHistory();
  }, [pdfId, initializing]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !pdfId) return;

    const userMsg = input;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const token = await getAuthToken();
      const res = await fetch(
        `${API_BASE_URL}/chat?pdfId=${pdfId}&message=${encodeURIComponent(
          userMsg
        )}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.message, documents: data.docs },
      ]);
    } catch (err) {
      console.log("Error", err);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return <ChatSkeleton />;
  }

  return (
    <div className="h-full flex flex-col bg-linear-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="border-b-2 bg-white shadow-sm px-6 py-4">
        <h2 className="text-xl font-bold text-gray-800">DocsTalks</h2>
        <p className="text-sm text-gray-500 mt-1">
          Ask questions about your document
        </p>

        <div className="fixed top-7 right-6 z-40">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-8 h-8",
              },
            }}
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-blue-100 to-indigo-100 rounded-full mb-4">
                <Sparkles className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Ready to help!
              </h3>
              <p className="text-gray-500 text-sm">
                I&apos;ll analyze your PDF and answer any questions you have
                about its content.
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`mb-6 flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-3xl ${
                    m.role === "user" ? "w-auto" : "w-full"
                  }`}
                >
                  <div
                    className={`rounded-2xl px-5 py-3 shadow-sm ${
                      m.role === "user"
                        ? "bg-linear-to-r from-blue-600 to-blue-700 text-white"
                        : "bg-white border-2 border-gray-200 text-gray-800"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {m.content}
                    </p>
                  </div>

                  {m.documents && m.documents.length > 0 && (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="h-px flex-1 bg-linear-to-r from-transparent via-gray-300 to-transparent" />
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">
                          Sources ({m.documents.length})
                        </p>
                        <div className="h-px flex-1 bg-linear-to-r from-transparent via-gray-300 to-transparent" />
                      </div>
                      {m.documents.map((d, idx) => (
                        <SourceDocument key={d.id} doc={d} index={idx} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start mb-6">
                <div className="bg-white border-2 border-gray-200 rounded-2xl px-5 py-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                    <span className="text-sm text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="border-t-2 bg-white shadow-lg px-6 py-4">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            className="flex-1 border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Ask a question about your PDF..."
            disabled={loading || !pdfId}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading || !pdfId}
            className="px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
          >
            <Send className="w-5 h-5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};