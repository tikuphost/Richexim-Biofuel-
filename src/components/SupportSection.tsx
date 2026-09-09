import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Building2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SupportSection: React.FC = () => {
  const { submitInquiry, products, currentUser } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [company, setCompany] = useState(currentUser.company);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState('+91 8921517645');
  const [commodity, setCommodity] = useState('Wood Chips (Screened G30/G50)');
  const [estimatedTonnage, setEstimatedTonnage] = useState('100 MT');
  const [message, setMessage] = useState('Inquiring about monthly CIF contract supply to Rotterdam.');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitInquiry({
      name,
      company,
      email,
      phone,
      commodity,
      estimatedTonnage,
      message
    });
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setMessage('');
    }, 3000);
  };

  return (
    <section id="contact" className="py-16 bg-[#f9fbf7] border-t border-[#e3ede0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#2a6e3a] uppercase tracking-wider bg-[#e8f3e2] px-3.5 py-1 rounded-full mb-3">
            <MessageSquare className="w-3.5 h-3.5 text-[#2a6e3a]" />
            <span>Commercial Inquiries &amp; Global Support</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#1b4d27] tracking-tight">
            Connect with our Commercial Trade Team
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mt-2">
            Reach out directly for sample dispatches, bulk commodity supply contracts, or technical boiler consultations.
          </p>
        </div>

        {/* Contact Grid: Form & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Contact Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#1b4d27] to-[#132c18] text-white rounded-3xl p-8 shadow-xl flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#f5b342] block mb-2">
                Richexim Group Headquarters
              </span>
              <h3 className="font-heading text-2xl font-black tracking-tight mb-4">
                Richmount Exim International
              </h3>
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed mb-6">
                Specialized Manufacturers, Processors &amp; Exporters of Biofuels, Biomass Energy Alternatives, Coconut Charcoal, and Industrial Activated Carbon.
              </p>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-[#f5b342]" />
                  </div>
                  <div>
                    <span className="font-bold block text-white">Registered Corporate Hub</span>
                    <span className="text-white/80">Door No. 14/280, Commercial Port Corridor, Cochin / Mumbai, India</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-[#f5b342]" />
                  </div>
                  <div>
                    <span className="font-bold block text-white">Corporate Inquiries</span>
                    <span className="text-white/80">info@richexim.com • richmount.pvt@outlook.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-[#f5b342]" />
                  </div>
                  <div>
                    <span className="font-bold block text-white">International Trade Desk &amp; WhatsApp</span>
                    <span className="text-white/80">+91 8921517645 (24/7 Response Desk)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-[#f5b342]" />
                  </div>
                  <div>
                    <span className="font-bold block text-white">Export Hours &amp; Timezone</span>
                    <span className="text-white/80">08:00 – 20:00 IST (UTC +5:30) • Operations 7 Days</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/15 text-[11px] text-white/70">
              <span className="font-semibold text-white">Export Seaports:</span> Nhava Sheva (JNPT Mumbai), Cochin Port, Chennai, Mundra Port.
            </div>
          </div>

          {/* Right Inquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-[#e3ede0] shadow-sm">
            <h3 className="font-heading text-xl font-bold text-[#1b4d27] mb-1">
              Submit Direct Export Inquiry
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Our export commercial officers respond with proforma pricing within 4 business hours.
            </p>

            {isSuccess ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#e8f3e2] text-[#2a6e3a] mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-heading text-lg font-bold text-[#1b4d27]">
                  Inquiry Transmitted Successfully
                </h4>
                <p className="text-xs text-gray-600 max-w-sm mx-auto">
                  Thank you. An international sales executive has been assigned to your request and will follow up shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#f9fbf7] text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Company / Organization *</label>
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full bg-[#f9fbf7] text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Business Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#f9fbf7] text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Phone / WhatsApp *</label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#f9fbf7] text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Commodity of Interest</label>
                    <select
                      value={commodity}
                      onChange={(e) => setCommodity(e.target.value)}
                      className="w-full bg-[#f9fbf7] text-xs px-3.5 py-2.5 rounded-xl border border-gray-300"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Estimated Volume (MT / Containers)</label>
                    <input
                      type="text"
                      value={estimatedTonnage}
                      onChange={(e) => setEstimatedTonnage(e.target.value)}
                      className="w-full bg-[#f9fbf7] text-xs px-3.5 py-2.5 rounded-xl border border-gray-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Trade Requirements &amp; Destination Port</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Specify target delivery port (e.g. Rotterdam, Jebel Ali), desired delivery timeframe, and any specific laboratory tolerances..."
                    className="w-full bg-[#f9fbf7] text-xs px-3.5 py-2 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-[#2a6e3a] hover:bg-[#1b4d27] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-[#f5b342]" />
                    <span>Send Commercial Inquiry</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
