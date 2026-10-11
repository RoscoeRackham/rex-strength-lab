global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA; const g = P.K.g;
const body = P.makeBody({ H: 2, m: 180 });
const S = (id) => D.surfaces.find((s) => s.id === id), O = (id) => D.objects.find((o) => o.id === id);
for (const [kg, s, a, o, m] of [[1e34,'granite','braced','baseball','real'],[90718.474,'concrete','friction','shot','real'],[90718.474,'sand','friction','baseball','real'],[90718.474,'concrete','friction','shot','comic'],[90718.474,'concrete','friction','car','comic'],[90718.474,'sand','friction','car','comic']]) {
  const r = P.throwObject({ F: kg*g, mode: m, body, surface: S(s), groundHolds: false, anchor: a }, O(o), 45);
  console.log(m, kg, s, a, o, 'sinkRatio', r.sinkRatio);
}
