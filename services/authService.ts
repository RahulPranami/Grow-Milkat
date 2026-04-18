
import { supabase } from "../src/lib/supabase";
import { getInvestorByUid, saveInvestor } from "./databaseService";
import { Investor } from "../types";

export const signUp = async (email: string, pass: string, fullName: string, role: 'admin' | 'investor' = 'investor', referredByCode?: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password: pass,
    options: {
      data: {
        full_name: fullName,
        role: role
      }
    }
  });
  
  if (error) throw error;
  if (!data.user) throw new Error("User creation failed");

  const referralCode = fullName.split(' ')[0].toUpperCase() + Math.floor(1000 + Math.random() * 9000);

  // Link to referrer if code provided
  let referredByUserId = null;
  if (referredByCode) {
    const { data: referrer } = await supabase
      .from('users')
      .select('id')
      .eq('referralCode', referredByCode)
      .single();
    if (referrer) {
      referredByUserId = referrer.id;
    }
  }

  const investorData: Partial<Investor> = {
    name: fullName,
    email: email,
    kycStatus: 'Pending',
    totalInvested: 0,
    activeAssets: 0,
    totalReturns: 0,
    walletBalance: 0,
    referralCode: referralCode,
    referredBy: referredByCode,
    joinedDate: new Date().toISOString().split('T')[0],
    role: role
  };

  await saveInvestor(data.user.id, investorData);

  // Create referral record
  if (referredByUserId) {
    await supabase.from('referrals').insert({
      referrerId: referredByUserId,
      referredId: data.user.id,
      status: 'Pending'
    });
  }

  return data.user;
};

export const logIn = async (email: string, pass: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: pass
  });
  if (error) throw error;
  return data.user;
};

export const logOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const subscribeToAuthChanges = (callback: (user: any) => void) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null);
  });
  return subscription.unsubscribe;
};
