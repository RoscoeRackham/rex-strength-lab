global.window = {};
const P = require('./engine-head.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
for (const anchor of ['friction', 'bolted']) for (const mode of ['comic', 'real']) {
  const c = { F: Infinity, mode, body: rex, surface: surf('concrete'), groundHolds: false, anchor };
  const r = P.throwObject(c, obj('baseball'), 0), p = P.punch(c), b = P.throwObject(c, obj('bus'), 45);
  console.log(anchor, mode, '| ball v/c', r.v / P.K.c, 'recoilV/c', r.recoilV / P.K.c, 'pB', r.push.pB, 'pA', r.push.pA, 't', r.push.t, 'Eobj', r.Eobj, '| punch recoilV/c', p.recoilV / P.K.c, 'pB', p.push.pB, '| bus v', b.v, 'recoilV', b.recoilV, 'pB', b.push.pB, 't', b.push.t);
}
