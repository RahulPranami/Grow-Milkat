
import React from 'react';
import { WithdrawalRecord, Investor, Opportunity, Partner } from '../types';

interface ReturnWithdrawalCertificateProps {
  withdrawal: WithdrawalRecord;
  investor: Investor;
  opportunity?: Opportunity;
  partner?: Partner;
  issueDate: string;
  logo?: string;
  ownerSignature?: string;
}

const ReturnWithdrawalCertificate: React.FC<ReturnWithdrawalCertificateProps> = ({
  withdrawal,
  investor,
  opportunity,
  partner,
  issueDate,
  logo,
  ownerSignature
}) => {
  return (
    <div 
      id={`return-withdrawal-certificate-${withdrawal.id}`}
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
      }} />

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
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 700, color: '#1A1610', letterSpacing: '0.03em', lineHeight: 1 }}>Grow Milkat</span>
              <span style={{ fontSize: '10px', color: '#5A4A2A', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: '3px' }}>Real Estate Investment Platform</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#5A4A2A', marginBottom: '4px' }}>In Partnership With</div>
            <div style={{ border: '1px dashed #D4B96A', padding: '8px 16px', minWidth: '160px', minHeight: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5E9C8', borderRadius: '4px' }}>
              <span style={{ fontSize: '11px', color: '#5A4A2A', fontWeight: 'bold' }}>
                {partner?.legalCompanyName || opportunity?.partnerName || withdrawal.partnerName || '[Partner Company Name]'}
              </span>
            </div>
          </div>
        </div>

        {/* TITLE BANNER */}
        <div 
          data-gradient="true"
          style={{
            background: 'linear-gradient(135deg, #1A1610 0%, #2C2416 100%)',
            margin: '0 -60px',
            padding: '22px 60px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '30px'
          }}
        >
          <div style={{ fontSize: '9px', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#E8C97A', marginBottom: '6px', position: 'relative' }}>Official Document · 2026</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.06em', position: 'relative', margin: 0 }}>
            <span style={{ color: '#C9A84C', margin: '0 12px' }}>⸻</span>
            <span style={{ color: '#E8C97A' }}>Return Withdrawal</span> Certificate
            <span style={{ color: '#C9A84C', margin: '0 12px' }}>⸻</span>
          </h1>
        </div>

        {/* META ROW */}
        <div style={{ display: 'flex', marginBottom: '22px', border: '1px solid #D4B96A', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ flex: 1, padding: '12px 18px', borderRight: '1px solid #D4B96A', background: '#FFFFFF' }}>
            <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#5A4A2A', marginBottom: '4px' }}>📜 Certificate ID</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1610' }}>GM-RWC-{withdrawal.id.slice(0, 8).toUpperCase()}</div>
          </div>
          <div style={{ flex: 1, padding: '12px 18px', borderRight: '1px solid #D4B96A', background: '#FFFFFF' }}>
            <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#5A4A2A', marginBottom: '4px' }}>🔖 Withdrawal ID</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1610' }}>{withdrawal.id}</div>
          </div>
          <div style={{ flex: 1, padding: '12px 18px', background: '#FFFFFF' }}>
            <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#5A4A2A', marginBottom: '4px' }}>📅 Date of Issue</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1610' }}>{issueDate}</div>
          </div>
        </div>

        {/* TWO COLUMN */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '18px' }}>
          {/* Investor Details */}
          <div style={{ background: '#FFFFFF', border: '1px solid #D4B96A', borderRadius: '8px', overflow: 'hidden' }}>
            <div 
              data-gradient="true"
              style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(90deg, #1A1610 0%, #2C2416 100%)' }}
            >
              <span style={{ fontSize: '14px' }}>👤</span>
              <span style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E8C97A', fontWeight: 600 }}>Investor Details</span>
            </div>
            <div style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px dotted rgba(201,168,76,0.3)' }}>
                <span style={{ fontSize: '11px', color: '#5A4A2A' }}>Investor Name</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#1A1610' }}>{investor.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '7px 0' }}>
                <span style={{ fontSize: '11px', color: '#5A4A2A' }}>Investor ID</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#1A1610' }}>{investor.investorUniqueId}</span>
              </div>
            </div>
          </div>

          {/* Investment Details */}
          <div style={{ background: '#FFFFFF', border: '1px solid #D4B96A', borderRadius: '8px', overflow: 'hidden' }}>
            <div 
              data-gradient="true"
              style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(90deg, #0D2A3A 0%, #081E2C 100%)' }}
            >
              <span style={{ fontSize: '14px' }}>🏢</span>
              <span style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E8C97A', fontWeight: 600 }}>Investment Details</span>
            </div>
            <div style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px dotted rgba(201,168,76,0.3)' }}>
                <span style={{ fontSize: '11px', color: '#5A4A2A' }}>Asset ID</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#1A1610' }}>{withdrawal.assetID || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px dotted rgba(201,168,76,0.3)' }}>
                <span style={{ fontSize: '11px', color: '#5A4A2A' }}>Asset Name</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#1A1610' }}>{withdrawal.opportunityTitle}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px dotted rgba(201,168,76,0.3)' }}>
                <span style={{ fontSize: '11px', color: '#5A4A2A' }}>Investment Amount</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#C9A84C' }}>${withdrawal.investmentAmount.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px dotted rgba(201,168,76,0.3)' }}>
                <span style={{ fontSize: '11px', color: '#5A4A2A' }}>Ownership</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#1A1610' }}>{opportunity ? ((withdrawal.investmentAmount / opportunity.targetAmount) * 100).toFixed(4) : 'N/A'}%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '7px 0' }}>
                <span style={{ fontSize: '11px', color: '#5A4A2A' }}>ROI Yield (%)</span>
                <span style={{ background: '#EBF5E0', border: '1px solid #A0C878', padding: '2px 8px', borderRadius: '20px', fontSize: '10px', color: '#3A6B1A', fontWeight: 600 }}>{withdrawal.expectedROI}</span>
              </div>
            </div>
          </div>
        </div>

        {/* TWO COLUMN */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '18px' }}>
          {/* Return Details */}
          <div style={{ background: '#FFFFFF', border: '1px solid #D4B96A', borderRadius: '8px', overflow: 'hidden' }}>
            <div 
              data-gradient="true"
              style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(90deg, #2A3A1A 0%, #1E2C12 100%)' }}
            >
              <span style={{ fontSize: '14px' }}>💰</span>
              <span style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E8C97A', fontWeight: 600 }}>Return Details</span>
            </div>
            <div style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px dotted rgba(201,168,76,0.3)' }}>
                <span style={{ fontSize: '11px', color: '#5A4A2A' }}>Return Type</span>
                <span style={{ background: '#FAF6EE', border: '1px solid #D4B96A', padding: '2px 8px', borderRadius: '20px', fontSize: '10px', color: '#5A4A2A', fontWeight: 600 }}>{withdrawal.returnType}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px dotted rgba(201,168,76,0.3)' }}>
                <span style={{ fontSize: '11px', color: '#5A4A2A' }}>Payout Cadence</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#1A1610' }}>{withdrawal.payoutFrequency}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '7px 0' }}>
                <span style={{ fontSize: '11px', color: '#5A4A2A' }}>Total Withdrawal Amount</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#3A6B1A' }}>${withdrawal.withdrawalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Withdrawal Details */}
          <div style={{ background: '#FFFFFF', border: '1px solid #D4B96A', borderRadius: '8px', overflow: 'hidden' }}>
            <div 
              data-gradient="true"
              style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(90deg, #3A2A08 0%, #2C1E04 100%)' }}
            >
              <span style={{ fontSize: '14px' }}>💳</span>
              <span style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E8C97A', fontWeight: 600 }}>Withdrawal Details</span>
            </div>
            <div style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px dotted rgba(201,168,76,0.3)' }}>
                <span style={{ fontSize: '11px', color: '#5A4A2A' }}>Withdrawal Request Date</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#1A1610' }}>{new Date(withdrawal.date).toLocaleDateString()}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px dotted rgba(201,168,76,0.3)' }}>
                <span style={{ fontSize: '11px', color: '#5A4A2A' }}>Processing Timeline</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#1A1610' }}>4–7 Business Days</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '7px 0' }}>
                <span style={{ fontSize: '11px', color: '#5A4A2A' }}>Early Withdrawal Charges</span>
                <span style={{ background: '#FFF3E0', border: '1px solid #FFCC80', padding: '2px 8px', borderRadius: '20px', fontSize: '10px', color: '#E65100', fontWeight: 600 }}>5% (if early)</span>
              </div>
            </div>
          </div>
        </div>

        {/* SUMMARY */}
        <div style={{ background: '#FFFFFF', border: '1px solid #D4B96A', borderRadius: '8px', overflow: 'hidden', marginBottom: '18px' }}>
          <div 
            data-gradient="true"
            style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(90deg, #1A1610 0%, #2C2416 100%)' }}
          >
            <span style={{ fontSize: '14px' }}>📊</span>
            <span style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E8C97A', fontWeight: 600 }}>Summary</span>
          </div>
          <div style={{ padding: '14px 18px' }}>
            <p style={{ fontSize: '12px', color: '#5A4A2A', lineHeight: '1.8', margin: 0 }}>
              This certifies that the investor has requested withdrawal of returns generated from the specified asset
              via the <strong>Grow Milkat</strong> platform. Returns are calculated based on actual asset performance,
              agreed ROI structure, and SPV financial distribution model.
            </p>
          </div>
        </div>

        {/* TERMS & CONDITIONS */}
        <div style={{ background: '#FFFFFF', border: '1px solid #D4B96A', borderRadius: '8px', overflow: 'hidden', marginBottom: '18px' }}>
          <div 
            data-gradient="true"
            style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(90deg, #1A1610 0%, #2C2416 100%)' }}
          >
            <span style={{ fontSize: '14px' }}>📜</span>
            <span style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E8C97A', fontWeight: 600 }}>Terms & Conditions</span>
          </div>
          <div style={{ padding: '14px 18px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 28px' }}>
              <div>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#1A1610', letterSpacing: '0.04em', marginBottom: '5px', paddingBottom: '3px', borderBottom: '1px solid #F5E9C8' }}>Eligibility for Withdrawal</div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '11px', color: '#5A4A2A', lineHeight: '1.55' }}>
                      <span style={{ color: '#C9A84C', fontSize: '7px', marginTop: '4px' }}>◆</span>
                      Return withdrawal is permitted only for <strong>generated returns</strong>.
                    </li>
                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '11px', color: '#5A4A2A', lineHeight: '1.55' }}>
                      <span style={{ color: '#C9A84C', fontSize: '7px', marginTop: '4px' }}>◆</span>
                      Investor must have completed KYC verification.
                    </li>
                  </ul>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#1A1610', letterSpacing: '0.04em', marginBottom: '5px', paddingBottom: '3px', borderBottom: '1px solid #F5E9C8' }}>One-Time Withdrawal Rule</div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '11px', color: '#5A4A2A', lineHeight: '1.55' }}>
                      <span style={{ color: '#C9A84C', fontSize: '7px', marginTop: '4px' }}>◆</span>
                      Each return cycle allows only <strong>one withdrawal request</strong>.
                    </li>
                  </ul>
                </div>
              </div>
              <div>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#1A1610', letterSpacing: '0.04em', marginBottom: '5px', paddingBottom: '3px', borderBottom: '1px solid #F5E9C8' }}>Early Withdrawal Policy</div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '11px', color: '#5A4A2A', lineHeight: '1.55' }}>
                      <span style={{ color: '#C9A84C', fontSize: '7px', marginTop: '4px' }}>◆</span>
                      If withdrawn early, a <strong>5% deduction</strong> will be applied.
                    </li>
                  </ul>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#1A1610', letterSpacing: '0.04em', marginBottom: '5px', paddingBottom: '3px', borderBottom: '1px solid #F5E9C8' }}>Payment Method</div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '11px', color: '#5A4A2A', lineHeight: '1.55' }}>
                      <span style={{ color: '#C9A84C', fontSize: '7px', marginTop: '4px' }}>◆</span>
                      Credited only to the <strong>verified bank account</strong> linked.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SIGNATORIES */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #D4B96A', borderRadius: '8px', padding: '16px 20px', textAlign: 'center', position: 'relative' }}>
            <div style={{ height: '52px', border: '1px dashed #D4B96A', borderRadius: '6px', background: '#F5E9C8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5A4A2A' }}>Asset Partner / Operator Stamp</span>
            </div>
            <div style={{ height: '48px', borderBottom: '1.5px solid #D4B96A', marginBottom: '10px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '6px' }}>
              {partner?.team?.[0]?.signature ? (
                <img src={partner.team[0].signature} alt="Partner Signature" style={{ maxHeight: '44px' }} referrerPolicy="no-referrer" />
              ) : (
                <span style={{ fontStyle: 'italic', fontSize: '13px', color: 'rgba(90,74,42,0.3)', fontFamily: "'Playfair Display', serif" }}>Signature</span>
              )}
            </div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#1A1610', marginBottom: '2px' }}>{partner?.legalCompanyName || opportunity?.partnerName || withdrawal.partnerName}</div>
            <div style={{ fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5A4A2A' }}>Asset Partner / Operator</div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #D4B96A', borderRadius: '8px', padding: '16px 20px', textAlign: 'center' }}>
            <div style={{ height: '48px', borderBottom: '1.5px solid #D4B96A', marginBottom: '10px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '6px', marginTop: '62px' }}>
              {ownerSignature ? (
                <img src={ownerSignature} alt="Grow Milkat Signature" style={{ maxHeight: '44px' }} referrerPolicy="no-referrer" />
              ) : (
                <span style={{ fontStyle: 'italic', fontSize: '13px', color: 'rgba(90,74,42,0.3)', fontFamily: "'Playfair Display', serif" }}>Signature</span>
              )}
            </div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#1A1610', marginBottom: '2px' }}>Grow Milkat Platform</div>
            <div style={{ fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5A4A2A' }}>Authorized Signatory</div>
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ borderTop: '1px solid #D4B96A', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '10px', color: '#5A4A2A', fontStyle: 'italic' }}>
            All terms and conditions are applicable as per the<br />
            <strong>Grow Milkat Platform 2026.</strong>
          </div>
          <div style={{ width: '64px', height: '64px', border: '2px solid #C9A84C', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
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
  );
};

export default ReturnWithdrawalCertificate;
