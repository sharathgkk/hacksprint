import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { QueueView } from './components/QueueView';
import { DossierView } from './components/DossierView';
import { HospitalReviewView } from './components/HospitalReviewView';
import { RulesView } from './components/RulesView';
import { AnalyticsView } from './components/AnalyticsView';
import { AuditLogView } from './components/AuditLogView';
import { SandboxView } from './components/SandboxView';
import { HospitalLandingView } from './components/HospitalLandingView';
import { LoginModal } from './components/LoginModal';
import { LoginScreen } from './components/LoginScreen';
import { NewClaimModal } from './components/NewClaimModal';

import { 
  Claim, 
  Hospital, 
  PolicyRule, 
  AuditLogEntry, 
  UserSession, 
  ClaimStatus, 
  HospitalReview 
} from './types';
import { 
  INITIAL_CLAIMS, 
  INITIAL_HOSPITALS, 
  INITIAL_RULES, 
  INITIAL_AUDIT_LOGS 
} from './data/mockData';

const VIEW_METADATA: Record<string, { title: string; category: string }> = {
  queue: {
    title: 'Clinical Workbench Queue',
    category: 'Claims Surveillance',
  },
  dossier: {
    title: 'Medical Evidence Dossier & XAI',
    category: 'Forensic Review',
  },
  hospitals: {
    title: 'Hospital Reviews & Pricing Tiers',
    category: 'Gov vs Private & Max Caps',
  },
  rules: {
    title: 'Deterministic Policy Rules',
    category: 'Clinical Guidelines',
  },
  analytics: {
    title: 'Clinical Anomaly Analytics',
    category: 'Outlier Telemetry',
  },
  audit_log: {
    title: 'Regulatory Audit Log',
    category: 'Compliance & Governance',
  },
  sandbox: {
    title: 'Batch Testing Sandbox',
    category: 'Simulation & Ingestion',
  },
  provider_portal: {
    title: 'Hospital Command Center & RFI Desk',
    category: 'Provider Workstation',
  },
};

