const H = require('./h.js')();
const { P, g, obj, R3, c9, TB, sig, PE } = H;
let hits = [];
for (const oH of [3.06, 6, 10, 30, 100]) for (const oM of [3000, 1e4, 1e5, 1e6]) for (const id of ['baseball', 'car', 'person', 'bus']) for (const D0 of [10, 31.6, 100, 1000]) for (const kg of [1e4, 9.07e4, 1e6, 1e8]) {
  const OB = P.makeBody({ build: 'ollie', H: oH, m: oM });
  const A = c9(kg * g, R3, { ownRecoil: false }), B = c9(kg * g, OB, { ownRecoil: false });
  let L; try { L = P.catchLeg(A, B, obj(id), D0, 'easy'); } catch (e) { continue; }
  if (!L || !L.aim || !(L.aim.vE > 0) || L.result === 'falls-back' || L.result === 'overshoots' || L.fast || L.result === 'fireball' || (L.wells && L.wells.wellDominated)) continue;
  const hard = L.style === 'hard' || !!L.fullStrength; if (hard) continue;
  const ob = obj(id);
  const f = P.flyTo({ v0: L.aim.vE, thetaDeg: L.aim.thetaDeg, h0: L.h0, hStop: L.hStop, Dend: L.Dfl, m: ob.m, A: ob.area, Cd: ob.Cd, CdSup: ob.CdSup });
  if (f.belowStop) { const tb = TB('catch', { a: L }, { A, B, whoA: 'rex', obj: ob }); hits.push({ oH, oM, id, D0, kg, res: L.result, hStop: L.hStop, h0: L.h0, drag: tb.parts.drag, pe: PE(ob.m, L.hStop), th: L.aim.thetaDeg }); }
}
console.log('reachable belowStop legs (catch real):', hits.length);
for (const x of hits.slice(0, 8)) console.log(JSON.stringify(x));
