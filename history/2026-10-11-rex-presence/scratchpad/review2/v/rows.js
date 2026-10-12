global.window={}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D=global.window.DINO_DATA;
console.log(Object.keys(D.sourceRows[0]));
for (const r of D.sourceRows) if (/recommended page value/i.test(r.label||r.what||'')) console.log((r.label||r.what).slice(0,90),'|',(r.sources||r.src||[]).map(s=>s.url.slice(0,60)));
