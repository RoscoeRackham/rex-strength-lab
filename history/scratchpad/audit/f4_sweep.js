const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = global.window.DINO_DATA;
const g = P.K.g;
const body = P.makeBody({});
console.log('comicFrac throwPush', P.MUSCLE.throwPush.comicFrac);
function fixedR(c, o, deg) {
  // corrected: R = (unclamped engine R) + RB, clamped >= 0
  const th = deg * Math.PI / 180;
  const hands = o.m > 20 ? 2 : 1; const style = o.m <= 1 ? 'whip' : 'push';
  const armMass = hands * (style === 'whip' ? body.whipEff : body.handEff);
  const mA = body.m - armMass, mB = o.m + armMass;
  const s = c.surface, sin = Math.sin(th), cos = Math.cos(th);
  if (c.anchor === 'bolted') return Infinity;
  const Nmax = c.groundHolds ? Infinity : s.qult * 2 * body.footArea;
  let Rbear = Infinity;
  if (sin > 1e-9) Rbear = Math.max(0, (Nmax - mA * g - mB * g * cos * cos) / sin);
  const dig = c.anchor === 'braced' ? s.shear * body.digArea : 0;
  let Rhor = Infinity;
  if (cos > 1e-9 && cos - s.mu * sin > 0) Rhor = (s.mu * (mA * g + mB * g * cos * cos) + dig + mB * g * sin * cos) / (cos - s.mu * sin);
  return { R: Math.min(Rbear, Rhor), mA, mB, armMass, RB: mB * g * sin, key: style === 'whip' ? 'throwWhip' : 'throwPush', d: style === 'whip' ? body.strokes.whip : body.strokes.throw };
}
let flips = 0, total = 0, big = [];
for (const t of D.tiers) for (const o of D.objects.filter(x => !x.noThrow)) for (const s of D.surfaces) for (const anchor of ['friction', 'braced']) for (const mode of ['comic', 'real']) for (const deg of [15, 30, 45, 60, 75, 90]) {
  if (!isFinite(t.liftKg)) continue;
  const c = { F: t.liftKg * g, mode, body, surface: s, groundHolds: false, anchor };
  const r = P.throwObject(c, o, deg);
  const fx = fixedR(c, o, deg);
  const push = P.pushApart({ F: r.F, d: fx.d, mA: fx.mA, mB: fx.mB, RA: fx.R, RB: fx.RB, mode, vmax: P.MUSCLE[fx.key].vmax * body.s });
  total++;
  const chipE = r.canMove ? (r.recoilV > 0.01 ? 'gives' : 'holds') : 'nomove';
  const chipF = (!push.stalled && push.vB > 0) ? (push.vA > 0.01 ? 'gives' : 'holds') : 'nomove';
  const ratio = push.vB / r.v;
  if (chipE !== chipF || (r.v > 0 && (ratio > 2 || ratio < 0.5)) || (r.v === 0 && push.vB > 0)) {
    flips++;
    big.push(`${t.id} ${o.id} ${s.id} ${anchor} ${mode} ${deg}deg: engine ${chipE} v=${r.v.toPrecision(3)} recoil=${r.recoilV.toPrecision(3)} | fixed ${chipF} v=${push.vB.toPrecision(3)} recoil=${push.vA.toPrecision(3)}`);
  }
}
console.log(`${flips}/${total} cases change chip or launch speed by >2x`);
console.log(big.join('\n'));
