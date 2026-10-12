const { P, D, g, surf, obj, ctxOf } = require('./eng.js');
for (const [kg, sf, use] of [[90718, 'concrete', 23000], [90718, 'concrete', undefined], [1e9, 'concrete', undefined], [1e9, 'sand', 225000]]) {
  const c = ctxOf(kg, { surface: surf(sf), softLanding: true });
  const r = P.jump(Object.assign({}, c, use ? { use: use * g } : {}));
  const L = r.landing;
  console.log(sf, kg, use, 'v', L.v.toFixed(2), 'E (page shows)', (L.E / 1e3).toFixed(1), 'kJ; absorbed (engine)', (L.absorbed / 1e3).toFixed(2), 'kJ; ratio', L.ratio.toFixed(3));
}
