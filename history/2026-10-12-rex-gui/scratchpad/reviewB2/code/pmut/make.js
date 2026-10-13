// creates one lab copy per page mutation under pmut/<name>/ (src, test, build.js, assets symlinked), applies it, builds
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const S = '/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewB2/code';
const LAB = S + '/lab';
const M = {
  // a preset moves the slider (the state)
  p01_preset_moves_slider: ['app', "sel.onchange = (e) => { if (e.target.value === 'custom') { const c1 = ctx()", "sel.onchange = (e) => { if (e.target.value === 'windows') state.airAbsorb = 0; if (e.target.value === 'custom') { const c1 = ctx()"],
  // the two-player real-ground facts run with the power on (variant ignored)
  p02_duo_real_variant_off: ['app', "const DUO_VARIANT = { '': null, real: { unbreakable: false }, air0: { airAbsorb: 0 } };", "const DUO_VARIANT = { '': null, real: null, air0: { airAbsorb: 0 } };"],
  // the two-player tab is drawn with Unbreakable footing on even when the preset sets it aside
  p03_duo_no_override: ['app', 'if (duoEff && duoEff.real) state.unbreakable = false;', 'if (false) state.unbreakable = false;'],
  // the solo tab shows the run with the power on, though the effort box says it is set aside
  p04_solo_cE_ignores_real: ['app', 'const cE = eff && eff.real ? Object.assign({}, c0, { unbreakable: false }) : c0;', 'const cE = c0;'],
  // the plan cache key forgets the air share
  p05_planFor_key_no_air: ['app', 'o.near, c.airAbsorb, c.keepForm, c.unbreakable, c.ownRecoil, c.safePassenger', 'o.near, c.keepForm, c.unbreakable, c.ownRecoil, c.safePassenger'],
  // the duo key forgets the air share
  p06_duoKey_no_air: ['app', 'state.oEffortLogKg, state.airAbsorb, state.keepForm', 'state.oEffortLogKg, state.keepForm'],
  // the hint drops its condition on the 0% search (shows whenever the preset never happens at this share)
  p07_hint_always: ['app', "else if (!p0.result('preset:' + e).never) {", "else if (true) {"],
  // migration: old keys kept on as before (a saved Comic ground off turns Unbreakable footing off)
  p08_migrate_groundHolds: ['app', "for (const [k, ok] of Object.entries(VALID)) if (!ok(state[k])) state[k] = DEFAULTS[k];", "if (typeof state.groundHolds === 'boolean') state.unbreakable = state.groundHolds; if (typeof state.gentleHold === 'boolean') state.keepForm = state.gentleHold; for (const [k, ok] of Object.entries(VALID)) if (!ok(state[k])) state[k] = DEFAULTS[k];"],
  // the duo air-hint check runs on the same share (never reachable)
  p09_duo_airhint_off: ['app', "if (act === 'catch' && AIR_PRESETS.has(e) && airShareOf(ctx()) > 0) {", "if (false) {"],
  // the slider's change event doesn't save
  p10_slider_no_save: ['app', "$('#air-absorb').addEventListener('change', () => { save(); update(); });", "$('#air-absorb').addEventListener('change', () => { renderBay(); });"],
};
const only = process.argv.slice(2);
for (const [k, [file, a, b]] of Object.entries(M)) {
  if (only.length && !only.includes(k)) continue;
  const src = fs.readFileSync(LAB + '/src/app.html', 'utf8');
  const n = src.split(a).length - 1;
  if (n !== 1) { console.log('SKIP', k, 'matches', n); continue; }
  const d = S + '/pmut/' + k;
  fs.rmSync(d, { recursive: true, force: true });
  fs.mkdirSync(d + '/dist', { recursive: true });
  execSync(`cp -r ${LAB}/src ${LAB}/test ${LAB}/build.js ${d}/ && ln -s ${LAB}/assets ${d}/assets && ln -s ${LAB}/research ${d}/research`);
  fs.writeFileSync(d + '/src/app.html', src.replace(a, b));
  execSync('node build.js', { cwd: d });
  console.log('built', k);
}
