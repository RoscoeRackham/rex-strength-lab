const dir = process.argv[2];
global.window = {};
const P = require(dir + '/src/engine.js'); require(dir + '/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const ctxOf = (F, x) => Object.assign({ F, mode: 'comic', body: rex, surface: surf('concrete'), groundHolds: false, anchor: 'friction' }, x || {});
for (const [mv, x] of [['punch', { target: 10.4 }], ['clap', { target: 6 }], ['stomp', {}], ['jump', { target: 3 }]]) {
  const row = [5, 40, 200, 1000].map((near) => (P.RESTRAINT.planNow(mv, ctxOf(Infinity), Object.assign({ near }, x)).result('hazard:air').use / g).toPrecision(3));
  console.log(mv, row.join(' '));
}
