const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = global.window.DINO_DATA;
const g = P.K.g;
const surf = (id) => D.surfaces.find(s => s.id === id);
const obj = (id) => D.objects.find(o => o.id === id);
const body = P.makeBody({});
const ctxOf = (liftKg, sid, extra) => Object.assign({ F: liftKg * g, mode: 'comic', body, surface: surf(sid), groundHolds: false, anchor: 'friction' }, extra || {});

// Independent exact static balance for dino body (mass mA) stationary, object mB moving along line,
// hands supply along-line F and perpendicular P = mB g cos(th).
function trueR(bodyM, armMass, objM, th, s, anchor) {
  const mA = bodyM - armMass, mB = objM + armMass;
  const Nmax = s.qult * 2 * body.footArea;
  const sin = Math.sin(th), cos = Math.cos(th);
  // N = mA g + F sin + mB g cos^2 ; demand = F cos - mB g sin cos
  let Rbear = Infinity;
  if (sin > 1e-9) Rbear = Math.max(0, (Nmax - mA * g - mB * g * cos * cos) / sin);
  const dig = anchor === 'braced' ? s.shear * body.digArea : 0;
  let Rhor;
  if (cos <= 1e-9) Rhor = Infinity;
  else if (cos - s.mu * sin <= 0) Rhor = Infinity;
  else Rhor = (s.mu * (mA * g + mB * g * cos * cos) + dig + mB * g * sin * cos) / (cos - s.mu * sin);
  return { R: Math.min(Rbear, Rhor), Rbear, Rhor };
}

// 1) Static hold overhead: tank at 90 deg on concrete
{
  const o = obj('tank'), s = surf('concrete');
  const th = Math.PI / 2;
  const anc = P.anchorCapacity({ body, surface: s, theta: th, anchor: 'friction', groundHolds: false, extraMass: o.m });
  const W = o.m * g;
  console.log('--- Tank held overhead (90deg) on concrete');
  console.log('Nmax', (s.qult * 2 * body.footArea).toExponential(4), 'engine R', anc.R.toExponential(4), 'tank weight', W.toExponential(4), 'ratio W/R', (W / anc.R).toFixed(3));
  // what engine implicitly loads on ground for F = W:
  console.log('engine ground load at F=W:', ((body.m + o.m) * g + W).toExponential(4), ' true:', ((body.m + o.m) * g).toExponential(4));
  const L = P.lift(ctxOf(425000, 'concrete'), o);
  console.log('lift() groundRatio', L.groundRatio.toFixed(3));
  const hands = 2, armMass = hands * body.handEff;
  console.log('true R', trueR(body.m, armMass, o.m, th, s).R.toExponential(4));
}

function throwCase(objId, sid, liftKg, deg, mode) {
  const o = obj(objId), s = surf(sid);
  const c = ctxOf(liftKg, sid, { mode: mode || 'comic' });
  const r = P.throwObject(c, o, deg);
  const th = deg * Math.PI / 180;
  const hands = o.m > 20 ? 2 : 1;
  const style = o.m <= 1 ? 'whip' : 'push';
  const armMass = hands * (style === 'whip' ? body.whipEff : body.handEff);
  const mB = o.m + armMass, mA = body.m - armMass;
  const RB = mB * g * Math.sin(th);
  const tr = trueR(body.m, armMass, o.m, th, s);
  const key = style === 'whip' ? 'throwWhip' : 'throwPush';
  const pushFixed = P.pushApart({ F: r.F, d: style === 'whip' ? body.strokes.whip : body.strokes.throw, mA, mB, RA: tr.R, RB, mode: c.mode, vmax: P.MUSCLE[key].vmax * body.s });
  const pushFixAlt = P.pushApart({ F: r.F, d: style === 'whip' ? body.strokes.whip : body.strokes.throw, mA, mB, RA: r.anchor.R + RB, RB, mode: c.mode, vmax: P.MUSCLE[key].vmax * body.s });
  console.log(`--- ${objId} ${deg}deg on ${sid}, lift ${liftKg} kg, ${c.mode}`);
  console.log(` F=${r.F.toExponential(4)} engine R=${r.anchor.R.toExponential(4)} (${r.anchor.limit}) trueR=${tr.R.toExponential(4)} ratio=${(tr.R / r.anchor.R).toFixed(3)} R+RB=${(r.anchor.R + RB).toExponential(4)}`);
  console.log(` engine: recoil ${r.recoilV.toFixed(3)} m/s, obj ${r.v.toFixed(4)} m/s, range ${r.flight.range.toFixed(3)} m`);
  console.log(` fixed : recoil ${pushFixed.vA.toFixed(3)} m/s, obj ${pushFixed.vB.toFixed(4)} m/s ; alt fix obj ${pushFixAlt.vB.toFixed(4)}`);
}
throwCase('tank', 'concrete', 425000, 45);
throwCase('tank', 'concrete', 425000, 60);
throwCase('tank', 'concrete', 425000, 90);
throwCase('bus', 'asphalt', 120000, 70);
throwCase('car', 'concrete', 511, 45);
throwCase('car', 'concrete', 10000, 45);
throwCase('tank', 'concrete', 425000, 45, 'real');
throwCase('tank', 'granite', 425000, 45);
