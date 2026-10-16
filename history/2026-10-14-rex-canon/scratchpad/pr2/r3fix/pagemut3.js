// Page reverts for review round 3 of pull request 2: copy the repo's page sources into a scratch dir, apply one change
// (to app.html, engine.js or data.js: static-data.js changes are applied to data.js directly), build, and run the given
// shots.js review blocks (round 2 and/or 3) on it. Usage: node pagemut3.js [name ...]
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const REPO = '/home/user/rex-strength-lab/rex-strength-lab', OUT = path.join(__dirname, 'pagemut');
const R = (a, b) => [a, b];
const MUT = {
  // ---- round 3's fixes reverted, one part at a time
  // physics-bolted-pull-legs-unbounded: the engine's leg cap
  'r3-legs-engine': ['engine.js', ['3'], [R("aFeet = Math.min(anc.R, LEG_SHARE() * usable) / body.m;", "aFeet = anc.R / body.m;")]],
  // ... the Pull item's bolted sentence
  'r3-legs-item': ['app.html', ['3'], [R("'Bolted, his feet can’t slide, so grip doesn’t limit his pull. His legs still move his own body, with at most ' + legX + ' the strength he uses (' + fmtSI(legsR, 'N') + ')' + (r.footLimited ? ', so his own body sets the pace: he pulls with ' + fmtSI(r.ropeT, 'N') + ' of the ' + fmtSI(r.usable, 'N') + ' he could, as hard as keeps the load at his pace. ' : '; here they keep up, so he pulls with all of the strength he uses and the load sets the pace. ')", "'Bolted, his feet can’t slide, so grip limits neither his pull nor his own steps: he pulls with all of the strength he uses, and the load alone sets the pace (his bolted feet keep his own body with it). '")]],
  // ... the steps' cap in the Pull item
  'r3-legs-steps': ['app.html', ['3'], [R("(legsSet ? ' (his legs cap it: at most ' + legX + ' the strength he uses, ' + fmtSI(legsR, 'N') + (state.anchor === 'bolted' ? '' : ', less than his footing, ' + fmtSI(r.anchor.R, 'N')) + ').' : ' (his grip caps it:", "(state.anchor === 'bolted' ? ' (bolted, nothing caps it: the quicker the pull, the harder his feet push).' : ' (his grip caps it:")]],
  // ... the effort box's reason (pullOnWhy), bolted
  'r3-legs-why': ['app.html', ['2', '3'], [R("'Bolted, his legs cap it: they push his own body with at most ' + legX + ' the strength he uses (about ' + fmtSI(legs, 'N') + ' here), so only a strong, quick pull shakes the ground.'", "'Bolted, nothing caps it, so a quick, hard pull shakes the ground.'")]],
  // ... the math line, bolted
  'r3-legs-math': ['app.html', ['3'], [R("'. They take their own recoil: the rope’s pull back goes to the endless ocean; acceleration = the smaller of (the strength he uses − resistance) ÷ load mass and his legs’ push ÷ his mass, legs’ push = ' + sig(LEG, 2) + ' × the strength he uses = ' + fmtSI(legsR, 'N') + ';", "'. They take their own recoil: the rope’s pull back goes to the endless ocean, so pull = the strength he uses; acceleration = (pull − resistance) ÷ load mass (his bolted feet keep his own body at that pace);")]],
  // ... the status (only off Bolted, and only his footing)
  'r3-legs-status': ['app.html', ['3'], [R("r.ownRecoil && r.footLimited && r.canMove ? status('warn', legsSet ? 'His legs set the pace' : 'His own footing sets the pace') : null,", "ownPull && r.footLimited && r.canMove ? status('warn', 'His own footing sets the pace') : null,")]],
  // ... the card
  'r3-legs-card': ['data.js', ['3'], [R("his legs push his own body with at most 1.4× the strength he uses, and on friction his grip caps them too, so it stays small; bolted, only his legs cap them, so only a strong, quick pull shakes the ground)", "on friction his grip caps them, so it stays small; bolted, nothing does, and a quick, hard pull shakes the ground)")]],
  // physics-catch-allreach-unthrown-leg
  'r3-allReach': ['app.html', ['3'], [R("out.allReach = thrownLegs.length > 0 && thrownLegs.every((L) => CAUGHT.includes(L.result));", "out.allReach = legs.some(Boolean) && legs.every((L) => !L || CAUGHT.includes(L.result));")]],
  // code-1
  'r3-code1': ['app.html', ['3'], [R("if (eff.real && factsTop('real').models.ground) read.append(", "if (eff.real && eff.p.factsAt(eff.p.hi, 'real').models.ground) read.append(")]],
  // copy-pull-version-history-phrase: the hazard line, the bolted box, the card
  'r3-vh-hazard': ['app.html', ['3'], [R("': not counted with They take their own recoil off.'", "': not counted with They take their own recoil off (as before the power existed).'")]],
  'r3-vh-box': ['app.html', ['3'], [R("With They take their own recoil off the lab doesn’t count a pull’s ground shaking, so a quick", "With They take their own recoil off the lab doesn’t count a pull’s ground shaking (as before the power existed), so a quick")]],
  'r3-vh-card': ['data.js', ['3'], [R("With it off the lab counts no pull’s shaking: his footing", "With it off the lab counts no pull’s shaking, as before the power existed: his footing")]],
  // copy-card-bolted-pull-fraction-of-second
  'r3-card-quick': ['data.js', ['3'], [R("which all-out can be quick (0.31 s for a car at the page’s default dial; about 2 s for a locomotive, and longer at a low dial)", "which all-out takes a fraction of a second")]],
  // ---- round 2's fixes that had no covering check (code-2), reverted on today's page
  'r2-m1-caught': ['app.html', ['2'], [R("        out.caught = !!t.catch;\n", "")]],
  'r2-m2-friction-steps': ['app.html', ['2'], [R("' (his grip caps it: his footing, ' + fmtSI(r.anchor.R, 'N') + ', is the most his steps can push with).'", "' (bolted, nothing caps it: the quicker the pull, the harder his feet push).'")]],
  'r2-m3-why-grip': ['app.html', ['2'], [R("+ (state.anchor === 'bolted' ? 'Bolted, his legs cap it:", "+ (false ? 'Bolted, his legs cap it:")]],
  'r2-m4-card': ['data.js', ['2'], [R(/\. A pull’s counts only with They take their own recoil on[^]*?more than it says\./, ", or a pull (with They take their own recoil on, the rope’s pull back goes to the endless ocean, so nothing of it reaches the ground; with it off, his footing takes it as a steady load over seconds, or his bolts do over the pull, which all-out takes a fraction of a second; the lab counts neither, so a quick bolted pull may shake the ground more than it says).")]],
  'r2-m5a-hazard-off': ['app.html', ['2'], [R("move === 'pull' ? ': not counted with They take their own recoil off.' : ': not modelled for this move.'", "': not modelled for this move.'")]],
  'r2-m5b-hazard-on': ['app.html', ['2'], [R("      else if (move === 'pull') items.push(", "      else if (false) items.push(")]],
};
const only = process.argv.slice(2);
for (const [name, [file, rounds, reps]] of Object.entries(MUT)) {
  if (only.length && !only.some((o) => name.startsWith(o))) continue;
  const dir = path.join(OUT, name);
  fs.mkdirSync(dir + '/src', { recursive: true });
  for (const f of ['app.html', 'engine.js', 'ladder.js', 'data.js']) fs.copyFileSync(REPO + '/src/' + f, dir + '/src/' + f);
  if (!fs.existsSync(dir + '/assets')) fs.symlinkSync(REPO + '/assets', dir + '/assets');
  fs.copyFileSync(REPO + '/build.js', dir + '/build.js');
  let s = fs.readFileSync(dir + '/src/' + file, 'utf8');
  for (const [a, b] of reps) {
    const n = typeof a === 'string' ? s.split(a).length - 1 : (s.match(new RegExp(a.source, 'g')) || []).length;
    if (n !== 1) throw new Error(name + ': match ' + n + ' for ' + String(a).slice(0, 80));
    s = s.replace(a, b);
  }
  fs.writeFileSync(dir + '/src/' + file, s);
  execFileSync('node', [dir + '/build.js']);
  for (const RD of rounds) {
    let out;
    try { out = execFileSync('node', [path.join(__dirname, 'runblock3.js'), dir + '/dist/index.html', REPO + '/test/shots.js'], { encoding: 'utf8', env: Object.assign({}, process.env, { ROUND: RD }), maxBuffer: 1 << 26 }); } catch (e) { out = (e.stdout || '') + (e.stderr || ''); }
    const probs = out.split('\n').filter((l) => /^PROBLEM/.test(l));
    console.log('== ' + name + ' (round ' + RD + ' block): ' + (probs.length ? 'CAUGHT' : 'passes'));
    for (const p of probs) console.log('   ' + p.split(' ;; ').map((x) => x.slice(0, 200)).join('\n   ;; '));
  }
}
