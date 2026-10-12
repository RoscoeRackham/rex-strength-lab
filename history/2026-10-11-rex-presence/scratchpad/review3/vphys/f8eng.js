global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const sand = D.surfaces.find((s) => s.id === 'sand'), gravel = D.surfaces.find((s) => s.id === 'gravel');
for (const [nm, b] of [['rex', P.makeBody({ build: 'rex', H: 3.048, m: 3007 })], ['ollie', P.makeBody({ build: 'ollie', H: P.DEFAULT_BODIES.ollie.H, m: P.DEFAULT_BODIES.ollie.m })]]) {
  for (const s of [sand, gravel]) for (const e of [0, 0.5, 1]) {
    const st = P.walkStep(b, s, { pace: 'walk', effort: e });
    console.log(nm, s.id, 'effort', e, 'p kPa', (st.pressure / 1e3).toFixed(0), 'peak kPa', (st.peakPressure / 1e3).toFixed(0), 'print mm', (st.footprint.depth * 1e3).toFixed(1), st.footprint.kind, 'q kPa', (st.q / 1e3).toFixed(0));
  }
}
