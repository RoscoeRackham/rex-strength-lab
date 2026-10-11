const fs = require('fs');
const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = {};
eval(fs.readFileSync('/home/user/dino-strength-sim/src/data.js', 'utf8'));
const D = window.DINO_DATA;
const g = P.K.g;
const obj = (id) => D.objects.find((o) => o.id === id);
const surf = (id) => D.surfaces.find((s) => s.id === id);
function ctx(kg, mode, extra) {
  const body = P.makeBody({ H: 2, m: 180 });
  return Object.assign({ F: kg * g, mode, body, surface: surf('concrete'), groundHolds: false, anchor: 'friction' }, extra || {});
}
// 1. slider minimum (10 kg strength) vs the 747 at 0 deg
for (const mode of ['comic', 'real']) {
  const c = ctx(10, mode); const o = obj('b747');
  const r = P.throwObject(c, o, 0); const L = P.lift(c, o);
  console.log(mode, '10 kg strength, 747 @0deg: canLift', L.canLift, 'margin', L.strengthMargin.toExponential(2), '| throw F', r.F.toFixed(2), 'N canMove', r.canMove, 'v', r.v.toExponential(3), 'range', r.flight.range.toExponential(3), 'release h', r.flight.apex);
}
// 2. object weight is credited to his feet in the anchor (extraMass = obj.m) but never charged to his arms
{
  const c = ctx(511, 'comic'); const o = obj('car');
  const r = P.throwObject(c, o, 0);
  const noCar = P.anchorCapacity({ body: c.body, surface: c.surface, theta: 0, anchor: 'friction', groundHolds: false });
  console.log('anchor R with car weight on feet', r.anchor.R.toFixed(0), 'N; without', noCar.R.toFixed(0), 'N; mu', c.surface.mu);
}
// 3. stroke time and how far the car would sag if he devoted ALL of his strength to holding it up
{
  const c = ctx(511, 'comic'); const o = obj('car');
  const r = P.throwObject(c, o, 0);
  const mB = o.m + r.hands * c.body.handEff;
  const aDown = (mB * g - c.F) / mB;
  console.log('stroke time', r.push.t.toFixed(3), 's; net downward accel even with full 511 kg of strength holding it up', aDown.toFixed(2), 'm/s^2; drop during stroke', (0.5 * aDown * r.push.t ** 2).toFixed(1), 'm vs release height', c.body.releaseHeight);
}
// 4. Angle range over which canMove is true while F_throw < mB g (vector-impossible)
for (const mode of ['comic', 'real']) for (const id of ['car', 'tank']) {
  const o = obj(id);
  for (const kg of [511, 2000, 5000, 9072, 20000, 50000, 90718, 300000]) {
    const c = ctx(kg, mode);
    let maxBad = -1, maxOk = -1;
    for (let a = 0; a <= 90; a++) {
      const r = P.throwObject(c, o, a);
      const mB = o.m + r.hands * c.body.handEff;
      if (r.canMove) { maxOk = a; if (r.F < mB * g) maxBad = a; }
    }
    const L = P.lift(c, o);
    const r0 = P.throwObject(c, o, 0); const mB = o.m + r0.hands * c.body.handEff;
    console.log(mode, id, kg, 'kg: canLift', L.canLift, 'F_throw/(mB g)', (r0.F / (mB * g)).toFixed(3), '| engine throws up to', maxOk, 'deg; of which vector-impossible up to', maxBad, 'deg');
  }
}
