
export enum InvestmentType {
  STARTUP = 'Start Up',
  COMMERCIAL_PROPERTY = 'Commercial Property',
  RESIDENTIAL_PROPERTY = 'Residential Property',
  LAND_PROPERTY = 'Land Property',
  HOTELS_PROPERTY = 'Hotels Property'
}

export enum ReturnType {
  SHORT_TERM = 'Short Term',
  LONG_TERM = 'Long Term',
  MONTHLY_RENT = 'Monthly Rent',
  YEARLY_RENT = 'Yearly Rent',
  DIVIDEND = 'Dividend',
  ROI = 'ROI'
}

export enum RiskLevel {
  LOW = 'Low',
  MODERATE = 'Moderate',
  HIGH = 'High'
}

export enum InvestmentStatus {
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
  PENDING = 'Pending',
  INACTIVE = 'Inactive'
}

export interface InvestmentRecord {
  id: string;
  investorId: string;
  opportunityId: string;
  opportunityTitle: string;
  amount: number;
  date: string;
  status: InvestmentStatus;
  type: InvestmentType;
}

export interface InvestmentGoal {
  targetValue: number;
  targetDate: string;
}

export interface KPI {
  label: string;
  value: string;
}

export interface Milestone {
  date: string;
  label: string;
  completed: boolean;
}

export interface TeamMember {
  id?: string;
  name: string;
  role: string;
  bio?: string;
  image: string;
  category?: 'leadership' | 'advisory' | 'operations';
  socials?: {
    linkedin?: string;
    x?: string;
    mail?: string;
    instagram?: string;
  };
}

export interface PartnerTeamMember {
  id: string;
  photo: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  address: string;
  signature?: string;
}

