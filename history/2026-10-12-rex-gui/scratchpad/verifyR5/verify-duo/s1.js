global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
const surf = (id) => D.surfaces.find(s => s.id === id);
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
function run(kg, th, sid, extra) {
  const sf = surf(sid);
  const cA = Object.assign({ F: kg * g, mode: 'comic', body: rex, surface: sf, anchor: 'friction' }, ON, extra || {});
  const cB = Object.assign({}, cA, { body: ollie });
  const t = P.throwPartner(cA, cB, th);
  const f = t.r.flight;
  const offA = Object.assign({}, cA, { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false });
  const toff = P.throwPartner(offA, Object.assign({}, offA, { body: ollie }), th);
  const v = f.vImpact, L = t.obj.L, T = Math.max(1e-3, L / v), J = P.vToMomentum(v, ollie.m);
  const a = f.impactAngleDeg * Math.PI / 180, Jd = J * Math.sin(a), Jh = J * Math.cos(a);
  const q = P.qultFor ? P.qultFor(sf, ollie.footB) : NaN;
  const Nmax = q * 2 * ollie.footArea, W = ollie.m * g;
  const capD = Math.max(0, Nmax - W) * T, capH = sf.mu * Nmax * T;
  console.log(`${sid} kg=${kg.toExponential(2)} th=${th}: range=${f.range && f.range.toFixed(1)} vImp=${v.toFixed(2)} ang=${f.impactAngleDeg.toFixed(1)} T=${(T*1000).toFixed(1)}ms J=${J.toFixed(0)} Jd=${Jd.toFixed(0)} Jh=${Jh.toFixed(0)} Nmax=${(Nmax/1e3).toFixed(0)}kN W=${(W/1e3).toFixed(1)}kN capD=${capD.toFixed(0)} capH=${capH.toFixed(0)} meanFd=${(Jd/T/1e3).toFixed(0)}kN bearBeyondW=${((Nmax-W)/1e3).toFixed(0)}kN`);
  console.log('  landToGround', JSON.stringify(t.landToGround));
  // shaking compare
  const src = (J, T) => P.impulseSource(sf, J, T);
  if (t.landToGround) {
    const sOn = src(t.landToGround.J, t.landToGround.T), sOff = P.RESTRAINT.MOVES.throw.landShake(toff.r, Object.assign({ surface: sf, body: rex }, offA));
    const ppv5 = (s) => s ? P.ppvAt ? P.ppvAt(s, 5) : null : null;
    console.log('  plaster on', P.plasterReach(sOn).toFixed(2), 'off', sOff ? P.plasterReach(sOff).toFixed(2) : sOff, ' off J=', J.toFixed(0));
  }
  // real friction skid: normal force during pulse = Jd/T + W; friction impulse mu*(Jd + W T)
  const fric = sf.mu * (Jd + W * T), rem = Math.max(0, Jh - fric), vrem = rem / ollie.m;
  console.log(`  real friction in pulse ${fric.toFixed(0)}, remaining ${rem.toFixed(0)} -> ${vrem.toFixed(2)} m/s, skid ${(vrem*vrem/(2*sf.mu*g)).toFixed(2)} m`);
  return t;
}
console.log(Object.keys(P).filter(k=>/ppv|plaster|qult|impulse/i.test(k)));
run(100 * 907.18474, 45, 'concrete');
run(100 * 907.18474, 30, 'concrete');
run(100 * 907.18474, 45, 'sand');
run(1e9, 75, 'concrete');
run(1e9, 30, 'concrete');
