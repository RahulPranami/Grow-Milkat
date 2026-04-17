
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Check, ExternalLink } from 'lucide-react';

interface LegalAcceptanceModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onViewPrivacy: () => void;
  onViewTerms: () => void;
}

const LegalAcceptanceModal: React.FC<LegalAcceptanceModalProps> = ({ 
  isOpen, 
  onAccept, 
  onViewPrivacy, 
  onViewTerms 
}) => {
  const [isTicked, setIsTicked] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 md:p-10">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Shield className="w-8 h-8 text-emerald-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-900 text-center serif mb-4">
                Legal Agreement Required
              </h2>
              
              <p className="text-slate-600 text-center mb-8 leading-relaxed">
                To continue using Grow Milkat, please review and accept our updated Privacy Policy and Terms & Conditions. This ensures your data and investments are protected under our latest governance protocols.
              </p>
              
              <div className="space-y-4 mb-8">
                <button 
                  onClick={onViewPrivacy}
                  className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition group"
                >
                  <span className="font-bold text-slate-700">Privacy Policy</span>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
                </button>
                
                <button 
                  onClick={onViewTerms}
                  className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition group"
                >
                  <span className="font-bold text-slate-700">Terms & Conditions</span>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
                </button>
              </div>
              
              <div className="flex items-start gap-3 mb-8">
                <div 
                  onClick={() => setIsTicked(!isTicked)}
                  className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all duration-300 ${
                    isTicked ? 'bg-emerald-600 border-emerald-600' : 'border-slate-200 bg-white'
                  }`}
                >
                  {isTicked && <Check className="w-4 h-4 text-white" />}
                </div>
                <p className="text-sm text-slate-500 leading-snug">
                  I have read and agree to the <span className="text-emerald-600 font-bold cursor-pointer hover:underline" onClick={onViewPrivacy}>Privacy Policy</span> and <span className="text-emerald-600 font-bold cursor-pointer hover:underline" onClick={onViewTerms}>Terms & Conditions</span>.
                </p>
              </div>
              
              <button
                disabled={!isTicked}
                onClick={onAccept}
                className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all duration-300 ${
                  isTicked 
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' 
                    : 'bg-slate-300 cursor-not-allowed shadow-none'
                }`}
              >
                Accept and Continue
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LegalAcceptanceModal;
