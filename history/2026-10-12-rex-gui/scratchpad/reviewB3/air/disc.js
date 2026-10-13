const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const K = P.K;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const surface = D.surfaces.find(s => s.id === 'concrete');
const M = P.RESTRAINT.MOVES.throw;
function ctx(share, extra) { return Object.assign({ F: 1e20 * K.g, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: share, keepForm: true, unbreakable: true, ownRecoil: true }, extra || {}); }
for (const [id, angle] of [['baseball', 45], ['car', 45], ['baseball', 0], ['pyramid', 90]]) {
  const o = D.objects.find(x => x.id === id);
  // find use giving v target
  const findUse = (vt) => { let lo = 1, hi = 1e30; for (let i = 0; i < 200; i++) { const mid = Math.sqrt(lo * hi); const r = P.throwObject(ctx(0, { use: mid, F: 1e30*K.g }), o, angle); if (r.v < vt) lo = mid; else hi = mid; } return Math.sqrt(lo*hi); };
  for (const frac of [0.0099, 0.0101]) {
    const u = findUse(frac * K.c);
    for (const share of [0, 0.5, 0.9]) {
      const c = ctx(share, { use: u, F: 1e30*K.g });
      const r = P.throwObject(c, o, angle);
      const opt = { obj: o, angle, body, surface, airAbsorb: share, keepForm: true, unbreakable: true, ownRecoil: true, near: 30 };
      const b = M.blastParts(r, opt);
      console.log(id, angle, 'v/c', (r.v / K.c).toFixed(5), 'share', share, 'Eobj', r.Eobj.toExponential(3), 'land', b.land.toExponential(3), 'path', b.path.toExponential(3), 'hand', (b.hand||0).toExponential(3), 'blast/Eobj', (M.blast(r, opt)/r.Eobj).toFixed(4), 'dragLoss0', r.dragLoss0 && r.dragLoss0.toExponential(3), 'flight.air', r.flight.air && r.flight.air.E.toExponential(3));
    }
  }
}
