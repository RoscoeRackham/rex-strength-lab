// check the proposed fix (average of 1/v at the two ends) and the round trip using the engine's legs
global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js'); require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, K = P.K, obj = D.objects.find((x) => x.id === 'baseball');
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
const conc = D.surfaces.find((s) => s.id === 'concrete');
const ctx = (kg, body, share) => ({ F: kg * K.g, mode: 'comic', body, surface: conc, anchor: 'friction', airAbsorb: share, keepForm: true, unbreakable: true, ownRecoil: true });
const cR = ctx(1e15, rex, 0.5), cO = ctx(1e15, ollie, 0.5);
const g = P.catchGame(cR, cO, obj, 1000, 'hard');
const fix = (L) => 0.5 * L.chord * (1 / L.aim.vL + 1 / L.vArrive);
console.log({ aTime: g.a.time, bTime: g.b.time, round: g.round, aFix: fix(g.a), bFix: fix(g.b), strokeA: g.a.catch.forced ? g.a.catch.tStroke : 0, strokeB: g.b.catch.forced ? g.b.catch.tStroke : 0, tPush: [g.a.tPush, g.b.tPush], kAirField: g.a.sheath, sheathKAir: undefined });
