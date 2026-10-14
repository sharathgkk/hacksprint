import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  ShieldAlert, 
  AlertTriangle, 
  Building2, 
  Landmark, 
  Scale, 
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { Claim, Hospital } from '../types';
import { formatCurrency } from '../utils/pdfGenerator';

interface AnalyticsViewProps {
  claims: Claim[];
  hospitals: Hospital[];
  currency: 'INR' | 'USD';
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  claims,
  hospitals,
  currency
}) => {
  const govHospitals = hospitals.filter(h => h.type === 'government');
  const pvtHospitals = hospitals.filter(h => h.type === 'private');

  const govClaims = claims.filter(c => c.hospitalType === 'government');
  const pvtClaims = claims.filter(c => c.hospitalType === 'private');

  const govPriceBreaches = govClaims.filter(c => c.priceCeilingBreach).length;
  const pvtPriceBreaches = pvtClaims.filter(c => c.priceCeilingBreach).length;

  const govCompliancePercent = govClaims.length > 0
    ? Math.round(((govClaims.length - govPriceBreaches) / govClaims.length) * 100)
    : 100;

  const pvtCompliancePercent = pvtClaims.length > 0
    ? Math.round(((pvtClaims.length - pvtPriceBreaches) / pvtClaims.length) * 100)
    : 80;

  const totalOverbilled = claims.reduce((acc, c) => acc + (c.overbilledExcess || 0), 0);

  // Specialty Breakdown
  const specialties = [
    { name: 'Cardiology', anomalyRate: 42, count: 8 },
    { name: 'Radiology', anomalyRate: 64, count: 12 },
    { name: 'Orthopedics', anomalyRate: 35, count: 7 },
    { name: 'Critical Care / ICU', anomalyRate: 58, count: 6 },
    { name: 'Neurology', anomalyRate: 48, count: 5 },
    { name: 'Ophthalmology', anomalyRate: 12, count: 4 }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-teal-950 border border-teal-800 text-teal-300">
            <BarChart3 className="w-3.5 h-3.5 text-teal-400" />
            <span>CLINICAL ANOMALY & TARIFF COMPLIANCE TELEMETRY</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Clinical Anomaly Analytics & Price Cap Telemetry
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Statistical monitoring of hospital billing deviations, Government vs Private tariff ceiling compliance, and procedural over-utilization z-scores.
          </p>
        </div>

        {/* 3 Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-800/80 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-slate-400 text-[11px]">Total Statutory Savings Disallowed</div>
            <div className="text-2xl font-bold font-mono text-emerald-300 mt-1">
              {formatCurrency(totalOverbilled, currency)}
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5">
              Protected patient liability through strict price caps
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-slate-400 text-[11px]">Government Hospital Tariff Compliance</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
              {govCompliancePercent}%
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Based on CGHS / Ayushman Bharat schedule adherence
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-slate-400 text-[11px]">Private Hospital Price Cap Compliance</div>
            <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">
              {pvtCompliancePercent}%
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Adherence to Clinical Establishments Act metro ceilings
            </div>
          </div>
        </div>
      </div>

      {/* Government vs Private Pricing Compliance Comparison Card */}
      <div className="p-6 rounded-2xl border border-teal-900/60 bg-slate-900/80 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Scale className="w-4 h-4 text-teal-400" />
          <span>Government vs Private Hospital Price Cap Enforcement Telemetry</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Government Hospitals Card */}
          <div className="p-4 rounded-xl border border-emerald-900/60 bg-emerald-950/20 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-300 flex items-center gap-2">
                <Landmark className="w-4 h-4 text-emerald-400" />
                <span>🏛️ Government Hospitals</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                {govHospitals.length} Facilities Monitored
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Zero-Surprise Tariff Compliance:</span>
                <span className="font-mono font-bold text-emerald-400">{govCompliancePercent}%</span>
              </div>
              <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                <div style={{ width: `${govCompliancePercent}%` }} className="h-full bg-emerald-500 rounded-full" />
              </div>
            </div>

            <p className="text-slate-300 text-[11px] leading-relaxed">
              Public and civil hospitals show high statutory adherence. Rare anomalies are restricted to occasional unapproved consumables billed outside PM-JAY packages.
            </p>
          </div>

          {/* Private Hospitals Card */}
          <div className="p-4 rounded-xl border border-cyan-900/60 bg-cyan-950/20 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-cyan-300 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span>🏢 Private Hospitals</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                {pvtHospitals.length} Facilities Monitored
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Statutory Price Ceiling Compliance:</span>
                <span className="font-mono font-bold text-cyan-400">{pvtCompliancePercent}%</span>
              </div>
              <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                <div style={{ width: `${pvtCompliancePercent}%` }} className="h-full bg-cyan-500 rounded-full" />
              </div>
            </div>

            <p className="text-slate-300 text-[11px] leading-relaxed">
              Corporate and nursing home facilities show high concentration of unbundled surgical consumables, executive room surcharges, and implant handling markup breaches.
            </p>
          </div>
        </div>
      </div>

      {/* Specialty Anomaly Rates & High Risk Providers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Specialty Anomaly Rates */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-teal-400" />
            <span>Specialty Anomaly & Outlier Distribution</span>
          </h3>

          <div className="space-y-3">
            {specialties.map((s, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-200 font-semibold">{s.name}</span>
                  <span className="font-mono text-slate-400">
                    <strong className="text-teal-300">{s.anomalyRate}%</strong> anomaly rate ({s.count} audits)
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${s.anomalyRate}%` }}
                    className={`h-full rounded-full ${
                      s.anomalyRate > 50
                        ? 'bg-rose-500'
                        : s.anomalyRate > 30
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* High Risk Providers Leaderboard */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Overbilling Incident Leaderboard</span>
          </h3>

          <div className="space-y-2 text-xs">
            {hospitals
              .filter((h) => h.overbillingIncidentCount > 5)
              .sort((a, b) => b.overbillingIncidentCount - a.overbillingIncidentCount)
              .slice(0, 5)
              .map((h, idx) => (
                <div
                  key={h.id}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-slate-200">{h.name}</div>
                    <div className="text-[10px] text-slate-400">
                      {h.type.toUpperCase()} · {h.city} · {h.statutoryPriceCappingCategory.replace(/_/g, ' ')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-rose-400">
                      {h.overbillingIncidentCount} Incidents
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {h.priceComplianceScore}% compliant
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
