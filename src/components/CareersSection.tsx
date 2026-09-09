import React, { useState } from 'react';
import {
  Briefcase,
  MapPin,
  Clock,
  CheckCircle2,
  Send,
  Building,
  UserCheck,
  FileCheck,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CareerJob } from '../types';

export const CareersSection: React.FC = () => {
  const {
    careers,
    selectedJob,
    setSelectedJob,
    submitJobApplication,
    currentUser
  } = useApp();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applicantName, setApplicantName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState('+91 8921517645');
  const [experienceYears, setExperienceYears] = useState(4);
  const [coverLetter, setCoverLetter] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleOpenApply = (job: CareerJob) => {
    setSelectedJob(job);
    setIsApplyModalOpen(true);
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    await submitJobApplication({
      jobId: selectedJob.id,
      jobTitle: selectedJob.title,
      applicantName,
      email,
      phone,
      experienceYears,
      coverLetter,
      portfolioUrl
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsApplyModalOpen(false);
      setCoverLetter('');
    }, 2200);
  };

  return (
    <section id="careers" className="py-16 bg-[#f4f7ee]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#2a6e3a] uppercase tracking-wider bg-white px-3.5 py-1 rounded-full border border-[#cbe1c3] mb-3 shadow-2xs">
            <Briefcase className="w-3.5 h-3.5 text-[#2a6e3a]" />
            <span>Join the Energy Transition</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#1b4d27] tracking-tight">
            Careers at Richmount Exim
          </h2>
          <p className="text-gray-700 text-sm sm:text-base mt-2">
            Build the international clean supply chain of tomorrow. We are hiring trade specialists, chemical laboratory heads, and logistics managers across our Indian export hubs.
          </p>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {careers.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-[#e3ede0] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="bg-[#e8f3e2] text-[#1b4d27] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    {job.department}
                  </span>
                  <span className="text-[11px] font-semibold text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#2a6e3a]" />
                    {job.type}
                  </span>
                </div>

                <h3 className="font-heading text-lg font-bold text-[#1b4d27] mb-2 leading-snug">
                  {job.title}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-[#2a6e3a]" />
                  <span>{job.location} • {job.experience}</span>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 mb-4">
                  {job.description}
                </p>

                {/* Key Requirements List */}
                <div className="space-y-1.5 mb-6 pt-3 border-t border-gray-100">
                  <span className="text-[10px] font-bold uppercase text-gray-400 block">
                    Core Capabilities
                  </span>
                  {job.requirements.slice(0, 2).map((req, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-gray-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2a6e3a] shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenApply(job)}
                className="w-full flex items-center justify-center gap-2 bg-[#1b4d27] hover:bg-[#2a6e3a] text-white font-bold text-xs py-3 px-4 rounded-xl shadow-xs transition cursor-pointer"
              >
                <span>Apply for Position</span>
                <Send className="w-3.5 h-3.5 text-[#f5b342]" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Application Submission Modal */}
      {isApplyModalOpen && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-[#e3ede0] animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#2a6e3a]">
                  Candidate Application
                </span>
                <h3 className="font-heading font-bold text-base text-[#1b4d27] mt-0.5">
                  {selectedJob.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {isSuccess ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#e8f3e2] text-[#2a6e3a] mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-heading text-lg font-bold text-[#1b4d27]">
                  Application Transmitted to HR
                </h4>
                <p className="text-xs text-gray-500">
                  Thank you for applying. Our talent acquisition desk will review your credentials within 2 business days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplicationSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full bg-[#f9fbf7] text-xs px-3.5 py-2.5 rounded-xl border border-gray-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#f9fbf7] text-xs px-3.5 py-2.5 rounded-xl border border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Phone / WhatsApp</label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#f9fbf7] text-xs px-3.5 py-2.5 rounded-xl border border-gray-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Relevant Experience</label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(Number(e.target.value))}
                      className="w-full bg-[#f9fbf7] text-xs px-3.5 py-2.5 rounded-xl border border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">LinkedIn / Portfolio URL</label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/..."
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      className="w-full bg-[#f9fbf7] text-xs px-3.5 py-2.5 rounded-xl border border-gray-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Brief Cover Letter / Relevant Achievements</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your commodity logistics experience, familiarity with ocean freight chartering, or laboratory bomb calorimetry..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full bg-[#f9fbf7] text-xs px-3.5 py-2 rounded-xl border border-gray-300"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsApplyModalOpen(false)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#2a6e3a] hover:bg-[#1b4d27] text-white px-5 py-2 rounded-xl font-bold transition shadow-xs"
                  >
                    Transmit Application
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
