global.window = {};
const path = process.argv[2];
const P = require(path);
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA; const g = 9.80665;
let worst = [];
for (const H of [0.3, 0.5, 1, 2, 5, 20, 100]) for (const s of D.surfaces) for (const anchor of ['friction','braced','bolted']) {
  const body = P.makeBody({H});
  const c = {mode:'real', body, surface:s, groundHolds:false, anchor};
  const a = P.jump(Object.assign({}, c, {F:1e34*g})), b = P.jump(Object.assign({}, c, {F:Infinity}));
  const rel = Math.abs(a.v - b.v)/Math.max(a.v,1e-12);
  if (rel > 1e-4 || a.heldBack !== b.heldBack || a.groundFails !== b.groundFails) worst.push(`H=${H} ${s.id} ${anchor}: v34=${a.v.toPrecision(4)} vinf=${b.v.toPrecision(4)} apex ${a.flight.apex.toPrecision(3)}/${b.flight.apex.toPrecision(3)} held ${a.heldBack}/${b.heldBack} fails ${a.groundFails}/${b.groundFails}`);
}
console.log(worst.length + ' mismatches'); console.log(worst.slice(0,40).join('\n'));
