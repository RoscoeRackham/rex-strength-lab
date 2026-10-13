global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const surfId = process.argv[2] || 'concrete', ang = +(process.argv[3] || 45), ownRec = process.argv[4] !== 'norecoil';
const surface = D.surfaces.find(s => s.id === surfId);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
const pw = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: ownRec };
const M = P.RESTRAINT.MOVES.throw;
console.log('surface', surfId, 'angle', ang, 'ownRecoil', ownRec);
let prev = null;
for (let e = 4; e <= 12.001; e += 0.25) {
  const kg = Math.pow(10, e);
  const cA = Object.assign({ F: kg * P.K.g, mode: 'comic', body: rex, surface, anchor: 'friction' }, pw);
  const cB = Object.assign({ F: kg * P.K.g, mode: 'comic', body: ollie, surface, anchor: 'friction' }, pw);
  const t = P.throwPartner(cA, cB, ang);
  if (!t.r || !t.r.canMove) { console.log(e, 'cannot move'); continue; }
  const mo = { obj: t.obj, surface, body: rex, anchor: 'friction', angle: ang, near: 12, ...pw };
  const landS = t.landToGround ? P.impulseSource(surface, t.landToGround.J, t.landToGround.T) : M.landShake(t.r, mo);
  const ownS = (pw.ownRecoil || pw.unbreakable) && t.r.toGround ? P.impulseSource(surface, t.r.toGround.J, Math.max(1e-9, t.r.toGround.T)) : null;
  const f = t.r.flight || {};
  const Jl = t.landToGround ? t.landToGround.J : (f.vImpact ? P.vToMomentum(f.vImpact, ollie.m) : 0);
  const reach = landS ? P.plasterReach(landS) : 0, ppv5 = landS ? P.ppvAt(landS, 5) : 0;
  const tag = prev && reach < prev - 1e-6 ? '  <-- reach falls' : '';
  console.log(e.toFixed(2), 'v', (t.r.v||0).toFixed(1), 'vImp', (f.vImpact||0).toFixed(1), 'landed', !!f.landed, 'fallsBack', t.fallsBack, 'capped', !!t.landToGround,
    'Jland', Jl.toExponential(3), 'T', t.landToGround ? t.landToGround.T.toExponential(3) : '-', 'reach', reach.toFixed(3), 'ppv5', (ppv5*1000).toFixed(1), 'mm/s',
    'plaster12(all)', P.plasterOver([landS, ownS].filter(Boolean), 12), 'ownReach', ownS ? P.plasterReach(ownS).toFixed(2) : '-', tag);
  prev = reach;
}
