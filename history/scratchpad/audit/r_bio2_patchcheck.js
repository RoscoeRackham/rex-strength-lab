const P0 = require('/home/user/dino-strength-sim/src/engine.js');
const P1 = require('./r_patched/engine.js');
if (!global.window) global.window = {}; require("/home/user/dino-strength-sim/src/data.js"); const D = window.DINO_DATA;
const g = P0.K.g; const body = P0.makeBody({});
// brute with positions
function brute(o, F0) {
  const { d, mA, mB, vmax } = o; const RA = o.RA, RB = o.RB; const k = 0.25;
  let xA = 0, xB = 0, vA = 0, vB = 0, t = 0;
  const tau = Math.min(mA, mB) * vmax / F0 / 5; const dt = Math.min(tau / 20, d / vmax / 2e5);
  while (xA + xB < d) {
    const F = F0 * P0.hill((vA + vB) / vmax, k);
    let aA = 0, aB = 0;
    if (vA > 0 || F > RA) aA = (F - RA) / mA;
    if (vB > 0 || F > RB) aB = (F - RB) / mB;
    const nvA = Math.max(0, vA + aA * dt), nvB = Math.max(0, vB + aB * dt);
    xA += 0.5 * (vA + nvA) * dt; xB += 0.5 * (vB + nvB) * dt; vA = nvA; vB = nvB; t += dt;
  }
  return { vA, vB, xA, xB, t };
}
for (const sid of ['sand', 'clay', 'asphalt', 'concrete', 'granite']) {
  const surface = D.surfaces.find(s => s.id === sid);
  const ctx = { F: 1.36e14 * g, mode: 'real', body, surface, groundHolds: false, anchor: 'friction' };
  const j0 = P0.jump(ctx), j1 = P1.jump(ctx);
  const c = { d: body.strokes.leg, mA: body.m - body.feetMass, mB: body.feetMass, RA: (body.m - body.feetMass) * g, RB: surface.qult * 2 * body.footArea, vmax: 30 };
  const b = brute(c, 1e3 * (c.RB + c.mA * 1800));
  console.log(sid.padEnd(9), 'old v', j0.v.toFixed(3), 'apex', j0.flight.apex.toFixed(3), 'sink', j0.sink.toFixed(3), '| fixed v', j1.v.toFixed(3), 'apex', j1.flight.apex.toFixed(2), 'sink', j1.sink.toFixed(4), '| brute vA', b.vA.toFixed(3), 'xB', b.xB.toFixed(4), 't', b.t.toFixed(4));
}
// infinite strength
const ctxI = { F: Infinity, mode: 'real', body, surface: D.surfaces.find(s => s.id === 'concrete'), groundHolds: false, anchor: 'friction' };
const jI = P1.jump(ctxI); console.log('inf concrete fixed v', jI.v.toFixed(3), 'apex', jI.flight.apex.toFixed(2));
const jH = P1.jump(Object.assign({}, ctxI, { groundHolds: true })); console.log('inf groundHolds fixed v', jH.v.toFixed(3), ' old', P0.jump(Object.assign({}, ctxI, { groundHolds: true })).v.toFixed(3));
// check for NaN in all actions at saturation with patched engine
let bad = 0;
for (const sid of D.surfaces.map(s => s.id)) for (const F of [1e13 * g, Infinity]) for (const anchor of ['friction', 'braced', 'bolted']) for (const gh of [false, true]) {
  const ctx = { F, mode: 'real', body, surface: D.surfaces.find(s => s.id === sid), groundHolds: gh, anchor };
  const outs = [P1.jump(ctx), P1.stomp(ctx), P1.punch(ctx), P1.clap(ctx), ...D.objects.filter(o => !o.noThrow).map(o => P1.throwObject(ctx, o, 45))];
  for (const o of outs) for (const key of ['vA', 'vB', 'xA', 'xB']) if (!Number.isFinite(o.push[key])) { bad++; console.log('nonfinite', sid, F, anchor, gh, key, o.push[key]); }
}
console.log('nonfinite count', bad);
