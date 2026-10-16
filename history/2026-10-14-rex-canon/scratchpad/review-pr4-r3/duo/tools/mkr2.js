// node mkr2.js <shots.js in> <out>: the PR4 block with everything before round 2's checks skipped when R2ONLY is set
const fs = require('fs');
const [i, o] = process.argv.slice(2);
const L = fs.readFileSync(i, 'utf8').split('\n');
const a = L.findIndex((l) => /^    const COL = \{ duoOpen: true, duoAction: 'collide' \};$/.test(l));
const b = L.findIndex((l) => /^    \/\/ ---- review round 2 of pull request 4 /.test(l));
if (a < 0 || b < 0) throw new Error('markers ' + a + ' ' + b);
L.splice(b, 0, '    } // R2ONLY');
L.splice(a + 1, 0, '    if (!process.env.R2ONLY) {');
fs.writeFileSync(o, L.join('\n'));
console.log('wrapped', a + 2, b + 2);
