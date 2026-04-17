
import React from 'react';
import { WithdrawalRecord, Investor, Opportunity, Partner } from '../types';

interface WithdrawalCertificateProps {
  withdrawal: WithdrawalRecord;
  investor: Investor;
  opportunity?: Opportunity;
  partner?: Partner;
  issueDate: string;
  logo?: string;
  ownerSignature?: string;
}

const WithdrawalCertificate: React.FC<WithdrawalCertificateProps> = ({
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
      id={`withdrawal-certificate-${withdrawal.id}`}
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
              </div>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 'bold',
              color: '#1A1610',
              marginBottom: '8px'
            }}>
              Withdrawal ID: {withdrawal.id}
            </div>
            <div style={{
              fontSize: '9px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#5A4A2A',
              marginBottom: '4px'
            }}>
              In Partnership With
            </div>
            <div style={{
              border: '1px dashed #D4B96A',
              padding: '8px 16px',
              minWidth: '160px',
              minHeight: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#F5E9C8',
              borderRadius: '4px'
            }}>
              <span style={{ fontSize: '11px', color: '#5A4A2A', fontWeight: 'bold' }}>
                {partner?.legalCompanyName || opportunity?.partnerName || '[Partner Company Name]'}
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
            textLines: 'center',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '30px'
          }}
        >
          <div style={{
            fontSize: '9px',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: '#E8C97A',
            marginBottom: '6px',
            position: 'relative'
          }}>
            Official Document · 2026
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '28px',
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '0.06em',
            position: 'relative',
            margin: 0
          }}>
            <span style={{ color: '#C9A84C', margin: '0 12px' }}>⸻</span>
            <span style={{ color: '#E8C97A' }}>Ownership Withdrawal</span> Certificate
            <span style={{ color: '#C9A84C', margin: '0 12px' }}>⸻</span>
          </h1>
        </div>

        {/* META ROW */}
        <div style={{
          display: 'flex',
          marginBottom: '26px',
          border: '1px solid #D4B96A',
          borderRadius: '6px',
          overflow: 'hidden'
        }}>
          <div style={{ flex: 1, padding: '12px 18px', borderRight: '1px solid #D4B96A', background: '#FFFFFF' }}>
            <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#5A4A2A', marginBottom: '4px' }}>📜 Withdrawal ID</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1610' }}>{withdrawal.id}</div>
          </div>
          <div style={{ flex: 1, padding: '12px 18px', borderRight: '1px solid #D4B96A', background: '#FFFFFF' }}>
            <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#5A4A2A', marginBottom: '4px' }}>📅 Issue Date</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1610' }}>{issueDate}</div>
          </div>
          <div style={{ flex: 1, padding: '12px 18px', borderRight: '1px solid #D4B96A', background: '#FFFFFF' }}>
            <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#5A4A2A', marginBottom: '4px' }}>📍 Location</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1610' }}>{withdrawal.location}</div>
          </div>
          <div style={{ flex: 1, padding: '12px 18px', background: '#FFFFFF' }}>
            <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#5A4A2A', marginBottom: '4px' }}>🏛 Partners</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1610' }}>{partner?.legalCompanyName || opportunity?.partnerName || withdrawal.partnerName}</div>
          </div>
        </div>

        {/* TWO COLUMN */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '22px' }}>
          {/* Investor Details */}
          <div style={{ background: '#FFFFFF', border: '1px solid #D4B96A', borderRadius: '8px', overflow: 'hidden' }}>
            <div 
              data-gradient="true"
              style={{ background: 'linear-gradient(90deg, #1A1610 0%, #2C2416 100%)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <span style={{ fontSize: '14px' }}>👤</span>
              <span style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E8C97A', fontWeight: 600 }}>Investor Details</span>
            </div>
            <div style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px dotted rgba(201,168,76,0.3)' }}>
                <span style={{ fontSize: '11px', color: '#5A4A2A' }}>Full Name</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#1A1610' }}>{investor.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px dotted rgba(201,168,76,0.3)' }}>
                <span style={{ fontSize: '11px', color: '#5A4A2A' }}>Asset Name</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#1A1610' }}>{withdrawal.opportunityTitle}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px dotted rgba(201,168,76,0.3)' }}>
                <span style={{ fontSize: '11px', color: '#5A4A2A' }}>Asset ID</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#1A1610' }}>{withdrawal.investmentId}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '7px 0' }}>
                <span style={{ fontSize: '11px', color: '#5A4A2A' }}>Withdrawal Type</span>
                <span style={{ background: '#F5E9C8', border: '1px solid #D4B96A', padding: '2px 8px', borderRadius: '20px', fontSize: '10px', color: '#5A4A2A', fontWeight: 600 }}>Full Exit</span>
              </div>
            </div>
          </div>

          {/* Withdrawal Details */}
          <div style={{ background: '#FFFFFF', border: '1px solid #D4B96A', borderRadius: '8px', overflow: 'hidden' }}>
            <div 
              data-gradient="true"
              style={{ background: 'linear-gradient(90deg, #1A1610 0%, #2C2416 100%)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <span style={{ fontSize: '14px' }}>💼</span>
              <span style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E8C97A', fontWeight: 600 }}>Withdrawal Details</span>
            </div>
            <div style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px dotted rgba(201,168,76,0.3)' }}>
                <span style={{ fontSize: '11px', color: '#5A4A2A' }}>Initial Investment</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#1A1610' }}>$ {withdrawal.investmentAmount.toLocaleString()}</span>
              </div>
              {withdrawal.totalGains !== undefined && (
                <>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px dotted rgba(201,168,76,0.3)' }}>
                    <span style={{ fontSize: '11px', color: '#5A4A2A' }}>Total Gains Generated</span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#1A1610' }}>$ {withdrawal.totalGains.toLocaleString()}</span>
                  </div>
                  {withdrawal.withdrawnGains && withdrawal.withdrawnGains > 0 ? (
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px dotted rgba(201,168,76,0.3)' }}>
                      <span style={{ fontSize: '11px', color: '#5A4A2A' }}>Already Withdrawn Returns</span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#E11D48' }}>- $ {withdrawal.withdrawnGains.toLocaleString()}</span>
                    </div>
                  ) : null}
                </>
              )}
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px dotted rgba(201,168,76,0.3)' }}>
                <span style={{ fontSize: '11px', color: '#5A4A2A' }}>Net Gain Settlement</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#3A6B1A' }}>$ {withdrawal.gainAmount.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px dotted rgba(201,168,76,0.3)' }}>
                <span style={{ fontSize: '11px', color: '#5A4A2A' }}>Ownership %</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#1A1610' }}>{opportunity ? ((withdrawal.investmentAmount / opportunity.targetAmount) * 100).toFixed(4) : 'N/A'}%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px dotted rgba(201,168,76,0.3)' }}>
                <span style={{ fontSize: '11px', color: '#5A4A2A' }}>Ownership Withdrawn</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#1A1610' }}>100%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px dotted rgba(201,168,76,0.3)' }}>
                <span style={{ fontSize: '11px', color: '#5A4A2A' }}>Final Settlement</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#C9A84C' }}>$ {withdrawal.withdrawalAmount.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '7px 0' }}>
                <span style={{ fontSize: '11px', color: '#5A4A2A' }}>Settlement Date</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#1A1610' }}>{withdrawal.date}</span>
              </div>
            </div>
          </div>
        </div>

        {/* DECLARATION */}
        <div style={{ background: '#FFFFFF', border: '1px solid #D4B96A', borderRadius: '8px', overflow: 'hidden', marginBottom: '22px' }}>
          <div 
            data-gradient="true"
            style={{ background: 'linear-gradient(90deg, #2A3A1A 0%, #1E2C12 100%)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <span style={{ fontSize: '14px' }}>📊</span>
            <span style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E8C97A', fontWeight: 600 }}>Declaration</span>
          </div>
          <div style={{ padding: '16px 20px' }}>
            <p style={{ fontSize: '12px', color: '#5A4A2A', lineHeight: '1.7', marginBottom: '12px', margin: 0 }}>
              This is to certify that the above-mentioned investor has successfully withdrawn their ownership fully
              from the specified asset under <strong>Grow Milkat</strong>. Accordingly:
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '7px', padding: 0, marginTop: '12px' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '12px', color: '#1A1610', lineHeight: '1.5' }}>
                <span style={{ color: '#C9A84C', fontSize: '10px', marginTop: '3px' }}>✦</span>
                The withdrawn Ownership are <strong>no longer held</strong> by the investor.
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '12px', color: '#1A1610', lineHeight: '1.5' }}>
                <span style={{ color: '#C9A84C', fontSize: '10px', marginTop: '3px' }}>✦</span>
                Ownership rights, returns, and claims on withdrawn Ownership are <strong>terminated</strong>.
              </li>
            </ul>
          </div>
        </div>

        {/* TERMS */}
        <div style={{ background: '#F5E9C8', border: '1px solid #D4B96A', borderRadius: '8px', padding: '14px 20px', marginBottom: '22px' }}>
          <div style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#5A4A2A', fontWeight: 600, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>📜 Terms & Conditions Summary</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '11px', color: '#5A4A2A', lineHeight: '1.5' }}>
              <span style={{ color: '#C9A84C', fontSize: '7px', marginTop: '4px' }}>◆</span>
              Withdrawal processed as per platform policies and agreement terms
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '11px', color: '#5A4A2A', lineHeight: '1.5' }}>
              <span style={{ color: '#C9A84C', fontSize: '7px', marginTop: '4px' }}>◆</span>
              Final settlement includes applicable returns, deductions, and fees
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '11px', color: '#5A4A2A', lineHeight: '1.5' }}>
              <span style={{ color: '#C9A84C', fontSize: '7px', marginTop: '4px' }}>◆</span>
              Any remaining ownership continues under original agreement terms
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '11px', color: '#5A4A2A', lineHeight: '1.5' }}>
              <span style={{ color: '#C9A84C', fontSize: '7px', marginTop: '4px' }}>◆</span>
              This certificate is subject to verification via platform records
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '11px', color: '#5A4A2A', lineHeight: '1.5' }}>
              <span style={{ color: '#C9A84C', fontSize: '7px', marginTop: '4px' }}>◆</span>
              Disputes are governed by the signed legal agreement
            </div>
          </div>
        </div>

        {/* SIGNATORIES */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #D4B96A', borderRadius: '8px', padding: '16px 20px', textAlign: 'center', position: 'relative' }}>
            <div style={{ height: '54px', borderBottom: '1.5px solid #D4B96A', marginBottom: '10px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '6px', position: 'relative' }}>
              {partner?.team?.[0]?.signature ? (
                <img src={partner.team[0].signature} alt="Partner Signature" style={{ maxHeight: '44px', zIndex: 2 }} referrerPolicy="no-referrer" />
              ) : (
                <span style={{ fontStyle: 'italic', fontSize: '13px', color: 'rgba(90,74,42,0.3)', fontFamily: "'Playfair Display', serif", zIndex: 2 }}>Signature</span>
              )}
              
              {/* Partner Stamp */}
              {partner?.stampLogos && partner.stampLogos.length > 0 && (
                <img 
                  src={partner.stampLogos[0]} 
                  alt="Partner Stamp" 
                  style={{ 
                    position: 'absolute', 
                    right: '0', 
                    top: '-15px', 
                    height: '65px', 
                    opacity: 0.7,
                    transform: 'rotate(-12deg)',
                    zIndex: 1
                  }} 
                  referrerPolicy="no-referrer" 
                />
              )}
            </div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#1A1610', marginBottom: '2px' }}>{partner?.legalCompanyName || opportunity?.partnerName || withdrawal.partnerName}</div>
            <div style={{ fontSize: '10px', fontWeight: 600, color: '#C9A84C', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Authorized Signatory</div>
            <div style={{ fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#5A4A2A' }}>Asset Partner / Operator</div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #D4B96A', borderRadius: '8px', padding: '16px 20px', textAlign: 'center' }}>
            <div style={{ height: '54px', borderBottom: '1.5px solid #D4B96A', marginBottom: '10px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '6px' }}>
              {ownerSignature ? (
                <img src={ownerSignature} alt="Grow Milkat Signature" style={{ maxHeight: '44px' }} referrerPolicy="no-referrer" />
              ) : (
                <span style={{ fontStyle: 'italic', fontSize: '13px', color: 'rgba(90,74,42,0.3)', fontFamily: "'Playfair Display', serif" }}>Signature</span>
              )}
            </div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#1A1610', marginBottom: '2px' }}>Authorized Signatory</div>
            <div style={{ fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#5A4A2A' }}>Grow Milkat Platform Representative</div>
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
  );
};

export default WithdrawalCertificate;
