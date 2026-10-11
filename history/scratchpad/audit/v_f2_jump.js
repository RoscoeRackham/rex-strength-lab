const P = require('/home/user/dino-strength-sim/src/engine.js');
const K = P.K, g = K.g;
global.window = {}; require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA;
const body = P.makeBody({});
const surf = (id) => D.surfaces.find((s) => s.id === id);
const ctx = (kg, mode, sid, extra) => Object.assign({ F: kg * g, mode, body, surface: surf(sid), groundHolds: false, anchor: 'friction' }, extra || {});
const mA = body.m - body.feetMass, mB = body.feetMass;
console.log('mA', mA, 'mB', mB, 'd', body.strokes.leg, 'comicFrac jump', P.MUSCLE.jump.comicFrac);
// Momentum-consistent velocity: after full extension the leg locks feet to body (perfectly inelastic,
// impulsive, ground force finite so negligible during lock): p_cm = pA - pB.
function vConsistent(j) { const p = j.push.pA - j.push.pB; return p > 0 ? P.momentumToV(p, body.m) : 0; }
for (const mode of ['comic', 'real']) {
  for (const sid of ['sand', 'asphalt', 'concrete', 'granite']) {
    for (const kg of [511, 1e4, 1e6, 1e8, 1.36e14, 1e20]) {
      const j = P.jump(ctx(kg, mode, sid));
      const vc = vConsistent(j);
      const fc = P.fly({ v0: vc, thetaDeg: 90, h0: 0, m: body.m, A: body.topArea, Cd: body.Cd });
      console.log(mode.padEnd(5), sid.padEnd(8), kg.toExponential(2), 'fails', j.groundFails, 'engine v', j.v.toExponential(4), 'apex', (j.flight.apex||0).toExponential(3),
        '| pB/pA', (j.push.pB / j.push.pA).toFixed(5), 'v_cm', vc.toExponential(4), 'apex_cm', (fc.apex||0).toExponential(3), 'sink', j.sink.toExponential(2));
    }
  }
}
// Best momentum-consistent jump: push only as hard as the ground allows (F_eff = RB, feet don't sink)
console.log('--- best jump at F_eff = RB (comic constant force) ---');
for (const sid of ['sand', 'clay', 'asphalt', 'concrete', 'granite']) {
  const RB = surf(sid).qult * 2 * body.footArea;
  const push = P.pushApart({ F: RB, d: body.strokes.leg, mA, mB, RA: mA * g, RB: Infinity, mode: 'comic' });
  const v = P.momentumToV(push.pA, body.m);
  const f = P.fly({ v0: v, thetaDeg: 90, h0: 0, m: body.m, A: body.topArea, Cd: body.Cd });
  // hand derivation: vA = sqrt(2 d (RB - mA g)/mA), v = mA vA / m
  const vhand = mA * Math.sqrt(2 * body.strokes.leg * (RB - mA * g) / mA) / body.m;
  console.log(sid.padEnd(8), 'RB', RB.toExponential(3), 'v', v.toFixed(2), 'hand', vhand.toFixed(2), 'apex', f.apex.toFixed(1), 'vacuum', (v*v/2/g).toFixed(1));
}
// Hulk Secret Wars tier
const hulk = 150e9 * 907.18474;
for (const sid of ['sand', 'asphalt', 'concrete', 'granite']) {
  const j = P.jump(ctx(hulk, 'comic', sid));
  console.log('Hulk', sid.padEnd(8), 'engine v', j.v.toExponential(4), 'apex', j.flight.apex.toFixed(0), 'v_cm', vConsistent(j).toExponential(3));
}
