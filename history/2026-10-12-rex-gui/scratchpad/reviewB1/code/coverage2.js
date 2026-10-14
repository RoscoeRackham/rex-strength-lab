global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const { cases } = require('/home/user/rex-strength-lab/rex-strength-lab/test/powers-off-cases.js');
const seen = {};
for (const c of cases(P, D)) if (c.key.startsWith('catch|')) { const L = c.run({}); const k = c.key.split('|').slice(1, 5).join('|'); (seen[k] = seen[k] || new Set()).add(L.result + (L.vL ? ' vL=' + L.vL.toExponential(2) : '') + (L.aim ? ' aim.vL=' + L.aim.vL.toExponential(2) : '')); }
for (const [k, v] of Object.entries(seen)) console.log(k, [...v].join(' ; '));
const g = 9.80665;
const ctx = (F) => ({ F, mode: 'comic', body: P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), surface: D.surfaces.find((s) => s.id === 'concrete'), anchor: 'friction' });
const O = (F) => Object.assign(ctx(F), { body: P.makeBody({ build: 'ollie', H: 3.048, m: 3007 }) });
for (const lg of [12, 14, 16, 20]) { const L = P.catchLeg(ctx(Math.pow(10, lg) * g), O(Math.pow(10, lg) * g), D.objects.find((o) => o.id === 'baseball'), 30, 'hard'); console.log('hard baseball 30 m lg', lg, L.result, L.vL); }
