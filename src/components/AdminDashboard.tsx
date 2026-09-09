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
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RFQQuote, CommodityProduct } from '../types';
import { SEOMetadataManagement } from './admin/SEOMetadataManagement';

export const AdminDashboard: React.FC = () => {
  const {
    quotes,
    products,
    inquiries,
    jobApplications,
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

  const [activeTab, setActiveTab] = useState<'quotes' | 'pricing' | 'seo' | 'inquiries' | 'applications' | 'database'>('quotes');
  const [quoteSearch, setQuoteSearch] = useState('');
  const [backupStatus, setBackupStatus] = useState<string | null>(null);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);

  // Price edit temporary state
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);

  // Admin quote pricing state
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
  const totalAlerts = pendingQuotes.length + pendingApplications.length;

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

  const filteredQuotes = quotes.filter((q) => {
    if (!quoteSearch.trim()) return true;
    const s = quoteSearch.toLowerCase();
    return (
      q.quoteNumber.toLowerCase().includes(s) ||
      q.buyerCompany.toLowerCase().includes(s) ||
      q.destinationPort.toLowerCase().includes(s)
    );
  });

  return (
    <section id="admin-panel" className="py-12 bg-[#edf3ea] border-b border-[#d8e6d3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Executive Banner */}
        <div className="bg-[#172e18] text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#f5b342] text-[#172e18] text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                  Executive Suite
                </span>
                <span className="text-xs text-white/70">Role: Executive Director / Administrator</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold mt-1">
                Export Operations &amp; Commercial Pipeline Console
              </h2>
              <p className="text-xs text-white/70 mt-1">
                Real-time commercial quote underwriting, price tariff adjustments, and NVMe persistent storage administration.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Notification Badge & Action Alert Center */}
              <div className="relative">
                <button
                  type="button"
                  id="admin-notification-bell-btn"
                  onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
                  className="relative flex items-center gap-2 bg-[#2a6e3a] hover:bg-[#388e4c] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer select-none"
                  aria-label="Admin Notifications"
                >
                  <Bell className="w-4 h-4 text-[#f5b342]" />
                  <span>Alerts</span>
                  {totalAlerts > 0 ? (
                    <span className="flex items-center justify-center bg-red-500 text-white font-black text-[11px] min-w-[20px] h-5 px-1 rounded-full ring-2 ring-[#172e18] animate-pulse">
                      {totalAlerts}
                    </span>
                  ) : (
                    <span className="text-[10px] bg-white/20 text-white/80 px-1.5 py-0.5 rounded-full">
                      0
                    </span>
                  )}
                </button>

                {/* Notification Dropdown Popover */}
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
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleBackupDatabase}
                disabled={isBackingUp}
                className="flex items-center gap-2 bg-[#2a6e3a] hover:bg-[#388e4c] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer"
              >
                <Database className="w-4 h-4 text-[#f5b342]" />
                <span>{isBackingUp ? 'Snapshotting...' : 'Create NVMe Backup'}</span>
              </button>
            </div>
          </div>

          {/* Attention Strip Banner if Alerts exist */}
          {totalAlerts > 0 && (
            <div className="mt-4 p-3.5 bg-white/10 backdrop-blur-xs rounded-2xl border border-[#f5b342]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
                <div className="text-xs">
                  <span className="font-bold text-white">
                    {totalAlerts} New Submission{totalAlerts > 1 ? 's' : ''} Requiring Review:
                  </span>
                  <span className="text-white/80 ml-1.5">
                    {pendingQuotes.length > 0 && `${pendingQuotes.length} RFQ${pendingQuotes.length > 1 ? 's' : ''} awaiting price underwriting`}
                    {pendingQuotes.length > 0 && pendingApplications.length > 0 && ' • '}
                    {pendingApplications.length > 0 && `${pendingApplications.length} Career application${pendingApplications.length > 1 ? 's' : ''} received`}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {pendingQuotes.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('quotes')}
                    className="bg-[#f5b342] hover:bg-[#e09e2d] text-[#172e18] text-[11px] font-extrabold px-3 py-1.5 rounded-lg transition shadow-xs cursor-pointer"
                  >
                    Underwrite RFQs ({pendingQuotes.length})
                  </button>
                )}
                {pendingApplications.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('applications')}
                    className="bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition cursor-pointer"
                  >
                    Review Candidates ({pendingApplications.length})
                  </button>
                )}
              </div>
            </div>
          )}

          {backupStatus && (
            <div className="mt-4 p-3 bg-white/10 rounded-xl border border-white/20 text-xs text-[#f5b342] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{backupStatus}</span>
            </div>
          )}

          {/* Telemetry KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between text-white/70 text-xs mb-1">
                <span>Active RFQ Inquiries</span>
                <FileSpreadsheet className="w-4 h-4 text-[#f5b342]" />
              </div>
              <div className="font-heading text-2xl font-extrabold text-white">
                {quotes.length}
              </div>
              <div className="text-[10px] text-[#f5b342] mt-1">Live Commercial Offers</div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between text-white/70 text-xs mb-1">
                <span>Total Pipeline Value</span>
                <DollarSign className="w-4 h-4 text-[#f5b342]" />
              </div>
              <div className="font-heading text-2xl font-extrabold text-white">
                {formatPrice(totalPipelineUSD)}
              </div>
              <div className="text-[10px] text-white/70 mt-1">Quoted FOB/CIF Value</div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between text-white/70 text-xs mb-1">
                <span>Requested Tonnage</span>
                <TrendingUp className="w-4 h-4 text-[#f5b342]" />
              </div>
              <div className="font-heading text-2xl font-extrabold text-white">
                {totalTonnageInPipeline.toLocaleString()} MT
              </div>
              <div className="text-[10px] text-white/70 mt-1">FCL Container Loads</div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between text-white/70 text-xs mb-1">
                <span>NVMe Database Health</span>
                <CheckCircle2 className="w-4 h-4 text-[#2a6e3a]" />
              </div>
              <div className="font-heading text-xl font-extrabold text-white">
                Healthy (Disk-Sync)
              </div>
              <div className="text-[10px] text-white/70 mt-1">WASM SQLite Engine</div>
            </div>
          </div>
        </div>

        {/* Console Navigation Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {[
            {
              id: 'quotes',
              label: `Commercial RFQs (${quotes.length})`,
              badge: pendingQuotes.length > 0 ? `${pendingQuotes.length} new` : null,
              badgeColor: 'bg-[#f5b342] text-[#172e18]'
            },
            { id: 'pricing', label: `FOB Price Tariffs (${products.length})` },
            { id: 'seo', label: 'SEO Metadata Management' },
            { id: 'inquiries', label: `Customer Leads (${inquiries.length})` },
            {
              id: 'applications',
              label: `Job Candidates (${jobApplications.length})`,
              badge: pendingApplications.length > 0 ? `${pendingApplications.length} new` : null,
              badgeColor: 'bg-emerald-600 text-white'
            },
            { id: 'database', label: 'Database & Storage' }
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
                activeTab === t.id
                  ? 'bg-[#1b4d27] text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-[#e4eee0] border border-[#d8e6d3]'
              }`}
            >
              <span>{t.label}</span>
              {t.badge && (
                <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${t.badgeColor}`}>
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab 1: Commercial RFQ Management */}
        {activeTab === 'quotes' && (
          <div className="bg-white rounded-3xl p-6 border border-[#e3ede0] shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search quote number, company, port..."
                  value={quoteSearch}
                  onChange={(e) => setQuoteSearch(e.target.value)}
                  className="w-full bg-[#f9fbf7] text-xs pl-9 pr-3 py-2 rounded-xl border border-gray-300"
                />
              </div>

              <div className="text-xs text-gray-500">
                Displaying {filteredQuotes.length} quotes
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-[#f4f7ee] text-gray-700">
                    <th className="py-3 px-3 rounded-l-lg">Quote #</th>
                    <th className="py-3 px-3">Buyer Company</th>
                    <th className="py-3 px-3">Destination Port</th>
                    <th className="py-3 px-3">Incoterm</th>
                    <th className="py-3 px-3 text-right">Tonnage</th>
                    <th className="py-3 px-3 text-right">Value (USD)</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 rounded-r-lg text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredQuotes.map((q) => {
                    const tonnage = q.items.reduce((acc, i) => acc + i.volume, 0);
                    return (
                      <tr key={q.id} className="hover:bg-[#f9fbf7]">
                        <td className="py-3 px-3 font-mono font-bold text-[#1b4d27]">
                          {q.quoteNumber}
                        </td>
                        <td className="py-3 px-3">
                          <strong className="text-gray-900 block">{q.buyerCompany}</strong>
                          <span className="text-[10px] text-gray-500">{q.buyerName}</span>
                        </td>
                        <td className="py-3 px-3">{q.destinationPort}</td>
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
                            className={`bg-white border rounded-lg text-[11px] font-bold px-2 py-1 ${
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
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded-lg transition"
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
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2a6e3a] hover:text-[#1b4d27] bg-[#e8f3e2] px-2.5 py-1 rounded-lg"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Proforma</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
                      className="text-white/80 hover:text-white p-1 cursor-pointer"
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

        {/* Tab 2: FOB Price Tariffs Management */}
        {activeTab === 'pricing' && (
          <div className="bg-white rounded-3xl p-6 border border-[#e3ede0] shadow-sm">
            <h3 className="font-heading text-lg font-bold text-[#1b4d27] mb-2">
              FOB Price Schedule &amp; Stock Status
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Update international benchmark base prices. Edits are persistently synchronized to the SQLite database.
            </p>

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
                      <tr key={p.id} className="hover:bg-[#f9fbf7]">
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
                            className="bg-white border border-gray-200 rounded px-2 py-1 text-[11px] font-semibold"
                          >
                            <option value="In Stock">In Stock</option>
                            <option value="Low Stock">Low Stock</option>
                            <option value="Pre-Order">Pre-Order</option>
                          </select>
                        </td>
                        <td className="py-3 px-3 text-right">
                          {isEditing ? (
                            <button
                              type="button"
                              onClick={() => {
                                updateProductPrice(p.id, tempPrice);
                                setEditingProductId(null);
                              }}
                              className="bg-[#2a6e3a] text-white text-[11px] font-bold px-3 py-1 rounded-lg"
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingProductId(p.id);
                                setTempPrice(p.basePriceUSD);
                              }}
                              className="text-gray-500 hover:text-[#1b4d27] inline-flex items-center gap-1 text-[11px] font-semibold"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Edit</span>
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

        {/* Tab: SEO Metadata Management */}
        {activeTab === 'seo' && (
          <SEOMetadataManagement />
        )}

        {/* Tab 3: Customer Leads */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-3xl p-6 border border-[#e3ede0] shadow-sm">
            <h3 className="font-heading text-lg font-bold text-[#1b4d27] mb-4">
              Commercial Leads Inbox ({inquiries.length})
            </h3>
            <div className="space-y-3">
              {inquiries.map((inq) => (
                <div key={inq.id} className="p-4 bg-[#f9fbf7] rounded-2xl border border-[#e3ede0] text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-[#1b4d27]">{inq.company}</span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(inq.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-600">
                    Contact: <strong>{inq.name}</strong> • {inq.email} • {inq.phone}
                  </p>
                  <p className="text-gray-700 mt-2 font-medium">
                    Interest: <span className="text-[#2a6e3a] font-bold">{inq.commodity}</span> ({inq.estimatedTonnage})
                  </p>
                  <p className="text-gray-600 mt-1 italic">"{inq.message}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Job Candidates */}
        {activeTab === 'applications' && (
          <div className="bg-white rounded-3xl p-6 border border-[#e3ede0] shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-heading text-lg font-bold text-[#1b4d27]">
                  Career Candidate Submissions ({jobApplications.length})
                </h3>
                <p className="text-xs text-gray-500">
                  Review applicant profiles, qualifications, and update hiring review status.
                </p>
              </div>
              <span className="text-xs font-semibold text-[#2a6e3a] bg-[#f0f7eb] px-3 py-1 rounded-lg border border-[#cbe1c3]">
                {pendingApplications.length} Awaiting Initial Review
              </span>
            </div>

            {jobApplications.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-xs">
                <Briefcase className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="font-bold text-sm text-gray-700">No applications received yet</p>
                <p className="text-gray-400 mt-0.5">Submitted career applications will appear here in real time.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobApplications.map((app) => {
                  const status = app.status || 'Under Review';
                  const isNew = status === 'Under Review' || status === 'New';

                  return (
                    <div
                      key={app.id}
                      className={`p-5 rounded-2xl border transition text-xs space-y-3 ${
                        isNew
                          ? 'bg-[#f9fbf7] border-[#2a6e3a]/40 shadow-xs ring-1 ring-[#2a6e3a]/20'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#1b4d27] text-white font-bold flex items-center justify-center text-xs">
                            {app.applicantName.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-[#1b4d27]">{app.applicantName}</span>
                              {isNew && (
                                <span className="bg-amber-500 text-white font-extrabold text-[9px] px-1.5 py-0.2 rounded uppercase tracking-wider">
                                  Action Required
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">{app.jobTitle}</span>
                          </div>
                        </div>

                        {/* Status selector badge & actions */}
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
                              status === 'Shortlisted'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : status === 'Interviewing'
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : status === 'Accepted'
                                ? 'bg-teal-50 text-teal-800 border-teal-200'
                                : status === 'Archived'
                                ? 'bg-gray-100 text-gray-600 border-gray-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                          >
                            Status: {status}
                          </span>

                          <select
                            value={status}
                            onChange={(e) => updateJobApplicationStatus(app.id, e.target.value)}
                            className="text-xs bg-[#f4f7ee] text-[#172e18] font-bold px-2.5 py-1 rounded-lg border border-[#e3ede0] focus:outline-hidden cursor-pointer"
                          >
                            <option value="Under Review">Under Review</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Interviewing">Interviewing</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Archived">Archived</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2 px-3 bg-white/70 rounded-xl border border-gray-100 text-[11px]">
                        <div>
                          <span className="text-gray-400 block">Email:</span>
                          <a href={`mailto:${app.email}`} className="text-[#2a6e3a] font-semibold hover:underline">
                            {app.email}
                          </a>
                        </div>
                        <div>
                          <span className="text-gray-400 block">Phone:</span>
                          <a href={`tel:${app.phone}`} className="text-gray-700 font-semibold">
                            {app.phone}
                          </a>
                        </div>
                        <div>
                          <span className="text-gray-400 block">Experience:</span>
                          <strong className="text-[#172e18]">{app.experienceYears} Years</strong>
                        </div>
                      </div>

                      {app.coverLetter && (
                        <div className="p-3 bg-gray-50/80 rounded-xl border border-gray-100">
                          <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                            Applicant Statement / Cover Note:
                          </span>
                          <p className="text-gray-700 italic leading-relaxed">
                            "{app.coverLetter}"
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1 text-[11px] text-gray-500">
                        <span>Submitted: {new Date(app.submittedAt).toLocaleDateString()}</span>
                        {app.portfolioUrl && (
                          <a
                            href={app.portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#2a6e3a] font-bold inline-flex items-center gap-1 hover:underline"
                          >
                            <span>Open Resume / LinkedIn</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Database & Storage */}
        {activeTab === 'database' && (
          <div className="bg-white rounded-3xl p-6 border border-[#e3ede0] shadow-sm space-y-6">
            <div>
              <h3 className="font-heading text-lg font-bold text-[#1b4d27]">
                NVMe Persistent SQLite Database Management
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Embedded WASM SQLite database synchronized to local storage disk (`/data/richexim.sqlite`).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-[#f9fbf7] p-4 rounded-2xl border border-[#e3ede0]">
                <span className="text-gray-400 block mb-1">Storage Path:</span>
                <span className="font-mono font-bold text-[#1b4d27]">./data/richexim.sqlite</span>
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

            <div className="pt-2">
              <button
                type="button"
                onClick={handleBackupDatabase}
                disabled={isBackingUp}
                className="flex items-center gap-2 bg-[#1b4d27] hover:bg-[#2a6e3a] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-xs transition cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#f5b342]" />
                <span>Trigger Instant Snapshot Backup (`/api/database/backup/create`)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
