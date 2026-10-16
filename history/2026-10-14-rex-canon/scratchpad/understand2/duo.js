const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js'); global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const g = P.K.g, rex = P.makeBody({ build: 'rex', H: 3.048, m: 3000 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3000 });
const surf = D.surfaces.find(s => s.id === 'concrete');
const ctx = (kg, extra) => Object.assign({ F: kg * g, mode: 'comic', body: rex, surface: surf, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true }, extra || {});
const obj = (id) => D.objects.find(o => o.id === id);
const ppv = (c, x) => x ? P.ppvAt(P.impulseSource(c.surface, x.J, Math.max(1e-9, x.T)), 5) * 1000 : null;
const plaster = (c, x) => x ? P.plasterOver(P.impulseSource(c.surface, x.J, Math.max(1e-9, x.T)), 5) : false;
// shove, all-out at 1e8
const cR = ctx(1e8), cO = Object.assign({}, ctx(1e8), { body: ollie });
const sh = P.shove(cR, cO);
console.log('shove 1e8 toGround', sh.toGround && sh.toGround.J, 'ppv5', ppv(cR, sh.toGround), 'plaster', plaster(cR, sh.toGround), 'toGroundB', sh.toGroundB);
// catch car hard 1e9
const cR9 = ctx(1e9), cO9 = Object.assign({}, ctx(1e9), { body: ollie });
const L = P.catchLeg(cR9, cO9, obj('car'), 10, 'hard');
console.log('catch car 1e9 D10', L.result, 'T', L.toGroundT && L.toGroundT.J, ppv(cR9, L.toGroundT), plaster(cR9, L.toGroundT), 'C', L.toGroundC && L.toGroundC.J, ppv(cR9, L.toGroundC), plaster(cR9, L.toGroundC));
// wrestle throw 1e8
const tp = P.throwPartner(cR, cO, 30);
const M = P.RESTRAINT.MOVES.throw;
const mo = { obj: tp.obj, surface: surf, body: rex, anchor: 'friction', angle: 30, near: 5, airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const landS = tp.landToGround ? P.impulseSource(surf, tp.landToGround.J, tp.landToGround.T) : M.landShake(tp.r, mo);
console.log('wrestle throw 1e8: v', tp.r.v, 'land ppv', landS && P.ppvAt(landS, 5) * 1000, 'land plaster', landS && P.plasterOver(landS, 5), 'own', ppv(cR, tp.r.toGround), plaster(cR, tp.r.toGround));
// throw car default dial 100 short tons all-out: shakeFrom
const cT = ctx(90718.474);
const r = P.throwObject(cT, obj('car'), 45);
const o = { obj: obj('car'), angle: 45, surface: surf, body: rex, near: 5, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
console.log('throw car all-out default: shakeFrom', M.shakeFrom(r, o), 'own ppv', ppv(cT, r.toGround), 'land ppv', P.ppvAt(M.landShake(r, o), 5) * 1000, 'sinkRatioRaw', r.sinkRatioRaw);
// pull default
const pl = P.pull(cT, obj('car'));
const ps = P.RESTRAINT.MOVES.pull.shake(pl, Object.assign({}, o, { obj: obj('car') }));
console.log('pull car all-out: shake ppv5', ps && P.ppvAt(ps, 5) * 1000);
