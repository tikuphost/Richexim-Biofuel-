import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  Clock,
  User,
  Tag
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Article } from '../../types';

export const ArticlesTab: React.FC = () => {
  const { articles, addArticle, updateArticle, deleteArticle, updateArticleStatus } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const categories = [
    'Crop & Harvest Report',
    'Biomass Decarbonization',
    'Boiler Efficiency',
    'Global Supply Chain'
  ];

  const initialForm: Partial<Article> = {
    title: '',
    slug: '',
    category: 'Biomass Decarbonization',
    author: 'Dr. Rameshwar Patel',
    authorRole: 'Head of Agronomy & Sourcing',
    readTime: '6 min read',
    excerpt: '',
    content: '',
    tags: ['Biomass', 'Industrial Energy', 'Decarbonization'],
    status: 'Approved'
  };

  const [formData, setFormData] = useState<Partial<Article>>(initialForm);
  const [tagsInput, setTagsInput] = useState(initialForm.tags?.join(', ') || '');

  const filteredArticles = articles.filter((a) => {
    const matchesSearch =
      (a.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.author || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'all' || a.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleOpenAdd = () => {
    setEditingArticle(null);
    setFormData(initialForm);
    setTagsInput(initialForm.tags?.join(', ') || '');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (a: Article) => {
    setEditingArticle(a);
    setFormData({ ...a });
    setTagsInput(a.tags?.join(', ') || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const slug =
      formData.slug?.trim() ||
      formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const articlePayload: Article = {
      id: editingArticle ? editingArticle.id : `art-${Date.now()}`,
      title: formData.title || '',
      slug: slug,
      category: (formData.category as any) || 'Biomass Decarbonization',
      author: formData.author || 'Richmount Exim Editorial Desk',
      authorRole: formData.authorRole || 'Trade Desk Contributor',
      date: editingArticle?.date || new Date().toISOString().split('T')[0],
      readTime: formData.readTime || '5 min read',
      excerpt: formData.excerpt || '',
      content: formData.content || '',
      tags: tags.length > 0 ? tags : ['Biomass'],
      status: (formData.status as any) || 'Approved',
      views: editingArticle?.views || 1
    };

    if (editingArticle) {
      await updateArticle(editingArticle.id, articlePayload);
    } else {
      await addArticle(articlePayload);
    }

    setIsModalOpen(false);
    setEditingArticle(null);
  };

  const handleDelete = async (id: string) => {
    await deleteArticle(id);
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-[#e3ede0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading font-extrabold text-lg text-[#172e18] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#2a6e3a]" />
            Market Intelligence &amp; Editorial Knowledgebase
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Publish crop yield forecasts, industrial decarbonization case studies, and shipping intelligence reports.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="bg-[#1b4d27] hover:bg-[#2a6e3a] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#f5b342]" />
          <span>Write New Article</span>
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
            placeholder="Search intelligence publications by title, author, or excerpt..."
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2a6e3a]"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-white rounded-xl border border-gray-200 px-3 py-2.5 text-xs font-semibold text-gray-700 focus:outline-hidden focus:border-[#2a6e3a] cursor-pointer"
        >
          <option value="all">All Categories ({articles.length})</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Articles List Table */}
      <div className="bg-white rounded-2xl border border-[#e3ede0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f9fbf7] text-gray-600 font-bold border-b border-[#e3ede0] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3.5">Article &amp; Excerpt</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Author</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Date &amp; Views</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredArticles.map((art) => (
                <tr key={art.id} className="hover:bg-[#fbfdf9] transition">
                  <td className="px-4 py-3.5 max-w-sm">
                    <div className="font-bold text-gray-900 line-clamp-1">{art.title}</div>
                    <div className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">{art.excerpt}</div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {art.tags.slice(0, 3).map((t, idx) => (
                        <span key={idx} className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="text-[10px] font-bold bg-[#edf5e8] text-[#1b4d27] px-2 py-0.5 rounded-md whitespace-nowrap">
                      {art.category}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-gray-800">{art.author}</div>
                    <div className="text-[10px] text-gray-400">{art.authorRole}</div>
                  </td>

                  <td className="px-4 py-3.5">
                    <select
                      value={art.status}
                      onChange={(e) => updateArticleStatus(art.id, e.target.value as any)}
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg border focus:outline-hidden cursor-pointer ${
                        art.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : art.status === 'Pending Moderation'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-red-50 text-red-800 border-red-300'
                      }`}
                    >
                      <option value="Approved">Approved (Live)</option>
                      <option value="Pending Moderation">Pending Moderation</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>

                  <td className="px-4 py-3.5 text-[11px] text-gray-500 whitespace-nowrap">
                    <div>{art.date}</div>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
                      <Eye className="w-3 h-3" />
                      <span>{art.views || 0} reads</span>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(art)}
                        className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition cursor-pointer"
                        title="Edit article"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteId(art.id)}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                        title="Delete article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-gray-200 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-6 h-6" />
              <h4 className="font-heading font-extrabold text-base text-gray-900">Delete Publication?</h4>
            </div>
            <p className="text-xs text-gray-600">
              Are you sure you want to permanently delete this publication from the Market Intelligence desk?
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

      {/* Add / Edit Article Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-gray-200 shadow-2xl overflow-hidden my-8">
            <div className="bg-[#172e18] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#f5b342]" />
                <h3 className="font-heading font-extrabold text-base">
                  {editingArticle ? 'Edit Article' : 'Draft New Publication'}
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

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-gray-700 font-bold mb-1">Article Headline *</label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Mustard Husk Pelletization Trends in Western India"
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden font-bold"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Editorial Category</label>
                  <select
                    value={formData.category || 'Biomass Decarbonization'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full p-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Reading Duration</label>
                  <input
                    type="text"
                    value={formData.readTime || ''}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    placeholder="6 min read"
                    className="w-full p-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Author Name</label>
                  <input
                    type="text"
                    value={formData.author || ''}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Dr. Rameshwar Patel"
                    className="w-full p-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Author Role / Designation</label>
                  <input
                    type="text"
                    value={formData.authorRole || ''}
                    onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                    placeholder="Head of Agronomy & Sourcing"
                    className="w-full p-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-gray-700 font-bold mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Biomass, Boiler Fuel, Gujarat, Export Market"
                    className="w-full p-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-gray-700 font-bold mb-1">Short Summary / Excerpt</label>
                  <textarea
                    rows={2}
                    value={formData.excerpt || ''}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Brief 2-sentence summary visible in blog card previews..."
                    className="w-full p-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-gray-700 font-bold mb-1">Full Article Body Content</label>
                  <textarea
                    rows={8}
                    value={formData.content || ''}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Comprehensive analysis, ASTM data references, port throughput figures..."
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Publishing Status</label>
                  <select
                    value={formData.status || 'Approved'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden font-bold"
                  >
                    <option value="Approved">Approved (Publicly Visible)</option>
                    <option value="Pending Moderation">Pending Moderation (Draft)</option>
                    <option value="Rejected">Rejected</option>
                  </select>
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
                  className="bg-[#1b4d27] hover:bg-[#2a6e3a] text-white font-bold px-6 py-2.5 rounded-xl shadow-xs"
                >
                  {editingArticle ? 'Save Changes' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
