const { P, g, R3, O3, c9, obj, PE, glow, sig } = require('./common.js');
const TB = P.RESTRAINT.takenBack;
for (const [id, D0, kg] of [['baseball', 300, 1e8], ['car', 1e4, 1e9]]) {
  const cR = c9(kg * g, R3), cO = c9(kg * g, O3), ob = obj(id);
  const a = P.catchLeg(cR, cO, ob, D0, 'hard');
  const b = P.catchLeg(cO, cR, ob, D0, 'hard');
  console.log('---', id, D0, 'm', kg, 'kg; result', a.result, 'style', a.style, 'fullStrength', a.fullStrength, 'vE', a.aim && a.aim.vE, 'vL', a.aim && a.aim.vL, 'h0', a.h0, 'Dfl', a.Dfl, 'wells', a.wells && a.wells.wellDominated);
  const full = { m: ob.m, A: ob.area, Cd: ob.Cd, CdSup: ob.CdSup };
  const f0 = P.flyTo(Object.assign({ v0: a.aim.vE, thetaDeg: a.aim.thetaDeg, h0: a.h0, hStop: 0, Dend: a.Dfl, xStop: a.Dfl }, full));
  const Ethrown = P.keFromV(a.aim.vE, ob.m) + PE(ob.m, a.h0);
  const EthrownL = P.keFromV(a.aim.vL, ob.m) + PE(ob.m, a.h0);
  const endPE = f0.crossedX ? PE(ob.m, f0.hAtX) : 0, endKE = f0.crossedX ? P.keFromV(f0.vAtX, ob.m) : P.keFromV(f0.vImpact, ob.m);
  console.log('f0 dragE', sig(f0.dragE), 'crossedX', f0.crossedX, 'hAtX', f0.hAtX, 'vAtX', f0.vAtX, 'landed', f0.landed, 'vImpact', f0.vImpact);
  console.log('Ethrown (KE(vE)+PE h0)', sig(Ethrown), 'KE(vL)+PE', sig(EthrownL), 'energy-conservation air take', sig(Ethrown - endPE - endKE));
  console.log('Ecatch a', sig(a.catch && a.catch.Ecatch), 'b', sig(b.catch && b.catch.Ecatch));
  const tb = TB('catch', { a, b }, { A: cR, B: cO, whoA: 'rex', obj: ob });
  console.log('tb E', sig(tb.E), 'rex', JSON.stringify(Object.fromEntries(Object.entries(tb.by.rex.parts).filter(([, v]) => v))), 'ollie', JSON.stringify(Object.fromEntries(Object.entries(tb.by.ollie.parts).filter(([, v]) => v))));
  console.log('rex drag glow', glow(tb.by.rex.parts.drag || 1e-30).text, ' rex total', glow(tb.by.rex.E).text);
}
