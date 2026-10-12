// node mut.js : each mutant in its own copy of src/test/research; runs node test/presence.js
const fs = require('fs'), path = require('path'), { execSync, spawnSync } = require('child_process');
const SRC = '/home/user/rex-strength-lab/rex-strength-lab';
const OUT = path.join(__dirname, 'mut'); fs.mkdirSync(OUT, { recursive: true });
const MUTS = {
  M02_stomp_no_min: ['Math.min(r.vFoot, stampSpeed(o.body))', 'r.vFoot'],
  M03_plaster_always_low: ['const plasterLimit = (x) => (pulseHz(x) > VIB.PLASTER_F ? VIB.plasterHigh : VIB.TH.plaster);', 'const plasterLimit = (x) => VIB.TH.plaster;'],
  M04_sand_mean_p: ['Math.pow(Math.max(p, pPeak) / PRINT.p', 'Math.pow(p / PRINT.p'],
  M05_throw_boom_no_recoil: ['boomSpeed: (r) => (r.canMove ? Math.max(r.v, r.recoilV || 0) : 0),', 'boomSpeed: (r) => (r.canMove ? r.v : 0),'],
  M18_stomp_soil_removed: ['ground: (r, o) => r.crater > 0 || (!SOIL.has(o.surface && o.surface.id) && r.holeDepth >= 0.01),', 'ground: (r, o) => r.crater > 0 || r.holeDepth >= 0.01,'],
  N01_air_at_RNEAR: ["{ id: 'air', test: (m, r, o) => !!m.blast && blastRadius(m.blast(r, o), R.DP_HARM) >= o.near },", "{ id: 'air', test: (m, r, o) => !!m.blast && blastRadius(m.blast(r, o), R.DP_HARM) >= R.NEAR },"],
  N02_plaster_haz_at_RNEAR: ["      { id: 'plaster', test: (m, r, o) => !!m.shake && plasterOver(m.shake(r, o), o.near) },\n      { id: 'ground'", "      { id: 'plaster', test: (m, r, o) => !!m.shake && plasterOver(m.shake(r, o), R.NEAR) },\n      { id: 'ground'"],
  N05_reltv_throw_no_blast: ['r.flight.relativistic ? r.Eobj :', 'r.flight.relativistic ? 0 :'],
  N04_firmsand: ['firmsand: { rho: 1800, cs: 280, xi: 0.03 },', 'firmsand: { rho: 1600, cs: 120, xi: 0.04 },'],
  N03_rattle_feel: ['ppvAt(m.shake(r, o), o.near) >= VIB.TH.rattle)', 'ppvAt(m.shake(r, o), o.near) >= VIB.TH.feel)'],
  M09_windows_near: ['blastRadius(m.blast(r, o), R.DP_WINDOWS) >= R.STREET', 'blastRadius(m.blast(r, o), R.DP_WINDOWS) >= o.near'],
  N07_stepRate_neg: ['const stepRate = WALK.CADENCE[0]', 'const stepRate = -WALK.CADENCE[0]'],
};
const only = process.argv.slice(2);
for (const [id, [a, b]] of Object.entries(MUTS)) {
  if (only.length && !only.includes(id)) continue;
  const dir = path.join(OUT, id);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  execSync(`cp -r ${SRC}/src ${SRC}/test ${SRC}/research ${dir}/`);
  const f = path.join(dir, 'src/engine.js');
  const s = fs.readFileSync(f, 'utf8');
  const cnt = s.split(a).length - 1;
  if (cnt !== 1) { console.log(id, 'PATTERN COUNT', cnt); continue; }
  fs.writeFileSync(f, s.replace(a, b));
  const r = spawnSync('node', ['test/presence.js'], { cwd: dir, encoding: 'utf8', maxBuffer: 1e8 });
  const last = (r.stdout || '').trim().split('\n').pop();
  const fl = (r.stdout || '').split('\n').filter((l) => l.startsWith('FAIL')).slice(0, 3);
  console.log(id, 'exit', r.status, '|', last, fl.length ? '\n   ' + fl.join('\n   ') : '', r.stderr ? '\n   STDERR ' + r.stderr.slice(0, 300) : '');
}
