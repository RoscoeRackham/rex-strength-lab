global.window={}; require('/home/user/dino-strength-sim/src/data.js'); const D=window.DINO_DATA;
const surface=D.surfaces.find(s=>s.id==='concrete');
for (const f of ['/home/user/dino-strength-sim/src/engine.js','./engine_fix.js']) {
  delete require.cache[require.resolve(f)];
  const P=require(f);
  for (const m of [4.12e17*0.18, 1e15, 1e18]) {
    const body=P.makeBody({H:2,m});
    const st=P.settle(body), fast=P.settle(body,undefined,{sigma:4.1e9,k:2}), slow=P.settle(body,undefined,{sigma:0.1e9,k:0.5,noDF:true});
    const fp=P.fallThrough(body,{});
    console.log(f.slice(-13), m.toExponential(2), 'firstPassLossJ',st.firstPassLossJ.toExponential(3),'3D loss (short*m*g)',(fp.firstPass? fp.firstPass.depthShort*m*9.82:NaN).toExponential(3),'years',st.years.toFixed(1),'fast',fast.years.toFixed(1),'slow',slow.years.toFixed(1));
  }
}
