import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Filter, 
  Search, 
  Scale,
  X
} from 'lucide-react';
import { PolicyRule } from '../types';

interface RulesViewProps {
  rules: PolicyRule[];
  onToggleRule: (ruleId: string) => void;
  onAddRule: (rule: Omit<PolicyRule, 'id' | 'violationCount'>) => void;
}

export const RulesView: React.FC<RulesViewProps> = ({
  rules,
  onToggleRule,
  onAddRule
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New rule form
  const [ruleCode, setRuleCode] = useState('');
  const [ruleName, setRuleName] = useState('');
  const [ruleCategory, setRuleCategory] = useState<any>('Price Ceiling & Tariff');
  const [ruleSeverity, setRuleSeverity] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM'>('CRITICAL');
  const [ruleDescription, setRuleDescription] = useState('');
  const [enforcedBy, setEnforcedBy] = useState<any>('Statutory Mandate (IRDAI/NHA)');

  const filteredRules = rules.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleCode.trim() || !ruleName.trim()) return;

    onAddRule({
      code: ruleCode,
      name: ruleName,
      category: ruleCategory,
      severity: ruleSeverity,
      description: ruleDescription,
      status: 'active',
      enforcedBy
    });

    setIsAddModalOpen(false);
    setRuleCode('');
    setRuleName('');
    setRuleDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-purple-950 border border-purple-800 text-purple-300">
              <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
              <span>DETERMINISTIC & STATUTORY POLICY RULE MATRICES</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Deterministic Policy Rules & Tariff Matrices
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              Deterministic clinical guidelines enforcing NCCI unbundling, demographic contradictions, duplicate hash matching, and mandatory Government vs Private hospital price ceiling caps.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 transition-colors shadow-lg shadow-teal-700/25 flex items-center gap-1.5 self-start lg:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Policy Rule</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search policy rule by name, code or description..."
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
              All Matrices
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('Price Ceiling & Tariff')}
              className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                categoryFilter === 'Price Ceiling & Tariff'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-950 text-amber-400 hover:text-amber-300 border border-amber-900/60'
              }`}
            >
              Price Ceiling
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('Unbundling (NCCI)')}
              className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                categoryFilter === 'Unbundling (NCCI)'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-950 text-purple-400 hover:text-purple-300 border border-purple-900/60'
              }`}
            >
              NCCI Unbundling
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('Duplicate Billing')}
              className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                categoryFilter === 'Duplicate Billing'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-950 text-cyan-400 hover:text-cyan-300 border border-cyan-900/60'
              }`}
            >
              Duplicates
            </button>
          </div>
        </div>
      </div>

      {/* Rules Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/90 text-slate-400 text-[10px] uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Code & Matrix Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Enforcement Mechanism</th>
                <th className="py-3 px-4">Violations Flagged</th>
                <th className="py-3 px-4 text-right">Status / Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/40 font-sans">
              {filteredRules.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-teal-300">{r.code}</div>
                    <div className="font-semibold text-slate-100 mt-0.5">{r.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 max-w-md">
                      {r.description}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-slate-300 font-medium">
                    {r.category}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        r.severity === 'CRITICAL'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : r.severity === 'HIGH'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {r.severity}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-400 text-[11px]">
                    {r.enforcedBy}
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-slate-200">
                    {r.violationCount} hits
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onToggleRule(r.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        r.status === 'active'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900/60'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {r.status === 'active' ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Rule Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full shadow-2xl p-6 text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-teal-400" />
                <span>Define New Policy Rule</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Rule Code</label>
                <input
                  type="text"
                  value={ruleCode}
                  onChange={(e) => setRuleCode(e.target.value)}
                  placeholder="e.g. RULE-PRICE-03"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Rule Title</label>
                <input
                  type="text"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  placeholder="e.g. Private ICU Bed Daily Rate Ceiling Enforcement"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={ruleCategory}
                    onChange={(e) => setRuleCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                  >
                    <option value="Price Ceiling & Tariff">Price Ceiling & Tariff</option>
                    <option value="Medical Necessity">Medical Necessity</option>
                    <option value="Unbundling (NCCI)">Unbundling (NCCI)</option>
                    <option value="Duplicate Billing">Duplicate Billing</option>
                    <option value="Demographic Contradiction">Demographic Contradiction</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Severity</label>
                  <select
                    value={ruleSeverity}
                    onChange={(e) => setRuleSeverity(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Description & Mandate</label>
                <textarea
                  value={ruleDescription}
                  onChange={(e) => setRuleDescription(e.target.value)}
                  rows={3}
                  placeholder="Detail the clinical or statutory criteria required to trigger this violation..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 font-semibold text-white rounded-lg shadow"
                >
                  Save Policy Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
