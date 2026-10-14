const { P, rex, surf, obj } = require('./h.js');
const car = obj('car');
for (const s of [0, 0.5, 0.9, 0.99]) {
  const c = { F: 1e15 * P.K.g, mode: 'comic', body: rex, surface: surf('concrete'), anchor: 'friction', airAbsorb: s, keepForm: true, unbreakable: true, ownRecoil: true };
  const r = P.throwObject(c, car, 0);
  const o = Object.assign({}, c, { obj: car, angle: 0 });
  const b = P.RESTRAINT.MOVES.throw.blastParts(r, o);
  const E = r.Eobj, m = car.m, gm1 = E / (m * P.K.c ** 2), unit = m / (P.K.rho0 * car.area), k = 1 - s;
  const keepAt = (xx) => { const S = Math.sqrt((1 + xx) ** 2 + 2 * gm1 * xx); return (gm1 + 2) / (S * (1 + xx + gm1 + S)); };
  const within = (L) => 1 - keepAt(k * L / unit);
  const Eb = Math.max(b.land, b.path);
  console.log(JSON.stringify({ s, E: E.toExponential(3), blastCounted: Eb.toExponential(3), reach100Pa_km: +(P.blastRadius(Eb, 100) / 1e3).toFixed(0), reachIfAllE_km: +(P.blastRadius(E, 100) / 1e3).toFixed(0),
    fracWithin: { '5m': +within(5).toFixed(4), '100m': +within(100).toFixed(4), '1km': +within(1e3).toFixed(4), '10km': +within(1e4).toFixed(4), '50km': +within(5e4).toFixed(4) } }));
}
