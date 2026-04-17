import React from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  Search, 
  Wallet, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Building2,
  PieChart,
  Lock
} from 'lucide-react';

const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      icon: <UserPlus className="w-8 h-8 text-emerald-600" />,
      title: "Create Your Account",
      description: "Sign up in minutes and complete our secure KYC verification process to access institutional-grade assets.",
      details: ["Digital onboarding", "Instant verification", "Secure data handling"]
    },
    {
      icon: <Search className="w-8 h-8 text-emerald-600" />,
      title: "Browse Curated Assets",
      description: "Explore our hand-picked selection of high-yield hotels, startups, and commercial properties.",
      details: ["Detailed due diligence", "Performance projections", "Risk assessment"]
    },
    {
      icon: <Wallet className="w-8 h-8 text-emerald-600" />,
      title: "Invest with Precision",
      description: "Deploy capital with as little as ₹10,000. Our fractional model lets you build a diversified portfolio.",
      details: ["Low entry barriers", "Transparent fees", "Secure payments"]
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-emerald-600" />,
      title: "Earn & Grow",
      description: "Receive monthly rental income and benefit from long-term capital appreciation of your assets.",
      details: ["Monthly payouts", "Real-time tracking", "Portfolio rebalancing"]
    }
  ];

  const features = [
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "SPV Structure",
      description: "Each asset is held in a separate Special Purpose Vehicle (SPV), legally ring-fencing your investment."
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Bank-Grade Security",
      description: "Your data and transactions are protected by military-grade encryption and multi-factor authentication."
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "AI-Driven Insights",
      description: "We use advanced AI to analyze market trends and optimize asset performance for maximum returns."
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      title: "Professional Management",
      description: "Our team of experts handles all operational aspects, from maintenance to tenant relations."
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-emerald-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-400 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              The Architecture of Your Wealth
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-emerald-100 mb-8"
            >
              Growmilkat dismantles the barriers to institutional-grade assets, providing you with direct access to fractionalized high-yield opportunities.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Path to Fractional Ownership</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Our streamlined process makes it easy for you to start building a diversified portfolio of premium assets.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative"
              >
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">
                  {index + 1}
                </div>
                <div className="mb-6">{step.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 mb-6">{step.description}</p>
                <ul className="space-y-3">
                  {step.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-500">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Growmilkat Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Built on Precision, Protected by Law</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We don't just find income; we engineer it through data-driven acquisition and operational optimization. Our primary objective is the absolute preservation of capital through multi-layered security and legal ring-fencing.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-sm text-gray-500">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:w-1/2 relative">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000" 
                  alt="Data Analysis" 
                  className="w-full h-auto"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-64 bg-white p-6 rounded-2xl shadow-xl z-20 hidden md:block border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                    <PieChart className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-gray-900">Portfolio Growth</span>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-emerald-500 rounded-full w-full" />
                  <div className="h-2 bg-emerald-300 rounded-full w-3/4" />
                  <div className="h-2 bg-emerald-100 rounded-full w-1/2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Transparency */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Transparency You Can See</h2>
            <p className="text-gray-600 mb-12">
              Legacy investing is a black box. Growmilkat provides a glass-box experience with real-time telemetry on every asset. Monitor your returns, track performance, and access detailed reports anytime.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="text-3xl font-bold text-emerald-600 mb-2">100%</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Transparency</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="text-3xl font-bold text-emerald-600 mb-2">24/7</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Monitoring</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="text-3xl font-bold text-emerald-600 mb-2">Quarterly</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Independent Audits</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-emerald-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Start Building Wealth?</h2>
          <p className="text-emerald-100 mb-10 max-w-2xl mx-auto">Join thousands of investors who are already growing their passive income through Growmilkat.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-bold hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2">
              Get Started Now <ArrowRight className="w-5 h-5" />
            </button>
            <button className="bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-800 transition-colors">
              Speak with Advisor
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;
