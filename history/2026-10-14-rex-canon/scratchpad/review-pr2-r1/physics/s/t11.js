const { P, D, g, c, surf, obj, rex, ollie, ON, ctxOf, DEF, sig } = require('./hv.js');
const crypto = require('crypto');
const h = (x) => crypto.createHash('md5').update(JSON.stringify(x, (k, v) => (typeof v === 'number' && !isFinite(v) ? String(v) : typeof v === 'function' || k === 'downTaken' ? undefined : v))).digest('hex').slice(0, 10);
const STATES = { unbr: { unbreakable: true }, unbrAir: { unbreakable: true, airAbsorb: 1, keepForm: true }, unbrBolt: { unbreakable: true, anchor: 'bolted' } };
for (const [F, dl] of [[DEF, 'def'], [1e9 * g, '1e9'], [1e20 * g, '1e20']]) for (const sid of ['concrete', 'sand']) for (const [sn, st] of Object.entries(STATES)) {
  const cx = ctxOf(F, Object.assign({ surface: surf(sid) }, st)), cO = Object.assign({}, cx, { body: ollie });
  const out = {};
  for (const oid of ['car', 'bus', 'baseball']) for (const th of [0, 45, 90]) out['t' + oid + th] = h(P.throwObject(cx, obj(oid), th));
  out.stomp = h(P.stomp(cx)); out.punch = h(P.punch(cx)); out.pull = h(P.pull(cx, obj('car'))); out.shove = h(P.shove(cx, Object.assign({}, cO, { anchor: 'friction' })));
  out.wt = h(P.throwPartner(cx, Object.assign({}, cO, { anchor: 'friction' }), 45));
  for (const [oid, Dd] of [['car', 30], ['bus', 10], ['baseball', 10]]) for (const s of ['hard', 'easy']) out['c' + oid + s] = h(P.catchLeg(cx, cO, obj(oid), Dd, s));
  out.toss = h(P.tossPartner(cx, ollie, 'Ollie', 'easy', 10, 'friction'));
  const aw = P.armWrestle(cx, Object.assign(ctxOf(F / 2, st), { body: ollie })); out.aw = h(aw);
  console.log(dl, sid, sn, JSON.stringify(out));
}
