const fs=require('fs');const {execSync}=require('child_process');
const load=(src)=>{const m={exports:{}};const f=new Function("module","window",src);f(m,{});return m.exports;};
const nw=load(fs.readFileSync('src/static-data.js','utf8'));
const ow=load(execSync('git show origin/claude/canon-3-passenger:rex-strength-lab/src/static-data.js').toString());
const find=(w)=>{for(const k of Object.keys(w)){const v=w[k];return v;}};
console.log(Object.keys(nw));
const N=JSON.stringify(nw), O=JSON.stringify(ow);
// collect cards
function cards(w){const out={};const walk=(x)=>{if(Array.isArray(x))x.forEach(walk);else if(x&&typeof x==='object'){if(x.t&&x.d)out[x.t]=x.d;Object.values(x).forEach(walk);}};walk(w);return out;}
const cn=cards(nw), co=cards(ow);
for(const t of Object.keys(cn)) if(cn[t]!==co[t]) console.log('=== '+t+'\nOLD: '+(co[t]||'(none)')+'\nNEW: '+cn[t]+'\n');
