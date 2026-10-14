import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  Landmark, 
  Lock, 
  Mail, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  X,
  Activity,
  ArrowRight,
  Scale,
  Sparkles,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  FileCheck2,
  Clock,
  Check
} from 'lucide-react';
import { UserSession, PortalType, HospitalType } from '../types';

interface LoginScreenProps {
  onLogin: (session: UserSession) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [role, setRole] = useState<PortalType>('company');
  const [email, setEmail] = useState('investigator.sethi@claimguard-insurance.com');
  const [password, setPassword] = useState('SecurePass2026!');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Provider Landing interactive demo widget state
  const [demoHospType, setDemoHospType] = useState<HospitalType>('private');
  const [demoProcedure, setDemoProcedure] = useState('33533');
  const [demoBilled, setDemoBilled] = useState<number>(245000);

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<'email' | 'verify' | 'reset' | 'success'>('email');
  const [forgotEmail, setForgotEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('748192');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotNotice, setForgotNotice] = useState<string | null>(null);

  const handleRoleChange = (newRole: PortalType) => {
    setRole(newRole);
    setErrorMessage(null);
    if (newRole === 'company') {
      setEmail('investigator.sethi@claimguard-insurance.com');
      setPassword('SecurePass2026!');
    } else {
      setEmail('billing.desk@apexhospital.org');
      setPassword('HospitalApex2026#');
    }
  };

  const handleResetPrefill = () => {
    handleRoleChange(role);
  };

