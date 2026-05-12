// ===== XP LEVELS =====
export const LEVELS = [
  {min:0,max:49,title:'শিক্ষার্থী',titleEn:'Student',icon:'📖'},
  {min:50,max:149,title:'অনুসন্ধানী',titleEn:'Investigator',icon:'🔍'},
  {min:150,max:299,title:'সত্য রক্ষক',titleEn:'Truth Defender',icon:'🛡️'},
  {min:300,max:499,title:'শান্তিনির্মাতা',titleEn:'Peacebuilder',icon:'🕊️'},
  {min:500,max:Infinity,title:'MIL মাস্টার',titleEn:'MIL Master',icon:'🏆'},
];

export function getLevel(xp){
  return LEVELS.find(l=>xp>=l.min&&xp<=l.max)||LEVELS[0];
}

export function getLevelPct(xp){
  const l=getLevel(xp);
  const range=l.max===Infinity?200:l.max-l.min;
  return Math.min(100,Math.round(((xp-l.min)/range)*100));
}
