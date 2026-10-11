const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = {}; require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA;
const g = P.K.g;
const surf = (id) => D.surfaces.find(s => s.id === id);
const obj = (id) => D.objects.find(o => o.id === id);
const dino = P.makeBody({});
for (const sid of ['concrete','granite','sand']) for (const tier of D.tiers.filter(t=>t.liftKg>=1e9)) for (const mode of ['comic','real']) {
  const c = { F: tier.liftKg*g, mode, body: dino, surface: surf(sid), groundHolds: false, anchor: 'friction' };
  const out = [0, 1, 45].map(deg => { const r = P.throwObject(c, obj('moon'), deg); return `${deg}deg: R=${r.anchor.R.toExponential(2)} ${r.anchor.limit} vMoon=${r.v.toExponential(3)} recoil=${r.recoilV.toExponential(3)} canMove=${r.canMove}`; });
  console.log(sid, tier.id, mode, '|', out.join(' | '));
}
// lift comparison: lift() says ground fails?
const c = { F: 200e18*907.18*g, mode:'comic', body: dino, surface: surf('concrete'), groundHolds: false, anchor: 'friction' };
const L = P.lift(c, obj('moon'));
console.log('lift moon groundRatio', L.groundRatio.toExponential(3), 'canLift', L.canLift);
