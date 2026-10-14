import React, { useState } from 'react';
import { 
  Building2, 
  Landmark, 
  FileText, 
  Upload, 
  MessageSquare, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  Scale, 
  Send,
  Download
} from 'lucide-react';
import { Hospital, Claim } from '../types';
import { formatCurrency } from '../utils/pdfGenerator';

interface ProviderPortalViewProps {
  hospital: Hospital;
  claims: Claim[];
  onRespondRfi: (claimId: string, explanation: string, files: string[]) => void;
  currency: 'INR' | 'USD';
  onSelectClaim: (claim: Claim) => void;
}

export const ProviderPortalView: React.FC<ProviderPortalViewProps> = ({
  hospital,
  claims,
  onRespondRfi,
  currency,
  onSelectClaim
}) => {
  const [selectedRfiClaimId, setSelectedRfiClaimId] = useState<string>('CLM-1108');
  const [rfiExplanation, setRfiExplanation] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<string[]>([
    'Discharge_Summary_Signed.pdf',
    'Itemized_Consumables_Receipt.pdf'
  ]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const hospitalClaims = claims.filter(c => c.hospitalName.includes(hospital.name) || c.hospitalId === hospital.id);
  const rfiClaims = claims.filter(c => c.status === 'rfi_requested');
  const isGov = hospital.type === 'government';

  const handleRfiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rfiExplanation.trim()) return;

    onRespondRfi(selectedRfiClaimId, rfiExplanation, attachedFiles);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setRfiExplanation('');
  };

  return (
    <div className="space-y-6">
      {/* Facility Header */}
      <div className="p-6 rounded-2xl border border-teal-900/60 bg-gradient-to-r from-slate-900 via-[#071d2b] to-slate-900 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                HOSPITAL DESK PORTAL
              </span>
              <span
                className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                  isGov
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                    : 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                }`}
              >
                {isGov ? <Landmark className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
                <span>VERIFIED {hospital.type.toUpperCase()} HOSPITAL</span>
              </span>
            </div>

            <h2 className="text-xl font-bold text-white tracking-tight">
              {hospital.name} · Compliance & Revenue Cycle Desk
            </h2>
            <p className="text-xs text-slate-300">
              Reg No: <span className="font-mono text-teal-300">{hospital.registrationNo}</span> · Nodal Officer: {hospital.nodalOfficer}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <div>
              <div className="text-[10px] text-slate-400">Tariff Compliance Rating</div>
              <div className="text-lg font-bold font-mono text-teal-300">
                {hospital.priceComplianceScore}% Compliant
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-teal-950 border border-teal-800 flex items-center justify-center text-teal-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Capping details banner */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-slate-300">
              Assigned Tariff Schedule: <strong className="text-white">{hospital.statutoryPriceCappingCategory.replace(/_/g, ' ')}</strong>
            </span>
          </div>
          <span className="text-[11px] text-teal-300 font-mono">
            {isGov ? 'Zero-Surprise Public Healthcare Guarantee' : 'Private Metro Tier 1 Ceiling Enforced'}
          </span>
        </div>
      </div>

      {/* RFI Requests requiring Hospital Action */}
      <div className="p-6 rounded-2xl border border-amber-900/60 bg-slate-900/80 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>Pending RFI Inquiries from Insurance SIU Unit</span>
            </h3>
            <p className="text-xs text-slate-400">
              Insurers have placed these claims on hold requesting itemized medical records or tariff ceiling explanations.
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800 font-bold">
            {rfiClaims.length} Actions Due
          </span>
        </div>

        {rfiClaims.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
            {/* List of RFIs */}
            <div className="lg:col-span-5 space-y-2">
              {rfiClaims.map((claim) => (
                <button
                  key={claim.id}
                  type="button"
                  onClick={() => setSelectedRfiClaimId(claim.claimId)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    selectedRfiClaimId === claim.claimId
                      ? 'bg-amber-950/30 border-amber-600 ring-1 ring-amber-500/50'
                      : 'bg-slate-950/60 border-slate-800 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-teal-300">{claim.claimId}</span>
                    <span className="text-[10px] text-amber-400 font-mono font-semibold">Response Required</span>
                  </div>
                  <div className="font-semibold text-slate-200 text-xs mt-1">{claim.patientName}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{claim.procedureName}</div>
                  <div className="mt-2 text-[10px] text-rose-300 bg-rose-950/40 p-2 rounded border border-rose-900/60">
                    "{claim.rfiNotes || 'Clinical records and tariff justification requested.'}"
                  </div>
                </button>
              ))}
            </div>

            {/* RFI Response Form */}
            <div className="lg:col-span-7 p-4 rounded-xl border border-slate-800 bg-slate-950/80 space-y-3 text-xs">
              <h4 className="font-bold text-white flex items-center gap-2">
                <Send className="w-3.5 h-3.5 text-teal-400" />
                <span>Submit Clinical Justification & Attach Records for {selectedRfiClaimId}</span>
              </h4>

              {isSubmitted && (
                <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Clinical documentation successfully submitted to SIU Auditor queue!</span>
                </div>
              )}

              <form onSubmit={handleRfiSubmit} className="space-y-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Hospital Clinical & Tariff Explanation Note
                  </label>
                  <textarea
                    value={rfiExplanation}
                    onChange={(e) => setRfiExplanation(e.target.value)}
                    rows={4}
                    placeholder="Provide justification for procedure, ICU necessity, patient elective upgrades, or verified clinical documentation..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 text-xs focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Attached Evidentiary Files
                  </label>
                  <div className="p-3 rounded-lg bg-slate-900 border border-dashed border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-300 text-[11px]">
                      <Upload className="w-4 h-4 text-teal-400" />
                      <span>{attachedFiles.join(', ')}</span>
                    </div>
                    <span className="text-[10px] font-mono text-teal-400">Uploaded</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 font-semibold text-white shadow flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Response to Insurance SIU</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-slate-500 text-xs rounded-xl border border-dashed border-slate-800">
            No pending RFI inquiries awaiting response. All claims are adjudicated or in processing.
          </div>
        )}
      </div>

      {/* Hospital Claims Ledger */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl">
        <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-teal-400" />
            <span>Facility Ingestion Ledger ({claims.length} total claims)</span>
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            Electronic Remittance Advice (835)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/90 text-slate-400 text-[10px] uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Claim ID</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Procedure</th>
                <th className="py-3 px-4">Billed Amount</th>
                <th className="py-3 px-4">Statutory Cap</th>
                <th className="py-3 px-4">Adjudication Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
              {claims.slice(0, 6).map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-teal-300">{c.claimId}</td>
                  <td className="py-3 px-4 text-slate-200 font-semibold">{c.patientName}</td>
                  <td className="py-3 px-4 text-slate-300">{c.procedureName}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-100">
                    {formatCurrency(c.billedAmount, currency)}
                  </td>
                  <td className="py-3 px-4 font-mono text-teal-300">
                    {formatCurrency(c.statutoryMaxAmount, currency)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold bg-slate-800 text-slate-300">
                      {c.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onSelectClaim(c)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-semibold"
                    >
                      Inspect
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
