const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = {}; require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA;
const g = P.K.g;
const surf = D.surfaces.find(s => s.id === 'concrete');
function ctx(kg, mode, H, m) {
  const body = P.makeBody({ H, m });
  return { F: kg * g, mode, body, surface: surf, groundHolds: false, anchor: 'friction' };
}
for (const [kg, H] of [[10,2],[50,2],[100,2],[150,2],[180,2],[250,2],[360,2],[511,2],[511,50],[1e5,50],[2.81e6,50],[5.62e6,50]]) {
  const m = 180 * (H/2)**3;
  for (const mode of ['comic','real']) {
    const c = ctx(kg, mode, H, m);
    const s = P.sprint(c), j = P.jump(c), l = P.lift(c, {m: 0.001});
    console.log(`${kg} kg H=${H} body=${m.toExponential(3)} F/W=${(kg/m).toPrecision(3)} ${mode}: sprint vTop=${s.vTop.toFixed(2)} (${s.topLimit}) thrust=${s.thrust.toExponential(3)} accel=${s.accelG.toFixed(4)}g limit=${s.limit} t100=${s.t100} | jump stalled=${j.push.stalled} v=${j.v.toFixed(3)}`);
  }
}
