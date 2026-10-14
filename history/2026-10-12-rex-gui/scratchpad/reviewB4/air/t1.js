const {P, obj} = require('./load.js');
const GM=P.K.GM, R=P.K.R_E;
// independent drag-free integration (velocity Verlet with small steps) over round Earth
function vac(v0, th, h0) {
  let x=0,y=R+h0, vx=v0*Math.cos(th*Math.PI/180), vy=v0*Math.sin(th*Math.PI/180), t=0, apex=h0;
  const T = 2*v0/9.8; let dt = Math.min(T/2e5, 0.01);
  const acc=(x,y)=>{const r=Math.hypot(x,y); const k=-GM/(r*r*r); return [k*x,k*y];};
  let [ax,ay]=acc(x,y);
  for(let i=0;i<5e7;i++){
    const px=x,py=y;
    vx+=0.5*dt*ax; vy+=0.5*dt*ay; x+=dt*vx; y+=dt*vy; [ax,ay]=acc(x,y); vx+=0.5*dt*ax; vy+=0.5*dt*ay; t+=dt;
    const r=Math.hypot(x,y); if(r-R>apex) apex=r-R;
    if(r<R){ const pr=Math.hypot(px,py); const f=(pr-R)/(pr-r); const ix=px+(x-px)*f, iy=py+(y-py)*f; return {range:R*Math.atan2(ix,iy), apex, t:t-dt*(1-f), v:Math.hypot(vx,vy)}; }
  }
}
for (const id of ['car','baseball']) {
  const o = obj(id);
  for (const v0 of [30, 300, 1000, 3000, 6000]) {
    const f1 = P.fly({ v0, thetaDeg: 45, h0: 2, m: o.m, A: o.area, Cd: o.Cd, CdSup: o.CdSup, dragK: 0 });
    const fv = vac(v0, 45, 2);
    const shares=[0,0.25,0.5,0.75,0.9,1].map(s=>P.fly({ v0, thetaDeg: 45, h0: 2, m: o.m, A: o.area, Cd: o.Cd, CdSup: o.CdSup, dragK: 1-s }));
    console.log(id, v0, 'range', f1.range.toPrecision(7), fv.range.toPrecision(7), 'apex', f1.apex.toPrecision(7), fv.apex.toPrecision(7), 'vImp', f1.vImpact.toPrecision(6), fv.v.toPrecision(6), 'air', JSON.stringify(f1.air), 'ocean', f1.ocean&&f1.ocean.E.toPrecision(4));
    console.log('  ranges', shares.map(f=>f.range.toPrecision(5)).join(' '), ' airE', shares.map(f=>f.air?f.air.E.toPrecision(4):'-').join(' '), ' oceanE', shares.map(f=>f.ocean?f.ocean.E.toPrecision(4):'-').join(' '));
  }
}
