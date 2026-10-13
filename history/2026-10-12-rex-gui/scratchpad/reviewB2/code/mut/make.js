const fs = require('fs');
const S = '/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewB2/code';
const src = fs.readFileSync(S + '/lab/src/engine.js', 'utf8');
const M = {
  m01_relcatch_threshold: ['if (v >= 0.01 * K.c) return relCatch(ctxC, obj, v, gammaDeg, w);', 'if (v >= 0.001 * K.c) return relCatch(ctxC, obj, v, gammaDeg, w);'],
  m02_easypush_RA: ['const run = (F) => pushApart({ F, d, mA, mB, RA: anc.Rslide, RB, mode: \'comic\' });', 'const run = (F) => pushApart({ F, d, mA, mB, RA: anc.R, RB, mode: \'comic\' });'],
  m03_stomp_crater: ['const real = () => (vFoot >= 2000 ||', 'const real = () => (vFoot >= 1500 ||'],
  m04_guw_unbreak: ["if (groundHolds || !unbreakable || real.regime === 'stands') return real;", "if (groundHolds || real.regime === 'stands') return real;"],
  m05_leg_nonwell: ['if (!fast && !w.wellDominated) {', 'if (!fast) {'],
  m06_holdof_why: ["(cB.groundHolds ? 'comicGround' : 'unbreakable')", "(cB.groundHolds ? 'unbreakable' : 'unbreakable')"],
  m07_relblast_hand: ['if (k >= 1) return { land: r.Eobj, path: 0 };', 'if (k >= 1) return { land: r.Eobj, path: o.body ? handAir(o.body, o.obj, r.v, 2).E : 0 };'],
  m08_pull_limitedBy: ['(anc.R >= resist || ctx.ownRecoil)', '(anc.R >= resist || !ctx.ownRecoil)'],
  m09_fire_rblast: ['Math.max(D - (kAir < 1 ? out.sweepK : sweep), body.H)', 'Math.max(D - (kAir < 1 ? out.sweepK : 1.01 * sweep), body.H)'],
  m10_qdyn_launch: ['out.qDynMax = Math.max(out.qDynMax, rhoAt(h0) * vL * vL * dK);', 'out.qDynMax = Math.max(out.qDynMax, rhoAt(h0) * vL * vL * dK * 1.5);'],
  m11_easy_recoil_v: ['if (p) v = p.stalled ? 0 : momentumToV(Math.max(0, p.pA - p.pB * e.armMass / Math.max(e.mB, 1e-300)), body.m);', 'if (p) v = p.stalled ? 0 : momentumToV(Math.max(0, p.pA), body.m);'],
  m12_wellrun_heatT: ['dK > 0 ? stagnationT(Math.min(run.vmax, CATCH.V_FIREBALL)) : K.T0', 'dK > 0 ? stagnationT(Math.min(run.vmax, CATCH.V_FIREBALL)) * 1.1 : K.T0'],
  m13_reach_boom_opt: ['boom: !(opt.silentStrike && M.silent) && (M.boomSpeed || M.speed)(r, opt) >= K.a0,', 'boom: !(opt.silentStrike && M.silent) && (M.boomSpeed || M.speed)(r, opt) >= 0.5 * K.a0,'],
  m14_stomp_shake_hole: ['2 * ((o.unbreakable && r.realHole != null ? r.realHole : r.holeDepth) || 0) / r.vFoot', '4 * ((o.unbreakable && r.realHole != null ? r.realHole : r.holeDepth) || 0) / r.vFoot'],
  m15_instant_gives: ['const gives = !!(gnd && gnd.surface && !gnd.groundHolds && !gnd.unbreakable) && g.dH > 0;', 'const gives = !!(gnd && gnd.surface && !gnd.unbreakable) && g.dH > 0;'],
  m16_walk_fp: ['if (groundHolds) return { depth: 0, kind: \'comic\' };', 'if (groundHolds) return { depth: 0, kind: \'held\' };'],
  m17_throwblast_drag: ['const drag = o && o.coolFlight ? 0 : shock(r.v, (r.dragLoss != null ? r.dragLoss : r.Eobj) * k);', 'const drag = o && o.coolFlight ? 0 : shock(r.v, (r.dragLoss != null ? r.dragLoss : 0.9 * r.Eobj) * k);'],
  m18_toss_fire: ["if (v >= CATCH.V_FIREBALL) return Object.assign(out, dK > 0 ? { result: 'fireball', v } : { result: 'escapes', v, fast: true });", "if (v >= CATCH.V_FIREBALL) return Object.assign(out, dK > 0 ? { result: 'fireball', v, fast: false } : { result: 'escapes', v, fast: true });"],
  m19_catch_breakAtLaunch: ['out.breakAtLaunch = !!(breakable && obj.crush && rhoAt(h0) * vL * vL * dK > obj.crush && !kept);', 'out.breakAtLaunch = !!(breakable && obj.crush && rhoAt(h0) * vL * vL * dK > 2 * obj.crush && !kept);'],
  m20_heat_verdict_fl: ['out.heat = heatVerdict(obj, fl.heatLoad, dK > 0 ? fl.maxStagT : K.T0, fl.maxMach * K.a0, fl.radLoad);', 'out.heat = heatVerdict(obj, fl.heatLoad, dK > 0 ? 0.9 * fl.maxStagT : K.T0, fl.maxMach * K.a0, fl.radLoad);'],
};
for (const [k, [a, b]] of Object.entries(M)) {
  const n = src.split(a).length - 1;
  if (n !== 1) { console.log('SKIP', k, 'matches', n); continue; }
  fs.writeFileSync(S + '/mut/' + k + '.js', src.replace(a, b));
}
console.log('ok');
