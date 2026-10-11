// Momentum audit of P.jump: external impulse during the stroke vs momentum the engine hands the dino.
const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = {}; require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA;
const g = P.K.g, body = P.makeBody({});
const S = (id) => D.surfaces.find(s => s.id === id);
const T = Object.fromEntries(D.tiers.map(t => [t.id, t.liftKg]));
const ctx = (kg, surf, mode='comic') => ({ F: kg * g, mode, body, surface: S(surf), groundHolds: false, anchor: 'friction' });
const mA = body.m - body.feetMass;
console.log('tiers', T);
for (const surf of ['sand','concrete','granite']) for (const [lbl, kg] of [['human',511],['spidey',T.spidey],['thing',T.thing],['1e6',1e6],['1e7',1e7],['secretwars',T.secretwars],['allstar',T.allstar]]) {
  const j = P.jump(ctx(kg, surf));
  const RB = j.groundLimitForce, RA = mA * g, t = j.push.t;
  const groundImpulse = (j.groundFails ? RB : NaN); // ground force while feet slide = RB
  // net external impulse on whole dino during the stroke (feet weight ignored, as engine does)
  const Jnet = j.groundFails ? (RB - RA) * t : NaN;
  const pEngine = j.v * body.m; // classical
  const vLock = j.groundFails ? P.momentumToV(Math.max(0, j.push.pA - j.push.pB), body.m) : j.v;
  console.log(surf.padEnd(8), lbl.padEnd(10), 'fails', String(j.groundFails).padEnd(5), 't', t.toExponential(3), 'pA', j.push.pA.toExponential(3), 'pB', j.push.pB.toExponential(3),
    '| engine v', j.v.toPrecision(4), 'apex', j.flight.relativistic ? 'REL' : j.flight.apex.toPrecision(4),
    '| net ext impulse', Jnet.toExponential(3), 'vs engine m*v', pEngine.toExponential(3), '| v(lock)', vLock.toPrecision(4), 'apexVac(lock)', (vLock*vLock/2/g).toPrecision(3));
}
