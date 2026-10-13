const {P, obj, ctx, rex, ollie, ALL} = require('./load.js');
const KG=+process.argv[2]; for (const id of ['baseball','car','shot']) for (const D of [1e3, 1e4, 1e5, 1e6]) for (const style of ['easy','hard']) for (const s of [0.5, 0]) {
  const cR = ctx(KG, Object.assign({}, ALL, { airAbsorb: s })), cO = Object.assign({}, cR, { body: ollie });
  const L = P.catchLeg(cR, cO, obj(id), D, style);
  if (!L.drag) { console.log(id, D, style, s, L.result); continue; }
  console.log(id, D, style, s, L.result, 'vL', L.aim && L.aim.vL.toFixed(0), 'drag.E', (L.drag.E||0).toExponential(3), 'nearT', (L.drag.nearT||0).toExponential(3), 'nearC', (L.drag.nearC||0).toExponential(3), 'hand', L.hand && L.hand.E.toExponential(3),
    'R(6.9kPa) whole', P.blastRadius(L.drag.E + (L.hand?L.hand.E:0), 6900).toFixed(1), 'near', P.blastRadius(Math.max(L.drag.nearT, L.drag.nearC) + (L.hand?L.hand.E:0), 6900).toFixed(1));
}
