
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart as RePieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { motion } from 'framer-motion';
import { Opportunity, InvestmentType, ReturnType, RiskLevel, Investor, InvestmentStatus, ReturnRecord, InvestmentRecord, PaymentRecord, NotificationType, WithdrawalRecord, Notification, Testimonial, TestimonialType, Partner, PartnerTeamMember, TeamMember, FAQ, FAQCategory, LegalSection, WithdrawalStatus, BlogPost } from '../types';
import InvestmentCertificate from './InvestmentCertificate';
import WithdrawalCertificate from './WithdrawalCertificate';
import ReturnWithdrawalCertificate from './ReturnWithdrawalCertificate';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { 
  PlusCircle, Plus, Layout, Users, Settings, Edit3, Trash2, X,
  Search, ShieldCheck, DollarSign, Download, Filter, Eye, Upload, Info,
  MoreVertical, CheckCircle, Globe, Lock, Bell, Activity, Database,
  Image as ImageIcon, Video, FileText, Link as LinkIcon, PieChart,
  Type, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6,
  BarChart3, RefreshCcw, Send, AlertCircle, TrendingUp, Clock, CreditCard,
  Briefcase, MessageSquare, MapPin, Phone, Mail, User, Shield, Zap, Home,
  ChevronRight, ChevronLeft, ArrowUpRight, LogOut, HelpCircle, Wallet,
  SlidersHorizontal, UserCheck, Play, Linkedin, Twitter, Instagram, Building2,
  List, ListOrdered, FileBadge, Calendar
} from 'lucide-react';

interface AdminPanelProps {
  opportunities: Opportunity[];
  investors: Investor[];
  onAdd: (opp: Opportunity) => void;
  onDelete: (id: string) => void;
  onBulkDeleteOpps?: (ids: string[]) => void;
  onBulkDeleteInvestors?: (ids: string[]) => void;
  onBulkApproveInvestors?: (ids: string[]) => void;
  onBulkRejectInvestors?: (ids: string[]) => void;
  onGiveReturn?: (record: ReturnRecord) => void;
  onSendKYCMessage: (investorId: string, type: 'Approval' | 'Rejection' | 'Reminder', content: string) => void;
  onSaveInvestor?: (investor: Investor) => void;
  onDeleteInvestor?: (id: string) => void;
  onAddNotification: (investorId: string, type: NotificationType, title: string, message: string, actionUrl?: string) => void;
  onInvest: (opp: Opportunity, amount: number, investorId?: string) => void;
  onLogout: () => void;
  userInvestments: InvestmentRecord[];
  paymentHistory: PaymentRecord[];
  returns: ReturnRecord[];
  withdrawals: WithdrawalRecord[];
  onUpdateWithdrawalStatus: (id: string, status: WithdrawalStatus) => void;
  testimonials: Testimonial[];
  onSaveTestimonial: (testimonial: Testimonial) => void;
  onDeleteTestimonial: (id: string) => void;
  partners: Partner[];
  onSavePartner: (partner: Partner) => void;
  onDeletePartner: (id: string) => void;
  teamMembers: TeamMember[];
  onSaveTeamMember: (member: TeamMember) => void;
  onDeleteTeamMember: (id: string) => void;
  faqs: FAQ[];
  onSaveFAQ: (faq: FAQ) => void;
  onDeleteFAQ: (id: string) => void;
  faqCategories: FAQCategory[];
  onSaveFAQCategory: (category: FAQCategory) => void;
  onDeleteFAQCategory: (id: string) => void;
  blogs: BlogPost[];
  onSaveBlog: (blog: BlogPost) => void;
  onDeleteBlog: (id: string) => void;
  referrals: any[];
  formatCurrency: (amount: number) => string;
  t: (key: string) => string;
  config: any;
  onSaveConfig: (config: any) => void;
}

// Transaction Mock Data
const MOCK_TRANSACTIONS = [];

const KPI_ROI_DATA = [];

const KPI_CAPITAL_DATA = [];

const KPI_PROPERTY_DATA = [];

const KPI_ACTIVE_INVESTORS = [];

const CHART_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

type AdminTab = 'overview' | 'manage' | 'investors' | 'transactions' | 'kyc' | 'reports' | 'settings' | 'notifications' | 'withdrawals' | 'investments' | 'asset-manager' | 'testimonials' | 'partners' | 'team-manager' | 'faq-management' | 'blog-manager' | 'certificates' | 'referrals';

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  opportunities, 
  investors, 
  onAdd, 
  onDelete,
  onBulkDeleteOpps,
  onBulkDeleteInvestors,
  onBulkApproveInvestors,
  onBulkRejectInvestors,
  onGiveReturn,
  onSendKYCMessage,
  onSaveInvestor,
  onDeleteInvestor,
  onAddNotification,
  onInvest,
  onLogout,
  userInvestments,
  paymentHistory,
  returns,
  withdrawals,
  onUpdateWithdrawalStatus,
  testimonials,
  onSaveTestimonial,
  onDeleteTestimonial,
  partners,
  onSavePartner,
  onDeletePartner,
  teamMembers,
  onSaveTeamMember,
  onDeleteTeamMember,
  faqs,
  onSaveFAQ,
  onDeleteFAQ,
  faqCategories,
  onSaveFAQCategory,
  onDeleteFAQCategory,
  blogs,
  onSaveBlog,
  onDeleteBlog,
  referrals,
  formatCurrency,
  t,
  config,
  onSaveConfig
}) => {
  const [showAdd, setShowAdd] = useState(false);
  const [showInvestorModal, setShowInvestorModal] = useState(false);
  const [showInvestorDetail, setShowInvestorDetail] = useState<Investor | null>(null);
  const [investorDetailTab, setInvestorDetailTab] = useState<'Overview' | 'Investments' | 'Transactions' | 'Returns' | 'Withdrawals' | 'Rent' | 'ROI' | 'Dividend'>('Overview');
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnFormData, setReturnFormData] = useState({
    investorId: '',
    investmentId: '',
    amount: 0,
    type: 'ROI' as string,
    date: new Date().toISOString().split('T')[0]
  });
  const [ledgerSearchQuery, setLedgerSearchQuery] = useState('');
  const [ledgerAssetFilter, setLedgerAssetFilter] = useState('All');
  const [ledgerDateFrom, setLedgerDateFrom] = useState('');
  const [ledgerDateTo, setLedgerDateTo] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [inventorySubTab, setInventorySubTab] = useState<'All' | 'Active' | 'Full Funded'>('All');
  const [assetManagerSubTab, setAssetManagerSubTab] = useState<'All' | 'Active' | 'Full Funded' | 'Holding Over' | 'Rent' | 'Dividend' | 'ROI'>('All');
  const [investmentSubTab, setInvestmentSubTab] = useState<'Investment' | 'Return' | 'Withdrawals' | 'Rent' | 'ROI' | 'Dividend'>('Investment');
  const [invMgmtInvestorFilter, setInvMgmtInvestorFilter] = useState('All');
  const [invMgmtDateFrom, setInvMgmtDateFrom] = useState('');
  const [invMgmtDateTo, setInvMgmtDateTo] = useState('');
  const [invMgmtAssetFilter, setInvMgmtAssetFilter] = useState('All');
  const [invMgmtTypeFilter, setInvMgmtTypeFilter] = useState('All');
  const [invMgmtReturnTypeFilter, setInvMgmtReturnTypeFilter] = useState('All');
  const [invMgmtSearchQuery, setInvMgmtSearchQuery] = useState('');
  const [showInvMgmtFilters, setShowInvMgmtFilters] = useState(false);
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [testimonialFormData, setTestimonialFormData] = useState<Partial<Testimonial>>({
    type: TestimonialType.SUCCESS_STORY,
    name: '',
    role: '',
    company: '',
    avatar: '',
    imageUrl: '',
    videoUrl: '',
    textTestimonial: '',
    rating: 5,
    successStory: {
      amount: 0,
      roi: '',
      month: new Date().toLocaleString('default', { month: 'long' }),
      year: new Date().getFullYear().toString(),
      description: '',
      assetName: '',
      assetClass: '',
      holdingPeriod: '',
      returnType: 'ROI',
      monthlyReturn: 0,
      yearlyRent: 0,
      dividend: 0,
      payout: 'Monthly',
      location: '',
      paragraph: ''
    }
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [kycFilter, setKycFilter] = useState('All');
  const [kycSubTab, setKycSubTab] = useState<'All' | 'Pending' | 'Verified' | 'Rejected'>('Pending');
  const [kycSearchQuery, setKycSearchQuery] = useState('');
  const [kycInvestorFilter, setKycInvestorFilter] = useState('All');
  const [kycDateFrom, setKycDateFrom] = useState('');
  const [kycDateTo, setKycDateTo] = useState('');
  const [kycStatusFilter, setKycStatusFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [payoutFilter, setPayoutFilter] = useState('All');
  const [returnTypeFilter, setReturnTypeFilter] = useState('All');
  const [assetClassFilter, setAssetClassFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [showInvestmentActionMenu, setShowInvestmentActionMenu] = useState<string | null>(null);
  const [showWithdrawalActionMenu, setShowWithdrawalActionMenu] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null);
  const [editingInvestor, setEditingInvestor] = useState<Investor | null>(null);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [showFAQCategoryModal, setShowFAQCategoryModal] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [editingFAQCategory, setEditingFAQCategory] = useState<FAQCategory | null>(null);
  const [faqFormData, setFaqFormData] = useState<Partial<FAQ>>({});
  const [faqCategoryFormData, setFaqCategoryFormData] = useState<Partial<FAQCategory>>({});
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  const [teamFormData, setTeamFormData] = useState<Partial<TeamMember>>({
    name: '',
    role: '',
    bio: '',
    image: '',
    category: 'leadership',
    socials: {
      linkedin: '',
      x: '',
      mail: '',
      instagram: ''
    }
  });
  const [partnerFormData, setPartnerFormData] = useState<Partial<Partner>>({
    legalCompanyName: '',
    email: '',
    phone: '',
    address: {
      fullAddress: '',
      city: '',
      state: '',
      country: '',
      pincode: ''
    },
    panNumber: '',
    gstNumber: '',
    website: '',
    logo: '',
    about: '',
    businessType: '',
    associatedAssets: [],
    stampLogos: [],
    team: []
  });
  const [showInvestorActions, setShowInvestorActions] = useState<string | null>(null);
  
  // Selection states
  const [selectedOppIds, setSelectedOppIds] = useState<string[]>([]);
  const [selectedInvestorIds, setSelectedInvestorIds] = useState<string[]>([]);
  const [reportSubTab, setReportSubTab] = useState('Investors');
  const [showQuickInvestModal, setShowQuickInvestModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderTarget, setReminderTarget] = useState<Investor | null>(null);
  const [reminderMessage, setReminderMessage] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionTarget, setRejectionTarget] = useState<Investor | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [quickInvestData, setQuickInvestData] = useState({
    investorId: '',
    opportunityId: '',
    amount: 0
  });
  const [quickInvestError, setQuickInvestError] = useState<string | null>(null);

  const [notificationSearchQuery, setNotificationSearchQuery] = useState('');
  const [notificationTypeFilter, setNotificationTypeFilter] = useState('All');
  const [notificationStatusFilter, setNotificationStatusFilter] = useState('All');
  const [notificationInvestorFilter, setNotificationInvestorFilter] = useState('All');
  const [notificationDateFrom, setNotificationDateFrom] = useState('');
  const [notificationDateTo, setNotificationDateTo] = useState('');
  const [notificationPage, setNotificationPage] = useState(1);
  const [commSubTab, setCommSubTab] = useState<'history' | 'alerts' | 'send' | 'asset-manager'>('history');
  const [alertSearchQuery, setAlertSearchQuery] = useState('');
  const [alertTypeFilter, setAlertTypeFilter] = useState('All');
  const [alertInvestorFilter, setAlertInvestorFilter] = useState('All');
  const [alertDateFrom, setAlertDateFrom] = useState('');
  const [alertDateTo, setAlertDateTo] = useState('');
  const [alertPage, setAlertPage] = useState(1);
  const [amSearchQuery, setAmSearchQuery] = useState('');
  const [amInvestorFilter, setAmInvestorFilter] = useState('All');
  const [amReturnTypeFilter, setAmReturnTypeFilter] = useState('All');
  const [amAssetFilter, setAmAssetFilter] = useState('All');
  const [amDateFrom, setAmDateFrom] = useState('');
  const [amDateTo, setAmDateTo] = useState('');
  const [amStatusFilter, setAmStatusFilter] = useState('All');
  const [readAmNotificationIds, setReadAmNotificationIds] = useState<string[]>([]);
  const [showAmFilters, setShowAmFilters] = useState(false);
  const [amPage, setAmPage] = useState(1);
  const amPerPage = 10;
  const [withdrawalSearchQuery, setWithdrawalSearchQuery] = useState('');
  const [withdrawalStatusFilter, setWithdrawalStatusFilter] = useState('All');
  const [withdrawalPage, setWithdrawalPage] = useState(1);
  const withdrawalsPerPage = 10;
  const alertsPerPage = 10;
  const notificationsPerPage = 10;
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [blogFormData, setBlogFormData] = useState<Partial<BlogPost>>({
    title: '',
    excerpt: '',
    content: '',
    blocks: [],
    author: '',
    authorRole: '',
    authorAvatar: '',
    category: 'Market Trends',
    imageUrl: '',
    readTime: '',
    tags: []
  });
  const [blogSearchQuery, setBlogSearchQuery] = useState('');
  const [blogCategoryFilter, setBlogCategoryFilter] = useState('All');
  const [lastPendingKycCount, setLastPendingKycCount] = useState(0);

  const [certSubTab, setCertSubTab] = useState<'Investments' | 'Withdrawals'>('Investments');
  const [certSearchQuery, setCertSearchQuery] = useState('');
  const [certInvestorFilter, setCertInvestorFilter] = useState('All');
  const [certDateFrom, setCertDateFrom] = useState('');
  const [certDateTo, setCertDateTo] = useState('');
  const [certAssetTypeFilter, setCertAssetTypeFilter] = useState('All');
  const [certMonthFilter, setCertMonthFilter] = useState('All');
  const [certYearFilter, setCertYearFilter] = useState('All');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadingCert, setDownloadingCert] = useState<{ id: string, type: 'Investment' | 'Withdrawal' } | null>(null);
  const [showCertPreview, setShowCertPreview] = useState<{ id: string, type: 'Investment' | 'Withdrawal' } | null>(null);

  const filteredCertificates = useMemo(() => {
    if (certSubTab === 'Investments') {
      return userInvestments.filter(inv => {
        const investor = investors.find(i => i.id === inv.investorId);
        const opp = opportunities.find(o => o.id === inv.opportunityId);
        
        if (!investor || !opp) return false;

        const matchesSearch = 
          investor.name.toLowerCase().includes(certSearchQuery.toLowerCase()) ||
          investor.investorUniqueId.toLowerCase().includes(certSearchQuery.toLowerCase()) ||
          inv.id.toLowerCase().includes(certSearchQuery.toLowerCase()) ||
          opp.assetID?.toLowerCase().includes(certSearchQuery.toLowerCase()) ||
          opp.id.toLowerCase().includes(certSearchQuery.toLowerCase());

        const matchesInvestor = certInvestorFilter === 'All' || inv.investorId === certInvestorFilter;
        const matchesAssetType = certAssetTypeFilter === 'All' || opp.type === certAssetTypeFilter;
        
        const invDate = new Date(inv.date);
        const matchesDateFrom = !certDateFrom || invDate >= new Date(certDateFrom);
        const matchesDateTo = !certDateTo || invDate <= new Date(certDateTo);
        
        const matchesMonth = certMonthFilter === 'All' || invDate.getMonth().toString() === certMonthFilter;
        const matchesYear = certYearFilter === 'All' || invDate.getFullYear().toString() === certYearFilter;

        return matchesSearch && matchesInvestor && matchesAssetType && matchesDateFrom && matchesDateTo && matchesMonth && matchesYear;
      });
    } else {
      return withdrawals.filter(w => {
        const investor = investors.find(i => i.id === w.investorId);
        
        if (!investor) return false;

        const matchesSearch = 
          investor.name.toLowerCase().includes(certSearchQuery.toLowerCase()) ||
          investor.investorUniqueId.toLowerCase().includes(certSearchQuery.toLowerCase()) ||
          w.id.toLowerCase().includes(certSearchQuery.toLowerCase()) ||
          w.assetID?.toLowerCase().includes(certSearchQuery.toLowerCase()) ||
          w.investmentId.toLowerCase().includes(certSearchQuery.toLowerCase());

        const matchesInvestor = certInvestorFilter === 'All' || w.investorId === certInvestorFilter;
        const matchesAssetType = certAssetTypeFilter === 'All' || w.type === certAssetTypeFilter;
        
        const wDate = new Date(w.date);
        const matchesDateFrom = !certDateFrom || wDate >= new Date(certDateFrom);
        const matchesDateTo = !certDateTo || wDate <= new Date(certDateTo);
        
        const matchesMonth = certMonthFilter === 'All' || wDate.getMonth().toString() === certMonthFilter;
        const matchesYear = certYearFilter === 'All' || wDate.getFullYear().toString() === certYearFilter;

        return matchesSearch && matchesInvestor && matchesAssetType && matchesDateFrom && matchesDateTo && matchesMonth && matchesYear;
      });
    }
  }, [certSubTab, userInvestments, withdrawals, investors, opportunities, certSearchQuery, certInvestorFilter, certAssetTypeFilter, certDateFrom, certDateTo, certMonthFilter, certYearFilter]);

  const handleDownloadCertificate = (id: string, type: 'Investment' | 'Withdrawal') => {
    setDownloadingCert({ id, type });
    setIsDownloading(true);
  };

  useEffect(() => {
    if (downloadingCert) {
      const generatePDF = async () => {
        const elementId = downloadingCert.type === 'Investment' 
          ? `certificate-${downloadingCert.id}` 
          : document.getElementById(`return-withdrawal-certificate-${downloadingCert.id}`) 
            ? `return-withdrawal-certificate-${downloadingCert.id}`
            : `withdrawal-certificate-${downloadingCert.id}`;
        
        const element = document.getElementById(elementId);
        
        if (!element) {
          console.error(`Certificate element not found: ${elementId}`);
          setIsDownloading(false);
          setDownloadingCert(null);
          return;
        }

        try {
          const canvas = await html2canvas(element, {
            scale: 3,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            allowTaint: true,
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
              const clonedElement = clonedDoc.getElementById(elementId);
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
          pdf.save(`${downloadingCert.type}-Certificate-${downloadingCert.id}.pdf`);
        } catch (error) {
          console.error('Error generating PDF:', error);
        } finally {
          setIsDownloading(false);
          setDownloadingCert(null);
        }
      };

      // Small delay to ensure the element is rendered
      const timer = setTimeout(generatePDF, 500);
      return () => clearTimeout(timer);
    }
  }, [downloadingCert]);

  const [notificationFormData, setNotificationFormData] = useState({
    investorId: 'all',
    type: NotificationType.OTHER,
    title: '',
    message: '',
    actionUrl: ''
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const allNotifications = useMemo(() => {
    const all: (Notification & { investorName: string, investorEmail: string })[] = [];
    investors.forEach(inv => {
      (inv.notifications || []).forEach(n => {
        all.push({ ...n, id: `${inv.id}-${n.id}`, investorName: inv.name, investorEmail: inv.email });
      });
    });
    return all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [investors]);

  const filteredNotifications = useMemo(() => {
    return allNotifications.filter(n => {
      const matchesSearch = 
        n.title.toLowerCase().includes(notificationSearchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(notificationSearchQuery.toLowerCase()) ||
        n.investorName.toLowerCase().includes(notificationSearchQuery.toLowerCase()) ||
        n.investorEmail.toLowerCase().includes(notificationSearchQuery.toLowerCase());
      
      const matchesType = notificationTypeFilter === 'All' || n.type === notificationTypeFilter;
      const matchesStatus = notificationStatusFilter === 'All' || 
                           (notificationStatusFilter === 'Read' ? n.read : !n.read);
      const matchesInvestor = notificationInvestorFilter === 'All' || n.investorId === notificationInvestorFilter;
      const matchesDateFrom = !notificationDateFrom || new Date(n.date) >= new Date(notificationDateFrom);
      const matchesDateTo = !notificationDateTo || new Date(n.date) <= new Date(notificationDateTo);
      
      return matchesSearch && matchesType && matchesStatus && matchesInvestor && matchesDateFrom && matchesDateTo;
    });
  }, [allNotifications, notificationSearchQuery, notificationTypeFilter, notificationStatusFilter, notificationInvestorFilter, notificationDateFrom, notificationDateTo]);

  const paginatedNotifications = useMemo(() => {
    const startIndex = (notificationPage - 1) * notificationsPerPage;
    return filteredNotifications.slice(startIndex, startIndex + notificationsPerPage);
  }, [filteredNotifications, notificationPage]);

  const toggleAmNotificationRead = (id: string) => {
    setReadAmNotificationIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const totalNotificationPages = Math.ceil(filteredNotifications.length / notificationsPerPage);

  useEffect(() => {
    setNotificationPage(1);
  }, [notificationSearchQuery, notificationTypeFilter, notificationStatusFilter, notificationInvestorFilter, notificationDateFrom, notificationDateTo]);

  const allAlerts = useMemo(() => {
    const alerts: any[] = [];
    
    // KYC Alerts
    investors.filter(inv => inv.kycStatus === 'Pending').forEach(inv => {
      alerts.push({
        id: `kyc-${inv.id}`,
        type: 'KYC',
        title: `${inv.name} re-uploaded KYC documents`,
        subtitle: `Investor ID: #${inv.investorUniqueId} • Pending Review`,
        date: inv.lastActive || inv.joinedDate,
        investorUniqueId: inv.investorUniqueId,
        investorId: inv.id,
        action: 'kyc'
      });
    });
    
    // Withdrawal Alerts
    withdrawals.filter(w => w.status === 'Pending').forEach(w => {
      alerts.push({
        id: `withdrawal-${w.id}`,
        type: 'Withdrawal',
        title: `New Withdrawal Request: ${formatCurrency(w.withdrawalAmount)}`,
        subtitle: `${w.opportunityTitle} • Pending Approval`,
        date: w.date,
        investorId: w.investorId,
        action: 'withdrawals'
      });
    });
    
    return alerts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [investors, withdrawals, formatCurrency]);

  const assetManagerNotifications = useMemo(() => {
    const notifications: any[] = [];
    const now = new Date();

    opportunities.forEach(opp => {
      const createdDate = new Date(opp.createdAt);
      const diffTime = Math.abs(now.getTime() - createdDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // 1. Holding Period Completion
      const hpMatch = opp.holdingPeriod.match(/(\d+)/);
      if (hpMatch) {
        const years = parseInt(hpMatch[1]);
        const targetDays = years * 365;
        if (diffDays >= targetDays) {
          notifications.push({
            id: `hp-${opp.id}`,
            type: 'Holding Period',
            title: 'Holding Period Completed',
            subtitle: opp.title,
            message: `The holding period of ${years} year(s) for "${opp.title}" has been completed. Please initiate settlement or exit processing.`,
            date: new Date(createdDate.getTime() + targetDays * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'High',
            action: 'asset-manager',
            subTab: 'Holding Over',
            assetId: opp.id,
            assetTitle: opp.title,
            assetLocation: opp.location,
            returnType: opp.returnType,
            read: readAmNotificationIds.includes(`hp-${opp.id}`)
          });
        }
      }

      // 2. Annual Yield Payout Reminder
      const yieldTypes = [ReturnType.MONTHLY_RENT, ReturnType.YEARLY_RENT, ReturnType.DIVIDEND, ReturnType.ROI];
      if (yieldTypes.includes(opp.returnType)) {
        const yearsPassed = Math.floor(diffDays / 365);
        if (yearsPassed > 0) {
          for (let i = 1; i <= yearsPassed; i++) {
            const id = `yield-${opp.id}-${i}`;
            notifications.push({
              id,
              type: 'Yield Payout',
              title: 'Annual Yield Payout Reminder',
              subtitle: opp.title,
              message: `Year ${i} completion for "${opp.title}". It's time to distribute the annual yield to investors.`,
              date: new Date(createdDate.getTime() + i * 365 * 24 * 60 * 60 * 1000).toISOString(),
              priority: 'Medium',
              action: 'investments',
              subTab: 'Return',
              assetId: opp.id,
              assetTitle: opp.title,
              assetLocation: opp.location,
              returnType: opp.returnType,
              read: readAmNotificationIds.includes(id)
            });
          }
        }
      }
    });

    // 3. Investor Participation Tracking
    userInvestments.forEach(inv => {
      const opp = opportunities.find(o => o.id === inv.opportunityId);
      if (!opp) return;

      const yieldTypes = [ReturnType.MONTHLY_RENT, ReturnType.YEARLY_RENT, ReturnType.DIVIDEND, ReturnType.ROI];
      if (yieldTypes.includes(opp.returnType)) {
        const invDate = new Date(inv.date);
        const diffTime = Math.abs(now.getTime() - invDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const yearsPassed = Math.floor(diffDays / 365);

        if (yearsPassed > 0) {
          for (let i = 1; i <= yearsPassed; i++) {
            const id = `inv-yield-${inv.id}-${i}`;
            const investor = investors.find(invst => invst.id === inv.investorId);
            notifications.push({
              id,
              type: 'Investor Yield',
              title: 'Investor Participation Anniversary',
              subtitle: `${investor?.name || 'Investor'} - ${opp.title}`,
              message: `Investor ${investor?.name} has completed ${i} year(s) of participation in "${opp.title}". Prepare for yield distribution.`,
              date: new Date(invDate.getTime() + i * 365 * 24 * 60 * 60 * 1000).toISOString(),
              priority: 'Medium',
              action: 'investments',
              subTab: 'Return',
              assetId: opp.id,
              assetTitle: opp.title,
              assetLocation: opp.location,
              returnType: opp.returnType,
              investorId: inv.investorId,
              investorName: investor?.name,
              read: readAmNotificationIds.includes(id)
            });
          }
        }
      }
    });

    return notifications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [opportunities, userInvestments, investors, readAmNotificationIds]);

  const filteredAssetManagerNotifications = useMemo(() => {
    return assetManagerNotifications.filter(n => {
      const matchesSearch = 
        n.assetTitle.toLowerCase().includes(amSearchQuery.toLowerCase()) ||
        n.assetId.toLowerCase().includes(amSearchQuery.toLowerCase()) ||
        n.assetLocation.toLowerCase().includes(amSearchQuery.toLowerCase()) ||
        (n.investorName && n.investorName.toLowerCase().includes(amSearchQuery.toLowerCase())) ||
        (n.investorId && n.investorId.toLowerCase().includes(amSearchQuery.toLowerCase()));
      
      const matchesInvestor = amInvestorFilter === 'All' || n.investorId === amInvestorFilter;
      const matchesReturnType = amReturnTypeFilter === 'All' || n.returnType === amReturnTypeFilter;
      const matchesAsset = amAssetFilter === 'All' || n.assetId === amAssetFilter;
      const matchesDateFrom = !amDateFrom || new Date(n.date) >= new Date(amDateFrom);
      const matchesDateTo = !amDateTo || new Date(n.date) <= new Date(amDateTo);
      const matchesStatus = amStatusFilter === 'All' || 
                           (amStatusFilter === 'Read' ? n.read : !n.read);
      
      return matchesSearch && matchesInvestor && matchesReturnType && matchesAsset && matchesDateFrom && matchesDateTo && matchesStatus;
    });
  }, [assetManagerNotifications, amSearchQuery, amInvestorFilter, amReturnTypeFilter, amAssetFilter, amDateFrom, amDateTo, amStatusFilter]);

  const paginatedAmNotifications = useMemo(() => {
    const startIndex = (amPage - 1) * amPerPage;
    return filteredAssetManagerNotifications.slice(startIndex, startIndex + amPerPage);
  }, [filteredAssetManagerNotifications, amPage]);

  const totalAmPages = Math.ceil(filteredAssetManagerNotifications.length / amPerPage);

  useEffect(() => {
    setAmPage(1);
  }, [amSearchQuery, amInvestorFilter, amReturnTypeFilter, amAssetFilter, amDateFrom, amDateTo, amStatusFilter]);

  const filteredAlerts = useMemo(() => {
    return allAlerts.filter(a => {
      const matchesSearch = 
        a.title.toLowerCase().includes(alertSearchQuery.toLowerCase()) ||
        a.subtitle.toLowerCase().includes(alertSearchQuery.toLowerCase());
      
      const matchesType = alertTypeFilter === 'All' || a.type === alertTypeFilter;
      const matchesInvestor = alertInvestorFilter === 'All' || a.investorId === alertInvestorFilter;
      const matchesDateFrom = !alertDateFrom || new Date(a.date) >= new Date(alertDateFrom);
      const matchesDateTo = !alertDateTo || new Date(a.date) <= new Date(alertDateTo);
      
      return matchesSearch && matchesType && matchesInvestor && matchesDateFrom && matchesDateTo;
    });
  }, [allAlerts, alertSearchQuery, alertTypeFilter, alertInvestorFilter, alertDateFrom, alertDateTo]);

  const paginatedAlerts = useMemo(() => {
    const startIndex = (alertPage - 1) * alertsPerPage;
    return filteredAlerts.slice(startIndex, startIndex + alertsPerPage);
  }, [filteredAlerts, alertPage]);

  const totalAlertPages = Math.ceil(filteredAlerts.length / alertsPerPage);

  useEffect(() => {
    setAlertPage(1);
  }, [alertSearchQuery, alertTypeFilter, alertInvestorFilter, alertDateFrom, alertDateTo]);

  const filteredWithdrawals = useMemo(() => {
    return withdrawals.filter(w => {
      const investor = investors.find(inv => inv.id === w.investorId);
      const matchesSearch = 
        w.opportunityTitle.toLowerCase().includes(withdrawalSearchQuery.toLowerCase()) ||
        w.partnerName.toLowerCase().includes(withdrawalSearchQuery.toLowerCase()) ||
        investor?.name.toLowerCase().includes(withdrawalSearchQuery.toLowerCase()) ||
        investor?.email.toLowerCase().includes(withdrawalSearchQuery.toLowerCase()) ||
        w.id.toLowerCase().includes(withdrawalSearchQuery.toLowerCase());
      
      const matchesStatus = withdrawalStatusFilter === 'All' || w.status === withdrawalStatusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [withdrawals, withdrawalSearchQuery, withdrawalStatusFilter, investors]);

  const paginatedWithdrawals = useMemo(() => {
    const startIndex = (withdrawalPage - 1) * withdrawalsPerPage;
    return filteredWithdrawals.slice(startIndex, startIndex + withdrawalsPerPage);
  }, [filteredWithdrawals, withdrawalPage]);

  const totalWithdrawalPages = Math.ceil(filteredWithdrawals.length / withdrawalsPerPage);

  useEffect(() => {
    setWithdrawalPage(1);
  }, [withdrawalSearchQuery, withdrawalStatusFilter]);

  const filteredKycInvestors = useMemo(() => {
    return investors.filter(i => {
      // Tab filter
      const matchesTab = kycSubTab === 'All' || i.kycStatus === kycSubTab;
      
      // Search filter (Name, Email, ID)
      const matchesSearch = 
        i.name.toLowerCase().includes(kycSearchQuery.toLowerCase()) ||
        i.email.toLowerCase().includes(kycSearchQuery.toLowerCase()) ||
        i.investorUniqueId.toLowerCase().includes(kycSearchQuery.toLowerCase());
      
      // Investor filter (Specific investor)
      const matchesInvestor = kycInvestorFilter === 'All' || i.id === kycInvestorFilter;
      
      // Date filter (Joined Date)
      const matchesDateFrom = !kycDateFrom || new Date(i.joinedDate) >= new Date(kycDateFrom);
      const matchesDateTo = !kycDateTo || new Date(i.joinedDate) <= new Date(kycDateTo);
      
      // Status filter (Additional filter, mostly useful in 'All' tab)
      const matchesStatus = kycStatusFilter === 'All' || i.kycStatus === kycStatusFilter;
      
      return matchesTab && matchesSearch && matchesInvestor && matchesDateFrom && matchesDateTo && matchesStatus;
    });
  }, [investors, kycSubTab, kycSearchQuery, kycInvestorFilter, kycDateFrom, kycDateTo, kycStatusFilter]);

  const pendingKycCount = useMemo(() => {
    return investors.filter(inv => inv.kycStatus === 'Pending').length;
  }, [investors]);

  useEffect(() => {
    if (soundEnabled && pendingKycCount > lastPendingKycCount) {
      if (!audioRef.current) {
        audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      }
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
    setLastPendingKycCount(pendingKycCount);
  }, [pendingKycCount, soundEnabled, lastPendingKycCount]);

  const imageInputRef = useRef<HTMLInputElement>(null);

  const filteredAssetsForReturn = useMemo(() => {
    if (!returnFormData.investorId) return [];
    
    // Get IDs of investments that have started the withdrawal process (pending or approved)
    // We only exclude if it's a full investment withdrawal, not a returns withdrawal
    const withdrawnInvestmentIds = withdrawals
      .filter(w => 
        w.investorId === returnFormData.investorId && 
        !w.isReturnsWithdrawal &&
        (w.status === WithdrawalStatus.PENDING || w.status === WithdrawalStatus.APPROVED)
      )
      .map(w => w.investmentId);

    return userInvestments.filter(inv => 
      inv.investorId === returnFormData.investorId && 
      !withdrawnInvestmentIds.includes(inv.id)
    );
  }, [returnFormData.investorId, userInvestments, withdrawals]);

  // Reset investment selection when investor changes
  useEffect(() => {
    setReturnFormData(prev => ({ ...prev, investmentId: '' }));
  }, [returnFormData.investorId]);

  // Auto-set amount based on asset and return type
  useEffect(() => {
    if (returnFormData.investmentId && returnFormData.type) {
      const investment = userInvestments.find(inv => inv.id === returnFormData.investmentId);
      if (investment) {
        const opp = opportunities.find(o => o.id === investment.opportunityId);
        if (opp) {
          let amount = 0;
          const type = returnFormData.type;
          
          if (type === ReturnType.MONTHLY_RENT) {
            amount = opp.rentAmount || (opp.rentPercentage ? (investment.amount * opp.rentPercentage / 100) : 0);
          } else if (type === ReturnType.YEARLY_RENT) {
            amount = (opp.rentAmount || (opp.rentPercentage ? (investment.amount * opp.rentPercentage / 100) : 0)) * 12;
          } else if (type === ReturnType.ROI) {
            amount = opp.roiAmount || (opp.roiPercentage ? (investment.amount * opp.roiPercentage / 100) : 0);
          } else if (type === ReturnType.DIVIDEND) {
            amount = opp.dividendAmount || (opp.dividendPercentage ? (investment.amount * opp.dividendPercentage / 100) : 0);
          }
          
          if (amount > 0) {
            setReturnFormData(prev => ({ ...prev, amount }));
          }
        }
      }
    }
  }, [returnFormData.investmentId, returnFormData.type, userInvestments, opportunities]);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const partnerPdfInputRef = useRef<HTMLInputElement>(null);
  const partnerLogoInputRef = useRef<HTMLInputElement>(null);
  const stampLogosInputRef = useRef<HTMLInputElement>(null);
  const teamMemberPhotoInputRef = useRef<HTMLInputElement>(null);
  const teamPhotoInputRef = useRef<HTMLInputElement>(null);
  const teamSignatureInputRef = useRef<HTMLInputElement>(null);
  const leadImageInputRef = useRef<HTMLInputElement>(null);
  const teamMemberInputRef = useRef<HTMLInputElement>(null);
  const [activeTeamIdx, setActiveTeamIdx] = useState<number | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'imageUrl' | 'videoUrl' | 'pdfUrl' | 'leadImageUrl' | 'partnerDetailsUrl' | 'logo') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (field === 'logo') {
          setPartnerFormData(prev => ({ ...prev, logo: reader.result as string }));
        } else {
          setFormData(prev => ({ ...prev, [field]: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTeamMemberFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (activeTeamIdx === null) return;
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newTeam = [...(formData.team || [])];
        if (newTeam[activeTeamIdx]) {
          newTeam[activeTeamIdx].image = reader.result as string;
          setFormData(prev => ({ ...prev, team: newTeam }));
        }
        setActiveTeamIdx(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredInvestors = useMemo(() => {
    return investors.filter(inv => {
      const matchesSearch = 
        inv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.investorUniqueId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.kycStatus.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesKYC = kycFilter === 'All' || inv.kycStatus === kycFilter;
      const matchesRisk = riskFilter === 'All' || inv.riskProfile === riskFilter;

      return matchesSearch && matchesKYC && matchesRisk;
    });
  }, [investors, searchQuery, kycFilter, riskFilter]);

  const uniqueAssetClasses = useMemo(() => {
    const classes = new Set(opportunities.map(o => o.assetClass).filter(Boolean));
    return ['All', ...Array.from(classes)];
  }, [opportunities]);

  const uniquePayouts = useMemo(() => {
    const payouts = new Set(opportunities.map(o => o.payoutFrequency).filter(Boolean));
    return ['All', ...Array.from(payouts)];
  }, [opportunities]);

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(o => {
      const matchesSearch = 
        o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (o.partnerName && o.partnerName.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesType = typeFilter === 'All' || o.type === typeFilter;
      const matchesReturnType = returnTypeFilter === 'All' || o.returnType === returnTypeFilter;
      const matchesAssetClass = assetClassFilter === 'All' || o.assetClass === assetClassFilter;
      const matchesPayout = payoutFilter === 'All' || o.payoutFrequency === payoutFilter;

      const isFullFunded = o.raisedAmount >= o.targetAmount;
      const matchesSubTab = inventorySubTab === 'All' ? true : (inventorySubTab === 'Active' ? !isFullFunded : isFullFunded);

      return matchesSearch && matchesType && matchesReturnType && matchesAssetClass && matchesPayout && matchesSubTab;
    });
  }, [opportunities, searchQuery, typeFilter, returnTypeFilter, assetClassFilter, payoutFilter, inventorySubTab]);

  const filteredAssetManagerOpportunities = useMemo(() => {
    return opportunities.filter(o => {
      const isFullFunded = o.raisedAmount >= o.targetAmount;
      
      // Holding Period Over Logic
      const checkHoldingOver = () => {
        if (!o.holdingPeriod) return false;
        const yearsMatch = o.holdingPeriod.match(/(\d+)/);
        if (!yearsMatch) return false;
        const years = parseInt(yearsMatch[1]);
        const createdDate = new Date(o.createdAt);
        const now = new Date();
        const diffYears = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
        return diffYears >= years;
      };

      switch (assetManagerSubTab) {
        case 'Active': return !isFullFunded;
        case 'Full Funded': return isFullFunded;
        case 'Holding Over': return checkHoldingOver();
        case 'Rent': return o.returnType === ReturnType.MONTHLY_RENT || o.returnType === ReturnType.YEARLY_RENT;
        case 'Dividend': return o.returnType === ReturnType.DIVIDEND;
        case 'ROI': return o.returnType === ReturnType.ROI;
        default: return true;
      }
    });
  }, [opportunities, assetManagerSubTab]);

  const enrichedInvestments = useMemo(() => {
    return userInvestments
      .filter(inv => {
        const opp = opportunities.find(o => o.id === inv.opportunityId);
        const investor = investors.find(i => i.id === inv.investorId);
        
        const matchesInvestor = invMgmtInvestorFilter === 'All' || inv.investorId === invMgmtInvestorFilter;
        const matchesAsset = invMgmtAssetFilter === 'All' || inv.opportunityId === invMgmtAssetFilter;
        const matchesType = invMgmtTypeFilter === 'All' || inv.type === invMgmtTypeFilter;
        const matchesReturnType = invMgmtReturnTypeFilter === 'All' || opp?.returnType === invMgmtReturnTypeFilter;
        const matchesDateFrom = !invMgmtDateFrom || new Date(inv.date) >= new Date(invMgmtDateFrom);
        const matchesDateTo = !invMgmtDateTo || new Date(inv.date) <= new Date(invMgmtDateTo);
        
        const searchLower = invMgmtSearchQuery.toLowerCase();
        const matchesSearch = !invMgmtSearchQuery || 
          inv.opportunityTitle.toLowerCase().includes(searchLower) ||
          (investor?.name || '').toLowerCase().includes(searchLower) ||
          inv.id.toLowerCase().includes(searchLower) ||
          inv.opportunityId.toLowerCase().includes(searchLower);
        
        return matchesInvestor && matchesAsset && matchesType && matchesReturnType && matchesDateFrom && matchesDateTo && matchesSearch;
      })
      .map(inv => {
        const opp = opportunities.find(o => o.id === inv.opportunityId);
        const investor = investors.find(i => i.id === inv.investorId);
        const roi = parseFloat(opp?.expectedROI || '0');
        const projectedReturn = inv.amount * (roi / 100);
        return {
          ...inv,
          partnerName: opp?.partnerName || 'N/A',
          location: opp?.location || 'N/A',
          assetClass: opp?.assetClass || 'N/A',
          expectedROI: opp?.expectedROI || 'N/A',
          expectedIRR: opp?.expectedIRR || 'N/A',
          projectedReturn,
          monthlyRevenue: projectedReturn / 12,
          totalValue: inv.amount + projectedReturn,
          returnType: opp?.returnType || 'N/A',
          holdingPeriod: opp?.holdingPeriod || 'N/A',
          payoutCadence: opp?.payoutFrequency || 'N/A',
          riskFactor: opp?.riskLevel || 'N/A',
          strategicPartner: opp?.partnerName || 'N/A',
          investorName: investor?.name || 'Unknown',
          rentAmount: opp?.rentAmount || 0
        };
      });
  }, [userInvestments, opportunities, investors, invMgmtInvestorFilter, invMgmtAssetFilter, invMgmtTypeFilter, invMgmtReturnTypeFilter, invMgmtDateFrom, invMgmtDateTo, invMgmtSearchQuery]);

  const enrichedReturns = useMemo(() => {
    return returns
      .filter(ret => {
        const investment = userInvestments.find(inv => inv.id === ret.investmentId);
        const opp = opportunities.find(o => o.id === investment?.opportunityId || o.id === ret.investmentId);
        const investor = investors.find(i => i.id === ret.investorId);
        
        const matchesInvestor = invMgmtInvestorFilter === 'All' || ret.investorId === invMgmtInvestorFilter;
        const matchesAsset = invMgmtAssetFilter === 'All' || investment?.opportunityId === invMgmtAssetFilter || ret.investmentId === invMgmtAssetFilter;
        const matchesType = invMgmtTypeFilter === 'All' || opp?.type === invMgmtTypeFilter;
        const matchesReturnType = invMgmtReturnTypeFilter === 'All' || opp?.returnType === invMgmtReturnTypeFilter;
        const matchesDateFrom = !invMgmtDateFrom || new Date(ret.date) >= new Date(invMgmtDateFrom);
        const matchesDateTo = !invMgmtDateTo || new Date(ret.date) <= new Date(invMgmtDateTo);
        
        const searchLower = invMgmtSearchQuery.toLowerCase();
        const matchesSearch = !invMgmtSearchQuery || 
          ret.investmentTitle.toLowerCase().includes(searchLower) ||
          (investor?.name || '').toLowerCase().includes(searchLower) ||
          ret.id.toLowerCase().includes(searchLower) ||
          ret.investmentId.toLowerCase().includes(searchLower);
        
        return matchesInvestor && matchesAsset && matchesType && matchesReturnType && matchesDateFrom && matchesDateTo && matchesSearch;
      })
      .map(ret => {
        const investment = userInvestments.find(inv => inv.id === ret.investmentId);
        const opp = opportunities.find(o => o.id === investment?.opportunityId || o.id === ret.investmentId);
        const investor = investors.find(i => i.id === ret.investorId);
        const roi = parseFloat(opp?.expectedROI || '0');
        const projectedReturn = (investment?.amount || 0) * (roi / 100);
        return {
          ...ret,
          partnerName: opp?.partnerName || 'N/A',
          location: opp?.location || 'N/A',
          type: opp?.type || 'N/A',
          assetClass: opp?.assetClass || 'N/A',
          expectedROI: opp?.expectedROI || 'N/A',
          expectedIRR: opp?.expectedIRR || 'N/A',
          projectedReturn,
          monthlyRevenue: projectedReturn / 12,
          totalValue: (investment?.amount || 0) + projectedReturn,
          returnType: opp?.returnType || 'N/A',
          holdingPeriod: opp?.holdingPeriod || 'N/A',
          payoutCadence: opp?.payoutFrequency || 'N/A',
          riskFactor: opp?.riskLevel || 'N/A',
          strategicPartner: opp?.partnerName || 'N/A',
          investorName: investor?.name || 'Unknown',
          status: 'Paid'
        };
      });
  }, [returns, opportunities, investors, userInvestments, invMgmtInvestorFilter, invMgmtAssetFilter, invMgmtTypeFilter, invMgmtReturnTypeFilter, invMgmtDateFrom, invMgmtDateTo, invMgmtSearchQuery]);

  const filteredWithdrawalsForMgmt = useMemo(() => {
    return withdrawals.filter(w => {
      const matchesInvestor = invMgmtInvestorFilter === 'All' || w.investorId === invMgmtInvestorFilter;
      const matchesAsset = invMgmtAssetFilter === 'All' || w.investmentId === invMgmtAssetFilter;
      const matchesType = invMgmtTypeFilter === 'All' || w.type === invMgmtTypeFilter;
      const matchesReturnType = invMgmtReturnTypeFilter === 'All' || w.returnType === invMgmtReturnTypeFilter;
      const matchesDateFrom = !invMgmtDateFrom || new Date(w.date) >= new Date(invMgmtDateFrom);
      const matchesDateTo = !invMgmtDateTo || new Date(w.date) <= new Date(invMgmtDateTo);
      
      const investor = investors.find(i => i.id === w.investorId);
      const searchLower = invMgmtSearchQuery.toLowerCase();
      const matchesSearch = !invMgmtSearchQuery || 
        w.opportunityTitle.toLowerCase().includes(searchLower) ||
        (investor?.name || '').toLowerCase().includes(searchLower) ||
        w.id.toLowerCase().includes(searchLower) ||
        w.investmentId.toLowerCase().includes(searchLower);
      
      return matchesInvestor && matchesAsset && matchesType && matchesReturnType && matchesDateFrom && matchesDateTo && matchesSearch;
    }).map(w => {
      const investor = investors.find(i => i.id === w.investorId);
      return {
        ...w,
        investorName: investor?.name || 'Unknown'
      };
    });
  }, [withdrawals, investors, invMgmtInvestorFilter, invMgmtAssetFilter, invMgmtTypeFilter, invMgmtReturnTypeFilter, invMgmtDateFrom, invMgmtDateTo, invMgmtSearchQuery]);

  const initialInvestorData: Investor = {
    id: Math.random().toString(36).substr(2, 9),
    name: '',
    email: '',
    password: '',
    avatar: `https://i.pravatar.cc/150?u=${Math.random()}`,
    kycStatus: 'Pending',
    totalInvested: 0,
    activeAssets: 0,
    riskProfile: 'Balanced',
    joinedDate: new Date().toISOString().split('T')[0],
    phone: '',
    address: { street: '', city: '', pincode: '', state: '', country: '' },
    kycDocuments: [],
    paymentMethods: [],
    lastActive: new Date().toISOString().split('T')[0],
    totalReturns: 0,
    preferences: { sectors: [], minROI: 0 },
    investorUniqueId: ''
  };

  const [investorFormData, setInvestorFormData] = useState<Investor>(initialInvestorData);

  const getDaysSince = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date('2026-03-05');
    const diffTime = Math.abs(now.getTime() - date.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  const riskSegments = useMemo(() => {
    const segments: Record<string, { count: number, total: number }> = {
      Conservative: { count: 0, total: 0 },
      Balanced: { count: 0, total: 0 },
      Aggressive: { count: 0, total: 0 },
    };
    investors.forEach(inv => {
      if (segments[inv.riskProfile]) {
        segments[inv.riskProfile].count++;
        segments[inv.riskProfile].total += inv.totalInvested;
      }
    });
    return segments;
  }, [investors]);

  const investmentSegments = useMemo(() => {
    const segments = [
      { label: 'Retail (<$10k)', min: 0, max: 10000, count: 0, total: 0 },
      { label: 'Professional ($10k-$100k)', min: 10000, max: 100000, count: 0, total: 0 },
      { label: 'Institutional (>$100k)', min: 100000, max: Infinity, count: 0, total: 0 },
    ];
    investors.forEach(inv => {
      const segment = segments.find(s => inv.totalInvested >= s.min && inv.totalInvested < s.max);
      if (segment) {
        segment.count++;
        segment.total += inv.totalInvested;
      }
    });
    return segments;
  }, [investors]);

  const initialFormData: Partial<Opportunity> = {
    title: '',
    description: '',
    leadImageUrl: '',
    type: InvestmentType.COMMERCIAL_PROPERTY,
    returnType: ReturnType.MONTHLY_RENT,
    minInvestment: 5000,
    targetAmount: 1000000,
    expectedROI: '10%',
    expectedIRR: '8.5%',
    location: '',
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    riskLevel: RiskLevel.MODERATE,
    partnerName: '',
    partnerLogoUrl: '',
    assetClass: '',
    holdingPeriod: '',
    taxBenefits: '',
    payoutFrequency: 'Monthly',
    publishedAt: new Date().toISOString().split('T')[0],
    partnerDetailsUrl: '',
    rentAmount: undefined,
    rentPercentage: undefined,
    dividendAmount: undefined,
    dividendPercentage: undefined,
    roiAmount: undefined,
    roiPercentage: undefined,
    kpis: [{ label: 'Target Yield', value: '12%' }, { label: 'Occupancy', value: '95%' }],
    milestones: [{ date: '2025-Q4', label: 'Acquisition', completed: true }, { date: '2026-Q2', label: 'Renovation', completed: false }],
    team: [{ name: 'Sarah Jenkins', role: 'Asset Manager', image: 'https://i.pravatar.cc/150?u=sarah' }]
  };

  const [formData, setFormData] = useState<Partial<Opportunity>>(initialFormData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData as Opportunity,
      id: editingOpp ? editingOpp.id : Math.random().toString(36).substr(2, 9),
      raisedAmount: editingOpp ? editingOpp.raisedAmount : 0,
      createdAt: editingOpp ? editingOpp.createdAt : new Date().toISOString(),
      publishedAt: formData.publishedAt || new Date().toISOString().split('T')[0]
    });
    setShowAdd(false);
    setEditingOpp(null);
  };

  const handlePartnerChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setPartnerFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof Partner] as any),
          [child]: value
        }
      }));
    } else {
      setPartnerFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleAddTeamMember = () => {
    const newMember: PartnerTeamMember = {
      id: Math.random().toString(36).substr(2, 9),
      photo: '',
      name: '',
      email: '',
      phone: '',
      designation: '',
      address: '',
      signature: ''
    };
    setPartnerFormData(prev => ({
      ...prev,
      team: [...(prev.team || []), newMember]
    }));
  };

  const handleUpdateTeamMember = (id: string, field: string, value: any) => {
    setPartnerFormData(prev => ({
      ...prev,
      team: (prev.team || []).map(m => m.id === id ? { ...m, [field]: value } : m)
    }));
  };

  const handleRemoveTeamMember = (id: string) => {
    setPartnerFormData(prev => ({
      ...prev,
      team: (prev.team || []).filter(m => m.id !== id)
    }));
  };

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePartner({
      ...partnerFormData as Partner,
      id: editingPartner ? editingPartner.id : Math.random().toString(36).substr(2, 9)
    });
    setShowPartnerModal(false);
    setEditingPartner(null);
    setPartnerFormData({
      legalCompanyName: '',
      email: '',
      phone: '',
      address: {
        fullAddress: '',
        city: '',
        state: '',
        country: '',
        pincode: ''
      },
      panNumber: '',
      gstNumber: '',
      website: '',
      team: []
    });
  };

  const navItems = [
    { id: 'overview' as AdminTab, icon: <Activity className="w-5 h-5" />, label: 'Dashboard' },
    { id: 'manage' as AdminTab, icon: <Layout className="w-5 h-5" />, label: 'Inventory' },
    { id: 'asset-manager' as AdminTab, icon: <Briefcase className="w-5 h-5" />, label: 'Asset Manager' },
    { id: 'investors' as AdminTab, icon: <Users className="w-5 h-5" />, label: 'Investors' },
    { id: 'transactions' as AdminTab, icon: <CreditCard className="w-5 h-5" />, label: 'Finances' },
    { id: 'withdrawals' as AdminTab, icon: <Wallet className="w-5 h-5" />, label: 'Withdrawals' },
    { id: 'certificates' as AdminTab, icon: <FileBadge className="w-5 h-5" />, label: 'Certificates' },
    { id: 'reports' as AdminTab, icon: <PieChart className="w-5 h-5" />, label: 'Reports' },
    { id: 'investments' as AdminTab, icon: <Briefcase className="w-5 h-5" />, label: 'Investment Mgmt' },
    { id: 'kyc' as AdminTab, icon: <ShieldCheck className="w-5 h-5" />, label: 'Compliance' },
    { id: 'partners' as AdminTab, icon: <Users className="w-5 h-5" />, label: 'Partners Manager' },
    { id: 'team-manager' as AdminTab, icon: <Users className="w-5 h-5" />, label: 'Team Manager' },
    { id: 'testimonials' as AdminTab, icon: <MessageSquare className="w-5 h-5" />, label: 'Testimonials' },
    { id: 'faq-management' as AdminTab, icon: <HelpCircle className="w-5 h-5" />, label: 'FAQ Management' },
    { id: 'blog-manager' as AdminTab, icon: <Edit3 className="w-5 h-5" />, label: 'Blog Manager' },
    { id: 'notifications' as AdminTab, icon: <Bell className="w-5 h-5" />, label: 'Notifications', isHelpCenter: true },
    { id: 'settings' as AdminTab, icon: <Settings className="w-5 h-5" />, label: 'System' },
  ];

  const totalAUM = opportunities.reduce((acc, curr) => acc + curr.raisedAmount, 0);
  const platformRevenue = totalAUM * (config.globalCommission / 100);

  const metrics = useMemo(() => {
    const totalInvestors = investors.length;
    const activeInvestors = investors.filter(i => i.activeAssets > 0).length;
    const inactiveInvestors = totalInvestors - activeInvestors;
    
    const now = new Date();
    const newInvestorsThisMonth = investors.filter(i => {
      const joinedDate = new Date(i.joinedDate);
      return joinedDate.getMonth() === now.getMonth() && joinedDate.getFullYear() === now.getFullYear();
    }).length;
    
    const kycVerifiedCount = investors.filter(i => i.kycStatus === 'Verified').length;
    const kycVerifiedPercent = totalInvestors > 0 ? ((kycVerifiedCount / totalInvestors) * 100).toFixed(1) : '0.0';
    
    const repeatInvestorsCount = investors.filter(i => {
      const investorInvestments = userInvestments.filter(inv => inv.investorId === i.id);
      return investorInvestments.length > 1;
    }).length;
    const repeatInvestorsPercent = activeInvestors > 0 ? ((repeatInvestorsCount / activeInvestors) * 100).toFixed(1) : '0.0';

    const investmentThisMonth = userInvestments.reduce((acc, curr) => {
      const date = new Date(curr.date);
      if (date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
        return acc + curr.amount;
      }
      return acc;
    }, 0);

    const averageInvestmentPerInvestor = activeInvestors > 0 ? totalAUM / activeInvestors : 0;

    const top10Investors = [...investors]
      .sort((a, b) => b.totalInvested - a.totalInvested)
      .slice(0, 10);

    const distribution = {
      Hotels: userInvestments.filter(inv => inv.type === InvestmentType.HOTELS_PROPERTY).reduce((acc, curr) => acc + curr.amount, 0),
      Commercial: userInvestments.filter(inv => inv.type === InvestmentType.COMMERCIAL_PROPERTY).reduce((acc, curr) => acc + curr.amount, 0),
      Residential: userInvestments.filter(inv => inv.type === InvestmentType.RESIDENTIAL_PROPERTY).reduce((acc, curr) => acc + curr.amount, 0),
      Land: userInvestments.filter(inv => inv.type === InvestmentType.LAND_PROPERTY).reduce((acc, curr) => acc + curr.amount, 0),
      Startups: userInvestments.filter(inv => inv.type === InvestmentType.STARTUP).reduce((acc, curr) => acc + curr.amount, 0),
    };

    const avgROI = opportunities.length > 0 
      ? (opportunities.reduce((acc, curr) => acc + parseFloat(curr.expectedROI.replace('%', '')), 0) / opportunities.length).toFixed(1)
      : '0.0';
    
    const irrOpps = opportunities.filter(o => o.expectedIRR);
    const avgIRR = irrOpps.length > 0
      ? (irrOpps.reduce((acc, curr) => acc + parseFloat(curr.expectedIRR!.replace('%', '')), 0) / irrOpps.length).toFixed(1)
      : '0.0';

    const totalPayoutDistributed = returns.reduce((acc, curr) => acc + curr.amount, 0);
    const monthlyRentalYieldPaid = returns
      .filter(r => r.type === ReturnType.MONTHLY_RENT)
      .reduce((acc, curr) => acc + curr.amount, 0);
    
    const pendingPayouts = withdrawals
      .filter(w => w.status === 'Pending')
      .reduce((acc, curr) => acc + curr.withdrawalAmount, 0);

    const topPerformingAssets = [...opportunities]
      .sort((a, b) => parseFloat(b.expectedROI.replace('%', '')) - parseFloat(a.expectedROI.replace('%', '')))
      .slice(0, 5);

    const totalAssetsListed = opportunities.length;
    const fullyFundedAssets = opportunities.filter(o => (o.raisedAmount / o.targetAmount) >= 1).length;
    const partiallyFundedAssets = opportunities.filter(o => o.raisedAmount > 0 && (o.raisedAmount / o.targetAmount) < 1).length;
    const fundingCompletionRate = totalAssetsListed > 0 ? ((fullyFundedAssets / totalAssetsListed) * 100).toFixed(1) : '0.0';
    
    // Mock average time to fund (in days)
    const avgTimeToFund = "14.5 Days";

    const assetPerformanceTable = opportunities.map(o => ({
      id: o.id,
      title: o.title,
      type: o.type,
      totalValue: o.targetAmount,
      fundedPercent: Math.min(100, (o.raisedAmount / o.targetAmount) * 100).toFixed(1),
      roi: o.expectedROI,
      status: (o.raisedAmount / o.targetAmount) >= 1 ? 'Fully Funded' : (o.raisedAmount > 0 ? 'Partially Funded' : 'New')
    }));

    // Investor Behavior Metrics
    const retentionRate = totalInvestors > 0 ? ((activeInvestors / totalInvestors) * 100).toFixed(1) : '0.0';
    const churnRate = (100 - parseFloat(retentionRate)).toFixed(1);
    const avgHoldingPeriod = "2.4 Years";
    const totalInvestmentsCount = userInvestments.length;
    const investmentFrequency = totalInvestors > 0 ? (totalInvestmentsCount / totalInvestors).toFixed(2) : '0.00';
    
    const firstTimeInvestorsCount = investors.filter(inv => {
      const count = userInvestments.filter(i => i.investorId === inv.id).length;
      return count === 1;
    }).length;

    const topCities = Object.entries(
      investors.reduce((acc: Record<string, number>, inv) => {
        const city = inv.address?.city || 'Unknown';
        acc[city] = (acc[city] || 0) + 1;
        return acc;
      }, {})
    )
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 5)
    .map(([city, count]) => ({ city, count: count as number }));

    // Cohort Analysis (Monthly Investors)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const cohortData = months.map((month, idx) => {
      const newInMonth = investors.filter(inv => {
        const date = new Date(inv.joinedDate);
        return date.getMonth() === idx;
      }).length;
      
      // Mock retention for cohorts
      return {
        month,
        newInvestors: newInMonth,
        month1: Math.floor(newInMonth * 0.9),
        month2: Math.floor(newInMonth * 0.8),
        month3: Math.floor(newInMonth * 0.75),
      };
    });

    return {
      totalInvestors,
      activeInvestors,
      newInvestorsThisMonth,
      kycVerifiedPercent,
      inactiveInvestors,
      repeatInvestorsPercent,
      investmentThisMonth,
      averageInvestmentPerInvestor,
      top10Investors,
      distribution,
      avgROI,
      avgIRR,
      totalPayoutDistributed,
      monthlyRentalYieldPaid,
      pendingPayouts,
      topPerformingAssets,
      totalAssetsListed,
      fullyFundedAssets,
      partiallyFundedAssets,
      fundingCompletionRate,
      avgTimeToFund,
      assetPerformanceTable,
      retentionRate,
      churnRate,
      avgHoldingPeriod,
      investmentFrequency,
      repeatInvestorsCount,
      firstTimeInvestorsCount,
      topCities,
      cohortData
    };
  }, [investors, userInvestments, totalAUM, opportunities, returns, withdrawals]);

  const kycMetrics = useMemo(() => {
    const approved = investors.filter(i => i.kycStatus === 'Verified').length;
    const pending = investors.filter(i => i.kycStatus === 'Pending').length;
    const rejected = investors.filter(i => i.kycStatus === 'Rejected').length;
    const reuploadRequests = investors.reduce((acc, inv) => 
      acc + (inv.kycMessages?.filter(m => m.type === 'Rejection').length || 0), 0
    );
    const avgVerificationTime = "2.5 Days";

    return {
      approved,
      pending,
      rejected,
      reuploadRequests,
      avgVerificationTime
    };
  }, [investors]);

  const systemActivityMetrics = useMemo(() => {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const allNotifications = investors.flatMap(inv => inv.notifications || []);
    const totalNotificationsSent = allNotifications.length;
    const unreadNotifications = allNotifications.filter(n => !n.read).length;

    const investmentsLast24h = userInvestments.filter(inv => new Date(inv.date) >= last24h).length;
    const withdrawalsLast24h = withdrawals.filter(w => new Date(w.date) >= last24h).length;
    const kycSubmittedLast24h = investors.filter(inv => 
      new Date(inv.joinedDate) >= last24h && inv.kycStatus !== 'Rejected'
    ).length;

    // Live Activity Feed (Real Time Data)
    const liveActivity = [
      ...userInvestments.map(inv => ({
        id: inv.id,
        type: 'Investment',
        title: 'New Investment',
        description: `${investors.find(i => i.id === inv.investorId)?.name || 'Investor'} invested ${formatCurrency(inv.amount)} in ${inv.opportunityTitle}`,
        date: inv.date,
        icon: 'DollarSign',
        color: 'text-emerald-500'
      })),
      ...withdrawals.map(w => ({
        id: w.id,
        type: 'Withdrawal',
        title: 'Withdrawal Request',
        description: `${investors.find(i => i.id === w.investorId)?.name || 'Investor'} requested ${formatCurrency(w.withdrawalAmount)}`,
        date: w.date,
        icon: 'Download',
        color: 'text-blue-500'
      })),
      ...returns.map(r => ({
        id: r.id,
        type: 'Return',
        title: 'Return Distributed',
        description: `${formatCurrency(r.amount)} paid to ${investors.find(i => i.id === r.investorId)?.name || 'Investor'} for ${r.investmentTitle}`,
        date: r.date,
        icon: 'RefreshCcw',
        color: 'text-purple-500'
      })),
      ...investors.filter(i => i.kycStatus !== 'Pending').map(i => ({
        id: `kyc-${i.id}`,
        type: 'KYC',
        title: `KYC ${i.kycStatus}`,
        description: `Investor ${i.name} verification status updated to ${i.kycStatus}`,
        date: i.joinedDate, // Assuming joinedDate is the latest update for simplicity or we could use lastActive
        icon: 'ShieldCheck',
        color: i.kycStatus === 'Verified' ? 'text-emerald-500' : 'text-rose-500'
      }))
    ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 15);

    return {
      totalNotificationsSent,
      unreadNotifications,
      investmentsLast24h,
      withdrawalsLast24h,
      kycSubmittedLast24h,
      liveActivity
    };
  }, [investors, userInvestments, withdrawals, returns, formatCurrency]);

  // Bulk Handlers
  const toggleOppSelection = (id: string) => {
    setSelectedOppIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleAllOpps = (filtered: Opportunity[]) => {
    if (selectedOppIds.length === filtered.length) {
      setSelectedOppIds([]);
    } else {
      setSelectedOppIds(filtered.map(o => o.id));
    }
  };

  const toggleInvestorSelection = (id: string) => {
    setSelectedInvestorIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleAllInvestors = (filtered: Investor[]) => {
    if (selectedInvestorIds.length === filtered.length) {
      setSelectedInvestorIds([]);
    } else {
      setSelectedInvestorIds(filtered.map(i => i.id));
    }
  };

  const handleBulkDeleteOppsAction = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedOppIds.length} assets?`)) {
      onBulkDeleteOpps?.(selectedOppIds);
      setSelectedOppIds([]);
    }
  };

  const handleBulkDeleteInvestorsAction = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedInvestorIds.length} investors?`)) {
      onBulkDeleteInvestors?.(selectedInvestorIds);
      setSelectedInvestorIds([]);
    }
  };

  const handleBulkApproveInvestorsAction = () => {
    onBulkApproveInvestors?.(selectedInvestorIds);
    setSelectedInvestorIds([]);
  };

  const handleBulkRejectInvestorsAction = () => {
    onBulkRejectInvestors?.(selectedInvestorIds);
    setSelectedInvestorIds([]);
  };

  const handleSaveInvestorAction = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveInvestor?.(investorFormData);
    setShowInvestorModal(false);
    setInvestorFormData(initialInvestorData);
    setEditingInvestor(null);
  };

  const handleDeleteInvestorAction = (id: string) => {
    if (window.confirm('Are you sure you want to delete this investor profile?')) {
      onDeleteInvestor?.(id);
    }
  };

  const filteredLedger = useMemo(() => {
    return returns.filter(ret => {
      const investor = investors.find(i => i.id === ret.investorId);
      const matchesSearch = 
        ret.investmentTitle.toLowerCase().includes(ledgerSearchQuery.toLowerCase()) ||
        (investor && investor.name.toLowerCase().includes(ledgerSearchQuery.toLowerCase())) ||
        ret.id.toLowerCase().includes(ledgerSearchQuery.toLowerCase());
      
      const matchesAsset = ledgerAssetFilter === 'All' || ret.investmentTitle === ledgerAssetFilter;
      
      const retDate = new Date(ret.date);
      const matchesDateFrom = !ledgerDateFrom || retDate >= new Date(ledgerDateFrom);
      const matchesDateTo = !ledgerDateTo || retDate <= new Date(ledgerDateTo);
      
      return matchesSearch && matchesAsset && matchesDateFrom && matchesDateTo;
    });
  }, [returns, investors, ledgerSearchQuery, ledgerAssetFilter, ledgerDateFrom, ledgerDateTo]);

  const uniqueAssets = useMemo(() => {
    const assets = new Set(returns.map(r => r.investmentTitle));
    return Array.from(assets);
  }, [returns]);

  const handleQuickInvest = (e: React.FormEvent) => {
    e.preventDefault();
    const opp = opportunities.find(o => o.id === quickInvestData.opportunityId);
    if (opp && quickInvestData.amount > 0) {
      const remaining = opp.targetAmount - opp.raisedAmount;
      let finalAmount = quickInvestData.amount;

      if (finalAmount > remaining) {
        setQuickInvestError(`Only $${(remaining ?? 0).toLocaleString()} is available. Amount adjusted.`);
        setQuickInvestData(prev => ({ ...prev, amount: remaining }));
        return;
      }

      if (finalAmount <= 0) {
        setQuickInvestError("This opportunity is already fully funded.");
        return;
      }

      setQuickInvestError(null);
      onInvest(opp, finalAmount, quickInvestData.investorId);
      setShowQuickInvestModal(false);
      setQuickInvestData({ investorId: '', opportunityId: '', amount: 0 });
      alert(`Successfully recorded $${(finalAmount ?? 0).toLocaleString()} investment for ${investors.find(i => i.id === quickInvestData.investorId)?.name}`);
    }
  };

  const handleTeamManagerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTeamFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveTeamMemberAction = (e: React.FormEvent) => {
    e.preventDefault();
    const newMember: TeamMember = {
      ...teamFormData as TeamMember,
      id: editingTeamMember ? editingTeamMember.id : Math.random().toString(36).substr(2, 9),
    };
    onSaveTeamMember(newMember);
    setShowTeamModal(false);
    setEditingTeamMember(null);
    setTeamFormData({
      name: '',
      role: '',
      bio: '',
      image: '',
      category: 'leadership',
      socials: {
        linkedin: '',
        x: '',
        mail: '',
        instagram: ''
      }
    });
  };

  const handleDeleteTeamMemberAction = (id: string) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      onDeleteTeamMember(id);
    }
  };

  const handleProcessReturn = (e: React.FormEvent) => {
    e.preventDefault();
    const investor = investors.find(i => i.id === returnFormData.investorId);
    const investment = userInvestments.find(inv => inv.id === returnFormData.investmentId);
    const opportunity = investment ? opportunities.find(o => o.id === investment.opportunityId) : null;
    
    if (investor && investment && opportunity && onGiveReturn) {
      onGiveReturn({
        id: Math.random().toString(36).substr(2, 9),
        investorId: investor.id,
        investmentId: investment.id,
        investmentTitle: opportunity.title,
        amount: returnFormData.amount,
        date: returnFormData.date,
        type: returnFormData.type as any
      });
      setShowReturnModal(false);
      setReturnFormData({ 
        investorId: '', 
        investmentId: '', 
        amount: 0, 
        type: 'ROI',
        date: new Date().toISOString().split('T')[0]
      });
      alert(`Successfully processed $${returnFormData.amount} return for ${investor.name}`);
    }
  };

  const handleSaveTestimonialAction = (e: React.FormEvent) => {
    e.preventDefault();
    const newTestimonial: Testimonial = {
      ...testimonialFormData as Testimonial,
      id: editingTestimonial ? editingTestimonial.id : Math.random().toString(36).substr(2, 9),
    };
    onSaveTestimonial(newTestimonial);
    setShowTestimonialModal(false);
    setEditingTestimonial(null);
    setTestimonialFormData({
      type: TestimonialType.SUCCESS_STORY,
      name: '',
      role: '',
      company: '',
      avatar: '',
      imageUrl: '',
      videoUrl: '',
      textTestimonial: '',
      rating: 5,
      successStory: {
        amount: 0,
        roi: '',
        month: new Date().toLocaleString('default', { month: 'long' }),
        year: new Date().getFullYear().toString(),
        description: '',
        assetName: '',
        assetClass: '',
        holdingPeriod: '',
        returnType: 'ROI',
        monthlyReturn: 0,
        yearlyRent: 0,
        dividend: 0,
        payout: 'Monthly',
        location: ''
      }
    });
  };

  const handleDeleteTestimonialAction = (id: string) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      onDeleteTestimonial(id);
    }
  };

  const handleTestimonialFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'avatar' | 'imageUrl' | 'videoUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTestimonialFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBlogFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string, blockId?: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (blockId) {
          setBlogFormData(prev => ({
            ...prev,
            blocks: prev.blocks?.map(b => b.id === blockId ? { ...b, content: reader.result as string } : b)
          }));
        } else {
          setBlogFormData(prev => ({ ...prev, [field]: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addBlogBlock = (type: any) => {
    const newBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: '',
      items: (type === 'bullets' || type === 'numbers') ? [''] : undefined
    };
    setBlogFormData(prev => ({
      ...prev,
      blocks: [...(prev.blocks || []), newBlock]
    }));
  };

  const removeBlogBlock = (id: string) => {
    setBlogFormData(prev => ({
      ...prev,
      blocks: prev.blocks?.filter(b => b.id !== id)
    }));
  };

  const updateBlogBlock = (id: string, content: string) => {
    setBlogFormData(prev => ({
      ...prev,
      blocks: prev.blocks?.map(b => b.id === id ? { ...b, content } : b)
    }));
  };

  const updateBlogBlockItems = (id: string, items: string[]) => {
    setBlogFormData(prev => ({
      ...prev,
      blocks: prev.blocks?.map(b => b.id === id ? { ...b, items } : b)
    }));
  };

  const moveBlogBlock = (id: string, direction: 'up' | 'down') => {
    setBlogFormData(prev => {
      const blocks = [...(prev.blocks || [])];
      const index = blocks.findIndex(b => b.id === id);
      if (index === -1) return prev;
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= blocks.length) return prev;
      [blocks[index], blocks[newIndex]] = [blocks[newIndex], blocks[index]];
      return { ...prev, blocks };
    });
  };

  return (
    <>
      <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 sm:mb-10 gap-6">
          <div className="w-full sm:w-auto">
            <div className="flex items-center gap-3 mb-2">
              <Database className="w-5 h-5 sm:w-6 h-6 text-emerald-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Platform Core v4.2.0</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 serif tracking-tight">Admin Terminal</h1>
          </div>
          
          <div className="flex w-full sm:w-auto gap-3 sm:gap-4 items-center">
            <div className="relative mr-2">
              <button 
                onClick={() => setActiveTab('notifications')}
                className={`p-3 rounded-xl transition relative ${activeTab === 'notifications' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-400 hover:text-emerald-600'}`}
              >
                <Bell className="w-5 h-5" />
                {pendingKycCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                    {pendingKycCount}
                  </span>
                )}
              </button>
            </div>
            <button className="flex-1 sm:flex-none bg-white border border-slate-200 text-slate-600 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold hover:bg-slate-50 transition shadow-sm flex items-center justify-center gap-2 text-xs sm:text-sm">
              <Download className="w-4 h-4" /> Export Audit
            </button>
            <button 
              onClick={() => { setEditingOpp(null); setFormData(initialFormData); setShowAdd(true); }}
              className="flex-1 sm:flex-none bg-emerald-600 text-white px-4 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold hover:bg-emerald-700 transition shadow-lg flex items-center justify-center text-xs sm:text-sm"
            >
              <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" /> Register Asset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Sidebar - Hidden on mobile, shown on large screens */}
          <div className="hidden lg:block space-y-2">
            {navItems.filter(item => !item.isHelpCenter).map((item) => (
              <button 
                key={item.id} 
                onClick={() => {
                  setActiveTab(item.id);
                  setSearchQuery('');
                  setKycFilter('All');
                  setRiskFilter('All');
                }}
                className={`w-full flex items-center px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
                  activeTab === item.id 
                    ? 'bg-slate-900 text-white shadow-2xl scale-105' 
                    : 'text-slate-500 hover:bg-white hover:text-emerald-600'
                }`}
              >
                <span className="mr-4">{item.icon}</span>
                {item.label}
              </button>
            ))}

            <div className="pt-6 pb-2 px-6">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-3 h-3 text-slate-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Investors Help Center</span>
              </div>
            </div>

            {navItems.filter(item => item.isHelpCenter).map((item) => (
              <button 
                key={item.id} 
                onClick={() => {
                  setActiveTab(item.id);
                  setSearchQuery('');
                  setKycFilter('All');
                  setRiskFilter('All');
                }}
                className={`w-full flex items-center px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
                  activeTab === item.id 
                    ? 'bg-slate-900 text-white shadow-2xl scale-105' 
                    : 'text-slate-500 hover:bg-white hover:text-emerald-600'
                }`}
              >
                <span className="mr-4">{item.icon}</span>
                {item.label}
              </button>
            ))}

            <div className="mt-12 p-6 bg-emerald-600 rounded-3xl text-white shadow-xl shadow-emerald-200">
               <div className="flex items-center gap-3 mb-4">
                 <Bell className="w-5 h-5" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Global Broadcast</span>
               </div>
               <p className="text-xs text-emerald-100 mb-4 font-medium">Send a secure notification to all 12,402 platform investors.</p>
               <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2">
                 <Send className="w-4 h-4" /> Dispatch Message
               </button>
            </div>

            <div className="mt-4">
              <button 
                onClick={onLogout}
                className="w-full flex items-center px-6 py-4 rounded-2xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all duration-300"
              >
                <LogOut className="w-5 h-5 mr-4" />
                Exit Terminal
              </button>
            </div>
          </div>

          {/* Mobile Tab Nav */}
          <div className="lg:hidden flex overflow-x-auto pb-4 gap-2 no-scrollbar">
            {navItems.map((item) => (
              <button 
                key={item.id} 
                onClick={() => {
                  setActiveTab(item.id);
                  setSearchQuery('');
                  setKycFilter('All');
                  setRiskFilter('All');
                }}
                className={`flex-shrink-0 flex items-center px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === item.id 
                    ? 'bg-slate-900 text-white shadow-lg' 
                    : 'bg-white text-slate-500 border border-slate-100'
                }`}
              >
                <span className="mr-2">{React.cloneElement(item.icon as React.ReactElement, { className: "w-3 h-3" })}</span>
                {item.label}
              </button>
            ))}
          </div>

          {/* Workspace */}
          <div className="lg:col-span-3">
            
            {/* 1. OVERVIEW DASHBOARD */}
            {activeTab === 'overview' && (
              <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Total Investors</p>
                      <h3 className="text-2xl font-black text-slate-900">{metrics.totalInvestors}</h3>
                      <div className="flex items-center gap-1 text-slate-400 mt-2">
                         <Users className="w-3 h-3" />
                         <span className="text-[10px] font-bold">Registered Users</span>
                      </div>
                   </div>
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Active Investors</p>
                      <h3 className="text-2xl font-black text-emerald-600">{metrics.activeInvestors}</h3>
                      <div className="flex items-center gap-1 text-emerald-500 mt-2">
                         <TrendingUp className="w-3 h-3" />
                         <span className="text-[10px] font-bold">Invested in ≥1 asset</span>
                      </div>
                   </div>
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">New Investors</p>
                      <h3 className="text-2xl font-black text-blue-600">{metrics.newInvestorsThisMonth}</h3>
                      <div className="flex items-center gap-1 text-blue-500 mt-2">
                         <Plus className="w-3 h-3" />
                         <span className="text-[10px] font-bold">This Month</span>
                      </div>
                   </div>
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">KYC Verified</p>
                      <h3 className="text-2xl font-black text-slate-900">{metrics.kycVerifiedPercent}%</h3>
                      <div className="flex items-center gap-1 text-emerald-500 mt-2">
                         <ShieldCheck className="w-3 h-3" />
                         <span className="text-[10px] font-bold">Verified LPs</span>
                      </div>
                   </div>
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Inactive Investors</p>
                      <h3 className="text-2xl font-black text-rose-600">{metrics.inactiveInvestors}</h3>
                      <div className="flex items-center gap-1 text-rose-500 mt-2">
                         <AlertCircle className="w-3 h-3" />
                         <span className="text-[10px] font-bold">No investment yet</span>
                      </div>
                   </div>
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Repeat Investors</p>
                      <h3 className="text-2xl font-black text-amber-600">{metrics.repeatInvestorsPercent}%</h3>
                      <div className="flex items-center gap-1 text-amber-500 mt-2">
                         <RefreshCcw className="w-3 h-3" />
                         <span className="text-[10px] font-bold">Multiple assets</span>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:gap-8">
                   {/* Investment Metrics Card */}
                   <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                      <div className="flex justify-between items-center mb-8">
                         <h3 className="text-xl font-bold serif">Investment Metrics</h3>
                         <TrendingUp className="w-5 h-5 text-emerald-500" />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                         <div className="p-4 bg-slate-50 rounded-2xl">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total AUM</p>
                            <h4 className="text-2xl font-black text-slate-900">{formatCurrency(totalAUM)}</h4>
                         </div>
                         <div className="p-4 bg-slate-50 rounded-2xl">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">This Month</p>
                            <h4 className="text-2xl font-black text-emerald-600">{formatCurrency(metrics.investmentThisMonth)}</h4>
                         </div>
                         <div className="p-4 bg-slate-50 rounded-2xl">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Avg / Investor</p>
                            <h4 className="text-2xl font-black text-blue-600">{formatCurrency(metrics.averageInvestmentPerInvestor)}</h4>
                         </div>
                      </div>

                      <div className="space-y-6">
                         <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Investment Distribution</h4>
                         <div className="space-y-4">
                            {Object.entries(metrics.distribution).map(([type, amount]) => {
                               const val = amount as number;
                               const percent = totalAUM > 0 ? ((val / totalAUM) * 100).toFixed(1) : '0.0';
                               return (
                                  <div key={type} className="space-y-2">
                                     <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                        <span>{type}</span>
                                        <span className="text-slate-400">{formatCurrency(val)} ({percent}%)</span>
                                     </div>
                                     <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                                        <div 
                                           className={`h-full ${
                                              type === 'Hotels' ? 'bg-emerald-500' :
                                              type === 'Commercial' ? 'bg-blue-500' :
                                              type === 'Residential' ? 'bg-amber-500' :
                                              type === 'Land' ? 'bg-rose-500' : 'bg-purple-500'
                                           }`} 
                                           style={{ width: `${percent}%` }}
                                        />
                                     </div>
                                  </div>
                               );
                            })}
                         </div>
                      </div>
                   </div>

                   {/* Top 10 Investors Card */}
                   <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                      <div className="flex justify-between items-center mb-8">
                         <h3 className="text-xl font-bold serif">Top 10 Investors</h3>
                         <Users className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="space-y-4">
                         {metrics.top10Investors.length > 0 ? (
                            metrics.top10Investors.map((investor, i) => (
                               <div key={investor.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition">
                                  <div className="flex items-center gap-3">
                                     <span className="text-xs font-black text-slate-300 w-4">{i + 1}</span>
                                     <img src={investor.avatar} alt={investor.name} className="w-8 h-8 rounded-full border border-slate-100" referrerPolicy="no-referrer" />
                                     <div>
                                        <p className="text-xs font-bold text-slate-900">{investor.name}</p>
                                        <p className="text-[10px] text-slate-400">{investor.email}</p>
                                     </div>
                                  </div>
                                  <div className="text-right">
                                     <p className="text-xs font-black text-slate-900">{formatCurrency(investor.totalInvested)}</p>
                                     <p className="text-[10px] text-emerald-500 font-bold">{investor.activeAssets} Assets</p>
                                  </div>
                               </div>
                            ))
                         ) : (
                            <div className="text-center py-10">
                               <p className="text-xs text-slate-400">No investor data available</p>
                            </div>
                         )}
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:gap-8">
                   {/* Returns & Performance Metrics Card */}
                   <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                      <div className="flex justify-between items-center mb-8">
                         <h3 className="text-xl font-bold serif">Returns & Performance</h3>
                         <Activity className="w-5 h-5 text-purple-500" />
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
                         <div className="p-4 bg-slate-50 rounded-2xl">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Avg ROI</p>
                            <h4 className="text-2xl font-black text-slate-900">{metrics.avgROI}%</h4>
                         </div>
                         <div className="p-4 bg-slate-50 rounded-2xl">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Avg IRR</p>
                            <h4 className="text-xl font-black text-slate-900">{metrics.avgIRR}%</h4>
                         </div>
                         <div className="p-4 bg-slate-50 rounded-2xl">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Payout</p>
                            <h4 className="text-xl font-black text-emerald-600">{formatCurrency(metrics.totalPayoutDistributed)}</h4>
                         </div>
                         <div className="p-4 bg-slate-50 rounded-2xl">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Monthly Yield</p>
                            <h4 className="text-xl font-black text-blue-600">{formatCurrency(metrics.monthlyRentalYieldPaid)}</h4>
                         </div>
                         <div className="p-4 bg-slate-50 rounded-2xl">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Pending</p>
                            <h4 className="text-2xl font-black text-rose-600">{formatCurrency(metrics.pendingPayouts)}</h4>
                         </div>
                      </div>

                      <div className="space-y-6">
                         <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Top Performing Assets</h4>
                         <div className="space-y-3">
                            {metrics.topPerformingAssets.map((asset) => (
                               <div key={asset.id} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl">
                                  <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 rounded-lg overflow-hidden border border-white shadow-sm">
                                        <img src={asset.imageUrl} alt={asset.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                     </div>
                                     <div>
                                        <p className="text-xs font-bold text-slate-900 line-clamp-1">{asset.title}</p>
                                        <p className="text-[10px] text-slate-400">{asset.type}</p>
                                     </div>
                                  </div>
                                  <div className="text-right">
                                     <p className="text-xs font-black text-emerald-600">{asset.expectedROI}</p>
                                     <p className="text-[10px] text-slate-400 font-bold">ROI</p>
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:gap-8">
                   {/* Asset Performance Metrics Card */}
                   <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                      <div className="flex justify-between items-center mb-8">
                         <h3 className="text-xl font-bold serif">Asset Performance Metrics</h3>
                         <Building2 className="w-5 h-5 text-amber-500" />
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-10">
                         <div className="p-4 bg-slate-50 rounded-2xl">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Listed</p>
                            <h4 className="text-xl font-black text-slate-900">{metrics.totalAssetsListed}</h4>
                         </div>
                         <div className="p-4 bg-slate-50 rounded-2xl">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fully Funded</p>
                            <h4 className="text-xl font-black text-emerald-600">{metrics.fullyFundedAssets}</h4>
                         </div>
                         <div className="p-4 bg-slate-50 rounded-2xl">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Partially Funded</p>
                            <h4 className="text-xl font-black text-amber-600">{metrics.partiallyFundedAssets}</h4>
                         </div>
                         <div className="p-4 bg-slate-50 rounded-2xl">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Completion Rate</p>
                            <h4 className="text-xl font-black text-blue-600">{metrics.fundingCompletionRate}%</h4>
                         </div>
                         <div className="p-4 bg-slate-50 rounded-2xl">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg Time to Fund</p>
                            <h4 className="text-xl font-black text-purple-600">{metrics.avgTimeToFund}</h4>
                         </div>
                      </div>

                      <div className="overflow-x-auto">
                         <table className="w-full text-left border-collapse">
                            <thead>
                               <tr className="border-b border-slate-100">
                                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset</th>
                                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Value</th>
                                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Funded %</th>
                                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">ROI</th>
                                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                               </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                               {metrics.assetPerformanceTable.map((asset) => (
                                  <tr key={asset.id} className="hover:bg-slate-50/50 transition">
                                     <td className="py-4 text-xs font-bold text-slate-900">{asset.title}</td>
                                     <td className="py-4 text-xs text-slate-500">{asset.type}</td>
                                     <td className="py-4 text-xs font-bold text-slate-900">{formatCurrency(asset.totalValue)}</td>
                                     <td className="py-4">
                                        <div className="flex items-center gap-2">
                                           <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden max-w-[60px]">
                                              <div 
                                                 className="h-full bg-blue-500" 
                                                 style={{ width: `${asset.fundedPercent}%` }}
                                              />
                                           </div>
                                           <span className="text-[10px] font-bold text-slate-500">{asset.fundedPercent}%</span>
                                        </div>
                                     </td>
                                     <td className="py-4 text-xs font-black text-emerald-600">{asset.roi}</td>
                                     <td className="py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                                           asset.status === 'Fully Funded' ? 'bg-emerald-50 text-emerald-600' :
                                           asset.status === 'Partially Funded' ? 'bg-amber-50 text-amber-600' :
                                           'bg-slate-50 text-slate-500'
                                        }`}>
                                           {asset.status}
                                        </span>
                                     </td>
                                  </tr>
                               ))}
                            </tbody>
                         </table>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:gap-8 mt-8">
                   {/* Investor Behavior Metrics Card */}
                   <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                      <div className="flex justify-between items-center mb-8">
                         <h3 className="text-xl font-bold serif">Investor Behavior Metrics 🚀</h3>
                         <Users className="w-5 h-5 text-blue-500" />
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                         <div className="p-4 bg-slate-50 rounded-2xl">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Retention Rate</p>
                            <h4 className="text-xl font-black text-emerald-600">{metrics.retentionRate}%</h4>
                         </div>
                         <div className="p-4 bg-slate-50 rounded-2xl">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Churn Rate</p>
                            <h4 className="text-xl font-black text-rose-600">{metrics.churnRate}%</h4>
                         </div>
                         <div className="p-4 bg-slate-50 rounded-2xl">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg Holding Period</p>
                            <h4 className="text-xl font-black text-slate-900">{metrics.avgHoldingPeriod}</h4>
                         </div>
                         <div className="p-4 bg-slate-50 rounded-2xl">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Investment Freq</p>
                            <h4 className="text-xl font-black text-blue-600">{metrics.investmentFrequency}x</h4>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                         {/* First-Time vs Repeat Chart */}
                         <div className="space-y-6">
                            <h4 className="text-sm font-bold text-slate-900">First-Time vs Repeat Investors</h4>
                            <div className="h-[250px]">
                               <ResponsiveContainer width="100%" height="100%">
                                  <RePieChart>
                                     <Pie
                                        data={[
                                           { name: 'First-Time', value: metrics.firstTimeInvestorsCount },
                                           { name: 'Repeat', value: metrics.repeatInvestorsCount }
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                     >
                                        <Cell fill="#3b82f6" />
                                        <Cell fill="#10b981" />
                                     </Pie>
                                  </RePieChart>
                               </ResponsiveContainer>
                            </div>
                            <div className="flex justify-center gap-6">
                               <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                                  <span className="text-xs text-slate-500">First-Time ({metrics.firstTimeInvestorsCount})</span>
                               </div>
                               <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                  <span className="text-xs text-slate-500">Repeat ({metrics.repeatInvestorsCount})</span>
                               </div>
                            </div>
                         </div>

                         {/* Top Cities */}
                         <div className="space-y-6">
                            <h4 className="text-sm font-bold text-slate-900">Top Cities of Investors</h4>
                            <div className="space-y-4">
                               {metrics.topCities.map((city, idx) => (
                                  <div key={`${city.city}-${idx}`} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                     <div className="flex items-center gap-3">
                                        <MapPin className="w-4 h-4 text-slate-400" />
                                        <span className="text-xs font-bold text-slate-900">{city.city}</span>
                                     </div>
                                     <span className="text-xs font-black text-blue-600">{city.count} Investors</span>
                                  </div>
                               ))}
                            </div>
                         </div>
                      </div>

                      {/* Cohort Analysis Chart */}
                      <div className="mt-12 pt-12 border-t border-slate-100">
                         <div className="flex justify-between items-center mb-8">
                            <h4 className="text-sm font-bold text-slate-900">Cohort Analysis (Monthly Retention)</h4>
                            <div className="flex gap-4">
                               <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded bg-blue-500" />
                                  <span className="text-[10px] text-slate-500">New</span>
                               </div>
                               <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded bg-emerald-500" />
                                  <span className="text-[10px] text-slate-500">Month 1</span>
                               </div>
                               <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded bg-amber-500" />
                                  <span className="text-[10px] text-slate-500">Month 2</span>
                               </div>
                            </div>
                         </div>
                         <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                               <BarChart data={metrics.cohortData}>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                  <XAxis 
                                     dataKey="month" 
                                     axisLine={false} 
                                     tickLine={false} 
                                     tick={{ fontSize: 10, fill: '#94a3b8' }} 
                                  />
                                  <YAxis 
                                     axisLine={false} 
                                     tickLine={false} 
                                     tick={{ fontSize: 10, fill: '#94a3b8' }} 
                                  />
                                  <Tooltip 
                                     contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                  />
                                  <Bar dataKey="newInvestors" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                                  <Bar dataKey="month1" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                                  <Bar dataKey="month2" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={30} />
                               </BarChart>
                            </ResponsiveContainer>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:gap-8 mt-8">
                   {/* KYC & Compliance Metrics Card */}
                   <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                      <div className="flex justify-between items-center mb-8">
                         <h3 className="text-xl font-bold serif">🔐 KYC & Compliance Metrics</h3>
                         <ShieldCheck className="w-5 h-5 text-emerald-500" />
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                         <div className="p-6 bg-emerald-50/50 rounded-[2rem] border border-emerald-100/50">
                            <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest mb-2">Approved</p>
                            <h4 className="text-2xl font-black text-emerald-700">{kycMetrics.approved}</h4>
                            <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                               <CheckCircle className="w-3 h-3" />
                               <span>Verified LPs</span>
                            </div>
                         </div>
                         
                         <div className="p-6 bg-amber-50/50 rounded-[2rem] border border-amber-100/50">
                            <p className="text-[10px] font-black text-amber-600/60 uppercase tracking-widest mb-2">Pending</p>
                            <h4 className="text-2xl font-black text-amber-700">{kycMetrics.pending}</h4>
                            <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-amber-600">
                               <Clock className="w-3 h-3" />
                               <span>In Review</span>
                            </div>
                         </div>

                         <div className="p-6 bg-rose-50/50 rounded-[2rem] border border-rose-100/50">
                            <p className="text-[10px] font-black text-rose-600/60 uppercase tracking-widest mb-2">Rejected</p>
                            <h4 className="text-2xl font-black text-rose-700">{kycMetrics.rejected}</h4>
                            <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-rose-600">
                               <AlertCircle className="w-3 h-3" />
                               <span>Action Required</span>
                            </div>
                         </div>

                         <div className="p-6 bg-blue-50/50 rounded-[2rem] border border-blue-100/50">
                            <p className="text-[10px] font-black text-blue-600/60 uppercase tracking-widest mb-2">Re-uploads</p>
                            <h4 className="text-2xl font-black text-blue-700">{kycMetrics.reuploadRequests}</h4>
                            <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-blue-600">
                               <RefreshCcw className="w-3 h-3" />
                               <span>Requests Sent</span>
                            </div>
                         </div>

                         <div className="p-6 bg-purple-50/50 rounded-[2rem] border border-purple-100/50">
                            <p className="text-[10px] font-black text-purple-600/60 uppercase tracking-widest mb-2">Avg. Time</p>
                            <h4 className="text-2xl font-black text-purple-700">{kycMetrics.avgVerificationTime}</h4>
                            <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-purple-600">
                               <Zap className="w-3 h-3" />
                               <span>Verification</span>
                            </div>
                         </div>
                      </div>

                      <div className="mt-10 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                                  <Shield className="w-6 h-6 text-blue-500" />
                               </div>
                               <div>
                                  <h4 className="text-sm font-bold text-slate-900">Compliance Health Score</h4>
                                  <p className="text-xs text-slate-400">Based on verification rate and document accuracy</p>
                               </div>
                            </div>
                            <div className="text-right">
                               <span className="text-2xl font-black text-emerald-600">98.2%</span>
                               <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Excellent</p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:gap-8 mt-8">
                   {/* Notifications & System Activity Card */}
                   <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                      <div className="flex justify-between items-center mb-8">
                         <h3 className="text-xl font-bold serif">8. Notifications & System Activity</h3>
                         <Bell className="w-5 h-5 text-blue-500" />
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                         {/* Notification Stats */}
                         <div className="space-y-6">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Notification Stats</h4>
                            <div className="grid grid-cols-2 gap-4">
                               <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50">
                                  <p className="text-[10px] font-black text-blue-600/60 uppercase tracking-widest mb-1">Total Sent</p>
                                  <h4 className="text-2xl font-black text-blue-700">{systemActivityMetrics.totalNotificationsSent}</h4>
                               </div>
                               <div className="p-6 bg-amber-50/50 rounded-3xl border border-amber-100/50">
                                  <p className="text-[10px] font-black text-amber-600/60 uppercase tracking-widest mb-1">Unread</p>
                                  <h4 className="text-2xl font-black text-amber-700">{systemActivityMetrics.unreadNotifications}</h4>
                               </div>
                            </div>
                         </div>

                         {/* Investor Actions (last 24h) */}
                         <div className="space-y-6">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Investor Actions (Last 24h)</h4>
                            <div className="space-y-3">
                               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                  <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <DollarSign className="w-4 h-4 text-emerald-600" />
                                     </div>
                                     <span className="text-xs font-bold text-slate-900">Investments Made</span>
                                  </div>
                                  <span className="text-xs font-black text-emerald-600">+{systemActivityMetrics.investmentsLast24h}</span>
                               </div>
                               
                               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                  <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                        <Download className="w-4 h-4 text-blue-600" />
                                     </div>
                                     <span className="text-xs font-bold text-slate-900">Withdrawals Requested</span>
                                  </div>
                                  <span className="text-xs font-black text-blue-600">+{systemActivityMetrics.withdrawalsLast24h}</span>
                               </div>

                               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                  <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                        <ShieldCheck className="w-4 h-4 text-purple-600" />
                                     </div>
                                     <span className="text-xs font-bold text-slate-900">KYC Submitted</span>
                                  </div>
                                  <span className="text-xs font-black text-purple-600">+{systemActivityMetrics.kycSubmittedLast24h}</span>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:gap-8 mt-8">
                   {/* Live Activity Feed (Real Time Data) Card */}
                   <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                      <div className="flex justify-between items-center mb-8">
                         <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold serif">Live Activity Feed</h3>
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full">
                               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                               <span className="text-[10px] font-black uppercase tracking-widest">Real Time</span>
                            </div>
                         </div>
                         <RefreshCcw className="w-5 h-5 text-slate-300" />
                      </div>

                      <div className="space-y-4">
                         {systemActivityMetrics.liveActivity.map((activity, index) => (
                            <div key={`${activity.type}-${activity.id}-${index}`} className="flex items-start gap-4 p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-white hover:shadow-sm transition-all group">
                               <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-slate-50 ${activity.color}`}>
                                  {activity.icon === 'DollarSign' && <DollarSign className="w-5 h-5" />}
                                  {activity.icon === 'Download' && <Download className="w-5 h-5" />}
                                  {activity.icon === 'RefreshCcw' && <RefreshCcw className="w-5 h-5" />}
                                  {activity.icon === 'ShieldCheck' && <ShieldCheck className="w-5 h-5" />}
                               </div>
                               <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                     <h4 className="text-sm font-bold text-slate-900">{activity.title}</h4>
                                     <span className="text-[10px] font-bold text-slate-400">{new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                  </div>
                                  <p className="text-xs text-slate-500 mt-1">{activity.description}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{activity.type}</span>
                                     <div className="w-1 h-1 bg-slate-200 rounded-full" />
                                     <span className="text-[10px] font-bold text-slate-400">{new Date(activity.date).toLocaleDateString()}</span>
                                  </div>
                               </div>
                               <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <ChevronRight className="w-4 h-4 text-slate-300" />
                               </div>
                            </div>
                         ))}
                      </div>

                      <div className="mt-8 text-center">
                         <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition">
                            View All System Logs
                         </button>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {/* ASSET MANAGER TAB */}
            {activeTab === 'asset-manager' && (
              <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden animate-in slide-in-from-right duration-500">
                <div className="p-10 bg-slate-50/30 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div>
                    <h3 className="text-xl font-bold serif">Asset Manager</h3>
                    <p className="text-xs text-slate-400">Advanced asset tracking and lifecycle management</p>
                  </div>
                  <div className="flex flex-wrap gap-2 p-1 bg-slate-100 rounded-2xl">
                    {[
                      { id: 'All', label: 'All Assets' },
                      { id: 'Active', label: 'Active' },
                      { id: 'Full Funded', label: 'Full Funded' },
                      { id: 'Holding Over', label: 'Holding Over' },
                      { id: 'Rent', label: 'Rent' },
                      { id: 'Dividend', label: 'Dividend' },
                      { id: 'ROI', label: 'ROI' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setAssetManagerSubTab(tab.id as any)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          assetManagerSubTab === tab.id 
                            ? 'bg-white text-slate-900 shadow-sm' 
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                      <tr>
                        <th className="px-10 py-6">Asset Details</th>
                        <th className="px-10 py-6">Status & Funding</th>
                        <th className="px-10 py-6">Return Profile</th>
                        <th className="px-10 py-6">Holding Period</th>
                        <th className="px-10 py-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredAssetManagerOpportunities.map((opp) => (
                        <tr key={opp.id} className="hover:bg-slate-50/50 transition duration-150 group">
                          <td className="px-10 py-8">
                            <div className="flex items-center gap-4">
                              <img src={opp.imageUrl} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt="" />
                              <div>
                                <p className="font-bold text-slate-900">{opp.title}</p>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest">{opp.assetClass}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-8">
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px] font-bold">
                                <span className={opp.raisedAmount >= opp.targetAmount ? 'text-emerald-600' : 'text-blue-600'}>
                                  {opp.raisedAmount >= opp.targetAmount ? 'Fully Funded' : 'Active'}
                                </span>
                                <span>{Math.round((opp.raisedAmount / opp.targetAmount) * 100)}%</span>
                              </div>
                              <div className="w-32 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full transition-all duration-1000 ${opp.raisedAmount >= opp.targetAmount ? 'bg-emerald-500' : 'bg-blue-500'}`} 
                                  style={{ width: `${Math.min(100, (opp.raisedAmount / opp.targetAmount) * 100)}%` }} 
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-8">
                            <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                              {opp.returnType}
                            </span>
                            <p className="text-xs font-bold text-emerald-600 mt-1">{opp.expectedROI} ROI</p>
                          </td>
                          <td className="px-10 py-8">
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span className="text-xs font-medium text-slate-600">{opp.holdingPeriod}</span>
                            </div>
                            {(() => {
                              const yearsMatch = opp.holdingPeriod.match(/(\d+)/);
                              if (yearsMatch) {
                                const years = parseInt(yearsMatch[1]);
                                const createdDate = new Date(opp.createdAt);
                                const now = new Date();
                                const diffYears = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
                                if (diffYears >= years) {
                                  return <span className="text-[8px] font-black uppercase text-rose-500 mt-1 block tracking-tighter">Holding Over</span>;
                                }
                              }
                              return null;
                            })()}
                          </td>
                          <td className="px-10 py-8 text-right">
                            <button onClick={() => { setEditingOpp(opp); setFormData(opp); setShowAdd(true); }} className="p-2 text-slate-400 hover:text-emerald-600 transition">
                              <SlidersHorizontal className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 2. INVENTORY MANAGEMENT (Enhanced) */}
            {activeTab === 'manage' && (
              <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden animate-in slide-in-from-right duration-500">
                {/* Sub-Tabs for Inventory */}
                <div className="px-10 pt-10 flex items-center gap-2 bg-slate-50/30">
                  {(['All', 'Active', 'Full Funded'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setInventorySubTab(tab)}
                      className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        inventorySubTab === tab 
                          ? 'bg-emerald-600 text-white shadow-lg' 
                          : 'bg-white text-slate-400 hover:text-slate-600 border border-slate-100'
                      }`}
                    >
                      {tab === 'All' ? 'All Assets' : tab}
                    </button>
                  ))}
                </div>
                <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center bg-slate-50/30 gap-6">
                  <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                      type="text" 
                      placeholder="Search title, type, or partner..." 
                      className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-4 w-full md:w-auto">
                    {selectedOppIds.length > 0 && (
                      <button 
                        onClick={handleBulkDeleteOppsAction}
                        className="px-6 py-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-rose-100 transition shadow-sm"
                      >
                        <Trash2 className="w-4 h-4" /> Delete Selected ({selectedOppIds.length})
                      </button>
                    )}
                    <button 
                      onClick={() => setShowFilters(!showFilters)}
                      className={`flex-1 md:flex-none px-4 py-3 border rounded-xl transition flex items-center gap-2 ${showFilters ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-slate-200 text-slate-400 hover:text-emerald-600'}`}
                    >
                      <Filter className="w-5 h-5" />
                      <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Filters</span>
                    </button>
                    <button onClick={() => { setSearchQuery(''); setSelectedOppIds([]); setTypeFilter('All'); setReturnTypeFilter('All'); setAssetClassFilter('All'); setPayoutFilter('All'); }} className="flex-1 md:flex-none p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-emerald-600 transition"><RefreshCcw className="w-5 h-5" /></button>
                  </div>
                </div>
                
                {showFilters && (
                  <div className="px-10 py-6 bg-slate-50/50 border-b border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top duration-300">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</label>
                      <select 
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500/20"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                      >
                        <option value="All">All Types</option>
                        {Object.values(InvestmentType).map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Return Type</label>
                      <select 
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500/20"
                        value={returnTypeFilter}
                        onChange={(e) => setReturnTypeFilter(e.target.value)}
                      >
                        <option value="All">All Returns</option>
                        {Object.values(ReturnType).map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Class</label>
                      <select 
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500/20"
                        value={assetClassFilter}
                        onChange={(e) => setAssetClassFilter(e.target.value)}
                      >
                        {uniqueAssetClasses.map(v => <option key={v} value={v}>{v === 'All' ? 'All Classes' : v}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payout Cadence</label>
                      <select 
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500/20"
                        value={payoutFilter}
                        onChange={(e) => setPayoutFilter(e.target.value)}
                      >
                        {uniquePayouts.map(v => <option key={v} value={v}>{v === 'All' ? 'All Cadences' : v}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                      <tr>
                        <th className="px-10 py-6">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded accent-emerald-600" 
                            checked={selectedOppIds.length === filteredOpportunities.length && filteredOpportunities.length > 0}
                            onChange={() => toggleAllOpps(filteredOpportunities)}
                          />
                        </th>
                        <th className="px-4 py-6">Asset Structure</th>
                        <th className="px-10 py-6">Capital Flow</th>
                        <th className="px-10 py-6">Partner Org</th>
                        <th className="px-10 py-6">Holding Days Left</th>
                        <th className="px-10 py-6 text-right">Strategic Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredOpportunities.map((opp) => {
                        const calculateHoldingDaysLeft = (opp: Opportunity) => {
                          if (!opp.holdingPeriod) return 'N/A';
                          
                          const startDate = new Date(opp.publishedAt || opp.createdAt);
                          const now = new Date();
                          
                          // Simple parser for "X Years" or "X Months"
                          // Handles "5-7 Years" by taking the lower bound (5)
                          const match = opp.holdingPeriod.match(/(\d+)/);
                          if (!match) return 'N/A';
                          
                          const value = parseInt(match[1]);
                          const isMonths = opp.holdingPeriod.toLowerCase().includes('month');
                          
                          const endDate = new Date(startDate);
                          if (isMonths) {
                            endDate.setMonth(startDate.getMonth() + value);
                          } else {
                            endDate.setFullYear(startDate.getFullYear() + value);
                          }
                          
                          const diffTime = endDate.getTime() - now.getTime();
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                          
                          if (diffDays <= 0) return 'Completed';
                          return `${diffDays} Days`;
                        };

                        const daysLeft = calculateHoldingDaysLeft(opp);

                        return (
                          <tr key={opp.id} className={`hover:bg-slate-50/50 transition duration-150 group ${selectedOppIds.includes(opp.id) ? 'bg-emerald-50/30' : ''}`}>
                            <td className="px-10 py-8">
                              <input 
                                type="checkbox" 
                                className="w-4 h-4 rounded accent-emerald-600" 
                                checked={selectedOppIds.includes(opp.id)}
                                onChange={() => toggleOppSelection(opp.id)}
                              />
                            </td>
                            <td className="px-4 py-8">
                              <div className="flex items-center gap-5">
                                <img src={opp.imageUrl} className="w-16 h-16 rounded-[1.25rem] object-cover shadow-sm" alt="" />
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-bold text-slate-900 group-hover:text-emerald-600 transition">{opp.title}</p>
                                    {opp.raisedAmount >= opp.targetAmount && (
                                      <span className="px-1.5 py-0.5 bg-slate-900 text-white text-[8px] font-black uppercase tracking-tighter rounded">Full</span>
                                    )}
                                  </div>
                                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-slate-100 rounded text-slate-500">{opp.type}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-10 py-8">
                              <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-bold">
                                  <span className="text-slate-400 uppercase tracking-widest">${(opp.raisedAmount / 1000).toFixed(0)}k</span>
                                  <span className="text-emerald-600 font-black">{Math.round((opp.raisedAmount / opp.targetAmount) * 100)}%</span>
                                </div>
                                <div className="w-32 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                  <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${(opp.raisedAmount / opp.targetAmount) * 100}%` }} />
                                </div>
                              </div>
                            </td>
                            <td className="px-10 py-8">
                              <p className="text-sm font-bold text-slate-700">{opp.partnerName || 'Direct Placement'}</p>
                              <p className="text-[10px] text-slate-400 italic">Verified Partner</p>
                            </td>
                            <td className="px-10 py-8">
                              <div className="flex items-center gap-2">
                                <Clock className={`w-3 h-3 ${daysLeft === 'Completed' ? 'text-emerald-500' : 'text-slate-400'}`} />
                                <p className={`text-sm font-bold ${daysLeft === 'Completed' ? 'text-emerald-600' : 'text-slate-700'}`}>{daysLeft}</p>
                              </div>
                              <p className="text-[10px] text-slate-400 italic">Target: {opp.holdingPeriod}</p>
                            </td>
                            <td className="px-10 py-8 text-right">
                              <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition duration-300">
                                <button onClick={() => { setEditingOpp(opp); setFormData(opp); setShowAdd(true); }} className="p-3 bg-white border border-slate-100 rounded-xl text-blue-600 shadow-sm hover:bg-blue-50 transition"><Edit3 className="w-4 h-4" /></button>
                                <button onClick={() => onDelete(opp.id)} className="p-3 bg-white border border-slate-100 rounded-xl text-rose-600 shadow-sm hover:bg-rose-50 transition"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                        </tbody>
                      </table>
                </div>
              </div>
            )}

            {/* 3. INVESTOR CRM (Enhanced) */}
            {activeTab === 'investors' && (
              <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden animate-in slide-in-from-right duration-500">
                 <div className="p-10 bg-slate-50/30 flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold serif">Investor Directory</h3>
                      <p className="text-xs text-slate-400">Manage and segment your global LP network</p>
                    </div>
                    <div className="flex gap-4">
                       {selectedInvestorIds.length > 0 && (
                         <>
                           <button 
                             onClick={handleBulkApproveInvestorsAction}
                             className="px-6 py-3 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-emerald-100 transition shadow-sm"
                           >
                             <CheckCircle className="w-4 h-4" /> Approve Selected ({selectedInvestorIds.length})
                           </button>
                           <button 
                             onClick={handleBulkRejectInvestorsAction}
                             className="px-6 py-3 bg-amber-50 border border-amber-100 text-amber-600 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-amber-100 transition shadow-sm"
                           >
                             <X className="w-4 h-4" /> Reject Selected
                           </button>
                           <button 
                             onClick={handleBulkDeleteInvestorsAction}
                             className="px-6 py-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-rose-100 transition shadow-sm"
                           >
                             <Trash2 className="w-4 h-4" /> Delete Selected
                           </button>
                         </>
                       )}
                       <button 
                         onClick={() => { setEditingInvestor(null); setInvestorFormData(initialInvestorData); setShowInvestorModal(true); }}
                         className="px-6 py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-emerald-700 transition shadow-lg"
                       >
                         <PlusCircle className="w-4 h-4" /> Register Investor
                       </button>
                       <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-emerald-600 shadow-sm">Export CSV</button>
                    </div>
                 </div>

                 {/* Search and Filters */}
                 <div className="px-10 py-6 bg-white border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                       <input 
                          type="text" 
                          placeholder="Search name, email, or KYC status..." 
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                       />
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                       <select 
                          className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                          value={kycFilter}
                          onChange={(e) => setKycFilter(e.target.value)}
                       >
                          <option value="All">All KYC Status</option>
                          <option value="Verified">Verified</option>
                          <option value="Pending">Pending</option>
                          <option value="Rejected">Rejected</option>
                       </select>
                       <select 
                          className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                          value={riskFilter}
                          onChange={(e) => setRiskFilter(e.target.value)}
                       >
                          <option value="All">All Risk Profiles</option>
                          <option value="Conservative">Conservative</option>
                          <option value="Balanced">Balanced</option>
                          <option value="Aggressive">Aggressive</option>
                       </select>
                       <button 
                          onClick={() => { setSearchQuery(''); setKycFilter('All'); setRiskFilter('All'); }}
                          className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-400 hover:text-emerald-600 transition"
                          title="Reset Filters"
                       >
                          <RefreshCcw className="w-4 h-4" />
                       </button>
                    </div>
                 </div>

                 {/* Segmentation Summary */}
                 <div className="px-10 py-8 bg-slate-50/50 border-y border-slate-100">
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                      {Object.entries(riskSegments).map(([profile, data]) => {
                        const d = data as { count: number, total: number };
                        return (
                          <div key={profile} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                              <div className={`w-2 h-2 rounded-full ${profile === 'Aggressive' ? 'bg-rose-500' : profile === 'Balanced' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{profile} Profile</p>
                            </div>
                            <div className="flex justify-between items-end">
                              <div>
                                <h4 className="text-2xl font-black text-slate-900">{d.count}</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">Investors</p>
                              </div>
                              <div className="text-right">
                                <h4 className="text-lg font-bold text-emerald-600">${(d.total / 1000).toFixed(1)}k</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">Total Capital</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      {investmentSegments.map((segment) => (
                        <div key={segment.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{segment.label}</p>
                          <div className="flex justify-between items-end">
                            <div>
                              <h4 className="text-2xl font-black text-slate-900">{segment.count}</h4>
                              <p className="text-[10px] text-slate-400 font-bold uppercase">Investors</p>
                            </div>
                            <div className="text-right">
                              <h4 className="text-lg font-bold text-blue-600">${(segment.total / 1000).toFixed(1)}k</h4>
                              <p className="text-[10px] text-slate-400 font-bold uppercase">Aggregate Value</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                 </div>

                 <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                      <tr>
                        <th className="px-10 py-6">
                           <input 
                             type="checkbox" 
                             className="w-4 h-4 rounded accent-emerald-600" 
                             checked={selectedInvestorIds.length === filteredInvestors.length && filteredInvestors.length > 0}
                             onChange={() => toggleAllInvestors(filteredInvestors)}
                           />
                        </th>
                        <th className="px-4 py-6">Profile</th>
                        <th className="px-4 py-6">Investor ID</th>
                        <th className="px-10 py-6">Capital Deployed</th>
                        <th className="px-10 py-6">Compliance</th>
                        <th className="px-10 py-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredInvestors.map((inv, index) => (
                        <tr key={`${inv.id}-${index}`} className={`hover:bg-slate-50/50 transition duration-150 ${selectedInvestorIds.includes(inv.id) ? 'bg-emerald-50/30' : ''}`}>
                          <td className="px-10 py-8">
                            <input 
                               type="checkbox" 
                               className="w-4 h-4 rounded accent-emerald-600" 
                               checked={selectedInvestorIds.includes(inv.id)}
                               onChange={() => toggleInvestorSelection(inv.id)}
                            />
                          </td>
                          <td className="px-4 py-8">
                            <div className="flex items-center gap-4">
                              <img src={inv.avatar} className="w-12 h-12 rounded-full border-2 border-slate-100" alt="" />
                              <div>
                                <p className="font-bold text-slate-900">{inv.name}</p>
                                <p className="text-[10px] text-slate-400 tracking-wider uppercase">{inv.riskProfile} Profile</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-8">
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-mono font-bold border border-slate-200">
                              {inv.investorUniqueId}
                            </span>
                          </td>
                          <td className="px-10 py-8">
                            <p className="font-black text-slate-900">${(inv.totalInvested ?? 0).toLocaleString()}</p>
                            <p className="text-[10px] text-slate-400 uppercase font-bold">{inv.activeAssets} Positions</p>
                          </td>
                          <td className="px-10 py-8">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                              inv.kycStatus === 'Verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {inv.kycStatus}
                            </span>
                          </td>
                          <td className="px-10 py-8 text-right relative">
                            <button 
                              onClick={() => setShowInvestorActions(showInvestorActions === inv.id ? null : inv.id)}
                              className="p-3 text-slate-400 hover:text-emerald-600 transition bg-slate-50 rounded-xl"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            
                            {showInvestorActions === inv.id && (
                              <div className="absolute right-10 top-20 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in duration-200">
                                <button 
                                  onClick={() => { onBulkApproveInvestors?.([inv.id]); setShowInvestorActions(null); }}
                                  className="w-full px-4 py-2 text-left text-xs font-bold text-emerald-600 hover:bg-emerald-50 flex items-center gap-2"
                                >
                                  <CheckCircle className="w-4 h-4" /> Approve KYC
                                </button>
                                <button 
                                  onClick={() => { onBulkRejectInvestors?.([inv.id]); setShowInvestorActions(null); }}
                                  className="w-full px-4 py-2 text-left text-xs font-bold text-amber-600 hover:bg-amber-50 flex items-center gap-2"
                                >
                                  <X className="w-4 h-4" /> Reject KYC
                                </button>
                                <button 
                                  onClick={() => { setQuickInvestData({ ...quickInvestData, investorId: inv.id }); setShowQuickInvestModal(true); setShowInvestorActions(null); }}
                                  className="w-full px-4 py-2 text-left text-xs font-bold text-emerald-600 hover:bg-emerald-50 flex items-center gap-2"
                                >
                                  <DollarSign className="w-4 h-4" /> Record Invest
                                </button>
                                <button 
                                  onClick={() => { setShowInvestorDetail(inv); setShowInvestorActions(null); }}
                                  className="w-full px-4 py-2 text-left text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <FileText className="w-4 h-4" /> View Details
                                </button>
                                <button 
                                  onClick={() => { setEditingInvestor(inv); setInvestorFormData(inv); setShowInvestorModal(true); setShowInvestorActions(null); }}
                                  className="w-full px-4 py-2 text-left text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <Edit3 className="w-4 h-4" /> Edit Profile
                                </button>
                                <button 
                                  onClick={() => { handleDeleteInvestorAction(inv.id); setShowInvestorActions(null); }}
                                  className="w-full px-4 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                                >
                                  <Trash2 className="w-4 h-4" /> Delete Profile
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. TRANSACTION LEDGER */}
            {/* Referrals Management */}
            {activeTab === 'referrals' && (
              <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden animate-in slide-in-from-right duration-500">
                <div className="p-10 bg-slate-50/30 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold serif">Referral Management</h3>
                    <p className="text-xs text-slate-400">Track and manage the global referral network</p>
                  </div>
                </div>

                <div className="p-10">
                  <div className="grid md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-emerald-50 p-8 rounded-[2rem] border border-emerald-100">
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-2">Total Referrals</p>
                      <h4 className="text-4xl font-black text-emerald-900">{referrals.length}</h4>
                    </div>
                    <div className="bg-blue-50 p-8 rounded-[2rem] border border-blue-100">
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2">Active Referrals</p>
                      <h4 className="text-4xl font-black text-blue-900">{referrals.filter(r => r.status === 'Active').length}</h4>
                    </div>
                    <div className="bg-amber-50 p-8 rounded-[2rem] border border-amber-100">
                      <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-2">Total Rewards Paid</p>
                      <h4 className="text-4xl font-black text-amber-900">{formatCurrency(referrals.reduce((sum, r) => sum + (r.rewardAmount || 0), 0))}</h4>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100">
                          <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Referrer</th>
                          <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Referred User</th>
                          <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Date</th>
                          <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Status</th>
                          <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Reward</th>
                        </tr>
                      </thead>
                      <tbody>
                        {referrals.map((ref) => (
                          <tr key={ref.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                            <td className="py-6 px-4">
                              <div className="font-bold text-slate-900">{ref.referrer?.name}</div>
                              <div className="text-[10px] text-slate-400">{ref.referrer?.email}</div>
                            </td>
                            <td className="py-6 px-4">
                              <div className="font-bold text-slate-900">{ref.referred?.name}</div>
                              <div className="text-[10px] text-slate-400">{ref.referred?.email}</div>
                            </td>
                            <td className="py-6 px-4 text-xs font-medium text-slate-600">
                              {new Date(ref.date).toLocaleDateString()}
                            </td>
                            <td className="py-6 px-4">
                              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                ref.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {ref.status}
                              </span>
                            </td>
                            <td className="py-6 px-4 font-black text-slate-900">
                              {formatCurrency(ref.rewardAmount || 0)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'transactions' && (
              <div className="space-y-6 animate-in slide-in-from-right duration-500">
                <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-10 bg-slate-50/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                      <h3 className="text-xl font-bold serif">System-wide Ledger</h3>
                      <p className="text-xs text-slate-400">Monitor all capital movements and payouts</p>
                    </div>
                    <button 
                      onClick={() => setShowReturnModal(true)}
                      className="px-6 py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-emerald-700 transition shadow-lg"
                    >
                      <DollarSign className="w-4 h-4" /> Give a Return
                    </button>
                  </div>

                  {/* Ledger Filters */}
                  <div className="px-10 py-6 border-b border-slate-100 bg-white grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search by asset, investor, or ID..."
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500/20"
                        value={ledgerSearchQuery}
                        onChange={(e) => setLedgerSearchQuery(e.target.value)}
                      />
                    </div>
                    <select 
                      className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500/20"
                      value={ledgerAssetFilter}
                      onChange={(e) => setLedgerAssetFilter(e.target.value)}
                    >
                      <option value="All">All Assets</option>
                      {uniqueAssets.map(asset => (
                        <option key={asset} value={asset}>{asset}</option>
                      ))}
                    </select>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">From:</span>
                      <input 
                        type="date" 
                        className="flex-grow px-3 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500/20"
                        value={ledgerDateFrom}
                        onChange={(e) => setLedgerDateFrom(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">To:</span>
                      <input 
                        type="date" 
                        className="flex-grow px-3 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500/20"
                        value={ledgerDateTo}
                        onChange={(e) => setLedgerDateTo(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                   <table className="w-full text-left">
                    <thead className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50">
                      <tr>
                        <th className="px-10 py-6">TX Identifier</th>
                        <th className="px-10 py-6">Investor</th>
                        <th className="px-10 py-6">Asset</th>
                        <th className="px-10 py-6">Date</th>
                        <th className="px-10 py-6">Type</th>
                        <th className="px-10 py-6 text-right">Amount</th>
                        <th className="px-10 py-6 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredLedger.length > 0 ? filteredLedger.map((tx, index) => (
                        <tr key={`${tx.id}-${index}`} className="hover:bg-slate-50/50">
                          <td className="px-10 py-8 font-mono text-[11px] text-slate-500">{tx.id}</td>
                          <td className="px-10 py-8 font-bold text-slate-900">
                            {investors.find(i => i.id === tx.investorId)?.name || 'Unknown'}
                          </td>
                          <td className="px-10 py-8 text-sm font-medium text-slate-600">{tx.investmentTitle}</td>
                          <td className="px-10 py-8 text-xs text-slate-500">{new Date(tx.date).toLocaleDateString()}</td>
                          <td className="px-10 py-8">
                            <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[9px] font-black uppercase tracking-widest">{tx.type}</span>
                          </td>
                          <td className="px-10 py-8 font-black text-emerald-600 text-right">${(tx.amount ?? 0).toLocaleString()}</td>
                          <td className="px-10 py-8 text-center">
                             <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50">Confirmed</span>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={7} className="px-10 py-20 text-center text-slate-400 italic">No transactions found matching your filters.</td>
                        </tr>
                      )}
                    </tbody>
                   </table>
                </div>
              </div>
            </div>
          )}

            {/* 5. ANALYTICAL REPORTS (New Section with 20 Features) */}
            {activeTab === 'reports' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                      <h3 className="text-2xl font-bold serif">Intelligence Hub</h3>
                      <p className="text-sm text-slate-500">Comprehensive data analysis and strategic reporting</p>
                    </div>
                    <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                      {['Investors', 'Assets', 'Financials', 'Operations', 'KPIs'].map((t) => (
                        <button 
                          key={t} 
                          onClick={() => setReportSubTab(t)}
                          className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition ${
                            reportSubTab === t ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {reportSubTab === 'KPIs' ? (
                    <div className="space-y-12 animate-in zoom-in-95 duration-500">
                      <div className="grid lg:grid-cols-2 gap-8">
                        {/* KPI 1: Average ROI by Risk Profile */}
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                          <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8">Avg ROI by Risk Profile</h4>
                          <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={KPI_ROI_DATA}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="profile" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} unit="%" />
                                <Tooltip 
                                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                  cursor={{ fill: '#f8fafc' }}
                                />
                                <Bar dataKey="roi" fill="#10b981" radius={[8, 8, 0, 0]} barSize={40} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* KPI 2: Total Capital Deployed Over Time */}
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                          <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8">Capital Deployed (USD)</h4>
                          <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={KPI_CAPITAL_DATA}>
                                <defs>
                                  <linearGradient id="colorCapital" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} tickFormatter={(val) => `$${(val / 1000000).toFixed(1)}M`} />
                                <Tooltip 
                                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                  formatter={(val: number) => [`$${val.toLocaleString()}`, 'Capital']}
                                />
                                <Area type="monotone" dataKey="capital" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCapital)" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* KPI 3: Property Type Distribution */}
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                          <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8">Asset Allocation by Type</h4>
                          <div className="h-64 w-full flex items-center">
                            <ResponsiveContainer width="100%" height="100%">
                              <RePieChart>
                                <Pie
                                  data={KPI_PROPERTY_DATA}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={80}
                                  paddingAngle={5}
                                  dataKey="value"
                                >
                                  {KPI_PROPERTY_DATA.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip 
                                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }} />
                              </RePieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* KPI 4: Monthly Active Investors */}
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                          <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8">Monthly Active Investors</h4>
                          <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={KPI_ACTIVE_INVESTORS}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                                <Tooltip 
                                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line type="stepAfter" dataKey="active" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>

                      {/* Additional Metrics Row */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                          { label: 'Avg Ticket Size', val: '$24,500', trend: '+12%', color: 'text-emerald-600' },
                          { label: 'Investor LTV', val: '$142,000', trend: '+8%', color: 'text-blue-600' },
                          { label: 'Re-investment Rate', val: '68%', trend: '+5%', color: 'text-amber-600' },
                          { label: 'Platform Yield', val: '11.4%', trend: '+0.4%', color: 'text-purple-600' },
                        ].map((stat, i) => (
                          <div key={i} className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
                            <h5 className="text-xl font-black text-slate-900">{stat.val}</h5>
                            <span className={`text-[10px] font-bold ${stat.color}`}>{stat.trend} vs last month</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : reportSubTab === 'Investors' ? (
                    <div className="space-y-12 animate-in fade-in duration-500">
                      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                          <div>
                            <h4 className="text-lg font-bold serif">Capital Deployment by Segment</h4>
                            <p className="text-xs text-slate-400">Total capital deployed grouped by investor investment volume</p>
                          </div>
                          <div className="flex gap-6">
                            {investmentSegments.map((s, i) => (
                              <div key={`${s.label}-${i}`} className="text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label.split(' ')[0]}</p>
                                <p className="text-sm font-bold text-slate-900">${(s.total / 1000).toFixed(1)}k</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="h-80 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={investmentSegments}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis 
                                dataKey="label" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                              />
                              <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                                tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                              />
                              <Tooltip 
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                formatter={(val: number) => [`$${val.toLocaleString()}`, 'Total Capital']}
                                cursor={{ fill: '#f8fafc' }}
                              />
                              <Bar dataKey="total" fill="#10b981" radius={[12, 12, 0, 0]} barSize={60} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1: Investor Details Report */}
                        <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:border-emerald-200 transition group">
                          <div className="flex justify-between items-start mb-6">
                            <Users className="w-6 h-6 text-emerald-600" />
                            <Download className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 cursor-pointer" />
                          </div>
                          <h4 className="font-bold text-slate-900 mb-2">Investor Details</h4>
                          <p className="text-xs text-slate-500 leading-relaxed">Granular breakdown of LP profiles, verification tiers, and lifetime value metrics.</p>
                        </div>

                        {/* Feature 2: Property Investor Analysis */}
                        <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:border-emerald-200 transition group">
                          <div className="flex justify-between items-start mb-6">
                            <Globe className="w-6 h-6 text-blue-600" />
                            <Download className="w-4 h-4 text-slate-300 group-hover:text-blue-600 cursor-pointer" />
                          </div>
                          <h4 className="font-bold text-slate-900 mb-2">Property Investors</h4>
                          <p className="text-xs text-slate-500 leading-relaxed">Specific tracking for real estate focused capital and regional property preferences.</p>
                        </div>

                        {/* Feature 3: Invest Type Distribution */}
                        <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:border-emerald-200 transition group">
                          <div className="flex justify-between items-start mb-6">
                            <PieChart className="w-6 h-6 text-amber-600" />
                            <Download className="w-4 h-4 text-slate-300 group-hover:text-amber-600 cursor-pointer" />
                          </div>
                          <h4 className="font-bold text-slate-900 mb-2">Invest Type Matrix</h4>
                          <p className="text-xs text-slate-500 leading-relaxed">Comparative analysis between Hotel, Startup, and Commercial asset performance.</p>
                        </div>
                      </div>
                    </div>
                  ) : reportSubTab === 'Assets' ? (
                    <div className="space-y-12 animate-in fade-in duration-500">
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                          <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8">Occupancy Rate by Property</h4>
                          <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={opportunities.filter(o => o.type === InvestmentType.COMMERCIAL_PROPERTY).map(o => ({ name: o.title.split(' ')[0], rate: 85 + Math.random() * 10 }))}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} unit="%" />
                                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none' }} />
                                <Bar dataKey="rate" fill="#3b82f6" radius={[8, 8, 0, 0]} barSize={30} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                          <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8">Asset Status Distribution</h4>
                          <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <RePieChart>
                                <Pie
                                  data={[
                                    { name: 'Active', value: 12 },
                                    { name: 'Under Renovation', value: 3 },
                                    { name: 'Pending Acquisition', value: 2 },
                                    { name: 'Exited', value: 1 }
                                  ]}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={80}
                                  paddingAngle={5}
                                  dataKey="value"
                                >
                                  {CHART_COLORS.map((color, index) => (
                                    <Cell key={`cell-${index}`} fill={color} />
                                  ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                              </RePieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : reportSubTab === 'Financials' ? (
                    <div className="space-y-12 animate-in fade-in duration-500">
                      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8">Revenue vs Expenses (USD)</h4>
                        <div className="h-80 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[
                              { month: 'Jan', rev: 45000, exp: 32000 },
                              { month: 'Feb', rev: 52000, exp: 34000 },
                              { month: 'Mar', rev: 48000, exp: 31000 },
                              { month: 'Apr', rev: 61000, exp: 38000 },
                              { month: 'May', rev: 59000, exp: 36000 },
                              { month: 'Jun', rev: 72000, exp: 42000 },
                            ]}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                              <Tooltip />
                              <Area type="monotone" dataKey="rev" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                              <Area type="monotone" dataKey="exp" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.1} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-12 animate-in fade-in duration-500">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                          <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">System Health</h4>
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                              <Activity className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-2xl font-black text-slate-900">99.98%</p>
                              <p className="text-[10px] font-bold text-emerald-600 uppercase">Uptime (Last 30d)</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                          <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">API Latency</h4>
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                              <Zap className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-2xl font-black text-slate-900">124ms</p>
                              <p className="text-[10px] font-bold text-blue-600 uppercase">Avg Response Time</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                          <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Database Load</h4>
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                              <Database className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-2xl font-black text-slate-900">34%</p>
                              <p className="text-[10px] font-bold text-amber-600 uppercase">Current Capacity</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                      <div className="grid md:grid-cols-3 gap-8">
                    {/* Feature 1: Investor Details Report */}
                    <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:border-emerald-200 transition group">
                      <div className="flex justify-between items-start mb-6">
                        <Users className="w-6 h-6 text-emerald-600" />
                        <Download className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 cursor-pointer" />
                      </div>
                      <h4 className="font-bold text-slate-900 mb-2">Investor Details</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">Granular breakdown of LP profiles, verification tiers, and lifetime value metrics.</p>
                    </div>

                    {/* Feature 2: Property Investor Analysis */}
                    <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:border-emerald-200 transition group">
                      <div className="flex justify-between items-start mb-6">
                        <Globe className="w-6 h-6 text-blue-600" />
                        <Download className="w-4 h-4 text-slate-300 group-hover:text-blue-600 cursor-pointer" />
                      </div>
                      <h4 className="font-bold text-slate-900 mb-2">Property Investors</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">Specific tracking for real estate focused capital and regional property preferences.</p>
                    </div>

                    {/* Feature 3: Invest Type Distribution */}
                    <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:border-emerald-200 transition group">
                      <div className="flex justify-between items-start mb-6">
                        <PieChart className="w-6 h-6 text-amber-600" />
                        <Download className="w-4 h-4 text-slate-300 group-hover:text-amber-600 cursor-pointer" />
                      </div>
                      <h4 className="font-bold text-slate-900 mb-2">Invest Type Matrix</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">Comparative analysis between Hotel, Startup, and Commercial asset performance.</p>
                    </div>

                    {/* Feature 4: Geographic Heatmap */}
                    <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm">
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Capital Origin</h5>
                      <div className="space-y-3">
                        {[{ c: 'Europe', p: 65 }, { c: 'Asia', p: 20 }, { c: 'Americas', p: 15 }].map(geo => (
                          <div key={geo.c} className="flex items-center gap-3">
                            <span className="text-[10px] font-bold w-12">{geo.c}</span>
                            <div className="flex-grow h-1.5 bg-slate-50 rounded-full overflow-hidden">
                              <div className="h-full bg-slate-900" style={{ width: `${geo.p}%` }}></div>
                            </div>
                            <span className="text-[10px] font-black">{geo.p}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Feature 5: ROI Performance Tracking */}
                    <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm">
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">ROI Variance</h5>
                      <div className="flex items-end gap-2 h-20">
                        {[40, 70, 45, 90, 65, 80].map((h, i) => (
                          <div key={i} className="flex-grow bg-emerald-100 rounded-t-lg group relative" style={{ height: `${h}%` }}>
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-bold opacity-0 group-hover:opacity-100 transition">{h}%</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Feature 6: Capital Flow Forecast */}
                    <div className="p-8 bg-emerald-600 rounded-3xl text-white shadow-xl shadow-emerald-100">
                      <TrendingUp className="w-6 h-6 mb-4" />
                      <h4 className="font-bold mb-2">Cash Flow Forecast</h4>
                      <p className="text-[10px] text-emerald-100 mb-4">Projected $4.2M in distributions for Q3 2025 based on current asset performance.</p>
                      <button className="text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 py-2 px-4 rounded-lg transition">View Projection</button>
                    </div>
                  </div>

                  {/* Feature 7-20: Detailed Grid */}
                  <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { icon: <ShieldCheck />, title: "Compliance Audit", desc: "Full KYC/AML status log" },
                      { icon: <DollarSign />, title: "Tax Benefit Log", desc: "Relief eligibility tracking" },
                      { icon: <Briefcase />, title: "Partner Rankings", desc: "Performance by entity" },
                      { icon: <AlertCircle />, title: "Risk Exposure", desc: "Portfolio risk distribution" },
                      { icon: <Activity />, title: "TX Velocity", desc: "Daily transaction volume" },
                      { icon: <Users />, title: "User Retention", desc: "Churn & repeat metrics" },
                      { icon: <CreditCard />, title: "Revenue Leakage", desc: "Uncollected fee analysis" },
                      { icon: <RefreshCcw />, title: "Market Liquidity", desc: "Secondary trade volume" },
                      { icon: <Clock />, title: "Payout History", desc: "Historical distribution log" },
                      { icon: <Send />, title: "Marketing ROI", desc: "Attribution by channel" },
                      { icon: <Database />, title: "System Health", desc: "Technical uptime reports" },
                      { icon: <MessageSquare />, title: "Investor Sentiment", desc: "Aggregated feedback data" },
                      { icon: <FileText />, title: "Regulatory Export", desc: "Authority-ready datasets" },
                      { icon: <Settings />, title: "Report Builder", desc: "Custom field extraction" },
                    ].map((f, i) => (
                      <div key={i} className="p-6 bg-white border border-slate-50 rounded-2xl hover:shadow-md transition cursor-pointer group">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition mb-4">
                          {React.cloneElement(f.icon as React.ReactElement, { className: "w-5 h-5" })}
                        </div>
                        <h5 className="text-sm font-bold text-slate-900 mb-1">{f.title}</h5>
                        <p className="text-[10px] text-slate-400">{f.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* Feature 21: Live Performance Monitor (Bonus) */}
                  <div className="mt-12 bg-slate-900 p-10 rounded-[3rem] text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                    <div className="flex justify-between items-center relative z-10">
                      <div>
                        <h3 className="text-xl font-bold serif mb-2">Real-time Performance Monitor</h3>
                        <p className="text-xs text-slate-400">Tracking live platform interactions and capital movement</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                          {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800" />)}
                        </div>
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">12 Active Admins</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. KYC COMPLIANCE QUEUE */}
            {activeTab === 'kyc' && (
              <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 serif">Compliance Oversight</h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Identity Verification Pipeline</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                       <p className="text-[10px] font-black uppercase text-emerald-600 mb-2">Verified</p>
                       <p className="text-3xl font-black text-emerald-700">{investors.filter(i => i.kycStatus === 'Verified').length}</p>
                    </div>
                    <div className="text-center p-6 bg-amber-50 rounded-3xl border border-amber-100">
                       <p className="text-[10px] font-black uppercase text-amber-600 mb-2">Pending</p>
                       <p className="text-3xl font-black text-amber-700">{investors.filter(i => i.kycStatus === 'Pending').length}</p>
                    </div>
                    <div className="text-center p-6 bg-rose-50 rounded-3xl border border-rose-100">
                       <p className="text-[10px] font-black uppercase text-rose-600 mb-2">Rejected</p>
                       <p className="text-3xl font-black text-rose-700">{investors.filter(i => i.kycStatus === 'Rejected').length}</p>
                    </div>
                  </div>
                </div>

                {/* Sub-Tabs */}
                <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
                  {[
                    { id: 'All', label: 'All Investor' },
                    { id: 'Pending', label: 'Pending Investor' },
                    { id: 'Verified', label: 'Approved Investor' },
                    { id: 'Rejected', label: 'Reject Investor' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setKycSubTab(tab.id as any)}
                      className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        kycSubTab === tab.id 
                          ? 'bg-white text-slate-900 shadow-sm' 
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Filters */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text"
                        placeholder="Search by Name, Email, ID..."
                        value={kycSearchQuery}
                        onChange={(e) => setKycSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                    <select 
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none"
                      value={kycInvestorFilter}
                      onChange={(e) => setKycInvestorFilter(e.target.value)}
                    >
                      <option value="All">All Investors</option>
                      {investors.map(inv => (
                        <option key={inv.id} value={inv.id}>{inv.name}</option>
                      ))}
                    </select>
                    <div className="flex items-center gap-2">
                      <input 
                        type="date"
                        value={kycDateFrom}
                        onChange={(e) => setKycDateFrom(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                      <span className="text-slate-300">to</span>
                      <input 
                        type="date"
                        value={kycDateTo}
                        onChange={(e) => setKycDateTo(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                    <select 
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none"
                      value={kycStatusFilter}
                      onChange={(e) => setKycStatusFilter(e.target.value)}
                    >
                      <option value="All">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Verified">Verified</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  {(kycSearchQuery || kycInvestorFilter !== 'All' || kycDateFrom || kycDateTo || kycStatusFilter !== 'All') && (
                    <button 
                      onClick={() => {
                        setKycSearchQuery('');
                        setKycInvestorFilter('All');
                        setKycDateFrom('');
                        setKycDateTo('');
                        setKycStatusFilter('All');
                      }}
                      className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>

                <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-10 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
                    <h4 className="font-bold">Identity Verification Pipeline</h4>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <Clock className="w-3 h-3" />
                      Avg. Response Time: 14.2 Hours
                    </div>
                  </div>
                  <div className="p-10 space-y-6">
                    {filteredKycInvestors.length > 0 ? filteredKycInvestors.map(i => {
                      const daysPending = getDaysSince(i.joinedDate);
                      const needsReminder = daysPending > 7;
                      
                      return (
                        <div key={i.id} className={`flex flex-col p-8 border rounded-[2rem] transition ${needsReminder ? 'border-amber-200 bg-amber-50/30' : 'border-slate-100 hover:bg-slate-50/50'}`}>
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <img src={i.avatar} className="w-16 h-16 rounded-2xl object-cover shadow-sm" alt="" />
                                {i.kycStatus === 'Rejected' && (
                                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center border-2 border-white">
                                    <X className="w-3 h-3 text-white" />
                                  </div>
                                )}
                              </div>
                              <div>
                                 <div className="flex items-center gap-2">
                                   <p className="text-lg font-bold">{i.name}</p>
                                   <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                                     i.kycStatus === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                                     i.kycStatus === 'Verified' ? 'bg-emerald-100 text-emerald-700' :
                                     'bg-rose-100 text-rose-700'
                                   }`}>
                                     {i.kycStatus}
                                   </span>
                                 </div>
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{i.email}</p>
                                 <p className="text-[10px] text-slate-400 mt-1">Joined {new Date(i.joinedDate).toLocaleDateString()}</p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {i.kycStatus !== 'Verified' && (
                                <button 
                                  onClick={() => {
                                    setReminderTarget(i);
                                    setReminderMessage('Please complete your KYC verification to access all features.');
                                    setShowReminderModal(true);
                                  }}
                                  className="px-5 py-2.5 bg-white border border-slate-200 hover:border-amber-500 hover:text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 transition flex items-center gap-2"
                                >
                                  <Send className="w-3 h-3" /> Send Reminder
                                </button>
                              )}
                              {i.kycStatus !== 'Verified' && (
                                <button 
                                  onClick={() => onSendKYCMessage(i.id, 'Approval', 'Your KYC has been approved. Welcome aboard!')}
                                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition flex items-center gap-2 shadow-lg shadow-emerald-200"
                                >
                                   <CheckCircle className="w-3 h-3" /> Approve
                                </button>
                              )}
                              {i.kycStatus !== 'Rejected' && (
                                <button 
                                  onClick={() => {
                                    setRejectionTarget(i);
                                    setRejectionReason('');
                                    setShowRejectionModal(true);
                                  }}
                                  className="px-5 py-2.5 bg-rose-50 hover:bg-rose-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-600 transition"
                                >
                                  Reject
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {i.kycDocuments.length > 0 ? i.kycDocuments.map((doc, idx) => (
                              <div key={idx} className="group relative bg-white p-4 rounded-2xl border border-slate-100 hover:border-emerald-500 transition-all">
                                <div className="flex items-center gap-3">
                                  <div className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:text-emerald-600 transition-colors">
                                    <FileText className="w-5 h-5" />
                                  </div>
                                  <div className="overflow-hidden">
                                    <p className="text-xs font-bold text-slate-900 truncate">Document_{idx + 1}</p>
                                    <p className="text-[8px] text-slate-400 uppercase font-black tracking-widest">
                                      {i.kycStatus === 'Verified' ? 'Verified' : 'Verification Required'}
                                    </p>
                                  </div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center bg-emerald-600/90 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl text-white gap-4">
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
                                    className="flex flex-col items-center gap-1 hover:scale-110 transition-transform"
                                    title="View Document"
                                  >
                                    <Eye className="w-5 h-5" />
                                    <span className="text-[8px] font-black uppercase tracking-widest">View</span>
                                  </button>
                                  <a 
                                    href={doc} 
                                    download={`KYC_Document_${idx + 1}`}
                                    className="flex flex-col items-center gap-1 hover:scale-110 transition-transform"
                                    title="Download Document"
                                  >
                                    <Download className="w-5 h-5" />
                                    <span className="text-[8px] font-black uppercase tracking-widest">Download</span>
                                  </a>
                                </div>
                              </div>
                            )) : (
                              <div className="col-span-full py-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                <p className="text-xs font-bold text-slate-400">No documents uploaded yet.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }) : (
                      <div className="text-center py-20 opacity-40">
                         <ShieldCheck className="w-16 h-16 mx-auto mb-6" />
                         <p className="font-bold">No investors found matching your criteria.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 7. SYSTEM CONFIGURATION */}
            {activeTab === 'investments' && (
              <div className="space-y-6 animate-in slide-in-from-right duration-500">
                <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-10 bg-slate-50/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold serif">Investors Investment Management</h3>
                      <div className="relative flex-grow max-w-md hidden md:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="Search by asset, investor, or ID..."
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
                          value={invMgmtSearchQuery}
                          onChange={(e) => setInvMgmtSearchQuery(e.target.value)}
                        />
                      </div>
                      <button 
                        onClick={() => setShowInvMgmtFilters(!showInvMgmtFilters)}
                        className={`p-2 rounded-xl transition shadow-sm border ${
                          showInvMgmtFilters 
                            ? 'bg-emerald-600 border-emerald-500 text-white' 
                            : 'bg-white border-slate-200 text-slate-400 hover:text-emerald-600'
                        }`}
                        title="Toggle Filters"
                      >
                        <SlidersHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                      {(['Investment', 'Return', 'Withdrawals', 'Rent', 'ROI', 'Dividend'] as const).map((tab) => (
                        <button 
                          key={tab} 
                          onClick={() => setInvestmentSubTab(tab)}
                          className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition ${
                            investmentSubTab === tab ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Filters Section */}
                  {showInvMgmtFilters && (
                    <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/50 animate-in slide-in-from-top duration-300">
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                          <Filter className="w-4 h-4 text-emerald-600" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Active Filters</span>
                        </div>
                        {(invMgmtInvestorFilter !== 'All' || invMgmtAssetFilter !== 'All' || invMgmtTypeFilter !== 'All' || invMgmtReturnTypeFilter !== 'All' || invMgmtDateFrom || invMgmtDateTo) && (
                          <button 
                            onClick={() => {
                              setInvMgmtInvestorFilter('All');
                              setInvMgmtAssetFilter('All');
                              setInvMgmtTypeFilter('All');
                              setInvMgmtReturnTypeFilter('All');
                              setInvMgmtDateFrom('');
                              setInvMgmtDateTo('');
                            }}
                            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 transition"
                          >
                            <RefreshCcw className="w-3 h-3" />
                            Reset All
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {/* Investor Filter */}
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Investor</label>
                          <select 
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
                            value={invMgmtInvestorFilter}
                            onChange={(e) => setInvMgmtInvestorFilter(e.target.value)}
                          >
                            <option value="All">All Investors</option>
                            {investors.map(inv => (
                              <option key={inv.id} value={inv.id}>{inv.name}</option>
                            ))}
                          </select>
                        </div>

                        {/* Asset Filter */}
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Asset</label>
                          <select 
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
                            value={invMgmtAssetFilter}
                            onChange={(e) => setInvMgmtAssetFilter(e.target.value)}
                          >
                            <option value="All">All Assets</option>
                            {opportunities.map(opp => (
                              <option key={opp.id} value={opp.id}>{opp.title}</option>
                            ))}
                          </select>
                        </div>

                        {/* Type Filter */}
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Type</label>
                          <select 
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
                            value={invMgmtTypeFilter}
                            onChange={(e) => setInvMgmtTypeFilter(e.target.value)}
                          >
                            <option value="All">All Types</option>
                            {Object.values(InvestmentType).map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>

                        {/* Return Type Filter */}
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Return Type</label>
                          <select 
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
                            value={invMgmtReturnTypeFilter}
                            onChange={(e) => setInvMgmtReturnTypeFilter(e.target.value)}
                          >
                            <option value="All">All Return Types</option>
                            {Object.values(ReturnType).map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>

                        {/* Date From */}
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">From Date</label>
                          <input 
                            type="date" 
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
                            value={invMgmtDateFrom}
                            onChange={(e) => setInvMgmtDateFrom(e.target.value)}
                          />
                        </div>

                        {/* Date To */}
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">To Date</label>
                          <input 
                            type="date" 
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
                            value={invMgmtDateTo}
                            onChange={(e) => setInvMgmtDateTo(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="overflow-x-auto">
                    {investmentSubTab === 'Investment' && (
                      <table className="w-full text-left">
                        <thead className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50">
                          <tr>
                            <th className="px-6 py-6">ID</th>
                            <th className="px-6 py-6">Investor</th>
                            <th className="px-6 py-6">Asset</th>
                            <th className="px-6 py-6">Partner / Location</th>
                            <th className="px-6 py-6">Date</th>
                            <th className="px-6 py-6">Type</th>
                            <th className="px-6 py-6">Asset Class</th>
                            <th className="px-6 py-6">Amount</th>
                            <th className="px-6 py-6">Expected ROI (%)</th>
                            <th className="px-6 py-6">Expected IRR</th>
                            <th className="px-6 py-6">Projected Return</th>
                            <th className="px-6 py-6">Monthly Revenue</th>
                            <th className="px-6 py-6">Total Value</th>
                            <th className="px-6 py-6">Return Type</th>
                            <th className="px-6 py-6">Holding Period</th>
                            <th className="px-6 py-6">Payout Cadence</th>
                            <th className="px-6 py-6">Risk Factor</th>
                            <th className="px-6 py-6">Strategic Partner</th>
                            <th className="px-6 py-6">Status</th>
                            <th className="px-6 py-6 text-right sticky right-0 bg-slate-50 z-10 shadow-[-4px_0_12px_rgba(0,0,0,0.05)]">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {enrichedInvestments.length > 0 ? enrichedInvestments.map((inv, index) => (
                            <tr key={`inv-mgmt-${inv.id}-${index}`} className="hover:bg-slate-50/50 text-[11px] group">
                              <td className="px-6 py-6 font-mono text-slate-400">#{inv.id.slice(0, 8)}</td>
                              <td className="px-6 py-6 whitespace-nowrap">
                                <p className="font-bold text-slate-900">{inv.investorName}</p>
                                <p className="text-[9px] text-slate-400">#{inv.investorId.slice(0, 8)}</p>
                              </td>
                              <td className="px-6 py-6 font-bold text-slate-900 whitespace-nowrap">{inv.opportunityTitle}</td>
                              <td className="px-6 py-6 whitespace-nowrap">
                                <p className="font-medium">{inv.partnerName}</p>
                                <p className="text-[9px] text-slate-400">{inv.location}</p>
                              </td>
                              <td className="px-6 py-6 text-slate-500 whitespace-nowrap">{new Date(inv.date).toLocaleDateString()}</td>
                              <td className="px-6 py-6 whitespace-nowrap"><span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600">{inv.type}</span></td>
                              <td className="px-6 py-6 text-slate-600 whitespace-nowrap">{inv.assetClass}</td>
                              <td className="px-6 py-6 font-black text-slate-900 whitespace-nowrap">${(inv.amount ?? 0).toLocaleString()}</td>
                              <td className="px-6 py-6 font-bold text-emerald-600 whitespace-nowrap">{inv.expectedROI}</td>
                              <td className="px-6 py-6 text-slate-600 whitespace-nowrap">{inv.expectedIRR}</td>
                              <td className="px-6 py-6 font-bold text-blue-600 whitespace-nowrap">${(inv.projectedReturn ?? 0).toLocaleString()}</td>
                              <td className="px-6 py-6 text-slate-600 whitespace-nowrap">${(inv.monthlyRevenue ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                              <td className="px-6 py-6 font-black text-slate-900 whitespace-nowrap">${(inv.totalValue ?? 0).toLocaleString()}</td>
                              <td className="px-6 py-6 text-slate-600 whitespace-nowrap">{inv.returnType}</td>
                              <td className="px-6 py-6 text-slate-600 whitespace-nowrap">{inv.holdingPeriod}</td>
                              <td className="px-6 py-6 text-slate-600 whitespace-nowrap">{inv.payoutCadence}</td>
                              <td className="px-6 py-6 whitespace-nowrap">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                  inv.riskFactor === 'Low' ? 'bg-emerald-100 text-emerald-700' : 
                                  inv.riskFactor === 'Moderate' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                                }`}>
                                  {inv.riskFactor}
                                </span>
                              </td>
                              <td className="px-6 py-6 text-slate-600 whitespace-nowrap">{inv.strategicPartner}</td>
                              <td className="px-6 py-6 whitespace-nowrap">
                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded font-bold uppercase tracking-tighter">{inv.status}</span>
                              </td>
                              <td className="px-6 py-6 text-right whitespace-nowrap relative sticky right-0 bg-white group-hover:bg-slate-50 transition-colors z-10 shadow-[-4px_0_12px_rgba(0,0,0,0.05)]">
                                <button 
                                  onClick={() => setShowInvestmentActionMenu(showInvestmentActionMenu === inv.id ? null : inv.id)}
                                  className="p-2 text-slate-400 hover:text-emerald-600 transition"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                                
                                {showInvestmentActionMenu === inv.id && (
                                  <div className="absolute right-12 top-1/2 -translate-y-1/2 z-[100] bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 min-w-[200px] animate-in fade-in zoom-in duration-200">
                                    <button 
                                      onClick={() => {
                                        setActiveTab('withdrawals');
                                        setWithdrawalSearchQuery(inv.assetName);
                                        setShowInvestmentActionMenu(null);
                                      }}
                                      className="w-full flex items-center gap-3 p-3 text-left text-xs font-bold text-slate-600 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition"
                                    >
                                      <Wallet className="w-4 h-4" />
                                      View Withdrawals
                                    </button>
                                    <button 
                                      onClick={() => {
                                        handleDownloadCertificate(inv.id, 'Investment');
                                        setShowInvestmentActionMenu(null);
                                      }}
                                      className="w-full flex items-center gap-3 p-3 text-left text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition"
                                    >
                                      <FileBadge className="w-4 h-4" />
                                      Download Certificate
                                    </button>
                                    <button 
                                      onClick={() => {
                                        setShowInvestmentActionMenu(null);
                                      }}
                                      className="w-full flex items-center gap-3 p-3 text-left text-xs font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition"
                                    >
                                      <Eye className="w-4 h-4" />
                                      View Details
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan={20} className="px-10 py-20 text-center text-slate-400 italic">No investment records found.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    )}

                    {investmentSubTab === 'Return' && (
                      <table className="w-full text-left">
                        <thead className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50">
                          <tr>
                            <th className="px-6 py-6">ID</th>
                            <th className="px-6 py-6">Investor</th>
                            <th className="px-6 py-6">Asset</th>
                            <th className="px-6 py-6">Partner / Location</th>
                            <th className="px-6 py-6">Date</th>
                            <th className="px-6 py-6">Type</th>
                            <th className="px-6 py-6">Asset Class</th>
                            <th className="px-6 py-6">Amount</th>
                            <th className="px-6 py-6">Expected ROI (%)</th>
                            <th className="px-6 py-6">Expected IRR</th>
                            <th className="px-6 py-6">Projected Return</th>
                            <th className="px-6 py-6">Monthly Revenue</th>
                            <th className="px-6 py-6">Total Value</th>
                            <th className="px-6 py-6">Return Type</th>
                            <th className="px-6 py-6">Holding Period</th>
                            <th className="px-6 py-6">Payout Cadence</th>
                            <th className="px-6 py-6">Risk Factor</th>
                            <th className="px-6 py-6">Strategic Partner</th>
                            <th className="px-6 py-6">Status</th>
                            <th className="px-6 py-6 text-right sticky right-0 bg-slate-50 z-10 shadow-[-4px_0_12px_rgba(0,0,0,0.05)]">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {enrichedReturns.length > 0 ? enrichedReturns.map((ret, index) => (
                            <tr key={`${ret.id}-${index}`} className="hover:bg-slate-50/50 text-[11px] group">
                              <td className="px-6 py-6 font-mono text-slate-400">#{ret.id.slice(0, 8)}</td>
                              <td className="px-6 py-6 whitespace-nowrap">
                                <p className="font-bold text-slate-900">{ret.investorName}</p>
                                <p className="text-[9px] text-slate-400">#{ret.investorId.slice(0, 8)}</p>
                              </td>
                              <td className="px-6 py-6 font-bold text-slate-900 whitespace-nowrap">{ret.investmentTitle}</td>
                              <td className="px-6 py-6 whitespace-nowrap">
                                <p className="font-medium">{ret.partnerName}</p>
                                <p className="text-[9px] text-slate-400">{ret.location}</p>
                              </td>
                              <td className="px-6 py-6 text-slate-500 whitespace-nowrap">{new Date(ret.date).toLocaleDateString()}</td>
                              <td className="px-6 py-6 whitespace-nowrap"><span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600">{ret.type}</span></td>
                              <td className="px-6 py-6 text-slate-600 whitespace-nowrap">{ret.assetClass}</td>
                              <td className="px-6 py-6 font-black text-emerald-600 whitespace-nowrap">${(ret.amount ?? 0).toLocaleString()}</td>
                              <td className="px-6 py-6 font-bold text-emerald-600 whitespace-nowrap">{ret.expectedROI}</td>
                              <td className="px-6 py-6 text-slate-600 whitespace-nowrap">{ret.expectedIRR}</td>
                              <td className="px-6 py-6 font-bold text-blue-600 whitespace-nowrap">${(ret.projectedReturn ?? 0).toLocaleString()}</td>
                              <td className="px-6 py-6 text-slate-600 whitespace-nowrap">${(ret.monthlyRevenue ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                              <td className="px-6 py-6 font-black text-slate-900 whitespace-nowrap">${(ret.totalValue ?? 0).toLocaleString()}</td>
                              <td className="px-6 py-6 text-slate-600 whitespace-nowrap">{ret.returnType}</td>
                              <td className="px-6 py-6 text-slate-600 whitespace-nowrap">{ret.holdingPeriod}</td>
                              <td className="px-6 py-6 text-slate-600 whitespace-nowrap">{ret.payoutCadence}</td>
                              <td className="px-6 py-6 whitespace-nowrap">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                  ret.riskFactor === 'Low' ? 'bg-emerald-100 text-emerald-700' : 
                                  ret.riskFactor === 'Moderate' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                                }`}>
                                  {ret.riskFactor}
                                </span>
                              </td>
                              <td className="px-6 py-6 text-slate-600 whitespace-nowrap">{ret.strategicPartner}</td>
                              <td className="px-6 py-6 whitespace-nowrap">
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded font-bold uppercase tracking-tighter">{ret.status}</span>
                              </td>
                              <td className="px-6 py-6 text-right whitespace-nowrap relative sticky right-0 bg-white group-hover:bg-slate-50 transition-colors z-10 shadow-[-4px_0_12px_rgba(0,0,0,0.05)]">
                                <button 
                                  onClick={() => setShowInvestmentActionMenu(showInvestmentActionMenu === ret.id ? null : ret.id)}
                                  className="p-2 text-slate-400 hover:text-emerald-600 transition"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                                
                                {showInvestmentActionMenu === ret.id && (
                                  <div className="absolute right-12 top-1/2 -translate-y-1/2 z-[100] bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 min-w-[200px] animate-in fade-in zoom-in duration-200">
                                    <button 
                                      onClick={() => {
                                        setActiveTab('withdrawals');
                                        setWithdrawalSearchQuery(ret.investmentTitle);
                                        setShowInvestmentActionMenu(null);
                                      }}
                                      className="w-full flex items-center gap-3 p-3 text-left text-xs font-bold text-slate-600 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition"
                                    >
                                      <Wallet className="w-4 h-4" />
                                      View Withdrawals
                                    </button>
                                    <button 
                                      onClick={() => {
                                        setShowInvestmentActionMenu(null);
                                      }}
                                      className="w-full flex items-center gap-3 p-3 text-left text-xs font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition"
                                    >
                                      <Eye className="w-4 h-4" />
                                      View Details
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan={20} className="px-10 py-20 text-center text-slate-400 italic">No return records found.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    )}

                    {investmentSubTab === 'Withdrawals' && (
                      <table className="w-full text-left">
                        <thead className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50">
                          <tr>
                            <th className="px-6 py-6">ID</th>
                            <th className="px-6 py-6">Investor</th>
                            <th className="px-6 py-6">Asset</th>
                            <th className="px-6 py-6">Partner / Location</th>
                            <th className="px-6 py-6">Withdrawal Date</th>
                            <th className="px-6 py-6">Type</th>
                            <th className="px-6 py-6">Asset Class</th>
                            <th className="px-6 py-6">Return Type</th>
                            <th className="px-6 py-6">Holding Period</th>
                            <th className="px-6 py-6">Payout Cadence</th>
                            <th className="px-6 py-6">Principal Investment</th>
                            <th className="px-6 py-6">Gain Amount</th>
                            <th className="px-6 py-6">Fine Amount</th>
                            <th className="px-6 py-6 text-right">Expected ROI (%)</th>
                            <th className="px-6 py-6 text-right">Total Payout</th>
                            <th className="px-6 py-6">Status</th>
                            <th className="px-6 py-6 text-right sticky right-0 bg-slate-50 z-10 shadow-[-4px_0_12px_rgba(0,0,0,0.05)]">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {filteredWithdrawalsForMgmt.length > 0 ? filteredWithdrawalsForMgmt.map((w, index) => (
                            <tr key={`with-mgmt-${w.id}-${index}`} className="hover:bg-slate-50/50 text-[11px] group">
                              <td className="px-6 py-6 font-mono text-slate-400">#{w.id.slice(0, 8)}</td>
                              <td className="px-6 py-6 whitespace-nowrap">
                                <p className="font-bold text-slate-900">{w.investorName}</p>
                                <p className="text-[9px] text-slate-400">#{w.investorId.slice(0, 8)}</p>
                              </td>
                              <td className="px-6 py-6 font-bold text-slate-900 whitespace-nowrap">{w.opportunityTitle}</td>
                              <td className="px-6 py-6 whitespace-nowrap">
                                <p className="font-medium">{w.partnerName}</p>
                                <p className="text-[9px] text-slate-400">{w.location}</p>
                              </td>
                              <td className="px-6 py-6 text-slate-500 whitespace-nowrap">{new Date(w.date).toLocaleDateString()}</td>
                              <td className="px-6 py-6 whitespace-nowrap">
                                <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600">{w.type}</span>
                                {w.isReturnsWithdrawal && (
                                  <span className="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[9px] font-bold">Returns</span>
                                )}
                              </td>
                              <td className="px-6 py-6 text-slate-600 whitespace-nowrap">{w.assetClass}</td>
                              <td className="px-6 py-6 text-slate-600 whitespace-nowrap">{w.returnType}</td>
                              <td className="px-6 py-6 text-slate-600 whitespace-nowrap">{w.holdingPeriod}</td>
                              <td className="px-6 py-6 text-slate-600 whitespace-nowrap">{w.payoutFrequency}</td>
                              <td className="px-6 py-6 font-black text-slate-900 whitespace-nowrap">${(w.investmentAmount ?? 0).toLocaleString()}</td>
                              <td className="px-6 py-6 font-bold text-emerald-600 whitespace-nowrap">${(w.gainAmount ?? 0).toLocaleString()}</td>
                              <td className="px-6 py-6 font-bold text-rose-600 whitespace-nowrap">-${(w.fineAmount ?? 0).toLocaleString()}</td>
                              <td className="px-6 py-6 font-bold text-emerald-600 text-right whitespace-nowrap">{w.expectedROI}</td>
                              <td className="px-6 py-6 font-black text-emerald-600 text-right whitespace-nowrap">${(w.withdrawalAmount ?? 0).toLocaleString()}</td>
                              <td className="px-6 py-6 whitespace-nowrap">
                                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                  w.status === 'Complete' ? 'bg-emerald-100 text-emerald-700' : 
                                  w.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                                }`}>
                                  {w.status}
                                </span>
                              </td>
                              <td className="px-6 py-6 text-right whitespace-nowrap relative sticky right-0 bg-white group-hover:bg-slate-50 transition-colors z-10 shadow-[-4px_0_12px_rgba(0,0,0,0.05)]">
                                <button 
                                  onClick={() => setShowWithdrawalActionMenu(showWithdrawalActionMenu === w.id ? null : w.id)}
                                  className="p-2 text-slate-400 hover:text-emerald-600 transition"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                                
                                {showWithdrawalActionMenu === w.id && (
                                  <div className="absolute right-12 top-1/2 -translate-y-1/2 z-[100] bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 min-w-[200px] animate-in fade-in zoom-in duration-200">
                                    <button 
                                      onClick={() => {
                                        handleDownloadCertificate(w.id, 'Withdrawal');
                                        setShowWithdrawalActionMenu(null);
                                      }}
                                      className="w-full flex items-center gap-3 p-3 text-left text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition"
                                    >
                                      <FileBadge className="w-4 h-4" />
                                      Download Certificate
                                    </button>
                                    <button 
                                      onClick={() => {
                                        setShowWithdrawalActionMenu(null);
                                      }}
                                      className="w-full flex items-center gap-3 p-3 text-left text-xs font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition"
                                    >
                                      <Eye className="w-4 h-4" />
                                      View Details
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan={17} className="px-10 py-20 text-center text-slate-400 italic">No withdrawal records found.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    )}

                    {investmentSubTab === 'Rent' && (
                      <table className="w-full text-left">
                        <thead className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50">
                          <tr>
                            <th className="px-6 py-6">ID</th>
                            <th className="px-6 py-6">Investor</th>
                            <th className="px-6 py-6">Asset</th>
                            <th className="px-6 py-6">Partner / Location</th>
                            <th className="px-6 py-6">Date Invested</th>
                            <th className="px-6 py-6">Holding Period</th>
                            <th className="px-6 py-6">Rent</th>
                            <th className="px-6 py-6">Payout Cadence</th>
                            <th className="px-6 py-6">Return Type</th>
                            <th className="px-6 py-6">Status</th>
                            <th className="px-6 py-6 text-right sticky right-0 bg-slate-50 z-10 shadow-[-4px_0_12px_rgba(0,0,0,0.05)]">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {enrichedInvestments.filter(inv => inv.returnType === ReturnType.MONTHLY_RENT || inv.returnType === ReturnType.YEARLY_RENT || (inv.rentAmount && inv.rentAmount > 0)).length > 0 ? 
                            enrichedInvestments.filter(inv => inv.returnType === ReturnType.MONTHLY_RENT || inv.returnType === ReturnType.YEARLY_RENT || (inv.rentAmount && inv.rentAmount > 0)).map((inv, index) => {
                            const isWithdrawn = withdrawals.some(w => w.investmentId === inv.id && w.status === 'Complete');
                            return (
                              <tr key={`${inv.id}-${index}`} className="hover:bg-slate-50/50 text-[11px] group">
                                <td className="px-6 py-6 font-mono text-slate-400">#{inv.id.slice(0, 8)}</td>
                                <td className="px-6 py-6 whitespace-nowrap">
                                  <p className="font-bold text-slate-900">{inv.investorName}</p>
                                  <p className="text-[9px] text-slate-400">#{inv.investorId.slice(0, 8)}</p>
                                </td>
                                <td className="px-6 py-6 font-bold text-slate-900 whitespace-nowrap">{inv.opportunityTitle}</td>
                                <td className="px-6 py-6 whitespace-nowrap">
                                  <p className="font-medium">{inv.partnerName}</p>
                                  <p className="text-[9px] text-slate-400">{inv.location}</p>
                                </td>
                                <td className="px-6 py-6 text-slate-500 whitespace-nowrap">{new Date(inv.date).toLocaleDateString()}</td>
                                <td className="px-6 py-6 text-slate-600 whitespace-nowrap">{inv.holdingPeriod}</td>
                                <td className="px-6 py-6 font-black text-emerald-600 whitespace-nowrap">${inv.rentAmount?.toLocaleString() || '0'}</td>
                                <td className="px-6 py-6 text-slate-600 whitespace-nowrap">{inv.payoutCadence}</td>
                                <td className="px-6 py-6 text-slate-600 whitespace-nowrap">{inv.returnType}</td>
                                <td className="px-6 py-6 whitespace-nowrap">
                                  <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-tighter ${isWithdrawn ? 'bg-slate-100 text-slate-400' : 'bg-emerald-50 text-emerald-600'}`}>
                                    {isWithdrawn ? 'Inactive' : 'Active'}
                                  </span>
                                </td>
                                <td className="px-6 py-6 text-right whitespace-nowrap relative sticky right-0 bg-white group-hover:bg-slate-50 transition-colors z-10 shadow-[-4px_0_12px_rgba(0,0,0,0.05)]">
                                  <button 
                                    onClick={() => setShowInvestmentActionMenu(showInvestmentActionMenu === inv.id ? null : inv.id)}
                                    className="p-2 text-slate-400 hover:text-emerald-600 transition"
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </button>
                                  
                                  {showInvestmentActionMenu === inv.id && (
                                    <div className="absolute right-12 top-1/2 -translate-y-1/2 z-[100] bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 min-w-[200px] animate-in fade-in zoom-in duration-200">
                                      <button 
                                        onClick={() => {
                                          setActiveTab('withdrawals');
                                          setWithdrawalSearchQuery(inv.opportunityTitle);
                                          setShowInvestmentActionMenu(null);
                                        }}
                                        className="w-full flex items-center gap-3 p-3 text-left text-xs font-bold text-slate-600 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition"
                                      >
                                        <Wallet className="w-4 h-4" />
                                        View Withdrawals
                                      </button>
                                      <button 
                                        onClick={() => {
                                          setShowInvestmentActionMenu(null);
                                        }}
                                        className="w-full flex items-center gap-3 p-3 text-left text-xs font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition"
                                      >
                                        <Eye className="w-4 h-4" />
                                        View Details
                                      </button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          }) : (
                            <tr>
                              <td colSpan={10} className="px-10 py-20 text-center text-slate-400 italic">No rent records found.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    )}

                    {investmentSubTab === 'ROI' && (
                      <table className="w-full text-left">
                        <thead className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50">
                          <tr>
                            <th className="px-6 py-6">ID</th>
                            <th className="px-6 py-6">Investor</th>
                            <th className="px-6 py-6">Asset</th>
                            <th className="px-6 py-6">Partner / Location</th>
                            <th className="px-6 py-6">Date Invested</th>
                            <th className="px-6 py-6">Holding Period</th>
                            <th className="px-6 py-6">ROI Amount</th>
                            <th className="px-6 py-6">Payout Cadence</th>
                            <th className="px-6 py-6">Return Type</th>
                            <th className="px-6 py-6">Status</th>
                            <th className="px-6 py-6 text-right sticky right-0 bg-slate-50 z-10 shadow-[-4px_0_12px_rgba(0,0,0,0.05)]">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {enrichedInvestments.filter(inv => inv.returnType === ReturnType.ROI).length > 0 ? 
                            enrichedInvestments.filter(inv => inv.returnType === ReturnType.ROI).map((inv, index) => {
                            const isWithdrawn = withdrawals.some(w => w.investmentId === inv.id && w.status === 'Complete');
                            const opp = opportunities.find(o => o.id === inv.opportunityId);
                            const roiAmount = opp?.roiAmount || (opp?.roiPercentage ? (inv.amount * opp.roiPercentage / 100) : 0);
                            return (
                              <tr key={`${inv.id}-${index}`} className="hover:bg-slate-50/50 text-[11px] group">
                                <td className="px-6 py-6 font-mono text-slate-400">#{inv.id.slice(0, 8)}</td>
                                <td className="px-6 py-6 whitespace-nowrap">
                                  <p className="font-bold text-slate-900">{inv.investorName}</p>
                                  <p className="text-[9px] text-slate-400">#{inv.investorId.slice(0, 8)}</p>
                                </td>
                                <td className="px-6 py-6 font-bold text-slate-900 whitespace-nowrap">{inv.opportunityTitle}</td>
                                <td className="px-6 py-6 whitespace-nowrap">
                                  <p className="font-medium">{inv.partnerName}</p>
                                  <p className="text-[9px] text-slate-400">{inv.location}</p>
                                </td>
                                <td className="px-6 py-6 text-slate-500 whitespace-nowrap">{new Date(inv.date).toLocaleDateString()}</td>
                                <td className="px-6 py-6 text-slate-600 whitespace-nowrap">{inv.holdingPeriod}</td>
                                <td className="px-6 py-6 font-black text-emerald-600 whitespace-nowrap">${(roiAmount ?? 0).toLocaleString()}</td>
                                <td className="px-6 py-6 text-slate-600 whitespace-nowrap">{inv.payoutCadence}</td>
                                <td className="px-6 py-6 text-slate-600 whitespace-nowrap">{inv.returnType}</td>
                                <td className="px-6 py-6 whitespace-nowrap">
                                  <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-tighter ${isWithdrawn ? 'bg-slate-100 text-slate-400' : 'bg-emerald-50 text-emerald-600'}`}>
                                    {isWithdrawn ? 'Inactive' : 'Active'}
                                  </span>
                                </td>
                                <td className="px-6 py-6 text-right whitespace-nowrap relative sticky right-0 bg-white group-hover:bg-slate-50 transition-colors z-10 shadow-[-4px_0_12px_rgba(0,0,0,0.05)]">
                                  <button 
                                    onClick={() => setShowInvestmentActionMenu(showInvestmentActionMenu === inv.id ? null : inv.id)}
                                    className="p-2 text-slate-400 hover:text-emerald-600 transition"
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </button>
                                  
                                  {showInvestmentActionMenu === inv.id && (
                                    <div className="absolute right-12 top-1/2 -translate-y-1/2 z-[100] bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 min-w-[200px] animate-in fade-in zoom-in duration-200">
                                      <button 
                                        onClick={() => {
                                          setActiveTab('withdrawals');
                                          setWithdrawalSearchQuery(inv.opportunityTitle);
                                          setShowInvestmentActionMenu(null);
                                        }}
                                        className="w-full flex items-center gap-3 p-3 text-left text-xs font-bold text-slate-600 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition"
                                      >
                                        <Wallet className="w-4 h-4" />
                                        View Withdrawals
                                      </button>
                                      <button 
                                        onClick={() => {
                                          setShowInvestmentActionMenu(null);
                                        }}
                                        className="w-full flex items-center gap-3 p-3 text-left text-xs font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition"
                                      >
                                        <Eye className="w-4 h-4" />
                                        View Details
                                      </button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          }) : (
                            <tr>
                              <td colSpan={10} className="px-10 py-20 text-center text-slate-400 italic">No ROI records found.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    )}

                    {investmentSubTab === 'Dividend' && (
                      <table className="w-full text-left">
                        <thead className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50">
                          <tr>
                            <th className="px-6 py-6">ID</th>
                            <th className="px-6 py-6">Investor</th>
                            <th className="px-6 py-6">Asset</th>
                            <th className="px-6 py-6">Partner / Location</th>
                            <th className="px-6 py-6">Date Invested</th>
                            <th className="px-6 py-6">Holding Period</th>
                            <th className="px-6 py-6">Dividend Amount</th>
                            <th className="px-6 py-6">Payout Cadence</th>
                            <th className="px-6 py-6">Return Type</th>
                            <th className="px-6 py-6">Status</th>
                            <th className="px-6 py-6 text-right sticky right-0 bg-slate-50 z-10 shadow-[-4px_0_12px_rgba(0,0,0,0.05)]">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {enrichedInvestments.filter(inv => inv.returnType === ReturnType.DIVIDEND).length > 0 ? 
                            enrichedInvestments.filter(inv => inv.returnType === ReturnType.DIVIDEND).map((inv, index) => {
                            const isWithdrawn = withdrawals.some(w => w.investmentId === inv.id && w.status === 'Complete');
                            const opp = opportunities.find(o => o.id === inv.opportunityId);
                            const dividendAmount = opp?.dividendAmount || (opp?.dividendPercentage ? (inv.amount * opp.dividendPercentage / 100) : 0);
                            return (
                              <tr key={`${inv.id}-${index}`} className="hover:bg-slate-50/50 text-[11px] group">
                                <td className="px-6 py-6 font-mono text-slate-400">#{inv.id.slice(0, 8)}</td>
                                <td className="px-6 py-6 whitespace-nowrap">
                                  <p className="font-bold text-slate-900">{inv.investorName}</p>
                                  <p className="text-[9px] text-slate-400">#{inv.investorId.slice(0, 8)}</p>
                                </td>
                                <td className="px-6 py-6 font-bold text-slate-900 whitespace-nowrap">{inv.opportunityTitle}</td>
                                <td className="px-6 py-6 whitespace-nowrap">
                                  <p className="font-medium">{inv.partnerName}</p>
                                  <p className="text-[9px] text-slate-400">{inv.location}</p>
                                </td>
                                <td className="px-6 py-6 text-slate-500 whitespace-nowrap">{new Date(inv.date).toLocaleDateString()}</td>
                                <td className="px-6 py-6 text-slate-600 whitespace-nowrap">{inv.holdingPeriod}</td>
                                <td className="px-6 py-6 font-black text-emerald-600 whitespace-nowrap">${(dividendAmount ?? 0).toLocaleString()}</td>
                                <td className="px-6 py-6 text-slate-600 whitespace-nowrap">{inv.payoutCadence}</td>
                                <td className="px-6 py-6 text-slate-600 whitespace-nowrap">{inv.returnType}</td>
                                <td className="px-6 py-6 whitespace-nowrap">
                                  <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-tighter ${isWithdrawn ? 'bg-slate-100 text-slate-400' : 'bg-emerald-50 text-emerald-600'}`}>
                                    {isWithdrawn ? 'Inactive' : 'Active'}
                                  </span>
                                </td>
                                <td className="px-6 py-6 text-right whitespace-nowrap relative sticky right-0 bg-white group-hover:bg-slate-50 transition-colors z-10 shadow-[-4px_0_12px_rgba(0,0,0,0.05)]">
                                  <button 
                                    onClick={() => setShowInvestmentActionMenu(showInvestmentActionMenu === inv.id ? null : inv.id)}
                                    className="p-2 text-slate-400 hover:text-emerald-600 transition"
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </button>
                                  
                                  {showInvestmentActionMenu === inv.id && (
                                    <div className="absolute right-12 top-1/2 -translate-y-1/2 z-[100] bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 min-w-[200px] animate-in fade-in zoom-in duration-200">
                                      <button 
                                        onClick={() => {
                                          setActiveTab('withdrawals');
                                          setWithdrawalSearchQuery(inv.opportunityTitle);
                                          setShowInvestmentActionMenu(null);
                                        }}
                                        className="w-full flex items-center gap-3 p-3 text-left text-xs font-bold text-slate-600 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition"
                                      >
                                        <Wallet className="w-4 h-4" />
                                        View Withdrawals
                                      </button>
                                      <button 
                                        onClick={() => {
                                          setShowInvestmentActionMenu(null);
                                        }}
                                        className="w-full flex items-center gap-3 p-3 text-left text-xs font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition"
                                      >
                                        <Eye className="w-4 h-4" />
                                        View Details
                                      </button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          }) : (
                            <tr>
                              <td colSpan={10} className="px-10 py-20 text-center text-slate-400 italic">No dividend records found.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* FAQ MANAGEMENT TAB */}
            {activeTab === 'faq-management' && (
              <div className="space-y-8 animate-in slide-in-from-right duration-500">
                {/* Categories Section */}
                <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-xl font-bold serif">FAQ Categories</h3>
                      <p className="text-xs text-slate-400">Manage categories for grouping your FAQs</p>
                    </div>
                    <button 
                      onClick={() => {
                        setEditingFAQCategory(null);
                        setFaqCategoryFormData({ name: '', icon: 'HelpCircle' });
                        setShowFAQCategoryModal(true);
                      }}
                      className="px-6 py-3 bg-emerald-600 text-white rounded-2xl text-xs font-bold flex items-center gap-2 hover:bg-emerald-700 transition shadow-lg shadow-emerald-200"
                    >
                      <Plus className="w-4 h-4" /> Add Category
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {faqCategories.map(category => (
                      <div key={category.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-emerald-600">
                            {category.icon === 'Info' && <Info className="w-5 h-5" />}
                            {category.icon === 'TrendingUp' && <TrendingUp className="w-5 h-5" />}
                            {category.icon === 'ShieldCheck' && <ShieldCheck className="w-5 h-5" />}
                            {category.icon === 'CreditCard' && <CreditCard className="w-5 h-5" />}
                            {category.icon === 'Wallet' && <Wallet className="w-5 h-5" />}
                            {(!category.icon || category.icon === 'HelpCircle') && <HelpCircle className="w-5 h-5" />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{category.name}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                              {faqs.filter(f => f.categoryId === category.id).length} FAQs
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              setEditingFAQCategory(category);
                              setFaqCategoryFormData(category);
                              setShowFAQCategoryModal(true);
                            }}
                            className="p-2 text-slate-400 hover:text-blue-600 transition"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              if (window.confirm('Are you sure? This will not delete the FAQs in this category, but they will become uncategorized.')) {
                                onDeleteFAQCategory(category.id);
                              }
                            }}
                            className="p-2 text-slate-400 hover:text-rose-600 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FAQs Section */}
                <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-xl font-bold serif">Frequently Asked Questions</h3>
                      <p className="text-xs text-slate-400">Manage individual questions and answers</p>
                    </div>
                    <button 
                      onClick={() => {
                        setEditingFAQ(null);
                        setFaqFormData({ question: '', answer: '', categoryId: faqCategories[0]?.id || '' });
                        setShowFAQModal(true);
                      }}
                      className="px-6 py-3 bg-emerald-600 text-white rounded-2xl text-xs font-bold flex items-center gap-2 hover:bg-emerald-700 transition shadow-lg shadow-emerald-200"
                    >
                      <Plus className="w-4 h-4" /> Add FAQ
                    </button>
                  </div>

                  <div className="space-y-4">
                    {faqs.map(faq => {
                      const category = faqCategories.find(c => c.id === faq.categoryId);
                      return (
                        <div key={faq.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <span className="px-3 py-1 bg-white rounded-full text-[10px] font-black text-emerald-600 uppercase tracking-widest border border-slate-100">
                                {category?.name || 'Uncategorized'}
                              </span>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => {
                                  setEditingFAQ(faq);
                                  setFaqFormData(faq);
                                  setShowFAQModal(true);
                                }}
                                className="p-2 text-slate-400 hover:text-blue-600 transition"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to delete this FAQ?')) {
                                    onDeleteFAQ(faq.id);
                                  }
                                }}
                                className="p-2 text-slate-400 hover:text-rose-600 transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <h4 className="font-bold text-slate-900 mb-2">{faq.question}</h4>
                          <p className="text-sm text-slate-500 line-clamp-2">{faq.answer}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'blog-manager' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-3 space-y-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 serif">Blog Manager</h2>
                    <p className="text-slate-500 font-medium">Create, edit and manage platform insights</p>
                  </div>
                  <button 
                    onClick={() => {
                      setEditingBlog(null);
                      setBlogFormData({
                        title: '',
                        excerpt: '',
                        content: '',
                        blocks: [],
                        author: '',
                        authorRole: '',
                        authorAvatar: '',
                        category: 'Market Trends',
                        imageUrl: '',
                        readTime: '',
                        tags: []
                      });
                      setShowBlogModal(true);
                    }}
                    className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" /> Create Post
                  </button>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                  <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-grow">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input 
                        type="text" 
                        placeholder="Search blogs..."
                        value={blogSearchQuery}
                        onChange={(e) => setBlogSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                      />
                    </div>
                    <select 
                      value={blogCategoryFilter}
                      onChange={(e) => setBlogCategoryFilter(e.target.value)}
                      className="px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-bold text-slate-600"
                    >
                      <option value="All">All Categories</option>
                      <option value="Market Trends">Market Trends</option>
                      <option value="Education">Education</option>
                      <option value="Assets Analysis">Assets Analysis</option>
                      <option value="Wealth Management">Wealth Management</option>
                    </select>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b border-slate-50">
                          <th className="pb-4 font-black uppercase tracking-widest text-[10px] text-slate-400 pl-4">Article</th>
                          <th className="pb-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Category</th>
                          <th className="pb-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Author</th>
                          <th className="pb-4 font-black uppercase tracking-widest text-[10px] text-slate-400 text-right pr-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {blogs.filter(b => {
                          const matchesSearch = b.title.toLowerCase().includes(blogSearchQuery.toLowerCase()) || b.author.toLowerCase().includes(blogSearchQuery.toLowerCase());
                          const matchesCategory = blogCategoryFilter === 'All' || b.category === blogCategoryFilter;
                          return matchesSearch && matchesCategory;
                        }).map((blog) => (
                          <tr key={blog.id} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="py-4 pl-4">
                              <div className="flex items-center gap-4">
                                <img src={blog.imageUrl} alt="" className="w-12 h-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
                                <div>
                                  <p className="font-bold text-slate-900 line-clamp-1">{blog.title}</p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{blog.date} • {blog.readTime}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4">
                              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                {blog.category}
                              </span>
                            </td>
                            <td className="py-4">
                              <div className="flex items-center gap-2">
                                <img src={blog.authorAvatar} alt="" className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
                                <span className="text-sm font-medium text-slate-600">{blog.author}</span>
                              </div>
                            </td>
                            <td className="py-4 pr-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={() => {
                                    setEditingBlog(blog);
                                    setBlogFormData(blog);
                                    setShowBlogModal(true);
                                  }}
                                  className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => {
                                    if (window.confirm('Are you sure you want to delete this blog post?')) {
                                      onDeleteBlog(blog.id);
                                    }
                                  }}
                                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <div className="grid md:grid-cols-2 gap-8 animate-in slide-in-from-bottom duration-500">
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                     <DollarSign className="w-6 h-6 text-emerald-600" />
                     <h3 className="text-xl font-bold serif">Revenue Engine</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <div className="flex justify-between items-center">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Commission (%)</label>
                          <span className="font-black text-emerald-600">{config.globalCommission}%</span>
                       </div>
                       <input type="range" min="0" max="10" step="0.1" value={config.globalCommission ?? 2.5} onChange={e => onSaveConfig({...config, globalCommission: parseFloat(e.target.value)})} className="w-full accent-emerald-600" />
                    </div>
                    
                    <div className="flex justify-between items-center p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                      <div>
                        <p className="text-sm font-bold text-slate-900">Secondary Trading</p>
                        <p className="text-[10px] text-slate-400">P2P share marketplace status</p>
                      </div>
                      <div className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-colors duration-300 ${config.secondaryMarket ? 'bg-emerald-500' : 'bg-slate-300'}`} onClick={() => onSaveConfig({...config, secondaryMarket: !config.secondaryMarket})}>
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-300 ${config.secondaryMarket ? 'translate-x-7' : 'translate-x-0'}`} />
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                      <div>
                        <p className="text-sm font-bold text-slate-900">Maintenance Mode</p>
                        <p className="text-[10px] text-slate-400">Lock platform for internal updates</p>
                      </div>
                      <div className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-colors duration-300 ${config.maintenanceMode ? 'bg-rose-500' : 'bg-slate-300'}`} onClick={() => onSaveConfig({...config, maintenanceMode: !config.maintenanceMode})}>
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-300 ${config.maintenanceMode ? 'translate-x-7' : 'translate-x-0'}`} />
                      </div>
                    </div>

                    <div className="space-y-4 p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                      <div>
                        <p className="text-sm font-bold text-slate-900">Platform Logo</p>
                        <p className="text-[10px] text-slate-400">Upload your institutional logo</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center">
                          {config.logo ? (
                            <img src={config.logo} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-slate-300" />
                          )}
                        </div>
                        <label className="flex-1">
                          <div className="w-full py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer flex items-center justify-center gap-2">
                            <Upload className="w-4 h-4" />
                            {config.logo ? 'Change Logo' : 'Upload Logo'}
                          </div>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  onSaveConfig({ ...config, logo: reader.result as string });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="space-y-4 p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                      <div>
                        <p className="text-sm font-bold text-slate-900">Grow Milkat Logo</p>
                        <p className="text-[10px] text-slate-400">For Certificate branding</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center">
                          {config.growMilkatLogo ? (
                            <img src={config.growMilkatLogo} alt="Grow Milkat Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-slate-300" />
                          )}
                        </div>
                        <label className="flex-1">
                          <div className="w-full py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer flex items-center justify-center gap-2">
                            <Upload className="w-4 h-4" />
                            {config.growMilkatLogo ? 'Change Logo' : 'Upload Logo'}
                          </div>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  onSaveConfig({ ...config, growMilkatLogo: reader.result as string });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="space-y-4 p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                      <div>
                        <p className="text-sm font-bold text-slate-900">Owner Signature</p>
                        <p className="text-[10px] text-slate-400">Authorized signature for certificates</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center">
                          {config.ownerSignature ? (
                            <img src={config.ownerSignature} alt="Owner Signature" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                          ) : (
                            <Edit3 className="w-6 h-6 text-slate-300" />
                          )}
                        </div>
                        <label className="flex-1">
                          <div className="w-full py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer flex items-center justify-center gap-2">
                            <Upload className="w-4 h-4" />
                            {config.ownerSignature ? 'Change Signature' : 'Upload Signature'}
                          </div>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  onSaveConfig({ ...config, ownerSignature: reader.result as string });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                     <Lock className="w-6 h-6 text-emerald-600" />
                     <h3 className="text-xl font-bold serif">Security Governance</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Severity</label>
                       <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm" value={config.securityLevel || 'Enterprise'} onChange={e => onSaveConfig({...config, securityLevel: e.target.value})}>
                          <option value="Standard">Standard Compliance</option>
                          <option value="Enterprise">Enterprise Grade (Active)</option>
                          <option value="Sovereign">Sovereign Data Guard</option>
                       </select>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">KYC Requirement Tier</label>
                       <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm" value={config.kycRequirement || 'Tier 2'} onChange={e => onSaveConfig({...config, kycRequirement: e.target.value})}>
                          <option value="Tier 1">Tier 1 (Email Only)</option>
                          <option value="Tier 2">Tier 2 (ID Document)</option>
                          <option value="Tier 3">Tier 3 (Proof of Funds)</option>
                       </select>
                    </div>

                    <div className="p-6 bg-emerald-50 rounded-[1.5rem] border border-emerald-100 flex items-start gap-4">
                       <AlertCircle className="w-6 h-6 text-emerald-600 mt-1" />
                       <div className="space-y-1">
                          <p className="text-sm font-bold text-emerald-900">Governance Active</p>
                          <p className="text-[10px] text-emerald-700 leading-relaxed font-medium uppercase tracking-wider">All configuration changes require dual-signature authorization from secondary controllers.</p>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8 md:col-span-2">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                     <Shield className="w-6 h-6 text-emerald-600" />
                     <h3 className="text-xl font-bold serif">Legal & Compliance Settings</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-10">
                    {/* Privacy Policy Editor */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Privacy Policy Sections</h4>
                        <button 
                          onClick={() => {
                            const newSection: LegalSection = {
                              id: Math.random().toString(36).substr(2, 9),
                              title: 'New Section',
                              content: '',
                              type: 'paragraph'
                            };
                            onSaveConfig({ ...config, privacyPolicy: [...(config.privacyPolicy || []), newSection] });
                          }}
                          className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {(config.privacyPolicy || []).map((section, idx) => (
                          <div key={section.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                            <div className="flex items-center justify-between">
                              <input 
                                className="bg-transparent font-bold text-slate-900 outline-none border-b border-transparent focus:border-emerald-500 w-full mr-4"
                                value={section.title}
                                onChange={e => {
                                  const newPolicy = [...config.privacyPolicy];
                                  newPolicy[idx] = { ...section, title: e.target.value };
                                  onSaveConfig({ ...config, privacyPolicy: newPolicy });
                                }}
                              />
                              <button 
                                onClick={() => {
                                  const newPolicy = config.privacyPolicy.filter(s => s.id !== section.id);
                                  onSaveConfig({ ...config, privacyPolicy: newPolicy });
                                }}
                                className="text-rose-500 hover:text-rose-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <textarea 
                              className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 min-h-[100px]"
                              placeholder="Section content..."
                              value={section.content}
                              onChange={e => {
                                const newPolicy = [...config.privacyPolicy];
                                newPolicy[idx] = { ...section, content: e.target.value };
                                onSaveConfig({ ...config, privacyPolicy: newPolicy });
                              }}
                            />
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">List Items (Optional)</label>
                                <select 
                                  className="text-[10px] font-black text-emerald-600 uppercase bg-transparent outline-none"
                                  value={section.type}
                                  onChange={e => {
                                    const newPolicy = [...config.privacyPolicy];
                                    newPolicy[idx] = { ...section, type: e.target.value as any };
                                    onSaveConfig({ ...config, privacyPolicy: newPolicy });
                                  }}
                                >
                                  <option value="paragraph">Paragraph</option>
                                  <option value="bullets">Bullets</option>
                                  <option value="numbers">Numbers</option>
                                </select>
                              </div>
                              {(section.items || []).map((item, iIdx) => (
                                <div key={iIdx} className="flex items-center gap-2">
                                  <input 
                                    className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500"
                                    value={item}
                                    onChange={e => {
                                      const newItems = [...(section.items || [])];
                                      newItems[iIdx] = e.target.value;
                                      const newPolicy = [...config.privacyPolicy];
                                      newPolicy[idx] = { ...section, items: newItems };
                                      onSaveConfig({ ...config, privacyPolicy: newPolicy });
                                    }}
                                  />
                                  <button 
                                    onClick={() => {
                                      const newItems = (section.items || []).filter((_, i) => i !== iIdx);
                                      const newPolicy = [...config.privacyPolicy];
                                      newPolicy[idx] = { ...section, items: newItems };
                                      onSaveConfig({ ...config, privacyPolicy: newPolicy });
                                    }}
                                    className="text-slate-400 hover:text-rose-500"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                              <button 
                                onClick={() => {
                                  const newItems = [...(section.items || []), ''];
                                  const newPolicy = [...config.privacyPolicy];
                                  newPolicy[idx] = { ...section, items: newItems };
                                  onSaveConfig({ ...config, privacyPolicy: newPolicy });
                                }}
                                className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline"
                              >
                                + Add Item
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Terms & Conditions Editor */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Terms & Conditions Sections</h4>
                        <button 
                          onClick={() => {
                            const newSection: LegalSection = {
                              id: Math.random().toString(36).substr(2, 9),
                              title: 'New Section',
                              content: '',
                              type: 'paragraph'
                            };
                            onSaveConfig({ ...config, termsConditions: [...(config.termsConditions || []), newSection] });
                          }}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {(config.termsConditions || []).map((section, idx) => (
                          <div key={section.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                            <div className="flex items-center justify-between">
                              <input 
                                className="bg-transparent font-bold text-slate-900 outline-none border-b border-transparent focus:border-blue-500 w-full mr-4"
                                value={section.title}
                                onChange={e => {
                                  const newTerms = [...config.termsConditions];
                                  newTerms[idx] = { ...section, title: e.target.value };
                                  onSaveConfig({ ...config, termsConditions: newTerms });
                                }}
                              />
                              <button 
                                onClick={() => {
                                  const newTerms = config.termsConditions.filter(s => s.id !== section.id);
                                  onSaveConfig({ ...config, termsConditions: newTerms });
                                }}
                                className="text-rose-500 hover:text-rose-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <textarea 
                              className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 min-h-[100px]"
                              placeholder="Section content..."
                              value={section.content}
                              onChange={e => {
                                const newTerms = [...config.termsConditions];
                                newTerms[idx] = { ...section, content: e.target.value };
                                onSaveConfig({ ...config, termsConditions: newTerms });
                              }}
                            />
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">List Items (Optional)</label>
                                <select 
                                  className="text-[10px] font-black text-blue-600 uppercase bg-transparent outline-none"
                                  value={section.type}
                                  onChange={e => {
                                    const newTerms = [...config.termsConditions];
                                    newTerms[idx] = { ...section, type: e.target.value as any };
                                    onSaveConfig({ ...config, termsConditions: newTerms });
                                  }}
                                >
                                  <option value="paragraph">Paragraph</option>
                                  <option value="bullets">Bullets</option>
                                  <option value="numbers">Numbers</option>
                                </select>
                              </div>
                              {(section.items || []).map((item, iIdx) => (
                                <div key={iIdx} className="flex items-center gap-2">
                                  <input 
                                    className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
                                    value={item}
                                    onChange={e => {
                                      const newItems = [...(section.items || [])];
                                      newItems[iIdx] = e.target.value;
                                      const newTerms = [...config.termsConditions];
                                      newTerms[idx] = { ...section, items: newItems };
                                      onSaveConfig({ ...config, termsConditions: newTerms });
                                    }}
                                  />
                                  <button 
                                    onClick={() => {
                                      const newItems = (section.items || []).filter((_, i) => i !== iIdx);
                                      const newTerms = [...config.termsConditions];
                                      newTerms[idx] = { ...section, items: newItems };
                                      onSaveConfig({ ...config, termsConditions: newTerms });
                                    }}
                                    className="text-slate-400 hover:text-rose-500"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                              <button 
                                onClick={() => {
                                  const newItems = [...(section.items || []), ''];
                                  const newTerms = [...config.termsConditions];
                                  newTerms[idx] = { ...section, items: newItems };
                                  onSaveConfig({ ...config, termsConditions: newTerms });
                                }}
                                className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                              >
                                + Add Item
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'withdrawals' && (
              <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 serif">Withdrawal Requests</h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Investor Fund Management</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {withdrawals.filter(w => w.status === 'Pending').length} Pending
                    </span>
                  </div>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by Title, Investor, ID..."
                      value={withdrawalSearchQuery}
                      onChange={(e) => setWithdrawalSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select
                        value={withdrawalStatusFilter}
                        onChange={(e) => setWithdrawalStatusFilter(e.target.value)}
                        className="pl-11 pr-8 py-3 bg-white border border-slate-200 rounded-2xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all min-w-[160px]"
                      >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Complete">Complete</option>
                        <option value="Reject">Reject</option>
                      </select>
                    </div>
                    {(withdrawalSearchQuery || withdrawalStatusFilter !== 'All') && (
                      <button
                        onClick={() => {
                          setWithdrawalSearchQuery('');
                          setWithdrawalStatusFilter('All');
                        }}
                        className="px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-2xl transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50 border-bottom border-slate-100">
                          <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Investor</th>
                          <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Details</th>
                          <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Request Date</th>
                          <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                          <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                          <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {paginatedWithdrawals.length > 0 ? (
                          paginatedWithdrawals.map((w, idx) => {
                            const investor = investors.find(inv => inv.id === w.investorId);
                            return (
                              <tr key={`${w.id}-${idx}`} className="hover:bg-slate-50/30 transition-colors">
                                <td className="px-6 py-5 whitespace-nowrap">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                                      {investor?.name.charAt(0)}
                                    </div>
                                    <div>
                                      <p className="text-sm font-bold text-slate-900">{investor?.name || 'Unknown'}</p>
                                      <p className="text-[10px] text-slate-400">{investor?.email}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                  <p className="text-sm font-bold text-slate-700">{w.opportunityTitle}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <p className="text-[10px] text-slate-400">{w.partnerName} • {w.location}</p>
                                    {w.isReturnsWithdrawal && (
                                      <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[8px] font-black uppercase tracking-tighter border border-blue-100">
                                        Returns
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap text-xs text-slate-600">
                                  {new Date(w.date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                  <div className="flex flex-col">
                                    <span className="text-sm font-black text-slate-900">${(w.withdrawalAmount ?? 0).toLocaleString()}</span>
                                    <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                                      <span className="text-[9px] text-slate-500 font-bold">P: ${(w.investmentAmount ?? 0).toLocaleString()}</span>
                                      <span className="text-[9px] text-emerald-600 font-bold">G: ${(w.gainAmount ?? 0).toLocaleString()}</span>
                                      {w.withdrawnGains && w.withdrawnGains > 0 ? (
                                        <span className="text-[9px] text-rose-500 font-bold">D: -${w.withdrawnGains.toLocaleString()}</span>
                                      ) : null}
                                      {w.fineAmount > 0 && (
                                        <span className="text-[9px] text-rose-600 font-bold">F: -${w.fineAmount.toLocaleString()}</span>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap text-center">
                                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                    w.status === WithdrawalStatus.APPROVED ? 'bg-emerald-50 text-emerald-600' : 
                                    w.status === WithdrawalStatus.REJECTED ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                                  }`}>
                                    {w.status === WithdrawalStatus.APPROVED ? <CheckCircle className="w-3 h-3" /> : 
                                     w.status === WithdrawalStatus.REJECTED ? <X className="w-3 h-3" /> : <Clock className="w-3 h-3" />} {w.status}
                                  </span>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap text-right">
                                  {w.status === WithdrawalStatus.PENDING && (
                                    <div className="flex items-center justify-end gap-2">
                                      <button 
                                        onClick={() => onUpdateWithdrawalStatus(w.id, WithdrawalStatus.APPROVED)}
                                        className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl transition shadow-sm"
                                        title="Approve Withdrawal"
                                      >
                                        <CheckCircle className="w-4 h-4" />
                                      </button>
                                      <button 
                                        onClick={() => onUpdateWithdrawalStatus(w.id, WithdrawalStatus.REJECTED)}
                                        className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition shadow-sm"
                                        title="Reject Withdrawal"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  )}
                                  {w.status !== WithdrawalStatus.PENDING && (
                                    <span className="text-[10px] font-bold text-slate-400 italic">Processed</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={6} className="px-6 py-20 text-center text-slate-400 italic text-sm">No withdrawal requests found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalWithdrawalPages > 1 && (
                    <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Page {withdrawalPage} of {totalWithdrawalPages}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setWithdrawalPage(prev => Math.max(1, prev - 1))}
                          disabled={withdrawalPage === 1}
                          className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setWithdrawalPage(prev => Math.min(totalWithdrawalPages, prev + 1))}
                          disabled={withdrawalPage === totalWithdrawalPages}
                          className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'certificates' && (
              <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 serif">Certificate Management</h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Investment & Withdrawal Certificates</p>
                  </div>
                </div>

                {/* Sub Tabs */}
                <div className="flex flex-wrap gap-4 border-b border-slate-100 pb-6">
                  <button 
                    onClick={() => setCertSubTab('Investments')}
                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${certSubTab === 'Investments' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'bg-white border border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                  >
                    Investment Certificates
                  </button>
                  <button 
                    onClick={() => setCertSubTab('Withdrawals')}
                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${certSubTab === 'Withdrawals' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'bg-white border border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                  >
                    Withdrawal Certificates
                  </button>
                </div>

                {/* Search and Filters */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search Name, ID, Cert ID..."
                        value={certSearchQuery}
                        onChange={(e) => setCertSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      />
                    </div>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select
                        value={certInvestorFilter}
                        onChange={(e) => setCertInvestorFilter(e.target.value)}
                        className="w-full pl-11 pr-8 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      >
                        <option value="All">All Investors</option>
                        {investors.map(inv => (
                          <option key={inv.id} value={inv.id}>{inv.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select
                        value={certAssetTypeFilter}
                        onChange={(e) => setCertAssetTypeFilter(e.target.value)}
                        className="w-full pl-11 pr-8 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      >
                        <option value="All">All Asset Types</option>
                        {Array.from(new Set(opportunities.map(o => o.type))).map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="relative flex-1">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                          <select
                            value={certMonthFilter}
                            onChange={(e) => setCertMonthFilter(e.target.value)}
                            className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-bold appearance-none focus:outline-none"
                          >
                            <option value="All">Month</option>
                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => (
                              <option key={m} value={i.toString()}>{m}</option>
                            ))}
                          </select>
                       </div>
                       <div className="relative flex-1">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                          <select
                            value={certYearFilter}
                            onChange={(e) => setCertYearFilter(e.target.value)}
                            className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-bold appearance-none focus:outline-none"
                          >
                            <option value="All">Year</option>
                            {Array.from({length: 5}, (_, i) => new Date().getFullYear() - i).map(y => (
                              <option key={y} value={y.toString()}>{y}</option>
                            ))}
                          </select>
                       </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-4 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Range:</span>
                      <input 
                        type="date"
                        className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none"
                        value={certDateFrom}
                        onChange={(e) => setCertDateFrom(e.target.value)}
                      />
                      <span className="text-slate-300">to</span>
                      <input 
                        type="date"
                        className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none"
                        value={certDateTo}
                        onChange={(e) => setCertDateTo(e.target.value)}
                      />
                    </div>
                    {(certSearchQuery || certInvestorFilter !== 'All' || certAssetTypeFilter !== 'All' || certMonthFilter !== 'All' || certYearFilter !== 'All' || certDateFrom || certDateTo) && (
                      <button
                        onClick={() => {
                          setCertSearchQuery('');
                          setCertInvestorFilter('All');
                          setCertAssetTypeFilter('All');
                          setCertMonthFilter('All');
                          setCertYearFilter('All');
                          setCertDateFrom('');
                          setCertDateTo('');
                        }}
                        className="text-xs font-bold text-rose-500 hover:bg-rose-50 px-4 py-2 rounded-xl transition"
                      >
                        Clear All Filters
                      </button>
                    )}
                  </div>
                </div>

                {/* Certificates Table */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                          <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Certificate ID</th>
                          <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Investor</th>
                          <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset</th>
                          <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                          <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                          <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredCertificates.length > 0 ? (
                          filteredCertificates.map((cert, index) => {
                            const investor = investors.find(inv => inv.id === cert.investorId);
                            const opportunity = opportunities.find(opp => opp.id === cert.opportunityId);
                            const date = new Date(cert.date);
                            const amount = 'investmentAmount' in cert ? cert.investmentAmount : cert.withdrawalAmount;
                            const type = 'investmentAmount' in cert ? 'Investment' : 'Withdrawal';
                            
                            return (
                              <tr key={`${type}-${cert.id}-${index}`} className="hover:bg-slate-50/30 transition-colors group">
                                <td className="px-6 py-5 whitespace-nowrap">
                                  <div className="flex items-center gap-2">
                                    <FileBadge className={`w-4 h-4 ${type === 'Investment' ? 'text-emerald-500' : 'text-blue-500'}`} />
                                    <span className="text-xs font-black text-slate-900">{cert.id.slice(0, 8).toUpperCase()}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                      {investor?.name.charAt(0)}
                                    </div>
                                    <div>
                                      <p className="text-sm font-bold text-slate-900">{investor?.name || 'Unknown'}</p>
                                      <p className="text-[10px] text-slate-400">ID: {cert.investorId.slice(0, 6)}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                  <p className="text-sm font-bold text-slate-700">{opportunity?.title || 'Unknown Asset'}</p>
                                  <p className="text-[10px] text-slate-400">{opportunity?.type} • {opportunity?.location}</p>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap text-xs text-slate-600">
                                  {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                  <span className="text-sm font-black text-slate-900">${(amount ?? 0).toLocaleString()}</span>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button 
                                      onClick={() => setShowCertPreview({ id: cert.id, type })}
                                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition"
                                    >
                                      <Eye className="w-3 h-3" />
                                      <span>View</span>
                                    </button>
                                    <button 
                                      onClick={() => handleDownloadCertificate(cert.id, type)}
                                      disabled={isDownloading}
                                      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition disabled:opacity-50 min-w-[110px] justify-center"
                                    >
                                      {isDownloading && downloadingCert?.id === cert.id ? (
                                        <>
                                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                          <span>Downloading...</span>
                                        </>
                                      ) : (
                                        <>
                                          <Download className="w-3 h-3" />
                                          <span>Download</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={6} className="px-6 py-20 text-center">
                              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileBadge className="w-8 h-8 text-slate-200" />
                              </div>
                              <p className="text-sm font-bold text-slate-400 italic">No certificates found matching your criteria.</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 serif">Communications Center</h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Broadcast & Direct Messaging</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className={`p-3 rounded-xl border transition flex items-center gap-2 ${soundEnabled ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-400'}`}
                      title={soundEnabled ? 'Sound Alerts Enabled' : 'Sound Alerts Disabled'}
                    >
                      {soundEnabled ? <Zap className="w-4 h-4" /> : <Zap className="w-4 h-4 opacity-30" />}
                      <span className="text-[10px] font-black uppercase tracking-widest">{soundEnabled ? 'Alerts On' : 'Alerts Off'}</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 border-b border-slate-100 pb-6">
                  <button 
                    onClick={() => setCommSubTab('history')}
                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${commSubTab === 'history' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'bg-white border border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                  >
                    Notification History
                  </button>
                  <button 
                    onClick={() => setCommSubTab('alerts')}
                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${commSubTab === 'alerts' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'bg-white border border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                  >
                    Recent Investor Alerts
                  </button>
                  <button 
                    onClick={() => setCommSubTab('asset-manager')}
                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${commSubTab === 'asset-manager' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'bg-white border border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                  >
                    Asset Manager Notifications
                  </button>
                  <button 
                    onClick={() => setCommSubTab('send')}
                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${commSubTab === 'send' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'bg-white border border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                  >
                    Send New Message / Notification
                  </button>
                </div>

                <div className="space-y-8">
                  {commSubTab === 'history' && (
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="flex justify-between items-center mb-8">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">Notification History</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Live Activity Feed</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                            <input 
                              type="text"
                              placeholder="Search history..."
                              className="pl-8 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 w-48"
                              value={notificationSearchQuery}
                              onChange={(e) => setNotificationSearchQuery(e.target.value)}
                            />
                          </div>
                          <select 
                            className="px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-emerald-500/20"
                            value={notificationTypeFilter}
                            onChange={(e) => setNotificationTypeFilter(e.target.value)}
                          >
                            <option value="All">All Types</option>
                            {Object.values(NotificationType).map(v => <option key={v} value={v}>{v}</option>)}
                          </select>
                          <select 
                            className="px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-emerald-500/20"
                            value={notificationStatusFilter}
                            onChange={(e) => setNotificationStatusFilter(e.target.value)}
                          >
                            <option value="All">All Status</option>
                            <option value="Read">Read</option>
                            <option value="Unread">Unread</option>
                          </select>
                          <select 
                            className="px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-emerald-500/20 w-40"
                            value={notificationInvestorFilter}
                            onChange={(e) => setNotificationInvestorFilter(e.target.value)}
                          >
                            <option value="All">All Investors</option>
                            {investors.map(inv => (
                              <option key={inv.id} value={inv.id}>{inv.name}</option>
                            ))}
                          </select>
                          <div className="flex items-center gap-2">
                            <input 
                              type="date"
                              className="px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                              value={notificationDateFrom}
                              onChange={(e) => setNotificationDateFrom(e.target.value)}
                              title="From Date"
                            />
                            <span className="text-slate-400 text-[10px]">to</span>
                            <input 
                              type="date"
                              className="px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                              value={notificationDateTo}
                              onChange={(e) => setNotificationDateTo(e.target.value)}
                              title="To Date"
                            />
                          </div>
                          {(notificationSearchQuery || notificationTypeFilter !== 'All' || notificationStatusFilter !== 'All' || notificationInvestorFilter !== 'All' || notificationDateFrom || notificationDateTo) && (
                            <button 
                              onClick={() => {
                                setNotificationSearchQuery('');
                                setNotificationTypeFilter('All');
                                setNotificationStatusFilter('All');
                                setNotificationInvestorFilter('All');
                                setNotificationDateFrom('');
                                setNotificationDateTo('');
                              }}
                              className="px-3 py-2 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-colors"
                            >
                              Clear Filters
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Live Feed Marquee */}
                      <div className="mb-8 bg-slate-900 rounded-2xl p-4 overflow-hidden relative group">
                        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-900 to-transparent z-10" />
                        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-900 to-transparent z-10" />
                        <div className="flex whitespace-nowrap animate-marquee hover:pause">
                          {[...allNotifications].slice(0, 10).map((n, i) => (
                            <div key={`live-${n.id}-${i}`} className="flex items-center gap-4 px-8 border-r border-slate-800 last:border-0">
                              <div className={`w-2 h-2 rounded-full ${
                                n.type === NotificationType.KYC ? 'bg-blue-400' :
                                n.type === NotificationType.RETURN ? 'bg-emerald-400' :
                                n.type === NotificationType.INVESTMENT ? 'bg-purple-400' :
                                'bg-amber-400'
                              }`} />
                              <span className="text-[10px] font-bold text-slate-300">
                                <span className="text-slate-500 uppercase tracking-widest mr-2">{n.type}:</span>
                                {n.title}
                              </span>
                              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Just Now</span>
                            </div>
                          ))}
                          {/* Duplicate for seamless loop */}
                          {[...allNotifications].slice(0, 10).map((n, i) => (
                            <div key={`live-dup-${n.id}-${i}`} className="flex items-center gap-4 px-8 border-r border-slate-800 last:border-0">
                              <div className={`w-2 h-2 rounded-full ${
                                n.type === NotificationType.KYC ? 'bg-blue-400' :
                                n.type === NotificationType.RETURN ? 'bg-emerald-400' :
                                n.type === NotificationType.INVESTMENT ? 'bg-purple-400' :
                                'bg-amber-400'
                              }`} />
                              <span className="text-[10px] font-bold text-slate-300">
                                <span className="text-slate-500 uppercase tracking-widest mr-2">{n.type}:</span>
                                {n.title}
                              </span>
                              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Just Now</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar mb-8">
                        {paginatedNotifications.length > 0 ? (
                          paginatedNotifications.map((n, index) => (
                            <div key={`${n.id}-${index}`} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition group">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-lg ${
                                    n.type === NotificationType.KYC ? 'bg-blue-100 text-blue-600' :
                                    n.type === NotificationType.RETURN ? 'bg-emerald-100 text-emerald-600' :
                                    n.type === NotificationType.INVESTMENT ? 'bg-purple-100 text-purple-600' :
                                    n.type === NotificationType.OPPORTUNITY ? 'bg-amber-100 text-amber-600' :
                                    'bg-slate-200 text-slate-600'
                                  }`}>
                                    <Bell className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-bold text-slate-900">{n.title}</h4>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">To: {n.investorName} ({n.investorEmail})</p>
                                  </div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400">{new Date(n.date).toLocaleDateString()}</span>
                              </div>
                              <p className="text-xs text-slate-500 leading-relaxed mb-4">{n.message}</p>
                              {n.actionUrl && (
                                <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                                  <LinkIcon className="w-3 h-3" />
                                  {n.actionUrl}
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="py-20 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                              <Bell className="w-8 h-8" />
                            </div>
                            <p className="text-sm font-bold text-slate-400">No notifications found matching your criteria.</p>
                          </div>
                        )}
                      </div>

                      {totalNotificationPages > 1 && (
                        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
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

                  {commSubTab === 'alerts' && (
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="flex flex-col gap-6 mb-8">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-lg font-bold text-slate-900">Recent Investor Alerts</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Live Feed</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                            <input 
                              type="text"
                              placeholder="Search alerts by title or ID..."
                              className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                              value={alertSearchQuery}
                              onChange={(e) => setAlertSearchQuery(e.target.value)}
                            />
                          </div>
                          <select 
                            className="px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-emerald-500/20"
                            value={alertTypeFilter}
                            onChange={(e) => setAlertTypeFilter(e.target.value)}
                          >
                            <option value="All">All Types</option>
                            <option value="KYC">KYC</option>
                            <option value="Withdrawal">Withdrawal</option>
                          </select>
                          <select 
                            className="px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-emerald-500/20"
                            value={alertInvestorFilter}
                            onChange={(e) => setAlertInvestorFilter(e.target.value)}
                          >
                            <option value="All">All Investors</option>
                            {investors.map(inv => (
                              <option key={inv.id} value={inv.id}>{inv.name}</option>
                            ))}
                          </select>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">From</span>
                              <input 
                                type="date"
                                className="px-2 py-2 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                                value={alertDateFrom}
                                onChange={(e) => setAlertDateFrom(e.target.value)}
                              />
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">To</span>
                              <input 
                                type="date"
                                className="px-2 py-2 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                                value={alertDateTo}
                                onChange={(e) => setAlertDateTo(e.target.value)}
                              />
                            </div>
                          </div>
                          {alertSearchQuery || alertTypeFilter !== 'All' || alertInvestorFilter !== 'All' || alertDateFrom || alertDateTo ? (
                            <button 
                              onClick={() => {
                                setAlertSearchQuery('');
                                setAlertTypeFilter('All');
                                setAlertInvestorFilter('All');
                                setAlertDateFrom('');
                                setAlertDateTo('');
                              }}
                              className="px-3 py-2 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-colors"
                            >
                              Reset
                            </button>
                          ) : null}
                        </div>
                      </div>

                      <div className="space-y-4 mb-8">
                        {paginatedAlerts.length > 0 ? (
                          paginatedAlerts.map((alert, idx) => (
                            <div key={`${alert.id}-${idx}`} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition group">
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  alert.type === 'KYC' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                                }`}>
                                  {alert.type === 'KYC' ? <ShieldCheck className="w-5 h-5" /> : <Wallet className="w-5 h-5" />}
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-slate-900">{alert.title}</p>
                                  <p className="text-[10px] text-slate-400 font-medium">{alert.subtitle}</p>
                                </div>
                              </div>
                              <button 
                                onClick={() => {
                                  if (alert.action === 'kyc') {
                                    setActiveTab('kyc');
                                    setSearchQuery(alert.investorUniqueId);
                                  } else {
                                    setActiveTab('withdrawals');
                                  }
                                }}
                                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition shadow-sm"
                              >
                                {alert.action === 'kyc' ? 'Review' : 'Manage'}
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="py-10 text-center text-slate-400 italic text-sm">No recent investor alerts found.</div>
                        )}
                      </div>

                      {totalAlertPages > 1 && (
                        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Page {alertPage} of {totalAlertPages}
                          </p>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => setAlertPage(prev => Math.max(1, prev - 1))}
                              disabled={alertPage === 1}
                              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                alertPage === 1 
                                  ? 'bg-slate-50 text-slate-300 cursor-not-allowed' 
                                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              Previous Page
                            </button>
                            <button 
                              onClick={() => setAlertPage(prev => Math.min(totalAlertPages, prev + 1))}
                              disabled={alertPage === totalAlertPages}
                              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                alertPage === totalAlertPages 
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

                  {commSubTab === 'asset-manager' && (
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">Asset Manager Notifications</h3>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">System-Generated Performance & Obligation Alerts</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                            <input 
                              type="text"
                              placeholder="Search Asset, ID, Investor, Location..."
                              value={amSearchQuery}
                              onChange={(e) => setAmSearchQuery(e.target.value)}
                              className="pl-11 pr-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-xs font-bold w-full md:w-80 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                            />
                          </div>
                          <button 
                            onClick={() => setShowAmFilters(!showAmFilters)}
                            className={`p-3 rounded-2xl border transition-all flex items-center gap-2 ${
                              showAmFilters ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <Filter className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Filters</span>
                          </button>
                          <div className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                            {filteredAssetManagerNotifications.length} Alerts
                          </div>
                        </div>
                      </div>

                      {showAmFilters && (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8 p-6 bg-slate-50 rounded-3xl border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-300">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Investor</label>
                            <select 
                              value={amInvestorFilter}
                              onChange={(e) => setAmInvestorFilter(e.target.value)}
                              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none text-[10px] font-bold"
                            >
                              <option value="All">All Investors</option>
                              {investors.map(inv => (
                                <option key={inv.id} value={inv.id}>{inv.name}</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Return Type</label>
                            <select 
                              value={amReturnTypeFilter}
                              onChange={(e) => setAmReturnTypeFilter(e.target.value)}
                              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none text-[10px] font-bold"
                            >
                              <option value="All">All Types</option>
                              {Object.values(ReturnType).map(type => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset</label>
                            <select 
                              value={amAssetFilter}
                              onChange={(e) => setAmAssetFilter(e.target.value)}
                              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none text-[10px] font-bold"
                            >
                              <option value="All">All Assets</option>
                              {opportunities.map(opp => (
                                <option key={opp.id} value={opp.id}>{opp.title}</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date From</label>
                            <input 
                              type="date"
                              value={amDateFrom}
                              onChange={(e) => setAmDateFrom(e.target.value)}
                              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none text-[10px] font-bold"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date To</label>
                            <input 
                              type="date"
                              value={amDateTo}
                              onChange={(e) => setAmDateTo(e.target.value)}
                              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none text-[10px] font-bold"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
                            <select 
                              value={amStatusFilter}
                              onChange={(e) => setAmStatusFilter(e.target.value)}
                              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none text-[10px] font-bold"
                            >
                              <option value="All">All Status</option>
                              <option value="Read">Read</option>
                              <option value="Unread">Unread</option>
                            </select>
                          </div>
                        </div>
                      )}

                      <div className="grid gap-4">
                        {paginatedAmNotifications.length > 0 ? (
                          paginatedAmNotifications.map((n, index) => (
                            <div key={`${n.id}-${index}`} className={`p-6 rounded-2xl border transition group flex items-start gap-6 ${
                              n.read ? 'bg-white border-slate-100 opacity-75' : 'bg-slate-50 border-slate-200 hover:border-emerald-200'
                            }`}>
                              <div className={`p-3 rounded-xl ${
                                n.type === 'Holding Period' ? 'bg-amber-100 text-amber-600' :
                                n.type === 'Yield Payout' ? 'bg-blue-100 text-blue-600' :
                                'bg-emerald-100 text-emerald-600'
                              }`}>
                                {n.type === 'Holding Period' ? <Clock className="w-5 h-5" /> : 
                                 n.type === 'Yield Payout' ? <TrendingUp className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h4 className="text-sm font-bold text-slate-900">{n.title}</h4>
                                      {!n.read && <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>}
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{n.subtitle}</p>
                                  </div>
                                  <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-bold text-slate-400">{new Date(n.date).toLocaleDateString()}</span>
                                    <span className={`text-[8px] font-black uppercase tracking-widest mt-1 ${
                                      n.priority === 'High' ? 'text-rose-500' : 'text-amber-500'
                                    }`}>{n.priority} Priority</span>
                                  </div>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed mt-2 mb-4">{n.message}</p>
                                <div className="flex items-center justify-between">
                                  <button 
                                    onClick={() => {
                                      if (!n.read) toggleAmNotificationRead(n.id);
                                      setActiveTab(n.action as any);
                                      if (n.action === 'asset-manager' && n.subTab) {
                                        setAssetManagerSubTab(n.subTab as any);
                                      }
                                      if (n.action === 'investments') {
                                        if (n.subTab) setInvestmentSubTab(n.subTab as any);
                                        if (n.assetId) setInvMgmtAssetFilter(n.assetId);
                                      }
                                    }}
                                    className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition"
                                  >
                                    View Details & Take Action
                                    <ChevronRight className="w-3 h-3" />
                                  </button>
                                  <button 
                                    onClick={() => toggleAmNotificationRead(n.id)}
                                    className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition"
                                  >
                                    {n.read ? 'Mark as Unread' : 'Mark as Read'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-20 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                              <ShieldCheck className="w-8 h-8" />
                            </div>
                            <p className="text-sm font-bold text-slate-400">No matching notifications found.</p>
                          </div>
                        )}
                      </div>

                      {totalAmPages > 1 && (
                        <div className="flex items-center justify-between mt-8 pt-8 border-t border-slate-50">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Page {amPage} of {totalAmPages}
                          </p>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => setAmPage(prev => Math.max(1, prev - 1))}
                              disabled={amPage === 1}
                              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                amPage === 1 
                                  ? 'bg-slate-50 text-slate-300 cursor-not-allowed' 
                                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              Previous Page
                            </button>
                            <button 
                              onClick={() => setAmPage(prev => Math.min(totalAmPages, prev + 1))}
                              disabled={amPage === totalAmPages}
                              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                amPage === totalAmPages 
                                  ? 'bg-slate-50 text-slate-300 cursor-not-allowed' 
                                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              Next Page
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="mt-10 p-6 bg-slate-900 rounded-[2rem] border border-slate-800">
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <Zap className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">Automated Monitoring Active</p>
                            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                              The system is continuously monitoring asset holding periods, annual yield cycles, and investor participation timelines. 
                              Notifications are generated automatically when distribution milestones are reached.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {commSubTab === 'send' && (
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <h3 className="text-lg font-bold text-slate-900 mb-6">Send New Message / Notification</h3>
                      <form className="space-y-6" onSubmit={(e) => {
                        e.preventDefault();
                        if (notificationFormData.investorId === 'all') {
                          investors.forEach(inv => {
                            onAddNotification(inv.id, notificationFormData.type, notificationFormData.title, notificationFormData.message, notificationFormData.actionUrl);
                          });
                          alert(`Message sent to all ${investors.length} investors.`);
                        } else {
                          onAddNotification(notificationFormData.investorId, notificationFormData.type, notificationFormData.title, notificationFormData.message, notificationFormData.actionUrl);
                          alert('Message sent successfully.');
                        }
                        setNotificationFormData({ ...notificationFormData, title: '', message: '', actionUrl: '' });
                      }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recipient</label>
                            <select 
                              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold"
                              value={notificationFormData.investorId}
                              onChange={(e) => setNotificationFormData({ ...notificationFormData, investorId: e.target.value })}
                            >
                              <option value="all">All Investors (Broadcast)</option>
                              {investors.map(inv => (
                                <option key={inv.id} value={inv.id}>{inv.name} ({inv.email})</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Message Type</label>
                            <select 
                              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold"
                              value={notificationFormData.type}
                              onChange={(e) => setNotificationFormData({ ...notificationFormData, type: e.target.value as NotificationType })}
                            >
                              <option value={NotificationType.KYC}>KYC Update</option>
                              <option value={NotificationType.RETURN}>Return/Payout</option>
                              <option value={NotificationType.INVESTMENT}>Investment Update</option>
                              <option value={NotificationType.OPPORTUNITY}>New Opportunity</option>
                              <option value={NotificationType.OTHER}>General Message</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject / Title</label>
                          <input 
                            type="text"
                            required
                            placeholder="e.g., Important Account Update"
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold"
                            value={notificationFormData.title}
                            onChange={(e) => setNotificationFormData({ ...notificationFormData, title: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Message Content (Formatting Preserved)</label>
                          <textarea 
                            required
                            rows={6}
                            placeholder="Type your message here. Line breaks, spaces, and paragraphs will be preserved exactly as entered."
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold resize-none whitespace-pre-wrap"
                            value={notificationFormData.message}
                            onChange={(e) => setNotificationFormData({ ...notificationFormData, message: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Action URL (Optional)</label>
                          <input 
                            type="text"
                            placeholder="e.g., /dashboard?tab=market"
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold"
                            value={notificationFormData.actionUrl}
                            onChange={(e) => setNotificationFormData({ ...notificationFormData, actionUrl: e.target.value })}
                          />
                        </div>

                        <button 
                          type="submit"
                          className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-2xl"
                        >
                          <Send className="w-5 h-5" />
                          Send Message
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'testimonials' && (
              <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 serif">Testimonials Manager</h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Manage Success Stories & Video Testimonials</p>
                  </div>
                  <button 
                    onClick={() => {
                      setEditingTestimonial(null);
                      setTestimonialFormData({
                        type: TestimonialType.SUCCESS_STORY,
                        name: '',
                        role: '',
                        company: '',
                        avatar: '',
                        imageUrl: '',
                        videoUrl: '',
                        textTestimonial: '',
                        rating: 5,
                        successStory: {
                          amount: 0,
                          roi: '',
                          month: new Date().toLocaleString('default', { month: 'long' }),
                          year: new Date().getFullYear().toString(),
                          description: '',
                          assetName: '',
                          assetClass: '',
                          holdingPeriod: '',
                          returnType: 'ROI',
                          monthlyReturn: 0,
                          yearlyRent: 0,
                          dividend: 0,
                          payout: 'Monthly',
                          location: ''
                        }
                      });
                      setShowTestimonialModal(true);
                    }}
                    className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg flex items-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" /> Add Testimonial
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {testimonials.map((t) => (
                    <div key={t.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition group">
                      <div className="aspect-video relative overflow-hidden bg-slate-100">
                        {t.type === TestimonialType.VIDEO ? (
                          <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white">
                            <Video className="w-12 h-12 opacity-50" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-xl">
                                <Play className="w-6 h-6 text-black fill-current" />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <img 
                            src={t.imageUrl} 
                            alt={t.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        )}
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              setEditingTestimonial(t);
                              setTestimonialFormData(t);
                              setShowTestimonialModal(true);
                            }}
                            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-slate-600 hover:text-emerald-600 transition shadow-sm"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => onDeleteTestimonial(t.id)}
                            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-slate-600 hover:text-rose-600 transition shadow-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            t.type === TestimonialType.VIDEO ? 'bg-blue-500 text-white' : 'bg-emerald-500 text-black'
                          }`}>
                            {t.type === TestimonialType.VIDEO ? 'Video' : 'Success Story'}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <img 
                            src={t.avatar} 
                            alt={t.name} 
                            className="w-10 h-10 rounded-full border border-slate-100"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h3 className="text-sm font-bold text-slate-900">{t.name}</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t.role} @ {t.company}</p>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 italic mb-4">"{t.textTestimonial}"</p>
                        {t.type === TestimonialType.SUCCESS_STORY && t.successStory && (
                          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-50">
                            <div>
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Investment</p>
                              <p className="text-xs font-bold text-slate-900">${(t.successStory.amount ?? 0).toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Holding</p>
                              <p className="text-xs font-bold text-slate-900">{t.successStory.holdingPeriod}</p>
                            </div>
                            <div className={t.successStory.returnType === 'ROI' ? 'col-span-2' : ''}>
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">ROI</p>
                              <p className="text-xs font-bold text-emerald-600">{t.successStory.roi}</p>
                            </div>
                            {t.successStory.returnType !== 'ROI' && (
                              <div>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 truncate">{t.successStory.returnType}</p>
                                <p className="text-xs font-bold text-slate-900">
                                  {t.successStory.returnType === 'Monthly Rent' ? `$${(t.successStory.monthlyReturn ?? 0).toLocaleString()}` :
                                   t.successStory.returnType === 'Yearly Rent' ? `$${(t.successStory.yearlyRent ?? 0).toLocaleString()}` :
                                   `$${(t.successStory.dividend ?? 0).toLocaleString()}`}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                        {t.type === TestimonialType.SUCCESS_STORY && t.successStory?.paragraph && (
                          <p className="mt-4 text-[10px] text-slate-400 line-clamp-2 italic border-t border-slate-50 pt-3">
                            {t.successStory.paragraph}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'team-manager' && (
              <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 serif">Team Manager</h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Manage Leadership, Advisory & Operations Teams</p>
                  </div>
                  <button 
                    onClick={() => {
                      setEditingTeamMember(null);
                      setTeamFormData({
                        name: '',
                        role: '',
                        bio: '',
                        image: '',
                        category: 'leadership',
                        socials: {
                          linkedin: '',
                          x: '',
                          mail: '',
                          instagram: ''
                        }
                      });
                      setShowTeamModal(true);
                    }}
                    className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg flex items-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" /> Add Team Member
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teamMembers.length === 0 ? (
                    <div className="col-span-full bg-white rounded-[2.5rem] border border-slate-100 p-20 text-center space-y-4">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                        <Users className="w-10 h-10 text-slate-300" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 serif">No Team Members Found</h3>
                        <p className="text-sm text-slate-400">Start by adding your first team member.</p>
                      </div>
                    </div>
                  ) : (
                    teamMembers.map((member) => (
                      <div key={member.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-6 shadow-sm hover:shadow-md transition group relative overflow-hidden">
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              setEditingTeamMember(member);
                              setTeamFormData(member);
                              setShowTeamModal(true);
                            }}
                            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-slate-400 hover:text-emerald-600 transition shadow-sm"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteTeamMemberAction(member.id)}
                            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-slate-400 hover:text-rose-500 transition shadow-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="flex flex-col items-center text-center space-y-4">
                          <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-slate-50 shadow-inner">
                            <img 
                              src={member.image || 'https://i.pravatar.cc/150'} 
                              alt={member.name} 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div>
                            <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-slate-100 rounded-full text-slate-500 mb-2 inline-block">
                              {member.category}
                            </span>
                            <h3 className="text-lg font-bold text-slate-900 serif">{member.name}</h3>
                            <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest">{member.role}</p>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                            {member.bio}
                          </p>
                          <div className="flex gap-3 pt-2">
                            {member.socials.linkedin && <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><Linkedin className="w-4 h-4" /></div>}
                            {member.socials.x && <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><Twitter className="w-4 h-4" /></div>}
                            {member.socials.instagram && <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><Instagram className="w-4 h-4" /></div>}
                            {member.socials.mail && <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><Mail className="w-4 h-4" /></div>}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            {activeTab === 'partners' && (
              <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 serif">Partners Manager</h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Manage Strategic Partnerships & Teams</p>
                  </div>
                  <button 
                    onClick={() => {
                      setEditingPartner(null);
                      setPartnerFormData({
                        legalCompanyName: '',
                        email: '',
                        phone: '',
                        address: {
                          fullAddress: '',
                          city: '',
                          state: '',
                          country: '',
                          pincode: ''
                        },
                        panNumber: '',
                        gstNumber: '',
                        website: '',
                        logo: '',
                        about: '',
                        businessType: '',
                        associatedAssets: [],
                        team: []
                      });
                      setShowPartnerModal(true);
                    }}
                    className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg flex items-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" /> Add Partner
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {partners.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-20 text-center space-y-4">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                        <Users className="w-10 h-10 text-slate-300" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 serif">No Partners Registered</h3>
                        <p className="text-sm text-slate-400">Start by adding your first strategic partner.</p>
                      </div>
                    </div>
                  ) : (
                    partners.map((partner) => (
                      <div key={partner.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-md transition group">
                        <div className="flex flex-col lg:flex-row gap-8">
                          <div className="flex-1 space-y-6">
                            <div className="flex justify-between items-start">
                              <div className="flex gap-6 items-start">
                                {partner.logo && (
                                  <div className="w-16 h-16 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                    <img src={partner.logo} alt={partner.legalCompanyName} className="w-full h-full object-contain p-2" referrerPolicy="no-referrer" />
                                  </div>
                                )}
                                <div>
                                  <h3 className="text-2xl font-bold text-slate-900 serif">{partner.legalCompanyName}</h3>
                                  <div className="flex items-center gap-4 mt-2">
                                    <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-600 font-bold flex items-center gap-1 hover:underline">
                                      <Globe className="w-3 h-3" /> {partner.website.replace(/^https?:\/\//, '')}
                                    </a>
                                    <span className="text-slate-200">|</span>
                                    <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                                      <Mail className="w-3 h-3" /> {partner.email}
                                    </span>
                                    <span className="text-slate-200">|</span>
                                    <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                                      <Phone className="w-3 h-3" /> {partner.phone}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => {
                                    setEditingPartner(partner);
                                    setPartnerFormData(partner);
                                    setShowPartnerModal(true);
                                  }}
                                  className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-emerald-600 transition"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => onDeletePartner(partner.id)}
                                  className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-rose-500 transition"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registered Address</label>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                  {partner.address.fullAddress}<br />
                                  {partner.address.city}, {partner.address.state} - {partner.address.pincode}<br />
                                  {partner.address.country}
                                </p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PAN Number</label>
                                  <p className="text-sm font-bold text-slate-900">{partner.panNumber}</p>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GST Number</label>
                                  <p className="text-sm font-bold text-slate-900">{partner.gstNumber}</p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                {partner.businessType && (
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Business Type</label>
                                    <p className="text-sm font-bold text-emerald-600">{partner.businessType}</p>
                                  </div>
                                )}
                                {partner.associatedAssets && partner.associatedAssets.length > 0 && (
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Associated Assets</label>
                                    <div className="flex flex-wrap gap-1">
                                      {partner.associatedAssets.map((asset, i) => (
                                        <span key={`${asset}-${i}`} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-bold">{asset}</span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            {partner.about && (
                              <div className="pt-4 border-t border-slate-50">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">About the Company</label>
                                <p className="text-xs text-slate-500 line-clamp-2 italic">"{partner.about}"</p>
                              </div>
                            )}
                          </div>

                          <div className="lg:w-1/3 bg-slate-50 rounded-[2rem] p-6 space-y-4">
                            <div className="flex justify-between items-center">
                              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Key Team ({partner.team.length})</h4>
                            </div>
                            <div className="space-y-3">
                              {partner.team.slice(0, 3).map((member) => (
                                <div key={member.id} className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100">
                                  <img src={member.photo || 'https://i.pravatar.cc/150'} alt={member.name} className="w-10 h-10 rounded-xl object-cover" referrerPolicy="no-referrer" />
                                  <div>
                                    <p className="text-xs font-bold text-slate-900">{member.name}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{member.designation}</p>
                                  </div>
                                </div>
                              ))}
                              {partner.team.length > 3 && (
                                <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">+{partner.team.length - 3} more members</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

      {/* Team Member Modal */}
      {showTeamModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setShowTeamModal(false)} />
          <div className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
              <h2 className="text-3xl font-bold serif text-slate-900">{editingTeamMember ? 'Edit Team Member' : 'Add Team Member'}</h2>
              <button onClick={() => setShowTeamModal(false)} className="p-3 hover:bg-slate-200 rounded-full transition text-slate-400"><X /></button>
            </div>
            
            <form onSubmit={handleSaveTeamMemberAction} className="p-12 overflow-y-auto space-y-10">
              <div className="flex flex-col md:flex-row gap-10 items-start">
                <div className="w-full md:w-48 space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Member Photo</label>
                  <div 
                    onClick={() => teamMemberPhotoInputRef.current?.click()}
                    className="aspect-square w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/30 transition group overflow-hidden relative"
                  >
                    {teamFormData.image ? (
                      <>
                        <img src={teamFormData.image} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Upload className="w-6 h-6 text-white" />
                        </div>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-10 h-10 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Upload Photo</span>
                      </>
                    )}
                  </div>
                  <input 
                    type="file" 
                    ref={teamMemberPhotoInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleTeamManagerFileUpload}
                  />
                </div>

                <div className="flex-1 grid md:grid-cols-2 gap-8 w-full">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                      <input required type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 transition" value={teamFormData.name || ''} onChange={e => setTeamFormData({...teamFormData, name: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Designation</label>
                      <input required type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 transition" value={teamFormData.role || ''} onChange={e => setTeamFormData({...teamFormData, role: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                      <select 
                        required 
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 transition font-bold text-sm"
                        value={teamFormData.category || 'leadership'}
                        onChange={e => setTeamFormData({...teamFormData, category: e.target.value as any})}
                      >
                        <option value="leadership">Leadership</option>
                        <option value="advisory">Advisory Board</option>
                        <option value="operations">Operations</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description / Bio</label>
                      <textarea required rows={6} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 transition resize-none" value={teamFormData.bio || ''} onChange={e => setTeamFormData({...teamFormData, bio: e.target.value})} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-slate-100">
                <h3 className="text-xl font-bold serif text-slate-900">Social Media Links</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">LinkedIn URL</label>
                    <div className="relative">
                      <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="url" className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 transition text-sm" value={teamFormData.socials?.linkedin || ''} onChange={e => setTeamFormData({...teamFormData, socials: {...teamFormData.socials!, linkedin: e.target.value}})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">X (Twitter) URL</label>
                    <div className="relative">
                      <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="url" className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 transition text-sm" value={teamFormData.socials?.x || ''} onChange={e => setTeamFormData({...teamFormData, socials: {...teamFormData.socials!, x: e.target.value}})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Instagram URL</label>
                    <div className="relative">
                      <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="url" className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 transition text-sm" value={teamFormData.socials?.instagram || ''} onChange={e => setTeamFormData({...teamFormData, socials: {...teamFormData.socials!, instagram: e.target.value}})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="email" className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 transition text-sm" value={teamFormData.socials?.mail || ''} onChange={e => setTeamFormData({...teamFormData, socials: {...teamFormData.socials!, mail: e.target.value}})} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-10 border-t border-slate-100 flex justify-end gap-4">
                <button type="button" onClick={() => setShowTeamModal(false)} className="px-10 py-5 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition">Cancel</button>
                <button type="submit" className="px-10 py-5 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition shadow-xl shadow-emerald-100 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> {editingTeamMember ? 'Update Member' : 'Save Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Partner Modal */}
      {showPartnerModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setShowPartnerModal(false)} />
          <div className="relative w-full max-w-5xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
              <h2 className="text-3xl font-bold serif text-slate-900">{editingPartner ? 'Edit Partner' : 'Add New Partner'}</h2>
              <button onClick={() => setShowPartnerModal(false)} className="p-3 hover:bg-slate-200 rounded-full transition text-slate-400"><X /></button>
            </div>
            
            <form onSubmit={handlePartnerSubmit} className="p-12 overflow-y-auto space-y-12">
              <div className="flex flex-col md:flex-row gap-10 items-start">
                <div className="w-full md:w-48 space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Company Logo</label>
                  <div 
                    onClick={() => partnerLogoInputRef.current?.click()}
                    className="aspect-square w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/30 transition group overflow-hidden relative"
                  >
                    {partnerFormData.logo ? (
                      <>
                        <img src={partnerFormData.logo} alt="Logo Preview" className="w-full h-full object-contain p-4" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Upload className="w-6 h-6 text-white" />
                        </div>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-10 h-10 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Upload Logo</span>
                      </>
                    )}
                  </div>
                  <input 
                    type="file" 
                    ref={partnerLogoInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'logo')}
                  />

                  <div className="pt-6 space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Stamp Logos (Certificates)</label>
                    <div className="grid grid-cols-2 gap-2">
                      {partnerFormData.stampLogos?.map((stamp, sIdx) => (
                        <div key={sIdx} className="relative aspect-square bg-slate-50 border border-slate-200 rounded-xl overflow-hidden group">
                          <img src={stamp} alt={`Stamp ${sIdx}`} className="w-full h-full object-contain p-2" referrerPolicy="no-referrer" />
                          <button 
                            type="button"
                            onClick={() => {
                              const newStamps = [...(partnerFormData.stampLogos || [])];
                              newStamps.splice(sIdx, 1);
                              setPartnerFormData(prev => ({ ...prev, stampLogos: newStamps }));
                            }}
                            className="absolute inset-0 bg-rose-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ))}
                      <button 
                        type="button"
                        onClick={() => stampLogosInputRef.current?.click()}
                        className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center hover:border-emerald-500 hover:bg-emerald-50/30 transition"
                      >
                        <Plus className="w-5 h-5 text-slate-300" />
                      </button>
                    </div>
                    <input 
                      type="file" 
                      ref={stampLogosInputRef} 
                      className="hidden" 
                      accept="image/*"
                      multiple
                      onChange={async (e) => {
                        const files = e.target.files;
                        if (files) {
                          const filePromises = Array.from(files).map((file: File) => {
                            return new Promise<string>((resolve) => {
                              const reader = new FileReader();
                              reader.onloadend = () => resolve(reader.result as string);
                              reader.readAsDataURL(file);
                            });
                          });
                          const base64Files = await Promise.all(filePromises);
                          setPartnerFormData(prev => ({
                            ...prev,
                            stampLogos: [...(prev.stampLogos || []), ...base64Files]
                          }));
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="flex-1 grid md:grid-cols-2 gap-10 w-full">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Legal Company Name</label>
                      <input required type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 transition" value={partnerFormData.legalCompanyName || ''} onChange={e => handlePartnerChange('legalCompanyName', e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                        <input required type="email" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 transition" value={partnerFormData.email || ''} onChange={e => handlePartnerChange('email', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                        <input required type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 transition" value={partnerFormData.phone || ''} onChange={e => handlePartnerChange('phone', e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Website</label>
                      <input type="url" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 transition" value={partnerFormData.website || ''} onChange={e => handlePartnerChange('website', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">About the Company</label>
                      <textarea rows={4} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 transition resize-none" placeholder="Describe the company's role and expertise..." value={partnerFormData.about || ''} onChange={e => handlePartnerChange('about', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Business Type</label>
                      <input type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 transition" placeholder="e.g. Real Estate, Tech, etc." value={partnerFormData.businessType || ''} onChange={e => handlePartnerChange('businessType', e.target.value)} />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Associated Assets</label>
                      <div className="grid grid-cols-2 gap-3">
                        {['Start-Up', 'Commercial Property', 'Residential Property', 'Land Property', 'Hotel Property'].map((asset) => (
                          <label key={asset} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-white hover:border-emerald-500 transition group">
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                              checked={partnerFormData.associatedAssets?.includes(asset)}
                              onChange={(e) => {
                                const current = partnerFormData.associatedAssets || [];
                                const next = e.target.checked 
                                  ? [...current, asset]
                                  : current.filter(a => a !== asset);
                                handlePartnerChange('associatedAssets', next);
                              }}
                            />
                            <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{asset}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PAN Number</label>
                        <input required type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 transition" value={partnerFormData.panNumber || ''} onChange={e => handlePartnerChange('panNumber', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GST Number</label>
                        <input required type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 transition" value={partnerFormData.gstNumber || ''} onChange={e => handlePartnerChange('gstNumber', e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Address</label>
                      <textarea required rows={3} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 transition resize-none" value={partnerFormData.address?.fullAddress || ''} onChange={e => handlePartnerChange('address.fullAddress', e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">City</label>
                        <input required type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 transition" value={partnerFormData.address?.city || ''} onChange={e => handlePartnerChange('address.city', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">State</label>
                        <input required type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 transition" value={partnerFormData.address?.state || ''} onChange={e => handlePartnerChange('address.state', e.target.value)} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Country</label>
                        <input required type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 transition" value={partnerFormData.address?.country || ''} onChange={e => handlePartnerChange('address.country', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pincode</label>
                        <input required type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 transition" value={partnerFormData.address?.pincode || ''} onChange={e => handlePartnerChange('address.pincode', e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <h3 className="text-xl font-bold serif text-slate-900">Partner Team</h3>
                  <button type="button" onClick={handleAddTeamMember} className="text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-2 text-sm">
                    <PlusCircle className="w-4 h-4" /> Add Team Member
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {partnerFormData.team?.map((member, idx) => (
                    <div key={member.id} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-6 relative group">
                      <button type="button" onClick={() => handleRemoveTeamMember(member.id)} className="absolute top-6 right-6 p-2 bg-white rounded-full text-slate-400 hover:text-rose-500 transition shadow-sm opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      
                      <div className="flex items-center gap-6">
                        <div className="relative group/photo">
                          <div className="w-20 h-20 bg-white rounded-2xl border border-slate-200 flex items-center justify-center overflow-hidden">
                            {member.photo ? (
                              <img src={member.photo} alt={member.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <ImageIcon className="w-8 h-8 text-slate-300" />
                            )}
                          </div>
                          <button 
                            type="button"
                            onClick={() => {
                              setActiveTeamIdx(idx);
                              teamPhotoInputRef.current?.click();
                            }}
                            className="absolute -bottom-2 -right-2 p-2 bg-emerald-600 text-white rounded-lg shadow-lg hover:bg-emerald-700 transition"
                          >
                            <Upload className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex-1 space-y-2">
                          <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                          <input required type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition text-sm" value={member.name} onChange={e => handleUpdateTeamMember(member.id, 'name', e.target.value)} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Email</label>
                          <input required type="email" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition text-sm" value={member.email} onChange={e => handleUpdateTeamMember(member.id, 'email', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Phone</label>
                          <input required type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition text-sm" value={member.phone} onChange={e => handleUpdateTeamMember(member.id, 'phone', e.target.value)} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Designation</label>
                        <input required type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition text-sm" value={member.designation} onChange={e => handleUpdateTeamMember(member.id, 'designation', e.target.value)} />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Address</label>
                        <input required type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition text-sm" value={member.address} onChange={e => handleUpdateTeamMember(member.id, 'address', e.target.value)} />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Partner Signature</label>
                        <div 
                          onClick={() => {
                            setActiveTeamIdx(idx);
                            teamSignatureInputRef.current?.click();
                          }}
                          className="w-full h-24 bg-white border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/30 transition group overflow-hidden relative"
                        >
                          {member.signature ? (
                            <>
                              <img src={member.signature} alt="Signature" className="h-full object-contain p-2" referrerPolicy="no-referrer" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Upload className="w-4 h-4 text-white" />
                              </div>
                            </>
                          ) : (
                            <>
                              <ImageIcon className="w-6 h-6 text-slate-300" />
                              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Upload Signature</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-10 border-t border-slate-100 flex justify-end gap-4">
                <button type="button" onClick={() => setShowPartnerModal(false)} className="px-10 py-5 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition">Cancel</button>
                <button type="submit" className="px-10 py-5 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition shadow-xl shadow-emerald-100 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> {editingPartner ? 'Update Partner' : 'Save Partner'}
                </button>
              </div>
            </form>
          </div>
          <input 
            type="file" 
            ref={teamPhotoInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && activeTeamIdx !== null) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  const team = [...(partnerFormData.team || [])];
                  team[activeTeamIdx].photo = reader.result as string;
                  setPartnerFormData({ ...partnerFormData, team });
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          <input 
            type="file" 
            ref={teamSignatureInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && activeTeamIdx !== null) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  const team = [...(partnerFormData.team || [])];
                  team[activeTeamIdx].signature = reader.result as string;
                  setPartnerFormData({ ...partnerFormData, team });
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </div>
      )}

      {/* Return Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 sm:p-10">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold serif">Process Investor Return</h2>
                  <p className="text-xs text-slate-400 mt-1">Distribute profits to platform investors</p>
                </div>
                <button onClick={() => setShowReturnModal(false)} className="p-3 bg-slate-50 rounded-full text-slate-400 hover:text-rose-500 transition">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleProcessReturn} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Select Investor</label>
                  <select 
                    required
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                    value={returnFormData.investorId || ''}
                    onChange={(e) => setReturnFormData({ ...returnFormData, investorId: e.target.value })}
                  >
                    <option value="">Choose an investor...</option>
                    {investors.map(inv => (
                      <option key={inv.id} value={inv.id}>{inv.name} (${(inv.totalInvested ?? 0).toLocaleString()})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Select Asset</label>
                  <select 
                    required
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                    value={returnFormData.investmentId || ''}
                    onChange={(e) => setReturnFormData({ ...returnFormData, investmentId: e.target.value })}
                  >
                    <option value="">Choose an asset...</option>
                    {filteredAssetsForReturn.map(inv => (
                      <option key={inv.id} value={inv.id}>{inv.opportunityTitle} – Asset ID: {inv.id}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Amount ($)</label>
                    <input 
                      type="number" 
                      required
                      min="1"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                      value={returnFormData.amount || ''}
                      onChange={(e) => setReturnFormData({ ...returnFormData, amount: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date</label>
                    <input 
                      type="date" 
                      required
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                      value={returnFormData.date}
                      onChange={(e) => setReturnFormData({ ...returnFormData, date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Return Type</label>
                  <select 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                    value={returnFormData.type || 'ROI'}
                    onChange={(e) => setReturnFormData({ ...returnFormData, type: e.target.value })}
                  >
                    {Object.values(ReturnType).map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" /> Confirm Distribution
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Register Asset Modal (Enriched) */}
      {showAdd && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setShowAdd(false)} />
          <div className="relative w-full max-w-5xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
              <h2 className="text-3xl font-bold serif text-slate-900">{editingOpp ? 'Refine Asset Detail' : 'Strategic Asset Listing'}</h2>
              <button onClick={() => setShowAdd(false)} className="p-3 hover:bg-slate-200 rounded-full transition text-slate-400"><X /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-12 overflow-y-auto space-y-12">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prospectus Title</label>
                    <input required type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 transition" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Executive Summary</label>
                    <textarea required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none h-40 focus:border-emerald-500 transition" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Capital Class</label>
                        <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold" value={formData.type || ''} onChange={e => setFormData({...formData, type: e.target.value as InvestmentType})}>
                           {Object.values(InvestmentType).map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Risk Factor</label>
                        <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold" value={formData.riskLevel || ''} onChange={e => setFormData({...formData, riskLevel: e.target.value as RiskLevel})}>
                           {Object.values(RiskLevel).map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                     </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Funding Target ($)</label>
                      <input required type="number" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 transition font-bold" value={formData.targetAmount ?? 0} onChange={e => setFormData({...formData, targetAmount: Number(e.target.value)})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Minimum Allocation ($)</label>
                      <input required type="number" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 transition font-bold" value={formData.minInvestment ?? 0} onChange={e => setFormData({...formData, minInvestment: Number(e.target.value)})} />
                    </div>
                  </div>

                  {/* Enhanced Media & Docs */}
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center gap-3 border-b border-slate-50 pb-2">
                       <LinkIcon className="w-4 h-4 text-emerald-600" />
                       <h4 className="text-xs font-black uppercase tracking-widest">Media & Disclosures</h4>
                    </div>
                    <div className="space-y-3">
                       <div className="flex gap-2">
                          <div className="bg-slate-100 p-4 rounded-2xl text-slate-400"><ImageIcon className="w-5 h-5" /></div>
                          <div className="flex-grow flex gap-2">
                            <input type="text" placeholder="Featured Image URL" className="flex-grow px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-xs focus:border-emerald-500 transition" value={formData.imageUrl || ''} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
                            <input 
                              type="file" 
                              ref={imageInputRef} 
                              className="hidden" 
                              accept="image/*" 
                              onChange={(e) => handleFileUpload(e, 'imageUrl')} 
                            />
                            <button 
                              type="button" 
                              onClick={() => imageInputRef.current?.click()} 
                              className="px-4 bg-slate-100 rounded-2xl text-[10px] font-black uppercase hover:bg-slate-200 transition"
                            >
                              Upload Image
                            </button>
                          </div>
                          {formData.imageUrl && (
                            <div className="mt-2 relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 group">
                              <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                              <button 
                                type="button" 
                                onClick={() => setFormData({...formData, imageUrl: ''})}
                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                       </div>
                       <div className="flex gap-2">
                          <div className="bg-slate-100 p-4 rounded-2xl text-slate-400"><Video className="w-5 h-5" /></div>
                          <div className="flex-grow flex gap-2">
                            <input type="text" placeholder="Asset Video Overview URL" className="flex-grow px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-xs focus:border-emerald-500 transition" value={formData.videoUrl || ''} onChange={e => setFormData({...formData, videoUrl: e.target.value})} />
                            <input 
                              type="file" 
                              ref={videoInputRef} 
                              className="hidden" 
                              accept="video/*" 
                              onChange={(e) => handleFileUpload(e, 'videoUrl')} 
                            />
                            <button 
                              type="button" 
                              onClick={() => videoInputRef.current?.click()} 
                              className="px-4 bg-slate-100 rounded-2xl text-[10px] font-black uppercase hover:bg-slate-200 transition"
                            >
                              Upload Video
                            </button>
                          </div>
                          {formData.videoUrl && (
                            <div className="mt-2 flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                              <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600">
                                <Video className="w-4 h-4" />
                              </div>
                              <span className="text-[10px] font-bold truncate max-w-[150px]">Video Selected</span>
                              <button 
                                type="button" 
                                onClick={() => setFormData({...formData, videoUrl: ''})}
                                className="ml-auto p-1 text-slate-400 hover:text-red-500 transition"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                       </div>
                       <div className="flex gap-2">
                          <div className="bg-slate-100 p-4 rounded-2xl text-slate-400"><FileText className="w-5 h-5" /></div>
                          <div className="flex-grow flex gap-2">
                            <input type="text" placeholder="Signed Prospectus PDF URL" className="flex-grow px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-xs focus:border-emerald-500 transition" value={formData.pdfUrl || ''} onChange={e => setFormData({...formData, pdfUrl: e.target.value})} />
                            <input 
                              type="file" 
                              ref={pdfInputRef} 
                              className="hidden" 
                              accept=".pdf" 
                              onChange={(e) => handleFileUpload(e, 'pdfUrl')} 
                            />
                            <button 
                              type="button" 
                              onClick={() => pdfInputRef.current?.click()} 
                              className="px-4 bg-slate-100 rounded-2xl text-[10px] font-black uppercase hover:bg-slate-200 transition"
                            >
                              Upload PDF
                            </button>
                          </div>
                          {formData.pdfUrl && (
                            <div className="mt-2 flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                              <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
                                <FileText className="w-4 h-4" />
                              </div>
                              <span className="text-[10px] font-bold truncate max-w-[150px]">PDF Document Selected</span>
                              <button 
                                type="button" 
                                onClick={() => setFormData({...formData, pdfUrl: ''})}
                                className="ml-auto p-1 text-slate-400 hover:text-red-500 transition"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-10 border-t border-slate-50 grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Strategic Partner</label>
                   <div className="space-y-3">
                   <select 
                     className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold" 
                     value={formData.partnerName || ''} 
                     onChange={e => {
                       const selectedPartner = partners.find(p => p.legalCompanyName === e.target.value);
                       setFormData({
                         ...formData, 
                         partnerName: e.target.value,
                         partnerLogoUrl: selectedPartner?.logo || ''
                       });
                     }}
                   >
                     <option value="">Select Partner</option>
                     {partners.map(p => (
                       <option key={p.id} value={p.legalCompanyName}>{p.legalCompanyName}</option>
                     ))}
                   </select>
                     <div className="flex gap-2">
                        <div className="bg-slate-100 p-4 rounded-2xl text-slate-400"><FileText className="w-5 h-5" /></div>
                        <div className="flex-grow flex gap-2">
                          <input type="text" placeholder="Partner Details PDF URL" className="flex-grow px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-xs focus:border-emerald-500 transition" value={formData.partnerDetailsUrl || ''} onChange={e => setFormData({...formData, partnerDetailsUrl: e.target.value})} />
                          <input 
                            type="file" 
                            ref={partnerPdfInputRef} 
                            className="hidden" 
                            accept=".pdf" 
                            onChange={(e) => handleFileUpload(e, 'partnerDetailsUrl')} 
                          />
                          <button 
                            type="button" 
                            onClick={() => partnerPdfInputRef.current?.click()} 
                            className="px-4 bg-slate-100 rounded-2xl text-[10px] font-black uppercase hover:bg-slate-200 transition"
                          >
                            Upload PDF
                          </button>
                        </div>
                     </div>
                     {formData.partnerDetailsUrl && (
                        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-2xl">
                          <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600">
                            <FileText className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-bold truncate">Partner Details PDF Attached</span>
                          <button 
                            type="button" 
                            onClick={() => setFormData({...formData, partnerDetailsUrl: ''})}
                            className="ml-auto p-1 text-slate-400 hover:text-red-500 transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Holding Period</label>
                   <div className="flex gap-2">
                     <input type="text" placeholder="e.g. 5-7 Years" className="flex-grow px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold" value={formData.holdingPeriod || ''} onChange={e => setFormData({...formData, holdingPeriod: e.target.value})} />
                     <select 
                       className="px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-[10px] font-black uppercase tracking-widest"
                       onChange={(e) => setFormData({...formData, holdingPeriod: e.target.value})}
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
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payout Cadence</label>
                   <input type="text" placeholder="e.g. Quarterly" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold" value={formData.payoutFrequency || ''} onChange={e => setFormData({...formData, payoutFrequency: e.target.value})} />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expected ROI</label>
                   <input type="text" placeholder="e.g. 12-15%" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold" value={formData.expectedROI || ''} onChange={e => setFormData({...formData, expectedROI: e.target.value})} />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expected IRR</label>
                   <input type="text" placeholder="e.g. 10.5%" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold" value={formData.expectedIRR || ''} onChange={e => setFormData({...formData, expectedIRR: e.target.value})} />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</label>
                   <input type="text" placeholder="e.g. London, UK" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold" value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Listing Date</label>
                   <input 
                     type="date" 
                     className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold" 
                     value={formData.publishedAt || ''} 
                     onChange={e => setFormData({...formData, publishedAt: e.target.value})} 
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Class</label>
                   <input type="text" placeholder="e.g. Residential" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold" value={formData.assetClass || ''} onChange={e => setFormData({...formData, assetClass: e.target.value})} />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tax Benefits</label>
                   <input type="text" placeholder="e.g. 100% Depreciation" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold" value={formData.taxBenefits || ''} onChange={e => setFormData({...formData, taxBenefits: e.target.value})} />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Return Type</label>
                   <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold" value={formData.returnType || ''} onChange={e => setFormData({...formData, returnType: e.target.value as ReturnType})}>
                      {Object.values(ReturnType).map(v => <option key={v} value={v}>{v}</option>)}
                   </select>
                </div>
                {(formData.returnType === ReturnType.MONTHLY_RENT || formData.returnType === ReturnType.YEARLY_RENT) && (
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {formData.returnType === ReturnType.MONTHLY_RENT ? 'Monthly Rent Amount ($)' : 'Yearly Rent Amount ($)'}
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="number" 
                          placeholder={formData.returnType === ReturnType.MONTHLY_RENT ? "Monthly Rent" : "Yearly Rent"} 
                          className="w-full pl-10 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold focus:border-emerald-500 transition" 
                          value={formData.rentAmount ?? ''} 
                          onChange={e => setFormData({...formData, rentAmount: e.target.value === '' ? undefined : Number(e.target.value)})} 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Rent (%)
                      </label>
                      <div className="relative">
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                        <input 
                          type="number" 
                          step="0.01"
                          placeholder="Rent (%)" 
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold focus:border-emerald-500 transition" 
                          value={formData.rentPercentage ?? ''} 
                          onChange={e => setFormData({...formData, rentPercentage: e.target.value === '' ? undefined : Number(e.target.value)})} 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {formData.returnType === ReturnType.DIVIDEND && (
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Dividend Amount ($)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="number" 
                          placeholder="Dividend Amount" 
                          className="w-full pl-10 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold focus:border-emerald-500 transition" 
                          value={formData.dividendAmount ?? ''} 
                          onChange={e => setFormData({...formData, dividendAmount: e.target.value === '' ? undefined : Number(e.target.value)})} 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Dividend Yield (%)
                      </label>
                      <div className="relative">
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                        <input 
                          type="number" 
                          step="0.01"
                          placeholder="Dividend Yield" 
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold focus:border-emerald-500 transition" 
                          value={formData.dividendPercentage ?? ''} 
                          onChange={e => setFormData({...formData, dividendPercentage: e.target.value === '' ? undefined : Number(e.target.value)})} 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {formData.returnType === ReturnType.ROI && (
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        ROI Amount ($)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="number" 
                          placeholder="ROI Amount" 
                          className="w-full pl-10 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold focus:border-emerald-500 transition" 
                          value={formData.roiAmount ?? ''} 
                          onChange={e => setFormData({...formData, roiAmount: e.target.value === '' ? undefined : Number(e.target.value)})} 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        ROI Percentage (%)
                      </label>
                      <div className="relative">
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                        <input 
                          type="number" 
                          step="0.01"
                          placeholder="ROI Percentage" 
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold focus:border-emerald-500 transition" 
                          value={formData.roiPercentage ?? ''} 
                          onChange={e => setFormData({...formData, roiPercentage: e.target.value === '' ? undefined : Number(e.target.value)})} 
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Advanced Asset Intelligence */}
              <div className="pt-10 border-t border-slate-50 space-y-10">
                <div className="grid md:grid-cols-3 gap-10">
                  {/* Key Metrics */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 border-b border-slate-50 pb-2">
                       <TrendingUp className="w-4 h-4 text-emerald-600" />
                       <h4 className="text-xs font-black uppercase tracking-widest">Key Metrics</h4>
                    </div>
                    <div className="space-y-3">
                      {formData.kpis?.map((kpi, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input type="text" placeholder="Label" className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none" value={kpi.label} onChange={e => {
                            const newKpis = [...(formData.kpis || [])];
                            newKpis[idx].label = e.target.value;
                            setFormData({...formData, kpis: newKpis});
                          }} />
                          <input type="text" placeholder="Value" className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none" value={kpi.value} onChange={e => {
                            const newKpis = [...(formData.kpis || [])];
                            newKpis[idx].value = e.target.value;
                            setFormData({...formData, kpis: newKpis});
                          }} />
                        </div>
                      ))}
                      <button type="button" onClick={() => setFormData({...formData, kpis: [...(formData.kpis || []), { label: '', value: '' }]})} className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition">+ Add Metric</button>
                    </div>
                  </div>

                  {/* Project Milestones */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 border-b border-slate-50 pb-2">
                       <Clock className="w-4 h-4 text-blue-600" />
                       <h4 className="text-xs font-black uppercase tracking-widest">Project Milestones</h4>
                    </div>
                    <div className="space-y-3">
                      {formData.milestones?.map((m, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input type="text" placeholder="Date" className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none" value={m.date} onChange={e => {
                            const newM = [...(formData.milestones || [])];
                            newM[idx].date = e.target.value;
                            setFormData({...formData, milestones: newM});
                          }} />
                          <input type="text" placeholder="Label" className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none" value={m.label} onChange={e => {
                            const newM = [...(formData.milestones || [])];
                            newM[idx].label = e.target.value;
                            setFormData({...formData, milestones: newM});
                          }} />
                        </div>
                      ))}
                      <button type="button" onClick={() => setFormData({...formData, milestones: [...(formData.milestones || []), { date: '', label: '', completed: false }]})} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition">+ Add Milestone</button>
                    </div>
                  </div>

                  {/* Lead Management */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                       <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-purple-600" />
                        <h4 className="text-xs font-black uppercase tracking-widest">Lead Management</h4>
                       </div>
                       <div className="flex items-center gap-2">
                         <input 
                           type="file" 
                           ref={leadImageInputRef} 
                           className="hidden" 
                           accept="image/*" 
                           onChange={(e) => handleFileUpload(e, 'leadImageUrl')} 
                         />
                         <button 
                           type="button" 
                           onClick={() => leadImageInputRef.current?.click()}
                           className="text-[10px] font-black text-purple-600 uppercase tracking-widest hover:text-purple-700 transition flex items-center gap-1"
                         >
                           <Upload className="w-3 h-3" /> Section Image
                         </button>
                       </div>
                    </div>

                    {formData.leadImageUrl && (
                      <div className="relative w-full h-32 rounded-2xl overflow-hidden border border-slate-200 group mb-4">
                        <img src={formData.leadImageUrl} alt="Lead Section" className="w-full h-full object-cover" />
                        <button 
                          type="button" 
                          onClick={() => setFormData({...formData, leadImageUrl: ''})}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    <div className="space-y-3">
                      <input 
                        type="file" 
                        ref={teamMemberInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleTeamMemberFileUpload} 
                      />
                      {formData.team?.map((t, idx) => (
                        <div key={idx} className="space-y-2 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                          <div className="flex gap-3 items-center">
                            <div className="relative group">
                              <img src={t.image} className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover" alt="" />
                              <button 
                                type="button"
                                onClick={() => { setActiveTeamIdx(idx); teamMemberInputRef.current?.click(); }}
                                className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                              >
                                <Upload className="w-4 h-4 text-white" />
                              </button>
                            </div>
                            <div className="flex-grow grid grid-cols-2 gap-2">
                              <input type="text" placeholder="Name" className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-purple-500 transition" value={t.name} onChange={e => {
                                const newT = [...(formData.team || [])];
                                newT[idx].name = e.target.value;
                                setFormData({...formData, team: newT});
                              }} />
                              <input type="text" placeholder="Role" className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-purple-500 transition" value={t.role} onChange={e => {
                                const newT = [...(formData.team || [])];
                                newT[idx].role = e.target.value;
                                setFormData({...formData, team: newT});
                              }} />
                            </div>
                            <button 
                              type="button" 
                              onClick={() => {
                                const newT = formData.team?.filter((_, i) => i !== idx);
                                setFormData({...formData, team: newT});
                              }}
                              className="p-2 text-slate-300 hover:text-rose-500 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button type="button" onClick={() => setFormData({...formData, team: [...(formData.team || []), { name: '', role: '', avatar: 'https://i.pravatar.cc/150' }]})} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-purple-300 hover:text-purple-600 transition flex items-center justify-center gap-2">
                        <PlusCircle className="w-4 h-4" /> Add Team Member
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 flex gap-4">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-5 border border-slate-200 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition">Discard Draft</button>
                <button type="submit" className="flex-[2] py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-emerald-600 transition shadow-2xl flex items-center justify-center gap-2">
                  <Globe className="w-5 h-5" /> {editingOpp ? 'Deploy Updates' : 'Publish to Marketplace'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Invest Modal (Admin) */}
      {showQuickInvestModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 sm:p-10">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold serif">Record Investment</h2>
                  <p className="text-xs text-slate-400 mt-1">Manually record an allocation for an investor</p>
                </div>
                <button onClick={() => setShowQuickInvestModal(false)} className="p-3 bg-slate-50 rounded-full text-slate-400 hover:text-rose-500 transition">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleQuickInvest} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Investor</label>
                  <div className="px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900">
                    {investors.find(i => i.id === quickInvestData.investorId)?.name || 'Unknown'}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Select Asset</label>
                  <select 
                    required
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                    value={quickInvestData.opportunityId || ''}
                    onChange={(e) => setQuickInvestData({ ...quickInvestData, opportunityId: e.target.value })}
                  >
                    <option value="">Choose an asset...</option>
                    {opportunities.map(opp => (
                      <option key={opp.id} value={opp.id}>{opp.title} (${(opp.minInvestment ?? 0).toLocaleString()} min)</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Investment Amount ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="number" 
                      required
                      min={opportunities.find(o => o.id === quickInvestData.opportunityId)?.minInvestment || 1}
                      className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-lg font-black outline-none focus:ring-2 focus:ring-emerald-500/20"
                      value={quickInvestData.amount || ''}
                      onChange={(e) => {
                        setQuickInvestData({ ...quickInvestData, amount: Number(e.target.value) });
                        setQuickInvestError(null);
                      }}
                    />
                  </div>
                  {quickInvestError && <p className="text-[10px] text-rose-500 font-bold mt-1 animate-pulse">{quickInvestError}</p>}
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-emerald-600 transition shadow-lg flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" /> Record Allocation
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* INVESTOR ADD/EDIT MODAL */}
      {showInvestorModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl overflow-hidden my-8"
          >
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <div>
                <h3 className="text-2xl font-black serif text-slate-900">{editingInvestor ? 'Edit Investor Profile' : 'Register New Investor'}</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Investor CRM System</p>
              </div>
              <button onClick={() => setShowInvestorModal(false)} className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-rose-600 transition shadow-sm">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveInvestorAction} className="p-10 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {editingInvestor && (
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Unique Investor Identifier</p>
                    <p className="text-lg font-mono font-bold text-slate-900">{investorFormData.investorUniqueId}</p>
                  </div>
                  <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Non-Editable System ID
                  </div>
                </div>
              )}

              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Julian Vance" 
                      className="w-full pl-14 pr-5 py-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold focus:border-emerald-500 transition" 
                      value={investorFormData.name || ''} 
                      onChange={e => setInvestorFormData({...investorFormData, name: e.target.value})} 
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input 
                      type="email" 
                      required
                      placeholder="vance@example.com" 
                      className="w-full pl-14 pr-5 py-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold focus:border-emerald-500 transition" 
                      value={investorFormData.email || ''} 
                      onChange={e => setInvestorFormData({...investorFormData, email: e.target.value})} 
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Password</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      className="w-full pl-14 pr-5 py-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold focus:border-emerald-500 transition" 
                      value={investorFormData.password || ''} 
                      onChange={e => setInvestorFormData({...investorFormData, password: e.target.value})} 
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input 
                      type="text" 
                      placeholder="+1 (555) 000-0000" 
                      className="w-full pl-14 pr-5 py-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold focus:border-emerald-500 transition" 
                      value={investorFormData.phone || ''} 
                      onChange={e => setInvestorFormData({...investorFormData, phone: e.target.value})} 
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Risk Profile</label>
                  <select 
                    className="w-full px-5 py-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold focus:border-emerald-500 transition appearance-none"
                    value={investorFormData.riskProfile || 'Balanced'}
                    onChange={e => setInvestorFormData({...investorFormData, riskProfile: e.target.value as any})}
                  >
                    <option value="Conservative">Conservative</option>
                    <option value="Balanced">Balanced</option>
                    <option value="Aggressive">Aggressive</option>
                  </select>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-6 pt-6 border-t border-slate-50">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Residential Address
                </h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <input 
                      type="text" 
                      placeholder="Street Address" 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold" 
                      value={investorFormData.address.street || ''} 
                      onChange={e => setInvestorFormData({...investorFormData, address: {...investorFormData.address, street: e.target.value}})} 
                    />
                  </div>
                  <input 
                    type="text" 
                    placeholder="City" 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold" 
                    value={investorFormData.address.city || ''} 
                    onChange={e => setInvestorFormData({...investorFormData, address: {...investorFormData.address, city: e.target.value}})} 
                  />
                  <input 
                    type="text" 
                    placeholder="Pincode" 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold" 
                    value={investorFormData.address.pincode || ''} 
                    onChange={e => setInvestorFormData({...investorFormData, address: {...investorFormData.address, pincode: e.target.value}})} 
                  />
                  <input 
                    type="text" 
                    placeholder="State / Province" 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold" 
                    value={investorFormData.address.state || ''} 
                    onChange={e => setInvestorFormData({...investorFormData, address: {...investorFormData.address, state: e.target.value}})} 
                  />
                  <input 
                    type="text" 
                    placeholder="Country" 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold" 
                    value={investorFormData.address.country || ''} 
                    onChange={e => setInvestorFormData({...investorFormData, address: {...investorFormData.address, country: e.target.value}})} 
                  />
                </div>
              </div>

              {/* Preferences */}
              <div className="space-y-6 pt-6 border-t border-slate-50">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Investment Preferences
                </h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Target Sectors (Comma separated)</label>
                    <input 
                      type="text" 
                      placeholder="Real Estate, Tech, Green Energy" 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold" 
                      value={investorFormData.preferences.sectors.join(', ') || ''} 
                      onChange={e => setInvestorFormData({...investorFormData, preferences: {...investorFormData.preferences, sectors: e.target.value.split(',').map(s => s.trim())}})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Minimum ROI (%)</label>
                    <input 
                      type="number" 
                      placeholder="10" 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold" 
                      value={investorFormData.preferences.minROI || 0} 
                      onChange={e => setInvestorFormData({...investorFormData, preferences: {...investorFormData.preferences, minROI: Number(e.target.value)}})} 
                    />
                  </div>
                </div>
              </div>

              {/* KYC & Payments */}
              <div className="space-y-6 pt-6 border-t border-slate-50">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <FileText className="w-4 h-4" /> KYC Documents
                    </h4>
                    <div className="space-y-2">
                      {investorFormData.kycDocuments.map((doc, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input 
                            type="text" 
                            className="flex-grow px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs" 
                            value={doc} 
                            onChange={e => {
                              const newDocs = [...investorFormData.kycDocuments];
                              newDocs[idx] = e.target.value;
                              setInvestorFormData({...investorFormData, kycDocuments: newDocs});
                            }} 
                          />
                          <button type="button" onClick={() => setInvestorFormData({...investorFormData, kycDocuments: investorFormData.kycDocuments.filter((_, i) => i !== idx)})} className="text-rose-500 hover:text-rose-700">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button 
                        type="button" 
                        onClick={() => {
                          const input = document.getElementById('investor-form-doc-upload') as HTMLInputElement;
                          if (input) input.click();
                        }} 
                        className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline"
                      >
                        + Upload Document
                      </button>
                      <input 
                        type="file"
                        id="investor-form-doc-upload"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const url = reader.result as string;
                              setInvestorFormData({
                                ...investorFormData, 
                                kycDocuments: [...investorFormData.kycDocuments, url]
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" /> Payment Methods
                    </h4>
                    <div className="space-y-2">
                      {investorFormData.paymentMethods.map((pm, idx) => (
                        <div key={pm.id} className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Name"
                            className="flex-grow px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs" 
                            value={pm.name} 
                            onChange={e => {
                              const newPMs = [...investorFormData.paymentMethods];
                              newPMs[idx].name = e.target.value;
                              setInvestorFormData({...investorFormData, paymentMethods: newPMs});
                            }} 
                          />
                          <button type="button" onClick={() => setInvestorFormData({...investorFormData, paymentMethods: investorFormData.paymentMethods.filter((_, i) => i !== idx)})} className="text-rose-500 hover:text-rose-700">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button type="button" onClick={() => setInvestorFormData({...investorFormData, paymentMethods: [...investorFormData.paymentMethods, { id: Math.random().toString(36).substr(2, 9), name: '', type: 'Bank Transfer', isLinked: true }]})} className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">+ Add Payment Method</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 flex gap-4">
                <button type="button" onClick={() => setShowInvestorModal(false)} className="flex-1 py-5 border border-slate-200 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition">Cancel</button>
                <button type="submit" className="flex-[2] py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-emerald-600 transition shadow-2xl">
                  {editingInvestor ? 'Update Profile' : 'Create Investor Profile'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* INVESTOR DETAIL MODAL */}
      {showInvestorDetail && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[110] flex items-center justify-center p-4 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3rem] shadow-2xl w-full max-w-6xl overflow-hidden my-8"
          >
            {/* Header */}
            <div className="p-10 bg-slate-900 text-white flex justify-between items-start">
              <div className="flex gap-8 items-center">
                <img src={showInvestorDetail.avatar} className="w-24 h-24 rounded-full border-4 border-white/10 shadow-2xl" alt="" />
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-4xl font-black serif">{showInvestorDetail.name}</h2>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      showInvestorDetail.kycStatus === 'Verified' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {showInvestorDetail.kycStatus}
                    </span>
                  </div>
                  <div className="flex gap-6 text-slate-400 text-sm font-medium">
                    <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> {showInvestorDetail.email}</span>
                    <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> {showInvestorDetail.phone}</span>
                    <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> {showInvestorDetail.riskProfile} Profile</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setShowInvestorDetail(null)} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white transition">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid lg:grid-cols-3 divide-x divide-slate-100">
              {/* Left Column: Summary & KYC */}
              <div className="p-10 space-y-10">
                <section>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Financial Summary</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-5 rounded-3xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total Invested</p>
                      <p className="text-xl font-black text-slate-900">${(showInvestorDetail.totalInvested ?? 0).toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-3xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total Returns</p>
                      <p className="text-xl font-black text-emerald-600">${(showInvestorDetail.totalReturns ?? 0).toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-3xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Active Assets</p>
                      <p className="text-xl font-black text-blue-600">{showInvestorDetail.activeAssets}</p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-3xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Joined Date</p>
                      <p className="text-sm font-bold text-slate-900">{showInvestorDetail.joinedDate}</p>
                    </div>
                  </div>
                </section>

                <section>
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">KYC Documents</h4>
                    <button 
                      onClick={() => {
                        const input = document.getElementById('admin-kyc-upload') as HTMLInputElement;
                        if (input) input.click();
                      }}
                      className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline"
                    >
                      + Upload
                    </button>
                    <input 
                      type="file"
                      id="admin-kyc-upload"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && showInvestorDetail) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const url = reader.result as string;
                            const updated = { ...showInvestorDetail, kycDocuments: [...showInvestorDetail.kycDocuments, url] };
                            onSaveInvestor?.(updated);
                            setShowInvestorDetail(updated);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                  <div className="space-y-3">
                    {showInvestorDetail.kycDocuments.length > 0 ? showInvestorDetail.kycDocuments.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-emerald-500 transition group shadow-sm">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-slate-400 group-hover:text-emerald-600" />
                          <span className="text-xs font-bold text-slate-600">Document_{idx + 1}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => {
                              if (showInvestorDetail) {
                                const updated = { ...showInvestorDetail, kycDocuments: showInvestorDetail.kycDocuments.filter((_, i) => i !== idx) };
                                onSaveInvestor?.(updated);
                                setShowInvestorDetail(updated);
                              }
                            }}
                            className="p-2 text-slate-400 hover:text-rose-600 transition"
                            title="Delete Document"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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
                    )) : (
                      <div className="p-8 border-2 border-dashed border-slate-100 rounded-3xl text-center">
                        <AlertCircle className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                        <p className="text-xs font-bold text-slate-400">No documents uploaded</p>
                      </div>
                    )}
                  </div>
                </section>

                <section>
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Methods</h4>
                    <button 
                      onClick={() => {
                        const name = prompt('Enter bank/provider name:');
                        const type = prompt('Enter type (Bank Transfer, UPI, Card, Crypto):') as any;
                        if (name && type && showInvestorDetail) {
                          const newPM = {
                            id: Math.random().toString(36).substr(2, 9),
                            name,
                            type,
                            isLinked: true
                          };
                          const updated = { ...showInvestorDetail, paymentMethods: [...showInvestorDetail.paymentMethods, newPM] };
                          onSaveInvestor?.(updated);
                          setShowInvestorDetail(updated);
                        }
                      }}
                      className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline"
                    >
                      + Link Method
                    </button>
                  </div>
                  <div className="space-y-3">
                    {showInvestorDetail.paymentMethods.map((pm) => (
                      <div key={pm.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-5 h-5 text-slate-400" />
                          <div>
                            <p className="text-xs font-bold text-slate-900">{pm.name}</p>
                            <p className="text-[10px] text-slate-400">{pm.type} {pm.lastFour && `•••• ${pm.lastFour}`}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => {
                              if (showInvestorDetail) {
                                const updated = { ...showInvestorDetail, paymentMethods: showInvestorDetail.paymentMethods.filter(p => p.id !== pm.id) };
                                onSaveInvestor?.(updated);
                                setShowInvestorDetail(updated);
                              }
                            }}
                            className="p-2 text-slate-400 hover:text-rose-600 transition"
                            title="Remove Method"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          {pm.isLinked && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Middle Column: Transactions & Returns */}
              <div className="p-10 lg:col-span-2 space-y-10 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {/* Sub-tabs for Investor Detail */}
                <div className="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 sticky top-0 z-10">
                  {(['Overview', 'Investments', 'Transactions', 'Returns', 'Withdrawals', 'Rent', 'ROI', 'Dividend'] as const).map((tab) => (
                    <button 
                      key={tab} 
                      onClick={() => setInvestorDetailTab(tab)}
                      className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition ${
                        investorDetailTab === tab ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {(investorDetailTab === 'Overview' || investorDetailTab === 'Investments') && (
                  <section>
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Portfolio</h4>
                      <button 
                        onClick={() => {
                          setQuickInvestData({ ...quickInvestData, investorId: showInvestorDetail.id });
                          setShowQuickInvestModal(true);
                        }}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition shadow-sm"
                      >
                        + Record Investment
                      </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      {userInvestments.filter(inv => inv.investorId === showInvestorDetail.id).map((inv, index) => (
                        <div key={`${inv.id}-${index}`} className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm flex justify-between items-center">
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{inv.type} • #{inv.id.slice(0, 8)}</p>
                            <h5 className="text-sm font-bold text-slate-900">{inv.opportunityTitle}</h5>
                            <p className="text-[10px] text-emerald-600 font-bold">${(inv.amount ?? 0).toLocaleString()} • {inv.status}</p>
                          </div>
                          <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                            <Briefcase className="w-4 h-4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {(investorDetailTab === 'Overview' || investorDetailTab === 'Transactions') && (
                  <section>
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction History</h4>
                      <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View All</button>
                    </div>
                    <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {paymentHistory.filter(tx => tx.investorId === showInvestorDetail.id).slice(0, 10).map((tx) => (
                            <tr key={tx.id} className="text-xs font-bold">
                              <td className="px-6 py-4 text-slate-400 font-mono">#{tx.id.slice(0, 8)}</td>
                              <td className="px-6 py-4 text-slate-600">{tx.date}</td>
                              <td className="px-6 py-4 text-slate-900">${(tx.amount ?? 0).toLocaleString()}</td>
                              <td className="px-6 py-4">
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[9px] uppercase">{tx.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}

                {(investorDetailTab === 'Overview' || investorDetailTab === 'Returns') && (
                  <section>
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Returns & Payouts</h4>
                      <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">Download Report</button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      {returns.filter(r => r.investorId === showInvestorDetail.id).map((r) => (
                        <div key={r.id} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm flex justify-between items-center group hover:border-emerald-500 transition">
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{r.type} • #{r.id.slice(0, 8)}</p>
                            <h5 className="text-lg font-black text-slate-900">${(r.amount ?? 0).toLocaleString()}</h5>
                            <p className="text-[10px] text-slate-400 font-bold">{r.date}</p>
                          </div>
                          <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition">
                            <ArrowUpRight className="w-5 h-5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {investorDetailTab === 'Withdrawals' && (
                  <section>
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Withdrawal History</h4>
                    </div>
                    <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Asset</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {withdrawals.filter(w => w.investorId === showInvestorDetail.id).map((w) => (
                            <tr key={w.id} className="text-xs font-bold">
                              <td className="px-6 py-4 text-slate-400 font-mono">#{w.id.slice(0, 8)}</td>
                              <td className="px-6 py-4 text-slate-600">{w.opportunityTitle}</td>
                              <td className="px-6 py-4 text-slate-600">{new Date(w.date).toLocaleDateString()}</td>
                              <td className="px-6 py-4 text-slate-900">${(w.withdrawalAmount ?? 0).toLocaleString()}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-0.5 rounded text-[9px] uppercase ${
                                  w.status === 'Complete' ? 'bg-emerald-100 text-emerald-700' : 
                                  w.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                                }`}>{w.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}

                {investorDetailTab === 'Rent' && (
                  <section>
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rent Records</h4>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      {userInvestments.filter(inv => inv.investorId === showInvestorDetail.id && (inv.returnType === ReturnType.MONTHLY_RENT || inv.returnType === ReturnType.YEARLY_RENT || (inv.rentAmount && inv.rentAmount > 0))).map((inv, index) => (
                        <div key={`${inv.id}-${index}`} className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm flex justify-between items-center">
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{inv.returnType} • #{inv.id.slice(0, 8)}</p>
                            <h5 className="text-sm font-bold text-slate-900">{inv.opportunityTitle}</h5>
                            <p className="text-[10px] text-emerald-600 font-bold">Rent: ${(inv.rentAmount ?? 0).toLocaleString()} • {inv.payoutCadence}</p>
                          </div>
                          <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                            <Home className="w-4 h-4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {investorDetailTab === 'ROI' && (
                  <section>
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ROI Records</h4>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      {userInvestments.filter(inv => inv.investorId === showInvestorDetail.id && inv.returnType === ReturnType.ROI).map((inv, index) => {
                        const opp = opportunities.find(o => o.id === inv.opportunityId);
                        const roiAmount = opp?.roiAmount || (opp?.roiPercentage ? (inv.amount * opp.roiPercentage / 100) : 0);
                        return (
                          <div key={`${inv.id}-${index}`} className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm flex justify-between items-center">
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ROI • #{inv.id.slice(0, 8)}</p>
                              <h5 className="text-sm font-bold text-slate-900">{inv.opportunityTitle}</h5>
                              <p className="text-[10px] text-blue-600 font-bold">ROI: ${(roiAmount ?? 0).toLocaleString()} • {inv.payoutCadence}</p>
                            </div>
                            <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                              <TrendingUp className="w-4 h-4" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

                {investorDetailTab === 'Dividend' && (
                  <section>
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dividend Records</h4>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      {userInvestments.filter(inv => inv.investorId === showInvestorDetail.id && inv.returnType === ReturnType.DIVIDEND).map((inv, index) => {
                        const opp = opportunities.find(o => o.id === inv.opportunityId);
                        const dividendAmount = opp?.dividendAmount || (opp?.dividendPercentage ? (inv.amount * opp.dividendPercentage / 100) : 0);
                        return (
                          <div key={`${inv.id}-${index}`} className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm flex justify-between items-center">
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Dividend • #{inv.id.slice(0, 8)}</p>
                              <h5 className="text-sm font-bold text-slate-900">{inv.opportunityTitle}</h5>
                              <p className="text-[10px] text-amber-600 font-bold">Dividend: ${(dividendAmount ?? 0).toLocaleString()} • {inv.payoutCadence}</p>
                            </div>
                            <div className="w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
                              <PieChart className="w-4 h-4" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

                {investorDetailTab === 'Overview' && (
                  <section>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Investment Preferences</h4>
                    <div className="bg-slate-50 p-8 rounded-[2rem] flex flex-wrap gap-10">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-3">Preferred Sectors</p>
                        <div className="flex flex-wrap gap-2">
                          {showInvestorDetail.preferences.sectors.map((s, index) => (
                            <span key={`${s}-${index}`} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-600">{s}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-3">Min ROI Target</p>
                        <p className="text-2xl font-black text-slate-900">{showInvestorDetail.preferences.minROI}% <span className="text-xs text-slate-400 font-bold">Annualized</span></p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-3">Full Address</p>
                        <p className="text-xs font-bold text-slate-600 leading-relaxed max-w-[200px]">
                          {showInvestorDetail.address.street},<br />
                          {showInvestorDetail.address.city}, {showInvestorDetail.address.state},<br />
                          {showInvestorDetail.address.country}
                        </p>
                      </div>
                    </div>
                  </section>
                )}
              </div>
            </div>

            <div className="p-10 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-4">
              <button 
                onClick={() => { 
                  if (showInvestorDetail) {
                    setNotificationFormData({ ...notificationFormData, investorId: showInvestorDetail.id }); 
                    setActiveTab('notifications'); 
                    setShowInvestorDetail(null); 
                  }
                }} 
                className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-sm font-black hover:bg-emerald-600 transition shadow-xl flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> Send Message
              </button>
              <button onClick={() => { setEditingInvestor(showInvestorDetail); setInvestorFormData(showInvestorDetail); setShowInvestorModal(true); setShowInvestorDetail(null); setInvestorDetailTab('Overview'); }} className="px-8 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition shadow-sm flex items-center gap-2">
                <Edit3 className="w-4 h-4" /> Edit Profile
              </button>
              <button onClick={() => setShowInvestorDetail(null)} className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition shadow-lg">
                Close Profile
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* KYC Reminder Modal */}
      {showReminderModal && reminderTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100"
          >
            <div className="p-10 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 serif">Send KYC Reminder</h3>
                <p className="text-slate-500 text-xs mt-1">Directly notify <span className="text-slate-900 font-bold">{reminderTarget.name}</span> via platform and email.</p>
              </div>
              <button 
                onClick={() => setShowReminderModal(false)}
                className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-100 transition shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-10 space-y-8">
              <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <img src={reminderTarget.avatar} className="w-12 h-12 rounded-2xl object-cover" alt="" />
                <div>
                  <p className="text-sm font-bold text-slate-900">{reminderTarget.name}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{reminderTarget.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Custom Message</label>
                <textarea 
                  value={reminderMessage}
                  onChange={(e) => setReminderMessage(e.target.value)}
                  placeholder="Enter your reminder message here..."
                  className="w-full h-40 p-6 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none"
                />
              </div>

              <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex items-start gap-4">
                <Mail className="w-5 h-5 text-amber-600 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-amber-900 uppercase tracking-widest">Email Simulation</p>
                  <p className="text-[10px] text-amber-700 leading-relaxed font-medium">This message will be sent to the investor's registered email address and appear in their dashboard notifications.</p>
                </div>
              </div>
            </div>

            <div className="p-10 bg-slate-50/50 border-t border-slate-100 flex gap-4">
              <button 
                onClick={() => setShowReminderModal(false)}
                className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  onSendKYCMessage(reminderTarget.id, 'Reminder', reminderMessage);
                  setShowReminderModal(false);
                  alert(`Reminder sent to ${reminderTarget.email} and platform dashboard.`);
                }}
                className="flex-1 py-4 bg-amber-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-amber-700 transition shadow-lg shadow-amber-200 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Send Message
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* KYC Rejection Modal */}
      {showRejectionModal && rejectionTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100"
          >
            <div className="p-10 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 serif">Reject KYC Application</h3>
                <p className="text-slate-500 text-xs mt-1">Provide a reason for rejecting <span className="text-slate-900 font-bold">{rejectionTarget.name}</span>'s KYC.</p>
              </div>
              <button 
                onClick={() => setShowRejectionModal(false)}
                className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-100 transition shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-10 space-y-8">
              <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <img src={rejectionTarget.avatar} className="w-12 h-12 rounded-2xl object-cover" alt="" />
                <div>
                  <p className="text-sm font-bold text-slate-900">{rejectionTarget.name}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{rejectionTarget.email}</p>
                </div>
              </div>

              <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100 flex items-start gap-4">
                <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-rose-900 uppercase tracking-widest">Rejection Notice</p>
                  <p className="text-[10px] text-rose-700 leading-relaxed font-medium">
                    "Your KYC is rejected, Please Re-Uploaded your documents"
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reason for Rejection</label>
                <textarea 
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Documents are blurry, ID expired, etc."
                  className="w-full h-32 p-6 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all resize-none"
                />
              </div>
            </div>

            <div className="p-10 bg-slate-50/50 border-t border-slate-100 flex gap-4">
              <button 
                onClick={() => setShowRejectionModal(false)}
                className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (!rejectionReason.trim()) {
                    alert('Please provide a reason for rejection.');
                    return;
                  }
                  onSendKYCMessage(rejectionTarget.id, 'Rejection', rejectionReason);
                  setShowRejectionModal(false);
                }}
                className="flex-1 py-4 bg-rose-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-rose-700 transition shadow-lg shadow-rose-200 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Confirm Rejection
              </button>
            </div>
          </motion.div>
        </div>
      )}
      {showTestimonialModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 serif">
                  {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
                </h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                  {testimonialFormData.type === TestimonialType.VIDEO ? 'Video Testimonial' : 'Success Story'}
                </p>
              </div>
              <button 
                onClick={() => setShowTestimonialModal(false)}
                className="p-2 hover:bg-slate-100 rounded-xl transition"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="p-8">
              <form className="space-y-8" onSubmit={(e) => {
                e.preventDefault();
                onSaveTestimonial({
                  ...testimonialFormData,
                  id: editingTestimonial?.id || Math.random().toString(36).substr(2, 9)
                });
                setShowTestimonialModal(false);
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Basic Info */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Testimonial Type</label>
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => setTestimonialFormData({ ...testimonialFormData, type: TestimonialType.SUCCESS_STORY })}
                          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            testimonialFormData.type === TestimonialType.SUCCESS_STORY ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-400 border border-slate-100'
                          }`}
                        >
                          Success Story
                        </button>
                        <button
                          type="button"
                          onClick={() => setTestimonialFormData({ ...testimonialFormData, type: TestimonialType.VIDEO })}
                          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            testimonialFormData.type === TestimonialType.VIDEO ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-400 border border-slate-100'
                          }`}
                        >
                          Video Testimonial
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                      <input 
                        type="text"
                        required
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold"
                        value={testimonialFormData.name}
                        onChange={(e) => setTestimonialFormData({ ...testimonialFormData, name: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Role / Occupation</label>
                        <input 
                          type="text"
                          required
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold"
                          value={testimonialFormData.role}
                          onChange={(e) => setTestimonialFormData({ ...testimonialFormData, role: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Company / Location</label>
                        <input 
                          type="text"
                          required
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold"
                          value={testimonialFormData.company}
                          onChange={(e) => setTestimonialFormData({ ...testimonialFormData, company: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Investor Testimonial Text</label>
                      <textarea 
                        required
                        rows={4}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold resize-none"
                        value={testimonialFormData.textTestimonial}
                        onChange={(e) => setTestimonialFormData({ ...testimonialFormData, textTestimonial: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Media & Specific Info */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Profile Photo (Avatar)</label>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-slate-100 overflow-hidden border-2 border-slate-200">
                          {testimonialFormData.avatar ? (
                            <img src={testimonialFormData.avatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <User className="w-8 h-8" />
                            </div>
                          )}
                        </div>
                        <label className="flex-1 cursor-pointer">
                          <div className="px-4 py-3 bg-slate-50 border border-slate-200 border-dashed rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 hover:border-emerald-600 transition flex items-center justify-center gap-2">
                            <Upload className="w-4 h-4" />
                            Upload Photo
                          </div>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => handleTestimonialFileUpload(e, 'avatar')}
                          />
                        </label>
                      </div>
                    </div>

                    {testimonialFormData.type === TestimonialType.SUCCESS_STORY ? (
                      <>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Success Story Image</label>
                          <div className="aspect-video rounded-2xl bg-slate-100 overflow-hidden border-2 border-slate-200 relative group">
                            {testimonialFormData.imageUrl ? (
                              <img src={testimonialFormData.imageUrl} alt="Success Story" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <ImageIcon className="w-12 h-12" />
                              </div>
                            )}
                            <label className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                              <div className="px-4 py-2 bg-white rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-900">
                                Change Image
                              </div>
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={(e) => handleTestimonialFileUpload(e, 'imageUrl')}
                              />
                            </label>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Invested</label>
                            <input 
                              type="text"
                              required
                              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold"
                              value={testimonialFormData.successStory?.assetName}
                              onChange={(e) => setTestimonialFormData({
                                ...testimonialFormData,
                                successStory: { ...testimonialFormData.successStory!, assetName: e.target.value }
                              })}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount Invested</label>
                            <input 
                              type="number"
                              required
                              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold"
                              value={testimonialFormData.successStory?.amount}
                              onChange={(e) => setTestimonialFormData({
                                ...testimonialFormData,
                                successStory: { ...testimonialFormData.successStory!, amount: Number(e.target.value) }
                              })}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Class</label>
                            <input 
                              type="text"
                              required
                              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold"
                              value={testimonialFormData.successStory?.assetClass}
                              onChange={(e) => setTestimonialFormData({
                                ...testimonialFormData,
                                successStory: { ...testimonialFormData.successStory!, assetClass: e.target.value }
                              })}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Holding Period</label>
                            <input 
                              type="text"
                              required
                              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold"
                              value={testimonialFormData.successStory?.holdingPeriod}
                              onChange={(e) => setTestimonialFormData({
                                ...testimonialFormData,
                                successStory: { ...testimonialFormData.successStory!, holdingPeriod: e.target.value }
                              })}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Return Type</label>
                          <select 
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold"
                            value={testimonialFormData.successStory?.returnType}
                            onChange={(e) => setTestimonialFormData({
                              ...testimonialFormData,
                              successStory: { ...testimonialFormData.successStory!, returnType: e.target.value as any }
                            })}
                          >
                            <option value="ROI">ROI (%)</option>
                            <option value="Monthly Rent">Monthly Rent ($)</option>
                            <option value="Yearly Rent">Yearly Rent ($)</option>
                            <option value="Dividend">Dividend ($)</option>
                          </select>
                        </div>

                        {testimonialFormData.successStory?.returnType === 'ROI' && (
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ROI Value (e.g., 12.5%)</label>
                            <input 
                              type="text"
                              required
                              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold"
                              value={testimonialFormData.successStory?.roi}
                              onChange={(e) => setTestimonialFormData({
                                ...testimonialFormData,
                                successStory: { ...testimonialFormData.successStory!, roi: e.target.value }
                              })}
                            />
                          </div>
                        )}

                        {testimonialFormData.successStory?.returnType === 'Monthly Rent' && (
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly Rent Amount ($)</label>
                            <input 
                              type="number"
                              required
                              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold"
                              value={testimonialFormData.successStory?.monthlyReturn}
                              onChange={(e) => setTestimonialFormData({
                                ...testimonialFormData,
                                successStory: { ...testimonialFormData.successStory!, monthlyReturn: Number(e.target.value) }
                              })}
                            />
                          </div>
                        )}

                        {testimonialFormData.successStory?.returnType === 'Yearly Rent' && (
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Yearly Rent Amount ($)</label>
                            <input 
                              type="number"
                              required
                              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold"
                              value={testimonialFormData.successStory?.yearlyRent}
                              onChange={(e) => setTestimonialFormData({
                                ...testimonialFormData,
                                successStory: { ...testimonialFormData.successStory!, yearlyRent: Number(e.target.value) }
                              })}
                            />
                          </div>
                        )}

                        {testimonialFormData.successStory?.returnType === 'Dividend' && (
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dividend Amount ($)</label>
                            <input 
                              type="number"
                              required
                              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold"
                              value={testimonialFormData.successStory?.dividend}
                              onChange={(e) => setTestimonialFormData({
                                ...testimonialFormData,
                                successStory: { ...testimonialFormData.successStory!, dividend: Number(e.target.value) }
                              })}
                            />
                          </div>
                        )}

                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Location</label>
                          <input 
                            type="text"
                            required
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold"
                            value={testimonialFormData.successStory?.location}
                            onChange={(e) => setTestimonialFormData({
                              ...testimonialFormData,
                              successStory: { ...testimonialFormData.successStory!, location: e.target.value }
                            })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Success Story Paragraph (Detailed Description)</label>
                          <textarea 
                            rows={4}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold resize-none"
                            placeholder="Add a detailed paragraph about this success story..."
                            value={testimonialFormData.successStory?.paragraph}
                            onChange={(e) => setTestimonialFormData({
                              ...testimonialFormData,
                              successStory: { ...testimonialFormData.successStory!, paragraph: e.target.value }
                            })}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Video Source</label>
                          <div className="flex gap-4">
                            <button
                              type="button"
                              onClick={() => setTestimonialFormData({ ...testimonialFormData, videoUrl: '' })}
                              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                !testimonialFormData.videoUrl.includes('youtube.com') && !testimonialFormData.videoUrl.includes('youtu.be') ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-400 border border-slate-100'
                              }`}
                            >
                              Upload File
                            </button>
                            <button
                              type="button"
                              onClick={() => setTestimonialFormData({ ...testimonialFormData, videoUrl: 'https://youtube.com/watch?v=' })}
                              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                testimonialFormData.videoUrl.includes('youtube.com') || testimonialFormData.videoUrl.includes('youtu.be') ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-400 border border-slate-100'
                              }`}
                            >
                              YouTube URL
                            </button>
                          </div>
                        </div>

                        {(testimonialFormData.videoUrl.includes('youtube.com') || testimonialFormData.videoUrl.includes('youtu.be')) ? (
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">YouTube Video URL</label>
                            <input 
                              type="url"
                              required
                              placeholder="https://www.youtube.com/watch?v=..."
                              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold"
                              value={testimonialFormData.videoUrl}
                              onChange={(e) => setTestimonialFormData({ ...testimonialFormData, videoUrl: e.target.value })}
                            />
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload Video File</label>
                            <label className="flex flex-col items-center justify-center w-full h-40 bg-slate-50 border-2 border-slate-200 border-dashed rounded-2xl cursor-pointer hover:bg-slate-100 transition group">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Video className="w-10 h-10 text-slate-300 mb-3 group-hover:text-emerald-500 transition-colors" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                  {testimonialFormData.videoUrl ? 'Video Selected' : 'Click to upload video'}
                                </p>
                                {testimonialFormData.videoUrl && (
                                  <p className="text-[8px] text-emerald-600 font-bold mt-2 truncate max-w-[200px]">
                                    {testimonialFormData.videoUrl}
                                  </p>
                                )}
                              </div>
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="video/*"
                                onChange={(e) => handleTestimonialFileUpload(e, 'videoUrl')}
                              />
                            </label>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setShowTestimonialModal(false)}
                    className="flex-1 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-100 transition"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-emerald-600 transition shadow-xl"
                  >
                    {editingTestimonial ? 'Update Testimonial' : 'Save Testimonial'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* FAQ Modal */}
      {showFAQModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 serif">
                  {editingFAQ ? 'Edit FAQ' : 'Add New FAQ'}
                </h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Manage Question & Answer</p>
              </div>
              <button 
                onClick={() => setShowFAQModal(false)}
                className="p-2 hover:bg-slate-100 rounded-xl transition"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <form className="p-8 space-y-6" onSubmit={(e) => {
              e.preventDefault();
              onSaveFAQ({
                ...faqFormData as FAQ,
                id: editingFAQ?.id || Math.random().toString(36).substr(2, 9)
              });
              setShowFAQModal(false);
            }}>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                <select 
                  required
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold"
                  value={faqFormData.categoryId}
                  onChange={(e) => setFaqFormData({ ...faqFormData, categoryId: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {faqCategories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question</label>
                <input 
                  type="text"
                  required
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold"
                  value={faqFormData.question}
                  onChange={(e) => setFaqFormData({ ...faqFormData, question: e.target.value })}
                  placeholder="e.g. What is Grow Milkat?"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Answer</label>
                <textarea 
                  required
                  rows={6}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold resize-none"
                  value={faqFormData.answer}
                  onChange={(e) => setFaqFormData({ ...faqFormData, answer: e.target.value })}
                  placeholder="Provide a detailed answer..."
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setShowFAQModal(false)}
                  className="flex-1 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 transition shadow-xl shadow-emerald-200"
                >
                  {editingFAQ ? 'Update FAQ' : 'Save FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQ Category Modal */}
      {showFAQCategoryModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 serif">
                  {editingFAQCategory ? 'Edit Category' : 'Add Category'}
                </h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">FAQ Grouping</p>
              </div>
              <button 
                onClick={() => setShowFAQCategoryModal(false)}
                className="p-2 hover:bg-slate-100 rounded-xl transition"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <form className="p-8 space-y-6" onSubmit={(e) => {
              e.preventDefault();
              onSaveFAQCategory({
                ...faqCategoryFormData as FAQCategory,
                id: editingFAQCategory?.id || Math.random().toString(36).substr(2, 9)
              });
              setShowFAQCategoryModal(false);
            }}>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category Name</label>
                <input 
                  type="text"
                  required
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold"
                  value={faqCategoryFormData.name}
                  onChange={(e) => setFaqCategoryFormData({ ...faqCategoryFormData, name: e.target.value })}
                  placeholder="e.g. Investment"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Icon</label>
                <select 
                  required
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold"
                  value={faqCategoryFormData.icon}
                  onChange={(e) => setFaqCategoryFormData({ ...faqCategoryFormData, icon: e.target.value })}
                >
                  <option value="HelpCircle">Help Circle</option>
                  <option value="Info">Info</option>
                  <option value="TrendingUp">Trending Up</option>
                  <option value="ShieldCheck">Shield Check</option>
                  <option value="CreditCard">Credit Card</option>
                  <option value="Wallet">Wallet</option>
                </select>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setShowFAQCategoryModal(false)}
                  className="flex-1 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 transition shadow-xl shadow-emerald-200"
                >
                  {editingFAQCategory ? 'Update Category' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Blog Modal */}
      {showBlogModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 serif">
                  {editingBlog ? 'Edit Blog Post' : 'Create New Post'}
                </h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Article Editor & Media Manager</p>
              </div>
              <button 
                onClick={() => setShowBlogModal(false)}
                className="p-2 hover:bg-slate-100 rounded-xl transition"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-8">
              <form id="blog-form" className="space-y-12" onSubmit={(e) => {
                e.preventDefault();
                onSaveBlog({
                  ...blogFormData as BlogPost,
                  id: editingBlog?.id || Math.random().toString(36).substr(2, 9),
                  date: blogFormData.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                });
                setShowBlogModal(false);
              }}>
                {/* Basic Info */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Article Title</label>
                      <input 
                        type="text"
                        required
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold"
                        value={blogFormData.title}
                        onChange={(e) => setBlogFormData({ ...blogFormData, title: e.target.value })}
                        placeholder="e.g. The Future of Fractional Investing"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Excerpt (Short Description)</label>
                      <textarea 
                        required
                        rows={3}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold resize-none"
                        value={blogFormData.excerpt}
                        onChange={(e) => setBlogFormData({ ...blogFormData, excerpt: e.target.value })}
                        placeholder="Brief summary for the blog card..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                        <select 
                          required
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold"
                          value={blogFormData.category}
                          onChange={(e) => setBlogFormData({ ...blogFormData, category: e.target.value as any })}
                        >
                          <option value="Market Trends">Market Trends</option>
                          <option value="Education">Education</option>
                          <option value="Assets Analysis">Assets Analysis</option>
                          <option value="Wealth Management">Wealth Management</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Read Time</label>
                        <input 
                          type="text"
                          required
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold"
                          value={blogFormData.readTime}
                          onChange={(e) => setBlogFormData({ ...blogFormData, readTime: e.target.value })}
                          placeholder="e.g. 5 min read"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Featured Image (1536x864)</label>
                        <label className="flex flex-col items-center justify-center w-full h-32 bg-slate-50 border-2 border-slate-200 border-dashed rounded-2xl cursor-pointer hover:bg-slate-100 transition group overflow-hidden relative">
                          {blogFormData.featuredImageUrl ? (
                            <img src={blogFormData.featuredImageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <ImageIcon className="w-6 h-6 text-slate-300 mb-2 group-hover:text-emerald-500 transition-colors" />
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Featured Image</p>
                            </div>
                          )}
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleBlogFileUpload(e, 'featuredImageUrl')} />
                        </label>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Thumbnail Image</label>
                        <label className="flex flex-col items-center justify-center w-full h-32 bg-slate-50 border-2 border-slate-200 border-dashed rounded-2xl cursor-pointer hover:bg-slate-100 transition group overflow-hidden relative">
                          {blogFormData.imageUrl ? (
                            <img src={blogFormData.imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <ImageIcon className="w-6 h-6 text-slate-300 mb-2 group-hover:text-emerald-500 transition-colors" />
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Thumbnail</p>
                            </div>
                          )}
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleBlogFileUpload(e, 'imageUrl')} />
                        </label>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Author Image</label>
                        <label className="flex flex-col items-center justify-center w-full h-16 bg-slate-50 border-2 border-slate-200 border-dashed rounded-2xl cursor-pointer hover:bg-slate-100 transition group overflow-hidden relative">
                          {blogFormData.authorAvatar ? (
                            <img src={blogFormData.authorAvatar} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <User className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                          )}
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleBlogFileUpload(e, 'authorAvatar')} />
                        </label>
                      </div>
                      <div className="space-y-2 col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Author Name</label>
                        <input 
                          type="text"
                          required
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold"
                          value={blogFormData.author}
                          onChange={(e) => setBlogFormData({ ...blogFormData, author: e.target.value })}
                          placeholder="Author Name"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Author Role</label>
                      <input 
                        type="text"
                        required
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold"
                        value={blogFormData.authorRole}
                        onChange={(e) => setBlogFormData({ ...blogFormData, authorRole: e.target.value })}
                        placeholder="e.g. Chief Strategist"
                      />
                    </div>
                  </div>
                </div>

                {/* Content Blocks */}
                <div className="space-y-8">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h4 className="text-lg font-bold text-slate-900 serif">Article Content</h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { type: 'h1', icon: <Heading1 className="w-4 h-4" />, label: 'H1' },
                        { type: 'h2', icon: <Heading2 className="w-4 h-4" />, label: 'H2' },
                        { type: 'paragraph', icon: <Type className="w-4 h-4" />, label: 'Text' },
                        { type: 'bullets', icon: <List className="w-4 h-4" />, label: 'Bullets' },
                        { type: 'numbers', icon: <ListOrdered className="w-4 h-4" />, label: 'Numbers' },
                        { type: 'image', icon: <ImageIcon className="w-4 h-4" />, label: 'Image' },
                        { type: 'video', icon: <Video className="w-4 h-4" />, label: 'Video' },
                        { type: 'pdf', icon: <FileText className="w-4 h-4" />, label: 'PDF' },
                      ].map((tool) => (
                        <button
                          key={tool.type}
                          type="button"
                          onClick={() => addBlogBlock(tool.type)}
                          className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors"
                        >
                          {tool.icon} {tool.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    {blogFormData.blocks?.map((block, index) => (
                      <motion.div 
                        key={block.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group relative bg-slate-50 rounded-2xl p-6 border border-slate-100"
                      >
                        <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button type="button" onClick={() => moveBlogBlock(block.id, 'up')} className="p-1 hover:text-emerald-600 transition-colors"><ChevronLeft className="w-4 h-4 rotate-90" /></button>
                          <button type="button" onClick={() => moveBlogBlock(block.id, 'down')} className="p-1 hover:text-emerald-600 transition-colors"><ChevronRight className="w-4 h-4 rotate-90" /></button>
                        </div>
                        
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
                            {block.type}
                          </span>
                          <button 
                            type="button"
                            onClick={() => removeBlogBlock(block.id)}
                            className="text-slate-400 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {block.type.startsWith('h') || block.type === 'paragraph' ? (
                          <textarea 
                            rows={block.type === 'paragraph' ? 4 : 1}
                            className="w-full bg-transparent border-none outline-none text-slate-900 font-bold placeholder:text-slate-300 resize-none"
                            value={block.content}
                            onChange={(e) => updateBlogBlock(block.id, e.target.value)}
                            placeholder={`Enter ${block.type} content...`}
                            onPaste={(e) => {
                              if (block.type === 'paragraph') {
                                const text = e.clipboardData.getData('text');
                                // If pasted text looks like a list, we could handle it, 
                                // but for now we just let it paste as pre-wrapped text
                              }
                            }}
                          />
                        ) : (block.type === 'bullets' || block.type === 'numbers') ? (
                          <div className="space-y-2">
                            {block.items?.map((item, idx) => (
                              <div key={idx} className="flex gap-2">
                                <span className="text-slate-400 font-bold mt-2 min-w-[20px]">
                                  {block.type === 'bullets' ? '•' : `${idx + 1}.`}
                                </span>
                                <input 
                                  type="text"
                                  className="flex-grow bg-transparent border-none outline-none text-slate-900 font-bold placeholder:text-slate-300"
                                  value={item}
                                  onChange={(e) => {
                                    const newItems = [...(block.items || [])];
                                    newItems[idx] = e.target.value;
                                    updateBlogBlockItems(block.id, newItems);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      const newItems = [...(block.items || [])];
                                      newItems.splice(idx + 1, 0, '');
                                      updateBlogBlockItems(block.id, newItems);
                                    } else if (e.key === 'Backspace' && item === '' && (block.items?.length || 0) > 1) {
                                      e.preventDefault();
                                      const newItems = block.items?.filter((_, i) => i !== idx) || [];
                                      updateBlogBlockItems(block.id, newItems);
                                    }
                                  }}
                                  onPaste={(e) => {
                                    const text = e.clipboardData.getData('text');
                                    if (text.includes('\n')) {
                                      e.preventDefault();
                                      const lines = text.split('\n').map(l => l.replace(/^(\d+\.|•|-|\*)\s+/, '').trim()).filter(Boolean);
                                      const newItems = [...(block.items || [])];
                                      newItems.splice(idx, 1, ...lines);
                                      updateBlogBlockItems(block.id, newItems);
                                    }
                                  }}
                                  placeholder="List item..."
                                />
                                <button 
                                  type="button"
                                  onClick={() => {
                                    const newItems = block.items?.filter((_, i) => i !== idx) || [];
                                    updateBlogBlockItems(block.id, newItems);
                                  }}
                                  className="text-slate-300 hover:text-rose-500"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                            <button 
                              type="button"
                              onClick={() => updateBlogBlockItems(block.id, [...(block.items || []), ''])}
                              className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline"
                            >
                              + Add Item
                            </button>
                          </div>
                        ) : block.type === 'image' ? (
                          <div className="space-y-4">
                            <label className="flex flex-col items-center justify-center w-full h-48 bg-white border-2 border-slate-200 border-dashed rounded-xl cursor-pointer hover:bg-slate-50 transition group overflow-hidden relative">
                              {block.content ? (
                                <img src={block.content} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <ImageIcon className="w-8 h-8 text-slate-300 mb-2 group-hover:text-emerald-500 transition-colors" />
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload Image</p>
                                </div>
                              )}
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleBlogFileUpload(e, 'content', block.id)} />
                            </label>
                          </div>
                        ) : block.type === 'video' ? (
                          <div className="space-y-4">
                            <input 
                              type="url"
                              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none text-sm font-bold"
                              value={block.content}
                              onChange={(e) => updateBlogBlock(block.id, e.target.value)}
                              placeholder="Enter Video URL (YouTube, Vimeo, etc.)"
                            />
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <label className="flex flex-col items-center justify-center w-full h-32 bg-white border-2 border-slate-200 border-dashed rounded-xl cursor-pointer hover:bg-slate-50 transition group overflow-hidden relative">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <FileText className="w-8 h-8 text-slate-300 mb-2 group-hover:text-emerald-500 transition-colors" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                  {block.content ? 'PDF Selected' : 'Upload PDF Document'}
                                </p>
                              </div>
                              <input type="file" className="hidden" accept="application/pdf" onChange={(e) => handleBlogFileUpload(e, 'content', block.id)} />
                            </label>
                          </div>
                        )}
                      </motion.div>
                    ))}
                    
                    {(!blogFormData.blocks || blogFormData.blocks.length === 0) && (
                      <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-slate-100 border-dashed">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                          <Edit3 className="w-8 h-8" />
                        </div>
                        <p className="text-slate-400 font-bold text-sm">No content blocks added yet. Use the tools above to start writing.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tags (Press Enter to add)</label>
                  <div className="flex flex-wrap gap-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    {blogFormData.tags?.map((tag, index) => (
                      <span key={`${tag}-${index}`} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600">
                        {tag}
                        <button type="button" onClick={() => setBlogFormData({ ...blogFormData, tags: blogFormData.tags?.filter(t => t !== tag) })} className="text-slate-400 hover:text-rose-500">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <input 
                      type="text"
                      className="bg-transparent border-none outline-none text-sm font-bold flex-grow min-w-[150px]"
                      placeholder="Add tag..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = e.currentTarget.value.trim();
                          if (val && !blogFormData.tags?.includes(val)) {
                            setBlogFormData({ ...blogFormData, tags: [...(blogFormData.tags || []), val] });
                            e.currentTarget.value = '';
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="p-8 border-t border-slate-100 flex gap-4 bg-slate-50/50">
              <button 
                type="button"
                onClick={() => setShowBlogModal(false)}
                className="flex-1 py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl font-black text-sm hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="blog-form"
                className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-emerald-600 transition shadow-xl"
              >
                {editingBlog ? 'Update Article' : 'Publish Article'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Preview Modal */}
      {showCertPreview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setShowCertPreview(null)} />
          <div className="relative bg-white rounded-[3rem] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white z-10">
              <div>
                <h3 className="text-xl font-bold serif">Certificate Preview</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                  {showCertPreview.type} Certificate • ID: {showCertPreview.id.toUpperCase()}
                </p>
              </div>
              <button 
                onClick={() => setShowCertPreview(null)}
                className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-12 bg-slate-100/50 flex justify-center">
              <div className="shadow-2xl scale-75 md:scale-90 lg:scale-100 origin-top">
                {showCertPreview.type === 'Investment' ? (
                  (() => {
                    const inv = userInvestments.find(i => i.id === showCertPreview.id);
                    const investor = investors.find(i => i.id === inv?.investorId);
                    const opportunity = opportunities.find(opp => opp.id === inv?.opportunityId);
                    
                    if (!inv || !investor || !opportunity) {
                      return (
                        <div className="bg-white p-12 rounded-3xl shadow-xl text-center">
                          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                          <h4 className="text-lg font-bold text-slate-900">Certificate Data Missing</h4>
                          <p className="text-slate-500 mt-2">We couldn't find all the necessary data to display this certificate.</p>
                        </div>
                      );
                    }

                    const partner = partners.find(p => p.legalCompanyName === opportunity.partnerName);
                    return (
                      <InvestmentCertificate 
                        investment={inv as any}
                        investor={investor as any}
                        opportunity={opportunity as any}
                        partner={partner as any}
                        issueDate={new Date(inv.date).toLocaleDateString()}
                        logo={config.growMilkatLogo}
                        ownerSignature={config.ownerSignature}
                      />
                    );
                  })()
                ) : (
                  (() => {
                    const w = withdrawals.find(i => i.id === showCertPreview.id);
                    const investor = investors.find(i => i.id === w?.investorId);
                    const opportunity = opportunities.find(opp => opp.id === w?.opportunityId);

                    if (!w || !investor || !opportunity) {
                      return (
                        <div className="bg-white p-12 rounded-3xl shadow-xl text-center">
                          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                          <h4 className="text-lg font-bold text-slate-900">Certificate Data Missing</h4>
                          <p className="text-slate-500 mt-2">We couldn't find all the necessary data to display this certificate.</p>
                        </div>
                      );
                    }

                    const partner = partners.find(p => p.legalCompanyName === opportunity.partnerName);
                    
                    if (w.isReturnsWithdrawal) {
                      return (
                        <ReturnWithdrawalCertificate 
                          withdrawal={w as any}
                          investor={investor as any}
                          opportunity={opportunity as any}
                          partner={partner as any}
                          issueDate={new Date(w.date).toLocaleDateString()}
                          logo={config.growMilkatLogo}
                          ownerSignature={config.ownerSignature}
                        />
                      );
                    }

                    return (
                      <WithdrawalCertificate 
                        withdrawal={w as any}
                        investor={investor as any}
                        opportunity={opportunity as any}
                        partner={partner as any}
                        issueDate={new Date(w.date).toLocaleDateString()}
                        logo={config.growMilkatLogo}
                        ownerSignature={config.ownerSignature}
                      />
                    );
                  })()
                )}
              </div>
            </div>
            <div className="p-8 border-t border-slate-100 bg-white flex justify-end gap-4">
              <button 
                onClick={() => setShowCertPreview(null)}
                className="px-8 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-100 transition"
              >
                Close Preview
              </button>
              <button 
                onClick={() => {
                  handleDownloadCertificate(showCertPreview.id, showCertPreview.type);
                  setShowCertPreview(null);
                }}
                className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-emerald-600 transition shadow-xl flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Certificate Component for PDF Generation - Moved outside tab check to ensure availability */}
      <div className="fixed left-[-9999px] top-[-9999px]">
        {downloadingCert && (
          <>
            {downloadingCert.type === 'Investment' ? (
              (() => {
                const inv = userInvestments.find(i => i.id === downloadingCert.id);
                if (!inv) return null;
                const investor = investors.find(i => i.id === inv.investorId);
                const opportunity = opportunities.find(opp => opp.id === inv.opportunityId);
                const partner = partners.find(p => p.legalCompanyName === opportunity?.partnerName);
                return (
                  <div key={`cert-container-${inv.id}`}>
                    <InvestmentCertificate 
                      investment={inv as any}
                      investor={investor as any}
                      opportunity={opportunity as any}
                      partner={partner as any}
                      issueDate={new Date(inv.date).toLocaleDateString()}
                      logo={config.growMilkatLogo}
                      ownerSignature={config.ownerSignature}
                    />
                  </div>
                );
              })()
            ) : (
              (() => {
                const w = withdrawals.find(i => i.id === downloadingCert.id);
                if (!w) return null;
                const investor = investors.find(i => i.id === w.investorId);
                const opportunity = opportunities.find(opp => opp.id === w.opportunityId);
                const partner = partners.find(p => p.legalCompanyName === opportunity?.partnerName);
                
                if (w.isReturnsWithdrawal) {
                  return (
                    <div key={`return-withdrawal-cert-container-${w.id}`}>
                      <ReturnWithdrawalCertificate 
                        withdrawal={w as any}
                        investor={investor as any}
                        opportunity={opportunity as any}
                        partner={partner as any}
                        issueDate={new Date(w.date).toLocaleDateString()}
                        logo={config.growMilkatLogo}
                        ownerSignature={config.ownerSignature}
                      />
                    </div>
                  );
                }

                return (
                  <div key={`withdrawal-cert-container-${w.id}`}>
                    <WithdrawalCertificate 
                      withdrawal={w as any}
                      investor={investor as any}
                      opportunity={opportunity as any}
                      partner={partner as any}
                      issueDate={new Date(w.date).toLocaleDateString()}
                      logo={config.growMilkatLogo}
                      ownerSignature={config.ownerSignature}
                    />
                  </div>
                );
              })()
            )}
          </>
        )}
      </div>
    </>
  );
};

export default AdminPanel;
