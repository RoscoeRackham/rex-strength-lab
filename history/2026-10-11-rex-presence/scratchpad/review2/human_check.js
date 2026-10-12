global.window = global;
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
const D = global.DINO_DATA;
const sand = D.surfaces.find((s) => s.id === 'sand');
console.log('sand', JSON.stringify(sand).slice(0, 300));
const human = P.makeBody({ H: 1.75, m: 76.7 });
const rex = P.DEFAULT_BODIES ? P.DEFAULT_BODIES : null;
console.log('defaults', Object.keys(P.DEFAULT_BODIES || {}));
for (const [name, body] of [['human 1.75 m 76.7 kg', human], ['Rex', P.makeBody(P.DEFAULT_BODIES.rex || P.DEFAULT_BODIES.Rex || {})]]) {
  for (const e of [0, 0.5]) {
    const pr = P.presence(body, sand, { pace: 'walk', effort: e });
    const st = pr.step;
    console.log(name, 'effort', e, 'H', body.H.toFixed(3), 'm', body.m.toFixed(0), 'Fpulse/W', (st.Fpulse / st.W).toFixed(3), 'T ms', (st.Tpulse * 1000).toFixed(1),
      'PPV@20m mm/s', (pr.ppv(20) * 1000).toExponential(2), 'PPV@53m mm/s', (pr.ppv(53) * 1000).toExponential(2), 'ratio to elephant@20', (pr.ppv(20) / P.elephantPPV(20)).toFixed(1));
  }
}
