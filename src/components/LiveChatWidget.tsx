import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  X,
  Send,
  User,
  ShieldCheck,
  Phone,
  Sparkles,
  ArrowRight,
  Building2,
  Globe2,
  Mail,
  RefreshCw,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LiveChatWidget: React.FC = () => {
  const {
    customerChatSession,
    setCustomerChatSession,
    startCustomerChatSession,
    sendCustomerChatMessage,
    activeSessionMessages,
    activeAdminSessionId,
    currentUser
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSubmittingOnboarding, setIsSubmittingOnboarding] = useState(false);

  // Onboarding Form States
  const [nameInput, setNameInput] = useState(currentUser?.name || '');
  const [emailInput, setEmailInput] = useState(currentUser?.email || '');
  const [companyInput, setCompanyInput] = useState('');
  const [countryInput, setCountryInput] = useState('');
  const [initialMsgInput, setInitialMsgInput] = useState('');

  // Local thread messages for this customer session
  const [sessionMessages, setSessionMessages] = useState<any[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Poll / fetch messages for customer's active session
  useEffect(() => {
    if (!customerChatSession) {
      setSessionMessages([]);
      return;
    }

    let isSubscribed = true;
    const fetchThread = async () => {
      try {
        const res = await fetch(`/api/chat/sessions/${customerChatSession.id}/messages`);
        if (res.ok) {
          const data = await res.json();
          if (isSubscribed) {
            setSessionMessages(data);
          }
        }
      } catch (err) {
        console.error('Failed to fetch customer thread messages:', err);
      }
    };

    fetchThread();

    // Poll every 5 seconds while chat window is open
    let timer: any = null;
    if (isOpen) {
      timer = setInterval(fetchThread, 5000);
    }

    return () => {
      isSubscribed = false;
      if (timer) clearInterval(timer);
    };
  }, [customerChatSession?.id, isOpen]);

  // If the admin replies to this session in real-time and activeAdminSessionId matches
  useEffect(() => {
    if (customerChatSession && activeAdminSessionId === customerChatSession.id) {
      setSessionMessages(activeSessionMessages);
    }
  }, [activeSessionMessages, customerChatSession?.id, activeAdminSessionId]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [sessionMessages.length, isOpen]);

  const handleStartSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !emailInput.trim() || !initialMsgInput.trim() || isSubmittingOnboarding) {
      return;
    }

    setIsSubmittingOnboarding(true);
    await startCustomerChatSession({
      name: nameInput.trim(),
      email: emailInput.trim(),
      company: companyInput.trim() || 'Independent Importer',
      country: countryInput.trim() || 'International Port',
      message: initialMsgInput.trim(),
      tags: ['Storefront Live Widget']
    });
    setIsSubmittingOnboarding(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending || !customerChatSession) return;
    const text = input.trim();
    setInput('');
    setIsSending(true);

    // Optimistic customer message
    const tempMsg = {
      id: 'temp-' + Date.now(),
      sender: 'customer',
      senderName: customerChatSession.customerName,
      message: text,
      timestamp: new Date().toISOString()
    };
    setSessionMessages((prev) => [...prev, tempMsg]);

    await sendCustomerChatMessage(text);
    setIsSending(false);
  };

  const handlePromptChipClick = (promptText: string) => {
    if (!customerChatSession) {
      setInitialMsgInput(promptText);
    } else {
      setInput(promptText);
    }
  };

  const QUICK_PROMPTS = [
    'Calorific value & ash specs for Coconut Briquettes?',
    'What is your current MOQ and ocean freight lead time?',
    'Can I request a 2kg certified laboratory sample?'
  ];

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
        <div className="bg-white rounded-3xl w-[calc(100vw-2rem)] sm:w-96 max-w-sm shadow-2xl border border-[#e3ede0] overflow-hidden flex flex-col h-[520px] max-h-[85vh] animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[#1b4d27] text-white p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#f5b342] text-[#172e18] font-black flex items-center justify-center text-xs shadow-xs">
                RX
              </div>
              <div>
                <h4 className="font-heading font-bold text-xs text-white">
                  Richmount Commercial Desk
                </h4>
                <div className="flex items-center gap-1.5 text-[10px] text-white/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online • Port Hours (09:00 - 18:00 IST)</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {customerChatSession && (
                <button
                  type="button"
                  onClick={() => setCustomerChatSession(null)}
                  title="Start New Thread"
                  className="text-white/70 hover:text-white p-1 text-[10px] hover:underline"
                >
                  New Thread
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* WhatsApp Direct Line Banner */}
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

          {/* Content Area */}
          {!customerChatSession ? (
            /* Onboarding View for new / unauthenticated customers */
            <div className="flex-1 p-4 overflow-y-auto bg-[#f9fbf7]">
              <div className="mb-3 text-center">
                <div className="inline-flex items-center gap-1.5 bg-[#edf5e8] text-[#1b4d27] px-2.5 py-1 rounded-full text-[10px] font-bold mb-1.5">
                  <Sparkles className="w-3 h-3 text-[#f5b342]" />
                  Direct Trade Desk Connection
                </div>
                <h5 className="font-heading font-extrabold text-sm text-[#172e18]">
                  Connect with an Export Officer
                </h5>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Please share your business details for tailored pricing, COA laboratory certificates, and container stuffing schedules.
                </p>
              </div>

              <form onSubmit={handleStartSession} className="space-y-2.5">
                <div>
                  <label className="text-[10px] font-bold text-gray-700 block mb-1">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Henrik Lindqvist"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full text-xs pl-8 pr-3 py-2 bg-white rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-700 block mb-1">
                    Business Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. procurement@nordic-energy.se"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full text-xs pl-8 pr-3 py-2 bg-white rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-gray-700 block mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      placeholder="Nordic Biofuels AB"
                      value={companyInput}
                      onChange={(e) => setCompanyInput(e.target.value)}
                      className="w-full text-xs px-2.5 py-2 bg-white rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-700 block mb-1">
                      Target Country
                    </label>
                    <input
                      type="text"
                      placeholder="Sweden / Rotterdam"
                      value={countryInput}
                      onChange={(e) => setCountryInput(e.target.value)}
                      className="w-full text-xs px-2.5 py-2 bg-white rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-700 block mb-1">
                    Initial Inquiry / Product of Interest *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="e.g. Please quote CIF Gothenburg for 100 MT Coconut Briquettes..."
                    value={initialMsgInput}
                    onChange={(e) => setInitialMsgInput(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a] resize-none"
                  />
                </div>

                {/* Quick Prompts */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] text-gray-400 font-bold block">
                    Quick suggestions:
                  </span>
                  {QUICK_PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handlePromptChipClick(prompt)}
                      className="w-full text-left text-[10px] bg-white hover:bg-[#edf5e8] text-gray-700 hover:text-[#1b4d27] p-1.5 rounded-lg border border-gray-200 transition truncate cursor-pointer block"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingOnboarding}
                  className="w-full mt-2 bg-[#1b4d27] hover:bg-[#2a6e3a] disabled:opacity-50 text-white font-bold text-xs py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>{isSubmittingOnboarding ? 'Starting Session...' : 'Start Live Consultation'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#f5b342]" />
                </button>
              </form>
            </div>
          ) : (
            /* Active Live Thread View */
            <div className="flex-1 flex flex-col overflow-hidden bg-[#f9fbf7]">
              {/* SLA Response Badge */}
              <div className="bg-[#edf5e8] px-3.5 py-1.5 border-b border-[#e3ede0] flex items-center justify-between text-[10px] text-[#1b4d27]">
                <span className="font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#2a6e3a]" />
                  Avg SLA: ~15 mins response
                </span>
                <span className="font-bold text-[#8f6208]">
                  {customerChatSession.assignedAgent || 'Trade Desk Assigned'}
                </span>
              </div>

              {/* Messages list */}
              <div className="flex-1 p-3.5 overflow-y-auto space-y-2.5">
                {sessionMessages.map((msg: any) => {
                  const isCustomer = msg.sender === 'customer' || msg.sender === 'user';
                  const isSystem = msg.sender === 'system';

                  if (isSystem) {
                    return (
                      <div key={msg.id} className="text-center my-1">
                        <span className="inline-block bg-amber-100 text-amber-900 border border-amber-200 text-[10px] px-2.5 py-1 rounded-xl">
                          {msg.message || msg.text}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                          isCustomer
                            ? 'bg-[#1b4d27] text-white rounded-br-xs'
                            : 'bg-white text-gray-800 border border-[#e3ede0] shadow-2xs rounded-bl-xs'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.message || msg.text}</p>
                      </div>
                      <span className="text-[9px] text-gray-400 mt-0.5 px-1">
                        {isCustomer ? 'You' : (msg.senderName || 'Trade Desk')} •{' '}
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggestion Chips */}
              <div className="px-3 py-1 bg-white border-t border-gray-100 flex items-center gap-1 overflow-x-auto">
                {QUICK_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handlePromptChipClick(prompt)}
                    className="text-[10px] bg-gray-50 hover:bg-[#edf5e8] text-gray-600 hover:text-[#1b4d27] px-2 py-0.5 rounded-md border border-gray-200 whitespace-nowrap shrink-0 transition cursor-pointer"
                  >
                    {prompt.split('?')[0]}?
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSend} className="p-2.5 bg-white border-t border-gray-100 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type message to Commercial Desk..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-[#f9fbf7] text-xs px-3 py-2 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isSending}
                  className="bg-[#2a6e3a] hover:bg-[#1b4d27] disabled:opacity-50 text-white p-2.5 rounded-xl transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-[#f5b342]" />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
