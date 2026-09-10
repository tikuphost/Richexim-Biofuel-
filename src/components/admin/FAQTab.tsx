import React, { useState } from 'react';
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  Tag
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FAQItem } from '../../types';

export const FAQTab: React.FC = () => {
  const { faqs, addFAQ, updateFAQ, deleteFAQ } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const categories: FAQItem['category'][] = [
    'Incoterms & Shipping',
    'Quality & Lab COA',
    'Payment & L/C',
    'Custom Formulations',
    'Packaging & MOQ',
    'EU Regulations'
  ];

  const initialForm: Partial<FAQItem> = {
    category: 'Incoterms & Shipping',
    question: '',
    answer: '',
    tags: ['Export', 'Trade']
  };

  const [formData, setFormData] = useState<Partial<FAQItem>>(initialForm);
  const [tagsInput, setTagsInput] = useState(initialForm.tags?.join(', ') || '');

  const filteredFaqs = (faqs || []).filter((f) => {
    const matchesSearch =
      (f.question || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.answer || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.tags || []).some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = categoryFilter === 'all' || f.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleOpenAdd = () => {
    setEditingFAQ(null);
    setFormData(initialForm);
    setTagsInput(initialForm.tags?.join(', ') || '');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (f: FAQItem) => {
    setEditingFAQ(f);
    setFormData({ ...f });
    setTagsInput((f.tags || []).join(', '));
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question?.trim() || !formData.answer?.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const faqPayload: FAQItem = {
      id: editingFAQ ? editingFAQ.id : `faq-${Date.now()}`,
      category: (formData.category as any) || 'Incoterms & Shipping',
      question: formData.question.trim(),
      answer: formData.answer.trim(),
      tags: tags.length > 0 ? tags : ['General']
    };

    if (editingFAQ) {
      await updateFAQ(faqPayload);
    } else {
      await addFAQ(faqPayload);
    }

    setIsModalOpen(false);
    setEditingFAQ(null);
  };

  const handleDelete = async (id: string) => {
    await deleteFAQ(id);
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-[#e3ede0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading font-extrabold text-lg text-[#172e18] flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#2a6e3a]" />
            Frequently Asked Questions (FAQ Desk)
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage buyer trade questions, Incoterms policies, ASTM COA requirements, and payment guidelines.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="bg-[#1b4d27] hover:bg-[#2a6e3a] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#f5b342]" />
          <span>Add FAQ Entry</span>
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
            placeholder="Search FAQs by question keywords, answer text, or tags..."
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2a6e3a]"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-white rounded-xl border border-gray-200 px-3 py-2.5 text-xs font-semibold text-gray-700 focus:outline-hidden focus:border-[#2a6e3a] cursor-pointer"
        >
          <option value="all">All Categories ({faqs?.length || 0})</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* FAQs List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => (
          <div
            key={faq.id}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e3ede0] shadow-xs hover:border-[#cbe1c3] transition space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#edf5e8] text-[#1b4d27]">
                  {faq.category}
                </span>
                <h4 className="font-heading font-extrabold text-sm text-gray-900">
                  {faq.question}
                </h4>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(faq)}
                  className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition cursor-pointer"
                  title="Edit FAQ"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteId(faq.id)}
                  className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                  title="Delete FAQ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed bg-[#fbfdf9] p-3 rounded-xl border border-gray-100">
              {faq.answer}
            </p>

            {faq.tags && faq.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {faq.tags.map((t, idx) => (
                  <span key={idx} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-gray-200 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-6 h-6" />
              <h4 className="font-heading font-extrabold text-base text-gray-900">Delete FAQ Entry?</h4>
            </div>
            <p className="text-xs text-gray-600">
              This entry will be permanently removed from the public customer FAQ page.
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

      {/* Add / Edit FAQ Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-gray-200 shadow-2xl overflow-hidden my-8">
            <div className="bg-[#172e18] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#f5b342]" />
                <h3 className="font-heading font-extrabold text-base">
                  {editingFAQ ? 'Edit FAQ Item' : 'Add New FAQ Item'}
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
              <div>
                <label className="block text-gray-700 font-bold mb-1">Category</label>
                <select
                  value={formData.category || 'Incoterms & Shipping'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Question Headline *</label>
                <input
                  type="text"
                  required
                  value={formData.question || ''}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="e.g. Which international Incoterms do you support for container shipping?"
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden font-bold"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Official Response / Answer *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.answer || ''}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Detailed explanation, port options, COA standards..."
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Search Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Incoterms, CIF, FOB, Port, Logistics"
                  className="w-full p-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden"
                />
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
                  {editingFAQ ? 'Save Changes' : 'Create FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
