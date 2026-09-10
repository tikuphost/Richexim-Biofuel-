import React, { useState } from 'react';
import {
  ShieldAlert,
  Database,
  Download,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
  Package,
  FileSpreadsheet,
  Users,
  Search,
  RefreshCw,
  ExternalLink,
  Printer,
  ChevronRight,
  Filter,
  Layers,
  Edit2,
  Bell,
  UserCheck,
  Briefcase,
  AlertCircle,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Check,
  SlidersHorizontal,
  FolderOpen,
  Globe,
  LogOut,
  ChevronDown,
  Building2,
  ShieldCheck,
  HardDrive,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RFQQuote, CommodityProduct, UserRole } from '../types';
import { SEOMetadataManagement } from './admin/SEOMetadataManagement';
import { LiveChatInbox } from './admin/LiveChatInbox';
import { ProductManagementTab } from './admin/ProductManagementTab';
import { HeroAndSiteContentTab } from './admin/HeroAndSiteContentTab';
import { CertificationsTab } from './admin/CertificationsTab';
import { ArticlesTab } from './admin/ArticlesTab';
import { CareersTab } from './admin/CareersTab';
import { FAQTab } from './admin/FAQTab';
import { AdminSidebar } from './admin/AdminSidebar';

export type AdminTabId =
  | 'quotes'
  | 'products'
  | 'pricing'
  | 'hero'
  | 'quality'
  | 'articles'
  | 'careers'
  | 'faqs'
  | 'chat'
  | 'inquiries'
  | 'seo'
  | 'database';

