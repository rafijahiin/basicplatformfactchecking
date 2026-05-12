import React, { useState } from 'react';
import { MYTHS } from '../data/constants';
function MythsPage({ lang }) {
  const [open, setOpen] = useState(null);

  return (
    <div className="section" style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="section-tag">{lang === 'bn' ? 'তথ্য যাচাই' : 'Fact Check'}</div>
      <h2 className="section-title">{lang === 'bn' ? 'প্রচলিত গুজব ও সত্য' : 'Common Myths & Facts'}</h2>
      <p className="section-sub">
        {lang === 'bn'
          ? 'আমাদের সমাজে প্রচলিত কিছু ভুল ধারণা এবং সেগুলোর প্রকৃত সত্য নিচে দেওয়া হলো।'
          : 'Here are some common misconceptions prevalent in our society and the actual facts behind them.'}
      </p>

      <div className="myths-list">
        {MYTHS.map(m => (
          <div key={m.id} className="myth-card">
            <div
              className="myth-header"
              onClick={() => setOpen(open === m.id ? null : m.id)}
              style={{ borderLeft: `4px solid ${open === m.id ? 'var(--green)' : 'var(--red)'}` }}
            >
              <div style={{ flex: 1 }}>
                <div className="myth-tag" style={{ background: 'var(--red-light)', color: 'var(--red)' }}>
                  {lang === 'bn' ? 'গুজব' : 'MYTH'}
                </div>
                <div className="myth-q" style={{ fontWeight: 600 }}>
                   ❌ {lang === 'bn' ? m.myth : m.mythEn}
                </div>
              </div>
              <div className={`myth-chevron ${open === m.id ? 'open' : ''}`}>▼</div>
            </div>

            {open === m.id && (
              <div className="myth-body" style={{ animation: 'fadeIn 0.3s ease' }}>
                <div className="myth-tag" style={{ background: 'var(--green-light)', color: 'var(--green)', marginTop: 12 }}>
                  {lang === 'bn' ? 'প্রকৃত সত্য' : 'THE FACT'}
                </div>
                <div className="myth-fact" style={{ fontWeight: 500, fontSize: '15px' }}>
                  ✅ {lang === 'bn' ? m.fact : m.factEn}
                </div>
                {m.source && (
                  <div className="myth-source">
                    Source: {m.source}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
export default MythsPage;
