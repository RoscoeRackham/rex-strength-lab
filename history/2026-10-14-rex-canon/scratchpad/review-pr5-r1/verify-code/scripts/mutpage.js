const fs = require('fs'), { execSync } = require('child_process');
const REPO = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr5-r1/verify-code/repo/rex-strength-lab';
const F = REPO + '/src/app.html', orig = fs.readFileSync(F, 'utf8');
const M = [
  ['control: Stomp tile left out', "'none', r.vBody > 0.5 ? speedOnly(r.vBody) : ''),\n      shimmerTile(tb)));", "'none', r.vBody > 0.5 ? speedOnly(r.vBody) : '')));"],
  ['a: throw tally always all-out', "    const tb = takenBack('throw', r, Object.assign({}, c, { obj: o, angle: state.angle }));", "    const cAll = Object.assign({}, c, { use: undefined }), tb = takenBack('throw', P.throwObject(cAll, o, state.angle), Object.assign({}, cAll, { obj: o, angle: state.angle }));"],
  ['b: throw tally always 45', "    const tb = takenBack('throw', r, Object.assign({}, c, { obj: o, angle: state.angle }));", "    const tb = takenBack('throw', P.throwObject(c, o, 45), Object.assign({}, c, { obj: o, angle: 45 }));"],
  ['c: wrestle throw tally always 45', "    const tb = takenBack('wrestleThrow', t, { A: cA, B: cB, whoA: nA === 'Rex' ? 'rex' : 'ollie', angle: state.wAngle });", "    const tb = takenBack('wrestleThrow', P.throwPartner(cA, cB, 45), { A: cA, B: cB, whoA: nA === 'Rex' ? 'rex' : 'ollie', angle: 45 });"],
  ['d: backThrow cut down', "const backThrow = a.result === 'caught' && a.catch && !a.catch.carried && !a.bursts && !(a.recoil && a.recoil.outOfRange);", "const backThrow = a.result === 'caught' && a.catch;"],
  ['e: floor note removed', "+ (gl.word === 'too faint to see' ? ' The lab draws no glow below ' + floorRef.short + ' (' + fmtSI(floorRef.J, 'J') + '), its floor: a proposal, not canon.' : '')", "+ ''"],
  ['f: glow drawn linearly', "s = gl.none ? 0 : gl.strength, a = Math.sqrt(s);", "s = gl.none ? 0 : gl.strength, a = s;"],
];
const only = process.argv[2] ? process.argv[2].split(',') : null;
for (const [name, from, to] of M) {
  if (only && !only.includes(name[0])) continue;
  const n = orig.split(from).length - 1;
  if (n !== 1) { console.log(name, ': pattern found', n, 'times; skipped'); continue; }
  fs.writeFileSync(F, orig.replace(from, to));
  let res;
  try {
    execSync('node build.js', { cwd: REPO, stdio: 'pipe' });
    const out = execSync('node test/shots.js --pr5 2>&1; echo EXIT=$?', { cwd: REPO, encoding: 'utf8', maxBuffer: 1 << 26, shell: '/bin/bash' });
    const pl = out.split('\n').filter((l) => /^PROBLEM/.test(l)).join(' ');
    const failed = [...new Set((pl.match(/pr5 \[[\w-]+\]/g) || []))];
    res = (failed.length ? 'FAILS: ' + failed.join(', ') : (/^ok   pull request 5/m.test(out) ? 'PASSES all 13 (mutant survives)' : 'no ok line')) + ' ' + (out.match(/EXIT=\d+/) || [''])[0] + (pl && !failed.length ? ' | ' + pl.slice(0, 300) : '');
  } catch (e) { res = 'ERROR ' + e.message.slice(0, 300); }
  console.log('== ' + name + '\n   ' + res);
  fs.writeFileSync(F, orig);
}
execSync('node build.js', { cwd: REPO, stdio: 'pipe' });
console.log('restored; git status:', execSync('git status --short', { cwd: REPO, encoding: 'utf8' }).trim() || 'clean');
