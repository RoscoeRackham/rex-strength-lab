global.window = {};
const B = process.argv[2], E = process.argv[3];
const P = require(E);
require(B + '/src/data.js'); const D = window.DINO_DATA;
const { cases, canon, hash } = require(B + '/test/powers-off-cases.js');
const base = require(B + '/test/fixtures/powers-off.json').fingerprints;
let diff = 0, missing = 0, n = 0; const firsts = [];
for (const c of cases(P, D)) { n++; const w = base[c.key]; if (!w) { missing++; continue; } if (hash(canon(c.run({}))) !== w) { diff++; if (firsts.length < 3) firsts.push(c.key); } }
console.log(require('path').basename(E), 'cases', n, 'differ', diff, 'missing', missing, firsts.join(' ; ') || '(not caught)');
