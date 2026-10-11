// Reproduce BIO-3 using the app's exact context (data.js objects, default surface concrete, friction anchor)
const path = '/home/user/dino-strength-sim/src/';
global.window = {};
require(path + 'data.js');
const D = window.DINO_DATA;
const P = require(path + 'engine.js');
const g = P.K.g;
const body = P.makeBody({ H: 2, m: 180 });
const surf = D.surfaces.find(s => s.id === 'concrete');
const ctx = (mode, o) => Object.assign({ F: 511 * g, mode, body, surface: surf, groundHolds: false, anchor: 'friction' }, o || {});
const shot = D.objects.find(o => o.id === 'shot');
const ball = D.objects.find(o => o.id === 'baseball');
for (const mode of ['real', 'comic']) {
  for (const anchor of ['friction', 'braced', 'bolted']) {
    const s = P.throwObject(ctx(mode, { anchor }), shot, 37);
    const b = P.throwObject(ctx(mode, { anchor }), ball, 0);
    console.log(mode.padEnd(5), anchor.padEnd(8), 'shot v', s.v.toFixed(3), 'range', s.flight.range.toFixed(3), 'anchorR', s.anchor.R.toExponential(3), '| ball v', b.v.toFixed(3), (b.v / 0.44704).toFixed(1), 'mph');
  }
}
// other surfaces (real, friction)
for (const sf of D.surfaces) {
  const c = { F: 511 * g, mode: 'real', body, surface: sf, groundHolds: false, anchor: 'friction' };
  const s = P.throwObject(c, shot, 37), b = P.throwObject(c, ball, 0);
  console.log('real', sf.id.padEnd(9), 'shot', s.v.toFixed(2), s.flight.range.toFixed(2), 'ball', b.v.toFixed(2));
}
// speed needed for 23.56 m using engine fly() with the app's shot object
function need(h0, th) {
  let lo = 5, hi = 30;
  for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; const r = P.fly({ v0: m, thetaDeg: th, h0, m: shot.m, A: shot.area, Cd: shot.Cd }).range; if (r < 23.56) lo = m; else hi = m; }
  return (lo + hi) / 2;
}
for (const h of [1.8, 2.0, 2.2]) for (const th of [35, 37, 40]) console.log('need v for 23.56 m: h0', h, 'theta', th, '->', need(h, th).toFixed(3), 'm/s');
// analytic vacuum check
const vac = (v, th, h) => { th *= Math.PI / 180; return v * Math.cos(th) / g * (v * Math.sin(th) + Math.sqrt((v * Math.sin(th)) ** 2 + 2 * g * h)); };
console.log('vacuum range 13.82 m/s, 37deg, 1.8 m =', vac(13.82, 37, 1.8).toFixed(3), '; 14.84 ->', vac(14.84, 37, 1.8).toFixed(3));
console.log('47.3 m/s in mph', (47.3 / 0.44704).toFixed(2), '; 105.8 mph in m/s', (105.8 * 0.44704).toFixed(3));
