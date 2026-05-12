import React, { useState } from 'react';

function AICheckerPage({ lang, addXP }) {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);

  const checkText = () => {
    if (!text.trim()) return;

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

    let verdict = 'likely_real';
    if (score > 60) verdict = 'highly_suspicious';
    else if (score > 30) verdict = 'needs_verification';

    setResult({ score, flags, verdict });
    addXP(10, lang === 'bn' ? 'AI বিশ্লেষণ সম্পন্ন' : 'AI Analysis complete');
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

      <div className="card" style={{ padding: 32 }}>
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
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
          placeholder={lang === 'bn' ? 'এখানে টেক্সট পেস্ট করুন (যেমন: ব্রেকিং নিউজ, সোশ্যাল মিডিয়া পোস্ট)...' : 'Paste text here (e.g., breaking news, social media posts)...'}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          className="btn-primary"
          style={{ width: '100%', padding: 16, fontSize: 16, borderRadius: 12 }}
          onClick={checkText}
          disabled={!text.trim()}
        >
          🔍 {lang === 'bn' ? 'বিশ্লেষণ শুরু করুন' : 'Start Analysis'}
        </button>
      </div>

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
              {result.verdict === 'highly_suspicious' ? (lang === 'bn' ? '🚩 অত্যন্ত সন্দেহজনক' : '🚩 Highly Suspicious') :
               result.verdict === 'needs_verification' ? (lang === 'bn' ? '⚠️ যাচাই প্রয়োজন' : '⚠️ Needs Verification') :
               (lang === 'bn' ? '✅ সম্ভবত নির্ভরযোগ্য' : '✅ Likely Reliable')}
            </div>
          </div>

          <div style={{ background: 'var(--bg-alt)', padding: 20, borderRadius: 12, marginBottom: 24 }}>
            <h4 style={{ fontSize: 14, textTransform: 'uppercase', color: 'var(--light)', marginBottom: 12, letterSpacing: 1 }}>
              {lang === 'bn' ? 'চিহ্নিত রেড ফ্ল্যাগসমূহ:' : 'Detected Red Flags:'}
            </h4>
            {result.flags.length > 0 ? (
              <ul style={{ paddingLeft: 20, color: 'var(--text)' }}>
                {result.flags.map((f, i) => <li key={i} style={{ marginBottom: 10, fontSize: 15 }}>{f}</li>)}
              </ul>
            ) : (
              <p style={{ color: 'var(--green)', fontWeight: 500 }}>
                {lang === 'bn' ? 'কোনো নেতিবাচক প্যাটার্ন পাওয়া যায়নি।' : 'No negative patterns detected.'}
              </p>
            )}
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
