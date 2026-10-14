const R='/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewC2/verify-copy/repo/rex-strength-lab/';
global.window={}; require(R+'src/data.js'); const D=window.DINO_DATA; const L=require(R+'src/ladder.js');
const P=require(R+'src/engine.js');
const K=P.K||{};
for (const H of [3.048, 100, 500]) {
  const b0=P.makeBody({H});
  const R0=Math.cbrt(3*b0.volume/(4*Math.PI));
  const mBH = R0*299792458**2/(2*6.674e-11);
  const b=P.makeBody({H, m: mBH*0.999});
  const g=P.weight? null:null;
  const E_NM = 370e3*4.184e9;
  const J=mBH*0.999*E_NM;
  console.log('H',H,'mBH',mBH.toExponential(3),'decompJ~',J.toExponential(3), L.compare(J,D.energyRefs).text);
}
