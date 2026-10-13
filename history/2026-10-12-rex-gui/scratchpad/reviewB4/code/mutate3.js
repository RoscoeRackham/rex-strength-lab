const fs = require('fs'), path = require('path');
const R = '/home/user/rex-strength-lab/rex-strength-lab/';
const src = fs.readFileSync(R + 'src/engine.js', 'utf8');
const M = [
  ['P1-fly-noDragK', "      const dk = -cd * A / (2 * m) * rho * v * dK;\n      return [gk * x_ + dk * vx_, gk * y_ + dk * vy_];\n    };\n    let steps = 0;\n", "      const dk = -cd * A / (2 * m) * rho * v;\n      return [gk * x_ + dk * vx_, gk * y_ + dk * vy_];\n    };\n    let steps = 0;\n"],
  ['P2-throw-noOwnAnchor', "const anc = anchorCapacity({ body, surface: ctx.surface, theta: th, anchor: ownAnchor(ctx), groundHolds: holdsGround(ctx), mA, mB });", "const anc = anchorCapacity({ body, surface: ctx.surface, theta: th, anchor: ctx.anchor, groundHolds: holdsGround(ctx), mA, mB });"],
  ['P3-throw-toGround-neg', "extra.toGround = Object.assign({ J: Jg, T: Math.max(limbPulse(body), push.t) }", "extra.toGround = Object.assign({ J: -Jg, T: Math.max(limbPulse(body), push.t) }"],
  ['P4-plan-noReal', "if (p.id === 'ground' && ctxReal) jobs.set", "if (false && ctxReal) jobs.set"],
  ['P5-throwPushJ-bolted2x', "if (!e.p || ownAnchor(ctxT) === 'bolted') return vToMomentum(vL, obj.m);", "if (!e.p || ownAnchor(ctxT) === 'bolted') return 2 * vToMomentum(vL, obj.m);"],
  ['P6-toss-noCap', "out.toGroundC = Object.assign({ J: J / over, T:", "out.toGroundC = Object.assign({ J: J, T:"],
  ['P7-catch-noCap', "const over = k.sinkRatioRaw > 1 ? k.sinkRatioRaw : 1, a = (out.angleDeg || 0) * Math.PI / 180;", "const over = 1, a = (out.angleDeg || 0) * Math.PI / 180;"],
  ['P8-throw-noCap', "over = extra.sinkRatioRaw > 1 ? extra.sinkRatioRaw : 1;", "over = 1;"],
  ['P15-relCatch-noLump', "const body = ctxC.body, M = body.m, m = (fin && fin.m) || obj.m, c2 = K.c * K.c;", "const body = ctxC.body, M = body.m, m = obj.m, c2 = K.c * K.c;"],
  ['P20-stomp-printCap', "if (!ctx.groundHolds) holeDepth = !extra.realBreaks ? rr.hole : (soil && !(rr.crater.D > 0) ? printCap : 0);", "if (!ctx.groundHolds) holeDepth = !extra.realBreaks ? rr.hole : 0;"],
  ['P21-pull-shake-noRecoil', "shake: (r, o) => (o.ownRecoil && r.canMove && isFinite(r.t10m) && r.t10m > 0 ? impulseSource(o.surface, vToMomentum(r.vEnd, o.obj.m) + r.resist * r.t10m, r.t10m) : null),", "shake: (r, o) => (o.ownRecoil && r.canMove && isFinite(r.t10m) && r.t10m > 0 ? impulseSource(o.surface, 10 * (vToMomentum(r.vEnd, o.obj.m) + r.resist * r.t10m), r.t10m) : null),"],
  ['P22-handAir-noGamma', "const E0 = isFinite(gamma) ? gamma * gamma * mAir * vv * vv : Infinity;", "const E0 = isFinite(gamma) ? gamma * mAir * vv * vv : Infinity;"],
];
const list = [];
for (const [id, a, b] of M) {
  const n = src.split(a).length - 1;
  if (n !== 1) { console.log('SKIP', id, n); continue; }
  const d = path.join('pt', id);
  fs.mkdirSync(path.join(d, 'src'), { recursive: true }); fs.mkdirSync(path.join(d, 'test', 'fixtures'), { recursive: true });
  fs.writeFileSync(path.join(d, 'src', 'engine.js'), src.replace(a, b));
  fs.copyFileSync(R + 'src/data.js', path.join(d, 'src', 'data.js'));
  for (const f of ['powers.js', 'powers-off-cases.js']) fs.copyFileSync(R + 'test/' + f, path.join(d, 'test', f));
  fs.copyFileSync(R + 'test/fixtures/powers-off.json', path.join(d, 'test', 'fixtures', 'powers-off.json'));
  list.push(id);
}
fs.writeFileSync('pt/list.txt', list.join('\n') + '\n');
console.log(list.length);
