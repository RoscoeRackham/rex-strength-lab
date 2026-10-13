global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
const { cases } = require('/home/user/rex-strength-lab/rex-strength-lab/test/powers-off-cases.js');
const orig = P.catchLeg; let legs = 0, wd = 0, fastArr = 0, relC = 0;
P.catchLeg = function (...a) { const L = orig.apply(this, a); legs++; if (L && L.wells && L.wells.wellDominated) wd++; if (L && L.vArrive >= 0.01 * P.K.c) fastArr++; if (L && L.catch && L.catch.relativistic) relC++; return L; };
const list = cases(P, D);
let pulls = 0, pullUse = 0;
for (const c of list) {
  if (c.key.startsWith('catch')) c.run({});
  if (c.key.startsWith('pull')) { pulls++; if (c.key.includes('use')) pullUse++; }
}
console.log('total cases', list.length, 'legs', legs, 'wellDominated', wd, 'vArrive>=1%c', fastArr, 'relCatch', relC, 'pull cases', pulls, 'pull with use', pullUse);
console.log('pull keys sample', list.filter(c=>c.key.includes('pull')).slice(0,3).map(c=>c.key), list.filter(c=>c.key.includes("plan|pull")).length);
