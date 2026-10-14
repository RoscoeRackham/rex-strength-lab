// usage: node run1.js engineFile  -> runs powers-off cases against the committed fixture, stops at first diff
global.window = {};
const S = '/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewB2/code';
const P = require(require('path').resolve(process.argv[2]));
require(S + '/lab/src/data.js');
const D = window.DINO_DATA;
const { cases, canon, hash } = require(S + '/lab/test/powers-off-cases.js');
const base = require(S + '/lab/test/fixtures/powers-off.json').fingerprints;
const all = process.argv.includes('--all');
let i = 0, diff = 0, first = null;
const t0 = Date.now();
for (const c of cases(P, D)) {
  i++;
  let got;
  try { got = hash(canon(c.run({}))); } catch (e) { got = 'THROW ' + e.message; }
  if (got !== base[c.key]) { diff++; if (!first) first = c.key; if (!all) break; }
}
console.log(process.argv[2].split('/').pop(), diff ? 'CAUGHT' : 'MISSED', 'diff', diff, 'first', first, 'after', i, 'cases', ((Date.now() - t0) / 1000).toFixed(0) + 's');
