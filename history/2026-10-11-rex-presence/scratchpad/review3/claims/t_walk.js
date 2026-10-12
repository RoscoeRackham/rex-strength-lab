const { P, D, g, surf, obj, ctxOf } = require('./eng.js');
const b = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex));
for (const sf of ['concrete', 'sand', 'stiffclay', 'gravel', 'granite', 'asphalt']) {
  const row = [];
  for (const [pace, eff] of [['walk', 0], ['walk', 0.5], ['fast', 0.5], ['fast', 1]]) {
    const pr = P.presence(b, surf(sf), { pace, effort: eff, groundHolds: false });
    row.push(pace + '/' + eff + ': ' + (pr.ppv(5) * 1000).toFixed(2) + ' mm/s@5m');
  }
  console.log(sf, row.join('  '));
}
console.log(P.VIB.TH);
