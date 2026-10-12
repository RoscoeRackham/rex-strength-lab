global.window = {};
for (const v of ['head/rex-strength-lab', 'mut/PACE2']) {
  delete require.cache[require.resolve('./' + v + '/src/engine.js')];
  const P = require('./' + v + '/src/engine.js'); require('./' + v + '/src/data.js');
  const D = window.DINO_DATA, rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
  const out = [];
  for (const sid of ['concrete', 'sand']) for (const e of [0, 0.5]) out.push(sid + ' e' + e + ': ' + ['stroll', 'walk', 'brisk', 'fast'].map((p) => (P.presence(rex, D.surfaces.find((s) => s.id === sid), { pace: p, effort: e }).ppv(5) * 1000).toPrecision(3)).join(' / ') + ' mm/s');
  console.log(v, '\n  ' + out.join('\n  '));
}
