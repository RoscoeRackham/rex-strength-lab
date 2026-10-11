global.window = {}; require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA;
for (const f of ['/home/user/dino-strength-sim/src/engine.js', './engine100.js']) {
  const P = require(f);
  for (const lg of [9, 12, 14, 16, 20, 34]) {
    const body = P.makeBody({ H: 2, m: 180 });
    const c = { F: Math.pow(10, lg) * 9.80665, mode: 'real', body, surface: D.surfaces.find(s => s.id === 'granite'), groundHolds: false, anchor: 'friction' };
    const r = P.jump(c);
    console.log(f.slice(-12), lg, 'v', r.v.toFixed(3), 'groundFails', r.groundFails, 'heldBack', r.heldBack, 'vB', r.push.vB.toExponential(3), 'xB', r.push.xB.toExponential(3), 'Eground', r.Eground.toExponential(3), 'RB', r.groundLimitForce.toExponential(3), 'steps-t', r.push.t);
  }
}
