const { P, D, g, S, ctx } = require('../audit/common.js');
const K = P.K;
const surfaces = D.surfaces.map(s=>s.id);
console.log('surfaces', surfaces);
for (const mode of ['comic','real']) {
 for (const sid of surfaces) {
  let first=null, rows=[];
  for (let lg=1; lg<=34.0001; lg+=0.05) {
    const r = P.jump(ctx(10**lg, {surface:sid, mode}));
    const vB = r.push.vB;
    const capped = r.groundFails && Math.abs(vB-0.01*K.c) < 1e-6*K.c;
    if (capped && first==null) first=lg;
    if (r.groundFails && first!=null && !capped) rows.push('uncapped again at '+lg.toFixed(2));
  }
  console.log(mode, sid, 'first cap at logKg', first && first.toFixed(2), rows.slice(0,3).join(';'));
 }
}
// detail at default concrete comic
for (const lg of [12,13,14,14.5,15,16,20,25,30,34]) {
  const r = P.jump(ctx(10**lg, {surface:'concrete'}));
  const c0 = ctx(10**lg,{surface:'concrete'});
  const A2 = 2*c0.body.footArea; const cB = K.PONCELET_K*(c0.surface.rho||2000)*A2;
  const fB = r.F - r.groundLimitForce;
  console.log(lg, 'groundFails',r.groundFails,'heldBack',r.heldBack,'vB',r.push.vB.toExponential(4),'uncapped sqrt(f/c)',Math.sqrt(fB/cB).toExponential(3),'v',r.v.toExponential(3),'rel',r.relativistic,'Eground',r.Eground.toExponential(3),'quake',r.groundQuake);
}
const ri = P.jump(ctx(Infinity,{surface:'concrete'}));
console.log('inf', ri.push.vB, ri.groundFails, ri.Eground);
