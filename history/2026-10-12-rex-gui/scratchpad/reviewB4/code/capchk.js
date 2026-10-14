global.window = {};
const R = '/home/user/rex-strength-lab/rex-strength-lab/';
const P = require(R + 'src/engine.js'); require(R + 'src/data.js');
const D = window.DINO_DATA, g = P.K.g, obj = (id) => D.objects.find((o) => o.id === id), surf = (id) => D.surfaces.find((s) => s.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const c = (F, s, x) => Object.assign({ F, mode: 'comic', body: rex, surface: surf(s), anchor: 'friction' }, ON, x || {});
// throw on sand: weak ground cap
const t = P.throwObject(c(1e7 * g, 'sand'), obj('bus'), 60);
console.log('throw bus 60deg sand 1e7 kg dial: sinkRatioRaw', t.sinkRatioRaw.toPrecision(3), 'toGround', JSON.stringify(t.toGround));
// catch on sand
const L = P.catchLeg(c(1e6 * g, 'sand'), Object.assign(c(1e6 * g, 'sand'), { body: ollie }), obj('car'), 30, 'hard');
console.log('catch car 30m hard sand 1e6: result', L.result, 'sinkRatioRaw', L.catch && L.catch.sinkRatioRaw, 'toGroundC', JSON.stringify(L.toGroundC));
// toss on sand
const T = P.tossPartner(c(1e6 * g, 'sand'), ollie, 'Ollie', 'hard', 10, 'friction');
console.log('toss hard sand 1e6: result', T.result, 'sinkRatioRaw', T.catch && T.catch.sinkRatioRaw, 'toGroundC', JSON.stringify(T.toGroundC), 'toGroundT', JSON.stringify(T.toGroundT));
// easy toss (throwPushJ, easy push)
const Te = P.tossPartner(c(1e6 * g, 'concrete'), ollie, 'Ollie', 'easy', 10, 'friction');
console.log('toss easy concrete: toGroundT', JSON.stringify(Te.toGroundT), 'p of v', P.vToMomentum(Te.v, ollie.m));
