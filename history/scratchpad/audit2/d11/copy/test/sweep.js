// Sweep every action across strengths, sizes, surfaces, modes and anchors; flag NaN/undefined/negative outputs.
global.window = {};
const P = require('../src/engine.js');
require('../src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const bad = [];
const scan = (label, obj, path = '') => {
  if (obj == null) return;
  if (typeof obj === 'number') { if (Number.isNaN(obj)) bad.push(label + ' ' + path + ' = NaN'); else if (obj < 0 && !/quake/i.test(path)) bad.push(label + ' ' + path + ' = ' + obj); return; }
  if (Array.isArray(obj)) return;
  if (typeof obj === 'object') for (const [k, v] of Object.entries(obj)) if (k !== 'path' && k !== 'gLoad') scan(label, v, path + '.' + k);
};
let n = 0;
const t0 = Date.now();
for (const lg of [1, 2, 2.708, 3, 4, 6, 9, 12, 15, 18, 21, 24, 27, 30, 34, Infinity]) {
  for (const mode of ['comic', 'real']) for (const H of [0.4, 2, 50]) for (const surface of D.surfaces) for (const anchor of ['friction', 'braced', 'bolted']) for (const groundHolds of [false, true]) {
    const body = P.makeBody({ H });
    const ctx = { F: isFinite(lg) ? Math.pow(10, lg) * g : Infinity, mode, body, surface, groundHolds, anchor };
    const L = `lg=${lg} ${mode} H=${H} ${surface.id} ${anchor} holds=${groundHolds}`;
    for (const o of D.objects) {
      scan(L + ' lift ' + o.id, P.lift(ctx, o));
      if (!o.noPull) scan(L + ' pull ' + o.id, P.pull(ctx, o));
      if (!o.noThrow && H === 2 && anchor !== 'braced') for (const a of [0, 45, 90]) scan(L + ' throw ' + o.id + ' ' + a, P.throwObject(ctx, o, a));
    }
    scan(L + ' jump', P.jump(ctx)); scan(L + ' stomp', P.stomp(ctx)); scan(L + ' punch', P.punch(ctx)); scan(L + ' clap', P.clap(ctx)); scan(L + ' sprint', P.sprint(ctx));
    n++;
  }
}
console.log('contexts', n, 'ms', Date.now() - t0, 'problems', bad.length);
console.log(bad.slice(0, 40).join('\n'));
