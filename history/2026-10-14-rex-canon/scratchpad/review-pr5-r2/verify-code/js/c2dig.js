const { P, D, body, ctx } = require(process.argv[2] || './setup.js');
const obj = (id) => D.objects.find((x) => x.id === id);
const PE = (m, h) => m * (P.K.GM / P.K.R_E - P.K.GM / (P.K.R_E + h));
for (const [id, ld, e] of [['baseball', 5.5, 9], ['baseball', 6, 9], ['car', 5.5, 10]]) {
  const A = ctx(1, body('rex')), B = ctx(1, body('ollie')); A.F = B.F = Math.pow(10, e) * P.K.g;
  const ob = obj(id), L = P.catchLeg(A, B, ob, Math.pow(10, ld), 'hard');
  const tb = P.RESTRAINT.takenBack('catch', { a: L }, { A, B, whoA: 'rex', obj: ob });
  const vE = L.aim.vE, th = L.aim.thetaDeg;
  const E0 = P.keFromV(vE, ob.m) + PE(ob.m, L.h0);
  const f = P.flyTo({ v0: vE, thetaDeg: th, h0: L.h0, hStop: 0, Dend: L.Dfl, xStop: L.Dfl, m: ob.m, A: ob.area, Cd: ob.Cd, CdSup: ob.CdSup });
  console.log(id, ld, e, L.result, 'theta', th.toFixed(2), 'vE', vE.toFixed(2), 'vArrive', L.vArrive, 'hStop', L.hStop, 'h0', L.h0, 'Dfl', L.Dfl);
  console.log('  E0', E0, 'KE(vArrive)', P.keFromV(L.vArrive, ob.m), 'Ecatch', L.catch.Ecatch, 'E0-KE(vArrive)', E0 - P.keFromV(L.vArrive, ob.m));
  console.log('  full drag flight: landed', f.landed, 'crossedX', f.crossedX, 'vImpact', f.vImpact, 'vAtX', f.vAtX, 'hAtX', f.hAtX, 'dragE', f.dragE, 'belowStop', f.belowStop, 'escaped', f.escaped, 'timedOut', f.timedOut);
  console.log('  drag part', tb.by.rex.parts.drag, 'catch', tb.by.rex.parts.catch);
  // drag-free flight
  const g0 = P.flyTo({ v0: vE, thetaDeg: th, h0: L.h0, hStop: 0, Dend: L.Dfl, xStop: L.Dfl, m: ob.m, A: ob.area, Cd: ob.Cd, CdSup: ob.CdSup, dragK: 0 });
  console.log('  drag-free flyTo: vAtX', g0.vAtX, 'hAtX', g0.hAtX, 'E at X', g0.vAtX && P.keFromV(g0.vAtX, ob.m) + PE(ob.m, g0.hAtX), 'maxH', g0.maxH || g0.hMax);
}