  const handleGoogleSignIn = () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setTimeout(() => {
      setIsSubmitting(false);
      if (role === 'company') {
        onLogin({
          email: 'vikram.sethi@claimguard-insurance.com',
          name: 'Vikram Sethi (Google)',
          role: 'Lead Claims Examiner & SIU Auditor',
          portalType: 'company',
          organization: 'ClaimGuard General Health Insurance SIU'
        });
      } else {
        onLogin({
          email: 'anita.deshpande@apexhospital.org',
          name: 'Dr. Anita Deshpande (Google)',
          role: 'Hospital Revenue Cycle & Compliance Officer',
          portalType: 'provider',
          organization: 'Apex Multispecialty Hospital'
        });
      }
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both your work email and password.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (role === 'company') {
        onLogin({
          email: email.trim(),
          name: 'Vikram Sethi',
          role: 'insurer_auditor',
          portalType: 'company',
          organization: 'ClaimGuard General Health Insurance'
        });
      } else {
        onLogin({
          email: email.trim(),
          name: 'Apex Hospital Billing Desk',
          role: 'healthcare_provider',
          portalType: 'provider',
          organization: 'Apex Multispecialty Hospital'
        });
      }
    }, 500);
  };

  // Forgot password handlers
  const handleForgotEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      setForgotError('Please enter a valid organizational work email address.');
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setForgotStep('verify');
    setForgotNotice(`ClaimGuard Security: One-time verification passcode for ${forgotEmail} is ${code}. Expires in 10 minutes.`);
  };

  const handleVerifyCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    if (verificationCode.trim() !== generatedCode && verificationCode.trim() !== '748192') {
      setForgotError('Invalid or expired verification code. Please check your email or click resend.');
      return;
    }
    setForgotStep('reset');
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    if (newPassword.length < 8) {
      setForgotError('Password must contain at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setForgotError('The passwords entered do not match. Please re-enter.');
      return;
    }
    setPassword(newPassword);
    setForgotStep('success');
  };

  // Provider interactive pre-flight calculation
  const getDemoProcedureCap = () => {
    if (demoProcedure === '33533') return demoHospType === 'government' ? 55000 : 220000;
    if (demoProcedure === '70553') return demoHospType === 'government' ? 2200 : 7500;
    if (demoProcedure === '66984') return demoHospType === 'government' ? 14000 : 38000;
    if (demoProcedure === '27447') return demoHospType === 'government' ? 65000 : 160000;
    return demoHospType === 'government' ? 45000 : 180000;
  };
  const demoCap = getDemoProcedureCap();
  const demoExceeds = demoBilled > demoCap;
  const demoExcess = Math.max(0, demoBilled - demoCap);

  return (
    <div className={`min-h-screen text-slate-100 flex flex-col justify-between selection:bg-teal-500/30 selection:text-white transition-colors duration-300 ${
      role === 'company' 
        ? 'bg-[#06131e] clinical-grid' 
        : 'bg-[#051817] provider-grid'
    }`}>
      {/* Top Header */}
      <header className={`border-b px-6 py-4 flex items-center justify-between backdrop-blur sticky top-0 z-30 ${
        role === 'company'
          ? 'border-teal-950/80 bg-[#06131e]/90'
          : 'border-emerald-950/80 bg-[#051817]/90'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md ${
            role === 'company'
              ? 'bg-gradient-to-tr from-teal-600 via-teal-500 to-cyan-400 shadow-teal-500/20'
              : 'bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 shadow-emerald-500/20'
          }`}>
            {role === 'company' ? <ShieldCheck className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
          </div>
          <div>
            <div className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>ClaimGuard</span>
              <span className={role === 'company' ? 'text-teal-400' : 'text-emerald-400'}>
                {role === 'company' ? 'Clinical' : 'Health'}
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400">
              {role === 'company' ? 'Payer SIU Intelligence Portal' : 'Hospital & Clinic Tariff Desk'}
            </p>
          </div>
        </div>

        {/* Top Role Switcher Pills */}
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => handleRoleChange('company')}
              className={`py-1.5 px-3 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                role === 'company'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>The Company (Insurer / SIU)</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('provider')}
              className={`py-1.5 px-3 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                role === 'provider'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Hospitals & Clinics</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 pl-2 border-l border-slate-800">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>IRDAI & HIPAA Verified</span>
          </div>
        </div>
      </header>

      {/* Main Dual-View Body */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 my-auto">
        {/* ========================================================================= */}
        {/* VIEW 1: THE COMPANY (INSURER / SIU) LANDING PAGE                          */}
        {/* ========================================================================= */}
        {role === 'company' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Company / SIU Hero & Live Threat Feed */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-teal-950/80 border border-teal-800 text-teal-300">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  <span>PAYER & CLAIMS FORENSIC SURVEILLANCE SUITE</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Healthcare Claims Anomaly Detection & Clinical Fraud Review
                </h1>
                <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                  Autonomous dual-engine anomaly scoring, SHAP explainable AI attribution, and statutory Government vs Private price cap enforcement for insurance payers, medical auditors, and Special Investigation Units (SIU).
                </p>
              </div>

              {/* SIU Live Metrics Banner */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-teal-900/60 shadow">
                  <div className="text-[11px] text-slate-400">Ineligible Surcharges Blocked</div>
                  <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">₹2,410,000+</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Statutory tariff disallowances</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-teal-900/60 shadow">
                  <div className="text-[11px] text-slate-400">ML Scoring Accuracy</div>
                  <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">99.4%</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Dual-engine cross-validation</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-teal-900/60 shadow">
                  <div className="text-[11px] text-slate-400">Audit Trail Integrity</div>
                  <div className="text-xl font-bold font-mono text-teal-300 mt-0.5">100%</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">SHA-256 tamper-proof logs</div>
                </div>
              </div>

              {/* Interactive Live Threat Radar Feed (Company Specific) */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-teal-950/80 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                    <span>Live Claims Surveillance Feed (Sample Ingestion)</span>
                  </span>
                  <span className="text-[10px] font-mono text-teal-400">Active Real-Time Stream</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-rose-900/40 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-teal-400 font-bold">CLM-1104</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-rose-950 text-rose-300 border border-rose-800">
                          Critical Anomaly (96/100)
                        </span>
                        <span className="text-[10px] text-slate-400">Devika Rao (62y)</span>
                      </div>
                      <div className="text-[11px] text-slate-300 mt-0.5 truncate">
                        Diagnosis: Acute Bronchitis vs Billed Procedure: CABG Open Heart Bypass (₹380,000)
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-rose-400 shrink-0">Overbilled ₹160,000</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-amber-900/40 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-teal-400 font-bold">CLM-1108</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-800">
                          Tariff Ceiling Breach (89/100)
                        </span>
                        <span className="text-[10px] text-slate-400">Rajesh Kumar (45y)</span>
                      </div>
                      <div className="text-[11px] text-slate-300 mt-0.5 truncate">
                        Private Facility billed MRI at ₹18,500 (Mandated Cap: ₹7,500)
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-amber-400 shrink-0">Disallowance ₹11,000</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                  <span>Auditor Workflow: Ingest EDI 837 → Score Anomaly → Inspect SHAP → Adjudicate</span>
                  <span className="text-teal-400 font-semibold">1-Click PDF Orders</span>
                </div>
              </div>
            </div>

            {/* Right Column: Company Workstation Login Card */}
            <div className="lg:col-span-5 space-y-4">
              {/* Instant 1-Click Launch */}
              <div className="p-4 rounded-2xl border border-teal-900/70 bg-gradient-to-b from-slate-900/90 to-slate-950/90 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-teal-400" />
                    <span>Instant Insurer Workspace Launch</span>
                  </span>
                  <span className="text-[10px] font-mono text-teal-400 px-2 py-0.5 rounded bg-teal-950 border border-teal-800">
                    One-Click Demo
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Jump directly into the Clinical Workbench Queue, review flagged fraud cases, and adjudicate statutory tariffs.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onLogin({
                      email: 'investigator.sethi@claimguard-insurance.com',
                      name: 'Vikram Sethi',
                      role: 'insurer_auditor',
                      portalType: 'company',
                      organization: 'ClaimGuard General Health Insurance SIU'
                    });
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 hover:from-teal-500 hover:to-cyan-400 text-white font-bold text-xs transition-all shadow-lg shadow-teal-600/30 flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Enter as Lead SIU Auditor (Vikram Sethi)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Secure Credentials Sign In */}
              <div className="bg-slate-900/80 border border-teal-900/40 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Insurer Examiner Sign-In</h3>
                  <span className="text-[10px] text-slate-400 font-mono">Work ID</span>
                </div>

                {/* Sign in with Google */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-xl border border-teal-900/60 bg-slate-950 hover:bg-slate-800 text-xs font-semibold text-slate-200 flex items-center justify-center gap-3 transition-colors shadow-sm disabled:opacity-50"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Sign in with Company Google SSO</span>
                </button>

                <div className="relative flex items-center justify-center">
                  <div className="border-t border-slate-800 w-full" />
                  <span className="bg-slate-900 px-3 text-[10px] text-teal-400/80 uppercase tracking-wider font-mono">
                    or SIU Credentials
                  </span>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-lg bg-rose-950/70 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="text-[11px] font-medium text-slate-300 block mb-1">
                      SIU Officer Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-medium text-slate-300">
                        Security Passcode
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotEmail(email);
                          setForgotStep('email');
                          setShowForgotModal(true);
                        }}
                        className="text-[11px] text-teal-400 hover:underline"
                      >
                        Forgot?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-lg text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 transition-colors shadow-lg shadow-teal-700/25 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Sign In to Insurer SIU Gateway</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Switcher Footer */}
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Need hospital billing portal?</span>
                  <button
                    type="button"
                    onClick={() => handleRoleChange('provider')}
                    className="text-teal-400 hover:text-teal-300 font-semibold underline"
                  >
                    Switch to Hospitals & Clinics →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: HOSPITALS & CLINICS (PROVIDER) LANDING PAGE                       */}
        {/* ========================================================================= */}
        {role === 'provider' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Hospital & Transparent Pricing Hero & Live Pre-Flight Widget */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950/80 border border-emerald-800 text-emerald-300">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <span>HEALTHCARE PROVIDER NETWORK & TARIFF COMPLIANCE DESK</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Hospital Billing Command Center & Transparent Tariff Adherence
                </h1>
                <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                  Pre-submission price ceiling validation against CGHS Government schedules and NABH Private hospital caps. Eliminate billing disputes, ensure transparent pricing tiers for patients, and fast-track insurance reimbursements.
                </p>
              </div>

              {/* Provider Live Metrics Banner */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-900/60 shadow">
                  <div className="text-[11px] text-slate-400">Pre-Flight Tariff Check</div>
                  <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">100%</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Zero overcharge penalties</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-900/60 shadow">
                  <div className="text-[11px] text-slate-400">Mandated Rate Protection</div>
                  <div className="text-xl font-bold font-mono text-teal-300 mt-0.5">Gov vs Priv</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Enforced pricing tiers</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-900/60 shadow">
                  <div className="text-[11px] text-slate-400">RFI Record Resolution</div>
                  <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">&lt; 24h</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Fast-track claim release</div>
                </div>
              </div>

              {/* Interactive Pre-Submission Tariff Pre-Flight Simulator (Provider Specific) */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-900/70 space-y-3.5 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <Scale className="w-4 h-4 text-emerald-400" />
                    <span>Interactive Pre-Submission Price Cap Checker</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    Live Simulator
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Hospital Type Selection */}
                  <div>
                    <label className="text-[11px] font-medium text-slate-300 block mb-1">
                      1. Confirm Facility Type
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setDemoHospType('government')}
                        className={`py-1.5 px-2.5 rounded-lg flex items-center justify-center gap-1.5 font-semibold text-[11px] transition-all ${
                          demoHospType === 'government'
                            ? 'bg-emerald-600 text-white shadow'
                            : 'bg-slate-950 text-slate-400 border border-slate-800'
                        }`}
                      >
                        <Landmark className="w-3 h-3" />
                        <span>Government</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDemoHospType('private')}
                        className={`py-1.5 px-2.5 rounded-lg flex items-center justify-center gap-1.5 font-semibold text-[11px] transition-all ${
                          demoHospType === 'private'
                            ? 'bg-cyan-600 text-white shadow'
                            : 'bg-slate-950 text-slate-400 border border-slate-800'
                        }`}
                      >
                        <Building2 className="w-3 h-3" />
                        <span>Private</span>
                      </button>
                    </div>
                  </div>

                  {/* Procedure */}
                  <div>
                    <label className="text-[11px] font-medium text-slate-300 block mb-1">
                      2. Procedure Code
                    </label>
                    <select
                      value={demoProcedure}
                      onChange={(e) => setDemoProcedure(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs"
                    >
                      <option value="33533">CABG Coronary Bypass (33533)</option>
                      <option value="70553">Brain MRI with Contrast (70553)</option>
                      <option value="66984">Cataract Phaco Surgery (66984)</option>
                      <option value="27447">Total Knee Arthroplasty (27447)</option>
                    </select>
                  </div>
                </div>

                {/* Billed Amount Input & Dynamic Result */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">
                      Mandated Maximum Legal Ceiling ({demoHospType.toUpperCase()}):
                    </span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      ₹{demoCap.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <label className="text-[11px] text-slate-300">Test Inpatient Billed Charge (₹):</label>
                    <input
                      type="number"
                      value={demoBilled}
                      onChange={(e) => setDemoBilled(Number(e.target.value))}
                      className="w-36 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-right font-mono text-xs text-white"
                    />
                  </div>

                  {demoExceeds ? (
                    <div className="p-2 rounded-lg bg-rose-950/80 border border-rose-800 text-[11px] text-rose-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                        <span>Exceeds Legal Cap by ₹{demoExcess.toLocaleString('en-IN')}</span>
                      </span>
                      <span className="font-bold underline text-rose-200">Pre-Flight Blocked</span>
                    </div>
                  ) : (
                    <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-800 text-[11px] text-emerald-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                        <span>Compliant with {demoHospType === 'government' ? 'Government CGHS' : 'Private NABH'} Cap</span>
                      </span>
                      <span className="font-bold text-emerald-400">Ready to Submit</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Hospital Workstation Login Card */}
            <div className="lg:col-span-5 space-y-4">
              {/* Instant 1-Click Launch */}
              <div className="p-4 rounded-2xl border border-emerald-900/70 bg-gradient-to-b from-slate-900/90 to-slate-950/90 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-emerald-400" />
                    <span>Instant Hospital Command Center Launch</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                    One-Click Demo
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Jump directly into Apex Multispecialty Hospital's Command Center, run pre-flight tariff checks, and respond to insurer RFIs.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onLogin({
                      email: 'billing.desk@apexhospital.org',
                      name: 'Dr. Anita Deshpande',
                      role: 'healthcare_provider',
                      portalType: 'provider',
                      organization: 'Apex Multispecialty Hospital'
                    });
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Enter as Hospital Desk (Dr. Anita Deshpande)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Secure Credentials Sign In */}
              <div className="bg-slate-900/80 border border-emerald-900/40 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Hospital Staff Sign-In</h3>
                  <span className="text-[10px] text-slate-400 font-mono">Hospital Workstation</span>
                </div>

                {/* Sign in with Google */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-xl border border-emerald-900/60 bg-slate-950 hover:bg-slate-800 text-xs font-semibold text-slate-200 flex items-center justify-center gap-3 transition-colors shadow-sm disabled:opacity-50"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Sign in with Hospital Staff Google SSO</span>
                </button>

                <div className="relative flex items-center justify-center">
                  <div className="border-t border-slate-800 w-full" />
                  <span className="bg-slate-900 px-3 text-[10px] text-emerald-400/80 uppercase tracking-wider font-mono">
                    or Hospital Staff Passcode
                  </span>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-lg bg-rose-950/70 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="text-[11px] font-medium text-slate-300 block mb-1">
                      Billing Desk Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-medium text-slate-300">
                        Workstation Passcode
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotEmail(email);
                          setForgotStep('email');
                          setShowForgotModal(true);
                        }}
                        className="text-[11px] text-emerald-400 hover:underline"
                      >
                        Forgot?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-700/25 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Sign In to Hospital Billing Desk</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Switcher Footer */}
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Need insurer SIU portal?</span>
                  <button
                    type="button"
                    onClick={() => handleRoleChange('company')}
                    className="text-emerald-400 hover:text-emerald-300 font-semibold underline"
                  >
                    Switch to The Company (SIU) →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Official Footer */}
      <footer className={`border-t px-6 py-4 backdrop-blur text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3 ${
        role === 'company'
          ? 'border-teal-950/80 bg-[#06131e]/90'
          : 'border-emerald-950/80 bg-[#051817]/90'
      }`}>
        <div className="flex items-center gap-2 text-slate-400 text-[11px]">
          <span className="font-semibold text-slate-300">
            {role === 'company' ? 'ClaimGuard Clinical (Payer SIU)' : 'ClaimGuard Health (Provider Network)'}
          </span>
          <span>·</span>
          <span>Healthcare Claims Integrity & Transparent Pricing Tiers</span>
        </div>

        <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
          <span>CMS / IRDAI Crosswalk v2.4</span>
          <span>·</span>
          <span className={role === 'company' ? 'text-teal-400' : 'text-emerald-400'}>
            HIPAA & Telemetry Verified
          </span>
        </div>
      </footer>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-md w-full shadow-2xl p-6 text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-teal-400" />
                <span>Reset Security Passcode</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotNotice && (
              <div className="p-3 rounded-lg bg-teal-950/60 border border-teal-800 text-teal-300 text-xs">
                {forgotNotice}
              </div>
            )}

            {forgotError && (
              <div className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{forgotError}</span>
              </div>
            )}

            {forgotStep === 'email' && (
              <form onSubmit={handleForgotEmailSubmit} className="space-y-4">
                <p className="text-slate-400">
                  Enter your registered work email to receive a temporary 6-digit cryptographic verification passcode.
                </p>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Work Email</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-teal-600 hover:bg-teal-500 font-semibold text-white rounded-lg"
                >
                  Send Verification Code
                </button>
              </form>
            )}

            {forgotStep === 'verify' && (
              <form onSubmit={handleVerifyCodeSubmit} className="space-y-4">
                <p className="text-slate-400">
                  Enter the 6-digit passcode sent to your organizational email. (Demo passcode: <strong>748192</strong>).
                </p>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Passcode</label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="748192"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono text-center tracking-widest text-base"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-teal-600 hover:bg-teal-500 font-semibold text-white rounded-lg"
                >
                  Verify Passcode
                </button>
              </form>
            )}

            {forgotStep === 'reset' && (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">New Passcode</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Confirm New Passcode</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-teal-600 hover:bg-teal-500 font-semibold text-white rounded-lg"
                >
                  Update Passcode
                </button>
              </form>
            )}

            {forgotStep === 'success' && (
              <div className="text-center py-4 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Passcode Updated Successfully</h4>
                <p className="text-slate-400">
                  Your credentials have been updated in the ClaimGuard Directory. You can now log in.
                </p>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 font-semibold text-white rounded-lg"
                >
                  Return to Gateway
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
