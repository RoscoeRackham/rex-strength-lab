// node fixcheck.js <dir>: the sheath check's own cases (arrival speeds) and the proposed extra assertions
global.window = {};
const dir = process.argv[2];
const P = require(dir + '/src/engine.js'); require(dir + '/src/data.js');
const D = window.DINO_DATA, g = P.K.g, c0 = P.K.c;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const ctxOf = (F, o) => Object.assign({ F, mode: 'comic', body: rex, surface: surf('concrete'), anchor: 'friction' }, ON, o || {});
const near = (a, b, t) => Math.abs(a - b) <= t * Math.max(Math.abs(a), Math.abs(b));
// the test's sheath cases
{ const c = ctxOf(1e17 * g, { airAbsorb: 0.5 });
  console.log('sheath test cases (10^17): ' + [60, 62, 63, 70, 200].map((Dd) => { const L = P.catchLeg(c, Object.assign({}, c, { body: ollie }), obj('baseball'), Dd, 'hard'); return Dd + ' m vArrive/c ' + (L.vArrive / c0).toFixed(3) + ' Ecatch/Eobj ' + (L.catch.Ecatch / P.throwObject(c, obj('baseball'), L.aim ? L.aim.thetaDeg : 0).Eobj).toFixed(3); }).join('; ')); }
// proposed sheath assertion below 1% of c
{ const c = ctxOf(1e14 * g, { airAbsorb: 0.5 }), L = P.catchLeg(c, Object.assign({}, c, { body: ollie }), obj('baseball'), 1000, 'hard');
  const pass = L.result === 'caught' && L.sheath && L.catch && L.catch.relativistic === true && near(L.catch.pIn, P.vToMomentum(L.aim.vL, 0.145), 0.01);
  console.log('sheath below 1% c: vArrive/c', (L.vArrive / c0).toExponential(3), 'pIn', L.catch.pIn, 'pThrow', P.vToMomentum(L.aim.vL, 0.145), '=>', pass ? 'PASS' : 'FAIL'); }
// proposed friction check on concrete
{ const conc = surf('concrete'), r = P.throwObject(ctxOf(1e6 * g, { ownRecoil: false }), obj('car'), 30), tg = r.toGround;
  const Nmax = P.qultFor(conc, rex.footB) * 2 * rex.footArea, capH = conc.mu * Nmax * (tg.T);
  const pass = tg.suppliedDown === 0 && tg.suppliedSide > 0 && near(tg.J, Math.hypot(capH, tg.whole * 0.5), 1e-9);
  console.log('friction on concrete 30deg: J', tg.J, 'capH', capH, 'Jd', tg.whole * 0.5, '=>', pass ? 'PASS' : 'FAIL'); }
// proposed shove at 1e8
{ const cR = ctxOf(1e8 * g, { airAbsorb: 0, keepForm: false, unbreakable: true, ownRecoil: false }), cO = Object.assign({}, cR, { body: ollie, anchor: 'bolted' }), sh = P.shove(cR, cO);
  const pass = sh.toGroundB && near(sh.toGroundB.J, P.vToMomentum(sh.vA, rex.m), 0.02);
  console.log('shove 1e8 bolted: J', sh.toGroundB && sh.toGroundB.J, 'recoil', P.vToMomentum(sh.vA, rex.m), '=>', pass ? 'PASS' : 'FAIL'); }
// proposed column-capped far blast: vertical pyramid at 90%: the snowplow within the reach can't exceed the whole column's take
{ const ob = obj('pyramid'), c = ctxOf(1e22 * g, { airAbsorb: 0.9 }), r = P.throwObject(c, ob, 90);
  const col = P.fastAir ? P.fastAir(ob, r.Eobj, 90, 0.9) : null;
  const w1 = P.fastAirWithin(ob, r.Eobj, 90, 0.9, 1e9), w2 = P.fastAirWithin(ob, r.Eobj, 90, 0.9, 1e12);
  console.log('pyramid 90deg 90%: Eobj', r.Eobj.toExponential(3), 'within 1e6 km', w1.toExponential(3), 'within 1e9 km', w2.toExponential(3), 'whole column fastAir.Eair', col && col.Eair && col.Eair.toExponential(3), '=>', near(w1, w2, 1e-9) && (!col || near(w2, col.Eair, 1e-6)) ? 'PASS' : 'FAIL'); }
