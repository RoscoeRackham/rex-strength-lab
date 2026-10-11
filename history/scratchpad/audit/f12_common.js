const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = {}; require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA;
const g = P.K.g;
const surf = (id) => D.surfaces.find(s => s.id === id);
const obj = (id) => D.objects.find(o => o.id === id);
const dino = P.makeBody({});
const cases = [['sand','car'],['clay','car'],['sand','bus'],['concrete','b747']];
for (const [sid, oid] of cases) for (const tier of D.tiers.filter(t=>isFinite(t.liftKg) && t.liftKg < 1e15)) {
  const c = { F: tier.liftKg*g, mode: 'comic', body: dino, surface: surf(sid), groundHolds: false, anchor: 'friction' };
  const W = (dino.m + obj(oid).m)*g, Nmax = surf(sid).qult*2*dino.footArea;
  const out = [0, 1].map(deg => { const r = P.throwObject(c, obj(oid), deg); return `${deg}deg R=${r.anchor.R.toExponential(2)} v=${r.v.toPrecision(4)} recoil=${r.recoilV.toPrecision(3)} range=${r.flight.range.toPrecision(3)}`; });
  console.log(sid, oid, tier.id, 'W/Nmax', (W/Nmax).toFixed(2), '|', out.join(' | '));
}
