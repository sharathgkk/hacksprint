import React, { useState } from 'react';
import { 
  Inbox, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Scale, 
  Building2, 
  Landmark, 
  ShieldAlert, 
  ShieldCheck, 
  DollarSign,
  TrendingDown,
  ArrowRight
} from 'lucide-react';
import { Claim, ClaimStatus, ClaimRiskLevel } from '../types';
import { formatCurrency } from '../utils/pdfGenerator';

interface QueueViewProps {
  claims: Claim[];
  onSelectClaim: (claim: Claim) => void;
  onQuickApprove: (claimId: string) => void;
  currency: 'INR' | 'USD';
}

export const QueueView: React.FC<QueueViewProps> = ({
  claims,
  onSelectClaim,
  onQuickApprove,
  currency
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterHospType, setFilterHospType] = useState<string>('all');

  // Metrics
  const totalClaims = claims.length;
  const criticalCount = claims.filter(c => c.riskLevel === 'CRITICAL').length;
  const priceBreachCount = claims.filter(c => c.priceCeilingBreach).length;
  const totalOverbilledExcess = claims.reduce((acc, c) => acc + (c.overbilledExcess || 0), 0);
  const pendingCount = claims.filter(c => c.status === 'pending_review' || c.status === 'under_investigation').length;

  const filteredClaims = claims.filter(c => {
    const matchesSearch = 
      c.claimId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.procedureName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.procedureCode.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (filterSeverity === 'critical' && c.riskLevel !== 'CRITICAL') return false;
    if (filterSeverity === 'high' && c.riskLevel !== 'HIGH') return false;
    if (filterSeverity === 'suspicious' && c.riskLevel !== 'SUSPICIOUS') return false;
    if (filterSeverity === 'clean' && c.riskLevel !== 'CLEAN') return false;
    if (filterSeverity === 'price_breach' && !c.priceCeilingBreach) return false;

    if (filterStatus === 'pending' && !(c.status === 'pending_review' || c.status === 'under_investigation')) return false;
    if (filterStatus === 'rfi' && c.status !== 'rfi_requested') return false;
    if (filterStatus === 'approved' && c.status !== 'approved_clean') return false;
    if (filterStatus === 'fraud' && c.status !== 'fraud_denied') return false;

    if (filterHospType === 'government' && c.hospitalType !== 'government') return false;
    if (filterHospType === 'private' && c.hospitalType !== 'private') return false;

    return true;
  });

  return (
    <div className="space-y-6">
      {/* COMPANY / PAYER SIU COMMAND CENTER HERO BANNER */}
      <div className="p-6 rounded-2xl border border-teal-900/60 bg-gradient-to-r from-[#061826] via-[#082236] to-[#061826] shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-700/80 font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                The Company (Insurer / Payer) · SIU Command Center
              </span>
              <span className="text-xs font-mono font-bold px-3 py-0.5 rounded-full bg-slate-900 text-teal-200 border border-slate-700">
                IRDAI & Section 1128A Regulatory Enforcement
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Clinical Claims Surveillance & Fraud Review
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Special Investigation Unit intelligence engine: audits incoming hospital bills against <strong className="text-emerald-400">Government vs Private</strong> statutory price ceilings, detects NCCI unbundling, prevents duplicate billing, and disallows illegal procedural surcharges.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/80 p-3.5 rounded-xl border border-teal-900/50 text-xs">
            <div className="text-right">
              <div className="text-[10px] uppercase font-mono text-slate-400">Total Statutory Savings</div>
              <div className="text-xl font-bold font-mono text-emerald-400">
                {formatCurrency(totalOverbilledExcess, currency)}
              </div>
              <div className="text-[10px] text-teal-300">Protected patient liability</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-950 border border-teal-800 flex items-center justify-center text-teal-400">
              <Scale className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Pending SIU Audit</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {pendingCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Out of {totalClaims} ingested claims
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-rose-900/50 bg-rose-950/20 shadow-md">
          <div className="flex items-center justify-between text-rose-300 text-xs">
            <span>Critical Anomaly Flagged</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-300 mt-1">
            {criticalCount}
          </div>
          <div className="text-[11px] text-rose-400/80 mt-1">
            Require senior auditor sign-off
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-amber-900/50 bg-amber-950/20 shadow-md">
          <div className="flex items-center justify-between text-amber-300 text-xs">
            <span>Tariff Ceiling Breaches</span>
            <Scale className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300 mt-1">
            {priceBreachCount}
          </div>
          <div className="text-[11px] text-amber-400/80 mt-1">
            Exceeded Gov/Private maximum caps
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-emerald-900/50 bg-emerald-950/20 shadow-md">
          <div className="flex items-center justify-between text-emerald-300 text-xs">
            <span>Disallowed Excess Surcharges</span>
            <TrendingDown className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-300 mt-1">
            {formatCurrency(totalOverbilledExcess, currency)}
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-1">
            Patient savings & disallowed claims
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Patient Name, Claim ID (CLM-...), Hospital, or Procedure..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Hospital Type Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <span className="text-[10px] uppercase font-mono text-slate-400 px-2">Facility:</span>
            <button
              type="button"
              onClick={() => setFilterHospType('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                filterHospType === 'all'
                  ? 'bg-teal-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilterHospType('government')}
              className={`px-2.5 py-1 rounded-lg transition-colors font-medium flex items-center gap-1 ${
                filterHospType === 'government'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              <Landmark className="w-3 h-3" />
              <span>Gov</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterHospType('private')}
              className={`px-2.5 py-1 rounded-lg transition-colors font-medium flex items-center gap-1 ${
                filterHospType === 'private'
                  ? 'bg-cyan-600 text-white font-semibold'
                  : 'text-cyan-400 hover:text-cyan-300'
              }`}
            >
              <Building2 className="w-3 h-3" />
              <span>Pvt</span>
            </button>
          </div>
        </div>

        {/* Anomaly & Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/80 text-xs">
          <span className="text-[10px] font-mono text-slate-400 mr-1">Severity:</span>
          <button
            type="button"
            onClick={() => setFilterSeverity('all')}
            className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
              filterSeverity === 'all'
                ? 'bg-teal-600 text-white'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All Severities
          </button>
          <button
            type="button"
            onClick={() => setFilterSeverity('critical')}
            className={`px-2.5 py-1 rounded-lg transition-colors font-medium flex items-center gap-1 ${
              filterSeverity === 'critical'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-950 text-rose-400 hover:text-rose-300 border border-rose-900/60'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>Critical (85+)</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterSeverity('price_breach')}
            className={`px-2.5 py-1 rounded-lg transition-colors font-medium flex items-center gap-1 ${
              filterSeverity === 'price_breach'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-950 text-amber-400 hover:text-amber-300 border border-amber-900/60'
            }`}
          >
            <Scale className="w-3 h-3" />
            <span>Tariff Ceiling Breach</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterSeverity('clean')}
            className={`px-2.5 py-1 rounded-lg transition-colors font-medium flex items-center gap-1 ${
              filterSeverity === 'clean'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-950 text-emerald-400 hover:text-emerald-300 border border-emerald-900/60'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>Clean / Statutory</span>
          </button>
        </div>
      </div>

      {/* Claims Queue Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl">
        <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Inbox className="w-4 h-4 text-teal-400" />
            <span>Surveillance Queue ({filteredClaims.length} records)</span>
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            Real-time Ingestion Stream
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/90 text-slate-400 text-[10px] uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Claim ID & Patient</th>
                <th className="py-3 px-4">Facility Type & Hospital</th>
                <th className="py-3 px-4">Clinical Procedure</th>
                <th className="py-3 px-4">Billed vs Max Cap</th>
                <th className="py-3 px-4">Composite Anomaly</th>
                <th className="py-3 px-4">Adjudication Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
              {filteredClaims.length > 0 ? (
                filteredClaims.map((claim) => {
                  const isGov = claim.hospitalType === 'government';
                  const isBreach = claim.priceCeilingBreach;

                  // Anomaly color
                  let scoreBadgeColor = 'bg-emerald-950 text-emerald-300 border-emerald-800';
                  if (claim.anomalyScore >= 80) {
                    scoreBadgeColor = 'bg-rose-950 text-rose-300 border-rose-800';
                  } else if (claim.anomalyScore >= 50) {
                    scoreBadgeColor = 'bg-amber-950 text-amber-300 border-amber-800';
                  }

                  return (
                    <tr
                      key={claim.id}
                      className="hover:bg-slate-800/50 transition-colors group cursor-pointer"
                      onClick={() => onSelectClaim(claim)}
                    >
                      {/* Claim ID & Patient */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-teal-300 group-hover:text-teal-200">
                          {claim.claimId}
                        </div>
                        <div className="text-slate-200 font-semibold mt-0.5">
                          {claim.patientName}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {claim.patientAge}y · {claim.patientGender} · ID: {claim.patientId}
                        </div>
                      </td>

                      {/* Hospital & Verified Type */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold flex items-center gap-1 ${
                              isGov
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                            }`}
                          >
                            {isGov ? <Landmark className="w-2.5 h-2.5" /> : <Building2 className="w-2.5 h-2.5" />}
                            <span>{isGov ? 'GOVERNMENT' : 'PRIVATE'}</span>
                          </span>
                        </div>
                        <div className="text-slate-100 font-medium truncate max-w-[190px] mt-1">
                          {claim.hospitalName}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {claim.specialty} · {claim.city}
                        </div>
                      </td>

                      {/* Clinical Procedure */}
                      <td className="py-3.5 px-4 max-w-[210px]">
                        <div className="text-slate-200 font-semibold truncate">
                          {claim.procedureName}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          CPT: <span className="text-teal-400">{claim.procedureCode}</span> | ICD: {claim.diagnosisCode}
                        </div>
                        {claim.isDuplicateOf && (
                          <span className="inline-block mt-0.5 text-[9px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800 font-mono font-bold">
                            DUPLICATE OF {claim.isDuplicateOf}
                          </span>
                        )}
                      </td>

                      {/* Billed vs Max Cap */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-slate-100">
                          {formatCurrency(claim.billedAmount, currency)}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                          <span>Max Cap:</span>
                          <span className="text-teal-400 font-semibold">
                            {formatCurrency(claim.statutoryMaxAmount, currency)}
                          </span>
                        </div>
                        {isBreach && (
                          <div className="text-[10px] font-mono font-bold text-rose-400 flex items-center gap-0.5 mt-0.5">
                            <span>+{formatCurrency(claim.overbilledExcess, currency)} over cap</span>
                          </div>
                        )}
                      </td>

                      {/* Anomaly Score */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 rounded-lg border font-mono font-bold text-xs ${scoreBadgeColor}`}
                          >
                            {claim.anomalyScore} / 100
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                            {claim.riskLevel}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            claim.status === 'approved_clean'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : claim.status === 'fraud_denied'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : claim.status === 'rfi_requested'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              claim.status === 'approved_clean'
                                ? 'bg-emerald-400'
                                : claim.status === 'fraud_denied'
                                ? 'bg-rose-400'
                                : 'bg-amber-400'
                            }`}
                          />
                          <span>{claim.status.replace(/_/g, ' ')}</span>
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectClaim(claim);
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-teal-600/90 hover:bg-teal-500 transition-colors inline-flex items-center gap-1 shadow-sm"
                        >
                          <span>Dossier</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                    No claims match current filter criteria. Try adjusting search or severity filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
