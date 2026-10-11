global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const g = P.K.g;
const body = P.makeBody({H:2, m:180});
function J(surfId, logKg, mode='real', extra={}) {
  const surface = D.surfaces.find(s=>s.id===surfId);
  const c = Object.assign({F: Math.pow(10, logKg)*g, mode, body, surface, groundHolds:false, anchor:'friction'}, extra);
  return P.jump(c);
}
const hulk = Math.log10(D.ladder ? 0 : 0);
const rows = [
  ['gravel', 3.8], ['gravel', Math.log10(100*907.18474)], ['gravel', 14],
  ['softclay', Math.log10(3500)], ['softclay', Math.log10(100*907.18474)],
  ['sand', Math.log10(251)], ['sand', Math.log10(511)],
  ['stiffclay', null], 
];
for (const [s, l] of rows) {
  if (l==null) continue;
  const r = J(s, l);
  console.log(s, l.toFixed(3), (Math.pow(10,l)).toExponential(3), 'v=', r.v.toFixed(3), 'apex=', r.flight.apex !== undefined ? r.flight.apex : JSON.stringify(Object.keys(r.flight)), 'heldBack', r.heldBack, 'groundFails', r.groundFails, 'sink', r.push.xB.toFixed(4));
}
