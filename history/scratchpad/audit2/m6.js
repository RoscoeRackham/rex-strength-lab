global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const g = P.K.g;
const body = P.makeBody({ H: 2, m: 180 });
const car = D.objects.find(o => o.id === 'car');
for (const surfId of ['concrete', D.surfaces[0].id]) for (const anchor of ['friction','braced','bolted']) for (const gh of [false,true]) for (const mode of ['comic','real']) {
  const surface = D.surfaces.find(s => s.id === surfId);
  for (const F of [1e34*g, 1e40*g, Infinity]) {
    const r = P.throwObject({ F, mode, body, surface, groundHolds: gh, anchor }, car, 45);
    console.log(surfId, anchor, gh?'holds':'gives', mode, F===Infinity?'inf':(F/g).toExponential(0), 'anc.R', r.anchor.R.toExponential(2), 'pA', r.push && r.push.pA, 'pB', r.push && r.push.pB, 'recoilV', r.recoilV, 'recoilE', r.recoilE, 'v', r.v, 'sink', r.sinkRatio);
  }
}
