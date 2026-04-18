-- Drop existing tables to recreate with correct camelCase columns
DROP TABLE IF EXISTS returns CASCADE;
DROP TABLE IF EXISTS withdrawals CASCADE;
DROP TABLE IF EXISTS investments CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS assets CASCADE;

-- Assets / Opportunities
CREATE TABLE assets (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "type" TEXT,
  "returnType" TEXT,
  "minInvestment" NUMERIC,
  "targetAmount" NUMERIC,
  "raisedAmount" NUMERIC DEFAULT 0,
  "expectedROI" TEXT,
  "expectedIRR" TEXT,
  "imageUrl" TEXT,
  "videoUrl" TEXT,
  "pdfUrl" TEXT,
  "location" TEXT,
  "riskLevel" TEXT,
  "partnerName" TEXT,
  "assetClass" TEXT,
  "holdingPeriod" TEXT,
  "taxBenefits" TEXT,
  "payoutFrequency" TEXT,
  "assetID" TEXT,
  "kpis" JSONB,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

-- Users / Investors
CREATE TABLE users (
  "id" UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  "name" TEXT,
  "email" TEXT UNIQUE,
  "avatar" TEXT,
  "kycStatus" TEXT DEFAULT 'Pending',
  "totalInvested" NUMERIC DEFAULT 0,
  "activeAssets" INTEGER DEFAULT 0,
  "riskProfile" TEXT,
  "joinedDate" DATE DEFAULT current_date,
  "lastActive" TIMESTAMPTZ DEFAULT now(),
  "totalReturns" NUMERIC DEFAULT 0,
  "phone" TEXT,
  "whatsapp" TEXT,
  "address" JSONB,
  "kycDocuments" TEXT[],
  "paymentMethods" JSONB,
  "preferences" JSONB,
  "hasAcceptedLegal" BOOLEAN DEFAULT false,
  "role" TEXT DEFAULT 'investor',
  "walletBalance" NUMERIC DEFAULT 0,
  "referralCode" TEXT UNIQUE,
  "referredBy" TEXT,
  "kycMessages" JSONB DEFAULT '[]',
  "notifications" JSONB DEFAULT '[]'
);

-- Referrals Table
CREATE TABLE referrals (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "referrerId" UUID REFERENCES users("id") ON DELETE CASCADE,
  "referredId" UUID REFERENCES users("id") ON DELETE CASCADE,
  "status" TEXT DEFAULT 'Pending', -- 'Pending', 'Active' (after first investment)
  "rewardAmount" NUMERIC DEFAULT 0,
  "date" TIMESTAMPTZ DEFAULT now(),
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for referrals
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own referrals" ON referrals FOR SELECT USING (auth.uid() = "referrerId");

-- Wallet Transactions
CREATE TABLE wallet_transactions (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "investorId" UUID REFERENCES users("id") ON DELETE CASCADE,
  "amount" NUMERIC NOT NULL,
  "type" TEXT NOT NULL, -- 'Deposit', 'Investment', 'Withdrawal', 'Return', 'Referral'
  "status" TEXT DEFAULT 'Completed',
  "description" TEXT,
  "fee" NUMERIC DEFAULT 0,
  "date" TIMESTAMPTZ DEFAULT now(),
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for wallet_transactions
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own wallet transactions" ON wallet_transactions FOR SELECT USING (auth.uid() = "investorId");

-- Investments
CREATE TABLE investments (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "investorId" UUID REFERENCES users("id") ON DELETE CASCADE,
  "opportunityId" UUID REFERENCES assets("id") ON DELETE CASCADE,
  "opportunityTitle" TEXT,
  "amount" NUMERIC NOT NULL,
  "date" DATE DEFAULT current_date,
  "status" TEXT,
  "type" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

-- Withdrawals
CREATE TABLE withdrawals (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "investorId" UUID REFERENCES users("id") ON DELETE CASCADE,
  "investmentId" UUID REFERENCES investments("id") ON DELETE CASCADE,
  "opportunityId" UUID REFERENCES assets("id") ON DELETE CASCADE,
  "assetTitle" TEXT,
  "investmentAmount" NUMERIC,
  "withdrawalAmount" NUMERIC NOT NULL,
  "date" DATE DEFAULT current_date,
  "status" TEXT DEFAULT 'Pending',
  "isReturnsWithdrawal" BOOLEAN DEFAULT false,
  "returnId" UUID,
  "bankDetails" JSONB,
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  "updatedAt" TIMESTAMPTZ DEFAULT now()
);

-- Returns
CREATE TABLE returns (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "investorId" UUID REFERENCES users("id") ON DELETE CASCADE,
  "investmentId" UUID REFERENCES investments("id") ON DELETE CASCADE,
  "investmentTitle" TEXT,
  "amount" NUMERIC NOT NULL,
  "date" DATE DEFAULT current_date,
  "type" TEXT,
  "withdrawalStatus" TEXT DEFAULT 'Available',
  "withdrawalRequestedAt" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

-- Partners
CREATE TABLE partners (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "legalCompanyName" TEXT NOT NULL,
  "description" TEXT,
  "logo" TEXT,
  "website" TEXT,
  "headquarters" TEXT,
  "foundedYear" TEXT,
  "totalAssetsManaged" NUMERIC,
  "specialization" TEXT[],
  "contactEmail" TEXT,
  "contactPhone" TEXT,
  "team" JSONB DEFAULT '[]',
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Policies (Basic - can be refined)
CREATE POLICY "Public assets are viewable by everyone" ON assets FOR SELECT USING (true);
CREATE POLICY "Public partners are viewable by everyone" ON partners FOR SELECT USING (true);
CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid() = "id");
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (auth.uid() = "id");
CREATE POLICY "Users can view their own investments" ON investments FOR SELECT USING (auth.uid() = "investorId");
CREATE POLICY "Users can view their own withdrawals" ON withdrawals FOR SELECT USING (auth.uid() = "investorId");
CREATE POLICY "Users can view their own returns" ON returns FOR SELECT USING (auth.uid() = "investorId");
