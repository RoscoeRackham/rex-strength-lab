// Review round 3's re-check of pull request 2: every engine mutant that matters, run against test/powers.js --skip-off in
// a scratch copy (the repo is never touched), 3 at a time. (Copied from pr2/r3fix/mutate-r3.js; the r3-* leg mutants
// adapted to the re-check's rule, aFeet = min(footing, the strength he uses) / his mass, and rc-* added.) Groups:
//   r0-*: the build's 'push back into the ground' mutants (scratchpad pr2/work/mutate.js), the pull one rewritten for
//         round 2's engine (the rope's pull back booked in the ground with his steps; nothing to his source)
//   r1-*: round 1's (pr2/r1fix/mutate-r1.js): code-1's fix reverted, code-2's four catcher mutants
//   r2-*: round 2's: each behaviour fix reverted, and the reviewer's surviving mutants
//   r3-*: round 3's: the leg cap reverted, and near misses (bolted only, the dial instead of the effort, friction only)
//   rc-*: the re-check's: round 3's 1.4x cap (the Pull tab's leg-extension rule, def9546) and a 2.0x cap
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const REPO = '/home/user/rex-strength-lab/rex-strength-lab', OUT = path.join(__dirname, 'mutants');
const src = fs.readFileSync(REPO + '/src/engine.js', 'utf8');
const oneSidedStart = src.indexOf("    if (cAin.ownRecoil && !isFinite(Fdrive) && !isFinite(fB.R)) {"), oneSidedEnd = src.indexOf("    if (!isFinite(Fdrive) && !isFinite(fA.R) && !isFinite(fB.R)) {");
const MUT = {
  'r0-throw': [["      if (ctx.ownRecoil) extra.recoilAbsorbed = { J, T: push.t, thetaDeg };\n      else { const T = Math.max(limbPulse(body), push.t); extra.toGround = Object.assign(weakGround(ctx, body, J, th, T, (body.m + obj.m) * K.g), { T }); }",
           "      { const T = Math.max(limbPulse(body), push.t); extra.toGround = Object.assign(weakGround(ctx, body, J, th, T, (body.m + obj.m) * K.g), { T }); }"]],
  'r0-stomp': [["    if (ctx.ownRecoil && !ctx.stompLaunch) extra.recoilAbsorbed = { J: push.pB, T: push.t, thetaDeg: -90 };\n", ""]],
  // the rope's pull back into the ground: not to his source, and added to his steps' push on the ground
  'r0-pull': [["    if (ctx.ownRecoil && net > 0) ownLimit.recoilAbsorbed = { J: ownLimit.ropeT * t10m, T: t10m, thetaDeg: 0 };\n", ""],
              ["impulseSource(o.surface, r.walkPush.J, r.walkPush.T)", "impulseSource(o.surface, r.walkPush.J + r.ropeT * r.t10m, r.walkPush.T)"]],
  // ... or the rope's pull back alone into the ground, as main had it (his steps not counted)
  'r0-pull-main': [["    if (ctx.ownRecoil && net > 0) ownLimit.recoilAbsorbed = { J: ownLimit.ropeT * t10m, T: t10m, thetaDeg: 0 };\n", ""],
              ["impulseSource(o.surface, r.walkPush.J, r.walkPush.T)", "impulseSource(o.surface, vToMomentum(r.vEnd, o.obj.m) + r.resist * r.t10m, r.t10m)"]],
  'r0-shove': [["    const extra = push.stalled ? {} : cA.ownRecoil ? { recoilAbsorbed: { J: Jfeet, T: push.t, thetaDeg: 0 } }\n      : cA.unbreakable ? { toGround: { J: Jfeet, T: Math.max(limbPulse(A), push.t) } } : {};",
           "    const extra = (cA.unbreakable || cA.ownRecoil) && !push.stalled ? { toGround: { J: Jfeet, T: Math.max(limbPulse(A), push.t) } } : {};"]],
  'r0-wrestleThrow': [["    const r = throwObject(cA, obj, theta);\n",
           "    const r = throwObject(cA, obj, theta);\n    if (cA.ownRecoil && r.recoilAbsorbed) { const T = Math.max(limbPulse(A), r.push.t); r.toGround = Object.assign(weakGround(Object.assign({}, cA, { anchor: 'bolted' }), A, r.recoilAbsorbed.J, theta * Math.PI / 180, T, (A.m + B.m) * K.g), { T }); delete r.recoilAbsorbed; }\n"]],
  'r0-catchThrower': [["        if (ctxT.ownRecoil && v > 0) {\n          const r = full ? tab.at(thD) : null, ra = r && r.canMove ? r.recoilAbsorbed : null;\n          o.recoilAbsorbedT = { J: ra ? ra.J : vToMomentum(v, obj.m), T: ra ? ra.T : 2 * strokeOf(bT, obj) / v, thetaDeg: thD };\n        } else if (ctxT.unbreakable && v > 0) {",
           "        if ((ctxT.unbreakable || ctxT.ownRecoil) && v > 0) {"]],
  'r0-catcher': [["      if (ctxC.ownRecoil && reachesHim) {\n        out.recoilAbsorbedC = { J: k.relativistic ? k.pIn : vToMomentum(out.vArrive, obj.m), T: k.tStroke, angleDeg: out.angleDeg || 0 };\n      } else if (ctxC.unbreakable && (",
           "      if (ctxC.unbreakable && ("]],
  'r0-catcherFooting': [["      const uAfter = ctxC.ownRecoil ? 0 : clean ? vc : (mS * (vc + vSlam) + Mb * vc) / (mS + Mb);", "      const uAfter = clean ? vc : (mS * (vc + vSlam) + Mb * vc) / (mS + Mb);"],
                   ["      const anc = anchorCapacity({ body, surface: ctxC.surface, theta: gm, anchor: ownAnchor(ctxC), groundHolds: holdsGround(ctxC), mA: M, mB: m });\n      const R = anc.R;\n      const FA = E2 / d;", "      const anc = anchorCapacity({ body, surface: ctxC.surface, theta: gm, anchor: ctxC.anchor, groundHolds: holdsGround(ctxC), mA: M, mB: m });\n      const R = anc.R;\n      const FA = E2 / d;"]],
  'r0-partnerToss': [["      if (ctxT.ownRecoil && v > 0) {\n        const full = style !== 'easy' && t.canMove && t.recoilAbsorbed;\n        out.recoilAbsorbedT = { J: full ? t.recoilAbsorbed.J : vToMomentum(v, obj.m), T: full ? t.recoilAbsorbed.T : 2 * strokeOf(ctxT.body, obj) / v, thetaDeg: 90 };\n      } else if (ctxT.unbreakable && v > 0) {",
                  "      if ((ctxT.unbreakable || ctxT.ownRecoil) && v > 0) {"],
                 ["      if (ctxT.ownRecoil) out.recoilAbsorbedC = { J: vToMomentum(fl.vImpact, obj.m), T: out.catch.tStroke, angleDeg: 90 };\n      else if (ctxT.unbreakable) {", "      if (ctxT.unbreakable) {"]],
  'r0-armPin': [["    if (cA.unbreakable && pins && !tableBreaks && v > 0 && (ownPin || !(out.pin.t < limbPulse(bw)))) out.toGround = { J: ownPin ? Jpin : isFinite(E) ? vToMomentum(v, out.pin.M) : Infinity, T: limbPulse(bw) };\n    if (ownPin) out.recoilAbsorbed = { J: Jpin, T: out.pin.t, thetaDeg: -90 };",
            "    if (cA.unbreakable && pins && !tableBreaks && v > 0 && !(out.pin.t < limbPulse(bw))) out.toGround = { J: isFinite(E) ? vToMomentum(v, out.pin.M) : Infinity, T: limbPulse(bw) };"]],
  'r0-throwFeet': [["    const Nfeet = ctx.ownRecoil ? (body.m + obj.m) * K.g : isFinite(Fload)", "    const Nfeet = isFinite(Fload)"]],
  'r0-catchFeet': [["        sinkRatio: isFinite(anc.Nmax) ? (ctxC.ownRecoil ? (M + m) * K.g : anc.N(F)) / anc.Nmax : 0,\n        Ecatch: E0", "        sinkRatio: isFinite(anc.Nmax) ? anc.N(F) / anc.Nmax : 0,\n        Ecatch: E0"]],
  'r1-code1-revert': [[src.slice(oneSidedStart, oneSidedEnd), '']],
  'r1-code2a-unbounded-anchor': [["const bolted = ownAnchor(ctxC) === 'bolted', R0 = anchorCapacity(", "const bolted = ctxC.anchor === 'bolted', R0 = anchorCapacity("]],
  'r1-code2b-unbounded-sink': [["if (ctxC.unbreakable) out.sinkRatioRaw = ctxC.ownRecoil ? (M + m) * K.g / (qultFor(ctxC.surface, body.footB) * 2 * body.footArea) : Infinity;", "if (ctxC.unbreakable) out.sinkRatioRaw = Infinity;"]],
  'r1-code2c-cant-hold-it': [[" || out.result === 'wreckage' || out.result === 'cant-hold-it';", " || out.result === 'wreckage';"]],
  'r1-code2d-wreckage': [[" || out.result === 'wreckage' || out.result === 'cant-hold-it';", " || out.result === 'cant-hold-it';"]],
  // round 2, copy-1's engine fix reverted, one part at a time
  'r2-copy1-bolted-pace': [["    if (ctx.ownRecoil) {\n      usable = driveStrength(ctx);", "    if (ctx.ownRecoil && ctx.anchor !== 'bolted') {\n      usable = driveStrength(ctx);"]],
  'r2-copy1-no-walkPush': [["    if (ctx.ownRecoil && net > 0) ownLimit.walkPush = { J: isFinite(net) ? net * t10m * body.m / M : Infinity, T: t10m };\n", ""]],
  'r2-copy1-no-shake': [["        shake: (r, o) => (o.ownRecoil && r.walkPush && r.walkPush.J > 0 && r.walkPush.T > 0 && isFinite(r.walkPush.T) ? impulseSource(o.surface, r.walkPush.J, r.walkPush.T) : null),\n        shakeWithPower: 'ownRecoil',\n", ""]],
  'r2-copy1-shake-off-too': [["        shakeWithPower: 'ownRecoil',\n        where: 'behind him',", "        where: 'behind him',"]],
  // round 2, code-2: the catcher's raw foot load counts his stop's push back (Unbreakable footing on)
  'r2-code2-catchC-sinkRaw': [["sinkRatioRaw: (ctxC.ownRecoil ? (M + m) * K.g : anc.N(F)) / (qultFor(", "sinkRatioRaw: (anc.N(F)) / (qultFor("]],
  'r2-code2-tossC-sinkRaw90': [["sinkRatioRaw: (ctxC.ownRecoil ? (M + m) * K.g : anc.N(F)) / (qultFor(", "sinkRatioRaw: (ctxC.ownRecoil && gammaDeg !== 90 ? (M + m) * K.g : anc.N(F)) / (qultFor("]],
  // round 2, code-4: the one-sided flag dropped, and the planted shover given energy
  'r2-code4-noOneSided': [["{ clash: go ? 'partnerTorn' : 'paradox', oneSided: true }", "{ clash: go ? 'partnerTorn' : 'paradox' }"]],
  'r2-code4-EA': [["relativistic: go, vA: 0, vB: go ? K.c : 0, EA: 0,", "relativistic: go, vA: 0, vB: go ? K.c : 0, EA: Infinity,"]],
  // round 2, code-5: the quick pin's slam over the swing time, not a limb's contact time
  'r2-code5-arm-groundT': [["out.toGround = { J: ownPin ? Jpin : isFinite(E) ? vToMomentum(v, out.pin.M) : Infinity, T: limbPulse(bw) };", "out.toGround = { J: ownPin ? Jpin : isFinite(E) ? vToMomentum(v, out.pin.M) : Infinity, T: ownPin ? out.pin.t : limbPulse(bw) };"]],
  // round 2, code-9 (refuted; the optional hardening): the push backs' times
  'r2-code9-throw-T': [["      if (ctx.ownRecoil) extra.recoilAbsorbed = { J, T: push.t, thetaDeg };", "      if (ctx.ownRecoil) extra.recoilAbsorbed = { J, T: Math.max(limbPulse(body), push.t), thetaDeg };"]],
  'r2-code9-punch-T': [["{ recoilAbsorbed: { J: push.pB, T: push.t, thetaDeg: 0, returned: true } }", "{ recoilAbsorbed: { J: push.pB, T: 0, thetaDeg: 0, returned: true } }"]],
  'r2-code9-shove-T': [["cA.ownRecoil ? { recoilAbsorbed: { J: Jfeet, T: push.t, thetaDeg: 0 } }", "cA.ownRecoil ? { recoilAbsorbed: { J: Jfeet, T: Math.max(limbPulse(A), push.t), thetaDeg: 0 } }"]],
  'r2-code9-catchT-T': [["T: ra ? ra.T : 2 * strokeOf(bT, obj) / v, thetaDeg: thD };", "T: 0, thetaDeg: thD };"]],
  'r2-code9-tossT-T': [["T: full ? t.recoilAbsorbed.T : 2 * strokeOf(ctxT.body, obj) / v, thetaDeg: 90 };", "T: 0, thetaDeg: 90 };"]],
  'r2-code9-tossC-T': [["out.recoilAbsorbedC = { J: vToMomentum(fl.vImpact, obj.m), T: out.catch.tStroke, angleDeg: 90 };", "out.recoilAbsorbedC = { J: vToMomentum(fl.vImpact, obj.m), T: 0, angleDeg: 90 };"]],
  // the round 2 code reviewer's 'throw-Nfeet-partner': equivalent (it survives): only the partner toss throws an object
  // with id 'partner', and tossPartner doesn't return its sinkRatio; the wrestle throw's partner object has no id
  // round 3, physics-bolted-pull-legs-unbounded: the leg cap reverted (bolted, his legs push without limit)
  'r3-legs-revert': [["aFeet = Math.min(anc.R, usable) / body.m;", "aFeet = anc.R / body.m;"]],
  // ... capped only when bolted (on friction a light load at a low effort: his feet push with his whole footing)
  'r3-legs-bolted-only': [["aFeet = Math.min(anc.R, usable) / body.m;", "aFeet = (ctx.anchor === 'bolted' ? Math.min(anc.R, usable) : anc.R) / body.m;"]],
  // ... capped only on friction (bolted, uncapped: round 2's engine)
  'r3-legs-friction-only': [["aFeet = Math.min(anc.R, usable) / body.m;", "aFeet = (ctx.anchor === 'bolted' ? anc.R : Math.min(anc.R, usable)) / body.m;"]],
  // ... capped by the dial, not the strength he uses
  'r3-legs-dial': [["aFeet = Math.min(anc.R, usable) / body.m;", "aFeet = Math.min(anc.R, ctx.F) / body.m;"]],
  // the re-check, fixes-pull-legs-vs-sprint: round 3's 1.4x cap (LEG_SHARE, the leg-extension rule; def9546)
  'rc-legs-1.4x': [["aFeet = Math.min(anc.R, usable) / body.m;", "aFeet = Math.min(anc.R, LEG_SHARE() * usable) / body.m;"]],
  // ... and a 2.0x cap
  'rc-legs-2x': [["aFeet = Math.min(anc.R, usable) / body.m;", "aFeet = Math.min(anc.R, 2 * usable) / body.m;"]],
  // ... and a near miss below: 0.9x (his own body slower than his sprint's push-off)
  'rc-legs-0.9x': [["aFeet = Math.min(anc.R, usable) / body.m;", "aFeet = Math.min(anc.R, 0.9 * usable) / body.m;"]],
  'r2-rev-throw-Nfeet-partner': [["const Nfeet = ctx.ownRecoil ? (body.m + obj.m) * K.g :", "const Nfeet = ctx.ownRecoil && obj.id !== 'partner' ? (body.m + obj.m) * K.g : false ? 0 :"]],
};
const only = process.argv.slice(2);
const { execFile } = require('child_process');
const jobs = [];
for (const [name, reps] of Object.entries(MUT)) {
  if (only.length && !only.some((o) => name.startsWith(o))) continue;
  let s = src;
  for (const [a, b] of reps) { const n = s.split(a).length - 1; if (n !== 1) throw new Error(name + ': match ' + n + ' for ' + a.slice(0, 80)); s = s.replace(a, b); }
  const dir = path.join(OUT, name);
  fs.mkdirSync(dir + '/src', { recursive: true }); fs.mkdirSync(dir + '/test', { recursive: true });
  fs.writeFileSync(dir + '/src/engine.js', s);
  fs.copyFileSync(REPO + '/src/data.js', dir + '/src/data.js');
  fs.copyFileSync(REPO + '/test/powers.js', dir + '/test/powers.js');
  jobs.push({ name, dir });
}
const results = {};
let next = 0;
const runOne = () => new Promise((res) => {
  if (next >= jobs.length) return res();
  const { name, dir } = jobs[next++];
  execFile('node', [dir + '/test/powers.js', '--skip-off'], { encoding: 'utf8', maxBuffer: 1 << 26 }, (e, so, se) => {
    const out = (so || '') + (se || '');
    const fails = out.split('\n').filter((l) => /^FAIL/.test(l)), tail = out.trim().split('\n').pop();
    results[name] = '== ' + name + ': ' + (fails.length ? 'KILLED' : /passed/.test(tail) ? 'SURVIVED' : 'KILLED (crash)') + ' (' + tail + ')\n' + fails.map((f) => '   ' + f.slice(0, 260)).join('\n');
    res(runOne());
  });
});
Promise.all([runOne(), runOne(), runOne()]).then(() => { for (const j of jobs) console.log(results[j.name].trimEnd()); });
