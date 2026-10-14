// node run-off.js <engine file>: part 1 of test/powers.js (powers left out) against a given engine
global.window = {};
const path = require('path');
const P = require(path.resolve(process.argv[2]));
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const { cases, canon, hash } = require('/home/user/rex-strength-lab/rex-strength-lab/test/powers-off-cases.js');
const base = require('/home/user/rex-strength-lab/rex-strength-lab/test/fixtures/powers-off.json').fingerprints;
let diff = 0, first = [];
for (const c of cases(P, D)) { if (hash(canon(c.run({}))) !== base[c.key]) { diff++; if (first.length < 3) first.push(c.key); } }
console.log(path.basename(process.argv[2]), diff ? 'CAUGHT ' + diff + ' differ, e.g. ' + first.join(', ') : 'NOT CAUGHT (all 14883 match)');
