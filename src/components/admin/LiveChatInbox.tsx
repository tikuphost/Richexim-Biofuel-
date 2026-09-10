import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MessageCircle,
  Send,
  Building2,
  Globe2,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Paperclip,
  RefreshCw,
  SlidersHorizontal,
  Mail,
  UserCheck,
  X,
  ArrowRight,
  Plus,
  Tag,
  FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ChatSession, ChatMessage } from '../../types';

export const LiveChatInbox: React.FC = () => {
  const {
    chatSessions,
    activeAdminSessionId,
    setActiveAdminSessionId,
    activeSessionMessages,
    sendAdminChatMessage,
    updateChatSessionMeta,
    markChatSessionRead,
    refreshChatSessions,
    quotes,
    currentUser
  } = useApp();

  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'waiting_agent' | 'active' | 'resolved'>('all');
  const [messageInput, setMessageInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [adminNotesInput, setAdminNotesInput] = useState('');
  const [newTagInput, setNewTagInput] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Active session
  const currentSession = chatSessions.find((s) => s.id === activeAdminSessionId) || chatSessions[0] || null;

  // Sync admin notes when active session changes
  useEffect(() => {
    if (currentSession) {
      setAdminNotesInput(currentSession.adminNotes || '');
      if (currentSession.unreadAdminCount > 0) {
        markChatSessionRead(currentSession.id, 'admin');
      }
    }
  }, [currentSession?.id]);

  // Scroll to bottom of message stream
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSessionMessages.length, activeAdminSessionId]);

  // Filter sessions
  const filteredSessions = chatSessions.filter((s) => {
    const sName = (s.customerName || '').toLowerCase();
    const sCompany = (s.customerCompany || '').toLowerCase();
    const sCountry = (s.customerCountry || '').toLowerCase();
    const sEmail = (s.customerEmail || '').toLowerCase();
    const sMsg = (s.lastMessageText || '').toLowerCase();
    const query = searchFilter.toLowerCase();

    const matchesSearch =
      !query ||
      sName.includes(query) ||
      sCompany.includes(query) ||
      sCountry.includes(query) ||
      sEmail.includes(query) ||
      sMsg.includes(query);

    const matchesStatus = statusFilter === 'all' ? true : s.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Canned quick responses
  const CANNED_RESPONSES = [
    { label: 'CIF 4h Quote', text: 'Thank you for your inquiry. We can issue a formal CIF proforma quotation within 4 hours. Please confirm your discharge port.' },
    { label: 'MOQ 25 MT', text: 'Our standard Minimum Order Quantity (MOQ) is 25 MT (1x40ft FCL container). Bulk vessel charters starting at 3,000 MT are also available.' },
    { label: 'COA Lab Specs', text: 'Our accredited laboratory Certificate of Analysis (COA) containing calorific, moisture, and ash fusion assay data is available.' },
    { label: '100% Sight LC', text: 'Richmount Exim accepts 100% sight irrevocable Letter of Credit (LC) confirmed by a prime international bank.' },
    { label: 'Port Transit', text: 'Vessels departing Nhava Sheva (JNPT) are operating on normal turnarounds of 3-5 days to Jebel Ali and 22 days to Rotterdam.' }
  ];

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim() || !currentSession || isSending) return;
    const text = messageInput;
    setMessageInput('');
    setIsSending(true);
    await sendAdminChatMessage(currentSession.id, text, currentUser.name || 'Executive Director (Admin)');
    setIsSending(false);
  };

  const handleApplyCanned = (text: string) => {
    setMessageInput((prev) => (prev ? `${prev} ${text}` : text));
  };

  const handleSaveNotes = async () => {
    if (!currentSession) return;
    setIsSavingNotes(true);
    await updateChatSessionMeta(currentSession.id, { adminNotes: adminNotesInput });
    setTimeout(() => setIsSavingNotes(false), 600);
  };

  const handleAddTag = async () => {
    if (!newTagInput.trim() || !currentSession) return;
    const cleanTag = newTagInput.trim();
    if (!currentSession.tags?.includes(cleanTag)) {
      const updatedTags = [...(currentSession.tags || []), cleanTag];
      await updateChatSessionMeta(currentSession.id, { tags: updatedTags });
    }
    setNewTagInput('');
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    if (!currentSession) return;
    const updatedTags = (currentSession.tags || []).filter((t) => t !== tagToRemove);
    await updateChatSessionMeta(currentSession.id, { tags: updatedTags });
  };

  // Find linked quotes for this customer if email or company matches
  const linkedQuotes = currentSession
    ? quotes.filter((q) => {
        const quoteEmail = ((q as any).buyerEmail || (q as any).customerEmail || '').toLowerCase();
        const quoteCompany = ((q as any).buyerCompany || (q as any).customerCompany || '').toLowerCase();
        const sessEmail = (currentSession.customerEmail || '').toLowerCase();
        const sessCompany = (currentSession.customerCompany || '').toLowerCase();

        const emailMatches = Boolean(sessEmail && quoteEmail && quoteEmail === sessEmail);
        const companyMatches = Boolean(sessCompany && quoteCompany && quoteCompany.includes(sessCompany));

        return emailMatches || companyMatches;
      })
    : [];

  return (
    <div className="bg-white rounded-3xl border border-[#d8e6d3] shadow-xs overflow-hidden flex flex-col h-[700px] relative">
      {/* 1. Desk Header */}
      <div className="bg-[#172e18] text-white px-4 sm:px-6 py-3 flex items-center justify-between border-b border-[#255e34] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#f5b342] text-[#172e18] flex items-center justify-center font-black shadow-xs">
            <MessageCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-extrabold text-sm sm:text-base text-white">
                Live Commercial Chat Desk
              </h3>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active Desk
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/70 hidden sm:block">
              Direct real-time trade underwriting communication with international buyers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refreshChatSessions()}
            className="flex items-center gap-1.5 text-xs text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition cursor-pointer border border-white/10"
            title="Refresh threads"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            type="button"
            onClick={() => setIsDossierOpen(!isDossierOpen)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl transition cursor-pointer border ${
              isDossierOpen
                ? 'bg-[#f5b342] text-[#172e18] border-[#f5b342] font-bold shadow-xs'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{isDossierOpen ? 'Hide Dossier' : 'Buyer Dossier'}</span>
          </button>
        </div>
      </div>

      {/* 2. Workspace: 2-Column Responsive Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Column: Thread Roster */}
        <div
          className={`w-full sm:w-72 lg:w-80 shrink-0 border-r border-[#e3ede0] flex flex-col bg-[#fcfdfa] ${
            showMobileChat ? 'hidden sm:flex' : 'flex'
          }`}
        >
          {/* Search */}
          <div className="p-3 border-b border-[#e3ede0] bg-white space-y-2 shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search buyer, company, port..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#f4f7ee] border border-[#e3ede0] focus:outline-hidden focus:border-[#2a6e3a]"
              />
            </div>

            {/* Filter Tabs */}
            <div className="grid grid-cols-4 gap-1 bg-[#f4f7ee] p-1 rounded-xl text-[10px] font-semibold text-gray-600">
              {[
                { id: 'all', label: 'All' },
                { id: 'waiting_agent', label: 'Pending' },
                { id: 'active', label: 'Active' },
                { id: 'resolved', label: 'Done' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id as any)}
                  className={`py-1 px-1 rounded-lg text-center transition cursor-pointer ${
                    statusFilter === tab.id
                      ? 'bg-white text-[#1b4d27] font-bold shadow-2xs'
                      : 'hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {filteredSessions.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <MessageCircle className="w-7 h-7 mx-auto mb-2 text-gray-300" />
                <p className="text-xs font-bold text-gray-600">No threads found</p>
                <p className="text-[10px] text-gray-400 mt-0.5">No inquiries matching filter.</p>
              </div>
            ) : (
              filteredSessions.map((s) => {
                const isSelected = s.id === currentSession?.id;
                const isWaiting = s.status === 'waiting_agent';

                return (
                  <div
                    key={s.id}
                    onClick={() => {
                      setActiveAdminSessionId(s.id);
                      markChatSessionRead(s.id, 'admin');
                      setShowMobileChat(true);
                    }}
                    className={`p-3 transition cursor-pointer flex flex-col gap-1 border-l-4 ${
                      isSelected
                        ? 'bg-[#f0f7eb] border-l-[#1b4d27]'
                        : isWaiting
                        ? 'bg-white hover:bg-[#fafcfa] border-l-amber-400'
                        : 'bg-white hover:bg-[#fafcfa] border-l-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="font-bold text-xs text-[#172e18] truncate max-w-[150px]">
                        {s.customerName}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        {s.unreadAdminCount > 0 && (
                          <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full animate-pulse">
                            {s.unreadAdminCount}
                          </span>
                        )}
                        <span className="text-[10px] text-gray-400">
                          {new Date(s.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 truncate">
                      <span className="truncate font-medium text-[#2a6e3a]">{s.customerCompany}</span>
                      <span>•</span>
                      <span className="shrink-0">{s.customerCountry}</span>
                    </div>

                    <p className="text-[11px] text-gray-600 line-clamp-1 leading-snug">
                      {s.lastMessageText || 'No messages yet'}
                    </p>

                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                          isWaiting
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : s.status === 'active'
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {isWaiting ? 'Awaiting Reply' : s.status}
                      </span>
                      {s.tags && s.tags[0] && (
                        <span className="text-[9px] text-gray-500 bg-gray-100 px-1.5 py-0.2 rounded">
                          {s.tags[0]}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Center/Right Column: Active Conversation Stream & Composer */}
        {currentSession ? (
          <div
            className={`flex-1 flex flex-col bg-white overflow-hidden relative ${
              !showMobileChat ? 'hidden sm:flex' : 'flex'
            }`}
          >
            {/* Thread Header */}
            <div className="px-4 py-2.5 border-b border-[#e3ede0] flex items-center justify-between bg-[#fbfdf9] shrink-0 gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  type="button"
                  onClick={() => setShowMobileChat(false)}
                  className="sm:hidden p-1 rounded-lg hover:bg-gray-200 text-gray-600 cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </button>
                <div className="w-8 h-8 rounded-xl bg-[#1b4d27] text-[#f5b342] font-black flex items-center justify-center text-xs shadow-xs shrink-0">
                  {(currentSession.customerName || 'CU').slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs sm:text-sm font-heading font-extrabold text-gray-900 truncate">
                      {currentSession.customerName}
                    </h3>
                    <span className="text-[10px] text-gray-500 hidden md:inline">
                      ({currentSession.customerEmail})
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 truncate">
                    <span className="font-semibold text-[#1b4d27]">{currentSession.customerCompany}</span> • {currentSession.customerCountry}
                    {currentSession.targetPort ? ` • Port: ${currentSession.targetPort}` : ''}
                  </p>
                </div>
              </div>

              {/* Status Selector & Dossier Toggle */}
              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={currentSession.status}
                  onChange={(e) => updateChatSessionMeta(currentSession.id, { status: e.target.value as any })}
                  className="text-xs bg-[#f4f7ee] border border-[#d8e6d3] rounded-lg px-2.5 py-1 font-bold text-[#1b4d27] focus:outline-hidden cursor-pointer"
                >
                  <option value="active">Active</option>
                  <option value="waiting_agent">Needs Reply</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>

                <button
                  type="button"
                  onClick={() => setIsDossierOpen(!isDossierOpen)}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-semibold flex items-center gap-1 transition cursor-pointer ${
                    isDossierOpen
                      ? 'bg-[#f5b342] text-[#172e18] border-[#f5b342]'
                      : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
                  }`}
                >
                  <UserCheck className="w-3 h-3" />
                  <span className="hidden md:inline">KYC Dossier</span>
                </button>
              </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#fcfdfa]">
              <div className="text-center my-1">
                <span className="text-[10px] uppercase font-bold text-gray-400 bg-white border border-gray-200 px-3 py-0.5 rounded-full shadow-2xs">
                  Richmount Trade Underwriting Channel
                </span>
              </div>

              {activeSessionMessages.map((msg) => {
                const isAgent = msg.sender === 'agent';
                const isSystem = msg.sender === 'system';

                if (isSystem) {
                  return (
                    <div key={msg.id} className="flex justify-center my-2">
                      <div className="max-w-md bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-2.5 text-xs flex items-center gap-2 shadow-2xs">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="text-[11px]">{msg.message || msg.text}</span>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isAgent ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[75%]">
                      {!isAgent && (
                        <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-[9px] font-bold flex items-center justify-center shrink-0">
                          {msg.senderAvatar || (msg.senderName || 'C').slice(0, 1).toUpperCase()}
                        </div>
                      )}

                      <div
                        className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                          isAgent
                            ? 'bg-[#1b4d27] text-white border border-[#255e34] shadow-xs rounded-br-xs'
                            : 'bg-white text-gray-800 border border-[#e3ede0] shadow-2xs rounded-bl-xs'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3 mb-1">
                          <span className={`font-bold text-[10px] ${isAgent ? 'text-[#f5b342]' : 'text-[#1b4d27]'}`}>
                            {msg.senderName}
                          </span>
                          <span className={`text-[9px] ${isAgent ? 'text-white/60' : 'text-gray-400'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="whitespace-pre-wrap text-[11px] sm:text-xs">{msg.message || msg.text}</p>
                      </div>

                      {isAgent && (
                        <div className="w-6 h-6 rounded-full bg-[#f5b342] text-[#172e18] text-[9px] font-bold flex items-center justify-center shrink-0">
                          RX
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Macro Pills */}
            <div className="px-3 py-1.5 bg-[#f4f7ee] border-t border-[#e3ede0] flex items-center gap-1.5 overflow-x-auto shrink-0">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider shrink-0 mr-1">
                Quick Macro:
              </span>
              {CANNED_RESPONSES.map((cr, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyCanned(cr.text)}
                  className="text-[10px] bg-white hover:bg-[#e8f3e2] text-gray-700 hover:text-[#1b4d27] border border-gray-200 hover:border-[#2a6e3a] px-2.5 py-0.5 rounded-lg transition shrink-0 cursor-pointer whitespace-nowrap shadow-2xs"
                >
                  {cr.label}
                </button>
              ))}
            </div>

            {/* Message Composer */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-[#e3ede0] shrink-0">
              <div className="flex gap-2 items-end">
                <textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  rows={2}
                  placeholder="Type official trade desk response... (Press Enter to send, Shift+Enter for newline)"
                  className="flex-1 bg-[#f9fbf7] text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a] resize-none"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim() || isSending}
                  className="bg-[#1b4d27] hover:bg-[#2a6e3a] disabled:opacity-50 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-xs self-end h-[42px]"
                >
                  <Send className="w-3.5 h-3.5 text-[#f5b342]" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </form>

            {/* Buyer KYC Dossier Slide-Over Overlay */}
            {isDossierOpen && (
              <div className="absolute top-0 right-0 bottom-0 w-80 bg-white border-l border-[#d8e6d3] shadow-2xl z-30 flex flex-col p-4 space-y-3 overflow-y-auto animate-in slide-in-from-right duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-[#2a6e3a]" />
                    <span className="text-xs font-bold text-gray-900">Buyer KYC Dossier</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDossierOpen(false)}
                    className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Profile Details */}
                <div className="bg-[#f9fbf7] p-3 rounded-xl border border-[#e3ede0] space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Buyer Contact</span>
                    <strong className="text-gray-900">{currentSession.customerName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Company & Country</span>
                    <span className="text-gray-700">{currentSession.customerCompany} • {currentSession.customerCountry}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Email</span>
                    <span className="text-[#1b4d27] font-semibold">{currentSession.customerEmail}</span>
                  </div>
                  {currentSession.targetPort && (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Discharge Port</span>
                      <span className="text-gray-700">{currentSession.targetPort}</span>
                    </div>
                  )}
                </div>

                {/* Linked RFQs */}
                <div className="bg-[#f9fbf7] p-3 rounded-xl border border-[#e3ede0] text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-gray-800 flex items-center gap-1">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-[#2a6e3a]" />
                      Linked Commercial RFQs
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                      {linkedQuotes.length}
                    </span>
                  </div>
                  {linkedQuotes.length === 0 ? (
                    <p className="text-[11px] text-gray-400 italic">No previous RFQs on file.</p>
                  ) : (
                    <div className="space-y-1.5 max-h-32 overflow-y-auto">
                      {linkedQuotes.map((q) => (
                        <div key={q.id} className="p-2 bg-white rounded-lg border border-gray-200 text-[11px]">
                          <div className="flex items-center justify-between font-bold text-gray-800">
                            <span>{q.quoteNumber}</span>
                            <span className="text-[#1b4d27]">${q.totalUSD.toLocaleString()}</span>
                          </div>
                          <div className="text-[10px] text-gray-500 flex items-center justify-between mt-0.5">
                            <span>{q.incoterm} • {q.destinationPort}</span>
                            <span className="text-amber-700 font-bold">{q.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Trade Tags */}
                <div className="bg-[#f9fbf7] p-3 rounded-xl border border-[#e3ede0] space-y-1.5 text-xs">
                  <span className="font-bold text-gray-800 block">KYC & Trade Tags</span>
                  <div className="flex flex-wrap gap-1">
                    {(currentSession.tags || []).map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold bg-[#eaf4e7] text-[#1b4d27] px-2 py-0.5 rounded-full flex items-center gap-1"
                      >
                        <span>{t}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(t)}
                          className="hover:text-red-600 cursor-pointer"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-1 mt-1">
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="Add tag (e.g. VIP-Buyer)..."
                      className="flex-1 text-[11px] px-2 py-1 bg-white rounded-lg border border-gray-200 focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-2 py-1 rounded-lg bg-[#1b4d27] text-white hover:bg-[#2a6e3a] cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Internal Underwriter Notes */}
                <div className="bg-[#f9fbf7] p-3 rounded-xl border border-[#e3ede0] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-800">Underwriting Desk Notes</span>
                    {isSavingNotes && <span className="text-[10px] text-emerald-600 font-bold">Saved!</span>}
                  </div>
                  <textarea
                    value={adminNotesInput}
                    onChange={(e) => setAdminNotesInput(e.target.value)}
                    rows={3}
                    placeholder="Confidential remarks, credit limits, vessel notes..."
                    className="w-full text-xs p-2 rounded-lg bg-white border border-gray-200 focus:outline-hidden focus:border-[#2a6e3a] resize-none"
                  />
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    className="w-full bg-[#1b4d27] hover:bg-[#2a6e3a] text-white font-bold text-xs py-1.5 rounded-lg transition cursor-pointer shadow-2xs"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
            <MessageCircle className="w-12 h-12 text-gray-300 mb-2" />
            <h4 className="text-sm font-bold text-gray-700">Select a conversation thread</h4>
            <p className="text-xs text-gray-400 mt-0.5 max-w-sm">
              Select a customer inquiry on the left to underwrite proforma quotations and assist buyers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
