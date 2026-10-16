// node run-mutants.js [ids...]: applies each engine mutant to mut/src/engine.js and runs mut/test/powers.js --skip-off
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const base = __dirname, ENG = path.join(base, 'mut/src/engine.js'), PRISTINE = path.join(base, 'repo/rex-strength-lab/src/engine.js');
const src0 = fs.readFileSync(PRISTINE, 'utf8');
const all = require(process.env.MUTS || './mutants.js');
const want = process.argv.slice(2);
const list = want.length ? all.filter((m) => want.includes(m.id)) : all;
const out = path.join(base, 'mutant-results.jsonl');
for (const m of list) {
  let s = src0, err = null;
  for (const [f, r] of m.edits) {
    const n = s.split(f).length - 1;
    if (n !== 1) { err = 'find occurs ' + n + ' times: ' + f.slice(0, 80); break; }
    s = s.replace(f, () => r);
  }
  if (err) { fs.appendFileSync(out, JSON.stringify({ id: m.id, err }) + '\n'); console.log(m.id, 'ERR', err); continue; }
  fs.writeFileSync(ENG, s);
  const t0 = Date.now();
  const p = spawnSync('node', [path.join(base, 'mut/test/powers.js'), '--skip-off'], { encoding: 'utf8', maxBuffer: 1 << 28 });
  const lines = (p.stdout || '').split('\n');
  const fails = lines.filter((l) => l.startsWith('FAIL')).map((l) => l.slice(0, 160));
  const tail = lines.filter((l) => /passed$/.test(l)).pop() || '';
  const crash = p.status !== 0 && !fails.length ? (p.stderr || '').split('\n').slice(0, 4).join(' | ') : null;
  const rec = { id: m.id, what: m.what, status: p.status, tail, nfail: fails.length, fails, crash, s: (Date.now() - t0) / 1000 };
  fs.appendFileSync(out, JSON.stringify(rec) + '\n');
  console.log(m.id, tail, fails.length ? 'KILLED' : crash ? 'CRASH' : 'SURVIVED', crash || '');
}
fs.writeFileSync(ENG, src0);
