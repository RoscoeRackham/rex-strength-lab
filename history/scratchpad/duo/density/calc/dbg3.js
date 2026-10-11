const X = require('./weight.js'); const { W, P, K } = X;
const body = P.makeBody({ H: 2, m: 4.12e17 * 0.18 });
const m = body.m, Ab = body.topArea;
for (const Amp of [1e3, 1e4, 1e5, 1e6, 3e6, 6e6, 6.37e6]) {
  const n = 400; let T = 0, dE = 0, dEs = 0; const phiA = X.premPhi(Amp);
  for (let i = 0; i < n; i++) { const th = -Math.PI/2 + (i+0.5)*Math.PI/n, dth = Math.PI/n; const r = Math.abs(Amp*Math.sin(th)), dr = Amp*Math.cos(th)*dth; const v2 = Math.max(0, 2*(phiA - X.premPhi(r))); if (v2>0) T += dr/Math.sqrt(v2); const sig = X.premSolid(r)?W.SIGMA_ROCK:0; dE += Ab*(sig + X.premRho(r)*v2)*dr; dEs += Ab*sig*dr; }
  console.log('A', Amp.toExponential(2), 'T min', (T/60).toFixed(2), 'dE', dE.toExponential(3), 'strength part', dEs.toExponential(3), 'dndA', (m*X.premG(Amp)/dE).toExponential(3), 'g', X.premG(Amp).toExponential(3));
}
