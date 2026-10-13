global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
const surf = (id) => D.surfaces.find(s => s.id === id);
function land(kg, th, sid, unb) {
  const sf = surf(sid);
  const cA = Object.assign({ F: kg * g, mode: 'comic', body: rex, surface: sf, anchor: 'friction' }, { airAbsorb: 1, keepForm: true, unbreakable: unb, ownRecoil: true });
  const cB = Object.assign({}, cA, { body: ollie });
  const t = P.throwPartner(cA, cB, th);
  const mo = { obj: t.obj, surface: sf, body: rex, anchor: 'friction', angle: th, near: 5, airAbsorb: 1, keepForm: true, unbreakable: unb, ownRecoil: true };
  const s = t.landToGround ? P.impulseSource(sf, t.landToGround.J, t.landToGround.T) : P.RESTRAINT.MOVES.throw.landShake(t.r, mo);
  const f = t.r.flight, J = P.vToMomentum(f.vImpact, ollie.m), T = Math.max(1e-3, t.obj.L / f.vImpact), a = f.impactAngleDeg*Math.PI/180;
  const Nmax = P.qultFor(sf, ollie.footB) * 2 * ollie.footArea, W = ollie.m * g;
  return { t, s, J, T, Jd: J*Math.sin(a), Jh: J*Math.cos(a), downBorne: J*Math.sin(a) <= (Nmax-W)*T, ppv: s ? P.ppvAt(s,5) : 0, pl: s ? P.plasterReach(s) : 0, lg: t.landToGround };
}
const st = 907.18474;
console.log('Only Unbreakable footing toggled (air 100%, keep form, own recoil on), concrete:');
for (const th of [10, 30, 45]) for (const d of [30, 100, 200, 300]) {
  const on = land(d*st, th, 'concrete', true), off = land(d*st, th, 'concrete', false);
  console.log(`th=${th} dial=${d}st: downBorne=${on.downBorne} sideOver=${on.lg ? (on.lg.suppliedSide>0) : false} | unb OFF J=${off.J.toFixed(0)} ppv5=${off.ppv.toFixed(4)} plaster=${off.pl.toFixed(2)}m | unb ON groundJ=${(on.lg?on.lg.J:on.J).toFixed(0)} supplied=${on.lg?on.lg.supplied.toFixed(0):0} (side ${on.lg?on.lg.suppliedSide.toFixed(0):0}) ppv5=${on.ppv.toFixed(4)} plaster=${on.pl.toFixed(2)}m`);
}
console.log('\nMonotonic scan at 10 deg, unb ON (plaster reach vs dial):');
let prev = -1, bad = [];
for (let lg = 3; lg <= 7; lg += 0.02) { const r = land(Math.pow(10, lg), 10, 'concrete', true); if (r.pl < prev - 1e-6) bad.push(`${lg.toFixed(2)}: ${prev.toFixed(2)} -> ${r.pl.toFixed(2)}`); prev = r.pl; }
console.log(bad.length ? bad.slice(0,10).join('\n') : 'monotonic');
