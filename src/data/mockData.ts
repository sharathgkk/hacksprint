import { Hospital, Claim, PolicyRule, AuditLogEntry } from '../types';

export const INITIAL_HOSPITALS: Hospital[] = [
  {
    id: 'HSP-GOV-01',
    name: 'AIIMS Apex National Institute of Medical Sciences',
    type: 'government',
    subcategory: 'Autonomous AIIMS / Central Government',
    registrationNo: 'GOV-DEL-AIIMS-001',
    establishedYear: 1956,
    city: 'New Delhi',
    state: 'Delhi',
    address: 'Ansari Nagar East, Ring Road, New Delhi 110029',
    accreditation: 'NABH Digital & Central Government Apex Institute',
    bedsCount: 2478,
    icuBedsCount: 380,
    statutoryPriceCappingCategory: 'CGHS_GOV_STATUTORY',
    priceComplianceScore: 99.4,
    overallRating: 4.8,
    totalAuditedClaims: 432,
    overbillingIncidentCount: 2,
    emergencyContact: '+91 11 2658 8500',
    nodalOfficer: 'Dr. R. K. Varma (Central Vigilance Officer)',
    tariffs: [
      {
        category: 'Consultation & OPD',
        procedureCode: '99203',
        procedureName: 'General Specialty OPD Consultation',
        hospitalTariff: 20,
        statutoryMaxCeiling: 50,
        ayushmanSubsidizedRate: 0,
        cghsRate: 50,
        tierDescription: 'Free or nominal ₹20 fee under Central Government mandate'
      },
      {
        category: 'Room / Bed Charges',
        procedureCode: 'BED-GEN',
        procedureName: 'General Inpatient Ward Bed (Per Day)',
        hospitalTariff: 0,
        statutoryMaxCeiling: 150,
        ayushmanSubsidizedRate: 0,
        cghsRate: 150,
        tierDescription: '100% subsidized by Government for general public'
      },
      {
        category: 'ICU & Monitoring',
        procedureCode: 'ICU-VENT',
        procedureName: 'Intensive Care Unit (ICU) with Ventilator (Per Day)',
        hospitalTariff: 1200,
        statutoryMaxCeiling: 2500,
        ayushmanSubsidizedRate: 0,
        cghsRate: 2000,
        tierDescription: 'Statutory capped government critical care ceiling'
      },
      {
        category: 'Surgical Procedure',
        procedureCode: '33533',
        procedureName: 'Coronary Artery Bypass Graft (CABG Heart Surgery)',
        hospitalTariff: 42000,
        statutoryMaxCeiling: 65000,
        ayushmanSubsidizedRate: 0,
        cghsRate: 55000,
        tierDescription: 'Heavily subsidized surgery. Zero copay for Ayushman PM-JAY patients'
      },
      {
        category: 'Diagnostics & Labs',
        procedureCode: '70553',
        procedureName: 'MRI Brain with and without Contrast',
        hospitalTariff: 1500,
        statutoryMaxCeiling: 2500,
        ayushmanSubsidizedRate: 0,
        cghsRate: 2200,
        tierDescription: 'Central Diagnostic Tariff capped rate'
      },
      {
        category: 'Surgical Procedure',
        procedureCode: '66984',
        procedureName: 'Extracapsular Cataract Extraction with IOL',
        hospitalTariff: 8000,
        statutoryMaxCeiling: 14000,
        ayushmanSubsidizedRate: 0,
        cghsRate: 10500,
        tierDescription: 'National Blindness Control Programme subsidized tariff'
      }
    ],
    reviews: [
      {
        id: 'REV-001',
        author: 'Sunil Bhatt',
        role: 'Verified Patient',
        date: '2026-05-18',
        verifiedHospitalType: 'government',
        fairPricingRating: 5,
        clinicalCareRating: 5,
        infrastructureRating: 4,
        comment: 'Verified as Government Apex Hospital. Total CABG surgery cost was barely ₹42,000 including all medications. Zero unexpected consumables bill. Strictly honored statutory limits.',
        billedAmount: 42000,
        statutoryMaxCap: 65000,
        wasOvercharged: false,
        procedureReviewed: 'Coronary Artery Bypass Graft (CABG)',
        resolutionStatus: 'Compliant'
      },
      {
        id: 'REV-002',
        author: 'Dr. Anita Roy',
        role: 'SIU Claims Auditor',
        date: '2026-06-02',
        verifiedHospitalType: 'government',
        fairPricingRating: 5,
        clinicalCareRating: 5,
        infrastructureRating: 4,
        comment: 'Audit verified: Pricing is 100% aligned with CGHS & National Health Authority schedules. Excellent clinical governance and zero unbundling flags.',
        wasOvercharged: false,
        resolutionStatus: 'Compliant'
      }
    ]
  },
  {
    id: 'HSP-GOV-02',
    name: 'Victoria Government District Civil Hospital',
    type: 'government',
    subcategory: 'State Civil / District Hospital',
    registrationNo: 'GOV-KAR-BLR-042',
    establishedYear: 1900,
    city: 'Bangalore',
    state: 'Karnataka',
    address: 'Fort Road, Near City Market, Kalasipalya, Bangalore 560002',
    accreditation: 'State Directorate of Health & Ayushman Bharat Empaneled',
    bedsCount: 1200,
    icuBedsCount: 140,
    statutoryPriceCappingCategory: 'NHA_AYUSHMAN_GOV',
    priceComplianceScore: 97.8,
    overallRating: 4.4,
    totalAuditedClaims: 310,
    overbillingIncidentCount: 4,
    emergencyContact: '+91 80 2670 1150',
    nodalOfficer: 'Dr. Venkatesh Murthy (District Medical Superintendent)',
    tariffs: [
      {
        category: 'Consultation & OPD',
        procedureCode: '99203',
        procedureName: 'General Specialty OPD Consultation',
        hospitalTariff: 10,
        statutoryMaxCeiling: 30,
        ayushmanSubsidizedRate: 0,
        cghsRate: 30,
        tierDescription: 'Nominal OPD receipt prescribed by State Department'
      },
      {
        category: 'Room / Bed Charges',
        procedureCode: 'BED-GEN',
        procedureName: 'General Inpatient Ward Bed (Per Day)',
        hospitalTariff: 0,
        statutoryMaxCeiling: 100,
        ayushmanSubsidizedRate: 0,
        cghsRate: 100,
        tierDescription: 'Free bed charges in state government district civil ward'
      },
      {
        category: 'ICU & Monitoring',
        procedureCode: 'ICU-VENT',
        procedureName: 'Intensive Care Unit (ICU) with Ventilator (Per Day)',
        hospitalTariff: 1000,
        statutoryMaxCeiling: 2200,
        ayushmanSubsidizedRate: 0,
        cghsRate: 1800,
        tierDescription: 'State Government capped ICU rate'
      },
      {
        category: 'Surgical Procedure',
        procedureCode: '33533',
        procedureName: 'Coronary Artery Bypass Graft (CABG Heart Surgery)',
        hospitalTariff: 38000,
        statutoryMaxCeiling: 55000,
        ayushmanSubsidizedRate: 0,
        cghsRate: 48000,
        tierDescription: 'Subsidized state civil cardiac unit'
      },
      {
        category: 'Diagnostics & Labs',
        procedureCode: '70553',
        procedureName: 'MRI Brain with and without Contrast',
        hospitalTariff: 1200,
        statutoryMaxCeiling: 2200,
        ayushmanSubsidizedRate: 0,
        cghsRate: 1900,
        tierDescription: 'State Government in-house diagnostic unit'
      }
    ],
    reviews: [
      {
        id: 'REV-003',
        author: 'Manjula Gowda',
        role: 'Ayushman Beneficiary',
        date: '2026-06-10',
        verifiedHospitalType: 'government',
        fairPricingRating: 5,
        clinicalCareRating: 4,
        infrastructureRating: 3.5,
        comment: 'Confirmed government district hospital. Ayushman PM-JAY card accepted without questions. Spent only ₹250 for external special diagnostic tests. Clean transparency on bed charges.',
        billedAmount: 0,
        statutoryMaxCap: 2200,
        wasOvercharged: false,
        procedureReviewed: 'Emergency ICU Admission',
        resolutionStatus: 'Compliant'
      }
    ]
  },
  {
    id: 'HSP-101',
    name: 'Apex Multispecialty Hospital',
    type: 'private',
    subcategory: 'Corporate Super-Specialty',
    registrationNo: 'PVT-KAR-BLR-8921',
    establishedYear: 2012,
    city: 'Bangalore',
    state: 'Karnataka',
    address: '42 Outer Ring Road, Bellandur, Bangalore 560103',
    accreditation: 'NABH Digital Accredited & JCI Candidate',
    bedsCount: 450,
    icuBedsCount: 65,
    statutoryPriceCappingCategory: 'PRIVATE_TIER_1_METRO',
    priceComplianceScore: 78.2,
    overallRating: 3.8,
    totalAuditedClaims: 540,
    overbillingIncidentCount: 46,
    emergencyContact: '+91 80 4910 4000',
    nodalOfficer: 'Suresh Nambiar (VP Billing & Compliance)',
    tariffs: [
      {
        category: 'Consultation & OPD',
        procedureCode: '99203',
        procedureName: 'Senior Specialist Consultation',
        hospitalTariff: 1200,
        statutoryMaxCeiling: 1500,
        ayushmanSubsidizedRate: 250,
        cghsRate: 400,
        tierDescription: 'Tier 1 Metro private corporate specialist fee'
      },
      {
        category: 'Room / Bed Charges',
        procedureCode: 'BED-GEN',
        procedureName: 'General Multi-Bed Ward (Per Day)',
        hospitalTariff: 3200,
        statutoryMaxCeiling: 3500,
        ayushmanSubsidizedRate: 1000,
        cghsRate: 1500,
        tierDescription: 'Within mandated Private Tier 1 general bed ceiling'
      },
      {
        category: 'Room / Bed Charges',
        procedureCode: 'BED-PVT',
        procedureName: 'Private Deluxe Single Room (Per Day)',
        hospitalTariff: 11500,
        statutoryMaxCeiling: 12000,
        ayushmanSubsidizedRate: 2500,
        cghsRate: 3500,
        tierDescription: 'Private deluxe suite tariff'
      },
      {
        category: 'ICU & Monitoring',
        procedureCode: 'ICU-VENT',
        procedureName: 'Intensive Care Unit (ICU) with Ventilator (Per Day)',
        hospitalTariff: 22000,
        statutoryMaxCeiling: 22000,
        ayushmanSubsidizedRate: 5000,
        cghsRate: 7500,
        tierDescription: 'Regulated statutory ceiling cap for Metro Private Hospitals'
      },
      {
        category: 'Surgical Procedure',
        procedureCode: '33533',
        procedureName: 'Coronary Artery Bypass Graft (CABG Heart Surgery)',
        hospitalTariff: 315000,
        statutoryMaxCeiling: 220000,
        ayushmanSubsidizedRate: 110000,
        cghsRate: 140000,
        tierDescription: 'High risk of tariff ceiling breach. Statutory cap is ₹2,20,000 for standard CABG'
      },
      {
        category: 'Diagnostics & Labs',
        procedureCode: '70553',
        procedureName: 'MRI Brain with and without Contrast',
        hospitalTariff: 8500,
        statutoryMaxCeiling: 7500,
        ayushmanSubsidizedRate: 2500,
        cghsRate: 3500,
        tierDescription: 'Private diagnostic charge exceeds statutory benchmark by ₹1,000'
      }
    ],
    reviews: [
      {
        id: 'REV-004',
        author: 'Arun Kulkarni',
        role: 'Verified Patient',
        date: '2026-06-12',
        verifiedHospitalType: 'private',
        fairPricingRating: 2,
        clinicalCareRating: 4.5,
        infrastructureRating: 4.8,
        comment: 'Quality of doctors is top-notch, but billing attempted to charge ₹3,15,000 for CABG when statutory maximum private cap is ₹2,20,000. Insurance auditor flagged and disallowed ₹95,000 excess.',
        billedAmount: 315000,
        statutoryMaxCap: 220000,
        wasOvercharged: true,
        procedureReviewed: 'Coronary Artery Bypass Graft (CABG)',
        resolutionStatus: 'Disputed & Refunded'
      },
      {
        id: 'REV-005',
        author: 'Meera Pillai',
        role: 'SIU Claims Auditor',
        date: '2026-06-14',
        verifiedHospitalType: 'private',
        fairPricingRating: 2.5,
        clinicalCareRating: 4,
        infrastructureRating: 4.5,
        comment: 'Frequent unbundling and consumable padding noted in SIU review. Billed separate ₹24,000 for nursing and PPE kits which are statutory included in room rent.',
        wasOvercharged: true,
        resolutionStatus: 'Under Investigation'
      }
    ]
  },
  {
    id: 'HSP-204',
    name: 'Fortis Healthcare Center',
    type: 'private',
    subcategory: 'Corporate Super-Specialty',
    registrationNo: 'PVT-MAH-MUM-4410',
    establishedYear: 2008,
    city: 'Mumbai',
    state: 'Maharashtra',
    address: 'Mulund Goregaon Link Road, Bhandup West, Mumbai 400078',
    accreditation: 'JCI Gold Accredited & NABH Certified',
    bedsCount: 380,
    icuBedsCount: 55,
    statutoryPriceCappingCategory: 'PRIVATE_TIER_1_METRO',
    priceComplianceScore: 84.5,
    overallRating: 4.2,
    totalAuditedClaims: 480,
    overbillingIncidentCount: 28,
    emergencyContact: '+91 22 6799 4444',
    nodalOfficer: 'Pooja Deshmukh (Head of Revenue Cycle)',
    tariffs: [
      {
        category: 'Consultation & OPD',
        procedureCode: '99203',
        procedureName: 'Senior Specialist Consultation',
        hospitalTariff: 1400,
        statutoryMaxCeiling: 1500,
        ayushmanSubsidizedRate: 250,
        cghsRate: 400,
        tierDescription: 'Within Private Metro ceiling'
      },
      {
        category: 'ICU & Monitoring',
        procedureCode: 'ICU-VENT',
        procedureName: 'Intensive Care Unit (ICU) with Ventilator (Per Day)',
        hospitalTariff: 21000,
        statutoryMaxCeiling: 22000,
        ayushmanSubsidizedRate: 5000,
        cghsRate: 7500,
        tierDescription: 'Statutory capped rate'
      },
      {
        category: 'Surgical Procedure',
        procedureCode: '27447',
        procedureName: 'Total Knee Arthroplasty (Knee Replacement)',
        hospitalTariff: 175000,
        statutoryMaxCeiling: 160000,
        ayushmanSubsidizedRate: 90000,
        cghsRate: 115000,
        tierDescription: 'NPPA implant capped ceiling enforced'
      }
    ],
    reviews: [
      {
        id: 'REV-006',
        author: 'Kavita Joshi',
        role: 'Verified Patient',
        date: '2026-05-30',
        verifiedHospitalType: 'private',
        fairPricingRating: 4,
        clinicalCareRating: 4.8,
        infrastructureRating: 4.9,
        comment: 'Private hospital with transparent initial counseling. They gave an itemized estimate upfront and stayed within the insurance sanction limits.',
        billedAmount: 160000,
        statutoryMaxCap: 160000,
        wasOvercharged: false,
        procedureReviewed: 'Knee Replacement',
        resolutionStatus: 'Compliant'
      }
    ]
  },
  {
    id: 'HSP-305',
    name: 'MedStar Care Hospital',
    type: 'private',
    subcategory: 'Private Multi-Specialty',
    registrationNo: 'PVT-TEL-HYD-6102',
    establishedYear: 2016,
    city: 'Hyderabad',
    state: 'Telangana',
    address: 'Road No 12, Banjara Hills, Hyderabad 500034',
    accreditation: 'NABH Accredited Multi-Specialty',
    bedsCount: 260,
    icuBedsCount: 38,
    statutoryPriceCappingCategory: 'PRIVATE_TIER_2_URBAN',
    priceComplianceScore: 89.1,
    overallRating: 4.1,
    totalAuditedClaims: 290,
    overbillingIncidentCount: 15,
    emergencyContact: '+91 40 4455 6677',
    nodalOfficer: 'Dr. Srinivas Rao (Medical Director)',
    tariffs: [
      {
        category: 'Consultation & OPD',
        procedureCode: '99203',
        procedureName: 'Specialist Consultation',
        hospitalTariff: 800,
        statutoryMaxCeiling: 1000,
        ayushmanSubsidizedRate: 200,
        cghsRate: 350,
        tierDescription: 'Private Tier 2 Urban Cap'
      },
      {
        category: 'ICU & Monitoring',
        procedureCode: 'ICU-VENT',
        procedureName: 'Intensive Care Unit (ICU) with Ventilator (Per Day)',
        hospitalTariff: 16000,
        statutoryMaxCeiling: 18000,
        ayushmanSubsidizedRate: 4500,
        cghsRate: 6500,
        tierDescription: 'Tier 2 private hospital regulated ceiling'
      }
    ],
    reviews: []
  },
  {
    id: 'HSP-410',
    name: 'City Trauma & General Clinic',
    type: 'private',
    subcategory: 'Private Nursing Home / Clinic',
    registrationNo: 'PVT-TN-CHE-2201',
    establishedYear: 2019,
    city: 'Chennai',
    state: 'Tamil Nadu',
    address: '18 GST Road, Guindy, Chennai 600032',
    accreditation: 'State Medical Council Registered',
    bedsCount: 65,
    icuBedsCount: 10,
    statutoryPriceCappingCategory: 'PRIVATE_TIER_3_COMMUNITY',
    priceComplianceScore: 71.3,
    overallRating: 3.4,
    totalAuditedClaims: 165,
    overbillingIncidentCount: 32,
    emergencyContact: '+91 44 2233 4455',
    nodalOfficer: 'Karthik Raman (Administrator)',
    tariffs: [
      {
        category: 'Consultation & OPD',
        procedureCode: '99203',
        procedureName: 'General Consultation',
        hospitalTariff: 500,
        statutoryMaxCeiling: 600,
        ayushmanSubsidizedRate: 150,
        cghsRate: 250,
        tierDescription: 'Private Tier 3 Community Cap'
      },
      {
        category: 'Room / Bed Charges',
        procedureCode: 'BED-GEN',
        procedureName: 'General Ward Bed (Per Day)',
        hospitalTariff: 2200,
        statutoryMaxCeiling: 2000,
        ayushmanSubsidizedRate: 800,
        cghsRate: 1100,
        tierDescription: 'Exceeds Tier 3 nursing home ceiling by ₹200/day'
      }
    ],
    reviews: []
  },
  {
    id: 'HSP-512',
    name: 'Apollo Speciality Care',
    type: 'private',
    subcategory: 'Corporate Super-Specialty',
    registrationNo: 'PVT-KAR-BLR-1190',
    establishedYear: 2010,
    city: 'Bangalore',
    state: 'Karnataka',
    address: '154/11 Bannerghatta Road, Bangalore 560076',
    accreditation: 'JCI Gold Accredited & NABH Centre of Excellence',
    bedsCount: 500,
    icuBedsCount: 80,
    statutoryPriceCappingCategory: 'PRIVATE_TIER_1_METRO',
    priceComplianceScore: 86.7,
    overallRating: 4.4,
    totalAuditedClaims: 610,
    overbillingIncidentCount: 35,
    emergencyContact: '+91 80 2630 2630',
    nodalOfficer: 'Naveen Jacob (Auditor Liaison)',
    tariffs: [],
    reviews: []
  },
  {
    id: 'HSP-905',
    name: 'Max Ortho & Joint Institute',
    type: 'private',
    subcategory: 'Corporate Super-Specialty',
    registrationNo: 'PVT-DEL-MAX-7701',
    establishedYear: 2014,
    city: 'Delhi',
    state: 'Delhi',
    address: '1 Press Enclave Road, Saket, New Delhi 110017',
    accreditation: 'NABH Digital Certified Super-Specialty',
    bedsCount: 310,
    icuBedsCount: 45,
    statutoryPriceCappingCategory: 'PRIVATE_TIER_1_METRO',
    priceComplianceScore: 88.0,
    overallRating: 4.3,
    totalAuditedClaims: 340,
    overbillingIncidentCount: 18,
    emergencyContact: '+91 11 2651 5050',
    nodalOfficer: 'Dr. Shalini Kapoor (Chief Medical Auditor)',
    tariffs: [],
    reviews: []
  },
  {
    id: 'HSP-GOV-03',
    name: 'King Edward Memorial Municipal Hospital',
    type: 'government',
    subcategory: 'Municipal Corporation Public Hospital',
    registrationNo: 'GOV-MAH-MUM-KEM-01',
    establishedYear: 1926,
    city: 'Mumbai',
    state: 'Maharashtra',
    address: 'Acharya Donde Marg, Parel, Mumbai 400012',
    accreditation: 'BMC Municipal Corporation Healthcare Directorate',
    bedsCount: 1800,
    icuBedsCount: 220,
    statutoryPriceCappingCategory: 'CGHS_GOV_STATUTORY',
    priceComplianceScore: 98.9,
    overallRating: 4.6,
    totalAuditedClaims: 395,
    overbillingIncidentCount: 3,
    emergencyContact: '+91 22 2410 7000',
    nodalOfficer: 'Dr. Mohan Joshi (Municipal Dean)',
    tariffs: [],
    reviews: []
  },
  {
    id: 'HSP-GOV-04',
    name: 'Rajiv Gandhi Government General Hospital',
    type: 'government',
    subcategory: 'State Civil / District Hospital',
    registrationNo: 'GOV-TN-CHE-RGG-01',
    establishedYear: 1664,
    city: 'Chennai',
    state: 'Tamil Nadu',
    address: 'EVR Periyar Salai, Park Town, Chennai 600003',
    accreditation: 'Tamil Nadu State Health Directorate & CMCHIS Apex Hub',
    bedsCount: 2100,
    icuBedsCount: 290,
    statutoryPriceCappingCategory: 'NHA_AYUSHMAN_GOV',
    priceComplianceScore: 99.1,
    overallRating: 4.7,
    totalAuditedClaims: 412,
    overbillingIncidentCount: 2,
    emergencyContact: '+91 44 2530 5000',
    nodalOfficer: 'Dr. E. Theranirajan (Dean & Grievance Head)',
    tariffs: [],
    reviews: []
  }
];

