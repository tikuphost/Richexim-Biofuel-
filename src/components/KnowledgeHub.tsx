import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  User,
  Clock,
  ArrowRight,
  Eye,
  PlusCircle,
  Tag,
  CheckCircle2,
  X,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Article } from '../types';

export const KnowledgeHub: React.FC = () => {
  const {
    articles,
    selectedArticle,
    setSelectedArticle,
    activeModal,
    setActiveModal,
    submitArticle,
    currentUser
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Form for submitting new article
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Crop & Harvest Report' | 'Biomass Decarbonization' | 'Boiler Efficiency' | 'Global Supply Chain'>('Biomass Decarbonization');
  const [newExcerpt, setNewExcerpt] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('Biomass, Boilers, Clean Energy');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Filter approved articles for public display
  const approvedArticles = articles.filter(
    (a) => a.status === 'Approved' || currentUser.role === 'Admin'
  );

  const filteredArticles = activeCategory === 'All'
    ? approvedArticles
    : approvedArticles.filter((a) => a.category === activeCategory);

  const handleOpenArticle = (art: Article) => {
    setSelectedArticle(art);
    setActiveModal('article-detail');
  };

  const handleSubmitArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    await submitArticle({
      title: newTitle,
      category: newCategory,
      excerpt: newExcerpt,
      content: newContent,
      author: currentUser.name,
      authorRole: currentUser.company,
      tags: newTags.split(',').map((t) => t.trim()).filter(Boolean)
    });

    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setIsSubmitModalOpen(false);
      setNewTitle('');
      setNewExcerpt('');
      setNewContent('');
    }, 2000);
  };

  return (
    <section id="knowledge-hub" className="py-16 bg-[#f9fbf7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#2a6e3a] uppercase tracking-wider bg-[#e8f3e2] px-3 py-1 rounded-full mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Industry Knowledge Hub &amp; Market Insights</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#1b4d27] tracking-tight">
              Biomass Engineering &amp; Global Trade Whitepapers
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-2 max-w-2xl">
              Research publications, crop harvest reports, boiler combustion efficiency case studies, and international trade compliance bulletins.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsSubmitModalOpen(true)}
            className="flex items-center gap-2 bg-[#2a6e3a] hover:bg-[#1b4d27] text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4 text-[#f5b342]" />
            <span>Submit Technical Article</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {[
            'All',
            'Biomass Decarbonization',
            'Crop & Harvest Report',
            'Boiler Efficiency',
            'Global Supply Chain'
          ].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#1b4d27] text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-[#eaf3e4] border border-[#e3ede0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {filteredArticles.map((art) => (
            <article
              key={art.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e3ede0] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="bg-[#f0f7eb] text-[#2a6e3a] text-[11px] font-extrabold px-3 py-1 rounded-full border border-[#cbe1c3]">
                    {art.category}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {art.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {art.views} views
                    </span>
                  </div>
                </div>

                <h3
                  onClick={() => handleOpenArticle(art)}
                  className="font-heading text-xl font-bold text-[#1b4d27] group-hover:text-[#2a6e3a] transition cursor-pointer mb-2.5 leading-snug"
                >
                  {art.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">
                  {art.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {art.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="bg-[#f9fbf7] text-gray-500 text-[10px] font-medium px-2 py-0.5 rounded-md border border-gray-200">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#e8f3e2] text-[#1b4d27] font-bold text-xs flex items-center justify-center">
                    {art.author.charAt(0)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">{art.author}</span>
                    <span className="text-[10px] text-gray-500">{art.authorRole} • {art.date}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenArticle(art)}
                  className="flex items-center gap-1 text-xs font-bold text-[#2a6e3a] hover:text-[#1b4d27] transition"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Article Detail Reader Modal */}
      {activeModal === 'article-detail' && selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl border border-[#e3ede0] overflow-hidden animate-in zoom-in-95">
            <div className="bg-[#1b4d27] text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#f5b342] tracking-wider">
                  {selectedArticle.category}
                </span>
                <h3 className="font-heading text-xl font-bold mt-1">
                  {selectedArticle.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm leading-relaxed text-gray-800">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-[#2a6e3a]" />
                  <span className="font-semibold text-gray-800">{selectedArticle.author}</span>
                  <span>({selectedArticle.authorRole})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>{selectedArticle.date}</span>
                  <span>{selectedArticle.readTime}</span>
                </div>
              </div>

              <div className="bg-[#f0f7eb] p-4 rounded-2xl border border-[#cbe1c3] italic text-gray-700 font-medium">
                "{selectedArticle.excerpt}"
              </div>

              <div className="prose max-w-none text-gray-800 space-y-4 pt-2">
                <p className="leading-relaxed">
                  {selectedArticle.content}
                </p>
                <p className="leading-relaxed text-gray-600">
                  Industrial applications referenced in this study were conducted in accordance with ASTM D5865 bomb calorimetry standards and ISO 17225 solid biofuel classification guidelines. For plant engineering consultations or custom boiler fuel blending trials, contact the technical services division of Richmount Exim.
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                {selectedArticle.tags.map((tag, i) => (
                  <span key={i} className="bg-[#f4f7ee] text-[#1b4d27] text-xs font-semibold px-2.5 py-1 rounded-lg">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-[#f9fbf7] border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                className="bg-[#2a6e3a] text-white font-bold text-xs px-5 py-2.5 rounded-xl"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Article Submission Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl border border-[#e3ede0] animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#2a6e3a]" />
                <h3 className="font-heading font-bold text-lg text-[#1b4d27]">
                  Submit Technical Case Study / Industry Article
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#e8f3e2] text-[#2a6e3a] mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-heading text-lg font-bold text-[#1b4d27]">
                  Article Submitted for Editorial Moderation
                </h4>
                <p className="text-xs text-gray-500">
                  Our technical committee will review your submission. Once approved, it will be published on the knowledge hub.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitArticle} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Article Headline</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Boiler Slagging Prevention in CFBC Units"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-[#f9fbf7] text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e: any) => setNewCategory(e.target.value)}
                      className="w-full bg-[#f9fbf7] text-xs px-3.5 py-2.5 rounded-xl border border-gray-300"
                    >
                      <option value="Biomass Decarbonization">Biomass Decarbonization</option>
                      <option value="Crop & Harvest Report">Crop &amp; Harvest Report</option>
                      <option value="Boiler Efficiency">Boiler Efficiency</option>
                      <option value="Global Supply Chain">Global Supply Chain</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Tags (Comma-separated)</label>
                    <input
                      type="text"
                      value={newTags}
                      onChange={(e) => setNewTags(e.target.value)}
                      className="w-full bg-[#f9fbf7] text-xs px-3.5 py-2.5 rounded-xl border border-gray-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Executive Summary / Abstract</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Brief 2-sentence summary of the research or industrial findings..."
                    value={newExcerpt}
                    onChange={(e) => setNewExcerpt(e.target.value)}
                    className="w-full bg-[#f9fbf7] text-xs px-3.5 py-2 rounded-xl border border-gray-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Full Technical Article Body</label>
                  <textarea
                    required
                    rows={6}
                    placeholder="Detailed explanation, fuel mass balances, calorific values, and conclusions..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full bg-[#f9fbf7] text-xs px-3.5 py-2 rounded-xl border border-gray-300"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#2a6e3a] hover:bg-[#1b4d27] text-white px-5 py-2 rounded-xl font-bold transition shadow-xs"
                  >
                    Submit for Moderation
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
