const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const sand = D.surfaces.find(s => s.id === 'sand');
const g = P.K.g, M = P.RESTRAINT.MOVES;
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true }, OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
const ctx = (F, o) => Object.assign({ F, mode: 'comic', body, surface: sand, anchor: 'friction' }, o);
const opt = (o) => Object.assign({ surface: sand, body, m: body.m, near: 5 }, o);
const qult = sand.qult * body.footB / sand.Bref, footBear = qult * body.footArea;
console.log('one-foot bearing', footBear.toFixed(0), 'footPulse?', P.limbPulse(body).toFixed(4));
const F0 = 100 * 907.18474 * g;
for (const [lab, pw] of [['on', ON], ['off', OFF]]) {
  const r = P.stomp(ctx(F0, pw));
  const sh = M.stomp.shake(r, opt(pw));
  console.log('stomp', lab, 'vFoot', r.vFoot.toFixed(1), 'realBreaks', r.realBreaks, 'realHole', r.realHole && r.realHole.toFixed(2), 'holeDepth', r.holeDepth.toFixed(3), 'src F peak', sh.F.toFixed(0), 'T', sh.T.toFixed(4), 'ppv5 mm/s', (P.ppvAt(sh, 5) * 1000).toFixed(1), 'plasterReach', P.plasterReach(sh).toFixed(1));
}
// stomp with foot ~15.8 m/s: find dial
let lo = 1e3 * g, hi = F0;
for (let i = 0; i < 60; i++) { const mid = Math.sqrt(lo * hi); const r = P.stomp(ctx(mid, ON)); if (r.vFoot < 15.8) lo = mid; else hi = mid; }
for (const [lab, pw] of [['on', ON], ['off', OFF]]) {
  const r = P.stomp(ctx(hi, pw)); const sh = M.stomp.shake(r, opt(pw));
  console.log('stomp@~15.8', lab, 'vFoot', r.vFoot.toFixed(2), 'ppv5', (P.ppvAt(sh, 5) * 1000).toFixed(2));
}
// jump landing at ~10 m/s: find dial
lo = 1e3 * g; hi = 1e6 * g;
for (let i = 0; i < 60; i++) { const mid = Math.sqrt(lo * hi); const r = P.jump(ctx(mid, ON)); if (!(r.landing && r.landing.v >= 10)) lo = mid; else hi = mid; }
for (const [lab, pw] of [['on', ON], ['off', OFF]]) {
  const r = P.jump(ctx(hi, pw)); const sh = M.jump.shake(r, opt(pw));
  console.log('jump', lab, 'landing v', r.landing.v.toFixed(2), 'ppv5', (P.ppvAt(sh, 5) * 1000).toFixed(2), 'parts', (Array.isArray(sh) ? sh : [sh]).map(x => (P.ppvAt(x, 5) * 1000).toFixed(2)).join(','));
}
// power off: find dial where landing is 10 m/s
lo = 1e3 * g; hi = 1e9 * g;
for (let i = 0; i < 80; i++) { const mid = Math.sqrt(lo * hi); const r = P.jump(ctx(mid, OFF)); if (!(r.landing && r.landing.v >= 10)) lo = mid; else hi = mid; }
{ const r = P.jump(ctx(hi, OFF)); const sh = M.jump.shake(r, opt(OFF)); console.log('jump OFF @10', 'landing v', r.landing.v.toFixed(2), 'ppv5', (P.ppvAt(sh, 5) * 1000).toFixed(2), 'parts', sh.map(x => (P.ppvAt(x, 5) * 1000).toFixed(2)).join(',')); }
const fp = P.limbPulse(body);
console.log('feet blow uncapped at 10 m/s: J', (2 * body.legEff * 10).toFixed(0), 'ppv5', (P.ppvAt(P.impulseSource(sand, 2 * body.legEff * 10, fp), 5) * 1000).toFixed(2), 'landBear*T', ((2 * 20211 - body.m * g) * fp).toFixed(0));
