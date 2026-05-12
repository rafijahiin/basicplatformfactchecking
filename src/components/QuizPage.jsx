import React, { useState } from 'react';
import { QUIZ } from '../data/constants';
function QuizPage({ lang, addXP, earnBadge }) {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  function answer(i) {
    if (i === QUIZ[step].correct) setScore(s => s + 1);
    if (step < QUIZ.length - 1) setStep(s => s + 1);
    else { setDone(true); addXP(50, 'Quiz completed'); earnBadge({ id: 'brain', icon: '🧠', name: 'Quiz Whiz' }); }
  }
  if (done) return <div className="section"><h2>Quiz Done!</h2><p>Score: {score}/{QUIZ.length}</p></div>;
  const q = QUIZ[step];
  return (
    <div className="section">
      <div className="card">
        <p>{lang === 'bn' ? q.q : q.qEn}</p>
        <div style={{ display: 'grid', gap: 10, marginTop: 16 }}>
          {q.options.map((o, i) => (
            <button key={i} className="nav-btn" style={{ background: 'var(--bg-alt)', color: 'var(--dark)' }} onClick={() => answer(i)}>{o}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
export default QuizPage;
