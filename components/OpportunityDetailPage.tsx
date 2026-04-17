
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Opportunity, InvestmentType, ReturnType, RiskLevel, Investor } from '../types';
import { 
  ArrowLeft, MapPin, Shield, Calendar, DollarSign, TrendingUp, 
  CheckCircle, User, Briefcase, Activity, Building2, Hotel, 
  Cpu, Layers, Zap, Globe2, Award, Users2, BarChart3, 
  ArrowUpRight, FileText, Play, Image as ImageIcon, Calculator, Lock,
  AlertCircle, Share2, Facebook, Instagram, Twitter, Linkedin, MessageCircle, Copy
} from 'lucide-react';

interface OpportunityDetailPageProps {
  opportunity: Opportunity;
  onBack: () => void;
  onInvest: (opp: Opportunity, amount: number) => void;
  isLoggedIn?: boolean;
  currentUser?: Investor | null;
  formatCurrency: (amount: number) => string;
  selectedCurrency: string;
  t: (key: string) => string;
}

const OpportunityDetailPage: React.FC<OpportunityDetailPageProps> = ({ opportunity, onBack, onInvest, isLoggedIn, currentUser, formatCurrency, selectedCurrency, t }) => {
  const [calcAmount, setCalcAmount] = useState<string>(opportunity.minInvestment.toString());
  const [customROI, setCustomROI] = useState<string>(() => {
    if (opportunity.returnType === ReturnType.ROI && opportunity.roiPercentage !== undefined) return opportunity.roiPercentage.toString();
    if ((opportunity.returnType === ReturnType.MONTHLY_RENT || opportunity.returnType === ReturnType.YEARLY_RENT) && opportunity.rentPercentage !== undefined) return opportunity.rentPercentage.toString();
    if (opportunity.returnType === ReturnType.DIVIDEND && opportunity.dividendPercentage !== undefined) return opportunity.dividendPercentage.toString();
    return opportunity.expectedROI.replace(/[^0-9.]/g, '');
  });
  const [activeMedia, setActiveMedia] = useState<'image' | 'video' | 'pdf'>('image');
  const [error, setError] = useState<string | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [allocationConfirmed, setAllocationConfirmed] = useState(false);
  const [allocatedAmount, setAllocatedAmount] = useState<number>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [opportunity.id]);

  const handleShare = (platform: 'twitter' | 'linkedin' | 'facebook' | 'instagram' | 'whatsapp' | 'copy') => {
    const text = `Check out this investment opportunity: ${opportunity.title} (${opportunity.expectedROI} expected ROI)`;
    const url = window.location.href;
    
    switch (platform) {
      case 'copy':
        navigator.clipboard.writeText(`${text} ${url}`);
        alert('Link copied to clipboard!');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      case 'instagram':
        navigator.clipboard.writeText(url);
        alert('Link copied! You can now paste it in your Instagram story or bio.');
        break;
    }
    setShowShareMenu(false);
  };

  const projectedReturn = (() => {
    const amount = parseFloat(calcAmount) || 0;
    
    // Prioritize fixed amounts if available
    if (opportunity.returnType === ReturnType.ROI && opportunity.roiAmount !== undefined) {
      return (amount / opportunity.targetAmount) * opportunity.roiAmount;
    }
    if ((opportunity.returnType === ReturnType.MONTHLY_RENT || opportunity.returnType === ReturnType.YEARLY_RENT) && opportunity.rentAmount !== undefined) {
      return (amount / opportunity.targetAmount) * opportunity.rentAmount;
    }
    if (opportunity.returnType === ReturnType.DIVIDEND && opportunity.dividendAmount !== undefined) {
      return (amount / opportunity.targetAmount) * opportunity.dividendAmount;
    }

    const roi = parseFloat(customROI) || 0;
    return (amount * (roi / 100));
  })();

  const projectedAnnualReturn = (() => {
    if (!opportunity.expectedIRR) return null;
    const amount = parseFloat(calcAmount) || 0;
    const irr = parseFloat(opportunity.expectedIRR.replace(/[^0-9.]/g, '')) || 0;
    return (amount * (irr / 100));
  })();

  const totalValue = (parseFloat(calcAmount) || 0) + projectedReturn;

  const handleOpenPDF = () => {
    if (opportunity.pdfUrl) {
      try {
        if (opportunity.pdfUrl.startsWith('data:application/pdf;base64,')) {
          const base64 = opportunity.pdfUrl.split(',')[1];
          const binary = atob(base64);
          const array = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            array[i] = binary.charCodeAt(i);
          }
          const blob = new Blob([array], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
        } else {
          window.open(opportunity.pdfUrl, '_blank');
        }
      } catch (err) {
        console.error("Error opening PDF:", err);
        window.open(opportunity.pdfUrl, '_blank');
      }
    }
    setActiveMedia('pdf');
  };

  const handleDownloadPartnerDetails = () => {
    if (opportunity.partnerDetailsUrl) {
      try {
        if (opportunity.partnerDetailsUrl.startsWith('data:application/pdf;base64,')) {
          const base64 = opportunity.partnerDetailsUrl.split(',')[1];
          const binary = atob(base64);
          const array = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            array[i] = binary.charCodeAt(i);
          }
          const blob = new Blob([array], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${opportunity.partnerName || 'Partner'}_Details.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        } else {
          const link = document.createElement('a');
          link.href = opportunity.partnerDetailsUrl;
          link.target = '_blank';
          link.download = `${opportunity.partnerName || 'Partner'}_Details.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } catch (err) {
        console.error("Error downloading partner details:", err);
        window.open(opportunity.partnerDetailsUrl, '_blank');
      }
    } else {
      alert('Partner details PDF not available.');
    }
  };

  if (allocationConfirmed) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center shadow-2xl border border-slate-100"
        >
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-12 h-12 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 serif mb-4">Allocation Confirmed</h2>
          <p className="text-slate-600 leading-relaxed mb-10">
            Successfully allocated <span className="font-black text-slate-900">{formatCurrency(allocatedAmount)}</span> to the <span className="font-bold text-slate-900">{opportunity.title}</span> portfolio.
          </p>
          <button 
            onClick={onBack}
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition shadow-xl"
          >
            {t('backToPortfolios')}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold text-sm mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t('backToPortfolios')}
        </button>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-12">
            {/* Title & Location */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {opportunity.type}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    opportunity.riskLevel === RiskLevel.LOW ? 'bg-emerald-50 text-emerald-600' :
                    opportunity.riskLevel === RiskLevel.MODERATE ? 'bg-amber-50 text-amber-600' :
                    'bg-rose-50 text-rose-600'
                  }`}>
                    {opportunity.riskLevel} Risk
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 serif mb-4">{opportunity.title}</h1>
                <div className="flex items-center text-slate-500 font-medium">
                  <MapPin className="w-4 h-4 mr-2 text-emerald-600" />
                  {opportunity.location}
                </div>
                {opportunity.publishedAt && (
                  <div className="flex items-center text-slate-500 font-medium mt-2">
                    <Calendar className="w-4 h-4 mr-2 text-emerald-600" />
                    Published: {new Date(opportunity.publishedAt).toLocaleDateString()}
                  </div>
                )}
                {opportunity.rentAmount && opportunity.rentAmount > 0 && (
                  <div className="flex items-center text-emerald-600 font-bold mt-2">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Expected Rent: ${opportunity.rentAmount.toLocaleString()} / {opportunity.returnType === ReturnType.MONTHLY_RENT ? 'Month' : 'Year'}
                  </div>
                )}
              </div>

              <div className="relative">
                <button 
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-xs uppercase tracking-widest text-slate-600 hover:text-emerald-600 hover:border-emerald-500 transition-all shadow-sm"
                >
                  <Share2 className="w-4 h-4" /> Share
                </button>

                {showShareMenu && (
                  <div className="absolute top-full right-0 mt-2 bg-white shadow-2xl rounded-2xl p-4 border border-slate-100 min-w-[200px] z-50 animate-in fade-in zoom-in-95 slide-in-from-top-2 space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-2">Share Opportunity</p>
                    <button onClick={() => handleShare('facebook')} className="w-full flex items-center gap-3 p-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
                      <Facebook className="w-4 h-4 text-[#1877F2]" /> Facebook
                    </button>
                    <button onClick={() => handleShare('instagram')} className="w-full flex items-center gap-3 p-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
                      <Instagram className="w-4 h-4 text-[#E4405F]" /> Instagram
                    </button>
                    <button onClick={() => handleShare('twitter')} className="w-full flex items-center gap-3 p-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
                      <Twitter className="w-4 h-4 text-slate-900" /> X (Twitter)
                    </button>
                    <button onClick={() => handleShare('linkedin')} className="w-full flex items-center gap-3 p-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
                      <Linkedin className="w-4 h-4 text-[#0A66C2]" /> LinkedIn
                    </button>
                    <button onClick={() => handleShare('whatsapp')} className="w-full flex items-center gap-3 p-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
                      <MessageCircle className="w-4 h-4 text-[#25D366]" /> WhatsApp
                    </button>
                    <div className="h-px bg-slate-100 my-2" />
                    <button onClick={() => handleShare('copy')} className="w-full flex items-center gap-3 p-2.5 text-sm font-black text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors">
                      <Copy className="w-4 h-4" /> Copy Link
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Media Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-video bg-slate-200 rounded-[2rem] overflow-hidden shadow-2xl border border-slate-200">
                {activeMedia === 'image' && (
                  <img src={opportunity.imageUrl} className="w-full h-full object-cover" alt={opportunity.title} />
                )}
                {activeMedia === 'video' && (
                  <div className="w-full h-full flex items-center justify-center bg-slate-900">
                    {opportunity.videoUrl ? (
                      <iframe 
                        src={opportunity.videoUrl} 
                        className="w-full h-full" 
                        title="Investment Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <div className="text-center text-white p-8">
                        <Play className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p className="text-sm font-bold opacity-50">Video presentation coming soon</p>
                      </div>
                    )}
                  </div>
                )}
                {activeMedia === 'pdf' && (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100">
                    {opportunity.pdfUrl ? (
                      <>
                        <div className="absolute top-4 right-4 z-10">
                          <button 
                            onClick={handleOpenPDF}
                            className="bg-white/90 backdrop-blur-sm text-slate-900 px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg hover:bg-white transition-all flex items-center gap-2 border border-slate-200"
                          >
                            <ArrowUpRight className="w-3 h-3" /> Open Full PDF
                          </button>
                        </div>
                        <iframe 
                          src={opportunity.pdfUrl} 
                          className="w-full h-full" 
                          title="Investment Prospectus"
                        ></iframe>
                      </>
                    ) : (
                      <div className="text-center text-slate-400 p-8">
                        <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p className="text-sm font-bold opacity-50">Legal prospectus available upon request</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setActiveMedia('image')}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all border ${
                    activeMedia === 'image' ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-500 hover:text-emerald-600'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" /> Gallery
                </button>
                <button 
                  onClick={() => setActiveMedia('video')}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all border ${
                    activeMedia === 'video' ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-500 hover:text-emerald-600'
                  }`}
                >
                  <Play className="w-4 h-4" /> Video
                </button>
                <button 
                  onClick={handleOpenPDF}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all border ${
                    activeMedia === 'pdf' ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-500 hover:text-emerald-600'
                  }`}
                >
                  <FileText className="w-4 h-4" /> Prospectus
                </button>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className={`grid grid-cols-2 gap-4 ${opportunity.rentAmount && opportunity.rentAmount > 0 ? 'sm:grid-cols-3 lg:grid-cols-5' : 'sm:grid-cols-4'}`}>
              <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Asset Class</p>
                <p className="font-bold text-slate-900 text-sm">{opportunity.assetClass || 'Private Market'}</p>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Holding Period</p>
                <p className="font-bold text-slate-900 text-sm">{opportunity.holdingPeriod || '5-7 Years'}</p>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Payout</p>
                <p className="font-bold text-slate-900 text-sm">{opportunity.payoutFrequency || 'Quarterly'}</p>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Expected ROI</p>
                <p className="font-black text-emerald-600 text-sm">{opportunity.expectedROI}</p>
              </div>
              
              {/* Flexible Return Metrics Display */}
              {(opportunity.returnType === ReturnType.MONTHLY_RENT || opportunity.returnType === ReturnType.YEARLY_RENT) && (
                <>
                  {opportunity.rentAmount !== undefined && (
                    <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm text-center border-emerald-100 bg-emerald-50/30">
                      <p className="text-[10px] font-black text-emerald-600 uppercase mb-2 tracking-widest">Expected Rent</p>
                      <p className="font-black text-emerald-600 text-sm">
                        {formatCurrency(opportunity.rentAmount)} <span className="text-[10px] opacity-70">/ {opportunity.returnType === ReturnType.MONTHLY_RENT ? 'mo' : 'yr'}</span>
                      </p>
                    </div>
                  )}
                  {opportunity.rentPercentage !== undefined && (
                    <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm text-center border-blue-100 bg-blue-50/30">
                      <p className="text-[10px] font-black text-blue-600 uppercase mb-2 tracking-widest">Rent (%)</p>
                      <p className="font-black text-blue-600 text-sm">{opportunity.rentPercentage}%</p>
                    </div>
                  )}
                </>
              )}

              {opportunity.returnType === ReturnType.DIVIDEND && (
                <>
                  {opportunity.dividendAmount !== undefined && (
                    <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm text-center border-emerald-100 bg-emerald-50/30">
                      <p className="text-[10px] font-black text-emerald-600 uppercase mb-2 tracking-widest">Expected Dividend</p>
                      <p className="font-black text-emerald-600 text-sm">{formatCurrency(opportunity.dividendAmount)}</p>
                    </div>
                  )}
                  {opportunity.dividendPercentage !== undefined && (
                    <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm text-center border-blue-100 bg-blue-50/30">
                      <p className="text-[10px] font-black text-blue-600 uppercase mb-2 tracking-widest">Dividend Yield</p>
                      <p className="font-black text-blue-600 text-sm">{opportunity.dividendPercentage}%</p>
                    </div>
                  )}
                </>
              )}

              {opportunity.returnType === ReturnType.ROI && (
                <>
                  {opportunity.roiAmount !== undefined && (
                    <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm text-center border-emerald-100 bg-emerald-50/30">
                      <p className="text-[10px] font-black text-emerald-600 uppercase mb-2 tracking-widest">Expected ROI ($)</p>
                      <p className="font-black text-emerald-600 text-sm">{formatCurrency(opportunity.roiAmount)}</p>
                    </div>
                  )}
                  {opportunity.roiPercentage !== undefined && (
                    <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm text-center border-blue-100 bg-blue-50/30">
                      <p className="text-[10px] font-black text-blue-600 uppercase mb-2 tracking-widest">ROI (%)</p>
                      <p className="font-black text-blue-600 text-sm">{opportunity.roiPercentage}%</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Return Calculator Section - Moved for better visibility */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <Calculator className="w-6 h-6 text-emerald-600" /> {t('returnCalculator')}
              </h3>
              <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 shadow-xl">
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('investmentAmount')} ({selectedCurrency})</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">{selectedCurrency}</div>
                        <input 
                          type="number" 
                          className="w-full pl-16 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-xl outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
                          value={calcAmount}
                          onChange={(e) => {
                            setCalcAmount(e.target.value);
                            setError(null);
                          }}
                        />
                      </div>
                      {error && <p className="text-[10px] text-rose-500 font-bold mt-1">{error}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expected ROI (%)</label>
                      <div className="relative">
                        <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                          type="number" 
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-xl outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
                          value={customROI}
                          onChange={(e) => setCustomROI(e.target.value)}
                        />
                      </div>
                      <p className="text-[10px] text-slate-500 italic">
                        Default for this asset: {
                          opportunity.returnType === ReturnType.ROI && opportunity.roiAmount !== undefined ? formatCurrency(opportunity.roiAmount) :
                          (opportunity.returnType === ReturnType.MONTHLY_RENT || opportunity.returnType === ReturnType.YEARLY_RENT) && opportunity.rentAmount !== undefined ? formatCurrency(opportunity.rentAmount) :
                          opportunity.returnType === ReturnType.DIVIDEND && opportunity.dividendAmount !== undefined ? formatCurrency(opportunity.dividendAmount) :
                          opportunity.expectedROI
                        }
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-8 bg-slate-900 rounded-[2rem] text-white space-y-6 shadow-2xl">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-400">{t('projectedReturn')}</span>
                        <span className="text-2xl font-black text-emerald-400">{formatCurrency(projectedReturn)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-400">{t('totalValue')}</span>
                        <span className="text-2xl font-black text-white">{formatCurrency(totalValue)}</span>
                      </div>
                      
                      {opportunity.expectedIRR && (
                        <div className="pt-6 border-t border-white/10">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-slate-400">{t('annualizedIRR')}</span>
                            <span className="text-lg font-black text-blue-400">{opportunity.expectedIRR}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                      <Activity className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <p className="text-[10px] text-amber-800 leading-relaxed font-medium">
                        This calculator is for illustrative purposes. Returns are projected based on performance targets and are not guaranteed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <Briefcase className="w-6 h-6 text-emerald-600" /> Executive Summary
              </h3>
              <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <p className="text-slate-600 leading-relaxed text-lg">{opportunity.description}</p>
              </div>
            </div>

            {/* Partner Section */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Users2 className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Partner</p>
                  <p className="text-xl font-bold text-slate-900">{opportunity.partnerName || 'Strategic Partner'}</p>
                </div>
              </div>
              
              <button 
                onClick={handleDownloadPartnerDetails}
                className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6 hover:border-emerald-500 transition-all group text-left"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
                  <FileText className="w-8 h-8 text-blue-600 group-hover:text-emerald-600 transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">View Partner Details</p>
                  <p className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">Download PDF</p>
                </div>
              </button>
            </div>

            {/* Key Metrics */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-emerald-600" /> Key Metrics
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {(opportunity.kpis && opportunity.kpis.length > 0) ? opportunity.kpis.map((kpi, idx) => (
                  <div key={idx} className="flex justify-between items-center p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
                    <span className="text-sm font-bold text-slate-500">{kpi.label}</span>
                    <span className="text-xl font-black text-slate-900">{kpi.value}</span>
                  </div>
                )) : (
                  <div className="col-span-2 text-sm text-slate-400 italic bg-white p-8 rounded-3xl border border-dashed border-slate-200 text-center">
                    Financial performance metrics are detailed in the confidential information memorandum.
                  </div>
                )}
              </div>
            </div>

            {/* Project Milestones */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <Activity className="w-6 h-6 text-emerald-600" /> Project Milestones
              </h3>
              <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8 relative before:absolute before:left-[2.35rem] before:top-12 before:bottom-12 before:w-px before:bg-slate-100">
                {(opportunity.milestones && opportunity.milestones.length > 0) ? opportunity.milestones.map((m, idx) => (
                  <div key={idx} className="flex items-start gap-6 relative z-10">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg border-4 border-white ${m.completed ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      {m.completed ? <CheckCircle className="w-6 h-6" /> : <div className="w-3 h-3 rounded-full bg-slate-300" />}
                    </div>
                    <div className="pt-2">
                      <p className={`text-lg font-bold ${m.completed ? 'text-slate-900' : 'text-slate-500'}`}>{m.label}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{m.date}</p>
                    </div>
                  </div>
                )) : (
                  <div className="text-sm text-slate-400 italic p-4 text-center">
                    Development roadmap is available in the data room.
                  </div>
                )}
              </div>
            </div>

            {/* Lead Management */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <User className="w-6 h-6 text-emerald-600" /> Lead Management
              </h3>
              {opportunity.leadImageUrl && (
                <div className="w-full h-48 rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm mb-6">
                  <img src={opportunity.leadImageUrl} className="w-full h-full object-cover" alt="Lead Management" />
                </div>
              )}
              <div className="grid sm:grid-cols-2 gap-6">
                {(opportunity.team && opportunity.team.length > 0) ? opportunity.team.map((member, idx) => (
                  <div key={idx} className="flex items-center gap-5 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm group hover:border-emerald-500 transition-colors">
                    <img src={member.avatar} className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md" alt={member.name} />
                    <div>
                      <p className="font-bold text-slate-900 text-lg">{member.name}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{member.role}</p>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-2 text-sm text-slate-400 italic bg-white p-8 rounded-3xl border border-dashed border-slate-200 text-center">
                    Executive team details are available in the legal disclosures.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            {/* Funding Status Card */}
            <div className="bg-slate-900 p-10 rounded-[3rem] text-white space-y-8 shadow-2xl border border-white/5 sticky top-24">
              <div className="space-y-2">
                <p className="text-emerald-400 font-black uppercase text-[10px] tracking-widest">Funding Status</p>
                <h3 className="text-4xl font-black">{formatCurrency(opportunity.raisedAmount)}</h3>
                <p className="text-sm font-medium text-slate-400 italic">Raised of {formatCurrency(opportunity.targetAmount)} Goal</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>Progress</span>
                  <span>{Math.round((opportunity.raisedAmount / opportunity.targetAmount) * 100)}%</span>
                </div>
                <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-1000 shadow-[0_0_20px_rgba(16,185,129,0.5)]" 
                    style={{ width: `${Math.min(100, (opportunity.raisedAmount / opportunity.targetAmount) * 100)}%` }} 
                  />
                </div>
              </div>

              <div className="space-y-6 pt-4">
                <div className="flex justify-between border-b border-white/10 pb-4">
                  <span className="text-slate-400 font-medium">Target Return</span>
                  <span className="font-black text-emerald-400 text-xl">{opportunity.expectedROI}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-4">
                  <span className="text-slate-400 font-medium">Minimum Entry</span>
                  <span className="font-bold text-lg">{formatCurrency(opportunity.minInvestment)}</span>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('investmentAmount')} ({selectedCurrency})</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">{selectedCurrency}</div>
                      <input 
                        type="number" 
                        placeholder={opportunity.minInvestment.toString()}
                        className="w-full pl-16 pr-4 py-5 bg-white/5 border border-white/10 rounded-2xl font-black text-xl outline-none focus:ring-2 focus:ring-emerald-500/20 transition text-white"
                        value={calcAmount}
                        onChange={(e) => {
                          setCalcAmount(e.target.value);
                          setError(null);
                        }}
                      />
                    </div>
                    {error && <p className="text-[10px] text-rose-500 font-bold mt-1 animate-pulse">{error}</p>}
                    <p className="text-[10px] text-slate-500 italic">{t('minEntry')}: {formatCurrency(opportunity.minInvestment)}</p>
                  </div>

                  <button 
                    onClick={() => {
                      if (opportunity.raisedAmount >= opportunity.targetAmount) return;

                      if (!isLoggedIn || currentUser?.kycStatus !== 'Verified') {
                        onInvest(opportunity, opportunity.minInvestment);
                        return;
                      }

                      const amount = parseFloat(calcAmount) || opportunity.minInvestment;
                      const remaining = opportunity.targetAmount - opportunity.raisedAmount;

                      if (amount > remaining) {
                        setError(`Only $${remaining.toLocaleString()} is available for investment. Amount adjusted.`);
                        setCalcAmount(remaining.toString());
                        return;
                      }

                      if (amount < opportunity.minInvestment && amount < remaining) {
                        setError(`Minimum investment is $${opportunity.minInvestment.toLocaleString()}`);
                        return;
                      }
                      setError(null);
                      onInvest(opportunity, amount);
                      setAllocatedAmount(amount);
                      setAllocationConfirmed(true);
                    }}
                    disabled={opportunity.raisedAmount >= opportunity.targetAmount}
                    className={`w-full py-6 rounded-2xl font-black text-lg transition shadow-2xl flex items-center justify-center gap-3 ${
                      opportunity.raisedAmount >= opportunity.targetAmount
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : !isLoggedIn
                        ? 'bg-slate-800 text-white hover:bg-slate-700'
                        : currentUser?.kycStatus !== 'Verified'
                          ? 'bg-amber-600 text-white hover:bg-amber-700'
                          : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-600/20'
                    }`}
                  >
                    {opportunity.raisedAmount >= opportunity.targetAmount 
                      ? 'Fully Funded' 
                      : !isLoggedIn 
                        ? 'Login to Invest' 
                        : currentUser?.kycStatus !== 'Verified' 
                          ? 'Verify KYC' 
                          : 'Request Allocation'} 
                    {opportunity.raisedAmount < opportunity.targetAmount && (!isLoggedIn || currentUser?.kycStatus !== 'Verified' ? <Lock className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />)}
                  </button>
                </div>

                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Your allocation request is subject to KYC verification and final approval by the asset manager.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetailPage;
