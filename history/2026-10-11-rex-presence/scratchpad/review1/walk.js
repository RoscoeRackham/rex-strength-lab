global.window = {};
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
const rex = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), ollie = P.makeBody(Object.assign({ build: 'ollie' }, P.DEFAULT_BODIES.ollie));
console.log('rex H m footArea footB', rex.H, rex.m, rex.footArea, rex.footB, 'ollie', ollie.H, ollie.m, ollie.footArea, ollie.footB);
const S = (id) => D.surfaces.find((s) => s.id === id);
console.log('surfaces', D.surfaces.map((s) => s.id + ':' + (s.qult||'') ).join(' '));
for (const e of [0, 0.5, 1]) {
  const st = P.walkStep(rex, S('sand'), { pace: 'walk', effort: e });
  console.log('effort', e, 'Eimp J', st.Eimp.toFixed(1), 'Fpulse/W', (st.Fpulse / st.W).toFixed(3), 'Tpulse ms', (st.Tpulse * 1000).toFixed(1), 'kLoad', st.kLoad.toFixed(3), 'v', st.v.toFixed(2), 'rate', st.stepRate.toFixed(2));
}
const s0 = P.walkStep(rex, S('sand'), { effort: 0 }), s5 = P.walkStep(rex, S('sand'), { effort: 0.5 });
console.log('soft/ordinary energy ratio', (s0.Eimp / s5.Eimp).toFixed(3), 'force ratio', (s0.Fpulse / s5.Fpulse).toFixed(3));
for (const id of ['sand', 'gravel', 'softclay', 'stiffclay']) {
  for (const [n, b] of [['rex', rex], ['ollie', ollie]]) {
    const st = P.walkStep(b, S(id), { effort: 0.5 });
    console.log(id, n, 'pressure kPa', (st.pressure / 1000).toFixed(0), 'q kPa', (st.q / 1000).toFixed(0), 'print', JSON.stringify(st.footprint));
  }
}
