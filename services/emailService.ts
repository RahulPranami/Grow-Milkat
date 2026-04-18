
export type EmailType = 'OTP' | 'INVESTMENT_CERTIFICATE' | 'WITHDRAWAL' | 'KYC' | 'SUPPORT' | 'NOTIFICATION';

export const sendEmail = async (type: EmailType, payload: any) => {
  try {
    const response = await fetch('/api/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, payload })
    });
    return await response.json();
  } catch (err) {
    console.error("Email service error:", err);
    return { success: false, message: "Network error" };
  }
};
