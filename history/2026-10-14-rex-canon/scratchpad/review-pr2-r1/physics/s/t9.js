const { P, D, g, c, surf, obj, rex, ollie, ON, ctxOf, DEF, sig } = require('./hv.js');
const crypto = require('crypto');
const h = (x) => crypto.createHash('md5').update(JSON.stringify(x, (k, v) => (typeof v === 'number' && !isFinite(v) ? String(v) : typeof v === 'function' ? undefined : v))).digest('hex').slice(0, 10);
const STATES = { on: ON, onBolted: Object.assign({ anchor: 'bolted' }, ON), unbr: { unbreakable: true }, own: { ownRecoil: true }, ownBolted: { ownRecoil: true, anchor: 'bolted' } };
for (const [F, dl] of [[DEF, 'def'], [1e9 * g, '1e9'], [1e20 * g, '1e20'], [Infinity, 'inf']]) for (const sid of ['concrete', 'sand']) for (const [sn, st] of Object.entries(STATES)) {
  const cx = ctxOf(F, Object.assign({ surface: surf(sid) }, st));
  const cO = Object.assign({}, cx, { body: ollie });
  const out = {};
  out.jump = h(P.jump(cx)); out.clap = h(P.clap(cx)); out.sprint = h(P.sprint(cx));
  for (const src of ['sprint', 'jump', 'stomp']) for (const bounce of [false, true]) { try { out['col' + src + bounce] = h(P.collide(cO, cx, { source: src, bounce })); } catch (e) { out['col' + src + bounce] = 'ERR'; } }
  try { out.growth = h(P.instantGrowth(rex, 1e15, 0.5, cx)); } catch (e) { out.growth = 'ERR' + e.message; }
  console.log(dl, sid, sn, JSON.stringify(out));
}
