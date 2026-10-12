global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
for (const sid of ['sand','stiffclay','granite','concrete']) {
  const s = D.surfaces.find((x) => x.id === sid);
  for (const e of [0, 0.5, 1]) { const pr = P.presence(rex, s, { effort: e }); console.log(sid, e, [1,3,10,100].map(d => (pr.ppv(d)*1000).toPrecision(2)).join(' / '), 'mm/s at 1/3/10/100 m'); }
}
const st = P.walkStep(rex, D.surfaces.find(x=>x.id==='concrete'), {effort:1});
console.log('stamp Fpulse/W', (st.Fpulse/st.W).toFixed(2), 'T', st.Tpulse.toFixed(4), 'Hz', (1/st.Tpulse).toFixed(1));
