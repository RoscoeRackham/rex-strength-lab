// Writes test/fixtures/allout-baseline.json from an engine file (default: this one). Used once, with the engine as it
// was on main before effort existed, so test/presence.js can check that all-out effort reproduces it exactly:
//   node test/make-baseline.js <engine.js> <data.js>
global.window = {};
const path = require('path');
const P = require(path.resolve(process.argv[2] || path.join(__dirname, '..', 'src', 'engine.js')));
require(path.resolve(process.argv[3] || path.join(__dirname, '..', 'src', 'data.js')));
const D = window.DINO_DATA;
const { cases, summarize } = require('./baseline-cases.js');
const out = {};
for (const c of cases(D)) out[c.key] = summarize(P, D, c);
require('fs').writeFileSync(path.join(__dirname, 'fixtures', 'allout-baseline.json'), JSON.stringify(out));
console.log('wrote', Object.keys(out).length, 'cases');
