global.window = {};
const which = process.argv[2];
const P = require(which === 'old' ? './old/engine.js' : '/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, K = P.K;
const obj = (id) => D.objects.find((x) => x.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
const conc = D.surfaces.find((s) => s.id === 'concrete');
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
for (const [kg, sh, Dd, extraO] of [[1e15, 0.5, 1000], [2e13, 0, 11500], [1e15, 0, 11000], [1e17, 0.5, 62], [1e17, 0.5, 1.5e4, { m: 1e20 }]]) {
  const c = Object.assign({ F: kg * K.g, mode: 'comic', body: rex, surface: conc, anchor: extraO ? 'bolted' : 'friction' }, ON, { airAbsorb: sh });
  const oB = extraO ? P.makeBody({ build: 'ollie', H: 3.048, m: extraO.m }) : ollie;
  const L = P.catchLeg(c, Object.assign({}, c, { body: oB, anchor: extraO ? 'bolted' : 'friction' }), obj('baseball'), Dd, 'hard');
  const r0 = P.throwObject(c, obj('baseball'), 0);
  console.log(which, JSON.stringify({ kg, sh, D: Dd, dense: !!extraO, result: L.result, kind: L.fireball && L.fireball.kind, sheath: L.sheath && +L.sheath.share.toPrecision(4), vArr: L.vArrive && +L.vArrive.toPrecision(4), time: L.time && +L.time.toPrecision(4), hgE: L.hitsGround ? +(L.hitsGround.E / r0.Eobj).toPrecision(4) : null }));
}
