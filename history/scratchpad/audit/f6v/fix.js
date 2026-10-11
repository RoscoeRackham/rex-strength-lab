const fs = require('fs');
const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = {};
eval(fs.readFileSync('/home/user/dino-strength-sim/src/data.js', 'utf8'));
const D = window.DINO_DATA;
const g = P.K.g;
const obj = (id) => D.objects.find((o) => o.id === id);
const surf = (id) => D.surfaces.find((s) => s.id === id);
function ctx(kg, mode) { const body = P.makeBody({ H: 2, m: 180 }); return { F: kg * g, mode, body, surface: surf('concrete'), groundHolds: false, anchor: 'friction' }; }
// Patched throw: (A) lift gate only; (B) lift gate + vector budget on the hands
function patched(c, o, ang, variant) {
  const r = P.throwObject(c, o, ang);
  const th = ang * Math.PI / 180;
  const mB = o.m + r.hands * (r.style === 'whip' ? c.body.whipEff : c.body.handEff);
  const mA = c.body.m - (mB - o.m);
  if (!(c.F >= o.m * g)) return { canMove: false, v: 0, range: 0, why: 'cannot lift' };
  let Fax = r.F;
  if (variant === 'B' && isFinite(r.F)) Fax = Math.sqrt(Math.max(0, r.F * r.F - (mB * g * Math.cos(th)) ** 2));
  const key = r.style === 'whip' ? 'throwWhip' : 'throwPush';
  const push = P.pushApart({ F: Fax, d: r.style === 'whip' ? c.body.strokes.whip : c.body.strokes.throw, mA, mB, RA: r.anchor.R, RB: mB * g * Math.sin(th), mode: c.mode, vmax: P.MUSCLE[key].vmax * c.body.s });
  const v = push.vB;
  const f = P.fly({ v0: v, thetaDeg: ang, h0: c.body.releaseHeight, m: o.m, A: o.area, Cd: o.Cd });
  return { canMove: !push.stalled && v > 0, v, range: f.range };
}
const cases = [['comic','car',511,0],['comic','b747',9072,0],['real','car',511,0],['comic','car',9072,45],['real','car',9072,45],['real','car',2000,20],['comic','car',90718,45],['comic','car',1.81436948e23,45],['real','shot',511,40]];
for (const [mode,id,kg,ang] of cases) {
  const o = obj(id); if (!o) { console.log('no obj', id); continue; }
  const c = ctx(kg, mode);
  const r = P.throwObject(c, o, ang);
  const A = patched(c, o, ang, 'A'), B = patched(c, o, ang, 'B');
  const f = (x) => x.canMove ? ('v ' + x.v.toPrecision(4) + ' range ' + x.range.toPrecision(4)) : ("can't (" + (x.why||'stalled') + ')');
  console.log(mode.padEnd(5), id.padEnd(5), String(kg).padEnd(14), ang + 'deg | engine:', r.canMove ? ('v ' + r.v.toPrecision(4) + ' range ' + r.flight.range.toPrecision(4)) : "can't", '| A gate:', f(A), '| B gate+vector:', f(B));
}
console.log(D.objects.map(o=>o.id+':'+o.m).join(' '));
