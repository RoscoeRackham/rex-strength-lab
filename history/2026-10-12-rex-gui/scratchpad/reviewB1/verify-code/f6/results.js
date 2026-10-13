global.window = {};
const base = process.argv[2];
const P = require(base + '/src/engine.js');
require(base + '/src/data.js');
const D = window.DINO_DATA;
const { cases } = require(base + '/test/powers-off-cases.js');
const tally = {}, toss = {};
for (const c of cases(P, D)) {
  if (c.key.startsWith('catch|')) { const L = c.run({}); const r = L ? L.result : 'null'; tally[r] = (tally[r] || 0) + 1; }
  if (c.key.startsWith('toss|')) { const L = c.run({}); toss[c.key] = L && L.result; }
}
console.log('catch results', tally);
console.log('toss results', toss);
