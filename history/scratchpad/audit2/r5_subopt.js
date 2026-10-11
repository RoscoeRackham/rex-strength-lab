global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const g = P.K.g;
const body = P.makeBody({H:2, m:180});
// best jump over sub-max push F' <= F (Rex choosing his effort): by scanning logKg' up to logKg
function bestUpTo(s, logKg, mode='real') {
  let best = null;
  for (let l = 1.5; l <= logKg + 1e-9; l += 0.005) {
    const r = P.jump({F: Math.pow(10,l)*g, mode, body, surface: s, groundHolds:false, anchor:'friction'});
    if (!best || r.v > best.v) best = {v: r.v, apex: r.flight.apex, l};
  }
  return best;
}
const hulk = Math.log10(90718.474);
for (const [id, l] of [['gravel',3.8],['gravel',hulk],['gravel',14],['softclay',Math.log10(3500)],['softclay',hulk],['sand',Math.log10(251)],['sand',Math.log10(511)],['stiffclay',12.72]]) {
  const s = D.surfaces.find(x=>x.id===id);
  const r = P.jump({F: Math.pow(10,l)*g, mode:'real', body, surface: s, groundHolds:false, anchor:'friction'});
  const b = bestUpTo(s, l);
  console.log(id, l.toFixed(3), 'shown v', r.v.toFixed(3), 'apex', r.flight.apex.toFixed(3), '| best F<=F: v', b.v.toFixed(3), 'apex', b.apex.toFixed(3), 'at logKg', b.l.toFixed(3));
}
// Also: what the engine's jump uses internally as push force: actionForce = F*1.4; check grid of internal F' in [RB, F] directly
