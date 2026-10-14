import React, { useState } from 'react';
import { 
  Building2, 
  Landmark, 
  ShieldCheck, 
  Scale, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Upload, 
  Send, 
  FilePlus, 
  Star, 
  FileText, 
  Check, 
  TrendingUp, 
  Sparkles,
  Phone,
  UserCheck,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { Hospital, Claim, HospitalType } from '../types';
import { formatCurrency } from '../utils/pdfGenerator';

interface HospitalLandingViewProps {
  hospital: Hospital;
  claims: Claim[];
  onRespondRfi: (claimId: string, explanation: string, files: string[]) => void;
  currency: 'INR' | 'USD';
  onSelectClaim: (claim: Claim) => void;
  onOpenNewClaimModal: () => void;
  onNavigateToTariffs: () => void;
  onSwitchHospital?: (hospitalId: string) => void;
  allHospitals: Hospital[];
}

export const HospitalLandingView: React.FC<HospitalLandingViewProps> = ({
  hospital,
  claims,
  onRespondRfi,
  currency,
  onSelectClaim,
  onOpenNewClaimModal,
  onNavigateToTariffs,
  onSwitchHospital,
  allHospitals
}) => {
  const isGov = hospital.type === 'government';
  const hospitalClaims = claims.filter(c => c.hospitalName.includes(hospital.name) || c.hospitalId === hospital.id);
  const rfiClaims = claims.filter(c => c.status === 'rfi_requested');

  // Pre-Submission Pre-Flight Tariff Validator State
  const [testProcedure, setTestProcedure] = useState('33533');
  const [testBilledAmount, setTestBilledAmount] = useState<number>(isGov ? 45000 : 210000);
  const [preflightTested, setPreflightTested] = useState(false);

  // RFI Response Drawer State
  const [selectedRfiClaimId, setSelectedRfiClaimId] = useState<string>(rfiClaims[0]?.claimId || 'CLM-1108');
  const [rfiExplanation, setRfiExplanation] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<string[]>([
    'Signed_Discharge_Summary.pdf',
    'Itemized_Consumables_Log.pdf'
  ]);
  const [rfiSuccessMessage, setRfiSuccessMessage] = useState<string | null>(null);

  // Pre-flight check calculation
  const getPreflightCap = () => {
    if (testProcedure === '33533') return isGov ? 55000 : 220000;
    if (testProcedure === '70553') return isGov ? 2200 : 7500;
    if (testProcedure === '66984') return isGov ? 14000 : 38000;
    if (testProcedure === '27447') return isGov ? 65000 : 160000;
    if (testProcedure === '59510') return isGov ? 25000 : 95000;
    return isGov ? 30000 : 100000;
  };

  const preflightCap = getPreflightCap();
  const preflightExceeds = testBilledAmount > preflightCap;
  const preflightExcess = Math.max(0, testBilledAmount - preflightCap);

  const handleRfiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rfiExplanation.trim()) return;

    onRespondRfi(selectedRfiClaimId, rfiExplanation, attachedFiles);
    setRfiSuccessMessage(`Records transmitted to Insurer SIU for Claim ${selectedRfiClaimId}. Case status moved to Under Investigation.`);
    setTimeout(() => setRfiSuccessMessage(null), 4000);
    setRfiExplanation('');
  };

  return (
    <div className="space-y-6">
      {/* HOSPITAL DESK HERO BANNER (Distinct Emerald / Hospital Brand) */}
      <div className="p-6 rounded-2xl border border-emerald-900/60 bg-gradient-to-r from-[#061e1b] via-[#072621] to-[#061822] shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/80 font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Hospital Revenue Cycle & Provider Portal
              </span>

              {/* Verified Classification Tag */}
              <span
                className={`text-xs font-mono font-bold px-3 py-0.5 rounded-full flex items-center gap-1.5 shadow-sm ${
                  isGov
                    ? 'bg-emerald-950/90 text-emerald-200 border border-emerald-600'
                    : 'bg-cyan-950/90 text-cyan-200 border border-cyan-600'
                }`}
              >
                {isGov ? <Landmark className="w-3.5 h-3.5 text-emerald-300" /> : <Building2 className="w-3.5 h-3.5 text-cyan-300" />}
                <span>VERIFIED {hospital.type.toUpperCase()} HOSPITAL</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {hospital.name}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl leading-relaxed">
              Clinical Establishment Registry: <strong className="text-white font-mono">{hospital.registrationNo}</strong> · {hospital.city}, {hospital.state} · Accreditation: <span className="text-teal-300">{hospital.accreditation}</span>
            </p>
          </div>

          {/* Quick Facility Switcher (if auditor is inspecting other hospitals) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            {onSwitchHospital && (
              <select
                value={hospital.id}
                onChange={(e) => onSwitchHospital(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950/90 border border-emerald-800 text-xs text-slate-200 font-medium"
              >
                {allHospitals.map(h => (
                  <option key={h.id} value={h.id}>
                    Switch Facility: {h.name.slice(0, 28)}...
                  </option>
                ))}
              </select>
            )}

            <button
              type="button"
              onClick={onOpenNewClaimModal}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-700/25 flex items-center justify-center gap-2"
            >
              <FilePlus className="w-4 h-4" />
              <span>Submit Inpatient Claim</span>
            </button>
          </div>
        </div>

        {/* Legal Regulatory Capping Strip */}
        <div className="mt-5 pt-4 border-t border-emerald-900/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 flex items-center gap-2.5">
            <Scale className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-emerald-300/80 uppercase font-mono block">Statutory Pricing Schedule</span>
              <span className="font-bold text-white truncate block">
                {hospital.statutoryPriceCappingCategory.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 flex items-center gap-2.5">
            <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-emerald-300/80 uppercase font-mono block">Facility Compliance Nodal Officer</span>
              <span className="font-bold text-white truncate block">{hospital.nodalOfficer}</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 flex items-center gap-2.5">
            <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-emerald-300/80 uppercase font-mono block">24x7 Emergency Escalation</span>
              <span className="font-bold text-white truncate block">{hospital.emergencyContact}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 HOSPITAL OPERATIONAL KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Compliance Gauge */}
        <div className="p-4 rounded-2xl border border-emerald-900/60 bg-slate-900/90 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Price Cap Compliance</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-300 mt-1 flex items-baseline gap-2">
            <span>{hospital.priceComplianceScore}%</span>
            <span className="text-[10px] font-sans font-normal text-slate-400">Target: &gt;95%</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {isGov ? 'CGHS Subsidized Adherence' : 'Private Metro Tier 1 Ceiling'}
          </div>
        </div>

        {/* Action Due: Payer RFIs */}
        <div className="p-4 rounded-2xl border border-amber-900/60 bg-amber-950/20 shadow-md">
          <div className="flex items-center justify-between text-amber-300 text-xs">
            <span>Inquiries on Hold (RFIs)</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300 mt-1">
            {rfiClaims.length} Action Due
          </div>
          <div className="text-[11px] text-amber-400/80 mt-1">
            Insurers awaiting clinical evidence
          </div>
        </div>

        {/* Patient Review Rating */}
        <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Fair Pricing Patient Rating</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1 flex items-center gap-1.5">
            <span>{hospital.overallRating}</span>
            <span className="text-xs text-slate-400">/ 5.0</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Based on {hospital.reviews?.length || 0} verified patient reviews
          </div>
        </div>

        {/* Overbilling Incidents */}
        <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Flagged Overbills</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-300 mt-1">
            {hospital.overbillingIncidentCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {hospital.totalAuditedClaims} total audited claims
          </div>
        </div>
      </div>

      {/* TWO CORE HOSPITAL SECTIONS:
          1. Urgent Action Center: Respond to Insurer RFIs
          2. Pre-Submission Pre-Flight Tariff Validator (Checks before transmitting) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left: Urgent RFI Action Center */}
        <div className="xl:col-span-6 p-6 rounded-2xl border border-amber-900/60 bg-slate-900/90 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span>Payer Clinical Inquiry Center (RFIs Requiring Proof)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Submit operative notes, implant receipts, or tariff justifications to unblock insurance disbursements.
              </p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 font-bold">
              {rfiClaims.length} Open
            </span>
          </div>

          {rfiSuccessMessage && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{rfiSuccessMessage}</span>
            </div>
          )}

          {rfiClaims.length > 0 ? (
            <div className="space-y-3">
              <div className="space-y-2">
                {rfiClaims.map((claim) => (
                  <div
                    key={claim.id}
                    onClick={() => setSelectedRfiClaimId(claim.claimId)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedRfiClaimId === claim.claimId
                        ? 'bg-amber-950/30 border-amber-500 ring-1 ring-amber-500/50'
                        : 'bg-slate-950/60 border-slate-800 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-teal-300">{claim.claimId}</span>
                      <span className="text-[10px] text-amber-400 font-mono font-bold">Action Required</span>
                    </div>
                    <div className="font-semibold text-slate-200 text-xs mt-1">
                      Patient: {claim.patientName} ({claim.procedureName})
                    </div>
                    <div className="text-[11px] text-rose-300 bg-rose-950/40 p-2 rounded-lg mt-2 border border-rose-900/60">
                      <strong>Insurer Inquiry:</strong> "{claim.rfiNotes || 'Clinical records and tariff justification requested.'}"
                    </div>
                  </div>
                ))}
              </div>

              {/* Response Form */}
              <form onSubmit={handleRfiSubmit} className="pt-3 border-t border-slate-800 space-y-3 text-xs">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-teal-400" />
                  <span>Transmitting Response for {selectedRfiClaimId}</span>
                </h4>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Hospital Clinical & Tariff Explanation
                  </label>
                  <textarea
                    value={rfiExplanation}
                    onChange={(e) => setRfiExplanation(e.target.value)}
                    rows={3}
                    placeholder="e.g. Patient requested luxury birthing suite with hydrotherapy pool. Submitting signed elective upgrade waiver and itemized clinical breakdown..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Attached Verification Files
                  </label>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-[11px] text-slate-300">
                    <div className="flex items-center gap-2">
                      <Upload className="w-3.5 h-3.5 text-teal-400" />
                      <span>{attachedFiles.join(', ')}</span>
                    </div>
                    <span className="text-teal-400 font-mono text-[10px]">Verified</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white shadow-lg shadow-emerald-700/25 flex items-center justify-center gap-2 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Clinical Defense to Insurer SIU</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs rounded-xl border border-dashed border-slate-800 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <div className="font-bold text-white">All Payer Inquiries Cleared</div>
              <p className="text-slate-400">
                No claims are currently on hold for documentation or tariff verification.
              </p>
            </div>
          )}
        </div>

        {/* Right: Pre-Submission Pre-Flight Tariff Validator */}
        <div className="xl:col-span-6 p-6 rounded-2xl border border-teal-900/60 bg-slate-900/90 shadow-xl space-y-4">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-teal-400" />
              <span>Pre-Submission Price Ceiling Pre-Flight Checker</span>
            </h3>
            <p className="text-xs text-slate-400">
              Check patient bills against <strong className="text-teal-300">{hospital.type.toUpperCase()} statutory rate caps</strong> before submitting to insurers to prevent audit rejection.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Procedure to Bill
                </label>
                <select
                  value={testProcedure}
                  onChange={(e) => {
                    setTestProcedure(e.target.value);
                    setPreflightTested(true);
                  }}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 text-xs"
                >
                  <option value="33533">CABG Heart Bypass (33533)</option>
                  <option value="70553">MRI Brain with Contrast (70553)</option>
                  <option value="66984">Cataract Surgery with IOL (66984)</option>
                  <option value="27447">Total Knee Replacement (27447)</option>
                  <option value="59510">Cesarean Delivery (59510)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Hospital Proposed Charge ({currency === 'INR' ? '₹' : '$'})
                </label>
                <input
                  type="number"
                  value={testBilledAmount}
                  onChange={(e) => {
                    setTestBilledAmount(Number(e.target.value));
                    setPreflightTested(true);
                  }}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 text-xs font-mono font-bold"
                />
              </div>
            </div>

            {/* Live Result Banner */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[11px] text-slate-400 block">
                  Mandated Statutory Maximum Ceiling for {hospital.name} ({hospital.type.toUpperCase()})
                </span>
                <span className="text-base font-bold font-mono text-teal-300">
                  {formatCurrency(preflightCap, currency)}
                </span>
              </div>

              <div className="text-right">
                {preflightExceeds ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-950/60 px-2.5 py-1 rounded-full border border-rose-800 font-mono">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>BREACH RISK: +{formatCurrency(preflightExcess, currency)}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800 font-mono">
                    <Check className="w-3.5 h-3.5" />
                    <span>PRE-FLIGHT CLEARED (COMPLIANT)</span>
                  </span>
                )}
              </div>
            </div>

            {preflightExceeds ? (
              <p className="text-[11px] text-rose-300 bg-rose-950/20 p-2.5 rounded-lg border border-rose-900/50 leading-relaxed">
                ⚠️ <strong>Audit Warning:</strong> Transmitting this claim will trigger rule <code>RULE-PRICE-01</code>. The insurer SIU will automatically disallow {formatCurrency(preflightExcess, currency)}. Recommended adjustment: reduce line item to {formatCurrency(preflightCap, currency)}.
              </p>
            ) : (
              <p className="text-[11px] text-emerald-300 bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-900/50 leading-relaxed">
                ✅ <strong>Zero Disallowance Risk:</strong> This procedure complies fully with {isGov ? 'CGHS Government Subsidized Schedule' : 'Private Metro Tier 1 Cap'}. Eligible for instant auto-adjudication.
              </p>
            )}
          </div>

          {/* Quick Tariff Link */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">
              Need to review all hospital pricing tiers?
            </span>
            <button
              type="button"
              onClick={onNavigateToTariffs}
              className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 underline"
            >
              <span>View Full Tariffs Schedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* RECENT HOSPITAL TRANSMITTED CLAIMS LEDGER */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl">
        <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>Facility Transmitted Claims & Adjudication Tracker ({claims.length} records)</span>
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            Electronic Remittance Advice (ERA 835)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/90 text-slate-400 text-[10px] uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Claim ID</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Procedure</th>
                <th className="py-3 px-4">Billed Amount</th>
                <th className="py-3 px-4">Statutory Max Cap</th>
                <th className="py-3 px-4">Payer SIU Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
              {claims.slice(0, 7).map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-teal-300">{c.claimId}</td>
                  <td className="py-3 px-4 text-slate-200 font-semibold">{c.patientName}</td>
                  <td className="py-3 px-4 text-slate-300 max-w-[200px] truncate">{c.procedureName}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-100">
                    {formatCurrency(c.billedAmount, currency)}
                  </td>
                  <td className="py-3 px-4 font-mono text-teal-300">
                    {formatCurrency(c.statutoryMaxAmount, currency)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                        c.status === 'approved_clean'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : c.status === 'fraud_denied'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : c.status === 'rfi_requested'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      <span>{c.status.replace(/_/g, ' ')}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onSelectClaim(c)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-semibold"
                    >
                      Audit Dossier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
