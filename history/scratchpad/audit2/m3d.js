const { P, ctx } = require('../audit/common.js');
for (const lg of [3,4,5,6,8,10,15,20,34]) { const r=P.jump(ctx(10**lg,{mode:'real'})); console.log(lg,'gf',r.groundFails,'hb',r.heldBack,'vB',r.push.vB,'Eg',r.Eground.toExponential(2)); }
