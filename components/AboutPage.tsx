
import React from 'react';
import { 
  Shield, Target, Globe, Award, Zap, Users, 
  Lock, BarChart3, TrendingUp, CheckCircle2,
  ChevronRight, ArrowUpRight, Scale, Briefcase,
  Quote, ArrowRight
} from 'lucide-react';

import { View, Testimonial, TestimonialType } from '../types';

interface AboutPageProps {
  formatCurrency: (amount: number) => string;
  t: (key: string) => string;
  onNavigate: (view: View, data?: any) => void;
  testimonials: Testimonial[];
}

const AboutPage: React.FC<AboutPageProps> = ({ formatCurrency, t, onNavigate, testimonials }) => {
  const successStories = testimonials.filter(t => t.type === TestimonialType.SUCCESS_STORY).slice(0, 3);
  return (
    <div className="bg-white overflow-hidden">
      {/* 1. IMMERSIVE HERO */}
      <section className="relative min-h-[60vh] md:h-[80vh] flex items-center bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=2070" 
            className="w-full h-full object-cover"
            alt="Corporate Vision"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-20">
          <div className="max-w-3xl">
            <span className="text-emerald-500 font-black uppercase tracking-[0.3em] text-[10px] mb-6 block">{t('established')}</span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 serif leading-[1.1] sm:leading-[0.9] tracking-tighter">
              {t('architectureOfWealth')}
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 max-w-xl leading-relaxed">
              {t('growMilkatMoreThan')}
            </p>
          </div>
        </div>
      </section>

      {/* 2. OUR FOUNDING PHILOSOPHY */}
      <section className="py-16 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 serif mb-6 sm:mb-8 leading-tight">{t('bridgingGap')}</h2>
              <div className="space-y-6 text-slate-600 text-base sm:text-lg leading-relaxed">
                <p>
                  {t('growMilkatBorn')}
                </p>
                <p>
                  {t('foundingMission')}
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070" 
                className="rounded-[3rem] shadow-2xl relative z-10"
                alt="Our Origins"
              />
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE GROW FRAMEWORK (METHODOLOGY) */}
      <section className="py-16 sm:py-32 bg-slate-950 text-white rounded-[2rem] sm:rounded-[4rem] mx-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-500/5 blur-[120px]"></div>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <div className="text-center mb-16 sm:mb-24">
            <span className="text-emerald-500 font-black uppercase tracking-widest text-[10px] sm:text-xs">{t('proprietaryMethodology')}</span>
            <h2 className="text-3xl sm:text-5xl font-bold mt-4 serif">{t('growSelectionModel')}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { step: "G", title: t('governanceCheck'), desc: t('governanceCheckDesc') },
              { step: "R", title: t('riskModeling'), desc: t('riskModelingDesc') },
              { step: "O", title: t('operationalAudit'), desc: t('operationalAuditDesc') },
              { step: "W", title: t('wealthProjection'), desc: t('wealthProjectionDesc') }
            ].map((item, i) => (
              <div key={i} className="group">
                <div className="text-8xl font-black text-white/5 group-hover:text-emerald-500/20 transition-colors mb-[-3rem]">{item.step}</div>
                <h4 className="text-2xl font-bold mb-4 relative z-10">{item.title}</h4>
                <p className="text-slate-400 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. THE SELECTION FUNNEL (METHODOLOGY DETAIL) */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <div className="space-y-4">
                {[
                  { stage: "01", title: "Sourcing & Initial Screening", desc: "We evaluate 500+ opportunities monthly across global markets.", percentage: "100%" },
                  { stage: "02", title: "G.R.O.W. Vetting Protocol", desc: "Deep-dive forensic audit and risk modeling.", percentage: "12%" },
                  { stage: "03", title: "Investment Committee Review", desc: "Final validation by our board of institutional experts.", percentage: "4%" },
                  { stage: "04", title: "Platform Listing", desc: "Only the top-tier assets are made available to our investors.", percentage: "2%" },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-6 p-6 rounded-2xl border border-slate-50 hover:border-emerald-100 hover:bg-emerald-50/30 transition-all group">
                    <div className="text-2xl font-black text-slate-200 group-hover:text-emerald-500 transition-colors">{step.stage}</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900">{step.title}</h4>
                      <p className="text-xs text-slate-500">{step.desc}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-emerald-600 uppercase tracking-widest">Yield Potential</div>
                      <div className="text-lg font-bold text-slate-400">{step.percentage}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="text-emerald-600 font-black uppercase tracking-widest text-[10px] mb-4 block">The Filter</span>
              <h2 className="text-5xl font-bold text-slate-900 mb-8 serif leading-tight">Where Precision <br /> Meets Opportunity</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                Our selection process is designed to be intentionally difficult. By the time an asset reaches your dashboard, it has been scrutinized by forensic accountants, legal experts, and AI-driven risk models.
              </p>
              <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-3xl font-bold mb-2">98%</p>
                  <p className="text-xs text-slate-400 uppercase font-black tracking-widest">Rejection Rate</p>
                </div>
                <div className="absolute top-0 right-0 w-32 h-full bg-emerald-500/10 skew-x-12"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CORE PRINCIPLES */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Shield className="w-8 h-8" />, title: t('precision'), desc: t('precisionDesc') },
              { icon: <Scale className="w-8 h-8" />, title: t('integrity'), desc: t('integrityDesc') },
              { icon: <Zap className="w-8 h-8" />, title: t('agility'), desc: t('agilityDesc') },
              { icon: <Lock className="w-8 h-8" />, title: t('longevity'), desc: t('longevityDesc') }
            ].map((p, i) => (
              <div key={i} className="p-10 border border-slate-100 rounded-[2.5rem] bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all duration-500">
                <div className="text-emerald-600 mb-6">{p.icon}</div>
                <h3 className="text-xl font-bold mb-4 text-slate-900">{p.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. GLOBAL FOOTPRINT (STATS) */}
      <section className="py-16 sm:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-20">
            <div className="lg:w-1/2">
               <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 serif mb-6 sm:mb-8">{t('globalScale')}</h2>
               <p className="text-base sm:text-lg text-slate-600 mb-8 sm:mb-12">{t('ecosystemSpans')}</p>
               <div className="grid grid-cols-2 gap-6 sm:gap-8">
                  <div>
                    <p className="text-3xl sm:text-4xl font-black text-emerald-600">{formatCurrency(1200000000)}+</p>
                    <p className="text-[8px] sm:text-[10px] font-black uppercase text-slate-400 tracking-widest mt-2">{t('assetsUnderManagement')}</p>
                  </div>
                  <div>
                    <p className="text-3xl sm:text-4xl font-black text-slate-900">14k+</p>
                    <p className="text-[8px] sm:text-[10px] font-black uppercase text-slate-400 tracking-widest mt-2">{t('verifiedInvestors')}</p>
                  </div>
                  <div>
                    <p className="text-3xl sm:text-4xl font-black text-slate-900">15+</p>
                    <p className="text-[8px] sm:text-[10px] font-black uppercase text-slate-400 tracking-widest mt-2">{t('jurisdictions')}</p>
                  </div>
                  <div>
                    <p className="text-3xl sm:text-4xl font-black text-emerald-600">92%</p>
                    <p className="text-[8px] sm:text-[10px] font-black uppercase text-slate-400 tracking-widest mt-2">{t('retentionRate')}</p>
                  </div>
               </div>
            </div>
            <div className="lg:w-1/2 relative w-full mt-12 lg:mt-0">
               <div className="p-6 sm:p-8 bg-white rounded-[2rem] sm:rounded-[3rem] shadow-2xl border border-slate-100 relative z-10">
                  <Globe className="w-full h-auto text-emerald-600 opacity-10 absolute inset-0 p-12 sm:p-20" />
                  <div className="space-y-4 sm:space-y-6 relative z-20">
                     <div className="flex justify-between items-center p-3 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl">
                        <span className="font-bold text-sm sm:text-base">{t('europeanHospitality')}</span>
                        <span className="text-emerald-600 font-black text-sm sm:text-base">42%</span>
                     </div>
                     <div className="flex justify-between items-center p-3 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl">
                        <span className="font-bold text-sm sm:text-base">{t('asianTechVC')}</span>
                        <span className="text-emerald-600 font-black text-sm sm:text-base">28%</span>
                     </div>
                     <div className="flex justify-between items-center p-3 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl">
                        <span className="font-bold text-sm sm:text-base">{t('americanMultiFamily')}</span>
                        <span className="text-emerald-600 font-black text-sm sm:text-base">30%</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. LEADERSHIP & VISION */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <span className="text-emerald-600 font-black uppercase tracking-widest text-xs">{t('strategicGovernance')}</span>
            <h2 className="text-5xl font-bold mt-4 serif tracking-tight text-slate-900">{t('guidedByExperience')}</h2>
            <p className="mt-6 text-slate-500 max-w-2xl mx-auto text-lg">
              Our leadership team brings together decades of experience from top-tier global financial institutions and technology firms.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 lg:gap-20">
             {[
               { 
                 name: "Julian Vance", 
                 role: "Chief Investment Officer", 
                 img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
                 bio: "Former Managing Director at Goldman Sachs with 20+ years in global real estate and private equity."
               },
               { 
                 name: "Sophia Chen", 
                 role: "Head of Private Equity", 
                 img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
                 bio: "Ex-BlackRock strategist specializing in emerging market hospitality and infrastructure assets."
               },
               { 
                 name: "Marcus Thorne", 
                 role: "Chief Compliance Officer", 
                 img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
                 bio: "Legal expert with a background in SEBI and SEC regulatory frameworks for alternative investments."
               }
             ].map((leader, i) => (
               <div key={i} className="group">
                  <div className="relative mb-8 overflow-hidden rounded-[2rem]">
                    <img 
                      src={leader.img} 
                      className="w-full aspect-square object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
                      alt={leader.name} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900 mb-2">{leader.name}</h4>
                  <p className="text-emerald-600 font-black uppercase text-[10px] tracking-widest mb-4">{leader.role}</p>
                  <p className="text-slate-500 text-sm leading-relaxed">{leader.bio}</p>
               </div>
             ))}
          </div>
          <div className="mt-20 text-center">
             <button 
               onClick={() => onNavigate('our-team')}
               className="inline-flex items-center px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition shadow-2xl group"
             >
               Meet the Full Executive Team
               <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
        </div>
      </section>

      {/* 7. INSTITUTIONAL GOVERNANCE */}
      <section className="py-32 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="md:w-1/3">
                 <div className="w-24 h-24 bg-emerald-100 rounded-3xl flex items-center justify-center text-emerald-600 mb-8">
                    <Scale className="w-12 h-12" />
                 </div>
                 <h2 className="text-4xl font-bold text-slate-900 serif">{t('regulatoryRobustness')}</h2>
              </div>
              <div className="md:w-2/3 grid md:grid-cols-2 gap-10">
                 <div className="space-y-4">
                    <h4 className="font-bold text-lg">{t('spvIsolation')}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">{t('spvIsolationDesc')}</p>
                 </div>
                 <div className="space-y-4">
                    <h4 className="font-bold text-lg">{t('independentAudits')}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">{t('independentAuditsDesc')}</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 8. THE DIGITAL EDGE (AI) */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
             <div className="lg:w-1/2">
                <div className="inline-flex items-center px-4 py-2 bg-emerald-50 rounded-full text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-6">
                   <Zap className="w-4 h-4 mr-2" /> {t('geminiPowered')}
                </div>
                <h2 className="text-5xl font-bold text-slate-900 serif mb-8 leading-tight">{t('insightBeyond')}</h2>
                <p className="text-lg text-slate-600 leading-relaxed mb-8">
                  {t('integrateGemini')}
                </p>
                <div className="flex items-center gap-3 text-slate-900 font-bold hover:text-emerald-600 transition cursor-pointer">
                   {t('exploreTechStack')} <ArrowUpRight className="w-5 h-5" />
                </div>
             </div>
             <div className="lg:w-1/2">
                <div className="bg-slate-950 p-12 rounded-[3rem] text-white shadow-2xl relative">
                   <BarChart3 className="w-24 h-24 text-emerald-500 mb-8 opacity-20 absolute top-10 right-10" />
                   <div className="space-y-8 relative z-10">
                      <div className="h-2 w-1/2 bg-emerald-500 rounded-full"></div>
                      <p className="text-slate-400 text-sm italic">"The integration of generative intelligence allows us to model risk scenarios with 98.4% higher fidelity than legacy spreadsheet models."</p>
                      <div className="pt-4 border-t border-white/10">
                         <p className="font-bold">{t('aiComplianceEngine')}</p>
                         <p className="text-[10px] text-slate-500 uppercase font-black">{t('activeMonitoring')}</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 9. SUCCESS STORIES (INTEGRATED) */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <span className="text-emerald-600 font-black uppercase tracking-widest text-xs mb-4 block">Proven Results</span>
              <h2 className="text-5xl font-bold text-slate-900 serif leading-tight">Investor Success Stories</h2>
              <p className="mt-6 text-slate-500 text-lg">
                Real results from our global community of institutional and private investors.
              </p>
            </div>
            <button 
              onClick={() => onNavigate('testimonials')}
              className="group flex items-center gap-3 px-8 py-4 bg-slate-50 text-slate-900 rounded-2xl font-bold hover:bg-emerald-500 hover:text-black transition-all duration-300"
            >
              View All Stories
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, i) => (
              <div 
                key={i} 
                className="group relative bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 hover:bg-white hover:shadow-2xl transition-all duration-500 cursor-pointer"
                onClick={() => onNavigate('testimonial-detail', story)}
              >
                <div className="flex items-center gap-4 mb-8">
                  <img 
                    src={story.avatar} 
                    className="w-14 h-14 rounded-full border-2 border-emerald-500/20" 
                    alt={story.name} 
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900">{story.name}</h4>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{story.role}</p>
                  </div>
                </div>
                <div className="mb-8">
                  <Quote className="w-10 h-10 text-emerald-500/20 mb-4" />
                  <p className="text-slate-600 text-sm leading-relaxed italic line-clamp-3">
                    "{story.textTestimonial}"
                  </p>
                </div>
                <div className="pt-8 border-t border-slate-200 flex justify-between items-center">
                  <div>
                    <p className="text-[8px] text-slate-400 uppercase font-black tracking-widest mb-1">ROI Achieved</p>
                    <p className="text-xl font-black text-emerald-600">{story.successStory?.roi}</p>
                  </div>
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. STRATEGIC ECOSYSTEM */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-16">{t('institutionalPartnerships')}</p>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-12 items-center grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition duration-700">
              <div className="flex justify-center">
                <img 
                  src="https://logo.clearbit.com/citadel.com" 
                  alt="Citadel" 
                  className="h-8 sm:h-12 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-2xl font-black tracking-tighter italic">CITADEL</span>';
                  }}
                />
              </div>
              <div className="flex justify-center">
                <img 
                  src="https://logo.clearbit.com/morganstanley.com" 
                  alt="Morgan Stanley" 
                  className="h-8 sm:h-12 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-2xl font-black">MORGAN STANLEY</span>';
                  }}
                />
              </div>
              <div className="flex justify-center">
                <img 
                  src="https://logo.clearbit.com/blackrock.com" 
                  alt="BlackRock" 
                  className="h-8 sm:h-12 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-2xl font-serif font-bold italic underline decoration-emerald-500">BlackRock</span>';
                  }}
                />
              </div>
              <div className="flex justify-center">
                <img 
                  src="https://logo.clearbit.com/bridgewater.com" 
                  alt="Bridgewater" 
                  className="h-8 sm:h-12 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-2xl font-black tracking-widest">BRIDGEWATER</span>';
                  }}
                />
              </div>
           </div>
        </div>
      </section>

      {/* 11. FINAL INVITATION (CTA) */}
      <section className="py-20 sm:py-32 bg-emerald-600 relative overflow-hidden rounded-t-[3rem] sm:rounded-t-[5rem]">
         <div className="max-w-4xl mx-auto px-6 sm:px-8 relative z-10 text-center text-white">
            <h2 className="text-4xl sm:text-6xl font-bold mb-6 sm:mb-8 serif">{t('investInExceptionalAbout')}</h2>
            <p className="text-lg sm:text-xl text-emerald-50 mb-8 sm:mb-12 opacity-90 leading-relaxed">
              {t('joinEliteCircle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <button className="w-full sm:w-auto px-10 sm:px-12 py-4 sm:py-5 bg-white text-emerald-600 rounded-2xl font-black text-lg sm:text-xl hover:bg-slate-50 transition shadow-2xl">
                 {t('openAccount')}
              </button>
              <button className="w-full sm:w-auto px-10 sm:px-12 py-4 sm:py-5 bg-emerald-700 text-white rounded-2xl font-black text-lg sm:text-xl hover:bg-emerald-800 transition">
                 {t('speakWithAdvisor')}
              </button>
            </div>
         </div>
         <div className="absolute inset-0 bg-slate-950/10 pointer-events-none"></div>
      </section>
    </div>
  );
};

export default AboutPage;
