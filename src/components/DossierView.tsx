import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  ShieldCheck, 
  ShieldAlert, 
  Building2, 
  Landmark, 
  Scale, 
  User, 
  Calendar, 
  DollarSign, 
  TrendingDown, 
  HelpCircle, 
  MessageSquare, 
  Check, 
  X,
  FileDown,
  Layers,
  ArrowRight,
  Send,
  Lock
} from 'lucide-react';
import { Claim, ClaimStatus } from '../types';
import { formatCurrency, generateAuditDeterminationPdf } from '../utils/pdfGenerator';

interface DossierViewProps {
  claim: Claim | null;
  onAdjudicate: (claimId: string, action: string, status: ClaimStatus, note: string, excessDisallowed?: number) => void;
  currency: 'INR' | 'USD';
  onGoToQueue: () => void;
}

export const DossierView: React.FC<DossierViewProps> = ({
  claim,
  onAdjudicate,
  currency,
  onGoToQueue
}) => {
  const [adjudicationNote, setAdjudicationNote] = useState('');
  const [isAdjudicating, setIsAdjudicating] = useState(false);
  const [rfiText, setRfiText] = useState('');
  const [showRfiModal, setShowRfiModal] = useState(false);
  const [priceCapAdjusted, setPriceCapAdjusted] = useState(false);

  if (!claim) {
    return (
      <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/60 text-slate-400 space-y-3">
        <FileText className="w-10 h-10 text-teal-400 mx-auto" />
        <h3 className="text-base font-bold text-white">No Claim Selected for Forensic Dossier</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Please select a claim from the Surveillance Queue or launch a preset simulation from the Batch Sandbox.
        </p>
        <button
          type="button"
          onClick={onGoToQueue}
          className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs inline-flex items-center gap-1.5"
        >
          <span>Return to Queue</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  const isGov = claim.hospitalType === 'government';
  const isApproved = claim.status === 'approved_clean';
  const isFraud = claim.status === 'fraud_denied';
  const isRfi = claim.status === 'rfi_requested';

  const handleDownloadPdf = () => {
    generateAuditDeterminationPdf(claim, currency);
  };

  const handleApplyPriceCapAdjustment = () => {
    if (!claim.priceCeilingBreach) return;
    setPriceCapAdjusted(true);
    onAdjudicate(
      claim.claimId,
      `Enforced Statutory Price Cap: Disallowed ₹${claim.overbilledExcess} excess surcharge`,
      'under_investigation',
      `Auditor enforced statutory price ceiling of ${formatCurrency(claim.statutoryMaxAmount, currency)} for ${claim.hospitalName} (${claim.hospitalType.toUpperCase()}). Disallowed excess surcharge of ${formatCurrency(claim.overbilledExcess, currency)} from settlement liability.`,
      claim.overbilledExcess
    );
  };

  const handleExecuteDecision = (action: string, status: ClaimStatus) => {
    setIsAdjudicating(true);
    setTimeout(() => {
      setIsAdjudicating(false);
      onAdjudicate(
        claim.claimId,
        action,
        status,
        adjudicationNote || `Adjudicator determination recorded for ${claim.claimId} with compliance hash seal.`
      );
      setAdjudicationNote('');
    }, 300);
  };

  const handleSendRfi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rfiText.trim()) return;

    onAdjudicate(
      claim.claimId,
      'RFI - Request Clinical & Tariff Records',
      'rfi_requested',
      rfiText
    );
    setShowRfiModal(false);
    setRfiText('');
  };

  return (
    <div className="space-y-6">
      {/* Dossier Top Banner */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 border border-teal-800 text-teal-300 font-bold">
                FORENSIC DOSSIER
              </span>
              <span className="font-mono text-sm font-bold text-teal-300">
                {claim.claimId}
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-xs text-slate-300">
                Patient: <strong className="text-white">{claim.patientName}</strong> ({claim.patientAge}y, {claim.patientGender})
              </span>
            </div>

            <h2 className="text-xl font-bold text-white tracking-tight">
              {claim.procedureName}
            </h2>
            <p className="text-xs text-slate-400">
              Primary Diagnosis: <span className="text-slate-200 font-mono">{claim.diagnosisCode}</span> ({claim.diagnosisName})
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center gap-1.5 shadow"
              title="Generate Official Statutory Adjudication Memorandum PDF"
            >
              <FileDown className="w-3.5 h-3.5 text-teal-400" />
              <span>Download Official PDF</span>
            </button>

            <button
              type="button"
              onClick={onGoToQueue}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-950 border border-slate-800 transition-colors"
            >
              ← Back to Queue
            </button>
          </div>
        </div>

        {/* Status Ribbon & Anomaly Gauge */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-[10px] text-slate-400">Anomaly Risk Score</div>
            <div className="text-xl font-bold font-mono text-white mt-0.5 flex items-center gap-2">
              <span
                className={`${
                  claim.anomalyScore >= 80
                    ? 'text-rose-400'
                    : claim.anomalyScore >= 50
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {claim.anomalyScore} / 100
              </span>
              <span className="text-[10px] font-mono font-normal text-slate-400">
                ({claim.riskLevel})
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-[10px] text-slate-400">Adjudication Status</div>
            <div className="text-sm font-bold uppercase tracking-wider mt-1 text-teal-300 font-mono">
              {claim.status.replace(/_/g, ' ')}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-[10px] text-slate-400">Total Billed Claim</div>
            <div className="text-lg font-bold font-mono text-slate-100 mt-0.5">
              {formatCurrency(claim.billedAmount, currency)}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-[10px] text-slate-400">Length of Stay</div>
            <div className="text-lg font-bold font-mono text-slate-100 mt-0.5">
              {claim.lengthOfStay} Days ({claim.admissionDate} - {claim.dischargeDate})
            </div>
          </div>
        </div>
      </div>

      {/* MANDATORY SECTION: Hospital Type Verification & Statutory Price Ceiling Auditor */}
      <div className="p-5 rounded-2xl border border-teal-900/70 bg-gradient-to-r from-slate-900 via-[#071d2b] to-slate-900 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-950 border border-teal-800 flex items-center justify-center text-teal-400">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-teal-400 font-bold tracking-wider">
                STEP 1 & 2: HOSPITAL VERIFICATION & STATUTORY MAXIMUM CHARGE AUDIT
              </span>
              <h3 className="text-base font-bold text-white">
                {claim.hospitalName}
              </h3>
            </div>
          </div>

          {/* Verified Hospital Type Badge */}
          <span
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 self-start sm:self-auto ${
              isGov
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                : 'bg-cyan-950 text-cyan-300 border border-cyan-700'
            }`}
          >
            {isGov ? <Landmark className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
            <span>VERIFIED {claim.hospitalType.toUpperCase()} HOSPITAL</span>
          </span>
        </div>

        {/* Pricing Ceiling Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
          <div>
            <div className="text-slate-400 text-[11px]">Facility Regulatory Tier</div>
            <div className="font-semibold text-slate-200 mt-0.5">
              {claim.hospitalSubcategory}
            </div>
            <div className="text-[10px] text-teal-400 mt-0.5">
              Accreditation: {claim.accreditation}
            </div>
          </div>

          <div>
            <div className="text-slate-400 text-[11px]">
              Mandated Statutory Maximum Cap ({isGov ? 'Government Rate' : 'Private Tier 1'})
            </div>
            <div className="text-base font-bold font-mono text-teal-300 mt-0.5">
              {formatCurrency(claim.statutoryMaxAmount, currency)}
            </div>
            <div className="text-[10px] text-slate-500">
              Statutory ceiling for procedure {claim.procedureCode}
            </div>
          </div>

          <div>
            <div className="text-slate-400 text-[11px]">Price Ceiling Audit Result</div>
            {claim.priceCeilingBreach ? (
              <div className="space-y-0.5">
                <div className="text-sm font-bold font-mono text-rose-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>OVERBILLED (+{formatCurrency(claim.overbilledExcess, currency)})</span>
                </div>
                <div className="text-[10px] text-rose-300">
                  Excess surcharge disallowed from payer disbursement.
                </div>
              </div>
            ) : (
              <div className="space-y-0.5">
                <div className="text-sm font-bold font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>FULLY STATUTORY COMPLIANT</span>
                </div>
                <div className="text-[10px] text-emerald-300">
                  Billed rate respects legal ceiling schedule.
                </div>
              </div>
            )}
          </div>
        </div>

        {claim.priceCeilingBreach && (
          <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-rose-300 block">
                Statutory Tariff Disallowance Action Available
              </span>
              <p className="text-[11px] text-slate-300 max-w-2xl">
                {claim.ceilingBreachReason}
              </p>
            </div>

            <button
              type="button"
              disabled={priceCapAdjusted}
              onClick={handleApplyPriceCapAdjustment}
              className={`px-4 py-2 rounded-lg font-bold transition-all shrink-0 flex items-center gap-1.5 shadow ${
                priceCapAdjusted
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-700/25'
              }`}
            >
              <TrendingDown className="w-3.5 h-3.5" />
              <span>
                {priceCapAdjusted ? 'Cap Enforced (-₹95k)' : 'Enforce Statutory Cap Disallowance'}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Itemized Charges Table */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-400" />
            <span>Itemized Bill & Statutory Line-Item Caps</span>
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            {claim.items.length} billed components
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/90 text-slate-400 text-[10px] uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Code</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Qty</th>
                <th className="py-2.5 px-3">Billed Total</th>
                <th className="py-2.5 px-3">Mandated Max Cap</th>
                <th className="py-2.5 px-3">Audit Finding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/60 font-sans">
              {claim.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-mono text-teal-400 font-semibold">{item.code}</td>
                  <td className="py-2.5 px-3 text-slate-100 font-medium">{item.name}</td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px]">{item.category}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-300">{item.quantity}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-200">
                    {formatCurrency(item.totalPrice, currency)}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-teal-300">
                    {item.maxAllowedRate > 0 ? formatCurrency(item.maxAllowedRate, currency) : '₹0 (Bundled)'}
                  </td>
                  <td className="py-2.5 px-3">
                    {item.isExceeded ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-950/80 text-rose-300 border border-rose-800">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        <span>Exceeds Statutory Ceiling</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                        <Check className="w-2.5 h-2.5" />
                        <span>Permissible</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SHAP Explainability & Clinical Policy Flags */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SHAP Feature Attribution */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-400" />
              <span>Explainable AI (XAI) SHAP Attribution</span>
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
              SHAP Multi-Layer
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Feature contributions indicating how specific billing anomalies, statutory deviations, and clinical mismatches drove the risk score.
          </p>

          <div className="space-y-3 pt-1">
            {claim.shapFactors.map((f, idx) => {
              const isRiskIncrease = f.direction === 'increases_risk';
              const absVal = Math.min(100, Math.round(Math.abs(f.impact) * 100));

              return (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-200 font-semibold">{f.feature}</span>
                    <span
                      className={`font-mono font-bold ${
                        isRiskIncrease ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {isRiskIncrease ? `+${absVal}% Risk` : `-${absVal}% Risk`}
                    </span>
                  </div>

                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${absVal}%` }}
                      className={`h-full rounded-full ${
                        isRiskIncrease ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                    />
                  </div>

                  <div className="text-[10px] text-slate-400">{f.description}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Policy Violations & Duplicate Crosswalk */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Deterministic Policy Rule Violations</span>
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
              {claim.policyViolations.length} Violations
            </span>
          </div>

          {claim.policyViolations.length > 0 ? (
            <div className="space-y-3">
              {claim.policyViolations.map((v, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-rose-900/60 bg-rose-950/20 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-300">{v.ruleName}</span>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-rose-950 text-rose-400 border border-rose-800 font-bold">
                      {v.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {v.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <div className="font-bold text-white">Zero Deterministic Policy Violations</div>
              <p className="text-slate-400 text-[11px]">
                No NCCI unbundling, demographic contradictions, or duplicate collisions were triggered.
              </p>
            </div>
          )}

          {/* RFI Response (if available) */}
          {claim.rfiResponse && (
            <div className="mt-4 p-3.5 rounded-xl border border-amber-900/60 bg-amber-950/20 text-xs space-y-2">
              <div className="flex items-center justify-between text-amber-300 font-bold">
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  <span>Hospital Desk RFI Response Attached</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {claim.rfiResponse.timestamp}
                </span>
              </div>
              <p className="text-slate-300 text-[11px]">
                "{claim.rfiResponse.explanation}"
              </p>
              <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
                <span>Officer: {claim.rfiResponse.complianceOfficer}</span>
                <span>Files: {claim.rfiResponse.attachedFiles.join(', ')}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Adjudication Workbench & Actions */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          <span>Auditor Adjudication Workbench & Final Determination</span>
        </h3>

        <div className="space-y-3">
          <label className="block text-slate-300 text-xs font-medium">
            Clinical Adjudication Memorandum Rationale Note
          </label>
          <textarea
            value={adjudicationNote}
            onChange={(e) => setAdjudicationNote(e.target.value)}
            rows={2}
            placeholder="Record formal forensic findings, statutory tariff deduction justifications, or RFI follow-up requirements..."
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Decision Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => handleExecuteDecision('Approve Claim & Release Payment', 'approved_clean')}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-700/20 flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Approve & Release Payment</span>
          </button>

          <button
            type="button"
            onClick={() => setShowRfiModal(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 transition-colors shadow-lg shadow-amber-700/20 flex items-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Request Further Information (RFI)</span>
          </button>

          <button
            type="button"
            onClick={() => handleExecuteDecision('Fraud Escalation & Overbilling Denial', 'fraud_denied')}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors shadow-lg shadow-rose-700/20 flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Escalate SIU Fraud Denial</span>
          </button>

          {claim.isDuplicateOf && (
            <button
              type="button"
              onClick={() => handleExecuteDecision('Duplicate Collision Rejection', 'duplicate_rejected')}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reject Duplicate</span>
            </button>
          )}
        </div>

        {/* Adjudication Ledger History */}
        {claim.adjudicationHistory && claim.adjudicationHistory.length > 0 && (
          <div className="pt-4 border-t border-slate-800/80 space-y-2 text-xs">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wide">
              Cryptographic Adjudication Audit Trail
            </span>
            <div className="space-y-2">
              {claim.adjudicationHistory.map((h) => (
                <div
                  key={h.id}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-teal-300">{h.action}</span>
                      <span className="text-[10px] font-mono text-slate-500">{h.timestamp}</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">{h.note}</p>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Actor: {h.actor}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                      {h.complianceHash}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RFI Modal */}
      {showRfiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full shadow-2xl p-6 text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>Dispatch RFI Inquiry to Hospital Desk</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowRfiModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendRfi} className="space-y-3">
              <p className="text-slate-400">
                Specify what clinical documentation, itemized consumables receipts, or statutory rate justifications are required from {claim.hospitalName}.
              </p>
              <div>
                <label className="block text-slate-300 font-medium mb-1">RFI Requirements</label>
                <textarea
                  value={rfiText}
                  onChange={(e) => setRfiText(e.target.value)}
                  rows={4}
                  placeholder="e.g. Provide operative notes, implant barcode labels, and itemized justification for ₹95,000 charge exceeding the statutory ceiling..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRfiModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 font-semibold text-white rounded-lg flex items-center gap-1.5 shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send RFI Notice</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
