import React, { useState } from 'react';

function CertPage({ lang, xp, level, completedUnits, badges }) {
  const [name, setName] = useState('');

  return (
    <div className="section">
      <div className="card" style={{ marginBottom: 24 }}>
        <input
          type="text"
          placeholder={lang === 'bn' ? 'আপনার নাম লিখুন' : 'Enter your name'}
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid var(--border)' }}
        />
      </div>

      <div className="card certificate" style={{ textAlign: 'center', borderTop: '8px solid var(--primary)', padding: '40px 20px' }}>
        <h1 style={{ letterSpacing: 4, marginBottom: 8 }}>CERTIFICATE</h1>
        <p style={{ textTransform: 'uppercase', color: 'var(--text-dim)' }}>of Achievement</p>

        <div style={{ margin: '40px 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 16 }}>This is to certify that</p>
          <h2 style={{ fontSize: 42, color: 'var(--primary)', borderBottom: '2px solid var(--border)', display: 'inline-block', minWidth: 300 }}>
            {name || '................................'}
          </h2>
          <p style={{ marginTop: 24 }}>
            has successfully demonstrated critical thinking skills and achieved the rank of
          </p>
          <h3 style={{ fontSize: 24, marginTop: 12 }}>
            {level.icon} {lang === 'bn' ? level.title : level.titleEn}
          </h3>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 40 }}>
          {badges.map(b => (
            <div key={b.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: 40 }}>{b.icon}</span>
              <span style={{ fontSize: 10, textTransform: 'uppercase', marginTop: 4 }}>{b.name}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 60, display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 20 }}>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontWeight: 'bold' }}>Shottanneshok</p>
            <p style={{ fontSize: 12 }}>Digital Literacy Platform</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontWeight: 'bold' }}>{new Date().toLocaleDateString()}</p>
            <p style={{ fontSize: 12 }}>Date of Issue</p>
          </div>
        </div>
      </div>

      <button className="btn-primary" style={{ marginTop: 24, width: '100%' }} onClick={() => window.print()}>
        {lang === 'bn' ? 'প্রিন্ট করুন / ডাউনলোড' : 'Print / Download PDF'}
      </button>
    </div>
  );
}
export default CertPage;
