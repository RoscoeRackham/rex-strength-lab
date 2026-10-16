// The game of catch with a person: catchPassengerG as the page computes it (main), and with PR3's order (SP first)
global.window = {};
const ROOT = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/main-tree/rex-strength-lab';
const P = require(ROOT + '/src/engine.js'); require(ROOT + '/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const sig = (x, n = 3) => (typeof x !== 'number' || !isFinite(x) ? String(x) : Number(x.toPrecision(n)));
const rex = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex }), ollie = P.makeBody({ build: 'ollie', ...P.DEFAULT_BODIES.ollie });
const o = D.objects.find((x) => x.id === 'person'), CAUGHT = ['caught', 'wreckage', 'slams', 'cant-hold-it'];
function pg(L, cT, sp, newOrder) {
  if (!o.passenger || !L || !L.aim) return null;
  if (newOrder && sp) return null;
  const dg = P.PASSENGER.dragG(o, L.aim.vL) * P.dragFactor(cT);
  if (dg > P.PASSENGER.noHarm(1)) return { over: true, where: 'drag', n: sig(dg) };
  if (sp || !(L.tPush > 0)) return null;
  const nL = P.PASSENGER.felt(L.aim.vL / L.tPush / g, L.aim.thetaDeg || 0);
  if (nL > P.PASSENGER.noHarm(L.tPush)) return { over: true, where: 'throw', n: sig(nL), t: sig(L.tPush) };
  const k = L.catch;
  if (!k || !CAUGHT.includes(L.result)) return { over: false, where: 'throw', n: sig(nL) };
  const first = k.firstShare > 0.5, n = first ? k.F1[0] / (o.m * g) : k.decelG, t = first ? k.tContact[1] : k.tStroke;
  return { over: n > P.PASSENGER.noHarm(t), where: 'catch', n: sig(n), t: sig(t) };
}
for (const air of [1, 0]) for (const [Dd, style] of [[10, 'easy'], [10, 'hard'], [1000, 'easy']]) {
  const pw = { airAbsorb: air, keepForm: true, unbreakable: true, ownRecoil: true };
  const cR = Object.assign({ F: 100 * 907.18474 * g, mode: 'comic', body: rex, surface: D.surfaces.find((s) => s.id === 'concrete'), anchor: 'friction' }, pw), cO = Object.assign({}, cR, { body: ollie });
  const L = P.catchLeg(cR, cO, o, Dd, style);
  console.log(JSON.stringify({ air, Dd, style, result: L.result, vL: sig(L.aim && L.aim.vL), tPush: sig(L.tPush), vArrive: sig(L.vArrive), main_SPoff: pg(L, cR, false, false), main_SPon: pg(L, cR, true, false), pr3_SPon: pg(L, cR, true, true) }));
}
