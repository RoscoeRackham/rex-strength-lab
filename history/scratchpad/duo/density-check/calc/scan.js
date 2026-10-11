global.window = global.window || {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA; const K=P.K;
const S = (id) => D.surfaces.find((s) => s.id === id);
const bad=[];
for (let lm=Math.log10(5.2007e7); lm<=10.5; lm+=0.02) { const m=10**lm; const b=P.makeBody({H:2,m}); const f=P.fallThrough(b,{}); 
  const fp=f.firstPass; const flag = fp && (fp.t < 1500 || Math.abs(fp.dLonDeg)>90);
  if (flag || lm<7.75) console.log(m.toExponential(3), f.stuck? ('stuck r_km='+(f.stuck.r/1e3).toFixed(0)+' t_h='+(f.stuck.t/3600).toFixed(2)) : '', fp? ('firstPass t='+fp.t.toFixed(0)+' depthShort='+fp.depthShort.toFixed(0)+' dLon='+fp.dLonDeg.toFixed(1)) : '', f.stillSinking?'stillSinking':'', flag?'<<BAD':''); }
