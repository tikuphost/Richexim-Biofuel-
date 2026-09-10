import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  Users,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  Mail,
  Phone,
  FileText,
  ExternalLink,
  MapPin,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CareerJob } from '../../types';

export const CareersTab: React.FC = () => {
  const {
    careers,
    jobApplications,
    addCareer,
    updateCareer,
    deleteCareer,
    updateJobApplicationStatus
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'openings' | 'applications'>('openings');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<CareerJob | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const departments = [
    'Export Logistics',
    'Quality & Lab',
    'International Trade',
    'Plant Operations'
  ];

  const initialForm: Partial<CareerJob> = {
    title: '',
    department: 'International Trade',
    location: 'Mumbai Port Office / Hybrid',
    type: 'Full-time',
    experience: '3-6 Years in Bulk Export Operations',
    description: '',
    requirements: ['Degree in International Trade or Engineering', 'Familiar with CIF/FOB Incoterms and BL documentation'],
    responsibilities: ['Overseeing container booking and port freight negotiation', 'Coordinating with accredited SGS inspection labs'],
    active: true
  };

  const [formData, setFormData] = useState<Partial<CareerJob>>(initialForm);
  const [reqInput, setReqInput] = useState(initialForm.requirements?.join('\n') || '');
  const [respInput, setRespInput] = useState(initialForm.responsibilities?.join('\n') || '');

  const filteredJobs = careers.filter((j) => {
    return (
      (j.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (j.department || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (j.location || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const filteredApplications = jobApplications.filter((a) => {
    return (
      (a.applicantName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.jobTitle || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleOpenAdd = () => {
    setEditingJob(null);
    setFormData(initialForm);
    setReqInput(initialForm.requirements?.join('\n') || '');
    setRespInput(initialForm.responsibilities?.join('\n') || '');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (j: CareerJob) => {
    setEditingJob(j);
    setFormData({ ...j });
    setReqInput(j.requirements?.join('\n') || '');
    setRespInput(j.responsibilities?.join('\n') || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) return;

    const requirements = reqInput
      .split('\n')
      .map((r) => r.trim())
      .filter(Boolean);

    const responsibilities = respInput
      .split('\n')
      .map((r) => r.trim())
      .filter(Boolean);

    const jobPayload: CareerJob = {
      id: editingJob ? editingJob.id : `job-${Date.now()}`,
      title: formData.title || '',
      department: (formData.department as any) || 'International Trade',
      location: formData.location || 'Mumbai, India',
      type: (formData.type as any) || 'Full-time',
      experience: formData.experience || '2+ Years',
      description: formData.description || '',
      requirements: requirements.length > 0 ? requirements : ['Relevant degree or equivalent experience'],
      responsibilities: responsibilities.length > 0 ? responsibilities : ['Fulfill standard operational duties'],
      active: formData.active ?? true
    };

    if (editingJob) {
      await updateCareer(editingJob.id, jobPayload);
    } else {
      await addCareer(jobPayload);
    }

    setIsModalOpen(false);
    setEditingJob(null);
  };

  const handleDelete = async (id: string) => {
    await deleteCareer(id);
    setDeleteId(null);
  };

  const handleToggleActive = async (j: CareerJob) => {
    await updateCareer(j.id, { active: !j.active });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Navigation Tabs */}
      <div className="bg-white rounded-2xl p-5 border border-[#e3ede0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading font-extrabold text-lg text-[#172e18] flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#2a6e3a]" />
            Careers &amp; Human Capital Desk
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Post new international trade openings and evaluate candidate applications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sub-Tabs Switcher */}
          <div className="flex bg-[#f4f7f2] p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveSubTab('openings')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeSubTab === 'openings'
                  ? 'bg-white text-[#1b4d27] shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Job Openings ({careers.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('applications')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'applications'
                  ? 'bg-white text-[#1b4d27] shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>Applications</span>
              <span className="bg-[#1b4d27] text-white text-[10px] px-1.5 py-0.2 rounded-full">
                {jobApplications.length}
              </span>
            </button>
          </div>

          {activeSubTab === 'openings' && (
            <button
              type="button"
              onClick={handleOpenAdd}
              className="bg-[#1b4d27] hover:bg-[#2a6e3a] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4 text-[#f5b342]" />
              <span className="hidden sm:inline">Post Opening</span>
            </button>
          )}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={
            activeSubTab === 'openings'
              ? 'Search openings by title, department, or location...'
              : 'Search candidates by applicant name, email, or applied role...'
          }
          className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2a6e3a]"
        />
      </div>

      {/* Sub-Tab 1: Job Openings List */}
      {activeSubTab === 'openings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl p-5 border border-[#e3ede0] shadow-xs hover:shadow-md transition flex flex-col justify-between gap-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#edf5e8] text-[#1b4d27]">
                      {job.department}
                    </span>
                    <h4 className="font-heading font-extrabold text-sm text-gray-900 mt-1.5 group-hover:text-[#1b4d27] transition">
                      {job.title}
                    </h4>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleActive(job)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer transition ${
                      job.active
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {job.active ? 'Accepting Applicants' : 'Paused / Inactive'}
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{job.location}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>{job.type}</span>
                  </span>
                  <span className="font-semibold text-[#1b4d27]">{job.experience}</span>
                </div>

                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {job.requirements && job.requirements.length > 0 && (
                  <div className="pt-2 border-t border-gray-100">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                      Key Requirement:
                    </span>
                    <p className="text-[11px] text-gray-700 italic truncate">
                      • {job.requirements[0]}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(job)}
                  className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition cursor-pointer"
                  title="Edit vacancy details"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteId(job.id)}
                  className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                  title="Delete opening"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sub-Tab 2: Job Candidate Applications */}
      {activeSubTab === 'applications' && (
        <div className="bg-white rounded-2xl border border-[#e3ede0] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f9fbf7] text-gray-600 font-bold border-b border-[#e3ede0] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3.5">Candidate &amp; Contact</th>
                  <th className="px-4 py-3.5">Position Applied</th>
                  <th className="px-4 py-3.5">Experience</th>
                  <th className="px-4 py-3.5">Cover Letter Excerpt</th>
                  <th className="px-4 py-3.5">Application Status</th>
                  <th className="px-4 py-3.5">Applied Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                      No candidate submissions on file.
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-[#fbfdf9] transition">
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-gray-900">{app.applicantName}</div>
                        <div className="text-[11px] text-gray-500 flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3 h-3" />
                          <span>{app.email}</span>
                          <span>•</span>
                          <span>{app.phone}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 font-semibold text-gray-800">
                        {app.jobTitle}
                      </td>

                      <td className="px-4 py-3.5 font-bold text-[#1b4d27]">
                        {app.experienceYears} Years
                      </td>

                      <td className="px-4 py-3.5 max-w-xs text-[11px] text-gray-600 truncate">
                        {app.coverLetter || 'Direct application submission'}
                      </td>

                      <td className="px-4 py-3.5">
                        <select
                          value={app.status || 'Under Review'}
                          onChange={(e) => updateJobApplicationStatus(app.id, e.target.value as any)}
                          className="text-[10px] font-bold px-2 py-1 rounded-lg border border-gray-300 focus:outline-hidden cursor-pointer bg-white"
                        >
                          <option value="Under Review">Under Review</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interviewed">Interviewed</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </td>

                      <td className="px-4 py-3.5 text-[11px] text-gray-500 whitespace-nowrap">
                        {new Date(app.submittedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-gray-200 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-6 h-6" />
              <h4 className="font-heading font-extrabold text-base text-gray-900">Delete Job Opening?</h4>
            </div>
            <p className="text-xs text-gray-600">
              Are you sure you want to permanently remove this career opening from the public recruitment portal?
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

      {/* Add / Edit Job Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-gray-200 shadow-2xl overflow-hidden my-8">
            <div className="bg-[#172e18] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#f5b342]" />
                <h3 className="font-heading font-extrabold text-base">
                  {editingJob ? 'Edit Career Opening' : 'Post New Job Vacancy'}
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
                  <label className="block text-gray-700 font-bold mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Senior Export Documentation Officer"
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden font-bold"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Department</label>
                  <select
                    value={formData.department || 'International Trade'}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value as any })}
                    className="w-full p-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden"
                  >
                    {departments.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Employment Type</label>
                  <select
                    value={formData.type || 'Full-time'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full p-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Office Location</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Mumbai Port Office / Hybrid"
                    className="w-full p-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Required Experience</label>
                  <input
                    type="text"
                    value={formData.experience || ''}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="3-5 Years in Maritime Shipping"
                    className="w-full p-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-gray-700 font-bold mb-1">Role Summary</label>
                  <textarea
                    rows={2}
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the department mission and objectives..."
                    className="w-full p-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-gray-700 font-bold mb-1">
                    Requirements (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={reqInput}
                    onChange={(e) => setReqInput(e.target.value)}
                    placeholder="Bachelors degree in Logistics&#10;Experience with Letter of Credit (LC)&#10;Familiar with DGFT regulations"
                    className="w-full p-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-gray-700 font-bold mb-1">
                    Key Responsibilities (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={respInput}
                    onChange={(e) => setRespInput(e.target.value)}
                    placeholder="Prepare bill of lading and COO&#10;Coordinate with shipping lines&#10;Audit customs tariffs"
                    className="w-full p-2 rounded-xl border border-gray-200 focus:border-[#2a6e3a] focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.active ?? true}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="w-4 h-4 rounded text-[#1b4d27] focus:ring-[#2a6e3a]"
                    />
                    <span className="font-semibold text-gray-700">Publish immediately to Careers portal</span>
                  </label>
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
                  {editingJob ? 'Save Changes' : 'Post Opening'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
