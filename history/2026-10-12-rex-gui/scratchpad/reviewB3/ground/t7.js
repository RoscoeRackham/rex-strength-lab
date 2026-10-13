const { P, D, g, surf, obj, rex, ollie, M, ctxOf, sig } = require('./common.js');
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
// Collide, Ollie jumps onto bolted Rex; scan efforts: the hit's shaking vs Ollie's own push-off (as the Jump tab counts it)
for (let lg = 3.6; lg <= 6.01; lg += 0.2) {
  const u = Math.pow(10, lg) * g;
  const cA = Object.assign(ctxOf(1e6*g, ON), { body: ollie, use: u, F: u }), cB = ctxOf(1e6*g, Object.assign({ anchor: 'bolted', use: u, F: u }, ON));
  const r = P.collide(cA, cB, { source: 'jump' });
  if (r.noCharge) { console.log(sig(Math.pow(10,lg)), 'noCharge'); continue; }
  const hit = P.impulseSource(cB.surface, r.toGround.J, r.toGround.T);
  const j = r.speed.jump; // Ollie's jump
  const o = { surface: cA.surface, body: ollie, m: ollie.m, unbreakable: true };
  const po = P.impulseSource(cA.surface, j.pushOff.J, Math.max(1e-9, j.pushOff.T));
  console.log('effort', sig(Math.pow(10,lg)), 'kg: hit J', sig(r.toGround.J), 'ppv5', sig(P.ppvAt(hit,5)), 'plaster', P.plasterOver(hit,5), '| Ollie push-off J', sig(j.pushOff.J), 'T', sig(j.pushOff.T), 'ppv5', sig(P.ppvAt(po,5)), 'plaster', P.plasterOver(po,5), 'rattle', P.ppvAt(po,5) >= P.VIB.TH.rattle);
}
