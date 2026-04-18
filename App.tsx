
import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { View, DashboardTab, Opportunity, InvestmentType, ReturnType, RiskLevel, InvestmentRecord, InvestmentStatus, InvestmentGoal, Investor, PaymentRecord, ReturnRecord, KycMessage, Notification, NotificationType, WithdrawalRecord, Partner, TeamMember, FAQ, FAQCategory, WithdrawalStatus } from './types';
import { t as translate, Language } from './translations';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import AuthForm from './components/AuthForm';
import UserDashboard from './components/UserDashboard';
import AdminPanel from './components/AdminPanel';
import AboutPage from './components/AboutPage';
import PortfolioPage from './components/PortfolioPage';
import ContactPage from './components/ContactPage';
import WhyChooseUs from './components/WhyChooseUs';
import OpportunityDetailPage from './components/OpportunityDetailPage';
import TestimonialsPage from './components/TestimonialsPage';
import { TestimonialDetailPage } from './components/TestimonialDetailPage';
import OurTeamPage from './components/OurTeamPage';
import OurPartnersPage from './components/OurPartnersPage';
import FAQPage from './components/FAQPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import TermsConditionsPage from './components/TermsConditionsPage';
import LegalAcceptanceModal from './components/LegalAcceptanceModal';
import BlogPage from './components/BlogPage';
import BlogDetailPage from './components/BlogDetailPage';
import StartupInvestmentPage from './components/StartupInvestmentPage';
import SecurityTrustPage from './components/SecurityTrustPage';
import HowItWorksPage from './components/HowItWorksPage';
import TawkChat from './components/TawkChat';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { Testimonial, TestimonialType, BlogPost } from './types';

// Database Services
import * as dbService from './services/databaseService';
import * as authService from './services/authService';
import * as emailService from './services/emailService';
import { supabase } from './src/lib/supabase';

const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    type: TestimonialType.SUCCESS_STORY,
    name: 'Sarah Jenkins',
    role: 'Tech Entrepreneur',
    company: 'Nexus Solutions',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
    successStory: {
      amount: 4250,
      roi: '12.4%',
      month: 'February',
      year: '2026',
      propertyType: InvestmentType.COMMERCIAL_PROPERTY,
      description: 'Last month, Sarah received $4,250 in rental income from her diversified commercial property portfolio with a net ROI of 12.4%.',
      assetName: 'Azure Coast Luxury Hotel',
      assetClass: 'Hospitality Real Estate',
      holdingPeriod: '5-7 Years',
      returnType: 'Monthly Rent',
      monthlyReturn: 4250,
      yearlyRent: 51000,
      dividend: 0,
      payout: 'Monthly',
      location: 'Nice, France'
    },
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800&h=600',
    textTestimonial: 'Grow Milkat has completely transformed how I approach institutional-grade investments. The transparency and real-time tracking are unparalleled in the industry.',
    rating: 5
  },
  {
    id: '2',
    type: TestimonialType.SUCCESS_STORY,
    name: 'Michael Chen',
    role: 'Senior Portfolio Manager',
    company: 'Global Capital',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150',
    successStory: {
      amount: 8900,
      roi: '15.2%',
      month: 'January',
      year: '2026',
      propertyType: InvestmentType.HOTELS_PROPERTY,
      description: 'Michael\'s investment in the European Hospitality Fund yielded $8,900 in dividends last month, outperforming market benchmarks with a 15.2% annualized ROI.',
      assetName: 'Alpine Resort & Spa',
      assetClass: 'Hospitality',
      holdingPeriod: '3-5 Years',
      returnType: 'Dividend',
      monthlyReturn: 0,
      yearlyRent: 0,
      dividend: 8900,
      payout: 'Quarterly',
      location: 'Zermatt, Switzerland'
    },
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    imageUrl: 'https://images.unsplash.com/photo-1582408921715-18e7806365c1?auto=format&fit=crop&q=80&w=800&h=600',
    textTestimonial: 'The level of due diligence performed by the Grow Milkat team gives me the confidence to deploy significant capital into fractionalized assets.',
    rating: 5
  },
  {
    id: '3',
    type: TestimonialType.SUCCESS_STORY,
    name: 'Elena Rodriguez',
    role: 'Private Investor',
    company: 'Family Office',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150',
    successStory: {
      amount: 2100,
      roi: '10.8%',
      month: 'December',
      year: '2025',
      propertyType: InvestmentType.RESIDENTIAL_PROPERTY,
      description: 'Elena successfully exited a short-term residential project, receiving $2,100 in profit with a 10.8% return over just 6 months.',
      assetName: 'Skyline Apartments',
      assetClass: 'Residential',
      holdingPeriod: '1 Year',
      returnType: 'Short Term',
      monthlyReturn: 350,
      yearlyRent: 4200,
      dividend: 0,
      payout: 'On Exit',
      location: 'Madrid, Spain'
    },
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800&h=600',
    textTestimonial: 'As a private investor, I never thought I could access these kinds of deals. Grow Milkat has democratized high-yield real estate for everyone.',
    rating: 4
  },
  {
    id: '4',
    type: TestimonialType.SUCCESS_STORY,
    name: 'David Wilson',
    role: 'Venture Partner',
    company: 'SeedScale',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150',
    successStory: {
      amount: 15000,
      roi: '24.5%',
      month: 'February',
      year: '2026',
      propertyType: InvestmentType.STARTUP,
      description: 'David\'s early-stage investment in a fintech startup saw a significant valuation jump, resulting in a 24.5% unrealized gain this month.',
      assetName: 'PayFlow Systems',
      assetClass: 'Fintech',
      holdingPeriod: '5-8 Years',
      returnType: 'ROI',
      monthlyReturn: 0,
      yearlyRent: 0,
      dividend: 0,
      payout: 'On Exit',
      location: 'San Francisco, USA'
    },
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=800&h=600',
    textTestimonial: 'The startup selection process is rigorous. I\'ve seen many platforms, but Grow Milkat\'s forensic audit is truly institutional grade.',
    rating: 5
  },
  {
    id: '5',
    type: TestimonialType.SUCCESS_STORY,
    name: 'Thomas Müller',
    role: 'Real Estate Developer',
    company: 'Berlin Estates',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150',
    successStory: {
      amount: 12500,
      roi: '18.2%',
      month: 'March',
      year: '2026',
      propertyType: InvestmentType.COMMERCIAL_PROPERTY,
      description: 'Thomas achieved an 18.2% ROI on a commercial redevelopment project in Berlin, yielding $12,500 in capital gains.',
      assetName: 'Berlin Tech Hub',
      assetClass: 'Commercial',
      holdingPeriod: '2 Years',
      returnType: 'ROI',
      monthlyReturn: 0,
      yearlyRent: 0,
      dividend: 0,
      payout: 'On Exit',
      location: 'Berlin, Germany'
    },
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800&h=600',
    textTestimonial: 'The platform\'s ability to fractionalize large-scale commercial assets is a game-changer for mid-sized developers looking for liquidity.',
    rating: 5
  },
  {
    id: '6',
    type: TestimonialType.SUCCESS_STORY,
    name: 'Aisha Khan',
    role: 'Financial Analyst',
    company: 'Global Wealth',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150&h=150',
    successStory: {
      amount: 3200,
      roi: '9.5%',
      month: 'January',
      year: '2026',
      propertyType: InvestmentType.RESIDENTIAL_PROPERTY,
      description: 'Aisha\'s residential portfolio generated $3,200 in consistent rental income, providing a stable 9.5% yield.',
      assetName: 'Dubai Marina Residences',
      assetClass: 'Residential',
      holdingPeriod: '3 Years',
      returnType: 'Monthly Rent',
      monthlyReturn: 3200,
      yearlyRent: 38400,
      dividend: 0,
      payout: 'Monthly',
      location: 'Dubai, UAE'
    },
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800&h=600',
    textTestimonial: 'I appreciate the detailed reporting and the ease of managing international properties from a single dashboard.',
    rating: 5
  }
];

