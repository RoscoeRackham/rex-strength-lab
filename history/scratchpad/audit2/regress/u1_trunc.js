const { P, D, ctx, obj } = require('./common.js');
let hits = 0;
for (const o of D.objects.filter((x) => !x.noThrow)) for (const anchor of ['friction', 'braced', 'bolted']) for (const ang of [15, 30, 45, 60]) for (let lg = 3; lg <= 22 && hits < 12; lg += 0.5) {
  const c = ctx({ kg: Math.pow(10, lg), anchor });
  const r = P.throwObject(c, o, ang);
  if (!r.canHold || !r.canMove) continue;
  const f = r.flight;
  const vac = f.relativistic ? null : P.fly({ v0: r.v, thetaDeg: ang, h0: c.body.releaseHeight, m: o.m, A: o.area, Cd: 0 });
  const items = [];
  if (r.anchor.R !== Infinity && r.recoilV > 0.01) items.push('recoil');
  if (r.sinkRatio > 1) items.push('sink');
  if (vac && !f.relativistic) { if (vac.escaped && !f.escaped) items.push('vac-esc'); else if (vac.orbit && !f.orbit) items.push('vac-orb'); else if (vac.landed && f.landed && vac.range > 0) { const q = f.range / vac.range; if (q < 0.95) items.push('vac'); } }
  if (f.maxStagT > 1200 && !f.relativistic) items.push('heat');
  if (f.relativistic) items.push('rel');
  if (r.gripRatio > 1) items.push('grip');
  if (f.escaped) items.push('escaped');
  if (f.landed && r.Eimpact > 4.184e9) items.push('IMPACT(crater ' + r.crater.toFixed(0) + ' m, M' + r.quake.toFixed(1) + ')');
  if (items.length > 5) { hits++; console.log(o.id, anchor, ang + 'deg', 'lift 1e' + lg, 'shown:', items.slice(0, 5).join(','), '| DROPPED:', items.slice(5).join(',')); }
}
console.log('hits', hits);
