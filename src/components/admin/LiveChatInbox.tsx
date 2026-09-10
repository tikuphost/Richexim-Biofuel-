import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MessageCircle,
  Send,
  User,
  Building2,
  Globe2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Tag,
  Paperclip,
  FileText,
  ChevronRight,
  Sparkles,
  Info,
  RefreshCw,
  SlidersHorizontal,
  Mail,
  UserCheck
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
  const [isContextDrawerOpen, setIsContextDrawerOpen] = useState(true);
  const [adminNotesInput, setAdminNotesInput] = useState('');
  const [newTagInput, setNewTagInput] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Active session
  const currentSession = chatSessions.find((s) => s.id === activeAdminSessionId) || chatSessions[0] || null;

  // Sync admin notes when active session changes
  useEffect(() => {
    if (currentSession) {
      setAdminNotesInput(currentSession.adminNotes || '');
      // Automatically mark as read by admin
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
    const matchesSearch =
      (s.customerName || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
      (s.customerCompany || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
      (s.customerCountry || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
      (s.customerEmail || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
      (s.lastMessageText || '').toLowerCase().includes(searchFilter.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ? true : s.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Canned responses
  const CANNED_RESPONSES = [
    { label: 'CIF Quotation Turnaround', text: 'Thank you for your inquiry. We can issue a formal CIF proforma quotation within 4 hours. Please confirm your target port of discharge.' },
    { label: 'MOQ & Container Stuffing', text: 'Our standard Minimum Order Quantity (MOQ) is 25 MT (1x40ft FCL container). Bulk vessel charters starting at 3,000 MT are also available.' },
    { label: 'Laboratory COA & Specs', text: 'We have dispatched our accredited laboratory Certificate of Analysis (COA) containing calorific, moisture, and ash fusion assay data.' },
    { label: 'Sight LC Payment Terms', text: 'Richmount Exim accepts 100% sight irrevocable Letter of Credit (LC) confirmed by a prime international bank.' }
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

  const handleSaveNotes = async () => {
    if (!currentSession) return;
    setIsSavingNotes(true);
    await updateChatSessionMeta(currentSession.id, { adminNotes: adminNotesInput });
    setTimeout(() => setIsSavingNotes(false), 500);
  };

  const handleAddTag = async () => {
    if (!newTagInput.trim() || !currentSession) return;
    const cleanTag = newTagInput.trim();
    if (!currentSession.tags.includes(cleanTag)) {
      const updatedTags = [...currentSession.tags, cleanTag];
      await updateChatSessionMeta(currentSession.id, { tags: updatedTags });
    }
    setNewTagInput('');
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    if (!currentSession) return;
    const updatedTags = currentSession.tags.filter((t) => t !== tagToRemove);
    await updateChatSessionMeta(currentSession.id, { tags: updatedTags });
  };

  // Find linked quotes for this customer if email or company matches
  const linkedQuotes = currentSession
    ? quotes.filter(
        (q) =>
          (currentSession.customerEmail && q.customerEmail.toLowerCase() === currentSession.customerEmail.toLowerCase()) ||
          (currentSession.customerCompany && q.customerCompany.toLowerCase().includes(currentSession.customerCompany.toLowerCase()))
      )
    : [];

  return (
    <div className="bg-white rounded-3xl border border-[#e3ede0] shadow-sm overflow-hidden flex flex-col h-[750px]">
      {/* Top Header Bar */}
      <div className="bg-[#172e18] text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#f5b342] text-[#172e18] flex items-center justify-center font-black">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-extrabold text-base text-white">
                Commercial Live Chat Operations Desk
              </h3>
              <span className="bg-[#2a6e3a] text-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Dual-Persona Asynchronous Engine
              </span>
            </div>
            <p className="text-xs text-white/70">
              Direct live communication bridge between storefront international buyers and export trade desk agents.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => refreshChatSessions()}
            className="flex items-center gap-1.5 text-xs text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Threads</span>
          </button>
          <button
            type="button"
            onClick={() => setIsContextDrawerOpen(!isContextDrawerOpen)}
            className="flex items-center gap-1.5 text-xs text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{isContextDrawerOpen ? 'Hide Buyer Dossier' : 'Show Buyer Dossier'}</span>
          </button>
        </div>
      </div>

      {/* Main Split-Pane Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Thread List */}
        <div className="w-80 sm:w-96 border-r border-[#e3ede0] flex flex-col bg-[#fbfdf9]">
          {/* Search & Filter Controls */}
          <div className="p-3.5 border-b border-[#e3ede0] space-y-2.5 bg-white">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search by buyer, company, country..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#f4f7f2] border border-gray-200 focus:outline-hidden focus:border-[#2a6e3a]"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-[#f4f7f2] p-1 rounded-xl text-[11px] font-medium">
              {[
                { id: 'all', label: 'All' },
                { id: 'waiting_agent', label: 'Waiting Agent' },
                { id: 'active', label: 'Active' },
                { id: 'resolved', label: 'Resolved' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id as any)}
                  className={`flex-1 py-1 px-1.5 rounded-lg text-center transition cursor-pointer ${
                    statusFilter === tab.id
                      ? 'bg-white text-[#1b4d27] font-bold shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Session Cards List */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {filteredSessions.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-xs font-bold text-gray-600">No chat sessions found</p>
                <p className="text-[11px] text-gray-400 mt-1">No customer threads match your current filter.</p>
              </div>
            ) : (
              filteredSessions.map((s) => {
                const isSelected = s.id === currentSession?.id;
                const isWaiting = s.status === 'waiting_agent';
                const isUrgent = s.priority === 'urgent';

                return (
                  <div
                    key={s.id}
                    onClick={() => {
                      setActiveAdminSessionId(s.id);
                      markChatSessionRead(s.id, 'admin');
                    }}
                    className={`p-3.5 transition cursor-pointer flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-[#edf5e8] border-l-4 border-l-[#1b4d27]'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-[#1b4d27] text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                          {(s.customerName || 'CU').slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-gray-900 truncate">
                            {s.customerName}
                          </h4>
                          <p className="text-[11px] text-gray-500 truncate">
                            {s.customerCompany} • {s.customerCountry}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {s.unreadAdminCount > 0 && (
                          <span className="bg-red-500 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                            {s.unreadAdminCount}
                          </span>
                        )}
                        <span className="text-[10px] text-gray-400">
                          {new Date(s.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    {/* Preview message */}
                    <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">
                      {s.lastMessageText || 'No messages yet'}
                    </p>

                    {/* Status & Priority tags */}
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                          isWaiting
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : s.status === 'active'
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {s.status === 'waiting_agent' ? 'Needs Agent Response' : s.status}
                      </span>

                      {isUrgent && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-red-100 text-red-700">
                          Urgent Priority
                        </span>
                      )}

                      {s.assignedAgent && (
                        <span className="text-[9px] text-gray-500 truncate max-w-[120px]">
                          • {s.assignedAgent.split(' ')[0]}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Center Column: Conversation Stream & Composer */}
        {currentSession ? (
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            {/* Thread Header */}
            <div className="px-5 py-3.5 border-b border-[#e3ede0] flex items-center justify-between bg-[#fbfdf9]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#1b4d27] text-[#f5b342] font-black flex items-center justify-center text-sm shadow-xs">
                  {(currentSession.customerName || 'CU').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-heading font-extrabold text-gray-900">
                      {currentSession.customerName}
                    </h3>
                    <span className="text-xs text-gray-400 font-normal">
                      ({currentSession.customerEmail})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500">
                    <span className="font-semibold text-[#1b4d27]">{currentSession.customerCompany}</span>
                    <span>•</span>
                    <span>{currentSession.customerCountry}</span>
                    <span>•</span>
                    <span className="text-gray-400">Assigned: {currentSession.assignedAgent || 'Unassigned'}</span>
                  </div>
                </div>
              </div>

              {/* Status & Priority Quick Controls */}
              <div className="flex items-center gap-2">
                <select
                  value={currentSession.status}
                  onChange={(e) => updateChatSessionMeta(currentSession.id, { status: e.target.value as any })}
                  className="text-xs bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 font-bold text-gray-700 focus:outline-hidden focus:border-[#2a6e3a]"
                >
                  <option value="active">Active Thread</option>
                  <option value="waiting_agent">Waiting Agent</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>

                <select
                  value={currentSession.priority}
                  onChange={(e) => updateChatSessionMeta(currentSession.id, { priority: e.target.value as any })}
                  className="text-xs bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 font-bold text-gray-700 focus:outline-hidden focus:border-[#2a6e3a]"
                >
                  <option value="normal">Normal Priority</option>
                  <option value="urgent">Urgent Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
            </div>

            {/* Scrollable Message History */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#f9fbf7]">
              {/* Thread Start Notice */}
              <div className="text-center my-2">
                <span className="inline-block text-[10px] uppercase font-bold text-gray-400 bg-white border border-gray-200 px-3 py-1 rounded-full shadow-2xs">
                  Encrypted Direct Export Discussion • Started {new Date(currentSession.lastMessageTime).toLocaleDateString()}
                </span>
              </div>

              {activeSessionMessages.map((msg) => {
                const isAgent = msg.sender === 'agent';
                const isSystem = msg.sender === 'system';

                if (isSystem) {
                  return (
                    <div key={msg.id} className="flex justify-center my-2">
                      <div className="max-w-md bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-3 text-xs leading-relaxed flex items-start gap-2 shadow-2xs">
                        <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-[11px] text-amber-800">
                            {msg.senderName || 'Auto-SLA Policy Notice'}
                          </p>
                          <p className="mt-0.5">{msg.message || msg.text}</p>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isAgent ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-end gap-2 max-w-[80%]">
                      {!isAgent && (
                        <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                          {msg.senderAvatar || 'CU'}
                        </div>
                      )}

                      <div
                        className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                          isAgent
                            ? 'bg-[#1b4d27] text-white border border-[#2a6e3a] shadow-xs rounded-br-xs'
                            : 'bg-white text-gray-800 border border-[#e3ede0] shadow-2xs rounded-bl-xs'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3 mb-1">
                          <span className={`font-bold text-[11px] ${isAgent ? 'text-[#f5b342]' : 'text-[#1b4d27]'}`}>
                            {msg.senderName}
                          </span>
                          <span className={`text-[9px] ${isAgent ? 'text-white/60' : 'text-gray-400'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="whitespace-pre-wrap">{msg.message || msg.text}</p>

                        {/* Attachments if any */}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-white/20 flex flex-wrap gap-1.5">
                            {msg.attachments.map((att: string, i: number) => (
                              <div
                                key={i}
                                className={`text-[10px] font-semibold flex items-center gap-1 px-2 py-1 rounded-md ${
                                  isAgent ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                <Paperclip className="w-3 h-3" />
                                <span>{att}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {isAgent && (
                        <div className="w-7 h-7 rounded-full bg-[#f5b342] text-[#172e18] text-[10px] font-bold flex items-center justify-center shrink-0">
                          RX
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Canned Response Macros */}
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#f5b342]" />
                Macros:
              </span>
              {CANNED_RESPONSES.map((cr, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setMessageInput(cr.text)}
                  className="text-[11px] bg-white hover:bg-[#edf5e8] text-gray-700 hover:text-[#1b4d27] border border-gray-200 hover:border-[#1b4d27] px-2.5 py-1 rounded-lg transition shrink-0 cursor-pointer"
                >
                  {cr.label}
                </button>
              ))}
            </div>

            {/* Message Composer */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-[#e3ede0]">
              <div className="flex gap-3">
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
                  placeholder="Type an official trade desk response... (Press Enter to send, Shift+Enter for new line)"
                  className="flex-1 bg-[#f9fbf7] text-xs p-3 rounded-2xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a] resize-none"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim() || isSending}
                  className="bg-[#1b4d27] hover:bg-[#2a6e3a] disabled:opacity-50 text-white font-bold text-xs px-5 py-3 rounded-2xl flex items-center gap-2 transition cursor-pointer shadow-xs self-end"
                >
                  <Send className="w-4 h-4 text-[#f5b342]" />
                  <span>Send</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
            <MessageCircle className="w-12 h-12 text-gray-300 mb-3" />
            <h4 className="text-sm font-bold text-gray-700">Select a conversation thread</h4>
            <p className="text-xs text-gray-400 mt-1 max-w-sm">
              Select a customer inquiry from the left pane to underwrite quotations, dispatch COA lab reports, or answer logistics queries.
            </p>
          </div>
        )}

        {/* Right Collapsible Column: Buyer Context Dossier */}
        {isContextDrawerOpen && currentSession && (
          <div className="w-72 sm:w-80 border-l border-[#e3ede0] bg-[#fbfdf9] flex flex-col overflow-y-auto p-4 space-y-4">
            {/* Buyer Profile Card */}
            <div className="bg-white rounded-2xl p-4 border border-[#e3ede0] shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold text-[#172e18] mb-3 pb-2 border-b border-gray-100">
                <UserCheck className="w-4 h-4 text-[#2a6e3a]" />
                <span>Buyer Profile &amp; Verification</span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Contact Person</span>
                  <span className="font-bold text-gray-900">{currentSession.customerName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Company / Entity</span>
                  <span className="font-semibold text-gray-800">{currentSession.customerCompany}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Corporate Email</span>
                  <a href={`mailto:${currentSession.customerEmail}`} className="text-[#2a6e3a] hover:underline break-all">
                    {currentSession.customerEmail}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Target Destination</span>
                  <span className="font-medium text-gray-800">{currentSession.customerCountry}</span>
                </div>
              </div>
            </div>

            {/* Assigned Trade Desk Agent */}
            <div className="bg-white rounded-2xl p-4 border border-[#e3ede0] shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold text-[#172e18] mb-2 pb-2 border-b border-gray-100">
                <User className="w-4 h-4 text-[#2a6e3a]" />
                <span>Assigned Export Officer</span>
              </div>
              <select
                value={currentSession.assignedAgent || 'Sarah Jenkins (Senior Trade Desk)'}
                onChange={(e) => updateChatSessionMeta(currentSession.id, { assignedAgent: e.target.value })}
                className="w-full text-xs bg-[#f4f7f2] border border-gray-200 rounded-xl p-2 font-medium text-gray-800 focus:outline-hidden focus:border-[#2a6e3a]"
              >
                <option value="Sarah Jenkins (Senior Trade Desk)">Sarah Jenkins (Senior Trade Desk)</option>
                <option value="Alex Morgan (Logistics & Chartering)">Alex Morgan (Logistics & Chartering)</option>
                <option value="Vikram Sengupta (Quality & Lab)">Vikram Sengupta (Quality & Lab)</option>
                <option value="Executive Director (Admin)">Executive Director (Admin)</option>
              </select>
            </div>

            {/* Tag Management */}
            <div className="bg-white rounded-2xl p-4 border border-[#e3ede0] shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold text-[#172e18] mb-2 pb-2 border-b border-gray-100">
                <Tag className="w-4 h-4 text-[#2a6e3a]" />
                <span>Inquiry Classification Tags</span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {currentSession.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 bg-[#edf5e8] text-[#1b4d27] text-[10px] font-bold px-2 py-0.5 rounded-md"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-gray-400 hover:text-red-500 ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-1.5">
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
                  placeholder="New tag..."
                  className="flex-1 text-xs bg-[#f4f7f2] border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-[#2a6e3a]"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="bg-[#1b4d27] hover:bg-[#2a6e3a] text-white text-xs font-bold px-2.5 py-1.5 rounded-lg transition cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Private Internal Notes */}
            <div className="bg-white rounded-2xl p-4 border border-[#e3ede0] shadow-2xs flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2 text-xs font-bold text-[#172e18]">
                  <FileText className="w-4 h-4 text-[#2a6e3a]" />
                  <span>Private Staff Notes</span>
                </div>
                {isSavingNotes && (
                  <span className="text-[10px] text-emerald-600 font-bold">Saved</span>
                )}
              </div>

              <textarea
                value={adminNotesInput}
                onChange={(e) => setAdminNotesInput(e.target.value)}
                rows={4}
                placeholder="Confidential buyer credit assessment, special LC notes, target vessel schedule..."
                className="w-full text-xs p-2.5 bg-[#fbfdf9] border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#2a6e3a] resize-none mb-2"
              />

              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={isSavingNotes}
                className="w-full bg-[#2a6e3a] hover:bg-[#1b4d27] text-white text-xs font-bold py-2 rounded-xl transition cursor-pointer"
              >
                {isSavingNotes ? 'Saving Notes...' : 'Save Notes to DB'}
              </button>
            </div>

            {/* Linked RFQs if found */}
            {linkedQuotes.length > 0 && (
              <div className="bg-white rounded-2xl p-4 border border-[#e3ede0] shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-[#172e18] mb-2 pb-2 border-b border-gray-100">
                  <Building2 className="w-4 h-4 text-[#2a6e3a]" />
                  <span>Linked RFQs ({linkedQuotes.length})</span>
                </div>
                <div className="space-y-2">
                  {linkedQuotes.map((lq) => (
                    <div
                      key={lq.id}
                      className="p-2 bg-[#f4f7f2] rounded-xl text-xs flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-gray-900">{lq.id}</div>
                        <div className="text-[10px] text-gray-500">
                          {lq.items.length} items • {lq.incoterm} {lq.destinationPort}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white text-[#1b4d27] border border-gray-200">
                        {lq.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
