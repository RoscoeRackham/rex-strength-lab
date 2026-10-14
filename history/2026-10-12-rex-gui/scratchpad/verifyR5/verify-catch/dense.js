const SRC = process.argv[2] || '/home/user/rex-strength-lab/rex-strength-lab/src';
global.window = {};
const P = require(SRC + '/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, K = P.K;
const surf = D.surfaces.find(s => s.id === 'concrete');
const ball = D.objects.find(o => o.id === 'baseball');
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const s3 = x => x == null ? x : (typeof x === 'number' ? Number(x.toPrecision(3)) : x);
function run(oM, share, keep, Dd, extra) {
  const ollie = P.makeBody({ build: 'ollie', H: 3.048, m: oM });
  const base = { F: 1e17 * K.g, mode: 'comic', surface: surf, anchor: 'bolted', airAbsorb: share, keepForm: keep, unbreakable: true, ownRecoil: true };
  Object.assign(base, extra || {});
  const cT = Object.assign({}, base, { body: rex }), cC = Object.assign({}, base, { body: ollie });
  const L = P.catchLeg(cT, cC, ball, Dd, 'hard');
  const r0 = P.throwObject(cT, ball, 0);
  return { oM, share, keep, D: Dd, wellDom: L.wells && L.wells.wellDominated, result: L.result, vL_c: s3((L.vL || (L.aim && L.aim.vL)) / K.c), E0: s3(r0.Eobj),
    hgAt: L.hitsGround ? s3(L.hitsGround.at) : null, hgE_frac: L.hitsGround ? s3(L.hitsGround.E / r0.Eobj) : null, hgAirK: L.hitsGround ? L.hitsGround.airK : null,
    fbKind: L.fireball ? L.fireball.kind : null, fbE: L.fireball ? s3(L.fireball.E) : null, fbX: L.fireball ? s3(L.fireball.xFire || L.fireball.x) : null, chord: s3(L.chord), sheath: L.sheath ? s3(L.sheath.share) : null };
}
for (const oM of [3007, 1e20]) for (const keep of [true, false]) for (const sh of [0, 0.5, 0.99, 1]) for (const Dd of [5e3, 1.5e4, 3e4]) console.log(JSON.stringify(run(oM, sh, keep, Dd)));
