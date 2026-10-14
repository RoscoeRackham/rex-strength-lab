// load engine from a tree (new|old)
module.exports = function load(tree) {
  const base = __dirname + '/' + tree + '/rex-strength-lab/src/';
  global.window = {};
  for (const k of Object.keys(require.cache)) if (k.startsWith(base)) delete require.cache[k];
  const P = require(base + 'engine.js'); require(base + 'data.js');
  const D = window.DINO_DATA;
  const g = P.K.g;
  const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
  const conc = D.surfaces.find((s) => s.id === 'concrete');
  const obj = (id) => D.objects.find((o) => o.id === id);
  const ctxOf = (kg, pw) => Object.assign({ F: kg * g, mode: 'comic', body: rex, surface: conc, anchor: 'friction' }, pw || {});
  return { P, D, g, rex, conc, obj, ctxOf };
};
