global.window = {};
const P0 = require('./wt/src/engine.js');
const P1 = require('./mod/engine_soft051.js');
require('./wt/src/data.js'); const D = window.DINO_DATA;
const s = (id) => D.surfaces.find((x) => x.id === id);
for (const P of [P0, P1]) {
  const b = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
  for (const sid of ['concrete', 'sand', 'granite']) {
    const pr = P.presence(b, s(sid), { pace: 'walk', effort: 0 });
    const TH = P.walkThresholds(pr.step);
    const v = pr.ppv(3), vH = pr.ppvH(3);
    const hit = Object.keys(TH).filter((k) => (P.VIB.HORIZ[k] ? vH : v) >= TH[k]);
    console.log('SOFT', P.WALK.SOFT, sid, 'PPV@3 mm/s', (v*1e3).toFixed(3), 'H', (vH*1e3).toFixed(3), 'hits', hit.join(','), 'shimmer reach', pr.reach.shimmer.toFixed(1), 'feel reach', pr.reach.feel.toFixed(1));
  }
}
