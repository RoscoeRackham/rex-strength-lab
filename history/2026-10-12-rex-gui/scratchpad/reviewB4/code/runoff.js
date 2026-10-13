// usage: node runoff.js <engine.js> [filterRegex] [extra: off|none]
global.window = {};
const path = require('path');
const R = '/home/user/rex-strength-lab/rex-strength-lab/';
const P = require(path.resolve(process.argv[2]));
require(R + 'src/data.js');
const D = window.DINO_DATA;
const { cases, canon, hash, OFF } = require(R + 'test/powers-off-cases.js');
const base = require(R + 'test/fixtures/powers-off.json').fingerprints;
const re = process.argv[3] ? new RegExp(process.argv[3]) : null;
const extra = process.argv[4] === 'off' ? OFF : {};
let diff = 0, n = 0, keys = [];
const t0 = Date.now();
for (const c of cases(P, D)) { if (re && !re.test(c.key)) continue; n++; const got = hash(canon(c.run(extra))); if (got !== base[c.key]) { diff++; if (keys.length < 6) keys.push(c.key); } }
console.log(JSON.stringify({ n, diff, keys, ms: Date.now() - t0 }));
