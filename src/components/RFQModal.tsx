import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  Plus,
  Trash2,
  Ship,
  ShieldCheck,
  Building,
  Mail,
  User,
  Phone,
  Globe,
  ArrowRight,
  Info,
  CheckCircle2,
  FileCheck,
  Printer
} from 'lucide-react';
import { useApp, MAJOR_PORTS } from '../context/AppContext';
import { IncotermType, VolumeUnit, RFQQuote } from '../types';

export const RFQModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    rfqItems,
    updateRFQItem,
    removeFromRFQ,
    clearRFQ,
    submitRFQ,
    currentUser,
    formatPrice,
    setSelectedQuoteForView
  } = useApp();

  const [destinationPort, setDestinationPort] = useState(MAJOR_PORTS[1].name); // Port of Rotterdam
  const [incoterm, setIncoterm] = useState<IncotermType>('CIF');
  const [buyerName, setBuyerName] = useState(currentUser.name);
  const [buyerCompany, setBuyerCompany] = useState(currentUser.company);
  const [buyerEmail, setBuyerEmail] = useState(currentUser.email);
  const [buyerPhone, setBuyerPhone] = useState('+91 8921517645');
  const [buyerCountry, setBuyerCountry] = useState(currentUser.country);
  const [notes, setNotes] = useState('Please include Phytosanitary & SGS Certificate of Analysis.');
  const [paymentTerms, setPaymentTerms] = useState('30% Advance T/T, 70% against Bill of Lading (B/L) copy');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedQuote, setSubmittedQuote] = useState<RFQQuote | null>(null);

  if (activeModal !== 'rfq') return null;

  const totalTonnage = rfqItems.reduce((sum, item) => sum + item.volume, 0);
  const subtotalUSD = rfqItems.reduce((sum, item) => sum + item.lineTotalUSD, 0);

  const portInfo = MAJOR_PORTS.find((p) => p.name === destinationPort) || MAJOR_PORTS[0];

  let freightCostUSD = 0;
  let insuranceCostUSD = 0;
  if (incoterm === 'CIF' || incoterm === 'CFR') {
    freightCostUSD = portInfo.estFreightUSDPerMT * totalTonnage;
  }
  if (incoterm === 'CIF') {
    insuranceCostUSD = Math.round(subtotalUSD * 0.0065); // 0.65% ICC A cover
  }

  let discountUSD = 0;
  if (totalTonnage >= 100) discountUSD = Math.round(subtotalUSD * 0.04);
  else if (totalTonnage >= 50) discountUSD = Math.round(subtotalUSD * 0.02);

  const inspectionFeeUSD = rfqItems.length > 0 ? 350 : 0;
  const totalUSD = subtotalUSD + freightCostUSD + insuranceCostUSD + inspectionFeeUSD - discountUSD;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rfqItems.length === 0) return;
    setIsSubmitting(true);
    try {
      const result = await submitRFQ({
        buyerName,
        buyerCompany,
        buyerEmail,
        buyerPhone,
        buyerCountry,
        destinationPort,
        incoterm,
        notes,
        paymentTerms
      });
      if (result) {
        setSubmittedQuote(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenProforma = () => {
    if (submittedQuote) {
      setSelectedQuoteForView(submittedQuote);
      setActiveModal('proforma-view');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-4xl max-h-[95vh] sm:max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-[#e3ede0] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#1b4d27] text-white px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#f5b342] text-[#172e18] flex items-center justify-center font-bold shrink-0">
              <FileSpreadsheet className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-heading text-base sm:text-lg font-bold truncate">
                Export Quotation / RFQ Calculator
              </h3>
              <p className="text-[11px] sm:text-xs text-white/80 truncate">
                Richexim Group Commercial Export Division • Incoterms 2020 Standard
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveModal('none');
              setSubmittedQuote(null);
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 sm:space-y-6">
          {submittedQuote ? (
            /* Success confirmation screen with direct trigger to printable Proforma */
            <div className="text-center py-8 px-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#e8f3e2] text-[#2a6e3a] mx-auto flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="font-heading text-2xl font-extrabold text-[#1b4d27]">
                RFQ #{submittedQuote.quoteNumber} Generated Successfully
              </h4>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                Your official commercial quotation for <strong>{submittedQuote.destinationPort}</strong> has been created and synced to our international sales desk.
              </p>

              <div className="bg-[#f9fbf7] rounded-2xl p-5 max-w-md mx-auto border border-[#e3ede0] text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Incoterm:</span>
                  <span className="font-bold text-[#1b4d27]">{submittedQuote.incoterm}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Commodity Tonnage:</span>
                  <span className="font-bold text-[#1b4d27]">{totalTonnage} MT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Price Tariff Status:</span>
                  {currentUser.role === 'Admin' && submittedQuote.totalUSD > 0 ? (
                    <span className="font-extrabold text-[#2a6e3a] text-sm">{formatPrice(submittedQuote.totalUSD)}</span>
                  ) : (
                    <span className="font-bold text-[#2a6e3a] bg-[#f0f7eb] px-2 py-0.5 rounded border border-[#cbe1c3]">
                      Awaiting Price from Admin Desk
                    </span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Assigned Desk:</span>
                  <span className="font-semibold text-gray-800">{submittedQuote.assignedManager}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleOpenProforma}
                  className="flex items-center gap-2 bg-[#2a6e3a] hover:bg-[#1b4d27] text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md transition cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-[#f5b342]" />
                  <span>View &amp; Print Proforma Invoice</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal('none');
                    setSubmittedQuote(null);
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-5 py-3 rounded-xl text-sm transition"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Items List */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1b4d27]">
                    1. Configured Export Commodities ({rfqItems.length})
                  </h4>
                  {rfqItems.length > 0 && (
                    <button
                      type="button"
                      onClick={clearRFQ}
                      className="text-xs text-red-600 hover:underline font-medium"
                    >
                      Clear All Items
                    </button>
                  )}
                </div>

                {rfqItems.length === 0 ? (
                  <div className="bg-[#f9fbf7] rounded-2xl p-8 text-center border border-dashed border-gray-300">
                    <p className="text-sm font-semibold text-gray-700">No commodities in RFQ builder</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Browse the catalog and click "Add to RFQ" to add bio-fuels or carbon minerals.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveModal('none')}
                      className="mt-3 bg-[#2a6e3a] text-white text-xs font-bold px-4 py-2 rounded-xl"
                    >
                      Browse Catalog
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {rfqItems.map((item) => (
                      <div
                        key={item.productId}
                        className="bg-[#f9fbf7] rounded-2xl p-4 border border-[#e3ede0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold bg-[#1b4d27] text-white px-2 py-0.5 rounded">
                              HS {item.hsCode}
                            </span>
                            <h5 className="font-bold text-sm text-[#1b4d27]">{item.productName}</h5>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Reference: {formatPrice(item.unitPriceUSD)} / MT • Packaging: {item.selectedPackaging}
                          </p>
                        </div>

                        {/* Volume Adjuster */}
                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                          <div className="flex items-center gap-2">
                            <label className="text-xs font-semibold text-gray-600">Volume:</label>
                            <input
                              type="number"
                              min="1"
                              max="10000"
                              value={item.volume}
                              onChange={(e) =>
                                updateRFQItem(item.productId, { volume: Math.max(1, Number(e.target.value)) })
                              }
                              className="w-20 bg-white border border-gray-300 rounded-lg px-2.5 py-1 text-xs font-bold text-center"
                            />
                            <span className="text-xs font-bold text-gray-600">{item.unit}</span>
                          </div>

                          <div className="text-right min-w-[90px]">
                            {currentUser.role === 'Admin' ? (
                              <span className="text-xs font-extrabold text-[#1b4d27]">
                                {formatPrice(item.lineTotalUSD)}
                              </span>
                            ) : (
                              <span className="text-[11px] font-semibold text-[#2a6e3a] bg-[#f0f7eb] px-2 py-0.5 rounded border border-[#cbe1c3]">
                                Quoted by Admin
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromRFQ(item.productId)}
                            className="text-gray-400 hover:text-red-500 p-1.5 transition"
                            title="Remove commodity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Incoterms & Destination Port */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    2. Destination Seaport / Airport
                  </label>
                  <select
                    value={destinationPort}
                    onChange={(e) => setDestinationPort(e.target.value)}
                    className="w-full bg-[#f9fbf7] text-xs font-semibold text-[#172e18] px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
                  >
                    {MAJOR_PORTS.map((p) => (
                      <option key={p.name} value={p.name}>
                        {p.name} ({p.region} • ~{p.oceanTransitDays} Days)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    3. Standard Incoterm (Incoterms 2020)
                  </label>
                  <select
                    value={incoterm}
                    onChange={(e) => setIncoterm(e.target.value as IncotermType)}
                    className="w-full bg-[#f9fbf7] text-xs font-semibold text-[#172e18] px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
                  >
                    <option value="CIF">CIF — Cost, Insurance &amp; Freight to Destination Port (Recommended)</option>
                    <option value="CFR">CFR — Cost &amp; Freight to Destination Port (Buyer insures)</option>
                    <option value="FOB">FOB — Free On Board Origin Port (Nhava Sheva / Cochin / Mundra)</option>
                    <option value="EXW">EXW — Ex-Works Factory Gate / Processing Yard</option>
                    <option value="DAP">DAP — Delivered at Destination Terminal / Warehouse</option>
                  </select>
                </div>
              </div>

              {/* Buyer Contact Information */}
              <div className="pt-2 border-t border-gray-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1b4d27] mb-3">
                  4. International Buyer &amp; Consignee Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Contact Name</label>
                    <input
                      type="text"
                      required
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full bg-[#f9fbf7] text-xs px-3 py-2 rounded-xl border border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Corporate Entity</label>
                    <input
                      type="text"
                      required
                      value={buyerCompany}
                      onChange={(e) => setBuyerCompany(e.target.value)}
                      className="w-full bg-[#f9fbf7] text-xs px-3 py-2 rounded-xl border border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Official Email</label>
                    <input
                      type="email"
                      required
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      className="w-full bg-[#f9fbf7] text-xs px-3 py-2 rounded-xl border border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Phone / WhatsApp</label>
                    <input
                      type="text"
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      className="w-full bg-[#f9fbf7] text-xs px-3 py-2 rounded-xl border border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Country of Import</label>
                    <input
                      type="text"
                      value={buyerCountry}
                      onChange={(e) => setBuyerCountry(e.target.value)}
                      className="w-full bg-[#f9fbf7] text-xs px-3 py-2 rounded-xl border border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Preferred Payment Term</label>
                    <select
                      value={paymentTerms}
                      onChange={(e) => setPaymentTerms(e.target.value)}
                      className="w-full bg-[#f9fbf7] text-xs px-3 py-2 rounded-xl border border-gray-300"
                    >
                      <option>30% Advance T/T, 70% against B/L copy</option>
                      <option>100% Irrevocable Confirmed L/C at Sight</option>
                      <option>T/T 20% Deposit, 80% Mate's Receipt</option>
                      <option>CAD (Cash Against Documents)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Cost Calculation Summary Box */}
              <div className="bg-[#f0f7eb] rounded-2xl p-5 border border-[#cbe1c3]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1b4d27] mb-3">
                  Quotation Specifications &amp; Tariff Protocol
                </h4>
                {currentUser.role === 'Admin' ? (
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-gray-700">
                      <span>Base Commodity Total ({totalTonnage} MT):</span>
                      <span className="font-semibold">{formatPrice(subtotalUSD)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Ocean Container Freight ({incoterm}):</span>
                      <span className="font-semibold">{formatPrice(freightCostUSD)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Marine Insurance (ICC A All-Risks):</span>
                      <span className="font-semibold">{formatPrice(insuranceCostUSD)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>SGS Pre-Shipment Quality Inspection:</span>
                      <span className="font-semibold">{formatPrice(inspectionFeeUSD)}</span>
                    </div>
                    {discountUSD > 0 && (
                      <div className="flex justify-between text-[#2a6e3a] font-bold">
                        <span>Volume Incentive Discount:</span>
                        <span>-{formatPrice(discountUSD)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-extrabold text-[#1b4d27] pt-2 border-t border-[#cbe1c3]">
                      <span>Admin Authorized Total ({incoterm}):</span>
                      <span className="text-base text-[#2a6e3a]">{formatPrice(totalUSD)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5 text-xs text-gray-700">
                    <div className="flex justify-between border-b border-[#dcebd7] pb-1.5">
                      <span className="text-gray-600">Total Commodity Volume:</span>
                      <span className="font-bold text-[#1b4d27]">{totalTonnage} Metric Tons ({rfqItems.length} Commodities)</span>
                    </div>
                    <div className="flex justify-between border-b border-[#dcebd7] pb-1.5">
                      <span className="text-gray-600">Delivery Destination &amp; Terms:</span>
                      <span className="font-bold text-[#1b4d27]">{destinationPort} • {incoterm}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#dcebd7] pb-1.5">
                      <span className="text-gray-600">Surveyor &amp; Pre-Shipment Inspection:</span>
                      <span className="font-bold text-[#2a6e3a]">SGS / Bureau Veritas Certified Analysis Included</span>
                    </div>
                    <div className="bg-white/80 p-3 rounded-xl border border-[#cbe1c3] text-[11px] leading-relaxed text-gray-600 mt-2">
                      <strong className="text-[#1b4d27] block mb-0.5">Admin Tariff Notice:</strong>
                      Export prices are customized based on international spot indices, ocean carrier freight tariffs, and bulk volume. Official FOB/CIF unit pricing and Proforma will be assigned and issued directly by the <strong>Admin Trade Desk</strong> upon review.
                    </div>
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal('none')}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs px-4 py-2.5 rounded-xl transition text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || rfqItems.length === 0}
                  className="flex items-center justify-center gap-2 bg-[#2a6e3a] hover:bg-[#1b4d27] disabled:opacity-50 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition cursor-pointer text-center"
                >
                  <FileSpreadsheet className="w-4 h-4 text-[#f5b342]" />
                  <span>
                    {isSubmitting
                      ? 'Transmitting RFQ...'
                      : currentUser.role === 'Admin'
                      ? 'Authorize & Issue Proforma Quote'
                      : 'Submit RFQ for Admin Pricing'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
