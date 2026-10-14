import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Download, 
  FileText, 
  FileCode, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  XCircle, 
  Scale, 
  Lock, 
  Calendar,
  Building2,
  Landmark
} from 'lucide-react';
import { AuditLogEntry } from '../types';
import { formatCurrency, generateComplianceCertificatePdf } from '../utils/pdfGenerator';

interface AuditLogViewProps {
  logs: AuditLogEntry[];
  currency: 'INR' | 'USD';
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ logs, currency }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.claimId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.complianceHash.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (categoryFilter !== 'all' && log.category !== categoryFilter) return false;
    return true;
  });

  const handleExportCsv = () => {
    const headers = [
      'Log ID',
      'Timestamp',
      'Claim ID',
      'Facility',
      'Facility Type',
      'Action Taken',
      'Category',
      'Actor',
      'Resulting Status',
      'Risk Score',
      'Excess Disallowed',
      'Compliance Hash',
      'Auditor Note'
    ];

    const rows = filteredLogs.map((l) => [
      l.id,
      `"${l.timestamp}"`,
      l.claimId,
      `"${l.hospitalName}"`,
      l.hospitalType,
      `"${l.action}"`,
      l.category,
      `"${l.actor}"`,
      l.resultingStatus,
      l.riskScore,
      l.excessDisallowed,
      l.complianceHash,
      `"${l.note.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ClaimGuard_Audit_Trail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJson = () => {
    const data = {
      auditSystem: 'ClaimGuard AI Forensic Ledger v2.4',
      generatedAt: new Date().toISOString(),
      standard: 'IRDAI Health Insurance Adjudication & Clinical Establishments Act Compliance',
      totalRecords: filteredLogs.length,
      entries: filteredLogs
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ClaimGuard_Audit_Ledger_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadCertificate = () => {
    const approved = logs.filter((l) => l.resultingStatus === 'approved_clean').length;
    const fraud = logs.filter((l) => l.resultingStatus === 'fraud_denied').length;
    const rfi = logs.filter((l) => l.resultingStatus === 'rfi_requested').length;
    generateComplianceCertificatePdf(logs.length, approved, fraud, rfi);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-slate-950 border border-slate-800 text-teal-300">
              <Lock className="w-3.5 h-3.5 text-teal-400" />
              <span>IMMUTABLE STATUTORY GOVERNANCE REPOSITORY</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Regulatory Audit Log & Adjudication Ledger
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              Cryptographically verified audit trail sealing all claim adjudications, Government vs Private hospital classification checks, and statutory tariff disallowances.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleExportCsv}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center gap-1.5 shadow"
            >
              <Download className="w-3.5 h-3.5 text-teal-400" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={handleExportJson}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center gap-1.5 shadow"
            >
              <FileCode className="w-3.5 h-3.5 text-teal-400" />
              <span>Export JSON</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadCertificate}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 transition-colors shadow-lg shadow-teal-700/25 flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download Compliance Certificate (PDF)</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by Claim ID, Hospital, Actor, or Hash..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setCategoryFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                categoryFilter === 'all'
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              All Events
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('approval_dismissal')}
              className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                categoryFilter === 'approval_dismissal'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-950 text-emerald-400 hover:text-emerald-300 border border-emerald-900/60'
              }`}
            >
              Approvals
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('fraud_rejection')}
              className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                categoryFilter === 'fraud_rejection'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-950 text-rose-400 hover:text-rose-300 border border-rose-900/60'
              }`}
            >
              Fraud Denials
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('rfi_request')}
              className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                categoryFilter === 'rfi_request'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-950 text-amber-400 hover:text-amber-300 border border-amber-900/60'
              }`}
            >
              RFI Notices
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('tariff_enforcement')}
              className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                categoryFilter === 'tariff_enforcement'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-950 text-cyan-400 hover:text-cyan-300 border border-cyan-900/60'
              }`}
            >
              Tariff Enforcements
            </button>
          </div>
        </div>
      </div>

      {/* Ledger Records Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/90 text-slate-400 text-[10px] uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Timestamp & ID</th>
                <th className="py-3 px-4">Claim & Hospital</th>
                <th className="py-3 px-4">Adjudication Action</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Disallowed Excess</th>
                <th className="py-3 px-4">Compliance Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => {
                  const isGov = log.hospitalType === 'government';

                  return (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-mono text-slate-300">{log.timestamp}</div>
                        <div className="font-mono text-[10px] text-teal-400 mt-0.5">{log.id}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-white">{log.claimId}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold flex items-center gap-1 ${
                              isGov
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                            }`}
                          >
                            {isGov ? <Landmark className="w-2.5 h-2.5" /> : <Building2 className="w-2.5 h-2.5" />}
                            <span>{isGov ? 'GOV' : 'PVT'}</span>
                          </span>
                          <span className="text-[11px] text-slate-300 truncate max-w-[160px]">
                            {log.hospitalName}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 max-w-[240px]">
                        <div className="font-semibold text-slate-100">{log.action}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                          {log.note}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-slate-300 truncate max-w-[150px]">{log.actor}</div>
                        <div className="text-[10px] font-mono text-slate-500">SIU Verified</div>
                      </td>

                      <td className="py-3 px-4">
                        {log.excessDisallowed > 0 ? (
                          <span className="font-mono font-bold text-rose-400">
                            -{formatCurrency(log.excessDisallowed, currency)}
                          </span>
                        ) : (
                          <span className="font-mono text-slate-500">₹0</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-mono text-[10px] text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800 max-w-[180px] truncate">
                          {log.complianceHash}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                    No audit ledger entries match your filter.
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
