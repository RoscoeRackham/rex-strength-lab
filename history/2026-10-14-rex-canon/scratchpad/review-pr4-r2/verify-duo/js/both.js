const R = process.argv[2];
const P = require(R + '/src/engine.js'); global.window = {}; require(R + '/src/data.js'); const D = window.DINO_DATA; const g = P.K.g;
const surf = D.surfaces.find((s) => s.id === 'concrete');
const mk = (b, kg, o) => Object.assign({ F: kg * g, mode: 'comic', body: P.makeBody(Object.assign({ build: b }, P.DEFAULT_BODIES[b])), surface: surf, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true }, o || {});
console.log('rattle threshold', P.VIB.TH.rattle);
for (const kg of [5e4, 5.7e4, 6e4, 90718.474, 2e5, 3.7e5, 4e5, 1e6]) {
  for (const who of ['rexBolted', 'ollieBolted']) {
    const cR = mk('rex', kg, who === 'rexBolted' ? { anchor: 'bolted' } : {}), cO = mk('ollie', kg, who === 'ollieBolted' ? { anchor: 'bolted' } : {});
    const r = P.shoveBoth(cR, cO);
    // the bolted one; the other (free) one
    const cB = who === 'rexBolted' ? cR : cO, cF = who === 'rexBolted' ? cO : cR;
    const mv = P.shove(cB, cF), st = P.shove(cF, cB);  // bolted shoves free (moves him) ; free shoves bolted (stalls)
    const T = mv.recoilAbsorbed ? mv.recoilAbsorbed.T : (mv.push && mv.push.t);
    const J = st.Fdrive * T, Tp = Math.max(P.limbPulse(cB.body), T);
    const src = P.impulseSource(surf, J, Tp);
    console.log(kg, who, 'shoveBoth toGroundA', !!r.toGroundA, 'toGroundB', !!r.toGroundB, 'stalled(into bolts)', st.stalled, 'Fdrive into bolts', st.Fdrive.toFixed(0), 'basis', st.basis, 'T', T.toFixed(4), 'J', J.toFixed(0), 'ppv5 mm/s', (P.ppvAt(src, 5) * 1000).toFixed(2), 'plaster', P.plasterOver([src], 5), 'vFree', (who === 'rexBolted' ? r.vB : r.vA), r.shover);
  }
}
