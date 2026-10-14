// node eff.js <dir> : the four cases each mutant changes
global.window = {};
const dir = process.argv[2];
const P = require(dir + '/src/engine.js'); require(dir + '/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const ctxOf = (F, o) => Object.assign({ F, mode: 'comic', body: rex, surface: surf('concrete'), anchor: 'friction' }, ON, o || {});
const sig = (x) => (typeof x === 'number' ? Number(x.toPrecision(4)).toExponential(3) : String(x));
// (1) sheath catch below 1% of c: baseball over 1 km, hard, 1e14, 50%
{ const c = ctxOf(1e14 * g, { airAbsorb: 0.5 }), L = P.catchLeg(c, Object.assign({}, c, { body: ollie }), obj('baseball'), 1000, 'hard');
  const pThrow = L.aim ? P.vToMomentum(L.aim.vL, 0.145) : NaN;
  console.log('(1) result', L.result, 'sheath', !!L.sheath, 'vL/c', L.aim && sig(L.aim.vL / P.K.c), 'vArrive', sig(L.vArrive), 'Ecatch', sig(L.catch && L.catch.Ecatch), 'rel', L.catch && L.catch.relativistic, 'pIn', sig(L.catch && L.catch.pIn), 'pThrow', sig(pThrow), 'sheath share', L.sheath && sig(L.sheath.share)); }
// (2) car on concrete, 30 deg, 1e6, own recoil off
{ const r = P.throwObject(ctxOf(1e6 * g, { ownRecoil: false }), obj('car'), 30), tg = r.toGround;
  console.log('(2) toGround', JSON.stringify(tg, (k, v) => typeof v === 'number' ? Number(v.toPrecision(6)) : v)); }
// (3) shove into a bolted partner at 1e8 and 1e6
for (const kg of [1e6, 1e8]) { const cR = ctxOf(kg * g, { airAbsorb: 0, keepForm: false, unbreakable: true, ownRecoil: false }), cO = Object.assign({}, cR, { body: ollie, anchor: 'bolted' }), sh = P.shove(cR, cO);
  const Fpush = sh.push.xA + sh.push.xB > 0 ? sh.push.work / (sh.push.xA + sh.push.xB) : 0;
  console.log('(3)', kg, 'toGroundB', sh.toGroundB && sig(sh.toGroundB.J), 'T', sh.toGroundB && sig(sh.toGroundB.T), 'push.t', sig(sh.push.t), 'limbPulse', sig(P.limbPulse(ollie)), 'Fpush*t', sig(Fpush * sh.push.t), 'recoil p', sig(P.vToMomentum(sh.vA, rex.m))); }
// (4) far blast reach: Great Pyramid at 90 deg, 1e22, 90%; and car level
for (const [o, ang, kg] of [['pyramid', 90, 1e22], ['car', 0, 1e15]]) {
  const ob = obj(o) || D.objects.find((x) => /pyramid/i.test(x.id)); if (!ob) { console.log('no', o); continue; }
  const c = ctxOf(kg * g, { airAbsorb: 0.9 }), r = P.throwObject(c, ob, ang);
  const rc = P.RESTRAINT.reach('throw', r, Object.assign({ obj: ob, angle: ang, surface: surf('concrete'), body: rex, near: 5 }, c));
  console.log('(4)', ob.id, ang, kg, 'v/c', sig(r.v / P.K.c), 'reach', JSON.stringify(rc, (k, v) => typeof v === 'number' ? Number(v.toPrecision(5)) : v)); }
