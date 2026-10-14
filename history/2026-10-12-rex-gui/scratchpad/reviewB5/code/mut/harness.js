// node harness.js <engine.js> [off]: runs the powers-off cases against the committed fixture, prints diffs
global.window = {};
const path = require('path');
const LAB = '/home/user/rex-strength-lab/rex-strength-lab';
const P = require(path.resolve(process.argv[2]));
require(LAB + '/src/data.js');
const D = window.DINO_DATA;
const { cases, canon, hash, OFF } = require(LAB + '/test/powers-off-cases.js');
const base = require(LAB + '/test/fixtures/powers-off.json').fingerprints;
const extra = process.argv[3] === 'off' ? OFF : {};
let diff = 0, err = 0; const first = [];
for (const c of cases(P, D)) {
  let got;
  try { got = hash(canon(c.run(extra))); } catch (e) { err++; if (first.length < 5) first.push('ERR ' + c.key + ' ' + e.message); continue; }
  if (got !== base[c.key]) { diff++; if (first.length < 8) first.push(c.key); }
}
console.log(path.basename(process.argv[2]) + ': ' + diff + ' differ, ' + err + ' errors; ' + first.join(' ; '));
