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
      completeUnit(activeUnit);
      setActiveUnit(null);
      setQuizMode(false);
    }
  }

  if (activeUnit) return (
    <div className="section" style={{ maxWidth: 800, margin: '0 auto' }}>
      <button className="btn-outline" onClick={() => { setActiveUnit(null); setQuizMode(false); }} style={{ marginBottom: 24 }}>
        {lang === 'bn' ? '← কারিকুলামে ফিরে যান' : '← Back to Curriculum'}
      </button>

      {!quizMode ? (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ background: 'var(--primary)', color: 'white', padding: '40px 30px', position: 'relative' }}>
            <div style={{ fontSize: 64, opacity: 0.2, position: 'absolute', right: 20, top: 10 }}>{activeUnit.icon}</div>
            <div className="unit-num" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 8 }}>UNIT {activeUnit.id}</div>
            <h2 style={{ fontSize: 28, fontWeight: 800 }}>{lang === 'bn' ? activeUnit.titleBn : activeUnit.titleEn}</h2>
            <div style={{ display: 'flex', gap: 16, marginTop: 16, fontSize: 13 }}>
              <span>⏱️ {lang === 'bn' ? activeUnit.durationBn : activeUnit.durationEn}</span>
              <span>⚡ {activeUnit.xp} XP</span>
            </div>
          </div>

          <div style={{ padding: 30 }}>
            <h3 style={{ marginBottom: 20, borderBottom: '2px solid var(--primary-pale)', paddingBottom: 10 }}>
              {lang === 'bn' ? 'শিখন বিষয়বস্তু' : 'Learning Content'}
            </h3>

            <div className="mil-content" style={{ fontSize: 16, color: 'var(--text-dim)' }}>
              {(lang === 'bn' ? activeUnit.contentBn : activeUnit.contentEn).map((p, i) => (
                <p key={i} style={{ marginBottom: 20, lineHeight: 1.8 }}>{p}</p>
              ))}
            </div>

            <div style={{ background: 'var(--bg-alt)', padding: 24, borderRadius: 12, marginTop: 32, border: '1px solid var(--border)' }}>
              <h4 style={{ marginBottom: 12, color: 'var(--text)' }}>{lang === 'bn' ? 'মূল ধারণাগুলো:' : 'Key Concepts:'}</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {(lang === 'bn' ? activeUnit.conceptsBn : activeUnit.conceptsEn).map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                    <span style={{ color: 'var(--primary)' }}>•</span> {c}
                  </div>
                ))}
              </div>
            </div>

            <button className="btn-primary" style={{ marginTop: 40, width: '100%', padding: 16, fontSize: 16 }} onClick={startQuiz}>
              {lang === 'bn' ? 'কুইজ শুরু করুন' : 'Start Assessment'}
            </button>
          </div>
        </div>
      ) : (
        <div className="card" style={{ maxWidth: 600, margin: '0 auto', padding: 32 }}>
          <div className="quiz-q-num">
            {lang === 'bn' ? 'মূল্যায়ন প্রশ্ন' : 'Assessment Question'} {currentQ + 1} / {activeUnit.quiz.length}
          </div>
          <h3 className="quiz-question" style={{ fontSize: 20, marginBottom: 30 }}>
            {lang === 'bn' ? activeUnit.quiz[currentQ].q : activeUnit.quiz[currentQ].qEn}
          </h3>

          <div className="quiz-options">
            {activeUnit.quiz[currentQ].options.map((opt, i) => (
              <button
                key={i}
                className={`quiz-option ${feedback ? (i === activeUnit.quiz[currentQ].correct ? 'correct' : '') : ''}`}
                disabled={feedback !== null}
                onClick={() => handleAnswer(i)}
              >
                {opt}
              </button>
            ))}
          </div>

          {feedback && (
            <div className={`quiz-feedback ${feedback.type === 'success' ? 'correct' : 'wrong'}`}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>
                {feedback.type === 'success' ? (lang === 'bn' ? '✅ চমৎকার!' : '✅ Excellent!') : (lang === 'bn' ? '❌ আবার চেষ্টা করুন' : '❌ Try Again')}
              </div>
              <p>{feedback.text}</p>
              <button className="btn-primary" style={{ marginTop: 20, width: '100%' }} onClick={next}>
                {currentQ < activeUnit.quiz.length - 1 ? (lang === 'bn' ? 'পরবর্তী প্রশ্ন' : 'Next Question') : (lang === 'bn' ? 'মডিউল শেষ করুন' : 'Finish Module')}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
  return (
    <div className="section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 className="section-title" style={{ margin: 0 }}>UNESCO MIL Curriculum</h2>
        <a
          href="https://unesdoc.unesco.org/ark:/48223/pf0000389216"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline"
          style={{ textDecoration: 'none', fontSize: 14 }}
        >
          {lang === 'bn' ? '📥 ইউনেস্কো হ্যান্ডবুক ডাউনলোড করুন' : '📥 Download UNESCO Handbook'}
        </a>
      </div>
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
