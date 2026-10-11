global.window={};
require('/home/user/dino-strength-sim/src/data.js');
const D=window.DINO_DATA;
const S=require('/home/user/dino-strength-sim/src/static-data.js');
const fs=require('fs');
let ok=JSON.stringify(D.assumptions)===JSON.stringify(S.assumptions);
console.log('assumptions in sync:',ok);
const vals=new Set(D.sourceRows.map(r=>r.value));
for (const t of ['density','duo']) {
  const R=JSON.parse(fs.readFileSync('/home/user/dino-strength-sim/research/final-'+t+'.json'));
  for (const f of R.facts) if(!vals.has(f.display)) console.log('not in rows:',f.key);
}
console.log(D.densities);
