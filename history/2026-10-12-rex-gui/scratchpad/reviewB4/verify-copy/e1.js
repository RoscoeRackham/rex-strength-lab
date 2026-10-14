const R = __dirname + '/repo/rex-strength-lab/src/';
const P = require(R + 'engine.js'); global.window = {}; require(R + 'data.js'); const D = window.DINO_DATA;
const g = P.K.g;
const mk = (b, kg, o) => Object.assign({ F: kg * g, mode: 'comic', body: P.makeBody({ build: b, H: b === 'rex' ? 3.048 : 3.06, m: 3007 }), surface: D.surfaces.find(s => s.id === (o && o.sf || 'concrete')), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true }, o || {});
const show = (lbl, t) => { const tg = (x) => x ? { J: x.J, T: x.T, supplied: x.supplied } : x;
  const out = { result: t.result, v: t.v, toGroundT: tg(t.toGroundT), toGroundC: tg(t.toGroundC), hand: t.hand ? Object.keys(t.hand) : t.hand, keys: Object.keys(t).join(',') };
  for (const k of ['toGroundT', 'toGroundC']) if (t[k]) { const src = P.impulseSource(D.surfaces.find(s => s.id === 'concrete'), t[k].J, t[k].T); out[k + '_ppv5mm'] = src ? (P.ppvAt ? P.ppvAt(src, 5) * 1000 : null) : null; out[k + '_feel'] = src ? P.ppvReach(src, P.VIB.TH.feel) : null; out[k+'_plaster'] = src ? P.plasterReach(src) : null; }
  console.log(lbl, JSON.stringify(out, null, 0)); };
const rex = mk('rex', 100 * 907.18474), ol = mk('ollie', 100 * 907.18474);
show('default easy 10m', P.tossPartner(rex, ol.body, 'Ollie', 'easy', 10, 'friction'));
const r8 = mk('rex', 1e8), o8 = mk('ollie', 1e8);
show('1e8 hard 1e4', P.tossPartner(r8, o8.body, 'Ollie', 'hard', 1e4, 'friction'));
const r20 = mk('rex', 1e20, { airAbsorb: 0.5 }), o20 = mk('ollie', 1e20, { airAbsorb: 0.5 });
show('1e20 hard 50%', P.tossPartner(r20, o20.body, 'Ollie', 'hard', 10, 'friction'));
console.log('VIB TH', JSON.stringify(P.VIB.TH));
