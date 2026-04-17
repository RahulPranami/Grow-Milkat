
import React from 'react';
import { 
  Shield, BarChart4, Handshake, Globe, Zap, 
  Lock, PieChart, Scale, Briefcase, Search, 
  Award, Activity, Cpu, Layers, CheckCircle, 
  ArrowRight, ShieldCheck, TrendingUp
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

const PERFORMANCE_DATA = [
  { year: '2020', value: 4.2 },
  { year: '2021', value: 7.8 },
  { year: '2022', value: 11.4 },
  { year: '2023', value: 13.1 },
  { year: '2024', value: 14.2 },
  { year: '2025', value: 16.5 },
];

interface WhyChooseUsProps {
  formatCurrency: (amount: number) => string;
  t: (key: string) => string;
}

const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ formatCurrency, t }) => {
  return (
    <div className="bg-white overflow-hidden">
      {/* 1. STRATEGIC HERO */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 bg-slate-50 border-b border-slate-100 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=2074" 
            className="w-full h-full object-cover opacity-[0.03]"
            alt="Institutional Background"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-left">
              <span className="text-emerald-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4 sm:mb-6 block">{t('institutionalEdge')}</span>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-slate-900 mb-6 sm:mb-8 serif tracking-tight">
                {t('designedForPrecision').split('.')[0]} <span className="text-emerald-600 italic">{t('designedForPrecision').split('.')[1] || '.'}</span> <br className="hidden sm:block" />
                {t('builtForScale').split('.')[0]} <span className="text-slate-950">{t('builtForScale').split('.')[1] || '.'}</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 max-w-xl leading-relaxed mb-8 sm:mb-10">
                {t('dismantleBarriers')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="px-6 py-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{t('assetsUnderMgmt')}</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900">{formatCurrency(1420000000)}</p>
                </div>
                <div className="px-6 py-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{t('avgAnnualYield')}</p>
                  <p className="text-xl sm:text-2xl font-bold text-emerald-600">14.2%</p>
                </div>
              </div>
            </div>
            
            <div className="relative mt-12 lg:mt-0">
              <div className="bg-white p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl border border-slate-100 relative z-10">
                <div className="flex justify-between items-center mb-6 sm:mb-8">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">{t('yieldPerformance')}</h3>
                    <p className="text-[10px] sm:text-xs text-slate-400 font-medium">{t('historicalNetIRR')}</p>
                  </div>
                  <div className="p-2 sm:p-3 bg-emerald-50 rounded-xl sm:rounded-2xl">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                  </div>
                </div>
                
                <div className="h-[250px] sm:h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={PERFORMANCE_DATA}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="year" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                        dy={10}
                      />
                      <YAxis hide />
                      <Tooltip 
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{ 
                          borderRadius: '16px', 
                          border: 'none', 
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                          padding: '12px'
                        }}
                      />
                      <Bar 
                        dataKey="value" 
                        radius={[6, 6, 0, 0]} 
                        barSize={40}
                      >
                        {PERFORMANCE_DATA.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={index === PERFORMANCE_DATA.length - 1 ? '#10b981' : '#e2e8f0'} 
                            className="transition-all duration-500 hover:fill-emerald-400"
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-8 pt-8 border-t border-slate-50 flex justify-between items-center">
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <img 
                        key={i}
                        src={`https://i.pravatar.cc/150?u=${i + 20}`} 
                        className="w-10 h-10 rounded-full border-4 border-white shadow-sm"
                        alt="Investor"
                      />
                    ))}
                    <div className="w-10 h-10 rounded-full bg-slate-100 border-4 border-white flex items-center justify-center text-[10px] font-black text-slate-400">
                      +14k
                    </div>
                  </div>
                  <p className="text-xs font-bold text-slate-500">{t('joinedByElite')}</p>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl z-0"></div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-slate-200/50 rounded-full blur-3xl z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE SECURITY FORTRESS */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="order-1">
              <span className="text-emerald-600 font-black uppercase tracking-widest text-[10px] mb-4 block">{t('safetyProtocol')}</span>
              <h2 className="text-5xl font-bold text-slate-900 mb-8 serif">{t('bankGradeArchitecture').split('.')[0]} <br /> {t('bankGradeArchitecture').split('.')[1] || ''}</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                {t('capitalSafetyObjective')}
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  t('independentCustody'),
                  t('realTimeFraudDetection'),
                  t('annualPenetrationTesting')
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-bold text-slate-800 text-sm">
                    <CheckCircle className="w-5 h-5 text-emerald-500" /> {item}
                  </li>
                ))}
              </ul>
              <div className="relative rounded-3xl overflow-hidden h-48 border border-slate-100 shadow-inner bg-slate-50">
                <img 
                  src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800" 
                  className="w-full h-full object-cover opacity-50 mix-blend-overlay"
                  alt="Cybersecurity"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="px-6 py-3 bg-white/90 backdrop-blur rounded-2xl shadow-xl flex items-center gap-3">
                    <Shield className="w-6 h-6 text-emerald-600" />
                    <span className="font-black text-xs uppercase tracking-widest text-slate-900">{t('encryptedInfrastructure')}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-2">
              <div className="grid grid-cols-2 gap-6">
                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-300 group">
                  <Lock className="w-10 h-10 text-emerald-600 mb-6 group-hover:scale-110 transition-transform" />
                  <h4 className="font-bold text-slate-900 mb-2">{t('aes256')}</h4>
                  <p className="text-xs text-slate-500">{t('aes256Desc')}</p>
                </div>
                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-300 group">
                  <ShieldCheck className="w-10 h-10 text-emerald-600 mb-6 group-hover:scale-110 transition-transform" />
                  <h4 className="font-bold text-slate-900 mb-2">{t('spvIsolationWhy')}</h4>
                  <p className="text-xs text-slate-500">{t('spvIsolationWhyDesc')}</p>
                </div>
                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-300 group">
                  <Cpu className="w-10 h-10 text-emerald-600 mb-6 group-hover:scale-110 transition-transform" />
                  <h4 className="font-bold text-slate-900 mb-2">{t('smartContracts')}</h4>
                  <p className="text-xs text-slate-500">{t('smartContractsDesc')}</p>
                </div>
                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-300 group">
                  <Layers className="w-10 h-10 text-emerald-600 mb-6 group-hover:scale-110 transition-transform" />
                  <h4 className="font-bold text-slate-900 mb-2">{t('multiFactor')}</h4>
                  <p className="text-xs text-slate-500">{t('multiFactorDesc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ALPHA GENERATION (PERFORMANCE) */}
      <section className="py-16 sm:py-32 bg-slate-950 text-white rounded-[2rem] sm:rounded-[4rem] mx-4 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-emerald-500/5 blur-[120px]"></div>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 sm:gap-12">
            <div className="max-w-2xl">
              <span className="text-emerald-500 font-black uppercase tracking-widest text-[10px] sm:text-xs mb-4 block">{t('yieldPerformance')}</span>
              <h2 className="text-3xl sm:text-5xl font-bold serif mb-6 sm:mb-8">{t('pursuitOfAlpha')}</h2>
              <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
                {t('engineerReturns')}
              </p>
            </div>
            <div className="flex gap-6 sm:gap-8">
              <div className="text-center">
                <p className="text-4xl sm:text-6xl font-black text-emerald-500">14.2%</p>
                <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mt-2">{t('avgIRR')}</p>
              </div>
              <div className="text-center border-l border-white/10 pl-6 sm:pl-8">
                <p className="text-4xl sm:text-6xl font-black text-white">{formatCurrency(1200000000)}</p>
                <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mt-2">{t('capDeployed')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE 50-POINT VETTING PROTOCOL */}
      <section className="py-16 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-24">
            <h2 className="text-3xl sm:text-5xl font-bold serif text-slate-900">{t('vettingProtocol')}</h2>
            <p className="text-slate-500 mt-4 text-sm sm:text-base">{t('rejectProjects')}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-12">
            {[
              { 
                icon: <Search className="w-6 h-6 sm:w-8 sm:h-8" />, 
                title: t('forensicAudit'), 
                desc: t('forensicAuditDesc') 
              },
              { 
                icon: <Globe className="w-6 h-6 sm:w-8 sm:h-8" />, 
                title: t('macroAnalysis'), 
                desc: t('macroAnalysisDesc') 
              },
              { 
                icon: <Activity className="w-6 h-6 sm:w-8 sm:h-8" />, 
                title: t('onSiteValidation'), 
                desc: t('onSiteValidationDesc') 
              }
            ].map((step, i) => (
              <div key={i} className="group p-8 sm:p-10 bg-slate-50 rounded-[2rem] sm:rounded-[3rem] hover:bg-white hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-slate-100">
                <div className="text-emerald-600 mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-500">{step.icon}</div>
                <h4 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">{step.title}</h4>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. DATA-FIRST ARCHITECTURE */}
      <section className="py-16 sm:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-3xl sm:text-5xl font-bold serif text-slate-900 mb-6 sm:mb-8">{t('intelligenceYouCanSee').split(' ').slice(0, 2).join(' ')} <br /> {t('intelligenceYouCanSee').split(' ').slice(2).join(' ')}</h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6 sm:mb-8">
                {t('legacyBlackBox')}
              </p>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 sm:p-3 bg-white rounded-xl shadow-sm"><BarChart4 className="w-5 h-5 sm:w-6 h-6 text-emerald-600" /></div>
                  <span className="font-bold text-slate-800 text-sm sm:text-base">{t('realTimeIRR')}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 sm:p-3 bg-white rounded-xl shadow-sm"><PieChart className="w-5 h-5 sm:w-6 h-6 text-emerald-600" /></div>
                  <span className="font-bold text-slate-800 text-sm sm:text-base">{t('automatedTaxReporting')}</span>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 bg-white p-4 rounded-[2rem] sm:rounded-[3rem] shadow-2xl border border-slate-100 relative overflow-hidden mt-8 lg:mt-0">
               <div className="p-6 sm:p-8 space-y-4 sm:space-y-6">
                  <div className="h-4 w-1/2 bg-slate-100 rounded-full"></div>
                  <div className="flex gap-4">
                     <div className="h-24 sm:h-32 flex-1 bg-emerald-50 rounded-xl sm:rounded-2xl border border-emerald-100"></div>
                     <div className="h-24 sm:h-32 flex-1 bg-slate-50 rounded-xl sm:rounded-2xl"></div>
                  </div>
                  <div className="space-y-2">
                     <div className="h-3 w-full bg-slate-50 rounded-full"></div>
                     <div className="h-3 w-3/4 bg-slate-50 rounded-full"></div>
                  </div>
               </div>
               <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. THE GEMINI AI ADVANTAGE */}
      <section className="py-16 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-16 bg-slate-900 rounded-[2rem] sm:rounded-[4rem] text-white flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px]"></div>
            <div className="lg:w-2/3 relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-500 rounded-lg"><Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" /></div>
                <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em]">{t('aiRiskModeling')}</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold mb-6 serif">{t('predictionNotObservation')}</h3>
              <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
                {t('processDataPoints')}
              </p>
            </div>
            <div className="lg:w-1/3 flex justify-center relative z-10 mt-8 lg:mt-0">
              <div className="w-32 h-32 sm:w-48 sm:h-48 border-4 border-emerald-500/20 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-24 h-24 sm:w-32 sm:h-32 border-2 border-emerald-500/40 rounded-full flex items-center justify-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-500 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.5)]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. GLOBAL DIVERSIFICATION */}
      <section className="py-16 sm:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold serif text-slate-900 mb-12 sm:20">{t('worldOfOpportunity')}</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { val: "15+", label: t('countries') },
              { val: "4", label: t('assetClasses') },
              { val: "24/7", label: t('trading') },
              { val: "0", label: t('complexity') }
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <p className="text-4xl sm:text-5xl font-black text-emerald-600">{stat.val}</p>
                <p className="text-[8px] sm:text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. LIQUIDITY & SECONDARY MARKETS */}
      <section className="py-16 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div>
              <h2 className="text-3xl sm:text-5xl font-bold serif text-slate-900 mb-6 sm:mb-8">{t('fractionalFreedom').split(' ')[0]} <br /> {t('fractionalFreedom').split(' ')[1] || ''}</h2>
              <p className="text-base sm:text-lg text-slate-600 mb-6 sm:mb-8 leading-relaxed">
                {t('privateMarketLockups')}
              </p>
              <button className="flex items-center gap-3 font-black text-emerald-600 uppercase text-[10px] tracking-widest hover:gap-5 transition-all">
                {t('exploreSecondaryMarket')} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="relative mt-8 lg:mt-0">
              <div className="aspect-square bg-slate-950 rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 flex flex-col justify-between overflow-hidden">
                <div className="h-2 w-2/3 bg-white/20 rounded-full"></div>
                <div className="space-y-4">
                  <div className="flex justify-between text-emerald-400 font-black text-xl sm:text-2xl">
                    <span>{t('bid')}: {formatCurrency(5200)}</span>
                    <span>{t('ask')}: {formatCurrency(5300)}</span>
                  </div>
                  <div className="h-1 w-full bg-emerald-500/20 rounded-full relative overflow-hidden">
                    <div className="absolute top-0 left-0 h-full w-1/3 bg-emerald-500"></div>
                  </div>
                </div>
                <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 blur-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. INSTITUTIONAL GOVERNANCE */}
      <section className="py-16 sm:py-32 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12 sm:gap-16 items-start">
            <div className="space-y-4 sm:space-y-6">
              <Scale className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-600" />
              <h4 className="text-xl sm:text-2xl font-bold serif">{t('legalIntegrity')}</h4>
              <p className="text-slate-500 text-xs sm:text-sm">{t('legalIntegrityDesc')}</p>
            </div>
            <div className="space-y-4 sm:space-y-6">
              <Award className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-600" />
              <h4 className="text-xl sm:text-2xl font-bold serif">{t('certifiedAuditors')}</h4>
              <p className="text-slate-500 text-xs sm:text-sm">{t('certifiedAuditorsDesc')}</p>
            </div>
            <div className="space-y-4 sm:space-y-6">
              <Briefcase className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-600" />
              <h4 className="text-xl sm:text-2xl font-bold serif">{t('spvManagement')}</h4>
              <p className="text-slate-500 text-xs sm:text-sm">{t('spvManagementDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. THE GROW MILKAT PROMISE (CTA) */}
      <section className="py-24 sm:py-40 bg-white relative">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
          <h2 className="text-4xl sm:text-6xl font-bold text-slate-900 serif mb-6 sm:mb-8 leading-tight">{t('portfolioRedefined').split(',')[0]} <br /> {t('portfolioRedefined').split(',')[1] || ''}</h2>
          <p className="text-lg sm:text-xl text-slate-500 mb-10 sm:mb-12">
            {t('decisionToInvest')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <button className="px-8 sm:px-12 py-4 sm:py-5 bg-emerald-600 text-white rounded-xl sm:rounded-2xl font-black text-lg sm:text-xl hover:bg-emerald-700 transition shadow-2xl shadow-emerald-200">
              {t('openAccount')}
            </button>
            <button className="px-8 sm:px-12 py-4 sm:py-5 bg-slate-900 text-white rounded-xl sm:rounded-2xl font-black text-lg sm:text-xl hover:bg-slate-800 transition shadow-xl">
              {t('speakWithAdvisor')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhyChooseUs;
