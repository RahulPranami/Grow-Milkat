
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Opportunity, InvestmentType, ReturnType, RiskLevel, Investor } from '../types';
import { 
  LayoutGrid, List, Search, Filter, X, ChevronDown, SlidersHorizontal, 
  ArrowUpRight, MapPin, Shield, Calendar, DollarSign, TrendingUp, AlertCircle, CheckCircle2,
  Copy, BarChart3, ArrowLeftRight, Share2, Linkedin, Twitter, Edit3, Trash2,
  CheckCircle, User, Briefcase, Activity, ShoppingCart, CreditCard,
  Cpu, Hotel, Building2, Globe2, Zap, Award, Users2, Layers, Lock,
  Facebook, Instagram, MessageCircle
} from 'lucide-react';

interface PortfolioPageProps {
  opportunities: Opportunity[];
  onInvest: (opp: Opportunity, amount: number) => void;
  isAdmin?: boolean;
  isLoggedIn?: boolean;
  currentUser?: Investor | null;
  onEdit?: (opp: Opportunity) => void;
  onDelete?: (id: string) => void;
  onViewDetail?: (id: string) => void;
  formatCurrency: (amount: number) => string;
  selectedCurrency: string;
  t: (key: string) => string;
}

const PortfolioPage: React.FC<PortfolioPageProps> = ({ opportunities, onInvest, isAdmin, isLoggedIn, currentUser, onEdit, onDelete, onViewDetail, formatCurrency, selectedCurrency, t }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isListView, setIsListView] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [quickInvestOpp, setQuickInvestOpp] = useState<Opportunity | null>(null);
  const [quickInvestAmount, setQuickInvestAmount] = useState<string>('');
  const [showShareDialog, setShowShareDialog] = useState<string | null>(null);
  const [calcAmount, setCalcAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [allocationConfirmed, setAllocationConfirmed] = useState(false);
  const [allocatedAmount, setAllocatedAmount] = useState<number>(0);

  const [filterSector, setFilterSector] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('Newest');

  const filteredOpportunities = useMemo(() => {
    let result = [...opportunities].filter(opp => {
      const matchesSearch = opp.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           opp.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSector = filterSector === 'All' || opp.type === filterSector;
      return matchesSearch && matchesSector;
    });

    if (sortBy === 'Newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'ROI: High to Low') {
      result.sort((a, b) => parseFloat(b.expectedROI) - parseFloat(a.expectedROI));
    } else if (sortBy === 'ROI: Low to High') {
      result.sort((a, b) => parseFloat(a.expectedROI) - parseFloat(b.expectedROI));
    } else if (sortBy === 'Target Amount') {
      result.sort((a, b) => b.targetAmount - a.targetAmount);
    } else if (sortBy === 'Raised Amount') {
      result.sort((a, b) => b.raisedAmount - a.raisedAmount);
    }

    return result;
  }, [opportunities, searchQuery, filterSector, sortBy]);

  const handleShare = (opp: Opportunity, platform: 'twitter' | 'linkedin' | 'facebook' | 'instagram' | 'whatsapp' | 'copy') => {
    const text = `Check out this investment opportunity: ${opp.title} (${opp.expectedROI} expected ROI)`;
    const url = window.location.origin + (onViewDetail ? `?assetId=${opp.id}` : '');
    
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
        // Instagram doesn't have a direct share URL for web, so we copy link and notify
        navigator.clipboard.writeText(url);
        alert('Link copied! You can now paste it in your Instagram story or bio.');
        break;
    }
    setShowShareDialog(null);
  };

  const handleQuickInvestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickInvestOpp && quickInvestAmount) {
      const amount = parseFloat(quickInvestAmount);
      const remaining = quickInvestOpp.targetAmount - quickInvestOpp.raisedAmount;

      if (amount > remaining) {
        setError(`Only ${formatCurrency(remaining)} is available for investment. Amount adjusted.`);
        setQuickInvestAmount(remaining.toString());
        return;
      }

      if (amount >= quickInvestOpp.minInvestment || amount === remaining) {
        setError(null);
        onInvest(quickInvestOpp, amount);
        setAllocatedAmount(amount);
        setAllocationConfirmed(true);
      } else {
        setError(`Minimum investment for this asset is ${formatCurrency(quickInvestOpp.minInvestment)}`);
      }
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-32">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-20">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 serif mb-4">{t('investmentPortfolios')}</h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl">{t('accessCuratedMarkets')}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-8 sm:mb-10">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input 
              type="text" placeholder={t('filterByAsset')}
              className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm sm:text-base"
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
             <select 
                className="flex-1 sm:flex-none bg-white px-4 sm:px-6 py-3 sm:py-0 rounded-xl sm:rounded-2xl border border-slate-200 font-bold text-[8px] sm:text-[10px] uppercase tracking-widest outline-none shadow-sm focus:ring-2 focus:ring-emerald-500/20"
                value={filterSector}
                onChange={(e) => setFilterSector(e.target.value)}
             >
               <option value="All">{t('allSectors')}</option>
               {Object.values(InvestmentType).map(type => (
                 <option key={type} value={type}>{type}</option>
               ))}
             </select>
             <select 
                className="flex-1 sm:flex-none bg-white px-4 sm:px-6 py-3 sm:py-0 rounded-xl sm:rounded-2xl border border-slate-200 font-bold text-[8px] sm:text-[10px] uppercase tracking-widest outline-none shadow-sm focus:ring-2 focus:ring-emerald-500/20"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
             >
               <option value="Newest">Newest</option>
               <option value="ROI: High to Low">ROI: High to Low</option>
               <option value="ROI: Low to High">ROI: Low to High</option>
               <option value="Target Amount">Target Amount</option>
               <option value="Raised Amount">Raised Amount</option>
             </select>
             <div className="flex bg-white p-1 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm">
                <button onClick={() => setIsListView(false)} className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all ${!isListView ? 'bg-emerald-50 text-emerald-600 shadow-inner' : 'text-slate-400 hover:text-emerald-500'}`}><LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5" /></button>
                <button onClick={() => setIsListView(true)} className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all ${isListView ? 'bg-emerald-50 text-emerald-600 shadow-inner' : 'text-slate-400 hover:text-emerald-500'}`}><List className="w-4 h-4 sm:w-5 sm:h-5" /></button>
             </div>
          </div>
        </div>

        <div className={isListView ? "space-y-4 sm:space-y-6" : "grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10"}>
          {filteredOpportunities.map((opp) => {
            const isFull = opp.raisedAmount >= opp.targetAmount;
            return (
              <div 
                key={opp.id} 
                onClick={() => !isFull && onViewDetail?.(opp.id)}
                className={`group bg-white border rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden transition-all duration-500 relative ${
                  isFull 
                    ? 'border-slate-200 opacity-90 cursor-not-allowed' 
                    : 'border-slate-200 hover:shadow-2xl cursor-pointer'
                } ${isListView ? 'flex flex-col sm:flex-row sm:h-60' : ''}`}
              >
                {isFull && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/5 backdrop-blur-[1px]">
                    <div className="bg-slate-900 text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest shadow-2xl transform -rotate-12 border-4 border-white/20">
                      {t('fullRaiseFund')}
                    </div>
                  </div>
                )}
                {/* ADMIN CONTROLS */}
                {isAdmin && (
                  <div className="absolute top-4 left-4 z-20 flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => onEdit?.(opp)} className="p-2 bg-white/90 backdrop-blur rounded-xl text-blue-600 shadow-md hover:bg-white"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => { if(window.confirm('Delete asset?')) onDelete?.(opp.id); }} className="p-2 bg-white/90 backdrop-blur rounded-xl text-rose-600 shadow-md hover:bg-white"><Trash2 className="w-4 h-4" /></button>
                  </div>
                )}

                <div className="absolute top-4 right-4 z-20" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => setShowShareDialog(showShareDialog === opp.id ? null : opp.id)} className="p-2 bg-white/90 backdrop-blur rounded-xl text-slate-500 shadow-md hover:text-emerald-600 transition"><Share2 className="w-4 h-4" /></button>
                  {showShareDialog === opp.id && (
                     <div className="absolute top-10 right-0 bg-white shadow-2xl rounded-2xl p-3 border border-slate-100 min-w-[180px] z-30 animate-in zoom-in-95 space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">{t('shareOpportunity')}</p>
                        <button onClick={() => handleShare(opp, 'facebook')} className="w-full flex items-center gap-3 p-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                          <Facebook className="w-3.5 h-3.5 text-[#1877F2]" /> Facebook
                        </button>
                        <button onClick={() => handleShare(opp, 'instagram')} className="w-full flex items-center gap-3 p-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                          <Instagram className="w-3.5 h-3.5 text-[#E4405F]" /> Instagram
                        </button>
                        <button onClick={() => handleShare(opp, 'twitter')} className="w-full flex items-center gap-3 p-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                          <Twitter className="w-3.5 h-3.5 text-slate-900" /> X (Twitter)
                        </button>
                        <button onClick={() => handleShare(opp, 'linkedin')} className="w-full flex items-center gap-3 p-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                          <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" /> LinkedIn
                        </button>
                        <button onClick={() => handleShare(opp, 'whatsapp')} className="w-full flex items-center gap-3 p-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                          <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" /> WhatsApp
                        </button>
                        <div className="h-px bg-slate-100 my-1" />
                        <button onClick={() => handleShare(opp, 'copy')} className="w-full flex items-center gap-3 p-2 text-xs font-black text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                          <Copy className="w-3.5 h-3.5" /> Copy Link
                        </button>
                     </div>
                  )}
                </div>

                <div className={isListView ? "w-full sm:w-1/3 h-48 sm:h-full" : "h-48 sm:h-64 relative"}>
                  <img src={opp.imageUrl} className={`w-full h-full object-cover transition duration-700 ${isFull ? 'grayscale' : 'group-hover:scale-110'}`} alt="" />
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-emerald-600 uppercase tracking-widest">{opp.type}</span>
                  </div>
                </div>

                <div className={`p-6 sm:p-8 flex flex-col justify-between ${isListView ? 'w-full sm:w-2/3' : ''}`}>
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition">{opp.title}</h3>
                      <span className="text-emerald-600 font-black text-sm sm:text-base">{opp.expectedROI}</span>
                    </div>
                    <div className="flex items-center text-slate-400 text-[10px] sm:text-xs mb-4">
                      <MapPin className="w-3 h-3 mr-1" /> {opp.location}
                    </div>
                    {opp.publishedAt && (
                      <div className="flex items-center text-slate-400 text-[10px] sm:text-xs mb-4 -mt-2">
                        <Calendar className="w-3 h-3 mr-1" /> Published: {new Date(opp.publishedAt).toLocaleDateString()}
                      </div>
                    )}
                    
                    {/* Return Metrics Display */}
                    <div className="flex flex-wrap gap-3 mb-4 -mt-2">
                      {(opp.returnType === ReturnType.MONTHLY_RENT || opp.returnType === ReturnType.YEARLY_RENT) && (
                        <>
                          {opp.rentAmount !== undefined && (
                            <div className="flex items-center text-emerald-600 text-[10px] sm:text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                              <DollarSign className="w-3 h-3 mr-1" /> 
                              {formatCurrency(opp.rentAmount)} / {opp.returnType === ReturnType.MONTHLY_RENT ? 'mo' : 'yr'}
                            </div>
                          )}
                          {opp.rentPercentage !== undefined && (
                            <div className="flex items-center text-blue-600 text-[10px] sm:text-xs font-bold bg-blue-50 px-2 py-1 rounded-lg">
                              <TrendingUp className="w-3 h-3 mr-1" /> 
                              {opp.rentPercentage}% Yield
                            </div>
                          )}
                        </>
                      )}
                      
                      {opp.returnType === ReturnType.DIVIDEND && (
                        <>
                          {opp.dividendAmount !== undefined && (
                            <div className="flex items-center text-emerald-600 text-[10px] sm:text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                              <DollarSign className="w-3 h-3 mr-1" /> 
                              {formatCurrency(opp.dividendAmount)} Dividend
                            </div>
                          )}
                          {opp.dividendPercentage !== undefined && (
                            <div className="flex items-center text-blue-600 text-[10px] sm:text-xs font-bold bg-blue-50 px-2 py-1 rounded-lg">
                              <TrendingUp className="w-3 h-3 mr-1" /> 
                              {opp.dividendPercentage}% Yield
                            </div>
                          )}
                        </>
                      )}

                      {opp.returnType === ReturnType.ROI && (
                        <>
                          {opp.roiAmount !== undefined && (
                            <div className="flex items-center text-emerald-600 text-[10px] sm:text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                              <DollarSign className="w-3 h-3 mr-1" /> 
                              {formatCurrency(opp.roiAmount)} ROI
                            </div>
                          )}
                          {opp.roiPercentage !== undefined && (
                            <div className="flex items-center text-blue-600 text-[10px] sm:text-xs font-bold bg-blue-50 px-2 py-1 rounded-lg">
                              <TrendingUp className="w-3 h-3 mr-1" /> 
                              {opp.roiPercentage}% ROI
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">Partner: <span className="text-slate-900">{opp.partnerName || 'Institutional'}</span></p>
                  </div>

                  <div className="mt-4 sm:mt-6 space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span>{t('fundingTarget')}</span>
                        <span className="text-slate-900">{Math.min(100, Math.round((opp.raisedAmount / opp.targetAmount) * 100))}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${isFull ? 'bg-slate-400' : 'bg-emerald-500'}`} 
                          style={{ width: `${Math.min(100, (opp.raisedAmount / opp.targetAmount) * 100)}%` }} 
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2 sm:gap-3">
                      <button 
                        onClick={() => onViewDetail?.(opp.id)} 
                        className="flex-1 py-3 sm:py-4 bg-slate-100 text-slate-900 rounded-xl sm:rounded-2xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest hover:bg-slate-200 transition"
                      >
                        {t('details')}
                      </button>
                      <button 
                        disabled={isFull}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isFull) return;
                          
                          if (!isLoggedIn || currentUser?.kycStatus !== 'Verified') {
                            onInvest(opp, opp.minInvestment);
                            return;
                          }
                          
                          setQuickInvestOpp(opp);
                          setQuickInvestAmount(opp.minInvestment.toString());
                        }} 
                        className={`flex-[2] py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition shadow-lg flex items-center justify-center gap-2 ${
                          isFull 
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                            : !isLoggedIn 
                              ? 'bg-slate-800 text-white hover:bg-slate-700'
                              : currentUser?.kycStatus !== 'Verified'
                                ? 'bg-amber-600 text-white hover:bg-amber-700'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200'
                        }`}
                      >
                        {isFull ? t('soldOut') : !isLoggedIn ? t('loginToInvest') : currentUser?.kycStatus !== 'Verified' ? t('verifyKYC') : t('buyNow')} 
                        {!isFull && (!isLoggedIn || currentUser?.kycStatus !== 'Verified' ? <Lock className="w-3 h-3"/> : <ArrowUpRight className="w-3 h-3"/>)}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Invest Modal */}
      {quickInvestOpp && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-[150] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-2xl animate-in zoom-in-95">
            {allocationConfirmed ? (
              <div className="text-center py-4">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 serif mb-4">Allocation Confirmed</h2>
                <p className="text-slate-600 leading-relaxed mb-8">
                  Successfully allocated <span className="font-black text-slate-900">{formatCurrency(allocatedAmount)}</span> to the <span className="font-bold text-slate-900">{quickInvestOpp.title}</span> portfolio.
                </p>
                <button 
                  onClick={() => {
                    setQuickInvestOpp(null);
                    setAllocationConfirmed(false);
                    setQuickInvestAmount('');
                  }}
                  className="w-full py-4 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition shadow-xl"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold serif text-slate-900">{t('quickInvest')}</h2>
                  <button onClick={() => setQuickInvestOpp(null)} className="p-2 hover:bg-slate-100 rounded-full transition"><X /></button>
                </div>
                
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100">
                    <img src={quickInvestOpp.imageUrl} className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl object-cover" alt="" />
                    <div>
                      <p className="font-bold text-slate-900 text-sm sm:text-base">{quickInvestOpp.title}</p>
                      <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-emerald-600">{quickInvestOpp.expectedROI} {t('expectedReturn')}</p>
                    </div>
                  </div>

                  <form onSubmit={handleQuickInvestSubmit} className="space-y-4 sm:space-y-6">
                    <div className="space-y-2">
                      <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('investmentAmount')} ({selectedCurrency})</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">{selectedCurrency}</div>
                        <input 
                          type="number" 
                          required
                          min={quickInvestOpp.minInvestment}
                          className="w-full pl-16 sm:pl-16 pr-4 py-3 sm:py-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg outline-none focus:ring-2 focus:ring-emerald-500/20"
                          value={quickInvestAmount}
                          onChange={(e) => {
                            setQuickInvestAmount(e.target.value);
                            setError(null);
                          }}
                        />
                      </div>
                      {error && <p className="text-[10px] text-rose-500 font-bold mt-1 animate-pulse">{error}</p>}
                      <p className="text-[9px] sm:text-[10px] text-slate-500 italic">{t('minEntry')}: {formatCurrency(quickInvestOpp.minInvestment)}</p>
                    </div>

                    <div className="p-3 sm:p-4 bg-emerald-50 rounded-xl sm:rounded-2xl border border-emerald-100 flex items-start gap-2 sm:gap-3">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <p className="text-[10px] sm:text-[11px] text-emerald-800 leading-relaxed font-medium">{t('investmentProtected')}</p>
                    </div>

                    <button 
                      type="submit" 
                      className="w-full py-4 sm:py-5 bg-slate-900 text-white rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-emerald-600 transition shadow-xl flex items-center justify-center gap-2"
                    >
                      {t('confirmAllocation')} <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;
