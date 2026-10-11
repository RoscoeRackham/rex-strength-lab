global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const g = P.K.g;
const H = +(process.argv[2]||2);
const body = P.makeBody({H, m: 180*Math.pow(H/2,3)});
const mode = process.argv[3]||'real';
for (const s of D.surfaces) {
  let prevV = 0, prevL = null, viol = [];
  let maxDrop = 0, worst = null;
  let best = 0, bestL = null;
  for (let l = 1.5; l <= 16; l += 0.02) {
    const c = {F: Math.pow(10,l)*g, mode, body, surface: s, groundHolds:false, anchor:'friction'};
    const r = P.jump(c);
    if (r.v > best) { best = r.v; bestL = l; }
    const drop = (best - r.v)/best;
    if (drop > maxDrop) { maxDrop = drop; worst = [l.toFixed(2), r.v.toFixed(3), r.flight.apex.toFixed(3), r.heldBack, r.groundFails, 'best so far', best.toFixed(3), 'at', bestL.toFixed(2)]; }
  }
  console.log(s.id.padEnd(10), 'max relative drop', (100*maxDrop).toFixed(2)+'%', worst ? worst.join(' ') : '');
}