const generateUniqueId = () => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = 'INV-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: '1',
    title: 'Azure Coast Luxury Hotel',
    description: 'A premium waterfront hotel investment in the thriving Mediterranean coast. This project includes a 50-room boutique expansion with a private beach club and high-end dining facilities.',
    type: InvestmentType.HOTELS_PROPERTY,
    returnType: ReturnType.MONTHLY_RENT,
    minInvestment: 5000,
    targetAmount: 2000000,
    raisedAmount: 1450000,
    expectedROI: '14%',
    expectedIRR: '12.5%',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    location: 'Nice, France',
    riskLevel: RiskLevel.LOW,
    createdAt: '2024-01-15',
    partnerName: 'LuxStay International',
    assetClass: 'Hospitality Real Estate',
    holdingPeriod: '5-7 Years',
    taxBenefits: 'Reinvestment Relief Eligible',
    payoutFrequency: 'Monthly',
    assetID: 'AST-882341',
    kpis: [{ label: "RevPAR", value: "€285" }, { label: "Occupancy Rate", value: "84%" }],
  },
  {
    id: '2',
    title: 'EcoTech Startup Hub',
    description: 'Seed round for a revolutionary green energy management platform. EcoTech uses proprietary Al algorithms to optimize residential energy consumption.',
    type: InvestmentType.STARTUP,
    returnType: ReturnType.LONG_TERM,
    minInvestment: 1000,
    targetAmount: 500000,
    raisedAmount: 500000, // Fully funded
    expectedROI: '150%',
    expectedIRR: '45%',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800',
    location: 'Berlin, Germany',
    riskLevel: RiskLevel.HIGH,
    createdAt: '2024-02-10',
    partnerName: 'GreenFuture VC',
    assetClass: 'Venture Capital',
    holdingPeriod: '8-10 Years',
    taxBenefits: 'Angel Investor Tax Credit',
    payoutFrequency: 'On Exit',
    assetID: 'AST-771209',
  },
  {
    id: '3',
    title: 'Downtown Commercial Plaza',
    description: 'High-traffic retail space in the heart of the metropolitan financial district. Features long-term leases with blue-chip corporate clients.',
    type: InvestmentType.COMMERCIAL_PROPERTY,
    returnType: ReturnType.MONTHLY_RENT,
    minInvestment: 10000,
    targetAmount: 5000000,
    raisedAmount: 4100000,
    expectedROI: '8%',
    expectedIRR: '7.2%',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    location: 'London, UK',
    riskLevel: RiskLevel.MODERATE,
    createdAt: '2023-12-01',
    partnerName: 'Metropoint Properties',
    assetClass: 'Commercial Real Estate',
    holdingPeriod: '10+ Years',
    taxBenefits: 'Capital Gains Allowance',
    payoutFrequency: 'Quarterly',
    assetID: 'AST-445122',
  }
];

