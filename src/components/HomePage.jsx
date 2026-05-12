import React from 'react';
import { getLevel } from '../data/utils';

function HomePage({ setView, lang, level, xp, completedUnits }) {
  const pillars = [
    {icon:'🕵️',bn:'সনাক্ত করুন',en:'Identify',desc:lang==='bn'?'মিথ্যা তথ্যের ধরন ও কৌশল চিনুন':'Recognise types and tactics of false information'},
    {icon:'🔍',bn:'যাচাই করুন',en:'Verify',desc:lang==='bn'?'SHEEP, Lateral Reading ও OSINT টুল ব্যবহার করুন':'Use SHEEP, Lateral Reading & OSINT tools'},
    {icon:'🛡️',bn:'মোকাবেলা করুন',en:'Counter',desc:lang==='bn'?'নিরাপদে ও কার্যকরভাবে সাড়া দিন':'Respond safely and effectively'},
  ];
  return (
    <div className="page">
      <div className="section" style={{background:'linear-gradient(135deg,var(--primary-dark),var(--primary-mid))',color:'white',textAlign:'center'}}>
        <div style={{fontSize:12,fontFamily:'Roboto Mono,monospace',color:'var(--primary-light)',letterSpacing:2,marginBottom:12,textTransform:'uppercase',fontWeight:500}}>#ThinkBeforeYouShare</div>
        <h1 style={{fontFamily:'Inter,sans-serif',fontSize:'clamp(28px,5vw,42px)',fontWeight:800,lineHeight:1.15,marginBottom:16,letterSpacing:'-0.02em'}}>
          {lang==='bn' ? 'মিথ্যা তথ্য মোকাবেলা করুন।।' : 'Fight Misinformation.'}
        </h1>
        <p style={{maxWidth:560,margin:'0 auto 24px',opacity:0.85,lineHeight:1.7,fontSize:15}}>
          {lang==='bn'
            ? 'UNESCO MIL মডিউল ৪, Stanford Lateral Reading ও Cambridge Inoculation Theory-র উপর ভিত্তি করে তৈরি বাংলাদেশের প্রথম গেমিফাইড ফ্যাক্ট-চেক প্ল্যাটফর্ম।'
            : 'Bangladesh\'s first gamified fact-check platform — grounded in UNESCO MIL Module 4, Stanford Lateral Reading, and Cambridge Inoculation Theory.'}
        </p>
        <div style={{display:'flex',justifyContent:'center',gap:12,flexWrap:'wrap'}}>
          <button className="btn-primary" onClick={() => setView('game')}>🎮 {lang==='bn' ? 'খেলুন' : 'Play Now'}</button>
          <button onClick={() => setView('mil')} style={{padding:'10px 24px',background:'rgba(255,255,255,0.1)',color:'white',border:'1px solid rgba(255,255,255,0.3)',borderRadius:6,fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:'Inter,sans-serif',transition:'all 0.2s'}}>
            📚 {lang==='bn' ? 'শিখুন' : 'Learn'}
          </button>
        </div>
      </div>

      <div className="section" style={{background:'white',borderBottom:'1px solid var(--border)'}}>
        <div style={{maxWidth:800,margin:'0 auto'}}>
          <div className="section-tag">{lang==='bn' ? 'তিনটি দক্ষতা' : 'Three Skills'}</div>
          <h2 className="section-title">{lang==='bn' ? 'তিনটি অভ্যাস। একটি লক্ষ্য।' : 'Three Habits. One Mission.'}</h2>
          <div className="card-grid">
            {pillars.map((p,i) => (
              <div key={i} className="card" style={{textAlign:'center'}}>
                <div style={{fontSize:32,marginBottom:10}}>{p.icon}</div>
                <div style={{fontFamily:'Inter,sans-serif',fontWeight:700,fontSize:16,marginBottom:6,color:'var(--dark)'}}>{lang==='bn'?p.bn:p.en}</div>
                <div style={{fontSize:13,color:'var(--mid)',lineHeight:1.6}}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section" style={{background:'var(--bg-color)'}}>
        <div style={{maxWidth:800,margin:'0 auto'}}>
          <div className="section-tag">{lang==='bn' ? 'আপনার অগ্রগতি' : 'Your Progress'}</div>
          <h2 className="section-title">{lang==='bn' ? `আপনি এখন: ${level.icon} ${level.title}` : `You are: ${level.icon} ${level.titleEn}`}</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:12,marginBottom:24}}>
            {[
              {label:lang==='bn'?'মোট XP':'Total XP',value:`${xp}`,icon:'⚡'},
              {label:lang==='bn'?'সম্পন্ন ইউনিট':'Units Done',value:`${completedUnits.length}/5`,icon:'📚'},
              {label:lang==='bn'?'পরবর্তী স্তর':'Next Level',value:`${Math.max(0,getLevel(xp+1).min-xp)} XP`,icon:'🎯'},
            ].map((s,i) => (
              <div key={i} style={{background:'white',borderRadius:8,padding:'16px',textAlign:'center',border:'1px solid var(--border)',boxShadow:'0 1px 2px rgba(0,0,0,0.02)'}}>
                <div style={{fontSize:22,marginBottom:4}}>{s.icon}</div>
                <div style={{fontFamily:'Inter,sans-serif',fontSize:24,fontWeight:800,color:'var(--primary-dark)',letterSpacing:'-0.02em'}}>{s.value}</div>
                <div style={{fontSize:12,color:'var(--mid)',fontWeight:500}}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:12}}>
            {[
              {id:'game',icon:'🎮',bn:'ভুয়া পোস্ট ধরুন',en:'Spot the Fake',color:'var(--primary)'},
              {id:'rumor',icon:'🏭',bn:'গুজব কারখানা',en:'Rumor Factory',color:'var(--primary-dark)'},
              {id:'sheep',icon:'🐑',bn:'SHEEP যাচাই',en:'SHEEP Framework',color:'var(--accent)'},
              {id:'ai',icon:'🤖',bn:'AI ফ্যাক্ট-চেক',en:'AI Fact-Check',color:'var(--mid)'},
            ].map(a => (
              <button key={a.id} onClick={() => setView(a.id)} style={{padding:'16px 12px',background:a.color,color:'white',border:'none',borderRadius:8,cursor:'pointer',fontSize:14,fontWeight:600,fontFamily:'Inter,sans-serif',display:'flex',flexDirection:'column',alignItems:'center',gap:8,boxShadow:'0 2px 4px rgba(0,0,0,0.1)'}}>
                <span style={{fontSize:24}}>{a.icon}</span>
                {lang==='bn'?a.bn:a.en}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
