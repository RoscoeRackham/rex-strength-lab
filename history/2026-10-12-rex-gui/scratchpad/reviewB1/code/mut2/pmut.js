const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const LAB = path.join(__dirname, 'lab'), APP = path.join(LAB, 'src', 'app.html');
const orig = fs.readFileSync(APP, 'utf8');
const M = {
  'P1-preset-moves-slider': ["sel.onchange = (e) => { if (e.target.value === 'custom') { const c1 = ctx(), u = resolveEffort(move, c1).use;", "sel.onchange = (e) => { if (AIR_PRESETS.has(e.target.value)) state.airAbsorb = 0; if (e.target.value === 'custom') { const c1 = ctx(), u = resolveEffort(move, c1).use;"],
  'P2-no-hint': ["hint = 'At ' + pctAir(airShareOf(c)) + ' air resistance absorbed", "hint = null && 'At ' + pctAir(airShareOf(c)) + ' air resistance absorbed"],
  'P3-hint-always': ["else if (!p0.result('preset:' + e).never) {", "else if (true) {"],
  'P4-tab-not-real': ["const cE = eff && eff.real ? Object.assign({}, c0, { unbreakable: false }) : c0;", "const cE = c0;"],
  'P5-migration-keeps-old': ["airAbsorb: num(0, 1), keepForm:", "groundHolds: (v) => typeof v === 'boolean', airAbsorb: num(0, 1), keepForm:"],
  'P6-collide-no-shake': ["out.shake = [srcOf(cB, r.toGround)].filter(Boolean);\n      out.blast = thump ? 0 : Q;", "out.shake = [];\n      out.blast = thump ? 0 : Q;"],
  'P7-arm-no-shake': ["out.shake = [srcOf(cR, r.toGround)].filter(Boolean);\n      out.ground = r.crater > 0;", "out.shake = [];\n      out.ground = r.crater > 0;"],
  'P8-catch-no-shake': ["out.shake.push(srcOf(cR, L.toGroundT), srcOf(cR, L.toGroundC));", "out.shake.push(null);"],
  'P9-stepSide-noop': ["function stepSide(p0, name) {\n    if (sideOn === p0) return;", "function stepSide(p0, name) {\n    return;"],
  'P10-wrestle-throw-shake-off': ["const sh = M.shake(t.r, mo);", "const sh = M.landShake(t.r, mo);"],
  'P11-shove-no-shake': ["out.shake = [srcOf(cR, r.toGround)].filter(Boolean);\n        const slid", "out.shake = [];\n        const slid"],
  'P12-duo-real-variant-ignored': ["const duoVariant = (e) => (e === 'ground' && state.unbreakable ? 'real' : '');", "const duoVariant = (e) => '';"],
};
const only = process.argv[2];
for (const [name, [a, b]] of Object.entries(M)) {
  if (only && name !== only) continue;
  const n = orig.split(a).length - 1;
  if (n !== 1) { console.log(name, 'PATTERN x' + n); continue; }
  fs.writeFileSync(APP, orig.replace(a, b));
  let out = '';
  try { execSync('node build.js', { cwd: LAB, stdio: 'ignore' }); out = execSync('node test/shots5.js', { cwd: LAB, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 600000 }); } catch (e) { out = (e.stdout || '') + (e.stderr || ''); }
  const fails = out.split('\n').filter((l) => /^PROBLEM|Error/.test(l));
  console.log(name + ': ' + (fails.length ? 'CAUGHT by ' + fails.length + ' (' + fails[0].slice(0, 160) + ')' : 'NOT CAUGHT'));
}
fs.writeFileSync(APP, orig);
execSync('node build.js', { cwd: LAB, stdio: 'ignore' });