export interface Partner {
  id: string;
  legalCompanyName: string;
  email: string;
  phone: string;
  address: {
    fullAddress: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
  panNumber: string;
  gstNumber: string;
  website: string;
  logo?: string;
  about?: string;
  businessType?: string;
  associatedAssets?: string[];
  stampLogos?: string[];
  team: PartnerTeamMember[];
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  type: InvestmentType;
  returnType: ReturnType;
  minInvestment: number;
  targetAmount: number;
  raisedAmount: number;
  expectedROI: string;
  expectedIRR?: string;
  imageUrl: string;
  videoUrl?: string;
  pdfUrl?: string;
  location: string;
  riskLevel: RiskLevel;
  createdAt: string;
  kpis?: KPI[];
  milestones?: Milestone[];
  team?: TeamMember[];
  leadImageUrl?: string;
  // New Marketplace Properties
  partnerName: string;
  partnerDetailsUrl?: string;
  partnerLogoUrl?: string;
  assetClass: string;
  holdingPeriod: string;
  taxBenefits: string;
  payoutFrequency: string;
  publishedAt?: string;
  rentAmount?: number;
  rentPercentage?: number;
  dividendAmount?: number;
  dividendPercentage?: number;
  roiAmount?: number;
  roiPercentage?: number;
  assetID?: string;
}

export interface Address {
  street: string;
  city: string;
  pincode: string;
  state: string;
  country: string;
}

export interface PaymentMethod {
  id: string;
  type: 'Bank Transfer' | 'UPI' | 'Card' | 'Crypto';
  name: string;
  lastFour?: string;
  isLinked: boolean;
}

export interface KycMessage {
  id: string;
  type: 'Approval' | 'Rejection' | 'Reminder';
  content: string;
  date: string;
  read: boolean;
}

export enum NotificationType {
  KYC = 'KYC',
  RETURN = 'Return',
  INVESTMENT = 'Investment',
  OPPORTUNITY = 'New Opportunity',
  OTHER = 'Other'
}

export interface Notification {
  id: string;
  investorId: string;
  type: NotificationType;
  title: string;
  message: string;
  date: string;
  read: boolean;
  actionUrl?: string;
}

export interface Investor {
  id: string;
  investorUniqueId: string;
  name: string;
  email: string;
  password?: string;
  avatar: string;
  kycStatus: 'Verified' | 'Pending' | 'Rejected';
  totalInvested: number;
  activeAssets: number;
  riskProfile: 'Conservative' | 'Balanced' | 'Aggressive';
  joinedDate: string;
  phone: string;
  whatsapp?: string;
  address: Address;
  kycDocuments: string[];
  kycMessages?: KycMessage[];
  paymentMethods: PaymentMethod[];
  lastActive: string;
  totalReturns: number;
  notifications?: Notification[];
  preferences: {
    sectors: string[];
    minROI: number;
  };
  hasAcceptedLegal?: boolean;
}

export interface PaymentRecord {
  id: string;
  investorId: string;
  amount: number;
  date: string;
  method: string;
  status: 'Completed' | 'Pending' | 'Failed';
  type: 'Deposit' | 'Withdrawal';
}

export interface ReturnRecord {
  id: string;
  investorId: string;
  investmentId: string;
  investmentTitle: string;
  amount: number;
  date: string;
  type: 'Monthly Rent' | 'Yearly Rent' | 'ROI' | 'Dividend' | 'Short Term' | 'Long Term';
  withdrawalStatus?: WithdrawalStatus;
  withdrawalRequestedAt?: string;
}

export enum WithdrawalStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

export interface WithdrawalRecord {
  id: string;
  investorId: string;
  investmentId: string;
  returnId?: string; // Link to specific return if it's a returns withdrawal
  opportunityTitle: string;
  partnerName: string;
  location: string;
  type: InvestmentType;
  assetClass: string;
  returnType: string;
  holdingPeriod: string;
  payoutFrequency: string;
  expectedROI: string;
  expectedIRR: string;
  investmentAmount: number;
  totalGains?: number;
  withdrawnGains?: number;
  gainAmount: number;
  totalValue: number;
  withdrawalAmount: number;
  fineAmount: number;
  date: string;
  status: WithdrawalStatus;
  assetID?: string;
  isReturnsWithdrawal?: boolean; // Flag to distinguish from full withdrawal
}

export interface UserPortfolio {
  totalInvested: number;
  monthlyRevenue: number;
  investments: InvestmentRecord[];
  paymentHistory: PaymentRecord[];
  returns: ReturnRecord[];
  goal?: InvestmentGoal;
}

export enum TestimonialType {
  SUCCESS_STORY = 'Success Story',
  VIDEO = 'Video Testimonial'
}

export interface Testimonial {
  id: string;
  type: TestimonialType;
  name: string;
  role: string;
  company: string;
  avatar: string;
  successStory?: {
    amount: number;
    roi: string;
    month: string;
    year: string;
    propertyType?: InvestmentType;
    description: string;
    assetName: string;
    assetClass: string;
    holdingPeriod: string;
    returnType: string;
    monthlyReturn: number;
    yearlyRent: number;
    dividend: number;
    payout: string;
    location: string;
    paragraph?: string;
  };
  videoUrl?: string;
  imageUrl: string;
  textTestimonial?: string;
  rating?: number;
}

export interface BlogContentBlock {
  id: string;
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'paragraph' | 'image' | 'video' | 'pdf' | 'bullets' | 'numbers';
  content: string;
  items?: string[];
  caption?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  blocks?: BlogContentBlock[];
  author: string;
  authorRole: string;
  authorAvatar: string;
  date: string;
  category: 'Market Trends' | 'Education' | 'Assets Analysis' | 'Wealth Management';
  imageUrl: string;
  featuredImageUrl?: string;
  readTime: string;
  tags: string[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  categoryId: string;
}

export interface FAQCategory {
  id: string;
  name: string;
  icon?: string;
}

export interface LegalSection {
  id: string;
  title: string;
  content: string;
  items?: string[];
  type: 'paragraph' | 'bullets' | 'numbers';
}

export type View = 'home' | 'about' | 'why' | 'portfolio' | 'contact' | 'login' | 'register' | 'dashboard' | 'admin' | 'opportunity-detail' | 'testimonials' | 'testimonial-detail' | 'our-team' | 'faq' | 'our-partners' | 'privacy-policy' | 'terms-conditions' | 'blog' | 'blog-detail' | 'startup-investment' | 'security-trust' | 'how-it-works';

export type DashboardTab = 'dashboard' | 'market' | 'history' | 'payments' | 'kyc' | 'settings' | 'profile' | 'support' | 'notifications' | 'analysis' | 'waitlist';

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: any;
  }
}
