import React, { useState } from 'react';

function CertPage({ lang, xp, level, completedUnits, badges }) {
  const [name, setName] = useState('');

  return (
    <div className="section" style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="section-tag">{lang === 'bn' ? 'স্বীকৃতি' : 'Recognition'}</div>
      <h2 className="section-title">{lang === 'bn' ? 'আপনার অর্জন' : 'Your Achievement'}</h2>
      <p className="section-sub">
        {lang === 'bn'
          ? 'অভিনন্দন! আপনি সফলভাবে মডিউলগুলো সম্পন্ন করেছেন। আপনার নাম লিখে সার্টিফিকেটটি সংগ্রহ করুন।'
          : 'Congratulations! You have successfully completed the modules. Enter your name to get your certificate.'}
      </p>

      <div className="card" style={{ marginBottom: 32, padding: 24 }}>
        <label style={{ display: 'block', marginBottom: 12, fontWeight: 600, fontSize: 14 }}>
          {lang === 'bn' ? 'সার্টিফিকেটে প্রদর্শিত নাম:' : 'Name to display on certificate:'}
        </label>
        <input
          type="text"
          placeholder={lang === 'bn' ? 'যেমন: রহিম আহমেদ' : 'e.g. John Doe'}
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: '100%',
            padding: '14px 18px',
            borderRadius: 10,
            border: '2px solid var(--primary)',
            fontSize: 16,
            background: 'var(--card-bg)',
            color: 'var(--text)',
            outline: 'none'
          }}
        />
      </div>

      <div className="certificate-wrapper" style={{ position: 'relative', background: 'white', color: '#0F172A', padding: '10px', borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
      <div className="certificate" style={{ textAlign: 'center', border: '15px double var(--primary)', padding: '60px 40px', background: 'white' }}>
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

        <div style={{ marginTop: 60, display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #E2E8F0', paddingTop: 20 }}>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontWeight: 'bold' }}>Shottanneshok</p>
            <p style={{ fontSize: 12 }}>Digital Literacy Platform</p>
            <p style={{ fontSize: 10, color: 'var(--light)', marginTop: 4 }}>Based on UNESCO MIL Framework</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontWeight: 'bold' }}>{new Date().toLocaleDateString()}</p>
            <p style={{ fontSize: 12 }}>Date of Issue</p>
          </div>
        </div>
      </div>
      </div>

      <button className="btn-primary" style={{ marginTop: 32, width: '100%', padding: 16, fontSize: 16 }} onClick={() => window.print()}>
        🖨️ {lang === 'bn' ? 'প্রিন্ট করুন / ডাউনলোড' : 'Print / Download PDF'}
      </button>

      <p style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'var(--light)' }}>
        Credit: UNESCO (United Nations Educational, Scientific and Cultural Organization)
      </p>
    </div>
  );
}
export default CertPage;
