import React, { useState } from 'react';
import {
  Package,
  FileSpreadsheet,
  MessageCircle,
  Database,
  DollarSign,
  Layers,
  ShieldCheck,
  FolderOpen,
  Briefcase,
  Users,
  HelpCircle,
  Globe,
  Download,
  ChevronRight,
  SlidersHorizontal,
  Search,
  CheckCircle2,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { AdminTabId } from '../AdminDashboard';

export interface AdminSidebarProps {
  activeTab: AdminTabId;
  setActiveTab: (tab: AdminTabId) => void;
  onViewPublicWebsite: () => void;
  onBackupDatabase?: () => void;
  isBackingUp?: boolean;
  counts?: {
    quotes: number;
    pendingQuotes: number;
    products: number;
    chatSessions: number;
    waitingChatCount: number;
    inquiries: number;
    jobApplications: number;
    certifications: number;
    articles: number;
    faqs: number;
  };
}

interface NavSectionItem {
  id: AdminTabId;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'Core Trade' | 'Content & Storefront';
  badge?: string | null;
  badgeColor?: string;
  count?: number | null;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  onViewPublicWebsite,
  onBackupDatabase,
  isBackingUp = false,
  counts
}) => {
  const [navSearch, setNavSearch] = useState('');

  const navItems: NavSectionItem[] = [
    // Core Trade Modules requested by user
    {
      id: 'products',
      title: 'Products & Catalog',
      subtitle: 'Add, edit, remove products & specs',
      icon: Package,
      category: 'Core Trade',
      count: counts?.products ?? 0,
      badge: null
    },
    {
      id: 'quotes',
      title: 'Quotations & RFQs',
      subtitle: 'Underwrite, price & issue proforma',
      icon: FileSpreadsheet,
      category: 'Core Trade',
      badge: counts?.pendingQuotes && counts.pendingQuotes > 0 ? `${counts.pendingQuotes} Pending` : null,
      badgeColor: 'bg-amber-500 text-white animate-pulse',
      count: counts?.quotes ?? 0
    },
    {
      id: 'chat',
      title: 'Live Commercial Chat',
      subtitle: 'Buyer underwriting & real-time chat',
      icon: MessageCircle,
      category: 'Core Trade',
      badge: counts?.waitingChatCount && counts.waitingChatCount > 0 ? `${counts.waitingChatCount} Unread` : null,
      badgeColor: 'bg-red-500 text-white animate-pulse',
      count: counts?.chatSessions ?? 0
    },
    {
      id: 'database',
      title: 'Database & Persistence',
      subtitle: 'SQLite NVMe storage & snapshots',
      icon: Database,
      category: 'Core Trade',
      badge: 'WAL Active',
      badgeColor: 'bg-emerald-100 text-emerald-800 border border-emerald-300'
    },
    {
      id: 'pricing',
      title: 'FOB Price Tariffs',
      subtitle: 'Base rates, units & stock availability',
      icon: DollarSign,
      category: 'Core Trade',
      count: counts?.products ?? 0
    },

    // Content & Enterprise Modules
    {
      id: 'hero',
      title: 'Hero & Storefront',
      subtitle: 'Carousel slides, metrics & mission',
      icon: Layers,
      category: 'Content & Storefront'
    },
    {
      id: 'quality',
      title: 'Quality & Certificates',
      subtitle: 'ISO, ENplus & laboratory audits',
      icon: ShieldCheck,
      category: 'Content & Storefront',
      count: counts?.certifications ?? 0
    },
    {
      id: 'articles',
      title: 'Market Intelligence',
      subtitle: 'Export reports & industry insights',
      icon: FolderOpen,
      category: 'Content & Storefront',
      count: counts?.articles ?? 0
    },
    {
      id: 'careers',
      title: 'Careers & Applicants',
      subtitle: 'Job openings & candidate resumes',
      icon: Briefcase,
      category: 'Content & Storefront',
      count: counts?.jobApplications ?? 0
    },
    {
      id: 'inquiries',
      title: 'Direct Trade Leads',
      subtitle: 'Customer inquiries & contact forms',
      icon: Users,
      category: 'Content & Storefront',
      count: counts?.inquiries ?? 0
    },
    {
      id: 'faqs',
      title: 'FAQ Knowledge Base',
      subtitle: 'Export questions & shipping answers',
      icon: HelpCircle,
      category: 'Content & Storefront',
      count: counts?.faqs ?? 0
    },
    {
      id: 'seo',
      title: 'SEO & Social Tags',
      subtitle: 'Meta descriptions, canonicals & OG tags',
      icon: Globe,
      category: 'Content & Storefront'
    }
  ];

  const filteredNavItems = navItems.filter((item) => {
    if (!navSearch.trim()) return true;
    const q = navSearch.toLowerCase();
    return item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q);
  });

  const coreTradeItems = filteredNavItems.filter((i) => i.category === 'Core Trade');
  const contentItems = filteredNavItems.filter((i) => i.category === 'Content & Storefront');

  return (
    <div className="space-y-4">
      {/* Sidebar Container */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#d8e6d3] shadow-xs">
        {/* Navigation Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#e8f3e2] text-[#2a6e3a] flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-sm text-[#1b4d27]">
                Management Navigation
              </h2>
              <p className="text-[10px] text-gray-500">
                Switch module to manage on right
              </p>
            </div>
          </div>

          <span className="text-[10px] bg-[#f0f7eb] text-[#2a6e3a] font-extrabold px-2 py-0.5 rounded-full border border-[#cbe1c3]">
            {navItems.length} Modules
          </span>
        </div>

        {/* Quick Filter Search for modules */}
        <div className="relative mb-3">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={navSearch}
            onChange={(e) => setNavSearch(e.target.value)}
            placeholder="Filter sections..."
            className="w-full bg-[#f9fbf7] text-xs pl-8 pr-3 py-1.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#2a6e3a]"
          />
        </div>

        {/* Navigation Items grouped by category */}
        <div className="space-y-3">
          {/* Core Trade Group */}
          {coreTradeItems.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-2 mb-1.5">
                Core Operations
              </div>
              <div className="space-y-1">
                {coreTradeItems.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeTab === section.id;

                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => setActiveTab(section.id)}
                      className={`w-full group text-left p-2.5 rounded-2xl transition flex items-center justify-between cursor-pointer border ${
                        isActive
                          ? 'bg-[#1b4d27] text-white border-[#1b4d27] shadow-sm'
                          : 'bg-[#fafcfa] hover:bg-[#f0f7eb] text-gray-800 border-gray-200/70 hover:border-[#cbe1c3]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition ${
                            isActive
                              ? 'bg-white/15 text-[#f5b342]'
                              : 'bg-white text-[#2a6e3a] border border-gray-200/80 group-hover:bg-[#e8f3e2]'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>

                        <div className="min-w-0">
                          <span
                            className={`font-bold text-xs truncate block ${
                              isActive ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {section.title}
                          </span>
                          <span
                            className={`text-[10px] truncate block ${
                              isActive ? 'text-white/80' : 'text-gray-500'
                            }`}
                          >
                            {section.subtitle}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {section.badge ? (
                          <span
                            className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${section.badgeColor}`}
                          >
                            {section.badge}
                          </span>
                        ) : section.count !== undefined && section.count !== null ? (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {section.count}
                          </span>
                        ) : null}

                        <ChevronRight
                          className={`w-3.5 h-3.5 transition-transform ${
                            isActive
                              ? 'text-[#f5b342] translate-x-0.5'
                              : 'text-gray-300 group-hover:text-gray-500'
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Content Group */}
          {contentItems.length > 0 && (
            <div className="pt-2 border-t border-gray-100">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-2 mb-1.5">
                Storefront &amp; Corporate
              </div>
              <div className="space-y-1">
                {contentItems.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeTab === section.id;

                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => setActiveTab(section.id)}
                      className={`w-full group text-left p-2.5 rounded-2xl transition flex items-center justify-between cursor-pointer border ${
                        isActive
                          ? 'bg-[#1b4d27] text-white border-[#1b4d27] shadow-sm'
                          : 'bg-[#fafcfa] hover:bg-[#f0f7eb] text-gray-800 border-gray-200/70 hover:border-[#cbe1c3]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition ${
                            isActive
                              ? 'bg-white/15 text-[#f5b342]'
                              : 'bg-white text-[#2a6e3a] border border-gray-200/80 group-hover:bg-[#e8f3e2]'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>

                        <div className="min-w-0">
                          <span
                            className={`font-bold text-xs truncate block ${
                              isActive ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {section.title}
                          </span>
                          <span
                            className={`text-[10px] truncate block ${
                              isActive ? 'text-white/80' : 'text-gray-500'
                            }`}
                          >
                            {section.subtitle}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {section.count !== undefined && section.count !== null && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {section.count}
                          </span>
                        )}

                        <ChevronRight
                          className={`w-3.5 h-3.5 transition-transform ${
                            isActive
                              ? 'text-[#f5b342] translate-x-0.5'
                              : 'text-gray-300 group-hover:text-gray-500'
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* View Public Storefront Action in Sidebar */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onViewPublicWebsite}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#1b4d27] hover:bg-[#255e34] text-white transition cursor-pointer shadow-xs group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/15 text-[#f5b342] flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-bold text-xs">View Public Website</div>
                <div className="text-[10px] text-white/70">Preview storefront mode</div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-0.5 transition" />
          </button>
        </div>
      </div>

      {/* Persistence & Database Health Card in Left Sidebar */}
      <div className="bg-white rounded-3xl p-4.5 border border-[#d8e6d3] text-xs space-y-2.5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-[#1b4d27] text-xs flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-[#2a6e3a]" />
            Storage &amp; Persistence
          </span>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
            WAL Active
          </span>
        </div>
        <p className="text-[11px] text-gray-600 leading-relaxed">
          Persistent disk sync is active. Changes to products, tariffs, or RFQs commit directly to the NVMe SQLite database.
        </p>
        {onBackupDatabase && (
          <button
            type="button"
            onClick={onBackupDatabase}
            disabled={isBackingUp}
            className="w-full flex items-center justify-center gap-2 bg-[#f4f7ee] hover:bg-[#eaf3e6] border border-[#cbe1c3] text-[#1b4d27] font-bold py-2 px-3 rounded-xl transition cursor-pointer text-xs shadow-2xs disabled:opacity-60"
          >
            <Download className="w-3.5 h-3.5 text-[#2a6e3a]" />
            <span>{isBackingUp ? 'Generating Snapshot...' : 'Generate Database Backup'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
