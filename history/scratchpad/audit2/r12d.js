global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const F = 511 * 9.80665;
const objs = D.objects.filter(o => !o.noThrow);
const surface = D.surfaces.find(s => s.id === 'concrete');
for (const mode of ['real','comic']) {
  const Hs = [];
  for (let H = 0.1; H <= 500; H = +(H + 0.1).toFixed(1)) {
    const body = P.makeBody({ H, m: 180 * Math.pow(H / 2, 3) });
    const c = { F, mode, body, surface, groundHolds: false, anchor: 'friction' };
    const shot = P.throwObject(c, D.objects.find(o=>o.id==='shot'), 37);
    const base = P.throwObject(c, D.objects.find(o=>o.id==='baseball'), 2);
    if (shot.flight && base.flight) continue;
    const ok = objs.filter(o => { const r = P.throwObject(Object.assign({}, c, {record:true}), o, 45); return r.canHold && r.canMove; }).map(o=>o.id);
    if (ok.length) Hs.push(H + ':' + ok.join('/'));
  }
  console.log(mode, Hs.length, Hs[0], Hs[Hs.length-1]);
}
console.log('logKg check: human tier liftKg', D.tiers.find(t=>t.id==='human').liftKg);
