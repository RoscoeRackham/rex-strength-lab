global.window = {};
const R = '/home/user/rex-strength-lab/rex-strength-lab/';
const P = require(R + 'src/engine.js'); require(R + 'src/data.js');
const D = window.DINO_DATA, g = P.K.g, obj = (id) => D.objects.find((o) => o.id === id), surf = (id) => D.surfaces.find((s) => s.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const c = (F, s, x) => Object.assign({ F, mode: 'comic', body: rex, surface: surf(s), anchor: 'friction' }, ON, x || {});
for (const h of [10, 100, 1000]) {
  const Te = P.tossPartner(c(1e7 * g, 'sand'), ollie, 'Ollie', 'easy', h, 'friction');
  // the same toss as a Throw-tab throw at the speed needed: what the ground can bear over the push
  const qA = P.qultFor(surf('sand'), rex.footB) * 2 * rex.footArea;
  const T = Te.toGroundT.T, v = Te.v, F = ollie.m * v / T + (rex.m + ollie.m) * g;
  console.log('easy toss to', h, 'm on sand: v', v.toPrecision(3), 'toGroundT', JSON.stringify(Te.toGroundT), 'mean down force over T', F.toPrecision(3), 'N vs bearing', qA.toPrecision(3), 'N -> ratio', (F / qA).toPrecision(3), 'catch toGroundC', JSON.stringify(Te.toGroundC));
}
// catch game easy on sand: thrower's push (throwPushJ) - any cap?
const L = P.catchLeg(c(1e7 * g, 'sand'), Object.assign(c(1e7 * g, 'sand'), { body: ollie }), obj('piano'), 100, 'easy');
console.log('catch piano easy 100 m sand: aim', L.aim && L.aim.thetaDeg.toPrecision(3), 'vL', L.aim && L.aim.vL.toPrecision(3), 'toGroundT', JSON.stringify(L.toGroundT));
{
  const Te = P.tossPartner(c(1e7 * g, 'sand'), ollie, 'Ollie', 'easy', 1000, 'friction'), Th = P.tossPartner(c(1e7 * g, 'sand'), ollie, 'Ollie', 'hard', 1000, 'friction');
  const tO = P.throwObject(c(1e7 * g, 'sand'), Object.assign(P.partnerAsObject(ollie, 'Ollie'), {}), 90);
  const s = surf('sand'), pr = (x) => x ? P.plasterReach(P.impulseSource(s, x.J, x.T)) : 0;
  console.log('easy 1 km toss: toGroundT plaster reach', pr(Te.toGroundT).toPrecision(3), 'm; hard toss toGroundT', JSON.stringify(Th.toGroundT), 'reach', pr(Th.toGroundT).toPrecision(3), '; throwObject(90) toGround', JSON.stringify(tO.toGround));
  // capped like throwOnce: vertical part / sinkRatio over T
  const J = Te.toGroundT.J, T = Te.toGroundT.T, over = (ollie.m * Te.v / T + (rex.m + ollie.m) * g) / (P.qultFor(s, rex.footB) * 2 * rex.footArea);
  console.log('if capped by its own sinkRatio (~' + over.toPrecision(3) + '): J', (J / over).toPrecision(3), 'reach', pr({ J: J / over, T }).toPrecision(3), 'm');
}
