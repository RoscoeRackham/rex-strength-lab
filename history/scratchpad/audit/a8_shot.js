const { P, g, ctx, obj } = require('./common.js');
const shot = obj('shot');
for (const h0 of [1.8, 2.2]) for (const th of [37, 38]) {
  let lo = 5, hi = 30;
  for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; const r = P.fly({ v0: m, thetaDeg: th, h0, m: shot.m, A: shot.area, Cd: shot.Cd }).range; if (r < 23.56) lo = m; else hi = m; }
  console.log('release h0', h0, 'angle', th, '-> speed needed for 23.56 m:', lo.toFixed(3), 'm/s');
}
const s = P.throwObject(ctx(511, 'real'), shot, 37);
console.log('engine real 511 kg shot: v', s.v.toFixed(3), 'range', s.flight.range.toFixed(2), 'release h', P.makeBody({}).releaseHeight);
const b = P.throwObject(ctx(511, 'real'), obj('baseball'), 0);
console.log('engine real 511 kg pitch: v', b.v.toFixed(3), ' vs 47.3 => ', ((b.v / 47.3 - 1) * 100).toFixed(1), '%');
// What forceFrac/vmax would be needed?  scan
for (const ff of [0.3, 0.4, 0.5]) for (const vm of [55, 70, 90]) {
  P.MUSCLE.throwWhip.forceFrac = ff; P.MUSCLE.throwWhip.vmax = vm;
  P.MUSCLE.throwPush.forceFrac = ff; P.MUSCLE.throwPush.vmax = vm;
  const bb = P.throwObject(ctx(511, 'real'), obj('baseball'), 0).v, ss = P.throwObject(ctx(511, 'real'), shot, 37);
  console.log('forceFrac', ff, 'vmax', vm, 'pitch', bb.toFixed(1), 'shot', ss.v.toFixed(2), ss.flight.range.toFixed(2));
}
