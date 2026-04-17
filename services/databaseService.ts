
import { supabase } from "../src/lib/supabase";
import { 
  Opportunity, 
  Investor, 
  InvestmentRecord, 
  WithdrawalRecord, 
  ReturnRecord,
  Notification
} from "../types";

// --- Assets / Opportunities ---
export const getOpportunities = async (): Promise<Opportunity[]> => {
  const { data, error } = await supabase.from('assets').select('*');
  if (error) throw error;
  return data as Opportunity[];
};

export const saveOpportunity = async (opportunity: Opportunity) => {
  const { id, ...data } = opportunity;
  if (id && isNaN(Number(id))) {
     // If id is not a number, it might be a UUID from Firestore or something else.
     // In Supabase we'd typically use serial or uuid.
  }
  
  const { error } = await supabase.from('assets').upsert({ id, ...data });
  if (error) throw error;
};

export const deleteOpportunity = async (id: string) => {
  const { error } = await supabase.from('assets').delete().eq('id', id);
  if (error) throw error;
};

// --- Users / Investors ---
export const getInvestors = async (): Promise<Investor[]> => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw error;
  return data as Investor[];
};

export const getInvestorByUid = async (uid: string): Promise<Investor | null> => {
  const { data, error } = await supabase.from('users').select('*').eq('id', uid).single();
  if (error) {
    if (error.code === 'PGRST116') return null; // No rows found
    throw error;
  }
  return data as Investor;
};

export const saveInvestor = async (uid: string, investor: Partial<Investor>) => {
  const { error } = await supabase.from('users').upsert({ id: uid, ...investor });
  if (error) throw error;
};

// --- Investments ---
export const getInvestmentsByInvestor = async (investorId: string): Promise<InvestmentRecord[]> => {
  const { data, error } = await supabase.from('investments').select('*').eq('investorId', investorId);
  if (error) throw error;
  return data as InvestmentRecord[];
};

export const getAllInvestments = async (): Promise<InvestmentRecord[]> => {
  const { data, error } = await supabase.from('investments').select('*');
  if (error) throw error;
  return data as InvestmentRecord[];
};

export const addInvestment = async (investment: Omit<InvestmentRecord, "id">) => {
  const { data, error } = await supabase.from('investments').insert([investment]).select().single();
  if (error) throw error;
  return data;
};

// --- Withdrawals ---
export const getWithdrawalsByInvestor = async (investorId: string): Promise<WithdrawalRecord[]> => {
  const { data, error } = await supabase.from('withdrawals').select('*').eq('investorId', investorId);
  if (error) throw error;
  return data as WithdrawalRecord[];
};

export const getAllWithdrawals = async (): Promise<WithdrawalRecord[]> => {
  const { data, error } = await supabase.from('withdrawals').select('*');
  if (error) throw error;
  return data as WithdrawalRecord[];
};

export const addWithdrawal = async (withdrawal: Omit<WithdrawalRecord, "id">) => {
  const { data, error } = await supabase.from('withdrawals').insert([withdrawal]).select().single();
  if (error) throw error;
  return data;
};

export const updateWithdrawalStatus = async (id: string, status: string) => {
  const { error } = await supabase.from('withdrawals').update({ status, updatedAt: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
};

// --- Returns ---
export const getReturnsByInvestor = async (investorId: string): Promise<ReturnRecord[]> => {
  const { data, error } = await supabase.from('returns').select('*').eq('investorId', investorId);
  if (error) throw error;
  return data as ReturnRecord[];
};

export const addReturn = async (returnRecord: Omit<ReturnRecord, "id">) => {
  const { data, error } = await supabase.from('returns').insert([returnRecord]).select().single();
  if (error) throw error;
  return data;
};
