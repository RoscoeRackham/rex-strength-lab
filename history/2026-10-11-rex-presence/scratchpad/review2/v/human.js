global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const P=require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
const D=global.window.DINO_DATA; const sand=D.surfaces.find(s=>s.id==='sand');
for (const [H,m] of [[1.75,76.7],[1.70,70],[1.80,85]]) {
  const b=P.makeBody({H,m,build:'human'});
  for (const pace of ['stroll','walk','brisk']) for (const e of [0,0.5]) {
    const pr=P.presence(b,sand,{effort:e,pace});
    console.log(H,m,pace,'effort',e,'ppv@53m (mm/s)', (pr.ppv(53)*1000).toExponential(2), 'ratio to 0.0019', (0.0019/(pr.ppv(53)*1000)).toFixed(2));
  }
}
// elephant comparison: rex on sand at 20 m, ordinary
const rex=P.makeBody({H:P.DEFAULT_BODIES.rex.H,m:P.DEFAULT_BODIES.rex.m,build:'rex'});
console.log('rex ordinary sand 20 m', (P.presence(rex,sand,{effort:0.5}).ppv(20)*1000).toExponential(2), 'elephant', (P.elephantPPV(20)*1000).toExponential(2));
