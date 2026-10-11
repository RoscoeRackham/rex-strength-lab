const P = require('/home/user/dino-strength-sim/src/engine.js');
const src = require('fs').readFileSync('/home/user/dino-strength-sim/src/engine.js', 'utf8');
const hillSrc = src.slice(src.indexOf('function hill('), src.indexOf('function pushApart('));
let phSrc = src.slice(src.indexOf('function pushApartHill('), src.indexOf('// Ground and anchoring'));
phSrc = phSrc.slice(0, phSrc.lastIndexOf('}') + 1);
phSrc = phSrc.replace('let xA = 0, xB = 0,', 'let vBmax = 0, Fmax = 0; let xA = 0, xB = 0,')
  .replace('t += dt * frac; steps++;', 't += dt * frac; steps++; vBmax = Math.max(vBmax, vB); Fmax = Math.max(Fmax, F);')
  .replace('t, stalled, xA, xB, vA, vB,', 't, stalled, xA, xB, vA, vB, vBmax, Fmax,');
const MUSCLE = P.MUSCLE;
eval(hillSrc + '\n' + phSrc + '\nglobal.PH = pushApartHill;');
global.window = {}; require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const body = P.makeBody({ H: 2, m: 180 });
const g = 9.80665;
for (const [sid, L] of [['concrete', 90718.474], ['concrete', 1e6], ['concrete', 1e34], ['asphalt', 90718.474], ['granite', 1e8], ['granite', 1e12], ['granite', 5.9724e24], ['steel', 1e14], ['sand', 511], ['stiffclay', 9071.8474], ['ice', 1e5]]) {
  const surface = D.surfaces.find(s => s.id === sid);
  const A2 = 2 * body.footArea;
  const RB = P.qultFor(surface, body.footB) * A2;
  const cB = P.K.PONCELET_K * surface.rho * A2;
  const mA = body.m - body.feetMass, mB = body.feetMass;
  const F = L * g * 1.4;
  const r = PH({ F, d: body.strokes.leg, mA, mB, vmax: 12 }, mA * g, RB, 0, cB);
  const j = P.jump({ F: L * g, mode: 'real', body, surface, groundHolds: false });
  console.log(sid, L.toExponential(2), 'F0/RB', (F / RB).toFixed(1), 'Fmax/RB', (r.Fmax / RB).toFixed(3), 'sink(cm)', (r.xB * 100).toFixed(3), 'vBmax', r.vBmax.toFixed(2), 'vBfinal', r.vB, 'engine fails', j.groundFails, 'held', j.heldBack, 'Eg', j.Eground.toFixed(1));
}
