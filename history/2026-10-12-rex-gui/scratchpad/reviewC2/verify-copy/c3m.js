const which=process.argv[2];
const R='/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewC2/verify-copy/'+which+'/rex-strength-lab/';
global.window={}; require(R+'src/data.js'); const D=window.DINO_DATA;
const re=/\^|\bx 10|\berg\b|existing fact|\(fact [a-z_]+|\d\.?\d*e\d|\bd15\b|\bHNe\b/;
let rowsAll=D.sourceRows.filter(r=>!/^Energy:/.test(r.label)); let n=0, ex=[];
for (const r of rowsAll){ const bad=(r.sources||[]).filter(s=>re.test(s.title)); if(bad.length){n++; ex.push(r.label.slice(0,50)+' || '+bad[0].title.slice(0,150));}}
console.log(which,'non-energy rows',rowsAll.length,'with raw titles',n); ex.slice(0,12).forEach(x=>console.log('  ',x));
