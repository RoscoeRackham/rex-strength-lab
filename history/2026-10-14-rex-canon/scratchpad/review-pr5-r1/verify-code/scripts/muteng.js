const fs = require('fs'), { execSync } = require('child_process');
const REPO = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr5-r1/verify-code/repo2/rex-strength-lab';
const F = REPO + '/src/engine.js', orig = fs.readFileSync(F, 'utf8');
const M = [
  ['C1 control: throw angle fixed 45', "add(whoA, 'drag', tbDrag(s * realAirThrow(r, ob, A.angle || 0, body), arrive));", "add(whoA, 'drag', tbDrag(s * realAirThrow(r, ob, 45, body), arrive));"],
  ['C2 control: dragE x 1.01 in realAirLeg', "      return f0.relativistic || f0.escaped || f0.orbit || f0.timedOut ? keFromV(vE, obj.m) : f0.dragE;", "      return f0.relativistic || f0.escaped || f0.orbit || f0.timedOut ? keFromV(vE, obj.m) : 1.01 * f0.dragE;"],
  ['01 wrestle drag always 45', "if (s > 0) add(whoA, 'drag', tbDrag(s * realAirThrow(rr, t.obj, opt.angle || 0, A.body), arrive));", "if (s > 0) add(whoA, 'drag', tbDrag(s * realAirThrow(rr, t.obj, 45, A.body), arrive));"],
  ['02 falls-back gate removed', "if (!r || !r.canMove || !r.flight || r.fallsBack || !(r.v > 0)) return 0;", "if (!r || !r.canMove || !r.flight || !(r.v > 0)) return 0;"],
  ['03 well-dominated leg drag 0', "return run.reached ? run.Edrag : keFromV(L.aim.vL, obj.m); }", "return 0; }"],
  ['04 overshoot past 1% c -> 0', "if (L.relativistic || L.vL >= CATCHGAME.CATCH.V_FIREBALL) return keFromV(L.vL, obj.m);", "if (L.relativistic || L.vL >= CATCHGAME.CATCH.V_FIREBALL) return 0;"],
  ['05 slams/cant-hold-it not a catch', "const reaches = ['caught', 'slams', 'wreckage', 'cant-hold-it'].includes(L.result);", "const reaches = ['caught', 'wreckage'].includes(L.result);"],
  ['06 toss slams dropped', "(t.result === 'caught' || t.result === 'slams') ? add(whoA, 'catch', k.Ecatch)", "(t.result === 'caught') ? add(whoA, 'catch', k.Ecatch)"],
  ['07 missed leaver counted as landing', "if (person && T.safePassenger && !L.miss.leaves) arrive", "if (person && T.safePassenger) arrive"],
  ['08 toss never-lands -> 0', "return f0.landed && !f0.escaped && !f0.orbit && !f0.timedOut ? Math.max(0, Ev - keFromV(f0.vImpact, obj.m)) : Ev;", "return f0.landed && !f0.escaped && !f0.orbit && !f0.timedOut ? Math.max(0, Ev - keFromV(f0.vImpact, obj.m)) : 0;"],
  ['09 ground hit own without kept', "own = !(hg.airK > 0) ? hg.E : hg.kept && hg.own ? hg.own.E : 0;", "own = !(hg.airK > 0) ? hg.E : hg.own ? hg.own.E : 0;"],
  ['10 fullStrength lob flown as lob', "const hard = L.style === 'hard' || !!L.fullStrength;", "const hard = L.style === 'hard';"],
  ['11 wrestle landing !relativistic removed', "B.unbreakable && f.landed && !f.relativistic && rr.crater > 0", "B.unbreakable && f.landed && rr.crater > 0"],
];
for (const [name, from, to] of M) {
  const n = orig.split(from).length - 1;
  if (n !== 1) { console.log(name, ': pattern found', n, 'times; skipped'); continue; }
  fs.writeFileSync(F, orig.replace(from, to));
  let out;
  try { out = execSync('node test/powers.js --skip-off --tally-only 2>&1; echo EXIT=$?', { cwd: REPO, encoding: 'utf8', maxBuffer: 1 << 26, shell: '/bin/bash' }); } catch (e) { out = 'ERR ' + e.message; }
  const fails = out.split('\n').filter((l) => /^(FAIL|not ok|PROBLEM|✗)/i.test(l)).map((l) => l.slice(0, 90));
  console.log('== ' + name + ': ' + ((out.match(/\d+\/\d+ passed/) || ['?'])[0]) + ' ' + (out.match(/EXIT=\d+/) || [''])[0] + (fails.length ? '\n   ' + fails.join('\n   ') : ''));
  fs.writeFileSync(F, orig);
}
console.log('restored:', execSync('git status --short', { cwd: REPO, encoding: 'utf8' }).trim() || 'clean');
