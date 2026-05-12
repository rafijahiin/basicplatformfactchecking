import React, { useState } from 'react';

function AICheckerPage({ lang, addXP }) {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkText = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);

    let score = 0;
    const flags = [];

    // 1. ALL CAPS (Urgency/Shouting)
    const upperCaseMatches = text.match(/[A-Z]{4,}/g);
    if (upperCaseMatches && upperCaseMatches.length > 0) {
      score += 25;
      flags.push(lang === 'bn' ? 'অতিরিক্ত বড় হাতের অক্ষর (চিৎকার করা)' : 'Excessive ALL CAPS (Shouting)');
    }

    // 2. Emotional/Urgency keywords
    const urgencyWords = ['breaking', 'emergency', 'urgent', 'share now', 'warn your family', 'ব্রেকিং', 'জরুরি', 'সতর্ক', 'শেয়ার করুন', 'লুকাচ্ছে', 'ফাঁস'];
    const foundUrgency = urgencyWords.filter(w => text.toLowerCase().includes(w));
    if (foundUrgency.length > 0) {
      score += 25;
      flags.push(lang === 'bn' ? 'তীব্র আবেগ বা জরুরিতা তৈরির চেষ্টা' : 'Attempts to create urgency or strong emotion');
    }

    // 3. Excessive Punctuation
    if ((text.match(/!/g) || []).length > 3 || (text.match(/\?/g) || []).length > 3) {
      score += 15;
      flags.push(lang === 'bn' ? 'অতিরিক্ত বিস্ময়সূচক বা প্রশ্নবোধক চিহ্ন' : 'Excessive punctuation (!!! or ???)');
    }

    // 4. Source indicators
    const sourcePatterns = ['according to', 'source:', 'verified by', 'সূত্র:', 'অনুসারে'];
    const hasSource = sourcePatterns.some(p => text.toLowerCase().includes(p));
    if (!hasSource && text.length > 50) {
      score += 20;
      flags.push(lang === 'bn' ? 'কোনো সুনির্দিষ্ট সূত্র বা লিঙ্ক নেই' : 'No specific source or link mentioned');
    }

    // --- NEW: Automated Search Verification ---
    let searchVerdict = null;
    let logic = '';
    let sources = [];

    try {
      const response = await fetch('/api/verify-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        sources = data.results;

        const debunkKeywords = ['fake', 'rumor', 'hoax', 'misleading', 'debunked', 'fabricated', 'untrue', 'ভুল', 'গুজব', 'অসত্য', 'বানোয়াট', 'মিথ্যা', 'ভিত্তিহীন', 'অপপ্রচার', 'সতর্কবার্তা'];
        const factCheckers = ['rumorscanner.com', 'factwatch.org', 'boomlive.in', 'afp.com', 'factcheck.org', 'snopes.com', 'check4spam.com', 'altnews.in'];

        let debunkCount = 0;
        let factCheckerCount = 0;
        let relevantCount = 0;

        data.results.forEach(res => {
          const content = (res.title + ' ' + res.snippet).toLowerCase();
          const isDebunk = debunkKeywords.some(k => content.includes(k));
          const isFC = factCheckers.some(fc => res.link.toLowerCase().includes(fc)) || res.trustScore >= 10;

          if (isDebunk) debunkCount += (res.trustScore >= 10 ? 2 : 1);
          if (isFC) factCheckerCount++;

          // Use basic vector-like similarity (word overlap)
          const queryWords = text.toLowerCase().split(/\s+/).filter(w => w.length > 3);
          const overlap = queryWords.filter(w => content.includes(w)).length;
          if (overlap / queryWords.length > 0.4) {
             relevantCount++;
          }
        });

        if (debunkCount >= 1 || factCheckerCount >= 1) {
          searchVerdict = 'highly_suspicious';
          score += 60;
          logic = lang === 'bn'
            ? `অনলাইন অনুসন্ধানে ফ্যাক্ট-চেকিং রিপোর্ট বা সতর্কতামূলক প্যাটার্ন পাওয়া গেছে। এটি গুজব হওয়ার উচ্চ সম্ভাবনা রয়েছে।`
            : `Online search found fact-check reports or warning patterns. There is a high probability this is a rumor.`;
        } else if (relevantCount > 4) {
          // If many relevant news sources mention it WITHOUT debunk keywords, it might be real
          // but we still stay cautious
          searchVerdict = 'needs_verification';
          logic = lang === 'bn'
            ? 'বিভিন্ন মাধ্যমে খবরটি দেখা যাচ্ছে, তবে কোনো সরাসরি ফ্যাক্ট-চেক পাওয়া যায়নি। অধিক নিশ্চিত হতে মূলধারার সংবাদমাধ্যম যাচাই করুন।'
            : 'The news appears in various outlets, but no direct fact-check was found. Verify with mainstream news for certainty.';
        } else {
          searchVerdict = 'needs_verification';
          logic = lang === 'bn'
            ? 'এই বিষয়ে পর্যাপ্ত নিশ্চিত তথ্য বা কোনো ফ্যাক্ট-চেক পাওয়া যায়নি। তথ্যটি শেয়ার করার আগে সতর্ক থাকুন।'
            : 'No sufficient verified information or fact-checks found. Exercise caution before sharing.';
        }
      }
    } catch (err) {
      console.error('Verification failed', err);
    }

    let finalVerdict = 'needs_verification';
    if (score > 50 || searchVerdict === 'highly_suspicious') finalVerdict = 'highly_suspicious';
    else if (score < 20 && searchVerdict === 'likely_real') finalVerdict = 'likely_real'; // We removed likely_real from searchVerdict for now

    setResult({ score, flags, verdict: finalVerdict, logic, sources });
    setLoading(false);
    addXP(20, lang === 'bn' ? 'স্বয়ংক্রিয় সত্যতা যাচাই সম্পন্ন' : 'Automated Fact-Check complete');
  };

  return (
    <div className="section" style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="section-tag">{lang === 'bn' ? 'প্রযুক্তি' : 'Technology'}</div>
      <h2 className="section-title">{lang === 'bn' ? 'AI কন্টেন্ট ডিটেক্টর' : 'AI Content Detector'}</h2>
      <p className="section-sub">
        {lang === 'bn'
          ? 'যেকোনো খবরের টেক্সট পেস্ট করুন। আমাদের অ্যালগরিদম মিথ্যা তথ্যের সাধারণ প্যাটার্নগুলো খুঁজে বের করবে।'
          : 'Paste any news text below. Our algorithm scans for patterns common in misinformation.'}
      </p>

      <div className="card" style={{ padding: 32, position: 'relative' }}>
        <textarea
          className="font-bn"
          style={{
            width: '100%',
            minHeight: 200,
            padding: 20,
            borderRadius: 12,
            border: '2px solid var(--border)',
            fontSize: 16,
            marginBottom: 20,
            background: 'var(--bg-color)',
            color: 'var(--text)',
            outline: 'none',
            transition: 'border-color 0.2s',
            resize: 'vertical'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
          placeholder={lang === 'bn' ? 'এখানে টেক্সট পেস্ট করুন (যেমন: ব্রেকিং নিউজ, সোশ্যাল মিডিয়া পোস্ট)...' : 'Paste text here (e.g., breaking news, social media posts)...'}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {text && !loading && (
          <button
            onClick={() => { setText(''); setResult(null); }}
            style={{ position: 'absolute', top: 45, right: 45, background: 'var(--bg-alt)', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', color: 'var(--light)', fontSize: 12 }}
          >
            ✕
          </button>
        )}
        <button
          className="btn-primary"
          style={{ width: '100%', padding: 16, fontSize: 16, borderRadius: 12, opacity: loading ? 0.7 : 1 }}
          onClick={checkText}
          disabled={!text.trim() || loading}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <div className="spinner" style={{ width: 18, height: 18, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
              {lang === 'bn' ? 'অনুসন্ধান ও যাচাই চলছে...' : 'Searching & Verifying...'}
            </span>
          ) : (
            <span>🔍 {lang === 'bn' ? 'বিশ্লেষণ ও সত্যতা যাচাই করুন' : 'Analyze & Verify Facts'}</span>
          )}
        </button>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {result && (
        <div className="ai-result card" style={{
          marginTop: 32,
          padding: 32,
          animation: 'fadeIn 0.5s ease',
          borderTop: `8px solid ${result.verdict === 'highly_suspicious' ? 'var(--red)' : result.verdict === 'needs_verification' ? 'var(--yellow)' : 'var(--green)'}`
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontSize: 20 }}>{lang === 'bn' ? 'বিশ্লেষণ রিপোর্ট' : 'Analysis Report'}</h3>
            <div className={`verdict-pill ${result.verdict === 'highly_suspicious' ? 'verdict-false' : result.verdict === 'needs_verification' ? 'verdict-partial' : 'verdict-true'}`} style={{ margin: 0, padding: '8px 16px' }}>
        {result.verdict === 'highly_suspicious' ? (lang === 'bn' ? '🚩 অত্যন্ত সন্দেহজনক / গুজব' : '🚩 Highly Suspicious / Rumor') :
               result.verdict === 'needs_verification' ? (lang === 'bn' ? '🔍 আরও যাচাই প্রয়োজন' : '🔍 Further Verification Needed') :
               (lang === 'bn' ? '✅ নির্ভরযোগ্য উৎস পাওয়া গেছে' : '✅ Reliable Sources Found')}
            </div>
          </div>

          <div style={{
            background: result.verdict === 'highly_suspicious' ? 'var(--red-light)' : 'var(--primary-pale)',
            padding: 20,
            borderRadius: 12,
            marginBottom: 24,
            borderLeft: `4px solid ${result.verdict === 'highly_suspicious' ? 'var(--red)' : 'var(--primary)'}`
          }}>
            <h4 style={{
              fontSize: 14,
              textTransform: 'uppercase',
              color: result.verdict === 'highly_suspicious' ? 'var(--red)' : 'var(--primary)',
              marginBottom: 8,
              letterSpacing: 1
            }}>
              {lang === 'bn' ? 'যাচাইকরণের যুক্তি (Analysis Logic):' : 'Verification Logic:'}
            </h4>
            <p style={{ fontSize: 16, lineHeight: 1.6, fontWeight: 500 }}>{result.logic || (lang === 'bn' ? 'প্যাটার্ন ভিত্তিক বিশ্লেষণ সম্পন্ন।' : 'Pattern-based analysis completed.')}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
            <div style={{ background: 'var(--bg-alt)', padding: 20, borderRadius: 12 }}>
              <h4 style={{ fontSize: 13, textTransform: 'uppercase', color: 'var(--light)', marginBottom: 12 }}>
                {lang === 'bn' ? 'চিহ্নিত রেড ফ্ল্যাগসমূহ:' : 'Detected Red Flags:'}
              </h4>
              {result.flags.length > 0 ? (
                <ul style={{ paddingLeft: 18, color: 'var(--text)', fontSize: 14 }}>
                  {result.flags.map((f, i) => <li key={i} style={{ marginBottom: 6 }}>{f}</li>)}
                </ul>
              ) : (
                <p style={{ color: 'var(--green)', fontSize: 14 }}>{lang === 'bn' ? 'কোনো প্যাটার্ন পাওয়া যায়নি' : 'No patterns detected'}</p>
              )}
            </div>

            <div style={{ background: 'var(--bg-alt)', padding: 20, borderRadius: 12 }}>
              <h4 style={{ fontSize: 13, textTransform: 'uppercase', color: 'var(--light)', marginBottom: 12 }}>
                {lang === 'bn' ? 'শীর্ষ নির্ভরযোগ্য উৎসসমূহ:' : 'Top Trusted Sources:'}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {result.sources && result.sources.length > 0 ? result.sources.slice(0, 4).map((s, i) => (
                  <a key={i} href={s.link.startsWith('http') ? s.link : `https://${s.link}`} target="_blank" rel="noreferrer" style={{
                    fontSize: 12,
                    color: s.trustScore >= 10 ? 'var(--green)' : 'var(--primary)',
                    textDecoration: 'none',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}>
                    {s.trustScore >= 10 ? '🛡️' : '🔗'} {s.title}
                  </a>
                )) : <p style={{ fontSize: 13 }}>{lang === 'bn' ? 'কোনো উৎস পাওয়া যায়নি' : 'No sources found'}</p>}
              </div>
            </div>
          </div>

          <div style={{ fontSize: 13, color: 'var(--light)', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 18 }}>ℹ️</span>
            <div>
              <strong>Disclaimer:</strong> {lang === 'bn'
                ? 'এটি একটি প্যাটার্ন-বেসড কৃত্রিম বুদ্ধিমত্তা টুল। এটি তথ্যের সত্যতা সরাসরি যাচাই করে না, বরং টেক্সটের গঠন ও ভাষা বিশ্লেষণ করে সন্দেহজনক লক্ষণগুলো খুঁজে বের করে। চূড়ান্ত সিদ্ধান্তের জন্য সর্বদা নির্ভরযোগ্য ফ্যাক্ট-চেক সাইটগুলো দেখুন।'
                : 'This is a pattern-based AI tool. It doesn\'t verify facts directly but analyzes text structure and language to find suspicious signs. Always consult reliable fact-checking sites for final decisions.'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AICheckerPage;
