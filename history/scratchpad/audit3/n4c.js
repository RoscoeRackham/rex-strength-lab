global.window = {};
const P = require('./engine_instr.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA; const g = P.K.g;
const body = P.makeBody({});
const surface = D.surfaces.find((s) => s.id === 'concrete');
const ball = D.objects.find((o) => o.id === 'baseball');
for (const [ang, lg] of [[30, 6], [30, 9], [45, 5.2], [45, 6], [30, Infinity], [2, Infinity]]) {
  const F = lg === Infinity ? Infinity : Math.pow(10, lg) * g;
  const c = { F, mode: 'real', body, surface, groundHolds: false, anchor: 'friction' };
  const r = P.throwObject(c, ball, ang);
  const s = Math.sin(ang * Math.PI / 180);
  // force along push line at which N(F) = Nmax
  const Fsink = (r.anchor.Nmax - r.anchor.N(0)) / s;
  console.log(ang, lg, 'sinkRatio', r.sinkRatio.toFixed(3), 'held', r.heldBack, 'peak F in integrated stroke', r.push.maxF.toFixed(0), 'N; F needed to overload ground', Fsink.toFixed(0), 'N; mean F', (r.push.work / (r.push.xA + r.push.xB)).toFixed(0), 'N; R', r.anchor.R.toFixed(0), 'v', r.v.toFixed(3), 'pB', r.push.pB);
}
