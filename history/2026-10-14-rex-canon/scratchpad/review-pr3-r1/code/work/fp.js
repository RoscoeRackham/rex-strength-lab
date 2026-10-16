// node fp.js <engine> <out.json> <extraJSON> [kV]
global.window = {};
const path = require('path'), fs = require('fs');
const P = require(path.resolve(process.argv[2]));
require(path.resolve(process.argv[6] || path.join(__dirname, 'data.js')));
const D = window.DINO_DATA;
if (process.argv[5]) P.BUILDS.rex.kV = P.BUILDS.ollie.kV = Number(process.argv[5]);
const { cases, canon, hash } = require('./cases.js');
const extra = JSON.parse(process.argv[4] || '{}');
const out = {}; const t0 = Date.now();
for (const c of cases(P, D)) out[c.key] = hash(canon(c.run(extra)));
fs.writeFileSync(process.argv[3], JSON.stringify(out));
console.log(process.argv[2], Object.keys(out).length, Date.now() - t0, 'ms');
