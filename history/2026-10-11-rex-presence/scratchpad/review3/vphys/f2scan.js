global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
function coast(M, u, R, k) { if (!isFinite(R) || !(u > 0)) return 0; return k > 0 ? M / (2 * k) * Math.log1p(k * u * u / R) : M * u * u / (2 * R); }
const dial = Number(process.argv[2] || 100 * 907.18474);
for (const oid of ['baseball', 'shot', 'person', 'bowling', 'piano', 'motorcycle', 'car', 'pickup', 'bus', 'semi', 'tank']) {
  for (const s of D.surfaces) {
    const obj = D.objects.find((x) => x.id === oid);
    const ctx = { F: dial * g, mode: 'comic', body: rex, surface: s, groundHolds: false, anchor: 'friction' };
    const pl = P.RESTRAINT.plan('throw', ctx, { obj, angle: 45, target: 30, near: 5 });
    while (!pl.step()) {}
    const gl = pl.goal(), ce = pl.ceiling();
    const use = gl.reached && (!ce.by || gl.use <= ce.below) ? gl.use : (ce.by ? ce.below : (isFinite(dial) ? dial * g : gl.use));
    const r = P.RESTRAINT.MOVES.throw.run(Object.assign({}, ctx, { use }), { obj, angle: 45 });
    if (!r.canMove || !(r.recoilV > 0)) continue;
    const Rs = P.anchorCapacity({ body: rex, surface: s, theta: 0, anchor: 'friction', groundHolds: false }).R;
    const sl = coast(rex.m, r.recoilV * Math.SQRT1_2, Rs, 0.5 * P.K.rho0 * rex.Cd * rex.frontArea);
    const tot = sl + (r.push.xA || 0);
    if (tot > 5) console.log(oid, s.id, 'use t', (use / g / 1000).toFixed(1), 'goalReached', gl.reached, 'ceilingBy', ce.by, 'recoilV', r.recoilV.toFixed(2), 'lurch', (r.push.xA || 0).toFixed(2), 'coast', sl.toFixed(1));
  }
}
