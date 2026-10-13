global.window = {};
const L = __dirname + '/lab/rex-strength-lab/src/';
const P = require(L + 'engine.js'); require(L + 'data.js'); const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const surface = D.surfaces.find((x) => x.id === 'concrete');
const M = P.RESTRAINT.MOVES.throw;
const rows = [];
for (const obj of D.objects.filter((x) => !x.noThrow)) for (const lg of [12, 15, 18, 21, 25, 30]) for (const s of [0.5, 0.9]) for (const angle of [0, 45, 90]) {
  const c = { F: Math.pow(10, lg) * P.K.g, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: s, keepForm: true, unbreakable: true, ownRecoil: true };
  const r = P.throwObject(c, obj, angle); if (!r.canMove || !r.flight || !r.flight.relativistic || !isFinite(r.Eobj)) continue;
  const o = Object.assign({}, c, { obj, angle, near: 5 });
  const fa = P.fastAir(obj, r.Eobj, angle, 1 - s);
  const b = M.blastParts(r, o); const R = P.RESTRAINT.reach('throw', r, o).air; const Eat = M.blastAt(r, o, R);
  const within = P.fastAirWithin(obj, r.Eobj, angle, 1 - s, R);
  const setBy = Eat === b.path && b.path > within ? 'hand' : Eat === within && within > b.land ? 'air' : 'share';
  const shown = isFinite(fa.dHalf);
  if ((setBy === 'hand' && shown) || (setBy === 'air' && !shown)) rows.push([obj.id, lg, s, angle, setBy, shown ? 'sentence shown' : 'no sentence', (R / 1000).toFixed(0) + ' km', 'from text: ' + (P.blastRadius(shown ? within : b.land, 100) / 1000).toFixed(0) + ' km'].join(' | '));
}
console.log(rows.length); console.log(rows.join('\n'));
