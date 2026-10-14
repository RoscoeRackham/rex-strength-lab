global.window = {}; const P = require('./repo/src/engine.js'); require('./repo/src/data.js'); const D = window.DINO_DATA;
const g = P.K.g, surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
const out = {};
for (const s of [0, 0.5, 0.75, 0.9]) {
  const cR = { F: 1e9 * g, mode: 'comic', body: rex, surface: surf('concrete'), anchor: 'friction', airAbsorb: s, keepForm: true, unbreakable: true, ownRecoil: true }, cO = Object.assign({}, cR, { body: ollie });
  const L = P.catchLeg(cR, cO, obj('car'), 100, 'hard');
  const judged = P.dragFactor(cR) * L.drag.E + (L.hand ? L.hand.E : 0);
  out[s] = { vL: L.aim.vL, airTakes: L.drag.E, judgedObj: P.dragFactor(cR) * L.drag.E, hand: L.hand ? L.hand.E : 0 };
}
for (const s in out) console.log('absorbed', s, 'v', out[s].vL.toPrecision(4), 'air takes (page text)', out[s].airTakes.toPrecision(3), 'J; blast judged from the flight', out[s].judgedObj.toPrecision(3), 'J =', (out[s].judgedObj / out[0].judgedObj).toPrecision(2), 'of 0%; brief (1-share):', (1 - s).toFixed(2), '; hand', out[s].hand.toPrecision(3));
