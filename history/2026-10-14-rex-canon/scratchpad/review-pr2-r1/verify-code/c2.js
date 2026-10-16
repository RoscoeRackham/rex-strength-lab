global.window = {};
const dir = process.argv[2];
const P = require(dir + '/src/engine.js'); require(dir + '/src/data.js'); const D = window.DINO_DATA, g = P.K.g;
const rex = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex }), ollie = P.makeBody({ build: 'ollie', ...P.DEFAULT_BODIES.ollie });
const surf = D.surfaces.find(s => s.id === 'concrete'), obj = id => D.objects.find(x => x.id === id);
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const cx = (F, body, extra) => Object.assign({ F, mode: 'comic', body, surface: surf, anchor: 'friction' }, ON, extra || {});
const pk = (L) => ({ result: L.result, carried: L.catch && L.catch.carried, uAfter: L.catch && L.catch.uAfter, slide: L.catch && L.catch.slide, sinkRatioRaw: L.catch && L.catch.sinkRatioRaw, rAC: L.recoilAbsorbedC, tgC: L.toGroundC, vArrive: L.vArrive });
// (a)/(b) unbounded catch
let L = P.catchLeg(cx(Infinity, rex), cx(Infinity, ollie), obj('baseball'), 10, 'hard');
console.log('a/b inf baseball hard 10m:', JSON.stringify(pk(L)));
const bear = (ollie.m + obj('baseball').m) * g;
// (c) cant-hold-it
L = P.catchLeg(cx(1e5 * g, rex), cx(500 * g, ollie), obj('car'), 30, 'easy');
console.log('c car lob 30m, Ollie 500 kg dial:', JSON.stringify(pk(L)));
// (d) wreckage
L = P.catchLeg(cx(1e6 * g, rex, { keepForm: false }), cx(1e6 * g, ollie, { keepForm: false }), obj('motorcycle'), 10, 'hard');
console.log('d motorcycle hard 10m keepForm off:', JSON.stringify(pk(L)));
