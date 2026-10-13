const path = require('path');
const dir = process.argv[2];
global.window = {}; const P = require(path.join(dir, 'src/engine.js')); require(path.join(dir, 'src/data.js')); const D = window.DINO_DATA;
const g = P.K.g, obj = (id) => D.objects.find((o) => o.id === id), surf = (id) => D.surfaces.find((s) => s.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.06, m: 3007 });
const ctxOf = (F, x) => Object.assign({ F, mode: 'comic', body: rex, surface: surf('concrete'), anchor: 'friction' }, x || {});
// (1) carried-off relativistic catch: energy
{ const cR = ctxOf(200e18 * 907.18474 * g, { airAbsorb: 1, keepForm: true }), cO = Object.assign({}, cR, { body: ollie });
  const L = P.catchLeg(cR, cO, obj('baseball'), 100, 'hard'), k = L.catch, E0 = P.momentumToKE(k.pIn, obj('baseball').m);
  console.log('relCatch carried', k.carried, 'Ecatch+Eride', (k.Ecatch + k.Eride).toExponential(4), 'E0', E0.toExponential(4), 'rel err', ((k.Ecatch + k.Eride - E0) / E0).toExponential(2)); }
// (2) shove with own recoil only
{ const cR = ctxOf(1e6 * g, { ownRecoil: true }), cO = Object.assign({}, cR, { body: ollie });
  const s = P.shove(cR, cO); console.log('shove ownRecoil only toGround', JSON.stringify(s.toGround)); }
// (3) bolted pull with own recoil
{ const c = ctxOf(1e6 * g, { ownRecoil: true, anchor: 'bolted' }), pl = P.pull(c, obj('bus'));
  const sh = P.RESTRAINT.MOVES.pull.shake(pl, { surface: c.surface, body: rex, obj: obj('bus'), ownRecoil: true, anchor: 'bolted' });
  console.log('bolted pull shake', sh ? 'SHAKES ppv@2m ' + P.ppvAt(sh, 2) : 'none'); }
// (4) shakeFrom: bus on concrete with own recoil
{ const M = P.RESTRAINT.MOVES.throw;
  for (const [ob, ang, F] of [['bus', 45, 1e6], ['car', 45, 1e5], ['bus', 45, 1e7], ['car', 0, 1e6]]) {
    const c = ctxOf(F * g, { ownRecoil: true, unbreakable: true, keepForm: true, airAbsorb: 1 });
    const r = P.throwObject(c, obj(ob), ang);
    const o = { near: 5, surface: c.surface, body: rex, obj: obj(ob), angle: ang, ownRecoil: true, unbreakable: true, airAbsorb: 1, anchor: 'friction' };
    console.log('shakeFrom', ob, ang, F, M.shakeFrom(r, o));
  } }
