const { P, ctx, octx, K, g, surf } = require('./h.js');
let bad = 0;
const chk = (lab, r) => { const s = JSON.stringify(r.carry || {}) + JSON.stringify(r.after || {}); if (/NaN|null/.test(JSON.stringify(r.carry || {})) || (r.carry && !(r.carry.supplied >= r.carry.pGain))) { bad++; if (bad < 10) console.log('BAD', lab, r.outcome, s.slice(0, 300)); } };
for (const lm of [3.4771, 5, 8, 12, 16, 20]) for (const src of ['sprint', 'jump', 'stomp', 'set']) for (const bounce of [false, true]) for (const anchor of ['friction', 'bolted']) for (const ub of [true, false]) for (const sid of ['concrete', 'sand', 'ice', 'softclay']) for (const lF of [3.5, 5, 9, 15]) {
  const m = Math.pow(10, lm), H = 3.048 * Math.cbrt(m / 3000);
  const b = (build) => P.makeBody({ build, H, m });
  const cA = octx({ body: b('ollie'), F: Math.pow(10, lF) * g, unbreakable: ub, surface: surf(sid) }), cB = ctx({ body: b('rex'), F: Math.pow(10, lF) * g, anchor, unbreakable: ub, surface: surf(sid) });
  let r; try { r = P.collide(cA, cB, { source: src, gb: 1e-6, bounce }); } catch (e) { console.log('THROW', lm, src, e.message); bad++; continue; }
  if (r.outcome === 'carried') chk([lm, src, bounce, anchor, ub, sid, lF].join(','), r);
}
console.log('bad', bad);
