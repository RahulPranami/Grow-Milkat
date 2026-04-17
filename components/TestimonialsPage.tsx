import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  User, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  X,
  MapPin,
  Clock,
  Briefcase,
  Building2,
  Home,
  Landmark,
  Rocket,
  ShoppingBag
} from 'lucide-react';
import { Language, t } from '../translations';
import { Testimonial, InvestmentType, View, TestimonialType } from '../types';

interface TestimonialsPageProps {
  language: Language;
  onNavigate: (view: View, data?: any) => void;
  testimonials: Testimonial[];
}

export const TestimonialsPage: React.FC<TestimonialsPageProps> = ({ language, onNavigate, testimonials }) => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  
  // Filters
  const [monthFilter, setMonthFilter] = useState<string>('All');
  const [yearFilter, setYearFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  // Sliders
  const [videoIndex, setVideoIndex] = useState(0);

  const successStories = useMemo(() => {
    return testimonials.filter(t => {
      if (t.type !== TestimonialType.SUCCESS_STORY) return false;
      const monthMatch = monthFilter === 'All' || t.successStory?.month === monthFilter;
      const yearMatch = yearFilter === 'All' || t.successStory?.year === yearFilter;
      const typeMatch = typeFilter === 'All' || t.successStory?.propertyType === typeFilter;
      return monthMatch && yearMatch && typeMatch;
    });
  }, [testimonials, monthFilter, yearFilter, typeFilter]);

  const videoTestimonials = useMemo(() => testimonials.filter(t => t.type === TestimonialType.VIDEO), [testimonials]);

  const nextVideo = () => setVideoIndex((prev) => (prev + 1) % (videoTestimonials.length || 1));
  const prevVideo = () => setVideoIndex((prev) => (prev - 1 + (videoTestimonials.length || 1)) % (videoTestimonials.length || 1));

  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const YEARS = ['2023', '2024', '2025', '2026'];
  const PROPERTY_TYPES = [
    InvestmentType.COMMERCIAL_PROPERTY,
    InvestmentType.RESIDENTIAL_PROPERTY,
    InvestmentType.LAND_PROPERTY,
    InvestmentType.HOTELS_PROPERTY,
    InvestmentType.STARTUP
  ];

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-8xl font-bold text-slate-900 mb-6 tracking-tighter uppercase italic">
            {t('testimonials', language)}
          </h1>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto font-light">
            {t('joinInvestors', language)}
          </p>
        </motion.div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto mb-16">
        <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2 text-slate-500">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium uppercase tracking-widest">Filters</span>
            </div>
            
            <div className="flex flex-wrap gap-4 flex-grow">
              {/* Month Filter */}
              <select 
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
                className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
              >
                <option value="All">All Months</option>
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>

              {/* Year Filter */}
              <select 
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
              >
                <option value="All">All Years</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>

              {/* Property Type Filter */}
              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
              >
                <option value="All">All Property Types</option>
                {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <button 
              onClick={() => { setMonthFilter('All'); setYearFilter('All'); setTypeFilter('All'); }}
              className="text-slate-400 hover:text-slate-900 text-sm transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Real-Time Success Stories Grid */}
      <div className="max-w-7xl mx-auto mb-32">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight italic">
            {t('successStories', language)}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {successStories.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative bg-white border border-slate-200 rounded-[2rem] overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer"
                onClick={() => onNavigate('testimonial-detail', testimonial)}
              >
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img
                    src={testimonial.imageUrl}
                    alt={testimonial.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="absolute top-6 right-6">
                    <div className="bg-emerald-500 text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">
                      {testimonial.successStory?.propertyType}
                    </div>
                  </div>

                  <div className="absolute bottom-8 left-8 right-8 transform group-hover:-translate-y-2 transition-transform duration-500">
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-10 h-10 rounded-full border-2 border-emerald-500 shadow-lg"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h3 className="text-white font-bold text-sm tracking-tight">{testimonial.name}</h3>
                        <p className="text-slate-300 text-[10px] uppercase tracking-widest font-medium">{testimonial.role}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-sm">
                        <p className="text-slate-300 text-[8px] uppercase mb-1 font-bold">Total Investment</p>
                        <p className="text-white font-bold text-sm">${testimonial.successStory?.amount.toLocaleString()}</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-sm">
                        <p className="text-slate-300 text-[8px] uppercase mb-1 font-bold">Holding Period</p>
                        <p className="text-white font-bold text-sm">{testimonial.successStory?.holdingPeriod}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-white group-hover:bg-slate-50 transition-colors duration-500">
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-4 font-medium">
                    {testimonial.successStory?.description}
                  </p>
                  {testimonial.successStory?.paragraph && (
                    <div className="mb-6 opacity-80 group-hover:opacity-100 transition-opacity">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Selected Paragraphs</p>
                      <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 italic font-light">
                        {testimonial.successStory.paragraph}
                      </p>
                    </div>
                  )}
                  <div 
                    className="w-full py-4 bg-slate-900 text-white group-hover:bg-emerald-500 group-hover:text-black rounded-2xl transition-all duration-500 font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10 group-hover:shadow-emerald-500/20"
                  >
                    {t('viewFullStory', language)}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Video Testimonials Slider */}
      <div className="max-w-7xl mx-auto mb-32">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight italic">
            {t('videoTestimonials', language)}
          </h2>
          <div className="flex gap-4">
            <button onClick={prevVideo} className="p-3 bg-white border border-slate-200 rounded-full text-slate-900 hover:bg-emerald-500 hover:text-black transition-all shadow-sm">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={nextVideo} className="p-3 bg-white border border-slate-200 rounded-full text-slate-900 hover:bg-emerald-500 hover:text-black transition-all shadow-sm">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="relative h-[500px] w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={videoIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              {videoTestimonials.length > 0 ? (
                <div 
                  className="w-full h-full rounded-[3rem] overflow-hidden relative group cursor-pointer shadow-2xl"
                  onClick={() => setSelectedVideo(videoTestimonials[videoIndex].videoUrl)}
                >
                  <img
                    src={videoTestimonials[videoIndex].imageUrl || videoTestimonials[videoIndex].avatar}
                    alt={videoTestimonials[videoIndex].name}
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-2xl shadow-emerald-500/40">
                      <Play className="w-10 h-10 text-black fill-current" />
                    </div>
                  </div>
                  <div className="absolute bottom-12 left-12">
                    <h3 className="text-5xl font-bold text-white mb-4 italic drop-shadow-lg">{videoTestimonials[videoIndex].name}</h3>
                    <p className="text-xl text-white/90 drop-shadow-md">{videoTestimonials[videoIndex].role} @ {videoTestimonials[videoIndex].company}</p>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full rounded-[3rem] bg-slate-100 flex items-center justify-center">
                  <p className="text-slate-400 font-bold uppercase tracking-widest">No video testimonials available</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl"
            >
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-6 right-6 z-10 p-3 bg-white/10 hover:bg-emerald-500 hover:text-black rounded-full transition-all text-white"
              >
                <X className="w-6 h-6" />
              </button>
              <iframe
                src={selectedVideo}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TestimonialsPage;
