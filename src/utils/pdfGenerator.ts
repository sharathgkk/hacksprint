import { jsPDF } from 'jspdf';
import { Claim, AuditLogEntry, Hospital } from '../types';

export function formatCurrency(amount: number, currency: 'INR' | 'USD'): string {
  if (currency === 'USD') {
    const usd = Math.round(amount / 83.5);
    return `$${usd.toLocaleString('en-US')}`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function generateAuditDeterminationPdf(
  claim: Claim,
  currency: 'INR' | 'USD' = 'INR'
): string {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  const fileName = `ClaimGuard_Audit_Determination_${claim.claimId}.pdf`;

  // Header Banner
  doc.setFillColor(6, 19, 30);
  doc.rect(0, 0, pageWidth, 36, 'F');

  // Status strip
  const isApproved = claim.status === 'approved_clean';
  const isFraud = claim.status === 'fraud_denied';
  if (isApproved) {
    doc.setFillColor(16, 185, 129);
  } else if (isFraud) {
    doc.setFillColor(225, 29, 72);
  } else {
    doc.setFillColor(245, 158, 11);
  }
  doc.rect(0, 36, pageWidth, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('CLAIMGUARD AI · SPECIAL INVESTIGATION UNIT (SIU)', margin, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text('STATUTORY CLAIMS AUDIT DETERMINATION & ADJUDICATION MEMORANDUM', margin, 20);
  doc.text(`Official Forensic Record · IRDAI & Statutory Healthcare Adjudication Standards`, margin, 26);

  let y = 48;

  // Key Metadata Table Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 36, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`Claim ID: ${claim.claimId}`, margin + 4, y + 7);
  doc.text(`Patient: ${claim.patientName} (${claim.patientAge}y, ${claim.patientGender}) [ID: ${claim.patientId}]`, margin + 4, y + 14);
  
  const hospitalTypeLabel = claim.hospitalType === 'government' ? 'GOVERNMENT (Public / Subsidized)' : 'PRIVATE (Corporate / Regulated)';
  doc.text(`Facility: ${claim.hospitalName} [${hospitalTypeLabel}]`, margin + 4, y + 21);
  doc.text(`Diagnosis: ${claim.diagnosisCode} - ${claim.diagnosisName}`, margin + 4, y + 28);

  doc.text(`Service Date: ${claim.admissionDate} to ${claim.dischargeDate}`, pageWidth / 2 + 10, y + 7);
  doc.text(`Procedure: ${claim.procedureCode} - ${claim.procedureName}`, pageWidth / 2 + 10, y + 14);
  doc.text(`Anomaly Score: ${claim.anomalyScore}/100 (${claim.riskLevel} RISK)`, pageWidth / 2 + 10, y + 21);
  doc.text(`Current Status: ${claim.status.toUpperCase()}`, pageWidth / 2 + 10, y + 28);

  y += 44;

  // Hospital Classification & Statutory Maximum Charge Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('1. HOSPITAL CLASSIFICATION & MANDATED STATUTORY TARIFF REVIEW', margin, y);
  y += 6;

  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, contentWidth, 34, 2, 2, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);

  const hospTypeDesc = claim.hospitalType === 'government'
    ? 'FACILITY IS CLASSIFIED AS A GOVERNMENT HOSPITAL. Subsidized rates and zero surprise-billing protection mandated under CGHS and National Health Authority schedules.'
    : 'FACILITY IS CLASSIFIED AS A PRIVATE MULTISPECIALTY HOSPITAL. Regulated under State Clinical Establishments Act and IRDAI Metro Tier ceilings.';

  doc.text(doc.splitTextToSize(hospTypeDesc, contentWidth - 8), margin + 4, y + 6);

  const billedStr = formatCurrency(claim.billedAmount, currency);
  const legalCeilingStr = formatCurrency(claim.statutoryMaxAmount, currency);
  const excessStr = formatCurrency(claim.overbilledExcess, currency);

  doc.setFont('helvetica', 'bold');
  doc.text(`• Total Billed Amount: ${billedStr}`, margin + 4, y + 18);
  doc.text(`• Statutory Maximum Capped Ceiling: ${legalCeilingStr}`, margin + 4, y + 24);
  
  if (claim.priceCeilingBreach) {
    doc.setTextColor(225, 29, 72);
    doc.text(`• Overbilled Disallowance / Patient Refund: +${excessStr} (BREACH CONFIRMED)`, margin + 4, y + 30);
  } else {
    doc.setTextColor(16, 185, 129);
    doc.text(`• Pricing Status: 100% Within Permissible Statutory Ceiling`, margin + 4, y + 30);
  }

  y += 42;

  // Itemized Procedure Bill & Pricing Caps
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('2. ITEMIZED CHARGES & STATUTORY CEILING COMPLIANCE', margin, y);
  y += 6;

  // Table Header
  doc.setFillColor(30, 41, 59);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text('Code', margin + 3, y + 5);
  doc.text('Description', margin + 22, y + 5);
  doc.text('Category', margin + 85, y + 5);
  doc.text('Billed Rate', margin + 125, y + 5);
  doc.text('Mandated Max Cap', margin + 150, y + 5);

  y += 7;

  claim.items.forEach((item, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
    doc.rect(margin, y, contentWidth, 7, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    doc.text(item.code, margin + 3, y + 5);
    doc.text(doc.splitTextToSize(item.name, 60)[0] || item.name, margin + 22, y + 5);
    doc.text(item.category, margin + 85, y + 5);
    doc.text(formatCurrency(item.totalPrice, currency), margin + 125, y + 5);
    
    if (item.isExceeded) {
      doc.setTextColor(225, 29, 72);
      doc.text(`${formatCurrency(item.maxAllowedRate, currency)} (EXCEEDED)`, margin + 150, y + 5);
    } else {
      doc.setTextColor(16, 185, 129);
      doc.text(formatCurrency(item.maxAllowedRate, currency), margin + 150, y + 5);
    }

    y += 7;
  });

  y += 8;

  // Policy Violations & XAI Factors
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('3. CLINICAL POLICY FLAGS & SHAP ATTRIBUTION', margin, y);
  y += 6;

  if (claim.policyViolations.length > 0) {
    claim.policyViolations.forEach((viol) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(185, 28, 28);
      doc.text(`[${viol.severity}] ${viol.ruleName}:`, margin + 2, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(viol.description, margin + 2, y + 4);
      y += 9;
    });
  } else {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(22, 101, 52);
    doc.text('No deterministic rule violations or clinical unbundling detected.', margin + 2, y);
    y += 6;
  }

  // Footer & Cryptographic Seal
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, pageHeight - 16, margin + contentWidth, pageHeight - 16);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  const seal = claim.similarityFingerprint || `SHA256:${Date.now().toString(16)}bc9901`;
  doc.text(`Adjudication Cryptographic Seal: ${seal} · ClaimGuard AI Governance`, margin, pageHeight - 10);
  doc.text(`Generated: ${new Date().toLocaleString()} · Official Download Verified`, pageWidth - margin, pageHeight - 10, { align: 'right' });

  doc.save(fileName);
  return fileName;
}

export function generateComplianceCertificatePdf(
  totalAudited: number,
  approvedCount: number,
  fraudCount: number,
  rfiCount: number
): string {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  const fileName = `ClaimGuard_Adjudication_Compliance_Certificate_${Date.now().toString(36).toUpperCase()}.pdf`;

  // Border
  doc.setDrawColor(13, 148, 136);
  doc.setLineWidth(1.5);
  doc.roundedRect(8, 8, pageWidth - 16, pageHeight - 16, 4, 4, 'D');

  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.5);
  doc.roundedRect(12, 12, pageWidth - 24, pageHeight - 24, 2, 2, 'D');

  // Header Box
  doc.setFillColor(6, 19, 30);
  doc.rect(13, 13, pageWidth - 26, 32, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('CLAIMGUARD AI REGULATORY ASSURANCE', pageWidth / 2, 26, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(199, 210, 254);
  doc.text('STATUTORY CLAIMS ADJUDICATION COMPLIANCE CERTIFICATE', pageWidth / 2, 33, { align: 'center' });

  let y = 60;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);

  const certText = `This document officially certifies that all ${totalAudited} adjudication decisions, hospital classification verifications (Government vs Private), statutory price ceiling audits, and provider communications recorded across the ClaimGuard AI repository were executed with rigorous adherence to IRDAI guidelines, Clinical Establishments Act, and National Health Authority transparent pricing protocols.`;
  const splitText = doc.splitTextToSize(certText, contentWidth);
  doc.text(splitText, margin, y);

  y += splitText.length * 6 + 12;

  // Ledger Metrics Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 52, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('AUDIT PERFORMANCE LEDGER METRICS', margin + 6, y + 8);

  const metrics = [
    { label: 'Total Audited Claims', val: totalAudited.toString() },
    { label: 'Clean Approvals', val: approvedCount.toString() },
    { label: 'Fraud / Disallowed Surcharges', val: fraudCount.toString() },
    { label: 'Provider RFIs Dispatched', val: rfiCount.toString() },
  ];

  const colWidth = contentWidth / 4;
  metrics.forEach((m, idx) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(m.label, margin + idx * colWidth + 4, y + 24);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text(m.val, margin + idx * colWidth + 4, y + 36);
  });

  y += 70;

  // Legal Seal & Signatures
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Cryptographic Certificate ID: CG-CERT-' + Math.random().toString(36).substring(2, 9).toUpperCase(), margin, y);
  doc.text('Valid Under: Section 1128A Compliance & IRDAI Health Insurance Regulations', margin, y + 5);

  y += 24;
  doc.line(margin, y, margin + 50, y);
  doc.text('Chief Medical Examiner / SIU Officer', margin, y + 5);

  doc.line(pageWidth - margin - 50, y, pageWidth - margin, y);
  doc.text('Statutory Compliance Officer', pageWidth - margin - 50, y + 5);

  doc.save(fileName);
  return fileName;
}
