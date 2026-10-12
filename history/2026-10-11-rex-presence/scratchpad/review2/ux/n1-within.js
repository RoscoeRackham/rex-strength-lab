// Is "Nothing this move does harms anyone within 5 m" true when the hazards are only checked at 5 m?
global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g, R = P.RESTRAINT;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const goals = { throw: { obj: obj('car'), angle: 45, target: 30 }, jump: { target: 3 }, stomp: {}, punch: { target: 10.4 }, clap: { target: 9.43 }, sprint: { target: 12.42 }, pull: { obj: obj('car'), target: 10 } };
for (const sfc of ['concrete', 'sand', 'clay', 'granite']) for (const lk of [3, 4, 4.9577, 5.5, 6, 7, 8]) for (const mode of ['comic', 'real']) for (const gh of [false, true]) {
  const c = { F: Math.pow(10, lk) * g, mode, body: rex, surface: surf(sfc), groundHolds: gh, anchor: 'friction' };
  for (const [mv, o0] of Object.entries(goals)) {
    const o = Object.assign({ near: 5 }, o0);
    const p = R.plan(mv, c, o);
    let k = 0; while (!p.step() && k++ < 100000);
    const ce = p.ceiling();
    if (ce.by) continue;   // the page would name a hazard; we want the 'none: nothing harms anyone within 5 m' case
    const M = R.MOVES[mv], r = p.run(undefined), opt = p.opt;
    const sh = M.shake ? M.shake(r, opt) : null;
    const v1 = sh ? P.ppvAt(sh, 1) : 0, v2 = sh ? P.ppvAt(sh, 2) : 0;
    const E = M.blast ? M.blast(r, opt) : 0, rb = E > 0 ? P.blastRadius(E, R.DP_HARM) : 0;
    if (v1 >= P.VIB.TH.plaster || rb >= 1) console.log(mv, sfc, 'logKg', lk, mode, gh ? 'comic ground' : '', '| all-out: PPV 1 m', (v1 * 1000).toFixed(1), 'mm/s, 2 m', (v2 * 1000).toFixed(1), 'mm/s (plaster', P.VIB.TH.plaster * 1000, 'mm/s); 100 Pa reach', rb.toFixed(2), 'm');
  }
}
