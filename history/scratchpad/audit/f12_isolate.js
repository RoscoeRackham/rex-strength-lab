// Isolate the anchor effect at exactly theta=0 (no slope term): current R vs R from the theta->0+ limit (0) vs friction capped at Nmax.
const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = {}; require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA;
const g = P.K.g;
const surf = (id) => D.surfaces.find(s => s.id === id);
const obj = (id) => D.objects.find(o => o.id === id);
const dino = P.makeBody({});
const kaiju = P.makeBody({ H: 50, m: 180 * 25 ** 3 });
// limit theta->0+ numerically
for (const [b, sid, oid] of [[dino,'concrete','b747'],[dino,'sand','bus'],[kaiju,'sand',null],[kaiju,'clay',null]]) {
  const ex = oid ? obj(oid).m : 0;
  const a0 = P.anchorCapacity({ body: b, surface: surf(sid), theta: 0, extraMass: ex });
  const ae = P.anchorCapacity({ body: b, surface: surf(sid), theta: 1e-12, extraMass: ex });
  const Nmax = surf(sid).qult * 2 * b.footArea;
  console.log(`${b.H}m ${sid} ${oid||'-'}: R(0)=${a0.R.toExponential(3)} R(1e-12 rad)=${ae.R.toExponential(3)} mu*Nmax=${(surf(sid).mu*Nmax).toExponential(3)}`);
}
// Throw at 0 deg with RA swapped to the theta->0+ limit, Thing tier, 747 on concrete
const tier = D.tiers.find(t => t.id === 'thing');
const c = { F: tier.liftKg * g, mode: 'comic', body: dino, surface: surf('concrete'), groundHolds: false, anchor: 'friction' };
const r = P.throwObject(c, obj('b747'), 0);
const pz = P.pushApart({ F: r.F, d: dino.strokes.throw, mA: dino.m - 2*dino.handEff, mB: obj('b747').m + 2*dino.handEff, RA: 0, RB: 0, mode: 'comic' });
const pc = P.pushApart({ F: r.F, d: dino.strokes.throw, mA: dino.m - 2*dino.handEff, mB: obj('b747').m + 2*dino.handEff, RA: 0.8*9e5, RB: 0, mode: 'comic' });
console.log('747 concrete Thing 0deg: engine v', r.v.toFixed(3), 'recoil', r.recoilV.toFixed(2), '| RA=0: v', pz.vB.toFixed(3), 'recoil', pz.vA.toFixed(2), '| RA=mu*Nmax: v', pc.vB.toFixed(3), 'recoil', pc.vA.toFixed(2), '| F', r.F.toExponential(3));
// UI contradiction: lift tab for same setup
const L = P.lift(c, obj('b747'));
console.log('lift tab, same setup: groundRatio', L.groundRatio.toFixed(2), '(>1 means ground fails under him)');
// kaiju pull/punch
for (const sid of ['sand','clay']) {
  const ck = { F: D.tiers.find(t=>t.id==='thing').liftKg*g, mode:'comic', body:kaiju, surface:surf(sid), groundHolds:false, anchor:'friction' };
  const pl = P.pull(ck, obj('tank')); const pu = P.punch(ck);
  console.log('kaiju', sid, 'pull tank anchor', pl.anchor.R.toExponential(3), pl.anchor.limit, 'resist', pl.resist.toExponential(3), '| punch anchor', pu.anchor.R.toExponential(3), '| standRatio', P.lift(ck, obj('car')).standRatio.toFixed(2));
}
