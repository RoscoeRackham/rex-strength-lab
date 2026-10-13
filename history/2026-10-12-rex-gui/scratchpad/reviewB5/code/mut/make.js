const fs = require('fs');
const src = fs.readFileSync('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js', 'utf8');
const M = {
  m01_fly_orbit_gate: ["if (!vacuum && dK === 0 && !o._noVac) {", "if (!vacuum && dK <= 1 && !o._noVac) {"],
  m02_flyto_orbit_gate: ["if (!vacuum && dK === 0 && !o._noVac && above && !isFinite(xStop)) {", "if (!vacuum && dK <= 1 && !o._noVac && above && !isFinite(xStop)) {"],
  m03_easypush_arm: ["if (p) v = p.stalled ? 0 : momentumToV(Math.max(0, p.pA - p.pB * e.armMass / Math.max(e.mB, 1e-300)), body.m);", "if (p) v = p.stalled ? 0 : momentumToV(Math.max(0, p.pA), body.m);"],
  m04_overshoot_vO: ["const vO = hd.relativistic ? hd.v : tab.vOf(hd.thetaDeg);", "const vO = tab.vOf(hd.thetaDeg);"],
  m05_relcatch_gate: ["if (noAir && v >= 0.01 * K.c) return relCatch", "if (v >= 0.01 * K.c) return relCatch"],
  m06_stomp_crater_L: ["{ hole: 0, crater: craterDiameter({ L: Math.cbrt(6 * mB / (Math.PI * 1000))", "{ hole: 0, crater: craterDiameter({ L: Math.cbrt(6 * mB / (Math.PI * 1100))"],
  m07_well_easy_vL: ["vL = style === 'easy' ? need : vMax;\n        const run = wellRun", "vL = vMax;\n        const run = wellRun"],
  m08_guw_gate: ["if (groundHolds || !unbreakable || real.regime === 'stands') return real;", "if (groundHolds || real.regime === 'stands') return real;"],
  m09_footprint_gate: ["if (!unbreakable) return real;", "if (false) return real;"],
  m10_relblast_land: ["if (!h) return { land: k >= 1 ? r.Eobj : r.Eobj * k, path: 0 };", "if (!h) return { land: r.Eobj * 0.5, path: 0 };"],
  m11_pull_gate: ["if (ctx.ownRecoil && ctx.anchor !== 'bolted') {", "if (ctx.anchor !== 'bolted') {"],
  m13_toss_fire_gate: ["dK > 0 ? { result: 'fireball', v } : { result: 'escapes', v, fast: true }", "dK > 1 ? { result: 'fireball', v } : { result: 'escapes', v, fast: true }"],
  m18_fireball_before_r: ["const r = Math.max(D - (kAir < 1 ? out.sweepK : sweep), body.H);", "const r = Math.max(D - (kAir < 1 ? out.sweepK : sweep * 1.5), body.H);"],
  m19_shockpa: ["out.shockPa = out.vArrive > K.a0 ? rhoAt(hStop) * g2 * out.vArrive", "out.shockPa = out.vArrive > K.a0 ? rhoAt(hStop) * g2 * 1.01 * out.vArrive"],
  m24_wellrun_dk: ["const dK = obj.dragK == null ? 1 : obj.dragK;", "const dK = obj.dragK == null ? 0.99 : obj.dragK;"],
  m32_stomp_blow_T: ["return { J, T: Math.max(footPulse(o.body), 2 * ((o.unbreakable", "return { J, T: Math.max(footPulse(o.body), 2.2 * ((o.unbreakable"],
  m33_landshake_T: ["return impulseSource(o.surface, momentumOf(v, o.obj.m), Math.max(1e-3, L / v));", "return impulseSource(o.surface, momentumOf(v, o.obj.m), Math.max(1e-3, 1.1 * L / v));"],
  m34_pull_shake_gate: ["shake: (r, o) => (o.ownRecoil && r.canMove && isFinite(r.t10m)", "shake: (r, o) => (r.canMove && isFinite(r.t10m)"],
  m35_jump_blast_air: ["blast: (r) => shock(r.footSpeed, r.Eground || 0) + shock(r.v, r.airLoss || 0),", "blast: (r) => shock(r.footSpeed, r.Eground || 0) + shock(r.v, r.airLoss || r.Ebody),"],
  m36_guw_print: ["const print = sd1 && surface.granular ? sandPrint", "const print = sd1 && !surface.granular ? sandPrint"],
  m37_stomp_hole_off: ["const rr = real();\n      holeDepth = rr.hole; crater = rr.crater;", "const rr = real();\n      holeDepth = rr.hole * 1.01; crater = rr.crater;"],
  m38_leg_qdyn: ["out.qDynMax = Math.max(out.qDynMax, rhoAt(h0) * vL * vL * dK);", "out.qDynMax = Math.max(out.qDynMax, rhoAt(h0) * vL * vL * dK * 1.01);"],
};
for (const [k, [a, b]] of Object.entries(M)) {
  const n = src.split(a).length - 1;
  if (n !== 1) { console.log('SKIP ' + k + ': ' + n + ' matches'); continue; }
  fs.writeFileSync(__dirname + '/' + k + '.js', src.replace(a, b));
  console.log('wrote ' + k);
}
