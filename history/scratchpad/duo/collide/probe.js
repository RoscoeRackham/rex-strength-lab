global.window = {}; const P = require('/home/user/dino-strength-sim/src/engine.js'); require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA;
const K=P.K, g=K.g;
const surf = (id)=>D.surfaces.find(s=>s.id===id);
const ctx=(o)=>Object.assign({F:100*907.18474*g, mode:'comic', body:P.makeBody({H:2,m:180}), surface:surf('concrete'), groundHolds:false, anchor:'friction'},o||{});
for (const mode of ['comic','real']) for (const anchor of ['friction','braced','bolted']) {
  const c=ctx({mode,anchor}); const s=P.sprint(c); const j=P.jump(c); const st=P.stomp(c);
  console.log(mode,anchor,'sprint',s.vTop.toFixed(3),s.limit,s.topLimit,'| jump v',j.v.toFixed(2),'apex',j.flight.apex.toFixed(1),'vImp',j.flight.vImpact.toFixed(2),j.flight.landed,'| stomp vBody',st.vBody.toFixed(3),'apex',st.bodyFlight.apex.toFixed(2),'vImp',st.bodyFlight.vImpact.toFixed(3));
}
const c=ctx(); console.log('F',c.F, 'anc R', P.anchorCapacity({body:c.body,surface:c.surface,theta:0,anchor:'friction',groundHolds:false}).R);
console.log('eqR', P.eqRadius(c.body));
// infinite
for (const anchor of ['friction','bolted']) { const s=P.sprint(ctx({F:Infinity,anchor})); console.log('inf',anchor,s.vTop,s.limit,s.topLimit); }
