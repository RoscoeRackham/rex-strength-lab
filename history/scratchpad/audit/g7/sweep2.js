global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
const Pf = require(__dirname + '/engine_fix2.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const b = P.makeBody({ H: 2 });
const f = x => typeof x === 'number' ? x.toPrecision(3) : String(x);
const tiers = D.tiers.filter(t => t.liftKg).map(t => [t.id, t.liftKg]);
for (const s of D.surfaces) for (const o of D.objects) {
  if (o.noThrow) continue;
  if ((b.m + o.m) * g < s.qult * 2 * b.footArea) continue;
  for (const [tid, kg] of tiers) {
    let worst = null;
    for (const deg of (process.argv[2] ? [Number(process.argv[2])] : Array.from({length:90},(_,i)=>i+1))) {
      const c = { F: kg * g, mode: 'comic', body: b, surface: s, groundHolds: false, anchor: 'friction' };
      const r = P.throwObject(c, o, deg), q = Pf.throwObject(c, o, deg);
      if (!r.canMove && !q.canMove) continue;
      const ratio = (q.v + 1e-12) / (r.v + 1e-12);
      const recDiff = Math.abs(q.recoilV - r.recoilV);
      if (!worst || ratio > worst.ratio) worst = { deg, ratio, rv: r.v, qv: q.v, rrec: r.recoilV, qrec: q.recoilV };
    }
    if (worst && (worst.ratio > 1.1)) console.log(s.id, o.id, tid, kg, 'worst deg', worst.deg, 'v orig', f(worst.rv), 'fix', f(worst.qv), 'ratio', f(worst.ratio), 'recoil orig', f(worst.rrec), 'fix', f(worst.qrec));
  }
}
// real mode too
for (const [sid, oid, kg, deg] of [['sand','car',511,1],['asphalt','tank',90718,5],['sand','car',9072,30]]) {
  const s = D.surfaces.find(x=>x.id===sid), o = D.objects.find(x=>x.id===oid);
  const c = { F: kg * g, mode: 'real', body: b, surface: s, groundHolds: false, anchor: 'friction' };
  const r = P.throwObject(c, o, deg), q = Pf.throwObject(c, o, deg);
  console.log('real', sid, oid, kg, deg, 'orig v', f(r.v), 'rec', f(r.recoilV), '| fix v', f(q.v), 'rec', f(q.recoilV));
}
