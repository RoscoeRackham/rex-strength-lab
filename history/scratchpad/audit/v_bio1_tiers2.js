const P = require('/home/user/dino-strength-sim/src/engine.js');
const g = 9.80665;
const surfaces = { sand: { qult: 150e3, mu: 0.5, shear: 20e3, rho: 1600 }, concrete: { qult: 10e6, mu: 0.8, shear: 2e6, rho: 2400 }, granite: { qult: 400e6, mu: 0.7, shear: 20e6, rho: 2700 } };
const objs = { baseball: { m: 0.145, area: 0.00434, Cd: 0.35, rho: 683 }, shot: { m: 7.26, area: 0.0113, Cd: 0.47, crush: 250e6, rho: 7200 }, car: { m: 1360, area: 4, Cd: 1.0, crush: 1e6, rho: 300 }, bus: { m: 11500, area: 15, Cd: 1.0, crush: 1e6, rho: 150 } };
const ST = 907.18474;
const tiers = { human: 511, spidey: 10 * ST, thing: 100 * ST, secretwars: 150e9 * ST, allstar: 200e18 * ST };
const acts = {
  punch: (c) => P.punch(c).vFist, clap: (c) => P.clap(c).vHand, stomp: (c) => P.stomp(c).vFoot, jump: (c) => P.jump(c).v,
  ...Object.fromEntries(Object.entries(objs).map(([n, o]) => ['throw:' + n, (c) => P.throwObject(c, o, 45).v])),
};
const out = {};
for (const H of [0.4, 2, 50]) for (const [sn, surf] of Object.entries(surfaces)) for (const [tn, kg] of Object.entries(tiers)) for (const anchor of ['friction']) for (const gh of [false]) {
  const body = P.makeBody({ H, m: 180 * Math.pow(H / 2, 3) });
  const mk = (k) => ({ F: k * g, mode: 'real', body, surface: surf, groundHolds: gh, anchor });
  for (const [an, f] of Object.entries(acts)) {
    if (f(mk(kg)) > 0) continue;
    let lowerPos = null;
    for (let lk = Math.log10(kg) - 0.25; lk > 0; lk -= 0.25) if (f(mk(Math.pow(10, lk))) > 0) { lowerPos = lk; break; }
    if (lowerPos != null) (out[`H=${H} ${sn} ${tn}`] = out[`H=${H} ${sn} ${tn}`] || []).push(an + `(>0 at 1e${lowerPos.toFixed(2)})`);
  }
}
for (const [k, v] of Object.entries(out)) console.log(k + ': ' + v.join(', '));
console.log('combos:', Object.keys(out).length);
