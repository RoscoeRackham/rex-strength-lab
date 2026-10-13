// Writes test/fixtures/powers-off.json: a fingerprint of every engine result in test/powers-off-cases.js, from an
// engine file. Run once on the engine as it was before the four powers (BRIEF-gui.md section 5), so test/powers.js
// can check that with them off the engine gives exactly the same results:
//   git show <commit before the powers>:rex-strength-lab/src/engine.js > /tmp/engine-before.js
//   node test/make-powers-off.js /tmp/engine-before.js src/data.js '<commit>'
global.window = {};
const path = require('path');
const P = require(path.resolve(process.argv[2] || path.join(__dirname, '..', 'src', 'engine.js')));
require(path.resolve(process.argv[3] || path.join(__dirname, '..', 'src', 'data.js')));
const D = window.DINO_DATA;
const { cases, canon, hash } = require('./powers-off-cases.js');
const out = {};
const t0 = Date.now();
for (const c of cases(P, D)) out[c.key] = hash(canon(c.run({})));
require('fs').writeFileSync(path.join(__dirname, 'fixtures', 'powers-off.json'), JSON.stringify({ note: 'Written by test/make-powers-off.js from the engine at ' + (process.argv[4] || 'an unnamed commit') + ', before the four powers of BRIEF-gui.md section 5.', fingerprints: out }) + '\n');
console.log('wrote', Object.keys(out).length, 'cases in', Date.now() - t0, 'ms');
