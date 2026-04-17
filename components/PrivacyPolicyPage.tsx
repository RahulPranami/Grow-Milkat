
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText } from 'lucide-react';
import { LegalSection } from '../types';

interface PrivacyPolicyPageProps {
  config: {
    privacyPolicy: LegalSection[];
  };
}

const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ config }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-20 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/30"
          >
            <Shield className="w-8 h-8 text-emerald-400" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold serif mb-4">Privacy Policy</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Your privacy is our priority. Learn how we protect and manage your data at Grow Milkat.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="prose prose-slate max-w-none">
          {config.privacyPolicy.map((section) => (
            <section key={section.id} className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                {section.title === 'Information We Collect' && <Eye className="w-6 h-6 text-emerald-600" />}
                {section.title === 'How We Use Your Information' && <Lock className="w-6 h-6 text-emerald-600" />}
                {section.title === 'Data Security' && <Shield className="w-6 h-6 text-emerald-600" />}
                {section.title !== 'Information We Collect' && section.title !== 'How We Use Your Information' && section.title !== 'Data Security' && <FileText className="w-6 h-6 text-emerald-600" />}
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

export default PrivacyPolicyPage;