export default function App() {
  const [claims, setClaims] = useState<Claim[]>(INITIAL_CLAIMS);
  const [hospitals, setHospitals] = useState<Hospital[]>(INITIAL_HOSPITALS);
  const [rules, setRules] = useState<PolicyRule[]>(INITIAL_RULES);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [currentHospitalId, setCurrentHospitalId] = useState<string>('HSP-101');

  const [activeTab, setActiveTab] = useState<string>('queue');
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(INITIAL_CLAIMS[0]);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isNewClaimModalOpen, setIsNewClaimModalOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  const pendingReviewCount = claims.filter(
    (c) => c.status === 'pending_review' || c.status === 'under_investigation'
  ).length;

  // Claim selection & navigation
  const handleSelectClaim = (claim: Claim) => {
    setSelectedClaim(claim);
    setActiveTab('dossier');
  };

  // Switch Portal Role
  const handleSwitchPortal = () => {
    if (currentUser?.portalType === 'company') {
      setCurrentUser({
        email: 'billing.desk@apexhospital.org',
        name: 'Apex Hospital Billing Desk',
        role: 'healthcare_provider',
        portalType: 'provider',
        organization: 'Apex Multispecialty Hospital'
      });
      setActiveTab('provider_portal');
    } else {
      setCurrentUser({
        email: 'investigator.sethi@claimguard-insurance.com',
        name: 'Vikram Sethi',
        role: 'insurer_auditor',
        portalType: 'company',
        organization: 'ClaimGuard General Health Insurance'
      });
      setActiveTab('queue');
    }
  };

  // Logout handler
  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Login handler
  const handleLogin = (session: UserSession) => {
    setCurrentUser(session);
    setIsLoginModalOpen(false);
    if (session.portalType === 'provider') {
      setActiveTab('provider_portal');
    } else {
      setActiveTab('queue');
    }
  };

  // Adjudicate claim
  const handleAdjudicate = (
    claimId: string,
    action: string,
    status: ClaimStatus,
    note: string,
    excessDisallowed?: number
  ) => {
    const targetClaim = claims.find((c) => c.claimId === claimId);
    if (!targetClaim) return;

    const timestamp = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/,/g, '');

    const complianceHash = `SHA256:${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;

    const newLogEntry: AuditLogEntry = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp,
      claimId,
      claim: targetClaim,
      action,
      category:
        status === 'approved_clean'
          ? 'approval_dismissal'
          : status === 'fraud_denied'
          ? 'fraud_rejection'
          : status === 'rfi_requested'
          ? 'rfi_request'
          : excessDisallowed
          ? 'tariff_enforcement'
          : 'approval_dismissal',
      actor: currentUser?.email || 'investigator.sethi@claimguard-insurance.com',
      resultingStatus: status,
      riskScore: targetClaim.anomalyScore,
      complianceHash,
      note,
      hospitalName: targetClaim.hospitalName,
      hospitalType: targetClaim.hospitalType,
      excessDisallowed: excessDisallowed || (status === 'fraud_denied' ? targetClaim.billedAmount : 0)
    };

    // Update claim state
    const updatedClaim: Claim = {
      ...targetClaim,
      status,
      adjudicationHistory: [
        {
          id: `ADJ-${Date.now().toString(36)}`,
          action,
          timestamp,
          actor: currentUser?.email || 'investigator.sethi@claimguard-insurance.com',
          note,
          resultingStatus: status,
          complianceHash
        },
        ...(targetClaim.adjudicationHistory || [])
      ]
    };

    setClaims((prev) => prev.map((c) => (c.claimId === claimId ? updatedClaim : c)));
    if (selectedClaim?.claimId === claimId) {
      setSelectedClaim(updatedClaim);
    }

    setAuditLogs((prev) => [newLogEntry, ...prev]);
  };

  // Add Hospital Review with Government vs Private Verification
  const handleAddHospitalReview = (
    hospitalId: string,
    reviewData: Omit<HospitalReview, 'id' | 'date'>
  ) => {
    const newReview: HospitalReview = {
      ...reviewData,
      id: `REV-${Date.now().toString(36).toUpperCase()}`,
      date: new Date().toISOString().slice(0, 10)
    };

    setHospitals((prev) =>
      prev.map((h) => {
        if (h.id === hospitalId) {
          const updatedReviews = [newReview, ...(h.reviews || [])];
          const newRating = Number(
            (
              updatedReviews.reduce((acc, r) => acc + r.fairPricingRating, 0) /
              updatedReviews.length
            ).toFixed(1)
          );
          const newOverbillCount = h.overbillingIncidentCount + (reviewData.wasOvercharged ? 1 : 0);
          const newCompliance = Math.max(
            50,
            Math.round(100 - (newOverbillCount / Math.max(1, h.totalAuditedClaims)) * 100)
          );

          return {
            ...h,
            reviews: updatedReviews,
            overallRating: newRating,
            overbillingIncidentCount: newOverbillCount,
            priceComplianceScore: newCompliance
          };
        }
        return h;
      })
    );
  };

  // Ingest new claim
  const handleIngestClaim = (claim: Claim) => {
    setClaims((prev) => [claim, ...prev]);
    setSelectedClaim(claim);
  };

  // Toggle Policy Rule
  const handleToggleRule = (ruleId: string) => {
    setRules((prev) =>
      prev.map((r) =>
        r.id === ruleId
          ? { ...r, status: r.status === 'active' ? 'disabled' : 'active' }
          : r
      )
    );
  };

  // Add Policy Rule
  const handleAddRule = (ruleData: Omit<PolicyRule, 'id' | 'violationCount'>) => {
    const newRule: PolicyRule = {
      ...ruleData,
      id: `R-${Math.floor(10 + Math.random() * 90)}`,
      violationCount: 0
    };
    setRules((prev) => [newRule, ...prev]);
  };

  // RFI Response from Hospital Provider Desk
  const handleRespondRfi = (claimId: string, explanation: string, files: string[]) => {
    const target = claims.find((c) => c.claimId === claimId);
    if (!target) return;

    const updatedClaim: Claim = {
      ...target,
      status: 'under_investigation',
      rfiResponse: {
        timestamp: new Date().toLocaleString(),
        attachedFiles: files,
        explanation,
        complianceOfficer: currentUser?.name || 'Hospital Compliance Officer'
      }
    };

    setClaims((prev) => prev.map((c) => (c.claimId === claimId ? updatedClaim : c)));
    if (selectedClaim?.claimId === claimId) {
      setSelectedClaim(updatedClaim);
    }
  };

  const meta = VIEW_METADATA[activeTab] || {
    title: 'Clinical Workspace',
    category: 'Forensic Intelligence'
  };

  if (!currentUser) {
    return (
      <LoginScreen onLogin={handleLogin} />
    );
  }

  return (
    <div className="min-h-screen bg-[#06131e] text-slate-100 flex flex-col clinical-grid antialiased selection:bg-teal-500/30 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        categoryTitle={meta.category}
        subTitle={meta.title}
        currency={currency}
        setCurrency={setCurrency}
        currentUser={currentUser}
        onSwitchPortal={handleSwitchPortal}
        onLogout={handleLogout}
        onOpenNewClaimModal={() => setIsNewClaimModalOpen(true)}
        onOpenHospitalTariffModal={() => setActiveTab('hospitals')}
        onToggleMobileMenu={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        pendingCount={pendingReviewCount}
      />

      {/* Main Body */}
      <div className="flex-1 flex w-full">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingCount={pendingReviewCount}
          portalType={currentUser.portalType}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {activeTab === 'queue' && (
            <QueueView
              claims={claims}
              onSelectClaim={handleSelectClaim}
              onQuickApprove={(id) =>
                handleAdjudicate(id, 'Quick Approve & Release Payment', 'approved_clean', 'Quick clean approval.')
              }
              currency={currency}
            />
          )}

          {activeTab === 'dossier' && (
            <DossierView
              claim={selectedClaim}
              onAdjudicate={handleAdjudicate}
              currency={currency}
              onGoToQueue={() => setActiveTab('queue')}
            />
          )}

          {activeTab === 'hospitals' && (
            <HospitalReviewView
              hospitals={hospitals}
              onAddHospitalReview={handleAddHospitalReview}
              currency={currency}
              onInspectClaimByHospital={(hospName) => {
                const found = claims.find((c) => c.hospitalName.includes(hospName));
                if (found) {
                  setSelectedClaim(found);
                  setActiveTab('dossier');
                }
              }}
            />
          )}

          {activeTab === 'rules' && (
            <RulesView
              rules={rules}
              onToggleRule={handleToggleRule}
              onAddRule={handleAddRule}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              claims={claims}
              hospitals={hospitals}
              currency={currency}
            />
          )}

          {activeTab === 'audit_log' && (
            <AuditLogView
              logs={auditLogs}
              currency={currency}
            />
          )}

          {activeTab === 'sandbox' && (
            <SandboxView
              hospitals={hospitals}
              onIngestClaim={handleIngestClaim}
              currency={currency}
              onNavigateToDossier={(clm) => {
                setSelectedClaim(clm);
                setActiveTab('dossier');
              }}
            />
          )}

          {activeTab === 'provider_portal' && (
            <HospitalLandingView
              hospital={hospitals.find(h => h.id === currentHospitalId) || hospitals[2] || hospitals[0]}
              claims={claims}
              onRespondRfi={handleRespondRfi}
              currency={currency}
              onSelectClaim={handleSelectClaim}
              onOpenNewClaimModal={() => setIsNewClaimModalOpen(true)}
              onNavigateToTariffs={() => setActiveTab('hospitals')}
              onSwitchHospital={(id) => setCurrentHospitalId(id)}
              allHospitals={hospitals}
            />
          )}
        </main>
      </div>

      {/* Ingestion & Login Modals */}
      <NewClaimModal
        isOpen={isNewClaimModalOpen}
        onClose={() => setIsNewClaimModalOpen(false)}
        hospitals={hospitals}
        onIngest={(newClaim) => {
          handleIngestClaim(newClaim);
          setSelectedClaim(newClaim);
          setActiveTab('dossier');
        }}
        currency={currency}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onLogin={handleLogin}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}
