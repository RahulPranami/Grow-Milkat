
import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  FileCheck, 
  Building2, 
  Users, 
  CheckCircle2, 
  ShieldAlert,
  Server,
  Fingerprint,
  Scale,
  History
} from 'lucide-react';

const SecurityTrustPage: React.FC = () => {
  const securityFeatures = [
    {
      icon: <Lock className="w-8 h-8 text-emerald-500" />,
      title: "Bank-Grade Encryption",
      description: "All sensitive data is encrypted using AES-256 bit encryption, the same standard used by leading global financial institutions."
    },
    {
      icon: <Fingerprint className="w-8 h-8 text-blue-500" />,
      title: "Multi-Factor Authentication",
      description: "Secure your account with biometric login and one-time passcodes (OTP) to ensure only you can access your investments."
    },
    {
      icon: <Server className="w-8 h-8 text-purple-500" />,
      title: "Secure Infrastructure",
      description: "Our platform is hosted on highly secure, redundant cloud servers with 24/7 monitoring and DDoS protection."
    },
    {
      icon: <ShieldAlert className="w-8 h-8 text-rose-500" />,
      title: "Fraud Detection",
      description: "Advanced AI-powered systems monitor transactions in real-time to detect and prevent suspicious activity."
    }
  ];

  const trustPillars = [
    {
      icon: <Scale className="w-12 h-12 text-emerald-600" />,
      title: "Regulatory Compliance",
      description: "We operate in full alignment with international financial regulations, including strict KYC (Know Your Customer) and AML (Anti-Money Laundering) protocols.",
      details: ["Global KYC Standards", "AML Monitoring", "Data Privacy Compliance"]
    },
    {
      icon: <Building2 className="w-12 h-12 text-blue-600" />,
      title: "Asset Protection",
      description: "Your investments are held through Special Purpose Vehicles (SPVs), ensuring legal separation from platform operations.",
      details: ["SPV Structure", "Independent Trustees", "Asset Insurance"]
    },
    {
      icon: <Eye className="w-12 h-12 text-purple-600" />,
      title: "Absolute Transparency",
      description: "Access real-time performance reports, legal documents, and audited financial statements for every asset in your portfolio.",
      details: ["Real-time Reporting", "Third-party Audits", "Full Document Access"]
    }
  ];

  const vettingProcess = [
    {
      step: "01",
      title: "Legal Due Diligence",
      description: "Rigorous verification of title deeds, ownership structures, and regulatory permits."
    },
    {
      step: "02",
      title: "Financial Audit",
      description: "Deep-dive analysis of historical performance, cash flows, and future projections."
    },
    {
      step: "03",
      title: "Risk Assessment",
      description: "Comprehensive evaluation of market risks, operational risks, and exit strategies."
    },
    {
      step: "04",
      title: "Partner Vetting",
      description: "Background checks and track record verification of asset operators and developers."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500 via-transparent to-transparent" />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-black uppercase tracking-widest mb-6">
              <ShieldCheck className="w-4 h-4" />
              Your Security is Our Priority
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 serif">
              Security & Trust at <span className="text-emerald-400">Grow Milkat</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium">
              We employ institutional-grade security protocols and transparent governance to ensure your capital is protected and your investments are secure.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Trust Pillars */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 serif">The Pillars of Our Platform</h2>
          <p className="text-slate-500 font-medium">Built on a foundation of integrity and legal excellence.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trustPillars.map((pillar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="mb-8 p-4 bg-slate-50 rounded-2xl inline-block group-hover:scale-110 transition-transform">
                {pillar.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{pillar.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                {pillar.description}
              </p>
              <ul className="space-y-3">
                {pillar.details.map((detail, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {detail}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Security Features Grid */}
      <section className="bg-white py-32 mb-32 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-8 serif leading-tight">
                Institutional-Grade <br />
                <span className="text-emerald-600">Digital Security</span>
              </h2>
              <p className="text-slate-500 text-lg mb-12 font-medium">
                Our technology stack is built to the highest standards of the financial industry, ensuring that your data and funds are always out of reach from unauthorized parties.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {securityFeatures.map((feature, index) => (
                  <div key={index} className="space-y-3">
                    <div className="p-3 bg-slate-50 rounded-xl inline-block">
                      {feature.icon}
                    </div>
                    <h4 className="font-bold text-slate-900">{feature.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-slate-900 rounded-[3rem] overflow-hidden relative group">
                <img 
                  src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000" 
                  alt="Cybersecurity"
                  className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-emerald-500/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-emerald-500/30 animate-pulse">
                    <Lock className="w-12 h-12 text-emerald-400" />
                  </div>
                </div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 max-w-xs animate-bounce-slow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <History className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Uptime</p>
                    <p className="text-xl font-black text-slate-900">99.99%</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 font-medium">Continuous monitoring and redundant systems ensure platform availability.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vetting Process */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="bg-emerald-600 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
          
          <div className="relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 serif">Our Rigorous Vetting Process</h2>
              <p className="text-emerald-100 font-medium">Only 2% of opportunities pass our institutional-grade due diligence.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {vettingProcess.map((step, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl">
                  <span className="text-4xl font-black text-white/20 block mb-4">{step.step}</span>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-emerald-50/70 text-sm leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-6 text-center">
        <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 serif">Ready to invest with confidence?</h2>
          <p className="text-slate-500 mb-10 font-medium">Join thousands of investors who trust Grow Milkat for their alternative asset portfolio.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-600 transition shadow-xl shadow-slate-200">
              Get Started Now
            </button>
            <button className="px-10 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition">
              View Opportunities
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SecurityTrustPage;
