const { P, body, obj, ctx } = require('./load.js');
const ollie = P.makeBody({ build: 'ollie', H: 3.06, m: 3007 });
const bb = obj('baseball'); const c = P.K.c, c2 = c * c;
for (const [F, D, anchor] of [[1e15 * P.K.g, 1000, 'friction'], [1e15 * P.K.g, 1000, 'bolted'], [1e17 * P.K.g, 1000, 'friction'], [1e19 * P.K.g, 5000, 'friction']]) {
  const cR = ctx({ F, airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true });
  const cO = Object.assign({}, cR, { body: ollie, anchor });
  const L = P.catchLeg(cR, cO, bb, D, 'hard');
  const k = L.catch;
  const r0 = P.throwObject(Object.assign({}, cR, { noFlight: true }), bb, L.aim.thetaDeg);
  // independent
  const m = bb.m, E0 = r0.Eobj, gam = 1 + E0 / (m * c2), p = Math.sqrt(E0 * E0 + 2 * E0 * m * c2) / c;
  const mh = 2 * ollie.handEff, M1 = Math.sqrt(m * m + mh * mh + 2 * gam * m * mh), E1 = (M1 - m - mh) * c2;
  const E2 = Math.sqrt(p * p * c2 + M1 * M1 * c2 * c2) - M1 * c2;
  const Mb = ollie.m - mh, Etot = E2 + M1 * c2 + Mb * c2, Mf = Math.sqrt(Etot * Etot - p * p * c2) / c2, uAfter = p * c2 / Etot;
  console.log('F', F.toExponential(2), 'D', D, anchor, L.result, 'v/c', (L.vArrive / c).toFixed(6), 'time', L.time, 'chord', L.chord, 'expected time', L.chord / L.vArrive);
  console.log('  pIn', k.pIn, p, '| E1', k.E1, E1, '| v1', k.v1, p * c2 / (M1 * c2 + E2), '| E2/Ediss', k.Ediss, anchor === 'bolted' ? E2 : 2 * Mb * E2 / (Mf + M1 + Mb), '| uAfter', k.uAfter, anchor === 'bolted' ? 0 : uAfter, '| carried', k.carried, '| Ecatch vs E0', k.Ecatch, E0, k.Ecatch / E0, '| clean', k.clean, 'tStroke', k.tStroke, 'shockPa', L.shockPa);
}
