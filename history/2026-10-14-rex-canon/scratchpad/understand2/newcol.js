global.window = {};
const P = require('./engine-pr2.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const sf = (id) => D.surfaces.find((s) => s.id === id), ob = (id) => D.objects.find((o) => o.id === id);
const sig = (x, n = 4) => (typeof x !== 'number' ? String(x) : !isFinite(x) ? String(x) : Number(x.toPrecision(n)));
const F0 = 100 * 907.18474 * g, POW = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3000 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3000 });
const ctx = (extra, b) => Object.assign({ F: F0, mode: 'comic', body: b || rex, surface: sf('concrete'), anchor: 'friction' }, POW, extra || {});
// shove
{ const s = P.shove(ctx(), ctx({}, ollie)); console.log('shove', JSON.stringify({ vB: sig(s.vB), slideB: sig(s.slideB), vA: s.vA, toGround: s.toGround, recoilAbsorbed: s.recoilAbsorbed && sig(s.recoilAbsorbed.J), pB: sig(P.vToMomentum(s.vB, ollie.m)), footB: sig(P.anchorCapacity({ body: ollie, surface: sf('concrete'), theta: 0, anchor: 'friction', groundHolds: true }).R * s.push.t) })); }
// fastball
{ const L = P.catchLeg(ctx({ F: 1e9 * g }), ctx({ F: 1e9 * g }, ollie), ob('baseball'), 10, 'hard');
  console.log('fastball 1e9', JSON.stringify({ result: L.result, vL: sig(L.aim.vL), toGroundT: L.toGroundT, recoilT: L.recoilT && sig(L.recoilT.J), toGroundC: L.toGroundC, recoilC: L.recoilC && sig(L.recoilC.J), slide: L.catch.slide, uAfter: L.catch.uAfter, F: sig(L.catch.F), forced: L.catch.forced, pArr: sig(P.vToMomentum(L.vArrive, ob('baseball').m)), oceanFlightP: L.flight && L.flight.ocean && sig(L.flight.ocean.P), time: sig(L.time) }));
  const G = P.catchGame(ctx({ F: 1e9 * g }), ctx({ F: 1e9 * g }, ollie), ob('baseball'), 10, 'hard'); console.log('  round trip', sig(G.round)); }
{ const L = P.catchLeg(ctx({ F: 1e20 * g }), ctx({ F: 1e20 * g }, ollie), ob('baseball'), 10, 'hard');
  console.log('fastball 1e20', JSON.stringify({ result: L.result, recoilT: L.recoilT && sig(L.recoilT.J), recoilC: L.recoilC && sig(L.recoilC.J), pIn: sig(L.catch.pIn), carried: L.catch.carried, uAfter: L.catch.uAfter, Ecatch: sig(L.catch.Ecatch), toGroundC: L.toGroundC }));
  const G = P.catchGame(ctx({ F: 1e20 * g }), ctx({ F: 1e20 * g }, ollie), ob('baseball'), 10, 'hard'); console.log('  round trip', sig(G.round)); }
// default dial bus 10 m hard (flip)
{ const L = P.catchLeg(ctx(), ctx({}, ollie), ob('bus'), 10, 'hard'); console.log('bus 10 m default', L.result, 'vSlam', sig(L.catch.vSlam), 'uAfter', L.catch.uAfter, 'recoilC', sig(L.recoilC.J), 'pArr', sig(P.vToMomentum(L.vArrive, ob('bus').m))); }
// toss
for (const style of ['easy', 'hard']) { const t = P.tossPartner(ctx(), ollie, 'Ollie', style, 10, 'friction'); console.log('toss', style, JSON.stringify({ result: t.result, v: sig(t.v), toGroundT: t.toGroundT, toGroundC: t.toGroundC, recoilT: t.recoilT && sig(t.recoilT.J), recoilC: t.recoilC && sig(t.recoilC.J), flightTime: sig(t.flight.time), gravityImpulse: sig(ollie.m * g * t.flight.time) })); }
{ const t = P.tossPartner(ctx({ F: 1e6 * g }), ollie, 'Ollie', 'hard', 10, 'friction'); console.log('toss 1e6 hard', JSON.stringify({ recoilT: t.recoilT, recoilC: t.recoilC })); }
// arm pins
for (const [FA, FB] of [[F0, F0 / 2], [1e18 * g, 1e4 * g], [2e3 * g, 1e3 * g]]) { const r = P.armWrestle(ctx({ F: FA }), ctx({ F: FB }, ollie)); const src = r.toGround && P.impulseSource(sf('concrete'), r.toGround.J, r.toGround.T);
  console.log('arm', sig(FA / g), sig(FB / g), r.outcome, JSON.stringify({ toGround: r.toGround && sig(r.toGround.J), T: r.toGround && sig(r.toGround.T), recoil: r.recoilAbsorbed && sig(r.recoilAbsorbed.J), ppv5: src ? sig(P.ppvAt(src, 5) * 1000) : 0 })); }
// wrestle throw
{ const t = P.throwPartner(ctx(), ctx({}, ollie), 45); console.log('wrestle throw 45', JSON.stringify({ v: sig(t.r.v), toGround: t.r.toGround, recoilAbsorbed: t.r.recoilAbsorbed && sig(t.r.recoilAbsorbed.J), landToGround: t.landToGround })); }
{ const t = P.throwPartner(ctx({ F: 1e6 * g }), ctx({ F: 1e6 * g }, ollie), 45); console.log('wrestle throw 45 1e6', JSON.stringify({ v: sig(t.r.v), toGround: t.r.toGround, recoilAbsorbed: t.r.recoilAbsorbed && sig(t.r.recoilAbsorbed.J), landToGround: t.landToGround && { J: sig(t.landToGround.J), supplied: sig(t.landToGround.supplied) } })); }
