
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ShieldCheck, Scale, AlertCircle } from 'lucide-react';
import { LegalSection } from '../types';

interface TermsConditionsPageProps {
  config: {
    termsConditions: LegalSection[];
  };
}

const TermsConditionsPage: React.FC<TermsConditionsPageProps> = ({ config }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-20 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/30"
          >
            <FileText className="w-8 h-8 text-blue-400" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold serif mb-4">Terms & Conditions</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Please read these terms carefully before using the Grow Milkat platform.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="prose prose-slate max-w-none">
          {config.termsConditions.map((section) => (
            <section key={section.id} className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                {section.title === 'Acceptance of Terms' && <Scale className="w-6 h-6 text-blue-600" />}
                {section.title === 'Investment Risks' && <AlertCircle className="w-6 h-6 text-blue-600" />}
                {section.title === 'Eligibility and Registration' && <ShieldCheck className="w-6 h-6 text-blue-600" />}
                {section.title !== 'Acceptance of Terms' && section.title !== 'Investment Risks' && section.title !== 'Eligibility and Registration' && <FileText className="w-6 h-6 text-blue-600" />}
                {section.title}
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                {section.content}
              </p>
              {section.items && section.items.length > 0 && (
                <ul className={`${section.type === 'numbers' ? 'list-decimal' : 'list-disc'} pl-6 space-y-2 text-slate-600`}>
                  {section.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <div className="mt-20 pt-10 border-t border-slate-100 text-sm text-slate-400 text-center">
            Last updated: March 2026
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditionsPage;
