import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  Award,
  Search,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Certification } from '../../types';

export const CertificationsTab: React.FC = () => {
  const { certifications, addCertification, updateCertification, deleteCertification } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const initialForm: Partial<Certification> = {
    name: '',
    issuer: 'Bureau Veritas / SGS / ISO',
    code: 'ISO 9001:2015',
    issueDate: '2023-01-15',
    validUntil: '2026-01-14',
    accreditedBody: 'NABCB / IAF Accredited',
    category: 'Quality',
    description: 'Certified standard for export commodity manufacturing and quality management.',
    badgeCode: 'ISO-9001',
    documentNumber: 'BV-IN-98721'
  };

  const [formData, setFormData] = useState<Partial<Certification>>(initialForm);

  const categories = ['Quality', 'Sustainability', 'Safety', 'Religious', 'Export Trade'];

  const filteredCerts = certifications.filter((c) => {
    const matchesSearch =
      (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.issuer || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.documentNumber || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    setEditingCert(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Certification) => {
    setEditingCert(c);
    setFormData({ ...c });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    const certPayload: Certification = {
      id: editingCert ? editingCert.id : `cert-${Date.now()}`,
      name: formData.name || '',
      issuer: formData.issuer || 'Accredited Testing Authority',
      code: formData.code || 'ISO/IEC Standard',
      issueDate: formData.issueDate || new Date().toISOString().split('T')[0],
      validUntil: formData.validUntil || new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
      accreditedBody: formData.accreditedBody || 'IAF Accredited',
      category: (formData.category as any) || 'Quality',
      description: formData.description || '',
      badgeCode: formData.badgeCode || 'CERT-01',
      documentNumber: formData.documentNumber || `RME-CERT-${Math.floor(1000 + Math.random() * 9000)}`
    };

    if (editingCert) {
      await updateCertification(editingCert.id, certPayload);
    } else {
      await addCertification(certPayload);
    }

    setIsModalOpen(false);
    setEditingCert(null);
  };

  const handleDelete = async (id: string) => {
    await deleteCertification(id);
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="bg-white rounded-2xl p-5 border border-[#e3ede0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading font-extrabold text-lg text-[#172e18] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#2a6e3a]" />
            Quality Center &amp; Accreditations Management
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage ISO, ASTM, FSC, ENplus, Halal, and Phytosanitary certificates displayed on the Quality Center.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="bg-[#1b4d27] hover:bg-[#2a6e3a] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#f5b342]" />
          <span>Add Accreditation</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search certifications by name, code, or issuer..."
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2a6e3a]"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-white rounded-xl border border-gray-200 px-3 py-2.5 text-xs font-semibold text-gray-700 focus:outline-hidden focus:border-[#2a6e3a] cursor-pointer"
        >
          <option value="all">All Categories ({certifications.length})</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Certifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCerts.map((cert) => (
          <div
            key={cert.id}
            className="bg-white rounded-2xl p-5 border border-[#e3ede0] shadow-xs hover:shadow-md transition flex flex-col justify-between gap-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 rounded-xl bg-[#edf5e8] text-[#1b4d27] flex items-center justify-center font-black text-sm shrink-0">
                  <Award className="w-5 h-5 text-[#2a6e3a]" />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#edf5e8] text-[#1b4d27]">
                    {cert.category}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-heading font-extrabold text-sm text-gray-900 group-hover:text-[#1b4d27] transition">
                  {cert.name}
                </h4>
                <p className="text-[11px] font-bold text-[#2a6e3a] mt-0.5">
                  Standard: {cert.code}
                </p>
                <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                  {cert.description}
                </p>
              </div>

              <div className="pt-2 border-t border-gray-100 space-y-1 text-[11px] text-gray-500">
                <div className="flex justify-between">
                  <span>Issuer:</span>
                  <span className="font-semibold text-gray-800">{cert.issuer}</span>
                </div>
                <div className="flex justify-between">
                  <span>Document No:</span>
                  <span className="font-mono text-gray-700">{cert.documentNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Valid Until:</span>
                  <span className="font-semibold text-emerald-700">{cert.validUntil}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => handleOpenEdit(cert)}
                className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition cursor-pointer"
                title="Edit certification"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setDeleteId(cert.id)}
                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                title="Delete certification"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-gray-200 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-6 h-6" />
              <h4 className="font-heading font-extrabold text-base text-gray-900">Delete Accreditation?</h4>
            </div>
            <p className="text-xs text-gray-600">
              This certification record will be removed from the public Quality Center showcase.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-gray-200 shadow-2xl overflow-hidden my-8">
            <div className="bg-[#172e18] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#f5b342]" />
                <h3 className="font-heading font-extrabold text-base">
                  {editingCert ? 'Edit Certification' : 'Add New Accreditation'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/70"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-gray-700 font-bold mb-1">Accreditation Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. ISO 9001:2015 Quality Management System"
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden font-bold"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Standard Code</label>
                  <input
                    type="text"
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="ISO 9001:2015"
                    className="w-full p-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Category</label>
                  <select
                    value={formData.category || 'Quality'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full p-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Issuer Authority</label>
                  <input
                    type="text"
                    value={formData.issuer || ''}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    placeholder="Bureau Veritas Certification"
                    className="w-full p-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Document / Certificate No</label>
                  <input
                    type="text"
                    value={formData.documentNumber || ''}
                    onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                    placeholder="BV-IN-98721"
                    className="w-full p-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={formData.issueDate || ''}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="w-full p-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Valid Until Date</label>
                  <input
                    type="date"
                    value={formData.validUntil || ''}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="w-full p-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-gray-700 font-bold mb-1">Accredited Body</label>
                  <input
                    type="text"
                    value={formData.accreditedBody || ''}
                    onChange={(e) => setFormData({ ...formData, accreditedBody: e.target.value })}
                    placeholder="NABCB / IAF Member"
                    className="w-full p-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-gray-700 font-bold mb-1">Description &amp; Scope</label>
                  <textarea
                    rows={3}
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Scope of manufacturing, export packaging, and traceability..."
                    className="w-full p-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#1b4d27] hover:bg-[#2a6e3a] text-white font-bold px-5 py-2 rounded-xl shadow-xs"
                >
                  {editingCert ? 'Save Changes' : 'Create Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
