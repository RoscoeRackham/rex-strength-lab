global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
const surf = (id) => D.surfaces.find(s => s.id === id);
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
function run(kg, th, sid, pw, label) {
  const sf = surf(sid);
  const cA = Object.assign({ F: kg * g, mode: 'comic', body: rex, surface: sf, anchor: 'friction' }, pw);
  const cB = Object.assign({}, cA, { body: ollie });
  const t = P.throwPartner(cA, cB, th);
  const f = t.r.flight;
  const mo = { obj: t.obj, surface: sf, body: rex, anchor: 'friction', angle: th, near: 5, airAbsorb: pw.airAbsorb, keepForm: pw.keepForm, unbreakable: pw.unbreakable, ownRecoil: pw.ownRecoil };
  const landS = t.landToGround ? P.impulseSource(sf, t.landToGround.J, t.landToGround.T) : P.RESTRAINT.MOVES.throw.landShake(t.r, mo);
  const J = P.vToMomentum(f.vImpact, ollie.m), T = Math.max(1e-3, t.obj.L / f.vImpact);
  // the finding's fix: sideways whole (bolted override true)
  const a = f.impactAngleDeg * Math.PI / 180;
  const Nmax = P.qultFor(sf, ollie.footB) * 2 * ollie.footArea, W = ollie.m * g, Jd = J * Math.sin(a), Jh = J * Math.cos(a);
  const fixJ = Math.hypot(Jh, Math.min(Jd, Math.max(0, Nmax - W) * T));
  const fixS = P.impulseSource(sf, fixJ, T);
  const p = (s) => s ? `ppv5=${P.ppvAt(s, 5).toFixed(2)}mm/s plaster=${P.plasterReach(s).toFixed(2)}m` : 'none';
  console.log(`${label} ${sid} dial=${(kg/907.18474).toFixed(0)}st th=${th}: range=${f.range.toFixed(1)} v=${f.vImpact.toFixed(2)} ang=${f.impactAngleDeg.toFixed(1)}; ground J=${t.landToGround ? t.landToGround.J.toFixed(0) : J.toFixed(0)} ${p(landS)} | uncapped-side J=${fixJ.toFixed(0)} ${p(fixS)}`);
}
for (const [kg, th] of [[100*907.18474,45],[100*907.18474,30],[100*907.18474,10],[100*907.18474,60],[1000*907.18474,45],[1e4*907.18474,45]]) {
  run(kg, th, 'concrete', OFF, 'OFF');
  run(kg, th, 'concrete', ON, 'ON ');
}
