// Apply one mutation to a scratch copy of the engine and run test/presence.js against it
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const S = process.argv[2];
const SRC = '/tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/review1/snap/rex-strength-lab';
const base = fs.readFileSync(path.join(SRC, 'src/engine.js'), 'utf8');
const M = {
  M1_gentle_changes_recoil: ["recoilV, recoilE,\n      gentle: !!ctx.gentleHold,", "recoilV: ctx.gentleHold ? recoilV * 0.5 : recoilV, recoilE,\n      gentle: !!ctx.gentleHold,"],
  M2_nearfield_x1_33: ["const near = (ramp ? 0.1875 : 0.375) * src.F", "const near = (ramp ? 0.1875 : 0.5) * src.F"],
  M3_soft_landing_still_shakes: ["if (!L || !L.landed || L.soft || !(L.v > 0)) return null;", "if (!L || !L.landed || !(L.v > 0)) return null;"],
  M4_boom_ignores_silent: ["{ id: 'boom', test: (m, r, o) => !(o.silentStrike && m.silent) && m.speed(r) >= K.a0 },", "{ id: 'boom', test: (m, r, o) => m.speed(r) >= K.a0 },"],
  M5_load_falls_with_pace: ["const kLoad = walkLoad(Fr);", "const kLoad = walkLoad(0.55 - Fr) * 3;"],
  M6_catch_gentleT_ignored: ["out.launchRatio > 1 && !out.gentleT)", "out.launchRatio > 1)"],
  M7_catch_cool_ignored: ["out.heat.kind === 'destroyed' && !out.cool)", "out.heat.kind === 'destroyed')"],
  M8_gradual_wrong: ["const Tp = g.dV > 0 ? Math.sqrt(K.rho0 * sh.kV * g.dV / (2 * Math.PI * r * dpSafe)) : 0;", "const Tp = g.dV > 0 ? Math.sqrt(K.rho0 * g.dV / (2 * Math.PI * r * dpSafe)) : 0;"],
  M17_ppv_far_rfit_off: ["if (d > VIB.RFIT) return Math.max(ppvElastic(src, d), ppvElastic(src, VIB.RFIT) * Math.pow(VIB.RFIT / d, VIB.NFAR));", "if (d > VIB.RFIT) return ppvElastic(src, d) * 1.0001;"],
  M18_pace_ignored_cadence: ["const kLoad = walkLoad(Fr);", "const kLoad = walkLoad(Fr) * (1.6 - 2 * Fr);"],
  M9_instant_wrong: ["const tau = g.H / GROW.TISSUE_C;", "const tau = g.H / 343;"],
  M10_injury_wrong: ["EIBAND: [[0.044, 45], [0.1, 40], [0.2, 25], [0.6, 13], [1.6, 10]],", "EIBAND: [[0.044, 90], [0.1, 80], [0.2, 50], [0.6, 26], [1.6, 20]],"],
  M11_soft_landing_keeps_impact_energy: ["const Eimpact = landed && !soft ?", "const Eimpact = landed ?"],
  M12_presets_never: ["{ id: 'houses', test: (m, r, o) => !!m.blast && blastRadius(m.blast(r, o), R.DP_HOUSES) >= o.near },", "{ id: 'houses', test: (m, r, o) => false },"],
  M13_launchG_wrong: ["launchG: !push.stalled && push.t > 0 && isFinite(push.t) ? v / push.t / K.g", "launchG: !push.stalled && push.t > 0 && isFinite(push.t) ? v / push.t / K.g / 10"],
  M14_dragLoss_wrong: ["dragLoss: !fallsBack && flight.landed && !flight.relativistic ? Math.max(0, Eobj", "dragLoss: !fallsBack && flight.landed && !flight.relativistic ? Math.max(0, 2 * Eobj"],
  M15_effort_ignored_in_sprint: ["const Fu = driveStrength(ctx);", "const Fu = ctx.F;"],
  M16_air_hazard_off: ["{ id: 'air', test: (m, r, o) => !!m.blast && blastRadius(m.blast(r, o), R.DP_HARM) >= o.near },", "{ id: 'air', test: (m, r, o) => false },"],
};
const only = process.argv[3];
for (const [name, [a, b]] of Object.entries(M)) {
  if (only && name !== only) continue;
  if (!base.includes(a)) { console.log(name, 'PATTERN NOT FOUND'); continue; }
  const dir = path.join(S, 'mut', name);
  fs.mkdirSync(path.join(dir, 'src'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'test/fixtures'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'src/engine.js'), base.replace(a, b));
  fs.copyFileSync(path.join(SRC, 'src/data.js'), path.join(dir, 'src/data.js'));
  for (const f of ['presence.js', 'baseline-cases.js', 'fixtures/allout-baseline.json']) fs.copyFileSync(path.join(SRC, 'test', f), path.join(dir, 'test', f));
  let out, code = 0;
  try { out = execSync('node test/presence.js', { cwd: dir, encoding: 'utf8', stdio: 'pipe', maxBuffer: 1e8 }); } catch (e) { out = e.stdout; code = e.status; }
  const fails = out.split('\n').filter((l) => l.startsWith('FAIL'));
  console.log(name, code ? 'CAUGHT (' + fails.length + ' fails): ' + fails.slice(0, 2).join(' | ').slice(0, 200) : 'NOT CAUGHT');
}
