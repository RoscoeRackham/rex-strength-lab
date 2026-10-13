global.window = {};
const S = '/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewB2/code';
const P = require(S + '/lab/src/engine.js');
require(S + '/lab/src/data.js');
const D = window.DINO_DATA, g = 9.80665, c = P.K.c;
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const surf = D.surfaces.find((s) => s.id === 'concrete');
for (const oM of [1e18, 1e20, 5e21]) for (const lg of [14, 15, 16]) { const oid = "baseball";
  const b = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), bo = P.makeBody({ build: 'ollie', H: 3.06, m: oM });
  const R = Object.assign({ F: Math.pow(10, lg) * g, mode: 'comic', body: b, surface: surf, anchor: 'friction' }, ON), O = Object.assign({}, R, { body: bo });
  const L = P.catchLeg(R, O, D.objects.find((o) => o.id === oid), 100, 'hard');
  const k = L.catch || {};
  const m = 0.1453, mh = k.mh, gam = 1 / Math.sqrt(1 - (L.vArrive / c) ** 2);
  // stable first-contact heat: (M1 - m - mh) c^2 = 2 (gamma - 1) m mh c^2 / (M1 + m + mh)
  const M1 = mh ? Math.sqrt(m * m + mh * mh + 2 * gam * m * mh) : 0;
  const E1stable = mh ? 2 * (gam - 1) * m * mh * c * c / (M1 + m + mh) : 0;
  console.log('Ollie', oM.toExponential(0), 'dial 1e' + lg, L.result, 'v/c', (L.vArrive / c).toFixed(6), 'mh', mh && mh.toPrecision(3), 'E1', k.E1 && k.E1.toPrecision(4), 'stable E1', E1stable.toPrecision(4), 'Ecatch', k.Ecatch && k.Ecatch.toPrecision(4), 'KE in', P.momentumToKE(k.pIn, m).toPrecision(4), 'firstShare', k.firstShare);
}
