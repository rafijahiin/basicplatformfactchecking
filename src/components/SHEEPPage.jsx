import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { SHEEP_STEPS } from '../data/constants';

function SHEEPPage({ lang, addXP, setView }) {
  const [activeStep, setActiveStep] = useState(0);
  const [checked, setChecked] = useState({});

  const toggleCheck = (stepIdx, qIdx) => {
    const key = `${stepIdx}-${qIdx}`;
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const currentStep = SHEEP_STEPS[activeStep];
  const questions = lang === 'bn' ? currentStep.questionsBn : currentStep.questionsEn;

  const allChecked = questions.every((_, i) => checked[`${activeStep}-${i}`]);

  const handleNext = () => {
    if (activeStep < SHEEP_STEPS.length - 1) {
      setActiveStep(s => s + 1);
      window.scrollTo(0, 0);
    } else {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      addXP(50, lang === 'bn' ? 'SHEEP ফ্রেমওয়ার্ক মাস্টার' : 'SHEEP Framework Master');
      setView('home');
    }
  };

  return (
    <div className="section" style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="section-tag">Methodology</div>
      <h2 className="section-title">SHEEP {lang === 'bn' ? 'যাচাই পদ্ধতি' : 'Verification Framework'}</h2>
      <p className="section-sub">
        {lang === 'bn'
          ? 'তথ্য যাচাইয়ের একটি সহজ ও কার্যকর ফ্রেমওয়ার্ক। প্রতিটি ধাপ সম্পন্ন করে এগিয়ে যান।'
          : 'A simple and effective framework for fact-checking. Complete each step to proceed.'}
      </p>

      {/* Progress Circles */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32, position: 'relative' }}>
        <div style={{ position: 'absolute', top: '16px', left: 0, right: 0, height: '2px', background: 'var(--border)', zIndex: 0 }} />
        {SHEEP_STEPS.map((s, i) => (
          <div
            key={i}
            onClick={() => i <= activeStep && setActiveStep(i)}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: i === activeStep ? 'var(--primary)' : i < activeStep ? 'var(--green)' : 'var(--card-bg)',
              color: i <= activeStep ? 'white' : 'var(--light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, zIndex: 1, cursor: i <= activeStep ? 'pointer' : 'default',
              border: `2px solid ${i === activeStep ? 'var(--primary)' : i < activeStep ? 'var(--green)' : 'var(--border)'}`,
              transition: 'all 0.3s'
            }}
          >
            {i < activeStep ? '✓' : s.letter}
          </div>
        ))}
      </div>

      <div className="card sheep-step" style={{ borderTop: `6px solid ${currentStep.color}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span style={{ fontSize: 32 }}>{currentStep.icon}</span>
          <div>
            <h3 style={{ fontSize: 20, color: 'var(--text)' }}>
              {currentStep.letter} - {lang === 'bn' ? currentStep.wordBn : currentStep.wordEn}
            </h3>
            <p style={{ color: 'var(--light)', fontSize: 14 }}>{lang === 'bn' ? currentStep.titleBn : currentStep.titleEn}</p>
          </div>
        </div>

        <div className="checklist" style={{ margin: '24px 0' }}>
          {questions.map((q, i) => (
            <label key={i} style={{
              display: 'flex', gap: 12, padding: '12px 16px', borderRadius: 8,
              background: checked[`${activeStep}-${i}`] ? 'var(--primary-pale)' : 'var(--bg-color)',
              cursor: 'pointer', transition: 'all 0.2s', border: '1px solid var(--border)', marginBottom: 8
            }}>
              <input
                type="checkbox"
                checked={!!checked[`${activeStep}-${i}`]}
                onChange={() => toggleCheck(activeStep, i)}
                style={{ width: 18, height: 18, accentColor: 'var(--primary)' }}
              />
              <span style={{ fontSize: 14, color: checked[`${activeStep}-${i}`] ? 'var(--primary-dark)' : 'var(--text)' }}>{q}</span>
            </label>
          ))}
        </div>

        {allChecked && (
          <div className="intro-card" style={{ background: 'var(--bg-alt)', borderLeftColor: currentStep.color, animation: 'fadeIn 0.3s ease' }}>
             <p style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>💡 {lang === 'bn' ? 'প্রো টিপ:' : 'Pro Tip:'}</p>
             <p>{lang === 'bn' ? currentStep.tipBn : currentStep.tipEn}</p>
          </div>
        )}

        <button
          className="btn-primary"
          style={{ width: '100%', marginTop: 16, opacity: allChecked ? 1 : 0.5 }}
          disabled={!allChecked}
          onClick={handleNext}
        >
          {activeStep === SHEEP_STEPS.length - 1
            ? (lang === 'bn' ? 'সম্পন্ন করুন' : 'Finish Mastery')
            : (lang === 'bn' ? 'পরবর্তী ধাপ' : 'Next Step')}
        </button>
      </div>
    </div>
  );
}

export default SHEEPPage;
