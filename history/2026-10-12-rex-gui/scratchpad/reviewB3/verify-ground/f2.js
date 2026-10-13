const { P, surf, ctx } = require('./common.js');
const cc = surf('concrete');
for (const [kgR, useO] of [[1e8, 1e4 * P.K.g], [1e10, 1e4 * P.K.g]]) {
  const cR = ctx(kgR, {});
  const cO = ctx(1e4, {});
  // find Rex's effort: at 1e10 dial, page least disruptive is 0.19% (18,600 t)
  if (kgR === 1e10) cR.F = 18600e3 * P.K.g;
  const r = P.armWrestle(cR, cO);
  const T = P.limbPulse(cR.body);
  console.log('dial', kgR, 'outcome', r.outcome, 'tableBreaks', r.tableBreaks, 'pin', r.pin && { t_ms: (r.pin.t*1e3).toFixed(2), v: r.pin.v.toFixed(0), M: r.pin.M.toFixed(1), s: r.pin.s.toFixed(3) }, 'limbPulse ms', (T*1e3).toFixed(1));
  const src = P.impulseSource(cc, r.toGround.J, r.toGround.T);
  console.log('  toGround J', r.toGround.J.toExponential(3), 'T', r.toGround.T.toFixed(4), 'peak 2J/T', (2*r.toGround.J/r.toGround.T).toExponential(2), 'ppv@5', (P.ppvAt(src,5)*1e3).toFixed(1), 'mm/s plasterOver5', P.plasterOver(src,5), 'reach', P.plasterReach(src).toFixed(2));
  // doublet estimate: constant-acceleration swing (-p over tp) then slam (+p at tp): moment = p tp/2 = M s
  const p = r.toGround.J, tp = r.pin.t, mom = p * tp / 2;
  const Fd = mom * 2 * Math.PI / (T * T);
  // numerically: ground load g(t) = conv(swing+slam, Hann(T)/area): peak
  const N = 20000, dt = (T + tp) / N; let peak = 0;
  const hann = (t) => (t < 0 || t > T) ? 0 : (1 - Math.cos(2 * Math.PI * t / T)) / T;
  // F(t) = sum over source impulses: swing distributed uniform -p/tp on [0,tp], slam +p at tp
  for (let i = 0; i <= N; i++) { const t = i * dt; let f = p * hann(t - tp); const M = 200; for (let k = 0; k < M; k++) { const ts = (k + 0.5) * tp / M; f -= (p / M) * hann(t - ts); } peak = Math.max(peak, Math.abs(f)); }
  console.log('  doublet moment', mom.toFixed(1), 'kg m  (M s =', (r.pin.M * r.pin.s).toFixed(1), ') est peak', Fd.toExponential(2), 'N  numeric peak of net load', peak.toExponential(2), 'N  ratio single/doublet', (2*p/T/peak).toFixed(1));
  // ppv of a hann source with the doublet's peak (rough, same T)
  const sd = { kind: 'hann', F: peak, T, ground: src.ground };
  console.log('  ppv@5 with that peak (rough)', (P.ppvAt(sd, 5) * 1e3).toFixed(2), 'mm/s; plaster limit at 1/T', (P.plasterLimitHz(1/T)*1e3).toFixed(1));
}
