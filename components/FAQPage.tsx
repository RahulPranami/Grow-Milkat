
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Info, TrendingUp, ShieldCheck, CreditCard, Wallet, Search } from 'lucide-react';

import { FAQ, FAQCategory } from '../types';

interface FAQPageProps {
  faqs: FAQ[];
  categories: FAQCategory[];
}

const FAQPage: React.FC<FAQPageProps> = ({ faqs, categories: faqCategories }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const categories = ['All', ...faqCategories.map(c => c.name)];

  const filteredFAQs = faqs.filter(item => {
    const category = faqCategories.find(c => c.id === item.categoryId);
    const matchesCategory = activeCategory === 'All' || category?.name === activeCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (categoryName: string) => {
    const category = faqCategories.find(c => c.name === categoryName);
    const iconName = category?.icon || '';
    
    switch (iconName) {
      case 'Info': return <Info className="w-5 h-5" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
      case 'CreditCard': return <CreditCard className="w-5 h-5" />;
      case 'Wallet': return <Wallet className="w-5 h-5" />;
      default: return <HelpCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6"
          >
            <HelpCircle className="w-4 h-4" />
            Support Center
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold serif mb-6"
          >
            How can we help you?
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto"
          >
            Find answers to common questions about fractional investing, account security, and our platform.
          </motion.p>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative max-w-xl mx-auto"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all backdrop-blur-sm"
            />
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-10 relative z-20">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm sticky top-24">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 px-4">Categories</h3>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setExpandedIndex(null);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      activeCategory === cat 
                        ? 'bg-emerald-50 text-emerald-700 shadow-sm' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className={activeCategory === cat ? 'text-emerald-600' : 'text-slate-400'}>
                      {getCategoryIcon(cat)}
                    </span>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredFAQs.length > 0 ? (
                  filteredFAQs.map((faq, index) => (
                    <motion.div
                      key={faq.question}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      layout
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                            {getCategoryIcon(faqCategories.find(c => c.id === faq.categoryId)?.name || '')}
                          </div>
                          <span className="font-bold text-slate-900">{faq.question}</span>
                        </div>
                        <ChevronDown 
                          className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${expandedIndex === index ? 'rotate-180' : ''}`} 
                        />
                      </button>
                      
                      <AnimatePresence>
                        {expandedIndex === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                          >
                            <div className="px-6 pb-6 pt-2 text-slate-600 leading-relaxed border-t border-slate-50">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300"
                  >
                    <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900">No questions found</h3>
                    <p className="text-slate-500">Try adjusting your search or category filter.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Contact Support CTA */}
            <div className="mt-12 p-8 bg-emerald-900 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-2xl font-bold serif">Still have questions?</h3>
                <p className="text-emerald-200/70">Our dedicated support team is here to help you 24/7.</p>
              </div>
              <div className="flex gap-4">
                <button className="px-8 py-3 bg-white text-emerald-900 rounded-xl font-bold hover:bg-emerald-50 transition shadow-lg">
                  Chat With Us
                </button>
                <button className="px-8 py-3 bg-emerald-800 text-white border border-emerald-700 rounded-xl font-bold hover:bg-emerald-700 transition">
                  Email Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
