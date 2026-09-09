import React, { useState } from 'react';
import {
  Briefcase,
  MapPin,
  Clock,
  CheckCircle2,
  Send,
  Building2,
  Award,
  Globe2,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  UserCheck,
  FileCheck,
  X,
  Mail,
  Phone,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CareerJob } from '../types';

export const CareersPage: React.FC = () => {
  const {
    careers,
    selectedJob,
    setSelectedJob,
    submitJobApplication,
    currentUser,
    setCurrentPage
  } = useApp();

  const [activeDepartment, setActiveDepartment] = useState<string>('All');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applicantName, setApplicantName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState('+91 8921517645');
  const [experienceYears, setExperienceYears] = useState(4);
  const [coverLetter, setCoverLetter] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const departments = ['All', 'Trading & Sales', 'Logistics & Supply Chain', 'Engineering & QA', 'Finance & Trade'];

  const filteredJobs = activeDepartment === 'All'
    ? careers
    : careers.filter((j) => j.department.toLowerCase().includes(activeDepartment.toLowerCase().split(' ')[0]));

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
    <div className="bg-[#f9fbf7] text-[#172e18]">
      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-[#112415] via-[#172e18] to-[#1e3c20] text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f5b342_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#f5b342] font-semibold mb-4">
            <button
              type="button"
              onClick={() => setCurrentPage('home')}
              className="hover:underline cursor-pointer"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-white/80">Careers &amp; Opportunities</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#2a6e3a]/50 text-[#f5b342] text-xs font-extrabold px-3 py-1 rounded-full border border-[#2a6e3a] mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Richexim Group Talent Portal</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Fueling the Global Clean Energy Transition
            </h1>
            <p className="text-white/85 text-sm sm:text-base mt-4 leading-relaxed">
              Join Richmount Exim’s international trading desks, maritime logistics teams, and biomass laboratory engineers. We export green energy alternatives, torrefied bio-coal, and activated carbon to 28+ countries across Europe, the Middle East, and Asia.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
              <a
                href="#open-positions"
                className="bg-[#f5b342] hover:bg-[#e5a432] text-[#112415] text-xs sm:text-sm font-extrabold px-6 py-3.5 rounded-xl transition shadow-lg cursor-pointer inline-flex items-center justify-center gap-2 text-center"
              >
                <span>View {careers.length} Open Positions</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#culture"
                className="bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold px-6 py-3.5 rounded-xl transition border border-white/20 inline-flex items-center justify-center gap-2 text-center"
              >
                <span>Why Work at Richmount</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Richmount Exim / Culture Section */}
      <section id="culture" className="py-16 bg-white border-b border-[#e3ede0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#2a6e3a] uppercase tracking-wider bg-[#e8f3e2] px-3 py-1 rounded-full mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Employee Value Proposition</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#172e18]">
              Why Build Your Career at Richmount Exim?
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              We combine the heritage and stability of the Richexim Group (est. 1994) with the high-growth trajectory of international renewable energy commodities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#f9fbf7] p-6 rounded-2xl border border-[#e3ede0] hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-[#e8f3e2] text-[#2a6e3a] flex items-center justify-center font-bold mb-4">
                <Globe2 className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-[#172e18]">Global Market Exposure</h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Interact with international buyers, premier chartering agents, and port authorities across Rotterdam, Antwerp, Jebel Ali, and Singapore.
              </p>
            </div>

            <div className="bg-[#f9fbf7] p-6 rounded-2xl border border-[#e3ede0] hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-[#e8f3e2] text-[#2a6e3a] flex items-center justify-center font-bold mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-[#172e18]">Decarbonization Impact</h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Directly contribute to replacing fossil thermal coal with high-GCV agricultural pellets, eliminating over 180,000 MT of industrial CO2 annually.
              </p>
            </div>

            <div className="bg-[#f9fbf7] p-6 rounded-2xl border border-[#e3ede0] hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-[#e8f3e2] text-[#2a6e3a] flex items-center justify-center font-bold mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-[#172e18]">Trade Rigor &amp; Compliance</h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Master complex international trade finance: Incoterms 2020, SGS inspection regimes, UCP 600 Letters of Credit, and EU CBAM regulatory compliance.
              </p>
            </div>

            <div className="bg-[#f9fbf7] p-6 rounded-2xl border border-[#e3ede0] hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-[#e8f3e2] text-[#2a6e3a] flex items-center justify-center font-bold mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-[#172e18]">Rapid Career Acceleration</h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Merit-based advancement, profit-sharing incentives on export commodity contracts, structured mentorship, and international trade fair deputation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section id="open-positions" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#2a6e3a] uppercase tracking-wider bg-[#e8f3e2] px-3 py-1 rounded-full mb-2">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Current Openings</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#172e18]">
              Available Positions ({filteredJobs.length})
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Select an opening to review qualifications and submit your application directly to our HR committee.
            </p>
          </div>

          {/* Department Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
            {departments.map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => setActiveDepartment(dept)}
                className={`text-xs font-bold px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap border ${
                  activeDepartment === dept
                    ? 'bg-[#1b4d27] text-white border-[#1b4d27]'
                    : 'bg-white text-gray-700 hover:bg-[#f4f7ee] border-gray-200'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Job Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl p-6 border border-[#e3ede0] shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2a6e3a] bg-[#e8f3e2] px-2.5 py-1 rounded-md">
                    {job.department}
                  </span>
                  <span className="text-[11px] font-semibold text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    {job.type}
                  </span>
                </div>

                <h3 className="font-heading text-lg font-bold text-[#172e18] hover:text-[#2a6e3a] transition">
                  {job.title}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>{job.location}</span>
                  <span className="mx-1">•</span>
                  <span>{job.experience}</span>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 mb-4">
                  {job.description}
                </p>

                {job.requirements && job.requirements.length > 0 && (
                  <div className="space-y-1.5 mb-6 pt-3 border-t border-gray-100">
                    <span className="text-[11px] font-bold text-gray-700 block mb-1">Key Competencies:</span>
                    {job.requirements.slice(0, 3).map((req, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] text-gray-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2a6e3a] shrink-0" />
                        <span className="truncate">{req}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] text-gray-400">Richexim HQ / Port Desk</span>
                <button
                  type="button"
                  onClick={() => handleOpenApply(job)}
                  className="inline-flex items-center gap-1.5 bg-[#1b4d27] hover:bg-[#2a6e3a] text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  <span>Apply Now</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#f5b342]" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* General Application Banner */}
        <div className="mt-12 bg-white rounded-3xl p-8 border border-[#e3ede0] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#e8f3e2] text-[#1b4d27] flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-[#172e18]">Don't see an exact match?</h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Send your resume and profile directly to our talent acquisition desk. We review spontaneous applications on an ongoing basis.
              </p>
            </div>
          </div>
          <a
            href="mailto:careers@richexim.com?subject=Spontaneous%20Application%20-%20Richmount%20Exim"
            className="bg-[#1b4d27] hover:bg-[#2a6e3a] text-white text-xs font-bold px-6 py-3.5 rounded-xl transition shadow-sm whitespace-nowrap"
          >
            Email: careers@richexim.com
          </a>
        </div>
      </section>

      {/* Application Modal */}
      {isApplyModalOpen && selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-8 shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-200 max-h-[95vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-gray-100 gap-2">
              <div className="min-w-0">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2a6e3a] bg-[#e8f3e2] px-2.5 py-0.5 rounded-md">
                  {selectedJob.department}
                </span>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-[#172e18] mt-1.5 truncate">
                  Apply for {selectedJob.title}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5 truncate">
                  {selectedJob.location} • {selectedJob.type}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer shrink-0 ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isSuccess ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-heading text-lg font-bold text-[#172e18]">Application Received!</h4>
                <p className="text-xs text-gray-600 max-w-xs mx-auto">
                  Thank you for applying for <strong>{selectedJob.title}</strong>. Our human resources committee will review your credentials and contact you within 3 business days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplicationSubmit} className="space-y-4 pt-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full bg-[#f9fbf7] text-xs p-3 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#f9fbf7] text-xs p-3 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#f9fbf7] text-xs p-3 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Relevant Experience (Years)</label>
                    <input
                      type="number"
                      min={0}
                      max={35}
                      required
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(Number(e.target.value))}
                      className="w-full bg-[#f9fbf7] text-xs p-3 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">LinkedIn / Resume Link</label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/..."
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      className="w-full bg-[#f9fbf7] text-xs p-3 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Brief Cover Letter / Introduction</label>
                  <textarea
                    rows={3}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Highlight your experience with international trade, commodities, logistics, or biomass engineering..."
                    className="w-full bg-[#f9fbf7] text-xs p-3 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsApplyModalOpen(false)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-[#1b4d27] hover:bg-[#2a6e3a] text-white font-bold px-6 py-2.5 rounded-xl transition shadow-md cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-[#f5b342]" />
                    <span>Submit Application</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
