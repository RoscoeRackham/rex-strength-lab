// The round 2 code reviewer's full mutant suite (scratchpad review-pr2-r2/code/mutants.js and mutants2.js), applied to
// this branch's engine after the round 2 fixes and run against test/powers.js --skip-off in a scratch copy.
// A mutant whose find string no longer matches (the code it targets changed) is reported as 'n/a'.
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const REPO = '/home/user/rex-strength-lab/rex-strength-lab', R2 = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r2/code/';
const src0 = fs.readFileSync(REPO + '/src/engine.js', 'utf8');
const all = require(R2 + 'mutants.js').concat(require(R2 + 'mutants2.js'));
const dir = path.join(__dirname, 'revmut');
fs.mkdirSync(dir + '/src', { recursive: true }); fs.mkdirSync(dir + '/test', { recursive: true });
fs.copyFileSync(REPO + '/src/data.js', dir + '/src/data.js');
fs.copyFileSync(REPO + '/test/powers.js', dir + '/test/powers.js');
for (const m of all) {
  let s = src0, err = null;
  for (const [f, r] of m.edits) { const n = s.split(f).length - 1; if (n !== 1) { err = 'find occurs ' + n + ' times'; break; } s = s.replace(f, () => r); }
  if (err) { console.log(m.id + ': n/a (' + err + ') | ' + m.what); continue; }
  fs.writeFileSync(dir + '/src/engine.js', s);
  const p = spawnSync('node', [dir + '/test/powers.js', '--skip-off'], { encoding: 'utf8', maxBuffer: 1 << 28 });
  const lines = (p.stdout || '').split('\n'), fails = lines.filter((l) => l.startsWith('FAIL')), tail = lines.filter((l) => /passed$/.test(l)).pop() || '';
  console.log(m.id + ': ' + (fails.length ? 'KILLED' : p.status !== 0 ? 'KILLED (crash)' : 'SURVIVED') + ' (' + tail + ') | ' + m.what);
}
