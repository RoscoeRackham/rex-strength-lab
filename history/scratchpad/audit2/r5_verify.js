global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require(process.argv[2]);
const g = P.K.g;
for (const H of [0.4, 2, 50]) {
  const body = P.makeBody({H, m: 180*Math.pow(H/2,3)});
  for (const mode of ['real','comic']) {
    const t0 = Date.now(); let n = 0;
    const out = [];
    for (const s of D.surfaces) {
      let best = 0, maxDrop = 0, worst = '';
      for (let l = 1; l <= 34; l += 0.05) {
        const r = P.jump({F: Math.pow(10,l)*g, mode, body, surface: s, groundHolds:false, anchor:'friction'}); n++;
        if (r.v > best) best = r.v;
        const drop = (best - r.v)/best;
        if (drop > maxDrop + 1e-12) { maxDrop = drop; worst = l.toFixed(2); }
      }
      out.push(s.id+':'+(100*maxDrop).toFixed(3)+'%'+(worst?'@'+worst:''));
    }
    console.log('H', H, mode, ((Date.now()-t0)/n).toFixed(1)+' ms/jump', out.join(' '));
  }
}
