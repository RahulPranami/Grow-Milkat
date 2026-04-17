import { WithdrawalRecord, WithdrawalStatus, ReturnRecord, InvestmentStatus } from '../../types';

/**
 * Logic:
 * 1. If any withdrawal for this investment is 'APPROVED', no more withdrawals are allowed.
 * 2. If withdrawals are 'REJECTED' or 'PENDING', the investor can still see the option (though pending might disable it temporarily).
 * 3. The specific request says: "Investors can Withdraw second time or more if Reject by admin, if Approval by admin Investors can not do again for particular assets."
 */
export const canWithdrawFromInvestment = (investmentId: string, withdrawals: WithdrawalRecord[]): boolean => {
  const investmentWithdrawals = withdrawals.filter(w => w.investmentId === investmentId && !w.isReturnsWithdrawal);
  
  // Check if there's any approved or pending full withdrawal
  // Investors can only re-attempt if the previous one was REJECTED.
  const hasApprovedOrPending = investmentWithdrawals.some(w => 
    w.status === WithdrawalStatus.APPROVED || w.status === WithdrawalStatus.PENDING
  );
  
  if (hasApprovedOrPending) {
    return false;
  }

  return true;
};

export const getWithdrawalStatusMessage = (investmentId: string, withdrawals: WithdrawalRecord[]): string | null => {
  const investmentWithdrawals = withdrawals.filter(w => w.investmentId === investmentId && !w.isReturnsWithdrawal);
  
  if (investmentWithdrawals.some(w => w.status === WithdrawalStatus.APPROVED)) {
    return "This asset has already been withdrawn.";
  }
  
  if (investmentWithdrawals.some(w => w.status === WithdrawalStatus.PENDING)) {
    return "You have a pending withdrawal request for this asset.";
  }

  return null;
};

export const canWithdrawReturn = (returnRecord: ReturnRecord, investmentStatus: InvestmentStatus): boolean => {
  // Inactive Status Restriction
  if (investmentStatus === InvestmentStatus.INACTIVE) {
    return false;
  }

  // One-Time Withdrawal Rule per return cycle
  // If status is APPROVED, they can't withdraw again.
  // If status is PENDING, they can't withdraw again until it's processed.
  // If status is REJECTED, they CAN withdraw again.
  if (returnRecord.withdrawalStatus === WithdrawalStatus.APPROVED || 
      returnRecord.withdrawalStatus === WithdrawalStatus.PENDING) {
    return false;
  }

  return true;
};

export const getReturnWithdrawalStatusMessage = (returnRecord: ReturnRecord, investmentStatus: InvestmentStatus): string | null => {
  if (investmentStatus === InvestmentStatus.INACTIVE) {
    return "Investment is inactive. Withdrawal disabled.";
  }

  if (returnRecord.withdrawalStatus === WithdrawalStatus.APPROVED) {
    return "This return has already been withdrawn.";
  }

  if (returnRecord.withdrawalStatus === WithdrawalStatus.PENDING) {
    return "Withdrawal request is pending.";
  }

  return null;
};
