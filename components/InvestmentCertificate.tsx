
import React from 'react';
import { InvestmentRecord, Investor, Opportunity, Partner, ReturnType } from '../types';

interface InvestmentCertificateProps {
  investment: InvestmentRecord;
  investor: Investor;
  opportunity: Opportunity;
  partner?: Partner;
  issueDate: string;
  logo?: string;
  ownerSignature?: string;
}

const InvestmentCertificate: React.FC<InvestmentCertificateProps> = ({
  investment,
  investor,
  opportunity,
  partner,
  issueDate,
  logo,
  ownerSignature
}) => {
  return (
    <div 
      id={`certificate-${investment.id}`}
      style={{
        width: '800px',
        minHeight: '1100px',
        backgroundColor: '#ffffff',
        padding: '40px',
        boxShadow: '0 0 15px rgba(0,0,0,0.1)',
        border: '2px solid #d4af37',
        position: 'relative',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: '#333'
      }}
    >
      <div style={{
        border: '1px solid #d4af37',
        height: '100%',
        padding: '30px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          borderBottom: '1px solid #ccc',
          paddingBottom: '15px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {logo ? (
              <img src={logo} alt="Grow Milkat Logo" style={{ height: '48px', objectFit: 'contain' }} referrerPolicy="no-referrer" />
            ) : (
              <div 
                data-gradient="true"
                style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #004d40 0%, #00695c 100%)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  color: 'white'
                }}
              >
              </div>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', color: '#666' }}>Partner with</div>
            <div style={{ fontWeight: 'bold', color: '#004d40', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'flex-end' }}>
              {(partner?.logo || opportunity.partnerLogoUrl) && (
                <img src={partner?.logo || opportunity.partnerLogoUrl} alt={opportunity.partnerName} style={{ height: '30px' }} referrerPolicy="no-referrer" />
              )}
              <span>{partner?.legalCompanyName || opportunity.partnerName}</span>
            </div>
          </div>
        </div>

        <h1 style={{
          textAlign: 'center',
          color: '#004d40',
          marginBottom: '5px',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          borderBottom: '1px solid #ccc',
          paddingBottom: '15px',
          fontSize: '28px'
        }}>
          Certificate Of Asset Investment
        </h1>

        {/* Meta Info */}
        <div style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between', marginBottom: '20px', fontSize: '12px' }}>
          <span><strong>Certificate ID:</strong> {investment.id}</span>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span><strong>Investment Date:</strong> {new Date(investment.date).toLocaleDateString()}</span>
            <span><strong>Issue Date:</strong> {issueDate}</span>
          </div>
        </div>

        {/* Ownership Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', paddingTop: '10px' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontWeight: 'bold', fontSize: '12px', color: '#555', marginBottom: '3px', display: 'block' }}>Investor Name</label>
            <span style={{ fontSize: '14px', color: '#000', borderBottom: '1px dotted #ccc', paddingBottom: '2px', display: 'block' }}>
              {investor.name} (ID: {investor.investorUniqueId})
            </span>
          </div>
          
          <div style={{ gridColumn: 'span 2', borderTop: '1px dashed #eee', paddingTop: '10px', marginTop: '5px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ fontWeight: 'bold', fontSize: '12px', color: '#555', marginBottom: '3px', display: 'block' }}>Asset Name & ID</label>
                <span style={{ fontSize: '14px', color: '#000', borderBottom: '1px dotted #ccc', paddingBottom: '2px', display: 'block' }}>
                  {opportunity.title} (ID: {investment.id})
                </span>
              </div>
              <div>
                <label style={{ fontWeight: 'bold', fontSize: '12px', color: '#555', marginBottom: '3px', display: 'block' }}>Location</label>
                <span style={{ fontSize: '14px', color: '#000', borderBottom: '1px dotted #ccc', paddingBottom: '2px', display: 'block' }}>
                  {opportunity.location}
                </span>
              </div>
              <div style={{ gridColumn: 'span 2', marginTop: '10px' }}>
                <label style={{ fontWeight: 'bold', fontSize: '12px', color: '#555', marginBottom: '3px', display: 'block' }}>Partners</label>
                <span style={{ fontSize: '14px', color: '#000', borderBottom: '1px dotted #ccc', paddingBottom: '2px', display: 'block' }}>
                  {partner?.legalCompanyName || opportunity.partnerName}
                </span>
              </div>
            </div>

            {/* Financial Grid */}
            <div style={{ marginTop: '20px', backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '5px' }}>
              <div style={{ textAlign: 'center', fontWeight: 'bold', color: '#004d40', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '14px' }}>
                Ownership Details
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ fontWeight: 'bold', fontSize: '12px', color: '#555', marginBottom: '3px', display: 'block' }}>Total Investment Amount</label>
                  <span style={{ fontSize: '14px', color: '#000', borderBottom: '1px dotted #ccc', paddingBottom: '2px', display: 'block' }}>
                    ${investment.amount.toLocaleString()}
                  </span>
                </div>
                <div>
                  <label style={{ fontWeight: 'bold', fontSize: '12px', color: '#555', marginBottom: '3px', display: 'block' }}>Ownership Percentage</label>
                  <span style={{ fontSize: '14px', color: '#000', borderBottom: '1px dotted #ccc', paddingBottom: '2px', display: 'block' }}>
                    {((investment.amount / opportunity.targetAmount) * 100).toFixed(4)}%
                  </span>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
                <div>
                  <label style={{ fontWeight: 'bold', fontSize: '12px', color: '#555', marginBottom: '3px', display: 'block' }}>Return Type</label>
                  <span style={{ fontSize: '14px', color: '#000', borderBottom: '1px dotted #ccc', paddingBottom: '2px', display: 'block' }}>
                    {opportunity.returnType}
                  </span>
                </div>
                <div>
                  <label style={{ fontWeight: 'bold', fontSize: '12px', color: '#555', marginBottom: '3px', display: 'block' }}>Expected Annual Return (ROI)</label>
                  <span style={{ fontSize: '14px', color: '#000', borderBottom: '1px dotted #ccc', paddingBottom: '2px', display: 'block' }}>
                    {opportunity.expectedROI}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
                <div>
                  <label style={{ fontWeight: 'bold', fontSize: '12px', color: '#555', marginBottom: '3px', display: 'block' }}>Holding Period</label>
                  <span style={{ fontSize: '14px', color: '#000', borderBottom: '1px dotted #ccc', paddingBottom: '2px', display: 'block' }}>
                    {opportunity.holdingPeriod}
                  </span>
                </div>
                <div>
                  <label style={{ fontWeight: 'bold', fontSize: '12px', color: '#555', marginBottom: '3px', display: 'block' }}>Payout Cadence</label>
                  <span style={{ fontSize: '14px', color: '#000', borderBottom: '1px dotted #ccc', paddingBottom: '2px', display: 'block' }}>
                    {opportunity.payoutFrequency}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', marginTop: '40px', textAlign: 'center' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ height: '80px', borderBottom: '1px solid #333', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {partner?.team?.[0]?.signature && (
                <img src={partner.team[0].signature} alt="Partner Signature" style={{ maxHeight: '60px', zIndex: 2 }} referrerPolicy="no-referrer" />
              )}
              {/* Official Partner Company Stamp */}
              {partner?.stampLogos && partner.stampLogos.length > 0 && (
                <img 
                  src={partner.stampLogos[0]} 
                  alt="Partner Stamp" 
                  style={{ 
                    position: 'absolute', 
                    right: '10px', 
                    top: '-10px', 
                    height: '70px', 
                    opacity: 0.8,
                    transform: 'rotate(-15deg)',
                    zIndex: 1
                  }} 
                  referrerPolicy="no-referrer" 
                />
              )}
            </div>
            <div style={{ fontSize: '12px', fontWeight: 'bold', textAlign: 'left', color: '#000' }}>
              {partner?.team?.[0]?.name || 'Partner Name'}
            </div>
            <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#d4af37', textTransform: 'uppercase', textAlign: 'left', marginTop: '2px' }}>Authorized Signatory</div>
            <div style={{ fontSize: '10px', color: '#666', textAlign: 'left' }}>Asset Partner/Operator</div>
          </div>

          <div>
            <div style={{ height: '80px', borderBottom: '1px solid #333', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {ownerSignature && (
                <img src={ownerSignature} alt="Grow Milkat Signature" style={{ maxHeight: '60px' }} referrerPolicy="no-referrer" />
              )}
            </div>
            <div style={{ fontSize: '12px', fontWeight: 'bold', textAlign: 'left', color: '#000' }}>Authorized Signatory</div>
            <div style={{ fontSize: '10px', color: '#666', textAlign: 'left' }}>Grow Milkat Platform Representative</div>
          </div>
        </div>

        {/* Partner Details Section */}
        <div style={{ marginTop: '30px', borderTop: '1px solid #ccc', paddingTop: '15px', fontSize: '11px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h4 style={{ margin: '0 0 5px 0', color: '#004d40', textTransform: 'uppercase', fontSize: '12px' }}>Partner Details</h4>
              <div style={{ marginBottom: '3px' }}><strong>Legal Company Name:</strong> {partner?.legalCompanyName || opportunity.partnerName}</div>
              <div style={{ marginBottom: '3px' }}><strong>Email:</strong> {partner?.email || 'N/A'}</div>
              <div style={{ marginBottom: '3px' }}><strong>Phone:</strong> {partner?.phone || 'N/A'}</div>
              <div style={{ marginBottom: '3px' }}><strong>Address:</strong> {partner?.address?.fullAddress || 'N/A'}, {partner?.address?.city}, {partner?.address?.state}, {partner?.address?.country} - {partner?.address?.pincode}</div>
            </div>
            <div>
              <h4 style={{ margin: '0 0 5px 0', color: '#004d40', textTransform: 'uppercase', fontSize: '12px' }}>Business Information</h4>
              <div style={{ marginBottom: '3px' }}><strong>Business Type:</strong> {partner?.businessType || 'N/A'}</div>
              <div style={{ marginBottom: '3px' }}><strong>PAN Number:</strong> {partner?.panNumber || 'N/A'}</div>
              <div style={{ marginBottom: '3px' }}><strong>GST Number:</strong> {partner?.gstNumber || 'N/A'}</div>
              <div style={{ marginBottom: '3px' }}><strong>Associated Assets:</strong> {partner?.associatedAssets?.join(', ') || 'N/A'}</div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div style={{ marginTop: 'auto', fontSize: '10px', color: '#666', borderTop: '1px solid #ddd', paddingTop: '10px' }}>
          <p style={{ margin: '0 0 5px 0' }}><strong>Investment Terms & Conditions (Summary)</strong></p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <ul style={{ margin: 0, paddingLeft: '15px', flex: 1 }}>
              <li>1. Ownership is held via SPV structure.</li>
              <li>2. Returns distributed as per selected yield model.</li>
              <li>3. Lock-in period: {opportunity.holdingPeriod}.</li>
            </ul>
            <ul style={{ margin: 0, paddingLeft: '15px', flex: 1 }}>
              <li>4. Exit terms as per platform agreement.</li>
              <li>5. Subject to market risks and asset performance.</li>
              <li>6. All terms and conditions are applicable as per the Grow Milkat Platform (2026).</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentCertificate;
