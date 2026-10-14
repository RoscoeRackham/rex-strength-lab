const { P, D, g, surf, obj, rex, ollie, M, ctxOf, sig } = require('./common.js');
const pullable = D.objects.filter(o => !o.noPull).map(o=>o.id);
console.log(pullable.join(','));
for (const oid of ['bus','car', ...pullable.filter(x=>!['bus','car'].includes(x)).slice(0,10)]) {
  const o = obj(oid); if (!o) continue;
  const c = ctxOf(1e9*g, { ownRecoil: true, unbreakable: true });
  const r = P.pull(c, o);
  if (!r.canMove) { console.log(oid, 'cannot'); continue; }
  const hann = M.pull.shake(r, { surface: c.surface, body: rex, obj: o, ownRecoil: true, anchor: 'friction' });
  const tau = 0.15 * Math.sqrt(0.45*rex.H/0.875);
  const ramp = P.vibSource(c.surface, 'ramp', r.ropeT, tau);
  console.log(oid, 'm', sig(o.m), 'rope', sig(r.ropeT), 't10', sig(r.t10m), 'hann ppv5', sig(P.ppvAt(hann,5)), 'ramp-onset ppv5', sig(P.ppvAt(ramp,5)), 'ratio', sig(P.ppvAt(ramp,5)/P.ppvAt(hann,5)), 'ramp feel reach', sig(P.ppvReach(ramp, P.VIB.TH.feel)), 'rattle@5', P.ppvAt(ramp,5) >= P.VIB.TH.rattle);
}
