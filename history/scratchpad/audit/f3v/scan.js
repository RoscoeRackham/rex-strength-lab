global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const S = Object.fromEntries(D.surfaces.map(s => [s.id, s]));
const O = Object.fromEntries(D.objects.map(o => [o.id, o]));
function ctx(kg, o) { o = o || {}; const H = o.H || 2; const body = P.makeBody({ H, m: 180 * Math.pow(H / 2, 3) });
  return { F: kg * g, mode: 'real', body, surface: S[o.surface || 'concrete'], groundHolds: !!o.groundHolds, anchor: o.anchor || 'friction' }; }
const acts = {
  punch: c => P.punch(c).vFist, clap: c => P.clap(c).vHand, stomp: c => P.stomp(c).vFoot, jump: c => P.jump(c).v,
  baseball: c => P.throwObject(c, O.baseball, 0).v, shot: c => P.throwObject(c, O.shot, 37).v, car: c => P.throwObject(c, O.car, 45).v,
};
for (const [surf, gh] of [['concrete', false], ['granite', true]]) {
  console.log(`--- surface ${surf} groundHolds=${gh}, H=2 m`);
  for (const [k, f] of Object.entries(acts)) {
    const zeros = []; let prevZero = false, s = null; let lastPos = null;
    for (let lg = 2.7; lg <= 14; lg += 0.01) {
      const v = f(ctx(Math.pow(10, lg), { surface: surf, groundHolds: gh }));
      const z = v === 0;
      if (z && !prevZero) s = lg;
      if (!z && prevZero) zeros.push([s, lg]);
      prevZero = z;
    }
    if (prevZero) zeros.push([s, 'end']);
    console.log(k.padEnd(9), 'zero-speed bands (log10 kg):', zeros.map(([a, b]) => `${a.toFixed(2)}-${typeof b === 'string' ? b : b.toFixed(2)}`).join(', '));
  }
}
