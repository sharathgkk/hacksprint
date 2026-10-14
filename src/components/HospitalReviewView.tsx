import React, { useState } from 'react';
import { 
  Building2, 
  Landmark, 
  Scale, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Star, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  FileText, 
  Info, 
  DollarSign, 
  Check, 
  X, 
  ShieldCheck,
  Stethoscope,
  Sparkles,
  Phone,
  UserCheck,
  HelpCircle,
  TrendingDown
} from 'lucide-react';
import { Hospital, HospitalType, HospitalReview, TariffItem } from '../types';
import { formatCurrency } from '../utils/pdfGenerator';

interface HospitalReviewViewProps {
  hospitals: Hospital[];
  onAddHospitalReview: (hospitalId: string, review: Omit<HospitalReview, 'id' | 'date'>) => void;
  currency: 'INR' | 'USD';
  onInspectClaimByHospital?: (hospitalName: string) => void;
}

export const HospitalReviewView: React.FC<HospitalReviewViewProps> = ({
  hospitals,
  onAddHospitalReview,
  currency,
  onInspectClaimByHospital
}) => {
  const [filterType, setFilterType] = useState<'all' | 'government' | 'private' | 'flagged'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>(hospitals[0]?.id || '');
  
  // Review submission modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewHospitalId, setReviewHospitalId] = useState(hospitals[0]?.id || '');
  const [reviewHospitalType, setReviewHospitalType] = useState<HospitalType>('private');
  const [authorName, setAuthorName] = useState('');
  const [reviewerRole, setReviewerRole] = useState<'Verified Patient' | 'SIU Claims Auditor' | 'Ayushman Beneficiary' | 'Medical Examiner'>('Verified Patient');
  const [procedureReviewed, setProcedureReviewed] = useState('Coronary Artery Bypass Graft (CABG)');
  const [billedAmountInput, setBilledAmountInput] = useState<number>(220000);
  const [fairPricingRating, setFairPricingRating] = useState(4);
  const [clinicalCareRating, setClinicalCareRating] = useState(5);
  const [infrastructureRating, setInfrastructureRating] = useState(4);
  const [wasOverchargedInput, setWasOverchargedInput] = useState(false);
  const [reviewComment, setReviewComment] = useState('');

  // Patient Price Estimator & Overcharge Calculator state
  const [calcProcedure, setCalcProcedure] = useState('33533');
  const [calcBilledRate, setCalcBilledRate] = useState<number>(315000);
  const [calcBedDays, setCalcBedDays] = useState<number>(4);
  const [calcWardType, setCalcWardType] = useState<'general' | 'semi_private' | 'private_deluxe' | 'icu'>('icu');
  const [calcDisputeGenerated, setCalcDisputeGenerated] = useState(false);

  const selectedHospital = hospitals.find(h => h.id === selectedHospitalId) || hospitals[0];

  // Filtered hospital list
  const filteredHospitals = hospitals.filter(h => {
    const matchesSearch = 
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.registrationNo.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (filterType === 'all') return true;
    if (filterType === 'government') return h.type === 'government';
    if (filterType === 'private') return h.type === 'private';
    if (filterType === 'flagged') return h.overbillingIncidentCount > 10;
    return true;
  });

  // Calculate procedure limits for main view calculator
  const getSelectedProcedureCap = () => {
    const isGov = selectedHospital?.type === 'government';
    if (calcProcedure === '33533') {
      // CABG
      return isGov ? 55000 : 220000;
    }
    if (calcProcedure === '70553') {
      // MRI Brain (Gov CGHS rate is 2,200, Private NABH cap is 7,500)
      return isGov ? 2200 : 7500;
    }
    if (calcProcedure === '66984') {
      // Cataract
      return isGov ? 14000 : 38000;
    }
    if (calcProcedure === '27447') {
      // Knee
      return isGov ? 65000 : 160000;
    }
    if (calcProcedure === '59510') {
      // C-Section
      return isGov ? 25000 : 95000;
    }
    return isGov ? 30000 : 100000;
  };

  const currentStatutoryCap = getSelectedProcedureCap();
  const isOverchargingDetected = calcBilledRate > currentStatutoryCap;
  const excessAmount = Math.max(0, calcBilledRate - currentStatutoryCap);

  // Modal dynamic cap calculation based on Government vs Private and procedure
  const getModalStatutoryCap = () => {
    const isGov = reviewHospitalType === 'government';
    const procLower = procedureReviewed.toLowerCase();
    if (procLower.includes('cabg') || procLower.includes('bypass') || procLower.includes('heart') || procLower.includes('33533')) {
      return isGov ? 55000 : 220000;
    }
    if (procLower.includes('mri') || procLower.includes('70553') || procLower.includes('scan')) {
      return isGov ? 2200 : 7500;
    }
    if (procLower.includes('cataract') || procLower.includes('eye') || procLower.includes('66984')) {
      return isGov ? 14000 : 38000;
    }
    if (procLower.includes('knee') || procLower.includes('arthroplasty') || procLower.includes('27447')) {
      return isGov ? 65000 : 160000;
    }
    if (procLower.includes('c-section') || procLower.includes('cesarean') || procLower.includes('59510')) {
      return isGov ? 25000 : 95000;
    }
    if (procLower.includes('icu') || procLower.includes('critical')) {
      return isGov ? 4500 : 18000;
    }
    return isGov ? 45000 : 180000;
  };

  const modalCap = getModalStatutoryCap();
  const modalExceeds = billedAmountInput > modalCap;
  const modalExcess = Math.max(0, billedAmountInput - modalCap);

  // Review submission
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !reviewComment.trim()) return;

    const statutoryCap = modalCap;
    const isOvercharged = modalExceeds || wasOverchargedInput;

    onAddHospitalReview(reviewHospitalId, {
      author: authorName,
      role: reviewerRole,
      verifiedHospitalType: reviewHospitalType,
      fairPricingRating,
      clinicalCareRating,
      infrastructureRating,
      comment: reviewComment,
      billedAmount: billedAmountInput,
      statutoryMaxCap: statutoryCap,
      wasOvercharged: isOvercharged,
      procedureReviewed,
      resolutionStatus: isOvercharged ? 'Disputed & Refunded' : 'Compliant'
    });

    setIsReviewModalOpen(false);
    setAuthorName('');
    setReviewComment('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner explaining Government vs Private Review & Price Ceiling */}
      <div className="p-6 rounded-2xl border border-teal-900/60 bg-gradient-to-r from-slate-900 via-[#071d2b] to-slate-900 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-teal-950 border border-teal-800 text-teal-300">
              <Scale className="w-3.5 h-3.5 text-teal-400" />
              <span>STATUTORY PRICE TRANSPARENCY & CLASSIFICATION ENGINE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Hospital Review & Transparent Pricing Tiers
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Before auditing or reviewing hospital bills, the system first verifies whether the establishment is a <span className="text-emerald-400 font-semibold underline decoration-emerald-500/50">Government Hospital</span> (subsidized free-to-nominal CGHS/PM-JAY rates) or a <span className="text-cyan-400 font-semibold underline decoration-cyan-500/50">Private Hospital</span> (regulated NABH tiered maximum ceilings), enforcing strict price caps to eliminate patient overbilling.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                setReviewHospitalId(selectedHospital?.id || hospitals[0]?.id);
                setReviewHospitalType(selectedHospital?.type || 'private');
                setIsReviewModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 shadow-lg shadow-teal-700/25 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Review Hospital & Pricing</span>
            </button>
          </div>
        </div>

        {/* 2-Tier Explanation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5 pt-4 border-t border-slate-800/80 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-emerald-900/40 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/90 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-800/60 font-bold">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-emerald-300">🏛️ Government Hospitals (Public / AIIMS / Civil)</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                  Zero Surprise Cap
                </span>
              </div>
              <p className="text-slate-400 text-[11px] mt-1 leading-normal">
                Subsidized or 100% free under PM-JAY Ayushman Bharat & State Schemes. Standard OPD: ₹10 - ₹50. ICU day capped at ₹1,500 - ₹2,500. Major surgery capped at ₹35,000 - ₹55,000. Zero unauthorized consumable billing allowed.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-cyan-900/40 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/90 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-800/60 font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-cyan-300">🏢 Private Hospitals (Corporate / Trust / Clinics)</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
                  Tiered Statutory Ceiling
                </span>
              </div>
              <p className="text-slate-400 text-[11px] mt-1 leading-normal">
                Regulated by State Clinical Establishments Act and IRDAI Metro Tiers. General Bed max ₹3,500/day. ICU with ventilator capped at ₹18,000 - ₹22,000/day. NPPA stent and knee implant ceiling strictly enforced.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Hospital List Sidebar + Deep Dive Details */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Hospital Selector & Directory */}
        <div className="xl:col-span-5 space-y-4">
          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-400" />
                <span>Verified Hospital Directory</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                {filteredHospitals.length} facilities
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                  filterType === 'all'
                    ? 'bg-teal-600 text-white font-semibold'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilterType('government')}
                className={`px-2.5 py-1 rounded-lg transition-colors font-medium flex items-center gap-1 ${
                  filterType === 'government'
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'bg-slate-950 text-emerald-400 hover:text-emerald-300 border border-emerald-900/60'
                }`}
              >
                <Landmark className="w-3 h-3" />
                <span>Government</span>
              </button>
              <button
                type="button"
                onClick={() => setFilterType('private')}
                className={`px-2.5 py-1 rounded-lg transition-colors font-medium flex items-center gap-1 ${
                  filterType === 'private'
                    ? 'bg-cyan-600 text-white font-semibold'
                    : 'bg-slate-950 text-cyan-400 hover:text-cyan-300 border border-cyan-900/60'
                }`}
              >
                <Building2 className="w-3 h-3" />
                <span>Private</span>
              </button>
              <button
                type="button"
                onClick={() => setFilterType('flagged')}
                className={`px-2.5 py-1 rounded-lg transition-colors font-medium flex items-center gap-1 ${
                  filterType === 'flagged'
                    ? 'bg-rose-600 text-white font-semibold'
                    : 'bg-slate-950 text-rose-400 hover:text-rose-300 border border-rose-900/60'
                }`}
              >
                <AlertTriangle className="w-3 h-3" />
                <span>Overbilling Risk</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by hospital name, city, reg no..."
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Hospital Cards List */}
            <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
              {filteredHospitals.map((hosp) => {
                const isSelected = hosp.id === selectedHospital?.id;
                const isGov = hosp.type === 'government';

                return (
                  <button
                    key={hosp.id}
                    type="button"
                    onClick={() => setSelectedHospitalId(hosp.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-teal-500 bg-slate-800/90 shadow-md ring-1 ring-teal-500/50'
                        : 'border-slate-800 bg-slate-950/60 hover:bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                              isGov
                                ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-800'
                                : 'bg-cyan-950/90 text-cyan-300 border border-cyan-800'
                            }`}
                          >
                            {isGov ? (
                              <>
                                <Landmark className="w-2.5 h-2.5" />
                                <span>Government</span>
                              </>
                            ) : (
                              <>
                                <Building2 className="w-2.5 h-2.5" />
                                <span>Private</span>
                              </>
                            )}
                          </span>

                          <span className="text-[10px] font-mono text-slate-400">
                            {hosp.city}, {hosp.state}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-white mt-1 truncate">
                          {hosp.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {hosp.subcategory}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{hosp.overallRating}</span>
                        </div>
                        <div className="text-[10px] font-mono mt-0.5 text-slate-400">
                          {hosp.priceComplianceScore}% compliant
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Cap: {hosp.statutoryPriceCappingCategory.replace(/_/g, ' ')}</span>
                      {hosp.overbillingIncidentCount > 10 ? (
                        <span className="text-rose-400 font-semibold flex items-center gap-1">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          <span>{hosp.overbillingIncidentCount} Overbills Flagged</span>
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" />
                          <span>Zero-Violation Tier</span>
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Selected Hospital Deep-Dive Review & Transparent Pricing Tiers */}
        <div className="xl:col-span-7 space-y-6">
          {selectedHospital && (
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-6">
              {/* STEP 1: Hospital Type Verification Header */}
              <div className="p-4 rounded-xl border border-teal-900/60 bg-slate-950/80 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        STEP 1: HOSPITAL TYPE VERIFIED
                      </span>
                      <span
                        className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
                          selectedHospital.type === 'government'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                            : 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                        }`}
                      >
                        {selectedHospital.type === 'government' ? (
                          <>
                            <Landmark className="w-3.5 h-3.5" />
                            <span>GOVERNMENT HOSPITAL (Public Institution)</span>
                          </>
                        ) : (
                          <>
                            <Building2 className="w-3.5 h-3.5" />
                            <span>PRIVATE HOSPITAL (Corporate / Multispecialty)</span>
                          </>
                        )}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white">
                      {selectedHospital.name}
                    </h3>
                    <p className="text-xs text-slate-300">
                      {selectedHospital.address} · Est. {selectedHospital.establishedYear}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Tariff Compliance</div>
                      <div className="text-base font-bold text-teal-300 font-mono">
                        {selectedHospital.priceComplianceScore}%
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-teal-950/80 border border-teal-800 flex items-center justify-center text-teal-400">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* Badges row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Registry Reg No.</div>
                    <div className="font-mono font-semibold text-slate-200 truncate">
                      {selectedHospital.registrationNo}
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Accreditation</div>
                    <div className="font-semibold text-teal-300 truncate">
                      {selectedHospital.accreditation.split('&')[0]}
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Total Beds / ICU</div>
                    <div className="font-mono font-semibold text-slate-200">
                      {selectedHospital.bedsCount} / {selectedHospital.icuBedsCount} ICU
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Audited Claims</div>
                    <div className="font-mono font-semibold text-slate-200">
                      {selectedHospital.totalAuditedClaims} records
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 2: Interactive Patient Price Estimator & Overcharge Calculator */}
              <div className="p-4 rounded-xl border border-amber-900/50 bg-amber-950/15 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-amber-400" />
                    <h4 className="text-xs font-bold text-amber-200 uppercase tracking-wide">
                      Patient Price Estimator & Overcharge Protection Calculator
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-amber-300/80">
                    Auto-pegged to {selectedHospital.type.toUpperCase()} statutory rate
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] text-slate-300 font-medium mb-1">
                      Target Clinical Procedure
                    </label>
                    <select
                      value={calcProcedure}
                      onChange={(e) => setCalcProcedure(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                    >
                      <option value="33533">CABG Heart Bypass (CPT 33533)</option>
                      <option value="70553">MRI Brain with Contrast (CPT 70553)</option>
                      <option value="66984">Cataract Surgery with IOL (CPT 66984)</option>
                      <option value="27447">Total Knee Replacement (CPT 27447)</option>
                      <option value="59510">Cesarean Delivery (CPT 59510)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 font-medium mb-1">
                      Hospital Quoted / Billed Amount ({currency === 'INR' ? '₹' : '$'})
                    </label>
                    <input
                      type="number"
                      value={calcBilledRate}
                      onChange={(e) => setCalcBilledRate(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex flex-col justify-end">
                    <button
                      type="button"
                      onClick={() => setCalcDisputeGenerated(true)}
                      className="w-full py-2 rounded-lg bg-amber-600 hover:bg-amber-500 font-semibold text-white transition-colors text-xs flex items-center justify-center gap-1.5 shadow"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Audit Overcharge</span>
                    </button>
                  </div>
                </div>

                {/* Calculation Results Banner */}
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="text-slate-400 text-[11px]">
                      Mandated Statutory Ceiling for {selectedHospital.type === 'government' ? 'Government Hospital (CGHS)' : 'Private Tier 1 (NABH)'}
                    </div>
                    <div className="text-base font-bold font-mono text-teal-300">
                      {formatCurrency(currentStatutoryCap, currency)}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-slate-400 text-[11px]">Pricing Audit Status</div>
                    {isOverchargingDetected ? (
                      <div className="text-sm font-bold text-rose-400 flex items-center gap-1 justify-end font-mono">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>OVERCHARGED (+{formatCurrency(excessAmount, currency)})</span>
                      </div>
                    ) : (
                      <div className="text-sm font-bold text-emerald-400 flex items-center gap-1 justify-end font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>WITHIN LEGAL CEILING</span>
                      </div>
                    )}
                  </div>
                </div>

                {calcDisputeGenerated && isOverchargingDetected && (
                  <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-xs space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between text-rose-300 font-bold">
                      <span className="flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                        <span>Statutory Overbilling Notice Ready for Filing</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setCalcDisputeGenerated(false)}
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Under Section 1128A & State Clinical Establishments Mandate, <strong>{selectedHospital.name}</strong> ({selectedHospital.type.toUpperCase()}) cannot bill above {formatCurrency(currentStatutoryCap, currency)}. Patient is legally entitled to immediate refund or billing disallowance of {formatCurrency(excessAmount, currency)}.
                    </p>
                  </div>
                )}
              </div>

              {/* STEP 3: Transparent Mandated Pricing Tiers Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Scale className="w-4 h-4 text-teal-400" />
                    <span>Transparent Procedure Tariffs & Maximum Ceilings</span>
                  </h4>
                  <span className="text-[11px] font-mono text-slate-400">
                    Mandatory Schedule
                  </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/90 text-slate-400 text-[10px] uppercase font-mono border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">Procedure & Code</th>
                        <th className="py-2.5 px-3">Category</th>
                        <th className="py-2.5 px-3">Hospital Tariff</th>
                        <th className="py-2.5 px-3">Statutory Max Cap</th>
                        <th className="py-2.5 px-3">Subsidized / CGHS</th>
                        <th className="py-2.5 px-3">Compliance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 bg-slate-900/60 font-sans">
                      {selectedHospital.tariffs && selectedHospital.tariffs.length > 0 ? (
                        selectedHospital.tariffs.map((t, idx) => {
                          const isBreach = t.hospitalTariff > t.statutoryMaxCeiling;

                          return (
                            <tr key={idx} className="hover:bg-slate-800/40">
                              <td className="py-2.5 px-3">
                                <div className="font-semibold text-slate-100">{t.procedureName}</div>
                                <div className="text-[10px] font-mono text-slate-500">{t.procedureCode}</div>
                              </td>
                              <td className="py-2.5 px-3 text-slate-400 text-[11px]">{t.category}</td>
                              <td className="py-2.5 px-3 font-mono font-semibold text-slate-200">
                                {formatCurrency(t.hospitalTariff, currency)}
                              </td>
                              <td className="py-2.5 px-3 font-mono font-bold text-teal-300">
                                {formatCurrency(t.statutoryMaxCeiling, currency)}
                              </td>
                              <td className="py-2.5 px-3 font-mono text-slate-400 text-[11px]">
                                {formatCurrency(t.ayushmanSubsidizedRate, currency)}
                              </td>
                              <td className="py-2.5 px-3">
                                {isBreach ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-950/80 text-rose-300 border border-rose-800">
                                    <AlertTriangle className="w-2.5 h-2.5" />
                                    <span>Exceeds Cap</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                                    <Check className="w-2.5 h-2.5" />
                                    <span>Compliant</span>
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-4 text-center text-slate-500">
                            Standard benchmark tariffs peg to {selectedHospital.type === 'government' ? 'Government CGHS Subsidized Schedule' : 'Private Metro Tier 1 Ceiling'}.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* STEP 4: Verified Patient & Auditor Reviews */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-teal-400" />
                    <span>Verified Reviews ({selectedHospital.reviews?.length || 0})</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setReviewHospitalId(selectedHospital.id);
                      setReviewHospitalType(selectedHospital.type);
                      setIsReviewModalOpen(true);
                    }}
                    className="text-xs text-teal-400 hover:text-teal-300 underline font-semibold"
                  >
                    + Write Review for {selectedHospital.name}
                  </button>
                </div>

                <div className="space-y-3">
                  {selectedHospital.reviews && selectedHospital.reviews.length > 0 ? (
                    selectedHospital.reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2 text-xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-slate-200">{rev.author}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-teal-300 font-mono">
                                {rev.role}
                              </span>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono ${
                                  rev.verifiedHospitalType === 'government'
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                    : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                                }`}
                              >
                                Verified {rev.verifiedHospitalType.toUpperCase()}
                              </span>
                            </div>
                            {rev.procedureReviewed && (
                              <div className="text-[11px] text-slate-400 mt-0.5">
                                Procedure: <strong className="text-slate-300">{rev.procedureReviewed}</strong>
                              </div>
                            )}
                          </div>

                          <div className="text-right shrink-0">
                            <div className="flex items-center gap-1 text-amber-400 text-xs font-bold justify-end">
                              <Star className="w-3 h-3 fill-amber-400" />
                              <span>{rev.fairPricingRating}/5</span>
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">{rev.date}</div>
                          </div>
                        </div>

                        <p className="text-slate-300 text-xs leading-relaxed">
                          "{rev.comment}"
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-[11px]">
                          <div className="flex items-center gap-4 text-slate-400">
                            <span>Clinical Care: <strong className="text-slate-200">{rev.clinicalCareRating}/5</strong></span>
                            <span>Infrastructure: <strong className="text-slate-200">{rev.infrastructureRating}/5</strong></span>
                          </div>

                          {rev.wasOvercharged ? (
                            <span className="text-rose-400 font-semibold flex items-center gap-1 text-[11px]">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Overcharge Flagged ({rev.resolutionStatus})</span>
                            </span>
                          ) : (
                            <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Honored Statutory Price Cap</span>
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center rounded-xl border border-dashed border-slate-800 text-slate-500 text-xs">
                      No reviews recorded yet for this facility. Click "Review Hospital & Pricing" to record clinical and tariff feedback.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Review Submission Modal with Mandatory Government vs Private Check & Dynamic Max Charges */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full shadow-2xl p-6 text-xs space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Scale className="w-4 h-4 text-teal-400" />
                  <span>Review Hospital & Verify Mandated Pricing</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Step 1 verifies Government vs Private status to determine statutory maximum legal charges.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Select Hospital */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">Select Facility</label>
                <select
                  value={reviewHospitalId}
                  onChange={(e) => {
                    setReviewHospitalId(e.target.value);
                    const h = hospitals.find(x => x.id === e.target.value);
                    if (h) setReviewHospitalType(h.type);
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs"
                >
                  {hospitals.map(h => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.type === 'government' ? '🏛️ Government' : '🏢 Private'}) - {h.city}
                    </option>
                  ))}
                </select>
              </div>

              {/* STEP 1: Mandatory Government vs Private Status Verification */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-teal-900/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-teal-300 font-bold uppercase tracking-wider text-[10px]">
                    STEP 1: CONFIRM FACILITY OPERATING STATUS
                  </label>
                  <span className="text-[10px] font-mono text-amber-400">Mandatory Verification</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewHospitalType('government')}
                    className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 font-medium transition-all ${
                      reviewHospitalType === 'government'
                        ? 'bg-emerald-600 text-white font-bold shadow ring-2 ring-emerald-400/40'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    <Landmark className="w-3.5 h-3.5" />
                    <span>Government Hospital</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReviewHospitalType('private')}
                    className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 font-medium transition-all ${
                      reviewHospitalType === 'private'
                        ? 'bg-cyan-600 text-white font-bold shadow ring-2 ring-cyan-400/40'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Private Hospital</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-300 pt-1">
                  {reviewHospitalType === 'government'
                    ? '🏛️ Rates will be enforced against CGHS / PM-JAY Ayushman Bharat Subsidized Government Schedule.'
                    : '🏢 Rates will be enforced against Clinical Establishments Act Private Metro Tier Ceilings.'}
                </p>
              </div>

              {/* STEP 2: Mandated Maximum Charges & Transparent Pricing Tiers Display */}
              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-teal-400" />
                    <span>STEP 2: MANDATED MAXIMUM LEGAL CHARGES & PRICING TIERS</span>
                  </span>
                  <span className="font-mono text-teal-300 font-bold">
                    Max Legal Cap: {formatCurrency(modalCap, currency)}
                  </span>
                </div>

                {/* Pricing Tiers Schedule Table for Patients */}
                <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <div className="text-slate-400">General Ward</div>
                    <div className="font-bold text-slate-200 font-mono mt-0.5">
                      {reviewHospitalType === 'government' ? 'Free - ₹350/day' : 'Max ₹3,500/day'}
                    </div>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <div className="text-slate-400">Semi-Private</div>
                    <div className="font-bold text-slate-200 font-mono mt-0.5">
                      {reviewHospitalType === 'government' ? '₹1,000/day' : '₹5,500/day'}
                    </div>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <div className="text-slate-400">Deluxe Room</div>
                    <div className="font-bold text-slate-200 font-mono mt-0.5">
                      {reviewHospitalType === 'government' ? 'N/A' : '₹10,000/day'}
                    </div>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <div className="text-slate-400">Critical Care / ICU</div>
                    <div className="font-bold text-slate-200 font-mono mt-0.5">
                      {reviewHospitalType === 'government' ? '₹4,500/day' : '₹18,000/day'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Author & Role */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Your Name</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Ramesh Kulkarni"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Reviewer Role</label>
                  <select
                    value={reviewerRole}
                    onChange={(e) => setReviewerRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                  >
                    <option value="Verified Patient">Verified Patient</option>
                    <option value="SIU Claims Auditor">SIU Claims Auditor</option>
                    <option value="Ayushman Beneficiary">Ayushman Beneficiary</option>
                    <option value="Medical Examiner">Medical Examiner</option>
                  </select>
                </div>
              </div>

              {/* Procedure & Billed amount */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Procedure Reviewed</label>
                  <input
                    type="text"
                    value={procedureReviewed}
                    onChange={(e) => setProcedureReviewed(e.target.value)}
                    placeholder="e.g. CABG, MRI, ICU Stay"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Total Amount Billed ({currency === 'INR' ? '₹' : '$'})
                  </label>
                  <input
                    type="number"
                    value={billedAmountInput}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setBilledAmountInput(val);
                      if (val > modalCap) {
                        setWasOverchargedInput(true);
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono"
                  />
                </div>
              </div>

              {/* Dynamic Compliance / Overcharging Alert */}
              {modalExceeds ? (
                <div className="p-3 rounded-lg bg-rose-950/70 border border-rose-800 text-[11px] text-rose-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-rose-200">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    <span>Statutory Ceiling Breach: Exceeds {reviewHospitalType.toUpperCase()} Limit by {formatCurrency(modalExcess, currency)}!</span>
                  </div>
                  <p className="text-slate-300">
                    The mandated legal ceiling for this procedure is {formatCurrency(modalCap, currency)}. This overcharge will be recorded as a statutory violation and flagged for patient refund.
                  </p>
                </div>
              ) : (
                <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-[11px] text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Compliant: Billed charge is within the statutory maximum ceiling of {formatCurrency(modalCap, currency)} for {reviewHospitalType} institutions.</span>
                </div>
              )}

              {/* Overcharging Checkbox */}
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <input
                  type="checkbox"
                  id="overchargeCheck"
                  checked={wasOverchargedInput}
                  onChange={(e) => setWasOverchargedInput(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="overchargeCheck" className="text-slate-200 font-medium cursor-pointer">
                  Did the hospital exceed statutory maximum charges or bill unexpected consumables?
                </label>
              </div>

              {/* Ratings */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-300 text-[11px] mb-1">Fair Pricing (1-5)</label>
                  <select
                    value={fairPricingRating}
                    onChange={(e) => setFairPricingRating(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-100 text-xs"
                  >
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 text-[11px] mb-1">Clinical Care (1-5)</label>
                  <select
                    value={clinicalCareRating}
                    onChange={(e) => setClinicalCareRating(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-100 text-xs"
                  >
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 text-[11px] mb-1">Infrastructure (1-5)</label>
                  <select
                    value={infrastructureRating}
                    onChange={(e) => setInfrastructureRating(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-100 text-xs"
                  >
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Detailed Experience & Tariff Transparency Feedback
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={3}
                  placeholder="Describe whether itemized estimates were provided upfront, bed charges adhered to government/private caps, or if unexpected surcharges were added..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 font-semibold text-white shadow"
                >
                  Submit Verified Review & Pricing Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