const MOCK_INVESTORS: Investor[] = [
  { 
    id: 'inv1', 
    investorUniqueId: 'INV-882341',
    name: 'Julian Vance', 
    email: 'vance@example.com', 
    avatar: 'https://i.pravatar.cc/150?u=julian', 
    kycStatus: 'Verified', 
    totalInvested: 245000, 
    activeAssets: 12, 
    riskProfile: 'Aggressive', 
    joinedDate: '2023-01-10', 
    lastActive: '2025-03-25', 
    totalReturns: 0, 
    phone: '+1 (555) 123-4567', 
    whatsapp: '+1 (555) 123-4567', 
    address: { street: '789 Wealth Ave', city: 'Greenwich', pincode: '06830', state: 'CT', country: 'USA' },
    kycDocuments: ['https://example.com/doc1.pdf', 'https://example.com/doc2.pdf'],
    paymentMethods: [
      { id: 'pm1', type: 'Bank Transfer', name: 'Chase Bank', lastFour: '4422', isLinked: true },
      { id: 'pm2', type: 'Crypto', name: 'Ethereum Wallet', isLinked: true }
    ],
    preferences: { sectors: ['Real Estate', 'Tech'], minROI: 10 },
    hasAcceptedLegal: false
  },
  { 
    id: 'inv2', 
    investorUniqueId: 'INV-771209',
    name: 'Sophia Chen', 
    email: 'schen@example.com', 
    avatar: 'https://i.pravatar.cc/150?u=sophia', 
    kycStatus: 'Verified', 
    totalInvested: 85000, 
    activeAssets: 4, 
    riskProfile: 'Balanced', 
    joinedDate: '2023-05-12', 
    lastActive: '2025-03-24', 
    totalReturns: 0, 
    phone: '+1 (555) 987-6543', 
    whatsapp: '+1 (555) 987-6543', 
    address: { street: '456 Equity Blvd', city: 'San Francisco', pincode: '94105', state: 'CA', country: 'USA' },
    kycDocuments: ['https://example.com/doc3.pdf'],
    paymentMethods: [
      { id: 'pm3', type: 'UPI', name: 'Google Pay', isLinked: true }
    ],
    preferences: { sectors: ['Green Energy'], minROI: 12 },
    hasAcceptedLegal: true
  },
  { 
    id: 'inv3', 
    investorUniqueId: 'INV-445122',
    name: 'Marcus Thorne', 
    email: 'm.thorne@example.com', 
    avatar: 'https://i.pravatar.cc/150?u=marcus', 
    kycStatus: 'Pending', 
    totalInvested: 12000, 
    activeAssets: 1, 
    riskProfile: 'Conservative', 
    joinedDate: '2024-02-01', 
    lastActive: '2025-03-20', 
    totalReturns: 0, 
    phone: '+1 (555) 444-3333', 
    address: { street: '123 Startup St', city: 'Austin', pincode: '78701', state: 'TX', country: 'USA' },
    kycDocuments: [],
    paymentMethods: [],
    preferences: { sectors: ['Real Estate'], minROI: 5 },
    hasAcceptedLegal: false
  },
];

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentView, setCurrentView] = useState<View>('home');
  const [dashboardTab, setDashboardTab] = useState<DashboardTab>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<Investor | null>(null);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize currentView based on URL
  useEffect(() => {
    const path = location.pathname.substring(1) as View;
    if (path) {
      setCurrentView(path);
    }
  }, [location.pathname]);
  
  useEffect(() => {
    // Check for Supabase configuration
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      console.error("CRITICAL ERROR: Supabase environment variables are missing.");
      alert("System Configuration Error: Supabase URL or API Key is missing. If you are on Vercel, please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your Environment Variables.");
    }

    // IP-based currency detection
    const detectCurrency = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) throw new Error("IP API failed");
        const data = await response.json();
        if (data.country_code === 'IN') {
          setSelectedCurrency('INR');
        } else {
          setSelectedCurrency('USD');
        }
      } catch (err) {
        console.warn("Currency detection failed, defaulting to USD:", err);
        setSelectedCurrency('USD');
      }
    };
    detectCurrency();
  }, []);

  const [blogs, setBlogs] = useState<BlogPost[]>([
    {
      id: '1',
      title: 'The Rise of Fractional Real Estate in 2026',
      excerpt: 'How blockchain and SPVs are democratizing high-value asset ownership for the next generation of investors.',
      content: 'Full content here...',
      author: 'Vikram Sethi',
      authorRole: 'Chief Investment Officer',
      authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150',
      date: 'March 28, 2026',
      category: 'Market Trends',
      imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000',
      readTime: '6 min read',
      tags: ['Real Estate', 'Fractional Ownership', 'Wealth Tech']
    },
    {
      id: '2',
      title: 'Understanding the G.R.O.W. Framework',
      excerpt: 'A deep dive into our proprietary vetting protocol that ensures institutional-grade security for your capital.',
      content: 'Full content here...',
      author: 'Elena Rodriguez',
      authorRole: 'Head of Risk Management',
      authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150',
      date: 'March 24, 2026',
      category: 'Education',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000',
      readTime: '8 min read',
      tags: ['Risk Management', 'Governance', 'Investment Strategy']
    },
    {
      id: '3',
      title: 'Why Hospitality Assets are Outperforming in Q1',
      excerpt: 'Analyzing the surge in luxury hotel yields across Europe and the Middle East.',
      content: 'Full content here...',
      author: 'Marcus Thorne',
      authorRole: 'Hospitality Specialist',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150',
      date: 'March 20, 2026',
      category: 'Assets Analysis',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000',
      readTime: '5 min read',
      tags: ['Hotels', 'Hospitality', 'Yield Analysis']
    },
    {
      id: '4',
      title: 'Diversification: Beyond Stocks and Bonds',
      excerpt: 'Why alternative assets like land and startups are essential for a resilient 2026 portfolio.',
      content: 'Full content here...',
      author: 'Sarah Jenkins',
      authorRole: 'Portfolio Strategist',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
      date: 'March 15, 2026',
      category: 'Wealth Management',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000',
      readTime: '7 min read',
      tags: ['Diversification', 'Alternative Assets', 'Portfolio Growth']
    }
  ]);

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [userInvestments, setUserInvestments] = useState<InvestmentRecord[]>([]);
  const [returns, setReturns] = useState<ReturnRecord[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(MOCK_TESTIMONIALS);
  
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);

  useEffect(() => {
    const unsubscribe = authService.subscribeToAuthChanges(async (user) => {
      if (user) {
        setIsLoggedIn(true);
        const investorData = await dbService.getInvestorByUid(user.id);
        if (investorData) {
          setCurrentUser(investorData);
          setIsAdmin(investorData.role === 'admin');
          
          // Fetch user-specific data
          const userInvs = await dbService.getInvestmentsByInvestor(user.id);
          setUserInvestments(userInvs);
          
          const userWithdrawals = await dbService.getWithdrawalsByInvestor(user.id);
          setWithdrawals(userWithdrawals);
          
          const userReturns = await dbService.getReturnsByInvestor(user.id);
          setReturns(userReturns);
        }
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
        setCurrentUser(null);
      }
    });

    // Initial data fetch
    const fetchData = async () => {
      setIsLoading(true);
      
      // Safety timeout to prevent infinite skeleton loading
      const safetyTimeout = setTimeout(() => {
        setIsLoading(false);
      }, 5000);

      try {
        const opps = await dbService.getOpportunities();
        setOpportunities(opps);
        
        const invs = await dbService.getInvestors();
        setInvestors(invs);

        const pts = await dbService.getPartners();
        setPartners(pts);
        
        // If admin, fetch all data
        if (isAdmin) {
          const allInvs = await dbService.getAllInvestments();
          setUserInvestments(allInvs);
          
          const allWithdrawals = await dbService.getAllWithdrawals();
          setWithdrawals(allWithdrawals);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        clearTimeout(safetyTimeout);
        setIsLoading(false);
      }
    };

    fetchData();
    return () => { if (unsubscribe) unsubscribe(); };
  }, [isAdmin]);

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: "Julian Vance",
      role: "Chief Investment Officer",
      bio: "Former Managing Director at a top-tier global investment bank with over 20 years of experience in structured finance and real estate acquisition.",
      image: "https://i.pravatar.cc/150?u=julian",
      category: 'leadership',
      socials: { linkedin: "#", x: "#", mail: "julian@growmilkat.com" }
    },
    {
      id: '2',
      name: "Sophia Chen",
      role: "Head of Private Equity",
      bio: "Expert in emerging market technology investments and venture capital, previously leading the Asia-Pacific portfolio for a major sovereign wealth fund.",
      image: "https://i.pravatar.cc/150?u=sophia",
      category: 'leadership',
      socials: { linkedin: "#", mail: "sophia@growmilkat.com" }
    },
    {
      id: '3',
      name: "Marcus Thorne",
      role: "Chief Compliance Officer",
      bio: "Legal expert specializing in international securities law and cross-border regulatory frameworks, ensuring the highest standards of investor protection.",
      image: "https://i.pravatar.cc/150?u=marcus",
      category: 'leadership',
      socials: { linkedin: "#" }
    },
    {
      id: '4',
      name: "Dr. Elena Rossi",
      role: "Economic Advisor",
      bio: "Renowned economist with a focus on real estate cycles and macroeconomic trends, providing strategic guidance on asset allocation.",
      image: "https://i.pravatar.cc/150?u=elena",
      category: 'advisory',
      socials: {}
    },
    {
      id: '5',
      name: "David Miller",
      role: "Technology Strategist",
      bio: "Pioneer in blockchain applications for real estate fractionalization and automated governance protocols.",
      image: "https://i.pravatar.cc/150?u=david",
      category: 'advisory',
      socials: {}
    },
    {
      id: '6',
      name: "Sarah Jenkins",
      role: "Head of Asset Management",
      bio: "Dedicated to operational excellence and maximizing yield across our global hospitality and commercial portfolios.",
      image: "https://i.pravatar.cc/150?u=sarah",
      category: 'operations',
      socials: {}
    },
    {
      id: '7',
      name: "Michael Zhang",
      role: "Lead Data Scientist",
      bio: "Architect of our proprietary AI risk modeling engine, integrating Gemini-powered insights into our vetting protocol.",
      image: "https://i.pravatar.cc/150?u=michael",
      category: 'operations',
      socials: {}
    }
  ]);
  const [investmentGoal, setInvestmentGoal] = useState<InvestmentGoal>({
    targetValue: 50000,
    targetDate: '2025-12-31'
  });

  const [language, setLanguage] = useState<Language>('English');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');

  const [showLegalModal, setShowLegalModal] = useState(false);

  useEffect(() => {
    if (isLoggedIn && currentUser && !isAdmin && !currentUser.hasAcceptedLegal) {
      setShowLegalModal(true);
    } else {
      setShowLegalModal(false);
    }
  }, [isLoggedIn, currentUser, isAdmin]);

  const handleAcceptLegal = () => {
    if (currentUser) {
      const updatedUser = { ...currentUser, hasAcceptedLegal: true };
      setCurrentUser(updatedUser);
      setInvestors(prev => prev.map(inv => inv.id === updatedUser.id ? updatedUser : inv));
      setShowLegalModal(false);
    }
  };

  const [config, setConfig] = useState({
    globalCommission: 2.5,
    secondaryMarket: true,
    maintenanceMode: false,
    securityLevel: 'Enterprise',
    kycRequirement: 'Tier 2',
    logo: '/Grow Milkat - Black.png',
    growMilkatLogo: '/Grow Milkat - Black.png',
    ownerSignature: '',
    privacyPolicy: [
      {
        id: '1',
        title: 'Information We Collect',
        content: 'At Grow Milkat, we collect information to provide better services to all our users. The types of personal information we collect include:',
        items: [
          'Personal Identification: Name, email address, phone number, and government-issued ID for KYC compliance.',
          'Financial Information: Bank account details, investment history, and transaction records.',
          'Technical Data: IP address, browser type, and usage patterns on our platform.'
        ],
        type: 'bullets'
      },
      {
        id: '2',
        title: 'How We Use Your Information',
        content: 'We use the information we collect for the following purposes:',
        items: [
          'To facilitate and manage your investments on the platform.',
          'To comply with legal and regulatory requirements, including Anti-Money Laundering (AML) and Know Your Customer (KYC) regulations.',
          'To improve our platform\'s functionality and user experience.',
          'To communicate important updates, security alerts, and investment opportunities.'
        ],
        type: 'bullets'
      },
      {
        id: '3',
        title: 'Data Security',
        content: 'We implement robust security measures to protect your data from unauthorized access, alteration, or disclosure. This includes:',
        items: [
          'End-to-end encryption for sensitive data transfers.',
          'Regular security audits and vulnerability assessments.',
          'Strict access controls for our internal systems.'
        ],
        type: 'bullets'
      }
    ],
    termsConditions: [
      {
        id: '1',
        title: 'Acceptance of Terms',
        content: 'By accessing or using the Grow Milkat platform, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, you must not use our services.',
        type: 'paragraph'
      },
      {
        id: '2',
        title: 'Investment Risks',
        content: 'Investing in startups, hospitality, and real estate involves significant risks, including the potential loss of principal. Grow Milkat does not guarantee any specific returns on investments. You should carefully consider your investment objectives and risk tolerance before deploying capital.',
        type: 'paragraph'
      }
    ]
  });

  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: '1',
      categoryId: '1',
      question: 'What is Grow Milkat?',
      answer: 'Grow Milkat is a premier fractional investment platform that democratizes access to high-yield institutional-grade assets. We allow investors to own portions of premium real estate, startups, and commercial projects with significantly lower capital requirements than traditional investing.'
    },
    {
      id: '2',
      categoryId: '1',
      question: 'How does fractional ownership work?',
      answer: 'Fractional ownership divides a high-value asset into smaller "fractions" or shares. When you invest, you own a legal percentage of that specific asset, entitled to a proportional share of the returns, such as rental income or capital appreciation.'
    },
    {
      id: '3',
      categoryId: '1',
      question: 'Is Grow Milkat regulated?',
      answer: 'Yes, we operate in full compliance with local financial regulations. All our investment structures are legally vetted, and we partner with established trustees and legal firms to ensure investor protection and transparency.'
    },
    {
      id: '4',
      categoryId: '2',
      question: 'What is the minimum investment amount?',
      answer: 'The minimum investment varies by opportunity but typically starts as low as $1,000 for startups and $5,000 for premium real estate projects. Each opportunity detail page specifies its unique minimum requirement.'
    },
    {
      id: '5',
      categoryId: '2',
      question: 'What kind of returns can I expect?',
      answer: 'Returns depend on the asset class. Real estate typically offers 8-14% annual rental yields plus capital appreciation. Startups can offer significantly higher returns (10x-50x) but come with higher risk and longer holding periods.'
    },
    {
      id: '6',
      categoryId: '2',
      question: 'How often are returns paid out?',
      answer: 'Payout frequency is specific to each asset. Rental properties usually pay out monthly or quarterly. Startups and short-term projects typically pay out upon a "liquidity event" or project completion.'
    },
    {
      id: '7',
      categoryId: '3',
      question: 'Why do I need to complete KYC?',
      answer: 'Know Your Customer (KYC) is a mandatory regulatory requirement to prevent identity theft, financial fraud, and money laundering. It ensures that our platform remains secure and compliant with international financial laws.'
    },
    {
      id: '8',
      categoryId: '3',
      question: 'What documents are required for verification?',
      answer: 'Typically, you need a government-issued ID (Passport, Driver\'s License, or National ID) and a proof of address (Utility bill or Bank statement from the last 3 months). For corporate investors, additional company registration documents are required.'
    },
    {
      id: '9',
      categoryId: '3',
      question: 'How long does the verification process take?',
      answer: 'Once submitted, our compliance team usually reviews and approves KYC applications within 24 to 48 business hours. You will receive a notification once your status is updated.'
    },
    {
      id: '10',
      categoryId: '4',
      question: 'What payment methods are supported?',
      answer: 'We support a variety of secure payment methods including Direct Bank Transfers (ACH/Wire), Credit/Debit Cards, UPI (in supported regions), and major Cryptocurrencies (USDT/USDC).'
    },
    {
      id: '11',
      categoryId: '4',
      question: 'Are my financial transactions secure?',
      answer: 'Absolutely. We use bank-grade encryption and partner with leading payment processors like Stripe and Plaid. We never store your full card details or sensitive banking credentials on our servers.'
    },
    {
      id: '12',
      categoryId: '4',
      question: 'Are there any transaction fees?',
      answer: 'Grow Milkat does not charge a fee for deposits. However, your bank or the payment processor may apply standard transaction or currency conversion fees depending on your chosen method.'
    },
    {
      id: '13',
      categoryId: '5',
      question: 'How do I withdraw my earnings?',
      answer: 'You can initiate a withdrawal from your User Dashboard. Simply go to the "Payments" or "Withdraw" section, enter the amount you wish to withdraw, and select your linked bank account.'
    },
    {
      id: '14',
      categoryId: '5',
      question: 'Is there a lock-in period for my investment?',
      answer: 'Most institutional assets have a defined holding period (e.g., 3-5 years). While you receive regular returns, the principal capital is typically returned at the end of the term. However, we are developing a secondary market where you can sell your fractions to other investors before the term ends.'
    },
    {
      id: '15',
      categoryId: '5',
      question: 'How long does it take to receive my funds?',
      answer: 'Withdrawal requests are processed within 1-3 business days. Depending on your bank and location, the funds may take an additional 2-5 days to reflect in your account.'
    }
  ]);

  const [faqCategories, setFaqCategories] = useState<FAQCategory[]>([
    { id: '1', name: 'About Grow Milkat', icon: 'Info' },
    { id: '2', name: 'Investment', icon: 'TrendingUp' },
    { id: '3', name: 'KYC', icon: 'ShieldCheck' },
    { id: '4', name: 'Payment Gateway', icon: 'CreditCard' },
    { id: '5', name: 'Withdraw', icon: 'Wallet' }
  ]);

  const handleSaveFAQ = (faq: FAQ) => {
    if (faqs.find(f => f.id === faq.id)) {
      setFaqs(faqs.map(f => f.id === faq.id ? faq : f));
    } else {
      setFaqs([...faqs, faq]);
    }
  };

  const handleDeleteFAQ = (id: string) => {
    setFaqs(faqs.filter(f => f.id !== id));
  };

  const handleSaveFAQCategory = (category: FAQCategory) => {
    if (faqCategories.find(c => c.id === category.id)) {
      setFaqCategories(faqCategories.map(c => c.id === category.id ? category : c));
    } else {
      setFaqCategories([...faqCategories, category]);
    }
  };

  const handleDeleteFAQCategory = (id: string) => {
    setFaqCategories(faqCategories.filter(c => c.id !== id));
    setFaqs(faqs.filter(f => f.categoryId !== id));
  };

  const t = (key: string) => translate(key, language);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: selectedCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = useCallback((view: View, data?: any) => {
    setCurrentView(view);
    if (view === 'opportunity-detail' && data) {
      setSelectedOpportunityId(data);
      navigate(`/opportunity-detail?id=${data}`);
    } else if (view === 'testimonial-detail' && data) {
      setSelectedTestimonial(data);
      navigate('/testimonial-detail');
    } else if (view === 'blog-detail' && data) {
      setSelectedBlogPost(data);
      navigate('/blog-detail');
    } else {
      navigate(`/${view === 'home' ? '' : view}`);
    }
  }, [navigate]);


  const handleInvest = async (opp: Opportunity, amount: number, investorId?: string) => {
    if (!isLoggedIn) {
      alert("Please log in to your account to start investing.");
      navigate('/login');
      return;
    }

    if (currentUser && currentUser.kycStatus !== 'Verified') {
      alert("Your KYC verification is required before you can invest. Redirecting to verification page...");
      setDashboardTab('kyc');
      navigate('/dashboard');
      return;
    }

    const platformFee = (amount * config.globalCommission) / 100;
    const totalDeduction = amount + platformFee;

    if (currentUser && currentUser.walletBalance < totalDeduction) {
      alert(`Insufficient wallet balance. Total required (including ${config.globalCommission}% fee): ${formatCurrency(totalDeduction)}. Please deposit funds first.`);
      setDashboardTab('payments');
      navigate('/dashboard');
      return;
    }

    if (opp.raisedAmount >= opp.targetAmount) {
      alert("This opportunity is already fully funded.");
      return;
    }

    const remainingNeeded = opp.targetAmount - opp.raisedAmount;
    let finalAmount = amount;

    if (amount > remainingNeeded) {
      alert(`Only $${remainingNeeded.toLocaleString()} is available for investment in this opportunity. We have adjusted your investment amount to the remaining available capital.`);
      finalAmount = remainingNeeded;
    }

    if (finalAmount <= 0) {
      alert("This opportunity is already fully funded.");
      return;
    }

    const targetId = investorId || currentUser?.id || 'inv1';

    try {
      // 1. Create Investment Record
      const newRecord: Omit<InvestmentRecord, "id"> = {
        investorId: targetId,
        opportunityId: opp.id,
        opportunityTitle: opp.title,
        amount: finalAmount,
        date: new Date().toISOString().split('T')[0],
        status: InvestmentStatus.ACTIVE,
        type: opp.type
      };

      const docRef = await dbService.addInvestment(newRecord);
      const savedRecord = { id: docRef.id, ...newRecord };
      
      setUserInvestments([savedRecord, ...userInvestments]);
      
      // 2. Update Asset Raised Amount
      const updatedOpp = { ...opp, raisedAmount: Math.min(opp.targetAmount, opp.raisedAmount + finalAmount) };
      await dbService.saveOpportunity(updatedOpp);
      setOpportunities(prev => prev.map(o => o.id === opp.id ? updatedOpp : o));
      
      // 3. Wallet Transaction (Investment)
      await dbService.addWalletTransaction({
        investorId: targetId,
        amount: finalAmount,
        fee: platformFee,
        type: 'Investment',
        description: `Investment in ${opp.title}`,
        status: 'Completed'
      });

      // 4. Update local user state
      if (currentUser && currentUser.id === targetId) {
        const updatedUser = { 
          ...currentUser, 
          walletBalance: currentUser.walletBalance - totalDeduction,
          totalInvested: currentUser.totalInvested + finalAmount, 
          activeAssets: currentUser.activeAssets + 1 
        };
        setCurrentUser(updatedUser);
        setInvestors(prev => prev.map(inv => inv.id === targetId ? updatedUser : inv));

        // 5. Process Referral Reward if it's the first investment
        const isFirstInvestment = userInvestments.filter(inv => inv.investorId === targetId).length === 0;
        if (isFirstInvestment) {
          const rewardAmount = selectedCurrency === 'INR' ? 1000 : 10;
          await dbService.processReferralReward(targetId, rewardAmount);
        }
      }

      // Email Trigger
      if (currentUser) {
        emailService.sendEmail('INVESTMENT_CERTIFICATE', {
          userEmail: currentUser.email,
          opportunityTitle: opp.title,
          amount: formatCurrency(finalAmount)
        });
      }

      // Add notification
      handleAddNotification(
        targetId,
        NotificationType.INVESTMENT,
        'Investment Successful',
        `Your investment of ${formatCurrency(finalAmount)} in "${opp.title}" has been processed. A platform fee of ${formatCurrency(platformFee)} was applied.`,
        '/dashboard?tab=history'
      );
    } catch (err) {
      console.error("Investment failed:", err);
      alert("Investment failed. Please try again.");
    }
  };

  const handleDeposit = async (amount: number, method: string) => {
    if (!currentUser) return;

    try {
      await dbService.addWalletTransaction({
        investorId: currentUser.id,
        amount: amount,
        type: 'Deposit',
        description: `Deposit via ${method}`,
        status: 'Completed'
      });

      const updatedUser = {
        ...currentUser,
        walletBalance: (currentUser.walletBalance || 0) + amount
      };
      
      setCurrentUser(updatedUser);
      setInvestors(prev => prev.map(inv => inv.id === currentUser.id ? updatedUser : inv));

      handleAddNotification(
        currentUser.id,
        NotificationType.OTHER,
        'Deposit Successful',
        `Your deposit of ${formatCurrency(amount)} via ${method} has been credited to your wallet.`,
        '/dashboard?tab=payments'
      );
    } catch (err) {
      console.error("Deposit failed:", err);
      alert("Deposit failed. Please try again.");
    }
  };

  const handleSaveOpportunity = (opp: Opportunity) => {
    setOpportunities(prev => {
      const exists = prev.find(o => o.id === opp.id);
      if (exists) return prev.map(o => o.id === opp.id ? opp : o);
      
      // New opportunity added - notify all investors
      setTimeout(() => {
        investors.forEach(investor => {
          handleAddNotification(
            investor.id,
            NotificationType.OPPORTUNITY,
            'New Investment Opportunity',
            `A new ${opp.type} opportunity "${opp.title}" is now available with an expected ROI of ${opp.expectedROI}.`,
            `/dashboard?tab=market&assetId=${opp.id}`
          );
        });
      }, 100);

      return [opp, ...prev];
    });
  };

  const handleSaveInvestor = (investor: Investor) => {
    setInvestors(prev => {
      const exists = prev.find(i => i.id === investor.id);
      if (exists) return prev.map(i => i.id === investor.id ? investor : i);
      
      // New investor - ensure they have a unique ID
      const newInvestor = {
        ...investor,
        investorUniqueId: investor.investorUniqueId || generateUniqueId()
      };
      return [newInvestor, ...prev];
    });
  };

  const handleDeleteInvestor = (id: string) => {
    setInvestors(prev => prev.filter(i => i.id !== id));
  };

  const handleDeleteOpportunity = (id: string) => {
    setOpportunities(prev => prev.filter(o => o.id !== id));
  };

  const handleSaveBlog = (blog: BlogPost) => {
    setBlogs(prev => {
      const exists = prev.find(b => b.id === blog.id);
      if (exists) return prev.map(b => b.id === blog.id ? blog : b);
      return [blog, ...prev];
    });
  };

  const handleDeleteBlog = (id: string) => {
    setBlogs(prev => prev.filter(b => b.id !== id));
  };

  const handleBulkDeleteOpps = (ids: string[]) => {
    setOpportunities(prev => prev.filter(o => !ids.includes(o.id)));
  };

  const handleBulkDeleteInvestors = (ids: string[]) => {
    setInvestors(prev => prev.filter(i => !ids.includes(i.id)));
  };

  const handleBulkApproveInvestors = (ids: string[]) => {
    ids.forEach(id => handleSendKYCMessage(id, 'Approval', 'Your KYC has been approved via bulk action.'));
  };

  const handleBulkRejectInvestors = (ids: string[]) => {
    ids.forEach(id => handleSendKYCMessage(id, 'Rejection', 'Bulk rejection by administrator.'));
  };

  const handleGiveReturn = (returnRecord: ReturnRecord) => {
    setReturns(prev => [returnRecord, ...prev]);
    // Also update the investor's total returns
    setInvestors(prev => prev.map(inv => {
      if (inv.id === returnRecord.investorId) {
        return { ...inv, totalReturns: inv.totalReturns + returnRecord.amount };
      }
      return inv;
    }));
    // If current user is the recipient, update their state too
    if (currentUser && currentUser.id === returnRecord.investorId) {
      setCurrentUser(prev => prev ? { ...prev, totalReturns: prev.totalReturns + returnRecord.amount } : null);
    }

    // Add notification
    handleAddNotification(
      returnRecord.investorId,
      NotificationType.RETURN,
      'Return Received',
      `You have received a return of $${returnRecord.amount} from ${returnRecord.investmentTitle}.`,
      '/dashboard?tab=history'
    );
  };

  const handleMarkNotificationRead = (notificationId: string) => {
    if (currentUser) {
      const updatedNotifications = (currentUser.notifications || []).map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      );
      const newUser = { ...currentUser, notifications: updatedNotifications };
      setCurrentUser(newUser);
      setInvestors(prev => prev.map(inv => inv.id === newUser.id ? newUser : inv));
    }
  };

  const handleUpdateProfile = (updatedProfile: Partial<Investor>) => {
    if (currentUser) {
      const newUser = { ...currentUser, ...updatedProfile };
      setCurrentUser(newUser);
      setInvestors(prev => prev.map(inv => inv.id === newUser.id ? newUser : inv));
    }
  };

  const handleAddNotification = (investorId: string, type: NotificationType, title: string, message: string, actionUrl?: string) => {
    const newNotification: Notification = {
      id: Math.random().toString(36).substring(2, 15),
      investorId,
      type,
      title,
      message,
      date: new Date().toISOString(),
      read: false,
      actionUrl
    };

    setInvestors(prev => prev.map(inv => {
      if (inv.id === investorId) {
        return { ...inv, notifications: [newNotification, ...(inv.notifications || [])] };
      }
      return inv;
    }));

    if (currentUser?.id === investorId) {
      setCurrentUser(prev => prev ? { ...prev, notifications: [newNotification, ...(prev.notifications || [])] } : null);
    }
  };

  const handleSendKYCMessage = (investorId: string, type: 'Approval' | 'Rejection' | 'Reminder', content: string) => {
    const displayContent = type === 'Rejection' 
      ? `Your KYC is rejected , Please Re-Uploaded your documents > Reason : ${content}`
      : content;

    const newMessage: KycMessage = {
      id: Math.random().toString(36).substring(2, 15),
      type,
      content: displayContent,
      date: new Date().toISOString(),
      read: false
    };

    setInvestors(prev => prev.map(inv => {
      if (inv.id === investorId) {
        const messages = inv.kycMessages || [];
        return { 
          ...inv, 
          kycMessages: [newMessage, ...messages],
          kycStatus: type === 'Approval' ? 'Verified' : type === 'Rejection' ? 'Rejected' : inv.kycStatus
        };
      }
      return inv;
    }));

    if (currentUser?.id === investorId) {
      const messages = currentUser.kycMessages || [];
      setCurrentUser({
        ...currentUser,
        kycMessages: [newMessage, ...messages],
        kycStatus: type === 'Approval' ? 'Verified' : type === 'Rejection' ? 'Rejected' : currentUser.kycStatus
      });
    }

    console.log(`Sending KYC ${type} to investor: ${investorId}`);
    const targetInvestor = investors.find(i => i.id === investorId);
    
    // Simulate Email Sending
    if (targetInvestor) {
      console.log(`EMAIL SIMULATION: Sending ${type} email to ${targetInvestor.email}`);
      if (type === 'Reminder') {
        alert(`KYC REMINDER SENT\n\nTo: ${targetInvestor.email}\nMessage: ${displayContent}\n\n(This simulates a direct email to the investor's registered address)`);
      } else if (type === 'Approval') {
        alert(`KYC APPROVAL NOTIFICATION SENT\n\nTo: ${targetInvestor.email}\n\nInvestor has been verified successfully.`);
      } else if (type === 'Rejection') {
        alert(`KYC REJECTION NOTIFICATION SENT\n\nTo: ${targetInvestor.email}\nReason: ${displayContent}`);
      }
    }

    // Email Trigger
    if (targetInvestor) {
      emailService.sendEmail('KYC', {
        userEmail: targetInvestor.email,
        status: type === 'Approval' ? 'Approved' : type === 'Rejection' ? 'Rejected' : 'Pending',
        reason: type === 'Rejection' ? content : undefined
      });
    }

    // Add notification
    handleAddNotification(
      investorId,
      NotificationType.KYC,
      `KYC ${type}`,
      type === 'Approval' 
        ? 'Your KYC has been approved! You can now start investing.' 
        : displayContent,
      '/dashboard?tab=kyc'
    );
  };

  const handleWithdraw = async (withdrawal: WithdrawalRecord) => {
    const { id, ...data } = withdrawal;
    try {
      const docRef = await dbService.addWithdrawal(data);
      const savedWithdrawal = { id: docRef.id, ...data };
      setWithdrawals(prev => [savedWithdrawal, ...prev]);
      
      // Update return record status if it's a returns withdrawal
      if (withdrawal.isReturnsWithdrawal && withdrawal.returnId) {
        setReturns(prev => prev.map(ret => 
          ret.id === withdrawal.returnId ? { ...ret, withdrawalStatus: WithdrawalStatus.PENDING, withdrawalRequestedAt: withdrawal.date } : ret
        ));
      }
      
      // Add notification
      handleAddNotification(
        withdrawal.investorId,
        NotificationType.OTHER,
        'Withdrawal Request Sent',
        `Your withdrawal request for $${withdrawal.withdrawalAmount.toLocaleString()} has been sent for approval.`,
        '/dashboard?tab=history'
      );
    } catch (err) {
      console.error("Withdrawal failed:", err);
      alert("Withdrawal request failed. Please try again.");
    }
  };

  const handleUploadKYC = (investorId: string, documents: string[]) => {
    setInvestors(prev => prev.map(inv => {
      if (inv.id === investorId) {
        return { 
          ...inv, 
          kycDocuments: [...inv.kycDocuments, ...documents],
          kycStatus: 'Pending' as const
        };
      }
      return inv;
    }));

    if (currentUser?.id === investorId) {
      setCurrentUser({
        ...currentUser,
        kycDocuments: [...currentUser.kycDocuments, ...documents],
        kycStatus: 'Pending' as const
      });
    }
  };

  const handleUpdateWithdrawalStatus = (withdrawalId: string, status: WithdrawalStatus) => {
    setWithdrawals(prev => prev.map(w => {
      if (w.id === withdrawalId) {
        return { ...w, status };
      }
      return w;
    }));

    const withdrawal = withdrawals.find(w => w.id === withdrawalId);
    if (withdrawal) {
      if (withdrawal.isReturnsWithdrawal && withdrawal.returnId) {
        // Update the return record status
        setReturns(prev => prev.map(ret => 
          ret.id === withdrawal.returnId ? { ...ret, withdrawalStatus: status } : ret
        ));

        if (status === WithdrawalStatus.APPROVED) {
          // Update payment history status
          setPaymentHistory(prev => prev.map(p => 
            p.id === withdrawal.id ? { ...p, status: 'Completed' } : p
          ));
        } else if (status === WithdrawalStatus.REJECTED) {
          // Update payment history status
          setPaymentHistory(prev => prev.map(p => 
            p.id === withdrawal.id ? { ...p, status: 'Failed' } : p
          ));
        }
      } else if (status === WithdrawalStatus.APPROVED) {
        // Update the investment status to INACTIVE only on approval
        setUserInvestments(prev => prev.map(inv => 
          inv.id === withdrawal.investmentId ? { ...inv, status: InvestmentStatus.INACTIVE } : inv
        ));

        // Update investor's stats
        setInvestors(prev => prev.map(inv => {
          if (inv.id === withdrawal.investorId) {
            return { 
              ...inv, 
              totalInvested: Math.max(0, inv.totalInvested - withdrawal.investmentAmount),
              activeAssets: Math.max(0, inv.activeAssets - 1)
            };
          }
          return inv;
        }));

        if (currentUser?.id === withdrawal.investorId) {
          setCurrentUser(prev => prev ? { 
            ...prev, 
            totalInvested: Math.max(0, prev.totalInvested - withdrawal.investmentAmount),
            activeAssets: Math.max(0, prev.activeAssets - 1)
          } : null);
        }

        // Update payment history status
        setPaymentHistory(prev => prev.map(p => 
          p.id === withdrawal.id ? { ...p, status: 'Completed' } : p
        ));
      } else if (status === WithdrawalStatus.REJECTED) {
        // Update payment history status
        setPaymentHistory(prev => prev.map(p => 
          p.id === withdrawal.id ? { ...p, status: 'Failed' } : p
        ));
      }

      handleAddNotification(
        withdrawal.investorId,
        NotificationType.OTHER,
        `Withdrawal ${status}`,
        `Your withdrawal request ${withdrawal.id} has been ${status.toLowerCase()}.`,
        '/dashboard?tab=history'
      );

      // Email Trigger
      const targetInv = investors.find(i => i.id === withdrawal.investorId);
      if (targetInv) {
        emailService.sendEmail('WITHDRAWAL', {
          userEmail: targetInv.email,
          status: status,
          amount: formatCurrency(withdrawal.withdrawalAmount)
        });
      }
    }
  };

  const handleSaveTestimonial = (testimonial: Testimonial) => {
    setTestimonials(prev => {
      const exists = prev.find(t => t.id === testimonial.id);
      if (exists) return prev.map(t => t.id === testimonial.id ? testimonial : t);
      return [testimonial, ...prev];
    });
  };

  const handleDeleteTestimonial = (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
  };

  const handleSavePartner = (partner: Partner) => {
    setPartners(prev => {
      const exists = prev.find(p => p.id === partner.id);
      if (exists) {
        return prev.map(p => p.id === partner.id ? partner : p);
      }
      return [partner, ...prev];
    });
  };

  const handleDeletePartner = (id: string) => {
    setPartners(prev => prev.filter(p => p.id !== id));
  };

  const handleSaveTeamMember = (member: TeamMember) => {
    setTeamMembers(prev => {
      const exists = prev.find(m => m.id === member.id);
      if (exists) return prev.map(m => m.id === member.id ? member : m);
      return [member, ...prev];
    });
  };

  const handleDeleteTeamMember = (id: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
  };

  const handleLogout = async () => {
    try {
      await authService.logOut();
      setIsLoggedIn(false);
      setIsAdmin(false);
      setCurrentUser(null);
      setCurrentView('home');
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        currentView={currentView} 
        onNavigate={handleNavigate} 
        isLoggedIn={isLoggedIn} 
        isAdmin={isAdmin}
        onLogout={handleLogout}
        t={t}
        language={language}
        setLanguage={setLanguage}
        logo={config.logo}
      />
      <LegalAcceptanceModal 
        isOpen={showLegalModal}
        onAccept={handleAcceptLegal}
        onViewPrivacy={() => navigate('/privacy-policy')}
        onViewTerms={() => navigate('/terms-conditions')}
      />
      <TawkChat user={currentUser} />
      <main className="flex-grow pt-20">
        <Routes>
          <Route path="/" element={<LandingPage onNavigate={handleNavigate} formatCurrency={formatCurrency} t={t} testimonials={testimonials} loading={isLoading} />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/about" element={<AboutPage formatCurrency={formatCurrency} t={t} onNavigate={handleNavigate} testimonials={testimonials} />} />
          <Route path="/why" element={<WhyChooseUs formatCurrency={formatCurrency} t={t} />} />
          <Route path="/portfolio" element={
            <PortfolioPage 
              opportunities={opportunities} 
              onInvest={handleInvest} 
              isAdmin={isAdmin}
              isLoggedIn={isLoggedIn}
              currentUser={currentUser}
              onDelete={handleDeleteOpportunity}
              onEdit={handleSaveOpportunity}
              onViewDetail={(id) => handleNavigate('opportunity-detail', id)}
              formatCurrency={formatCurrency}
              selectedCurrency={selectedCurrency}
              t={t}
            />
          } />
          <Route path="/contact" element={<ContactPage formatCurrency={formatCurrency} t={t} />} />
          <Route path="/our-team" element={<OurTeamPage t={t} teamMembers={teamMembers} />} />
          <Route path="/our-partners" element={<OurPartnersPage partners={partners} />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage config={config} />} />
          <Route path="/terms-conditions" element={<TermsConditionsPage config={config} />} />
          <Route path="/faq" element={<FAQPage faqs={faqs} categories={faqCategories} />} />
          <Route path="/testimonials" element={<TestimonialsPage language={language} onNavigate={handleNavigate} testimonials={testimonials} />} />
          <Route path="/testimonial-detail" element={
            selectedTestimonial ? 
            <TestimonialDetailPage testimonial={selectedTestimonial} onBack={() => handleNavigate('testimonials')} language={language} /> :
            <Navigate to="/testimonials" replace />
          } />
          <Route path="/blog" element={<BlogPage onNavigate={handleNavigate} t={t} blogs={blogs} />} />
          <Route path="/blog-detail" element={
            selectedBlogPost ? 
            <BlogDetailPage post={selectedBlogPost} onBack={() => handleNavigate('blog')} onNavigate={handleNavigate} t={t} /> :
            <Navigate to="/blog" replace />
          } />
          <Route path="/startup-investment" element={<StartupInvestmentPage onNavigate={handleNavigate} />} />
          <Route path="/security-trust" element={<SecurityTrustPage onNavigate={handleNavigate} />} />
          <Route path="/how-it-works" element={<HowItWorksPage onNavigate={handleNavigate} />} />
          <Route path="/opportunity-detail" element={
            (() => {
              const opp = opportunities.find(o => o.id === selectedOpportunityId);
              if (!opp) return <Navigate to="/portfolio" replace />;
              return (
                <OpportunityDetailPage 
                  opportunity={opp} 
                  onBack={() => navigate('/portfolio')} 
                  onInvest={handleInvest} 
                  isLoggedIn={isLoggedIn}
                  currentUser={currentUser}
                  formatCurrency={formatCurrency}
                  selectedCurrency={selectedCurrency}
                  t={t}
                />
              );
            })()
          } />
          
          <Route path="/login" element={
            isLoggedIn ? <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace /> :
            <AuthForm 
              type="login" 
              onToggleType={() => navigate('/register')} 
              onSuccess={(admin) => {
                setIsLoggedIn(true);
                setIsAdmin(admin);
                navigate(admin ? '/admin' : '/dashboard');
              }} t={t} 
            />
          } />
          
          <Route path="/register" element={
            isLoggedIn ? <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace /> :
            <AuthForm 
              type="register" 
              onToggleType={() => navigate('/login')} 
              onSuccess={(admin) => {
                setIsLoggedIn(true);
                setIsAdmin(admin);
                navigate(admin ? '/admin' : '/dashboard');
              }} t={t} 
            />
          } />

          <Route path="/dashboard" element={
            isLoggedIn ? 
            <UserDashboard 
              opportunities={opportunities} 
              userInvestments={userInvestments} 
              paymentHistory={paymentHistory}
              returns={returns}
              withdrawals={withdrawals}
              onWithdraw={handleWithdraw}
              onInvest={handleInvest}
              onDeposit={handleDeposit}
              investmentGoal={investmentGoal}
              onUpdateGoal={setInvestmentGoal}
              currentUser={currentUser}
              onUpdateProfile={handleUpdateProfile}
              onUploadKYC={handleUploadKYC}
              onLogout={handleLogout}
              activeTab={dashboardTab}
              onTabChange={setDashboardTab}
              onMarkNotificationRead={handleMarkNotificationRead}
              onNavigate={handleNavigate}
              partners={partners}
              formatCurrency={formatCurrency}
              t={t}
              language={language}
              onLanguageChange={setLanguage}
              selectedCurrency={selectedCurrency}
              onCurrencyChange={setSelectedCurrency}
              config={config}
            /> :
            <Navigate to="/login" replace />
          } />

          <Route path="/admin" element={
            isLoggedIn && isAdmin ?
            <AdminPanel 
              opportunities={opportunities} 
              investors={investors} 
              onAdd={handleSaveOpportunity}
              onDelete={handleDeleteOpportunity}
              onBulkDeleteOpps={handleBulkDeleteOpps}
              onBulkDeleteInvestors={handleBulkDeleteInvestors}
              onBulkApproveInvestors={handleBulkApproveInvestors}
              onBulkRejectInvestors={handleBulkRejectInvestors}
              onGiveReturn={handleGiveReturn}
              onSendKYCMessage={handleSendKYCMessage}
              onSaveInvestor={handleSaveInvestor}
              onDeleteInvestor={handleDeleteInvestor}
              onAddNotification={handleAddNotification}
              onInvest={handleInvest}
              onLogout={handleLogout}
              userInvestments={userInvestments}
              paymentHistory={paymentHistory}
              returns={returns}
              withdrawals={withdrawals}
              onUpdateWithdrawalStatus={handleUpdateWithdrawalStatus}
              testimonials={testimonials}
              onSaveTestimonial={handleSaveTestimonial}
              onDeleteTestimonial={handleDeleteTestimonial}
              partners={partners}
              onSavePartner={handleSavePartner}
              onDeletePartner={handleDeletePartner}
              teamMembers={teamMembers}
              onSaveTeamMember={handleSaveTeamMember}
              onDeleteTeamMember={handleDeleteTeamMember}
              faqs={faqs}
              onSaveFAQ={handleSaveFAQ}
              onDeleteFAQ={handleDeleteFAQ}
              faqCategories={faqCategories}
              onSaveFAQCategory={handleSaveFAQCategory}
              onDeleteFAQCategory={handleDeleteFAQCategory}
              blogs={blogs}
              onSaveBlog={handleSaveBlog}
              onDeleteBlog={handleDeleteBlog}
              formatCurrency={formatCurrency}
              t={t}
              config={config}
              onSaveConfig={setConfig}
            /> :
            <Navigate to="/login" replace />
          } />
        </Routes>
      </main>
      <Footer onNavigate={handleNavigate} logo={config.logo} />

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-4 bg-emerald-600 text-white rounded-full shadow-2xl z-[100] hover:bg-emerald-500 transition-colors"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