export const INITIAL_CLAIMS: Claim[] = [
  {
    id: 'CLM-8801',
    claimId: 'CLM-8801',
    patientId: 'P-10842',
    patientName: 'Devika Rao',
    patientAge: 52,
    patientGender: 'F',
    hospitalId: 'HSP-101',
    hospitalName: 'Apex Multispecialty Hospital',
    hospitalType: 'private',
    hospitalSubcategory: 'Corporate Super-Specialty',
    accreditation: 'NABH Digital Accredited',
    specialty: 'Cardiology',
    city: 'Bangalore',
    state: 'Karnataka',
    admissionDate: '2026-06-08',
    dischargeDate: '2026-06-13',
    lengthOfStay: 5,
    diagnosisCode: 'I25.10',
    diagnosisName: 'Atherosclerotic heart disease of native coronary artery',
    procedureCode: '33533',
    procedureName: 'Coronary artery bypass graft (CABG), single arterial graft',
    unitsBilled: 1,
    billedAmount: 315000,
    peerAverageAmount: 210000,
    statutoryMaxAmount: 220000,
    priceCeilingBreach: true,
    overbilledExcess: 95000,
    ceilingBreachReason: 'Private Tier-1 Metro statutory price ceiling for standard CABG is capped at ₹2,20,000. Hospital billed ₹3,15,000, exceeding the mandated maximum by ₹95,000.',
    anomalyScore: 89,
    riskLevel: 'CRITICAL',
    status: 'pending_review',
    policyViolations: [
      {
        ruleId: 'RULE-PRICE-01',
        ruleName: 'Statutory Tariff Ceiling Violation',
        severity: 'CRITICAL',
        description: 'Billed amount exceeds statutory private hospital price ceiling by +43.2% (₹95,000 excess charge over legal ceiling of ₹2,20,000).'
      },
      {
        ruleId: 'RULE-NCCI-04',
        ruleName: 'Unbundling of Cardiac Monitoring Consumables',
        severity: 'HIGH',
        description: 'Separate charge of ₹28,000 billed for post-op telemetry and surgical tray which are statutory bundled in primary procedure code 33533.'
      }
    ],
    shapFactors: [
      {
        feature: 'Billed Amount vs Statutory Private Cap',
        impact: 0.48,
        description: '₹3,15,000 billed vs ₹2,20,000 legal ceiling (+₹95k excess)',
        direction: 'increases_risk'
      },
      {
        feature: 'Unbundled Consumable Tray Line Items',
        impact: 0.28,
        description: 'Telemetry + surgical packs billed separately',
        direction: 'increases_risk'
      },
      {
        feature: 'Length of Stay Norm',
        impact: -0.12,
        description: '5 days in-hospital is clinically standard for single arterial CABG',
        direction: 'decreases_risk'
      },
      {
        feature: 'Patient Age / Diagnostic Concordance',
        impact: -0.09,
        description: '52-year-old female with severe CAD matches ICD I25.10',
        direction: 'decreases_risk'
      }
    ],
    items: [
      {
        code: '33533',
        name: 'CABG Surgical Procedure & OT Charges',
        quantity: 1,
        unitPrice: 195000,
        totalPrice: 195000,
        maxAllowedRate: 150000,
        isExceeded: true,
        category: 'Surgical Procedure'
      },
      {
        code: 'ICU-VENT',
        name: 'ICU Care with Hemodynamic Monitoring (3 Days)',
        quantity: 3,
        unitPrice: 22000,
        totalPrice: 66000,
        maxAllowedRate: 22000,
        isExceeded: false,
        category: 'ICU & Monitoring'
      },
      {
        code: 'BED-PVT',
        name: 'Deluxe Private Bed (2 Days post-ICU)',
        quantity: 2,
        unitPrice: 13000,
        totalPrice: 26000,
        maxAllowedRate: 12000,
        isExceeded: true,
        category: 'Room / Bed Charges'
      },
      {
        code: 'UNB-CONS',
        name: 'Unbundled Surgical Drape & Instrument Sterilization Kit',
        quantity: 1,
        unitPrice: 28000,
        totalPrice: 28000,
        maxAllowedRate: 0,
        isExceeded: true,
        category: 'Pharmacy & Implants'
      }
    ],
    adjudicationHistory: []
  },
  {
    id: 'CLM-7492',
    claimId: 'CLM-7492',
    patientId: 'P-001',
    patientName: 'Rajesh Kumar',
    patientAge: 44,
    patientGender: 'M',
    hospitalId: 'HSP-101',
    hospitalName: 'Apex Multispecialty Hospital',
    hospitalType: 'private',
    hospitalSubcategory: 'Corporate Super-Specialty',
    accreditation: 'NABH Digital Accredited',
    specialty: 'Radiology',
    city: 'Bangalore',
    state: 'Karnataka',
    admissionDate: '2026-06-10',
    dischargeDate: '2026-06-10',
    lengthOfStay: 1,
    diagnosisCode: 'G43.909',
    diagnosisName: 'Migraine, unspecified, not intractable, without status migrainosus',
    procedureCode: '70553',
    procedureName: 'MRI Brain with and without contrast material',
    unitsBilled: 1,
    billedAmount: 8500,
    peerAverageAmount: 5200,
    statutoryMaxAmount: 7500,
    priceCeilingBreach: true,
    overbilledExcess: 1000,
    ceilingBreachReason: 'Billed ₹8,500 for MRI Brain vs Private Tier 1 maximum allowed rate of ₹7,500. Additionally, exact duplicate collision detected against claim CLM-7310 filed 3 hours earlier.',
    anomalyScore: 96,
    riskLevel: 'CRITICAL',
    status: 'pending_review',
    isDuplicateOf: 'CLM-7310',
    similarityFingerprint: 'SHA256:d8a9e144c017d8329b35',
    policyViolations: [
      {
        ruleId: 'RULE-DUP-01',
        ruleName: '100% Collision Exact Duplicate Billing',
        severity: 'CRITICAL',
        description: 'Identical patient ID P-001, procedure code 70553, diagnosis G43.909, and date of service submitted under two distinct invoice serials.'
      },
      {
        ruleId: 'RULE-PRICE-02',
        ruleName: 'Diagnostic Tariff Cap Overcharge',
        severity: 'MEDIUM',
        description: 'Diagnostic MRI fee exceeds standard private ceiling by ₹1,000.'
      }
    ],
    shapFactors: [
      {
        feature: 'Duplicate Hash Collision Fingerprint',
        impact: 0.62,
        description: 'Same patient, imaging modality, date & provider',
        direction: 'increases_risk'
      },
      {
        feature: 'Billing Velocity / Repeat Same Day',
        impact: 0.24,
        description: 'Second claim filed within 180 minutes',
        direction: 'increases_risk'
      }
    ],
    items: [
      {
        code: '70553',
        name: 'MRI Brain with and without contrast material',
        quantity: 1,
        unitPrice: 8500,
        totalPrice: 8500,
        maxAllowedRate: 7500,
        isExceeded: true,
        category: 'Diagnostics & Labs'
      }
    ],
    adjudicationHistory: []
  },
  {
    id: 'CLM-6120',
    claimId: 'CLM-6120',
    patientId: 'P-3091',
    patientName: 'Sunita Patel',
    patientAge: 38,
    patientGender: 'F',
    hospitalId: 'HSP-GOV-01',
    hospitalName: 'AIIMS Apex National Institute of Medical Sciences',
    hospitalType: 'government',
    hospitalSubcategory: 'Autonomous AIIMS / Central Government',
    accreditation: 'NABH Digital & Central Government Apex Institute',
    specialty: 'Orthopedics',
    city: 'New Delhi',
    state: 'Delhi',
    admissionDate: '2026-06-05',
    dischargeDate: '2026-06-08',
    lengthOfStay: 3,
    diagnosisCode: 'M54.5',
    diagnosisName: 'Low back pain',
    procedureCode: '99291',
    procedureName: 'Critical care, evaluation and management of critically ill patient; first 30-74 minutes',
    unitsBilled: 1,
    billedAmount: 24000,
    peerAverageAmount: 3200,
    statutoryMaxAmount: 3000,
    priceCeilingBreach: true,
    overbilledExcess: 21000,
    ceilingBreachReason: 'Facility is a Government Hospital where non-emergency ICU evaluation is capped at ₹2,500/day. Billed Level 5 Critical Care (99291) for benign Low Back Pain (M54.5) violating medical necessity and government tariff schedules.',
    anomalyScore: 92,
    riskLevel: 'CRITICAL',
    status: 'pending_review',
    policyViolations: [
      {
        ruleId: 'RULE-UPCODE-01',
        ruleName: 'Level 5 Critical Care Upcoding for Benign Back Pain',
        severity: 'CRITICAL',
        description: 'CPT 99291 requires life-threatening organ failure. Patient record demonstrates uncomplicated lumbar strain (M54.5).'
      },
      {
        ruleId: 'RULE-GOV-01',
        ruleName: 'Government Statutory Tariff Schedule Breach',
        severity: 'HIGH',
        description: 'Billed ₹24,000 under private emergency codes in a public facility where statutory maximum cap for spine conservative care is ₹3,000.'
      }
    ],
    shapFactors: [
      {
        feature: 'Clinical Acuity vs Billed Intensity Mismatch',
        impact: 0.55,
        description: 'ICD M54.5 (low back pain) does not justify critical care 99291',
        direction: 'increases_risk'
      },
      {
        feature: 'Public Hospital Statutory Tariff Disparity',
        impact: 0.32,
        description: 'Exceeds government maximum ceiling by 700%',
        direction: 'increases_risk'
      }
    ],
    items: [
      {
        code: '99291',
        name: 'Level 5 Intensive Resuscitation Critical Care',
        quantity: 1,
        unitPrice: 24000,
        totalPrice: 24000,
        maxAllowedRate: 3000,
        isExceeded: true,
        category: 'Consultation'
      }
    ],
    adjudicationHistory: []
  },
  {
    id: 'CLM-5541',
    claimId: 'CLM-5541',
    patientId: 'P-9921',
    patientName: 'Vikram Joshi',
    patientAge: 62,
    patientGender: 'M',
    hospitalId: 'HSP-204',
    hospitalName: 'Fortis Healthcare Center',
    hospitalType: 'private',
    hospitalSubcategory: 'Corporate Super-Specialty',
    accreditation: 'JCI Gold Accredited',
    specialty: 'Orthopedics',
    city: 'Mumbai',
    state: 'Maharashtra',
    admissionDate: '2026-06-02',
    dischargeDate: '2026-06-06',
    lengthOfStay: 4,
    diagnosisCode: 'M17.11',
    diagnosisName: 'Primary osteoarthritis, right knee',
    procedureCode: '27447',
    procedureName: 'Total knee arthroplasty (TKR), prosthetic replacement',
    unitsBilled: 1,
    billedAmount: 175000,
    peerAverageAmount: 155000,
    statutoryMaxAmount: 160000,
    priceCeilingBreach: true,
    overbilledExcess: 15000,
    ceilingBreachReason: 'NPPA Implant price capping rules limit total procedure ceiling to ₹1,60,000 for standard unicondylar/total knee prosthesis. Hospital added extra ₹15,000 administrative implant handling surcharge.',
    anomalyScore: 68,
    riskLevel: 'HIGH',
    status: 'under_investigation',
    policyViolations: [
      {
        ruleId: 'RULE-IMPLANT-01',
        ruleName: 'NPPA Implant Price Cap Violation',
        severity: 'HIGH',
        description: 'Implant handling surcharge of ₹15,000 disallowed under National Pharmaceutical Pricing Authority statutory guidelines.'
      }
    ],
    shapFactors: [
      {
        feature: 'Implant Surcharge Above Statutory Benchmark',
        impact: 0.36,
        description: 'Illegal handling fee added on top of capped prosthesis',
        direction: 'increases_risk'
      },
      {
        feature: 'Clinical Appropriateness',
        impact: -0.22,
        description: 'Grade 4 osteoarthritis verified by standing radiographs',
        direction: 'decreases_risk'
      }
    ],
    items: [
      {
        code: '27447',
        name: 'Total Knee Arthroplasty OT & Surgeon Package',
        quantity: 1,
        unitPrice: 110000,
        totalPrice: 110000,
        maxAllowedRate: 110000,
        isExceeded: false,
        category: 'Surgical Procedure'
      },
      {
        code: 'IMP-KNEE',
        name: 'Cobalt-Chromium Knee Implant System (NPPA Capped)',
        quantity: 1,
        unitPrice: 50000,
        totalPrice: 50000,
        maxAllowedRate: 50000,
        isExceeded: false,
        category: 'Pharmacy & Implants'
      },
      {
        code: 'SUR-IMP',
        name: 'Disallowed Administrative Implant Storage & Handling Fee',
        quantity: 1,
        unitPrice: 15000,
        totalPrice: 15000,
        maxAllowedRate: 0,
        isExceeded: true,
        category: 'Pharmacy & Implants'
      }
    ],
    adjudicationHistory: []
  },
  {
    id: 'CLM-4290',
    claimId: 'CLM-4290',
    patientId: 'P-2041',
    patientName: 'Ananya Deshmukh',
    patientAge: 29,
    patientGender: 'F',
    hospitalId: 'HSP-410',
    hospitalName: 'City Trauma & General Clinic',
    hospitalType: 'private',
    hospitalSubcategory: 'Private Nursing Home / Clinic',
    accreditation: 'State Medical Council Registered',
    specialty: 'Neurology',
    city: 'Chennai',
    state: 'Tamil Nadu',
    admissionDate: '2026-06-04',
    dischargeDate: '2026-06-05',
    lengthOfStay: 1,
    diagnosisCode: 'G43.909',
    diagnosisName: 'Migraine, unspecified, not intractable',
    procedureCode: '70553',
    procedureName: 'MRI Brain with and without contrast material (Multi-Series)',
    unitsBilled: 8,
    billedAmount: 64000,
    peerAverageAmount: 5200,
    statutoryMaxAmount: 7500,
    priceCeilingBreach: true,
    overbilledExcess: 56500,
    ceilingBreachReason: 'Extreme over-utilization: 8 units of Brain MRI billed for single outpatient session. Statutory maximum is 1 unit (₹7,500 max). Billed ₹64,000.',
    anomalyScore: 98,
    riskLevel: 'CRITICAL',
    status: 'pending_review',
    policyViolations: [
      {
        ruleId: 'RULE-FREQ-01',
        ruleName: 'Severe Over-utilization (8x Daily Frequency Limit)',
        severity: 'CRITICAL',
        description: 'Billed 8 complete brain MRI scans within 24 hours for uncomplicated tension migraine.'
      }
    ],
    shapFactors: [
      {
        feature: 'Unit Frequency Multiplier',
        impact: 0.72,
        description: '8 identical scans billed within 1 admission day',
        direction: 'increases_risk'
      }
    ],
    items: [
      {
        code: '70553',
        name: 'Brain MRI Multiple Acquisition Repetitions',
        quantity: 8,
        unitPrice: 8000,
        totalPrice: 64000,
        maxAllowedRate: 7500,
        isExceeded: true,
        category: 'Diagnostics & Labs'
      }
    ],
    adjudicationHistory: []
  },
  {
    id: 'CLM-3104',
    claimId: 'CLM-3104',
    patientId: 'P-5520',
    patientName: 'Rameshwar Nair',
    patientAge: 68,
    patientGender: 'M',
    hospitalId: 'HSP-GOV-02',
    hospitalName: 'Victoria Government District Civil Hospital',
    hospitalType: 'government',
    hospitalSubcategory: 'State Civil / District Hospital',
    accreditation: 'State Directorate of Health & Ayushman Bharat Empaneled',
    specialty: 'Ophthalmology',
    city: 'Bangalore',
    state: 'Karnataka',
    admissionDate: '2026-06-11',
    dischargeDate: '2026-06-11',
    lengthOfStay: 1,
    diagnosisCode: 'H25.9',
    diagnosisName: 'Age-related cataract, unspecified',
    procedureCode: '66984',
    procedureName: 'Extracapsular cataract removal with insertion of intraocular lens',
    unitsBilled: 1,
    billedAmount: 8000,
    peerAverageAmount: 12000,
    statutoryMaxAmount: 14000,
    priceCeilingBreach: false,
    overbilledExcess: 0,
    anomalyScore: 4,
    riskLevel: 'CLEAN',
    status: 'approved_clean',
    policyViolations: [],
    shapFactors: [
      {
        feature: 'Strict Statutory Compliance',
        impact: -0.44,
        description: 'Billed ₹8,000, well below government ceiling of ₹14,000',
        direction: 'decreases_risk'
      },
      {
        feature: 'Accurate Demographic Crosswalk',
        impact: -0.32,
        description: 'Age 68 male with age-related senile cataract',
        direction: 'decreases_risk'
      }
    ],
    items: [
      {
        code: '66984',
        name: 'Cataract Phacoemulsification with Foldable Hydrophobic IOL',
        quantity: 1,
        unitPrice: 8000,
        totalPrice: 8000,
        maxAllowedRate: 14000,
        isExceeded: false,
        category: 'Surgical Procedure'
      }
    ],
    adjudicationHistory: [
      {
        id: 'ADJ-101',
        action: 'Approve & Release Payment',
        timestamp: '2026-06-12 10:14:22',
        actor: 'investigator.sethi@claimguard-insurance.com',
        note: 'Clean statutory public hospital claim. Full compliance with Ayushman Bharat cataract schedule.',
        resultingStatus: 'approved_clean',
        complianceHash: 'SHA256:4fe8c991a003bf478120'
      }
    ]
  },
  {
    id: 'CLM-2019',
    claimId: 'CLM-2019',
    patientId: 'P-6119',
    patientName: 'Meenakshi Sundaram',
    patientAge: 46,
    patientGender: 'F',
    hospitalId: 'HSP-305',
    hospitalName: 'MedStar Care Hospital',
    hospitalType: 'private',
    hospitalSubcategory: 'Private Multi-Specialty',
    accreditation: 'NABH Accredited Multi-Specialty',
    specialty: 'General Surgery',
    city: 'Hyderabad',
    state: 'Telangana',
    admissionDate: '2026-06-09',
    dischargeDate: '2026-06-11',
    lengthOfStay: 2,
    diagnosisCode: 'K80.20',
    diagnosisName: 'Calculus of gallbladder without cholecystitis',
    procedureCode: '47562',
    procedureName: 'Laparoscopic cholecystectomy (Gallbladder removal)',
    unitsBilled: 1,
    billedAmount: 68000,
    peerAverageAmount: 65000,
    statutoryMaxAmount: 75000,
    priceCeilingBreach: false,
    overbilledExcess: 0,
    anomalyScore: 16,
    riskLevel: 'CLEAN',
    status: 'approved_clean',
    policyViolations: [],
    shapFactors: [
      {
        feature: 'Within Statutory Private Urban Ceiling',
        impact: -0.28,
        description: 'Billed ₹68,000 vs ₹75,000 maximum allowed cap',
        direction: 'decreases_risk'
      }
    ],
    items: [
      {
        code: '47562',
        name: 'Laparoscopic Cholecystectomy Package',
        quantity: 1,
        unitPrice: 52000,
        totalPrice: 52000,
        maxAllowedRate: 55000,
        isExceeded: false,
        category: 'Surgical Procedure'
      },
      {
        code: 'BED-GEN',
        name: 'Twin-Sharing Room (2 Days)',
        quantity: 2,
        unitPrice: 3000,
        totalPrice: 6000,
        maxAllowedRate: 3500,
        isExceeded: false,
        category: 'Room / Bed Charges'
      },
      {
        code: 'LAB-PRE',
        name: 'Pre-Operative LFT, CBC, ECG & Ultrasound',
        quantity: 1,
        unitPrice: 10000,
        totalPrice: 10000,
        maxAllowedRate: 10000,
        isExceeded: false,
        category: 'Diagnostics & Labs'
      }
    ],
    adjudicationHistory: [
      {
        id: 'ADJ-102',
        action: 'Approve & Release Payment',
        timestamp: '2026-06-11 16:30:00',
        actor: 'investigator.sethi@claimguard-insurance.com',
        note: 'Standard surgical turnaround, pricing fully compliant with Private Tier 2 ceilings.',
        resultingStatus: 'approved_clean',
        complianceHash: 'SHA256:88bc2100e479aa5190b3'
      }
    ]
  },
  {
    id: 'CLM-1108',
    claimId: 'CLM-1108',
    patientId: 'P-7703',
    patientName: 'Tanvi Saxena',
    patientAge: 33,
    patientGender: 'F',
    hospitalId: 'HSP-101',
    hospitalName: 'Apex Multispecialty Hospital',
    hospitalType: 'private',
    hospitalSubcategory: 'Corporate Super-Specialty',
    accreditation: 'NABH Digital Accredited',
    specialty: 'Obstetrics & Gynecology',
    city: 'Bangalore',
    state: 'Karnataka',
    admissionDate: '2026-06-07',
    dischargeDate: '2026-06-10',
    lengthOfStay: 3,
    diagnosisCode: 'O82',
    diagnosisName: 'Single delivery by caesarean section',
    procedureCode: '59510',
    procedureName: 'Routine obstetric care including antepartum, cesarean delivery, and postpartum care',
    unitsBilled: 1,
    billedAmount: 145000,
    peerAverageAmount: 92000,
    statutoryMaxAmount: 95000,
    priceCeilingBreach: true,
    overbilledExcess: 50000,
    ceilingBreachReason: 'Billed ₹1,45,000 for standard uncomplicated Cesarean Delivery. Private hospital statutory maximum price cap is ₹95,000. Overcharged patient +₹50,000 under arbitrary "Executive Birthing Suite" markups.',
    anomalyScore: 82,
    riskLevel: 'HIGH',
    status: 'rfi_requested',
    rfiNotes: 'Statutory overcharge detected. Requesting itemized audit justification for ₹50,000 excess charge over legal ceiling.',
    rfiResponse: {
      timestamp: '2026-06-11 11:20:00',
      attachedFiles: ['Discharge_Summary_P7703.pdf', 'Patient_Consent_BirthingSuite.pdf'],
      explanation: 'Patient requested luxury birthing suite with hydrotherapy pool. Submitting signed elective upgrade waiver for auditor verification.',
      complianceOfficer: 'Suresh Nambiar (Apex Hospital Desk)'
    },
    policyViolations: [
      {
        ruleId: 'RULE-PRICE-01',
        ruleName: 'Maternity Statutory Price Ceiling Breach',
        severity: 'HIGH',
        description: 'Exceeded maximum permitted maternity ceiling by +52.6%.'
      }
    ],
    shapFactors: [
      {
        feature: 'Maternity Package Rate Inflation',
        impact: 0.42,
        description: 'Billed ₹1,45,000 vs standard ceiling ₹95,000',
        direction: 'increases_risk'
      }
    ],
    items: [
      {
        code: '59510',
        name: 'Cesarean Delivery Surgical OT Package',
        quantity: 1,
        unitPrice: 85000,
        totalPrice: 85000,
        maxAllowedRate: 65000,
        isExceeded: true,
        category: 'Surgical Procedure'
      },
      {
        code: 'LUX-SUITE',
        name: 'Deluxe Birthing Suite Surcharge',
        quantity: 3,
        unitPrice: 20000,
        totalPrice: 60000,
        maxAllowedRate: 30000,
        isExceeded: true,
        category: 'Room / Bed Charges'
      }
    ],
    adjudicationHistory: [
      {
        id: 'ADJ-103',
        action: 'RFI - Request Clinical & Tariff Records',
        timestamp: '2026-06-09 14:10:00',
        actor: 'investigator.sethi@claimguard-insurance.com',
        note: 'RFI dispatched to hospital compliance desk regarding ₹50,000 excess maternity charge.',
        resultingStatus: 'rfi_requested',
        complianceHash: 'SHA256:77fa8109ca90012e541b'
      }
    ]
  }
];

