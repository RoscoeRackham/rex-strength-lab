const { P, D, g, R3, O3, c3, dial, sig, surf, conc } = require('./h.js');
for (const rho of [1e5, 1e7, 1e9, 1e11, 1e13]) {
  const R = P.makeBody({ build: 'rex', H: P.DEFAULT_BODIES.rex.H, m: rho * P.bodyVolume(P.DEFAULT_BODIES.rex.H, 'rex') });
  const O = P.makeBody({ build: 'ollie', H: P.DEFAULT_BODIES.ollie.H, m: rho * P.bodyVolume(P.DEFAULT_BODIES.ollie.H, 'ollie') });
  for (const F of [dial, 1e9 * g, 1e12 * g]) {
    const r = P.collide(c3(F, O), c3(F, R), { source: 'sprint' });
    const r0 = P.collide(c3(F, O, { ownRecoil: false }), c3(F, R, { ownRecoil: false }), { source: 'sprint' });
    console.log(sig(rho), sig(F / g), r.outcome, r.noCharge || '', 'v0', sig(r.v0), 'vRel', sig(r.vRel), 'gravBoost', r.gravBoost, 'dragged', r.dragged, 'carry v', r.carry && sig(r.carry.v), '| off:', r0.outcome, r0.dragged);
  }
}
