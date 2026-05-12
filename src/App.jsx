import React, { useState, useEffect, Suspense, lazy } from 'react';
import confetti from 'canvas-confetti';
import { getLevel, getLevelPct } from './data/utils';

// ⚡ Bolt: Lazy load route components to reduce initial bundle size and improve TTI
const HomePage = lazy(() => import('./components/HomePage'));
const GamePage = lazy(() => import('./components/GamePage'));
const RumorFactoryPage = lazy(() => import('./components/RumorFactoryPage'));
const MILPage = lazy(() => import('./components/MILPage'));
const SHEEPPage = lazy(() => import('./components/SHEEPPage'));
const AICheckerPage = lazy(() => import('./components/AICheckerPage'));
const MythsPage = lazy(() => import('./components/MythsPage'));
const QuizPage = lazy(() => import('./components/QuizPage'));
const CertPage = lazy(() => import('./components/CertPage'));

function App() {
  const [view, setView] = useState('home');
  const [lang, setLang] = useState('bn');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  const [toast, setToast] = useState(null);
  const [xp, setXp] = useState(() => parseInt(localStorage.getItem('xp') || '0'));
  const [xpPopup, setXpPopup] = useState(null);
  const [badges, setBadges] = useState(() => JSON.parse(localStorage.getItem('badges') || '[]'));
  const [completedUnits, setCompletedUnits] = useState(() => JSON.parse(localStorage.getItem('completedUnits') || '[]'));

  useEffect(() => {
    localStorage.setItem('xp', xp);
    localStorage.setItem('badges', JSON.stringify(badges));
    localStorage.setItem('completedUnits', JSON.stringify(completedUnits));
  }, [xp, badges, completedUnits]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function addXP(amount, reason) {
    setXp(x => x + amount);
    setXpPopup(`+${amount} XP — ${reason}`);
    setTimeout(() => setXpPopup(null), 2500);
  }

  function earnBadge(badge) {
    setBadges(b => b.find(x => x.id === badge.id) ? b : [...b, badge]);
  }

  function completeUnit(unit) {
    if (!completedUnits.includes(unit.id)) {
      setCompletedUnits(u => [...u, unit.id]);
      addXP(unit.xp, lang === 'bn' ? `ইউনিট ${unit.id} সম্পন্ন` : `Unit ${unit.id} completed`);
      earnBadge({id:`unit${unit.id}`,icon:'📚',name:`Unit ${unit.id} Scholar`});
    }
  }

  const level = getLevel(xp);
  const levelPct = getLevelPct(xp);

  const NAV = [
    {id:'home',bn:'হোম',en:'Home'},
    {id:'game',bn:'ভুয়া ধরুন',en:'Spot Fake'},
    {id:'rumor',bn:'গুজব কারখানা',en:'Rumor Factory'},
    {id:'mil',bn:'UNESCO MIL',en:'UNESCO MIL'},
    {id:'sheep',bn:'SHEEP যাচাই',en:'SHEEP Verify'},
    {id:'ai',bn:'AI চেকার',en:'AI Checker'},
    {id:'myths',bn:'মিথ',en:'Myths'},
    {id:'quiz',bn:'কুইজ',en:'Quiz'},
    {id:'cert',bn:'সনদপত্র',en:'Certificate'},
  ];

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-brand" onClick={() => setView('home')}>
          <div className="navbar-logo">স</div>
          <div>
            <div className="navbar-title font-en">সত্যান্বেষক</div>
            <div className="navbar-subtitle">Shottanneshok</div>
          </div>
        </div>
        <div className="navbar-nav">
          {NAV.map(n => (
            <button key={n.id} className={`nav-btn${view===n.id?' active':''}`} onClick={() => setView(n.id)}>
              {lang==='bn' ? n.bn : n.en}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="lang-btn" onClick={() => setTheme(t => t==='light'?'dark':'light')} data-testid="theme-toggle">
            {theme==='light' ? '🌙' : '☀️'}
          </button>
          <button className="lang-btn" onClick={() => setLang(l => l==='bn'?'en':'bn')}>
            {lang==='bn' ? 'EN' : 'বাং'}
          </button>
        </div>
      </nav>

      <div className="xp-bar-wrap">
        <span className="xp-level-badge">{level.icon} {lang==='bn' ? level.title : level.titleEn}</span>
        <div className="xp-bar-track"><div className="xp-bar-fill" style={{width:`${levelPct}%`}}/></div>
        <span className="xp-text">{xp} XP</span>
      </div>

      <main className="main-content">
        <Suspense fallback={
          <div className="section" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <div style={{ fontSize: '1.2rem', color: 'var(--light)', fontWeight: 500 }}>
              {lang === 'bn' ? 'লোড হচ্ছে...' : 'Loading...'}
            </div>
          </div>
        }>
          {view==='home' && <HomePage setView={setView} lang={lang} level={level} xp={xp} completedUnits={completedUnits}/>}
          {view==='game' && <GamePage lang={lang} showToast={showToast} addXP={addXP} earnBadge={earnBadge}/>}
          {view==='rumor' && <RumorFactoryPage lang={lang} addXP={addXP} earnBadge={earnBadge}/>}
          {view==='mil' && <MILPage lang={lang} completedUnits={completedUnits} completeUnit={completeUnit} addXP={addXP}/>}
          {view==='sheep' && <SHEEPPage lang={lang} addXP={addXP} setView={setView}/>}
          {view==='ai' && <AICheckerPage lang={lang} addXP={addXP}/>}
          {view==='myths' && <MythsPage lang={lang} addXP={addXP}/>}
          {view==='quiz' && <QuizPage lang={lang} addXP={addXP} earnBadge={earnBadge}/>}
          {view==='cert' && <CertPage lang={lang} xp={xp} level={level} completedUnits={completedUnits} badges={badges}/>}
        </Suspense>
      </main>

      {toast && <div className="toast">{toast}</div>}
      {xpPopup && <div className="xp-popup">⚡ {xpPopup}</div>}
    </div>
  );
}

export default App;
