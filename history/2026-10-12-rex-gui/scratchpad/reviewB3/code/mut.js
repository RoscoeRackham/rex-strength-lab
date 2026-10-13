// node mut.js <engine.js> [keyRegex] : compare powers-off fingerprints with the committed fixture
global.window = {};
const path = require('path');
const R = '/home/user/rex-strength-lab/rex-strength-lab';
const P = require(path.resolve(process.argv[2]));
require(R + '/src/data.js');
const D = window.DINO_DATA;
const { cases, canon, hash, OFF } = require(R + '/test/powers-off-cases.js');
const base = require(R + '/test/fixtures/powers-off.json').fingerprints;
const re = process.argv[3] ? new RegExp(process.argv[3]) : null;
let diff = 0, n = 0; const firsts = [];
for (const c of cases(P, D)) {
  if (re && !re.test(c.key)) continue;
  n++;
  let got;
  try { got = hash(canon(c.run(process.argv[4] === 'off' ? OFF : {}))); } catch (e) { got = 'ERR ' + e.message; }
  if (got !== base[c.key]) { diff++; if (firsts.length < 5) firsts.push(c.key); }
}
console.log(n, 'cases,', diff, 'differ', firsts.join(' ; '));
