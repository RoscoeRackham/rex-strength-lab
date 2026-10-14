const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const ollie = P.makeBody({ build: 'ollie', H: 3.06, m: 3007 });
const sand = D.surfaces.find(s => s.id === 'sand');
const g = P.K.g;
const ctx = (kg, o) => Object.assign({ F: kg * g, mode: 'comic', body: rex, surface: sand, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true }, o || {});
const qult = (sand.granular ? sand.qult * rex.footB / sand.Bref : sand.qult);
const Nmax = qult * 2 * rex.footArea;
console.log('Nmax', Nmax.toFixed(0), 'Rex+Ollie weight', ((rex.m + ollie.m) * g).toFixed(0));
console.log(Object.keys(P).filter(k => /toss|catch|duo/i.test(k)));
const tp = P.tossPartner || (P.CATCH && P.CATCH.tossPartner);
const r = tp(ctx(1e5), ollie, 'Ollie', 'easy', 10, 'friction');
console.log('result', r.result, 'v', r.v, 'toGroundT', r.toGroundT, 'toGroundC', r.toGroundC, 'sinkRatioRaw C', r.catch && r.catch.sinkRatioRaw);
const T = r.toGroundT;
const src = P.impulseSource(sand, T.J, T.T);
console.log('toss push ppv@5m mm/s', (P.ppvAt(src, 5) * 1000).toFixed(2), 'reach 1mm/s?', P.ppvReach(src, 0.001).toFixed(1));
const srcC = P.impulseSource(sand, r.toGroundC.J, r.toGroundC.T);
console.log('catch ppv@5m mm/s', (P.ppvAt(srcC, 5) * 1000).toFixed(2));
// what Ollie momentum is
console.log('Ollie p at v', (ollie.m * r.v).toFixed(0));
// powers off
const r0 = tp(ctx(1e5, { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false }), ollie, 'Ollie', 'easy', 10, 'friction');
console.log('powers off result', r0.result, r0.toGroundT, r0.toGroundC);
const rU = tp(ctx(1e5, { ownRecoil: false }), ollie, 'Ollie', 'easy', 10, 'friction');
console.log('unbreakable only result', rU.result, rU.toGroundT, rU.toGroundC);
