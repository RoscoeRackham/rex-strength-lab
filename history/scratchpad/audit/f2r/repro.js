const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = {}; require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA;
const g = P.K.g;
const body = P.makeBody({});
const S = (id) => D.surfaces.find(s => s.id === id);
const ctx = (kg, mode, surf) => ({ F: kg * g, mode, body, surface: S(surf), groundHolds: false, anchor: 'friction' });
console.log('feetMass', body.feetMass, 'comicFrac jump', P.MUSCLE.jump.comicFrac);
const ST = 907.18474;
const list = [511, 1000, 1500, 2000, 5000, 9071.8474, 1e5, 1e6, 150e9*ST];
for (const surf of ['sand', 'concrete']) for (const mode of ['comic', 'real']) {
  for (const kg of list) {
    const j = P.jump(ctx(kg, mode, surf));
    console.log(surf, mode, kg.toExponential(3), 'F', j.F.toExponential(3), 'RB', j.groundLimitForce.toExponential(3), 'fails', j.groundFails,
      'pA', j.push.pA.toExponential(3), 'pB', j.push.pB.toExponential(3), 'v', j.v.toPrecision(4), 'apex', j.flight.apex.toPrecision(4), 'esc', j.flight.escaped, 'rel', j.flight.relativistic, 'EB', j.push.EB.toExponential(3), 'sink', j.push.xB.toPrecision(3));
  }
}
