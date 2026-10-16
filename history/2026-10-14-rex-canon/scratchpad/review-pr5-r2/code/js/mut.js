// mutation runner: node mut.js <mutants.json> [outfile]
// each mutant: { id, subs: [{ file (relative to rex-strength-lab), find, replace }] or file/find/replace, cmd (shell, run in rex-strength-lab), build (bool) }
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const ROOT = process.env.MUTROOT || path.join(__dirname, '..', 'mut', 'rex-strength-lab');
const list = require(path.resolve(process.argv[2]));
const out = [];
const orig = {};
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const only = process.argv[4] ? process.argv[4].split(',') : null;
for (const m of list) {
  if (only && !only.includes(m.id)) continue;
  const subs = m.subs || [{ file: m.file, find: m.find, replace: m.replace }];
  const touched = [...new Set(subs.map((s) => s.file))];
  for (const f of touched) if (!(f in orig)) orig[f] = read(f);
  let okApply = true;
  const cur = {};
  for (const f of touched) cur[f] = orig[f];
  for (const s of subs) {
    const n = cur[s.file].split(s.find).length - 1;
    if (n !== 1) { okApply = false; out.push({ id: m.id, error: 'find occurs ' + n + ' times in ' + s.file + ': ' + s.find.slice(0, 80) }); console.log(m.id, 'APPLY ERROR: find occurs ' + n + ' times: ' + s.find.slice(0, 100)); break; }
    cur[s.file] = cur[s.file].replace(s.find, () => s.replace);
  }
  if (!okApply) continue;
  for (const f of touched) fs.writeFileSync(path.join(ROOT, f), cur[f]);
  let buildOk = true;
  if (m.build) { const b = spawnSync('sh', ['-c', 'python3 build-data.py >/dev/null && node build.js >/dev/null'], { cwd: ROOT, encoding: 'utf8' }); buildOk = b.status === 0; }
  const t0 = Date.now();
  const r = spawnSync('sh', ['-c', m.cmd], { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 28, timeout: 1200000 });
  const txt = (r.stdout || '') + (r.stderr || '');
  const fails = txt.split('\n').filter((l) => /^(FAIL|PROBLEM)/.test(l)).map((l) => l.slice(0, 260));
  const res = { id: m.id, status: r.status, failed: r.status !== 0, buildOk, nFail: fails.length, fails: fails.slice(0, 10), secs: Math.round((Date.now() - t0) / 1000), tail: txt.split('\n').filter(Boolean).slice(-2).join(' | ').slice(0, 300) };
  out.push(res);
  console.log(m.id, res.failed ? 'FAILS (caught)' : 'PASSES (survives)', 'status ' + r.status, res.nFail, res.secs + 's', res.fails.slice(0, 4).map((x) => x.slice(0, 160)).join(' || '));
  for (const f of touched) fs.writeFileSync(path.join(ROOT, f), orig[f]);
  if (m.build) spawnSync('sh', ['-c', 'python3 build-data.py >/dev/null && node build.js >/dev/null'], { cwd: ROOT });
}
if (process.argv[3]) fs.writeFileSync(process.argv[3], JSON.stringify(out, null, 1));
