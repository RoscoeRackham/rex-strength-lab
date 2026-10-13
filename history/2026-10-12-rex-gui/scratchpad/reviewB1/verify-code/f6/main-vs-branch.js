global.window = {};
const S = process.argv[2];
require(S + '/branch/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const Pb = require(S + '/branch/rex-strength-lab/src/engine.js'), Pm = require(S + '/main/rex-strength-lab/src/engine.js');
const { canon, hash } = require(S + '/branch/rex-strength-lab/test/powers-off-cases.js');
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const ctx = (P, kg, x) => Object.assign({ F: kg * P.K.g, mode: 'comic', body: P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), surface: surf('concrete'), anchor: 'friction', groundHolds: false }, x || {});
let same = 0, diff = 0; const ds = [];
const cmp = (k, f) => { const a = hash(canon(f(Pm))), b = hash(canon(f(Pb))); if (a === b) same++; else { diff++; ds.push(k); } };
const strip = (L) => { if (L && L.flight) L.flight = Object.assign({}, L.flight, { path: L.flight.path ? L.flight.path.length : 0 }); return L; };
for (const lg of [13, 14, 15, 16, 18, 20, 23]) for (const [oid, Dd] of [['baseball', 30], ['baseball', 1000], ['car', 30], ['car', 1000]]) for (const st of ['easy', 'hard'])
  cmp(['catch', lg, oid, Dd, st].join('|'), (P) => strip(P.catchLeg(ctx(P, 10 ** lg), ctx(P, 10 ** lg, { body: P.makeBody({ build: 'ollie', H: 3.048, m: 3007 }) }), obj(oid), Dd, st)));
for (const m of [1e20, 1e21, 1e22]) for (const st of ['easy', 'hard'])
  cmp(['catch-dense', m, st].join('|'), (P) => strip(P.catchLeg(ctx(P, 1e25, { body: P.makeBody({ build: 'rex', H: 3.048, m }) }), ctx(P, 1e25, { body: P.makeBody({ build: 'ollie', H: 3.048, m }) }), obj('baseball'), 1000, st)));
for (const lg of [14.25, 14.5, 14.75, 15, 15.5]) for (const st of ['easy', 'hard']) cmp(['toss', lg, st].join('|'), (P) => P.tossPartner(ctx(P, 10 ** lg), P.makeBody({ build: 'ollie', H: 3.048, m: 3007 }), 'Ollie', st, 10, 'friction'));
for (const lg of [16, 20, 23.26]) for (const ang of [0, 30, 90]) cmp(['throwblast', lg, ang].join('|'), (P) => { const r = P.throwObject(ctx(P, 10 ** lg), obj('baseball'), ang); const o = { obj: obj('baseball'), angle: ang, surface: surf('concrete'), body: ctx(P, 1).body, anchor: 'friction', groundHolds: false, near: 5 }; const M = P.RESTRAINT.MOVES.throw; return { b: M.blast(r, o), bf: M.blastFrom(r, o), reach: P.RESTRAINT.reach('throw', r, o) }; });
console.log('same', same, 'diff', diff, ds.slice(0, 20));
