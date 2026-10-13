global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js'); require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
const s = D.surfaces.find((x) => x.id === 'concrete');
for (const lg of [5, 6, 7, 8]) for (const src of ['sprint', 'jump']) {
  const base = { F: Math.pow(10, lg) * g, mode: 'comic', surface: s, airAbsorb: 1, keepForm: true, ownRecoil: true };
  const cA = Object.assign({}, base, { body: ollie, anchor: 'friction', unbreakable: false }), cB = Object.assign({}, base, { body: rex, anchor: 'bolted', unbreakable: false });
  const r1 = P.collide(cA, cB, { source: src, toGround: true }), r0 = P.collide(cA, cB, { source: src });
  const src1 = r1.toGround ? P.impulseSource(s, r1.toGround.J, r1.toGround.T) : null;
  console.log(lg, src, r1.outcome, 'toGround', r1.toGround && r1.toGround.J.toPrecision(3), 'plaster5m', src1 ? P.plasterOver(src1, 5) : null, 'rock rT', r1.rock && r1.rock.rT, 'noOpt toGround', !!r0.toGround);
}
