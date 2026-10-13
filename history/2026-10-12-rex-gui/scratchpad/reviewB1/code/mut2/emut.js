// engine mutations against test/powers.js --skip-off (each in its own copy of the lab)
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const LAB = path.join(__dirname, 'lab'), ENG = path.join(LAB, 'src', 'engine.js');
const orig = fs.readFileSync(ENG, 'utf8');
const M = {
  'E1-fly-ignores-dragK': ["const dK = o.dragK == null ? 1 : Math.min(1, Math.max(0, o.dragK));\n    const out = {\n      v0, range: 0, apex: h0, time: 0, vImpact: 0, impactAngleDeg: 0,\n      escaped: false, orbit: false, landed: false, timedOut: false, relativistic: false,\n      maxMach", "const dK = 1;\n    const out = {\n      v0, range: 0, apex: h0, time: 0, vImpact: 0, impactAngleDeg: 0,\n      escaped: false, orbit: false, landed: false, timedOut: false, relativistic: false,\n      maxMach"],
  'E2-ownAnchor-off': ["const ownAnchor = (c) => (c.ownRecoil ? 'bolted' : c.anchor);", "const ownAnchor = (c) => c.anchor;"],
  'E3-throw-toGround-sign': ["extra.toGround = { J: push.pB === Infinity ? Infinity : Math.max(0, push.pB - push.pA), T: Math.max(limbPulse(body), push.t) };", "extra.toGround = { J: push.pB === Infinity ? Infinity : -Math.max(0, push.pB - push.pA), T: Math.max(limbPulse(body), push.t) };"],
  'E4-throw-shake-drops-push': ["return [land, impulseSource(o.surface, r.toGround.J, Math.max(1e-9, r.toGround.T))].filter(Boolean);", "return [land, null].filter(Boolean);"],
  'E5-plan-ground-not-real': ["if (p.id === 'ground' && ctxReal) jobs.set", "if (false) jobs.set"],
  'E7-catch-ignores-air': ["const dK = dragFactor(ctxT), obj = dK < 1 ? Object.assign({}, objIn, { dragK: dK }) : objIn;", "const dK = 1, obj = objIn;"],
  'E8-toss-ignores-air': ["const dK = dragFactor(ctxT), obj0 = partnerAsObject(bP, name), obj = dK < 1 ? Object.assign(obj0, { dragK: dK }) : obj0;", "const dK = 1, obj0 = partnerAsObject(bP, name), obj = obj0;"],
  'E9-catch-toGroundC-wrong': ["out.toGroundC = { J: Math.max(0, vToMomentum(out.vArrive, obj.m) - (bC.m + obj.m) * k.uAfter)", "out.toGroundC = { J: 1e-30 * Math.max(0, vToMomentum(out.vArrive, obj.m) - (bC.m + obj.m) * k.uAfter)"],
  'E10-punch-toGround-zero': ["const extra = (ctx.ownRecoil || ctx.unbreakable) && push.vB > 0 ? { toGround: { J: push.pB === Infinity ? Infinity : Math.max(0, push.pB - push.pA)", "const extra = (ctx.ownRecoil || ctx.unbreakable) && push.vB > 0 ? { toGround: { J: push.pB === Infinity ? Infinity : 1e-30 * Math.max(0, push.pB - push.pA)"],
  'E11-stomp-shake-real-hole': ["2 * ((o.unbreakable && r.realHole != null ? r.realHole : r.holeDepth) || 0) / r.vFoot", "2 * (r.holeDepth || 0) / r.vFoot"],
  'E12-shove-toGround-zero': ["const extra = (cA.unbreakable || cA.ownRecoil) && !push.stalled ? { toGround: { J: push.pB === Infinity ? Infinity : Math.max(0, push.pB - push.pA)", "const extra = (cA.unbreakable || cA.ownRecoil) && !push.stalled ? { toGround: { J: push.pB === Infinity ? Infinity : 1e-30 * Math.max(0, push.pB - push.pA)"],
  'E13-arm-toGround-zero': ["out.toGround = { J: isFinite(E) ? out.pin.M * v : Infinity, T: limbPulse(bw) };", "out.toGround = { J: isFinite(E) ? 1e-30 * out.pin.M * v : Infinity, T: limbPulse(bw) };"],
  'E14-fireballAt-ignores-k': ["const Egap = kAir < 1 ? kAir * heatAt(xg) : heatAt(xg);", "const Egap = heatAt(xg);"],
  'E15-weight-held-ignored': ["if (groundHolds || !unbreakable || real.regime === 'stands') return real;", "if (true) return real;"],
};
const only = process.argv[2];
for (const [name, [a, b]] of Object.entries(M)) {
  if (only && name !== only) continue;
  const n = orig.split(a).length - 1;
  if (n !== 1) { console.log(name, 'PATTERN x' + n); continue; }
  fs.writeFileSync(ENG, orig.replace(a, b));
  let out = '';
  try { out = execSync('node test/powers.js --skip-off', { cwd: LAB, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); } catch (e) { out = (e.stdout || '') + (e.stderr || ''); }
  const fails = out.split('\n').filter((l) => /^FAIL|Error/.test(l));
  console.log(name + ': ' + (fails.length ? 'CAUGHT by ' + fails.length + ' (' + fails[0].slice(0, 140) + ')' : 'NOT CAUGHT') );
}
fs.writeFileSync(ENG, orig);
