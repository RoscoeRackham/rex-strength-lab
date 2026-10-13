// usage: node mutate.js  -> writes mut/<id>.js for each mutation, checks the find string occurs exactly once
const fs = require('fs');
const src = fs.readFileSync('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js', 'utf8');
const M = [
  ['M1-catchIt-relAlways', "if (noAir && v >= 0.01 * K.c) return relCatch", "if (v >= 0.01 * K.c) return relCatch"],
  ['M2-shockGamma-always', "const bA = out.fast ? Math.min(out.vArrive / K.c, 1 - 1e-16) : 0", "const bA = Math.min(out.vArrive / K.c, 1 - 1e-16)"],
  ['M3-relBlast-half', "if (!h) return { land: k >= 1 ? r.Eobj : r.Eobj * k, path: 0 };", "if (!h) return { land: k >= 1 ? r.Eobj * 0.5 : r.Eobj * k, path: 0 };"],
  ['M4-easyPush-slip', "if (!(F0 > anc.R)) return { p: null, armMass, mB };", "if (!(F0 > 1.5 * anc.R)) return { p: null, armMass, mB };"],
  ['M5-holdOf-why', "(cB.groundHolds ? 'comicGround' : 'unbreakable')", "'unbreakable'"],
  ['M6-pull-limitedBy', "(anc.R >= resist || ctx.ownRecoil) ? 'effort'", "(anc.R >= resist || true) ? 'effort'"],
  ['M8-well-fastAlways', "vMax >= CATCH.V_FIREBALL && dK === 0) fast", "vMax >= CATCH.V_FIREBALL && dK <= 1) fast"],
  ['M9-hard-fastAlways', "const fb = dK > 0 ? fireballAt(obj, v, Dfl, ctxC, rel ? r.Eobj : null, dK, !!keptFire.kept) : null;", "const fb = dK > 1 ? fireballAt(obj, v, Dfl, ctxC, rel ? r.Eobj : null, dK, !!keptFire.kept) : null;"],
  ['M10-fireball-xg', "const xg = D / unit * (kAir < 1 ? kAir : 1);", "const xg = D / unit * (kAir < 1 ? kAir : 0.5);"],
  ['M11-jump-airLoss', "if (anyPower(ctx) && v > 0) extra.airLoss", "if (v > 0) extra.airLoss"],
  ['M13-weight-held', "if (groundHolds || !unbreakable || real.regime === 'stands') return real;", "if (groundHolds || real.regime === 'stands') return real;"],
  ['M14-footprint', "if (!unbreakable) return real;", ""],
  ['M15-growth-toGround', "if (gnd && gnd.unbreakable && !gnd.groundHolds && gnd.surface && g.dH > 0) {", "if (gnd && !gnd.groundHolds && gnd.surface && g.dH > 0) {"],
  ['M16-pull-shake', "shake: (r, o) => (o.ownRecoil && r.canMove && isFinite(r.t10m)", "shake: (r, o) => (r.canMove && isFinite(r.t10m)"],
  ['M17-shove-toGround', "const extra = (cA.unbreakable || cA.ownRecoil) && !push.stalled ?", "const extra = !push.stalled ?"],
  ['M18-arm-table', "const tableHolds = !!(cA.groundHolds || cA.keepForm);", "const tableHolds = !!(cA.groundHolds || cA.F > 1e8);"],
  ['M19-collide-toGround', "if ((cA.unbreakable || cB.unbreakable || o.toGround) && !cB.immovable && !h.undefinedResult) {", "if (!cB.immovable && !h.undefinedResult) {"],
  ['M21-throw-toGround', "if ((ctx.ownRecoil || ctx.unbreakable) && !push.stalled && v > 0) {", "if (!push.stalled && v > 0) {"],
  ['M22-throw-line', "if (flight.relativistic && (dK < 1 || ctx.keepForm)) extra.line", "if (flight.relativistic) extra.line"],
  ['M24-toss-escapes', "dK > 0 ? { result: 'fireball', v } : { result: 'escapes', v, fast: true }", "dK > 1 ? { result: 'fireball', v } : { result: 'escapes', v, fast: true }"],
  ['M26-well-heat', "dK > 0 ? stagnationT(Math.min(run.vmax, CATCH.V_FIREBALL)) : K.T0", "dK > 1 ? stagnationT(Math.min(run.vmax, CATCH.V_FIREBALL)) : K.T0"],
  ['M27-leg-qdyn', "rhoAt(h0) * vL * vL * dK);", "rhoAt(h0) * vL * vL * dK * 0.5);"],
  ['M28-wellRun-k0', "k0 = K.rho0 * obj.area / obj.m * dK,", "k0 = K.rho0 * obj.area / obj.m * dK * 1.01,"],
  ['M35-fly-split', "if (!split) return;\n", ""],
  ['M36-flyTo-ocean', "if (split) out.ocean = {", "out.ocean = {"],
  ['M37-recoilOf-anchor', "if (vL > 0 && ownAnchor(ctxT) !== 'bolted') {", "if (vL > 0 && ctxT.anchor === 'friction') {"],
  ['M38-throwPushJ', "if (!e.p || ownAnchor(ctxT) === 'bolted') return vToMomentum(vL, obj.m);", "if (!e.p || ownAnchor(ctxT) === 'bolted') return 2 * vToMomentum(vL, obj.m);"],
  ['M39-stomp-blast', "blast: (r, o) => shock(r.vFoot, o && o.unbreakable ? r.E - (r.absorbed || 0) + (MOVES.stomp.footAir(r, o) || { E: 0 }).E : r.E),", "blast: (r, o) => shock(r.vFoot, o ? r.E - (r.absorbed || 0) + (MOVES.stomp.footAir(r, o) || { E: 0 }).E : r.E),"],
  ['M40-jump-blast', "blast: (r) => shock(r.footSpeed, r.Eground || 0) + shock(r.v, r.airLoss || 0),", "blast: (r) => shock(r.footSpeed, r.Eground || 0) + shock(r.v, r.Ebody || 0),"],
  ['M41-throwBlast-drag', "const drag = o && o.coolFlight ? 0 : shock(r.v, (k < 1 && r.dragLoss0 != null ? r.dragLoss0 : r.dragLoss != null ? r.dragLoss : r.Eobj) * k);", "const drag = o && o.coolFlight ? 0 : shock(r.v, (r.dragLoss0 != null ? r.dragLoss0 : r.dragLoss != null ? r.dragLoss : r.Eobj * 0.9) * k);"],
  ['M42-passenger', "PASSENGER.dragG(o.obj, r.v) * dragFactor(o) > PASSENGER.noHarm(1)", "PASSENGER.dragG(o.obj, r.v) * 0.5 > PASSENGER.noHarm(1)"],
  ['M43-roundTrip', "L.catch && !L.catch.carried && !L.bursts", "L.catch && !(L.catch.uAfter > 0.1) && !L.bursts"],
  ['M44-stomp-shake-hole', "2 * ((o.unbreakable && r.realHole != null ? r.realHole : r.holeDepth) || 0) / r.vFoot", "2 * ((r.realHole != null ? r.realHole : r.holeDepth * 2) || 0) / r.vFoot"],
  ['M45-catch-miss', "if (fast) out.miss = {", "if (fast || out.vArrive > 0.01 * K.c) out.miss = {"],
  ['M46-aimHard-dragK', "Rn: noseRadius(obj), dragK: obj.dragK });\n      const ok = (f) =>", "Rn: noseRadius(obj), dragK: 0.999 });\n      const ok = (f) =>"],
];
const out = [];
for (const [id, a, b] of M) {
  const n = src.split(a).length - 1;
  if (n !== 1) { console.log('SKIP', id, 'occurs', n); continue; }
  fs.writeFileSync('mut/' + id + '.js', src.replace(a, b));
  out.push(id);
}
fs.writeFileSync('mut/list.txt', out.join('\n') + '\n');
console.log(out.length, 'mutants');
