// powers-off fixture, on a subset of keys, against the patched engine (kV pinned as test/powers.js does)
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const { cases, canon, hash, OFF } = require('/home/user/rex-strength-lab/rex-strength-lab/test/powers-off-cases.js');
const base = require('/home/user/rex-strength-lab/rex-strength-lab/test/fixtures/powers-off.json').fingerprints;
const which = process.argv[2], re = new RegExp(process.argv[3] || '.');
const path = which === 'new' ? __dirname + '/engine-new.js' : '/home/user/rex-strength-lab/rex-strength-lab/src/engine.js';
const P = require(path); P.BUILDS.rex.kV = P.BUILDS.ollie.kV = 0.10017;
let n = 0, diff = 0, first = [];
const t0 = Date.now();
for (const c of cases(P, D)) { if (!re.test(c.key)) continue; for (const x of [{}, OFF]) { n++; if (hash(canon(c.run(x))) !== base[c.key]) { diff++; if (first.length < 5) first.push(c.key); } } }
console.log(which, 'cases', n, 'diff', diff, first.join(' ; '), (Date.now() - t0) + ' ms');
