
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import InvestmentCertificate from './InvestmentCertificate';
import WithdrawalCertificate from './WithdrawalCertificate';
import ReturnWithdrawalCertificate from './ReturnWithdrawalCertificate';
import ReturnsCertificate from './ReturnsCertificate';
import { Opportunity, InvestmentType, InvestmentRecord, InvestmentStatus, InvestmentGoal, PaymentRecord, ReturnRecord, Investor, DashboardTab, Notification, ReturnType, View, WithdrawalRecord, RiskLevel, Partner, WithdrawalStatus } from '../types';
import { canWithdrawFromInvestment, getWithdrawalStatusMessage, canWithdrawReturn, getReturnWithdrawalStatusMessage } from '../src/lib/withdrawalLogic';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { 
  Wallet, TrendingUp, PieChart, Activity, DollarSign, MapPin, Award,
  Info, Shield, CreditCard, ChevronRight, CheckCircle, X, ExternalLink,
  Target, Calendar, AlertTriangle, AlertCircle, Lightbulb, FileText, ArrowRight,
  History, Settings, User, LifeBuoy, Bell, Lock, Globe, Eye, EyeOff, 
  Download, Share2, Trash2, Plus, Minus, Landmark, Bitcoin, Zap, Smartphone, ArrowUpRight,
  RefreshCw, HelpCircle, Search, Filter, MoreVertical, LogOut,
  Users, Clock, Camera, Video, Play, Facebook, Instagram, Twitter, Linkedin, MessageCircle, Copy,
  BarChart3, Bookmark
} from 'lucide-react';
import { getInvestmentInsights } from '../services/geminiService';

