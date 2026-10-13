global.window = {};
const S = '/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewB2/code';
const P = require(S + '/lab/src/engine.js');
require(S + '/lab/src/data.js');
const D = window.DINO_DATA;
const { cases } = require(S + '/lab/test/powers-off-cases.js');
// wrap catchLeg to record wellDominated
const orig = P.catchLeg; let n = 0, wd = 0, rel = 0; const seen = new Set();
P.catchLeg = function () { const L = orig.apply(this, arguments); n++; if (L && L.wells && L.wells.wellDominated) wd++; if (L && L.vArrive >= 0.01 * P.K.c) rel++; return L; };
const list = cases(P, D).filter((c) => /^catch/.test(c.key));
for (const c of list) c.run({});
console.log('catch cases', list.length, 'legs', n, 'wellDominated', wd, 'vArrive>=1%c', rel);
