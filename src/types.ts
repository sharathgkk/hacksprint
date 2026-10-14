export type HospitalType = 'government' | 'private';

export type HospitalSubcategory =
  | 'Autonomous AIIMS / Central Government'
  | 'State Civil / District Hospital'
  | 'Municipal Corporation Public Hospital'
  | 'Corporate Super-Specialty'
  | 'Private Multi-Specialty'
  | 'Private Nursing Home / Clinic';

export type StatutoryTier =
  | 'CGHS_GOV_STATUTORY'
  | 'NHA_AYUSHMAN_GOV'
  | 'PRIVATE_TIER_1_METRO'
  | 'PRIVATE_TIER_2_URBAN'
  | 'PRIVATE_TIER_3_COMMUNITY';

export type PortalType = 'company' | 'provider';

export interface TariffItem {
  category: string;
  procedureCode: string;
  procedureName: string;
  hospitalTariff: number;
  statutoryMaxCeiling: number;
  ayushmanSubsidizedRate: number;
  cghsRate: number;
  tierDescription: string;
}

export interface HospitalReview {
  id: string;
  author: string;
  role: 'Verified Patient' | 'SIU Claims Auditor' | 'Ayushman Beneficiary' | 'Medical Examiner';
  date: string;
  verifiedHospitalType: HospitalType;
  fairPricingRating: number; // 1 to 5
  clinicalCareRating: number;
  infrastructureRating: number;
  comment: string;
  billedAmount?: number;
  statutoryMaxCap?: number;
  wasOvercharged: boolean;
  procedureReviewed?: string;
  resolutionStatus?: 'Compliant' | 'Disputed & Refunded' | 'Under Investigation';
}

export interface Hospital {
  id: string;
  name: string;
  type: HospitalType;
  subcategory: HospitalSubcategory;
  registrationNo: string;
  establishedYear: number;
  city: string;
  state: string;
  address: string;
  accreditation: string;
  bedsCount: number;
  icuBedsCount: number;
  statutoryPriceCappingCategory: StatutoryTier;
  priceComplianceScore: number; // 0 - 100
  overallRating: number; // 1.0 - 5.0
  totalAuditedClaims: number;
  overbillingIncidentCount: number;
  tariffs: TariffItem[];
  reviews: HospitalReview[];
  emergencyContact: string;
  nodalOfficer: string;
}

export interface BilledItem {
  code: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  maxAllowedRate: number; // Statutory ceiling for this hospital type
  isExceeded: boolean;
  category: 'Room / Bed Charges' | 'ICU & Monitoring' | 'Surgical Procedure' | 'Diagnostics & Labs' | 'Pharmacy & Implants' | 'Consultation';
}

export interface PolicyViolation {
  ruleId: string;
  ruleName: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  description: string;
}

export interface ShapFactor {
  feature: string;
  impact: number; // -1.0 to 1.0
  description: string;
  direction: 'increases_risk' | 'decreases_risk';
}

export type ClaimStatus =
  | 'pending_review'
  | 'under_investigation'
  | 'rfi_requested'
  | 'approved_clean'
  | 'fraud_denied'
  | 'duplicate_rejected';

export type ClaimRiskLevel = 'CRITICAL' | 'HIGH' | 'SUSPICIOUS' | 'CLEAN';

export interface AdjudicationLog {
  id: string;
  action: string;
  timestamp: string;
  actor: string;
  note: string;
  resultingStatus: ClaimStatus;
  complianceHash: string;
}

export interface Claim {
  id: string;
  claimId: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: 'M' | 'F' | 'Other';
  hospitalId: string;
  hospitalName: string;
  hospitalType: HospitalType;
  hospitalSubcategory: HospitalSubcategory;
  accreditation: string;
  specialty: string;
  city: string;
  state: string;
  admissionDate: string;
  dischargeDate: string;
  lengthOfStay: number;
  diagnosisCode: string;
  diagnosisName: string;
  procedureCode: string;
  procedureName: string;
  unitsBilled: number;
  billedAmount: number;
  peerAverageAmount: number;
  statutoryMaxAmount: number; // Mandated legal ceiling based on Hospital Type
  priceCeilingBreach: boolean;
  overbilledExcess: number;
  ceilingBreachReason?: string;
  anomalyScore: number; // 0 - 100
  riskLevel: ClaimRiskLevel;
  status: ClaimStatus;
  policyViolations: PolicyViolation[];
  shapFactors: ShapFactor[];
  items: BilledItem[];
  rfiNotes?: string;
  rfiResponse?: {
    timestamp: string;
    attachedFiles: string[];
    explanation: string;
    complianceOfficer: string;
  };
  adjudicationHistory: AdjudicationLog[];
  isDuplicateOf?: string;
  similarityFingerprint?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  claimId: string;
  claim: Claim;
  action: string;
  category: 'approval_dismissal' | 'fraud_rejection' | 'rfi_request' | 'duplicate_rejection' | 'tariff_enforcement';
  actor: string;
  resultingStatus: ClaimStatus;
  riskScore: number;
  complianceHash: string;
  note: string;
  hospitalName: string;
  hospitalType: HospitalType;
  excessDisallowed: number;
}

export interface PolicyRule {
  id: string;
  code: string;
  name: string;
  category: 'Medical Necessity' | 'Unbundling (NCCI)' | 'Duplicate Billing' | 'Price Ceiling & Tariff' | 'Demographic Contradiction' | 'Provider Frequency';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  description: string;
  status: 'active' | 'evaluating' | 'disabled';
  violationCount: number;
  enforcedBy: 'Statutory Mandate (IRDAI/NHA)' | 'Deterministic Algorithm' | 'Peer Norm Isolation Forest';
}

export interface UserSession {
  email: string;
  name: string;
  role: string;
  portalType: PortalType;
  organization: string;
}
