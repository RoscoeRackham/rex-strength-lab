global.window = {};
const M = '/home/user/rex-strength-lab/rex-strength-lab';
const P = require(M + '/src/engine.js'); require(M + '/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const sf = (id) => D.surfaces.find((s) => s.id === id);
const R3 = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex });
const DEF = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: false, noKnockback: true };
const found = [];
for (const ob of D.objects.filter((o) => !o.noThrow)) for (const th of [90, 45]) for (let e = 6; e <= 16; e += 0.5) {
  const c = Object.assign({ F: Math.pow(10, e) * g, mode: 'comic', body: R3, surface: sf('concrete'), anchor: 'friction' }, DEF);
  const r = P.throwObject(c, ob, th);
  if (!r.canMove || r.fallsBack || r.flight.relativistic) continue;
  const f0 = P.fly({ v0: r.vOut, thetaDeg: th, h0: R3.releaseHeight, m: ob.m, A: ob.area, Cd: ob.Cd, CdSup: ob.CdSup });
  if (!f0.landed && !f0.relativistic) { found.push([ob.id, th, e, Math.round(r.v), f0.escaped, f0.orbit, f0.timedOut]); break; }
}
console.log(found.slice(0, 20));
