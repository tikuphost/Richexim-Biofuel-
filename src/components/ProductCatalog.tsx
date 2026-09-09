import React, { useState, useMemo } from 'react';
import {
  Flame,
  Droplets,
  Package,
  Layers,
  Search,
  Filter,
  ArrowRight,
  Plus,
  CheckCircle2,
  FileText,
  SlidersHorizontal,
  Info,
  Sparkles,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CommodityProduct } from '../types';

export const ProductCatalog: React.FC = () => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    formatPrice,
    addToRFQ,
    setSelectedProduct,
    setActiveModal,
    currentUser
  } = useApp();

  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [minCalorific, setMinCalorific] = useState<number>(0);
  const [maxMoistureFilter, setMaxMoistureFilter] = useState<string>('All');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(query);
        const matchCode = p.code.toLowerCase().includes(query);
        const matchHs = p.hsCode.toLowerCase().includes(query);
        const matchDesc = p.description.toLowerCase().includes(query);
        const matchApp = p.applications.some((app) => app.toLowerCase().includes(query));
        if (!matchName && !matchCode && !matchHs && !matchDesc && !matchApp) {
          return false;
        }
      }

      // Grade filter
      if (selectedGrade !== 'All' && p.gradeTier !== selectedGrade) {
        return false;
      }

      // Min calorific filter
      if (minCalorific > 0 && p.calorificMax < minCalorific && p.calorificMax > 0) {
        return false;
      }

      // Max moisture filter
      if (maxMoistureFilter === 'under8' && !p.moisture.includes('< 8') && !p.moisture.includes('< 6') && !p.moisture.includes('< 5')) {
        return false;
      }
      if (maxMoistureFilter === 'under10' && p.moisture.includes('15%') && !p.moisture.includes('< 10')) {
        return false;
      }

      return true;
    });
  }, [products, selectedCategory, searchQuery, selectedGrade, minCalorific, maxMoistureFilter]);

  return (
    <section id="products" className="py-10 sm:py-16 bg-[#f9fbf7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#2a6e3a] uppercase tracking-wider bg-[#e8f3e2] px-3 py-1 rounded-full mb-3">
              <Package className="w-3.5 h-3.5" />
              <span>International Commodity Catalog</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#1b4d27] tracking-tight">
              Export-Grade Biofuels &amp; Carbon Minerals
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-2 max-w-2xl">
              Strictly laboratory audited for calorific yield, moisture tolerances, and low ash formation. Bulk FCL and breakbulk export delivery worldwide.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className="flex items-center gap-2 border border-[#cbe1c3] bg-white hover:bg-[#f4f7ee] text-[#1b4d27] font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-2xs transition cursor-pointer self-start md:self-auto"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#2a6e3a]" />
            <span>Faceted Filters</span>
            {(selectedGrade !== 'All' || minCalorific > 0 || maxMoistureFilter !== 'All') && (
              <span className="w-2 h-2 rounded-full bg-[#f5b342]" />
            )}
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-[#1b4d27] text-white shadow-xs'
                : 'bg-white text-gray-700 hover:bg-[#eaf3e4] border border-[#e3ede0]'
            }`}
          >
            All Products ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.name)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                selectedCategory === cat.name
                  ? 'bg-[#1b4d27] text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-[#eaf3e4] border border-[#e3ede0]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Faceted Filter Drawer / Panel */}
        {isFilterPanelOpen && (
          <div className="bg-white rounded-2xl p-5 border border-[#e3ede0] shadow-md mb-8 animate-in fade-in-50">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1b4d27] flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-[#2a6e3a]" />
                Technical Specification Filters
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedGrade('All');
                  setMinCalorific(0);
                  setMaxMoistureFilter('All');
                }}
                className="text-xs text-gray-500 hover:text-[#2a6e3a] font-medium"
              >
                Reset All Filters
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Grade Tier Filter */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Quality Grade Tier</label>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Export Grade A+', 'Industrial Premium', 'Standard Processed'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setSelectedGrade(g)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                        selectedGrade === g
                          ? 'bg-[#eaf3e4] border-[#2a6e3a] text-[#1b4d27] font-bold'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Minimum Calorific Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-700">Min Calorific Energy</label>
                  <span className="text-xs font-bold text-[#2a6e3a]">
                    {minCalorific > 0 ? `${minCalorific} kcal/kg+` : 'Any'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="7500"
                  step="500"
                  value={minCalorific}
                  onChange={(e) => setMinCalorific(Number(e.target.value))}
                  className="w-full accent-[#2a6e3a] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>3,500 kcal</span>
                  <span>5,000 kcal</span>
                  <span>7,500 kcal+</span>
                </div>
              </div>

              {/* Moisture Tolerance */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Moisture Limit</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Any Moisture', val: 'All' },
                    { label: '< 8% (Ultra Dry)', val: 'under8' },
                    { label: '< 10% (Industrial)', val: 'under10' }
                  ].map((m) => (
                    <button
                      key={m.val}
                      type="button"
                      onClick={() => setMaxMoistureFilter(m.val)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                        maxMoistureFilter === m.val
                          ? 'bg-[#eaf3e4] border-[#2a6e3a] text-[#1b4d27] font-bold'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-gray-500">
          <span>
            Showing <strong>{filteredProducts.length}</strong> of {products.length} commodities
          </span>
          {searchQuery && (
            <span>
              Filtered by keyword: <strong className="text-[#1b4d27]">"{searchQuery}"</strong>
            </span>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#e3ede0] shadow-xs">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800">No commodities match your current criteria</h3>
            <p className="text-xs text-gray-500 mt-1">
              Try clearing filters or adjusting your minimum calorific parameter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setSelectedGrade('All');
                setMinCalorific(0);
                setMaxMoistureFilter('All');
              }}
              className="mt-4 bg-[#2a6e3a] text-white text-xs font-bold px-4 py-2 rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-[#e3ede0] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
              >
                {/* Product Image Banner */}
                <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-gray-100">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/20">
                      HS: {product.hsCode}
                    </span>
                    <span className="bg-[#1b4d27]/90 text-[#f5b342] text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {product.code}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs ${
                        product.gradeTier === 'Export Grade A+'
                          ? 'bg-[#f5b342] text-[#172e18]'
                          : product.gradeTier === 'Industrial Premium'
                          ? 'bg-[#2a6e3a] text-white'
                          : 'bg-white/90 text-gray-800'
                      }`}
                    >
                      {product.gradeTier}
                    </span>
                  </div>

                  {/* Title over image bottom */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-[11px] font-semibold text-[#f5b342] uppercase tracking-wider block">
                      {product.category}
                    </span>
                    <h3 className="font-heading text-base sm:text-lg font-bold text-white line-clamp-1">
                      {product.name}
                    </h3>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Key Technical Metric Chips */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-[#f9fbf7] rounded-xl p-2.5 border border-[#e8f0e5]">
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                          <Flame className="w-3.5 h-3.5 text-[#e09f30]" />
                          <span>Calorific Value</span>
                        </div>
                        <div className="text-xs font-extrabold text-[#1b4d27] mt-0.5">
                          {product.calorificValue}
                        </div>
                      </div>

                      <div className="bg-[#f9fbf7] rounded-xl p-2.5 border border-[#e8f0e5]">
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                          <Droplets className="w-3.5 h-3.5 text-blue-500" />
                          <span>Moisture Content</span>
                        </div>
                        <div className="text-xs font-extrabold text-[#1b4d27] mt-0.5">
                          {product.moisture}
                        </div>
                      </div>
                    </div>

                    {/* Secondary Specs: Ash & Bulk Density */}
                    <div className="flex items-center justify-between text-xs text-gray-600 border-b border-gray-100 pb-3 mb-3">
                      <span>
                        Ash Content: <strong className="text-[#172e18]">{product.ashContent}</strong>
                      </span>
                      <span>
                        Density: <strong className="text-[#172e18]">{product.bulkDensity}</strong>
                      </span>
                    </div>

                    {/* Description Excerpt */}
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
                      {product.description}
                    </p>
                  </div>

                  {/* Pricing & Actions */}
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        {currentUser.role === 'Admin' ? (
                          <>
                            <span className="text-[10px] uppercase font-bold text-amber-700 block">
                              Admin FOB Tariff (Ref)
                            </span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-base font-extrabold text-[#1b4d27]">
                                {formatPrice(product.basePriceUSD)}
                              </span>
                              <span className="text-[11px] font-semibold text-gray-500">/ MT</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <span className="text-[10px] uppercase font-bold text-gray-400 block">
                              Commercial Tariff
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[11px] font-bold text-[#1b4d27] bg-[#f0f7eb] text-[#2a6e3a] px-2 py-0.5 rounded-md border border-[#cbe1c3]">
                                Quoted by Admin on RFQ
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                      <span className="text-[11px] font-semibold text-[#2a6e3a] bg-[#e8f3e2] px-2 py-0.5 rounded-md">
                        MOQ: {product.minOrderQty} MT
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProduct(product);
                          setActiveModal('product-detail');
                        }}
                        className="flex items-center justify-center gap-1.5 border border-[#cbe1c3] hover:border-[#2a6e3a] bg-white hover:bg-[#f4f7ee] text-[#1b4d27] text-xs font-semibold py-2.5 rounded-xl transition cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Data Sheet</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => addToRFQ(product)}
                        className="flex items-center justify-center gap-1.5 bg-[#2a6e3a] hover:bg-[#1b4d27] text-white text-xs font-bold py-2.5 rounded-xl shadow-xs transition cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add to RFQ</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
