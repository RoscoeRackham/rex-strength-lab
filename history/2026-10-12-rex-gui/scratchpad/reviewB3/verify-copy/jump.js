const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const surface = D.surfaces.find(s => s.id === 'concrete');
for (const kg of [1e10, 1e14]) for (const unb of [true, false]) {
  const ctx = { F: kg * P.K.g, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: unb, ownRecoil: true };
  const r = P.jump(ctx);
  const o = Object.assign({}, ctx, { near: P.RESTRAINT.R.NEAR });
  const bl = P.RESTRAINT.MOVES.jump.blast(r, o);
  const f = r.flight;
  const PEapex = f.escaped ? NaN : body.m * P.K.g * f.apex / (1 + f.apex / 6.371e6);
  console.log(kg.toExponential(), 'unb', unb, 'v', r.v.toFixed(0), 'Ebody', r.Ebody.toExponential(3), 'Eground', r.Eground.toExponential(3), 'blast', bl, 'apex', f.apex, 'escaped', f.escaped, 'vac apex', r.vacuumApex, 'air loss ~', (r.Ebody - PEapex).toExponential(3), 'topArea', body.topArea, 'flight keys', Object.keys(f).join(','));
}
