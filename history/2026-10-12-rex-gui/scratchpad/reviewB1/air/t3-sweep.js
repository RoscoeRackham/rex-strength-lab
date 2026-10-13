const {P,D,obj}=require('./env.js');
const K=P.K;
for (const [id,v0,th] of [['baseball',40,45],['baseball',300,45],['car',300,45],['car',1500,45],['car',8000,45],['car',8000,10],['baseball',11000,30],['everest',3000,45],['shot',1000,80],['bus',20000,5]]) {
  const o=obj(id); let prevR=-1, prevA=Infinity, bad=[];
  const rows=[];
  for (let i=0;i<=40;i++){ const s=i/40; const f=P.fly({v0,thetaDeg:th,h0:2,m:o.m,A:o.area,Cd:o.Cd,CdSup:o.CdSup,dragK:1-s});
    const r = f.landed? f.range : (f.escaped||f.orbit? Infinity : NaN);
    // air energy = energy lost = E0 - E_impact (+PE)
    const E0=0.5*o.m*v0*v0, Ei=0.5*o.m*f.vImpact*f.vImpact;
    const airE = f.air? f.air.E : (s===0? E0-Ei+o.m*(K.GM/K.R_E-K.GM/(K.R_E+2)) : 0);
    if (!(r>=prevR)) bad.push('range@'+s); if (!(airE<=prevA*(1+1e-9))) bad.push('air@'+s+':'+airE.toExponential(3)+'>'+prevA.toExponential(3));
    prevR=r; prevA=airE; rows.push(s.toFixed(3)+':'+(isFinite(r)?r.toFixed(0):r)+'/'+airE.toExponential(2)+(f.escaped?'E':'')+(f.orbit?'O':''));
  }
  console.log(id,v0,th, bad.length? 'NONMONO '+bad.join(' '):'monotone', '\n  ', rows.filter((_,i)=>i%5===0).join(' '));
}
