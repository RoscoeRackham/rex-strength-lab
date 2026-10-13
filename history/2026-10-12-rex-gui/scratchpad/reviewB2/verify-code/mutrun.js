// usage: node mutrun.js <name> <search> <replace> [keyRegex]
const fs = require('fs'), path = require('path');
const [name, search, replace, keyRe] = process.argv.slice(2);
const src = fs.readFileSync('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js', 'utf8');
const n = src.split(search).length - 1;
if (n !== 1) { console.log(name, 'search occurs', n, 'times'); process.exit(2); }
const f = path.join(__dirname, 'mut', name + '.js');
fs.writeFileSync(f, src.replace(search, replace));
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const P = require(f);
const { cases, canon, hash, OFF } = require('/home/user/rex-strength-lab/rex-strength-lab/test/powers-off-cases.js');
const base = require('/home/user/rex-strength-lab/rex-strength-lab/test/fixtures/powers-off.json').fingerprints;
const re = keyRe ? new RegExp(keyRe) : null;
let diff = 0, run = 0, first = null;
for (const c of cases(P, D)) { if (re && !re.test(c.key)) continue; run++; for (const x of [{}, OFF]) { if (hash(canon(c.run(x))) !== base[c.key]) { diff++; if (!first) first = c.key; break; } } }
console.log(name, 'cases run', run, 'diff', diff, 'first', first);
