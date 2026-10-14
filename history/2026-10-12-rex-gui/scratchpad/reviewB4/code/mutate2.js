const fs = require('fs');
const src = fs.readFileSync('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js', 'utf8');
const M = [
  ['N47-easyPush-arm', "const d = strokeOf(body, obj), armMass = hands * (style === 'whip' ? body.whipEff : body.handEff);\n      const mB = obj.m + armMass, mA = body.m - armMass, t = th * Math.PI / 180, RB = mB * K.g * Math.sin(t);\n      const anc = anchorCapacity({ body, surface: ctxT.surface, theta: t, anchor: ownAnchor(ctxT)", "const d = strokeOf(body, obj), armMass = 1.5 * hands * (style === 'whip' ? body.whipEff : body.handEff);\n      const mB = obj.m + armMass, mA = body.m - armMass, t = th * Math.PI / 180, RB = mB * K.g * Math.sin(t);\n      const anc = anchorCapacity({ body, surface: ctxT.surface, theta: t, anchor: ownAnchor(ctxT)"],
  ['N48-pull-usable', "let usable = Math.min(driveStrength(ctx), anc.R);", "let usable = Math.min(driveStrength(ctx), anc.R * 1.01);"],
  ['N53-stomp-hole', "{ hole: penetrationDepth(mB, body.footArea, vFoot, qult, rhoT), crater: { D: 0 } }", "{ hole: penetrationDepth(mB, 1.1 * body.footArea, vFoot, qult, rhoT), crater: { D: 0 } }"],
  ['N56-leg-heat', "dK > 0 ? fl.maxStagT : K.T0", "dK > 1 ? fl.maxStagT : K.T0"],
  ['N59-wellRun-rad', "Math.pow(K.T0, 4)) * dt * dK;", "Math.pow(K.T0, 4)) * dt * dK * 0.5;"],
  ['N60-fireball-rBlast', "const r = Math.max(D - (kAir < 1 ? out.sweepK : sweep), body.H);", "const r = Math.max(D - (kAir <= 1 ? sweep * 1.1 : sweep), body.H);"],
  ['N63-throwHand-always', "const h = anyPower(o) ? throwHand(r, o) : null, hand = h ? h.E : 0;", "const h = throwHand(r, o), hand = h ? h.E : 0;"],
  ['N69-holdsGround-bolted', "const holdsGround = (c) => !!(c && (c.groundHolds || c.unbreakable));", "const holdsGround = (c) => !!(c && (c.groundHolds || c.unbreakable || (c.anchor === 'bolted' && c.F > 1e14)));"],
  ['N70-recoilOf-easy', "if (p) v = p.stalled ? 0 : momentumToV(Math.max(0, p.pA - p.pB * e.armMass / Math.max(e.mB, 1e-300)), body.m);", "if (p) v = p.stalled ? 0 : momentumToV(Math.max(0, p.pA - 0.9 * p.pB * e.armMass / Math.max(e.mB, 1e-300)), body.m);"],
  ['N71-throw-shakeFrom', "if (!((o.ownRecoil || o.unbreakable) && r.toGround)) return 'landing';", "if (!r.toGround) return r.flight && !r.flight.landed ? 'him' : 'landing';"],
  ['N72-leg-shockPa', "out.shockPa = out.vArrive > K.a0 ? rhoAt(hStop) * g2 * out.vArrive * out.vArrive * dK : 0;", "out.shockPa = out.vArrive > K.a0 ? rhoAt(hStop) * g2 * out.vArrive * out.vArrive * dK * 1.01 : 0;"],
  ['N73-tossObj', "const dK = dragFactor(ctxT), obj0 = partnerAsObject(bP, name), obj = dK < 1 ? Object.assign(obj0, { dragK: dK }) : obj0;", "const dK = dragFactor(ctxT), obj0 = partnerAsObject(bP, name), obj = Object.assign(obj0, { dragK: dK });"],
];
const out = [];
for (const [id, a, b] of M) { const n = src.split(a).length - 1; if (n !== 1) { console.log('SKIP', id, n); continue; } fs.writeFileSync('mut/' + id + '.js', src.replace(a, b)); out.push(id); }
fs.writeFileSync('mut/list2.txt', out.join('\n') + '\n');
console.log(out.length);
