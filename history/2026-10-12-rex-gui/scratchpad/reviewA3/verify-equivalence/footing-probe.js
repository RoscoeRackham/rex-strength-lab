global.window = global;
const P = require('/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewA3/verify-equivalence/branch/rex-strength-lab/src/engine.js'); require('/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewA3/verify-equivalence/branch/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const g = 9.80665, sand = D.surfaces.find((s) => s.id === 'sand');
const F = 1e9 * g;
for (const [who, build, m] of [['Rex', 'rex', 3007], ['Ollie', 'ollie', 3007], ['Rex 30 t', 'rex', 30000]]) {
  const body = P.makeBody({ H: 3.048, m, build });
  const a = P.anchorCapacity({ body, surface: sand, theta: 0, anchor: 'friction', groundHolds: false });
  console.log(who.padEnd(9), 'mu', sand.mu, ' mu*m*g', (sand.mu * m * g / 1e3).toPrecision(4), 'kN', ' Nmax', (a.Nmax / 1e3).toPrecision(4), 'kN', ' weight', (m * g / 1e3).toPrecision(4), 'kN', ' footing R', (a.R / 1e3).toPrecision(4), 'kN = mu*min(mg,Nmax)', (sand.mu * Math.min(m * g, a.Nmax) / 1e3).toPrecision(4));
}
const cR = { F, mode: 'comic', body: P.makeBody({ H: 3.048, m: 3007, build: 'rex' }), surface: sand, groundHolds: false, anchor: 'friction' };
const cO = { F, mode: 'comic', body: P.makeBody({ H: 3.048, m: 3007, build: 'ollie' }), surface: sand, groundHolds: false, anchor: 'friction' };
const pm = P.pushMatch ? P.pushMatch(cR, cO) : null;
console.log('pushMatch', pm && { HA: pm.HA, HB: pm.HB, DA: pm.DA, DB: pm.DB, outcome: pm.outcome });
const aw = P.armWrestle ? P.armWrestle(cR, cO) : null;
console.log('armWrestle', aw && { RA: aw.RA, RB: aw.RB, tableBreaks: aw.tableBreaks, AA: aw.AA, AB: aw.AB, outcome: aw.outcome });
