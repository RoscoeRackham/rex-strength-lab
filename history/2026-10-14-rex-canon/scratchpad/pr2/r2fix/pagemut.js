// Page reverts for review round 2: copy the repo's page sources into a scratch dir, apply one change (to app.html,
// engine.js or static-data.js -> data.js is rebuilt from the repo's build-data.py only when static-data changes, so
// static-data changes are applied to data.js directly), build, and run the round 1 and round 2 shots.js blocks on it.
// Usage: node pagemut.js [name ...]
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const REPO = '/home/user/rex-strength-lab/rex-strength-lab', OUT = path.join(__dirname, 'pagemut');
const MUT = {
  // code-4: the engine's one-sided flag dropped (the reviewer's m4): the page falls back to 'one unbreakable system'
  'code4-noOneSided': ['engine.js', [["{ clash: go ? 'partnerTorn' : 'paradox', oneSided: true }", "{ clash: go ? 'partnerTorn' : 'paradox' }"]]],
  // code-8: the stalled shove's tile reverted to 'either one's footing' (the reviewer's m8)
  'code8-tile': ['app.html', [["cP.ownRecoil ? 'the shove is weaker than ' + target + (cT.anchor === 'bolted' ? '’s bolts' : '’s footing') : 'the shove is weaker than either one’s footing'", "'the shove is weaker than either one’s footing'"]]],
  // copy-1: the engine's bolted pull reverted (the pair's pace, no steps counted)
  'copy1-engine': ['engine.js', [["    if (ctx.ownRecoil) {\n      usable = driveStrength(ctx);", "    if (ctx.ownRecoil && ctx.anchor !== 'bolted') {\n      usable = driveStrength(ctx);"], ["        shakeWithPower: 'ownRecoil',\n        where: 'behind him',", "        shake: undefined,\n        where: 'behind him',"]]],
  // code-3: the never note judged at the top of the grid again (10^34 kg-force), not the unlimited probe
  'code3-top': ['app.html', [["const topU = isFinite(Math.max(fullF('R'), fullF('O'))) ? eff.p.hi : Infinity", "const topU = eff.p.hi"]]],
  // code-1: the catch caveat without the allReach test
  'code1-allReach': ['app.html', [["    if (act === 'catch') return f.allReach ? ", "    if (act === 'catch') return true ? "], ["!f.shake.length && !f.allReach && f.thrown ? catchLandWhy() : null", "!f.shake.length && false && f.thrown ? catchLandWhy() : null"]]],
  // code-1: the toss caveat without the caught test
  'code1-caught': ['app.html', [["return !f.tossed ? null : f.caught ? ", "return !f.tossed ? null : true ? "]]],
  // code-6: the cant-hold-it wording reverted
  'code6': ['app.html', [["      : a.result === 'cant-hold-it' ? 'They take their own recoil: Ollie’s arms can’t hold it", "      : false ? 'They take their own recoil: Ollie’s arms can’t hold it"]]],
};
const only = process.argv.slice(2);
for (const [name, [file, reps]] of Object.entries(MUT)) {
  if (only.length && !only.includes(name)) continue;
  const dir = path.join(OUT, name);
  fs.mkdirSync(dir + '/src', { recursive: true });
  for (const f of ['app.html', 'engine.js', 'ladder.js', 'data.js']) fs.copyFileSync(REPO + '/src/' + f, dir + '/src/' + f);
  if (!fs.existsSync(dir + '/assets')) fs.symlinkSync(REPO + '/assets', dir + '/assets');
  fs.copyFileSync(REPO + '/build.js', dir + '/build.js');
  let s = fs.readFileSync(dir + '/src/' + file, 'utf8');
  for (const [a, b] of reps) { const n = s.split(a).length - 1; if (n !== 1) throw new Error(name + ': match ' + n + ' for ' + a.slice(0, 80)); s = s.replace(a, b); }
  fs.writeFileSync(dir + '/src/' + file, s);
  execFileSync('node', [dir + '/build.js']);
  for (const R of ['1', '2']) {
    let out;
    try { out = execFileSync('node', [path.join(__dirname, 'runblock2.js'), dir + '/dist/index.html', REPO + '/test/shots.js'], { encoding: 'utf8', env: Object.assign({}, process.env, { ROUND: R }), maxBuffer: 1 << 26 }); } catch (e) { out = (e.stdout || '') + (e.stderr || ''); }
    const probs = out.split('\n').filter((l) => /^PROBLEM/.test(l));
    console.log('== ' + name + ' (round ' + R + ' block): ' + (probs.length ? 'CAUGHT' : 'passes'));
    for (const p of probs) console.log('   ' + p.split(' ;; ').map((x) => x.slice(0, 160)).join('\n   ;; '));
  }
}
