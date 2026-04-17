import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, MapPin, Phone, Mail, ShieldCheck, Building2, ExternalLink, Users, X, Briefcase, Award, CheckCircle2 } from 'lucide-react';
import { Partner } from '../types';

interface OurPartnersPageProps {
  partners: Partner[];
}

const OurPartnersPage: React.FC<OurPartnersPageProps> = ({ partners }) => {
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  if (selectedPartner) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header / Navigation */}
        <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 sticky top-0 z-50 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center p-3 border border-slate-100 shadow-sm">
              {selectedPartner.logo ? (
                <img src={selectedPartner.logo} alt={selectedPartner.legalCompanyName} className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
              ) : (
                <Building2 className="w-8 h-8 text-slate-300" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 serif">{selectedPartner.legalCompanyName}</h2>
              <div className="flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-widest">
                <Globe className="w-3 h-3" />
                <span>Verified Strategic Partner</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedPartner(null);
              window.scrollTo(0, 0);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 rounded-2xl text-slate-600 font-bold transition-all shadow-sm border border-slate-100"
          >
            <X className="w-5 h-5" />
            <span>Back to Partners</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-10">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* 1. Company Overview */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-wider">Company Overview</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Legal Company Name</label>
                    <p className="text-xl font-bold text-slate-900 serif">{selectedPartner.legalCompanyName}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Business Type</label>
                    <p className="text-lg font-bold text-emerald-600">{selectedPartner.businessType || 'Not Specified'}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Company Logo</label>
                    <div className="w-24 h-24 bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-center shadow-sm">
                      {selectedPartner.logo ? (
                        <img src={selectedPartner.logo} alt="Logo" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                      ) : (
                        <Building2 className="w-10 h-10 text-slate-300" />
                      )}
                    </div>
                  </div>
                  {selectedPartner.associatedAssets && selectedPartner.associatedAssets.length > 0 && (
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Associated Assets</label>
                      <div className="flex flex-wrap gap-2">
                        {selectedPartner.associatedAssets.map((asset, i) => (
                          <span key={i} className="px-3 py-1 bg-white text-blue-600 rounded-lg text-[10px] font-black border border-blue-100 shadow-sm uppercase tracking-wider">
                            {asset}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* 2. About the Company */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-wider">About the Company</h3>
              </div>
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                <p className="text-slate-600 text-lg leading-relaxed serif italic">
                  {selectedPartner.about ? `"${selectedPartner.about}"` : `"${selectedPartner.legalCompanyName} is a premier strategic partner specializing in institutional-grade asset management and financial services. Our collaboration ensures that every investment opportunity on the Grow Milkat platform meets the highest standards of due diligence and operational integrity."`}
                </p>
              </div>
            </section>

            {/* 3. Contact Information */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-wider">Contact Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Email Address</label>
                    <p className="text-sm font-bold text-slate-900">{selectedPartner.email}</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Phone Number</label>
                    <p className="text-sm font-bold text-slate-900">{selectedPartner.phone}</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <Globe className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Website</label>
                    <a href={selectedPartner.website} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">
                      {selectedPartner.website.replace(/^https?:\/\//, '')} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Registered Address */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-wider">Registered Address</h3>
              </div>
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Full Address</label>
                    <p className="text-slate-900 font-medium leading-relaxed">{selectedPartner.address.fullAddress}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">City</label>
                      <p className="text-slate-900 font-bold">{selectedPartner.address.city}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">State</label>
                      <p className="text-slate-900 font-bold">{selectedPartner.address.state}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Country</label>
                      <p className="text-slate-900 font-bold">{selectedPartner.address.country}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Pincode</label>
                      <p className="text-slate-900 font-bold">{selectedPartner.address.pincode}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. Legal Information */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-wider">Legal Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 flex items-center justify-between">
                  <div>
                    <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-1">PAN Number</label>
                    <p className="text-xl font-black text-emerald-900 tracking-widest">{selectedPartner.panNumber}</p>
                  </div>
                  <div className="px-3 py-1 bg-emerald-600 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">Verified</div>
                </div>
                <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 flex items-center justify-between">
                  <div>
                    <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-1">GST Number</label>
                    <p className="text-xl font-black text-emerald-900 tracking-widest">{selectedPartner.gstNumber}</p>
                  </div>
                  <div className="px-3 py-1 bg-emerald-600 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">Active</div>
                </div>
              </div>
            </section>

            {/* 6. Partner Team */}
            <section className="pb-20">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-wider">Partner Team</h3>
              </div>
              <div className="space-y-6">
                {selectedPartner.team.map((member, i) => (
                  <div key={member.id || i} className="bg-slate-50 rounded-[2.5rem] border border-slate-100 overflow-hidden">
                    <div className="p-8">
                      <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest mb-6">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                        🔹 Team Member
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-3 space-y-4">
                          <div className="aspect-square rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-white">
                            <img src={member.photo || `https://picsum.photos/seed/${member.name}/400/400`} alt={member.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          {member.signature && (
                            <div className="p-4 bg-white rounded-2xl border border-slate-200">
                              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-2">Digital Signature</label>
                              <img src={member.signature} alt="Signature" className="h-12 object-contain mx-auto grayscale opacity-70" referrerPolicy="no-referrer" />
                            </div>
                          )}
                        </div>
                        <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Full Name</label>
                            <p className="text-xl font-bold text-slate-900 serif">{member.name}</p>
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Designation</label>
                            <p className="text-lg font-bold text-blue-600">{member.designation || member.role}</p>
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Email</label>
                            <p className="text-sm font-bold text-slate-700">{member.email}</p>
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Phone</label>
                            <p className="text-sm font-bold text-slate-700">{member.phone}</p>
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Address</label>
                            <p className="text-sm text-slate-600 leading-relaxed">{member.address}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 md:p-8 bg-slate-900 text-white flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-bold">Grow Milkat Verified Partner</p>
              <p className="text-xs text-slate-400">Due diligence completed on Mar 2026</p>
            </div>
          </div>
          <button 
            onClick={() => {
              setSelectedPartner(null);
              window.scrollTo(0, 0);
            }}
            className="px-8 py-3 bg-white text-slate-900 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all"
          >
            Back to Partners List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-bold uppercase tracking-widest mb-6"
          >
            <ShieldCheck className="w-4 h-4" />
            Trusted Network
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold serif mb-6"
          >
            Our Strategic Partners
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto"
          >
            We collaborate with industry-leading organizations to ensure the highest standards of security, compliance, and operational excellence for our investors.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => {
                setSelectedPartner(partner);
                window.scrollTo(0, 0);
              }}
              className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group cursor-pointer"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center p-4 border border-slate-100 shadow-inner group-hover:scale-105 transition-transform duration-500">
                    {partner.logo ? (
                      <img src={partner.logo} alt={partner.legalCompanyName} className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                    ) : (
                      <Building2 className="w-10 h-10 text-slate-300" />
                    )}
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all">
                    <ExternalLink className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2 serif">{partner.legalCompanyName}</h3>
                <div className="flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-widest mb-6">
                  <Globe className="w-3 h-3" />
                  <span>Verified Partner</span>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {partner.address.fullAddress}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <p className="text-sm text-slate-500">{partner.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <p className="text-sm text-slate-500">{partner.phone}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-600">{partner.team.length} Team Members</span>
                  </div>
                  <div className="flex -space-x-2">
                    {partner.team.slice(0, 3).map((member, i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                        <img src={`https://picsum.photos/seed/${member.name}/100/100`} alt={member.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    ))}
                    {partner.team.length > 3 && (
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-900 flex items-center justify-center text-[10px] font-bold text-white">
                        +{partner.team.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Compliance Badges */}
              <div className="px-8 py-4 bg-slate-50/50 flex gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PAN Verified</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GST Compliant</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 p-12 bg-white rounded-[3rem] border border-slate-100 shadow-sm text-center"
        >
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 serif mb-4">Our Commitment to Transparency</h2>
          <p className="text-slate-500 max-w-2xl mx-auto mb-10">
            Every partner on our platform undergoes a rigorous due diligence process. We verify legal standing, financial stability, and operational history to ensure your investments are managed by the best in the industry.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm font-bold text-slate-700">ISO Certified</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm font-bold text-slate-700">SEBI Registered</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm font-bold text-slate-700">GDPR Compliant</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OurPartnersPage;
