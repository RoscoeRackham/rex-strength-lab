const { P, D, ctx, octx, K, g } = require('./h.js');
const obj = D.objects.find(o => o.id === 'baseball');
const j = (r) => JSON.stringify(r, (k, v) => typeof v === 'number' ? +v.toPrecision(4) : (k === 'mat' || k === 'flight' || k === 'path' ? undefined : v));
for (const nkb of [true, false]) for (const bolted of [false, true]) {
  const over = { F: 1e14 * g, keepForm: false, airAbsorb: 0.5, noKnockback: nkb, anchor: bolted ? 'bolted' : 'friction' };
  const cR = ctx(Object.assign({}, over, { anchor: 'friction' })), cO = octx(over);
  const a = P.catchLeg(cR, cO, obj, 10, 'fast');
  const fb = a.fireball || a.catch && a.catch.fireball || a.hit;
  console.log('nkb', nkb, 'bolted', bolted, 'result', a.result, Object.keys(a).join(','));
  const f = a.fireball || (a.fb) || null;
  // search for fireball-like object
  for (const k of Object.keys(a)) if (a[k] && typeof a[k] === 'object' && ('Egap' in a[k])) console.log('  ', k, j({ E: a[k].E, p: a[k].p, kind: a[k].kind, Egap: a[k].Egap, Earr: a[k].Earr, Ehere: a[k].Ehere, Eafter: a[k].Eafter, Eblast: a[k].Eblast, Enear: a[k].Enear, push: a[k].push, knock: a[k].knockAbsorbed, over: a[k].overpressure }));
}
