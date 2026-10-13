const { P, K, ON, sig, obj, ctxOf } = require('./common.js');
// a dense catcher (wells dominate the line): the chord test and the hits-ground energy at a share below 100%
const ollieD = P.makeBody({ build: 'ollie', H: 3.048, m: 1e20 });
for (const kf of [true, false]) for (const sh of [0.5, 1]) for (const Dd of [1.5e4, 3e4]) {
  const c = ctxOf(1e17 * K.g, Object.assign({}, ON, { airAbsorb: sh, keepForm: kf }));
  const cO = Object.assign({}, c, { body: ollieD, anchor: 'bolted' });
  const L = P.catchLeg(c, cO, obj('baseball'), Dd, 'hard');
  const r0 = P.throwObject(c, obj('baseball'), 0);
  console.log(JSON.stringify({ kept: kf, sh, D: Dd, wellDom: L.wells && L.wells.wellDominated, dBeatC: sig(L.wells && L.wells.dBeatC), result: L.result, hgE_over_E: L.hitsGround ? sig(L.hitsGround.E / r0.Eobj) : null, airK: L.hitsGround ? L.hitsGround.airK : null, at: L.hitsGround ? sig(L.hitsGround.at) : null, fbKind: L.fireball ? L.fireball.kind : null, chord: sig(L.chord) }));
}
