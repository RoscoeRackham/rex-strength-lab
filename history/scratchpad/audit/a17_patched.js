const P = require('./engine_patched.js');
const { ctx: c0, obj } = require('./common.js');
const { refHill } = require('./ref.js');
const g = P.K.g;
const ctx = (kg, mode, extra) => { const c = c0(kg, mode, extra); return c; };
let worst = 0;
for (let lg = 2.7; lg <= 16; lg += 0.25) {
  const kg = 10 ** lg; const c = ctx(kg, 'real'); const b = c.body;
  const anc0 = P.anchorCapacity({ body: b, surface: c.surface, theta: 0, anchor: 'friction', groundHolds: false });
  const cases = {
    punch: [{ F: c.F * 0.3, d: b.strokes.punch, mA: b.m - b.handEff, mB: b.handEff, RA: anc0.R, RB: 0, vmax: 17 }, 'vB'],
    jump: [{ F: c.F, d: b.strokes.leg, mA: b.m - b.feetMass, mB: b.feetMass, RA: (b.m - b.feetMass) * g, RB: 900e3, vmax: 30 }, 'vA'],
  };
  const row = [kg.toExponential(1)];
  for (const [n, [o, side]] of Object.entries(cases)) {
    const e = P.pushApart(Object.assign({ mode: 'real' }, o))[side], r = refHill(Object.assign({ N: 20000 }, o))[side];
    worst = Math.max(worst, Math.abs(e - r) / r); row.push(n + ' ' + e.toFixed(3) + '/' + r.toFixed(3));
  }
  if (Math.round(lg * 4) % 4 === 0) console.log(row.join('  '));
}
console.log('worst rel err patched vs reference', worst.toExponential(2));
console.log('calibration still: shot', P.throwObject(ctx(511, 'real'), obj('shot'), 37).v.toFixed(3), 'punch', P.punch(ctx(511, 'real')).vFist.toFixed(3));
