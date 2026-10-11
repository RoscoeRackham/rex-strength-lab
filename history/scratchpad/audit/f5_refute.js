const P = require('/home/user/dino-strength-sim/src/engine.js');
const fs = require('fs'), vm = require('vm');
const sb = { window: {} }; vm.createContext(sb);
vm.runInContext(fs.readFileSync('/home/user/dino-strength-sim/src/data.js', 'utf8'), sb);
const D = sb.window.DINO_DATA;
const g = P.K.g;
const body = P.makeBody({ H: 2, m: 180 });
const surf = D.surfaces.find(s => s.id === 'concrete');
const ctx = (kg, mode) => ({ F: kg * g, mode, body, surface: surf, groundHolds: false, anchor: 'friction' });
function check(objId, kg, mode, ang) {
  const o = D.objects.find(x => x.id === objId);
  const r = P.throwObject(ctx(kg, mode), o, ang);
  const hands = r.hands;
  const armMass = hands * (r.style === 'whip' ? body.whipEff : body.handEff);
  const mB = o.m + armMass;
  const pArm = r.push.pB * armMass / mB;
  const pNet = r.push.pA - pArm; // backward momentum of whole dino after arm stops
  const vFix = P.momentumToV(Math.max(0, pNet), body.m);
  const EFix = P.momentumToKE(Math.max(0, pNet), body.m);
  // energy check: total work F*d should equal EA+EB + friction work RA*xA + RB*xB (comic, classical)
  console.log(objId, kg.toExponential(2), mode, ang + 'deg', 'style', r.style, 'arm', armMass.toFixed(3),
    '| engine recoilV', r.recoilV.toFixed(3), 'recoilE', r.recoilE.toExponential(3),
    '| corrected v', vFix.toFixed(3), 'E', EFix.toExponential(3),
    '| ratio v', (r.recoilV / vFix).toFixed(2), 'E', (r.recoilE / EFix).toFixed(1),
    '| Eobj', r.Eobj.toExponential(3), 'engineSays>obj', r.recoilE > r.Eobj, 'fixed>obj', EFix > r.Eobj,
    '| pA', r.push.pA.toExponential(3), 'pArm', pArm.toExponential(3), 'anchorR', r.anchor.R.toExponential(3));
}
for (const ang of [45, 0, 37]) {
  check('baseball', 1e8, 'comic', ang);
  check('shot', 1e8, 'comic', ang);
}
for (const ang of [45, 0]) check('car', 9.07e4, 'comic', ang);
for (const kg of [511, 1e4, 1e5, 1e6, 1e8, 1e10, 1e15]) check('baseball', kg, 'comic', 45);
for (const kg of [511, 1e4, 1e5, 1e6, 1e8]) check('baseball', kg, 'real', 45);
for (const kg of [511, 1e4, 1e5, 1e6, 1e8]) check('shot', kg, 'real', 37);
