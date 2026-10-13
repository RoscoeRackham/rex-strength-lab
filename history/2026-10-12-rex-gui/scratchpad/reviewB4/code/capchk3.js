global.window = {};
const R = '/home/user/rex-strength-lab/rex-strength-lab/';
const P = require(R + 'src/engine.js'); require(R + 'src/data.js');
const D = window.DINO_DATA, g = P.K.g, obj = (id) => D.objects.find((o) => o.id === id), surf = (id) => D.surfaces.find((s) => s.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const c = (F, s, b) => Object.assign({ F, mode: 'comic', body: b || rex, surface: surf(s), anchor: 'friction' }, ON);
const s = surf('sand'), pr = (x) => x ? P.plasterReach(P.impulseSource(s, x.J, x.T)) : 0;
for (const [oid, D0] of [['car', 30], ['piano', 100], ['bus', 30]]) for (const style of ['easy', 'hard']) for (const lg of [5, 7]) {
  const L = P.catchLeg(c(Math.pow(10, lg) * g, 'sand'), c(Math.pow(10, lg) * g, 'sand', ollie), obj(oid), D0, style);
  console.log(oid, D0, style, '1e' + lg, L.result, 'vL', L.aim && L.aim.vL.toPrecision(3), 'toGroundT', L.toGroundT && JSON.stringify({ J: +L.toGroundT.J.toPrecision(3), T: +L.toGroundT.T.toPrecision(3), s: L.toGroundT.supplied && +L.toGroundT.supplied.toPrecision(3) }), 'reachT', pr(L.toGroundT).toPrecision(3), 'reachC', pr(L.toGroundC).toPrecision(3));
}
