const { P, ctx } = require('/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit/common.js');
const K = P.K;
function find(pred){ let lo=20, hi=34; for(let i=0;i<60;i++){const m=(lo+hi)/2; if(pred(P.stomp(ctx(10**m)))) hi=m; else lo=m;} return hi.toFixed(2); }
console.log('D>R_E at logKg', find(r=>r.crater>K.R_E));
console.log('D>2R_E at logKg', find(r=>r.crater>2*K.R_E));
console.log('D>piR_E at logKg', find(r=>r.crater>Math.PI*K.R_E));
console.log('disrupts at logKg', find(r=>r.disrupts));
for (const s of ['sand','granite','clay','asphalt']) { const r=P.stomp(ctx(1e34,{surface:s})); console.log(s, (r.crater/1000).toFixed(0)+' km'); }
