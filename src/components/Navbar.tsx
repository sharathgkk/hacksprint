import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  Landmark, 
  Activity, 
  RefreshCw, 
  LogOut, 
  FilePlus, 
  Search, 
  Menu,
  ChevronRight,
  Scale,
  HelpCircle,
  X,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { UserSession, PortalType } from '../types';

interface NavbarProps {
  activeTab: string;
  categoryTitle: string;
  subTitle: string;
  currency: 'INR' | 'USD';
  setCurrency: (c: 'INR' | 'USD') => void;
  currentUser: UserSession;
  onSwitchPortal: () => void;
  onLogout: () => void;
  onOpenNewClaimModal: () => void;
  onOpenHospitalTariffModal: () => void;
  onToggleMobileMenu: () => void;
  pendingCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  categoryTitle,
  subTitle,
  currency,
  setCurrency,
  currentUser,
  onSwitchPortal,
  onLogout,
  onOpenNewClaimModal,
  onOpenHospitalTariffModal,
  onToggleMobileMenu,
  pendingCount
}) => {
  const [showGuideModal, setShowGuideModal] = useState(false);
  const isCompany = currentUser.portalType === 'company';

  return (
    <>
      <header className="border-b border-teal-950/70 bg-[#06131e]/95 backdrop-blur-md sticky top-0 z-30 transition-colors">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-16">
            {/* Left: Mobile hamburger & Brand */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={onToggleMobileMenu}
                className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900 border border-teal-900/60 hover:bg-slate-800 transition-colors shrink-0"
                title="Open Navigation Menu"
              >
                <Menu className="w-5 h-5 text-teal-400" />
              </button>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 via-teal-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-teal-500/20 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-teal-400/90 leading-tight">
                    <span className="font-bold text-white tracking-tight">ClaimGuard</span>
                    <span className="text-teal-400 font-bold">Clinical</span>
                    <ChevronRight className="w-3 h-3 text-slate-600 hidden sm:inline" />
                    <span className={`hidden sm:inline px-1.5 py-0.2 rounded border text-[10px] ${
                      isCompany
                        ? 'bg-teal-950/80 border-teal-800/60 text-teal-300'
                        : 'bg-emerald-950/80 border-emerald-800/60 text-emerald-300'
                    }`}>
                      {isCompany ? 'IRDAI & SIU Payer Guard' : 'Hospital Provider Workstation'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm sm:text-base font-semibold text-slate-100 truncate">
                      {subTitle}
                    </h2>
                    <span className={`hidden md:inline-block text-[10px] uppercase font-mono px-2 py-0.5 rounded-full border ${
                      isCompany
                        ? 'bg-slate-800/80 text-teal-300 border-slate-700/60'
                        : 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60'
                    }`}>
                      {categoryTitle}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* User Guide & Help Modal */}
              <button
                type="button"
                onClick={() => setShowGuideModal(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-teal-300 bg-teal-950/50 hover:bg-teal-900/60 border border-teal-800/60 transition-colors"
                title="System Guide & Feature Explanations"
              >
                <HelpCircle className="w-3.5 h-3.5 text-teal-400" />
                <span className="hidden sm:inline">How It Works</span>
              </button>

              {/* Quick Action: Price Tier Checker */}
              <button
                type="button"
                onClick={onOpenHospitalTariffModal}
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors shadow-sm ${
                  isCompany
                    ? 'text-amber-200 bg-amber-950/50 hover:bg-amber-900/60 border-amber-800/60'
                    : 'text-teal-200 bg-teal-950/50 hover:bg-teal-900/60 border-teal-800/60'
                }`}
                title="Verify Government vs Private hospital maximum charges"
              >
                <Scale className="w-3.5 h-3.5 text-amber-400" />
                <span>{isCompany ? 'Verify Hospital Tariffs' : 'Statutory Price Caps'}</span>
              </button>

              {/* Quick Action: Ingest / Submit Claim */}
              <button
                type="button"
                onClick={onOpenNewClaimModal}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors shadow-md ${
                  isCompany
                    ? 'bg-teal-600 hover:bg-teal-500 shadow-teal-700/20'
                    : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-700/20'
                }`}
              >
                <FilePlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {isCompany ? 'Ingest Claim' : 'Submit Inpatient Claim'}
                </span>
              </button>

              {/* Currency Switcher */}
              <div className="flex items-center bg-slate-900/90 border border-teal-950 rounded-lg p-0.5 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setCurrency('INR')}
                  className={`px-2 py-1 rounded transition-colors ${
                    currency === 'INR'
                      ? 'bg-teal-600 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ₹ INR
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`px-2 py-1 rounded transition-colors ${
                    currency === 'USD'
                      ? 'bg-teal-600 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  $ USD
                </button>
              </div>

              {/* Portal Switcher Button */}
              <button
                type="button"
                onClick={onSwitchPortal}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  isCompany
                    ? 'bg-slate-900/90 text-teal-300 border-teal-800/60 hover:bg-slate-800'
                    : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/60'
                }`}
                title="Switch portal role between SIU Insurer and Hospital Desk"
              >
                <RefreshCw className="w-3 h-3 text-teal-400" />
                <span className="hidden md:inline">
                  {isCompany ? 'The Company (SIU)' : 'Hospital Portal'}
                </span>
              </button>

              {/* User Session & Logout */}
              <div className="flex items-center gap-2 pl-1 border-l border-slate-800">
                <div className="hidden xl:block text-right">
                  <div className="text-xs font-medium text-slate-200 truncate max-w-[130px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-teal-400 font-mono truncate max-w-[130px]">
                    {currentUser.role}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                  title="Sign out of Clinical Gateway"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* User Guide & Walkthrough Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-slate-900 border border-teal-900/80 rounded-2xl max-w-2xl w-full shadow-2xl p-6 text-xs space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-600/30 text-teal-400 flex items-center justify-center border border-teal-700/60">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">ClaimGuard Clinical User Guide</h3>
                  <p className="text-[11px] text-teal-300">Quick Guide to Features, Hospital Review & Transparent Pricing</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 max-h-[70vh] overflow-y-auto pr-1">
              {/* Feature 1: Gov vs Private Hospital Classification */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-teal-900/60 space-y-2">
                <div className="flex items-center gap-2 text-teal-300 font-bold text-sm">
                  <Scale className="w-4 h-4 text-amber-400" />
                  <span>1. Government vs Private Hospital Review & Maximum Charges</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  When reviewing or auditing any hospital, ClaimGuard <strong className="text-white">first verifies whether it is a Government Hospital or Private Hospital</strong>.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-900/60">
                    <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                      <Landmark className="w-3.5 h-3.5" /> 🏛️ Government Hospitals
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Subsidized CGHS / Ayushman Bharat schedule applies. E.g., CABG capped at ₹55,000; Brain MRI at ₹2,200; General ward is ₹0 - ₹350/day. No unauthorized consumables permitted.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-900/60">
                    <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" /> 🏢 Private Hospitals
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Governed by Clinical Establishments Act and NABH metro tier caps. E.g., CABG capped at ₹2,20,000; ICU capped at ₹18,000/day. Excess charges trigger automatic disallowances and patient refunds.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 2: Clinical Workbench Queue & Dossier */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-teal-300 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  <span>2. Claims Surveillance Queue & Medical Dossier</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  • <strong>Queue:</strong> View all ingested claims, risk scores (0-100), hospital operating types, and billed amount vs statutory cap.<br />
                  • <strong>Dossier & XAI:</strong> Deep dive into evidence, SHAP feature attributions (why a claim was flagged), medical necessity mismatch, and 1-click legal PDF adjudication generation.
                </p>
              </div>

              {/* Feature 3: Rules & Analytics */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-teal-300 font-bold text-sm">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>3. Policy Rules, Analytics & Batch Sandbox</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  • <strong>Rules:</strong> Toggle deterministic checks like statutory price ceiling limits, duplicate claim detector, and gender-procedure mismatch.<br />
                  • <strong>Analytics:</strong> Outlier telemetry, risk heatmaps, and Government vs Private pricing compliance metrics.<br />
                  • <strong>Sandbox:</strong> Test custom claims or simulate presets (e.g. Price Ceiling Breach, MRI Overutilization, Upcoded ICU).
                </p>
              </div>

              {/* Feature 4: Two Different Portals */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-teal-300 font-bold text-sm">
                  <RefreshCw className="w-4 h-4 text-cyan-400" />
                  <span>4. Two Tailored Portals: Insurer (Company) vs Hospital</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  You can easily switch roles anytime using the top button:
                  <br />• <strong>The Company (Insurer / SIU):</strong> Focuses on detecting overbilling, inspecting medical fraud, and enforcing disallowances.
                  <br />• <strong>Hospital Portal:</strong> Focuses on pre-validating tariffs against legal caps before submitting, responding to insurer RFIs, and viewing patient pricing tiers.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 font-semibold text-white rounded-lg"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
