// Engine/page mutants: node engmut.js <name>  -> copies the branch's rex-strength-lab, applies the named mutation, runs
// test/powers.js --skip-off (engine mutants) and prints the failing checks.
const fs = require('fs'), path = require('path'), { execSync, spawnSync } = require('child_process');
const BASE = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r3/code';
const M = {
  // the pull's bolted branch (round 2): back to friction-only
  'pull-bolted-branch': ['engine.js', 'if (ctx.ownRecoil) {\n      usable = driveStrength(ctx);', 'if (ctx.ownRecoil && ctx.anchor !== \'bolted\') {\n      usable = driveStrength(ctx);'],
  'pull-bolted-pairpace': ['engine.js', 'const aLoad = net > 0 ? net / obj.m : 0', 'const aLoad = net > 0 ? net / (ctx.anchor === \'bolted\' ? M : obj.m) : 0'],
  'pull-bolted-frictioncap': ['engine.js', 'aFeet = anc.R / body.m;', 'aFeet = (ctx.anchor === \'bolted\' ? surface.mu * body.m * K.g : anc.R) / body.m;'],
  'walkPush-none': ['engine.js', 'if (ctx.ownRecoil && net > 0) ownLimit.walkPush = ', 'if (false) ownLimit.walkPush = '],
  'walkPush-pair': ['engine.js', 'J: isFinite(net) ? net * t10m * body.m / M : Infinity', 'J: isFinite(net) ? net * t10m : Infinity'],
  'walkPush-plusRope': ['engine.js', 'J: isFinite(net) ? net * t10m * body.m / M : Infinity', 'J: isFinite(net) ? net * t10m * body.m / M + ownLimit.ropeT * t10m : Infinity'],
  'walkPush-T-half': ['engine.js', 'net * t10m * body.m / M : Infinity, T: t10m }', 'net * t10m * body.m / M : Infinity, T: t10m / 2 }'],
  'walkPush-cap-friction': ['engine.js', 'J: isFinite(net) ? net * t10m * body.m / M : Infinity', 'J: isFinite(net) ? Math.min(net * t10m * body.m / M, surface.mu * body.m * K.g * t10m) : Infinity'],
  'walkPush-off-too': ['engine.js', "}, ctx.ownRecoil ? Object.assign({ ownRecoil: true }, ownLimit) : {});\n  }\n\n  // Smallest strength", "}, ctx.ownRecoil ? Object.assign({ ownRecoil: true }, ownLimit) : (net > 0 ? { walkPush: { J: net * t10m * body.m / M, T: t10m } } : {}));\n  }\n\n  // Smallest strength"],
  'pullshake-none': ['engine.js', "shake: (r, o) => (o.ownRecoil && r.walkPush && r.walkPush.J > 0", "shakeX: (r, o) => (o.ownRecoil && r.walkPush && r.walkPush.J > 0"],
  'pullshake-rope': ['engine.js', 'impulseSource(o.surface, r.walkPush.J, r.walkPush.T) : null)', 'impulseSource(o.surface, r.recoilAbsorbed.J, r.walkPush.T) : null)'],
  'pullshake-ropeplus': ['engine.js', 'impulseSource(o.surface, r.walkPush.J, r.walkPush.T) : null)', 'impulseSource(o.surface, r.walkPush.J + r.recoilAbsorbed.J, r.walkPush.T) : null)'],
  'pullshake-withpower-true': ['engine.js', "shakeWithPower: 'ownRecoil',\n        where: 'behind him',", "shakeWithPower: true,\n        where: 'behind him',"],
  'pullshake-withpower-none': ['engine.js', "shakeWithPower: 'ownRecoil',\n        where: 'behind him',", "where: 'behind him',"],
  'pullshake-T-limb': ['engine.js', 'impulseSource(o.surface, r.walkPush.J, r.walkPush.T) : null)', 'impulseSource(o.surface, r.walkPush.J, Math.min(r.walkPush.T, limbPulse(o.body))) : null)'],
};
const name = process.argv[2], [file, a, b] = M[name];
const D = path.join(BASE, 'emut', name);
fs.rmSync(D, { recursive: true, force: true }); fs.mkdirSync(D, { recursive: true });
execSync('cp -r ' + path.join(BASE, 'repo/rex-strength-lab') + ' ' + D);
const f = path.join(D, 'rex-strength-lab/src', file), s = fs.readFileSync(f, 'utf8');
if (s.split(a).length !== 2) { console.log(name + ': PATTERN COUNT ' + (s.split(a).length - 1)); process.exit(2); }
fs.writeFileSync(f, s.replace(a, () => b));
const r = spawnSync('node', ['test/powers.js', '--skip-off'], { cwd: path.join(D, 'rex-strength-lab'), encoding: 'utf8', maxBuffer: 1 << 28 });
const out = r.stdout + r.stderr;
fs.writeFileSync(path.join(BASE, 'emut', name + '.log'), out);
const fails = out.split('\n').filter((l) => /^FAIL|Error|error/.test(l));
console.log(name + ': ' + (fails.length ? 'KILLED (' + fails.length + ')' : 'SURVIVED') + ' ' + (out.match(/\d+\/\d+ passed/) || ['?'])[0]);
for (const l of fails.slice(0, 6)) console.log('   ' + l.slice(0, 200));
if (process.argv[3] === 'build') { execSync('python3 build-data.py && node build.js', { cwd: path.join(D, 'rex-strength-lab') }); console.log('built ' + path.join(D, 'rex-strength-lab/dist/index.html')); }
