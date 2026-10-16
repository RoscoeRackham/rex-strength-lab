// Mutants for pull request 2's review: put his own push back into the ground in one move at a time, then run
// test/powers.js --skip-off against each mutant (a copy of the test whose ENGINE resolves to the mutant).
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const REPO = '/home/user/rex-strength-lab/rex-strength-lab', OUT = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/pr2/r1fix/mutants-build';
const src = fs.readFileSync(REPO + '/src/engine.js', 'utf8');
const MUT = {
  throw: [["      if (ctx.ownRecoil) extra.recoilAbsorbed = { J, T: push.t, thetaDeg };\n      else { const T = Math.max(limbPulse(body), push.t); extra.toGround = Object.assign(weakGround(ctx, body, J, th, T, (body.m + obj.m) * K.g), { T }); }",
           "      { const T = Math.max(limbPulse(body), push.t); extra.toGround = Object.assign(weakGround(ctx, body, J, th, T, (body.m + obj.m) * K.g), { T }); }"]],
  stomp: [["    if (ctx.ownRecoil && !ctx.stompLaunch) extra.recoilAbsorbed = { J: push.pB, T: push.t, thetaDeg: -90 };\n", ""]],
  pull: [["    if (ctx.ownRecoil && net > 0) ownLimit.recoilAbsorbed = { J: ownLimit.ropeT * t10m, T: t10m, thetaDeg: 0 };\n", ""],
         ["        // No shaking source, as for the punch:", "        shake: (r, o) => (o.ownRecoil && r.canMove && isFinite(r.t10m) && r.t10m > 0 ? impulseSource(o.surface, vToMomentum(r.vEnd, o.obj.m) + r.resist * r.t10m, r.t10m) : null),\n        shakeWithPower: 'ownRecoil',\n        // No shaking source, as for the punch:"]],
  shove: [["    const extra = push.stalled ? {} : cA.ownRecoil ? { recoilAbsorbed: { J: Jfeet, T: push.t, thetaDeg: 0 } }\n      : cA.unbreakable ? { toGround: { J: Jfeet, T: Math.max(limbPulse(A), push.t) } } : {};",
           "    const extra = (cA.unbreakable || cA.ownRecoil) && !push.stalled ? { toGround: { J: Jfeet, T: Math.max(limbPulse(A), push.t) } } : {};"]],
  wrestleThrow: [["    const r = throwObject(cA, obj, theta);\n",
           "    const r = throwObject(cA, obj, theta);\n    if (cA.ownRecoil && r.recoilAbsorbed) { const T = Math.max(limbPulse(A), r.push.t); r.toGround = Object.assign(weakGround(Object.assign({}, cA, { anchor: 'bolted' }), A, r.recoilAbsorbed.J, theta * Math.PI / 180, T, (A.m + B.m) * K.g), { T }); delete r.recoilAbsorbed; }\n"]],
  catchThrower: [["        if (ctxT.ownRecoil && v > 0) {\n          const r = full ? tab.at(thD) : null, ra = r && r.canMove ? r.recoilAbsorbed : null;\n          o.recoilAbsorbedT = { J: ra ? ra.J : vToMomentum(v, obj.m), T: ra ? ra.T : 2 * strokeOf(bT, obj) / v, thetaDeg: thD };\n        } else if (ctxT.unbreakable && v > 0) {",
           "        if ((ctxT.unbreakable || ctxT.ownRecoil) && v > 0) {"]],
  catcher: [["      if (ctxC.ownRecoil && reachesHim) {\n        out.recoilAbsorbedC = { J: k.relativistic ? k.pIn : vToMomentum(out.vArrive, obj.m), T: k.tStroke, angleDeg: out.angleDeg || 0 };\n      } else if (ctxC.unbreakable && (",
           "      if (ctxC.unbreakable && ("]],
  catcherFooting: [["      const uAfter = ctxC.ownRecoil ? 0 : clean ? vc : (mS * (vc + vSlam) + Mb * vc) / (mS + Mb);", "      const uAfter = clean ? vc : (mS * (vc + vSlam) + Mb * vc) / (mS + Mb);"],
                   ["      const anc = anchorCapacity({ body, surface: ctxC.surface, theta: gm, anchor: ownAnchor(ctxC), groundHolds: holdsGround(ctxC), mA: M, mB: m });\n      const R = anc.R;\n      const FA = E2 / d;", "      const anc = anchorCapacity({ body, surface: ctxC.surface, theta: gm, anchor: ctxC.anchor, groundHolds: holdsGround(ctxC), mA: M, mB: m });\n      const R = anc.R;\n      const FA = E2 / d;"]],
  partnerToss: [["      if (ctxT.ownRecoil && v > 0) {\n        const full = style !== 'easy' && t.canMove && t.recoilAbsorbed;\n        out.recoilAbsorbedT = { J: full ? t.recoilAbsorbed.J : vToMomentum(v, obj.m), T: full ? t.recoilAbsorbed.T : 2 * strokeOf(ctxT.body, obj) / v, thetaDeg: 90 };\n      } else if (ctxT.unbreakable && v > 0) {",
                  "      if ((ctxT.unbreakable || ctxT.ownRecoil) && v > 0) {"],
                 ["      if (ctxT.ownRecoil) out.recoilAbsorbedC = { J: vToMomentum(fl.vImpact, obj.m), T: out.catch.tStroke, angleDeg: 90 };\n      else if (ctxT.unbreakable) {", "      if (ctxT.unbreakable) {"]],
  armPin: [["    if (cA.unbreakable && pins && !tableBreaks && v > 0 && (ownPin || !(out.pin.t < limbPulse(bw)))) out.toGround = { J: ownPin ? Jpin : isFinite(E) ? vToMomentum(v, out.pin.M) : Infinity, T: limbPulse(bw) };\n    if (ownPin) out.recoilAbsorbed = { J: Jpin, T: out.pin.t, thetaDeg: -90 };",
            "    if (cA.unbreakable && pins && !tableBreaks && v > 0 && !(out.pin.t < limbPulse(bw))) out.toGround = { J: isFinite(E) ? vToMomentum(v, out.pin.M) : Infinity, T: limbPulse(bw) };"]],
  // (bonus, decision 3) the push back loads his feet again: the throw's foot load, and the catcher's
  throwFeet: [["    const Nfeet = ctx.ownRecoil ? (body.m + obj.m) * K.g : isFinite(Fload)", "    const Nfeet = isFinite(Fload)"]],
  catchFeet: [["        sinkRatio: isFinite(anc.Nmax) ? (ctxC.ownRecoil ? (M + m) * K.g : anc.N(F)) / anc.Nmax : 0,\n        Ecatch: E0", "        sinkRatio: isFinite(anc.Nmax) ? anc.N(F) / anc.Nmax : 0,\n        Ecatch: E0"]],
};
const only = process.argv.slice(2);
for (const [name, reps] of Object.entries(MUT)) {
  if (only.length && !only.includes(name)) continue;
  let s = src;
  for (const [a, b] of reps) { const n = s.split(a).length - 1; if (n !== 1) throw new Error(name + ': match ' + n + ' for ' + a.slice(0, 80)); s = s.replace(a, b); }
  const dir = path.join(OUT, name);
  fs.mkdirSync(dir + '/src', { recursive: true }); fs.mkdirSync(dir + '/test', { recursive: true });
  fs.writeFileSync(dir + '/src/engine.js', s);
  fs.copyFileSync(REPO + '/src/data.js', dir + '/src/data.js');
  fs.copyFileSync(REPO + '/test/powers.js', dir + '/test/powers.js');
  let out;
  try { out = execFileSync('node', [dir + '/test/powers.js', '--skip-off'], { encoding: 'utf8', maxBuffer: 1 << 26 }); } catch (e) { out = (e.stdout || '') + (e.stderr || ''); }
  const fails = out.split('\n').filter((l) => /^FAIL/.test(l)), tail = out.trim().split('\n').pop();
  console.log('== ' + name + ': ' + (fails.length ? 'KILLED' : /passed/.test(tail) ? 'SURVIVED' : 'KILLED (crash)') + ' (' + tail + ')');
  for (const f of fails) console.log('   ' + f.slice(0, 220));
}
