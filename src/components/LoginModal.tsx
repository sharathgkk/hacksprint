import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  Building, 
  Lock, 
  Mail, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  X,
  Stethoscope
} from 'lucide-react';
import { UserSession, PortalType } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onLogin: (session: UserSession) => void;
  onClose?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<PortalType>('company');
  const [email, setEmail] = useState('investigator.sethi@claimguard-insurance.com');
  const [password, setPassword] = useState('SecurePass2026!');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Forgot password flow states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<'email' | 'verify' | 'reset' | 'success'>('email');
  const [forgotEmail, setForgotEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRoleSelect = (role: PortalType) => {
    setSelectedRole(role);
    setError(null);
    if (role === 'company') {
      setEmail('investigator.sethi@claimguard-insurance.com');
      setPassword('SecurePass2026!');
    } else {
      setEmail('billing.desk@apexhospital.org');
      setPassword('HospitalApex2026#');
    }
  };

  const handleResetPrefill = () => {
    handleRoleSelect(selectedRole);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (!email.trim() || !password.trim()) {
        setError('Please enter both email and password.');
        return;
      }

      if (selectedRole === 'company') {
        onLogin({
          email,
          name: 'Arjun Sethi, CPC',
          role: 'Lead Forensic Claims Investigator (SIU)',
          portalType: 'company',
          organization: 'Apex National Health Insurance SIU Unit'
        });
      } else {
        onLogin({
          email,
          name: 'Pooja Deshmukh',
          role: 'Hospital Compliance & Revenue Cycle Officer',
          portalType: 'provider',
          organization: 'Apex Multispecialty Hospital Compliance Desk'
        });
      }
    }, 400);
  };

  // Forgot password handler
  const handleForgotEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      setError('Please enter a valid organizational work email address.');
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setForgotStep('verify');
    setForgotMessage(`ClaimGuard Security: One-time verification passcode for ${forgotEmail} is ${code}. Valid for 10 minutes.`);
  };

  const handleVerifyCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.trim() !== generatedCode && verificationCode.trim() !== '748192') {
      setError('Invalid or expired verification code. Please check your passcode.');
      return;
    }
    setError(null);
    setForgotStep('reset');
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('The passwords entered do not match. Please re-enter.');
      return;
    }
    setPassword(newPassword);
    setForgotStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#06131e]/95 backdrop-blur-md clinical-grid overflow-y-auto">
      <div className="w-full max-w-md my-8 bg-slate-900/90 border border-teal-900/60 rounded-2xl shadow-2xl p-6 sm:p-8 relative">
        {/* Brand header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 via-teal-500 to-cyan-400 items-center justify-center text-white shadow-xl shadow-teal-500/25 mb-1">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            ClaimGuard <span className="text-teal-400">Clinical</span>
          </h1>
          <p className="text-xs text-teal-200/70 max-w-sm mx-auto">
            Healthcare Claims Forensic Intelligence, Hospital Review & Transparent Pricing Tiers
          </p>
        </div>

        {/* Role toggle */}
        <div className="p-1 bg-slate-950/80 rounded-xl border border-teal-950 grid grid-cols-2 gap-1 text-xs mb-5">
          <button
            type="button"
            onClick={() => handleRoleSelect('company')}
            className={`py-2.5 px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
              selectedRole === 'company'
                ? 'bg-teal-600 text-white shadow-md font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>The Company (SIU)</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect('provider')}
            className={`py-2.5 px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
              selectedRole === 'provider'
                ? 'bg-emerald-600 text-white shadow-md font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Hospitals & Clinics</span>
          </button>
        </div>

        {/* Role Info Box */}
        <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/50 text-xs mb-5">
          {selectedRole === 'company' ? (
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200 block">
                  Payer & Insurance Special Investigation Unit (SIU)
                </span>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Audits Government vs Private hospital classifications, enforces statutory price ceilings, inspects SHAP attributions, and adjudicates claims.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2.5">
              <Building2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200 block">
                  Hospital Compliance & Billing Provider Portal
                </span>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Allows hospitals to verify accredited pricing tiers, view itemized claim audits, and upload clinical justification in response to RFIs.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-300">
              Organizational Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500 transition-colors"
                placeholder="name@organization.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-medium text-slate-300">
                Security Passcode
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(true);
                  setForgotStep('email');
                  setForgotEmail(email);
                  setError(null);
                }}
                className="text-[11px] text-teal-400 hover:text-teal-300 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500 transition-colors"
                placeholder="••••••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 transition-colors shadow-lg shadow-teal-700/25 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <KeyRound className="w-3.5 h-3.5" />
                <span>Enter Forensic Clinical Gateway</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Account Footer */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
          <span>
            Demo Role:{' '}
            <strong className="text-slate-200">
              {selectedRole === 'company' ? 'SIU Auditor' : 'Apex Hospital'}
            </strong>
          </span>
          <button
            type="button"
            onClick={handleResetPrefill}
            className="text-teal-400 hover:text-teal-300 underline"
          >
            Reset Pre-fill
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden p-6 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-teal-400" />
                <span>Reset Security Credentials</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotMessage && (
              <div className="p-3 mb-4 rounded-lg bg-teal-950/60 border border-teal-800 text-teal-300 text-xs">
                {forgotMessage}
              </div>
            )}

            {forgotStep === 'email' && (
              <form onSubmit={handleForgotEmailSubmit} className="space-y-4">
                <p className="text-slate-400">
                  Enter your registered work email to receive a temporary 6-digit cryptographic verification code.
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
                  Enter the 6-digit passcode sent to your organizational email. (Demo passcode is shown above).
                </p>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Verification Code</label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="e.g. 748192"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono text-center tracking-widest text-base"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-teal-600 hover:bg-teal-500 font-semibold text-white rounded-lg"
                >
                  Verify Code
                </button>
              </form>
            )}

            {forgotStep === 'reset' && (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Confirm New Password</label>
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
                  Update Security Password
                </button>
              </form>
            )}

            {forgotStep === 'success' && (
              <div className="text-center py-4 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Password Updated Successfully</h4>
                <p className="text-slate-400">
                  Your credentials have been updated in the ClaimGuard Clinical Directory. You can now log in.
                </p>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 font-semibold text-white rounded-lg"
                >
                  Return to Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
