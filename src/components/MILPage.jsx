import React, { useState } from 'react';
import { MIL_UNITS } from '../data/constants';

function MILPage({ lang, completedUnits, completeUnit }) {
  const [activeUnit, setActiveUnit] = useState(null);
  const [quizMode, setQuizMode] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [feedback, setFeedback] = useState(null);

  function startQuiz() {
    setQuizMode(true);
    setCurrentQ(0);
    setFeedback(null);
  }

  function handleAnswer(idx) {
    const q = activeUnit.quiz[currentQ];
    if (idx === q.correct) {
      setFeedback({ type: 'success', text: q.feedback });
    } else {
      setFeedback({ type: 'error', text: q.feedback });
    }
  }

  function next() {
    setFeedback(null);
    if (currentQ < activeUnit.quiz.length - 1) {
      setCurrentQ(c => c + 1);
    } else {
      completeUnit(activeUnit.id);
      setActiveUnit(null);
      setQuizMode(false);
    }
  }

  if (activeUnit) return (
    <div className="section">
      <button className="btn-secondary" onClick={() => { setActiveUnit(null); setQuizMode(false); }}>
        {lang === 'bn' ? '← ফিরে যান' : '← Back'}
      </button>

      {!quizMode ? (
        <div className="card" style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: '2.5rem' }}>{activeUnit.icon}</span>
            <h2>{lang === 'bn' ? activeUnit.titleBn : activeUnit.titleEn}</h2>
          </div>

          <div className="mil-content">
            {(lang === 'bn' ? activeUnit.contentBn : activeUnit.contentEn).map((p, i) => (
              <p key={i} style={{ marginBottom: 16, lineHeight: 1.6 }}>{p}</p>
            ))}
          </div>

          <div style={{ background: 'var(--bg-alt)', padding: 20, borderRadius: 12, marginTop: 24 }}>
            <h4>{lang === 'bn' ? 'মূল ধারণাগুলো:' : 'Key Concepts:'}</h4>
            <ul style={{ marginLeft: 20, marginTop: 10 }}>
              {(lang === 'bn' ? activeUnit.conceptsBn : activeUnit.conceptsEn).map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>

          <button className="btn-primary" style={{ marginTop: 30, width: '100%' }} onClick={startQuiz}>
            {lang === 'bn' ? 'কুইজ শুরু করুন' : 'Start Quiz'}
          </button>
        </div>
      ) : (
        <div className="card" style={{ marginTop: 16 }}>
          <div style={{ marginBottom: 20, color: 'var(--text-dim)' }}>
            {lang === 'bn' ? 'প্রশ্ন' : 'Question'} {currentQ + 1} / {activeUnit.quiz.length}
          </div>
          <h3 style={{ marginBottom: 24 }}>
            {lang === 'bn' ? activeUnit.quiz[currentQ].q : activeUnit.quiz[currentQ].qEn}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {activeUnit.quiz[currentQ].options.map((opt, i) => (
              <button
                key={i}
                className="choice-btn"
                disabled={feedback !== null}
                onClick={() => handleAnswer(i)}
                style={{
                  textAlign: 'left',
                  border: feedback && i === activeUnit.quiz[currentQ].correct ? '2px solid var(--green)' : '1px solid var(--border)'
                }}
              >
                {opt}
              </button>
            ))}
          </div>

          {feedback && (
            <div style={{
              marginTop: 24,
              padding: 16,
              borderRadius: 8,
              background: feedback.type === 'success' ? '#D1FAE5' : '#FEE2E2',
              color: feedback.type === 'success' ? '#065F46' : '#991B1B'
            }}>
              <p>{feedback.text}</p>
              <button className="btn-primary" style={{ marginTop: 16 }} onClick={next}>
                {currentQ < activeUnit.quiz.length - 1 ? (lang === 'bn' ? 'পরবর্তী' : 'Next') : (lang === 'bn' ? 'শেষ করুন' : 'Finish')}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
  return (
    <div className="section">
      <h2 className="section-title">UNESCO MIL Curriculum</h2>
      <div style={{ display: 'grid', gap: 16 }}>
        {MIL_UNITS.map(u => (
          <div key={u.id} className="card" style={{ cursor: 'pointer', borderLeft: completedUnits.includes(u.id) ? '4px solid var(--green)' : '1px solid var(--border)' }} onClick={() => setActiveUnit(u)}>
            <h3>{lang === 'bn' ? u.titleBn : u.titleEn}</h3>
            <p>{lang === 'bn' ? u.durationBn : u.durationEn}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
export default MILPage;
