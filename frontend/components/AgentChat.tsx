'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Send } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AgentChatProps {
  className?: string;
}

const WELCOME_MESSAGE: Message = {
  role: 'assistant',
  content:
    "Hi! I'm ProofAgent, your career guide on ProofChain. I can help you find internships, improve your profile, and track your experience validations. What would you like to explore?",
};

export default function AgentChat({ className = '' }: AgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage: Message = { role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          studentProfile: null,
          companyList: [],
        }),
      });

      const data = await res.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response ?? data.message ?? 'Sorry, I could not process that request.',
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={`flex flex-col h-full rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.08]">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#4f46e5]">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-white">ProofAgent</span>
        <span className="ml-auto text-xs text-white/40">AI Assistant</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-[#7c3aed] to-[#4f46e5] text-white rounded-br-md'
                  : 'bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl text-white/90 rounded-bl-md'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#7c3aed] animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 rounded-full bg-[#6d28d9] animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 rounded-full bg-[#4f46e5] animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-white/[0.08]">
        <div className="flex items-center gap-2 bg-white/[0.04] rounded-xl border border-white/[0.08] px-4 py-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask ProofAgent anything..."
            className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#4f46e5] text-white disabled:opacity-40 hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
