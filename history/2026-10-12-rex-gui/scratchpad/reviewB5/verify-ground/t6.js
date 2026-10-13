const { P, D, rex, surf, obj, ctxOf } = require('./common.js');
const ollie = P.makeBody({ build: 'ollie', H: 3.06, m: 3007 });
const g = P.K.g, s = surf('concrete');
for (const src of ['jump', 'stomp']) for (const t of [1e3, 1e4, 1e5]) {
  const cA = Object.assign(ctxOf({ F: t * 1000 * g, surface: s }), { body: ollie }), cB = ctxOf({ F: t * 1000 * g, surface: s });
  const r = P.collide(cA, cB, { source: src });
  if (!r.toGround) { console.log(src, t, 'no toGround', r.noCharge, r.outcome); continue; }
  const hit = P.impulseSource(s, r.toGround.J, r.toGround.T);
  let po = null, desc = '';
  if (r.speed.jump && r.speed.jump.pushOff) { const p = r.speed.jump.pushOff; po = P.impulseSource(s, p.J, Math.max(1e-9, p.T)); desc = `pushOff J=${p.J.toFixed(0)} T=${(p.T*1000).toFixed(1)}ms`; }
  if (r.speed.stomp) { const o = { body: ollie, surface: s, unbreakable: true }; po = P.RESTRAINT.MOVES.stomp.shake(r.speed.stomp, o); const b = P.RESTRAINT.MOVES.stomp.blow(r.speed.stomp, o); desc = `stomp blow J=${b.J.toFixed(0)} T=${(b.T*1000).toFixed(1)}ms`; }
  console.log(`${src} ${t} t: hit J=${r.toGround.J.toFixed(0)} T=${(r.toGround.T*1000).toFixed(1)}ms ppv5=${(P.ppvAt(hit,5)*1000).toFixed(1)} plaster=${P.plasterReach(hit).toFixed(1)}m | ${desc} ppv5=${(P.ppvAt(po,5)*1000).toFixed(1)} plaster=${P.plasterReach(po).toFixed(1)}m`);
}
