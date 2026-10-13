const fs = require('fs'), { execSync } = require('child_process');
const S = '/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewB2/code';
const src = fs.readFileSync(S + '/lab/src/engine.js', 'utf8');
const M = {
  e01_passenger_share_binary: ['PASSENGER.dragG(o.obj, r.v) * dragFactor(o) > PASSENGER.noHarm(1)', 'PASSENGER.dragG(o.obj, r.v) * (airShare(o) >= 1 ? 0 : 1) > PASSENGER.noHarm(1)'],
  e02_throw_own_slides: ['const anc = anchorCapacity({ body, surface: ctx.surface, theta: th, anchor: ownAnchor(ctx), groundHolds: holdsGround(ctx), mA, mB });', 'const anc = anchorCapacity({ body, surface: ctx.surface, theta: th, anchor: ctx.anchor, groundHolds: holdsGround(ctx), mA, mB });'],
  e03_throw_toGround_sign: ["if ((ctx.ownRecoil || ctx.unbreakable) && !push.stalled && v > 0) extra.toGround = { J: push.pB === Infinity ? Infinity : Math.max(0, push.pB - push.pA)", "if ((ctx.ownRecoil || ctx.unbreakable) && !push.stalled && v > 0) extra.toGround = { J: push.pB === Infinity ? Infinity : Math.max(0, push.pA - push.pB)"],
  e04_fly_ignores_air: [', record: !!ctx.record, dragK: dK })', ', record: !!ctx.record })'],
  e05_stomp_blast_keeps: ['blast: (r, o) => shock(r.vFoot, o && o.unbreakable ? r.E - (r.absorbed || 0) : r.E),', 'blast: (r, o) => shock(r.vFoot, r.E),'],
  e06_shove_J_no_footing: ['(push.pB > 0 ? push.pB + fB.R * push.t : Fpush * push.t) - push.pA', '(push.pB > 0 ? push.pB : Fpush * push.t) - push.pA'],
  e07_collide_toGround_how: ["if (held) out.toGround = { J: splat ? h.inel.pT : h.el.pT, T: cf.t, how: 'held' };", "if (held) out.toGround = { J: splat ? h.inel.pT : h.inel.pT, T: cf.t, how: 'held' };"],
  e08_handAir_gamma: ['return { mAir, area, d, E: isFinite(gamma) ? gamma * mAir * vv * vv : Infinity };', 'return { mAir, area, d, E: isFinite(gamma) ? mAir * vv * vv : Infinity };'],
  e09_punch_toGround_T: ['toGround: { J: push.pB === Infinity ? Infinity : Math.max(0, push.pB - push.pA), T: Math.max(limbPulse(body), push.t) } } : {};\n    return Object.assign(extra, {\n      F, push, anchor: anc, vFist', 'toGround: { J: push.pB === Infinity ? Infinity : Math.max(0, push.pB - push.pA), T: push.t } } : {};\n    return Object.assign(extra, {\n      F, push, anchor: anc, vFist'],
  e10_jump_pushOff_always: ['if (v > 0 && (F > RBreal || !landed)) extra.pushOff = { J: p, T: finiteRun ? push.t : 0 };', 'if (v > 0) extra.pushOff = { J: p, T: finiteRun ? push.t : 0 };'],
  e11_unlimited_shake_toGround_catchC_uAfter: ['Math.max(0, vToMomentum(out.vArrive, obj.m) - (bC.m + obj.m) * k.uAfter)', 'vToMomentum(out.vArrive, obj.m)'],
  e12_ocean_P_full: ['out.ocean = { E: (1 - dK) * eDrag, P: (1 - dK) * P };', 'out.ocean = { E: (1 - dK) * eDrag, P: P };'],
  e13_line_bend_factor: ['const out = { v, thetaDeg, bend, bendMax: 2 * bend, leaves: a >= 0, escapeEarth: V_ESC };', 'const out = { v, thetaDeg, bend, bendMax: bend, leaves: a >= 0, escapeEarth: V_ESC };'],
  e14_fastAir_nonrel: ['const S = Math.sqrt((1 + xx) * (1 + xx) + 2 * gm1 * xx); return (gm1 + 2) / (S * (1 + xx + gm1 + S));', 'return 1 / ((1 + xx) * (1 + xx));'],
  e15_growth_toGround_T: ['{ toGround: { J: g.m * vSole, T: tau } }', '{ toGround: { J: g.m * vSole, T: 2 * tau } }'],
  e16_pull_own_no_feet_limit: ['accel = Math.min(aLoad, aFeet);', 'accel = aLoad;'],
};
for (const [k, [a, b]] of Object.entries(M)) {
  const n = src.split(a).length - 1;
  if (n !== 1) { console.log('SKIP', k, 'matches', n); continue; }
  fs.writeFileSync(S + '/emut/' + k + '.js', src.replace(a, b));
}
console.log('ok');
