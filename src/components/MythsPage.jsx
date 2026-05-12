import React, { useState } from 'react';
import { MYTHS } from '../data/constants';
function MythsPage({ lang }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="section">
      <h2 className="section-title">Common Myths</h2>
      {MYTHS.map(m => (
        <div key={m.id} className="card" style={{ marginBottom: 12, cursor: 'pointer' }} onClick={() => setOpen(open === m.id ? null : m.id)}>
          <strong>❌ {lang === 'bn' ? m.myth : m.mythEn}</strong>
          {open === m.id && ( <div style={{ marginTop: 12, color: 'var(--green)' }}> ✅ {lang === 'bn' ? m.fact : m.factEn} </div> )}
        </div>
      ))}
    </div>
  );
}
export default MythsPage;
