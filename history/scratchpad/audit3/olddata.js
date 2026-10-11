const fs=require('fs');
function load(file){ const h=fs.readFileSync(file,'utf8'); const i=h.indexOf('window.DINO_DATA = '); const j=h.indexOf('};\n', i); const txt=h.slice(i+'window.DINO_DATA = '.length, j+1); return eval('('+txt+')'); }
const O=load('/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/claims/preview.html');
global.window={}; require('/home/user/dino-strength-sim/src/data.js'); const N=window.DINO_DATA;
const keys=new Set([...Object.keys(O),...Object.keys(N)]);
for (const k of keys){ const a=JSON.stringify(O[k]), b=JSON.stringify(N[k]); if(a!==b) console.log('CHANGED', k); }
// objects numeric changes
for (const o of N.objects){ const p=O.objects.find(x=>x.id===o.id); if(!p){console.log('NEW OBJ',o.id);continue;} for (const f of new Set([...Object.keys(o),...Object.keys(p)])) if(JSON.stringify(o[f])!==JSON.stringify(p[f])) console.log('OBJ',o.id,f,JSON.stringify(p[f]),'->',JSON.stringify(o[f])); }
for (const t of N.tiers){ const p=O.tiers.find(x=>x.id===t.id); for (const f of new Set([...Object.keys(t),...Object.keys(p||{})])) if(JSON.stringify(t[f])!==JSON.stringify((p||{})[f])) console.log('TIER',t.id,f,JSON.stringify((p||{})[f]),'->',JSON.stringify(t[f])); }
for (const f of N.feats){ const p=O.feats.find(x=>x.title===f.title)||{}; for (const k of ['who','claim','status','run','source']) if(JSON.stringify(f[k])!==JSON.stringify(p[k])) console.log('FEAT',f.title,k,JSON.stringify(p[k]),'->',JSON.stringify(f[k])); }
for (const k of ['surfaces','energyRefs','overpressure','heights','speeds','calibration']) if (JSON.stringify(O[k])!==JSON.stringify(N[k])) { const a=O[k], b=N[k]; for (let i=0;i<Math.max(a.length,b.length);i++) if(JSON.stringify(a[i])!==JSON.stringify(b[i])) console.log(k, JSON.stringify(a[i]), '->', JSON.stringify(b[i])); }
for (let i=0;i<N.assumptions.length;i++) if (JSON.stringify(N.assumptions[i])!==JSON.stringify(O.assumptions.find(a=>a.t===N.assumptions[i].t))) console.log('ASSUME', JSON.stringify(O.assumptions.find(a=>a.t===N.assumptions[i].t)||O.assumptions[i]), '\n  ->', JSON.stringify(N.assumptions[i]));
const ol=new Map(O.sourceRows.map(r=>[r.label,r])); for (const r of N.sourceRows){ const p=ol.get(r.label); if(!p) console.log('NEW ROW', r.label, '|', r.value, '|', r.status); else if (p.value!==r.value||p.status!==r.status) console.log('ROW', r.label, '|', p.value, p.status, '->', r.value, r.status); }
const nl=new Set(N.sourceRows.map(r=>r.label)); for (const r of O.sourceRows) if(!nl.has(r.label)) console.log('REMOVED ROW', r.label, '|', r.value);
