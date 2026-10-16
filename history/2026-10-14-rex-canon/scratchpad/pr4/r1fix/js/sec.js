// Runs chosen sections of test/powers.js against an engine: node sec.js <engine.js> <powers.js> <section numbers, e.g. 6 8>
// (the prelude, lines 1-14 and 62-71, plus each section from its '// N.' header to the next top-level header)
global.window = {};
const fs = require('fs'), path = require('path');
const ENG = path.resolve(process.argv[2]), SRC = fs.readFileSync(process.argv[3], 'utf8').split('\n'), want = process.argv.slice(4);
const heads = SRC.map((l, i) => [i, l]).filter(([, l]) => /^\/\/ \d+[a-z]?\. /.test(l));
let body = SRC.slice(62, 71).join('\n') + '\n';
for (const w of want) {
  const k = heads.findIndex(([, l]) => l.startsWith('// ' + w + '. '));
  if (k < 0) throw new Error('no section ' + w);
  const end = k + 1 < heads.length ? heads[k + 1][0] : SRC.findIndex((l) => l.startsWith("console.log('\\n' + (n - fails)"));
  body += SRC.slice(heads[k][0], end).join('\n') + '\n';
}
const P = require(ENG);
require(path.join(path.dirname(path.resolve(process.argv[3])), '..', 'src', 'data.js'));
const D = window.DINO_DATA, g = P.K.g;
let fails = 0, n = 0;
const ok = (name, cond, detail) => { n++; if (!cond) fails++; console.log((cond ? 'ok   ' : 'FAIL ') + name.slice(0, 160) + (detail != null && !cond ? ': ' + String(detail).slice(0, 300) : '')); };
new Function('P', 'D', 'g', 'ok', 'require', body)(P, D, g, ok, require);
console.log((n - fails) + '/' + n + ' passed');
process.exit(fails ? 1 : 0);
