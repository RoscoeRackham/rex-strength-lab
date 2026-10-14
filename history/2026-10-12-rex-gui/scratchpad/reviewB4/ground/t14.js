const { P, D, rex, ollie, surf, obj, ctx, ON } = require('./h.js');
const RS = P.RESTRAINT;
const s = 'sand';
// find efforts so that jump landing speed and stomp foot speed are ~ equal, with Unbreakable on and off
function jumpAt(kg, pw) { const c = Object.assign(ctx(Object.assign({ kg: 1e9, s }, pw)), { use: kg * 9.81 }); const r = P.jump(c); const o = Object.assign({ near: 5, body: rex, surface: surf(s), anchor: 'friction', m: rex.m }, pw); const src = RS.MOVES.jump.shake(r, o); return { r, src }; }
function stompAt(kg, pw) { const c = Object.assign(ctx(Object.assign({ kg: 1e9, s }, pw)), { use: kg * 9.81 }); const r = P.stomp(c); const o = Object.assign({ near: 5, body: rex, surface: surf(s), anchor: 'friction', m: rex.m }, pw); const src = RS.MOVES.stomp.shake(r, o); return { r, src }; }
const UNB = { unbreakable: true };
for (const kg of [2e4, 1e5, 1e6]) {
  const jOn = jumpAt(kg, UNB), jOff = jumpAt(kg, {});
  console.log('jump', kg.toExponential(0), 'on: vLand', jOn.r.landing.v.toFixed(2), 'landRatioReal', (jOn.r.landRatioReal || 0).toFixed(2), 'ppv5', (P.ppvAt(jOn.src, 5) * 1e3).toFixed(2), '| off: vLand', jOff.r.landing.v.toFixed(2), 'ratio', jOff.r.landing.ratio.toFixed(2), 'ppv5', (P.ppvAt(jOff.src, 5) * 1e3).toFixed(2));
}
// same landing speed: power-on jump at effort giving vLand ~ X, vs power-off jump at the same vLand
function findJump(target, pw) { let lo = 3e3, hi = 1e8; for (let i = 0; i < 60; i++) { const mid = Math.sqrt(lo * hi); const v = jumpAt(mid, pw).r.landing.v; if (v < target) lo = mid; else hi = mid; } return jumpAt(hi, pw); }
for (const vt of [4, 6, 10]) {
  const a = findJump(vt, UNB), b = findJump(vt, {});
  console.log('same landing speed', vt, 'm/s: on ppv5', (P.ppvAt(a.src, 5) * 1e3).toFixed(2), 'mm/s (landings only:', (P.ppvAt(a.src.slice(0, 2), 5) * 1e3).toFixed(2), ') ; off ppv5', (P.ppvAt(b.src, 5) * 1e3).toFixed(2), 'mm/s; off landRatio', b.r.landing.ratio.toFixed(2));
}
for (const kg of [2e4, 1e5]) {
  const sOn = stompAt(kg, UNB), sOff = stompAt(kg, {});
  console.log('stomp', kg.toExponential(0), 'vFoot', sOn.r.vFoot.toFixed(1), 'on ppv5', (P.ppvAt(sOn.src, 5) * 1e3).toFixed(2), 'off ppv5', (P.ppvAt(sOff.src, 5) * 1e3).toFixed(2), 'realBreaks', sOn.r.realBreaks);
}
