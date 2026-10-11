// Independent re-check of F8: flat-g "no-air" claims in jump and throw bays.
const { P, D, g, ctx, obj } = require('./lib.js');
const K = P.K, GM = K.GM, R = K.R_E;
const vesc = Math.sqrt(2 * GM / R);
console.log('g', K.g, 'GM/R^2', GM / R / R, 'v_esc', vesc.toFixed(1), 'v_circ', Math.sqrt(GM / R).toFixed(1));
// Analytic vertical apex in 1/r^2 field, energy conservation
const kep = (v) => { const x = v * v / (vesc * vesc); return x >= 1 ? Infinity : R * x / (1 - x); };
console.log('\n--- JUMP (what the UI would print: tile "no-air answer" + sentence "with no air he would reach") ---');
for (const surface of ['granite', 'concrete', 'sand']) for (const gh of [true, false]) for (const mode of ['comic', 'real']) {
  for (const lg of [8, 8.5, 9, 9.5, 10, 11, 13, 15]) {
    const c = ctx({ logKg: lg, surface, groundHolds: gh, mode });
    const j = P.jump(c), f = j.flight;
    const tileShown = !f.relativistic && !f.escaped;
    const sentShown = !f.relativistic && !f.escaped && f.apex > 50;
    if (!tileShown) continue;
    const truth = kep(j.v);
    const vac = P.fly({ v0: j.v, thetaDeg: 90, h0: 0, m: 1, A: 1, Cd: 0 });
    const ratio = truth / j.vacuumApex;
    if (ratio > 1.1) console.log(surface, gh ? 'holds' : 'yields', mode, '1e' + lg, 'v=' + j.v.toFixed(0), 'UI vacApex=' + (j.vacuumApex / 1e3).toFixed(0) + 'km', 'truth=' + (isFinite(truth) ? (truth / 1e3).toFixed(0) + 'km' : 'ESCAPES'), 'fly(Cd0)=' + (vac.escaped ? 'ESC' : (vac.apex / 1e3).toFixed(0) + 'km'), 'ratio=' + (isFinite(ratio) ? ratio.toFixed(2) : 'inf'), 'sentence shown:', sentShown, 'drag apex', (f.apex / 1e3).toFixed(1) + 'km');
  }
}
console.log('\n--- error ratio of flat formula vs v ---');
for (const v of [1000, 3000, 5000, 7000, 7910, 9000, 11000]) console.log(v, (kep(v) / (v * v / 2 / K.g)).toFixed(3));
console.log('\n--- THROW (sentence "Without air it would have gone min(v^2/g, 2e7)") ---');
for (const o of D.objects.filter((x) => !x.noThrow)) for (const ang of [45, 30, 60, 80]) for (const lg of [6, 7, 8, 9, 10, 11, 12, 14]) {
  const c = ctx({ logKg: lg, surface: 'granite', groundHolds: true });
  const r = P.throwObject(c, o, ang); const f = r.flight;
  if (!r.canMove || f.relativistic) continue;
  const flat = r.v * r.v / g;
  if (!(f.range < 0.2 * flat)) continue;
  const shown = Math.min(flat, 2e7);
  const vac = P.fly({ v0: r.v, thetaDeg: ang, h0: c.body.releaseHeight, m: o.m, A: o.area, Cd: 0, tMax: 30 * 86400 });
  const vacStr = vac.escaped ? 'ESCAPES' : vac.timedOut ? 'timedOut' : (vac.range / 1e3).toFixed(0) + 'km';
  const ratio = vac.escaped ? Infinity : vac.range / shown;
  if (ratio > 1.15 || ratio < 0.87 || f.escaped) console.log(o.id, ang + 'deg', '1e' + lg, 'v=' + r.v.toFixed(0), 'UI says ' + (shown / 1e3).toFixed(0) + 'km', 'vacuum round-Earth ' + vacStr, 'ratio=' + (isFinite(ratio) ? ratio.toFixed(2) : 'inf'), 'dragFlightEscaped=' + f.escaped);
}
