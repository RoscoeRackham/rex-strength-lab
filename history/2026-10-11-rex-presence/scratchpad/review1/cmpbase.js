// generate the all-out baseline from main's engine and compare with the committed fixture
global.window = {};
const path = require('path');
const S = process.argv[2];
const P = require(path.join(S, 'main/engine.js'));
require(path.join(S, 'main/data.js'));
const D = window.DINO_DATA;
const { cases, summarize } = require('/home/user/rex-strength-lab/rex-strength-lab/test/baseline-cases.js');
const fix = require('/home/user/rex-strength-lab/rex-strength-lab/test/fixtures/allout-baseline.json');
let diff = 0, n = 0;
for (const c of cases(D)) { n++; const a = JSON.stringify(summarize(P, D, c)); if (a !== JSON.stringify(fix[c.key])) { diff++; if (diff < 3) console.log(c.key, a, JSON.stringify(fix[c.key])); } }
console.log('cases', n, 'differ from fixture', diff);
// also with HEAD data (the person object was added; check main engine + HEAD data)
