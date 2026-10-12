global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const rows = [];
const objs = D.objects.filter((o) => !o.noThrow).map((o) => o.id);
for (const mode of ['comic', 'real']) for (const sid of D.surfaces.map((s) => s.id)) {
  const moves = [['jump', { target: 3 }]].concat(objs.map((id) => ['throw', { obj: obj(id), angle: 45, target: 30 }]));
  for (const [mv, o] of moves) {
    const c = { F: Infinity, mode, body: rex, surface: surf(sid), groundHolds: false, anchor: 'friction' };
    for (const pre of ['least', 'ceiling']) {
      const p = P.RESTRAINT.plan(mv, c, Object.assign({ near: 5 }, o));
      const t0 = Date.now(); if (pre === 'least') p.goal(); else p.ceiling(); const t = Date.now() - t0;
      rows.push([t, mode, sid, mv, o.obj ? o.obj.id : '', pre, p.runs()]);
    }
  }
}
rows.sort((a, b) => b[0] - a[0]);
for (const r of rows.slice(0, 20)) console.log(r.join(' '));
