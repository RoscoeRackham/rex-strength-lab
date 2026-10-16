const { P, D, g, R3, O3, c9, obj, PE, sig, TB, duo } = require('./common.js');
const t0 = Date.now(); let n = 0;
for (const id of ['tank', 'loco', 'esb', 'pyramid', 'nimitz', 'everest', 'baseball', 'shot']) for (let e = 8; e <= 22 && n < 6; e += 1) for (const D0 of [1e4, 1e5, 1e6, 3e6, 1e7]) for (const st of ['hard', 'easy']) {
  if (Date.now() - t0 > 400000) break;
  const x = { ownRecoil: false, safePassenger: false, noKnockback: false }, A = c9(Math.pow(10, e) * g, R3, x), B = c9(Math.pow(10, e) * g, O3, x);
  let L; try { L = P.catchLeg(A, B, obj(id), D0, st); } catch (er) { continue; }
  if (L.fast || L.result === 'fireball' || !(L.aim || L.vL > 0)) continue;
  const ob = obj(id), full = { m: ob.m, A: ob.area, Cd: ob.Cd, CdSup: ob.CdSup };
  let f;
  if (L.result === 'overshoots') { if (L.relativistic || L.vL >= P.CATCH.V_FIREBALL) continue; f = P.flyTo(Object.assign({ v0: L.vL, thetaDeg: L.thetaDeg, h0: L.h0, hStop: 0, xStop: L.Dfl, Dend: L.Dfl }, full)); }
  else if (L.aim && !(L.wells && L.wells.wellDominated) && L.result !== 'falls-back') { const hard = L.style === 'hard' || !!L.fullStrength; f = P.flyTo(Object.assign({ v0: L.aim.vE, thetaDeg: L.aim.thetaDeg, h0: L.h0, hStop: hard ? 0 : L.hStop, Dend: L.Dfl }, hard ? { xStop: L.Dfl } : {}, full)); }
  else continue;
  if (f.escaped || f.orbit || f.timedOut) { n++; const tb = TB('catch', { a: L }, duo(A, B, 'rex', { obj: ob })); console.log(id, e, D0, st, L.result, 'f', f.escaped, f.orbit, f.timedOut, 'dragE', sig(f.dragE), 'E0', sig(P.keFromV(L.aim ? L.aim.vE : L.vL, ob.m)), 'drag part', sig(tb.parts.drag)); }
}
console.log('found', n, (Date.now() - t0) / 1000);
