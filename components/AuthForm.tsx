
import React, { useState } from 'react';
import { Mail, Lock, User, Shield, ArrowRight, CheckCircle2, Smartphone, CreditCard, Landmark, Camera, FileText, Fingerprint } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as authService from '../services/authService';

interface AuthFormProps {
  type: 'login' | 'register';
  onSuccess: (isAdmin: boolean, userData?: { email: string; fullName?: string; referredBy?: string }) => void;
  onToggleType?: () => void;
  t: (key: string) => string;
}

type OnboardingStep = 'basic' | 'otp' | 'kyc' | 'payment' | 'complete';

const AuthForm: React.FC<AuthFormProps> = ({ type, onSuccess, onToggleType, t }) => {
  const [step, setStep] = useState<OnboardingStep>('basic');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [fullName, setFullName] = useState('');
  const [referredBy, setReferredBy] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [kycData, setKycData] = useState({ aadhaar: '', pan: '', address: '', facePhoto: null as string | null });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking' | null>(null);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const calculatePasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength += 20;
    if (/[A-Z]/.test(pass)) strength += 20;
    if (/[a-z]/.test(pass)) strength += 20;
    if (/[0-9]/.test(pass)) strength += 20;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 20;
    return strength;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (val && !validateEmail(val)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    if (type === 'register') {
      setPasswordStrength(calculatePasswordStrength(val));
    }
  };

  const handleBasicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailError) return;
    if (type === 'register' && passwordStrength < 60) {
      alert('Password is too weak. Please use a stronger password.');
      return;
    }
    
    if (type === 'login' || role === 'admin') {
      try {
        const user = await authService.logIn(email, password);
        // We'll let onAuthStateChange handle the state update in App.tsx, 
        // but we need to call onSuccess to navigate away
        onSuccess(role === 'admin', { email, fullName: user.displayName || email });
      } catch (err: any) {
        alert(err.message || "Login failed");
      }
    } else {
      setStep('otp');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleVerifyOtp = () => {
    setStep('kyc');
  };

  const handleKycSubmit = () => {
    setStep('payment');
  };

  const handlePaymentSubmit = async () => {
    try {
      await authService.signUp(email, password, fullName, role as any);
      setStep('complete');
      setTimeout(() => {
        onSuccess(false, { email, fullName, referredBy });
      }, 1500);
    } catch (err: any) {
      alert(err.message || "Registration failed");
    }
  };

  const renderBasicInfo = () => (
    <form className="space-y-6" onSubmit={handleBasicSubmit}>
      <div className="space-y-4">
        {type === 'register' && (
          <div className="relative group">
            <User className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-primary w-5 h-5 transition-colors" />
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="pl-11 block w-full px-3 py-3 border border-slate-200 rounded-xl focus:ring-primary/20 focus:border-primary outline-none transition-all focus:shadow-sm"
              placeholder="Full Name"
            />
          </div>
        )}
        {type === 'register' && (
          <div className="relative group">
            <User className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-primary w-5 h-5 transition-colors" />
            <input
              type="text"
              value={referredBy}
              onChange={(e) => setReferredBy(e.target.value)}
              className="pl-11 block w-full px-3 py-3 border border-slate-200 rounded-xl focus:ring-primary/20 focus:border-primary outline-none transition-all focus:shadow-sm"
              placeholder="Referral By (Optional)"
            />
          </div>
        )}
        <div className="relative group">
          <Mail className={`absolute left-3 top-3.5 w-5 h-5 transition-colors ${emailError ? 'text-rose-400' : 'text-slate-400 group-focus-within:text-primary'}`} />
          <input
            type="email"
            required
            value={email}
            onChange={handleEmailChange}
            className={`pl-11 block w-full px-3 py-3 border rounded-xl outline-none transition-all ${
              emailError 
                ? 'border-rose-300 bg-rose-50 focus:ring-rose-500/20 focus:border-rose-500' 
                : 'border-slate-200 focus:ring-primary/20 focus:border-primary focus:shadow-sm'
            }`}
            placeholder="Email address"
          />
          {emailError && <p className="mt-1 text-[10px] font-bold text-rose-500 uppercase tracking-widest ml-1">{emailError}</p>}
        </div>
        <div className="relative group">
          <Lock className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-primary w-5 h-5 transition-colors" />
          <input
            type="password"
            required
            value={password}
            onChange={handlePasswordChange}
            className="pl-11 block w-full px-3 py-3 border border-slate-200 rounded-xl focus:ring-primary/20 focus:border-primary outline-none transition-all focus:shadow-sm"
            placeholder="Password"
          />
          {type === 'register' && password && (
            <div className="mt-2 px-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Strength</span>
                <span className={`text-[9px] font-black uppercase tracking-widest ${
                  passwordStrength <= 40 ? 'text-rose-500' : passwordStrength <= 80 ? 'text-amber-500' : 'text-secondary'
                }`}>
                  {passwordStrength <= 40 ? 'Weak' : passwordStrength <= 80 ? 'Fair' : 'Strong'}
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    passwordStrength <= 40 ? 'bg-rose-500' : passwordStrength <= 80 ? 'bg-amber-500' : 'bg-secondary'
                  }`}
                  style={{ width: `${passwordStrength}%` }}
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="pt-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">I am an</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('user')}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                role === 'user' 
                  ? 'border-primary bg-primary/5 text-primary shadow-sm' 
                  : 'border-slate-100 text-slate-500 hover:border-slate-200'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="text-xs font-bold">Investor</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                role === 'admin' 
                  ? 'border-primary bg-primary/5 text-primary shadow-sm' 
                  : 'border-slate-100 text-slate-500 hover:border-slate-200'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span className="text-xs font-bold">Admin</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <button
          type="submit"
          className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition shadow-lg shadow-primary/20"
        >
          {type === 'login' ? 'Sign In' : 'Continue to Verification'}
          <ArrowRight className="ml-2 w-4 h-4" />
        </button>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-slate-500">Or continue with</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSuccess(false)}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
        >
          <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
          Google Account
        </button>
      </div>
    </form>
  );

  const renderOtpStep = () => (
    <div className="space-y-8 text-center">
      <div>
        <h3 className="text-xl font-bold text-slate-900 serif">Verify your Email</h3>
        <p className="text-sm text-slate-500 mt-2">We've sent a 6-digit code to {email}</p>
      </div>
      <div className="flex justify-center gap-2">
        {otp.map((digit, i) => (
          <input
            key={i}
            id={`otp-${i}`}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(i, e.target.value)}
            className="w-12 h-14 text-center text-xl font-bold border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-0 outline-none transition"
          />
        ))}
      </div>
      <button
        onClick={handleVerifyOtp}
        className="w-full py-3.5 px-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition shadow-lg shadow-primary/20"
      >
        Verify & Continue
      </button>
      <p className="text-sm text-slate-500">
        Didn't receive code? <button className="font-bold text-primary">Resend</button>
      </p>
    </div>
  );

  const renderKycStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-900 serif">KYC Verification</h3>
        <p className="text-sm text-slate-500 mt-2">Powered by DigiLocker for instant verification</p>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 bg-secondary/5 border border-secondary/10 rounded-xl flex items-center gap-4">
          <Fingerprint className="w-8 h-8 text-secondary" />
          <div>
            <p className="text-sm font-bold text-secondary">DigiLocker Integration</p>
            <p className="text-[10px] text-secondary/80">Securely fetch Aadhaar & PAN details</p>
          </div>
          <button className="ml-auto text-[10px] font-black uppercase tracking-widest bg-secondary text-white py-2 px-4 rounded-lg">Link</button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Aadhaar Number</label>
            <input 
              type="text" 
              placeholder="XXXX XXXX XXXX"
              className="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary"
              value={kycData.aadhaar}
              onChange={e => setKycData({...kycData, aadhaar: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">PAN Card</label>
            <input 
              type="text" 
              placeholder="ABCDE1234F"
              className="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary"
              value={kycData.pan}
              onChange={e => setKycData({...kycData, pan: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Address Proof</label>
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-primary transition cursor-pointer">
            <FileText className="w-6 h-6 text-slate-400 mx-auto mb-2" />
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Upload Utility Bill / Passport</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Face Verification</label>
          <div className="aspect-video bg-slate-100 rounded-xl flex flex-col items-center justify-center border border-slate-200">
            <Camera className="w-8 h-8 text-slate-400 mb-2" />
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Take a Selfie</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleKycSubmit}
        className="w-full py-3.5 px-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition shadow-lg shadow-primary/20"
      >
        Submit KYC Documents
      </button>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-900 serif">Link Payment Gateway</h3>
        <p className="text-sm text-slate-500 mt-2">Choose your preferred method for investments</p>
      </div>

      <div className="space-y-3">
        {[
          { id: 'card', icon: <CreditCard />, label: 'Credit / Debit Card', desc: 'Securely link via Stripe' },
          { id: 'upi', icon: <Smartphone />, label: 'UPI Transfer', desc: 'GPay, PhonePe, Paytm' },
          { id: 'netbanking', icon: <Landmark />, label: 'Net Banking', desc: 'Direct bank authorization' },
        ].map((method) => (
          <button
            key={method.id}
            onClick={() => setPaymentMethod(method.id as any)}
            className={`w-full p-4 border-2 rounded-2xl flex items-center gap-4 transition ${paymentMethod === method.id ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-200'}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === method.id ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
              {method.icon}
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-slate-900">{method.label}</p>
              <p className="text-[10px] text-slate-500">{method.desc}</p>
            </div>
            {paymentMethod === method.id && <CheckCircle2 className="ml-auto w-5 h-5 text-primary" />}
          </button>
        ))}
      </div>

      <button
        onClick={handlePaymentSubmit}
        disabled={!paymentMethod}
        className={`w-full py-3.5 px-4 font-bold rounded-xl transition shadow-lg ${paymentMethod ? 'bg-primary text-white hover:bg-primary/90 shadow-primary/20' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
      >
        Complete Setup
      </button>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="text-center py-8 space-y-6">
      <div className="w-20 h-20 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-12 h-12" />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-slate-900 serif">All Set!</h3>
        <p className="text-sm text-slate-500 mt-2">Your account is ready. Redirecting to your dashboard...</p>
      </div>
      <div className="flex justify-center">
        <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );

  const renderStepIndicator = () => {
    if (type === 'login' || step === 'complete') return null;
    const steps: { id: OnboardingStep; label: string }[] = [
      { id: 'basic', label: 'Account' },
      { id: 'otp', label: 'Verify' },
      { id: 'kyc', label: 'KYC' },
      { id: 'payment', label: 'Payment' }
    ];
    const currentIndex = steps.findIndex(s => s.id === step);

    return (
      <div className="flex items-center justify-between mb-8 px-2">
        {steps.map((s, i) => (
          <React.Fragment key={s.id}>
            <div className="flex flex-col items-center relative">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-500 ${
                i <= currentIndex ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-100 text-slate-400'
              }`}>
                {i < currentIndex ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`absolute -bottom-5 whitespace-nowrap text-[8px] font-black uppercase tracking-widest transition-colors duration-500 ${
                i <= currentIndex ? 'text-primary' : 'text-slate-400'
              }`}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-grow mx-2 h-0.5 bg-slate-100 relative overflow-hidden">
                <div 
                  className="absolute inset-0 bg-primary transition-all duration-700 ease-in-out"
                  style={{ width: i < currentIndex ? '100%' : '0%' }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8 bg-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden">
        {renderStepIndicator()}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 'basic' && (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 serif">
                    {type === 'login' ? 'Sign in to Grow Milkat' : 'Create your account'}
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-slate-500">
                    Start your journey toward financial freedom
                  </p>
                </div>
                {renderBasicInfo()}
              </>
            )}
            {step === 'otp' && renderOtpStep()}
            {step === 'kyc' && renderKycStep()}
            {step === 'payment' && renderPaymentStep()}
            {step === 'complete' && renderCompleteStep()}
          </motion.div>
        </AnimatePresence>

        {step === 'basic' && (
          <div className="text-center mt-6">
            <p className="text-sm text-slate-500">
              {type === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button 
                type="button" 
                onClick={onToggleType}
                className="ml-1 font-bold text-primary hover:text-primary/80"
              >
                {type === 'login' ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;

