import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  User, 
  ArrowLeft, 
  MapPin,
  Clock,
  Briefcase,
  Building2
} from 'lucide-react';
import { Language, t } from '../translations';
import { Testimonial } from '../types';

interface TestimonialDetailPageProps {
  testimonial: Testimonial;
  onBack: () => void;
  language: Language;
}

export const TestimonialDetailPage: React.FC<TestimonialDetailPageProps> = ({ 
  testimonial, 
  onBack, 
  language 
}) => {
  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors mb-12 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="uppercase tracking-widest text-xs font-bold">Back to Testimonials</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3rem] overflow-hidden border border-slate-200 shadow-2xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="h-[400px] lg:h-auto relative">
              <img
                src={testimonial.imageUrl}
                alt={testimonial.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent hidden lg:block" />
            </div>

            <div className="p-8 md:p-16">
              <div className="flex items-center gap-6 mb-12">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-20 h-20 rounded-full border-2 border-emerald-500"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">{testimonial.name}</h2>
                  <p className="text-slate-500">{testimonial.role} @ {testimonial.company}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
                <div className="space-y-1">
                  <p className="text-slate-500 text-[10px] uppercase tracking-widest">Asset Invested</p>
                  <p className="text-slate-900 font-bold flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-500" />
                    {testimonial.successStory.assetName}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-500 text-[10px] uppercase tracking-widest">Amount Invested</p>
                  <p className="text-slate-900 font-bold flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    ${testimonial.successStory.amount.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-500 text-[10px] uppercase tracking-widest">Asset Class</p>
                  <p className="text-slate-900 font-bold flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-emerald-500" />
                    {testimonial.successStory.assetClass}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-500 text-[10px] uppercase tracking-widest">Holding Period</p>
                  <p className="text-slate-900 font-bold flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-500" />
                    {testimonial.successStory.holdingPeriod}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-500 text-[10px] uppercase tracking-widest">Return Type</p>
                  <p className="text-slate-900 font-bold flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    {testimonial.successStory.returnType}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-500 text-[10px] uppercase tracking-widest">Location</p>
                  <p className="text-slate-900 font-bold flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    {testimonial.successStory.location}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 mb-12">
                <div className="flex flex-wrap gap-12 justify-between">
                  {testimonial.successStory.returnType === 'ROI' ? (
                    <div>
                      <p className="text-emerald-600 font-bold text-2xl">{testimonial.successStory.roi}</p>
                      <p className="text-slate-500 text-[10px] uppercase mt-2 tracking-widest">ROI</p>
                    </div>
                  ) : (
                    <>
                      {testimonial.successStory.returnType === 'Monthly Rent' && (
                        <div>
                          <p className="text-slate-900 font-bold text-2xl">${testimonial.successStory.monthlyReturn.toLocaleString()}</p>
                          <p className="text-slate-500 text-[10px] uppercase mt-2 tracking-widest">Monthly Rent</p>
                        </div>
                      )}
                      {testimonial.successStory.returnType === 'Yearly Rent' && (
                        <div>
                          <p className="text-slate-900 font-bold text-2xl">${testimonial.successStory.yearlyRent.toLocaleString()}</p>
                          <p className="text-slate-500 text-[10px] uppercase mt-2 tracking-widest">Yearly Rent</p>
                        </div>
                      )}
                      {testimonial.successStory.returnType === 'Dividend' && (
                        <div>
                          <p className="text-slate-900 font-bold text-2xl">${testimonial.successStory.dividend.toLocaleString()}</p>
                          <p className="text-slate-500 text-[10px] uppercase mt-2 tracking-widest">Dividend</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {testimonial.successStory.paragraph && (
                <div className="mb-12 p-8 bg-emerald-50/50 rounded-3xl border border-emerald-100">
                  <h4 className="text-emerald-900 font-bold text-lg mb-4 italic uppercase tracking-tighter">Selected Paragraphs</h4>
                  <p className="text-slate-700 leading-relaxed text-lg">
                    {testimonial.successStory.paragraph}
                  </p>
                </div>
              )}

              <div className="space-y-6">
                <h4 className="text-slate-900 font-bold text-xl italic uppercase tracking-tighter">Investor Testimonial</h4>
                <p className="text-slate-600 leading-relaxed text-lg font-light italic">
                  "{testimonial.textTestimonial}"
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