export const AdminDashboard: React.FC = () => {
  const {
    quotes,
    products,
    inquiries,
    jobApplications,
    chatSessions,
    certifications,
    careers,
    articles,
    faqs,
    siteContent,
    currentUser,
    switchRole,
    setIsAdminOpen,
    setCurrentPage,
    updateQuoteStatus,
    priceQuoteByAdmin,
    updateProductPrice,
    updateProductStock,
    updateJobApplicationStatus,
    formatPrice,
    setSelectedQuoteForView,
    setActiveModal,
    metrics
  } = useApp();

  // Active section displayed in the right editing and management workspace
  const [activeTab, setActiveTab] = useState<AdminTabId>('quotes');
  const [quoteSearch, setQuoteSearch] = useState('');
  const [quoteStatusFilter, setQuoteStatusFilter] = useState<string>('all');
  const [backupStatus, setBackupStatus] = useState<string | null>(null);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Price edit temporary state for FOB tariffs
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);

  // Admin quote pricing modal state
  const [pricingQuote, setPricingQuote] = useState<RFQQuote | null>(null);
  const [itemPriceInputs, setItemPriceInputs] = useState<{ [key: string]: number }>({});
  const [freightInput, setFreightInput] = useState<number>(0);
  const [insuranceInput, setInsuranceInput] = useState<number>(0);
  const [discountInput, setDiscountInput] = useState<number>(0);

  // Dynamic alert counts
  const pendingQuotes = quotes.filter(
    (q) => q.status === 'Pending Admin Price' || q.status === 'Pending'
  );
  const pendingApplications = jobApplications.filter(
    (a) => a.status === 'Under Review' || a.status === 'New' || !a.status
  );
  const waitingChatCount = (chatSessions || []).filter(
    (s) => s.status === 'waiting_agent' || s.unreadAdminCount > 0
  ).length;
  const totalAlerts = pendingQuotes.length + pendingApplications.length + waitingChatCount;

  const openPricingForQuote = (q: RFQQuote) => {
    setPricingQuote(q);
    const initialPrices: { [key: string]: number } = {};
    q.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      initialPrices[item.productId] = item.unitPriceUSD > 0 ? item.unitPriceUSD : (prod?.basePriceUSD || 145);
    });
    setItemPriceInputs(initialPrices);
    const totalVol = q.items.reduce((s, i) => s + i.volume, 0);
    setFreightInput(q.freightCostUSD || (q.incoterm === 'FOB' ? 0 : 45 * totalVol));
    setInsuranceInput(q.insuranceCostUSD || (q.incoterm === 'CIF' ? Math.round(totalVol * 145 * 0.0065) : 0));
    setDiscountInput(q.discountUSD || 0);
  };

  const handleSavePricing = async () => {
    if (!pricingQuote) return;
    const itemPrices = pricingQuote.items.map((item) => ({
      productId: item.productId,
      unitPriceUSD: Number(itemPriceInputs[item.productId]) || 0
    }));
    await priceQuoteByAdmin(pricingQuote.id, itemPrices, freightInput, insuranceInput, discountInput);
    setPricingQuote(null);
  };

  // Calculate telemetry
  const totalPipelineUSD = quotes.reduce((acc, q) => acc + q.totalUSD, 0);
  const totalTonnageInPipeline = quotes.reduce(
    (acc, q) => acc + q.items.reduce((iAcc, item) => iAcc + item.volume, 0),
    0
  );

  const handleBackupDatabase = async () => {
    setIsBackingUp(true);
    setBackupStatus(null);
    try {
      const res = await fetch('/api/database/backup/create', { method: 'POST' });
      const data = await res.json();
      if (data.status === 'ok') {
        setBackupStatus(`Binary NVMe Snapshot Created: ${data.backupFile} (${(data.sizeBytes / 1024).toFixed(1)} KB)`);
      } else {
        setBackupStatus('Backup creation failed.');
      }
    } catch (e) {
      setBackupStatus('Network error creating snapshot backup.');
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleViewPublicWebsite = () => {
    setIsAdminOpen(false);
    setCurrentPage('home');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const filteredQuotes = quotes.filter((q) => {
    const matchesFilter =
      quoteStatusFilter === 'all' ||
      (quoteStatusFilter === 'pending' && (q.status === 'Pending Admin Price' || q.status === 'Pending')) ||
      (quoteStatusFilter === 'quoted' && (q.status === 'Quoted' || q.status === 'Proforma Issued')) ||
      (quoteStatusFilter === 'accepted' && q.status === 'Accepted');

    if (!matchesFilter) return false;
    if (!quoteSearch.trim()) return true;
    const s = quoteSearch.toLowerCase();
    return (
      (q.quoteNumber || '').toLowerCase().includes(s) ||
      (q.buyerCompany || '').toLowerCase().includes(s) ||
      (q.destinationPort || '').toLowerCase().includes(s) ||
      (q.buyerName || '').toLowerCase().includes(s)
    );
  });

  // Left panel navigation sections definition
  const adminSections: Array<{
    id: AdminTabId;
    title: string;
    subtitle: string;
    icon: React.ComponentType<{ className?: string }>;
    badge: string | null;
    badgeColor: string;
    count: number | null;
    category: string;
  }> = [
    {
      id: 'quotes',
      title: 'Commercial RFQs',
      subtitle: 'Underwrite & price buyer quotes',
      icon: FileSpreadsheet,
      badge: pendingQuotes.length > 0 ? `${pendingQuotes.length} pending` : null,
      badgeColor: 'bg-amber-500 text-white animate-pulse',
      count: quotes.length,
      category: 'Trade Operations'
    },
    {
      id: 'products',
      title: 'Commodity Catalog',
      subtitle: 'Add/edit export commodities & specs',
      icon: Package,
      badge: null,
      badgeColor: '',
      count: products.length,
      category: 'Trade Operations'
    },
    {
      id: 'pricing',
      title: 'FOB Price Tariffs',
      subtitle: 'Commodity base rates & stock status',
      icon: DollarSign,
      badge: null,
      badgeColor: '',
      count: products.length,
      category: 'Trade Operations'
    },
    {
      id: 'hero',
      title: 'Hero & Storefront',
      subtitle: 'Slides, global counters & mission',
      icon: Layers,
      badge: null,
      badgeColor: '',
      count: siteContent?.heroSlides?.length || 3,
      category: 'Storefront Content'
    },
    {
      id: 'quality',
      title: 'Quality Accreditations',
      subtitle: 'ISO, ASTM, ENplus, lab certifications',
      icon: ShieldCheck,
      badge: null,
      badgeColor: '',
      count: certifications?.length || 0,
      category: 'Storefront Content'
    },
    {
      id: 'articles',
      title: 'Market Intelligence',
      subtitle: 'Crop reports & decarbonization articles',
      icon: Sparkles,
      badge: null,
      badgeColor: '',
      count: articles?.length || 0,
      category: 'Storefront Content'
    },
    {
      id: 'faqs',
      title: 'FAQ Desk',
      subtitle: 'Customer trade & shipping FAQs',
      icon: HelpCircle,
      badge: null,
      badgeColor: '',
      count: faqs?.length || 0,
      category: 'Storefront Content'
    },
    {
      id: 'careers',
      title: 'Careers & Talent Desk',
      subtitle: 'Job vacancies & candidate resumes',
      icon: Briefcase,
      badge: pendingApplications.length > 0 ? `${pendingApplications.length} new` : null,
      badgeColor: 'bg-emerald-600 text-white',
      count: (careers?.length || 0) + (jobApplications?.length || 0),
      category: 'Human Capital'
    },
    {
      id: 'chat',
      title: 'Live Chat Desk',
      subtitle: 'Buyer discussions & SLA dispatch',
      icon: MessageCircle,
      badge: waitingChatCount > 0 ? `${waitingChatCount} waiting` : null,
      badgeColor: 'bg-red-500 text-white animate-pulse',
      count: chatSessions.length,
      category: 'Communications'
    },
    {
      id: 'inquiries',
      title: 'Customer Leads',
      subtitle: 'Direct contact submissions & leads',
      icon: Users,
      badge: null,
      badgeColor: '',
      count: inquiries.length,
      category: 'Communications'
    },
    {
      id: 'seo',
      title: 'SEO Metadata',
      subtitle: 'Meta tags, OG cards & canonicals',
      icon: Search,
      badge: 'Live',
      badgeColor: 'bg-[#2a6e3a] text-white',
      count: null,
      category: 'Digital Strategy'
    },
    {
      id: 'database',
      title: 'Database & Storage',
      subtitle: 'NVMe backups & SQLite WAL engine',
      icon: Database,
      badge: 'Healthy',
      badgeColor: 'bg-blue-600 text-white',
      count: null,
      category: 'System Infrastructure'
    }
  ];

  const currentSection = adminSections.find((s) => s.id === activeTab) || adminSections[0];

  const availableRoles: UserRole[] = [
    'Admin',
    'Verified Buyer',
    'Sales Manager',
    'Logistics Coordinator',
    'Guest'
  ];

  // Strict Administrator Access Gate: Ensure admin tools and catalog management are strictly accessible only to Admins
  if (currentUser.role !== 'Admin') {
    return (
      <div id="admin-portal-restricted" className="min-h-screen bg-[#edf3ea] text-[#172e18] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-red-200 shadow-xl text-center max-w-md w-full space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="font-heading text-xl font-extrabold text-gray-900">
            Admin Access Restricted
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            The Administration Console, Quotation Pricing, and Commodity Catalog Management views are strictly restricted to authenticated administrators.
            Your current active session role is <strong className="text-gray-900 bg-gray-100 px-2 py-0.5 rounded">{currentUser.role}</strong>.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => switchRole('Admin')}
              className="w-full bg-[#1b4d27] hover:bg-[#2a6e3a] text-white font-bold py-2.5 px-4 rounded-xl transition cursor-pointer text-xs shadow-xs"
            >
              Authenticate as Administrator
            </button>
            <button
              type="button"
              onClick={handleViewPublicWebsite}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-4 rounded-xl transition cursor-pointer text-xs"
            >
              Return to Public Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="admin-portal" className="min-h-screen bg-[#edf3ea] text-[#172e18] flex flex-col font-sans selection:bg-[#2a6e3a] selection:text-white">
      {/* ========================================================================= */}
      {/* DEDICATED ADMIN PORTAL TOP BAR (NO PUBLIC WEBSITE HEADER)                */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#172e18] text-white border-b border-[#254627] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Admin Identity & Subsidiary Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2a6e3a] border border-[#f5b342]/40 flex items-center justify-center text-[#f5b342] shadow-inner font-extrabold text-sm">
              RM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-sm sm:text-base text-white tracking-tight">
                  Richmount Exim
                </span>
                <span className="bg-[#f5b342] text-[#172e18] text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
                  Admin Console
                </span>
              </div>
              <p className="text-[10px] text-white/60 hidden sm:block">
                Operations, Commodity Underwriting &amp; Persistence Center
              </p>
            </div>
          </div>

          {/* Top Actions: View Public Website, Notifications, Backup, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Public Website Button */}
            <button
              type="button"
              onClick={handleViewPublicWebsite}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-1.5 sm:py-2 rounded-xl transition border border-white/15 cursor-pointer shadow-2xs"
              title="Open customer-facing website storefront"
            >
              <Globe className="w-3.5 h-3.5 text-[#f5b342]" />
              <span className="hidden sm:inline">View Public Website</span>
              <span className="sm:hidden">Storefront</span>
            </button>

            {/* Quick Database Backup Trigger */}
            <button
              type="button"
              onClick={handleBackupDatabase}
              disabled={isBackingUp}
              className="hidden md:flex items-center gap-1.5 bg-[#255e34] hover:bg-[#2e703f] text-white text-xs font-semibold px-3 py-2 rounded-xl transition border border-white/10 cursor-pointer shadow-2xs"
              title="Generate point-in-time binary SQLite snapshot"
            >
              <Database className="w-3.5 h-3.5 text-[#f5b342]" />
              <span>{isBackingUp ? 'Backing up...' : 'Snapshot Backup'}</span>
            </button>

            {/* Notification Alerts Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
                className="relative flex items-center justify-center w-9 h-9 bg-white/10 hover:bg-white/20 text-white rounded-xl transition cursor-pointer border border-white/10"
                aria-label="Admin Alerts"
                title={`${totalAlerts} Pending Action Items`}
              >
                <Bell className="w-4 h-4 text-[#f5b342]" />
                {totalAlerts > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center bg-red-500 text-white font-black text-[9px] min-w-[17px] h-4.2 px-1 rounded-full ring-2 ring-[#172e18] animate-pulse">
                    {totalAlerts}
                  </span>
                )}
              </button>

              {/* Notification Alerts Popover */}
              {showAlertsDropdown && (
                <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 max-w-sm bg-white text-gray-800 rounded-2xl shadow-2xl border border-gray-200 z-50 p-4 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-[#2a6e3a]" />
                      <h4 className="font-bold text-sm text-[#172e18]">Admin Action Alerts</h4>
                    </div>
                    <span className="text-[10px] bg-[#f5b342]/20 text-[#8f6208] font-extrabold px-2 py-0.5 rounded-md">
                      {totalAlerts} Pending
                    </span>
                  </div>

                  {totalAlerts === 0 ? (
                    <div className="py-6 text-center text-xs text-gray-500">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                      <p className="font-semibold text-gray-700">All submissions cleared!</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">No new RFQs or job applications pending review.</p>
                    </div>
                  ) : (
                    <div className="py-2 space-y-3 max-h-80 overflow-y-auto">
                      {/* Pending RFQs */}
                      {pendingQuotes.length > 0 && (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] font-bold text-[#1b4d27] uppercase tracking-wider">
                            <span>RFQs Awaiting Underwriting ({pendingQuotes.length})</span>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveTab('quotes');
                                setShowAlertsDropdown(false);
                              }}
                              className="text-[#2a6e3a] hover:underline cursor-pointer"
                            >
                              View All →
                            </button>
                          </div>
                          {pendingQuotes.slice(0, 3).map((q) => (
                            <div
                              key={q.id}
                              className="p-2.5 bg-[#f9fbf7] hover:bg-[#f0f7eb] rounded-xl border border-[#e3ede0] transition text-xs"
                            >
                              <div className="flex items-center justify-between font-bold text-[#172e18]">
                                <span>{q.buyerCompany}</span>
                                <span className="text-[10px] text-[#2a6e3a] font-mono">{q.quoteNumber}</span>
                              </div>
                              <div className="text-[11px] text-gray-500 mt-0.5 flex items-center justify-between">
                                <span>{q.destinationPort} • {q.items.reduce((s, i) => s + i.volume, 0)} MT</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveTab('quotes');
                                    openPricingForQuote(q);
                                    setShowAlertsDropdown(false);
                                  }}
                                  className="bg-[#2a6e3a] hover:bg-[#1b4d27] text-white text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer"
                                >
                                  Price Now
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Pending Career Applications */}
                      {pendingApplications.length > 0 && (
                        <div className="space-y-1.5 pt-2 border-t border-gray-100">
                          <div className="flex items-center justify-between text-[11px] font-bold text-[#1b4d27] uppercase tracking-wider">
                            <span>Applications Received ({pendingApplications.length})</span>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveTab('applications');
                                setShowAlertsDropdown(false);
                              }}
                              className="text-[#2a6e3a] hover:underline cursor-pointer"
                            >
                              View All →
                            </button>
                          </div>
                          {pendingApplications.slice(0, 3).map((app) => (
                            <div
                              key={app.id}
                              className="p-2.5 bg-[#f9fbf7] hover:bg-[#f0f7eb] rounded-xl border border-[#e3ede0] transition text-xs"
                            >
                              <div className="flex items-center justify-between font-bold text-[#172e18]">
                                <span>{app.applicantName}</span>
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-semibold">
                                  {app.status || 'Under Review'}
                                </span>
                              </div>
                              <div className="text-[11px] text-gray-500 mt-0.5 flex items-center justify-between">
                                <span className="truncate max-w-[180px]">{app.jobTitle} ({app.experienceYears}y exp)</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveTab('applications');
                                    setShowAlertsDropdown(false);
                                  }}
                                  className="bg-[#1b4d27] hover:bg-[#2a6e3a] text-white text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer"
                                >
                                  Review
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Waiting Live Chat Sessions */}
                      {waitingChatCount > 0 && (
                        <div className="space-y-1.5 pt-2 border-t border-gray-100">
                          <div className="flex items-center justify-between text-[11px] font-bold text-[#1b4d27] uppercase tracking-wider">
                            <span>Live Chats Awaiting Agent ({waitingChatCount})</span>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveTab('chat');
                                setShowAlertsDropdown(false);
                              }}
                              className="text-[#2a6e3a] hover:underline cursor-pointer"
                            >
                              Open Inbox →
                            </button>
                          </div>
                          {chatSessions
                            .filter((s) => s.status === 'waiting_agent' || s.unreadAdminCount > 0)
                            .slice(0, 3)
                            .map((s) => (
                              <div
                                key={s.id}
                                className="p-2.5 bg-[#f9fbf7] hover:bg-[#f0f7eb] rounded-xl border border-[#e3ede0] transition text-xs"
                              >
                                <div className="flex items-center justify-between font-bold text-[#172e18]">
                                  <span>{s.customerName} ({s.customerCompany})</span>
                                  <span className="text-[10px] text-red-600 font-bold">Needs Reply</span>
                                </div>
                                <div className="text-[11px] text-gray-500 mt-0.5 flex items-center justify-between">
                                  <span className="truncate max-w-[200px]">{s.lastMessageText}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveTab('chat');
                                      setShowAlertsDropdown(false);
                                    }}
                                    className="bg-[#1b4d27] hover:bg-[#2a6e3a] text-white text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer"
                                  >
                                    Reply
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Admin User Profile Chip & Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 bg-[#255e34] hover:bg-[#2e703f] px-2.5 py-1.5 rounded-xl text-white transition cursor-pointer border border-white/10"
              >
                <div className="w-6 h-6 rounded-lg bg-[#f5b342] text-[#172e18] flex items-center justify-center font-black text-[10px]">
                  ED
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold leading-none">{currentUser.name}</div>
                  <div className="text-[9px] text-white/70 leading-none mt-0.5">Role: {currentUser.role}</div>
                </div>
                <ChevronDown className="w-3 h-3 text-white/70" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white text-[#172e18] rounded-2xl shadow-2xl border border-gray-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-xs font-bold text-[#1b4d27]">{currentUser.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{currentUser.email || 'admin@richmount.com'}</p>
                    <span className="inline-block mt-1 bg-[#e8f3e2] text-[#1b4d27] font-bold text-[9px] px-2 py-0.5 rounded">
                      Administrator Access Granted
                    </span>
                  </div>

                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-gray-400">
                    Switch Persona / Role
                  </div>

                  {availableRoles.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => {
                        switchRole(role);
                        setShowUserDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-[#f4f7ee] cursor-pointer ${
                        currentUser.role === role ? 'font-bold text-[#1b4d27] bg-[#eaf3e4]' : 'text-gray-700'
                      }`}
                    >
                      <span>{role}</span>
                      {currentUser.role === role && <CheckCircle2 className="w-3.5 h-3.5 text-[#2a6e3a]" />}
                    </button>
                  ))}

                  <div className="pt-2 mt-1 border-t border-gray-100 px-2">
                    <button
                      type="button"
                      onClick={handleViewPublicWebsite}
                      className="w-full flex items-center gap-2 text-xs font-bold text-[#2a6e3a] hover:bg-[#f0f7eb] px-2.5 py-1.5 rounded-lg transition cursor-pointer"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Return to Public Website</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN ADMIN WORKSPACE CONTAINER                                            */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Executive Overview & Telemetry Strip */}
        <div className="bg-[#172e18] text-white rounded-3xl p-5 sm:p-6 shadow-lg border border-[#234725]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#f5b342] text-[#172e18] text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                  Real-time Operational Telemetry
                </span>
                <span className="text-xs text-white/60">NVMe SQLite Engine • Disk Sync Active</span>
              </div>
              <h1 className="font-heading text-xl sm:text-2xl font-extrabold mt-1 text-white">
                Export Operations &amp; Commercial Pipeline Console
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Production Server Healthy</span>
              </span>
            </div>
          </div>

          {/* Attention Banner if alerts exist */}
          {totalAlerts > 0 && (
            <div className="mt-4 p-3.5 bg-white/10 backdrop-blur-xs rounded-2xl border border-[#f5b342]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
                <div className="text-xs">
                  <span className="font-bold text-white">
                    {totalAlerts} Pending Action Item{totalAlerts > 1 ? 's' : ''}:
                  </span>
                  <span className="text-white/80 ml-1.5">
                    {pendingQuotes.length > 0 && `${pendingQuotes.length} RFQ${pendingQuotes.length > 1 ? 's' : ''} to underwrite`}
                    {pendingQuotes.length > 0 && waitingChatCount > 0 && ' • '}
                    {waitingChatCount > 0 && `${waitingChatCount} live chat${waitingChatCount > 1 ? 's' : ''} awaiting response`}
                    {(pendingQuotes.length > 0 || waitingChatCount > 0) && pendingApplications.length > 0 && ' • '}
                    {pendingApplications.length > 0 && `${pendingApplications.length} candidate${pendingApplications.length > 1 ? 's' : ''} to review`}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {pendingQuotes.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('quotes')}
                    className="bg-[#f5b342] hover:bg-[#e09e2d] text-[#172e18] text-[10px] font-extrabold px-3 py-1.5 rounded-xl transition shadow-xs cursor-pointer"
                  >
                    Open RFQs ({pendingQuotes.length})
                  </button>
                )}
                {waitingChatCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('chat')}
                    className="bg-red-500 hover:bg-red-600 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-xl transition shadow-xs cursor-pointer"
                  >
                    Open Chats ({waitingChatCount})
                  </button>
                )}
              </div>
            </div>
          )}

          {backupStatus && (
            <div className="mt-3 p-2.5 bg-white/10 rounded-xl border border-white/20 text-xs text-[#f5b342] flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{backupStatus}</span>
            </div>
          )}

          {/* Telemetry KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3.5 border border-white/10">
              <div className="flex items-center justify-between text-white/70 text-[11px] mb-1">
                <span>Active Commercial RFQs</span>
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#f5b342]" />
              </div>
              <div className="font-heading text-xl font-extrabold text-white">
                {quotes.length}
              </div>
              <div className="text-[10px] text-[#f5b342] mt-0.5">
                {pendingQuotes.length} Requiring Pricing Underwriting
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3.5 border border-white/10">
              <div className="flex items-center justify-between text-white/70 text-[11px] mb-1">
                <span>Quoted Pipeline Value</span>
                <DollarSign className="w-3.5 h-3.5 text-[#f5b342]" />
              </div>
              <div className="font-heading text-xl font-extrabold text-white">
                {formatPrice(totalPipelineUSD)}
              </div>
              <div className="text-[10px] text-white/70 mt-0.5">Active CIF/FOB Contracts</div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3.5 border border-white/10">
              <div className="flex items-center justify-between text-white/70 text-[11px] mb-1">
                <span>Bulk Pipeline Tonnage</span>
                <TrendingUp className="w-3.5 h-3.5 text-[#f5b342]" />
              </div>
              <div className="font-heading text-xl font-extrabold text-white">
                {totalTonnageInPipeline.toLocaleString()} MT
              </div>
              <div className="text-[10px] text-white/70 mt-0.5">FCL Container Bookings</div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3.5 border border-white/10">
              <div className="flex items-center justify-between text-white/70 text-[11px] mb-1">
                <span>Persistence Engine</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="font-heading text-lg font-extrabold text-white">
                SQLite WASM
              </div>
              <div className="text-[10px] text-emerald-400 mt-0.5">NVMe WAL Sync Active</div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TWO-PANE WORKSPACE: FIXED SIDEBAR (LEFT) + DYNAMIC MAIN CONTENT (RIGHT)   */}
        {/* ========================================================================= */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* ----------------------------------------------------------------------- */}
          {/* FIXED / STICKY SIDEBAR NAVIGATION COMPONENT (LEFT)                      */}
          {/* ----------------------------------------------------------------------- */}
          <aside className="w-full lg:w-80 shrink-0 lg:sticky lg:top-20 self-start">
            <AdminSidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onViewPublicWebsite={handleViewPublicWebsite}
              onBackupDatabase={handleBackupDatabase}
              isBackingUp={isBackingUp}
              counts={{
                quotes: quotes.length,
                pendingQuotes: pendingQuotes.length,
                products: products.length,
                chatSessions: chatSessions.length,
                waitingChatCount: waitingChatCount,
                inquiries: inquiries.length,
                jobApplications: jobApplications.length,
                certifications: certifications?.length || 0,
                articles: articles?.length || 0,
                faqs: faqs?.length || 0
              }}
            />
          </aside>

          {/* ----------------------------------------------------------------------- */}
          {/* DYNAMIC MAIN CONTENT AREA (RIGHT)                                       */}
          {/* ----------------------------------------------------------------------- */}
          <section className="flex-1 min-w-0 w-full">
            {/* Header of Active Section */}
            <div className="bg-white rounded-3xl p-5 border border-[#d8e6d3] shadow-xs mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#1b4d27] text-[#f5b342] flex items-center justify-center shadow-xs shrink-0">
                  <currentSection.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-[#2a6e3a] tracking-wider bg-[#e8f3e2] px-2 py-0.5 rounded">
                      {currentSection.category}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">Live Editor</span>
                  </div>
                  <h2 className="font-heading text-lg sm:text-xl font-extrabold text-[#172e18]">
                    {currentSection.title}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                {activeTab === 'quotes' && (
                  <span className="text-xs font-bold text-gray-600 bg-[#f4f7ee] px-3 py-1.5 rounded-xl border border-[#dce8d6]">
                    {quotes.length} Quotes in System
                  </span>
                )}
                {activeTab === 'products' && (
                  <span className="text-xs font-bold text-[#1b4d27] bg-[#edf5e8] px-3 py-1.5 rounded-xl border border-[#cbe1c3]">
                    {products.length} Commodities Configured
                  </span>
                )}
                {activeTab === 'pricing' && (
                  <span className="text-xs font-bold text-gray-600 bg-[#f4f7ee] px-3 py-1.5 rounded-xl border border-[#dce8d6]">
                    {products.length} Commodities Listed
                  </span>
                )}
                {activeTab === 'hero' && (
                  <span className="text-xs font-bold text-gray-600 bg-[#f4f7ee] px-3 py-1.5 rounded-xl border border-[#dce8d6]">
                    {siteContent?.heroSlides?.length || 3} Carousel Slides
                  </span>
                )}
                {activeTab === 'quality' && (
                  <span className="text-xs font-bold text-gray-600 bg-[#f4f7ee] px-3 py-1.5 rounded-xl border border-[#dce8d6]">
                    {certifications?.length || 0} Certificates Active
                  </span>
                )}
                {activeTab === 'articles' && (
                  <span className="text-xs font-bold text-gray-600 bg-[#f4f7ee] px-3 py-1.5 rounded-xl border border-[#dce8d6]">
                    {articles?.length || 0} Publications
                  </span>
                )}
                {activeTab === 'faqs' && (
                  <span className="text-xs font-bold text-gray-600 bg-[#f4f7ee] px-3 py-1.5 rounded-xl border border-[#dce8d6]">
                    {faqs?.length || 0} FAQs Indexed
                  </span>
                )}
                {activeTab === 'careers' && (
                  <span className="text-xs font-bold text-gray-600 bg-[#f4f7ee] px-3 py-1.5 rounded-xl border border-[#dce8d6]">
                    {careers?.length || 0} Openings • {jobApplications?.length || 0} Candidates
                  </span>
                )}
                {activeTab === 'chat' && (
                  <span className="text-xs font-bold text-gray-600 bg-[#f4f7ee] px-3 py-1.5 rounded-xl border border-[#dce8d6]">
                    {chatSessions.length} Active Threads
                  </span>
                )}
                {activeTab === 'inquiries' && (
                  <span className="text-xs font-bold text-gray-600 bg-[#f4f7ee] px-3 py-1.5 rounded-xl border border-[#dce8d6]">
                    {inquiries.length} Inquiries Logged
                  </span>
                )}
                {activeTab === 'seo' && (
                  <span className="text-xs font-bold text-[#1b4d27] bg-[#edf5e8] px-3 py-1.5 rounded-xl border border-[#cbe1c3]">
                    Search Engine Tags Active
                  </span>
                )}
                {activeTab === 'database' && (
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
                    SQLite WAL Active
                  </span>
                )}
              </div>
            </div>

            {/* Content: Commercial RFQs Management & Price Underwriting */}
            {activeTab === 'quotes' && (
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#e3ede0] shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
                  {/* Search Bar */}
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search quote #, company, port..."
                      value={quoteSearch}
                      onChange={(e) => setQuoteSearch(e.target.value)}
                      className="w-full bg-[#f9fbf7] text-xs pl-9 pr-3 py-2 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
                    />
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'pending', label: `Pending (${pendingQuotes.length})` },
                      { id: 'quoted', label: 'Quoted' },
                      { id: 'accepted', label: 'Accepted' }
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setQuoteStatusFilter(f.id)}
                        className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition cursor-pointer whitespace-nowrap ${
                          quoteStatusFilter === f.id
                            ? 'bg-[#1b4d27] text-white shadow-2xs'
                            : 'bg-[#f4f7ee] text-gray-700 hover:bg-[#e4eee0] border border-gray-200'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-[#f4f7ee] text-gray-700 font-semibold">
                        <th className="py-3 px-3 rounded-l-lg">Quote #</th>
                        <th className="py-3 px-3">Buyer Company</th>
                        <th className="py-3 px-3">Destination Port</th>
                        <th className="py-3 px-3">Incoterm</th>
                        <th className="py-3 px-3 text-right">Tonnage</th>
                        <th className="py-3 px-3 text-right">Total (USD)</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3 rounded-r-lg text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredQuotes.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-12 text-center text-gray-500">
                            <FileSpreadsheet className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            <p className="font-bold text-gray-700">No quotes match your filter</p>
                            <p className="text-xs text-gray-400 mt-0.5">Try changing your search terms or filters.</p>
                          </td>
                        </tr>
                      ) : (
                        filteredQuotes.map((q) => {
                          const tonnage = q.items.reduce((acc, i) => acc + i.volume, 0);
                          return (
                            <tr key={q.id} className="hover:bg-[#f9fbf7] transition">
                              <td className="py-3 px-3 font-mono font-bold text-[#1b4d27]">
                                {q.quoteNumber}
                              </td>
                              <td className="py-3 px-3">
                                <strong className="text-gray-900 block">{q.buyerCompany}</strong>
                                <span className="text-[10px] text-gray-500">{q.buyerName}</span>
                              </td>
                              <td className="py-3 px-3 text-gray-700">{q.destinationPort}</td>
                              <td className="py-3 px-3">
                                <span className="font-bold text-[#2a6e3a]">{q.incoterm}</span>
                              </td>
                              <td className="py-3 px-3 text-right font-semibold">{tonnage} MT</td>
                              <td className="py-3 px-3 text-right font-extrabold text-[#1b4d27]">
                                {formatPrice(q.totalUSD)}
                              </td>
                              <td className="py-3 px-3">
                                <select
                                  value={q.status}
                                  onChange={(e: any) => updateQuoteStatus(q.id, e.target.value)}
                                  className={`bg-white border rounded-lg text-[11px] font-bold px-2 py-1 cursor-pointer ${
                                    q.status === 'Pending Admin Price'
                                      ? 'border-amber-400 text-amber-800 bg-amber-50'
                                      : 'border-gray-200 text-gray-800'
                                  }`}
                                >
                                  <option value="Pending Admin Price">Pending Admin Price</option>
                                  <option value="Quoted">Quoted</option>
                                  <option value="Draft">Draft</option>
                                  <option value="Pending Review">Pending Review</option>
                                  <option value="Under Review">Under Review</option>
                                  <option value="Proforma Issued">Proforma Issued</option>
                                  <option value="Accepted">Accepted</option>
                                  <option value="Rejected">Rejected</option>
                                </select>
                              </td>
                              <td className="py-3 px-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => openPricingForQuote(q)}
                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded-lg transition cursor-pointer"
                                    title="Set or revise official prices for this quote"
                                  >
                                    <DollarSign className="w-3.5 h-3.5" />
                                    <span>{q.totalUSD > 0 ? 'Edit Price' : 'Price Quote'}</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedQuoteForView(q);
                                      setActiveModal('proforma-view');
                                    }}
                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2a6e3a] hover:text-[#1b4d27] bg-[#e8f3e2] px-2.5 py-1 rounded-lg cursor-pointer transition"
                                  >
                                    <Printer className="w-3.5 h-3.5" />
                                    <span>Proforma</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Admin Quote Pricing Modal */}
                {pricingQuote && (
                  <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-2xl w-full border border-[#cbe1c3] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <div className="bg-[#1b4d27] px-6 py-4 text-white flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-[#f5b342] uppercase font-bold tracking-wider block">
                            Admin Commercial Underwriting
                          </span>
                          <h4 className="font-heading text-lg font-bold">
                            Set Official Price Tariff: {pricingQuote.quoteNumber}
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPricingQuote(null)}
                          className="text-white/80 hover:text-white p-1 cursor-pointer text-lg leading-none"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5 text-xs">
                        {/* Buyer Summary */}
                        <div className="bg-[#f9fbf7] p-4 rounded-2xl border border-[#e3ede0] grid grid-cols-2 sm:grid-cols-4 gap-3 text-gray-700">
                          <div>
                            <span className="text-gray-400 text-[10px] block uppercase font-bold">Buyer</span>
                            <span className="font-bold text-[#1b4d27]">{pricingQuote.buyerCompany}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 text-[10px] block uppercase font-bold">Destination</span>
                            <span className="font-semibold">{pricingQuote.destinationPort}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 text-[10px] block uppercase font-bold">Incoterm</span>
                            <span className="font-bold text-[#2a6e3a]">{pricingQuote.incoterm}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 text-[10px] block uppercase font-bold">Total Volume</span>
                            <span className="font-bold">{pricingQuote.items.reduce((s, i) => s + i.volume, 0)} MT</span>
                          </div>
                        </div>

                        {/* Items Price Inputs */}
                        <div className="space-y-3">
                          <h5 className="font-bold text-[#1b4d27] uppercase text-[11px] tracking-wider">
                            Set Commodity FOB Unit Prices (USD / Metric Ton)
                          </h5>
                          <div className="space-y-2">
                            {pricingQuote.items.map((item) => {
                              const unitPrice = itemPriceInputs[item.productId] ?? 0;
                              const lineTotal = Math.round(item.volume * unitPrice);
                              return (
                                <div
                                  key={item.productId}
                                  className="bg-white p-3.5 rounded-xl border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                                >
                                  <div className="flex-1">
                                    <span className="font-bold text-gray-900 block">{item.productName}</span>
                                    <span className="text-[11px] text-gray-500">
                                      Requested Volume: <strong className="text-[#1b4d27]">{item.volume} {item.unit}</strong> • {item.selectedPackaging}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1.5">
                                      <label className="text-gray-600 font-semibold text-[11px]">Unit Price (USD/MT):</label>
                                      <div className="relative">
                                        <span className="absolute left-2 top-1.5 text-gray-400 font-bold">$</span>
                                        <input
                                          type="number"
                                          min="1"
                                          max="20000"
                                          value={unitPrice}
                                          onChange={(e) =>
                                            setItemPriceInputs((prev) => ({
                                              ...prev,
                                              [item.productId]: Math.max(0, Number(e.target.value))
                                            }))
                                          }
                                          className="w-24 pl-5 pr-2 py-1 bg-white border border-[#2a6e3a] rounded-lg text-xs font-bold text-gray-900"
                                        />
                                      </div>
                                    </div>

                                    <div className="text-right min-w-[80px]">
                                      <span className="text-gray-400 text-[10px] block">Line Total:</span>
                                      <span className="font-extrabold text-[#1b4d27]">{formatPrice(lineTotal)}</span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Logistics Costs */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#f0f7eb] p-4 rounded-2xl border border-[#cbe1c3]">
                          <div>
                            <label className="block text-gray-700 font-semibold mb-1">Ocean Container Freight ($)</label>
                            <input
                              type="number"
                              min="0"
                              value={freightInput}
                              onChange={(e) => setFreightInput(Math.max(0, Number(e.target.value)))}
                              className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 font-semibold mb-1">Marine Cover Insurance ($)</label>
                            <input
                              type="number"
                              min="0"
                              value={insuranceInput}
                              onChange={(e) => setInsuranceInput(Math.max(0, Number(e.target.value)))}
                              className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 font-semibold mb-1">Volume Incentive Discount ($)</label>
                            <input
                              type="number"
                              min="0"
                              value={discountInput}
                              onChange={(e) => setDiscountInput(Math.max(0, Number(e.target.value)))}
                              className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-red-600"
                            />
                          </div>
                        </div>

                        {/* Grand Total Calculation Preview */}
                        {(() => {
                          const subtotal = pricingQuote.items.reduce((sum, item) => {
                            const price = itemPriceInputs[item.productId] ?? 0;
                            return sum + item.volume * price;
                          }, 0);
                          const inspection = pricingQuote.inspectionFeeUSD || 350;
                          const calculatedTotal = subtotal + freightInput + insuranceInput + inspection - discountInput;
                          return (
                            <div className="bg-[#1b4d27] text-white p-4 rounded-2xl flex items-center justify-between">
                              <div>
                                <span className="text-[10px] text-[#f5b342] uppercase font-bold tracking-wider block">
                                  Calculated Official Proforma Total ({pricingQuote.incoterm})
                                </span>
                                <span className="text-xl font-extrabold">{formatPrice(calculatedTotal)}</span>
                              </div>
                              <span className="text-xs text-white/80">
                                Subtotal: {formatPrice(subtotal)} • SGS: {formatPrice(inspection)}
                              </span>
                            </div>
                          );
                        })()}
                      </div>

                      <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setPricingQuote(null)}
                          className="px-4 py-2 rounded-xl text-gray-700 hover:bg-gray-200 font-semibold transition cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleSavePricing}
                          className="px-6 py-2.5 rounded-xl bg-[#2a6e3a] hover:bg-[#1b4d27] text-white font-bold transition shadow-md cursor-pointer flex items-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#f5b342]" />
                          <span>Authorize &amp; Issue Price to Buyer</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Content: Commodity Catalog Full CRUD */}
            {activeTab === 'products' && (
              <div className="min-w-0">
                <ProductManagementTab />
              </div>
            )}

            {/* Content: FOB Price Tariffs Management */}
            {activeTab === 'pricing' && (
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#e3ede0] shadow-sm">
                <div className="mb-4">
                  <h3 className="font-heading text-lg font-bold text-[#1b4d27]">
                    Commodity FOB Price Tariffs &amp; Stock Status
                  </h3>
                  <p className="text-xs text-gray-500">
                    Direct inline editing: changes commit immediately to the embedded SQLite database and propagate to buyer RFQ calculators.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-[#f4f7ee] text-gray-700">
                        <th className="py-3 px-3 rounded-l-lg">Commodity</th>
                        <th className="py-3 px-3">Category</th>
                        <th className="py-3 px-3">Grade</th>
                        <th className="py-3 px-3">Current FOB (USD/MT)</th>
                        <th className="py-3 px-3">Stock State</th>
                        <th className="py-3 px-3 rounded-r-lg text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {products.map((p) => {
                        const isEditing = editingProductId === p.id;
                        return (
                          <tr key={p.id} className="hover:bg-[#f9fbf7] transition">
                            <td className="py-3 px-3">
                              <strong className="text-[#1b4d27] block">{p.name}</strong>
                              <span className="text-[10px] text-gray-400 font-mono">{p.code}</span>
                            </td>
                            <td className="py-3 px-3 text-gray-600">{p.category}</td>
                            <td className="py-3 px-3">
                              <span className="text-[10px] font-semibold bg-[#e8f3e2] text-[#1b4d27] px-2 py-0.5 rounded">
                                {p.gradeTier}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              {isEditing ? (
                                <div className="flex items-center gap-1">
                                  <span className="font-bold text-gray-500">$</span>
                                  <input
                                    type="number"
                                    min="10"
                                    max="10000"
                                    value={tempPrice}
                                    onChange={(e) => setTempPrice(Number(e.target.value))}
                                    className="w-20 bg-white border border-[#2a6e3a] rounded px-2 py-1 text-xs font-bold"
                                  />
                                </div>
                              ) : (
                                <span className="font-bold text-gray-900">${p.basePriceUSD} / MT</span>
                              )}
                            </td>
                            <td className="py-3 px-3">
                              <select
                                value={p.stockStatus}
                                onChange={(e: any) => updateProductStock(p.id, e.target.value)}
                                className="bg-white border border-gray-200 rounded px-2 py-1 text-[11px] font-semibold cursor-pointer"
                              >
                                <option value="In Stock">In Stock</option>
                                <option value="Low Stock">Low Stock</option>
                                <option value="Pre-Order">Pre-Order</option>
                              </select>
                            </td>
                            <td className="py-3 px-3 text-right">
                              {isEditing ? (
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      updateProductPrice(p.id, tempPrice);
                                      setEditingProductId(null);
                                    }}
                                    className="bg-[#2a6e3a] hover:bg-[#1b4d27] text-white text-[11px] font-bold px-3 py-1 rounded-lg transition cursor-pointer"
                                  >
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingProductId(null)}
                                    className="bg-gray-100 text-gray-600 text-[11px] font-semibold px-2 py-1 rounded-lg hover:bg-gray-200 transition cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingProductId(p.id);
                                    setTempPrice(p.basePriceUSD);
                                  }}
                                  className="text-gray-500 hover:text-[#1b4d27] inline-flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                  <span>Edit Rate</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Content: Hero Slides & Site Metrics */}
            {activeTab === 'hero' && (
              <div className="min-w-0">
                <HeroAndSiteContentTab />
              </div>
            )}

            {/* Content: Quality Accreditations & Certifications */}
            {activeTab === 'quality' && (
              <div className="min-w-0">
                <CertificationsTab />
              </div>
            )}

            {/* Content: Market Intelligence Articles */}
            {activeTab === 'articles' && (
              <div className="min-w-0">
                <ArticlesTab />
              </div>
            )}

            {/* Content: FAQ Knowledge Base */}
            {activeTab === 'faqs' && (
              <div className="min-w-0">
                <FAQTab />
              </div>
            )}

            {/* Content: Careers Vacancies & Job Applicants */}
            {activeTab === 'careers' && (
              <div className="min-w-0">
                <CareersTab />
              </div>
            )}

            {/* Content: Live Chat Operations Desk */}
            {activeTab === 'chat' && (
              <div className="min-w-0">
                <LiveChatInbox />
              </div>
            )}

            {/* Content: SEO Metadata Management */}
            {activeTab === 'seo' && (
              <div className="min-w-0">
                <SEOMetadataManagement />
              </div>
            )}

            {/* Content: Customer Leads & Inquiries */}
            {activeTab === 'inquiries' && (
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#e3ede0] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-[#1b4d27]">
                      Direct Commercial Inquiries &amp; Trade Leads
                    </h3>
                    <p className="text-xs text-gray-500">
                      Prospect contact submissions and commodity sourcing requests.
                    </p>
                  </div>
                  <span className="text-xs font-extrabold text-[#2a6e3a] bg-[#f0f7eb] px-3 py-1 rounded-lg border border-[#cbe1c3]">
                    {inquiries.length} Total Leads
                  </span>
                </div>

                {inquiries.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 text-xs">
                    <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="font-bold text-sm text-gray-700">No customer inquiries logged</p>
                    <p className="text-gray-400 mt-0.5">Customer contact forms will stream in real time.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {inquiries.map((inq) => (
                      <div key={inq.id} className="p-4 bg-[#f9fbf7] hover:bg-[#f3f7ef] rounded-2xl border border-[#e3ede0] text-xs transition">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                          <span className="font-bold text-sm text-[#1b4d27]">{inq.company}</span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {new Date(inq.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2 px-3 bg-white rounded-xl border border-gray-100 text-[11px] mb-2">
                          <div>
                            <span className="text-gray-400 block">Contact Name:</span>
                            <strong className="text-gray-800">{inq.name}</strong>
                          </div>
                          <div>
                            <span className="text-gray-400 block">Email:</span>
                            <a href={`mailto:${inq.email}`} className="text-[#2a6e3a] font-semibold hover:underline">
                              {inq.email}
                            </a>
                          </div>
                          <div>
                            <span className="text-gray-400 block">Phone / WhatsApp:</span>
                            <a href={`tel:${inq.phone}`} className="text-gray-700 font-semibold">
                              {inq.phone}
                            </a>
                          </div>
                        </div>
                        <p className="text-gray-700 font-medium text-xs">
                          Target Commodity: <span className="text-[#2a6e3a] font-bold">{inq.commodity}</span> • Estimated Requirement: <strong>{inq.estimatedTonnage}</strong>
                        </p>
                        <p className="text-gray-600 mt-1 italic bg-[#eef5eb] p-2.5 rounded-lg border border-[#e0ebd9]">
                          "{inq.message}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Content: Database & Storage */}
            {activeTab === 'database' && (
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#e3ede0] shadow-sm space-y-6">
                <div>
                  <h3 className="font-heading text-lg font-bold text-[#1b4d27]">
                    NVMe Persistent SQLite Database Management
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Embedded WASM SQLite database synchronized to local storage disk (`/data/richmount.sqlite`).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="bg-[#f9fbf7] p-4 rounded-2xl border border-[#e3ede0]">
                    <span className="text-gray-400 block mb-1">Storage Path:</span>
                    <span className="font-mono font-bold text-[#1b4d27]">./data/richmount.sqlite</span>
                  </div>
                  <div className="bg-[#f9fbf7] p-4 rounded-2xl border border-[#e3ede0]">
                    <span className="text-gray-400 block mb-1">Total Tables:</span>
                    <span className="font-bold text-[#1b4d27]">6 Relational Tables</span>
                  </div>
                  <div className="bg-[#f9fbf7] p-4 rounded-2xl border border-[#e3ede0]">
                    <span className="text-gray-400 block mb-1">WAL Mode Sync:</span>
                    <span className="font-bold text-[#2a6e3a]">Active (Sync-on-Mutation)</span>
                  </div>
                </div>

                <div className="p-4 bg-[#f4f7ee] rounded-2xl border border-[#dce8d6] space-y-2">
                  <h4 className="font-bold text-xs text-[#1b4d27] uppercase tracking-wider">
                    Instant Snapshot Backup Generator
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Triggers a binary SQLite memory-to-disk snapshot saved directly into `/data/backups/`. Allows point-in-time recovery of all quotes, commodities, chat sessions, and SEO metadata.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleBackupDatabase}
                      disabled={isBackingUp}
                      className="flex items-center gap-2 bg-[#1b4d27] hover:bg-[#2a6e3a] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-xs transition cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-[#f5b342]" />
                      <span>{isBackingUp ? 'Generating Snapshot...' : 'Trigger Instant Snapshot Backup'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Discrete Admin Footer */}
      <footer className="py-3 px-6 text-center text-[11px] text-gray-500 border-t border-gray-200/80 bg-white/60">
        Richmount Metallic &amp; Allied Exporters Pvt. Ltd. • Secure Administration Console • NVMe SQLite Disk Persistence
      </footer>
    </div>
  );
};
