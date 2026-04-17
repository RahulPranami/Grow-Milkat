
import React, { useState, useEffect } from 'react';
import { View, Testimonial, TestimonialType } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from './Skeleton';
import { 
  ArrowRight, Building2, Hotel, Rocket, ShieldCheck, Users, 
  ChevronDown, ChevronUp, Briefcase, Wallet, ArrowUpRight, 
  Zap, Lock, Globe2, Star, Quote, CheckCircle2, ChevronLeft, 
  ChevronRight as ChevronRightIcon, LayoutGrid, Home, Map, 
  PieChart, Calculator, MessageSquare, HelpCircle, Check,
  Target, TrendingUp, Shield, FileText, Activity, Play
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: View, data?: any) => void;
  formatCurrency: (amount: number) => string;
  t: (key: string) => string;
  testimonials: Testimonial[];
  loading?: boolean;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, formatCurrency, t, testimonials: allTestimonials, loading = false }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [calcAmount, setCalcAmount] = useState(10000);
  const [calcDuration, setCalcDuration] = useState(5);
  const [calcAssetType, setCalcAssetType] = useState('Hotels');

  const successStories = allTestimonials.filter(t => t.type === TestimonialType.SUCCESS_STORY).slice(0, 3);
  const videoTestimonials = allTestimonials.filter(t => t.type === TestimonialType.VIDEO).slice(0, 2);

  const testimonials = [
    { name: "Rahul Sharma", role: "IT Professional", text: "Grow Milkat helped me earn ₹25,000/month passive income through fractional ownership in a premium hotel.", img: "https://i.pravatar.cc/150?u=rahul" },
    { name: "Priya Patel", role: "Business Owner", text: "The transparency and legal structure gave me the confidence to invest in commercial spaces. Highly recommended!", img: "https://i.pravatar.cc/150?u=priya" },
    { name: "Ankit Verma", role: "Startup Founder", text: "Diversifying my wealth into land and startups was never this easy. The G.R.O.W. model is a game changer.", img: "https://i.pravatar.cc/150?u=ankit" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextTestimonial = () => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  const prevTestimonial = () => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const faqItems = [
    {
      q: "Is Grow Milkat safe?",
      a: "Yes, Grow Milkat uses a SEBI-aligned structure with legal ring-fencing through Special Purpose Vehicles (SPVs). All investments are escrow-protected and KYC-verified."
    },
    {
      q: "What is the minimum investment?",
      a: "You can start investing with as little as ₹10,000 in premium assets like hotels, commercial spaces, and startups."
    },
    {
      q: "How do I withdraw my earnings?",
      a: "Rental income is distributed monthly to your linked bank account. For capital appreciation, you can sell your fractions on our secondary market or wait for the asset liquidation event."
    },
    {
      q: "What are the risks?",
      a: "Like all investments, there are market risks. However, our G.R.O.W. model (Governance, Risk, Operations, Wealth Projection) ensures rigorous vetting to mitigate these risks."
    }
  ];

  const calculateReturns = () => {
    const rates: Record<string, number> = {
      'Hotels': 0.12,
      'Commercial': 0.09,
      'Residential': 0.07,
      'Land': 0.15,
      'Startups': 0.25
    };
    const rate = rates[calcAssetType] || 0.1;
    const totalReturn = calcAmount * Math.pow(1 + rate, calcDuration);
    const monthlyIncome = (calcAmount * rate) / 12;
    const irr = rate * 100;
    
    return {
      totalReturn: Math.round(totalReturn),
      monthlyIncome: Math.round(monthlyIncome),
      irr: irr.toFixed(1)
    };
  };

  const results = calculateReturns();

  if (loading) {
    return (
      <div className="overflow-hidden bg-white">
        {/* Hero Skeleton */}
        <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <Skeleton className="h-4 w-32 bg-emerald-100" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-3/4" />
                  <Skeleton className="h-24 w-full bg-slate-100" />
                </div>
                <div className="flex flex-wrap gap-4">
                  <Skeleton className="h-14 w-48 bg-emerald-200" />
                  <Skeleton className="h-14 w-48" />
                </div>
                <div className="flex items-center gap-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex flex-col gap-2">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-4 w-16 bg-slate-100" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <Skeleton className="aspect-[4/3] rounded-[3rem] shadow-2xl" />
                <Skeleton className="absolute -bottom-6 -left-6 w-64 h-32 bg-white shadow-xl" />
                <Skeleton className="absolute -top-6 -right-6 w-48 h-48 bg-emerald-100 blur-3xl" />
              </div>
            </div>
          </div>
        </section>

        {/* How it works Skeleton */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 space-y-4">
              <Skeleton className="h-4 w-32 bg-emerald-100 mx-auto" />
              <Skeleton className="h-10 w-64 mx-auto" />
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="space-y-4 p-8 bg-slate-50 rounded-3xl">
                  <Skeleton className="h-16 w-16 rounded-2xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Skeleton */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-16">
              <div className="space-y-4">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 space-y-4">
                  <Skeleton className="h-14 w-14 mx-auto rounded-2xl" />
                  <Skeleton className="h-6 w-24 mx-auto" />
                  <Skeleton className="h-4 w-20 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Opportunities Skeleton */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 space-y-4">
              <Skeleton className="h-10 w-64 mx-auto" />
              <Skeleton className="h-4 w-48 mx-auto" />
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden">
                  <Skeleton className="h-56 w-full" />
                  <div className="p-8 space-y-6">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="grid grid-cols-2 gap-4">
                      <Skeleton className="h-12 rounded-xl" />
                      <Skeleton className="h-12 rounded-xl" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                    <Skeleton className="h-14 w-full rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white">
      {/* 1. Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden bg-slate-50">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-secondary/5 blur-[100px] -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
                <ShieldCheck className="w-4 h-4 mr-2" />
                {t('sebiAligned')}
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 tracking-tight leading-[1.1]">
                {t('heroHeadline')}
              </h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
                {t('heroSubheadline')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button 
                  onClick={() => onNavigate('register')}
                  className="px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:opacity-90 transition shadow-xl shadow-primary/20 flex items-center justify-center group"
                >
                  {t('startInvesting')} <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => onNavigate('portfolio')}
                  className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition flex items-center justify-center"
                >
                  {t('exploreAssets')}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-200">
                <div>
                  <p className="text-2xl font-bold text-slate-900">1000+</p>
                  <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{t('thousandInvestors')}</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">₹50Cr+</p>
                  <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Assets Managed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">100%</p>
                  <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{t('verifiedPartners')}</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000" 
                  alt="Premium Real Estate" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8 p-6 glass rounded-2xl">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-white font-bold text-xl">Azure Coast Hotel</h3>
                      <p className="text-white/80 text-sm">Nice, France</p>
                    </div>
                    <div className="bg-primary text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                      Hotels
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-white/60 text-[10px] uppercase font-bold tracking-widest">Expected ROI</p>
                      <p className="text-white font-bold text-lg">14% p.a.</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-[10px] uppercase font-bold tracking-widest">Min. Invest</p>
                      <p className="text-white font-bold text-lg">₹10,000</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-bounce-slow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center text-secondary">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Monthly Income</p>
                    <p className="text-lg font-bold text-slate-900">₹25,000</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Partners Scroll */}
        <div className="absolute bottom-0 w-full py-10 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 overflow-hidden">
            <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-8">{t('trustedBy')}</p>
            <div className="flex justify-center items-center gap-12 sm:gap-24 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition duration-500">
              <div className="h-6 sm:h-8">
                <img 
                  src="https://logo.clearbit.com/citadel.com" 
                  alt="Citadel" 
                  className="h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-xl sm:text-2xl font-black italic">CITADEL</span>';
                  }}
                />
              </div>
              <div className="h-6 sm:h-8">
                <img 
                  src="https://logo.clearbit.com/bridgewater.com" 
                  alt="Bridgewater" 
                  className="h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-xl sm:text-2xl font-black tracking-widest">BRIDGEWATER</span>';
                  }}
                />
              </div>
              <div className="h-6 sm:h-8">
                <img 
                  src="https://logo.clearbit.com/blackrock.com" 
                  alt="BlackRock" 
                  className="h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-xl sm:text-2xl font-serif font-bold">BlackRock</span>';
                  }}
                />
              </div>
              <div className="h-6 sm:h-8">
                <img 
                  src="https://logo.clearbit.com/vanguard.com" 
                  alt="Vanguard" 
                  className="h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-xl sm:text-2xl font-black italic">VANGUARD</span>';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How Grow Milkat Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 serif">{t('howItWorksHeadline')}</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Start your wealth creation journey in four simple steps.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <LayoutGrid />, title: t('browseAssets'), desc: "Explore curated high-yield opportunities." },
              { icon: <Wallet />, title: t('investSmall'), desc: "Start with as little as ₹10,000." },
              { icon: <TrendingUp />, title: t('earnIncome'), desc: "Receive monthly rental distributions." },
              { icon: <Target />, title: t('growWealth'), desc: "Benefit from long-term capital appreciation." }
            ].map((step, idx) => (
              <div key={idx} className="relative p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-xl transition-all group">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  {React.cloneElement(step.icon as React.ReactElement, { className: 'w-8 h-8' })}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed">{step.desc}</p>
                <div className="absolute top-8 right-8 text-4xl font-black text-slate-200 opacity-50 group-hover:text-primary/20 transition-colors">
                  0{idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Investment Categories */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 serif">{t('investmentCategories')}</h2>
              <p className="text-slate-500 text-lg">Diversify your portfolio across multiple asset classes.</p>
            </div>
            <button onClick={() => onNavigate('portfolio')} className="mt-6 md:mt-0 flex items-center font-bold text-primary hover:underline group">
              {t('viewAllOpportunities')} <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { icon: <Hotel />, title: "Hotels", yield: "High rental yield", color: "bg-blue-500" },
              { icon: <Building2 />, title: "Commercial", yield: "Stable rent", color: "bg-indigo-500" },
              { icon: <Home />, title: "Residential", yield: "Balanced growth", color: "bg-purple-500" },
              { icon: <Map />, title: "Land", yield: "High appreciation", color: "bg-emerald-500" },
              { icon: <Rocket />, title: "Startups", yield: "High risk, high reward", color: "bg-orange-500" }
            ].map((cat, idx) => (
              <div 
                key={idx} 
                onClick={() => cat.title === "Startups" ? onNavigate('startup-investment') : onNavigate('portfolio')}
                className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-lg transition-all cursor-pointer group text-center relative overflow-hidden"
              >
                {idx < 4 && (
                  <div className="absolute top-3 right-[-35px] bg-primary text-white text-[8px] font-bold px-10 py-1 rotate-45 shadow-sm z-10">
                    Coming Soon
                  </div>
                )}
                <div className={`w-14 h-14 mx-auto rounded-2xl ${cat.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                  {React.cloneElement(cat.icon as React.ReactElement, { className: 'w-7 h-7' })}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{cat.title}</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{cat.yield}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Investment Opportunities */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 serif">{t('activeOpportunities')}</h2>
            <p className="text-slate-500 text-lg">Hand-picked premium assets currently open for investment.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { 
                title: "Azure Coast Luxury Hotel", 
                location: "Nice, France", 
                min: "₹10,000", 
                roi: "14%", 
                irr: "12.5%", 
                risk: "Low", 
                progress: 75,
                img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800"
              },
              { 
                title: "Downtown Tech Hub", 
                location: "Berlin, Germany", 
                min: "₹25,000", 
                roi: "18%", 
                irr: "16.2%", 
                risk: "Moderate", 
                progress: 40,
                img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"
              },
              { 
                title: "Green Valley Land", 
                location: "Austin, USA", 
                min: "₹50,000", 
                roi: "22%", 
                irr: "19.5%", 
                risk: "High", 
                progress: 90,
                img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800"
              }
            ].map((deal, i) => (
              <div key={i} className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-500">
                <div className="h-56 overflow-hidden relative">
                  <img src={deal.img} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={deal.title} />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-primary uppercase tracking-widest shadow-sm">
                    Active
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="font-bold text-xl text-slate-900 mb-1">{deal.title}</h3>
                  <p className="text-slate-400 text-sm mb-6 flex items-center">
                    <Map className="w-4 h-4 mr-1" /> {deal.location}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Min Invest</p>
                      <p className="font-bold text-slate-900">{deal.min}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Exp. ROI</p>
                      <p className="font-bold text-primary">{deal.roi}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-8">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <span>Funding Progress</span>
                      <span className="text-slate-900">{deal.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full shadow-sm transition-all duration-1000" style={{ width: `${deal.progress}%` }}></div>
                    </div>
                  </div>

                  <button 
                    onClick={() => onNavigate('portfolio')}
                    className="w-full py-4 rounded-xl bg-slate-900 text-white hover:bg-primary transition-colors font-bold text-sm uppercase tracking-widest"
                  >
                    Invest Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Why Choose Grow Milkat (G.R.O.W. Model) */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-primary font-bold uppercase tracking-widest text-xs mb-4 block">{t('whyChooseGrowMilkat')}</span>
              <h2 className="text-4xl sm:text-5xl font-bold mb-8 serif leading-tight">The G.R.O.W. Model</h2>
              <p className="text-slate-400 text-lg mb-12 leading-relaxed">
                Our proprietary vetting protocol ensures that only the most exceptional assets make it to our platform. We look at four critical pillars to protect and grow your wealth.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-8">
                {[
                  { title: "Governance", desc: "Strict legal and ethical audit of all project partners." },
                  { title: "Risk", desc: "Advanced stress-testing against 150+ economic variables." },
                  { title: "Operations", desc: "Deep-dive into the day-to-day management of the asset." },
                  { title: "Wealth", desc: "Conservative modeling of long-term capital appreciation." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 font-bold">
                      {item.title[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                      <p className="text-sm text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full"></div>
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000" 
                className="relative rounded-[3rem] shadow-2xl border border-white/10"
                alt="GROW Model Visualization"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Security & Trust Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 serif">{t('securityTrust')}</h2>
            <p className="text-slate-500 text-lg">Your capital safety is our primary objective.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <ShieldCheck />, title: t('kycVerified'), desc: "Every investor undergoes rigorous identity verification." },
              { icon: <Lock />, title: t('legalVault'), desc: "All legal documents are stored in a secure, accessible vault." },
              { icon: <Shield />, title: t('escrowProtected'), desc: "Funds are held in regulated escrow accounts until deployment." },
              { icon: <Activity />, title: t('fullTransparency'), desc: "Real-time tracking and reporting on all your investments." }
            ].map((item, i) => (
              <div key={i} className="text-center p-8 rounded-3xl hover:bg-slate-50 transition-colors">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {React.cloneElement(item.icon as React.ReactElement, { className: 'w-8 h-8' })}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <button 
              onClick={() => onNavigate('security-trust')}
              className="px-10 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-primary transition shadow-xl shadow-slate-200"
            >
              Learn More About Our Security
            </button>
          </div>
        </div>
      </section>

      {/* 7. Returns Calculator */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
            <div className="grid lg:grid-cols-2">
              <div className="p-12 lg:p-20">
                <h2 className="text-4xl font-bold text-slate-900 mb-6 serif">{t('calculateReturns')}</h2>
                <p className="text-slate-500 mb-10">Estimate your potential earnings based on investment amount and duration.</p>
                
                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Investment Amount (₹)</label>
                    <input 
                      type="range" 
                      min="10000" 
                      max="1000000" 
                      step="10000"
                      value={calcAmount}
                      onChange={(e) => setCalcAmount(Number(e.target.value))}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between mt-4">
                      <span className="text-2xl font-bold text-slate-900">₹{calcAmount.toLocaleString()}</span>
                      <span className="text-slate-400 font-medium">Max: ₹10L</span>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Duration (Years)</label>
                      <select 
                        value={calcDuration}
                        onChange={(e) => setCalcDuration(Number(e.target.value))}
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-primary font-bold"
                      >
                        {[1, 3, 5, 7, 10].map(y => <option key={y} value={y}>{y} Years</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Asset Type</label>
                      <select 
                        value={calcAssetType}
                        onChange={(e) => setCalcAssetType(e.target.value)}
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-primary font-bold"
                      >
                        <option value="Hotels">Hotels (12%)</option>
                        <option value="Commercial">Commercial (9%)</option>
                        <option value="Residential">Residential (7%)</option>
                        <option value="Land">Land (15%)</option>
                        <option value="Startups">Startups (25%)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary p-12 lg:p-20 text-white flex flex-col justify-center">
                <div className="space-y-10">
                  <div>
                    <p className="text-white/60 text-sm font-bold uppercase tracking-widest mb-2">Projected Total Value</p>
                    <p className="text-5xl sm:text-6xl font-bold">₹{results.totalReturn.toLocaleString()}</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-10 pt-10 border-t border-white/20">
                    <div>
                      <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Monthly Income</p>
                      <p className="text-3xl font-bold">₹{results.monthlyIncome.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Expected IRR</p>
                      <p className="text-3xl font-bold">{results.irr}%</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onNavigate('register')}
                    className="w-full py-5 bg-white text-primary rounded-2xl font-bold text-xl hover:bg-slate-50 transition shadow-2xl"
                  >
                    Calculate Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Success Stories Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <span className="text-primary font-black uppercase tracking-widest text-xs mb-4 block">Proven Results</span>
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 serif leading-tight">Investor Success Stories</h2>
              <p className="mt-6 text-slate-500 text-lg">
                Real results from our global community of institutional and private investors.
              </p>
            </div>
            <button 
              onClick={() => onNavigate('testimonials')}
              className="group flex items-center gap-3 px-8 py-4 bg-slate-50 text-slate-900 rounded-2xl font-bold hover:bg-primary hover:text-white transition-all duration-300"
            >
              View All Stories
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer"
                onClick={() => onNavigate('testimonial-detail', story)}
              >
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img
                    src={story.imageUrl}
                    alt={story.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                  
                  <div className="absolute top-6 right-6">
                    <div className="bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
                      {story.successStory?.propertyType}
                    </div>
                  </div>

                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={story.avatar}
                        alt={story.name}
                        className="w-10 h-10 rounded-full border border-primary/50"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h3 className="text-white font-bold text-sm">{story.name}</h3>
                        <p className="text-slate-300 text-[10px] uppercase tracking-widest">{story.role}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20">
                        <p className="text-slate-300 text-[8px] uppercase mb-1">Investment</p>
                        <p className="text-white font-bold text-[10px]">{formatCurrency(story.successStory?.amount || 0)}</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20">
                        <p className="text-slate-300 text-[8px] uppercase mb-1">ROI</p>
                        <p className="text-primary font-bold text-[10px]">{story.successStory?.roi}</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20">
                        <p className="text-slate-300 text-[8px] uppercase mb-1">Holding</p>
                        <p className="text-white font-bold text-[10px]">{story.successStory?.holdingPeriod}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-6 italic">
                    "{story.textTestimonial}"
                  </p>
                  <div className="flex items-center justify-between text-primary font-bold text-sm group/btn">
                    Read Full Story
                    <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Testimonials Slider Section */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 serif">What Our Investors Say</h2>
            <p className="text-slate-500 text-lg">Hear from our community of successful investors.</p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="bg-slate-50 p-12 rounded-[3rem] border border-slate-100 relative group"
              >
                <Quote className="absolute top-10 right-10 text-slate-200 w-16 h-16" />
                <div className="flex mb-8">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-5 h-5 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-slate-700 italic mb-10 text-xl sm:text-2xl leading-relaxed">"{testimonials[currentTestimonial].text}"</p>
                <div className="flex items-center gap-5">
                  <img src={testimonials[currentTestimonial].img} className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg" alt={testimonials[currentTestimonial].name} />
                  <div>
                    <h4 className="font-bold text-slate-900 text-xl">{testimonials[currentTestimonial].name}</h4>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{testimonials[currentTestimonial].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center mt-12 gap-4">
              <button onClick={prevTestimonial} className="p-4 rounded-full bg-white border border-slate-100 text-slate-400 hover:text-primary hover:border-primary transition-all">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setCurrentTestimonial(i)}
                    className={`h-2 rounded-full transition-all ${currentTestimonial === i ? 'w-8 bg-primary' : 'w-2 bg-slate-200'}`}
                  />
                ))}
              </div>
              <button onClick={nextTestimonial} className="p-4 rounded-full bg-white border border-slate-100 text-slate-400 hover:text-primary hover:border-primary transition-all">
                <ChevronRightIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Performance Metrics */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 serif">{t('performanceMetrics')}</h2>
            <p className="text-slate-400 text-lg">Our track record speaks for itself.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { label: "Assets Managed", value: "₹150 Cr+" },
              { label: "Avg. Annual ROI", value: "12.4%" },
              { label: "Total Investors", value: "1,200+" },
              { label: "Projects Completed", value: "24+" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-5xl font-bold text-primary mb-4">{stat.value}</p>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. Learn & Explore */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 serif">{t('learnExplore')}</h2>
              <p className="text-slate-500 text-lg">Master the art of fractional investing.</p>
            </div>
            <button onClick={() => onNavigate('faq')} className="mt-6 md:mt-0 px-8 py-4 border border-slate-200 rounded-xl font-bold text-slate-900 hover:bg-slate-50 transition">
              Learn More
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "What is Fractional Ownership?", desc: "Learn how high-value assets are divided into affordable shares.", icon: <Users /> },
              { title: "ROI vs IRR: What Matters?", desc: "Understand the key metrics used to measure investment performance.", icon: <PieChart /> },
              { title: "Risk Management 101", desc: "How we protect your capital through rigorous vetting and SPVs.", icon: <Shield /> }
            ].map((topic, i) => (
              <div key={i} className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:shadow-xl transition-all group cursor-pointer">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-colors">
                  {React.cloneElement(topic.icon as React.ReactElement, { className: 'w-7 h-7' })}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{topic.title}</h3>
                <p className="text-slate-500 leading-relaxed mb-6">{topic.desc}</p>
                <div className="flex items-center text-primary font-bold">
                  Read Article <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. FAQ Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 serif">{t('faq')}</h2>
            <p className="text-slate-500 text-lg">Find answers to common questions about Grow Milkat.</p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left outline-none"
                >
                  <span className="text-lg font-bold text-slate-900">{item.q}</span>
                  <div className={`p-1 rounded-full transition-all ${openFaq === i ? 'bg-primary text-white rotate-180' : 'bg-slate-50 text-slate-400'}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 text-slate-500 leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. Final CTA */}
      <section className="bg-primary py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/10"></div>
        <div className="max-w-4xl mx-auto px-6 text-center text-white relative z-10">
          <h2 className="text-4xl sm:text-6xl font-bold mb-6 serif">{t('startBuildingWealth')}</h2>
          <p className="text-white/80 text-xl mb-12">{t('joinThousands')}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => onNavigate('register')}
              className="w-full sm:w-auto bg-white text-primary px-10 py-5 rounded-2xl font-bold text-xl hover:bg-slate-50 transition shadow-2xl"
            >
              {t('startInvestingNow')}
            </button>
            <button 
              onClick={() => onNavigate('contact')}
              className="w-full sm:w-auto bg-primary-dark text-white border-2 border-white/20 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white/10 transition"
            >
              {t('bookFreeConsultation')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
