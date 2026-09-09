import React, { useState } from 'react';
import {
  X,
  FileText,
  Flame,
  Droplets,
  Package,
  Layers,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProductDetailModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    selectedProduct,
    addToRFQ,
    formatPrice,
    currentUser
  } = useApp();

  const [quantity, setQuantity] = useState<number>(25);
  const [unit, setUnit] = useState<'MT' | 'Bags' | 'Containers'>('MT');

  if (activeModal !== 'product-detail' || !selectedProduct) return null;

  const product = selectedProduct;

  const handleAddAndClose = () => {
    addToRFQ(product, quantity, unit);
    setActiveModal('none');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-3xl max-h-[94vh] sm:max-h-[90vh] flex flex-col shadow-2xl border border-[#e3ede0] overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#1b4d27] text-white p-4 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#f5b342] text-[#172e18] flex items-center justify-center font-bold shrink-0">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#f5b342] truncate block">
                Technical Data Sheet (TDS) • HS {product.hsCode}
              </span>
              <h3 className="font-heading text-lg sm:text-xl font-bold truncate">{product.name}</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveModal('none')}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1 space-y-5 sm:space-y-6 text-xs sm:text-sm">
          {/* Main overview banner */}
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-full sm:w-48 h-40 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap gap-2">
                <span className="bg-[#e8f3e2] text-[#1b4d27] font-bold text-xs px-2.5 py-0.5 rounded-full">
                  {product.gradeTier}
                </span>
                <span className="bg-gray-100 text-gray-700 font-semibold text-xs px-2.5 py-0.5 rounded-full">
                  {product.category}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed text-xs sm:text-sm">
                {product.description}
              </p>
              <div className="text-xs pt-1">
                {currentUser.role === 'Admin' ? (
                  <div className="text-amber-800 font-medium">
                    Admin FOB Benchmark Tariff: <strong className="text-[#1b4d27] font-extrabold text-sm">{formatPrice(product.basePriceUSD)}</strong> / MT (FOB Origin)
                  </div>
                ) : (
                  <div className="flex flex-col gap-1 bg-[#f0f7eb] p-2.5 rounded-xl border border-[#cbe1c3]">
                    <div className="flex items-center gap-1.5 font-bold text-[#1b4d27]">
                      <Info className="w-3.5 h-3.5 text-[#2a6e3a]" />
                      <span>Commercial Pricing: Quoted Directly by Admin on RFQ</span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-normal">
                      Firm FOB &amp; CIF export price tariffs are customized and issued by the Admin / Commercial Desk according to vessel stowage windows, packing choices, and destination port.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Technical Specifications Matrix */}
          <div>
            <h4 className="font-heading text-base font-bold text-[#1b4d27] mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#2a6e3a]" />
              <span>Laboratory Proximate &amp; Ultimate Analysis</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#f9fbf7] p-3 rounded-2xl border border-[#e3ede0]">
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Gross Calorific</span>
                <span className="text-xs font-extrabold text-[#e09f30] mt-0.5 block">{product.calorificValue}</span>
              </div>

              <div className="bg-[#f9fbf7] p-3 rounded-2xl border border-[#e3ede0]">
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Moisture Content</span>
                <span className="text-xs font-extrabold text-blue-600 mt-0.5 block">{product.moisture}</span>
              </div>

              <div className="bg-[#f9fbf7] p-3 rounded-2xl border border-[#e3ede0]">
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Total Ash Content</span>
                <span className="text-xs font-extrabold text-gray-800 mt-0.5 block">{product.ashContent}</span>
              </div>

              <div className="bg-[#f9fbf7] p-3 rounded-2xl border border-[#e3ede0]">
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Fixed Carbon</span>
                <span className="text-xs font-extrabold text-[#1b4d27] mt-0.5 block">{product.fixedCarbon}</span>
              </div>

              <div className="bg-[#f9fbf7] p-3 rounded-2xl border border-[#e3ede0]">
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Volatile Matter</span>
                <span className="text-xs font-semibold text-gray-800 mt-0.5 block">{product.volatileMatter}</span>
              </div>

              <div className="bg-[#f9fbf7] p-3 rounded-2xl border border-[#e3ede0]">
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Bulk Density</span>
                <span className="text-xs font-semibold text-gray-800 mt-0.5 block">{product.bulkDensity}</span>
              </div>

              <div className="bg-[#f9fbf7] p-3 rounded-2xl border border-[#e3ede0]">
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Ash Fusion Temp</span>
                <span className="text-xs font-semibold text-[#2a6e3a] mt-0.5 block">{product.ashFusionTemp}</span>
              </div>

              <div className="bg-[#f9fbf7] p-3 rounded-2xl border border-[#e3ede0]">
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Sulfur &amp; Chlorine</span>
                <span className="text-xs font-semibold text-gray-800 mt-0.5 block">S: {product.sulfur} • Cl: {product.chlorine}</span>
              </div>
            </div>
          </div>

          {/* Recommended Boiler Applications */}
          <div>
            <h4 className="font-heading text-base font-bold text-[#1b4d27] mb-2">
              Recommended Boiler &amp; Industrial Applications
            </h4>
            <div className="flex flex-wrap gap-2">
              {product.applications.map((app, i) => (
                <span key={i} className="bg-[#f0f7eb] text-[#1b4d27] text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#cbe1c3]">
                  {app}
                </span>
              ))}
            </div>
          </div>

          {/* Packaging Options */}
          <div>
            <h4 className="font-heading text-base font-bold text-[#1b4d27] mb-2">
              Export Packaging Specifications
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              {product.packagingOptions.map((pkg, i) => (
                <div key={i} className="bg-[#f9fbf7] p-2.5 rounded-xl border border-gray-200 flex items-center gap-2">
                  <Package className="w-3.5 h-3.5 text-[#2a6e3a] shrink-0" />
                  <span className="text-gray-800 font-medium">{pkg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer with Quick RFQ volume add */}
        <div className="p-4 sm:p-6 bg-[#f9fbf7] border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center justify-between sm:justify-start gap-2">
            <span className="text-xs font-bold text-gray-700">Order Quantity:</span>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min="1"
                max="5000"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-18 sm:w-20 bg-white border border-gray-300 rounded-lg px-2 sm:px-2.5 py-1.5 text-xs font-bold text-center"
              />
              <select
                value={unit}
                onChange={(e: any) => setUnit(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-2 py-1.5 text-xs font-semibold"
              >
                <option value="MT">Metric Tons (MT)</option>
                <option value="Containers">Containers (FCL)</option>
                <option value="Bags">Jumbo FIBC Bags</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setActiveModal('none')}
              className="flex-1 sm:flex-none text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs px-4 py-2.5 rounded-xl transition"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleAddAndClose}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#2a6e3a] hover:bg-[#1b4d27] text-white font-bold text-xs sm:text-sm px-5 sm:px-6 py-2.5 rounded-xl shadow-xs cursor-pointer transition text-center"
            >
              <Plus className="w-4 h-4 text-[#f5b342]" />
              <span>Add to RFQ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
