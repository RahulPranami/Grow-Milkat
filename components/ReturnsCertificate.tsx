
import React, { useRef } from 'react';
import { ReturnRecord, Investor, Opportunity, Partner } from '../types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ReturnsCertificateProps {
  returnRecord: ReturnRecord;
  investor: Investor;
  opportunity?: Opportunity;
  partner?: Partner;
  issueDate: string;
  logo?: string;
  ownerSignature?: string;
  investmentAmount?: number;
}

const ReturnsCertificate: React.FC<ReturnsCertificateProps> = ({
  returnRecord,
  investor,
  opportunity,
  partner,
  issueDate,
  logo,
  ownerSignature,
  investmentAmount
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const downloadPDF = async () => {
    if (!certificateRef.current || isGenerating) return;
    
    setIsGenerating(true);
    
    try {
      const element = certificateRef.current;
      
      // Wait a tiny bit for any layout to settle
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(element, {
        scale: 3, // High resolution
        useCORS: true,
        backgroundColor: '#FAF6EE',
        logging: false,
        allowTaint: true,
        // Explicitly set dimensions to capture full content
        width: 820,
        height: element.offsetHeight || 1100,
        onclone: (clonedDoc) => {
          // 1. Remove watermark entirely from the clone
          const watermark = clonedDoc.querySelector('[data-watermark="true"]');
          if (watermark) watermark.remove();
          
          // 2. Replace ALL gradients with solid colors to avoid 'createPattern' errors
          const all = clonedDoc.querySelectorAll('*');
          all.forEach(el => {
            if (el instanceof HTMLElement) {
              const bg = el.style.background || '';
              const bgImg = el.style.backgroundImage || '';
              if (bg.includes('gradient') || bgImg.includes('gradient')) {
                // Determine a safe solid color replacement
                if (bg.includes('#1A1610') || bg.includes('#2C2416')) {
                  el.style.background = '#1A1610';
                } else if (bg.includes('#2A3A1A') || bg.includes('#1E2C12')) {
                  el.style.background = '#2A3A1A';
                } else if (bg.includes('#3A7A1A') || bg.includes('#72C437')) {
                  el.style.background = '#3A7A1A';
                } else if (bg.includes('#C9A84C') || bg.includes('#E8C97A')) {
                  el.style.background = '#C9A84C';
                } else {
                  el.style.background = '#D4B96A';
                }
                el.style.backgroundImage = 'none';
              }
            }
          });

          // 3. Clean up the main certificate element
          const clonedElement = clonedDoc.getElementById(`returns-certificate-${returnRecord.id}`);
          if (clonedElement) {
            clonedElement.style.boxShadow = 'none';
            clonedElement.style.transform = 'none';
            clonedElement.style.margin = '0';
          }
        }
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [820, canvas.height / 3]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, 820, canvas.height / 3);
      pdf.save(`Grow_Milkat_Returns_Certificate_${returnRecord.id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '20px 0' }}>
      <button 
        onClick={downloadPDF}
        disabled={isGenerating}
        style={{
          padding: '12px 28px',
          background: isGenerating ? '#4A4A4A' : 'linear-gradient(135deg, #1A1610 0%, #2C2416 100%)',
          color: '#E8C97A',
          border: '1px solid #D4B96A',
          borderRadius: '8px',
          cursor: isGenerating ? 'not-allowed' : 'pointer',
          fontWeight: 700,
          fontSize: '15px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          transition: 'all 0.2s ease',
          opacity: isGenerating ? 0.8 : 1
        }}
      >
        <span>{isGenerating ? '⏳' : '📥'}</span> 
        {isGenerating ? 'Generating Full View PDF...' : 'Download Full View PDF'}
      </button>

      <div 
        id={`returns-certificate-${returnRecord.id}`}
        ref={certificateRef}
        style={{
          width: '820px',
          backgroundColor: '#FAF6EE',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 80px rgba(0,0,0,0.35), 0 4px 20px rgba(0,0,0,0.2)',
          fontFamily: "'DM Sans', sans-serif",
          padding: '0',
          margin: '0',
          color: '#1A1610'
        }}
      >
      {/* Ornate outer border */}
      <div style={{
        position: 'absolute',
        inset: '12px',
        border: '1.5px solid #C9A84C',
        pointerEvents: 'none',
        zIndex: 10
      }} />
      <div style={{
        position: 'absolute',
        inset: '17px',
        border: '0.5px solid #E8C97A',
        pointerEvents: 'none',
        zIndex: 10
      }} />

      {/* Background watermark pattern */}
      <div 
        data-watermark="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            repeating-linear-gradient(45deg, transparent, transparent 60px, rgba(201,168,76,0.04) 60px, rgba(201,168,76,0.04) 61px),
            repeating-linear-gradient(-45deg, transparent, transparent 60px, rgba(201,168,76,0.04) 60px, rgba(201,168,76,0.04) 61px)
          `,
          zIndex: 0
        }} 
      />

      <div style={{
        position: 'relative',
        zIndex: 2,
        padding: '50px 60px 50px'
      }}>
        {/* HEADER */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '28px',
          borderBottom: '1px solid #D4B96A',
          marginBottom: '28px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {logo ? (
              <img src={logo} alt="Grow Milkat Logo" style={{ height: '52px', objectFit: 'contain' }} referrerPolicy="no-referrer" />
            ) : (
              <div 
                data-gradient="true"
                style={{
                  width: '52px',
                  height: '52px',
                  background: 'linear-gradient(135deg, #C9A84C 0%, #E8C97A 100%)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  boxShadow: '0 4px 14px rgba(201,168,76,0.4)'
                }}
              >
                🏠
              </div>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#5A4A2A', marginBottom: '4px' }}>In Partnership With</div>
            <div style={{ border: '1px dashed #D4B96A', padding: '8px 16px', minWidth: '180px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: '#F5E9C8', borderRadius: '4px' }}>
              {(partner?.logo || opportunity?.partnerLogoUrl) && (
                <img src={partner?.logo || opportunity?.partnerLogoUrl} alt="Partner Logo" style={{ height: '28px', maxWidth: '80px', objectFit: 'contain' }} referrerPolicy="no-referrer" />
              )}
              <span style={{ fontSize: '12px', color: '#1A1610', fontWeight: 600, fontStyle: 'italic' }}>{partner?.legalCompanyName || opportunity?.partnerName || '[Partner Name]'}</span>
            </div>
          </div>
        </div>

        {/* TITLE BANNER */}
        <div data-gradient="true" style={{ background: 'linear-gradient(135deg, #1A1610 0%, #2C2416 100%)', margin: '0 -60px', padding: '22px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden', marginBottom: '30px' }}>
          <div style={{ fontSize: '9px', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#FFFFFF', marginBottom: '6px', position: 'relative' }}>Official Document · 2026</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.06em', position: 'relative', margin: 0 }}>
            <span style={{ color: '#C9A84C', margin: '0 12px' }}>⸻</span>
            <span style={{ color: '#FFFFFF' }}>Investment Returns</span> Certificate
            <span style={{ color: '#C9A84C', margin: '0 12px' }}>⸻</span>
          </h1>
        </div>

        {/* META ROW */}
        <div style={{ display: 'flex', marginBottom: '26px', border: '1px solid #D4B96A', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ flex: 1, padding: '12px 18px', borderRight: '1px solid #D4B96A', background: '#FFFFFF' }}>
            <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#5A4A2A', marginBottom: '4px' }}>📜 Certificate ID</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1610' }}>{returnRecord.id}</div>
          </div>
          <div style={{ flex: 1, padding: '12px 18px', borderRight: '1px solid #D4B96A', background: '#FFFFFF' }}>
            <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#5A4A2A', marginBottom: '4px' }}>📅 Issue Date</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1610' }}>{issueDate}</div>
          </div>
          <div style={{ flex: 1, padding: '12px 18px', borderRight: '1px solid #D4B96A', background: '#FFFFFF' }}>
            <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#5A4A2A', marginBottom: '4px' }}>📍 Location</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1610' }}>{opportunity?.location || 'N/A'}</div>
          </div>
          <div style={{ flex: 1, padding: '12px 18px', background: '#FFFFFF' }}>
            <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#5A4A2A', marginBottom: '4px' }}>🏛 Partner</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1610' }}>{partner?.legalCompanyName || opportunity?.partnerName || 'N/A'}</div>
          </div>
        </div>

        {/* TWO COLUMN */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '22px' }}>
          {/* Investor Details */}
          <div style={{ background: '#FFFFFF', border: '1px solid #D4B96A', borderRadius: '8px', overflow: 'hidden' }}>
            <div data-gradient="true" style={{ background: 'linear-gradient(90deg, #1A1610 0%, #2C2416 100%)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px' }}>👤</span>
              <span style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#FFFFFF', fontWeight: 600 }}>Investor Details</span>
            </div>
            <div style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px dotted rgba(201,168,76,0.3)' }}>
                <span style={{ fontSize: '11px', color: '#5A4A2A' }}>Full Name</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#1A1610' }}>{investor.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px dotted rgba(201,168,76,0.3)' }}>
                <span style={{ fontSize: '11px', color: '#5A4A2A' }}>Asset Name</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#1A1610' }}>{returnRecord.investmentTitle}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px dotted rgba(201,168,76,0.3)' }}>
                <span style={{ fontSize: '11px', color: '#5A4A2A' }}>Asset ID</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#1A1610' }}>{opportunity?.assetID || returnRecord.investmentId}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px dotted rgba(201,168,76,0.3)' }}>
                <span style={{ fontSize: '11px', color: '#5A4A2A' }}>Asset Ownership %</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#1A1610' }}>
                  {opportunity && investmentAmount ? ((investmentAmount / opportunity.targetAmount) * 100).toFixed(4) : 
                   opportunity ? ((returnRecord.amount / opportunity.targetAmount) * 100).toFixed(4) : 'N/A'} %
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '7px 0' }}>
                <span style={{ fontSize: '11px', color: '#5A4A2A' }}>Return Type</span>
                <span style={{ background: '#F5E9C8', border: '1px solid #D4B96A', padding: '2px 8px', borderRadius: '20px', fontSize: '10px', color: '#5A4A2A', fontWeight: 600 }}>{returnRecord.type}</span>
              </div>
            </div>
          </div>

          {/* Returns Details */}
          <div style={{ background: '#FFFFFF', border: '1px solid #D4B96A', borderRadius: '8px', overflow: 'hidden' }}>
            <div data-gradient="true" style={{ background: 'linear-gradient(90deg, #2A3A1A 0%, #1E2C12 100%)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px' }}>💰</span>
              <span style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#FFFFFF', fontWeight: 600 }}>Returns Details</span>
            </div>
            <div style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px dotted rgba(201,168,76,0.3)' }}>
                <span style={{ fontSize: '11px', color: '#5A4A2A' }}>Investment Amount</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#1A1610' }}>$ {investmentAmount?.toLocaleString() || opportunity?.minInvestment.toLocaleString() || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px dotted rgba(201,168,76,0.3)' }}>
                <span style={{ fontSize: '11px', color: '#5A4A2A' }}>Holding Period</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#1A1610' }}>{opportunity?.holdingPeriod || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px dotted rgba(201,168,76,0.3)' }}>
                <span style={{ fontSize: '11px', color: '#5A4A2A' }}>Payout Cadence</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#1A1610' }}>{opportunity?.payoutFrequency || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px dotted rgba(201,168,76,0.3)' }}>
                <span style={{ fontSize: '11px', color: '#5A4A2A' }}>Net Return Paid</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#3A6B1A' }}>$ {returnRecord.amount.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '7px 0' }}>
                <span style={{ fontSize: '11px', color: '#5A4A2A' }}>Payout Date</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#1A1610' }}>{returnRecord.date}</span>
              </div>
            </div>
          </div>
        </div>

        {/* PERFORMANCE SUMMARY */}
        <div style={{ background: '#FFFFFF', border: '1px solid #D4B96A', borderRadius: '8px', overflow: 'hidden', marginBottom: '22px' }}>
          <div data-gradient="true" style={{ background: 'linear-gradient(90deg, #2A3A1A 0%, #1E2C12 100%)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>📊</span>
            <span style={{ fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#FFFFFF', fontWeight: 700 }}>Performance Summary</span>
          </div>
          <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px 30px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#5A4A2A', fontWeight: 600 }}>Dividend Yield (%)</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: 800, color: '#1A1610', lineHeight: 1 }}>{opportunity?.dividendPercentage ? `${opportunity.dividendPercentage}%` : 'N/A'}</span>
              <div style={{ height: '8px', background: '#EEE5CE', borderRadius: '99px', overflow: 'hidden', marginTop: '4px' }}>
                <div data-gradient="true" style={{ height: '100%', borderRadius: '99px', background: 'linear-gradient(90deg, #C9A84C 0%, #E8C97A 100%)', width: opportunity?.dividendPercentage ? `${Math.min(opportunity.dividendPercentage * 5, 100)}%` : '0%' }}></div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#5A4A2A', fontWeight: 600 }}>ROI Percentage (%)</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: 800, color: '#3A7A1A', lineHeight: 1 }}>{opportunity?.roiPercentage ? `${opportunity.roiPercentage}%` : 'N/A'}</span>
              <div style={{ height: '8px', background: '#EEE5CE', borderRadius: '99px', overflow: 'hidden', marginTop: '4px' }}>
                <div data-gradient="true" style={{ height: '100%', borderRadius: '99px', background: 'linear-gradient(90deg, #3A7A1A 0%, #72C437 100%)', width: opportunity?.roiPercentage ? `${Math.min(opportunity.roiPercentage * 5, 100)}%` : '0%' }}></div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#5A4A2A', fontWeight: 600 }}>Rent (%)</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: 800, color: '#C9A84C', lineHeight: 1 }}>{opportunity?.rentPercentage ? `${opportunity.rentPercentage}%` : 'N/A'}</span>
              <div style={{ height: '8px', background: '#EEE5CE', borderRadius: '99px', overflow: 'hidden', marginTop: '4px' }}>
                <div data-gradient="true" style={{ height: '100%', borderRadius: '99px', background: 'linear-gradient(90deg, #C9A84C 0%, #E8C97A 100%)', width: opportunity?.rentPercentage ? `${Math.min(opportunity.rentPercentage * 5, 100)}%` : '0%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* DECLARATION */}
        <div style={{ background: '#FFFFFF', border: '1px solid #D4B96A', borderRadius: '8px', overflow: 'hidden', marginBottom: '22px' }}>
          <div data-gradient="true" style={{ background: 'linear-gradient(90deg, #1A1610 0%, #2C2416 100%)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px' }}>📜</span>
            <span style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#FFFFFF', fontWeight: 600 }}>Declaration</span>
          </div>
          <div style={{ padding: '16px 20px' }}>
            <p style={{ fontSize: '12px', color: '#5A4A2A', lineHeight: '1.7', marginBottom: '12px', margin: 0 }}>
              This is to certify that the above-mentioned investor has received returns generated from
              the specified asset under <strong>Grow Milkat</strong>. Accordingly:
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '7px', padding: 0, marginTop: '12px' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '12px', color: '#1A1610', lineHeight: '1.5' }}>
                <span style={{ color: '#C9A84C', fontSize: '10px', marginTop: '3px' }}>✦</span>
                Returns are distributed based on asset performance and agreed investment model.
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '12px', color: '#1A1610', lineHeight: '1.5' }}>
                <span style={{ color: '#C9A84C', fontSize: '10px', marginTop: '3px' }}>✦</span>
                Ownership of shares remains <strong>unchanged</strong> (unless separately transferred or withdrawn).
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '12px', color: '#1A1610', lineHeight: '1.5' }}>
                <span style={{ color: '#C9A84C', fontSize: '10px', marginTop: '3px' }}>✦</span>
                This payout does <strong>not guarantee</strong> future returns.
              </li>
            </ul>
          </div>
        </div>

        {/* TERMS */}
        <div style={{ background: '#F5E9C8', border: '1px solid #D4B96A', borderRadius: '8px', padding: '14px 20px', marginBottom: '22px' }}>
          <div style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#5A4A2A', fontWeight: 600, marginBottom: '10px' }}>📜 Terms & Conditions Summary</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '11px', color: '#5A4A2A', lineHeight: '1.5' }}>
              <span style={{ color: '#C9A84C', fontSize: '7px', marginTop: '4px' }}>◆</span>
              Returns are subject to market performance and asset income
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '11px', color: '#5A4A2A', lineHeight: '1.5' }}>
              <span style={{ color: '#C9A84C', fontSize: '7px', marginTop: '4px' }}>◆</span>
              Payments are processed as per the selected distribution cycle
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '11px', color: '#5A4A2A', lineHeight: '1.5' }}>
              <span style={{ color: '#C9A84C', fontSize: '7px', marginTop: '4px' }}>◆</span>
              Applicable fees, taxes, and charges may be deducted
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '11px', color: '#5A4A2A', lineHeight: '1.5' }}>
              <span style={{ color: '#C9A84C', fontSize: '7px', marginTop: '4px' }}>◆</span>
              This certificate is a summary and subject to the Investment Agreement
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '11px', color: '#5A4A2A', lineHeight: '1.5' }}>
              <span style={{ color: '#C9A84C', fontSize: '7px', marginTop: '4px' }}>◆</span>
              Disputes are governed by applicable legal agreements
            </div>
          </div>
        </div>

        {/* SIGNATURES SECTION */}
        <div style={{ marginBottom: '10px' }}>
          <div style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#5A4A2A', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span data-gradient="true" style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, transparent, #D4B96A)' }}></span>
            <span>Signatures Section</span>
            <span data-gradient="true" style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, #D4B96A, transparent)' }}></span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          {/* 1. Asset Partner Signature */}
          <div style={{ background: '#FFFFFF', border: '1px solid #D4B96A', borderRadius: '8px', padding: '16px 20px', textAlign: 'center', position: 'relative' }}>
            <div style={{ height: '54px', borderBottom: '1.5px solid #D4B96A', marginBottom: '10px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '6px', position: 'relative' }}>
              {partner?.team?.find(m => m.signature)?.signature ? (
                <img src={partner.team.find(m => m.signature)?.signature} alt="Partner Signature" style={{ maxHeight: '48px', objectFit: 'contain' }} referrerPolicy="no-referrer" />
              ) : (
                <span style={{ fontStyle: 'italic', fontSize: '13px', color: 'rgba(90,74,42,0.3)', fontFamily: "'Playfair Display', serif" }}>Signature:</span>
              )}
              
              {/* Partner Stamp */}
              {partner?.stampLogos?.[0] && (
                <div style={{ position: 'absolute', right: '-10px', bottom: '10px', opacity: 0.8, transform: 'rotate(-15deg)' }}>
                  <img src={partner.stampLogos[0]} alt="Partner Stamp" style={{ width: '60px', height: '60px', objectFit: 'contain' }} referrerPolicy="no-referrer" />
                </div>
              )}
            </div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#1A1610', marginBottom: '2px' }}>AUTHORIZED SIGNATORY</div>
            <div style={{ fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5A4A2A' }}>{partner?.legalCompanyName || opportunity?.partnerName || 'ASSET PARTNER / OPERATOR'}</div>
          </div>

          {/* 2. Grow Milkat Signature */}
          <div style={{ background: '#FFFFFF', border: '1px solid #D4B96A', borderRadius: '8px', padding: '16px 20px', textAlign: 'center' }}>
            <div style={{ height: '54px', borderBottom: '1.5px solid #D4B96A', marginBottom: '10px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '6px' }}>
              {ownerSignature ? (
                <img src={ownerSignature} alt="Grow Milkat Signature" style={{ maxHeight: '48px', objectFit: 'contain' }} referrerPolicy="no-referrer" />
              ) : (
                <span style={{ fontStyle: 'italic', fontSize: '13px', color: 'rgba(90,74,42,0.3)', fontFamily: "'Playfair Display', serif" }}>Signature:</span>
              )}
            </div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#1A1610', marginBottom: '2px' }}>Authorized Signatory{'{Grow Milkat}'}</div>
            <div style={{ fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5A4A2A' }}>Grow Milkat Platform Representative</div>
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ borderTop: '1px solid #D4B96A', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '10px', color: '#5A4A2A', fontStyle: 'italic' }}>
            All terms and conditions are applicable as per the<br />
            <strong>Grow Milkat Platform 2026.</strong>
          </div>
          <div style={{
            width: '64px',
            height: '64px',
            border: '2px solid #C9A84C',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <div style={{ position: 'absolute', inset: '4px', border: '1px solid #E8C97A', borderRadius: '50%' }} />
            <div style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.1em', textAlign: 'center', color: '#C9A84C', lineHeight: '1.3' }}>GROW<br />MILKAT<br />✦</div>
          </div>
          <div style={{ fontSize: '10px', color: '#5A4A2A', textAlign: 'right' }}>
            Verified & Issued by<br />
            <strong>Grow Milkat Platform</strong>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsCertificate;
