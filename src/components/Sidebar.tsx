import React from 'react';
import { 
  Inbox, 
  FileText, 
  Landmark, 
  ShieldAlert, 
  BarChart3, 
  History, 
  FlaskConical, 
  Building2, 
  Scale, 
  Sparkles
} from 'lucide-react';
import { PortalType } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingCount: number;
  portalType: PortalType;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingCount,
  portalType,
  isOpenMobile,
  onCloseMobile
}) => {
  const isCompany = portalType === 'company';

  const navItems = isCompany
    ? [
        {
          id: 'queue',
          label: 'Claims Surveillance',
          category: 'SIU Workbench',
          icon: Inbox,
          badge: pendingCount > 0 ? pendingCount : null,
          badgeColor: 'bg-rose-500/80 text-white',
        },
        {
          id: 'dossier',
          label: 'Evidence Dossier & XAI',
          category: 'Forensic Review',
          icon: FileText,
          badge: 'SHAP',
          badgeColor: 'bg-teal-900 text-teal-300 border border-teal-700/60',
        },
        {
          id: 'hospitals',
          label: 'Hospital Audits & Tariffs',
          category: 'Gov vs Private & Max Caps',
          icon: Scale,
          badge: 'Price Capped',
          badgeColor: 'bg-amber-950 text-amber-300 border border-amber-800/80',
        },
        {
          id: 'rules',
          label: 'Policy Rule Engine',
          category: 'Deterministic Matrices',
          icon: ShieldAlert,
          badge: null,
        },
        {
          id: 'analytics',
          label: 'Anomaly Analytics',
          category: 'Outlier Telemetry',
          icon: BarChart3,
          badge: null,
        },
        {
          id: 'audit_log',
          label: 'Regulatory Audit Log',
          category: 'Compliance & Governance',
          icon: History,
          badge: 'SHA-256',
          badgeColor: 'bg-slate-800 text-slate-300',
        },
        {
          id: 'sandbox',
          label: 'Batch Simulation Sandbox',
          category: 'Synthetic Ingestion',
          icon: FlaskConical,
          badge: '8 Presets',
          badgeColor: 'bg-cyan-950 text-cyan-300 border border-cyan-800/80',
        }
      ]
    : [
        {
          id: 'provider_portal',
          label: 'Hospital Command Center',
          category: 'Facility & RFI Desk',
          icon: Building2,
          badge: 'Action Hub',
          badgeColor: 'bg-emerald-950 text-emerald-300 border border-emerald-700',
        },
        {
          id: 'hospitals',
          label: 'Facility Tariffs & Caps',
          category: 'Gov vs Private Rates',
          icon: Scale,
          badge: 'Verified',
          badgeColor: 'bg-teal-950 text-teal-300 border border-teal-800',
        },
        {
          id: 'dossier',
          label: 'Audit Case Dossier',
          category: 'Insurer Explanations',
          icon: FileText,
          badge: 'SHAP',
          badgeColor: 'bg-slate-800 text-slate-300',
        },
        {
          id: 'sandbox',
          label: 'Pre-Submission Validator',
          category: 'Pre-Flight Tariff Check',
          icon: FlaskConical,
          badge: 'Pre-Flight',
          badgeColor: 'bg-amber-950 text-amber-300 border border-amber-800',
        }
      ];

  const handleSelect = (tabId: string) => {
    setActiveTab(tabId);
    onCloseMobile();
  };

  const content = (
    <div className="flex flex-col h-full py-4 px-3">
      {/* Role Indicator Banner */}
      <div className={`mb-4 px-3 py-2.5 rounded-xl border ${
        isCompany
          ? 'border-teal-900/60 bg-slate-900/80'
          : 'border-emerald-900/60 bg-emerald-950/20'
      }`}>
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>PORTAL ACTIVE</span>
          <span className={`inline-flex items-center gap-1 font-semibold ${
            isCompany ? 'text-teal-400' : 'text-emerald-400'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
              isCompany ? 'bg-teal-400' : 'bg-emerald-400'
            }`}></span>
            {isCompany ? 'The Company (SIU)' : 'Hospital Desk'}
          </span>
        </div>
        <div className="text-xs font-semibold text-slate-100 mt-0.5 truncate">
          {isCompany ? 'Insurers & Claims Surveillance' : 'Hospital Compliance & Billing'}
        </div>
      </div>

      {/* Nav links */}
      <div className="space-y-1 flex-1 overflow-y-auto pr-1">
        <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 px-3 pb-1">
          {isCompany ? 'SIU Intelligence Modules' : 'Provider Workstation'}
        </div>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-teal-600/90 text-white shadow-md shadow-teal-700/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-teal-400'
                  }`}
                />
                <div className="text-left truncate">
                  <div className="truncate">{item.label}</div>
                  <div
                    className={`text-[10px] truncate ${
                      isActive ? 'text-teal-100/80' : 'text-slate-500'
                    }`}
                  >
                    {item.category}
                  </div>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold shrink-0 ml-1.5 ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Transparent Pricing Highlight Card */}
      <div className="mt-4 p-3 rounded-xl border border-amber-900/40 bg-amber-950/20 text-xs">
        <div className="flex items-center gap-2 text-amber-300 font-semibold text-[11px]">
          <Scale className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Statutory Pricing Guard</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
          Verifies whether a facility is <strong className="text-slate-200">Government</strong> (subsidized free-to-low cap) or <strong className="text-slate-200">Private</strong> (tiered price ceilings) to prevent patient overcharging.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 border-r border-teal-950/70 bg-[#06131e]/90 shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
        {content}
      </aside>

      {/* Mobile drawer */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[80vw] bg-[#06131e] border-r border-teal-950 h-full z-10 shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
