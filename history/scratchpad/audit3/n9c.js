global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const body = P.makeBody({});
const surface = D.surfaces.find((s) => s.id === 'concrete');
const hits = [];
for (const o of D.objects) for (const ang of [0, 10, 45, 80]) for (let lg = 4; lg <= 34; lg += 0.5) {
  const r = P.throwObject({ F: Math.pow(10, lg) * g, mode: 'comic', body, surface, groundHolds: false, anchor: 'friction' }, o, ang);
  if (r.flight && r.flight.landed && r.crater > 3e5 && !r.planetScale) hits.push([o.id, ang, lg, (r.crater/1000).toFixed(0)+'km', r.Eimpact.toExponential(2)].join(' '));
}
console.log(hits.length); console.log(hits.slice(0, 30).join('\n'));
