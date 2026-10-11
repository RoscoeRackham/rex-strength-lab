global.window = {}; require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js'); const K = P.K, g = K.g;
const surf = process.argv[2] || 'concrete', mode = process.argv[3] || 'comic';
const body = P.makeBody({ H: 2, m: 180 });
const surface = D.surfaces.find((s) => s.id === surf);
for (let lg = 13; lg <= 34; lg += 0.5) {
  const j = P.jump({ F: Math.pow(10, lg) * g, mode, body, surface, groundHolds: false, anchor: 'friction' });
  console.log(lg.toFixed(1), 'v/c=', (j.v / K.c).toExponential(4), 'held', j.heldBack, 'fails', j.groundFails, 'pA', j.push.pA.toExponential(3), 'pB', j.push.pB.toExponential(3), 'vB/c', (j.push.vB / K.c).toExponential(3), 'xA', j.push.xA.toExponential(3), 'xB', j.push.xB.toExponential(3), 'Eg', j.Eground.toExponential(3));
}
