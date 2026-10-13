const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const K = P.K;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const surface = D.surfaces.find(s => s.id === 'concrete');
const o = D.objects.find(x => x.id === 'car');
for (const share of [0, 0.5, 0.9]) {
  const ctx = { F: 1e30 * K.g, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: share, keepForm: true, unbreakable: true, ownRecoil: true };
  const findUse = (vt) => { let lo = 1, hi = 1e40; for (let i = 0; i < 200; i++) { const mid = Math.sqrt(lo * hi); const r = P.throwObject(Object.assign({}, ctx, { use: mid }), o, 45); if (r.v < vt) lo = mid; else hi = mid; } return Math.sqrt(lo * hi); };
  for (const frac of [0.0099, 0.0101]) {
    const u = findUse(frac * K.c);
    const r = P.throwObject(Object.assign({}, ctx, { use: u }), o, 45);
    const opt = Object.assign({ obj: o, angle: 45, body, surface, near: 30 }, { airAbsorb: share, keepForm: true, unbreakable: true, ownRecoil: true });
    const rc = P.RESTRAINT.reach('throw', r, opt);
    console.log('share', share, 'v/c', frac, 'effort kg', (u / K.g).toExponential(3), 'Eobj', r.Eobj.toExponential(3), 'blast', P.RESTRAINT.MOVES.throw.blast(r, opt).toExponential(3), 'air(100Pa) reach km', (rc.air / 1e3).toFixed(0), 'houses reach km', (rc.houses / 1e3).toFixed(1));
  }
}
