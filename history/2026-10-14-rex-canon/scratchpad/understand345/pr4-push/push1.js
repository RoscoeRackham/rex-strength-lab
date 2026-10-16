const { P, g, ON, OFF, DIAL, pair, sig, rex, ollie, surf } = require('./common.js');
console.log('rex m', rex.m, 'ollie m', ollie.m, 'DIAL N', DIAL);
for (const [lab, x] of [['ON', ON], ['OFF', OFF], ['ownRecoil only', { ownRecoil: true }], ['unbreakable only', { unbreakable: true }]]) {
  for (const sid of ['concrete', 'sand', 'softclay', 'granite', 'ice']) {
    const s = surf(sid); if (!s) { console.log('no surface', sid); continue; }
    const [cR, cO] = pair(DIAL, Object.assign({ surface: s }, x));
    cR.surface = s; cO.surface = s;
    const r = P.pushMatch(cR, cO);
    console.log(lab, sid, 'mu', s.mu, JSON.stringify({ outcome: r.outcome, HA: sig(r.HA), HB: sig(r.HB), DA: sig(r.DA), DB: sig(r.DB), holdA: sig(r.holdA), holdB: sig(r.holdB), contact: sig(r.contact), allOut: r.allOut, canLiftA: r.canLiftA, ring: sig(r.ring) }));
  }
}
// push (shoveDrive) vs grip
const [cR] = pair(DIAL, ON);
const shoveShare = cR.mode === 'real' ? P.MUSCLE.throwPush.forceFrac : P.MUSCLE.throwPush.comicFrac;
console.log('throwPush comicFrac', P.MUSCLE.throwPush.comicFrac, 'forceFrac', P.MUSCLE.throwPush.forceFrac, 'shoveDrive', Math.min(DIAL, 2 * DIAL * shoveShare));
console.log('DIAL/grip', DIAL / P.pushMatch(...pair(DIAL, ON)).holdA);
