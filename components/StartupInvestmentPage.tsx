
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, TrendingUp, Zap, Brain, Wallet, RefreshCw, 
  ShieldCheck, Shield, FileCheck, CheckCircle2, 
  ArrowRight, Target, Users, BarChart3, HelpCircle, FileText,
  ChevronRight, AlertTriangle, Lightbulb, Check
} from 'lucide-react';
import { View } from '../types';

interface StartupInvestmentPageProps {
  onNavigate: (view: View) => void;
}

const StartupInvestmentPage: React.FC<StartupInvestmentPageProps> = ({ onNavigate }) => {
  const growModel = [
    { letter: 'G', title: 'Governance Check', desc: 'Legal verification of startup founders & structure', icon: <ShieldCheck className="w-6 h-6" /> },
    { letter: 'R', title: 'Risk Modeling', desc: 'Financial & market risk analysis', icon: <AlertTriangle className="w-6 h-6" /> },
    { letter: 'O', title: 'Operational Audit', desc: 'Check real business operations', icon: <Activity className="w-6 h-6" /> },
    { letter: 'W', title: 'Wealth Projection', desc: 'Realistic profit and growth estimation', icon: <TrendingUp className="w-6 h-6" /> }
  ];

  const benefits = [
    { icon: <TrendingUp />, title: 'High Return Potential', desc: 'Startups can give 10x to 100x returns. Early investors in companies like Amazon or Flipkart made massive profits.' },
    { icon: <Zap />, title: 'Fast Growth Industry', desc: 'Startups grow faster than traditional businesses, especially in AI, SaaS, Apps, and Tech sectors.' },
    { icon: <Brain />, title: 'Innovation-Driven', desc: 'You invest in future technology & ideas. AI, automation, digital platforms = future economy.' },
    { icon: <Wallet />, title: 'Low Entry Barrier', desc: 'Traditional startup investing = crores. Grow Milkat = Start with small capital.' },
    { icon: <RefreshCw />, title: 'Multiple Exit Opportunities', desc: 'IPO (Initial Public Offering), Acquisition (Big company buys startup), Secondary share selling.' }
  ];

  const faqs = [
    { q: "Is startup investment safe?", a: "It carries risk, but Grow Milkat reduces it through deep analysis." },
    { q: "What is minimum investment?", a: "You can start with a small amount (₹10K–₹50K)." },
    { q: "When will I get returns?", a: "Usually 3–7 years (depends on startup growth)." },
    { q: "Can I sell my shares?", a: "Yes, through exit or secondary marketplace." }
  ];

  return (
    <div className="bg-white">
      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-900">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 blur-[120px] -z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary-light text-xs font-bold uppercase tracking-widest mb-6">
                <Rocket className="w-4 h-4 mr-2" />
                Startup Equity
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Invest in the Next Unicorn <span className="text-primary">Before the World Knows</span> 🚀
              </h1>
              <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-xl">
                Own equity in high-growth startups with small investments and unlock exponential wealth opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => onNavigate('portfolio')}
                  className="px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:opacity-90 transition shadow-xl shadow-primary/20 flex items-center justify-center group"
                >
                  Explore Startups <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => onNavigate('register')}
                  className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-xl font-bold text-lg hover:bg-white/20 transition flex items-center justify-center"
                >
                  Start Investing Now
                </button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative rounded-[2.5rem] overflow-hidden border-8 border-white/10 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=1000" 
                  alt="Startup Innovation" 
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8 p-6 glass rounded-2xl border border-white/20">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">TechFlow AI</h3>
                      <p className="text-white/60 text-xs">Series A · SaaS</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                      <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Growth</p>
                      <p className="text-white font-bold">12x YoY</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                      <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Min. Invest</p>
                      <p className="text-white font-bold">₹25,000</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. What is Startup Investment? */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8">What is Startup Investment?</h2>
              <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                <p>
                  Startup investment means putting your money into early-stage companies with high growth potential.
                </p>
                <p>
                  Instead of investing ₹10–50 Lakhs like traditional VC firms, Grow Milkat allows you to invest from small amounts and still get equity ownership.
                </p>
                <div className="p-6 bg-primary/5 border-l-4 border-primary rounded-r-2xl flex items-start gap-4">
                  <Lightbulb className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <p className="font-bold text-slate-900">You become a part-owner of future big brands.</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 text-center">
                <p className="text-4xl font-bold text-primary mb-2">₹10K</p>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Starting Capital</p>
              </div>
              <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 text-center">
                <p className="text-4xl font-bold text-primary mb-2">100x</p>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Return Potential</p>
              </div>
              <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 text-center col-span-2">
                <p className="text-4xl font-bold text-primary mb-2">Equity</p>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Ownership Structure</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Why Startups Are the Best Investment */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Why Startups Are the Best Investment 💰</h2>
            <p className="text-slate-500 text-lg">Unlock the power of early-stage equity.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                  {React.cloneElement(benefit.icon as React.ReactElement, { className: 'w-7 h-7' })}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{idx + 1}. {benefit.title}</h3>
                <p className="text-slate-600 leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. How Grow Milkat Makes It Safe */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">How Grow Milkat Makes It Safe 🔒</h2>
            <p className="text-slate-500 text-lg">We follow a rigorous G.R.O.W. Model to protect your capital.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {growModel.map((item, idx) => (
              <div key={idx} className="relative p-8 bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-primary hover:border-primary transition-all duration-300">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div className="absolute top-8 right-8 text-4xl font-black text-slate-200 group-hover:text-white/20 transition-colors">
                  {item.letter}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-white transition-colors">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed group-hover:text-white/80 transition-colors">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Investment Structure */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-8">Investment Structure <span className="text-primary-light">(Simple Explanation)</span></h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">The SPV Model</h4>
                    <p className="text-slate-400">You invest in a Startup SPV (Special Purpose Vehicle). The SPV holds shares of the startup on behalf of all investors.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">What You Get</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-slate-400"><CheckCircle2 className="w-4 h-4 text-primary" /> Ownership Certificate</li>
                      <li className="flex items-center gap-2 text-slate-400"><CheckCircle2 className="w-4 h-4 text-primary" /> Legal Agreement</li>
                      <li className="flex items-center gap-2 text-slate-400"><CheckCircle2 className="w-4 h-4 text-primary" /> Digital Proof of Investment</li>
                    </ul>
                  </div>
                </div>
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <p className="font-bold">100 investors can own 100% equity together</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-primary/10 rounded-full flex items-center justify-center animate-pulse-slow">
                <div className="w-3/4 h-3/4 bg-primary/20 rounded-full flex items-center justify-center">
                  <div className="w-1/2 h-1/2 bg-primary rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(var(--primary-rgb),0.5)]">
                    <Rocket className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>
              {/* Floating labels */}
              <div className="absolute top-0 left-0 bg-white text-slate-900 p-4 rounded-2xl shadow-xl border border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Equity Held</p>
                <p className="text-xl font-bold">SPV Structure</p>
              </div>
              <div className="absolute bottom-10 right-0 bg-white text-slate-900 p-4 rounded-2xl shadow-xl border border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Investor Rights</p>
                <p className="text-xl font-bold">100% Protected</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Returns You Can Earn */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Returns You Can Earn 📊</h2>
            <p className="text-slate-500 text-lg">Multiple ways to profit from your investment.</p>
          </div>
          <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="p-6 text-sm font-bold text-slate-900 uppercase tracking-widest">Type of Return</th>
                  <th className="p-6 text-sm font-bold text-slate-900 uppercase tracking-widest">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-6 font-bold text-slate-900 flex items-center gap-3">
                    <span className="text-2xl">💰</span> Capital Gain
                  </td>
                  <td className="p-6 text-slate-600">Value of shares increases as the startup grows and reaches higher valuations.</td>
                </tr>
                <tr>
                  <td className="p-6 font-bold text-slate-900 flex items-center gap-3">
                    <span className="text-2xl">🧾</span> Dividend
                  </td>
                  <td className="p-6 text-slate-600">Profit distribution shared with investors if the startup becomes profitable.</td>
                </tr>
                <tr>
                  <td className="p-6 font-bold text-slate-900 flex items-center gap-3">
                    <span className="text-2xl">🚀</span> Exit Profit
                  </td>
                  <td className="p-6 text-slate-600">Significant returns realized during a strategic acquisition or an IPO.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 7. Risk Transparency */}
      <section className="py-24 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100 flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 shrink-0">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Diversify Opportunities</h4>
                    <p className="text-sm text-slate-500">We offer a wide range of startups to spread risk.</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100 flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 shrink-0">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Risk Score</h4>
                    <p className="text-sm text-slate-500">Every startup is assigned a clear risk score based on our audit.</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100 flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Detailed Analysis</h4>
                    <p className="text-sm text-slate-500">Access full due diligence reports before you invest.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-100 text-red-600 text-xs font-bold uppercase tracking-widest mb-6">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Risk Transparency
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">We believe in honest investing ⚠️</h2>
              <div className="space-y-4 text-lg text-slate-600 leading-relaxed">
                <p>Startups are high-risk, high-reward. Not all startups succeed, and it's important to understand the risks involved.</p>
                <p className="font-bold text-slate-900">That's why we provide the tools and data you need to make informed decisions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Who Should Invest? */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Who Should Invest?</h2>
            <p className="text-slate-500 text-lg">Is startup investing right for you?</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "New Investors", desc: "Start small and learn the ropes of equity investing." },
              { title: "Risk Seekers", desc: "Those looking for high-risk, high-return opportunities." },
              { title: "Wealth Builders", desc: "Long-term investors focused on exponential growth." },
              { title: "Tech Enthusiasts", desc: "People passionate about future technology and business." }
            ].map((item, idx) => (
              <div key={idx} className="p-8 bg-slate-50 rounded-3xl border border-slate-100 text-center hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h4>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Real Example */}
      <section className="py-24 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-8">Real Example <span className="text-primary-light">(Understanding Growth)</span></h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-6 bg-white/10 rounded-2xl border border-white/20">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                  <p className="text-xl">If you invest <span className="font-bold">₹50,000</span> in a startup</p>
                </div>
                <div className="flex items-center gap-4 p-6 bg-white/10 rounded-2xl border border-white/20">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <p className="text-xl">Startup grows <span className="font-bold">20x</span> in 5 years</p>
                </div>
                <div className="p-8 bg-white text-slate-900 rounded-3xl shadow-2xl">
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Your Final Value</p>
                  <p className="text-5xl font-black text-primary">₹10,00,000</p>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-white/10 blur-2xl rounded-full"></div>
                <BarChart3 className="w-full h-64 text-white relative z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Why Choose Grow Milkat? */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Why Choose Grow Milkat? 🌟</h2>
            <p className="text-slate-500 text-lg">The platform built for the modern investor.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Small Investment Access", desc: "Invest in startups with capital that fits your budget." },
              { title: "Verified Startups Only", desc: "Only the top 1% of startups make it through our vetting process." },
              { title: "Legal + Transparent", desc: "Full legal protection and transparent SPV structure." },
              { title: "Monthly Updates", desc: "Stay informed with regular performance reports and news." },
              { title: "Easy Exit Options", desc: "Multiple ways to realize your gains when the time is right." }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. FAQs Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-500">Everything you need to know about startup investing.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="p-6">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-primary" /> {faq.q}
                  </h4>
                  <p className="text-slate-600 pl-8">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. Final CTA */}
      <section className="py-24 bg-slate-900 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-primary/5 blur-[100px]"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold mb-8">🔥 Don’t Just Watch Startups Grow — <span className="text-primary">Own Them</span></h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              onClick={() => onNavigate('register')}
              className="px-10 py-5 bg-primary text-white rounded-2xl font-bold text-xl hover:opacity-90 transition shadow-2xl shadow-primary/40 flex items-center justify-center group"
            >
              Invest in Startups Now <Rocket className="ml-3 w-6 h-6 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => onNavigate('portfolio')}
              className="px-10 py-5 bg-white/10 text-white border border-white/20 rounded-2xl font-bold text-xl hover:bg-white/20 transition flex items-center justify-center"
            >
              View Live Opportunities
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

const Activity = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

export default StartupInvestmentPage;
