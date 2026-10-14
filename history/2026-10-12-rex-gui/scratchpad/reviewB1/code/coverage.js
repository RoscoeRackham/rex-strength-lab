global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const { cases } = require('/home/user/rex-strength-lab/rex-strength-lab/test/powers-off-cases.js');
const res = {}, coll = {}, toss = {}, rel = { throwRel: 0 }, grow = {};
for (const c of cases(P, D)) {
  if (c.key.startsWith('catch|')) { const L = c.run({}); res[L.result] = (res[L.result] || 0) + 1; }
  else if (c.key.startsWith('collide')) { const r = c.run({}); const k = r && (r.outcome || (r.blackHole ? 'bh' : r.noCharge ? 'noCharge' : r.planetScale ? 'planet' : '?')); coll[k] = (coll[k] || 0) + 1; }
  else if (c.key.startsWith('toss|')) { const r = c.run({}); toss[r.result] = (toss[r.result] || 0) + 1; }
  else if (c.key.startsWith('instant') || c.key.startsWith('runaway')) { const r = c.run({}); const k = c.key.split('|')[0] + ':' + (r.gives ? 'gives' : 'holds'); grow[k] = (grow[k] || 0) + 1; }
}
console.log('catch results', res); console.log('collide outcomes', coll); console.log('toss', toss); console.log('growth', grow);
// all catch results that exist in the engine
const src = require('fs').readFileSync('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js', 'utf8');
console.log('results in engine:', [...new Set([...src.matchAll(/result: '([a-z-]+)'/g)].map((m) => m[1]))].join(' '));
console.log('out.result =', [...new Set([...src.matchAll(/out\.result = '([a-z-]+)'/g)].map((m) => m[1]))].join(' '));
