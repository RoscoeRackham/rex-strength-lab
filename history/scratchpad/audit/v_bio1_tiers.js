const P = require('/home/user/dino-strength-sim/src/engine.js');
const g = 9.80665;
const surfaces = { sand: { qult: 150e3, mu: 0.5, shear: 20e3, rho: 1600 }, concrete: { qult: 10e6, mu: 0.8, shear: 2e6, rho: 2400 }, granite: { qult: 400e6, mu: 0.7, shear: 20e6, rho: 2700 } };
const objs = { baseball: { m: 0.145, area: 0.00434, Cd: 0.35, rho: 683 }, shot: { m: 7.26, area: 0.0113, Cd: 0.47, crush: 250e6, rho: 7200 }, car: { m: 1360, area: 4, Cd: 1.0, crush: 1e6, rho: 300 }, bus: { m: 11500, area: 15, Cd: 1.0, crush: 1e6, rho: 150 }, tank: { m: 66800, area: 15, Cd: 1, crush: 1e9, rho: 1200 } };
const ST = 907.18474;
const tiers = { human: 511, spidey: 10 * ST, thing: 100 * ST, secretwars: 150e9 * ST, allstar: 200e18 * ST };
let hits = 0;
for (const H of [0.4, 2, 50]) for (const [sn, surf] of Object.entries(surfaces)) for (const [tn, kg] of Object.entries(tiers)) for (const anchor of ['friction', 'braced', 'bolted']) for (const gh of [false, true]) {
  const body = P.makeBody({ H, m: 180 * Math.pow(H / 2, 3) });
  const c = { F: kg * g, mode: 'real', body, surface: surf, groundHolds: gh, anchor };
  const bad = [];
  if (!(P.punch(c).vFist > 0)) bad.push('punch');
  if (!(P.clap(c).vHand > 0)) bad.push('clap');
  if (!(P.stomp(c).vFoot > 0)) bad.push('stomp');
  const j = P.jump(c); if (j.push.stalled || !(j.v > 0)) bad.push('jump');
  for (const [on, o] of Object.entries(objs)) { const t = P.throwObject(c, o, 45); if (!t.canMove && o.m * g * 0.7071 < 0.3 * kg * g * 0.01) bad.push('throw:' + on); }
  if (bad.length) { hits++; if (hits <= 40) console.log(`H=${H} ${sn} ${tn} ${anchor} groundHolds=${gh}: zero -> ${bad.join(',')}`); }
}
console.log('preset combos with zero output:', hits);
