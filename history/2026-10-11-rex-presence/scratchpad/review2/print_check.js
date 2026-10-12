global.window = global;
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
const D = global.DINO_DATA;
const sand = D.surfaces.find((s) => s.id === 'sand');
for (const who of ['rex', 'ollie']) {
  const body = P.makeBody(Object.assign({build: who}, P.DEFAULT_BODIES[who]));
  const out = [];
  for (const pace of ['stroll', 'walk', 'brisk', 'fast']) {
    const st = P.walkStep(body, sand, { pace, effort: 0 });
    out.push(pace + ': p=' + (st.pressure / 1000).toFixed(0) + ' kPa depth=' + (st.footprint.depth * 100).toFixed(2) + ' cm (' + st.footprint.kind + ')');
  }
  console.log(who, 'footArea', body.footArea, 'footB', body.footB.toFixed(3), '\n  ' + out.join('\n  '));
}
// Schanz anchor check: elephant forefoot 0.075 m2? B=0.274; p=350 kPa -> 18 mm
