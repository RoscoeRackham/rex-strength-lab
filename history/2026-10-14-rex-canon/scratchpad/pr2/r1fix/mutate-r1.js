// Round 1 fixes: revert each behaviour fix (or apply the reviewer's surviving mutant) in a scratch copy of the engine,
// then run test/powers.js --skip-off against it: each must fail a check.
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const REPO = '/home/user/rex-strength-lab/rex-strength-lab', OUT = path.join(__dirname, 'mutants');
const src = fs.readFileSync(REPO + '/src/engine.js', 'utf8');
const oneSidedStart = src.indexOf("    if (cAin.ownRecoil && !isFinite(Fdrive) && !isFinite(fB.R)) {"), oneSidedEnd = src.indexOf("    if (!isFinite(Fdrive) && !isFinite(fA.R) && !isFinite(fB.R)) {");
const MUT = {
  // code-1: the fix reverted (no one-sided branch: the shover's own context goes through the both-bolted clash)
  'code1-revert': [[src.slice(oneSidedStart, oneSidedEnd), '']],
  // code-2 (a)-(d): the reviewer's four surviving mutants
  'code2a-unbounded-anchor': [["const bolted = ownAnchor(ctxC) === 'bolted', R0 = anchorCapacity(", "const bolted = ctxC.anchor === 'bolted', R0 = anchorCapacity("]],
  'code2b-unbounded-sink': [["if (ctxC.unbreakable) out.sinkRatioRaw = ctxC.ownRecoil ? (M + m) * K.g / (qultFor(ctxC.surface, body.footB) * 2 * body.footArea) : Infinity;", "if (ctxC.unbreakable) out.sinkRatioRaw = Infinity;"]],
  'code2c-cant-hold-it': [[" || out.result === 'wreckage' || out.result === 'cant-hold-it';", " || out.result === 'wreckage';"]],
  'code2d-wreckage': [[" || out.result === 'wreckage' || out.result === 'cant-hold-it';", " || out.result === 'cant-hold-it';"]],
};
const only = process.argv.slice(2);
for (const [name, reps] of Object.entries(MUT)) {
  if (only.length && !only.includes(name)) continue;
  let s = src;
  for (const [a, b] of reps) { const n = s.split(a).length - 1; if (n !== 1) throw new Error(name + ': match ' + n + ' for ' + a.slice(0, 80)); s = s.replace(a, b); }
  const dir = path.join(OUT, name);
  fs.mkdirSync(dir + '/src', { recursive: true }); fs.mkdirSync(dir + '/test', { recursive: true });
  fs.writeFileSync(dir + '/src/engine.js', s);
  fs.copyFileSync(REPO + '/src/data.js', dir + '/src/data.js');
  fs.copyFileSync(REPO + '/test/powers.js', dir + '/test/powers.js');
  let out;
  try { out = execFileSync('node', [dir + '/test/powers.js', '--skip-off'], { encoding: 'utf8', maxBuffer: 1 << 26 }); } catch (e) { out = (e.stdout || '') + (e.stderr || ''); }
  const fails = out.split('\n').filter((l) => /^FAIL/.test(l)), tail = out.trim().split('\n').pop();
  console.log('== ' + name + ': ' + (fails.length ? 'KILLED' : /passed/.test(tail) ? 'SURVIVED' : 'KILLED (crash)') + ' (' + tail + ')');
  for (const f of fails) console.log('   ' + f.slice(0, 260));
}
