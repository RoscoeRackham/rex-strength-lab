// node fp.js <engine> <data> <out.json> : fingerprints of every powers-off case with {} and OFF, current kV
global.window = {};
const path = require('path');
const P = require(path.resolve(process.argv[2]));
require(path.resolve(process.argv[3]));
const D = window.DINO_DATA;
const { cases, canon, hash, OFF } = require(process.argv[5]);
const out = {};
const t0 = Date.now();
for (const c of cases(P, D)) { out[c.key] = hash(canon(c.run({}))); out['OFF:' + c.key] = hash(canon(c.run(OFF))); }
require('fs').writeFileSync(process.argv[4], JSON.stringify(out));
console.log('wrote', Object.keys(out).length, 'in', Date.now() - t0, 'ms');
