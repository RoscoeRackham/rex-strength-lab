// Page reverts for review round 3's re-check of pull request 2: copy the repo's page sources into a scratch dir, apply
// one change (to app.html, engine.js or static-data.js, then build-data.py for data.js), build, and run the shots.js
// review blocks of rounds 2 and 3 on it (runblock.js), PAR at a time (default 2). Usage: node pagemut-rc.js [name ...]
// Groups: rc1-* to rc4-*, the re-check's fixes reverted; r3-* and r2-*, round 3's page reverts (pr2/r3fix/pagemut3.js)
// adapted to today's text; 'pages': the round 3 block on def9546's and 54fadb8's whole pages.
const fs = require('fs'), path = require('path'), { execFileSync, execFile } = require('child_process');
const REPO = '/home/user/rex-strength-lab/rex-strength-lab', OUT = path.join(__dirname, 'pagemut');
const R = (a, b) => [a, b];
const L = "P.MUSCLE.jump.forceFrac";
const MUT = {
  // ---- fixes-pull-legs-vs-sprint: each part reverted to round 3's 1.4x (def9546)
  'rc1-engine': ['engine.js', [R("aFeet = Math.min(anc.R, usable) / body.m;", "aFeet = Math.min(anc.R, LEG_SHARE() * usable) / body.m;")]],
  'rc1-item': ['app.html', [R("His legs still move his own body, with at most the strength he uses (' + legsFig + '), as in a bolted sprint'", "His legs still move his own body, with at most 1.4× the strength he uses (' + fmtSI(" + L + " * legsR, 'N') + ')'")]],
  'rc1-steps': ['app.html', [R("(legsSet ? ' (his legs cap it: at most the strength he uses, ' + legsFig", "(legsSet ? ' (his legs cap it: at most 1.4× the strength he uses, ' + fmtSI(" + L + " * legsR, 'N')")]],
  'rc1-walk': ['app.html', [R("and his legs’ push (at most the strength he uses, ' + legsFig + ', as in a sprint), so they can speed it up by at most ' + sig(Math.min(r.anchor.R, legsR) / c.body.m, 2)", "and his legs’ push (' + fmtSI(" + L + " * legsR, 'N') + ', at most 1.4× the strength he uses), so they can speed it up by at most ' + sig(Math.min(r.anchor.R, " + L + " * legsR) / c.body.m, 2)")]],
  'rc1-math-bolted': ['app.html', [R("legs’ push = the strength he uses = ' + fmtSI(legsR, 'N') + ' (the Sprint tab’s bolted push-off);", "legs’ push = 1.4 × the strength he uses = ' + fmtSI(" + L + " * legsR, 'N') + ';")]],
  'rc1-math-friction': ['app.html', [R("and his legs’ push, the strength he uses = ' + fmtSI(legsR, 'N') + ' (the Sprint tab’s push-off);", "and his legs’ push, 1.4 × the strength he uses = ' + fmtSI(" + L + " * legsR, 'N') + ';")]],
  'rc1-why': ['app.html', [R("'Bolted, his legs cap it: they push his own body with at most the strength he uses (' + legsAbout + ', as in a bolted sprint), so only", "'Bolted, his legs cap it: they push his own body with at most 1.4× the strength he uses (about ' + fmtSI(" + L + " * legs, 'N') + ' here), so only")]],
  'rc1-hazard': ['app.html', [R("(the move itself: his legs push his own body with at most the strength he uses'", "(the move itself: his legs push his own body with at most 1.4× the strength he uses'")]],
  'rc1-card': ['static-data.js', [R("his legs push his own body with at most the strength he uses, as in a sprint, and on friction his grip caps them too", "his legs push his own body with at most 1.4× the strength he uses, and on friction his grip caps them too")]],
  'rc1-sprint-note': ['app.html', [R("if (sp.vTop > 0 && r.vEnd > sp.vTop) items.push(", "if (false) items.push(")]],
  // ---- fixes-unlimited-bolted-steps-say-grip: legsSet keyed on the numbers again; '∞ N' in the sentences
  'rc2-legsSet': ['app.html', [R("legsSet = !!r.ownRecoil && (state.anchor === 'bolted' || legsR < r.anchor.R)", "legsSet = !!r.ownRecoil && legsR < r.anchor.R")]],
  'rc2-legsFig': ['app.html', [R("legsFig = isFinite(legsR) ? fmtSI(legsR, 'N') : 'unbounded at unlimited strength';", "legsFig = fmtSI(legsR, 'N');")]],
  'rc2-couldFig': ['app.html', [R("const couldFig = isFinite(r.usable) ? ' of the ' + fmtSI(r.usable, 'N') + ' he could' : ' of his unbounded strength';", "const couldFig = ' of the ' + fmtSI(r.usable, 'N') + ' he could';")]],
  // ---- fixes-friction-math-line-unchecked: 54fadb8's friction math line
  'rc3-math-54fadb8': ['app.html', [R("'They take their own recoil: acceleration = the smaller of (the strength he uses − resistance) ÷ load mass and his feet’s push ÷ his mass; his feet push with the smaller of his footing, μ × his weight = ' + fmtSI(a.R, 'N') + ', and his legs’ push, the strength he uses = ' + fmtSI(legsR, 'N') + ' (the Sprint tab’s push-off); the rope pulls as hard as keeps the load at that pace;", "'They take their own recoil: pull = the strength he uses; acceleration = min((pull − resistance) ÷ load mass, footing ÷ his mass), footing = μ × his weight = ' + fmtSI(a.R, 'N') + ';")]],
  // ---- fixes-friction-walk-sentence-unchecked: 54fadb8's friction walk sentence
  'rc4-walk-54fadb8': ['app.html', [R("' He still walks with it: his feet move his own body with at most the smaller of his footing (' + fmtSI(r.anchor.R, 'N') + '; walking runs on friction) and his legs’ push (at most the strength he uses, ' + legsFig + ', as in a sprint), so they can speed it up by at most ' + sig(Math.min(r.anchor.R, legsR) / c.body.m, 2) + ' m/s².'", "' He still walks with it, and walking runs on friction: his footing (' + fmtSI(r.anchor.R, 'N') + ') can speed his own body up by at most ' + sig(r.anchor.R / c.body.m, 2) + ' m/s².'")]],
  // ---- round 3's page reverts (pr2/r3fix/pagemut3.js), adapted to today's text: each part back to round 2's (54fadb8)
  'r3-legs-engine': ['engine.js', [R("aFeet = Math.min(anc.R, usable) / body.m;", "aFeet = anc.R / body.m;")]],
  'r3-legs-item': ['app.html', [R("'Bolted, his feet can’t slide, so grip doesn’t limit his pull. His legs still move his own body, with at most the strength he uses (' + legsFig + '), as in a bolted sprint' + (r.footLimited ? ', so his own body sets the pace: he pulls with ' + fmtSI(r.ropeT, 'N') + couldFig + ', as hard as keeps the load at his pace. ' : '; here they keep up, so he pulls with all of the strength he uses and the load sets the pace. ')", "'Bolted, his feet can’t slide, so grip limits neither his pull nor his own steps: he pulls with all of the strength he uses, and the load alone sets the pace (his bolted feet keep his own body with it). '")]],
  'r3-legs-steps': ['app.html', [R("(legsSet ? ' (his legs cap it: at most the strength he uses, ' + legsFig + (state.anchor === 'bolted' ? '' : ', less than his footing, ' + fmtSI(r.anchor.R, 'N')) + ').' : ' (his grip caps it:", "(state.anchor === 'bolted' ? ' (bolted, nothing caps it: the quicker the pull, the harder his feet push).' : ' (his grip caps it:")]],
  'r3-legs-why': ['app.html', [R("'Bolted, his legs cap it: they push his own body with at most the strength he uses (' + legsAbout + ', as in a bolted sprint), so only a strong, quick pull shakes the ground.'", "'Bolted, nothing caps it, so a quick, hard pull shakes the ground.'")]],
  'r3-legs-math': ['app.html', [R("'. They take their own recoil: the rope’s pull back goes to the endless ocean; acceleration = the smaller of (the strength he uses − resistance) ÷ load mass and his legs’ push ÷ his mass, legs’ push = the strength he uses = ' + fmtSI(legsR, 'N') + ' (the Sprint tab’s bolted push-off);", "'. They take their own recoil: the rope’s pull back goes to the endless ocean, so pull = the strength he uses; acceleration = (pull − resistance) ÷ load mass (his bolted feet keep his own body at that pace);")]],
  'r3-legs-status': ['app.html', [R("r.ownRecoil && r.footLimited && r.canMove ? status('warn', legsSet ? 'His legs set the pace' : 'His own footing sets the pace') : null,", "ownPull && r.footLimited && r.canMove ? status('warn', 'His own footing sets the pace') : null,")]],
  'r3-legs-card': ['static-data.js', [R("his legs push his own body with at most the strength he uses, as in a sprint, and on friction his grip caps them too, so it stays small; bolted, only his legs cap them, so only a strong, quick pull shakes the ground)", "on friction his grip caps them, so it stays small; bolted, nothing does, and a quick, hard pull shakes the ground)")]],
  'r3-allReach': ['app.html', [R("out.allReach = thrownLegs.length > 0 && thrownLegs.every((L) => CAUGHT.includes(L.result));", "out.allReach = legs.some(Boolean) && legs.every((L) => !L || CAUGHT.includes(L.result));")]],
  'r3-code1': ['app.html', [R("if (eff.real && factsTop('real').models.ground) read.append(", "if (eff.real && eff.p.factsAt(eff.p.hi, 'real').models.ground) read.append(")]],
  'r3-vh-hazard': ['app.html', [R("': not counted with They take their own recoil off.'", "': not counted with They take their own recoil off (as before the power existed).'")]],
  'r3-vh-box': ['app.html', [R("With They take their own recoil off the lab doesn’t count a pull’s ground shaking, so a quick", "With They take their own recoil off the lab doesn’t count a pull’s ground shaking (as before the power existed), so a quick")]],
  'r3-vh-card': ['static-data.js', [R("With it off the lab counts no pull’s shaking: his footing", "With it off the lab counts no pull’s shaking, as before the power existed: his footing")]],
  'r3-card-quick': ['static-data.js', [R("which all-out can be quick (0.31 s for a car at the page’s default dial; about 2 s for a locomotive, and longer at a low dial)", "which all-out takes a fraction of a second")]],
  // ---- round 2's fixes that round 3 found unchecked (code-2), reverted on today's page
  'r2-m1-caught': ['app.html', [R("        out.caught = !!t.catch;\n", "")]],
  'r2-m2-friction-steps': ['app.html', [R("' (his grip caps it: his footing, ' + fmtSI(r.anchor.R, 'N') + ', is the most his steps can push with).'", "' (bolted, nothing caps it: the quicker the pull, the harder his feet push).'")]],
  'r2-m3-why-grip': ['app.html', [R("+ (state.anchor === 'bolted' ? 'Bolted, his legs cap it:", "+ (false ? 'Bolted, his legs cap it:")]],
  'r2-m4-card': ['static-data.js', [R(/\. A pull’s counts only with They take their own recoil on[^]*?more than it says\./, ", or a pull (with They take their own recoil on, the rope’s pull back goes to the endless ocean, so nothing of it reaches the ground; with it off, his footing takes it as a steady load over seconds, or his bolts do over the pull, which all-out takes a fraction of a second; the lab counts neither, so a quick bolted pull may shake the ground more than it says).")]],
  'r2-m5a-hazard-off': ['app.html', [R("move === 'pull' ? ': not counted with They take their own recoil off.' : ': not modelled for this move.'", "': not modelled for this move.'")]],
  'r2-m5b-hazard-on': ['app.html', [R("      else if (move === 'pull') items.push(", "      else if (false) items.push(")]],
};
const only = process.argv.slice(2), jobs = [];
for (const [name, [file, reps]] of Object.entries(MUT)) {
  if (only.length && !only.some((o) => name.startsWith(o))) continue;
  const dir = path.join(OUT, name);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir + '/src', { recursive: true }); fs.mkdirSync(dir + '/research', { recursive: true });
  for (const f of ['app.html', 'engine.js', 'ladder.js', 'data.js', 'static-data.js']) fs.copyFileSync(REPO + '/src/' + f, dir + '/src/' + f);
  for (const f of fs.readdirSync(REPO + '/research')) if (/^final-.*\.json$/.test(f)) fs.copyFileSync(REPO + '/research/' + f, dir + '/research/' + f);
  fs.symlinkSync(REPO + '/assets', dir + '/assets');
  fs.copyFileSync(REPO + '/build.js', dir + '/build.js'); fs.copyFileSync(REPO + '/build-data.py', dir + '/build-data.py');
  let s = fs.readFileSync(dir + '/src/' + file, 'utf8');
  for (const [a, b] of reps) { const n = typeof a === 'string' ? s.split(a).length - 1 : (s.match(new RegExp(a.source, 'g')) || []).length; if (n !== 1) throw new Error(name + ': match ' + n + ' for ' + String(a).slice(0, 80)); s = s.replace(a, b); }
  fs.writeFileSync(dir + '/src/' + file, s);
  if (process.env.DRY) { console.log('match ok: ' + name); continue; }
  if (file === 'static-data.js') execFileSync('python3', [dir + '/build-data.py'], { cwd: dir });
  execFileSync('node', [dir + '/build.js'], { cwd: dir });
  for (const RD of ['2', '3']) jobs.push({ name, RD, html: dir + '/dist/index.html' });
}
// whole pages: round 3's (def9546) and round 2's (54fadb8)
if (!only.length || only.includes('pages')) for (const [name, html] of [['page-def9546', path.join(__dirname, 'dist-def9546.html')], ['page-54fadb8', path.join(__dirname, '../r3fix/dist-54fadb8.html')]]) jobs.push({ name, RD: '3', html });
const results = {}; let next = 0;
const runOne = () => new Promise((res) => {
  if (next >= jobs.length) return res();
  const j = jobs[next++];
  execFile('node', [path.join(__dirname, 'runblock.js'), j.html, REPO + '/test/shots.js'], { encoding: 'utf8', env: Object.assign({}, process.env, { ROUND: j.RD }), maxBuffer: 1 << 26 }, (e, so, se) => {
    const out = (so || '') + (se || ''), probs = out.split('\n').filter((l) => /^PROBLEM/.test(l));
    results[j.name + '/' + j.RD] = '== ' + j.name + ' (round ' + j.RD + ' block): ' + (probs.length ? 'CAUGHT' : /no problems/.test(out) ? 'passes' : 'ERROR ' + out.slice(-300)) + '\n' + probs.map((p) => '   ' + p.split(' ;; ').map((x) => x.slice(0, 240)).join('\n   ;; ')).join('\n');
    res(runOne());
  });
});
Promise.all(Array.from({ length: Number(process.env.PAR || 2) }, runOne)).then(() => { for (const j of jobs) console.log(results[j.name + '/' + j.RD].trimEnd()); });
