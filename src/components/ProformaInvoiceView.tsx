import React from 'react';
import {
  Printer,
  X,
  Building2,
  ShieldCheck,
  Download,
  Calendar,
  CreditCard,
  Ship,
  FileCheck2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProformaInvoiceView: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    selectedQuoteForView,
    formatPrice,
    currency
  } = useApp();

  if (activeModal !== 'proforma-view' || !selectedQuoteForView) return null;

  const quote = selectedQuoteForView;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-4xl max-h-[95vh] sm:max-h-[94vh] flex flex-col shadow-2xl overflow-hidden border border-[#e3ede0]">
        {/* Modal Top Bar */}
        <div className="bg-[#1b4d27] text-white px-4 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between no-print gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#f5b342] shrink-0" />
            <span className="font-heading font-bold text-xs sm:text-base truncate">
              Proforma Invoice — {quote.quoteNumber}
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1 sm:gap-1.5 bg-[#f5b342] hover:bg-[#e09f30] text-[#172e18] font-bold text-[11px] sm:text-xs px-2.5 sm:px-3.5 py-1.5 rounded-xl shadow-xs transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Print / PDF</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveModal('none')}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Printable Proforma Document Body */}
        <div id="printable-proforma" className="p-4 sm:p-8 md:p-10 overflow-y-auto flex-1 bg-white text-[#172e18] space-y-5 sm:space-y-6">
          {/* Corporate Letterhead */}
          <div className="border-b-2 border-[#1b4d27] pb-5 sm:pb-6 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-lg sm:text-2xl font-black text-[#1b4d27] tracking-tight">
                  RICH-MOUNT METALLIC &amp; ALLIED EXPORTERS PVT. LTD.
                </span>
              </div>
              <p className="text-[11px] sm:text-xs font-bold text-[#3e8e50] tracking-wide uppercase mt-0.5">
                Division: Richmount Exim • Green Fuel &amp; Biomass Subsidiary of the Richexim Group
              </p>
              <p className="text-[11px] sm:text-xs text-gray-600 mt-2 max-w-md leading-relaxed">
                Registered Export Hub: Door No. 14/280, Commercial Port Corridor, Cochin / Mumbai, India<br />
                IEC: 0314059812 • GSTIN: 32AABCR8841M1ZX • APEDA: RCMC/DEL/2022/9902<br />
                Email: info@richexim.com • richmount.pvt@outlook.com • Web: richexim.com
              </p>
            </div>

            <div className="text-left sm:text-right sm:self-center">
              <span className="bg-[#1b4d27] text-white font-heading font-bold text-[11px] sm:text-xs uppercase tracking-widest px-3 sm:px-4 py-1.5 rounded-md inline-block">
                COMMERCIAL PROFORMA INVOICE
              </span>
              <div className="mt-2 text-[11px] sm:text-xs text-gray-600 space-y-0.5">
                <p>
                  <strong>Quote No:</strong> {quote.quoteNumber}
                </p>
                <p>
                  <strong>Date:</strong> {quote.createdAt ? new Date(quote.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                </p>
                <p>
                  <strong>Valid Until:</strong> {quote.validUntil}
                </p>
              </div>
            </div>
          </div>

          {/* Consignee & Shipping Particulars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#f9fbf7] p-5 rounded-2xl border border-[#e3ede0] text-xs">
            <div>
              <span className="font-bold text-[#1b4d27] uppercase tracking-wider block mb-1">
                Consignee / International Buyer:
              </span>
              <p className="font-extrabold text-sm text-gray-900">{quote.buyerCompany}</p>
              <p className="text-gray-700">Attn: {quote.buyerName}</p>
              <p className="text-gray-600">{quote.buyerEmail} • {quote.buyerPhone}</p>
              <p className="text-gray-600 font-semibold">{quote.buyerCountry}</p>
            </div>

            <div className="space-y-1 sm:border-l sm:border-gray-200 sm:pl-6">
              <span className="font-bold text-[#1b4d27] uppercase tracking-wider block mb-1">
                Shipment &amp; Trade Terms:
              </span>
              <p>
                <strong>Port of Loading:</strong> Nhava Sheva (JNPT) / Cochin Port, India
              </p>
              <p>
                <strong>Destination Port:</strong> {quote.destinationPort}
              </p>
              <p>
                <strong>Incoterm:</strong> <span className="text-[#2a6e3a] font-bold">{quote.incoterm} (Incoterms 2020)</span>
              </p>
              <p>
                <strong>Payment Terms:</strong> {quote.paymentTerms}
              </p>
              <p>
                <strong>Estimated Ocean Transit:</strong> {quote.estimatedDeliveryWeeks} Weeks
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-[#1b4d27] text-white">
                  <th className="py-2.5 px-3 rounded-l-lg">Item</th>
                  <th className="py-2.5 px-3">HS Code</th>
                  <th className="py-2.5 px-3">Description &amp; Specifications</th>
                  <th className="py-2.5 px-3">Packaging</th>
                  <th className="py-2.5 px-3 text-right">Volume</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 rounded-r-lg text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {quote.items.map((item, index) => (
                  <tr key={index} className="hover:bg-[#f9fbf7]">
                    <td className="py-3 px-3 font-bold text-gray-500">{index + 1}</td>
                    <td className="py-3 px-3 font-mono font-bold text-gray-700">{item.hsCode}</td>
                    <td className="py-3 px-3">
                      <strong className="text-[#1b4d27] block">{item.productName}</strong>
                      <span className="text-[11px] text-gray-500">
                        Export Grade • Moisture &lt; 8% • Low Ash Formulation
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-600">{item.selectedPackaging}</td>
                    <td className="py-3 px-3 text-right font-bold">
                      {item.volume} {item.unit}
                    </td>
                    <td className="py-3 px-3 text-right font-semibold">
                      {item.unitPriceUSD > 0 ? (
                        formatPrice(item.unitPriceUSD)
                      ) : (
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold">
                          Pending Admin Price
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-[#1b4d27]">
                      {item.lineTotalUSD > 0 ? (
                        formatPrice(item.lineTotalUSD)
                      ) : (
                        <span className="text-[10px] text-gray-500 italic">
                          To be assigned
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculation Breakdown & Banking */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 border-t border-gray-200">
            {/* Banking Coordinates */}
            <div className="md:col-span-7 bg-[#f9fbf7] p-5 rounded-2xl border border-[#e3ede0] text-[11px] space-y-1.5">
              <span className="font-bold text-[#1b4d27] uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#2a6e3a]" />
                Official International Bank Wire Details:
              </span>
              <p><strong>Beneficiary Account:</strong> RICH-MOUNT METALLIC &amp; ALLIED EXPORTERS PVT LTD</p>
              <p><strong>Bank:</strong> State Bank of India (Overseas International Branch), India</p>
              <p><strong>Account Number (USD):</strong> 4088912049921</p>
              <p><strong>SWIFT / BIC Code:</strong> SBININBB188</p>
              <p><strong>IFSC Code:</strong> SBIN0000845</p>
              <p className="text-gray-500 text-[10px] mt-2 italic">
                * Wire transfers must reference Quote No {quote.quoteNumber}.
              </p>
            </div>

            {/* Totals Box */}
            <div className="md:col-span-5 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Commodity Subtotal:</span>
                <span className="font-semibold">{formatPrice(quote.subtotalUSD)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Ocean Freight ({quote.incoterm}):</span>
                <span className="font-semibold">{formatPrice(quote.freightCostUSD)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Marine Insurance (ICC A):</span>
                <span className="font-semibold">{formatPrice(quote.insuranceCostUSD)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>SGS Pre-Shipment Inspection:</span>
                <span className="font-semibold">{formatPrice(quote.inspectionFeeUSD)}</span>
              </div>
              {quote.discountUSD > 0 && (
                <div className="flex justify-between text-[#2a6e3a] font-bold">
                  <span>Volume Incentive Discount:</span>
                  <span>-{formatPrice(quote.discountUSD)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-[#1b4d27] pt-2 border-t-2 border-[#1b4d27]">
                <span>Grand Total ({quote.incoterm}):</span>
                {quote.totalUSD > 0 ? (
                  <span className="text-lg text-[#2a6e3a]">{formatPrice(quote.totalUSD)}</span>
                ) : (
                  <span className="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                    Pending Admin Pricing Review
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Legal Terms & Authorized Corporate Signatory */}
          <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs text-gray-600">
            <div className="max-w-md space-y-1">
              <p className="font-bold text-[#1b4d27]">General Commercial Conditions:</p>
              <p className="text-[11px] leading-relaxed">
                1. Goods dispatched strictly conforming to agreed Certificate of Analysis (COA).<br />
                2. Phytosanitary fumigation and ISPM-15 heat-treated wood pallets included.<br />
                3. Jurisdiction: Subject to International Arbitration Chamber rules under English &amp; Indian Trade Law.
              </p>
            </div>

            <div className="text-center sm:text-right">
              <div className="inline-block border-b-2 border-gray-400 pb-1 mb-1 min-w-[180px]">
                <span className="font-heading font-bold text-sm text-[#1b4d27]">
                  Vikramaditya Rao
                </span>
              </div>
              <p className="text-[11px] font-bold text-gray-800">Authorized Export Signatory</p>
              <p className="text-[10px] text-gray-500">Richexim Group Corporate Trade Desk</p>
              <div className="inline-flex items-center gap-1 text-[10px] text-[#2a6e3a] font-bold bg-[#e8f3e2] px-2 py-0.5 rounded-full mt-1">
                <ShieldCheck className="w-3 h-3" />
                <span>OFFICIALLY VERIFIED SEAL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
