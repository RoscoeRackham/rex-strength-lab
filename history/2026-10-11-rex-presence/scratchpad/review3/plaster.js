global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
console.log(D.objects.map(o=>o.id+':'+o.m).join(' '));
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const surf = (id) => D.surfaces.find((s) => s.id === id);
const obj = (id) => D.objects.find((o) => o.id === id);
const run = (label) => {
  for (const id of ['baseball','bowling','anvil','piano','car']) {
    if (!obj(id)) continue;
    const c = { F: 1e5 * g, mode: 'comic', body: rex, surface: surf('concrete'), groundHolds: false, anchor: 'friction' };
    const p = P.RESTRAINT.planNow('throw', c, { near: 5, obj: obj(id), angle: 45, target: 30 });
    const h = p.result('hazard:plaster'), pr = p.result('preset:plaster');
    const ce = p.ceiling ? p.ceiling() : null;
    console.log(label, id, 'plaster hazard onset use(kg)=', h.never ? 'never' : (h.use / g).toPrecision(3), ' ceiling', ce ? JSON.stringify({use: ce.use && (ce.use/g).toPrecision(3), by: ce.by}) : '');
  }
};
run('engine(50.8>40Hz)');
P.VIB.plasterHigh = P.VIB.TH.plaster;
run('if 12.7 everywhere');
