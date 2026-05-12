import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { GAME_SCENARIOS } from '../data/constants';

function RumorFactoryPage({ lang, addXP, earnBadge }) {
  const [step, setStep] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [credibility, setCredibility] = useState(100);
  const [feedback, setFeedback] = useState(null);
  const [history, setHistory] = useState([]);
  const [gameEnded, setGameEnded] = useState(false);

  const handleChoice = (choice) => {
    setFollowers(f => Math.max(0, f + (choice.followers || 0)));
    setCredibility(c => Math.max(0, Math.min(100, c + (choice.credibility || 0))));
    setFeedback(lang === 'bn' ? choice.feedbackBn : choice.feedbackEn);

    if (choice.badge) {
      earnBadge(choice.badge);
    }

    if (choice.postBn) {
      setHistory(h => [...h, { bn: choice.postBn, en: choice.postEn, icon: choice.badge?.icon || '📢' }]);
    }
  };

  const nextStep = () => {
    setFeedback(null);
    if (step < GAME_SCENARIOS.length - 1) {
      setStep(s => s + 1);
    } else {
      setGameEnded(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      addXP(50, lang === 'bn' ? 'ইনোকুলেশন থিওরি মাস্টার' : 'Inoculation Theory Master');
    }
  };

  if (gameEnded) {
    return (
      <div className="rf-page">
        <div className="section" style={{ maxWidth: 700, margin: '0 auto' }}>
          <div className="card rf-debrief" style={{ textAlign: 'center' }}>
            <h2 className="rf-debrief-title">🏁 {lang === 'bn' ? 'খেলা শেষ!' : 'Game Over!'}</h2>
            <div className="rf-stats" style={{ margin: '24px 0' }}>
              <div className="rf-stat">
                <div className="rf-stat-val">{followers}</div>
                <div className="rf-stat-label">Followers</div>
              </div>
              <div className="rf-stat">
                <div className="rf-stat-val">{credibility}%</div>
                <div className="rf-stat-label">Credibility</div>
              </div>
            </div>

            <div style={{ textAlign: 'left', lineHeight: 1.6 }}>
              <h3 style={{ marginBottom: 12 }}>{lang === 'bn' ? 'কেন আমরা এটি খেললাম?' : 'Why did we play this?'}</h3>
              <p style={{ marginBottom: 16 }}>
                {lang === 'bn'
                  ? 'আপনি এইমাত্র "Inoculation Theory" বা "জ্ঞানীয় টিকাদান" পদ্ধতির মধ্য দিয়ে গেলেন। যেমন ভাইরাসের বিরুদ্ধে ভ্যাকসিন আমাদের রোগ প্রতিরোধ ক্ষমতা বাড়ায়, তেমনি মিথ্যা তথ্যের কৌশলগুলো আগে থেকে জানলে আপনি ভবিষ্যতে বাস্তব জীবনে সেগুলো সহজে সনাক্ত করতে পারবেন।'
                  : 'You just experienced "Inoculation Theory". Just like a vaccine builds immunity against a virus, exposing you to weakened forms of manipulation tactics helps you recognize and resist them in the real world.'}
              </p>
              <div className="rf-mentor">
                <strong>{lang === 'bn' ? 'মনে রাখবেন:' : 'Remember:'}</strong> {lang === 'bn' ? 'আবেগ ব্যবহার করা, ছদ্মবেশ ধারণ করা এবং ষড়যন্ত্রতত্ত্ব ছড়ানো হলো গুজব ভাইরাল করার মূল অস্ত্র।' : 'Using emotion, impersonation, and conspiracy theories are the main weapons for making rumors go viral.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const s = GAME_SCENARIOS[step];

  return (
    <div className="rf-page">
      <div className="rf-header">
        <div className="rf-title">🏭 {lang === 'bn' ? 'গুজব কারখানা' : 'Rumor Factory'}</div>
        <div className="rf-stats">
          <div className="rf-stat">
            <div className="rf-stat-val">{followers}</div>
            <div className="rf-stat-label">Followers</div>
          </div>
          <div className="rf-stat">
            <div className="rf-stat-val" style={{ color: credibility < 30 ? 'var(--red)' : 'var(--accent)' }}>{credibility}%</div>
            <div className="rf-stat-label">Credibility</div>
          </div>
          <div className="rf-stat">
            <div className="rf-stat-val">{step + 1}/{GAME_SCENARIOS.length}</div>
            <div className="rf-stat-label">Stage</div>
          </div>
        </div>
      </div>

      <div className="section" style={{ maxWidth: 700, margin: '0 auto', paddingTop: 20 }}>
        <div className="rf-mentor">
          <strong>Mentor:</strong> {lang === 'bn' ? s.mentorBn : s.mentorEn}
        </div>

        {!feedback ? (
          <div className="rf-choices">
            {s.choices.map((c, i) => (
              <button key={i} className="rf-choice" onClick={() => handleChoice(c)}>
                {lang === 'bn' ? c.textBn : c.textEn}
              </button>
            ))}
          </div>
        ) : (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div className="rf-feedback">
              {feedback}
            </div>
            <button className="btn-primary" style={{ width: '100%' }} onClick={nextStep}>
              {lang === 'bn' ? 'পরবর্তী ধাপ' : 'Next Step'} →
            </button>
          </div>
        )}

        {history.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <h4 style={{ fontSize: 12, textTransform: 'uppercase', color: '#64748B', marginBottom: 12 }}>{lang === 'bn' ? 'আপনার ছড়ানো গুজবসমূহ:' : 'Your Viral Posts:'}</h4>
            <div className="rf-feed">
              {[...history].reverse().map((h, i) => (
                <div key={i} className="rf-feed-post">
                   <div style={{ display: 'flex', gap: 10 }}>
                     <span style={{ fontSize: 20 }}>{h.icon}</span>
                     <div>{lang === 'bn' ? h.bn : h.en}</div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RumorFactoryPage;
