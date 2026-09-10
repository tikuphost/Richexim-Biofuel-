import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Package,
  DollarSign,
  Layers,
  Sparkles,
  Flame,
  ArrowUpDown,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  FileText,
  Lock,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CommodityProduct } from '../../types';

export const ProductManagementTab: React.FC = () => {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductPrice,
    updateProductStock,
    currentUser,
    switchRole
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'general' | 'commercial' | 'specs' | 'packaging'>('general');
  const [editingProduct, setEditingProduct] = useState<CommodityProduct | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [specPreviewProduct, setSpecPreviewProduct] = useState<CommodityProduct | null>(null);

  // Form state
  const initialFormState: Partial<CommodityProduct> = {
    name: '',
    category: categories[0]?.name || 'Biomass Briquettes & Pellets',
    gradeTier: 'Export Grade A+',
    code: '',
    hsCode: '4401.31.00',
    basePriceUSD: 165,
    minOrderQty: 25,
    calorificValue: '4,200 - 4,500 kcal/kg',
    calorificMin: 4200,
    calorificMax: 4500,
    moisture: '< 8%',
    ashContent: '< 3%',
    bulkDensity: '650 kg/m³',
    fixedCarbon: '18 - 22%',
    volatileMatter: '72 - 76%',
    particleSize: '8mm or 90mm',
    harvestSeason: 'Year-Round Availability',
    origin: 'Gujarat & Maharashtra, India',
    packagingOptions: ['25kg HDPE Bags', '50kg Woven Sacks', '1,000kg Jumbo Bags', 'Loose Bulk'],
    applications: ['Industrial Boilers', 'Cement Rotary Kilns', 'Power Generation', 'Process Heating'],
    description: '',
    inStock: true,
    featured: false,
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80'
  };

  const [formData, setFormData] = useState<Partial<CommodityProduct>>(initialFormState);
  const [packagingInput, setPackagingInput] = useState(initialFormState.packagingOptions?.join(', ') || '');
  const [applicationsInput, setApplicationsInput] = useState(initialFormState.applications?.join(', ') || '');
  const [quickPriceMap, setQuickPriceMap] = useState<Record<string, number>>({});

  // Strict Admin Gate: If currentUser is not Admin, enforce strict access prevention
  if (currentUser.role !== 'Admin') {
    return (
      <div className="bg-white rounded-3xl p-8 border border-red-200 shadow-sm text-center max-w-lg mx-auto space-y-4 my-8">
        <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <div>
          <h3 className="font-heading font-extrabold text-lg text-gray-900">
            Access Restricted: Administrator Only
          </h3>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
            The Product &amp; Specification Catalog Management console is strictly restricted to administrative personnel.
            Your current logged-in role is <span className="font-bold text-gray-800">{currentUser.role}</span>.
          </p>
        </div>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => switchRole('Admin')}
            className="bg-[#1b4d27] hover:bg-[#2a6e3a] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
          >
            Authenticate as Administrator
          </button>
        </div>
      </div>
    );
  }

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.hsCode || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.origin || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.calorificValue || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCat === 'all' || p.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const handleOpenAdd = () => {
    setFormData({ ...initialFormState, code: `RME-${Math.floor(100 + Math.random() * 900)}` });
    setPackagingInput(initialFormState.packagingOptions?.join(', ') || '');
    setApplicationsInput(initialFormState.applications?.join(', ') || '');
    setEditingProduct(null);
    setModalTab('general');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (p: CommodityProduct) => {
    setEditingProduct(p);
    setFormData({ ...p });
    setPackagingInput(p.packagingOptions?.join(', ') || '');
    setApplicationsInput(p.applications?.join(', ') || '');
    setModalTab('general');
    setIsAddModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    const packagingOptions = packagingInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const applications = applicationsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const productPayload: CommodityProduct = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: formData.name || '',
      category: formData.category || 'Biomass Briquettes & Pellets',
      gradeTier: formData.gradeTier || 'Export Grade A+',
      code: formData.code || `RME-${Math.floor(100 + Math.random() * 900)}`,
      hsCode: formData.hsCode || '4401.31.00',
      basePriceUSD: Number(formData.basePriceUSD) || 150,
      minOrderQty: Number(formData.minOrderQty) || 25,
      calorificValue: formData.calorificValue || '4,200 kcal/kg',
      calorificMin: Number(formData.calorificMin) || 4000,
      calorificMax: Number(formData.calorificMax) || 4500,
      moisture: formData.moisture || '< 8%',
      ashContent: formData.ashContent || '< 3%',
      bulkDensity: formData.bulkDensity || '650 kg/m³',
      fixedCarbon: formData.fixedCarbon || '18%',
      volatileMatter: formData.volatileMatter || '72%',
      particleSize: formData.particleSize || 'Standard',
      harvestSeason: formData.harvestSeason || 'Year-Round Availability',
      origin: formData.origin || 'India',
      packagingOptions: packagingOptions.length > 0 ? packagingOptions : ['25kg Bags', 'Jumbo Bags'],
      applications: applications.length > 0 ? applications : ['Industrial Boilers'],
      description: formData.description || '',
      inStock: formData.inStock ?? true,
      featured: formData.featured ?? false,
      imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80'
    };

    if (editingProduct) {
      await updateProduct(editingProduct.id, productPayload);
    } else {
      await addProduct(productPayload);
    }

    setIsAddModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    setDeleteConfirmId(null);
  };

  const handleQuickPriceSave = async (id: string) => {
    const newPrice = quickPriceMap[id];
    if (newPrice && newPrice > 0) {
      await updateProductPrice(id, newPrice);
      setQuickPriceMap((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Admin Authorization & Security Status Banner */}
      <div className="bg-[#f0f7eb] rounded-2xl p-4 border border-[#cbe1c3] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#1b4d27] text-[#f5b342] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-[#1b4d27] flex items-center gap-2">
              <span>Admin-Only Catalog Management Console</span>
              <span className="bg-[#2a6e3a] text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                Strict Access
              </span>
            </div>
            <p className="text-[11px] text-gray-600 mt-0.5">
              Authorized administrators can add new products, edit technical specifications, adjust pricing tariffs, or remove obsolete items.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="font-bold text-[#1b4d27] bg-white px-3 py-1.5 rounded-xl border border-[#cbe1c3]">
            {products.length} Commodities Active
          </span>
        </div>
      </div>

      {/* Action and Filter Header */}
      <div className="bg-white rounded-3xl p-5 border border-[#e3ede0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading font-extrabold text-lg text-[#172e18] flex items-center gap-2">
            <Package className="w-5 h-5 text-[#2a6e3a]" />
            Commodity Catalog &amp; Technical Specifications
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Full control over commodity classifications, laboratory assay values, pricing tariffs, and export packaging.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="bg-[#1b4d27] hover:bg-[#2a6e3a] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-xs shrink-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4 text-[#f5b342]" />
          <span>Add New Commodity</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search commodities by name, HS code, origin, or calorific value..."
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2a6e3a]"
          />
        </div>

        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="bg-white rounded-xl border border-gray-200 px-3 py-2.5 text-xs font-semibold text-gray-700 focus:outline-hidden focus:border-[#2a6e3a] cursor-pointer"
        >
          <option value="all">All Categories ({products.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-[#e3ede0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f9fbf7] text-gray-600 font-bold border-b border-[#e3ede0] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3.5">Commodity &amp; Spec</th>
                <th className="px-4 py-3.5">Category &amp; HS Code</th>
                <th className="px-4 py-3.5">FOB Base Price (USD/MT)</th>
                <th className="px-4 py-3.5">Stock &amp; Availability</th>
                <th className="px-4 py-3.5">MOQ</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((p) => {
                const isPriceDirty = quickPriceMap[p.id] !== undefined && quickPriceMap[p.id] !== p.basePriceUSD;
                return (
                  <tr key={p.id} className="hover:bg-[#fbfdf9] transition">
                    {/* Commodity Info */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-11 h-11 rounded-xl object-cover border border-gray-200 shrink-0 shadow-2xs"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="font-bold text-gray-900 flex items-center gap-1.5">
                            <span>{p.name}</span>
                            {p.featured && (
                              <span className="bg-[#fef9c3] text-[#854d0e] text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                                Featured
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-gray-500 flex items-center gap-2 mt-0.5">
                            <span className="font-semibold text-[#1b4d27] bg-[#f0f7eb] px-1.5 py-0.5 rounded border border-[#cbe1c3]">
                              {p.calorificValue}
                            </span>
                            <span>•</span>
                            <span className="text-gray-600">{p.gradeTier}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category & HS */}
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-gray-800">{p.category}</div>
                      <div className="text-[11px] text-gray-500 font-mono">HS: {p.hsCode}</div>
                    </td>

                    {/* Price & Quick Editor */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="relative w-28">
                          <span className="absolute left-2.5 top-2 text-gray-400 text-xs font-bold">$</span>
                          <input
                            type="number"
                            value={quickPriceMap[p.id] !== undefined ? quickPriceMap[p.id] : p.basePriceUSD}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              setQuickPriceMap((prev) => ({ ...prev, [p.id]: val }));
                            }}
                            className={`w-full pl-6 pr-2 py-1.5 rounded-lg border text-xs font-bold ${
                              isPriceDirty
                                ? 'border-[#2a6e3a] bg-[#f0f7eb] text-[#1b4d27]'
                                : 'border-gray-200 bg-white text-gray-900'
                            }`}
                          />
                        </div>
                        {isPriceDirty && (
                          <button
                            type="button"
                            onClick={() => handleQuickPriceSave(p.id)}
                            className="p-1.5 rounded-lg bg-[#2a6e3a] text-white hover:bg-[#1b4d27] transition cursor-pointer shadow-2xs"
                            title="Save new FOB tariff"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Stock & Active */}
                    <td className="px-4 py-3.5">
                      <button
                        type="button"
                        onClick={() => updateProductStock(p.id, !p.inStock ? 'In Stock' : 'Out of Stock')}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition flex items-center gap-1 ${
                          p.inStock
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200 border border-red-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${p.inStock ? 'bg-emerald-600' : 'bg-red-600'}`} />
                        <span>{p.inStock ? 'Ready for Export' : 'Out of Stock'}</span>
                      </button>
                    </td>

                    {/* MOQ */}
                    <td className="px-4 py-3.5 font-semibold text-gray-700">
                      {p.minOrderQty} MT
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSpecPreviewProduct(p)}
                          className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition cursor-pointer"
                          title="Quick View Specifications & Assay"
                        >
                          <Eye className="w-3.5 h-3.5 text-gray-600" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg bg-[#f0f7eb] hover:bg-[#e2efe0] text-[#1b4d27] transition cursor-pointer"
                          title="Edit commodity specifications"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(p.id)}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                          title="Remove product from catalog"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Specifications Preview Modal */}
      {specPreviewProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-gray-200 shadow-2xl overflow-hidden">
            <div className="bg-[#172e18] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-[#f5b342]" />
                <div>
                  <h4 className="font-heading font-extrabold text-base text-white">
                    {specPreviewProduct.name}
                  </h4>
                  <span className="text-[10px] text-white/70">
                    Technical Specifications &amp; Combustion Assay
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSpecPreviewProduct(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#f9fbf7] p-4 rounded-2xl border border-[#e3ede0]">
                <div>
                  <span className="text-gray-500 block text-[10px]">Gross Calorific Value</span>
                  <strong className="text-[#1b4d27] font-extrabold text-sm">
                    {specPreviewProduct.calorificValue}
                  </strong>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">Moisture Limit</span>
                  <strong className="text-gray-900">{specPreviewProduct.moisture}</strong>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">Ash Content</span>
                  <strong className="text-gray-900">{specPreviewProduct.ashContent}</strong>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">Bulk Density</span>
                  <strong className="text-gray-900">{specPreviewProduct.bulkDensity}</strong>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">Volatile Matter</span>
                  <strong className="text-gray-900">{specPreviewProduct.volatileMatter || '72 - 76%'}</strong>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">Fixed Carbon</span>
                  <strong className="text-gray-900">{specPreviewProduct.fixedCarbon || '18 - 22%'}</strong>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-gray-800 text-[11px] block">Logistics &amp; Packaging</span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-gray-500 block text-[10px]">Origin:</span>
                    <strong>{specPreviewProduct.origin}</strong>
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-gray-500 block text-[10px]">Harvest Season:</span>
                    <strong>{specPreviewProduct.harvestSeason}</strong>
                  </div>
                </div>

                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 text-[11px]">
                  <span className="text-gray-500 block text-[10px] mb-1">Packaging Options:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {specPreviewProduct.packagingOptions.map((pkg, idx) => (
                      <span key={idx} className="bg-white px-2 py-0.5 rounded-md border border-gray-200 text-gray-700">
                        {pkg}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 text-[11px]">
                  <span className="text-gray-500 block text-[10px] mb-1">Industrial Applications:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {specPreviewProduct.applications.map((app, idx) => (
                      <span key={idx} className="bg-[#f0f7eb] text-[#1b4d27] px-2 py-0.5 rounded-md border border-[#cbe1c3] font-medium">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    const p = specPreviewProduct;
                    setSpecPreviewProduct(null);
                    handleOpenEdit(p);
                  }}
                  className="bg-[#1b4d27] hover:bg-[#2a6e3a] text-white font-bold px-4 py-2 rounded-xl transition cursor-pointer text-xs flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#f5b342]" />
                  <span>Edit Specifications</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSpecPreviewProduct(null)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold cursor-pointer transition text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-gray-200 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-6 h-6" />
              <h4 className="font-heading font-extrabold text-base text-gray-900">Remove Product</h4>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Are you sure you want to permanently remove this commodity from the catalog? This will remove it from the public catalog, RFQ calculator, and NVMe SQLite database.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition cursor-pointer shadow-xs"
              >
                Yes, Remove Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Commodity Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-gray-200 shadow-2xl overflow-hidden my-8">
            <div className="bg-[#172e18] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Package className="w-5 h-5 text-[#f5b342]" />
                <div>
                  <h3 className="font-heading font-extrabold text-base text-white">
                    {editingProduct ? 'Edit Commodity Specifications' : 'Add New Export Commodity'}
                  </h3>
                  <p className="text-[10px] text-white/70">
                    Configure specifications, technical data, and commercial tariffs
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Step / Tab Navigator */}
            <div className="flex items-center border-b border-gray-200 bg-[#f9fbf7] px-6 text-xs font-bold overflow-x-auto">
              {[
                { id: 'general', label: '1. General & Classification' },
                { id: 'commercial', label: '2. Pricing & Commercials' },
                { id: 'specs', label: '3. Technical Specs & Assay' },
                { id: 'packaging', label: '4. Packaging & Logistics' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setModalTab(tab.id as any)}
                  className={`py-3 px-3.5 border-b-2 transition cursor-pointer whitespace-nowrap ${
                    modalTab === tab.id
                      ? 'border-[#1b4d27] text-[#1b4d27] bg-white'
                      : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {/* TAB 1: General & Classification */}
              {modalTab === 'general' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Commodity Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Mustard Husk Biomass Pellets (8mm)"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Category *</label>
                      <select
                        value={formData.category || ''}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden cursor-pointer"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Grade Tier</label>
                      <select
                        value={formData.gradeTier || 'Export Grade A+'}
                        onChange={(e) => setFormData({ ...formData, gradeTier: e.target.value as any })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden"
                      >
                        <option value="Export Grade A+">Export Grade A+</option>
                        <option value="Industrial Premium">Industrial Premium</option>
                        <option value="Standard Processed">Standard Processed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1">HS Code</label>
                      <input
                        type="text"
                        value={formData.hsCode || ''}
                        onChange={(e) => setFormData({ ...formData, hsCode: e.target.value })}
                        placeholder="4401.31.00"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1">SKU / Code</label>
                      <input
                        type="text"
                        value={formData.code || ''}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        placeholder="RME-PL-01"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Image URL</label>
                    <input
                      type="url"
                      value={formData.imageUrl || ''}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Technical Summary / Description</label>
                    <textarea
                      rows={3}
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Detailed description of biomass feedstock origin, combustion behavior, moisture stability, and rotary kiln application..."
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: Pricing & Commercials */}
              {modalTab === 'commercial' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#f9fbf7] p-4 rounded-2xl border border-[#e3ede0]">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">FOB Base Price (USD/MT) *</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-400 font-bold">$</span>
                        <input
                          type="number"
                          required
                          value={formData.basePriceUSD || 0}
                          onChange={(e) => setFormData({ ...formData, basePriceUSD: parseFloat(e.target.value) || 0 })}
                          className="w-full pl-7 pr-3 py-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden font-bold"
                        />
                      </div>
                      <span className="text-[10px] text-gray-500 mt-1 block">Free On Board Indian Port tariff rate</span>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Minimum Order Qty (MT) *</label>
                      <input
                        type="number"
                        required
                        value={formData.minOrderQty || 25}
                        onChange={(e) => setFormData({ ...formData, minOrderQty: parseFloat(e.target.value) || 25 })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden font-bold"
                      />
                      <span className="text-[10px] text-gray-500 mt-1 block">Standard 1x 20ft FCL container payload (~25-28 MT)</span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                    <span className="font-bold text-gray-800 block text-xs">Catalog Status &amp; Visibility</span>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={formData.inStock ?? true}
                          onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                          className="w-4 h-4 rounded text-[#1b4d27] focus:ring-[#2a6e3a]"
                        />
                        <span className="font-semibold text-gray-800">In Stock (Accepting RFQs)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={formData.featured ?? false}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                          className="w-4 h-4 rounded text-[#1b4d27] focus:ring-[#2a6e3a]"
                        />
                        <span className="font-semibold text-gray-800">Featured Highlight on Homepage</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Technical Specs & Assay */}
              {modalTab === 'specs' && (
                <div className="space-y-4">
                  <div className="bg-[#f0f7eb] p-3 rounded-xl border border-[#cbe1c3] text-[11px] text-[#1b4d27]">
                    <div className="font-bold flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5" />
                      ASTM &amp; ENplus Laboratory Specification Fields
                    </div>
                    These technical values are used in the public specification drawer and buyer proforma invoices.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Calorific Value (Display)</label>
                      <input
                        type="text"
                        value={formData.calorificValue || ''}
                        onChange={(e) => setFormData({ ...formData, calorificValue: e.target.value })}
                        placeholder="4,200 - 4,500 kcal/kg"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Min GCV (kcal/kg)</label>
                      <input
                        type="number"
                        value={formData.calorificMin || 4000}
                        onChange={(e) => setFormData({ ...formData, calorificMin: parseFloat(e.target.value) || 0 })}
                        placeholder="4200"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Max GCV (kcal/kg)</label>
                      <input
                        type="number"
                        value={formData.calorificMax || 4500}
                        onChange={(e) => setFormData({ ...formData, calorificMax: parseFloat(e.target.value) || 0 })}
                        placeholder="4500"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Moisture Limit</label>
                      <input
                        type="text"
                        value={formData.moisture || ''}
                        onChange={(e) => setFormData({ ...formData, moisture: e.target.value })}
                        placeholder="< 8%"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Ash Content</label>
                      <input
                        type="text"
                        value={formData.ashContent || ''}
                        onChange={(e) => setFormData({ ...formData, ashContent: e.target.value })}
                        placeholder="< 3%"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Bulk Density</label>
                      <input
                        type="text"
                        value={formData.bulkDensity || ''}
                        onChange={(e) => setFormData({ ...formData, bulkDensity: e.target.value })}
                        placeholder="650 kg/m³"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Fixed Carbon</label>
                      <input
                        type="text"
                        value={formData.fixedCarbon || ''}
                        onChange={(e) => setFormData({ ...formData, fixedCarbon: e.target.value })}
                        placeholder="18 - 22%"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Volatile Matter</label>
                      <input
                        type="text"
                        value={formData.volatileMatter || ''}
                        onChange={(e) => setFormData({ ...formData, volatileMatter: e.target.value })}
                        placeholder="72 - 76%"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Particle Size / Dimensions</label>
                      <input
                        type="text"
                        value={formData.particleSize || ''}
                        onChange={(e) => setFormData({ ...formData, particleSize: e.target.value })}
                        placeholder="8mm Pellets or 90mm Briquettes"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: Packaging & Logistics */}
              {modalTab === 'packaging' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Origin Sourcing Hub</label>
                      <input
                        type="text"
                        value={formData.origin || ''}
                        onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                        placeholder="Gujarat & Maharashtra, India"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Harvest Season / Availability</label>
                      <input
                        type="text"
                        value={formData.harvestSeason || ''}
                        onChange={(e) => setFormData({ ...formData, harvestSeason: e.target.value })}
                        placeholder="Year-Round Availability"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">
                      Packaging Options (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={packagingInput}
                      onChange={(e) => setPackagingInput(e.target.value)}
                      placeholder="25kg HDPE Bags, 50kg Bags, 1000kg Jumbo Bags, Loose Bulk Vessel"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden"
                    />
                    <div className="flex gap-2 mt-1.5 text-[10px]">
                      <span className="text-gray-400">Presets:</span>
                      <button
                        type="button"
                        onClick={() => setPackagingInput('25kg HDPE Bags, 50kg Woven Sacks, 1,000kg Jumbo Bags, Loose Bulk')}
                        className="text-[#2a6e3a] hover:underline cursor-pointer"
                      >
                        Standard Biomass
                      </button>
                      <button
                        type="button"
                        onClick={() => setPackagingInput('500kg Bulk Big Bags, 25kg Paper Sacks with PE liner')}
                        className="text-[#2a6e3a] hover:underline cursor-pointer"
                      >
                        Activated Carbon
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">
                      Industrial Applications (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={applicationsInput}
                      onChange={(e) => setApplicationsInput(e.target.value)}
                      placeholder="Industrial Boilers, Cement Rotary Kilns, Power Generation, Steel Smelters"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  {modalTab !== 'general' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (modalTab === 'commercial') setModalTab('general');
                        if (modalTab === 'specs') setModalTab('commercial');
                        if (modalTab === 'packaging') setModalTab('specs');
                      }}
                      className="px-3 py-1.5 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold cursor-pointer transition text-xs"
                    >
                      ← Previous Section
                    </button>
                  )}
                  {modalTab !== 'packaging' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (modalTab === 'general') setModalTab('commercial');
                        if (modalTab === 'commercial') setModalTab('specs');
                        if (modalTab === 'specs') setModalTab('packaging');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold cursor-pointer transition text-xs"
                    >
                      Next Section →
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold cursor-pointer transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#1b4d27] hover:bg-[#2a6e3a] text-white font-bold px-6 py-2.5 rounded-xl transition cursor-pointer shadow-xs"
                  >
                    {editingProduct ? 'Save Specifications' : 'Publish to Catalog'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