export const INITIAL_RULES: PolicyRule[] = [
  {
    id: 'R-01',
    code: 'RULE-PRICE-01',
    name: 'Statutory Hospital Price Ceiling Enforcement',
    category: 'Price Ceiling & Tariff',
    severity: 'CRITICAL',
    description: 'Enforces statutory maximum price ceilings based on whether the hospital is Government or Private (Tiers 1/2/3). Automatically disallows excessive procedure surcharges.',
    status: 'active',
    violationCount: 124,
    enforcedBy: 'Statutory Mandate (IRDAI/NHA)'
  },
  {
    id: 'R-02',
    code: 'RULE-GOV-01',
    name: 'Government Hospital Zero-Surprise Tariff Audit',
    category: 'Price Ceiling & Tariff',
    severity: 'CRITICAL',
    description: 'Verifies that public and government-run facilities adhere strictly to CGHS and Ayushman Bharat subsidized rate schedules with zero unauthorized consumable billing.',
    status: 'active',
    violationCount: 18,
    enforcedBy: 'Statutory Mandate (IRDAI/NHA)'
  },
  {
    id: 'R-03',
    code: 'RULE-DUP-01',
    name: 'Cryptographic Duplicate Collision Detector',
    category: 'Duplicate Billing',
    severity: 'CRITICAL',
    description: 'Detects exact and near-exact duplicate billing collisions using patient ID, CPT code, date of service, and provider hash cross-matching.',
    status: 'active',
    violationCount: 76,
    enforcedBy: 'Deterministic Algorithm'
  },
  {
    id: 'R-04',
    code: 'RULE-NCCI-04',
    name: 'NCCI Surgical Component Unbundling Checker',
    category: 'Unbundling (NCCI)',
    severity: 'HIGH',
    description: 'Flags procedures billed as distinct itemized charges that are medically and contractually bundled into the primary operative code.',
    status: 'active',
    violationCount: 92,
    enforcedBy: 'Deterministic Algorithm'
  },
  {
    id: 'R-05',
    code: 'RULE-UPCODE-01',
    name: 'Acuity Discordance & Level-5 Upcoding Filter',
    category: 'Medical Necessity',
    severity: 'CRITICAL',
    description: 'Compares diagnosis severity against billed E&M/ICU intensity codes to prevent non-critical cases from claiming high-acuity reimbursement.',
    status: 'active',
    violationCount: 51,
    enforcedBy: 'Peer Norm Isolation Forest'
  },
  {
    id: 'R-06',
    code: 'RULE-DEMO-01',
    name: 'Demographic & Anatomical Incompatibility Matrix',
    category: 'Demographic Contradiction',
    severity: 'CRITICAL',
    description: 'Screens for gender or age anatomically impossible medical procedures (e.g. prostatectomy in female patients, neonatal ICU in adult patients).',
    status: 'active',
    violationCount: 9,
    enforcedBy: 'Deterministic Algorithm'
  },
  {
    id: 'R-07',
    code: 'RULE-FREQ-01',
    name: 'Provider Daily Velocity & Over-utilization Spike',
    category: 'Provider Frequency',
    severity: 'HIGH',
    description: 'Monitors statistical z-score outliers for high-cost diagnostic modalities (e.g. 5+ MRIs or CT scans for single outpatient episode).',
    status: 'active',
    violationCount: 38,
    enforcedBy: 'Peer Norm Isolation Forest'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'LOG-9901',
    timestamp: '2026-06-12 10:14:22',
    claimId: 'CLM-3104',
    claim: INITIAL_CLAIMS[5],
    action: 'Approve Claim & Release Payment',
    category: 'approval_dismissal',
    actor: 'investigator.sethi@claimguard-insurance.com',
    resultingStatus: 'approved_clean',
    riskScore: 4,
    complianceHash: 'SHA256:4fe8c991a003bf478120b66a98e21f4503714b89c7d812',
    note: 'Government hospital claim verified. 100% compliant with public subsidized rate schedules. Clean reimbursement sanctioned.',
    hospitalName: 'Victoria Government District Civil Hospital',
    hospitalType: 'government',
    excessDisallowed: 0
  },
  {
    id: 'LOG-9902',
    timestamp: '2026-06-11 16:30:00',
    claimId: 'CLM-2019',
    claim: INITIAL_CLAIMS[6],
    action: 'Approve Claim & Release Payment',
    category: 'approval_dismissal',
    actor: 'investigator.sethi@claimguard-insurance.com',
    resultingStatus: 'approved_clean',
    riskScore: 16,
    complianceHash: 'SHA256:88bc2100e479aa5190b3c104e7682910bb47881c2d3a',
    note: 'Private multi-specialty facility claim adheres to Urban Tier 2 tariff schedule. Approved.',
    hospitalName: 'MedStar Care Hospital',
    hospitalType: 'private',
    excessDisallowed: 0
  },
  {
    id: 'LOG-9903',
    timestamp: '2026-06-09 14:10:00',
    claimId: 'CLM-1108',
    claim: INITIAL_CLAIMS[7],
    action: 'RFI - Request Clinical & Tariff Records',
    category: 'rfi_request',
    actor: 'investigator.sethi@claimguard-insurance.com',
    resultingStatus: 'rfi_requested',
    riskScore: 82,
    complianceHash: 'SHA256:77fa8109ca90012e541be89721ac6d003921bf3290e2',
    note: 'Maternity pricing exceeded statutory private ceiling by ₹50,000. Formal RFI inquiry dispatched to hospital desk.',
    hospitalName: 'Apex Multispecialty Hospital',
    hospitalType: 'private',
    excessDisallowed: 50000
  }
];
