const A = require('/home/user/dino-strength-sim/src/engine.js');
const B = require('./engine_f12fix.js');
global.window = {}; require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA;
const g = A.K.g;
const surf = (id) => D.surfaces.find(s => s.id === id);
const kaiju = A.makeBody({ H: 50, m: 180 * 25 ** 3 });
const dino = A.makeBody({});
for (const deg of [0, 1e-7, 0.01, 45]) {
  const th = deg*Math.PI/180;
  const a = A.anchorCapacity({ body: kaiju, surface: surf('sand'), theta: th }).R, b = B.anchorCapacity({ body: kaiju, surface: surf('sand'), theta: th }).R;
  console.log('kaiju sand', deg, 'old', a.toExponential(3), 'fixed', b.toExponential(3));
}
// regression: random sweep, fixed == old wherever W < Nmax or theta > 0
let diff = 0, n = 0;
for (let i = 0; i < 20000; i++) {
  const H = Math.pow(10, -1 + Math.random()*3.7), body = A.makeBody({ H });
  const s = D.surfaces[i % 5], th = (i % 3 === 0 ? 0 : Math.random()*Math.PI/2), ex = Math.random() < 0.5 ? 0 : Math.pow(10, Math.random()*8);
  const anchor = ['friction','braced'][i%2];
  const o = { body, surface: s, theta: th, extraMass: ex, anchor };
  const a = A.anchorCapacity(o), b = B.anchorCapacity(o);
  const W = (body.m + ex)*g, Nmax = s.qult*2*body.footArea;
  n++;
  if (a.R !== b.R) { diff++; if (!(W >= Nmax && Math.sin(th) <= 1e-9)) { console.log('UNEXPECTED change', H, s.id, th, ex, a.R, b.R); } }
}
console.log('changed', diff, 'of', n, '(all in W>=Nmax, theta=0)');
