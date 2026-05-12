import React, { useState, useEffect } from 'react';
import { GAME_POSTS } from '../data/constants';
function GamePage({ lang, addXP, earnBadge }) {
  const [current, setCurrent] = useState(0);
  const [answered, setAnswered] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [pauseTimer, setPauseTimer] = useState(3);
  useEffect(() => {
    if (answered === null && !done) {
      setPauseTimer(3);
      const t = setInterval(() => {
        setPauseTimer(p => {
          if (p <= 1) { clearInterval(t); return 0; }
          return p - 1;
        });
      }, 1000);
      return () => clearInterval(t);
    }
  }, [current, answered, done]);
  function handleAnswer(guess) {
    if (answered !== null || pauseTimer > 0) return;
    const post = GAME_POSTS[current];
    const correct = guess === post.verdict;
    setAnswered(guess);
    if (correct) {
      setScore(s => s + 1);
      addXP(10, lang === 'bn' ? 'সঠিক উত্তর' : 'Correct answer');
    }
  }
  function handleNext() {
    if (current < GAME_POSTS.length - 1) { setCurrent(c => c + 1); setAnswered(null); }
    else { setDone(true); if (score >= 4) earnBadge({ id: 'spotter', icon: '🕵️', name: 'Master Spotter' }); }
  }
  if (done) return (
    <div className="section">
      <div className="card" style={{ textAlign: 'center' }}>
        <h2>{lang === 'bn' ? 'খেলা শেষ!' : 'Game Over!'}</h2>
        <p style={{ fontSize: 48 }}>{score}/{GAME_POSTS.length}</p>
        <button className="btn-primary" onClick={() => window.location.reload()}>{lang === 'bn' ? 'আবার খেলুন' : 'Play Again'}</button>
      </div>
    </div>
  );
  const post = GAME_POSTS[current];
  return (
    <div className="section">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <span>{post.platform}</span>
          <span>{current + 1}/{GAME_POSTS.length}</span>
        </div>
        <p style={{ fontSize: 18, marginBottom: 16 }}>{lang === 'bn' ? post.content : post.contentEn}</p>
        {answered === null ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <button disabled={pauseTimer > 0} className="btn-primary" style={{ background: 'var(--green)' }} onClick={() => handleAnswer('real')}>✅ {lang === 'bn' ? 'সত্যি' : 'REAL'} {pauseTimer > 0 && `(${pauseTimer})`}</button>
            <button disabled={pauseTimer > 0} className="btn-primary" style={{ background: 'var(--red)' }} onClick={() => handleAnswer('fake')}>❌ {lang === 'bn' ? 'ভুয়া' : 'FAKE'} {pauseTimer > 0 && `(${pauseTimer})`}</button>
          </div>
        ) : (
          <div>
            <div style={{ padding: 16, borderRadius: 6, marginBottom: 16, background: post.verdict === 'real' ? 'var(--primary-pale)' : '#FEE2E2' }}>
              <strong>{post.verdict === 'real' ? '✅ REAL' : '❌ FAKE'}</strong>
              <p>{lang === 'bn' ? post.explanation : post.explanationEn}</p>
            </div>
            <button className="btn-primary" onClick={handleNext} style={{ width: '100%' }}>{lang === 'bn' ? 'পরবর্তী' : 'Next'} →</button>
          </div>
        )}
      </div>
    </div>
  );
}
export default GamePage;
