global.window={}; const P=require('/home/user/dino-strength-sim/src/engine.js'); require('/home/user/dino-strength-sim/src/data.js'); const D=window.DINO_DATA;
for (const m of [1413, 4066, 17860, 1e5, 1e6, 1e7, 5e7]) for (const sid of ['sand','softclay','concrete','granite','ice']) {
  const s=D.surfaces.find(x=>x.id===sid); const b=P.makeBody({H:2,m});
  const g=P.groundUnderWeight(b,s,false);
  console.log(m.toExponential(2).padEnd(9), sid.padEnd(9), g.regime.padEnd(15), (g.stage||'').padEnd(5), 'sink', g.sink.toPrecision(3), 'p1/q0', (g.footPressure/g.q0).toPrecision(3));
}