interface UserDashboardProps {
  opportunities: Opportunity[];
  userInvestments: InvestmentRecord[];
  paymentHistory: PaymentRecord[];
  returns: ReturnRecord[];
  withdrawals: WithdrawalRecord[];
  onWithdraw: (withdrawal: WithdrawalRecord) => void;
  onInvest: (opp: Opportunity, amount: number) => void;
  investmentGoal: InvestmentGoal;
  onUpdateGoal: (goal: InvestmentGoal) => void;
  currentUser: Investor | null;
  onUpdateProfile: (profile: Partial<Investor>) => void;
  onUploadKYC: (investorId: string, documents: string[]) => void;
  onLogout: () => void;
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  onMarkNotificationRead: (id: string) => void;
  onNavigate: (view: View, id?: string) => void;
  partners: Partner[];
  formatCurrency: (amount: number) => string;
  t: (key: string) => string;
  language: string;
  onLanguageChange: (lang: string) => void;
  selectedCurrency: string;
  onCurrencyChange: (curr: string) => void;
  config: any;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ 
  opportunities, 
  userInvestments, 
  paymentHistory,
  returns,
  withdrawals,
  onWithdraw,
  onInvest,
  investmentGoal,
  onUpdateGoal,
  currentUser,
  onUpdateProfile,
  onUploadKYC,
  onLogout,
  activeTab,
  onTabChange,
  onMarkNotificationRead,
  onNavigate,
  partners,
  formatCurrency,
  t,
  language,
  onLanguageChange,
  selectedCurrency,
  onCurrencyChange,
  config
}) => {
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [quickInvestOpp, setQuickInvestOpp] = useState<Opportunity | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [investAmount, setInvestAmount] = useState<number>(0);
  const [filterType, setFilterType] = useState<string>('All');
  const [payoutFilter, setPayoutFilter] = useState<string>('All');
  const [returnTypeFilter, setReturnTypeFilter] = useState<string>('All');
  const [assetClassFilter, setAssetClassFilter] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [certificateToDownload, setCertificateToDownload] = useState<{
    investment: InvestmentRecord;
    investor: Investor;
    opportunity: Opportunity;
    partner?: Partner;
    issueDate: string;
    logo?: string;
    ownerSignature?: string;
  } | null>(null);
  const [withdrawalCertificateToDownload, setWithdrawalCertificateToDownload] = useState<{
    withdrawal: WithdrawalRecord;
    investor: Investor;
    opportunity?: Opportunity;
    partner?: Partner;
    issueDate: string;
    logo?: string;
    ownerSignature?: string;
  } | null>(null);
  const [returnsCertificateToDownload, setReturnsCertificateToDownload] = useState<{
    returnRecord: ReturnRecord;
    investor: Investor;
    opportunity?: Opportunity;
    partner?: Partner;
    issueDate: string;
    logo?: string;
    ownerSignature?: string;
    investmentAmount?: number;
  } | null>(null);
  const [returnWithdrawalCertificateToDownload, setReturnWithdrawalCertificateToDownload] = useState<{
    withdrawal: WithdrawalRecord;
    investor: Investor;
    opportunity?: Opportunity;
    partner?: Partner;
    issueDate: string;
    logo?: string;
    ownerSignature?: string;
  } | null>(null);
  const [showShareMenu, setShowShareMenu] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState<{show: boolean, opp: string, amount: number} | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<Investor>>({});
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [linkingGateway, setLinkingGateway] = useState<'card' | 'upi' | 'netbanking' | 'razorpay' | 'paypal' | null>(null);
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '', name: '' });
  const [upiId, setUpiId] = useState('');
  const [bankDetails, setBankDetails] = useState({ account: '', ifsc: '', bankName: '' });
  const [razorpayId, setRazorpayId] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({});
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showWithdrawSuccess, setShowWithdrawSuccess] = useState(false);
  const [withdrawAssetId, setWithdrawAssetId] = useState<string>('');
  const [withdrawAmountInput, setWithdrawAmountInput] = useState<string>('');
  const [lastWithdrawal, setLastWithdrawal] = useState<WithdrawalRecord | null>(null);
  const [kycFiles, setKycFiles] = useState<{ identity: File | null, address: File | null, selfie: File | null }>({
    identity: null,
    address: null,
    selfie: null
  });
  const [kycPreviews, setKycPreviews] = useState<{ identity: string | null, address: string | null, selfie: string | null }>({
    identity: null,
    address: null,
    selfie: null
  });

  // Investment History States
  const [historySubTab, setHistorySubTab] = useState<'assets' | 'returns' | 'withdraw' | 'rent' | 'roi' | 'dividend'>('assets');

  const [historySearch, setHistorySearch] = useState('');
  const [historyAssetFilter, setHistoryAssetFilter] = useState('All');
  const [historyPartnerFilter, setHistoryPartnerFilter] = useState('All');
  const [historyLocationFilter, setHistoryLocationFilter] = useState('All');
  const [historyAssetTypeFilter, setHistoryAssetTypeFilter] = useState('All');
  const [historyAssetClassFilter, setHistoryAssetClassFilter] = useState('All');
  const [historyPayoutFilter, setHistoryPayoutFilter] = useState('All');
  const [historyReturnType, setHistoryReturnType] = useState('All');
  const [historyStartDate, setHistoryStartDate] = useState('');
  const [historyEndDate, setHistoryEndDate] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportDateRange, setExportDateRange] = useState({ start: '', end: '' });

  // Analysis States
  const [analysisSearch, setAnalysisSearch] = useState('');
  const [analysisAssetFilter, setAnalysisAssetFilter] = useState('All');
  const [analysisPartnerFilter, setAnalysisPartnerFilter] = useState('All');
  const [analysisLocationFilter, setAnalysisLocationFilter] = useState('All');
  const [analysisPayoutFilter, setAnalysisPayoutFilter] = useState('All');
  const [analysisReturnTypeFilter, setAnalysisReturnTypeFilter] = useState('All');
  const [analysisAssetClassFilter, setAnalysisAssetClassFilter] = useState('All');
  const [analysisTypeFilter, setAnalysisTypeFilter] = useState('All');
  const [analysisStartDate, setAnalysisStartDate] = useState('');
  const [analysisEndDate, setAnalysisEndDate] = useState('');
  const [analysisMonth, setAnalysisMonth] = useState<string>('All');
  const [analysisYear, setAnalysisYear] = useState<string>('All');
  const [showAnalysisExportModal, setShowAnalysisExportModal] = useState(false);
  const [showSystemDataExportModal, setShowSystemDataExportModal] = useState(false);
  const [systemExportPeriod, setSystemExportPeriod] = useState('Last 30 days');
  const [systemExportDataType, setSystemExportDataType] = useState('Detailed Asset Performance');
  const [systemExportDateRange, setSystemExportDateRange] = useState({ start: '', end: '' });
  const [showAnalysisFilters, setShowAnalysisFilters] = useState(false);
  const [showAnalysisTableFilters, setShowAnalysisTableFilters] = useState(false);
  const [showMarketFilters, setShowMarketFilters] = useState(false);
  const [showHistoryFilters, setShowHistoryFilters] = useState(false);
  const [showHistoryActionMenu, setShowHistoryActionMenu] = useState<string | null>(null);
  const [waitlistIds, setWaitlistIds] = useState<string[]>([]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showHistoryActionMenu && !(event.target as Element).closest('.relative')) {
        setShowHistoryActionMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showHistoryActionMenu]);

  useEffect(() => {
    if (certificateToDownload) {
      const generatePDF = async () => {
        const element = document.getElementById(`certificate-${certificateToDownload.investment.id}`);
        if (element) {
          try {
            const canvas = await html2canvas(element, {
              scale: 2,
              useCORS: true,
              logging: false
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Investment_Certificate_${certificateToDownload.investment.id}.pdf`);
          } catch (error) {
            console.error('Error generating certificate PDF:', error);
          } finally {
            setCertificateToDownload(null);
          }
        }
      };
      // Small delay to ensure the element is rendered
      setTimeout(generatePDF, 500);
    }
  }, [certificateToDownload]);

  useEffect(() => {
    if (withdrawalCertificateToDownload) {
      const generatePDF = async () => {
        const element = document.getElementById(`withdrawal-certificate-${withdrawalCertificateToDownload.withdrawal.id}`);
        if (element) {
          try {
            const canvas = await html2canvas(element, {
              scale: 2,
              useCORS: true,
              logging: false
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Withdrawal_Certificate_${withdrawalCertificateToDownload.withdrawal.id}.pdf`);
          } catch (error) {
            console.error('Error generating withdrawal certificate PDF:', error);
          } finally {
            setWithdrawalCertificateToDownload(null);
          }
        }
      };
      // Small delay to ensure the element is rendered
      setTimeout(generatePDF, 500);
    }
  }, [withdrawalCertificateToDownload]);

  useEffect(() => {
    if (returnsCertificateToDownload) {
      const generatePDF = async () => {
        const element = document.getElementById(`returns-certificate-${returnsCertificateToDownload.returnRecord.id}`);
        if (element) {
          try {
            const canvas = await html2canvas(element, {
              scale: 3,
              useCORS: true,
              logging: false,
              backgroundColor: '#FAF6EE',
              allowTaint: true,
              width: 820,
              height: element.offsetHeight || 1100,
              onclone: (clonedDoc) => {
                // 1. Remove watermark entirely from the clone
                const watermark = clonedDoc.querySelector('[data-watermark="true"]');
                if (watermark) watermark.remove();
                
                // 2. Replace ALL gradients with solid colors to avoid 'createPattern' errors
                const all = clonedDoc.querySelectorAll('*');
                all.forEach(el => {
                  if (el instanceof HTMLElement) {
                    const bg = el.style.background || '';
                    const bgImg = el.style.backgroundImage || '';
                    if (bg.includes('gradient') || bgImg.includes('gradient')) {
                      // Determine a safe solid color replacement
                      if (bg.includes('#1A1610') || bg.includes('#2C2416')) {
                        el.style.background = '#1A1610';
                      } else if (bg.includes('#2A3A1A') || bg.includes('#1E2C12')) {
                        el.style.background = '#2A3A1A';
                      } else if (bg.includes('#3A7A1A') || bg.includes('#72C437')) {
                        el.style.background = '#3A7A1A';
                      } else if (bg.includes('#C9A84C') || bg.includes('#E8C97A')) {
                        el.style.background = '#C9A84C';
                      } else {
                        el.style.background = '#D4B96A';
                      }
                      el.style.backgroundImage = 'none';
                    }
                  }
                });

                // 3. Clean up the main certificate element
                const clonedElement = clonedDoc.getElementById(`returns-certificate-${returnsCertificateToDownload.returnRecord.id}`);
                if (clonedElement) {
                  clonedElement.style.boxShadow = 'none';
                  clonedElement.style.transform = 'none';
                  clonedElement.style.margin = '0';
                }
              }
            });
            
            const imgData = canvas.toDataURL('image/png', 1.0);
            const pdf = new jsPDF({
              orientation: 'portrait',
              unit: 'px',
              format: [820, canvas.height / 3]
            });
            
            pdf.addImage(imgData, 'PNG', 0, 0, 820, canvas.height / 3);
            pdf.save(`Grow_Milkat_Returns_Certificate_${returnsCertificateToDownload.returnRecord.id}.pdf`);
          } catch (error) {
            console.error('Error generating returns certificate PDF:', error);
          } finally {
            setReturnsCertificateToDownload(null);
          }
        }
      };
      // Small delay to ensure the element is rendered
      setTimeout(generatePDF, 800);
    }
  }, [returnsCertificateToDownload]);

  // Notification States
  const [notificationSearch, setNotificationSearch] = useState('');
  const [notificationTypeFilter, setNotificationTypeFilter] = useState('All');
  const [notificationPage, setNotificationPage] = useState(1);
  const notificationsPerPage = 10;

  // Dashboard Filters
  const [dashboardStartDate, setDashboardStartDate] = useState<string>('');
  const [dashboardEndDate, setDashboardEndDate] = useState<string>('');
  const [dashboardMonth, setDashboardMonth] = useState<string>('All');
  const [dashboardYear, setDashboardYear] = useState<string>('All');
  const [dashboardAsset, setDashboardAsset] = useState<string>('All');

  const filteredNotifications = useMemo(() => {
    if (!currentUser?.notifications) return [];
    return currentUser.notifications.filter(n => {
      const matchesSearch = n.title.toLowerCase().includes(notificationSearch.toLowerCase()) || 
                           n.message.toLowerCase().includes(notificationSearch.toLowerCase());
      const matchesType = notificationTypeFilter === 'All' || n.type === notificationTypeFilter;
      return matchesSearch && matchesType;
    });
  }, [currentUser?.notifications, notificationSearch, notificationTypeFilter]);

  const paginatedNotifications = useMemo(() => {
    const startIndex = (notificationPage - 1) * notificationsPerPage;
    return filteredNotifications.slice(startIndex, startIndex + notificationsPerPage);
  }, [filteredNotifications, notificationPage]);

  const totalNotificationPages = Math.ceil(filteredNotifications.length / notificationsPerPage);

  useEffect(() => {
    setNotificationPage(1);
  }, [notificationSearch, notificationTypeFilter]);

  const prevTotalCount = useRef(currentUser?.notifications?.length || 0);

  useEffect(() => {
    const currentCount = currentUser?.notifications?.length || 0;
    
    if (currentCount > prevTotalCount.current) {
      // Chord type sound (Mixkit Digital Chime/Chord)
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
      audio.play().catch(e => console.log('Audio play blocked:', e));
    }
    prevTotalCount.current = currentCount;
  }, [currentUser?.notifications?.length]);

  const userReturns = useMemo(() => {
    return returns.filter(r => r.investorId === currentUser?.id);
  }, [returns, currentUser]);

  const [selectedChartType, setSelectedChartType] = useState<'ROI' | 'Investment' | 'RentMonth' | 'RentYear' | 'Dividend'>('ROI');

  const chartData = useMemo(() => {
    switch (selectedChartType) {
      case 'ROI':
        return opportunities
          .map(o => ({ name: o.title, value: parseFloat(o.expectedROI) || 0 }))
          .sort((a: any, b: any) => b.value - a.value)
          .slice(0, 5);
      case 'Investment':
        return userInvestments
          .map(inv => ({ name: inv.opportunityTitle, value: inv.amount }))
          .sort((a: any, b: any) => b.value - a.value)
          .slice(0, 5);
      case 'RentMonth': {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const monthlyReturns = userReturns.filter(r => {
          const d = new Date(r.date);
          return (r.type === 'Monthly Rent' || r.type === 'Yearly Rent') && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });
        const grouped = monthlyReturns.reduce((acc, curr) => {
          acc[curr.investmentTitle] = (acc[curr.investmentTitle] || 0) + curr.amount;
          return acc;
        }, {} as Record<string, number>);
        return Object.entries(grouped)
          .map(([name, value]) => ({ name, value }))
          .sort((a: any, b: any) => b.value - a.value);
      }
      case 'RentYear': {
        const currentYear = new Date().getFullYear();
        const yearlyReturns = userReturns.filter(r => {
          const d = new Date(r.date);
          return (r.type === 'Monthly Rent' || r.type === 'Yearly Rent') && d.getFullYear() === currentYear;
        });
        const grouped = yearlyReturns.reduce((acc, curr) => {
          acc[curr.investmentTitle] = (acc[curr.investmentTitle] || 0) + curr.amount;
          return acc;
        }, {} as Record<string, number>);
        return Object.entries(grouped)
          .map(([name, value]) => ({ name, value }))
          .sort((a: any, b: any) => b.value - a.value);
      }
      case 'Dividend': {
        const dividends = userReturns.filter(r => r.type === 'Dividend');
        const grouped = dividends.reduce((acc, curr) => {
          acc[curr.investmentTitle] = (acc[curr.investmentTitle] || 0) + curr.amount;
          return acc;
        }, {} as Record<string, number>);
        return Object.entries(grouped)
          .map(([name, value]) => ({ name, value }))
          .sort((a: any, b: any) => b.value - a.value);
      }
      default:
        return [];
    }
  }, [selectedChartType, opportunities, userInvestments, userReturns]);

  const availableYears = useMemo(() => {
    const years = new Set<number>();
    userInvestments.forEach(inv => years.add(new Date(inv.date).getFullYear()));
    userReturns.forEach(ret => years.add(new Date(ret.date).getFullYear()));
    if (years.size === 0) years.add(new Date().getFullYear());
    return Array.from(years).sort((a, b) => b - a);
  }, [userInvestments, userReturns]);

  const filteredDashboardInvestments = useMemo(() => {
    return userInvestments.filter(inv => {
      const invDate = new Date(inv.date);
      const matchesStartDate = !dashboardStartDate || invDate >= new Date(dashboardStartDate);
      const matchesEndDate = !dashboardEndDate || invDate <= new Date(dashboardEndDate);
      const matchesMonth = dashboardMonth === 'All' || invDate.getMonth() === parseInt(dashboardMonth);
      const matchesYear = dashboardYear === 'All' || invDate.getFullYear() === parseInt(dashboardYear);
      const matchesAsset = dashboardAsset === 'All' || inv.opportunityTitle === dashboardAsset;
      return matchesStartDate && matchesEndDate && matchesMonth && matchesYear && matchesAsset;
    });
  }, [userInvestments, dashboardStartDate, dashboardEndDate, dashboardMonth, dashboardYear, dashboardAsset]);

  const filteredDashboardReturns = useMemo(() => {
    return userReturns.filter(ret => {
      const retDate = new Date(ret.date);
      const matchesStartDate = !dashboardStartDate || retDate >= new Date(dashboardStartDate);
      const matchesEndDate = !dashboardEndDate || retDate <= new Date(dashboardEndDate);
      const matchesMonth = dashboardMonth === 'All' || retDate.getMonth() === parseInt(dashboardMonth);
      const matchesYear = dashboardYear === 'All' || retDate.getFullYear() === parseInt(dashboardYear);
      const matchesAsset = dashboardAsset === 'All' || ret.investmentTitle === dashboardAsset;
      return matchesStartDate && matchesEndDate && matchesMonth && matchesYear && matchesAsset;
    });
  }, [userReturns, dashboardStartDate, dashboardEndDate, dashboardMonth, dashboardYear, dashboardAsset]);

  const filteredAnalysisInvestments = useMemo(() => {
    return userInvestments.filter(inv => {
      const opp = opportunities.find(o => o.id === inv.opportunityId);
      const invDate = new Date(inv.date);
      const matchesStartDate = !analysisStartDate || invDate >= new Date(analysisStartDate);
      const matchesEndDate = !analysisEndDate || invDate <= new Date(analysisEndDate);
      const matchesMonth = analysisMonth === 'All' || invDate.getMonth() === parseInt(analysisMonth);
      const matchesYear = analysisYear === 'All' || invDate.getFullYear() === parseInt(analysisYear);
      const matchesAsset = analysisAssetFilter === 'All' || inv.opportunityTitle === analysisAssetFilter;
      const matchesPartner = analysisPartnerFilter === 'All' || (opp?.partnerName === analysisPartnerFilter);
      const matchesLocation = analysisLocationFilter === 'All' || (opp?.location === analysisLocationFilter);
      const matchesPayout = analysisPayoutFilter === 'All' || (opp?.payoutFrequency === analysisPayoutFilter);
      const matchesReturnType = analysisReturnTypeFilter === 'All' || (opp?.returnType === analysisReturnTypeFilter);
      const matchesAssetClass = analysisAssetClassFilter === 'All' || (opp?.assetClass === analysisAssetClassFilter);
      const matchesType = analysisTypeFilter === 'All' || (opp?.type === analysisTypeFilter);
      
      return matchesStartDate && matchesEndDate && matchesMonth && matchesYear && matchesAsset && 
             matchesPartner && matchesLocation && matchesPayout && matchesReturnType && 
             matchesAssetClass && matchesType;
    });
  }, [userInvestments, opportunities, analysisStartDate, analysisEndDate, analysisMonth, analysisYear, analysisAssetFilter, analysisPartnerFilter, analysisLocationFilter, analysisPayoutFilter, analysisReturnTypeFilter, analysisAssetClassFilter, analysisTypeFilter]);

  const filteredAnalysisReturns = useMemo(() => {
    return userReturns.filter(ret => {
      const inv = userInvestments.find(i => i.id === ret.investmentId);
      const opp = opportunities.find(o => o.id === inv?.opportunityId);
      const retDate = new Date(ret.date);
      const matchesStartDate = !analysisStartDate || retDate >= new Date(analysisStartDate);
      const matchesEndDate = !analysisEndDate || retDate <= new Date(analysisEndDate);
      const matchesMonth = analysisMonth === 'All' || retDate.getMonth() === parseInt(analysisMonth);
      const matchesYear = analysisYear === 'All' || retDate.getFullYear() === parseInt(analysisYear);
      const matchesAsset = analysisAssetFilter === 'All' || ret.investmentTitle === analysisAssetFilter;
      const matchesPartner = analysisPartnerFilter === 'All' || (opp?.partnerName === analysisPartnerFilter);
      const matchesLocation = analysisLocationFilter === 'All' || (opp?.location === analysisLocationFilter);
      const matchesPayout = analysisPayoutFilter === 'All' || (opp?.payoutFrequency === analysisPayoutFilter);
      const matchesReturnType = analysisReturnTypeFilter === 'All' || (opp?.returnType === analysisReturnTypeFilter);
      const matchesAssetClass = analysisAssetClassFilter === 'All' || (opp?.assetClass === analysisAssetClassFilter);
      const matchesType = analysisTypeFilter === 'All' || (opp?.type === analysisTypeFilter);

      return matchesStartDate && matchesEndDate && matchesMonth && matchesYear && matchesAsset &&
             matchesPartner && matchesLocation && matchesPayout && matchesReturnType && 
             matchesAssetClass && matchesType;
    });
  }, [userReturns, userInvestments, opportunities, analysisStartDate, analysisEndDate, analysisMonth, analysisYear, analysisAssetFilter, analysisPartnerFilter, analysisLocationFilter, analysisPayoutFilter, analysisReturnTypeFilter, analysisAssetClassFilter, analysisTypeFilter]);

  const analysisMetrics = useMemo(() => {
    const totalInvestment = filteredAnalysisInvestments.reduce((acc, inv) => acc + inv.amount, 0);
    const totalReturns = filteredAnalysisReturns.reduce((acc, ret) => acc + ret.amount, 0);
    
    const now = new Date();
    const currentMonth = analysisMonth !== 'All' ? parseInt(analysisMonth) : now.getMonth();
    const currentYear = analysisYear !== 'All' ? parseInt(analysisYear) : now.getFullYear();

    const applyCommonFilters = (ret: ReturnRecord) => {
      const inv = userInvestments.find(i => i.id === ret.investmentId);
      const opp = opportunities.find(o => o.id === inv?.opportunityId);
      const matchesAsset = analysisAssetFilter === 'All' || ret.investmentTitle === analysisAssetFilter;
      const matchesPartner = analysisPartnerFilter === 'All' || (opp?.partnerName === analysisPartnerFilter);
      const matchesLocation = analysisLocationFilter === 'All' || (opp?.location === analysisLocationFilter);
      const matchesPayout = analysisPayoutFilter === 'All' || (opp?.payoutFrequency === analysisPayoutFilter);
      const matchesReturnType = analysisReturnTypeFilter === 'All' || (opp?.returnType === analysisReturnTypeFilter);
      const matchesAssetClass = analysisAssetClassFilter === 'All' || (opp?.assetClass === analysisAssetClassFilter);
      const matchesType = analysisTypeFilter === 'All' || (opp?.type === analysisTypeFilter);
      return matchesAsset && matchesPartner && matchesLocation && matchesPayout && matchesReturnType && matchesAssetClass && matchesType;
    };

    const thisMonthReturns = userReturns.filter(ret => {
      const d = new Date(ret.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear && applyCommonFilters(ret);
    }).reduce((acc, ret) => acc + ret.amount, 0);

    const thisYearReturns = userReturns.filter(ret => {
      const d = new Date(ret.date);
      return d.getFullYear() === currentYear && applyCommonFilters(ret);
    }).reduce((acc, ret) => acc + ret.amount, 0);

    const rentMonthReturns = userReturns.filter(ret => {
      const d = new Date(ret.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear && ret.type === 'Monthly Rent' && applyCommonFilters(ret);
    }).reduce((acc, ret) => acc + ret.amount, 0);

    const rentYearReturns = userReturns.filter(ret => {
      const d = new Date(ret.date);
      return d.getFullYear() === currentYear && ret.type === 'Yearly Rent' && applyCommonFilters(ret);
    }).reduce((acc, ret) => acc + ret.amount, 0);

    const dividendYearly = userReturns.filter(ret => {
      const d = new Date(ret.date);
      return d.getFullYear() === currentYear && ret.type === 'Dividend' && applyCommonFilters(ret);
    }).reduce((acc, ret) => acc + ret.amount, 0);

    const dividendMonthly = userReturns.filter(ret => {
      const d = new Date(ret.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear && ret.type === 'Dividend' && applyCommonFilters(ret);
    }).reduce((acc, ret) => acc + ret.amount, 0);

    const rentGain = filteredAnalysisReturns.filter(ret => {
      return (ret.type === 'Monthly Rent' || ret.type === 'Yearly Rent');
    }).reduce((acc, ret) => acc + ret.amount, 0);

    const dividendGain = filteredAnalysisReturns.filter(ret => {
      return ret.type === 'Dividend';
    }).reduce((acc, ret) => acc + ret.amount, 0);

    const roiGain = filteredAnalysisReturns.filter(ret => {
      return ret.type === 'ROI';
    }).reduce((acc, ret) => acc + ret.amount, 0);

    return {
      totalInvestment,
      totalInvestmentsCount: filteredAnalysisInvestments.length,
      overallGain: totalReturns,
      thisMonthReturns,
      thisYearReturns,
      rentMonthReturns,
      rentYearReturns,
      dividendYearly,
      dividendMonthly,
      rentGain,
      dividendGain,
      roiGain
    };
  }, [filteredAnalysisInvestments, filteredAnalysisReturns, userReturns, opportunities, analysisMonth, analysisYear, analysisAssetFilter, analysisPartnerFilter, analysisLocationFilter, analysisPayoutFilter, analysisReturnTypeFilter, analysisAssetClassFilter, analysisTypeFilter]);

  const monthlyRentalDistributions = useMemo(() => {
    const now = new Date();
    const currentMonth = analysisMonth !== 'All' ? parseInt(analysisMonth) : now.getMonth();
    const currentYear = analysisYear !== 'All' ? parseInt(analysisYear) : now.getFullYear();

    return userReturns.filter(ret => {
      const d = new Date(ret.date);
      const matchesMonth = analysisMonth === 'All' || d.getMonth() === currentMonth;
      const matchesYear = analysisYear === 'All' || d.getFullYear() === currentYear;
      const isMonthlyReturn = ret.type === 'Monthly Rent';
      
      const inv = userInvestments.find(i => i.id === ret.investmentId);
      const opp = opportunities.find(o => o.id === inv?.opportunityId);
      const isMonthlyAsset = opp?.returnType === ReturnType.MONTHLY_RENT;

      return isMonthlyReturn && isMonthlyAsset && matchesMonth && matchesYear;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [userReturns, userInvestments, opportunities, analysisMonth, analysisYear]);

  const goalInsights = useMemo(() => {
    const totalInvested = userInvestments.reduce((acc, inv) => acc + inv.amount, 0);
    const needed = Math.max(0, investmentGoal.targetValue - totalInvested);
    
    // Suggest opportunities with high ROI that are still open
    const suggestions = opportunities
      .filter(o => o.raisedAmount < o.targetAmount)
      .sort((a, b) => (parseFloat(b.expectedROI) || 0) - (parseFloat(a.expectedROI) || 0))
      .slice(0, 6);

    return {
      totalInvested,
      totalInvestmentsCount: userInvestments.length,
      needed,
      suggestions
    };
  }, [userInvestments, investmentGoal.targetValue, opportunities]);

  const dashboardMetrics = useMemo(() => {
    const totalInvestment = filteredDashboardInvestments.reduce((acc, inv) => acc + inv.amount, 0);
    const totalReturns = filteredDashboardReturns.reduce((acc, ret) => acc + ret.amount, 0);
    
    const now = new Date();
    const currentMonth = dashboardMonth !== 'All' ? parseInt(dashboardMonth) : now.getMonth();
    const currentYear = dashboardYear !== 'All' ? parseInt(dashboardYear) : now.getFullYear();

    const thisMonthReturns = userReturns.filter(ret => {
      const d = new Date(ret.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear && (dashboardAsset === 'All' || ret.investmentTitle === dashboardAsset);
    }).reduce((acc, ret) => acc + ret.amount, 0);

    const thisYearReturns = userReturns.filter(ret => {
      const d = new Date(ret.date);
      return d.getFullYear() === currentYear && (dashboardAsset === 'All' || ret.investmentTitle === dashboardAsset);
    }).reduce((acc, ret) => acc + ret.amount, 0);

    const rentMonthReturns = userReturns.filter(ret => {
      const d = new Date(ret.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear && ret.type === 'Monthly Rent' && (dashboardAsset === 'All' || ret.investmentTitle === dashboardAsset);
    }).reduce((acc, ret) => acc + ret.amount, 0);

    const rentYearReturns = userReturns.filter(ret => {
      const d = new Date(ret.date);
      return d.getFullYear() === currentYear && ret.type === 'Yearly Rent' && (dashboardAsset === 'All' || ret.investmentTitle === dashboardAsset);
    }).reduce((acc, ret) => acc + ret.amount, 0);

    const totalRentYearReturns = userReturns.filter(ret => {
      const d = new Date(ret.date);
      return d.getFullYear() === currentYear && (ret.type === 'Monthly Rent' || ret.type === 'Yearly Rent') && (dashboardAsset === 'All' || ret.investmentTitle === dashboardAsset);
    }).reduce((acc, ret) => acc + ret.amount, 0);

    return {
      totalInvestment,
      overallGain: totalReturns,
      thisMonthReturns,
      thisYearReturns,
      rentMonthReturns,
      rentYearReturns,
      totalRentYearReturns
    };
  }, [filteredDashboardInvestments, filteredDashboardReturns, userReturns, dashboardMonth, dashboardYear, dashboardAsset]);

  const validateCard = () => {
    const errors: Record<string, string> = {};
    if (!/^\d{16}$/.test(cardDetails.number.replace(/\s/g, ''))) errors.number = 'Invalid card number';
    if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) errors.expiry = 'Use MM/YY';
    if (!/^\d{3}$/.test(cardDetails.cvc)) errors.cvc = 'Invalid CVC';
    if (cardDetails.name.length < 3) errors.name = 'Name too short';
    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateUpi = () => {
    const errors: Record<string, string> = {};
    if (!/^[\w.-]+@[\w.-]+$/.test(upiId)) errors.upi = 'Invalid UPI ID format';
    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateBank = () => {
    const errors: Record<string, string> = {};
    if (!/^\d{9,18}$/.test(bankDetails.account)) errors.account = 'Invalid account number';
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankDetails.ifsc)) errors.ifsc = 'Invalid IFSC code';
    if (bankDetails.bankName.length < 3) errors.bankName = 'Bank name too short';
    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRazorpay = () => {
    const errors: Record<string, string> = {};
    if (!razorpayId) errors.razorpay = 'Razorpay ID is required';
    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePaypal = () => {
    const errors: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paypalEmail)) errors.paypal = 'Invalid PayPal email';
    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLinkGateway = () => {
    let isValid = false;
    if (linkingGateway === 'card') isValid = validateCard();
    if (linkingGateway === 'upi') isValid = validateUpi();
    if (linkingGateway === 'netbanking') isValid = validateBank();
    if (linkingGateway === 'razorpay') isValid = validateRazorpay();
    if (linkingGateway === 'paypal') isValid = validatePaypal();

    if (isValid) {
      alert(`${linkingGateway?.toUpperCase()} linked successfully!`);
      setLinkingGateway(null);
      setPaymentErrors({});
    }
  };

  const handleWithdraw = () => {
    if (!withdrawCalculation || !selectedWithdrawInvestment || !currentUser) return;
    
    const opp = opportunities.find(o => o.id === selectedWithdrawInvestment.opportunityId);
    
    const newWithdrawal: WithdrawalRecord = {
      id: `WTH-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      investorId: currentUser.id,
      investmentId: selectedWithdrawInvestment.id,
      opportunityTitle: selectedWithdrawInvestment.opportunityTitle,
      partnerName: opp?.partnerName || 'N/A',
      location: opp?.location || 'N/A',
      type: selectedWithdrawInvestment.type,
      assetClass: opp?.assetClass || 'N/A',
      returnType: opp?.returnType || 'N/A',
      holdingPeriod: opp?.holdingPeriod || 'N/A',
      payoutFrequency: opp?.payoutFrequency || 'N/A',
      expectedROI: opp?.expectedROI || '0%',
      expectedIRR: opp?.expectedIRR || '0%',
      investmentAmount: withdrawCalculation.investmentAmount,
      totalGains: withdrawCalculation.totalGains,
      withdrawnGains: withdrawCalculation.withdrawnGains,
      gainAmount: withdrawCalculation.gainAmount,
      totalValue: withdrawCalculation.totalValue,
      withdrawalAmount: withdrawCalculation.finalWithdrawAmount,
      fineAmount: withdrawCalculation.fineAmount,
      date: new Date().toISOString().split('T')[0],
      status: WithdrawalStatus.PENDING,
      isReturnsWithdrawal: false
    };

    onWithdraw(newWithdrawal);
    setLastWithdrawal(newWithdrawal);
    setShowWithdrawModal(false);
    setShowWithdrawSuccess(true);
    setWithdrawAssetId('');
    setWithdrawAmountInput('');
  };

  const handleWithdrawReturns = (ret: ReturnRecord) => {
    if (!currentUser) return;
    
    const inv = userInvestments.find(i => i.id === ret.investmentId);
    const opp = opportunities.find(o => o.id === inv?.opportunityId);
    
    const newWithdrawal: WithdrawalRecord = {
      id: `WTH-RET-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      investorId: currentUser.id,
      investmentId: ret.investmentId,
      returnId: ret.id,
      opportunityTitle: ret.investmentTitle,
      partnerName: opp?.partnerName || 'N/A',
      location: opp?.location || 'N/A',
      type: inv?.type || InvestmentType.COMMERCIAL_PROPERTY,
      assetClass: opp?.assetClass || 'N/A',
      returnType: ret.type,
      holdingPeriod: opp?.holdingPeriod || 'N/A',
      payoutFrequency: opp?.payoutFrequency || 'N/A',
      expectedROI: opp?.expectedROI || '0%',
      expectedIRR: opp?.expectedIRR || '0%',
      investmentAmount: inv?.amount || 0,
      gainAmount: ret.amount,
      totalValue: (inv?.amount || 0) + ret.amount,
      withdrawalAmount: ret.amount,
      fineAmount: 0,
      date: new Date().toISOString().split('T')[0],
      status: WithdrawalStatus.PENDING,
      isReturnsWithdrawal: true
    };

    onWithdraw(newWithdrawal);
    setLastWithdrawal(newWithdrawal);
    setShowWithdrawSuccess(true);
  };

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setShowTour(true);
    }
  }, []);

  const closeTour = () => {
    setShowTour(false);
    localStorage.setItem('hasSeenTour', 'true');
  };

  const nextTourStep = () => {
    if (tourStep < 4) {
      setTourStep(tourStep + 1);
    } else {
      closeTour();
    }
  };

  const tourSteps = [
    {
      title: "Welcome to Grow Milkat!",
      content: "Your journey to institutional-grade investing starts here. Let's take a quick 5-step tour of your new command center.",
      icon: <CheckCircle className="w-8 h-8 text-emerald-600" />,
      target: "dashboard"
    },
    {
      title: "Real-time Analytics",
      content: "Monitor your portfolio value, monthly revenue, and expected returns in real-time. Your capital is always working for you.",
      icon: <Activity className="w-8 h-8 text-blue-600" />,
      target: "stats"
    },
    {
      title: "Market Opportunities",
      content: "Explore hand-picked, high-yield opportunities across property, tech, and sustainable energy sectors.",
      icon: <Globe className="w-8 h-8 text-purple-600" />,
      target: "market"
    },
    {
      title: "Secure Payments",
      content: "Link your bank, UPI, or cards securely. Our PCI-DSS compliant gateway ensures your funds move safely.",
      icon: <Shield className="w-8 h-8 text-emerald-600" />,
      target: "payments"
    }
  ];

  useEffect(() => {
    if (currentUser) {
      setEditedProfile({
        name: currentUser.name || '',
        email: currentUser.email || '',
        password: currentUser.password || '',
        phone: currentUser.phone || '',
        address: typeof currentUser.address === 'object' ? {
          street: currentUser.address.street || '',
          city: currentUser.address.city || '',
          pincode: currentUser.address.pincode || '',
          state: currentUser.address.state || '',
          country: currentUser.address.country || ''
        } : {
          street: '',
          city: '',
          pincode: '',
          state: '',
          country: ''
        },
        avatar: currentUser.avatar || ''
      });
    }
  }, [currentUser]);

  const handleSaveProfile = () => {
    onUpdateProfile(editedProfile);
    setIsEditingProfile(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedProfile(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const [goalTargetValue, setGoalTargetValue] = useState(investmentGoal.targetValue.toString());
  const [goalTargetDate, setGoalTargetDate] = useState(investmentGoal.targetDate);

  const uniqueAssetClasses = useMemo(() => {
    const classes = new Set(opportunities.map(o => o.assetClass).filter(Boolean));
    return ['All', ...Array.from(classes)];
  }, [opportunities]);

  const uniquePayouts = useMemo(() => {
    const payouts = new Set(opportunities.map(o => o.payoutFrequency).filter(Boolean));
    return ['All', ...Array.from(payouts)];
  }, [opportunities]);

  const filteredOpps = useMemo(() => {
    return opportunities.filter(o => {
      const matchesType = filterType === 'All' || o.type === filterType;
      const matchesSearch = o.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           o.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesReturnType = returnTypeFilter === 'All' || o.returnType === returnTypeFilter;
      const matchesAssetClass = assetClassFilter === 'All' || o.assetClass === assetClassFilter;
      const matchesPayout = payoutFilter === 'All' || o.payoutFrequency === payoutFilter;

      return matchesType && matchesSearch && matchesReturnType && matchesAssetClass && matchesPayout;
    });
  }, [opportunities, filterType, searchQuery, returnTypeFilter, assetClassFilter, payoutFilter]);

  const totalInvested = userInvestments.reduce((acc, inv) => acc + inv.amount, 0);
  const averageROI = useMemo(() => {
    if (userInvestments.length === 0) return 0;
    const totalWeightedROI = userInvestments.reduce((acc, inv) => {
      const opp = opportunities.find(o => o.id === inv.opportunityId);
      const roi = parseFloat(opp?.expectedROI || '0');
      return acc + (roi * inv.amount);
    }, 0);
    return totalInvested > 0 ? totalWeightedROI / totalInvested : 0;
  }, [userInvestments, opportunities, totalInvested]);

  const expectedReturnAmount = totalInvested * (averageROI / 100);

  const goalProgress = Math.min(100, (totalInvested / investmentGoal.targetValue) * 100);

  const handleSelectOpp = (opp: Opportunity) => {
    onNavigate('opportunity-detail', opp.id);
  };

  const handleToggleWaitlist = (id: string) => {
    setWaitlistIds(prev => 
      prev.includes(id) ? prev.filter(wid => wid !== id) : [...prev, id]
    );
  };

  const handleShare = (opp: Opportunity, platform: 'twitter' | 'linkedin' | 'facebook' | 'instagram' | 'whatsapp' | 'copy') => {
    const text = `Check out this investment opportunity: ${opp.title} (${opp.expectedROI} expected ROI)`;
    const url = `${window.location.origin}?assetId=${opp.id}`;
    
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
    setShowShareMenu(null);
  };

  const filteredInvestments = useMemo(() => {
    return userInvestments.filter(inv => {
      const opp = opportunities.find(o => o.id === inv.opportunityId);
      const matchesSearch = inv.opportunityTitle.toLowerCase().includes(historySearch.toLowerCase()) ||
                           (opp?.partnerName || '').toLowerCase().includes(historySearch.toLowerCase()) ||
                           (opp?.location || '').toLowerCase().includes(historySearch.toLowerCase());
      const matchesAsset = historyAssetFilter === 'All' || inv.opportunityTitle === historyAssetFilter;
      const matchesPartner = historyPartnerFilter === 'All' || opp?.partnerName === historyPartnerFilter;
      const matchesLocation = historyLocationFilter === 'All' || opp?.location === historyLocationFilter;
      const matchesAssetType = historyAssetTypeFilter === 'All' || opp?.type === historyAssetTypeFilter;
      const matchesAssetClass = historyAssetClassFilter === 'All' || opp?.assetClass === historyAssetClassFilter;
      const matchesPayout = historyPayoutFilter === 'All' || opp?.payoutFrequency === historyPayoutFilter;
      const matchesStartDate = !historyStartDate || new Date(inv.date) >= new Date(historyStartDate);
      const matchesEndDate = !historyEndDate || new Date(inv.date) <= new Date(historyEndDate);
      
      return matchesSearch && matchesAsset && matchesPartner && matchesLocation && 
             matchesAssetType && matchesAssetClass && matchesPayout &&
             matchesStartDate && matchesEndDate;
    });
  }, [userInvestments, opportunities, historySearch, historyAssetFilter, historyPartnerFilter, historyLocationFilter, historyAssetTypeFilter, historyAssetClassFilter, historyPayoutFilter, historyStartDate, historyEndDate]);

  const filteredReturns = useMemo(() => {
    return userReturns.filter(ret => {
      const inv = userInvestments.find(i => i.id === ret.investmentId);
      const opp = opportunities.find(o => o.id === inv?.opportunityId);
      const matchesSearch = ret.investmentTitle.toLowerCase().includes(historySearch.toLowerCase()) ||
                           (opp?.partnerName || '').toLowerCase().includes(historySearch.toLowerCase()) ||
                           (opp?.location || '').toLowerCase().includes(historySearch.toLowerCase());
      const matchesAsset = historyAssetFilter === 'All' || ret.investmentTitle === historyAssetFilter;
      const matchesPartner = historyPartnerFilter === 'All' || opp?.partnerName === historyPartnerFilter;
      const matchesLocation = historyLocationFilter === 'All' || opp?.location === historyLocationFilter;
      const matchesAssetType = historyAssetTypeFilter === 'All' || opp?.type === historyAssetTypeFilter;
      const matchesAssetClass = historyAssetClassFilter === 'All' || opp?.assetClass === historyAssetClassFilter;
      const matchesPayout = historyPayoutFilter === 'All' || opp?.payoutFrequency === historyPayoutFilter;
      const matchesType = historyReturnType === 'All' || ret.type === historyReturnType;
      const matchesStartDate = !historyStartDate || new Date(ret.date) >= new Date(historyStartDate);
      const matchesEndDate = !historyEndDate || new Date(ret.date) <= new Date(historyEndDate);
      
      return matchesSearch && matchesAsset && matchesPartner && matchesLocation && 
             matchesAssetType && matchesAssetClass && matchesPayout &&
             matchesType && matchesStartDate && matchesEndDate;
    });
  }, [userReturns, userInvestments, opportunities, historySearch, historyAssetFilter, historyPartnerFilter, historyLocationFilter, historyAssetTypeFilter, historyAssetClassFilter, historyPayoutFilter, historyReturnType, historyStartDate, historyEndDate]);

  const filteredWithdrawals = useMemo(() => {
    return withdrawals.filter(w => {
      const matchesSearch = w.id.toLowerCase().includes(historySearch.toLowerCase()) ||
                           w.opportunityTitle.toLowerCase().includes(historySearch.toLowerCase());
      const matchesStartDate = !historyStartDate || new Date(w.date) >= new Date(historyStartDate);
      const matchesEndDate = !historyEndDate || new Date(w.date) <= new Date(historyEndDate);
      return matchesSearch && matchesStartDate && matchesEndDate;
    });
  }, [withdrawals, historySearch, historyStartDate, historyEndDate]);

  const filteredRentInvestments = useMemo(() => {
    return filteredInvestments.filter(inv => {
      const opp = opportunities.find(o => o.id === inv.opportunityId);
      return (
        opp?.returnType === ReturnType.MONTHLY_RENT || 
        opp?.returnType === ReturnType.YEARLY_RENT || 
        (opp?.rentAmount !== undefined && opp.rentAmount > 0) || 
        (opp?.rentPercentage !== undefined && opp.rentPercentage > 0)
      );
    });
  }, [filteredInvestments, opportunities]);

  const filteredRentReturns = useMemo(() => {
    return filteredReturns.filter(ret => ret.type === 'Monthly Rent' || ret.type === 'Yearly Rent');
  }, [filteredReturns]);

  const filteredROIReturns = useMemo(() => {
    return filteredReturns.filter(ret => ret.type === 'ROI');
  }, [filteredReturns]);

  const filteredDividendReturns = useMemo(() => {
    return filteredReturns.filter(ret => ret.type === 'Dividend');
  }, [filteredReturns]);

  const hasRentInvestments = useMemo(() => {
    return userInvestments.some(inv => {
      const opp = opportunities.find(o => o.id === inv.opportunityId);
      return (
        inv.investorId === currentUser?.id &&
        inv.status === InvestmentStatus.ACTIVE &&
        (opp?.returnType === ReturnType.MONTHLY_RENT || 
         opp?.returnType === ReturnType.YEARLY_RENT || 
         (opp?.rentAmount !== undefined && opp.rentAmount > 0) || 
         (opp?.rentPercentage !== undefined && opp.rentPercentage > 0))
      );
    });
  }, [userInvestments, opportunities, currentUser]);

  const hasROIReturns = useMemo(() => {
    return userInvestments.some(inv => {
      const opp = opportunities.find(o => o.id === inv.opportunityId);
      return inv.investorId === currentUser?.id && inv.status === InvestmentStatus.ACTIVE && opp?.returnType === ReturnType.ROI;
    });
  }, [userInvestments, opportunities, currentUser]);

  const hasDividendReturns = useMemo(() => {
    return userInvestments.some(inv => {
      const opp = opportunities.find(o => o.id === inv.opportunityId);
      return inv.investorId === currentUser?.id && inv.status === InvestmentStatus.ACTIVE && opp?.returnType === ReturnType.DIVIDEND;
    });
  }, [userInvestments, opportunities, currentUser]);

  // Reset historySubTab if current subtab is no longer available
  useEffect(() => {
    if (historySubTab === 'rent' && !hasRentInvestments) {
      setHistorySubTab('assets');
    } else if (historySubTab === 'roi' && !hasROIReturns) {
      setHistorySubTab('assets');
    } else if (historySubTab === 'dividend' && !hasDividendReturns) {
      setHistorySubTab('assets');
    }
  }, [historySubTab, hasRentInvestments, hasROIReturns, hasDividendReturns]);

  const handleExportPDF = (allData: boolean = false) => {
    try {
      const orientation = historySubTab === 'withdraw' ? 'l' : 'p';
      const doc = new jsPDF(orientation, 'mm', 'a4');
      const title = historySubTab === 'assets' 
        ? 'Asset Investment History' 
        : historySubTab === 'returns' 
        ? 'Returns Received History'
        : historySubTab === 'rent'
        ? 'Rent History'
        : historySubTab === 'roi'
        ? 'ROI History'
        : historySubTab === 'dividend'
        ? 'Dividend History'
        : 'Withdrawal History';
      
      const data = historySubTab === 'assets' 
        ? filteredInvestments 
        : historySubTab === 'returns' 
        ? filteredReturns 
        : historySubTab === 'rent'
        ? filteredRentInvestments
        : historySubTab === 'roi'
        ? filteredROIReturns
        : historySubTab === 'dividend'
        ? filteredDividendReturns
        : filteredWithdrawals;
      
      let exportData = data;
      if (!allData && exportDateRange.start && exportDateRange.end) {
        exportData = data.filter(item => {
          const date = new Date(item.date);
          return date >= new Date(exportDateRange.start) && date <= new Date(exportDateRange.end);
        });
      }

      doc.setFontSize(18);
      doc.text(title, 14, 22);
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
      if (!allData && exportDateRange.start && exportDateRange.end) {
        doc.text(`Date Range: ${exportDateRange.start} to ${exportDateRange.end}`, 14, 38);
      }

      const tableColumn = historySubTab === 'assets' 
        ? ["Asset", "Partner", "Location", "Date", "Type", "Asset Class", "Amount", "ROI (%)", "Status"]
        : historySubTab === 'returns'
        ? ["Asset", "Partner", "Location", "Date", "Return Type", "Amount", "Status"]
        : historySubTab === 'rent'
        ? ["Asset", "Partner / Location", "Investment Date", "Type", "Asset Class", "Investment Amount", "Holding Period", "Rent Amount", "Payout Cadence", "Return Type", "Status"]
        : (historySubTab === 'roi' || historySubTab === 'dividend')
        ? ["Asset", "Partner / Location", "Investment Date", "Type", "Asset Class", "Holding Period", `${historySubTab.toUpperCase()} Amount`, `${historySubTab.toUpperCase()} Yield (%)`, "Payout Cadence", "Return Type", "Status"]
        : ["Asset", "Partner / Location", "Date", "Type", "Asset Class", "Return Type", "Holding Period", "Payout Cadence", "Principal", "ROI (%)", "Total Payout", "Status"];
      
      const tableRows = exportData.map(item => {
        if (historySubTab === 'assets') {
          const inv = item as InvestmentRecord;
          const opp = opportunities.find(o => o.id === inv.opportunityId);
          return [
            inv.opportunityTitle, 
            opp?.partnerName || 'N/A',
            opp?.location || 'N/A',
            new Date(inv.date).toLocaleDateString(), 
            inv.type, 
            opp?.assetClass || 'N/A',
            `$${(inv.amount ?? 0).toLocaleString()}`, 
            opp?.expectedROI || '0%',
            inv.status
          ];
        } else if (historySubTab === 'returns') {
          const ret = item as ReturnRecord;
          const inv = userInvestments.find(i => i.id === ret.investmentId);
          const opp = opportunities.find(o => o.id === inv?.opportunityId);
          return [
            ret.investmentTitle, 
            opp?.partnerName || 'N/A',
            opp?.location || 'N/A',
            new Date(ret.date).toLocaleDateString(), 
            ret.type, 
            `$${(ret.amount ?? 0).toLocaleString()}`, 
            'Credited'
          ];
        } else if (historySubTab === 'rent') {
          const inv = item as InvestmentRecord;
          const opp = opportunities.find(o => o.id === inv.opportunityId);
          const rentVal = opp?.rentAmount || (opp?.rentPercentage ? inv.amount * (opp.rentPercentage / 100) : 0);
          return [
            inv.opportunityTitle,
            `${opp?.partnerName || 'N/A'} / ${opp?.location || 'N/A'}`,
            new Date(inv.date).toLocaleDateString(),
            inv.type,
            opp?.assetClass || 'N/A',
            `$${(inv.amount ?? 0).toLocaleString()}`,
            opp?.holdingPeriod || 'N/A',
            rentVal ? `$${(rentVal ?? 0).toLocaleString()}` : 'N/A',
            opp?.payoutFrequency || 'N/A',
            opp?.returnType || 'N/A',
            inv.status
          ];
        } else if (historySubTab === 'roi' || historySubTab === 'dividend') {
          const ret = item as ReturnRecord;
          const inv = userInvestments.find(i => i.id === ret.investmentId);
          const opp = opportunities.find(o => o.id === inv?.opportunityId);
          const investmentAmount = inv?.amount || 0;
          const returnAmount = ret.amount;
          const yieldPct = investmentAmount > 0 ? (returnAmount / investmentAmount) * 100 : 0;
          return [
            ret.investmentTitle,
            `${opp?.partnerName || 'N/A'} / ${opp?.location || 'N/A'}`,
            new Date(ret.date).toLocaleDateString(),
            opp?.type || 'N/A',
            opp?.assetClass || 'N/A',
            opp?.holdingPeriod || 'N/A',
            `$${(returnAmount ?? 0).toLocaleString()}`,
            `${yieldPct.toFixed(2)}%`,
            opp?.payoutFrequency || 'N/A',
            ret.type,
            'Credited'
          ];
        } else {
          const w = item as WithdrawalRecord;
          const roi = ((w.withdrawalAmount - w.investmentAmount) / w.investmentAmount) * 100;
          return [
            w.opportunityTitle,
            `${w.partnerName} / ${w.location}`,
            new Date(w.date).toLocaleDateString(),
            w.type,
            w.assetClass,
            w.returnType,
            w.holdingPeriod,
            w.payoutFrequency,
            `$${(w.investmentAmount ?? 0).toLocaleString()}`,
            `${roi >= 0 ? '+' : ''}${roi.toFixed(2)}%`,
            `$${(w.withdrawalAmount ?? 0).toLocaleString()}`,
            w.status
          ];
        }
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: allData ? 35 : 45,
        theme: 'grid',
        headStyles: { fillColor: [16, 185, 129] },
        styles: { fontSize: 8 }
      });

      doc.save(`${title.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`);
      setShowExportModal(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleDownloadCertificate = (investmentId: string) => {
    const inv = userInvestments.find(i => i.id === investmentId);
    if (!inv || !currentUser) return;
    const opp = opportunities.find(o => o.id === inv.opportunityId);
    if (!opp) return;
    const partner = partners.find(p => p.legalCompanyName === opp.partnerName);
    
    setCertificateToDownload({
      investment: inv,
      investor: currentUser,
      opportunity: opp,
      partner: partner,
      issueDate: new Date().toLocaleDateString(),
      logo: config.growMilkatLogo || config.logo,
      ownerSignature: config.ownerSignature
    });
  };

  useEffect(() => {
    if (returnWithdrawalCertificateToDownload) {
      const generatePDF = async () => {
        const element = document.getElementById(`return-withdrawal-certificate-${returnWithdrawalCertificateToDownload.withdrawal.id}`);
        if (!element) return;

        try {
          const canvas = await html2canvas(element, {
            scale: 3,
            useCORS: true,
            backgroundColor: '#FAF6EE',
            logging: false,
            allowTaint: true,
            width: 820,
            height: element.offsetHeight || 1100,
            onclone: (clonedDoc) => {
              // 1. Remove watermark entirely from the clone
              const watermark = clonedDoc.querySelector('[data-watermark="true"]');
              if (watermark) watermark.remove();
              
              // 2. Replace ALL gradients with solid colors to avoid 'createPattern' errors
              const all = clonedDoc.querySelectorAll('*');
              all.forEach(el => {
                if (el instanceof HTMLElement) {
                  const bg = el.style.background || '';
                  const bgImg = el.style.backgroundImage || '';
                  if (bg.includes('gradient') || bgImg.includes('gradient')) {
                    // Determine a safe solid color replacement
                    if (bg.includes('#1A1610') || bg.includes('#2C2416')) {
                      el.style.background = '#1A1610';
                    } else if (bg.includes('#2A3A1A') || bg.includes('#1E2C12')) {
                      el.style.background = '#2A3A1A';
                    } else if (bg.includes('#3A7A1A') || bg.includes('#72C437')) {
                      el.style.background = '#3A7A1A';
                    } else if (bg.includes('#C9A84C') || bg.includes('#E8C97A')) {
                      el.style.background = '#C9A84C';
                    } else if (bg.includes('#0D2A3A') || bg.includes('#081E2C')) {
                      el.style.background = '#0D2A3A';
                    } else if (bg.includes('#3A2A08') || bg.includes('#2C1E04')) {
                      el.style.background = '#3A2A08';
                    } else {
                      el.style.background = '#D4B96A';
                    }
                    el.style.backgroundImage = 'none';
                  }
                }
              });

              // 3. Clean up the main certificate element
              const clonedElement = clonedDoc.getElementById(`return-withdrawal-certificate-${returnWithdrawalCertificateToDownload.withdrawal.id}`);
              if (clonedElement) {
                clonedElement.style.boxShadow = 'none';
                clonedElement.style.transform = 'none';
                clonedElement.style.margin = '0';
              }
            }
          });
          
          const imgData = canvas.toDataURL('image/png', 1.0);
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [820, canvas.height / 3]
          });
          
          pdf.addImage(imgData, 'PNG', 0, 0, 820, canvas.height / 3);
          pdf.save(`Return_Withdrawal_Certificate_${returnWithdrawalCertificateToDownload.withdrawal.id}.pdf`);
        } catch (error) {
          console.error('Error generating return withdrawal certificate PDF:', error);
        } finally {
          setReturnWithdrawalCertificateToDownload(null);
        }
      };

      const timer = setTimeout(generatePDF, 800);
      return () => clearTimeout(timer);
    }
  }, [returnWithdrawalCertificateToDownload]);

  const handleDownloadWithdrawalCertificate = (withdrawalId: string) => {
    const withdrawal = withdrawals.find(w => w.id === withdrawalId);
    const investment = userInvestments.find(inv => inv.id === withdrawal?.investmentId);
    const opportunity = opportunities.find(opp => opp.id === investment?.opportunityId);
    const partner = partners.find(p => p.legalCompanyName === withdrawal?.partnerName);
    
    if (withdrawal && currentUser) {
      if (withdrawal.isReturnsWithdrawal) {
        setReturnWithdrawalCertificateToDownload({
          withdrawal,
          investor: currentUser,
          opportunity,
          partner,
          issueDate: new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          }),
          logo: config.growMilkatLogo || config.logo,
          ownerSignature: config.ownerSignature
        });
        return;
      }

      setWithdrawalCertificateToDownload({
        withdrawal,
        investor: currentUser,
        opportunity,
        partner,
        issueDate: new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }),
        logo: config.growMilkatLogo || config.logo,
        ownerSignature: config.ownerSignature
      });
    }
  };

  const getSystemExportDataRange = () => {
    const end = new Date();
    let start = new Date();
    
    switch (systemExportPeriod) {
      case 'Last 30 days':
        start.setDate(end.getDate() - 30);
        break;
      case 'Last 90 Days':
        start.setDate(end.getDate() - 90);
        break;
      case 'Last 180 days':
        start.setDate(end.getDate() - 180);
        break;
      case 'Last 6 month':
        start.setMonth(end.getMonth() - 6);
        break;
      case 'Date to Date Range':
        return { start: systemExportDateRange.start, end: systemExportDateRange.end };
      default:
        start.setDate(end.getDate() - 30);
    }
    
    return { 
      start: start.toISOString().split('T')[0], 
      end: end.toISOString().split('T')[0] 
    };
  };

  const handleSystemDataExport = () => {
    try {
      const doc = new jsPDF('l', 'mm', 'a4');
      const { start, end } = getSystemExportDataRange();
      
      let title = "";
      let tableColumn: string[] = [];
      let tableRows: any[] = [];
      
      const filterByDate = (dateStr: string) => {
        if (!start || !end) return true;
        const date = new Date(dateStr);
        return date >= new Date(start) && date <= new Date(end);
      };

      if (systemExportDataType === 'Detailed Asset Performance') {
        title = "Detailed Asset Performance Report";
        tableColumn = ["Asset", "Partner / Location", "Date", "Type", "Asset Class", "Amount", "Expected ROI (%)", "Expected IRR", "Projected Return", "Total Value", "Return Type", "Return", "Holding Period", "Payout Cadence", "Risk Factor", "Strategic Partner", "Status", "Action"];
        
        tableRows = userInvestments.filter(inv => filterByDate(inv.date)).map(inv => {
          const opp = opportunities.find(o => o.id === inv.opportunityId);
          const roiPercent = parseFloat(opp?.expectedROI || '0');
          const projectedReturn = inv.amount * (roiPercent / 100);
          
          const currentReturnType = opp?.returnType || ReturnType.ROI;

          // Calculate specific return amount based on return type
          let returnAmount = 0;
          if (opp) {
            if (currentReturnType === ReturnType.MONTHLY_RENT) {
              if (opp.rentAmount !== undefined) {
                returnAmount = opp.rentAmount;
              } else if (opp.rentPercentage !== undefined) {
                returnAmount = inv.amount * (opp.rentPercentage / 100);
              } else {
                returnAmount = projectedReturn / 12;
              }
            } else if (currentReturnType === ReturnType.YEARLY_RENT) {
              if (opp.rentAmount !== undefined) {
                returnAmount = opp.rentAmount * 12;
              } else if (opp.rentPercentage !== undefined) {
                returnAmount = inv.amount * (opp.rentPercentage / 100) * 12;
              } else {
                returnAmount = projectedReturn;
              }
            } else if (currentReturnType === ReturnType.DIVIDEND) {
              if (opp.dividendAmount !== undefined) {
                returnAmount = opp.dividendAmount;
              } else if (opp.dividendPercentage !== undefined) {
                returnAmount = inv.amount * (opp.dividendPercentage / 100);
              }
            } else if (currentReturnType === ReturnType.ROI) {
              if (opp.roiAmount !== undefined) {
                returnAmount = opp.roiAmount;
              } else if (opp.roiPercentage !== undefined) {
                returnAmount = inv.amount * (opp.roiPercentage / 100);
              } else {
                returnAmount = projectedReturn;
              }
            }
          }

          const totalValue = inv.amount + projectedReturn;
          
          return [
            inv.opportunityTitle,
            `${opp?.partnerName || 'N/A'} / ${opp?.location || 'N/A'}`,
            new Date(inv.date).toLocaleDateString(),
            inv.type,
            opp?.assetClass || 'N/A',
            `$${(inv.amount ?? 0).toLocaleString()}`,
            opp?.expectedROI || '0%',
            opp?.expectedIRR || 'N/A',
            `$${(projectedReturn ?? 0).toLocaleString()}`,
            `$${(totalValue ?? 0).toLocaleString()}`,
            currentReturnType,
            `$${(returnAmount ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
            opp?.holdingPeriod || 'N/A',
            opp?.payoutFrequency || 'N/A',
            opp?.riskLevel || 'N/A',
            opp?.partnerName || 'N/A',
            inv.status,
            "View"
          ];
        });
      } else if (systemExportDataType === 'Total Investment') {
        title = "Total Investment Report";
        tableColumn = ["Asset", "Partner / Location", "Date", "Type", "Asset Class", "Total Amount"];
        
        tableRows = userInvestments.filter(inv => filterByDate(inv.date)).map(inv => {
          const opp = opportunities.find(o => o.id === inv.opportunityId);
          return [
            inv.opportunityTitle,
            `${opp?.partnerName || 'N/A'} / ${opp?.location || 'N/A'}`,
            new Date(inv.date).toLocaleDateString(),
            inv.type,
            opp?.assetClass || 'N/A',
            `$${(inv.amount ?? 0).toLocaleString()}`
          ];
        });
      } else if (systemExportDataType === 'Total Rent Gain') {
        title = "Total Rent Gain Report";
        tableColumn = ["Asset", "Partner / Location", "Date", "Type", "Asset Class", "Amount", "Payout Cadence", "Rent Amount"];
        
        tableRows = userReturns.filter(ret => (ret.type === 'Monthly Rent' || ret.type === 'Yearly Rent') && filterByDate(ret.date)).map(ret => {
          const inv = userInvestments.find(i => i.id === ret.investmentId);
          const opp = opportunities.find(o => o.id === inv?.opportunityId);
          return [
            ret.investmentTitle,
            `${opp?.partnerName || 'N/A'} / ${opp?.location || 'N/A'}`,
            new Date(ret.date).toLocaleDateString(),
            inv?.type || 'N/A',
            opp?.assetClass || 'N/A',
            `$${inv?.amount?.toLocaleString() || '0'}`,
            opp?.payoutFrequency || 'N/A',
            `$${(ret.amount ?? 0).toLocaleString()}`
          ];
        });
      }

      doc.setFontSize(18);
      doc.text(title, 14, 22);
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
      doc.text(`Period: ${systemExportPeriod}${systemExportPeriod === 'Date to Date Range' ? ` (${start} to ${end})` : ''}`, 14, 38);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 45,
        theme: 'grid',
        headStyles: { fillColor: [16, 185, 129], fontSize: 8 },
        styles: { fontSize: 7 },
        margin: { left: 10, right: 10 }
      });

      doc.save(`${title.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`);
      setShowSystemDataExportModal(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const uniqueAssets = useMemo(() => {
    const assets = new Set<string>();
    userInvestments.forEach(inv => assets.add(inv.opportunityTitle));
    userReturns.forEach(ret => assets.add(ret.investmentTitle));
    return Array.from(assets);
  }, [userInvestments, userReturns]);

  const uniqueAnalysisAssetClasses = useMemo(() => {
    const classes = new Set<string>();
    userInvestments.forEach(inv => {
      const opp = opportunities.find(o => o.id === inv.opportunityId);
      if (opp?.assetClass) classes.add(opp.assetClass);
    });
    return ['All', ...Array.from(classes)];
  }, [userInvestments, opportunities]);

  const uniqueAnalysisPayouts = useMemo(() => {
    const payouts = new Set<string>();
    userInvestments.forEach(inv => {
      const opp = opportunities.find(o => o.id === inv.opportunityId);
      if (opp?.payoutFrequency) payouts.add(opp.payoutFrequency);
    });
    return ['All', ...Array.from(payouts)];
  }, [userInvestments, opportunities]);

  const filteredAnalysisData = useMemo(() => {
    return userInvestments.map(inv => {
      const opp = opportunities.find(o => o.id === inv.opportunityId);
      const hasReturn = userReturns.some(ret => ret.investmentId === inv.id);
      
      // Calculate projected return
      const roiPercent = parseFloat(opp?.expectedROI || '0');
      const projectedReturn = inv.amount * (roiPercent / 100);
      const totalValue = inv.amount + (hasReturn ? userReturns.find(r => r.investmentId === inv.id)?.amount || 0 : projectedReturn);

      // Determine return type
      const currentReturnType = opp?.returnType || ReturnType.ROI;

      // Calculate specific return amount based on return type
      let returnAmount = 0;
      if (opp) {
        if (currentReturnType === ReturnType.MONTHLY_RENT) {
          if (opp.rentAmount !== undefined) {
            returnAmount = opp.rentAmount;
          } else if (opp.rentPercentage !== undefined) {
            returnAmount = inv.amount * (opp.rentPercentage / 100);
          } else {
            // Fallback to monthly portion of ROI if no specific rent defined
            returnAmount = projectedReturn / 12;
          }
        } else if (currentReturnType === ReturnType.YEARLY_RENT) {
          if (opp.rentAmount !== undefined) {
            returnAmount = opp.rentAmount * 12;
          } else if (opp.rentPercentage !== undefined) {
            returnAmount = inv.amount * (opp.rentPercentage / 100) * 12;
          } else {
            // Fallback to ROI if no specific rent defined
            returnAmount = projectedReturn;
          }
        } else if (currentReturnType === ReturnType.DIVIDEND) {
          if (opp.dividendAmount !== undefined) {
            returnAmount = opp.dividendAmount;
          } else if (opp.dividendPercentage !== undefined) {
            returnAmount = inv.amount * (opp.dividendPercentage / 100);
          }
        } else if (currentReturnType === ReturnType.ROI) {
          if (opp.roiAmount !== undefined) {
            returnAmount = opp.roiAmount;
          } else if (opp.roiPercentage !== undefined) {
            returnAmount = inv.amount * (opp.roiPercentage / 100);
          } else {
            returnAmount = projectedReturn;
          }
        }
      }

      return {
        ...inv,
        partner: opp?.partnerName || 'N/A',
        location: opp?.location || 'N/A',
        assetClass: opp?.assetClass || 'N/A',
        expectedROI: opp?.expectedROI || '0%',
        expectedIRR: opp?.expectedIRR || 'N/A',
        projectedReturn: projectedReturn,
        totalValue: totalValue,
        returnAmount: returnAmount,
        returnType: currentReturnType,
        holdingPeriod: opp?.holdingPeriod || 'N/A',
        payoutCadence: opp?.payoutFrequency || 'N/A',
        riskFactor: opp?.riskLevel || 'N/A',
        strategicPartner: opp?.partnerName || 'N/A',
        monthlyRevenue: returnAmount > 0 ? (currentReturnType === ReturnType.MONTHLY_RENT ? returnAmount : returnAmount / 12) : projectedReturn / 12
      };
    }).filter(item => {
      const matchesSearch = 
        item.opportunityTitle.toLowerCase().includes(analysisSearch.toLowerCase()) ||
        item.partner.toLowerCase().includes(analysisSearch.toLowerCase()) ||
        item.location.toLowerCase().includes(analysisSearch.toLowerCase());
      
      const matchesAsset = analysisAssetFilter === 'All' || item.opportunityTitle === analysisAssetFilter;
      const matchesPartner = analysisPartnerFilter === 'All' || item.partner === analysisPartnerFilter;
      const matchesLocation = analysisLocationFilter === 'All' || item.location === analysisLocationFilter;
      const matchesPayout = analysisPayoutFilter === 'All' || item.payoutCadence === analysisPayoutFilter;
      const matchesReturnType = analysisReturnTypeFilter === 'All' || item.returnType === analysisReturnTypeFilter;
      const matchesAssetClass = analysisAssetClassFilter === 'All' || item.assetClass === analysisAssetClassFilter;
      const matchesType = analysisTypeFilter === 'All' || item.type === analysisTypeFilter;
      
      const matchesStartDate = !analysisStartDate || new Date(item.date) >= new Date(analysisStartDate);
      const matchesEndDate = !analysisEndDate || new Date(item.date) <= new Date(analysisEndDate);
      const matchesMonth = analysisMonth === 'All' || new Date(item.date).getMonth() === parseInt(analysisMonth);
      const matchesYear = analysisYear === 'All' || new Date(item.date).getFullYear() === parseInt(analysisYear);
      
      return matchesSearch && matchesAsset && matchesPartner && matchesLocation && matchesPayout && matchesReturnType && matchesAssetClass && matchesType && matchesStartDate && matchesEndDate && matchesMonth && matchesYear;
    });
  }, [userInvestments, opportunities, userReturns, analysisSearch, analysisAssetFilter, analysisPartnerFilter, analysisLocationFilter, analysisPayoutFilter, analysisReturnTypeFilter, analysisAssetClassFilter, analysisTypeFilter, analysisStartDate, analysisEndDate, analysisMonth, analysisYear]);

  const analysisChartData = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      months.push({
        name: d.toLocaleString('default', { month: 'short' }),
        month: d.getMonth(),
        year: d.getFullYear(),
        invested: 0,
        returns: 0
      });
    }

    filteredAnalysisData.forEach(inv => {
      const invDate = new Date(inv.date);
      const monthData = months.find(m => m.month === invDate.getMonth() && m.year === invDate.getFullYear());
      if (monthData) {
        monthData.invested += inv.amount;
      }
    });

    userReturns.forEach(ret => {
      const retDate = new Date(ret.date);
      const monthData = months.find(m => m.month === retDate.getMonth() && m.year === retDate.getFullYear());
      if (monthData) {
        monthData.returns += ret.amount;
      }
    });

    return months;
  }, [filteredAnalysisData, userReturns]);

  const selectedWithdrawInvestment = useMemo(() => {
    return userInvestments.find(inv => inv.id === withdrawAssetId);
  }, [userInvestments, withdrawAssetId]);

  const selectedWithdrawReturns = useMemo(() => {
    return userReturns.filter(ret => ret.investmentId === withdrawAssetId);
  }, [userReturns, withdrawAssetId]);

  const withdrawCalculation = useMemo(() => {
    if (!selectedWithdrawInvestment) return null;
    
    const investmentAmount = selectedWithdrawInvestment.amount;
    
    // Calculate total potential gains
    const totalGains = selectedWithdrawReturns.reduce((acc, ret) => acc + ret.amount, 0);
    
    // Calculate gains already withdrawn (APPROVED or PENDING return withdrawals)
    const withdrawnGains = selectedWithdrawReturns
      .filter(ret => ret.withdrawalStatus === WithdrawalStatus.APPROVED || ret.withdrawalStatus === WithdrawalStatus.PENDING)
      .reduce((acc, ret) => acc + ret.amount, 0);
    
    // Net gain amount for this withdrawal
    const gainAmount = Math.max(0, totalGains - withdrawnGains);
    const totalValue = investmentAmount + gainAmount;
    
    const invDate = new Date(selectedWithdrawInvestment.date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - invDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const isUnderHoldingPeriod = diffDays < 365;
    const fineAmount = isUnderHoldingPeriod ? investmentAmount * 0.05 : 0;
    const finalWithdrawAmount = investmentAmount + gainAmount - fineAmount;
    
    return {
      investmentAmount,
      totalGains,
      withdrawnGains,
      gainAmount,
      totalValue,
      diffDays,
      isUnderHoldingPeriod,
      fineAmount,
      finalWithdrawAmount
    };
  }, [selectedWithdrawInvestment, selectedWithdrawReturns]);

  const handleExportAnalysisPDF = () => {
    try {
      const doc = new jsPDF({ orientation: 'landscape' });
      const title = 'In-Depth Portfolio Analysis';
      
      let exportData = filteredAnalysisData;
      if (exportDateRange.start && exportDateRange.end) {
        exportData = filteredAnalysisData.filter(item => {
          const date = new Date(item.date);
          return date >= new Date(exportDateRange.start) && date <= new Date(exportDateRange.end);
        });
      }

      doc.setFontSize(18);
      doc.text(title, 14, 22);
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
      if (exportDateRange.start && exportDateRange.end) {
        doc.text(`Date Range: ${exportDateRange.start} to ${exportDateRange.end}`, 14, 38);
      }

      const tableColumn = [
        "Asset", "Partner / Location", "Date", "Type", "Asset Class", "Amount", 
        "Expected ROI (%)", "Expected IRR", "Projected Return", "Monthly Revenue", 
        "Return Amount", "Total Value", "Return Type", "Holding Period", "Payout Cadence", 
        "Risk Factor", "Strategic Partner", "Status", "Action"
      ];
      
      const tableRows = exportData.map(item => [
        item.opportunityTitle,
        `${item.partner} / ${item.location}`,
        new Date(item.date).toLocaleDateString(),
        item.type,
        item.assetClass,
        `$${(item.amount ?? 0).toLocaleString()}`,
        item.expectedROI,
        item.expectedIRR,
        `$${(item.projectedReturn ?? 0).toLocaleString()}`,
        `$${(item.monthlyRevenue ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
        (item.returnAmount ?? 0) > 0 ? `$${(item.returnAmount ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '-',
        `$${(item.totalValue ?? 0).toLocaleString()}`,
        item.returnType,
        item.holdingPeriod,
        item.payoutCadence,
        item.riskFactor,
        item.strategicPartner,
        item.status,
        "View"
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: (exportDateRange.start && exportDateRange.end) ? 45 : 35,
        theme: 'grid',
        headStyles: { 
          fillColor: [16, 185, 129],
          fontSize: 8
        },
        styles: {
          fontSize: 7,
          cellPadding: 2
        }
      });

      doc.save(`Portfolio_Analysis_${new Date().getTime()}.pdf`);
      setShowAnalysisExportModal(false);
    } catch (error) {
      console.error('Error generating Analysis PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleConfirmInvestment = () => {
    if (selectedOpp) {
      onInvest(selectedOpp, investAmount);
      setShowConfirmation({ show: true, opp: selectedOpp.title, amount: investAmount });
      setSelectedOpp(null);
    }
  };

  const handleUpdateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateGoal({
      targetValue: Number(goalTargetValue),
      targetDate: goalTargetDate
    });
  };

  const handleDurationChange = (duration: string) => {
    if (!duration) return;
    const now = new Date();
    let targetDate = new Date();
    
    if (duration === '1 Month') targetDate.setMonth(now.getMonth() + 1);
    else if (duration === '6 Month') targetDate.setMonth(now.getMonth() + 6);
    else if (duration === '1.6 Years') targetDate.setMonth(now.getMonth() + 19);
    else if (duration === '2 Years') targetDate.setFullYear(now.getFullYear() + 2);
    else if (duration === '3 Years') targetDate.setFullYear(now.getFullYear() + 3);
    else if (duration === '4 Years') targetDate.setFullYear(now.getFullYear() + 4);
    else if (duration === '5 Years') targetDate.setFullYear(now.getFullYear() + 5);
    else if (duration === '6 Years') targetDate.setFullYear(now.getFullYear() + 6);
    else if (duration === '7 Years') targetDate.setFullYear(now.getFullYear() + 7);
    else if (duration === '8 Years') targetDate.setFullYear(now.getFullYear() + 8);
    else if (duration === '9 Years') targetDate.setFullYear(now.getFullYear() + 9);
    else if (duration === '10 Years') targetDate.setFullYear(now.getFullYear() + 10);
    else if (duration === '11 Years') targetDate.setFullYear(now.getFullYear() + 11);
    else if (duration === '12 Years') targetDate.setFullYear(now.getFullYear() + 12);
    else if (duration === '15 Years') targetDate.setFullYear(now.getFullYear() + 15);
    else if (duration === '20 Years') targetDate.setFullYear(now.getFullYear() + 20);
    else if (duration === '30 Years') targetDate.setFullYear(now.getFullYear() + 30);
    
    setGoalTargetDate(targetDate.toISOString().split('T')[0]);
  };

  const getRiskColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'low': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      case 'moderate': return 'text-amber-500 bg-amber-50 border-amber-100';
      case 'high': return 'text-rose-500 bg-rose-50 border-rose-100';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  const menuItems = [
    { id: 'dashboard' as DashboardTab, icon: <Activity className="w-5 h-5" />, label: 'Dashboard' },
    { id: 'analysis' as DashboardTab, icon: <PieChart className="w-5 h-5" />, label: 'In-Depth Data Analysis' },
    { id: 'market' as DashboardTab, icon: <Globe className="w-5 h-5" />, label: 'Market Opportunities' },
    { id: 'waitlist' as DashboardTab, icon: <Bookmark className="w-5 h-5" />, label: 'Waitlist' },
    { id: 'history' as DashboardTab, icon: <History className="w-5 h-5" />, label: 'History' },
    { id: 'payments' as DashboardTab, icon: <CreditCard className="w-5 h-5" />, label: 'Payment Gateways' },
    { id: 'kyc' as DashboardTab, icon: currentUser?.kycStatus === 'Rejected' ? <AlertCircle className="w-5 h-5 text-rose-500" /> : <Shield className="w-5 h-5" />, label: 'KYC Verification' },
    { id: 'notifications' as DashboardTab, icon: <Bell className="w-5 h-5" />, label: 'Notifications' },
    { id: 'settings' as DashboardTab, icon: <Settings className="w-5 h-5" />, label: 'Settings' },
    { id: 'profile' as DashboardTab, icon: <User className="w-5 h-5" />, label: 'Profile' },
    { id: 'support' as DashboardTab, icon: <LifeBuoy className="w-5 h-5" />, label: 'Support' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen flex relative">
      <AnimatePresence>
        {showTour && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white max-w-sm w-full rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6">
                <button onClick={closeTour} className="text-slate-300 hover:text-slate-600 transition">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-2">
                  {tourSteps[tourStep].icon}
                </div>
                
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Step {tourStep + 1} of 5</p>
                  <h3 className="text-2xl font-bold serif text-slate-900">{tourSteps[tourStep].title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{tourSteps[tourStep].content}</p>
                </div>

                <div className="flex gap-2 w-full pt-4">
                  <div className="flex gap-1 items-center flex-grow">
                    {[0, 1, 2, 3, 4].map(i => (
                      <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === tourStep ? 'w-8 bg-emerald-600' : 'w-2 bg-slate-100'}`} />
                    ))}
                  </div>
                  <button
                    onClick={nextTourStep}
                    className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-600 transition flex items-center gap-2"
                  >
                    {tourStep === 4 ? 'Get Started' : 'Next'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showExportModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white max-w-md w-full rounded-3xl md:rounded-[2.5rem] shadow-2xl border border-slate-100 relative flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="absolute top-0 right-0 z-20 p-6">
                <button onClick={() => setShowExportModal(false)} className="text-slate-300 hover:text-slate-600 transition bg-white/50 backdrop-blur-sm rounded-full p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto p-6 md:p-10 custom-scrollbar">
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-emerald-600">
                    <Download className="w-8 h-8" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold serif text-slate-900">Export History</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">Select a date range to export your {historySubTab === 'assets' ? 'investment' : 'returns'} history as a PDF document.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Start Date</label>
                      <input 
                        type="date" 
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                        value={exportDateRange.start}
                        onChange={(e) => setExportDateRange({...exportDateRange, start: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">End Date</label>
                      <input 
                        type="date" 
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                        value={exportDateRange.end}
                        onChange={(e) => setExportDateRange({...exportDateRange, end: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => handleExportPDF(false)}
                      disabled={!exportDateRange.start || !exportDateRange.end}
                      className="flex-grow py-4 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-200"
                    >
                      Download PDF
                    </button>
                    <button
                      onClick={() => setShowExportModal(false)}
                      className="px-6 py-4 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-100 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showAnalysisExportModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white max-w-md w-full rounded-3xl md:rounded-[2.5rem] shadow-2xl border border-slate-100 relative flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="absolute top-0 right-0 z-20 p-6">
                <button onClick={() => setShowAnalysisExportModal(false)} className="text-slate-300 hover:text-slate-600 transition bg-white/50 backdrop-blur-sm rounded-full p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto p-6 md:p-10 custom-scrollbar">
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-emerald-600">
                    <PieChart className="w-8 h-8" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold serif text-slate-900">Export Analysis</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">Select a date range to export your filtered portfolio analysis data as a PDF report.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Start Date</label>
                      <input 
                        type="date" 
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                        value={exportDateRange.start}
                        onChange={(e) => setExportDateRange({...exportDateRange, start: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">End Date</label>
                      <input 
                        type="date" 
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                        value={exportDateRange.end}
                        onChange={(e) => setExportDateRange({...exportDateRange, end: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleExportAnalysisPDF}
                      className="flex-grow py-4 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition shadow-lg shadow-emerald-200"
                    >
                      Export PDF
                    </button>
                    <button
                      onClick={() => setShowAnalysisExportModal(false)}
                      className="px-6 py-4 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-100 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {selectedNotification && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white max-w-lg w-full rounded-3xl md:rounded-[2.5rem] shadow-2xl border border-slate-100 relative flex flex-col max-h-[90vh] overflow-hidden"
              >
              <div className="absolute top-0 right-0 z-20 p-6">
                <button onClick={() => setSelectedNotification(null)} className="text-slate-300 hover:text-slate-600 transition bg-white/50 backdrop-blur-sm rounded-full p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto p-6 md:p-10 custom-scrollbar">

              <div className="space-y-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                  selectedNotification.type === 'KYC' ? 'bg-blue-100 text-blue-600' :
                  selectedNotification.type === 'Return' ? 'bg-emerald-100 text-emerald-600' :
                  selectedNotification.type === 'Investment' ? 'bg-purple-100 text-purple-600' :
                  selectedNotification.type === 'New Opportunity' ? 'bg-amber-100 text-amber-600' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {selectedNotification.type === 'KYC' ? <Shield className="w-8 h-8" /> :
                   selectedNotification.type === 'Return' ? <DollarSign className="w-8 h-8" /> :
                   selectedNotification.type === 'Investment' ? <TrendingUp className="w-8 h-8" /> :
                   selectedNotification.type === 'New Opportunity' ? <Globe className="w-8 h-8" /> :
                   <Bell className="w-8 h-8" />}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {selectedNotification.type} • {new Date(selectedNotification.date).toLocaleDateString()} {new Date(selectedNotification.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <h3 className="text-2xl font-bold serif text-slate-900 leading-tight">{selectedNotification.title}</h3>
                  </div>
                  
                  <div className="max-h-[40vh] overflow-y-auto pr-4 custom-scrollbar">
                    <p className="text-slate-500 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                      {selectedNotification.message}
                    </p>
                  </div>
                </div>

                {selectedNotification.actionUrl && (
                  <button 
                    onClick={() => {
                      const url = new URL(selectedNotification.actionUrl!, window.location.origin);
                      const tab = url.searchParams.get('tab') as DashboardTab;
                      const assetId = url.searchParams.get('assetId');
                      
                      if (assetId) {
                        onNavigate('opportunity-detail', assetId);
                      } else if (tab) {
                        onTabChange(tab);
                      }
                      setSelectedNotification(null);
                    }}
                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition flex items-center justify-center gap-2"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
                
                <button 
                  onClick={() => setSelectedNotification(null)}
                  className="w-full py-4 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-100 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className="hidden sm:flex w-20 lg:w-72 bg-white border-r border-slate-100 flex-col sticky top-0 h-screen z-50">
        <div className="p-6 lg:p-10">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-200">G</div>
        </div>
        
        <nav className="flex-grow px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 relative ${
                activeTab === item.id 
                  ? 'bg-emerald-50 text-emerald-600 shadow-inner' 
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              <div className={activeTab === item.id ? 'text-emerald-600' : ''}>
                {item.icon}
                {item.id === 'notifications' && currentUser?.notifications?.some(n => !n.read) && (
                  <span className="absolute top-3 left-7 w-4 h-4 bg-rose-500 text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white">
                    {currentUser.notifications.filter(n => !n.read).length}
                  </span>
                )}
                {item.id === 'kyc' && currentUser?.kycStatus === 'Rejected' && (
                  <span className="absolute top-3 left-7 w-4 h-4 bg-rose-500 text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white animate-pulse">
                    !
                  </span>
                )}
              </div>
              <span className="hidden lg:block font-bold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-50">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-4 p-4 text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden lg:block font-bold text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-[100] flex justify-around p-2">
        {menuItems.filter(item => ['dashboard', 'market', 'notifications', 'history', 'profile'].includes(item.id)).map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center p-2 rounded-xl transition-all relative ${
              activeTab === item.id ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400'
            }`}
          >
            <div className="relative">
              {item.icon}
              {item.id === 'notifications' && currentUser?.notifications?.some(n => !n.read) && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white">
                  {currentUser.notifications.filter(n => !n.read).length}
                </span>
              )}
              {item.id === 'kyc' && currentUser?.kycStatus === 'Rejected' && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white animate-pulse">
                  !
                </span>
              )}
            </div>
            <span className="text-[8px] font-bold mt-1 uppercase tracking-widest">{item.label.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-grow p-4 sm:p-6 md:p-10 overflow-x-hidden pb-24 sm:pb-10">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
          
          {selectedOpp && (activeTab === 'dashboard' || activeTab === 'market') ? (
            <div className="animate-in slide-in-from-bottom duration-500 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedOpp(null)}
                    className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-emerald-600 transition shadow-sm"
                  >
                    <ArrowRight className="w-5 h-5 rotate-180" />
                  </button>
                  <div>
                    <h2 className="text-2xl font-bold serif text-slate-900">Investment Detail</h2>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-black">Opportunity ID: #{selectedOpp.id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleToggleWaitlist(selectedOpp.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl border transition shadow-sm text-xs font-black uppercase tracking-widest ${
                    waitlistIds.includes(selectedOpp.id)
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-400 border-slate-100 hover:text-emerald-600'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${waitlistIds.includes(selectedOpp.id) ? 'fill-current' : ''}`} />
                  {waitlistIds.includes(selectedOpp.id) ? 'In Waitlist' : 'Add to Waitlist'}
                </button>
              </div>

              <div className="bg-white rounded-[3rem] overflow-hidden shadow-sm border border-slate-100">
                <div className="grid lg:grid-cols-2">
                  <div className="relative h-64 lg:h-auto">
                    <img src={selectedOpp.imageUrl} className="w-full h-full object-cover" alt="" />
                    <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold tracking-wider uppercase">{selectedOpp.location}</span>
                      </div>
                      <h3 className="text-3xl font-bold serif leading-tight">{selectedOpp.title}</h3>
                    </div>
                  </div>
                  <div className="p-8 sm:p-12 space-y-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-black uppercase tracking-widest">{selectedOpp.type}</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-[10px] font-black uppercase tracking-widest">{selectedOpp.assetClass || 'Institutional'}</span>
                      </div>
                      <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getRiskColor(selectedOpp.riskLevel)}`}>
                        {selectedOpp.riskLevel} Risk
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Amount</p>
                        <p className="text-2xl font-bold text-slate-900">${(selectedOpp.targetAmount ?? 0).toLocaleString()}</p>
                      </div>
                      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Expected ROI</p>
                        <p className="text-2xl font-bold text-emerald-600">{selectedOpp.expectedROI}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-emerald-600" />
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Investment Summary</h4>
                      </div>
                      <p className="text-slate-600 leading-relaxed text-sm">{selectedOpp.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                        <Calendar className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Holding Period</p>
                          <p className="text-xs font-bold text-slate-900">{selectedOpp.holdingPeriod || '5-7 Years'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                        <CreditCard className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Payout Frequency</p>
                          <p className="text-xs font-bold text-slate-900">{selectedOpp.payoutFrequency || 'Quarterly'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-slate-100">
                      <div className="flex flex-col sm:flex-row justify-between items-end gap-6">
                        <div className="w-full sm:w-auto space-y-3">
                          <div>
                            <div className="flex justify-between items-end mb-1">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Investment Amount</p>
                              <span className={`text-[9px] font-bold uppercase tracking-wider ${
                                (selectedOpp.targetAmount - selectedOpp.raisedAmount) < 1000 ? 'text-rose-500 animate-pulse' : 'text-slate-400'
                              }`}>
                                Available: ${((selectedOpp.targetAmount ?? 0) - (selectedOpp.raisedAmount ?? 0)).toLocaleString()}
                              </span>
                            </div>
                            <div className="relative">
                              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <input 
                                type="number" 
                                disabled={selectedOpp.raisedAmount >= selectedOpp.targetAmount}
                                min={selectedOpp.minInvestment}
                                max={selectedOpp.targetAmount - selectedOpp.raisedAmount}
                                className={`w-full sm:w-48 pl-10 pr-4 py-3 bg-slate-50 border rounded-xl font-bold text-lg outline-none transition-all disabled:opacity-50 ${
                                  investAmount > (selectedOpp.targetAmount - selectedOpp.raisedAmount)
                                    ? 'border-rose-500 ring-2 ring-rose-500/10 text-rose-600'
                                    : 'border-slate-200 focus:ring-2 focus:ring-emerald-500/20'
                                }`}
                                value={investAmount}
                                onChange={(e) => setInvestAmount(Number(e.target.value))}
                              />
                            </div>
                          </div>
                          {investAmount > (selectedOpp.targetAmount - selectedOpp.raisedAmount) ? (
                            <p className="text-[10px] text-rose-500 font-bold flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              Remaining available amount to ${ ((selectedOpp.targetAmount ?? 0) - (selectedOpp.raisedAmount ?? 0)).toLocaleString() }
                            </p>
                          ) : (
                            <p className="text-[10px] text-slate-400 font-bold">Min. Entry: ${(selectedOpp.minInvestment ?? 0).toLocaleString()}</p>
                          )}
                        </div>
                        <button 
                          disabled={selectedOpp.raisedAmount >= selectedOpp.targetAmount || investAmount > (selectedOpp.targetAmount - selectedOpp.raisedAmount) || investAmount < selectedOpp.minInvestment}
                          onClick={() => {
                            if (selectedOpp.raisedAmount < selectedOpp.targetAmount && investAmount <= (selectedOpp.targetAmount - selectedOpp.raisedAmount)) {
                              if (currentUser?.kycStatus !== 'Verified') {
                                onInvest(selectedOpp, investAmount);
                                return;
                              }
                              onInvest(selectedOpp, investAmount);
                              setShowConfirmation({ show: true, opp: selectedOpp.title, amount: investAmount });
                              setSelectedOpp(null);
                            }
                          }}
                          className={`w-full sm:w-auto px-12 py-5 rounded-3xl font-black uppercase text-xs tracking-widest transition shadow-2xl flex items-center justify-center gap-2 ${
                            selectedOpp.raisedAmount >= selectedOpp.targetAmount || investAmount > (selectedOpp.targetAmount - selectedOpp.raisedAmount) || investAmount < selectedOpp.minInvestment
                              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                              : currentUser?.kycStatus !== 'Verified'
                                ? 'bg-amber-600 text-white hover:bg-amber-700'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200'
                          }`}
                        >
                          {selectedOpp.raisedAmount >= selectedOpp.targetAmount 
                            ? 'Sold Out' 
                            : currentUser?.kycStatus !== 'Verified' 
                              ? 'Verify KYC' 
                              : 'Invest Easily'} 
                          {selectedOpp.raisedAmount < selectedOpp.targetAmount && (currentUser?.kycStatus !== 'Verified' ? <Lock className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />)}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Media & Documents */}
              {(selectedOpp.videoUrl || selectedOpp.pdfUrl) && (
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
                  <div className="flex items-center gap-2">
                    <Play className="w-5 h-5 text-emerald-600" />
                    <h4 className="text-lg font-bold serif text-slate-900">Media & Documents</h4>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    {selectedOpp.videoUrl && (
                      <div className="relative aspect-video bg-slate-100 rounded-[2rem] overflow-hidden shadow-lg">
                        <iframe 
                          src={selectedOpp.videoUrl.includes('youtube.com') ? selectedOpp.videoUrl.replace('watch?v=', 'embed/') : selectedOpp.videoUrl} 
                          className="w-full h-full border-0"
                          allowFullScreen
                          title="Opportunity Video"
                        />
                      </div>
                    )}
                    {selectedOpp.pdfUrl && (
                      <div className="space-y-4">
                        <p className="text-sm text-slate-500 leading-relaxed">Download the full investment prospectus and legal documentation for this opportunity.</p>
                        <a 
                          href={selectedOpp.pdfUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-[2rem] hover:bg-slate-100 transition group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                              <FileText className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">Investment Prospectus</p>
                              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">PDF Document • 4.2 MB</p>
                            </div>
                          </div>
                          <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* AI Insights Section */}
              <div className="bg-slate-900 p-10 rounded-[3rem] text-white space-y-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold serif">Gemini AI Analysis</h3>
                </div>
                {loadingAI ? (
                  <div className="grid md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse" />
                    ))}
                  </div>
                ) : aiAnalysis && (
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Risk Assessment</p>
                      <p className="text-sm text-slate-300 leading-relaxed">{aiAnalysis.riskAnalysis}</p>
                    </div>
                    <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Market Potential</p>
                      <p className="text-sm text-slate-300 leading-relaxed">{aiAnalysis.marketPotential}</p>
                    </div>
                    <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-amber-400">Strategic Fit</p>
                      <p className="text-sm text-slate-300 leading-relaxed">{aiAnalysis.strategicFit}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'notifications' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900 serif">Notifications</h2>
                      <p className="text-sm text-slate-500">Stay updated with your account activity and new opportunities.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                        <input 
                          type="text"
                          placeholder="Search notifications..."
                          className="pl-8 pr-4 py-2 bg-white border border-slate-100 rounded-lg text-[10px] font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 w-48"
                          value={notificationSearch}
                          onChange={(e) => setNotificationSearch(e.target.value)}
                        />
                      </div>
                      <select 
                        className="px-3 py-2 bg-white border border-slate-100 rounded-lg text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-emerald-500/20"
                        value={notificationTypeFilter}
                        onChange={(e) => setNotificationTypeFilter(e.target.value)}
                      >
                        <option value="All">All Types</option>
                        <option value="KYC">KYC</option>
                        <option value="Return">Returns</option>
                        <option value="Investment">Investments</option>
                        <option value="New Opportunity">Opportunities</option>
                        <option value="Other">Other</option>
                      </select>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                          {filteredNotifications.length} Total
                        </span>
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                          {filteredNotifications.filter(n => !n.read).length} Unread
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    {paginatedNotifications.length > 0 ? (
                      <div className="divide-y divide-slate-50">
                        {paginatedNotifications.map((notification, index) => (
                          <div 
                            key={`notification-${notification.id}-${index}`} 
                            className={`p-6 sm:p-8 flex flex-col sm:flex-row gap-4 sm:gap-6 transition-all cursor-pointer ${!notification.read ? 'bg-emerald-50/30' : 'hover:bg-slate-50'}`}
                            onClick={() => {
                              if (notification.actionUrl) {
                                const url = new URL(notification.actionUrl, window.location.origin);
                                const assetId = url.searchParams.get('assetId');
                                if (assetId) {
                                  onNavigate('opportunity-detail', assetId);
                                  if (!notification.read) onMarkNotificationRead(notification.id);
                                  return;
                                }
                              }
                              setSelectedNotification(notification);
                              if (!notification.read) onMarkNotificationRead(notification.id);
                            }}
                          >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                              notification.type === 'KYC' && notification.message.toLowerCase().includes('rejected') ? 'bg-rose-100 text-rose-600' :
                              notification.type === 'KYC' ? 'bg-blue-100 text-blue-600' :
                              notification.type === 'Return' ? 'bg-emerald-100 text-emerald-600' :
                              notification.type === 'Investment' ? 'bg-purple-100 text-purple-600' :
                              notification.type === 'New Opportunity' ? 'bg-amber-100 text-amber-600' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              {notification.type === 'KYC' && notification.message.toLowerCase().includes('rejected') ? <AlertCircle className="w-6 h-6" /> :
                               notification.type === 'KYC' ? <Shield className="w-6 h-6" /> :
                               notification.type === 'Return' ? <DollarSign className="w-6 h-6" /> :
                               notification.type === 'Investment' ? <TrendingUp className="w-6 h-6" /> :
                               notification.type === 'New Opportunity' ? <Globe className="w-6 h-6" /> :
                               <Bell className="w-6 h-6" />}
                            </div>
                            <div className="flex-grow space-y-2">
                              <div className="flex justify-between items-start gap-4">
                                <div>
                                  <h4 className={`text-base font-bold ${notification.type === 'KYC' && notification.message.toLowerCase().includes('rejected') ? 'text-rose-600' : !notification.read ? 'text-slate-900' : 'text-slate-600'}`}>
                                    {notification.title}
                                  </h4>
                                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                    {notification.type} • {new Date(notification.date).toLocaleDateString()} {new Date(notification.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                                {(notification.read === false || (notification.type === 'KYC' && notification.message.toLowerCase().includes('rejected'))) && (
                                  <div className={`w-2 h-2 ${notification.type === 'KYC' && notification.message.toLowerCase().includes('rejected') ? 'bg-rose-500' : 'bg-emerald-500'} rounded-full shrink-0 mt-2`} />
                                )}
                              </div>
                              <div className="max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                                <p className={`text-sm leading-relaxed max-w-2xl whitespace-pre-wrap ${notification.type === 'KYC' && notification.message.toLowerCase().includes('rejected') ? 'text-rose-500 font-bold' : 'text-slate-500'}`}>
                                  {notification.message}
                                </p>
                              </div>
                              {notification.actionUrl && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const url = new URL(notification.actionUrl!, window.location.origin);
                                    const tab = url.searchParams.get('tab') as DashboardTab;
                                    const assetId = url.searchParams.get('assetId');
                                    
                                    if (assetId) {
                                      onNavigate('opportunity-detail', assetId);
                                    } else if (tab) {
                                      onTabChange(tab);
                                    }
                                  }}
                                  className="flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-widest hover:underline pt-2"
                                >
                                  View Details <ArrowRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-20 text-center space-y-4">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                          <Bell className="w-10 h-10" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-slate-900 serif">No notifications found</p>
                          <p className="text-sm text-slate-500">Try adjusting your search or filters.</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {totalNotificationPages > 1 && (
                    <div className="flex items-center justify-between pt-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Page {notificationPage} of {totalNotificationPages}
                      </p>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setNotificationPage(prev => Math.max(1, prev - 1))}
                          disabled={notificationPage === 1}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            notificationPage === 1 
                              ? 'bg-slate-50 text-slate-300 cursor-not-allowed' 
                              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          Previous Page
                        </button>
                        <button 
                          onClick={() => setNotificationPage(prev => Math.min(totalNotificationPages, prev + 1))}
                          disabled={notificationPage === totalNotificationPages}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            notificationPage === totalNotificationPages 
                              ? 'bg-slate-50 text-slate-300 cursor-not-allowed' 
                              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          Next Page
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'dashboard' && (
            <div className="space-y-8 sm:space-y-10 animate-in fade-in duration-500">
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 serif">Investor Dashboard</h1>
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    <p className="text-sm sm:text-base text-slate-500">Asset performance overview and capital allocation.</p>
                    {currentUser && (
                      <div className="flex items-center gap-2 px-2.5 py-1 bg-white border border-slate-100 rounded-full shadow-sm shrink-0">
                        {currentUser.kycStatus === 'Verified' ? (
                          <CheckCircle className="w-3 h-3 text-emerald-500" />
                        ) : currentUser.kycStatus === 'Pending' ? (
                          <Clock className="w-3 h-3 text-amber-500" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 text-rose-500" />
                        )}
                        <span className={`text-[8px] font-black uppercase tracking-widest ${
                          currentUser.kycStatus === 'Verified' ? 'text-emerald-600' : 
                          currentUser.kycStatus === 'Pending' ? 'text-amber-600' : 'text-rose-600'
                        }`}>
                          KYC {currentUser.kycStatus}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex w-full sm:w-auto gap-3">
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className={`p-2.5 border rounded-xl transition flex items-center gap-2 ${showFilters ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white border-slate-200 text-slate-400 hover:text-emerald-600'}`}
                    title="Toggle Filters"
                  >
                    <Filter className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => { setTourStep(0); setShowTour(true); }}
                    className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-600 transition flex items-center gap-2"
                    title="Quick Demo"
                  >
                    <HelpCircle className="w-5 h-5" />
                    <span className="hidden lg:inline text-[10px] font-black uppercase tracking-widest">Demo</span>
                  </button>
                  <button 
                    onClick={() => onTabChange('notifications')}
                    className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-600 transition relative"
                  >
                    <Bell className="w-5 h-5" />
                    {currentUser?.notifications?.some(n => !n.read) && (
                      <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full" />
                    )}
                  </button>
                  <button 
                    onClick={() => setShowWithdrawModal(true)}
                    className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition text-sm"
                  >
                    <ArrowUpRight className="w-4 h-4" /> Withdraw
                  </button>
                  <button 
                    onClick={() => onTabChange('payments')}
                    className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-600 transition text-sm"
                  >
                    <CreditCard className="w-4 h-4" /> Add Funds
                  </button>
                </div>
              </div>

              {/* Filters & Stats Grid */}
              <div className="space-y-6">
                {showFilters && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-2xl border border-slate-100"
                  >
                    <div className="flex flex-wrap gap-4 items-end">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">From Date</label>
                        <input 
                          type="date" 
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                          value={dashboardStartDate}
                          onChange={(e) => setDashboardStartDate(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">To Date</label>
                        <input 
                          type="date" 
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                          value={dashboardEndDate}
                          onChange={(e) => setDashboardEndDate(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Month</label>
                        <select 
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                          value={dashboardMonth}
                          onChange={(e) => setDashboardMonth(e.target.value)}
                        >
                          <option value="All">All Months</option>
                          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => (
                            <option key={i} value={i}>{m}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Year</label>
                        <select 
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                          value={dashboardYear}
                          onChange={(e) => setDashboardYear(e.target.value)}
                        >
                          <option value="All">All Years</option>
                          {availableYears.map(y => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assets</label>
                        <select 
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                          value={dashboardAsset}
                          onChange={(e) => setDashboardAsset(e.target.value)}
                        >
                          <option value="All">All Assets</option>
                          {uniqueAssets.map(a => (
                            <option key={a} value={a}>{a}</option>
                          ))}
                        </select>
                      </div>
                      <button 
                        onClick={() => {
                          setDashboardStartDate('');
                          setDashboardEndDate('');
                          setDashboardMonth('All');
                          setDashboardYear('All');
                          setDashboardAsset('All');
                        }}
                        className="px-6 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition"
                      >
                        Reset
                      </button>
                    </div>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Portfolio Value</p>
                    <p className="text-2xl font-black text-slate-900">${(dashboardMetrics.totalInvestment ?? 0).toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">Total Investment</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Overall Gain</p>
                    <p className="text-2xl font-black text-emerald-600">${(dashboardMetrics.overallGain ?? 0).toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">Total Profit from Returns</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">This Month Revenue Gain</p>
                    <p className="text-2xl font-black text-blue-600">${(dashboardMetrics.thisMonthReturns ?? 0).toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">Returns for particular Month</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">This Year Revenue Gain</p>
                    <p className="text-2xl font-black text-indigo-600">${(dashboardMetrics.thisYearReturns ?? 0).toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">Returns for particular Year</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Rent Gain This Month</p>
                    <p className="text-2xl font-black text-amber-600">${(dashboardMetrics.rentMonthReturns ?? 0).toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">Rental Income particular Month</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Rent Gain This Year</p>
                    <p className="text-2xl font-black text-orange-600">${(dashboardMetrics.totalRentYearReturns ?? 0).toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">Total Rental Income (Monthly + Yearly)</p>
                  </div>
                </div>
              </div>

                <div className="grid lg:grid-cols-3 gap-8 sm:gap-10">
                <div className="lg:col-span-2 space-y-8 sm:space-y-10">
                  {/* Investment Portfolios */}
                  <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold serif">Investment Portfolios</h3>
                      <button onClick={() => onTabChange('history')} className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:underline">View All</button>
                    </div>
                    {userInvestments.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userInvestments.slice(0, 4).map((inv) => {
                          const opp = opportunities.find(o => o.id === inv.opportunityId);
                          const progress = opp ? Math.round((opp.raisedAmount / opp.targetAmount) * 100) : 0;
                          return (
                            <div 
                              key={inv.id} 
                              onClick={() => opp && handleSelectOpp(opp)}
                              className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all group cursor-pointer flex flex-col justify-between"
                            >
                              <div className="flex items-center justify-between gap-3 mb-3">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-8 h-8 shrink-0 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                                    <Landmark className="w-4 h-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold text-slate-900 truncate">{inv.opportunityTitle}</p>
                                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest truncate">{inv.type}</p>
                                  </div>
                                </div>
                                <div className="text-right shrink-0 flex flex-col items-end">
                                  <div className="flex items-center gap-2">
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleWaitlist(inv.opportunityId);
                                      }}
                                      className={`p-1 transition-colors ${
                                        waitlistIds.includes(inv.opportunityId) 
                                          ? 'text-emerald-600' 
                                          : 'text-slate-400 hover:text-emerald-600'
                                      }`}
                                      title={waitlistIds.includes(inv.opportunityId) ? "Remove from Waitlist" : "Add to Waitlist"}
                                    >
                                      <Bookmark className={`w-3 h-3 ${waitlistIds.includes(inv.opportunityId) ? 'fill-current' : ''}`} />
                                    </button>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDownloadCertificate(inv.id);
                                      }}
                                      className="p-1 text-slate-400 hover:text-emerald-600 transition"
                                      title="Download Certificate"
                                    >
                                      <Download className="w-3 h-3" />
                                    </button>
                                    <p className="text-xs font-black text-slate-900">${(inv.amount ?? 0).toLocaleString()}</p>
                                  </div>
                                  <p className="text-[9px] text-emerald-500 font-bold">Active</p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between gap-2 mb-3">
                                <div className="flex flex-wrap gap-1.5">
                                  {(opp?.returnType === ReturnType.MONTHLY_RENT || opp?.returnType === ReturnType.YEARLY_RENT) && (
                                    <>
                                      {opp.rentAmount !== undefined && (
                                        <div className="flex items-center text-emerald-600 text-[7px] font-bold bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100/50">
                                          {formatCurrency(opp.rentAmount)}/{opp.returnType === ReturnType.MONTHLY_RENT ? 'mo' : 'yr'}
                                        </div>
                                      )}
                                    </>
                                  )}
                                  {opp?.expectedROI && (
                                    <div className="flex items-center text-blue-600 text-[7px] font-bold bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-100/50">
                                      {opp.expectedROI} ROI
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                  <span>{progress}%</span>
                                  <div className="w-12 bg-white h-1 rounded-full overflow-hidden border border-slate-100">
                                    <div 
                                      className="h-full bg-emerald-500 transition-all duration-1000" 
                                      style={{ width: `${progress}%` }} 
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <p className="text-sm text-slate-400 font-medium">No active investments yet.</p>
                      </div>
                    )}
                  </div>

                  {/* Financial Roadmap */}
                  <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Target className="w-5 h-5" /></div>
                      <h3 className="text-lg font-bold serif">Financial Roadmap</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between items-end mb-3">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Portfolio Completion</span>
                            <span className="text-xl font-black text-emerald-600">{goalProgress.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden border border-slate-100">
                            <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000" style={{ width: `${goalProgress}%` }} />
                          </div>
                          <p className="mt-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            ${(totalInvested ?? 0).toLocaleString()} / <span className="text-slate-900">${(investmentGoal?.targetValue ?? 0).toLocaleString()}</span> Target
                          </p>
                        </div>
                      </div>
                      <form onSubmit={handleUpdateGoal} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Value</label>
                            <input type="number" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" value={goalTargetValue} onChange={(e) => setGoalTargetValue(e.target.value)} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Date</label>
                            <div className="flex gap-2">
                              <input type="date" className="flex-grow px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" value={goalTargetDate} onChange={(e) => setGoalTargetDate(e.target.value)} />
                              <select 
                                className="px-2 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-emerald-500/20"
                                onChange={(e) => handleDurationChange(e.target.value)}
                                defaultValue=""
                              >
                                <option value="" disabled>Duration</option>
                                <option value="1 Month">1 Month</option>
                                <option value="6 Month">6 Month</option>
                                <option value="1.6 Years">1.6 Years</option>
                                <option value="2 Years">2 Years</option>
                                <option value="3 Years">3 Years</option>
                                <option value="4 Years">4 Years</option>
                                <option value="5 Years">5 Years</option>
                                <option value="6 Years">6 Years</option>
                                <option value="7 Years">7 Years</option>
                                <option value="8 Years">8 Years</option>
                                <option value="9 Years">9 Years</option>
                                <option value="10 Years">10 Years</option>
                                <option value="11 Years">11 Years</option>
                                <option value="12 Years">12 Years</option>
                                <option value="15 Years">15 Years</option>
                                <option value="20 Years">20 Years</option>
                                <option value="30 Years">30 Years</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <button type="submit" className="w-full py-3 bg-slate-900 text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition">Update Goal</button>
                      </form>
                    </div>
                  </div>

                  {/* Personalized Suggestions */}
                  {goalInsights.suggestions.length > 0 && (
                    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="text-lg font-bold serif">Personalized Suggestions</h3>
                          <p className="text-xs text-slate-500">Curated opportunities to help you bridge your ${(goalInsights?.needed ?? 0).toLocaleString()} gap.</p>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">AI Optimized</span>
                        </div>
                      </div>

                      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2 snap-x">
                        {goalInsights.suggestions.map(opp => (
                          <motion.div
                            key={`suggested-${opp.id}`}
                            whileHover={{ y: -6, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setSelectedOpp(opp);
                              // Scroll to allocation section
                              const allocationSection = document.getElementById('allocation-section');
                              if (allocationSection) {
                                allocationSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              }
                            }}
                            role="button"
                            tabIndex={0}
                            className="flex-shrink-0 w-[260px] bg-slate-50/50 p-5 rounded-[32px] border border-slate-100 text-left snap-start group transition-all duration-300 hover:bg-white hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 cursor-pointer"
                          >
                            <div className="h-32 w-full rounded-2xl overflow-hidden mb-4 relative">
                               <img src={opp.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                               <div className="absolute top-2 right-2 flex gap-1.5">
                                 <button 
                                   onClick={(e) => {
                                     e.stopPropagation();
                                     handleToggleWaitlist(opp.id);
                                   }}
                                   className={`p-1.5 backdrop-blur rounded-lg shadow-sm border transition-colors ${
                                     waitlistIds.includes(opp.id) 
                                       ? 'bg-emerald-600 text-white border-emerald-600' 
                                       : 'bg-white/90 text-slate-500 hover:text-emerald-600 border-slate-100'
                                   }`}
                                 >
                                   <Bookmark className={`w-2.5 h-2.5 ${waitlistIds.includes(opp.id) ? 'fill-current' : ''}`} />
                                 </button>
                                 <div className="bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest text-emerald-600 border border-slate-100">
                                    {opp.expectedROI} ROI
                                 </div>
                               </div>
                            </div>
                            
                            <div className="space-y-3">
                               <div className="flex items-center justify-between">
                                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{opp.type}</span>
                                  <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-600">
                                     <Zap className="w-3 h-3 fill-emerald-600" /> High ROI
                                  </div>
                               </div>
                               <h5 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">{opp.title}</h5>
                               
                               <div className="flex items-center justify-between pt-1">
                                  <div className="flex items-center gap-1.5">
                                     <MapPin className="w-3 h-3 text-slate-400" />
                                     <span className="text-[10px] text-slate-500 font-medium">{opp.location}</span>
                                  </div>
                                  <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 transition-all duration-300 transform group-hover:rotate-45">
                                     <ArrowUpRight className="w-4 h-4" />
                                  </div>
                               </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Market Opportunities */}
                  <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                      <h3 className="text-lg font-bold serif">Market Opportunities</h3>
                      <select className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-emerald-500/20" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                         <option value="All">All Sectors</option>
                         {Object.values(InvestmentType).map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {filteredOpps.map((opp) => {
                        const isFull = opp.raisedAmount >= opp.targetAmount;
                        return (
                            <div 
                              key={opp.id} 
                              onClick={() => !isFull && handleSelectOpp(opp)} 
                              className={`group cursor-pointer rounded-2xl overflow-hidden border transition-all duration-300 p-3 relative flex gap-4 ${
                                isFull 
                                  ? 'border-slate-200 bg-slate-50 opacity-80 cursor-not-allowed' 
                                  : selectedOpp?.id === opp.id 
                                    ? 'border-emerald-500 bg-emerald-50/30' 
                                    : 'border-slate-100 hover:border-emerald-200 bg-slate-50/30'
                              }`}
                            >
                              {isFull && (
                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/5 backdrop-blur-[1px] rounded-2xl">
                                  <div className="bg-slate-900 text-white px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-xl">
                                    Full Raise Fund
                                  </div>
                                </div>
                              )}
                              <div className="w-24 h-24 shrink-0 overflow-hidden relative rounded-xl">
                                <img src={opp.imageUrl} className={`w-full h-full object-cover transition duration-500 ${isFull ? 'grayscale' : 'grayscale group-hover:grayscale-0'}`} alt="" />
                                <div className="absolute top-1 right-1 bg-white/90 backdrop-blur px-1.5 py-0.5 rounded-md text-[7px] font-black uppercase tracking-widest text-emerald-600 border border-slate-100">
                                  {opp.expectedROI}
                                </div>
                              </div>
                              
                              <div className="flex-grow min-w-0 flex flex-col justify-between py-0.5">
                                <div className="space-y-1">
                                  <div className="flex justify-between items-start gap-2">
                                    <p className="font-bold text-slate-900 text-sm truncate">{opp.title}</p>
                                    <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
                                      <button 
                                        onClick={() => setShowShareMenu(showShareMenu === opp.id ? null : opp.id)}
                                        className="p-1.5 bg-white border border-slate-100 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors"
                                      >
                                        <Share2 className="w-3 h-3" />
                                      </button>
                                      {showShareMenu === opp.id && (
                                        <div className="absolute top-full right-0 mt-1 bg-white shadow-2xl rounded-xl p-2 border border-slate-100 min-w-[140px] z-50 animate-in fade-in zoom-in-95 space-y-0.5">
                                          <button onClick={() => handleShare(opp, 'facebook')} className="w-full flex items-center gap-2 p-1.5 text-[9px] font-bold text-slate-700 hover:bg-slate-50 rounded-md transition-colors">
                                            <Facebook className="w-2.5 h-2.5 text-[#1877F2]" /> Facebook
                                          </button>
                                          <button onClick={() => handleShare(opp, 'instagram')} className="w-full flex items-center gap-2 p-1.5 text-[9px] font-bold text-slate-700 hover:bg-slate-50 rounded-md transition-colors">
                                            <Instagram className="w-2.5 h-2.5 text-[#E4405F]" /> Instagram
                                          </button>
                                          <button onClick={() => handleShare(opp, 'twitter')} className="w-full flex items-center gap-2 p-1.5 text-[9px] font-bold text-slate-700 hover:bg-slate-50 rounded-md transition-colors">
                                            <Twitter className="w-2.5 h-2.5 text-slate-900" /> X
                                          </button>
                                          <button onClick={() => handleShare(opp, 'linkedin')} className="w-full flex items-center gap-2 p-1.5 text-[9px] font-bold text-slate-700 hover:bg-slate-50 rounded-md transition-colors">
                                            <Linkedin className="w-2.5 h-2.5 text-[#0A66C2]" /> LinkedIn
                                          </button>
                                          <button onClick={() => handleShare(opp, 'whatsapp')} className="w-full flex items-center gap-2 p-1.5 text-[9px] font-bold text-slate-700 hover:bg-slate-50 rounded-md transition-colors">
                                            <MessageCircle className="w-2.5 h-2.5 text-[#25D366]" /> WhatsApp
                                          </button>
                                          <div className="h-px bg-slate-100 my-0.5" />
                                          <button onClick={() => handleShare(opp, 'copy')} className="w-full flex items-center gap-2 p-1.5 text-[9px] font-black text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors">
                                            <Copy className="w-2.5 h-2.5" /> Copy
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400">
                                    <span className="bg-slate-100 px-1.5 py-0.5 rounded uppercase tracking-widest">{opp.type}</span>
                                    <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5" /> {opp.location}</span>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between items-end">
                                    <div className="flex gap-2">
                                      {opp.rentAmount !== undefined && (
                                        <div className="text-[9px] font-black text-emerald-600">
                                          {formatCurrency(opp.rentAmount)}/{opp.returnType === ReturnType.MONTHLY_RENT ? 'mo' : 'yr'}
                                        </div>
                                      )}
                                      {opp.rentPercentage !== undefined && (
                                        <div className="text-[9px] font-black text-blue-600">
                                          {opp.rentPercentage}% Yield
                                        </div>
                                      )}
                                    </div>
                                    <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                      {Math.min(100, Math.round((opp.raisedAmount / opp.targetAmount) * 100))}% Raised
                                    </div>
                                  </div>
                                  <div className="w-full bg-white h-1 rounded-full overflow-hidden border border-slate-100">
                                    <div 
                                      className={`h-full transition-all duration-1000 ${isFull ? 'bg-slate-400' : 'bg-emerald-500'}`} 
                                      style={{ width: `${Math.min(100, (opp.raisedAmount / opp.targetAmount) * 100)}%` }} 
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div id="allocation-section" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 sticky top-10">
                     {selectedOpp ? (
                       <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
                          <div className="space-y-2">
                             <h3 
                               onClick={() => handleSelectOpp(selectedOpp)}
                               className="text-2xl font-bold serif text-slate-900 leading-tight cursor-pointer hover:text-emerald-600 transition-colors"
                             >
                               {selectedOpp.title}
                             </h3>
                             <div className="flex items-center gap-2">
                               <TrendingUp className="w-4 h-4 text-emerald-600" />
                               <p className="text-emerald-600 font-black text-lg">{selectedOpp.expectedROI} Return</p>
                             </div>
                          </div>

                          <div className="space-y-4">
                             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                               <Zap className="w-4 h-4 text-amber-500" /> AI Insights
                             </h4>
                             {loadingAI ? (
                               <div className="space-y-2">
                                 <div className="h-20 bg-slate-50 rounded-xl animate-pulse" />
                                 <div className="h-8 bg-slate-50 rounded-lg animate-pulse" />
                               </div>
                             ) : aiAnalysis ? (
                               <div className="space-y-4">
                                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                     <p className="text-xs text-slate-600 italic leading-relaxed">"{aiAnalysis.summary}"</p>
                                  </div>
                                  <div className={`p-3 rounded-lg border text-center font-black uppercase text-[8px] tracking-widest ${getRiskColor(aiAnalysis.riskLevel)}`}>
                                     Risk: {aiAnalysis.riskLevel}
                                  </div>
                               </div>
                             ) : null}
                          </div>

                          <button 
                            onClick={() => handleSelectOpp(selectedOpp)}
                            className="w-full py-3 rounded-xl font-bold text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all flex items-center justify-center gap-2 mb-4"
                          >
                            View Full Details
                            <ExternalLink className="w-4 h-4" />
                          </button>

                          <div className="bg-slate-900 p-6 rounded-2xl text-white space-y-6">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Allocation Amount</label>
                                <div className="relative">
                                  <DollarSign className="absolute left-0 top-1/2 -translate-y-1/2 text-emerald-500 w-6 h-6" />
                                  <input type="number" className="w-full bg-transparent border-b border-white/10 focus:border-emerald-500 transition-colors py-2 pl-8 text-2xl font-black outline-none" value={investAmount} onChange={e => setInvestAmount(Number(e.target.value))} />
                                </div>
                             </div>
                             <button 
                               onClick={handleConfirmInvestment} 
                               className={`w-full py-4 rounded-xl font-black text-base transition-all active:scale-95 flex items-center justify-center gap-2 ${
                                 currentUser?.kycStatus !== 'Verified'
                                   ? 'bg-amber-600 text-white hover:bg-amber-700'
                                   : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-100'
                               }`}
                             >
                               {currentUser?.kycStatus !== 'Verified' ? 'Verify KYC' : 'Confirm Allocation'}
                               {currentUser?.kycStatus !== 'Verified' && <Lock className="w-5 h-5" />}
                             </button>
                             <p className="text-[8px] text-slate-500 text-center italic">Institutional-grade custody included.</p>
                          </div>
                       </div>
                     ) : (
                       <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                         <div className="text-center space-y-2">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 text-slate-300 mb-2">
                               <Activity className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 serif">Portfolio Allocation</h3>
                            <p className="text-xs text-slate-500 max-w-[200px] mx-auto">Select an offering to initiate allocation or explore suggestions below.</p>
                         </div>

                         <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Investments</p>
                               <p className="text-xl font-black text-slate-900">{goalInsights.totalInvestmentsCount}</p>
                            </div>
                            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                               <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Goal Gap</p>
                               <p className="text-xl font-black text-emerald-700">${(goalInsights?.needed ?? 0).toLocaleString()}</p>
                            </div>
                         </div>

                         <div className="space-y-6 p-5 rounded-[32px] bg-slate-50/50 border border-slate-100/50 backdrop-blur-sm">
                            <div className="flex items-center justify-between px-1">
                               <div className="space-y-1">
                                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Suggested for your Goal</h4>
                                  <p className="text-[9px] text-slate-500 font-medium">Based on your target of ${(investmentGoal?.targetValue ?? 0).toLocaleString()}</p>
                               </div>
                               <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100/50 px-2.5 py-1 rounded-full border border-emerald-200/50">High ROI</span>
                            </div>
                            
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1 snap-x">
                               {goalInsights.suggestions.map(opp => (
                                 <motion.div
                                   key={opp.id}
                                   whileHover={{ y: -6, scale: 1.02 }}
                                   whileTap={{ scale: 0.98 }}
                                   onClick={() => handleSelectOpp(opp)}
                                   role="button"
                                   tabIndex={0}
                                   className="flex-shrink-0 w-[220px] bg-white p-5 rounded-3xl border border-slate-100 shadow-sm text-left snap-start group transition-all duration-300 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 cursor-pointer"
                                 >
                                   <div className="flex items-center justify-between mb-4">
                                      <div className="p-2.5 bg-slate-50 rounded-2xl group-hover:bg-emerald-50 transition-colors duration-300">
                                         <TrendingUp className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
                                      </div>
                                      <div className="text-right">
                                         <span className="block text-xs font-black text-emerald-600 leading-none">{opp.expectedROI}</span>
                                         <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">ROI Target</span>
                                      </div>
                                   </div>
                                   
                                   <div className="space-y-3">
                                      <h5 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">{opp.title}</h5>
                                      
                                      <div className="flex items-center justify-between">
                                         <div className="flex items-center gap-1.5">
                                            <div className="w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center">
                                               <MapPin className="w-3 h-3 text-slate-400" />
                                            </div>
                                            <span className="text-[10px] text-slate-500 font-medium">{opp.location}</span>
                                         </div>
                                         
                                         <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 transform group-hover:rotate-45">
                                            <ArrowUpRight className="w-4 h-4" />
                                         </div>
                                      </div>
                                   </div>
                                 </motion.div>
                               ))}
                            </div>
                         </div>
                       </div>
                     )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="space-y-8 sm:space-y-10 animate-in fade-in duration-500">
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 serif">In-Depth Data Analysis</h1>
                  <p className="text-sm sm:text-base text-slate-500 mt-1">Complete portfolio insights and detailed performance data.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button 
                    onClick={() => setShowAnalysisExportModal(true)}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition text-sm shadow-xl shadow-emerald-100"
                  >
                    <Download className="w-4 h-4" /> Export Analysis PDF
                  </button>
                  <button 
                    onClick={() => setShowAnalysisFilters(!showAnalysisFilters)}
                    className={`p-3 rounded-xl border transition-all ${showAnalysisFilters ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white border-slate-100 text-slate-400 hover:text-slate-600 shadow-sm'}`}
                    title="Toggle Filters"
                  >
                    <Filter className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Analysis Filters */}
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search assets, partners, locations..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                    value={analysisSearch}
                    onChange={(e) => setAnalysisSearch(e.target.value)}
                  />
                </div>

                {showAnalysisFilters && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 pt-6 border-t border-slate-50"
                  >
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date Range</label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="date" 
                          className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                          value={analysisStartDate}
                          onChange={(e) => setAnalysisStartDate(e.target.value)}
                        />
                        <span className="text-slate-300">-</span>
                        <input 
                          type="date" 
                          className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                          value={analysisEndDate}
                          onChange={(e) => setAnalysisEndDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Month</label>
                      <select 
                        className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                        value={analysisMonth}
                        onChange={(e) => setAnalysisMonth(e.target.value)}
                      >
                        <option value="All">All Months</option>
                        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m, i) => (
                          <option key={m} value={i}>{m}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Year</label>
                      <select 
                        className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                        value={analysisYear}
                        onChange={(e) => setAnalysisYear(e.target.value)}
                      >
                        <option value="All">All Years</option>
                        {availableYears.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset</label>
                      <select 
                        className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                        value={analysisAssetFilter}
                        onChange={(e) => setAnalysisAssetFilter(e.target.value)}
                      >
                        <option value="All">All Assets</option>
                        {uniqueAssets.map(asset => (
                          <option key={asset} value={asset}>{asset}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Partner</label>
                      <select 
                        className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                        value={analysisPartnerFilter}
                        onChange={(e) => setAnalysisPartnerFilter(e.target.value)}
                      >
                        <option value="All">All Partners</option>
                        {Array.from(new Set(opportunities.map(o => o.partnerName))).map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
                      <select 
                        className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                        value={analysisLocationFilter}
                        onChange={(e) => setAnalysisLocationFilter(e.target.value)}
                      >
                        <option value="All">All Locations</option>
                        {Array.from(new Set(opportunities.map(o => o.location))).map(l => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Type</label>
                      <select 
                        className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                        value={analysisTypeFilter}
                        onChange={(e) => setAnalysisTypeFilter(e.target.value)}
                      >
                        <option value="All">All Types</option>
                        {Object.values(InvestmentType).map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Return Type</label>
                      <select 
                        className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                        value={analysisReturnTypeFilter}
                        onChange={(e) => setAnalysisReturnTypeFilter(e.target.value)}
                      >
                        <option value="All">All Returns</option>
                        {Object.values(ReturnType).map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Class</label>
                      <select 
                        className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                        value={analysisAssetClassFilter}
                        onChange={(e) => setAnalysisAssetClassFilter(e.target.value)}
                      >
                        <option value="All">All Classes</option>
                        {Array.from(new Set(opportunities.map(o => o.assetClass))).map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payout Cadence</label>
                      <select 
                        className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                        value={analysisPayoutFilter}
                        onChange={(e) => setAnalysisPayoutFilter(e.target.value)}
                      >
                        <option value="All">All Cadences</option>
                        {Array.from(new Set(opportunities.map(o => o.payoutFrequency))).map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-end lg:col-span-2 xl:col-span-1">
                      <button 
                        onClick={() => {
                          setAnalysisStartDate('');
                          setAnalysisEndDate('');
                          setAnalysisMonth('All');
                          setAnalysisYear('All');
                          setAnalysisAssetFilter('All');
                          setAnalysisPartnerFilter('All');
                          setAnalysisLocationFilter('All');
                          setAnalysisPayoutFilter('All');
                          setAnalysisReturnTypeFilter('All');
                          setAnalysisAssetClassFilter('All');
                          setAnalysisTypeFilter('All');
                          setAnalysisSearch('');
                        }}
                        className="w-full p-2 bg-slate-50 border border-slate-100 text-slate-400 rounded-xl hover:text-emerald-600 transition text-xs font-bold"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Analysis Metrics Cards */}
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                    <Wallet className="w-12 h-12 text-emerald-600" />
                  </div>
                  <div className="relative z-10 pr-12">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Total Portfolio Value</p>
                    <p className="text-3xl font-black text-slate-900">${(analysisMetrics.totalInvestment + analysisMetrics.overallGain).toLocaleString()}</p>
                    <div className="mt-4 space-y-1">
                      <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> ${analysisMetrics.totalInvestment.toLocaleString()} Capital Invested
                      </p>
                      <p className="text-xs font-bold text-slate-400 flex items-center gap-1">
                        <Activity className="w-3 h-3" /> {analysisMetrics.totalInvestmentsCount} Total Investments
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-12 h-12 text-blue-600" />
                  </div>
                  <div className="relative z-10 pr-12">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Overall Gain</p>
                    <p className="text-3xl font-black text-slate-900">${(analysisMetrics.overallGain ?? 0).toLocaleString()}</p>
                    <p className="mt-4 text-[10px] font-bold text-blue-600 flex items-center gap-1">
                      <Activity className="w-3 h-3" /> Total Profit from Returns
                    </p>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                    <Landmark className="w-12 h-12 text-amber-600" />
                  </div>
                  <div className="relative z-10 pr-12">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Rent Gain</p>
                    <p className="text-3xl font-black text-slate-900">${(analysisMetrics.rentGain ?? 0).toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                    <Award className="w-12 h-12 text-purple-600" />
                  </div>
                  <div className="relative z-10 pr-12">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Dividend Gain</p>
                    <p className="text-3xl font-black text-slate-900">${(analysisMetrics.dividendGain ?? 0).toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                    <PieChart className="w-12 h-12 text-rose-600" />
                  </div>
                  <div className="relative z-10 pr-12">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">ROI Gain</p>
                    <p className="text-3xl font-black text-slate-900">${(analysisMetrics.roiGain ?? 0).toLocaleString()}</p>
                    <p className="mt-4 text-[10px] font-bold text-rose-600 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> Profit from ROI Gain
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Monthly Rental Income Distributions Section */}
              <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-bold serif">Monthly Rental Income Distributions</h3>
                    <p className="text-slate-400 text-xs mt-1">Track your monthly payouts for rental assets</p>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl shadow-sm border border-slate-100">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                        {analysisMonth !== 'All' ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][parseInt(analysisMonth)] : 'All Months'} {analysisYear !== 'All' ? analysisYear : ''}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Name</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Payout Date</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {monthlyRentalDistributions.length > 0 ? (
                        monthlyRentalDistributions.map((dist) => (
                          <tr key={dist.id} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                                  <Landmark className="w-4 h-4 text-emerald-600" />
                                </div>
                                <span className="text-sm font-bold text-slate-700">{dist.investmentTitle}</span>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <span className="text-xs font-medium text-slate-500">
                                {new Date(dist.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            </td>
                            <td className="px-8 py-5 text-right">
                              <span className="text-sm font-black text-emerald-600">
                                ${(dist.amount ?? 0).toLocaleString()}
                              </span>
                            </td>
                            <td className="px-8 py-5 text-right">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                                <CheckCircle className="w-3 h-3" /> Received
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-8 py-20 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-slate-300" />
                              </div>
                              <p className="text-slate-400 text-sm font-medium">No rental distributions found for the selected period</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {monthlyRentalDistributions.length > 0 && (
                  <div className="p-6 bg-slate-50/50 border-t border-slate-50 flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Total Monthly Distribution
                    </span>
                    <span className="text-lg font-black text-emerald-600">
                      ${monthlyRentalDistributions.reduce((acc, curr) => acc + (curr.amount ?? 0), 0).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Data Table Section */}
              <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 space-y-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <h3 className="text-xl font-bold serif">Detailed Asset Performance</h3>
                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                      <div className="relative flex-grow lg:flex-grow-0 lg:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="text"
                          placeholder="Search asset, partner, location..."
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                          value={analysisSearch}
                          onChange={(e) => setAnalysisSearch(e.target.value)}
                        />
                      </div>
                      <button 
                        onClick={() => setShowAnalysisTableFilters(!showAnalysisTableFilters)}
                        className={`p-3 border rounded-xl transition flex items-center gap-2 ${showAnalysisTableFilters ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-emerald-600'}`}
                      >
                        <Filter className="w-5 h-5" />
                        <span className="text-xs font-bold hidden sm:inline">Filters</span>
                      </button>
                      <button 
                        onClick={() => {
                          setAnalysisSearch('');
                          setAnalysisAssetFilter('All');
                          setAnalysisPartnerFilter('All');
                          setAnalysisLocationFilter('All');
                          setAnalysisPayoutFilter('All');
                          setAnalysisReturnTypeFilter('All');
                          setAnalysisAssetClassFilter('All');
                          setAnalysisTypeFilter('All');
                          setAnalysisStartDate('');
                          setAnalysisEndDate('');
                        }}
                        className="p-3 bg-slate-50 border border-slate-100 text-slate-400 rounded-xl hover:text-emerald-600 transition"
                        title="Reset Filters"
                      >
                        <RefreshCw className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Advanced Filters */}
                  {showAnalysisTableFilters && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-50"
                    >
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Name</label>
                        <select 
                          className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                          value={analysisAssetFilter}
                          onChange={(e) => setAnalysisAssetFilter(e.target.value)}
                        >
                          <option value="All">All Assets</option>
                          {uniqueAssets.map(asset => (
                            <option key={asset} value={asset}>{asset}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Partner</label>
                        <select 
                          className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                          value={analysisPartnerFilter}
                          onChange={(e) => setAnalysisPartnerFilter(e.target.value)}
                        >
                          <option value="All">All Partners</option>
                          {Array.from(new Set(opportunities.map(o => o.partnerName))).map(partner => (
                            <option key={partner} value={partner}>{partner}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
                        <select 
                          className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                          value={analysisLocationFilter}
                          onChange={(e) => setAnalysisLocationFilter(e.target.value)}
                        >
                          <option value="All">All Locations</option>
                          {Array.from(new Set(opportunities.map(o => o.location))).map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date Range</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="date" 
                            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                            value={analysisStartDate}
                            onChange={(e) => setAnalysisStartDate(e.target.value)}
                          />
                          <span className="text-slate-300">-</span>
                          <input 
                            type="date" 
                            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                            value={analysisEndDate}
                            onChange={(e) => setAnalysisEndDate(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Second Row of Filters */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Type</label>
                        <select 
                          className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                          value={analysisTypeFilter}
                          onChange={(e) => setAnalysisTypeFilter(e.target.value)}
                        >
                          <option value="All">All Types</option>
                          {Object.values(InvestmentType).map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Return Type</label>
                        <select 
                          className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                          value={analysisReturnTypeFilter}
                          onChange={(e) => setAnalysisReturnTypeFilter(e.target.value)}
                        >
                          <option value="All">All Returns</option>
                          {Object.values(ReturnType).map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Class</label>
                        <select 
                          className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                          value={analysisAssetClassFilter}
                          onChange={(e) => setAnalysisAssetClassFilter(e.target.value)}
                        >
                          {uniqueAnalysisAssetClasses.map(v => <option key={v} value={v}>{v === 'All' ? 'All Classes' : v}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payout Cadence</label>
                        <select 
                          className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                          value={analysisPayoutFilter}
                          onChange={(e) => setAnalysisPayoutFilter(e.target.value)}
                        >
                          {uniqueAnalysisPayouts.map(v => <option key={v} value={v}>{v === 'All' ? 'All Cadences' : v}</option>)}
                        </select>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 whitespace-nowrap">Asset</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 whitespace-nowrap">Partner / Location</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 whitespace-nowrap">Date</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 whitespace-nowrap">Type</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 whitespace-nowrap">Asset Class</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 whitespace-nowrap">Amount</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 whitespace-nowrap">Expected ROI (%)</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 whitespace-nowrap">Expected IRR</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 whitespace-nowrap">Projected Return</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 whitespace-nowrap">Total Value</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 whitespace-nowrap">Return Type</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 whitespace-nowrap">Return</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 whitespace-nowrap">Holding Period</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 whitespace-nowrap">Payout Cadence</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 whitespace-nowrap">Risk Factor</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 whitespace-nowrap">Strategic Partner</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 whitespace-nowrap">Status</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 whitespace-nowrap">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredAnalysisData.length > 0 ? (
                        filteredAnalysisData.map((item, index) => (
                          <tr key={`analysis-${item.id}-${index}`} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-6 whitespace-nowrap">
                              <p className="font-bold text-slate-900">{item.opportunityTitle}</p>
                            </td>
                            <td className="px-6 py-6 whitespace-nowrap">
                              <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-600">{item.partner}</p>
                                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" /> {item.location}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-6 whitespace-nowrap">
                              <p className="text-xs font-medium text-slate-500">{new Date(item.date).toLocaleDateString()}</p>
                            </td>
                            <td className="px-6 py-6 whitespace-nowrap">
                              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                {item.type}
                              </span>
                            </td>
                            <td className="px-6 py-6 whitespace-nowrap">
                              <p className="text-xs font-bold text-slate-600">{item.assetClass}</p>
                            </td>
                            <td className="px-6 py-6 whitespace-nowrap">
                              <p className="font-black text-slate-900">${(item.amount ?? 0).toLocaleString()}</p>
                            </td>
                            <td className="px-6 py-6 whitespace-nowrap">
                              <p className="text-xs font-bold text-emerald-600">{item.expectedROI}</p>
                            </td>
                            <td className="px-6 py-6 whitespace-nowrap">
                              <p className="text-xs font-bold text-blue-600">{item.expectedIRR}</p>
                            </td>
                            <td className="px-6 py-6 whitespace-nowrap">
                              <p className="text-xs font-bold text-slate-900">${(item.projectedReturn ?? 0).toLocaleString()}</p>
                            </td>
                            <td className="px-6 py-6 whitespace-nowrap">
                              <p className="text-xs font-black text-slate-900">${(item.totalValue ?? 0).toLocaleString()}</p>
                            </td>
                            <td className="px-6 py-6 whitespace-nowrap">
                              <p className="text-xs font-bold text-slate-600">{item.returnType}</p>
                            </td>
                            <td className="px-6 py-6 whitespace-nowrap">
                              <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.returnType}</p>
                                <p className="text-xs font-bold text-emerald-600">
                                  ${(item.returnAmount ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-6 whitespace-nowrap">
                              <p className="text-xs font-bold text-slate-600">{item.holdingPeriod}</p>
                            </td>
                            <td className="px-6 py-6 whitespace-nowrap">
                              <p className="text-xs font-bold text-slate-600">{item.payoutCadence}</p>
                            </td>
                            <td className="px-6 py-6 whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                item.riskFactor === 'Low' ? 'bg-emerald-50 text-emerald-600' :
                                item.riskFactor === 'Moderate' ? 'bg-amber-50 text-amber-600' :
                                'bg-rose-50 text-rose-600'
                              }`}>
                                {item.riskFactor}
                              </span>
                            </td>
                            <td className="px-6 py-6 whitespace-nowrap">
                              <p className="text-xs font-bold text-slate-600">{item.strategicPartner}</p>
                            </td>
                            <td className="px-6 py-6 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${
                                  item.status === InvestmentStatus.ACTIVE ? 'bg-emerald-500' : 
                                  item.status === InvestmentStatus.INACTIVE ? 'bg-slate-300' : 'bg-amber-500'
                                }`} />
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                                  item.status === InvestmentStatus.ACTIVE ? 'text-emerald-600' : 
                                  item.status === InvestmentStatus.INACTIVE ? 'text-slate-400' : 'text-amber-600'
                                }`}>
                                  {item.status}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-6 whitespace-nowrap relative">
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => onNavigate('opportunity-detail', item.opportunityId)}
                                  className="p-2 text-slate-300 hover:text-emerald-600 transition"
                                  title="View Details"
                                >
                                  <Eye className="w-5 h-5" />
                                </button>
                                <button 
                                  onClick={() => setShowHistoryActionMenu(showHistoryActionMenu === item.id ? null : item.id)}
                                  className="p-2 text-slate-300 hover:text-emerald-600 transition"
                                >
                                  <MoreVertical className="w-5 h-5" />
                                </button>
                              </div>

                              {showHistoryActionMenu === item.id && (
                                <>
                                  <div 
                                    className="fixed inset-0 z-[190] bg-slate-900/40 backdrop-blur-sm md:hidden"
                                    onClick={() => setShowHistoryActionMenu(null)}
                                  />
                                  <div className="fixed inset-x-4 bottom-4 z-[200] bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 md:absolute md:inset-auto md:right-full md:mr-2 md:top-1/2 md:-translate-y-1/2 md:z-[100] md:w-48 md:rounded-xl md:py-2 animate-in fade-in slide-in-from-bottom-4 md:slide-in-from-right-4 duration-200">
                                    {(() => {
                                      const canWithdraw = canWithdrawFromInvestment(item.id, withdrawals);
                                      const statusMessage = getWithdrawalStatusMessage(item.id, withdrawals);
                                      return (
                                        <button 
                                          onClick={() => {
                                            if (canWithdraw) {
                                              setWithdrawAssetId(item.id);
                                              setShowWithdrawModal(true);
                                              setShowHistoryActionMenu(null);
                                            }
                                          }}
                                          disabled={!canWithdraw}
                                          className={`w-full px-4 py-3 md:py-2 text-left text-xs font-bold flex items-center gap-3 md:gap-2 transition rounded-xl md:rounded-none ${
                                            canWithdraw
                                              ? 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-600'
                                              : 'text-slate-300 cursor-not-allowed'
                                          }`}
                                          title={statusMessage || ''}
                                        >
                                          <Wallet className="w-4 h-4" />
                                          {canWithdraw ? 'Withdraw' : 'Restricted'}
                                        </button>
                                      );
                                    })()}
                                    <button 
                                      onClick={() => {
                                        handleDownloadCertificate(item.id);
                                        setShowHistoryActionMenu(null);
                                      }}
                                      className="w-full px-4 py-3 md:py-2 text-left text-xs font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 flex items-center gap-3 md:gap-2 transition rounded-xl md:rounded-none"
                                    >
                                      <Download className="w-4 h-4" />
                                      Download Certificate
                                    </button>
                                  </div>
                                </>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={18} className="px-8 py-20 text-center">
                            <div className="max-w-xs mx-auto space-y-4 opacity-40">
                              <Search className="w-12 h-12 mx-auto text-slate-300" />
                              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No matching investment data found</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'market' && (
            <div className="space-y-8 animate-in slide-in-from-right duration-500">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 serif">Market Opportunities</h1>
                  <p className="text-slate-500 text-sm mt-1">Explore institutional-grade assets and startups.</p>
                </div>
                <div className="flex w-full md:w-auto gap-3">
                  <div className="relative flex-grow md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search assets..." 
                      className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={() => setShowMarketFilters(!showMarketFilters)}
                    className={`p-3 border rounded-xl transition flex items-center gap-2 shrink-0 ${showMarketFilters ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-slate-200 text-slate-400 hover:text-emerald-600'}`}
                  >
                    <Filter className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Filters</span>
                  </button>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setFilterType('All');
                      setReturnTypeFilter('All');
                      setAssetClassFilter('All');
                      setPayoutFilter('All');
                    }}
                    className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-emerald-600 transition"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

        {showMarketFilters && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm animate-in fade-in slide-in-from-top duration-300">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Type</label>
                    <select 
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                    >
                      <option value="All">All Types</option>
                      {Object.values(InvestmentType).map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Return Type</label>
                    <select 
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                      value={returnTypeFilter}
                      onChange={(e) => setReturnTypeFilter(e.target.value)}
                    >
                      <option value="All">All Returns</option>
                      {Object.values(ReturnType).map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Class</label>
                    <select 
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                      value={assetClassFilter}
                      onChange={(e) => setAssetClassFilter(e.target.value)}
                    >
                      {uniqueAssetClasses.map(v => <option key={v} value={v}>{v === 'All' ? 'All Classes' : v}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payout Cadence</label>
                    <select 
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                      value={payoutFilter}
                      onChange={(e) => setPayoutFilter(e.target.value)}
                    >
                      {uniquePayouts.map(v => <option key={v} value={v}>{v === 'All' ? 'All Cadences' : v}</option>)}
                    </select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredOpps.map((opp) => {
                  const isFull = opp.raisedAmount >= opp.targetAmount;
                  return (
                    <div 
                      key={opp.id} 
                      onClick={() => !isFull && handleSelectOpp(opp)}
                      className={`group cursor-pointer bg-white rounded-3xl overflow-hidden border transition-all duration-500 flex flex-col relative ${
                        isFull 
                          ? 'border-slate-200 opacity-90 cursor-not-allowed' 
                          : 'border-slate-100 hover:border-emerald-500 hover:shadow-2xl'
                      }`}
                    >
                      {isFull && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/5 backdrop-blur-[1px]">
                          <div className="bg-slate-900 text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest shadow-2xl transform -rotate-12 border-4 border-white/20">
                            Full Raise Fund
                          </div>
                        </div>
                      )}
                      <div className="h-48 overflow-hidden relative">
                        <img src={opp.imageUrl} className={`w-full h-full object-cover transition duration-700 ${isFull ? 'grayscale' : 'grayscale group-hover:grayscale-0'}`} alt={opp.title} />
                      </div>
                      <div className="absolute top-4 right-4 z-20 flex gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleWaitlist(opp.id);
                          }}
                          className={`p-1.5 backdrop-blur rounded-full shadow-sm border transition-colors ${
                            waitlistIds.includes(opp.id) 
                              ? 'bg-emerald-600 text-white border-emerald-600' 
                              : 'bg-white/90 text-slate-500 hover:text-emerald-600 border-slate-100'
                          }`}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${waitlistIds.includes(opp.id) ? 'fill-current' : ''}`} />
                        </button>
                        <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-600 border border-slate-100">
                          {opp.type}
                        </div>
                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                          <button 
                            onClick={() => setShowShareMenu(showShareMenu === opp.id ? null : opp.id)}
                            className="p-1.5 bg-white/90 backdrop-blur rounded-full text-slate-500 hover:text-emerald-600 shadow-sm border border-slate-100 transition-colors"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                          {showShareMenu === opp.id && (
                            <div className="absolute top-full right-0 mt-2 bg-white shadow-2xl rounded-2xl p-3 border border-slate-100 min-w-[160px] z-50 animate-in fade-in zoom-in-95 space-y-1">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">Share</p>
                              <button onClick={() => handleShare(opp, 'facebook')} className="w-full flex items-center gap-2.5 p-2 text-[10px] font-bold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                                <Facebook className="w-3 h-3 text-[#1877F2]" /> Facebook
                              </button>
                              <button onClick={() => handleShare(opp, 'instagram')} className="w-full flex items-center gap-2.5 p-2 text-[10px] font-bold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                                <Instagram className="w-3 h-3 text-[#E4405F]" /> Instagram
                              </button>
                              <button onClick={() => handleShare(opp, 'twitter')} className="w-full flex items-center gap-2.5 p-2 text-[10px] font-bold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                                <Twitter className="w-3 h-3 text-slate-900" /> X (Twitter)
                              </button>
                              <button onClick={() => handleShare(opp, 'linkedin')} className="w-full flex items-center gap-2.5 p-2 text-[10px] font-bold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                                <Linkedin className="w-3 h-3 text-[#0A66C2]" /> LinkedIn
                              </button>
                              <button onClick={() => handleShare(opp, 'whatsapp')} className="w-full flex items-center gap-2.5 p-2 text-[10px] font-bold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                                <MessageCircle className="w-3 h-3 text-[#25D366]" /> WhatsApp
                              </button>
                              <div className="h-px bg-slate-100 my-1" />
                              <button onClick={() => handleShare(opp, 'copy')} className="w-full flex items-center gap-2.5 p-2 text-[10px] font-black text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                                <Copy className="w-3 h-3" /> Copy Link
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="p-8 flex-grow flex flex-col">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-xl text-slate-900 group-hover:text-emerald-600 transition-colors">{opp.title}</h3>
                          <span className="text-emerald-600 font-black">{opp.expectedROI}</span>
                        </div>
                        <div className="flex flex-col gap-1.5 mb-6">
                          <div className="flex items-center text-slate-400 text-[10px] font-bold">
                            <MapPin className="w-3 h-3 mr-1.5" /> {opp.location}
                          </div>
                          {opp.publishedAt && (
                            <div className="flex items-center text-slate-400 text-[10px] font-bold">
                              <Calendar className="w-3 h-3 mr-1.5" /> Published: {new Date(opp.publishedAt).toLocaleDateString()}
                            </div>
                          )}
                          {/* Return Metrics Display */}
                          <div className="flex flex-wrap gap-2 mt-1">
                            {(opp.returnType === ReturnType.MONTHLY_RENT || opp.returnType === ReturnType.YEARLY_RENT) && (
                              <>
                                {opp.rentAmount !== undefined && (
                                  <div className="flex items-center text-emerald-600 text-[10px] font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                                    <DollarSign className="w-3 h-3 mr-1.5" /> 
                                    {formatCurrency(opp.rentAmount)} / {opp.returnType === ReturnType.MONTHLY_RENT ? 'mo' : 'yr'}
                                  </div>
                                )}
                                {opp.rentPercentage !== undefined && (
                                  <div className="flex items-center text-blue-600 text-[10px] font-bold bg-blue-50 px-2 py-1 rounded-lg">
                                    <TrendingUp className="w-3 h-3 mr-1.5" /> 
                                    {opp.rentPercentage}% Yield
                                  </div>
                                )}
                              </>
                            )}
                            
                            {opp.returnType === ReturnType.DIVIDEND && (
                              <>
                                {opp.dividendAmount !== undefined && (
                                  <div className="flex items-center text-emerald-600 text-[10px] font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                                    <DollarSign className="w-3 h-3 mr-1.5" /> 
                                    {formatCurrency(opp.dividendAmount)} Div
                                  </div>
                                )}
                                {opp.dividendPercentage !== undefined && (
                                  <div className="flex items-center text-blue-600 text-[10px] font-bold bg-blue-50 px-2 py-1 rounded-lg">
                                    <TrendingUp className="w-3 h-3 mr-1.5" /> 
                                    {opp.dividendPercentage}% Yield
                                  </div>
                                )}
                              </>
                            )}

                            {opp.returnType === ReturnType.ROI && (
                              <>
                                {opp.roiAmount !== undefined && (
                                  <div className="flex items-center text-emerald-600 text-[10px] font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                                    <DollarSign className="w-3 h-3 mr-1.5" /> 
                                    {formatCurrency(opp.roiAmount)} ROI
                                  </div>
                                )}
                                {opp.roiPercentage !== undefined && (
                                  <div className="flex items-center text-blue-600 text-[10px] font-bold bg-blue-50 px-2 py-1 rounded-lg">
                                    <TrendingUp className="w-3 h-3 mr-1.5" /> 
                                    {opp.roiPercentage}% ROI
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            Partner: <span className="text-slate-900">{opp.partnerName || 'Institutional'}</span>
                          </div>
                        </div>
                        <p className="text-slate-500 text-sm line-clamp-2 mb-6">{opp.description}</p>
                        
                        <div className="space-y-2 mb-6">
                          <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest">
                            <span>Funding Progress</span>
                            <span className="text-slate-900">{Math.min(100, Math.round((opp.raisedAmount / opp.targetAmount) * 100))}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-1000 ${isFull ? 'bg-slate-400' : 'bg-emerald-500'}`} 
                              style={{ width: `${Math.min(100, (opp.raisedAmount / opp.targetAmount) * 100)}%` }} 
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
                          <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Min. Entry</p>
                            <p className="font-bold text-slate-900">${(opp.minInvestment ?? 0).toLocaleString()}</p>
                          </div>
                          <button 
                            disabled={isFull}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isFull) return;
                              
                              if (currentUser?.kycStatus !== 'Verified') {
                                onInvest(opp, opp.minInvestment);
                                return;
                              }
                              
                              setQuickInvestOpp(opp);
                              setInvestAmount(opp.minInvestment);
                            }}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition shadow-lg flex items-center gap-2 ${
                              isFull 
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                                : currentUser?.kycStatus !== 'Verified'
                                  ? 'bg-amber-600 text-white hover:bg-amber-700'
                                  : 'bg-slate-900 text-white hover:bg-emerald-600'
                            }`}
                          >
                            {isFull ? 'Sold Out' : currentUser?.kycStatus !== 'Verified' ? 'Verify KYC' : 'Invest'}
                            {!isFull && currentUser?.kycStatus !== 'Verified' && <Lock className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'kyc' && (
            <div className="space-y-8 animate-in slide-in-from-right duration-500">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 serif">KYC Verification</h1>
                  <p className="text-slate-500 text-sm mt-1">Submit and manage your identity verification documents.</p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-white border border-slate-100 rounded-2xl shadow-sm">
                  {currentUser?.kycStatus === 'Verified' ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  ) : currentUser?.kycStatus === 'Pending' ? (
                    <Clock className="w-5 h-5 text-amber-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-rose-500" />
                  )}
                  <span className={`text-xs font-black uppercase tracking-widest ${
                    currentUser?.kycStatus === 'Verified' ? 'text-emerald-600' : 
                    currentUser?.kycStatus === 'Pending' ? 'text-amber-600' : 'text-rose-600'
                  }`}>
                    Status: {currentUser?.kycStatus}
                  </span>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-8 sm:gap-10">
                <div className="lg:col-span-2 space-y-8">
                  {/* Upload Section */}
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-bold serif mb-6">Document Upload</h3>
                    
                    {currentUser?.kycStatus === 'Verified' ? (
                      <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100 text-center space-y-4">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-emerald-600 mx-auto shadow-sm">
                          <CheckCircle className="w-8 h-8" />
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-lg font-bold text-emerald-900">Verification Complete</h4>
                          <p className="text-sm text-emerald-700">Your identity has been verified. You have full access to all platform features.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {currentUser?.kycStatus === 'Rejected' && (
                          <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100 flex items-start gap-4 animate-in fade-in slide-in-from-top duration-500">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-rose-600 shrink-0 shadow-sm">
                              <AlertCircle className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-bold text-rose-900">KYC Rejected</h4>
                              <p className="text-sm text-rose-700 leading-relaxed">
                                Your KYC is rejected , Please lease Re-Uploaded your documents.
                                {currentUser.kycMessages?.find(m => m.type === 'Rejection') && (
                                  <span className="block mt-1 font-medium opacity-80">
                                    {currentUser.kycMessages.find(m => m.type === 'Rejection')?.content.includes('Reason: ') 
                                      ? `Reason: ${currentUser.kycMessages.find(m => m.type === 'Rejection')?.content.split('Reason: ')[1]}`
                                      : 'Please check your documents and try again.'}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        )}
                        <div className="grid sm:grid-cols-3 gap-4">
                            {/* Proof of Identity */}
                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-600 shadow-sm">
                                <FileText className="w-6 h-6" />
                              </div>
                              <div className="space-y-1">
                                <h4 className="font-bold text-slate-900">Proof of Identity</h4>
                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Passport or National ID</p>
                              </div>
                              <div className="space-y-3">
                                <div className="relative group">
                                  <input 
                                    type="file" 
                                    accept="image/*,application/pdf"
                                    className="hidden"
                                    id="identity-upload"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        setKycFiles(prev => ({ ...prev, identity: file }));
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                          setKycPreviews(prev => ({ ...prev, identity: reader.result as string }));
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                  />
                                  <label 
                                    htmlFor="identity-upload"
                                    className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer transition-all overflow-hidden ${
                                      kycFiles.identity 
                                        ? 'border-emerald-500 bg-emerald-50/50' 
                                        : 'border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50'
                                    }`}
                                  >
                                    {kycPreviews.identity ? (
                                      <div className="flex flex-col items-center">
                                        <CheckCircle className="w-8 h-8 text-emerald-600" />
                                        <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600 mt-1">Uploaded</span>
                                      </div>
                                    ) : (
                                      <>
                                        <Plus className="w-5 h-5 text-slate-400 mb-1" />
                                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Select file from Computer</span>
                                      </>
                                    )}
                                  </label>
                                </div>
                                <button 
                                  onClick={() => {
                                    if (currentUser && kycFiles.identity && kycPreviews.identity) {
                                      onUploadKYC(currentUser.id, [kycPreviews.identity]);
                                      setKycFiles(prev => ({ ...prev, identity: null }));
                                      setKycPreviews(prev => ({ ...prev, identity: null }));
                                      alert('Identity document uploaded successfully!');
                                    } else {
                                      alert('Please select a file');
                                    }
                                  }}
                                  disabled={!kycFiles.identity}
                                  className="w-full py-3 bg-emerald-600 disabled:bg-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-emerald-700 transition shadow-lg shadow-emerald-100"
                                >
                                  Upload Identity
                                </button>
                              </div>
                            </div>

                            {/* Proof of Address */}
                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-600 shadow-sm">
                                <MapPin className="w-6 h-6" />
                              </div>
                              <div className="space-y-1">
                                <h4 className="font-bold text-slate-900">Proof of Address</h4>
                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Utility Bill or Statement</p>
                              </div>
                              <div className="space-y-3">
                                <div className="relative group">
                                  <input 
                                    type="file" 
                                    accept="image/*,application/pdf"
                                    className="hidden"
                                    id="address-upload"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        setKycFiles(prev => ({ ...prev, address: file }));
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                          setKycPreviews(prev => ({ ...prev, address: reader.result as string }));
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                  />
                                  <label 
                                    htmlFor="address-upload"
                                    className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer transition-all overflow-hidden ${
                                      kycFiles.address 
                                        ? 'border-emerald-500 bg-emerald-50/50' 
                                        : 'border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50'
                                    }`}
                                  >
                                    {kycPreviews.address ? (
                                      <div className="flex flex-col items-center">
                                        <CheckCircle className="w-8 h-8 text-emerald-600" />
                                        <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600 mt-1">Uploaded</span>
                                      </div>
                                    ) : (
                                      <>
                                        <Plus className="w-5 h-5 text-slate-400 mb-1" />
                                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Select file from Computer</span>
                                      </>
                                    )}
                                  </label>
                                </div>
                                <button 
                                  onClick={() => {
                                    if (currentUser && kycFiles.address && kycPreviews.address) {
                                      onUploadKYC(currentUser.id, [kycPreviews.address]);
                                      setKycFiles(prev => ({ ...prev, address: null }));
                                      setKycPreviews(prev => ({ ...prev, address: null }));
                                      alert('Address document uploaded successfully!');
                                    } else {
                                      alert('Please select a file');
                                    }
                                  }}
                                  disabled={!kycFiles.address}
                                  className="w-full py-3 bg-emerald-600 disabled:bg-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-emerald-700 transition shadow-lg shadow-emerald-100"
                                >
                                  Upload Address
                                </button>
                              </div>
                            </div>

                            {/* Selfie Verification */}
                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-600 shadow-sm">
                                <Camera className="w-6 h-6" />
                              </div>
                              <div className="space-y-1">
                                <h4 className="font-bold text-slate-900">Selfie Verification</h4>
                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Live Photo</p>
                              </div>
                              <div className="space-y-3">
                                <div className="relative group">
                                  <input 
                                    type="file" 
                                    accept="image/*"
                                    className="hidden"
                                    id="selfie-upload"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        setKycFiles(prev => ({ ...prev, selfie: file }));
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                          setKycPreviews(prev => ({ ...prev, selfie: reader.result as string }));
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                  />
                                  <label 
                                    htmlFor="selfie-upload"
                                    className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer transition-all overflow-hidden ${
                                      kycFiles.selfie 
                                        ? 'border-emerald-500 bg-emerald-50/50' 
                                        : 'border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50'
                                    }`}
                                  >
                                    {kycPreviews.selfie ? (
                                      <div className="flex flex-col items-center">
                                        <CheckCircle className="w-8 h-8 text-emerald-600" />
                                        <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600 mt-1">Uploaded</span>
                                      </div>
                                    ) : (
                                      <>
                                        <Plus className="w-5 h-5 text-slate-400 mb-1" />
                                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Select file from Computer</span>
                                      </>
                                    )}
                                  </label>
                                </div>
                                <button 
                                  onClick={() => {
                                    if (currentUser && kycFiles.selfie) {
                                      onUploadKYC(currentUser.id, [kycPreviews.selfie!]);
                                      setKycFiles(prev => ({ ...prev, selfie: null }));
                                      setKycPreviews(prev => ({ ...prev, selfie: null }));
                                      alert('Selfie uploaded successfully!');
                                    } else {
                                      alert('Please select a file');
                                    }
                                  }}
                                  disabled={!kycFiles.selfie}
                                  className="w-full py-3 bg-slate-900 disabled:bg-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-emerald-600 transition shadow-lg"
                                >
                                  Upload Selfie
                                </button>
                              </div>
                            </div>
                        </div>

                        <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex items-start gap-4">
                          <Info className="w-6 h-6 text-amber-600 mt-1" />
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-amber-900">Important Note</p>
                            <p className="text-xs text-amber-700 leading-relaxed">Please ensure all documents are clear, legible, and in PDF or JPG format. Verification typically takes 24-48 business hours.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Uploaded Documents List */}
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-bold serif mb-6">Submitted Documents</h3>
                    <div className="space-y-3">
                      {currentUser?.kycDocuments && currentUser.kycDocuments.length > 0 ? (
                        currentUser.kycDocuments.map((doc, idx) => (
                          <div key={`kyc-doc-${idx}`} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-white rounded-lg text-slate-400">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-900">Document_{idx + 1}</p>
                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Uploaded on {new Date().toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => {
                                  if (doc.startsWith('data:')) {
                                    const win = window.open();
                                    if (win) {
                                      win.document.write(`<iframe src="${doc}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
                                    }
                                  } else {
                                    window.open(doc, '_blank');
                                  }
                                }}
                                className="p-2 text-slate-400 hover:text-emerald-600 transition"
                                title="View Document"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <a 
                                href={doc} 
                                download={`KYC_Document_${idx + 1}`}
                                className="p-2 text-slate-400 hover:text-emerald-600 transition"
                                title="Download Document"
                              >
                                <Download className="w-4 h-4" />
                              </a>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-10 text-center opacity-40">
                          <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                          <p className="text-sm font-bold text-slate-400">No documents submitted yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Notifications / Messages */}
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold serif">Notifications</h3>
                      <Bell className="w-5 h-5 text-slate-300" />
                    </div>
                    <div className="space-y-4">
                      {currentUser?.kycMessages && currentUser.kycMessages.length > 0 ? (
                        currentUser.kycMessages.map((msg) => (
                          <div key={msg.id} className={`p-5 rounded-3xl border transition-all ${
                            msg.type === 'Approval' ? 'bg-emerald-50 border-emerald-100' :
                            msg.type === 'Rejection' ? 'bg-rose-50 border-rose-100' :
                            'bg-amber-50 border-amber-100'
                          }`}>
                            <div className="flex items-center gap-3 mb-2">
                              {msg.type === 'Approval' ? (
                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                              ) : msg.type === 'Rejection' ? (
                                <X className="w-4 h-4 text-rose-600" />
                              ) : (
                                <Clock className="w-4 h-4 text-amber-600" />
                              )}
                              <span className={`text-[10px] font-black uppercase tracking-widest ${
                                msg.type === 'Approval' ? 'text-emerald-700' :
                                msg.type === 'Rejection' ? 'text-rose-700' :
                                'text-amber-700'
                              }`}>
                                {msg.type}
                              </span>
                              <span className="text-[8px] text-slate-400 ml-auto">{new Date(msg.date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed">{msg.content}</p>
                          </div>
                        ))
                      ) : (
                        <div className="py-10 text-center opacity-40">
                          <Bell className="w-10 h-10 mx-auto mb-4 text-slate-200" />
                          <p className="text-xs font-bold text-slate-400">No new notifications.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Help / Support */}
                  <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-6">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400">
                      <LifeBuoy className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-lg font-bold">Need Help?</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">Our compliance team is available to assist you with any questions regarding the verification process.</p>
                    </div>
                    <button 
                      onClick={() => onTabChange('support')}
                      className="w-full py-4 bg-emerald-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all"
                    >
                      Contact Support
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-8 animate-in slide-in-from-right duration-500">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 serif">Investment History</h1>
                  <p className="text-slate-500 text-sm mt-1">Full audit trail of your capital deployments and returns.</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <button 
                    onClick={() => setShowExportModal(true)}
                    className="flex-grow md:flex-grow-0 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition shadow-sm"
                  >
                    <Download className="w-4 h-4" /> Export PDF
                  </button>
                  <button 
                    onClick={() => handleExportPDF(true)}
                    className="flex-grow md:flex-grow-0 flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition shadow-lg"
                  >
                    <FileText className="w-4 h-4" /> Export All
                  </button>
                </div>
                <div id="history-filter-toggle">
                  <button 
                    onClick={() => setShowHistoryFilters(!showHistoryFilters)}
                    className={`p-3 rounded-xl border transition-all ${showHistoryFilters ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white border-slate-100 text-slate-400 hover:text-slate-600 shadow-sm'}`}
                    title="Toggle Filters"
                  >
                    <Filter className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex p-1 bg-slate-100 rounded-2xl w-full sm:w-fit">
                <button
                  onClick={() => setHistorySubTab('assets')}
                  className={`flex-1 sm:flex-none px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${historySubTab === 'assets' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Asset Invested
                </button>
                <button
                  onClick={() => setHistorySubTab('returns')}
                  className={`flex-1 sm:flex-none px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${historySubTab === 'returns' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Returns Received
                </button>
                <button
                  onClick={() => setHistorySubTab('withdraw')}
                  className={`flex-1 sm:flex-none px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${historySubTab === 'withdraw' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Withdrawals
                </button>
                {hasRentInvestments && (
                  <button
                    onClick={() => setHistorySubTab('rent')}
                    className={`flex-1 sm:flex-none px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${historySubTab === 'rent' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    Rent
                  </button>
                )}
                {hasROIReturns && (
                  <button
                    onClick={() => setHistorySubTab('roi')}
                    className={`flex-1 sm:flex-none px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${historySubTab === 'roi' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    ROI
                  </button>
                )}
                {hasDividendReturns && (
                  <button
                    onClick={() => setHistorySubTab('dividend')}
                    className={`flex-1 sm:flex-none px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${historySubTab === 'dividend' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    Dividend
                  </button>
                )}
              </div>

              {/* Filters */}
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search assets, partners, locations..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                  />
                </div>

                {showHistoryFilters && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-slate-50"
                  >
                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                      value={historyAssetFilter}
                      onChange={(e) => setHistoryAssetFilter(e.target.value)}
                    >
                      <option value="All">All Assets</option>
                      {uniqueAssets.map(asset => (
                        <option key={asset} value={asset}>{asset}</option>
                      ))}
                    </select>

                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                      value={historyPartnerFilter}
                      onChange={(e) => setHistoryPartnerFilter(e.target.value)}
                    >
                      <option value="All">All Partners</option>
                      {Array.from(new Set(opportunities.map(o => o.partnerName))).map(partner => (
                        <option key={partner} value={partner}>{partner}</option>
                      ))}
                    </select>

                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                      value={historyLocationFilter}
                      onChange={(e) => setHistoryLocationFilter(e.target.value)}
                    >
                      <option value="All">All Locations</option>
                      {Array.from(new Set(opportunities.map(o => o.location))).map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>

                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                      value={historyAssetTypeFilter}
                      onChange={(e) => setHistoryAssetTypeFilter(e.target.value)}
                    >
                      <option value="All">All Asset Types</option>
                      {Object.values(InvestmentType).map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>

                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                      value={historyAssetClassFilter}
                      onChange={(e) => setHistoryAssetClassFilter(e.target.value)}
                    >
                      <option value="All">All Asset Classes</option>
                      {uniqueAssetClasses.filter(c => c !== 'All').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>

                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                      value={historyPayoutFilter}
                      onChange={(e) => setHistoryPayoutFilter(e.target.value)}
                    >
                      <option value="All">All Payout Cadences</option>
                      {uniquePayouts.filter(p => p !== 'All').map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>

                    {historySubTab === 'returns' && (
                      <select 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                        value={historyReturnType}
                        onChange={(e) => setHistoryReturnType(e.target.value)}
                      >
                        <option value="All">All Return Types</option>
                        <option value="Dividend">Dividend</option>
                        <option value="ROI">ROI</option>
                        <option value="Rental">Rental</option>
                      </select>
                    )}

                    <div className="flex items-center gap-2 lg:col-span-1">
                      <input 
                        type="date" 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                        value={historyStartDate}
                        onChange={(e) => setHistoryStartDate(e.target.value)}
                      />
                      <span className="text-slate-300">to</span>
                      <input 
                        type="date" 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                        value={historyEndDate}
                        onChange={(e) => setHistoryEndDate(e.target.value)}
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Table */}
              <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Asset ID</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Asset</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Partner / Location</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{historySubTab === 'withdraw' ? 'Withdrawal Date' : (historySubTab === 'rent' || historySubTab === 'roi' || historySubTab === 'dividend') ? 'Investment Date' : 'Date'}</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Type</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Asset Class</th>
                        {historySubTab === 'withdraw' ? (
                          <>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Return Type</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Holding Period</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Payout Cadence</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">Withdrawal Amount (Principal Investment)</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">Withdrawal Expected ROI (%)</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">Withdrawal amount (Total Payout)</th>
                          </>
                        ) : historySubTab === 'rent' ? (
                          <>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">Investment Amount</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Holding Period</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">Rent Amount</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Payout Cadence</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Return Type</th>
                          </>
                        ) : historySubTab === 'roi' ? (
                          <>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Holding Period</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">ROI Amount</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">ROI Yield (%)</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Payout Cadence</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Return Type</th>
                          </>
                        ) : historySubTab === 'dividend' ? (
                          <>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Holding Period</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">Dividend Amount</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">Dividend Yield (%)</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Payout Cadence</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Return Type</th>
                          </>
                        ) : historySubTab === 'returns' ? (
                          <>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">Investment Amount</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">Returns Amount</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">Expected ROI (%)</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">Total Amount</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Return Type</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Holding Period</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Payout Cadence</th>
                          </>
                        ) : (
                          <>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">Amount</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">Expected ROI (%)</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">Expected IRR</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">Projected Return</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">Monthly Revenue</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">Total Value</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Return Type</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Holding Period</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Payout Cadence</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Risk Factor</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Strategic Partner</th>
                          </>
                        )}
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-center">Status</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {historySubTab === 'assets' ? (
                        filteredInvestments.length > 0 ? (
                          filteredInvestments.map((inv) => {
                            const opp = opportunities.find(o => o.id === inv.opportunityId);
                            const roi = parseFloat(opp?.expectedROI || '0');
                            const projectedReturn = inv.amount * (roi / 100);
                            const monthlyRevenue = projectedReturn / 12;
                            
                            return (
                              <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <p className="text-[10px] font-mono font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded inline-block">{inv.id}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <p className="text-sm font-bold text-slate-900">{inv.opportunityTitle}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <p className="text-xs font-bold text-slate-700">{opp?.partnerName || 'N/A'}</p>
                                  <p className="text-[10px] text-slate-400">{opp?.location || 'N/A'}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <p className="text-xs text-slate-600">{new Date(inv.date).toLocaleDateString()}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-black uppercase tracking-widest">{inv.type}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-xs text-slate-600 font-medium">{opp?.assetClass || 'N/A'}</span>
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                  <p className="text-sm font-black text-slate-900">${(inv.amount ?? 0).toLocaleString()}</p>
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                  <p className="text-sm font-bold text-emerald-600">{opp?.expectedROI || '0%'}</p>
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                  <p className="text-sm font-bold text-blue-600">{opp?.expectedIRR || 'N/A'}</p>
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                  <p className="text-sm font-black text-slate-900">${(projectedReturn ?? 0).toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                  <p className="text-sm font-bold text-emerald-600">${(monthlyRevenue ?? 0).toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                  <p className="text-sm font-black text-slate-900">${((inv.amount ?? 0) + (projectedReturn ?? 0)).toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-xs text-slate-600">{opp?.returnType || 'N/A'}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-xs text-slate-600">{opp?.holdingPeriod || 'N/A'}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-xs text-slate-600">{opp?.payoutFrequency || 'N/A'}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${
                                    opp?.riskLevel === 'Low' ? 'bg-emerald-50 text-emerald-600' : 
                                    opp?.riskLevel === 'Moderate' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                                  }`}>
                                    {opp?.riskLevel || 'N/A'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-xs text-slate-600">{opp?.partnerName || 'N/A'}</span>
                                </td>
                                <td className="px-6 py-4 text-center whitespace-nowrap">
                                  <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${
                                    inv.status === InvestmentStatus.ACTIVE ? 'text-emerald-600' : 
                                    inv.status === InvestmentStatus.INACTIVE ? 'text-slate-400' : 'text-amber-600'
                                  }`}>
                                    {inv.status === InvestmentStatus.INACTIVE ? <X className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />} {inv.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap relative">
                                  <div className="flex items-center justify-end gap-2">
                                    <button 
                                      onClick={() => {
                                        setHistorySubTab('withdraw');
                                        setHistorySearch(inv.opportunityTitle);
                                      }}
                                      className="p-2 text-slate-400 hover:text-rose-600 transition flex items-center gap-1 group"
                                      title="View Withdrawals"
                                    >
                                      <Wallet className="w-4 h-4" />
                                      <span className="text-[10px] font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">Withdrawals</span>
                                    </button>
                                    <button 
                                      onClick={() => setShowHistoryActionMenu(showHistoryActionMenu === inv.id ? null : inv.id)}
                                      className="p-2 text-slate-400 hover:text-emerald-600 transition"
                                    >
                                      <MoreVertical className="w-4 h-4" />
                                    </button>
                                  </div>
                                  
                                  {showHistoryActionMenu === inv.id && (
                                    <>
                                      <div 
                                        className="fixed inset-0 z-[190] bg-slate-900/40 backdrop-blur-sm md:hidden"
                                        onClick={() => setShowHistoryActionMenu(null)}
                                      />
                                      <div className="fixed inset-x-4 bottom-4 z-[200] bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 md:absolute md:inset-auto md:right-12 md:top-1/2 md:-translate-y-1/2 md:z-[100] md:p-2 md:min-w-[200px] md:rounded-2xl animate-in fade-in slide-in-from-bottom-4 md:slide-in-from-right-4 duration-200">
                                        {(() => {
                                          const canWithdraw = canWithdrawFromInvestment(inv.id, withdrawals);
                                          const statusMessage = getWithdrawalStatusMessage(inv.id, withdrawals);
                                          return (
                                            <button 
                                              onClick={() => {
                                                if (canWithdraw) {
                                                  setWithdrawAssetId(inv.id);
                                                  setShowWithdrawModal(true);
                                                  setShowHistoryActionMenu(null);
                                                }
                                              }}
                                              disabled={!canWithdraw}
                                              className={`w-full flex items-center gap-3 p-3 text-left text-xs font-bold rounded-xl transition ${
                                                canWithdraw 
                                                  ? 'text-slate-600 hover:bg-rose-50 hover:text-rose-600' 
                                                  : 'text-slate-300 cursor-not-allowed'
                                              }`}
                                              title={statusMessage || ''}
                                            >
                                              <ArrowUpRight className="w-4 h-4" />
                                              {canWithdraw ? 'Withdraw' : 'Restricted'}
                                            </button>
                                          );
                                        })()}
                                        <button 
                                          onClick={() => {
                                            handleDownloadCertificate(inv.id);
                                            setShowHistoryActionMenu(null);
                                          }}
                                          className="w-full flex items-center gap-3 p-3 text-left text-xs font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition"
                                        >
                                          <Download className="w-4 h-4" />
                                          Download Certificate
                                        </button>
                                        <button 
                                          onClick={() => {
                                            handleToggleWaitlist(inv.opportunityId);
                                            setShowHistoryActionMenu(null);
                                          }}
                                          className={`w-full flex items-center gap-3 p-3 text-left text-xs font-bold rounded-xl transition ${
                                            waitlistIds.includes(inv.opportunityId)
                                              ? 'text-emerald-600 bg-emerald-50'
                                              : 'text-slate-600 hover:bg-slate-50'
                                          }`}
                                        >
                                          <Bookmark className={`w-4 h-4 ${waitlistIds.includes(inv.opportunityId) ? 'fill-current' : ''}`} />
                                          {waitlistIds.includes(inv.opportunityId) ? 'In Waitlist' : 'Add to Waitlist'}
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={19} className="px-6 py-20 text-center text-slate-400 italic text-sm">No investment history found matching your criteria.</td>
                          </tr>
                        )
                      ) : historySubTab === 'returns' ? (
                        filteredReturns.length > 0 ? (
                          filteredReturns.map((ret) => {
                            const inv = userInvestments.find(inv => inv.id === ret.investmentId);
                            const opp = opportunities.find(o => o.id === inv?.opportunityId);
                            const investmentAmount = inv?.amount || 0;
                            const returnsAmount = ret.amount;
                            const roi = investmentAmount > 0 ? (returnsAmount / investmentAmount) * 100 : 0;
                            const totalAmount = investmentAmount + returnsAmount;

                            return (
                              <tr key={ret.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <p className="text-[10px] font-mono font-black text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">{ret.id}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <p className="text-sm font-bold text-slate-900">{ret.investmentTitle}</p>
                                  <p className="text-[10px] text-slate-400">Asset ID: #{ret.investmentId}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <p className="text-xs font-bold text-slate-700">{opp?.partnerName || 'N/A'}</p>
                                  <p className="text-[10px] text-slate-400">{opp?.location || 'N/A'}</p>
                                </td>
                                <td className="px-6 py-4 text-xs text-slate-600 whitespace-nowrap">{new Date(ret.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-black uppercase tracking-widest">{opp?.type || 'N/A'}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-xs text-slate-600 font-medium">{opp?.assetClass || 'N/A'}</span>
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                  <p className="text-sm font-black text-slate-900">${investmentAmount.toLocaleString()}</p>
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                  <p className={`text-sm font-black ${returnsAmount >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {returnsAmount >= 0 ? '+' : ''}${(returnsAmount ?? 0).toLocaleString()}
                                  </p>
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                  <p className={`text-sm font-bold ${roi >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {roi >= 0 ? '+' : ''}{roi.toFixed(2)}%
                                  </p>
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                  <p className="text-sm font-black text-slate-900">${(totalAmount ?? 0).toLocaleString()}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[9px] font-black uppercase tracking-widest">
                                    {ret.type}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-xs text-slate-600">{opp?.holdingPeriod || 'N/A'}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-xs text-slate-600">{opp?.payoutFrequency || 'N/A'}</span>
                                </td>
                                <td className="px-6 py-4 text-center whitespace-nowrap">
                                  {inv ? (
                                    <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${
                                      inv.status === InvestmentStatus.ACTIVE ? 'text-emerald-600' : 
                                      inv.status === InvestmentStatus.INACTIVE ? 'text-slate-400' : 'text-amber-600'
                                    }`}>
                                      {inv.status === InvestmentStatus.INACTIVE ? <X className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />} {inv.status}
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                                      <CheckCircle className="w-3 h-3" /> Credited
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap relative">
                                  <div className="flex items-center justify-end gap-2">
                                    <button 
                                      onClick={() => {
                                        setHistorySubTab('withdraw');
                                        setHistorySearch(ret.investmentTitle);
                                      }}
                                      className="p-2 text-slate-400 hover:text-rose-600 transition flex items-center gap-1 group"
                                      title="View Withdrawals"
                                    >
                                      <Wallet className="w-4 h-4" />
                                      <span className="text-[10px] font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">Withdrawals</span>
                                    </button>
                                    <button 
                                      onClick={() => setShowHistoryActionMenu(showHistoryActionMenu === ret.id ? null : ret.id)}
                                      className="p-2 text-slate-400 hover:text-emerald-600 transition"
                                    >
                                      <MoreVertical className="w-4 h-4" />
                                    </button>
                                  </div>
                                  
                                  {showHistoryActionMenu === ret.id && (
                                    <>
                                      <div 
                                        className="fixed inset-0 z-[190] bg-slate-900/40 backdrop-blur-sm md:hidden"
                                        onClick={() => setShowHistoryActionMenu(null)}
                                      />
                                      <div className="fixed inset-x-4 bottom-4 z-[200] bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 md:absolute md:inset-auto md:right-12 md:top-1/2 md:-translate-y-1/2 md:z-[100] md:p-2 md:min-w-[200px] md:rounded-2xl animate-in fade-in slide-in-from-bottom-4 md:slide-in-from-right-4 duration-200">
                                        {(() => {
                                          const canWithdraw = canWithdrawReturn(ret, inv?.status || InvestmentStatus.ACTIVE);
                                          const statusMessage = getReturnWithdrawalStatusMessage(ret, inv?.status || InvestmentStatus.ACTIVE);
                                          return (
                                            <button 
                                              onClick={() => {
                                                if (canWithdraw) {
                                                  handleWithdrawReturns(ret);
                                                  setShowHistoryActionMenu(null);
                                                }
                                              }}
                                              disabled={!canWithdraw}
                                              className={`w-full flex items-center gap-3 p-3 text-left text-xs font-bold rounded-xl transition ${
                                                canWithdraw 
                                                  ? 'text-slate-600 hover:bg-rose-50 hover:text-rose-600' 
                                                  : 'text-slate-300 cursor-not-allowed'
                                              }`}
                                              title={statusMessage || ''}
                                            >
                                              <ArrowUpRight className="w-4 h-4" />
                                              {canWithdraw ? 'Withdrawal Return' : 'Restricted'}
                                            </button>
                                          );
                                        })()}
                                        <button 
                                          onClick={() => {
                                            const opp = opportunities.find(o => o.id === inv?.opportunityId);
                                            const partner = partners.find(p => p.legalCompanyName === opp?.partnerName);
                                            setReturnsCertificateToDownload({
                                              returnRecord: ret,
                                              investor: currentUser,
                                              opportunity: opp,
                                              partner: partner,
                                              investmentAmount: inv?.amount,
                                              issueDate: new Date().toLocaleDateString(),
                                              logo: config.growMilkatLogo || config.logo,
                                              ownerSignature: config.ownerSignature
                                            });
                                            setShowHistoryActionMenu(null);
                                          }}
                                          className="w-full flex items-center gap-3 p-3 text-left text-xs font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition"
                                        >
                                          <Download className="w-4 h-4" />
                                          Download Return Certificate
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={15} className="px-6 py-20 text-center text-slate-400 italic text-sm">No returns found matching your criteria.</td>
                          </tr>
                        )
                      ) : historySubTab === 'rent' ? (
                        filteredRentReturns.length > 0 ? (
                          filteredRentReturns.map((ret) => {
                            const inv = userInvestments.find(inv => inv.id === ret.investmentId);
                            const opp = opportunities.find(o => o.id === inv?.opportunityId);
                            const investmentAmount = inv?.amount || 0;
                            const rentAmount = ret.amount;

                            return (
                              <tr key={ret.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <p className="text-[10px] font-mono font-black text-amber-600 bg-amber-50 px-2 py-1 rounded inline-block">{ret.investmentId}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <p className="text-sm font-bold text-slate-900">{ret.investmentTitle}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <p className="text-xs font-bold text-slate-700">{opp?.partnerName || 'N/A'}</p>
                                  <p className="text-[10px] text-slate-400">{opp?.location || 'N/A'}</p>
                                </td>
                                <td className="px-6 py-4 text-xs text-slate-600 whitespace-nowrap">{inv?.date ? new Date(inv.date).toLocaleDateString() : 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-black uppercase tracking-widest">{opp?.type || 'N/A'}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-xs text-slate-600 font-medium">{opp?.assetClass || 'N/A'}</span>
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                  <p className="text-sm font-black text-slate-900">${(investmentAmount ?? 0).toLocaleString()}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-xs text-slate-600">{opp?.holdingPeriod || 'N/A'}</span>
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                  <p className="text-sm font-black text-amber-600">${(rentAmount ?? 0).toLocaleString()}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-xs text-slate-600">{opp?.payoutFrequency || 'N/A'}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-xs text-slate-600">{ret.type}</span>
                                </td>
                                <td className="px-6 py-4 text-center whitespace-nowrap">
                                  {inv ? (
                                    <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${
                                      inv.status === InvestmentStatus.ACTIVE ? 'text-emerald-600' : 
                                      inv.status === InvestmentStatus.INACTIVE ? 'text-slate-400' : 'text-amber-600'
                                    }`}>
                                      {inv.status === InvestmentStatus.INACTIVE ? <X className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />} {inv.status}
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                                      <CheckCircle className="w-3 h-3" /> Credited
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap relative">
                                  <div className="flex items-center justify-end gap-2">
                                    <button 
                                      onClick={() => {
                                        setHistorySubTab('withdraw');
                                        setHistorySearch(ret.investmentTitle);
                                      }}
                                      className="p-2 text-slate-400 hover:text-rose-600 transition flex items-center gap-1 group"
                                      title="View Withdrawals"
                                    >
                                      <Wallet className="w-4 h-4" />
                                      <span className="text-[10px] font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">Withdrawals</span>
                                    </button>
                                    <button 
                                      onClick={() => setShowHistoryActionMenu(showHistoryActionMenu === ret.id ? null : ret.id)}
                                      className="p-2 text-slate-400 hover:text-emerald-600 transition"
                                    >
                                      <MoreVertical className="w-4 h-4" />
                                    </button>
                                  </div>
                                  
                                  {showHistoryActionMenu === ret.id && (
                                    <>
                                      <div 
                                        className="fixed inset-0 z-[190] bg-slate-900/40 backdrop-blur-sm md:hidden"
                                        onClick={() => setShowHistoryActionMenu(null)}
                                      />
                                      <div className="fixed inset-x-4 bottom-4 z-[200] bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 md:absolute md:inset-auto md:right-12 md:top-1/2 md:-translate-y-1/2 md:z-[100] md:p-2 md:min-w-[200px] md:rounded-2xl animate-in fade-in slide-in-from-bottom-4 md:slide-in-from-right-4 duration-200">
                                        {(() => {
                                          const canWithdraw = canWithdrawReturn(ret, inv?.status || InvestmentStatus.ACTIVE);
                                          const statusMessage = getReturnWithdrawalStatusMessage(ret, inv?.status || InvestmentStatus.ACTIVE);
                                          return (
                                            <button 
                                              onClick={() => {
                                                if (canWithdraw) {
                                                  handleWithdrawReturns(ret);
                                                  setShowHistoryActionMenu(null);
                                                }
                                              }}
                                              disabled={!canWithdraw}
                                              className={`w-full flex items-center gap-3 p-3 text-left text-xs font-bold rounded-xl transition ${
                                                canWithdraw 
                                                  ? 'text-slate-600 hover:bg-rose-50 hover:text-rose-600' 
                                                  : 'text-slate-300 cursor-not-allowed'
                                              }`}
                                              title={statusMessage || ''}
                                            >
                                              <ArrowUpRight className="w-4 h-4" />
                                              {canWithdraw ? 'Withdrawal Return' : 'Restricted'}
                                            </button>
                                          );
                                        })()}
                                        <button 
                                          onClick={() => {
                                            const opp = opportunities.find(o => o.id === inv?.opportunityId);
                                            const partner = partners.find(p => p.legalCompanyName === opp?.partnerName);
                                            setReturnsCertificateToDownload({
                                              returnRecord: ret,
                                              investor: currentUser,
                                              opportunity: opp,
                                              partner: partner,
                                              investmentAmount: inv?.amount,
                                              issueDate: new Date().toLocaleDateString(),
                                              logo: config.growMilkatLogo || config.logo,
                                              ownerSignature: config.ownerSignature
                                            });
                                            setShowHistoryActionMenu(null);
                                          }}
                                          className="w-full flex items-center gap-3 p-3 text-left text-xs font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition"
                                        >
                                          <Download className="w-4 h-4" />
                                          Download Return Certificate
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={13} className="px-6 py-20 text-center text-slate-400 italic text-sm">No rent returns found matching your criteria.</td>
                          </tr>
                        )
                      ) : historySubTab === 'roi' ? (
                        filteredROIReturns.length > 0 ? (
                          filteredROIReturns.map((ret) => {
                            const inv = userInvestments.find(inv => inv.id === ret.investmentId);
                            const opp = opportunities.find(o => o.id === inv?.opportunityId);
                            const investmentAmount = inv?.amount || 0;
                            const roiAmount = ret.amount;
                            const yieldPct = investmentAmount > 0 ? (roiAmount / investmentAmount) * 100 : 0;

                            return (
                              <tr key={ret.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <p className="text-[10px] font-mono font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded inline-block">{ret.id}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <p className="text-sm font-bold text-slate-900">{ret.investmentTitle}</p>
                                  <p className="text-[10px] text-slate-400">Asset ID: #{ret.investmentId}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <p className="text-xs font-bold text-slate-700">{opp?.partnerName || 'N/A'}</p>
                                  <p className="text-[10px] text-slate-400">{opp?.location || 'N/A'}</p>
                                </td>
                                <td className="px-6 py-4 text-xs text-slate-600 whitespace-nowrap">{new Date(ret.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-black uppercase tracking-widest">{opp?.type || 'N/A'}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-xs text-slate-600 font-medium">{opp?.assetClass || 'N/A'}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-xs text-slate-600">{opp?.holdingPeriod || 'N/A'}</span>
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                  <p className="text-sm font-black text-emerald-600">${(roiAmount ?? 0).toLocaleString()}</p>
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                  <p className="text-sm font-bold text-emerald-600">{yieldPct.toFixed(2)}%</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-xs text-slate-600">{opp?.payoutFrequency || 'N/A'}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-xs text-slate-600">{ret.type}</span>
                                </td>
                                <td className="px-6 py-4 text-center whitespace-nowrap">
                                  {inv ? (
                                    <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${
                                      inv.status === InvestmentStatus.ACTIVE ? 'text-emerald-600' : 
                                      inv.status === InvestmentStatus.INACTIVE ? 'text-slate-400' : 'text-amber-600'
                                    }`}>
                                      {inv.status === InvestmentStatus.INACTIVE ? <X className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />} {inv.status}
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                                      <CheckCircle className="w-3 h-3" /> Credited
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap relative">
                                  <div className="flex items-center justify-end gap-2">
                                    <button 
                                      onClick={() => {
                                        setHistorySubTab('withdraw');
                                        setHistorySearch(ret.investmentTitle);
                                      }}
                                      className="p-2 text-slate-400 hover:text-rose-600 transition flex items-center gap-1 group"
                                      title="View Withdrawals"
                                    >
                                      <Wallet className="w-4 h-4" />
                                      <span className="text-[10px] font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">Withdrawals</span>
                                    </button>
                                    <button 
                                      onClick={() => setShowHistoryActionMenu(showHistoryActionMenu === ret.id ? null : ret.id)}
                                      className="p-2 text-slate-400 hover:text-emerald-600 transition"
                                    >
                                      <MoreVertical className="w-4 h-4" />
                                    </button>
                                  </div>
                                  
                                  {showHistoryActionMenu === ret.id && (
                                    <>
                                      <div 
                                        className="fixed inset-0 z-[190] bg-slate-900/40 backdrop-blur-sm md:hidden"
                                        onClick={() => setShowHistoryActionMenu(null)}
                                      />
                                      <div className="fixed inset-x-4 bottom-4 z-[200] bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 md:absolute md:inset-auto md:right-12 md:top-1/2 md:-translate-y-1/2 md:z-[100] md:p-2 md:min-w-[200px] md:rounded-2xl animate-in fade-in slide-in-from-bottom-4 md:slide-in-from-right-4 duration-200">
                                        {(() => {
                                          const canWithdraw = canWithdrawReturn(ret, inv?.status || InvestmentStatus.ACTIVE);
                                          const statusMessage = getReturnWithdrawalStatusMessage(ret, inv?.status || InvestmentStatus.ACTIVE);
                                          return (
                                            <button 
                                              onClick={() => {
                                                if (canWithdraw) {
                                                  handleWithdrawReturns(ret);
                                                  setShowHistoryActionMenu(null);
                                                }
                                              }}
                                              disabled={!canWithdraw}
                                              className={`w-full flex items-center gap-3 p-3 text-left text-xs font-bold rounded-xl transition ${
                                                canWithdraw 
                                                  ? 'text-slate-600 hover:bg-rose-50 hover:text-rose-600' 
                                                  : 'text-slate-300 cursor-not-allowed'
                                              }`}
                                              title={statusMessage || ''}
                                            >
                                              <ArrowUpRight className="w-4 h-4" />
                                              {canWithdraw ? 'Withdrawal Return' : 'Restricted'}
                                            </button>
                                          );
                                        })()}
                                        <button 
                                          onClick={() => {
                                            const opp = opportunities.find(o => o.id === inv?.opportunityId);
                                            const partner = partners.find(p => p.legalCompanyName === opp?.partnerName);
                                            setReturnsCertificateToDownload({
                                              returnRecord: ret,
                                              investor: currentUser,
                                              opportunity: opp,
                                              partner: partner,
                                              investmentAmount: inv?.amount,
                                              issueDate: new Date().toLocaleDateString(),
                                              logo: config.growMilkatLogo || config.logo,
                                              ownerSignature: config.ownerSignature
                                            });
                                            setShowHistoryActionMenu(null);
                                          }}
                                          className="w-full flex items-center gap-3 p-3 text-left text-xs font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition"
                                        >
                                          <Download className="w-4 h-4" />
                                          Download Return Certificate
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={13} className="px-6 py-20 text-center text-slate-400 italic text-sm">No ROI returns found matching your criteria.</td>
                          </tr>
                        )
                      ) : historySubTab === 'dividend' ? (
                        filteredDividendReturns.length > 0 ? (
                          filteredDividendReturns.map((ret) => {
                            const inv = userInvestments.find(inv => inv.id === ret.investmentId);
                            const opp = opportunities.find(o => o.id === inv?.opportunityId);
                            const investmentAmount = inv?.amount || 0;
                            const dividendAmount = ret.amount;
                            const yieldPct = investmentAmount > 0 ? (dividendAmount / investmentAmount) * 100 : 0;

                            return (
                              <tr key={ret.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <p className="text-[10px] font-mono font-black text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">{ret.id}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <p className="text-sm font-bold text-slate-900">{ret.investmentTitle}</p>
                                  <p className="text-[10px] text-slate-400">Asset ID: #{ret.investmentId}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <p className="text-xs font-bold text-slate-700">{opp?.partnerName || 'N/A'}</p>
                                  <p className="text-[10px] text-slate-400">{opp?.location || 'N/A'}</p>
                                </td>
                                <td className="px-6 py-4 text-xs text-slate-600 whitespace-nowrap">{new Date(ret.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-black uppercase tracking-widest">{opp?.type || 'N/A'}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-xs text-slate-600 font-medium">{opp?.assetClass || 'N/A'}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-xs text-slate-600">{opp?.holdingPeriod || 'N/A'}</span>
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                  <p className="text-sm font-black text-blue-600">${(dividendAmount ?? 0).toLocaleString()}</p>
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                  <p className="text-sm font-bold text-blue-600">{yieldPct.toFixed(2)}%</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-xs text-slate-600">{opp?.payoutFrequency || 'N/A'}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-xs text-slate-600">{ret.type}</span>
                                </td>
                                <td className="px-6 py-4 text-center whitespace-nowrap">
                                  {inv ? (
                                    <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${
                                      inv.status === InvestmentStatus.ACTIVE ? 'text-emerald-600' : 
                                      inv.status === InvestmentStatus.INACTIVE ? 'text-slate-400' : 'text-amber-600'
                                    }`}>
                                      {inv.status === InvestmentStatus.INACTIVE ? <X className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />} {inv.status}
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                                      <CheckCircle className="w-3 h-3" /> Credited
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap relative">
                                  <div className="flex items-center justify-end gap-2">
                                    <button 
                                      onClick={() => {
                                        setHistorySubTab('withdraw');
                                        setHistorySearch(ret.investmentTitle);
                                      }}
                                      className="p-2 text-slate-400 hover:text-rose-600 transition flex items-center gap-1 group"
                                      title="View Withdrawals"
                                    >
                                      <Wallet className="w-4 h-4" />
                                      <span className="text-[10px] font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">Withdrawals</span>
                                    </button>
                                    <button 
                                      onClick={() => setShowHistoryActionMenu(showHistoryActionMenu === ret.id ? null : ret.id)}
                                      className="p-2 text-slate-400 hover:text-emerald-600 transition"
                                    >
                                      <MoreVertical className="w-4 h-4" />
                                    </button>
                                  </div>
                                  
                                  {showHistoryActionMenu === ret.id && (
                                    <>
                                      <div 
                                        className="fixed inset-0 z-[190] bg-slate-900/40 backdrop-blur-sm md:hidden"
                                        onClick={() => setShowHistoryActionMenu(null)}
                                      />
                                      <div className="fixed inset-x-4 bottom-4 z-[200] bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 md:absolute md:inset-auto md:right-12 md:top-1/2 md:-translate-y-1/2 md:z-[100] md:p-2 md:min-w-[200px] md:rounded-2xl animate-in fade-in slide-in-from-bottom-4 md:slide-in-from-right-4 duration-200">
                                        {(() => {
                                          const canWithdraw = canWithdrawReturn(ret, inv?.status || InvestmentStatus.ACTIVE);
                                          const statusMessage = getReturnWithdrawalStatusMessage(ret, inv?.status || InvestmentStatus.ACTIVE);
                                          return (
                                            <button 
                                              onClick={() => {
                                                if (canWithdraw) {
                                                  handleWithdrawReturns(ret);
                                                  setShowHistoryActionMenu(null);
                                                }
                                              }}
                                              disabled={!canWithdraw}
                                              className={`w-full flex items-center gap-3 p-3 text-left text-xs font-bold rounded-xl transition ${
                                                canWithdraw 
                                                  ? 'text-slate-600 hover:bg-rose-50 hover:text-rose-600' 
                                                  : 'text-slate-300 cursor-not-allowed'
                                              }`}
                                              title={statusMessage || ''}
                                            >
                                              <ArrowUpRight className="w-4 h-4" />
                                              {canWithdraw ? 'Withdrawal Return' : 'Restricted'}
                                            </button>
                                          );
                                        })()}
                                        <button 
                                          onClick={() => {
                                            const opp = opportunities.find(o => o.id === inv?.opportunityId);
                                            const partner = partners.find(p => p.legalCompanyName === opp?.partnerName);
                                            setReturnsCertificateToDownload({
                                              returnRecord: ret,
                                              investor: currentUser,
                                              opportunity: opp,
                                              partner: partner,
                                              investmentAmount: inv?.amount,
                                              issueDate: new Date().toLocaleDateString(),
                                              logo: config.growMilkatLogo || config.logo,
                                              ownerSignature: config.ownerSignature
                                            });
                                            setShowHistoryActionMenu(null);
                                          }}
                                          className="w-full flex items-center gap-3 p-3 text-left text-xs font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition"
                                        >
                                          <Download className="w-4 h-4" />
                                          Download Return Certificate
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={13} className="px-6 py-20 text-center text-slate-400 italic text-sm">No dividend returns found matching your criteria.</td>
                          </tr>
                        )
                      ) : (
                        filteredWithdrawals.length > 0 ? (
                          filteredWithdrawals.map((w) => (
                            <tr key={w.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <p className="text-[10px] font-mono font-black text-rose-600 bg-rose-50 px-2 py-1 rounded inline-block">{w.id}</p>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <p className="text-sm font-bold text-slate-900">{w.opportunityTitle}</p>
                                <p className="text-[10px] text-slate-400">Asset ID: #{w.investmentId}</p>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <p className="text-xs font-bold text-slate-700">{w.partnerName}</p>
                                <p className="text-[10px] text-slate-400">{w.location}</p>
                              </td>
                              <td className="px-6 py-4 text-xs text-slate-600 whitespace-nowrap">{new Date(w.date).toLocaleDateString()}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 bg-rose-50 text-rose-600 rounded text-[10px] font-black uppercase tracking-widest">{w.type}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-xs text-slate-600 font-medium">{w.assetClass}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-xs text-slate-600">{w.returnType}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-xs text-slate-600">{w.holdingPeriod}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-xs text-slate-600">{w.payoutFrequency}</span>
                              </td>
                              <td className="px-6 py-4 text-right whitespace-nowrap">
                                <p className="text-sm font-black text-slate-900">${(w.investmentAmount ?? 0).toLocaleString()}</p>
                              </td>
                              <td className="px-6 py-4 text-right whitespace-nowrap">
                                {(() => {
                                  const roi = ((w.withdrawalAmount - w.investmentAmount) / w.investmentAmount) * 100;
                                  return (
                                    <p className={`text-sm font-bold ${roi >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                      {roi >= 0 ? '+' : ''}{roi.toFixed(2)}%
                                    </p>
                                  );
                                })()}
                              </td>
                              <td className="px-6 py-4 text-right whitespace-nowrap">
                                <p className="text-sm font-black text-emerald-600">${(w.withdrawalAmount ?? 0).toLocaleString()}</p>
                              </td>
                              <td className="px-6 py-4 text-center whitespace-nowrap">
                                <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest ${
                                  w.status === WithdrawalStatus.APPROVED ? 'text-emerald-600' : 
                                  w.status === WithdrawalStatus.REJECTED ? 'text-rose-600' : 'text-amber-600'
                                }`}>
                                  {w.status === WithdrawalStatus.APPROVED ? <CheckCircle className="w-3 h-3" /> : 
                                   w.status === WithdrawalStatus.REJECTED ? <X className="w-3 h-3" /> : <Clock className="w-3 h-3" />} {w.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-2">
                                  {w.status === WithdrawalStatus.APPROVED && (
                                    <button 
                                      onClick={() => handleDownloadWithdrawalCertificate(w.id)}
                                      className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold hover:bg-emerald-100 transition"
                                      title={w.isReturnsWithdrawal ? "Download Returns Certificate" : "Download Withdrawal Certificate"}
                                    >
                                      <Download className="w-3.5 h-3.5" />
                                      Certificate
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => setShowHistoryActionMenu(showHistoryActionMenu === w.id ? null : w.id)}
                                    className="p-2 text-slate-400 hover:text-emerald-600 transition"
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </button>
                                  
                                  {showHistoryActionMenu === w.id && (
                                    <>
                                      <div 
                                        className="fixed inset-0 z-[190] bg-slate-900/40 backdrop-blur-sm md:hidden"
                                        onClick={() => setShowHistoryActionMenu(null)}
                                      />
                                      <div className="fixed inset-x-4 bottom-4 z-[200] bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 md:absolute md:inset-auto md:right-12 md:top-1/2 md:-translate-y-1/2 md:z-[100] md:p-2 md:min-w-[200px] md:rounded-2xl animate-in fade-in slide-in-from-bottom-4 md:slide-in-from-right-4 duration-200">
                                        <button 
                                          onClick={() => {
                                            handleDownloadWithdrawalCertificate(w.id);
                                            setShowHistoryActionMenu(null);
                                          }}
                                          disabled={w.status !== WithdrawalStatus.APPROVED}
                                          className={`w-full flex items-center gap-3 p-3 text-left text-xs font-bold rounded-xl transition ${
                                            w.status === WithdrawalStatus.APPROVED 
                                              ? 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-600' 
                                              : 'text-slate-300 cursor-not-allowed'
                                          }`}
                                        >
                                          <Download className="w-4 h-4" />
                                          {w.isReturnsWithdrawal ? 'Returns Certificate' : 'Withdrawal Certificate'}
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={14} className="px-6 py-20 text-center text-slate-400 italic text-sm">No withdrawals found matching your criteria.</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-12 animate-in slide-in-from-right duration-500">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 serif">Payment Gateways</h1>
                  <p className="text-slate-500 text-sm mt-1">Manage your funding sources and track transactions.</p>
                </div>
                <button 
                  onClick={() => setShowWithdrawModal(true)}
                  className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-600 transition text-sm"
                >
                  <ArrowUpRight className="w-4 h-4" /> Withdraw Funds
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { id: 'card', icon: <CreditCard />, label: 'Card Payment', desc: 'Secure Visa/Mastercard processing' },
                  { id: 'upi', icon: <Smartphone />, label: 'UPI Transfer', desc: 'Instant mobile-first payments' },
                  { id: 'netbanking', icon: <Landmark />, label: 'Net Banking', desc: 'Direct institutional bank sync' },
                  { id: 'razorpay', icon: <Zap />, label: 'Razorpay', desc: 'Connect your Razorpay account' },
                  { id: 'paypal', icon: <Globe />, label: 'PayPal', desc: 'International payment processing' }
                ].map((gateway) => (
                  <div 
                    key={gateway.id} 
                    onClick={() => setLinkingGateway(gateway.id as any)}
                    className={`bg-white p-8 rounded-2xl border transition-all group cursor-pointer ${linkingGateway === gateway.id ? 'border-emerald-500 ring-2 ring-emerald-500/10' : 'border-slate-100 hover:border-emerald-200'}`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors mb-6 ${linkingGateway === gateway.id ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:text-emerald-600'}`}>
                      {React.cloneElement(gateway.icon as React.ReactElement, { className: "w-6 h-6" })}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{gateway.label}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-6">{gateway.desc}</p>
                    <button className={`w-full py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition ${linkingGateway === gateway.id ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white hover:bg-emerald-600'}`}>
                      {linkingGateway === gateway.id ? 'Selected' : 'Connect Gateway'}
                    </button>
                  </div>
                ))}
              </div>

              {/* Gateway Linking Forms */}
              <AnimatePresence>
                {linkingGateway && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold serif">Link {linkingGateway === 'card' ? 'Credit/Debit Card' : linkingGateway === 'upi' ? 'UPI ID' : 'Bank Account'}</h3>
                      <button onClick={() => setLinkingGateway(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      {linkingGateway === 'card' && (
                        <>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Card Number</label>
                            <input 
                              type="text" 
                              placeholder="0000 0000 0000 0000"
                              className={`w-full p-4 border rounded-xl text-sm outline-none transition ${paymentErrors.number ? 'border-rose-500' : 'border-slate-200 focus:border-emerald-500'}`}
                              value={cardDetails.number}
                              onChange={e => setCardDetails({...cardDetails, number: e.target.value})}
                            />
                            {paymentErrors.number && <p className="text-[10px] text-rose-500 font-bold">{paymentErrors.number}</p>}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Expiry</label>
                              <input 
                                type="text" 
                                placeholder="MM/YY"
                                className={`w-full p-4 border rounded-xl text-sm outline-none transition ${paymentErrors.expiry ? 'border-rose-500' : 'border-slate-200 focus:border-emerald-500'}`}
                                value={cardDetails.expiry}
                                onChange={e => setCardDetails({...cardDetails, expiry: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">CVC</label>
                              <input 
                                type="text" 
                                placeholder="123"
                                className={`w-full p-4 border rounded-xl text-sm outline-none transition ${paymentErrors.cvc ? 'border-rose-500' : 'border-slate-200 focus:border-emerald-500'}`}
                                value={cardDetails.cvc}
                                onChange={e => setCardDetails({...cardDetails, cvc: e.target.value})}
                              />
                            </div>
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cardholder Name</label>
                            <input 
                              type="text" 
                              placeholder="John Doe"
                              className={`w-full p-4 border rounded-xl text-sm outline-none transition ${paymentErrors.name ? 'border-rose-500' : 'border-slate-200 focus:border-emerald-500'}`}
                              value={cardDetails.name}
                              onChange={e => setCardDetails({...cardDetails, name: e.target.value})}
                            />
                          </div>
                        </>
                      )}

                      {linkingGateway === 'upi' && (
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">UPI ID</label>
                          <input 
                            type="text" 
                            placeholder="username@bank"
                            className={`w-full p-4 border rounded-xl text-sm outline-none transition ${paymentErrors.upi ? 'border-rose-500' : 'border-slate-200 focus:border-emerald-500'}`}
                            value={upiId}
                            onChange={e => setUpiId(e.target.value)}
                          />
                          {paymentErrors.upi && <p className="text-[10px] text-rose-500 font-bold">{paymentErrors.upi}</p>}
                        </div>
                      )}

                      {linkingGateway === 'netbanking' && (
                        <>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Account Number</label>
                            <input 
                              type="text" 
                              placeholder="Enter account number"
                              className={`w-full p-4 border rounded-xl text-sm outline-none transition ${paymentErrors.account ? 'border-rose-500' : 'border-slate-200 focus:border-emerald-500'}`}
                              value={bankDetails.account}
                              onChange={e => setBankDetails({...bankDetails, account: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">IFSC Code</label>
                            <input 
                              type="text" 
                              placeholder="HDFC0001234"
                              className={`w-full p-4 border rounded-xl text-sm outline-none transition ${paymentErrors.ifsc ? 'border-rose-500' : 'border-slate-200 focus:border-emerald-500'}`}
                              value={bankDetails.ifsc}
                              onChange={e => setBankDetails({...bankDetails, ifsc: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bank Name</label>
                            <input 
                              type="text" 
                              placeholder="HDFC Bank"
                              className={`w-full p-4 border rounded-xl text-sm outline-none transition ${paymentErrors.bankName ? 'border-rose-500' : 'border-slate-200 focus:border-emerald-500'}`}
                              value={bankDetails.bankName}
                              onChange={e => setBankDetails({...bankDetails, bankName: e.target.value})}
                            />
                          </div>
                        </>
                      )}

                      {linkingGateway === 'razorpay' && (
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Razorpay Merchant ID / Account ID</label>
                          <input 
                            type="text" 
                            placeholder="acc_Hl8..."
                            className={`w-full p-4 border rounded-xl text-sm outline-none transition ${paymentErrors.razorpay ? 'border-rose-500' : 'border-slate-200 focus:border-emerald-500'}`}
                            value={razorpayId}
                            onChange={e => setRazorpayId(e.target.value)}
                          />
                          {paymentErrors.razorpay && <p className="text-[10px] text-rose-500 font-bold">{paymentErrors.razorpay}</p>}
                        </div>
                      )}

                      {linkingGateway === 'paypal' && (
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">PayPal Email Address</label>
                          <input 
                            type="email" 
                            placeholder="your-email@example.com"
                            className={`w-full p-4 border rounded-xl text-sm outline-none transition ${paymentErrors.paypal ? 'border-rose-500' : 'border-slate-200 focus:border-emerald-500'}`}
                            value={paypalEmail}
                            onChange={e => setPaypalEmail(e.target.value)}
                          />
                          {paymentErrors.paypal && <p className="text-[10px] text-rose-500 font-bold">{paymentErrors.paypal}</p>}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button 
                        onClick={handleLinkGateway}
                        className="flex-grow py-4 bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-emerald-700 transition shadow-lg shadow-emerald-200"
                      >
                        Verify & Link Account
                      </button>
                      <button 
                        onClick={() => setLinkingGateway(null)}
                        className="px-8 py-4 bg-slate-100 text-slate-600 rounded-xl font-black uppercase tracking-widest hover:bg-slate-200 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* History Payment Done */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <History className="w-5 h-5 text-slate-400" />
                    <h2 className="text-xl font-bold serif">Transaction History</h2>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[8px] font-black uppercase tracking-widest">Deposits</span>
                    <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[8px] font-black uppercase tracking-widest">Withdrawals</span>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction ID</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Method</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {paymentHistory.map((pay, idx) => (
                        <tr key={`payment-${pay.id}-${idx}`} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 text-xs font-mono text-slate-500">{pay.id}</td>
                          <td className="px-6 py-4 text-xs text-slate-600">{new Date(pay.date).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-xs font-bold text-slate-700">{pay.method}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${pay.type === 'Deposit' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                              {pay.type}
                            </span>
                          </td>
                          <td className={`px-6 py-4 text-right font-black ${pay.type === 'Deposit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {pay.type === 'Deposit' ? '+' : '-'}${(pay.amount ?? 0).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest ${pay.status === 'Completed' ? 'text-emerald-600' : 'text-amber-600'}`}>
                              {pay.status === 'Completed' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />} {pay.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4">
                <Shield className="w-5 h-5 text-emerald-600" />
                <p className="text-xs text-emerald-700 font-medium">All payment gateways are PCI-DSS compliant and secured with 256-bit encryption.</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8 animate-in slide-in-from-right duration-500">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 serif">System Settings</h1>
                  <p className="text-slate-500 text-sm mt-1">Personalize your investment experience.</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="p-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { icon: <User />, label: "Profile", desc: "Legal identity & KYC", tab: 'profile' as DashboardTab },
                    { icon: <Bell />, label: "Notifications", desc: "Alert & newsletter settings", tab: 'notifications' as DashboardTab },
                    { icon: <Lock />, label: "Security", desc: "Password & 2FA" },
                    { icon: <TrendingUp />, label: "In-Depth Data Analysis", desc: "Advanced portfolio insights", tab: 'analysis' as DashboardTab },
                    { icon: <History />, label: "History", desc: "View all past activities", tab: 'history' as DashboardTab },
                    { icon: <Shield />, label: "KYC Verification", desc: "Manage identity documents", tab: 'kyc' as DashboardTab },
                    { icon: <CreditCard />, label: "Payment-Gateway", desc: "Manage linked accounts", tab: 'payments' as DashboardTab },
                    { icon: <Globe />, label: "Market Opportunities", desc: "Explore new assets", tab: 'market' as DashboardTab },
                    { icon: <Download />, label: "Data", desc: "Export personal records", onClick: () => setShowSystemDataExportModal(true) },
                    { icon: <HelpCircle />, label: "Support", desc: "Contact concierge", tab: 'support' as DashboardTab }
                  ].map((f) => (
                    <div 
                      key={f.label} 
                      id={f.label === "Data" ? "system-data-export-card" : undefined}
                      onClick={() => {
                        if (f.tab) onTabChange(f.tab);
                        if (f.onClick) f.onClick();
                      }}
                      className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-900 transition-all group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-slate-400 group-hover:text-slate-900 transition-colors mb-4 border border-slate-100">
                        {React.cloneElement(f.icon as React.ReactElement, { className: "w-5 h-5" })}
                      </div>
                      <h5 className="text-sm font-bold text-slate-900 mb-1">{f.label}</h5>
                      <p className="text-[10px] text-slate-400 leading-relaxed uppercase font-black tracking-widest">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && currentUser && (
            <div className="space-y-8 animate-in slide-in-from-right duration-500">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900 serif">Investor Profile</h1>
                {!isEditingProfile ? (
                  <button 
                    onClick={() => setIsEditingProfile(true)}
                    className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setIsEditingProfile(false)}
                      className="px-6 py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSaveProfile}
                      className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
              <div className="bg-white p-8 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative group">
                    <div className="w-24 h-24 bg-slate-100 rounded-full border-2 border-white shadow-sm overflow-hidden">
                      <img src={isEditingProfile ? editedProfile.avatar : currentUser.avatar} className="w-full h-full object-cover" alt="" />
                    </div>
                    {isEditingProfile && (
                      <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-6 h-6 text-white" />
                        <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                      </label>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{currentUser.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      {currentUser.kycStatus === 'Verified' && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                          <CheckCircle className="w-3 h-3" /> Verified
                        </span>
                      )}
                      {currentUser.kycStatus === 'Pending' && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-amber-100">
                          <Clock className="w-3 h-3" /> KYC Pending
                        </span>
                      )}
                      {currentUser.kycStatus === 'Rejected' && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-rose-50 text-rose-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-rose-100">
                          <AlertTriangle className="w-3 h-3" /> KYC Rejected
                        </span>
                      )}
                      <p className="text-slate-400 font-black uppercase tracking-widest text-[9px]">Accredited Investor</p>
                    </div>
                    <div className="mt-3">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-mono font-bold border border-slate-200">
                        ID: {currentUser.investorUniqueId}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Basic Info */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <User className="w-4 h-4" /> Personal Information
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Full Name</p>
                        {isEditingProfile ? (
                          <input 
                            type="text" 
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                            value={editedProfile.name || ''}
                            onChange={e => setEditedProfile({...editedProfile, name: e.target.value})}
                          />
                        ) : (
                          <p className="font-bold text-slate-900 text-sm">{currentUser.name}</p>
                        )}
                      </div>
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
                        {isEditingProfile ? (
                          <input 
                            type="email" 
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                            value={editedProfile.email || ''}
                            onChange={e => setEditedProfile({...editedProfile, email: e.target.value})}
                          />
                        ) : (
                          <p className="font-bold text-slate-900 text-sm">{currentUser.email}</p>
                        )}
                      </div>
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Phone Number</p>
                        {isEditingProfile ? (
                          <input 
                            type="text" 
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                            value={editedProfile.phone || ''}
                            onChange={e => setEditedProfile({...editedProfile, phone: e.target.value})}
                          />
                        ) : (
                          <p className="font-bold text-slate-900 text-sm">{currentUser.phone || 'Not provided'}</p>
                        )}
                      </div>
                      {isEditingProfile && (
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Account Password</p>
                          <div className="relative">
                            <input 
                              type="password" 
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                              value={editedProfile.password || ''}
                              onChange={e => setEditedProfile({...editedProfile, password: e.target.value})}
                              placeholder="Enter new password"
                            />
                            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Address Info */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Residential Address
                    </h3>
                    <div className="space-y-4">
                      {isEditingProfile ? (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Street Address</p>
                            <input 
                              type="text" 
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                              value={typeof editedProfile.address === 'object' ? editedProfile.address.street : ''}
                              onChange={e => setEditedProfile({
                                ...editedProfile, 
                                address: { ...(editedProfile.address as any), street: e.target.value }
                              })}
                            />
                          </div>
                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">City</p>
                            <input 
                              type="text" 
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                              value={typeof editedProfile.address === 'object' ? editedProfile.address.city : ''}
                              onChange={e => setEditedProfile({
                                ...editedProfile, 
                                address: { ...(editedProfile.address as any), city: e.target.value }
                              })}
                            />
                          </div>
                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pincode</p>
                            <input 
                              type="text" 
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                              value={typeof editedProfile.address === 'object' ? editedProfile.address.pincode : ''}
                              onChange={e => setEditedProfile({
                                ...editedProfile, 
                                address: { ...(editedProfile.address as any), pincode: e.target.value }
                              })}
                            />
                          </div>
                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">State</p>
                            <input 
                              type="text" 
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                              value={typeof editedProfile.address === 'object' ? editedProfile.address.state : ''}
                              onChange={e => setEditedProfile({
                                ...editedProfile, 
                                address: { ...(editedProfile.address as any), state: e.target.value }
                              })}
                            />
                          </div>
                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Country</p>
                            <input 
                              type="text" 
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                              value={typeof editedProfile.address === 'object' ? editedProfile.address.country : ''}
                              onChange={e => setEditedProfile({
                                ...editedProfile, 
                                address: { ...(editedProfile.address as any), country: e.target.value }
                              })}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Full Address</p>
                          <p className="font-bold text-slate-900 text-sm">
                            {typeof currentUser.address === 'string' 
                              ? currentUser.address 
                              : `${currentUser.address.street}, ${currentUser.address.city}, ${currentUser.address.pincode}, ${currentUser.address.state}, ${currentUser.address.country}`}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="space-y-8 animate-in slide-in-from-right duration-500">
              <h1 className="text-3xl font-bold text-slate-900 serif">Concierge Support</h1>
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-100 space-y-6">
                  <h3 className="text-xl font-bold serif">Submit a Request</h3>
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject</label>
                        <input type="text" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                        <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm">
                          <option>KYC</option>
                          <option>Payments Gateway</option>
                          <option>Investment Inquiry</option>
                          <option>Technical Issue</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Message</label>
                      <textarea className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg h-24 outline-none text-sm"></textarea>
                    </div>
                    <button className="w-full py-3 bg-slate-900 text-white rounded-lg font-black uppercase text-[10px] tracking-widest hover:bg-emerald-600 transition">Send Message</button>
                  </form>
                </div>
                <div className="space-y-6">
                  <div className="bg-emerald-600 p-8 rounded-2xl text-white">
                    <h3 className="text-lg font-bold serif mb-2">Live Chat</h3>
                    <p className="text-xs text-emerald-100 mb-6">Connect with a dedicated advisor in real-time.</p>
                    <button 
                      onClick={() => {
                        if (window.Tawk_API) {
                          window.Tawk_API.maximize();
                        }
                      }}
                      className="w-full py-3 bg-white text-emerald-600 rounded-lg font-black uppercase text-[10px] tracking-widest hover:bg-emerald-50 transition"
                    >
                      Start Chat
                    </button>
                  </div>
                  <div className="bg-white p-8 rounded-2xl border border-slate-100">
                    <h3 className="text-lg font-bold serif mb-4">FAQ</h3>
                    <div className="space-y-3">
                      {['How do I withdraw?', 'What are the fees?', 'Is my data secure?'].map((q) => (
                        <div key={q} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition">
                          <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">{q}</span>
                          <ChevronRight className="w-3 h-3 text-slate-300" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'waitlist' && (
            <div className="space-y-8 animate-in slide-in-from-right duration-500">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 serif">My Waitlist</h1>
                  <p className="text-slate-500 text-sm mt-1">Assets you're tracking for future investment.</p>
                </div>
              </div>

              {waitlistIds.length === 0 ? (
                <div className="bg-white p-16 rounded-[2.5rem] border border-slate-100 text-center shadow-sm">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Bookmark className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Your waitlist is empty</h3>
                  <p className="text-slate-500 max-w-md mx-auto mb-8">Save opportunities you're interested in to track their progress and get notified when they're close to closing.</p>
                  <button 
                    onClick={() => onTabChange('market')}
                    className="px-8 py-3 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest hover:bg-emerald-600 transition shadow-xl shadow-slate-900/10"
                  >
                    Explore Opportunities
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {opportunities.filter(o => waitlistIds.includes(o.id)).map((opp) => {
                    const isFull = opp.raisedAmount >= opp.targetAmount;
                    return (
                      <div 
                        key={opp.id} 
                        onClick={() => !isFull && handleSelectOpp(opp)}
                        className={`group cursor-pointer bg-white rounded-3xl overflow-hidden border transition-all duration-500 flex flex-col relative ${
                          isFull 
                            ? 'border-slate-200 opacity-90 cursor-not-allowed' 
                            : 'border-slate-100 hover:border-emerald-500 hover:shadow-2xl'
                        }`}
                      >
                        <div className="h-48 overflow-hidden relative">
                          <img src={opp.imageUrl} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" alt={opp.title} />
                          <div className="absolute top-4 right-4 z-20 flex gap-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleWaitlist(opp.id);
                              }}
                              className="p-2 bg-emerald-600 text-white rounded-full shadow-lg border border-emerald-500 transition-colors"
                            >
                              <Bookmark className="w-4 h-4 fill-current" />
                            </button>
                          </div>
                        </div>
                        <div className="p-8 flex-grow flex flex-col">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-bold text-xl text-slate-900 group-hover:text-emerald-600 transition-colors">{opp.title}</h3>
                            <span className="text-emerald-600 font-black">{opp.expectedROI}</span>
                          </div>
                          <div className="flex flex-col gap-1.5 mb-6">
                            <div className="flex items-center text-slate-400 text-[10px] font-bold">
                              <MapPin className="w-3 h-3 mr-1.5" /> {opp.location}
                            </div>
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                              Partner: <span className="text-slate-900">{opp.partnerName || 'Institutional'}</span>
                            </div>
                          </div>
                          <p className="text-slate-500 text-sm line-clamp-2 mb-6">{opp.description}</p>
                          <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
                            <div>
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Min. Entry</p>
                              <p className="font-bold text-slate-900">${(opp.minInvestment ?? 0).toLocaleString()}</p>
                            </div>
                            <button 
                              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
            </>
          )}
        </div>
      </div>

      {/* Quick Invest Modal */}
      {quickInvestOpp && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setQuickInvestOpp(null)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl md:rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="absolute top-0 right-0 z-20 p-6">
              <button onClick={() => setQuickInvestOpp(null)} className="p-2 hover:bg-slate-100 rounded-full transition bg-white/50 backdrop-blur-sm">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 md:p-10 custom-scrollbar">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold serif text-slate-900">Quick Invest</h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <img src={quickInvestOpp.imageUrl} className="w-16 h-16 rounded-xl object-cover" alt="" />
                  <div>
                    <p className="font-bold text-slate-900">{quickInvestOpp.title}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{quickInvestOpp.expectedROI} Returns</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Investment Amount ($)</label>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                      (quickInvestOpp.targetAmount - quickInvestOpp.raisedAmount) < 1000 ? 'text-rose-500 animate-pulse' : 'text-slate-400'
                    }`}>
                      Remaining: ${((quickInvestOpp.targetAmount ?? 0) - (quickInvestOpp.raisedAmount ?? 0)).toLocaleString()}
                    </span>
                  </div>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="number" 
                      min={quickInvestOpp.minInvestment}
                      max={quickInvestOpp.targetAmount - quickInvestOpp.raisedAmount}
                      className={`w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl font-black text-lg outline-none transition-all ${
                        investAmount > (quickInvestOpp.targetAmount - quickInvestOpp.raisedAmount) 
                          ? 'border-rose-500 ring-2 ring-rose-500/10 text-rose-600' 
                          : 'border-slate-200 focus:ring-2 focus:ring-emerald-500/20'
                      }`}
                      value={investAmount}
                      onChange={(e) => setInvestAmount(Number(e.target.value))}
                    />
                  </div>
                  {investAmount > (quickInvestOpp.targetAmount - quickInvestOpp.raisedAmount) ? (
                    <p className="text-[10px] text-rose-500 font-bold flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Remaining available amount to ${ ((quickInvestOpp.targetAmount ?? 0) - (quickInvestOpp.raisedAmount ?? 0)).toLocaleString() }
                    </p>
                  ) : (
                    <p className="text-[10px] text-slate-500 italic">Min. entry: ${(quickInvestOpp.minInvestment ?? 0).toLocaleString()}</p>
                  )}
                </div>

                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">
                    Your capital is protected by institutional-grade smart contracts and legal SPV structures.
                  </p>
                </div>

                <button 
                  disabled={investAmount > (quickInvestOpp.targetAmount - quickInvestOpp.raisedAmount) || investAmount < quickInvestOpp.minInvestment}
                  onClick={() => {
                    onInvest(quickInvestOpp, investAmount);
                    setShowConfirmation({ show: true, opp: quickInvestOpp.title, amount: investAmount });
                    setQuickInvestOpp(null);
                  }}
                  className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition shadow-xl flex items-center justify-center gap-2 ${
                    investAmount > (quickInvestOpp.targetAmount - quickInvestOpp.raisedAmount) || investAmount < quickInvestOpp.minInvestment
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                      : 'bg-slate-900 text-white hover:bg-emerald-600'
                  }`}
                >
                  Confirm Allocation <ArrowUpRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in" onClick={() => setShowConfirmation(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl md:rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-center">
            <div className="overflow-y-auto p-6 md:p-10 custom-scrollbar">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold serif mb-2">Allocation Confirmed</h2>
              <p className="text-slate-500 mb-8 leading-relaxed">Successfully allocated <span className="font-bold text-slate-900">${(showConfirmation.amount ?? 0).toLocaleString()}</span> to the <span className="font-bold text-slate-900">{showConfirmation.opp}</span> portfolio.</p>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setShowConfirmation(null)}
                  className="py-4 bg-slate-100 rounded-2xl font-bold text-slate-600 hover:bg-slate-200 transition"
                >
                  Close
                </button>
                <button 
                  onClick={() => { setShowConfirmation(null); onTabChange('history'); }}
                  className="py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition flex items-center justify-center gap-2"
                >
                  View History <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System Data Export Modal */}
      <AnimatePresence>
        {showSystemDataExportModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white max-w-md w-full rounded-3xl md:rounded-[2.5rem] shadow-2xl border border-slate-100 relative flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="absolute top-0 right-0 z-20 p-6">
                <button onClick={() => setShowSystemDataExportModal(false)} className="text-slate-300 hover:text-slate-600 transition bg-white/50 backdrop-blur-sm rounded-full p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto p-6 md:p-10 custom-scrollbar">
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-emerald-600">
                    <Download className="w-8 h-8" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold serif text-slate-900">Data Export</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">Configure your data export settings below.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">1. Select Period</label>
                      <select 
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                        value={systemExportPeriod}
                        onChange={(e) => setSystemExportPeriod(e.target.value)}
                      >
                        <option>Last 30 days</option>
                        <option>Last 90 Days</option>
                        <option>Last 180 days</option>
                        <option>Last 6 month</option>
                        <option>Date to Date Range</option>
                      </select>
                    </div>

                    {systemExportPeriod === 'Date to Date Range' && (
                      <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Start Date</label>
                          <input 
                            type="date" 
                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                            value={systemExportDateRange.start}
                            onChange={(e) => setSystemExportDateRange({...systemExportDateRange, start: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">End Date</label>
                          <input 
                            type="date" 
                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                            value={systemExportDateRange.end}
                            onChange={(e) => setSystemExportDateRange({...systemExportDateRange, end: e.target.value})}
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">2. Which Data You Want</label>
                      <select 
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                        value={systemExportDataType}
                        onChange={(e) => setSystemExportDataType(e.target.value)}
                      >
                        <option>Detailed Asset Performance</option>
                        <option>Total Investment</option>
                        <option>Total Rent Gain</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSystemDataExport}
                      className="flex-grow py-4 bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-700 transition shadow-lg shadow-emerald-200"
                    >
                      Export PDF
                    </button>
                    <button
                      onClick={() => setShowSystemDataExportModal(false)}
                      className="px-6 py-4 bg-slate-50 text-slate-600 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Withdraw Modal */}
      <AnimatePresence>
        {showWithdrawModal && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white max-w-lg w-full rounded-3xl md:rounded-[2.5rem] shadow-2xl border border-slate-100 relative flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="absolute top-0 right-0 z-20 p-6">
                <button onClick={() => setShowWithdrawModal(false)} className="text-slate-300 hover:text-slate-600 transition bg-white/50 backdrop-blur-sm rounded-full p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto p-6 md:p-10 custom-scrollbar">
                <div className="space-y-8">
                  <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
                    <ArrowUpRight className="w-8 h-8" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold serif text-slate-900">Withdraw Funds</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">Select an asset to withdraw your capital and gains.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Select Asset</label>
                      <select 
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                        value={withdrawAssetId}
                        onChange={(e) => setWithdrawAssetId(e.target.value)}
                      >
                        <option value="">Choose an investment...</option>
                        {userInvestments.filter(inv => {
                          const canWithdraw = canWithdrawFromInvestment(inv.id, withdrawals);
                          return inv.status === InvestmentStatus.ACTIVE && canWithdraw;
                        }).map(inv => (
                          <option key={inv.id} value={inv.id}>{inv.opportunityTitle} (${(inv.amount ?? 0).toLocaleString()})</option>
                        ))}
                      </select>
                    </div>

                    {withdrawCalculation && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-4 p-6 bg-slate-50 rounded-2xl border border-slate-100"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Invested Amount</p>
                            <p className="text-lg font-bold text-slate-900">${(withdrawCalculation.investmentAmount ?? 0).toLocaleString()}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Gains</p>
                            <p className="text-lg font-bold text-emerald-600">${(withdrawCalculation.totalGains ?? 0).toLocaleString()}</p>
                          </div>
                          {withdrawCalculation.withdrawnGains > 0 && (
                            <div className="space-y-1">
                              <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Already Withdrawn</p>
                              <p className="text-lg font-bold text-rose-600">-${(withdrawCalculation.withdrawnGains ?? 0).toLocaleString()}</p>
                            </div>
                          )}
                          <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Gain</p>
                            <p className="text-lg font-bold text-emerald-600">${(withdrawCalculation.gainAmount ?? 0).toLocaleString()}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Value</p>
                            <p className="text-lg font-bold text-slate-900">${(withdrawCalculation.totalValue ?? 0).toLocaleString()}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Holding Period</p>
                            <p className="text-lg font-bold text-slate-900">{withdrawCalculation.diffDays} Days</p>
                          </div>
                        </div>

                        <div className="h-px bg-slate-200 my-2" />

                        {withdrawCalculation.isUnderHoldingPeriod ? (
                          <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-rose-50 rounded-xl border border-rose-100">
                              <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5" />
                              <p className="text-[10px] text-rose-800 font-medium leading-relaxed">
                                Early withdrawal (before 365 days) incurs a <span className="font-bold">5% fine</span> on the principal. Gains are included in the final amount.
                              </p>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-slate-600">Invested Amount:</span>
                              <span className="text-xs font-bold text-slate-900">${(withdrawCalculation.investmentAmount ?? 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-slate-600">Total Gains:</span>
                              <span className="text-xs font-bold text-emerald-600">+${(withdrawCalculation.totalGains ?? 0).toLocaleString()}</span>
                            </div>
                            {withdrawCalculation.withdrawnGains > 0 && (
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-rose-600">Already Withdrawn:</span>
                                <span className="text-xs font-bold text-rose-600">-${(withdrawCalculation.withdrawnGains ?? 0).toLocaleString()}</span>
                              </div>
                            )}
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-slate-600">Net Gain Amount:</span>
                              <span className="text-xs font-bold text-emerald-600">+${(withdrawCalculation.gainAmount ?? 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-slate-600">Fine Amount (5%):</span>
                              <span className="text-xs font-bold text-rose-600">-${(withdrawCalculation.fineAmount ?? 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-900 rounded-xl">
                              <span className="text-xs font-bold text-white">Final Withdrawal:</span>
                              <span className="text-lg font-black text-white">${(withdrawCalculation.finalWithdrawAmount ?? 0).toLocaleString()}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                              <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5" />
                              <p className="text-[10px] text-emerald-800 font-medium leading-relaxed">
                                Holding period completed. You are eligible for full withdrawal of principal and gains.
                              </p>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-slate-600">Invested Amount:</span>
                              <span className="text-xs font-bold text-slate-900">${(withdrawCalculation.investmentAmount ?? 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-slate-600">Total Gains:</span>
                              <span className="text-xs font-bold text-emerald-600">+${(withdrawCalculation.totalGains ?? 0).toLocaleString()}</span>
                            </div>
                            {withdrawCalculation.withdrawnGains > 0 && (
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-rose-600">Already Withdrawn:</span>
                                <span className="text-xs font-bold text-rose-600">-${(withdrawCalculation.withdrawnGains ?? 0).toLocaleString()}</span>
                              </div>
                            )}
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-slate-600">Net Gain Amount:</span>
                              <span className="text-xs font-bold text-emerald-600">+${(withdrawCalculation.gainAmount ?? 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-900 rounded-xl">
                              <span className="text-xs font-bold text-white">Final Withdrawal:</span>
                              <span className="text-lg font-black text-white">${(withdrawCalculation.finalWithdrawAmount ?? 0).toLocaleString()}</span>
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">How much do you want to withdraw?</label>
                          <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                              type="text" 
                              readOnly
                              className="w-full pl-10 pr-4 py-4 bg-white border border-slate-200 rounded-xl text-sm font-black outline-none"
                              value={withdrawCalculation.finalWithdrawAmount}
                            />
                          </div>
                          <p className="text-[10px] text-slate-400 italic text-center">Note: Only full withdrawal is allowed as per policy.</p>
                        </div>
                      </motion.div>
                    )}

                    <div className="flex gap-4">
                      <button 
                        disabled={!withdrawAssetId}
                        onClick={handleWithdraw}
                        className={`flex-grow py-4 rounded-xl font-black uppercase tracking-widest transition shadow-lg ${
                          !withdrawAssetId 
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                            : 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-200'
                        }`}
                      >
                        Confirm Withdrawal
                      </button>
                      <button 
                        onClick={() => {
                          setShowWithdrawModal(false);
                          setWithdrawAssetId('');
                        }}
                        className="px-8 py-4 bg-slate-100 text-slate-600 rounded-xl font-black uppercase tracking-widest hover:bg-slate-200 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Withdrawal Success Modal */}
      <AnimatePresence>
        {showWithdrawSuccess && lastWithdrawal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 serif mb-2">Withdrawal Successful</h2>
                <p className="text-slate-500 text-sm mb-8">
                  Your withdrawal request for <span className="font-bold text-slate-900">{lastWithdrawal.opportunityTitle}</span> has been processed successfully.
                </p>

                <div className="bg-slate-50 rounded-2xl p-6 space-y-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Amount Withdrawn</span>
                    <span className="text-lg font-black text-emerald-600">${(lastWithdrawal.withdrawalAmount ?? 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Transaction ID</span>
                    <span className="text-xs font-mono font-bold text-slate-900">{lastWithdrawal.id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Date</span>
                    <span className="text-xs font-bold text-slate-900">{new Date(lastWithdrawal.date).toLocaleDateString()}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setShowWithdrawSuccess(false)}
                  className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest hover:bg-emerald-600 transition shadow-lg shadow-slate-200"
                >
                  Got it, thanks!
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Hidden Certificate for Download */}
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          {certificateToDownload && (
            <div>
              <InvestmentCertificate 
                investment={certificateToDownload.investment}
                investor={certificateToDownload.investor}
                opportunity={certificateToDownload.opportunity}
                partner={certificateToDownload.partner}
                issueDate={certificateToDownload.issueDate}
                logo={certificateToDownload.logo}
                ownerSignature={certificateToDownload.ownerSignature}
              />
            </div>
          )}
          {withdrawalCertificateToDownload && (
            <div>
              <WithdrawalCertificate 
                withdrawal={withdrawalCertificateToDownload.withdrawal}
                investor={withdrawalCertificateToDownload.investor}
                opportunity={withdrawalCertificateToDownload.opportunity}
                partner={withdrawalCertificateToDownload.partner}
                issueDate={withdrawalCertificateToDownload.issueDate}
                logo={withdrawalCertificateToDownload.logo}
                ownerSignature={withdrawalCertificateToDownload.ownerSignature}
              />
            </div>
          )}
          {returnsCertificateToDownload && (
            <div>
              <ReturnsCertificate 
                returnRecord={returnsCertificateToDownload.returnRecord}
                investor={returnsCertificateToDownload.investor}
                opportunity={returnsCertificateToDownload.opportunity}
                partner={returnsCertificateToDownload.partner}
                issueDate={returnsCertificateToDownload.issueDate}
                logo={returnsCertificateToDownload.logo}
                ownerSignature={returnsCertificateToDownload.ownerSignature}
                investmentAmount={returnsCertificateToDownload.investmentAmount}
              />
            </div>
          )}
          {returnWithdrawalCertificateToDownload && (
            <div>
              <ReturnWithdrawalCertificate 
                withdrawal={returnWithdrawalCertificateToDownload.withdrawal}
                investor={returnWithdrawalCertificateToDownload.investor}
                opportunity={returnWithdrawalCertificateToDownload.opportunity}
                partner={returnWithdrawalCertificateToDownload.partner}
                issueDate={returnWithdrawalCertificateToDownload.issueDate}
                logo={returnWithdrawalCertificateToDownload.logo}
                ownerSignature={returnWithdrawalCertificateToDownload.ownerSignature}
              />
            </div>
          )}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default UserDashboard;
