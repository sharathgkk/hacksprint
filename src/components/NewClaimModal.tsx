import React, { useState } from 'react';
import { 
  FilePlus, 
  X, 
  Landmark, 
  Building2, 
  Scale, 
  AlertTriangle, 
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { Hospital, Claim } from '../types';
import { formatCurrency } from '../utils/pdfGenerator';

interface NewClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  hospitals: Hospital[];
  onIngest: (claim: Claim) => void;
  currency: 'INR' | 'USD';
}

export const NewClaimModal: React.FC<NewClaimModalProps> = ({
  isOpen,
  onClose,
  hospitals,
  onIngest,
  currency
}) => {
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>(hospitals[0]?.id || '');
  const [patientName, setPatientName] = useState('');
  const [patientId, setPatientId] = useState(`P-${Math.floor(1000 + Math.random() * 9000)}`);
  const [patientAge, setPatientAge] = useState(48);
  const [patientGender, setPatientGender] = useState<'M' | 'F' | 'Other'>('M');
  const [procedureCode, setProcedureCode] = useState('33533');
  const [diagnosisCode, setDiagnosisCode] = useState('I25.10');
  const [billedAmount, setBilledAmount] = useState(250000);

  if (!isOpen) return null;

  const selectedHospital = hospitals.find((h) => h.id === selectedHospitalId) || hospitals[0];
  const isGov = selectedHospital?.type === 'government';

  // Compute statutory cap based on hospital type
  let statutoryCap = isGov ? 55000 : 220000;
  if (procedureCode === '70553') statutoryCap = isGov ? 2200 : 7500;
  if (procedureCode === '66984') statutoryCap = isGov ? 14000 : 38000;

  const isBreach = billedAmount > statutoryCap;
  const excess = Math.max(0, billedAmount - statutoryCap);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    const anomalyScore = isBreach ? 78 : 12;
    const newClaim: Claim = {
      id: `CLM-${Math.floor(1000 + Math.random() * 9000)}`,
      claimId: `CLM-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId,
      patientName,
      patientAge,
      patientGender,
      hospitalId: selectedHospital.id,
      hospitalName: selectedHospital.name,
      hospitalType: selectedHospital.type,
      hospitalSubcategory: selectedHospital.subcategory,
      accreditation: selectedHospital.accreditation,
      specialty: 'Cardiology',
      city: selectedHospital.city,
      state: selectedHospital.state,
      admissionDate: new Date().toISOString().slice(0, 10),
      dischargeDate: new Date().toISOString().slice(0, 10),
      lengthOfStay: 2,
      diagnosisCode,
      diagnosisName: 'Clinical Diagnostic Finding',
      procedureCode,
      procedureName: procedureCode === '33533' ? 'Coronary Artery Bypass Graft (CABG)' : 'Specialty Clinical Procedure',
      unitsBilled: 1,
      billedAmount,
      peerAverageAmount: statutoryCap * 0.9,
      statutoryMaxAmount: statutoryCap,
      priceCeilingBreach: isBreach,
      overbilledExcess: excess,
      ceilingBreachReason: isBreach
        ? `Exceeded statutory ${selectedHospital.type.toUpperCase()} maximum ceiling of ${formatCurrency(statutoryCap, currency)} by +${formatCurrency(excess, currency)}.`
        : undefined,
      anomalyScore,
      riskLevel: isBreach ? 'HIGH' : 'CLEAN',
      status: isBreach ? 'pending_review' : 'approved_clean',
      policyViolations: isBreach
        ? [
            {
              ruleId: 'RULE-PRICE-01',
              ruleName: 'Statutory Price Ceiling Breach',
              severity: 'HIGH',
              description: `Billed amount exceeds mandated ceiling for ${selectedHospital.type} facility.`
            }
          ]
        : [],
      shapFactors: [
        {
          feature: `Billed vs ${selectedHospital.type.toUpperCase()} Mandate`,
          impact: isBreach ? 0.45 : -0.35,
          description: isBreach ? 'Price exceeds statutory ceiling' : 'Within legal cap',
          direction: isBreach ? 'increases_risk' : 'decreases_risk'
        }
      ],
      items: [
        {
          code: procedureCode,
          name: 'Primary Inpatient Procedure Package',
          quantity: 1,
          unitPrice: billedAmount,
          totalPrice: billedAmount,
          maxAllowedRate: statutoryCap,
          isExceeded: isBreach,
          category: 'Surgical Procedure'
        }
      ],
      adjudicationHistory: []
    };

    onIngest(newClaim);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full shadow-2xl p-6 text-xs space-y-4 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FilePlus className="w-4 h-4 text-teal-400" />
            <span>Fast Ingest Claim with Price Cap Verification</span>
          </h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Select Healthcare Facility (Auto-Classifies Government vs Private)
            </label>
            <select
              value={selectedHospitalId}
              onChange={(e) => setSelectedHospitalId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs"
            >
              {hospitals.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} [{h.type === 'government' ? '🏛️ GOVERNMENT' : '🏢 PRIVATE'}] - {h.city}
                </option>
              ))}
            </select>
            <div className="mt-1 flex items-center gap-1.5 text-[10px] text-teal-400 font-mono">
              <span>Verified Classification:</span>
              <span className="font-bold">
                {isGov ? '🏛️ GOVERNMENT (Subsidized Public Ceiling)' : '🏢 PRIVATE (Tier 1 Metro Price Cap)'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-slate-300 text-[11px] mb-1">Patient Name</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Meera Nair"
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-100 text-xs"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 text-[11px] mb-1">Age</label>
              <input
                type="number"
                value={patientAge}
                onChange={(e) => setPatientAge(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-100 text-xs"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 text-[11px] mb-1">Gender</label>
              <select
                value={patientGender}
                onChange={(e) => setPatientGender(e.target.value as any)}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-100 text-xs"
              >
                <option value="M">Male (M)</option>
                <option value="F">Female (F)</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 text-[11px] mb-1">Procedure</label>
              <select
                value={procedureCode}
                onChange={(e) => setProcedureCode(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-100 text-xs"
              >
                <option value="33533">CABG Heart Bypass (33533)</option>
                <option value="70553">MRI Brain with Contrast (70553)</option>
                <option value="66984">Cataract Phaco + IOL (66984)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 text-[11px] mb-1">
                Billed Amount ({currency === 'INR' ? '₹' : '$'})
              </label>
              <input
                type="number"
                value={billedAmount}
                onChange={(e) => setBilledAmount(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-100 font-mono font-bold text-xs"
                required
              />
            </div>
          </div>

          {/* Real-time Ceiling Guard Indicator */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Statutory Max Allowed Cap:</span>
              <span className="font-mono font-bold text-teal-300">
                {formatCurrency(statutoryCap, currency)}
              </span>
            </div>
            {isBreach ? (
              <div className="text-[11px] text-rose-400 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Exceeds legal cap by +{formatCurrency(excess, currency)}</span>
              </div>
            ) : (
              <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Within statutory rate ceiling</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-500 font-semibold text-white rounded-lg shadow"
            >
              Ingest & Evaluate Claim
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
