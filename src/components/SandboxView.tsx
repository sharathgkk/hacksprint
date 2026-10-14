import React, { useState } from 'react';
import { 
  FlaskConical, 
  Sparkles, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Scale, 
  Landmark, 
  Building2, 
  ArrowRight,
  FilePlus,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { Hospital, Claim } from '../types';
import { formatCurrency } from '../utils/pdfGenerator';

interface SandboxViewProps {
  hospitals: Hospital[];
  onIngestClaim: (claim: Claim) => void;
  currency: 'INR' | 'USD';
  onNavigateToDossier: (claim: Claim) => void;
}

export const SandboxView: React.FC<SandboxViewProps> = ({
  hospitals,
  onIngestClaim,
  currency,
  onNavigateToDossier
}) => {
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>(hospitals[2]?.id || hospitals[0]?.id);
  const [patientId, setPatientId] = useState('P-10842');
  const [patientName, setPatientName] = useState('Devika Rao');
  const [patientAge, setPatientAge] = useState(52);
  const [patientGender, setPatientGender] = useState<'M' | 'F' | 'Other'>('F');
  const [specialty, setSpecialty] = useState('Cardiology');
  const [diagnosisCode, setDiagnosisCode] = useState('I25.10');
  const [procedureCode, setProcedureCode] = useState('33533');
  const [unitsBilled, setUnitsBilled] = useState(1);
  const [billedAmount, setBilledAmount] = useState(315000);
  const [serviceDate, setServiceDate] = useState('2026-06-12');
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulationResult, setSimulationResult] = useState<Claim | null>(null);

  const selectedHospital = hospitals.find((h) => h.id === selectedHospitalId) || hospitals[0];
  const isGov = selectedHospital?.type === 'government';

  // Load preset scenario
  const handleLoadPreset = (presetKey: string) => {
    switch (presetKey) {
      case 'cold_bypass':
        setPatientId('P-9910');
        setPatientName('Anand Verma');
        setPatientAge(54);
        setPatientGender('M');
        setSpecialty('Cardiology');
        setSelectedHospitalId('HSP-101');
        setDiagnosisCode('J00');
        setProcedureCode('33533');
        setBilledAmount(1800000);
        setUnitsBilled(1);
        break;
      case 'exact_duplicate':
        setPatientId('P-001');
        setPatientName('Rajesh Kumar');
        setPatientAge(44);
        setPatientGender('M');
        setSpecialty('Radiology');
        setSelectedHospitalId('HSP-101');
        setDiagnosisCode('G43.909');
        setProcedureCode('70553');
        setBilledAmount(8500);
        setUnitsBilled(1);
        break;
      case 'provider_spike':
        setPatientId('P-4401');
        setPatientName('Kunal Singhania');
        setPatientAge(36);
        setPatientGender('M');
        setSpecialty('Radiology');
        setSelectedHospitalId('HSP-410');
        setDiagnosisCode('R07.9');
        setProcedureCode('70553');
        setBilledAmount(8500);
        setUnitsBilled(1);
        break;
      case 'over_utilization':
        setPatientId('P-2041');
        setPatientName('Ananya Deshmukh');
        setPatientAge(29);
        setPatientGender('F');
        setSpecialty('Neurology');
        setSelectedHospitalId('HSP-410');
        setDiagnosisCode('G43.909');
        setProcedureCode('70553');
        setBilledAmount(64000);
        setUnitsBilled(8);
        break;
      case 'upcoding_lvl5':
        setPatientId('P-3091');
        setPatientName('Sunita Patel');
        setPatientAge(38);
        setPatientGender('F');
        setSpecialty('Critical Care');
        setSelectedHospitalId('HSP-GOV-01');
        setDiagnosisCode('M54.5');
        setProcedureCode('99291');
        setBilledAmount(24000);
        setUnitsBilled(1);
        break;
      case 'clean_cataract':
        setPatientId('P-8802');
        setPatientName('Sushila Iyer');
        setPatientAge(67);
        setPatientGender('F');
        setSpecialty('Ophthalmology');
        setSelectedHospitalId('HSP-GOV-02');
        setDiagnosisCode('H25.9');
        setProcedureCode('66984');
        setBilledAmount(8000);
        setUnitsBilled(1);
        break;
      case 'gov_tariff_breach':
        setPatientId('P-6011');
        setPatientName('Dinesh Yadav');
        setPatientAge(45);
        setPatientGender('M');
        setSpecialty('Orthopedics');
        setSelectedHospitalId('HSP-GOV-01');
        setDiagnosisCode('M54.5');
        setProcedureCode('99291');
        setBilledAmount(28000);
        setUnitsBilled(1);
        break;
      case 'pvt_cabg_breach':
        setPatientId('P-10842');
        setPatientName('Devika Rao');
        setPatientAge(52);
        setPatientGender('F');
        setSpecialty('Cardiology');
        setSelectedHospitalId('HSP-101');
        setDiagnosisCode('I25.10');
        setProcedureCode('33533');
        setBilledAmount(315000);
        setUnitsBilled(1);
        break;
    }
  };

  // Run simulation & ingestion
  const handleRunDetection = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      // Determine Statutory Cap based on Hospital Type
      let statutoryCap = isGov ? 45000 : 200000;
      let procName = 'Surgical / Clinical Procedure';

      if (procedureCode === '33533') {
        procName = 'Coronary artery bypass graft (CABG), single arterial';
        statutoryCap = isGov ? 55000 : 220000;
      } else if (procedureCode === '70553') {
        procName = 'MRI Brain with and without contrast material';
        statutoryCap = isGov ? 2200 : 7500;
      } else if (procedureCode === '66984') {
        procName = 'Extracapsular cataract removal with IOL';
        statutoryCap = isGov ? 14000 : 38000;
      } else if (procedureCode === '99291') {
        procName = 'Critical care management of critically ill patient';
        statutoryCap = isGov ? 3000 : 18000;
      }

      const isBreach = billedAmount > statutoryCap;
      const excess = Math.max(0, billedAmount - statutoryCap);

      // Calculate score & violations
      let score = 15;
      const policyViolations: any[] = [];
      const shapFactors: any[] = [];

      // Cold bypass extreme check
      if (diagnosisCode === 'J00' && procedureCode === '33533') {
        score = 99;
        policyViolations.push({
          ruleId: 'RULE-MEDNEC-01',
          ruleName: 'Severe Medical Acuity Discordance',
          severity: 'CRITICAL',
          description: 'Heart bypass (CPT 33533) billed for acute common cold nasopharyngitis (ICD J00). Extreme clinical mismatch.'
        });
        shapFactors.push({
          feature: 'Diagnosis vs Operative Code Discordance',
          impact: 0.85,
          description: 'J00 does not warrant cardiovascular bypass',
          direction: 'increases_risk'
        });
      }

      // Exact duplicate check
      if (patientId === 'P-001' && procedureCode === '70553') {
        score = Math.max(score, 96);
        policyViolations.push({
          ruleId: 'RULE-DUP-01',
          ruleName: '100% Collision Exact Duplicate Billing',
          severity: 'CRITICAL',
          description: 'Duplicate claim collision detected for patient P-001 on same date of service.'
        });
      }

      // Upcoding check
      if (diagnosisCode === 'M54.5' && procedureCode === '99291') {
        score = Math.max(score, 92);
        policyViolations.push({
          ruleId: 'RULE-UPCODE-01',
          ruleName: 'Level 5 Critical Care Upcoding for Benign Back Pain',
          severity: 'CRITICAL',
          description: 'CPT 99291 requires life-threatening organ failure. Patient has uncomplicated lumbar strain.'
        });
      }

      // Overutilization
      if (unitsBilled >= 5) {
        score = Math.max(score, 95);
        policyViolations.push({
          ruleId: 'RULE-FREQ-01',
          ruleName: 'Daily Velocity & Over-utilization Spike',
          severity: 'CRITICAL',
          description: `Billed ${unitsBilled} identical diagnostic acquisitions in single episode.`
        });
      }

      // Statutory Tariff Violation
      if (isBreach) {
        score = Math.max(score, 75);
        policyViolations.push({
          ruleId: 'RULE-PRICE-01',
          ruleName: 'Statutory Tariff Ceiling Violation',
          severity: isGov ? 'CRITICAL' : 'HIGH',
          description: `Billed ${formatCurrency(billedAmount, currency)} exceeds mandated ${selectedHospital.type.toUpperCase()} ceiling of ${formatCurrency(statutoryCap, currency)} by ${formatCurrency(excess, currency)}.`
        });
        shapFactors.push({
          feature: `Billed Amount vs Mandated ${selectedHospital.type.toUpperCase()} Cap`,
          impact: 0.52,
          description: `Exceeds legal price ceiling by ${formatCurrency(excess, currency)}`,
          direction: 'increases_risk'
        });
      }

      if (policyViolations.length === 0) {
        score = 8;
        shapFactors.push({
          feature: 'Full Statutory Compliance',
          impact: -0.42,
          description: `Pricing within permissible legal ceiling schedule`,
          direction: 'decreases_risk'
        });
      }

      const generatedClaim: Claim = {
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
        specialty,
        city: selectedHospital.city,
        state: selectedHospital.state,
        admissionDate: serviceDate,
        dischargeDate: serviceDate,
        lengthOfStay: 2,
        diagnosisCode,
        diagnosisName: 'Clinical Diagnostic Finding',
        procedureCode,
        procedureName: procName,
        unitsBilled,
        billedAmount,
        peerAverageAmount: statutoryCap * 0.95,
        statutoryMaxAmount: statutoryCap,
        priceCeilingBreach: isBreach,
        overbilledExcess: excess,
        ceilingBreachReason: isBreach
          ? `Facility is a ${selectedHospital.type.toUpperCase()} Hospital with statutory ceiling of ${formatCurrency(statutoryCap, currency)}. Billed ${formatCurrency(billedAmount, currency)}, resulting in +${formatCurrency(excess, currency)} excess over legal ceiling.`
          : undefined,
        anomalyScore: score,
        riskLevel: score >= 85 ? 'CRITICAL' : score >= 65 ? 'HIGH' : score >= 40 ? 'SUSPICIOUS' : 'CLEAN',
        status: score < 40 ? 'approved_clean' : 'pending_review',
        policyViolations,
        shapFactors,
        items: [
          {
            code: procedureCode,
            name: procName,
            quantity: unitsBilled,
            unitPrice: Math.round(billedAmount / unitsBilled),
            totalPrice: billedAmount,
            maxAllowedRate: statutoryCap,
            isExceeded: isBreach,
            category: 'Surgical Procedure'
          }
        ],
        adjudicationHistory: []
      };

      setSimulationResult(generatedClaim);
      onIngestClaim(generatedClaim);
    }, 450);
  };

  return (
    <div className="space-y-6">
      {/* Sandbox Header */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950 border border-cyan-800 text-cyan-300">
            <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
            <span>SYNTHETIC INGESTION & TARIFF CEILING SIMULATION SANDBOX</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Batch Testing Sandbox & Anomaly Detection Simulator
          </h2>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            Test real-time anomaly detection, duplicate collision matching, clinical knowledge graph crosswalks, SHAP explainability, and <strong className="text-teal-300">Government vs Private Hospital Price Ceiling Capping</strong>. Select pre-configured presets or configure a custom claim.
          </p>
        </div>

        {/* 8 Preset Buttons */}
        <div className="pt-3 border-t border-slate-800/80 space-y-2">
          <span className="text-[11px] font-mono text-slate-400 block">
            Load Pre-configured Scenario Presets:
          </span>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleLoadPreset('cold_bypass')}
              className="px-2.5 py-1.5 rounded-lg bg-rose-950/80 text-rose-300 border border-rose-800 hover:bg-rose-900/70 transition-colors font-medium"
            >
              Heart Bypass for Cold (₹18L Mismatch)
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset('exact_duplicate')}
              className="px-2.5 py-1.5 rounded-lg bg-amber-950/80 text-amber-300 border border-amber-800 hover:bg-amber-900/70 transition-colors font-medium"
            >
              Exact Duplicate Brain MRI (100% Collision)
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset('pvt_cabg_breach')}
              className="px-2.5 py-1.5 rounded-lg bg-cyan-950/80 text-cyan-300 border border-cyan-800 hover:bg-cyan-900/70 transition-colors font-medium"
            >
              Private CABG Price Ceiling Breach (+₹95k)
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset('gov_tariff_breach')}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-800 hover:bg-emerald-900/70 transition-colors font-medium"
            >
              Gov Hospital Tariff Breach (Public Cap)
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset('over_utilization')}
              className="px-2.5 py-1.5 rounded-lg bg-rose-950/80 text-rose-300 border border-rose-800 hover:bg-rose-900/70 transition-colors font-medium"
            >
              Over-utilization (8x Brain MRI)
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset('upcoding_lvl5')}
              className="px-2.5 py-1.5 rounded-lg bg-purple-950/80 text-purple-300 border border-purple-800 hover:bg-purple-900/70 transition-colors font-medium"
            >
              Level 5 Upcoding for Low Back Pain
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset('clean_cataract')}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-800 hover:bg-emerald-900/70 transition-colors font-medium"
            >
              Clean Statutory Cataract (₹8k Clean)
            </button>
          </div>
        </div>
      </div>

      {/* Simulator Form + Result Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form */}
        <div className="lg:col-span-7 p-6 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>Interactive Claim Ingestion Gateway</span>
          </h3>

          <form onSubmit={handleRunDetection} className="space-y-4 text-xs">
            {/* Facility Selector */}
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Target Hospital Facility (Auto-Classifies Government vs Private)
              </label>
              <select
                value={selectedHospitalId}
                onChange={(e) => setSelectedHospitalId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs focus:outline-none focus:border-teal-500"
              >
                {hospitals.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} [{h.type === 'government' ? '🏛️ GOVERNMENT' : '🏢 PRIVATE'}] - {h.city}
                  </option>
                ))}
              </select>

              <div className="mt-1.5 flex items-center gap-2 text-[11px] text-slate-400">
                <span>Facility Type:</span>
                <span
                  className={`font-mono font-bold px-2 py-0.2 rounded ${
                    isGov
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  }`}
                >
                  {isGov ? '🏛️ GOVERNMENT (Subsidized Capped)' : '🏢 PRIVATE (Tiered Price Ceiling)'}
                </span>
              </div>
            </div>

            {/* Patient Metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-300 text-[11px] mb-1">Patient ID</label>
                <input
                  type="text"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-100 font-mono text-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 text-[11px] mb-1">Patient Name</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
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

            {/* Medical Codes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 text-[11px] mb-1">ICD-10 Diagnosis</label>
                <input
                  type="text"
                  value={diagnosisCode}
                  onChange={(e) => setDiagnosisCode(e.target.value)}
                  placeholder="e.g. I25.10, J00, M54.5"
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-100 font-mono text-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 text-[11px] mb-1">CPT Procedure</label>
                <input
                  type="text"
                  value={procedureCode}
                  onChange={(e) => setProcedureCode(e.target.value)}
                  placeholder="e.g. 33533, 70553, 66984"
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-100 font-mono text-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 text-[11px] mb-1">Units Billed</label>
                <input
                  type="number"
                  value={unitsBilled}
                  onChange={(e) => setUnitsBilled(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-100 text-xs"
                  min={1}
                  required
                />
              </div>
            </div>

            {/* Billed Amount & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              <div>
                <label className="block text-slate-300 text-[11px] mb-1">Service Date</label>
                <input
                  type="date"
                  value={serviceDate}
                  onChange={(e) => setServiceDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-100 text-xs"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-2.5 rounded-xl font-bold text-white bg-teal-600 hover:bg-teal-500 transition-colors shadow-lg shadow-teal-700/25 flex items-center justify-center gap-2 text-xs"
            >
              {isProcessing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Execute Dual-Engine AI & Price Ceiling Evaluation</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Real-time Result Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Real-Time Ingestion Engine Output</span>
            </h3>

            {simulationResult ? (
              <div className="space-y-4 text-xs animate-in fade-in">
                {/* Result Score */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400">Composite Anomaly Score</div>
                    <div
                      className={`text-2xl font-bold font-mono ${
                        simulationResult.anomalyScore >= 80
                          ? 'text-rose-400'
                          : simulationResult.anomalyScore >= 50
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {simulationResult.anomalyScore} / 100
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      Severity: {simulationResult.riskLevel}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">Claim Assigned ID</div>
                    <div className="text-base font-bold font-mono text-teal-300">
                      {simulationResult.claimId}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      Ingested into Queue
                    </div>
                  </div>
                </div>

                {/* Statutory Price Ceiling Result */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Facility Verified Type:</span>
                    <span
                      className={`font-mono font-bold text-[10px] px-2 py-0.2 rounded ${
                        simulationResult.hospitalType === 'government'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                      }`}
                    >
                      {simulationResult.hospitalType.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Mandated Statutory Ceiling:</span>
                    <span className="font-mono font-bold text-teal-300">
                      {formatCurrency(simulationResult.statutoryMaxAmount, currency)}
                    </span>
                  </div>

                  {simulationResult.priceCeilingBreach ? (
                    <div className="pt-2 border-t border-slate-900 text-rose-400 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>
                        PRICE BREACH: +{formatCurrency(simulationResult.overbilledExcess, currency)} Surcharge Disallowed
                      </span>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-slate-900 text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Compliant with Mandatory Price Caps</span>
                    </div>
                  )}
                </div>

                {/* Violations */}
                {simulationResult.policyViolations.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono text-rose-400 font-semibold">
                      Triggered Policy Rules ({simulationResult.policyViolations.length}):
                    </span>
                    {simulationResult.policyViolations.map((v, i) => (
                      <div key={i} className="p-2 rounded-lg bg-rose-950/30 border border-rose-900/60 text-[11px] text-rose-300">
                        <strong>[{v.severity}]</strong> {v.ruleName}
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => onNavigateToDossier(simulationResult)}
                  className="w-full py-2 rounded-lg bg-teal-600 hover:bg-teal-500 font-semibold text-white transition-colors flex items-center justify-center gap-1.5 shadow"
                >
                  <span>Open Full Forensic Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl space-y-2">
                <FlaskConical className="w-8 h-8 mx-auto text-slate-600" />
                <p>
                  Load a preset above or configure a claim and press "Execute Dual-Engine AI & Price Ceiling Evaluation" to see instant findings.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
