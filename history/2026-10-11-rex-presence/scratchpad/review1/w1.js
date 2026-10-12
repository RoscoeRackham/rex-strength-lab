const { P, D, g, surf, obj, rex, ollie, cal, big, ctxOf } = require('./h.js');
for (const b of [rex, ollie]) for (const sid of ['sand','gravel','softclay','stiffclay','concrete','granite']) {
  const s = surf(sid);
  const line = [b.build, sid];
  for (const e of [0, 0.5, 1]) {
    const pr = P.presence(b, s, { effort: e });
    const st = pr.step;
    line.push(`e${e}: F/W ${(st.Fpulse/st.W).toFixed(2)} T ${(st.Tpulse*1000).toFixed(0)}ms 3m ${(pr.ppv(3)*1000).toFixed(3)} 20m ${(pr.ppv(20)*1e6).toFixed(1)}um/s eleph x${(pr.ppv(20)/P.elephantPPV(20)).toFixed(1)} nl3 ${pr.nonlinear(3)}`);
  }
  console.log(line.join(' | '));
}
const st = P.walkStep(rex, surf('concrete'), {});
console.log(JSON.stringify(Object.fromEntries(Object.entries(st).filter(([k,v])=>typeof v==='number')), null, 0));
console.log('footprint sand', JSON.stringify(P.walkStep(rex, surf('sand'), {}).footprint), 'ollie', JSON.stringify(P.walkStep(ollie, surf('sand'), {}).footprint));
for (const sid of ['softclay','stiffclay','gravel','asphalt']) console.log(sid, JSON.stringify(P.walkStep(rex, surf(sid), {}).footprint), JSON.stringify(P.walkStep(ollie, surf(sid), {}).footprint), 'q', P.qultFor(surf(sid), rex.footB), P.qultFor(surf(sid), ollie.footB));
console.log(D.surfaces.map(s => s.id + ' qult ' + s.qult + ' shear ' + s.shear + ' gran ' + s.granular + ' Bref ' + s.Bref + ' rho ' + s.rho).join('\n'));
