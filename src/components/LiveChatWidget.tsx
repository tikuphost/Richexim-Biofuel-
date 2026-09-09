import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  X,
  Send,
  User,
  ShieldCheck,
  Phone,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LiveChatWidget: React.FC = () => {
  const { chatMessages, chatHistory, sendChatMessage, currentUser } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = (chatMessages && chatMessages.length > 0)
    ? chatMessages
    : (chatHistory && chatHistory.length > 0)
      ? chatHistory
      : [];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;
    const text = input;
    setInput('');
    setIsSending(true);
    await sendChatMessage(text);
    setIsSending(false);
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-[#1b4d27] hover:bg-[#2a6e3a] text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer border-2 border-[#f5b342]"
          aria-label="Open Commercial Trade Desk Chat"
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#f5b342]" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 border-2 border-[#1b4d27] animate-pulse" />
          </div>
        </button>
      ) : (
        <div className="bg-white rounded-3xl w-[calc(100vw-2rem)] sm:w-96 max-w-sm shadow-2xl border border-[#e3ede0] overflow-hidden flex flex-col h-[460px] sm:h-[480px] max-h-[85vh] animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[#1b4d27] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#f5b342] text-[#172e18] font-bold flex items-center justify-center text-xs">
                RX
              </div>
              <div>
                <h4 className="font-heading font-bold text-xs text-white">
                  Richmount Commercial Desk
                </h4>
                <div className="flex items-center gap-1.5 text-[10px] text-white/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online • Instant Inquiry Answering</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* WhatsApp Direct Banner */}
          <div className="bg-[#f0f7eb] px-4 py-2 border-b border-[#e3ede0] flex items-center justify-between text-[11px]">
            <span className="text-[#1b4d27] font-semibold flex items-center gap-1">
              <Phone className="w-3 h-3 text-[#2a6e3a]" />
              WhatsApp Direct:
            </span>
            <a
              href="https://wa.me/918921517645?text=Hello%20Richmount%20Exim,%20I%20am%20interested%20in%20an%20export%20quotation."
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#2a6e3a] hover:underline"
            >
              +91 8921517645 →
            </a>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#f9fbf7]">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 text-gray-400">
                <Sparkles className="w-8 h-8 text-[#f5b342] mb-2 opacity-80" />
                <p className="text-xs font-semibold text-gray-600">Richmount Commercial Desk</p>
                <p className="text-[11px] text-gray-400 mt-1">
                  Ask our team about technical parameters, ocean freight lead times, or proforma quotations.
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#1b4d27] text-white rounded-br-xs'
                        : 'bg-white text-gray-800 border border-[#e3ede0] shadow-2xs rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-gray-400 mt-0.5 px-1">
                    {msg.sender === 'user' ? (currentUser?.name || 'You') : 'Commercial Desk'} •{' '}
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask about MOQ, Incoterms, testing..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-[#f9fbf7] text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
            />
            <button
              type="submit"
              disabled={!input.trim() || isSending}
              className="bg-[#2a6e3a] hover:bg-[#1b4d27] disabled:opacity-50 text-white p-2.5 rounded-xl transition cursor-pointer"
            >
              <Send className="w-4 h-4 text-[#f5b342]" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
