const R='/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewC2/verify-copy/repo/rex-strength-lab/';
global.window={}; require(R+'src/data.js'); const D=window.DINO_DATA; const L=require(R+'src/ladder.js');
const P=require(R+'src/engine.js');
for (const build of ['rex','human']) for (const H of [3.048, 500]) {
  const rhoBH=P.blackHoleDensity(H,build);
  const b0=P.makeBody({H,build});
  for (const f of [0.999, 0.99999]) {
    const b=P.makeBody({H,build,m:rhoBH*f*b0.volume});
    const g=P.bodyGravity? P.bodyGravity(b):null;
    console.log(build,H,'m',b.m.toExponential(3),'rho',b.rho.toExponential(2),'BH?',P.isBlackHole(b), g? g.decompJ.toExponential(3):'', g? L.compare(g.decompJ,D.energyRefs).text:'');
  }
}
console.log(Object.keys(P).filter(k=>/grav|weight|black/i.test(k)));
